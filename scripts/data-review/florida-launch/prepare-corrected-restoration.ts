/** Candidate-only successor: no active writes, no renewal and no database connection. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,realpathSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import comparison from './restoration-comparison.json';
import previousProposal from './restoration-proposal.json';
import corrected from '../output/florida-reviewed-closeout-corrections.json';
import successor from '../florida-reviewed-closeout/successor-baseline.json';
import previousDefinitions from '../florida-reviewed-closeout/previous-definitions.json';
import previousEvidence from '../florida-reviewed-closeout/previous-evidence.json';
import inputs from './corrected-restoration-inputs.json';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../../../shared/florida-reviewed-batch';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt,type FloridaReviewedReport,type FloridaReviewedEligibility,type FloridaReviewedReceipt} from '../../../server/data/florida-reviewed-source-records';
import {quarterlyDeadline} from '../../../shared/source-verification-policy.mjs';
const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const textHash=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const snapshot=()=>Object.fromEntries(Object.keys(inputs.files).map(path=>[path,textHash(readFileSync(path))]));
const outside=(p:string)=>{const r=relative(realpathSync(process.cwd()),p);return r==='..'||r.startsWith('../');};
export function buildCorrectedRestorationCandidate(report=read('scripts/data-review/output/florida-reviewed-analysis.json') as FloridaReviewedReport,eligibility=read('shared/florida-reviewed-eligibility.json') as FloridaReviewedEligibility){
  const observed=snapshot();
  const receiptPath='scripts/data-review/output/florida-reviewed-refresh-receipt.json';
  // Frozen proposal replay permits only its original receipt or the exact owner-approved
  // successor. Keep the historical input/candidate hashes unchanged after installation.
  if(observed[receiptPath]!==inputs.files[receiptPath]){
    if(hash(read(receiptPath))!=='22f5006214838e21cc5ea8d5fa520cbf243b952c85e82f07849580238cc20bab')throw Error('Unrecognized installed receipt');
    observed[receiptPath]=inputs.files[receiptPath];
  }
  if(JSON.stringify(observed)!==JSON.stringify(inputs.files))throw Error('Corrected restoration input drift');
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report,eligibility);
  if(records.length!==101 || JSON.stringify(records.map(r=>r.chargeId).sort())!==JSON.stringify([...previousProposal.recordIds].sort()))throw Error('Changed restoration identity set');
  const sources=new Map(records.flatMap(r=>r.dependencies.map(d=>[d.section,d] as const)));
  for(const [section,doc]of sources){
    if(textHash(doc.text)!==doc.contentHash)throw Error('Source content mismatch '+section);
    const original=comparison.rows.find(r=>r.section===section),supplement=successor.sources.find(r=>r.section===section);
    const expected=original?{contentHash:original.candidateHash,retrievedAt:original.retrievedAt}:supplement;
    if(!expected||expected.contentHash!==doc.contentHash||expected.retrievedAt!==doc.retrievedAt)throw Error('Source acquisition not bound '+section);
    if(!original&&(!supplement||supplement.status!=='reacquired_matching_supplement'||corrected.documents[section as keyof typeof corrected.documents]?.contentHash!==doc.contentHash))throw Error('Supplemental evidence missing '+section);
  }
  const documents=[...new Map(records.flatMap(r=>r.dependencies.map(d=>[d.sourceKey,{sourceKey:d.sourceKey,contentHash:d.contentHash,retrievedAt:d.retrievedAt}] as const))).values()];
  // Every source-key instance, not merely the first section instance, must agree.
  for(const r of records)for(const d of r.dependencies){const s=sources.get(d.section)!;if(d.contentHash!==s.contentHash||d.retrievedAt!==s.retrievedAt)throw Error('Inconsistent section instances');}
  const oldest=new Date(Math.min(...documents.map(d=>Date.parse(d.retrievedAt)))).toISOString();
  const checkedAt=inputs.preparedAt;
  if(documents.some(d=>Date.parse(d.retrievedAt)>Date.parse(checkedAt)))throw Error('Acquisition after proposal preparation');
  const receipt:FloridaReviewedReceipt={schemaVersion:1,verificationPolicy:'quarterly-v1',reportHash:hash(report),eligibilityHash:hash(eligibility),checkedAt,expiresAt:quarterlyDeadline(oldest),documents};
  if(receipt.expiresAt!==previousProposal.proposedReceipt.expiresAt)throw Error('Unexpected change to original evidence ceiling');
  const reason=validateFloridaReviewedRefreshReceipt(receipt,report,eligibility,records,new Date(checkedAt));if(reason)throw Error(reason);
  if(validateFloridaReviewedRefreshReceipt(previousProposal.proposedReceipt,report,eligibility,records,new Date(checkedAt))===null)throw Error('Historical approval unexpectedly accepts corrections');
  const role=(r:string)=>['definition','exception','justification'].includes(r)?'grading':r;
  const physical=(id:string,key:string,supportRole:string)=>`${id}|${key}|${supportRole}`;
  const perRecord=records.map(record=>{
    const old=previousEvidence.find(r=>r.id===record.chargeId);
    const oldBindings=old?old.requiredDependencies.map(d=>({sourceKey:d.sourceKey,supportRole:role(d.role),contentHash:d.contentHash})):record.dependencies;
    const oldKeys=[...new Set(oldBindings.map(d=>physical(record.chargeId,d.sourceKey,d.supportRole)))].sort();
    const newKeys=[...new Set(record.dependencies.map(d=>physical(record.chargeId,d.sourceKey,d.supportRole)))].sort();
    const currentDefinition=FLORIDA_REVIEWED_DEFINITIONS.find(d=>d.id===record.chargeId)!;
    const oldDefinition=previousDefinitions.find(d=>d.id===record.chargeId)??currentDefinition;
    return {id:record.chargeId,corrected:Boolean(old),priorDefinitionHash:hash(oldDefinition),candidateDefinitionHash:hash(currentDefinition),priorDependencyReferences:oldBindings.length,candidateDependencyReferences:record.dependencies.length,priorPhysicalLinks:oldKeys,candidatePhysicalLinks:newKeys,addedPhysicalLinks:newKeys.filter(k=>!oldKeys.includes(k)),removedPhysicalLinks:oldKeys.filter(k=>!newKeys.includes(k))};
  });
  const oldSourceKeys=new Set(previousProposal.proposedReceipt.documents.map(d=>d.sourceKey));
  return {schemaVersion:1,status:'candidate_only_not_issued_not_activation_approval',inputsHash:hash(inputs),priorPackage:{reportHash:previousProposal.proposedReportHash,eligibilityHash:previousProposal.proposedEligibilityHash,receiptHash:previousProposal.proposedReceiptHash,definitionsHash:hash(FLORIDA_REVIEWED_DEFINITIONS.map(d=>previousDefinitions.find(p=>p.id===d.id)??d))},candidatePackage:{reportHash:hash(report),eligibilityHash:hash(eligibility),receiptHash:hash(receipt),definitionsHash:hash(FLORIDA_REVIEWED_DEFINITIONS)},previousProposalHash:hash(previousProposal),correctivePacketHash:hash(corrected),receiptHash:hash(receipt),receipt,recordIds:records.map(r=>r.chargeId),sourceDelta:{priorSections:comparison.sectionCount,candidateSections:sources.size,priorSourceKeys:oldSourceKeys.size,candidateSourceKeys:documents.length,addedSourceKeys:documents.map(d=>d.sourceKey).filter(k=>!oldSourceKeys.has(k)),removedSourceKeys:[...oldSourceKeys].filter(k=>!documents.some(d=>d.sourceKey===k)),documents:documents.map(d=>({sourceKey:d.sourceKey,prior:previousProposal.proposedReceipt.documents.find(p=>p.sourceKey===d.sourceKey)??null,candidate:d})),reusedOfficialSections:comparison.rows.map(r=>r.section),additionalOfficialSections:[...sources.keys()].filter(s=>!comparison.rows.some(r=>r.section===s))},linkDelta:{priorReferences:perRecord.reduce((n,r)=>n+r.priorDependencyReferences,0),candidateReferences:perRecord.reduce((n,r)=>n+r.candidateDependencyReferences,0),priorPhysicalLinks:perRecord.reduce((n,r)=>n+r.priorPhysicalLinks.length,0),candidatePhysicalLinks:perRecord.reduce((n,r)=>n+r.candidatePhysicalLinks.length,0),addedPhysicalLinks:perRecord.flatMap(r=>r.addedPhysicalLinks),removedPhysicalLinks:perRecord.flatMap(r=>r.removedPhysicalLinks)},perRecord,activeReceiptAccepted:false,productionExistingOrMissingLinks:'not_observed_no_database_access'};
}
export function writeCorrectedRestorationCandidate(directory:string){
  if(!isAbsolute(directory)||!outside(resolve(directory)))throw Error('Candidate directory must be outside checkout');
  mkdirSync(directory,{recursive:true});if(!outside(realpathSync(directory)))throw Error('Candidate directory must be outside checkout');
  const before=snapshot(),result=buildCorrectedRestorationCandidate();
  writeFileSync(resolve(directory,'corrected-restoration-candidate.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  if(JSON.stringify(snapshot())!==JSON.stringify(before))throw Error('Active inputs changed during preparation');return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 if(process.argv[2]==='--check'){const actual=read('scripts/data-review/florida-launch/corrected-restoration-candidate.json');if(JSON.stringify(actual)!==JSON.stringify(buildCorrectedRestorationCandidate()))throw Error('Candidate reproduction drift');console.log('Candidate replay matches; no activation');}
 else {if(!process.argv[2])throw Error('Use --check or a new external candidate directory');const r=writeCorrectedRestorationCandidate(process.argv[2]);console.log(JSON.stringify({status:r.status,ids:r.recordIds.length,sources:r.sourceDelta.candidateSourceKeys,links:r.linkDelta.candidatePhysicalLinks,expiresAt:r.receipt.expiresAt}));}
}
