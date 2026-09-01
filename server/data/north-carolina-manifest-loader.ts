import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import { CHARGE_CITATIONS } from "@shared/criminal-charge-citations";
import {
  NORTH_CAROLINA_MANIFEST_SOURCE,
  parseNorthCarolinaCitation,
  validateNorthCarolinaManifestRecord,
  type NorthCarolinaAuthorityManifest,
  type NorthCarolinaManifestAudit,
  type NorthCarolinaManifestRecord,
} from "./north-carolina-source-database-seed";

export const NORTH_CAROLINA_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/nc-source-manifest.json",
);

export function loadNorthCarolinaAuthorityManifest(
  manifestPath: string = NORTH_CAROLINA_MANIFEST_PATH,
): NorthCarolinaAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: NorthCarolinaManifestRecord[];
    audit?: NorthCarolinaManifestAudit;
  };
  if (
    raw.jurisdiction !== "NC" ||
    raw.source !== NORTH_CAROLINA_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords) ||
    !raw.audit
  ) throw new Error("The committed North Carolina manifest has an invalid authority header");

  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed North Carolina manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "NC")
    .map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    ids.size !== raw.catalogRecords.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) throw new Error(
    "The committed North Carolina manifest must contain exactly one record for every current North Carolina catalog row",
  );
  if (
    raw.audit.schemaVersion !== 1 ||
    raw.audit.catalogRowCount !== raw.catalogRecords.length ||
    raw.audit.parsedReferenceCount !== raw.catalogRecords.reduce(
      (count, record) => count + (record.sourceAudit?.references?.length ?? 0),
      0,
    )
  ) throw new Error("The committed North Carolina manifest has an incomplete source audit");

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
        retrievedAt: provision.retrievedAt ? new Date(provision.retrievedAt) : null,
      }))
      : [],
  })) as NorthCarolinaManifestRecord[];
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.catalogCategory !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !dispositions.has(record.disposition) ||
      !Array.isArray(record.provisions) ||
      !record.sourceAudit ||
      !Array.isArray(record.sourceAudit.references) ||
      !Array.isArray(record.auditFindings) ||
      !Array.isArray(record.dispositionReasons) ||
      record.sourceAudit.references.length !== parseNorthCarolinaCitation(
        CHARGE_CITATIONS[record.chargeId]?.citation ?? "",
      ).length
    ) throw new Error(`The committed North Carolina manifest has an invalid record for ${record.chargeId}`);
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) throw new Error(`Selectable North Carolina record ${record.chargeId} has no authority provision`);
    for (const provision of record.provisions) {
      if (provision.retrievedAt && Number.isNaN(provision.retrievedAt.getTime())) {
        throw new Error(`The committed North Carolina manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validateNorthCarolinaManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  return {
    jurisdiction: "NC",
    generatedAt,
    source: NORTH_CAROLINA_MANIFEST_SOURCE,
    catalogRecords,
    audit: raw.audit,
  };
}