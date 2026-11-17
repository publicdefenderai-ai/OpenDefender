import { createHash } from 'node:crypto';
import rows from '@shared/florida-child-restraint-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_CHILD_RESTRAINT_DEFINITIONS } from '@shared/florida-child-restraint-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_CHILD_RESTRAINT_RECEIPT_PATH = resolve(directory, 'florida-child-restraint-refresh-receipt.json');
export const floridaChildRestraintPacket = JSON.parse(readFileSync(resolve(directory, 'florida-child-restraint-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaChildRestraintPacket(packet: typeof floridaChildRestraintPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_child_restraint_publication')
        throw Error('Invalid Florida child-restraint packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete child-restraint source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete child-restraint subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid child-restraint subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_CHILD_RESTRAINT_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_CHILD_RESTRAINT_SOURCES = validateFloridaChildRestraintPacket(floridaChildRestraintPacket);
export function validateFloridaChildRestraintReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaChildRestraintPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida child-restraint evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaChildRestraintPacket.report, floridaChildRestraintPacket.eligibility, FLORIDA_CHILD_RESTRAINT_SOURCES, now);
}
export function isFloridaChildRestraintSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaChildRestraintReceipt(JSON.parse(readFileSync(FLORIDA_CHILD_RESTRAINT_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
