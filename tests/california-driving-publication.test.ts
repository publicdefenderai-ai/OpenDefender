import {describe,expect,it} from "vitest";
import additions from "../shared/california-driving-vessels-additions.json";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import pins from "../shared/california-retained-pins.json";
import {readDrivingPublication,validateDrivingPublication,readDrivingPublicationAcquisition} from "../scripts/data-review/california-verification/driving-publication-review";
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from "../shared/california-authority";
import {getChargeById,chargeCategories,classifyChargesForGuidance} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {buildCaliforniaSourceDatabaseSeed} from "../server/data/california-source-database-seed";
const row=(code:string)=>additions.find(a=>a.code===code)!;
describe('California driving/vessel publication',()=>{
  it('accounts for the bounded batch and retains unrelated instruction gaps',()=>{
    expect(validateDrivingPublication()).toEqual({additions:21,primarySections:11,reusedSections:13,newSections:18,newVersions:18,promotedResearchSections:17,configuredSelectable:257});
    const review=readDrivingPublication();
    expect(review.crosswalk).toHaveLength(30);
    expect(review.crosswalk.find(r=>r.instruction==='2140')?.chargeIds).toHaveLength(2);
    for(const id of ['2100','2141','2220'])expect(review.crosswalk.find(r=>r.instruction===id)?.status).toBe('unpublished_branch_requires_substantive_review');
    expect(review.remainingGroups.every(g=>g.status==='bounded_additions_do_not_close_group')).toBe(true);
  });
  it('rejects altered definitions, source identity, omissions and invented benchmark clearance',()=>{
    const changed=structuredClone(additions);changed[0].penalty='No custody';
    expect(()=>validateDrivingPublication(undefined,changed)).toThrow('Definition changed');
    const missing=readDrivingPublication();missing.records[0].sources.pop();
    expect(()=>validateDrivingPublication(missing)).toThrow('Incomplete reviewed sources');
    const text=readDrivingPublication();text.records[0].primaryEvidence.text='Unbound';
    expect(()=>validateDrivingPublication(text)).toThrow('Unbound primary evidence');
    const source=readDrivingPublicationAcquisition();Object.values(source.documents)[0][0].contentXml+='changed';
    expect(()=>validateDrivingPublication(undefined,undefined,source)).toThrow('provenance');
    const gap=readDrivingPublication();gap.crosswalk.find(r=>r.instruction==='2141')!.status='bounded_publication_match_other_branches_open';
    expect(()=>validateDrivingPublication(gap)).toThrow('Unexplained benchmark');
  });
  it('preserves distinct penalties and does not transfer operator punishment to crew',()=>{
    expect(row('2800.3(a)').categories).toEqual(['misdemeanor','felony']);
    expect(row('2800.3(a)').penalty).toContain('3, 5 or 7 years');
    expect(row('2800.3(b)').categories).toEqual(['felony']);
    expect(row('2800.3(b)').penalty).toContain('4, 6 or 10 years');
    expect(row('2800.1(b)').summary).toContain('115 decibels');
    expect(row('20001(b)(2)').penalty).toContain('90 days');
    expect(row('20001(b)(1)').searchAliases).toContain('VC 20001(a)');
    expect(row('192.5(b)').penalty).toContain('16 months, 2 years or 4 years');
    expect(row('192.5(d)').categories).toEqual(['misdemeanor']);
    expect(row('655(f)').penalty).toContain('AND a fine');
    expect(row('655(f)').penalty).toContain('at least 5 days or at least 90 days');
    expect(row('655.4(b)').categories).toEqual(['misdemeanor']);
    expect(row('655.4(b)').penalty).toContain('not imported');
    expect(row('656.3').summary).toContain('death or disappearance');
  });
  it('pins every promoted source and carries every choice through lookup, guidance, translation warnings and expiry',()=>{
    const now=new Date(receipt.checkedAt),seed=buildCaliforniaSourceDatabaseSeed(now);
    for(const a of additions){
      const canonical=getCaliforniaCanonicalRecord(a.id)!;
      expect(getChargeById(a.id)).toMatchObject({code:a.code,categories:a.categories,maxPenalty:a.penalty});
      expect(chargeCategories['DUI & Traffic']).toContain(a.id);
      expect(chargeCategories['DUI/Traffic Crimes']).toContain(a.id);
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({id:a.id,maxPenalty:a.penalty,categories:a.categories});
      expect(seed.links.filter(l=>l.chargeId===a.id)).toHaveLength(a.supportingKeys.length+1);
      for(const key of [a.lawCode+':'+a.code.split('(')[0],...a.supportingKeys])expect(pins).toHaveProperty(key);
      expect(getCaliforniaRecordEvidenceStatus(canonical,now)).toBe('current');
      expect(getCaliforniaRecordEvidenceStatus(canonical,new Date(receipt.expiresAt))).not.toBe('current');
      for(const lang of ['en','es','zh'])expect(getChargeExplanation('wrong name','CA',lang,a.id)).toMatchObject({plainSummary:a.summary,degreeContext:a.penalty,untranslated:lang!=='en'});
    }
  });
});
