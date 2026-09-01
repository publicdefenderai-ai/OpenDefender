/**
 * Deterministically seed North Carolina authority from the committed manifest.
 * This command never calls ncleg.gov.
 */
import { loadNorthCarolinaAuthorityManifest } from "../../server/data/north-carolina-manifest-loader";
import {
  buildNorthCarolinaSourceDatabaseSeed,
  NORTH_CAROLINA_SOURCE_POLICY,
} from "../../server/data/north-carolina-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadNorthCarolinaAuthorityManifest();
  const seed = buildNorthCarolinaSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "NC",
      mode: "dry-run",
      sourcePolicy: NORTH_CAROLINA_SOURCE_POLICY,
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedNorthCarolinaSourceDatabase } = await import(
    "../../server/services/north-carolina-source-database"
  );
  const result = await seedNorthCarolinaSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("North Carolina manifest seed command failed:", error);
  process.exitCode = 1;
});