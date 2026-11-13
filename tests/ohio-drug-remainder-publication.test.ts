import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-drug-remainder-publication.json';
import {OHIO_DRUG_REMAINDER_DEFINITIONS,OHIO_DRUG_REMAINDER_IDS} from '../shared/ohio-drug-remainder-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_DRUG_REMAINDER_SOURCES,ohioDrugRemainderPacket,validateOhioDrugRemainderPacket,validateOhioDrugRemainderReceipt,OHIO_DRUG_REMAINDER_RECEIPT_PATH} from '../server/data/ohio-drug-remainder-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_DRUG_REMAINDER_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio remaining drug and document offenses',()=>{
 it('binds 22 choices across 11 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(22);expect(new Set(rows.map(r=>r.section)).size).toBe(11);
  expect(Object.keys(ohioDrugRemainderPacket.documents)).toHaveLength(43);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_DRUG_REMAINDER_IDS.has(r.chargeId))).toBe(false);
  expect(ohioDrugRemainderPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_DRUG_REMAINDER_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_DRUG_REMAINDER_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_DRUG_REMAINDER_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('keeps the specific five-year term, repeat M1/F5 and conditional motor vehicle suspension',()=>{
  expect(row('intent-to-manufacture').gradeSummary).toContain('at least five years');
  expect(getChargeById(row('intent-to-manufacture').id)?.maxPenalty).toContain('outside this range');
  expect(row('purpose-of-intoxication').categories).toEqual(['misdemeanor','felony']);
  expect(row('stationary-vehicle').gradeSummary).toContain('permits suspension');
 });
 it('distinguishes medicine schedules, special terms and quarter-gram unit-dose exception',()=>{
  expect(row('schedule-i-ii').degrees).toEqual(['F5','F4']);
  expect(row('other-dangerous-drug').degrees).toEqual(['M2','M1']);
  expect(row('other-dangerous-drug').dependencies).not.toContain('2941.1410');
  expect(rows.find(r=>r.section==='2925.34')!.conductSummary).toContain('250 mg');
 });
 it('accounts for all fourteen research primaries and excludes civil, defense-only, juvenile-only and held adult branches',()=>{
  const evidence=JSON.parse(readFileSync('scripts/data-review/output/ohio-drug-remainder-evidence.json','utf8'));
  const dispositions=JSON.parse(readFileSync('scripts/data-review/output/ohio-drug-remainder-dispositions.json','utf8'));
  expect(evidence.primarySections).toHaveLength(14);
  expect(dispositions.map((x:{section:string})=>x.section).sort()).toEqual([...evidence.primarySections].sort());
  for(const r of dispositions){
   expect(r.sourceHash).toBe(evidence.documents[r.section].contentHash);
   expect(r.publishedIds).toEqual(rows.filter(row=>row.section===r.section).map(row=>row.id));
  }
  for(const n of ['2925.141','2925.57','2925.58'])expect(rows.some(r=>r.section===n)).toBe(false);
  expect(rows.filter(r=>r.section==='2925.55').map(r=>r.scope)).toEqual(['B(1)','E']);
  expect(rows.filter(r=>r.section==='2925.56').map(r=>r.scope)).toEqual(['A(1)','B(1)','C']);
  expect(row('minor').dependencies).toContain('2925.58');
  expect(row('cartridge-compliance').degrees).toEqual(['M4']);
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioDrugRemainderPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioDrugRemainderPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioDrugRemainderPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioDrugRemainderReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioDrugRemainderReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioDrugRemainderReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioDrugRemainderReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_DRUG_REMAINDER_SOURCES);
  expect(records).toHaveLength(22);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(22);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
