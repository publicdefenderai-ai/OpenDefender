import { describe, it, expect } from 'vitest';
import additions from '../shared/california-benefit-program-additions.json';
import { readBenefitProgramReview, validateBenefitProgramReview, renderBenefitProgramReview } from '../scripts/data-review/california-verification/benefit-program-review';
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { getChargeById, chargeCategories, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
const row = (suffix: string) => additions.find(a => a.id === 'ca-wic-10980-' + suffix)!;
describe('California benefit-program branches', () => {
    it('binds five branches and three new dependencies while leaving weapons work open', () => {
        expect(validateBenefitProgramReview()).toEqual({ additions: 5, primarySections: 1, reusedSections: 12, newSections: 3, newVersions: 3 });
        const p = readBenefitProgramReview();
        expect(p.probeUpdates).toHaveLength(5);
        expect(p.probeUpdates.every(p => p.chargeIds.length === 1)).toBe(true);
        expect(p.remainingScopes.map(p => p.key)).toEqual(['PEN:25850', 'PEN:30600(a)']);
        expect(renderBenefitProgramReview()).not.toMatch(/[—–]/);
    });
    it('preserves the fine-only alternative without inventing misdemeanor jail under (d)', () => {
        expect(row('d').categories).toEqual(['felony', 'misdemeanor']);
        for (const t of ['16 months, 2 years or 3 years', '$5,000 alone', 'section 17(b)', 'no separate misdemeanor jail term'])
            expect(row('d').penalty).toContain(t);
        expect(row('d').mentalState).toContain('intent to defraud');
    });
    it('does not apply the $950 forgery reduction to every benefits instrument', () => {
        expect(row('e').supportingKeys).toEqual(expect.arrayContaining(['PEN:473', 'PEN:290', 'PEN:667', 'PEN:530.5', 'PEN:672']));
        for (const t of ['listed instruments', 'prior-conviction', 'identity-theft', 'Do not assume every benefit authorization'])
            expect(row('e').penalty).toContain(t);
    });
    it('keeps entrusted public funds separate from value-based recipient fraud', () => {
        expect(row('f').categories).toEqual(['felony']);
        expect(row('f').summary).toContain('duties as a public employee');
        for (const t of ['state-prison', 'section 18', 'ineligibility thereafter', 'Do not substitute'])
            expect(row('f').penalty).toContain(t);
    });
    it('preserves the valuation boundary, additional terms and prosecution restriction', () => {
        expect(row('g-1').categories).toEqual(['misdemeanor']);
        expect(row('g-1').summary).toContain('including exactly $950');
        expect(row('g-1').penalty).toContain('six months');
        expect(row('g-1').penalty).toContain('$500');
        expect(row('g-2').categories).toEqual(['felony', 'misdemeanor']);
        expect(row('g-2').penalty).toContain('up to 364 days');
        for (const suffix of ['f', 'g-1', 'g-2'])
            for (const t of ['violations or attempts', '$50,000', '$150,000', '$1 million', '$2.5 million', 'Exactly a threshold', 'Common-scheme aggregation', '(i) bars'])
                expect(row(suffix).penalty).toContain(t);
        for (const a of additions) {
            expect(a.summary).toContain('10980(j)');
            expect(a.summary).toContain('authorized-delay exceptions');
        }
        expect(additions.some(a => /10980\([hi]\)/.test(a.code))).toBe(false);
    });
    it('reaches catalog, guidance payload, aliases and honest language fallback', () => {
        for (const a of additions) {
            const c = getChargeById(a.id)!;
            expect(c.maxPenalty).toBe(a.penalty);
            expect(c.categories).toEqual(a.categories);
            expect(chargeCategories.Fraud).toContain(a.id);
            expect(c.searchAliases).toContain('Welf. & Inst. Code ' + a.code);
            expect(classifyChargesForGuidance([a.id], 'CA')[0].categories).toEqual(a.categories);
            for (const lang of ['en', 'es', 'zh']) {
                const e = getChargeExplanation(a.title, 'CA', lang, a.id)!;
                expect(e.plainSummary).toBe(a.summary);
                expect(e.untranslated).toBe(lang !== 'en');
                expect(e.untranslatedSupplement).toBeUndefined();
            }
        }
    });
    it('keeps expiry withholding even after dependencies are pinned', () => {
        for (const a of additions) {
            const c = getCaliforniaCanonicalRecord(a.id)!;
            expect(getCaliforniaRecordEvidenceStatus(c, new Date(receipt.checkedAt))).toBe('current');
            expect(getCaliforniaRecordEvidenceStatus(c, new Date(receipt.expiresAt))).not.toBe('current');
        }
    });
    it('rejects edited spans, missing protections and lost source bindings', () => {
        const mutations = [(p: ReturnType<typeof readBenefitProgramReview>) => { p.records[0].primarySpan.text = 'bad'; }, (p: ReturnType<typeof readBenefitProgramReview>) => { p.sharedPenaltyAndExceptionSpans.pop(); }, (p: ReturnType<typeof readBenefitProgramReview>) => { p.acquisitionSha256 = 'bad'; }, (p: ReturnType<typeof readBenefitProgramReview>) => { p.probeUpdates.pop(); }];
        for (const mutate of mutations) {
            const p = readBenefitProgramReview();
            mutate(p);
            expect(() => validateBenefitProgramReview(p)).toThrow();
        }
    });
});
