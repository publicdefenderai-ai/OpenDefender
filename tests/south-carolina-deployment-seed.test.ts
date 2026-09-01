import { describe, expect, it } from "vitest";
import { loadSouthCarolinaAuthorityManifest } from "../server/data/south-carolina-manifest-loader";
import {
  buildSouthCarolinaSourceDatabaseSeed,
  SOUTH_CAROLINA_MANIFEST_SOURCE,
  SOUTH_CAROLINA_SOURCE_POLICY,
} from "../server/data/south-carolina-source-database-seed";

describe("committed South Carolina deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadSouthCarolinaAuthorityManifest();
    const seed = buildSouthCarolinaSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe(SOUTH_CAROLINA_MANIFEST_SOURCE);
    expect(manifest.catalogRecords).toHaveLength(128);
    expect(seed.sourcePolicy).toBe(SOUTH_CAROLINA_SOURCE_POLICY);
    expect(seed.selectableChargeIds).toHaveLength(41);
    expect(seed.sources).toHaveLength(37);
    expect(seed.snapshots).toHaveLength(41);
    expect(seed.links).toHaveLength(41);
    expect(seed.sources.every((source) => {
      return source.publisher === "South Carolina Legislature" &&
        source.accessPolicy === "store_text" &&
        source.reuseStatus === "permitted" &&
        source.canStoreContent &&
        source.canonicalUrl.startsWith("https://www.scstatehouse.gov/");
    })).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      snapshot.metadata.attorneyReview === "pending",
    )).toBe(true);
  });
});