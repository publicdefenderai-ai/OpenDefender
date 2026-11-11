import {createHash} from 'node:crypto';
import priorVersions from '../scripts/data-review/output/ohio-protection-historical-context.json';
import {resolveGuidanceCharge} from '../shared/guidance-charge-resolution';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-protection-publication.json';
import {OHIO_PROTECTION_DEFINITIONS,OHIO_PROTECTION_IDS} from '../shared/ohio-protection-batch';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_PROTECTION_SOURCES,ohioProtectionPacket,validateOhioProtectionPacket,validateOhioProtectionReceipt,OHIO_PROTECTION_RECEIPT_PATH} from '../server/data/ohio-protection-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_PROTECTION_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio family publication',()=>{
 it('binds 14 identities across 6 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(14);expect(new Set(rows.map(r=>r.section)).size).toBe(6);
  expect(Object.keys(ohioProtectionPacket.documents)).toHaveLength(32);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_PROTECTION_IDS.has(r.chargeId))).toBe(false);
  expect(ohioProtectionPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_PROTECTION_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_PROTECTION_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_PROTECTION_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('binds each domestic-violence branch to its own grades and retires the misleading saved choice',()=>{
  expect(row('threat-of-force').degrees).toEqual(['M4','M3','M2','M1']);
  for(const id of ['physical-harm','reckless-serious-harm']){
   const r=row(id);expect(r.degrees).toEqual(['M1','F5','F4','F3']);
   expect(getChargeById(r.id)?.maxPenalty).toContain('54, or 60 months');
   expect(getChargeById(r.id)?.maxPenalty).not.toContain('9, 12, 18');
  }
  expect(resolveGuidanceCharge({id:'oh-domestic-violence',name:'Domestic Violence',code:'2919.25',classification:'misdemeanor'},'OH')).toBeUndefined();
 });
 it('ties unnamed conduct and separate penalty sections to their actual subdivisions',()=>{
  const r=ohioProtectionPacket.records.find(r=>r.section==='3111.19')!;
  expect(r.grading.map(g=>g.section)).toEqual(['3111.99']);
  expect(r.grading[0].text.toLowerCase()).toContain('guilty of interfering with the establishment of paternity');
  for(const r of ohioProtectionPacket.records.filter(r=>r.section==='2151.421')){
   expect(r.grading.every(g=>g.section==='2151.99')).toBe(true);
  }
  expect(row('mandatory-professional-report').gradeSummary).toContain('direct care');
  expect(row('mandatory-clergy-report').gradeSummary).toContain('common membership');
  expect(row('unauthorized-report-dissemination').degrees).toEqual(['M4']);
 });
 it('keeps the 2025 image grades, intent requirements, and statutory prior lists separate',()=>{
  const base=row('private-image'), created=row('creating-fabricated-image'), sent=row('disseminating-fabricated-image');
  expect(base.degrees).toEqual(['F5','F4']);expect(base.conductSummary).toContain('intent to harm');
  expect(sent.degrees).toEqual(['F4','F3']);expect(sent.conductSummary).not.toContain('intent to harm');
  expect(created.conductSummary).toContain('intent to distribute');
  for(const entry of [base,created,sent,row('soliciting-fabricated-image')])expect(entry.gradeSummary).toContain('September 30, 2025');
 });
 it('keeps older incident-date sources separate from the operative classifications',()=>{
  for(const doc of Object.values(priorVersions.documents)){
   expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
   expect(doc.effectiveDateStart).toBe('2019-03-22');
   expect(ohioProtectionPacket.documents[doc.section].contentHash).not.toBe(doc.contentHash);
  }
  expect(priorVersions.documents['2917.211'].text).toContain('a misdemeanor of the third degree');
  expect(row('private-image').gradeSummary).toContain('September 29, 2025');
  expect(priorVersions.documents['2919.25'].text).not.toContain('presumption for a prison term');
  expect(row('reckless-serious-harm').gradeSummary).toContain('preceding version did not state');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioProtectionPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioProtectionPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioProtectionPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioProtectionReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioProtectionReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioProtectionReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioProtectionReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_PROTECTION_SOURCES);
  expect(records).toHaveLength(14);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(14);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
