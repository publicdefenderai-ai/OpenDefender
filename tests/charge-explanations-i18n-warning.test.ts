/**
 * Task #444 — i18n tests: confirm the pending-attorney-review warning strings
 * are present in all three locale resources (en, es, zh) so the dashboard
 * renders the warning in the advocate's selected language rather than
 * silently falling back to English.
 *
 * Tests:
 *  C1  — English locale has pendingReviewWarning title and body
 *  C2  — Spanish locale has pendingReviewWarning title and body (in Spanish)
 *  C3  — Chinese locale has pendingReviewWarning title and body (in Chinese)
 *  C4  — The three warning bodies are distinct (each language has a real translation)
 *  C5  — Spanish warning does not contain English-only phrases
 *  C6  — Chinese warning uses Chinese characters
 */

import { describe, it, expect } from 'vitest';
import en from '../client/src/locales/en';
import es from '../client/src/locales/es';
import zh from '../client/src/locales/zh';

/** Navigate the dot-path and return the value, or undefined if missing */
function getKey(obj: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((cur, key) => cur?.[key], obj as any) as string | undefined;
}

const EN = en.translation as Record<string, any>;
const ES = es.translation as Record<string, any>;
const ZH = zh.translation as Record<string, any>;

describe('C — i18n locale resources: guidance.yourCharges.pendingReviewWarning', () => {

  // ── C1: English ─────────────────────────────────────────────────────────────
  it('C1: English locale has the pendingReviewWarning title and body', () => {
    const title = getKey(EN, 'guidance.yourCharges.pendingReviewWarning.title');
    const body  = getKey(EN, 'guidance.yourCharges.pendingReviewWarning.body');
    expect(title).toBeTruthy();
    expect(body).toBeTruthy();
    // Phrase unique to the English locale body
    expect(body).toContain('licensed criminal defense attorney');
  });

  // ── C2: Spanish ─────────────────────────────────────────────────────────────
  it('C2: Spanish locale has the pendingReviewWarning title and body', () => {
    const title = getKey(ES, 'guidance.yourCharges.pendingReviewWarning.title');
    const body  = getKey(ES, 'guidance.yourCharges.pendingReviewWarning.body');
    expect(title).toBeTruthy();
    expect(body).toBeTruthy();
    // Canonical Spanish phrase from the PDF labels
    expect(body).toContain('abogado defensor penal autorizado');
  });

  // ── C3: Chinese ─────────────────────────────────────────────────────────────
  it('C3: Chinese locale has the pendingReviewWarning title and body', () => {
    const title = getKey(ZH, 'guidance.yourCharges.pendingReviewWarning.title');
    const body  = getKey(ZH, 'guidance.yourCharges.pendingReviewWarning.body');
    expect(title).toBeTruthy();
    expect(body).toBeTruthy();
    // Must contain the Chinese attorney phrase
    expect(body).toContain('持牌刑事辩护律师');
  });

  // ── C4: All three bodies are distinct ────────────────────────────────────────
  it('C4: Each language has a genuinely different warning body (no shared strings)', () => {
    const enBody = getKey(EN, 'guidance.yourCharges.pendingReviewWarning.body')!;
    const esBody = getKey(ES, 'guidance.yourCharges.pendingReviewWarning.body')!;
    const zhBody = getKey(ZH, 'guidance.yourCharges.pendingReviewWarning.body')!;

    expect(enBody).not.toBe(esBody);
    expect(enBody).not.toBe(zhBody);
    expect(esBody).not.toBe(zhBody);
  });

  // ── C5: Spanish body does not contain English-only phrases ───────────────────
  it('C5: Spanish warning body does not contain the English phrase "criminal defense attorney"', () => {
    const body = getKey(ES, 'guidance.yourCharges.pendingReviewWarning.body')!;
    // The phrase "criminal defense attorney" is English; a proper Spanish
    // translation would not contain it verbatim.
    expect(body).not.toContain('criminal defense attorney');
  });

  // ── C6: Chinese body uses Chinese characters ─────────────────────────────────
  it('C6: Chinese warning body contains Chinese characters', () => {
    const body = getKey(ZH, 'guidance.yourCharges.pendingReviewWarning.body')!;
    // Matches any CJK Unified Ideograph
    expect(/[\u4e00-\u9fff]/.test(body)).toBe(true);
  });

});
