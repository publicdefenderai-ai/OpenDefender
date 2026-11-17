import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-fire-riot-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaFireRiotPacket, FLORIDA_FIRE_RIOT_SOURCES, FLORIDA_FIRE_RIOT_RECEIPT_PATH, validateFloridaFireRiotPacket, validateFloridaFireRiotReceipt } from '../server/data/florida-fire-riot-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_FIRE_RIOT_RECEIPT_PATH, 'utf8'));
describe('Florida fire-riot subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_FIRE_RIOT_SOURCES.map(source => source.code)).toEqual(['590.28(1)', '590.28(2)', '590.10(1)', '590.11(1)', '590.25', '870.01(1)', '870.01(2)', '870.01(3)', '870.01(4)', '870.01(5)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('binds the burn authorization and suppression costs without extending the felony to reckless burning', () => {
    const defs = new Map(rows.map(row => [row.definition.code, row.definition]));
    expect(defs.get('590.28(1)')?.text.en.plainSummary).toContain('without complying with §590.125');
    expect(defs.get('590.28(2)')?.category).toBe('misdemeanor');
    expect(defs.get('590.28(2)')?.text.en.plainSummary).toContain('does not separately list land-clearing debris');
    expect(defs.get('590.11(1)')?.text.en.plainSummary).toContain('while visible flame, smoke or emissions remain');
    expect(defs.get('590.25')?.text.en.degreeContext).toContain('or $150, whichever is greater');
  });
  it('preserves personal participation, unequal dollar boundaries, and the bail exception', () => {
    const defs = new Map(rows.map(row => [row.definition.code, row.definition]));
    for (const scope of ['(2)', '(3)']) {
      const summary = defs.get('870.01'+scope)!.text;
      expect(summary.en.plainSummary).toContain('sharing an intent to help');
      expect(summary.es.plainSummary).toContain('intención común');
      expect(summary.zh.plainSummary).toContain('共同意图');
    }
    const aggravated = defs.get('870.01(3)')!.text.en.plainSummary;
    expect(aggravated).toContain('25 other people');
    expect(aggravated).toContain('more than $5,000');
    expect(defs.get('870.01(4)')?.text.en.plainSummary).toContain('imminent danger');
    expect(defs.get('870.01(5)')?.text.en.degreeContext).toContain('until brought before the court');
    expect(defs.get('870.01(1)')?.text.en.degreeContext).not.toContain('until brought before the court');
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaFireRiotPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaFireRiotPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaFireRiotReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaFireRiotReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaFireRiotReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
