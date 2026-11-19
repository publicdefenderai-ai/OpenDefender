import { test, expect } from '@playwright/test';
import captured from '../fixtures/immigration-attorney-published-content';

for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
 test(`immigration-attorney preserved content and responsive layout: ${language}/${theme}`, async ({ page }, info) => {
  await page.addInitScript(({ language, theme }) => { localStorage.setItem('i18nextLng', language); localStorage.setItem('public-defender-theme', theme); }, { language, theme });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/immigration-guidance/find-attorney');
  const root = page.locator('.immigration-attorney-page');
  await expect(page.locator('main')).toHaveCount(1);
  for (const text of captured[language].text) await expect(root).toContainText(text);
  for (const href of new Set(captured[language].links)) expect(await root.locator('a[href]').evaluateAll(links => links.map(a => a.getAttribute('href')))).toContain(href);
  const art = root.locator('.immigration-attorney-art');
  await expect(art).toHaveAttribute('aria-hidden','true');
  await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(root.getByTestId('alert-scam-warning')).toBeVisible();
  await expect(root.getByTestId('button-call-nilf')).toHaveAttribute('href','tel:18003540365');
  await expect(root.getByTestId('button-call-immigrant-defense')).toHaveAttribute('href','tel:18888398682');
  const paths = root.locator('.immigration-attorney-paths');
  await paths.locator('a').first().focus(); await page.keyboard.press('Enter');
  await expect(root.locator('#affordable-help')).toBeInViewport();
  await expect(paths.locator('a').last()).toHaveAttribute('href','https://www.ailalawyer.com/');
  const nav = root.locator('nav').last();
  for (const link of await nav.getByRole('link').all()) {
   const href = await link.getAttribute('href');
   await link.focus(); await page.keyboard.press('Enter');
   await expect(root.locator(href!)).toBeInViewport();
  }
  for (const width of [1280,320]) {
   await page.setViewportSize({width,height:900});
   const overflow = await root.locator('h1,h2,p,li,button,a,input,select').evaluateAll(els => els.filter(el => el.checkVisibility()).filter(el => {const r=el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth+1;}).map(el=>el.textContent?.slice(0,100)));
   expect(overflow).toEqual([]);
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(700);
   await page.screenshot({path:info.outputPath(`immigration-attorney-${width}.png`)});
  }
 });
}
