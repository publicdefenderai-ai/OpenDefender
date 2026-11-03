import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { bind, buildOhioMajorSubstantive, division } from '../scripts/data-review/ohio-major-substantive';
const report = buildOhioMajorSubstantive();
const rows = (section: string) => report.records.filter(r => r.section === section);
const text = (section: string) => rows(section)[0].completePrimary.text;
describe('Ohio individual substantive statutory mappings', () => {
  it('accounts for all 32 sections without promoting supporting provisions to crimes', () => {
    expect(report.counts).toEqual({ primarySections: 32, mappedSections: 28, individualMappings: 34, separatelyDisposedSections: 4 });
    expect(rows('2905.111')).toEqual([]); expect(rows('2909.31')).toEqual([]);
    expect(rows('2905.11').find(r => r.scope === 'D')!.dependencies.map(d => d.section)).toContain('2905.111');
  });
  it('preserves full comma-containing statutory names and unnamed-grade identity', () => {
    expect(rows('2909.10')[1].statutoryName).toBe('criminal trespass on a locomotive, engine, railroad car, or other railroad vehicle');
    expect(rows('2909.26')[0].statutoryName).toContain('radiological or nuclear weapon, or explosive device');
    expect(rows('2905.22')).toHaveLength(3);
    expect(rows('2905.22').every(r => r.namingBasis.startsWith('official_heading'))).toBe(true);
  });
  it('keeps the safe-release exclusion and special trafficking prison range in bound grading', () => {
    expect(rows('2905.01')[0].grading[0].text).toContain('(A)(1) to (5), (B)(1), or (B)(2)');
    expect(rows('2905.32')[0].grading[0].text).toContain('ten, eleven, twelve, thirteen, fourteen, or fifteen years');
  });
  it('retains arson registration and offense-specific additional sanctions', () => {
    for (const section of ['2909.02','2909.03']) expect(rows(section)[0].dependencies.map(d => d.section)).toEqual(expect.arrayContaining(['2909.13','2909.14','2909.15']));
    expect(rows('2909.05')[0].grading[0].text).toContain('in addition to the penalties');
    expect(rows('2911.23')[0].grading[0].text).toContain('community service');
  });
  it('does not make terrorism an automatic felony or flatten predicate-specific punishment', () => {
    expect(rows('2909.29')[0].grading[0].text).toContain('misdemeanor of the first degree');
    expect(rows('2909.29')[0].grading[0].text).toContain('seventy-five thousand dollars');
    expect(rows('2909.24')).toEqual([]);
    expect(report.exceptions.find(r => r.section === '2909.24')!.evidence.text).toContain('life imprisonment without parole');
  });
  it('preserves enforceability and incorporated-definition holds without blocking unrelated scopes', () => {
    expect(rows('2905.05')).toEqual([]);
    expect(report.exceptions.find(r => r.section === '2905.05')!.authority).toHaveLength(3);
    expect(rows('2909.04')[0].scope).toBe('A(1),A(2),B');
    expect(rows('2909.07')[0].scope).toBe('A(1)-A(6)');
    expect(rows('2911.211')[0].scope).toBe('A(1)');
    expect(report.excludedBranches.filter(r => r.reason.includes('1509')).length).toBe(2);
  });
  it('rejects source drift, missing subdivisions and invalid spans', () => {
    const documents = JSON.parse(readFileSync('scripts/data-review/output/ohio-major-coverage-evidence.json', 'utf8')).documents;
    const doc = documents['2909.10'];
    expect(() => bind({ ...doc, text: doc.text + 'changed' })).toThrow('Invalid retained source');
    expect(() => division(doc, 'E')).toThrow('Missing division');
    expect(() => bind(doc, -1)).toThrow('Invalid span');
    expect(() => bind({ ...doc, effectiveDateStart: '' })).toThrow('Invalid retained source');
  });
  it('reproduces the committed mapping and retains individual conduct and grading bindings', () => {
    expect(JSON.parse(readFileSync('scripts/data-review/output/ohio-major-substantive-mapping.json','utf8'))).toEqual(report);
    for (const row of report.records) {
      expect(row.conduct.length).toBeGreaterThan(0); expect(row.grading.length).toBeGreaterThan(0);
      for (const span of [...row.conduct, ...row.grading]) expect(text(row.section).slice(span.start,span.end)).toBe(span.text);
    }
  });
});
