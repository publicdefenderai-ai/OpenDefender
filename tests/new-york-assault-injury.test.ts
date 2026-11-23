import {describe,it,expect} from 'vitest';
import {build,validatePacket} from '../scripts/data-review/new-york-assault-injury/review.mjs';
import {fetchCandidateDocument} from '../scripts/data-review/new-york-assault-injury/collect-api.mjs';
import packet from '../scripts/data-review/new-york-assault-injury/candidate-review.json';
import sources from '../scripts/data-review/new-york-assault-injury/candidate-sources.json';
import property from '../scripts/data-review/new-york-property-degrees/candidate-sources.json';
import person from '../scripts/data-review/new-york-person-order/candidate-sources.json';
import burglary from '../scripts/data-review/new-york-burglary-robbery/candidate-sources.json';
import first from '../scripts/data-review/new-york-first-pass/candidate-sources.json';
const copy=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
const row=(section:string,scope:string)=>packet.records.find(r=>r.section===section&&r.scope===scope)!;
const quote=(section:string,scope:string,role='conduct_subdivision')=>row(section,scope).bindings.find(b=>b.role===role)!.text!.replace(/\s+/g,' ');
const source=(key:string)=>sources.find(s=>s.sourceKey===key)!.text.replace(/\s+/g,' ');
describe('New York assault/injury research',()=>{
 it('replays18 exact alternatives and accounts for10 specialized holds without publication',()=>{
  expect(build()).toEqual(packet);expect(packet.counts).toEqual({primarySections:3,subdivisionMappings:18,heldPrimaryAlternatives:10,retainedSources:24,reusedSources:18,newlyAcquiredSources:6,publishedChoices:0,verifiedLiveChoices:null});
  expect(packet.records.filter(r=>r.section==='120.05')).toHaveLength(12);expect(packet.records.filter(r=>r.section==='120.10')).toHaveLength(4);expect(packet.records.filter(r=>r.section==='121.12')).toHaveLength(2);
  expect(packet.heldAlternatives.map(r=>r.scope)).toEqual(['3','3-a','3-b','3-c','11','11-a','11-b','11-c','13','14']);expect(packet.records.every(r=>r.publicationStatus.startsWith('blocked_'))).toBe(true);
 });
 it('independently reslices every bound primary, dependency, result and penalty',()=>{
  for(const r of [...packet.records,...packet.heldAlternatives])for(const b of r.bindings){const d=sources.find(s=>s.sourceKey===b.sourceKey)!;expect(b.contentSha256).toBe(d.contentSha256);expect(b.start).toBeGreaterThanOrEqual(0);expect(b.end).toBeGreaterThan(b.start);expect(b.end).toBeLessThanOrEqual(d.text.length);if('text'in b)expect(b.text).toBe(d.text.slice(b.start,b.end));}
  const earlier=[...first,...person,...burglary,...property];const reused=sources.filter(d=>earlier.some(s=>s.sourceKey===d.sourceKey));expect(reused).toHaveLength(18);for(const d of reused)expect(earlier.some(s=>JSON.stringify(s)===JSON.stringify(d))).toBe(true);expect(sources.every(s=>s.effectiveDateStart===null)).toBe(true);
 });
 it('distinguishes intentional serious injury, intentional ordinary injury with weapon, and reckless serious injury',()=>{
  expect(quote('120.05','1')).toContain('intent to cause serious physical injury');expect(quote('120.05','2')).toContain('intent to cause physical injury');expect(quote('120.05','2')).not.toContain('serious');expect(quote('120.05','4')).toContain('recklessly causes serious physical injury');
  expect(quote('120.10','1')).toContain('serious physical injury');expect(quote('120.10','2')).toContain('seriously and permanently');expect(source('ny:PEN:10.00')).toContain('substantial pain');expect(source('ny:PEN:10.00')).toContain('substantial risk of death');expect(source('ny:PEN:15.05')).toContain('consciously disregards');
 });
 it('preserves intentional discharge plus reckless injury to a child under18',()=>{
  const q=quote('120.05','4-a');expect(q).toContain('recklessly causes physical injury');expect(q).toContain('under the age of eighteen');expect(q).toContain('intentional discharge');expect(q).not.toContain('serious');expect(row('120.05','4-a').bindings.some(b=>b.sourceKey==='ny:PEN:265.00')).toBe(true);
 });
 it('keeps nonconsensual administration and lawful-treatment exception within120.05(5)',()=>{
  const q=quote('120.05','5');expect(q).toContain('other than lawful medical or therapeutic treatment');expect(q).toContain('without his consent');expect(q).toContain('capable of producing');expect(q).toContain('intentionally');
 });
 it('does not copy the corroboration carveout into first-degree felony assault',()=>{
  const lesser=quote('120.05','6'),higher=quote('120.10','4');expect(lesser).toContain('article one hundred thirty which requires corroboration');expect(higher).not.toContain('corroboration');expect(lesser).toContain('causes physical injury');expect(higher).toContain('causes serious physical injury');
  for(const q of [lesser,higher]){expect(q).toContain('in furtherance');expect(q).toContain('immediate flight');expect(q).toContain('other than one of the participants');}
  expect(source('ny:PEN:130.16')).toContain('solely from incapacity');expect(source('ny:PEN:130.16')).toContain('Connect the defendant');
 });
 it('preserves correctional confinement predicates and the limited incorporation wording',()=>{
  const q=quote('120.05','7');expect(q).toContain('charged with or convicted');expect(q).toContain('pursuant to such charge or conviction');expect(source('ny:COR:40')).toContain('for the purpose of this article only');expect(row('120.05','7').summary).toContain('not broadened');
 });
 it('keeps child and older-person age thresholds exact and injury levels distinct',()=>{
  const eight=quote('120.05','8'),nine=quote('120.05','9'),older=quote('120.05','12');expect(eight).toContain('eighteen years old or more');expect(eight).toContain('less than eleven');expect(eight).toContain('recklessly causes serious physical injury');expect(nine).toContain('less than seven');expect(nine).not.toContain('serious');expect(older).toContain('sixty-five years of age or older');expect(older).toContain('more than ten years younger');
 });
 it('separates employee and student school-ground branches, including their shared knowledge requirement',()=>{
  expect(quote('120.05','10(a)')).toContain('employee');expect(quote('120.05','10(a)')).not.toContain('not being a student');expect(quote('120.05','10(b)')).toContain('not being a student');expect(quote('120.05','10(b)')).toContain('attending or present for educational purposes');for(const scope of ['10(a)','10(b)'])expect(quote('120.05',scope,'shared_school_condition')).toContain('knows, or reasonably should know');expect(source('ny:PEN:220.00')).toContain('within one thousand feet');
 });
 it('does not collapse depraved indifference into ordinary recklessness',()=>{
  const q=quote('120.10','3');expect(q).toContain('depraved indifference');expect(q).toContain('grave risk of death');expect(q).toContain('serious physical injury');expect(row('120.10','3').summary).toContain('independent judicial mental-state requirements');
 });
 it('binds strangulation to both obstruction alternatives, causation, any-period loss and the affirmative defense',()=>{
  expect(quote('121.12','121.11(a)')).toContain('throat or neck');expect(quote('121.12','121.11(b)')).toContain('nose or mouth');for(const scope of ['121.11(a)','121.11(b)']){expect(quote('121.12',scope,'shared_conduct_preamble')).toContain('intent to impede');const result=quote('121.12',scope,'offense_result');expect(result).toContain('thereby');expect(result).toContain('for any period of time');expect(result).not.toContain('serious');expect(row('121.12',scope).bindings.some(b=>b.sourceKey==='ny:PEN:121.14')).toBe(true);}expect(source('ny:PEN:121.14')).toContain('affirmative defense');expect(source('ny:PEN:121.14')).toContain('valid medical or dental purpose');
 });
 it('uses conditional D prison2–7/PRS1.5–3 and B5–25/PRS2.5–5 without ignoring alternatives or armed pleas',()=>{
  for(const r of packet.records){const isB=r.section==='120.10';expect(quote(r.section,r.scope,'ordinary_determinate_range')).toContain(isB?'at least five years':'at least two years');expect(quote(r.section,r.scope,'ordinary_PRS')).toContain(isB?'two and one-half':'one and one-half');expect(r.sentencingSummary).toContain(isB?'2.5–5':'1.5–3');if(!isB){expect(r.sentencingSummary).toContain('not an unconditional');expect(quote(r.section,r.scope,'D_disposition_requirement')).toContain('70.00 or 85.00');expect(quote(r.section,r.scope,'conditional_D_authorization')).toContain('where a sentence of imprisonment is imposed');}}
  expect(source('ny:PEN:85.00')).toContain('other than a second or persistent felony offender');expect(source('ny:PEN:70.02')).toContain('satisfaction of an indictment');expect(source('ny:CPL:1.20')).toContain('Armed felony');expect(quote('120.10','1','publisher_pre_2027_authorization')).toContain('Effective until September 1, 2027');
 });
 for(const mutation of ['conduct','grade','injury','held','source','dependency','PRS','identity'])it(`rejects confirmed ${mutation} alteration`,()=>{
  const p=copy(packet),s=copy(sources);const original=JSON.stringify([p,s]);
  if(mutation==='conduct')p.records[0].bindings[2].start++;
  if(mutation==='grade')p.records[0].statutoryGrade='B felony';
  if(mutation==='injury')p.records[0].summary=p.records[0].summary.replace('serious','minor');
  if(mutation==='held')p.heldAlternatives.pop();
  if(mutation==='source')s[0].text+=' extra';
  if(mutation==='dependency')p.records[0].bindings.pop();
  if(mutation==='PRS')p.records[0].sentencingSummary=p.records[0].sentencingSummary.replace('1.5–3','5–10');
  if(mutation==='identity')p.records[0].scope='2';
  expect(JSON.stringify([p,s])).not.toBe(original);expect(()=>validatePacket(p,s)).toThrow();
 });
 it('validates exact Correction Law API identity with no redirects or alternative sections',async()=>{
  const d=sources.find(s=>s.sourceKey==='ny:COR:40')!;const fetcher=async(url:string,opts:any)=>{expect(new URL(url).pathname).toBe('/api/3/laws/COR/40');expect(opts.redirect).toBe('error');return {ok:true,json:async()=>({success:true,result:{lawId:'COR',docLevelId:'40',title:d.officialTitle,text:d.text}})};};expect((await fetchCandidateDocument(d,'fixture',fetcher)).sourceKey).toBe(d.sourceKey);
  await expect(fetchCandidateDocument({...d,sourceKey:'ny:COR:41'},'fixture',fetcher)).rejects.toThrow('Exact batch identity');await expect(fetchCandidateDocument(d,'fixture',async()=>({ok:true,json:async()=>({success:true,result:{lawId:'PEN',docLevelId:'40',title:d.officialTitle,text:d.text}})}))).rejects.toThrow('Official API acquisition failed');
 });
});
