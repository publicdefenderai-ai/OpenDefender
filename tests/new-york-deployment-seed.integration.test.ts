import { describe, expect, it } from "vitest";
import { loadNewYorkAuthorityManifest } from "../server/data/new-york-manifest-loader";

const runIntegration = process.env.RUN_NEW_YORK_DEPLOYMENT_SEED_INTEGRATION === "1";

describe.skipIf(!runIntegration)("New York deployment bootstrap", () => {
  it("seeds the committed manifest before runtime selection and provenance", async () => {
    const { getCurrentNewYorkSelectableChargeIds, getNewYorkChargeProvenance, seedNewYorkSourceDatabase } =
      await import("../server/services/new-york-source-database");

    const result = await seedNewYorkSourceDatabase(loadNewYorkAuthorityManifest());
    expect(result.success).toBe(true);
    expect(result.catalogRecordCount).toBe(121);
    expect(result.selectableChargeCount).toBe(94);

    const selectableIds = await getCurrentNewYorkSelectableChargeIds();
    expect(selectableIds.has("ny-grand-theft-in-the-first-degree")).toBe(true);
    expect(selectableIds.has("ny-auto-burglary")).toBe(false);
    expect(await getNewYorkChargeProvenance("ny-grand-theft-in-the-first-degree")).not.toBeNull();
  }, 30000);
});