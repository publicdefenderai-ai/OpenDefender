import {describe,it,expect} from 'vitest';
import {build,validatePacket,validateSources} from '../scripts/data-review/new-york-burglary-robbery/review.mjs';
import packet from '../scripts/data-review/new-york-burglary-robbery/candidate-review.json';
import sources from '../scripts/data-review/new-york-burglary-robbery/candidate-sources.json';
import earlier from '../scripts/data-review/new-york-first-pass/candidate-sources.json';
const copy=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
const row=(section:string,scope:string)=>packet.records.find(r=>r.section===section&&r.scope===scope)!;
const evidence=(section:string,scope:string,role='conduct_subdivision')=>{
 const binding=row(section,scope).bindings.find(b=>b.role===role)!;
 const source=sources.find(s=>s.sourceKey===binding.sourceKey)!;
 return source.text.slice(binding.start,binding.end).replace(/\s+/g,' ');
};
const sourceText=(section:string)=>sources.find(s=>s.sourceKey===`ny:PEN:${section}`)!.text.replace(/\s+/g,' ');
describe('New York burglary/robbery candidate research',()=>{
 it('replays nineteen exact alternatives without a publication claim',()=>{
  expect(build()).toEqual(packet);
  expect(packet.counts).toEqual({primarySections:6,subdivisionMappings:19,retainedSources:22,reusedSources:10,newlyAcquiredSources:12,publishedChoices:0,verifiedLiveChoices:null});
  expect(packet.records.filter(r=>r.section.startsWith('140.'))).toHaveLength(10);
  expect(packet.records.filter(r=>r.section.startsWith('160.'))).toHaveLength(9);
  expect(packet.records.every(r=>r.publicationStatus.startsWith('blocked_'))).toBe(true);
 });
 it('independently reslices every binding and preserves the ten reused acquisitions',()=>{
  for(const record of packet.records)for(const binding of record.bindings){
   const source=sources.find(s=>s.sourceKey===binding.sourceKey)!;
   expect(source.contentSha256).toBe(binding.contentSha256);
   expect(binding.start).toBeGreaterThanOrEqual(0);expect(binding.end).toBeGreaterThan(binding.start);expect(binding.end).toBeLessThanOrEqual(source.text.length);
   if('text' in binding)expect(source.text.slice(binding.start,binding.end)).toBe(binding.text);
  }
  const reused=sources.filter(s=>earlier.some(old=>old.sourceKey===s.sourceKey));expect(reused).toHaveLength(10);
  for(const source of reused)expect(source).toEqual(earlier.find(old=>old.sourceKey===source.sourceKey));
  expect(sources.every(s=>s.effectiveDateStart===null)).toBe(true);
 });
 it('keeps building/dwelling distinctions and separately binds shared participant/timing conditions',()=>{
  expect(evidence('140.20','whole')).toContain('in a building');
  expect(evidence('140.25','2')).toBe('2. The building is a dwelling.');
  expect(evidence('140.25','1(b)')).not.toContain('Uses or threatens');
  for(const scope of ['1(a)','1(b)','1(c)','1(d)'])expect(evidence('140.25',scope,'shared_participant_timing_condition')).toContain('he or another participant');
  for(const scope of ['1','2','3','4']){
   const preamble=evidence('140.30',scope,'shared_conduct_preamble');
   expect(preamble).toContain('in a dwelling');expect(preamble).toContain('immediate flight');expect(preamble).toContain('another participant');
  }
  expect(sourceText('140.00')).toContain('usually occupied by a person lodging therein at night');
  expect(sourceText('140.00')).toContain('not licensed or privileged');
 });
 it('preserves forcible-stealing purposes, actual presence and physical-versus-serious injury',()=>{
  const force=sourceText('160.00');expect(force).toContain('retention thereof immediately after the taking');expect(force).toContain('Compelling the owner');
  expect(evidence('160.10','1')).toContain('actually present');
  expect(evidence('160.10','2(a)')).toContain('physical injury');expect(evidence('160.10','2(a)')).not.toContain('serious');
  expect(evidence('160.15','1')).toContain('serious physical injury');
  expect(evidence('140.30','2')).not.toContain('serious');
  expect(evidence('160.10','2(a)','shared_participant_timing_condition')).toContain('immediate flight');
  expect(sourceText('10.00')).toContain('substantial pain');
 });
 it('limits unloaded/incapable-firearm affirmative defenses to first-degree display alternatives',()=>{
  expect(packet.records.filter(r=>r.affirmativeDefense).map(r=>[r.section,r.scope])).toEqual([['140.30','4'],['160.15','4']]);
  for(const section of ['140.30','160.15']){
   const quote=evidence(section,'4');expect(quote).toContain('affirmative defense');expect(quote).toContain('not a loaded weapon');expect(quote).toContain('shall constitute a defense to a prosecution for, or preclude a conviction of');
   expect(row(section,'4').bindings.some(b=>b.sourceKey==='ny:PEN:25.00')).toBe(true);
  }
  expect(evidence('140.25','1(d)')).not.toContain('affirmative defense');expect(evidence('160.10','2(b)')).not.toContain('affirmative defense');
  expect(evidence('140.30','1')).toContain('explosives');expect(evidence('160.15','2')).not.toContain('explosives');
 });
 it('retains the incorporated motor-vehicle definition and only the named shock-program contexts',()=>{
  const motor=row('160.10','3');expect(motor.bindings.some(b=>b.sourceKey==='ny:VAT:125')).toBe(true);
  const definition=sources.find(s=>s.sourceKey==='ny:VAT:125')!.text;
  expect(definition).toContain('bicycles with electric assist');expect(definition).toContain('electric scooters');
  expect(packet.records.filter(r=>r.shockProgramContext.startsWith('60.05(8)')).map(r=>[r.section,r.scope])).toEqual([['140.25','2'],['160.10','1']]);
 });
 it('separates ordinary Class D maximum/minimum terms from B/C violent determinate terms and PRS',()=>{
  expect(packet.records.filter(r=>r.statutoryGrade==='D felony')).toHaveLength(2);
  expect(packet.records.filter(r=>r.statutoryGrade==='C felony')).toHaveLength(9);
  expect(packet.records.filter(r=>r.statutoryGrade==='B felony')).toHaveLength(8);
  for(const r of packet.records)expect(evidence(r.section,r.scope,'grading')).toContain('class '+r.statutoryGrade);
  expect(sourceText('70.00')).toContain('maximum term of an indeterminate sentence shall be at least three years');
  expect(sourceText('70.00')).toContain('not less than one year nor more than one-third of the maximum term imposed');
  expect(row('140.20','whole').summary).toContain('building');
  expect(row('140.20','whole').sentencingSummary).toContain('not a mandatory three-year');
  expect(row('160.15','1').sentencingSummary).toContain('5–25 years');
  expect(row('140.25','2').sentencingSummary).toContain('3.5–15 years');
  expect(row('140.20','whole').violentFelonyClassification).toBe('completed_offense_not_listed_in_70.02');
  expect(evidence('140.25','2','ordinary_determinate_range')).toContain('three and one-half years');
  expect(evidence('160.15','1','ordinary_determinate_range')).toContain('at least five years');
  expect(sourceText('70.45')).toContain('not less than two and one-half years nor more than five years');
 });
 it('keeps the publisher-labelled current authorization separate from the scheduled future paragraph',()=>{
  for(const r of packet.records.filter(r=>r.statutoryGrade!=='D felony')){
   const quote=evidence(r.section,r.scope,'publisher_labelled_pre_2027_authorization');
   expect(quote).toContain('must be a determinate sentence');expect(quote).not.toContain('must be an indeterminate sentence');
   expect(quote).toContain('NB Effective until September 1, 2027');
  }
  expect(sourceText('70.02')).toContain('NB Effective September 1, 2027');
  expect(packet.prerequisites.join(' ')).toContain('does not independently validate the enactment history');
 });
 it('retains the greater-of fine and exclusions rather than inventing a universal penalty',()=>{
  expect(sourceText('80.00')).toContain('not exceeding the higher of');
  expect(sourceText('80.00')).toContain('double the amount');expect(sourceText('80.00')).toContain('shall not apply to a corporation');
  for(const r of packet.records){expect(r.fine).toContain('greater of $5,000');expect(r.limitations).toContain('Multiple-offender');expect(r.bindings.some(b=>b.sourceKey==='ny:PEN:60.12')).toBe(true);}
 });
 it('rejects changed evidence, scope, shared conditions, grading, penalties and dependencies',()=>{
  const changed=copy(sources);changed[0].text+='x';expect(()=>validateSources(changed)).toThrow('integrity');
  const url=copy(sources);url[0].sourceUrl='https://example.org';expect(()=>validateSources(url)).toThrow('identity');
  const date=copy(sources);date[0].effectiveDateStart='2026-01-01' as never;expect(()=>validateSources(date)).toThrow('provenance');
  const mutations=[
   (p:typeof packet)=>{p.records[0].bindings[1].start++;},
   (p:typeof packet)=>{p.records[1].bindings=p.records[1].bindings.filter(b=>b.role!=='shared_participant_timing_condition');},
   (p:typeof packet)=>{p.records[1].bindings[1]=copy(p.records[2].bindings[1]);},
   (p:typeof packet)=>{p.records[0].statutoryGrade='B felony';},
   (p:typeof packet)=>{p.records[0].fine='Fine up to $100';},
   (p:typeof packet)=>{p.records[0].bindings.pop();},
   (p:typeof packet)=>{p.records[0].summary+=' unsupported';},
   (p:typeof packet)=>{p.records[0].officialTitle='Different offense';},
  ];
  for(const mutate of mutations){const altered=copy(packet);mutate(altered);expect(altered).not.toEqual(packet);expect(()=>validatePacket(altered,sources)).toThrow();}
 });
 it('supports only the exact additional VAT reference and sanitizes API failures',async()=>{
  const {fetchCandidateDocument,collect}=await import('../scripts/data-review/new-york-burglary-robbery/collect-api.mjs');
  const ref=sources.find(s=>s.sourceKey==='ny:VAT:125')!;
  const value={success:true,result:{lawId:'VAT',docLevelId:'125',title:ref.officialTitle,text:ref.text,activeDate:'2020-01-01'}};
  const candidate=await fetchCandidateDocument(ref,'fixture-secret',async()=>({ok:true,json:async()=>value}));
  expect(candidate.sourceKey).toBe('ny:VAT:125');expect(candidate.metadataMeaning).toContain('not independently');expect(JSON.stringify(candidate)).not.toContain('fixture-secret');
  value.result.lawId='PEN';await expect(fetchCandidateDocument(ref,'fixture-secret',async()=>({ok:true,json:async()=>value}))).rejects.toThrow('acquisition failed');
  await expect(fetchCandidateDocument({...ref,sourceKey:'ny:VAT:999'},'fixture-secret')).rejects.toThrow('Exact VAT');
  await expect(fetchCandidateDocument(ref,'fixture-secret',async()=>{throw Error('fixture-secret');})).rejects.not.toThrow('fixture-secret');
  await expect(collect('/private/tmp/unused-ny-burglary-api','')).rejects.toThrow('NY_SENATE_API_KEY');
 });
});
