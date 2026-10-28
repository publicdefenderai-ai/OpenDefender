/** Public source bindings and publication accounting only. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import additions from '../../../shared/california-priority-person-additions.json';
import acquisition from '../output/california-priority-person-acquisition.json';
import previous from '../output/california-major-omission-audit.json';
import homicide from '../output/california-major-omission-benchmark.json';
import people from '../output/california-people-weapons-benchmark-source.json';
import {validateMajorOmissionAudit} from './major-omission-audit';
import {officialsCustodyDocuments} from './officials-custody-review';
import {sourceText} from './person-property-review';
import {getCaliforniaCanonicalRecord} from '../../../shared/california-authority';
import pins from '../../../shared/california-retained-pins.json';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const keys=(a:typeof additions[number])=>[...new Set(['PEN:'+a.code.split('(')[0],...a.supportingKeys])].sort();
export const readPriorityPersonAcquisition=()=>structuredClone(acquisition);
export const priorityPersonDocuments=()=>({...officialsCustodyDocuments(),...acquisition.documents});
const boundaries:Record<string,[string,string|null]>={
 'ca-pen-186-22-a':['(a) A person','(b) (1)'],
 'ca-pen-149':['Every public officer',null],
 'ca-pen-243-b':['(b) When a battery','(c) (1)'],
 'ca-pen-243-c-1':['(c) (1) When a battery','(2) When the battery'],
 'ca-attempted-voluntary-manslaughter':['(a) If the crime attempted','(b) If the crime attempted'],
};
export function buildPriorityPersonReview(){
 validateMajorOmissionAudit();
 const docs=priorityPersonDocuments(),allKeys=[...new Set(additions.flatMap(keys))].sort();
 if(!same(allKeys,acquisition.requiredKeys)||!same([...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort(),allKeys))throw new Error('Acquisition accounting drift');
 const sources=allKeys.map(key=>{
  const versions=docs[key];if(versions?.length!==1||versions[0].activeFlag!=='Y'||!(key in pins))throw new Error('Unmonitored or ambiguous source');
  const v=versions[0],text=sourceText(v.contentXml),u=new URL(v.sourceUrl);
  if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||u.origin!=='https://leginfo.legislature.ca.gov'||`${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key)throw new Error('Source identity/hash mismatch');
  return {key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,start:0,end:text.length,text};
 });
 const instructionIds=[...new Set(additions.flatMap(a=>a.calcrim))].sort();
 const instructions=instructionIds.map(id=>{
  const provider=homicide.instructions.some(i=>i.id===id)?homicide:people;
  const i=provider.instructions.find(i=>i.id===id);if(!i)throw new Error('Missing instruction');
  const pages=provider.pages.filter(p=>p.page>=i.firstPage&&p.page<=i.lastPage);
  if(pages.some(p=>hash(p.text)!==p.sha256)||!same(i.pageHashes,pages.map(p=>({page:p.page,sha256:p.sha256}))))throw new Error('Instruction evidence mismatch');
  return {...i,pages};
 });
 return {schemaVersion:1,scope:'bounded_priority_person_publication_not_statewide_completeness',archiveSha256:acquisition.archive.sha256,sourceAsOf:'2026-09-24',previousAuditSha256:hash(previous),acquisitionSha256:hash(acquisition),sources,instructions,
  records:additions.map(a=>{
   const source=sources.find(s=>s.key==='PEN:'+a.code.split('(')[0])!;
   const [begin,finish]=boundaries[a.id],start=source.text.indexOf(begin),end=finish?source.text.indexOf(finish,start+begin.length):source.text.length;
   if(start<0||end<=start)throw new Error('Missing primary subdivision');
   return {id:a.id,definitionSha256:hash(a),sourceKeys:keys(a),primarySpan:{key:source.key,start,end,text:source.text.slice(start,end)},instructionIds:a.calcrim};
  }),
  benchmarkRows:previous.benchmarkRows.map(r=>{const ids=additions.filter(a=>a.calcrim.includes(r.instructionId)).map(a=>a.id);return {...r,...(ids.length?{status:'bounded_publication_match_other_branches_open',chargeIds:ids}:{})};}),
  peopleWeaponsRows:previous.peopleWeaponsRows.map(r=>{const ids=additions.filter(a=>a.calcrim.includes(r.instructionId)).map(a=>a.id);return {...r,...(ids.length?{status:'bounded_publication_match_other_branches_open',chargeIds:ids}:{})};}),
  otherCodeProbes:previous.otherCodeProbes,
  limits:['Five separate charge identities; shared statutes and instruction pages are stored once. No statewide completeness claim.',
   'Attempted voluntary manslaughter retains both alternative mitigating theories and the intent-to-kill requirement. The numerical base fine remains unspecified.',
   'Section 243(c)(1) does not inherit the broader protected-victim list or the peace-officer fine from neighboring provisions.',
   'Gang participation is not mere association and is not a substitute for a separately charged gang enhancement.',
   'Existing vehicle decisions, source holds, and weapon-specific exceptions/enforceability review remain outside this publication. No attorney questions or deliberations are included.',
   'One previously retained research section is promoted into monitoring. The comparison uses the authentic existing candidate archive; receipt issuance and expiry are not extended.'],
 };
}
export type PriorityPersonReview=ReturnType<typeof buildPriorityPersonReview>;
export const readPriorityPersonReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-priority-person-review.json',import.meta.url),'utf8')) as PriorityPersonReview;
export function validatePriorityPersonReview(packet=readPriorityPersonReview()){
 if(!same(packet,buildPriorityPersonReview()))throw new Error('Priority person review drift');
 const docs=priorityPersonDocuments();
 for(const a of additions){
  const c=getCaliforniaCanonicalRecord(a.id);
  if(!c?.selectable||c.code!==a.code||c.penalty!==a.penalty||c.officialTitle!==a.title||!same(c.categories,a.categories))throw new Error('Runtime publication drift');
  const runtimeKeys=c.sources.filter(s=>s.kind!=='jury-instruction').map(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`;}).sort();
  if(!same([...new Set(runtimeKeys)],keys(a))||!same(Object.keys(a.sourceEffectiveDates).sort(),keys(a)))throw new Error('Dependency drift');
  for(const key of keys(a))if((a.sourceEffectiveDates as Record<string,string|null>)[key]!==docs[key][0].effectiveDate?.slice(0,10)&&!((a.sourceEffectiveDates as Record<string,string|null>)[key]===null&&!docs[key][0].effectiveDate))throw new Error('Effective date drift');
 }
 return {additions:additions.length,primarySections:5,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0)};
}
export function renderPriorityPersonReview(packet=readPriorityPersonReview()){
 const c=validatePriorityPersonReview(packet);
 return ['# California priority person offenses','',`${c.additions} new choices, ${c.reusedSections} reused sections, ${c.newSections} newly monitored section. No receipt extension.`,'',...packet.limits.map(s=>'- '+s),'',...additions.flatMap(a=>[`## ${a.code}: ${a.title}`,'',a.summary,'',a.penalty,'',`[Official primary section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${a.code.split('(')[0]}.)`,''])].join('\n').replace(/[\u2013\u2014]/g,':');
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const p=buildPriorityPersonReview();validatePriorityPersonReview(p);
 fs.writeFileSync(new URL('../output/california-priority-person-review.json',import.meta.url),JSON.stringify(p,null,2)+'\n');
 fs.writeFileSync(new URL('../output/california-priority-person-review.md',import.meta.url),renderPriorityPersonReview(p));
 console.log(JSON.stringify(validatePriorityPersonReview(p)));
}
