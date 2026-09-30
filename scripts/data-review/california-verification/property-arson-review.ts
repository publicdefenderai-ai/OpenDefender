import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-property-arson-additions.json";
import acquisitionData from "../output/california-property-arson-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-justice-custody-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {justiceCustodyDocuments} from "./justice-custody-review";
import transitions from "../../../shared/california-source-transitions.json";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readPropertyArsonReviewAcquisition=()=>structuredClone(acquisitionData);
export function propertyArsonDocuments(acquisition=readPropertyArsonReviewAcquisition()) {
  const docs=justiceCustodyDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'property-repeat-theft-and-vehicle-taking',status:'substantive_research_open',keys:['PEN:666','PEN:666.1','VEH:10851'],question:'Compare prior-conviction, prior-custody, vehicle-taking/value and temporary-driving branches with current interpretations before publication.',treatment:'Consequential missing branches remain explicit research, not minor omissions. No charge or penalty is inferred from a generic prior-history answer.'},
  {id:'arson-special-sentencing-and-fines',status:'substantive_research_open',keys:['PEN:452','PEN:453','PEN:454','PEN:456','PEN:452.1'],question:'Resolve misdemeanor fine limits for 452(a)-(c)/453, the emergency sentencing branch and additional allegations.',treatment:'Publish the verified ordinary custody alternatives with explicit fine uncertainty and emergency-sentencing caveats. Do not use the generic 672 fine in place of chapter-specific 456.'},
  {id:'property-existing-associations',status:'substantive_research_open',keys:['PEN:368','PEN:484','PEN:487','PEN:496'],question:'Complete branch-level comparison of existing theft, receiving, elder-financial and other property matches.',treatment:'Earlier source-key associations do not certify every statutory branch; remaining crosswalk rows retain their original bounded status.'},
];
const operativeVersionId='id_7ce506cc-c956-11f0-aea3-3b460998bfb4';
export function buildPropertyArsonReview() {
  const docs=propertyArsonDocuments(),a=readPropertyArsonReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_property_arson_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-two exact charged choices in one shared property/arson/extortion group, not full family or statewide completeness.',
      'Instruction matches are bounded; supporting-section matches do not make every branch complete. Prior justice/custody matches are preserved.',
      'Arson and reckless-fire mental states, inhabited-property definitions, own-property exclusions and special sentencing remain distinct.',
      'Chapter-specific arson fines replace generic assumptions. Unresolved misdemeanor fine ceilings are displayed honestly.',
      'Adult penalties are not juvenile dispositions. English-only additions retain fallback notices. No freshness receipt is renewed.'],
    versionDecisions:[{key:'PEN:451.5',operativeVersionId,laterVersionId:'id_da957e9d-8257-11ee-bcfe-9f16e66157a6',reviewBefore:'2029-01-01',reason:'The 2026 version has the $10,100,000 loss aggravator. The older-enacted version is not operative until 2029. Both remain pinned; effective date alone does not choose operative law.'}],
    sourceAnomalies:[],
    priorLegalReviewSha256:hash(priorLegalReview),
    records:additions.map(a=>{
      const key=primary(a),v=key==='PEN:451.5'?docs[key].find(v=>v.versionId===operativeVersionId)!:docs[key][0],text=sourceText(v.contentXml);
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
    remainingFindings:remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))})),
    decisions:[
      'Display titles describe operative conduct where no short statutory label exists; they are not verbatim titles. Citation and charging-paper aliases remain available.',
      '451 is malicious arson; 452 is reckless fire. 452(a)-(c) preserve county-jail and fine alternatives despite felony wording, including the six-month county-jail maximum in (c).',
      '456 supplies the arson chapter fine, including the alternative pecuniary-gain measure. 452(a)-(c) and 453 misdemeanor fine ceilings remain an explicit research gap; no generic fine replaces this uncertainty.',
      '451.5 requires the additional premeditation/specific intent and at least one statutory aggravator. Both source versions are retained; the current loss threshold is not silently replaced by the 2029 version.',
      '451.1 and 452.1 allegations are not standalone conduct choices. 454 emergency sentencing is a visible unresolved special branch. 457.1 arson registration is expressly disclosed for the covered arson/attempt choices, distinct from sex-offender registration.',
      '213(a)(1)(A) requires at least two OTHER participants and a listed inhabited location; ordinary first-degree robbery is not duplicated.',
      '465 forcible vehicle entry is separate from the locked-vehicle burglary rule, and its prohibition on both convictions is retained. 466 lawful tool possession is not criminalized.',
      '520 uses 518/519 conduct definitions, so its CALCRIM match is through declared dependencies rather than an invented primary citation. 522 is limited here to the ordinary force-or-threat punishment branch.',
      '523 threatening writings and ransomware do not require successful payment. 524 retains its state-prison route rather than being converted to 1170(h). 521 is a fallback only where another penalty is not prescribed.',
      'The frozen original research crosswalk and prior publication matches are preserved. Remaining major property and financial/public-order gaps stay visible; no minor-omission classification is inferred from unknown severity.',

    ]};
}
export const readPropertyArsonReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-property-arson-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildPropertyArsonReview>;
export function validatePropertyArsonReview(review=readPropertyArsonReview(),definitions=additions,acquisition=readPropertyArsonReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=propertyArsonDocuments(acquisition);
  if(review.scope!=='bounded_property_arson_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
  const keys=[...new Set(definitions.flatMap(a=>[primary(a),...a.supportingKeys]))].sort();
  if(!same(keys,acquisition.requiredKeys)||!same(keys,[...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort()))throw new Error('Incomplete publication dependencies');
  if(!same(acquisition.promotedResearchKeys,Object.keys(acquisition.documents).filter(k=>research[k]).sort()))throw new Error('Research promotion accounting changed');
  for(const key of keys) {
    const versions=docs[key];
    if(!versions?.length || (key==='PEN:451.5'? !same(versions.map(v=>v.versionId).sort(),[operativeVersionId,'id_da957e9d-8257-11ee-bcfe-9f16e66157a6'].sort()) : versions.length!==1))throw new Error('Publication needs explicit version resolution');
    for(const v of versions) {
      const u=new URL(v.sourceUrl);
      if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.origin!=='https://leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key||v.activeFlag!=='Y')throw new Error('Unbound publication source');
    }
    if(acquisition.promotedResearchKeys.includes(key)&&!same(versions,research[key]))throw new Error('Promoted research source changed');
  }
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==22||new Set(ids).size!==22||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
  for(const r of review.records) {
    const a=definitions.find(a=>a.id===r.id)!;
    if(r.definitionSha256!==hash(a)||r.primaryKey!==primary(a)||a.translationStatus!=='english_only_pending_translation')throw new Error('Definition changed without review');
    const keys=[...new Set([primary(a),...a.supportingKeys])].sort();
    if(!same(r.sources.map(s=>s.key),keys)||!same(Object.keys(a.sourceEffectiveDates).sort(),keys))throw new Error('Incomplete reviewed sources');
    for(const s of r.sources)if(!same(s.versions,docs[s.key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256})))||(a.sourceEffectiveDates as Record<string,string|null>)[s.key] !== (docs[s.key][0].effectiveDate?.slice(0,10)??null))throw new Error('Source binding changed');
    const e=r.primaryEvidence,v=docs[r.primaryKey].find(v=>v.versionId===e.versionId);
    if(!v || (r.primaryKey==='PEN:451.5'&&v.versionId!==operativeVersionId))throw new Error('Wrong operative version');
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
  if(!transitions.some(t=>t.key==='PEN:451.5'&&t.reviewBefore==='2029-01-01'))throw new Error('Missing arson transition gate');
  if(!same(review,buildPropertyArsonReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderPropertyArsonReview(review=readPropertyArsonReview()) {
  const c=validatePropertyArsonReview(review);
  return ['# California property, arson and extortion: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. ${c.promotedResearchSections} newly monitored sources reuse the research packet. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: PEN ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildPropertyArsonReview();validatePropertyArsonReview(review);
  fs.writeFileSync(new URL('../output/california-property-arson-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-property-arson-review.md',import.meta.url),renderPropertyArsonReview(review));
  console.log(JSON.stringify(validatePropertyArsonReview(review)));
}
