import {test,expect} from '@playwright/test';
import published from '../fixtures/developer-published';
import {developerDesignCopy} from '../../client/src/locales/developer-design';
for(const language of ['en','es','zh'] as const) for(const theme of ['light','dark']) {
 test(`Developer reference preserves full documentation: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1280,height:1000});
  await page.goto('/tech-docs');
  const root=page.locator('.developer-page');
  await expect(root).toHaveAttribute('lang','en');
  await expect(root.locator('h1')).toHaveAttribute('lang',language);
  await expect(root.locator('h1')).toContainText(developerDesignCopy[language].title1);
  if(language!=='en') await expect(root).toContainText(developerDesignCopy[language].englishNotice);
  await expect(root.locator('#developer-pages details')).toHaveCount(8);
  await expect(root.locator('#developer-features details')).toHaveCount(13);
  await expect(root.locator('tbody tr')).toHaveCount(11);
  await expect(root.locator('#developer-standards li')).toHaveCount(7);
  for(const detail of await root.locator('details').all()){
   const summary=detail.locator(':scope > summary');await summary.focus();await page.keyboard.press('Enter');
   await expect(detail).toHaveAttribute('open','');await expect(summary).toBeFocused();
  }
  // Existing prose is an independent pre-refresh capture, not imported from the rewritten component.
  // Two explicit technical-copy edits: current backend domain and intro punctuation.
  for(const text of published.text) await expect(root).toContainText(text
    .replace('https://opendefender.io','https://opendefender.net')
    .replace('platform — not a personalized guidance or advice engine.','platform. It is not a personalized guidance or advice engine.'));
  for(const href of published.links) await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  await expect(root.locator('.developer-coverage a')).toHaveAttribute('href','/data-sources');
  await expect(root.locator('.developer-coverage')).not.toContainText('7,155');
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   const clipped=await root.evaluate(root=>[...root.querySelectorAll('h1,h2,h3,p,li,td,a,code,summary')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1);}).map(el=>el.textContent));
   expect(clipped).toEqual([]);
   for(const cell of await root.locator('td').all()) await expect(cell).toHaveAttribute('data-label',/.+/);
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath(`developer-top-${width}.png`)});
   await root.locator('#developer-reuse').screenshot({path:info.outputPath(`developer-reuse-${width}.png`)});
  }
  await page.goto('/tech-docs#ai-validation');await expect(page.locator('#ai-validation')).toHaveAttribute('open','');
  await expect(page.locator('#ai-validation > summary')).toBeInViewport();
  await root.locator('.developer-nav a[href="#developer-maintenance"]').click();
  await expect(root.locator('#developer-maintenance h2')).toBeInViewport();
 });
}
