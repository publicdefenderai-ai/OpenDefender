import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import rows from '../shared/florida-persons-publication.json';
import { FLORIDA_PERSONS_DEFINITIONS, FLORIDA_PERSONS_IDS, validateFloridaPersonsCategories } from '../shared/florida-persons-batch';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
import { FLORIDA_PERSONS_SOURCES, FLORIDA_PERSONS_RECEIPT_PATH, floridaPersonsPacket, validateFloridaPersonsPacket, validateFloridaPersonsReceipt } from '../server/data/florida-persons-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed, validateFloridaManifestRecord } from '../server/data/florida-source-database-seed';
import { getChargeById, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
const receipt = JSON.parse(readFileSync(FLORIDA_PERSONS_RECEIPT_PATH, 'utf8'));
const fresh = new Date(receipt.checkedAt);
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
describe('Florida persons publication', () => {
    it('accounts for15 new branches using22 official sections without overlapping reviewed identities', () => {
        expect(FLORIDA_PERSONS_IDS.size).toBe(15);
        expect(new Set(Object.values(floridaPersonsPacket.report.sourceEvidence).map(d => d.section)).size).toBe(22);
        expect(FLORIDA_REVIEWED_DEFINITIONS.some(d => FLORIDA_PERSONS_IDS.has(d.id))).toBe(false);
        expect(FLORIDA_PERSONS_DEFINITIONS.filter(d => d.category === 'felony')).toHaveLength(13);
        expect(FLORIDA_PERSONS_DEFINITIONS.filter(d => d.category === 'misdemeanor')).toHaveLength(2);
        for (const row of rows) {
            const source = FLORIDA_PERSONS_SOURCES.find(s => s.chargeId === row.id)!;
            expect(source.code).toBe(row.section + row.scope);
            expect(getChargeById(row.id)?.sourceUrls).toEqual([source.offense.sourceUrl]);
            expect(source.dependencies.some(d => d.section === '775.082')).toBe(true);
            expect(source.dependencies.some(d => d.section === '775.083')).toBe(true);
            for (const span of [source.identityEvidence, ...source.conductEvidence, ...source.gradeEvidence]) {
                const doc = floridaPersonsPacket.report.sourceEvidence[span.sourceKey];
                expect(hash(doc.text)).toBe(doc.contentHash);
                expect((span.target === 'title' ? doc.title : doc.text).slice(span.start, span.end)).toBe(span.text);
            }
            const degree = { F1: 'first', F2: 'second', F3: 'third', M1: 'first' }[row.grade];
            const category = row.grade.startsWith('F') ? 'felony' : 'misdemeanor';
            expect(source.grading).toContain(`${category} of the ${degree} degree`);
            if (['784.08', '784.082'].includes(row.section))
                expect(source.grading).toContain(`to a ${category} of the ${degree} degree`);
        }
    });
    it('preserves underlying conduct, repeat predicates, mandatory terms and incorporation limits', () => {
        const byCode = (code: string) => FLORIDA_PERSONS_DEFINITIONS.find(d => d.code === code)!;
        expect(byCode('784.03(2)').text.en.plainSummary).toContain('resisting an officer with violence');
        expect(byCode('784.041(2)').text.en.plainSummary).toContain('Authorized medical');
        for (const code of ['784.08(2)(a)', '784.08(2)(b)']) {
            const row = byCode(code);
            expect(row.text.en.degreeContext).toContain('minimum of 3 years');
            expect(row.text.en.degreeContext).toContain('500 hours');
            expect(row.text.en.degreeContext).toContain('restitution');
        }
        for (const source of FLORIDA_PERSONS_SOURCES.filter(s => ['784.08', '784.082'].includes(s.offense.section))) {
            expect(source.dependencies.some(d => ['784.011', '784.021', '784.03', '784.045'].includes(d.section))).toBe(true);
        }
        expect(byCode('784.048(7)').text.en.degreeContext).toContain('consecutively');
        expect(byCode('784.085(1)-(3)').text.en.plainSummary).toContain('attempting');
        expect(byCode('784.08(2)(d)').categories).toEqual(['misdemeanor', 'felony']);
        expect(byCode('784.041(2)').text.en.degreeContext).toContain('second-degree felony, ordinarily punishable by up to 15 years');
        expect(byCode('784.03(2)').text.en.degreeContext).toContain('expressly excludes');
        for (const source of FLORIDA_PERSONS_SOURCES)
            expect(source.dependencies.some(d => d.section === '741.2801')).toBe(true);
    });
    it('preserves both exposure tiers in guidance and category filtering', () => {
        for (const row of rows.filter(r => r.grade === 'M1')) {
            const charge = getChargeById(row.id)!;
            for (const category of ['misdemeanor', 'felony'])
                expect(charge.category === category || charge.categories?.includes(category as any)).toBe(true);
            expect(charge.category).toBe('misdemeanor');
            expect(charge.categories?.[0]).toBe('misdemeanor');
            const guidance = classifyChargesForGuidance([row.id])[0];
            expect(guidance.categories).toEqual(['misdemeanor', 'felony']);
            expect(guidance.maxPenalty).toContain('third-degree felony, ordinarily punishable by up to 5 years');
        }
    });
    it('rejects categories that obscure the ordinary grade', () => {
        const row = rows.find(r => r.grade === 'M1')!;
        expect(() => validateFloridaPersonsCategories(row)).not.toThrow();
        for (const categories of [['felony', 'misdemeanor'], [], ['misdemeanor', 'misdemeanor'], ['misdemeanor', 'unknown']])
            expect(() => validateFloridaPersonsCategories({ ...row, categories })).toThrow('category mismatch');
    });
    it('labels new English fallback honestly in Spanish and Chinese', () => {
        for (const d of FLORIDA_PERSONS_DEFINITIONS)
            for (const lang of ['es', 'zh']) {
                const explanation = getChargeExplanation(d.name, 'FL', lang, d.id)!;
                expect(explanation.untranslated).toBe(true);
                expect(explanation.translationDraft).toBe(false);
                expect(explanation.plainSummary).toBe(d.text.en.plainSummary);
            }
    });
    it.each(['source', 'span', 'definition', 'dependency', 'id'] as const)('rejects tampered %s evidence', kind => {
        const packet = structuredClone(floridaPersonsPacket), draft = packet.report.drafts[0];
        if (kind === 'source')
            packet.report.sourceEvidence[draft.primarySourceKey].text += 'tamper';
        if (kind === 'span')
            draft.conductEvidence[0].start++;
        if (kind === 'definition')
            packet.eligibility.decisions[0].definitionHash = 'wrong';
        if (kind === 'dependency')
            draft.requiredDependencies.pop();
        if (kind === 'id')
            draft.id = 'fl-fs-unknown';
        expect(() => validateFloridaPersonsPacket(packet)).toThrow();
    });
    it('binds quarterly expiry to real acquisitions and fails closed at boundaries', () => {
        expect(validateFloridaPersonsReceipt(receipt, fresh)).toBeNull();
        expect(validateFloridaPersonsReceipt(receipt, new Date(Date.parse(receipt.expiresAt) - 1))).toBeNull();
        expect(validateFloridaPersonsReceipt(receipt, new Date(receipt.expiresAt))).not.toBeNull();
        expect(validateFloridaPersonsReceipt(receipt, new Date(fresh.getTime() - 1))).not.toBeNull();
        expect(validateFloridaPersonsReceipt({ ...receipt, expiresAt: new Date(Date.parse(receipt.expiresAt) + 86400000).toISOString() }, fresh)).not.toBeNull();
        expect(validateFloridaPersonsReceipt({ ...receipt, checkedAt: '2000-01-01' }, fresh)).not.toBeNull();
        expect(validateFloridaPersonsReceipt({ ...receipt, verificationPolicy: undefined }, fresh)).not.toBeNull();
        expect(validateFloridaPersonsReceipt({ ...receipt, reportHash: 'wrong' }, fresh)).not.toBeNull();
    });
    it('composes15 independently fresh records with25legacy choices while old101remain expired; seed rechecks stale manifests', () => {
        const manifest = loadFloridaAuthorityManifest(undefined, fresh);
        expect(manifest.catalogRecords).toHaveLength(117 + 15);
        for (const record of manifest.catalogRecords)
            expect(validateFloridaManifestRecord(record)).toBeNull();
        const seed = buildFloridaSourceDatabaseSeed(manifest, fresh);
        expect(seed.selectableChargeIds).toHaveLength(40);
        expect(seed.selectableChargeIds.filter(id => FLORIDA_PERSONS_IDS.has(id))).toHaveLength(15);
        expect(seed.selectableChargeIds.some(id => FLORIDA_REVIEWED_DEFINITIONS.some(d => d.id === id))).toBe(false);
        const stale = buildFloridaSourceDatabaseSeed(manifest, new Date(receipt.expiresAt));
        expect(stale.selectableChargeIds).toHaveLength(25);
        expect(stale.selectableChargeIds.some(id => FLORIDA_PERSONS_IDS.has(id))).toBe(false);
    });
});
