import { expect, type APIRequestContext } from '@playwright/test';

// Exercise every page without relaxing the exact membership/withholding checks.
export async function allChargeSearchIds(request: APIRequestContext, endpoint: string) {
  const ids = new Set<string>();
  for (let offset = 0; offset < 10000; offset += 500) {
    const response = await request.get(`${endpoint}&limit=500&offset=${offset}`);
    expect(response.ok()).toBe(true);
    const body = await response.json();
    const total = body.meta?.totalResults ?? body.totalCount;
    expect(Number.isSafeInteger(total)).toBe(true);
    for (const result of body.results) {
      const id = result.document.id.replace(/^charge-/, '');
      expect(ids.has(id), `duplicate search result ${id}`).toBe(false);
      ids.add(id);
    }
    if (ids.size === total) return ids;
    expect(body.results.length, 'pagination stopped before the reported total').toBe(500);
  }
  throw new Error('Search exceeded the bounded test inventory');
}
