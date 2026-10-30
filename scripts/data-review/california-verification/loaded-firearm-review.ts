import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import additions from '../../../shared/california-loaded-firearm-additions.json';
import acquisition from '../output/california-loaded-firearm-acquisition.json';
import predecessor from '../output/california-weapons-dependencies-review.json';
import comparison from '../output/california-retained-refresh-comparison.json';
import pins from '../../../shared/california-retained-pins.json';
import { assaultWeaponConductDocuments } from './assault-weapon-conduct-review';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord } from '../../../shared/california-authority';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export const readLoadedFirearmAcquisition = () => structuredClone(acquisition);
export const loadedFirearmDocuments = () => ({ ...assaultWeaponConductDocuments(), ...acquisition.documents });
const keys = (a: typeof additions[number]) => [...new Set(['PEN:25850', ...a.supportingKeys])].sort();
export function buildLoadedFirearmReview() {
    const docs = loadedFirearmDocuments();
    const required = [...new Set(additions.flatMap(keys))].sort();
    if (!same(required, acquisition.requiredKeys) || !same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), required)) throw new Error('Publication dependency accounting drift');
    if (!same(comparison.candidate, acquisition.retainedComparison.receipt) || acquisition.retainedComparison.sections.some(r => r.status !== 'unchanged' || !same(r, comparison.sections.find(s => s.key === r.key)))) throw new Error('Historical comparison extension drift');
    const sources = required.map(key => {
        const versions = docs[key as keyof typeof docs];
        if (!versions?.length || !(key in pins)) throw new Error('Missing monitored source: ' + key);
        const selected = versions.length === 1 ? versions[0] : undefined;
        if (!selected || selected.activeFlag !== 'Y') throw new Error('Ambiguous operative source: ' + key);
        for (const v of versions) if (hash(v.contentXml) !== v.contentSha256 || `${v.lawCode}:${v.section.replace(/\.$/, '')}` !== key) throw new Error('Source body or identity drift');
        const text = sourceText(selected.contentXml);
        return { key, versionId: selected.versionId, contentSha256: selected.contentSha256, effectiveDate: selected.effectiveDate, history: selected.history,
            sourceUrl: `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${key.split(':')[0]}&sectionNum=${key.split(':')[1]}.`, start: 0, end: text.length, text,
            retainedVersions: versions.map(v => ({ versionId: v.versionId, contentSha256: v.contentSha256, effectiveDate: v.effectiveDate, activeFlag: v.activeFlag })) };
    });
    const span = (key: string, startText: string, endText?: string) => {
        const source = sources.find(s => s.key === key);
        if (!source) throw new Error('Missing span source: ' + key);
        const start = source.text.indexOf(startText), end = endText ? source.text.indexOf(endText, start + startText.length) : source.text.length;
        if (start < 0 || end <= start) throw new Error('Missing source span: ' + key);
        return { key, start, end, text: source.text.slice(start, end) };
    };
    const gradingParagraph = (a: typeof additions[number]) => {
        const match = /^25850\(c\)\(([1-7])\)$/.exec(a.code);
        if (!match || a.id !== `ca-pen-25850-c-${match[1]}`) throw new Error('Grading identity mismatch');
        const n = Number(match[1]);
        return span('PEN:25850', n === 7 ? '(7) In all' : `(${n}) Where`, n === 7 ? '(d) (1)' : n === 6 ? '(7) In all' : `(${n+1}) Where`);
    };
    if (additions.length !== 7 || new Set(additions.map(a => a.code)).size !== 7) throw new Error('Incomplete grading inventory');
    const instructionIds = [...new Set(additions.flatMap(a => a.calcrim))].sort();
    const instructions = instructionIds.map(id => {
        const instruction = predecessor.instructions.find(i => i.id === id);
        if (!instruction || !same(instruction.pageHashes, instruction.pages.map(p => ({ page: p.page, sha256: hash(p.text) })))) throw new Error('Instruction page binding drift');
        return { ...instruction, receipt: predecessor.instructionReceipt };
    });
    return { schemaVersion: 1, scope: 'bounded_loaded_firearm_publication_not_statewide_completeness', sourceAsOf: '2026-09-24',
        acquisitionSha256: hash(acquisition), predecessorSha256: hash(predecessor), sources,
        instructions,
        records: additions.map(a => ({ id: a.id, definitionSha256: hash(a), sourceKeys: keys(a),
            conductSpan: span('PEN:25850', '(a) A person', '(b) In order'),
            gradingSpan: gradingParagraph(a) })),
        sharedSpans: [span('PEN:25850', '(d) (1)', '(f) Nothing'), span('PEN:18', '(a) Except', '(b) Every'), span('PEN:18.5', '(a) Every'), span('PEN:16840', '(b) As used'), span('PEN:26010', 'Section 25850'), span('PEN:26055', 'Nothing in Section')],
        remainingPriorityConductGroups: [],
        limits: ['Seven choices share the conduct in section 25850(a) and distinguish the grading factors in (c)(1)-(7). They are not seven independent crimes to stack for one act. Overlapping allegations require case-specific treatment.',
            'The first four branches declare felonies without an express section 1170(h) alternative; the next two expressly provide it. The no-factor misdemeanor branch does not override a proven factor.',
            'The firearm and location elements, lawful-possession and recorded-owner distinctions, conditional exemptions and specified-prior minimum term remain separate requirements.',
            'The retained CALCRIM grading instructions are context, not a claim that every older bench-note alternative governs all current predicates. Current retained statutes and the conduct date control the relevant predicate.',
            'This is a bounded statutory publication. Constitutional litigation and applicable orders require case-specific review; it does not certify enforceability in every setting.',
            'The priority conduct queue identified in PR 79 has now received bounded publication treatment. That is not statewide completeness, approval of all residual research, or proof of live availability.',
            'New English summaries retain explicit untranslated notices for Spanish and Chinese requests. No existing translated summary is replaced.',
            'New dependencies match the retained October 1 archive. Receipt dates, existing attorney decisions, holds and future-law monitors are unchanged.'] };

}
export type LoadedFirearmReview = ReturnType<typeof buildLoadedFirearmReview>;
export const readLoadedFirearmReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-loaded-firearm-review.json', import.meta.url), 'utf8')) as LoadedFirearmReview;
export function validateLoadedFirearmReview(packet = readLoadedFirearmReview()) {
    if (!same(packet, buildLoadedFirearmReview())) throw new Error('Loaded-firearm evidence drift');
    for (const a of additions) {
        const c = getCaliforniaCanonicalRecord(a.id);
        if (!c?.selectable || c.code !== a.code || c.lawCode !== 'PEN' || c.officialTitle !== a.title || c.penalty !== a.penalty || !same(c.categories, a.categories)) throw new Error('Runtime conduct publication drift');
        const runtimeKeys = c.sources.filter(s => s.kind !== 'jury-instruction').map(s => { const u = new URL(s.url); return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`; });
        if (!same([...new Set(runtimeKeys)].sort(), keys(a)) || !same(Object.keys(a.sourceEffectiveDates).sort(), keys(a))) throw new Error('Runtime dependency drift');
        for (const s of packet.sources) if ((a.sourceEffectiveDates as Record<string, string | null>)[s.key] !== (s.effectiveDate?.slice(0,10) ?? null)) throw new Error('Effective-date drift: ' + s.key);
    }
    return { additions: additions.length, primarySections: 1, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n,v) => n + v.length, 0) };
}
export function renderLoadedFirearmReview(packet = readLoadedFirearmReview()) {
    const c = validateLoadedFirearmReview(packet);
    return ['# California loaded-firearm carrying branches', '', `${c.additions} grading choices share one primary section; ${c.reusedSections} reused dependencies and ${c.newSections} newly monitored sections. No receipt extension.`, '', ...packet.limits.map(s => '- ' + s), '',
        ...additions.flatMap(a => [`## Penal Code ${a.code}: ${a.title}`, '', a.summary, '', a.penalty, '', '[Official primary source](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=25850.)', '']),
        '## Scope after this batch', '', 'The prior priority conduct queue has bounded publication entries. Statewide omissions, documented holds, translation backlog, source maintenance and deployment availability remain separate work.', ''].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const p = buildLoadedFirearmReview(); validateLoadedFirearmReview(p);
    fs.writeFileSync(new URL('../output/california-loaded-firearm-review.json', import.meta.url), JSON.stringify(p,null,2)+'\n');
    fs.writeFileSync(new URL('../output/california-loaded-firearm-review.md', import.meta.url), renderLoadedFirearmReview(p));
    console.log(JSON.stringify(validateLoadedFirearmReview(p)));
}
