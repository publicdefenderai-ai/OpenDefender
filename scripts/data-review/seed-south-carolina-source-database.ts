/**
 * Deterministically seed South Carolina authority from the committed
 * manifest. This command never calls the legislature website.
 */
import { loadSouthCarolinaAuthorityManifest } from "../../server/data/south-carolina-manifest-loader";
import { buildSouthCarolinaSourceDatabaseSeed } from "../../server/data/south-carolina-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadSouthCarolinaAuthorityManifest();
  const seed = buildSouthCarolinaSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "SC",
      mode: "dry-run",
      sourcePolicy: "official_south_carolina_code_of_laws",
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { southCarolinaSourceDatabase } = await import("../../server/services/south-carolina-source-database");
  const result = await southCarolinaSourceDatabase.seed(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("South Carolina manifest seed command failed:", error);
  process.exitCode = 1;
});