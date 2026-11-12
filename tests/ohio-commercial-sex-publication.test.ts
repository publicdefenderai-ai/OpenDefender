import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-commercial-sex-publication.json';
import {OHIO_COMMERCIAL_SEX_DEFINITIONS,OHIO_COMMERCIAL_SEX_IDS} from '../shared/ohio-commercial-sex-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_COMMERCIAL_SEX_SOURCES,ohioCommercialSexPacket,validateOhioCommercialSexPacket,validateOhioCommercialSexReceipt,OHIO_COMMERCIAL_SEX_RECEIPT_PATH} from '../server/data/ohio-commercial-sex-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_COMMERCIAL_SEX_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio prostitution-related offenses',()=>{
 it('binds 16 choices across 5 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(16);expect(new Set(rows.map(r=>r.section)).size).toBe(5);
  expect(Object.keys(ohioCommercialSexPacket.documents)).toHaveLength(29);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_COMMERCIAL_SEX_IDS.has(r.chargeId))).toBe(false);
  expect(ohioCommercialSexPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_COMMERCIAL_SEX_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_COMMERCIAL_SEX_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_COMMERCIAL_SEX_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('reserves the age-based compelling enhancements for the compulsion branch',()=>{
  expect(row('compulsion').degrees).toEqual(['F3','F2','F1']);
  for(const r of rows.filter(r=>r.section==='2907.21' && r.scope!=='A(1)'))expect(r.degrees).toEqual(['F3']);
  expect(row('compulsion').contextPaths).toEqual(['B']);
 });
 it('binds the human-trafficking and firearm specification conditions and leaves nonqualifying conduct separate',()=>{
  for(const r of rows.filter(r=>r.section==='2907.22')){
   expect(r.degrees).toEqual(['F4','F3','F2']);expect(r.dependencies).toContain('2941.1422');
   expect(r.gradeSummary).toContain('18 months');expect(r.gradeSummary).toContain('charged qualifying firearm specification');
  }
  expect(row('solicitation').degrees).toEqual(['M1']);
  for(const slug of ['procurement','premises']){
   expect(row(slug).degrees).toEqual(['M1','F4','F5']);
   expect(getChargeById(row(slug).id)?.category).toBe('misdemeanor');
  }
 });
 it('preserves the specific fine, program, knowledge condition and historical grade',()=>{
  expect(getChargeById(row('exchange-of-value').id)?.maxPenalty).toContain('fine up to $1,500');
  expect(getChargeById(row('exchange-of-value').id)?.maxPenalty).not.toContain('fine up to $1,000');
  expect(row('developmental-disability').gradeSummary).toContain('must require');
  expect(row('compulsion').dependencies).not.toContain('2941.1421');
  expect(row('procurement').gradeSummary).toContain('For a misdemeanor conviction');
  expect(row('enterprise').gradeSummary).toContain('one to twelve');
  expect(row('after-positive-test').conductPaths).toEqual(['A','B']);
  expect(row('after-positive-test').degrees).toEqual(['F5']);
  expect(row('after-positive-test').gradeSummary).toContain('before that date');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioCommercialSexPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioCommercialSexPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioCommercialSexPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioCommercialSexReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioCommercialSexReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioCommercialSexReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioCommercialSexReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_COMMERCIAL_SEX_SOURCES);
  expect(records).toHaveLength(16);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(16);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
