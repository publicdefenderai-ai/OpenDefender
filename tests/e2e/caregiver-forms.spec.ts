import {test,expect} from '@playwright/test';
import {officialCaregiverForms as official} from '../../shared/templates/official-caregiver-forms';
for(const language of ['en','es'])test(`Caregiver official forms and Florida print: ${language}`,async({page})=>{
 await page.addInitScript(language=>{localStorage.setItem('i18nextLng',language);window.print=()=>{};},language);
 await page.goto('/immigration-guidance/family-planning#generator');const tool=page.locator('#generator');
 for(const state of ['CA','TX','NY']){
  await tool.getByRole('button',{name:new RegExp(`^${state}`)}).click();const ref=tool.getByTestId('official-caregiver-form');
  await expect(ref).toBeVisible();for(const text of official[state][language as 'en'|'es'])await expect(ref).toContainText(text);
  await expect(ref.locator(`a[href="${official[state].url}"]`)).toHaveCount(1);await expect(tool.locator('input')).toHaveCount(0);
 }
 await tool.getByRole('button',{name:/^FL/}).click();
 await tool.getByPlaceholder(language==='es'?'Nombre del padre/tutor':'Parent/guardian name',{exact:true}).fill('<img src=x onerror=alert(1)>');
 const popupPromise=page.waitForEvent('popup');await tool.getByRole('button',{name:language==='es'?'Generar e Imprimir Documento':'Generate and Print Document',exact:true}).click();
 const popup=await popupPromise;await expect(popup.locator('pre')).toContainText('<img src=x onerror=alert(1)>');await expect(popup.locator('img')).toHaveCount(0);
 await expect(popup.locator('pre')).toContainText('709.2105');await popup.close();
 await tool.getByRole('button',{name:/^CA/}).click();await page.setViewportSize({width:320,height:1000});
 expect(await tool.evaluate(r=>[...r.querySelectorAll('button,p,li,a')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(e=>e.textContent))).toEqual([]);
});
