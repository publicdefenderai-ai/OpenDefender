/** Source-bound statutory publication and neutral residual accounting. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import additions from '../../../shared/california-benefit-program-additions.json';
import acquisition from '../output/california-benefit-program-acquisition.json';
import previous from '../output/california-residual-priority-review.json';
import previousPublication from '../output/california-other-code-priority-review.json';
import { otherCodePriorityDocuments } from './other-code-priority-review';
import { validateResidualPriorityReview } from './residual-priority-review';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord } from '../../../shared/california-authority';
import { californiaPrimaryIdentity } from '../../../shared/california-law-codes';
import pins from '../../../shared/california-retained-pins.json';
import comparison from '../output/california-retained-refresh-comparison.json';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const primary = (a: typeof additions[number]) => `${a.lawCode}:${a.code.split('(')[0]}`;
const keys = (a: typeof additions[number]) => [...new Set([primary(a), ...a.supportingKeys])].sort();
export const readBenefitProgramAcquisition = () => structuredClone(acquisition);
export const benefitProgramDocuments = () => ({ ...otherCodePriorityDocuments(), ...acquisition.documents });
// Exact operative conduct spans. Whole source bodies retain shared penalties and exceptions.
const boundaries: Record<string, [
    string,
    string | null
]> = {
    'ca-wic-10980-d': ['(d) Any person', '(e) Any person'],
    'ca-wic-10980-e': ['(e) Any person', '(f) Any person'],
    'ca-wic-10980-f': ['(f) Any person', '(g) Any person'],
    'ca-wic-10980-g-1': ['(g) Any person', '(h) (1)'],
    'ca-wic-10980-g-2': ['(g) Any person', '(h) (1)'],
};
export function buildBenefitProgramReview() {
    validateResidualPriorityReview(previous);
    if (acquisition.retainedComparison.sections.some(row => row.status !== 'unchanged') || !same(acquisition.retainedComparison.sections.map(row => row.key).sort(), Object.keys(acquisition.documents).sort()))
        throw new Error('Historical comparison incomplete or changed');
    if (!same(comparison.candidate, acquisition.retainedComparison.receipt) || acquisition.retainedComparison.sections.some(row => !same(row, comparison.sections.find(s => s.key === row.key))))
        throw new Error('Retained comparison extension is not bound to the same archive');
    const docs = benefitProgramDocuments(), required = [...new Set(additions.flatMap(keys))].sort();
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
    return { schemaVersion: 1, scope: 'bounded_benefit_program_publication_not_statewide_completeness', archiveSha256: acquisition.archive.sha256, sourceAsOf: '2026-09-24', previousInventorySha256: hash(previous), previousPublicationSha256: hash(previousPublication), acquisitionSha256: hash(acquisition), sources,
        records: additions.map(a => ({ id: a.id, definitionSha256: hash(a), sourceKeys: keys(a), primarySpan: span(primary(a), ...boundaries[a.id]) })),
        sharedPenaltyAndExceptionSpans: [
            span('WIC:10980', '(h) (1)', '(j) (1)'),
            span('WIC:10980', '(j) (1)', null),
            span('PEN:473', '(a) Forgery', null),
            span('PEN:514', 'Every person', null),
            span('PEN:17', '(b) When', '(c) When'),
            span('PEN:672', 'Upon a conviction', null),
        ],
        probeUpdates: previous.conductWork.filter(p => p.id.startsWith('WIC:')).map(p => ({ key: p.id, previousStatus: p.status, status: 'bounded_statutory_publication_not_transaction_authorization_determination', chargeIds: additions.filter(a => `WIC:${a.code}` === p.id).map(a => a.id) })),
        remainingScopes: previous.conductWork.filter(p => !p.id.startsWith('WIC:')).map(p => ({ key: p.id, status: p.status })),
        limits: [
            'Five statutory branch choices share the retained program context and penalty dependencies. This does not determine whether any particular transaction was authorized under state or federal program rules.',
            'Section 10980(e) is not automatically a misdemeanor solely because value is $950 or less: Penal Code 473(b) applies to enumerated instruments and carries exceptions. Section 10980(f) is the entrusted public-employee branch, not ordinary recipient fraud.',
            'The fine-only alternative in 10980(d) is retained with section 17(b) classification; no unstated misdemeanor custody term is supplied.',
            'Sections 10980(h) and (i) remain additional punishment and its limitation, not separate ordinary choices. The specified 10980(j) prosecution restriction remains explicit.',
            'No new jury-instruction comparison is credited. Program authorization, case-specific defenses and application require separate assessment; these are bounded statutory summaries.',
            'All five new choices lack existing translations; non-English requests retain the explicit English-content notice. Previously translated summaries are not replaced.',
            'Historical inventories and review packets remain frozen. Existing decisions, source holds and receipt dates are unchanged.',
            'New dependencies matched the retained comparison archive. That historical comparison is not a live acquisition or a freshness renewal.',
        ],
    };
}
export type BenefitProgramReview = ReturnType<typeof buildBenefitProgramReview>;
export const readBenefitProgramReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-benefit-program-review.json', import.meta.url), 'utf8')) as BenefitProgramReview;
export function validateBenefitProgramReview(packet = readBenefitProgramReview()) {
    if (!same(packet, buildBenefitProgramReview()))
        throw new Error('Benefit-program review drift');
    const docs = benefitProgramDocuments();
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
    if (packet.probeUpdates.length !== 5 || packet.probeUpdates.some(p => !p.chargeIds.length))
        throw new Error('Unaccounted priority probe');
    return { additions: additions.length, primarySections: new Set(additions.map(primary)).size, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n, v) => n + v.length, 0) };
}
export function renderBenefitProgramReview(packet = readBenefitProgramReview()) {
    const c = validateBenefitProgramReview(packet);
    return ['# California benefit-program statutory branches', '', `${c.additions} new choices from ${c.primarySections} primary section. ${c.reusedSections} reused dependencies; ${c.newSections} newly monitored sections. No receipt extension.`, '', ...packet.limits.map(s => '- ' + s), '', '## Residual accounting', '', ...packet.remainingScopes.map(r => `- ${r.key}: ${r.status.replaceAll('_', ' ')}.`), '', ...additions.flatMap(a => [`## ${a.lawCode} ${a.code}: ${a.title}`, '', a.summary, '', a.penalty, '', `[Official primary section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${a.code.split('(')[0]}.)`, ''])].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const packet = buildBenefitProgramReview();
    validateBenefitProgramReview(packet);
    fs.writeFileSync(new URL('../output/california-benefit-program-review.json', import.meta.url), JSON.stringify(packet, null, 2) + '\n');
    fs.writeFileSync(new URL('../output/california-benefit-program-review.md', import.meta.url), renderBenefitProgramReview(packet));
    console.log(JSON.stringify(validateBenefitProgramReview(packet)));
}
