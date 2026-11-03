import {test,expect} from '@playwright/test';
import published from '../fixtures/friends-family-published';
for(const language of ['en','es','zh'] as const) for(const theme of ['light','dark']) {
 test(`Friends and Family preserves guidance: ${language}/${theme}`, async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1280,height:1000});
  await page.goto('/friends-family');
  const root=page.locator('.family-page');await expect(root.locator('h1')).toBeVisible();
  await expect(root.locator('.family-step')).toHaveCount(5);
  await expect(root.locator('#ff-step-1 details')).toHaveAttribute('open','');
  await expect(root.locator('details[open]')).toHaveCount(1);
  for(const detail of await root.locator('details').all()){
   const summary=detail.locator(':scope > summary');await summary.focus();await page.keyboard.press('Enter');
   if(await detail.getAttribute('open')===null) await page.keyboard.press('Enter');
   await expect(detail).toHaveAttribute('open','');await expect(summary).toBeFocused();
  }
  for(const text of published[language].text) await expect(root).toContainText(text);
  for(const href of published[language].links) await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  await expect(root.locator('.family-privacy')).toContainText(published[language].privacy!);
  await expect(root.locator('.family-art')).toHaveAttribute('aria-hidden','true');
  expect(await root.locator('.family-art').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(root.locator('#ff-warnings [role="alert"]')).toHaveCount(3);
  await root.locator('.family-links a[href="#ff-actions"]').click();await expect(root.locator('#ff-actions h2')).toBeInViewport();
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   const clipped=await root.evaluate(root=>[...root.querySelectorAll('h1,h2,h3,h4,p,li,a,summary')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1);}).map(el=>el.textContent));
   expect(clipped).toEqual([]);
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath(`family-top-${width}.png`)});
  }
  await root.locator('.family-nav a[href="#ff-tracking"]').click();await expect(root.locator('#ff-tracking h2')).toBeInViewport();
  await page.goto('/friends-family#ff-step-3');await expect(root.locator('#ff-step-3 h3')).toBeInViewport();await expect(root.locator('#ff-step-3 details')).toHaveAttribute('open','');
 });
}
