import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-reviewed-closeout-corrections.json';
import prior from '../scripts/data-review/florida-reviewed-closeout/previous-definitions.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getChargeById} from '../shared/criminal-charges';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaCloseoutIncorporatedConduct} from '../scripts/data-review/florida-reviewed-closeout/validate';

const row=(code:string)=>packet.definitions.find(d=>d.code===code)!;

it('accounts for the exact remaining 26 IDs in the 101-record family',()=>{
  const covered=new Set<string>();
  const predecessors=['domestic','sexual-injunction','harm','roadway','homicide','trafficking','drug-acts','property-fraud','child-protection'];
  for (const name of predecessors) {
    const historical=JSON.parse(readFileSync(`scripts/data-review/output/florida-${name}-corrections.json`,'utf8')) as {definitions:{id:string}[]};
    historical.definitions.forEach(d=>covered.add(d.id));
  }
  expect(covered.size).toBe(75);
  expect(packet.definitions).toHaveLength(26);
  for(const d of packet.definitions){expect(covered.has(d.id)).toBe(false);covered.add(d.id);}
  expect(covered).toEqual(new Set(FLORIDA_REVIEWED_DEFINITIONS.map(d=>d.id)));
});

it('rebuilds all 26 definitions from individually supported primary and supplemental evidence',()=>{
  execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-reviewed-closeout/prepare.ts','--check']);
  for(const doc of Object.values(packet.documents)) {
    expect(createHash('sha256').update(doc.text).digest('hex')).toBe(doc.contentHash);
    expect(new URL(doc.sourceUrl).host).toBe('www.leg.state.fl.us');
  }
  for(const d of packet.definitions){
    const draft=packet.report.drafts.find(r=>r.id===d.id)!;
    expect(draft.conductEvidence.length).toBeGreaterThan(0);
    expect(draft.gradeEvidence.length).toBeGreaterThan(0);
    expect(draft.identityEvidence.text.trim()).not.toBe('');
    const original=prior.find(r=>r.id===d.id)!;
    expect(d.name).toBe(original.name);
    for(const lang of ['en','es','zh'] as const){
      const explanation=getChargeExplanation('','FL',lang,d.id)!;
      expect(explanation.degreeContext).toBe(d.text[lang].degreeContext);
      expect(explanation.plainSummary).toBe(d.text[lang].plainSummary);
      expect(d.text[lang].plainSummary).toContain(original.text[lang].plainSummary);
    }
  }
  const changed=structuredClone(packet);changed.incorporatedConduct[0].spans[0].start++;
  expect(()=>validateFloridaCloseoutIncorporatedConduct(changed)).toThrow(/span/);
});

it('distinguishes ordinary misdemeanor tiers from conditional felony grades and predicate-dependent charges',()=>{
  const changed=packet.definitions.filter(d=>d.category!==prior.find(r=>r.id===d.id)?.category);
  expect(changed.map(d=>d.code).sort()).toEqual(['562.12(1)','806.13(1)','810.09(1)-(2)','827.06(2)-(3)','832.05(2)-(4)','837.05'].sort());
  for(const d of changed) expect(getChargeById(d.id)?.categories).toEqual(['misdemeanor','felony']);
  expect(row('777.04(1)').text.en.degreeContext).toContain('abandonment of the attempt');
  expect(row('777.04(2)').text.en.degreeContext).toContain('persuading the solicited person');
  expect(row('777.04(3)').text.en.degreeContext).toContain('persuading the other participants');
  expect(row('790.23(1)').text.en.degreeContext).toContain('ammunition-only');
  expect(row('790.221').text.en.degreeContext).not.toContain('three-year minimum');
});

it('retains special penalties, speech-only limits, and future implementation dates',()=>{
  expect(row('877.03').text.en.plainSummary).toContain('State v. Saunders');
  expect(row('828.12(1)').text.en.degreeContext).not.toContain('minimum $2,500');
  expect(row('828.12(2)').text.en.degreeContext).toContain('minimum $2,500');
  expect(row('828.12(2)').text.en.degreeContext).toContain('January 1, 2027');
  expect(row('403.413(6)(b)').text.en.degreeContext).toContain('three driver-license points');
  expect(row('796.07').text.en.degreeContext).toContain('$5,000 civil penalty');
  expect(row('562.12(1)').text.en.degreeContext).toContain('$15,000-to-$20,000');
  expect(row('837.05').text.en.degreeContext).toContain('restitution');
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);
  expect(records).toHaveLength(101);
  expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,records,new Date(receipt.checkedAt))).not.toBeNull();
});
