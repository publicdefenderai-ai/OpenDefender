/** Reuse reviewed branches without converting section overlap into legal approval. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import plan from './benchmark-reconciliation-plan.json';
import previous from '../output/california-repeat-theft-assembly-review.json';
import {readJusticePropertyBenchmark,validateJusticePropertyPacket} from './justice-property-review';
import {validateCaliforniaPersonPropertyReview} from './person-property-review';
import {validateCaliforniaForgeryTheftReview} from './forgery-theft-review';
import {validateCaliforniaSpecializedPropertyReview} from './specialized-property-review';
import {validateVehicleIdentificationReview} from './vehicle-identification-review';
import {getCaliforniaCanonicalRecord} from '../../../shared/california-authority';
import {californiaPrimaryIdentity} from '../../../shared/california-law-codes';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const plain=(s:string)=>s.replace(/[\u2013\u2014]/g,':').replace(/\s+/g,' ').trim();
type EvidenceRecord={id:string;definitionSha256:string;sources:unknown[];primaryEvidence:{key:string;start:number;end:number;text:string}};
type Definition={id:string;code:string;lawCode?:string;title:string;summary:string;penalty:string;mentalState:string};
const validators={
  'person-property':validateCaliforniaPersonPropertyReview,
  'forgery-theft':validateCaliforniaForgeryTheftReview,
  'specialized-property':validateCaliforniaSpecializedPropertyReview,
  'vehicle-identification':validateVehicleIdentificationReview,
};
export function buildBenchmarkReconciliation(mappings=plan) {
  validateJusticePropertyPacket();
  const benchmark=readJusticePropertyBenchmark();
  const providers=new Map<string,{definitions:Definition[];records:EvidenceRecord[];reviewSha256:string;definitionsSha256:string}>();
  for(const name of [...new Set(mappings.map(m=>m.provider))]) {
    if(!Object.hasOwn(validators,name))throw new Error('Unknown review provider');
    validators[name as keyof typeof validators]();
    const definitionsText=fs.readFileSync(new URL(`../../../shared/california-${name}-additions.json`,import.meta.url),'utf8');
    const reviewText=fs.readFileSync(new URL(`../output/california-${name}-review.json`,import.meta.url),'utf8');
    providers.set(name,{definitions:JSON.parse(definitionsText),records:JSON.parse(reviewText).records,reviewSha256:hash(reviewText),definitionsSha256:hash(definitionsText)});
  }
  if(new Set(mappings.map(m=>m.instructionId)).size!==mappings.length)throw new Error('Duplicate instruction mapping');
  const links=mappings.map(m=>{
    const instruction=benchmark.instructions.find(i=>i.id===m.instructionId);
    const old=previous.crosswalk.find(i=>i.id===m.instructionId);
    if(!instruction||!old||old.boundedChargeIds.length||old.status!=='catalog_overlap_requires_branch_review')throw new Error('Mapping is not an unmatched substantive instruction');
    if(!m.rationale.trim()||!m.chargeIds.length||new Set(m.chargeIds).size!==m.chargeIds.length)throw new Error('Missing rationale or duplicate charge');
    const provider=providers.get(m.provider)!;
    return {...m,instructionEvidence:{firstPage:instruction.firstPage,lastPage:instruction.lastPage,pageHashes:instruction.pageHashes},
      reviewArtifact:`scripts/data-review/output/california-${m.provider}-review.json`,reviewSha256:provider.reviewSha256,definitionsSha256:provider.definitionsSha256,
      charges:m.chargeIds.map(id=>{
        const definition=provider.definitions.find(d=>d.id===id),record=provider.records.find(r=>r.id===id),canonical=getCaliforniaCanonicalRecord(id);
        if(!definition||!record||hash(definition)!==record.definitionSha256||!canonical?.selectable||canonical.code!==definition.code||canonical.officialTitle!==definition.title||canonical.penalty!==definition.penalty)throw new Error('Unreviewed or changed charge');
        const key=californiaPrimaryIdentity(definition.lawCode??'PEN',definition.code).key;
        if(!old.sourceKeys.includes(key)||record.primaryEvidence.key!==key)throw new Error('Instruction and charge primary do not match');
        return {id,code:definition.code,lawCode:definition.lawCode??'PEN',definitionSha256:record.definitionSha256,summary:definition.summary,mentalState:definition.mentalState,sources:record.sources,primaryEvidence:record.primaryEvidence};
      })};
  });
  const crosswalk=previous.crosswalk.map(row=>{
    const link=links.find(m=>m.instructionId===row.id);
    return {...row,previousStatus:row.status,status:link?'bounded_prior_publication_match_other_branches_open':row.status,boundedChargeIds:link?link.chargeIds:row.boundedChargeIds,
      reconciliationNote:link?.rationale??'Prior disposition preserved; a shared section alone does not resolve a branch.'};
  });
  const open=crosswalk.filter(r=>!r.boundedChargeIds.length&&r.status!=='context_defense_or_grading');
  const groups=[...new Set(open.map(r=>r.group))].map(group=>({group,instructionIds:open.filter(r=>r.group===group).map(r=>r.id),sourceKeys:[...new Set(open.filter(r=>r.group===group).flatMap(r=>r.sourceKeys))].sort(),treatment:'Compare exact conduct branches before acquisition or publication. Existing section associations are research leads only.'}));
  return {schemaVersion:1,scope:'bounded_benchmark_reconciliation_not_statewide_completeness',previousReviewSha256:hash(previous),benchmarkSha256:hash(benchmark),planSha256:hash(mappings),
    limits:['No new charges, penalty changes or freshness renewal. Configured membership is not live availability.',
      'Bounded matches identify previously reviewed conduct; they do not certify every instruction alternative, defense, sentencing issue or source section.',
      'Context, defenses and grading instructions stay in the inventory but are not counted as missing standalone charges.',
      'Prior unresolved findings remain open even when an instruction receives a bounded match.'],
    counts:{instructions:crosswalk.length,previousBounded:previous.crosswalk.filter(r=>r.boundedChargeIds.length).length,newlyLinked:links.length,bounded:crosswalk.filter(r=>r.boundedChargeIds.length).length,context:crosswalk.filter(r=>!r.boundedChargeIds.length&&r.status==='context_defense_or_grading').length,openComparisons:open.length,configuredChoices:604 /* Historical PR47 snapshot, not a live catalog count. */},
    links,crosswalk,groups,remainingFindings:previous.remainingFindings,
    nextBatch:'Prioritize missing financial/identity branches together: employee and elder theft, access-card transfer/account information, insurance-fraud alternatives and identity-transfer/false-personation. Keep sibling-subdivision matches unresolved until reviewed.'};
}
export type BenchmarkReconciliation=ReturnType<typeof buildBenchmarkReconciliation>;
export const readBenchmarkReconciliation=()=>JSON.parse(fs.readFileSync(new URL('../output/california-benchmark-reconciliation.json',import.meta.url),'utf8')) as BenchmarkReconciliation;
export function validateBenchmarkReconciliation(review=readBenchmarkReconciliation()) {
  if(!same(review,buildBenchmarkReconciliation()))throw new Error('Reconciliation evidence or accounting changed');
  return review.counts;
}
export function renderBenchmarkReconciliation(review:BenchmarkReconciliation) {
  const c=review.counts;
  return ['# California benchmark reconciliation','',`${c.bounded} bounded matches among ${c.instructions} instruction entries: ${c.previousBounded} prior matches plus ${c.newlyLinked} links to existing reviewed choices. ${c.context} context entries and ${c.openComparisons} substantive comparisons remain separately accounted for. Configured choices remain ${c.configuredChoices}.`,'',...review.limits.map(s=>`- ${s}`),'','## Existing work recovered','',...review.links.flatMap(l=>[`### CALCRIM ${l.instructionId}`,'',l.rationale,'',`Existing choices: ${l.chargeIds.join(', ')}.`,`Evidence: [original review](./california-${l.provider}-review.json), instruction PDF pages ${l.instructionEvidence.firstPage}-${l.instructionEvidence.lastPage}.`,'']),'## Remaining substantive comparisons','',...review.groups.flatMap(g=>[`### ${plain(g.group).replaceAll('_',' ')}`,'',`Instructions: ${g.instructionIds.join(', ')}.`,`Sources: ${g.sourceKeys.join(', ')}.`,g.treatment,'']),'## Complete instruction accounting','','| Instruction | Disposition | Bounded choices |','| --- | --- | --- |',...review.crosswalk.map(r=>`| ${plain(r.heading).replaceAll('|','/')} | ${r.status.replaceAll('_',' ')} | ${r.boundedChargeIds.join(', ')||'None'} |`),'','## Next publication batch','',review.nextBatch,'','Prior unresolved findings are preserved in full in the JSON artifact. No family is closed by this reconciliation.',''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildBenchmarkReconciliation();
  validateBenchmarkReconciliation(review);
  fs.writeFileSync(new URL('../output/california-benchmark-reconciliation.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-benchmark-reconciliation.md',import.meta.url),renderBenchmarkReconciliation(review));
  console.log(JSON.stringify(review.counts));
}
