import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const aliases=JSON.parse(readFileSync('shared/california-reviewed-search-aliases.json','utf8')) as Record<string,string[]>;

test('reviewed subdivision aliases reach the production search API without changing charge identity',async({request})=>{
  for(const [id,queries] of Object.entries(aliases)){
    for(const query of queries.filter(q=>q.startsWith('PC '))){
      const response=await request.get('/api/criminal-charges',{params:{jurisdiction:'CA',search:query,limit:500}});
      expect(response.ok()).toBe(true);
      const body=await response.json();
      expect(body.charges.some((c:{id:string})=>c.id===id),query).toBe(true);
    }
  }
});
for(const [query,id] of [['PC 470(a)','ca-forgery'],['PC 484g(b)','ca-credit-card-fraud'],['PC 476a(a)','ca-check-fraud']]){
  test(`existing reviewed choice is selectable for ${query}`,async({page})=>{
    await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);const choice=page.getByTestId(`checkbox-charge-${id}`);
    await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}
