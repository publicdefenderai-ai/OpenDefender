import { describe, it, expect } from 'vitest';
import { readResidualPriorityReview, validateResidualPriorityReview, renderResidualPriorityReview } from '../scripts/data-review/california-verification/residual-priority-review';
import { otherCodePriorityDocuments } from '../scripts/data-review/california-verification/other-code-priority-review';
describe('California residual priority accounting', () => {
    it('keeps unfinished conduct work separate from additional punishment without publishing', () => {
        const p = readResidualPriorityReview();
        expect(validateResidualPriorityReview(p)).toEqual({ conductFollowUpUnits: 7, additionalPunishmentOrLimitationGroups: 4, newChoices: 0, newPins: 0, receiptRenewals: 0 });
        expect(p.conductWork.map(r => r.id)).toEqual(['PEN:25850', 'PEN:30600(a)', 'WIC:10980(d)', 'WIC:10980(e)', 'WIC:10980(f)', 'WIC:10980(g)(1)', 'WIC:10980(g)(2)']);
        expect(p.additionalPunishment.map(r => r.id)).toEqual(['PEN:30615', 'PEN:30600(b)-(c)', 'WIC:10980(h)', 'WIC:10980(i)']);
        expect(p.completedBoundedComparison.instructionId).toBe('1153');
        expect(p.priorComparisons.map(r => r.instructionId)).toEqual(['1153', '2530', '2560', '2561']);
    });
    it('retains the separate-count context instead of claiming 30615 can never appear on charging papers', () => {
        const p = readResidualPriorityReview();
        expect(p.instruction.heading).toContain('Separate Count and as');
        expect(p.additionalPunishment[0].evidence.text).toContain('additional, consecutive punishment of one year');
        expect(p.additionalPunishment[0].treatment).toContain('does not decide pleading treatment');
        expect(p.instruction.pages[0].text).toContain('additional allegation');
    });
    it('retains threshold, public-employee, aggregation and prosecution-bar distinctions', () => {
        const p = readResidualPriorityReview();
        expect(p.conductWork.find(r => r.id === 'WIC:10980(f)')!.evidence.text).toContain('duties as a public employee');
        expect(p.conductWork.find(r => r.id === 'WIC:10980(g)(1)')!.evidence.text).toContain('($950) or less');
        expect(p.additionalPunishment.find(r => r.id === 'WIC:10980(h)')!.evidence.text).toContain('common scheme or plan');
        expect(p.additionalPunishment.find(r => r.id === 'WIC:10980(i)')!.evidence.text).toContain('shall not receive');
        expect(p.sharedProtection.evidence.text).toContain('authorized delay');
        expect(p.carriedLimitation.id).toBe('BPC:7028(c)');
        expect(p.carriedLimitation.evidence.text).toContain('not less than 90 days');
    });
    it('binds every span to the selected source and prefers reviewed evidence over research', () => {
        const p = readResidualPriorityReview();
        for (const r of [...p.conductWork, ...p.additionalPunishment, p.sharedProtection, p.carriedLimitation]) {
            const source = p.sources.find(s => s.key === r.evidence.key)!;
            expect(source.text.slice(r.evidence.start, r.evidence.end)).toBe(r.evidence.text);
        }
        const published = otherCodePriorityDocuments();
        for (const source of p.sources)
            if (published[source.key]) {
                expect(source.retention).toBe('reviewed_source_pool');
                expect(source.contentSha256).toBe(published[source.key][0].contentSha256);
            }
        expect(renderResidualPriorityReview()).not.toMatch(/[—–]/);
    });
    it('rejects missing work, altered evidence, lost protections or changed predecessor bindings', () => {
        const mutations = [
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.conductWork.pop(); },
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.additionalPunishment.pop(); },
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.sharedProtection.evidence.text = ''; },
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.sources[0].contentSha256 = 'bad'; },
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.instruction.pages[0].text += 'bad'; },
            (p: ReturnType<typeof readResidualPriorityReview>) => { p.priorComparisons[0].sha256 = 'bad'; },
        ];
        for (const mutate of mutations) {
            const p = readResidualPriorityReview();
            mutate(p);
            expect(() => validateResidualPriorityReview(p)).toThrow();
        }
    });
});
