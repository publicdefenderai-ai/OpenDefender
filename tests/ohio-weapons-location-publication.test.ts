import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-weapons-location-publication.json';
import {OHIO_WEAPONS_LOCATION_DEFINITIONS,OHIO_WEAPONS_LOCATION_IDS} from '../shared/ohio-weapons-location-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_WEAPONS_LOCATION_SOURCES,ohioWeaponsLocationPacket,validateOhioWeaponsLocationPacket,validateOhioWeaponsLocationReceipt,OHIO_WEAPONS_LOCATION_RECEIPT_PATH} from '../server/data/ohio-weapons-location-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_WEAPONS_LOCATION_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio weapons location and document offenses',()=>{
 it('binds 12 choices across 7 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(12);expect(new Set(rows.map(r=>r.section)).size).toBe(7);
  expect(Object.keys(ohioWeaponsLocationPacket.documents)).toHaveLength(32);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_WEAPONS_LOCATION_IDS.has(r.chargeId))).toBe(false);
  expect(ohioWeaponsLocationPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_WEAPONS_LOCATION_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_WEAPONS_LOCATION_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_WEAPONS_LOCATION_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('preserves school and courthouse exceptions and the scope of prior convictions',()=>{
  expect(row('school-replica').gradeSummary).toContain('good cause');
  expect(row('school-replica').categories).toEqual(['misdemeanor','felony']);
  expect(row('school-conveyance').gradingPaths).toEqual(['E(1)']);
  expect(row('courthouse-possession').contextPaths).toContain('E');
  expect(row('possession-defaced').gradeSummary).toContain('same subdivision');
 });
 it('distinguishes adult custody from juvenile grading and special mandatory terms from ordinary F1',()=>{
  expect(row('adult-detention').degrees).toEqual(['F1','F2','F3','F4','F5']);
  expect(row('adult-detention').gradeSummary).toContain('qualifying juvenile');
  expect(row('adult-detention').gradeSummary).toContain('consecutively');
  const penalty=getChargeById(row('violent-career-criminal').id)!.maxPenalty;
  expect(penalty).toContain('two through eleven');expect(penalty).not.toContain('minimum of 3 to 11');
  expect(row('suspended-revoked-license').degrees).toEqual(['M3']);
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioWeaponsLocationPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioWeaponsLocationPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioWeaponsLocationPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioWeaponsLocationReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioWeaponsLocationReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioWeaponsLocationReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioWeaponsLocationReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_WEAPONS_LOCATION_SOURCES);
  expect(records).toHaveLength(12);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(12);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
