import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
// UI fixtures exercise configured choices without renewing production evidence.
// Keep the real endpoint check separate so stale-source withholding is still tested.
function catalogFixture() {
    return JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e',
        `import additions from './shared/california-assault-weapon-conduct-additions.json' with {type:'json'};
   import {getChargeById} from './shared/criminal-charges.ts';
   import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from './shared/california-authority.ts';
   const charges=additions.map(a=>getChargeById(a.id));
   console.log(JSON.stringify({charges,eligibleIds:charges.filter(c=>getCaliforniaRecordEvidenceStatus(getCaliforniaCanonicalRecord(c.id),new Date())==='current').map(c=>c.id)}));`
    ], { encoding: 'utf8' })) as {
        charges: Array<{
            id: string;
        }>;
        eligibleIds: string[];
    };
}
test('assault-weapon-conduct branches expose reviewed content only while evidence is current', async ({ request }) => {
    const fixture = catalogFixture();
    expect(fixture.charges).toHaveLength(2);
    for (const [search, id] of [['Pen. Code 30600(a)', 'ca-pen-30600-a-assault-weapon'], ['PC 30600(a)', 'ca-pen-30600-a-50-bmg']]) {
        const response = await request.get('/api/criminal-charges', { params: { jurisdiction: 'CA', search, limit: 500 } });
        expect(response.ok()).toBe(true);
        const body = await response.json();
        if (!fixture.eligibleIds.includes(id)) {
            expect(body.charges.some((c: {
                id: string;
            }) => c.id === id)).toBe(false);
            continue;
        }
        const charge = body.charges.find((c: {
            id: string;
        }) => c.id === id);
        expect(charge).toBeTruthy();
        expect(charge.categories).toEqual(['felony']);
    }
});
test('configured assault-weapon-conduct citations work in the intake UI with isolated catalog fixtures', async ({ page }) => {
    const { charges } = catalogFixture();
    const snapshot = createHash('sha256').update(JSON.stringify(charges)).digest('hex');
    await page.route('**/api/criminal-charges?**', route => {
        const params = new URL(route.request().url()).searchParams;
        if (params.get('jurisdiction') !== 'CA')
            return route.continue();
        return route.fulfill({ json: { success: true, charges, count: charges.length, totalAvailable: charges.length, pagination: { offset: 0, limit: 500, totalMatches: charges.length, nextOffset: null, snapshot } } });
    });
    await page.route('**/api/ai/status', route => route.fulfill({ json: { available: true } }));
    await page.goto('/case-guidance');
    await page.getByTestId('button-start-guidance').click();
    await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();
    await page.getByRole('option', { name: 'California', exact: true }).click();
    await page.getByTestId('button-next-jurisdiction').click();
    for (const [search, id] of [['Pen. Code 30600(a)', 'ca-pen-30600-a-assault-weapon'], ['PC 30600(a)', 'ca-pen-30600-a-50-bmg']]) {
        await page.locator('#charge-search').fill(search);
        const choice = page.getByTestId('checkbox-charge-' + id);
        await expect(choice).toBeVisible();
        await choice.locator('..').click();
        await expect(choice).toBeChecked();
    }
});
