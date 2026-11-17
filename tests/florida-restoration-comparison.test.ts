import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { compareRetainedDocuments, compareFloridaReviewedSources } from '../scripts/data-review/florida-launch/compare-reviewed-sources';
import type { FloridaBatchDocument } from '../scripts/data-review/batch/florida-adapter';

const text='Current operative conduct.\n\nPenalty applies.';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const old={text,contentHash:hash(text),title:'Test provision',effectiveDateStart:null};
const candidate={...old,section:'123.45',edition:'Florida Statutes 2026'} as FloridaBatchDocument;
it('distinguishes substantive and formatting changes from matching text',()=>{
  expect(compareRetainedDocuments([old],candidate)).toBe('matching_text_and_retained_metadata');
  expect(compareRetainedDocuments([old],{...candidate,text:text.replace('conduct','new conduct')})).toBe('source_text_difference_requires_review');
  expect(compareRetainedDocuments([old],{...candidate,text:text.replace('\n\n',' ')})).toBe('extraction_formatting_difference');
  expect(compareRetainedDocuments([old],{...candidate,effectiveDateStart:'2027-01-01'})).toBe('version_metadata_difference_requires_review');
  expect(compareRetainedDocuments([old],null)).toBe('unavailable_or_unresolved');
});
it('refuses corrupt baselines and examines every retained version',()=>{
  expect(()=>compareRetainedDocuments([{...old,contentHash:'wrong'}],candidate)).toThrow('Invalid retained');
  const previous={...old,text:'Older conduct.',contentHash:hash('Older conduct.')};
  expect(compareRetainedDocuments([old,previous],candidate)).toBe('source_text_difference_requires_review');
});

it('rejects the active checkout as a candidate destination before writing',async()=>{
  await expect(compareFloridaReviewedSources(process.cwd())).rejects.toThrow('outside the checkout');
});

it('accounts for all reviewed identities and every required dependency binding in the completed candidate report',async()=>{
  const {readFileSync}=await import('node:fs');
  const {FLORIDA_REVIEWED_SOURCE_RECORDS:records}=await import('../server/data/florida-reviewed-source-records');
  const report=JSON.parse(readFileSync('scripts/data-review/florida-launch/restoration-comparison.json','utf8'));
  expect(report.recordCoverage.map((r:{id:string})=>r.id).sort()).toEqual(records.map(r=>r.chargeId).sort());
  for(const record of records){
    const coverage=report.recordCoverage.find((r:{id:string})=>r.id===record.chargeId);
    expect(coverage.complete).toBe(true);
    expect(coverage.bindings.map((r:{sourceKey:string})=>r.sourceKey)).toEqual(record.dependencies.map(r=>r.sourceKey));
    for(const dependency of record.dependencies)expect(coverage.bindings).toContainEqual(expect.objectContaining({sourceKey:dependency.sourceKey,retainedHash:dependency.contentHash,candidateHash:dependency.contentHash}));
  }
  expect(report.activeBefore).toEqual(report.activeAfter);
});
