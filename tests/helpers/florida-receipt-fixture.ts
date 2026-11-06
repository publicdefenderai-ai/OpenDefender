import { createHash } from 'node:crypto';
import report from '../../scripts/data-review/output/florida-reviewed-analysis.json';
import eligibility from '../../shared/florida-reviewed-eligibility.json';
import { quarterlyDeadline } from '../../shared/source-verification-policy.mjs';
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const documents = Object.values(report.sourceEvidence);
const oldest = Math.min(...documents.map(d => Date.parse(d.retrievedAt)));
const newest = Math.max(...documents.map(d => Date.parse(d.retrievedAt)));
/** TEST ONLY: exercises approval/freshness boundaries for corrected evidence. This does not issue a production receipt. */
export const syntheticFloridaReceipt = { schemaVersion: 1, verificationPolicy: 'quarterly-v1', reportHash: hash(report), eligibilityHash: hash(eligibility), checkedAt: new Date(newest).toISOString(), expiresAt: quarterlyDeadline(new Date(oldest).toISOString()), documents: documents.map(d => ({ sourceKey: d.sourceKey, contentHash: d.contentHash, retrievedAt: d.retrievedAt })) };
