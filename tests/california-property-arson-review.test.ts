import {describe,expect,it} from 'vitest';
import additions from '../shared/california-property-arson-additions.json';
import {readPropertyArsonReview,validatePropertyArsonReview,readPropertyArsonReviewAcquisition,propertyArsonDocuments,renderPropertyArsonReview} from '../scripts/data-review/california-verification/property-arson-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {californiaTransitionRequiresReview} from '../shared/california-source-transitions';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import prior from '../scripts/data-review/output/california-justice-custody-review.json';
const row=(code:string)=>additions.find(r=>r.code===code)!;
describe('California property, arson and extortion publication',()=>{
 it('accounts for the combined batch and preserves earlier crosswalk matches',()=>{
  expect(validatePropertyArsonReview()).toMatchObject({additions:22,primarySections:15,reusedSections:18,newSections:22,newVersions:23,promotedResearchSections:19,newBenchmarkMatches:15});
  const review=readPropertyArsonReview();expect(review.crosswalk).toHaveLength(202);
  for(const old of prior.crosswalk)expect(review.crosswalk.find(r=>r.id===old.id)!.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  expect(review.remainingFindings.map(r=>r.id)).toContain('property-repeat-theft-and-vehicle-taking');
  expect(renderPropertyArsonReview()).not.toMatch(/[—–]/);
 });
 it('chooses operative rather than earliest-effective aggravated arson and gates its future transition',()=>{
  const docs=propertyArsonDocuments()['PEN:451.5'];expect(docs).toHaveLength(2);
  const current=readPropertyArsonReview().records.find(r=>r.id==='ca-pen-451-5-a')!.primaryEvidence;
  expect(current.text).toContain('10,100,000');
  expect(sourceText(docs.find(v=>v.versionId!==current.versionId)!.contentXml)).not.toContain('10,100,000');
  expect(row('451.5(a)').penalty).toContain('10 years to life');
  expect(californiaTransitionRequiresReview(['PEN:451.5'],new Date('2029-01-01T08:00:00Z'))).toBe(true);
  expect(californiaTransitionRequiresReview(['PEN:451.5'],new Date('2029-01-01T07:59:59Z'))).toBe(false);
 });
 it('preserves reckless-fire alternatives, own-property exceptions and chapter-specific fines',()=>{
  for(const code of ['452(a)','452(b)','452(c)','453(a)']) {
   expect(row(code).categories).toEqual(['felony','misdemeanor']);
   expect(row(code).penalty).toContain('$50,000');
   expect(row(code).penalty).toMatch(/[Mm]isdemeanor fine.*review/);
   expect(row(code).supportingKeys).toContain('PEN:456');
  }
  expect(row('452(c)').penalty).toContain('six months');
  expect(row('451(d)').summary).toContain('unless there is intent to defraud');
  expect(row('452(d)').summary).not.toContain('intent to defraud');
  for(const a of additions.filter(a=>['451','451.5','453','455'].includes(a.code.split('(')[0]))) {
   expect(a.penalty).toContain('Arson registration');expect(a.supportingKeys).toContain('PEN:457.1');
  }
  expect(sourceText(propertyArsonDocuments()['PEN:456'][0].contentXml)).toContain('twice the anticipated or actual gross gain');
 });
 it('does not erase mental state, number of accomplices or the vehicle-entry conviction restriction',()=>{
  expect(row('213(a)(1)(A)').summary).toContain('at least two other people');
  expect(row('465(a)').summary).toContain('prohibits conviction under both');
  expect(row('466(a)').summary).toContain('Mere lawful possession');
  expect(row('523(a)').summary).toContain('Payment need not actually occur');
  expect(row('520').summary).toContain('immigration status');
  expect(row('524').penalty).toContain('state prison');
  expect(row('524').penalty).not.toContain('1170(h)');
 });
 it('carries exact text, category alternatives and honest language fallback into guidance',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(chargeCategories['Theft & Property']).toContain(a.id);
   const classification=classifyChargesForGuidance([a.id])[0];
   expect(classification).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const canonical=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of ['PEN:'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
 });
 it('rejects changed penalties, source text, version selection and evidence spans',()=>{
  const definitions=structuredClone(additions);definitions[0].penalty='incorrect';
  expect(()=>validatePropertyArsonReview(undefined,definitions)).toThrow('Definition changed');
  const acquisition=readPropertyArsonReviewAcquisition();acquisition.documents['PEN:451.5'][0].contentXml+='changed';
  expect(()=>validatePropertyArsonReview(undefined,additions,acquisition)).toThrow();
  const version=readPropertyArsonReview();version.records.find(r=>r.id==='ca-pen-451-5-a')!.primaryEvidence.versionId='id_da957e9d-8257-11ee-bcfe-9f16e66157a6';
  expect(()=>validatePropertyArsonReview(version)).toThrow('Wrong operative version');
  const span=readPropertyArsonReview();span.records[0].primaryEvidence.start=1;
  expect(()=>validatePropertyArsonReview(span)).toThrow('Unbound primary evidence');
 });
});
