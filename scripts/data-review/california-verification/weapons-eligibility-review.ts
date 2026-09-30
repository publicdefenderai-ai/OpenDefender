import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-weapons-eligibility-additions.json";
import acquisitionData from "../output/california-weapons-eligibility-acquisition.json";
import previous from "../output/california-weapons-threats-review.json";
import {validatePeopleWeaponsPacket} from "./people-weapons-review";
import {weaponsThreatsDocuments} from "./weapons-threats-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readWeaponsEligibilityReviewAcquisition=()=>structuredClone(acquisitionData);
export function weaponsEligibilityDocuments(acquisition=readWeaponsEligibilityReviewAcquisition()) {
  const docs=weaponsThreatsDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'weapons-enforceability-and-remaining-branches',status:'substantive_research_open',keys:['PEN:21310','PEN:21510','PEN:25850','PEN:29800','PEN:30600','PEN:30605','PEN:30615'],question:'Resolve knife, open-carry, addiction-only and remaining assault-weapon branches against current controlling orders and statutory exceptions.',treatment:'These additional branches are not published. Do not infer that the underlying conduct is lawful or that every statutory application is enforceable. The existing PEN:30515 hold remains. The April 15, 2026 Baird order vacated the panel opinion; the January 30 Knife Rights decision resolved a facial challenge on a narrow concealed-carry application, not every knife restriction. Recheck subsequent orders before publication.'},
  {id:'tear-gas-sibling-penalties',status:'substantive_research_open',keys:['PEN:22810','PEN:17'],question:'Resolve the officer-victim (g)(2) prison-or-fine classification and the separate possession, furnishing and device-rule penalties.',treatment:'Only (g)(1) is added. No county-jail alternative is invented for (g)(2), and addiction-only enforceability is not assumed. Combine its fine/classification research with the existing similar classification questions.'},
];
export function buildWeaponsEligibilityReview() {
  const docs=weaponsEligibilityDocuments(),a=readWeaponsEligibilityReviewAcquisition();
  const contextDocs={...validatePeopleWeaponsPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_weapons_eligibility_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-four exact branches, not full weapons-family or statewide completeness.',
      'A prior conviction, warrant, court order or juvenile history does not automatically establish a prohibition. Exact predicates, dates, notice, exceptions and current enforceability require individual review.',
      'Adult sentencing ranges do not describe juvenile dispositions. Juvenile wardship and transfer to adult court remain distinct.',
      'Court references below explain research holds only. They are not a complete docket review or a runtime certificate of constitutional enforceability.',
      'English-only additions retain fallback notices. Comparison preserves the receipt acquisition time and the PEN:30515 hold.'],
    courtResearchReferences:[
      {url:'https://cdn.ca9.uscourts.gov/datastore/opinions/2026/04/15/24-565.pdf',case:'Baird v. Bonta, 24-565',documentDate:'2026-04-15',reviewed:'2026-09-29',locator:'Page 1, order',use:'Panel opinion vacated on rehearing; do not use it as a final blanket open-carry ruling.'},
      {url:'https://cdn.ca9.uscourts.gov/datastore/opinions/2026/01/30/24-5536.pdf',case:'Knife Rights v. Bonta, 24-5536',documentDate:'2026-01-30',reviewed:'2026-09-29',locator:'Opinion, concluding scope of facial challenge',use:'Narrow concealed-carry reasoning does not decide every application. Further branch and docket research remains open.'},
    ],
    sourceAnomalies:previous.sourceAnomalies.filter(()=>false),
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
      return {...r,previousStatus:r.status,status:ids.length?'bounded_publication_match_other_branches_open':r.status,boundedChargeIds:[...r.boundedChargeIds,...ids]};
    }),
    remainingGroups:previous.remainingGroups.map(g=>({...g,addedIds:[...new Set([...g.addedIds,...additions.filter(a=>g.keys.includes(primary(a))).map(a=>a.id)])],status:'bounded_additions_do_not_close_group'})),
    remainingFindings:[...previous.remainingFindings.filter(f=>f.id!=='weapons-predicate-and-enforceability-review'),...remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))}))],
    decisions:[
      '29805(a)(1) requires a listed misdemeanor and a ten-year window; (a)(2) requires knowledge of an outstanding listed warrant, not a conviction. Later branches retain their different conviction-date cutoffs. Subdivision (b) states no ten-year limit.',
      '29805(g) and (h) are misdemeanor-only under the retained text. Do not import the state-prison alternative from earlier subdivisions. Relief under 29855/29860 is conditional and not automatic.',
      '29815 requires an express firearm probation condition and excludes the specified 29800/29805 categories. 29820 requires both its exact predicate and resulting wardship, and applies only before age 30.',
      '29800(b) and 29900(b) address certification and adult-court conviction. Do not convert ordinary juvenile wardship into an adult felony conviction.',
      '29825(a) covers purchase, receipt and attempts with a wobbler penalty. Mere ownership/possession under (b) has a misdemeanor penalty. Orders must be qualifying, operative and known; probation conditions under 1203.097 are retained.',
      '29900 retains the enumerated 29905 prior and minimum six-month probation custody condition, subject to the recorded unusual-case exception. 29850 is not listed as a defense to 29900 or 29825.',
      '29850 applies only to 29800, 29805, 29815 and 29820. Its found/taken firearm, duration, transportation and prior-notice requirements are cumulative; no general safe harbor is inferred.',
      '30305(a) uses the broader 16150(b) ammunition definition, including listed feeding devices; (b) uses 16150(a). Both exclude blanks. The 30305(c) defense has its own limited prohibited-category scope and defendant burden.',
      'The gang-injunction ammunition branch has the default misdemeanor penalty, not the 30305(a) wobbler range. A gang label or association alone does not establish an enforceable individual injunction.',
      '25400 conduct branches are separated while penalty alternatives stay with each branch. The loaded/ammunition and owner-registration conditions in (c)(6) are cumulative. Carrying exceptions and the conditional 25600 justification are retained, not presumed.',
      '22810(g)(1) describes misuse, not mere possession of self-defense spray. The officer-victim sibling and other tear-gas restrictions remain explicit research items.',
      'Statutory display titles describe operative conduct when no short statutory name exists; they are not quotations or findings that a person satisfies a predicate. Common citation aliases remain available.',
      'No old research artifact is rewritten. The cumulative crosswalk records bounded matches, and previously reviewed choices remain subject to their existing runtime gates.',
    ]};
}
export const readWeaponsEligibilityReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-weapons-eligibility-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildWeaponsEligibilityReview>;
export function validateWeaponsEligibilityReview(review=readWeaponsEligibilityReview(),definitions=additions,acquisition=readWeaponsEligibilityReviewAcquisition()) {
  const research=validatePeopleWeaponsPacket(),docs=weaponsEligibilityDocuments(acquisition);
  if(review.scope!=='bounded_weapons_eligibility_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
    for(const instruction of r.instructionEvidence) {
      const previousRow=previous.crosswalk.find(i=>i.id===instruction.id);
      if(!previousRow||!same(instruction,{id:previousRow.id,firstPage:previousRow.firstPage,lastPage:previousRow.lastPage,pageHashes:previousRow.pageHashes})||!previousRow.sourceKeys.includes(primary(a)))throw new Error('Unbound instruction match');
    }
    if(CALIFORNIA_CANONICAL_RECORDS.some(x=>x.selectable&&x.canonicalId!==a.id&&x.code===a.code&&x.lawCode===a.lawCode))throw new Error('Duplicate charged branch');
  }
  if(!same(review,buildWeaponsEligibilityReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id)) && !previous.crosswalk.find(p=>p.id===r.id)?.boundedChargeIds.length).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderWeaponsEligibilityReview(review=readWeaponsEligibilityReview()) {
  const c=validateWeaponsEligibilityReview(review);
  return ['# California firearm eligibility, ammunition and concealed carrying: combined publication batch','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies, ${c.newSections} newly monitored sections including ${c.promotedResearchSections} promoted from research. ${c.newBenchmarkMatches} additional instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Review decisions','',...review.decisions.map(s=>`- ${s}`),'','## Court references for research holds','',...review.courtResearchReferences.map(r=>`- [${r.case}: ${r.documentDate}](${r.url}), ${r.locator}. ${r.use} Reviewed ${r.reviewed}; subsequent docket verification remains open.`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Source discrepancies','',...review.sourceAnomalies.map(a=>`- ${a.id}: ${a.description}`),'','## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Current treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),'## Remaining groups','',...review.remainingGroups.map(g=>`- ${g.name}: ${g.question} Added ${g.addedIds.length} choices; other branches remain open.`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildWeaponsEligibilityReview();validateWeaponsEligibilityReview(review);
  fs.writeFileSync(new URL('../output/california-weapons-eligibility-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-weapons-eligibility-review.md',import.meta.url),renderWeaponsEligibilityReview(review));
  console.log(JSON.stringify(validateWeaponsEligibilityReview(review)));
}
