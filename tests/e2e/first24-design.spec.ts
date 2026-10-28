import { expect, test } from '@playwright/test';

for (const language of ['en', 'es', 'zh']) {
  for (const theme of ['light', 'dark']) {
    test(`First24 sections, mobile state selection and deep links in ${language}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme as 'light' | 'dark' });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('public-defender-theme', theme);
      }, { language, theme });
      await page.goto('/first-24-hours');
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
      await expect(page.locator('#step-arrest-trigger')).toHaveAttribute('aria-expanded', 'true');
      await page.locator('#step-booking-trigger').click();
      await expect(page.locator('#step-arrest-trigger')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#step-booking-trigger')).toHaveAttribute('aria-expanded', 'true');
      await page.locator('.first24-mobile-contents summary').click();
      await page.locator('#mobile-state-select').selectOption('california');
      await expect(page.locator('#sidebar-state-select')).toHaveValue('california');
      await page.locator('.first24-mobile-contents button').filter({ hasText: '04' }).click();
      await expect(page.locator('#step-bail-trigger')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#step-bail-trigger')).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
      await page.goto('/first-24-hours#phone-call');
      await expect(page.locator('#phone-call-trigger')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#phone-call-content')).toBeVisible();
      await page.goto('/first-24-hours#step-before-arrest');
      await expect(page.locator('#step-before-arrest-trigger')).toHaveAttribute('aria-expanded', 'true');
      await page.goto('/first-24-hours#juvenile-note');
      await expect(page.locator('#juvenile-note > button')).toHaveAttribute('aria-expanded', 'true');
    });
  }
}
