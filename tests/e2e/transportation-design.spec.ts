import {test,expect} from '@playwright/test';
import published from '../fixtures/transportation-published';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark']){
 test(`Transportation preserves guidance, templates and print: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);window.print=()=>{};Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__copied=text;}}});},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});await page.goto('/support/transportation');
  const root=page.locator('.transportation-page'),base=published[language],network=base.transportation.commsSection;
  await expect(root.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  for(const detail of await root.locator('details').all()){await detail.locator('summary').focus();await page.keyboard.press('Enter');await expect(detail).toHaveAttribute('open','');}
  for(const item of Object.values(base.transportation.actions)){await expect(root).toContainText(item.title);await expect(root).toContainText(item.description);}
  for(const faq of Object.values(base.transportation.faq)){await expect(root).toContainText(faq.question);await expect(root).toContainText(faq.answer);}
  for(const tip of Object.values(base.transportation.tips))await expect(root).toContainText(tip);
  for(const resource of Object.values(base.transportation.resources))await expect(root).toContainText(resource.description);
  for(const href of base.links)await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  let observed=await root.innerText();
  const emails=[network.emailTemplates.employer,network.emailTemplates.family];
  for(let i=0;i<emails.length;i++){
   const paper=root.locator('#transportation-written-panel .transportation-paper').nth(i);await expect(paper.locator('pre')).toHaveText(emails[i].body);
   await paper.getByRole('button',{name:network.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(emails[i].subject ? `${emails[i].subject}\n\n${emails[i].body}` : emails[i].body);observed+='\n'+await root.innerText();
   const opening=page.waitForEvent('popup');await paper.getByRole('button',{name:network.printButton,exact:true}).click();const popup=await opening;
   await expect(popup.locator('.body')).toHaveText(emails[i].body);await expect(popup.locator('.note')).toHaveText(network.personalizeNote);if(language==='en'&&theme==='light'&&i===0)await popup.screenshot({path:info.outputPath('transportation-print.png'),fullPage:true});await popup.close();
  }
  await root.locator('#transportation-call-tab').click();await expect(root.locator('#transportation-call-tab')).toHaveAttribute('aria-selected','true');
  for(const script of [network.callScripts.dmv]){
   const button=root.locator('#transportation-call-panel button[aria-expanded]').filter({hasText:script.label});await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');
   await expect(root.locator('#transportation-call-panel pre')).toHaveText(script.script);
   await root.locator('#transportation-call-panel').getByRole('button',{name:network.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(script.script);observed+='\n'+await root.innerText();
  }
  await expect(root.locator('.transportation-warning')).toHaveAttribute('role','alert');
  for(const text of [...base.strings,...base.literal])expect(observed.replace(/\s+/g,' ')).toContain(text.replace(/\s+/g,' '));
  for(const tip of Object.values(network.callScripts.tips.items))await expect(root).toContainText(tip);
  for(const selector of ['#transportation-nondriver'])await expect(root.locator(selector)).toHaveAttribute('lang','en');
  const art=root.locator('.transportation-hero img');expect(await art.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,h3,p,a,button,pre,summary')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   await root.locator('a[href="#section-resources"]').click();await expect(root.locator('#section-resources')).toBeInViewport();
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`transportation-${width}.png`)});
  }
 });
}
