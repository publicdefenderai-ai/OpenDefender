import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {build,validateSources,validateBindings} from '../scripts/data-review/new-york-first-pass/review.mjs';
import baseline from '../scripts/data-review/new-york-first-pass/baseline.json';
import sources from '../scripts/data-review/new-york-first-pass/candidate-sources.json';
import packet from '../scripts/data-review/new-york-first-pass/candidate-review.json';
import manifest from '../scripts/data-review/output/ny-source-manifest.json';
import {buildNewYorkSourceDatabaseSeed,type NewYorkAuthorityManifest} from '../server/data/new-york-source-database-seed';
const copy=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
const source=(section:string)=>sources.find(s=>s.sourceKey===`ny:PEN:${section}`)!;
describe('New York candidate-only first pass',()=>{
 it('replays the four-record packet with 28 citations, without making publication claims',()=>{
  expect(build()).toEqual(packet);expect(packet.benchmark).toHaveLength(28);
  expect(packet.counts).toMatchObject({candidateReviewedRecords:4,newPublishedRecords:0,liveSelections:null});
  expect(packet.records.every(r=>r.researchOnly&&r.publicationStatus.startsWith('blocked_'))).toBe(true);
  expect(packet.publicationBlockers.join(' ')).toContain('API-only');
 });
 it('preserves all 121 exact existing identities and all 27 reselection holds in the pure offline builder',()=>{
  expect(baseline.rows).toHaveLength(121);
  const currentIds=new Set(manifest.catalogRecords.map(r=>r.chargeId));
  for(const row of baseline.rows)expect(currentIds.has(row.id)).toBe(true);
  const held=baseline.rows.filter(r=>r.disposition==='require_exact_reselection').map(r=>r.id).sort();
  expect(held).toHaveLength(27);
  const currentHolds=new Set(manifest.catalogRecords.filter(r=>r.disposition==='require_exact_reselection').map(r=>r.chargeId));
  for(const id of held)expect(currentHolds.has(id)).toBe(true);
  const seed=buildNewYorkSourceDatabaseSeed(manifest as unknown as NewYorkAuthorityManifest);
  for(const id of held)expect(seed.selectableChargeIds).not.toContain(id);
  // The frozen snapshot is 121 records / 94 configured IDs, not a future catalog ceiling.
  // Additional reviewed IDs may grow the current manifest without rewriting history.
  expect(new Set(seed.catalogRecords.map(r=>r.chargeId)).size).toBe(seed.catalogRecords.length);
 });
 it('independently checks Class B trespass and the Class A property classifications',()=>{
  expect(source('140.10').text).toContain('is a class B misdemeanor');
  for(const section of ['155.25','165.40','145.00'])expect(source(section).text.replace(/\s+/g,' ')).toContain('class A misdemeanor');
  const text=source('70.15').text.replace(/\s+/g,' ');
  expect(text).toContain('shall not exceed three hundred sixty-four days');expect(text).toContain('shall not exceed three months');
  expect(text).toContain('shall apply to all persons who are sentenced before, on or after');
  expect(packet.records.find(r=>r.section==='140.10')!.proposedOrdinaryPenalty).toContain('three months');
  expect(packet.records.filter(r=>r.grade==='A').every(r=>r.proposedOrdinaryPenalty.includes('364 days'))).toBe(true);
 });
 it('checks fine alternatives, incorporated definitions, and precise conduct limits',()=>{
  const fine=source('80.05').text.replace(/\s+/g,' ');
  for(const phrase of ['one thousand dollars','five hundred dollars','not exceeding double','shall not apply to a corporation'])expect(fine).toContain(phrase);
  expect(source('145.00').text.replace(/\s+/g,' ')).toContain('exceeding two hundred fifty dollars');
  expect(source('145.00').text.replace(/\s+/g,' ')).toContain('ownership interest in such equipment shall not be a defense');
  expect(packet.records.find(r=>r.section==='145.00')!.bindings.map(b=>b.sourceKey)).toContain('ny:RPA:1971-A');
  expect(packet.records.find(r=>r.section==='140.10')!.bindings.map(b=>b.sourceKey)).toContain('ny:PBH:1392');
  expect(source('165.40').text.replace(/\s+/g,' ')).toContain('or to impede the recovery by an owner');
  expect(source('155.25').text).not.toContain('thousand');
 });
 it('rejects modified bodies, identities, missing dependencies, and corrupted offsets',()=>{
  const changed=copy(sources);changed[0].text+=' changed';expect(()=>validateSources(changed)).toThrow('hash mismatch');
  const wrong=copy(sources);wrong[0].sourceUrl='https://example.org';expect(()=>validateSources(wrong)).toThrow('identity');
  const missing=copy(packet);missing.records[0].bindings.pop();expect(()=>validateBindings(missing,sources)).toThrow('coverage');
  const offset=copy(packet);offset.records[0].bindings[0].start++;expect(()=>validateBindings(offset,sources)).toThrow('span');
  const metadata=copy(sources);metadata[0].effectiveDateStart='2026-01-01' as never;expect(()=>validateSources(metadata)).toThrow('provenance');
 });
 it('keeps section matches distinct from supported charge coverage and records current source metadata honestly',()=>{
  expect(packet.benchmark.every(r=>r.status==='same_section_requires_scope_review'||r.status==='no_baseline_section_mapping')).toBe(true);
  expect(sources.every(s=>s.effectiveDateStart===null&&s.acquisitionChannel.includes('research_only'))).toBe(true);
  expect(fs.readFileSync('scripts/data-review/new-york-first-pass/review.mjs','utf8')).not.toContain('seedNewYorkSourceDatabase');
 });
 it('executes candidate acquisition parser/output boundary tests in CI',()=>{
  execFileSync('python3',['-m','unittest','discover','-s','scripts/data-review/new-york-first-pass','-p','test_*.py'],{stdio:'pipe'});
 });
});

describe('read-only official API candidate collector',()=>{
 it('validates exact identity and preserves API dates without claiming legal effectiveness',async()=>{
  const {fetchCandidateDocument}=await import('../scripts/data-review/new-york-first-pass/collect-api.mjs');
  const ref=sources.find(s=>s.section==='155.25')!;
  const fixture={success:true,result:{lawId:'PEN',docLevelId:'155.25',title:'Petit larceny',text:ref.text,activeDate:'2020-01-01',publishedDates:['2020-02-01']}};
  const result=await fetchCandidateDocument(ref,'fixture-key',async()=>({ok:true,json:async()=>fixture}));
  expect(result.section).toBe('155.25');expect(result.activeDate).toBe('2020-01-01');
  expect(result.metadataMeaning).toContain('not independently');expect(JSON.stringify(result)).not.toContain('fixture-key');
  const wrong=copy(fixture);wrong.result.docLevelId='155.30';
  await expect(fetchCandidateDocument(ref,'fixture-key',async()=>({ok:true,json:async()=>wrong}))).rejects.toThrow('acquisition failed');
  await expect(fetchCandidateDocument(ref,'fixture-key',async()=>{throw Error('secret fixture-key')})).rejects.not.toThrow('fixture-key');
 });
 it('rejects checkout output and missing credentials before any network activity',async()=>{
  const {validateOutput,collect}=await import('../scripts/data-review/new-york-first-pass/collect-api.mjs');
  expect(()=>validateOutput(process.cwd()+'/new-candidate')).toThrow('outside checkout');
  expect(()=>validateOutput('relative')).toThrow('Absolute');
  await expect(collect('/private/tmp/unused-ny-output','')).rejects.toThrow('NY_SENATE_API_KEY');
 });
});
