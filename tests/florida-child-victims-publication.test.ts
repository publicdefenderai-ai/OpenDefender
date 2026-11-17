import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-child-victims-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaChildVictimsPacket, FLORIDA_CHILD_VICTIMS_SOURCES, FLORIDA_CHILD_VICTIMS_RECEIPT_PATH, validateFloridaChildVictimsPacket, validateFloridaChildVictimsReceipt } from '../server/data/florida-child-victims-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_CHILD_VICTIMS_RECEIPT_PATH, 'utf8'));
describe('Florida child-victims subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_CHILD_VICTIMS_SOURCES.map(source => source.code)).toEqual(['794.011(8)(b)', '787.01(3)(a)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes the custody predicate and the three charged kidnapping predicates', () => {
    const [custody, kidnapping] = rows;
    expect(custody.definition.text.en.plainSummary).toContain('12 through 17');
    expect(custody.definition.text.en.degreeContext).toContain('50-year minimum');
    expect(kidnapping.definition.text.en.plainSummary).toContain('During the kidnapping');
    expect(kidnapping.definition.text.en.degreeContext).toContain('Separate convictions');
    expect(kidnapping.subdivisions['787.01']).toEqual(['(1)','(3)(a)','(3)(a)1.','(3)(a)2.','(3)(a)3.','(3)(b)']);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaChildVictimsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaChildVictimsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaChildVictimsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaChildVictimsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaChildVictimsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
