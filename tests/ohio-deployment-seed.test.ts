import { ohioEvidenceTestTime } from "./helpers/ohio-evidence-time";
import { describe, expect, it } from "vitest";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { buildOhioSourceDatabaseSeed } from "../server/data/ohio-source-database-seed";
import { OHIO_REVIEWED_SOURCES } from "../server/data/ohio-reviewed-source";

describe("committed Ohio deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadOhioAuthorityManifest(undefined, ohioEvidenceTestTime);
    const seed = buildOhioSourceDatabaseSeed(manifest, ohioEvidenceTestTime);

    expect(manifest.source).toBe("Ohio Laws: codes.ohio.gov");
    expect(manifest.catalogRecords).toHaveLength(238);
    expect(seed.selectableChargeIds).toHaveLength(133);
    expect(seed.selectableChargeIds).toEqual(expect.arrayContaining(
      OHIO_REVIEWED_SOURCES.map(source => source.chargeId),
    ));
    expect(seed.sources.every((source) =>
      source.canonicalUrl.startsWith("https://codes.ohio.gov/ohio-revised-code/section-") ||
      source.canonicalUrl ===
        "https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01",
    )).toBe(true);
    expect(seed.sources.filter(source =>
      source.sourceKey === "oh:administrative-rule:3701-12-01",
    )).toEqual([
      expect.objectContaining({
        sourceType: "administrative_rule",
        publisher: "Ohio Department of Health",
        metadata: expect.objectContaining({
          source: "Ohio Laws: codes.ohio.gov",
          issuingAuthority: "Ohio Department of Health",
          officialProvider: "Ohio Legislative Service Commission",
        }),
      }),
    ]);
    expect(seed.sources.filter(source =>
      source.sourceKey !== "oh:administrative-rule:3701-12-01",
    ).every(source =>
      source.sourceType === "statute" &&
      source.publisher === "Ohio Legislative Service Commission",
    )).toBe(true);
    expect(seed.snapshots.every((snapshot) =>
      ["pending", "substantive_source_review_complete", "reviewed_interpretation"]
        .includes(String(snapshot.metadata.attorneyReview)),
    )).toBe(true);
    expect(seed.snapshots.filter(snapshot =>
      snapshot.sourceKey === "oh:administrative-rule:3701-12-01" &&
      snapshot.metadata.attorneyReview === "reviewed_interpretation",
    )).toHaveLength(1);
    expect(seed.catalogRecords.every((record) =>
      record.provisions.every((provision) =>
        provision.sourceUrl.startsWith("https://codes.ohio.gov/ohio-revised-code/section-") ||
        provision.sourceUrl ===
          "https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01",
      ),
    )).toBe(true);
  });
});