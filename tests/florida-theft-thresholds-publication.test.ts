import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rows from '../shared/florida-theft-thresholds-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaTheftThresholdsPacket, FLORIDA_THEFT_THRESHOLDS_SOURCES, FLORIDA_THEFT_THRESHOLDS_RECEIPT_PATH, validateFloridaTheftThresholdsPacket, validateFloridaTheftThresholdsReceipt } from '../server/data/florida-theft-thresholds-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_THEFT_THRESHOLDS_RECEIPT_PATH, 'utf8'));
describe('Florida theft-thresholds subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_THEFT_THRESHOLDS_SOURCES.map(source => source.code)).toEqual(['812.014(2)(d)1.', '812.014(2)(d)2.', '812.014(2)(d)3.', '812.014(2)(c)5.', '812.014(2)(g)', '812.014(2)(b)4.', '812.0145(2)(a)', '812.0145(2)(b)', '812.0145(2)(c)']);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('keeps age, value, equipment and repeat-firearm conditions specific to each branch', () => {
    const choices = new Map(rows.map(row => [row.definition.code,row.definition]));
    expect(choices.get('812.014(2)(b)4.')?.text.en.plainSummary).toContain('at least $300');
    expect(choices.get('812.014(2)(b)4.')?.text.en.degreeContext).toContain('facilitate');
    expect(choices.get('812.014(2)(g)')?.text.en.plainSummary).toContain('under (2)(c)5.');
    expect(choices.get('812.014(2)(d)2.')?.text.en.plainSummary).toContain('at least $750');
    const older = choices.get('812.0145(2)(b)')!;
    expect(older.text.en.plainSummary).toContain('had reason to believe');
    expect(older.text.en.plainSummary).toContain('$10,000 to under $50,000');
    expect(older.text.en.degreeContext).toContain('exceeds $1,000');
  });
  it('resolves both sampled amphetamine thresholds to the existing charge with all three retained statutory tiers', () => {
    const id = 'fl-fs-893-135-1-f-1-trafficking-in-amphetamine';
    const charge = getChargeById(id)!;
    expect(charge.code).toBe('893.135(1)(f)1.');
    expect(charge.searchAliases).toEqual(expect.arrayContaining(['893.135(1)(f)1.a.','893.135(1)(f)1.b.','893.135(1)(f)1.c.']));
    const retained = JSON.parse(readFileSync('scripts/data-review/output/florida-trafficking-corrections.json','utf8'));
    const primary = retained.documents['893.135'];
    const checked = JSON.parse(readFileSync('scripts/data-review/florida-theft-thresholds/amphetamine-comparison.json','utf8'));
    expect(primary.contentHash).toBe(checked.contentHash);
    expect(checked.section).toBe('893.135');
    expect(checked.sourceUrl).toBe(primary.sourceUrl);
    expect(checked.edition).toBe(primary.edition);
    expect(retained.tiers[id].map((tier: {start:number,end:number,text:string,lower:number,upper:number|null,years:number,dollars:number}) => {
      expect(primary.text.slice(tier.start,tier.end)).toBe(tier.text);
      return [tier.lower,tier.upper,tier.years,tier.dollars];
    })).toEqual([[14,28,3,50000],[28,200,7,100000],[200,null,15,250000]]);
    for (const language of ['en','es','zh'] as const) {
      const explanation = getChargeExplanation(charge.name, 'FL', language, id)!;
      for (const number of ['14','28','200','50,000','100,000','250,000']) expect(explanation.degreeContext).toContain(number);
    }
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaTheftThresholdsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaTheftThresholdsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaTheftThresholdsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaTheftThresholdsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaTheftThresholdsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
