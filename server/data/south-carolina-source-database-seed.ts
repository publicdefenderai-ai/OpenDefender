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

export const SOUTH_CAROLINA_SOURCE_POLICY = "official_south_carolina_code_of_laws";
export const SOUTH_CAROLINA_SOURCE_PUBLISHER = "South Carolina Legislature";
export const SOUTH_CAROLINA_MANIFEST_SOURCE =
  "South Carolina Legislature Code of Laws (scstatehouse.gov)";
export const SOUTH_CAROLINA_SOURCE_BASE = "https://www.scstatehouse.gov";

export interface SouthCarolinaAuthorityManifest {
  jurisdiction: "SC";
  generatedAt: Date;
  source: typeof SOUTH_CAROLINA_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface SouthCarolinaSourceReference {
  section: string;
  subdivision: string | null;
}

export interface SouthCarolinaSourceDocument {
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/**
 * Alias mappings are intentionally empty until each one has documented,
 * charge-specific attorney approval. A related catchline alone is not enough.
 */
export const SOUTH_CAROLINA_EXACT_TITLE_ALIASES: Record<string, string[]> = {};

export function parseSouthCarolinaCitation(citation: string): SouthCarolinaSourceReference[] {
  const match = citation.match(/^S\.C\.\s+Code\s+Ann\.\s+§§?\s*(.+)$/i);
  if (!match) return [];
  return match[1]
    .split(/\s*,\s*/)
    .map((value) => value.replace(/\.$/, "").trim())
    .flatMap((value) => {
      const section = value.match(/^(\d+-\d+-\d+)/)?.[1];
      if (!section) return [];
      return [{
        section,
        subdivision: value.slice(section.length).trim() || null,
      }];
    });
}

export function buildSouthCarolinaSourceKey(
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `sc:statute:${section}${suffix}`;
}

export function buildSouthCarolinaSourceUrl(section: string): string {
  const [title, chapter] = section.split("-");
  return `${SOUTH_CAROLINA_SOURCE_BASE}/code/t${title}c${chapter.padStart(3, "0")}.php`;
}

function codeSupportsReferences(
  charge: CriminalCharge,
  references: SouthCarolinaSourceReference[],
): boolean {
  if (!charge.code || references.length === 0) return false;
  return references.every((reference) => charge.code === reference.section);
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (SOUTH_CAROLINA_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function hasSubdivision(text: string, subdivision: string | null): boolean {
  if (!subdivision) return true;
  const parts = [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
  if (parts.length === 0) return false;
  return parts.every((part) => new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text));
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: SouthCarolinaSourceReference,
  document: SouthCarolinaSourceDocument,
  index: number,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildSouthCarolinaSourceKey(reference.section, reference.subdivision);
  const citation = `S.C. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: "SC",
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
    supportRole: index === 0 ? "offense" : "grading",
    subdivision: reference.subdivision,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      elements: { basis: "verbatim_official_text", source: "south_carolina_code_of_laws_html" },
      grading: { basis: "verbatim_official_text", source: "south_carolina_code_of_laws_html" },
      penalty: { basis: "verbatim_official_text", source: "south_carolina_code_of_laws_html" },
      currentnessEvidence: {
        officialChapterPage: true,
        historyPresent: /\bHISTORY:/i.test(document.text),
        effectiveDateStart: document.effectiveDateStart,
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

export function buildSouthCarolinaManifestRecord(
  charge: CriminalCharge,
  documents: SouthCarolinaSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseSouthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not an exact South Carolina Code citation; federal, MPC, inferred, and compound-only substitutes are withheld.",
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
      dispositionReason: "The catalog code does not exactly support every cited South Carolina statutory section.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  if (documents.length !== references.length) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ?? "One or more required South Carolina statutory provisions could not be verified.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required South Carolina statutory provision",
    };
  }
  if (documents.some((document, index) =>
    !titleMatches(charge, document.title) || !hasSubdivision(document.text, references[index].subdivision),
  )) {
    const mismatch = documents.find((document) => !titleMatches(charge, document.title));
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: mismatch
        ? `The official South Carolina title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
        : "A required South Carolina subdivision was not found in the complete official section text.",
      canonicalTitle: mismatch?.title ?? null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const provisions = documents.map((document, index) =>
    provisionFromDocument(charge, references[index], document, index, importedAt),
  );
  const hasAlias = documents.some((document) =>
    normalizeTitle(document.title) !== normalizeTitle(charge.name),
  );
  return {
    ...base,
    disposition: hasAlias ? "exact_alias_rename" : "retain",
    dispositionReason: hasAlias
      ? "The official South Carolina title is supported by an explicit reviewed alias mapping."
      : "Catalog label matches the official South Carolina title.",
    canonicalTitle: documents[0].title,
    provisions,
    apiStatus: "verified",
  };
}

export function validateSouthCarolinaManifestRecord(record: AuthorityCatalogRecord): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "SC") return "Unknown South Carolina catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current South Carolina catalog";

  const references = parseSouthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable = record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0 ? null : "Withheld South Carolina records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references)
  ) return "Selectable South Carolina record does not have complete exact statutory support";
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }
  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== "SC" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildSouthCarolinaSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== `S.C. Code Ann. § ${reference.section}${reference.subdivision ?? ""}` ||
      provision.sourceUrl !== buildSouthCarolinaSourceUrl(reference.section) ||
      !titleMatches(charge, provision.officialTitle) ||
      !hasSubdivision(provision.content ?? "", reference.subdivision) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime()) ||
      !/\bHISTORY:/i.test(provision.content)
    ) return `Manifest authority provision ${index + 1} is not an exact verified South Carolina match`;
  }
  const expectedDisposition = record.provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  ) ? "exact_alias_rename" : "retain";
  return record.disposition === expectedDisposition
    ? null
    : "Manifest disposition does not match the reviewed South Carolina title mapping";
}

export function buildSouthCarolinaSourceDatabaseSeed(
  manifest: SouthCarolinaAuthorityManifest,
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
          jurisdiction: "SC",
          publisher: SOUTH_CAROLINA_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.section,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: SOUTH_CAROLINA_MANIFEST_SOURCE,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "SC",
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
    jurisdiction: "SC",
    sourcePolicy: SOUTH_CAROLINA_SOURCE_POLICY,
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