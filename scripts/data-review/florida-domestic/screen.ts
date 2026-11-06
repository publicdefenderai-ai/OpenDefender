import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../../../shared/florida-reviewed-batch';
import plan from './correction-plan.json';
const packet = JSON.parse(fs.readFileSync('scripts/data-review/output/florida-domestic-corrections.json', 'utf8'));
const corrected = new Set(plan.records.map(r => r.id));
const namedSections = new Set(['784.011', '784.021', '784.03', '784.041', '784.045', '784.048', '794.011', '787.01', '787.02']);
const injuryPriority = new Set(['782.07', '782.04', '316.193', '825.102', '827.03']);
const rows = FLORIDA_REVIEWED_DEFINITIONS.map(d => {
    const section = d.code.match(/^\d+\.\d+/)![0];
    const classification = corrected.has(d.id) ? 'corrected_current_batch' : namedSections.has(section) ? 'enumerated_family_remaining_branch_review' : injuryPriority.has(section) ? 'injury_or_death_condition_priority' : 'residual_factual_condition_not_cleared';
    return { id: d.id, code: d.code, name: d.name, classification, sourceUrl: d.citations[0].url, disposition: corrected.has(d.id) ? 'Corrected product content and evidence; committed receipt unchanged and unable to approve the new hashes.' : section === '741.31' ? 'Separate section 741.31(4)(c) repeat-injunction amendment in chapter 2026-86 also requires reconciliation; not cleared by this screen.' : classification === 'enumerated_family_remaining_branch_review' ? 'Family enumerated in section 741.28; reconcile exact branch, original grade and section 741.2801 scope before restoration.' : 'No exclusion is inferred from the offense label. The residual section 741.28 clause depends on a criminal offense resulting in physical injury or death between qualifying family or household members. Case-specific applicability remains unresolved.' };
});
if (rows.length !== 101 || new Set(rows.map(r => r.id)).size !== 101)
    throw Error('Expected the separately reviewed 101-record family');
const counts = Object.fromEntries([...new Set(rows.map(r => r.classification))].map(k => [k, rows.filter(r => r.classification === k).length]));
const value = { schemaVersion: 1, scope: 'targeted_741_2801_applicability_screen_not_statewide_legal_clearance', catalogIdsSha256: createHash('sha256').update(JSON.stringify(rows.map(r => r.id))).digest('hex'), sources: ['741.28', '741.2801'].map(s => ({ section: s, sourceUrl: packet.documents[s].sourceUrl, contentHash: packet.documents[s].contentHash, retrievedAt: packet.documents[s].retrievedAt })), counts, rows };
const path = 'scripts/data-review/output/florida-domestic-applicability-screen.json', text = JSON.stringify(value, null, 2) + '\n';
if (process.argv.includes('--check')) {
    if (fs.readFileSync(path, 'utf8') !== text)
        throw Error('Florida domestic screen drift');
}
else
    fs.writeFileSync(path, text);
console.log(JSON.stringify(counts));
