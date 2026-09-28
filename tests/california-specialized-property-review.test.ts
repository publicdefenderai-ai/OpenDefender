import { describe, expect, it } from "vitest";
import additions from "../shared/california-specialized-property-additions.json";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { readCaliforniaSpecializedPropertyReview, specializedPropertyDocuments, validateCaliforniaSpecializedPropertyReview } from "../scripts/data-review/california-verification/specialized-property-review";
import { getChargeById, getChargesByJurisdiction, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from "../shared/california-authority";
import { getChargeExplanation } from "../shared/charge-explanations";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
const byCode = (code: string) => additions.find(a => a.code === code)!;

describe("California specialized-property source reuse", () => {
  it("accounts for all 40 sections without clearing consequential omissions", () => {
    expect(validateCaliforniaSpecializedPropertyReview()).toEqual({ additions: 17, candidateSections: 40, reviewedPrimarySections: 9, remainingResearchSections: 26, supportingSections: 4, deferredSections: 1, reusedSections: 52, newSections: 0, configuredSelectable: 281 });
    const sections = readCaliforniaSpecializedPropertyReview().sections;
    for (const key of ["PEN:192.5", "PEN:243.9", "PEN:487m", "PEN:490.8", "PEN:500", "PEN:502.8"]) expect(sections.find(s => s.key === key)?.status, key).toBe("substantive_research_open");
    expect(sections.find(s => s.key === "PEN:490.7")).toMatchObject({ status: "deferred_low_priority_offense", reason: expect.stringContaining("Revisit") });
    expect(getChargeById("ca-pen-499c-b")).toBeUndefined();
    expect(getChargeById("ca-pen-490-8-f")).toBeUndefined();
  });
  it("rejects source substitutions, changed prose, missing dependencies and lost gaps", () => {
    const documents = specializedPropertyDocuments(); documents["PEN:498"][0].contentXml += "changed";
    expect(() => validateCaliforniaSpecializedPropertyReview(undefined, undefined, documents)).toThrow("Unbound source");
    const wrongCode = structuredClone(additions); wrongCode[0].lawCode = "VEH";
    expect(() => validateCaliforniaSpecializedPropertyReview(undefined, wrongCode)).toThrow();
    const prose = structuredClone(additions); prose[0].penalty = "No incarceration";
    expect(() => validateCaliforniaSpecializedPropertyReview(undefined, prose)).toThrow("Reviewed definition changed");
    const missing = readCaliforniaSpecializedPropertyReview(); missing.records[0].sources.pop();
    expect(() => validateCaliforniaSpecializedPropertyReview(missing)).toThrow("Incomplete source dependencies");
    const gap = readCaliforniaSpecializedPropertyReview(); gap.sections.pop();
    expect(() => validateCaliforniaSpecializedPropertyReview(gap)).toThrow("Successor queue accounting changed");
    const cleared = readCaliforniaSpecializedPropertyReview(); cleared.sections.find(s => s.key === "PEN:243.9")!.status = "supporting_or_procedural_provision";
    expect(() => validateCaliforniaSpecializedPropertyReview(cleared)).toThrow("Unbound section disposition");
    const deferral = readCaliforniaSpecializedPropertyReview(); deferral.deferrals[0].severityEvidence = "";
    expect(() => validateCaliforniaSpecializedPropertyReview(deferral)).toThrow("Unexplained publication deferral");
    const excerpt = readCaliforniaSpecializedPropertyReview(); excerpt.sections[0].evidence.text = "unsupported";
    expect(() => validateCaliforniaSpecializedPropertyReview(excerpt)).toThrow("Unbound evidence span");
  });
  it("preserves different participant and punishment conditions within organized retail theft", () => {
    expect(byCode("490.4(a)(1)").summary).toContain("one or more other persons");
    expect(byCode("490.4(a)(2)").summary).toContain("two or more other persons");
    for (const i of [1,2,3]) {
      expect(byCode(`490.4(a)(${i})`).penalty).toContain("two or more separate occasions within 12 months");
      expect(byCode(`490.4(a)(${i})`).penalty).toContain("aggregated value exceeds $950");
    }
    expect(byCode("490.4(a)(4)").penalty).toContain("do not govern this branch");
    expect(byCode("490.4(a)(4)").penalty).toContain("an order is not automatic");
  });
  it("preserves fine, knowledge, valuation and repeat-offense boundaries", () => {
    expect(byCode("487j").summary).toContain("Exactly $950 does not satisfy");
    expect(byCode("487j").penalty).toContain("expressly combines imprisonment");
    expect(byCode("487j").penalty).toContain("and a fine up to $10,000");
    expect(byCode("498(b)(5)").summary).toContain("knowledge or reason to believe");
    for (const i of [1,2,3,4,5]) {
      expect(byCode(`498(b)(${i})`).penalty).toContain("exceed $950 in value OR");
      expect(byCode(`498(b)(${i})`).penalty).not.toContain("five years");
    }
    expect(byCode("484e(c)").penalty).toContain("no other theft or theft-related conviction");
    expect(byCode("484e(c)").categories).toEqual(["misdemeanor", "infraction", "felony"]);
    expect(byCode("499c(c)").summary).toContain("separate theft acts in subdivision (b)");
    for (const letter of ["a","b"]) {
      expect(byCode(`502.6(${letter})`).penalty).toContain("a $1,000 fine");
      expect(byCode(`502.6(${letter})`).penalty).toContain("subject to forfeiture");
      expect(byCode(`502.6(${letter})`).mentalState).toContain("intent to defraud");
    }
  });
  it("projects every choice into exact-ID explanations, guidance and seeding with expiry still enforced", () => {
    const now = new Date(receipt.checkedAt);
    const seed = buildCaliforniaSourceDatabaseSeed(now);
    expect(getChargesByJurisdiction("CA")).toHaveLength(281);
    // The seed preserves configured identities; runtime authority checks apply holds.
    expect(seed.selectableChargeIds).toHaveLength(281);
    expect(seed.selectableChargeIds.filter(id => getCaliforniaRecordEvidenceStatus(getCaliforniaCanonicalRecord(id)!, now) === "current")).toHaveLength(280);
    for (const a of additions) {
      expect(getChargeById(a.id)).toMatchObject({ name: a.title, code: a.code, description: a.summary, maxPenalty: a.penalty, categories: a.categories });
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({ id: a.id, maxPenalty: a.penalty, categories: a.categories });
      expect(seed.selectableChargeIds).toContain(a.id);
      expect(seed.links.filter(l => l.chargeId === a.id)).toHaveLength(a.supportingKeys.length + 1);
      const record = getCaliforniaCanonicalRecord(a.id)!;
      expect(getCaliforniaRecordEvidenceStatus(record, now)).toBe("current");
      expect(getCaliforniaRecordEvidenceStatus(record, new Date(receipt.expiresAt))).not.toBe("current");
      for (const language of ["en", "es", "zh"]) expect(getChargeExplanation("Wrong name", "CA", language, a.id)).toMatchObject({ canonicalChargeId: a.id, plainSummary: a.summary, degreeContext: a.penalty, untranslated: language !== "en", translationDraft: false });
    }
  });
});
