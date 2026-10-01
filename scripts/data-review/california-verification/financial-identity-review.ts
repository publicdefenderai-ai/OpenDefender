import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-financial-identity-additions.json";
import acquisitionData from "../output/california-financial-identity-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-benchmark-reconciliation.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {repeatTheftAssemblyDocuments} from "./repeat-theft-assembly-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readFinancialIdentityReviewAcquisition=()=>structuredClone(acquisitionData);
export function financialIdentityDocuments(acquisition=readFinancialIdentityReviewAcquisition()) {
  const docs=repeatTheftAssemblyDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const replacedFindingIds=['financial-existing-branch-comparisons'];
const remainingFindings=[
 {id:'financial-remaining-forgery-and-bad-check-branches',status:'substantive_research_open',keys:['PEN:470','PEN:476','PEN:476a'],question:'Compare remaining general forgery and insufficient-funds branches without conflating them with the reviewed fictitious-instrument choice.',treatment:'Preserve existing bounded choices; the current financial batch does not close this broader family.'},
 {id:'access-card-multiple-person-branch',status:'substantive_research_open',keys:['PEN:484e','PEN:490.2'],question:'Resolve the separate four-person, twelve-month acquisition branch in section 484e(b), including its valuation and grading.',treatment:'Do not infer completion from publication of subdivisions (a), (c) and (d).'},
 {id:'identity-information-fine-ceilings',status:'fine_ceiling_unresolved',keys:['PEN:530.5','PEN:19','PEN:672'],question:'Determine fine ceilings where the identity-information statute expressly permits a fine but states no amount.',treatment:'Published custody and classification are bounded; do not automatically apply section 672, which is limited to crimes without a prescribed fine.'},
];
export function buildFinancialIdentityReview() {
  const docs=financialIdentityDocuments(),a=readFinancialIdentityReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_financial_identity_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-three financial and identity choices; not full family or statewide completeness.',
      'Employee grand theft is bounded above $950; exactly $950 is not treated as ordinary grand theft.',
      'Access-card valuation concerns the card or information, not automatically subsequent spending.',
      'Identity-information fine ceilings remain unresolved and explicit. Fine-only classification does not create a neighboring jail alternative.',
      'Prior findings and all 117 earlier bounded benchmark matches remain accounted for.',
      'English-only notices and the existing freshness deadline remain unchanged.'],
    sourceAnomalies:[],
    interpretationAuthorities:[
      {name:'People v. Romanowski (2017) 2 Cal.5th 903',url:'https://law.justia.com/cases/california/supreme-court/2017/s231405.html',scope:'Section 490.2 applies to theft of access-card information; valuation is of the stolen information.'},
      {name:'People v. Liu (2019) 8 Cal.5th 253',url:'https://law.justia.com/cases/california/supreme-court/2019/s248130.html',scope:'Later spending is not automatically the value or valuation floor for stolen account information.'},
      {name:'People v. Harrell (2020) 53 Cal.App.5th 256',url:'https://law.justia.com/cases/california/court-of-appeal/2020/a156017.html',scope:'Fraudulent identity-information possession under section 530.5(c)(2) is distinct from theft qualifying for Proposition 47 reduction.'}
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
      'Display names describe operative statutory conduct and preserve exact subdivision identities. No new short statutory title is invented as an official quotation.',
      '368(d)/(e) choices distinguish caretaker status, noncaretaker knowledge and the two value branches. Exactly $950 stays in the lower branch. Underlying offense elements are still required.',
      '487(b)(3) says $950 or more while 490.2 ordinarily reduces theft not exceeding $950. Publish only the above-$950 employee grand-theft branch here, preserving the literal text and statutory interaction.',
      'Retained CALCRIM 1950 and 1952 include the access-card valuation inquiry. Romanowski and Liu distinguish value of the stolen information from later purchases; no account-balance or spending shortcut is used.',
      '530 is bounded to ordinary non-firearm property. Its larceny dependency does not make every false name or impersonation a section 530 offense.',
      '530.5(c)(2)/(3) and (d)(1) preserve misdemeanor and felony alternatives. Subdivision (d)(2) has a fine alternative but no express one-year jail alternative; section 17(b) can classify a fine-only judgment as misdemeanor. Its actual knowledge is not replaced by intent to defraud.',
      '530.5 fine amounts remain open because the statute already authorizes a fine. No default 672 ceiling is synthesized.',
      '550(a)(2)-(5) retain felony punishment and the fine conjunctive. Health-care paragraphs (6)-(9) retain their separate $950 threshold, twelve-month aggregation and misdemeanor alternatives. Subdivision (b) has its own felony/misdemeanor alternatives.',
      '550 restitution, specified recidivism, collision injury and designated auto-fraud-area provisions remain visible as case-specific consequences outside base ranges. This is not an enhancement catalog.',
      'The successor consumes the reconciled crosswalk, preserving all recovered matches and replacing the broad financial finding only with explicit narrower gaps. No family is silently declared complete.'
]};
}
export const readFinancialIdentityReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-financial-identity-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildFinancialIdentityReview>;
export function validateFinancialIdentityReview(review=readFinancialIdentityReview(),definitions=additions,acquisition=readFinancialIdentityReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=financialIdentityDocuments(acquisition);
  if(review.scope!=='bounded_financial_identity_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(!same(review,buildFinancialIdentityReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderFinancialIdentityReview(review=readFinancialIdentityReview()) {
  const c=validateFinancialIdentityReview(review);
  return ['# California financial and identity offenses: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. The research packet supplies ${c.promotedResearchSections} of the newly monitored sections. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildFinancialIdentityReview();validateFinancialIdentityReview(review);
  fs.writeFileSync(new URL('../output/california-financial-identity-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-financial-identity-review.md',import.meta.url),renderFinancialIdentityReview(review));
  console.log(JSON.stringify(validateFinancialIdentityReview(review)));
}
