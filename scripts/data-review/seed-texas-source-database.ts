/**
 * Deterministically seed Texas authority from the committed manifest.
 * This command never calls a government site.
 */
import { loadTexasAuthorityManifest } from "../../server/data/texas-manifest-loader";
import { buildTexasSourceDatabaseSeed } from "../../server/data/texas-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadTexasAuthorityManifest();
  const seed = buildTexasSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "TX",
      mode: "dry-run",
      sourcePolicy: "official_texas_legislative_council_tcss_manifest",
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedTexasSourceDatabase } = await import("../../server/services/texas-source-database");
  const result = await seedTexasSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Texas manifest seed command failed:", error);
  process.exitCode = 1;
});