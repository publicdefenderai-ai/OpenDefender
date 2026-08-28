/**
 * Deterministically seed Florida authority from the committed manifest.
 * This command never calls a government site.
 */
import { loadFloridaAuthorityManifest } from "../../server/data/florida-manifest-loader";
import { buildFloridaSourceDatabaseSeed } from "../../server/data/florida-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadFloridaAuthorityManifest();
  const seed = buildFloridaSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "FL",
      mode: "dry-run",
      sourcePolicy: "official_florida_online_sunshine_statutes_manifest",
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedFloridaSourceDatabase } = await import("../../server/services/florida-source-database");
  const result = await seedFloridaSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Florida manifest seed command failed:", error);
  process.exitCode = 1;
});