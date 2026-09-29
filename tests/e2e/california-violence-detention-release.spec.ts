import {CA_CATALOG_COUNTS} from "../fixtures/california-catalog-counts";
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const additions=JSON.parse(readFileSync('shared/california-violence-detention-additions.json','utf8')) as Array<{id:string;code:string;summary:string;penalty:string;categories:string[]}>;
test('Violence, abuse and detention choices reach authority-gated API and rules guidance',async({request})=>{
  const response=await request.get('/api/criminal-charges?jurisdiction=CA&limit=500');
  expect(response.ok()).toBe(true);
  const body=await response.json();expect(body.charges).toHaveLength(CA_CATALOG_COUNTS.eligible);
  for(const a of additions)expect(body.charges.find((r:any)=>r.id===a.id),a.id).toMatchObject({description:a.summary,maxPenalty:a.penalty,categories:a.categories});
  expect(body.charges.some((r:any)=>r.id==='ca-possession-of-prohibited-weapon')).toBe(false);
  const ids=['ca-pen-273a-a','ca-pen-273ab-a','ca-pen-236-1-c','ca-pen-237-a'];
  const result=await request.post('/api/legal-guidance/rules',{headers:{Origin:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:5001'},data:{jurisdiction:'CA',charges:ids,caseStage:'arrest',custodyStatus:'in_custody'}});
  expect(result.ok()).toBe(true);
  const guidance=(await result.json()).guidance;
  for(const id of ids)expect(guidance.chargeClassifications.find((r:any)=>r.id===id)).toMatchObject({maxPenalty:additions.find(a=>a.id===id)!.penalty,categories:additions.find(a=>a.id===id)!.categories});
});
for(const [query,id] of [['PC 273ab(a)','ca-pen-273ab-a'],['torture','ca-pen-206'],['custodial interference','ca-pen-278-5-a'],['PC 236/237','ca-pen-237-a']]){
  test(`charging-paper search finds ${id}`,async({page})=>{
    await page.route('**/api/ai/status',r=>r.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);
    const choice=page.getByTestId(`checkbox-charge-${id}`);await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}
