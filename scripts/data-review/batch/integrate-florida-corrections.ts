import fs from 'node:fs';
import {createHash} from 'node:crypto';
import { assembleFloridaReviewedReport, buildFloridaReviewedSourceRecords, type FloridaReviewedAnalysisEntry, type FloridaReviewedCacheDocument } from '../../../server/data/florida-reviewed-source-records';
import type { EvidenceBackedChargeDefinition } from '../../../shared/evidence-backed-charge-batch';
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
export function integrateFloridaCorrections(definitions: EvidenceBackedChargeDefinition[], analyses: FloridaReviewedAnalysisEntry[], assembled: ReturnType<typeof assembleFloridaReviewedReport>, decisions: {id:string; status:string; reason:string; draftHash:string; definitionHash:string; approvalHash:string}[], selected: Record<string,FloridaReviewedCacheDocument>, baselines: readonly {id:string}[]) {
    const oldReport = json('scripts/data-review/output/florida-reviewed-analysis.json');
    const oldEligibility = json('shared/florida-reviewed-eligibility.json');
    const paths = ['a', 'b', 'c', 'd', 'e', 'f'].map(s => `shared/florida-reviewed-data/${s}.json`);
    const current = paths.flatMap(p => json(p));
    for (const correction of definitions) {
        const prior = current.filter(row => row.id === correction.id);
        const baseline = baselines.find(row => row.id === correction.id);
        if (prior.length !== 1 || !baseline || ![hash(baseline), hash(correction)].includes(hash(prior[0]))) {
            throw Error(`Reconcile the current definition before applying ${correction.id}`);
        }
    }
    const all = current.map(row => definitions.find(d => d.id === row.id) ?? row);
    const report = { ...oldReport, drafts: oldReport.drafts.map((d: any) => assembled.report.drafts.find(r => r.id === d.id) ?? d), sourceEvidence: { ...oldReport.sourceEvidence, ...assembled.report.sourceEvidence } };
    for (const [key, d] of Object.entries(assembled.report.sourceEvidence)) {
        const previous = oldReport.sourceEvidence[key];
        if (previous && previous.contentHash !== d.contentHash)
            throw Error(`Shared source text changed: ${key}; reconcile other consumers before integration`);
    }
    const ledger = { ...oldEligibility, reportHash: hash(report), decisions: oldEligibility.decisions.map((d: any) => decisions.find(r => r.id === d.id) ?? d) };
    buildFloridaReviewedSourceRecords(all, report, ledger);
    const cachePath = 'scripts/data-review/output/florida-batch-source-cache.json', activeCache = json(cachePath);
    // Only add previously absent dependencies; identical existing cache bodies retain their acquisition history.
    for (const [key, d] of Object.entries(selected)) {
        if (activeCache.documents[key] && activeCache.documents[key].contentHash !== d.contentHash)
            throw Error(`Cache content drift ${key}`);
        if (!activeCache.documents[key])
            activeCache.documents[key] = d;
    }
    for (const p of paths)
        replaceObjects(p, definitions);
    fs.writeFileSync('scripts/data-review/output/florida-reviewed-analysis.json', encode(report));
    fs.writeFileSync('shared/florida-reviewed-eligibility.json', encode(ledger));
    // Update the engineering assembler inputs as well; do not allow a later rebuild to revert the correction.
    for (const suffix of ['a', 'b', 'c', 'd', 'e', 'f'])
        replaceObjects(`scripts/data-review/output/florida-reviewed-analysis-${suffix}.json`, analyses);
    fs.writeFileSync(cachePath, encode(activeCache));
}
