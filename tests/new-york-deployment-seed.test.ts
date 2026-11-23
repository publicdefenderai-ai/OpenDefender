import { describe, expect, it } from "vitest";
import { loadNewYorkAuthorityManifest } from "../server/data/new-york-manifest-loader";
import { buildNewYorkSourceDatabaseSeed } from "../server/data/new-york-source-database-seed";

describe("committed New York deployment seed", () => {
  it("loads the official manifest without live API access", () => {
    const manifest = loadNewYorkAuthorityManifest();
    const seed = buildNewYorkSourceDatabaseSeed(manifest);

    expect(manifest.source).toBe("NY Open Legislation API (legislation.nysenate.gov)");
    expect(manifest.catalogRecords).toHaveLength(121);
    expect(seed.sources).toHaveLength(86);
    expect(seed.snapshots).toHaveLength(93);
    expect(seed.links).toHaveLength(93);
    expect(seed.selectableChargeIds).toHaveLength(91);
    expect(seed.selectableChargeIds).toContain("ny-grand-theft-in-the-first-degree");
    expect(seed.selectableChargeIds).not.toContain("ny-auto-burglary");
  });
});