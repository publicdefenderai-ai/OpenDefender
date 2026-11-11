/** Exercise the actual comparison without writing or reading an active receipt. */
import { readFileSync } from 'node:fs';
import { prepareOhioMajorQuarterlyReceipt, validateOhioMajorReceipt } from '../../server/data/ohio-major-source';

const comparison = JSON.parse(readFileSync('scripts/data-review/output/ohio-quarterly-comparison-candidate.json','utf8'));
const now = new Date();
const candidate = prepareOhioMajorQuarterlyReceipt(comparison, now);
const error = validateOhioMajorReceipt(candidate, now, comparison);
if (error) throw Error(error);
console.log(JSON.stringify({
  status:'candidate_valid_in_memory_only', sourceCount:candidate.acquisitions.length,
  comparisonHash:candidate.comparisonHash,
  oldestRetrieval:candidate.acquisitions.map(row=>row.retrievedAt).sort()[0],
  maximumExpiry:candidate.expiresAt,
}));
