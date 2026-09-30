import {describe,expect,it} from 'vitest';
import additions from '../shared/california-public-order-additions.json';
import {readPublicOrderReview,validatePublicOrderReview,readPublicOrderReviewAcquisition,publicOrderDocuments,renderPublicOrderReview} from '../scripts/data-review/california-verification/public-order-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import prior from '../scripts/data-review/output/california-financial-tax-review.json';
const row=(code:string)=>additions.find(r=>r.code===code)!;
describe('California combined public-order publication',()=>{
 it('accounts for reuse while preserving earlier matches and unresolved findings',()=>{
  expect(validatePublicOrderReview()).toMatchObject({additions:23,primarySections:11,reusedSections:13,newSections:21,newVersions:21,promotedResearchSections:18,newBenchmarkMatches:22});
  const review=readPublicOrderReview();expect(review.crosswalk).toHaveLength(202);
  for(const old of prior.crosswalk)expect(review.crosswalk.find(r=>r.id===old.id)!.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  for(const old of prior.remainingFindings)expect(review.remainingFindings).toContainEqual(old);
  expect(review.remainingFindings.map(r=>r.id)).toContain('public-order-school-loitering');
  expect(additions.some(a=>a.code.startsWith('653b'))).toBe(false);
  expect(renderPublicOrderReview()).not.toMatch(/[—–]/);
 });
 it('does not substitute a simple entry for occupancy, actual interference or a threat',()=>{
  expect(row('602(k)').summary).toContain('actually causing');
  expect(row('602(m)').summary).toContain('continuously until removed');
  expect(row('602.5(b)').calcrim).toEqual(['2932','2933']);
  expect(row('602.5(b)').summary).toContain('present at any time');
  expect(row('602.5(b)').penalty).toContain('may order up to three years');
  expect(row('602.5(b)').penalty).toContain('required probation condition');
  expect(row('601(a)(1)').summary).toContain('within 30 days');
  expect(row('601(a)(2)').summary).toContain('taking an act to locate');
  expect(row('591').penalty).toContain('AND a base fine');
  expect(sourceText(publicOrderDocuments()['PEN:591'][0].contentXml)).toContain('and a fine of up to ten thousand dollars');
 });
 it('preserves the different animal knowledge standards, custody routes and exclusions',()=>{
  expect(row('399(a)').mentalState).toContain('Actual knowledge');
  expect(row('399(b)').mentalState).toContain('ordinary care');
  expect(row('399(a)').penalty).toContain('state prison');
  expect(row('399.5(a)').penalty).toContain('2, 3 or 4 years under section 1170(h)');
  expect(row('399.5(a)').mentalState).toContain('reason to know');
  expect(row('399.5(a)').summary).toContain('provocation');
  expect(row('399.5(a)').penalty).toContain('destruction');
 });
 it('keeps alcohol fine/service alternatives, medical immunity and the collision requirement',()=>{
  for(const code of ['25658(a)','25658(b)','25658(d)']) {
   expect(row(code).categories).toEqual(['misdemeanor']);expect(row(code).penalty).toMatch(/do(?:es)? not specify a jail term/);
  }
  expect(row('25658(a)').penalty).toContain('AND at least 24 hours');
  expect(row('25658(b)').summary).toContain('911');
  expect(row('25658(b)').summary).toContain('does not immunize impaired driving');
  expect(row('25658(c)').penalty).toContain('fine-only');
  expect(row('25658(c)').categories).toEqual(['misdemeanor']);
  expect(row('25658.2(a)').summary).toContain('All of these conditions are required');
  expect(row('25658.2(a)').summary).toContain('0.05 percent');
 });
 it('does not promote the noncommercial pool exception to the ordinary wobbler',()=>{
  expect(row('336.9(a)').categories).toEqual(['infraction']);
  expect(row('336.9(a)').summary).toContain('excludes online');
  expect(row('336.9(a)').summary).toContain('$2,500');
  expect(row('336.9(a)').summary).toContain('does not cover bookmaking');
  for(const a of additions.filter(a=>a.code.startsWith('337a'))) {
   expect(a.categories).toEqual(['felony','misdemeanor']);expect(a.supportingKeys).toContain('PEN:336.9');
   expect(a.penalty).toContain('$15,000');expect(a.penalty).toContain('AND a $1,000 to $10,000');
  }
 });
 it('preserves privacy exceptions so evidence recording is not declared automatically unlawful',()=>{
  const a=row('632(a)');expect(a.summary).toContain('objectively reasonable grounds');
  expect(a.summary).toContain('633.5');expect(a.summary).toContain('633.6');
  expect(a.supportingKeys).toEqual(expect.arrayContaining(['PEN:633.5','PEN:633.6','PEN:13700']));
  expect(sourceText(publicOrderDocuments()['PEN:633.5'][0].contentXml)).toContain('domestic violence');
  expect(a.penalty).toContain('per violation');expect(a.penalty).toContain('Civil remedies');
 });
 it('carries categories, citation searches and English fallback through runtime and expiry',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(chargeCategories['Public Order']).toContain(a.id);
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const canonical=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of [a.lawCode+':'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
  expect(getChargeById('ca-bpc-25658-c')!.searchAliases).toContain('B&P 25658(c)');
 });
 it('rejects modified definitions, source identity and review spans',()=>{
  const definitions=structuredClone(additions);definitions[0].penalty='incorrect';
  expect(()=>validatePublicOrderReview(undefined,definitions)).toThrow('Definition changed');
  const acquisition=readPublicOrderReviewAcquisition();acquisition.documents['BPC:25658'][0].lawCode='PEN';
  expect(()=>validatePublicOrderReview(undefined,additions,acquisition)).toThrow();
  const span=readPublicOrderReview();span.records[0].primaryEvidence.start=1;
  expect(()=>validatePublicOrderReview(span)).toThrow('Unbound primary evidence');
 });
});
