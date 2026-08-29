/**
 * Deterministically seed Georgia authority from the committed manifest.
 * This command never calls a secondary legal-data site.
 */
import { loadGeorgiaAuthorityManifest } from "../../server/data/georgia-manifest-loader";
import {
  buildGeorgiaSourceDatabaseSeed,
  GEORGIA_SOURCE_POLICY,
} from "../../server/data/georgia-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadGeorgiaAuthorityManifest();
  const seed = buildGeorgiaSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "GA",
      mode: "dry-run",
      sourcePolicy: GEORGIA_SOURCE_POLICY,
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedGeorgiaSourceDatabase } = await import("../../server/services/georgia-source-database");
  const result = await seedGeorgiaSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Georgia manifest seed command failed:", error);
  process.exitCode = 1;
});