/** Combined research accounting. No row in this packet approves a charge or penalty. */
import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import acquisitionData from "../output/california-driving-vessels-acquisition.json";
import benchmarkData from "../output/california-driving-benchmark-source.json";
import priorBenchmark from "../output/california-controlled-substances-benchmark-source.json";
import batches from "../output/california-statewide/review-batches.json";
import {drugSuccessorDocuments} from "./drug-successor-review";
import {sourceText} from "./person-property-review";
import {CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
const hash=(s:string)=>createHash("sha256").update(s).digest("hex");
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export const readDrivingAcquisition=()=>structuredClone(acquisitionData);
export const readDrivingBenchmark=()=>structuredClone(benchmarkData);
const expectedInstructions=['2100','2101','2102','2110','2111','2112','2113','2114','2125','2126','2130','2131','2140','2141','2142','2150','2151','2160','2180','2181','2182','2200','2201','2202','2220','2221','2222','2240','2241','2242'];
const context=new Set(['2125','2126','2130','2131','2142','2160','2241']);
const bounded:Record<string,string[]>={
  '2110':['ca-dui-23152-a','ca-dui-23152-f','ca-dui-23152-g'],
  '2111':['ca-dui-23152-b'], '2200':['ca-reckless-driving'], '2221':['ca-driving-without-license'],
};
export const drivingReviewGroups = [
  {name:'Injury DUI and omitted DUI branches', keys:['VEH:23153','VEH:23152','VEH:23140'], question:'Separate injury causation, alcohol/drug/commercial/passenger branches and prior-dependent punishment. Existing 23152(a)/(b)/(f)/(g) choices do not cover every branch.'},
  {name:'Hit-and-run and post-collision duties',keys:['VEH:20001','VEH:20002','VEH:20003','VEH:20004'],question:'Distinguish injury/death from property-only accidents, driver from controlling-owner duties, knowledge, and the separate manslaughter flight enhancement.'},
  {name:'Evasion',keys:['VEH:2800.1','VEH:2800.2','VEH:2800.3','VEH:2800.4'],question:'Separate ordinary flight, reckless flight, serious injury/death, and opposite-direction flight. Retain pursuit-identification predicates and grade-specific terms.'},
  {name:'Suspended licenses and court duties',keys:['VEH:14601','VEH:14601.1','VEH:14601.2','VEH:14601.3','VEH:14601.4','VEH:14601.5','VEH:12951','VEH:40508'],question:'Identify the suspension basis, knowledge, repeat branches, injury and court appearance duties. Do not copy one suspension penalty across the family.'},
  {name:'Reckless driving and street racing',keys:['VEH:23103','VEH:23104','VEH:23105','VEH:23109','VEH:23109.1'],question:'Separate ordinary reckless driving, injury branches, speed contests, exhibitions and assistance. Verify current subdivisions against the literal instruction headings.'},
  {name:'Vessels and maritime offenses',keys:['HNC:655','HNC:655.1','HNC:655.2','HNC:655.3','HNC:655.4','HNC:655.5','HNC:655.6','HNC:655.7','PEN:192.5','PEN:193.8','PEN:499'],question:'Review vessel DUI, injury, repeat consequences, refusal and procedural context, vessel manslaughter and taking vessels. Do not import Vehicle Code punishment by analogy.'},
  {name:'Vehicle identification and chop shops',keys:['VEH:10801','VEH:10802','VEH:10803'],question:'Separate operating a chop shop, altering identifiers, and possession/sale branches; resolve intent and statutory value/quantity or exception conditions.'},
];
export function validateDrivingPacket(acquisition=readDrivingAcquisition(),benchmark=readDrivingBenchmark()) {
  if(acquisition.scope!=='combined_driving_vessels_research_not_publication'||acquisition.archive.sha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4')throw new Error('Driving archive binding changed');
  if(hash(fs.readFileSync('scripts/data-review/output/california-statewide/review-batches.json','utf8'))!==acquisition.batchManifestSha256)throw new Error('Discovery manifest changed');
  if(acquisition.groupIds.length!==6||new Set(acquisition.groupIds).size!==6)throw new Error('Discovery groups changed');
  for(const id of acquisition.groupIds) {
    const batch=batches.find(r=>r.id===id);
    if(!batch||batch.sectionKeys.some(k=>!acquisition.candidateKeys.includes(k)))throw new Error('Incomplete discovery group');
  }
  const docs=drugSuccessorDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Research acquisition shadows retained evidence');
    docs[key]=versions;
  }
  const accounted=[...acquisition.reusedKeys,...Object.keys(acquisition.documents),...acquisition.missingKeys].sort();
  if(!same(accounted,acquisition.candidateKeys)||new Set(accounted).size!==accounted.length)throw new Error('Driving section accounting changed');
  if(acquisition.candidateKeys.length!==215||!same(acquisition.missingKeys,['VEH:23564']))throw new Error('Candidate inventory requires explicit review');
  for(const key of acquisition.candidateKeys) {
    if(acquisition.missingKeys.includes(key))continue;
    if(!docs[key]?.length)throw new Error('Missing driving source');
    for(const v of docs[key]) {
      const url=new URL(v.sourceUrl!);
      if(`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||hash(v.contentXml)!==v.contentSha256||url.hostname!=='leginfo.legislature.ca.gov'||`${url.searchParams.get('lawCode')}:${url.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key)throw new Error('Unbound driving source');
    }
  }
  if(!same(benchmark.receipt,priorBenchmark.receipt))throw new Error('Benchmark receipt changed');
  if(benchmark.receipt.sourceUrl!=='https://courts.ca.gov/system/files/file/calcrim-2026.pdf'||benchmark.pages.length!==103||!same(benchmark.instructions.map(i=>i.id),expectedInstructions))throw new Error('Vehicle benchmark inventory changed');
  for(const [i,p] of benchmark.pages.entries())if(p.page!==1481+i||hash(p.text)!==p.sha256)throw new Error('Unbound benchmark page');
  for(const [index,instruction] of benchmark.instructions.entries()) {
    const pages=benchmark.pages.filter(p=>p.page>=instruction.firstPage&&p.page<=instruction.lastPage);
    if(!pages.length||instruction.firstPage!==(index===0?1481:benchmark.instructions[index-1].lastPage+1)||instruction.lastPage!==(index===29?1583:benchmark.instructions[index+1].firstPage-1)||!same(instruction.pageHashes,pages.map(p=>({page:p.page,sha256:p.sha256}))))throw new Error('Unbound benchmark interval');
    const first=pages[0].text.replace(/\s+/g,' ');
    if(!first.includes(instruction.heading)||!instruction.heading.startsWith(`${instruction.id}.`))throw new Error('Unbound instruction heading');
  }
  for(const g of drivingReviewGroups)for(const key of g.keys)if(!docs[key]?.length)throw new Error('Priority source absent');
  return docs;
}
export function buildDrivingReview() {
  const a=readDrivingAcquisition(),b=readDrivingBenchmark(),docs=validateDrivingPacket(a,b);
  const records=CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable);
  const crosswalk=b.instructions.map(i=>{
    const reference=i.heading.split('Veh. Code,')[1]??'';
    const sourceKeys=[...new Set([...reference.matchAll(/\b(\d{3,}(?:\.\d+)?)/g)].map(m=>`VEH:${m[1]}`))];
    if(!sourceKeys.length||sourceKeys.some(k=>!docs[k]))throw new Error('Instruction source not retained');
    const ids=bounded[i.id]??[];
    for(const id of ids) {
      const record=records.find(r=>r.canonicalId===id);
      if(!record||!sourceKeys.includes(`${record.lawCode}:${record.code.split(/[;(]/)[0]}`))throw new Error('Bounded catalog match changed');
    }
    return {...i,sourceKeys,chargeIds:ids,status:context.has(i.id)?'context_or_allegation_not_separate_charge':ids.length?'bounded_catalog_match_not_family_complete':'unpublished_branch_requires_substantive_review',
      note:context.has(i.id)?'Retain for substantive and sentencing review; this instruction is not itself a new selectable offense.':ids.length?'Only the identified catalog branches are matched. This is not complete statutory coverage or a new currentness certification.':'Do not treat a same-section sibling or a generic display name as covering this charged branch.'};
  });
  const sections=a.candidateKeys.map(key=>({key,status:a.missingKeys.includes(key)?'absent_from_snapshot_not_repeal_finding':'retained_research_not_publication',
    reviewGroups:drivingReviewGroups.filter(g=>g.keys.includes(key)).map(g=>g.name),
    configuredSameSectionIds:records.filter(r=>`${r.lawCode}:${r.code.split(/[;(]/)[0]}`===key).map(r=>r.canonicalId),
    versions:(docs[key]??[]).map(v=>({versionId:v.versionId,contentSha256:v.contentSha256,activeFlag:v.activeFlag,effectiveDate:v.effectiveDate,sourceUrl:v.sourceUrl,context:sourceText(v.contentXml).slice(0,1100)})),
  }));
  return {schemaVersion:1,scope:'driving_vessels_research_queue_not_publication',sourceAsOf:'2026-09-24',
    acquisitionSha256:hash(JSON.stringify(a)),benchmarkSha256:hash(JSON.stringify(b)),
    counts:{candidateSections:sections.length,reusedSections:a.reusedKeys.length,newSections:Object.keys(a.documents).length,newVersions:Object.values(a.documents).reduce((n,v)=>n+v.length,0),missingSections:a.missingKeys.length,instructions:crosswalk.length,boundedMatches:crosswalk.filter(r=>r.chargeIds.length).length,contextInstructions:crosswalk.filter(r=>r.status==='context_or_allegation_not_separate_charge').length,unpublishedInstructionBranches:crosswalk.filter(r=>r.status==='unpublished_branch_requires_substantive_review').length,prioritySections:new Set(drivingReviewGroups.flatMap(g=>g.keys)).size},
    limits:['Research acquisition does not add catalog choices, approve penalties or extend any freshness receipt.',
      'Six discovery candidate groups and explicit probes are not complete Vehicle Code or vessel coverage.',
      'Same-section catalog associations are navigation aids only. Subdivision, actor and sentencing review remain required.',
      'VEH 23564 is an absent research probe, not a confirmed statutory error or repeal finding.',
      'Unknown or serious severity is never deferred as a minor misdemeanor.'],groups:drivingReviewGroups,crosswalk,sections};
}
export function renderDrivingReview(review=buildDrivingReview()) {
  const c=review.counts;
  return ['# California driving and vessels: combined review packet','',`${c.candidateSections} candidate sections and dependencies: ${c.reusedSections} reused, ${c.newSections} newly retained, ${c.missingSections} absent probe. ${c.instructions} independent instructions: ${c.boundedMatches} bounded catalog matches, ${c.contextInstructions} context/allegation entries, ${c.unpublishedInstructionBranches} unpublished branch entries. These are research counts, not a coverage percentage or count of new offenses.`,'',...review.limits.map(s=>`- ${s}`),'','## Substantive review order','',...review.groups.flatMap(g=>[`### ${g.name}`,'',g.question,'',`Read together: ${g.keys.join(', ')}.`,'']),'## Independent instruction crosswalk','',...review.crosswalk.flatMap(r=>[`### CALCRIM ${r.id}: ${r.heading.slice(6).replaceAll('—',': ').replaceAll('–','-')}`,'',`Status: ${r.status.replaceAll('_',' ')}. ${r.note}`,`Catalog IDs: ${r.chargeIds.join(', ')||'None assigned'}. Physical PDF pages ${r.firstPage}-${r.lastPage}.`,`Sources: ${r.sourceKeys.join(', ')}.`,'']),'## Remaining source accounting','',...review.sections.map(r=>`- ${r.key}: ${r.status.replaceAll('_',' ')}; ${r.reviewGroups.length?r.reviewGroups.join('; '):'shared context or remaining candidate review; no minor-offense deferral'}.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildDrivingReview();
  fs.writeFileSync('scripts/data-review/output/california-driving-vessels-review.json',JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync('scripts/data-review/output/california-driving-vessels-review.md',renderDrivingReview(review));
  console.log(JSON.stringify(review.counts));
}
