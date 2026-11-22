import { test, expect } from '@playwright/test';
import captured from '../fixtures/immigration-family-published-content';
import { immigrationFamilyCopy } from '../../client/src/locales/immigration-family-design';

for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`family planning content, disclosures and navigation: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/immigration-guidance/family-planning');
    const root = page.locator('.immigration-family-page');
    await expect(page.locator('main')).toHaveCount(1);
    const copy = immigrationFamilyCopy[language];
    await expect(root.getByRole('heading', { level: 1 })).toHaveText(`${copy.title} ${copy.accent}`);
    await expect(root.getByTestId('alert-family-planning')).toBeVisible();
    const art = root.locator('.immigration-family-art');
    await expect(art).toHaveAttribute('aria-hidden', 'true');
    await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const documents = root.locator('.immigration-family-document');
    await expect(documents).toHaveCount(3);
    await expect(root.locator('.immigration-family-document[open]')).toHaveCount(0);
    for (const document of await documents.all()) {
      await document.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(document).toHaveAttribute('open', '');
      await expect(document.locator('p')).toBeVisible();
    }
    await documents.nth(1).locator('summary').click();
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    await expect(root.locator('.immigration-family-document[open]')).toHaveCount(3);
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    await expect(root.locator('.immigration-family-document[open]')).toHaveCount(2);
    await documents.nth(1).locator('summary').click();
    for (const text of captured[language].text) await expect(root).toContainText(text);
    await expect(root.locator('.immigration-family-steps > li')).toHaveCount(6);
    await expect(root.locator('#generator input, #generator textarea')).toHaveCount(0);
    const nav = root.locator('nav').last();
    for (const link of await nav.getByRole('link').all()) {
      const href = await link.getAttribute('href');
      await link.focus(); await page.keyboard.press('Enter');
      await expect(root.locator(href!)).toBeInViewport();
    }
    // Section navigation must not reset a selected government form.
    const ca = root.locator('#generator').getByRole('button', { name: /^CA/ });
    await ca.click();
    await nav.locator('a[href="#fp-plan"]').click();
    await nav.locator('a[href="#generator"]').click();
    await expect(ca).toHaveAttribute('aria-pressed', 'true');
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await root.locator('h1,h2,h3,p,li,button,a,summary').evaluateAll(els =>
        els.filter(el => el.checkVisibility()).filter(el => {
          const rect = el.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1;
        }).map(el => el.textContent?.slice(0, 100)));
      expect(overflow).toEqual([]);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(700);
      await page.screenshot({ path: info.outputPath(`family-planning-${width}.png`) });
    }
  });
}
