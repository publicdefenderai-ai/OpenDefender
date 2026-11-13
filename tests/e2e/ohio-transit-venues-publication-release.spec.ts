import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync('shared/ohio-transit-venues-publication.json', 'utf8')) as Array<{
  id: string; statutoryName: string; categories: string[]; gradeSummary: string;
}>;
test('Ohio transit and venues publication preserves statutory identity and grading alternatives in the API', async ({request}) => {
  const response = await request.get('/api/criminal-charges?jurisdiction=OH&limit=500');
  expect(response.ok()).toBe(true);
  const body = await response.json();
  const charges=[...body.charges];
  let offset=body.pagination.nextOffset;
  while(offset!==null){
    const page=await request.get('/api/criminal-charges',{params:{jurisdiction:'OH',limit:500,offset,snapshot:body.pagination.snapshot}});
    expect(page.ok()).toBe(true);
    const next=await page.json();
    expect(next.pagination.snapshot).toBe(body.pagination.snapshot);
    expect(next.pagination.offset).toBe(charges.length);
    charges.push(...next.charges);
    offset=next.pagination.nextOffset;
  }
  expect(charges).toHaveLength(body.pagination.totalMatches);
  expect(charges.some((charge: any) => charge.id === 'oh-vandalism')).toBe(false);
  expect(charges.some((charge: any) => charge.id === 'oh-insurance-fraud')).toBe(false);
  expect(charges.some((charge: any) => charge.id === 'oh-domestic-violence')).toBe(false);
  expect(charges.some((charge: any) => charge.id === 'oh-criminal-trespass')).toBe(false);
  for (const row of rows) {
    const charge = charges.find((c: any) => c.id === row.id);
    expect(charge, row.id).toBeDefined();
    expect(charge.name).toBe(row.statutoryName);
    expect(charge.categories).toEqual(row.categories);
    expect(charge.maxPenalty).toContain(row.gradeSummary);
  }
});
