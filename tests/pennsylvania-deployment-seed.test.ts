import { describe, expect, it } from "vitest";
import { loadPennsylvaniaAuthorityManifest } from "../server/data/pennsylvania-manifest-loader";
import {
  buildPennsylvaniaSourceDatabaseSeed,
  PENNSYLVANIA_MANIFEST_SOURCE,
  PENNSYLVANIA_SOURCE_POLICY,
} from "../server/data/pennsylvania-source-database-seed";

describe("committed Pennsylvania deployment seed", () => {
  it("loads the committed manifest without live legislative-site access", () => {
    const manifest = loadPennsylvaniaAuthorityManifest();
    const seed = buildPennsylvaniaSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe(PENNSYLVANIA_MANIFEST_SOURCE);
    expect(manifest.catalogRecords).toHaveLength(112);
    expect(seed.sourcePolicy).toBe(PENNSYLVANIA_SOURCE_POLICY);
    expect(seed.selectableChargeIds).toHaveLength(22);
    expect(seed.sources).toHaveLength(22);
    expect(seed.snapshots).toHaveLength(22);
    expect(seed.links).toHaveLength(22);
    expect(seed.sources.every((source) => {
      return source.publisher === "Pennsylvania General Assembly" &&
        source.accessPolicy === "store_text" &&
        source.reuseStatus === "permitted" &&
        source.canStoreContent &&
        (
          source.canonicalUrl.startsWith("https://www.legis.state.pa.us/") ||
          source.canonicalUrl.startsWith("https://www.palegis.us/statutes/unconsolidated/")
        );
    })).toBe(true);
    expect(seed.snapshots.every((snapshot) => {
      const review = snapshot.metadata.attorneyReview as {
        decision?: string;
        action?: string;
      };
      return review.decision === "Approved" && review.action === "publish";
    })).toBe(true);
  });
});