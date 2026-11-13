import { createHash } from 'node:crypto';
import rows from '@shared/florida-court-officials-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_COURT_OFFICIALS_DEFINITIONS } from '@shared/florida-court-officials-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_COURT_OFFICIALS_RECEIPT_PATH = resolve(directory, 'florida-court-officials-refresh-receipt.json');
export const floridaCourtOfficialsPacket = JSON.parse(readFileSync(resolve(directory, 'florida-court-officials-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaCourtOfficialsPacket(packet: typeof floridaCourtOfficialsPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_court_officials_publication')
        throw Error('Invalid Florida court-officials packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete court-officials source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete court-officials subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && findSubdivisionRange(doc.text, expected.scope)[0];
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid court-officials subdivision binding for ' + row.id);
        }
    }
    const records = buildFloridaReviewedSourceRecords(FLORIDA_COURT_OFFICIALS_DEFINITIONS, packet.report, packet.eligibility);
    return records.map(record => {
        const row = rows.find(item => item.id === record.chargeId)!;
        if (row.conductScope === row.scope) return record;
        const rule = row.conductScope;
        const section = record.dependencies.find(d => d.section === row.section && d.subdivision === null);
        const binding = packet.supportingSpans.find(b => b.id === record.chargeId)?.sections.find(s => s.section === row.section && s.scope === rule);
        if (!section || !binding || binding.sourceHash !== section.contentHash) throw Error('Missing court-official conduct binding');
        const text = section.text.slice(binding.start, binding.end);
        return {...record, incorporatedConductEvidence: [{sourceKey:section.sourceKey, target:'text' as const,
            start:binding.start, end:binding.end, sourceHash:section.contentHash, text}]};
    });
}
export const FLORIDA_COURT_OFFICIALS_SOURCES = validateFloridaCourtOfficialsPacket(floridaCourtOfficialsPacket);
export function validateFloridaCourtOfficialsReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaCourtOfficialsPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida court-officials evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaCourtOfficialsPacket.report, floridaCourtOfficialsPacket.eligibility, FLORIDA_COURT_OFFICIALS_SOURCES, now);
}
export function isFloridaCourtOfficialsSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaCourtOfficialsReceipt(JSON.parse(readFileSync(FLORIDA_COURT_OFFICIALS_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
