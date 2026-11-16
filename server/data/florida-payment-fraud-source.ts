import { createHash } from 'node:crypto';
import rows from '@shared/florida-payment-fraud-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_PAYMENT_FRAUD_DEFINITIONS } from '@shared/florida-payment-fraud-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_PAYMENT_FRAUD_RECEIPT_PATH = resolve(directory, 'florida-payment-fraud-refresh-receipt.json');
export const floridaPaymentFraudPacket = JSON.parse(readFileSync(resolve(directory, 'florida-payment-fraud-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaPaymentFraudPacket(packet: typeof floridaPaymentFraudPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_payment_fraud_publication')
        throw Error('Invalid Florida payment-fraud packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete payment-fraud source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete payment-fraud subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid payment-fraud subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_PAYMENT_FRAUD_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_PAYMENT_FRAUD_SOURCES = validateFloridaPaymentFraudPacket(floridaPaymentFraudPacket);
export function validateFloridaPaymentFraudReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaPaymentFraudPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida payment-fraud evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaPaymentFraudPacket.report, floridaPaymentFraudPacket.eligibility, FLORIDA_PAYMENT_FRAUD_SOURCES, now);
}
export function isFloridaPaymentFraudSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaPaymentFraudReceipt(JSON.parse(readFileSync(FLORIDA_PAYMENT_FRAUD_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
