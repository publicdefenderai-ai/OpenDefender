import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-credit-card-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaCreditCardPacket, FLORIDA_CREDIT_CARD_SOURCES, FLORIDA_CREDIT_CARD_RECEIPT_PATH, validateFloridaCreditCardPacket, validateFloridaCreditCardReceipt } from '../server/data/florida-credit-card-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_CREDIT_CARD_RECEIPT_PATH, 'utf8'));
describe('Florida credit-card subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_CREDIT_CARD_SOURCES.map(source => source.code)).toEqual(['817.60(1)', '817.60(2)', '817.60(3)', '817.60(4)', '817.60(5)', '817.60(6)(a)', '817.60(7)', '817.60(8)', '817.62(1)', '817.62(2)', '817.62(3)(a)', '817.62(3)(b)', '817.625(2)(a)1.', '817.625(2)(a)2.', '817.625(2)(b)', '817.625(2)(c)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('separates the merchant’s six-month threshold from fraudulent use and device grading', () => {
    const merchant = FLORIDA_CREDIT_CARD_SOURCES.find(s => s.code === '817.62(1)')!;
    expect(merchant.gradeEvidence.map(span => span.category)).toEqual(['misdemeanor','felony']);
    expect(getChargeById(merchant.chargeId)?.categories).toEqual(['misdemeanor','felony']);
    for (const span of merchant.gradeEvidence) expect(floridaCreditCardPacket.report.sourceEvidence[span.sourceKey].section).toBe('817.67');
    const row = rows.find(row => row.id === merchant.chargeId)!;
    expect(row.definition.text.en.degreeContext).toContain('$300 or less');
    expect(row.definition.text.en.degreeContext).toContain('more than $300');
    expect(rows.filter(row => row.definition.category === 'felony')).toHaveLength(10);
    expect(rows.find(row => row.definition.code === '817.625(2)(b)')?.definition.text.en.plainSummary).toMatch(/second or subsequent/i);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaCreditCardPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaCreditCardPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaCreditCardReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaCreditCardReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaCreditCardReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
