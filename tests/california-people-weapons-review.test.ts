import {describe,expect,it} from 'vitest';
import {buildPeopleWeaponsReview,validatePeopleWeaponsPacket,readPeopleWeaponsAcquisition,readPeopleWeaponsBenchmark,renderPeopleWeaponsReview} from '../scripts/data-review/california-verification/people-weapons-review';
import {CALIFORNIA_CANONICAL_RECORDS} from '../shared/california-authority';

describe('California people/weapons combined research',()=>{
  it('accounts for all five families and keeps unresolved branches out of credited coverage',()=>{
    const r=buildPeopleWeaponsReview();
    // Live same-section navigation grows with publication; bounded instruction credit stays unchanged.
    expect(r.counts).toEqual({candidateSections:373,reusedSections:77,newSections:296,newVersions:296,instructions:207,pages:659,boundedPriorMatches:43,contextInstructions:29,genericTemplates:1,sameSectionNeedsReview:129,noSameSectionCandidate:5});
    expect(r.crosswalk.find(i=>i.id==='821')).toMatchObject({status:'same_section_candidates_require_branch_review',boundedChargeIds:[]});
    expect(r.crosswalk.find(i=>i.id==='937')).toMatchObject({status:'same_section_candidates_require_branch_review',boundedChargeIds:[]});
    expect(r.crosswalk.find(i=>i.id==='935')?.boundedChargeIds).toEqual(['ca-sexual-battery-243-4-a']);
    expect(r.crosswalk.find(i=>i.id==='2561')?.status).toBe('no_same_section_catalog_candidate');
    expect(r.crosswalk.find(i=>i.id==='2562')?.status).toBe('context_defense_or_allegation');
    expect(r.crosswalk.find(i=>i.id==='2500')?.status).toBe('weapon_specific_identity_research');
    expect(r.crosswalk.find(i=>i.id==='2560')?.boundedChargeIds).toEqual([]);
    expect(r.groups).toHaveLength(4);
    expect(renderPeopleWeaponsReview(r)).not.toContain('—');
  });
  it('rejects lost accounting, duplicate reuse, changed providers and source corruption',()=>{
    const missing=readPeopleWeaponsAcquisition();missing.candidateKeys.pop();
    expect(()=>validatePeopleWeaponsPacket(missing)).toThrow('accounting');
    const duplicate=readPeopleWeaponsAcquisition();duplicate.reusedKeys.push(duplicate.reusedKeys[0]);
    expect(()=>validatePeopleWeaponsPacket(duplicate)).toThrow('accounting');
    const provider=readPeopleWeaponsAcquisition();provider.retainedArtifactHashes['california-batch-one-review.json']='bad';
    expect(()=>validatePeopleWeaponsPacket(provider)).toThrow('provider');
    const text=readPeopleWeaponsAcquisition();Object.values(text.documents)[0][0].contentXml+='changed';
    expect(()=>validatePeopleWeaponsPacket(text)).toThrow('source');
    const identity=readPeopleWeaponsAcquisition();Object.values(identity.documents)[0][0].section='99999';
    expect(()=>validatePeopleWeaponsPacket(identity)).toThrow('source');
    const url=readPeopleWeaponsAcquisition();Object.values(url.documents)[0][0].sourceUrl='https://example.com/';
    expect(()=>validatePeopleWeaponsPacket(url)).toThrow('source');
  });
  it('rejects changed pages, missing letter-suffixed instructions, broken contents, spans and headings',()=>{
    const page=readPeopleWeaponsBenchmark();page.pages[0].text+='changed';
    expect(()=>validatePeopleWeaponsPacket(undefined,page)).toThrow('page');
    const missing=readPeopleWeaponsBenchmark();missing.instructions=missing.instructions.filter(i=>i.id!=='852B');
    expect(()=>validatePeopleWeaponsPacket(undefined,missing)).toThrow('inventory');
    const toc=readPeopleWeaponsBenchmark();toc.contentsPages.pop();
    expect(()=>validatePeopleWeaponsPacket(undefined,toc)).toThrow('inventory');
    const interval=readPeopleWeaponsBenchmark();interval.instructions[0].lastPage++;
    expect(()=>validatePeopleWeaponsPacket(undefined,interval)).toThrow('interval');
    const heading=readPeopleWeaponsBenchmark();heading.instructions[0].heading='800. Wrong identity';
    expect(()=>validatePeopleWeaponsPacket(undefined,heading)).toThrow('heading');
  });
  it('does not credit a bounded match that is no longer a configured choice',()=>{
    const record=CALIFORNIA_CANONICAL_RECORDS.find(r=>r.canonicalId==='ca-domestic-battery')!;
    const original=record.selectable;
    try {record.selectable=false;expect(()=>validatePeopleWeaponsPacket()).toThrow('Bounded catalog match');}
    finally {record.selectable=original;}
  });
});
