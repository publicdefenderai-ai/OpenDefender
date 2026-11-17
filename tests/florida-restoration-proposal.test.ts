import { expect, it } from 'vitest';
import { readFileSync, mkdtempSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import comparison from '../scripts/data-review/florida-launch/restoration-comparison.json';
import { buildRestorationProposal, writeRestorationProposal } from '../scripts/data-review/florida-launch/prepare-restoration-proposal';
import { buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
it('reproduces the proposed binding without altering any active input or prior decision',()=>{
  const result=buildRestorationProposal();
  expect(result.summary).toEqual(JSON.parse(readFileSync('scripts/data-review/florida-launch/restoration-proposal.json','utf8')));
  expect(result.summary.recordCount).toBe(101);expect(result.summary.dependencyBindings).toBe(920);
  expect(result.summary.decisionRowsUnchanged).toBe(true);expect(result.summary.draftsUnchanged).toBe(true);
  expect(result.summary.activeReceiptAccepted).toBe(false);
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,result.report,result.eligibility);
  expect(validateFloridaReviewedRefreshReceipt(result.receipt,result.report,result.eligibility,records,new Date(result.receipt.checkedAt))).toBeNull();
  expect(validateFloridaReviewedRefreshReceipt(result.receipt,result.report,result.eligibility,records,new Date(result.receipt.expiresAt))).not.toBeNull();
});
it('rejects missing dependency bindings, changed evidence and dates outside the acquisition window',()=>{
  const incomplete=structuredClone(comparison);incomplete.recordCoverage[0].bindings.pop();
  expect(()=>buildRestorationProposal(incomplete)).toThrow('dependency mismatch');
  const changed=structuredClone(comparison);changed.rows[0].candidateHash='0'.repeat(64);
  expect(()=>buildRestorationProposal(changed)).toThrow('changed comparison');
  const late=structuredClone(comparison);late.rows[0].retrievedAt='2030-01-01T00:00:00.000Z';
  expect(()=>buildRestorationProposal(late)).toThrow();
});
it('rejects checkout output and never overwrites an existing output symlink',()=>{
  expect(()=>writeRestorationProposal(process.cwd())).toThrow('outside the checkout');
  expect(()=>writeRestorationProposal(join(process.cwd(),'..candidate'))).toThrow('outside the checkout');
  const dir=mkdtempSync(join(tmpdir(),'fl-proposal-'));
  const active=join(process.cwd(),'scripts/data-review/output/florida-reviewed-refresh-receipt.json');
  const before=readFileSync(active,'utf8');
  symlinkSync(active,join(dir,'proposed-report.json'));
  expect(()=>writeRestorationProposal(dir)).toThrow('EEXIST');
  expect(readFileSync(active,'utf8')).toBe(before);
});
