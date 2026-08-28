/**
 * Deterministically seed Pennsylvania authority from the committed manifest.
 * This command never calls a government site.
 */
import { loadPennsylvaniaAuthorityManifest } from "../../server/data/pennsylvania-manifest-loader";
import { buildPennsylvaniaSourceDatabaseSeed } from "../../server/data/pennsylvania-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadPennsylvaniaAuthorityManifest();
  const seed = buildPennsylvaniaSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "PA",
      mode: "dry-run",
      sourcePolicy: "official_pennsylvania_consolidated_statutes_manifest",
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedPennsylvaniaSourceDatabase } = await import("../../server/services/pennsylvania-source-database");
  const result = await seedPennsylvaniaSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Pennsylvania manifest seed command failed:", error);
  process.exitCode = 1;
});