import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {buildOhioResidual,retainedDocuments,subdivision,renderOhioResidual} from '../scripts/data-review/ohio-residual-verification';
const docs=retainedDocuments();
const packet=buildOhioResidual(docs);
const rows=(section:string)=>packet.records.filter(r=>r.section===section);
describe('Ohio residual subdivision verification',()=>{
 it('covers fourteen distinct remaining mappings with individually bound penalty branches',()=>{
  expect(packet.counts).toEqual({mappings:14,sections:11,penaltyRules:22});
  const published=JSON.parse(readFileSync('shared/ohio-major-publication.json','utf8'));
  expect(packet.records.some(r=>published.some((p:any)=>p.mappingId===r.id))).toBe(false);
  for(const row of packet.records) for(const span of [...row.conduct.map(c=>c.evidence),...row.penaltyRules.map(p=>p.evidence),...row.dependencies]) {
   expect(docs[span.section].text.slice(span.start,span.end)).toBe(span.text);
   expect(span.sourceHash).toBe(docs[span.section].contentHash);
  }
 });
 it('corrects abduction and preserves the already published unlawful-restraint correction',()=>{
  expect(rows('2905.02')[0].dependencies.map(d=>d.section)).toContain('2971.01');
  expect(rows('2905.02')[0].dependencies.map(d=>d.section)).not.toContain('2907.01');
  const published=JSON.parse(readFileSync('shared/ohio-major-publication.json','utf8'));
  expect(published.find((r:any)=>r.section==='2905.03').dependencies).toContain('2971.01');
 });
 it('retains all nine document-servitude predicates and the actual trafficking definition reference',()=>{
  expect(rows('2905.33')[0].dependencies.map(d=>d.section)).toEqual(['2905.01','2905.02','2905.32','2907.21','2907.22','2907.32','2907.321','2907.322','2907.323']);
  expect(rows('2905.32')[0].dependencies.map(d=>d.section)).toContain('2929.01');
  expect(rows('2905.32')[0].dependencies.map(d=>d.section)).not.toContain('5123.01');
  expect(rows('2905.32')[0].completePrimaryContext.text).toContain('ability to resist or consent');
 });
 it('keeps each usury conduct branch separate and includes its common prohibition',()=>{
  const usury=rows('2905.22');expect(usury).toHaveLength(3);
  for(let i=0;i<3;i++) {
   const included=usury[i].conduct.filter(c=>c.role==='included_conduct');
   expect(included).toHaveLength(1);expect(included[0].path).toBe(`A(${i+1})`);
   expect(usury[i].conduct[0].evidence.text).toContain('No person shall:');
   expect(included[0].evidence.text).not.toMatch(new RegExp(`^\\(${i===2?1:i+2}\\)`,'m'));
  }
  expect(usury.map(r=>r.penaltyRules[0].grades)).toEqual([['F4'],['F4'],['M1']]);
 });
 it('excludes held conduct from included spans, retaining the unrelated definition only as excluded context',()=>{
  const services=rows('2909.04')[0];
  expect(services.conduct.filter(c=>c.role==='included_conduct').map(c=>c.path)).toEqual(['A(1)','A(2)','B']);
  expect(services.conduct.map(c=>c.evidence.text).join('\n')).not.toContain('Substantially impair the ability');
  const mischief=rows('2909.07')[0];
  expect(mischief.conduct.filter(c=>c.role==='included_conduct').map(c=>c.path)).toEqual(['A(1)','A(2)','A(3)','A(4)','A(5)','A(6)']);
  expect(mischief.penaltyRules.map(p=>p.path)).toEqual(['C(2)','C(3)']);
  expect(packet.excludedContext[0].definition.section).toBe('2133.21');
  expect(packet.excludedContext[0].definition.text).toContain('Emergency medical services personnel');
  expect(packet.excludedContext[0].status).toContain('still_excluded');
  expect(packet.boundaries.join(' ')).toContain('1509.01 hold');
 });
 it('retains exceptional life terms, date splits and additional fines in the exact grading evidence',()=>{
  expect(rows('2905.01')[0].penaltyRules.find(r=>r.path==='C(3)')!.evidence.text).toContain('maximum term of life imprisonment');
  expect(rows('2905.32')[0].penaltyRules[0].evidence.text).toContain('ten, eleven, twelve, thirteen, fourteen, or fifteen years');
  expect(rows('2909.05')[0].penaltyRules[0].evidence.text).toContain('in addition to the penalties');
  expect(rows('2909.03')[0].completePrimaryContext.text).toContain('affirmative defense');
  expect(rows('2905.11').every(r=>r.completePrimaryContext.text.includes('allied offenses'))).toBe(true);
 });
 it('rejects corrupted evidence, missing predicates and unsupported or absent subdivisions',()=>{
  const broken=structuredClone(docs);broken['2905.02'].text+='changed';
  expect(()=>buildOhioResidual(broken)).toThrow();
  const missing=structuredClone(docs);delete missing['2907.323'];
  expect(()=>buildOhioResidual(missing)).toThrow('Missing dependency');
  expect(()=>subdivision(docs['2905.22'],'A(9)')).toThrow('Missing or ambiguous');
  expect(()=>subdivision(docs['2905.22'],'A(1)(a)')).toThrow('Unsupported');
  expect(()=>subdivision(docs['2905.22'],'Z')).toThrow('Missing division');
 });
 it('describes the packet as verification only, with no claim of availability',()=>{
  const text=renderOhioResidual(packet);expect(text).toContain('does not add selectable charges');
  expect(text).not.toMatch(/[\u2013\u2014]/);
  expect(text).toContain('Only two absent dependency documents');
 });
});
