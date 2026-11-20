import { test, expect } from '@playwright/test';
import captured from '../fixtures/workplace-raids-published-content';
import { workplaceRaidsCopy } from '../../client/src/locales/workplace-raids-design';

for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`workplace raids content, contacts and navigation: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/immigration-guidance/workplace-raids');
    const root = page.locator('.workplace-page');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(root.getByTestId('immigration-detail-title')).toBeVisible();
    await expect(root.getByTestId('alert-workplace-critical')).toBeVisible();
    for (const text of captured[language].text) await expect(root).toContainText(text);
    for (const href of captured[language].links) await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
    await expect(root).not.toContainText('1-844-NILC-123');
    await expect(root).not.toContainText('1-800-775-2258');
    await expect(root.locator('#workplace-help')).toContainText(workplaceRaidsCopy[language].helpNote);
    for (const href of ['https://www.nilc.org/request-for-legal-assistance/', 'https://www.aclu.org/affiliates', '/immigration-guidance/find-attorney']) {
      await expect(root.locator(`a[href="${href}"]`)).toBeVisible();
    }
    if (language === 'zh') {
      await expect(root.locator('#work-authorization')).toHaveAttribute('lang', 'en');
      await expect(root).toContainText(workplaceRaidsCopy.zh.englishNotice);
    }
    const art = root.locator('.workplace-art');
    await expect(art).toHaveAttribute('aria-hidden', 'true');
    await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const nav = root.getByRole('navigation', { name: workplaceRaidsCopy[language].nav });
    await expect(nav.getByRole('link')).toHaveCount(5);
    for (const link of await nav.getByRole('link').all()) {
      const href = await link.getAttribute('href');
      await link.focus(); await page.keyboard.press('Enter');
      await expect(root.locator(href!)).toBeInViewport();
    }
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await root.locator('h1,h2,h3,p,li,a,[role="alert"]').evaluateAll(els => els
        .filter(el => el.checkVisibility()).filter(el => {
          const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1;
        }).map(el => el.textContent?.slice(0,100)))).toEqual([]);
      await page.evaluate(() => scrollTo({top:0, behavior:'instant'}));
      await page.screenshot({path: info.outputPath(`workplace-${width}.png`)});
    }
    await page.emulateMedia({media:'print'});
    await expect(art).toBeHidden();
    for (const text of captured[language].text) await expect(root).toContainText(text);
    await expect(root.locator('#work-authorization')).toBeVisible();
    await expect(root.locator('#workplace-help')).toBeVisible();
  });
}
