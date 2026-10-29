import { test, expect } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}
for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`standalone guides preserve content and navigation: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [kind, route, count] of [['bail', '/bail', 10], ['plea', '/plea-agreements', 5]] as const) {
      await page.setViewportSize({ width: 1280, height: 900 });
      // Old externally shared timeline URLs must still reach the actual guide.
      await page.goto(`/case-timeline#${kind}-guide`);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      const main = page.locator('main.standalone-guide');
      await expect(main.locator('h1')).toHaveText(`${locale.translation.standaloneGuides[kind].heading} ${locale.translation.standaloneGuides[kind].accent}`);
      await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
      await page.screenshot({ path: info.outputPath(`${kind}-desktop.png`), fullPage: true });
      const triggers = main.locator('.guide-disclosures button');
      await expect(triggers).toHaveCount(count);
      for (const button of await triggers.all()) {
        await button.focus();
        if (await button.getAttribute('aria-expanded') !== 'true') {
          await page.keyboard.press('Enter');
        }
        await expect(button).toHaveAttribute('aria-expanded', 'true');
        await expect(button).toBeFocused();
      }
      // All original source strings, including the five bail types and intro/source context.
      const { title: oldTitle, ...content } = locale.translation.process.guides[kind];
      for (const text of strings(content)) await expect(main).toContainText(text);
      await expect(main.locator('.guide-notice')).toContainText(locale.translation.process.alert.text);
      await expect(main.locator('.guide-legal-warning')).toContainText(locale.translation.process.legalDisclaimer.text);
      if (kind === 'plea') await expect(main.locator('.guide-questions li')).toHaveCount(locale.translation.process.guides.plea.questions.list.length);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await main.evaluate(root => [...root.querySelectorAll('h1,h2,p,li,a,button')].filter(el => {
          const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        }).map(el => el.textContent));
        expect(overflow).toEqual([]);
      }
      await page.screenshot({ path: info.outputPath(`${kind}-mobile.png`), fullPage: true });
      await expect(main.locator('.guide-close a')).toHaveAttribute('href', '/legal-aid');
      await expect(main.locator('.guide-back a')).toHaveAttribute('href', '/case-timeline');
      await expect(main.locator('.guide-related a[href="/data-sources"]')).toHaveText(locale.translation.standaloneGuides.sources);
      await expect(main).not.toContainText('standaloneGuides.');
      await expect(main).not.toContainText('disclosure.sources');
      if (kind === 'bail') {
        const state = main.locator('.guide-jurisdiction');
        await state.getByRole('combobox').click();
        await page.getByRole('option', { name: 'California', exact: true }).click();
        await expect(state).toContainText('Rules for bail and pretrial release vary significantly in California');
        await page.reload();
        await expect(state).toContainText('California');
        await state.getByRole('combobox').click();
        await page.getByRole('option', { name: 'All states', exact: true }).click();
        await expect(state).not.toContainText('Rules for');
      }
    }
  });
}

test('existing timeline anchors also forward after client navigation', async ({ page }) => {
  await page.goto('/case-timeline');
  await expect(page.locator('.timeline-intro')).toBeVisible();
  await page.evaluate(() => { location.hash = 'bail-guide'; });
  await expect(page).toHaveURL(/\/bail$/);
  await page.locator('.guide-back a').click();
  await expect(page.locator('.timeline-guide-links a[href="/bail"]')).toBeVisible();
  await page.locator('.timeline-guide-links a[href="/plea-agreements"]').click();
  await expect(page.locator('.guide-questions')).toBeVisible();
});
