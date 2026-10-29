import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
// UI fixtures exercise configured choices without renewing production evidence.
// Keep the real endpoint check separate so stale-source withholding is still tested.
function catalogFixture() {
    return JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e',
        `const additions=[{id:'ca-prostitution-solicitation'}];
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
test('supplemented conduct remains withheld when evidence expires', async ({ request }) => {
    const fixture = catalogFixture();
    expect(fixture.charges).toHaveLength(1);
    for (const [search, id] of [['Pen. Code 647(b)', 'ca-prostitution-solicitation']]) {
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
        if (id === 'ca-prostitution-solicitation')
            expect(charge.categories).toEqual(['misdemeanor', 'felony']);
    }
});
test('the engaging title and old title find the same supplemented intake choice', async ({ page }) => {
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
    for (const search of ['Pen. Code 647(b)', 'Soliciting or Agreeing to Engage in Prostitution', 'Prostitution: Soliciting, Agreeing, or Engaging']) {
        await page.locator('#charge-search').fill(search);
        await expect(page.getByTestId('checkbox-charge-ca-prostitution-solicitation')).toBeVisible();
        await expect(page.getByText('Prostitution: Soliciting, Agreeing, or Engaging', {exact:true})).toBeVisible();
    }
    await expect(page.getByText(/For the engaging theory/)).toBeVisible();
});
