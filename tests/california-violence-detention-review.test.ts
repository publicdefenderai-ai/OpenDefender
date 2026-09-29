import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import {describe,expect,it} from 'vitest';
import additions from '../shared/california-violence-detention-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {readViolenceDetentionReview,validateViolenceDetentionReview} from '../scripts/data-review/california-verification/violence-detention-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {californiaPrimaryIdentity} from '../shared/california-law-codes';
import {getChargeById,classifyChargesForGuidance,chargeCategories} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California combined serious violence, abuse and detention',()=>{
  it('publishes 28 bounded choices and preserves unresolved fine and sibling questions',()=>{
    expect(validateViolenceDetentionReview()).toEqual({additions:28,primarySections:18,reusedSections:26,newSections:44,newVersions:44,promotedResearchSections:36,newBenchmarkMatches:25,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readViolenceDetentionReview();
    expect(r.crosswalk.find(i=>i.id==='820')?.boundedChargeIds).toEqual(['ca-pen-273ab-a']);
    expect(r.crosswalk.find(i=>i.id==='1243')?.boundedChargeIds).toEqual(['ca-pen-236-1-a','ca-pen-236-1-b']);
    expect(r.crosswalk.find(i=>i.id==='1015')?.status).toBe('no_same_section_catalog_candidate');
    expect(r.remainingFindings.map(f=>f.id)).toContain('felony-false-imprisonment-fine');
    expect(row('237(a)').penalty).toContain('requires separate review');
    expect(row('236').categories).toEqual(['misdemeanor']);
    expect(row('237(a)').categories).toEqual(['felony']);
    expect(row('236').penalty).toContain('364 days');
  });
  it('preserves full section suffixes through citations, URLs, pins and evidence gates',()=>{
    expect(californiaPrimaryIdentity('PEN','273ab(a)').key).toBe('PEN:273ab');
    expect(californiaPrimaryIdentity('PEN','273a(a)').key).toBe('PEN:273a');
    expect(californiaPrimaryIdentity('PEN','288.5(a)').key).toBe('PEN:288.5');
    expect(()=>californiaPrimaryIdentity('PEN','273ab/other')).toThrow();
    const c=getCaliforniaCanonicalRecord('ca-pen-273ab-a')!;
    expect(c.citation).toBe('Cal. Penal Code § 273ab(a)');
    expect(new URL(c.sources.find(s=>s.kind==='statute')!.url).searchParams.get('sectionNum')).toBe('273ab');
    expect(c.sources.some(s=>new URL(s.url).searchParams.get('sectionNum')==='273a')).toBe(false);
    expect(pins).toHaveProperty('PEN:273ab');
    expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
    expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
  });
  it('preserves consequential sentencing distinctions and exceptions',()=>{
    expect(row('206').penalty).toContain('ten years');
    expect(row('206').penalty).toContain('January 1, 2026');
    expect(row('206').supportingKeys).toContain('PEN:206.1');
    expect(row('273ab(a)').penalty).toContain('25 years to life');
    expect(row('273ab(b)').penalty).toContain('possibility of parole');
    expect(row('273a(a)').categories).toEqual(['felony','misdemeanor']);
    expect(row('273a(b)').penalty).toContain('six months');
    expect(row('273.5(a)').penalty).toContain('within seven years');
    expect(row('207(a)').penalty).toContain('parent/court-access exceptions');
    expect(row('209(a)').penalty).toContain('life without the possibility of parole');
    for(const code of ['236.1(a)','236.1(b)','236.1(c)']){
      expect(row(code).penalty).toContain('additional fine up to $1 million');
      expect(row(code).supportingKeys).toContain('PEN:236.4');
    }
    expect(row('236.1(c)').penalty).toContain('15 years to life');
    expect(row('278.5(a)').supportingKeys).toContain('PEN:278.7');
    expect(row('278.5(a)').summary).toContain('reporting and custody-proceeding requirements');
  });
  it('rejects altered penalties, lost exception sources and invented benchmark coverage',()=>{
    const a=structuredClone(additions);a.find(x=>x.code==='273ab(a)')!.penalty=row('273a(a)').penalty;
    expect(()=>validateViolenceDetentionReview(undefined,a)).toThrow('Definition changed');
    const r=readViolenceDetentionReview();r.records.find(r=>r.id==='ca-pen-278-5-a')!.sources=r.records.find(r=>r.id==='ca-pen-278-5-a')!.sources.filter(s=>s.key!=='PEN:278.7');
    expect(()=>validateViolenceDetentionReview(r)).toThrow('Incomplete reviewed sources');
    const i=readViolenceDetentionReview();i.records[0].instructionEvidence[0].lastPage++;
    expect(()=>validateViolenceDetentionReview(i)).toThrow('Unbound instruction');
    const gap=readViolenceDetentionReview();gap.remainingFindings=[];
    expect(()=>validateViolenceDetentionReview(gap)).toThrow('accounting');
  });
  it('carries reviewed alternatives, penalties and language notices to catalog and guidance',()=>{
    for(const d of additions){
      const c=getCaliforniaCanonicalRecord(d.id)!;
      expect(getChargeById(d.id)).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(classifyChargesForGuidance([d.id])[0]).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(chargeCategories['Violent Crimes']).toContain(d.id);
      for(const k of ['PEN:'+d.code.split('(')[0],...d.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,d.id)).toMatchObject({plainSummary:d.summary,degreeContext:d.penalty,untranslated:lang!=='en'});
    }
  });
});
