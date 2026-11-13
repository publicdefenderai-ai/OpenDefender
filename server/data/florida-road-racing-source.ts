import { createHash } from 'node:crypto';
import rows from '@shared/florida-road-racing-publication.json';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_ROAD_RACING_DEFINITIONS } from '@shared/florida-road-racing-batch';
import { findSubdivisionRange, buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_ROAD_RACING_RECEIPT_PATH = resolve(directory, 'florida-road-racing-refresh-receipt.json');
export const floridaRoadRacingPacket = JSON.parse(readFileSync(resolve(directory, 'florida-road-racing-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    supportingSpans: Array<{id: string; sections: Array<{section: string; scope: string; start: number; end: number; sourceHash: string; quoteHash: string}>}>;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaRoadRacingPacket(packet: typeof floridaRoadRacingPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_road_racing_publication')
        throw Error('Invalid Florida road-racing packet');
    const documents = new Map(Object.values(packet.report.sourceEvidence).map(doc => [doc.section, doc]));
    if (rows.length !== packet.supportingSpans.length) throw Error('Incomplete road-racing source bindings');
    for (const [index, row] of rows.entries()) {
        const binding = packet.supportingSpans[index];
        const required = Object.entries(row.subdivisions).flatMap(([section, scopes]) => (scopes ?? []).map((scope: string) => ({section, scope})));
        if (binding.id !== row.id || binding.sections.length !== required.length) throw Error('Incomplete road-racing subdivision bindings');
        for (const [i, span] of binding.sections.entries()) {
            const expected = required[i];
            const doc = documents.get(expected.section);
            const bounds = doc && findSubdivisionRange(doc.text, expected.scope)[0];
            if (!doc || !bounds || span.section !== expected.section || span.scope !== expected.scope
                || span.start !== bounds.start || span.end !== bounds.end || span.sourceHash !== doc.contentHash
                || span.quoteHash !== createHash('sha256').update(doc.text.slice(bounds.start, bounds.end)).digest('hex'))
                throw Error('Invalid road-racing subdivision binding for ' + row.id);
        }
    }
    const records = buildFloridaReviewedSourceRecords(FLORIDA_ROAD_RACING_DEFINITIONS, packet.report, packet.eligibility);
    return records.map(record => {
        const row = rows.find(item => item.id === record.chargeId)!;
        if (!row.scope.startsWith('(1)(b)') && !(row.section === '316.191' && row.scope.startsWith('(3)'))) return record;
        const rule = row.section === '322.03' ? '(1)(a)' : '(2)';
        const section = record.dependencies.find(d => d.section === row.section && d.subdivision === null);
        const binding = packet.supportingSpans.find(b => b.id === record.chargeId)?.sections.find(s => s.section === row.section && s.scope === rule);
        if (!section || !binding || binding.sourceHash !== section.contentHash) throw Error('Missing roadway conduct binding');
        const text = section.text.slice(binding.start, binding.end);
        return {...record, incorporatedConductEvidence: [{sourceKey:section.sourceKey, target:'text' as const,
            start:binding.start, end:binding.end, sourceHash:section.contentHash, text}]};
    });
}
export const FLORIDA_ROAD_RACING_SOURCES = validateFloridaRoadRacingPacket(floridaRoadRacingPacket);
export function validateFloridaRoadRacingReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaRoadRacingPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida road-racing evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaRoadRacingPacket.report, floridaRoadRacingPacket.eligibility, FLORIDA_ROAD_RACING_SOURCES, now);
}
export function isFloridaRoadRacingSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaRoadRacingReceipt(JSON.parse(readFileSync(FLORIDA_ROAD_RACING_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
