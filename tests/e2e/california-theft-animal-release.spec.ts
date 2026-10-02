import {expect,test} from '@playwright/test';
for(const [query,id] of [['PC 597(a)','ca-pen-597-a'],['PC 484e(b)','ca-pen-484e-b']]){
  test(`reviewed branch is selectable for ${query}`,async({page})=>{
    await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);const choice=page.getByTestId(`checkbox-charge-${id}`);
    await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}
