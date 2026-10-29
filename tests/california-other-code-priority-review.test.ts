import { describe, it, expect } from 'vitest';
import additions from '../shared/california-other-code-priority-additions.json';
import { readOtherCodePriorityReview, validateOtherCodePriorityReview, renderOtherCodePriorityReview } from '../scripts/data-review/california-verification/other-code-priority-review';
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { californiaLawCode, californiaPrimaryIdentity, californiaCitationSearchAliases } from '../shared/california-law-codes';
import { getChargeById, classifyChargesForGuidance, chargeCategories } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
const row = (id: string) => additions.find(a => a.id === id)!;
describe('California other-code priority publication', () => {
    it('accounts for 19 choices across all seven probes without claiming complete code coverage', () => {
        expect(validateOtherCodePriorityReview()).toEqual({ additions: 19, primarySections: 7, reusedSections: 9, newSections: 46, newVersions: 46 });
        const r = readOtherCodePriorityReview();
        expect(r.probeUpdates).toHaveLength(7);
        expect(r.probeUpdates.every(p => p.chargeIds.length > 0)).toBe(true);
        expect(r.remainingScopes.find(s => s.key === 'WIC:10980')).toMatchObject({ subdivisions: ['d', 'e', 'f', 'g', 'h', 'i'], severity: 'not_assumed_minor' });
        expect(renderOtherCodePriorityReview()).not.toMatch(/[—–]/);
    });
    it('retains cross-code identity from definitions through citations, URLs and charging-paper aliases', () => {
        for (const a of additions) {
            const c = getCaliforniaCanonicalRecord(a.id)!;
            expect(c.citation).toBe(californiaPrimaryIdentity(californiaLawCode(a.lawCode), a.code).citation);
            expect(new URL(c.sources.find(s => s.kind === 'statute')!.url).searchParams.get('lawCode')).toBe(a.lawCode);
            expect(getChargeById(a.id)?.searchAliases).toEqual(expect.arrayContaining(californiaCitationSearchAliases(c.lawCode, a.code)));
        }
        expect(californiaPrimaryIdentity('INS', '1871.4(a)(1)').citation).toBe('Cal. Insurance Code § 1871.4(a)(1)');
        expect(californiaPrimaryIdentity('UIC', '2101(a)').citation).toBe('Cal. Unemployment Insurance Code § 2101(a)');
        expect(() => californiaLawCode('UNKNOWN')).toThrow('Unsupported');
    });
    it('preserves licensing exceptions and does not turn section 2052 into a generic section 146 infraction', () => {
        const a = row('ca-bpc-2052-a');
        expect(a.categories).toEqual(['felony', 'misdemeanor']);
        expect(a.supportingKeys).toEqual(expect.arrayContaining(['BPC:146', 'BPC:2053.5', 'BPC:2053.6', 'BPC:2058', 'BPC:2065']));
        expect(a.summary).toContain('complementary services');
        expect(a.penalty).toContain('notwithstanding section 146');
        const b = row('ca-bpc-7028-a-1');
        expect(b.summary).toContain('below $1,000');
        expect(b.summary).toContain('no required building permit');
        expect(b.summary).toContain('no employees');
        expect(b.penalty).toContain('90 to 364 days');
        expect(b.penalty).toContain('unstated upper custody limit');
        expect(row('ca-bpc-7028-a-2').summary).toContain('specified suspension branch');
    });
    it('keeps premium-based fines and self-insurance distinct from a flat fine or missing policy', () => {
        const a = row('ca-lab-3700-5-a');
        expect(a.summary).toContain('consent to self-insure');
        for (const term of ['twice', 'triple', '$10,000', '$50,000', 'not supply a flat'])
            expect(a.penalty).toContain(term);
        expect(a.categories).toEqual(['misdemeanor']);
    });
    it('does not flatten safety sentencing, corporate ranges or fine-only alternatives', () => {
        const a = row('ca-lab-6425-a'), b = row('ca-lab-6425-b'), c = row('ca-lab-6425-c');
        expect(a.penalty).toContain('$100,000');
        expect(a.penalty).toContain('$1.5 million');
        expect(b.penalty).toContain('state prison');
        expect(b.penalty).toContain('$500,000 to $2.5 million');
        expect(c.penalty).toContain('2, 3 or 4 years');
        expect(c.penalty).toContain('1170(h)');
        expect(c.penalty).toContain('$1 million to $3.5 million');
        for (const r of [b, c]) {
            expect(r.categories).toContain('misdemeanor');
            expect(r.penalty).toContain('fine-only alternative');
            expect(r.summary).toContain('seven years');
        }
    });
    it('keeps the six insurance conduct alternatives, materiality differences and enhancements distinct', () => {
        const ins = additions.filter(a => a.lawCode === 'INS');
        expect(ins).toHaveLength(6);
        expect(row('ca-ins-1871-4-a-4').summary).toContain('discourage an injured worker');
        expect(row('ca-ins-1871-4-a-6').summary).toContain('statutory employer wording');
        for (const a of ins) {
            expect(a.penalty).toContain('2, 3 or 5 years');
            expect(a.penalty).toContain('twice the value');
            expect(a.penalty).toContain('alleged and admitted or proved');
        }
    });
    it('preserves the $950 boundary, alternative fine amounts and the prosecution restriction', () => {
        const low = row('ca-wic-10980-c-1'), high = row('ca-wic-10980-c-2');
        expect(low.categories).toEqual(['misdemeanor']);
        expect(low.penalty).toContain('$500');
        expect(high.categories).toEqual(['felony', 'misdemeanor']);
        expect(high.penalty).toContain('$5,000');
        expect(high.penalty).toContain('$1,000');
        expect(low.summary).toContain('exactly $950 belongs to the lower branch');
        for (const a of additions.filter(a => a.lawCode === 'WIC')) {
            expect(a.summary).toContain('10980(j)');
            expect(a.summary).toContain('45-day');
            expect(a.summary).toContain('overpayment alone is not proof');
        }
        expect(row('ca-wic-10980-b').summary).toContain('not assigned subdivision (c)');
    });
    it('uses the chapter penalty for unemployment fraud rather than the neighboring misdemeanor offense', () => {
        const a = row('ca-uic-2101-a');
        expect(a.supportingKeys).toEqual(expect.arrayContaining(['UIC:2122', 'UIC:2117', 'PEN:18']));
        expect(a.categories).toEqual(['felony', 'misdemeanor']);
        expect(a.penalty).toContain('$20,000');
        expect(a.penalty).toContain('state prison');
        expect(a.penalty).toContain('2117');
        expect(readOtherCodePriorityReview().sharedPenaltyAndExceptionSpans.find(s => s.key === 'UIC:2122')!.text).toContain('twenty thousand');
    });
    it('binds all spans and rejects source, definition and subdivision drift', () => {
        const r = readOtherCodePriorityReview();
        for (const s of [...r.records.map(r => r.primarySpan), ...r.sharedPenaltyAndExceptionSpans])
            expect(r.sources.find(x => x.key === s.key)!.text.slice(s.start, s.end)).toBe(s.text);
        const a = readOtherCodePriorityReview();
        a.sources[0].text += ' changed';
        expect(() => validateOtherCodePriorityReview(a)).toThrow('drift');
        const b = readOtherCodePriorityReview();
        b.records[0].primarySpan.end--;
        expect(() => validateOtherCodePriorityReview(b)).toThrow('drift');
        const c = readOtherCodePriorityReview();
        c.records[0].definitionSha256 = 'wrong';
        expect(() => validateOtherCodePriorityReview(c)).toThrow('drift');
    });
    it('carries alternatives to guidance, warns about untranslated content and respects expiry', () => {
        for (const a of additions) {
            expect(classifyChargesForGuidance([a.id])[0].categories).toEqual(a.categories);
            expect(chargeCategories[['BPC', 'LAB'].includes(a.lawCode) ? 'Public Order' : 'Fraud']).toContain(a.id);
            for (const lang of ['es', 'zh']) {
                const e = getChargeExplanation(a.title, 'CA', lang, a.id)!;
                expect(e.untranslated).toBe(true);
                expect(e.plainSummary).toBe(a.summary);
            }
            expect(getCaliforniaRecordEvidenceStatus(getCaliforniaCanonicalRecord(a.id)!, new Date(receipt.expiresAt))).not.toBe('current');
        }
    });
});
