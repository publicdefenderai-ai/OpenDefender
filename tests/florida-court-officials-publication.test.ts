import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-court-officials-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaCourtOfficialsPacket, FLORIDA_COURT_OFFICIALS_SOURCES, FLORIDA_COURT_OFFICIALS_RECEIPT_PATH, validateFloridaCourtOfficialsPacket, validateFloridaCourtOfficialsReceipt } from '../server/data/florida-court-officials-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_COURT_OFFICIALS_RECEIPT_PATH, 'utf8'));
describe('Florida court-officials subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_COURT_OFFICIALS_SOURCES.map(source => source.code)).toEqual(['918.12(1)(b)1.', '918.12(1)(b)2.', '918.12(1)(b)3.', '918.12(1)(b)4.', '918.12(1)(b)5.', '918.12(1)(b)6.', '918.12(2)(b)1.', '918.12(2)(b)2.', '918.12(2)(b)3.', '918.12(2)(b)4.', '918.12(2)(b)5.', '918.12(2)(b)6.', '918.125(1)', '918.125(2)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('binds the distinct official duties, court levels, injury, and attorney exception', () => {
    const byCode = new Map(rows.map(r => [r.definition.code,r]));
    for (const source of FLORIDA_COURT_OFFICIALS_SOURCES.filter(s => s.code.startsWith('918.12('))) {
      expect(source.incorporatedConductEvidence?.[0].text).toContain(source.code.startsWith('918.12(1)') ? 'obstruct the administration of justice' : 'Rendering a fair verdict');
      expect(byCode.get(source.code)?.definition.text.en.degreeContext).toContain('attorneys acting in the performance');
    }
    expect(byCode.get('918.12(2)(b)1.')?.definition.category).toBe('misdemeanor');
    expect(byCode.get('918.12(2)(b)3.')?.definition.text.en.plainSummary).toContain('circuit court');
    expect(byCode.get('918.12(1)(b)6.')?.definition.text.en.degreeContext).toContain('Life felony');
    expect(byCode.get('918.12(2)(b)6.')?.definition.text.en.degreeContext).toContain('First-degree felony');
    expect(byCode.get('918.125(2)')?.definition.text.en.plainSummary).toContain('must result in bodily injury');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaCourtOfficialsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaCourtOfficialsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaCourtOfficialsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaCourtOfficialsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaCourtOfficialsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
