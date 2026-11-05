import {describe,expect,it} from 'vitest';
import {quarterlyDeadline,validVerificationWindow,SOURCE_POLICY_JURISDICTIONS} from '../shared/source-verification-policy.mjs';
import {sourceInventory,probe,nextObservation} from '../scripts/source-monitor/check-availability';
import {readFileSync} from 'node:fs';
import {validateOhioChapter2903RefreshReceipt} from '../server/data/ohio-chapter-2903-refresh';
import {validateOhioReviewedRefreshReceipt} from '../server/data/ohio-reviewed-source';
import {californiaReceiptStatus} from '../shared/california-freshness-core.mjs';
const read=(name:string)=>JSON.parse(readFileSync(`scripts/data-review/output/${name}.json`,'utf8'));
describe('quarterly verification policy',()=>{
 it('uses calendar quarters with month-end clamping, preserving time',()=>{
  expect(quarterlyDeadline('2026-11-30T12:00:00Z')).toBe('2027-02-28T12:00:00.000Z');
  expect(quarterlyDeadline('2027-11-30T12:00:00Z')).toBe('2028-02-29T12:00:00.000Z');
  expect(quarterlyDeadline('2026-07-01T00:00:00Z')).toBe('2026-10-01T00:00:00.000Z');
 });
 it('does not reinterpret legacy dates or accept unknown policies',()=>{
  const receipt={checkedAt:'2026-10-01T00:00:00Z',expiresAt:'2027-01-01T00:00:00Z'};
  expect(validVerificationWindow(receipt)).toBe(false);
  expect(validVerificationWindow({...receipt,verificationPolicy:'quarterly-v1'})).toBe(true);
  expect(validVerificationWindow({...receipt,verificationPolicy:'forever'})).toBe(false);
 });
 it.each(['ohio-chapter-2903-refresh-receipt','ohio-reviewed-refresh-receipt'])('preserves bindings and legacy expiry for %s',name=>{
  const receipt=read(name),validate=name.includes('chapter')?validateOhioChapter2903RefreshReceipt:validateOhioReviewedRefreshReceipt;
  expect(validate(receipt,new Date(receipt.expiresAt))).not.toBeNull();
  const future={...receipt,verificationPolicy:'quarterly-v1',expiresAt:quarterlyDeadline(receipt.checkedAt),
    acquisitions:receipt.documents.map((d:any)=>({section:d.section,contentHash:d.contentHash,retrievedAt:receipt.checkedAt}))};
  expect(validate(future,new Date(receipt.expiresAt))).toBeNull();
  expect(validate(future,new Date(future.expiresAt))).not.toBeNull();
  future.documents.pop();expect(validate(future,new Date(receipt.checkedAt))).not.toBeNull();
 });
 it('keeps California version bindings and holds with a quarterly window',()=>{
  const receipt=read('california-archive-refresh-receipt'),comparison=read('california-retained-refresh-comparison');
  expect(californiaReceiptStatus(receipt,new Date(receipt.expiresAt),comparison)).toBe('stale');
  const quarterly={...receipt,verificationPolicy:'quarterly-v1',expiresAt:quarterlyDeadline(receipt.checkedAt)};
  expect(californiaReceiptStatus(quarterly,new Date(receipt.expiresAt),comparison)).toBe('current');
  expect(californiaReceiptStatus({...quarterly,observedArchiveSha256:'wrong'},new Date(receipt.checkedAt),comparison)).toBe('invalid');
 });
 it('covers all states and DC without calling portal reachability legal verification',async()=>{
  expect(SOURCE_POLICY_JURISDICTIONS).toHaveLength(52);
  const sources=sourceInventory();for(const state of SOURCE_POLICY_JURISDICTIONS.filter(s=>s!=='US'))expect(sources.some(s=>s.jurisdictions.includes(state)),state).toBe(true);
  const portal={url:'https://example.org',jurisdictions:['OH'],kind:'portal' as const,markers:[]};
  expect((await probe(portal,async()=>new Response('<html>legislature</html>',{headers:{'content-type':'text/html'}}))).status).toBe('portal_reachable_not_section_verified');
 });
 it('detects blocked HTTP 200 and does not follow redirects or approve missing content',async()=>{
  const source={url:'https://example.org',jurisdictions:['OH'],kind:'retained-section' as const,markers:['Section 2903.01']};
  expect((await probe(source,async()=>new Response('Access Denied',{headers:{'content-type':'text/html'}}))).status).toBe('access_blocked');
  expect((await probe(source,async()=>new Response('navigation',{headers:{'content-type':'text/html'}}))).status).toBe('content_unconfirmed');
  expect((await probe(source,async(_,init)=>{expect(init?.redirect).toBe('manual');return new Response('',{status:302});})).status).toBe('redirect_requires_review');
 });
 it('notifies on persistent failures, without repeating unchanged alerts',()=>{
  const first=nextObservation('access_blocked');expect(first.notify).toBe(false);
  const second=nextObservation('access_blocked',first);expect(second.notify).toBe(true);
  expect(nextObservation('access_blocked',second).notify).toBe(false);
 });
});
