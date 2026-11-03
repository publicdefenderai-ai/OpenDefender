import {test,expect} from '@playwright/test';
import published from '../fixtures/toolkit-published';
const tools=['contact-kit','docket-lookup','certified-mail','address-guide'];
for(const language of ['en','es','zh']) for(const theme of ['light','dark']) {
 test(`Family Toolkit retains tools and local state: ${language}/${theme}`,async({page},info)=>{
  await page.addInitScript(({language,theme})=>{localStorage.setItem('i18nextLng',language);localStorage.setItem('public-defender-theme',theme);window.print=()=>{};},{language,theme});
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:1000});
  await page.goto('/friends-family/toolkit');const root=page.locator('.toolkit-page');
  await expect(root.locator('.toolkit-panel:visible')).toHaveCount(1);
  await expect(root).toContainText('Nothing on this page is saved.');
  await expect(root.locator('#contact-kit input')).toHaveCount(18);
  for(const [i,field] of published.fields.entries()){
   const input=page.getByLabel(field.label!,{exact:true});await expect(input).toHaveAttribute('type',field.type!);
   await input.fill(field.type==='date'?'2026-11-02':`Fictional detail ${i}`);
  }
  await page.getByLabel('Full legal name',{exact:true}).fill('<img src=x onerror=alert(1)>');
  for(const id of tools){
   const button=root.locator(`.toolkit-nav button[aria-controls="${id}"]`);await button.focus();await page.keyboard.press('Enter');
   await expect(button).toHaveAttribute('aria-pressed','true');await expect(root.locator(`#${id} h2`)).toBeFocused();
   if(id==='docket-lookup'){
    await expect(root.locator('#docket-lookup select option')).toHaveCount(53);
    for(const court of published.courts){await root.locator('#docket-lookup select').selectOption(court.value);await expect(root.locator('#docket-lookup a').first()).toHaveAttribute('href',court.href!);}
   }
   if(id==='certified-mail'){
    await expect(root.locator('input[type=checkbox]')).toHaveCount(10);
    const checkbox=page.getByRole('checkbox',{name:'USPS Mail Forwarding',exact:true});await checkbox.focus();await page.keyboard.press('Space');await expect(checkbox).toBeChecked();
   }
   if(id==='address-guide'){
    await expect(root.locator('#address-guide button[data-state]')).toHaveCount(5);
    for(const button of await root.locator('#address-guide button[data-state]').all()){await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('data-state','open');}
   }
   for(const width of [1280,320]){
    await page.setViewportSize({width,height:1000});
    const clipped=await root.locator(`#${id}`).evaluate(r=>[...r.querySelectorAll('h2,p,li,dt,dd,label,input,select,button,a')].filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&(b.left < -1 || b.right > innerWidth+1);}).map(e=>e.textContent));expect(clipped).toEqual([]);
    await page.screenshot({path:info.outputPath(`${id}-${width}.png`)});
   }
   await page.setViewportSize({width:1280,height:1000});
  }
  for(const text of published.text) await expect(root).toContainText(text);
  // Jump links became workspace controls; the unrelated FDIC failure-list link was removed.
  for(const href of published.links.filter(h=>!h?.startsWith('#')&&!h?.includes('fdic.gov'))) await expect(root.locator(`a[href="${href}"]`).first()).toHaveCount(1);
  await root.locator('.toolkit-nav button[aria-controls="contact-kit"]').click();
  await expect(page.getByLabel('Full legal name',{exact:true})).toHaveValue('<img src=x onerror=alert(1)>');
  expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain('Fictional detail');
  for(const [id,label,title] of [['contact-kit','Print this kit','Emergency Contact Kit'],['certified-mail','Print this checklist','Certified Mail Checklist'],['address-guide','Print this guide','Change-of-Address Guide']]){
   await root.locator(`.toolkit-nav button[aria-controls="${id}"]`).click();await page.getByRole('button',{name:label,exact:true}).click();
   await page.emulateMedia({media:'print'});
   const sheet=root.locator(`[data-print-sheet="${id}"]`);await expect(sheet).toBeVisible();await expect(sheet.getByRole('heading',{name:title,exact:true})).toBeVisible();
   await expect(root.locator('.toolkit-print > :visible')).toHaveCount(1);await expect(root.locator('.toolkit-work')).toBeHidden();
   if(id==='contact-kit'){await expect(sheet).toContainText('<img src=x onerror=alert(1)>');await expect(sheet.locator('img')).toHaveCount(0);}
   if(id==='certified-mail'){await expect(sheet.locator('.toolkit-print-item')).toHaveCount(10);await expect(sheet).toContainText('☑ USPS Mail Forwarding');}
   if(id==='address-guide')await expect(sheet.locator('.toolkit-print-item')).toHaveCount(13);
   if(language==='en'&&theme==='light'){await page.pdf({path:info.outputPath(`${id}.pdf`),format:'Letter',margin:{top:'16mm',bottom:'16mm',left:'16mm',right:'16mm'}});await page.screenshot({path:info.outputPath(`${id}-print.png`)});}
   await page.emulateMedia({media:'screen'});
  }
  await page.reload();await expect(page.getByLabel('Full legal name',{exact:true})).toHaveValue('');
  await page.goto('/friends-family/toolkit#certified-mail');await expect(root.locator('#certified-mail')).toBeVisible();await expect(page.getByRole('checkbox',{name:'USPS Mail Forwarding',exact:true})).not.toBeChecked();
 });
}
