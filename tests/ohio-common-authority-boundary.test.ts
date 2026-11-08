import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ fresh: true, pilotFresh: true, pilotUnavailable: false, missingId: "", rows: [] as any[], metadata: {} as any }));
vi.mock("../server/services/ohio-pilot-refresh-service", () => ({
  getOhioPilotRefreshStatus: async () => {
    if (state.pilotUnavailable) throw new Error("Durable pilot ledger unavailable");
    return { fresh: state.pilotFresh };
  },
}));
vi.mock("../server/data/ohio-reviewed-source", async importOriginal => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    get OHIO_REVIEWED_SOURCES() {
      return actual.OHIO_REVIEWED_SOURCES.filter((row: { chargeId: string }) => row.chargeId !== state.missingId);
    },
    isOhioReviewedSourceFresh: () => state.fresh,
  };
});
vi.mock("../server/db", () => ({ db: { select: () => ({ from: () => {
  const chain: any = { innerJoin: () => chain, where: () => Object.assign(Promise.resolve(state.rows), {
    orderBy: () => ({ limit: async () => [{ metadata: state.metadata }] }),
  }) }; return chain;
} }) } }));
vi.mock("../server/data/ohio-major-source", async original => ({
  ...await original<typeof import('../server/data/ohio-major-source')>(),
  isOhioMajorSourceFresh: () => state.fresh,
}));
import { OHIO_MAJOR_SOURCES } from '../server/data/ohio-major-source';
import { OHIO_THEFT_FRAUD_SOURCES } from '../server/data/ohio-theft-fraud-source';
vi.mock('../server/data/ohio-theft-fraud-source', async original => ({
  ...await original<typeof import('../server/data/ohio-theft-fraud-source')>(),
  isOhioTheftFraudSourceFresh: () => state.fresh,
}));
import { OHIO_RESIDUAL_SOURCES } from '../server/data/ohio-residual-source';
vi.mock('../server/data/ohio-residual-source', async original => ({
  ...await original<typeof import('../server/data/ohio-residual-source')>(),
  isOhioResidualSourceFresh: () => state.fresh,
}));
import { getCurrentAuthoritySelectableChargeIds } from "../server/services/authority-source-database";
import { buildOhioChapter2903PilotManifestRecords, buildOhioReviewedManifestRecords } from "../server/data/ohio-source-database-seed";

describe("corrected Ohio records require deployed supporting evidence", () => {
  beforeEach(() => { state.fresh = true; state.pilotFresh = true; state.pilotUnavailable = false; state.missingId = ""; });
  const records = buildOhioReviewedManifestRecords(new Date());
  const record = records.find(r => r.chargeId === "oh-orc-3767-32-littering")!;
  const links = record.provisions.map(p => ({ chargeId: record.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision }));
  it("requires every new-batch dependency even if incomplete ingestion metadata omits it", async () => {
    const newRecord = buildOhioReviewedManifestRecords(new Date(), OHIO_MAJOR_SOURCES)[0];
    const allLinks = newRecord.provisions.map(p => ({chargeId: newRecord.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision}));
    state.metadata = {selectableChargeIds: [newRecord.chargeId], catalogRecords: [newRecord]};
    state.rows = allLinks;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set([newRecord.chargeId]));
    state.rows = allLinks.filter(p => !p.sourceKey.endsWith('2971.01'));
    state.metadata.catalogRecords = [{...newRecord, provisions: state.rows}];
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });
  it("requires the residual batch's complete evidence even when ingestion metadata omits a dependency", async () => {
    const newRecord = buildOhioReviewedManifestRecords(new Date(), OHIO_RESIDUAL_SOURCES)
      .find(record => record.chargeId === 'oh-orc-2905-33-unlawful-documents')!;
    const links = newRecord.provisions.map(p => ({chargeId: newRecord.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision}));
    state.metadata = {selectableChargeIds: [newRecord.chargeId], catalogRecords: [newRecord]};
    state.rows = links;
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set([newRecord.chargeId]));
    state.rows = links.filter(p => !p.sourceKey.endsWith('2907.323'));
    state.metadata.catalogRecords = [{...newRecord, provisions: state.rows}];
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set());
    state.rows = links; state.metadata.catalogRecords = [newRecord]; state.fresh = false;
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set());
  });
  it("requires the theft/fraud batch's complete evidence even when ingestion metadata omits a dependency", async () => {
    const newRecord = buildOhioReviewedManifestRecords(new Date(), OHIO_THEFT_FRAUD_SOURCES)
      .find(record => record.chargeId === 'oh-orc-2913-021-theft-of-mail')!;
    const links = newRecord.provisions.map(p => ({chargeId: newRecord.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision}));
    state.metadata = {selectableChargeIds: [newRecord.chargeId], catalogRecords: [newRecord]};
    state.rows = links;
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set([newRecord.chargeId]));
    state.rows = links.filter(p => !p.sourceKey.endsWith('2913.02'));
    state.metadata.catalogRecords = [{...newRecord, provisions: state.rows}];
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set());
    state.rows = links; state.metadata.catalogRecords = [newRecord]; state.fresh = false;
    expect(await getCurrentAuthoritySelectableChargeIds('OH')).toEqual(new Set());
  });
  it("withholds only the affected charge when a reviewed source is missing", async () => {
    const unaffected = records.find(r => r.chargeId === "oh-orc-4301-62-opened-container-of-beer-or-intoxicating-liquor-prohibited-at-certain-premises")!;
    expect(unaffected).toBeDefined();
    const selected = [record, unaffected];
    state.rows = selected.flatMap(r => r.provisions.map(p => ({ chargeId: r.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation, subdivision: p.subdivision })));
    state.metadata = { selectableChargeIds: selected.map(r => r.chargeId), catalogRecords: selected };
    state.missingId = record.chargeId;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set([unaffected.chargeId]));
  });
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
  it("withholds an actual chapter 2903 pilot charge when its durable receipt is not fresh", async () => {
    const pilot = buildOhioChapter2903PilotManifestRecords(new Date())
      .find(row => row.chargeId === "oh-orc-2903-01-aggravated-murder")!;
    expect(pilot).toBeDefined();
    state.rows = pilot.provisions.map(p => ({
      chargeId: pilot.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole,
      citation: p.citation, subdivision: p.subdivision,
    }));
    state.metadata = { selectableChargeIds: [pilot.chargeId], catalogRecords: [pilot] };
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set([pilot.chargeId]));
    state.pilotFresh = false;
    expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
  });
  for (const unavailable of [false, true]) {
    it(`keeps separately reviewed charges eligible during a pilot outage (unavailable=${unavailable})`, async () => {
      const pilotRecords = buildOhioChapter2903PilotManifestRecords(new Date());
      const selected = [...records, ...pilotRecords];
      state.rows = selected.flatMap(r => r.provisions.map(p => ({
        chargeId: r.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole,
        citation: p.citation, subdivision: p.subdivision,
      })));
      state.metadata = { selectableChargeIds: selected.map(r => r.chargeId), catalogRecords: selected };
      const before = await getCurrentAuthoritySelectableChargeIds("OH");
      const pilotIds = new Set(pilotRecords.map(r => r.chargeId));
      const reviewedIds = [...before].filter(id => !pilotIds.has(id));
      expect(reviewedIds).toHaveLength(104);
      expect([...before].some(id => pilotIds.has(id))).toBe(true);
      state.pilotFresh = false;
      state.pilotUnavailable = unavailable;
      expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set(reviewedIds));
      state.fresh = false;
      expect(await getCurrentAuthoritySelectableChargeIds("OH")).toEqual(new Set());
    });
  }
});
