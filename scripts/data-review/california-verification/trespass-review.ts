/** Shared-source review: store each retained text once, then bind exact branches. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import additions from '../../../shared/california-trespass-additions.json';
import previous from '../output/california-theft-animal-review.json';
import {validateTheftAnimalReview} from './theft-animal-review';
import {officialsCustodyDocuments} from './officials-custody-review';
import {sourceText} from './person-property-review';
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from '../../../shared/california-authority';
import pins from '../../../shared/california-retained-pins.json';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const keys=(a:typeof additions[number])=>[...new Set(['PEN:602',...a.supportingKeys])].sort();
const plain=(s:string)=>s.replace(/[\u2013\u2014]/g,':');
const branches=[['l','(l)','(m)'],['o','(o)','(p)'],['q','(q)','(r)'],['w','(w)','(x)'],['x','(x) (1) Knowingly','(y)'],['y','(y)',null]] as const;
export function buildTrespassReview() {
  validateTheftAnimalReview();
  const docs=officialsCustodyDocuments();
  const sourceKeys=[...new Set(additions.flatMap(keys))].sort();
  const sources=sourceKeys.map(key=>{
    const versions=docs[key];if(versions?.length!==1)throw new Error('Ambiguous retained source');
    const v=versions[0],text=sourceText(v.contentXml);
    return {key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,start:0,end:text.length,text};
  });
  const text=sources.find(s=>s.key==='PEN:602')!.text;
  const branchSpans=branches.map(([branch,startMarker,endMarker])=>{
    // The publisher may put whitespace inside the letter-l parenthesis.
    const start=text.search(branch==='l'?/\(\s*l\s*\)/:new RegExp(startMarker.replace(/[()]/g,'\\$&')));
    const end=endMarker?text.indexOf(endMarker,start+3):text.length;
    if(start<0||end<=start)throw new Error('Missing subdivision boundary');
    return {branch,key:'PEN:602',start,end,text:text.slice(start,end)};
  });
  return {schemaVersion:1,scope:'bounded_trespass_publication_not_section_completeness',sourceAsOf:'2026-09-24',previousReviewSha256:hash(previous),
    limits:['Eleven choices from six section 602 subdivisions. This is not complete section 602 or statewide coverage.',
      'All seven statutory sources were already retained and monitored. No new acquisition, source approval, receipt renewal or attorney decision.',
      'The previous crosswalk, theft research and all unresolved findings remain bound by the predecessor hash. No new CALCRIM match is claimed.',
      'Descriptions preserve statutory exclusions; they do not decide disputed constitutional access, employment or housing facts.'],
    sources,branchSpans,
    records:additions.map(a=>({id:a.id,code:a.code,definitionSha256:hash(a),sourceKeys:keys(a),primaryBranch:a.code.match(/^602\(([a-z])\)/)![1]})),
    priorAccounting:{benchmarkInstructions:previous.crosswalk.length,boundedMatches:previous.crosswalk.filter(r=>r.boundedChargeIds.length).length,reconciliationSha256:hash(previous.reconciliation),remainingFindingsSha256:hash(previous.remainingFindings),findingProgressSha256:hash(previous.findingProgress),theftConductResearchSha256:hash(previous.theftConductResearch)},
    remaining:[{id:'remaining-trespass-branches',status:'partial_publication_other_branches_open',publishedCodes:additions.map(a=>a.code),next:'Other section 602 conduct, airport/transit variants, section 602.8 repeat-entry routes and business-entry provisions remain outside this batch. This is not an assertion that all unreviewed branches are minor.'},
      {id:'shelter-trespass-fine',status:'fine_ceiling_unresolved',keys:['PEN:602','PEN:672'],next:'Section 602(w) supplies custody and relocation restitution. A separate base-fine authority and ceiling remain unresolved; no zero-fine or generic-fine assertion.'}],
    decisions:['Titles describe the statutory conduct; they are not represented as verbatim short statutory names.',
      '602(l) requires the land, notice and lack-of-written-permission conditions plus one of four additional acts. Mere entry is not silently converted into these misdemeanor routes.',
      '602(o) retains the 17(d)/19.8 infraction alternative, policing-request limits, labor exception and housing-authority protections. The underlying labor and constitutional disputes are not resolved by this summary.',
      '602(q) requires regular closure, a qualifying agency employee request and circumstances showing no apparent lawful business.',
      '602(w) uses the express one-year custody provision reduced to 364 days by 18.5; section 19 is not used to replace that punishment. Relocation restitution is separate from a base fine.',
      '602(x)(2)(A), (B) and (C) distinguish ordinary infraction, refusal-to-leave misdemeanor and repeat misdemeanor. All retain the underlying 602(x)(1) conduct and conditional counseling rule.',
      '602(y) preserves posted notice and the federal-law exception. Declining entry is distinguished from bypassing screening.',
      'Seven retained source bodies are stored once, with exact subdivision spans and per-record references, to avoid repeating the long statute in every record.'],
  };
}
export type TrespassReview=ReturnType<typeof buildTrespassReview>;
export const readTrespassReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-trespass-review.json',import.meta.url),'utf8')) as TrespassReview;
export function validateTrespassReview(review=readTrespassReview(),definitions=additions) {
  const docs=officialsCustodyDocuments();
  if(definitions.length!==11||new Set(definitions.map(a=>a.id)).size!==11||!same(review.records.map(r=>r.id),definitions.map(a=>a.id)))throw new Error('Publication identity drift');
  if(!same(review.sources.map(s=>s.key),[...new Set(definitions.flatMap(keys))].sort()))throw new Error('Source inventory drift');
  for(const s of review.sources) {
    const versions=docs[s.key];if(versions?.length!==1||!(s.key in pins))throw new Error('Unmonitored or ambiguous source');
    const v=versions[0],u=new URL(v.sourceUrl),text=sourceText(v.contentXml);
    if(v.activeFlag!=='Y'||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==s.key||u.origin!=='https://leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==s.key||hash(v.contentXml)!==v.contentSha256||s.contentSha256!==v.contentSha256||s.versionId!==v.versionId||s.sourceUrl!==v.sourceUrl||s.start!==0||s.end!==text.length||s.text!==text)throw new Error('Unbound source evidence');
  }
  for(const span of review.branchSpans)if(span.start<0||span.end<=span.start||review.sources.find(s=>s.key===span.key)?.text.slice(span.start,span.end)!==span.text)throw new Error('Unbound branch span');
  for(const a of definitions) {
    const r=review.records.find(r=>r.id===a.id)!;
    if(r.definitionSha256!==hash(a)||r.code!==a.code||!same(r.sourceKeys,keys(a))||!same(Object.keys(a.sourceEffectiveDates).sort(),keys(a)))throw new Error('Definition or dependency drift');
    if(!review.branchSpans.some(s=>s.branch===r.primaryBranch))throw new Error('Missing branch evidence');
    for(const key of keys(a))if((a.sourceEffectiveDates as Record<string,string|null>)[key]!==(docs[key][0].effectiveDate?.slice(0,10)??null))throw new Error('Effective date drift');
    const c=getCaliforniaCanonicalRecord(a.id);
    if(!c?.selectable||c.code!==a.code||c.lawCode!=='PEN'||c.penalty!==a.penalty||c.officialTitle!==a.title||!same(c.categories,a.categories))throw new Error('Runtime publication drift');
    const runtimeKeys=c.sources.filter(s=>s.kind!=='jury-instruction').map(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`;}).sort();
    if(!same(runtimeKeys,keys(a)))throw new Error('Runtime dependency drift');
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate branch');
  }
  if(!same(review,buildTrespassReview()))throw new Error('Review accounting drift');
  return {additions:11,primarySections:1,reusedSections:review.sources.length,newSections:0,newVersions:0,newBenchmarkMatches:0};
}
export function renderTrespassReview(review=readTrespassReview()) {
  const c=validateTrespassReview(review);
  return ['# California trespass: combined statutory branches','',`${c.additions} choices from one already monitored primary section; ${c.reusedSections} reused sources.`, '',...review.limits.map(s=>`- ${s}`),'','## Choices','',...additions.flatMap(a=>[`### ${a.code}: ${a.title}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,'']),'## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Sources','',...review.sources.map(s=>`- [${s.key}](${s.sourceUrl})`),'','## Remaining questions','',...review.remaining.map(r=>`- ${r.id}: ${r.next}`),'','Earlier gaps remain in the hash-bound california-theft-animal-review.json; this batch does not clear vehicle sentencing, general theft conduct or other prior findings.',''].map(plain).join('\n').trimEnd()+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildTrespassReview();validateTrespassReview(review);
  fs.writeFileSync(new URL('../output/california-trespass-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-trespass-review.md',import.meta.url),renderTrespassReview(review));
  console.log(JSON.stringify(validateTrespassReview(review)));
}
