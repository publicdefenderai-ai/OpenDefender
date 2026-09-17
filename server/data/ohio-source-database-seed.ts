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
import {
  annotateSharedAuthorityMappings,
  buildAuthorityEvidence,
  classifyAuthorityMapping,
  type AuthorityEvidenceDocument,
} from "../services/authority-offense-evidence";
import {
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS,
  ohioChapter2903Evidence,
  validateOhioChapter2903Document,
  type OhioChapter2903OfficialDocument,
  type OhioChapter2903PilotSourceRecord,
  type OhioChapter2903SupportRole,
} from "./ohio-chapter-2903-source";
import { isOhioChapter2903PilotFresh } from "./ohio-chapter-2903-refresh";

export const OHIO_SOURCE_POLICY = "official_ohio_revised_code";
export const OHIO_SOURCE_PUBLISHER = "Ohio Legislative Service Commission";
export const OHIO_MANIFEST_SOURCE = "Ohio Laws: codes.ohio.gov";
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
  const evidence = buildAuthorityEvidence({
    sourceKey,
    lawId: "ORC",
    section: reference.section,
    subdivision: reference.subdivision,
    citation,
    sourceUrl: document.sourceUrl,
    officialTitle: document.title,
    text: document.text,
    contentHash,
    effectiveDateStart: document.effectiveDateStart,
  });
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
    evidence,
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
      evidence,
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
  reference?: OhioSourceReference;
}

function referenceForOhioDocument(
  document: OhioSourceDocument,
  references: OhioSourceReference[],
  index: number,
): OhioSourceReference | undefined {
  return document.reference ?? references.find((reference) =>
    reference.section === document.section &&
    (!reference.subdivision || hasSubdivision(document.text, reference.subdivision)),
  ) ?? references[index];
}

function buildOhioMapping(
  charge: CriminalCharge,
  references: OhioSourceReference[],
  documents: OhioSourceDocument[],
): ReturnType<typeof classifyAuthorityMapping> {
  return classifyAuthorityMapping({
    catalogLabel: charge.name,
    catalogCode: charge.code,
    references,
    documents: documents.map((document, index): AuthorityEvidenceDocument => {
      const reference = referenceForOhioDocument(document, references, index);
      const citation = reference
        ? `Ohio Rev. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`
        : `Ohio Rev. Code Ann. § ${document.section}`;
      return {
        sourceKey: reference
          ? buildOhioSourceKey(reference.section, reference.subdivision)
          : buildOhioSourceKey(document.section),
        lawId: "ORC",
        section: reference?.section ?? document.section,
        subdivision: reference?.subdivision ?? null,
        citation,
        sourceUrl: document.sourceUrl,
        officialTitle: document.title,
        text: document.text,
        contentHash: createHash("sha256").update(document.text).digest("hex"),
        effectiveDateStart: document.effectiveDateStart,
      };
    }),
    codeIdentityMatches: codeSupportsReferences(charge, references),
    approvedAlias: documents.some((document) =>
      normalizeTitle(document.title) !== normalizeTitle(charge.name) &&
      titleMatches(charge, document.title),
    ),
  });
}

function provisionFromOhioChapter2903Document(
  charge: CriminalCharge,
  document: OhioChapter2903OfficialDocument,
  supportRole: OhioChapter2903SupportRole,
  importedAt: Date,
): AuthorityProvisionSeed {
  const extractionError = validateOhioChapter2903Document(document);
  if (extractionError) throw new Error(extractionError);
  const sourceKey = buildOhioSourceKey(document.section, document.subdivision);
  const evidence = buildAuthorityEvidence({
    sourceKey,
    lawId: "ORC",
    section: document.section,
    subdivision: document.subdivision,
    citation: document.citation,
    sourceUrl: document.sourceUrl,
    officialTitle: document.title,
    text: document.text,
    contentHash: document.contentHash,
    effectiveDateStart: document.effectiveDateStart,
    sourceEvidence: `Effective: ${document.effectiveDateStart}`,
  });
  return {
    sourceKey,
    lawId: "ORC",
    section: document.section,
    citation: document.citation,
    officialTitle: document.title,
    sourceUrl: document.sourceUrl,
    content: document.text,
    contentHash: document.contentHash,
    hashBasis: "source_content",
    retrievedAt: document.retrievedAt,
    effectiveDateStart: document.effectiveDateStart,
    effectiveDateEnd: null,
    supportRole,
    subdivision: document.subdivision,
    evidence,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      sourceFirstPilot: "ohio_chapter_2903",
      sourceExtraction: {
        sourceHash: document.contentHash,
        quotedSpans: document.quotedSpans,
      },
      elements: {
        basis: "exact_pinned_official_quote",
        source: "ohio_laws_section_html",
      },
      grading: {
        basis: "exact_pinned_official_quote",
        source: "ohio_laws_section_html",
      },
      penalty: {
        basis: supportRole === "penalty"
          ? "exact_pinned_official_quote"
          : "separate_penalty_dependency",
        source: "ohio_laws_section_html",
      },
      currentnessEvidence: {
        officialSectionPage: true,
        effectiveDateStart: document.effectiveDateStart,
        retrievedAt: document.retrievedAt.toISOString(),
      },
      evidence,
      attorneyReview: "pending",
      fingerprint: referenceHash({
        sourceKey,
        citation: document.citation,
        officialTitle: document.title,
        sourceUrl: document.sourceUrl,
        contentHash: document.contentHash,
        effectiveDateStart: document.effectiveDateStart,
        importedAt: importedAt.toISOString(),
      }),
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

/** Only an explicit, pinned guilt clause tied to the exact conduct subdivision can
 * establish a name different from the section heading. No legacy alias approval. */
export function hasOhioOperativeNameEvidence(source: OhioChapter2903PilotSourceRecord): boolean {
  if (source.nameBasis !== "operative_clause" || !source.offense.subdivision ||
      validateOhioChapter2903Document(source.offense) !== null) return false;
  const declaration = `Whoever violates division ${source.offense.subdivision} of this section is guilty of ${source.canonicalTitle.toLowerCase()},`;
  return source.offense.quotedSpans.some(span =>
    span.kind === "grading" &&
    /^\([A-Z]\) Whoever violates division /.test(span.quote) &&
    span.quote.slice(span.quote.indexOf("Whoever")).startsWith(declaration));
}

function ohioChapter2903Mapping(
  charge: CriminalCharge,
  source: OhioChapter2903PilotSourceRecord,
) {
  const mapping = classifyAuthorityMapping({
    catalogLabel: charge.name,
    catalogCode: charge.code,
    references: [{ section: source.offense.section, subdivision: source.offense.subdivision }],
    documents: [{
      sourceKey: buildOhioSourceKey(source.offense.section, source.offense.subdivision),
      lawId: "ORC",
      section: source.offense.section,
      subdivision: source.offense.subdivision,
      citation: source.offense.citation,
      sourceUrl: source.offense.sourceUrl,
      officialTitle: source.offense.title,
      text: source.offense.text,
      contentHash: source.offense.contentHash,
      effectiveDateStart: source.offense.effectiveDateStart,
      sourceEvidence: `Effective: ${source.offense.effectiveDateStart}`,
    }],
    codeIdentityMatches: charge.code === source.offense.section,
    approvedAlias: false,
  });
  if (charge.code === source.offense.section && charge.name === source.canonicalTitle &&
      hasOhioOperativeNameEvidence(source)) {
    return { ...mapping, classification: "exact_match" as const,
      rationale: "The exact statutory offense name and conduct subdivision are stated together in the separately pinned operative guilt clause; the original section heading is preserved." };
  }
  return mapping;
}

/**
 * Produce canonical records only from the small, independently extracted
 * Chapter 2903 pilot. These IDs are source-first records, not corrected names
 * for old degree-labelled entries.
 */
export function buildOhioChapter2903PilotManifestRecords(
  importedAt: Date,
): AuthorityCatalogRecord[] {
  return OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map((source) => {
    const charge = criminalCharges.find((candidate) => candidate.id === source.chargeId);
    if (!charge || charge.jurisdiction !== "OH") {
      throw new Error(`Ohio Chapter 2903 source-first catalog row is missing: ${source.chargeId}`);
    }
    const mapping = ohioChapter2903Mapping(charge, source);
    if (
      mapping.classification !== "exact_match" ||
      source.canonicalTitle !== charge.name ||
      (source.offense.title !== charge.name && !hasOhioOperativeNameEvidence(source))
    ) {
      throw new Error(`Ohio Chapter 2903 source-first mapping is not exact: ${source.chargeId}`);
    }
    return {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogCategory: charge.category,
      disposition: "retain",
      dispositionReason:
        "New source-first canonical record: exact official heading or explicitly named operative offense, offense text, currentness marker, and separate penalty dependency are pinned to the official Ohio Laws extraction.",
      canonicalTitle: source.canonicalTitle,
      provisions: ohioChapter2903Evidence(source).map(({ document, supportRole }) =>
        provisionFromOhioChapter2903Document(charge, document, supportRole, importedAt)),
      apiStatus: "verified",
      mapping,
    };
  });
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
  const mapping = buildOhioMapping(charge, references, documents);
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not a single exact Ohio Revised Code section; federal, Model Penal Code, inferred, and compound substitutes are withheld.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      mapping,
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
      mapping,
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
      mapping,
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
      mapping,
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
    mapping,
  };
}

function validateOhioChapter2903PilotManifestRecord(
  record: AuthorityCatalogRecord,
  source: OhioChapter2903PilotSourceRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (
    !charge ||
    charge.jurisdiction !== "OH" ||
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category ||
    record.disposition !== "retain" ||
    record.apiStatus !== "verified" ||
    record.canonicalTitle !== source.canonicalTitle ||
    record.provisions.length !== ohioChapter2903Evidence(source).length ||
    record.mapping?.classification !== "exact_match" ||
    JSON.stringify(record.mapping) !== JSON.stringify(ohioChapter2903Mapping(charge, source))
  ) return "Source-first Ohio Chapter 2903 catalog identity is incomplete or changed";

  const expected = ohioChapter2903Evidence(source);
  for (const [index, expectedProvision] of expected.entries()) {
    const provision = record.provisions[index];
    const document = expectedProvision.document;
    const sourceKey = buildOhioSourceKey(document.section, document.subdivision);
    const extraction = provision?.metadata?.sourceExtraction as {
      sourceHash?: unknown;
      quotedSpans?: unknown;
    } | undefined;
    if (
      !provision ||
      validateOhioChapter2903Document(document) !== null ||
      provision.sourceKey !== sourceKey ||
      provision.lawId !== "ORC" ||
      provision.section !== document.section ||
      provision.subdivision !== document.subdivision ||
      provision.citation !== document.citation ||
      provision.officialTitle !== document.title ||
      provision.sourceUrl !== document.sourceUrl ||
      provision.content !== document.text ||
      provision.contentHash !== document.contentHash ||
      provision.hashBasis !== "source_content" ||
      provision.supportRole !== expectedProvision.supportRole ||
      !provision.retrievedAt ||
      provision.retrievedAt.getTime() !== document.retrievedAt.getTime() ||
      provision.effectiveDateStart !== document.effectiveDateStart ||
      provision.effectiveDateEnd !== null ||
      provision.evidence?.sourceHash !== document.contentHash ||
      extraction?.sourceHash !== document.contentHash ||
      JSON.stringify(extraction.quotedSpans) !== JSON.stringify(document.quotedSpans)
    ) return `Source-first Ohio Chapter 2903 provision ${index + 1} is not the pinned official evidence`;
  }
  return null;
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

  const sourceFirstPilot = OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.find(
    (candidate) => candidate.chargeId === record.chargeId,
  );
  if (sourceFirstPilot) {
    return validateOhioChapter2903PilotManifestRecord(record, sourceFirstPilot);
  }

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
  if (
    record.mapping &&
    record.mapping.classification !== "exact_match" &&
    record.mapping.classification !== "approved_alias"
  ) return "Selectable Ohio record does not have an exact or approved-alias mapping";

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
  now: Date = new Date(),
): AuthoritySourceDatabaseSeed {
  const sourceFirstIds = new Set(
    OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map((record) => record.chargeId),
  );
  // A manifest supplied directly to this builder must not bypass the same
  // live receipt boundary that the loader uses.
  const records = isOhioChapter2903PilotFresh(now)
    ? manifest.catalogRecords
    : manifest.catalogRecords.filter((record) => !sourceFirstIds.has(record.chargeId));
  annotateSharedAuthorityMappings(records);
  const sources = new Map<string, AuthoritySourceSeed>();
  const snapshots: AuthoritySourceDatabaseSeed["snapshots"] = [];
  const links: AuthorityChargeLinkSeed[] = [];

  for (const record of records) {
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
    catalogRecords: records,
    selectableChargeIds: records
      .filter((record) =>
        (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
        record.provisions.length > 0,
      )
      .map((record) => record.chargeId),
    generatedAt: manifest.generatedAt,
  };
}