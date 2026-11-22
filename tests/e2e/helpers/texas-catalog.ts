import { expect, type APIRequestContext } from "@playwright/test";

// Read every snapshot-bound page; reject incomplete, duplicate or drifting results.
export async function allTexasCharges(request: APIRequestContext) {
  const charges: any[] = [];
  let offset = 0, snapshot: string | undefined, total: number | undefined;
  for (let page = 0; page < 20; page++) {
    const response = await request.get(`/api/criminal-charges?jurisdiction=TX&limit=500&offset=${offset}${snapshot ? `&snapshot=${snapshot}` : ""}`);
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.pagination.offset).toBe(offset);
    expect(body.pagination.snapshot).toMatch(/^[a-f0-9]{64}$/);
    expect(Number.isInteger(body.pagination.totalMatches)).toBe(true);
    expect(body.pagination.totalMatches).toBeGreaterThanOrEqual(0);
    if (snapshot) expect(body.pagination.snapshot).toBe(snapshot);
    if (total !== undefined) expect(body.pagination.totalMatches).toBe(total);
    snapshot = body.pagination.snapshot; total = body.pagination.totalMatches;
    charges.push(...body.charges);
    expect(new Set(charges.map(c => c.id)).size).toBe(charges.length);
    if (body.pagination.nextOffset === null) {
      expect(charges.length).toBe(total);
      return charges;
    }
    expect(body.pagination.nextOffset).toBe(charges.length);
    expect(body.pagination.nextOffset).toBeGreaterThan(offset);
    offset = body.pagination.nextOffset;
  }
  throw new Error("Texas catalog did not finish within the page bound");
}
