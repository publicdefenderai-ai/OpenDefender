/** Correct existing product content and its evidence. Never issue or extend a receipt. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import plan from './correction-plan.json';
import originals from './previous-definitions.json';
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
const output = 'scripts/data-review/output/florida-domestic-corrections.json';
const mode = process.argv[2], candidate = process.argv[3];
if (!['--prepare', '--integrate', '--check'].includes(mode))
    throw Error('Use --prepare candidate.json, --integrate, or --check');
const oldReport = json('scripts/data-review/output/florida-reviewed-analysis.json');
const oldEligibility = json('shared/florida-reviewed-eligibility.json');
const retained = mode === '--prepare' ? null : json(output);
const cache = mode === '--prepare' ? json(candidate) : { schemaVersion: 1, jurisdiction: 'FL', documents: retained.documents };
const docs = cache.documents as Record<string, FloridaReviewedCacheDocument>;
const ids = new Set(plan.records.map(r => r.id));
const required = (row: typeof plan.records[number], section: string) => [...new Set([section, '775.082', '775.083', '775.084', '741.28', '741.2801', '741.281', '741.283', '741.325', ...(['784.011', '784.03', '784.045'].includes(section) ? ['870.01'] : []), ...(section === '784.03' ? ['843.01'] : []), ...(section === '784.045' ? ['784.03'] : []), ...(section === '784.048' ? ['794.011', '800.04', '847.0135', '921.244'] : [])])];
const definitions = originals.map(original => {
    const d = structuredClone(original) as EvidenceBackedChargeDefinition;
    const row = plan.records.find(r => r.id === d.id)!;
    const section = d.code.match(/^\d+\.\d+/)![0];
    d.categories = row.categories as typeof d.categories;
    d.verifiedMonth = '2026-11';
    d.citations = [d.citations[0], ...required(row, section).map(s => ({ citation: `Fla. Stat. § ${s}`, url: floridaSectionUrl(s) }))];
    for (const lang of ['en', 'es', 'zh'] as const) {
        const range = row.ordinaryGrade as keyof typeof plan.ordinaryRanges;
        d.text[lang].degreeContext = [original.text[lang].degreeContext, plan.ordinaryRanges[range][lang], plan.conditions[lang], plan.enhancedRanges[range][lang], ...(section === '784.03' ? [plan.batteryException[lang]] : []), ...(section === '784.048' ? [plan.stalkingSentencing[lang]] : []), plan.domesticSentencing[lang]].join(' ');
    }
    return d;
});
const quote = (section: string, scope: string) => { const r = findSubdivisionRange(docs[section].text, scope)[0]; if (!r)
    throw Error(`Missing ${section}${scope}`); return docs[section].text.slice(r.start, r.end).trim(); };
const analyses: FloridaReviewedAnalysisEntry[] = definitions.map(d => {
    const row = plan.records.find(r => r.id === d.id)!, section = d.code.match(/^\d+\.\d+/)![0];
    const original = retained?.baselineDrafts.find((r: any) => r.id === d.id) ?? oldReport.drafts.find((r: any) => r.id === d.id);
    if (!original)
        throw Error(`Missing original ${d.id}`);
    const identity = original.identityEvidence;
    return { id: d.id, section, status: 'eligible', reason: 'Existing identity with individually bound domestic-violence grading and sentencing correction.', identity: { kind: identity.target === 'title' ? 'official_heading' : 'operative_guilt_clause', quote: identity.text, sourceHash: docs[section].contentHash }, conductQuotes: original.conductEvidence.map((e: any) => e.text), gradingQuotes: [...original.gradeEvidence.map((e: any) => e.text), quote('741.2801', '(2)'), ...(section === '784.011' ? [quote(section, '(3)')] : [])], requiredSections: [{ section, role: 'offense', contentHash: docs[section].contentHash }, ...required(row, section).map(s => ({ section: s, role: (s === section || s === '741.2801' ? 'grading' : s.startsWith('775.') || ['741.281', '741.283'].includes(s) ? 'penalty' : 'definition') as 'grading' | 'penalty' | 'definition', contentHash: docs[s].contentHash }))], notes: 'Existing identity and translated base summaries preserved. Ordinary statutory categories remain first; conditional domestic-violence upgrades and exact section 784.03(2) exception are bound separately. No receipt issuance or extension.' };
});
const selected = Object.fromEntries(plan.sections.map(s => { if (!docs[s])
    throw Error(`Missing ${s}`); return [s, docs[s]]; }));
const now = new Date(Math.max(...Object.values(selected).map(d => Date.parse(d.retrievedAt))));
const assembled = assembleFloridaReviewedReport(definitions, analyses, { schemaVersion: 1, jurisdiction: 'FL', documents: selected }, now);
if (assembled.technicalHolds.length)
    throw Error(JSON.stringify(assembled.technicalHolds));
const decisions = definitions.map(d => { const draft = assembled.report.drafts.find(r => r.id === d.id)!; const base = { id: d.id, status: 'eligible', reason: 'Corrected existing record with individually bound domestic-violence conditions; freshness and database gates remain separate.', draftHash: hash(draft), definitionHash: hash(d) }; return { ...base, approvalHash: hash(base) }; });
const eligibility = { schemaVersion: 1, reportHash: hash(assembled.report), decisions };
buildFloridaReviewedSourceRecords(definitions, assembled.report, eligibility as any);
const packet = { schemaVersion: 1, kind: 'florida_domestic_corrections_without_receipt_renewal', baselineDrafts: (retained?.baselineDrafts ?? oldReport.drafts.filter((r: any) => ids.has(r.id))).map((r: any) => ({ id: r.id, identityEvidence: r.identityEvidence, conductEvidence: r.conductEvidence, gradeEvidence: r.gradeEvidence })), documents: selected, definitions, analyses, report: assembled.report, eligibility };
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
