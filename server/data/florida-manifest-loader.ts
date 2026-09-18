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

  const sourceFirstIds = new Set(FLORIDA_REVIEWED_SOURCE_RECORDS.map(row => row.chargeId));
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
  const reviewedRetrievals = FLORIDA_REVIEWED_SOURCE_RECORDS.flatMap(record =>
    record.dependencies.map(document => Date.parse(document.retrievedAt)));
  const manifestGeneratedAt = reviewedRetrievals.length
    ? new Date(Math.max(generatedAt.getTime(), ...reviewedRetrievals))
    : generatedAt;
  const records = [
    ...raw.catalogRecords,
    ...(reviewedFresh ? buildFloridaReviewedManifestRecords(manifestGeneratedAt) : []),
  ];
  const expectedIds = criminalCharges
    .filter(charge => charge.jurisdiction === "FL" &&
      (reviewedFresh || !sourceFirstIds.has(charge.id)))
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