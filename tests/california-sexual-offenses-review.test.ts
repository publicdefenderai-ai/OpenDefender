import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import {describe,expect,it} from 'vitest';
import additions from '../shared/california-sexual-offenses-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {readSexualOffensesReview,validateSexualOffensesReview,readSexualOffensesReviewAcquisition} from '../scripts/data-review/california-verification/sexual-offenses-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California combined sexual-offense publication',()=>{
  it('accounts for 64 distinct branches without closing the remaining family or attorney question',()=>{
    expect(validateSexualOffensesReview()).toEqual({additions:64,primarySections:13,reusedSections:19,newSections:6,newVersions:6,promotedResearchSections:3,newBenchmarkMatches:42,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readSexualOffensesReview();
    expect(r.crosswalk.find(i=>i.id==='1015')?.boundedChargeIds).toContain('ca-pen-287-c-2-b');
    expect(r.crosswalk.find(i=>i.id==='820')?.boundedChargeIds).toEqual(['ca-pen-273ab-a']);
    expect(r.crosswalk.find(i=>i.id==='1145')?.boundedChargeIds).toEqual([]);
    expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['felony-false-imprisonment-fine','sexual-family-open-branches','custody-sexual-conduct-branches']));
    for(const code of ['286(e)','287(e)','289(a)(1)(A)','289(a)(1)(B)'])expect(additions.some(a=>a.code===code)).toBe(false);
  });
  it('does not copy the sodomy penalties into similar oral-copulation or penetration branches',()=>{
    // Independent statutory distinctions: 286(c)(2) differs from 287(c)(2)/289(a)(1).
    for(const [code,term] of [['286(c)(2)(B)','9, 11 or 13'],['287(c)(2)(B)','8, 10 or 12'],['286(c)(2)(C)','7, 9 or 11'],['287(c)(2)(C)','6, 8 or 10'],['289(a)(1)(C)','6, 8 or 10'],['286(d)(3)','7, 9 or 11'],['287(d)(3)','8, 10 or 12']])expect(row(code).penalty).toContain(term+' years in state prison');
    for(const code of ['286(b)(2)','287(b)(2)','289(i)'])expect(row(code).summary.toLowerCase()).toContain('over 21');
    expect(row('269(a)').summary).toContain('at least seven years younger');
    expect(row('288.7(a)').penalty).toContain('25 years to life');
    expect(row('288.7(b)').penalty).toContain('15 years to life');
    expect(row('288.7(a)').summary).toContain('ten or younger');
    expect(row('288.5(a)').summary).toContain('at least three months');
  });
  it('keeps special fines, wobbler alternatives, incapacity and actor restrictions visible',()=>{
    expect(row('266j').penalty).toContain('$15,000');expect(row('266j').penalty).toContain('additional fine up to $25,000');
    expect(row('266h(b)(2)').penalty).toContain('additional fine up to $5,000');
    expect(row('286(c)(2)(B)').penalty).toContain('additional fine up to $70');
    for(const code of ['286(h)','287(h)','289(c)','288(c)(2)','288.2(a)(1)','288.2(a)(2)']){
      expect(row(code).categories).toEqual(['felony','misdemeanor']);expect(row(code).penalty).toContain('364 days');
    }
    expect(row('287(g)').summary).toContain('Disability alone does not prove incapacity');
    expect(row('288(b)(2)').summary).toContain('exclude a spouse or equivalent domestic partner');
    expect(row('288.2(a)(1)').summary).toContain('both sexual-arousal intent and intent');
    expect(getChargeById('ca-pen-269-a')?.searchAliases).toContain('PC 269(a)(3)');
    expect(getChargeById('ca-pen-266i-b-2')?.searchAliases).toContain('PC 266i(a)(2)');
    expect(row('288.4(a)(1)').penalty).toContain('qualifying prior');
    expect(row('287(c)(2)(B)').penalty).toContain('life without parole');
    expect(row('287(k)').supportingKeys).not.toContain('PEN:667.61');
  });
  it('rejects altered penalties, lost dependencies, source corruption and invented benchmark matches',()=>{
    const a=structuredClone(additions);a.find(x=>x.code==='287(c)(2)(B)')!.penalty=row('286(c)(2)(B)').penalty;
    expect(()=>validateSexualOffensesReview(undefined,a)).toThrow('Definition changed');
    const r=readSexualOffensesReview();r.records.find(x=>x.id==='ca-pen-266j')!.sources=r.records.find(x=>x.id==='ca-pen-266j')!.sources.filter(s=>s.key!=='PEN:266k');
    expect(()=>validateSexualOffensesReview(r)).toThrow('Incomplete reviewed sources');
    const acquisition=readSexualOffensesReviewAcquisition();Object.values(acquisition.documents)[0][0].contentXml+='modified';
    expect(()=>validateSexualOffensesReview(undefined,undefined,acquisition)).toThrow();
    const i=readSexualOffensesReview();i.records[0].instructionEvidence[0].lastPage++;
    expect(()=>validateSexualOffensesReview(i)).toThrow('Unbound instruction');
    const gap=readSexualOffensesReview();gap.remainingFindings=[];
    expect(()=>validateSexualOffensesReview(gap)).toThrow('accounting');
  });
  it('carries all branches to search, explanations, guidance and the freshness boundary',()=>{
    for(const d of additions){
      const c=getCaliforniaCanonicalRecord(d.id)!;
      expect(getChargeById(d.id)).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(classifyChargesForGuidance([d.id])[0]).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      for(const group of ['Sexual Offenses','Sexual Crimes'])expect(chargeCategories[group]).toContain(d.id);
      expect(getChargeById(d.id)?.searchAliases).toContain('PC '+d.code);
      for(const k of ['PEN:'+d.code.split('(')[0],...d.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,d.id)).toMatchObject({plainSummary:d.summary,degreeContext:d.penalty,untranslated:lang!=='en'});
    }
  });
});
