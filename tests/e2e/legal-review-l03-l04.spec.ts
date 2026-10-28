import { expect, test } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

for (const [language, locale] of Object.entries({ en, es, zh })) {
  test(`reviewed phone/plea text reaches printed cards and unsecured bond renders: ${language}`, async ({ page }) => {
    await page.addInitScript(language => localStorage.setItem('i18nextLng', language), language);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const t = locale.translation;
    await page.goto('/quick-reference-cards');
    await page.emulateMedia({ media: 'print' });
    const print = page.getByTestId('print-all-cards');
    await expect(print).toBeVisible();
    await expect(print).toContainText(t.quickRef.police.arrested2);
    await expect(print).toContainText(t.quickRef.police.arrested4);
    await expect(print).toContainText(t.quickRef.arraignment.say1);
    await page.emulateMedia({ media: 'screen' });
    await page.goto('/case-timeline#bail-guide');
    await page.getByRole('button', { name: t.process.guides.bail.options.title, exact: true }).click();
    const options = t.process.guides.bail.options.types;
    expect(options).toHaveLength(5);
    for (const option of options) await expect(page.getByText(option.description, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: t.process.guides.bail.missCourt.title, exact: true }).click();
    await expect(page.getByText(t.process.guides.bail.missCourt.consequences[0], { exact: true })).toBeVisible();
    await page.goto('/first-24-hours#step-arraignment');
    // The displayed context cards and printed quick-reference cards must agree.
    await expect(page.getByText(t.first24Hours.steps.step6.c1, { exact: true }).first()).toBeVisible();
  });
}
test('search scenarios expose the qualifications instead of absolute warrant/unlock rules', async ({ page }) => {
  await page.goto('/rights-info');
  await page.getByTestId('tab-search').click();
  for (const name of ['Vehicle Search', 'Home Search', 'Search of Your Person', 'Phone Search']) {
    await page.getByRole('button').filter({ hasText: name }).first().click();
  }
  await expect(page.getByText(/This does not lower the probable-cause standard/)).toBeVisible();
  await expect(page.getByText(/Arrest alone does not authorize every vehicle search/)).toBeVisible();
  await expect(page.getByText(/They are not always required to show it before entry/)).toBeVisible();
  await expect(page.getByText(/In the Third Circuit, strip searches incident to arrest outside jails/)).toBeVisible();
  await expect(page.getByText(/Courts are split on when this is testimonial/)).toBeVisible();
  await expect(page.getByText(/foregone-conclusion doctrine/)).toBeVisible();
  await expect(page.getByText('Strip searches require a warrant or serious emergency', { exact: true })).toHaveCount(0);
});

test('juvenile counsel scenario distinguishes requesting a parent from a lawyer', async ({ page }) => {
  await page.goto('/right-to-counsel');
  await page.locator('#unclear-situations > button').click();
  await page.getByRole('button').filter({ hasText: "You're a juvenile being questioned" }).click();
  await expect(page.getByText(/Asking for a parent does not necessarily invoke the right to counsel/)).toBeVisible();
});
