import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-vehicle-identifiers-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaVehicleIdentifiersPacket, FLORIDA_VEHICLE_IDENTIFIERS_SOURCES, FLORIDA_VEHICLE_IDENTIFIERS_RECEIPT_PATH, validateFloridaVehicleIdentifiersPacket, validateFloridaVehicleIdentifiersReceipt } from '../server/data/florida-vehicle-identifiers-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_VEHICLE_IDENTIFIERS_RECEIPT_PATH, 'utf8'));
describe('Florida vehicle-identifiers subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_VEHICLE_IDENTIFIERS_SOURCES.map(source => source.code)).toEqual(['319.30(5)(a)', '319.30(5)(b)', '319.30(4)', '319.33(1)(c)', '319.33(5)', '328.05(1)', '328.07(4)(a)', '328.07(4)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes salvaged titles, detached plates and the number on a vessel from the vessel itself', () => {
    const choices = new Map(rows.map(row => [row.definition.code,row.definition]));
    for (const scope of ['a','b']) {
      const salvage = choices.get('319.30(5)('+scope+')')!;
      expect(salvage.text.en.plainSummary).toContain('Necessary vehicle repairs');
      expect(salvage.aliases.en).toContain('Fla. Stat. § 319.30(5)');
      expect(choices.get('328.07(4)('+scope+')')!.aliases.en).toContain('Fla. Stat. § 328.07(4)');
    }
    expect(choices.get('319.30(4)')!.text.en.plainSummary).toContain('seller affidavit');
    const plate = choices.get('328.07(4)(a)')!;
    expect(plate.text.en.plainSummary).toContain('Approved replacements');
    expect(plate.text.es.plainSummary).toContain('reemplazos aprobados');
    expect(plate.text.zh.plainSummary).toContain('经批准替换标牌');
    expect(choices.get('328.07(4)(b)')!.text.en.plainSummary).toContain('vessel or part');
    expect(choices.get('328.05(1)')!.text.en.plainSummary).toContain('reason to believe');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaVehicleIdentifiersPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaVehicleIdentifiersPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaVehicleIdentifiersReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaVehicleIdentifiersReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaVehicleIdentifiersReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
