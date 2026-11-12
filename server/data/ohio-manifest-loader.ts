import { OHIO_PRIORITY_GAPS_SOURCES, isOhioPriorityGapsSourceFresh } from "./ohio-priority-gaps-source";
import { OHIO_PRIVACY_SOURCES, isOhioPrivacySourceFresh } from "./ohio-privacy-source";
import { OHIO_PROTECTION_SOURCES, isOhioProtectionSourceFresh } from "./ohio-protection-source";
import { OHIO_FAMILY_SOURCES, isOhioFamilySourceFresh } from "./ohio-family-source";
import { OHIO_PUBLIC_PEACE_SOURCES, isOhioPublicPeaceSourceFresh } from "./ohio-public-peace-source";
import { OHIO_CUSTODY_SOURCES, isOhioCustodySourceFresh } from "./ohio-custody-source";
import { OHIO_JUSTICE_SOURCES, isOhioJusticeSourceFresh } from "./ohio-justice-source";
import { OHIO_BENEFITS_FRAUD_SOURCES, isOhioBenefitsFraudSourceFresh } from "./ohio-benefits-fraud-source";
import { OHIO_THEFT_FRAUD_SOURCES, isOhioTheftFraudSourceFresh } from "./ohio-theft-fraud-source";
import { OHIO_RESIDUAL_SOURCES, isOhioResidualSourceFresh } from "./ohio-residual-source";
import { OHIO_MAJOR_SOURCES, isOhioMajorSourceFresh } from "./ohio-major-source";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import { OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION } from "@shared/ohio-chapter-2903-catalog";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  buildOhioChapter2903PilotManifestRecords,
  buildOhioReviewedManifestRecords,
  OHIO_MANIFEST_SOURCE,
  validateOhioManifestRecord,
  type OhioAuthorityManifest,
} from "./ohio-source-database-seed";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "./ohio-chapter-2903-source";
import { isOhioReviewedSourceFresh, OHIO_REVIEWED_SOURCES } from "./ohio-reviewed-source";
import {
  isOhioChapter2903PilotFresh,
  validateOhioChapter2903RefreshReceipt,
} from "./ohio-chapter-2903-refresh";

export const OHIO_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/oh-source-manifest.json",
);

export function loadOhioAuthorityManifest(
  manifestPath: string = OHIO_MANIFEST_PATH,
  now: Date = new Date(),
  receipt?: unknown,
): OhioAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: AuthorityCatalogRecord[];
  };
  if (
    raw.jurisdiction !== "OH" ||
    raw.source !== OHIO_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) throw new Error("The committed Ohio manifest has an invalid authority header");

  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Ohio manifest has an invalid generation timestamp");
  }
  const sourceFirstIds = new Set(
    [
      ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(record => record.chargeId),
      ...OHIO_REVIEWED_SOURCES.map(record => record.chargeId),
      ...OHIO_MAJOR_SOURCES.map(record => record.chargeId),
      ...OHIO_RESIDUAL_SOURCES.map(record => record.chargeId),
      ...OHIO_THEFT_FRAUD_SOURCES.map(record => record.chargeId),
      ...OHIO_BENEFITS_FRAUD_SOURCES.map(record => record.chargeId),
      ...OHIO_JUSTICE_SOURCES.map(record => record.chargeId),
      ...OHIO_PRIORITY_GAPS_SOURCES.map(record => record.chargeId),
      ...OHIO_PRIVACY_SOURCES.map(record => record.chargeId),
      ...OHIO_PROTECTION_SOURCES.map(record => record.chargeId),
      ...OHIO_FAMILY_SOURCES.map(record => record.chargeId),
      ...OHIO_PUBLIC_PEACE_SOURCES.map(record => record.chargeId),
      ...OHIO_CUSTODY_SOURCES.map(record => record.chargeId),
    ],
  );
  if (raw.catalogRecords.some((record) => sourceFirstIds.has(record.chargeId))) {
    throw new Error(
      "The legacy Ohio manifest must not shadow a source-first Chapter 2903 canonical record",
    );
  }
  const sourceFirstGeneratedAt = new Date(Math.max(
    ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.flatMap((record) => [
      record.offense.retrievedAt.getTime(),
      record.penalty.retrievedAt.getTime(),
      ...(record.penaltyFine ? [record.penaltyFine.retrievedAt.getTime()] : []),
      ...(record.additionalEvidence ?? []).map(document => document.retrievedAt.getTime()),
      ...(record.additionalPenalties ?? []).map(document => document.retrievedAt.getTime()),
    ]),
    ...[...OHIO_REVIEWED_SOURCES, ...OHIO_MAJOR_SOURCES, ...OHIO_RESIDUAL_SOURCES, ...OHIO_THEFT_FRAUD_SOURCES, ...OHIO_BENEFITS_FRAUD_SOURCES, ...OHIO_JUSTICE_SOURCES, ...OHIO_CUSTODY_SOURCES, ...OHIO_PUBLIC_PEACE_SOURCES, ...OHIO_FAMILY_SOURCES, ...OHIO_PROTECTION_SOURCES, ...OHIO_PRIVACY_SOURCES, ...OHIO_PRIORITY_GAPS_SOURCES].flatMap(record => [
      Date.parse(record.offense.retrievedAt),
      ...record.dependencies.map(document => Date.parse(document.retrievedAt)),
    ]),
  ));
  // The older generated manifest remains the complete legacy accounting
  // ledger. The bounded pilot is composed here from its separately pinned
  // official extraction, so the checked-in selector manifest never becomes a
  // vehicle for an unsourced name-only rename.
  const manifestGeneratedAt = generatedAt > sourceFirstGeneratedAt
    ? generatedAt
    : sourceFirstGeneratedAt;
  const reviewedFresh = isOhioReviewedSourceFresh(now);
  const majorFresh = isOhioMajorSourceFresh(now);
  const justiceFresh = isOhioJusticeSourceFresh(now);
  const priorityGapsFresh = isOhioPriorityGapsSourceFresh(now);
  const privacyFresh = isOhioPrivacySourceFresh(now);
  const protectionFresh = isOhioProtectionSourceFresh(now);
  const familyFresh = isOhioFamilySourceFresh(now);
  const publicPeaceFresh = isOhioPublicPeaceSourceFresh(now);
  const custodyFresh = isOhioCustodySourceFresh(now);
  const benefitsFraudFresh = isOhioBenefitsFraudSourceFresh(now);
  const theftFraudFresh = isOhioTheftFraudSourceFresh(now);
  const residualFresh = isOhioResidualSourceFresh(now);
  // An explicit receipt comes from the durable runtime ledger. Passing null
  // deliberately fails closed; omitting the argument preserves the
  // file-backed offline behavior used by manifest/build tests.
  let pilotFresh: boolean;
  if (receipt === undefined) {
    // Vitest is the deliberate offline/build fixture boundary. Runtime
    // callers must provide the durable receipt (or null to fail closed).
    pilotFresh = process.env.VITEST === "true"
      ? isOhioChapter2903PilotFresh(now)
      : false;
  } else if (receipt === null) {
    pilotFresh = false;
  } else {
    const validationError = validateOhioChapter2903RefreshReceipt(receipt, now);
    if (validationError) throw new Error(validationError);
    pilotFresh = true;
  }
  const recordsWithPilot = [
    ...raw.catalogRecords,
    ...(pilotFresh
      ? buildOhioChapter2903PilotManifestRecords(manifestGeneratedAt)
      : []),
    ...(reviewedFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt) : []),
    ...(majorFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_MAJOR_SOURCES) : []),
    ...(residualFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_RESIDUAL_SOURCES) : []),
    ...(justiceFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_JUSTICE_SOURCES) : []),
    ...(priorityGapsFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_PRIORITY_GAPS_SOURCES) : []),
    ...(privacyFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_PRIVACY_SOURCES) : []),
    ...(protectionFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_PROTECTION_SOURCES) : []),
    ...(familyFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_FAMILY_SOURCES) : []),
    ...(publicPeaceFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_PUBLIC_PEACE_SOURCES) : []),
    ...(custodyFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_CUSTODY_SOURCES) : []),
    ...(benefitsFraudFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_BENEFITS_FRAUD_SOURCES) : []),
    ...(theftFraudFresh ? buildOhioReviewedManifestRecords(manifestGeneratedAt, OHIO_THEFT_FRAUD_SOURCES) : []),
  ];
  const expectedIds = criminalCharges
    .filter((charge) =>
      charge.jurisdiction === "OH" &&
      (residualFresh || !OHIO_RESIDUAL_SOURCES.some(record => record.chargeId === charge.id)) &&
      (justiceFresh || !OHIO_JUSTICE_SOURCES.some(record => record.chargeId === charge.id)) &&
      (priorityGapsFresh || !OHIO_PRIORITY_GAPS_SOURCES.some(record => record.chargeId === charge.id)) &&
      (privacyFresh || !OHIO_PRIVACY_SOURCES.some(record => record.chargeId === charge.id)) &&
      (protectionFresh || !OHIO_PROTECTION_SOURCES.some(record => record.chargeId === charge.id)) &&
      (familyFresh || !OHIO_FAMILY_SOURCES.some(record => record.chargeId === charge.id)) &&
      (publicPeaceFresh || !OHIO_PUBLIC_PEACE_SOURCES.some(record => record.chargeId === charge.id)) &&
      (custodyFresh || !OHIO_CUSTODY_SOURCES.some(record => record.chargeId === charge.id)) &&
      (benefitsFraudFresh || !OHIO_BENEFITS_FRAUD_SOURCES.some(record => record.chargeId === charge.id)) &&
      (theftFraudFresh || !OHIO_THEFT_FRAUD_SOURCES.some(record => record.chargeId === charge.id)) &&
      (majorFresh || !OHIO_MAJOR_SOURCES.some(record => record.chargeId === charge.id)) &&
      (pilotFresh || !OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.some(record => record.chargeId === charge.id)) &&
      (reviewedFresh || !OHIO_REVIEWED_SOURCES.some(record => record.chargeId === charge.id))
    )
    .map((charge) => charge.id);
  const ids = new Set(recordsWithPilot.map((record) => record.chargeId));
  if (
    ids.size !== recordsWithPilot.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) throw new Error(
    "The committed Ohio manifest must contain exactly one record for every current Ohio catalog row",
  );

  const dispositions = new Set([
    "retain",
    "exact_alias_rename",
    "require_exact_reselection",
    "remove",
  ]);
  const catalogRecords = recordsWithPilot.map((record) => ({
    ...record,
    ...(OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION.has(record.chargeId) ? {
      disposition: "require_exact_reselection" as const,
      dispositionReason: "Historical catalog entry retained for audit. Reselect the independently source-derived offense; do not silently migrate a saved case.",
    } : {}),
    provisions: OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION.has(record.chargeId) ? [] : Array.isArray(record.provisions)
      ? record.provisions.map((provision) => ({
        ...provision,
        retrievedAt: provision.retrievedAt ? new Date(provision.retrievedAt) : null,
      }))
      : [],
  }));
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.catalogCategory !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !dispositions.has(record.disposition) ||
      !Array.isArray(record.provisions)
    ) throw new Error(`The committed Ohio manifest has an invalid record for ${record.chargeId}`);
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) throw new Error(`Selectable Ohio record ${record.chargeId} has no authority provision`);
    for (const provision of record.provisions) {
      if (
        provision.retrievedAt &&
        Number.isNaN(provision.retrievedAt.getTime())
      ) throw new Error(`The committed Ohio manifest has an invalid retrieval date for ${record.chargeId}`);
    }
    const validationError = validateOhioManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  return {
    jurisdiction: "OH",
    generatedAt: manifestGeneratedAt,
    source: OHIO_MANIFEST_SOURCE,
    catalogRecords,
  };
}
