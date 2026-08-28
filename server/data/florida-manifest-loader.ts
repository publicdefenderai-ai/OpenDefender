import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  FLORIDA_MANIFEST_SOURCE,
  validateFloridaManifestRecord,
  type FloridaAuthorityManifest,
} from "./florida-source-database-seed";

export const FLORIDA_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/fl-source-manifest.json",
);

export function loadFloridaAuthorityManifest(
  manifestPath: string = FLORIDA_MANIFEST_PATH,
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

  const expectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "FL")
    .map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    ids.size !== raw.catalogRecords.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) {
    throw new Error(
      "The committed Florida manifest must contain exactly one record for every current Florida catalog row",
    );
  }

  const catalogRecords = raw.catalogRecords.map((record) => ({
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
    generatedAt,
    source: FLORIDA_MANIFEST_SOURCE,
    catalogRecords,
  };
}