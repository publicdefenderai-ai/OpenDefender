import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5000';

interface ChargeApiItem {
  id: string;
  code: string;
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

beforeAll(async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=CA`);
    if (!res.ok) {
      throw new Error(`GET /api/criminal-charges?jurisdiction=CA returned ${res.status}`);
    }
    response = (await res.json()) as ChargesApiResponse;
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

describe('GET /api/criminal-charges?jurisdiction=CA — instructionRef/instructionUrl contract', () => {
  it('returns success: true and a charges array', () => {
    if (!serverAvailable) return;
    expect(response.success).toBe(true);
    expect(Array.isArray(response.charges)).toBe(true);
    expect(response.charges.length).toBeGreaterThan(0);
  });

  it('ca-robbery-in-the-first-degree is present in the response', () => {
    if (!serverAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(
      robbery,
      'ca-robbery-in-the-first-degree missing from /api/criminal-charges?jurisdiction=CA — charge ID may have changed',
    ).toBeDefined();
  });

  it('ca-robbery-in-the-first-degree has instructionRef: "CALCRIM 1600"', () => {
    if (!serverAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionRef,
      'instructionRef missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBe('CALCRIM 1600');
  });

  it('ca-robbery-in-the-first-degree has a non-empty instructionUrl', () => {
    if (!serverAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionUrl,
      'instructionUrl missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBeTruthy();
  });

  it('ca-robbery-in-the-first-degree instructionUrl points to courts.ca.gov', () => {
    if (!serverAvailable) return;
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(robbery!.instructionUrl).toMatch(/courts\.ca\.gov/);
  });

  it('at least one CA charge in the response has both instructionRef and instructionUrl', () => {
    if (!serverAvailable) return;
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

describe('GET /api/v1/search?q=robbery&types=charge — instructionRef/instructionUrl contract', () => {
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

  it('charge-il-robbery-in-the-second-degree is present with instructionRef "IPI-CR 14.01"', () => {
    if (!serverAvailable) return;
    const ilRobbery = v1Response.results.find(
      r => r.document.id === 'charge-il-robbery-in-the-second-degree',
    );
    expect(
      ilRobbery,
      'charge-il-robbery-in-the-second-degree missing from /api/v1/search?q=robbery results — charge ID or search scoring may have changed',
    ).toBeDefined();
    expect(
      ilRobbery!.document.instructionRef,
      'instructionRef missing from IL robbery result — field dropped by search indexer or v1 serialization',
    ).toBe('IPI-CR 14.01');
  });

  it('charge-il-robbery-in-the-second-degree instructionUrl points to illinoiscourts.gov', () => {
    if (!serverAvailable) return;
    const ilRobbery = v1Response.results.find(
      r => r.document.id === 'charge-il-robbery-in-the-second-degree',
    );
    expect(ilRobbery).toBeDefined();
    expect(
      ilRobbery!.document.instructionUrl,
      'instructionUrl missing from IL robbery v1 search result',
    ).toMatch(/illinoiscourts\.gov/);
  });
});
