/** Source-bound statutory publication and neutral residual accounting. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import additions from '../../../shared/california-other-code-priority-additions.json';
import acquisition from '../output/california-other-code-priority-acquisition.json';
import previous from '../output/california-closeout-inventory.json';
import previousPublication from '../output/california-public-conduct-knives-review.json';
import { publicConductKnivesDocuments } from './public-conduct-knives-review';
import { validateCloseoutInventory } from './closeout-inventory';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord } from '../../../shared/california-authority';
import { californiaPrimaryIdentity } from '../../../shared/california-law-codes';
import pins from '../../../shared/california-retained-pins.json';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const primary = (a: typeof additions[number]) => `${a.lawCode}:${a.code.split('(')[0]}`;
const keys = (a: typeof additions[number]) => [...new Set([primary(a), ...a.supportingKeys])].sort();
export const readOtherCodePriorityAcquisition = () => structuredClone(acquisition);
export const otherCodePriorityDocuments = () => ({ ...publicConductKnivesDocuments(), ...acquisition.documents });
// Exact operative conduct spans. Whole source bodies retain shared penalties and exceptions.
const boundaries: Record<string, [
    string,
    string | null
]> = {
    'ca-bpc-2052-a': ['(a) Notwithstanding', '(b) Any'],
    'ca-bpc-2052-b': ['(b) Any', '(c) The'],
    'ca-bpc-7028-a-1': ['(a) Unless', '(b) A first'],
    'ca-bpc-7028-a-2': ['(a) Unless', '(b) A first'],
    'ca-lab-3700-5-a': ['(a) The failure', '(b) A second'],
    'ca-lab-6425-a': ['(a) Any employer', '(b) If the conviction'],
    'ca-lab-6425-b': ['(b) If the conviction', '(c) If the conviction'],
    'ca-lab-6425-c': ['(c) If the conviction', '(d) In determining'],
    'ca-ins-1871-4-a-1': ['(1) Make or cause', '(2) Present'],
    'ca-ins-1871-4-a-2': ['(2) Present', '(3) Knowingly'],
    'ca-ins-1871-4-a-3': ['(3) Knowingly', '(4) Make'],
    'ca-ins-1871-4-a-4': ['(4) Make', '(5) Make'],
    'ca-ins-1871-4-a-5': ['(5) Make', '(6) Make'],
    'ca-ins-1871-4-a-6': ['(6) Make', '(b) Every'],
    'ca-wic-10980-a': ['(a) Any person', '(b) Any person'],
    'ca-wic-10980-b': ['(b) Any person', '(c) Whenever'],
    'ca-wic-10980-c-1': ['(c) Whenever', '(d) Any person'],
    'ca-wic-10980-c-2': ['(c) Whenever', '(d) Any person'],
    'ca-uic-2101-a': ['(a) It is', '(b) Nothing'],
};
export function buildOtherCodePriorityReview() {
    validateCloseoutInventory(previous);
    const docs = otherCodePriorityDocuments(), required = [...new Set(additions.flatMap(keys))].sort();
    if (!same(required, acquisition.requiredKeys) || !same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), required))
        throw new Error('Acquisition accounting drift');
    if (!same(Object.keys(boundaries).sort(), additions.map(a => a.id).sort()))
        throw new Error('Subdivision inventory drift');
    const sources = required.map(key => {
        const versions = docs[key];
        if (versions?.length !== 1 || versions[0].activeFlag !== 'Y' || !(key in pins))
            throw new Error('Unmonitored or ambiguous source: ' + key);
        const v = versions[0], text = sourceText(v.contentXml), u = new URL(v.sourceUrl);
        if (hash(v.contentXml) !== v.contentSha256 || `${v.lawCode}:${v.section.replace(/\.$/, '')}` !== key || u.origin !== 'https://leginfo.legislature.ca.gov' || `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/, '')}` !== key)
            throw new Error('Source identity/hash mismatch: ' + key);
        return { key, versionId: v.versionId, contentSha256: v.contentSha256, effectiveDate: v.effectiveDate, sourceUrl: v.sourceUrl, start: 0, end: text.length, text };
    });
    const span = (key: string, startText: string, endText: string | null) => {
        const source = sources.find(s => s.key === key);
        if (!source)
            throw new Error('Missing span source');
        const start = source.text.indexOf(startText), end = endText ? source.text.indexOf(endText, start + startText.length) : source.text.length;
        if (start < 0 || end <= start)
            throw new Error('Missing subdivision: ' + key);
        return { key, start, end, text: source.text.slice(start, end) };
    };
    return { schemaVersion: 1, scope: 'bounded_other_code_priority_publication_not_statewide_completeness', archiveSha256: acquisition.archive.sha256, sourceAsOf: '2026-09-24', previousInventorySha256: hash(previous), previousPublicationSha256: hash(previousPublication), acquisitionSha256: hash(acquisition), sources,
        records: additions.map(a => ({ id: a.id, definitionSha256: hash(a), sourceKeys: keys(a), primarySpan: span(primary(a), ...boundaries[a.id]) })),
        sharedPenaltyAndExceptionSpans: [
            span('BPC:7028', '(b) A first', '(f) If the unlicensed'),
            span('BPC:7048', '(a) This chapter', null),
            span('LAB:3700.5', '(b) A second', null),
            span('LAB:6425', '(a) Any employer', null),
            span('INS:1871.4', '(b) Every', '(d) This section'),
            span('WIC:10980', '(j) (1)', null),
            span('UIC:2122', 'Except as provided', null),
        ],
        probeUpdates: previous.otherCodeProbes.filter(p => p.status === 'unpublished_priority').map(p => ({ key: p.key, previousStatus: p.status, status: 'bounded_statutory_publication_not_exhaustive', chargeIds: additions.filter(a => primary(a) === p.key).map(a => a.id) })),
        remainingScopes: [
            { key: 'WIC:10980', subdivisions: ['d', 'e', 'f', 'g', 'h', 'i'], status: 'unpublished_program_and_penalty_dependencies', severity: 'not_assumed_minor' },
            { key: 'BPC:7028', subdivisions: ['c'], status: 'repeat_branch_upper_custody_limit_not_quantified_in_product', severity: 'misdemeanor' },
        ],
        limits: [
            'Nineteen configured choices address all seven priority source probes, not every offense or dependency in those codes.',
            'The 10980(d)-(i) benefit-instrument, forgery, public-funds and enhancement provisions remain outside this batch; the (a)-(c) entries do not stand in for them.',
            'No new CALCRIM instruction coverage is credited. Summaries are bounded statutory descriptions, not exhaustive elements instructions.',
            'Fine-only alternatives, corporate ranges, prior-conviction branches, licensing exceptions and the 10980(j) prosecution restriction remain explicit.',
            'Prior inventory and publication packets stay frozen. Existing decisions, source holds and receipt dates are unchanged.',
            'Retained original and comparison archives support these bindings. This is not a new acquisition from the live website or a freshness renewal.',
        ],
    };
}
export type OtherCodePriorityReview = ReturnType<typeof buildOtherCodePriorityReview>;
export const readOtherCodePriorityReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-other-code-priority-review.json', import.meta.url), 'utf8')) as OtherCodePriorityReview;
export function validateOtherCodePriorityReview(packet = readOtherCodePriorityReview()) {
    if (!same(packet, buildOtherCodePriorityReview()))
        throw new Error('Other-code priority review drift');
    const docs = otherCodePriorityDocuments();
    for (const a of additions) {
        const c = getCaliforniaCanonicalRecord(a.id);
        if (!c?.selectable || c.lawCode !== a.lawCode || c.code !== a.code || c.officialTitle !== a.title || c.penalty !== a.penalty || !same(c.categories, a.categories) || c.citation !== californiaPrimaryIdentity(c.lawCode, a.code).citation)
            throw new Error('Runtime publication drift');
        const runtimeKeys = c.sources.filter(s => s.kind !== 'jury-instruction').map(s => { const u = new URL(s.url); return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`; });
        if (!same([...new Set(runtimeKeys)].sort(), keys(a)) || !same(Object.keys(a.sourceEffectiveDates).sort(), keys(a)))
            throw new Error('Dependency drift');
        for (const key of keys(a))
            if ((a.sourceEffectiveDates as Record<string, string | null>)[key] !== (docs[key][0].effectiveDate?.slice(0, 10) ?? null))
                throw new Error('Effective date drift');
    }
    if (packet.probeUpdates.length !== 7 || packet.probeUpdates.some(p => !p.chargeIds.length))
        throw new Error('Unaccounted priority probe');
    return { additions: additions.length, primarySections: new Set(additions.map(primary)).size, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n, v) => n + v.length, 0) };
}
export function renderOtherCodePriorityReview(packet = readOtherCodePriorityReview()) {
    const c = validateOtherCodePriorityReview(packet);
    return ['# California other-code priority publication', '', `${c.additions} new choices from ${c.primarySections} primary sections. ${c.reusedSections} reused dependencies; ${c.newSections} newly monitored sections. No receipt extension.`, '', ...packet.limits.map(s => '- ' + s), '', '## Residual accounting', '', ...packet.remainingScopes.map(r => `- ${r.key} (${r.subdivisions.join(', ')}): ${r.status.replaceAll('_', ' ')}.`), '', ...additions.flatMap(a => [`## ${a.lawCode} ${a.code}: ${a.title}`, '', a.summary, '', a.penalty, '', `[Official primary section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${a.code.split('(')[0]}.)`, ''])].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const packet = buildOtherCodePriorityReview();
    validateOtherCodePriorityReview(packet);
    fs.writeFileSync(new URL('../output/california-other-code-priority-review.json', import.meta.url), JSON.stringify(packet, null, 2) + '\n');
    fs.writeFileSync(new URL('../output/california-other-code-priority-review.md', import.meta.url), renderOtherCodePriorityReview(packet));
    console.log(JSON.stringify(validateOtherCodePriorityReview(packet)));
}
