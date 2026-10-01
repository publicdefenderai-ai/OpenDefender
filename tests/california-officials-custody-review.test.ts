import {describe,expect,it} from 'vitest';
import additions from '../shared/california-officials-custody-additions.json';
import {readOfficialsCustodyReview,validateOfficialsCustodyReview,readOfficialsCustodyReviewAcquisition,renderOfficialsCustodyReview,officialsCustodyDocuments} from '../scripts/data-review/california-verification/officials-custody-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import previous from '../scripts/data-review/output/california-financial-identity-review.json';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California officials, custody, minors and campus publication',()=>{
 it('reuses research and preserves all prior bounded matches and findings',()=>{
  expect(validateOfficialsCustodyReview()).toMatchObject({additions:17,primarySections:12,reusedSections:31,newSections:22,newVersions:22,promotedResearchSections:11,newBenchmarkMatches:12});
  const r=readOfficialsCustodyReview();expect(r.crosswalk).toHaveLength(202);
  expect(r.crosswalk.filter(i=>i.boundedChargeIds.length)).toHaveLength(140);
  for(const old of previous.crosswalk)expect(r.crosswalk.find(i=>i.id===old.id)?.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  for(const old of previous.remainingFindings)expect(r.remainingFindings).toContainEqual(old);
  expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['life-prisoner-fatal-assault','courthouse-picketing','legislative-vote-exchange','public-official-repeat-threat-fine']));
  expect(additions.some(a=>a.code==='169')).toBe(false);
  expect(renderOfficialsCustodyReview()).not.toMatch(/[—–]/);
 });
 it('preserves different bribery grades and received-bribe fine formulas',()=>{
  expect(row('67.5(a)').categories).toEqual(['misdemeanor']);expect(row('67.5(b)').categories).toEqual(['felony']);
  expect(row('67.5(b)').summary).toContain('offer need not be accepted');
  for(const code of ['68(a)','86','93(a)']) {
   expect(row(code).penalty).toContain('greater of the bribe amount');
   expect(row(code).penalty).toContain('greater of twice the bribe amount');
   expect(row(code).penalty).toContain('consider ability to pay');
  }
  expect(row('86').penalty).toContain('$4,000 to $20,000');
  expect(row('93(a)').penalty).toContain('$2,000 to $10,000');
  expect(row('86').summary).toContain('separate exchange-of-official-votes');
  expect(row('86').supportingKeys).toContain('PEN:88');expect(row('93(a)').supportingKeys).toContain('PEN:98');
 });
 it('requires a qualifying threat and does not import the first-conviction penalty into a repeat charge',()=>{
  for(const code of ['76(a)(1)','76(a)(2)']) {
   expect(row(code).summary).toContain('reasonable fear');expect(row(code).summary).toContain('know the victim');
   expect(row(code).summary).toContain('Political criticism');expect(row(code).summary).toContain('actual intent to carry out the threat is not required');
  }
  expect(row('76(a)(1)').penalty).toContain('$5,000');
  expect(row('76(a)(2)').summary).toContain('alleged and admitted or found true');
  expect(row('76(a)(2)').penalty).toContain('fine ceiling');expect(row('76(a)(2)').penalty).toContain('under review');
  expect(row('76(a)(2)').categories).toEqual(['felony']);
 });
 it('bounds life-prisoner assault and requires actual gassing contact',()=>{
  expect(row('4500').summary).toContain('conscious disregard');expect(row('4500').summary).toContain('year and a day');
  expect(row('4500').penalty).toContain('not a guaranteed release date');expect(row('4500').penalty).toContain('must not be applied to the fatal branch');
  for(const code of ['243.9(a)','4501.1(a)']) {
   expect(row(code).summary).toContain('Contact only with clothing is not enough');
   expect(row(code).categories).toEqual(['felony','misdemeanor']);
   expect(row(code).penalty).toContain('2, 3 or 4 years in state prison');
  }
  expect(row('4501.1(a)').penalty).toContain('consecutively');
  expect(row('243.9(a)').penalty).not.toContain('consecutively');
 });
 it('keeps prison substance knowledge, usable amount and authorization defenses',()=>{
  for(const code of ['4573(a)','4573.6(a)']) {
   const a=row(code);expect(a.summary).toContain('usable amount');expect(a.summary).toContain('Authorized medications');
   expect(a.summary).toContain('does not authorize cannabis in prison');
   expect(a.supportingKeys).toContain('HSC:11362.45');expect(a.supportingKeys).toContain('HSC:11164');
   expect(chargeCategories['Drug Offenses']).toContain(a.id);
  }
  expect(row('4573(a)').summary).toContain('involuntarily does not by itself');
  expect(row('4573.6(a)').summary).toContain('proximity alone');
 });
 it('separates child-protection branches and preserves statutory exceptions',()=>{
  expect(row('272(a)(1)').summary).toContain('ordinary carelessness');
  expect(row('272(a)(1)').penalty).toContain('probation for up to five years');
  expect(row('272(a)(1)').supportingKeys).toContain('PEN:1203a');
  const b=row('272(b)(1)');expect(b.summary).toContain('at least 21');expect(b.summary).toContain('under 14');
  expect(b.summary).toContain('Emergency situations are excluded');expect(b.summary).toContain('volunteering');
  expect(b.penalty).toContain('no incarceration');expect(b.penalty).toContain('up to 6 months');
  expect(b.penalty).not.toContain('$2,500');expect(b.categories).toEqual(['misdemeanor','infraction']);
 });
 it('preserves campus speech, student and employee exclusions and distinct priors',()=>{
  for(const n of [1,2,3]) {
   const a=row(`415.5(a)(${n})`);expect(a.summary).toContain('registered students');expect(a.summary).toContain('employee concerted activity');
   expect(a.penalty).toContain('10 days to 6 months');expect(a.penalty).toContain('90 days to 6 months');
   expect(a.penalty).toContain('infraction option for section 415 is not automatically available');
  }
  expect(row('415.5(a)(2)').summary).toContain('rather than communicate a message');
  expect(row('415.5(a)(3)').summary).toContain('reasonable and actual belief');
 });
 it('binds critical limits to retained statutory text',()=>{
  const docs=officialsCustodyDocuments();const text=(key:string)=>sourceText(docs[key][0].contentXml);
  expect(text('PEN:4500')).toContain('without the possibility of parole for nine years');
  expect(text('PEN:4501.1')).toContain('as prescribed in Section 4501.5');
  expect(text('PEN:4501.5')).toContain('served consecutively');
  expect(text('PEN:1203a')).toContain('specific probation lengths');
  expect(text('PEN:415.5')).toContain('shall not apply to any person who is a registered student');
  expect(text('PEN:272')).toContain('This subdivision shall not apply in an emergency situation');
 });
 it('carries all choices through guidance, source gating, categories and language fallback',()=>{
  for(const a of additions) {
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(chargeCategories['Public Order']).toContain(a.id);
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const c=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of ['PEN:'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
 });
 it('rejects definition, dependency, span and prior-review drift',()=>{
  const defs=structuredClone(additions);defs[0].summary='changed';
  expect(()=>validateOfficialsCustodyReview(undefined,defs)).toThrow('Definition changed');
  const a=readOfficialsCustodyReviewAcquisition();a.documents['PEN:68'][0].contentXml+='changed';
  expect(()=>validateOfficialsCustodyReview(undefined,additions,a)).toThrow();
  const r=readOfficialsCustodyReview();r.records[0].primaryEvidence.start=1;
  expect(()=>validateOfficialsCustodyReview(r)).toThrow('Unbound primary evidence');
  const lost=readOfficialsCustodyReview();lost.crosswalk.find(i=>i.id==='1926')!.boundedChargeIds=[];
  expect(()=>validateOfficialsCustodyReview(lost)).toThrow('Publication accounting');
 });
});
