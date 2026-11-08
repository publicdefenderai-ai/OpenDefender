import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {describe,it,expect} from 'vitest';
import packet from '../scripts/data-review/output/florida-harm-corrections.json';
import plan from '../scripts/data-review/florida-harm/correction-plan.json';
import before from '../scripts/data-review/florida-harm/previous-definitions.json';
import baseline from '../scripts/data-review/florida-harm/previous-evidence.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getChargeById} from '../shared/criminal-charges';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaHarmIncorporatedConduct} from '../scripts/data-review/florida-harm/validate';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const rows=buildFloridaReviewedSourceRecords(packet.definitions as any,packet.report as any,packet.eligibility as any);
describe('Florida harm-family individually bound corrections',()=>{
 it('reproduces eleven existing choices and twenty-nine official sources offline',()=>{
  execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-harm/prepare.ts','--check']);
  expect(rows).toHaveLength(11);expect(Object.keys(packet.documents)).toHaveLength(29);
  expect(FLORIDA_REVIEWED_DEFINITIONS).toHaveLength(101);
  expect(packet.effectiveDateEvidence.chapter).toBe('2026-86');
  expect(packet.effectiveDateEvidence.sourceUrl).toBe('https://laws.flrules.org/2026/86');
  expect(packet.effectiveDateEvidence.effectiveDate).toBe('2026-07-01');
  expect(hash(packet.effectiveDateEvidence.effectiveDateQuote)).toBe(packet.effectiveDateEvidence.quoteSha256);
  for(const d of Object.values(packet.documents)) {expect(hash(d.text)).toBe(d.contentHash);expect(d.sourceUrl).toMatch(/^https:\/\/www.leg.state.fl.us\/statutes\/index.cfm/);}
 });
 it('keeps every charged identity, grade and incorporated definition individually bound',()=>{
  expect(()=>validateFloridaHarmIncorporatedConduct(packet)).not.toThrow();
  for(const row of rows){
   for(const span of [row.identityEvidence,...row.conductEvidence,...row.gradeEvidence]){
    const d=packet.report.sourceEvidence[span.sourceKey as keyof typeof packet.report.sourceEvidence];
    expect((span.target==='title'?d.title:d.text).slice(span.start,span.end)).toBe(span.text);
   }
   const prior=baseline.find(d=>d.id===row.chargeId)!;
   for(const old of prior.requiredDependencies) expect(row.dependencies.some(d=>d.sourceKey===old.sourceKey&&d.dependencyRole===old.role)).toBe(true);
  }
  const child=packet.incorporatedConduct.find(r=>r.id.startsWith('fl-fs-827-03-2-b'))!;
  expect(child.spans.map(s=>s.scope)).toEqual(['(1)(e)']);
  expect(child.spans[0].text).toContain('willful failure');
  expect(child.spans[0].text).toContain('independent and unsupervised activities');
  expect(child.spans[0].text).toContain('willful and wanton conduct');
  const mapped=packet.report.drafts.find(d=>d.id===child.id)!;
  expect(mapped.conductEvidence.map(s=>s.text).join(' ')).not.toContain('without causing great bodily harm');
  expect(packet.documents['825.102'].text).toContain('reasonable cause to believe');
 });
 it('rejects missing, altered, wrong-scope or unbound incorporated evidence independently of regeneration',()=>{
  for(const mutate of [
   (p:any)=>p.incorporatedConduct.pop(),
   (p:any)=>p.incorporatedConduct[1].spans.pop(),
   (p:any)=>p.incorporatedConduct[1].spans[0].start++,
   (p:any)=>p.incorporatedConduct[1].spans[0].text+='x',
   (p:any)=>p.incorporatedConduct[1].spans[0].contentHash='0'.repeat(64),
   (p:any)=>p.incorporatedConduct[1].spans[0].scope='(1)',
   (p:any)=>p.incorporatedConduct[1].spans[0].section='775.082',
   (p:any)=>p.documents['825.102'].text+='x',
  ]){const altered=structuredClone(packet);mutate(altered);expect(()=>validateFloridaHarmIncorporatedConduct(altered)).toThrow();}
 });
 it('preserves all existing identities, ordinary felony categories and translated summaries',()=>{
  for(const old of before){
   const after=FLORIDA_REVIEWED_DEFINITIONS.find(d=>d.id===old.id)!;
   expect(after.name).toBe(old.name);expect(after.code).toBe(old.code);expect(after.names).toEqual(old.names);
   expect(after.category).toBe(old.category);expect(after.categories).toEqual(old.categories);
   expect(getChargeById(old.id)?.category).toBe('felony');
   for(const lang of ['en','es','zh'] as const){
    const exp=getChargeExplanation('', 'FL',lang,old.id)!;
    expect(exp.plainSummary).toBe(old.text[lang].plainSummary);
    expect(exp.degreeContext).toContain(old.text[lang].degreeContext);
    if(lang!=='en'){expect(exp.translationDraft).toBe(true);expect(exp.untranslated).not.toBe(true);}
   }
  }
 });
 it('keeps ordinary and conditional ranges distinct and never treats negligence or a label as intentional domestic injury',()=>{
  const ordinary={F1:'up to 30 years',F2:'up to 15 years',F3:'up to 5 years'};
  const enhanced={F1:'life felony',F2:'up to 30 years',F3:'up to 15 years'};
  for(const row of plan.records){
   const d=packet.definitions.find(d=>d.id===row.id)!;const text=d.text.en.degreeContext;
   expect(text).toContain(ordinary[row.ordinaryGrade as keyof typeof ordinary]);expect(text).toContain(enhanced[row.ordinaryGrade as keyof typeof enhanced]);
   for(const phrase of ['Psychological injury or risk alone','a separately listed offense','family or household relationship','at the time of the offense','on or after July 1, 2026','not established merely by culpable negligence','If adjudicated guilty and intentional bodily harm','nonsuspended incarceration','twice the pecuniary gain or loss']) expect(text).toContain(phrase);
   if(row.ordinaryGrade==='F1')expect(text).toContain('$15,000');
   for(const section of ['741.28','741.2801','741.281','741.283','741.325','775.082','775.083','775.084'])expect(row.requiredSections.some(r=>r.section===section)).toBe(true);
  }
  const child=packet.definitions.find(r=>r.code==='827.03(2)(d)')!;
  expect(child.text.en.degreeContext).toContain('independent, unsupervised childhood activities');
  const elder=packet.definitions.find(r=>r.code==='825.102(1)')!;
  expect(elder.text.en.degreeContext).toContain('reasonably believed the action was necessary');
 });
 it('retains approval-bound evidence and withholds the older family without a matching current receipt',()=>{
  const corrupted=structuredClone(packet.report);corrupted.drafts[0].requiredDependencies.pop();
  expect(()=>buildFloridaReviewedSourceRecords(packet.definitions as any,corrupted as any,packet.eligibility as any)).toThrow();
  const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);
  expect(all).toHaveLength(101);
  expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,all,new Date(receipt.checkedAt))).not.toBeNull();
 });
});
