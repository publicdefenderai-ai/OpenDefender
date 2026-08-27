import { describe, expect, it } from "vitest";
import {
  CALIFORNIA_CANONICAL_RECORDS,
  CALIFORNIA_EXPLANATION_SLUGS,
  CALIFORNIA_LEGACY_DISPOSITIONS,
  CALIFORNIA_SOURCE_MANIFEST,
  getCaliforniaReconciliationInventory,
  getCaliforniaCanonicalRecord,
  getCaliforniaLegacyDisposition,
} from "../shared/california-authority";
import {
  getChargeById,
  getChargesByJurisdiction,
  getVerifiedCitation,
  getVerifiedSourceUrl,
  isChargeIdRequiringReselection,
} from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

describe("authoritative California charge release", () => {
  it("accounts for every legacy California record exactly once", () => {
    expect(CALIFORNIA_LEGACY_DISPOSITIONS).toHaveLength(115);
    expect(new Set(CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => entry.legacyId)).size).toBe(115);
    expect(getCaliforniaReconciliationInventory()).toHaveLength(115);
  });

  it("requires complete canonical evidence for every selectable record", () => {
    expect(CALIFORNIA_CANONICAL_RECORDS.length).toBeGreaterThan(0);
    for (const record of CALIFORNIA_CANONICAL_RECORDS.filter((record) => record.selectable)) {
      expect(record.selectable).toBe(true);
      expect(record.currentness.status).toBe("current");
      expect(record.currentness.effectiveDate).toMatch(/^\d{4}-\d{2}$/);
      expect(record.elements.length).toBeGreaterThan(0);
      expect(record.mentalState.length).toBeGreaterThan(0);
      expect(record.grading.length).toBeGreaterThan(0);
      expect(record.penalty.length).toBeGreaterThan(0);
      expect(record.sources.length).toBeGreaterThan(0);
      expect(record.sources.every((source) => source.currentLawText)).toBe(true);
      expect(record.attorneyReview).toBe("pending");
    }
    expect(CALIFORNIA_SOURCE_MANIFEST.filter((source) => source.requiredForPromotion)).not.toHaveLength(0);
    const activeCanonicalIds = new Set(
      CALIFORNIA_LEGACY_DISPOSITIONS
        .filter((entry) => entry.disposition === "retain" || entry.disposition === "rename")
        .map((entry) => entry.canonicalId),
    );
    expect(Object.keys(CALIFORNIA_EXPLANATION_SLUGS)).toHaveLength(activeCanonicalIds.size);
  });

  it("exposes only approved California offenses through the selector", () => {
    const charges = getChargesByJurisdiction("CA");
    const activeCanonicalIds = new Set(
      CALIFORNIA_LEGACY_DISPOSITIONS
        .filter((entry) => entry.disposition === "retain" || entry.disposition === "rename")
        .map((entry) => entry.canonicalId),
    );
    expect(charges.length).toBe(activeCanonicalIds.size);
    expect(charges.every((charge) => charge.jurisdiction === "CA")).toBe(true);
    expect(charges.some((charge) => charge.id === "ca-wire-fraud")).toBe(false);
    expect(charges.some((charge) => charge.id === "ca-gang-enhancement")).toBe(false);
    expect(charges.some((charge) => charge.id === "ca-juvenile-delinquency-felony")).toBe(false);
    expect(charges.every((charge) => getVerifiedCitation(charge))).toBe(true);
  });

  it("keeps aliases compatible while rejecting ambiguous records for reselection", () => {
    expect(getChargeById("ca-felony-murder")?.id).toBe("ca-murder-in-the-first-degree");
    expect(getChargeById("ca-bad-checks")?.id).toBe("ca-check-fraud");
    expect(getChargeById("ca-wire-fraud")).toBeUndefined();
    expect(getChargeById("ca-criminally-negligent-homicide")).toBeUndefined();
    expect(getChargeById("ca-assault-in-the-second-degree")).toBeUndefined();
    expect(getChargeById("ca-accessory-after-the-fact")).toBeUndefined();
    expect(getChargeById("ca-resisting-arrest")?.maxPenalty).toContain("up to 1 year");
    expect(getChargeById("ca-failure-to-pay-child-support")?.maxPenalty).toContain("up to 1 year");
    expect(getChargeById("ca-animal-cruelty-misdemeanor")?.maxPenalty).toContain("up to 1 year");
    expect(getChargeById("ca-reckless-driving")?.maxPenalty).toContain("5 to 90 days");
    expect(CALIFORNIA_CANONICAL_RECORDS.find((record) => record.code === "415")?.penalty).toContain("90 days");
    expect(isChargeIdRequiringReselection("ca-wire-fraud")).toBe(true);
    expect(isChargeIdRequiringReselection("ca-criminally-negligent-homicide")).toBe(true);
  });

  it("uses the canonical record as the citation and source authority", () => {
    const charge = getChargeById("ca-credit-card-fraud");
    expect(charge).toBeDefined();
    expect(getVerifiedCitation(charge!)).toBe("Cal. Penal Code § 484g");
    expect(getVerifiedSourceUrl(charge!)).toContain("leginfo.legislature.ca.gov");
    expect(charge?.sourceUrls).toEqual([
      expect.stringContaining("sectionNum=484g"),
    ]);
    expect(getChargeById("ca-check-fraud")?.sourceUrls).toEqual([
      expect.stringContaining("sectionNum=476a"),
    ]);
    expect(getCaliforniaCanonicalRecord("ca-credit-card-fraud")?.officialTitle).toBe(
      "Fraudulent Use of an Access Card",
    );
    expect(getChargeById("ca-possession-of-prohibited-weapon")?.statuteCitations?.[0]).toBe(
      "Cal. Penal Code § 30605",
    );
    const involuntary = CALIFORNIA_CANONICAL_RECORDS.find(
      (record) => record.canonicalId === "ca-involuntary-manslaughter",
    );
    expect(involuntary?.grading).toBe("Felony.");
    expect(involuntary?.penalty).toContain("§ 193(b)");
    const minor = getChargeById("ca-minor-in-possession");
    expect(minor?.category).toBe("misdemeanor");
    expect(minor?.maxPenalty).toContain("$250");
    expect(getChargeById("ca-accessory-after-the-fact")).toBeUndefined();
    expect(getVerifiedSourceUrl(getChargeById("ca-robbery-in-the-first-degree")!)).not.toContain("%2C");
    expect(getChargeById("ca-domestic-battery")?.sourceUrls).toEqual([
      expect.stringContaining("sectionNum=243"),
    ]);
    const fare = getChargeById("ca-fare-evasion");
    expect(fare?.statuteCitations?.[0]).toContain("§ 640(c)(1)");
    expect(fare?.maxPenalty).toContain("third or subsequent violation of § 640(c)(1)");
    expect(fare?.maxPenalty).toContain("§ 640(a)(1)");
  });

  it("keeps each canonical primary-source URL aligned with its statutory section", () => {
    for (const record of CALIFORNIA_CANONICAL_RECORDS) {
      for (const source of record.sources.filter((source) => source.kind === "statute")) {
        const section = source.citation.match(/§\s+(\d+(?:\.\d+)*(?:[a-z])?)/)?.[1];
        expect(section, source.citation).toBeDefined();
        expect(source.url).toContain(`sectionNum=${section}`);
      }
    }
  });

  it("joins California explanations by canonical ID before display-name matching", () => {
    const explanation = getChargeExplanation(
      "Murder",
      "CA",
      "en",
      "ca-murder-in-the-second-degree",
    );
    expect(explanation?.slug).toBe("murder-in-the-second-degree");
  });

  it("does not silently accept an untracked legacy ID", () => {
    expect(getCaliforniaLegacyDisposition("ca-not-a-real-record")).toBeUndefined();
  });
});