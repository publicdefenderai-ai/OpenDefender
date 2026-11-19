import { expect, it } from 'vitest';
import { readFileSync, mkdtempSync, symlinkSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import frozenProposal from '../scripts/data-review/florida-launch/restoration-proposal.json';
import comparison from '../scripts/data-review/florida-launch/restoration-comparison.json';
import { buildRestorationProposal, writeRestorationProposal, restorationInputState, type RestorationInputSnapshot } from '../scripts/data-review/florida-launch/prepare-restoration-proposal';
import { buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
it('preserves the frozen approved package and refuses to rebind it to later corrected content',()=>{
  expect(frozenProposal.proposedReceipt.reportHash).toBe(frozenProposal.proposedReportHash);
  expect(frozenProposal.proposedReceipt.eligibilityHash).toBe(frozenProposal.proposedEligibilityHash);
  expect(createHash('sha256').update(JSON.stringify(frozenProposal.proposedReceipt)).digest('hex')).toBe(frozenProposal.proposedReceiptHash);
  expect(frozenProposal.recordIds).toHaveLength(101);
  expect(frozenProposal.dependencyBindings).toBe(920);
  expect(frozenProposal.activeReceiptAccepted).toBe(false); // Original proposal-time observation.
  expect(()=>buildRestorationProposal()).toThrow('Active baseline drift');
  // Changes to candidate evidence cannot bypass the stricter current-input guard.
  const changed=structuredClone(comparison);changed.rows[0].candidateHash='0'.repeat(64);
  expect(()=>buildRestorationProposal(changed)).toThrow('Active baseline drift');
});
it('rejects checkout output and never overwrites an existing output symlink',()=>{
  expect(()=>writeRestorationProposal(process.cwd())).toThrow('outside the checkout');
  expect(()=>writeRestorationProposal(join(process.cwd(),'..candidate'))).toThrow('outside the checkout');
  const dir=mkdtempSync(join(tmpdir(),'fl-proposal-'));
  const active=join(process.cwd(),'scripts/data-review/output/florida-reviewed-refresh-receipt.json');
  const before=readFileSync(active,'utf8');
  symlinkSync(active,join(dir,'proposed-report.json'));
  expect(()=>writeRestorationProposal(dir)).toThrow('Active baseline drift');
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
it('refuses to write a new candidate after unapproved corrective binding changes',()=>{
  const dir=mkdtempSync(join(tmpdir(),'fl-corrected-proposal-'));
  expect(()=>writeRestorationProposal(dir)).toThrow('Active baseline drift');
  expect(readdirSync(dir)).toEqual([]);
});
