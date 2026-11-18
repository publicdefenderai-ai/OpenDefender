import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import comparison from './restoration-comparison.json';
import trigger from './cannabis-trigger-review.json';
import frozenProposal from './restoration-proposal.json';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../../../shared/florida-reviewed-batch';
import { buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from '../../../server/data/florida-reviewed-source-records';
import { quarterlyDeadline } from '../../../shared/source-verification-policy.mjs';
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const bytes=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
const load=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const outside=(repository:string,path:string)=>{const r=relative(repository,path);return r==='..'||r.startsWith('../');};
const approvedArtifacts:Record<string,string>={
  'scripts/data-review/output/florida-reviewed-analysis.json':frozenProposal.proposedReportHash,
  'shared/florida-reviewed-eligibility.json':frozenProposal.proposedEligibilityHash,
  'scripts/data-review/output/florida-reviewed-refresh-receipt.json':frozenProposal.proposedReceiptHash,
};
export interface RestorationInputSnapshot { byteHashes:Record<string,string>; canonicalHashes:Record<string,string> }
function snapshotInputs():RestorationInputSnapshot {
  return {byteHashes:Object.fromEntries(Object.keys(comparison.activeBefore).map(path=>[path,bytes(path)])),
    canonicalHashes:Object.fromEntries(Object.keys(approvedArtifacts).map(path=>[path,hash(load(path))]))};
}
/** Accept the complete original baseline or the complete reviewed installation, never a mixed triple. */
export function restorationInputState(snapshot:RestorationInputSnapshot):'original_baseline'|'approved_artifacts_installed' {
  const entries=Object.entries(comparison.activeBefore);
  if(entries.every(([path,expected])=>snapshot.byteHashes[path]===expected)) return 'original_baseline';
  const unchangedOthers=entries.filter(([path])=>!(path in approvedArtifacts)).every(([path,expected])=>snapshot.byteHashes[path]===expected);
  const installed=Object.entries(approvedArtifacts).every(([path,expected])=>snapshot.canonicalHashes[path]===expected);
  if(unchangedOthers && installed) return 'approved_artifacts_installed';
  throw Error('Active baseline drift or mixed restoration artifacts');
}
export function buildRestorationProposal(evidence=comparison) {
  const inputState=restorationInputState(snapshotInputs());
  if(evidence.sectionCount!==130 || evidence.chargeCount!==101 || evidence.rows.length!==130 || evidence.recordCoverage.length!==101 || new Set(evidence.rows.map(r=>r.section)).size!==130 || evidence.rows.some(r=>r.classification!=='matching_text_and_retained_metadata' || !r.retrievedAt || !Number.isFinite(Date.parse(r.retrievedAt)) || Date.parse(r.retrievedAt)>Date.parse(evidence.checkedAt) || !r.candidateHash || r.retainedHashes.some(h=>h!==r.candidateHash)) || evidence.recordCoverage.some(r=>!r.complete)) throw Error('Incomplete or changed comparison evidence');
  const originalReport=load('scripts/data-review/output/florida-reviewed-analysis.json') as FloridaReviewedReport;
  const originalEligibility=load('shared/florida-reviewed-eligibility.json') as FloridaReviewedEligibility;
  const report=structuredClone(originalReport), eligibility=structuredClone(originalEligibility);
  for(const document of Object.values(report.sourceEvidence)) {
    const row=evidence.rows.find(r=>r.section===document.section);
    if(!row || row.candidateHash!==document.contentHash || createHash('sha256').update(document.text).digest('hex')!==row.candidateHash) throw Error('Unbound proposed document '+document.sourceKey);
    document.retrievedAt=row.retrievedAt!;
  }
  eligibility.reportHash=hash(report);
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report,eligibility);
  if(records.length!==101 || JSON.stringify(records.map(r=>r.chargeId).sort())!==JSON.stringify(evidence.recordCoverage.map(r=>r.id).sort())) throw Error('Candidate identity mismatch');
  for(const record of records) {
    const coverage=evidence.recordCoverage.find(r=>r.id===record.chargeId)!;
    if(coverage.bindings.length!==record.dependencies.length || record.dependencies.some(doc=>!coverage.bindings.some(b=>b.sourceKey===doc.sourceKey && b.candidateHash===doc.contentHash && b.section===doc.section))) throw Error('Candidate dependency mismatch '+record.chargeId);
  }
  const documents=[...new Map(records.flatMap(r=>r.dependencies.map(d=>[d.sourceKey,{sourceKey:d.sourceKey,contentHash:d.contentHash,retrievedAt:d.retrievedAt}] as const))).values()];
  const oldest=new Date(Math.min(...documents.map(d=>Date.parse(d.retrievedAt)))).toISOString();
  const receipt:FloridaReviewedReceipt={schemaVersion:1,verificationPolicy:'quarterly-v1',reportHash:hash(report),eligibilityHash:hash(eligibility),checkedAt:evidence.checkedAt,expiresAt:quarterlyDeadline(oldest),documents};
  const problem=validateFloridaReviewedRefreshReceipt(receipt,report,eligibility,records,new Date(receipt.checkedAt));
  if(problem) throw Error(problem);
  const currentReceipt=load('scripts/data-review/output/florida-reviewed-refresh-receipt.json');
  const activeReceiptAcceptedAtComparisonTime=validateFloridaReviewedRefreshReceipt(currentReceipt,report,eligibility,records,new Date(receipt.checkedAt))===null;
  if(activeReceiptAcceptedAtComparisonTime!==(inputState==='approved_artifacts_installed')) throw Error('Unexpected active receipt validation for input state');
  // Frozen summary describes proposal-time state; observation below describes the current files.
  const summary={schemaVersion:1,status:'proposal_only_not_issued_not_activation_approval',comparisonHash:hash(evidence),constitutionalEvidenceHash:hash(trigger),baselineFiles:evidence.activeBefore,proposedReportHash:hash(report),proposedEligibilityHash:hash(eligibility),proposedReceiptHash:hash(receipt),proposedReceipt:receipt,recordIds:records.map(r=>r.chargeId),recordCount:records.length,dependencyBindings:records.reduce((n,r)=>n+r.dependencies.length,0),oldestAcquisition:oldest,decisionRowsUnchanged:JSON.stringify(originalEligibility.decisions)===JSON.stringify(eligibility.decisions),draftsUnchanged:JSON.stringify(originalReport.drafts)===JSON.stringify(report.drafts),activeReceiptAccepted:false};
  if(JSON.stringify(summary)!==JSON.stringify(frozenProposal)) throw Error('Historical restoration proposal drift');
  return {report,eligibility,receipt,summary,observation:{inputState,activeReceiptAcceptedAtComparisonTime}};
}
export function writeRestorationProposal(directory:string) {
  if(!isAbsolute(directory)) throw Error('Use an absolute candidate directory outside the checkout');
  const repository=realpathSync(process.cwd());
  if(!outside(repository,resolve(directory))) throw Error('Candidate directory must be outside the checkout');
  mkdirSync(directory,{recursive:true});
  const output=realpathSync(directory);
  if(!outside(repository,output)) throw Error('Candidate directory must be outside the checkout');
  const before=snapshotInputs().byteHashes;
  const proposed=buildRestorationProposal();
  const {observation,...artifacts}=proposed;
  for(const [name,value] of Object.entries(artifacts)) writeFileSync(resolve(output,'proposed-'+name+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
  for(const [path,expected] of Object.entries(before)) if(bytes(path)!==expected) throw Error('Active file changed during preparation: '+path);
  return {summary:proposed.summary,observation};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  if(!process.argv[2]) throw Error('Pass an absolute external candidate directory');
  const {summary,observation}=writeRestorationProposal(process.argv[2]);
  console.log(JSON.stringify({records:summary.recordCount,bindings:summary.dependencyBindings,expiresAt:summary.proposedReceipt.expiresAt,status:summary.status,observation}));
}
