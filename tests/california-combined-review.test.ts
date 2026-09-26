import { describe, expect, it } from "vitest";
import { readCaliforniaCombinedReview, validateCaliforniaCombinedReview } from "../scripts/data-review/california-verification/combined-review";
import { getChargeById, criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { CALIFORNIA_CHARGE_CORRECTIONS } from "../shared/california-corrections";
import corrections from "../shared/california-batch-three-corrections.json";

describe("California combined 18-record statutory review", () => {
  it("keeps 49 disjoint corrections and accounts for the three source groups", () => {
    expect(validateCaliforniaCombinedReview()).toEqual({ corrections: 18, addedSections: 14, addedVersions: 14, sharedSources: 28 });
    expect(new Set(CALIFORNIA_CHARGE_CORRECTIONS.map(r => r.id)).size).toBe(49);
    expect(CALIFORNIA_CHARGE_CORRECTIONS).toHaveLength(49);
  });
  it("rejects missing sentencing authority even when the primary statute is retained", () => {
    const review = readCaliforniaCombinedReview();
    const row = review.records.find(r => r.id === "ca-attempted-robbery")!;
    row.sources = row.sources.filter(s => s.key !== "PEN:213");
    expect(() => validateCaliforniaCombinedReview(review)).toThrow("Combined dependencies incomplete");
  });
  it("rejects modified source text", () => {
    const review = readCaliforniaCombinedReview();
    review.documents["PEN:264"][0].contentXml += " changed";
    expect(() => validateCaliforniaCombinedReview(review)).toThrow("Combined source changed");
  });
  it("rejects ambiguous versions instead of selecting the first", () => {
    const review = readCaliforniaCombinedReview();
    const doc = structuredClone(review.documents["PEN:264"][0]);
    doc.versionId += "-future";
    review.documents["PEN:264"].push(doc);
    expect(() => validateCaliforniaCombinedReview(review)).toThrow("Combined version evidence incomplete or ambiguous");
  });
  it("does not treat a single future version as operative", () => {
    const review = readCaliforniaCombinedReview();
    review.documents["PEN:264"][0].effectiveDate = "2030-01-01 00:00:00";
    expect(() => validateCaliforniaCombinedReview(review)).toThrow("Future source requires separate review");
  });
  it("rejects a duplicated record or promoted review status", () => {
    const review = readCaliforniaCombinedReview();
    review.records[1] = structuredClone(review.records[0]);
    expect(() => validateCaliforniaCombinedReview(review)).toThrow("Combined batch accounting changed");
    const other = readCaliforniaCombinedReview();
    other.records[0].status = "fully_verified";
    expect(() => validateCaliforniaCombinedReview(other)).toThrow("Combined correction changed");
  });
  it("keeps the child-victim rape ranges limited to the force subdivision", () => {
    const force = getChargeById("ca-rape-261-a2")!;
    expect(force.maxPenalty).toContain("under 14");
    expect(force.maxPenalty).toContain("9, 11, or 13");
    expect(force.maxPenalty).toContain("14–17");
    expect(force.maxPenalty).toContain("7, 9, or 11");
    for (const id of [1, 3, 4, 5, 6, 7]) {
      const charge = getChargeById(`ca-rape-261-a${id}`)!;
      expect(charge.maxPenalty).toContain("3, 6, or 8");
      expect(charge.maxPenalty).not.toContain("9, 11, or 13");
    }
    expect(getChargeById("ca-rape-261-a1")!.description).toContain("Disability alone does not establish incapacity");
    expect(getChargeById("ca-rape-261-a7")!.description).toContain("need not actually hold public office");
  });
  it("does not apply the half-term default to attempted second-degree robbery", () => {
    const charge = getChargeById("ca-attempted-robbery")!;
    expect(charge.maxPenalty).toContain("§213(b) overrides §664");
    expect(charge.maxPenalty).toContain("16 months, 2 years, or 3 years under §18(a)");
    expect(charge.maxPenalty).toContain("Attempted first-degree robbery follows §664(a)");
    expect(getChargeById("ca-robbery-in-the-first-degree")!.maxPenalty).toContain("two or more other persons");
  });
  it("keeps malice and premeditation distinct from the base sentence", () => {
    expect(getChargeById("ca-murder-in-the-second-degree")!.description).toContain("an intent to kill is not required");
    const attempted = getChargeById("ca-attempted-murder")!;
    expect(attempted.description).toContain("requires intent to kill");
    expect(attempted.maxPenalty).toContain("charged and admitted or found true");
    expect(attempted.maxPenalty).toContain("15 years to life");
    expect(getChargeById("ca-murder-in-the-first-degree")!.maxPenalty).toContain("not automatic consequences");
  });
  it("keeps the manslaughter punishment branches and custody limits distinct", () => {
    const gross = getChargeById("ca-vehicular-manslaughter-192-c1")!;
    expect(gross.categories).toEqual(["misdemeanor", "felony"]);
    expect(gross.maxPenalty).toContain("364 days");
    expect(gross.maxPenalty).toContain("2, 4, or 6 years");
    const simple = getChargeById("ca-vehicular-manslaughter-192-c2")!;
    expect(simple.categories).toEqual(["misdemeanor"]);
    expect(simple.maxPenalty).toContain("no felony prison alternative");
    expect(getChargeById("ca-vehicular-manslaughter-192-c3")!.maxPenalty).toContain("4, 6, or 10 years in state prison");
    expect(getChargeById("ca-involuntary-manslaughter")!.maxPenalty).toContain("statutory exclusions can require state prison");
  });
  it("delivers exact-ID explanations in three languages without losing raw catalog categories", () => {
    for (const correction of corrections) {
      const charge = getChargeById(correction.id)!;
      expect(charge.maxPenalty).toBe(correction.penalty.en);
      expect(charge.categories).toEqual(correction.categories);
      const raw = criminalCharges.find(row => row.id === correction.id);
      if (raw) expect(raw.categories).toEqual(correction.categories);
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(charge.name, "CA", language, charge.id)!;
        expect(explanation.plainSummary).toBe(correction.summary[language]);
        expect(explanation.degreeContext).toBe(correction.penalty[language]);
      }
    }
  });
});
