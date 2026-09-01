import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { criminalCharges } from "@shared/criminal-charges";
import { CHARGE_CITATIONS } from "@shared/criminal-charge-citations";
import {
  ILLINOIS_MANIFEST_SOURCE,
  parseIllinoisCitation,
  validateIllinoisManifestRecord,
  type IllinoisAuthorityManifest,
  type IllinoisAuditFinding,
  type IllinoisAuditFindingCode,
  type IllinoisManifestAudit,
  type IllinoisManifestRecord,
  type IllinoisFreshnessOutcome,
} from "./illinois-source-database-seed";

export const ILLINOIS_MANIFEST_PATH = resolve(
  process.cwd(),
  "scripts/data-review/output/il-source-manifest.json",
);

const AUDIT_FINDING_CODES: IllinoisAuditFindingCode[] = [
  "official_source_verified",
  "citation_not_parseable",
  "catalog_code_mismatch",
  "official_fetch_failure",
  "section_not_found",
  "content_missing",
  "source_evidence_missing",
  "subdivision_not_found",
  "official_title_mismatch",
];

function findingKey(finding: IllinoisAuditFinding): string {
  return JSON.stringify([
    finding.code,
    finding.classification,
    finding.message,
    finding.reference,
  ]);
}

function hasSameFindingMultiset(
  left: IllinoisAuditFinding[],
  right: IllinoisAuditFinding[],
): boolean {
  if (left.length !== right.length) return false;
  const counts = new Map<string, number>();
  for (const finding of left) {
    const key = findingKey(finding);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const finding of right) {
    const key = findingKey(finding);
    const remaining = counts.get(key) ?? 0;
    if (remaining === 0) return false;
    if (remaining === 1) counts.delete(key);
    else counts.set(key, remaining - 1);
  }
  return counts.size === 0;
}

function deriveIllinoisAudit(records: IllinoisManifestRecord[], checkedAt?: string) {
  const findingCounts = Object.fromEntries(
    AUDIT_FINDING_CODES.map((code) => [
      code,
      records.reduce((count, record) =>
        count + record.auditFindings.filter((finding) => finding.code === code).length, 0),
    ]),
  ) as Record<IllinoisAuditFindingCode, number>;
  const classifications = ["mechanical", "structural"] as const;
  const classificationSummary = Object.fromEntries(classifications.map((classification) => [
    classification,
    {
      findingCodes: AUDIT_FINDING_CODES.filter((code) =>
        records.some((record) => record.auditFindings.some((finding) =>
          finding.code === code && finding.classification === classification))),
      affectedRows: records.filter((record) =>
        record.auditFindings.some((finding) => finding.classification === classification)).length,
      affectedReferences: records.reduce((count, record) =>
        count + record.sourceAudit.references.filter((reference) =>
          reference.findings.some((finding) => finding.classification === classification)).length, 0),
    },
  ]));
  const freshnessOutcomes: IllinoisFreshnessOutcome[] = [
    "changed",
    "unavailable",
    "incomplete",
    "still_current",
  ];
  const outcomeCounts = Object.fromEntries(
    freshnessOutcomes.map((outcome) => [
      outcome,
      records.reduce((count, record) =>
        count + record.sourceAudit.references.filter((reference) => {
          const inferred = reference.freshnessOutcome ?? (
            reference.fetchStatus !== "success"
              ? "unavailable"
              : reference.sectionExtractionStatus === "complete" && reference.contentHash
                ? "still_current"
                : "incomplete"
          );
          return inferred === outcome;
        }).length, 0),
    ]),
  ) as Record<IllinoisFreshnessOutcome, number>;
  return {
    schemaVersion: 1 as const,
    catalogRowCount: records.length,
    parsedReferenceCount: records.reduce((count, record) =>
      count + record.sourceAudit.references.length, 0),
    successfulOfficialRetrievals: records.reduce((count, record) =>
      count + record.sourceAudit.references.filter((reference) =>
        reference.fetchStatus === "success").length, 0),
    completeSectionExtractions: records.reduce((count, record) =>
      count + record.sourceAudit.references.filter((reference) =>
        reference.sectionExtractionStatus === "complete").length, 0),
    findingCounts,
    mechanical: classificationSummary.mechanical,
    structural: classificationSummary.structural,
    ...(checkedAt ? {
      freshness: { checkedAt, outcomeCounts },
    } : {}),
  };
}

export function loadIllinoisAuthorityManifest(
  manifestPath: string = ILLINOIS_MANIFEST_PATH,
): IllinoisAuthorityManifest {
  const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    jurisdiction?: string;
    generatedAt?: string;
    source?: string;
    catalogRecords?: IllinoisManifestRecord[];
    audit?: IllinoisManifestAudit;
  };
  if (
    raw.jurisdiction !== "IL" ||
    raw.source !== ILLINOIS_MANIFEST_SOURCE ||
    !Array.isArray(raw.catalogRecords)
  ) throw new Error("The committed Illinois manifest has an invalid authority header");
  const generatedAt = new Date(raw.generatedAt ?? "");
  if (!raw.generatedAt || Number.isNaN(generatedAt.getTime())) {
    throw new Error("The committed Illinois manifest has an invalid generation timestamp");
  }
  const expectedIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "IL")
    .map((charge) => charge.id);
  const ids = new Set(raw.catalogRecords.map((record) => record.chargeId));
  if (
    ids.size !== raw.catalogRecords.length ||
    ids.size !== expectedIds.length ||
    expectedIds.some((id) => !ids.has(id))
  ) throw new Error(
    "The committed Illinois manifest must contain exactly one record for every current Illinois catalog row",
  );
  if (
    !raw.audit ||
    raw.audit.schemaVersion !== 1 ||
    raw.audit.catalogRowCount !== raw.catalogRecords.length ||
    raw.audit.parsedReferenceCount !== raw.catalogRecords.reduce(
      (count, record) => count + (record.sourceAudit?.references?.length ?? 0),
      0,
    )
  ) throw new Error("The committed Illinois manifest is missing its complete source audit");

  const dispositions = new Set([
    "retain",
    "exact_alias_rename",
    "require_exact_reselection",
    "remove",
  ]);
  const catalogRecords = raw.catalogRecords.map((record) => ({
    ...record,
    provisions: Array.isArray(record.provisions)
      ? record.provisions.map((provision) => ({
        ...provision,
        retrievedAt: provision.retrievedAt
          ? new Date(provision.retrievedAt)
          : null,
      }))
      : [],
  })) as IllinoisManifestRecord[];
  for (const record of catalogRecords) {
    if (
      typeof record.catalogLabel !== "string" ||
      typeof record.catalogCode !== "string" ||
      typeof record.catalogCategory !== "string" ||
      typeof record.dispositionReason !== "string" ||
      !dispositions.has(record.disposition) ||
      !Array.isArray(record.provisions) ||
      !Array.isArray(record.auditFindings) ||
      !Array.isArray(record.dispositionReasons) ||
      !record.sourceAudit ||
      !Array.isArray(record.sourceAudit.references) ||
      !Array.isArray(record.sourceAudit.rowFindings) ||
      record.sourceAudit.references.length !==
        parseIllinoisCitation(CHARGE_CITATIONS[record.chargeId]?.citation ?? "").length
    ) throw new Error(`The committed Illinois manifest has an invalid record for ${record.chargeId}`);
    const referenceFindings = record.sourceAudit.references.flatMap((reference) => reference.findings);
    const sourceFindings = [
      ...referenceFindings,
      ...record.sourceAudit.rowFindings,
    ];
    if (
      !hasSameFindingMultiset(sourceFindings, record.sourceAudit.findings) ||
      !hasSameFindingMultiset(record.sourceAudit.findings, record.auditFindings)
    ) throw new Error(`The committed Illinois manifest has inconsistent audit findings for ${record.chargeId}`);
    const selectable = record.disposition === "retain" || record.disposition === "exact_alias_rename";
    if (
      selectable &&
      record.auditFindings.some((finding) =>
        finding.classification === "mechanical" || finding.classification === "structural")
    ) throw new Error(`Selectable Illinois record ${record.chargeId} has adverse audit findings`);
    if (
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length === 0
    ) throw new Error(`Selectable Illinois record ${record.chargeId} has no authority provision`);
    for (const provision of record.provisions) {
      if (provision.retrievedAt && Number.isNaN(provision.retrievedAt.getTime())) {
        throw new Error(`The committed Illinois manifest has an invalid retrieval date for ${record.chargeId}`);
      }
    }
    const validationError = validateIllinoisManifestRecord(record);
    if (validationError) throw new Error(`${record.chargeId}: ${validationError}`);
  }
  const derivedAudit = deriveIllinoisAudit(catalogRecords, generatedAt.toISOString());
  const { freshness: _derivedFreshness, ...derivedLegacyAudit } = derivedAudit;
  const { freshness: _manifestFreshness, ...manifestLegacyAudit } = raw.audit;
  const auditMatches = raw.audit.freshness
    ? JSON.stringify(derivedAudit) === JSON.stringify(raw.audit)
    : JSON.stringify(derivedLegacyAudit) === JSON.stringify(manifestLegacyAudit);
  if (!auditMatches) {
    throw new Error("The committed Illinois manifest has inconsistent audit aggregates");
  }
  return {
    jurisdiction: "IL",
    generatedAt,
    source: ILLINOIS_MANIFEST_SOURCE,
    catalogRecords,
    audit: raw.audit,
  };
}