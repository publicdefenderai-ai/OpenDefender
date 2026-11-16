import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-payment-fraud-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaPaymentFraudPacket, FLORIDA_PAYMENT_FRAUD_SOURCES, FLORIDA_PAYMENT_FRAUD_RECEIPT_PATH, validateFloridaPaymentFraudPacket, validateFloridaPaymentFraudReceipt } from '../server/data/florida-payment-fraud-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_PAYMENT_FRAUD_RECEIPT_PATH, 'utf8'));
describe('Florida payment-fraud subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_PAYMENT_FRAUD_SOURCES.map(source => source.code)).toEqual(['817.52(1)', '817.52(2)', '817.52(3)', '817.52(4)', '832.05(3)(a)', '817.481(3)(a)', '817.504(1)(a)', '817.504(1)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('uses the offense text for the $300 boundary and the controlling chart columns for felony degree', () => {
    const row = rows.find(row => row.section === '817.481')!;
    const evidence = Object.values(floridaPaymentFraudPacket.report.sourceEvidence);
    const chart = evidence.find(doc => doc.section === '921.0022')!.text;
    expect(chart).toContain('817.481(3)(a)\n3rd\nObtain credit');
    expect(chart).toContain('felony degree designations in the middle column of the chart are controlling');
    expect(evidence.find(doc => doc.section === '817.481')!.text).toContain('$300 or more');
    expect(row.definition.text.en.plainSummary).toContain('exactly $300');
    expect(row.definition.text.es.plainSummary).toContain('exactamente $300');
    expect(row.definition.text.zh.plainSummary).toContain('正好300美元');
  });
  it('distinguishes ordinary rental nonpayment, fraudulent cashing and repeat vaccine violations', () => {
    const byCode = new Map(rows.map(row => [row.definition.code,row.definition]));
    expect(byCode.get('817.52(2)')!.text.en.plainSummary).toContain('intent must still be proved');
    expect(byCode.get('817.52(3)')!.text.en.plainSummary).toContain('without consent');
    expect(byCode.get('817.52(4)')!.category).toBe('misdemeanor');
    expect(byCode.get('832.05(3)(a)')!.text.en.plainSummary).toContain('no minimum dollar amount');
    expect(byCode.get('817.504(1)(a)')!.text.en.degreeContext).toContain('five years');
    expect(byCode.get('817.504(1)(b)')!.text.en.degreeContext).toContain('15 years');
    expect(byCode.get('817.504(1)(b)')!.text.en.plainSummary).toContain('second or later violation');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaPaymentFraudPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaPaymentFraudPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaPaymentFraudReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaPaymentFraudReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaPaymentFraudReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
