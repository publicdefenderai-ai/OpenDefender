import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-regulatory-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaRegulatoryPacket, FLORIDA_REGULATORY_SOURCES, FLORIDA_REGULATORY_RECEIPT_PATH, validateFloridaRegulatoryPacket, validateFloridaRegulatoryReceipt } from '../server/data/florida-regulatory-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_REGULATORY_RECEIPT_PATH, 'utf8'));
describe('Florida regulatory subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_REGULATORY_SOURCES.map(source => source.code)).toEqual(['379.407(5)(b)1.', '379.407(5)(b)2.', '379.407(5)(b)3.', '483.901(7)(a)', '483.901(7)(b)', '483.901(7)(c)', '849.15(1)(a)', '849.15(1)(b)', '849.23', '849.231(1)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps the lobster caps, boundary and distinct monetary penalties tied to the right grade', () => {
    const records = new Map(rows.map(row => [row.definition.code, row.definition]));
    expect(records.get('379.407(5)(b)2.')?.text.en.degreeContext).toContain('four years and $4,000');
    const felony = records.get('379.407(5)(b)3.')!;
    expect(felony.text.en.plainSummary).toContain('100 or more');
    expect(felony.text.en.degreeContext).toContain('at least $500');
    expect(felony.text.en.degreeContext).toContain('more than 100');
    expect(records.get('483.901(7)(a)')?.text.en.plainSummary).toContain('supervised');
    expect(records.get('483.901(7)(a)')?.text.en.degreeContext).toContain('separately charged');
  });
  it('grounds the common-offender felony and the ordinary misdemeanor in their own sentences', () => {
    const sources = new Map(FLORIDA_REGULATORY_SOURCES.map(row => [row.code, row]));
    expect(sources.get('849.23')?.gradeEvidence[0].text).toMatch(/^Any person violating .*twice convicted.*felony of the third degree/);
    expect(sources.get('849.15(1)(a)')?.gradeEvidence[0].text).toMatch(/^Whoever .*misdemeanor of the second degree/);
    expect(sources.get('849.231(1)')?.gradeEvidence[0].text).toContain('misdemeanor of the first degree');
    expect(rows.find(row => row.section === '849.23')?.definition.text.en.plainSummary).toContain('new violation');
    expect(sources.has('849.19')).toBe(false);
    expect(sources.has('849.232')).toBe(false);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaRegulatoryPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaRegulatoryPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaRegulatoryReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaRegulatoryReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaRegulatoryReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
