import { createHash } from 'node:crypto';
import rows from '@shared/florida-crash-flight-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_CRASH_FLIGHT_DEFINITIONS } from '@shared/florida-crash-flight-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_CRASH_FLIGHT_RECEIPT_PATH = resolve(directory, 'florida-crash-flight-refresh-receipt.json');
export const floridaCrashFlightPacket = JSON.parse(readFileSync(resolve(directory, 'florida-crash-flight-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaCrashFlightPacket(packet: typeof floridaCrashFlightPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_crash_flight_publication')
        throw Error('Invalid Florida crash/flight packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete crash/flight source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete crash/flight subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && findSubdivisionRange(doc.text, expected.scope)[0];
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid crash/flight subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_CRASH_FLIGHT_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_CRASH_FLIGHT_SOURCES = validateFloridaCrashFlightPacket(floridaCrashFlightPacket);
export function validateFloridaCrashFlightReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaCrashFlightPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida crash/flight evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaCrashFlightPacket.report, floridaCrashFlightPacket.eligibility, FLORIDA_CRASH_FLIGHT_SOURCES, now);
}
export function isFloridaCrashFlightSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaCrashFlightReceipt(JSON.parse(readFileSync(FLORIDA_CRASH_FLIGHT_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
