import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-weapons-threats-additions.json";
import acquisitionData from "../output/california-weapons-threats-acquisition.json";
import previous from "../output/california-registration-exploitation-review.json";
import {validatePeopleWeaponsPacket} from "./people-weapons-review";
import {registrationExploitationDocuments} from "./registration-exploitation-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readWeaponsThreatsReviewAcquisition=()=>structuredClone(acquisitionData);
export function weaponsThreatsDocuments(acquisition=readWeaponsThreatsReviewAcquisition()) {
  const docs=registrationExploitationDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'weapons-predicate-and-enforceability-review',status:'substantive_research_open',keys:['PEN:21310','PEN:21510','PEN:25400','PEN:25850','PEN:29800','PEN:29805','PEN:29815','PEN:29820','PEN:29825','PEN:29900','PEN:30305','PEN:30600','PEN:30605','PEN:30615','PEN:22810'],question:'Finish knife/carrying rules, prohibited-person and ammunition predicates, tear gas and remaining assault-weapon branches, including current enforceability.',treatment:'No automatic publication or dismissal as minor. Existing reviewed choices and the PEN:30515 changed-source hold remain in place; this conduct batch does not certify the remaining weapon categories.'},
  {id:'hate-enhancements-and-storage-siblings',status:'substantive_research_open',keys:['PEN:422.7','PEN:422.75','PEN:18735','PEN:25145'],question:'Review independent predicates and the applicability of hate-crime allegations, greater-than-.60-caliber ammunition and residential-storage fine/repeat-offense branches.',treatment:'Allegations are not invented as standalone crimes; newly retained definition/support sections do not automatically become selectable offenses.'},
];
export function buildWeaponsThreatsReview() {
  const docs=weaponsThreatsDocuments(),a=readWeaponsThreatsReviewAcquisition();
  const contextDocs={...validatePeopleWeaponsPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_weapons_threats_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Forty-three exact conduct branches, not complete statewide or weapons-family coverage.',
      'Bias, intent, knowledge, defenses, officer status and protected expression remain elements or case-specific questions; a label does not prove them.',
      'Current statutory text controls over older instruction headings and subdivision references; both are preserved in the discrepancy inventory.',
      'Storage clauses operative January 1, 2026 are not retroactively applied to earlier conduct. Prohibited-person status is not inferred from a generic history answer.',
      'English-only additions retain fallback notices. Promotion and comparison do not renew receipt time or clear the PEN:30515 hold.'],
    sourceAnomalies:[
      {id:'CA-008',key:'PEN:422.6',instructionIds:['1350','1351','1352'],description:'Retained CALCRIM misdemeanor headings differ from the current 422.6(c) 1170(h) alternative. Preserve headings but classify the statutory branches as wobblers; do not add a numeric community-service minimum that the statute omits.'},
      {id:'CA-009',key:'PEN:11411',instructionIds:['1303','1304'],description:'Retained CALCRIM 1303/1304 use older subdivisions and conduct formulations. Current 11411(b)/(c)/(d) distinguish nooses, signs and religious symbols. Do not copy the old two-occasion element into current clauses or treat all listed public sites as requiring only recklessness.'},
    ].map(a=>({...a,source:binding(a.key),text:sourceText(docs[a.key][0].contentXml),instructions:a.instructionIds.map(id=>{const i=previous.crosswalk.find(r=>r.id===id)!;return {id,heading:i.heading,firstPage:i.firstPage,lastPage:i.lastPage,pageHashes:i.pageHashes};})})),
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
      return {...r,...(['1303','1304','1350','1351','1352'].includes(r.id)?{sourceDiscrepancy:['1303','1304'].includes(r.id)?'CA-009':'CA-008'}:{}),previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,boundedChargeIds:[...r.boundedChargeIds,...ids]};
    }),
    remainingGroups:previous.remainingGroups.map(g=>({...g,addedIds:[...new Set([...g.addedIds,...additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id)])],status:'bounded_additions_do_not_close_group'})),
    remainingFindings:[...previous.remainingFindings,...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    decisions:[
      'Stalking remains distinct from a single criminal threat. The protective-order and qualifying-prior branches have different classifications and terms; court-ordered registration is possible, not automatic.',
      '422.6 is published with both statutory tiers. The minimum community-service wording supplies no numeric floor; only the 400-hour/350-day ceilings are stated. Bias must be a substantial factor when motives are mixed.',
      '11411 preserves private-property purpose-or-recklessness versus listed-site purpose, symbol knowledge and peaceful-symbol limitations. Prior convictions change fine ceilings rather than silently making every case felony-only.',
      'The retained 1303 instruction is credited only as a bounded comparison for current sign/symbol conduct, not as proof of the new noose branch. The changed citations/elements remain in CA-009.',
      'Explosive/device possession, manufacture-intent, transport, sale, intent to injure, intent to murder, bodily injury, death and mayhem/great bodily injury are separate branches. Death under 18755(a) has LWOP; (b) says life and is not relabeled LWOP.',
      'Chapter permit/public-duty exceptions and explosive/device definitions are retained. Greater-than-.60-caliber fixed ammunition is excluded from 18710/18730, not declared lawful under every provision.',
      'Brandishing minimums differ: 30 days, three months and nine months are not interchangeable. 417.3 has a specifically stated $3,000 fine; do not replace it with the default felony ceiling.',
      '26100 distinguishes owner/driver knowing permission from intentional discharge and the outside-vehicle target condition. FGC:2006 and FGC:3002 retain their separate official code identity.',
      '25100 and the 25105/25205 exceptions are checked against their January 1, 2026 operative dates. Secure storage/readily controlled definitions are retained through 25145, including its further definitions.',
      'Storage choices keep required access/injury/removal differences. The third degree does not invent an actual-access element. Parent accidental-shooting protections and training mitigation remain visible.',
      'No publication is inferred for newly retained support sections, the firearm prohibition predicates, assault-weapon definitions or unsettled carrying/knife enforceability.',

    ]};
}
export const readWeaponsThreatsReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-weapons-threats-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildWeaponsThreatsReview>;
export function validateWeaponsThreatsReview(review=readWeaponsThreatsReview(),definitions=additions,acquisition=readWeaponsThreatsReviewAcquisition()) {
  const research=validatePeopleWeaponsPacket(),docs=weaponsThreatsDocuments(acquisition);
  if(review.scope!=='bounded_weapons_threats_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==43||new Set(ids).size!==43||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildWeaponsThreatsReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id)) && !previous.crosswalk.find(p=>p.id===r.id)?.boundedChargeIds.length).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderWeaponsThreatsReview(review=readWeaponsThreatsReview()) {
  const c=validateWeaponsThreatsReview(review);
  return ['# California weapons, threats and hate crimes: combined publication batch','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies, ${c.newSections} newly monitored sections including ${c.promotedResearchSections} promoted from research. ${c.newBenchmarkMatches} additional instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Source discrepancies','',...review.sourceAnomalies.map(a=>`- ${a.id}: ${a.description}`),'','## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Current treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),'## Remaining groups','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.question} Added ${g.addedIds.length} choices; other branches remain open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildWeaponsThreatsReview();validateWeaponsThreatsReview(review);
  fs.writeFileSync(new URL('../output/california-weapons-threats-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-weapons-threats-review.md',import.meta.url),renderWeaponsThreatsReview(review));
  console.log(JSON.stringify(validateWeaponsThreatsReview(review)));
}
