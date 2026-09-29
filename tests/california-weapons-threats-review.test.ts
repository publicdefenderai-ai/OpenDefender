import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {weaponsThreatsDocuments} from '../scripts/data-review/california-verification/weapons-threats-review';
import previous from '../scripts/data-review/output/california-registration-exploitation-review.json';
import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import {describe,expect,it} from 'vitest';
import additions from '../shared/california-weapons-threats-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {readWeaponsThreatsReview,validateWeaponsThreatsReview,readWeaponsThreatsReviewAcquisition} from '../scripts/data-review/california-verification/weapons-threats-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California weapons, threats and hate crimes publication',()=>{
  it('accounts for 43 conduct branches and preserves the consequential remaining research',()=>{
    expect(validateWeaponsThreatsReview()).toEqual({additions:43,primarySections:23,reusedSections:16,newSections:56,newVersions:56,promotedResearchSections:27,newBenchmarkMatches:28,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readWeaponsThreatsReview();
    expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['felony-false-imprisonment-fine','weapons-predicate-and-enforceability-review','hate-enhancements-and-storage-siblings']));
    for(const code of ['21310','21510','25850','29805','30305','30605','25145'])expect(additions.some(a=>a.code===code)).toBe(false);
    expect(previous.decisions.some(d=>d.includes('clinical term')&&d.includes('not a quotation'))).toBe(true);
  });
  it('preserves current hate-crime grading and symbol elements rather than copying old instruction headings',()=>{
    const r=readWeaponsThreatsReview(),d=weaponsThreatsDocuments();
    expect(r.sourceAnomalies.map(a=>a.id)).toEqual(['CA-008','CA-009']);
    expect(sourceText(d['PEN:422.6'][0].contentXml)).toContain('or pursuant to subdivision (h) of Section 1170');
    expect(row('422.6(a)').categories).toEqual(['felony','misdemeanor']);
    expect(row('422.6(a)').penalty).toContain('does not state a numeric minimum');
    expect(row('422.6(a)').summary).toContain('substantial factor');
    expect(row('11411(b)').calcrim).toEqual([]);
    expect(r.crosswalk.find(x=>x.id==='1303')).toMatchObject({sourceDiscrepancy:'CA-009',boundedChargeIds:['ca-pen-11411-c']});
    expect(row('11411(d)').summary).toContain('listed-site alternative');
    expect(row('11411(c)').penalty).toContain('$15,000');
  });
  it('keeps stalking, brandishing and explosives sentence branches distinct',()=>{
    expect(row('646.9(a)').categories).toEqual(['felony','misdemeanor']);
    expect(row('646.9(b)').categories).toEqual(['felony']);
    expect(row('646.9(c)(1)').penalty).toContain('2, 3 or 5');
    expect(row('646.9(c)(2)').categories).toEqual(['felony']);
    expect(row('417(a)(1)').penalty).toContain('30 days to six months');
    expect(row('417(a)(2)(B)').penalty).toContain('three months to six months');
    expect(row('417(c)').penalty).toContain('nine months to 364 days');
    expect(row('417.3').penalty).toContain('$3,000');
    expect(row('18750').penalty).toContain('5, 7 or 9');
    expect(row('18755(a)').penalty).toContain('without the possibility of parole');
    expect(row('18755(b)').penalty).toContain('does not say without parole');
    expect(row('26100(c)').summary).toContain('other than a motor-vehicle occupant');
  });
  it('preserves the 2026 storage elements, exceptions and distinct first/second/third degree penalties',()=>{
    const d=weaponsThreatsDocuments();
    expect(sourceText(d['PEN:25100'][0].contentXml)).toContain('operative on January 1, 2026');
    for(const code of ['25100(a)','25100(b)','25100(c)']){
      expect(row(code).supportingKeys).toEqual(expect.arrayContaining(['PEN:25105','PEN:25145','PEN:25115','PEN:25120','PEN:25000']));
      expect(row(code).summary).toContain('Parent/guardian');
    }
    expect(row('25100(a)').categories).toEqual(['felony','misdemeanor']);
    expect(row('25100(b)').penalty).toContain('364 days');
    expect(row('25100(c)').penalty).toContain('six months');
    expect(row('25100(c)').summary).toContain('Actual access or resulting injury is not an express element');
    expect(row('25200(b)').penalty).toContain('$5,000');
    const c=getCaliforniaCanonicalRecord('ca-pen-26100-a')!;
    expect(c.sources.some(s=>new URL(s.url).searchParams.get('lawCode')==='FGC'&&new URL(s.url).searchParams.get('sectionNum')==='2006')).toBe(true);
  });
  it('rejects changed penalties, missing exception dependencies, source corruption and cleared discrepancies',()=>{
    const a=structuredClone(additions);a.find(x=>x.code==='18755(b)')!.penalty=row('18755(a)').penalty;
    expect(()=>validateWeaponsThreatsReview(undefined,a)).toThrow('Definition changed');
    const r=readWeaponsThreatsReview();r.records.find(x=>x.id==='ca-pen-25100-a')!.sources.pop();
    expect(()=>validateWeaponsThreatsReview(r)).toThrow('Incomplete reviewed sources');
    const acquisition=readWeaponsThreatsReviewAcquisition();Object.values(acquisition.documents)[0][0].contentXml+='modified';
    expect(()=>validateWeaponsThreatsReview(undefined,undefined,acquisition)).toThrow();
    const gap=readWeaponsThreatsReview();gap.sourceAnomalies=[];
    expect(()=>validateWeaponsThreatsReview(gap)).toThrow('accounting');
  });
  it('carries all branches to search, explanations, guidance and the freshness boundary',()=>{
    for(const d of additions){
      const c=getCaliforniaCanonicalRecord(d.id)!;
      expect(getChargeById(d.id)).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(classifyChargesForGuidance([d.id])[0]).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      const group=['646.9','422.6','11411','11412','11413'].includes(d.code.split('(')[0])?'Violent Crimes':'Weapons';
      expect(chargeCategories[group]).toContain(d.id);
      expect(getChargeById(d.id)?.searchAliases).toContain('PC '+d.code);
      for(const k of ['PEN:'+d.code.split('(')[0],...d.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,d.id)).toMatchObject({plainSummary:d.summary,degreeContext:d.penalty,untranslated:lang!=='en'});
    }
  });
});
