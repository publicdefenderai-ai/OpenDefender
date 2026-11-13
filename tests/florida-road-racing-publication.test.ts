import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-road-racing-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaRoadRacingPacket, FLORIDA_ROAD_RACING_SOURCES, FLORIDA_ROAD_RACING_RECEIPT_PATH, validateFloridaRoadRacingPacket, validateFloridaRoadRacingReceipt } from '../server/data/florida-road-racing-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_ROAD_RACING_RECEIPT_PATH, 'utf8'));
describe('Florida road-racing subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_ROAD_RACING_SOURCES.map(source => source.code)).toEqual(['316.191(2)(a)', '316.191(2)(b)', '316.191(2)(c)', '316.191(2)(d)', '316.191(2)(e)', '316.191(2)(f)', '316.191(3)(b)', '316.191(3)(c)', '316.191(3)(d)', '316.191(3)(e)', '316.191(3)(f)', '322.03(1)(b)1.', '322.03(1)(b)2.', '322.03(1)(b)3.', '322.03(2)(a)', '322.03(4)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('preserves the special fines, participation limits, and criminal-license thresholds', () => {
    const byCode = new Map(rows.map(row => [row.definition.code, row]));
    expect(byCode.get('316.191(2)(e)')?.definition.text.en.plainSummary).toContain('news media');
    expect(byCode.get('316.191(3)(f)')?.definition.text.en.plainSummary).toContain('Passenger or coordination status alone');
    expect(byCode.get('316.191(3)(e)')?.definition.text.en.degreeContext).toContain('$3,500–$7,500');
    expect(byCode.get('322.03(1)(b)3.')?.definition.text.en.degreeContext).toContain('ten days in jail');
    expect(byCode.get('322.03(4)(b)')?.definition.text.en.plainSummary).toContain('30 days or less');
    const source = FLORIDA_ROAD_RACING_SOURCES.find(s => s.code === '322.03(1)(b)3.')!;
    expect(source.incorporatedConductEvidence?.[0].text).toContain('valid driver license');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaRoadRacingPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaRoadRacingPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaRoadRacingReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaRoadRacingReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaRoadRacingReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
