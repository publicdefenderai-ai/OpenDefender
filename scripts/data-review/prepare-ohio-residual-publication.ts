import { validateOhioClassificationEvidence } from '../../shared/ohio-primary-classification';
/** New-batch evidence preparation only: no database, import, or existing receipt renewal. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import rows from '../../shared/ohio-residual-publication.json';
import { OHIO_RESIDUAL_DEFINITIONS, ohioResidualDependencies } from '../../shared/ohio-residual-batch';
import { OHIO_MAJOR_SENTENCING } from '../../shared/ohio-major-batch';
import { quarterlyDeadline } from '../../shared/source-verification-policy.mjs';
import { buildOhioResidual, retainedDocuments } from './ohio-residual-verification';
import { bind } from './ohio-major-substantive';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export function buildOhioResidualPublication() {
  const mapping = buildOhioResidual(), all = retainedDocuments();
  const documents: typeof all = {};
  const records = rows.map(row => {
    const prior = mapping.records.find(r => r.id === row.mappingId);
    const definition = OHIO_RESIDUAL_DEFINITIONS.find(r => r.id === row.id)!;
    if (!prior || prior.section !== row.section || prior.scope !== row.scope || prior.statutoryName.toLowerCase() !== row.statutoryName.toLowerCase()) throw Error(`Unmapped residual identity ${row.id}`);
    const sections = [row.section, ...ohioResidualDependencies(row)];
    const evidence = sections.map(section => {
      const doc = all[section]; if (!doc) throw Error(`Missing residual dependency ${row.id}/${section}`);
      documents[section] = doc; return bind(doc);
    });
    validateOhioClassificationEvidence(row, prior.penaltyRules.map(rule => rule.evidence));
    return { id: row.id, section: row.section, scope: row.scope,
      primaryClassification: "primaryClassification" in row ? row.primaryClassification : null, definitionHash: hash(JSON.stringify(definition)), mappingId: row.mappingId,
      namingBasis: prior.namingBasis, dependencies: sections.slice(1),
      conduct: prior.conduct.map(span => span.evidence),
      grading: prior.penaltyRules.map(rule => rule.evidence), evidence };
  });
  const packet = { schemaVersion: 1, kind: 'ohio_residual_publication_evidence',
    mappingHash: hash(JSON.stringify(mapping)), sentencingHash: hash(JSON.stringify(OHIO_MAJOR_SENTENCING)),
    translationStatus: 'english_only_pending_translation', records, documents };
  const times = Object.values(documents).map(doc => Date.parse(doc.retrievedAt));
  // New batch only. Latest acquisition bounds issuance; oldest bounds expiry.
  const receipt = { schemaVersion: 1, kind: 'initial_acquired_evidence_window', verificationPolicy: 'quarterly-v1',
    checkedAt: new Date(Math.max(...times)).toISOString(),
    expiresAt: quarterlyDeadline(new Date(Math.min(...times)).toISOString()),
    packetHash: hash(JSON.stringify(packet)) };
  return { packet, receipt };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { packet, receipt } = buildOhioResidualPublication();
  for (const [name, value] of [['ohio-residual-publication-evidence.json', packet], ['ohio-residual-refresh-receipt.json', receipt]] as const) {
    const path = `scripts/data-review/output/${name}`, output = JSON.stringify(value, null, 2) + '\n';
    if (process.argv.includes('--check')) { if (readFileSync(path, 'utf8') !== output) throw Error(`Residual publication drift: ${name}`); }
    else writeFileSync(path, output);
  }
  console.log(JSON.stringify({ records: packet.records.length, sources: Object.keys(packet.documents).length, checkedAt: receipt.checkedAt, expiresAt: receipt.expiresAt }));
}
