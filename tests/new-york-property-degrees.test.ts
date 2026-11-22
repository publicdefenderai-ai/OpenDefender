import {describe,it,expect} from 'vitest';
import {build,validatePacket} from '../scripts/data-review/new-york-property-degrees/review.mjs';
import {fetchCandidateDocument} from '../scripts/data-review/new-york-property-degrees/collect-api.mjs';
import packet from '../scripts/data-review/new-york-property-degrees/candidate-review.json';
import sources from '../scripts/data-review/new-york-property-degrees/candidate-sources.json';
import first from '../scripts/data-review/new-york-first-pass/candidate-sources.json';
import previous from '../scripts/data-review/new-york-burglary-robbery/candidate-sources.json';
const clone=<T>(x:T):T=>JSON.parse(JSON.stringify(x));
const row=(section:string,scope:string)=>packet.records.find(r=>r.section===section&&r.scope===scope)!;
const text=(section:string,scope:string,role='conduct_subdivision')=>row(section,scope).bindings.find(b=>b.role===role)!.text!.replace(/\s+/g,' ');
const source=(section:string)=>sources.find(s=>s.sourceKey===`ny:PEN:${section}`)!.text.replace(/\s+/g,' ');
describe('New York property-degree research',()=>{
 it('replays twenty alternatives with four separate publisher-label holds',()=>{
  expect(build()).toEqual(packet);expect(packet.records).toHaveLength(20);expect(packet.heldAlternatives).toHaveLength(4);
  expect(packet.counts).toEqual({primarySections:4,subdivisionMappings:20,heldPublisherAlternatives:4,retainedSources:27,reusedSources:19,newlyAcquiredSources:8,publishedChoices:0,verifiedLiveChoices:null});
  expect(packet.records.filter(r=>r.statutoryGrade==='E felony')).toHaveLength(14);expect(packet.records.filter(r=>r.statutoryGrade==='D felony')).toHaveLength(2);expect(packet.records.filter(r=>r.statutoryGrade==='C felony')).toHaveLength(4);
 });
 it('reslices every conduct, grade, sentence and held alternative independently',()=>{
  for(const r of [...packet.records,...packet.heldAlternatives])for(const b of r.bindings){const d=sources.find(s=>s.sourceKey===b.sourceKey)!;expect(b.contentSha256).toBe(d.contentSha256);expect(b.start).toBeGreaterThanOrEqual(0);expect(b.end).toBeGreaterThan(b.start);expect(b.end).toBeLessThanOrEqual(d.text.length);if('text' in b)expect(b.text).toBe(d.text.slice(b.start,b.end));}
  const old=[...first,...previous];const reused=sources.filter(d=>old.some(s=>s.sourceKey===d.sourceKey));expect(reused).toHaveLength(19);for(const d of reused)expect(old.some(s=>JSON.stringify(s)===JSON.stringify(d))).toBe(true);
 });
 it('distinguishes strict thresholds from inclusive religious-property value',()=>{
  expect(text('145.05','2')).toContain('exceeding two hundred fifty');expect(text('155.30','1')).toContain('exceeds one thousand');expect(text('155.35','1')).toContain('exceeds three thousand');expect(text('155.40','1')).toContain('exceeds fifty thousand');
  expect(text('155.30','8')).toContain('exceeds one hundred');expect(text('155.30','9')).toContain('at least one hundred');expect(text('155.30','9')).toContain('(b) is kept for or used');
  expect(row('155.30','9').additionalDependencyHold).toContain('not been completely resolved');
 });
 it('retains three separate repeat convictions, locked entry and common intent conditions',()=>{
  const conduct=text('145.05','1');expect(conduct).toContain('previous ten year');expect(conduct).toContain('three or more');expect(conduct).toContain('separate criminal transactions');expect(conduct).toContain('sentence was imposed on separate occasions');expect(conduct).toContain('when it is locked');
  expect(text('145.05','1','shared_conduct_preamble')).toContain('nor any reasonable ground');
 });
 it('keeps qualitative property branches independent of monetary thresholds',()=>{
  for(const scope of ['2','3','4','5','6','7','10','11'])expect(text('155.30',scope)).not.toMatch(/thousand|hundred dollars/);
  expect(text('155.35','2')).toContain('or the contents');expect(text('155.30','10')).toContain('intends to use unlawfully');expect(text('155.30','11')).toContain('knows another person intends');
  for(const [scope,key] of [['4','ny:GBS:511'],['7','ny:PEN:265.00'],['8','ny:VAT:123'],['8','ny:VAT:125']])expect(row('155.30',scope).bindings.some(b=>b.sourceKey===key)).toBe(true);
 });
 it('does not flatten the three extortion threats or invent serious-injury and value requirements',()=>{
  expect(text('155.40','2(a)')).toContain('physical injury');expect(text('155.40','2(a)')).not.toContain('serious');expect(text('155.40','2(a)')).toContain('future');
  expect(text('155.40','2(b)')).toContain('damage to property');expect(text('155.40','2(c)')).toContain('official duty');
  for(const scope of ['2(a)','2(b)','2(c)'])expect(text('155.40',scope,'shared_extortion_condition')).toContain('regardless of its nature and value');
  expect(source('155.15')).toContain('sole purpose');expect(source('155.15')).toContain('trespassory taking or embezzlement');expect(source('155.05')).toContain('shall not be deemed extortion');
 });
 it('binds valuation standards and does not invent an upper ceiling or arbitrary retail aggregation',()=>{
  expect(source('155.20')).toContain('market value');expect(source('155.20')).toContain('cost of replacement');expect(source('155.20')).toContain('less than two hundred fifty dollars');
  const retail=text('155.30','12');expect(retail).toContain('common scheme or plan or a single, ongoing intent');expect(retail).toContain('regardless of whether');expect(retail).toContain('Nothing in this subdivision');expect(source('70.10')).toContain('A previous felony conviction');expect(source('70.10')).toContain('subdivision twelve of section 155.30');expect(row('155.30','12').summary).toContain('not blanket immunity');
  expect(row('155.35','1').summary).toContain('no statutory upper ceiling');
 });
 it('keeps two distinct subdivision 3 texts per section without declaring either invalid',()=>{
  for(const section of ['155.35','155.40']){const held=packet.heldAlternatives.filter(r=>r.section===section);expect(held.map(r=>r.alternative)).toEqual(['retail','deed']);expect(held[0].bindings[0].text).toContain('common scheme');expect(held[1].bindings[0].text).toContain('deed theft');expect(held[0].bindings[0].start).not.toBe(held[1].bindings[0].start);expect(held.every(r=>r.reason.includes('does not declare either invalid or repealed'))).toBe(true);}
 });
 it('uses nonviolent E/D/C maximums and preserves minimum/alternative distinctions',()=>{
  for(const [section,scope,max] of [['145.05','2','four'],['155.35','1','seven'],['155.40','1','fifteen']]){const r=row(section,scope);expect(r.sentencingSummary).toContain(`no more than ${max} years`);expect(r.sentencingSummary).toContain('not a mandatory three-year minimum');expect(text(section,scope,'maximum_term_grade')).toContain(max+' years');expect(text(section,scope,'minimum_period')).toContain('one-third');expect(r.violentFelonyClassification).toBe('completed_offense_not_listed_in_70.02');}
  expect(row('155.40','1').bindings.some(b=>b.role==='conditional_definite_alternative')).toBe(false);expect(row('155.35','1').bindings.some(b=>b.role==='conditional_definite_alternative')).toBe(true);
  expect(packet.records.every(r=>r.fine.includes('greater of $5,000 or twice'))).toBe(true);
  expect(source('70.00')).toContain('Effective September 1, 2027');expect(text('155.35','1','publisher_pre_2027_authorization')).toContain('Effective until September 1, 2027');
 });
 for(const mutation of ['conduct','grade','threshold','held','source','unused','identity'] as const)it(`rejects confirmed ${mutation} tampering`,()=>{
  const p=clone(packet),s=clone(sources);const original=JSON.stringify([p,s]);
  if(mutation==='conduct')p.records[0].bindings[1].start++;
  if(mutation==='grade')p.records[0].statutoryGrade='D felony';
  if(mutation==='threshold')p.records[2].summary=p.records[2].summary.replace('exceeds','equals');
  if(mutation==='held')p.heldAlternatives.pop();
  if(mutation==='source')s[0].text+=' altered';
  if(mutation==='unused')s.push({...s[0],sourceKey:'ny:PEN:999.99'});
  if(mutation==='identity')p.records[0].scope='2';
  expect(JSON.stringify([p,s])).not.toBe(original);expect(()=>validatePacket(p,s)).toThrow();
 });
 for(const reference of ['ny:GBS:511','ny:RCO:2','ny:VAT:123','ny:VAT:125'])it(`requires exact API identity for ${reference}`,async()=>{
  const d=sources.find(s=>s.sourceKey===reference)!;const [,lawId,section]=reference.split(':');
  const fetcher=async(url:string,options:any)=>{expect(new URL(url).hostname).toBe('legislation.nysenate.gov');expect(options.redirect).toBe('error');return {ok:true,json:async()=>({success:true,result:{lawId,docLevelId:section,title:d.officialTitle,text:d.text}})};};
  expect((await fetchCandidateDocument(d,'fixture-token',fetcher)).sourceKey).toBe(reference);
  await expect(fetchCandidateDocument(d,'fixture-token',async()=>({ok:true,json:async()=>({success:true,result:{lawId:'PEN',docLevelId:section,title:d.officialTitle,text:d.text}})}))).rejects.toThrow('Official API acquisition failed');
 });
});
