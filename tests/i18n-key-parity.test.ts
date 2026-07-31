/**
 * i18n key parity test
 *
 * Asserts that every key present in the English locale (EN) also exists in
 * the Spanish (ES) and Chinese (ZH) locales. A missing key causes the UI to
 * render blank or fall back to the raw key string for non-English users.
 *
 * Motivating regression: the three jury-instruction keys
 *   translation.charges.juryInstruction
 *   translation.charges.juryInstructionTooltip
 *   translation.charges.juryInstructionAriaLabel
 * were previously missing from ES and ZH, producing blank UI in those locales.
 */

import { describe, it, expect } from 'vitest';
import en from '../client/src/locales/en';
import es from '../client/src/locales/es';
import zh from '../client/src/locales/zh';

type LocaleNode = { [key: string]: string | LocaleNode };

function flattenLocale(obj: LocaleNode, prefix = ''): Set<string> {
  const keys = new Set<string>();
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'string') {
      keys.add(fullKey);
    } else if (value !== null && typeof value === 'object') {
      for (const k of flattenLocale(value as LocaleNode, fullKey)) {
        keys.add(k);
      }
    }
  }
  return keys;
}

const enKeys = flattenLocale(en as unknown as LocaleNode);
const esKeys = flattenLocale(es as unknown as LocaleNode);
const zhKeys = flattenLocale(zh as unknown as LocaleNode);

const missingFromEs = [...enKeys].filter((k) => !esKeys.has(k));
const missingFromZh = [...enKeys].filter((k) => !zhKeys.has(k));

// ── Regression keys ────────────────────────────────────────────────────────
const JURY_INSTRUCTION_KEYS = [
  'translation.legalGuidance.qaFlow.caseDetails.juryInstruction',
  'translation.legalGuidance.qaFlow.caseDetails.juryInstructionTooltip',
  'translation.legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel',
];

describe('i18n key parity — EN keys must exist in ES and ZH', () => {
  // Sanity check: confirm the EN locale has a meaningful number of keys
  it('EN locale has a substantial number of keys', () => {
    expect(enKeys.size).toBeGreaterThan(50);
  });

  // Regression: jury instruction keys must be present in all three locales
  describe('jury instruction keys (regression)', () => {
    for (const key of JURY_INSTRUCTION_KEYS) {
      it(`EN contains ${key}`, () => {
        expect(enKeys.has(key), `Key "${key}" is missing from EN locale`).toBe(true);
      });

      it(`ES contains ${key}`, () => {
        expect(esKeys.has(key), `Key "${key}" is missing from ES locale`).toBe(true);
      });

      it(`ZH contains ${key}`, () => {
        expect(zhKeys.has(key), `Key "${key}" is missing from ZH locale`).toBe(true);
      });
    }
  });

  // Full parity: every EN key must exist in ES
  it('ES locale contains every key present in EN', () => {
    expect(
      missingFromEs,
      `ES locale is missing ${missingFromEs.length} key(s) from EN:\n  ${missingFromEs.join('\n  ')}`,
    ).toHaveLength(0);
  });

  // Full parity: every EN key must exist in ZH
  it('ZH locale contains every key present in EN', () => {
    expect(
      missingFromZh,
      `ZH locale is missing ${missingFromZh.length} key(s) from EN:\n  ${missingFromZh.join('\n  ')}`,
    ).toHaveLength(0);
  });
});
