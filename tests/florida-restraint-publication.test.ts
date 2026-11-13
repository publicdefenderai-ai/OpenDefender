import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-restraint-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaRestraintPacket, FLORIDA_RESTRAINT_SOURCES, FLORIDA_RESTRAINT_RECEIPT_PATH, validateFloridaRestraintPacket, validateFloridaRestraintReceipt } from '../server/data/florida-restraint-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_RESTRAINT_RECEIPT_PATH, 'utf8'));
describe('Florida restraint subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_RESTRAINT_SOURCES.map(source => source.code)).toEqual(['787.01(2)', '787.02(2)', '787.025(2)(a)', '787.025(2)(b)', '787.025(2)(c)', '787.03(1)', '787.03(2)', '787.04(1)', '787.04(2)', '787.04(3)', '787.04(4)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('requires separate conduct and grading bindings for each custody proceeding branch', () => {
    for (const source of FLORIDA_RESTRAINT_SOURCES.filter(row => row.code.startsWith('787.04'))) {
      expect(source.conductEvidence).toHaveLength(1);
      expect(source.conductEvidence[0].text).not.toContain('felony of the third degree');
      expect(source.grading).toContain('felony of the third degree');
    }
    expect(rows.filter(row => row.section === '787.04')).toHaveLength(4);
    expect(rows.filter(row => row.section === '787.025' && row.definition.text.en.degreeContext.includes('Second-degree felony'))).toHaveLength(2);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaRestraintPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaRestraintPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaRestraintReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaRestraintReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaRestraintReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
