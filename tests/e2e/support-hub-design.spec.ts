import {test,expect} from '@playwright/test';
import published from '../fixtures/support-hub-published';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark']){
 test(`Support hub content and navigation: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});await page.goto('/support');
  const root=page.locator('.support-hub');await expect(root.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  for(const text of published[language].text)await expect(root).toContainText(text);
  for(const href of published[language].links)await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  await expect(root.locator('.support-resource')).toHaveCount(13);
  await expect(root.locator('#support-partners > div').first()).toHaveAttribute('lang','en');
  await expect(root.locator('#support-partners')).toContainText('operating in 20+ states and connecting over 29,000 people with services.');
  const art=root.locator('.support-oak');await expect(art).toHaveAttribute('aria-hidden','true');
  expect(await art.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  for(const width of [1280,375,320]){
   await page.setViewportSize({width,height:1000});
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,h3,p,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   for(const id of ['support-daily','support-care','support-court']){
    const link=root.locator(`a[href="#${id}"]`);
    const box=await link.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);
    await link.focus();await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${id}$`));await expect(root.locator(`#${id} h2`)).toBeInViewport();
   }
   const impactLink=root.locator('a[href="#support-screener"]');await impactLink.click();await expect(impactLink).toHaveAttribute('aria-current','location');
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath(`support-${width}.png`),fullPage:true});
  }
 });
}

test('Phone loads no decorative tree; desktop loads the optimized image',async({page})=>{
 const images:string[]=[];page.on('request',r=>{if(r.url().includes('/images/design/support-oak'))images.push(r.url());});
 await page.setViewportSize({width:375,height:900});await page.goto('/support');await page.waitForLoadState('networkidle');
 await expect(page.locator('.support-art')).toBeHidden();expect(images).toEqual([]);
 await page.setViewportSize({width:1280,height:900});await expect(page.locator('.support-oak')).toBeVisible();
 await expect.poll(()=>page.locator('.support-oak').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(640);
 expect(images).toHaveLength(1);expect(images[0]).toContain('support-oak.webp');
});
