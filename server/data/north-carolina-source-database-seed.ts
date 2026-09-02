import { createHash } from "node:crypto";
import { criminalCharges, type CriminalCharge } from "@shared/criminal-charges";
import { CHARGE_CITATIONS } from "@shared/criminal-charge-citations";
import {
  type AuthorityCatalogRecord,
  type AuthorityChargeLinkSeed,
  type AuthorityProvisionSeed,
  type AuthoritySourceDatabaseSeed,
  type AuthoritySourceSeed,
} from "../services/authority-source-database";

export const NORTH_CAROLINA_SOURCE_POLICY = "official_north_carolina_general_statutes";
export const NORTH_CAROLINA_SOURCE_PUBLISHER = "North Carolina General Assembly";
export const NORTH_CAROLINA_MANIFEST_SOURCE =
  "North Carolina General Statutes — ncleg.gov";
export const NORTH_CAROLINA_SOURCE_BASE =
  "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection";

export interface NorthCarolinaAuthorityManifest {
  jurisdiction: "NC";
  generatedAt: Date;
  source: typeof NORTH_CAROLINA_MANIFEST_SOURCE;
  catalogRecords: NorthCarolinaManifestRecord[];
  audit: NorthCarolinaManifestAudit;
}

export interface NorthCarolinaSourceReference {
  section: string;
  subdivision: string | null;
}

export interface NorthCarolinaSourceDocument {
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
}

export type NorthCarolinaAuditFindingCode =
  | "official_source_verified"
  | "citation_not_parseable"
  | "catalog_code_mismatch"
  | "official_fetch_failure"
  | "section_not_found"
  | "content_missing"
  | "history_missing"
  | "subdivision_not_found"
  | "official_title_mismatch";

export interface NorthCarolinaAuditFinding {
  code: NorthCarolinaAuditFindingCode;
  classification: "mechanical" | "structural" | "success";
  message: string;
  reference: string | null;
}

export interface NorthCarolinaReferenceAudit {
  section: string;
  subdivision: string | null;
  citation: string;
  officialUrl: string;
  fetchStatus: "success" | "official_page_failure" | "transport_failure" | "not_attempted";
  fetchError: string | null;
  retrievedAt: string | null;
  sectionExtractionStatus: "complete" | "section_not_found" | "incomplete" | "not_attempted";
  officialTitle: string | null;
  historyEvidence: boolean;
  contentEvidence: boolean;
  contentHash: string | null;
  findings: NorthCarolinaAuditFinding[];
}

export interface NorthCarolinaSourceAudit {
  citation: string;
  references: NorthCarolinaReferenceAudit[];
  findings: NorthCarolinaAuditFinding[];
}

export interface NorthCarolinaManifestRecord extends AuthorityCatalogRecord {
  dispositionReasons: string[];
  auditFindings: NorthCarolinaAuditFinding[];
  sourceAudit: NorthCarolinaSourceAudit;
}

export interface NorthCarolinaManifestAudit {
  schemaVersion: 1;
  catalogRowCount: number;
  parsedReferenceCount: number;
  successfulOfficialRetrievals: number;
  completeSectionExtractions: number;
  findingCounts: Record<NorthCarolinaAuditFindingCode, number>;
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function parseNorthCarolinaCitation(
  citation: string,
): NorthCarolinaSourceReference[] {
  const match = citation.match(/^N\.C\.\s+Gen\.\s+Stat\.\s+§{1,2}\s*(.+)$/i);
  if (!match) return [];
  return match[1]
    .split(/\s*(?:,|;)\s*/)
    .map((token) => {
      const parsed = token.trim().match(
        /^(\d+[A-Z]*(?:-\d+)+(?:\.\d+)?)(.*)$/i,
      );
      return parsed
        ? { section: parsed[1], subdivision: parsed[2].trim() || null }
        : null;
    })
    .filter((value): value is NorthCarolinaSourceReference => Boolean(value));
}

export function buildNorthCarolinaSourceKey(
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `nc:statute:${section}${suffix}`;
}

export function buildNorthCarolinaSourceUrl(section: string): string {
  const chapter = section.match(/^(\d+[A-Z]*)-/i)?.[1];
  if (!chapter) return `${NORTH_CAROLINA_SOURCE_BASE}/GS_${section}.html`;
  return `${NORTH_CAROLINA_SOURCE_BASE}/Chapter_${chapter}/GS_${section}.html`;
}

function codeSupportsReferences(
  charge: CriminalCharge,
  references: NorthCarolinaSourceReference[],
): boolean {
  return references.length === 1 && references[0].section === charge.code;
}

/**
 * These are charge-specific mappings, not automatic synonyms. Each alias is
 * limited to a catalog row whose code exactly matches the cited section and
 * whose official catchline identifies the same offense.
 */
export const NORTH_CAROLINA_EXACT_TITLE_ALIASES: Record<string, string[]> = {
  "nc-dwi": ["Impaired driving"],
  "nc-failure-to-appear": ["Penalties for failure to appear"],
  "nc-bad-checks": ["Worthless checks; multiple presentment of checks"],
  "nc-driving-without-insurance": [
    "Operation of motor vehicle without financial responsibility a misdemeanor",
  ],
  "nc-open-container": ["Transporting an open container of alcoholic beverage"],
  "nc-animal-cruelty-misdemeanor": ["Cruelty to animals; construction of section"],
};

export function matchesNorthCarolinaCatalogTitle(
  charge: CriminalCharge,
  title: string,
): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (NORTH_CAROLINA_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function subdivisionParts(value: string): string[] {
  return [...value.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
}

function hasSubdivision(text: string, subdivision: string | null): boolean {
  if (!subdivision) return true;
  const parts = subdivisionParts(subdivision);
  return parts.length > 0 && parts.every((part) =>
    new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
  );
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: NorthCarolinaSourceReference,
  document: NorthCarolinaSourceDocument,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildNorthCarolinaSourceKey(reference.section, reference.subdivision);
  const citation = `N.C. Gen. Stat. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: "NCGS",
    section: reference.section,
    citation,
    officialTitle: document.title,
    sourceUrl: document.sourceUrl,
    content: document.text,
    contentHash,
    hashBasis: "source_content",
    retrievedAt: document.retrievedAt,
    effectiveDateStart: document.effectiveDateStart,
    effectiveDateEnd: null,
    supportRole: "offense",
    subdivision: reference.subdivision,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      elements: { basis: "verbatim_official_text", source: "ncleg_by_section_html" },
      grading: { basis: "verbatim_official_text", source: "ncleg_by_section_html" },
      penalty: { basis: "verbatim_official_text", source: "ncleg_by_section_html" },
      currentnessEvidence: {
        officialSectionPage: true,
        historyPresent: true,
        retrievedAt: document.retrievedAt.toISOString(),
      },
      attorneyReview: "pending",
      fingerprint: referenceHash({
        sourceKey,
        citation,
        officialTitle: document.title,
        sourceUrl: document.sourceUrl,
        contentHash,
        importedAt: importedAt.toISOString(),
      }),
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

export function buildNorthCarolinaManifestRecord(
  charge: CriminalCharge,
  documents: NorthCarolinaSourceDocument[],
  importedAt: Date,
  sourceAudit: NorthCarolinaSourceAudit,
  error?: string,
): NorthCarolinaManifestRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseNorthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const auditFindings = [...sourceAudit.findings];
  if (references.length === 0) {
    auditFindings.push({
      code: "citation_not_parseable",
      classification: "structural",
      message:
        "The catalog citation is not an exact North Carolina General Statutes citation; federal, Model Penal Code, inferred, and compound substitutes are withheld.",
      reference: null,
    });
  } else if (!codeSupportsReferences(charge, references)) {
    auditFindings.push({
      code: "catalog_code_mismatch",
      classification: "structural",
      message:
        "The catalog code does not exactly support the single North Carolina statutory section cited by this row.",
      reference: null,
    });
  }
  const reasons = [...new Set(
    auditFindings
      .filter((finding) => finding.classification !== "success")
      .map((finding) => finding.message),
  )];
  const withheld = (reason: string, apiStatus: "verified" | "api_error" | "placeholder") => ({
    ...base,
    disposition: "require_exact_reselection" as const,
    dispositionReason: reason,
    dispositionReasons: [reason, ...reasons.filter((item) => item !== reason)],
    canonicalTitle: documents[0]?.title ?? null,
    provisions: [],
    apiStatus,
    ...(error ? { error } : {}),
    auditFindings,
    sourceAudit,
  });

  if (references.length === 0) return withheld(
    reasons[0] ?? "The citation is not an exact North Carolina statutory reference.",
    error ? "api_error" : "placeholder",
  );
  if (!codeSupportsReferences(charge, references)) return withheld(
    reasons[0] ?? "The catalog code does not exactly support the cited section.",
    "verified",
  );
  if (documents.length !== references.length) return withheld(
    error ?? "The official North Carolina section was unavailable or incomplete.",
    "api_error",
  );
  const mismatch = documents.find((document, index) =>
    !matchesNorthCarolinaCatalogTitle(charge, document.title) ||
    !hasSubdivision(document.text, references[index].subdivision),
  );
  if (mismatch) {
    const reason = !matchesNorthCarolinaCatalogTitle(charge, mismatch.title)
      ? `The official North Carolina title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
      : "A required North Carolina subdivision was not found in the complete official section text.";
    return withheld(reason, "verified");
  }

  const provisions = documents.map((document, index) =>
    provisionFromDocument(charge, references[index], document, importedAt),
  );
  const hasAlias = provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  );
  const reason = hasAlias
    ? "The official North Carolina title is supported by an explicit reviewed alias mapping."
    : "Catalog label matches the official North Carolina title.";
  return {
    ...base,
    disposition: hasAlias ? "exact_alias_rename" : "retain",
    dispositionReason: reason,
    dispositionReasons: [reason],
    canonicalTitle: provisions[0].officialTitle,
    provisions,
    apiStatus: "verified" as const,
    auditFindings,
    sourceAudit,
  };
}

export function validateNorthCarolinaManifestRecord(
  record: AuthorityCatalogRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "NC") return "Unknown North Carolina catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current North Carolina catalog";

  const references = parseNorthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable = record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0
      ? null
      : "Withheld North Carolina records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references)
  ) return "Selectable North Carolina record does not have complete exact statutory support";
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }
  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    const evidence = provision.metadata?.currentnessEvidence as {
      officialSectionPage?: unknown;
      historyPresent?: unknown;
      retrievedAt?: unknown;
    } | undefined;
    if (
      !reference ||
      provision.lawId !== "NCGS" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildNorthCarolinaSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== `N.C. Gen. Stat. § ${reference.section}${reference.subdivision ?? ""}` ||
      provision.sourceUrl !== buildNorthCarolinaSourceUrl(reference.section) ||
      !matchesNorthCarolinaCatalogTitle(charge, provision.officialTitle) ||
      !hasSubdivision(provision.content ?? "", reference.subdivision) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime()) ||
      evidence?.officialSectionPage !== true ||
      evidence.historyPresent !== true ||
      typeof evidence.retrievedAt !== "string"
    ) return `Manifest authority provision ${index + 1} is not an exact verified North Carolina match`;
  }
  return null;
}

export function buildNorthCarolinaSourceDatabaseSeed(
  manifest: NorthCarolinaAuthorityManifest,
): AuthoritySourceDatabaseSeed {
  const sources = new Map<string, AuthoritySourceSeed>();
  const snapshots: AuthoritySourceDatabaseSeed["snapshots"] = [];
  const links: AuthorityChargeLinkSeed[] = [];
  for (const record of manifest.catalogRecords) {
    if (record.disposition !== "retain" && record.disposition !== "exact_alias_rename") continue;
    for (const provision of record.provisions) {
      if (!sources.has(provision.sourceKey)) {
        sources.set(provision.sourceKey, {
          sourceKey: provision.sourceKey,
          jurisdiction: "NC",
          publisher: NORTH_CAROLINA_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.section,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: NORTH_CAROLINA_MANIFEST_SOURCE,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "NC",
        citation: provision.citation,
        section: provision.section,
        officialTitle: provision.officialTitle,
        sourceUrl: provision.sourceUrl,
        content: provision.content,
        contentHash: provision.contentHash,
        hashBasis: provision.hashBasis,
        retrievedAt: provision.retrievedAt,
        manifestImportedAt: manifest.generatedAt,
        effectiveDateStart: provision.effectiveDateStart,
        effectiveDateEnd: null,
        status: "current",
        requiresReview: false,
        supersedesSnapshotId: null,
        metadata: provision.metadata,
      });
      links.push({
        chargeId: record.chargeId,
        snapshotKey: provision.sourceKey,
        supportRole: provision.supportRole,
        citation: provision.citation,
        subdivision: provision.subdivision,
      });
    }
  }
  return {
    jurisdiction: "NC",
    sourcePolicy: NORTH_CAROLINA_SOURCE_POLICY,
    sources: [...sources.values()],
    snapshots,
    links,
    catalogRecords: manifest.catalogRecords,
    selectableChargeIds: manifest.catalogRecords
      .filter((record) =>
        (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
        record.provisions.length > 0,
      )
      .map((record) => record.chargeId),
    generatedAt: manifest.generatedAt,
  };
}