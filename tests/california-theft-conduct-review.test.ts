import {describe,it,expect} from 'vitest';
import supplements from '../shared/california-conduct-supplements.json';
import originals from '../shared/california-batch-one-corrections.json';
import {readTheftConductReview,validateTheftConductReview,renderTheftConductReview} from '../scripts/data-review/california-verification/theft-conduct-review';
import {validateGapReconciliation} from '../scripts/data-review/california-verification/gap-reconciliation';
import {getCaliforniaCanonicalRecord,getCaliforniaBatchCorrection,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
const original=originals.find(c=>c.id==='ca-petty-theft')!;
describe('California theft conduct supplement',()=>{
 it('keeps the same identity, reviewed punishment and historical reconciliation',()=>{
  expect(validateTheftConductReview()).toEqual({updatedChoices:1,newChoices:0,newSections:1,newVersions:1});
  expect(validateGapReconciliation()).toMatchObject({configuredChoices:644,newCharges:0});
  const c=getCaliforniaCanonicalRecord(original.id)!;
  expect(c.penalty).toBe(original.penalty.en);expect(c.categories).toEqual(original.categories);
  expect(original.summary.en).not.toContain('Theft by trick');
  expect(renderTheftConductReview()).not.toMatch(/[—–]/);
 });
 it('distinguishes possession from ownership and does not require every theory at once',()=>{
  const c=getCaliforniaBatchCorrection(original.id)!;
  for(const text of ['without consent','major part of its value or enjoyment','owner did not intend to transfer ownership','both possession and ownership',"owner's actual reliance",'A broken promise alone','alternative theories'])expect(c.summary.en).toContain(text);
  expect(getCaliforniaCanonicalRecord(original.id)?.elements).toEqual(supplements[0].elements);
 });
 it('binds corroboration rules and instruction pages to retained evidence',()=>{
  const r=readTheftConductReview();expect(r.records[0].instructions.map(i=>i.id)).toEqual(['1800','1804','1805']);
  expect(r.documents['PEN:532'][0].contentXml).toContain('corroborating circumstances');
  expect(r.records[0].sources.map(s=>s.key)).toEqual(['PEN:484','PEN:532']);
  expect(pins).toHaveProperty('PEN:532');
  expect(getCaliforniaCanonicalRecord(original.id)?.sources.some(s=>s.url.includes('sectionNum=532'))).toBe(true);
 });
 it('provides the supplement through catalog, explanations and explicit language fallback',()=>{
  expect(getChargeById(original.id)?.description).toContain('Theft by trick');
  for(const lang of ['en','es','zh']){
   const e=getChargeExplanation('Petty Theft','CA',lang,original.id)!;
   expect(e.plainSummary).toContain('Theft by false pretense');
   expect(e.sources?.some(s=>s.url?.includes('sectionNum=532'))).toBe(true);
   expect(e.untranslated).toBe(lang!=='en');expect(e.translationDraft).toBe(false);
  }
  expect(getChargeExplanation('Petty Theft','CA','en',original.id)?.degreeContext).toBe(original.penalty.en);
 });
 it('continues to expire the supplemented charge with its source receipt',()=>{
  const c=getCaliforniaCanonicalRecord(original.id)!;
  expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
  expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
 });
 it('rejects altered supplement hashes, statutory text, instruction text and predecessor bindings',()=>{
  const h=readTheftConductReview();h.records[0].supplementSha256='bad';expect(()=>validateTheftConductReview(h)).toThrow();
  const s=readTheftConductReview();s.documents['PEN:532'][0].contentXml+='bad';expect(()=>validateTheftConductReview(s)).toThrow();
  const p=readTheftConductReview();p.records[0].instructions[0].pages[0].text+='bad';expect(()=>validateTheftConductReview(p)).toThrow();
  const old=readTheftConductReview();old.previousReviewSha256='bad';expect(()=>validateTheftConductReview(old)).toThrow();
 });
});
