import { expect, test } from '@playwright/test';
import rows from '../../shared/ohio-major-publication.json';
test('Ohio major publication preserves statutory identity and grading alternatives in the API', async ({request}) => {
  const response = await request.get('/api/criminal-charges?jurisdiction=OH&limit=500');
  expect(response.ok()).toBe(true);
  const body = await response.json();
  for (const row of rows) {
    const charge = body.charges.find((c: any) => c.id === row.id);
    expect(charge, row.id).toBeDefined();
    expect(charge.name).toBe(row.statutoryName);
    expect(charge.categories).toEqual(row.categories);
    expect(charge.maxPenalty).toContain(row.gradeSummary);
  }
});
