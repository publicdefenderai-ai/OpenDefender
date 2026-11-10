import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {it,expect} from 'vitest';
import packet from '../scripts/data-review/output/florida-roadway-corrections.json';
import before from '../scripts/data-review/florida-roadway/previous-definitions.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getChargeById} from '../shared/criminal-charges';
import {assembleFloridaReviewedReport,buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaRoadwayIncorporatedConduct} from '../scripts/data-review/florida-roadway/validate';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const rows=buildFloridaReviewedSourceRecords(packet.definitions as any,packet.report as any,packet.eligibility as any);
it('reproduces four existing roadway choices and 32 exact official sources offline',()=>{
 execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-roadway/prepare.ts','--check']);
 expect(rows).toHaveLength(4);expect(Object.keys(packet.documents)).toHaveLength(32);
 for(const d of Object.values(packet.documents)){expect(hash(d.text)).toBe(d.contentHash);expect(d.sourceUrl).toMatch(/^https:\/\/www.leg.state.fl.us\/statutes\/index.cfm/);}
 expect(packet.effectiveDateEvidence.map(r=>[r.chapter,r.effectiveDate])).toEqual([['2025-121','2025-10-01'],['2026-86','2026-07-01']]);
 for(const e of packet.effectiveDateEvidence)expect(hash(e.effectiveDateQuote)).toBe(e.quoteSha256);
 for(const row of rows)for(const span of [row.identityEvidence,...row.conductEvidence,...row.gradeEvidence]){
  const d=packet.report.sourceEvidence[span.sourceKey as keyof typeof packet.report.sourceEvidence];
  expect((span.target==='title'?d.title:d.text).slice(span.start,span.end)).toBe(span.text);
 }
});
it('retains exact supplemental bindings and rejects missing or altered evidence',()=>{
 expect(()=>validateFloridaRoadwayIncorporatedConduct(packet)).not.toThrow();
 for(const mutate of [(p:any)=>p.incorporatedConduct.pop(),(p:any)=>p.incorporatedConduct[0].spans.pop(),(p:any)=>p.incorporatedConduct[0].spans[0].start++,(p:any)=>p.incorporatedConduct[0].spans[0].text+='x',(p:any)=>p.incorporatedConduct[0].spans[0].contentHash='0'.repeat(64),(p:any)=>p.documents['316.062'].text+='x']){
  const p=structuredClone(packet);mutate(p);expect(()=>validateFloridaRoadwayIncorporatedConduct(p)).toThrow();
 }
});
it('accepts a two-digit chapter only with an exact declared citation and official URL',()=>{
 const now=new Date(Math.max(...Object.values(packet.documents).map(d=>Date.parse(d.retrievedAt))));
 const assemble=(defs:any)=>assembleFloridaReviewedReport(defs,packet.analyses as any,{schemaVersion:1,jurisdiction:'FL',documents:packet.documents} as any,now);
 expect(assemble(packet.definitions).technicalHolds).toEqual([]);
 for(const mutation of ['Fla. Stat. § 61.13016 extra','Fla. Stat. § 061.13016']){
  const defs=structuredClone(packet.definitions);const d=defs.find(d=>d.code==='322.34(2)')!;
  d.citations.find(c=>c.citation==='Fla. Stat. § 61.13016')!.citation=mutation;
  expect(assemble(defs).technicalHolds.some(h=>h.reason.includes('Public secondary citations failed'))).toBe(true);
 }
 const defs=structuredClone(packet.definitions);defs.find(d=>d.code==='322.34(2)')!.citations.find(c=>c.citation==='Fla. Stat. § 61.13016')!.url='https://example.org/61.13016';
 expect(assemble(defs).technicalHolds.some(h=>h.reason.includes('public URL does not match'))).toBe(true);
});
it('preserves names and translated bases while restoring ordinary misdemeanor primary grades',()=>{
 for(const old of before){
  const d=FLORIDA_REVIEWED_DEFINITIONS.find(d=>d.id===old.id)!;
  expect(d.name).toBe(old.name);expect(d.code).toBe(old.code);expect(d.names).toEqual(old.names);
  const category=old.code==='316.193(3)(c)3.'?'felony':'misdemeanor';expect(getChargeById(d.id)?.category).toBe(category);
  if(['316.193(1)','322.34(2)'].includes(d.code))expect(d.categories).toEqual(['misdemeanor','felony']);
  for(const lang of ['en','es','zh'] as const){const e=getChargeExplanation('','FL',lang,d.id)!;expect(e.plainSummary).toBe(old.text[lang].plainSummary);expect(e.degreeContext).toContain(old.text[lang].degreeContext);if(lang!=='en'){expect(e.translationDraft).toBe(true);expect(e.untranslated).not.toBe(true);}}
 }
});
it('keeps the 101-record family withheld without a separately matching receipt',()=>{
 const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);expect(all).toHaveLength(101);
 expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,all,new Date(receipt.checkedAt))).not.toBeNull();
});
it('keeps ordinary, special-suspension and manslaughter consequences distinct',()=>{
 const text=(code:string)=>packet.definitions.find(d=>d.code===code)!.text.en.degreeContext;
 for(const phrase of ['Subsection (10)','no prior forcible-felony','M2 for a first','M1 for a second','preceding 12 months','three elections','does not itself prove lack of knowledge'])expect(text('322.34(2)')).toContain(phrase);
 const suspension=packet.incorporatedConduct.find(d=>d.id.includes('322-34'))!;
 expect(suspension.spans.map(s=>s.scope)).toEqual(['(3)','(4)','(10)','(11)']);
 for(const phrase of ['four-year mandatory minimum','October 1, 2025','327.35(3)(a)3.c.','ordinary prior DUI alone','intentional bodily harm','not merely negligent','July 1, 2026'])expect(text('316.193(3)(c)3.')).toContain(phrase);
 for(const phrase of ['50 hours','10 days','30 days','48 hours','180 days to 1 year','separately graded damage'])expect(text('316.193(1)')).toContain(phrase);
});
