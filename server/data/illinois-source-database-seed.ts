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

export const ILLINOIS_SOURCE_POLICY = "official_illinois_compiled_statutes";
export const ILLINOIS_SOURCE_PUBLISHER = "Illinois General Assembly";
export const ILLINOIS_MANIFEST_SOURCE =
  "Illinois General Assembly Illinois Compiled Statutes (ilga.gov)";
export const ILLINOIS_SOURCE_BASE =
  "https://www.ilga.gov/legislation/ilcs/documents";

export interface IllinoisAuthorityManifest {
  jurisdiction: "IL";
  generatedAt: Date;
  source: typeof ILLINOIS_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface IllinoisSourceReference {
  chapter: string;
  act: string;
  section: string;
  subdivision: string | null;
}

export interface IllinoisSourceDocument {
  chapter: string;
  act: string;
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
  sourceEvidence: string | null;
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/**
 * Title aliases are intentionally empty until each one has documented,
 * charge-specific approval. A related ILCS catchline alone is not enough to
 * publish a materially different catalog label.
 */
export const ILLINOIS_EXACT_TITLE_ALIASES: Record<string, string[]> = {};

function parseSectionToken(
  token: string,
  defaultAct: string,
): { act: string; section: string; subdivision: string | null } | null {
  const clean = token.replace(/\.$/, "").trim();
  const withAct = clean.match(/^(\d+(?:\.\d+)?)\/(.+)$/);
  const act = withAct?.[1] ?? defaultAct;
  const sectionWithSubdivision = withAct?.[2] ?? clean;
  const sectionMatch = sectionWithSubdivision.match(
    /^([0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)(.*)$/,
  );
  if (!sectionMatch) return null;
  const section = sectionMatch[1];
  const subdivision = sectionMatch[2].trim() || null;
  return { act, section, subdivision };
}

export function parseIllinoisCitation(citation: string): IllinoisSourceReference[] {
  const match = citation.match(
    /^(\d+)\s+(?:ILCS|Ill\.\s+Comp\.\s+Stat\.)\s+(\d+(?:\.\d+)?)\/(.+)$/i,
  );
  if (!match) return [];
  const chapter = match[1];
  const defaultAct = match[2];
  return match[3]
    .split(/\s*(?:,|;)\s*/)
    .map((token) => parseSectionToken(token, defaultAct))
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .map((value) => ({ chapter, ...value }));
}

export function buildIllinoisSourceKey(
  chapter: string,
  act: string,
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `il:statute:${chapter}-${act}/${section}${suffix}`;
}

export function buildIllinoisSourceUrl(
  chapter: string,
  act: string,
  section: string,
): string {
  const documentName =
    `${chapter.padStart(4, "0")}${act.padStart(4, "0")}0K${section}.htm`;
  return `${ILLINOIS_SOURCE_BASE}/${documentName}`;
}

function codeIdentity(code: string): { chapter?: string; act: string; section: string } | null {
  const full = code.match(/^(\d+)-(\d+)\/(.+)$/);
  if (full) return { chapter: full[1], act: full[2], section: full[3] };
  const act = code.match(/^(\d+)\/(.+)$/);
  if (act) return { act: act[1], section: act[2] };
  return null;
}

function codeSupportsReferences(
  charge: CriminalCharge,
  references: IllinoisSourceReference[],
): boolean {
  const identity = codeIdentity(charge.code);
  if (!identity || references.length === 0) return false;
  return references.every((reference) =>
    identity.act === reference.act &&
    (!identity.chapter || identity.chapter === reference.chapter) &&
    identity.section === reference.section,
  );
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (ILLINOIS_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function hasSubdivision(text: string, subdivision: string | null): boolean {
  if (!subdivision) return true;
  const parts = [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
  if (parts.length === 0) return false;
  return parts.every((part) =>
    new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
  );
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: IllinoisSourceReference,
  document: IllinoisSourceDocument,
  index: number,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildIllinoisSourceKey(
    reference.chapter,
    reference.act,
    reference.section,
    reference.subdivision,
  );
  const citation =
    `${reference.chapter} ILCS ${reference.act}/${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: `${reference.chapter}-${reference.act}`,
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
      ilcsIdentity: {
        chapter: reference.chapter,
        act: reference.act,
        section: reference.section,
        subdivision: reference.subdivision,
      },
      elements: { basis: "verbatim_official_text", source: "ilga_static_document" },
      grading: { basis: "verbatim_official_text", source: "ilga_static_document" },
      penalty: { basis: "verbatim_official_text", source: "ilga_static_document" },
      currentnessEvidence: {
        officialStaticDocument: true,
        sourceEvidence: document.sourceEvidence,
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

export function buildIllinoisManifestRecord(
  charge: CriminalCharge,
  documents: IllinoisSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseIllinoisCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not an exact Illinois statutory citation; federal, MPC, inferred, and compound-only substitutes are withheld.",
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
      dispositionReason: "The catalog code does not exactly support every cited Illinois statutory identity.",
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
        "One or more required Illinois statutory provisions could not be verified.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required Illinois statutory provision",
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
        ? `The official Illinois title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
        : "A required Illinois subdivision was not found in the complete official section text.",
      canonicalTitle: mismatch.title,
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
      ? "The official Illinois title is supported by an explicit reviewed alias mapping."
      : "Catalog label matches the official Illinois title.",
    canonicalTitle: documents[0].title,
    provisions,
    apiStatus: "verified",
  };
}

export function validateIllinoisManifestRecord(
  record: AuthorityCatalogRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "IL") return "Unknown Illinois catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current Illinois catalog";

  const references = parseIllinoisCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable =
    record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0
      ? null
      : "Withheld Illinois records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references)
  ) return "Selectable Illinois record does not have complete exact statutory support";

  const alias = record.provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  );
  const expectedDisposition = alias ? "exact_alias_rename" : "retain";
  if (record.disposition !== expectedDisposition) {
    return "Manifest disposition does not match the reviewed Illinois title mapping";
  }
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }

  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== `${reference.chapter}-${reference.act}` ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildIllinoisSourceKey(
        reference.chapter,
        reference.act,
        reference.section,
        reference.subdivision,
      ) ||
      provision.citation !==
        `${reference.chapter} ILCS ${reference.act}/${reference.section}${reference.subdivision ?? ""}` ||
      provision.sourceUrl !== buildIllinoisSourceUrl(
        reference.chapter,
        reference.act,
        reference.section,
      ) ||
      !titleMatches(charge, provision.officialTitle) ||
      !hasSubdivision(provision.content ?? "", reference.subdivision) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime())
    ) return `Manifest authority provision ${index + 1} is not an exact verified Illinois match`;
  }
  return null;
}

export function buildIllinoisSourceDatabaseSeed(
  manifest: IllinoisAuthorityManifest,
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
          jurisdiction: "IL",
          publisher: ILLINOIS_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.lawId + "/" + provision.section,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: ILLINOIS_MANIFEST_SOURCE,
            lawId: provision.lawId,
            section: provision.section,
            subdivision: provision.subdivision,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "IL",
        citation: provision.citation,
        section: `${provision.lawId}/${provision.section}`,
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
    jurisdiction: "IL",
    sourcePolicy: ILLINOIS_SOURCE_POLICY,
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