import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import {describe,expect,it} from 'vitest';
import additions from '../shared/california-traffic-additions.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import pins from '../shared/california-retained-pins.json';
import {readTrafficReview,validateTrafficReview,readTrafficReviewAcquisition} from '../scripts/data-review/california-verification/traffic-review';
import {californiaTransitionRequiresReview} from '../shared/california-source-transitions';
import {getCaliforniaEvidenceStatus} from '../shared/california-freshness';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California traffic publication',()=>{
  it('accounts for all 24 branches without closing the benchmark',()=>{
    expect(validateTrafficReview()).toEqual({additions:24,primarySections:12,reusedSections:30,newSections:29,newVersions:31,promotedResearchSections:16,configuredSelectable:CA_CATALOG_COUNTS.configured});
    const r=readTrafficReview();expect(r.crosswalk).toHaveLength(30);
    for(const id of ['2141','2151','2242'])expect(r.crosswalk.find(x=>x.instruction===id)?.status).toBe('unpublished_branch_requires_substantive_review');
    expect(r.remainingGroups.every(g=>g.status==='bounded_additions_do_not_close_group')).toBe(true);
  });
  it('rejects changed penalties, lost dependencies, and swapped future versions',()=>{
    const changed=structuredClone(additions);changed[0].penalty='No custody';
    expect(()=>validateTrafficReview(undefined,changed)).toThrow('Definition changed');
    const missing=readTrafficReview();missing.records[0].sources.pop();
    expect(()=>validateTrafficReview(missing)).toThrow('Incomplete reviewed sources');
    const future=readTrafficReview();future.sourceVersionDecisions[0].currentVersionId=future.sourceVersionDecisions[0].futureVersionId;
    expect(()=>validateTrafficReview(future)).toThrow('operative version');
    const acq=readTrafficReviewAcquisition();acq.documents['VEH:23575'].pop();
    expect(()=>validateTrafficReview(undefined,undefined,acq)).toThrow('provenance');
  });
  it('retains mandatory fines and limits infraction alternatives to their enumerated branches',()=>{
    for(const code of ['23153(a)','23153(b)','23153(d)','23153(e)','23153(f)','23153(g)']){
      expect(row(code).penalty).toContain('AND');expect(row(code).categories).toEqual(['misdemeanor','felony']);
    }
    expect(additions.filter(a=>a.categories.includes('infraction')).map(a=>a.code).sort()).toEqual(['14601.1(a)','23109(c)','40508(a)'].sort());
    expect(row('14601.1(a)').summary).toContain('12500(d)');
    expect(row('14601.1(a)').summary).toContain('12500(c)');
    expect(row('23109(c)').penalty).toContain('2029');
    expect(row('23109(b)').categories).toEqual(['misdemeanor']);
    expect(row('23109(d)').categories).toEqual(['misdemeanor']);
  });
  it('withholds affected sources at a known operative transition independently of receipt renewal',()=>{
    for(const [key,date] of [['VEH:23109','2029-01-01'],['VEH:13352','2033-01-01'],['VEH:23103.5','2033-01-01'],['VEH:23573','2033-01-01'],['VEH:23575','2033-01-01']]){
      const at=new Date(`${date}T00:00:00-08:00`);
      expect(californiaTransitionRequiresReview([key],new Date(at.getTime()-1))).toBe(false);
      expect(californiaTransitionRequiresReview([key],at)).toBe(true);
      expect(getCaliforniaEvidenceStatus(at,[key])).toBe('invalid');
      expect(californiaTransitionRequiresReview(['VEH:12951'],at)).toBe(false);
    }
  });
  it('pins all published dependencies and preserves categories, language notices and expiry through runtime lookup',()=>{
    const now=new Date(receipt.checkedAt);
    for(const a of additions){
      const c=getCaliforniaCanonicalRecord(a.id)!;
      expect(getChargeById(a.id)).toMatchObject({code:a.code,categories:a.categories,maxPenalty:a.penalty});
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({id:a.id,categories:a.categories,maxPenalty:a.penalty});
      for(const k of ['VEH:'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,now)).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,a.id)).toMatchObject({plainSummary:a.summary,degreeContext:a.penalty,untranslated:lang!=='en'});
    }
  });
});
