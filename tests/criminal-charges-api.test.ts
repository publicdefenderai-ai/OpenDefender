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

beforeAll(async () => {
  const res = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=CA`);
  if (!res.ok) {
    throw new Error(`GET /api/criminal-charges?jurisdiction=CA returned ${res.status}`);
  }
  response = (await res.json()) as ChargesApiResponse;
});

describe('GET /api/criminal-charges?jurisdiction=CA — instructionRef/instructionUrl contract', () => {
  it('returns success: true and a charges array', () => {
    expect(response.success).toBe(true);
    expect(Array.isArray(response.charges)).toBe(true);
    expect(response.charges.length).toBeGreaterThan(0);
  });

  it('ca-robbery-in-the-first-degree is present in the response', () => {
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(
      robbery,
      'ca-robbery-in-the-first-degree missing from /api/criminal-charges?jurisdiction=CA — charge ID may have changed',
    ).toBeDefined();
  });

  it('ca-robbery-in-the-first-degree has instructionRef: "CALCRIM 1600"', () => {
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionRef,
      'instructionRef missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBe('CALCRIM 1600');
  });

  it('ca-robbery-in-the-first-degree has a non-empty instructionUrl', () => {
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(
      robbery!.instructionUrl,
      'instructionUrl missing from ca-robbery-in-the-first-degree API response — field may have been renamed or dropped',
    ).toBeTruthy();
  });

  it('ca-robbery-in-the-first-degree instructionUrl points to courts.ca.gov', () => {
    const robbery = response.charges.find(c => c.id === 'ca-robbery-in-the-first-degree');
    expect(robbery).toBeDefined();
    expect(robbery!.instructionUrl).toMatch(/courts\.ca\.gov/);
  });

  it('at least one CA charge in the response has both instructionRef and instructionUrl', () => {
    const withBoth = response.charges.filter(c => c.instructionRef && c.instructionUrl);
    expect(
      withBoth.length,
      'No CA charges have both instructionRef and instructionUrl in the API response — citation overlay may be disconnected',
    ).toBeGreaterThan(0);
  });
});
