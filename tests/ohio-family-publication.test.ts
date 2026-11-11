import { createHash } from 'node:crypto';
import historical from '../scripts/data-review/output/ohio-family-historical-context.json';
import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-family-publication.json';
import {OHIO_FAMILY_DEFINITIONS,OHIO_FAMILY_IDS} from '../shared/ohio-family-batch';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_FAMILY_SOURCES,ohioFamilyPacket,validateOhioFamilyPacket,validateOhioFamilyReceipt,OHIO_FAMILY_RECEIPT_PATH} from '../server/data/ohio-family-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_FAMILY_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio family publication',()=>{
 it('binds 17 identities across 7 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(17);expect(new Set(rows.map(r=>r.section)).size).toBe(7);
  expect(Object.keys(ohioFamilyPacket.documents)).toHaveLength(58);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_FAMILY_IDS.has(r.chargeId))).toBe(false);
  expect(ohioFamilyPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_FAMILY_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_FAMILY_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_FAMILY_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('preserves the distinct serious-harm grades and trafficking-specification limits',()=>{
  expect(row('care-duty').degrees).toEqual(['M1','F4','F3']);
  expect(row('abuse').degrees).toEqual(['M1','F4','F2']);
  expect(row('care-duty').gradeSummary).not.toContain('trafficking');
  for(const r of rows.filter(r=>r.section==='2919.22'&&r.code.includes('(B)'))) {
    expect(r.gradeSummary).toContain('2941.1422');expect(r.gradeSummary).toContain('March 22, 2019');
  }
  expect(rows.some(r=>r.code==='2919.22(B)(6)')).toBe(false);
  const driving=row('impaired-operation-child-passenger');
  expect(driving.gradeSummary).toContain('before March 23, 2000');
  expect(driving.gradeSummary).toContain('only one child-endangerment sentence');
  expect(ohioFamilyPacket.documents['2903.07']).toBeUndefined();
 });
 it('limits custody defenses and separate daily offenses to their statutory branches',()=>{
  const child=rows.find(r=>r.code==='2919.23(A)(1)')!;
  expect(child.degrees).toEqual(['M1','F5','F4']);
  expect(child.conductSummary).toContain('health or safety');
  expect(row('committed-person').degrees).toEqual(['M3']);
  expect(row('leave-committed-custody').gradeSummary).toContain('Each day');
  expect(row('habitual-truancy').gradeSummary).toContain('October 9, 2026');
  expect(rows.some(r=>r.code==='2919.24(B)(4)')).toBe(false);
 });
 it('keeps dated truancy and school-policy sources distinct from current evidence',()=>{
  const prior=historical.documents['2919.24'], oldPolicy=historical.documents['3313.663'];
  for(const doc of [prior,oldPolicy]){
   expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
   expect(ohioFamilyPacket.documents[doc.section].effectiveDateStart).toBe('2026-10-09');
   expect(ohioFamilyPacket.documents[doc.section].contentHash).not.toBe(doc.contentHash);
  }
  expect(prior.effectiveDateStart).toBe('2017-04-06');
  expect(prior.text).toContain('adjudication of the child as a delinquent child based on');
  expect(row('habitual-truancy').gradeSummary).toContain('through October 8, 2026');
  expect(oldPolicy.effectiveDateStart).toBe('1996-10-29');
  expect(oldPolicy.text).not.toContain("district's web site");expect(ohioFamilyPacket.documents['3313.663'].text).toContain("district's web site");
 });
 it('binds an unnumbered section without inventing an ORC subdivision',()=>{
  const id=row('parental-education-neglect').id, entry=ohioFamilyPacket.records.find(r=>r.id===id)!;
  expect(entry.conduct[0].text).toEqual(ohioFamilyPacket.documents['2919.222'].text);
  expect(OHIO_FAMILY_DEFINITIONS.find(r=>r.id===id)!.aliases?.en.join(' ')).not.toContain('(whole)');
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioFamilyPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioFamilyPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioFamilyPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioFamilyReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioFamilyReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioFamilyReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioFamilyReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_FAMILY_SOURCES);
  expect(records).toHaveLength(17);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(17);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
