import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-justice-custody-additions.json";
import acquisitionData from "../output/california-justice-custody-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-weapons-eligibility-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {weaponsEligibilityDocuments} from "./weapons-eligibility-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readJusticeCustodyReviewAcquisition=()=>structuredClone(acquisitionData);
export function justiceCustodyDocuments(acquisition=readJusticeCustodyReviewAcquisition()) {
  const docs=weaponsEligibilityDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'custody-capital-and-gassing-branches',status:'substantive_research_open',keys:['PEN:4500','PEN:243.9','PEN:4501.1'],question:'Resolve life-prisoner malice/capital applicability and the county-jail alternatives for gassing before publication.',treatment:'These consequential branches stay outside selection; they are not treated as minor omissions or as lawful conduct.'},
  {id:'custody-controlled-substances',status:'substantive_research_open',keys:['PEN:4573','PEN:4573.6'],question:'Review cannabis exceptions, entry into custody, authorization and controlling interpretations for drug/paraphernalia offenses.',treatment:'Retain source evidence and research leads without publishing an overbroad drug-possession rule.'},
  {id:'justice-sibling-fine-limits',status:'substantive_research_open',keys:['PEN:148','PEN:166','PEN:273.6','PEN:4574','PEN:672'],question:'Does a fine in a neighboring branch displace the section 672 default for each newly published branch that has no express fine?',treatment:'The affected choices explicitly disclose unresolved fine limits; verified custody/classification is retained. No new attorney assignment yet; combine authority research with the existing false-imprisonment issue.'},
  {id:'justice-remaining-branches',status:'substantive_research_open',keys:['PEN:67.5','PEN:68','PEN:86','PEN:93','PEN:76','PEN:404.6','PEN:4532','PEN:4530'],question:'Review remaining official-bribery, public-official threat, riot, alternative-custody and state-prison escape branches and legacy commitment language.',treatment:'These sibling branches remain research items. Bounded instruction matches below never close every statutory branch.'},
];
export function buildJusticeCustodyReview() {
  const docs=justiceCustodyDocuments(),a=readJusticeCustodyReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_justice_custody_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Forty-five exact charged branches across the justice/witness/order and custody/escape queues, not full family or statewide completeness.',
      'A matching instruction does not certify every statutory alternative. Frozen prior catalog associations are kept separate from these newly reviewed bounded matches.',
      'Lawful official performance, valid known orders, precise custody status and statutory exceptions are elements or limits, not facts inferred from a charge.',
      'Adult base ranges do not describe juvenile dispositions. Penalty alternatives, consecutive terms and unresolved fines remain explicit.',
      'English-only additions retain fallback notices. The existing evidence expiry and PEN:30515 hold are unchanged.'],
    sourceAnomalies:[],
    priorLegalReviewSha256:hash(priorLegalReview),
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
      return {...r,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,boundedChargeIds:ids};
    }),
    remainingGroups:previous.groups.map(g=>({...g,status:'bounded_additions_do_not_close_group'})),
    remainingFindings:[...priorLegalReview.remainingFindings,...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    decisions:[
      '136.1(a) expressly requires malice; the (b) choices preserve knowing intent to interfere without silently importing that extra element. The (c) felony aggravators remain a separate choice with exact citation aliases.',
      '137(c) retains its privilege and attorney/family-adviser exceptions; 141 distinguishes private persons, peace officers and prosecutors. Perjury requires material falsity, the applicable oath and delivery conditions, and corroboration review.',
      '69 retains both deterring and resisting routes, lawful performance and the recording exclusion. The 148 weapon branches are not duplicates of the older ordinary resisting-arrest choice; the same-officer restriction and criminal-act exception are retained.',
      '166 criminal contempt is not a generic civil/summary contempt route. 166(c)(2) adds a 48-hour minimum while 273.6(b)/(e) have different minima and judicial-reduction rules. The 166(c)(4) state-prison range is not converted to 1170(h).',
      'Existing 273.6(a) and 1320 own-recognizance choices are preserved rather than duplicated. The new 1320.5 choice requires bail release and intent to evade process; its 14-day inference is permissive.',
      '4532 expressly permits ordinary county jail despite felony wording, so the 17(b) alternative is preserved. The misdemeanor 90-day minimum, probation exceptions, consecutive rules and limited prior-use rule are not lost. Legacy inebriate commitments remain unresolved.',
      '836.6 requires BOTH force or violence AND proximate serious bodily injury for its aggravated range. These choices retain their ordinary misdemeanor path; categorization is not a finding that aggravating facts occurred.',
      '4501 excludes the separate 4500 life-prisoner branch. Custody assaults, battery, hostages and 4502 weapons carry express consecutive terms. 4574 distinguishes entry from confined possession and release/use from ordinary tear-gas entry.',
      'Display titles describe operative statutory conduct when no short statutory title exists. They are not verbatim quotations; common statute aliases remain available for charging-paper lookup.',
      'No inference assigns an unstated fine by analogy to a neighboring subdivision. Unresolved fine exposure is displayed and grouped for further research.',
      'Historical research artifacts and source receipts are not rewritten. Research promotion is checked against retained source identity before adding publication monitoring.',

    ]};
}
export const readJusticeCustodyReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-justice-custody-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildJusticeCustodyReview>;
export function validateJusticeCustodyReview(review=readJusticeCustodyReview(),definitions=additions,acquisition=readJusticeCustodyReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=justiceCustodyDocuments(acquisition);
  if(review.scope!=='bounded_justice_custody_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==45||new Set(ids).size!==45||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildJusticeCustodyReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderJusticeCustodyReview(review=readJusticeCustodyReview()) {
  const c=validateJusticeCustodyReview(review);
  return ['# California witnesses, orders, custody and escape: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. ${c.promotedResearchSections} newly monitored sources reuse the research packet. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: PEN ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildJusticeCustodyReview();validateJusticeCustodyReview(review);
  fs.writeFileSync(new URL('../output/california-justice-custody-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-justice-custody-review.md',import.meta.url),renderJusticeCustodyReview(review));
  console.log(JSON.stringify(validateJusticeCustodyReview(review)));
}
