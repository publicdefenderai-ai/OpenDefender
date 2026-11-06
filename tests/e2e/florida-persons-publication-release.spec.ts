import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const rows = JSON.parse(readFileSync('shared/florida-persons-publication.json', 'utf8'));
const olderIds = JSON.parse(readFileSync('shared/florida-reviewed-eligibility.json', 'utf8')).decisions
    .filter((row: any) => row.status === 'eligible').map((row: any) => row.id);
test('Florida persons choices retain conditional severity independently of the older bundle freshness', async ({ request }) => {
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
    // The fixture contains both families. A later legitimate renewal must restore
    // the older set; today its expired receipt must withhold it independently.
    // Use the offline validator under the repository's TS loader; Playwright's
    // native ESM loader cannot import its JSON-backed server module directly.
    const olderFresh = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--eval',
        "import {isFloridaReviewedSourceFresh} from './server/data/florida-reviewed-source-records.ts'; process.stdout.write(JSON.stringify(isFloridaReviewedSourceFresh()));",
    ], { encoding: 'utf8' }));
    for (const id of olderIds)
        expect(ids.has(id), id).toBe(olderFresh);
});
