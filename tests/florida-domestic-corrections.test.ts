import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { describe, it, expect } from 'vitest';
import packet from '../scripts/data-review/output/florida-domestic-corrections.json';
import screen from '../scripts/data-review/output/florida-domestic-applicability-screen.json';
import plan from '../scripts/data-review/florida-domestic/correction-plan.json';
import originals from '../scripts/data-review/florida-domestic/previous-definitions.json';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
import { buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { getChargeById, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { syntheticFloridaReceipt } from './helpers/florida-receipt-fixture';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import eligibility from '../shared/florida-reviewed-eligibility.json';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const rows = buildFloridaReviewedSourceRecords(packet.definitions as any, packet.report as any, packet.eligibility as any);
describe('Florida domestic-violence corrections without receipt renewal', () => {
    it('reproduces both evidence and exactly partitioned101screen offline', () => {
        for (const path of ['prepare', 'screen'])
            execFileSync(process.execPath, ['--import', 'tsx', `scripts/data-review/florida-domestic/${path}.ts`, '--check']);
        expect(rows).toHaveLength(5);
        expect(Object.keys(packet.documents)).toHaveLength(18);
        expect(screen.rows).toHaveLength(101);
        expect(new Set(screen.rows.map(r => r.id)).size).toBe(101);
        expect(Object.values(screen.counts).reduce((a, b) => a + b, 0)).toBe(101);
        expect(screen.counts.corrected_current_batch).toBe(5);
        expect(screen.rows.some(r => /not_applicable|cleared/.test(r.classification) && !r.classification.includes('not_cleared'))).toBe(false);
    });
    it('preserves identities and all three translated base summaries while binding each correction', () => {
        for (const before of originals) {
            const after = FLORIDA_REVIEWED_DEFINITIONS.find(d => d.id === before.id)!;
            expect(after.code).toBe(before.code);
            expect(after.name).toBe(before.name);
            expect(after.names).toEqual(before.names);
            for (const lang of ['en', 'es', 'zh'] as const) {
                expect(after.text[lang].plainSummary).toBe(before.text[lang].plainSummary);
                expect(after.text[lang].degreeContext).toContain(before.text[lang].degreeContext);
                expect(after.text[lang].degreeContext).toContain('741.2801');
                const explanation = getChargeExplanation(after.name, 'FL', lang, after.id)!;
                expect(explanation.plainSummary).toBe(before.text[lang].plainSummary);
                if (lang !== 'en') {
                    expect(explanation.translationDraft).toBe(true);
                    expect(explanation.untranslated).not.toBe(true);
                }
            }
            const source = rows.find(r => r.chargeId === after.id)!;
            for (const section of ['741.28', '741.2801', '741.281', '741.283', '741.325', '775.082', '775.083'])
                expect(source.dependencies.some(d => d.section === section)).toBe(true);
            for (const span of [source.identityEvidence, ...source.conductEvidence, ...source.gradeEvidence]) {
                const d = packet.report.sourceEvidence[span.sourceKey as keyof typeof packet.report.sourceEvidence];
                expect(hash(d.text)).toBe(d.contentHash);
                expect((span.target === 'title' ? d.title : d.text).slice(span.start, span.end)).toBe(span.text);
            }
        }
    });
    it('keeps ordinary-primary categories and conditional exposure in guidance', () => {
        for (const row of plan.records) {
            const charge = getChargeById(row.id)!;
            expect(charge.categories?.[0]).toBe(charge.category);
            expect(classifyChargesForGuidance([row.id])[0].categories).toEqual(row.categories);
        }
        const stalking = FLORIDA_REVIEWED_DEFINITIONS.find(d => d.id === 'fl-fs-784-048-2-stalking')!;
        expect(stalking.categories).toEqual(['misdemeanor', 'felony']);
        expect(stalking.text.en.degreeContext).toContain('up to 5 years imprisonment');
        const battery = FLORIDA_REVIEWED_DEFINITIONS.find(d => d.id === 'fl-fs-784-03-battery')!;
        expect(battery.text.en.degreeContext).toContain('expressly excludes felony battery under section 784.03(2)');
        expect(battery.text.en.degreeContext).toContain('up to 15 years and $10,000');
    });
    it('states the effective date and mandatory sentencing conditions without treating them as universal', () => {
        for (const d of packet.definitions) {
            const text = d.text.en.degreeContext;
            for (const phrase of ['on or after July 1, 2026', 'at the time of the offense', 'shared-child exception', '10/15/20', '15/20/30', 'nonsuspended incarceration', 'at least 1 year', 'program exceptions'])
                expect(text).toContain(phrase);
        }
    });
    it('rejects tampered dependency bindings and definitions', () => {
        const broken = structuredClone(packet);
        broken.report.drafts[0].requiredDependencies.pop();
        expect(() => buildFloridaReviewedSourceRecords(packet.definitions as any, broken.report as any, packet.eligibility as any)).toThrow();
        const defs = structuredClone(packet.definitions);
        defs[0].text.en.degreeContext += 'different';
        expect(() => buildFloridaReviewedSourceRecords(defs as any, packet.report as any, packet.eligibility as any)).toThrow();
    });
    it('requires the receipt to approve the changed hashes; a test-only matching receipt is not production activation', () => {
        const records = buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS, report as any, eligibility as any);
        const at = new Date(syntheticFloridaReceipt.checkedAt);
        expect(validateFloridaReviewedRefreshReceipt(syntheticFloridaReceipt as any, report as any, eligibility as any, records, at)).toBeNull();
        const obsolete = { ...syntheticFloridaReceipt, reportHash: '0'.repeat(64) };
        expect(validateFloridaReviewedRefreshReceipt(obsolete as any, report as any, eligibility as any, records, at)).not.toBeNull();
    });
});
