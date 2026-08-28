import { describe, expect, it } from "vitest";
import { loadFloridaAuthorityManifest } from "../server/data/florida-manifest-loader";
import { buildFloridaSourceDatabaseSeed } from "../server/data/florida-source-database-seed";

describe("committed Florida deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadFloridaAuthorityManifest();
    const seed = buildFloridaSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe(
      "Florida Legislature Online Sunshine (leg.state.fl.us/statutes)",
    );
    expect(manifest.catalogRecords).toHaveLength(117);
    expect(seed.selectableChargeIds).toHaveLength(25);
    expect(seed.sources.every((source) =>
      source.canonicalUrl.startsWith("https://www.leg.state.fl.us/statutes/"),
    )).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      snapshot.metadata.attorneyReview === "pending",
    )).toBe(true);
    expect(seed.catalogRecords.every((record) =>
      record.provisions.every((provision) =>
        provision.sourceUrl.startsWith("https://www.leg.state.fl.us/statutes/"),
      ),
    )).toBe(true);
  });
});