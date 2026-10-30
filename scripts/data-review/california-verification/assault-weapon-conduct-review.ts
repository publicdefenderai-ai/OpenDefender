import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import additions from '../../../shared/california-assault-weapon-conduct-additions.json';
import acquisition from '../output/california-assault-weapon-conduct-acquisition.json';
import predecessor from '../output/california-weapons-dependencies-review.json';
import approved from '../output/california-attorney-source-approval.json';
// Publication binds to its historical acquisition, never the rolling runtime renewal.
import comparison from '../output/california-publication-comparison-2026-10-01.json';
import pins from '../../../shared/california-retained-pins.json';
import { benefitProgramDocuments } from './benefit-program-review';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord } from '../../../shared/california-authority';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export const readAssaultWeaponConductAcquisition = () => structuredClone(acquisition);
export const assaultWeaponConductDocuments = () => ({ ...benefitProgramDocuments(), ...acquisition.documents, ...approved.documents });
const keys = (a: typeof additions[number]) => [...new Set(['PEN:30600', ...a.supportingKeys])].sort();
export function buildAssaultWeaponConductReview() {
    const docs = assaultWeaponConductDocuments();
    const required = [...new Set(additions.flatMap(keys))].sort();
    if (!same(required, acquisition.requiredKeys) || !same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), required)) throw new Error('Publication dependency accounting drift');
    if (!same(comparison.candidate, acquisition.retainedComparison.receipt) || acquisition.retainedComparison.sections.some(r => r.status !== 'unchanged' || !same(r, comparison.sections.find(s => s.key === r.key)))) throw new Error('Historical comparison extension drift');
    const sources = required.map(key => {
        const versions = docs[key as keyof typeof docs];
        if (!versions?.length || !(key in pins)) throw new Error('Missing monitored source: ' + key);
        const selected = key === approved.key ? versions.find(v => v.versionId === approved.operativeVersionId) : versions.length === 1 ? versions[0] : undefined;
        if (!selected || selected.activeFlag !== 'Y') throw new Error('Ambiguous operative source: ' + key);
        for (const v of versions) if (hash(v.contentXml) !== v.contentSha256 || `${v.lawCode}:${v.section.replace(/\.$/, '')}` !== key) throw new Error('Source body or identity drift');
        const text = sourceText(selected.contentXml);
        return { key, versionId: selected.versionId, contentSha256: selected.contentSha256, effectiveDate: selected.effectiveDate, history: selected.history,
            sourceUrl: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${key.split(':')[1]}.`, start: 0, end: text.length, text,
            retainedVersions: versions.map(v => ({ versionId: v.versionId, contentSha256: v.contentSha256, effectiveDate: v.effectiveDate, activeFlag: v.activeFlag })) };
    });
    const span = (key: string, startText: string, endText?: string) => {
        const source = sources.find(s => s.key === key)!;
        const start = source.text.indexOf(startText), end = endText ? source.text.indexOf(endText, start + startText.length) : source.text.length;
        if (start < 0 || end <= start) throw new Error('Missing source span: ' + key);
        return { key, start, end, text: source.text.slice(start, end) };
    };
    const instruction = predecessor.instructions.find(i => i.id === '2560')!;
    if (!instruction || !same(instruction.pageHashes, instruction.pages.map(p => ({ page: p.page, sha256: hash(p.text) })))) throw new Error('Instruction page binding drift');
    return { schemaVersion: 1, scope: 'bounded_assault_weapon_conduct_publication_not_statewide_completeness', sourceAsOf: '2026-09-24',
        acquisitionSha256: hash(acquisition), predecessorSha256: hash(predecessor), approvedSuccessorSha256: hash(approved), sources,
        instruction: { ...instruction, receipt: predecessor.instructionReceipt },
        records: additions.map(a => ({ id: a.id, definitionSha256: hash(a), sourceKeys: keys(a), primarySpan: span('PEN:30600', '(a) Any person', '(b) In addition') })),
        sharedSpans: [span('PEN:30600', '(b) In addition'), span('PEN:30615', 'Notwithstanding'), span('PEN:672', 'Upon a conviction'), span('PEN:30660', '(a) Section'), span('PEN:30675', '(a) Sections'), span('PEN:30945', 'Unless a permit')],
        remainingScopes: [{ key: 'PEN:25850', status: 'loaded_firearm_grading_exceptions_and_enforceability_not_published' }],
        limits: ['Two weapon-specific choices share section 30600(a); they are not two separate statutory subdivisions or an exhaustive count of possible charging theories.',
            'These are conduct-specific statutory summaries, not an extension of the existing possession attorney decision. Court orders, exemptions and the alleged conduct date remain material.',
            'Sections 30600(b)-(c) and 30615 are retained with the base offense rather than silently absorbed into its custody term. No separate ordinary enhancement choice is created.',
            'Registration is not blanket authorization for every transport or transfer. Section 30675(b) and its registration and permit dependencies are retained; possession-only exemptions are not represented as universal conduct exemptions.',
            'The already approved PEN:30515 operative version is reused while the future version and transition monitor remain intact. No attorney decision or hold is changed.',
            'All new English content is explicitly marked untranslated for Spanish and Chinese requests. Existing translated summaries are unchanged.',
            'Dependencies match the retained October 1 comparison archive. No new acquisition date, receipt renewal or live availability is established. Historical reports remain frozen.'] };
}
export type AssaultWeaponConductReview = ReturnType<typeof buildAssaultWeaponConductReview>;
export const readAssaultWeaponConductReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-assault-weapon-conduct-review.json', import.meta.url), 'utf8')) as AssaultWeaponConductReview;
export function validateAssaultWeaponConductReview(packet = readAssaultWeaponConductReview()) {
    if (!same(packet, buildAssaultWeaponConductReview())) throw new Error('Assault-weapon conduct evidence drift');
    for (const a of additions) {
        const c = getCaliforniaCanonicalRecord(a.id);
        if (!c?.selectable || c.code !== a.code || c.lawCode !== 'PEN' || c.officialTitle !== a.title || c.penalty !== a.penalty || !same(c.categories, a.categories)) throw new Error('Runtime conduct publication drift');
        const runtimeKeys = c.sources.filter(s => s.kind !== 'jury-instruction').map(s => { const u = new URL(s.url); return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`; });
        if (!same([...new Set(runtimeKeys)].sort(), keys(a)) || !same(Object.keys(a.sourceEffectiveDates).sort(), keys(a))) throw new Error('Runtime dependency drift');
        for (const s of packet.sources) if ((a.sourceEffectiveDates as Record<string, string | null>)[s.key] !== (s.effectiveDate?.slice(0,10) ?? null)) throw new Error('Effective-date drift: ' + s.key);
    }
    return { additions: additions.length, primarySections: 1, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n,v) => n + v.length, 0) };
}
export function renderAssaultWeaponConductReview(packet = readAssaultWeaponConductReview()) {
    const c = validateAssaultWeaponConductReview(packet);
    return ['# California assault-weapon and .50 BMG conduct', '', `${c.additions} new choices from one primary section; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. No receipt extension.`, '', ...packet.limits.map(s => '- ' + s), '',
        ...additions.flatMap(a => [`## Penal Code ${a.code}: ${a.title}`, '', a.summary, '', a.penalty, '', '[Official primary source](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=30600.)', '']),
        '## Remaining priority work', '', 'Loaded-firearm carrying under section 25850 remains unpublished. This packet does not resolve that separate conduct and grading group.', ''].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const p = buildAssaultWeaponConductReview(); validateAssaultWeaponConductReview(p);
    fs.writeFileSync(new URL('../output/california-assault-weapon-conduct-review.json', import.meta.url), JSON.stringify(p,null,2)+'\n');
    fs.writeFileSync(new URL('../output/california-assault-weapon-conduct-review.md', import.meta.url), renderAssaultWeaponConductReview(p));
    console.log(JSON.stringify(validateAssaultWeaponConductReview(p)));
}
