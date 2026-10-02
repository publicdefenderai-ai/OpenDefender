import {describe,it,expect} from 'vitest';
import additions from '../shared/california-theft-animal-additions.json';
import previous from '../scripts/data-review/output/california-gap-reconciliation.json';
import {readTheftAnimalReview,validateTheftAnimalReview,renderTheftAnimalReview} from '../scripts/data-review/california-verification/theft-animal-review';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {officialsCustodyDocuments} from '../scripts/data-review/california-verification/officials-custody-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
describe('California missing theft and animal branches',()=>{
 it('reuses monitored sources and preserves unresolved comparisons',()=>{
  expect(validateTheftAnimalReview()).toEqual({additions:2,primarySections:2,reusedSections:16,newSections:0,newVersions:0,newBenchmarkMatches:1});
  const r=readTheftAnimalReview();expect(r.crosswalk).toHaveLength(202);expect(r.crosswalk.filter(x=>x.boundedChargeIds.length)).toHaveLength(141);
  expect(r.remainingFindings).toEqual(previous.remainingFindings);
  expect(r.reconciliation.filter(x=>x.instructionId!=='2953')).toEqual(previous.rows.filter(x=>x.instructionId!=='2953'));
  for(const old of previous.priorCrosswalk)expect(r.crosswalk.find(x=>x.id===old.id)?.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  for(const id of ['1800','1804','1805'])expect(r.crosswalk.find(x=>x.id===id)?.boundedChargeIds).toEqual([]);
  expect(r.findingProgress[0].status).toBe('bounded_choice_published_residual_questions_open');
  expect(renderTheftAnimalReview()).not.toMatch(/[—–]/);
 });
 it('does not substitute ordinary care cruelty for malicious intentional conduct',()=>{
  const a=additions.find(a=>a.code==='597(a)')!;
  expect(getCaliforniaCanonicalRecord('ca-animal-cruelty-misdemeanor')?.code).toBe('597(b)');
  expect(a.summary).toContain('Accidental injury alone');expect(a.summary).toContain('not an automatic defense');
  expect(a.penalty).toContain('$20,000');expect(a.penalty).toContain('forfeiture');expect(a.penalty).toContain('impoundment');
  const text=sourceText(officialsCustodyDocuments()['PEN:597'][0].contentXml);
  for(const phrase of ['maliciously and intentionally','twenty thousand dollars','forfeited','costs of impoundment'])expect(text).toContain(phrase);
  expect(chargeCategories['Public Order']).toContain(a.id);
 });
 it('preserves the multi-person threshold, knowledge standard and uncertain valuation',()=>{
  const a=additions.find(a=>a.code==='484e(b)')!;
  expect(a.summary).toContain('four or more people');expect(a.summary).toContain('any consecutive twelve-month');
  expect(a.summary).toContain('Four cards in one person');expect(a.mentalState).toContain('Reason to know');
  expect(a.penalty).toContain('$950 or less');expect(a.penalty).toContain('section 666.1');expect(a.penalty).toContain('not subdivision (b)');
  expect(a.penalty).toContain('fine ceiling remains unresolved');expect(a.calcrim).toEqual([]);
  expect(chargeCategories['Fraud']).toContain(a.id);
  const text=sourceText(officialsCustodyDocuments()['PEN:484e'][0].contentXml);
  for(const phrase of ['four or more persons','consecutive 12-month period','reason to know'])expect(text).toContain(phrase);
 });
 it('carries both categories, honest translations and expiry gating into runtime',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true,plainSummary:a.summary});
   const c=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
  }
 });
 it('rejects prose, source span, dependency and accounting drift',()=>{
  const defs=structuredClone(additions);defs[0].penalty='Up to $1,000';expect(()=>validateTheftAnimalReview(undefined,defs)).toThrow('Definition');
  const span=readTheftAnimalReview();span.records[0].sources[0].start=1;expect(()=>validateTheftAnimalReview(span)).toThrow('Unbound');
  const dependency=readTheftAnimalReview();dependency.records[0].sources.pop();expect(()=>validateTheftAnimalReview(dependency)).toThrow('Source binding');
  const findings=readTheftAnimalReview();findings.remainingFindings=[];expect(()=>validateTheftAnimalReview(findings)).toThrow('accounting');
  const instruction=readTheftAnimalReview();instruction.records[1].instructionEvidence=instruction.records[0].instructionEvidence;expect(()=>validateTheftAnimalReview(instruction)).toThrow('accounting');
 });
});
