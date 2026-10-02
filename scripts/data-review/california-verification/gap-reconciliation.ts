/** Reconcile existing reviewed choices without promoting summaries to complete branch review. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import plan from './gap-reconciliation-plan.json';
import previous from '../output/california-officials-custody-review.json';
import aliases from '../../../shared/california-reviewed-search-aliases.json';
import {CALIFORNIA_CHARGE_CORRECTIONS} from '../../../shared/california-corrections';
import {getCaliforniaCanonicalRecord} from '../../../shared/california-authority';
import {readJusticePropertyBenchmark,validateJusticePropertyPacket} from './justice-property-review';
import {officialsCustodyDocuments,validateOfficialsCustodyReview} from './officials-custody-review';
import {validateCaliforniaRemainingCatalogReview} from './remaining-catalog-review';
import {californiaPrimaryIdentity} from '../../../shared/california-law-codes';
import {sourceText} from './person-property-review';
const hash=(value:unknown)=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const plain=(s:string)=>s.replace(/[\u2013\u2014]/g,':').replace(/\s+/g,' ').trim();
const BATCHES=['one','two','three','four','five','six'];
// Frozen PR50 configuration; later additions must not rewrite this accounting.
const CONFIGURED_CHOICES_SNAPSHOT=644;
const statuses=new Set(['existing_reviewed_choice_partial','existing_broad_choice_needs_branch_work','unpublished_branch','deferred_expression_sensitive']);
export function buildGapReconciliation(mappings=plan) {
  const research=validateJusticePropertyPacket();
  validateOfficialsCustodyReview();
  validateCaliforniaRemainingCatalogReview();
  const docs={...research,...officialsCustodyDocuments()};
  const benchmark=readJusticePropertyBenchmark();
  const outstanding=previous.crosswalk.filter(r=>!r.boundedChargeIds.length&&r.status!=='context_defense_or_grading');
  if(new Set(mappings.map(m=>m.instructionId)).size!==mappings.length||!same(mappings.map(m=>m.instructionId).sort(),outstanding.map(r=>r.id).sort()))throw new Error('Every outstanding instruction must have exactly one disposition');
  const providers=BATCHES.map(batch=>{
    const correctionPath=`shared/california-batch-${batch}-corrections.json`;
    const reviewPath=`scripts/data-review/output/california-batch-${batch}-review.json`;
    const correctionsText=fs.readFileSync(correctionPath,'utf8'),reviewText=fs.readFileSync(reviewPath,'utf8');
    return {correctionPath,reviewPath,correctionsText,reviewText,corrections:JSON.parse(correctionsText) as Array<{id:string}>,review:JSON.parse(reviewText) as {records:Array<{id:string;correctionSha256:string|null}>}};
  });
  const choices=[...new Set(mappings.flatMap(m=>m.chargeIds))].sort().map(id=>{
    const provider=providers.find(p=>p.corrections.some(c=>c.id===id));
    const definition=provider?.corrections.find(c=>c.id===id),original=provider?.review.records.find(r=>r.id===id);
    const correction=CALIFORNIA_CHARGE_CORRECTIONS.find(c=>c.id===id),canonical=getCaliforniaCanonicalRecord(id);
    if(!provider||!definition||!original||original.correctionSha256!==hash(definition)||!correction||!canonical?.selectable)throw new Error('Missing reviewed selectable correction: '+id);
    const keys=[...new Set(canonical.sources.flatMap(s=>{
      if(!s.url.startsWith('https://leginfo.legislature.ca.gov/'))return [];
      const u=new URL(s.url),code=u.searchParams.get('lawCode'),section=u.searchParams.get('sectionNum');
      if(!code||!section)throw new Error('Unparseable official source');
      return [`${code}:${section.replace(/\.$/,'')}`];
    }))].sort();
    const sources=keys.map(key=>{
      if(!docs[key]?.length)throw new Error('Missing retained source: '+key);
      return {key,versions:docs[key].map(v=>{
        if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key)throw new Error('Source integrity mismatch');
        return {versionId:v.versionId,contentSha256:v.contentSha256};
      })};
    });
    const primaryKeys=canonical.code.split(',').map(code=>californiaPrimaryIdentity(canonical.lawCode,code.trim()).key);
    if(primaryKeys.some(key=>!keys.includes(key)))throw new Error('Missing primary source: '+id);
    return {id,code:canonical.code,lawCode:canonical.lawCode,title:canonical.officialTitle,
      summary:correction.summary.en,penalty:canonical.penalty,categories:canonical.categories,
      correctionPath:provider.correctionPath,correctionSha256:hash(definition),reviewPath:provider.reviewPath,reviewSha256:hash(provider.reviewText),
      sources,primaryEvidence:primaryKeys.flatMap(primaryKey=>docs[primaryKey].map(v=>{
        const text=sourceText(v.contentXml);return {key:primaryKey,versionId:v.versionId,contentSha256:v.contentSha256,start:0,end:text.length,text};
      }))};
  });
  const rows=mappings.map(m=>{
    const old=outstanding.find(r=>r.id===m.instructionId)!;
    const instruction=benchmark.instructions.find(r=>r.id===m.instructionId)!;
    if(!statuses.has(m.status)||!m.rationale.trim()||new Set(m.chargeIds).size!==m.chargeIds.length)throw new Error('Invalid disposition');
    if(m.status.startsWith('existing_')!==Boolean(m.chargeIds.length))throw new Error('Disposition and reviewed choices disagree');
    for(const id of m.chargeIds){
      const choice=choices.find(c=>c.id===id)!;
      if(!old.relatedCatalogIds.includes(id)||!old.sourceKeys.some(k=>choice.primaryEvidence.some(e=>e.key===k)))throw new Error('Unrelated choice cannot resolve instruction');
      const citedBranch=instruction.heading.match(/§\s*(\d+(?:\.\d+)*[a-z]*)(\([^)]*\))/);
      if(citedBranch){
        const catalogBranch=choice.code.split(',').map(c=>c.trim()).find(c=>c.startsWith(citedBranch[1]+'('));
        if(catalogBranch&&!catalogBranch.startsWith(citedBranch[1]+citedBranch[2]))throw new Error('Sibling subdivision is not reviewed coverage');
      }
    }
    return {...m,heading:instruction.heading,sourceKeys:old.sourceKeys,priorRelatedCatalogIds:old.relatedCatalogIds,
      instructionEvidence:{firstPage:instruction.firstPage,lastPage:instruction.lastPage,pageHashes:instruction.pageHashes}};
  });
  // Explicit, reviewed conduct subdivisions only. Supporting penalty citations
  // must not silently become alternative offense identities or search mappings.
  const aliasCitations:Record<string,string[]>={'ca-forgery':['470(a)','470(b)','470(c)','470(d)'],'ca-credit-card-fraud':['484g(a)','484g(b)'],'ca-check-fraud':['476a(a)']};
  if(!same(Object.keys(aliases).sort(),Object.keys(aliasCitations).sort()))throw new Error('Unreviewed alias identity');
  for(const [id,citations] of Object.entries(aliasCitations)){
    const expected=citations.flatMap(c=>[`PC ${c}`,`PEN ${c}`,`Penal Code ${c}`]);
    if(!choices.some(c=>c.id===id)||!same((aliases as Record<string,string[]>)[id],expected))throw new Error('Unreviewed subdivision alias');
  }
  return {schemaVersion:1,scope:'existing_choice_reconciliation_not_new_branch_publication',previousReviewSha256:hash(previous),benchmarkSha256:hash(benchmark),planSha256:hash(mappings),aliasesSha256:hash(aliases),
    counts:{configuredChoices:CONFIGURED_CHOICES_SNAPSHOT,benchmarkInstructions:previous.crosswalk.length,previousBoundedMatches:previous.crosswalk.filter(r=>r.boundedChargeIds.length).length,contextEntries:previous.crosswalk.filter(r=>r.status==='context_defense_or_grading').length,reconciledComparisons:rows.length,existingReviewedChoiceComparisons:rows.filter(r=>r.status==='existing_reviewed_choice_partial').length,broadChoiceComparisonsNeedingWork:rows.filter(r=>r.status==='existing_broad_choice_needs_branch_work').length,unpublishedComparisons:rows.filter(r=>r.status==='unpublished_branch').length,deferredComparisons:rows.filter(r=>r.status==='deferred_expression_sensitive').length,distinctExistingChoices:choices.length,newCharges:0},
    limits:['Existing reviewed summaries are partial coverage, not complete elements, case-law or sentencing certification. The earlier 140 bounded matches are not increased by this reconciliation.',
      'The prior crosswalk and every remaining finding are preserved. A related section number alone never clears an unmatched branch.',
      'No new charge, source approval, attorney decision or freshness renewal. Counts describe configured records, not deployment or statewide completeness.',
      'Subdivision search aliases lead to the existing broad choice; they do not assert which subdivision a user is charged with or alter stored case identities.'],
    rows,choices,priorCrosswalk:previous.crosswalk,remainingFindings:previous.remainingFindings,
    nextWork:[
      {priority:'consequential',scope:'Theft conduct distinctions and malicious animal cruelty',instructions:['1800','1804','1805','2953'],action:'Improve or supplement existing broad choices only where necessary; do not create duplicate generic theft records.'},
      {priority:'consequential',scope:'Four-person access-card acquisition and remaining vehicle/trespass branches',findingIds:['access-card-multiple-person-branch','vehicle-special-and-low-value-branches','remaining-trespass-branches'],action:'Carry existing research forward. General forgery, ordinary access-card use and insufficient-funds summaries already exist; resolve only concrete missing branch details.'},
      {priority:'targeted_audit',scope:'Homicide, gangs, people/weapons and important other-code omissions',action:'Compare existing publication and unresolved inventories before adding records. This justice/property benchmark does not close those families.'},
      {priority:'defer',scope:'Loitering, peeking and expression-sensitive misdemeanors',instructions:['2680','2915','2916','2917'],action:'Keep explicit gaps; uncertainty does not become a publication approval or an assertion that severity is minor.'},
    ]};
}
export type GapReconciliation=ReturnType<typeof buildGapReconciliation>;
export const readGapReconciliation=()=>JSON.parse(fs.readFileSync(new URL('../output/california-gap-reconciliation.json',import.meta.url),'utf8')) as GapReconciliation;
export function validateGapReconciliation(review=readGapReconciliation()){
  if(!same(review,buildGapReconciliation()))throw new Error('Reconciliation evidence or accounting changed');
  return review.counts;
}
export function renderGapReconciliation(review:GapReconciliation){
  const c=review.counts;
  return ['# California remaining comparisons: existing work and actual gaps','',`${c.reconciledComparisons} outstanding comparisons: ${c.existingReviewedChoiceComparisons} have an existing reviewed choice, ${c.broadChoiceComparisonsNeedingWork} have a broad choice needing conduct work, ${c.unpublishedComparisons} have no matching branch, and ${c.deferredComparisons} remain expressly deferred. No new charges; ${c.configuredChoices} configured choices remain.`,
    '',...review.limits.map(s=>`- ${s}`),'','## All remaining comparisons','',...review.rows.flatMap(r=>[`### CALCRIM ${plain(r.heading)}`,'',`Disposition: ${r.status.replaceAll('_',' ')}.`,`Existing choices: ${r.chargeIds.join(', ')||'None for this branch'}.`,r.rationale,`Instruction evidence: PDF pages ${r.instructionEvidence.firstPage}-${r.instructionEvidence.lastPage}; page hashes retained in JSON.`,'']),
    '## Reused reviewed content','',...review.choices.flatMap(c=>[`### ${plain(c.title)}: ${c.id}`,'',plain(c.summary),'',plain(c.penalty),'',`Original review: [${c.reviewPath.split('/').pop()}](./${c.reviewPath.split('/').pop()}). Full primary evidence and dependency bindings are retained in JSON.`,'']),
    '## Next consolidated work','',...review.nextWork.map(w=>`- ${w.scope}: ${w.action}`),'','All prior remaining findings are preserved verbatim in the JSON artifact. They are not silently closed by this report.',''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const review=buildGapReconciliation();validateGapReconciliation(review);
  fs.writeFileSync(new URL('../output/california-gap-reconciliation.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-gap-reconciliation.md',import.meta.url),renderGapReconciliation(review));
  console.log(JSON.stringify(review.counts));
}
