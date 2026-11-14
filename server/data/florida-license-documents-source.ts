import { createHash } from 'node:crypto';
import rows from '@shared/florida-license-documents-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_LICENSE_DOCUMENTS_DEFINITIONS } from '@shared/florida-license-documents-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_LICENSE_DOCUMENTS_RECEIPT_PATH = resolve(directory, 'florida-license-documents-refresh-receipt.json');
export const floridaLicenseDocumentsPacket = JSON.parse(readFileSync(resolve(directory, 'florida-license-documents-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaLicenseDocumentsPacket(packet: typeof floridaLicenseDocumentsPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_license_documents_publication')
        throw Error('Invalid Florida license-documents packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete license-documents source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete license-documents subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && (expected.scope ? findSubdivisionRange(doc.text, expected.scope)[0] : {start:0,end:doc.text.length});
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid license-documents subdivision binding for ' + row.id);
        }
    }
    return buildFloridaReviewedSourceRecords(FLORIDA_LICENSE_DOCUMENTS_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_LICENSE_DOCUMENTS_SOURCES = validateFloridaLicenseDocumentsPacket(floridaLicenseDocumentsPacket);
export function validateFloridaLicenseDocumentsReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaLicenseDocumentsPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida license-documents evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaLicenseDocumentsPacket.report, floridaLicenseDocumentsPacket.eligibility, FLORIDA_LICENSE_DOCUMENTS_SOURCES, now);
}
export function isFloridaLicenseDocumentsSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaLicenseDocumentsReceipt(JSON.parse(readFileSync(FLORIDA_LICENSE_DOCUMENTS_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
