import { describe, it, expect } from 'vitest';
import major from '../shared/ohio-major-publication.json';
import residual from '../shared/ohio-residual-publication.json';
import theft from '../shared/ohio-theft-fraud-publication.json';
import { ohioPrimaryClassification, validateOhioClassificationEvidence } from '../shared/ohio-primary-classification';
import { OHIO_MAJOR_DEFINITIONS } from '../shared/ohio-major-batch';
import { OHIO_RESIDUAL_DEFINITIONS } from '../shared/ohio-residual-batch';
import { OHIO_THEFT_FRAUD_DEFINITIONS } from '../shared/ohio-theft-fraud-batch';
import { getChargeById } from '../shared/criminal-charges';
import { buildOhioMajorPublication } from '../scripts/data-review/prepare-ohio-major-publication';
import { buildOhioResidualPublication } from '../scripts/data-review/prepare-ohio-residual-publication';
import { buildOhioTheftFraudPublication } from '../scripts/data-review/prepare-ohio-theft-fraud-publication';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
describe('Ohio statutory primary classification', () => {
 it.each([[major,OHIO_MAJOR_DEFINITIONS,9],[theft,OHIO_THEFT_FRAUD_DEFINITIONS,10]] as const)('leads ordinary mixed offenses with their supported misdemeanor tier', (rows,definitions,count) => {
  const mixed=rows.filter(r=>r.categories.length===2); expect(mixed).toHaveLength(count);
  for(const row of mixed) {
   expect(ohioPrimaryClassification(row)).toBe('misdemeanor');
   expect(definitions.find(d=>d.id===row.id)?.category).toBe('misdemeanor');
   expect(getChargeById(row.id)?.categories).toEqual(['misdemeanor','felony']);
   expect(getChargeById(row.id)?.category).toBe('misdemeanor');
   expect(ohioPrimaryClassification({...row,degrees:[...row.degrees].reverse()})).toBe('misdemeanor');
  }
 });
 it('distinguishes arson branches from two ordinary misdemeanor mischief grades',()=>{
  const arson=residual.find(r=>r.section==='2909.03')!,mischief=residual.find(r=>r.section==='2909.07')!;
  expect(arson.primaryClassification?.basis).toBe('branch_dependent');
  expect(arson.primaryClassification?.ordinaryDegrees).toEqual([]);
  expect(OHIO_RESIDUAL_DEFINITIONS.find(r=>r.id===arson.id)?.categories).toEqual(['felony','misdemeanor']);
  expect(mischief.primaryClassification?.ordinaryDegrees).toEqual(['M3','M1']);
  expect(OHIO_RESIDUAL_DEFINITIONS.find(r=>r.id===mischief.id)?.category).toBe('misdemeanor');
 });
 it('rejects absent, inconsistent or unbound ordinary-grade claims',()=>{
  const row=theft.find(r=>r.categories.length===2)!;
  expect(()=>ohioPrimaryClassification({...row,primaryClassification:undefined})).toThrow();
  expect(()=>ohioPrimaryClassification({...row,primaryClassification:{...row.primaryClassification!,ordinaryDegrees:['F2']}})).toThrow();
  expect(()=>validateOhioClassificationEvidence(row,[])).toThrow(/Unbound/);
  expect(()=>validateOhioClassificationEvidence({...row,primaryClassification:{...row.primaryClassification!,evidence:[{section:row.section,quote:'invented ordinary misdemeanor'}]}},[{section:row.section,text:'statutory text'}])).toThrow(/Unbound/);
 });
 it.each([['major',buildOhioMajorPublication],['residual',buildOhioResidualPublication],['theft-fraud',buildOhioTheftFraudPublication]] as const)('regenerates evidence bindings without changing receipt clocks: %s',(family,build)=>{
  const {packet,receipt}=build();
  const committed=JSON.parse(readFileSync(`scripts/data-review/output/ohio-${family}-refresh-receipt.json`,'utf8'));
  expect(receipt).toEqual(committed);
  expect(receipt.checkedAt).toBe(new Date(Math.max(...Object.values(packet.documents).map(d=>Date.parse(d.retrievedAt)))).toISOString());
  expect(receipt.packetHash).toBe(createHash('sha256').update(JSON.stringify(packet)).digest('hex'));
 });
});
