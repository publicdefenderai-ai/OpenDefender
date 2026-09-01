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
  catalogRecords: SouthCarolinaManifestRecord[];
  audit?: SouthCarolinaManifestAudit;
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

export type SouthCarolinaAuditClassification =
  | "mechanical"
  | "structural"
  | "success";

export type SouthCarolinaAuditFindingCode =
  | "official_source_verified"
  | "citation_not_parseable"
  | "catalog_code_mismatch"
  | "official_fetch_failure"
  | "section_not_found"
  | "content_missing"
  | "history_missing"
  | "subdivision_not_found"
  | "official_title_mismatch";

export interface SouthCarolinaAuditFinding {
  code: SouthCarolinaAuditFindingCode;
  classification: SouthCarolinaAuditClassification;
  message: string;
  reference: string | null;
}

export interface SouthCarolinaReferenceAudit {
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
  findings: SouthCarolinaAuditFinding[];
}

export interface SouthCarolinaSourceAudit {
  citation: string;
  references: SouthCarolinaReferenceAudit[];
  findings: SouthCarolinaAuditFinding[];
}

export interface SouthCarolinaManifestRecord extends AuthorityCatalogRecord {
  dispositionReasons: string[];
  auditFindings: SouthCarolinaAuditFinding[];
  sourceAudit: SouthCarolinaSourceAudit;
}

export interface SouthCarolinaManifestAudit {
  schemaVersion: 1;
  catalogRowCount: number;
  parsedReferenceCount: number;
  successfulOfficialRetrievals: number;
  completeSectionExtractions: number;
  findingCounts: Record<SouthCarolinaAuditFindingCode, number>;
  mechanical: {
    findingCodes: SouthCarolinaAuditFindingCode[];
    affectedRows: number;
    affectedReferences: number;
  };
  structural: {
    findingCodes: SouthCarolinaAuditFindingCode[];
    affectedRows: number;
    affectedReferences: number;
  };
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/**
 * These are charge-specific common-name/catchline mappings reviewed against
 * the committed SC source report. They are intentionally limited to rows whose
 * exact catalog citation (including any subdivision) identifies the offense.
 * A broad section heading, a compound citation, or a related catchline alone
 * is not enough to publish a row.
 */
export const SOUTH_CAROLINA_EXACT_TITLE_ALIASES: Record<string, string[]> = {
  "sc-voluntary-manslaughter": ["Manslaughter"],
  "sc-involuntary-manslaughter": [
    "Involuntary manslaughter; \"criminal negligence\" defined",
  ],
  "sc-criminally-negligent-homicide": [
    "Involuntary manslaughter; \"criminal negligence\" defined",
  ],
  "sc-rape-in-the-first-degree": ["Criminal sexual conduct in the first degree"],
  "sc-rape-in-the-second-degree": ["Criminal sexual conduct in the second degree"],
  "sc-sexual-assault-in-the-first-degree": [
    "Criminal sexual conduct in the first degree",
  ],
  "sc-sexual-assault-in-the-second-degree": [
    "Criminal sexual conduct in the second degree",
  ],
  "sc-sexual-assault-in-the-third-degree": [
    "Criminal sexual conduct in the third degree",
  ],
  "sc-statutory-rape": [
    "Criminal sexual conduct with a minor; aggravating and mitigating circumstances; penalties; repeat offenders",
  ],
  "sc-theft-by-receiving": [
    "Receiving stolen goods, chattels, or other property; receiving or possessing property represented by law enforcement as stolen; penalties",
  ],
  "sc-identity-theft": ["Financial identity fraud or identity fraud; penalty"],
  "sc-credit-card-fraud": ["Financial transaction card fraud"],
  "sc-embezzlement": ["Breach of trust with fraudulent intent"],
  "sc-burglary-in-the-first-degree": ["Burglary; first degree"],
  "sc-burglary-in-the-second-degree": ["Burglary; second degree"],
  "sc-burglary-in-the-third-degree": ["Burglary; third degree"],
  "sc-carjacking": ["Felony of carjacking; penalties"],
  "sc-possession-of-drug-paraphernalia": [
    "Unlawful to advertise for sale, manufacture, possess, sell or deliver, or to possess with intent to sell or deliver, paraphernalia",
  ],
  "sc-check-fraud": [
    "Drawing and uttering fraudulent check, draft, or other written order",
  ],
  "sc-insurance-fraud": [
    "Criminal penalties for making false statement or misrepresentation, or assisting, abetting, soliciting or conspiring to do so; restitution to victims",
  ],
  "sc-disorderly-conduct": [
    "Public disorderly conduct; conditional discharge for first-time offenders",
  ],
  "sc-dui-first-offense": [
    "Operating motor vehicle while under influence of alcohol or drugs; penalties; enrollment in Alcohol and Drug Safety Action Program; prosecution",
  ],
  "sc-reckless-driving": [
    "Reckless driving; penalties; suspension of driver's license for second or subsequent offense",
  ],
  "sc-driving-while-suspended": [
    "Penalties for driving while license cancelled, suspended or revoked; route restricted license",
  ],
  "sc-driving-under-suspension": [
    "Penalties for driving while license cancelled, suspended or revoked; route restricted license",
  ],
  "sc-petit-larceny": ["Petit larceny; grand larceny"],
  "sc-assault-and-battery-third-degree": [
    "Assault and battery; definitions; degrees of offenses",
  ],
  "sc-domestic-violence-third-degree": ["Acts prohibited; penalties"],
  "sc-malicious-injury-to-property": [
    "Malicious injury to animals and other personal property",
  ],
  "sc-failure-to-appear": ["Wilful failure to appear; penalties"],
  "sc-probation-violation": ["Court action when terms of probation violated"],
  "sc-open-container": ["Open containers in motor vehicle"],
  "sc-animal-cruelty-misdemeanor": ["Ill-treatment of animals generally; penalties"],
  "sc-truancy": ["Penalty for failure to enroll or cause child to attend school"],
  "sc-littering": [
    "Dumping litter on private or public property prohibited; exceptions; responsibility for removal; penalties",
  ],
  "sc-criminal-attempt": ["Offense of attempt punished as principal offense"],
  "sc-conspiracy": ["Conspiracy"],
  "sc-juvenile-transfer-adult-court": ["Transfer of jurisdiction"],
};

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

export function matchesSouthCarolinaCatalogTitle(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    (SOUTH_CAROLINA_EXACT_TITLE_ALIASES[charge.id] ?? [])
      .some((alias) => normalized === normalizeTitle(alias));
}

function isSouthCarolinaSelectableDisposition(
  disposition: SouthCarolinaManifestRecord["disposition"],
): boolean {
  return disposition === "retain" || disposition === "exact_alias_rename";
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
  sourceAudit?: SouthCarolinaSourceAudit,
): SouthCarolinaManifestRecord {
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };
  const references = parseSouthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const audit = sourceAudit ?? buildFallbackSouthCarolinaSourceAudit(charge, documents, importedAt);
  const auditFindings = [...audit.findings];
  if (references.length === 0) {
    auditFindings.push({
      code: "citation_not_parseable",
      classification: "structural",
      message:
        "The catalog citation is not an exact South Carolina Code citation; federal, MPC, inferred, and compound-only substitutes are withheld.",
      reference: null,
    });
  } else if (!codeSupportsReferences(charge, references)) {
    auditFindings.push({
      code: "catalog_code_mismatch",
      classification: "structural",
      message: "The catalog code does not exactly support every cited South Carolina statutory section.",
      reference: null,
    });
  }
  const dispositionReasons = [...new Set(
    auditFindings
      .filter((finding) => finding.classification !== "success")
      .map((finding) => finding.message),
  )];
  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ?? dispositionReasons[0],
      dispositionReasons: error && !dispositionReasons.includes(error)
        ? [error, ...dispositionReasons]
        : dispositionReasons,
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      ...(error ? { error } : {}),
      auditFindings,
      sourceAudit: audit,
    };
  }
  if (!codeSupportsReferences(charge, references)) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: dispositionReasons[0] ?? "The catalog code does not exactly support every cited South Carolina statutory section.",
      dispositionReasons,
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
      auditFindings,
      sourceAudit: audit,
    };
  }
  if (documents.length !== references.length) {
    if (error && !dispositionReasons.includes(error)) dispositionReasons.unshift(error);
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: dispositionReasons[0] ?? "One or more required South Carolina statutory provisions could not be verified.",
      dispositionReasons,
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required South Carolina statutory provision",
      auditFindings,
      sourceAudit: audit,
    };
  }
  if (documents.some((document, index) =>
    !matchesSouthCarolinaCatalogTitle(charge, document.title) || !hasSubdivision(document.text, references[index].subdivision),
  )) {
    const mismatch = documents.find((document) => !matchesSouthCarolinaCatalogTitle(charge, document.title));
    if (dispositionReasons.length === 0) {
      dispositionReasons.push(
        mismatch
          ? `The official South Carolina title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`
          : "A required South Carolina subdivision was not found in the complete official section text.",
      );
    }
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: dispositionReasons[0],
      dispositionReasons,
      canonicalTitle: mismatch?.title ?? null,
      provisions: [],
      apiStatus: "verified",
      auditFindings,
      sourceAudit: audit,
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
    dispositionReasons: dispositionReasons.length > 0
      ? dispositionReasons
      : [hasAlias
        ? "The official South Carolina title is supported by an explicit reviewed alias mapping."
        : "Catalog label matches the official South Carolina title."],
    auditFindings,
    sourceAudit: audit,
  };
}

function buildFallbackSouthCarolinaSourceAudit(
  charge: CriminalCharge,
  documents: SouthCarolinaSourceDocument[],
  importedAt: Date,
): SouthCarolinaSourceAudit {
  const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
  const references = parseSouthCarolinaCitation(citation);
  const audits = references.map((reference, index): SouthCarolinaReferenceAudit => {
    const document = documents[index];
    const referenceLabel = `${reference.section}${reference.subdivision ?? ""}`;
    if (!document) {
      return {
        section: reference.section,
        subdivision: reference.subdivision,
        citation: `S.C. Code Ann. § ${referenceLabel}`,
        officialUrl: buildSouthCarolinaSourceUrl(reference.section),
        fetchStatus: "not_attempted",
        fetchError: null,
        retrievedAt: null,
        sectionExtractionStatus: "incomplete",
        officialTitle: null,
        historyEvidence: false,
        contentEvidence: false,
        contentHash: null,
        findings: [],
      };
    }
    const findings: SouthCarolinaAuditFinding[] = [{
      code: "official_source_verified",
      classification: "success",
      message: "Official South Carolina source was retrieved with complete section and history/content evidence.",
      reference: referenceLabel,
    }];
    if (!matchesSouthCarolinaCatalogTitle(charge, document.title)) {
      findings.push({
        code: "official_title_mismatch",
        classification: "structural",
        message: `The official South Carolina title "${document.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
        reference: referenceLabel,
      });
    }
    if (!hasSubdivision(document.text, reference.subdivision)) {
      findings.push({
        code: "subdivision_not_found",
        classification: "mechanical",
        message: "A required South Carolina subdivision was not found in the complete official section text.",
        reference: referenceLabel,
      });
    }
    return {
      section: reference.section,
      subdivision: reference.subdivision,
      citation: `S.C. Code Ann. § ${referenceLabel}`,
        officialUrl: buildSouthCarolinaSourceUrl(reference.section),
      fetchStatus: "success",
      fetchError: null,
      retrievedAt: document.retrievedAt.toISOString(),
      sectionExtractionStatus: "complete",
      officialTitle: document.title,
      historyEvidence: /\bHISTORY:/i.test(document.text),
      contentEvidence: document.text.trim().length > 0,
      contentHash: createHash("sha256").update(document.text).digest("hex"),
      findings,
    };
  });
  return {
    citation,
    references: audits,
    findings: audits.flatMap((audit) => audit.findings),
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
  const scRecord = record as SouthCarolinaManifestRecord;
  const selectable = isSouthCarolinaSelectableDisposition(record.disposition);
  if (!selectable) {
    return record.provisions.length === 0 ? null : "Withheld South Carolina records must not carry authority provisions";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsReferences(charge, references) ||
    !scRecord.sourceAudit ||
    scRecord.sourceAudit.citation !== CHARGE_CITATIONS[charge.id]?.citation ||
    scRecord.sourceAudit.references.length !== references.length
  ) return "Selectable South Carolina record does not have complete exact statutory support";
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }
  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    const referenceAudit = scRecord.sourceAudit.references[index];
    const expectedCitation = reference
      ? `S.C. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`
      : null;
    if (
      !reference ||
      !referenceAudit ||
      provision.lawId !== "SC" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildSouthCarolinaSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== expectedCitation ||
      provision.sourceUrl !== buildSouthCarolinaSourceUrl(reference.section) ||
      referenceAudit.section !== reference.section ||
      referenceAudit.subdivision !== reference.subdivision ||
      referenceAudit.citation !== expectedCitation ||
      referenceAudit.officialUrl !== buildSouthCarolinaSourceUrl(reference.section) ||
      referenceAudit.fetchStatus !== "success" ||
      referenceAudit.sectionExtractionStatus !== "complete" ||
      !referenceAudit.officialTitle ||
      referenceAudit.officialTitle !== provision.officialTitle ||
      referenceAudit.contentHash !== provision.contentHash ||
      !referenceAudit.contentEvidence ||
      !referenceAudit.historyEvidence ||
      referenceAudit.findings.length === 0 ||
      referenceAudit.findings.some((finding) => finding.classification !== "success") ||
      !matchesSouthCarolinaCatalogTitle(charge, provision.officialTitle) ||
      !hasSubdivision(provision.content ?? "", reference.subdivision) ||
      !new RegExp(`^SECTION\\s+${reference.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.`, "i")
        .test(provision.content ?? "") ||
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
    if (!isSouthCarolinaSelectableDisposition(record.disposition)) continue;
    const validationError = validateSouthCarolinaManifestRecord(record);
    if (validationError) {
      throw new Error(`${record.chargeId}: ${validationError}`);
    }
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