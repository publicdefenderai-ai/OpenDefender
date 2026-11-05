import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const require = createRequire(import.meta.url);
const proxyaddr = require('proxy-addr');
const qs = require('qs');
describe('targeted security dependency compatibility', () => {
  it('preserves safe formatted content while removing executable markup', () => {
    const dom = new JSDOM('');
    const purify = createDOMPurify(dom.window as any);
    const output = purify.sanitize('<p>Public information <strong>only</strong><img src=x onerror="alert(1)"><script>alert(2)</script></p>');
    expect(output).toContain('<strong>only</strong>');
    expect(output).not.toMatch(/onerror|<script/);
    dom.window.close();
  });
  it('does not trust an unrelated IPv4 address through an IPv4-mapped IPv6 subnet', () => {
    const trusted = proxyaddr.compile(['::ffff:192.0.2.0/120']);
    expect(trusted('192.0.2.5')).toBe(true);
    expect(trusted('198.51.100.5')).toBe(false);
  });
  it('preserves ordinary nested query parsing without prototype mutation', () => {
    expect(qs.parse('filter[state]=OH&ids[]=one&ids[]=two')).toEqual({filter:{state:'OH'},ids:['one','two']});
    qs.parse('__proto__[polluted]=yes&constructor[prototype][polluted]=yes');
    expect(({} as any).polluted).toBeUndefined();
  });
});
