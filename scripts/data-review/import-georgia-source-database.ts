/**
 * Build Georgia's committed authority manifest.
 *
 * The Georgia General Assembly public API exposes legislation metadata and
 * code-title names, but not codified section text. The current Official Code
 * of Georgia Annotated section service requires authenticated Lexis access.
 * Never substitute Justia, OpenLaws, jury instructions, or training data:
 * every current Georgia catalog row is therefore withheld until an official
 * section-text contract is available.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import {
  buildGeorgiaManifestRecord,
  GEORGIA_MANIFEST_SOURCE,
  type GeorgiaAuthorityManifest,
} from "../../server/data/georgia-source-database-seed";

export const GEORGIA_OFFICIAL_SOURCE_LIMITATION =
  "The Georgia General Assembly public API exposes legislation metadata and code-title names, but not current codified section text; the authenticated Official Code of Georgia Annotated service is not a public section-document contract.";

export function buildGeorgiaAuthorityManifest(
  generatedAt = new Date(),
): GeorgiaAuthorityManifest {
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "GA");
  return {
    jurisdiction: "GA",
    generatedAt,
    source: GEORGIA_MANIFEST_SOURCE,
    catalogRecords: charges.map((charge) =>
      buildGeorgiaManifestRecord(
        charge,
        [],
        generatedAt,
        GEORGIA_OFFICIAL_SOURCE_LIMITATION,
      ),
    ),
  };
}

export function main(): void {
  const manifest = buildGeorgiaAuthorityManifest();
  const outputPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/ga-source-manifest.json",
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const withheld = manifest.catalogRecords.filter((record) =>
    record.disposition !== "retain" && record.disposition !== "exact_alias_rename",
  ).length;
  console.log(JSON.stringify({
    jurisdiction: "GA",
    manifestRecords: manifest.catalogRecords.length,
    selectableCharges: manifest.catalogRecords.length - withheld,
    withheldCharges: withheld,
    source: GEORGIA_MANIFEST_SOURCE,
    sourceLimitation: GEORGIA_OFFICIAL_SOURCE_LIMITATION,
    outputPath,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  try {
    main();
  } catch (error) {
    console.error("Georgia authority import failed:", error);
    process.exitCode = 1;
  }
}