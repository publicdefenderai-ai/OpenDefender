import {execFileSync} from 'node:child_process';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-property-fraud-corrections.json';
import prior from '../scripts/data-review/florida-property-fraud/previous-definitions.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaPropertyFraudIncorporatedConduct} from '../scripts/data-review/florida-property-fraud/validate';

const charge = (code:string) => packet.definitions.find(row=>row.code === code)!;

it('reconstructs thirteen existing property and fraud records with individually bound spans',()=>{
  execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-property-fraud/prepare.ts','--check']);
  expect(packet.definitions.filter(d=>d.code.startsWith('812.'))).toHaveLength(7);
  expect(packet.definitions.filter(d=>d.code.startsWith('817.'))).toHaveLength(6);
  expect(packet.definitions.map(d=>d.id)).toEqual(prior.map(d=>d.id));
  expect(packet.effectiveDateEvidence.map(e=>e.chapter)).toEqual(['2026-86']);
  const altered=structuredClone(packet);
  altered.incorporatedConduct[0].spans[0].end--;
  expect(()=>validateFloridaPropertyFraudIncorporatedConduct(altered)).toThrow(/span/);
});

it('keeps ordinary misdemeanor grades visible alongside supported felony alternatives',()=>{
  for (const code of ['812.014(2)(e)','817.61','817.568(4)']) {
    const d=charge(code);
    expect(getChargeById(d.id)?.category).toBe('misdemeanor');
    expect(getChargeById(d.id)?.categories).toEqual(['misdemeanor','felony']);
    expect(packet.report.drafts.find(r=>r.id===d.id)?.gradeEvidence.map(e=>e.category)).toEqual(['misdemeanor','felony']);
  }
  expect(charge('817.61').text.en.degreeContext).toContain('six-month use or value');
  expect(charge('812.014(3)(a)').text.en.degreeContext).toContain('60 days');
  expect(charge('812.019').text.en.degreeContext).toContain('only one of those counts');
});

it('preserves distinct mandatory and conditional financial and sentencing consequences',()=>{
  for (const d of packet.definitions) {
    expect(d.text.en.degreeContext.includes('$1,001')).toBe(d.code.startsWith('817.568'));
    expect(d.text.en.degreeContext.includes('Restitution is mandatory')).toBe(d.code.startsWith('812.015'));
    expect(d.text.en.degreeContext.includes('10-year minimum')).toBe(['817.568(2)','817.568(8)'].includes(d.code));
    expect(d.text.en.degreeContext.includes('court-designated public service')).toBe(d.code.startsWith('812.014'));
    for (const lang of ['en','es','zh'] as const) {
      const explanation=getChargeExplanation('','FL',lang,d.id)!;
      expect(explanation.degreeContext).toBe(d.text[lang].degreeContext);
      expect(explanation.plainSummary).toBe(prior.find(r=>r.id===d.id)!.text[lang].plainSummary);
    }
  }
  const retail=packet.incorporatedConduct.find(r=>r.id===charge('812.015(8)-(11)').id)!;
  expect(retail.spans.find(s=>s.section==='812.015'&&s.scope==='(1)(i)')?.text).toContain('“Retail theft”');
  expect(charge('817.234(1)(a)').text.en.degreeContext).toContain('civil penalty');
});

it('keeps the corrected reviewed family behind its existing receipt gate',()=>{
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);
  expect(records).toHaveLength(101);
  expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,records,new Date(receipt.checkedAt))).not.toBeNull();
});
