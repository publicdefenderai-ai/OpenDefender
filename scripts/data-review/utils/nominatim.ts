/**
 * OpenStreetMap / Nominatim utilities for the quarterly data review pipeline.
 *
 * Nominatim is the official OSM geocoding service — free, open source, no API key.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 *   - Max 1 request/second from the public instance
 *   - Must identify the application via User-Agent
 *   - Non-commercial use; self-hosting is an option for higher volume
 *
 * This module also provides:
 *   - scrapeWebsitePhones()  — extract US phone numbers from official consulate pages
 *   - checkWebsite()         — HTTP HEAD status check (used by all three checkers)
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// OSM policy requires a descriptive User-Agent with contact information
const USER_AGENT =
  'PublicDefenderAI-DataReview/1.0 (github.com/shahabasghar/PublicDefenderAI; quarterly-data-review; non-commercial)';

// ─── Nominatim Existence Check ─────────────────────────────────────────────────

export interface NominatimCheck {
  found: boolean;
  displayName?: string;
  lat?: string;
  lon?: string;
  /** True when the returned address contains the expected city name. */
  cityMatch?: boolean;
}

/**
 * Search Nominatim for a named location and confirm it appears near the
 * expected city. Useful for detecting whether a location has moved or
 * been removed from the map entirely.
 *
 * Coverage caveat: government facilities (detention centers, small nonprofits)
 * are often absent from OSM. Treat { found: false } as a soft signal that
 * warrants manual verification, not a confirmed closure.
 */
export async function checkWithNominatim(
  name: string,
  city: string,
  state: string,
): Promise<NominatimCheck> {
  const params = new URLSearchParams({
    q: `${name}, ${city}, ${state}, USA`,
    format: 'json',
    limit: '3',
    addressdetails: '1',
    countrycodes: 'us',
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);

  const results = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address: { state?: string; city?: string; town?: string };
  }>;

  if (!results.length) return { found: false };

  // Prefer results whose display_name or address.state contains the expected state
  const stateUpper = state.toUpperCase();
  const best =
    results.find(
      (r) =>
        r.display_name.toUpperCase().includes(stateUpper) ||
        r.address.state?.toUpperCase().includes(stateUpper),
    ) ?? results[0];

  const displayLower = best.display_name.toLowerCase();
  const cityLower = city.toLowerCase();
  const cityMatch =
    displayLower.includes(cityLower) ||
    (best.address.city ?? best.address.town ?? '').toLowerCase().includes(cityLower);

  return {
    found: true,
    displayName: best.display_name,
    lat: best.lat,
    lon: best.lon,
    cityMatch,
  };
}

// ─── Consulate Website Phone Scraper ──────────────────────────────────────────

/**
 * Matches US phone formats:
 *   (213) 351-6800  |  213-351-6800  |  213.351.6800
 *
 * Requires either parenthesized area code or consistent non-space separators
 * to avoid false matches on zip codes or other digit sequences.
 */
const US_PHONE_RE =
  /\((\d{3})\)\s*(\d{3})[-.\s](\d{4})|(?<!\d)(\d{3})[.-](\d{3})[.-](\d{4})(?!\d)/g;

function extractUsPhones(rawHtml: string): string[] {
  const text = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const found = new Set<string>();
  US_PHONE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = US_PHONE_RE.exec(text)) !== null) {
    // Groups 1-3: parenthesized format; groups 4-6: separator format
    const phone = m[1]
      ? `(${m[1]}) ${m[2]}-${m[3]}`
      : `(${m[4]}) ${m[5]}-${m[6]}`;
    found.add(phone);
  }
  return Array.from(found);
}

/**
 * Scrape a consulate or government website for US-formatted phone numbers.
 *
 * Tries the main page first, then common contact page paths. Returns an empty
 * array if no US phones are found or the site is unreachable.
 *
 * Limitation: JavaScript-rendered pages will show little or no content via
 * this fetch-based scraper. Items flagged for phone mismatch should always
 * be manually verified on the official website regardless.
 */
export async function scrapeWebsitePhones(websiteUrl: string): Promise<string[]> {
  const base = websiteUrl.replace(/\/$/, '');
  const paths = [
    '',
    '/contact',
    '/contacto',
    '/contact-us',
    '/en/contact',
    '/en/contact-us',
    '/about/contact',
  ];

  for (const path of paths) {
    try {
      const res = await fetch(base + path, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(15_000),
        redirect: 'follow',
      });
      if (!res.ok) continue;
      const html = await res.text();
      const phones = extractUsPhones(html);
      if (phones.length > 0) return phones;
    } catch {
      // Try next path
    }
  }
  return [];
}

// ─── HTTP Utility ──────────────────────────────────────────────────────────────

/** Check whether a URL is reachable. Returns status 0 on network error/timeout. */
export async function checkWebsite(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': USER_AGENT },
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────────

/**
 * Nominatim usage policy: max 1 request/second from the public instance.
 * We use 1100ms to stay comfortably within the limit.
 */
export const nominatimDelay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 1_100));

/** Polite delay between website scraping requests. */
export const scrapeDelay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 500));
