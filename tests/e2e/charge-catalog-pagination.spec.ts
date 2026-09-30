import {expect,test, type Page} from '@playwright/test';

async function openCalifornia(page:Page) {
  await page.route('**/api/ai/status',r=>r.fulfill({json:{available:true}}));
  await page.goto('/case-guidance');
  await page.getByTestId('button-start-guidance').click();
  await page.getByTestId('button-choose-ai').click();
  await page.getByTestId('select-jurisdiction').click();
  await page.getByRole('option',{name:'California',exact:true}).click();
  await page.getByTestId('button-next-jurisdiction').click();
}

test('API pages preserve filters, reject changed continuations and retain the page-size bound',async({request})=>{
  const base='/api/criminal-charges?jurisdiction=CA&limit=7';
  const first=await request.get(base);expect(first.ok()).toBe(true);
  const a=await first.json();expect(a.charges).toHaveLength(7);
  expect(a.pagination).toMatchObject({offset:0,limit:7,nextOffset:7});
  const second=await request.get(`${base}&offset=7&snapshot=${a.pagination.snapshot}`);
  expect(second.ok()).toBe(true);const b=await second.json();
  expect(b.charges).toHaveLength(7);expect(b.pagination.snapshot).toBe(a.pagination.snapshot);
  expect(new Set([...a.charges,...b.charges].map(c=>c.id)).size).toBe(14);
  const changed=await request.get(`${base}&offset=7&snapshot=${a.pagination.snapshot}&search=nonexistent-pagination-test-charge`);
  expect(changed.status()).toBe(409);
  expect((await request.get(`${base}&offset=7`)).status()).toBe(400);
  expect((await request.get('/api/criminal-charges?limit=-1')).status()).toBe(400);
  const capped=await (await request.get('/api/criminal-charges?limit=9999')).json();
  expect(capped.charges.length).toBeLessThanOrEqual(500);expect(capped.pagination.limit).toBe(500);
  const filtered=await (await request.get('/api/criminal-charges?jurisdiction=CA&search=PC%2029805(g)&limit=500')).json();
  expect(filtered.charges.some((r:any)=>r.id==='ca-pen-29805-g')).toBe(true);
  expect(filtered.pagination.totalMatches).toBe(filtered.charges.length);
  expect(filtered.totalAvailable).toBeGreaterThan(filtered.pagination.totalMatches);
});

for(const failSecondPage of [false,true]) {
  test(`questionnaire ${failSecondPage?'rejects partial catalog':'finds a charge beyond the first 500'}`,async({page})=>{
    const seen:number[]=[];
    const rows=Array.from({length:501},(_,i)=>({id:`pagination-example-${i}`,name:`Pagination example ${i}`,description:'Synthetic test fixture',category:'misdemeanor',code:String(i)}));
    await page.route('**/api/criminal-charges?**',async route=>{
      const u=new URL(route.request().url());const offset=Number(u.searchParams.get('offset'));seen.push(offset);
      if(offset===500&&failSecondPage){await route.fulfill({status:503,json:{success:false}});return;}
      const charges=rows.slice(offset,offset+500);
      await route.fulfill({json:{success:true,charges,count:charges.length,totalAvailable:501,pagination:{offset,limit:500,totalMatches:501,nextOffset:offset===0?500:null,snapshot:'a'.repeat(64)}}});
    });
    await openCalifornia(page);
    await expect.poll(()=>seen.includes(500)).toBe(true);
    await page.locator('#charge-search').fill(failSecondPage?'Pagination example 0':'Pagination example 500');
    if(failSecondPage){
      await expect(page.getByText('No charges found. Try a different search term or category.')).toBeVisible();
      await expect(page.getByTestId('checkbox-charge-pagination-example-0')).toHaveCount(0);
    }else{
      const choice=page.getByTestId('checkbox-charge-pagination-example-500');
      await expect(choice).toBeVisible();await choice.locator('..').click();await expect(choice).toBeChecked();
    }
  });
}
