import {
  CALIFORNIA_CANONICAL_RECORDS,
} from "@shared/california-authority";
import {
  buildCaliforniaSourceDatabaseSeed,
} from "./california-source-database-seed";
import {
  loadFloridaAuthorityManifest,
} from "./florida-manifest-loader";
import {
  buildFloridaSourceDatabaseSeed,
} from "./florida-source-database-seed";
import {
  loadGeorgiaAuthorityManifest,
} from "./georgia-manifest-loader";
import {
  buildGeorgiaSourceDatabaseSeed,
} from "./georgia-source-database-seed";
import {
  loadIllinoisAuthorityManifest,
} from "./illinois-manifest-loader";
import {
  buildIllinoisSourceDatabaseSeed,
} from "./illinois-source-database-seed";
import {
  loadNewYorkAuthorityManifest,
} from "./new-york-manifest-loader";
import {
  buildNewYorkSourceDatabaseSeed,
} from "./new-york-source-database-seed";
import {
  loadOhioAuthorityManifest,
} from "./ohio-manifest-loader";
import {
  buildOhioSourceDatabaseSeed,
} from "./ohio-source-database-seed";
import {
  loadPennsylvaniaAuthorityManifest,
} from "./pennsylvania-manifest-loader";
import {
  buildPennsylvaniaSourceDatabaseSeed,
} from "./pennsylvania-source-database-seed";
import {
  loadSouthCarolinaAuthorityManifest,
} from "./south-carolina-manifest-loader";
import {
  buildSouthCarolinaSourceDatabaseSeed,
} from "./south-carolina-source-database-seed";
import {
  loadTexasAuthorityManifest,
} from "./texas-manifest-loader";
import {
  buildTexasSourceDatabaseSeed,
} from "./texas-source-database-seed";
/**
 * "High public-source coverage" measures whether the public-source import
 * reached the catalog rows, not whether every row is safe to publish under the
 * stricter exact-identity boundary. A source response can be recorded as a
 * withheld row when the official material is available but the catalog
 * identity is ambiguous.
 */
export const HIGH_PUBLIC_SOURCE_COVERAGE_TARGET = {
  catalogAccountingRate: 1,
  officialResponseRate: 0.9,
} as const;

export const CURRENT_PUBLIC_SOURCE_JURISDICTIONS = [
  "CA",
  "FL",
  "GA",
  "IL",
  "NY",
  "OH",
  "PA",
  "SC",
  "TX",
] as const;

export type CurrentPublicSourceJurisdiction =
  (typeof CURRENT_PUBLIC_SOURCE_JURISDICTIONS)[number];

export type PublicSourceCoverageStatus =
  | "meets_target"
  | "blocked"
  | "below_target";

export interface PublicSourceAccessBlocker {
  kind: "source_access";
  source: string;
  summary: string;
  evidence: string;
  nextStep: string;
}

/**
 * These are source-contract blockers, not legal-review decisions. They remain
 * explicit so a low response rate cannot be mistaken for a completed
 * jurisdiction or silently converted into inferred authority.
 */
export const PUBLIC_SOURCE_ACCESS_BLOCKERS: Partial<
  Record<CurrentPublicSourceJurisdiction, PublicSourceAccessBlocker>
> = {
  GA: {
    kind: "source_access",
    source: "Georgia General Assembly public API",
    summary:
      "The public API exposes legislative metadata and code-title names, but not current codified section text.",
    evidence:
      "The committed Georgia importer receives no public official section document satisfying its exact URL, document-identity, complete-text, and currentness contract.",
    nextStep:
      "Use a stable public Georgia section-text endpoint when the General Assembly publishes one; do not substitute secondary sources or authenticated-only annotated-code access.",
  },
  PA: {
    kind: "source_access",
    source: "Pennsylvania General Assembly consolidated-statute source",
    summary:
      "The official source contract does not currently return every requested section needed by the catalog inventory.",
    evidence:
      "The committed Pennsylvania manifest records unavailable and placeholder rows rather than inferring authority from a secondary source.",
    nextStep:
      "Re-run the official PA source probe after the missing section routes or consolidated-statute source contract are restored, then regenerate the manifest.",
  },
};

export interface PublicSourceCoverageReportRow {
  jurisdiction: CurrentPublicSourceJurisdiction;
  source: string;
  manifestGeneratedAt: string;
  catalogRows: number;
  rowsWithOfficialResponse: number;
  selectableRows: number;
  withheldRows: number;
  rowsWithExplicitWithheldReason: number;
  sources: number;
  snapshots: number;
  links: number;
  catalogAccountingRate: number;
  officialResponseRate: number;
  publishableRate: number;
  status: PublicSourceCoverageStatus;
  blocker: PublicSourceAccessBlocker | null;
}

export interface PublicSourceCoverageReport {
  target: typeof HIGH_PUBLIC_SOURCE_COVERAGE_TARGET;
  jurisdictions: PublicSourceCoverageReportRow[];
  belowTargetJurisdictions: CurrentPublicSourceJurisdiction[];
}

export interface PublicSourceCoverageTargetCheck {
  catalogAccountingRate: number;
  officialResponseRate: number;
  withheldRows: number;
  rowsWithExplicitWithheldReason: number;
}

export function isPublicSourceCoverageTargetMet(
  check: PublicSourceCoverageTargetCheck,
): boolean {
  return (
    check.catalogAccountingRate >=
      HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.catalogAccountingRate &&
    check.officialResponseRate >=
      HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.officialResponseRate &&
    check.rowsWithExplicitWithheldReason === check.withheldRows
  );
}

interface CoverageCatalogRecord {
  disposition: "retain" | "exact_alias_rename" | "require_exact_reselection" | "remove";
  dispositionReason: string;
  provisions: unknown[];
  apiStatus: string;
}

interface CoverageSeedCounts {
  sources: readonly unknown[];
  snapshots: readonly unknown[];
  links: readonly unknown[];
  selectableChargeIds: readonly string[];
}

interface CoverageInput {
  jurisdiction: CurrentPublicSourceJurisdiction;
  source: string;
  manifestGeneratedAt: Date;
  records: CoverageCatalogRecord[];
  seed: CoverageSeedCounts;
  rowsWithOfficialResponse: number;
}

function isSelectable(record: CoverageCatalogRecord): boolean {
  return (
    (record.disposition === "retain" ||
      record.disposition === "exact_alias_rename") &&
    record.provisions.length > 0
  );
}

function buildManifestInput(
  jurisdiction: Exclude<CurrentPublicSourceJurisdiction, "CA">,
  source: string,
  manifestGeneratedAt: Date,
  records: CoverageCatalogRecord[],
  seed: CoverageSeedCounts,
  rowsWithOfficialResponse = records.filter((record) =>
    record.apiStatus === "verified" || record.apiStatus === "local_ordinance"
  ).length,
): CoverageInput {
  return {
    jurisdiction,
    source,
    manifestGeneratedAt,
    records,
    seed,
    rowsWithOfficialResponse,
  };
}

function buildCoverageInputs(): CoverageInput[] {
  const florida = loadFloridaAuthorityManifest();
  const illinois = loadIllinoisAuthorityManifest();
  const newYork = loadNewYorkAuthorityManifest();
  const ohio = loadOhioAuthorityManifest();
  const pennsylvania = loadPennsylvaniaAuthorityManifest();
  const southCarolina = loadSouthCarolinaAuthorityManifest();
  const texas = loadTexasAuthorityManifest();
  const georgia = loadGeorgiaAuthorityManifest();

  return [
    buildManifestInput(
      "FL",
      florida.source,
      florida.generatedAt,
      florida.catalogRecords,
      buildFloridaSourceDatabaseSeed(florida),
    ),
    buildManifestInput(
      "GA",
      georgia.source,
      georgia.generatedAt,
      georgia.catalogRecords,
      buildGeorgiaSourceDatabaseSeed(georgia),
      // Georgia's API title metadata is not an official section-text response.
      0,
    ),
    buildManifestInput(
      "IL",
      illinois.source,
      illinois.generatedAt,
      illinois.catalogRecords,
      buildIllinoisSourceDatabaseSeed(illinois),
    ),
    buildManifestInput(
      "NY",
      newYork.source,
      newYork.generatedAt,
      newYork.catalogRecords,
      buildNewYorkSourceDatabaseSeed(newYork),
    ),
    buildManifestInput(
      "OH",
      ohio.source,
      ohio.generatedAt,
      ohio.catalogRecords,
      buildOhioSourceDatabaseSeed(ohio),
    ),
    buildManifestInput(
      "PA",
      pennsylvania.source,
      pennsylvania.generatedAt,
      pennsylvania.catalogRecords,
      buildPennsylvaniaSourceDatabaseSeed(pennsylvania),
    ),
    buildManifestInput(
      "SC",
      southCarolina.source,
      southCarolina.generatedAt,
      southCarolina.catalogRecords,
      buildSouthCarolinaSourceDatabaseSeed(southCarolina),
    ),
    buildManifestInput(
      "TX",
      texas.source,
      texas.generatedAt,
      texas.catalogRecords,
      buildTexasSourceDatabaseSeed(texas),
    ),
  ];
}

function buildCaliforniaInput(): CoverageInput {
  const seed = buildCaliforniaSourceDatabaseSeed(
    new Date("2026-08-29T00:00:00.000Z"),
  );
  const selectableById = new Map(
    seed.catalogRecords.map((record) => [record.chargeId, record]),
  );
  const records: CoverageCatalogRecord[] = CALIFORNIA_CANONICAL_RECORDS.map((record) =>
    selectableById.get(record.canonicalId) ?? {
      disposition: "require_exact_reselection",
      dispositionReason: "Canonical California record is withheld by the release boundary.",
      provisions: [],
      apiStatus: "withheld",
    },
  );

  return {
    jurisdiction: "CA",
    source: "California Legislative Information and Judicial Council committed authority manifest",
    manifestGeneratedAt: seed.generatedAt,
    records,
    seed,
    rowsWithOfficialResponse: CALIFORNIA_CANONICAL_RECORDS.filter(
      (record) => record.sources.length > 0,
    ).length,
  };
}

function buildReportRow(input: CoverageInput): PublicSourceCoverageReportRow {
  const catalogRows = input.records.length;
  const selectableRows = input.seed.selectableChargeIds.length;
  const withheldRows = input.records.filter((record) => !isSelectable(record)).length;
  const rowsWithExplicitWithheldReason = input.records.filter(
    (record) => !isSelectable(record) && record.dispositionReason.trim().length > 0,
  ).length;
  const catalogAccountingRate =
    catalogRows === 0 ? 0 : (selectableRows + withheldRows) / catalogRows;
  const officialResponseRate =
    catalogRows === 0 ? 0 : input.rowsWithOfficialResponse / catalogRows;
  const publishableRate = catalogRows === 0 ? 0 : selectableRows / catalogRows;
  const blocker = PUBLIC_SOURCE_ACCESS_BLOCKERS[input.jurisdiction] ?? null;
  const meetsTarget = isPublicSourceCoverageTargetMet({
    catalogAccountingRate,
    officialResponseRate,
    withheldRows,
    rowsWithExplicitWithheldReason,
  });
  const status: PublicSourceCoverageStatus = meetsTarget
    ? "meets_target"
    : blocker && rowsWithExplicitWithheldReason === withheldRows
      ? "blocked"
      : "below_target";

  return {
    jurisdiction: input.jurisdiction,
    source: input.source,
    manifestGeneratedAt: input.manifestGeneratedAt.toISOString(),
    catalogRows,
    rowsWithOfficialResponse: input.rowsWithOfficialResponse,
    selectableRows,
    withheldRows,
    rowsWithExplicitWithheldReason,
    sources: input.seed.sources.length,
    snapshots: input.seed.snapshots.length,
    links: input.seed.links.length,
    catalogAccountingRate,
    officialResponseRate,
    publishableRate,
    status,
    blocker,
  };
}

export function buildPublicSourceCoverageReport(): PublicSourceCoverageReport {
  const inputs = [buildCaliforniaInput(), ...buildCoverageInputs()];
  const jurisdictions = CURRENT_PUBLIC_SOURCE_JURISDICTIONS.map((jurisdiction) => {
    const input = inputs.find((candidate) => candidate.jurisdiction === jurisdiction);
    if (!input) throw new Error(`Missing public-source coverage input for ${jurisdiction}`);
    return buildReportRow(input);
  });
  return {
    target: HIGH_PUBLIC_SOURCE_COVERAGE_TARGET,
    jurisdictions,
    belowTargetJurisdictions: jurisdictions
      .filter((row) => row.status !== "meets_target")
      .map((row) => row.jurisdiction),
  };
}