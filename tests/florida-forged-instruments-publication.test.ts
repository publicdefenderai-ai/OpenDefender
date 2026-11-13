import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-forged-instruments-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaForgedInstrumentsPacket, FLORIDA_FORGED_INSTRUMENTS_SOURCES, FLORIDA_FORGED_INSTRUMENTS_RECEIPT_PATH, validateFloridaForgedInstrumentsPacket, validateFloridaForgedInstrumentsReceipt } from '../server/data/florida-forged-instruments-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_FORGED_INSTRUMENTS_RECEIPT_PATH, 'utf8'));
describe('Florida forged-instruments subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_FORGED_INSTRUMENTS_SOURCES.map(source => source.code)).toEqual(["831.02", "831.04(1)", "831.04(2)", "831.07", "831.08", "831.09", "831.11", "831.28(2)(a)"]);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes the number, recurrence and payment-definition conditions', () => {
    const row = (code: string) => rows.find(r => r.definition.code === code)!.definition.text.en;
    expect(row('831.08').plainSummary).toContain('ten or more similar');
    expect(row('831.11').plainSummary).toContain('Bringing into Florida or possessing');
    expect(row('831.09').degreeContext).toContain('three distinct charges');
    expect(row('831.28(2)(a)').plainSummary).toContain('credit-card vouchers and letters of credit are excluded');
    expect(FLORIDA_FORGED_INSTRUMENTS_SOURCES.find(s => s.code === '831.02')!.offense.subdivision).toBeNull();
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaForgedInstrumentsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaForgedInstrumentsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaForgedInstrumentsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaForgedInstrumentsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaForgedInstrumentsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
