import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-priority-gaps-publication.json';
import {OHIO_PRIORITY_GAPS_DEFINITIONS,OHIO_PRIORITY_GAPS_IDS} from '../shared/ohio-priority-gaps-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_PRIORITY_GAPS_SOURCES,ohioPriorityGapsPacket,validateOhioPriorityGapsPacket,validateOhioPriorityGapsReceipt,OHIO_PRIORITY_GAPS_RECEIPT_PATH} from '../server/data/ohio-priority-gaps-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_PRIORITY_GAPS_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio priority weapons and drug offenses',()=>{
 it('binds 15 choices across 4 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(15);expect(new Set(rows.map(r=>r.section)).size).toBe(4);
  expect(Object.keys(ohioPriorityGapsPacket.documents)).toHaveLength(41);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_PRIORITY_GAPS_IDS.has(r.chargeId))).toBe(false);
  expect(ohioPriorityGapsPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_PRIORITY_GAPS_DEFINITIONS){
   expect(isReviewedOhioChargeId(definition.id)).toBe(true);
   expect(getChargeById(definition.id)?.categories).toEqual(definition.categories);
   expect(getChargeById(definition.id)?.code).toBe(definition.code);
   for(const language of ['es','zh']){
    const result=getChargeExplanation(definition.name,'OH',language,definition.id)!;
    expect(result.untranslated).toBe(true);expect(result.translationDraft).toBe(false);
    expect(result.plainSummary).toBe(definition.text.en.plainSummary);
   }
  }
 });
 it('does not overlap any eligible legacy section or clear held pilot/trespass records',()=>{
  const seed=buildOhioSourceDatabaseSeed(loadOhioAuthorityManifest(undefined,fresh),fresh);
  const sections=new Set(rows.map(r=>r.section));
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_PRIORITY_GAPS_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_PRIORITY_GAPS_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('binds vehicle offenses to their own conduct and explicit grade alternatives',()=>{
  const expected={A:['F4'],B:['F4'],C:['M4'],'D(1)':['F5','F4'],'D(2)':['F5','F4'],'E(1)':['M2'],'E(2)':['M2'],'E(3)':['M1','F5'],'E(4)':['F5'],'E(5)':['M1','F5']};
  const vehicle=rows.filter(r=>r.section==='2923.16');
  expect(Object.fromEntries(vehicle.map(r=>[r.scope,r.degrees]))).toEqual(expected);
  for(const r of vehicle){expect(r.conductPaths).toEqual([r.scope]);expect(r.gradingPaths).toEqual(['I']);}
  expect(row('remain-or-hands').gradeSummary).toContain('one year');
  expect(row('lawful-order').gradeSummary).toContain('two years');
  expect(row('officer-disclosure').conductSummary).toContain('expunge');
  expect(row('contact-during-stop').degrees).toEqual(['F5']);
  expect(row('under-influence').contextPaths).not.toContain('F(1)');
  expect(row('prohibited-concentration').dependencies).toContain('4511.19');
  expect(row('hypodermic-or-syringe').conductSummary).toContain('previously used');
  expect(row('hypodermic-or-syringe').dependencies).toContain('2925.11');
 });
 it('keeps the three prescription grading schemes, bulk thresholds, prison presumptions and fine rule distinct',()=>{
  const prescription=rows.filter(r=>r.section==='2925.22');
  expect(prescription.map(r=>r.degrees)).toEqual([['F5','F4'],['F4','F3','F2','F1'],['F5','F4','F3','F2']]);
  for(const r of prescription.slice(1)){
   expect(r.gradeSummary).toContain('fifty');expect(r.gradeSummary).toContain('obtainable');
   expect(r.gradeSummary).toContain('indigency');expect(r.dependencies).toContain('2925.01');
  }
  expect(row('blank-or-general').gradeSummary).toContain('prior drug abuse');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioPriorityGapsPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioPriorityGapsPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioPriorityGapsPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioPriorityGapsReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioPriorityGapsReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioPriorityGapsReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioPriorityGapsReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_PRIORITY_GAPS_SOURCES);
  expect(records).toHaveLength(15);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(15);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
