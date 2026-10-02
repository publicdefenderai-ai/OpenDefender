/** Reuse already monitored evidence without changing historical review artifacts. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import additions from '../../../shared/california-theft-animal-additions.json';
import previous from '../output/california-gap-reconciliation.json';
import {validateGapReconciliation} from './gap-reconciliation';
import {officialsCustodyDocuments} from './officials-custody-review';
import {readJusticePropertyBenchmark} from './justice-property-review';
import {sourceText} from './person-property-review';
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from '../../../shared/california-authority';
import pins from '../../../shared/california-retained-pins.json';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>`${a.lawCode}:${a.code.split('(')[0]}`;
const keys=(a:typeof additions[number])=>[...new Set([primary(a),...a.supportingKeys])].sort();
const plain=(s:string)=>s.replace(/[\u2013\u2014]/g,':').replace(/\s+/g,' ').trim();
export function buildTheftAnimalReview() {
  validateGapReconciliation();
  const docs=officialsCustodyDocuments(),benchmark=readJusticePropertyBenchmark();
  const evidence=(key:string)=>docs[key].map(v=>{
    const text=sourceText(v.contentXml);
    return {key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,start:0,end:text.length,text};
  });
  const instruction=(id:string)=>{
    const row=benchmark.instructions.find(i=>i.id===id);
    if(!row)throw new Error('Missing instruction');
    return {id,heading:row.heading,firstPage:row.firstPage,lastPage:row.lastPage,pageHashes:row.pageHashes};
  };
  return {schemaVersion:1,scope:'bounded_theft_animal_publication_not_family_completeness',sourceAsOf:'2026-09-24',previousReviewSha256:hash(previous),benchmarkSha256:hash(benchmark),
    limits:['Two missing statutory branches, using only already monitored source versions. No source reacquisition or freshness renewal.',
      'The access-card choice preserves both grand-theft and possible petty-theft treatment. Branch-specific valuation and the grand-theft fine remain unresolved.',
      'The three general theft instruction comparisons remain open; no duplicate generic theft choices or claim of full instruction coverage.',
      'Prior reconciliation dispositions and unresolved findings remain in the audit trail. This batch does not establish statewide completeness.'],
    records:additions.map(a=>({id:a.id,definitionSha256:hash(a),primaryKey:primary(a),sources:keys(a).flatMap(evidence),instructionEvidence:a.calcrim.map(instruction)})),
    reusedSourceKeys:[...new Set(additions.flatMap(keys))].sort(),
    crosswalk:previous.priorCrosswalk.map(row=>{
      const ids=additions.filter(a=>a.calcrim.includes(row.id)).map(a=>a.id);
      return {...row,status:ids.length?'bounded_publication_match_other_branches_open':row.status,boundedChargeIds:[...row.boundedChargeIds,...ids]};
    }),
    reconciliation:previous.rows.map(row=>({...row,...(row.instructionId==='2953'?{status:'bounded_publication_match_other_branches_open',chargeIds:['ca-pen-597-a'],rationale:'The malicious and intentional section 597(a) branch is now separately published; the existing section 597(b) choice is not substituted.'}:{})})),
    remainingFindings:previous.remainingFindings,
    findingProgress:[{id:'access-card-multiple-person-branch',status:'bounded_choice_published_residual_questions_open',chargeId:'ca-pen-484e-b',remaining:'Case-specific valuation and aggregation and the grand-theft fine ceiling remain open. Do not infer the value from credit limits or treat Romanowski as a subdivision (b) holding.'}],
    theftConductResearch:[
      {id:'1800',distinction:'Larceny requires nonconsensual taking and movement, with the required intent to deprive. Value grading alone is not a conduct explanation.'},
      {id:'1804',distinction:'False pretense involves induced transfer of ownership as well as possession, reliance, and special corroboration rules; do not describe mere breach of promise as theft.'},
      {id:'1805',distinction:'Trick involves fraudulently obtained possession without intended transfer of ownership, with the required deprivation intent.'},
    ].map(row=>({...row,status:'research_only_existing_choice_unchanged',chargeId:'ca-petty-theft',instructionEvidence:instruction(row.id)})),
    interpretationAuthorities:[
      {name:'People v. Romanowski (2017) 2 Cal.5th 903',url:'https://law.justia.com/cases/california/supreme-court/2017/s231405.html',scope:'Direct holding concerns section 484e(d), reasonable fair market value and Proposition 47. It is not a direct holding on subdivision (b).'},
      {name:'People v. Madruga (2026), H053381',url:'https://law.justia.com/cases/california/court-of-appeal/2026/h053381.html',scope:'Food-animal exception is not an automatic species-based defense; the court also discusses section 597(a) general criminal intent.'},
      {name:'California courts Proposition 47 information',url:'https://www.courts.ca.gov/documents/Prop-47-Information.pdf',scope:'Judicial education material lists access-card theft under section 484e(a), (b) and (d). Educational support, not a binding branch-specific holding.'},
    ],
    decisions:['Display titles describe the operative conduct and are not represented as statutory short titles.',
      '597(a) is distinct from the already published 597(b) charge. The species branch in 597(c) and section 599c exceptions are preserved, not silently absorbed.',
      '484e(b) counts people named on cards, not just cards, and uses any consecutive twelve months. Its reason-to-know standard is not replaced with the express intent-to-defraud wording from neighboring subdivisions.',
      'No CALCRIM entry is assigned to 484e(b): retained 1950, 1951 and 1952 address different subdivisions.',
      'Both new choices carry all sentencing and definition dependencies through the existing source gate and English-only fallback warning.',
      'All statutory sources are reused from prior reviewed publications. Existing receipts and pins are unchanged.'],
  };
}
export type TheftAnimalReview=ReturnType<typeof buildTheftAnimalReview>;
export const readTheftAnimalReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-theft-animal-review.json',import.meta.url),'utf8')) as TheftAnimalReview;
export function validateTheftAnimalReview(review=readTheftAnimalReview(),definitions=additions) {
  const docs=officialsCustodyDocuments();
  if(definitions.length!==2||new Set(definitions.map(a=>a.id)).size!==2||!same(review.records.map(r=>r.id),definitions.map(a=>a.id)))throw new Error('Publication identity drift');
  for(const a of definitions) {
    const r=review.records.find(r=>r.id===a.id)!;
    if(r.definitionSha256!==hash(a)||r.primaryKey!==primary(a)||!same(Object.keys(a.sourceEffectiveDates).sort(),keys(a)))throw new Error('Definition or dependency drift');
    if(!same(r.sources.map(s=>s.key),keys(a)))throw new Error('Source binding drift');
    for(const s of r.sources) {
      const versions=docs[s.key];
      if(versions?.length!==1||!(s.key in pins))throw new Error('Unmonitored or ambiguous source');
      const v=versions[0],u=new URL(v.sourceUrl),text=sourceText(v.contentXml);
      if(v.activeFlag!=='Y'||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==s.key||u.origin!=='https://leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==s.key||hash(v.contentXml)!==v.contentSha256||s.contentSha256!==v.contentSha256||s.versionId!==v.versionId||s.sourceUrl!==v.sourceUrl||s.start!==0||s.end!==text.length||s.text!==text)throw new Error('Unbound source evidence');
      if((a.sourceEffectiveDates as Record<string,string|null>)[s.key]!==(v.effectiveDate?.slice(0,10)??null))throw new Error('Source effective date drift');
    }
    const c=getCaliforniaCanonicalRecord(a.id);
    if(!c?.selectable||c.code!==a.code||c.lawCode!==a.lawCode||c.penalty!==a.penalty||c.officialTitle!==a.title||!same(c.categories,a.categories))throw new Error('Runtime publication drift');
    const runtimeKeys=c.sources.filter(s=>s.kind!=='jury-instruction').map(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`;}).sort();
    if(!same(runtimeKeys,keys(a)))throw new Error('Runtime dependency drift');
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate branch');
  }
  if(!same(review,buildTheftAnimalReview()))throw new Error('Review accounting drift');
  return {additions:2,primarySections:2,reusedSections:review.reusedSourceKeys.length,newSections:0,newVersions:0,newBenchmarkMatches:1};
}
export function renderTheftAnimalReview(review=readTheftAnimalReview()) {
  const c=validateTheftAnimalReview(review);
  return ['# California theft and animal cruelty: bounded publication','',`${c.additions} new choices; ${c.reusedSections} already monitored sections, no new source acquisition. One new bounded instruction match.`, '',...review.limits.map(s=>`- ${s}`),'','## Choices','',...additions.flatMap(a=>[`### ${a.code}: ${a.title}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${a.code.split('(')[0]}.)`,'']),'## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Existing theft choice: research still open','',...review.theftConductResearch.map(r=>`- CALCRIM ${r.id}: ${r.distinction} Existing choice ${r.chargeId} unchanged.`),'','## Remaining questions','',...review.findingProgress.map(f=>`- ${f.id}: ${f.remaining}`),...review.remainingFindings.map(f=>`- ${f.id}: ${f.question}`),''].map(plain).join('\n').trimEnd()+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildTheftAnimalReview();validateTheftAnimalReview(review);
  fs.writeFileSync(new URL('../output/california-theft-animal-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-theft-animal-review.md',import.meta.url),renderTheftAnimalReview(review));
  console.log(JSON.stringify(validateTheftAnimalReview(review)));
}
