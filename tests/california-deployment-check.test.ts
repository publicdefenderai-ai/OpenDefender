import { paginateCharges, parseChargePagination } from "../server/charge-pagination";
import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assessCaliforniaDeployment, checkCaliforniaDeployment } from "../scripts/check-california-deployment";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaRecordEvidenceStatus } from "../shared/california-authority";
import { getCaliforniaEvidenceSummary } from "../shared/california-freshness";
const now = () => new Date(receipt.checkedAt);
const status = () => ({ success: true, archiveEvidence: getCaliforniaEvidenceSummary(now()), lastRun: { status: "completed" }, linkedChargeCount: CA_CATALOG_COUNTS.configured });
const selector = () => ({ success: true, totalAvailable: CA_CATALOG_COUNTS.eligible, charges: CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable && getCaliforniaRecordEvidenceStatus(row, now()) === "current").map(row => ({ id: row.canonicalId })) });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("public California deployment confirmation", () => {
  it("accepts only the exact published receipt and complete configured selector", () => {
    expect(assessCaliforniaDeployment(status(), selector(), now()).ok).toBe(true);
    expect(assessCaliforniaDeployment({ ...status(), archiveEvidence: { ...status().archiveEvidence, checkedAt: "2026-01-01" } }, selector(), now()).ok).toBe(false);
    expect(assessCaliforniaDeployment({ ...status(), lastRun: null }, selector(), now()).ok).toBe(false);
    const duplicate = selector(); duplicate.charges[0] = duplicate.charges[1];
    expect(assessCaliforniaDeployment(status(), duplicate, now()).ok).toBe(false);
  });
  it("rejects the observed old deployment and expired or imminently expiring receipts", () => {
    expect(assessCaliforniaDeployment({ success: true, sourceCount: 0, lastRun: null }, { success: true, charges: [], totalAvailable: 0 }, now()).ok).toBe(false);
    for (const time of [Date.parse(receipt.expiresAt), Date.parse(receipt.expiresAt) - 48 * 3_600_000]) {
      expect(assessCaliforniaDeployment(status(), selector(), new Date(time)).ok).toBe(false);
    }
  });
  it('checks every public page beyond 500 and rejects failure on a later page', async () => {
    vi.useFakeTimers(); vi.setSystemTime(now());
    const charges=selector().charges;
    expect(charges.length).toBeGreaterThan(500);
    let failSecond=false;
    const requests: string[]=[];
    vi.stubGlobal('fetch', vi.fn(async (input: URL, options: RequestInit) => {
      expect(input.origin).toBe('https://opendefender.net');
      expect(options.redirect).toBe('error');
      if (input.pathname.includes('/status')) return new Response(JSON.stringify(status()));
      requests.push(input.toString());
      if (failSecond && input.searchParams.get('offset') === '500') return new Response('unavailable',{status:503});
      const page=paginateCharges(charges,charges.length,'en',parseChargePagination(Object.fromEntries(input.searchParams)));
      return new Response(JSON.stringify({success:true,...page,count:page!.charges.length,totalAvailable:charges.length}));
    }));
    expect((await checkCaliforniaDeployment()).ok).toBe(true);
    expect(requests).toHaveLength(2);
    expect(new URL(requests[1]).searchParams.get('snapshot')).toMatch(/^[a-f0-9]{64}$/);
    failSecond=true;
    await expect(checkCaliforniaDeployment()).rejects.toThrow('could not be loaded');
  });

});
