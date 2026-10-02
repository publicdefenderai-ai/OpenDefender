import {describe,it,expect} from 'vitest';
import additions from '../shared/california-priority-person-additions.json';
import {readPriorityPersonReview,validatePriorityPersonReview,renderPriorityPersonReview} from '../scripts/data-review/california-verification/priority-person-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import prior from '../scripts/data-review/output/california-major-omission-audit.json';
describe('California priority person publication',()=>{
 it('publishes five identities with one source promotion and preserves unaffected audit rows',()=>{
  expect(validatePriorityPersonReview()).toEqual({additions:5,primarySections:5,reusedSections:15,newSections:1,newVersions:1});
  const r=readPriorityPersonReview();
  expect(r.otherCodeProbes).toEqual(prior.otherCodeProbes);
  for(const old of prior.benchmarkRows.filter(r=>!['1400','603','604'].includes(r.instructionId)))expect(r.benchmarkRows.find(r=>r.instructionId===old.instructionId)).toEqual(old);
  for(const old of prior.peopleWeaponsRows.filter(r=>!['908','926'].includes(r.instructionId)))expect(r.peopleWeaponsRows.find(r=>r.instructionId===old.instructionId)).toEqual(old);
  expect(renderPriorityPersonReview()).not.toMatch(/[—–]/);
 });
 it('binds subdivision spans exactly rather than inheriting neighboring fines or roles',()=>{
  const r=readPriorityPersonReview();
  for(const row of r.records){const span=row.primarySpan;expect(r.sources.find(s=>s.key===span.key)!.text.slice(span.start,span.end)).toBe(span.text);}
  const b=additions.find(a=>a.id==='ca-pen-243-b')!,c=additions.find(a=>a.id==='ca-pen-243-c-1')!;
  expect(b.categories).toEqual(['misdemeanor']);expect(c.categories).toEqual(['felony','misdemeanor']);
  expect(c.summary).toContain('narrower');expect(c.summary).toContain('requiring professional medical treatment');
  expect(c.penalty).not.toContain('$10,000');
 });
 it('keeps gang participation distinct from status and enhancements and retains probation conditions',()=>{
  const a=additions.find(a=>a.id==='ca-pen-186-22-a')!;
  for(const phrase of ['At least two members','membership alone is not enough','currently charged offense cannot','distinct from a gang enhancement'])expect(a.summary).toContain(phrase);
  expect(a.penalty).toContain('180 days');expect(a.penalty).toContain('unusual-case');
  const instruction=readPriorityPersonReview().instructions.find(i=>i.id==='1400')!;
  expect(instruction.pages.map(p=>p.text).join(' ')).toContain('At least two members');
 });
 it('requires intent to kill for attempted voluntary manslaughter and halves the custody terms',()=>{
  const a=additions.find(a=>a.id==='ca-attempted-voluntary-manslaughter')!;
  expect(a.summary).toContain('intent to kill');expect(a.summary).toContain('alternative theories');
  for(const term of ['18 months','3 years','5 years 6 months','half-fine rule'])expect(a.penalty).toContain(term);
  expect(getChargeById(a.id)?.searchAliases).toContain('PC 664/192(a)');
  expect(getCaliforniaCanonicalRecord(a.id)?.sources.some(s=>s.url.includes('sectionNum=192'))).toBe(true);
 });
 it('propagates IDs and alternative tiers to guidance and provides explicit untranslated notices',()=>{
  for(const a of additions){
   const c=getChargeById(a.id)!;expect(c.categories).toEqual(a.categories);
   expect(chargeCategories['Violent Crimes']).toContain(a.id);
   for(const lang of ['es','zh']){const e=getChargeExplanation(a.title,'CA',lang,a.id)!;expect(e.untranslated).toBe(true);expect(e.plainSummary).toBe(a.summary);}
   expect(getCaliforniaRecordEvidenceStatus(getCaliforniaCanonicalRecord(a.id)!,new Date(receipt.expiresAt))).not.toBe('current');
  }
  expect(classifyChargesForGuidance(['ca-pen-186-22-a'])[0].categories).toEqual(['felony','misdemeanor']);
 });
 it('rejects changes to source text, subdivision bounds and source hashes',()=>{
  const a=readPriorityPersonReview();a.sources[0].text+=' changed';expect(()=>validatePriorityPersonReview(a)).toThrow('drift');
  const b=readPriorityPersonReview();b.records[0].primarySpan.start++;expect(()=>validatePriorityPersonReview(b)).toThrow('drift');
  const c=readPriorityPersonReview();c.records[0].definitionSha256='wrong';expect(()=>validatePriorityPersonReview(c)).toThrow('drift');
 });
});
