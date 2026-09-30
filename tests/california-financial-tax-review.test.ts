import {describe,expect,it} from 'vitest';
import additions from '../shared/california-financial-tax-additions.json';
import {readFinancialTaxReview,validateFinancialTaxReview,readFinancialTaxReviewAcquisition,financialTaxDocuments,renderFinancialTaxReview} from '../scripts/data-review/california-verification/financial-tax-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import prior from '../scripts/data-review/output/california-property-arson-review.json';
const row=(code:string)=>additions.find(r=>r.code===code)!;
describe('California combined financial and tax publication',()=>{
 it('accounts for shared sources and preserves all earlier bounded instruction matches',()=>{
  expect(validateFinancialTaxReview()).toMatchObject({additions:28,primarySections:10,reusedSections:6,newSections:27,newVersions:27,promotedResearchSections:10,newBenchmarkMatches:17});
  const review=readFinancialTaxReview();expect(review.crosswalk).toHaveLength(202);
  for(const old of prior.crosswalk)expect(review.crosswalk.find(r=>r.id===old.id)!.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  expect(review.remainingFindings.map(r=>r.id)).toContain('financial-existing-branch-comparisons');
  expect(additions.some(a=>a.code==='530')).toBe(false);
  expect(renderFinancialTaxReview()).not.toMatch(/[—–]/);
 });
 it('keeps ordinary and false-identity financial-statement punishments separate',()=>{
  for(const code of ['532a(1)','532a(2)','532a(3)']) {
   expect(row(code).categories).toEqual(['misdemeanor']);expect(row(code).penalty).toContain('six months');
  }
  expect(row('532a(1)').summary).toContain('Actual receipt of the benefit is not required');
  expect(row('532a(2)').summary).toContain('requires procurement');
  expect(row('532a(4)').categories).toEqual(['felony','misdemeanor']);
  expect(row('532a(4)').penalty).toContain('$5,000');expect(row('532a(4)').penalty).toContain('$2,500');
 });
 it('does not turn accident, lawful incidental use or mere false identity into a more serious crime',()=>{
  for(const sub of [1,2,5,6,7])expect(row(`424(a)(${sub})`).mentalState).toContain('criminal negligence');
  expect(row('424(a)(3)').mentalState).toContain('Knowledge');
  expect(row('424(a)(4)').mentalState).toContain('Fraudulent intent');
  for(const a of additions.filter(a=>a.code.startsWith('424')))expect(a.summary).toContain('Incidental and minimal use authorized');
  expect(row('529(a)(3)').summary).toContain('merely giving a false name');
  expect(row('548(a)').summary).toContain('Fire is expressly excluded');
  expect(row('548(a)').penalty).toContain('plus a base fine');
 });
 it('distinguishes nonfiling thresholds, known-duty tax willfulness and intent to evade',()=>{
  const ordinary=row('19701(a)');expect(ordinary.summary).toContain('$15,000');expect(ordinary.summary).toContain('repetition requirement for both routes');
  expect(ordinary.summary).toContain('dementia');expect(ordinary.mentalState).toContain('knowledge of falsity');
  expect(row('19706').mentalState).toContain('known legal duty with intent to evade');
  expect(row('19705(a)(1)').summary).toContain('proof of additional tax owed is not required');
  expect(row('19705(a)(2)').summary).toContain('need not know of or consent');
  expect(row('19709').mentalState).toContain('with or without intent');
  expect(row('19709').mentalState).toContain('violation of a known legal duty');
 });
 it('reads express fine alternatives with 18(b) and never changes the statutory prison route',()=>{
  const text=sourceText(financialTaxDocuments()['PEN:18'][0].contentXml);
  expect(text).toContain('without an alternate sentence to the county jail');
  expect(text).toContain('may be punishable by imprisonment in the county jail not exceeding one year');
  for(const a of additions.filter(a=>a.code.startsWith('19705')||a.code==='19708')) {
   expect(a.categories).toEqual(['felony','misdemeanor']);expect(a.supportingKeys).toContain('PEN:18');
   expect(a.penalty).toContain('18(b)');expect(a.penalty).toContain('364 days');
   expect(a.supportingKeys).not.toContain('PEN:672');
  }
  expect(row('19705(a)(1)').penalty).toContain('individual base fine is up to $50,000');
  expect(row('19705(a)(1)').penalty).toContain('corporation');expect(row('19705(a)(1)').penalty).toContain('$200,000');
  expect(row('19706').penalty).toContain('state prison, not section 1170(h)');
  expect(row('115(a)').penalty).toContain('state prison under section 18(a)');
 });
 it('carries code identity, categories and English fallback through runtime guidance',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(chargeCategories['Fraud']).toContain(a.id);
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const canonical=getCaliforniaCanonicalRecord(a.id)!;expect(canonical.lawCode).toBe(a.lawCode);
   if(a.lawCode==='RTC')expect(canonical.citation).toContain('Revenue & Taxation');
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of [a.lawCode+':'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
  expect(getChargeById('ca-rtc-19706')!.searchAliases).toContain('R&T 19706');
 });
 it('rejects changed definitions, cross-code substitution, source text and evidence spans',()=>{
  const definitions=structuredClone(additions);definitions[0].penalty='incorrect';
  expect(()=>validateFinancialTaxReview(undefined,definitions)).toThrow('Definition changed');
  const acquisition=readFinancialTaxReviewAcquisition();acquisition.documents['RTC:19705'][0].lawCode='PEN';
  expect(()=>validateFinancialTaxReview(undefined,additions,acquisition)).toThrow();
  const source=readFinancialTaxReviewAcquisition();source.documents['PEN:115'][0].contentXml+='changed';
  expect(()=>validateFinancialTaxReview(undefined,additions,source)).toThrow();
  const span=readFinancialTaxReview();span.records[0].primaryEvidence.start=1;
  expect(()=>validateFinancialTaxReview(span)).toThrow('Unbound primary evidence');
 });
});
