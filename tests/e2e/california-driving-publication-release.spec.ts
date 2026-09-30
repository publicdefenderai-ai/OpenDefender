import {readCaliforniaCatalog} from "./helpers/california-catalog";
import {CA_CATALOG_COUNTS} from "../fixtures/california-catalog-counts";
import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const additions=JSON.parse(readFileSync('shared/california-driving-vessels-additions.json','utf8')) as Array<{id:string;code:string;summary:string;penalty:string;categories:string[]}>;
test('driving/vessel choices reach authority-gated API and rules guidance',async({request})=>{
  const body = await readCaliforniaCatalog(request);expect(body.charges).toHaveLength(CA_CATALOG_COUNTS.eligible);
  for(const a of additions)expect(body.charges.find((r:any)=>r.id===a.id),a.id).toMatchObject({description:a.summary,maxPenalty:a.penalty,categories:a.categories});
  expect(body.charges.some((r:any)=>r.id==='ca-possession-of-prohibited-weapon')).toBe(true);
  const ids=['ca-veh-2800-3-a','ca-pen-192-5-b','ca-hnc-655-f','ca-hnc-655-4-b'];
  const result=await request.post('/api/legal-guidance/rules',{headers:{Origin:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:5001'},data:{jurisdiction:'CA',charges:ids,caseStage:'arrest',custodyStatus:'in_custody'}});
  expect(result.ok()).toBe(true);
  const guidance=(await result.json()).guidance;
  for(const id of ids)expect(guidance.chargeClassifications.find((r:any)=>r.id===id)).toMatchObject({maxPenalty:additions.find(a=>a.id===id)!.penalty,categories:additions.find(a=>a.id===id)!.categories});
});
for(const [query,id] of [['boating DUI causing injury','ca-hnc-655-f'],['VC 20001(a)','ca-veh-20001-b-2'],['192.5(b)','ca-pen-192-5-b']]){
  test(`charging-paper search finds ${id}`,async({page})=>{
    await page.route('**/api/ai/status',r=>r.fulfill({json:{available:true}}));
    await page.goto('/case-guidance');await page.getByTestId('button-start-guidance').click();await page.getByTestId('button-choose-ai').click();
    await page.getByTestId('select-jurisdiction').click();await page.getByRole('option',{name:'California',exact:true}).click();await page.getByTestId('button-next-jurisdiction').click();
    await page.locator('#charge-search').fill(query);
    const choice=page.getByTestId(`checkbox-charge-${id}`);await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
  });
}

test('common statutory abbreviations find current California charges through API search',async({request})=>{
  for(const [query,id] of [['VC 2800.2','ca-veh-2800-2'],['H&S 11350','ca-possession-of-controlled-substance'],['H&S 11377','ca-hsc-11377-a'],['H&N 655(f)','ca-hnc-655-f'],['VC 20001(a)','ca-veh-20001-b-1']]){
    const response=await request.get(`/api/criminal-charges?jurisdiction=CA&search=${encodeURIComponent(query)}`);
    expect(response.ok()).toBe(true);
    expect((await response.json()).charges.some((r:any)=>r.id===id),query).toBe(true);
  }
});
