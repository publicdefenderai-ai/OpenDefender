import {describe,it,expect,vi} from 'vitest';
import {criminalCharges,getChargeById,getChargesByJurisdiction,getSelectableCharges,classifyChargesForGuidance,isChargeIdRequiringReselection,normalizeChargeId} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {resolveGuidanceCharge} from '../shared/guidance-charge-resolution';
import {hasHeldNewYorkPlaceholder,isHeldNewYorkPlaceholder,newYorkPlaceholderNotice} from '../shared/new-york-placeholder-hold';
import {buildNewYorkSourceDatabaseSeed} from '../server/data/new-york-source-database-seed';
import {loadNewYorkAuthorityManifest} from '../server/data/new-york-manifest-loader';
const held=['ny-conspiracy','ny-recidivist-enhancement','ny-money-laundering'];
const plan=(charges:any[]=[],typed='',jurisdiction='NY')=>({caseData:{jurisdiction,charges:typed},chargeClassifications:charges});
vi.mock('../server/services/authority-source-database',()=>({getCurrentAuthoritySelectableChargeIds:async()=>new Set([...held,'ny-petit-larceny'])}));
vi.mock('../server/services/california-source-database',()=>({getCurrentCaliforniaSelectableChargeIds:async()=>new Set()}));
describe('exact New York placeholder holds',()=>{
 for(const id of held)it(`withholds ${id} across selection, classification and explanation boundaries`,()=>{
  const raw=criminalCharges.find(c=>c.id===id)!;expect(raw).toBeDefined();expect(isChargeIdRequiringReselection(id)).toBe(true);expect(normalizeChargeId(id)).toBe(id);expect(getChargeById(id)).toBeUndefined();
  expect(getChargesByJurisdiction('NY').some(c=>c.id===id)).toBe(false);expect(getSelectableCharges().some(c=>c.id===id)).toBe(false);expect(classifyChargesForGuidance([id])).toEqual([]);expect(getChargeExplanation(raw.name,'NY','en',id)).toBeNull();
  for(const jurisdiction of ['NY','New York']){expect(resolveGuidanceCharge({id,name:raw.name,code:raw.code,classification:raw.category},jurisdiction)).toBeUndefined();expect(resolveGuidanceCharge({name:raw.name,code:raw.code,classification:raw.category},jurisdiction)).toBeUndefined();expect(hasHeldNewYorkPlaceholder(plan([{id}], '',jurisdiction))).toBe(true);expect(hasHeldNewYorkPlaceholder(plan([],raw.code,jurisdiction))).toBe(true);expect(hasHeldNewYorkPlaceholder(plan([],raw.name,jurisdiction))).toBe(true);}
 });
 it('keeps a stale database eligibility list from authorizing the three IDs',async()=>{
  const {getCurrentAuthoritySelectableChargeIds}=await import('../server/services/authority-eligibility');const ids=await getCurrentAuthoritySelectableChargeIds(['NY']);for(const id of held)expect(ids.has(id)).toBe(false);expect(ids.has('ny-petit-larceny')).toBe(true);
 });
 it('keeps historical evidence intact while excluding the three IDs from future eligibility proposals',()=>{
  const manifest=loadNewYorkAuthorityManifest();const seed=buildNewYorkSourceDatabaseSeed(manifest);expect(seed.selectableChargeIds).toHaveLength(91);for(const id of held){expect(manifest.catalogRecords.find(r=>r.chargeId===id)?.disposition).toBe("require_exact_reselection");expect(manifest.catalogRecords.find(r=>r.chargeId===id)?.provisions).toHaveLength(1);expect(seed.links.some(link=>link.chargeId===id)).toBe(false);expect(seed.selectableChargeIds).not.toContain(id);}expect(seed.sources).toHaveLength(86);expect(seed.snapshots).toHaveLength(93);expect(seed.links).toHaveLength(93);
 });
 it('recognizes mixed saved plans and known ID-less aliases without affecting unrelated states or charge-free plans',()=>{
  expect(hasHeldNewYorkPlaceholder(plan([{id:'ny-petit-larceny'},{id:held[0]}]))).toBe(true);expect(hasHeldNewYorkPlaceholder(plan([],`ny-petit-larceny, ${held[1]}`))).toBe(true);expect(hasHeldNewYorkPlaceholder(plan([], 'Money Laundering', 'TX'))).toBe(false);expect(hasHeldNewYorkPlaceholder(plan())).toBe(false);expect(hasHeldNewYorkPlaceholder(plan([{id:'ny-petit-larceny'}]))).toBe(false);expect(hasHeldNewYorkPlaceholder(plan([], 'Unrelated Money Laundering Specialist'))).toBe(false);expect(isHeldNewYorkPlaceholder({id:'tx-money-laundering',name:'Money Laundering'},'TX')).toBe(false);
 });
 for(const lang of ['en','es','zh'])it(`supplies an actual localized notice for ${lang}`,()=>{expect(newYorkPlaceholderNotice(lang)).not.toMatch(/legalGuidance|guidance\./);expect(newYorkPlaceholderNotice(lang).length).toBeGreaterThan(30);});
});
