import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { findSubdivisionRange } from '../server/data/florida-reviewed-source-records';
import rows from '../shared/florida-license-documents-publication.json';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { floridaLicenseDocumentsPacket, FLORIDA_LICENSE_DOCUMENTS_SOURCES, FLORIDA_LICENSE_DOCUMENTS_RECEIPT_PATH, validateFloridaLicenseDocumentsPacket, validateFloridaLicenseDocumentsReceipt } from '../server/data/florida-license-documents-source';
import { loadFloridaAuthorityManifest } from '../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../server/data/florida-source-database-seed';

const receipt = JSON.parse(readFileSync(FLORIDA_LICENSE_DOCUMENTS_RECEIPT_PATH, 'utf8'));
describe('Florida license-documents subdivisions', () => {
  it('binds each distinct choice and its localized guidance to the charged branch', () => {
    expect(FLORIDA_LICENSE_DOCUMENTS_SOURCES.map(source => source.code)).toEqual(["322.212(1)(a)", "322.212(1)(b)", "322.212(1)(c)", "322.212(1)(d)", "322.212(2)", "322.212(3)", "322.212(4)", "322.212(5)(a)", "322.212(5)(b)", "322.32(1)", "322.32(2)", "322.32(3)", "322.32(4)", "322.32(5)", "322.32(6)", "322.36(1)", "322.36(2)", "322.12(4)(e)"]);
    for (const {id, definition} of rows) {
      expect(getChargeById(id)?.code).toBe(definition.code);
      for (const language of ['en', 'es', 'zh'] as const) {
        expect(getChargeExplanation(definition.name, 'FL', language, id)?.plainSummary).toBe(definition.text[language].plainSummary);
      }
    }
  });
  it('distinguishes fraudulent application from its false-age exception and lender from test applicant', () => {
    const row = (code: string) => rows.find(r => r.definition.code === code)!.definition;
    expect(getChargeById(row('322.212(5)(a)').id)?.categories).toEqual(['felony','misdemeanor']);
    expect(row('322.212(5)(b)').text.en.degreeContext).toContain('60 days');
    expect(row('322.32(1)').text.en.plainSummary).toContain('Driving is not required');
    expect(row('322.36(1)').text.en.degreeContext).toContain('lender');
    expect(row('322.12(4)(e)').text.en.degreeContext).toContain('July 1, 2026');
    expect(row('322.36(2)').text.en.plainSummary).toContain('providing');
    expect(rows.some(r => r.definition.code === '322.37')).toBe(false);
  });
  it('resolves only the codified examination paragraph using its matching editor note', () => {
    const doc = Object.values(floridaLicenseDocumentsPacket.report.sourceEvidence).find(d => d.section === '322.12')!;
    const range = findSubdivisionRange(doc.text, '(4)(e)')[0];
    expect(doc.text.slice(range.start, range.end)).toContain('receives unauthorized assistance');
    const other = findSubdivisionRange(doc.text, '(4)(c)')[0];
    expect(doc.text.slice(other.start, other.end)).toContain('hazardous-materials endorsement');
    expect(findSubdivisionRange(doc.text.replace('1Note.', 'Absent note'), '(4)(e)')).toEqual([]);
  });
  it('rejects a changed, missing or reassigned supporting span', () => {
    for (const mutation of ['offset', 'missing', 'scope']) {
      const candidate = structuredClone(floridaLicenseDocumentsPacket);
      const spans = candidate.supportingSpans[0].sections;
      if (mutation === 'offset') spans[0].start++;
      if (mutation === 'missing') spans.pop();
      if (mutation === 'scope') spans[0].scope = '(99)';
      expect(() => validateFloridaLicenseDocumentsPacket(candidate)).toThrow();
    }
  });
  it('requires a valid acquisition-bound receipt at manifest generation and seed construction', () => {
    const fresh = new Date(receipt.checkedAt), expired = new Date(receipt.expiresAt);
    expect(validateFloridaLicenseDocumentsReceipt(receipt, fresh)).toBeNull();
    expect(validateFloridaLicenseDocumentsReceipt(receipt, expired)).not.toBeNull();
    expect(validateFloridaLicenseDocumentsReceipt({...receipt, reportHash:'wrong'}, fresh)).not.toBeNull();
    const manifest = loadFloridaAuthorityManifest(undefined, fresh);
    const freshSeed = buildFloridaSourceDatabaseSeed(manifest, fresh);
    const staleSeed = buildFloridaSourceDatabaseSeed(manifest, expired);
    for (const {id} of rows) {
      expect(freshSeed.selectableChargeIds).toContain(id);
      expect(staleSeed.selectableChargeIds).not.toContain(id);
    }
  });
});
