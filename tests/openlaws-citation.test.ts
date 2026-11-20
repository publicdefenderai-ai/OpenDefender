import { beforeEach, expect, it, vi } from 'vitest';
import axios, { AxiosError, type AxiosAdapter } from 'axios';
import { federalStatuteLookups } from './fixtures/federal-statute-lookups';
vi.mock('../server/db', () => ({ db: {} }));
vi.mock('../server/services/operations-metrics', () => ({ recordProviderMetric: vi.fn() }));
import { OpenLawsClient } from '../server/services/openlaws-client';
import { createOpenLawsCitationHandler } from '../server/openlaws-citation-route';

const create = axios.create.bind(axios);
let calls: Array<{ url?: string; query: string }>;
let adapter: AxiosAdapter;
let client: OpenLawsClient;
function division(code: number, section: string) {
  return { jurisdiction_key: 'FED', law_key: 'FED-USC', path: `title_${code}.chapter_1.section_${section}`,
    identifier: section, display_name: `Section ${section}`, plaintext_content: `(a) Test text for ${code}/${section}\n(1) First\n(2) Second`,
    markdown_content: '1. Incorrect numbering', effective_date_start: '-Infinity' };
}
beforeEach(() => {
  vi.restoreAllMocks(); calls = [];
  adapter = async config => {
    calls.push({ url: config.url, query: config.params.query });
    const match = config.params.query.match(/(\d+) U\.S\.C\. § (\d+)/);
    return { config, status: 200, statusText: 'OK', headers: {}, data: division(Number(match[1]), match[2]) };
  };
  vi.spyOn(axios, 'create').mockImplementation(config => create({ ...config, adapter: c => adapter(c) }));
  client = new OpenLawsClient({ apiKey: 'test-only', baseUrl: 'https://provider.invalid/api/v1', timeout: 100 });
});

for (const item of federalStatuteLookups) it(`direct lookup: ${item.citation}`, async () => {
  const result = await client.searchByCitation(item.citation);
  expect(calls).toEqual([{ url: '/jurisdictions/FED/laws/citations', query: `${item.code} U.S.C. § ${item.section}` }]);
  expect(result).toMatchObject({ citation: item.citation, section: item.section, jurisdiction: 'FED',
    content: `(a) Test text for ${item.code}/${item.section}\n(1) First\n(2) Second` });
});
it('keeps all ten simultaneous results independent, including different titles', async () => {
  const results = await Promise.all(federalStatuteLookups.map(item => client.searchByCitation(item.citation)));
  expect(calls).toHaveLength(10);
  results.forEach((result, i) => expect(result?.content).toContain(`${federalStatuteLookups[i].code}/${federalStatuteLookups[i].section}`));
});
it('passes subsections and state citations intact to the provider', async () => {
  adapter = async config => {
    calls.push({ url: config.url, query: config.params.query });
    return { config, status: 200, statusText: 'OK', headers: {}, data: { ...division(18, '1001'), jurisdiction_key: 'CA', law_key: 'CA-STAT', path: 'penal.section_459', identifier: '459' } };
  };
  await client.searchByCitation('Cal. Penal Code § 459(a)');
  expect(calls).toEqual([{ url: '/jurisdictions/CA/laws/citations', query: 'Cal. Penal Code § 459(a)' }]);
});
it.each([401, 403, 429, 500, 503, 408])('does not turn provider HTTP %s into missing law', async status => {
  adapter = async config => { throw new AxiosError('provider failure', 'ERR_BAD_RESPONSE', config, undefined,
    { config, status, statusText: 'Failure', data: {}, headers: {} }); };
  await expect(client.searchByCitation('18 USC § 1343')).rejects.toMatchObject({ status: 503 });
});
it('only returns null for an explicit provider 404', async () => {
  adapter = async config => { throw new AxiosError('missing', '', config, undefined,
    { config, status: 404, statusText: 'Missing', data: {}, headers: {} }); };
  expect(await client.searchByCitation('18 USC § 1343')).toBeNull();
});
it.each([
  { ...division(21, '1343') },
  { ...division(18, '1341') },
  { ...division(18, '1343'), jurisdiction_key: 'CA' },
  { ...division(18, '1343'), plaintext_content: '', markdown_content: '' },
  { error: 'invalid response' },
])('rejects mismatched or empty provider text', async data => {
  adapter = async config => ({ config, status: 200, statusText: 'OK', headers: {}, data });
  await expect(client.searchByCitation('18 USC § 1343')).rejects.toMatchObject({ status: 503 });
});
it('preserves cancellation without reporting missing law', async () => {
  const controller = new AbortController(); controller.abort();
  await expect(client.searchByCitation('18 USC § 1343', { signal: controller.signal })).rejects.toMatchObject({ status: 503 });
});
it('maps provider outcomes per request even when requests overlap', async () => {
  adapter = async config => {
    if (config.params.query.includes('1343')) throw new AxiosError('quota', '', config, undefined,
      { config, status: 429, statusText: 'Quota', data: {}, headers: {} });
    return { config, status: 200, statusText: 'OK', headers: {}, data: division(18, '1001') };
  };
  const invoke = async (citation: string) => {
    let status = 200; let body: any;
    const res: any = { status: (n: number) => { status = n; return res; }, json: (value: unknown) => { body = value; return res; } };
    await createOpenLawsCitationHandler(client)({ params: { citation } } as any, res);
    return { status, body };
  };
  const [failed, success] = await Promise.all([invoke('18 USC § 1343'), invoke('18 USC § 1001')]);
  expect(failed).toEqual({ status: 503, body: { success: false, error: 'Statute lookup temporarily unavailable' } });
  expect(success.status).toBe(200);
  expect(success.body.statute.section).toBe('1001');
});
it('maps provider 400, explicit 404 and timeout to distinct HTTP outcomes', async () => {
  for (const upstream of [400, 404, 0]) {
    adapter = async config => {
      if (!upstream) throw new AxiosError('timeout', 'ECONNABORTED', config);
      throw new AxiosError('provider response', '', config, undefined,
        { config, status: upstream, statusText: 'Error', data: {}, headers: {} });
    };
    let status = 200; let body: any;
    const res: any = { status: (n: number) => { status = n; return res; }, json: (value: unknown) => { body = value; return res; } };
    await createOpenLawsCitationHandler(client)({ params: { citation: '18 USC § 1343' } } as any, res);
    expect(status).toBe(upstream || 503);
    expect(body.error).toBe(upstream === 400 ? 'Invalid citation format' : upstream === 404 ? 'Statute not found' : 'Statute lookup temporarily unavailable');
  }
});
it('rejects malformed user input before contacting the provider', async () => {
  let status = 200;
  const res: any = { status: (n: number) => { status = n; return res; }, json: () => res };
  await createOpenLawsCitationHandler(client)({ params: { citation: '<script>' } } as any, res);
  expect(status).toBe(400);
  expect(calls).toHaveLength(0);
});
