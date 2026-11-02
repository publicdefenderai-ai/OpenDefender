import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sharedFresh: false,
  metadata: {
    selectableChargeIds: ["oh-orc-2903-01-aggravated-murder"],
    catalogRecords: [{
      chargeId: "oh-orc-2903-01-aggravated-murder",
      provisions: [{
        sourceKey: "oh:statute:2903.01",
        supportRole: "offense",
        citation: "Ohio Rev. Code Ann. § 2903.01",
        subdivision: null,
      }],
    }],
  },
  selectCalls: 0,
}));
vi.mock("../server/services/ohio-pilot-refresh-service", () => ({
  getOhioPilotRefreshStatus: async () => ({
    fresh: mocks.sharedFresh,
    reason: mocks.sharedFresh ? null : "revoked",
    receipt: mocks.sharedFresh ? {} : null,
  }),
}));
vi.mock("../server/db", () => ({
  db: {
    select: () => {
      mocks.selectCalls++;
      if (mocks.selectCalls === 1) {
        return {
          from: () => ({
            where: () => ({
              orderBy: () => ({
                limit: async () => [{ metadata: mocks.metadata }],
              }),
            }),
          }),
        };
      }
      return {
        from: () => ({
          innerJoin: () => ({
            innerJoin: () => ({
              where: async () => [{
                chargeId: "oh-orc-2903-01-aggravated-murder",
                sourceKey: "oh:statute:2903.01",
                supportRole: "offense",
                citation: "Ohio Rev. Code Ann. § 2903.01",
                subdivision: null,
              }],
            }),
          }),
        }),
      };
    },
  },
}));

import {
  getAuthorityChargeProvenance,
  getCurrentAuthoritySelectableChargeIds,
  selectPrimaryAuthoritySource,
} from "../server/services/authority-source-database";

describe("Ohio freshness at the database-backed provenance boundary", () => {
  beforeEach(() => {
    mocks.sharedFresh = false;
    mocks.selectCalls = 0;
  });

  it("rejects pilot IDs when the shared receipt is revoked even when an old completed run still lists them", async () => {
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });

  it("does not expose current provenance for a stale pilot record", async () => {
    expect(await getAuthorityChargeProvenance("OH", "oh-orc-2903-01-aggravated-murder")).toBeNull();
  });

  it("selects the exact offense subdivision even when supporting definitions arrive first", () => {
    const expected = "Ohio Rev. Code Ann. § 2903.34(A)(2)";
    const primary = { citation: expected, supportRole: "offense" };
    const rows = [
      { citation: "Ohio Rev. Code Ann. § 5123.03", supportRole: "offense" },
      { citation: "Ohio Rev. Code Ann. § 2903.34(A)(1)", supportRole: "offense" },
      { citation: expected, supportRole: "penalty" },
      primary,
    ];
    expect(selectPrimaryAuthoritySource(rows, expected)).toBe(primary);
    expect(selectPrimaryAuthoritySource([...rows].reverse(), expected)).toBe(primary);
    expect(selectPrimaryAuthoritySource(rows.slice(0, -1), expected)).toBeUndefined();
    expect(selectPrimaryAuthoritySource([], expected)).toBeUndefined();
  });

  it("uses fresh shared state even when the checked-in receipt is stale", async () => {
    mocks.sharedFresh = true;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(
      new Set(["oh-orc-2903-01-aggravated-murder"]),
    );
  });
});
