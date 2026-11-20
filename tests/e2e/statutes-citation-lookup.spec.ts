import { expect, test } from '@playwright/test';
import { federalStatuteLookups } from '../fixtures/federal-statute-lookups';

async function prepare(page: import('@playwright/test').Page) {
  await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
  await page.route('**/api/statutes/federal**', route => route.fulfill({ json: {
    success: true, statutes: federalStatuteLookups.map(item => ({ ...item, url: `https://www.law.cornell.edu/uscode/text/${item.code}/${item.section}`, summary: 'Lookup test fixture' })),
  } }));
  const requested: string[] = [];
  await page.route('**/api/openlaws/citation/**', async route => {
    const citation = decodeURIComponent(new URL(route.request().url()).pathname.split('/citation/')[1]);
    requested.push(citation);
    const item = federalStatuteLookups.find(item => item.citation === citation);
    if (!item) return route.fulfill({ status: 404, json: { success: false, error: 'Statute not found' } });
    await route.fulfill({ json: { success: true, statute: { citation, content: `Full text fixture ${item.code}/${item.section}` } } });
  });
  await page.goto('/statutes');
  return requested;
}
function row(page: import('@playwright/test').Page, citation: string) {
  return page.getByTestId(`card-statute-${citation.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`);
}
for (const item of federalStatuteLookups) test(`only ${item.citation} expanded`, async ({ page }) => {
  const requested = await prepare(page);
  await row(page, item.citation).getByRole('button').click();
  await expect(row(page, item.citation)).toContainText(`Full text fixture ${item.code}/${item.section}`);
  expect(requested).toEqual([item.citation]);
  await expect(page.getByRole('button', { name: 'Hide Full Text' })).toHaveCount(1);
});
test('all ten stay expanded with their own text, including after reopen', async ({ page }) => {
  const requested = await prepare(page);
  for (const item of federalStatuteLookups) await row(page, item.citation).getByRole('button').click();
  for (const item of federalStatuteLookups) {
    await expect(row(page, item.citation)).toContainText(`Full text fixture ${item.code}/${item.section}`);
    await expect(row(page, item.citation).getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  }
  expect(requested.sort()).toEqual(federalStatuteLookups.map(item => item.citation).sort());
  const wire = row(page, '18 USC § 1343');
  await wire.getByRole('button').click();
  await wire.getByRole('button').click();
  await expect(wire).toContainText('Full text fixture 18/1343');
  await expect(row(page, '18 USC § 1001')).toContainText('Full text fixture 18/1001');
});
test('service failure is not called a missing citation and does not break another card', async ({ page }) => {
  await prepare(page);
  await page.route('**/api/openlaws/citation/**1343', route => route.fulfill({ status: 503,
    json: { success: false, error: 'Statute lookup temporarily unavailable' } }));
  const wire = row(page, '18 USC § 1343');
  await wire.getByRole('button').click();
  await expect(wire).toContainText('temporarily unavailable');
  await expect(wire).not.toContainText('No statute found');
  await expect(wire.getByRole('link', { name: /official source/i }).last()).toBeVisible();
  await row(page, '18 USC § 1001').getByRole('button').click();
  await expect(row(page, '18 USC § 1001')).toContainText('Full text fixture 18/1001');
});
