import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  NewYorkAuthorityManifest,
  NewYorkCatalogRecord,
} from "./new-york-source-database-seed";

export const NEW_YORK_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/ny-source-manifest.json",
);

export function loadNewYorkAuthorityManifest(
  manifestPath: string = NEW_YORK_MANIFEST_PATH,
): NewYorkAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction: "NY";
    generatedAt: string;
    source: string;
    catalogRecords: NewYorkCatalogRecord[];
  };

  if (
    raw.jurisdiction !== "NY" ||
    raw.source !== "NY Open Legislation API (legislation.nysenate.gov)" ||
    !Array.isArray(raw.catalogRecords)
  ) {
    throw new Error("The committed New York manifest has an invalid authority header");
  }

  return {
    jurisdiction: "NY",
    generatedAt: new Date(raw.generatedAt),
    source: raw.source as NewYorkAuthorityManifest["source"],
    catalogRecords: raw.catalogRecords.map((record) => ({
      ...record,
      provisions: record.provisions.map((provision) => ({
        ...provision,
        retrievedAt: provision.retrievedAt
          ? new Date(provision.retrievedAt)
          : null,
      })),
    })),
  };
}