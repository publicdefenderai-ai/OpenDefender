import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {readCaliforniaCatalog} from './helpers/california-catalog';
import {CA_CATALOG_COUNTS} from '../fixtures/california-catalog-counts';
const additions=JSON.parse(readFileSync('shared/california-justice-custody-additions.json','utf8')) as Array<{id:string;summary:string;penalty:string;categories:string[]}>;
test('all combined justice and custody additions reach the paginated API and rules guidance',async({request})=>{
  const body=await readCaliforniaCatalog(request);
  expect(body.charges).toHaveLength(CA_CATALOG_COUNTS.eligible);
  expect(body.charges.length).toBeGreaterThan(500);
  for(const a of additions)expect(body.charges.find((r:any)=>r.id===a.id),a.id).toMatchObject({description:a.summary,maxPenalty:a.penalty,categories:a.categories});
  expect(body.charges.some((r:any)=>r.id==='ca-possession-of-prohibited-weapon')).toBe(false);
  const ids=['ca-pen-136-1-b-2','ca-pen-141-c','ca-pen-4532-b-2','ca-pen-836-6-b'];
  const response=await request.post('/api/legal-guidance/rules',{headers:{Origin:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:5001'},data:{jurisdiction:'CA',charges:ids,caseStage:'arrest',custodyStatus:'in_custody'}});
  expect(response.ok()).toBe(true);
  const guidance=(await response.json()).guidance;
  for(const id of ids)expect(guidance.chargeClassifications.find((r:any)=>r.id===id)).toMatchObject({maxPenalty:additions.find(a=>a.id===id)!.penalty,categories:additions.find(a=>a.id===id)!.categories});
});
for(const [query,id] of [['PC 136.1(c)(3)','ca-pen-136-1-c'],['PC 118a','ca-pen-118a'],['PC 166(c)(4)','ca-pen-166-c-4'],['PC 4532(b)(2)','ca-pen-4532-b-2'],['PC 836.6(b)','ca-pen-836-6-b'],['PC 1320.5','ca-pen-1320-5']]) {
 test(`charging-paper search selects ${id}`,async({page})=>{
  await page.route('**/api/ai/status',route=>route.fulfill({json:{available:true}}));
  await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
  await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
  await page.locator('#charge-search').fill(query);const choice=page.getByTestId(`checkbox-charge-${id}`);
  await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
 });
}
