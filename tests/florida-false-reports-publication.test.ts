import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-false-reports-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaFalseReportsPacket, FLORIDA_FALSE_REPORTS_SOURCES, FLORIDA_FALSE_REPORTS_RECEIPT_PATH, validateFloridaFalseReportsPacket, validateFloridaFalseReportsReceipt } from '../server/data/florida-false-reports-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_FALSE_REPORTS_RECEIPT_PATH, 'utf8'));
describe('Florida false-reports subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_FALSE_REPORTS_SOURCES.map(source => source.code)).toEqual(['817.49(1)', '817.49(2)(b)1.', '817.49(2)(b)2.', '837.055(1)', '837.055(2)', '837.012(1)', '837.021(1)', '837.021(2)', '837.06', '790.163(1)', '790.164(1)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes restitution, response causation and capital proceeding requirements', () => {
    const byCode = new Map(rows.map(r => [r.definition.code,r]));
    expect(byCode.get('817.49(2)(b)1.')?.definition.text.en.plainSummary).toContain('proximately causes');
    expect(byCode.get('837.055(2)')?.definition.text.en.plainSummary).not.toContain('proximately causes');
    expect(byCode.get('817.49(1)')?.definition.text.en.degreeContext).toContain('must order restitution');
    expect(byCode.get('790.164(1)')?.definition.text.en.degreeContext).toContain('may order restitution');
    expect(byCode.get('837.021(2)')?.definition.text.en.plainSummary).toContain('prosecution of a capital felony');
    const whole = FLORIDA_FALSE_REPORTS_SOURCES.find(s => s.code === '837.06')!;
    expect(whole.offense.subdivision).toBeNull();
    expect(whole.conductEvidence[0].text).toMatch(/^Whoever knowingly makes a false statement in writing/);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaFalseReportsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaFalseReportsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaFalseReportsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaFalseReportsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaFalseReportsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
