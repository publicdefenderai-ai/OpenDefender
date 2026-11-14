import { createHash } from 'node:crypto';
import rows from '@shared/florida-theft-thresholds-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_THEFT_THRESHOLDS_DEFINITIONS } from '@shared/florida-theft-thresholds-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_THEFT_THRESHOLDS_RECEIPT_PATH = resolve(directory, 'florida-theft-thresholds-refresh-receipt.json');
export const floridaTheftThresholdsPacket = JSON.parse(readFileSync(resolve(directory, 'florida-theft-thresholds-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaTheftThresholdsPacket(packet: typeof floridaTheftThresholdsPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_theft_thresholds_publication')
        throw Error('Invalid Florida theft-thresholds packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete theft-thresholds source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete theft-thresholds subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid theft-thresholds subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_THEFT_THRESHOLDS_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_THEFT_THRESHOLDS_SOURCES = validateFloridaTheftThresholdsPacket(floridaTheftThresholdsPacket);
export function validateFloridaTheftThresholdsReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaTheftThresholdsPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida theft-thresholds evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaTheftThresholdsPacket.report, floridaTheftThresholdsPacket.eligibility, FLORIDA_THEFT_THRESHOLDS_SOURCES, now);
}
export function isFloridaTheftThresholdsSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaTheftThresholdsReceipt(JSON.parse(readFileSync(FLORIDA_THEFT_THRESHOLDS_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
