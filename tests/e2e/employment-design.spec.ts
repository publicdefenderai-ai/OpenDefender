import {test,expect} from '@playwright/test';
import published from '../fixtures/employment-published';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark']){
 test(`Employment preserves guidance and templates: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);window.print=()=>{};Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__copied=text;}}});},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});await page.goto('/support/employment');
  const root=page.locator('.employment-page'),base=published[language],court=base.employment.courtTimeOff;
  await expect(root.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  for(const detail of await root.locator('details').all()){await detail.locator('summary').focus();await page.keyboard.press('Enter');await expect(detail).toHaveAttribute('open','');}
  for(const item of Object.values(base.employment.actions)){await expect(root).toContainText(item.title);await expect(root).toContainText(item.description);}
  for(const faq of Object.values(base.employment.faq)){await expect(root).toContainText(faq.question);await expect(root).toContainText(faq.answer);}
  for(const tip of Object.values(base.employment.tips))await expect(root).toContainText(tip);
  for(const resource of Object.values(base.employment.resources))await expect(root).toContainText(resource.description);
  for(const href of base.links)await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  let observed=await root.innerText();
  const emails=[court.emailTemplates.formal,court.emailTemplates.brief,court.emailTemplates.multipleDate];
  for(let i=0;i<emails.length;i++){
   const paper=root.locator('#email-panel .employment-paper').nth(i);await expect(paper.locator('pre')).toHaveText(emails[i].body);
   await paper.getByRole('button',{name:court.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(`${emails[i].subject}\n\n${emails[i].body}`);observed+='\n'+await root.innerText();
   const opening=page.waitForEvent('popup');await paper.getByRole('button',{name:court.printButton,exact:true}).click();const popup=await opening;
   await expect(popup.locator('.body')).toHaveText(emails[i].body);await expect(popup.locator('.note')).toHaveText(court.personalizeNote);if(language==='en'&&theme==='light'&&i===0)await popup.screenshot({path:info.outputPath('employment-print.png'),fullPage:true});await popup.close();
  }
  await root.locator('#call-tab').click();await expect(root.locator('#call-tab')).toHaveAttribute('aria-selected','true');
  for(const script of [court.callScripts.manager,court.callScripts.hr]){
   const button=root.locator('#call-panel button[aria-expanded]').filter({hasText:script.label});await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');
   await expect(root.locator('#call-panel pre')).toHaveText(script.script);
   await root.locator('#call-panel').getByRole('button',{name:court.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(script.script);observed+='\n'+await root.innerText();
  }
  for(const text of [...base.strings,...base.literal])expect(observed.replace(/\s+/g,' ')).toContain(text.replace(/\s+/g,' '));
  for(const tip of Object.values(court.callScripts.tips.items))await expect(root).toContainText(tip);
  for(const right of Object.values(court.legalRights.rights))await expect(root).toContainText(right);
  await expect(root.locator('.employment-collateral')).toHaveAttribute('lang','en');
  const art=root.locator('.employment-hero img');expect(await art.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,h3,p,pre,a,button,summary')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath(`employment-${width}.png`),fullPage:true});
  }
  await root.locator('#email-tab').click();await expect(root.locator('#email-panel .employment-paper')).toHaveCount(3);
 });
}
