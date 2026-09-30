import {describe,expect,it} from 'vitest';
import additions from '../shared/california-repeat-theft-assembly-additions.json';
import {readRepeatTheftAssemblyReview,validateRepeatTheftAssemblyReview,readRepeatTheftAssemblyReviewAcquisition,repeatTheftAssemblyDocuments,renderRepeatTheftAssemblyReview} from '../scripts/data-review/california-verification/repeat-theft-assembly-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import prior from '../scripts/data-review/output/california-public-order-review.json';
const row=(code:string)=>additions.find(r=>r.code===code)!;
describe('California repeat theft, vehicles and assembly publication',()=>{
 it('preserves prior matches and accounts explicitly for narrower replacement findings',()=>{
  expect(validateRepeatTheftAssemblyReview()).toMatchObject({additions:10,primarySections:9,reusedSections:17,newSections:20,newVersions:20,promotedResearchSections:12,newBenchmarkMatches:11});
  const review=readRepeatTheftAssemblyReview();expect(review.crosswalk).toHaveLength(202);
  expect(review.crosswalk.filter(r=>r.boundedChargeIds.length)).toHaveLength(97);
  for(const old of prior.crosswalk)expect(review.crosswalk.find(r=>r.id===old.id)!.boundedChargeIds).toEqual(expect.arrayContaining(old.boundedChargeIds));
  for(const old of prior.remainingFindings)expect([...review.remainingFindings,...review.supersededFindings]).toContainEqual(old);
  expect(review.remainingFindings.map(r=>r.id)).toEqual(expect.arrayContaining(['vehicle-special-and-low-value-branches','repeat-theft-and-custody-riot-fines','remaining-trespass-branches','public-order-school-loitering']));
  expect(renderRepeatTheftAssemblyReview()).not.toMatch(/[—–]/);
 });
 it('does not confuse the two prior-theft schemes or turn an allegation into a standalone act',()=>{
  const old=row('666(a)'),newer=row('666.1(a)(1)');
  expect(old.summary).toContain('term in a penal institution');
  expect(old.summary).toContain('667(e)(2)(C)(iv)');
  expect(old.summary).toContain('Not every theft prior');
  expect(newer.summary).toContain('does not require a prior custodial term');
  expect(newer.summary).toContain('two prior convictions');
  expect(newer.summary).toContain('an arrest alone is not a conviction');
  expect(old.penalty).toContain('state prison');
  expect(newer.penalty).toContain('first section 666.1 conviction');
  expect(newer.penalty).toContain('second or subsequent');
  for(const a of [old,newer]) {expect(a.summary).toContain('increased-punishment allegation');expect(a.penalty).toContain('fine ceiling');expect(a.penalty).toContain('under review');}
  expect(newer.penalty).toContain('individualized judicial review');
  expect(newer.supportingKeys).toContain('PEN:1001.81');
 });
 it('bounds vehicle publication and does not treat a temporary low-value taking as automatically felony',()=>{
  const a=row('10851(a)');expect(a.title).toContain('above $950 or posttheft driving');
  expect(a.summary).toContain('substantial break');expect(a.summary).toContain('including temporary taking');
  expect(a.summary).toContain('ordinarily receives misdemeanor treatment');
  expect(a.penalty).toContain('misdemeanor option is not automatically erased');
  expect(a.penalty).toContain('not assigned these ordinary ranges');
  expect(a.categories).toEqual(['felony','misdemeanor']);
  expect(additions.some(a=>a.code==='10851(b)')).toBe(false);
 });
 it('requires conduct and immediate danger rather than criminalizing protected expression',()=>{
  expect(row('403').summary).toContain('not their message or expressive content');
  expect(row('403').summary).toContain('substantially and unlawfully interfering');
  expect(row('408').summary).toContain('not unlawful merely because it is loud');
  expect(row('408').summary).toContain('clear and present danger of immediate violence');
  expect(row('404.6(a)').summary).toContain('An actual riot is not required');
  expect(row('404.6(c)').summary).toContain('actual riot in a state prison or county jail');
  expect(row('404.6(c)').summary).toContain('cause serious bodily injury');
  expect(row('404.6(c)').penalty).toContain('no general $10,000 fine is assumed');
 });
 it('distinguishes dispersal intent, reasonable notice and the press exception',()=>{
  expect(row('409').summary).toContain('Participation in the underlying disturbance is not itself required');
  expect(row('416(a)').summary).toContain('requires the defendant\'s specified intent');
  for(const a of [row('409'),row('416(a)')]) {
   expect(a.summary).toContain('heard');
   expect(a.summary).toContain('Section 409.7 protects');expect(a.supportingKeys).toContain('PEN:409.7');
  }
  expect(row('416(a)').penalty).toContain('personally caused');
  expect(row('416(a)').penalty).toContain('inability to pay');
  const text=sourceText(repeatTheftAssemblyDocuments()['PEN:409.7'][0].contentXml);
  expect(text).toContain('shall not be cited for the failure to disperse');
 });
 it('preserves Elections Code dependency identity rather than silently labeling it Penal Code',()=>{
  const a=getCaliforniaCanonicalRecord('ca-pen-403')!;
  const source=a.sources.find(s=>s.url.includes('lawCode=ELEC'))!;
  expect(source).toBeDefined();expect(source.url).toContain('sectionNum=18340');
  expect(row('403').supportingKeys).toContain('ELEC:18340');
 });
 it('carries review, categories, fallback and expiry through the runtime catalog',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   const property=a.code.startsWith('666')||a.lawCode==='VEH';
   expect(chargeCategories[property?'Theft & Property':'Public Order']).toContain(a.id);
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true});
   const canonical=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.expiresAt))).not.toBe('current');
   for(const key of [a.lawCode+':'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
  }
 });
 it('rejects definition, dependency and evidence tampering',()=>{
  const definitions=structuredClone(additions);definitions[0].summary='incorrect';
  expect(()=>validateRepeatTheftAssemblyReview(undefined,definitions)).toThrow('Definition changed');
  const acquisition=readRepeatTheftAssemblyReviewAcquisition();acquisition.documents['ELEC:18340'][0].lawCode='PEN';
  expect(()=>validateRepeatTheftAssemblyReview(undefined,additions,acquisition)).toThrow();
  const span=readRepeatTheftAssemblyReview();span.records[0].primaryEvidence.start=1;
  expect(()=>validateRepeatTheftAssemblyReview(span)).toThrow('Unbound primary evidence');
  const missing=readRepeatTheftAssemblyReview();missing.supersededFindings=[];
  expect(()=>validateRepeatTheftAssemblyReview(missing)).toThrow('Publication accounting');
 });
});
