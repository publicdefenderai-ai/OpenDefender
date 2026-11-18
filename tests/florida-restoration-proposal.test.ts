import { expect, it } from 'vitest';
import { readFileSync, mkdtempSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import frozenProposal from '../scripts/data-review/florida-launch/restoration-proposal.json';
import comparison from '../scripts/data-review/florida-launch/restoration-comparison.json';
import { buildRestorationProposal, writeRestorationProposal, restorationInputState, type RestorationInputSnapshot } from '../scripts/data-review/florida-launch/prepare-restoration-proposal';
import { buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
it('reproduces the proposed binding without altering any active input or prior decision',()=>{
  const result=buildRestorationProposal();
  expect(result.summary).toEqual(JSON.parse(readFileSync('scripts/data-review/florida-launch/restoration-proposal.json','utf8')));
  expect(result.summary.recordCount).toBe(101);expect(result.summary.dependencyBindings).toBe(920);
  expect(result.summary.decisionRowsUnchanged).toBe(true);expect(result.summary.draftsUnchanged).toBe(true);
  expect(result.summary.activeReceiptAccepted).toBe(false); // Historical proposal-time observation remains frozen.
  expect(result.observation).toEqual({inputState:'approved_artifacts_installed',activeReceiptAcceptedAtComparisonTime:true});
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

const installedHashes:Record<string,string>={
  'scripts/data-review/output/florida-reviewed-analysis.json':frozenProposal.proposedReportHash,
  'shared/florida-reviewed-eligibility.json':frozenProposal.proposedEligibilityHash,
  'scripts/data-review/output/florida-reviewed-refresh-receipt.json':frozenProposal.proposedReceiptHash,
};
function inputFixture(installedPaths:string[]):RestorationInputSnapshot {
  const byteHashes:Record<string,string>={...comparison.activeBefore},canonicalHashes:Record<string,string>={};
  for(const path of Object.keys(installedHashes)) {
    canonicalHashes[path]=installedPaths.includes(path)?installedHashes[path]:'original-canonical-hash-not-needed-for-byte-bound-baseline';
    if(installedPaths.includes(path)) byteHashes[path]='installed-file-bytes';
  }
  return {byteHashes,canonicalHashes};
}
it('accepts only the complete original baseline or exact complete approved installation',()=>{
  const paths=Object.keys(installedHashes);
  expect(restorationInputState(inputFixture([]))).toBe('original_baseline');
  expect(restorationInputState(inputFixture(paths))).toBe('approved_artifacts_installed');
  for(let mask=1;mask<7;mask++) {
    const mixed=paths.filter((_,i)=>(mask&(1<<i))!==0);
    expect(()=>restorationInputState(inputFixture(mixed))).toThrow('mixed restoration');
  }
});
it('rejects changed approved content and unrelated immutable-file drift',()=>{
  const paths=Object.keys(installedHashes);
  for(const path of paths) {
    const snapshot=inputFixture(paths);
    const changed=JSON.parse(readFileSync(path,'utf8'));
    if(path.endsWith('analysis.json')) changed.drafts[0].id+='-changed';
    else if(path.endsWith('eligibility.json')) changed.decisions[0].status='held';
    else changed.expiresAt='2030-01-01T00:00:00Z';
    snapshot.canonicalHashes[path]=createHash('sha256').update(JSON.stringify(changed)).digest('hex');
    expect(()=>restorationInputState(snapshot)).toThrow('baseline drift');
  }
  const immutable=Object.keys(comparison.activeBefore).find(path=>!(path in installedHashes))!;
  for(const selected of [[],paths]) {
    const snapshot=inputFixture(selected);snapshot.byteHashes[immutable]='unexpected-change';
    expect(()=>restorationInputState(snapshot)).toThrow('baseline drift');
  }
});
it('writes a reproducible proposal after installation while reporting the separate current observation',()=>{
  const dir=mkdtempSync(join(tmpdir(),'fl-installed-proposal-'));
  const result=writeRestorationProposal(dir);
  expect(result.summary).toEqual(frozenProposal);
  expect(result.observation.inputState).toBe('approved_artifacts_installed');
  expect(JSON.parse(readFileSync(join(dir,'proposed-summary.json'),'utf8'))).toEqual(frozenProposal);
});
