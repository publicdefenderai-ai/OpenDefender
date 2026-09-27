import { describe, expect, it } from "vitest";
import { readCaliforniaFinancialPropertyReview, validateCaliforniaFinancialPropertyReview } from "../scripts/data-review/california-verification/financial-property-review";
import { getChargeById, criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import corrections from "../shared/california-batch-five-corrections.json";

describe("California combined financial and property review", () => {
  it("reuses primary evidence across eleven records and thirty total sections", () => {
    expect(validateCaliforniaFinancialPropertyReview()).toEqual({ corrections: 11, addedSections: 7, addedVersions: 7, sharedSources: 30 });
  });
  it("rejects an omitted external penalty source or changed source text", () => {
    const missing = readCaliforniaFinancialPropertyReview();
    const forgery = missing.records.find(r => r.id === "ca-forgery")!;
    forgery.sources = forgery.sources.filter(s => s.key !== "PEN:473");
    expect(() => validateCaliforniaFinancialPropertyReview(missing)).toThrow("Supplemental dependencies incomplete");
    const changed = readCaliforniaFinancialPropertyReview();
    changed.documents["PEN:514"][0].contentXml += "changed";
    expect(() => validateCaliforniaFinancialPropertyReview(changed)).toThrow("Supplemental source changed");
  });
  it("does not transfer health-claim or false-statement alternatives to the felony false-claim branch", () => {
    const claim = getChargeById("ca-insurance-fraud-550-a1")!;
    expect(claim.categories).toEqual(["felony"]);
    expect(claim.maxPenalty).toContain("§550(c)(1)");
    expect(claim.maxPenalty).toContain("does not supply a misdemeanor alternative");
    const statement = getChargeById("ca-insurance-fraud-550-b1")!;
    expect(statement.categories).toEqual(["misdemeanor", "felony"]);
    expect(statement.maxPenalty).toContain("§550(c)(3)");
    expect(statement.maxPenalty).toContain("$10,000");
    for (const c of [claim, statement]) {
      expect(c.maxPenalty).toContain("Restitution is mandatory");
      expect(c.maxPenalty).toContain("doubles fines");
    }
  });
  it("keeps possession-only identity theft separate from the felony use and prior branches", () => {
    expect(getChargeById("ca-identity-theft-530-5-a")!.categories).toEqual(["misdemeanor", "felony"]);
    const possession = getChargeById("ca-identity-theft-530-5-c1")!;
    expect(possession.categories).toEqual(["misdemeanor"]);
    expect(possession.maxPenalty).toContain("does not specify a fine amount");
    expect(possession.maxPenalty).toContain("Do not import the felony alternative");
  });
  it("keeps computer-crime punishment independent of unrelated loss thresholds", () => {
    for (const id of ["ca-computer-crime-502-c1", "ca-computer-crime-502-c5"]) {
      const c = getChargeById(id)!;
      expect(c.categories).toEqual(["misdemeanor", "felony"]);
      expect(c.maxPenalty).toContain("no $950 loss threshold");
      expect(c.maxPenalty).toContain("$5,000");
      expect(c.maxPenalty).toContain("$10,000");
    }
  });
  it("preserves distinct low-value instrument and prior-conviction exceptions", () => {
    const forgery = getChargeById("ca-forgery")!;
    expect(forgery.maxPenalty).toContain("seven listed monetary instruments");
    expect(forgery.maxPenalty).toContain("convicted of both forgery and §530.5 identity theft");
    const check = getChargeById("ca-check-fraud")!;
    expect(check.maxPenalty).toContain("charged-and-convicted aggregate");
    expect(check.maxPenalty).toContain("out-of-state/federal");
    expect(check.maxPenalty).toContain("universal three-prior rule");
  });
  it("does not apply grand-theft jail terms to ordinary petty theft or erase conditional infractions", () => {
    for (const id of ["ca-credit-card-fraud", "ca-embezzlement"]) {
      const c = getChargeById(id)!;
      expect(c.categories).toEqual(["misdemeanor", "felony", "infraction"]);
      expect(c.maxPenalty).toContain("up to 6 months");
      expect(c.maxPenalty).toContain("prosecutorial discretion");
      expect(c.maxPenalty).toContain("666.1");
    }
    expect(getChargeById("ca-credit-card-fraud")!.description).toContain("six-month period");
    expect(getChargeById("ca-embezzlement")!.maxPenalty).toContain("public funds");
  });
  it("preserves money-laundering aggregation and enhanced punishment without presenting the base as a ceiling", () => {
    const c = getChargeById("ca-money-laundering")!;
    expect(c.description).toContain("$5,000 within seven days");
    expect(c.description).toContain("$25,000 within 30 days");
    expect(c.maxPenalty).toContain("five times the value");
    expect(c.maxPenalty).toContain("charged and admitted or found true");
    expect(c.maxPenalty).toContain("not a total ceiling");
  });
  it("delivers corrected text and categories through catalog and all language paths", () => {
    for (const correction of corrections) {
      const charge = getChargeById(correction.id)!;
      expect(charge.maxPenalty).toBe(correction.penalty.en);
      expect(charge.categories).toEqual(correction.categories);
      const raw = criminalCharges.find(c => c.id === correction.id);
      if (raw) expect(raw.categories).toEqual(correction.categories);
      for (const language of ["en", "es", "zh"] as const) {
        const explanation = getChargeExplanation(charge.name, "CA", language, charge.id)!;
        expect(explanation.plainSummary).toBe(correction.summary[language]);
        expect(explanation.degreeContext).toBe(correction.penalty[language]);
      }
    }
  });
});
