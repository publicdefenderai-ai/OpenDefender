import {test,expect} from '@playwright/test';
import published from '../fixtures/finances-published';
import fees from '../fixtures/finances-fees-published';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark']){
 test(`Finances content and state lookup: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});await page.goto('/support/finances');
  const root=page.locator('.finances-page'),copy=published[language].finances;
  await expect(root.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  for(const id of ['benefits','court-fees','resources','faqs']){const button=root.locator(`#${id} > button`);await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');}
  for(const a of Object.values(copy.actions)){await expect(root).toContainText(a.title);await expect(root).toContainText(a.description);}
  for(const id of ['snap','medicaid','tanf','socialSecurity','banking'] as const){for(const text of Object.values(copy.benefits[id]))await expect(root).toContainText(text);}
  for(const fee of Object.values(copy.courtFees.types)){
   const trigger=root.locator('#court-fees').getByRole('button',{name:fee.title,exact:true});await trigger.click();await expect(root).toContainText(fee.description);await expect(root).toContainText(fee.note);
  }
  for(const faq of Object.values(copy.faq)){await root.locator('#faqs').getByRole('button',{name:faq.question,exact:true}).click();await expect(root).toContainText(faq.answer);}
  for(const tip of Object.values(copy.tips))await expect(root).toContainText(tip);
  for(const resource of Object.values(copy.resources))await expect(root).toContainText(resource.description);
  for(const step of copy.courtFees.waiver.steps)await expect(root).toContainText(step);
  for(const tip of copy.courtFees.paymentPlan.tips)await expect(root).toContainText(tip);
  for(const href of published[language].links)await expect(root.locator(`a[href="${href}"]`).first()).toBeVisible();
  for(const org of fees.national){await expect(root).toContainText(org.description);await expect(root.locator(`a[href="${org.url}"]`).first()).toBeVisible();}
  for(const code of ['CA','NY','TX'] as const){
   await root.getByRole('combobox').click();await page.getByRole('option',{name:fees.states[code].stateName,exact:true}).click();
   const result=root.locator('.finances-state');await expect(result).toHaveAttribute('lang','en');
   for(const key of ['filingFee','probationFee','publicDefenderFee','fineRange','surcharges','waiverForm','waiverIncome'] as const)await expect(result).toContainText(fees.states[code][key]);
  }
  for(const text of published[language].literal.filter(text=>text.length>100))await expect(root).toContainText(text);
  await expect(root.locator('.finances-warning')).toHaveAttribute('lang','en');
  const art=root.locator('.finances-hero img');expect(await art.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});
   expect(await root.evaluate(r=>[...r.querySelectorAll('h1,h2,p,a,button')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath(`finances-${width}.png`),fullPage:true});
  }
  await root.locator('a[href="#court-fees"]').click();await root.locator('#court-fees > button').click();
  await root.locator('a[href="#court-fees"]').click();await expect(root.locator('#court-fees > button')).toHaveAttribute('aria-expanded','true');await expect(root.getByRole('combobox')).toContainText('Texas');
  await page.goto('/support/finances#benefits');await expect(root.locator('#benefits > button')).toHaveAttribute('aria-expanded','true');
 });
}
test('Every published state profile and assistance destination remains available',async({page})=>{
 await page.goto('/support/finances#court-fees');
 for(const state of Object.values(fees.states)){
  await page.locator('.finances-page').getByRole('combobox').click();await page.getByRole('option',{name:state.stateName,exact:true}).click();const result=page.locator('.finances-state');
  for(const key of ['filingFee','probationFee','publicDefenderFee','fineRange','surcharges','waiverForm','waiverIncome'] as const)await expect(result).toContainText(state[key]);
  for(const org of state.assistanceOrgs){await expect(result).toContainText(org.description);await expect(result.locator(`a[href="${org.url}"]`)).toBeVisible();}
 }
});
