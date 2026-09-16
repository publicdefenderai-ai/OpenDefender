import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fresh: false,
  metadata: { selectableChargeIds: ["oh-orc-2903-01-aggravated-murder"], catalogRecords: [] },
}));
vi.mock("../server/data/ohio-chapter-2903-refresh", () => ({
  isOhioChapter2903PilotFresh: () => mocks.fresh,
}));
vi.mock("../server/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({
            limit: async () => [{ metadata: mocks.metadata }],
          }),
        }),
      }),
    }),
  },
}));

import {
  getAuthorityChargeProvenance,
  getCurrentAuthoritySelectableChargeIds,
} from "../server/services/authority-source-database";

describe("Ohio freshness at the database-backed provenance boundary", () => {
  beforeEach(() => { mocks.fresh = false; });

  it("rejects stale pilot IDs even when an old completed run still lists them", async () => {
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });

  it("does not expose current provenance for a stale pilot record", async () => {
    expect(await getAuthorityChargeProvenance("OH", "oh-orc-2903-01-aggravated-murder")).toBeNull();
  });
});