import { createHash } from 'node:crypto';
import rows from '@shared/florida-boating-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_BOATING_DEFINITIONS } from '@shared/florida-boating-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_BOATING_RECEIPT_PATH = resolve(directory, 'florida-boating-refresh-receipt.json');
export const floridaBoatingPacket = JSON.parse(readFileSync(resolve(directory, 'florida-boating-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaBoatingPacket(packet: typeof floridaBoatingPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_boating_publication')
        throw Error('Invalid Florida boating packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete boating source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete boating subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid boating subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_BOATING_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_BOATING_SOURCES = validateFloridaBoatingPacket(floridaBoatingPacket);
export function validateFloridaBoatingReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaBoatingPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida boating evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaBoatingPacket.report, floridaBoatingPacket.eligibility, FLORIDA_BOATING_SOURCES, now);
}
export function isFloridaBoatingSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaBoatingReceipt(JSON.parse(readFileSync(FLORIDA_BOATING_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
