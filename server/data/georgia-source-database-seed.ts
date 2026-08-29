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

export const GEORGIA_SOURCE_POLICY = "official_georgia_code_text_required";
export const GEORGIA_SOURCE_PUBLISHER = "Georgia General Assembly";
export const GEORGIA_MANIFEST_SOURCE =
  "Georgia General Assembly — official codified section text unavailable via public API";
export const GEORGIA_SOURCE_BASE = "https://www.legis.ga.gov";

export interface GeorgiaAuthorityManifest {
  jurisdiction: "GA";
  generatedAt: Date;
  source: typeof GEORGIA_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface GeorgiaSourceReference {
  section: string;
  subdivision: string | null;
}

export interface GeorgiaSourceDocument {
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
  /** Required evidence from a parser with a documented official contract. */
  completeText?: boolean;
  officialDocumentId?: string;
}

/**
 * Georgia's public General Assembly API exposes legislation metadata and code
 * title names, but not the current codified section text. The authenticated
 * Official Code of Georgia Annotated service is not a usable public import
 * contract, so no aliases are approved here.
 */
export const GEORGIA_EXACT_TITLE_ALIASES: Record<string, string[]> = {};

/**
 * This is deliberately a narrow, reserved contract. The currently observed
 * public Georgia API does not expose this route, so no imported record can
 * satisfy it today. If Georgia publishes a stable section endpoint, the
 * importer must prove this exact URL and document ID before publication.
 */
export function buildGeorgiaOfficialDocumentId(section: string): string {
  return `ga-code-section:${section}`;
}

export function buildGeorgiaOfficialSectionUrl(section: string): string {
  return `${GEORGIA_SOURCE_BASE}/api/georgia-code/sections/${section}`;
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function normalizeGeorgiaSubdivision(value: string): string[] {
  return [...value.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
}

export function parseGeorgiaCitation(citation: string): GeorgiaSourceReference[] {
  const match = citation.match(
    /^(?:O\.C\.G\.A\.|Ga\.\s+Code(?:\s+Ann\.)?)\s+§{1,2}\s*(.+)$/i,
  );
  if (!match) return [];
  return match[1]
    .split(/\s*(?:,|;)\s*/)
    .map((token) => token.trim().match(
      /^(\d+-\d+-\d+(?:\.\d+)?)(\s*(?:\([a-z0-9]+\))*)$/i,
    ))
    .filter((value): value is RegExpMatchArray => Boolean(value))
    .map((value) => ({
      section: value[1],
      subdivision: value[2].trim() || null,
    }));
}

export function buildGeorgiaSourceKey(
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `ga:statute:${section}${suffix}`;
}

function isIsoDate(value: string | null): boolean {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function officialSourceUrlForSection(url: string, section: string): boolean {
  return url === buildGeorgiaOfficialSectionUrl(section);
}

function codeSupportsReferences(
  charge: CriminalCharge,
  references: GeorgiaSourceReference[],
): boolean {
  return references.length === 1 &&
    `${references[0].section}${references[0].subdivision ?? ""}` === charge.code;
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (GEORGIA_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: GeorgiaSourceReference,
  document: GeorgiaSourceDocument,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildGeorgiaSourceKey(reference.section, reference.subdivision);
  const citation = `Ga. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: "OCGA",
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
      elements: { basis: "verbatim_official_text", source: "official_georgia_code_text" },
      grading: { basis: "verbatim_official_text", source: "official_georgia_code_text" },
      penalty: { basis: "verbatim_official_text", source: "official_georgia_code_text" },
      currentnessEvidence: {
        officialSource: true,
        effectiveDateStart: document.effectiveDateStart,
        retrievedAt: document.retrievedAt.toISOString(),
      },
      officialDocumentId: document.officialDocumentId,
      completeText: document.completeText,
      attorneyReview: "pending",
      fingerprint: referenceHash({
        sourceKey,
        citation,
        officialTitle: document.title,
        sourceUrl: document.sourceUrl,
        contentHash,
        effectiveDateStart: document.effectiveDateStart,
        importedAt: importedAt.toISOString(),
      }),
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

export function buildGeorgiaManifestRecord(
  charge: CriminalCharge,
  documents: GeorgiaSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseGeorgiaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const withheld = (
    dispositionReason: string,
    apiStatus: "verified" | "api_error" | "placeholder" = "api_error",
  ): AuthorityCatalogRecord => ({
    ...base,
    disposition: "require_exact_reselection",
    dispositionReason,
    canonicalTitle: null,
    provisions: [],
    apiStatus,
    ...(error ? { error } : {}),
  });

  if (references.length === 0) {
    return withheld(error ??
      "The catalog citation is not a single exact Georgia Code section; federal, Model Penal Code, inferred, compound, and placeholder substitutes are withheld.",
      error ? "api_error" : "placeholder");
  }
  if (!codeSupportsReferences(charge, references)) {
    return withheld(
      "The catalog code does not exactly support one cited Georgia Code section and subdivision.",
      "verified",
    );
  }
  if (documents.length !== references.length) {
    return withheld(error ??
      "The official Georgia Code section text was unavailable through a public authoritative document contract.");
  }
  const mismatch = documents.find((document) =>
    document.section !== references[0].section ||
    !officialSourceUrlForSection(document.sourceUrl, references[0].section) ||
    document.officialDocumentId !== buildGeorgiaOfficialDocumentId(references[0].section) ||
    document.completeText !== true ||
    !titleMatches(charge, document.title) ||
    !document.text.trim() ||
    !document.retrievedAt ||
    Number.isNaN(document.retrievedAt.getTime()) ||
    !isIsoDate(document.effectiveDateStart),
  );
  if (mismatch) {
    return withheld(
      mismatch.section !== references[0].section
        ? "The retrieved document section does not match the exact cited Georgia Code section."
        : !officialSourceUrlForSection(mismatch.sourceUrl, references[0].section) ||
            mismatch.officialDocumentId !== buildGeorgiaOfficialDocumentId(references[0].section)
        ? "The source does not satisfy the exact official Georgia section URL and document-identity contract."
        : mismatch.completeText !== true
        ? "The official parser did not attest that the returned Georgia section text is complete."
        : !titleMatches(charge, mismatch.title)
          ? `The official Georgia title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
          : "The official Georgia section text or currentness metadata is incomplete.",
      "verified",
    );
  }

  const provisions = documents.map((document) =>
    provisionFromDocument(charge, references[0], document, importedAt),
  );
  return {
    ...base,
    disposition: "retain",
    dispositionReason: "Catalog label matches the exact official Georgia Code title.",
    canonicalTitle: provisions[0].officialTitle,
    provisions,
    apiStatus: "verified",
  };
}

export function validateGeorgiaManifestRecord(
  record: AuthorityCatalogRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "GA") return "Unknown Georgia catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current Georgia catalog";

  const references = parseGeorgiaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable =
    record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0
      ? null
      : "Withheld Georgia records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references)
  ) return "Selectable Georgia record does not have complete exact statutory support";
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }

  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== "OCGA" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildGeorgiaSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== `Ga. Code Ann. § ${reference.section}${reference.subdivision ?? ""}` ||
      !officialSourceUrlForSection(provision.sourceUrl, reference.section) ||
      !titleMatches(charge, provision.officialTitle) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.trim().length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime()) ||
      !isIsoDate(provision.effectiveDateStart) ||
      provision.metadata.officialDocumentId !== buildGeorgiaOfficialDocumentId(reference.section) ||
      provision.metadata.completeText !== true
    ) return `Manifest authority provision ${index + 1} is not an exact verified Georgia match`;
  }
  return null;
}

export function buildGeorgiaSourceDatabaseSeed(
  manifest: GeorgiaAuthorityManifest,
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
          jurisdiction: "GA",
          publisher: GEORGIA_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.section,
          accessPolicy: "reference_only",
          reuseStatus: "restricted",
          canStoreContent: false,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: GEORGIA_MANIFEST_SOURCE,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "GA",
        citation: provision.citation,
        section: provision.section,
        officialTitle: provision.officialTitle,
        sourceUrl: provision.sourceUrl,
        content: null,
        contentHash: provision.contentHash,
        hashBasis: "reference_metadata",
        retrievedAt: provision.retrievedAt,
        manifestImportedAt: manifest.generatedAt,
        effectiveDateStart: provision.effectiveDateStart,
        effectiveDateEnd: provision.effectiveDateEnd,
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
    jurisdiction: "GA",
    sourcePolicy: GEORGIA_SOURCE_POLICY,
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