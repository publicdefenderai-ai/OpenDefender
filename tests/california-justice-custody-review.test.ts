import {describe,expect,it} from 'vitest';
import additions from '../shared/california-justice-custody-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {CA_CATALOG_COUNTS} from './fixtures/california-catalog-counts';
import {readJusticeCustodyReview,validateJusticeCustodyReview,readJusticeCustodyReviewAcquisition,justiceCustodyDocuments,renderJusticeCustodyReview} from '../scripts/data-review/california-verification/justice-custody-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(r=>r.code===code)!;

describe('California combined justice and custody publication',()=>{
  it('accounts for shared evidence and bounded matches without clearing sibling questions',()=>{
    expect(validateJusticeCustodyReview()).toEqual({additions:45,primarySections:21,reusedSections:28,newSections:38,newVersions:38,promotedResearchSections:22,newBenchmarkMatches:32,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readJusticeCustodyReview();
    expect(r.crosswalk).toHaveLength(202);
    expect(r.remainingFindings.map(f=>f.id)).toEqual(expect.arrayContaining(['felony-false-imprisonment-fine','weapons-enforceability-and-remaining-branches','custody-capital-and-gassing-branches','custody-controlled-substances','justice-sibling-fine-limits']));
    for(const code of ['4500','243.9','4501.1','4573','4573.6'])expect(additions.some(a=>a.code.split('(')[0]===code)).toBe(false);
    expect(receipt.heldSourceKeys).toEqual([]);
    expect(receipt.checkedAt).toBe('2026-09-28T04:30:01.918254+00:00');
    expect(renderJusticeCustodyReview()).not.toContain('—');
  });
  it('keeps witness-interference alternatives, specific intent and the adviser exception',()=>{
    expect(row('136.1(a)(1)').summary).toContain('maliciously');
    expect(row('136.1(b)(1)').summary).not.toContain('maliciously');
    expect(row('136.1(c)').categories).toEqual(['felony']);
    expect(row('136.1(c)').searchAliases).toContain('PC 136.1(c)(3)');
    expect(row('137(c)').summary).toContain('attorney advising a client');
    expect(row('137(c)').categories).toEqual(['misdemeanor']);
    expect(row('137(b)').calcrim).toEqual(['2620','2621']);
  });
  it('does not merge evidence tampering actor-specific penalties or lose perjury delivery',()=>{
    expect(row('141(a)').categories).toEqual(['misdemeanor']);
    expect(row('141(b)').penalty).toContain('2, 3 or 5 years in state prison');
    expect(row('141(c)').summary).toContain('bad faith');
    expect(row('141(c)').penalty).toContain('1170(h)');
    for(const code of ['118(a)','118a']){
      expect(row(code).supportingKeys).toContain('PEN:124');
      expect(row(code).supportingKeys).toContain('PEN:126');
      expect(row(code).summary).toContain('deliver');
    }
  });
  it('preserves lawful performance and distinguishes firearm taking from nonfirearm taking',()=>{
    expect(row('69(a)').summary).toContain('Lawful recording alone');
    expect(row('148(b)').categories).toEqual(['felony','misdemeanor']);
    expect(row('148(c)').categories).toEqual(['felony']);
    expect(row('148(d)').summary).toContain('(d)(1)-(8)');
    expect(row('148.10(a)').summary).toContain('demonstrations');
    expect(row('148.10(a)').summary).toContain('caus');
  });
  it('preserves different protective-order minima and the state-prison versus 1170(h) distinction',()=>{
    expect(row('166(c)(1)').penalty).toContain('at least 48 hours');
    expect(row('166(c)(4)').penalty).toContain('in state prison');
    expect(row('166(c)(4)').penalty).not.toContain('1170(h)');
    expect(row('273.6(b)').penalty).toContain('30 days to 364 days');
    expect(row('273.6(e)').penalty).toContain('six months to 364 days');
    expect(row('273.6(e)').penalty).toContain('at least 30 days');
    expect(row('273.6(d)').penalty).toContain('1170(h)');
    expect(additions.some(a=>a.code==='273.6(a)')).toBe(false);
  });
  it('retains express consecutive custody and the two custody-weapon ranges',()=>{
    for(const code of ['4501(a)','4501(b)','4501.5','4503','4502(a)','4502(b)'])expect(row(code).penalty).toContain('consecutive');
    expect(row('4502(a)').penalty).toContain('2, 3 or 4 years');
    expect(row('4502(b)').penalty).toContain('16 months, 2 years or 3 years');
    expect(row('4574(b)').summary).toContain('release');
    expect(row('4574(c)').categories).toEqual(['misdemeanor']);
    expect(row('4574(c)').penalty).toContain('six months');
  });
  it('does not convert felony wording to felony-only when the source permits ordinary county jail',()=>{
    const text=sourceText(justiceCustodyDocuments()['PEN:4532'][0].contentXml);
    expect(text).toContain('one year and one day');
    expect(text).toContain('not less than 90 days');
    for(const code of ['4532(a)(1)','4532(a)(2)','4532(b)(1)','4532(b)(2)']){
      expect(row(code).categories).toEqual(['felony','misdemeanor']);
      expect(row(code).penalty).toContain('90 days to 364 days');
      expect(row(code).penalty).toContain('consecutive');
    }
    expect(row('4532(b)(2)').penalty).toContain('one-third reduction');
    expect(row('1320.5').summary).toContain('does not compel');
    expect(row('1320.5').categories).toEqual(['felony','misdemeanor']);
  });
  it('requires both force and officer injury for aggravated escape after arrest/remand',()=>{
    for(const code of ['836.6(a)','836.6(b)']){
      expect(row(code).summary).toContain('both force or violence and proximate serious bodily injury');
      expect(row(code).penalty).toContain('Ordinarily a misdemeanor');
    }
  });
  it('discloses fine uncertainty rather than importing neighboring penalties',()=>{
    for(const code of ['148(b)','148(c)','148(d)','166(c)(4)','273.6(d)','4574(a)','4574(b)'])expect(row(code).penalty).toContain('fine ceiling has not been resolved');
  });
  it('rejects unreviewed text, source corruption, lost dependencies and cleared research holds',()=>{
    const changed=structuredClone(additions);changed[0].penalty='No punishment';
    expect(()=>validateJusticeCustodyReview(undefined,changed)).toThrow('Definition changed');
    const evidence=readJusticeCustodyReview();evidence.records[0].sources.pop();
    expect(()=>validateJusticeCustodyReview(evidence)).toThrow('Incomplete reviewed sources');
    const a=readJusticeCustodyReviewAcquisition();Object.values(a.documents)[0][0].contentXml+='changed';
    expect(()=>validateJusticeCustodyReview(undefined,undefined,a)).toThrow();
    const holds=readJusticeCustodyReview();holds.remainingFindings=[];
    expect(()=>validateJusticeCustodyReview(holds)).toThrow('accounting');
  });
  it('projects alternatives, translations, citations and freshness through every published choice',()=>{
    for(const a of additions){
      const c=getCaliforniaCanonicalRecord(a.id)!;
      expect(getChargeById(a.id)).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({categories:a.categories,maxPenalty:a.penalty});
      expect(chargeCategories['Public Order']).toContain(a.id);
      expect(getChargeById(a.id)?.searchAliases).toContain('PC '+a.code);
      for(const key of ['PEN:'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('unmatched name','CA',lang,a.id)).toMatchObject({plainSummary:a.summary,degreeContext:a.penalty,untranslated:lang!=='en'});
    }
  });
});
