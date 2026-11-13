import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-crash-flight-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaCrashFlightPacket, FLORIDA_CRASH_FLIGHT_SOURCES, FLORIDA_CRASH_FLIGHT_RECEIPT_PATH, validateFloridaCrashFlightPacket, validateFloridaCrashFlightReceipt } from '../server/data/florida-crash-flight-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_CRASH_FLIGHT_RECEIPT_PATH, 'utf8'));
describe('Florida crash/flight subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_CRASH_FLIGHT_SOURCES.map(source => source.code)).toEqual(['316.027(2)(a)', '316.027(2)(b)', '316.027(2)(c)', '316.1935(1)', '316.1935(2)', '316.1935(3)(a)', '316.1935(3)(b)', '316.1935(4)(a)', '316.1935(4)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps the four-year departure and three-year pursuit minimums specific to their branches', () => {
    const byCode = new Map(rows.map(row => [row.definition.code, row.definition.text.en]));
    expect(byCode.get('316.027(2)(c)')?.degreeContext).toMatch(/four-year minimum.*Unless driving under the influence.*depart/);
    for (const row of rows.filter(row => row.section === '316.1935')) {
      expect(row.definition.text.en.degreeContext.includes('three-year prison minimum')).toBe(['(3)(b)', '(4)(b)'].includes(row.scope));
      expect(row.definition.text.en.degreeContext).toContain('one to five years');
      if (row.scope.startsWith('(4)')) {
        expect(row.dependencies).toEqual(expect.arrayContaining(['316.027', '316.061', '316.062']));
        expect(row.definition.text.en.plainSummary).toContain('harm must result from the flight');
      }
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaCrashFlightPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaCrashFlightPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaCrashFlightReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaCrashFlightReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaCrashFlightReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
