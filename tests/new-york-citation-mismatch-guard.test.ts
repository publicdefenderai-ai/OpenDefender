import {describe,it,expect} from 'vitest';
import {CHARGE_CITATIONS} from '../shared/criminal-charge-citations';
import {criminalCharges,getChargeById,getVerifiedCitation,isCitationVerified,getVerifiedSourceUrl,getInstructionRef,getInstructionUrl,getInstructionPaywall,classifyChargesForGuidance} from '../shared/criminal-charges';
import research from '../scripts/data-review/new-york-first-pass/candidate-review.json';
import frozen from '../scripts/data-review/new-york-first-pass/overlay-baseline.json';
import baseline from '../scripts/data-review/new-york-first-pass/baseline.json';
import {trainingOverlays} from '../scripts/data-review/new-york-first-pass/overlay-inventory.mjs';
// Independent exact list: do not derive the runtime guard's expected scope from
// the confidence flags under test, and do not import this research list at runtime.
const ids=[
 'ny-alcohol-in-park','ny-computer-fraud','ny-conspiracy','ny-curfew-violation',
 'ny-fake-id','ny-forgery','ny-harassment-stalking','ny-insurance-fraud',
 'ny-money-laundering','ny-possession-of-prohibited-weapon','ny-recidivist-enhancement',
 'ny-solicitation','ny-theft-by-receiving','ny-trespass-after-warning',
];
describe('New York interim citation mismatch safeguard',()=>{
 it('covers the fourteen independently inventoried identity mismatches',()=>{
  expect(ids).toHaveLength(14);expect(new Set(ids).size).toBe(14);
  expect(research.citationOverlayInventory.rows.filter(r=>r.sectionStatus==='section_identity_mismatch').map(r=>r.id).sort()).toEqual([...ids].sort());
  expect(frozen.filter(r=>ids.includes(r.id)&&r.confidence==='high')).toHaveLength(12);
  expect(frozen.filter(r=>ids.includes(r.id)&&r.confidence==='medium')).toHaveLength(2);
 });
 it('changes only confidence for these observed overlays, preserving original citations and source metadata',()=>{
  const current=trainingOverlays(CHARGE_CITATIONS);
  for(const id of ids){
   const original=frozen.find(row=>row.id===id)!;
   expect(current.find(row=>row.id===id)).toEqual({...original,confidence:'needs_review'});
  }
 });
 it('withholds verified citations, source links and instruction metadata for every affected ID',()=>{
  for(const id of ids){
   const charge=criminalCharges.find(c=>c.id===id);expect(charge,id).toBeDefined();
   expect(isCitationVerified(charge!),id).toBe(false);
   expect(getVerifiedCitation(charge!),id).toBeNull();
   expect(getVerifiedSourceUrl(charge!),id).toBeNull();
   expect(getInstructionRef(charge!),id).toBeNull();
   expect(getInstructionUrl(charge!),id).toBeNull();
   expect(getInstructionPaywall(charge!),id).toBeNull();
   // The current records have no high-confidence inline fallback. A later
   // publication that adds one must reconcile this guard deliberately.
   expect(charge!.dataConfidence,id).not.toBe('high');
  }
 });
 it('omits disputed citations and respects the later placeholder identity holds',()=>{
  const classifications=classifyChargesForGuidance(ids);
  expect(classifications.map(c=>c.id).sort()).toEqual(ids.filter(id=>!['ny-conspiracy','ny-recidivist-enhancement','ny-money-laundering'].includes(id)).sort());
  for(const c of classifications){expect(c.verifiedCitation,c.id).toBeNull();expect(c,c.id).not.toHaveProperty('code');}
 });
 it('leaves catalog identity/section/category unchanged and does not substitute a different offense',()=>{
  for(const id of ids){
   const charge=getChargeById(id)??criminalCharges.find(c=>c.id===id)!;const original=baseline.rows.find(r=>r.id===id)!;
   expect(charge.code,id).toBe(original.catalogCode);
   expect(charge.name,id).toBe(getChargeById(id)&&original.disposition==='exact_alias_rename'?original.canonicalTitle:original.catalogLabel);
   expect(charge.category,id).toBe(original.catalogCategory);
  }
  expect(CHARGE_CITATIONS['ny-trespass-after-warning'].citation).toBe('N.Y. Penal Law § 140.05');
  expect(getChargeById('ny-trespass-after-warning')!.code).toBe('140.10');
 });
 it('preserves a separate verified New York citation and other-state citation behavior',()=>{
  expect(getVerifiedCitation(getChargeById('ny-robbery-in-the-third-degree')!)).toBe('N.Y. Penal Law § 160.05');
  expect(getVerifiedCitation(getChargeById('al-murder-in-the-first-degree')!)).toBe('Ala. Code § 13A-6-2');
 });
});
