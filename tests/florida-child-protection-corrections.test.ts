import {execFileSync} from 'node:child_process';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-child-protection-corrections.json';
import prior from '../scripts/data-review/florida-child-protection/previous-definitions.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {getChargeExplanation} from '../shared/charge-explanations';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {validateFloridaChildProtectionIncorporatedConduct} from '../scripts/data-review/florida-child-protection/validate';

it('reproduces eight individually graded records and rejects altered supporting spans',()=>{
  execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-child-protection/prepare.ts','--check']);
  expect(packet.definitions).toHaveLength(8);
  expect(packet.effectiveDateEvidence.map(e=>e.chapter)).toEqual(['2026-86','2026-18','2026-20']);
  expect(packet.documents['794.0116'].text).toMatch(/827\.071\(2\)\s+30 years/);
  expect(packet.documents['794.0116'].text).toMatch(/827\.071\(3\)\s+20 years/);
  expect(packet.documents['794.0116'].text).toMatch(/800\.04\(5\)\s+15 years/);
  const altered = structuredClone(packet);
  altered.incorporatedConduct[0].spans[0].end--;
  expect(()=>validateFloridaChildProtectionIncorporatedConduct(altered)).toThrow(/span/);
});

it('assigns each minimum and exception only to its own statutory branch',()=>{
  for (const d of packet.definitions) {
    const t=d.text.en.degreeContext;
    const performance=d.code.startsWith('827.071');
    const repeat=d.code==='800.04(5)'?15:d.code==='827.071(3)'?20:performance?30:undefined;
    expect(t.includes('§794.0116 requires')).toBe(!!repeat);
    if (repeat) expect(t).toContain(`§794.0116 requires at least ${repeat} years`);
    expect(t.includes('separate minimum of 50 years')).toBe(performance||['800.04(4)','800.04(5)'].includes(d.code));
    expect(t.includes('only on written findings')).toBe(['827.071(2)(a)','827.071(3)'].includes(d.code));
    expect(t.includes('ten images of child sexual abuse material')).toBe(d.code==='827.071(3)');
    expect(t.includes('A second or later violation of (5)(b)')).toBe(d.code==='800.04(5)');
    expect(t.includes('close-in-age')).toBe(!['827.04(3)','827.071(2)(b)'].includes(d.code));
  }
});

it('preserves identities, grade categories, translated summaries and scoped explanations',()=>{
  for (const d of packet.definitions) {
    const prev=prior.find(original=>original.id===d.id)!;
    expect(d.name).toBe(prev.name);
    expect(d.category).toBe(prev.category);
    for(const lang of ['en','es','zh'] as const){
      const e=getChargeExplanation('','FL',lang,d.id)!;
      expect(e.plainSummary).toBe(prev.text[lang].plainSummary);
      expect(e.degreeContext).toBe(d.text[lang].degreeContext);
    }
  }
});

it('keeps the separate §827.04(1) hold and expired aggregate receipt',()=>{
  expect(FLORIDA_REVIEWED_DEFINITIONS.some(d=>d.code==='827.04(1)')).toBe(false);
  const records=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);
  expect(records).toHaveLength(101);
  expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,records,new Date(receipt.checkedAt))).not.toBeNull();
});
