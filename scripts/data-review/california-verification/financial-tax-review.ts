import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-financial-tax-additions.json";
import acquisitionData from "../output/california-financial-tax-acquisition.json";
import previous from "../output/california-justice-property-review.json";
import priorLegalReview from "../output/california-property-arson-review.json";
import {validateJusticePropertyPacket} from "./justice-property-review";
import {propertyArsonDocuments} from "./property-arson-review";
import {sourceText} from "./person-property-review";
import {getCaliforniaCanonicalRecord,CALIFORNIA_CANONICAL_RECORDS} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readFinancialTaxReviewAcquisition=()=>structuredClone(acquisitionData);
export function financialTaxDocuments(acquisition=readFinancialTaxReviewAcquisition()) {
  const docs=propertyArsonDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error('Publication acquisition shadows existing source');
    docs[key]=versions;
  }
  return docs;
}

const remainingFindings=[
  {id:'financial-existing-branch-comparisons',status:'substantive_research_open',keys:['PEN:530','PEN:470','PEN:476','PEN:550'],question:'Complete the larceny-linked false-personation penalty and remaining forgery, insurance and other financial branch comparisons.',treatment:'Source-key overlap is not a completeness decision. Exact prior publication choices remain; unresolved siblings are not automatically minor.'},
  {id:'property-repeat-theft-and-vehicle-taking',status:'substantive_research_open',keys:['PEN:666','PEN:666.1','VEH:10851'],question:'Resolve repeat-theft and vehicle-taking/value branches alongside prior-custody and conviction conditions.',treatment:'Consequential property gaps carried forward; these are not resolved by the financial/tax publication.'},
  {id:'financial-tax-additional-code-offenses',status:'substantive_research_open',keys:['RTC:19701.5','RTC:19718','RTC:19719'],question:'Review adjacent tax offenses, unauthorized spouse signatures and disclosure/record duties after the priority instruction-linked pass.',treatment:'This is a bounded income/franchise-tax publication, not all California taxes, federal tax law or every adjacent statutory offense.'},
];
export function buildFinancialTaxReview() {
  const docs=financialTaxDocuments(),a=readFinancialTaxReviewAcquisition();
  const contextDocs={...validateJusticePropertyPacket(),...docs};
  const binding=(key:string)=>({key,versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}))});
  return {schemaVersion:1,scope:'bounded_financial_tax_publication_not_family_completeness',sourceAsOf:'2026-09-24',archiveSha256:a.archive.sha256,acquisitionSha256:hash(a),previousReviewSha256:hash(previous),
    limits:['Twenty-eight choices in a combined financial/public-money/tax group, not full family or statewide completeness.',
      'The personal income/corporation tax provisions do not establish federal or sales-tax offenses. Law-code identity stays explicit.',
      'Tax willfulness means intentional violation of a known legal duty; ordinary mistake is not silently elevated to willful evasion.',
      'Express fine-or-imprisonment alternatives are read with PEN 18(b)/17(b), not treated as an invariably felony disposition.',
      'Adult individual penalties, distinct corporate fine caps, investigation costs and the 364-day misdemeanor ceiling are kept separate.',
      'English-only additions retain fallback notices. Current acquisition and expiry dates are unchanged.'],
    sourceAnomalies:[],
    interpretationAuthorities:[
      {name:'Stark v. Superior Court (2011) 52 Cal.4th 368',url:'https://law.justia.com/cases/california/supreme-court/2011/s145337/',instructionIds:['2765'],scope:'Knowledge or criminal negligence for the specified public-money routes; linked by the retained instruction.'},
      {name:'People v. Hagen (1998) 19 Cal.4th 652',url:'https://law.justia.com/cases/california/supreme-court/4th/19/652.html',instructionIds:['2801','2811','2812','2825','2826','2828'],scope:'Tax willfulness and known legal duty as incorporated in the retained instructions; not a new litigation-currentness receipt.'},
      {name:'People v. Singer (1980) 115 Cal.App.3d Supp. 7',url:'https://law.justia.com/cases/california/court-of-appeal/3d/115/supp7.html',instructionIds:['2828'],scope:'Willfulness for former section 19409, applied to current 19709 by retained CALCRIM 2828; not a claim that the 1980 opinion cites the current number.'},
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
    remainingFindings:remainingFindings.map(f=>({...f,sources:f.keys.flatMap(key=>contextDocs[key].map(v=>({key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,text:sourceText(v.contentXml)})))})),
    decisions:[
      'Display titles describe source conduct when no short statutory title exists. Exact subdivisions and common citation aliases are retained.',
      '115 requires a legally recordable kind of instrument and knowing falsity; procurement/offering does not require actual successful recording or an added intent-to-defraud element. The 18(a) state-prison default is not silently converted to 1170(h).',
      '548 excludes fire from casualty and prescribes imprisonment AND a fine; specified prior convictions add separate alleged/proved terms.',
      '532a(1)-(3) retain their different making, obtaining and reaffirming acts. The false-identity sentence of (4) is a separate choice with distinct $5,000 and $2,500 fine alternatives, not a second copy of the ordinary penalty sentence.',
      '529 retains an additional act after personation and the special intent for instruments in (a)(2). Mere false-name reporting does not automatically establish this offense.',
      '424(a)(1),(2),(5),(6),(7) use the knowledge/criminal-negligence rule in retained CALCRIM 2765 and Stark v. Superior Court; (3)/(4) retain their distinct knowledge/fraud requirements. Ordinary negligence and lawful incidental use are not swept in.',
      '19701(a) keeps the $15,000 delinquency threshold and follows retained CALCRIM 2800/2810 on two-year repetition for both routes and knowing falsity for false filings. The mental-incapacity exception and nonconclusive evidentiary presumptions remain explicit. Separate recoverable penalties are not collapsed into the criminal fine.',
      '19706 requires both willfulness and intent to evade; 19705(a)(1) instead requires a materially false declaration under penalty of perjury. Retained CALCRIM 2811/2812 distinguish these elements using People v. Hagen.',
      '19705/19708 expressly authorize a fine OR imprisonment; PEN 18(b) supplies the county-jail alternative and PEN 17(b) the misdemeanor route. This is not inferred from the generic additional fine under 672. Their 1170(h) route differs from the state-prison route in 19706.',
      'The $200,000 corporate ceiling in 19705(b) is disclosed without assigning an individual a corporate punishment. Other tax and investigation liabilities remain additional.',
      '19709 says with or without intent to evade, but retained CALCRIM 2828 and People v. Singer require a willful violation of a known duty. That distinction is retained rather than treating an inadvertent withholding error as criminal.',
      'Instruction matches are cumulative and bounded. All prior justice/custody and property/arson matches stay intact. No source snapshot or expiration is renewed by this publication.',

    ]};
}
export const readFinancialTaxReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-financial-tax-review.json',import.meta.url),'utf8')) as ReturnType<typeof buildFinancialTaxReview>;
export function validateFinancialTaxReview(review=readFinancialTaxReview(),definitions=additions,acquisition=readFinancialTaxReviewAcquisition()) {
  const research=validateJusticePropertyPacket(),docs=financialTaxDocuments(acquisition);
  if(review.scope!=='bounded_financial_tax_publication_not_family_completeness'||review.sourceAsOf!=='2026-09-24'||review.archiveSha256!==acquisition.archive.sha256||review.archiveSha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||review.acquisitionSha256!==hash(acquisition)||review.previousReviewSha256!==hash(previous))throw new Error('Publication provenance changed');
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
  if(ids.length!==28||new Set(ids).size!==28||!same(ids,review.records.map(r=>r.id).sort()))throw new Error('Publication identity accounting changed');
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
  if(!same(review,buildFinancialTaxReview()))throw new Error('Publication accounting or limits changed');
  return {additions:ids.length,primarySections:new Set(definitions.map(primary)).size,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),promotedResearchSections:acquisition.promotedResearchKeys.length,newBenchmarkMatches:review.crosswalk.filter(r=>definitions.some(a=>a.calcrim.includes(r.id))).length,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderFinancialTaxReview(review=readFinancialTaxReview()) {
  const c=validateFinancialTaxReview(review);
  return ['# California financial, public-money and tax offenses: combined publication','',`${c.additions} proposed choices from ${c.primarySections} primary sections; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. ${c.promotedResearchSections} newly monitored sources reuse the research packet. ${c.newBenchmarkMatches} instruction entries receive bounded matches.`,'',...review.limits.map(s=>`- ${s}`),'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Interpretation authorities','',...review.interpretationAuthorities.map(a=>`- [${a.name}](${a.url}): ${a.scope}`),'','## Proposed choices','',...additions.flatMap(a=>[`### ${a.title}: ${a.lawCode} ${a.code}`,'',a.summary,'',a.penalty,'',`Mental state: ${a.mentalState}`,`Dependencies: ${a.supportingKeys.join(', ')}.`,`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(':')[1]}.)`,'']),'## Remaining findings','',...review.remainingFindings.flatMap(f=>[`### ${f.id}`,'',f.question,'',`Treatment: ${f.treatment}`,`Read: ${f.sources.map(s=>`[${s.key}](${s.sourceUrl})`).join(', ')}.`,'']),''].join('\n').trimEnd() + '\n';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildFinancialTaxReview();validateFinancialTaxReview(review);
  fs.writeFileSync(new URL('../output/california-financial-tax-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(new URL('../output/california-financial-tax-review.md',import.meta.url),renderFinancialTaxReview(review));
  console.log(JSON.stringify(validateFinancialTaxReview(review)));
}
