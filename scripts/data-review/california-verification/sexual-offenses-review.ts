import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-sexual-offenses-additions.json";
import acquisitionData from "../output/california-sexual-offenses-acquisition.json";
import previous from "../output/california-violence-detention-review.json";
import {validatePeopleWeaponsPacket} from "./people-weapons-review";
import {violenceDetentionDocuments} from "./violence-detention-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readSexualOffensesReviewAcquisition=()=>structuredClone(acquisitionData);
export function sexualOffensesDocuments(acquisition=readSexualOffensesReviewAcquisition()) {
  const docs=violenceDetentionDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'sexual-family-open-branches',status:'substantive_research_open',keys:['PEN:288.3','PEN:290.018','PEN:311.1','PEN:311.2','PEN:311.4','PEN:311.11','PEN:647.6','PEN:243.4'],question:'Finish contact-with-intent penalties, registration violations, image-based exploitation, child annoyance/molestation and remaining sexual-battery branches.',treatment:'These remain significant research items. The 64 choices do not establish complete sexual-offense coverage or close same-section siblings.'},
  {id:'custody-sexual-conduct-branches',status:'substantive_research_open',keys:['PEN:286','PEN:287'],question:'Review subdivision (e) custody provisions and the applicable constitutional/enforceability context before publishing them.',treatment:'Do not infer a selectable custody offense solely from the statute text or from publication of neighboring coercive branches.'},
];
export function buildSexualOffensesReview() {
  const docs=sexualOffensesDocuments(),a=readSexualOffensesReviewAcquisition();
  const contextDocs={...validatePeopleWeaponsPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_sexual_offenses_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Sixty-four named branches only; published sections and instruction matches are not proof of family completeness.',
      'Age-specific terms, mental-state requirements and conditional sentencing are not copied between similar statutes.',
      'The source says over 21 in 286(b)(2), 287(b)(2) and 289(i); age ten or younger and under 14 are also distinct thresholds.',
      'Additional statutory fines are disclosed as additional, not total financial ceilings. Base custody terms do not replace special life or consecutive-sentence allegations.',
      'English-only additions retain translated fallback notices. Research promotion does not renew receipt time or clear existing source holds.'],
    records:additions.map(a=>{
      const key=primary(a),v=docs[key][0],text=sourceText(v.contentXml);
      return {id:a.id,primaryKey:key,definitionSha256:hash(a),status:'bounded_statutory_addition_proposed',sources:[...new Set([key,...a.supportingKeys])].sort().map(binding),primaryEvidence:{key,versionId:v.versionId,start:0,end:text.length,text},
        instructionEvidence:a.calcrim.map(id=>{
          const i=previous.crosswalk.find(r=>r.id===id);if(!i)throw new Error('Unknown instruction mapping');
          return {id,firstPage:i.firstPage,lastPage:i.lastPage,pageHashes:i.pageHashes};
        })};
    }),
    crosswalk:previous.crosswalk.map(r=>{
      const ids=additions.filter(a=>a.calcrim.includes(r.id)).map(a=>a.id);
      return {...r,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,boundedChargeIds:[...r.boundedChargeIds,...ids]};
    }),
    remainingGroups:previous.remainingGroups.map(g=>({...g,addedIds:[...new Set([...g.addedIds,...additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id)])],status:'bounded_additions_do_not_close_group'})),
    remainingFindings:[...previous.remainingFindings,...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    decisions:[
      'Search aliases retain 269(a)(1)-(5), the 266i(a)(1)-(6) conduct predicates for each applicable age branch, and the 288.4(a)(2) qualifying-prior branch. The displayed penalty still depends on the selected age/prior facts; an alias never establishes those facts.',
      '286 and 287 have different child and teen coercion terms. Each numerical branch is checked independently; concerted-participation penalties also differ.',
      'Existing 289(a)(1)(A)/(B), rape and ordinary lewd-child records are preserved. New choices add distinct subdivisions rather than duplicating those records.',
      'Mental disability alone does not establish incapacity. The shared-treatment-facility wobbler branches remain distinct from the general felony incapacity provisions.',
      'Future-retaliation threats, immediate-force/fear conduct, fraudulent identity, known unconsciousness and intoxication preventing resistance are distinct elements.',
      '264.1 requires the concerted-participation allegation to be charged and proved or admitted; 269 requires a listed predicate, under-14 victim and at-least-seven-year age gap.',
      '288 caretaker provisions preserve the statutory actor/dependency definitions and spouse/domestic-partner exception.',
      '288.2 preserves both sexual purposes and legitimate scientific/educational defenses; the two harmful-matter branches have different felony terms.',
      '288.4 separates arranging a meeting from attending it. A qualifying prior changes the arranging branch; a generic prior answer cannot establish that condition.',
      '288.5 preserves the three-act/three-month requirements and overlapping-charge restriction; 288.7 preserves adult-defendant and age-ten-or-younger requirements.',
      '266h/266i child branches preserve the under-16 split. 266j has its own $15,000 fine plus the separate $25,000 additional-fine authority in 266k(b).',
      'Historical 288a aliases are not automatically offered as current 287 citations: offense-date law and renumbering need individual review.',

    ]};
}
export const readSexualOffensesReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-sexual-offenses-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildSexualOffensesReview>;
export function validateSexualOffensesReview(review=readSexualOffensesReview(),definitions=additions,acquisition=readSexualOffensesReviewAcquisition()) {
  const research=validatePeopleWeaponsPacket(),docs=sexualOffensesDocuments(acquisition);
  if(review.scope!=='bounded_sexual_offenses_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
  const keys=[...new Set(definitions.flatMap(a=>[primary(a),...a.supportingKeys]))].sort();
  if(!same(keys,acquisition.requiredKeys)||!same(keys,[...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort()))throw new Error('Incomplete publication dependencies');
  if(!same(acquisition.promotedResearchKeys,Object.keys(acquisition.documents).filter(k=>research[k]).sort()))throw new Error('Research promotion accounting changed');
  for(const key of keys) {
    const versions=docs[key];
    if(versions?.length!==1)throw new Error('Publication needs explicit version resolution');
    for(const v of versions) {
      const u=new URL(v.sourceUrl);
      if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.origin!=='https://leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key||v.activeFlag!=='Y')throw new Error('Unbound publication source');
    }
    if(acquisition.promotedResearchKeys.includes(key)&&!same(versions,research[key]))throw new Error('Promoted research source changed');
  }
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==64||new Set(ids).size!==64||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
  for(const r of review.records) {
    const a=definitions.find(a=>a.id===r.id)!;
    if(r.definitionSha256!==hash(a)||r.primaryKey!==primary(a)||a.translationStatus!=='english_only_pending_translation')throw new Error('Definition changed without review');
    const keys=[...new Set([primary(a),...a.supportingKeys])].sort();
    if(!same(r.sources.map(s=>s.key),keys)||!same(Object.keys(a.sourceEffectiveDates).sort(),keys))throw new Error('Incomplete reviewed sources');
    for(const s of r.sources)if(!same(s.versions,docs[s.key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256})))||(a.sourceEffectiveDates as Record<string,string|null>)[s.key] !== (docs[s.key][0].effectiveDate?.slice(0,10)??null))throw new Error('Source binding changed');
    const e=r.primaryEvidence,v=docs[r.primaryKey][0];
    if(e.key!==r.primaryKey||e.versionId!==v.versionId||e.start!==0||e.end!==e.text.length||e.text!==sourceText(v.contentXml))throw new Error('Unbound primary evidence');
    const c=getCaliforniaCanonicalRecord(a.id);
    if(!c?.selectable||c.code!==a.code||c.lawCode!==a.lawCode||c.penalty!==a.penalty||c.officialTitle!==a.title||!same(c.categories,a.categories))throw new Error('Runtime publication drift');
    const runtimeKeys=c.sources.map(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`;}).sort();
    if(!same(runtimeKeys,keys))throw new Error('Runtime dependency drift');
    for(const instruction of r.instructionEvidence) {
      const previousRow=previous.crosswalk.find(i=>i.id===instruction.id);
      if(!previousRow||!same(instruction,{id:previousRow.id,firstPage:previousRow.firstPage,lastPage:previousRow.lastPage,pageHashes:previousRow.pageHashes})||!previousRow.sourceKeys.includes(primary(a)))throw new Error('Unbound instruction match');
    }
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate charged branch');
  }
  if(!same(review,buildSexualOffensesReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id)) && !previous.crosswalk.find(p=>p.id===r.id)?.boundedChargeIds.length).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderSexualOffensesReview(review=readSexualOffensesReview()) {
  const c=validateSexualOffensesReview(review);
  return ['# California sexual offenses: combined publication batch','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies, ${c.newSections} newly monitored sections including ${c.promotedResearchSections} promoted from research. ${c.newBenchmarkMatches} additional instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Current treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),'## Remaining groups','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.question} Added ${g.addedIds.length} choices; other branches remain open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildSexualOffensesReview();validateSexualOffensesReview(review);
  fs.writeFileSync(new URL('../output/california-sexual-offenses-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-sexual-offenses-review.md',import.meta.url),renderSexualOffensesReview(review));
  console.log(JSON.stringify(validateSexualOffensesReview(review)));
}
