import {resolveGuidanceCharge} from '../shared/guidance-charge-resolution';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-custody-publication.json';
import {OHIO_CUSTODY_DEFINITIONS,OHIO_CUSTODY_IDS} from '../shared/ohio-custody-batch';
import {getChargeById,getSelectableCharges,isChargeIdRequiringReselection} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_CUSTODY_SOURCES,ohioCustodyPacket,validateOhioCustodyPacket,validateOhioCustodyReceipt,OHIO_CUSTODY_RECEIPT_PATH} from '../server/data/ohio-custody-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_CUSTODY_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio custody publication',()=>{
 it('binds 30 identities across 13 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(30);expect(new Set(rows.map(r=>r.section)).size).toBe(13);
  expect(Object.keys(ohioCustodyPacket.documents)).toHaveLength(58);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_CUSTODY_IDS.has(r.chargeId))).toBe(false);
  expect(ohioCustodyPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_CUSTODY_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_CUSTODY_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_CUSTODY_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('keeps special ranges, mandatory sanctions and branch limits distinct',()=>{
  const flight=OHIO_CUSTODY_DEFINITIONS.find(r=>r.code==='2921.331(B)')!.text.en.degreeContext;
  expect(flight).toContain('60 months');expect(flight).toContain('(C)(4) uses 9');expect(flight).toContain('(C)(5) instead');
  expect(flight).toContain('consecutive');expect(flight).toContain('class-two');
  expect(row('assault-police-animal').gradeSummary).toContain('mandatory fine');
  for(const suffix of ['harass-police-animal','assault-assistance-dog','harass-assistance-dog'])expect(row(suffix).gradeSummary).not.toContain('mandatory fine');
  expect(row('weapons').gradeSummary).not.toContain('DYS');expect(row('drugs').gradeSummary).toContain('DYS');expect(row('device').gradeSummary).toContain('contractor');
  expect(row('cash').conductSummary).toContain('not extended');
  expect(row('detention-escape').primaryClassification?.basis).toBe('branch_dependent');
  expect(row('detention-escape').conductSummary).toContain('juvenile-only');
  expect(row('supervised-release-escape').degrees).toEqual(['F5','F4']);
  expect(rows.find(r=>r.section==='2921.41')!.gradeSummary).toContain('$750,000');
  expect(rows.filter(r=>r.section==='2921.42').map(r=>r.degrees)).toEqual([['F4'],['M1']]);
  for(const r of rows.filter(r=>r.section==='2921.51')){expect(r.namingBasis).toBe('official_heading');expect(r.conductSummary).toContain('confined to (B)');}
  for(const r of rows.filter(r=>r.section==='2921.52'))expect(r.conductSummary).toContain('only to (B)(1)/(2)');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioCustodyPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')r.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioCustodyPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioCustodyPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioCustodyReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioCustodyReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioCustodyReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioCustodyReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_CUSTODY_SOURCES);
  expect(records).toHaveLength(30);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(30);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
