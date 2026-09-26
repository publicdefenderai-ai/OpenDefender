import receipt from "../scripts/data-review/output/florida-reviewed-refresh-receipt.json";
import { describe, expect, it } from "vitest";
import { loadFloridaAuthorityManifest } from "../server/data/florida-manifest-loader";
import { buildFloridaSourceDatabaseSeed } from "../server/data/florida-source-database-seed";
import { FLORIDA_REVIEWED_SOURCE_RECORDS } from "../server/data/florida-reviewed-source-records";
import { FLORIDA_REVIEWED_DEFINITIONS } from "../shared/florida-reviewed-batch";

describe("committed Florida deployment seed", () => {
  it("withholds reviewed records exactly at expiry, including when seeding a previously fresh manifest", () => {
    const freshAt = new Date(receipt.checkedAt);
    const expiresAt = new Date(receipt.expiresAt);
    const beforeExpiry = new Date(expiresAt.getTime() - 1);
    const freshManifest = loadFloridaAuthorityManifest(undefined, freshAt);
    expect(loadFloridaAuthorityManifest(undefined, beforeExpiry).catalogRecords).toHaveLength(117 + FLORIDA_REVIEWED_SOURCE_RECORDS.length);
    expect(loadFloridaAuthorityManifest(undefined, expiresAt).catalogRecords).toHaveLength(117);
    const expiredSeed = buildFloridaSourceDatabaseSeed(freshManifest, expiresAt);
    expect(expiredSeed.selectableChargeIds).toHaveLength(25);
    expect(expiredSeed.selectableChargeIds.some(id => id.startsWith("fl-fs-"))).toBe(false);
  });

  it("loads the committed manifest without live legislative-site access", () => {
    // Reproduce the approved snapshot independently of the day this test runs.
    const now = new Date(receipt.checkedAt);
    const manifest = loadFloridaAuthorityManifest(undefined, now);
    const seed = buildFloridaSourceDatabaseSeed(manifest, now);
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