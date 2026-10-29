import { test, expect } from '@playwright/test';
import en from '../../client/src/locales/en';
import es from '../../client/src/locales/es';
import zh from '../../client/src/locales/zh';

const destinations = ['/first-24-hours', '/case-guidance', '/support', '/immigration-guidance', '/friends-family'];
for (const [language, locale] of Object.entries({ en, es, zh })) for (const theme of ['light', 'dark']) {
  test(`How-to content, paths and responsive journeys: ${language}/${theme}`, async ({ page }, info) => {
    const copy = locale.translation.howTo;
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, { language, theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/how-to');
    await expect(page.locator('.how-intro h1')).toHaveText(copy.design.title);
    await expect(page.locator('#main-content > div').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await expect(page.locator('.how-path')).toHaveCount(5);
    await expect(page.locator('.how-shot')).toHaveCount(5);
    for (let n = 1; n <= 5; n++) {
      const path = page.locator(`#path-${n}`);
      const text = copy.paths[`path${n}` as keyof typeof copy.paths];
      for (const key of ['badge', 'headline', 'subhead', 'bullet1', 'bullet2', 'bullet3', 'bullet4', 'cta'] as const) {
        await expect(path).toContainText(text[key]);
      }
      await expect(path.locator('a')).toHaveAttribute('href', destinations[n - 1]);
      await expect(path.locator('small')).toHaveText(copy.design.screenshot);
    }
    for (const [selector, text, count] of [
      ['#how-to-journey', copy.flow, 4], ['#how-to-family', copy.familyNote, 2],
    ] as const) {
      const section = page.locator(selector);
      await expect(section.locator('h2')).toHaveText(text.title);
      await expect(section).toContainText(text.subtitle);
      await expect(section.locator('li')).toHaveCount(count);
      for (let n = 1; n <= count; n++) {
        const step = (text as any)[`step${n}`];
        for (const value of Object.values(step) as string[]) await expect(section.locator('li').nth(n - 1)).toContainText(value);
      }
    }
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => scrollTo(0, 0));
      const clipping = await page.locator('.how-page').evaluate(root => [...root.querySelectorAll('h1,h2,h3,p,li,a,figure')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => el.textContent));
      expect(clipping).toEqual([]);
      const boxes = await page.locator('.how-journey').evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
      if (width === 1280) expect(boxes[0].y).toBe(boxes[1].y);
      else { expect(boxes[0].x).toBe(boxes[1].x); expect(boxes[1].y).toBeGreaterThan(boxes[0].y); }
      await page.screenshot({ path: info.outputPath(`how-to-${width}.png`), fullPage: true });
    }
    const jump = page.locator('.how-nav a').nth(4);
    await jump.focus();
    await expect(jump).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#path-5$/);
    await expect(page.locator('#path-5')).toBeInViewport();
    await page.locator('#path-5 .how-link').click();
    await expect(page).toHaveURL(/\/friends-family$/);
    await page.goto('/how-to#path-2');
    await expect(page.locator('#path-2')).toBeInViewport();
    await page.locator('.how-directory a').click();
    await expect(page).toHaveURL(/\/directory$/);
  });
}
