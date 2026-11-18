import { createHash } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ ids: [] as string[] }));
vi.mock('../server/db', () => ({ db: {} }));
vi.mock('../server/services/authority-source-database', () => ({
  getCurrentAuthoritySelectableChargeIds: async () => new Set(state.ids),
}));
import proposal from '../scripts/data-review/florida-launch/restoration-proposal.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import eligibility from '../shared/florida-reviewed-eligibility.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import { FLORIDA_REVIEWED_SOURCE_RECORDS as records, isFloridaReviewedSourceFresh, validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { getCurrentAuthoritySelectableChargeIds } from '../server/services/authority-eligibility';
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); state.ids = []; });
it('installs exactly the frozen proposal and its complete dependency set', () => {
  expect(hash(report)).toBe(proposal.proposedReportHash);
  expect(hash(eligibility)).toBe(proposal.proposedEligibilityHash);
  expect(hash(receipt)).toBe(proposal.proposedReceiptHash);
  expect(receipt).toEqual(proposal.proposedReceipt);
  expect(records.map(r => r.chargeId).sort()).toEqual([...proposal.recordIds].sort());
  expect(records.reduce((n,r) => n + r.dependencies.length,0)).toBe(920);
  expect(receipt.documents).toHaveLength(221);
});
it('rejects changed report, decisions, missing documents and an extended deadline', () => {
  const now = new Date(receipt.checkedAt);
  expect(validateFloridaReviewedRefreshReceipt(receipt, report, eligibility, records, now)).toBeNull();
  expect(validateFloridaReviewedRefreshReceipt(receipt, {...report,drafts:[]}, eligibility, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt(receipt, report, {...eligibility,decisions:[]}, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt({...receipt,documents:receipt.documents.slice(1)}, report, eligibility, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt({...receipt,expiresAt:'2027-02-18T17:39:02.320Z'}, report, eligibility, records, now)).not.toBeNull();
});
it('requires database eligibility and rechecks the actual receipt at exact expiry', async () => {
  vi.stubEnv('RELEASE_CHECK', 'false');
  vi.useFakeTimers({toFake:['Date']});
  vi.setSystemTime(new Date(receipt.checkedAt));
  expect(isFloridaReviewedSourceFresh()).toBe(true);
  expect(await getCurrentAuthoritySelectableChargeIds(['FL'])).toEqual(new Set());
  state.ids = [...proposal.recordIds];
  expect(await getCurrentAuthoritySelectableChargeIds(['FL'])).toEqual(new Set(proposal.recordIds));
  vi.setSystemTime(new Date(Date.parse(receipt.expiresAt)-1));
  expect(await getCurrentAuthoritySelectableChargeIds(['FL'])).toEqual(new Set(proposal.recordIds));
  vi.setSystemTime(new Date(receipt.expiresAt));
  expect(isFloridaReviewedSourceFresh()).toBe(false);
  expect(await getCurrentAuthoritySelectableChargeIds(['FL'])).toEqual(new Set());
});
