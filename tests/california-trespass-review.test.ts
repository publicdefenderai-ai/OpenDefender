import {describe,it,expect} from 'vitest';
import additions from '../shared/california-trespass-additions.json';
import previous from '../scripts/data-review/output/california-theft-animal-review.json';
import {readTrespassReview,validateTrespassReview,renderTrespassReview} from '../scripts/data-review/california-verification/trespass-review';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California combined trespass branches',()=>{
 it('stores shared sources once and preserves predecessor accounting',()=>{
  expect(validateTrespassReview()).toEqual({additions:11,primarySections:1,reusedSections:7,newSections:0,newVersions:0,newBenchmarkMatches:0});
  const r=readTrespassReview();expect(r.sources.filter(s=>s.key==='PEN:602')).toHaveLength(1);
  expect(r.priorAccounting).toMatchObject({benchmarkInstructions:202,boundedMatches:141});
  expect(previous.remainingFindings.map(f=>f.id)).toContain('vehicle-special-and-low-value-branches');
  expect(r.remaining[0].status).toBe('partial_publication_other_branches_open');
  expect(renderTrespassReview()).not.toMatch(/[—–]/);
 });
 it('selects the operative hospital subdivision rather than its introductory cross-reference',()=>{
  const r=readTrespassReview(),x=r.branchSpans.find(s=>s.branch==='x')!;
  expect(x.text.startsWith('(x) (1) Knowingly entering')).toBe(true);
  expect(x.text).not.toContain('Cutting down');expect(x.text).not.toContain('(y)');
  expect(x.text).toContain('at each entrance');expect(x.text).toContain('good cause not to pay');
  for(const span of r.branchSpans)expect(r.sources.find(s=>s.key===span.key)!.text.slice(span.start,span.end)).toBe(span.text);
 });
 it('requires more than entry for the four cultivated/fenced/posted-land routes',()=>{
  for(const n of [1,2,3,4]){
   const a=row(`602(l)(${n})`);expect(a.summary).toContain('without written permission');expect(a.summary).toContain('Entry alone is not this branch');
   expect(a.supportingKeys).toContain('PEN:602.8');expect(a.categories).toEqual(['misdemeanor']);
  }
  expect(row('602(l)(1)').summary).toContain('immediately');expect(row('602(l)(2)').summary).toContain('forbidding trespass or hunting');
  expect(row('602(l)(3)').summary).toContain('lock on a gate');expect(row('602(l)(4)').summary).toContain('discharging a firearm');
 });
 it('keeps private-property infraction treatment and statutory access protections',()=>{
  const a=row('602(o)');expect(a.categories).toEqual(['misdemeanor','infraction']);
  expect(a.penalty).toContain('$250');expect(a.penalty).toContain('not automatic');
  expect(a.supportingKeys).toEqual(expect.arrayContaining(['PEN:17','PEN:19.8','PEN:19.6']));
  for(const phrase of ['not open to the general public','ownership-change','labor activity','constitutionally protected','resident or management invitations'])expect(a.summary).toContain(phrase);
 });
 it('does not apply ordinary six-month sentencing to shelters or hospital misdemeanor branches',()=>{
  const shelter=row('602(w)');expect(shelter.penalty).toContain('364 days');expect(shelter.penalty).toContain('relocation expenses');
  expect(shelter.penalty).toContain('not resolved');expect(shelter.supportingKeys).not.toContain('PEN:19');
  const ordinary=row('602(x)(2)(A)'),refusal=row('602(x)(2)(B)'),repeat=row('602(x)(2)(C)');
  expect(ordinary.categories).toEqual(['infraction']);expect(ordinary.penalty).toContain('$100');expect(ordinary.penalty).toContain('no incarceration');
  expect(refusal.penalty).toContain('$1,000');expect(repeat.penalty).toContain('$2,000');
  for(const a of [ordinary,refusal,repeat]){
   expect(a.summary).toContain('602(x)(1)');expect(a.summary).toContain('lawful business');expect(a.summary).toContain('each entrance');
   expect(a.penalty).toContain('good cause not to impose');expect(a.penalty).toContain('good cause not to pay');
  }
 });
 it('keeps closure and screening limits',()=>{
  expect(row('602(q)').summary).toContain('regularly closed');expect(row('602(q)').summary).toContain('apparent lawful business');
  expect(row('602(y)').summary).toContain('federal law is excepted');expect(row('602(y)').summary).toContain('posted');
  expect(row('602(y)').summary).toContain('declining to enter');
 });
 it('carries choices, categories and language warnings through guidance and source expiry',()=>{
  for(const a of additions){
   expect(getChargeById(a.id)).toMatchObject({maxPenalty:a.penalty,categories:a.categories});
   expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
   expect(chargeCategories['Public Order']).toContain(a.id);
   for(const lang of ['es','zh'])expect(getChargeExplanation(a.title,'CA',lang,a.id)).toMatchObject({untranslated:true,plainSummary:a.summary});
   const c=getCaliforniaCanonicalRecord(a.id)!;
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
   expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
  }
 });
 it('rejects definition, shared-text, branch substitution and predecessor drift',()=>{
  const defs=structuredClone(additions);defs[0].penalty='fine only';expect(()=>validateTrespassReview(undefined,defs)).toThrow('Definition');
  const source=readTrespassReview();source.sources[0].text+='changed';expect(()=>validateTrespassReview(source)).toThrow('Unbound source');
  const span=readTrespassReview();span.branchSpans[0].start++;expect(()=>validateTrespassReview(span)).toThrow('Unbound branch');
  const branch=readTrespassReview();branch.records[0].primaryBranch='x';expect(()=>validateTrespassReview(branch)).toThrow('accounting');
  const deps=readTrespassReview();deps.records[0].sourceKeys.pop();expect(()=>validateTrespassReview(deps)).toThrow('dependency');
  const previous=readTrespassReview();previous.previousReviewSha256='changed';expect(()=>validateTrespassReview(previous)).toThrow('accounting');
 });
});
