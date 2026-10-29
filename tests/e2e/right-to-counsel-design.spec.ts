import { test, expect } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';
import publishedContent from '../fixtures/counsel-published-content';

const sections = ['custody-levels', 'interrogation-vs-trial', 'when-not-apply', 'unclear-situations', 'what-happens', 'quick-reference'];
for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`Counsel layout and full current article: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/right-to-counsel');
    const main = page.locator('main.counsel-page');
    await expect(main.locator('h1')).toContainText(locale.translation.counselDesign.heading);
    await expect(main.locator('h1')).toContainText(locale.translation.counselDesign.accent);
    await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
    await expect(main.locator('.counsel-comparison')).toHaveAttribute('lang', 'en');
    await expect(main.locator('.counsel-art')).toHaveAttribute('aria-hidden', 'true');
    await expect(main.locator('.counsel-art')).toHaveCSS('width', '230px');
    await page.screenshot({ path: info.outputPath('counsel-desktop.png'), fullPage: true });
    for (const id of sections) {
      const button = page.locator(`#${id}-trigger`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator(`#${id}-content`)).toBeVisible();
    }
    const scenarios = main.locator('.counsel-scenario h3 button');
    await expect(scenarios).toHaveCount(6);
    for (const button of await scenarios.all()) {
      await button.focus(); await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      const answer = await button.getAttribute('aria-controls');
      await expect(page.locator(`[id="${answer}"]`)).toBeVisible();
    }
    // Independent fixture extracted from the prior published source, not the redesigned page.
    for (const text of publishedContent) await expect(main).toContainText(text);
    await expect(main.locator('.counsel-table tbody tr')).toHaveCount(7);
    await expect(main.locator('.counsel-table thead th')).toHaveCount(3);
    for (const href of ['/rights-info','/first-24-hours','/search-seizure','/warrants','/case-guidance','/legal-aid','/data-sources']) await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
    for (const width of [1280,320]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await main.evaluate(root => [...root.querySelectorAll('h1,h2,h3,p,button,td,th,a')].filter(el => {
        const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => el.textContent));
      expect(overflow).toEqual([]);
    }
    await page.screenshot({ path: info.outputPath('counsel-mobile.png'), fullPage: true });
    await main.getByRole('combobox').click();
    await page.getByRole('option', { name: 'California', exact: true }).click();
    await expect(page.locator('#custody-levels-content')).toContainText('Rules for arraignment procedures vary significantly in California');
    await page.reload();
    await page.locator('#custody-levels-trigger').click();
    await expect(page.locator('#custody-levels-content')).toContainText('California');
    await main.getByRole('combobox').click();
    await page.getByRole('option', { name: 'All states', exact: true }).click();
    await expect(page.locator('#custody-levels-content')).not.toContainText('Rules for');
    await page.goto('/right-to-counsel#unclear-situations');
    await expect(page.locator('#unclear-situations-trigger')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#unclear-situations-trigger')).toBeFocused();
    await page.evaluate(() => { location.hash = 'quick-reference'; });
    await expect(page.locator('#quick-reference-trigger')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#quick-reference-trigger')).toBeFocused();
    await page.locator('.counsel-contents nav button[aria-controls="what-happens"]').click();
    await expect(page.locator('#what-happens-trigger')).toBeFocused();
    await expect(page.locator('#what-happens-content')).toBeVisible();
  });
}
