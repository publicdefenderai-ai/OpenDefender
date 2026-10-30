import { test, expect } from '@playwright/test';
// Captured from the published page at 51914041, before this layout change.
import published from '../fixtures/data-sources-published';
for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
  test(`Data Sources preserves published information: ${language}/${theme}`, async ({page}, info) => {
    await page.addInitScript(({language,theme}) => {
      localStorage.setItem('i18nextLng',language);
      localStorage.setItem('public-defender-theme',theme);
    }, {language,theme});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.setViewportSize({width:1280,height:900});
    await page.goto('/data-sources');
    const content=page.locator('.sources-page');
    await expect(content.locator('h1')).toBeVisible();
    await expect(content.locator('.sources-record')).toHaveCount(19);
    await expect(content.locator('.sources-state')).toHaveCount(8);
    await expect(content.locator('.sources-legend-item')).toHaveCount(6);
    expect(await content.locator('#inventory').evaluate(el=>Boolean(el.compareDocumentPosition(document.getElementById('state-notes')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    // Exercise each disclosure by keyboard before checking the revealed content.
    for (const detail of await content.locator('details').all()) {
      const control=detail.locator(':scope > summary');
      await control.focus(); await page.keyboard.press('Enter');
      await expect(detail).toHaveAttribute('open','');
      await expect(control).toBeFocused();
    }
    for (const text of published[language].text) await expect(content).toContainText(text);
    for (const href of published[language].links) {
      await expect(content.locator(`a[href="${href}"]`).first()).toBeVisible();
      if(href.startsWith('#')) await expect(content.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
    }
    await expect(content.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(content.locator('#report-error a')).toHaveAttribute('href','https://x.com/OpenDefenderAI');
    await expect(content.locator('#ai-guidance .sources-provider')).toBeVisible();
    for(const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      const clipped=await content.evaluate(root=>[...root.querySelectorAll('h1,h2,h3,p,dd,dt,li,a,summary')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1);}).map(el=>el.textContent));
      expect(clipped).toEqual([]);
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:info.outputPath(`sources-top-${width}.png`)});
      await content.locator('#criminal-charges').screenshot({path:info.outputPath(`source-record-${width}.png`)});
    }
    await page.goto('/data-sources#texas-charge-sources');
    await expect(page.locator('#texas-charge-sources')).toHaveAttribute('open','');
    await page.evaluate(()=>{window.location.hash='ohio-charge-sources-heading';});
    await expect(page.locator('#ohio-charge-sources')).toHaveAttribute('open','');
    await expect(page.locator('#ohio-charge-sources-heading')).toBeInViewport();
  });
}
