import { FLORIDA_PERSONS_SOURCES, isFloridaPersonsSourceFresh } from "./florida-persons-source";
import { FLORIDA_ROBBERY_SOURCES, isFloridaRobberySourceFresh } from "./florida-robbery-source";
import { FLORIDA_FALSE_REPORTS_SOURCES, isFloridaFalseReportsSourceFresh } from "./florida-false-reports-source";
import { FLORIDA_FORGED_INSTRUMENTS_SOURCES, isFloridaForgedInstrumentsSourceFresh } from "./florida-forged-instruments-source";
import { FLORIDA_ROAD_RACING_SOURCES, isFloridaRoadRacingSourceFresh } from "./florida-road-racing-source";
import { FLORIDA_COURT_OFFICIALS_SOURCES, isFloridaCourtOfficialsSourceFresh } from "./florida-court-officials-source";
import { FLORIDA_JUSTICE_SOURCES, isFloridaJusticeSourceFresh } from "./florida-justice-source";
import { FLORIDA_CREDIT_CARD_SOURCES, isFloridaCreditCardSourceFresh } from "./florida-credit-card-source";
import { FLORIDA_RESTRAINT_SOURCES, isFloridaRestraintSourceFresh } from "./florida-restraint-source";
import { FLORIDA_CRASH_FLIGHT_SOURCES, isFloridaCrashFlightSourceFresh } from "./florida-crash-flight-source";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  buildFloridaReviewedManifestRecords,
  FLORIDA_MANIFEST_SOURCE,
  validateFloridaManifestRecord,
  type FloridaAuthorityManifest,
} from "./florida-source-database-seed";
import {
  FLORIDA_REVIEWED_SOURCE_RECORDS,
  isFloridaReviewedSourceFresh,
} from "./florida-reviewed-source-records";

export const FLORIDA_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/fl-source-manifest.json",
);

export function loadFloridaAuthorityManifest(
  manifestPath: string = FLORIDA_MANIFEST_PATH,
  now: Date = new Date(),
): FloridaAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: AuthorityCatalogRecord[];
  };
  if (
    raw.jurisdiction !== "FL" ||
    raw.source !== FLORIDA_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) {
    throw new Error("The committed Florida manifest has an invalid authority header");
  }
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Florida manifest has an invalid generation timestamp");
  }

  const sourceFirstIds = new Set([...FLORIDA_REVIEWED_SOURCE_RECORDS, ...FLORIDA_PERSONS_SOURCES, ...FLORIDA_ROBBERY_SOURCES, ...FLORIDA_FALSE_REPORTS_SOURCES, ...FLORIDA_FORGED_INSTRUMENTS_SOURCES, ...FLORIDA_ROAD_RACING_SOURCES, ...FLORIDA_COURT_OFFICIALS_SOURCES, ...FLORIDA_JUSTICE_SOURCES, ...FLORIDA_CREDIT_CARD_SOURCES, ...FLORIDA_RESTRAINT_SOURCES, ...FLORIDA_CRASH_FLIGHT_SOURCES].map(row => row.chargeId));
  if (raw.catalogRecords.some(record => sourceFirstIds.has(record.chargeId))) {
    throw new Error("The legacy Florida manifest must not shadow a reviewed source-first record");
  }
  const legacyExpectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "FL")
    .filter((charge) => !sourceFirstIds.has(charge.id))
    .map((charge) => charge.id);
  const legacyIds = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    legacyIds.size !== raw.catalogRecords.length ||
    legacyIds.size !== legacyExpectedIds.length ||
    legacyExpectedIds.some((id) => !legacyIds.has(id))
  ) {
    throw new Error(
      "The committed Florida manifest must contain exactly one record for every current Florida catalog row",
    );
  }

  const reviewedFresh = isFloridaReviewedSourceFresh(now);
  const robberyFresh = isFloridaRobberySourceFresh(now);
  const falseReportsFresh = isFloridaFalseReportsSourceFresh(now);
  const forgedInstrumentsFresh = isFloridaForgedInstrumentsSourceFresh(now);
  const roadRacingFresh = isFloridaRoadRacingSourceFresh(now);
  const courtOfficialsFresh = isFloridaCourtOfficialsSourceFresh(now);
  const justiceFresh = isFloridaJusticeSourceFresh(now);
  const creditCardFresh = isFloridaCreditCardSourceFresh(now);
  const restraintFresh = isFloridaRestraintSourceFresh(now);
  const crashFlightFresh = isFloridaCrashFlightSourceFresh(now);
  const personsFresh = isFloridaPersonsSourceFresh(now);
  const publishableReviewedIds = new Set([...(reviewedFresh ? FLORIDA_REVIEWED_SOURCE_RECORDS : []), ...(personsFresh ? FLORIDA_PERSONS_SOURCES : []), ...(robberyFresh ? FLORIDA_ROBBERY_SOURCES : []), ...(falseReportsFresh ? FLORIDA_FALSE_REPORTS_SOURCES : []), ...(forgedInstrumentsFresh ? FLORIDA_FORGED_INSTRUMENTS_SOURCES : []), ...(roadRacingFresh ? FLORIDA_ROAD_RACING_SOURCES : []), ...(courtOfficialsFresh ? FLORIDA_COURT_OFFICIALS_SOURCES : []), ...(justiceFresh ? FLORIDA_JUSTICE_SOURCES : []), ...(creditCardFresh ? FLORIDA_CREDIT_CARD_SOURCES : []), ...(restraintFresh ? FLORIDA_RESTRAINT_SOURCES : []), ...(crashFlightFresh ? FLORIDA_CRASH_FLIGHT_SOURCES : [])].map(row => row.chargeId));
  const reviewedRetrievals = [...FLORIDA_REVIEWED_SOURCE_RECORDS, ...FLORIDA_PERSONS_SOURCES, ...FLORIDA_ROBBERY_SOURCES, ...FLORIDA_FALSE_REPORTS_SOURCES, ...FLORIDA_FORGED_INSTRUMENTS_SOURCES, ...FLORIDA_ROAD_RACING_SOURCES, ...FLORIDA_COURT_OFFICIALS_SOURCES, ...FLORIDA_JUSTICE_SOURCES, ...FLORIDA_CREDIT_CARD_SOURCES, ...FLORIDA_RESTRAINT_SOURCES, ...FLORIDA_CRASH_FLIGHT_SOURCES].flatMap(record =>
    record.dependencies.map(document => Date.parse(document.retrievedAt)));
  const manifestGeneratedAt = reviewedRetrievals.length
    ? new Date(Math.max(generatedAt.getTime(), ...reviewedRetrievals))
    : generatedAt;
  const records = [
    ...raw.catalogRecords,
    ...(reviewedFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt) : []),
    ...(personsFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_PERSONS_SOURCES) : []),
    ...(robberyFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_ROBBERY_SOURCES) : []),
    ...(falseReportsFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_FALSE_REPORTS_SOURCES) : []),
    ...(forgedInstrumentsFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_FORGED_INSTRUMENTS_SOURCES) : []),
    ...(roadRacingFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_ROAD_RACING_SOURCES) : []),
    ...(courtOfficialsFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_COURT_OFFICIALS_SOURCES) : []),
    ...(justiceFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_JUSTICE_SOURCES) : []),
    ...(creditCardFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_CREDIT_CARD_SOURCES) : []),
    ...(restraintFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_RESTRAINT_SOURCES) : []),
    ...(crashFlightFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt, FLORIDA_CRASH_FLIGHT_SOURCES) : []),
  ];
  const expectedIds = criminalCharges
    .filter(charge => charge.jurisdiction === "FL" &&
      (publishableReviewedIds.has(charge.id) || !sourceFirstIds.has(charge.id)))
    .map(charge => charge.id);
  const ids = new Set(records.map(record => record.chargeId));
  if (ids.size !== records.length || ids.size !== expectedIds.length ||
      expectedIds.some(id => !ids.has(id))) {
    throw new Error(
      "The Florida manifest composition must account for every current publishable catalog row",
    );
  }

  const catalogRecords = records.map((record) => ({
    ...record,
    provisions: record.provisions.map((provision) => ({
      ...provision,
      retrievedAt: provision.retrievedAt
        ? new Date(provision.retrievedAt)
        : null,
    })),
  }));
  const validDispositions = new Set([
    "retain",
    "exact_alias_rename",
    "require_exact_reselection",
    "remove",
  ]);
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !validDispositions.has(record.disposition) ||
      !Array.isArray(record.provisions)
    ) {
      throw new Error(`The committed Florida manifest has an invalid record for ${record.chargeId}`);
    }
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) {
      throw new Error(`Selectable Florida record ${record.chargeId} has no authority provision`);
    }
    for (const provision of record.provisions) {
      const retrievedAt = provision.retrievedAt
        ? new Date(provision.retrievedAt)
        : null;
      if (retrievedAt && Number.isNaN(retrievedAt.getTime())) {
        throw new Error(`The committed Florida manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validateFloridaManifestRecord(record);
    if (validationError) {
      throw new Error(`${record.chargeId}: ${validationError}`);
    }
  }

  return {
    jurisdiction: "FL",
    generatedAt: manifestGeneratedAt,
    source: FLORIDA_MANIFEST_SOURCE,
    catalogRecords,
  };
}