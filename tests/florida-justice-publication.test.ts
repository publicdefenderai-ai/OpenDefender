import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-justice-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaJusticePacket, FLORIDA_JUSTICE_SOURCES, FLORIDA_JUSTICE_RECEIPT_PATH, validateFloridaJusticePacket, validateFloridaJusticeReceipt } from '../server/data/florida-justice-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_JUSTICE_RECEIPT_PATH, 'utf8'));
describe('Florida justice subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_JUSTICE_SOURCES.map(source => source.code)).toEqual(['914.22(2)(a)', '914.22(2)(b)', '914.22(2)(c)', '914.22(2)(d)', '914.22(2)(e)', '914.22(2)(f)', '914.22(4)(a)', '914.22(4)(b)', '914.22(4)(c)', '914.22(4)(d)', '914.22(4)(e)', '914.22(4)(f)', '918.13(1)(a)', '918.13(1)(b)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps the two witness grading ladders and the capital-evidence branch distinct', () => {
    for (const source of FLORIDA_JUSTICE_SOURCES.filter(s => s.code.startsWith('914.22'))) {
      const [span] = source.incorporatedConductEvidence ?? [];
      expect(span.text).toContain(source.code.startsWith('914.22(2)') ? 'uses intimidation' : 'intentionally harasses');
      expect(floridaJusticePacket.report.sourceEvidence[span.sourceKey].text.slice(span.start, span.end)).toBe(span.text);
    }
    const byCode = new Map(rows.map(row => [row.definition.code, row]));
    expect(byCode.get('914.22(2)(e)')?.definition.text.en.degreeContext).toContain('Life felony');
    expect(byCode.get('914.22(4)(e)')?.definition.text.en.degreeContext).toContain('First-degree felony');
    expect(byCode.get('914.22(2)(f)')?.definition.text.en.degreeContext).toContain('Third-degree');
    expect(byCode.get('914.22(4)(a)')?.definition.category).toBe('misdemeanor');
    for (const row of rows.filter(r => r.section === '918.13')) {
      expect(row.gradingScopes).toEqual(['(2)(a)','(2)(b)']);
      expect(row.definition.text.en.degreeContext).toMatch(/capital felony.*second-degree felony/);
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaJusticePacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaJusticePacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaJusticeReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaJusticeReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaJusticeReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
