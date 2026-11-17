import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { configuredChoices, assess } from './benchmark.mjs';
import { criminalCharges } from '../../../shared/criminal-charges';
import { loadFloridaAuthorityManifest } from '../../../server/data/florida-manifest-loader';
import { buildFloridaSourceDatabaseSeed } from '../../../server/data/florida-source-database-seed';
import { FLORIDA_REVIEWED_SOURCE_RECORDS, isFloridaReviewedSourceFresh } from '../../../server/data/florida-reviewed-source-records';

const read = (name: string) => JSON.parse(readFileSync(name, 'utf8'));
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export function buildFloridaLaunchReadiness(now = new Date()) {
  const configured = configuredChoices() as Array<{id:string;code:string;name:string}>;
  const configuredIds = new Set(configured.map(row => row.id));
  const manifest = loadFloridaAuthorityManifest(undefined, now);
  const selectable = new Set(buildFloridaSourceDatabaseSeed(manifest, now).selectableChargeIds);
  const raw = criminalCharges.filter(row => row.jurisdiction === 'FL');
  const oldManifest = read('scripts/data-review/output/fl-source-manifest.json');
  const legacy = oldManifest.catalogRecords.filter((row: {disposition:string}) => ['retain','exact_alias_rename'].includes(row.disposition));
  const families = readdirSync('shared').filter(name => /^florida-.+-publication.json$/.test(name)).sort().map(name => {
    const rows = read('shared/' + name) as Array<{id:string}>;
    const receiptPath = 'scripts/data-review/output/' + name.replace('-publication.json', '-refresh-receipt.json');
    const receipt = read(receiptPath);
    return {family:name.replace('-publication.json',''), configured:rows.length,
      offlineEligible:rows.filter(row => selectable.has(row.id)).length, expiresAt:receipt.expiresAt,
      withheldIds:rows.filter(row => !selectable.has(row.id)).map(row => row.id)};
  });
  const reviewedReceipt = read('scripts/data-review/output/florida-reviewed-refresh-receipt.json');
  const reviewedReport = read('scripts/data-review/output/florida-reviewed-analysis.json');
  const reviewedEligibility = read('shared/florida-reviewed-eligibility.json');
  const reviewedIds = FLORIDA_REVIEWED_SOURCE_RECORDS.map(row => row.chargeId);
  const dependencies = [...new Set(FLORIDA_REVIEWED_SOURCE_RECORDS.flatMap(row => row.dependencies.map(doc => doc.section)))].sort();
  const crosswalk = read('scripts/data-review/florida-launch/scope-crosswalk.json');
  const sample = read('scripts/data-review/florida-launch/official-sample.json');
  const sampleResults = sample.rows.map((row: {citation:string}) => ({citation:row.citation, ...assess(row.citation,configured)}));
  const rawUnconfigured = raw.filter(row => !configuredIds.has(row.id));
  const exclusions = oldManifest.catalogRecords.filter((row: {disposition:string}) => row.disposition === 'require_exact_reselection').map((row: {chargeId:string;catalogCode:string}) => ({id:row.chargeId,code:row.catalogCode}));
  const partition = legacy.length + reviewedIds.length + families.reduce((sum,row) => sum+row.configured,0);
  if (partition !== configured.length || new Set(raw.map(row=>row.id)).size !== raw.length) throw Error('Florida identity partition mismatch');
  if (rawUnconfigured.some(row=>!exclusions.some((entry:{id:string})=>entry.id===row.id))) throw Error('Unaccounted raw Florida record');
  return {
    schemaVersion:1, asOf:now.toISOString(), basis:'offline_receipt_and_manifest_rules_without_database',
    counts:{rawCatalogRows:raw.length,configuredChoices:configured.length,legacyChoices:legacy.length,
      separatelyReviewedChoices:reviewedIds.length,publicationFamilies:families.length,
      publicationChoices:families.reduce((sum,row)=>sum+row.configured,0),offlineEligible:selectable.size,
      configuredWithheld:configured.length-selectable.size,rawExcludedRows:rawUnconfigured.length},
    families,
    reviewed:{expiresAt:reviewedReceipt.expiresAt,expired:Date.parse(reviewedReceipt.expiresAt)<=now.getTime(),
      current:isFloridaReviewedSourceFresh(now),reportHashMatches:reviewedReceipt.reportHash===hash(reviewedReport),
      eligibilityHashMatches:reviewedReceipt.eligibilityHash===hash(reviewedEligibility),
      requiredSections:dependencies,withheldIds:reviewedIds.filter(id=>!selectable.has(id))},
    excludedLegacy:exclusions,
    benchmark:{sampleRows:sampleResults.length,exactCitations:sampleResults.filter((row:{result:string})=>row.result==='exact_citation').length,
      sameSection:sampleResults.filter((row:{result:string})=>row.result==='same_section_requires_scope_review').length,
      absentSections:sampleResults.filter((row:{result:string})=>row.result==='section_absent').length,
      scopeReviewedCitations:crosswalk.map((row:{citation:string})=>row.citation),statewideDenominator:null},
    production:{status:'requires_separate_public_and_database_verification'},
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const now = process.argv[2] ? new Date(process.argv[2]) : new Date();
  if (!Number.isFinite(now.getTime())) throw Error('Invalid as-of instant');
  console.log(JSON.stringify(buildFloridaLaunchReadiness(now),null,2));
}
