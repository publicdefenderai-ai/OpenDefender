import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-traffic-additions.json";
import acquisitionData from "../output/california-traffic-acquisition.json";
import previous from "../output/california-driving-publication-review.json";
import {validateDrivingPacket} from "./driving-vessels-review";
import {drivingPublicationDocuments} from "./driving-publication-review";
import transitions from "../../../shared/california-source-transitions.json";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readTrafficReviewAcquisition=()=>structuredClone(acquisitionData);
export function trafficDocuments(acquisition=readTrafficReviewAcquisition()) {
  const docs=drivingPublicationDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}
export function buildTrafficReview() {
  const docs=trafficDocuments(),a=readTrafficReviewAcquisition();
  const bindings=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_traffic_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Publication covers only the 24 named branches; addiction-status DUI, under-21 alcohol, owner/passenger duties and other gaps remain open.',
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
        note:ids.length?'Only the specified DUI, licensing, racing or court-duty branches are matched. Other actors, penalties and unrelated branches remain open.':r.note};
    }),
    remainingGroups:previous.remainingGroups.map(g=>({name:g.name,keys:g.keys,reviewQuestion:g.reviewQuestion,addedIds:[...g.addedIds,...additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id)],status:'bounded_additions_do_not_close_group'})),
    sourceVersionDecisions:[
      {key:'VEH:13352',currentVersionId:'id_1f3f7ef6-c630-11f0-975c-e301db986e9c',futureVersionId:'id_21272ab8-c630-11f0-975c-e301db986e9c',transitionDate:'2033-01-01'},
      {key:'VEH:23103.5',currentVersionId:'id_523c9fc4-c630-11f0-975c-e301db986e9c',futureVersionId:'id_540d1a06-c630-11f0-975c-e301db986e9c',transitionDate:'2033-01-01'},
      {key:'VEH:23573',currentVersionId:'id_59eb063e-c630-11f0-975c-e301db986e9c',futureVersionId:'id_5bbf7820-c630-11f0-975c-e301db986e9c',transitionDate:'2033-01-01'},
      {key:'VEH:23575',currentVersionId:'id_5d57cb62-c630-11f0-975c-e301db986e9c',futureVersionId:'id_5efb1b24-c630-11f0-975c-e301db986e9c',transitionDate:'2033-01-01'},
    ],
    // Freeze this historical traffic packet to its own transition identities.
    knownTransitions:transitions.filter(row=>['VEH:23109','VEH:23573','VEH:23575','VEH:13352','VEH:23103.5'].includes(row.key)),
    decisions:[
      'VEH 23153 requires a concurrent unlawful act or neglected duty that causes injury to someone other than the driver; a DUI label alone does not establish injury DUI.',
      'Mandatory base fines accompany custody under the DUI and specified repeat-license provisions. Probation has separate statutory minimums and program alternatives; ordinary minimums are not represented as unavoidable in every case.',
      'PEN 17(d)/19.8 permit infraction treatment of VEH 14601.1, 23109(c), and 40508. Infractions have no custody; the filing and disposition control. Other neighboring provisions do not inherit the alternative.',
      'Both operative and future versions of 13352, 23103.5, 23573 and 23575 are retained. The 2026 operative versions of 23573 and 23575 repeal January 1, 2033; the separately retained future versions are not substituted based on identical effective dates or active flags. Known transitions withhold dependent records until re-reviewed, even if an archive receipt is renewed.',
      'VEH 23109(i)(2) states January 1, 2029 for its sideshow-specific license provision. That future provision is not represented as operative in 2026.',
      'CA-006 preserves VEH 14601.1(c)\'s literal 12500(d) reference; the retained offstreet-parking definition appears in 12500(c). No source text is rewritten.',
      'CALCRIM 2220 explains notice as a permissive inference. The statutory conclusive-presumption wording is not used to tell a defendant that knowledge or guilt is automatic.',
    ]};
}
export const readTrafficReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-traffic-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildTrafficReview>;
export function validateTrafficReview(review=readTrafficReview(),definitions=additions,acquisition=readTrafficReviewAcquisition()) {
  const research=validateDrivingPacket(),docs=trafficDocuments(acquisition);
  if(review.scope!=='bounded_traffic_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
  const keys=[...new Set(definitions.flatMap(a=>[primary(a),...a.supportingKeys]))].sort();
  if(!same(keys,acquisition.requiredKeys)||!same(keys,[...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort()))throw new Error('Incomplete publication dependencies');
  if(!same(acquisition.promotedResearchKeys,Object.keys(acquisition.documents).filter(k=>research[k]).sort()))throw new Error('Research promotion accounting changed');
  for(const key of keys) {
    const versions=docs[key];
    const decision=review.sourceVersionDecisions.find(d=>d.key===key);
    if(versions?.length!==(decision?2:1))throw new Error('Publication needs explicit version resolution');
    if(decision){
      const current=versions.find(v=>v.versionId===decision.currentVersionId),future=versions.find(v=>v.versionId===decision.futureVersionId);
      if(!current||!future||!sourceText(current.contentXml).includes('only until January 1, 2033')||!sourceText(future.contentXml).includes('operative January 1, 2033')||!transitions.some(t=>t.key===key&&t.reviewBefore===decision.transitionDate))throw new Error('Interlock operative version decision changed');
    }
    for(const v of versions) {
      const u=new URL(v.sourceUrl);
      if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.protocol!=='https:'||u.hostname!=='leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key||v.activeFlag!=='Y')throw new Error('Unbound publication source');
    }
    if(acquisition.promotedResearchKeys.includes(key)&&!same(versions,research[key]))throw new Error('Promoted research source changed');
  }
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==24||new Set(ids).size!==24||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review.crosswalk,buildTrafficReview().crosswalk)||!same(review.remainingGroups,buildTrafficReview().remainingGroups)||!same(review.decisions,buildTrafficReview().decisions))throw new Error('Unexplained benchmark or group closure');
  if(!same(review,buildTrafficReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderTrafficReview(review=readTrafficReview()) {
  const counts=validateTrafficReview(review);
  return ['# California DUI, licensing and racing: publication batch','',`${counts.additions} proposed choices from ${counts.primarySections} primary sections. ${counts.promotedResearchSections} research sections become monitored publication dependencies; ${counts.reusedSections} dependencies were already retained for publication.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining work','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.reviewQuestion} Added ${g.addedIds.length} choices; the group remains open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildTrafficReview();validateTrafficReview(review);
  fs.writeFileSync(new URL('../output/california-traffic-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-traffic-review.md',import.meta.url),renderTrafficReview(review));
  console.log(JSON.stringify(validateTrafficReview(review)));
}
