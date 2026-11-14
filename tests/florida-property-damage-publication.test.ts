import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-property-damage-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaPropertyDamagePacket, FLORIDA_PROPERTY_DAMAGE_SOURCES, FLORIDA_PROPERTY_DAMAGE_RECEIPT_PATH, validateFloridaPropertyDamagePacket, validateFloridaPropertyDamageReceipt } from '../server/data/florida-property-damage-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_PROPERTY_DAMAGE_RECEIPT_PATH, 'utf8'));
describe('Florida property-damage subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_PROPERTY_DAMAGE_SOURCES.map(source => source.code)).toEqual(["806.031(1)", "806.031(2)", "806.10(1)", "806.10(2)", "806.101", "806.13(2)", "806.13(3)", "806.13(4)", "806.13(5)", "806.135(2)", "806.14(2)(a)", "806.14(2)(b)", "806.14(2)(c)"]);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('separates first and repeat alarm penalties, restitution and exact damage thresholds', () => {
    const row = (code: string) => rows.find(r => r.definition.code === code)!.definition;
    expect(getChargeById(row('806.101').id)?.categories).toEqual(['misdemeanor','felony']);
    expect(row('806.031(1)').text.en.degreeContext).toContain('arson conviction is unnecessary');
    expect(row('806.13(3)').text.en.degreeContext).toContain('full repair or replacement cost');
    expect(row('806.135(2)').text.en.plainSummary).toContain('does not specify a dollar threshold');
    expect(row('806.14(2)(b)').text.en.plainSummary).toContain('over $200 but under $1,000');
    expect(row('806.13(5)').text.en.plainSummary).toContain('visible to the public');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaPropertyDamagePacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaPropertyDamagePacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaPropertyDamageReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaPropertyDamageReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaPropertyDamageReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
