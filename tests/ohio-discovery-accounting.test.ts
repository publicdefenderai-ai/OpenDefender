import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { classifyOhioOffenses } from "../scripts/data-review/classify-ohio-offenses";
import { OHIO_MECHANICAL_VERDICTS, reconcileOhioCatalog } from "../scripts/data-review/reconcile-ohio-catalog";
import { validateOhioSnapshot, type OhioCachedChapter, type OhioEnumeration } from "../scripts/data-review/ohio-discovery/snapshot-accounting";
import { interpretOhioSectionStatus } from "../scripts/data-review/ohio-discovery/section-status";

const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const temporary: string[] = [];
afterEach(() => { for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true, force: true }); });

function fixture() {
  const chapter: OhioCachedChapter = {
    chapterNumber: "102", titleNumber: "1", retrievedAt: "2026-09-23T00:00:00.000Z",
    sections: [
      ["102.01", "Every covered officer must file the required statement."],
      ["102.02", "No person shall disclose a protected statement."],
      ["102.03", "In this chapter, statement means the required disclosure."],
      ["102.04", "No person shall interfere with a filing."],
      ["102.05", "Repealed."],
      ["102.99", "Whoever violates section 102.01 of the Revised Code is guilty of a misdemeanor of the first degree. " +
        "Whoever violates section 102.02 of the Revised Code is guilty of a felony of the fifth degree. " +
        "Whoever violates section 102.05 of the Revised Code is guilty of a misdemeanor of the first degree. " +
        "Whoever violates section 102.88 of the Revised Code is guilty of a misdemeanor of the first degree."],
    ].map(([section, text]) => ({
      section, chapter: "102", catchline: section === "102.99" ? "Penalty" : "Example provision",
      sourceUrl: `https://codes.ohio.gov/ohio-revised-code/section-${section}`,
      effectiveDate: "2020-01-01", text, contentHash: hash(text), repealed: section === "102.05",
    })),
  };
  const enumeration: OhioEnumeration = {
    schemaVersion: 1, discoveryKind: "official_ohio_revised_code_section_enumeration",
    publicationStatus: "discovery_only_not_published", generatedAt: chapter.retrievedAt,
    totals: { chaptersAcquired: 1, chaptersFailed: 0, sections: chapter.sections.length }, failures: [],
    chapters: [{ chapterNumber: "102", titleNumber: "1", sectionCount: chapter.sections.length, retrievedAt: chapter.retrievedAt }],
    sections: chapter.sections.map(({ text, ...row }) => ({ ...row, titleNumber: "1", textLength: text.length })),
  };
  return { chapter, enumeration };
}

function files() {
  const dir = mkdtempSync(join(tmpdir(), "ohio-accounting-")); temporary.push(dir);
  const { chapter, enumeration } = fixture();
  const cacheDir = join(dir, "cache");
  // The cache directory must contain only chapters, not report files.
  mkdirSync(cacheDir);
  writeFileSync(join(cacheDir, "chapter-102.json"), JSON.stringify(chapter));
  const enumerationPath = join(dir, "enumeration.json");
  writeFileSync(enumerationPath, JSON.stringify(enumeration));
  return { dir, chapter, enumeration, cacheDir, enumerationPath };
}

describe("Ohio section snapshot accounting", () => {
  it("reports a missing enumeration with an acquisition instruction", () => {
    const paths = files();
    expect(() => classifyOhioOffenses({ ...paths, enumerationPath: join(paths.dir, "missing.json") })).toThrow(/Acquire the Ohio code first; no enumeration/);
  });

  it("validates v2 status evidence and holds future-effective sources and penalty links", () => {
    const paths = files();
    paths.chapter.parserVersion = paths.enumeration.parserVersion = 2;
    paths.chapter.sections[0].effectiveDate = "2027-01-01";
    for (const row of paths.chapter.sections) {
      row.sourceStatus = interpretOhioSectionStatus(row.catchline, row.text, row.effectiveDate, "2026-09-23");
    }
    paths.enumeration.sections = paths.chapter.sections.map(({ text, ...row }) => ({ ...row, titleNumber: "1", textLength: text.length }));
    const save = () => {
      writeFileSync(join(paths.cacheDir, "chapter-102.json"), JSON.stringify(paths.chapter));
      writeFileSync(paths.enumerationPath, JSON.stringify(paths.enumeration));
    };
    save();
    const report = classifyOhioOffenses(paths);
    expect(report.sections.find(row => row.section === "102.01")).toMatchObject({ classification: "supporting", externalGrades: [], offences: [] });
    expect(report.accounting.sourceStatusHolds.map(row => row.section)).toContain("102.01");
    expect(report.accounting.unresolvedPenaltyTargets.find(row => row.section === "102.01")?.reason).toBe("source_status_unresolved");
    paths.chapter.sections[0].sourceStatus!.kind = "operative_text";
    paths.enumeration.sections[0].sourceStatus!.kind = "operative_text";
    save();
    expect(() => classifyOhioOffenses(paths)).toThrow(/source status/);
    paths.chapter.parserVersion = 1; save();
    expect(() => classifyOhioOffenses(paths)).toThrow(/parser versions/);
  });

  it("retains a penalty-linked duty as unresolved even without recognized prohibition wording", () => {
    const paths = files();
    const result = classifyOhioOffenses(paths);
    const candidate = result.sections.find(row => row.section === "102.01")!;
    expect(candidate.classification).toBe("penalty_linked_candidate");
    expect(candidate.offences).toEqual([]);
    expect(candidate.externalGrades[0]).toMatchObject({
      gradedBy: "102.99", sourceHash: paths.chapter.sections.at(-1)!.contentHash,
      sourceUrl: "https://codes.ohio.gov/ohio-revised-code/section-102.99",
    });
    const span = candidate.externalGrades[0].span;
    expect(paths.chapter.sections.at(-1)!.text.slice(span.start, span.end)).toBe(span.text);
    expect(result.sections.find(row => row.section === "102.02")!.classification).toBe("externally_graded_prohibition");
    expect(result.sections.find(row => row.section === "102.03")!.classification).toBe("supporting");
    expect(result.sections.find(row => row.section === "102.04")!.classification).toBe("prohibition_only");
    expect(result.accounting.classifiedSections).toBe(paths.enumeration.sections.length);
    expect(result.accounting.unresolvedPenaltyTargets.map(row => [row.section, row.reason])).toEqual([
      ["102.05", "repealed_or_reserved"], ["102.88", "absent_from_snapshot"],
    ]);
    expect(result.sections.find(row => row.section === "102.05")!.externalGrades).toEqual([]);
  });

  it.each([
    ["missing chapter", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c.splice(0); }],
    ["duplicate chapter", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c.push(c[0]); }],
    ["missing section", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].sections.pop(); }],
    ["duplicate section", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].sections[1] = c[0].sections[0]; }],
    ["altered text", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].sections[0].text += " altered"; }],
    ["changed heading", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].sections[0].catchline = "Other"; }],
    ["changed date", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].sections[0].effectiveDate = "2027-01-01"; }],
    ["changed retrieval", (c: OhioCachedChapter[], _e: OhioEnumeration) => { c[0].retrievedAt = "2026-09-24T00:00:00Z"; }],
    ["failed acquisition", (_c: OhioCachedChapter[], e: OhioEnumeration) => { e.failures.push({ chapter: "103" }); }],
    ["duplicate enumeration", (_c: OhioCachedChapter[], e: OhioEnumeration) => { e.sections[1] = e.sections[0]; }],
    ["incorrect total", (_c: OhioCachedChapter[], e: OhioEnumeration) => { e.totals.sections++; }],
  ] as const)("rejects %s before classification", (_name, mutate) => {
    const { chapter, enumeration } = fixture(); const chapters = [chapter];
    mutate(chapters, enumeration);
    expect(() => validateOhioSnapshot(chapters, enumeration)).toThrow(/Ohio/);
  });

  it("rejects an empty active body even if the enumeration also records it", () => {
    const { chapter, enumeration } = fixture();
    chapter.sections[0].text = ""; chapter.sections[0].contentHash = hash("");
    enumeration.sections[0].textLength = 0; enumeration.sections[0].contentHash = hash("");
    expect(() => validateOhioSnapshot([chapter], enumeration)).toThrow(/evidence/);
  });
});

describe("Ohio legacy reconciliation respects discovery uncertainty", () => {
  function reconcileFixture() {
    const paths = files();
    const result = classifyOhioOffenses(paths);
    const inventoryPath = join(paths.dir, "inventory.json");
    writeFileSync(inventoryPath, JSON.stringify({ ...result,
      sections: result.sections.filter(row => row.classification !== "supporting"),
    }));
    const catalog = ["102.01", "102.03", "102.04", "102.05", "102.88"].map(code => ({
      id: `test-${code}`, name: "Legacy label", jurisdiction: "OH", code,
    }));
    return { ...paths, inventoryPath, catalog };
  }

  it("does not rename penalty-linked candidates or call present sections missing/non-offenses", () => {
    const result = reconcileOhioCatalog(reconcileFixture());
    expect(result.rows.filter(row => row.verdict === "discovery_unresolved")).toHaveLength(4);
    expect(result.rows.find(row => row.section === "102.88")!.verdict).toBe("section_missing");
    expect(result.rows.every(row => !OHIO_MECHANICAL_VERDICTS.has(row.verdict))).toBe(true);
    expect(result.rows.find(row => row.section === "102.01")!.evidence).toContain("102.01");
    expect(result.totals.discoveryWork).toBe(4);
  });

  it("rejects a stale inventory when its enumeration changes", () => {
    const paths = reconcileFixture();
    const enumeration = JSON.parse(readFileSync(paths.enumerationPath, "utf8"));
    enumeration.generatedAt = "2026-09-24T00:00:00Z";
    writeFileSync(paths.enumerationPath, JSON.stringify(enumeration));
    expect(() => reconcileOhioCatalog(paths)).toThrow(/Reclassify Ohio/);
  });
});
