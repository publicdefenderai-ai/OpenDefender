import {validateJusticeCustodyReview,readJusticeCustodyReviewAcquisition} from "./justice-custody-review";
import {validateWeaponsEligibilityReview,readWeaponsEligibilityReviewAcquisition} from "./weapons-eligibility-review";
import {validateWeaponsThreatsReview,readWeaponsThreatsReviewAcquisition} from "./weapons-threats-review";
import {validateRegistrationExploitationReview,readRegistrationExploitationReviewAcquisition} from "./registration-exploitation-review";
import {validateSexualOffensesReview,readSexualOffensesReviewAcquisition} from "./sexual-offenses-review";
import {validateViolenceDetentionReview,readViolenceDetentionReviewAcquisition} from "./violence-detention-review";
import {validateVehicleIdentificationReview,readVehicleIdentificationReviewAcquisition} from "./vehicle-identification-review";
import {validateTrafficReview,readTrafficReviewAcquisition} from "./traffic-review";
import {validateDrivingPublication,readDrivingPublicationAcquisition} from "./driving-publication-review";
/** Catalog accounting only: a source URL or acquired section is not legal approval. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { CALIFORNIA_CANONICAL_RECORDS, CALIFORNIA_LEGACY_DISPOSITIONS } from "../../../shared/california-authority";
import { CALIFORNIA_CHARGE_CORRECTIONS as corrections } from "../../../shared/california-corrections";
import { readCaliforniaReuseReview, validateCaliforniaReuseReview } from "./reuse-review";
import { readCaliforniaReview, validateCaliforniaReview } from "./review";

import { readCaliforniaCombinedReview, validateCaliforniaCombinedReview } from "./combined-review";

import { readCaliforniaAgeDrivingReview, validateCaliforniaAgeDrivingReview } from "./age-driving-review";
import { readCaliforniaFinancialPropertyReview, validateCaliforniaFinancialPropertyReview } from "./financial-property-review";

import { readCaliforniaRemainingCatalogReview, validateCaliforniaRemainingCatalogReview } from "./remaining-catalog-review";

import { CALIFORNIA_ADDITIONS as additions } from "../../../shared/california-additions";
import { validateCaliforniaForgeryTheftReview, readCaliforniaForgeryTheftAcquisition } from "./forgery-theft-review";
import { validateCaliforniaPersonPropertyReview, readCaliforniaPersonPropertyAcquisition } from "./person-property-review";

import { validateCaliforniaProtectedPersonReview, readCaliforniaProtectedPersonAcquisition } from "./protected-person-review";

import { validateCaliforniaSpecializedPropertyReview } from "./specialized-property-review";

import { validateCaliforniaControlledSubstancesReview, readCaliforniaControlledSubstancesAcquisition } from "./controlled-substances-review";

import { validateCaliforniaDrugSuccessorReview, readCaliforniaDrugSuccessorAcquisition } from "./drug-successor-review";

import openLegalQuestions from "./open-review-items.json";

interface SourceExpansion {
  schemaVersion: number; scope: string; archive: { sha256: string };
  statutoryUniverse: Array<{ lawCode: string; distinctSections: number; versionRows: number }>;
  documents: Record<string, Array<{ lawCode: string; section: string; contentXml: string; contentSha256: string }>>;
}
export function validateCaliforniaSourceExpansion(expansion: SourceExpansion, review = readCaliforniaReview()) {
  if (expansion.schemaVersion !== 1 || expansion.scope !== "catalog_source_acquisition_not_legal_verification" || expansion.archive.sha256 !== review.archive.sha256) throw new Error("Source expansion provenance changed");
  for (const [key, versions] of Object.entries(expansion.documents)) {
    if (review.documents[key] || !versions.length) throw new Error(`Duplicate or empty expansion source: ${key}`);
    for (const version of versions) {
      if (`${version.lawCode}:${version.section.replace(/\.$/, "")}` !== key || createHash("sha256").update(version.contentXml).digest("hex") !== version.contentSha256) throw new Error(`Expansion source changed: ${key}`);
    }
  }
}

export function buildCaliforniaCoverage() {
  const review = readCaliforniaReview();
  const verifiedAccounting = validateCaliforniaReview(review);
  const reuse = readCaliforniaReuseReview();
  const reuseAccounting = validateCaliforniaReuseReview(reuse);
  const combined = readCaliforniaCombinedReview();
  const combinedAccounting = validateCaliforniaCombinedReview(combined);
  const ageDriving = readCaliforniaAgeDrivingReview();
  const ageDrivingAccounting = validateCaliforniaAgeDrivingReview(ageDriving);
  const financial = readCaliforniaFinancialPropertyReview();
  const financialAccounting = validateCaliforniaFinancialPropertyReview(financial);
  const remainingCatalog = readCaliforniaRemainingCatalogReview();
  const remainingAccounting = validateCaliforniaRemainingCatalogReview(remainingCatalog);
  const expansionPath = new URL("../output/california-catalog-source-expansion.json", import.meta.url);
  const expansion: SourceExpansion | null = fs.existsSync(expansionPath) ? JSON.parse(fs.readFileSync(expansionPath, "utf8")) : null;
  if (expansion) validateCaliforniaSourceExpansion(expansion, review);
  const acquiredKeys = new Set([...Object.keys(review.documents), ...Object.keys(reuse.documents), ...Object.keys(combined.documents), ...Object.keys(ageDriving.documents), ...Object.keys(financial.documents), ...Object.keys(remainingCatalog.documents), ...Object.keys(expansion?.documents ?? {})]);
  const additionAccounting = validateCaliforniaPersonPropertyReview();
  const additionEvidence = readCaliforniaPersonPropertyAcquisition();
  Object.keys(additionEvidence.documents).forEach(key => acquiredKeys.add(key));
  const forgeryAccounting = validateCaliforniaForgeryTheftReview();
  const forgeryEvidence = readCaliforniaForgeryTheftAcquisition();
  Object.keys(forgeryEvidence.documents).forEach(key => acquiredKeys.add(key));
  const protectedAccounting = validateCaliforniaProtectedPersonReview();
  Object.keys(readCaliforniaProtectedPersonAcquisition().documents).forEach(key => acquiredKeys.add(key));
  const specializedAccounting = validateCaliforniaSpecializedPropertyReview();
  const drugAccounting = validateCaliforniaControlledSubstancesReview();
  Object.keys(readCaliforniaControlledSubstancesAcquisition().documents).forEach(key => acquiredKeys.add(key));
  const successorAccounting = validateCaliforniaDrugSuccessorReview();
  const drivingAccounting=validateDrivingPublication();
  const trafficAccounting=validateTrafficReview();
  const justiceAccounting=validateJusticeCustodyReview();
  Object.keys(readJusticeCustodyReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const eligibilityAccounting=validateWeaponsEligibilityReview();
  Object.keys(readWeaponsEligibilityReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const weaponsAccounting=validateWeaponsThreatsReview();
  Object.keys(readWeaponsThreatsReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const registrationAccounting=validateRegistrationExploitationReview();
  Object.keys(readRegistrationExploitationReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const sexualAccounting=validateSexualOffensesReview();
  Object.keys(readSexualOffensesReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const violenceAccounting=validateViolenceDetentionReview();
  Object.keys(readViolenceDetentionReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  const vehicleAccounting=validateVehicleIdentificationReview();
  Object.keys(readVehicleIdentificationReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  Object.keys(readTrafficReviewAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  Object.keys(readDrivingPublicationAcquisition().documents).forEach(key=>acquiredKeys.add(key));
  Object.keys(readCaliforniaDrugSuccessorAcquisition().documents).forEach(key => acquiredKeys.add(key));
  const corrected = new Set([...corrections.map(row => row.id), ...additions.map(row => row.id)]);
  const requests = new Map<string, { lawCode: string; section: string; url: string; recordIds: string[]; alreadyRetained: boolean }>();
  const records = CALIFORNIA_CANONICAL_RECORDS.map(record => {
    const primaryKeys = [...new Set(record.sources.filter(source => source.kind === "statute").map(source => {
      const url = new URL(source.url);
      const lawCode = url.searchParams.get("lawCode");
      const section = url.searchParams.get("sectionNum")?.replace(/\.$/, "");
      if (!lawCode || !section || !/^[A-Z]+$/.test(lawCode) || !/^\d+(?:\.\d+)*[a-z]*$/.test(section)) throw new Error(`Unparseable primary source: ${record.canonicalId}`);
      const key = `${lawCode}:${section}`;
      if (record.selectable) {
        const request = requests.get(key) ?? { lawCode, section, url: source.url, recordIds: [], alreadyRetained: Boolean(review.documents[key]?.length) };
        if (!request.recordIds.includes(record.canonicalId)) request.recordIds.push(record.canonicalId);
        requests.set(key, request);
      }
      return key;
    }))].sort();
    if (record.selectable && !primaryKeys.length) throw new Error(`Selectable record has no primary source: ${record.canonicalId}`);
    // This is a configured-catalog fingerprint, not live eligibility. Keep
    // receipt age/holds out of historical accounting hashes.
    const { status: runtimeStatus, ...currentnessEvidence } = record.currentness;
    void runtimeStatus;
    return {
      id: record.canonicalId, title: record.officialTitle, citation: record.citation,
      lawCode: record.lawCode, selectable: record.selectable,
      status: !record.selectable ? "withheld_canonical_label" : corrected.has(record.canonicalId) ? "bounded_correction_pass" : "awaiting_statutory_correction_pass",
      primaryKeys, retainedPrimaryKeys: primaryKeys.filter(key => review.documents[key]?.length),
      acquiredPrimaryKeys: primaryKeys.filter(key => acquiredKeys.has(key)),
      catalogSha256: createHash("sha256").update(JSON.stringify({ ...record, currentness: currentnessEvidence })).digest("hex"),
      attorneyReview: record.attorneyReview,
    };
  });
  for (const id of corrected) if (!records.some(record => record.id === id && record.selectable)) throw new Error(`Corrected record lost: ${id}`);
  for (const item of openLegalQuestions) {
    if (!records.some(row => row.id === item.chargeId && row.selectable) || item.status !== "unresolved" || !item.question || !item.sourceKeys.every(key => acquiredKeys.has(key))) throw new Error("Invalid open California review item");
  }
  if (new Set(openLegalQuestions.map(item => item.id)).size !== openLegalQuestions.length) throw new Error("Duplicate open California review item");
  const pending = records.filter(record => record.status === "awaiting_statutory_correction_pass");
  // Connected components ensure overlapping primary sources are read once.
  // These are engineering queues, not claims of shared elements or penalties.
  const remaining = new Set(pending.map(record => record.id));
  const groups: Array<{ id: string; recordIds: string[]; primaryKeys: string[]; retainedPrimaryKeys: string[]; acquiredPrimaryKeys: string[] }> = [];
  while (remaining.size) {
    const first = pending.find(record => remaining.has(record.id))!;
    const ids = new Set([first.id]); const keys = new Set(first.primaryKeys);
    let changed = true;
    while (changed) {
      changed = false;
      for (const record of pending) {
        if (!remaining.has(record.id) || ids.has(record.id) || !record.primaryKeys.some(key => keys.has(key))) continue;
        ids.add(record.id); record.primaryKeys.forEach(key => keys.add(key)); changed = true;
      }
    }
    ids.forEach(id => remaining.delete(id));
    groups.push({ id: [...keys].sort().join("+"), recordIds: [...ids].sort(), primaryKeys: [...keys].sort(), retainedPrimaryKeys: [...keys].filter(key => review.documents[key]?.length).sort(), acquiredPrimaryKeys: [...keys].filter(key => acquiredKeys.has(key)).sort() });
  }
  groups.sort((a,b) => b.recordIds.length - a.recordIds.length || a.id.localeCompare(b.id));
  const selectable = records.filter(record => record.selectable);
  const sourceRequests = [...requests.values()].sort((a,b) => `${a.lawCode}:${a.section}`.localeCompare(`${b.lawCode}:${b.section}`));
  return {
    catalogHashBasis: "configured_record_excluding_runtime_currentness_status",
    schemaVersion: 1, scope: "catalog_accounting_not_statewide_offense_coverage",
    accounting: {
      specificOpenLegalQuestions: openLegalQuestions.length,
      canonicalRecords: records.length, configuredSelectable: selectable.length,
      withheldCanonicalLabels: records.length - selectable.length,
      boundedAdditionPass: justiceAccounting.additions + additionAccounting.additions + forgeryAccounting.additions + protectedAccounting.additions + specializedAccounting.additions + drugAccounting.additions + successorAccounting.additions + drivingAccounting.additions + trafficAccounting.additions + vehicleAccounting.additions + eligibilityAccounting.additions + weaponsAccounting.additions + registrationAccounting.additions + sexualAccounting.additions + violenceAccounting.additions,
      boundedCorrectionPass: justiceAccounting.additions + additionAccounting.additions + forgeryAccounting.additions + protectedAccounting.additions + specializedAccounting.additions + drugAccounting.additions + successorAccounting.additions + drivingAccounting.additions + trafficAccounting.additions + vehicleAccounting.additions + eligibilityAccounting.additions + weaponsAccounting.additions + registrationAccounting.additions + sexualAccounting.additions + violenceAccounting.additions + verifiedAccounting.corrections + reuseAccounting.corrections + combinedAccounting.corrections + ageDrivingAccounting.corrections + financialAccounting.corrections + remainingAccounting.corrections, awaitingCorrectionPass: pending.length,
      legacyRows: CALIFORNIA_LEGACY_DISPOSITIONS.length,
      legacyDispositions: CALIFORNIA_LEGACY_DISPOSITIONS.reduce<Record<string, number>>((out,row) => { out[row.disposition] = (out[row.disposition] ?? 0) + 1; return out; }, {}),
      retainedResearchSections: verifiedAccounting.sections, retainedResearchVersions: verifiedAccounting.versions,
      distinctSelectablePrimarySections: requests.size,
      remainingSharedSourceGroups: groups.length,
      remainingPrimarySections: new Set(pending.flatMap(record => record.primaryKeys)).size,
      remainingRecordsWithAllPrimaryTextAlreadyRetained: pending.filter(record => record.primaryKeys.length > 0 && record.primaryKeys.length === record.retainedPrimaryKeys.length).length,
      acquiredSelectablePrimarySections: sourceRequests.filter(request => acquiredKeys.has(`${request.lawCode}:${request.section}`)).length,
      selectableRecordsWithAllPrimaryTextAcquired: selectable.filter(record => record.primaryKeys.length > 0 && record.primaryKeys.length === record.acquiredPrimaryKeys.length).length,
      totalAcquiredSectionsIncludingDependencies: acquiredKeys.size,
      totalAcquiredVersionsIncludingDependencies: justiceAccounting.newVersions + eligibilityAccounting.newVersions + weaponsAccounting.newVersions + registrationAccounting.newVersions + sexualAccounting.newVersions + violenceAccounting.newVersions + vehicleAccounting.newVersions + trafficAccounting.newVersions + drivingAccounting.newVersions + successorAccounting.newVersions + drugAccounting.newVersions + protectedAccounting.newVersions + forgeryAccounting.newVersions + Object.values(additionEvidence.documents).reduce((sum, versions) => sum + versions.length, 0) + verifiedAccounting.versions + reuseAccounting.addedVersions + combinedAccounting.addedVersions + ageDrivingAccounting.addedVersions + financialAccounting.addedVersions + remainingAccounting.addedVersions + Object.values(expansion?.documents ?? {}).reduce((sum, versions) => sum + versions.length, 0),
      statewideOffenseDenominator: null, statewideCoveragePercent: null,
      liveDeploymentParity: "not_verified_by_this_offline_report",
    },
    limits: [
      "A bounded correction pass is not full legal certification. Independent legal review, case law, and record-specific exceptions remain.",
      `${selectable.length} configured selectable records are not a measured count of currently deployed choices; source seeding and deployment determine live availability.`,
      "The legacy inventory overlaps the canonical inventory and must not be added to it.",
      "Sources are grouped by shared primary section only. This does not assign penalties across subdivisions or establish complete dependency coverage.",
      "Statewide source discovery is retained separately. Its candidate sections are not an offense denominator; independent miss detection remains necessary.",
    ],
    byLawCode: [...new Set(selectable.map(row => row.lawCode))].sort().map(lawCode => ({
      lawCode, selectable: selectable.filter(row => row.lawCode === lawCode).length,
      corrected: selectable.filter(row => row.lawCode === lawCode && corrected.has(row.id)).length,
      awaitingCorrection: pending.filter(row => row.lawCode === lawCode).length,
    })),
    recommendedReuseBatch: pending.filter(row => row.primaryKeys.length > 0 && row.primaryKeys.length === row.retainedPrimaryKeys.length).map(row => row.id),
    statutoryUniverse: expansion?.statutoryUniverse ?? null,
    openLegalQuestions, sourceRequests, groups, records,
  };
}

export function renderCaliforniaCoverage(report: ReturnType<typeof buildCaliforniaCoverage>) {
  const a = report.accounting;
  return ["# California coverage and remaining review queue", "",
    `Configured selectable: ${a.configuredSelectable}. Bounded correction pass: ${a.boundedCorrectionPass}. Awaiting that pass: ${a.awaitingCorrectionPass}. Withheld canonical labels: ${a.withheldCanonicalLabels}.`, "",
    "Statewide offense coverage: unknown. Live deployment parity: not established by this offline report.", "",
    ...report.limits.map(limit => `- ${limit}`), "",
    `Primary-source acquisition: ${a.acquiredSelectablePrimarySections}/${a.distinctSelectablePrimarySections} declared sections, covering the primary links of ${a.selectableRecordsWithAllPrimaryTextAcquired}/${a.configuredSelectable} configured records. Total retained research sources including dependencies: ${a.totalAcquiredSectionsIncludingDependencies} sections/${a.totalAcquiredVersionsIncludingDependencies} versions.`, "",
    "| Code | Selectable | Correction pass | Awaiting correction pass |", "| --- | ---: | ---: | ---: |",
    ...report.byLawCode.map(row => `| ${row.lawCode} | ${row.selectable} | ${row.corrected} | ${row.awaitingCorrection} |`), "",
    "## Remaining work", "",
    ...report.openLegalQuestions.map(item => `- ${item.chargeId}: ${item.question}`), "",
    "See docs/california-remaining-attorney-questions.md for sources and proposed treatment. These focused questions are not an exhaustive list of all legal-review needs.", "",
    ...report.recommendedReuseBatch.map(id => `- ${id}`),
    ...(report.recommendedReuseBatch.length ? [] : [report.groups.length ? "Next largest groups: " + report.groups.slice(0, 3).map(group => `${group.id} (${group.recordIds.length} records)`).join("; ") + "." : "The existing selectable catalog has completed its bounded correction pass. Independent review, known legal questions, deployment parity, and statewide missing-charge discovery remain."]), "",
    `${a.awaitingCorrectionPass} remaining records form ${a.remainingSharedSourceGroups} shared-primary-source groups using ${a.remainingPrimarySections} distinct sections. ${a.remainingRecordsWithAllPrimaryTextAlreadyRetained} already have all primary text in the first-batch bundle; this is acquisition only, not verification.`, "",
    ...(report.groups.length ? ["| Shared source group | Records | Primary text acquired | Record IDs |", "| --- | ---: | --- | --- |"] : []),
    ...report.groups.map(group => `| ${group.id} | ${group.recordIds.length} | ${group.acquiredPrimaryKeys.length}/${group.primaryKeys.length} sections | ${group.recordIds.join(", ")} |`), "",
    "## Withheld canonical labels", "", ...report.records.filter(record => !record.selectable).map(record => `- ${record.id}: ${record.citation}`), "",
    "## State source-discovery starting point", "",
    "The official archive's code-table inventory includes noncriminal, historical, and future provisions. These section counts are not offense counts and are not a denominator for criminal-charge coverage.", "",
    "| Code | Distinct section identities | Version rows |", "| --- | ---: | ---: |",
    ...(report.statutoryUniverse ?? []).map(row => `| ${row.lawCode} | ${row.distinctSections} | ${row.versionRows} |`), "",
  ].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = buildCaliforniaCoverage();
  fs.writeFileSync(new URL("../output/california-expanded-catalog-coverage.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(new URL("../output/california-expanded-catalog-coverage.md", import.meta.url), renderCaliforniaCoverage(report));
  console.log(JSON.stringify(report.accounting));
}
