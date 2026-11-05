import {test,expect} from '@playwright/test';
import {officialCaregiverForms as official} from '../../shared/templates/official-caregiver-forms';
for(const language of ['en','es','zh'] as const)for(const theme of ['light','dark'])test(`Government caregiver forms: ${language}/${theme}`,async({page},info)=>{
 await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);},{language,theme});
 await page.goto('/immigration-guidance/family-planning#generator');const tool=page.locator('#generator');
 if(language==='zh'){
  await expect(tool.getByTestId('caregiver-translation-notice')).toHaveText('此说明尚无中文版本，现显示英文内容。');
  await expect(tool.getByTestId('caregiver-translation-notice')).toHaveAttribute('lang','zh');
  await expect(tool.locator('[lang="en"]').first()).toContainText('IMPORTANT NOTICE:');
 }else await expect(tool.getByTestId('caregiver-translation-notice')).toHaveCount(0);
 for(const width of [1280,320]){
  await page.setViewportSize({width,height:1000});
  for(const state of ['CA','TX','FL','NY','IL']){
   const choice=tool.getByRole('button',{name:new RegExp(`^${state}`)});await choice.focus();await page.keyboard.press('Enter');
   await expect(choice).toHaveAttribute('aria-pressed','true');
   const ref=tool.getByTestId('official-caregiver-form');await expect(ref).toBeVisible();
   for(const text of official[state][language==='zh'?'en':language])await expect(ref).toContainText(text);
   const link=ref.locator(`a[href="${official[state].url}"]`);await expect(link).toContainText(official[state].format);await expect(link).toHaveAttribute('target','_blank');
   await expect(tool.locator('input,textarea')).toHaveCount(0);
   await expect(tool.getByRole('button',{name:/Generate and Print|Generar e Imprimir/})).toHaveCount(0);
   expect(await tool.evaluate(r=>[...r.querySelectorAll('button,p,li,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
  }
  await tool.screenshot({path:info.outputPath(`illinois-${width}.png`)});
 }
});
