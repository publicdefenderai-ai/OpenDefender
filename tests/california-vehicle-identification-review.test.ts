import {describe,expect,it} from 'vitest';
import additions from '../shared/california-vehicle-identification-additions.json';
import pins from '../shared/california-retained-pins.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {readVehicleIdentificationReview,readVehicleIdentificationReviewAcquisition,validateVehicleIdentificationReview} from '../scripts/data-review/california-verification/vehicle-identification-review';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {getChargeById,classifyChargesForGuidance} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California vehicle identification and remaining duties',()=>{
  it('publishes only ten bounded branches and keeps controlling-passenger duties open',()=>{
    expect(validateVehicleIdentificationReview()).toEqual({additions:10,primarySections:9,reusedSections:7,newSections:11,newVersions:11,promotedResearchSections:3,configuredSelectable:319});
    const r=readVehicleIdentificationReview();
    expect(r.crosswalk.find(x=>x.instruction==='2242')?.chargeIds).toEqual(['ca-veh-10802']);
    for(const id of ['2141','2151'])expect(r.crosswalk.find(x=>x.instruction===id)?.status).toBe('unpublished_branch_requires_substantive_review');
    expect(r.remainingFindings).toHaveLength(7);
    expect(r.remainingFindings.filter(x=>x.status==='documented_minor_misdemeanor_deferral').map(x=>x.id)).toEqual(['vehicle-boarding-and-manipulation']);
    expect(row('20002(b)').summary).toContain('person who parked');
    expect(row('20002(b)').summary).toContain('does not cover a nondriving passenger');
  });
  it('keeps sales and possession penalties separate, with the explicit quantity and exception predicates',()=>{
    expect(row('10803(a)').penalty).toContain('2, 4 or 6 years');
    expect(row('10803(a)').penalty).toContain('$60,000');
    expect(row('10803(b)').penalty).toContain('16 months, 2 years or 3 years');
    expect(row('10803(b)').penalty).toContain('$30,000');
    for(const code of ['10803(a)','10803(b)']){
      expect(row(code).summary).toContain('parts from more than one motor vehicle');
      expect(row(code).summary).toContain('Several parts from only one vehicle');
      expect(row(code).supportingKeys).toContain('VEH:10804');
    }
    expect(row('10802').summary).toContain('single vehicle or part');
    expect(row('10801').supportingKeys).toContain('VEH:250');
    expect(row('10751(a)').summary).toContain('separate civil proceeding');
    expect(row('10501(a)').penalty).toContain('prior conviction of this same subdivision');
    expect(row('10501(a)').supportingKeys).toContain('PEN:672');
  });
  it('rejects penalty edits, deleted exceptions, invented benchmark clearance and cleared research holds',()=>{
    const a=structuredClone(additions);a.find(x=>x.code==='10803(b)')!.penalty=row('10803(a)').penalty;
    expect(()=>validateVehicleIdentificationReview(undefined,a)).toThrow('Definition changed');
    const r=readVehicleIdentificationReview();r.records.find(x=>x.id==='ca-veh-10803-a')!.sources=r.records.find(x=>x.id==='ca-veh-10803-a')!.sources.filter(x=>x.key!=='VEH:10804');
    expect(()=>validateVehicleIdentificationReview(r)).toThrow('Incomplete reviewed sources');
    const gap=readVehicleIdentificationReview();gap.crosswalk.find(x=>x.instruction==='2151')!.status='bounded_publication_match_other_branches_open';
    expect(()=>validateVehicleIdentificationReview(gap)).toThrow('Unexplained benchmark');
    const hold=readVehicleIdentificationReview();hold.remainingFindings[2].status='approved';
    expect(()=>validateVehicleIdentificationReview(hold)).toThrow('Publication accounting');
    const probe=readVehicleIdentificationReviewAcquisition();probe.missingResearchKeys=[];
    expect(()=>validateVehicleIdentificationReview(undefined,undefined,probe)).toThrow('provenance');
  });
  it('binds every published dependency while keeping research-only probes out of pins',()=>{
    const a=readVehicleIdentificationReviewAcquisition();
    expect(a.missingResearchKeys).toEqual(['HSC:113785']);
    expect(pins).not.toHaveProperty('HSC:113785');
    expect(pins).not.toHaveProperty('VEH:10853');
    for(const d of additions){
      const c=getCaliforniaCanonicalRecord(d.id)!;
      expect(getChargeById(d.id)).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      expect(classifyChargesForGuidance([d.id])[0]).toMatchObject({categories:d.categories,maxPenalty:d.penalty});
      for(const k of ['VEH:'+d.code.split('(')[0],...d.supportingKeys])expect(pins).toHaveProperty(k);
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.checkedAt))).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,d.id)).toMatchObject({plainSummary:d.summary,degreeContext:d.penalty,untranslated:lang!=='en'});
    }
  });
});
