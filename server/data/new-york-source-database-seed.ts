import { createHash } from "node:crypto";
import {
  criminalCharges,
  isChargeIdRequiringReselection,
  NEW_YORK_CANONICAL_TITLES,
  type CriminalCharge,
} from "@shared/criminal-charges";

export type NewYorkDisposition =
  | "retain"
  | "exact_alias_rename"
  | "require_exact_reselection"
  | "remove";

export type NewYorkSupportRole =
  | "offense"
  | "grading"
  | "penalty"
  | "currentness"
  | "jury_instruction";

export interface NewYorkProvisionRecord {
  sourceKey: string;
  lawId: string;
  section: string;
  citation: string;
  officialTitle: string;
  sourceUrl: string;
  content: string | null;
  contentHash: string;
  hashBasis: "source_content" | "reference_metadata";
  retrievedAt: Date | null;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  supportRole: NewYorkSupportRole;
  subdivision: string | null;
  metadata: Record<string, unknown>;
}

export interface NewYorkCatalogRecord {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  catalogCategory: string;
  disposition: NewYorkDisposition;
  dispositionReason: string;
  canonicalTitle: string | null;
  provisions: NewYorkProvisionRecord[];
  apiStatus: "verified" | "api_error" | "local_ordinance" | "placeholder";
  error?: string;
}

export interface NewYorkSourceSeed {
  sourceKey: string;
  jurisdiction: "NY";
  publisher: string;
  sourceType: "statute";
  canonicalUrl: string;
  apiIdentifier: string | null;
  accessPolicy: "reference_only" | "store_text";
  reuseStatus: "permitted" | "restricted" | "not_cleared";
  canStoreContent: boolean;
  lastRetrievedAt: Date | null;
  lastCheckedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface NewYorkSnapshotSeed {
  sourceKey: string;
  jurisdiction: "NY";
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  content: string | null;
  contentHash: string;
  hashBasis: "source_content" | "reference_metadata";
  retrievedAt: Date | null;
  manifestImportedAt: Date;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  status: "current";
  requiresReview: false;
  supersedesSnapshotId: null;
  metadata: Record<string, unknown>;
}

export interface NewYorkChargeLinkSeed {
  chargeId: string;
  snapshotKey: string;
  supportRole: NewYorkSupportRole;
  citation: string;
  subdivision: string | null;
}

export interface NewYorkSourceDatabaseSeed {
  sources: NewYorkSourceSeed[];
  snapshots: NewYorkSnapshotSeed[];
  links: NewYorkChargeLinkSeed[];
  catalogRecords: NewYorkCatalogRecord[];
  selectableChargeIds: string[];
  generatedAt: Date;
}

export interface NewYorkApiDocument {
  lawId: string;
  section: string;
  title: string;
  lawName: string | null;
  text: string;
  activeDate: string | null;
  publishedDates: string[];
  sourceUrl: string;
  retrievedAt: Date;
}

export interface NewYorkAuthorityManifest {
  jurisdiction: "NY";
  generatedAt: Date;
  source: "NY Open Legislation API (legislation.nysenate.gov)";
  catalogRecords: NewYorkCatalogRecord[];
}

const LAW_CITATION_PREFIX: Record<string, string> = {
  PEN: "N.Y. Penal Law",
  VAT: "N.Y. Veh. & Traf. Law",
  FCA: "N.Y. Fam. Ct. Act",
  TAX: "N.Y. Tax Law",
  AGM: "N.Y. Agric. & Mkts. Law",
  ENV: "N.Y. Envtl. Conserv. Law",
  EDN: "N.Y. Educ. Law",
  JUD: "N.Y. Jud. Law",
  ABC: "N.Y. Alco. Bev. Cont. Law",
};

const VAT_CHARGE_IDS = new Set([
  "ny-dui-first-offense",
  "ny-dui-second-offense",
  "ny-dui-third-offense",
  "ny-reckless-driving",
  "ny-hit-and-run",
  "ny-aggravated-unlicensed-operation",
  "ny-driving-without-insurance",
  "ny-expired-registration",
  "ny-expired-inspection",
  "ny-defective-vehicle-equipment",
  "ny-open-container",
  "ny-open-container-violation",
]);

const FCA_CHARGE_IDS = new Set([
  "ny-juvenile-delinquency-felony",
  "ny-juvenile-delinquency-misdemeanor",
]);

const LAW_TYPE_BY_ID: Record<string, string> = {
  "ny-contempt-of-court": "JUD",
  "ny-animal-cruelty-misdemeanor": "AGM",
  "ny-animal-at-large": "AGM",
  "ny-littering": "ENV",
  "ny-hunting-fishing-no-license": "ENV",
  "ny-tax-fraud": "TAX",
  "ny-truancy": "EDN",
  "ny-minor-in-possession": "ABC",
  "ny-illegal-fireworks": "PEN",
  "ny-criminal-contempt": "PEN",
};

interface SourceReference {
  lawId: string;
  section: string;
  citation?: string;
  subdivision?: string | null;
  supportRole?: NewYorkSupportRole;
  local?: boolean;
}

const SOURCE_OVERRIDES: Record<string, SourceReference[]> = {
  "ny-criminal-attempt": [{ lawId: "PEN", section: "110.00" }],
  "ny-conspiracy": [{ lawId: "PEN", section: "105.00" }],
  "ny-aiding-and-abetting": [{ lawId: "PEN", section: "20.00" }],
  "ny-accessory-after-the-fact": [{ lawId: "PEN", section: "205.50" }],
  "ny-criminal-solicitation": [{ lawId: "PEN", section: "100.00" }],
  "ny-attempted-murder": [
    { lawId: "PEN", section: "110.00", supportRole: "offense" },
    { lawId: "PEN", section: "125.25", supportRole: "grading" },
  ],
  "ny-attempted-robbery": [
    { lawId: "PEN", section: "110.00", supportRole: "offense" },
    { lawId: "PEN", section: "160.15", supportRole: "grading" },
  ],
  "ny-attempted-sexual-assault": [
    { lawId: "PEN", section: "110.00", supportRole: "offense" },
    { lawId: "PEN", section: "130.35", supportRole: "grading" },
  ],
  "ny-felony-murder": [
    { lawId: "PEN", section: "125.25", subdivision: "125.25(3)", supportRole: "offense" },
    { lawId: "PEN", section: "125.25", supportRole: "grading" },
  ],
  "ny-murder-in-the-second-degree": [
    { lawId: "PEN", section: "125.25", supportRole: "offense" },
    { lawId: "PEN", section: "125.25", supportRole: "grading" },
  ],
  "ny-assault-with-deadly-weapon": [
    { lawId: "PEN", section: "120.10", subdivision: "120.10(1)" },
  ],
  "ny-bank-robbery": [{ lawId: "PEN", section: "160.15" }],
  "ny-gang-enhancement": [{ lawId: "PEN", section: "460.20" }],
  "ny-hate-crime-enhancement": [{ lawId: "PEN", section: "485.05" }],
  "ny-recidivist-enhancement": [{ lawId: "PEN", section: "70.08" }],
  "ny-firearm-in-felony-enhancement": [{ lawId: "PEN", section: "265.09" }],
  "ny-criminal-sale-of-controlled-substance-near-school-grounds": [
    { lawId: "PEN", section: "220.44" },
  ],
  "ny-rico-organized-crime": [{ lawId: "PEN", section: "460.20" }],
  "ny-money-laundering": [{ lawId: "PEN", section: "470.20" }],
  "ny-juvenile-transfer-adult-court": [{ lawId: "FCA", section: "325.2" }],
  "ny-juvenile-firearm-possession": [{ lawId: "PEN", section: "265.05" }],
  "ny-curfew-violation": [
    { lawId: "NYC", section: "10-222", local: true },
  ],
  "ny-alcohol-in-park": [
    { lawId: "NYC", section: "10-125", local: true },
  ],
};

const SOURCE_RESELECTION_IDS = new Set([
  ...[
    "ny-wire-fraud",
    "ny-mail-fraud",
    "ny-probation-violation",
    "ny-open-container-violation",
    "ny-illegal-fireworks",
    "ny-juvenile-transfer-adult-court",
    "ny-juvenile-delinquency-felony",
    "ny-juvenile-delinquency-misdemeanor",
    "ny-auto-burglary",
    "ny-credit-card-fraud",
    "ny-embezzlement",
    "ny-failure-to-appear",
    "ny-driving-without-insurance",
    "ny-expired-inspection",
    "ny-truancy",
    "ny-littering",
    "ny-hunting-fishing-no-license",
    "ny-animal-at-large",
    "ny-illegal-camping",
    "ny-panhandling",
    "ny-gang-enhancement",
    "ny-bank-robbery",
    "ny-felon-in-possession-of-firearm",
    "ny-attempted-murder",
    "ny-attempted-robbery",
    "ny-attempted-sexual-assault",
  ],
]);

// The string above intentionally includes the prior historical ambiguity set.
// Keep the catalog's existing aliases and reselection behavior in one place.
for (const id of [
  "ny-distribution-of-controlled-substance",
  "ny-manufacturing-controlled-substance",
  "ny-drug-trafficking",
  "ny-possession-of-drug-paraphernalia",
  "ny-maintaining-drug-house",
  "ny-personal-use-of-cannabis",
  "ny-marijuana-unlawful-possession",
  "ny-unlawful-possession-of-cannabis-second-degree",
  "ny-drug-school-zone-enhancement",
]) {
  SOURCE_RESELECTION_IDS.add(id);
}

function getLawId(chargeId: string): string {
  if (VAT_CHARGE_IDS.has(chargeId)) return "VAT";
  if (FCA_CHARGE_IDS.has(chargeId)) return "FCA";
  return LAW_TYPE_BY_ID[chargeId] ?? "PEN";
}

function isPlaceholderCode(code: string): boolean {
  return !code ||
    !/^\d/.test(code) ||
    /[a-z]{2,}\s+/i.test(code) ||
    code.startsWith("MPC") ||
    code.toLowerCase().includes("statute") ||
    code.toLowerCase().includes("court act");
}

export function getNewYorkSourceReferences(charge: CriminalCharge): SourceReference[] {
  if (SOURCE_OVERRIDES[charge.id]) return SOURCE_OVERRIDES[charge.id];
  if (charge.code === "10-222" || charge.code === "10-125") {
    return [{ lawId: "NYC", section: charge.code, local: true }];
  }
  return isPlaceholderCode(charge.code)
    ? []
    : [{ lawId: getLawId(charge.id), section: charge.code }];
}

export function buildNewYorkSourceKey(
  lawId: string,
  section: string,
  subdivision: string | null = null,
): string {
  const subdivisionSuffix = subdivision
    ? `:${subdivision.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`
    : "";
  return `ny:${lawId}:${section}${subdivisionSuffix}`;
}

function citationFor(lawId: string, section: string): string {
  if (lawId === "NYC") return `N.Y.C. Admin. Code § ${section}`;
  return `${LAW_CITATION_PREFIX[lawId] ?? `N.Y. ${lawId} Law`} § ${section}`;
}

function sourceUrlFor(lawId: string, section: string): string {
  if (lawId === "NYC") {
    return "https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-1";
  }
  return `https://www.nysenate.gov/legislation/laws/${lawId}/${section}`;
}

function referenceHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalizedTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function dispositionFor(
  charge: CriminalCharge,
  document: NewYorkApiDocument | null,
  local: boolean,
  missingRequiredProvision: boolean,
): { disposition: NewYorkDisposition; reason: string } {
  if (missingRequiredProvision) {
    return {
      disposition: "require_exact_reselection",
      reason: "A required offense or grading provision was not returned by the official API; the compound charge is incomplete.",
    };
  }
  if (!document && !local) {
    return {
      disposition: "require_exact_reselection",
      reason: "The official NY source did not return a current section; do not infer a replacement.",
    };
  }
  if (SOURCE_RESELECTION_IDS.has(charge.id) || isChargeIdRequiringReselection(charge.id)) {
    return {
      disposition: "require_exact_reselection",
      reason: "The catalog label or section is ambiguous or mismatched; the user must select an exact supported offense.",
    };
  }
  if (local) {
    return {
      disposition: "retain",
      reason: "This is a New York City ordinance and is kept as a separately identified local reference.",
    };
  }
  if (normalizedTitle(document!.title) === normalizedTitle(charge.name)) {
    return { disposition: "retain", reason: "Catalog label matches the official NY source title." };
  }
  const canonicalTitle = NEW_YORK_CANONICAL_TITLES[charge.id];
  if (!canonicalTitle || normalizedTitle(document!.title) !== normalizedTitle(canonicalTitle)) {
    return {
      disposition: "require_exact_reselection",
      reason: "The official title differs from the catalog label without an explicit reviewed alias mapping.",
    };
  }
  return {
    disposition: "exact_alias_rename",
    reason: "The source is official and exact, but the user-facing legacy label should be renamed to the official title before attorney approval.",
  };
}

function provisionFromDocument(
  charge: CriminalCharge,
  reference: SourceReference,
  document: NewYorkApiDocument,
  supportRole: NewYorkSupportRole,
  importedAt: Date,
): NewYorkProvisionRecord {
  const sourceKey = buildNewYorkSourceKey(
    reference.lawId,
    reference.section,
    reference.subdivision ?? null,
  );
  const citation = reference.citation ?? citationFor(reference.lawId, reference.section);
  return {
    sourceKey,
    lawId: reference.lawId,
    section: reference.section,
    citation,
    officialTitle: document.title,
    sourceUrl: document.sourceUrl,
    content: document.text,
    contentHash: referenceHash(document.text),
    hashBasis: "source_content",
    retrievedAt: document.retrievedAt,
    effectiveDateStart: document.activeDate,
    effectiveDateEnd: null,
    supportRole,
    subdivision: reference.subdivision ?? null,
    metadata: {
      chargeId: charge.id,
      catalogLabel: charge.name,
      catalogCode: charge.code,
      catalogClassification: charge.category,
      elements: { basis: "verbatim_official_text", source: "text" },
      mentalState: { basis: "verbatim_official_text", source: "text" },
      grading: { basis: "verbatim_official_text", source: "text" },
      penalty: { basis: "verbatim_official_text", source: "text" },
      currentnessEvidence: {
        activeDate: document.activeDate,
        publishedDates: document.publishedDates,
      },
      fingerprint: referenceHash({
        lawId: reference.lawId,
        section: reference.section,
        citation,
        officialTitle: document.title,
        sourceUrl: document.sourceUrl,
        contentHash: referenceHash(document.text),
        activeDate: document.activeDate,
        publishedDates: document.publishedDates,
      }),
      apiIdentifier: `${reference.lawId}/${reference.section}`,
      apiLawName: document.lawName,
      manifestImportedAt: importedAt.toISOString(),
      attorneyReview: "pending",
    },
  };
}

function localProvision(
  charge: CriminalCharge,
  reference: SourceReference,
  importedAt: Date,
): NewYorkProvisionRecord {
  const citation = reference.citation ?? citationFor(reference.lawId, reference.section);
  const sourceUrl = sourceUrlFor(reference.lawId, reference.section);
  const metadata = {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    currentnessEvidence: "Local ordinance reference; source text is not stored in the state API database.",
    attorneyReview: "pending",
  };
  const fingerprint = referenceHash({
    lawId: reference.lawId,
    section: reference.section,
    citation,
    officialTitle: charge.name,
    sourceUrl,
    contentHash: referenceHash(metadata),
    effectiveDateStart: null,
  });
  return {
    sourceKey: buildNewYorkSourceKey(
      reference.lawId,
      reference.section,
      reference.subdivision ?? null,
    ),
    lawId: reference.lawId,
    section: reference.section,
    citation,
    officialTitle: charge.name,
    sourceUrl,
    content: null,
    contentHash: referenceHash(metadata),
    hashBasis: "reference_metadata",
    retrievedAt: null,
    effectiveDateStart: null,
    effectiveDateEnd: null,
    supportRole: "offense",
    subdivision: reference.subdivision ?? null,
    metadata: { ...metadata, fingerprint, manifestImportedAt: importedAt.toISOString() },
  };
}

export function buildNewYorkSourceDatabaseSeed(
  manifest: NewYorkAuthorityManifest,
): NewYorkSourceDatabaseSeed {
  const sourceMap = new Map<string, NewYorkSourceSeed>();
  const snapshots: NewYorkSnapshotSeed[] = [];
  const links: NewYorkChargeLinkSeed[] = [];

  for (const record of manifest.catalogRecords) {
    if (record.disposition !== "retain" && record.disposition !== "exact_alias_rename") {
      continue;
    }
    for (const provision of record.provisions) {
      if (!sourceMap.has(provision.sourceKey)) {
        sourceMap.set(provision.sourceKey, {
          sourceKey: provision.sourceKey,
          jurisdiction: "NY",
          publisher: provision.lawId === "NYC"
            ? "New York City Law Department / NYC Administrative Code"
            : "New York State Senate Open Legislation",
          sourceType: "statute",
          canonicalUrl: provision.sourceUrl,
          apiIdentifier: provision.lawId === "NYC"
            ? null
            : `${provision.lawId}/${provision.section}`,
          accessPolicy: provision.content ? "store_text" : "reference_only",
          reuseStatus: provision.content ? "permitted" : "not_cleared",
          canStoreContent: Boolean(provision.content),
          lastRetrievedAt: provision.retrievedAt,
          lastCheckedAt: provision.retrievedAt,
          metadata: {
            source: "NY Open Legislation API",
            lawId: provision.lawId,
            section: provision.section,
            attorneyReview: "pending",
          },
        });
      }

      snapshots.push({
        sourceKey: provision.sourceKey,
        jurisdiction: "NY",
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

  const selectableChargeIds = manifest.catalogRecords
    .filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename",
    )
    .filter((record) => record.provisions.length > 0)
    .map((record) => record.chargeId);

  return {
    sources: [...sourceMap.values()],
    snapshots,
    links,
    catalogRecords: manifest.catalogRecords,
    selectableChargeIds,
    generatedAt: manifest.generatedAt,
  };
}

export function buildPlaceholderNewYorkManifest(
  generatedAt: Date = new Date(),
): NewYorkAuthorityManifest {
  const catalogRecords: NewYorkCatalogRecord[] = criminalCharges
    .filter((charge) => charge.jurisdiction === "NY")
    .map((charge) => {
      const references = getNewYorkSourceReferences(charge);
      const isPlaceholder = references.length === 0;
      return {
        chargeId: charge.id,
        catalogLabel: charge.name,
        catalogCode: charge.code,
        catalogCategory: charge.category,
        disposition: isPlaceholder
          ? "require_exact_reselection"
          : "require_exact_reselection",
        dispositionReason: isPlaceholder
          ? "No exact NY statute section is present in the catalog."
          : "A live official API verification is required before this record can be selected.",
        canonicalTitle: null,
        provisions: [],
        apiStatus: isPlaceholder ? "placeholder" : "api_error",
      };
    });
  return {
    jurisdiction: "NY",
    generatedAt,
    source: "NY Open Legislation API (legislation.nysenate.gov)",
    catalogRecords,
  };
}

export function manifestRecordFromDocuments(
  charge: CriminalCharge,
  documents: Array<NewYorkApiDocument | null>,
  importedAt: Date,
): NewYorkCatalogRecord {
  const references = getNewYorkSourceReferences(charge);
  const local = references.some((reference) => reference.local);
  const primary = documents[0] ?? null;
  const missingRequiredProvision = references.some((reference, index) =>
    !reference.local && !documents[index],
  );
  const disposition = dispositionFor(charge, primary, local, missingRequiredProvision);
  const provisions = disposition.disposition === "require_exact_reselection" ||
      disposition.disposition === "remove"
    ? []
    : references.flatMap((reference, index) => {
      const document = documents[index];
      if (reference.local) return [localProvision(charge, reference, importedAt)];
      if (!document) return [];
      return [provisionFromDocument(
        charge,
        reference,
        document,
        reference.supportRole ?? (index === 0 ? "offense" : "grading"),
        importedAt,
      )];
    });

  return {
    chargeId: charge.id,
    catalogLabel: charge.name,
    catalogCode: charge.code,
    catalogCategory: charge.category,
    disposition: disposition.disposition,
    dispositionReason: disposition.reason,
    canonicalTitle: primary?.title ?? (local ? charge.name : null),
    provisions,
    apiStatus: local ? "local_ordinance" : primary && !missingRequiredProvision ? "verified" : "api_error",
    ...(!primary && !local ? { error: "No exact source document returned." } : {}),
  };
}

export const newYorkSourceDatabaseSeed = buildNewYorkSourceDatabaseSeed;