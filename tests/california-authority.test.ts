import { describe, expect, it } from "vitest";
import {
  CALIFORNIA_CANONICAL_RECORDS,
  CALIFORNIA_EXPLANATION_SLUGS,
  CALIFORNIA_LEGACY_DISPOSITIONS,
  CALIFORNIA_SOURCE_MANIFEST,
  getCaliforniaReconciliationInventory,
  getCaliforniaCanonicalRecord,
  getCaliforniaCitation,
  getCaliforniaSourceUrl,
  getCaliforniaLegacyDisposition,
  getCaliforniaReselectionOptions,
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
      CALIFORNIA_CANONICAL_RECORDS
        .filter((record) => record.selectable)
        .map((record) => record.canonicalId),
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

  it("offers exact current choices for every supported ambiguous legacy label", () => {
    const supportedLegacyIds = [
      "ca-criminally-negligent-homicide",
      "ca-vehicular-homicide",
      "ca-assault-in-the-second-degree",
      "ca-assault-in-the-third-degree",
      "ca-rape-in-the-first-degree",
      "ca-sexual-assault-in-the-second-degree",
      "ca-sexual-assault-in-the-third-degree",
      "ca-statutory-rape",
      "ca-child-sexual-abuse",
      "ca-grand-theft-in-the-first-degree",
      "ca-identity-theft",
      "ca-insurance-fraud",
      "ca-computer-fraud",
      "ca-disturbing-the-peace",
      "ca-dui-first-offense",
      "ca-failure-to-appear",
      "ca-protective-order-violation",
      "ca-open-container",
      "ca-indecent-exposure",
      "ca-illegal-fireworks",
      "ca-conspiracy",
      "ca-accessory-after-the-fact",
      "ca-criminal-solicitation",
    ];

    for (const legacyId of supportedLegacyIds) {
      const options = getCaliforniaReselectionOptions(legacyId);
      expect(options.length, legacyId).toBeGreaterThan(0);
      expect(getCaliforniaLegacyDisposition(legacyId)?.disposition).toBe("reselection-required");
      for (const option of options) {
        expect(option.selectable).toBe(true);
        expect(option.citation).toMatch(/§/);
        expect(option.sources.length).toBeGreaterThan(0);
        expect(option.elements.length).toBeGreaterThan(0);
        expect(option.mentalState.length).toBeGreaterThan(0);
        expect(option.grading.length).toBeGreaterThan(0);
        expect(option.penalty.length).toBeGreaterThan(0);
        expect(getChargeById(option.canonicalId)?.id).toBe(option.canonicalId);
      }
    }
  });

  it("keeps unsupported California records excluded even as exact choices are added", () => {
    for (const legacyId of [
      "ca-wire-fraud",
      "ca-mail-fraud",
      "ca-probation-violation",
      "ca-gang-enhancement",
      "ca-juvenile-delinquency-felony",
      "ca-animal-at-large",
    ]) {
      expect(getCaliforniaReselectionOptions(legacyId)).toEqual([]);
      expect(getChargeById(legacyId)).toBeUndefined();
    }
  });

  it("keeps high-risk exact alternatives tied to the authoritative subdivision", () => {
    expect(
      getCaliforniaReselectionOptions("ca-vehicular-homicide").map((record) => record.canonicalId),
    ).toEqual([
      "ca-gross-vehicular-manslaughter-191-5-a",
      "ca-vehicular-manslaughter-191-5-b",
      "ca-vehicular-manslaughter-192-c1",
      "ca-vehicular-manslaughter-192-c2",
      "ca-vehicular-manslaughter-192-c3",
    ]);

    expect(
      getCaliforniaReselectionOptions("ca-rape-in-the-first-degree").map((record) => record.canonicalId),
    ).toEqual([
      "ca-rape-261-a1",
      "ca-rape-261-a2",
      "ca-rape-261-a3",
      "ca-rape-261-a4",
      "ca-rape-261-a5",
      "ca-rape-261-a6",
      "ca-rape-261-a7",
    ]);

    const gross = getCaliforniaCanonicalRecord("ca-gross-vehicular-manslaughter-191-5-a");
    expect(gross?.citation).toBe("Cal. Penal Code § 191.5(a)");
    expect(gross?.grading).toBe("Felony.");
    expect(gross?.penalty).toContain("4, 6, or 10 years");

    const intoxicated = getCaliforniaCanonicalRecord("ca-vehicular-manslaughter-191-5-b");
    expect(intoxicated?.citation).toBe("Cal. Penal Code § 191.5(b)");
    expect(intoxicated?.grading).toBe("Wobbler.");
    expect(intoxicated?.penalty).toContain("16 months, 2 years, or 4 years");

    const agricultural = getCaliforniaCanonicalRecord("ca-grand-theft-agricultural-487-b1a");
    expect(agricultural?.citation).toBe("Cal. Penal Code § 487(b)(1)(A)");
    expect(agricultural?.elements.join(" ")).toContain("agricultural crops");
    expect(agricultural?.elements.join(" ")).toContain("$250");

    const firearm = getCaliforniaCanonicalRecord("ca-grand-theft-firearm-487-d2");
    expect(firearm?.citation).toBe("Cal. Penal Code § 487(d)(2)");
    expect(firearm?.grading).toBe("Felony.");
    expect(firearm?.penalty).toContain("16 months, 2 years, or 3 years");

    const withoutGrossNegligence = getCaliforniaCanonicalRecord("ca-vehicular-manslaughter-192-c2");
    expect(withoutGrossNegligence?.citation).toBe("Cal. Penal Code § 192(c)(2)");
    expect(withoutGrossNegligence?.grading).toBe("Misdemeanor.");
    expect(withoutGrossNegligence?.penalty).toContain("§ 193(c)(2)");

    const financialGain = getCaliforniaCanonicalRecord("ca-vehicular-manslaughter-192-c3");
    expect(financialGain?.citation).toBe("Cal. Penal Code § 192(c)(3)");
    expect(financialGain?.grading).toBe("Felony.");
    expect(financialGain?.elements.join(" ")).toContain("financial gain");

    const closeInAge = getCaliforniaCanonicalRecord("ca-unlawful-sexual-intercourse-261-5-b");
    expect(closeInAge?.citation).toBe("Cal. Penal Code § 261.5(b)");
    expect(closeInAge?.elements.join(" ")).toContain("not more than 3 years older or younger");
    expect(closeInAge?.grading).toBe("Misdemeanor.");

    const ageDifference = getCaliforniaCanonicalRecord("ca-unlawful-sexual-intercourse-261-5-c");
    expect(ageDifference?.citation).toBe("Cal. Penal Code § 261.5(c)");
    expect(ageDifference?.elements.join(" ")).toContain("more than 3 years younger");
    expect(ageDifference?.elements.join(" ")).not.toContain("10 years");
    expect(ageDifference?.grading).toBe("Misdemeanor or felony.");

    expect(getCaliforniaCanonicalRecord("ca-dui-23152-a")?.officialTitle).toBe(
      "Driving Under the Influence of Alcohol",
    );
    expect(getCaliforniaCanonicalRecord("ca-dui-23152-a")?.elements.join(" ")).not.toContain("drug");
    expect(getCaliforniaCanonicalRecord("ca-dui-23152-f")?.citation).toBe(
      "Cal. Vehicle Code § 23152(f)",
    );
    expect(getCaliforniaCanonicalRecord("ca-dui-23152-g")?.citation).toBe(
      "Cal. Vehicle Code § 23152(g)",
    );
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

  it("keeps representative subdivision identity, citation, and source link together for exports", () => {
    const representatives = [
      "ca-gross-vehicular-manslaughter-191-5-a",
      "ca-grand-theft-agricultural-487-b1a",
      "ca-dui-23152-f",
      "ca-burglary-in-the-first-degree",
    ];

    for (const canonicalId of representatives) {
      const record = getCaliforniaCanonicalRecord(canonicalId);
      const charge = getChargeById(canonicalId);
      const sourceUrl = getCaliforniaSourceUrl(canonicalId);

      expect(record, canonicalId).toBeDefined();
      expect(charge?.id, canonicalId).toBe(canonicalId);
      expect(charge?.name, canonicalId).toBe(record?.officialTitle);
      expect(getCaliforniaCitation(canonicalId), canonicalId).toBe(record?.citation);
      expect(getVerifiedCitation(charge!), canonicalId).toBe(record?.citation);
      expect(sourceUrl, canonicalId).toContain("leginfo.legislature.ca.gov");
      expect(getVerifiedSourceUrl(charge!), canonicalId).toBe(sourceUrl);

      const url = new URL(sourceUrl!);
      const section = record!.code.match(/\d+(?:\.\d+)*/)?.[0];
      expect(url.searchParams.get("sectionNum"), canonicalId).toBe(section);
      expect(url.searchParams.get("lawCode"), canonicalId).toBe(record!.lawCode);
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