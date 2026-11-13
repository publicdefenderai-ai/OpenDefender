import { test, expect } from '@playwright/test';
import published from '../fixtures/collateral-published';
import { collateralDesignCopy } from '../../client/src/locales/collateral-design';
const order = ['housing','employment','immigration','benefits','children','supervision','license'] as const;
for (const language of ['en','es','zh'] as const) for (const theme of ['light','dark']) {
 test(`Screener preserves questions and results: ${language}/${theme}`, async ({page}, info) => {
  const old = published[language]; const copy = collateralDesignCopy[language];
  await page.addInitScript(({language,theme}) => {
   localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);
   window.print = () => {};
   Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__copied = text;}}});
  },{language,theme});
  await page.setViewportSize({width:1280,height:1000});
  await page.goto('/collateral-consequences');const main=page.locator('.collateral-body');
  await expect(main.locator('[data-charge]')).toHaveCount(7);
  await expect(main.getByTestId('nrrc-resources')).toBeVisible();
  for (const [key,value] of Object.entries(old.chargeType.options)) await expect(main.locator(`[data-charge="${key}"]`)).toHaveText(value);
  await expect(main.locator('.collateral-continue')).toBeDisabled();
  await main.locator('[data-charge="dui"]').click();
  await expect(main.locator('[data-charge="dui"]')).toHaveAttribute('aria-pressed','true');
  await main.locator('.collateral-continue').click();
  for (const [index,id] of order.entries()) {
   await expect(main.locator('.collateral-content h2')).toHaveText(old.questions[id].question);
   await expect(main.locator('.collateral-content h2')).toBeFocused();
   await expect(main).toContainText(old.questions[id].sub);
   if(id==='immigration') await expect(main).toContainText(old.questions.immigration.privacyNote);
   await expect(main.locator('.collateral-continue')).toBeDisabled();
   await main.locator('[data-answer=yes]').focus();await page.keyboard.press('Space');
   await expect(main.locator('.collateral-content h2')).toHaveText(old.questions[id].question);
   await expect(main.locator('[data-answer=yes]')).toHaveAttribute('aria-pressed','true');
   for(const width of [1280,320]) {
    await page.setViewportSize({width,height:1000});
    const clipped=await main.evaluate(r=>[...r.querySelectorAll('button,h1,h2,p,select')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent));expect(clipped).toEqual([]);
   }
   if(index===0) await page.screenshot({path:info.outputPath('question-mobile.png')});
   await main.locator('.collateral-continue').click();
  }
  await expect(main.locator('.collateral-result')).toHaveCount(8);
  for(const id of [...order,'driverLicense'] as const) {
   const result=main.locator(`[data-risk="${id}"]`); const expected=old.risks[id];
   for(const key of ['title','what','clock','action','linkLabel'] as const) await expect(result).toContainText(expected[key]);
  }
  await expect(main).toContainText(old.disclaimer);await expect(main).toContainText(old.generalInfo);await expect(main).toContainText(old.privacyStrip);
  const supervision = main.locator('[data-risk="supervision"]');
  const hearing = { en: 'revocation hearing', es: 'audiencia de revocación', zh: '撤销缓刑或假释听证会' };
  await expect(supervision).toContainText(hearing[language]);
  await expect(supervision).not.toContainText('322.055');
  const select=main.locator('select');
  for (const option of await select.locator('option').evaluateAll(es=>es.map(e=>(e as HTMLOptionElement).value).filter(Boolean))) {
   await select.selectOption(option);
   if (['CA','CO','TX','FL','OH','NC','AZ','GA'].includes(option)) {
    const source=main.locator('[data-risk="driverLicense"] a[href^="https://"]');
    await expect(source).toBeVisible();
    await expect(source).not.toContainText('collateralConsequences.');
   }
   const entry=(old.stateDeadlines.entries as any)[option];
   for (const id of ['housing','license']) if(entry[id]) {
    await expect(main.locator(`[data-risk="${id}"]`)).toContainText(entry[id].headline);
    await expect(main.locator(`[data-risk="${id}"]`)).toContainText(entry[id].detail);
   }
  }
  await main.getByRole('button',{name:old.copyBtn,exact:true}).click();
  expect(await page.evaluate(()=>(window as any).__copied)).toContain(old.risks.housing.title);
  const popupPromise=page.waitForEvent('popup');await main.getByRole('button',{name:old.printBtn,exact:true}).click();
  const popup=await popupPromise;await expect(popup.locator('pre')).toContainText(old.risks.housing.title);await popup.close();
  for(const width of [320,1280]) {
   await page.setViewportSize({width,height:1000});
   expect(await main.evaluate(r=>[...r.querySelectorAll('p,h2,h3,select,button,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
  }
  await main.locator('.collateral-content h2').scrollIntoViewIfNeeded();
  await page.setViewportSize({width:1280,height:1000});await page.screenshot({path:info.outputPath('results-desktop.png')});
  await main.getByRole('button',{name:copy.review,exact:true}).click();await expect(main.locator('[data-answer=yes]')).toHaveAttribute('aria-pressed','true');
  await main.getByRole('button',{name:old.back,exact:true}).click();await expect(main.locator('[data-charge=dui]')).toHaveAttribute('aria-pressed','true');
  await main.getByRole('button',{name:old.chargeType.skip,exact:true}).click();
  for(const id of order){await main.locator(id === 'housing' ? '[data-answer=unknown]' : '[data-answer=no]').click();await main.locator('.collateral-continue').click();}
  await expect(main.locator('.collateral-result')).toHaveCount(0);
  await expect(main).toContainText(old.noRiskTitle);
  const notes=main.locator('[data-summary-notes]');
  await expect(notes).toContainText(old.questions.housing.question);
  await main.getByRole('button',{name:old.copyBtn,exact:true}).click();
  const exported=await page.evaluate(()=>(window as any).__copied);
  for(const paragraph of await notes.locator('p').allTextContents()) expect(exported).toContain(paragraph);
  expect(exported).toContain(old.noRiskDesc);
  const printWait=page.waitForEvent('popup');
  await main.getByRole('button',{name:old.printBtn,exact:true}).click();
  const emptyPrint=await printWait;
  await expect(emptyPrint.locator('pre')).toHaveText(exported);
  await emptyPrint.close();
  await main.getByRole('button',{name:old.restart,exact:true}).click();await expect(main.locator('.collateral-continue')).toBeDisabled();
  await page.reload();await expect(main.locator('.collateral-continue')).toBeDisabled();
 });
}
for (const [charge,state,expected] of [['drug_possession','','driverLicenseCheck'],['drug_possession','new york','driverLicenseCheck'],['drug_trafficking','texas','driverLicenseCheck'],['sex_offense','','sexOffender']] as const) {
 test(`State-conditioned charge result: ${charge}/${state}`,async({page})=>{
  await page.addInitScript(state=>{localStorage.setItem('i18nextLng','en');if(state)localStorage.setItem('od_selected_jurisdiction',state);},state);
  await page.goto('/collateral-consequences');const main=page.locator('.collateral-body');
  await main.locator(`[data-charge=${charge}]`).click();await main.locator('.collateral-continue').click();
  for(const id of order){await main.locator('[data-answer=no]').click();await main.locator('.collateral-continue').click();}
  await expect(main.locator('.collateral-result')).toHaveCount(expected?1:0);
  if(expected)await expect(main.locator(`[data-risk=${expected}]`)).toBeVisible();
  if(state)await expect(main).toContainText(published.en.stateRules.subheading);
  await page.setViewportSize({width:320,height:1000});
  expect(await main.evaluate(r=>[...r.querySelectorAll('p,span,h2,h3,select,button,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
 });
}
