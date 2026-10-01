import {describe,expect,it} from 'vitest';
import additions from '../shared/california-financial-identity-additions.json';
import {readFinancialIdentityReview,validateFinancialIdentityReview,readFinancialIdentityReviewAcquisition,renderFinancialIdentityReview,financialIdentityDocuments} from '../scripts/data-review/california-verification/financial-identity-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import previous from '../scripts/data-review/output/california-benchmark-reconciliation.json';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California combined financial and identity publication',()=>{
 it('reuses sources and preserves the reconciled benchmark and unresolved findings',()=>{
  expect(validateFinancialIdentityReview()).toMatchObject({additions:23,primarySections:6,reusedSections:25,newSections:3,newVersions:3,promotedResearchSections:1,newBenchmarkMatches:11});
  const r=readFinancialIdentityReview();expect(r.crosswalk).toHaveLength(202);
  expect(r.crosswalk.filter(i=>i.boundedChargeIds.length)).toHaveLength(128);
  for(const old of previous.crosswalk)expect(r.crosswalk.find(i=>i.id===old.id)?.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  for(const old of previous.remainingFindings)expect([...r.remainingFindings,...r.supersededFindings]).toContainEqual(old);
  expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['access-card-multiple-person-branch','identity-information-fine-ceilings']));
  expect(renderFinancialIdentityReview()).not.toMatch(/[—–]/);
 });
 it('does not turn exactly $950 into employee grand theft',()=>{
  expect(row('487(b)(3)').summary).toContain('"$950 or more,"');
  expect(row('487(b)(3)').summary).toContain('exactly $950 petty-theft treatment');
  expect(row('487(b)(3)').title).toContain('above $950');
  expect(row('487(b)(3)').supportingKeys).toContain('PEN:490.2');
 });
 it('separates caretaker status and value without labeling financial abuse as assault',()=>{
  for(const actor of ['d','e']) {
   const high=row(`368(${actor})(1)`),low=row(`368(${actor})(2)`);
   expect(high.categories).toEqual(['felony','misdemeanor']);expect(low.categories).toEqual(['misdemeanor']);
   expect(high.penalty).toContain('2, 3 or 4 years');expect(low.penalty).not.toContain('2, 3 or 4 years');
   expect(high.penalty).toContain('$2,500');expect(low.penalty).toContain('$1,000');
   expect(low.summary).toContain('including exactly $950');
   for(const a of [high,low]) {
    expect(chargeCategories['Fraud']).toContain(a.id);
    expect(chargeCategories['Assault Crimes']).not.toContain(a.id);
    expect(chargeCategories['Violent Crimes']).not.toContain(a.id);
    expect(a.summary).toContain('underlying offense must also be proved');
   }
  }
  expect(row('368(d)(1)').summary).toContain('reasonably should know');
  expect(row('368(e)(1)').summary).toContain('position of trust');
 });
 it('values the stolen access information rather than the later spending',()=>{
  for(const code of ['484e(a)','484e(d)']) {
   expect(row(code).summary).toContain('not automatically the amount later obtained');
   expect(row(code).penalty).toContain('Specified prior convictions');
   expect(row(code).categories).toContain('misdemeanor');
  }
  expect(additions.some(a=>a.code==='484e(b)')).toBe(false);
  const authorities=readFinancialIdentityReview().interpretationAuthorities;
  expect(authorities.some(a=>a.name.includes('Romanowski'))).toBe(true);
  expect(authorities.some(a=>a.name.includes('Liu'))).toBe(true);
 });
 it('does not equate identity-information possession with low-value theft',()=>{
  expect(row('530.5(c)(2)').summary).toContain('An arrest alone');
  expect(row('530.5(c)(3)').summary).toContain('Count people');
  for(const code of ['530.5(c)(2)','530.5(c)(3)','530.5(d)(1)','530.5(d)(2)']) {
   expect(row(code).summary).toContain('a low dollar value alone does not make it petty theft');
   expect(row(code).penalty).toContain('fine ceiling remains under review');
   expect(row(code).penalty).toContain('no generic $10,000 ceiling is assumed');
  }
  expect(row('530.5(d)(2)').summary).toContain('Mere suspicion is not actual knowledge');
  expect(row('530.5(d)(2)').penalty).toContain('does not expressly provide');
  expect(row('530.5(d)(2)').penalty).not.toContain('up to 364 days');
  expect(row('530.5(d)(2)').penalty).toContain('fine-only judgment');
 });
 it('distinguishes felony insurance fraud from health-care value branches',()=>{
  for(const n of [2,3,4,5]) {
   const a=row(`550(a)(${n})`);expect(a.categories).toEqual(['felony']);
   expect(a.penalty).toContain('and a fine');expect(a.penalty).toContain('does not supply a misdemeanor option');
  }
  for(const n of [6,7,8,9]) {
   const a=row(`550(a)(${n})`);expect(a.categories).toEqual(['felony','misdemeanor']);
   expect(a.penalty).toContain('12 consecutive months');expect(a.penalty).toContain('up to 6 months');
   expect(a.penalty).toContain('up to 364 days');expect(a.summary).toContain('workers\' compensation');
   expect(a.penalty).toContain('double an imposed fine');expect(a.penalty).toContain('requires restitution');
  }
  expect(row('550(a)(3)').penalty).toContain('serious bodily injury to a nonaccomplice');
  for(const n of [2,3,4])expect(row(`550(b)(${n})`).categories).toEqual(['felony','misdemeanor']);
 });
 it('binds valuation and punishment distinctions to retained statutory text',()=>{
  const docs=financialIdentityDocuments();
  const text=(key:string)=>sourceText(docs[key][0].contentXml);
  expect(text('PEN:368')).toContain('not exceeding nine hundred fifty dollars');
  expect(text('PEN:550')).toContain('any 12-consecutive-month period');
  expect(text('PEN:550')).toContain('double the amount of the fraud');
  expect(text('PEN:530.5')).toContain('with actual knowledge');
  expect(text('PEN:530')).toContain('same manner and to the same extent as for larceny');
 });
 it('carries all choices through the catalog, guidance, translation fallback and expiry gates',()=>{
  for(const a of additions) {
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const c=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of ['PEN:'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
 });
 it('rejects definition, dependency, span and prior-review drift',()=>{
  const defs=structuredClone(additions);defs[0].summary='changed';
  expect(()=>validateFinancialIdentityReview(undefined,defs)).toThrow('Definition changed');
  const a=readFinancialIdentityReviewAcquisition();a.documents['PEN:530'][0].contentXml+='changed';
  expect(()=>validateFinancialIdentityReview(undefined,additions,a)).toThrow();
  const r=readFinancialIdentityReview();r.records[0].primaryEvidence.start=1;
  expect(()=>validateFinancialIdentityReview(r)).toThrow('Unbound primary evidence');
  const lost=readFinancialIdentityReview();lost.crosswalk.find(i=>i.id==='1926')!.boundedChargeIds=[];
  expect(()=>validateFinancialIdentityReview(lost)).toThrow('Publication accounting');
 });
});
