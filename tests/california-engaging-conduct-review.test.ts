import { describe, it, expect } from 'vitest';
import originals from '../shared/california-batch-six-corrections.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import { readEngagingConductReview, validateEngagingConductReview, renderEngagingConductReview } from '../scripts/data-review/california-verification/engaging-conduct-review';
import { getCaliforniaCanonicalRecord, getCaliforniaBatchCorrection, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
const id = 'ca-prostitution-solicitation';
const original = originals.find(r => r.id === id)!;
describe('California engaging conduct supplement', () => {
    it('improves an existing choice without changing reviewed punishment or categories', () => {
        expect(validateEngagingConductReview()).toEqual({ updatedChoices: 1, newChoices: 0, newSections: 0, newVersions: 0 });
        const record = getCaliforniaCanonicalRecord(id)!;
        expect(record.penalty).toBe(original.penalty.en);
        expect(record.categories).toEqual(original.categories);
        expect(record.officialTitle).toBe('Prostitution: Soliciting, Agreeing, or Engaging');
        expect(getChargeById(id)?.searchAliases).toContain('Soliciting or Agreeing to Engage in Prostitution');
    });
    it('separates engaging from agreement and preserves the child-recipient exclusion', () => {
        const summary = getCaliforniaBatchCorrection(id)!.summary.en;
        for (const wording of ['alternative theories', 'in exchange for money', 'sexual arousal or gratification', 'additional act in California', 'does not apply to a child under 18', 'not be treated as a requirement that the sexual act was completed'])
            expect(summary).toContain(wording);
        const packet = readEngagingConductReview();
        expect(packet.source.text).toContain('this subdivision does not apply to a child under 18');
        expect(packet.source.text).toContain('some act, in addition to the manifestation of acceptance');
        expect(packet.instruction.pages[0].text).toContain('willfully engaged in sexual intercourse');
        expect(packet.instruction.id).toBe('1153');
        expect(renderEngagingConductReview()).not.toMatch(/[—–]/);
    });
    it('reaches catalog and explanations with an honest non-English fallback', () => {
        expect(getChargeById(id)?.description).toContain('For the engaging theory');
        for (const language of ['en', 'es', 'zh'] as const) {
            const explanation = getChargeExplanation('Prostitution', 'CA', language, id)!;
            if(language==='en')expect(explanation.plainSummary).toContain('For the engaging theory');
            else expect(explanation.plainSummary).toBe(original.summary[language]);
            expect(explanation.untranslatedSupplement?.text).toBe(language==='en'?undefined:readEngagingConductReview().product.supplement.summary);
            expect(explanation.untranslated).toBe(false);
            expect(explanation.translationDraft).toBe(language !== 'en');
            expect(explanation.degreeContext).toBe(original.penalty[language]);
        }
    });
    it('does not bypass receipt expiry', () => {
        const record = getCaliforniaCanonicalRecord(id)!;
        expect(getCaliforniaRecordEvidenceStatus(record, new Date(receipt.checkedAt))).toBe('current');
        expect(getCaliforniaRecordEvidenceStatus(record, new Date(receipt.expiresAt))).not.toBe('current');
    });
    it('rejects altered statutory spans, instruction text, and content bindings', () => {
        const mutations = [
            (p: ReturnType<typeof readEngagingConductReview>) => { p.source.start++; },
            (p: ReturnType<typeof readEngagingConductReview>) => { p.source.text += ' altered'; },
            (p: ReturnType<typeof readEngagingConductReview>) => { p.instruction.pages[0].text += ' altered'; },
            (p: ReturnType<typeof readEngagingConductReview>) => { p.supplementSha256 = 'bad'; },
            (p: ReturnType<typeof readEngagingConductReview>) => { p.originalCorrectionSha256 = 'bad'; },
        ];
        for (const mutate of mutations) {
            const p = readEngagingConductReview();
            mutate(p);
            expect(() => validateEngagingConductReview(p)).toThrow();
        }
    });
});
