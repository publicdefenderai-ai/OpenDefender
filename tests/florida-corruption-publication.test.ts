import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-corruption-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaCorruptionPacket, FLORIDA_CORRUPTION_SOURCES, FLORIDA_CORRUPTION_RECEIPT_PATH, validateFloridaCorruptionPacket, validateFloridaCorruptionReceipt } from '../server/data/florida-corruption-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_CORRUPTION_RECEIPT_PATH, 'utf8'));
describe('Florida corruption subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_CORRUPTION_SOURCES.map(source => source.code)).toEqual(["838.015(1)", "838.016(1)", "838.016(2)", "838.021(3)(a)", "838.021(3)(b)", "838.022(1)(a)", "838.022(1)(b)", "838.022(1)(c)", "838.12(1)", "838.12(2)", "838.15(1)", "838.16(1)", "838.21", "838.22(1)(a)", "838.22(1)(b)", "838.22(2)", "838.22(3)", "838.22(4)"]);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('retains the chapter-wide mandatory service and conditional restitution in each explanation', () => {
    for (const row of rows) {
      expect(row.dependencies).toContain('838.23');
      for (const text of Object.values(row.definition.text)) expect(text.degreeContext).toContain('250');
      expect(row.definition.text.en.degreeContext).toContain('After a hearing');
    }
    const row = (code: string) => rows.find(r => r.definition.code === code)!;
    expect(row('838.021(3)(a)').definition.text.en.degreeContext).toContain('15 years');
    expect(row('838.021(3)(b)').definition.text.en.degreeContext).toContain('five years');
    expect(row('838.022(1)(b)').definition.text.en.plainSummary).toContain('except as authorized');
    expect(row('838.22(4)').definition.text.en.plainSummary).toContain('entering');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaCorruptionPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaCorruptionPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaCorruptionReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaCorruptionReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaCorruptionReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
