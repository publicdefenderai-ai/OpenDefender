import { describe, expect, it } from "vitest";
import { criminalCharges, getChargeById } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import corrections from "../shared/california-batch-one-corrections.json";
import { readCaliforniaReview, validateCaliforniaReview } from "../scripts/data-review/california-verification/review";

describe("California bounded correction delivery", () => {
  it("exposes California alternatives to direct shared-catalog readers", () => {
    expect(criminalCharges.find(row => row.id === "ca-vandalism")?.categories).toEqual(["misdemeanor", "felony"]);
    expect(criminalCharges.find(row => row.id === "ca-petty-theft")?.categories).toEqual(["misdemeanor", "infraction", "felony"]);
    for (const correction of corrections) {
      const raw = criminalCharges.find(row => row.id === correction.id);
      if (raw) expect(raw.categories, correction.id).toEqual(correction.categories);
    }
  });
  it("binds all corrections to preserved source bytes and accounts for unfinished records", () => {
    expect(validateCaliforniaReview(readCaliforniaReview())).toEqual({ batchRecords: 25, corrections: 25, pending: 0, sections: 64, versions: 65 });
  });
  it("rejects changed source bytes", () => {
    const review = readCaliforniaReview();
    review.documents["PEN:18.5"][0].contentXml += " altered";
    expect(() => validateCaliforniaReview(review)).toThrow("Changed source");
  });
  it("keeps the 2033 licensing successor out of the 2026 research decision", () => {
    const review = readCaliforniaReview();
    const note = review.versionNotes[0];
    expect(note.transitionDate).toBe("2033-01-01");
    note.selectedVersionId = note.versions.find(version => version.applicableFrom === "2033-01-01")!.versionId;
    expect(() => validateCaliforniaReview(review)).toThrow("Version date review required");
  });
  it("requires renewed version review at the scheduled transition", () => {
    const review = readCaliforniaReview();
    review.versionNotes[0].asOf = "2033-01-01";
    expect(() => validateCaliforniaReview(review)).toThrow("Version date review required");
  });
  it("rejects lost future-version evidence", () => {
    const review = readCaliforniaReview();
    review.versionNotes[0].versions.pop();
    expect(() => validateCaliforniaReview(review)).toThrow("Incomplete version accounting");
  });
  it("does not apply the ordinary misdemeanor penalty to first-time unlicensed driving", () => {
    const charge = getChargeById("ca-driving-without-license")!;
    expect(charge.category).toBe("infraction");
    expect(charge.categories).toEqual(["infraction", "misdemeanor"]);
    expect(charge.maxPenalty).toContain("$100 base fine and no jail");
    expect(charge.maxPenalty).toContain("third or later violation");
    expect(charge.maxPenalty).toContain("§40000.10(a)");
  });
  it("keeps DUI subdivisions distinct and makes first-offense jail conditional on the sentencing path", () => {
    for (const subdivision of ["a", "b", "f", "g"]) {
      const charge = getChargeById(`ca-dui-23152-${subdivision}`)!;
      expect(charge.code).toBe(`23152(${subdivision})`);
      expect(charge.categories).toEqual(["misdemeanor", "felony"]);
      expect(charge.maxPenalty).toContain("without probation");
      expect(charge.maxPenalty).toContain("makes jail discretionary");
      expect(charge.maxPenalty).toContain("§§23550 or 23550.5");
      expect(getChargeExplanation(charge.name, "CA", "en", charge.id)?.canonicalChargeId).toBe(charge.id);
    }
    expect(getChargeById("ca-dui-23152-b")?.description).toContain("rebuttable presumption");
    expect(getChargeById("ca-dui-23152-f")?.description).toContain("does not use the alcohol concentration threshold");
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
  it("does not let bounded corrections become full verification through a status edit", () => {
    const review = readCaliforniaReview();
    review.records.find(row => row.id === "ca-dui-23152-a")!.status = "fully_verified";
    expect(() => validateCaliforniaReview(review)).toThrow("Correction changed");
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
