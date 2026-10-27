import { expect, test } from '@playwright/test';

for (const language of ['en', 'es', 'zh']) {
  for (const theme of ['light', 'dark'] as const) {
    test(`immigration text fits at 320px in ${language}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('public-defender-theme', theme);
      }, { language, theme });
      await page.goto('/immigration-guidance');
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await page.evaluate(() => document.fonts.ready);
      // Measure actual text, not document width: overflow-x:hidden can hide clipping.
      const lines = await page.locator('.immigration-heading-line').evaluateAll(elements => elements.map(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const bounds = element.getBoundingClientRect();
        const rects = [...range.getClientRects()];
        return { fits: rects.every(rect => rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1), rows: new Set(rects.map(rect => Math.round(rect.top))).size };
      }));
      expect(lines).toHaveLength(2);
      expect(lines.every(line => line.fits)).toBe(true);
      if (language === 'en') expect(lines.every(line => line.rows === 1)).toBe(true);
      await page.locator('.immigration-phase summary').nth(1).press('Enter');
      await expect(page.locator('.immigration-phase[open]')).toHaveCount(2);
      await page.getByTestId('button-menu').click();
      const nextLanguage = language === 'en' ? 'es' : 'en';
      await page.locator('#select-language-mobile').selectOption(nextLanguage);
      await expect(page.locator('html')).toHaveAttribute('lang', nextLanguage);
    });
  }
}
