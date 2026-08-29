import { loadIllinoisAuthorityManifest } from "../../server/data/illinois-manifest-loader";
import {
  buildIllinoisSourceDatabaseSeed,
  ILLINOIS_SOURCE_POLICY,
} from "../../server/data/illinois-source-database-seed";

async function main(): Promise<void> {
  const manifest = loadIllinoisAuthorityManifest();
  const seed = buildIllinoisSourceDatabaseSeed(manifest);
  if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify({
      jurisdiction: "IL",
      mode: "dry-run",
      sourcePolicy: ILLINOIS_SOURCE_POLICY,
      manifestRecords: manifest.catalogRecords.length,
      sources: seed.sources.length,
      snapshots: seed.snapshots.length,
      links: seed.links.length,
      selectableCharges: seed.selectableChargeIds.length,
    }, null, 2));
    return;
  }
  const { seedIllinoisSourceDatabase } = await import("../../server/services/illinois-source-database");
  const result = await seedIllinoisSourceDatabase(manifest);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Illinois manifest seed command failed:", error);
  process.exitCode = 1;
});