import { describe, it, expect } from 'vitest';
import additions from '../shared/california-public-conduct-knives-additions.json';
import { readPublicConductKnivesReview, validatePublicConductKnivesReview, renderPublicConductKnivesReview } from '../scripts/data-review/california-verification/public-conduct-knives-review';
import { getCaliforniaCanonicalRecord, getCaliforniaRecordEvidenceStatus } from '../shared/california-authority';
import { getChargeById, classifyChargesForGuidance, chargeCategories } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import previous from '../scripts/data-review/output/california-closeout-inventory.json';
const addition = (id: string) => additions.find(a => a.id === id)!;
describe('California public conduct and knives', () => {
    it('accounts for eight choices and only six bounded benchmark matches without rewriting the prior inventory', () => {
        expect(validatePublicConductKnivesReview()).toEqual({ additions: 8, primarySections: 3, reusedSections: 7, newSections: 17, newVersions: 17 });
        const r = readPublicConductKnivesReview();
        expect(r.benchmarkUpdates.map(row => row.instructionId).sort()).toEqual(['1161', '1162', '2501', '2502', '2915', '2916']);
        expect(previous.baseline.configuredChoices).toBe(662);
        expect(r.benchmarkUpdates.every(row => row.status === 'bounded_publication_match_other_branches_open')).toBe(true);
        expect(renderPublicConductKnivesReview()).not.toMatch(/[—–]/);
    });
    it('binds exact subdivisions and retains the shared misdemeanor preambles', () => {
        const r = readPublicConductKnivesReview();
        for (const row of r.records) {
            const s = row.primarySpan;
            expect(r.sources.find(x => x.key === s.key)!.text.slice(s.start, s.end)).toBe(s.text);
        }
        expect(r.records.find(row => row.id === 'ca-pen-21510-a')!.primarySpan.text).not.toContain('(b)');
        expect(r.records.find(row => row.id === 'ca-pen-647-h')!.primarySpan.text).not.toContain('(i)');
        for (const key of ['PEN:647', 'PEN:21510'])
            expect(r.sources.find(s => s.key === key)!.text).toContain('guilty of');
    });
    it('does not inherit the neighboring voyeurism or prostitution penalties', () => {
        for (const a of additions.filter(a => a.code.startsWith('647') || a.code.startsWith('21510'))) {
            expect(a.penalty).toContain('six months');
            expect(a.penalty).toContain('$1,000');
            expect(a.penalty).not.toContain('364 days');
            expect(a.categories).toEqual(['misdemeanor']);
        }
        expect(addition('ca-pen-647-h').summary).toContain('intent to commit a crime');
        expect(addition('ca-pen-647-i').summary).toContain('does not require a separate intent');
        expect(addition('ca-pen-647-i').summary).toContain('someone need not be inside');
    });
    it('keeps the two public-conduct theories distinct while making both discoverable by citation', () => {
        const ids = ['ca-pen-647-a-conduct', 'ca-pen-647-a-solicitation'];
        expect(new Set(ids.map(id => getChargeById(id)?.name)).size).toBe(2);
        for (const id of ids)
            expect(getChargeById(id)?.searchAliases).toContain('PC 647(a)');
        expect(addition(ids[0]).summary).toContain('must be present');
        expect(addition(ids[1]).summary).toContain('likely to be present');
        expect(addition(ids[1]).summary).toContain('communicated');
    });
    it('limits the dirk/dagger match and retains the definition and exceptions dependencies', () => {
        const a = addition('ca-pen-21310');
        expect(a.categories).toEqual(['felony', 'misdemeanor']);
        expect(a.supportingKeys).toEqual(expect.arrayContaining(['PEN:16470', 'PEN:20200', 'PEN:17700', 'PEN:17745', 'PEN:1170', 'PEN:672']));
        expect(a.summary).toContain('exposed and locked');
        expect(a.summary).toContain('substantially concealed');
        expect(readPublicConductKnivesReview().limits.join(' ')).toContain('Explosive and other weapons branches remain outside');
        expect(classifyChargesForGuidance([a.id])[0].categories).toEqual(a.categories);
    });
    it('preserves switchblade mechanical limits and intent to sell without assuming all folding knives qualify', () => {
        for (const a of additions.filter(a => a.code.startsWith('21510'))) {
            expect(a.summary).toContain('two inches');
            expect(a.summary).toContain('detent or closing bias');
        }
        expect(addition('ca-pen-21510-c').summary).toContain('additionally requires intent to sell');
        expect(addition('ca-pen-21510-a').supportingKeys).toContain('PEN:16965');
    });
    it('exposes canonical content, grouping and honest language fallback while respecting expiry', () => {
        for (const a of additions) {
            expect(getChargeById(a.id)?.categories).toEqual(a.categories);
            expect(chargeCategories[a.code.startsWith('647') ? 'Public Order' : 'Weapons']).toContain(a.id);
            for (const lang of ['es', 'zh']) {
                const e = getChargeExplanation(a.title, 'CA', lang, a.id)!;
                expect(e.untranslated).toBe(true);
                expect(e.plainSummary).toBe(a.summary);
            }
            expect(getCaliforniaRecordEvidenceStatus(getCaliforniaCanonicalRecord(a.id)!, new Date(receipt.expiresAt))).not.toBe('current');
        }
    });
    it('rejects altered public evidence, bounds and definitions', () => {
        const a = readPublicConductKnivesReview();
        a.sources[0].text += ' altered';
        expect(() => validatePublicConductKnivesReview(a)).toThrow('drift');
        const b = readPublicConductKnivesReview();
        b.records[0].primarySpan.start++;
        expect(() => validatePublicConductKnivesReview(b)).toThrow('drift');
        const c = readPublicConductKnivesReview();
        c.records[0].definitionSha256 = 'wrong';
        expect(() => validatePublicConductKnivesReview(c)).toThrow('drift');
    });
});
