import {test,expect,type Page} from '@playwright/test';
import published from '../fixtures/attorney-catalog-published';
async function access(page:Page,enabled=true,verified=true) {
 await page.route('**/api/attorney/config',r=>r.fulfill({json:{success:true,enabled}}));
 await page.route('**/api/attorney/session',r=>r.fulfill({json:{success:true,isVerified:verified,expiresAt:new Date(Date.now()+3600_000).toISOString(),timeRemaining:3600}}));
}
for(const language of ['en','es','zh']) for(const theme of ['light','dark']) test(`catalog ${language}/${theme}`,async({page},info)=>{
 await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
 await access(page);
 const categories:string[]=[];let generations=0,ended=0;
 page.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/generate'))generations++;});
 await page.route('**/api/attorney/templates?*',r=>{const category=new URL(r.request().url()).searchParams.get('category')!;categories.push(category);return r.fulfill({json:{success:true,templates:published.templates.filter(t=>t.category===category)}});});
 await page.goto('/attorney/documents');
 const root=page.locator('.attorney-catalog');await expect(root).toBeVisible();
 await expect(page.locator('main')).toHaveCount(1);
 await expect(root.locator('a[href="/attorney"]')).toBeVisible();
 await expect(root).toContainText("Separate attorney filing drafts: these DOCX documents are not part of a defendant's Case Roadmap, chat guidance, PDF, or print plan.");
 for(const [i,category] of (['criminal','immigration'] as const).entries()) {
  const tab=root.getByRole('tab').nth(i);await tab.focus();await page.keyboard.press('Enter');
  const panel=root.getByRole('tabpanel');await expect(panel.locator('.attorney-template-stages')).toBeVisible();
  await expect(panel.locator('.attorney-template-stages')).toHaveAttribute('lang','en');
  for(const b of await panel.locator('button[aria-expanded=false]').all()) await b.click();
  const rows=published.templates.filter(t=>t.category===category);
  await expect(panel.locator('.attorney-template-row')).toHaveCount(rows.length);
  for(const row of rows) {
   const link=panel.getByRole('link',{name:`Draft ${row.name}`,exact:true});
   await expect(link).toHaveAttribute('href',`/attorney/documents/${row.id}`);
   await expect(link).toContainText(row.description);
   await expect(link).toContainText(row.estimatedCompletionTime);
   await expect(link).toContainText(row.difficultyLevel[0].toUpperCase()+row.difficultyLevel.slice(1));
  }
  for(const stage of published.stages[category]) {
   const section=panel.locator('.attorney-template-stage').filter({has:page.getByText(stage.label,{exact:true})});
   if(!stage.templateIds.some(id=>rows.some(t=>t.id===id)))continue;
   await expect(section).toContainText(stage.description);
   expect(await section.locator('.attorney-template-row').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!.split('/').pop()))).toEqual(stage.templateIds.filter(id=>rows.some(t=>t.id===id)));
  }
  const first=panel.getByRole('button').first();await first.focus();await page.keyboard.press('Enter');await expect(first).toHaveAttribute('aria-expanded','false');await page.keyboard.press('Enter');await expect(first).toHaveAttribute('aria-expanded','true');
  for(const width of [1280,320]) {
   await page.setViewportSize({width,height:900});
   expect(await root.locator('*').evaluateAll(ns=>ns.filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&(r.left< -1||r.right>innerWidth+1);}).map(n=>({tag:n.tagName,cls:n.className})))).toEqual([]);
   await info.attach(`${category}-${language}-${theme}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  }
 }
 expect(categories).toEqual(['criminal','immigration']);expect(generations).toBe(0);
 await page.route('**/api/attorney/session',async r=>{if(r.request().method()==='DELETE')ended++;await r.fulfill({json:{success:true,isVerified:false}});});
 await root.locator('button').filter({has:page.locator('svg.lucide-log-out')}).click();
 await expect(page).toHaveURL(/\/attorney$/);await expect(page.getByRole('checkbox')).toHaveCount(3);expect(ended).toBe(1);
});
test('catalog loading, failed lookup and empty results stay distinct',async({page})=>{
 await access(page);let release!:()=>void;const ready=new Promise<void>(r=>release=r);
 await page.route('**/api/attorney/templates?*',async r=>{await ready;await r.fulfill({status:503,json:{success:false,error:'Templates unavailable'}});});
 await page.goto('/attorney/documents');await expect(page.locator('.attorney-catalog [role=status]')).toContainText('Loading templates');
 release();await expect(page.locator('.attorney-catalog [role=alert]')).toHaveText('Templates unavailable');
 await expect(page.locator('.attorney-template-row')).toHaveCount(0);
 await page.route('**/api/attorney/templates?*',r=>r.fulfill({json:{success:true,templates:[]}}));
 await page.getByRole('tab').nth(1).click();await expect(page.getByRole('tabpanel')).toContainText('Additional immigration templates');
 await expect(page.locator('.attorney-catalog [role=alert]')).toHaveCount(0);
});
for(const enabled of [true,false]) test(`catalog gate enabled=${enabled}`,async({page})=>{
 await access(page,enabled,false);await page.goto('/attorney/documents');await expect(page).toHaveURL(enabled?/\/attorney\/verify$/:/\/directory$/);
 await expect(page.locator('.attorney-catalog')).toHaveCount(0);
});
