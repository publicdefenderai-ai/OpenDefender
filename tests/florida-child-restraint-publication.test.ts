import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-child-restraint-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaChildRestraintPacket, FLORIDA_CHILD_RESTRAINT_SOURCES, FLORIDA_CHILD_RESTRAINT_RECEIPT_PATH, validateFloridaChildRestraintPacket, validateFloridaChildRestraintReceipt } from '../server/data/florida-child-restraint-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_CHILD_RESTRAINT_RECEIPT_PATH, 'utf8'));
describe('Florida child-restraint subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_CHILD_RESTRAINT_SOURCES.map(source => source.code)).toEqual(['787.01(3)(a)4.', '787.01(3)(a)5.', '787.01(3)(a)6.', '787.02(3)(a)1.', '787.02(3)(a)2.', '787.02(3)(a)3.', '787.02(3)(a)4.', '787.02(3)(a)5.', '787.02(3)(a)6.']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('separates each incorporated act from the classification of the restraint offense', () => {
    const predicates = [
      ['827.03', '(1)(a)', 'willful torture'],
      ['794.011', '(1)(j)', 'bona fide medical purpose'],
      ['847.0135', '(5)', 'computer transmission'],
      ['796.04', '(1)', 'forced, compelled or coerced'],
      ['450.151', '', 'unjustifiable physical pain'],
      ['787.06', '(5)', 'October 1, 2025'],
    ];
    for (const row of rows) {
      const index = Number(row.scope.match(/(\d+)\.$/)![1]) - 1;
      const [section, scope, phrase] = predicates[index];
      const bindings = floridaChildRestraintPacket.supportingSpans.find(r => r.id === row.id)!.sections;
      expect(bindings).toContainEqual(expect.objectContaining({section, scope}));
      expect(row.definition.text.en.plainSummary).toContain(phrase);
      expect(row.definition.text.en.degreeContext).toMatch(row.section === '787.01' ? /^Life felony/ : /^First-degree felony/);
      expect(row.definition.text.en.degreeContext).not.toMatch(/death penalty|capital felony/);
      expect(row.dependencies).not.toContain('796.03');
      if (index === 5) expect(bindings).toContainEqual(expect.objectContaining({section:'787.06', scope:'(3)(g)'}));
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaChildRestraintPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaChildRestraintPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaChildRestraintReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaChildRestraintReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaChildRestraintReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
