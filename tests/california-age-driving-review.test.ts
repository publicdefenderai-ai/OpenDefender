import { describe, expect, it } from "vitest";
import { readCaliforniaAgeDrivingReview, validateCaliforniaAgeDrivingReview } from "../scripts/data-review/california-verification/age-driving-review";
import { CALIFORNIA_CANONICAL_RECORDS } from "../shared/california-authority";
import { getChargeById } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import corrections from "../shared/california-batch-four-corrections.json";

describe("California age and driving review", () => {
  it("accounts for 11 records with four new sources", () => {
    expect(validateCaliforniaAgeDrivingReview()).toEqual({ corrections: 11, addedSections: 4, addedVersions: 4, sharedSources: 28 });
  });
  it("rejects missing DUI authority and altered or future source evidence", () => {
    const missing = readCaliforniaAgeDrivingReview();
    const row = missing.records.find(r => r.id === "ca-vehicular-manslaughter-191-5-b")!;
    row.sources = row.sources.filter(s => s.key !== "VEH:23153");
    expect(() => validateCaliforniaAgeDrivingReview(missing)).toThrow("Supplemental dependencies incomplete");
    const changed = readCaliforniaAgeDrivingReview();
    changed.documents["PEN:290.006"][0].contentXml += " changed";
    expect(() => validateCaliforniaAgeDrivingReview(changed)).toThrow("Supplemental source changed");
    const future = readCaliforniaAgeDrivingReview();
    future.documents["PEN:290.006"][0].effectiveDate = "2030-01-01";
    expect(() => validateCaliforniaAgeDrivingReview(future)).toThrow("Future source requires separate review");
  });
  it("rejects mismatched official URLs and additional ambiguous source versions", () => {
    const wrong = readCaliforniaAgeDrivingReview();
    wrong.documents["PEN:290.006"][0].sourceUrl = "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=290.006";
    expect(() => validateCaliforniaAgeDrivingReview(wrong)).toThrow("Supplemental source changed");
    const ambiguous = readCaliforniaAgeDrivingReview();
    const doc = structuredClone(ambiguous.documents["PEN:290.006"][0]); doc.versionId += "-other";
    ambiguous.documents["PEN:290.006"].push(doc);
    expect(() => validateCaliforniaAgeDrivingReview(ambiguous)).toThrow("Supplemental version evidence incomplete or ambiguous");
  });
  it("keeps age thresholds, default misdemeanor sentencing, and civil penalties distinct", () => {
    const close = getChargeById("ca-unlawful-sexual-intercourse-261-5-b")!;
    expect(close.categories).toEqual(["misdemeanor"]);
    expect(close.maxPenalty).toContain("6 months");
    expect(close.description).toContain("no more than three years older or younger");
    const older = getChargeById("ca-unlawful-sexual-intercourse-261-5-c")!;
    expect(older.categories).toEqual(["misdemeanor", "felony"]);
    expect(older.maxPenalty).toContain("16 months, 2 years, or 3 years");
    const adult = getChargeById("ca-unlawful-sexual-intercourse-261-5-d")!;
    expect(adult.description).toContain("21 or older");
    expect(adult.description).toContain("under 16");
    expect(adult.maxPenalty).toContain("2, 3, or 4 years");
    expect(adult.maxPenalty).toContain("Civil penalties are not jail terms");
  });
  it("keeps gross-negligence prior-conviction exposure out of the other driving branch", () => {
    const gross = getChargeById("ca-gross-vehicular-manslaughter-191-5-a")!;
    expect(gross.maxPenalty).toContain("alleged and admitted or found true");
    expect(gross.maxPenalty).toContain("not every DUI prior qualifies");
    const other = getChargeById("ca-vehicular-manslaughter-191-5-b")!;
    expect(other.maxPenalty).toContain("16 months, 2 years, or 4 years");
    expect(other.maxPenalty).toContain("subdivision (a), not this branch");
    for (const c of [gross, other]) expect(c.maxPenalty).toContain("3–5 years");
  });
  it("does not transfer skin-contact requirements or felony punishment between battery branches", () => {
    const restraint = getChargeById("ca-sexual-battery-243-4-a")!;
    expect(restraint.description).toContain("requires skin contact");
    expect(restraint.maxPenalty).toContain("felony-only");
    const misdemeanor = getChargeById("ca-sexual-battery-243-4-e1")!;
    expect(misdemeanor.categories).toEqual(["misdemeanor"]);
    expect(misdemeanor.description).toContain("through either person’s clothing");
    expect(misdemeanor.maxPenalty).toContain("$3,000");
    expect(misdemeanor.maxPenalty).toContain("6 months");
  });
  it("keeps lewd-act and penetration age-specific penalties separate", () => {
    expect(getChargeById("ca-lewd-act-child-288-a")!.maxPenalty).toContain("pleaded and proved");
    const older = getChargeById("ca-lewd-act-child-288-c1")!;
    expect(older.description).toContain("birth date to birth date");
    expect(older.maxPenalty).toContain("1, 2, or 3 years");
    expect(older.maxPenalty).toContain("not automatically transferred");
    const under14 = getChargeById("ca-sexual-penetration-289-a1b")!;
    expect(under14.maxPenalty).toContain("8, 10, or 12 years");
    expect(getChargeById("ca-sexual-penetration-289-a1a")!.maxPenalty).toContain("minor aged 14–17");
  });
  it("delivers the exact corrected explanation in every supported language", () => {
    for (const c of corrections) {
      const charge = getChargeById(c.id)!;
      expect(charge.maxPenalty).toBe(c.penalty.en);
      expect(charge.categories).toEqual(c.categories);
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(charge.name, "CA", language, charge.id)!;
        expect(explanation.plainSummary).toBe(c.summary[language]);
        expect(explanation.degreeContext).toBe(c.penalty[language]);
      }
    }
    expect(CALIFORNIA_CANONICAL_RECORDS.some(r => r.officialTitle.includes("—"))).toBe(false);
  });
});
