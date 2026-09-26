import { describe, expect, it } from "vitest";
import { getChargeById, criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { CALIFORNIA_CHARGE_CORRECTIONS } from "../shared/california-corrections";
import corrections from "../shared/california-batch-two-corrections.json";
import { readCaliforniaReuseReview, validateCaliforniaReuseReview } from "../scripts/data-review/california-verification/reuse-review";

describe("California combined reuse batch", () => {
  it("accounts for six disjoint corrections while preserving the initial batch", () => {
    expect(validateCaliforniaReuseReview()).toEqual({ corrections: 6, addedSections: 2, addedVersions: 3 });
    expect(CALIFORNIA_CHARGE_CORRECTIONS).toHaveLength(49);
    expect(new Set(CALIFORNIA_CHARGE_CORRECTIONS.map(row => row.id)).size).toBe(49);
  });
  it("rejects a missing punishment source", () => {
    const review = readCaliforniaReuseReview();
    review.records.find(row => row.id === "ca-burglary-in-the-first-degree")!.sources = [];
    expect(() => validateCaliforniaReuseReview(review)).toThrow("Reuse dependencies incomplete");
  });
  it("rejects changes to the clause relied on across retained versions", () => {
    const review = readCaliforniaReuseReview();
    review.commonVersionClauses[0].clauseXml = "<p>(c) All reckless driving convictions count.</p>";
    expect(() => validateCaliforniaReuseReview(review)).toThrow("Common version clause changed");
  });
  it("does not drop the future version when relying on a shared clause", () => {
    const review = readCaliforniaReuseReview();
    review.documents["VEH:23103.5"].pop();
    expect(() => validateCaliforniaReuseReview(review)).toThrow("Reuse version evidence incomplete");
  });
  it("does not accept modified source text", () => {
    const review = readCaliforniaReuseReview();
    review.documents["PEN:830"][0].contentXml += " changed";
    expect(() => validateCaliforniaReuseReview(review)).toThrow("Reuse source changed");
  });
  it("does not promote the bounded pass to full verification", () => {
    const review = readCaliforniaReuseReview();
    review.records[0].status = "fully_verified";
    expect(() => validateCaliforniaReuseReview(review)).toThrow("Reuse correction changed");
  });
  it("preserves felony prison branches and the agricultural petty-theft exception", () => {
    const burglary = getChargeById("ca-burglary-in-the-first-degree")!;
    expect(burglary.categories).toEqual(["felony"]);
    expect(burglary.maxPenalty).toContain("2, 4, or 6 years in state prison");
    const firearm = getChargeById("ca-grand-theft-firearm-487-d2")!;
    expect(firearm.categories).toEqual(["felony"]);
    expect(firearm.description).toContain("expressly excludes firearm theft");
    expect(firearm.maxPenalty).toContain("state prison under §489(a)");
    const crops = getChargeById("ca-grand-theft-agricultural-487-b1a")!;
    expect(crops.description).toContain("$950 or less as petty theft");
    expect(crops.maxPenalty).toContain("must not be transferred");
  });
  it("keeps the probation jail branches and qualifying-prior conditions explicit", () => {
    const second = getChargeById("ca-dui-second-offense")!;
    expect(second.description).toContain("not every reckless-driving conviction");
    expect(second.maxPenalty).toContain("90–364 days");
    expect(second.maxPenalty).toContain("96-hour branch");
    const third = getChargeById("ca-dui-third-offense")!;
    expect(third.maxPenalty).toContain("120–364 days");
    expect(third.maxPenalty).toContain("specific request and good cause");
    expect(third.maxPenalty).toContain("substitutes a 30-day minimum");
  });
  it("delivers exact-ID explanations in all languages and categories to direct catalog readers", () => {
    for (const correction of corrections) {
      const charge = getChargeById(correction.id)!;
      expect(charge.maxPenalty).toBe(correction.penalty.en);
      expect(charge.categories).toEqual(correction.categories);
      const raw = criminalCharges.find(row => row.id === correction.id);
      if (raw) expect(raw.categories).toEqual(correction.categories);
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(charge.name, "CA", language, charge.id)!;
        expect(explanation.canonicalChargeId).toBe(charge.id);
        expect(explanation.plainSummary).toBe(correction.summary[language]);
        expect(explanation.degreeContext).toBe(correction.penalty[language]);
      }
    }
  });
});
