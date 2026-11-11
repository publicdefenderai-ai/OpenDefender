import { QUARTERLY_POLICY, LEGACY_WINDOW_MS, quarterlyDeadline, validVerificationWindow } from '../../shared/source-verification-policy.mjs';
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
const majorPacketHash = hash(JSON.stringify(ohioMajorPacket));
const digest = /^[a-f0-9]{64}$/;
const quarterlyKind = 'unchanged_official_source_comparison';

type MajorAcquisition = {
  section: string;
  title: string;
  sourceUrl: string;
  effectiveDateStart: string;
  contentHash: string;
  pageHash: string;
  retrievedAt: string;
};
type Identity = Pick<MajorAcquisition, 'title' | 'effectiveDateStart' | 'contentHash'>;
type ComparisonSource = {
  url: string; httpStatus: number; pageHash: string; retrievedAt: string;
  comparisons: Array<{family: string; section: string; status: string; chargeIds: string[]; expected: Identity; observed: Identity | null}>;
};
type Comparison = {schemaVersion: number; purpose: string; sources: ComparisonSource[]};
type MajorReceipt = {
  schemaVersion?: number; kind?: string; checkedAt?: string; expiresAt?: string;
  verificationPolicy?: string; packetHash?: string; comparisonHash?: string; acquisitions?: MajorAcquisition[];
};
function timestamp(value: unknown): number {
  if (typeof value !== 'string') return NaN;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value ? time : NaN;
}

function sameIdentity(identity: Identity | null, document: OhioReviewedDocument): boolean {
  return !!identity && identity.title === document.title && identity.contentHash === document.contentHash &&
    identity.effectiveDateStart === document.effectiveDateStart;
}

// The summary counts in comparison reports are informational. Reconstruct each binding
// directly from the approved packet and the exact source-level comparison.
function majorComparisonAcquisitions(comparison: Comparison, checked: number): MajorAcquisition[] {
  if (comparison?.schemaVersion !== 1 || comparison.purpose !== 'candidate_source_comparison_only' || !Array.isArray(comparison.sources)) {
    throw Error('Missing Ohio comparison evidence');
  }
  const expected = new Map(Object.values(ohioMajorPacket.documents).map(document => [document.sourceUrl, document]));
  const acquisitions = new Map<string, MajorAcquisition>();
  for (const source of comparison.sources) {
    const document = expected.get(source.url);
    const matches = source.comparisons.filter(row => row.family === 'major');
    if (!document && !matches.length) continue;
    const row = matches[0];
    if (!document || matches.length !== 1 || row.section !== document.section || acquisitions.has(document.section) ||
        source.httpStatus !== 200 || typeof source.pageHash !== 'string' || !digest.test(source.pageHash) || row.status !== 'unchanged' ||
        !sameIdentity(row.expected, document) || !sameIdentity(row.observed, document)) {
      throw Error('Missing, duplicated or changed Ohio major source comparison');
    }
    const ids = ohioMajorPacket.records.filter(record => record.section === document.section || record.dependencies.includes(document.section))
      .map(record => record.id).sort();
    if (!Array.isArray(row.chargeIds) || JSON.stringify([...row.chargeIds].sort()) !== JSON.stringify(ids)) {
      throw Error('Ohio major charge bindings differ from the approved packet');
    }
    const time = timestamp(source.retrievedAt);
    if (!Number.isFinite(time) || time < Date.parse(document.retrievedAt) || time > checked ||
        document.effectiveDateStart > source.retrievedAt.slice(0, 10)) throw Error('Invalid Ohio major acquisition time');
    acquisitions.set(document.section, {
      section: document.section, title: document.title, sourceUrl: document.sourceUrl,
      effectiveDateStart: document.effectiveDateStart, contentHash: document.contentHash,
      pageHash: source.pageHash, retrievedAt: source.retrievedAt,
    });
  }
  if (acquisitions.size !== expected.size) throw Error('Incomplete Ohio major acquisition ledger');
  return [...acquisitions.values()].sort((a, b) => a.section.localeCompare(b.section));
}

/** In-memory proposal only. A separately approved active receipt must reference the same frozen comparison. */
export function prepareOhioMajorQuarterlyReceipt(comparison: Comparison, checkedAt: Date) {
  if (!Number.isFinite(checkedAt.getTime())) throw Error('Invalid Ohio major comparison time');
  const acquisitions = majorComparisonAcquisitions(comparison, checkedAt.getTime());
  const oldest = Math.min(...acquisitions.map(row => timestamp(row.retrievedAt)));
  const expiresAt = quarterlyDeadline(oldest);
  if (Date.parse(expiresAt) <= checkedAt.getTime()) throw Error('Ohio major comparison is already expired');
  return {schemaVersion: 1, kind: quarterlyKind, verificationPolicy: QUARTERLY_POLICY,
    packetHash: majorPacketHash, comparisonHash: hash(JSON.stringify(comparison)), acquisitions,
    checkedAt: checkedAt.toISOString(), expiresAt};
}

export function validateOhioMajorReceipt(value: unknown, now = new Date(), comparison?: Comparison): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Missing Ohio major receipt';
  const receipt = value as MajorReceipt;
  const checked = timestamp(receipt.checkedAt), expires = timestamp(receipt.expiresAt);
  if (!Number.isFinite(now.getTime()) || receipt.schemaVersion !== 1 || receipt.packetHash !== majorPacketHash ||
      !Number.isFinite(checked) || !Number.isFinite(expires) || checked > now.getTime() || expires <= checked || expires <= now.getTime()) {
    return 'Ohio major evidence window is missing, mismatched or expired';
  }
  if (receipt.kind === 'initial_acquired_evidence_window') {
    const original = Object.values(ohioMajorPacket.documents).map(document => Date.parse(document.retrievedAt));
    return receipt.verificationPolicy === undefined && receipt.comparisonHash === undefined && receipt.acquisitions === undefined &&
      checked >= Math.max(...original) && expires <= Math.min(...original) + LEGACY_WINDOW_MS
      ? null : 'Invalid initial Ohio major evidence window';
  }
  if (receipt.kind !== quarterlyKind || receipt.verificationPolicy !== QUARTERLY_POLICY ||
      typeof receipt.comparisonHash !== 'string' || !digest.test(receipt.comparisonHash) || !Array.isArray(receipt.acquisitions)) {
    return 'Missing Ohio major quarterly acquisition evidence';
  }
  try {
    // The mutable research candidate is never an active source of authority.
    const approved = comparison ?? JSON.parse(readFileSync(resolve(directory, 'ohio-major-approved-comparisons', receipt.comparisonHash + '.json'), 'utf8'));
    if (hash(JSON.stringify(approved)) !== receipt.comparisonHash) return 'Ohio major comparison digest mismatch';
    const ledger = majorComparisonAcquisitions(approved, checked);
    if (JSON.stringify(ledger) !== JSON.stringify(receipt.acquisitions)) return 'Ohio major acquisition ledger mismatch';
    if (!validVerificationWindow(receipt, new Date(Math.min(...ledger.map(row => timestamp(row.retrievedAt)))).toISOString())) return 'Ohio major quarterly window exceeds its oldest acquisition';
    return null;
  } catch {
    return 'Ohio major approved comparison is missing or mismatched';
  }
}
export function isOhioMajorSourceFresh(now = new Date()): boolean {
  try { return validateOhioMajorReceipt(JSON.parse(readFileSync(OHIO_MAJOR_RECEIPT_PATH, 'utf8')), now) === null; }
  catch { return false; }
}
