import { test, expect } from '@playwright/test';
import captured from '../fixtures/immigration-locator-published-content';
import { detentionFacilities } from '../../shared/data/detention-facilities';
for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
 test(`immigration-locator preserved content and responsive layout: ${language}/${theme}`, async ({ page }, info) => {
  await page.addInitScript(({ language, theme }) => { localStorage.setItem('i18nextLng', language); localStorage.setItem('public-defender-theme', theme); }, { language, theme });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/immigration-guidance/find-detained');
  const root = page.locator('.immigration-locator-page');
  await expect(page.locator('main')).toHaveCount(1);
  for (const text of captured[language].text) await expect(root).toContainText(text);
  for (const href of new Set(captured[language].links)) expect(await root.locator('a[href]').evaluateAll(links => links.map(a => a.getAttribute('href')))).toContain(href);
  const art = root.locator('.immigration-locator-art');
  await expect(art).toHaveAttribute('aria-hidden','true');
  await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(root.locator('.immigration-locator-reading')).toHaveAttribute('lang',language === 'es' ? 'es' : 'en');
  await expect(root.locator('.immigration-locator-action')).toHaveAttribute('href','https://locator.ice.gov/odls/');
  const directory=root.locator('#facility-directory');
  const facility=detentionFacilities[0];
  await directory.getByRole('textbox').fill(facility.name);
  const toggle=directory.getByRole('button',{name:new RegExp(facility.name)});
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(directory).toContainText(facility.address);
  await expect(directory).toContainText(facility.phone);
  await directory.getByRole('textbox').fill('zzzz-no-matching-facility');
  await expect(directory.getByRole('button',{name:new RegExp(facility.name)})).toHaveCount(0);
  await directory.getByRole('group').getByRole('button',{name:language === 'es' ? 'Filtrar por CA' : 'Filter by CA',exact:true}).click();
  await expect(directory.getByRole('textbox')).toHaveValue('');
  for (const f of detentionFacilities.filter(f=>f.state==='CA')) await expect(directory.getByText(f.name,{exact:true})).toBeVisible();
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
   await page.screenshot({path:info.outputPath(`immigration-locator-${width}.png`)});
  }
 });
}
