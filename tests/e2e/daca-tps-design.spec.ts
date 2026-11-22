import { test, expect } from '@playwright/test';
import captured from '../fixtures/daca-tps-published-content';
import { dacaTpsDesign } from '../../client/src/locales/daca-tps-design';
import { immigrationUpdates } from '../../client/src/locales/immigration-updates';

for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`DACA/TPS content, qualifications and navigation: ${language}/${theme}`, async ({ page }, info) => {
    await page.addInitScript(({language,theme}) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('public-defender-theme', theme);
    }, {language,theme});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/immigration-guidance/daca-tps');
    const root = page.locator('.daca-tps-page');
    const design = dacaTpsDesign[language];
    await expect(page.locator('main')).toHaveCount(1);
    await expect(root.getByRole('heading',{level:1})).toHaveText(`${design.title} ${design.accent}`);
    await expect(root.getByTestId('alert-daca-disclaimer')).toBeVisible();
    for (const text of captured[language].text) await expect(root).toContainText(text);
    for (const href of captured[language].links) await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
    for (const text of immigrationUpdates[language].framework) await expect(root.getByText(text,{exact:true})).toBeVisible();
    await expect(root.getByText(immigrationUpdates[language].currentTps,{exact:true})).toBeVisible();
    await expect(root.locator('#daca li')).toHaveCount(10);
    await expect(root.locator('#tps li')).toHaveCount(3);
    await expect(root.locator('.daca-tps-topics > div')).toHaveCount(3);
    await expect(root.getByTestId('link-uscis-daca')).toHaveAccessibleName(`${design.daca} (${design.newTab})`);
    await expect(root.getByTestId('link-uscis-tps')).toHaveAccessibleName(`${design.tps} (${design.newTab})`);
    for (const link of await root.locator('.daca-tps-reading a[target="_blank"], .daca-tps-resources a[target="_blank"]').all()) await expect(link).toHaveAccessibleName(new RegExp(design.newTab));
    const nav = root.getByRole('navigation',{name:design.nav});
    await expect(nav.getByRole('link')).toHaveCount(4);
    for (const link of await nav.getByRole('link').all()) {
      const href = await link.getAttribute('href');
      await link.focus(); await page.keyboard.press('Enter');
      await expect(root.locator(href!)).toBeInViewport();
    }
    for (const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      expect(await root.locator('h1,h2,h3,p,li,a,[role="alert"]').evaluateAll(els=>els.filter(el=>el.checkVisibility()).filter(el=>{
        const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;
      }).map(el=>el.textContent?.slice(0,100)))).toEqual([]);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:info.outputPath(`daca-tps-${width}.png`),fullPage:true});
    }
    await page.emulateMedia({media:'print'});
    for (const id of ['daca','tps','protection-expires','official-resources']) await expect(root.locator(`#${id}`)).toBeVisible();
    for (const text of captured[language].text) await expect(root).toContainText(text);
  });
}
