import {californiaAttorneyDecision,reviewedCaliforniaPenalty} from '../shared/california-attorney-decisions';
import { describe, expect, it } from "vitest";
import { readCaliforniaRemainingCatalogReview, validateCaliforniaRemainingCatalogReview } from "../scripts/data-review/california-verification/remaining-catalog-review";
import { getChargeById } from "../shared/criminal-charges";
import { getCaliforniaCanonicalRecord, getCaliforniaCorrectionDependencies } from "../shared/california-authority";
import { getChargeExplanation } from "../shared/charge-explanations";
import corrections from "../shared/california-batch-six-corrections.json";
const charge = (id: string) => getChargeById(id)!;

describe("remaining California catalog combined review", () => {
  it("binds all 28 records and retains both registration versions", () => {
    expect(validateCaliforniaRemainingCatalogReview()).toEqual({ corrections: 28, addedSections: 36, addedVersions: 37, sharedSources: 75 });
    const r = readCaliforniaRemainingCatalogReview();
    expect(r.documents["VEH:40610"]).toHaveLength(2);
    expect(r.records.find(row => row.id === "ca-expired-registration")!.sources.find(s => s.key === "VEH:40610")!.versions).toHaveLength(2);
  });
  it("rejects multiple versions without explicit common evidence or with incomplete bindings", () => {
    const r = readCaliforniaRemainingCatalogReview(); r.commonVersionEvidence = [];
    expect(() => validateCaliforniaRemainingCatalogReview(r)).toThrow("Supplemental version evidence incomplete or ambiguous");
    const omitted = readCaliforniaRemainingCatalogReview();
    omitted.records.find(row => row.id === "ca-expired-registration")!.sources.find(s => s.key === "VEH:40610")!.versions.pop();
    expect(() => validateCaliforniaRemainingCatalogReview(omitted)).toThrow("Supplemental version evidence incomplete or ambiguous");
  });
  it("does not pass off future-only or unsupported text as shared evidence", () => {
    const r = readCaliforniaRemainingCatalogReview();
    r.commonVersionEvidence[0].passages = ["This section shall become operative on January 1, 2027."];
    expect(() => validateCaliforniaRemainingCatalogReview(r)).toThrow("Common passage missing");
    const empty = readCaliforniaRemainingCatalogReview(); empty.commonVersionEvidence[0].passages = [];
    expect(() => validateCaliforniaRemainingCatalogReview(empty)).toThrow("Invalid common-version evidence");
    const duplicate = readCaliforniaRemainingCatalogReview(); duplicate.commonVersionEvidence.push(duplicate.commonVersionEvidence[0]);
    expect(() => validateCaliforniaRemainingCatalogReview(duplicate)).toThrow("Duplicate common-version evidence");
  });
  it("preserves source integrity and refuses unreviewed future effective dates", () => {
    const changed = readCaliforniaRemainingCatalogReview(); changed.documents["BPC:25667"][0].contentXml += " changed";
    expect(() => validateCaliforniaRemainingCatalogReview(changed)).toThrow("Supplemental source changed");
    const future = readCaliforniaRemainingCatalogReview(); future.documents["VEH:40610"][0].effectiveDate = "2027-01-01";
    expect(() => validateCaliforniaRemainingCatalogReview(future)).toThrow("Future source requires separate review");
  });
  it("includes business-code immunity sources in both evidence and runtime dependencies", () => {
    const c = corrections.find(c => c.id === "ca-minor-in-possession")!;
    expect(getCaliforniaCorrectionDependencies(c)).toContainEqual({ lawCode: "BPC", section: "25667" });
    expect(getCaliforniaCanonicalRecord(c.id)!.sources.some(s => s.kind === "classification" && s.url.includes("lawCode=BPC") && s.url.includes("25667"))).toBe(true);
    const r = readCaliforniaRemainingCatalogReview();
    const row = r.records.find(row => row.id === c.id)!; row.sources = row.sources.filter(s => s.key !== "BPC:25667");
    expect(() => validateCaliforniaRemainingCatalogReview(r)).toThrow("Supplemental dependencies incomplete");
  });
  it("keeps own-recognizance failure to appear and target-dependent conspiracy distinct", () => {
    for (const suffix of ["a", "b"]) {
      expect(charge(`ca-failure-to-appear-1320-${suffix}`).description).toContain("one’s own recognizance");
    }
    expect(charge("ca-failure-to-appear-1320-b").maxPenalty).toContain("Section 17 governs");
    expect(charge("ca-conspiracy-182-a1").maxPenalty).toContain("no single accurate maximum");
    expect(charge("ca-criminal-solicitation-653f-a").maxPenalty).toContain("not a universal $10,000 cap");
    expect(charge("ca-criminal-solicitation-653f-b").categories).toEqual(["felony"]);
  });
  it("fixes custody and punishment distinctions without treating every firearm crime alike", () => {
    expect(charge("ca-discharge-of-firearm-in-city").maxPenalty).toContain("up to 364 days");
    expect(charge("ca-felon-in-possession-of-firearm").maxPenalty).toContain("Section 29800 does not itself direct");
    expect(charge("ca-unlawful-carrying-of-weapon").maxPenalty).toContain("(c)(1)–(4) are felony-only");
    expect(charge("ca-possession-of-prohibited-weapon").maxPenalty).toContain("not a general first-offense option");
    expect(charge("ca-possession-of-prohibited-weapon").maxPenalty).toContain("Miller injunction is stayed");
  });
  it("keeps ordinary misdemeanors separate from civil and juvenile routes", () => {
    expect(charge("ca-public-intoxication").maxPenalty).toContain("cannot later be criminally prosecuted");
    expect(charge("ca-fare-evasion").description).toContain("bars infraction or misdemeanor charges against minors");
    expect(charge("ca-minor-in-possession").maxPenalty).toContain("not a default jail term");
    expect(charge("ca-prostitution-solicitation").maxPenalty).toContain("adds a $1,000 fine");
    expect(charge("ca-prostitution-solicitation").categories).toEqual(["misdemeanor", "felony"]);
    expect(charge("ca-animal-cruelty-misdemeanor").categories).toEqual(["misdemeanor", "felony"]);
  });
  it("does not silently resolve disputed penalty branches", () => {
    expect(charge("ca-failure-to-pay-child-support").maxPenalty).toContain("prior section 270 conviction");
    expect(charge("ca-failure-to-pay-child-support").maxPenalty).toContain("Gregori");
    expect(charge("ca-illegal-fireworks-12677").maxPenalty).toContain("overlap at exactly 100 pounds");
    expect(charge("ca-illegal-fireworks-12677").maxPenalty).toContain("not a conclusively established classification");
  });
  it("corrects the drug-house alternative and preserves transport and manufacturing branches", () => {
    const house = charge("ca-maintaining-drug-house");
    expect(house.categories).toEqual(["misdemeanor", "felony"]);
    expect(house.maxPenalty).toContain("express state-prison alternative");
    expect(charge("ca-possession-with-intent-to-distribute").maxPenalty).toContain("2, 3, or 4 years");
    expect(charge("ca-distribution-of-controlled-substance").description).toContain("transport for sale");
    expect(charge("ca-distribution-of-controlled-substance").maxPenalty).toContain("noncontiguous");
    expect(charge("ca-manufacturing-controlled-substance").maxPenalty).toContain("offer under (e) instead carries 3, 4, or 5");
  });
  it("distinguishes evidence-at-citation dismissal from later insurance purchase", () => {
    const insurance = charge("ca-driving-without-insurance");
    expect(insurance.maxPenalty).toContain("buying coverage later is not the same showing");
    expect(insurance.maxPenalty).toContain("Ability-to-pay relief");
    const registration = charge("ca-expired-registration");
    expect(registration.description).toContain("does not extend registration validity");
    expect(registration.maxPenalty).toContain("correction deadline");
    expect(charge("ca-open-container-23222-b").maxPenalty).toContain("not the general escalating");
  });
  it("delivers all 28 exact-ID corrections in all supported languages", () => {
    for (const c of corrections) {
      const current = charge(c.id); expect(current.categories).toEqual(c.categories); expect(current.maxPenalty).toBe(reviewedCaliforniaPenalty(c.id,c.penalty.en));
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(current.name, "CA", language, current.id)!;
        expect(explanation.plainSummary).toBe(c.summary[language]); expect(explanation.degreeContext).toBe(californiaAttorneyDecision(c.id)?.penalty ?? c.penalty[language]);
      }
    }
  });
});
