import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const additions=JSON.parse(readFileSync('shared/california-trespass-additions.json','utf8')) as Array<{id:string;code:string;categories:string[]}>;
test('all eleven trespass branches are discoverable by exact charging citation',async({request})=>{
 for(const a of additions){
  const response=await request.get('/api/criminal-charges',{params:{jurisdiction:'CA',search:`PC ${a.code}`,limit:500}});
  expect(response.ok()).toBe(true);const body=await response.json();
  expect(body.charges.find((c:{id:string})=>c.id===a.id)).toMatchObject({categories:a.categories});
 }
});
for(const [query,id] of [['PC 602(o)','ca-pen-602-o'],['PC 602(x)','ca-pen-602-x-2-b']]){
 test(`reviewed trespass branch is selectable for ${query}`,async({page})=>{
  await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
  await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
  await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
  await page.locator('#charge-search').fill(query);const choice=page.getByTestId(`checkbox-charge-${id}`);
  await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
 });
}
