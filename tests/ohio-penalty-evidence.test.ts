import { groupOhioPenaltyResearch } from "../scripts/data-review/ohio-discovery/penalty-groups";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { extractOhioLocalGrades, extractOhioOffences, extractOhioPenaltyLinkages } from "../scripts/data-review/ohio-discovery/offense-extractor";
import { resolveRecordedRange } from "../scripts/data-review/recorded-range";
import { classifyOhioOffenses } from "../scripts/data-review/classify-ohio-offenses";
import { reconcileOhioCatalog, OHIO_MECHANICAL_VERDICTS } from "../scripts/data-review/reconcile-ohio-catalog";
import { assertParserUpgradeAllowed } from "../scripts/data-review/acquire-ohio-code";
import { interpretOhioSectionStatus } from "../scripts/data-review/ohio-discovery/section-status";

describe("Ohio unnamed grade evidence", () => {
  it("captures a local grade without synthesizing an offense name", () => {
    const text = "(D)(1) Whoever violates division (A) or (B) of this section is guilty of a misdemeanor of the first degree.";
    expect(extractOhioOffences(text, "4510.11")).toEqual([]);
    const grades = extractOhioLocalGrades(text);
    expect(grades).toHaveLength(1);
    expect(grades[0]).toMatchObject({ kind: "misdemeanor", degree: "first", applicability: "unresolved" });
    for (const span of [grades[0].span, grades[0].context]) expect(span.text).toBe(text.slice(span.start, span.end));
  });
  it("retains repeat-offense context and multiple grades without deduplicating conditions", () => {
    const text = "Whoever violates this section is guilty of a minor misdemeanor on a first offense and a misdemeanor of the fourth degree on each subsequent offense.";
    const grades = extractOhioLocalGrades(text);
    expect(grades.map(row => row.degree)).toEqual([null, "fourth"]);
    expect(grades.every(row => row.context.text.includes("subsequent offense"))).toBe(true);
  });
  it("handles explicit violation grades and compact paragraph boundaries", () => {
    const text = "(B) No person shall act.(C) A violation of this section is a misdemeanor of the fourth degree, except that the violation is a misdemeanor of the first degree if serious harm occurs.";
    const grades = extractOhioLocalGrades(text);
    expect(grades.map(row => row.degree)).toEqual(["fourth", "first"]);
    expect(grades[0].context.text.startsWith("(C)")).toBe(true);
  });
  it.each([
    ["Whoever recklessly violates this section is guilty of a minor misdemeanor.", null],
    ["Whoever violates this section shall be removed from office, shall be liable, with the violator's bonder in damages to the person injured by the disclosure of information, and is guilty of a felony of the fourth degree.", "fourth"],
    ["Whoever violates division (B) of this section is guilty of a misdemeanor in the third degree.", "third"],
  ])("observes source wording variants while retaining the complete condition", (text, degree) => {
    const [grade] = extractOhioLocalGrades(text!);
    expect(grade.degree).toBe(degree);
    expect(grade.context.text).toBe(text);
  });
  it.each([
    "Whoever violates that rule is guilty of a misdemeanor of the first degree.",
    "WHOEVER COMMITS ELECTION FALSIFICATION IS GUILTY OF A FELONY OF THE FIFTH DEGREE.",
    "Whoever violates section 102.01 of the Revised Code is guilty of a misdemeanor of the first degree.",
    "Whoever violates this section is guilty of example crime. Example crime is a felony of the fifth degree.",
    "A violation of this section is not a misdemeanor of the first degree.",
    "The definition of misdemeanor of the first degree applies in this section.",
  ])("does not reclassify external, named, negated or definitional text as unnamed local grades", text => {
    expect(extractOhioLocalGrades(text)).toEqual([]);
  });
});

describe("Ohio external penalty relationships", () => {
  it("recovers adjacent divisions and retains actor qualifications", () => {
    const text = "(B) Whoever violates section 3767.12 or, being an association, violates section 3767.30 of the Revised Code is guilty of a misdemeanor of the fourth degree.(C) Whoever violates section 3767.13, 3767.19, or 3767.32 or, being a natural person, violates section 3767.30 of the Revised Code is guilty of a misdemeanor of the third degree.";
    const links = extractOhioPenaltyLinkages(text, "3767.99");
    expect(links).toHaveLength(2);
    expect(links[1].targetSections).toContain("3767.32");
    expect(links[1].requiresApplicabilityReview).toBe(true);
    expect(links[1].context.text).toContain("being a natural person");
    expect(links[1].span.text).toBe(text.slice(links[1].span.start, links[1].span.end));
  });
  it("separates ranges from explicit references and preserves the full repeat-offense clause", () => {
    const text = "Whoever violates sections 907.01 to 907.17, 907.27 through 907.35, or section 907.41 of the Revised Code is guilty of a misdemeanor of the fourth degree on a first offense; on each subsequent offense such person is guilty of a misdemeanor of the third degree.";
    const [link] = extractOhioPenaltyLinkages(text, "907.99");
    expect(link.targetSections).toEqual(["907.41"]);
    expect(link.ranges.map(row => [row.from, row.to])).toEqual([["907.01", "907.17"], ["907.27", "907.35"]]);
    expect(link.context.text).toBe(text);
    for (const range of link.ranges) expect(range.span.text).toBe(text.slice(range.span.start, range.span.end));
  });
  it("does not treat 'first degree' alone as a first-offense condition", () => {
    expect(extractOhioPenaltyLinkages("Whoever violates section 102.01 of the Revised Code is guilty of a misdemeanor of the first degree.", "102.99")[0].requiresApplicabilityReview).toBe(false);
  });
  it("uses recorded membership and suffixes, and refuses missing/reversed/duplicate bounds", () => {
    const order = ["102.01", "102.011", "102.02", "102.03"];
    expect(resolveRecordedRange(order, "102.01", "102.02").members).toEqual(order.slice(0, 3));
    expect(resolveRecordedRange(order, "102.01", "102.04")).toMatchObject({ status: "missing_endpoint", members: [], missing: ["102.04"] });
    expect(resolveRecordedRange(order, "102.03", "102.01").status).toBe("reversed_order");
    expect(() => resolveRecordedRange([...order, "102.01"], "102.01", "102.03")).toThrow(/Duplicate/);
  });
});

describe("Evidence pipeline safety and reviewer usability", () => {
  function fixture() {
    const dir = mkdtempSync(join(tmpdir(), "ohio-penalties-")); const cacheDir = join(dir, "cache"); mkdirSync(cacheDir);
    const entries = [
      ["102.01", "[Repealed effective 10/09/2026] Program", "No person shall act. Whoever violates this section is guilty of a misdemeanor of the first degree."],
      ["102.011", "Definitions", "A statement is a record."],
      ["102.02", "Future version", "No person shall act."],
      ["102.03", "Example", "No person shall act. Whoever violates this section is guilty of example offense."],
      ["102.99", "Penalty", "Whoever violates sections 102.01 to 102.02 of the Revised Code is guilty of a misdemeanor of the fourth degree."],
    ];
    const sections = entries.map(([section, catchline, text]) => ({ section, chapter: "102", catchline, text,
      sourceUrl: `https://codes.ohio.gov/ohio-revised-code/section-${section}`,
      contentHash: createHash("sha256").update(text).digest("hex"), repealed: false,
      effectiveDate: section === "102.02" ? "2027-01-01" : "2020-01-01",
      sourceStatus: interpretOhioSectionStatus(catchline, text, section === "102.02" ? "2027-01-01" : "2020-01-01", "2026-09-23"),
    }));
    const chapter = { chapterNumber: "102", titleNumber: "1", retrievedAt: "2026-09-23T00:00:00Z", parserVersion: 2, sections };
    const enumeration = { schemaVersion: 1, parserVersion: 2, discoveryKind: "official_ohio_revised_code_section_enumeration", publicationStatus: "discovery_only_not_published", generatedAt: chapter.retrievedAt,
      failures: [], totals: { chaptersAcquired: 1, chaptersFailed: 0, sections: sections.length },
      chapters: [{ ...chapter, sections: undefined, sectionCount: sections.length }],
      sections: sections.map(({ text, ...row }) => ({ ...row, titleNumber: "1", textLength: text.length })),
    };
    writeFileSync(join(cacheDir, "chapter-102.json"), JSON.stringify(chapter));
    const enumerationPath = join(dir, "enumeration.json"); writeFileSync(enumerationPath, JSON.stringify(enumeration));
    const report = classifyOhioOffenses({ cacheDir, enumerationPath });
    const inventoryPath = join(dir, "inventory.json"); writeFileSync(inventoryPath, JSON.stringify({ ...report, sections: report.sections.filter(row => row.classification !== "supporting") }));
    return { dir, cacheDir, enumerationPath, inventoryPath, report };
  }
  it("surfaces scheduled repeals, excludes held versions and does not assign range grades", () => {
    const f = fixture(); try {
      expect(f.report.accounting.scheduledRepeals).toMatchObject([{ section: "102.01", transitionDate: "2026-10-09" }]);
      expect(f.report.accounting.sourceStatusHolds.map(row => row.section)).toEqual(["102.02"]);
      expect(f.report.sections.find(row => row.section === "102.01")?.classification).toBe("local_grade_candidate");
      expect(f.report.sections.find(row => row.section === "102.011")).toMatchObject({ classification: "penalty_range_candidate", externalGrades: [] });
      expect(f.report.accounting.penaltyRanges[0].heldMembers).toEqual(["102.02"]);
      expect(f.report.sections.find(row => row.section === "102.02")?.penaltyRangeIds).toEqual([]);
    } finally { rmSync(f.dir, { recursive: true, force: true }); }
  });
  it("gives unresolved rows source context and only review-level exact-name alternatives", () => {
    const f = fixture(); try {
      const rows = reconcileOhioCatalog({ ...f, catalog: [
        { id: "local", name: "Legacy label", code: "102.01", jurisdiction: "OH" },
        { id: "wrong", name: "example offense", code: "102.011", jurisdiction: "OH" },
        { id: "held", name: "Future label", code: "102.02", jurisdiction: "OH" },
      ] }).rows;
      expect(rows.every(row => row.evidence && !OHIO_MECHANICAL_VERDICTS.has(row.verdict))).toBe(true);
      expect(rows.find(row => row.chargeId === "wrong")).toMatchObject({ verdict: "citation_candidates", section: "102.011", statutoryName: null, candidateNames: ["example offense (102.03)"] });
    } finally { rmSync(f.dir, { recursive: true, force: true }); }
  });
  it("warns once when missing source caches leave reviewer excerpts unavailable", () => {
    const f = fixture(); const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      rmSync(f.cacheDir, { recursive: true, force: true });
      const result = reconcileOhioCatalog({ ...f, catalog: [
        { id: "one", name: "Old label", code: "102.011", jurisdiction: "OH" },
        { id: "two", name: "Other label", code: "102.02", jurisdiction: "OH" },
      ] });
      expect(result.rows.every(row => row.evidence === null)).toBe(true);
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0][0]).toMatch(/some reviewer evidence excerpts.*acquire-ohio-code/);
    } finally { warning.mockRestore(); rmSync(f.dir, { recursive: true, force: true }); }
  });
  it("groups range evidence once while preserving definition and held-version targets", () => {
    const f = fixture();
    try {
      const chapter = JSON.parse(readFileSync(join(f.cacheDir, "chapter-102.json"), "utf8"));
      const sources = new Map<string, any>(chapter.sections.map((row: any) => [row.section, row]));
      const result = groupOhioPenaltyResearch(f.report.sections, f.report.accounting.penaltyRanges, sources, []);
      expect(result.totals).toMatchObject({ clauseGroups: 1, targetRelationships: 3, repeatedClauseReadsAvoidable: 2 });
      expect(result.sourceBatches[0].clauseIds).toEqual([result.groups[0].id]);
      const group = result.groups[0];
      expect(group.targets.find(row => row.section === "102.011")?.directEvidence).toEqual([]);
      expect(group.targets.find(row => row.section === "102.02")?.sourceStatus?.kind).toBe("not_yet_effective");
      for (const target of group.targets) expect(target.context.text).toBe(sources.get(target.section).text.slice(target.context.start, target.context.end));
      sources.get("102.99").text += "changed";
      expect(() => groupOhioPenaltyResearch(f.report.sections, f.report.accounting.penaltyRanges, sources, [])).toThrow(/does not match/);
    } finally { rmSync(f.dir, { recursive: true, force: true }); }
  });
  it("stops parser upgrades before acquisition unless network fallback was explicitly chosen", () => {
    const dir = mkdtempSync(join(tmpdir(), "ohio-upgrade-")); const file = join(dir, "cache.json");
    try {
      writeFileSync(file, JSON.stringify({ parserVersion: 1 }));
      expect(() => assertParserUpgradeAllowed(file)).toThrow(/No source requests/);
      expect(() => assertParserUpgradeAllowed(file, true)).not.toThrow();
      writeFileSync(file, JSON.stringify({ parserVersion: 2 })); expect(() => assertParserUpgradeAllowed(file)).not.toThrow();
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
