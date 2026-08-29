import { describe, expect, it } from "vitest";
import { loadGeorgiaAuthorityManifest } from "../server/data/georgia-manifest-loader";
import {
  buildGeorgiaSourceDatabaseSeed,
  GEORGIA_MANIFEST_SOURCE,
} from "../server/data/georgia-source-database-seed";

describe("committed Georgia deployment seed", () => {
  it("loads the manifest without live secondary or legislative-site access", () => {
    const manifest = loadGeorgiaAuthorityManifest();
    const seed = buildGeorgiaSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe(GEORGIA_MANIFEST_SOURCE);
    expect(manifest.catalogRecords).toHaveLength(129);
    expect(seed.selectableChargeIds).toHaveLength(0);
    expect(seed.sources).toHaveLength(0);
    expect(seed.snapshots).toHaveLength(0);
    expect(seed.links).toHaveLength(0);
  });
});