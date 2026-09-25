import { describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ rows: [] as any[], ids: [] as string[] }));
vi.mock("../server/db", () => ({ db: { select: () => ({ from: () => {
  const chain: any = { innerJoin: () => chain, where: () => Object.assign(Promise.resolve(state.rows), {
    orderBy: () => ({ limit: async () => [{ metadata: { selectableChargeIds: state.ids } }] }),
  }) }; return chain;
} }) } }));
import { getCurrentCaliforniaSelectableChargeIds } from "../server/services/california-source-database";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";

describe("California corrections require seeded supporting references", () => {
  const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-24T00:00:00Z"));
  const affected = "ca-menacing";
  const unaffected = "ca-petty-theft";
  const links = seed.links.filter(link => [affected, unaffected].includes(link.chargeId)).map(link => {
    const snapshot = seed.snapshots.find(row => row.sourceKey === link.snapshotKey)!;
    return { chargeId: link.chargeId, sourceUrl: snapshot.sourceUrl, citation: snapshot.citation, supportRole: link.supportRole, subdivision: link.subdivision };
  });
  it("withholds only the corrected charge when the old seed lacks its sentencing references", async () => {
    state.ids = [affected, unaffected];
    state.rows = links.filter(row => !(row.chargeId === affected && row.supportRole === "grading"));
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set([unaffected]));
  });
  it("admits the corrected record only when all supporting links exist", async () => {
    state.ids = [affected, unaffected];
    state.rows = links;
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set([affected, unaffected]));
    state.rows = links.filter(row => new URL(row.sourceUrl).searchParams.get("sectionNum")?.replace(/\.$/, "") !== "18.5");
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set([unaffected]));
  });
});
