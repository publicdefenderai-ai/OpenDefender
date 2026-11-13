import { createHash } from 'node:crypto';
import rows from '@shared/florida-credit-card-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_CREDIT_CARD_DEFINITIONS } from '@shared/florida-credit-card-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_CREDIT_CARD_RECEIPT_PATH = resolve(directory, 'florida-credit-card-refresh-receipt.json');
export const floridaCreditCardPacket = JSON.parse(readFileSync(resolve(directory, 'florida-credit-card-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaCreditCardPacket(packet: typeof floridaCreditCardPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_credit_card_publication')
        throw Error('Invalid Florida credit-card packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete credit-card source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete credit-card subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && findSubdivisionRange(doc.text, expected.scope)[0];
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid credit-card subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_CREDIT_CARD_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_CREDIT_CARD_SOURCES = validateFloridaCreditCardPacket(floridaCreditCardPacket);
export function validateFloridaCreditCardReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaCreditCardPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida credit-card evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaCreditCardPacket.report, floridaCreditCardPacket.eligibility, FLORIDA_CREDIT_CARD_SOURCES, now);
}
export function isFloridaCreditCardSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaCreditCardReceipt(JSON.parse(readFileSync(FLORIDA_CREDIT_CARD_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
