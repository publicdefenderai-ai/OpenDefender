/**
 * Seed the New York authority database from the committed, reviewed manifest.
 *
 * This command is deterministic and does not call the NY Senate API. The live
 * importer remains a separate review operation that regenerates the manifest.
 *
 * Usage:
 *   npx tsx scripts/data-review/seed-new-york-source-database.ts --dry-run
 *   npx tsx scripts/data-review/seed-new-york-source-database.ts
 */

import { loadNewYorkAuthorityManifest } from "../../server/data/new-york-manifest-loader";
import { buildNewYorkSourceDatabaseSeed } from "../../server/data/new-york-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadNewYorkAuthorityManifest();
  const seed = buildNewYorkSourceDatabaseSeed(manifest);

  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "NY",
      mode: "dry-run",
      sourcePolicy: "official_ny_senate_api_manifest",
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }

  const { seedNewYorkSourceDatabase } = await import("../../server/services/new-york-source-database");
  const result = await seedNewYorkSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("New York manifest seed command failed:", error);
  process.exitCode = 1;
});