/**
 * Deterministically seed Ohio authority from the committed manifest.
 * This command never calls the legislative website.
 */
import { loadOhioAuthorityManifest } from "../../server/data/ohio-manifest-loader";
import {
  buildOhioSourceDatabaseSeed,
  OHIO_SOURCE_POLICY,
} from "../../server/data/ohio-source-database-seed";

async function main(): Promise<void> {
  const { getOhioPilotRefreshStatus } = await import("../../server/services/ohio-pilot-refresh-service");
  const refreshStatus = await getOhioPilotRefreshStatus();
  const manifest = loadOhioAuthorityManifest(
    undefined,
    new Date(),
    refreshStatus.fresh ? refreshStatus.receipt : null,
  );
  const seed = buildOhioSourceDatabaseSeed(
    manifest,
    new Date(),
    refreshStatus.fresh ? refreshStatus.receipt : null,
  );
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "OH",
      mode: "dry-run",
      sourcePolicy: OHIO_SOURCE_POLICY,
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedOhioSourceDatabase } = await import("../../server/services/ohio-source-database");
  const result = await seedOhioSourceDatabase();
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Ohio manifest seed command failed:", error);
  process.exitCode = 1;
});