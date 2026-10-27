import { expect, test } from '@playwright/test';
for (const language of ['en', 'es', 'zh']) {
  for (const theme of ['light', 'dark']) {
    test(`urgent help navigation and focus in ${language}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('public-defender-theme', theme);
      }, { language, theme });
      await page.goto('/');
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
      const trigger = page.locator('.design-urgent-button');
      await trigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.urgent-choices > *')).toHaveCount(5);
      for (const situation of ['arrested', 'charged', 'family']) {
        await dialog.locator(`[data-situation="${situation}"]`).click();
        await expect(dialog.locator('h3')).toBeFocused();
        await expect(dialog.locator('ol li')).toHaveCount(4);
        await expect(dialog.locator('.urgent-next a')).toHaveCount(2);
        expect(await dialog.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
        await dialog.locator('.urgent-back').click();
        await expect(dialog.locator(`[data-situation="${situation}"]`)).toBeFocused();
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expect(dialog.locator('.urgent-choices > *')).toHaveCount(5);
      // Close directly from a non-first detail view: Back must not mask stale focus.
      for (const closeMethod of ['escape', 'button']) {
        await dialog.locator('[data-situation="family"]').click();
        await expect(dialog.locator('h3')).toBeFocused();
        if (closeMethod === 'escape') await page.keyboard.press('Escape');
        else await dialog.getByRole('button', { name: 'Close', exact: true }).click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await expect(dialog.locator('[data-situation="arrested"]')).toBeFocused();
      }
      await dialog.locator('a[href="/first-24-hours#step-before-arrest"]').click();
      await expect(page.locator('#step-before-arrest-trigger')).toHaveAttribute('aria-expanded', 'true');
    });
  }
}
