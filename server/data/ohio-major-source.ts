import { QUARTERLY_POLICY, validVerificationWindow } from "../../shared/source-verification-policy.mjs";
import { validateOhioClassificationEvidence } from '@shared/ohio-primary-classification';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OHIO_MAJOR_DEFINITIONS, OHIO_MAJOR_SENTENCING, ohioMajorDependencies } from '@shared/ohio-major-batch';
import rows from '@shared/ohio-major-publication.json';
import type { OhioReviewedDocument, OhioReviewedSource } from './ohio-reviewed-source';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const OHIO_MAJOR_RECEIPT_PATH = resolve(directory, 'ohio-major-refresh-receipt.json');
type Span = { section: string; sourceHash: string; start: number; end: number; text: string };
type Packet = { schemaVersion: number; kind: string; sentencingHash: string;
  documents: Record<string, OhioReviewedDocument>;
  records: Array<{ id: string; section: string; scope: string; definitionHash: string; primaryClassification: unknown;
    dependencies: string[]; conduct: Span[]; grading: Span[]; evidence: Span[] }> };
export const ohioMajorPacket = JSON.parse(readFileSync(resolve(directory, 'ohio-major-publication-evidence.json'), 'utf8')) as Packet;
export function validateOhioMajorPacket(packet: Packet): void {
  if (packet.schemaVersion !== 1 || packet.kind !== 'ohio_major_publication_evidence' ||
      packet.sentencingHash !== hash(JSON.stringify(OHIO_MAJOR_SENTENCING)) || packet.records.length !== rows.length ||
      new Set(packet.records.map(r => r.id)).size !== rows.length) throw Error('Ohio major packet accounting changed');
  const used = new Set<string>();
  for (const record of packet.records) {
    const row = rows.find(r => r.id === record.id), definition = OHIO_MAJOR_DEFINITIONS.find(r => r.id === record.id);
    if (!row || !definition || record.section !== row.section || record.scope !== row.scope ||
        record.definitionHash !== hash(JSON.stringify(definition)) ||
        JSON.stringify(record.dependencies) !== JSON.stringify(ohioMajorDependencies(row)) ||
        !record.conduct.length || !record.grading.length) throw Error(`Unbound Ohio major definition ${record.id}`);
    if (JSON.stringify(record.primaryClassification) !== JSON.stringify("primaryClassification" in row ? row.primaryClassification : null)) throw Error(`Ohio classification binding changed ${record.id}`);
    validateOhioClassificationEvidence(row, record.grading);
    const sections = [record.section, ...record.dependencies];
    for (const section of sections) {
      used.add(section); const doc = packet.documents[section];
      if (!doc || doc.section !== section || hash(doc.text) !== doc.contentHash ||
          doc.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${section}` ||
          !doc.text.startsWith(`Section ${section} |\n${doc.title}.\nEffective: ${doc.effectiveDateStart}\n`) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDateStart) ||
          !Number.isFinite(Date.parse(doc.retrievedAt)) || doc.effectiveDateStart > doc.retrievedAt.slice(0,10) ||
          !record.evidence.some(span => span.section === section && span.start === 0 && span.end === doc.text.length)) throw Error(`Invalid Ohio major dependency ${record.id}/${section}`);
    }
    for (const span of [...record.conduct, ...record.grading, ...record.evidence]) {
      const doc = packet.documents[span.section];
      if (!sections.includes(span.section) || !doc || doc.contentHash !== span.sourceHash ||
          !Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < 0 || span.end <= span.start || span.end > doc.text.length ||
          doc.text.slice(span.start, span.end) !== span.text) throw Error(`Invalid Ohio major evidence ${record.id}/${span.section}`);
    }
    if ([...record.conduct, ...record.grading].some(span => span.section !== record.section)) throw Error(`Wrong primary authority ${record.id}`);
    if (!record.grading.some(span => span.section === record.section &&
      span.text.toLowerCase().includes(`guilty of ${definition.name.toLowerCase()}`))) throw Error(`Unbound Ohio statutory name ${record.id}`);
  }
  if (Object.keys(packet.documents).some(section => !used.has(section))) throw Error('Unused Ohio major authority');
}
validateOhioMajorPacket(ohioMajorPacket);
export const OHIO_MAJOR_SOURCES: readonly OhioReviewedSource[] = ohioMajorPacket.records.map(record => {
  const definition = OHIO_MAJOR_DEFINITIONS.find(row => row.id === record.id)!;
  return { chargeId: record.id, canonicalTitle: definition.name, section: record.section,
    conduct: definition.text.en.plainSummary, grading: definition.text.en.degreeContext,
    interpretation: `Published scope: ${record.scope}. Bound offense-specific grading and dependencies; excluded branches are not approved.`,
    offense: ohioMajorPacket.documents[record.section], evidence: [...record.conduct, ...record.grading, ...record.evidence],
    dependencies: record.dependencies.map(section => ohioMajorPacket.documents[section]), reviewedLegalDecision: null };
});
export function validateOhioMajorReceipt(receipt: any, now = new Date()): string | null {
  const checked = Date.parse(receipt?.checkedAt), expires = Date.parse(receipt?.expiresAt);
  const acquisitions = Object.values(ohioMajorPacket.documents).map(doc => Date.parse(doc.retrievedAt));
  if (!Number.isFinite(now.getTime()) || receipt?.schemaVersion !== 1 || receipt?.kind !== 'reacquired_evidence_window' || receipt.verificationPolicy !== QUARTERLY_POLICY ||
      receipt?.packetHash !== hash(JSON.stringify(ohioMajorPacket)) ||
      !Number.isFinite(checked) || !Number.isFinite(expires) || checked > now.getTime() ||
      checked !== Math.max(...acquisitions) || expires <= checked || expires <= now.getTime() ||
      !validVerificationWindow(receipt, new Date(Math.min(...acquisitions)).toISOString())) return 'Ohio major evidence window is missing, mismatched or expired';
  return null;
}
export function isOhioMajorSourceFresh(now = new Date()): boolean {
  try { return validateOhioMajorReceipt(JSON.parse(readFileSync(OHIO_MAJOR_RECEIPT_PATH, 'utf8')), now) === null; }
  catch { return false; }
}
