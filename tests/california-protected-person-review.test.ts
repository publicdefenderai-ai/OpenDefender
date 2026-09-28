import { describe, expect, it } from "vitest";
import additions from "../shared/california-protected-person-additions.json";
import { CALIFORNIA_ADDITIONS } from "../shared/california-additions";
import { californiaLawCode, californiaPrimaryIdentity } from "../shared/california-law-codes";
import { readCaliforniaProtectedPersonReview, readCaliforniaProtectedPersonAcquisition, validateCaliforniaProtectedPersonReview } from "../scripts/data-review/california-verification/protected-person-review";
import { getChargeById, getChargesByJurisdiction, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getCaliforniaCanonicalRecord } from "../shared/california-authority";
import { getChargeExplanation } from "../shared/charge-explanations";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";

describe("California protected-person and public-place review", () => {
  it("binds 21 additions and retains unresolved consequential offenses", () => {
    expect(validateCaliforniaProtectedPersonReview()).toEqual({ additions: 21, candidateSections: 61, reviewedPrimarySections: 21, remainingResearchSections: 40, reusedSections: 71, newSections: 7, newVersions: 7, configuredSelectable: 236 });
    const review = readCaliforniaProtectedPersonReview();
    expect(review.sections.find(s => s.key === "PEN:243.9")?.status).toBe("substantive_research_open");
    expect(getChargeById("ca-pen-243-9-a")).toBeUndefined();
    expect(getChargeById("ca-pen-243-b")).toBeUndefined();
    expect(getChargeById("ca-pen-243-c-1")).toBeUndefined();
  });
  it("requires explicit law-code identity and rejects source-key mismatches across all batches", () => {
    expect(californiaPrimaryIdentity("VEH", "23152(a)")).toEqual({ lawCode: "VEH", key: "VEH:23152", citation: "Cal. Vehicle Code § 23152(a)" });
    expect(californiaPrimaryIdentity("PEN", "240").key).not.toBe(californiaPrimaryIdentity("VEH", "240").key);
    expect(() => californiaLawCode("NOT_A_CODE")).toThrow("Unsupported California law code");
    for (const a of CALIFORNIA_ADDITIONS) {
      const primary = californiaPrimaryIdentity(a.lawCode, a.code);
      expect(Object.hasOwn(a.sourceEffectiveDates, primary.key), a.id).toBe(true);
      const canonical = getCaliforniaCanonicalRecord(a.id)!;
      expect(canonical).toMatchObject({ lawCode: a.lawCode, citation: primary.citation });
      const source = canonical.sources.find(s => s.kind === "statute")!;
      expect(new URL(source.url).searchParams.get("lawCode")).toBe(a.lawCode);
      expect(canonical.currentness.effectiveDate).toBe((a.sourceEffectiveDates as Record<string, string | null>)[primary.key]);
    }
  });
  it("rejects edited content, missing dependencies and unexplained queue changes", () => {
    const edited = structuredClone(additions); edited[0].lawCode = "VEH";
    expect(() => validateCaliforniaProtectedPersonReview(undefined, undefined, edited)).toThrow();
    const missing = readCaliforniaProtectedPersonReview(); missing.records[0].sources.pop();
    expect(() => validateCaliforniaProtectedPersonReview(missing)).toThrow("Incomplete source dependencies");
    const evidence = readCaliforniaProtectedPersonReview(); evidence.records[0].primaryEvidence.text = "unverified";
    expect(() => validateCaliforniaProtectedPersonReview(evidence)).toThrow("Unbound evidence span");
    const queue = readCaliforniaProtectedPersonReview(); queue.sections.pop();
    expect(() => validateCaliforniaProtectedPersonReview(queue)).toThrow("Successor queue accounting changed");
    const acq = readCaliforniaProtectedPersonAcquisition(); acq.documents["EDC:38000"][0].contentXml += "changed";
    expect(() => validateCaliforniaProtectedPersonReview(undefined, acq)).toThrow("provenance changed");
  });
  it("retains literal anomalous references and known future transitions", () => {
    const review = readCaliforniaProtectedPersonReview();
    expect(review.sourceAnomalies[0]).toMatchObject({ literalReference: "PEN:241(d)(5)", likelyReference: "PEN:241(d)(4)", status: "apparent_cross_reference_error_unresolved" });
    const changed = readCaliforniaProtectedPersonReview(); changed.sourceAnomalies[0].evidence[0].text = "silently repaired";
    expect(() => validateCaliforniaProtectedPersonReview(changed)).toThrow("Unbound source issue");
    const lost = readCaliforniaProtectedPersonReview(); lost.scheduledSourceChanges = [];
    expect(() => validateCaliforniaProtectedPersonReview(lost)).toThrow("Known source transition lost");
  });
  it("keeps knowledge, injury, imprisonment and fine distinctions intact", () => {
    expect(getChargeById("ca-pen-243-25")!.description).toContain("actual knowledge");
    expect(getChargeById("ca-pen-243-1")!.categories).toEqual(["felony"]);
    expect(getChargeById("ca-pen-241-1")!.categories).toEqual(["felony", "misdemeanor"]);
    expect(getChargeById("ca-pen-243-3")!.maxPenalty).toContain("in state prison");
    expect(getChargeById("ca-pen-243-6")!.maxPenalty).toContain("under section 1170(h)");
    expect(getChargeById("ca-pen-243-c-2")!.description).toContain("requiring professional medical treatment");
    expect(getChargeById("ca-pen-241-b")!.maxPenalty).toContain("up to 6 months");
    expect(getChargeById("ca-pen-243-6")!.description).toContain("lawful labor disputes are excluded");
    expect(getChargeById("ca-pen-241-4")!.description).toContain("school district police department");
  });
  it("projects all 21 additions into guidance, exact explanations and source seeding", () => {
    const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-27T00:00:00Z"));
    expect(getChargesByJurisdiction("CA")).toHaveLength(236);
    for (const a of additions) {
      expect(getChargeById(a.id)).toMatchObject({ name: a.title, code: a.code, description: a.summary, maxPenalty: a.penalty, categories: a.categories });
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({ id: a.id, maxPenalty: a.penalty, categories: a.categories });
      expect(seed.selectableChargeIds).toContain(a.id);
      expect(seed.links.filter(l => l.chargeId === a.id)).toHaveLength(a.supportingKeys.length + 1);
      for (const language of ["en", "es", "zh"]) expect(getChargeExplanation("Wrong name", "CA", language, a.id)).toMatchObject({ canonicalChargeId: a.id, plainSummary: a.summary, degreeContext: a.penalty, untranslated: language !== "en", translationDraft: false });
    }
  });
});
