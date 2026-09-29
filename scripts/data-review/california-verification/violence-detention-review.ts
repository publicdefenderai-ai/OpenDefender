import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-violence-detention-additions.json";
import acquisitionData from "../output/california-violence-detention-acquisition.json";
import previous from "../output/california-people-weapons-review.json";
import {validatePeopleWeaponsPacket} from "./people-weapons-review";
import {vehicleIdentificationDocuments} from "./vehicle-identification-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readViolenceDetentionReviewAcquisition=()=>structuredClone(acquisitionData);
export function violenceDetentionDocuments(acquisition=readViolenceDetentionReviewAcquisition()) {
  const docs=vehicleIdentificationDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'felony-false-imprisonment-fine',status:'published_custody_with_explicit_fine_uncertainty',keys:['PEN:236','PEN:237','PEN:672','PEN:1170'],question:'Does the $1,000 fine in the first sentence of 237(a) also govern felony false imprisonment, or does 672 authorize a different felony fine? Identify controlling authority before supplying a numerical felony fine ceiling.',treatment:'The felony custody range is published. Its fine limit remains expressly unverified; no numeric ceiling is inferred from the misdemeanor sentence.'},
  {id:'kidnapping-other-branches',status:'substantive_research_open',keys:['PEN:207','PEN:208'],question:'Review 207(c) slavery/involuntary-servitude and 207(d) out-of-state abduction before adding exact branches.',treatment:'The new 207(a)/(b) entries do not close every branch of 207. No minor-offense deferral.'},
  {id:'elder-financial-branches',status:'substantive_research_open',keys:['PEN:368'],question:'Review caretaker/noncaretaker theft, fraud and identity-theft branches and valuation thresholds under 368(d)/(e) with the financial group.',treatment:'Physical abuse and detention additions do not claim financial-offense coverage.'},
];
export function buildViolenceDetentionReview() {
  const docs=violenceDetentionDocuments(),a=readViolenceDetentionReviewAcquisition();
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_violence_detention_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-eight named branches only; same-section siblings remain open.',
      'Published felony false-imprisonment custody does not resolve its expressly uncertain fine limit.',
      'Adult base penalties and specified conditional increases are not a complete sentence calculation or a promise of parole.',
      'Research promotion requires unchanged-source comparison. Replay does not renew the acquisition time or receipt expiry.'],
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
    remainingGroups:previous.groups.map(g=>({...g,addedIds:additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id),status:'bounded_additions_do_not_close_group'})),
    remainingFindings:remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>docs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))})),
    decisions:[
      '273ab is a distinct section from 273a. Citation parsing, URLs and runtime dependency keys retain all trailing letters.',
      '203 uses the penalty in 204; 206 uses 206.1, including its January 2026 child/caregiver parole-minimum change. No term is inferred from a nearby offense.',
      '220 separates ordinary intent, the under-18 sexual-intent branch and first-degree burglary. Mayhem is not silently included in the latter two lists.',
      '273a indirect-harm branches require criminal negligence; actual great bodily injury is not required merely because the circumstances create the specified risk.',
      '273.5 prior-dependent terms require the exact prior offense and seven-year window. A generic prior-conviction answer cannot choose the higher range.',
      '368 preserves victim-age and injury/death distinctions and its restrictions on stacking enhancements. Financial branches remain research.',
      '207(a)/(b), 209(a)/(b), and 209.5 have different movement, intent, victim and punishment requirements. The ordinary under-14 increase has parent/court-access exceptions.',
      'Ordinary false imprisonment and the aggravated felony branch are separate choices. The latter is not described as a discretionary misdemeanor simply because the neighboring sentence has a jail alternative.',
      '236.1 distinguishes forced labor, specified predicate exploitation and minor commercial-sex conduct. The 236.4 additional fine and injury/prior terms are disclosed rather than hidden behind the base penalty.',
      '278 and 278.5 distinguish custody from visitation and retain the conditional 278.7 immediate-harm protection; the exception is not an instruction to disregard an order.',
    ]};
}
export const readViolenceDetentionReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-violence-detention-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildViolenceDetentionReview>;
export function validateViolenceDetentionReview(review=readViolenceDetentionReview(),definitions=additions,acquisition=readViolenceDetentionReviewAcquisition()) {
  const research=validatePeopleWeaponsPacket(),docs=violenceDetentionDocuments(acquisition);
  if(review.scope!=='bounded_violence_detention_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==28||new Set(ids).size!==28||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildViolenceDetentionReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>r.status==='bounded_publication_match_other_branches_open').length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderViolenceDetentionReview(review=readViolenceDetentionReview()) {
  const c=validateViolenceDetentionReview(review);
  return ['# California serious violence, abuse and detention: combined publication batch','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies, ${c.newSections} newly monitored sections including ${c.promotedResearchSections} promoted from research. ${c.newBenchmarkMatches} additional instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Current treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),'## Remaining groups','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.question} Added ${g.addedIds.length} choices; other branches remain open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildViolenceDetentionReview();validateViolenceDetentionReview(review);
  fs.writeFileSync(new URL('../output/california-violence-detention-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-violence-detention-review.md',import.meta.url),renderViolenceDetentionReview(review));
  console.log(JSON.stringify(validateViolenceDetentionReview(review)));
}
