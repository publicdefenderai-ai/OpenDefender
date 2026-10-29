import { describe, it, expect } from 'vitest';
import additions from '../shared/california-loaded-firearm-additions.json';
import { readLoadedFirearmReview, validateLoadedFirearmReview, renderLoadedFirearmReview } from '../scripts/data-review/california-verification/loaded-firearm-review';
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { getChargeById, chargeCategories, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
const row=(n:number)=>additions[n-1];
describe('California loaded-firearm grading branches',()=>{
    it('binds all seven grading paragraphs to conduct, with no claim of statewide completeness',()=>{
        expect(validateLoadedFirearmReview()).toEqual({additions:7,primarySections:1,reusedSections:22,newSections:22,newVersions:22});
        const p=readLoadedFirearmReview();
        expect(p.records.map(r=>r.id)).toEqual(Array.from({length:7},(_,i)=>`ca-pen-25850-c-${i+1}`));
        expect(p.instructions.map(i=>i.id)).toEqual(['2530','2540','2541','2542','2543','2544','2545']);
        expect(p.remainingPriorityConductGroups).toEqual([]);
        expect(p.limits.join(' ')).toContain('not statewide completeness');
        expect(renderLoadedFirearmReview()).not.toMatch(/[—–]/);
        for(const r of p.records) {
            const text=p.sources.find(s=>s.key==='PEN:25850')!.text;
            for(const span of [r.conductSpan,r.gradingSpan]) expect(text.slice(span.start,span.end)).toBe(span.text);
        }
    });
    it('does not flatten felony imprisonment, wobblers or the residual misdemeanor',()=>{
        const p=readLoadedFirearmReview();
        for(let n=1;n<=4;n++) {
            expect(row(n).categories).toEqual(['felony']);
            expect(row(n).penalty).toContain('state prison under Penal Code section 18(a)');
            expect(p.records[n-1].gradingSpan.text).toContain('as a felony');
            expect(p.records[n-1].gradingSpan.text).not.toContain('1170');
        }
        for(let n=5;n<=6;n++) {
            expect(row(n).categories).toEqual(['felony','misdemeanor']);
            expect(row(n).penalty).toContain('up to 364 days');
            expect(row(n).penalty).toContain('do not replace that specific fine');
            expect(p.records[n-1].gradingSpan.text).toContain('subdivision (h) of Section 1170');
        }
        expect(row(7).categories).toEqual(['misdemeanor']);
        expect(row(7).summary).toContain('absence of one factor does not establish the absence of all six');
        expect(p.records[6].gradingSpan.text).toContain('other than those specified in paragraphs (1) to (6)');
    });
    it('retains knowledge, lawful possession, handgun scope and conditional exceptions',()=>{
        expect(row(2).summary).toContain('stolen status alone does not establish');
        expect(row(3).summary).toContain('Passive association or a gang label alone is insufficient');
        expect(row(4).summary).toContain('permission from a lawful owner');
        expect(row(6).summary).toContain('expressly concerns a handgun');
        expect(readLoadedFirearmReview().records[5].gradingSpan.text).toContain('recorded owner of the handgun');
        for(const a of additions) {
            expect(a.summary).toContain('knowledge that it was loaded is not required');
            expect(a.summary).toContain('merely having ammunition nearby is not enough');
            expect(a.summary).toContain('conditional exceptions');
            expect(a.penalty).toContain('unusual-case exception');
            expect(a.supportingKeys).toEqual(expect.arrayContaining(['PEN:26010','PEN:26055','PEN:16840','PEN:23515','PEN:16580']));
        }
    });
    it('rejects changed grading evidence, source bindings and omitted branches',()=>{
        const p=readLoadedFirearmReview();
        for(const mutate of [(x:typeof p)=>{x.records.pop();},(x:typeof p)=>{x.records[5].gradingSpan.text='any firearm';},(x:typeof p)=>{x.sources[0].contentSha256='bad';},(x:typeof p)=>{x.instructions[0].pages[0].text='bad';}]) {
            const altered=structuredClone(p);mutate(altered);expect(()=>validateLoadedFirearmReview(altered)).toThrow();
        }
    });
    it('carries exact identities through aliases, guidance, categories and explicit language fallback',()=>{
        for(const a of additions) {
            const c=getChargeById(a.id)!;
            expect(c.searchAliases).toContain('Pen. Code 25850(a)');
            expect(c.searchAliases).toContain('Pen. Code '+a.code);
            expect(c.categories).toEqual(a.categories);
            expect(c.maxPenalty).toBe(a.penalty);
            for(const group of ['Weapons','Weapons Crimes']) expect(chargeCategories[group]).toContain(a.id);
            expect(classifyChargesForGuidance([a.id],'CA')[0].categories).toEqual(a.categories);
            for(const lang of ['en','es','zh']) {
                const e=getChargeExplanation(a.title,'CA',lang,a.id)!;
                expect(e.plainSummary).toBe(a.summary);expect(e.untranslated).toBe(lang!=='en');
            }
        }
    });
    it('remains subject to runtime evidence expiry',()=>{
        for(const a of additions) {
            const c=getCaliforniaCanonicalRecord(a.id)!;
            expect(getCaliforniaRecordEvidenceStatus(c,new Date(Date.parse(receipt.checkedAt)+3600000))).toBe('current');
            expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
        }
    });
});
