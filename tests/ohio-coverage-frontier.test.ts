import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { reconcileOhioDiscovery, buildOhioCoverageFrontier } from "../scripts/data-review/ohio-coverage-frontier";
import { bindOhioResearchIdentity } from "../scripts/data-review/acquire-ohio-major-coverage";
import type { OhioClassifiedSection } from "../scripts/data-review/classify-ohio-offenses";
const section = {
  section: "2911.12", chapter: "2911", titleNumber: "29", catchline: "Burglary",
  sourceUrl: "https://codes.ohio.gov/ohio-revised-code/section-2911.12", effectiveDate: "2011-09-30",
  contentHash: "fixture", classification: "named_offense", repealed: false, externalGrades: [],
  offences: ["burglary", "trespass in a habitation"].map(name => ({name, divisions: [],
    guiltClause: {text: `guilty of ${name}`, start: 0, end: 1}, grades: [], crossReferences: []})),
} satisfies OhioClassifiedSection;
describe("Ohio broader coverage frontier", () => {
  it("does not let an existing section record conceal a second named offense", () => {
    const [row] = reconcileOhioDiscovery([section], [{id: "reviewed-burglary", section: "2911.12", name: "Burglary", status: "configured"}]);
    expect(row.names[0].disposition).toBe("identity_match_requires_branch_audit");
    expect(row.names[1].disposition).toBe("unmatched_discovery_name_not_verified_offense");
    expect(row.disposition).toBe("section_overlap_not_full_coverage");
  });
  it("requires citation and name together, not a same-name record in another section", () => {
    const [row] = reconcileOhioDiscovery([section], [{id: "other", section: "999.01", name: "Burglary", status: "configured"}]);
    expect(row.names.every(n => !n.identityMatches.length)).toBe(true);
  });
  it("preserves holds instead of treating them as publication coverage", () => {
    const [row] = reconcileOhioDiscovery([section], [{id: "held", section: "2911.12", name: "Burglary", status: "held"}]);
    expect(row.names[0].disposition).toBe("existing_hold_preserved");
  });
  it("rejects duplicate inputs that would inflate accounting", () => {
    expect(() => reconcileOhioDiscovery([section, section], [])).toThrow(/Duplicate/);
    const record = {id: "same", section: "2911.12", name: "Burglary", status: "configured" as const};
    expect(() => reconcileOhioDiscovery([section], [record, record])).toThrow(/Duplicate/);
  });
  it("partitions candidate and non-signal sections without claiming a statewide offense count", () => {
    const report = buildOhioCoverageFrontier();
    expect(report.counts.candidateSections + report.counts.sectionsWithoutRecognizedOffenseSignal).toBe(report.counts.enumeratedSections);
    expect(report.counts.configuredNameMatches + report.counts.heldNameMatches + report.counts.unmatchedNames).toBe(report.counts.namedCandidates);
    expect(report.nextBatch.sections).toContain("2905.01");
    expect(report.nextBatch.sections).toContain("2909.02");
    expect(report.nextBatch.sections).not.toContain("2911.21");
    expect(report.rows.find(r => r.section === "2911.21")?.reviewedRecords.some(r => r.status === "held")).toBe(true);
  });
  it("validates the committed research packet without converting references into approvals", () => {
    const packet = JSON.parse(readFileSync("scripts/data-review/output/ohio-major-coverage-evidence.json", "utf8"));
    expect(packet.publicationStatus).toBe("research_only_no_runtime_pin_or_receipt_changes");
    expect(new Set(packet.primarySections).size).toBe(packet.primarySections.length);
    expect(packet.primaryRows.map((r: any) => r.section)).toEqual(packet.primarySections);
    for (const row of packet.primaryRows) {
      const document = packet.documents[row.section];
      const rebound = bindOhioResearchIdentity(document);
      expect(row.names).toEqual(rebound.names);
      expect(row.guiltContexts).toEqual(rebound.guiltContexts);
      for (const span of row.guiltContexts) expect(document.text.slice(span.start, span.end)).toBe(span.text);
      for (const ref of row.references) {
        if (ref.status === "retained_applicability_unreviewed") expect(ref.sourceHash).toBe(packet.documents[ref.section].contentHash);
        else expect(ref.sourceHash).toBeNull();
      }
    }
    for (const document of Object.values(packet.documents) as any[]) {
      expect(createHash("sha256").update(document.text).digest("hex")).toBe(document.contentHash);
      expect(document.sourceUrl).toBe(`https://codes.ohio.gov/ohio-revised-code/section-${document.section}`);
    }
    expect(packet.failures["2907.12"]).toContain("number-not-found");
    expect(packet.failures["3727.01"]).toContain("number-not-found");
  });
  it("binds every extracted name to an exact quotation in its own source", () => {
    const text = "(A) No person shall violate this provision. (B) Whoever violates division (A) of this section is guilty of burglary. Burglary is a felony of the second degree.";
    const document = { section: "2911.12", title: "Burglary", sourceUrl: section.sourceUrl, text,
      contentHash: createHash("sha256").update(text).digest("hex"), effectiveDateStart: "2011-09-30", retrievedAt: "2026-11-03T00:00:00Z" };
    const row = bindOhioResearchIdentity(document);
    expect(row.names.length).toBeGreaterThan(0);
    for (const name of row.names) expect(text.slice(name.guiltClause.start, name.guiltClause.end)).toBe(name.guiltClause.text);
    expect(() => bindOhioResearchIdentity({...document, text: text + " changed"})).toThrow(/hash mismatch/);
  });
});
