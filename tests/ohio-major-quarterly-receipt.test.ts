import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import {
  ohioMajorPacket, prepareOhioMajorQuarterlyReceipt, validateOhioMajorReceipt,
} from '../server/data/ohio-major-source';
import active from '../scripts/data-review/output/ohio-major-refresh-receipt.json';
import { quarterlyDeadline } from '../shared/source-verification-policy.mjs';

const originalTimes = Object.values(ohioMajorPacket.documents).map(doc=>Date.parse(doc.retrievedAt));
const acquiredStart = Math.max(...originalTimes) + 8 * 86400000;
// Isolated comparison fixture. A later change to the working research candidate or
// actual receipt cannot turn a test of the validator into a test of today's clock.
const comparison = {schemaVersion:1,purpose:'candidate_source_comparison_only',
  sources:Object.values(ohioMajorPacket.documents).map((doc,index)=>{
    const identity={contentHash:doc.contentHash,title:doc.title,effectiveDateStart:doc.effectiveDateStart};
    return {url:doc.sourceUrl,httpStatus:200,retrievedAt:new Date(acquiredStart+index*1000).toISOString(),
      pageHash:createHash('sha256').update('synthetic test HTML for '+doc.section).digest('hex'),
      comparisons:[{family:'major',section:doc.section,expected:identity,observed:{...identity},status:'unchanged',
        chargeIds:ohioMajorPacket.records.filter(r=>r.section===doc.section||r.dependencies.includes(doc.section)).map(r=>r.id)}]};
  })};
const majorSources = comparison.sources.filter((source: any) => source.comparisons.some((row: any) => row.family === 'major'));
const acquired = majorSources.map((source: any) => Date.parse(source.retrievedAt));
const issued = new Date(Math.max(...acquired));
const receipt = prepareOhioMajorQuarterlyReceipt(comparison, issued);

describe('Ohio major unchanged quarterly comparisons', () => {
  it('validates the complete ledger and preserves the approved packet reacquisition window', () => {
    expect(receipt.acquisitions).toHaveLength(38);
    expect(receipt.expiresAt).toBe(quarterlyDeadline(Math.min(...acquired)));
    expect(validateOhioMajorReceipt(receipt, issued, comparison)).toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(Date.parse(receipt.expiresAt)-1), comparison)).toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(Date.parse(receipt.expiresAt)), comparison)).not.toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(issued.getTime()-1), comparison)).not.toBeNull();
    expect(validateOhioMajorReceipt(receipt, issued)).not.toBeNull();
    expect(validateOhioMajorReceipt(active,new Date(active.checkedAt))).toBeNull();
    expect(validateOhioMajorReceipt(active,new Date(active.expiresAt))).not.toBeNull();
    expect(validateOhioMajorReceipt({...active,kind:'initial_acquired_evidence_window'},new Date(active.checkedAt))).not.toBeNull();
  });
  it('rejects changed, missing, duplicate or invented retrieval claims and excessive duration', () => {
    const [first,...rest] = receipt.acquisitions;
    for (const key of Object.keys(first) as Array<keyof typeof first>) {
      expect(validateOhioMajorReceipt({...receipt,acquisitions:[{...first,[key]:'changed'},...rest]},issued,comparison)).not.toBeNull();
    }
    for (const invalid of [
      {...receipt,acquisitions:rest}, {...receipt,acquisitions:[first,first,...rest.slice(1)]},
      {...receipt,packetHash:'bad'}, {...receipt,comparisonHash:'bad'},
      {...receipt,kind:'initial_acquired_evidence_window'}, {...receipt,verificationPolicy:'unknown'},
      {...receipt,expiresAt:new Date(Date.parse(receipt.expiresAt)+1).toISOString()},
    ]) expect(validateOhioMajorReceipt(invalid,issued,comparison)).not.toBeNull();
    expect(()=>prepareOhioMajorQuarterlyReceipt(comparison,new Date(receipt.expiresAt))).toThrow();
  });
  it.each(['missing','duplicate','unexpected','status','http','url','missingObserved','title','date','hash','pageHash','retrieval','future','ids','expected'] as const)(
    'rejects a %s discrepancy even if the supplied comparison digest is recomputed', kind => {
      const changed:any=structuredClone(comparison);
      const source=changed.sources.find((source:any)=>source.comparisons.some((row:any)=>row.family==='major'));
      const row=source.comparisons.find((row:any)=>row.family==='major');
      if(kind==='missing') changed.sources=changed.sources.filter((s:any)=>s!==source);
      if(kind==='duplicate') changed.sources.push(source);
      if(kind==='unexpected') row.section='9999.99';
      if(kind==='status') row.status='changed';
      if(kind==='http') source.httpStatus=404;
      if(kind==='url') source.url+='?future';
      if(kind==='missingObserved') row.observed=null;
      if(kind==='title') row.observed.title+=' amended';
      if(kind==='date') row.observed.effectiveDateStart='2099-01-01';
      if(kind==='hash') row.observed.contentHash='0'.repeat(64);
      if(kind==='pageHash') source.pageHash='missing';
      if(kind==='retrieval') source.retrievedAt='2000-01-01T00:00:00.000Z';
      if(kind==='future') source.retrievedAt=new Date(issued.getTime()+1).toISOString();
      if(kind==='ids') row.chargeIds.pop();
      if(kind==='expected') row.expected.contentHash='0'.repeat(64);
      const comparisonHash=createHash('sha256').update(JSON.stringify(changed)).digest('hex');
      expect(validateOhioMajorReceipt({...receipt,comparisonHash},issued,changed)).not.toBeNull();
      expect(()=>prepareOhioMajorQuarterlyReceipt(changed,issued)).toThrow();
    },
  );
  it('binds acquisition times to the frozen comparison as well as the oldest retrieval',()=>{
    const changed=structuredClone(comparison);
    const source=changed.sources.find((source:any)=>source.comparisons.some((r:any)=>r.family==='major'));
    source.retrievedAt=issued.toISOString();
    expect(validateOhioMajorReceipt(receipt,issued,changed)).not.toBeNull();
  });
});
