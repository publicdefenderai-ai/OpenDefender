import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  ILLINOIS_MANIFEST_SOURCE,
  validateIllinoisManifestRecord,
  type IllinoisAuthorityManifest,
} from "./illinois-source-database-seed";

export const ILLINOIS_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/il-source-manifest.json",
);

export function loadIllinoisAuthorityManifest(
  manifestPath: string = ILLINOIS_MANIFEST_PATH,
): IllinoisAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: AuthorityCatalogRecord[];
  };
  if (
    raw.jurisdiction !== "IL" ||
    raw.source !== ILLINOIS_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) throw new Error("The committed Illinois manifest has an invalid authority header");
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Illinois manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "IL")
    .map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    ids.size !== raw.catalogRecords.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) throw new Error(
    "The committed Illinois manifest must contain exactly one record for every current Illinois catalog row",
  );

  const dispositions = new Set([
    "retain",
    "exact_alias_rename",
    "require_exact_reselection",
    "remove",
  ]);
  const catalogRecords = raw.catalogRecords.map((record) => ({
    ...record,
    provisions: Array.isArray(record.provisions)
      ? record.provisions.map((provision) => ({
        ...provision,
        retrievedAt: provision.retrievedAt
          ? new Date(provision.retrievedAt)
          : null,
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
    ) throw new Error(`The committed Illinois manifest has an invalid record for ${record.chargeId}`);
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) throw new Error(`Selectable Illinois record ${record.chargeId} has no authority provision`);
    for (const provision of record.provisions) {
      if (provision.retrievedAt && Number.isNaN(provision.retrievedAt.getTime())) {
        throw new Error(`The committed Illinois manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validateIllinoisManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  return {
    jurisdiction: "IL",
    generatedAt,
    source: ILLINOIS_MANIFEST_SOURCE,
    catalogRecords,
  };
}