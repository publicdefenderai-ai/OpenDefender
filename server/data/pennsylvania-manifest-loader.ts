import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  PENNSYLVANIA_MANIFEST_SOURCE,
  validatePennsylvaniaManifestRecord,
  type PennsylvaniaAuthorityManifest,
} from "./pennsylvania-source-database-seed";

export const PENNSYLVANIA_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/pa-source-manifest.json",
);

export function loadPennsylvaniaAuthorityManifest(
  manifestPath: string = PENNSYLVANIA_MANIFEST_PATH,
): PennsylvaniaAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: AuthorityCatalogRecord[];
  };
  if (
    raw.jurisdiction !== "PA" ||
    raw.source !== PENNSYLVANIA_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) throw new Error("The committed Pennsylvania manifest has an invalid authority header");
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Pennsylvania manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges.filter((charge) => charge.jurisdiction === "PA").map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (ids.size !== raw.catalogRecords.length || ids.size !== expectedIds.length || expectedIds.some((id) => !ids.has(id))) {
    throw new Error("The committed Pennsylvania manifest must contain exactly one record for every current Pennsylvania catalog row");
  }
  const catalogRecords = raw.catalogRecords.map((record) => {
    const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
    return {
    ...record,
    ...(charge ? {
      catalogLabel: record.catalogLabel ?? charge.name,
      catalogCode: record.catalogCode ?? charge.code,
      catalogCategory: record.catalogCategory ?? charge.category,
      disposition: record.disposition ?? "require_exact_reselection",
      dispositionReason: record.dispositionReason ??
        "This Pennsylvania statute has not been verified against the official Pennsylvania General Assembly source.",
      canonicalTitle: record.canonicalTitle ?? null,
      apiStatus: record.apiStatus ?? "placeholder",
    } : {}),
    provisions: Array.isArray(record.provisions) ? record.provisions.map((provision) => ({
      ...provision,
      retrievedAt: provision.retrievedAt ? new Date(provision.retrievedAt) : null,
    })) : [],
  };
  });
  const dispositions = new Set(["retain", "exact_alias_rename", "require_exact_reselection", "remove"]);
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !dispositions.has(record.disposition) ||
      !Array.isArray(record.provisions)
    ) throw new Error(`The committed Pennsylvania manifest has an invalid record for ${record.chargeId}`);
    if ((record.disposition === "retain" || record.disposition === "exact_alias_rename") && record.provisions.length === 0) {
      throw new Error(`Selectable Pennsylvania record ${record.chargeId} has no authority provision`);
    }
    for (const provision of record.provisions) {
      if (provision.retrievedAt && Number.isNaN(provision.retrievedAt.getTime())) {
        throw new Error(`The committed Pennsylvania manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validatePennsylvaniaManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  return { jurisdiction: "PA", generatedAt, source: PENNSYLVANIA_MANIFEST_SOURCE, catalogRecords };
}