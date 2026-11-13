import { createHash } from 'node:crypto';
import rows from '@shared/florida-justice-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_JUSTICE_DEFINITIONS } from '@shared/florida-justice-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_JUSTICE_RECEIPT_PATH = resolve(directory, 'florida-justice-refresh-receipt.json');
export const floridaJusticePacket = JSON.parse(readFileSync(resolve(directory, 'florida-justice-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaJusticePacket(packet: typeof floridaJusticePacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_justice_publication')
        throw Error('Invalid Florida justice packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete justice source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete justice subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && findSubdivisionRange(doc.text, expected.scope)[0];
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid justice subdivision binding for ' + row.id);
        }
    }
    // The witness records cite their charge-specific grade, while the prohibited
    // acts are incorporated from (1) or (3). Keep both citations in provenance.
    const records = buildFloridaReviewedSourceRecords(FLORIDA_JUSTICE_DEFINITIONS, packet.report, packet.eligibility);
    return records.map(record => {
        if (record.offense.section !== '914.22') return record;
        const rule = record.code.startsWith('914.22(2)') ? '(1)' : '(3)';
        const section = record.dependencies.find(d => d.section === '914.22' && d.subdivision === null);
        const binding = packet.supportingSpans.find(b => b.id === record.chargeId)?.sections.find(s => s.section === '914.22' && s.scope === rule);
        if (!section || !binding || binding.sourceHash !== section.contentHash) throw Error('Missing witness conduct binding');
        const text = section.text.slice(binding.start, binding.end);
        return {...record, incorporatedConductEvidence: [{sourceKey:section.sourceKey, target:'text' as const,
            start:binding.start, end:binding.end, sourceHash:section.contentHash, text}]};
    });
}
export const FLORIDA_JUSTICE_SOURCES = validateFloridaJusticePacket(floridaJusticePacket);
export function validateFloridaJusticeReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaJusticePacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida justice evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaJusticePacket.report, floridaJusticePacket.eligibility, FLORIDA_JUSTICE_SOURCES, now);
}
export function isFloridaJusticeSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaJusticeReceipt(JSON.parse(readFileSync(FLORIDA_JUSTICE_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
