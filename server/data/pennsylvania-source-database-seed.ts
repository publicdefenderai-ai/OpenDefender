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

export const PENNSYLVANIA_SOURCE_POLICY =
  "official_pennsylvania_statutes_with_legacy_publication_gate";
export const PENNSYLVANIA_SOURCE_PUBLISHER = "Pennsylvania General Assembly";
export const PENNSYLVANIA_MANIFEST_SOURCE =
  "Pennsylvania General Assembly Official Statutes (legis.state.pa.us and palegis.us)";
export const PENNSYLVANIA_SOURCE_BASE =
  "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm";
export const PENNSYLVANIA_OFFICIAL_SOURCE_BASE =
  "https://www.palegis.us/statutes/consolidated/view-statute";

/**
 * Approved official retrieval paths for legacy provisions. These mappings do
 * not approve publication: each remains behind the substantive attorney
 * review gate below until the catalog charge is confirmed to match the text.
 * No title, section, subdivision, or URL may be inferred from a nearby
 * provision or a secondary citation.
 */
export interface PennsylvaniaApprovedLegacyProvision {
  chargeId: string;
  statuteTitle: string;
  actYear: string;
  actNumber: string;
  title: string;
  section: string;
  subdivision: string | null;
  sectionTitle: string;
  canonicalUrl: string;
  retrievalUrl: string;
  requiredContent: readonly string[];
  publicationApproved: boolean;
}

export const PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS: Record<
  string,
  PennsylvaniaApprovedLegacyProvision
> = {
  "pa-animal-at-large": {
    chargeId: "pa-animal-at-large",
    statuteTitle: "DOG LAW",
    actYear: "1982",
    actNumber: "0225.",
    title: "3",
    section: "459-305",
    subdivision: null,
    sectionTitle: "Confinement and housing of dogs not part of a kennel",
    canonicalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0225.&sessInd=0&sessYr=1982&smthLwInd=0&chpt=3&sctn=5",
    retrievalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0225.&sessInd=0&sessYr=1982&smthLwInd=0&chpt=3&sctn=5",
    requiredContent: [
      "Section 305.",
      "Confinement and housing of dogs not part of a kennel",
      "Confinement and control",
      "Housing",
    ],
    publicationApproved: false,
  },
  "pa-truancy": {
    chargeId: "pa-truancy",
    statuteTitle: "PUBLIC SCHOOL CODE OF 1949",
    actYear: "1949",
    actNumber: "0014.",
    title: "24",
    section: "13-1333",
    subdivision: null,
    sectionTitle: "Procedure When Child is Truant",
    canonicalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0014.&sessInd=0&sessYr=1949&smthLwInd=0&chpt=13&sctn=33",
    retrievalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0014.&sessInd=0&sessYr=1949&smthLwInd=0&chpt=13&sctn=33",
    requiredContent: [
      "Section 1333.",
      "Procedure When Child is Truant",
      "When a child is truant",
      "compulsory school attendance",
    ],
    publicationApproved: false,
  },
  "pa-alcohol-in-park": {
    chargeId: "pa-alcohol-in-park",
    statuteTitle: "LIQUOR CODE",
    actYear: "1951",
    actNumber: "0021.",
    title: "47",
    section: "4-406",
    subdivision: null,
    sectionTitle: "Sales by Liquor Licensees; Restrictions",
    canonicalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0021.&sessInd=0&sessYr=1951&smthLwInd=0&chpt=4&sctn=6",
    retrievalUrl:
      "https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?actNum=0021.&sessInd=0&sessYr=1951&smthLwInd=0&chpt=4&sctn=6",
    requiredContent: [
      "Section 406.",
      "Sales by Liquor Licensees; Restrictions",
      "Every hotel, restaurant or club liquor licensee",
      "Sunday",
    ],
    publicationApproved: false,
  },
};

export const PENNSYLVANIA_UNCONSOLIDATED_LEGACY_CHARGE_IDS = new Set(
  Object.keys(PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS),
);
export const PENNSYLVANIA_UNCONSOLIDATED_LEGACY_REASON =
  "The exact official unconsolidated-statute retrieval path is approved, but publication remains withheld until attorney review confirms that the legacy text substantively supports this catalog charge; secondary, inferred, nearby, and alternate citations are rejected.";

export type PennsylvaniaSourceKind = "consolidated" | "unconsolidated";

export interface PennsylvaniaAuthorityManifest {
  jurisdiction: "PA";
  generatedAt: Date;
  source: typeof PENNSYLVANIA_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface PennsylvaniaSourceReference {
  title: string;
  section: string;
  subdivision: string | null;
  sourceKind?: PennsylvaniaSourceKind;
}

export interface PennsylvaniaSourceDocument {
  title: string;
  section: string;
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
 * A title mapping is not accepted merely because a section exists. This list
 * is intentionally narrow and can be expanded only after legal review.
 */
export const PENNSYLVANIA_EXACT_TITLE_ALIASES: Record<string, string[]> = {
  "pa-animal-at-large": [
    "Confinement and housing of dogs not part of a kennel",
  ],
  "pa-truancy": ["Procedure When Child is Truant"],
  "pa-alcohol-in-park": ["Sales by Liquor Licensees; Restrictions"],
  "pa-murder-in-the-first-degree": ["Murder"],
  "pa-murder-in-the-second-degree": ["Murder"],
  "pa-vehicular-homicide": ["Homicide by vehicle"],
  "pa-assault-on-peace-officer": ["Aggravated assault"],
  "pa-rape-in-the-first-degree": ["Rape"],
  "pa-sexual-assault-in-the-second-degree": ["Sexual assault"],
  "pa-sexual-assault-in-the-third-degree": ["Indecent assault"],
  "pa-statutory-rape": ["Statutory sexual assault"],
  "pa-child-sexual-abuse": ["Sexual abuse of children"],
  "pa-sexual-exploitation-of-minor": ["Sexual abuse of children"],
  "pa-petty-theft": ["Theft by unlawful taking or disposition"],
  "pa-theft-by-receiving": ["Receiving stolen property"],
  "pa-identity-theft": ["Identity theft"],
  "pa-credit-card-fraud": ["Access device fraud"],
  "pa-embezzlement": ["Theft by unlawful taking or disposition"],
  "pa-burglary-in-the-first-degree": ["Burglary"],
  "pa-burglary-in-the-second-degree": ["Burglary"],
  "pa-auto-burglary": ["Robbery"],
  "pa-robbery-in-the-first-degree": ["Robbery"],
  "pa-robbery-in-the-second-degree": ["Robbery"],
  "pa-carjacking": ["Robbery of motor vehicle"],
  "pa-unlawful-carrying-of-weapon": ["Firearms not to be carried without a license"],
  "pa-felon-in-possession-of-firearm": ["Persons not to possess, use, manufacture, control, sell or transfer firearms"],
  "pa-discharge-of-firearm-in-city": ["Discharge of a firearm into an occupied structure"],
  "pa-possession-of-prohibited-weapon": ["Possessing instruments of crime"],
  "pa-check-fraud": ["Bad checks"],
  "pa-forgery": ["Forgery"],
  "pa-computer-fraud": ["Unlawful use of computer and other computer-related crimes"],
  "pa-disorderly-conduct": ["Disorderly conduct"],
  "pa-vandalism": ["Criminal mischief"],
  "pa-loitering": ["Loitering and prowling at night"],
  "pa-harassment": ["Harassment"],
  "pa-public-intoxication": ["Public drunkenness and similar misconduct"],
  "pa-resisting-arrest": ["Resisting arrest or other law enforcement"],
  "pa-fleeing-police": ["Fleeing or attempting to elude police officer"],
  "pa-retail-theft": ["Retail theft"],
  "pa-trespass-after-warning": ["Criminal trespass"],
  "pa-criminal-attempt": ["Criminal attempt"],
  "pa-conspiracy": ["Criminal conspiracy"],
  "pa-aiding-and-abetting": ["Conduct of another"],
  "pa-criminal-solicitation": ["Criminal solicitation"],
  "pa-money-laundering": ["Money laundering"],
  "pa-juvenile-transfer-adult-court": ["Disposition of delinquent children"],
  "pa-juvenile-firearm-possession": ["Possession of firearm by minor"],
};

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (PENNSYLVANIA_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function codeSupportsPennsylvaniaReferences(
  charge: CriminalCharge,
  references: PennsylvaniaSourceReference[],
): boolean {
  const code = charge.code.match(/^(\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?)([\s\S]*)$/);
  if (!code) return false;
  const codeSection = code[1];
  const codeSubdivision = code[2].trim() || null;
  return references.every((reference) =>
    codeSection === reference.section &&
    codeSubdivision === reference.subdivision,
  );
}

function sourceDocumentMatchesReference(
  document: PennsylvaniaSourceDocument,
  reference: PennsylvaniaSourceReference,
): boolean {
  return document.section === reference.section &&
    document.sourceUrl === (
      getPennsylvaniaApprovedLegacyProvision(reference)?.canonicalUrl ??
      buildPennsylvaniaSourceUrl(reference.title, reference.section)
    );
}

function parseSectionToken(value: string): {
  section: string;
  subdivision: string | null;
} | null {
  const match = value.trim().match(/^(\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)?)([\s\S]*)$/);
  if (!match) return null;
  return {
    section: match[1],
    subdivision: match[2].trim() || null,
  };
}

/**
 * Catalog citations remain consolidated-statute citations. The three reviewed
 * legacy source mappings are added explicitly by getPennsylvaniaReferences().
 * P.S., federal, MPC, and other unconsolidated citations are not inferred.
 */
export function parsePennsylvaniaCitation(citation: string): PennsylvaniaSourceReference[] {
  const match = citation.match(
    /^\s*(\d+)\s+Pa\.\s*(?:Cons\.\s+Stat\.|C\.S\.)\s+§§?\s*(.+?)\s*$/i,
  );
  if (!match) return [];
  return match[2]
    .split(/\s*,\s*/)
    .map((part) => parseSectionToken(part.replace(/\.$/, "")))
    .filter((part): part is { section: string; subdivision: string | null } => Boolean(part))
    .map((part) => ({ title: match[1], ...part }));
}

export function getPennsylvaniaReferences(
  chargeId: string,
): PennsylvaniaSourceReference[] {
  const legacy = PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS[chargeId];
  if (legacy) {
    return [{
      title: legacy.title,
      section: legacy.section,
      subdivision: legacy.subdivision,
      sourceKind: "unconsolidated",
    }];
  }
  return parsePennsylvaniaCitation(CHARGE_CITATIONS[chargeId]?.citation ?? "");
}

export function getPennsylvaniaApprovedLegacyProvision(
  reference: PennsylvaniaSourceReference,
): PennsylvaniaApprovedLegacyProvision | null {
  if (reference.sourceKind !== "unconsolidated") return null;
  return Object.values(PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS)
    .find((provision) =>
      provision.title === reference.title &&
      provision.section === reference.section &&
      provision.subdivision === reference.subdivision,
    ) ?? null;
}

export function buildPennsylvaniaSourceKey(
  title: string,
  section: string,
  subdivision: string | null = null,
): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `pa:${title}:${section}${suffix}`;
}

function chapterAndSection(section: string): { chapter: string; section: string } {
  const hyphenated = section.match(/^(\d+)-(\d+(?:\.\d+)?)$/);
  if (hyphenated) {
    return { chapter: hyphenated[1], section: hyphenated[2] };
  }
  const base = Number(section.split(".")[0]);
  const chapter = Math.floor(base / 100);
  const remainder = section.includes(".")
    ? `${base % 100}.${section.split(".")[1]}`
    : String(base % 100);
  return { chapter: String(chapter), section: remainder };
}

export function buildPennsylvaniaSourceUrl(title: string, section: string): string {
  const parts = chapterAndSection(section);
  return `${PENNSYLVANIA_SOURCE_BASE}?txtType=HTM&ttl=${encodeURIComponent(title)}&div=0&chpt=${encodeURIComponent(parts.chapter)}&sctn=${encodeURIComponent(parts.section)}&subsctn=0`;
}

/**
 * PAlegis.us replaced the legacy General Assembly host, but the legacy URL
 * remains the stable citation URL in the authority manifest. Keep this
 * retrieval URL separate from buildPennsylvaniaSourceUrl so refreshing the
 * manifest does not rewrite its canonical links.
 */
export function buildPennsylvaniaOfficialSourceUrl(title: string, section: string): string {
  const parts = chapterAndSection(section);
  return `${PENNSYLVANIA_OFFICIAL_SOURCE_BASE}?txtType=HTM&ttl=${encodeURIComponent(title)}&div=0&chpt=${encodeURIComponent(parts.chapter)}&sctn=${encodeURIComponent(parts.section)}&subsctn=0`;
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: PennsylvaniaSourceReference,
  document: PennsylvaniaSourceDocument,
  index: number,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildPennsylvaniaSourceKey(reference.title, reference.section, reference.subdivision);
  const citation = reference.sourceKind === "unconsolidated"
    ? `${reference.title} P.S. § ${reference.section}${reference.subdivision ?? ""}`
    : `${reference.title} Pa. Cons. Stat. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: reference.title,
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
      elements: {
        basis: "verbatim_official_text",
        source: "pennsylvania_general_assembly_html",
        sourceKind: reference.sourceKind ?? "consolidated",
      },
      grading: {
        basis: "verbatim_official_text",
        source: "pennsylvania_general_assembly_html",
        sourceKind: reference.sourceKind ?? "consolidated",
      },
      penalty: {
        basis: "verbatim_official_text",
        source: "pennsylvania_general_assembly_html",
        sourceKind: reference.sourceKind ?? "consolidated",
      },
      currentnessEvidence: { effectiveDateStart: document.effectiveDateStart },
      attorneyReview: "pending",
      fingerprint: referenceHash({
        sourceKey,
        citation,
        officialTitle: document.title,
        sourceUrl: document.sourceUrl,
        contentHash,
        effectiveDateStart: document.effectiveDateStart,
      }),
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

export function buildPennsylvaniaManifestRecord(
  charge: CriminalCharge,
  documents: PennsylvaniaSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = getPennsylvaniaReferences(charge.id);
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        (PENNSYLVANIA_UNCONSOLIDATED_LEGACY_CHARGE_IDS.has(charge.id)
          ? PENNSYLVANIA_UNCONSOLIDATED_LEGACY_REASON
          : "The catalog citation is not an exact Pennsylvania Consolidated Statutes citation; no unconsolidated, federal, or inferred substitute is accepted."),
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      ...(error ? { error } : {}),
    };
  }
  if (!codeSupportsPennsylvaniaReferences(charge, references)) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason:
        "The catalog code does not exactly support every cited Pennsylvania statutory section and subdivision.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const unapprovedLegacy = references
    .map((reference) => getPennsylvaniaApprovedLegacyProvision(reference))
    .find((provision) => provision && !provision.publicationApproved);
  if (unapprovedLegacy) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: PENNSYLVANIA_UNCONSOLIDATED_LEGACY_REASON,
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  if (documents.length !== references.length) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ?? "One or more required Pennsylvania statutory provisions could not be verified.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required Pennsylvania statutory provision",
    };
  }
  if (documents.some((document, index) => !sourceDocumentMatchesReference(document, references[index]))) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason:
        "Every Pennsylvania authority provision must come from its exact official consolidated-statute URL or exact approved official unconsolidated-statute URL; secondary, inferred, nearby, or alternate source URLs are not accepted.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const mismatch = documents.find((document) => !titleMatches(charge, document.title));
  if (mismatch) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: `The official Pennsylvania title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
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
      ? "The official Pennsylvania title is supported by an explicit reviewed alias mapping."
      : "Catalog label matches the official Pennsylvania title.",
    canonicalTitle: documents[0].title,
    provisions,
    apiStatus: "verified",
  };
}

export function validatePennsylvaniaManifestRecord(record: AuthorityCatalogRecord): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "PA") return "Unknown Pennsylvania catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) return "Manifest catalog identity does not match the current Pennsylvania catalog";

  const references = getPennsylvaniaReferences(charge.id);
  const selectable = record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) return record.provisions.length === 0 ? null : "Withheld Pennsylvania records must not carry provisions";
  const unapprovedLegacy = references
    .map((reference) => getPennsylvaniaApprovedLegacyProvision(reference))
    .find((provision) => provision && !provision.publicationApproved);
  if (unapprovedLegacy) {
    return "Pennsylvania legacy provisions are not attorney-approved for publication";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    references.length === 0 ||
    !codeSupportsPennsylvaniaReferences(charge, references)
  ) {
    return "Selectable Pennsylvania records require complete verified statutory support";
  }
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }
  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== reference.title ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildPennsylvaniaSourceKey(reference.title, reference.section, reference.subdivision) ||
      provision.citation !== (
        reference.sourceKind === "unconsolidated"
          ? `${reference.title} P.S. § ${reference.section}${reference.subdivision ?? ""}`
          : `${reference.title} Pa. Cons. Stat. § ${reference.section}${reference.subdivision ?? ""}`
      ) ||
      provision.sourceUrl !== (
        getPennsylvaniaApprovedLegacyProvision(reference)?.canonicalUrl ??
        buildPennsylvaniaSourceUrl(reference.title, reference.section)
      ) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime()) ||
      !titleMatches(charge, provision.officialTitle)
    ) return `Manifest authority provision ${index + 1} is not an exact verified Pennsylvania match`;
  }
  const expectedDisposition = record.provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  ) ? "exact_alias_rename" : "retain";
  return record.disposition === expectedDisposition
    ? null
    : "Manifest disposition does not match the reviewed Pennsylvania title mapping";
}

export function buildPennsylvaniaSourceDatabaseSeed(
  manifest: PennsylvaniaAuthorityManifest,
): AuthoritySourceDatabaseSeed {
  const sources = new Map<string, AuthoritySourceSeed>();
  const snapshots: AuthoritySourceDatabaseSeed["snapshots"] = [];
  const links: AuthorityChargeLinkSeed[] = [];
  for (const record of manifest.catalogRecords) {
    if (record.disposition !== "retain" && record.disposition !== "exact_alias_rename") continue;
    const references = getPennsylvaniaReferences(record.chargeId);
    if (references.some((reference) => {
      const legacy = getPennsylvaniaApprovedLegacyProvision(reference);
      return legacy !== null && !legacy.publicationApproved;
    })) continue;
    for (const provision of record.provisions) {
      if (!sources.has(provision.sourceKey)) {
        sources.set(provision.sourceKey, {
          sourceKey: provision.sourceKey,
          jurisdiction: "PA",
          publisher: PENNSYLVANIA_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: `${provision.lawId}/${provision.section}`,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: PENNSYLVANIA_MANIFEST_SOURCE,
            title: provision.lawId,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "PA",
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
    jurisdiction: "PA",
    sourcePolicy: PENNSYLVANIA_SOURCE_POLICY,
    sources: [...sources.values()],
    snapshots,
    links,
    catalogRecords: manifest.catalogRecords,
    selectableChargeIds: manifest.catalogRecords
      .filter((record) =>
        (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
        record.provisions.length > 0 &&
        !getPennsylvaniaReferences(record.chargeId).some((reference) => {
          const legacy = getPennsylvaniaApprovedLegacyProvision(reference);
          return legacy !== null && !legacy.publicationApproved;
        }),
      )
      .map((record) => record.chargeId),
    generatedAt: manifest.generatedAt,
  };
}