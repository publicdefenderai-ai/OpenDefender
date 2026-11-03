import { test, expect } from '@playwright/test';
import published from '../fixtures/directory-published';
import { directoryDesignCopy } from '../../client/src/locales/directory-design';
for(const language of ['en','es','zh'] as const) for(const theme of ['light','dark']) {
 test(`Directory preserves the library and filters: ${language}/${theme}`,async({page},info)=>{
  const baseline=published[language];const copy=directoryDesignCopy[language];
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
  await page.setViewportSize({width:1280,height:1000});await page.goto('/directory');
  const root=page.getByTestId('resource-directory');const rows=root.locator('.directory-resource');
  const total=baseline.reduce((n,c)=>n+c.resources.length,0)+2;
  await expect(rows).toHaveCount(total);await expect(root.locator('.directory-volume strong')).toHaveText(String(total));
  await expect(root.locator('.directory-categories button')).toHaveCount(baseline.length+1);
  for(const [index,cat] of baseline.entries()){
   const group=root.locator('.directory-group').nth(index);await expect(group.locator('h2')).toContainText(cat.title);await expect(group).toContainText(cat.description);
   for(const resource of cat.resources){const link=group.locator(`a[href="${resource.link}"]`);await expect(link.locator('h3')).toHaveText(resource.title);await expect(link.locator('p')).toHaveText(resource.description);}
  }
  await expect(root.locator('a[href="/bail"]')).toBeVisible();await expect(root.locator('a[href="/plea-agreements"]')).toBeVisible();
  // Each category is independently keyboard-selectable; the known cross-listing stays intact.
  for(const [index,cat] of baseline.entries()){
   const button=root.locator(`[data-category="${index}"]`);await button.focus();await page.keyboard.press('Enter');
   await expect(button).toHaveAttribute('aria-pressed','true');await expect(button).toBeFocused();
   await expect(root.locator('.directory-group')).toHaveCount(1);await expect(rows).toHaveCount(cat.resources.length+(index===1?2:0));
  }
  await root.locator('[data-category="-1"]').click();
  const query=root.getByRole('searchbox');
  const chosen=baseline[4].resources[0];await query.fill(`  ${chosen.title.toLocaleUpperCase(language)}  `);
  await expect(root.locator(`.directory-resource[href="${chosen.link}"]`)).toHaveCount(1);
  // Description-only words are searchable too; no query is put in URL or browser storage.
  await query.fill(baseline[0].resources[0].description);
  await expect(root.locator('.directory-resource[href="/case-guidance"]')).toHaveCount(1);
  const marker='directory-test-no-match-8246';await query.fill(marker);
  await expect(rows).toHaveCount(0);await expect(root.getByRole('heading',{name:copy.empty})).toBeVisible();
  expect(page.url()).not.toContain(marker);
  expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain(marker);
  await root.getByRole('button',{name:copy.reset,exact:true}).click();await expect(query).toHaveValue('');await expect(query).toBeFocused();await expect(rows).toHaveCount(total);
  await root.locator('[data-category="0"]').click();await query.fill(baseline[0].resources[0].title);await expect(rows).toHaveCount(1);
  await root.getByRole('button',{name:copy.clear,exact:true}).click();await expect(rows).toHaveCount(total);await expect(root.locator('[data-category="-1"]')).toHaveAttribute('aria-pressed','true');
  for(const width of [1280,320]) {
   await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo(0,0));
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,h3,p,button,input,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   await expect(root.locator('.directory-categories')).toBeVisible();
   expect(await rows.locator('p').evaluateAll(es=>es.every(e=>getComputedStyle(e).textOverflow!=='ellipsis'&&getComputedStyle(e).whiteSpace!=='nowrap'))).toBe(true);
   await page.screenshot({path:info.outputPath(`directory-${width}.png`)});
  }
  await query.fill('test');await page.reload();await expect(query).toHaveValue('');await expect(rows).toHaveCount(total);
 });
}
