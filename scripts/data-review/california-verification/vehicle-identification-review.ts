import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-vehicle-identification-additions.json";
import acquisitionData from "../output/california-vehicle-identification-acquisition.json";
import previous from "../output/california-traffic-review.json";
import {validateDrivingPacket} from "./driving-vessels-review";
import {trafficDocuments} from "./traffic-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readVehicleIdentificationReviewAcquisition=()=>structuredClone(acquisitionData);
export function vehicleIdentificationDocuments(acquisition=readVehicleIdentificationReviewAcquisition()) {
  const docs=trafficDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const findings = [
  {id:'owner-passenger-injury',status:'substantive_actor_review_open',keys:['VEH:20001','VEH:20003','VEH:20004'],instructions:['2141'],reason:'CALCRIM 2141 requires presence, full authority to direct/control, knowledge and willful breach; an ordinary passenger is not automatically liable. Current entries describe the driver.',nextStep:'Review the cited owner-control authorities and extend the existing charging identities with a source-bound actor distinction; avoid duplicate choices using the same statute and penalty.'},
  {id:'owner-passenger-property',status:'substantive_actor_review_open',keys:['VEH:20002'],instructions:['2151'],reason:'CALCRIM 2151 distinguishes a nondriving owner/passenger in control from a driver. Ownership alone does not establish liability.',nextStep:'Resolve the same owner-control question with the injury branch; preserve knowledge, reasonable effort to stop and inability-to-comply limitations.'},
  {id:'entrusting-to-intoxicated-minor',status:'source_discrepancy_hold',keys:['PEN:193.8','PEN:19.8','BPC:25503.16'],instructions:[],reason:'PEN 193.8(b) incorporates HSC 113785 for a food-facility exception, but the exact archive probe returns no version. PEN 19.8 supplies an infraction alternative; neither this nor a likely successor definition resolves the literal reference.',nextStep:'Check amendment history for HSC 113785 before resolving CA-007. Do not silently replace the reference or infer repeal from archive absence.'},
  {id:'habitual-traffic-offender',status:'substantive_notice_and_predicate_review_open',keys:['VEH:14601.3'],instructions:[],reason:'A standalone offense requires the specified driving record while suspended, not merely a habitual-offender label. The statutory notice presumption and separate consecutive 14601.2 penalty need distinct treatment.',nextStep:'Verify knowledge/notice authority and exact conviction/accident predicates; do not substitute the habitual-offender enhancement for the standalone offense.'},
  {id:'suspended-license-injury',status:'substantive_penalty_scope_review_open',keys:['VEH:14601.4','VEH:14601.2','VEH:42002'],instructions:[],reason:'14601.4 imports minimum custody from 14601.2 and restricts early-release programs. It does not expressly copy every 14601.2 maximum and fine.',nextStep:'Resolve the interaction with the general misdemeanor ceiling before publishing a complete range; keep the known minimum and interlock context in the research record.'},
  {id:'repeat-temporary-taking',status:'substantive_prior_branch_review_open',keys:['PEN:499','PEN:499b'],instructions:[],reason:'PEN 499 has distinct prior-conviction and prior-custody predicates, while retained 499b now distinguishes bicycles from vessels. Existing ordinary 499b choices are not a complete repeat-offense treatment.',nextStep:'Review the current predicate reach and history together; do not extend vehicle references to every current bicycle/vessel branch by analogy.'},
  {id:'vehicle-boarding-and-manipulation',status:'documented_minor_misdemeanor_deferral',keys:['VEH:10853','VEH:40000.9','VEH:42002'],instructions:[],reason:'The source has boarding with criminal intent plus unattended-vehicle manipulation/movement clauses. 40000.9 and 42002 establish misdemeanor treatment with up to six months or $1,000 or both; this lower-priority entry is omitted instead of collapsing distinct intent predicates.',nextStep:'Revisit after major offense-family coverage, or if charging-document demand identifies this provision as important; resolve clause-specific intent before publication.'},
];
function buildRemainingFindings() {
  const a=readVehicleIdentificationReviewAcquisition();
  const docs={...validateDrivingPacket(),...vehicleIdentificationDocuments(a),...a.researchDocuments};
  return findings.map(f=>({...f,sources:f.keys.flatMap(key=>(docs[key]??[]).map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,excerpt:sourceText(v.contentXml)})))}));
}

export function buildVehicleIdentificationReview() {
  const docs=vehicleIdentificationDocuments(),a=readVehicleIdentificationReviewAcquisition();
  const bindings=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_vehicle_identification_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Publication covers only the ten named branches; owner/passenger duties and other gaps remain expressly open.',
      'No sentencing or enforceability uncertainty is silently treated as a minor-offense deferral.',
      'Pins and unchanged-source comparison are required for promoted research sources; acquisition time is never renewed by replay.',
      'Statutes govern punishment. Instruction matches are bounded and do not establish complete coverage.'],
    records:additions.map(a=>{
      const key=primary(a),v=docs[key][0],text=sourceText(v.contentXml);
      return {id:a.id,primaryKey:key,definitionSha256:hash(a),status:'bounded_statutory_addition_proposed',sources:[...new Set([key,...a.supportingKeys])].sort().map(bindings),primaryEvidence:{key,versionId:v.versionId,start:0,end:text.length,text}};
    }),
    crosswalk:previous.crosswalk.map(r=>{
      const ids=additions.filter(a=>a.calcrim.includes(r.instruction)).map(a=>a.id);
      return {instruction:r.instruction,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,chargeIds:[...r.chargeIds,...ids],firstPage:r.firstPage,lastPage:r.lastPage,
        note:ids.length?'Only the specified vehicle-identification branch is matched. Other actors, penalties and unrelated branches remain open.':r.note};
    }),
    remainingGroups:previous.remainingGroups.map(g=>({name:g.name,keys:g.keys,reviewQuestion:g.reviewQuestion,addedIds:[...g.addedIds,...additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id)],status:'bounded_additions_do_not_close_group'})),
    remainingFindings: buildRemainingFindings(),
    decisions:[
      'Ten distinct choices preserve each actor, mental state, purpose and punishment. This does not close the vehicle chapter.',
      '10803 requires more than one vehicle or parts from more than one vehicle. The 10804 scrap-processing and recovered-property exceptions are dependencies, not new crimes.',
      '10802 can apply to one vehicle or part. Its concealment intent and sale/transfer/import/export purpose distinguish it from 10750.',
      'The 10803(a) 2/4/6-year and $60,000 felony alternatives are not transferred to possession under (b), whose alternatives are 16 months/2/3 years and $30,000.',
      '10751(a) is a misdemeanor under 40000.9. Its separate civil property-disposition process is not presented as a criminal charge.',
      '20002(b) concerns the person who parked a runaway vehicle. It does not resolve nondriving owner/passenger-in-control liability.',
      'The source discrepancy involving the missing HSC 113785 definition is recorded as CA-007. Absence does not prove repeal or authorize silent substitution.',

    ]};
}
export const readVehicleIdentificationReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-vehicle-identification-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildVehicleIdentificationReview>;
export function validateVehicleIdentificationReview(review=readVehicleIdentificationReview(),definitions=additions,acquisition=readVehicleIdentificationReviewAcquisition()) {
  const research=validateDrivingPacket(),docs=vehicleIdentificationDocuments(acquisition);
  if(review.scope!=='bounded_vehicle_identification_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
  if(!same(acquisition.missingResearchKeys,['HSC:113785'])||!same(Object.keys(acquisition.researchDocuments).sort(),['BPC:25503.16','VEH:10853']))throw new Error('Research probe accounting changed');
  for(const [key,versions] of Object.entries(acquisition.researchDocuments))for(const v of versions)if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key)throw new Error('Unbound research probe');
  const keys=[...new Set(definitions.flatMap(a=>[primary(a),...a.supportingKeys]))].sort();
  if(!same(keys,acquisition.requiredKeys)||!same(keys,[...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort()))throw new Error('Incomplete publication dependencies');
  if(!same(acquisition.promotedResearchKeys,Object.keys(acquisition.documents).filter(k=>research[k]).sort()))throw new Error('Research promotion accounting changed');
  for(const key of keys) {
    const versions=docs[key];
    if(versions?.length!==1)throw new Error('Publication needs explicit version resolution');
    for(const v of versions) {
      const u=new URL(v.sourceUrl);
      if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.protocol!=='https:'||u.hostname!=='leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key||v.activeFlag!=='Y')throw new Error('Unbound publication source');
    }
    if(acquisition.promotedResearchKeys.includes(key)&&!same(versions,research[key]))throw new Error('Promoted research source changed');
  }
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==10||new Set(ids).size!==10||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate charged branch');
  }
  if(!same(review.crosswalk,buildVehicleIdentificationReview().crosswalk)||!same(review.remainingGroups,buildVehicleIdentificationReview().remainingGroups)||!same(review.decisions,buildVehicleIdentificationReview().decisions))throw new Error('Unexplained benchmark or group closure');
  if(!same(review,buildVehicleIdentificationReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderVehicleIdentificationReview(review=readVehicleIdentificationReview()) {
  const counts=validateVehicleIdentificationReview(review);
  return ['# California vehicle identification and remaining duties: publication batch','',`${counts.additions} proposed choices from ${counts.primarySections} primary sections. ${counts.promotedResearchSections} research sections become monitored publication dependencies; ${counts.reusedSections} dependencies were already retained for publication.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}: ${f.status.replaceAll('_',' ')}`,'',f.reason,`Next step: ${f.nextStep}`,`Sources: ${f.sources.map(s=>s.key).join(', ')}.`,...f.sources.map(s=>`[${s.key}](${s.sourceUrl}): ${s.excerpt}`),'']),'## Remaining work','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.reviewQuestion} Added ${g.addedIds.length} choices; the group remains open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildVehicleIdentificationReview();validateVehicleIdentificationReview(review);
  fs.writeFileSync(new URL('../output/california-vehicle-identification-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-vehicle-identification-review.md',import.meta.url),renderVehicleIdentificationReview(review));
  console.log(JSON.stringify(validateVehicleIdentificationReview(review)));
}
