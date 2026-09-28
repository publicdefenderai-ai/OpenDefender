import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-driving-vessels-additions.json";
import acquisitionData from "../output/california-driving-publication-acquisition.json";
import previous from "../output/california-driving-vessels-review.json";
import {validateDrivingPacket} from "./driving-vessels-review";
import {drugSuccessorDocuments} from "./drug-successor-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readDrivingPublicationAcquisition=()=>structuredClone(acquisitionData);
export function drivingPublicationDocuments(acquisition=readDrivingPublicationAcquisition()) {
  const docs=drugSuccessorDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}
export function buildDrivingPublication() {
  const docs=drivingPublicationDocuments(),a=readDrivingPublicationAcquisition();
  const bindings=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_driving_vessel_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Publication covers only the 21 named branches; injury DUI, licensing, racing and other gaps remain open.',
      'No sentencing or enforceability uncertainty is silently treated as a minor-offense deferral.',
      'Pins and unchanged-source comparison are required for promoted research sources; acquisition time is never renewed by replay.',
      'Statutes govern punishment. Instruction matches are bounded and do not establish complete coverage.'],
    records:additions.map(a=>{
      const key=primary(a),v=docs[key][0],text=sourceText(v.contentXml);
      return {id:a.id,primaryKey:key,definitionSha256:hash(a),status:'bounded_statutory_addition_proposed',sources:[...new Set([key,...a.supportingKeys])].sort().map(bindings),primaryEvidence:{key,versionId:v.versionId,start:0,end:text.length,text}};
    }),
    crosswalk:previous.crosswalk.map(r=>{
      const ids=additions.filter(a=>a.calcrim.includes(r.id)).map(a=>a.id);
      return {instruction:r.id,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,chargeIds:[...r.chargeIds,...ids],firstPage:r.firstPage,lastPage:r.lastPage,
        note:ids.length?'Only the named driver/evasion branches are added. Nondriving-owner duties and unrelated branches remain open.':r.note};
    }),
    remainingGroups:previous.groups.map(g=>({name:g.name,keys:g.keys,reviewQuestion:g.question,addedIds:additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id),status:'bounded_additions_do_not_close_group'})),
    decisions:[
      'VEH 2800.3(a) is a misdemeanor/felony alternative with 3/5/7-year felony terms; death under (b) is felony-only with 4/6/10-year terms. Neither uses the default felony range.',
      'VEH 20001 injury and death/permanent-serious-injury penalties are separate. The driver conduct is in (a); charging-paper aliases preserve that reference for both penalty branches. Nondriving owners/passengers remain open.',
      'PEN 193.5(b) expressly uses 16 months, 2 years or 4 years under 1170(h). The other vessel-manslaughter subdivisions have different custody rules.',
      'HNC 668(g) requires a fine with custody for operator injury under 655(f). HNC 668(e) expressly includes charter crew under 655.4, including its injury branch; operator felony punishment is not transferred to crew.',
      'PEN 193.8 concerns adult entrustment to an intoxicated minor, not the punishment for vessel manslaughter. PEN 499 concerns recidivist 499b punishment, not a standalone generic vessel-taking offense. Both remain research carry-forwards.',
      'HNC 655(e) addiction status and its treatment exception remain open. No generic intoxication choice silently includes that branch.',
    ]};
}
export const readDrivingPublication=()=>JSON.parse(fs.readFileSync(new URL('../output/california-driving-publication-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildDrivingPublication>;
export function validateDrivingPublication(review=readDrivingPublication(),definitions=additions,acquisition=readDrivingPublicationAcquisition()) {
  const research=validateDrivingPacket(),docs=drivingPublicationDocuments(acquisition);
  if(review.scope!=='bounded_driving_vessel_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
  const keys=[...new Set(definitions.flatMap(a=>[primary(a),...a.supportingKeys]))].sort();
  if(!same(keys,acquisition.requiredKeys)||!same(keys,[...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort()))throw new Error('Incomplete publication dependencies');
  if(!same(acquisition.promotedResearchKeys,Object.keys(acquisition.documents).filter(k=>research[k]).sort()))throw new Error('Research promotion accounting changed');
  for(const key of keys) {
    const versions=docs[key];
    if(versions?.length!==1)throw new Error('Publication needs explicit single-version resolution');
    for(const v of versions) {
      const u=new URL(v.sourceUrl);
      if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.protocol!=='https:'||u.hostname!=='leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key||v.activeFlag!=='Y')throw new Error('Unbound publication source');
    }
    if(acquisition.promotedResearchKeys.includes(key)&&!same(versions,research[key]))throw new Error('Promoted research source changed');
  }
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==21||new Set(ids).size!==21||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review.crosswalk,buildDrivingPublication().crosswalk)||!same(review.remainingGroups,buildDrivingPublication().remainingGroups)||!same(review.decisions,buildDrivingPublication().decisions))throw new Error('Unexplained benchmark or group closure');
  if(!same(review,buildDrivingPublication()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderDrivingPublication(review=readDrivingPublication()) {
  const counts=validateDrivingPublication(review);
  return ['# California driving and vessels: publication batch','',`${counts.additions} proposed choices from ${counts.primarySections} primary sections. ${counts.promotedResearchSections} research sections become monitored publication dependencies; ${counts.reusedSections} dependencies were already retained for publication.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining work','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.reviewQuestion} Added ${g.addedIds.length} choices; the group remains open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildDrivingPublication();validateDrivingPublication(review);
  fs.writeFileSync(new URL('../output/california-driving-publication-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-driving-publication-review.md',import.meta.url),renderDrivingPublication(review));
  console.log(JSON.stringify(validateDrivingPublication(review)));
}
