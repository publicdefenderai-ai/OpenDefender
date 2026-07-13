import { describe, it, expect } from 'vitest';
import en from '../client/src/locales/en';
import es from '../client/src/locales/es';
import zh from '../client/src/locales/zh';

type LocaleNode = { [key: string]: string | LocaleNode };

function flattenLocale(obj: LocaleNode, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (value !== null && typeof value === 'object') {
      Object.assign(result, flattenLocale(value as LocaleNode, fullKey));
    }
  }
  return result;
}

const DISCLAIMER_PATTERN =
  /disclaimer|privacyNotice|consent\.bullet|notLegalAdvice|legalNotice/i;

const MIN_RATIO = 0.20;
const MIN_EN_LENGTH = 60;

const enFlat = flattenLocale(en as unknown as LocaleNode);
const esFlat = flattenLocale(es as unknown as LocaleNode);
const zhFlat = flattenLocale(zh as unknown as LocaleNode);

const disclaimerKeys = Object.keys(enFlat).filter(
  (k) => DISCLAIMER_PATTERN.test(k) && typeof enFlat[k] === 'string',
);

describe('Locale disclaimer length ratios (EN/ES/ZH)', () => {
  it('finds at least one disclaimer-class key to check', () => {
    expect(disclaimerKeys.length).toBeGreaterThan(0);
  });

  for (const key of disclaimerKeys) {
    const enStr = enFlat[key];
    if (enStr.length <= MIN_EN_LENGTH) continue;

    it(`ES translation of "${key}" is at least ${MIN_RATIO * 100}% the length of EN`, () => {
      const esStr = esFlat[key];
      expect(esStr, `Missing ES key: ${key}`).toBeDefined();
      const ratio = esStr.length / enStr.length;
      expect(
        ratio,
        `ES "${key}" is too short (${esStr.length} chars vs EN ${enStr.length} chars, ratio ${ratio.toFixed(2)}). ` +
          `Expected at least ${MIN_RATIO}. ES value: "${esStr.slice(0, 80)}..."`,
      ).toBeGreaterThanOrEqual(MIN_RATIO);
    });

    it(`ZH translation of "${key}" is at least ${MIN_RATIO * 100}% the length of EN`, () => {
      const zhStr = zhFlat[key];
      expect(zhStr, `Missing ZH key: ${key}`).toBeDefined();
      const ratio = zhStr.length / enStr.length;
      expect(
        ratio,
        `ZH "${key}" is too short (${zhStr.length} chars vs EN ${enStr.length} chars, ratio ${ratio.toFixed(2)}). ` +
          `Expected at least ${MIN_RATIO}. ZH value: "${zhStr.slice(0, 80)}..."`,
      ).toBeGreaterThanOrEqual(MIN_RATIO);
    });
  }
});
