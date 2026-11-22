import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {build,validatePacket,validateSources} from '../scripts/data-review/new-york-person-order/review.mjs';
import sources from '../scripts/data-review/new-york-person-order/candidate-sources.json';
import packet from '../scripts/data-review/new-york-person-order/candidate-review.json';
import earlier from '../scripts/data-review/new-york-first-pass/candidate-sources.json';
const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
const row=(section:string,scope:string)=>packet.records.find(r=>r.section===section&&r.scope===scope)!;
const conduct=(section:string,scope:string)=>row(section,scope).bindings.find(b=>b.role==='conduct_subdivision')!.text.replace(/\s+/g,' ');
const text=(key:string)=>sources.find(s=>s.sourceKey===key)!.text.replace(/\s+/g,' ');
describe('New York person/order subdivision research',()=>{
 it('replays 11 candidates from five sections, preserving research-only boundaries',()=>{
  expect(build()).toEqual(packet);
  expect(packet.counts).toEqual({primarySections:5,subdivisionMappings:11,retainedSources:20,reusedSources:8,newlyAcquiredSources:12,publishedChoices:0,verifiedLiveChoices:null});
  expect(new Set(packet.records.map(r=>r.section)).size).toBe(5);
  expect(packet.records.every(r=>r.publicationStatus.startsWith('blocked_'))).toBe(true);
  expect(packet.publicationPrerequisites.join(' ')).toContain('all 27 existing reselection holds');
 });
 it('retains the original acquisition metadata for all eight reused documents',()=>{
  const reused=sources.filter(s=>earlier.some(e=>e.sourceKey===s.sourceKey));
  expect(reused).toHaveLength(8);
  for(const source of reused)expect(source).toEqual(earlier.find(e=>e.sourceKey===source.sourceKey));
  expect(sources.every(s=>s.effectiveDateStart===null)).toBe(true);
 });
 it('binds each assault mental state and its own weapon requirement without sibling conduct',()=>{
  expect(row('120.00','1').mentalState).toBe('intentional');
  expect(conduct('120.00','1')).toContain('or to a third person');
  expect(conduct('120.00','1')).not.toContain('recklessly');
  expect(row('120.00','2').mentalState).toBe('reckless');
  expect(conduct('120.00','2')).not.toContain('deadly weapon');
  expect(row('120.00','3').mentalState).toBe('criminal_negligence');
  expect(conduct('120.00','3')).toContain('by means of a deadly weapon or a dangerous instrument');
  expect(text('ny:PEN:10.00')).toContain('impairment of physical condition or substantial pain');
  expect(text('ny:PEN:15.05')).toContain('fails to perceive a substantial and unjustifiable risk');
 });
 it('distinguishes display, repeated conduct and protection-order menacing',()=>{
  expect(conduct('120.14','1')).toContain('what appears to be a pistol');
  expect(conduct('120.14','1')).not.toContain('order of protection');
  expect(conduct('120.14','2')).toContain('course of conduct');
  expect(conduct('120.14','2')).not.toContain('displaying');
  expect(conduct('120.14','3')).toContain('actual knowledge');
  const bindings=row('120.14','3').bindings;
  for(const key of ['ny:PEN:120.15','ny:CPL:530.12','ny:FCT:812','ny:FCT:828','ny:FCT:842'])expect(bindings.some(b=>b.sourceKey===key)).toBe(true);
  expect(text('ny:PEN:120.15')).toContain('by physical menace');
  expect(row('120.14','3').grade).toBe('A misdemeanor'); // Predicate is B; this offense is A.
 });
 it('binds breathing intent separately to both alternatives and preserves the affirmative defense',()=>{
  expect(conduct('121.11','a')).toContain('throat or neck');expect(conduct('121.11','a')).not.toContain('nose');
  expect(conduct('121.11','b')).toContain('nose or mouth');expect(conduct('121.11','b')).not.toContain('throat');
  for(const scope of ['a','b']){
   expect(row('121.11',scope).bindings.find(b=>b.role==='shared_conduct_preamble')!.text.replace(/\s+/g,' ')).toContain('with intent to impede');
   expect(row('121.11',scope).bindings.some(b=>b.sourceKey==='ny:PEN:121.14')).toBe(true);
  }
  expect(text('ny:PEN:121.14')).toContain('affirmative defense');
  expect(text('ny:PEN:25.00')).toContain('preponderance of the evidence');
 });
 it('keeps the two obstruction alternatives distinct and preserves authorized arrest',()=>{
  expect(conduct('195.05','1')).toContain('independently unlawful act');
  expect(conduct('195.05','1')).toContain('whether or not physical force is involved');
  expect(conduct('195.05','1')).not.toContain('padlock');
  expect(conduct('195.05','2')).toContain('public health or safety concern');
  expect(conduct('195.05','2')).toContain('damages or removes any padlock');
  expect(conduct('205.30','whole')).toContain('authorized arrest of himself or another person');
  expect(row('205.30','whole').existingSameSectionIds).toContain('ny-resisting-arrest');
  expect(row('195.05','1').existingSameSectionIds).toEqual([]);
 });
 it('uses Class A sentencing and alternative rather than additive double-gain fines',()=>{
  for(const r of packet.records){
   expect(r.bindings.find(b=>b.role==='grading')!.text.replace(/\s+/g,' ')).toContain('class A misdemeanor');
   expect(r.ordinaryIndividualPenalty).toContain('364 days');expect(r.ordinaryIndividualPenalty).toContain('instead of');
  }
  expect(text('ny:PEN:70.15')).toContain('shall apply to all persons who are sentenced before, on or after');
  expect(text('ny:PEN:80.05')).toContain('shall not apply to a corporation');
 });
 it('rejects evidence, subdivision, dependency, grade, penalty and identity tampering',()=>{
  const body=clone(sources);body[0].text+='x';expect(()=>validateSources(body)).toThrow('integrity');
  const url=clone(sources);url[0].sourceUrl='https://example.org';expect(()=>validateSources(url)).toThrow('identity');
  const date=clone(sources);date[0].effectiveDateStart='2026-01-01' as never;expect(()=>validateSources(date)).toThrow('provenance');
  for(const mutate of [
   (p:typeof packet)=>{p.records[0].bindings[1].start++;},
   (p:typeof packet)=>{p.records[0].bindings[1]=clone(p.records[1].bindings[1]);},
   (p:typeof packet)=>{p.records[0].bindings.pop();},
   (p:typeof packet)=>{p.records[0].grade='B misdemeanor';},
   (p:typeof packet)=>{p.records[0].ordinaryIndividualPenalty='One year';},
   (p:typeof packet)=>{p.records[0].officialTitle='Assault';},
   (p:typeof packet)=>{p.records[0].summary+=' unsupported';},
  ]){const changed=clone(packet);mutate(changed);expect(changed).not.toEqual(packet);expect(()=>validatePacket(changed,sources)).toThrow();}
 });
 it('extends exact official API identity checks to CPL/FCT without seeding',async()=>{
  const {fetchCandidateDocument}=await import('../scripts/data-review/new-york-first-pass/collect-api.mjs');
  for(const key of ['ny:CPL:1.20','ny:FCT:828']){
   const ref=sources.find(s=>s.sourceKey===key)!;const [,lawId,section]=key.split(':');
   const value={success:true,result:{lawId,docLevelId:section,title:ref.officialTitle,text:ref.text}};
   expect((await fetchCandidateDocument(ref,'synthetic',async()=>({ok:true,json:async()=>value}))).sourceKey).toBe(key);
   value.result.lawId='PEN';await expect(fetchCandidateDocument(ref,'synthetic',async()=>({ok:true,json:async()=>value}))).rejects.toThrow('acquisition failed');
  }
  const {collect}=await import('../scripts/data-review/new-york-person-order/collect-api.mjs');
  await expect(collect('/private/tmp/unused-ny-person-order','')).rejects.toThrow('NY_SENATE_API_KEY');
  expect(fs.readFileSync('scripts/data-review/new-york-person-order/collect-api.mjs','utf8')).not.toContain('seedNewYork');
 });
});
