/** Correct existing product content and its evidence. Never issue or extend a receipt. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import plan from './correction-plan.json';
import originals from './previous-definitions.json';
import baselineDrafts from './previous-evidence.json';
import penalties from './penalties.json';
import judicialAuthorities from '../../../shared/florida-reviewed-data/judicial-authorities.json';
import { assembleFloridaReviewedReport, buildFloridaReviewedSourceRecords, findSubdivisionRange, type FloridaReviewedAnalysisEntry, type FloridaReviewedCacheDocument } from '../../../server/data/florida-reviewed-source-records';
import type { EvidenceBackedChargeDefinition } from '../../../shared/evidence-backed-charge-batch';
import { floridaSectionUrl } from '../batch/florida-adapter';
const json = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const encode = (x: unknown) => JSON.stringify(x, null, 2) + '\n';
// Replace only matching JSON objects; historical files intentionally use mixed formatting.
function replaceObjects(file: string, replacements: readonly {
    id: string;
}[]) {
    const input = fs.readFileSync(file, 'utf8'), changes: {
        start: number;
        end: number;
        text: string;
    }[] = [];
    const starts: number[] = [];
    let quoted = false, escape = false;
    for (let i = 0; i < input.length; i++) {
        const c = input[i];
        if (quoted) {
            if (escape)
                escape = false;
            else if (c.charCodeAt(0) === 92)
                escape = true;
            else if (c === '"')
                quoted = false;
            continue;
        }
        if (c === '"') {
            quoted = true;
            continue;
        }
        if (c === '{')
            starts.push(i);
        if (c === '}') {
            const start = starts.pop()!;
            const raw = input.slice(start, i + 1), value = JSON.parse(raw), replacement = replacements.find(r => r.id === value.id);
            if (replacement) {
                const indent = input.slice(input.lastIndexOf('\n', start) + 1, start).match(/^\s*/)?.[0] ?? '';
                const text = raw.includes('\n') ? JSON.stringify(replacement, null, 2).replace(/\n/g, '\n' + indent) : JSON.stringify(replacement);
                changes.push({ start, end: i + 1, text });
            }
        }
    }
    let result = input;
    for (const c of changes.sort((a, b) => b.start - a.start))
        result = result.slice(0, c.start) + c.text + result.slice(c.end);
    if (result !== input)
        fs.writeFileSync(file, result);
}
const output = 'scripts/data-review/output/florida-sexual-injunction-corrections.json';
const mode = process.argv[2], candidate = process.argv[3];
if (!['--prepare', '--integrate', '--check'].includes(mode))
    throw Error('Use --prepare candidate.json, --integrate, or --check');
const oldReport = json('scripts/data-review/output/florida-reviewed-analysis.json');
const oldEligibility = json('shared/florida-reviewed-eligibility.json');
const retained = mode === '--prepare' ? null : json(output);
const cache = mode === '--prepare' ? json(candidate) : { schemaVersion: 1, jurisdiction: 'FL', documents: retained.documents };
const docs = cache.documents as Record<string, FloridaReviewedCacheDocument>;
const definitions = originals.map(original => {
    const d = structuredClone(original) as EvidenceBackedChargeDefinition;
    const row = plan.records.find(r => r.id === d.id)!;
    d.verifiedMonth = '2026-11';
    d.category = row.ordinaryCategory as typeof d.category;
    if (row.categories.length > 1) d.categories = row.categories as typeof d.categories;
    d.citations = [d.citations[0], ...row.requiredSections.map(s => ({ citation: `Fla. Stat. § ${s}`, url: floridaSectionUrl(s) }))];
    for (const lang of ['en', 'es', 'zh'] as const)
        d.text[lang].degreeContext = penalties[row.section as keyof typeof penalties][lang];
    return d;
});
const quote = (section: string, scope: string) => { const r = findSubdivisionRange(docs[section].text, scope)[0]; if (!r)
    throw Error(`Missing ${section}${scope}`); return docs[section].text.slice(r.start, r.end).trim(); };
const analyses: FloridaReviewedAnalysisEntry[] = definitions.map(d => {
    const row = plan.records.find(r => r.id === d.id)!, section = d.code.match(/^\d+\.\d+/)![0];
    const original = baselineDrafts.find(r => r.id === d.id);
    if (!original)
        throw Error(`Missing original ${d.id}`);
    const identity = original.identityEvidence;
    return { id: d.id, section, status: 'eligible', reason: 'Existing identity with complete conduct and independently bound sentencing dependencies.', identity: { kind: identity.target === 'title' ? 'official_heading' : 'operative_guilt_clause', quote: identity.text, sourceHash: docs[section].contentHash }, conductQuotes: [quote(section, row.conductScope)], gradingQuotes: row.gradingScopes.map(scope => quote(section, scope)), requiredSections: [{ section, role: 'offense', contentHash: docs[section].contentHash }, ...row.requiredSections.map(s => ({ section: s, role: (s === section ? 'grading' : s.startsWith('775.') || s.startsWith('921.') || s === '794.0115' ? 'penalty' : 'definition') as 'grading' | 'penalty' | 'definition', contentHash: docs[s].contentHash }))], notes: 'Existing identity and translated base summaries preserved; complete mapped conduct and statutory sentencing dependencies retained. Constitutional holdings are separately bound in the judicial-authorities artifact. No receipt issuance or extension.' };
});
const selected = Object.fromEntries(plan.sections.map(s => { if (!docs[s])
    throw Error(`Missing ${s}`); return [s, docs[s]]; }));
const now = new Date(Math.max(...Object.values(selected).map(d => Date.parse(d.retrievedAt))));
const assembled = assembleFloridaReviewedReport(definitions, analyses, { schemaVersion: 1, jurisdiction: 'FL', documents: selected }, now);
if (assembled.technicalHolds.length)
    throw Error(JSON.stringify(assembled.technicalHolds));
const decisions = definitions.map(d => { const draft = assembled.report.drafts.find(r => r.id === d.id)!; const base = { id: d.id, status: 'eligible', reason: 'Corrected existing record with individually bound conduct and sentencing conditions; freshness and database gates remain separate.', draftHash: hash(draft), definitionHash: hash(d) }; return { ...base, approvalHash: hash(base) }; });
const eligibility = { schemaVersion: 1, reportHash: hash(assembled.report), decisions };
buildFloridaReviewedSourceRecords(definitions, assembled.report, eligibility as any);
const packet = { schemaVersion: 1, kind: 'florida_sexual_injunction_corrections_without_receipt_renewal', judicialAuthorities, baselineDrafts: baselineDrafts, documents: selected, definitions, analyses, report: assembled.report, eligibility };
if (mode === '--prepare')
    fs.writeFileSync(output, encode(packet));
if (mode === '--check' && fs.readFileSync(output, 'utf8') !== encode(packet))
    throw Error('Correction packet reproduction drift');
if (mode === '--integrate') {
    const paths = ['a', 'b', 'c', 'd', 'e', 'f'].map(s => `shared/florida-reviewed-data/${s}.json`);
    const all = paths.flatMap(p => json(p)).map(d => definitions.find(r => r.id === d.id) ?? d);
    const report = { ...oldReport, drafts: oldReport.drafts.map((d: any) => assembled.report.drafts.find(r => r.id === d.id) ?? d), sourceEvidence: { ...oldReport.sourceEvidence, ...assembled.report.sourceEvidence } };
    for (const [key, d] of Object.entries(assembled.report.sourceEvidence)) {
        const previous = oldReport.sourceEvidence[key];
        if (previous && previous.contentHash !== d.contentHash)
            throw Error(`Shared source text changed: ${key}; reconcile other consumers before integration`);
    }
    const ledger = { ...oldEligibility, reportHash: hash(report), decisions: oldEligibility.decisions.map((d: any) => decisions.find(r => r.id === d.id) ?? d) };
    buildFloridaReviewedSourceRecords(all, report, ledger);
    for (const p of paths)
        replaceObjects(p, definitions);
    fs.writeFileSync('scripts/data-review/output/florida-reviewed-analysis.json', encode(report));
    fs.writeFileSync('shared/florida-reviewed-eligibility.json', encode(ledger));
    // Update the engineering assembler inputs as well; do not allow a later rebuild to revert the correction.
    for (const suffix of ['a', 'b', 'c', 'd', 'e', 'f'])
        replaceObjects(`scripts/data-review/output/florida-reviewed-analysis-${suffix}.json`, analyses);
    const cachePath = 'scripts/data-review/output/florida-batch-source-cache.json', activeCache = json(cachePath);
    // Only add previously absent dependencies; identical existing cache bodies retain their acquisition history.
    for (const [key, d] of Object.entries(selected)) {
        if (activeCache.documents[key] && activeCache.documents[key].contentHash !== d.contentHash)
            throw Error(`Cache content drift ${key}`);
        if (!activeCache.documents[key])
            activeCache.documents[key] = d;
    }
    fs.writeFileSync(cachePath, encode(activeCache));
}
console.log(JSON.stringify({ corrected: definitions.length, sections: plan.sections.length, receipt: 'unchanged; corrections do not authorize renewal or live availability' }));
