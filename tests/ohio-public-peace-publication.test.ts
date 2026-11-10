import {resolveGuidanceCharge} from '../shared/guidance-charge-resolution';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-public-peace-publication.json';
import {OHIO_PUBLIC_PEACE_DEFINITIONS,OHIO_PUBLIC_PEACE_IDS} from '../shared/ohio-public-peace-batch';
import {getChargeById,getSelectableCharges,isChargeIdRequiringReselection} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_PUBLIC_PEACE_SOURCES,ohioPublicPeacePacket,validateOhioPublicPeacePacket,validateOhioPublicPeaceReceipt,OHIO_PUBLIC_PEACE_RECEIPT_PATH} from '../server/data/ohio-public-peace-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_PUBLIC_PEACE_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio public peace publication',()=>{
 it('binds 14 identities across 9 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(14);expect(new Set(rows.map(r=>r.section)).size).toBe(9);
  expect(Object.keys(ohioPublicPeacePacket.documents)).toHaveLength(28);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_PUBLIC_PEACE_IDS.has(r.chargeId))).toBe(false);
  expect(ohioPublicPeacePacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_PUBLIC_PEACE_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_PUBLIC_PEACE_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_PUBLIC_PEACE_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('binds school panic F2 only to the false-report branch and preserves its distinct WMD threshold',()=>{
  const warning=row('false-warning'),other=row('threat-or-offense');
  expect(warning.degrees).toContain('F2');expect(other.degrees).not.toContain('F2');
  for(const r of [warning,other]){expect(r.gradeSummary).toContain('$100,000');expect(r.gradeSummary).toContain('$150,000');}
  expect(row('critical-infrastructure').gradeSummary).toContain('F3 independently');
 });
 it('separates inmate riot, lawful assembly, media access and actual emergency-response requirements',()=>{
  expect(row('felony-or-weapon').degrees).toEqual(['F5']);expect(row('inmate-felony-or-weapon').degrees).toEqual(['F4']);expect(row('inmate-violence-or-riot').degrees).toEqual(['F3']);
  expect(row('failure-to-disperse').conductSummary).toContain('Peaceable assembly');expect(row('failure-to-disperse').degrees).toEqual(['MM','M4']);
  expect(row('emergency-misconduct').conductSummary).toContain('news media');
  expect(row('swatting').conductSummary).toContain('must actually cause one');expect(row('swatting').gradeSummary).toContain('may order');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioPublicPeacePacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioPublicPeacePacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioPublicPeacePacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioPublicPeaceReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioPublicPeaceReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioPublicPeaceReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioPublicPeaceReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_PUBLIC_PEACE_SOURCES);
  expect(records).toHaveLength(14);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(14);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
