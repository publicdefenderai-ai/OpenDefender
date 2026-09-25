import { describe, expect, it } from "vitest";
import { getChargeById } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import corrections from "../shared/california-batch-one-corrections.json";
import { readCaliforniaReview, validateCaliforniaReview } from "../scripts/data-review/california-verification/review";

describe("California bounded correction delivery", () => {
  it("binds all corrections to preserved source bytes and accounts for unfinished records", () => {
    expect(validateCaliforniaReview(readCaliforniaReview())).toEqual({ batchRecords: 25, corrections: 19, pending: 6, sections: 58, versions: 59 });
  });
  it("rejects changed source bytes", () => {
    const review = readCaliforniaReview();
    review.documents["PEN:18.5"][0].contentXml += " altered";
    expect(() => validateCaliforniaReview(review)).toThrow("Changed source");
  });
  it("rejects a lost sentencing dependency", () => {
    const review = readCaliforniaReview();
    review.records.find(row => row.id === "ca-menacing")!.correctionSources = ["PEN:422"];
    expect(() => validateCaliforniaReview(review)).toThrow("Correction evidence incomplete");
  });
  it("rejects a missing Health and Safety Code punishment source", () => {
    const review = readCaliforniaReview();
    delete review.documents["HSC:11374"];
    expect(() => validateCaliforniaReview(review)).toThrow("Missing dependency: HSC:11374");
  });
  it("keeps ordinary theft and possession classifications separate from their exceptional paths", () => {
    const theft = getChargeById("ca-petty-theft")!;
    expect(theft.category).toBe("misdemeanor");
    expect(theft.categories).toEqual(["misdemeanor", "infraction", "felony"]);
    expect(theft.description).toContain("$50 or less");
    expect(theft.description).toContain("no theft-related prior conviction");
    expect(theft.maxPenalty).toContain("separate repeat-theft path");
    const possession = getChargeById("ca-possession-of-controlled-substance")!;
    expect(possession.category).toBe("misdemeanor");
    expect(possession.categories).toEqual(["misdemeanor", "felony"]);
    expect(possession.maxPenalty).toContain("not a §11395 sentencing calculation");
    const paraphernalia = getChargeById("ca-possession-of-drug-paraphernalia")!;
    expect(paraphernalia.maxPenalty).toContain("§11374");
    expect(paraphernalia.maxPenalty).toContain("15–180 days");
    expect(paraphernalia.description).toContain("personal-use needles or syringes");
    expect(paraphernalia.description).toContain("checking services");
    expect(getChargeExplanation(paraphernalia.name, "CA", "en", paraphernalia.id)?.plainSummary).toBe(paraphernalia.description);
  });
  it("does not silently choose a version for corrected law", () => {
    const review = readCaliforniaReview();
    review.documents["PEN:18.5"].push(structuredClone(review.documents["PEN:18.5"][0]));
    expect(() => validateCaliforniaReview(review)).toThrow("unresolved source versions");
  });
  it("does not let pending DUI work become approved through a status edit", () => {
    const review = readCaliforniaReview();
    review.records.find(row => row.id === "ca-dui-23152-a")!.status = "bounded_correction_proposed";
    expect(() => validateCaliforniaReview(review)).toThrow("Unreviewed record promoted");
  });
  it("delivers exact summaries and penalties in every supported language", () => {
    for (const row of corrections) {
      const charge = getChargeById(row.id)!;
      expect(charge.categories).toEqual(row.categories);
      expect(charge.maxPenalty).toBe(row.penalty.en);
      expect(charge.maxPenaltyEs).toBe(row.penalty.es);
      expect(charge.maxPenaltyZh).toBe(row.penalty.zh);
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(charge.name, "CA", language, charge.id)!;
        expect(explanation.canonicalChargeId).toBe(charge.id);
        expect(explanation.plainSummary).toBe(row.summary[language]);
        expect(explanation.degreeContext).toBe(row.penalty[language]);
        expect(explanation.jurisdictionDetail?.penaltyClass).toBe(row.penalty[language]);
      }
    }
  });
  it("separates deadly-weapon assault from force-likely assault and preserves both sentencing classes", () => {
    const charge = getChargeById("ca-assault-with-deadly-weapon")!;
    expect(charge.code).toBe("245(a)(1)");
    expect(charge.categories).toEqual(["felony", "misdemeanor"]);
    expect(charge.description).toContain("different branch");
    expect(charge.maxPenalty).toContain("state prison");
    expect(charge.maxPenalty).toContain("364 days");
    expect(charge.maxPenalty).not.toContain("imprisonment under Penal Code § 1170(h)");
    expect(getChargeExplanation("Criminal Threats", "CA", "en", "ca-menacing")?.plainSummary).toContain("sustained fear");
  });
  it("keeps generic and other-state explanations separate from exact California corrections", () => {
    expect(getChargeExplanation("Criminal Threats", "OH", "en", "ca-menacing")?.canonicalChargeId).not.toBe("ca-menacing");
    expect(getChargeExplanation("Assault with a Deadly Weapon", undefined, "en")?.canonicalChargeId).toBeUndefined();
  });
});
