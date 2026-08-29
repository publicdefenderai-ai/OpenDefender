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

export const OHIO_SOURCE_POLICY = "official_ohio_revised_code";
export const OHIO_SOURCE_PUBLISHER = "Ohio Legislative Service Commission";
export const OHIO_MANIFEST_SOURCE = "Ohio Laws — codes.ohio.gov";
export const OHIO_SOURCE_BASE = "https://codes.ohio.gov/ohio-revised-code";

export interface OhioAuthorityManifest {
  jurisdiction: "OH";
  generatedAt: Date;
  source: typeof OHIO_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface OhioSourceReference {
  section: string;
  subdivision: string | null;
}

/**
 * There are no unreviewed Ohio aliases. A catalog label must match the
 * official catchline until counsel documents a charge-specific mapping.
 */
export const OHIO_EXACT_TITLE_ALIASES: Record<string, string[]> = {};

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function normalizeOhioSubdivision(value: string): string[] {
  return [...value.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
}

export function parseOhioCitation(citation: string): OhioSourceReference[] {
  const match = citation.match(
    /^Ohio\s+Rev\.\s+Code(?:\s+Ann\.)?\s+§{1,2}\s*(.+)$/i,
  );
  if (!match) return [];
  return match[1]
    .split(/\s*(?:,|;)\s*/)
    .map((token) => token.trim().match(/^(\d+\.\d+)((?:\([a-z0-9]+\))*)$/i))
    .filter((value): value is RegExpMatchArray => Boolean(value))
    .map((value) => ({
      section: value[1],
      subdivision: value[2] || null,
    }));
}

export function buildOhioSourceKey(
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `oh:statute:${section}${suffix}`;
}

export function buildOhioSourceUrl(section: string): string {
  return `${OHIO_SOURCE_BASE}/section-${section}`;
}

function codeSupportsReferences(
  charge: CriminalCharge,
  references: OhioSourceReference[],
): boolean {
  return references.length > 0 &&
    references.length === 1 &&
    charge.code === references[0].section;
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (OHIO_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function hasSubdivision(text: string, subdivision: string | null): boolean {
  if (!subdivision) return true;
  return normalizeOhioSubdivision(subdivision).every((part) =>
    new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
  );
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: OhioSourceReference,
  document: OhioSourceDocument,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildOhioSourceKey(reference.section, reference.subdivision);
  const citation = `Ohio Rev. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: "ORC",
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
      elements: { basis: "verbatim_official_text", source: "ohio_laws_section_html" },
      grading: { basis: "verbatim_official_text", source: "ohio_laws_section_html" },
      penalty: { basis: "verbatim_official_text", source: "ohio_laws_section_html" },
      currentnessEvidence: {
        officialSectionPage: true,
        effectiveDateStart: document.effectiveDateStart,
        retrievedAt: document.retrievedAt.toISOString(),
      },
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

export interface OhioSourceDocument {
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
}

export function buildOhioManifestRecord(
  charge: CriminalCharge,
  documents: OhioSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not a single exact Ohio Revised Code section; federal, Model Penal Code, inferred, and compound substitutes are withheld.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      ...(error ? { error } : {}),
    };
  }
  if (!codeSupportsReferences(charge, references)) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: "The catalog code does not exactly support the cited Ohio Revised Code section.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  if (documents.length !== references.length) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The official Ohio section was unavailable or incomplete.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required Ohio statutory provision",
    };
  }
  const mismatch = documents.find((document, index) =>
    !titleMatches(charge, document.title) ||
    !hasSubdivision(document.text, references[index].subdivision),
  );
  if (mismatch) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: !titleMatches(charge, mismatch.title)
        ? `The official Ohio title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
        : "A required Ohio subdivision was not found in the complete official section text.",
      canonicalTitle: mismatch.title,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const provisions = documents.map((document, index) =>
    provisionFromDocument(charge, references[index], document, importedAt),
  );
  const hasAlias = provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  );
  return {
    ...base,
    disposition: hasAlias ? "exact_alias_rename" : "retain",
    dispositionReason: hasAlias
      ? "The official Ohio title is supported by an explicit reviewed alias mapping."
      : "Catalog label matches the official Ohio title.",
    canonicalTitle: provisions[0].officialTitle,
    provisions,
    apiStatus: "verified",
  };
}

export function validateOhioManifestRecord(
  record: AuthorityCatalogRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "OH") return "Unknown Ohio catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current Ohio catalog";

  const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable =
    record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0
      ? null
      : "Withheld Ohio records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references)
  ) return "Selectable Ohio record does not have complete exact statutory support";

  const alias = record.provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  );
  const expectedDisposition = alias ? "exact_alias_rename" : "retain";
  if (record.disposition !== expectedDisposition) {
    return "Manifest disposition does not match the reviewed Ohio title mapping";
  }
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }

  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== "ORC" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildOhioSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== `Ohio Rev. Code Ann. § ${reference.section}${reference.subdivision ?? ""}` ||
      provision.sourceUrl !== buildOhioSourceUrl(reference.section) ||
      !titleMatches(charge, provision.officialTitle) ||
      !hasSubdivision(provision.content ?? "", reference.subdivision) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime()) ||
      !provision.effectiveDateStart
    ) return `Manifest authority provision ${index + 1} is not an exact verified Ohio match`;
  }
  return null;
}

export function buildOhioSourceDatabaseSeed(
  manifest: OhioAuthorityManifest,
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
          jurisdiction: "OH",
          publisher: OHIO_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.section,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: OHIO_MANIFEST_SOURCE,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "OH",
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
    jurisdiction: "OH",
    sourcePolicy: OHIO_SOURCE_POLICY,
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