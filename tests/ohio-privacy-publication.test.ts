import {createHash} from 'node:crypto';
import priorVersions from '../scripts/data-review/output/ohio-privacy-historical-context.json';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-privacy-publication.json';
import {OHIO_PRIVACY_DEFINITIONS,OHIO_PRIVACY_IDS} from '../shared/ohio-privacy-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_PRIVACY_SOURCES,ohioPrivacyPacket,validateOhioPrivacyPacket,validateOhioPrivacyReceipt,OHIO_PRIVACY_RECEIPT_PATH} from '../server/data/ohio-privacy-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_PRIVACY_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio sexual imposition, importuning and voyeurism',()=>{
 it('binds 13 choices across 3 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(13);expect(new Set(rows.map(r=>r.section)).size).toBe(3);
  expect(Object.keys(ohioPrivacyPacket.documents)).toHaveLength(22);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_PRIVACY_IDS.has(r.chargeId))).toBe(false);
  expect(ohioPrivacyPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_PRIVACY_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_PRIVACY_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_PRIVACY_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('keeps the composite contact provision and corroboration rule together',()=>{
  const contact=row('offensive-contact');
  expect(contact.conductPaths).toEqual(['A']);expect(contact.contextPaths).toEqual(['B']);
  expect(contact.gradeSummary).toContain('up to one year');
  expect(contact.conductSummary).toContain('supporting evidence');
  expect(ohioPrivacyPacket.documents['2907.12']).toBeUndefined();
  expect(priorVersions.documents['2907.06'].text).toContain('(5) The offender is a mental health professional');
  expect(ohioPrivacyPacket.documents['2907.06'].text).not.toContain('(5) The offender');
 });
 it('maps eight solicitation branches to the correct age, territory and mandatory-term requirements',()=>{
  const choices=rows.filter(r=>r.section==='2907.07');expect(choices).toHaveLength(8);
  for(const r of choices){
   const electronic=['D','E'].includes(r.scope[0]);
   expect(r.contextPaths.includes('F')).toBe(electronic);
   expect(r.dependencies.includes('2913.01')).toBe(electronic);
   if(electronic)expect(r.conductSummary).toContain('originate in Ohio or be received in Ohio');
   if(['A','C','D'].includes(r.scope[0])){
    expect(r.gradingPaths).toEqual(['G(1)','G(2)']);expect(r.gradeSummary).toContain('arranged to meet');
    expect(r.gradeSummary).not.toContain('age gap of at least ten years');
    expect(r.gradeSummary).toContain('March 22, 2019');
   }else{
    expect(r.gradingPaths).toEqual(['G(1)','G(3)','G(4)']);expect(r.gradeSummary).toContain('requires both');
    expect(getChargeById(r.id)?.maxPenalty).toContain('mandatory prison of 12 to 18 months');
    expect(getChargeById(r.id)?.maxPenalty).not.toContain('if prison is imposed, 6 to 18');
   }
  }
  expect(row('trafficked-teen').conductSummary).toContain('removed the nonspouse condition');
  expect(row('device-officer-as-thirteen-to-fifteen').gradeSummary).toContain('age the officer claimed');
 });
 it('binds voyeurism (C) to F5 and (D) to M1 despite reversed grading order',()=>{
  const choices=rows.filter(r=>r.section==='2907.08');
  expect(choices.map(r=>[r.scope,r.gradingPaths[1],r.degrees[0]])).toEqual([['A','E(2)','M3'],['B','E(3)','M2'],['C','E(5)','F5'],['D','E(4)','M1']]);
  expect(row('recording-through-clothing').gradeSummary).toContain('added recording above clothing');
 });
 it('keeps all three prior versions outside the operative packet',()=>{
  for(const old of Object.values(priorVersions.documents)){
    expect(createHash('sha256').update(old.text).digest('hex')).toBe(old.contentHash);
    expect(ohioPrivacyPacket.documents[old.section].contentHash).not.toBe(old.contentHash);
  }
  for(const r of rows){
    expect(r.dependencies).toContain('2950.01');
    expect(r.dependencies).toContain('2950.04');
    expect(r.gradeSummary).toContain('juvenile classifications');
    expect(r.historicalCitation.url).toBe(priorVersions.documents[r.section as keyof typeof priorVersions.documents].sourceUrl);
  }
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioPrivacyPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioPrivacyPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioPrivacyPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioPrivacyReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioPrivacyReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioPrivacyReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioPrivacyReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_PRIVACY_SOURCES);
  expect(records).toHaveLength(13);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(13);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
