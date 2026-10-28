import {describe,it,expect} from 'vitest';
import config from '../scripts/data-review/california-verification/major-omission-dispositions.json';
import benchmark from '../scripts/data-review/output/california-major-omission-benchmark.json';
import snapshot from '../scripts/data-review/output/california-major-omission-catalog-snapshot.json';
import {buildMajorOmissionAudit,validateMajorBenchmark,readMajorOmissionAudit,validateMajorOmissionAudit,renderMajorOmissionAudit} from '../scripts/data-review/california-verification/major-omission-audit';

describe('California major omission audit',()=>{
 it('accounts for both complete new families and every unresolved prior family entry',()=>{
  const counts=validateMajorOmissionAudit();
  expect(counts).toMatchObject({configuredChoicesSnapshot:657,newChoices:0,benchmarkInstructions:91,peopleWeaponsRechecked:18,otherCodeProbes:9});
  expect(snapshot.records).toHaveLength(678);
  expect(benchmark.instructions.filter(r=>r.family==='homicide')).toHaveLength(87);
  expect(benchmark.instructions.filter(r=>r.family==='gangs')).toHaveLength(4);
  expect(counts.benchmark.unpublished_priority).toBe(3);
 });
 it('does not confuse theories, defenses and allegations with missing standalone charges',()=>{
  const p=readMajorOmissionAudit();
  expect(p.benchmarkRows.find(r=>r.id==='526')?.status).toBe('existing_offense_theory_partial');
  expect(p.benchmarkRows.find(r=>r.id==='505')?.status).toBe('context_defense_or_procedure');
  expect(p.benchmarkRows.find(r=>r.id==='1401')?.status).toBe('allegation_or_sentencing_open');
  expect(p.benchmarkRows.find(r=>r.id==='1400')?.status).toBe('unpublished_priority');
  expect(p.benchmarkRows.some(r=>r.id==='762')).toBe(false);
  expect(benchmark.comparisonContentsPages[0].text).toContain('526–540.');
  expect(benchmark.contentsPages[0].text).toContain('526.');
 });
 it('preserves holds and missing siblings while recovering existing battery coverage',()=>{
  const rows=readMajorOmissionAudit().peopleWeaponsRows;
  expect(rows.find(r=>r.instructionId==='960')?.chargeIds).toEqual(['ca-battery-243-a']);
  expect(rows.find(r=>r.instructionId==='2560')?.status).toBe('existing_choice_missing_sibling');
  expect(rows.find(r=>r.instructionId==='2513')?.status).toBe('existing_hold_preserved');
  expect(rows.find(r=>r.instructionId==='926')?.status).toBe('unpublished_priority');
 });
 it('rejects missing or duplicate dispositions and unknown or withheld identities',()=>{
  const missing=structuredClone(config);missing.benchmarkDispositions.pop();
  expect(()=>buildMajorOmissionAudit(missing)).toThrow('inventory');
  const duplicate=structuredClone(config);duplicate.peopleWeaponsDispositions.push(duplicate.peopleWeaponsDispositions[0]);
  expect(()=>buildMajorOmissionAudit(duplicate)).toThrow('inventory');
  for(const id of ['ca-does-not-exist','ca-insurance-fraud']){
   const bad=structuredClone(config);bad.benchmarkDispositions.find(r=>r.instructionId==='520')!.chargeIds=[id];
   expect(()=>buildMajorOmissionAudit(bad)).toThrow('Unknown or withheld');
  }
 });
 it('rejects altered page text, boundaries and omission accounting',()=>{
  const text=structuredClone(benchmark);text.pages[0].text+=' changed';
  expect(()=>validateMajorBenchmark(text)).toThrow('hash');
  const boundary=structuredClone(benchmark);boundary.instructions[0].lastPage++;
  expect(()=>validateMajorBenchmark(boundary)).toThrow('boundary');
  const packet=readMajorOmissionAudit();packet.otherCodeProbes.pop();
  expect(()=>validateMajorOmissionAudit(packet)).toThrow('drift');
 });
 it('keeps code-qualified discovery identities separate and avoids a completeness claim',()=>{
  const p=readMajorOmissionAudit();
  expect(p.otherCodeProbes.find(r=>r.key==='INS:1871.4')?.chargeIds).toEqual([]);
  expect(p.otherCodeProbes.find(r=>r.key==='RTC:19706')?.chargeIds).toEqual(['ca-rtc-19706']);
  expect(p.otherCodeProbes.find(r=>r.key==='HSC:11395')?.status).toBe('existing_hold_preserved');
  expect(p.limits.join(' ')).toContain('not a statistically representative sample');
  expect(renderMajorOmissionAudit()).not.toMatch(/[—–]/);
 });
 it('isolates returned discovery evidence from the verified parse cache',()=>{
  const first=buildMajorOmissionAudit();
  first.otherCodeProbes[0].versions[0].key='PEN:wrong';
  const second=buildMajorOmissionAudit();
  expect(second.otherCodeProbes[0].versions[0].key).toBe(second.otherCodeProbes[0].key);
 });
});
