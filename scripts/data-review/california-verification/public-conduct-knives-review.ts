/** Public source bindings and publication accounting only. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import additions from '../../../shared/california-public-conduct-knives-additions.json';
import acquisition from '../output/california-public-conduct-knives-acquisition.json';
import previous from '../output/california-closeout-inventory.json';
import justice from '../output/california-justice-property-benchmark-source.json';
import people from '../output/california-people-weapons-benchmark-source.json';
import { validateCloseoutInventory } from './closeout-inventory';
import { priorityPersonDocuments } from './priority-person-review';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord } from '../../../shared/california-authority';
import pins from '../../../shared/california-retained-pins.json';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const keys = (a: typeof additions[number]) => [...new Set(['PEN:' + a.code.split('(')[0], ...a.supportingKeys])].sort();
export const readPublicConductKnivesAcquisition = () => structuredClone(acquisition);
export const publicConductKnivesDocuments = () => ({ ...priorityPersonDocuments(), ...acquisition.documents });
const boundaries: Record<string, [
    string,
    string | null
]> = {
    'ca-pen-647-a-conduct': ['(a) An individual', '(b) (1)'],
    'ca-pen-647-a-solicitation': ['(a) An individual', '(b) (1)'],
    'ca-pen-647-h': ['(h) Who loiters', '(i) Who'],
    'ca-pen-647-i': ['(i) Who', '(j) (1)'],
    'ca-pen-21310': ['Except as provided', null],
    'ca-pen-21510-a': ['(a) Possesses', '(b) Carries'],
    'ca-pen-21510-b': ['(b) Carries', '(c) Sells'],
    'ca-pen-21510-c': ['(c) Sells', null],
};
export function buildPublicConductKnivesReview() {
    validateCloseoutInventory(previous);
    const docs = publicConductKnivesDocuments(), allKeys = [...new Set(additions.flatMap(keys))].sort();
    if (!same(allKeys, acquisition.requiredKeys) || !same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), allKeys))
        throw new Error('Acquisition accounting drift');
    const sources = allKeys.map(key => {
        const versions = docs[key];
        if (versions?.length !== 1 || versions[0].activeFlag !== 'Y' || !(key in pins))
            throw new Error('Unmonitored or ambiguous source');
        const v = versions[0], text = sourceText(v.contentXml), u = new URL(v.sourceUrl);
        if (hash(v.contentXml) !== v.contentSha256 || `${v.lawCode}:${v.section.replace(/\.$/, '')}` !== key || u.origin !== 'https://leginfo.legislature.ca.gov' || `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')?.replace(/\.$/, '')}` !== key)
            throw new Error('Source identity/hash mismatch');
        return { key, versionId: v.versionId, contentSha256: v.contentSha256, sourceUrl: v.sourceUrl, start: 0, end: text.length, text };
    });
    const instructionIds = [...new Set(additions.flatMap(a => a.calcrim))].sort();
    const instructions = instructionIds.map(id => {
        const provider = justice.instructions.some(i => i.id === id) ? justice : people;
        const i = provider.instructions.find(i => i.id === id);
        if (!i)
            throw new Error('Missing instruction');
        const pages = provider.pages.filter(p => p.page >= i.firstPage && p.page <= i.lastPage);
        if (pages.some(p => hash(p.text) !== p.sha256) || !same(i.pageHashes, pages.map(p => ({ page: p.page, sha256: p.sha256 }))))
            throw new Error('Instruction evidence mismatch');
        return { ...i, pages };
    });
    return { schemaVersion: 1, scope: 'bounded_public_conduct_knives_publication_not_statewide_completeness', archiveSha256: acquisition.archive.sha256, sourceAsOf: '2026-09-24', previousInventorySha256: hash(previous), acquisitionSha256: hash(acquisition), sources, instructions,
        records: additions.map(a => {
            const source = sources.find(s => s.key === 'PEN:' + a.code.split('(')[0])!;
            const [begin, finish] = boundaries[a.id], start = source.text.indexOf(begin), end = finish ? source.text.indexOf(finish, start + begin.length) : source.text.length;
            if (start < 0 || end <= start)
                throw new Error('Missing primary subdivision');
            return { id: a.id, definitionSha256: hash(a), sourceKeys: keys(a), primarySpan: { key: source.key, start, end, text: source.text.slice(start, end) }, instructionIds: a.calcrim };
        }),
        // A successor records only the affected identities. The historical inventory stays frozen.
        benchmarkUpdates: previous.comparisons.filter(r => instructionIds.includes(r.instructionId)).map(r => ({
            family: r.family, instructionId: r.instructionId, previousStatus: r.status,
            status: 'bounded_publication_match_other_branches_open',
            chargeIds: additions.filter(a => a.calcrim.includes(r.instructionId)).map(a => a.id),
        })),
        limits: [
            'Eight separate statutory conduct choices across three primary sections; not eight separate convictions for the same act. Shared evidence is stored once.',
            'CALCRIM 2501 is matched only for the dirk-or-dagger branch. Explosive and other weapons branches remain outside this publication.',
            'Section 647(a) requires the instruction-specific public connection and observer knowledge. The private-property branches retain their different intent requirements.',
            'The section 647(k) and (l) punishments are not assigned to these (a), (h) or (i) choices. Sections 19 and 672 remain distinct penalty rules.',
            'Switchblade statutory alternatives and the definition exception remain separate. This packet does not resolve every constitutional application.',
            'Existing holds and prior decisions remain unchanged. No attorney questions or deliberations are included.',
            'Seventeen dependencies join monitoring using the existing authentic candidate comparison. Receipt issuance and expiry are not extended.',
        ],
    };
}
export type PublicConductKnivesReview = ReturnType<typeof buildPublicConductKnivesReview>;
export const readPublicConductKnivesReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-public-conduct-knives-review.json', import.meta.url), 'utf8')) as PublicConductKnivesReview;
export function validatePublicConductKnivesReview(packet = readPublicConductKnivesReview()) {
    if (!same(packet, buildPublicConductKnivesReview()))
        throw new Error('Public conduct/knives review drift');
    const docs = publicConductKnivesDocuments();
    for (const a of additions) {
        const c = getCaliforniaCanonicalRecord(a.id);
        if (!c?.selectable || c.code !== a.code || c.penalty !== a.penalty || c.officialTitle !== a.title || !same(c.categories, a.categories))
            throw new Error('Runtime publication drift');
        const runtimeKeys = c.sources.filter(s => s.kind !== 'jury-instruction').map(s => { const u = new URL(s.url); return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`; }).sort();
        if (!same([...new Set(runtimeKeys)], keys(a)) || !same(Object.keys(a.sourceEffectiveDates).sort(), keys(a)))
            throw new Error('Dependency drift');
        for (const key of keys(a))
            if ((a.sourceEffectiveDates as Record<string, string | null>)[key] !== docs[key][0].effectiveDate?.slice(0, 10) && !((a.sourceEffectiveDates as Record<string, string | null>)[key] === null && !docs[key][0].effectiveDate))
                throw new Error('Effective date drift');
    }
    return { additions: additions.length, primarySections: 3, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n, v) => n + v.length, 0) };
}
export function renderPublicConductKnivesReview(packet = readPublicConductKnivesReview()) {
    const c = validatePublicConductKnivesReview(packet);
    return ['# California public conduct and knives', '', `${c.additions} new choices, ${c.reusedSections} reused sections, ${c.newSections} newly monitored sections. No receipt extension.`, '', ...packet.limits.map(s => '- ' + s), '', ...additions.flatMap(a => [`## ${a.code}: ${a.title}`, '', a.summary, '', a.penalty, '', `[Official primary section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${a.code.split('(')[0]}.)`, ''])].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const p = buildPublicConductKnivesReview();
    validatePublicConductKnivesReview(p);
    fs.writeFileSync(new URL('../output/california-public-conduct-knives-review.json', import.meta.url), JSON.stringify(p, null, 2) + '\n');
    fs.writeFileSync(new URL('../output/california-public-conduct-knives-review.md', import.meta.url), renderPublicConductKnivesReview(p));
    console.log(JSON.stringify(validatePublicConductKnivesReview(p)));
}
