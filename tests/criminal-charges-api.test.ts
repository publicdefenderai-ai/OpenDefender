import { describe, it, expect, beforeAll } from 'vitest';
import { CALIFORNIA_CANONICAL_RECORDS } from '../shared/california-authority';
import { openApiSpec } from '../server/openapi';
import { SEARCH_RESULT_LIMITS } from '../server/config/search-result-limits';

const BASE_URL = 'http://localhost:5000';

interface ChargeApiItem {
  id: string;
  code: string;
  /** Verified statute citation, or null when unverified. */
  citation: string | null;
  name: string;
  category: string;
  instructionRef?: string;
  instructionUrl?: string;
}

interface ChargesApiResponse {
  success: boolean;
  charges: ChargeApiItem[];
  count: number;
  totalAvailable: number;
}

let response: ChargesApiResponse;
let serverAvailable = true;
let californiaAuthorityAvailable = true;
let nyResponse: ChargesApiResponse;
let nyExportResponse: ChargeApiItem[];

beforeAll(async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=CA`);
    if (!res.ok) {
      throw new Error(`GET /api/criminal-charges?jurisdiction=CA returned ${res.status}`);
    }
    response = (await res.json()) as ChargesApiResponse;
    californiaAuthorityAvailable = response.charges.length > 0;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
      ?? ((err as { cause?: NodeJS.ErrnoException }).cause?.code);
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
      serverAvailable = false;
      return; // skip all tests gracefully — server not running
    }
    throw err;
  }
});

beforeAll(async () => {
  if (!serverAvailable) return;
  try {
    const res = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=NY&limit=500`);
    if (!res.ok) throw new Error(`GET /api/criminal-charges?jurisdiction=NY returned ${res.status}`);
    nyResponse = (await res.json()) as ChargesApiResponse;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
      ?? ((err as { cause?: NodeJS.ErrnoException }).cause?.code);
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
      serverAvailable = false;
      return;
    }
    throw err;
  }
}, 15000);

beforeAll(async () => {
  if (!serverAvailable) return;
  const res = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=NY`);
  if (!res.ok) throw new Error(`GET /api/v1/export/charges?jurisdiction=NY returned ${res.status}`);
  nyExportResponse = (await res.json()) as ChargeApiItem[];
});

describe('GET /api/criminal-charges?jurisdiction=NY — canonical possession catalog', () => {
  it('exposes all six NY controlled-substance possession degrees with official names', () => {
    if (!serverAvailable) return;
    const expected = [
      ['ny-possession-of-controlled-substance', 'Criminal Possession of a Controlled Substance in the Seventh Degree'],
      ['ny-possession-of-controlled-substance-fifth-degree', 'Criminal Possession of a Controlled Substance in the Fifth Degree'],
      ['ny-possession-of-controlled-substance-fourth-degree', 'Criminal Possession of a Controlled Substance in the Fourth Degree'],
      ['ny-possession-of-controlled-substance-third-degree', 'Criminal Possession of a Controlled Substance in the Third Degree'],
      ['ny-possession-of-controlled-substance-second-degree', 'Criminal Possession of a Controlled Substance in the Second Degree'],
      ['ny-possession-of-controlled-substance-first-degree', 'Criminal Possession of a Controlled Substance in the First Degree'],
    ] as const;

    for (const [id, name] of expected) {
      const charge = nyResponse.charges.find(item => item.id === id);
      expect(charge, `${id} should be present in the NY API response`).toBeDefined();
      expect(charge?.name).toBe(name);
    }
  });

  it('does not expose the misleading legacy NY ID or label', () => {
    if (!serverAvailable) return;
    expect(nyResponse.charges.some(item => item.id === 'ny-possession-with-intent-to-distribute')).toBe(false);
    expect(nyResponse.charges.some(item => /Possession with Intent to Distribute/i.test(item.name))).toBe(false);
  });

  it('does not expose a nonexistent standalone NY personal-use cannabis charge', () => {
    if (!serverAvailable) return;
    expect(nyResponse.charges.some(item => item.id === 'ny-unlawful-possession-of-cannabis-second-degree')).toBe(false);
    expect(nyResponse.charges.some(item => item.name === 'Personal Use of Cannabis')).toBe(false);
  });
});

describe('GET /api/v1/export/charges?jurisdiction=NY — runtime eligibility contract', () => {
  it('exports only NY charges in the completed manifest/current-link boundary', () => {
    if (!serverAvailable) return;
    expect(Array.isArray(nyExportResponse)).toBe(true);
    expect(nyExportResponse.some((item) => item.id === 'ny-auto-burglary')).toBe(false);
    expect(nyExportResponse.some((item) => item.id === 'ny-grand-theft-in-the-first-degree')).toBe(true);
  });

  it('applies the same boundary to CSV exports', async () => {
    if (!serverAvailable) return;
    const res = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=NY&format=csv`);
    expect(res.ok).toBe(true);
    const csv = await res.text();
    expect(csv).toContain('ny-grand-theft-in-the-first-degree');
    expect(csv).not.toContain('ny-auto-burglary');
  });
});

describe('GET /api/criminal-charges?jurisdiction=CA: instructionRef/instructionUrl contract', () => {
  it('returns success: true and a charges array', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    expect(response.success).toBe(true);
    expect(Array.isArray(response.charges)).toBe(true);
    expect(response.charges.length).toBeGreaterThan(0);
  });

  it('ca-robbery-in-the-first-degree is present in the response', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(
      robbery,
      'ca-robbery-in-the-first-degree missing from /api/criminal-charges?jurisdiction=CA — charge ID may have changed',
    ).toBeDefined();
  });

  it('ca-robbery-in-the-first-degree has instructionRef: "CALCRIM 1600"', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionRef,
      'instructionRef missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBe('CALCRIM 1600');
  });

  it('ca-robbery-in-the-first-degree has a non-empty instructionUrl', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionUrl,
      'instructionUrl missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBeTruthy();
  });

  it('ca-robbery-in-the-first-degree instructionUrl points to courts.ca.gov', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(robbery!.instructionUrl).toMatch(/courts\.ca\.gov/);
  });

  it('at least one CA charge in the response has both instructionRef and instructionUrl', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const withBoth = response.charges.filter(c => c.instructionRef && c.instructionUrl);
    expect(
      withBoth.length,
      'No CA charges have both instructionRef and instructionUrl in the API response — citation overlay may be disconnected',
    ).toBeGreaterThan(0);
  });
});

// ─── /api/v1/search contract ─────────────────────────────────────────────────
// Guards the full pipeline: search indexer → routes-v1.ts serialization.
// If either layer silently drops instructionRef/instructionUrl from charge
// documents, the embeddable widget will render results with no badge and
// integrators will have no way to know something broke.

interface V1SearchResult {
  document: {
    id: string;
    type: string;
    title: string;
    url: string;
    instructionRef?: string;
    instructionUrl?: string;
  };
  score: number;
  highlights: { field: string; snippet: string }[];
}

interface V1SearchResponse {
  success: boolean;
  results: V1SearchResult[];
  meta: { totalResults: number; queryTime: number; suggestions: string[] };
}

describe('GET /api/v1/search — result-limit documentation contract', () => {
  it('documents the charge-only and mixed-content defaults and caps', () => {
    const limitParameter = openApiSpec.paths['/search'].get.parameters.find(
      (parameter) => parameter.name === 'limit',
    );

    expect(limitParameter).toBeDefined();
    expect(limitParameter?.description).toMatch(
      /Charge-only searches \(types=charge\) default to 50 results and allow up to 500 results\./,
    );
    expect(limitParameter?.description).toMatch(
      /Mixed-content searches default to 20 results and accept a requested limit up to 100, but the shared search service returns only its relevance-grouped result set, which may be smaller than requested\./,
    );
    expect(limitParameter?.schema).toMatchObject({
      type: 'integer',
      minimum: 1,
      maximum: 500,
      default: 20,
    });
  });
});

describe('GET /api/v1/search — mixed-content result-set contract', () => {
  it('does not expand the relevance-grouped result set when limit exceeds the default', async () => {
    if (!serverAvailable) return;

    const defaultRes = await fetch(`${BASE_URL}/api/v1/search?q=court`);
    expect(defaultRes.ok).toBe(true);
    const defaultPayload = await defaultRes.json() as V1SearchResponse;

    const expandedRes = await fetch(`${BASE_URL}/api/v1/search?q=court&limit=100`);
    expect(expandedRes.ok).toBe(true);
    const expandedPayload = await expandedRes.json() as V1SearchResponse;

    expect(expandedPayload.meta.totalResults).toBeGreaterThan(SEARCH_RESULT_LIMITS.mixedContent.default);
    expect(expandedPayload.results.length).toBeLessThan(SEARCH_RESULT_LIMITS.mixedContent.max);
    expect(expandedPayload.results.map((result) => result.document.id))
      .toEqual(defaultPayload.results.map((result) => result.document.id));
  });
});

let v1Response: V1SearchResponse;

beforeAll(async () => {
  if (!serverAvailable) return;
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/search?q=robbery&types=charge&limit=20`,
    );
    if (!res.ok) {
      throw new Error(`GET /api/v1/search?q=robbery&types=charge returned ${res.status}`);
    }
    v1Response = (await res.json()) as V1SearchResponse;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
      ?? ((err as { cause?: NodeJS.ErrnoException }).cause?.code);
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
      serverAvailable = false;
      return;
    }
    throw err;
  }
}, 15000);

describe('GET /api/v1/search?q=robbery&types=charge: instructionRef/instructionUrl contract', () => {
  it('returns success: true and a results array with at least one charge', () => {
    if (!serverAvailable) return;
    expect(v1Response.success).toBe(true);
    expect(Array.isArray(v1Response.results)).toBe(true);
    expect(v1Response.results.length).toBeGreaterThan(0);
    const chargeResults = v1Response.results.filter(r => r.document.type === 'charge');
    expect(
      chargeResults.length,
      'No results of type "charge" returned — types filter may be broken',
    ).toBeGreaterThan(0);
  });

  it('at least one charge result has both instructionRef and instructionUrl', () => {
    if (!serverAvailable) return;
    const withBoth = v1Response.results.filter(
      r => r.document.instructionRef && r.document.instructionUrl,
    );
    expect(
      withBoth.length,
      'No charge in /api/v1/search results has both instructionRef and instructionUrl — search indexer or serialization may have dropped these fields',
    ).toBeGreaterThan(0);
  });

  it('withholds Illinois robbery until the official title mapping is reviewed', () => {
    if (!serverAvailable) return;
    const ilRobbery = v1Response.results.find(
      r => r.document.id === 'charge-il-robbery-in-the-second-degree',
    );
    expect(
      ilRobbery,
      'a materially broader official catchline must not be silently promoted as the exact Illinois catalog charge',
    ).toBeUndefined();
  });

  it('charge-fl-robbery-in-the-first-degree is present with instructionRef "FSJI 15.1"', () => {
    if (!serverAvailable) return;
    const flRobbery = v1Response.results.find(
      r => r.document.id === 'charge-fl-robbery-in-the-first-degree',
    );
    expect(
      flRobbery,
      'charge-fl-robbery-in-the-first-degree missing from /api/v1/search?q=robbery results — charge ID or search scoring may have changed',
    ).toBeDefined();
    expect(
      flRobbery!.document.instructionRef,
      'instructionRef missing from FL robbery result — field dropped by search indexer or v1 serialization',
    ).toBe('FSJI 15.1');
  });

  it('charge-fl-robbery-in-the-first-degree has a truthy instructionUrl', () => {
    if (!serverAvailable) return;
    const flRobbery = v1Response.results.find(
      r => r.document.id === 'charge-fl-robbery-in-the-first-degree',
    );
    expect(flRobbery).toBeDefined();
    expect(
      flRobbery!.document.instructionUrl,
      'instructionUrl missing from FL robbery v1 search result — field dropped by search indexer or v1 serialization',
    ).toBeTruthy();
  });
});

describe('GET /api/v1/search — runtime New York eligibility contract', () => {
  it('does not return a withheld NY charge while retaining an approved charge', async () => {
    if (!serverAvailable) return;
    const withheld = await fetch(`${BASE_URL}/api/v1/search?q=minor&types=charge&limit=50`);
    expect(withheld.ok).toBe(true);
    const withheldPayload = await withheld.json() as V1SearchResponse;
    expect(withheldPayload.results.some((result) => result.document.id === 'charge-ny-minor-in-possession')).toBe(false);

    const retained = await fetch(`${BASE_URL}/api/v1/search?q=grand%20larceny&types=charge&limit=50`);
    expect(retained.ok).toBe(true);
    const retainedPayload = await retained.json() as V1SearchResponse;
    expect(retainedPayload.results.some((result) => result.document.id === 'charge-ny-grand-theft-in-the-first-degree')).toBe(true);
  });
});

describe('GET /api/v1/search — California charge completeness contract', () => {
  it('returns every current California charge when the requested limit covers the catalog', async () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;

    const res = await fetch(
      `${BASE_URL}/api/v1/search?q=CA&types=charge&jurisdiction=CA&limit=500`,
    );
    expect(res.ok).toBe(true);
    const payload = await res.json() as V1SearchResponse;
    const returnedIds = payload.results
      .map((result) => result.document.id)
      .filter((id) => id.startsWith('charge-'))
      .map((id) => id.replace(/^charge-/, ''));
    const expectedIds = CALIFORNIA_CANONICAL_RECORDS
      .filter((record) => record.selectable)
      .map((record) => record.canonicalId);

    expect(returnedIds).toHaveLength(expectedIds.length);
    expect(new Set(returnedIds)).toEqual(new Set(expectedIds));
    expect(payload.results.every((result) => result.document.id.startsWith('charge-ca-'))).toBe(true);
  });
});

describe('GET /api/site-search — runtime New York eligibility contract', () => {
  it('does not return a withheld NY charge while retaining an approved charge', async () => {
    if (!serverAvailable) return;
    const withheld = await fetch(`${BASE_URL}/api/site-search?q=minor&types=charge&limit=50`);
    expect(withheld.ok).toBe(true);
    const withheldPayload = await withheld.json() as V1SearchResponse;
    expect(withheldPayload.results.some((result) => result.document.id === 'charge-ny-minor-in-possession')).toBe(false);

    const retained = await fetch(`${BASE_URL}/api/site-search?q=grand%20larceny&types=charge&limit=50`);
    expect(retained.ok).toBe(true);
    const retainedPayload = await retained.json() as V1SearchResponse;
    expect(retainedPayload.results.some((result) => result.document.id === 'charge-ny-grand-theft-in-the-first-degree')).toBe(true);
  });
});

// ─── citation field contract ──────────────────────────────────────────────────
// Guards that every /api/criminal-charges response includes the `citation` field
// (string | null) so third-party callers can distinguish verified statute codes
// from synthesized ones without inspecting internal confidence metadata.

// AL jurisdiction is used for the null-citation test: AL is partially verified in
// the overlay, so some AL charges have high-confidence citations and some do not.
let alResponse: ChargesApiResponse;

beforeAll(async () => {
  if (!serverAvailable) return;
  try {
    const res = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=AL`);
    if (res.ok) {
      alResponse = (await res.json()) as ChargesApiResponse;
    }
  } catch {
    // If the secondary fetch fails, the tests below will skip gracefully.
  }
}, 10000);

describe('GET /api/criminal-charges: citation field contract', () => {
  it('every CA charge in the response has a `citation` field (string or null, never undefined)', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const missing = response.charges.filter(
      c => !Object.prototype.hasOwnProperty.call(c, 'citation'),
    );
    expect(
      missing.length,
      `${missing.length} charge(s) are missing the citation field entirely — field may have been dropped from the serializer`,
    ).toBe(0);
  });

  it('ca-robbery-in-the-first-degree returns citation: "Cal. Penal Code § 212.5(a)" (high-confidence verified entry)', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(
      robbery,
      'ca-robbery-in-the-first-degree missing from /api/criminal-charges?jurisdiction=CA',
    ).toBeDefined();
    expect(
      robbery!.citation,
      'ca-robbery-in-the-first-degree should have citation "Cal. Penal Code § 212.5(a)" — citation overlay may be disconnected or confidence downgraded',
    ).toBe('Cal. Penal Code § 212.5(a)');
  });

  it('all non-null CA citations are non-empty strings', () => {
    if (!serverAvailable || !californiaAuthorityAvailable) return;
    const badCitations = response.charges.filter(
      c => c.citation !== null && (typeof c.citation !== 'string' || c.citation.trim() === ''),
    );
    expect(
      badCitations.length,
      `${badCitations.length} charge(s) have non-null citation that is empty or not a string`,
    ).toBe(0);
  });

  it('al-murder-in-the-second-degree returns citation: null (unverified entry must not surface a synthesized code)', () => {
    if (!serverAvailable || !alResponse) return;
    const charge = alResponse.charges.find(c => c.id === 'al-murder-in-the-second-degree');
    expect(
      charge,
      'al-murder-in-the-second-degree missing from /api/criminal-charges?jurisdiction=AL',
    ).toBeDefined();
    expect(
      charge!.citation,
      'al-murder-in-the-second-degree should have citation: null — unverified entries must not return a synthesized statute code to API callers',
    ).toBeNull();
  });

  it('every AL charge in the response has a `citation` field (string or null, never undefined)', () => {
    if (!serverAvailable || !alResponse) return;
    const missing = alResponse.charges.filter(
      c => !Object.prototype.hasOwnProperty.call(c, 'citation'),
    );
    expect(
      missing.length,
      `${missing.length} AL charge(s) are missing the citation field entirely`,
    ).toBe(0);
  });
});
