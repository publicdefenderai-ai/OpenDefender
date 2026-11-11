import { quarterlyDeadline, QUARTERLY_POLICY } from '../../shared/source-verification-policy.mjs';
import type { OhioReviewedDocument } from '../../server/data/ohio-reviewed-source';
import { validateOhioClassificationEvidence } from '../../shared/ohio-primary-classification';
/** Offline publication packet: never connects to a database or renews older receipts. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import rows from '../../shared/ohio-major-publication.json';
import { OHIO_MAJOR_DEFINITIONS, ohioMajorDependencies, OHIO_MAJOR_SENTENCING } from '../../shared/ohio-major-batch';
import { bind, division, buildOhioMajorSubstantive } from './ohio-major-substantive';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export function buildOhioMajorPublication() {
  const mapping = buildOhioMajorSubstantive();
  const all = Object.assign({}, ...['ohio-major-coverage-evidence.json','ohio-major-substantive-evidence.json'].map(name => JSON.parse(readFileSync(`scripts/data-review/output/${name}`, 'utf8')).documents));
  // Reuse the reviewed text only when the separately retained acquisition matches every pin.
  const acquisitions: Omit<OhioReviewedDocument, 'text'>[] = JSON.parse(readFileSync('scripts/data-review/output/ohio-major-reacquisitions.json', 'utf8'));
  const acquired = new Map(acquisitions.map(doc => [doc.section, doc]));
  if (acquired.size !== acquisitions.length) throw Error('Duplicate Ohio major acquisition');
  for (const [section, fresh] of acquired) {
    const original = all[section];
    if (!original || fresh.contentHash !== hash(original.text) || fresh.title !== original.title ||
        fresh.sourceUrl !== original.sourceUrl || fresh.effectiveDateStart !== original.effectiveDateStart ||
        !Number.isFinite(Date.parse(fresh.retrievedAt)) || Date.parse(fresh.retrievedAt) < Date.parse(original.retrievedAt)) {
      throw Error(`Ohio major acquisition does not match the reviewed source: ${section}`);
    }
    all[section] = {...original, retrievedAt: fresh.retrievedAt};
  }
  const documents: Record<string, typeof all[string]> = {};
  const records = rows.map(row => {
    const prior = mapping.records.find(r => r.id === row.mappingId);
    const definition = OHIO_MAJOR_DEFINITIONS.find(r => r.id === row.id)!;
    if (!prior || prior.section !== row.section || prior.scope !== row.scope || prior.statutoryName.toLowerCase() !== row.statutoryName.toLowerCase()) throw Error(`Unmapped identity ${row.id}`);
    const sections = [row.section, ...ohioMajorDependencies(row)];
    const spans = sections.map(section => {
      const doc = all[section]; if (!doc || !acquired.has(section)) throw Error(`Missing dependency ${row.id}/${section}`);
      documents[section] = doc; return bind(doc);
    });
    const grading = row.gradingDivisions.map(letter => division(all[row.section], letter));
    validateOhioClassificationEvidence(row, grading);
    return { id: row.id, section: row.section, scope: row.scope,
      primaryClassification: "primaryClassification" in row ? row.primaryClassification : null, definitionHash: hash(JSON.stringify(definition)), mappingId: row.mappingId,
      dependencies: sections.slice(1), conduct: prior.conduct, grading,
      // Preserve exceptions/definitions and sentencing text for every identity.
      evidence: spans };
  });
  if (Object.keys(documents).length !== acquired.size) throw Error("Unused Ohio major acquisition");
  const packet = { schemaVersion: 1, kind: 'ohio_major_publication_evidence',
    mappingHash: hash(JSON.stringify(mapping)), sentencingHash: hash(JSON.stringify(OHIO_MAJOR_SENTENCING)),
    translationStatus: 'english_only_pending_translation', records, documents };
  const times = Object.values(documents).map((doc: any) => Date.parse(doc.retrievedAt));
  // Initial evidence window is anchored to actual retrieval, never generation time.
  const receipt = { schemaVersion: 1, kind: 'reacquired_evidence_window', verificationPolicy: QUARTERLY_POLICY,
    checkedAt: new Date(Math.max(...times)).toISOString(),
    expiresAt: quarterlyDeadline(Math.min(...times)),
    packetHash: hash(JSON.stringify(packet)) };
  return { packet, receipt };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { packet, receipt } = buildOhioMajorPublication();
  for (const [name, value] of [['ohio-major-publication-evidence.json', packet], ['ohio-major-refresh-receipt.json', receipt]] as const) {
    const path = `scripts/data-review/output/${name}`, output = JSON.stringify(value, null, 2) + '\n';
    if (process.argv.includes('--check')) { if (readFileSync(path, 'utf8') !== output) throw Error(`Publication packet drift: ${name}`); }
    else writeFileSync(path, output);
  }
  console.log(JSON.stringify({ records: packet.records.length, sources: Object.keys(packet.documents).length, expiresAt: receipt.expiresAt }));
}
