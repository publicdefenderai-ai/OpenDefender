import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-public-order-additions.json";
import acquisitionData from "../output/california-public-order-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-financial-tax-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {financialTaxDocuments} from "./financial-tax-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readPublicOrderReviewAcquisition=()=>structuredClone(acquisitionData);
export function publicOrderDocuments(acquisition=readPublicOrderReviewAcquisition()) {
  const docs=financialTaxDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
 {id:'public-order-school-loitering',status:'substantive_research_open',keys:['PEN:653b'],question:'Resolve the conduct construction flagged by CALCRIM 2917 before publishing a school-loitering choice.',treatment:'Do not equate mere presence with criminal loitering or silently choose between disputed constructions. Keep unpublished while higher-priority work proceeds.'},
 {id:'public-order-assembly-and-adjacent-branches',status:'substantive_research_open',keys:['PEN:403','PEN:404','PEN:404.6','PEN:407','PEN:409','PEN:416','PEN:602'],question:'Complete assembly, dispersal and remaining trespass branch research, including constitutional limits.',treatment:'This combined publication does not close the public-order family. Prior published exact choices remain available; absent siblings are not assumed minor.'},
];
export function buildPublicOrderReview() {
  const docs=publicOrderDocuments(),a=readPublicOrderReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_public_order_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-three choices across trespass, dangerous animals, alcohol, betting and confidential recordings; not full family or statewide completeness.',
      'Scope follows exact conduct and penalty branches. A shared section or instruction match does not establish every sibling offense.',
      'Known statutory exclusions, fine-only alternatives and the limited noncommercial betting infraction remain explicit.',
      'School loitering stays a documented research gap rather than an assumed ordinary misdemeanor.',
      'English-only additions retain fallback notices. Acquisition and expiry dates are unchanged.'],
    sourceAnomalies:[],
    interpretationAuthorities:[] as Array<{name:string;url:string;scope:string}>,
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
    remainingFindings:[...priorLegalReview.remainingFindings,...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    decisions:[
      "Display titles describe source conduct where no short statutory title exists, with charging-paper citation aliases. Source terminology and exact evidence remain available.",
      "591 preserves the felony imprisonment AND fine conjunction; it is not reduced to a discretionary generic fine.",
      "601 keeps its 30-day window, credible-threat and intent-to-execute requirements, separate home/workplace routes and own-property/protected-labor exclusions.",
      "602(k) follows CALCRIM 2930 on actual interference or damage. 602(m) follows the February 2026 CALCRIM 2931 continuous-occupation element, so brief entry is not silently elevated to occupancy. The 602.8 infraction framework is retained as a dependency, not generalized to these completed misdemeanor branches.",
      "602.5(b) depends on both entry elements and the person-present finding; counseling, supervised probation and consideration of a restraining order are conditional consequences.",
      "399 keeps actual knowledge and ordinary care distinct from 399.5 knowledge-or-reason-to-know. The incapacity exception to victim precautions comes from retained CALCRIM 2950/2951; dog-specific exclusions and post-conviction hearing stay explicit.",
      "25658 keeps its specialized fines and community service rather than adding the default misdemeanor jail term. The injury/death route remains a misdemeanor and permits a fine-only sentence; its six-month lower jail limit is conditional on a jail sentence.",
      "25658 age-belief and identification defenses, 911 immunity and the narrow educational-tasting exception stay visible. Current VEH 13202.5(d) does not list these offenses; no obsolete automatic license suspension is inferred. No general immunity from impaired-driving charges is claimed.",
      "25658.2 requires home permission, the specified intoxication, knowing permission to drive, and a collision caused by the underage driver. It is not a generic parental-hosting offense.",
      "337a retains six conduct branches and their knowledge/purpose requirements. 336.9 is a separate limited infraction for qualifying noncommercial activity, excludes online bets and pools above $2,500, and does not cover paragraph (a)(1). Repeat penalties are not silently replaced by first-offense caps.",
      "632 requires objectively reasonable confidentiality. Participant evidence recording under 633.5, the separate domestic-violence restraining-order conditions in 633.6 and lawful-official exclusions are retained to avoid telling victims all unconsented recordings are crimes. Civil remedies remain separate from the criminal fine.",
      "The cumulative crosswalk preserves earlier justice, property and financial matches without claiming entire instruction families are closed. No evidence receipt is renewed by offline publication."
]};
}
export const readPublicOrderReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-public-order-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildPublicOrderReview>;
export function validatePublicOrderReview(review=readPublicOrderReview(),definitions=additions,acquisition=readPublicOrderReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=publicOrderDocuments(acquisition);
  if(review.scope!=='bounded_public_order_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==23||new Set(ids).size!==23||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildPublicOrderReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderPublicOrderReview(review=readPublicOrderReview()) {
  const c=validatePublicOrderReview(review);
  return ['# California public-order offenses: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. ${c.promotedResearchSections} newly monitored sources reuse the research packet. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildPublicOrderReview();validatePublicOrderReview(review);
  fs.writeFileSync(new URL('../output/california-public-order-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-public-order-review.md',import.meta.url),renderPublicOrderReview(review));
  console.log(JSON.stringify(validatePublicOrderReview(review)));
}
