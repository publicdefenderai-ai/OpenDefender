/** Publishable evidence packet; does not alter the existing101 reviewed bundle. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import rows from '../../../shared/florida-credit-card-publication.json';
import { FLORIDA_CREDIT_CARD_DEFINITIONS } from '../../../shared/florida-credit-card-batch';
import { assembleFloridaReviewedReport, findSubdivisionRange, type FloridaReviewedAnalysisEntry } from '../../../server/data/florida-reviewed-source-records';
import { quarterlyDeadline } from '../../../shared/source-verification-policy.mjs';
const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const arg = process.argv[2];
if (!arg)
    throw Error('Pass candidate.json or --check');
const out = 'scripts/data-review/output';
const retained = arg === '--check' ? JSON.parse(fs.readFileSync(path.join(out, 'florida-credit-card-publication-evidence.json'), 'utf8')) : null;
const cache = retained ? { schemaVersion: 1, jurisdiction: 'FL', documents: Object.fromEntries(Object.values(retained.report.sourceEvidence).map((d: any) => [d.section, { ...d, ...retained.acquisitionMetadata[d.section] }])) } : JSON.parse(fs.readFileSync(arg, 'utf8'));
const docs = cache.documents;
const quote = (section: string, scope: string) => { const range = findSubdivisionRange(docs[section].text, scope)[0]; if (!range)
    throw Error(`Missing scope ${section}${scope}`); return docs[section].text.slice(range.start, range.end).trim(); };
const analyses: FloridaReviewedAnalysisEntry[] = rows.map(row => ({
    id: row.id, section: row.section, status: 'eligible', reason: 'Exact primary branch, underlying conduct, grading and penalty evidence prepared for independent review.',
    identity: { kind: 'official_heading', quote: row.officialTitle, sourceHash: docs[row.section].contentHash },
    conductQuotes: [quote(row.section, row.scope)],
    gradingQuotes: row.gradingScopes.map(scope => quote(row.gradingSection, scope)),
    requiredSections: [{ section: row.section, role: 'offense', contentHash: docs[row.section].contentHash }, ...row.dependencies.map(section => ({ section, role: ((section === row.section || section === row.gradingSection) ? 'grading' : section.startsWith('775.') ? 'penalty' : 'definition') as 'grading' | 'penalty' | 'definition', contentHash: docs[section].contentHash }))],
    notes: `Scope ${row.section}${row.scope}. Branch name qualifies the statutory heading. Underlying conduct and conditions remain incorporated through the bound complete dependency texts.`,
}));
const newest = Math.max(...Object.values(docs).map((d: any) => Date.parse(d.retrievedAt)));
const assembled = assembleFloridaReviewedReport(FLORIDA_CREDIT_CARD_DEFINITIONS, analyses, cache, new Date(newest));
if (assembled.technicalHolds.length)
    throw Error(JSON.stringify(assembled.technicalHolds, null, 2));
const eligibility = { schemaVersion: 1, reportHash: hash(assembled.report), decisions: FLORIDA_CREDIT_CARD_DEFINITIONS.map(def => {
        const draft = assembled.report.drafts.find(d => d.id === def.id)!;
        const base = { id: def.id, status: 'eligible', reason: 'Individually source-bound publication proposal; approval requires reviewed merge and production import remains separate.', draftHash: hash(draft), definitionHash: hash(def) };
        return { ...base, approvalHash: hash(base) };
    }) };
const sources = Object.values(assembled.report.sourceEvidence);
const oldest = Math.min(...sources.map(d => Date.parse(d.retrievedAt)));
const receipt = { schemaVersion: 1, verificationPolicy: 'quarterly-v1', reportHash: hash(assembled.report), eligibilityHash: hash(eligibility), checkedAt: new Date(newest).toISOString(), expiresAt: quarterlyDeadline(new Date(oldest).toISOString()), documents: sources.map(d => ({ sourceKey: d.sourceKey, contentHash: d.contentHash, retrievedAt: d.retrievedAt })) };
const acquisitionMetadata = Object.fromEntries(Object.entries(docs).sort(([a], [b]) => a.localeCompare(b)).map(([key, d]: [
    string,
    any
]) => [key, { edition: d.edition, acquiredFrom: d.acquiredFrom, acquisitionKind: d.acquisitionKind, currentnessProvenance: d.currentnessProvenance }]));
const supportingSpans = rows.map(row => ({id: row.id, sections: Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map(scope => {
    const text = docs[section].text;
    const [span] = findSubdivisionRange(text, scope);
    if (!span) throw Error("Missing supporting span " + section + scope);
    return {section,scope,start:span.start,end:span.end,sourceHash:docs[section].contentHash,quoteHash:createHash("sha256").update(text.slice(span.start,span.end)).digest("hex")};
}))}));
const packet = { schemaVersion: 1, scope: 'florida_credit_card_publication', acquisitionMetadata, supportingSpans, report: assembled.report, eligibility };
if (arg === '--check') {
    for (const [name, value] of [['florida-credit-card-publication-evidence.json', packet], ['florida-credit-card-refresh-receipt.json', receipt]] as const) {
        if (fs.readFileSync(path.join(out, name), 'utf8') !== JSON.stringify(value, null, 2) + '\n')
            throw Error(`Regeneration drift: ${name}`);
    }
}
else {
    fs.writeFileSync(path.join(out, 'florida-credit-card-publication-evidence.json'), JSON.stringify(packet, null, 2) + '\n');
    fs.writeFileSync(path.join(out, 'florida-credit-card-refresh-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
}
console.log(JSON.stringify({ records: rows.length, documents: new Set(sources.map(d => d.section)).size, sourceBindings: sources.length, oldestAcquisition: new Date(oldest).toISOString(), expiresAt: receipt.expiresAt }));
