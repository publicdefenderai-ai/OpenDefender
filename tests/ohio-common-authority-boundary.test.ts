import { describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ fresh: true, rows: [] as any[], metadata: {} as any }));
vi.mock("../server/data/ohio-chapter-2903-refresh", () => ({ isOhioChapter2903PilotFresh: () => true }));
vi.mock("../server/data/ohio-reviewed-source", async importOriginal => ({
  ...(await importOriginal<any>()), isOhioReviewedSourceFresh: () => state.fresh,
}));
vi.mock("../server/db", () => ({ db: { select: () => ({ from: () => {
  const chain: any = { innerJoin: () => chain, where: () => Object.assign(Promise.resolve(state.rows), {
    orderBy: () => ({ limit: async () => [{ metadata: state.metadata }] }),
  }) }; return chain;
} }) } }));
import { getCurrentAuthoritySelectableChargeIds } from "../server/services/authority-source-database";
import { buildOhioReviewedManifestRecords } from "../server/data/ohio-source-database-seed";

describe("corrected Ohio records require deployed supporting evidence", () => {
  const record = buildOhioReviewedManifestRecords(new Date()).find(r => r.chargeId === "oh-orc-3767-32-littering")!;
  const links = record.provisions.map(p => ({ chargeId: record.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision }));
  it("rejects an old seed even when all of its old links remain current", async () => {
    state.fresh = true;
    state.rows = links.filter(p => !p.sourceKey.includes("2929."));
    state.metadata = { selectableChargeIds: [record.chargeId], catalogRecords: [{ ...record, provisions: state.rows }] };
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });
  it("admits the corrected record with all required current links, then withholds it on expiry", async () => {
    state.rows = links;
    state.metadata = { selectableChargeIds: [record.chargeId], catalogRecords: [record] };
    state.fresh = true;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set([record.chargeId]));
    state.fresh = false;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });
});
