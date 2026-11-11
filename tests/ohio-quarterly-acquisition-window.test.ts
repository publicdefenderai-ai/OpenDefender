import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { quarterlyDeadline } from '../shared/source-verification-policy.mjs';
import { ohioReviewedExpectedDocuments, validateOhioReviewedRefreshReceipt, OHIO_REVIEWED_RECEIPT_PATH } from '../server/data/ohio-reviewed-source';
import { buildOhioReviewedQuarterlyReceipt } from '../scripts/data-review/refresh-ohio-reviewed-sources';
const checked = new Date('2026-11-05T12:00:00Z');
const oldest = '2026-11-01T09:00:00.000Z';
const acquisitions = () => ohioReviewedExpectedDocuments().map((doc,index) => ({
  section:doc.section,contentHash:doc.contentHash,
  retrievedAt:index===0?oldest:'2026-11-04T12:00:00.000Z',
}));
const fixture = () => buildOhioReviewedQuarterlyReceipt(acquisitions(),checked);
describe('Ohio reviewed quarterly acquisition anchor',()=>{
 it('issues from the oldest acquisition and accepts the exact supported ceiling',()=>{
  const receipt=fixture();
  expect(receipt.expiresAt).toBe('2027-02-01T09:00:00.000Z');
  expect(receipt.acquisitions).toHaveLength(receipt.documents.length);
  expect(validateOhioReviewedRefreshReceipt(receipt,checked)).toBeNull();
  expect(validateOhioReviewedRefreshReceipt(receipt,new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
  expect(validateOhioReviewedRefreshReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
 });
 it('rejects an expiry anchored to the later review time, even though that fits a review-based quarter',()=>{
  const receipt=fixture();receipt.expiresAt=quarterlyDeadline(receipt.checkedAt);
  expect(validateOhioReviewedRefreshReceipt(receipt,checked)).toContain('oldest acquisition');
  receipt.expiresAt=new Date(Date.parse(quarterlyDeadline(oldest))+1).toISOString();
  expect(validateOhioReviewedRefreshReceipt(receipt,checked)).toContain('oldest acquisition');
 });
 it('cannot extend the window by regenerating or delaying review without new acquisitions',()=>{
  expect(buildOhioReviewedQuarterlyReceipt(acquisitions(),new Date('2026-11-10T12:00:00Z')).expiresAt).toBe(fixture().expiresAt);
  expect(()=>buildOhioReviewedQuarterlyReceipt(acquisitions(),new Date('2027-02-02T12:00:00Z'))).toThrow();
 });
 it.each(['missing','duplicate','unknown','wrong_hash','invalid_time','future_time','absent_array'] as const)('rejects %s acquisition evidence',kind=>{
  const receipt=fixture();
  if(kind==='missing')receipt.acquisitions.pop();
  if(kind==='duplicate')receipt.acquisitions[1]={...receipt.acquisitions[0]};
  if(kind==='unknown')receipt.acquisitions[0].section='9999.999';
  if(kind==='wrong_hash')receipt.acquisitions[0].contentHash='0'.repeat(64);
  if(kind==='invalid_time')receipt.acquisitions[0].retrievedAt='invalid';
  if(kind==='future_time')receipt.acquisitions[0].retrievedAt='2026-11-06T12:00:00Z';
  if(kind==='absent_array')delete (receipt as any).acquisitions;
  expect(validateOhioReviewedRefreshReceipt(receipt,checked)).not.toBeNull();
 });
 it('rejects invalid acquisition input at issuance rather than writing an unusable receipt',()=>{
  const docs=acquisitions();docs.pop();
  expect(()=>buildOhioReviewedQuarterlyReceipt(docs,checked)).toThrow('complete acquisition');
  expect(()=>buildOhioReviewedQuarterlyReceipt([],checked)).toThrow('Missing source acquisition');
 });
 it('preserves the legacy seven-day boundary and leaves the committed receipt unchanged',()=>{
  const bytes=readFileSync(OHIO_REVIEWED_RECEIPT_PATH,'utf8');const current=JSON.parse(bytes);
  const receipt={ schemaVersion: 1, reportHash: current.reportHash, documents: current.documents,
    checkedAt: '2026-11-03T06:05:55.510Z', expiresAt: '2026-11-10T06:05:55.510Z' };
  expect(validateOhioReviewedRefreshReceipt(receipt,new Date(receipt.checkedAt))).toBeNull();
  expect(validateOhioReviewedRefreshReceipt(receipt,new Date(receipt.expiresAt))).not.toBeNull();
  fixture();expect(readFileSync(OHIO_REVIEWED_RECEIPT_PATH,'utf8')).toBe(bytes);
 });
});
