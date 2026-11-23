import { test, expect, type Page } from '@playwright/test';
import published from '../fixtures/attorney-workspace-published-content';
async function access(page: Page, enabled=true, verified=true) {
  await page.route('**/api/attorney/config', r=>r.fulfill({json:{success:true,enabled}}));
  await page.route('**/api/attorney/session', r=>r.fulfill({json:{success:true,isVerified:verified}}));
}
for (const language of ['en','es','zh'] as const) for (const theme of ['light','dark']) {
  test(`workspace content and tools ${language}/${theme}`, async ({page}, info)=>{
    await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);}, {language,theme});
    await access(page);
    const posts: string[]=[];
    page.on('request',r=>{if(r.method()==='POST') posts.push(r.url());});
    await page.goto('/attorney');
    const root=page.locator('.attorney-workspace');
    await expect(root).toBeVisible();
    for(const text of published[language].strings) await expect(root).toContainText(text);
    for(const href of published[language].links) await expect(root.locator(`a[href="${href}"]`)).toBeVisible();
    await expect(page.locator('main')).toHaveCount(1);
    await expect(root.locator('h1')).toHaveCount(1);
    await expect(root.locator('[aria-labelledby=workspace-documentSummarizer]')).toHaveAttribute('lang','en');
    await expect(root.locator('.attorney-workspace-tool')).toHaveCount(3);
    for(const width of [1280,320]) {
      await page.setViewportSize({width,height:900});
      expect(await root.locator('*').evaluateAll(ns=>ns.filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right>innerWidth+1);}).map(n=>n.tagName))).toEqual([]);
      await info.attach(`${language}-${theme}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
    }
    await page.emulateMedia({media:'print'});
    for (const text of published[language].strings) await expect(root).toContainText(text);
    await expect(root.locator('.attorney-workspace-feature')).toBeVisible();
    await page.emulateMedia({media:'screen'});
    // The existing upload flow opens in place. Opening/closing must not submit a file or call AI.
    const launch=root.locator('button.attorney-workspace-action');
    await launch.focus();await page.keyboard.press('Enter');
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-labelledby',/.+/);
    await expect(dialog.locator('input[type=file]')).toHaveCount(0);
    await expect(dialog.getByTestId('summary-consent-continue')).toBeDisabled();
    await expect(dialog.getByRole('checkbox')).toHaveCount(1);
    await dialog.getByRole('checkbox').check();
    await dialog.getByTestId('summary-consent-continue').click();
    await expect(dialog.locator('input[type=file]')).toHaveCount(1);
    await page.keyboard.press('Escape');await expect(dialog).toBeHidden();
    await expect(launch).toBeFocused();expect(posts).toEqual([]);
    // Native links remain keyboard-operable, without invoking document generation.
    const records=root.locator('a[href="/court-records"]');await records.focus();await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/court-records$/);
  });
}
test('unverified workspace still requires attestations',async({page})=>{
 await access(page,true,false);await page.goto('/attorney');
 await expect(page.getByRole('checkbox')).toHaveCount(3);
 await expect(page.locator('.attorney-workspace')).toHaveCount(0);
});
test('disabled workspace redirects to directory',async({page})=>{
 await access(page,false);await page.goto('/attorney');await expect(page).toHaveURL(/\/directory$/);
 await expect(page.locator('.attorney-workspace')).toHaveCount(0);
});
