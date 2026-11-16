import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-prescription-fraud-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaPrescriptionFraudPacket, FLORIDA_PRESCRIPTION_FRAUD_SOURCES, FLORIDA_PRESCRIPTION_FRAUD_RECEIPT_PATH, validateFloridaPrescriptionFraudPacket, validateFloridaPrescriptionFraudReceipt } from '../server/data/florida-prescription-fraud-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_PRESCRIPTION_FRAUD_RECEIPT_PATH, 'utf8'));
describe('Florida prescription-fraud subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_PRESCRIPTION_FRAUD_SOURCES.map(source => source.code)).toEqual(['893.13(7)(a)7.', '893.13(7)(a)8.', '893.13(7)(a)9.', '893.13(7)(a)10.', '893.13(7)(a)11.', '893.13(7)(a)13.', '893.13(7)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes the disclosure period, attempt, form-holder exceptions, and the two actor-specific schedule limits', () => {
    const byScope = new Map(rows.map(row => [row.scope, row]));
    const disclosure = byScope.get('(7)(a)8.')!.definition;
    for (const [lang, terms] of Object.entries({
      en: ['30 days','another practitioner','like therapeutic use'],
      es: ['30 días','otro profesional','uso terapéutico similar'],
      zh: ['30天','另一名执业人员','治疗用途相似'],
    })) {
      for (const term of terms) expect(disclosure.text[lang as 'en'|'es'|'zh'].plainSummary).toContain(term);
    }
    expect(byScope.get('(7)(a)7.')!.definition.text.en.plainSummary).toContain('supplier authorized by that practitioner');
    expect(byScope.get('(7)(a)9.')!.definition.text.en.plainSummary).toContain('trying to do so');
    for (const row of rows) {
      const grade = ['(7)(a)13.', '(7)(b)'].includes(row.scope) ? '(7)(e)' : '(7)(d)';
      expect(row.subdivisions['893.13']).toContain(grade);
      expect(row.definition.text.en.degreeContext).toContain(grade === '(7)(e)' ? '15 years' : 'five years');
      if (grade === '(7)(e)') expect(row.definition.text.en.plainSummary).toContain('Schedule II, III or IV');
    }
    expect(byScope.get('(7)(a)13.')!.definition.text.en.plainSummary).toContain('for oneself');
    expect(byScope.get('(7)(b)')!.definition.text.en.plainSummary).toContain('for the patient');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaPrescriptionFraudPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaPrescriptionFraudPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaPrescriptionFraudReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaPrescriptionFraudReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaPrescriptionFraudReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
