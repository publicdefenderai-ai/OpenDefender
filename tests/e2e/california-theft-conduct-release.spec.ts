import {expect,test} from '@playwright/test';
test('existing petty-theft choice exposes the reviewed conduct distinctions',async({request})=>{
 const response=await request.get('/api/criminal-charges',{params:{jurisdiction:'CA',search:'Petty Theft',limit:500}});
 expect(response.ok()).toBe(true);const body=await response.json();
 const charge=body.charges.find((c:{id:string})=>c.id==='ca-petty-theft');
 expect(charge.description).toContain('Theft by trick');expect(charge.description).toContain('Theft by false pretense');
 expect(charge.categories).toEqual(expect.arrayContaining(['misdemeanor','infraction','felony']));
});
test('the existing petty-theft identity remains selectable',async({page})=>{
 await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
 await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
 await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
 await page.locator('#charge-search').fill('Petty Theft');const choice=page.getByTestId('checkbox-charge-ca-petty-theft');
 await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
});
