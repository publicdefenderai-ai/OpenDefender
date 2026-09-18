import { describe, expect, it } from "vitest";
import { loadFloridaAuthorityManifest } from "../server/data/florida-manifest-loader";
import { buildFloridaSourceDatabaseSeed } from "../server/data/florida-source-database-seed";
import { FLORIDA_REVIEWED_SOURCE_RECORDS } from "../server/data/florida-reviewed-source-records";
import { FLORIDA_REVIEWED_DEFINITIONS } from "../shared/florida-reviewed-batch";

describe("committed Florida deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadFloridaAuthorityManifest();
    const seed = buildFloridaSourceDatabaseSeed(manifest);
    const approvedIds = new Set(
      FLORIDA_REVIEWED_SOURCE_RECORDS.map((record) => record.chargeId),
    );
    const heldIds = FLORIDA_REVIEWED_DEFINITIONS
      .map((definition) => definition.id)
      .filter((id) => !approvedIds.has(id));
    const legacyIds = seed.selectableChargeIds.filter((id) => !id.startsWith("fl-fs-"));

    expect(manifest.source).toBe(
      "Florida Legislature Online Sunshine (leg.state.fl.us/statutes)",
    );
    expect(approvedIds.size).toBeGreaterThan(0);
    expect(manifest.catalogRecords).toHaveLength(117 + approvedIds.size);
    expect(legacyIds).toHaveLength(25);
    expect(new Set(seed.selectableChargeIds)).toEqual(
      new Set([...legacyIds, ...approvedIds]),
    );
    expect(seed.selectableChargeIds.filter((id) => heldIds.includes(id))).toHaveLength(0);
    expect(seed.sources.every((source) =>
      source.canonicalUrl.startsWith("https://www.leg.state.fl.us/statutes/"),
    )).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      ["pending", "pending_interpretation", "reviewed_interpretation"]
        .includes(String(snapshot.metadata.attorneyReview)),
    )).toBe(true);
    expect(seed.catalogRecords.every((record) =>
      record.provisions.every((provision) =>
        provision.sourceUrl.startsWith("https://www.leg.state.fl.us/statutes/"),
      ),
    )).toBe(true);
  });
});