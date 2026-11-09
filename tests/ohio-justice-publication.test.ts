import {resolveGuidanceCharge} from '../shared/guidance-charge-resolution';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-justice-publication.json';
import {OHIO_JUSTICE_DEFINITIONS,OHIO_JUSTICE_IDS} from '../shared/ohio-justice-batch';
import {getChargeById,getSelectableCharges,isChargeIdRequiringReselection} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_JUSTICE_SOURCES,ohioJusticePacket,validateOhioJusticePacket,validateOhioJusticeReceipt,OHIO_JUSTICE_RECEIPT_PATH} from '../server/data/ohio-justice-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_JUSTICE_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio justice publication',()=>{
 it('binds 17 identities across 13 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(17);expect(new Set(rows.map(r=>r.section)).size).toBe(13);
  expect(Object.keys(ohioJusticePacket.documents)).toHaveLength(51);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_JUSTICE_IDS.has(r.chargeId))).toBe(false);
  expect(ohioJusticePacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_JUSTICE_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_JUSTICE_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_JUSTICE_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('preserves separate intimidation and responder branches and limited reporting exceptions',()=>{
  const a=rows.find(r=>r.code==='2921.04(A)')!,b=rows.find(r=>r.code==='2921.04(B)')!;
  expect(a.degrees).toEqual(['M1']);expect(b.degrees).toEqual(['F3']);expect(a.conductSummary).toContain('Division (C) excludes');
  const responder=rows.find(r=>r.code==='2921.31(C)')!;
  expect(responder.degrees).not.toContain('M1');expect(responder.categories[0]).toBe('misdemeanor');
  expect(responder.gradeSummary).toContain('not assigned');expect(responder.conductSummary).toContain('distance alone is not');
  const reports=rows.filter(r=>r.section==='2921.22');expect(reports).toHaveLength(3);
  expect(reports.find(r=>r.degrees[0]==='M2')!.conductSummary).toContain('not generally to (B)');
  expect(reports[0].conductSummary).toContain('not (F)');
  const identity=rows.find(r=>r.section==='2921.29')!;
  expect(identity.conductSummary).toContain('public place');expect(identity.conductSummary).toContain('reasonably suspects');
  expect(identity.conductSummary).toContain('No answers beyond');expect(identity.conductSummary).toContain('age is an element');
  expect(OHIO_JUSTICE_DEFINITIONS.find(r=>r.code==='2921.23')!.text.en.degreeContext).toContain('no incarceration');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioJusticePacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')r.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioJusticePacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioJusticePacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioJusticeReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioJusticeReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioJusticeReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioJusticeReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_JUSTICE_SOURCES);
  expect(records).toHaveLength(17);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(17);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
