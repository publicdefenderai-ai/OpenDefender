import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import { CHARGE_CITATIONS } from "@shared/criminal-charge-citations";
import {
  SOUTH_CAROLINA_MANIFEST_SOURCE,
  parseSouthCarolinaCitation,
  validateSouthCarolinaManifestRecord,
  type SouthCarolinaAuthorityManifest,
  type SouthCarolinaManifestAudit,
  type SouthCarolinaManifestRecord,
} from "./south-carolina-source-database-seed";

export const SOUTH_CAROLINA_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/sc-source-manifest.json",
);

export function loadSouthCarolinaAuthorityManifest(
  manifestPath: string = SOUTH_CAROLINA_MANIFEST_PATH,
): SouthCarolinaAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: SouthCarolinaManifestRecord[];
    audit?: SouthCarolinaManifestAudit;
  };
  if (
    raw.jurisdiction !== "SC" ||
    raw.source !== SOUTH_CAROLINA_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) throw new Error("The committed South Carolina manifest has an invalid authority header");
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed South Carolina manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges.filter((charge) => charge.jurisdiction === "SC").map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    ids.size !== raw.catalogRecords.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) throw new Error("The committed South Carolina manifest must contain exactly one record for every current South Carolina catalog row");
  if (
    !raw.audit ||
    raw.audit.schemaVersion !== 1 ||
    raw.audit.catalogRowCount !== raw.catalogRecords.length ||
    raw.audit.parsedReferenceCount !== raw.catalogRecords.reduce(
      (count, record) => count + (record.sourceAudit?.references?.length ?? 0),
      0,
    )
  ) throw new Error("The committed South Carolina manifest is missing its complete source audit");

  const dispositions = new Set(["retain", "exact_alias_rename", "require_exact_reselection", "remove"]);
  const catalogRecords = raw.catalogRecords.map((record) => ({
    ...record,
    provisions: Array.isArray(record.provisions)
      ? record.provisions.map((provision) => ({
        ...provision,
        retrievedAt: provision.retrievedAt ? new Date(provision.retrievedAt) : null,
      }))
      : [],
  })) as SouthCarolinaManifestRecord[];
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.catalogCategory !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !dispositions.has(record.disposition) ||
      !Array.isArray(record.provisions)
    ) throw new Error(`The committed South Carolina manifest has an invalid record for ${record.chargeId}`);
    const references = record.sourceAudit?.references;
    if (
      !record.sourceAudit ||
      !Array.isArray(references) ||
      references.length !== parseSouthCarolinaCitation(
        CHARGE_CITATIONS[record.chargeId]?.citation ?? "",
      ).length ||
      !Array.isArray(record.auditFindings) ||
      !Array.isArray(record.dispositionReasons)
    ) throw new Error(`The committed South Carolina manifest has an incomplete source audit for ${record.chargeId}`);
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) throw new Error(`Selectable South Carolina record ${record.chargeId} has no authority provision`);
    for (const provision of record.provisions) {
      if (provision.retrievedAt && Number.isNaN(provision.retrievedAt.getTime())) {
        throw new Error(`The committed South Carolina manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validateSouthCarolinaManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  return {
    jurisdiction: "SC",
    generatedAt,
    source: SOUTH_CAROLINA_MANIFEST_SOURCE,
    catalogRecords,
    audit: raw.audit,
  };
}