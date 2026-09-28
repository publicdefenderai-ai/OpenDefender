import { describe, expect, it } from "vitest";
import { assessCaliforniaDeployment } from "../scripts/check-california-deployment";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaRecordEvidenceStatus } from "../shared/california-authority";
import { getCaliforniaEvidenceSummary } from "../shared/california-freshness";
const now = () => new Date(receipt.checkedAt);
const status = () => ({ success: true, archiveEvidence: getCaliforniaEvidenceSummary(now()), lastRun: { status: "completed" }, linkedChargeCount: 236 });
const selector = () => ({ success: true, totalAvailable: 235, charges: CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable && getCaliforniaRecordEvidenceStatus(row, now()) === "current").map(row => ({ id: row.canonicalId })) });
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
});
