import {californiaReceiptStatus} from '../shared/california-freshness-core.mjs';
import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import decisions from '../shared/california-attorney-decisions.json';
import evidence from '../scripts/data-review/output/california-attorney-decision-review.json';
import approval from '../scripts/data-review/output/california-attorney-source-approval.json';
import comparison from '../scripts/data-review/output/california-retained-refresh-comparison.json';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';
import {getChargeById} from '../shared/criminal-charges';
import {getChargeExplanation} from '../shared/charge-explanations';
import {getCaliforniaCanonicalRecord,getCaliforniaRecordEvidenceStatus} from '../shared/california-authority';
import {reviewedCaliforniaPenalty} from '../shared/california-attorney-decisions';
import {californiaTransitionRequiresReview} from '../shared/california-source-transitions';
const hash=(text:string|Buffer)=>createHash('sha256').update(text).digest('hex');
describe('California attorney decisions reach runtime without reopening historical evidence',()=>{
  it('binds every decision, complete source span and approved successor',()=>{
    expect(decisions).toHaveLength(4);
    expect(evidence.decisionsSha256).toBe(hash(fs.readFileSync('shared/california-attorney-decisions.json')));
    expect(evidence.successorSha256).toBe(hash(fs.readFileSync('scripts/data-review/output/california-attorney-source-approval.json')));
    for(const row of evidence.evidence){
      const versions=(evidence.documents as Record<string,Array<{versionId:string;contentXml:string;contentSha256:string}>>)[row.key];
      const doc=versions.find(v=>v.versionId===row.versionId)!;
      expect(hash(doc.contentXml)).toBe(row.contentSha256);
      expect(doc.contentXml.slice(row.span.start,row.span.end)).toBe(row.span.text);
    }
    for(const row of decisions){
      for(const key of row.requiredKeys)expect(evidence.documents).toHaveProperty(key);
      expect(()=>reviewedCaliforniaPenalty(row.id,row.previousPenalty+' altered')).toThrow('baseline drift');
    }
  });
  it('delivers approved text by exact identity in catalog, canonical data and all locale fallbacks',()=>{
    for(const decision of decisions){
      expect(getChargeById(decision.id)!.maxPenalty).toBe(decision.penalty);
      expect(getCaliforniaCanonicalRecord(decision.id)!.penalty).toBe(decision.penalty);
      for(const lang of ['en','es','zh']){
        const e=getChargeExplanation('name deliberately ignored','CA',lang,decision.id)!;
        expect(e.degreeContext).toBe(decision.penalty);
        expect(e.untranslated).toBe(lang!=='en');
        expect(e.translationDraft).toBe(false);
      }
    }
    expect(getChargeById('ca-failure-to-pay-child-support')!.maxPenalty).toContain('prior section 270 conviction');
    expect(getChargeById('ca-illegal-fireworks-12677')!.maxPenalty).toContain('likely interpretation');
    const fine=getChargeById('ca-pen-237-a')!.maxPenalty;
    expect(fine).toContain('If sentenced as a felony');expect(fine).toContain('discretionary');expect(fine).toContain('$10,000');
    expect(getCaliforniaCanonicalRecord('ca-pen-237-a')!.sources.some(s=>s.url.includes('sectionNum=672'))).toBe(true);
  });
  it('restores possession without renewing currency, and gates expiry and the 2029 transition',()=>{
    expect(receipt.checkedAt).toBe('2026-09-28T04:30:01.918254+00:00');
    expect(receipt.expiresAt).toBe('2026-10-05T04:30:01.918254+00:00');
    expect(comparison.heldSourceKeys).toEqual([]);
    expect(californiaReceiptStatus({...receipt,method:'full_archive_comparison'},new Date('2026-09-30T12:00:00Z'),comparison,['PEN:30515'])).toBe('invalid');
    const row=getCaliforniaCanonicalRecord('ca-possession-of-prohibited-weapon')!;
    expect(getCaliforniaRecordEvidenceStatus(row,new Date('2026-09-30T12:00:00Z'))).toBe('current');
    expect(getCaliforniaRecordEvidenceStatus(row,new Date(receipt.expiresAt))).toBe('stale');
    expect(californiaTransitionRequiresReview(['PEN:30515'],new Date('2029-01-01T07:59:59Z'))).toBe(false);
    expect(californiaTransitionRequiresReview(['PEN:30515'],new Date('2029-01-01T08:00:00Z'))).toBe(true);
    const current=approval.documents['PEN:30515'].find(v=>v.versionId===approval.operativeVersionId)!;
    expect(current.history).toContain('Sec. 6');
    expect(approval.candidate).toEqual(comparison.candidate);
    expect(current.effectiveDate.slice(0,10)).toBe('2026-09-20');
    expect(approval.documents['PEN:30515'][1].history).toContain('Operative January 1, 2029');
    expect(current.contentXml).toContain('January 1, 2029');
    const featureText=(xml:string)=>xml.slice(0,xml.indexOf('<p>(c)'));
    expect(featureText(approval.documents['PEN:30515'][0].contentXml)).toBe(featureText(approval.documents['PEN:30515'][1].contentXml));
  });
});
