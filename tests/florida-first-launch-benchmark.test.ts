import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { assess, configuredChoices } from '../scripts/data-review/florida-launch/benchmark.mjs';
import sample from '../scripts/data-review/florida-launch/official-sample.json';
import baseline from '../scripts/data-review/florida-launch/baseline-citation-results.json';
import sources from '../scripts/data-review/florida-launch/priority-evidence.json';

it('samples the fixed positions independently of the catalog in all ten levels', () => {
  expect(baseline.map(({citation})=>citation)).toEqual(sample.rows.map(({citation})=>citation));
  for (let level=1; level<=10; level++) {
    const rows = sample.rows.filter(row=>row.level===level);
    expect(rows.map(r=>r.row)).toEqual([.15,.5,.85].map(p=>1+Math.floor((rows[0].levelRows-1)*p)));
  }
  expect(baseline.filter(r=>r.result==='exact_citation')).toHaveLength(4);
  expect(baseline.filter(r=>r.result==='same_section_requires_scope_review')).toHaveLength(11);
  expect(baseline.filter(r=>r.result==='section_absent')).toHaveLength(15);
});
it('does not count a shared chapter or different subdivision as an exact citation', () => {
  const choices=[{id:'x',code:'825.103(3)(a)'},{id:'y',code:'825.1035(1)'}];
  expect(assess('825.103 (3)(a)',choices).result).toBe('exact_citation');
  expect(assess('825.103(3)(c)',choices).result).toBe('same_section_requires_scope_review');
  expect(assess('825.10',choices).result).toBe('section_absent');
  const current=configuredChoices();
  for(const c of ['a','b','c'])expect(assess('825.103(3)('+c+')',current).result).toBe('exact_citation');
  expect(current.some((r:{id:string})=>r.id==='fl-assault-on-peace-officer')).toBe(false);
});
it('recomputes the text hash on each separately retained priority source', () => {
  for (const doc of Object.values(sources)) {
    expect(doc.edition).toBe('Florida Statutes 2026');
    expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
  }
  expect(readFileSync('docs/florida-first-launch-benchmark.md','utf8')).toContain('§784.07(2)(d)');
});
