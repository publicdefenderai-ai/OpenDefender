import {describe,expect,it} from "vitest";
import {buildDrivingReview,validateDrivingPacket,readDrivingAcquisition,readDrivingBenchmark} from "../scripts/data-review/california-verification/driving-vessels-review";

describe('California combined driving/vessel research',()=>{
  it('accounts for the full bounded packet without promoting research to catalog coverage',()=>{
    const review=buildDrivingReview();
    expect(review.counts).toEqual({candidateSections:215,reusedSections:40,newSections:174,newVersions:175,missingSections:1,instructions:30,boundedMatches:4,contextInstructions:7,unpublishedInstructionBranches:19,prioritySections:38});
    expect(review.sections.find(r=>r.key==='VEH:23564')?.status).toBe('absent_from_snapshot_not_repeal_finding');
    expect(review.crosswalk.find(r=>r.id==='2112')).toMatchObject({chargeIds:[],status:'unpublished_branch_requires_substantive_review'});
    expect(review.crosswalk.find(r=>r.id==='2114')?.chargeIds).toEqual([]);
    expect(review.crosswalk.find(r=>r.id==='2110')?.chargeIds).toHaveLength(3);
    expect(review.crosswalk.find(r=>r.id==='2160')?.status).toBe('context_or_allegation_not_separate_charge');
    expect(review.groups.find(g=>g.name==='Vessels and maritime offenses')?.keys).toContain('PEN:192.5');
  });
  it('rejects missing accounting, corrupted source text and cross-code identities',()=>{
    const missing=readDrivingAcquisition();missing.candidateKeys.pop();
    expect(()=>validateDrivingPacket(missing)).toThrow();
    const duplicate=readDrivingAcquisition();duplicate.reusedKeys.push(duplicate.reusedKeys[0]);
    expect(()=>validateDrivingPacket(duplicate)).toThrow('accounting');
    const altered=readDrivingAcquisition();Object.values(altered.documents)[0][0].contentXml+='changed';
    expect(()=>validateDrivingPacket(altered)).toThrow('Unbound driving source');
    const identity=readDrivingAcquisition();Object.values(identity.documents)[0][0].lawCode='PEN';
    expect(()=>validateDrivingPacket(identity)).toThrow('Unbound driving source');
    const url=readDrivingAcquisition();Object.values(url.documents)[0][0].sourceUrl='https://example.com/';
    expect(()=>validateDrivingPacket(url)).toThrow('Unbound driving source');
  });
  it('rejects lost instructions, changed page text and wrong page spans or headings',()=>{
    const lost=readDrivingBenchmark();lost.instructions.pop();
    expect(()=>validateDrivingPacket(undefined,lost)).toThrow('inventory');
    const page=readDrivingBenchmark();page.pages[0].text+='changed';
    expect(()=>validateDrivingPacket(undefined,page)).toThrow('page');
    const span=readDrivingBenchmark();span.instructions[0].lastPage--;
    expect(()=>validateDrivingPacket(undefined,span)).toThrow('interval');
    const heading=readDrivingBenchmark();heading.instructions[0].heading='2100. Unrelated offense';
    expect(()=>validateDrivingPacket(undefined,heading)).toThrow('heading');
  });
});
