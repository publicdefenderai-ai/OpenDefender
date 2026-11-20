import { createHash } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ ids: [] as string[] }));
vi.mock('../server/db', () => ({ db: {} }));
vi.mock('../server/services/authority-source-database', () => ({
  getCurrentAuthoritySelectableChargeIds: async () => new Set(state.ids),
}));
import candidate from '../scripts/data-review/florida-launch/corrected-restoration-candidate.json';
import proposal from '../scripts/data-review/florida-launch/restoration-proposal.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import eligibility from '../shared/florida-reviewed-eligibility.json';
import { checkStatutoryReceipts } from '../scripts/check-statutory-receipt-freshness.mjs';
import { syntheticFloridaReceipt } from './helpers/florida-receipt-fixture';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import { FLORIDA_REVIEWED_SOURCE_RECORDS as records, isFloridaReviewedSourceFresh, validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { getCurrentAuthoritySelectableChargeIds } from '../server/services/authority-eligibility';
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); state.ids = []; });
it('installs the exact corrected package and rejects the superseded approval', () => {
  expect(hash(report)).not.toBe(proposal.proposedReportHash);
  expect(hash(eligibility)).not.toBe(proposal.proposedEligibilityHash);
  expect(hash(receipt)).toBe(candidate.candidatePackage.receiptHash);
  expect(hash(report)).toBe(candidate.candidatePackage.reportHash);
  expect(hash(eligibility)).toBe(candidate.candidatePackage.eligibilityHash);
  expect(receipt.expiresAt).toBe(proposal.proposedReceipt.expiresAt);
  expect(validateFloridaReviewedRefreshReceipt(proposal.proposedReceipt,report,eligibility,records,new Date(receipt.checkedAt))).not.toBeNull();
  expect(receipt).toEqual(candidate.receipt);
  expect(records.map(r => r.chargeId).sort()).toEqual([...proposal.recordIds].sort());
  expect(records.reduce((n,r) => n + r.dependencies.length,0)).toBeGreaterThan(920);
  expect(receipt.documents).toHaveLength(225);
});
it('rejects changed report, decisions, missing documents and an extended deadline', () => {
  const receipt = syntheticFloridaReceipt; // Test fixture only; no new approval is issued.
  const now = new Date(receipt.checkedAt);
  expect(validateFloridaReviewedRefreshReceipt(receipt, report, eligibility, records, now)).toBeNull();
  expect(validateFloridaReviewedRefreshReceipt(receipt, {...report,drafts:[]}, eligibility, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt(receipt, report, {...eligibility,decisions:[]}, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt({...receipt,documents:receipt.documents.slice(1)}, report, eligibility, records, now)).not.toBeNull();
  expect(validateFloridaReviewedRefreshReceipt({...receipt,expiresAt:'2030-01-01T00:00:00.000Z'}, report, eligibility, records, now)).not.toBeNull();
});
it('requires independent database eligibility and withholds at the exact receipt deadline', async () => {
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

it('reports matching installed evidence without changing the deadline monitor rules', () => {
  const row=checkStatutoryReceipts(process.cwd(),new Date(receipt.checkedAt)).receipts.find((r:any)=>r.name==='florida-reviewed-refresh-receipt.json');
  expect(row).toMatchObject({status:'current',bindingStatus:'matched',expiresAt:'2027-02-17T17:39:02.320Z'});
});
