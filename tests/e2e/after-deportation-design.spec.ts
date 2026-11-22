import { test, expect } from '@playwright/test';
import captured from '../fixtures/after-deportation-published-content';
import { afterDeportationDesign } from '../../client/src/locales/after-deportation-design';
for (const language of ['en','es','zh'] as const) for (const theme of ['light','dark']) {
  test(`after deportation content, navigation and printing: ${language}/${theme}`, async ({page},info) => {
    await page.addInitScript(({language,theme})=>{
      localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);
    },{language,theme});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/immigration-guidance/after-deportation');
    const root=page.locator('.after-deportation-page');
    await expect(page.locator('main')).toHaveCount(1);
    const faqs=root.locator('.after-deportation-faq');
    await expect(faqs).toHaveCount(7);
    for(const faq of await faqs.all()) {
      await faq.locator('summary').focus();await page.keyboard.press('Enter');await expect(faq.locator('p')).toBeVisible();
    }
    for(const text of [...captured[language].text,...captured[language].faq]) await expect(root).toContainText(text);
    for(const href of captured[language].links) await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
    const orgs=root.locator('.after-deportation-organizations a');await expect(orgs).toHaveCount(8);
    for(const link of await orgs.all()) await expect(link).toHaveAccessibleName(new RegExp(afterDeportationDesign[language].newTab));
    const art=root.locator('.after-deportation-art');
    await expect(art).toHaveAttribute('aria-hidden','true');
    await expect.poll(()=>art.evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true);
    const ids=['overview','if-deported','first-72','grew-up-in-us','documents','money','family-in-us','contact','financial','children','legal-next','organizations','faq'];
    for(const id of ids) {await expect(root.locator(`#${id}`)).toHaveCount(1);await expect(root.locator(`#${id}`)).toHaveAttribute('tabindex','-1');}
    for(const link of await root.locator('nav a[href^="#"], .after-deportation-paths a').all()) {
      const href=await link.getAttribute('href');await link.focus();await page.keyboard.press('Enter');
      await expect(root.locator(href!)).toBeInViewport();
    }
    // Print opens only closed answers and restores the reader's choices.
    for(const faq of await faqs.all()) await faq.locator('summary').click();
    await faqs.first().locator('summary').click();
    await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
    await expect(root.locator('.after-deportation-faq[open]')).toHaveCount(7);
    await page.emulateMedia({media:'print'});await expect(art).toBeHidden();
    for(const text of captured[language].faq) await expect(root.getByText(text,{exact:true})).toBeVisible();
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await expect(root.locator('.after-deportation-faq[open]')).toHaveCount(1);
    await page.emulateMedia({media:'screen'});
    for(const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      expect(await root.locator('h1,h2,h3,h4,p,li,a,summary').evaluateAll(els=>els.filter(el=>el.checkVisibility()).filter(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;}).map(el=>el.textContent?.slice(0,100)))).toEqual([]);
      await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();scrollTo({top:0,behavior:'instant'});});
      await page.screenshot({path:info.outputPath(`after-deportation-${width}.png`),fullPage:true});
    }
    await page.goto('/immigration-guidance/after-deportation#legal-next');
    await expect(root.locator('#legal-next')).toBeInViewport();
  });
}
