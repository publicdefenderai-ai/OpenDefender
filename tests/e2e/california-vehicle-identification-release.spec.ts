import {readCaliforniaCatalog} from "./helpers/california-catalog";
import {CA_CATALOG_COUNTS} from "../fixtures/california-catalog-counts";
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const additions=JSON.parse(readFileSync('shared/california-vehicle-identification-additions.json','utf8')) as Array<{id:string;code:string;summary:string;penalty:string;categories:string[]}>;
test('Vehicle-identification and duty choices reach authority-gated API and rules guidance',async({request})=>{
  const body = await readCaliforniaCatalog(request);expect(body.charges).toHaveLength(CA_CATALOG_COUNTS.eligible);
  for(const a of additions)expect(body.charges.find((r:any)=>r.id===a.id),a.id).toMatchObject({description:a.summary,maxPenalty:a.penalty,categories:a.categories});
  expect(body.charges.some((r:any)=>r.id==='ca-possession-of-prohibited-weapon')).toBe(false);
  const ids=['ca-veh-10803-a','ca-veh-10803-b','ca-veh-10751-a','ca-veh-10501-a'];
  const result=await request.post('/api/legal-guidance/rules',{headers:{Origin:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:5001'},data:{jurisdiction:'CA',charges:ids,caseStage:'arrest',custodyStatus:'in_custody'}});
  expect(result.ok()).toBe(true);
  const guidance=(await result.json()).guidance;
  for(const id of ids)expect(guidance.chargeClassifications.find((r:any)=>r.id===id)).toMatchObject({maxPenalty:additions.find(a=>a.id===id)!.penalty,categories:additions.find(a=>a.id===id)!.categories});
});
for(const [query,id] of [['chop shop','ca-veh-10801'],['VC 10803(b)','ca-veh-10803-b'],['runaway parked vehicle','ca-veh-20002-b']]){
  test(`charging-paper search finds ${id}`,async({page})=>{
    await page.route('**/api/ai/status',r=>r.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);
    const choice=page.getByTestId(`checkbox-charge-${id}`);await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}
