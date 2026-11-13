import { createHash } from 'node:crypto';
import rows from '@shared/florida-corruption-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_CORRUPTION_DEFINITIONS } from '@shared/florida-corruption-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_CORRUPTION_RECEIPT_PATH = resolve(directory, 'florida-corruption-refresh-receipt.json');
export const floridaCorruptionPacket = JSON.parse(readFileSync(resolve(directory, 'florida-corruption-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaCorruptionPacket(packet: typeof floridaCorruptionPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_corruption_publication')
        throw Error('Invalid Florida corruption packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete corruption source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete corruption subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid corruption subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_CORRUPTION_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_CORRUPTION_SOURCES = validateFloridaCorruptionPacket(floridaCorruptionPacket);
export function validateFloridaCorruptionReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaCorruptionPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida corruption evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaCorruptionPacket.report, floridaCorruptionPacket.eligibility, FLORIDA_CORRUPTION_SOURCES, now);
}
export function isFloridaCorruptionSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaCorruptionReceipt(JSON.parse(readFileSync(FLORIDA_CORRUPTION_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
