import {loadOhioAuthorityManifest} from '../server/data/ohio-manifest-loader';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/ohio-drug-conduct-publication.json';
import {OHIO_DRUG_CONDUCT_DEFINITIONS,OHIO_DRUG_CONDUCT_IDS} from '../shared/ohio-drug-conduct-batch';
import {isReviewedOhioChargeId} from '../shared/ohio-reviewed-identity';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {OHIO_DRUG_CONDUCT_SOURCES,ohioDrugConductPacket,validateOhioDrugConductPacket,validateOhioDrugConductReceipt,OHIO_DRUG_CONDUCT_RECEIPT_PATH} from '../server/data/ohio-drug-conduct-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {OHIO_MAJOR_SOURCES} from '../server/data/ohio-major-source';
import {OHIO_RESIDUAL_SOURCES} from '../server/data/ohio-residual-source';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {buildOhioReviewedManifestRecords,buildOhioSourceDatabaseSeed,OHIO_MANIFEST_SOURCE,validateOhioManifestRecord} from '../server/data/ohio-source-database-seed';
import {quarterlyDeadline} from '../shared/source-verification-policy.mjs';
const receipt=JSON.parse(readFileSync(OHIO_DRUG_CONDUCT_RECEIPT_PATH,'utf8')),fresh=new Date(receipt.checkedAt);
const row=(suffix:string)=>rows.find(r=>r.id.endsWith(suffix))!;
describe('Ohio drug conduct and document offenses',()=>{
 it('binds 26 choices across 4 sections without replacing approved prior batches',()=>{
  expect(rows).toHaveLength(26);expect(new Set(rows.map(r=>r.section)).size).toBe(4);
  expect(Object.keys(ohioDrugConductPacket.documents)).toHaveLength(28);
  expect([...OHIO_REVIEWED_SOURCES,...OHIO_MAJOR_SOURCES,...OHIO_RESIDUAL_SOURCES,...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r=>OHIO_DRUG_CONDUCT_IDS.has(r.chargeId))).toBe(false);
  expect(ohioDrugConductPacket.documents['1509.01']).toBeUndefined();
  for(const definition of OHIO_DRUG_CONDUCT_DEFINITIONS){
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
  const collisions=seed.selectableChargeIds.filter(id=>!OHIO_DRUG_CONDUCT_IDS.has(id)).map(id=>getChargeById(id)!).filter(c=>sections.has(c.code.match(/\d+\.\d+/)?.[0]??''));
  expect(collisions.map(c=>c.id)).toEqual([]);
  for(const id of OHIO_DRUG_CONDUCT_IDS)expect(seed.selectableChargeIds).toContain(id);
  expect(seed.selectableChargeIds).not.toContain('oh-orc-2911-21-criminal-trespass');
 });
 it('binds the pregnancy branch to its own schedule profiles and excludes purpose-to-harm from the professional exception',()=>{
  expect(row('pregnancy').gradingPaths).toEqual(['C','C(4)','C(5)','C(6)']);
  expect(row('pregnancy').degrees).toEqual(['F1','F2','F3']);
  expect(row('purpose-to-harm').conductSummary).toContain('excludes (A)(2)');
  expect(rows.find(r=>r.section==='2925.02' && r.scope==='A(4)')!.conductSummary).toContain('two-year gap belongs only to (a) through (c)');
  for(const r of rows.filter(r=>r.section==='2925.02')){
   expect(r.dependencies).toContain('2941.1410');expect(r.gradeSummary).toContain('in lieu');
  }
 });
 it('separates seven fixed F5 document types from six drug-dependent types',()=>{
  const docs=rows.filter(r=>r.section==='2925.23');
  expect(docs.filter(r=>r.degrees.length===1).map(r=>r.scope)).toEqual(['B(2)','B(4)','B(5)','C(2)','C(4)','C(5)','C(6)']);
  expect(docs.filter(r=>r.degrees.length===2).map(r=>r.scope)).toEqual(['A','D','B(1)','B(3)','C(1)','C(3)']);
  expect(docs.filter(r=>r.contextPaths.includes('E')).map(r=>r.scope)).toEqual(['A','D']);
 });
 it('preserves the drug-only affirmative defense, harm enhancement and five exact counterfeit offense names',()=>{
  expect(row('container').conductSummary).toContain('altering the drug itself');
  expect(row('drug').degrees).toEqual(['F3','F2']);expect(row('drug').gradeSummary).toContain('half the maximum');
  const counterfeit=rows.filter(r=>r.section==='2925.37');
  expect(new Set(counterfeit.map(r=>r.statutoryName)).size).toBe(5);
  expect(counterfeit.find(r=>r.scope==='D')!.degrees).toEqual(['F4']);
  expect(counterfeit.find(r=>r.scope==='A')!.degrees).toEqual(['M1']);
 });
 it.each(['text','date','url','header','offset','definition','dependency','unused','broadened','grade','context','plan'] as const)('rejects changed %s evidence',kind=>{
  const p=structuredClone(ohioDrugConductPacket),r=p.records[0],d=p.documents[r.section];
  if(kind==='text')d.text+='bad'; if(kind==='date')d.effectiveDateStart='2099-01-01';
  if(kind==='url')d.sourceUrl='https://example.com';if(kind==='header')d.title='wrong';
  if(kind==='offset')r.conduct[0].start++;if(kind==='definition')r.definitionHash='wrong';
  if(kind==='dependency')r.dependencies.pop();if(kind==='unused')p.documents['fake']=d;
  if(kind==='broadened')r.conduct=[r.evidence[0]];if(kind==='grade')r.grading=p.records[1].conduct;
  if(kind==='context')p.records.find(record=>record.context.length>0)!.context=[];if(kind==='plan')p.planHash='wrong';
  expect(()=>validateOhioDrugConductPacket(p)).toThrow();
 });
 it('binds the new quarterly window to oldest acquisition, not regeneration',()=>{
  const oldest=Math.min(...Object.values(ohioDrugConductPacket.documents).map(d=>Date.parse(d.retrievedAt)));
  expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
  expect(validateOhioDrugConductReceipt(receipt,fresh)).toBeNull();
  expect(validateOhioDrugConductReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  for(const bad of [{...receipt,packetHash:'wrong'},{...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},{...receipt,checkedAt:new Date(fresh.getTime()+1).toISOString()},{...receipt,verificationPolicy:undefined}])expect(validateOhioDrugConductReceipt(bad,new Date(fresh.getTime()+1000))).not.toBeNull();
  expect(validateOhioDrugConductReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('validates complete links and withholds already-created manifests after expiry',()=>{
  const records=buildOhioReviewedManifestRecords(fresh,OHIO_DRUG_CONDUCT_SOURCES);
  expect(records).toHaveLength(26);records.forEach(r=>expect(validateOhioManifestRecord(r)).toBeNull());
  const manifest={jurisdiction:'OH' as const,source:OHIO_MANIFEST_SOURCE,generatedAt:fresh,catalogRecords:records};
  expect(buildOhioSourceDatabaseSeed(manifest,fresh).selectableChargeIds).toHaveLength(26);
  expect(buildOhioSourceDatabaseSeed(manifest,new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  const bad=structuredClone(records[0]);bad.provisions[0].contentHash='wrong';
  expect(validateOhioManifestRecord(bad)).not.toBeNull();
 });
});
