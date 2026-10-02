import {expect,test} from '@playwright/test';
test('new person offenses expose the reviewed tiers and special requirements',async({request})=>{
 for(const [search,id] of [['PC 186.22(a)','ca-pen-186-22-a'],['PC 243(c)(1)','ca-pen-243-c-1'],['PC 664/192(a)','ca-attempted-voluntary-manslaughter']]){
  const response=await request.get('/api/criminal-charges',{params:{jurisdiction:'CA',search,limit:500}});
  expect(response.ok()).toBe(true);const body=await response.json();
  const charge=body.charges.find((c:{id:string})=>c.id===id);expect(charge).toBeTruthy();
  if(id==='ca-pen-186-22-a'){expect(charge.categories).toEqual(['felony','misdemeanor']);expect(charge.description).toContain('At least two members');}
  if(id==='ca-attempted-voluntary-manslaughter')expect(charge.maxPenalty).toContain('5 years 6 months');
 }
});
test('combined attempted-manslaughter citation finds a selectable choice',async({page})=>{
 await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
 await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
 await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
 await page.locator('#charge-search').fill('PC 664/192(a)');const choice=page.getByTestId('checkbox-charge-ca-attempted-voluntary-manslaughter');
 await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
});
