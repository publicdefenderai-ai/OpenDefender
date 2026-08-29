import { describe, expect, it } from "vitest";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { buildOhioSourceDatabaseSeed } from "../server/data/ohio-source-database-seed";

describe("committed Ohio deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadOhioAuthorityManifest();
    const seed = buildOhioSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe("Ohio Laws — codes.ohio.gov");
    expect(manifest.catalogRecords).toHaveLength(115);
    expect(seed.selectableChargeIds).toHaveLength(13);
    expect(seed.sources.every((source) =>
      source.canonicalUrl.startsWith("https://codes.ohio.gov/ohio-revised-code/section-"),
    )).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      snapshot.metadata.attorneyReview === "pending",
    )).toBe(true);
    expect(seed.catalogRecords.every((record) =>
      record.provisions.every((provision) =>
        provision.sourceUrl.startsWith("https://codes.ohio.gov/ohio-revised-code/section-"),
      ),
    )).toBe(true);
  });
});