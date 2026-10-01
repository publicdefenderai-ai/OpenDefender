import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-officials-custody-additions.json";
import acquisitionData from "../output/california-officials-custody-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-financial-identity-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {financialIdentityDocuments} from "./financial-identity-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readOfficialsCustodyReviewAcquisition=()=>structuredClone(acquisitionData);
export function officialsCustodyDocuments(acquisition=readOfficialsCustodyReviewAcquisition()) {
  const docs=financialIdentityDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const replacedFindingIds:string[]=[];
const remainingFindings=[
 {id:'life-prisoner-fatal-assault',status:'substantive_research_open',keys:['PEN:4500','PEN:190.3','PEN:190.4'],question:'Review the fatal-assault branch separately, including operative capital-punishment constraints and sentencing dependencies.',treatment:'Only the nonfatal branch is published. Do not apply its nine-year parole restriction to a fatal assault or describe nine years as a release promise.'},
 {id:'courthouse-picketing',status:'deferred_expression_sensitive_misdemeanor',keys:['PEN:169'],question:'Resolve application of this courthouse-picketing misdemeanor with the relevant constitutional and notice constraints before publication.',treatment:'Retain as an explicit gap; do not treat peaceful courthouse protest as automatically criminal or infer repeal.'},
 {id:'legislative-vote-exchange',status:'substantive_research_open',keys:['PEN:86'],question:'Review the separate official-vote-exchange language beyond the bounded bribe-taking route.',treatment:'Do not equate ordinary political agreement with the reviewed corrupt-bribe offense.'},
 {id:'public-official-repeat-threat-fine',status:'fine_ceiling_unresolved',keys:['PEN:76','PEN:672'],question:'Determine the fine authority and ceiling for the prior-conviction branch in section 76(a)(2).',treatment:'Publish supported custody/classification with an explicit fine gap; do not silently carry over the first-conviction fine or apply a generic ceiling.'},
];
export function buildOfficialsCustodyReview() {
  const docs=officialsCustodyDocuments(),a=readOfficialsCustodyReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_officials_custody_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Seventeen official-misconduct, custody, minor-protection and campus choices; not full family or statewide completeness.',
      'The life-prisoner assault choice covers only the nonfatal statutory branch; no release date or capital-sentencing determination is supplied.',
      'Covered status, corrupt or threatening intent, authorization and applicable speech or student exceptions remain essential.',
      'The repeat-threat fine remains an explicit gap. Courthouse picketing and legislative vote exchange remain outside publication.',
      'All 128 previous bounded benchmark matches and prior unresolved findings remain accounted for.',
      'English-only fallback notices and the existing freshness deadline remain unchanged.'],
    sourceAnomalies:[],
    interpretationAuthorities:[
      {name:'People v. Raybon (2021) 11 Cal.5th 1056',url:'https://law.justia.com/cases/california/supreme-court/2021/s256978a.html',scope:'Proposition 64 did not legalize cannabis possession in prison under section 4573.6.'},
      {name:'People v. Low (2010) 49 Cal.4th 372',url:'https://law.justia.com/cases/california/supreme-court/2010/s151961/',scope:'Involuntary transport into custody does not itself defeat knowing introduction of drugs under section 4573; knowledge requirements remain.'}
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
      'Names describe retained conduct, preserve exact subdivisions and are not represented as verbatim statutory short titles.',
      '67.5 preserves petty-theft versus grand-theft grading and corrupt intent. Offering is sufficient; acceptance or completion is not silently required.',
      '68, 86 and 93 retain different minimum and maximum restitution fines, receipt-dependent calculations and ability-to-pay requirements. Sections 68, 88 and 98 supply their distinct office consequences.',
      '76 requires covered status, intent that the communication be taken as a threat, apparent ability and reasonable fear, with the specified official-duty nexus. Political criticism alone is insufficient. The repeat branch requires its prior to be alleged and proved.',
      '4500 is bounded to the statutory nonfatal branch. Express or implied malice is required, not ordinary assault intent. Nine years describes a minimum parole restriction on a life term, not a determinate sentence or guaranteed release.',
      '243.9 and 4501.1 require intentional gassing with actual skin or membrane contact. County-jail alternatives follow sections 17, 18(b) and 18.5; the state-prison felony term under 4501.1 follows 4501.5 consecutively.',
      '4573 and 4573.6 preserve controlled-substance knowledge, usable amount and authorization defenses. Prescription dependencies are retained. Raybon prevents importing outside-prison cannabis legalization; Low does not remove knowledge or authorization requirements.',
      '272(a) preserves underlying dependency/delinquency criteria and the general-intent or criminal-negligence threshold. Its specific five-year probation provision fits the express exception in 1203a(b).',
      '272(b) preserves the 21/under-14 ages, adult-stranger definition, consent-avoidance intent, emergency exception and employment/volunteer exclusions. Its misdemeanor/infraction route uses 19 and 19.8 rather than importing subdivision (a) punishment.',
      '415.5 preserves registered-student and lawful employee-concerted-activity exclusions, constitutional noise/words limits and the distinct prior-conviction jail minimums. The 415 infraction option is not copied into 415.5.',
      'The predecessor crosswalk and unresolved findings carry forward unchanged except for added bounded matches. Deferred courthouse picketing is a gap, not a repeal or constitutional-invalidity determination.'
]};
}
export const readOfficialsCustodyReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-officials-custody-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildOfficialsCustodyReview>;
export function validateOfficialsCustodyReview(review=readOfficialsCustodyReview(),definitions=additions,acquisition=readOfficialsCustodyReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=officialsCustodyDocuments(acquisition);
  if(review.scope!=='bounded_officials_custody_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==17||new Set(ids).size!==17||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildOfficialsCustodyReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderOfficialsCustodyReview(review=readOfficialsCustodyReview()) {
  const c=validateOfficialsCustodyReview(review);
  return ['# California officials, custody, minors and campus offenses: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. The research packet supplies ${c.promotedResearchSections} of the newly monitored sections. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildOfficialsCustodyReview();validateOfficialsCustodyReview(review);
  fs.writeFileSync(new URL('../output/california-officials-custody-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-officials-custody-review.md',import.meta.url),renderOfficialsCustodyReview(review));
  console.log(JSON.stringify(validateOfficialsCustodyReview(review)));
}
