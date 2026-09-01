/**
 * Seed the narrow California authority database.
 *
 * Default mode writes only official source references and versioned
 * fingerprints. It never calls OpenLaws and never fetches California pages.
 *
 * Usage:
 *   npx tsx scripts/data-review/seed-california-source-database.ts --dry-run
 *   npx tsx scripts/data-review/seed-california-source-database.ts --dry-run --imported-at 2026-08-27T12:00:00.000Z
 *   npx tsx scripts/data-review/seed-california-source-database.ts
 */

import { buildCaliforniaSourceDatabaseSeed } from "../../server/data/california-source-database-seed";

const DEFAULT_DRY_RUN_IMPORTED_AT = new Date("1970-01-01T00:00:00.000Z");

function parseImportedAt(args: string[], dryRun: boolean): Date {
  const optionIndex = args.findIndex((arg) => arg === "--imported-at" || arg.startsWith("--imported-at="));
  if (optionIndex === -1) return dryRun ? DEFAULT_DRY_RUN_IMPORTED_AT : new Date();

  const option = args[optionIndex];
  const value = option.startsWith("--imported-at=")
    ? option.slice("--imported-at=".length)
    : args[optionIndex + 1];
  if (!value) {
    throw new Error("--imported-at requires an ISO-8601 timestamp");
  }

  const importedAt = new Date(value);
  if (Number.isNaN(importedAt.getTime())) {
    throw new Error(`Invalid --imported-at timestamp: ${value}`);
  }
  return importedAt;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const seed = buildCaliforniaSourceDatabaseSeed(parseImportedAt(args, dryRun));

  if (dryRun) {
    console.log(JSON.stringify({
      jurisdiction: "CA",
      mode: "dry-run",
      sourcePolicy: "reference_only",
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      coverage: seed.audit,
      catalogRecords: seed.catalogRecords.length,
      legacyInventory: seed.legacyInventory.length,
      selectableCharges: seed.selectableChargeIds.length,
      withheldLegacyRecords: seed.audit.inventory.withheldCount,
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