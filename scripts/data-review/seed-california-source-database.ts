/**
 * Seed the narrow California authority database.
 *
 * Default mode writes only official source references and versioned
 * fingerprints. It never calls OpenLaws and never fetches California pages.
 *
 * Usage:
 *   npx tsx scripts/data-review/seed-california-source-database.ts --dry-run
 *   npx tsx scripts/data-review/seed-california-source-database.ts
 */

import { buildCaliforniaSourceDatabaseSeed } from "../../server/data/california-source-database-seed";

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const seed = buildCaliforniaSourceDatabaseSeed(new Date());

  if (dryRun) {
    console.log(JSON.stringify({
      jurisdiction: "CA",
      mode: "dry-run",
      sourcePolicy: "reference_only",
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
      storedTextSnapshots: seed.snapshots.filter((snapshot) => snapshot.content !== null).length,
      openLawsReferences: [...seed.sources, ...seed.snapshots]
        .filter((entry) => JSON.stringify(entry).toLowerCase().includes("openlaws"))
        .length,
    }, null, 2));
    return;
  }

  // Keep the DB import out of dry-run mode so source-manifest inspection never
  // requires a database connection.
  const { seedCaliforniaSourceDatabase } = await import("../../server/services/california-source-database");
  const result = await seedCaliforniaSourceDatabase(seed);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("California source database command failed:", error);
  process.exitCode = 1;
});