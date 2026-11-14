/** Read-only offline reconciliation against the captured public observation. */
import { createHash } from 'node:crypto';
import { getChargeById, getSelectableCharges, isChargeIdRequiringReselection } from '../../shared/criminal-charges';
import { isReviewedOhioChargeId } from '../../shared/ohio-reviewed-identity';
import observation from './output/ohio-first-launch-observation.json';
import holds from '../../shared/ohio-source-change-holds.json';
import eligibility from '../../shared/ohio-reviewed-eligibility.json';
import { OHIO_REVIEWED_SOURCES } from '../../server/data/ohio-reviewed-source';
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from '../../server/data/ohio-chapter-2903-source';
import { OHIO_PROTECTION_SOURCES } from '../../server/data/ohio-protection-source';
import { OHIO_RESIDUAL_SOURCES } from '../../server/data/ohio-residual-source';
import { OHIO_PRIVACY_SOURCES } from '../../server/data/ohio-privacy-source';
import { OHIO_PRIORITY_GAPS_SOURCES } from '../../server/data/ohio-priority-gaps-source';

const { publicChoices, pagination } = observation.observation;
const live = new Set(publicChoices.map(r => r.id));
if (live.size !== publicChoices.length || live.size !== pagination.totalMatches ||
    pagination.offset !== 0 || pagination.nextOffset !== null || !pagination.snapshot) {
  throw Error('Captured public selector is incomplete or contains duplicate IDs');
}
const catalog = getSelectableCharges().filter(c => c.jurisdiction === 'OH');
const configured = new Set(catalog.map(c => c.id));
const reviewed = new Set(catalog.filter(c => isReviewedOhioChargeId(c.id)).map(c => c.id));
type BoundPrimary = {group:string; doc:{section:string;sourceUrl:string;text:string;contentHash:string}};
const sources = new Map<string, BoundPrimary>([
  ...OHIO_REVIEWED_SOURCES.map(r => [r.chargeId, {group:'reviewed', doc:r.offense}] as const),
  ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(r => [r.chargeId, {group:'chapter-2903', doc:r.offense}] as const),
  ...OHIO_PROTECTION_SOURCES.map(r => [r.chargeId, {group:'protection', doc:r.offense}] as const),
  ...OHIO_RESIDUAL_SOURCES.map(r => [r.chargeId, {group:'residual', doc:r.offense}] as const),
]);
const ids = Object.values(observation.priorityGroups).flat().map(r=>r.id);
if (ids.length !== 22 || new Set(ids).size !== ids.length) throw Error('Original 22 priority IDs changed');
function checkDocument(doc:{section:string;sourceUrl:string;text:string;contentHash:string}) {
  if (doc.sourceUrl !== 'https://codes.ohio.gov/ohio-revised-code/section-'+doc.section ||
      createHash('sha256').update(doc.text).digest('hex') !== doc.contentHash) {
    throw Error('Official source identity or content mismatch for '+doc.section);
  }
}
const priorityGroups = Object.entries(observation.priorityGroups).map(([group, entries]) => ({
  group,
  records:entries.map(entry => {
    const source=sources.get(entry.id);
    const charge=getChargeById(entry.id);
    if (!source || source.group!==entry.group || !charge || charge.code!==entry.code ||
        !reviewed.has(entry.id) || entry.code.match(/^\d+\.\d+/)?.[0]!==source.doc.section) {
      throw Error('Priority identity, family or citation changed: '+entry.id);
    }
    checkDocument(source.doc);
    return {...entry, name:charge.name, primaryHash:source.doc.contentHash, publiclyReturned:live.has(entry.id)};
  }),
}));
const formerlyMissing=observation.previouslyMissingSections.map(section=>{
  const records=[...OHIO_PRIVACY_SOURCES,...OHIO_PRIORITY_GAPS_SOURCES].filter(r=>r.offense.section===section);
  if (!records.length) throw Error('Missing former priority gap '+section);
  for (const r of records) {
    checkDocument(r.offense);
    if (!reviewed.has(r.chargeId)) throw Error('Unconfigured reviewed branch '+r.chargeId);
  }
  return {section, ids:records.map(r=>r.chargeId), publiclyReturned:records.filter(r=>live.has(r.chargeId)).length};
});
const decisionHolds=eligibility.decisions.filter(r=>r.status==='held').map(r=>r.id);
const blocked=[...new Set([...decisionHolds,...holds.map(r=>r.id)])];
if (blocked.some(id=>reviewed.has(id) || live.has(id))) throw Error('A held identity appears reviewed or public');
console.log(JSON.stringify({reviewedConfigured:reviewed.size, priorityGroups,formerlyMissing,heldIdentities:blocked,
  publicChoices:publicChoices.map(r=>({id:r.id, reviewed:reviewed.has(r.id),configured:configured.has(r.id),
    requiresSavedReselection:isChargeIdRequiringReselection(r.id)}))},null,2));
