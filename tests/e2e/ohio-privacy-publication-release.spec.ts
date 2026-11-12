import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync('shared/ohio-privacy-publication.json', 'utf8')) as Array<{
  id: string; statutoryName: string; categories: string[]; gradeSummary: string;
}>;
test('Ohio privacy publication preserves statutory identity and grading alternatives in the API', async ({request}) => {
  const response = await request.get('/api/criminal-charges?jurisdiction=OH&limit=500');
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.charges.some((charge: any) => charge.id === 'oh-vandalism')).toBe(false);
  expect(body.charges.some((charge: any) => charge.id === 'oh-insurance-fraud')).toBe(false);
  expect(body.charges.some((charge: any) => charge.id === 'oh-domestic-violence')).toBe(false);
  expect(body.charges.some((charge: any) => charge.id === 'oh-criminal-trespass')).toBe(false);
  for (const row of rows) {
    const charge = body.charges.find((c: any) => c.id === row.id);
    expect(charge, row.id).toBeDefined();
    expect(charge.name).toBe(row.statutoryName);
    expect(charge.categories).toEqual(row.categories);
    expect(charge.maxPenalty).toContain(row.gradeSummary);
  }
});
