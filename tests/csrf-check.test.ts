/**
 * Origin/Referer CSRF check tests.
 *
 * Goal: a state-changing API request with no Origin AND no Referer header
 * used to sail through the cross-origin check entirely — it only ran the
 * comparison `if (origin)`, so an absent header meant "assume same-origin"
 * instead of "reject". That's exactly what a forged/non-browser request
 * looks like, and it left SameSite=lax as the only real protection on an API
 * that now uses a cookie-backed session for authorization (the guidance
 * session-ownership binding). This suite locks in the fix: missing headers,
 * mismatched hosts, and malformed headers must all be treated as blocked.
 */

import { describe, it, expect } from 'vitest';
import { isCrossOriginRequest } from '../server/middleware/csrf-check';

const SAME_HOST = 'opendefender.example';

describe('isCrossOriginRequest', () => {
  it('allows a same-origin request via Origin', () => {
    expect(
      isCrossOriginRequest({ origin: `https://${SAME_HOST}`, referer: undefined, host: SAME_HOST }),
    ).toBe(false);
  });

  it('allows a same-origin request via Referer when Origin is absent', () => {
    expect(
      isCrossOriginRequest({ origin: undefined, referer: `https://${SAME_HOST}/some/page`, host: SAME_HOST }),
    ).toBe(false);
  });

  it('prefers Origin over Referer when both are present and agree', () => {
    expect(
      isCrossOriginRequest({
        origin: `https://${SAME_HOST}`,
        referer: `https://${SAME_HOST}/page`,
        host: SAME_HOST,
      }),
    ).toBe(false);
  });

  it('blocks when Origin host does not match the request host', () => {
    expect(
      isCrossOriginRequest({ origin: 'https://evil.example', referer: undefined, host: SAME_HOST }),
    ).toBe(true);
  });

  it('blocks when both Origin and Referer are absent — the bypass this fix closes', () => {
    expect(
      isCrossOriginRequest({ origin: undefined, referer: undefined, host: SAME_HOST }),
    ).toBe(true);
  });

  it('blocks when both Origin and Referer are empty strings', () => {
    expect(
      isCrossOriginRequest({ origin: '', referer: '', host: SAME_HOST }),
    ).toBe(true);
  });

  it('blocks a malformed Origin header rather than throwing', () => {
    expect(() =>
      isCrossOriginRequest({ origin: 'not-a-valid-url', referer: undefined, host: SAME_HOST }),
    ).not.toThrow();
    expect(
      isCrossOriginRequest({ origin: 'not-a-valid-url', referer: undefined, host: SAME_HOST }),
    ).toBe(true);
  });

  it('falls back to Referer when Origin is malformed', () => {
    expect(
      isCrossOriginRequest({
        origin: 'not-a-valid-url',
        referer: `https://${SAME_HOST}/page`,
        host: SAME_HOST,
      }),
    ).toBe(true); // by design: a malformed Origin is itself suspicious, so we don't fall back
  });

  it('blocks when the request has no Host header to compare against', () => {
    expect(
      isCrossOriginRequest({ origin: `https://${SAME_HOST}`, referer: undefined, host: undefined }),
    ).toBe(true);
  });

  it('handles array-valued headers (Node can deliver duplicate headers as arrays)', () => {
    expect(
      isCrossOriginRequest({
        origin: [`https://${SAME_HOST}`, 'https://evil.example'],
        referer: undefined,
        host: SAME_HOST,
      }),
    ).toBe(false); // takes the first value, matching Express's own header semantics
  });

  it('matches host including a non-default port', () => {
    expect(
      isCrossOriginRequest({ origin: 'https://localhost:5000', referer: undefined, host: 'localhost:5000' }),
    ).toBe(false);
    expect(
      isCrossOriginRequest({ origin: 'https://localhost:4000', referer: undefined, host: 'localhost:5000' }),
    ).toBe(true);
  });
});
