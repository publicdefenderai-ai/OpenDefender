import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import prior from '../output/california-theft-conduct-review.json';
import originalVehicleBatch from '../../../shared/california-repeat-theft-assembly-additions.json';
import {validateTheftConductReview} from './theft-conduct-review';
import {officialsCustodyDocuments} from './officials-custody-review';
import {readJusticePropertyBenchmark} from './justice-property-review';
import {sourceText} from './person-property-review';
import {getCaliforniaCanonicalRecord} from '../../../shared/california-authority';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export function buildVehicleCloseout(){
 validateTheftConductReview();
 const docs=officialsCustodyDocuments(),benchmark=readJusticePropertyBenchmark();
 const existing=originalVehicleBatch.find(r=>r.id==='ca-veh-10851-a')!;
 const instruction=benchmark.instructions.find(r=>r.id==='1820')!;
 const keys=['VEH:10851','PEN:17','PEN:18.5','PEN:490','PEN:490.2','PEN:666.5','PEN:666.1','PEN:1170','PEN:667','PEN:290'];
 return {schemaVersion:1,scope:'vehicle_research_disposition_not_publication_approval',priorReviewSha256:hash(prior),existingDefinitionSha256:hash(existing),existingChargeId:existing.id,
  sources:keys.map(key=>{const versions=docs[key];if(versions?.length!==1)throw new Error('Unresolved retained version');const v=versions[0],text=sourceText(v.contentXml);if(hash(v.contentXml)!==v.contentSha256)throw new Error('Source hash mismatch');return {key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,start:0,end:text.length,text};}),
  instruction:{...instruction,pages:benchmark.pages.filter(p=>p.page>=instruction.firstPage&&p.page<=instruction.lastPage).map(p=>({page:p.page,sha256:hash(p.text),text:p.text}))},
  authorities:[
   {id:'page',name:'People v. Page (2017) 3 Cal.5th 1175',url:'https://law.justia.com/cases/california/supreme-court/2017/s230793.html',scope:'Qualifying low-value vehicle theft under subdivision (a) receives Proposition 47 treatment; posttheft driving is distinct. The opinion is not treated here as a holding on subdivision (b) special vehicles.'},
   {id:'bullard',name:'People v. Bullard (2020) 9 Cal.5th 94',url:'https://law.justia.com/cases/california/supreme-court/2020/s239488.html',scope:'Qualifying low-value temporary taking is not excluded merely because the deprivation was temporary. Posttheft driving after a substantial break remains distinct. Its ordinary subdivision (a) penalty footnote does not expressly decide the maximum after the low-value rule applies.'},
   {id:'lee',name:'People v. Lee (2017) 16 Cal.App.5th 861',url:'https://law.justia.com/cases/california/court-of-appeal/2017/f072173.html',scope:'A qualifying section 666.5 prior does not automatically eliminate the misdemeanor discretion for the underlying wobbler. This does not independently settle special-vehicle subdivision (b) classification.'},
  ],
  settled:['Do not ask the attorney again whether qualifying low-value temporary taking is eligible: Bullard addresses that issue.',
   'Do not treat low value alone as reducing separate posttheft driving after a substantial break.',
   'The emergency-call knowledge and modified-vehicle knowledge/placard predicates, pleading and proof requirements are stated in the statute and CALCRIM 1820.',
   'The existing ordinary taking/posttheft-driving choice remains unchanged. Neither unresolved branch silently inherits its ordinary ranges.'],
  questions:[
   {id:'CA-VEH-01',status:'targeted_attorney_review',title:'Ordinary penalty after low-value vehicle-taking treatment',readKeys:['VEH:10851','PEN:490','PEN:490.2','PEN:18.5'],authorityIds:['page','bullard'],assumptions:'A vehicle worth $950 or less, taken without consent with temporary or permanent deprivation intent; no substantial break/posttheft-driving theory, no special vehicle, no qualifying prior or separate repeat-theft allegation.',question:'For that bounded fact pattern, should the displayed ordinary maximum be section 490 petty theft (six months and $1,000), or the misdemeanor alternative in Vehicle Code 10851(a) (364 days and $5,000)? Please identify which custody and fine provisions govern; if they differ, specify each.',reason:'The decisions establish misdemeanor treatment, but the sources checked do not expressly resolve both numerical maxima for this precise reduced route. The ordinary wobbler footnote is not enough to decide that different issue.',proposal:'The section 490.2 petty-theft wording points toward section 490, but do not publish that inference as settled without resolving the specific section 10851 penalty.',pendingTreatment:'Retain the existing explanation of misdemeanor eligibility, without publishing a new low-value penalty branch.'},
   {id:'CA-VEH-02',status:'targeted_attorney_review',title:'Special-vehicle classification and interaction with low value',readKeys:['VEH:10851','PEN:17','PEN:490.2','PEN:1170'],authorityIds:['page','bullard','lee'],assumptions:'The emergency-call or disability-modified vehicle conditions in 10851(b) are alleged and proved. This is separate from the ordinary 10851(a) choice.',question:'Should subdivision (b) be displayed as felony-only, or does its express fine alternative permit misdemeanor treatment under section 17(b)? Separately, does section 490.2/Bullard reduce a qualifying low-value taking under subdivision (b), or is that special provision outside the reduction? A decision limited to one of these issues is useful; keep the other held if unresolved.',reason:'Subdivision (b) expressly calls the offense a felony and supplies a 2/3/4-year term or a fine up to $10,000. Section 17(b) addresses imprisonment-or-fine alternatives. The reviewed Supreme Court cases concern subdivision (a), and Lee concerns a prior-conviction sentencing rule; none is treated as a direct answer to both special-vehicle issues.',proposal:'Preserve the literal statutory felony language and term in the research record, but withhold a public categorical tier or low-value exception until these interactions are resolved.',pendingTreatment:'Keep the special-vehicle branch outside selectable publication; do not describe it as a minor omission.'},
  ],
  nextWork:'Move to the targeted major-omission audit while these two decisions are pending. Do not keep repeating this vehicle research or treat it as a reason to delay other families.',
  limits:['No new charge, changed penalty, source approval, receipt renewal or attorney decision. Configured choices remain 657.',
   'This packet narrows an existing research finding; it does not claim the cited cases are exhaustive or that the absence of a located decision proves no authority exists.',
   'Earlier claims and review artifacts remain unchanged. Legal judgments requested here are bounded; acquisition, entry and regression checking remain engineering work.'],
 };
}
export type VehicleCloseout=ReturnType<typeof buildVehicleCloseout>;
export const readVehicleCloseout=()=>JSON.parse(fs.readFileSync(new URL('../output/california-vehicle-closeout.json',import.meta.url),'utf8')) as VehicleCloseout;
export function validateVehicleCloseout(packet=readVehicleCloseout()){
 if(!same(packet,buildVehicleCloseout()))throw new Error('Vehicle review evidence or disposition drift');
 const c=getCaliforniaCanonicalRecord(packet.existingChargeId),original=originalVehicleBatch.find(r=>r.id===packet.existingChargeId)!;
 if(!c?.selectable||c.penalty!==original.penalty||c.officialTitle!==original.title)throw new Error('Existing vehicle publication changed');
 if(!same(packet.instruction.pages.map(p=>({page:p.page,sha256:hash(p.text)})),packet.instruction.pageHashes))throw new Error('Unbound instruction pages');
 return {questions:2,newChoices:0,retainedSections:packet.sources.length};
}
export function renderVehicleCloseout(packet=readVehicleCloseout()){
 validateVehicleCloseout(packet);
 return ['# California vehicle taking: two bounded attorney decisions','',...packet.limits.map(x=>`- ${x}`),'','## Already addressed','',...packet.settled.map(x=>`- ${x}`),'','## Questions','',...packet.questions.flatMap(q=>[`### ${q.id}: ${q.title}`,'',`**Assumptions:** ${q.assumptions}`,'',`**Decision needed:** ${q.question}`,'',`**Why:** ${q.reason}`,'',`**Proposed approach:** ${q.proposal}`,'',`**Pending treatment:** ${q.pendingTreatment}`,'','Read:',...q.readKeys.map(key=>{const s=packet.sources.find(s=>s.key===key)!;return `- [${key}](${s.sourceUrl})`;}),...q.authorityIds.map(id=>{const a=packet.authorities.find(a=>a.id===id)!;return `- [${a.name}](${a.url}): ${a.scope}`;}),'']),'## Next work','',packet.nextWork,'','The JSON companion retains the full statutory text, exact versions, hashes and CALCRIM 1820 pages.',''].join('\n').replace(/[\u2013\u2014]/g,':').trimEnd()+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const p=buildVehicleCloseout();validateVehicleCloseout(p);
 fs.writeFileSync(new URL('../output/california-vehicle-closeout.json',import.meta.url),JSON.stringify(p,null,2)+'\n');
 fs.writeFileSync(new URL('../output/california-vehicle-closeout.md',import.meta.url),renderVehicleCloseout(p));
 console.log(JSON.stringify(validateVehicleCloseout(p)));
}
