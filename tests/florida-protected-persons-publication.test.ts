import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-protected-persons-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaProtectedPersonsPacket, FLORIDA_PROTECTED_PERSONS_SOURCES, FLORIDA_PROTECTED_PERSONS_RECEIPT_PATH, validateFloridaProtectedPersonsPacket, validateFloridaProtectedPersonsReceipt } from '../server/data/florida-protected-persons-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_PROTECTED_PERSONS_RECEIPT_PATH, 'utf8'));
describe('Florida protected-persons subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_PROTECTED_PERSONS_SOURCES.map(source => source.code)).toEqual(['784.07(2)(a)','784.07(2)(b)','784.07(2)(c)','784.07(2)(d)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps officer-specific minimums separate from the possession minimums', () => {
    const [assault,battery,aggravatedAssault,aggravatedBattery] = rows.map(r=>r.definition);
    expect(getChargeById(assault.id)?.categories).toEqual(['misdemeanor','felony']);
    expect(battery.text.en.degreeContext).toContain('six months');
    expect(battery.text.en.degreeContext).toContain('For any conviction under (2)(b)');
    expect(battery.text.en.degreeContext).toContain('requires eight');
    expect(aggravatedAssault.text.en.degreeContext).toContain('three-year minimum');
    expect(aggravatedBattery.text.en.degreeContext).toContain('five-year minimum');
    for (const {definition} of rows) expect(definition.text.en.plainSummary).toContain('June 16, 2026');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaProtectedPersonsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaProtectedPersonsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaProtectedPersonsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaProtectedPersonsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaProtectedPersonsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
