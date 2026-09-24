import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyOhioBatch, type VerificationBatch } from "../scripts/data-review/ohio-verification/verify-batch";
import { extractOhioPenaltyLinkages, hasAdditionalOhioPenalty } from "../scripts/data-review/ohio-discovery/offense-extractor";
import type { OhioSnapshotSection } from "../scripts/data-review/ohio-discovery/snapshot-accounting";

const recorded = JSON.parse(readFileSync("scripts/data-review/ohio-verification/batch-one.json", "utf8")) as VerificationBatch;
function fixture() {
  const batch = structuredClone(recorded);
  const enumeration = "{\"fixture\":true}";
  batch.enumerationHash = createHash("sha256").update(enumeration).digest("hex");
  const sources = new Map(Object.values(batch.sources).map(source => [source.section, {
    ...source, chapter: source.section.split(".")[0], catchline: "fixture", repealed: false,
  } as OhioSnapshotSection]));
  return { batch, enumeration, sources };
}

describe("Recorded 51-section substantive batch", () => {
  it("accounts for all assigned sections and binds all 84 mappings without approving publication", () => {
    const { batch, sources, enumeration } = fixture();
    expect(batch.assignment.sourceBatchSections).toHaveLength(47);
    expect(batch.assignment.additionalFineSections).toHaveLength(4);
    const report = verifyOhioBatch(batch, sources, enumeration);
    expect(report.totals).toMatchObject({ analyzedSections: 51, penaltyMappings: 84, pinnedAuthorities: 59, specificHoldSections: 10, approvedForPublication: 0 });
    expect(report.rows.every(row => row.publicationStatus === "not_approved")).toBe(true);
  });
  it.each(["missing", "duplicate", "text", "offset", "grade", "approval", "version", "enumeration"])("rejects %s drift instead of silently rebinding analysis", change => {
    const { batch, sources, enumeration } = fixture();
    if (change === "missing") batch.findings.pop();
    if (change === "duplicate") batch.findings.push(batch.findings[0]);
    if (change === "text") sources.get("4301.99")!.text += "changed";
    if (change === "offset") batch.findings[0].mappings[0].evidence.start++;
    if (change === "grade") batch.findings[0].mappings[0].grade = "F1";
    if (change === "approval") batch.findings[0].publicationStatus = "approved";
    if (change === "version") sources.get("4301.99")!.effectiveDate = "2027-01-01";
    if (change === "enumeration") batch.enumerationHash = "changed";
    expect(() => verifyOhioBatch(batch, sources, enumeration)).toThrow();
  });
  it("preserves separate fireworks grades, custom penalties and conditional activation", () => {
    const bySection = new Map(recorded.findings.map(row => [row.section, row]));
    expect(bySection.get("3743.65")!.mappings.find(row => row.conductScope === "F")!.grade).toBe("F5");
    expect(bySection.get("3743.65")!.mappings.find(row => row.conductScope === "H")!.grade).toBe("MM");
    expect(bySection.get("4301.69")!.mappings.find(row => row.conductScope === "A")!.grade).toBe("misdemeanor_unspecified_degree");
    expect(bySection.get("4301.69")!.mappings.find(row => row.conductScope === "E(1)")!.grade).toBe("M3");
    expect(bySection.get("4301.691")!.hold).toBe("activation_evidence_required");
    expect(bySection.get("959.15")!.mappings.find(row => row.conductScope === "B,C")!.grade).toBe("felony_unspecified_degree");
  });
});

describe("Additional penalty evidence", () => {
  it.each(["5589.211", "1321.141", "1321.592", "4712.071"])("flags %s's mandatory fine and retains exact context", section => {
    const finding = recorded.findings.find(row => row.section === section)!;
    const source = recorded.sources[finding.penaltySection];
    const link = extractOhioPenaltyLinkages(source.text, finding.penaltySection).find(row => row.targetSections.includes(section))!;
    expect(link.grade.additionalPenalty).toBe(true);
    expect(link.grade.conditional).toBe(false);
    expect(link.targetScopes.find(row => row.section === section)?.reviewReasons).toContain("additional_penalty");
    expect(link.context.text).toBe(source.text.slice(link.context.start, link.context.end));
    expect(finding.mappings[0].additionalPenalty).toBe(true);
  });
  it.each(["and shall be fined five thousand dollars", "and may be imprisoned for six months", "and shall forfeit the animal", "and the license shall be revoked"])("detects extra punishment: %s", tail => {
    expect(hasAdditionalOhioPenalty(tail)).toBe(true);
  });
  it("does not turn a degree statement into an extra-penalty finding", () => {
    const [link] = extractOhioPenaltyLinkages("Whoever violates section 101.71 of the Revised Code is guilty of a misdemeanor of the fourth degree.", "101.99");
    expect(link.grade.additionalPenalty).toBeUndefined();
    expect(link.targetScopes[0].requiresApplicabilityReview).toBe(false);
  });
});
