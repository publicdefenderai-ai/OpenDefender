import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchChargeCatalog } from '../client/src/lib/charge-catalog';
import { paginateCharges, parseChargePagination } from '../server/charge-pagination';

const records = Array.from({ length: 1021 }, (_, i) => ({ id: `test-charge-${i}`, name: `Charge ${i}` }));
function payload(rows = records, query: Record<string,string> = {}, totalAvailable = rows.length) {
  const page = paginateCharges(structuredClone(rows), totalAvailable, 'en', parseChargePagination(query));
  if (!page) return { success: false };
  return { success: true, ...page, count: page.charges.length, totalAvailable };
}
function serve(transform: (body: any, page: number) => any = body => body, rows = records, totalAvailable = rows.length) {
  let page = 0;
  const mock = vi.fn(async (url: string) => {
    const params = new URL(url, 'http://localhost').searchParams;
    const body = payload(rows, Object.fromEntries(['limit','offset','snapshot'].flatMap(k => params.has(k) ? [[k,params.get(k)!]] : [])), totalAvailable);
    return new Response(JSON.stringify(transform(body,page++)), { status: body.success ? 200 : 409 });
  });
  vi.stubGlobal('fetch', mock);
  return mock;
}
afterEach(() => vi.unstubAllGlobals());

describe('complete charge catalog pagination', () => {
  it('loads beyond 500 and 1000, preserving filters and an exact final page', async () => {
    const fetch = serve();
    const result = await fetchChargeCatalog({ jurisdiction:'CA', language:'es', search:'H&S 11377', category:'felony', group:'Drug Offenses' });
    expect(result.charges).toEqual(records);
    expect(result.count).toBe(1021);
    expect(fetch).toHaveBeenCalledTimes(3);
    for (const [index, call] of fetch.mock.calls.entries()) {
      const params = new URL(call[0], 'http://localhost').searchParams;
      expect(Object.fromEntries(params)).toMatchObject({ jurisdiction:'CA', language:'es', search:'H&S 11377', category:'felony', group:'Drug Offenses', limit:'500',offset:String(index*500) });
      expect(params.has('snapshot')).toBe(index>0);
    }
  });
  it('stops at a full final page and distinguishes matches from jurisdiction totals', async () => {
    const fetch = serve(b=>b, records.slice(0,500),1021);
    expect(await fetchChargeCatalog({jurisdiction:'CA',search:'selected'})).toMatchObject({count:500,totalAvailable:1021});
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('accepts an empty authority-gated catalog', async () => {
    serve(b=>b,[]);
    expect(await fetchChargeCatalog({jurisdiction:'CA'})).toEqual({charges:[],count:0,totalAvailable:0});
  });
  it('never returns the first page after a later network error', async () => {
    const fetch = serve();
    fetch.mockImplementationOnce(async () => new Response(JSON.stringify(payload(records,{limit:'500'}))))
      .mockRejectedValueOnce(new Error('network failure'));
    await expect(fetchChargeCatalog({jurisdiction:'CA'})).rejects.toThrow('network failure');
  });
  it.each([
    ['changed snapshot', (b:any) => {b.pagination.snapshot='a'.repeat(64);} ],
    ['changed total', (b:any) => {b.pagination.totalMatches++;} ],
    ['duplicate identity', (b:any) => {b.charges[0].id='test-charge-0';} ],
    ['short page', (b:any) => {b.charges.pop();b.count--;} ],
    ['looping continuation', (b:any) => {b.pagination.nextOffset=500;} ],
    ['early completion', (b:any) => {b.pagination.nextOffset=null;} ],
    ['missing metadata', (b:any) => {delete b.pagination;} ],
  ])('rejects %s rather than exposing partial results', async (_, corrupt) => {
    serve((body,page)=>{if(page===1)corrupt(body);return body;});
    await expect(fetchChargeCatalog({jurisdiction:'CA'})).rejects.toThrow();
  });
  it('passes cancellation through to every request', async () => {
    const fetch=serve();const controller=new AbortController();
    await fetchChargeCatalog({jurisdiction:'CA'},controller.signal);
    for(const call of fetch.mock.calls)expect((call as unknown[])[1]).toEqual({signal:controller.signal});
  });
});

describe('server charge page boundary', () => {
  it('caps page size and paginates the filtered list, without losing total availability', () => {
    expect(parseChargePagination({limit:'10000'}).limit).toBe(500);
    expect(parseChargePagination({})).toMatchObject({limit:200,offset:0});
    const first=payload(records,{limit:'500'});
    const second=payload(records,{limit:'500',offset:'500',snapshot:first.pagination!.snapshot});
    expect(second.charges?.[0].id).toBe('test-charge-500');
    expect(second.pagination).toMatchObject({totalMatches:1021,nextOffset:1000});
  });
  it.each([{limit:'-1'},{limit:'0'},{limit:['1']},{offset:'1.5'},{offset:'1e3'},{offset:'9007199254740992'},{offset:'500'},{snapshot:'invalid'}])('rejects malformed pagination %j', query => {
    expect(()=>parseChargePagination(query)).toThrow();
  });
  it('rejects continuation after a same-size membership swap, content edit, or authority expiry', () => {
    const first=payload(records,{limit:'500'});
    const continuation=parseChargePagination({limit:'500',offset:'500',snapshot:first.pagination!.snapshot});
    for(const changed of [records.slice(1),records.map((r,i)=>i===600?{...r,id:'replacement'}:r),records.map((r,i)=>i===600?{...r,name:'Changed penalty label'}:r)]) {
      expect(paginateCharges(changed,changed.length,'en',continuation)).toBeNull();
    }
    expect(paginateCharges(records,records.length,'es',continuation)).toBeNull();
  });
});
