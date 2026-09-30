import {CA_CATALOG_COUNTS} from "../fixtures/california-catalog-counts";
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const additions=JSON.parse(readFileSync('shared/california-weapons-threats-additions.json','utf8')) as Array<{id:string;code:string;summary:string;penalty:string;categories:string[]}>;
test('Weapons and threats choices reach authority-gated API and rules guidance',async({request})=>{
  const response=await request.get('/api/criminal-charges?jurisdiction=CA&limit=500');
  expect(response.ok()).toBe(true);
  const body=await response.json();expect(body.charges).toHaveLength(CA_CATALOG_COUNTS.eligible);
  for(const a of additions)expect(body.charges.find((r:any)=>r.id===a.id),a.id).toMatchObject({description:a.summary,maxPenalty:a.penalty,categories:a.categories});
  expect(body.charges.some((r:any)=>r.id==='ca-possession-of-prohibited-weapon')).toBe(false);
  const ids=['ca-pen-422-6-a','ca-pen-18755-b','ca-pen-25100-c','ca-pen-646-9-b'];
  const result=await request.post('/api/legal-guidance/rules',{headers:{Origin:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:5001'},data:{jurisdiction:'CA',charges:ids,caseStage:'arrest',custodyStatus:'in_custody'}});
  expect(result.ok()).toBe(true);
  const guidance=(await result.json()).guidance;
  for(const id of ids)expect(guidance.chargeClassifications.find((r:any)=>r.id===id)).toMatchObject({maxPenalty:additions.find(a=>a.id===id)!.penalty,categories:additions.find(a=>a.id===id)!.categories});
});
for(const [query,id] of [['PC 422.6(a)','ca-pen-422-6-a'],['PC 11411(d)','ca-pen-11411-d'],['PC 18755(b)','ca-pen-18755-b'],['PC 25100(c)','ca-pen-25100-c'],['PC 417(a)(2)(A)','ca-pen-417-a-2-a'],['PC 26100(c)','ca-pen-26100-c']]){
  test(`charging-paper search finds ${id}`,async({page})=>{
    await page.route('**/api/ai/status',r=>r.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);
    const choice=page.getByTestId(`checkbox-charge-${id}`);await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}
