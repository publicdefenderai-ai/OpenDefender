import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLORIDA_PERSONS_DEFINITIONS } from '@shared/florida-persons-batch';
import { buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt, type FloridaReviewedReport, type FloridaReviewedEligibility, type FloridaReviewedReceipt } from './florida-reviewed-source-records';
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const FLORIDA_PERSONS_RECEIPT_PATH = resolve(directory, 'florida-persons-refresh-receipt.json');
export const floridaPersonsPacket = JSON.parse(readFileSync(resolve(directory, 'florida-persons-publication-evidence.json'), 'utf8')) as {
    schemaVersion: number;
    scope: string;
    report: FloridaReviewedReport;
    eligibility: FloridaReviewedEligibility;
};
export function validateFloridaPersonsPacket(packet: typeof floridaPersonsPacket) {
    if (packet.schemaVersion !== 1 || packet.scope !== 'florida_persons_publication')
        throw Error('Invalid Florida persons packet');
    return buildFloridaReviewedSourceRecords(FLORIDA_PERSONS_DEFINITIONS, packet.report, packet.eligibility);
}
export const FLORIDA_PERSONS_SOURCES = validateFloridaPersonsPacket(floridaPersonsPacket);
export function validateFloridaPersonsReceipt(receipt: FloridaReviewedReceipt, now = new Date()): string | null {
    const latest = Math.max(...Object.values(floridaPersonsPacket.report.sourceEvidence).map(d => Date.parse(d.retrievedAt)));
    if (!Number.isFinite(latest) || Date.parse(receipt.checkedAt) < latest)
        return 'Receipt predates required acquisition';
    if (receipt.verificationPolicy !== 'quarterly-v1')
        return 'Florida persons evidence requires the quarterly policy';
    return validateFloridaReviewedRefreshReceipt(receipt, floridaPersonsPacket.report, floridaPersonsPacket.eligibility, FLORIDA_PERSONS_SOURCES, now);
}
export function isFloridaPersonsSourceFresh(now = new Date()): boolean {
    try {
        return validateFloridaPersonsReceipt(JSON.parse(readFileSync(FLORIDA_PERSONS_RECEIPT_PATH, 'utf8')), now) === null;
    }
    catch {
        return false;
    }
}
