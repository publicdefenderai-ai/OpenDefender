/**
 * Build Georgia's committed authority manifest.
 *
 * The General Assembly's official API exposes title metadata, while its public
 * Lexis TOC search renders codified section results. This is an automation
 * restriction rather than a total access failure: complete documents require
 * browser cookie/human-verification state, while result rows omit the durable
 * pddocid and currentness evidence required by the manifest. Never substitute
 * secondary mirrors for selectable authority: every current Georgia catalog row
 * remains withheld until the official complete-document contract is
 * independently repeatable.
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
  "Georgia's official General Assembly API exposes only title metadata through georgia-code/titles and requires a site-issued bearer token; it has no public section-text endpoint. The official Lexis TOC search is publicly human-accessible and renders codified section results, but unattended complete-document retrieval requires browser cookie/human-verification state and result rows omit durable urn:contentItem identity and currentness fields. Justia, Public.Resource.Org/UniCourt, Internet Archive, and other secondary or authenticated-only sources may support discovery only and remain outside selectable authority.";

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