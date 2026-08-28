import { createHash } from "node:crypto";
import { criminalCharges, type CriminalCharge } from "@shared/criminal-charges";
import { CHARGE_CITATIONS } from "@shared/criminal-charge-citations";
import {
  type AuthorityCatalogRecord,
  type AuthorityChargeLinkSeed,
  type AuthorityProvisionSeed,
  type AuthoritySnapshotSeed,
  type AuthoritySourceDatabaseSeed,
  type AuthoritySourceSeed,
  type AuthoritySupportRole,
} from "../services/authority-source-database";

export const TEXAS_SOURCE_POLICY = "official_texas_legislative_council_tcss";
export const TEXAS_SOURCE_BASE = "https://tcss.legis.texas.gov/resources";

export interface TexasAuthorityManifest {
  jurisdiction: "TX";
  generatedAt: Date;
  source: "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)";
  catalogRecords: AuthorityCatalogRecord[];
}

export interface TexasSourceDocument {
  code: string;
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  retrievedAt: Date;
  effectiveDateStart: string | null;
}

const CODE_MAP: Array<[string, string]> = [
  ["Penal Code", "PE"],
  ["Transportation Code", "TN"],
  ["Transp. Code", "TN"],
  ["Health & Safety Code", "HS"],
  ["Tax Code", "TX"],
  ["Civ. Prac. & Rem. Code", "CP"],
  ["Code Crim. Proc.", "CR"],
  ["Code of Criminal Procedure", "CR"],
  ["Alco. Bev. Code", "AL"],
  ["Alcoholic Beverage Code", "AL"],
  ["Hum. Res. Code", "HR"],
  ["Human Resources Code", "HR"],
  ["Educ. Code", "ED"],
  ["Education Code", "ED"],
  ["Occ. Code", "OC"],
  ["Occupations Code", "OC"],
  ["Parks & Wild. Code", "PW"],
  ["Parks and Wildlife Code", "PW"],
  ["Fam. Code", "FA"],
  ["Family Code", "FA"],
];

const CODE_PREFIX: Record<string, string> = {
  PE: "Tex. Penal Code",
  TN: "Tex. Transp. Code",
  HS: "Tex. Health & Safety Code",
  TX: "Tex. Tax Code",
  CP: "Tex. Civ. Prac. & Rem. Code",
  CR: "Tex. Code Crim. Proc.",
  AL: "Tex. Alco. Bev. Code",
  HR: "Tex. Hum. Res. Code",
  ED: "Tex. Educ. Code",
  OC: "Tex. Occ. Code",
  PW: "Tex. Parks & Wild. Code",
  FA: "Tex. Fam. Code",
};

/**
 * Explicitly reviewed aliases. A title mismatch is never accepted merely
 * because the section exists: it must be exact or appear here.
 */
export const TEXAS_CANONICAL_TITLES: Record<string, string> = {
  "tx-involuntary-manslaughter": "Manslaughter",
  "tx-criminally-negligent-homicide": "Criminally Negligent Homicide",
  "tx-vehicular-homicide": "Intoxication Manslaughter",
  "tx-assault-on-peace-officer": "Assault on Public Servant",
  "tx-sexual-assault-in-the-first-degree": "Aggravated Sexual Assault",
  "tx-sexual-assault-in-the-second-degree": "Sexual Assault",
  "tx-statutory-rape": "Sexual Assault",
  "tx-sexual-exploitation-of-minor": "Sexual Performance by a Child",
  "tx-identity-theft": "Fraudulent Use or Possession of Identifying Information",
  "tx-credit-card-fraud": "Credit Card Abuse",
  "tx-burglary-in-the-first-degree": "Burglary of Building or Habitation",
  "tx-burglary-in-the-second-degree": "Burglary of Building or Habitation",
  "tx-residential-burglary": "Burglary of Building or Habitation",
  "tx-commercial-burglary": "Burglary of Building or Habitation",
  "tx-auto-burglary": "Burglary of Vehicles",
  "tx-robbery-in-the-first-degree": "Aggravated Robbery",
  "tx-robbery-in-the-second-degree": "Robbery",
  "tx-possession-with-intent-to-distribute": "Manufacture or Delivery of Controlled Substance",
  "tx-distribution-of-controlled-substance": "Manufacture or Delivery of Controlled Substance",
  "tx-manufacturing-controlled-substance": "Manufacture or Delivery of Controlled Substance",
  "tx-unlawful-carrying-of-weapon": "Unlawful Carrying Weapons",
  "tx-felon-in-possession-of-firearm": "Unlawful Possession of Firearm by Felon",
  "tx-possession-of-prohibited-weapon": "Prohibited Weapons",
  "tx-dui-first-offense": "Driving While Intoxicated",
  "tx-dui-second-offense": "Driving While Intoxicated",
  "tx-dui-third-offense": "Driving While Intoxicated",
  "tx-hit-and-run": "Leaving the Scene of Accident",
  "tx-evading-arrest": "Evading Arrest or Detention",
  "tx-failure-to-identify": "Failure to Identify",
  "tx-criminal-mischief": "Criminal Mischief",
  "tx-terroristic-threat": "Terroristic Threat",
  "tx-resisting-arrest": "Resisting Arrest",
  "tx-protective-order-violation": "Violation of Protective Order",
  "tx-false-info-to-police": "False Report to a Peace Officer",
  "tx-driving-without-insurance": "Operation of Vehicle Without Financial Responsibility",
  "tx-expired-registration": "Operation of Vehicle with Wrong, Fictitious, Altered, or Obscured Insignia",
  "tx-expired-inspection": "Operation of Vehicle with Defective Equipment",
  "tx-curfew-violation": "Delinquent Conduct",
  "tx-trespass-after-warning": "Criminal Trespass",
  "tx-defective-vehicle-equipment": "Required Equipment",
  "tx-illegal-fireworks": "Regulation of Fireworks",
  "tx-criminal-attempt": "Criminal Attempt",
  "tx-conspiracy": "Criminal Conspiracy",
  "tx-aiding-and-abetting": "Criminal Responsibility for Conduct of Another",
  "tx-accessory-after-the-fact": "Hindering Apprehension or Prosecution",
  "tx-criminal-solicitation": "Criminal Solicitation",
  "tx-rico-organized-crime": "Engaging in Organized Criminal Activity",
  "tx-money-laundering": "Money Laundering",
  "tx-juvenile-delinquency-felony": "Delinquent Conduct",
  "tx-juvenile-delinquency-misdemeanor": "Delinquent Conduct",
  "tx-juvenile-transfer-adult-court": "Waiver of Jurisdiction and Discretionary Transfer of Child",
  "tx-juvenile-firearm-possession": "Child with Firearm",
};

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function titleMatches(charge: CriminalCharge, title: string): boolean {
  const normalized = normalizeTitle(title);
  return normalized === normalizeTitle(charge.name) ||
    normalized === normalizeTitle(TEXAS_CANONICAL_TITLES[charge.id] ?? "");
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function parseTexasCitation(citation: string): Array<{
  code: string;
  section: string;
  subdivision: string | null;
}> {
  const entry = CODE_MAP.find(([name]) => citation.includes(name));
  if (!entry) return [];
  const afterMarker = citation.match(/§§?\s*(.+)$/)?.[1];
  if (!afterMarker) return [];
  const values = afterMarker
    .split(/\s*(?:,|;)\s*/)
    .map((value) => value.replace(/\.$/, "").trim())
    .filter(Boolean);
  return values.flatMap((value) => {
    const match = value.match(/^(\d+[A-Z]?\.\d+|\d+)(.*)$/i);
    if (!match) return [];
    const section = match[1];
    const subdivision = match[2].trim() || null;
    return [{ code: entry[1], section, subdivision }];
  });
}

export function buildTexasSourceKey(code: string, section: string): string {
  return `tx:${code}:${section}`;
}

export function buildTexasSourceUrl(code: string, chapter: string, section: string): string {
  return `${TEXAS_SOURCE_BASE}/${code}/htm/${code}.${chapter}.htm#${section}`;
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: { code: string; section: string; subdivision: string | null },
  document: TexasSourceDocument,
  supportRole: AuthoritySupportRole,
  importedAt: Date,
): AuthorityProvisionSeed {
  const sourceKey = buildTexasSourceKey(reference.code, reference.section);
  const citation = `${CODE_PREFIX[reference.code] ?? `Tex. ${reference.code} Code`} § ${reference.section}`;
  const contentHash = referenceHash(document.text);
  return {
    sourceKey,
    lawId: reference.code,
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
    supportRole,
    subdivision: reference.subdivision,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      elements: { basis: "verbatim_official_text", source: "tcss_html" },
      grading: { basis: "verbatim_official_text", source: "tcss_html" },
      penalty: { basis: "verbatim_official_text", source: "tcss_html" },
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

export function buildTexasManifestRecord(
  charge: CriminalCharge,
  documents: TexasSourceDocument[],
  importedAt: Date,
  error?: string,
): AuthorityCatalogRecord {
  const overlay = CHARGE_CITATIONS[charge.id];
  const citation = overlay?.citation ?? "";
  const references = parseTexasCitation(citation);
  if (references.length === 0) {
    return {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogCategory: charge.category,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "The catalog citation is not a Texas statutory citation supported by TCSS; do not infer a state-law replacement.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: error ? "api_error" : "placeholder",
      ...(error ? { error } : {}),
    };
  }
  if (documents.length !== references.length) {
    return {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogCategory: charge.category,
      disposition: "require_exact_reselection",
      dispositionReason: error ??
        "One or more required TCSS provisions was unavailable; the compound or section-specific charge is incomplete.",
      canonicalTitle: null,
      provisions: [],
      apiStatus: "api_error",
      error: error ?? "Missing required TCSS provision",
    };
  }
  const mismatched = documents.find((document) => !titleMatches(charge, document.title));
  if (mismatched) {
    return {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogCategory: charge.category,
      disposition: "require_exact_reselection",
      dispositionReason: `TCSS section exists, but its official title "${mismatched.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
      canonicalTitle: mismatched.title,
      provisions: [],
      apiStatus: "verified",
    };
  }
  const provisions = references.map((reference, index) =>
    provisionFromDocument(
      charge,
      reference,
      documents[index],
      index === 0 ? "offense" : "grading",
      importedAt,
    ),
  );
  const titleChanged = documents.some((document) =>
    normalizeTitle(document.title) !== normalizeTitle(charge.name));
  return {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
    disposition: titleChanged ? "exact_alias_rename" : "retain",
    dispositionReason: titleChanged
      ? "The official TCSS title is supported by an explicit reviewed Texas alias mapping."
      : "Catalog label matches the official TCSS title.",
    canonicalTitle: documents[0].title,
    provisions,
    apiStatus: "verified",
  };
}

export function buildPlaceholderTexasManifest(generatedAt: Date): TexasAuthorityManifest {
  return {
    jurisdiction: "TX",
    generatedAt,
    source: "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)",
    catalogRecords: criminalCharges
      .filter((charge) => charge.jurisdiction === "TX")
      .map((charge) => buildTexasManifestRecord(charge, [], generatedAt)),
  };
}

export function buildTexasSourceDatabaseSeed(
  manifest: TexasAuthorityManifest,
): AuthoritySourceDatabaseSeed {
  const sources = new Map<string, AuthoritySourceSeed>();
  const snapshots: AuthoritySnapshotSeed[] = [];
  const links: AuthorityChargeLinkSeed[] = [];
  for (const record of manifest.catalogRecords) {
    if (record.disposition !== "retain" && record.disposition !== "exact_alias_rename") continue;
    for (const provision of record.provisions) {
      if (!sources.has(provision.sourceKey)) {
        sources.set(provision.sourceKey, {
          sourceKey: provision.sourceKey,
          jurisdiction: "TX",
          publisher: "Texas Legislative Council TCSS",
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: `${provision.lawId}/${provision.section}`,
          accessPolicy: "store_text",
          reuseStatus: "permitted",
          canStoreContent: true,
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: "Texas Legislative Council TCSS static HTML",
            code: provision.lawId,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }
      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "TX",
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
    jurisdiction: "TX",
    sourcePolicy: TEXAS_SOURCE_POLICY,
    sources: [...sources.values()],
    snapshots,
    links,
    catalogRecords: manifest.catalogRecords,
    selectableChargeIds: manifest.catalogRecords
      .filter((record) => (
        record.disposition === "retain" || record.disposition === "exact_alias_rename"
      ) && record.provisions.length > 0)
      .map((record) => record.chargeId),
    generatedAt: manifest.generatedAt,
  };
}