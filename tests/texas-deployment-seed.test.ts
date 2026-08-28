import { describe, expect, it } from "vitest";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";

describe("committed Texas deployment seed", () => {
  it("loads the committed manifest without live TCSS access", () => {
    const manifest = loadTexasAuthorityManifest();
    const seed = buildTexasSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe(
      "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)",
    );
    expect(manifest.catalogRecords).toHaveLength(111);
    expect(seed.selectableChargeIds).toHaveLength(33);
    expect(seed.sources.every((source) =>
      source.canonicalUrl.startsWith("https://tcss.legis.texas.gov/resources/"),
    )).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      snapshot.metadata.attorneyReview === "pending",
    )).toBe(true);
  });
});