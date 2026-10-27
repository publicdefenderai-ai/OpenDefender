import { expect, test } from '@playwright/test';
for (const language of ['en', 'es', 'zh']) {
  for (const theme of ['light', 'dark']) {
    test(`standalone urgent guides preserve dialog guidance in ${language}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('public-defender-theme', theme);
      }, { language, theme });
      for (const situation of ['arrested', 'charged', 'family']) {
        await page.goto('/');
        await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
        await page.locator('.design-urgent-button').click();
        await page.locator(`[data-situation="${situation}"]`).click();
        const dialogSteps = await page.locator('.urgent-detail ol li').allTextContents();
        const dialogLinks = await page.locator('.urgent-next a').evaluateAll(es => es.map(e => e.getAttribute('href')));
        await page.locator('.urgent-full-page').click();
        await expect(page).toHaveURL(new RegExp(`/urgent-help/${situation}$`));
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(page.locator('.urgent-guide h1')).toBeVisible();
        expect(await page.locator('.urgent-guide ol li').allTextContents()).toEqual(dialogSteps);
        expect(await page.locator('.urgent-next a').evaluateAll(es => es.map(e => e.getAttribute('href')))).toEqual(dialogLinks);
        await page.reload();
        await expect(page.locator('.urgent-guide ol li')).toHaveCount(4);
        expect(await page.locator('.urgent-guide').evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
        await expect(page.locator('.urgent-guide')).not.toContainText('design.');
        await page.locator('.urgent-guide-top a').click();
        await expect(page.locator('.urgent-choices > a')).toHaveCount(5);
      }
      await page.goto('/urgent-help/not-a-situation');
      await expect(page.locator('.urgent-guide')).toHaveCount(0);
    });
  }
}
