import {test,expect} from '@playwright/test';
import published from '../fixtures/childcare-published';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark']){
 test(`Childcare preserves reference card, messages and print: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);window.print=()=>{};Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__copied=text;}}});},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});await page.goto('/support/childcare');
  const root=page.locator('.childcare-page'),base=published[language],comms=base.childcare.commsSection,needs=base.childcare.needsCard;
  await expect(root.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  for(const detail of await root.locator('details').all()){await detail.locator('summary').focus();await page.keyboard.press('Enter');await expect(detail).toHaveAttribute('open','');}
  for(const item of Object.values(base.childcare.actions)){await expect(root).toContainText(item.title);await expect(root).toContainText(item.description);}
  for(const faq of Object.values(base.childcare.faq)){await expect(root).toContainText(faq.question);await expect(root).toContainText(faq.answer);}
  for(const tip of Object.values(base.childcare.tips))await expect(root).toContainText(tip);
  for(const resource of Object.values(base.childcare.resources))await expect(root).toContainText(resource.description);
  for(const href of base.links)await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  let observed=await root.innerText();
  const card=root.locator('#needs-card');await expect(card.locator('pre')).toHaveText(needs.template);
  await card.getByRole('button',{name:needs.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(needs.template);observed+='\n'+await root.innerText();
  const cardOpening=page.waitForEvent('popup');await card.getByRole('button',{name:needs.printButton,exact:true}).click();const cardPrint=await cardOpening;
  await expect(cardPrint.locator('.card')).toHaveText(needs.template);await expect(cardPrint.locator('.note')).toHaveText(needs.printInstructions);
  if(language==='en'&&theme==='light')await cardPrint.screenshot({path:info.outputPath('childcare-reference-print.png'),fullPage:true});await cardPrint.close();
  const emails=[comms.emailTemplates.school,comms.emailTemplates.daycare,comms.emailTemplates.doctor];
  for(let i=0;i<emails.length;i++){
   const paper=root.locator('#childcare-comms .childcare-paper').nth(i);await expect(paper.locator('pre')).toHaveText(emails[i].body);
   await paper.getByRole('button',{name:comms.copyButton,exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__copied)).toBe(emails[i].subject?`${emails[i].subject}\n\n${emails[i].body}`:emails[i].body);observed+='\n'+await root.innerText();
   const opening=page.waitForEvent('popup');await paper.getByRole('button',{name:comms.printButton,exact:true}).click();const popup=await opening;
   await expect(popup.locator('.body')).toHaveText(emails[i].body);await expect(popup.locator('.note')).toHaveText(comms.personalizeNote);if(language==='en'&&theme==='light'&&i===0)await popup.screenshot({path:info.outputPath('childcare-message-print.png'),fullPage:true});await popup.close();
  }
  for(const text of [...base.strings,...base.literal])expect(observed.replace(/\s+/g,' ')).toContain(text.replace(/\s+/g,' '));
  const art=root.locator('.childcare-hero img');expect(await art.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);await expect(art).toHaveAttribute('aria-hidden','true');
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,h3,p,a,button,pre,summary')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   await root.locator('a[href="#section-resources"]').click();await expect(root.locator('#section-resources')).toBeInViewport();
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`childcare-${width}.png`)});
  }
 });
}
