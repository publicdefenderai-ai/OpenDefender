/** Neutral catalog accounting. No attorney questions or deliberative legal advice. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import plan from './major-omission-plan.json';
import dispositions from './major-omission-dispositions.json';
import benchmark from '../output/california-major-omission-benchmark.json';
import priorBenchmark from '../output/california-people-weapons-benchmark-source.json';
import prior from '../output/california-weapons-eligibility-review.json';
import snapshot from '../output/california-major-omission-catalog-snapshot.json';
import discovery from '../output/california-statewide/summary.json';

const root='scripts/data-review/';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const plain=(s:string)=>s.replace(/[\u2013\u2014]/g,':').replace(/\s+/g,' ').trim();
const range=(a:number,b:number)=>Array.from({length:b-a+1},(_,i)=>a+i);
function exactIds(actual:string[],expected:string[],label:string){
 if(new Set(actual).size!==actual.length||!same([...actual].sort(),[...expected].sort()))throw new Error(label+' inventory mismatch');
}
export function validateMajorBenchmark(b=structuredClone(benchmark)){
 if(b.planSha256!==hash(fs.readFileSync(root+'california-verification/major-omission-plan.json'))||!same(b.receipt,priorBenchmark.receipt))throw new Error('Benchmark provenance mismatch');
 if(b.scope!==plan.scope)throw new Error('Benchmark scope mismatch');
 if(!same(b.pages.map(p=>p.page),plan.families.flatMap(f=>range(f.firstPage,f.lastPage)))||!same(b.contentsPages.map(p=>p.page),plan.families.flatMap(f=>range(f.tocFirstPage,f.tocLastPage))))throw new Error('Benchmark page inventory mismatch');
 if(!same(b.comparisonContentsPages.map(p=>p.page),plan.comparisonContentsPages))throw new Error('Comparison contents inventory mismatch');
 for(const p of [...b.pages,...b.contentsPages,...b.comparisonContentsPages])if(hash(p.text)!==p.sha256)throw new Error('Benchmark text hash mismatch');
 exactIds(b.instructions.map(r=>r.id),plan.instructions.map(r=>r.id),'Instruction');
 for(const family of plan.families){
  const rows=b.instructions.filter(r=>r.family===family.id);
  const toc=b.contentsPages.filter(p=>p.page>=family.tocFirstPage&&p.page<=family.tocLastPage).map(p=>p.text).join('\n');
  const ids=[...toc.matchAll(/^(\d{3,4}[A-Z]?)\.\s+([^\n]+)/gm)].filter(m=>!m[2].startsWith('Reserved for Future Use')).map(m=>m[1]);
  if(!same(ids,family.instructionIds)||!same(rows.map(r=>r.id),ids))throw new Error('Chapter contents mismatch');
  rows.forEach((r,i)=>{
   const expected=plan.instructions.find(p=>p.id===r.id)!;
   if(r.heading!==expected.heading||r.firstPage!==expected.firstPage||r.lastPage!==(rows[i+1]?.firstPage??family.lastPage+1)-1)throw new Error('Instruction boundary mismatch');
   if(!same(r.pageHashes,b.pages.filter(p=>p.page>=r.firstPage&&p.page<=r.lastPage).map(p=>({page:p.page,sha256:p.sha256}))))throw new Error('Instruction evidence mismatch');
  });
 }
 return b;
}
function readDiscovery(name:string){
 const data=fs.readFileSync(root+'output/california-statewide/'+name);
 if(hash(data)!==discovery.artifacts.find(a=>a.file===name)?.sha256)throw new Error('Discovery hash mismatch');
 return gunzipSync(data).toString('utf8').trim().split('\n').map(line=>JSON.parse(line)) as Array<{key:string;[key:string]:unknown}>;
}
export function buildMajorOmissionAudit(config=dispositions){
 const b=validateMajorBenchmark();
 const priorOpen=prior.crosswalk.filter(r=>!r.boundedChargeIds.length&&r.status!=='context_defense_or_allegation');
 exactIds(config.benchmarkDispositions.map(r=>r.instructionId),b.instructions.map(r=>r.id),'Disposition');
 exactIds(config.peopleWeaponsDispositions.map(r=>r.instructionId),priorOpen.map(r=>r.id),'People/weapons');
 exactIds(config.otherCodeProbes.map(r=>r.key),dispositions.otherCodeProbes.map(r=>r.key),'Other-code');
 const statuses=new Set(['existing_choice_partial','existing_offense_theory_partial','unpublished_priority','allegation_or_sentencing_open','context_defense_or_procedure','existing_hold_preserved','weapon_specific_template_open','existing_choice_missing_sibling','existing_choice_requires_conduct_comparison']);
 for(const row of [...config.benchmarkDispositions,...config.peopleWeaponsDispositions,...config.otherCodeProbes]){
  if(!statuses.has(row.status))throw new Error('Unknown coverage disposition');
  if(row.status.startsWith('existing_choice')&&!row.chargeIds.length)throw new Error('Existing coverage requires an identity');
  if(row.status==='unpublished_priority'&&row.chargeIds.length)throw new Error('Unpublished row cannot claim a choice');
  for(const id of row.chargeIds)if(!snapshot.records.find(c=>c.canonicalId===id)?.selectable)throw new Error('Unknown or withheld catalog identity');
 }
 if(snapshot.configuredChoices!==snapshot.records.filter(r=>r.selectable).length)throw new Error('Catalog snapshot count mismatch');
 const accounting=readDiscovery('section-accounting.jsonl.gz'),versions=readDiscovery('source-versions.jsonl.gz');
 const otherCodeProbes=config.otherCodeProbes.map(r=>{
  const accounts=accounting.filter(a=>a.key===r.key),sourceVersions=versions.filter(v=>v.key===r.key);
  if(accounts.length!==1||!sourceVersions.length)throw new Error('Missing discovery evidence: '+r.key);
  const [lawCode,section]=r.key.split(':');
  const ids=snapshot.records.filter(c=>c.selectable&&c.lawCode===lawCode&&c.code.split('(')[0]===section).map(c=>c.canonicalId);
  if(!same(ids,r.chargeIds))throw new Error('Other-code catalog association mismatch');
  return {...r,accounting:accounts[0],versions:sourceVersions};
 });
 const benchmarkRows=config.benchmarkDispositions.map(r=>({...b.instructions.find(i=>i.id===r.instructionId)!,...r}));
 const peopleWeaponsRows=config.peopleWeaponsDispositions.map(r=>{
  const old=priorOpen.find(i=>i.id===r.instructionId)!;
  return {...r,heading:old.heading,sourceKeys:old.sourceKeys,previousStatus:old.status,pageHashes:old.pageHashes};
 });
 const counts=(rows:Array<{status:string}>)=>Object.fromEntries([...new Set(rows.map(r=>r.status))].sort().map(s=>[s,rows.filter(r=>r.status===s).length]));
 return {schemaVersion:1,scope:config.scope,catalogCommit:snapshot.catalogCommit,
  bindings:{benchmarkSha256:hash(b),planSha256:b.planSha256,dispositionsSha256:hash(config),catalogSnapshotSha256:hash(snapshot),priorPeopleWeaponsSha256:hash(prior),discoverySummarySha256:hash(discovery)},
  counts:{configuredChoicesSnapshot:snapshot.configuredChoices,newChoices:0,benchmarkInstructions:benchmarkRows.length,benchmark:counts(benchmarkRows),peopleWeaponsRechecked:peopleWeaponsRows.length,peopleWeapons:counts(peopleWeaponsRows),otherCodeProbes:otherCodeProbes.length,otherCodes:counts(otherCodeProbes)},
  limits:config.limits,
  benchmarkEdition:b.receipt.edition,
  sourceInventoryNote:'Use the chapter contents for this frozen edition. General contents page 35 omits instruction 526, which chapter contents page 291 and body page 349 include. Reserved instruction 762 is not counted.',
  benchmarkRows,peopleWeaponsRows,otherCodeProbes,
  nextBatch:['Review unpublished gang participation, attempted voluntary manslaughter, assault under color of authority, protected-victim battery, and remaining carrying/knife/weapon branches together where sources overlap.','Review the identified other-code candidates in one shared-source acquisition/publication group; do not assign punishments from discovery snippets.','Maintain separate allegation/sentencing coverage accounting and existing holds. No automatic promotion of context entries into charges.'],
 };
}
export type MajorAudit=ReturnType<typeof buildMajorOmissionAudit>;
export const readMajorOmissionAudit=()=>JSON.parse(fs.readFileSync(root+'output/california-major-omission-audit.json','utf8')) as MajorAudit;
export function validateMajorOmissionAudit(packet=readMajorOmissionAudit()){
 if(!same(packet,buildMajorOmissionAudit()))throw new Error('Major omission audit drift');
 return packet.counts;
}
export function renderMajorOmissionAudit(packet=readMajorOmissionAudit()){
 validateMajorOmissionAudit(packet);
 return ['# California major-omission audit','',...packet.limits.map(s=>'- '+s),'',`Catalog snapshot: ${packet.counts.configuredChoicesSnapshot} configured choices. No new choices.`,`Benchmark: ${packet.counts.benchmarkInstructions} homicide/gang instructions; ${packet.counts.peopleWeaponsRechecked} previously unresolved people/weapons entries rechecked; ${packet.counts.otherCodeProbes} targeted other-code probes.`,'',packet.sourceInventoryNote,'','## Homicide and gangs','',...packet.benchmarkRows.map(r=>`- ${plain(r.heading)}: ${r.status.replaceAll('_',' ')}${r.chargeIds.length?' ('+r.chargeIds.join(', ')+')':''}.`),'','## People/weapons reconciliation','',...packet.peopleWeaponsRows.map(r=>`- ${plain(r.heading)}: ${r.status.replaceAll('_',' ')}${r.chargeIds.length?' ('+r.chargeIds.join(', ')+')':''}.`),'','## Other-code probes','',...packet.otherCodeProbes.map(r=>`- ${r.key}: ${r.label}; ${r.status.replaceAll('_',' ')}.`),'','## Next combined work','',...packet.nextBatch.map(s=>'- '+s),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const p=buildMajorOmissionAudit();
 fs.writeFileSync(root+'output/california-major-omission-audit.json',JSON.stringify(p,null,2)+'\n');
 fs.writeFileSync(root+'output/california-major-omission-audit.md',renderMajorOmissionAudit(p));
 console.log(JSON.stringify(p.counts));
}
