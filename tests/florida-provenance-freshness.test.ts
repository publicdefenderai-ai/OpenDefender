import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ fresh: false, ids: [] as string[] }));
vi.mock("../server/data/florida-reviewed-source-records", async importOriginal => ({
  ...await importOriginal<typeof import("../server/data/florida-reviewed-source-records")>(),
  isFloridaReviewedSourceFresh: () => state.fresh,
}));
vi.mock("../server/db", () => ({
  db: {
    select: () => {
      const query: any = {
        from: () => query,
        innerJoin: () => query,
        where: () => {
          const links: any = state.ids.map(chargeId => ({
            chargeId, sourceKey: "fixture", supportRole: "offense", citation: "fixture", subdivision: null,
          }));
          links.orderBy = () => ({
            limit: async () => [{ metadata: {
              selectableChargeIds: state.ids,
              catalogRecords: state.ids.map(chargeId => ({
                chargeId, provisions: [{ sourceKey: "fixture", supportRole: "offense", citation: "fixture", subdivision: null }],
              })),
            } }],
          });
          return links;
        },
      };
      return query;
    },
  },
}));

import { FLORIDA_REVIEWED_SOURCE_RECORDS } from "../server/data/florida-reviewed-source-records";
import { getCurrentAuthoritySelectableChargeIds, getAuthorityChargeProvenance } from "../server/services/authority-source-database";
import { getCurrentAuthoritySelectableChargeIds as eligibleIds } from "../server/services/authority-eligibility";
import { CALIFORNIA_CANONICAL_RECORDS } from "../shared/california-authority";
import { getSelectableCharges } from "../shared/criminal-charges";

const reviewed = FLORIDA_REVIEWED_SOURCE_RECORDS[0].chargeId;
const reviewedIds = new Set(FLORIDA_REVIEWED_SOURCE_RECORDS.map(row => row.chargeId));
const legacy = getSelectableCharges().find(row => row.jurisdiction === "FL" && !reviewedIds.has(row.id))!.id;

describe("Florida reviewed expiry at shared runtime boundaries", () => {
  beforeEach(() => { state.fresh = false; state.ids = [reviewed, legacy]; });
  afterEach(() => vi.unstubAllEnvs());

  it("removes expired reviewed IDs from old completed runs but preserves unrelated IDs", async () => {
    expect(await getCurrentAuthoritySelectableChargeIds("FL")).toEqual(new Set([legacy]));
  });
  it("keeps fresh reviewed IDs when database evidence also matches", async () => {
    state.fresh = true;
    expect(await getCurrentAuthoritySelectableChargeIds("FL")).toEqual(new Set([reviewed, legacy]));
  });
  it("withholds expired provenance even through the generic service", async () => {
    expect(await getAuthorityChargeProvenance("FL", reviewed)).toBeNull();
  });
  it("applies expiry to release fixtures and does not hide unrelated Florida IDs", async () => {
    vi.stubEnv("RELEASE_CHECK", "true");
    vi.stubEnv("RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS", JSON.stringify([
      ...CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable).map(row => row.canonicalId),
      reviewed, legacy,
    ]));
    const stale = await eligibleIds();
    expect(stale.has(reviewed)).toBe(false);
    expect(stale.has(legacy)).toBe(true);
    state.fresh = true;
    expect((await eligibleIds()).has(reviewed)).toBe(true);
  });
});
