import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import type { AuthorityCatalogRecord } from "../services/authority-source-database";
import {
  buildOhioChapter2903PilotManifestRecords,
  OHIO_MANIFEST_SOURCE,
  validateOhioManifestRecord,
  type OhioAuthorityManifest,
} from "./ohio-source-database-seed";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "./ohio-chapter-2903-source";
import { isOhioChapter2903PilotFresh } from "./ohio-chapter-2903-refresh";

export const OHIO_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/oh-source-manifest.json",
);

export function loadOhioAuthorityManifest(
  manifestPath: string = OHIO_MANIFEST_PATH,
  now: Date = new Date(),
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
    OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map((record) => record.chargeId),
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
    ]),
  ));
  // The older generated manifest remains the complete legacy accounting
  // ledger. The bounded pilot is composed here from its separately pinned
  // official extraction, so the checked-in selector manifest never becomes a
  // vehicle for an unsourced name-only rename.
  const manifestGeneratedAt = generatedAt > sourceFirstGeneratedAt
    ? generatedAt
    : sourceFirstGeneratedAt;
  const pilotFresh = isOhioChapter2903PilotFresh(now);
  const recordsWithPilot = [
    ...raw.catalogRecords,
    ...(pilotFresh
      ? buildOhioChapter2903PilotManifestRecords(manifestGeneratedAt)
      : []),
  ];
  const expectedIds = criminalCharges
    .filter((charge) =>
      charge.jurisdiction === "OH" &&
      (pilotFresh || !sourceFirstIds.has(charge.id))
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
    provisions: Array.isArray(record.provisions)
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