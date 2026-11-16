import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-obscenity-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaObscenityPacket, FLORIDA_OBSCENITY_SOURCES, FLORIDA_OBSCENITY_RECEIPT_PATH, validateFloridaObscenityPacket, validateFloridaObscenityReceipt } from '../server/data/florida-obscenity-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_OBSCENITY_RECEIPT_PATH, 'utf8'));
describe('Florida obscenity subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_OBSCENITY_SOURCES.map(source => source.code)).toEqual(['847.011(1)(c)', '847.012(3)(a)', '847.012(3)(b)', '847.012(4)', '847.012(5)', '847.0133(1)', '847.0138(2)', '847.0138(3)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes dissemination from possession, the paid transactions, school exception and direct electronic recipients', () => {
    const byCode = new Map(rows.map(row => [row.definition.code, row.definition.text.en]));
    expect(byCode.get('847.011(1)(c)')?.plainSummary).toContain('intent to distribute');
    expect(byCode.has('847.011(2)')).toBe(false);
    expect(byCode.get('847.012(3)(a)')?.plainSummary).toContain('for money');
    expect(byCode.get('847.012(4)')?.plainSummary).toContain('no intent to distribute');
    expect(byCode.get('847.012(5)')?.plainSummary).toContain('School-approved instructional material');
    for (const code of ['847.0138(2)', '847.0138(3)']) {
      const text = byCode.get(code)!;
      expect(text.plainSummary).toContain('individually addressed instant message');
      expect(text.plainSummary).toContain('mailing lists are excluded');
      expect(text.degreeContext).toContain('sex-offender registration');
    }
    expect(byCode.get('847.0138(3)')?.plainSummary).toContain('sender is outside Florida');
    for (const source of FLORIDA_OBSCENITY_SOURCES) {
      expect(source.gradeEvidence.map(span => span.text).join(' ')).toMatch(/felony of the third degree/);
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaObscenityPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaObscenityPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaObscenityReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaObscenityReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaObscenityReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
