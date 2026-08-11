/**
 * Origin/Referer-based CSRF check for state-changing API requests.
 *
 * Pulled out as a pure function (rather than left inline in index.ts) so it's
 * unit-testable without booting the real server — see tests/csrf-check.test.ts.
 *
 * The session cookie is used for auth (it backs the guidance session-ownership
 * binding), so this is not a cookie-free JSON API and Origin/Referer checking
 * is load-bearing, not defense-in-depth on top of nothing. A request with no
 * Origin or Referer header must be rejected, not treated as same-origin — a
 * real browser always sends at least one of these on a state-changing
 * request, so a missing pair is itself the signature of a forged or
 * non-browser request.
 */

/** Extracts the `host` (hostname[:port]) from an Origin or Referer header value. */
function hostOf(headerValue: string): string | null {
  try {
    return new URL(headerValue).host;
  } catch {
    return null; // malformed header — caller treats this as no usable source
  }
}

/**
 * Returns true if a state-changing request should be blocked as
 * cross-origin. Only meaningful in production — the caller should skip this
 * check entirely outside production (matches assertProductionEnv's scoping).
 */
export function isCrossOriginRequest(params: {
  origin: string | string[] | undefined;
  referer: string | string[] | undefined;
  host: string | string[] | undefined;
}): boolean {
  const origin = Array.isArray(params.origin) ? params.origin[0] : params.origin;
  const referer = Array.isArray(params.referer) ? params.referer[0] : params.referer;
  const host = Array.isArray(params.host) ? params.host[0] : params.host;

  const sourceHeader = origin || referer;
  const sourceHost = sourceHeader ? hostOf(sourceHeader) : null;

  return !sourceHost || sourceHost !== host;
}
