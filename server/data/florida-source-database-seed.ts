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

export const FLORIDA_SOURCE_POLICY = "official_florida_online_sunshine_statutes";
export const FLORIDA_SOURCE_BASE = "https://www.leg.state.fl.us/statutes/index.cfm";
export const FLORIDA_SOURCE_PUBLISHER = "Florida Legislature Online Sunshine";
export const FLORIDA_MANIFEST_SOURCE =
  "Florida Legislature Online Sunshine (leg.state.fl.us/statutes)";
export const FLORIDA_PUBLIC_ROBBERY_CHARGE_ID = "fl-robbery-in-the-first-degree";

export interface FloridaSourceDocument {
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
}

export interface FloridaAuthorityManifest {
  jurisdiction: "FL";
  generatedAt: Date;
  source: typeof FLORIDA_MANIFEST_SOURCE;
  catalogRecords: AuthorityCatalogRecord[];
}

export interface FloridaSourceReference {
  section: string;
  subdivision: string | null;
}

export function normalizeFloridaSubdivision(value: string): string[] {
  return [...value.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
}

function floridaCodeReferences(code: string): Map<string, string[]> {
  const references = new Map<string, string[]>();
  const pattern = /\b(\d{3}\.\d{2,3})((?:\([a-z0-9]+\)|\d+)*)/gi;
  for (const match of code.matchAll(pattern)) {
    references.set(match[1], normalizeFloridaSubdivision(match[2]));
  }
  return references;
}

function codeSupportsFloridaReferences(
  charge: CriminalCharge,
  references: FloridaSourceReference[],
): boolean {
  const codeReferences = floridaCodeReferences(charge.code);
  if (codeReferences.size === 0) return false;
  return references.every((reference) => {
    const codeSubdivision = codeReferences.get(reference.section);
    if (!codeSubdivision) return false;
    const citedSubdivision = normalizeFloridaSubdivision(reference.subdivision ?? "");
    return codeSubdivision.length === citedSubdivision.length &&
      codeSubdivision.every((part, index) => part === citedSubdivision[index]);
  });
}

/**
 * Only these records have an explicitly reviewed offense-to-statute mapping.
 * A title alias is not enough by itself: the exact catalog code is checked
 * against the citation, and every other Florida record remains withheld.
 */
export interface FloridaExactOffenseRule {
  catalogCode: string;
  officialTitle: string;
}

export const FLORIDA_EXACT_OFFENSE_RULES: Record<string, FloridaExactOffenseRule> = {
  "fl-murder-in-the-first-degree": { catalogCode: "782.04(1)", officialTitle: "Murder" },
  "fl-murder-in-the-second-degree": { catalogCode: "782.04(2)", officialTitle: "Murder" },
  "fl-vehicular-homicide": { catalogCode: "782.071", officialTitle: "Vehicular homicide" },
  "fl-aggravated-assault": { catalogCode: "784.021", officialTitle: "Aggravated assault" },
  "fl-sexual-assault-in-the-first-degree": { catalogCode: "794.011(3)", officialTitle: "Sexual battery" },
  "fl-sexual-assault-in-the-third-degree": { catalogCode: "794.011(5)", officialTitle: "Sexual battery" },
  "fl-statutory-rape": {
    catalogCode: "794.05",
    officialTitle: "Unlawful sexual activity with certain minors",
  },
  "fl-grand-theft-in-the-first-degree": { catalogCode: "812.014(2)(a)", officialTitle: "Theft" },
  "fl-grand-theft-in-the-second-degree": { catalogCode: "812.014(2)(b)", officialTitle: "Theft" },
  "fl-grand-theft-in-the-third-degree": { catalogCode: "812.014(2)(c)", officialTitle: "Theft" },
  "fl-burglary-in-the-first-degree": { catalogCode: "810.02(2)", officialTitle: "Burglary" },
  "fl-burglary-in-the-second-degree": { catalogCode: "810.02(3)", officialTitle: "Burglary" },
  "fl-robbery-in-the-first-degree": { catalogCode: "812.13(2)(a)", officialTitle: "Robbery" },
  "fl-robbery-in-the-second-degree": { catalogCode: "812.13(2)(c)", officialTitle: "Robbery" },
  "fl-carjacking": { catalogCode: "812.133", officialTitle: "Carjacking" },
  "fl-unlawful-carrying-of-weapon": {
    catalogCode: "790.01",
    officialTitle: "Carrying of concealed weapons or concealed firearms",
  },
  "fl-discharge-of-firearm-in-city": {
    catalogCode: "790.15",
    officialTitle: "Discharging firearm in public or on residential property",
  },
  "fl-forgery": { catalogCode: "831.01", officialTitle: "Forgery" },
  "fl-loitering": { catalogCode: "856.021", officialTitle: "Loitering or prowling; penalty" },
  "fl-reckless-driving": { catalogCode: "316.192", officialTitle: "Reckless driving" },
  "fl-disorderly-intoxication": { catalogCode: "856.011", officialTitle: "Disorderly intoxication" },
  "fl-possession-of-marijuana-under-20g": {
    catalogCode: "893.13(6)(b)",
    officialTitle: "Prohibited acts; penalties",
  },
  "fl-trespass-in-structure": {
    catalogCode: "810.08",
    officialTitle: "Trespass in structure or conveyance",
  },
  "fl-resisting-officer-without-violence": {
    catalogCode: "843.02",
    officialTitle: "Resisting officer without violence to his or her person",
  },
  "fl-minor-in-possession": {
    catalogCode: "562.111",
    officialTitle: "Possession of alcoholic beverages by persons under age 21 prohibited",
  },
};

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function parseFloridaCitation(citation: string): FloridaSourceReference[] {
  const match = citation.match(/^Fla\.\s+Stat\.\s+§§?\s*(.+)$/i);
  if (!match) return [];
  return match[1]
    .split(/\s*,\s*/)
    .map((value) => value.replace(/\.$/, "").trim())
    .flatMap((value) => {
      const section = value.match(/^(\d+(?:\.\d+)?)/)?.[1];
      if (!section) return [];
      return [{
        section,
        subdivision: value.slice(section.length).trim() || null,
      }];
    });
}

export function buildFloridaSourceKey(section: string, subdivision: string | null = null): string {
  const suffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `fl:statute:${section}${suffix}`;
}

export function buildFloridaSourceUrl(section: string): string {
  const [chapterText, subsection] = section.split(".");
  const chapter = Number(chapterText);
  const rangeStart = Math.floor(chapter / 100) * 100;
  const range = `${String(rangeStart).padStart(4, "0")}-${String(rangeStart + 99).padStart(4, "0")}`;
  const chapterPath = String(chapter).padStart(4, "0");
  return `${FLORIDA_SOURCE_BASE}?App_mode=Display_Statute&URL=${range}/${chapterPath}/Sections/${chapterPath}.${subsection ?? "00"}.html`;
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const rule = FLORIDA_EXACT_OFFENSE_RULES[charge.id];
  if (!rule || charge.code !== rule.catalogCode) return false;
  const normalized = normalizeTitle(title);
  if (normalized === normalizeTitle(charge.name)) return true;
  return normalized === normalizeTitle(rule.officialTitle);
}

function supportRoleFor(
  charge: CriminalCharge,
  reference: FloridaSourceReference,
  index: number,
): AuthorityProvisionSeed["supportRole"] {
  if (reference.section === "921.0022") return "grading";
  if (
    /attempted|criminal-attempt|conspiracy|solicitation|aiding-and-abetting|accessory-after-the-fact/.test(
      charge.id,
    ) &&
    index > 0
  ) {
    return "grading";
  }
  return index === 0 ? "offense" : "grading";
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: FloridaSourceReference,
  document: FloridaSourceDocument,
  index: number,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildFloridaSourceKey(reference.section, reference.subdivision);
  const citation = `Fla. Stat. § ${reference.section}${reference.subdivision ?? ""}`;
  const contentHash = createHash("sha256").update(document.text).digest("hex");
  return {
    sourceKey,
    lawId: "FL",
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
    supportRole: supportRoleFor(charge, reference, index),
    subdivision: reference.subdivision,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      elements: { basis: "verbatim_official_text", source: "florida_online_sunshine_html" },
      grading: { basis: "verbatim_official_text", source: "florida_online_sunshine_html" },
      penalty: { basis: "verbatim_official_text", source: "florida_online_sunshine_html" },
      currentnessEvidence: {
        statuteEdition: "Florida Statutes 2024",
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
      }),
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

export function buildFloridaManifestRecord(
  charge: CriminalCharge,
  documents: FloridaSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
  const references = parseFloridaCitation(citation);
  const base = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
  };

  if (references.length === 0) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not an exact Florida statutory citation supported by the Florida Legislature Online Sunshine source.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      ...(error ? { error } : {}),
    };
  }
  if (documents.length !== references.length) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "One or more required Florida statutory provisions was unavailable; the charge is incomplete.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required Florida statutory provision",
    };
  }
  if (!codeSupportsFloridaReferences(charge, references)) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason:
        "The catalog code does not exactly support every cited Florida statutory section and subdivision.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const mismatch = documents.find((document, index) =>
    !titleMatches(charge, document.title),
  );
  if (mismatch) {
    return {
      ...base,
      disposition: "require_exact_reselection",
      dispositionReason:
        `The official Florida title "${mismatch.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
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
      ? "The official Florida title is supported by an explicit reviewed alias mapping."
      : "Catalog label matches the official Florida title.",
    canonicalTitle: documents[0].title,
    provisions,
    apiStatus: "verified",
  };
}

export function validateFloridaManifestRecord(
  record: AuthorityCatalogRecord,
): string | null {
  const charge = criminalCharges.find((candidate) => candidate.id === record.chargeId);
  if (!charge || charge.jurisdiction !== "FL") return "Unknown Florida catalog charge";
  if (
    record.catalogLabel !== charge.name ||
    record.catalogCode !== charge.code ||
    record.catalogCategory !== charge.category
  ) {
    return "Manifest catalog identity does not match the current Florida catalog";
  }

  const references = parseFloridaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
  const selectable =
    record.disposition === "retain" || record.disposition === "exact_alias_rename";
  if (!selectable) {
    return record.provisions.length === 0
      ? null
      : "Withheld Florida records must not carry authority provisions";
  }

  const rule = FLORIDA_EXACT_OFFENSE_RULES[charge.id];
  if (!rule || charge.code !== rule.catalogCode) {
    return "Selectable Florida records must have a vetted offense mapping";
  }
  if (
    record.apiStatus !== "verified" ||
    record.provisions.length !== references.length ||
    !codeSupportsFloridaReferences(charge, references)
  ) {
    return "Selectable Florida record does not have complete exact statutory support";
  }

  const alias = record.provisions.some((provision) =>
    normalizeTitle(provision.officialTitle) !== normalizeTitle(charge.name),
  );
  const expectedDisposition = alias ? "exact_alias_rename" : "retain";
  if (record.disposition !== expectedDisposition) {
    return "Manifest disposition does not match the vetted title mapping";
  }
  if (record.canonicalTitle !== record.provisions[0]?.officialTitle) {
    return "Manifest canonical title does not match its first authority provision";
  }

  for (const [index, provision] of record.provisions.entries()) {
    const reference = references[index];
    if (
      !reference ||
      provision.lawId !== "FL" ||
      provision.section !== reference.section ||
      provision.subdivision !== reference.subdivision ||
      provision.sourceKey !== buildFloridaSourceKey(reference.section, reference.subdivision) ||
      provision.citation !== `Fla. Stat. § ${reference.section}${reference.subdivision ?? ""}` ||
      provision.sourceUrl !== buildFloridaSourceUrl(reference.section) ||
      !titleMatches(charge, provision.officialTitle) ||
      provision.hashBasis !== "source_content" ||
      typeof provision.content !== "string" ||
      provision.content.length === 0 ||
      provision.contentHash !== createHash("sha256").update(provision.content).digest("hex") ||
      !provision.retrievedAt ||
      Number.isNaN(provision.retrievedAt.getTime())
    ) {
      return `Manifest authority provision ${index + 1} is not an exact verified match`;
    }
  }
  return null;
}

export function buildFloridaSourceDatabaseSeed(
  manifest: FloridaAuthorityManifest,
): AuthoritySourceDatabaseSeed {
  const sources = new Map<string, AuthoritySourceSeed>();
  const snapshots = [];
  const links: AuthorityChargeLinkSeed[] = [];

  for (const record of manifest.catalogRecords) {
    if (record.disposition !== "retain" && record.disposition !== "exact_alias_rename") continue;
    for (const provision of record.provisions) {
      if (!sources.has(provision.sourceKey)) {
        sources.set(provision.sourceKey, {
          sourceKey: provision.sourceKey,
          jurisdiction: "FL",
          publisher: FLORIDA_SOURCE_PUBLISHER,
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.section,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: FLORIDA_MANIFEST_SOURCE,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "FL" as const,
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
        status: "current" as const,
        requiresReview: false as const,
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

  const selectableChargeIds = manifest.catalogRecords
    .filter((record) =>
      (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
      record.provisions.length > 0,
    )
    .map((record) => record.chargeId);
  const expectedFloridaChargeIds = criminalCharges
    .filter((charge) => charge.jurisdiction === "FL")
    .map((charge) => charge.id);
  const isCompleteManifest =
    manifest.catalogRecords.length === expectedFloridaChargeIds.length &&
    expectedFloridaChargeIds.every((chargeId) =>
      manifest.catalogRecords.some((record) => record.chargeId === chargeId),
    );
  if (isCompleteManifest && !selectableChargeIds.includes(FLORIDA_PUBLIC_ROBBERY_CHARGE_ID)) {
    throw new Error(
      `Florida authority seed must retain ${FLORIDA_PUBLIC_ROBBERY_CHARGE_ID} for public charge search`,
    );
  }

  return {
    jurisdiction: "FL",
    sourcePolicy: FLORIDA_SOURCE_POLICY,
    sources: [...sources.values()],
    snapshots,
    links,
    catalogRecords: manifest.catalogRecords,
    selectableChargeIds,
    generatedAt: manifest.generatedAt,
  };
}