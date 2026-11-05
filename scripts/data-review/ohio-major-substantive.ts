/** Source-bound statutory mappings only: no publication, receipt or eligibility mutation. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import plan from './ohio-major-substantive-plan.json';
const root = 'scripts/data-review/';
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
type Document = { section: string; title: string; text: string; contentHash: string; sourceUrl: string; retrievedAt: string; effectiveDateStart: string };
export function bind(doc: Document, start = 0, end = doc.text.length) {
  if (!doc.section || !doc.sourceUrl || !doc.effectiveDateStart || !Number.isFinite(Date.parse(doc.retrievedAt)) || hash(doc.text) !== doc.contentHash) throw Error(`Invalid retained source ${doc.section}`);
  if (start < 0 || end <= start || end > doc.text.length) throw Error(`Invalid span ${doc.section}`);
  return { section: doc.section, sourceUrl: doc.sourceUrl, sourceHash: doc.contentHash,
    effectiveDateStart: doc.effectiveDateStart, retrievedAt: doc.retrievedAt,
    start, end, text: doc.text.slice(start, end) };
}
export function division(doc: Document, letter: string) {
  const matches = [...doc.text.matchAll(/^\([A-Z]\)/gm)];
  const index = matches.findIndex(m => m[0] === `(${letter})`);
  if (index < 0) throw Error(`Missing division ${doc.section}(${letter})`);
  return bind(doc, matches[index].index!, matches[index + 1]?.index ?? doc.text.length);
}
export function buildOhioMajorSubstantive() {
  const researchBytes = readFileSync(root + 'output/ohio-major-coverage-evidence.json', 'utf8');
  const research = JSON.parse(researchBytes);
  const supplementalBytes = readFileSync(root + 'output/ohio-major-substantive-evidence.json', 'utf8');
  const supplemental = JSON.parse(supplementalBytes);
  const documents: Record<string, Document> = { ...research.documents };
  for (const [key, doc] of Object.entries(supplemental.documents) as [string, Document][]) {
    if (documents[key] && documents[key].contentHash !== doc.contentHash) throw Error(`Conflicting source ${key}`);
    documents[key] = doc;
  }
  Object.values(documents).forEach(doc => bind(doc));
  const required = (key: string) => { if (!documents[key]) throw Error(`Missing dependency ${key}`); return documents[key]; };
  const records = plan.map(row => {
    const doc = required(row.section);
    const grading = row.gradingDivisions.split(',').map(letter => division(doc, letter));
    // Match to the end of a sentence, not the first comma: several statutory names contain lists.
    const names = [...grading.map(g => g.text).join('\n').matchAll(/is guilty of ([^.]+)\./g)]
      .map(m => m[1].replace(/, (?:which is )?a (?:felony|misdemeanor).*$/, ''));
    const name = row.name === '@heading' ? doc.title : row.name ?? names[0];
    if (!name || (row.name !== '@heading' && !names.includes(name))) throw Error(`Unbound statutory name ${row.section}: ${name}`);
    const letters = [...new Set(row.scope.match(/[A-Z]/g))];
    return { id: `orc-${row.section}-${row.scope.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      section: row.section, scope: row.scope, statutoryName: name,
      namingBasis: row.name === '@heading' ? 'official_heading_with_subdivision_not_synthesized_guilt_name' : 'operative_guilt_clause',
      status: 'statutory_mapping_not_publication_approval', limitations: row.limitations,
      conduct: letters.map(letter => division(doc, letter)), grading,
      // The full section keeps exceptions, defenses, definitions and merger provisions attached.
      completePrimary: bind(doc), dependencies: row.dependencies.map(key => bind(required(key))) };
  });
  if (new Set(records.map(r => r.id)).size !== records.length) throw Error('Duplicate offense identity');
  const exceptions = [
    { section: '2905.111', status: 'supporting_victim_protection_not_standalone_offense', authority: [] as string[] },
    { section: '2909.31', status: 'identification_and_entry_denial_no_standalone_penalty_in_reviewed_authority', authority: ['https://codes.ohio.gov/ohio-revised-code/section-2901.03'] },
    { section: '2905.05', status: 'withheld_A_enforceability_B_C_separate_applicability_unresolved', authority: [
      'https://www.supremecourt.ohio.gov/rod/docs/pdf/0/2014/2014-ohio-783.pdf',
      'https://www.supremecourt.ohio.gov/rod/docs/pdf/8/2019/2019-Ohio-4886.pdf',
      'https://www.supremecourt.ohio.gov/rod/docs/pdf/4/2020/2020-Ohio-4611.pdf'] },
    { section: '2909.24', status: 'withheld_predicate_specific_grade_and_capital_or_life_sentencing_mapping', authority: [] as string[] },
  ].map(row => ({ ...row, evidence: bind(required(row.section)) }));
  const accounted = [...new Set(records.map(r => r.section)), ...exceptions.map(r => r.section)].sort();
  if (JSON.stringify(accounted) !== JSON.stringify([...research.primarySections].sort())) throw Error('Unaccounted or multiply disposed primary section');
  return { schemaVersion: 1, kind: 'ohio_individual_substantive_statutory_mapping',
    publicationStatus: 'not_activated_no_receipt_or_eligibility_change',
    inputs: { researchSha256: hash(researchBytes), supplementalSha256: hash(supplementalBytes),
      planSha256: hash(readFileSync(root + 'ohio-major-substantive-plan.json', 'utf8')) },
    counts: { primarySections: accounted.length, mappedSections: new Set(records.map(r => r.section)).size,
      individualMappings: records.length, separatelyDisposedSections: exceptions.length },
    limits: ['Mappings cover the stated scopes, not every possible prosecution or sentencing consequence.',
      'Shared sentencing evidence does not assign a grade. Each grade must come from the individually bound offense provision.',
      'Ordinary prison ranges apply when imprisonment is imposed; specifications, offense dates, organizational fines, restitution and special sanctions require separate treatment.',
      'This is statutory verification, not a comprehensive case-law survey or dependency-closure certificate.',
      'Existing attorney decisions and the section 1509.01 hold remain unchanged. No new attorney questions are published.'],
    sharedSentencingEvidence: ['2929.14','2929.144','2929.18','2929.24','2929.28','2929.32','2901.03'].map(key => bind(required(key))),
    excludedBranches: [
      { section: '2909.04', scope: 'A(3)', reason: 'unavailable_3727_01_definition_no_silent_successor_substitution' },
      { section: '2909.07', scope: 'A(7)', reason: 'existing_1509_01_dependency_hold_preserved' },
      { section: '2911.211', scope: 'A(2)', reason: 'existing_1509_01_dependency_hold_preserved' }],
    records, exceptions };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = root + 'output/ohio-major-substantive-mapping.json';
  const report = buildOhioMajorSubstantive();
  const rendered = JSON.stringify(report, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    if (readFileSync(output, 'utf8') !== rendered) throw Error('Regenerate Ohio substantive mapping after intentional evidence changes');
  } else writeFileSync(output, rendered);
  console.log(JSON.stringify(report.counts));
}
