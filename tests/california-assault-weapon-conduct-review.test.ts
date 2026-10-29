import { describe, it, expect } from 'vitest';
import additions from '../shared/california-assault-weapon-conduct-additions.json';
import { readAssaultWeaponConductReview, validateAssaultWeaponConductReview, renderAssaultWeaponConductReview } from '../scripts/data-review/california-verification/assault-weapon-conduct-review';
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { getChargeById, chargeCategories, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { californiaTransitionRequiresReview } from '../shared/california-source-transitions';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';

describe('California assault-weapon conduct publication', () => {
    it('publishes two weapon-specific choices with thirty new dependencies and no new loaded-carry claim', () => {
        expect(validateAssaultWeaponConductReview()).toEqual({ additions: 2, primarySections: 1, reusedSections: 11, newSections: 30, newVersions: 30 });
        expect(additions.map(a => a.id)).toEqual(['ca-pen-30600-a-assault-weapon','ca-pen-30600-a-50-bmg']);
        const p = readAssaultWeaponConductReview();
        expect(p.remainingScopes.map(r => r.key)).toEqual(['PEN:25850']);
        expect(p.instruction.id).toBe('2560');
        expect(p.sources.find(s => s.key === 'PEN:30515')!.retainedVersions).toHaveLength(2);
        expect(p.sources.find(s => s.key === 'PEN:30515')!.effectiveDate).toContain('2026-09-20');
        expect(renderAssaultWeaponConductReview()).not.toMatch(/[—–]/);
    });
    it('keeps the nondefault triad, enhancement, offense-unit rule and conduct exceptions distinct', () => {
        const p = readAssaultWeaponConductReview();
        expect(p.records[0].primarySpan.text).toContain('four, six, or eight years');
        expect(p.sharedSpans[0].text).toContain('to a minor');
        expect(p.sharedSpans[0].text).toContain('as provided in Sections 30605 and 30610');
        expect(p.sharedSpans.find(s => s.key === 'PEN:30660')!.text).toContain('remains in the presence');
        expect(p.sharedSpans.find(s => s.key === 'PEN:30675')!.text).toContain('31050, or 31055');
        for (const a of additions) {
            expect(a.categories).toEqual(['felony']);
            expect(a.penalty).toContain('4, 6 or 8 years');
            expect(a.penalty).toContain('one consecutive year');
            expect(a.penalty).toContain('not a general exception for section 30600(a)');
            expect(a.summary).toContain('Registration alone is not blanket permission');
            expect(a.summary).toContain('knew or reasonably should have known');
            expect(a.summary).toContain('Mere possession is addressed by separate provisions');
            expect(a.supportingKeys).toEqual(expect.arrayContaining(['PEN:30615','PEN:30660','PEN:30675','PEN:31050','PEN:31055']));
        }
    });
    it('binds source spans and rejects changed summaries, successor selection and punishment evidence', () => {
        const p = readAssaultWeaponConductReview();
        for (const span of [...p.sharedSpans,...p.records.map(r => r.primarySpan)]) expect(p.sources.find(s => s.key === span.key)!.text.slice(span.start,span.end)).toBe(span.text);
        const mutations = [
            (x: typeof p) => { x.records[0].definitionSha256='bad'; },
            (x: typeof p) => { x.sources.find(s => s.key === 'PEN:30515')!.versionId='future'; },
            (x: typeof p) => { x.sharedSpans[0].text=''; },
            (x: typeof p) => { x.instruction.pages[0].text=''; },
        ];
        for (const mutate of mutations) { const x=structuredClone(p);mutate(x);expect(() => validateAssaultWeaponConductReview(x)).toThrow(); }
    });
    it('carries both distinct choices through search, categories, guidance and language fallback', () => {
        for (const a of additions) {
            expect(getChargeById(a.id)!.maxPenalty).toBe(a.penalty);
            expect(getChargeById(a.id)!.searchAliases).toContain('Pen. Code 30600(a)');
            for (const group of ['Weapons','Weapons Crimes']) expect(chargeCategories[group]).toContain(a.id);
            expect(classifyChargesForGuidance([a.id],'CA')[0].categories).toEqual(['felony']);
            for (const lang of ['en','es','zh']) {
                const e=getChargeExplanation(a.title,'CA',lang,a.id)!;
                expect(e.plainSummary).toBe(a.summary);
                expect(e.untranslated).toBe(lang !== 'en');
            }
        }
    });
    it('does not bypass receipt expiry or the existing definition transition', () => {
        for (const a of additions) {
            const c=getCaliforniaCanonicalRecord(a.id)!;
            expect(getCaliforniaRecordEvidenceStatus(c,new Date(Date.parse(receipt.checkedAt)+3600000))).toBe('current');
            expect(getCaliforniaRecordEvidenceStatus(c,new Date(receipt.expiresAt))).not.toBe('current');
            expect(californiaTransitionRequiresReview(a.supportingKeys,new Date('2028-12-31T23:00:00Z'))).toBe(false);
            expect(californiaTransitionRequiresReview(a.supportingKeys,new Date('2029-01-01T12:00:00Z'))).toBe(true);
        }
    });
});
