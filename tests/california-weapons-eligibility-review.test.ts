import {describe,expect,it} from 'vitest';
import {CA_CATALOG_COUNTS} from './fixtures/california-catalog-counts';
import additions from '../shared/california-weapons-eligibility-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {readWeaponsEligibilityReview,validateWeaponsEligibilityReview,readWeaponsEligibilityReviewAcquisition,weaponsEligibilityDocuments} from '../scripts/data-review/california-verification/weapons-eligibility-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California firearm eligibility, ammunition and concealed carrying',()=>{
  it('accounts for the combined batch without clearing enforceability or attorney holds',()=>{
    expect(validateWeaponsEligibilityReview()).toEqual({additions:24,primarySections:9,reusedSections:57,newSections:101,newVersions:101,promotedResearchSections:23,newBenchmarkMatches:9,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readWeaponsEligibilityReview();
    expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['felony-false-imprisonment-fine','weapons-enforceability-and-remaining-branches','tear-gas-sibling-penalties','hate-enhancements-and-storage-siblings']));
    expect(r.remainingFindings.some(f=>f.id==='weapons-predicate-and-enforceability-review')).toBe(false);
    for(const code of ['21310','21510','25850','29800(a)(1)','30605','22810(g)(2)'])expect(additions.some(a=>a.code===code)).toBe(false);
    expect(receipt.heldSourceKeys).toEqual([]);
  });
  it('distinguishes warrant, conviction dates, ten-year and misdemeanor-only branches',()=>{
    expect(row('29805(a)(2)').summary).toContain('does not require a prior conviction');
    expect(row('29805(b)').summary).toContain('2019');
    for(const [code,year] of [['c','2020'],['d','2023'],['e','2024'],['f','2024'],['g','2025'],['h','2026']]){
      expect(row(`29805(${code})`).summary).toContain(year);
      expect(row(`29805(${code})`).categories).toEqual(['g','h'].includes(code)?['misdemeanor']:['felony','misdemeanor']);
    }
    const t=sourceText(weaponsEligibilityDocuments()['PEN:29805'][0].contentXml);
    const g=t.slice(t.indexOf('(g)'),t.indexOf('(i)'));
    expect(g).toContain('county jail not exceeding one year');expect(g).not.toContain('state prison');
  });
  it('keeps wardship, adult certification, probation and protective-order routes separate',()=>{
    expect(row('29820(b)').summary).toContain('30');
    expect(row('29820(b)').supportingKeys).toContain('WIC:602');
    expect(row('29800(b)').summary).toContain('adult-court conviction');
    expect(row('29900(b)(1)').summary).toContain('wardship adjudication alone is not');
    expect(row('29815(a)').summary).toContain('express');
    expect(row('29825(a)').categories).toEqual(['felony','misdemeanor']);
    expect(row('29825(b)').categories).toEqual(['misdemeanor']);
    expect(row('29825(a)').penalty).toContain('1203.097');
    const c=getCaliforniaCanonicalRecord(row('29825(a)').id)!;
    expect(c.sources.some(s=>new URL(s.url).searchParams.get('lawCode')==='CCP')).toBe(true);
    for(const code of ['29825(a)','29825(b)','29900(a)(1)','29900(b)(1)'])expect(row(code).supportingKeys).not.toContain('PEN:29850');
    expect(row('29900(a)(1)').penalty).toContain('at least six months');
  });
  it('uses the correct ammunition definition and does not generalize the delivery defense',()=>{
    expect(row('30305(a)(1)').summary).toContain('16150(b)');
    expect(row('30305(a)(1)').summary).toContain('magazines');
    expect(row('30305(a)(1)').summary).toContain('does not extend to every prohibited category');
    expect(row('30305(b)(1)').summary).toContain('loaded-cartridge definition in 16150(a)');
    expect(row('30305(b)(1)').penalty).toContain('six months');
    expect(getCaliforniaCanonicalRecord(row('30305(b)(1)').id)!.sources.some(s=>new URL(s.url).searchParams.get('lawCode')==='CIV')).toBe(true);
    const t=sourceText(weaponsEligibilityDocuments()['PEN:16150'][0].contentXml);
    expect(t).toContain('magazine, clip');expect(t).toContain('subdivision (a) of Section 30305');
  });
  it('preserves concealed-carry conduct alternatives, cumulative grading conditions and defenses',()=>{
    expect(row('25400(a)(1)').summary).toContain('control or direction');
    expect(row('25400(a)(3)').summary).toContain('not the statutory requirement');
    for(const code of ['25400(a)(1)','25400(a)(2)','25400(a)(3)']){
      expect(row(code).penalty).toContain('must both apply');
      expect(row(code).penalty).toContain('No single penalty');
      expect(row(code).supportingKeys).toEqual(expect.arrayContaining(['PEN:25600','PEN:25605','PEN:25610','PEN:25655']));
    }
    expect(row('22810(g)(1)').summary).toContain('Merely carrying');
  });
  it('rejects changed grading, dropped source dependencies, corrupted text and cleared holds',()=>{
    const a=structuredClone(additions);a.find(x=>x.code==='29805(g)')!.categories=['felony'];
    expect(()=>validateWeaponsEligibilityReview(undefined,a)).toThrow('Definition changed');
    const r=readWeaponsEligibilityReview();r.records[0].sources.pop();
    expect(()=>validateWeaponsEligibilityReview(r)).toThrow('Incomplete reviewed sources');
    const acq=readWeaponsEligibilityReviewAcquisition();Object.values(acq.documents)[0][0].contentXml+='changed';
    expect(()=>validateWeaponsEligibilityReview(undefined,undefined,acq)).toThrow();
    const gap=readWeaponsEligibilityReview();gap.remainingFindings=[];
    expect(()=>validateWeaponsEligibilityReview(gap)).toThrow('accounting');
  });
  it('carries all branches through guidance, aliases, language notices and source freshness',()=>{
    for(const d of additions){
      const c=getCaliforniaCanonicalRecord(d.id)!;
      expect(getChargeById(d.id)).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(classifyChargesForGuidance([d.id])[0]).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(chargeCategories['Weapons']).toContain(d.id);
      expect(getChargeById(d.id)?.searchAliases).toContain('PC '+d.code);
      for(const k of ['PEN:'+d.code.split('(')[0],...d.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,d.id)).toMatchObject({plainSummary:d.summary,degreeContext:d.penalty,untranslated:lang!=='en'});
    }
  });
});
