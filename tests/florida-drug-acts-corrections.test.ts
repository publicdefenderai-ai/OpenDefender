import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-drug-acts-corrections.json';
import prior from '../scripts/data-review/florida-drug-acts/previous-definitions.json';
import plan from '../scripts/data-review/florida-drug-acts/correction-plan.json';
import trafficking from '../scripts/data-review/output/florida-trafficking-corrections.json';
import screen from '../scripts/data-review/output/florida-domestic-applicability-screen.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaDrugActsIncorporatedConduct} from '../scripts/data-review/florida-drug-acts/validate';
const row=(code:string)=>packet.definitions.find(d=>d.code===code)!;
const spans=(id:string)=>packet.incorporatedConduct.find(r=>r.id===id)!.spans;
it('reproduces all thirteen existing records with their own precise conduct, grade and supporting evidence',()=>{
 execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-drug-acts/prepare.ts','--check']);
 const bound=buildFloridaReviewedSourceRecords(packet.definitions as any,packet.report as any,packet.eligibility as any);
 expect(bound).toHaveLength(13);expect(Object.keys(packet.documents)).toHaveLength(15);
 for(const doc of Object.values(packet.documents))expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
 for(const r of bound)for(const s of [r.identityEvidence,...r.conductEvidence,...r.gradeEvidence]){const doc=packet.report.sourceEvidence[s.sourceKey as keyof typeof packet.report.sourceEvidence];expect((s.target==='title'?doc.title:doc.text).slice(s.start,s.end)).toBe(s.text);}
 const changed=structuredClone(packet);changed.incorporatedConduct[0].spans[0].start++;expect(()=>validateFloridaDrugActsIncorporatedConduct(changed)).toThrow();
 const complete=[...packet.definitions,...trafficking.definitions].map(d=>d.id).sort();expect(complete).toEqual(screen.rows.filter(r=>r.code.startsWith('893.')).map(r=>r.id).sort());
});
it('matches the three individual grading divisions to actual schedules for each ordinary act and the adult/minor branch',()=>{
 for(const code of ['893.13(1)(a)','893.13(2)(a)','893.13(4)','893.13(5)']){
  const d=row(code),r=plan.records.find(r=>r.id===d.id)!;const minor=code==='893.13(4)';const grades=code.endsWith('(a)')?['1.','2.','3.']:['(a)','(b)','(c)'];
  const byGrade=grades.map(s=>spans(d.id).find(t=>t.section==='893.13'&&t.scope===r.scope+s)!.text);
  expect(byGrade[0]).toContain('(2)(c)5.');expect(byGrade[0]).toContain(minor?'felony of the first degree':'felony of the second degree');
  expect(byGrade[1]).toContain('(2)(c)10.');expect(byGrade[1]).toContain(minor?'felony of the second degree':'felony of the third degree');
  expect(byGrade[2]).toContain(minor?'Any other controlled substance':'893.03(5)');expect(byGrade[2]).toContain(minor?'felony of the third degree':'misdemeanor of the first degree');
  expect(d.text.en.degreeContext).toContain('(2)(c)1 through 3 or 6 through 10');expect(d.text.en.degreeContext.includes('place the convicted person on probation')).toBe(minor);
 }
 const possession=row('893.13(6)(a)');expect(getChargeById(possession.id)?.searchAliases).toContain('Possession of a controlled substance');expect(possession.text.en.degreeContext).toContain('60 days and $500');expect(possession.text.en.degreeContext).toContain('excluding extracted resin');expect(possession.categories).toBeUndefined();
 expect(row('893.13(1)(a)').text.en.degreeContext).toContain('without consideration');expect(row('893.147(6)').categories).toEqual(['misdemeanor','felony']);
});
it('limits overdose-assistance immunity and object classification to the applicable product records',()=>{
 for(const d of packet.definitions){const covered=['893.13(6)(a)','893.147(1)'].includes(d.code);
  expect(d.text.en.degreeContext.includes('Section 893.21 protects')).toBe(covered);expect(d.citations.some(c=>c.citation==='Fla. Stat. § 893.21')).toBe(covered);
  if(covered){expect(d.text.en.degreeContext).toContain('evidence for this charge came from seeking that help');expect(d.text.en.degreeContext).toContain('other prosecutions');}
  const o=prior.find(r=>r.id===d.id)!;expect(d.name).toBe(o.name);expect(d.category).toBe(o.category);expect(d.categories).toEqual(o.categories);
  for(const lang of ['en','es','zh'] as const){const e=getChargeExplanation('','FL',lang,d.id)!;expect(e.degreeContext).toBe(d.text[lang].degreeContext);expect(e.plainSummary).toBe(o.text[lang].plainSummary);if(lang!=='en'){expect(e.translationDraft).toBe(true);expect(e.untranslated).not.toBe(true);}}
 }
 const syringe=row('893.147(3)(b)');expect(syringe.text.en.degreeContext).toContain('valid prescription');expect(syringe.citations.some(c=>c.citation==='Fla. Stat. § 893.146')).toBe(false);
 expect(row('893.147(1)').text.en.degreeContext).toContain('July 1, 2026');expect(row('893.147(4)(b)').text.en.degreeContext).toContain('probable cause of a nexus');
});
it('retains original receipt and publication holds after correction',()=>{
 const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);expect(all).toHaveLength(101);
 expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,all,new Date(receipt.checkedAt))).not.toBeNull();expect(FLORIDA_REVIEWED_DEFINITIONS.some(d=>d.code==='893.147(7)')).toBe(false);
 expect(packet.definitions.filter(d=>d.code.startsWith('893.13(')).every(d=>d.text.en.degreeContext.includes('non-cannabis applications'))).toBe(true);
});
