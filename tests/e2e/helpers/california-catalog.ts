import {expect,type APIRequestContext} from '@playwright/test';

/** Exercise real pagination rather than assuming a state fits in one response. */
export async function readCaliforniaCatalog(request:APIRequestContext) {
  const charges:any[]=[];
  let offset=0,snapshot:string|undefined,totalAvailable:number|undefined;
  for(let page=0;page<100;page++) {
    const params=new URLSearchParams({jurisdiction:'CA',limit:'500',offset:String(offset)});
    if(snapshot)params.set('snapshot',snapshot);
    const response=await request.get(`/api/criminal-charges?${params}`);
    expect(response.ok()).toBe(true);
    const body=await response.json();
    expect(body.success).toBe(true);
    expect(body.pagination.offset).toBe(offset);
    if(snapshot)expect(body.pagination.snapshot).toBe(snapshot);
    if(totalAvailable!==undefined)expect(body.totalAvailable).toBe(totalAvailable);
    snapshot=body.pagination.snapshot;totalAvailable=body.totalAvailable;
    charges.push(...body.charges);
    if(body.pagination.nextOffset===null){
      expect(charges).toHaveLength(body.pagination.totalMatches);
      expect(new Set(charges.map(c=>c.id)).size).toBe(charges.length);
      return {charges,count:charges.length,totalAvailable};
    }
    expect(body.pagination.nextOffset).toBeGreaterThan(offset);
    offset=body.pagination.nextOffset;
  }
  throw new Error('California catalog pagination did not finish');
}
