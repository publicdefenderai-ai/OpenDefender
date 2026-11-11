import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {expect,it} from 'vitest';
import packet from '../scripts/data-review/output/florida-trafficking-corrections.json';
import plan from '../scripts/data-review/florida-trafficking/correction-plan.json';
import before from '../scripts/data-review/florida-trafficking/previous-definitions.json';
import screen from '../scripts/data-review/output/florida-domestic-applicability-screen.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import ledger from '../shared/florida-reviewed-eligibility.json';
import {FLORIDA_REVIEWED_DEFINITIONS} from '../shared/florida-reviewed-batch';
import {getChargeExplanation} from '../shared/charge-explanations';
import {buildFloridaReviewedSourceRecords,validateFloridaReviewedRefreshReceipt} from '../server/data/florida-reviewed-source-records';
import {bindWeightTiers} from '../scripts/data-review/florida-trafficking/tiers';
import {validateFloridaTraffickingIncorporatedConduct} from '../scripts/data-review/florida-trafficking/validate';
const source=packet.documents['893.135'].text;
const lookup=(scope:string)=>packet.definitions.find(d=>d.code===`893.135${scope}`)!;
it('accounts for the 30 chapter 893 cohort IDs and reproduces 17 individualized records and 54 tiers',()=>{
 execFileSync(process.execPath,['--import','tsx','scripts/data-review/florida-trafficking/prepare.ts','--check']);
 const chapter=screen.rows.filter(r=>r.code.startsWith('893.'));expect(chapter).toHaveLength(30);
 expect(chapter.filter(r=>r.code.startsWith('893.135')).map(r=>r.id).sort()).toEqual(packet.definitions.map(d=>d.id).sort());
 expect(chapter.filter(r=>r.code.startsWith('893.147'))).toHaveLength(8);expect(chapter.filter(r=>r.code.startsWith('893.13('))).toHaveLength(5);
 expect(Object.values(packet.tiers).flat()).toHaveLength(54);expect(Object.keys(packet.documents)).toHaveLength(11);
 for(const d of Object.values(packet.documents))expect(createHash('sha256').update(d.text).digest('hex')).toBe(d.contentHash);
 for(const r of plan.records){const tiers=packet.tiers[r.id as keyof typeof packet.tiers];expect(tiers).toEqual(bindWeightTiers(source,r.tierScope,r.tierCount));
  for(const t of tiers)expect(source.slice(t.start,t.end)).toBe(t.text);
  for(let i=1;i<tiers.length;i++){const lower=tiers[i].lower*(tiers[i].lowerUnit==='kg'?1000:1);const prev=tiers[i-1];expect(prev.upper!*(prev.upperUnit==='kg'?1000:1)).toBe(lower);}
 }
});
it('rejects changed tier grammar, missing tiers and corrupted source bindings',()=>{
 const cocaine=lookup('(1)(b)1.');const t=packet.tiers[cocaine.id as keyof typeof packet.tiers][0];
 expect(()=>bindWeightTiers(source.slice(0,t.start)+source.slice(t.end),'(1)(b)1.',3)).toThrow('count changed');
 expect(()=>bindWeightTiers(source.slice(0,t.start)+t.text.replace('3 years','an undetermined term')+source.slice(t.end),'(1)(b)1.',3)).toThrow('Unexpected');
 const p=structuredClone(packet);p.incorporatedConduct[0].spans[0].start++;expect(()=>validateFloridaTraffickingIncorporatedConduct(p)).toThrow();
});
it('uses only the charged drug’s weight, minimum and fine for every language, including sibling grading provisions',()=>{
 for(const old of before){const d=packet.definitions.find(v=>v.id===old.id)!;expect(d.name).toBe(old.name);expect(d.code).toBe(old.code);
  for(const lang of ['en','es','zh'] as const){const e=getChargeExplanation('','FL',lang,d.id)!;expect(e.plainSummary).toBe(d.text[lang].plainSummary);expect(e.degreeContext).toBe(d.text[lang].degreeContext);
   for(const tier of packet.tiers[d.id as keyof typeof packet.tiers])expect(e.degreeContext).toContain(tier.dollars.toLocaleString('en-US'));
   if(lang!=='en'){expect(e.translationDraft).toBe(true);expect(e.untranslated).not.toBe(true);}
  }
 }
 expect(lookup('(1)(f)1.').text.en.plainSummary).toContain('in conjunction with other chemicals and equipment');
 expect(lookup('(1)(k)1.').text.en.plainSummary).toContain('esters or ethers');
 expect(lookup('(1)(c)2.').text.en.plainSummary).not.toContain('less than 30');
 expect(lookup('(1)(c)7.').text.en.degreeContext).toContain('October 1, 2026');expect(lookup('(1)(c)7.').text.en.degreeContext).toContain('animal drug product');
 expect(lookup('(1)(c)4.a.').text.en.degreeContext).toContain('packaging conditions');expect(lookup('(1)(c)2.').text.en.degreeContext).toContain('30 kilograms or more');
 expect(lookup('(1)(m)1.').text.en.degreeContext).toContain('30 kg or more: at least 25 years and a $750,000 fine');
 expect(lookup('(1)(g)1.').text.en.degreeContext).toContain('28 g to under 30 kg');
 expect(lookup('(1)(j)1.').text.en.degreeContext).toContain('15 calendar years and a $500,000 fine');
 expect(lookup('(1)(b)1.').text.en.degreeContext).toContain('already had a qualifying domestic-violence conviction');
});
it('continues to withhold the changed family without a current matching receipt',()=>{
 const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,ledger as any);expect(all).toHaveLength(101);
 expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,ledger as any,all,new Date(receipt.checkedAt))).not.toBeNull();
});
