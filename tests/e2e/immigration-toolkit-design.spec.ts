import { test, expect } from '@playwright/test';
import captured from '../fixtures/immigration-toolkit-published-content';
import { consulates } from '../../shared/data/consulates';

for (const language of ['en', 'es', 'zh'] as const) for (const theme of ['light', 'dark']) {
 test(`toolkit preserves encounters, checklist and contact printing: ${language}/${theme}`, async ({ page }, info) => {
  await page.addInitScript(({language,theme}) => {
   localStorage.setItem('i18nextLng',language); localStorage.setItem('public-defender-theme',theme);
   window.print = () => {};
  },{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/immigration-guidance/raids-toolkit');
  const root=page.locator('.immigration-toolkit-page');
  await expect(page.locator('main')).toHaveCount(1);
  for(const text of captured[language].text) await expect(root).toContainText(text);
  const hrefs=await root.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
  for(const href of captured[language].links) expect(hrefs).toContain(href);
  if(language==='zh') {
   await expect(root.getByTestId('toolkit-translation-notice')).toBeVisible();
   await expect(root.locator('#scenarios').locator('..')).toHaveAttribute('lang','en');
  }
  const art=root.locator('.immigration-toolkit-art');
  await expect(art).toHaveAttribute('aria-hidden','true');
  await expect.poll(()=>art.evaluate((el:HTMLImageElement)=>el.complete && el.naturalWidth>0)).toBe(true);
  const scenarios=root.locator('.toolkit-scenarios > button');
  await expect(scenarios).toHaveCount(4);
  await page.setViewportSize({width:320,height:900});
  for(let i=0;i<captured[language].scenarios.length;i++) {
   await scenarios.nth(i).focus();await page.keyboard.press('Enter');
   await expect(scenarios.nth(i)).toHaveAttribute('aria-pressed','true');
   const steps=root.locator('.toolkit-steps > button');
   const baseline=captured[language].scenarios[i];
   await expect(steps).toHaveCount(baseline.fragments.length);
   for(let j=0;j<baseline.fragments.length;j++) {
    await steps.nth(j).click();await expect(steps.nth(j)).toHaveAttribute('aria-pressed','true');
    for(const fragment of baseline.fragments[j]) await expect(root.locator('#scenarios')).toContainText(fragment);
    expect(await root.locator('#scenarios button,#scenarios p,#scenarios li').evaluateAll(els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(e=>e.textContent))).toEqual([]);
   }
  }
  await page.setViewportSize({width:1280,height:900});
  const checklist=root.locator('#checklist');
  await expect(checklist.getByRole('checkbox')).toHaveCount(20);
  const items=await checklist.getByRole('checkbox').locator('p').allTextContents();
  const first=checklist.getByRole('checkbox').first();
  await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
  const filters=checklist.locator('button[aria-pressed]');
  for(let i=1;i<await filters.count();i++) {
   await filters.nth(i).click();await expect(filters.nth(i)).toHaveAttribute('aria-pressed','true');
   await expect(checklist.getByRole('checkbox')).toHaveCount(5);
  }
  await filters.first().click();
  const checklistPopup=page.waitForEvent('popup');
  await checklist.getByRole('button',{name:language==='es'?'Imprimir':'Print',exact:true}).click();
  const sheet=await checklistPopup;
  await expect(sheet.locator('html')).toHaveAttribute('lang',language==='es'?'es':'en');
  await expect(sheet.locator('li')).toHaveCount(20);
  await expect(sheet.locator('.checked')).toHaveCount(1);
  for(const text of items) await expect(sheet.locator('body')).toContainText(text);
  await sheet.close();
  const card=root.locator('#emergency-card');
  await expect(card.locator('input')).toHaveCount(12);
  expect(await card.locator('input').evaluateAll(inputs=>inputs.every(el=>(el as HTMLInputElement).labels!.length>0))).toBe(true);
  const values:Record<string,string>={};
  for(const input of await card.locator('input:not(#toolkit-consulate)').all()) {
   const id=(await input.getAttribute('id'))!;
   const value=id==='toolkit-trustedPerson1-name'?'<b>Example & Family</b>':`Sample ${id}`;
   values[id]=value;await input.fill(value);
  }
  await card.locator('#toolkit-consulate').fill('Mex');
  await card.getByRole('button',{name:/^(Mexico|México)/}).click();
  const mexico=consulates.find(c=>c.country==='Mexico')!;
  const popup=page.waitForEvent('popup');
  await card.getByRole('button',{name:language==='es'?'Imprimir Tarjeta de Emergencia':'Print Emergency Card',exact:true}).click();
  const printed=await popup;
  for(const value of Object.values(values)) await expect(printed.locator('body')).toContainText(value);
  await expect(printed.locator('b,img,script')).toHaveCount(0);
  await expect(printed.locator('body')).toContainText(mexico.mainPhone);
  await expect(printed.locator('html')).toHaveAttribute('lang',language==='es'?'es':'en');
  await printed.screenshot({path:info.outputPath('emergency-card-print.png')});await printed.close();
  expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain('Sample toolkit');
  await page.reload();
  await expect(checklist.getByRole('checkbox').first()).toBeChecked();
  await expect(card.locator('#toolkit-trustedPerson1-name')).toHaveValue('');
  page.once('dialog',dialog=>dialog.dismiss());
  await checklist.getByRole('button',{name:language==='es'?'Reiniciar':'Reset',exact:true}).click();
  await expect(checklist.getByRole('checkbox').first()).toBeChecked();
  page.once('dialog',dialog=>dialog.accept());
  await checklist.getByRole('button',{name:language==='es'?'Reiniciar':'Reset',exact:true}).click();
  await expect(checklist.getByRole('checkbox').first()).not.toBeChecked();
  const nav=root.locator('nav').last();
  for(const link of await nav.getByRole('link').all()) {const href=await link.getAttribute('href');await link.focus();await page.keyboard.press('Enter');await expect(root.locator(href!)).toBeInViewport();}
  for(const width of [1280,320]) {
   await page.setViewportSize({width,height:900});
   expect(await root.locator('h1,h2,h3,p,li,a,button,input,label').evaluateAll(els=>els.filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(e=>e.textContent?.slice(0,90)))).toEqual([]);
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
   await page.screenshot({path:info.outputPath(`toolkit-${width}.png`)});
  }
 });
}
