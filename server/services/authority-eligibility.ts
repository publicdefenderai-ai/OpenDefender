import { OHIO_ODOMETER_FRAUD_IDS } from "@shared/ohio-odometer-fraud-batch";
import { OHIO_TRANSIT_VENUES_IDS } from "@shared/ohio-transit-venues-batch";
import { OHIO_LIQUOR_ID_IDS } from "@shared/ohio-liquor-id-batch";
import { OHIO_CIVIL_RIGHTS_IDS } from "@shared/ohio-civil-rights-batch";
import { OHIO_ANIMAL_PROTECTION_IDS } from "@shared/ohio-animal-protection-batch";
import { OHIO_TOOLS_TRANSACTIONS_IDS } from "@shared/ohio-tools-transactions-batch";
import { OHIO_DANGEROUS_DRIVING_IDS } from "@shared/ohio-dangerous-driving-batch";
import { OHIO_CRASH_IDENTITY_IDS } from "@shared/ohio-crash-identity-batch";
import { OHIO_DRIVING_LICENSE_IDS } from "@shared/ohio-driving-license-batch";
import { OHIO_GAMBLING_IDS } from "@shared/ohio-gambling-batch";
import { OHIO_WEAPONS_LOCATION_IDS } from "@shared/ohio-weapons-location-batch";
import { OHIO_DRUG_REMAINDER_IDS } from "@shared/ohio-drug-remainder-batch";
import { OHIO_DRUG_CONDUCT_IDS } from "@shared/ohio-drug-conduct-batch";
import { OHIO_COMMERCIAL_SEX_IDS } from "@shared/ohio-commercial-sex-batch";
import { OHIO_PRIORITY_GAPS_IDS } from "@shared/ohio-priority-gaps-batch";
import { OHIO_PRIVACY_IDS } from "@shared/ohio-privacy-batch";
import { isReviewedOhioChargeId } from "@shared/ohio-reviewed-identity";
import { OHIO_PROTECTION_IDS } from "@shared/ohio-protection-batch";
import { OHIO_FAMILY_IDS } from "@shared/ohio-family-batch";
import { OHIO_PUBLIC_PEACE_IDS } from "@shared/ohio-public-peace-batch";
import { OHIO_CUSTODY_IDS } from "@shared/ohio-custody-batch";
import { OHIO_JUSTICE_IDS } from "@shared/ohio-justice-batch";
import { OHIO_BENEFITS_FRAUD_IDS } from "@shared/ohio-benefits-fraud-batch";
import { OHIO_THEFT_FRAUD_IDS } from "@shared/ohio-theft-fraud-batch";
import { OHIO_RESIDUAL_IDS } from "@shared/ohio-residual-batch";
import { isOhioOdometerFraudSourceFresh } from "../data/ohio-odometer-fraud-source";
import { isOhioTransitVenuesSourceFresh } from "../data/ohio-transit-venues-source";
import { isOhioLiquorIdSourceFresh } from "../data/ohio-liquor-id-source";
import { isOhioCivilRightsSourceFresh } from "../data/ohio-civil-rights-source";
import { isOhioAnimalProtectionSourceFresh } from "../data/ohio-animal-protection-source";
import { isOhioToolsTransactionsSourceFresh } from "../data/ohio-tools-transactions-source";
import { isOhioDangerousDrivingSourceFresh } from "../data/ohio-dangerous-driving-source";
import { isOhioCrashIdentitySourceFresh } from "../data/ohio-crash-identity-source";
import { isOhioDrivingLicenseSourceFresh } from "../data/ohio-driving-license-source";
import { isOhioGamblingSourceFresh } from "../data/ohio-gambling-source";
import { isOhioWeaponsLocationSourceFresh } from "../data/ohio-weapons-location-source";
import { isOhioDrugRemainderSourceFresh } from "../data/ohio-drug-remainder-source";
import { isOhioDrugConductSourceFresh } from "../data/ohio-drug-conduct-source";
import { isOhioCommercialSexSourceFresh } from "../data/ohio-commercial-sex-source";
import { isOhioPriorityGapsSourceFresh } from "../data/ohio-priority-gaps-source";
import { isOhioPrivacySourceFresh } from "../data/ohio-privacy-source";
import { isOhioProtectionSourceFresh } from "../data/ohio-protection-source";
import { isOhioFamilySourceFresh } from "../data/ohio-family-source";
import { isOhioPublicPeaceSourceFresh } from "../data/ohio-public-peace-source";
import { isOhioCustodySourceFresh } from "../data/ohio-custody-source";
import { isOhioJusticeSourceFresh } from "../data/ohio-justice-source";
import { isOhioBenefitsFraudSourceFresh } from "../data/ohio-benefits-fraud-source";
import { isOhioTheftFraudSourceFresh } from "../data/ohio-theft-fraud-source";
import { isOhioResidualSourceFresh } from "../data/ohio-residual-source";
import { FLORIDA_PERSONS_IDS } from "@shared/florida-persons-batch";
import { FLORIDA_ROBBERY_IDS } from "@shared/florida-robbery-batch";
import { FLORIDA_FALSE_REPORTS_IDS } from "@shared/florida-false-reports-batch";
import { FLORIDA_FORGED_INSTRUMENTS_IDS } from "@shared/florida-forged-instruments-batch";
import { FLORIDA_ROAD_RACING_IDS } from "@shared/florida-road-racing-batch";
import { FLORIDA_COURT_OFFICIALS_IDS } from "@shared/florida-court-officials-batch";
import { FLORIDA_JUSTICE_IDS } from "@shared/florida-justice-batch";
import { FLORIDA_CREDIT_CARD_IDS } from "@shared/florida-credit-card-batch";
import { FLORIDA_RESTRAINT_IDS } from "@shared/florida-restraint-batch";
import { FLORIDA_CRASH_FLIGHT_IDS } from "@shared/florida-crash-flight-batch";
import { isFloridaPersonsSourceFresh } from "../data/florida-persons-source";
import { isFloridaRobberySourceFresh } from "../data/florida-robbery-source";
import { isFloridaFalseReportsSourceFresh } from "../data/florida-false-reports-source";
import { isFloridaForgedInstrumentsSourceFresh } from "../data/florida-forged-instruments-source";
import { isFloridaRoadRacingSourceFresh } from "../data/florida-road-racing-source";
import { isFloridaCourtOfficialsSourceFresh } from "../data/florida-court-officials-source";
import { isFloridaJusticeSourceFresh } from "../data/florida-justice-source";
import { isFloridaCreditCardSourceFresh } from "../data/florida-credit-card-source";
import { isFloridaRestraintSourceFresh } from "../data/florida-restraint-source";
import { isFloridaCrashFlightSourceFresh } from "../data/florida-crash-flight-source";
import { OHIO_MAJOR_IDS } from "@shared/ohio-major-batch";
import { isOhioMajorSourceFresh } from "../data/ohio-major-source";
import { isCaliforniaEvidenceFresh } from "@shared/california-freshness";
import { getSelectableCharges } from "@shared/criminal-charges";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "@shared/california-authority";
import { getCurrentAuthoritySelectableChargeIds as getCurrentJurisdictionAuthoritySelectableChargeIds } from "./authority-source-database";
import { getCurrentCaliforniaSelectableChargeIds } from "./california-source-database";
import { isOhioChapter2903PilotFresh } from "../data/ohio-chapter-2903-refresh";
import { isOhioReviewedSourceFresh, OHIO_REVIEWED_SOURCES } from "../data/ohio-reviewed-source";
import { isFloridaReviewedSourceFresh, FLORIDA_REVIEWED_SOURCE_RECORDS } from "../data/florida-reviewed-source-records";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../data/ohio-chapter-2903-source";

export const AUTHORITY_BACKED_JURISDICTIONS = new Set(["CA", "NY", "TX", "FL", "PA", "SC", "IL", "OH", "GA", "NC"]);
const OHIO_CHAPTER_2903_PILOT_IDS = new Set(
  // The shared catalog also includes the separately reviewed batch. Bind this
  // receipt only to its own source records, as the manifest and seed builders do.
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map((record) => record.chargeId),
);

// Cache only within this eligibility evaluation. The next request rereads receipts
// and rechecks the clock; no process-wide freshness or database approval cache.
function createAuthorityChargeGate() {
  const results = new Map<() => boolean, boolean>();
  const fresh = (check: () => boolean) => {
    if (!results.has(check)) results.set(check, check());
    return results.get(check)!;
  };
  return function canUseAuthorityCharge(charge: { id: string; jurisdiction: string }, sharedPilotChecked = false): boolean {
    if (charge.jurisdiction === "OH" && !isReviewedOhioChargeId(charge.id)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_PERSONS_IDS.has(charge.id) && !fresh(isFloridaPersonsSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_ROBBERY_IDS.has(charge.id) && !fresh(isFloridaRobberySourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_FALSE_REPORTS_IDS.has(charge.id) && !fresh(isFloridaFalseReportsSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_FORGED_INSTRUMENTS_IDS.has(charge.id) && !fresh(isFloridaForgedInstrumentsSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_ROAD_RACING_IDS.has(charge.id) && !fresh(isFloridaRoadRacingSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_COURT_OFFICIALS_IDS.has(charge.id) && !fresh(isFloridaCourtOfficialsSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_JUSTICE_IDS.has(charge.id) && !fresh(isFloridaJusticeSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_CREDIT_CARD_IDS.has(charge.id) && !fresh(isFloridaCreditCardSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_RESTRAINT_IDS.has(charge.id) && !fresh(isFloridaRestraintSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_CRASH_FLIGHT_IDS.has(charge.id) && !fresh(isFloridaCrashFlightSourceFresh)) return false;
    if (charge.jurisdiction === "FL" && FLORIDA_REVIEWED_SOURCE_RECORDS.some(source => source.chargeId === charge.id) && !fresh(isFloridaReviewedSourceFresh)) return false;
    if (charge.jurisdiction === "CA" && (!fresh(isCaliforniaEvidenceFresh) || getCaliforniaCanonicalRecord(charge.id)?.currentness.status !== "current")) return false;
    if (charge.jurisdiction === "OH" && OHIO_RESIDUAL_IDS.has(charge.id) && !fresh(isOhioResidualSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_THEFT_FRAUD_IDS.has(charge.id) && !fresh(isOhioTheftFraudSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_ODOMETER_FRAUD_IDS.has(charge.id) && !fresh(isOhioOdometerFraudSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_TRANSIT_VENUES_IDS.has(charge.id) && !fresh(isOhioTransitVenuesSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_LIQUOR_ID_IDS.has(charge.id) && !fresh(isOhioLiquorIdSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_CIVIL_RIGHTS_IDS.has(charge.id) && !fresh(isOhioCivilRightsSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_ANIMAL_PROTECTION_IDS.has(charge.id) && !fresh(isOhioAnimalProtectionSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_TOOLS_TRANSACTIONS_IDS.has(charge.id) && !fresh(isOhioToolsTransactionsSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_DANGEROUS_DRIVING_IDS.has(charge.id) && !fresh(isOhioDangerousDrivingSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_CRASH_IDENTITY_IDS.has(charge.id) && !fresh(isOhioCrashIdentitySourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_DRIVING_LICENSE_IDS.has(charge.id) && !fresh(isOhioDrivingLicenseSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_GAMBLING_IDS.has(charge.id) && !fresh(isOhioGamblingSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_WEAPONS_LOCATION_IDS.has(charge.id) && !fresh(isOhioWeaponsLocationSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_DRUG_REMAINDER_IDS.has(charge.id) && !fresh(isOhioDrugRemainderSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_DRUG_CONDUCT_IDS.has(charge.id) && !fresh(isOhioDrugConductSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_COMMERCIAL_SEX_IDS.has(charge.id) && !fresh(isOhioCommercialSexSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_PRIORITY_GAPS_IDS.has(charge.id) && !fresh(isOhioPriorityGapsSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_PRIVACY_IDS.has(charge.id) && !fresh(isOhioPrivacySourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_PROTECTION_IDS.has(charge.id) && !fresh(isOhioProtectionSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_FAMILY_IDS.has(charge.id) && !fresh(isOhioFamilySourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_PUBLIC_PEACE_IDS.has(charge.id) && !fresh(isOhioPublicPeaceSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_CUSTODY_IDS.has(charge.id) && !fresh(isOhioCustodySourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_JUSTICE_IDS.has(charge.id) && !fresh(isOhioJusticeSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_BENEFITS_FRAUD_IDS.has(charge.id) && !fresh(isOhioBenefitsFraudSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_MAJOR_IDS.has(charge.id) && !fresh(isOhioMajorSourceFresh)) return false;
    if (charge.jurisdiction === "OH" && OHIO_REVIEWED_SOURCES.some(source => source.chargeId === charge.id) && !fresh(isOhioReviewedSourceFresh)) return false;
    return sharedPilotChecked || charge.jurisdiction !== "OH" ||
      !OHIO_CHAPTER_2903_PILOT_IDS.has(charge.id) ||
      fresh(isOhioChapter2903PilotFresh);
  };
}

function getReleaseCheckSelectableChargeIds(): Set<string> | undefined {
  if (process.env.RELEASE_CHECK !== "true") return undefined;

  const rawFixture = process.env.RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS;
  // A missing fixture deliberately falls through to the database-backed path.
  // In the isolated release environment that path fails closed, preserving the
  // normal behavior when eligibility data is unavailable.
  if (rawFixture === undefined) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawFixture);
  } catch {
    throw new Error("Invalid release-check authority eligibility fixture");
  }
  if (!Array.isArray(parsed) || parsed.some((value) => typeof value !== "string")) {
    throw new Error("Invalid release-check authority eligibility fixture");
  }

  const catalogById = new Map(getSelectableCharges().map((charge) => [charge.id, charge]));
  const fixtureIds = new Set<string>();
  for (const id of parsed) {
    const charge = catalogById.get(id);
    if (!charge || !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction)) {
      throw new Error(`Release-check authority eligibility fixture has an invalid charge ID: ${id}`);
    }
    fixtureIds.add(id);
  }

  const expectedCaliforniaIds = new Set(
    CALIFORNIA_CANONICAL_RECORDS
      .filter((record) => record.selectable)
      .map((record) => record.canonicalId),
  );
  const fixtureCaliforniaIds = new Set(
    [...fixtureIds].filter((id) => catalogById.get(id)?.jurisdiction === "CA"),
  );
  const missingCaliforniaIds = [...expectedCaliforniaIds]
    .filter((id) => !fixtureCaliforniaIds.has(id));
  const unexpectedCaliforniaIds = [...fixtureCaliforniaIds]
    .filter((id) => !expectedCaliforniaIds.has(id));
  if (missingCaliforniaIds.length > 0 || unexpectedCaliforniaIds.length > 0) {
    throw new Error(
      `Release-check California authority fixture is out of sync: missing=${missingCaliforniaIds.join(",") || "none"}, unexpected=${unexpectedCaliforniaIds.join(",") || "none"}`,
    );
  }

  return fixtureIds;
}

export async function getCurrentAuthoritySelectableChargeIds(jurisdictions?: readonly string[]): Promise<Set<string>> {
  const requested = jurisdictions === undefined ? undefined : new Set(jurisdictions);
  const charges = getSelectableCharges().filter(charge => !requested || requested.has(charge.jurisdiction));
  const canUseAuthorityCharge = createAuthorityChargeGate();
  const releaseCheckSelectableIds = getReleaseCheckSelectableChargeIds();
  if (releaseCheckSelectableIds) {
    return new Set(
      charges
        .filter((charge) =>
          !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
          (releaseCheckSelectableIds.has(charge.id) && canUseAuthorityCharge(charge)),
        )
        .map((charge) => charge.id),
    );
  }

  const byJurisdiction = new Map(
    await Promise.all(
      [...AUTHORITY_BACKED_JURISDICTIONS].filter(jurisdiction => !requested || requested.has(jurisdiction)).map(async (jurisdiction) => [
        jurisdiction,
        jurisdiction === "CA"
          ? await getCurrentCaliforniaSelectableChargeIds()
          : await getCurrentJurisdictionAuthoritySelectableChargeIds(jurisdiction),
      ] as const),
    ),
  );
  const allowed = new Set<string>();
  for (const charge of charges) {
    if (
      !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
      (byJurisdiction.get(charge.jurisdiction)?.has(charge.id) &&
        canUseAuthorityCharge(charge, true))
    ) {
      allowed.add(charge.id);
    }
  }
  return allowed;
}

export async function isCurrentAuthoritySelectable(chargeId: string): Promise<boolean> {
  return (await getCurrentAuthoritySelectableChargeIds()).has(chargeId);
}

export function filterAuthorityBackedCharges<T extends { jurisdiction: string; id: string }>(
  items: T[],
  allowedIds: Set<string>,
): T[] {
  return items.filter((item) =>
    !AUTHORITY_BACKED_JURISDICTIONS.has(item.jurisdiction) || allowedIds.has(item.id),
  );
}
