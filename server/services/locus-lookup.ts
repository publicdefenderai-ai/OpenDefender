/**
 * LOCUS Municipal Ordinance Lookup Service
 *
 * Queries the LOCUS-v1 dataset via the HuggingFace Datasets Server API to
 * retrieve local ordinance text for charge types commonly prosecuted under
 * municipal/county code rather than state statute.
 *
 * Dataset:  https://huggingface.co/datasets/LocalLaws/LOCUS-v1
 * License:  CC-BY-NC-4.0 — non-commercial use with attribution required.
 * Citation: Peskoff, Barrow, Vu, Davenport et al. (2026). arXiv:2606.19334
 *           "Freeing the Law with LOCUS: A Local Ordinance Corpus for the US"
 *
 * Attribution MUST appear wherever ordinance content is surfaced to users.
 * The inline attribution string is exported as LOCUS_ATTRIBUTION.
 */

import { devLog, errLog } from '../utils/dev-logger';

// ────────────────────────────────────────────────────────────────────────────
// Attribution (required by CC-BY-NC-4.0)
// ────────────────────────────────────────────────────────────────────────────

export const LOCUS_ATTRIBUTION =
  'LOCUS-v1 (LocalLaws / UC Berkeley, CC-BY-NC-4.0) · ' +
  'https://huggingface.co/datasets/LocalLaws/LOCUS-v1';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface HFRow {
  header: string;
  content: string;
  is_substantive: boolean;
  function: string;
  topic: string | null;
  source_jurisdiction_type: string;
  state: string;
  city: string | null;
  county: string | null;
}

interface HFSearchResponse {
  rows: Array<{ row_idx: number; row: HFRow; truncated_cells: string[] }>;
  num_rows_total: number;
  num_rows_per_page: number;
}

export interface LocusOrdinance {
  section: string;
  text: string;
  state: string;
  city: string | null;
  county: string | null;
  jurisdictionDisplay: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────────────

const HF_SEARCH_BASE = 'https://datasets-server.huggingface.co/search';
const DATASET = 'LocalLaws/LOCUS-v1';
const FETCH_TIMEOUT_MS = 8_000;  // must not materially delay the guidance request
const CACHE_TTL_MS    = 10 * 60 * 1000; // 10 minutes
const MAX_CONTENT_CHARS = 500;   // keep prompt injection concise

// ────────────────────────────────────────────────────────────────────────────
// Local-ordinance charge detection
// ────────────────────────────────────────────────────────────────────────────

const LOCAL_ORDINANCE_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /loitering/i,                      label: 'loitering' },
  { re: /criminal\s+trespass/i,            label: 'criminal trespass' },
  { re: /\btrespass(?:ing)?\b/i,           label: 'trespassing' },
  { re: /disorderly\s+conduct/i,           label: 'disorderly conduct' },
  { re: /disturbing\s+the\s+peace/i,       label: 'disturbing the peace' },
  { re: /breach\s+of\s+peace/i,            label: 'breach of peace' },
  { re: /public\s+intoxication/i,          label: 'public intoxication' },
  { re: /drunk\s+in\s+public/i,            label: 'drunk in public' },
  { re: /public\s+nuisance/i,              label: 'public nuisance' },
  { re: /noise\s+(?:ordinance|violation)/i,label: 'noise violation' },
  { re: /\bcurfew\b/i,                     label: 'curfew violation' },
  { re: /panhandling/i,                    label: 'panhandling' },
  { re: /\bvagrancy\b/i,                   label: 'vagrancy' },
  { re: /jaywalking/i,                     label: 'jaywalking' },
  { re: /\blittering\b/i,                  label: 'littering' },
  { re: /open\s+container/i,               label: 'open container' },
  { re: /failure\s+to\s+disperse/i,        label: 'failure to disperse' },
  { re: /unlawful\s+assembly/i,            label: 'unlawful assembly' },
  { re: /criminal\s+mischief/i,            label: 'criminal mischief' },
  { re: /\bvandalism\b/i,                  label: 'vandalism' },
];

/**
 * Returns the first matching local-ordinance keyword found in the charges text,
 * or null if none match.
 */
export function extractLocalOrdinanceKeyword(chargesText: string): string | null {
  for (const { re, label } of LOCAL_ORDINANCE_PATTERNS) {
    if (re.test(chargesText)) return label;
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// State name → LOCUS 2-letter lowercase code
// ────────────────────────────────────────────────────────────────────────────

const STATE_CODE_MAP: Record<string, string> = {
  alabama: 'al', alaska: 'ak', arizona: 'az', arkansas: 'ar',
  california: 'ca', colorado: 'co', connecticut: 'ct', delaware: 'de',
  florida: 'fl', georgia: 'ga', hawaii: 'hi', idaho: 'id',
  illinois: 'il', indiana: 'in', iowa: 'ia', kansas: 'ks',
  kentucky: 'ky', louisiana: 'la', maine: 'me', maryland: 'md',
  massachusetts: 'ma', michigan: 'mi', minnesota: 'mn', mississippi: 'ms',
  missouri: 'mo', montana: 'mt', nebraska: 'ne', nevada: 'nv',
  'new hampshire': 'nh', 'new jersey': 'nj', 'new mexico': 'nm', 'new york': 'ny',
  'north carolina': 'nc', 'north dakota': 'nd', ohio: 'oh', oklahoma: 'ok',
  oregon: 'or', pennsylvania: 'pa', 'rhode island': 'ri', 'south carolina': 'sc',
  'south dakota': 'sd', tennessee: 'tn', texas: 'tx', utah: 'ut',
  vermont: 'vt', virginia: 'va', washington: 'wa', 'west virginia': 'wv',
  wisconsin: 'wi', wyoming: 'wy', 'district of columbia': 'dc',
  // Accept postal codes directly (already lowercase after .toLowerCase())
  al: 'al', ak: 'ak', az: 'az', ar: 'ar', ca: 'ca', co: 'co',
  ct: 'ct', de: 'de', fl: 'fl', ga: 'ga', hi: 'hi', id: 'id',
  il: 'il', 'in': 'in', ia: 'ia', ks: 'ks', ky: 'ky', la: 'la',
  me: 'me', md: 'md', ma: 'ma', mi: 'mi', mn: 'mn', ms: 'ms',
  mo: 'mo', mt: 'mt', ne: 'ne', nv: 'nv', nh: 'nh', nj: 'nj',
  nm: 'nm', ny: 'ny', nc: 'nc', nd: 'nd', oh: 'oh', ok: 'ok',
  or: 'or', pa: 'pa', ri: 'ri', sc: 'sc', sd: 'sd', tn: 'tn',
  tx: 'tx', ut: 'ut', vt: 'vt', va: 'va', wa: 'wa', wv: 'wv',
  wi: 'wi', wy: 'wy', dc: 'dc',
};

/**
 * Converts a jurisdiction string in any common format to a LOCUS state code.
 * Returns null if the state cannot be determined.
 */
export function normalizeStateCode(jurisdiction: string): string | null {
  const lower = jurisdiction.toLowerCase().trim();
  // Full name or direct 2-letter match
  if (STATE_CODE_MAP[lower]) return STATE_CODE_MAP[lower];
  // "Texas (TX)" / "TX - Texas" / "State of Texas" patterns
  const parenMatch = lower.match(/\(([a-z]{2})\)/);
  if (parenMatch && STATE_CODE_MAP[parenMatch[1]]) return STATE_CODE_MAP[parenMatch[1]];
  // Grab first 2-letter word boundary match
  const wordMatch = lower.match(/\b([a-z]{2})\b/);
  if (wordMatch && STATE_CODE_MAP[wordMatch[1]]) return STATE_CODE_MAP[wordMatch[1]];
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// In-memory cache
// ────────────────────────────────────────────────────────────────────────────

interface CacheEntry {
  result: LocusOrdinance | null;
  ts: number;
}
const _cache = new Map<string, CacheEntry>();

function getCached(key: string): LocusOrdinance | null | undefined {
  const entry = _cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { _cache.delete(key); return undefined; }
  return entry.result;
}

function setCached(key: string, result: LocusOrdinance | null): void {
  _cache.set(key, { result, ts: Date.now() });
  // Evict entries beyond 200 to prevent unbounded growth
  if (_cache.size > 200) {
    const oldest = _cache.keys().next().value;
    if (oldest) _cache.delete(oldest);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function buildJurisdictionDisplay(row: HFRow): string {
  const stateUC = row.state.toUpperCase();
  if (row.city) {
    const city = row.city.replace(/([a-z])([A-Z])/g, '$1 $2');
    return `${city.charAt(0).toUpperCase()}${city.slice(1)}, ${stateUC}`;
  }
  if (row.county) return `${row.county} County, ${stateUC}`;
  return stateUC;
}

function cleanHeader(header: string): string {
  return header.replace(/^#+\s*/, '').trim();
}

function truncateContent(text: string): string {
  if (text.length <= MAX_CONTENT_CHARS) return text;
  return text.slice(0, MAX_CONTENT_CHARS).trimEnd() + '...';
}

// ────────────────────────────────────────────────────────────────────────────
// Core lookup
// ────────────────────────────────────────────────────────────────────────────

/**
 * Search LOCUS-v1 for ordinances matching `keyword` in `stateCode`.
 * Returns the best matching ordinance or null if none found / on error.
 */
export async function locusSearch(
  keyword: string,
  stateCode: string,
): Promise<LocusOrdinance | null> {
  const cacheKey = `${keyword}::${stateCode}`;
  const cached = getCached(cacheKey);
  if (cached !== undefined) return cached;

  const url = new URL(HF_SEARCH_BASE);
  url.searchParams.set('dataset', DATASET);
  url.searchParams.set('config', 'default');
  url.searchParams.set('split', 'train');
  url.searchParams.set('query', `${keyword} ${stateCode}`);
  url.searchParams.set('offset', '0');
  url.searchParams.set('length', '20');

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const resp = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'User-Agent': 'OpenDefender/1.0 (public-interest legal information)' },
    });
    clearTimeout(timer);

    if (!resp.ok) {
      devLog('locus', `HF Datasets API returned ${resp.status} — skipping LOCUS context`);
      setCached(cacheKey, null);
      return null;
    }

    const data: HFSearchResponse = await resp.json();

    // Filter: matching state, substantive, Rules or Enforcement function
    const matching = data.rows
      .map(r => r.row)
      .filter(r =>
        r.state === stateCode &&
        r.is_substantive === true &&
        (r.function === 'Rules' || r.function === 'Enforcement'),
      );

    if (matching.length === 0) {
      setCached(cacheKey, null);
      return null;
    }

    const best = matching[0];
    const result: LocusOrdinance = {
      section:              cleanHeader(best.header),
      text:                 truncateContent(best.content),
      state:                best.state,
      city:                 best.city,
      county:               best.county,
      jurisdictionDisplay:  buildJurisdictionDisplay(best),
    };

    devLog('locus', `Match: ${result.section} (${result.jurisdictionDisplay})`);
    setCached(cacheKey, result);
    return result;

  } catch (err: any) {
    if (err.name === 'AbortError') {
      devLog('locus', 'HF Datasets API timed out — skipping LOCUS context');
    } else {
      errLog('LOCUS lookup error', err);
    }
    setCached(cacheKey, null);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// High-level context builder (called from claude-guidance.ts)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Returns a formatted context block to inject into the Claude prompt when the
 * charges contain a local-ordinance-relevant keyword, or null otherwise.
 *
 * Always resolves — never throws. Errors are logged and produce null.
 */
export async function getLocusContext(caseDetails: {
  charges: string | string[];
  jurisdiction: string;
}): Promise<string | null> {
  try {
    const chargesText = Array.isArray(caseDetails.charges)
      ? caseDetails.charges.join(' ')
      : (caseDetails.charges || '');

    // Charge IDs use hyphen-separated format (e.g. "ca-disorderly-conduct").
    // Normalize hyphens to spaces so multi-word regex patterns match correctly.
    const normalizedText = chargesText.replace(/-/g, ' ');

    const keyword = extractLocalOrdinanceKeyword(normalizedText);
    if (!keyword) return null;

    const stateCode = normalizeStateCode(caseDetails.jurisdiction);
    if (!stateCode) return null;

    const ordinance = await locusSearch(keyword, stateCode);
    if (!ordinance) return null;

    return [
      `LOCAL ORDINANCE REFERENCE (${ordinance.jurisdictionDisplay}):`,
      `This charge type ("${keyword}") is often prosecuted under municipal or county ordinance`,
      `rather than the state statute. The following local ordinance was found:`,
      `  Section: ${ordinance.section}`,
      `  Text: "${ordinance.text}"`,
      `When relevant, acknowledge that defendants may face a local ordinance charge distinct from`,
      `the state statute, and advise confirming the exact charging document with their attorney.`,
      `Source: ${LOCUS_ATTRIBUTION}`,
    ].join('\n');
  } catch (err) {
    errLog('getLocusContext failed', err);
    return null;
  }
}
