import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-repeat-theft-assembly-additions.json";
import acquisitionData from "../output/california-repeat-theft-assembly-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-public-order-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {publicOrderDocuments} from "./public-order-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readRepeatTheftAssemblyReviewAcquisition=()=>structuredClone(acquisitionData);
export function repeatTheftAssemblyDocuments(acquisition=readRepeatTheftAssemblyReviewAcquisition()) {
  const docs=publicOrderDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const replacedFindingIds=['property-repeat-theft-and-vehicle-taking','public-order-assembly-and-adjacent-branches'];
const remainingFindings=[
 {id:'vehicle-special-and-low-value-branches',status:'substantive_research_open',keys:['VEH:10851','PEN:490.2','PEN:666.5'],question:'Complete low-value taking and special-vehicle sentencing beyond the bounded ordinary taking/posttheft-driving choice.',treatment:'Do not apply the published ordinary ranges to low-value taking or the ambulance, emergency-service and disability-modified vehicle branch. Do not treat a sentencing factor as a separate act.'},
 {id:'repeat-theft-and-custody-riot-fines',status:'fine_ceiling_unresolved',keys:['PEN:666','PEN:666.1','PEN:490','PEN:672','PEN:1202.5','PEN:404.6'],question:'Resolve the applicable fine ceilings for increased-punishment theft and jail/prison riot incitement without duplicating a fine supplied by another provision.',treatment:'Publish supported custody/classification with an explicit fine gap, not an invented generic ceiling. This is a research queue item, not an attorney data-entry assignment.'},
 {id:'remaining-trespass-branches',status:'substantive_research_open',keys:['PEN:602'],question:'Complete remaining consequential trespass branches beyond the published choices.',treatment:'Assembly/dispersal choices in this batch have bounded review; that does not close the public-order family or this remaining trespass work.'},
];
export function buildRepeatTheftAssemblyReview() {
  const docs=repeatTheftAssemblyDocuments(),a=readRepeatTheftAssemblyReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_repeat_theft_assembly_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Ten choices combining consequential repeat-theft/vehicle routes with assembly/dispersal; not full family or statewide completeness.',
      'Prior-conviction theft provisions are increased-punishment allegations, not additional standalone conduct.',
      'Low-value taking and special-vehicle sentencing remain explicit bounded gaps; ordinary vehicle ranges are not assigned to them.',
      'Unresolved fine ceilings remain visible in the published explanations. No unsupported default fine is synthesized.',
      'Protected expression, lawful warnings and qualifying journalist protections remain explicit.',
      'English-only fallback notices and the existing freshness deadline remain unchanged.'],
    sourceAnomalies:[],
    interpretationAuthorities:[
      {
            "name": "People v. Bullard (2020) 9 Cal.5th 94",
            "url": "https://law.justia.com/cases/california/supreme-court/2020/s239488.html",
            "scope": "Temporary taking is not excluded from low-value misdemeanor treatment; substantially separated posttheft driving remains distinct."
      },
      {
            "name": "People v. Lee (2017) 16 Cal.App.5th 861",
            "url": "https://law.justia.com/cases/california/court-of-appeal/2017/f072173.html",
            "scope": "Section 666.5 changes the felony term for qualifying vehicle priors; it does not automatically remove the underlying misdemeanor option."
      },
      {
            "name": "In re Kay (1970) 1 Cal.3d 930",
            "url": "https://law.justia.com/cases/california/supreme-court/3d/1/930.html",
            "scope": "Substantial interference by conduct, not disagreement with expressive content, for the public-meeting offense; applied in retained CALCRIM 2681."
      },
      {
            "name": "In re Brown (1973) 9 Cal.3d 612",
            "url": "https://law.justia.com/cases/california/supreme-court/3d/9/612.html",
            "scope": "Constitutional violence/immediate-danger limitation on assemblies for a lawful purpose; applied in retained CALCRIM 2685/2686."
      }
],
    priorLegalReviewSha256:hash(priorLegalReview),
    records:additions.map(a=>{
      const key=primary(a),v=docs[key][0],text=sourceText(v.contentXml);
      return {id:a.id,primaryKey:key,definitionSha256:hash(a),status:'bounded_statutory_addition_proposed',sources:[...new Set([key,...a.supportingKeys])].sort().map(binding),primaryEvidence:{key,versionId:v.versionId,start:0,end:text.length,text},
        instructionEvidence:a.calcrim.map(id=>{
          const i=previous.crosswalk.find(r=>r.id===id);if(!i)throw new Error('Unknown instruction mapping');
          return {id,firstPage:i.firstPage,lastPage:i.lastPage,pageHashes:i.pageHashes};
        })};
    }),
    crosswalk:priorLegalReview.crosswalk.map(r=>{
      const ids=additions.filter(a=>a.calcrim.includes(r.id)).map(a=>a.id);
      return {...r,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,boundedChargeIds:[...r.boundedChargeIds,...ids]};
    }),
    remainingGroups:previous.groups.map(g=>({...g,status:'bounded_additions_do_not_close_group'})),
    remainingFindings:[...priorLegalReview.remainingFindings.filter(f=>!replacedFindingIds.includes(f.id)),...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    supersededFindings:priorLegalReview.remainingFindings.filter(f=>replacedFindingIds.includes(f.id)),
    decisions:[
      "Display titles describe the retained conduct; exact statutory subdivisions and charging-paper aliases are preserved.",
      "666 requires both the qualifying prior/custody and the subdivision (b) status. The specific 667(e)(2)(C)(iv) list is not broadened to every serious felony. 666.1 instead requires two listed prior convictions and distinguishes first from subsequent convictions under that section; no prior-custody requirement is invented.",
      "666/666.1 are selectable increased-punishment versions of the current theft, not advice to add a new standalone crime. Their fine ceilings remain explicit research gaps because the underlying theft fine and other fine provisions need reconciliation.",
      "10851(a) publication is bounded to taking above $950 and posttheft driving after a substantial break. Bullard protects low-value temporary taking as well as permanent taking; Lee preserves the misdemeanor option despite a qualifying vehicle prior. Low-value ordinary penalties and subdivision (b) are not silently assigned the default range.",
      "403 follows retained CALCRIM 2681 and Kay: intentional rule-breaking conduct must substantially interfere with the meeting; the message alone is not the offense. Religious and elector meetings have distinct statutes. ELEC identity remains separate from PEN.",
      "404.6(a) requires intent, urging and immediate danger but no completed riot. 404.6(c) adds the actual prison/jail riot and serious injury; the ordinary fine is not silently replaced with the generic felony ceiling.",
      "408 combines the rout and unlawful-assembly alternatives in one section choice while retaining their distinct requirements. Brown limits assemblies for lawful purposes to violence or clear and present danger of immediate violence; boisterous speech alone does not suffice.",
      "409 and 416(a) stay separate: 409 does not require participation in the underlying disturbance, while 416(a) requires the specified intent and probable cause. Both require a lawfully communicated dispersal warning and consideration of 409.7 journalist protections.",
      "416 restitution is limited to property damage personally caused, with the burden on the prosecution/claimant and the statutory inability-to-pay community-service alternative. No collective damage liability is inferred.",
      "Acquisition now recognizes all frozen providers already validated by the shared research packet when counting promoted sources. Every promoted version is compared with that packet, and all publication dependencies remain in the normal freshness comparison.",
      "Prior unresolved findings are retained unless explicitly superseded by narrower findings; superseded entries preserve their source evidence. Bounded instruction matches do not close a family or establish statewide completeness."
]};
}
export const readRepeatTheftAssemblyReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-repeat-theft-assembly-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildRepeatTheftAssemblyReview>;
export function validateRepeatTheftAssemblyReview(review=readRepeatTheftAssemblyReview(),definitions=additions,acquisition=readRepeatTheftAssemblyReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=repeatTheftAssemblyDocuments(acquisition);
  if(review.scope!=='bounded_repeat_theft_assembly_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==10||new Set(ids).size!==10||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
  for(const r of review.records) {
    const a=definitions.find(a=>a.id===r.id)!;
    if(r.definitionSha256!==hash(a)||r.primaryKey!==primary(a)||a.translationStatus!=='english_only_pending_translation')throw new Error('Definition changed without review');
    const keys=[...new Set([primary(a),...a.supportingKeys])].sort();
    if(!same(r.sources.map(s=>s.key),keys)||!same(Object.keys(a.sourceEffectiveDates).sort(),keys))throw new Error('Incomplete reviewed sources');
    for(const s of r.sources)if(!same(s.versions,docs[s.key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256})))||(a.sourceEffectiveDates as Record<string,string|null>)[s.key] !== (docs[s.key][0].effectiveDate?.slice(0,10)??null))throw new Error('Source binding changed');
    const e=r.primaryEvidence,v=docs[r.primaryKey].find(v=>v.versionId===e.versionId);
    if(!v)throw new Error('Wrong operative version');
    if(e.key!==r.primaryKey||e.versionId!==v.versionId||e.start!==0||e.end!==e.text.length||e.text!==sourceText(v.contentXml))throw new Error('Unbound primary evidence');
    const c=getCaliforniaCanonicalRecord(a.id);
    if(!c?.selectable||c.code!==a.code||c.lawCode!==a.lawCode||c.penalty!==a.penalty||c.officialTitle!==a.title||!same(c.categories,a.categories))throw new Error('Runtime publication drift');
    const runtimeKeys=c.sources.map(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`;}).sort();
    if(!same(runtimeKeys,keys))throw new Error('Runtime dependency drift');
    for(const instruction of r.instructionEvidence) {
      const previousRow=previous.crosswalk.find(i=>i.id===instruction.id);
      if(!previousRow||!same(instruction,{id:previousRow.id,firstPage:previousRow.firstPage,lastPage:previousRow.lastPage,pageHashes:previousRow.pageHashes})||!previousRow.sourceKeys.some(k=>keys.includes(k)))throw new Error('Unbound instruction match');
    }
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate charged branch');
  }
  if(!same(review,buildRepeatTheftAssemblyReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderRepeatTheftAssemblyReview(review=readRepeatTheftAssemblyReview()) {
  const c=validateRepeatTheftAssemblyReview(review);
  return ['# California repeat theft, vehicles and assembly: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. ${c.promotedResearchSections} newly monitored sources reuse the research packet. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildRepeatTheftAssemblyReview();validateRepeatTheftAssemblyReview(review);
  fs.writeFileSync(new URL('../output/california-repeat-theft-assembly-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-repeat-theft-assembly-review.md',import.meta.url),renderRepeatTheftAssemblyReview(review));
  console.log(JSON.stringify(validateRepeatTheftAssemblyReview(review)));
}
