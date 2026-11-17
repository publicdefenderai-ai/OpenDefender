import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-computer-financial-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaComputerFinancialPacket, FLORIDA_COMPUTER_FINANCIAL_SOURCES, FLORIDA_COMPUTER_FINANCIAL_RECEIPT_PATH, validateFloridaComputerFinancialPacket, validateFloridaComputerFinancialReceipt } from '../server/data/florida-computer-financial-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_COMPUTER_FINANCIAL_RECEIPT_PATH, 'utf8'));
describe('Florida computer-financial subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_COMPUTER_FINANCIAL_SOURCES.map(source => source.code)).toEqual(['815.04(1)', '815.04(2)', '815.04(3)', '815.04(4)(b)', '815.06(4)', '655.50(10)(a)', '655.50(10)(b)1.', '655.50(10)(b)2.', '655.50(10)(b)3.']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps the underlying computer act and scheme purpose separate and preserves exclusions', () => {
    const byCode = new Map(rows.map(row => [row.definition.code, row.definition]));
    const scheme = byCode.get('815.04(4)(b)')!;
    expect(scheme.text.en.plainSummary).toContain('no minimum dollar loss');
    expect(scheme.text.en.degreeContext).toContain('15 years');
    expect(byCode.get('815.04(3)')?.text.en.plainSummary).toContain('confidential by law');
    expect(byCode.get('815.06(4)')?.text.en.plainSummary).toContain('lawful employment');
    expect(byCode.has('815.06(2)-(3)')).toBe(false);
  });
  it('preserves transaction aggregation, required reporting, federal filing and the additional criminal fines', () => {
    const felonies = rows.filter(row => row.section === '655.50' && row.scope.startsWith('(10)(b)'));
    expect(felonies.map(row => row.definition.text.en.plainSummary.split('totaling ').pop())).toEqual([
      '$300 to under $20,000 in any 12-month period.',
      '$20,000 to under $100,000 in any 12-month period.',
      '$100,000 or more in any 12-month period.',
    ]);
    for (const {definition} of felonies) {
      expect(definition.text.en.plainSummary).toContain('must actually owe a report');
      expect(definition.text.en.plainSummary).toContain('Timely qualifying federal filing');
      expect(definition.text.en.degreeContext).toContain('greater of $500,000 or five times');
      expect(definition.text.es.degreeContext).toContain('cinco veces');
      expect(definition.text.zh.degreeContext).toContain('交易价值五倍');
    }
    expect(felonies[2].definition.text.en.degreeContext).toContain('30 years');
    const misdemeanor = rows.find(row => row.scope === '(10)(a)')!;
    expect(misdemeanor.definition.text.en.plainSummary).toContain('Negligent regulatory noncompliance alone');
    expect(misdemeanor.definition.text.en.degreeContext).not.toContain('$250,000');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaComputerFinancialPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaComputerFinancialPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaComputerFinancialReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaComputerFinancialReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaComputerFinancialReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
