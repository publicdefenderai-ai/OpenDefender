import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-boating-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaBoatingPacket, FLORIDA_BOATING_SOURCES, FLORIDA_BOATING_RECEIPT_PATH, validateFloridaBoatingPacket, validateFloridaBoatingReceipt } from '../server/data/florida-boating-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_BOATING_RECEIPT_PATH, 'utf8'));
describe('Florida boating subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_BOATING_SOURCES.map(source => source.code)).toEqual(['(1)','(2)(a)2.b.','(2)(b)1.','(2)(b)2.','(2)(b)3.','(3)(a)3.a.','(3)(a)3.b.','(3)(a)3.c.(I)','(3)(a)3.c.(II)','(3)(a)3.c.(III)'].map(scope => '327.35' + scope));
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('separates repeat penalties, accident causation and the three manslaughter branches', () => {
    const byCode = new Map(rows.map(row => [row.scope,row.definition]));
    expect(byCode.get('(1)')?.text.en.degreeContext).toContain('$500–$1,000');
    expect(byCode.get('(2)(a)2.b.')?.text.en.degreeContext).toContain('within five years');
    expect(byCode.get('(2)(b)1.')?.category).toBe('felony');
    expect(byCode.get('(2)(b)2.')?.category).toBe('misdemeanor');
    expect(byCode.get('(2)(b)3.')?.text.en.degreeContext).toContain('minimum fine is $2,000');
    expect(byCode.get('(3)(a)3.b.')?.text.en.plainSummary).toContain('Another person');
    const manslaughter = FLORIDA_BOATING_SOURCES.filter(row => row.code.includes('3.c.'));
    expect(manslaughter.map(row => row.conductEvidence[0].text.split('\n')[0].trim())).toEqual(['(I)','(II)','(III)']);
    expect(manslaughter[0].conductEvidence[0].text).not.toContain('first degree');
    expect(manslaughter[1].conductEvidence[0].text).toContain('failed to give information');
    expect(manslaughter[1].conductEvidence[0].text).not.toContain('prior conviction');
    expect(manslaughter[2].conductEvidence[0].text).toContain('prior conviction');
    for (const row of rows.filter(row => row.scope.includes('3.c.'))) {
      expect(row.definition.text.en.degreeContext).toContain('four years');
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaBoatingPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaBoatingPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaBoatingReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaBoatingReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaBoatingReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
