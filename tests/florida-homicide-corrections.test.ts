import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-homicide-corrections.json';
import roadway from '../scripts/data-review/output/florida-roadway-corrections.json';
import harm from '../scripts/data-review/output/florida-harm-corrections.json';
import screen from '../scripts/data-review/output/florida-domestic-applicability-screen.json';
import old from '../scripts/data-review/florida-homicide/previous-definitions.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {getChargeExplanation} from '../shared/charge-explanations';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaHomicideIncorporatedConduct} from '../scripts/data-review/florida-homicide/validate';
const rows=buildFloridaReviewedSourceRecords(packet.definitions as any,packet.report as any,packet.eligibility as any);
const byCode=(code:string)=>packet.definitions.find(d=>d.code===code)!;
it('reproduces the corrected records and predecessor roadway packet, and binds exact identity and grade spans',()=>{
 for(const family of ['homicide','roadway'])execFileSync(process.execPath,['--import','tsx',`scripts/data-review/florida-${family}/prepare.ts`,'--check']);
 expect(rows).toHaveLength(3);expect(Object.keys(packet.documents)).toHaveLength(29);
 for(const doc of Object.values(packet.documents))expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
 for(const row of rows) for(const span of [row.identityEvidence,...row.conductEvidence,...row.gradeEvidence]){
  const doc=packet.report.sourceEvidence[span.sourceKey as keyof typeof packet.report.sourceEvidence];
  expect((span.target==='title'?doc.title:doc.text).slice(span.start,span.end)).toBe(span.text);
 }
 const altered=structuredClone(packet);altered.incorporatedConduct[0].spans[0].end++;
 expect(()=>validateFloridaHomicideIncorporatedConduct(altered)).toThrow();
});
it('requires the exact branch, victim, burden and commencement for the officer-victim life rule',()=>{
 const text=packet.documents['782.065'].text;
 expect(text).toContain('beyond a reasonable doubt');expect(text).toContain('782.04(2), (3), or (4)');expect(text).toContain('manslaughter in violation of s. 782.07(1)');expect(text).toContain('official duties');
 expect(byCode('782.04(4)').text.en.degreeContext).toContain('life imprisonment without release');
 expect(byCode('782.04(5)').text.en.degreeContext).toContain('omits this subsection (5)');
 expect(byCode('782.07(1)').text.en.degreeContext).toContain('on or after June 16, 2026');
 const law=packet.effectiveDateEvidence.find(r=>r.chapter==='2026-144')!;expect(law.approvalDate).toBe(law.effectiveDate);expect(law.approvalQuote).toContain('June 16, 2026');
});
it('distinguishes the predicate exclusions, age, statutory causation and juvenile disposition in the actual explanations',()=>{
 const adult=byCode('782.04(4)'),youth=byCode('782.04(5)');expect(adult.name).toBe(youth.name);expect(adult.id).not.toBe(youth.id);
 expect(getChargeExplanation('', 'FL','en',adult.id)?.plainSummary).toContain('exclusions');
 const e=getChargeExplanation('','FL','en',youth.id)!;for(const phrase of ['under 18','alone was sufficient','July 1, 2025'])expect(e.plainSummary).toContain(phrase);
 for(const phrase of ['only if adult sanctions govern','already had a domestic-violence conviction','30 years'])expect(e.degreeContext).toContain(phrase);
 for(const d of old){expect(byCode(d.code).category).toBe(d.category);for(const l of ['es','zh'] as const){const x=getChargeExplanation('','FL',l,d.id)!;expect(x.translationDraft).toBe(true);expect(x.untranslated).not.toBe(true);expect(x.plainSummary).toEqual(byCode(d.code).text[l].plainSummary);}}
});
it('accounts for the fifteen screened injury/death IDs and keeps the corrected family gated',()=>{
 const priority=screen.rows.filter(r=>r.classification==='injury_or_death_condition_priority');expect(priority).toHaveLength(15);
 const completed=new Set([...harm.definitions,...roadway.definitions,...packet.definitions].map(d=>d.id));expect(priority.filter(r=>!completed.has(r.id))).toEqual([]);
 const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);expect(all).toHaveLength(101);
 expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,all,new Date(receipt.checkedAt))).not.toBeNull();
});
