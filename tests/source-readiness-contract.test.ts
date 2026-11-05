import { describe, expect, it } from 'vitest';
// @ts-expect-error The production-artifact checker is dependency-free JavaScript.
import { assertReadinessRow } from '../scripts/release-check/source-readiness-contract.mjs';
import { buildPublicSourceCoverageReport } from '../server/data/public-source-coverage';
const rows = buildPublicSourceCoverageReport().jurisdictions;
describe('production readiness response contract', () => {
  it('accepts every real jurisdiction row, including California mapping accounting', () => {
    expect(rows.some(row => row.jurisdiction === 'CA')).toBe(true);
    for (const row of rows) expect(() => assertReadinessRow(row)).not.toThrow();
  });
  it('rejects omitted fields and unexpected potentially sensitive fields', () => {
    const row = {...rows[0]} as any;
    delete row.automatedCandidateRows;
    expect(() => assertReadinessRow(row)).toThrow('envelope');
    expect(() => assertReadinessRow({...rows[0], stack: 'private diagnostic'})).toThrow('envelope');
    expect(() => assertReadinessRow({...rows[0], databaseUrl: 'forbidden'})).toThrow('envelope');
  });
  it('rejects malformed counts rather than merely allowing new field names', () => {
    for (const value of [-1, NaN, '3']) expect(() => assertReadinessRow({...rows[0], automatedCandidateRows: value})).toThrow();
    expect(() => assertReadinessRow({...rows[0], mappingClassificationCounts: {unknown: -1}})).toThrow();
    expect(() => assertReadinessRow({...rows[0], mappingClassificationCounts: []})).toThrow();
  });
});
