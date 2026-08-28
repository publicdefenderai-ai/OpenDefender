import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import type { TexasAuthorityManifest } from "./texas-source-database-seed";

export const TEXAS_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/tx-source-manifest.json",
);

export function loadTexasAuthorityManifest(
  manifestPath: string = TEXAS_MANIFEST_PATH,
): TexasAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: AuthorityCatalogRecord[];
  };
  if (
    raw.jurisdiction !== "TX" ||
    raw.source !== "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)" ||
    !Array.isArray(raw.catalogRecords)
  ) {
    throw new Error("The committed Texas manifest has an invalid authority header");
  }
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Texas manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "TX")
    .map((charge) => charge.id);
  const chargeIds = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    chargeIds.size !== raw.catalogRecords.length ||
    chargeIds.size !== expectedIds.length ||
    expectedIds.some((id) => !chargeIds.has(id))
  ) {
    throw new Error("The committed Texas manifest must contain exactly one record for every current Texas catalog row");
  }
  const validDispositions = new Set([
    "retain",
    "exact_alias_rename",
    "require_exact_reselection",
    "remove",
  ]);
  for (const record of raw.catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !validDispositions.has(record.disposition) ||
      !Array.isArray(record.provisions)
    ) {
      throw new Error(`The committed Texas manifest has an invalid record for ${record.chargeId}`);
    }
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) {
      throw new Error(`Selectable Texas record ${record.chargeId} has no authority provision`);
    }
  }
  return {
    jurisdiction: "TX",
    generatedAt,
    source: raw.source,
    catalogRecords: raw.catalogRecords.map((record) => ({
      ...record,
      provisions: Array.isArray(record.provisions)
        ? record.provisions.map((provision) => ({
          ...provision,
          retrievedAt: provision.retrievedAt
            ? new Date(provision.retrievedAt)
            : null,
        }))
        : [],
    })),
  };
}