import { expect, test } from '@playwright/test';
import rows from '../../shared/florida-persons-publication.json';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../../shared/florida-reviewed-batch';
test('Florida persons choices retain conditional severity while the older expired bundle stays withheld', async ({ request }) => {
    const response = await request.get('/api/criminal-charges?jurisdiction=FL&limit=500');
    expect(response.ok()).toBe(true);
    const body = await response.json();
    for (const row of rows) {
        const charge = body.charges.find((c: any) => c.id === row.id);
        expect(charge, row.id).toBeDefined();
        expect(charge.name).toBe(row.name);
        expect(charge.categories).toEqual(row.categories);
        expect(charge.maxPenalty).toContain(row.additionalPenalty);
    }
    const ids = new Set(body.charges.map((c: any) => c.id));
    for (const old of FLORIDA_REVIEWED_DEFINITIONS)
        expect(ids.has(old.id), old.id).toBe(false);
});
