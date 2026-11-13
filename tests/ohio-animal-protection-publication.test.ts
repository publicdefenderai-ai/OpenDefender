import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-animal-protection-publication.json';
import {OHIO_ANIMAL_PROTECTION_DEFINITIONS,OHIO_ANIMAL_PROTECTION_IDS} from '../shared/ohio-animal-protection-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_ANIMAL_PROTECTION_SOURCES,ohioAnimalProtectionPacket,validateOhioAnimalProtectionPacket,validateOhioAnimalProtectionReceipt,OHIO_ANIMAL_PROTECTION_RECEIPT_PATH} from '../server/data/ohio-animal-protection-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_ANIMAL_PROTECTION_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio animal protection offenses',()=>{
 it('binds 24 choices across 7 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(24);expect(new Set(rows.map(r=>r.section)).size).toBe(7);
  expect(Object.keys(ohioAnimalProtectionPacket.documents)).toHaveLength(24);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_ANIMAL_PROTECTION_IDS.has(r.chargeId))).toBe(false);
  expect(ohioAnimalProtectionPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_ANIMAL_PROTECTION_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_ANIMAL_PROTECTION_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_ANIMAL_PROTECTION_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('binds each penalty to its external grading division and preserves prior dispositions',()=>{
  expect(rows.every(r=>r.extraGrading.some(g=>g.section==='959.99'))).toBe(true);
  expect(rows.filter(r=>r.section==='959.16')).toHaveLength(6);
  expect(rows.filter(r=>r.section==='959.16').every(r=>r.degrees.join(',')==='F4,F3')).toBe(true);
  expect(rows.filter(r=>r.section==='959.21').map(r=>r.scope)).toEqual(['B','C']);
  expect(rows.filter(r=>r.section==='959.131' && r.scope.startsWith('F')).every(r=>r.degrees.join(',')==='F5')).toBe(true);
  expect(rows.filter(r=>r.section==='959.131' && r.scope.startsWith('G')).every(r=>r.degrees.join(',')==='M1')).toBe(true);
  expect(rows.some(r=>['959.12','959.15','959.17'].includes(r.section))).toBe(false);
  expect(rows.find(r=>r.section==='959.03')!.dependencies).toContain('959.04');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioAnimalProtectionPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened'){const scoped=p.records.find(r=>r.section==='959.131')!;scoped.conduct=[scoped.evidence[0]];}if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioAnimalProtectionPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioAnimalProtectionPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioAnimalProtectionReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioAnimalProtectionReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioAnimalProtectionReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioAnimalProtectionReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_ANIMAL_PROTECTION_SOURCES);
  expect(records).toHaveLength(24);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(24);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
