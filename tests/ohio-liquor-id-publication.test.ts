import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-liquor-id-publication.json';
import {OHIO_LIQUOR_ID_DEFINITIONS,OHIO_LIQUOR_ID_IDS} from '../shared/ohio-liquor-id-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_LIQUOR_ID_SOURCES,ohioLiquorIdPacket,validateOhioLiquorIdPacket,validateOhioLiquorIdReceipt,OHIO_LIQUOR_ID_RECEIPT_PATH} from '../server/data/ohio-liquor-id-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_LIQUOR_ID_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio liquor identification offenses',()=>{
 it('binds 18 choices across 8 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(18);expect(new Set(rows.map(r=>r.section)).size).toBe(8);
  expect(Object.keys(ohioLiquorIdPacket.documents)).toHaveLength(25);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_LIQUOR_ID_IDS.has(r.chargeId))).toBe(false);
  expect(ohioLiquorIdPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_LIQUOR_ID_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_LIQUOR_ID_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_LIQUOR_ID_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('preserves juvenile, identification, vehicle and device penalty distinctions',()=>{
  const youth=rows.filter(row=>row.under18Only);
  expect(youth.map(row=>row.scope)).toEqual(['C','E','H']);
  for(const row of youth){
   const guidance=getChargeById(row.id)!.maxPenalty;
   expect(guidance).toContain('juvenile-court');expect(guidance).not.toContain('30 days');
  }
  expect(rows.filter(r=>r.section==='4301.636').map(r=>r.degrees)).toEqual([['F5'],['F5'],['F5'],['F5']]);
  expect(row('false-information-to-obtain-alcohol').gradeSummary).toContain('class-six');
  expect(row('vehicle-consumption').dependencies).toContain('4301.62');
  expect(row('purchase-or-use').degrees).toEqual(['MM']);
  expect(rows.find(r=>r.section==='4301.65' && r.scope==='B')!.degrees).toEqual(['M3','M1']);
  expect(rows.some(r=>r.section==='4301.631' && r.scope==='B')).toBe(false);
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioLiquorIdPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened'){const scoped=p.records.find(r=>r.section==='4301.631')!;scoped.conduct=[scoped.evidence[0]];}if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioLiquorIdPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioLiquorIdPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioLiquorIdReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioLiquorIdReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioLiquorIdReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioLiquorIdReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_LIQUOR_ID_SOURCES);
  expect(records).toHaveLength(18);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(18);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
