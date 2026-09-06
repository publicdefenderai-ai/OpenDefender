import {
  CALIFORNIA_CANONICAL_RECORDS,
} from "@shared/california-authority";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
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
  loadNorthCarolinaAuthorityManifest,
} from "./north-carolina-manifest-loader";
import {
  buildNorthCarolinaSourceDatabaseSeed,
} from "./north-carolina-source-database-seed";
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
import {
  CURRENT_PUBLIC_SOURCE_JURISDICTIONS,
  type CurrentPublicSourceJurisdiction,
} from "@shared/public-source-coverage";
export {
  CURRENT_PUBLIC_SOURCE_JURISDICTIONS,
} from "@shared/public-source-coverage";
export type {
  CurrentPublicSourceJurisdiction,
} from "@shared/public-source-coverage";
/**
 * "High public-source coverage" measures whether the public-source import
 * reached the catalog rows, not whether every row is safe to publish under the
 * stricter exact-identity boundary. A source response can be recorded as a
 * withheld row when the official material is available but the catalog
 * identity is ambiguous.
 */
export const HIGH_PUBLIC_SOURCE_COVERAGE_TARGET = Object.freeze({
  catalogAccountingRate: 1,
  officialResponseRate: 0.9,
} as const);

export type PublicSourceCoverageStatus =
  | "meets_target"
  | "blocked"
  | "below_target";

export type PublicSourceCoverageGapKind =
  | "source_access"
  | "missing_import"
  | "stale_record"
  | "incomplete_text"
  | "technical_seed_failure"
  | "identity_review";

const PUBLIC_SOURCE_COVERAGE_GAP_KINDS: readonly PublicSourceCoverageGapKind[] = [
  "source_access",
  "missing_import",
  "stale_record",
  "incomplete_text",
  "technical_seed_failure",
  "identity_review",
];

export type OfficialSourceAvailability =
  | "available"
  | "partial"
  | "unavailable";

export interface PublicSourceAccessBlocker {
  kind: "source_access";
  source: string;
  summary: string;
  evidence: string;
  nextStep: string;
}

export interface PublicSourceCoverageGap {
  kind: PublicSourceCoverageGapKind;
  rows: number;
  chargeIds: string[];
  summary: string;
  nextStep: string;
}

export interface PublicSourceCoverageTarget {
  jurisdiction: CurrentPublicSourceJurisdiction;
  rows: number;
  coveragePercentage: number;
  officialResponsePercentage: number;
  kind: PublicSourceCoverageGapKind;
  reason: string;
  nextStep: string;
}

/**
 * These are source-contract blockers, not legal-review decisions. They remain
 * explicit so a low response rate cannot be mistaken for a completed
 * jurisdiction or silently converted into inferred authority.
 */
export const PUBLIC_SOURCE_ACCESS_BLOCKERS: Readonly<
  Partial<Record<CurrentPublicSourceJurisdiction, Readonly<PublicSourceAccessBlocker>>>
> = Object.freeze({
  GA: Object.freeze({
    kind: "source_access",
    source: "Georgia General Assembly API and public Lexis access page",
    summary:
      "The official API returns title metadata only; official section results are human-accessible through Lexis, but complete-document automation is restricted and required identity/currentness evidence is unavailable to the importer.",
    evidence:
      "The official georgia-code/titles API requires a site-issued bearer token and returns title identifiers/names without section text. The Lexis TOC lookup renders official citations and snippets, but unattended complete-document requests require browser cookie/human-verification state, while result rows omit pddocid/pddocfullpath and History currentness evidence.",
    nextStep:
      "Obtain an automatable complete-document contract from the Georgia Code Revision Commission; use Justia and public mirrors for discovery only, never selectable authority.",
  }),
  PA: Object.freeze({
    kind: "source_access",
    source: "Pennsylvania General Assembly consolidated-statute source",
    summary:
      "The official source contract does not currently return every requested section needed by the catalog inventory.",
    evidence:
      "The committed Pennsylvania manifest records unavailable and placeholder rows rather than inferring authority from a secondary source.",
    nextStep:
      "Re-run the official PA source probe after the missing section routes or consolidated-statute source contract are restored, then regenerate the manifest.",
  }),
} as const);

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
  /** Selectable rows / catalog rows, expressed as a percentage. */
  coveragePercentage: number;
  /** Catalog rows with an official source response, expressed as a percentage. */
  officialResponsePercentage: number;
  /** Selectable rows / catalog rows, expressed as a percentage. */
  selectableCoveragePercentage: number;
  officialSourceAvailability: OfficialSourceAvailability;
  gapBreakdown: PublicSourceCoverageGap[];
  gapCounts: Record<PublicSourceCoverageGapKind, number>;
  staleRows: number;
  manifestPath: string | null;
  seedScriptPath: string;
  status: PublicSourceCoverageStatus;
  blocker: PublicSourceAccessBlocker | null;
}

export interface PublicSourceCoverageReport {
  target: typeof HIGH_PUBLIC_SOURCE_COVERAGE_TARGET;
  jurisdictions: PublicSourceCoverageReportRow[];
  belowTargetJurisdictions: CurrentPublicSourceJurisdiction[];
  nextHighestValueCoverageTargets: PublicSourceCoverageTarget[];
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
  chargeId: string;
  disposition: "retain" | "exact_alias_rename" | "require_exact_reselection" | "remove";
  dispositionReason: string;
  provisions: CoverageProvision[];
  apiStatus: string;
}

interface CoverageProvision {
  retrievedAt?: Date | string | null;
}

interface CoverageSeedCounts {
  sources: readonly unknown[];
  snapshots: readonly unknown[];
  links: readonly unknown[];
  catalogRecords: readonly { chargeId: string }[];
  selectableChargeIds: readonly string[];
}

interface CoverageInput {
  jurisdiction: CurrentPublicSourceJurisdiction;
  source: string;
  manifestGeneratedAt: Date;
  records: CoverageCatalogRecord[];
  seed: CoverageSeedCounts;
  rowsWithOfficialResponse: number;
  officialResponseIds: ReadonlySet<string>;
  expectedManifestPath: string | null;
  expectedSeedScriptPath: string;
}

export const COVERAGE_REGISTRY = Object.freeze({
  CA: Object.freeze({
    manifestPath: null,
    seedScriptPath: "scripts/data-review/seed-california-source-database.ts",
  }),
  FL: Object.freeze({
    manifestPath: "scripts/data-review/output/fl-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-florida-source-database.ts",
  }),
  GA: Object.freeze({
    manifestPath: "scripts/data-review/output/ga-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-georgia-source-database.ts",
  }),
  IL: Object.freeze({
    manifestPath: "scripts/data-review/output/il-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-illinois-source-database.ts",
  }),
  NY: Object.freeze({
    manifestPath: "scripts/data-review/output/ny-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-new-york-source-database.ts",
  }),
  OH: Object.freeze({
    manifestPath: "scripts/data-review/output/oh-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-ohio-source-database.ts",
  }),
  NC: Object.freeze({
    manifestPath: "scripts/data-review/output/nc-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-north-carolina-source-database.ts",
  }),
  PA: Object.freeze({
    manifestPath: "scripts/data-review/output/pa-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-pennsylvania-source-database.ts",
  }),
  SC: Object.freeze({
    manifestPath: "scripts/data-review/output/sc-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-south-carolina-source-database.ts",
  }),
  TX: Object.freeze({
    manifestPath: "scripts/data-review/output/tx-source-manifest.json",
    seedScriptPath: "scripts/data-review/seed-texas-source-database.ts",
  }),
} as const satisfies Record<
  CurrentPublicSourceJurisdiction,
  { manifestPath: string | null; seedScriptPath: string }
>);

const STALE_RECORD_MAX_AGE_DAYS = 180;

const GAP_DETAILS: Record<
  PublicSourceCoverageGapKind,
  { summary: string; nextStep: string }
> = {
  source_access: {
    summary: "The official source did not provide a usable response for this row.",
    nextStep: "Restore the official source contract and re-run the source importer.",
  },
  missing_import: {
    summary: "The row is in the catalog but has no imported source record.",
    nextStep: "Add the row to the committed manifest and repeat seed validation.",
  },
  stale_record: {
    summary: "The source record is older than the current freshness window.",
    nextStep: "Re-fetch the official source and regenerate the manifest.",
  },
  incomplete_text: {
    summary: "An official response does not contain complete text for the requested provision.",
    nextStep: "Re-fetch the complete official section before considering publication.",
  },
  technical_seed_failure: {
    summary: "The source import or seed recorded a technical error for this row.",
    nextStep: "Resolve the importer or seed error, then regenerate the committed manifest.",
  },
  identity_review: {
    summary: "Source material exists, but the catalog identity is not exact enough to publish.",
    nextStep: "Review the exact section, subdivision, and catalog mapping before publication.",
  },
};

function isSelectable(record: CoverageCatalogRecord): boolean {
  return (
    (record.disposition === "retain" ||
      record.disposition === "exact_alias_rename") &&
    record.provisions.length > 0
  );
}

function registryFor(jurisdiction: CurrentPublicSourceJurisdiction) {
  const entry = COVERAGE_REGISTRY[jurisdiction];
  if (!entry) {
    throw new Error(`Missing public-source coverage registry entry for ${jurisdiction}`);
  }
  return entry;
}

/**
 * Keep the report's scope honest. A new jurisdiction must be added to the
 * registry and have both its committed manifest and deterministic seed
 * command before it can silently enter the coverage matrix.
 */
export function assertPublicSourceCoverageRegistry(): void {
  const configured = Object.keys(COVERAGE_REGISTRY).sort();
  const expected = [...CURRENT_PUBLIC_SOURCE_JURISDICTIONS].sort();
  if (configured.join(",") !== expected.join(",")) {
    throw new Error(
      `Public-source coverage registry does not match current jurisdictions (expected ${expected.join(",")}, got ${configured.join(",")})`,
    );
  }

  for (const jurisdiction of CURRENT_PUBLIC_SOURCE_JURISDICTIONS) {
    const entry = registryFor(jurisdiction);
    if (entry.manifestPath && !existsSync(resolve(process.cwd(), entry.manifestPath))) {
      throw new Error(
        `Missing committed ${jurisdiction} public-source manifest: ${entry.manifestPath}`,
      );
    }
    if (!existsSync(resolve(process.cwd(), entry.seedScriptPath))) {
      throw new Error(
        `Missing ${jurisdiction} public-source seed command: ${entry.seedScriptPath}`,
      );
    }
  }
}

function assertSeedMatchesManifest(input: CoverageInput): void {
  const expectedSelectableIds = input.records
    .filter(isSelectable)
    .map((record) => record.chargeId);
  const actualSelectableIds = [...input.seed.selectableChargeIds];
  const actualSelectableSet = new Set(actualSelectableIds);
  if (
    actualSelectableSet.size !== actualSelectableIds.length ||
    actualSelectableSet.size !== expectedSelectableIds.length ||
    expectedSelectableIds.some((id) => !actualSelectableSet.has(id))
  ) {
    throw new Error(
      `Technical seed failure for ${input.jurisdiction}: seed selectable rows do not match the committed manifest`,
    );
  }

  const seedCatalogIds = input.seed.catalogRecords.map((record) => record.chargeId);
  const manifestIds = input.records.map((record) => record.chargeId);
  const seedCatalogSet = new Set(seedCatalogIds);
  if (
    seedCatalogSet.size !== seedCatalogIds.length ||
    seedCatalogSet.size !== manifestIds.length ||
    manifestIds.some((id) => !seedCatalogSet.has(id))
  ) {
    // California intentionally seeds only its publishable reference rows; its
    // withheld legacy inventory is kept in the typed canonical source file.
    if (input.jurisdiction !== "CA") {
      throw new Error(
        `Technical seed failure for ${input.jurisdiction}: seed catalog rows do not match the committed manifest`,
      );
    }
  }
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
  officialResponseIds = new Set(
    records
      .filter((record) => hasOfficialResponse(record))
      .map((record) => record.chargeId),
  ),
): CoverageInput {
  const registry = registryFor(jurisdiction);
  return {
    jurisdiction,
    source,
    manifestGeneratedAt,
    records,
    seed,
    rowsWithOfficialResponse,
    officialResponseIds,
    expectedManifestPath: registry.manifestPath,
    expectedSeedScriptPath: registry.seedScriptPath,
  };
}

function buildCoverageInputs(): CoverageInput[] {
  const florida = loadFloridaAuthorityManifest();
  const illinois = loadIllinoisAuthorityManifest();
  const newYork = loadNewYorkAuthorityManifest();
  const ohio = loadOhioAuthorityManifest();
  const northCarolina = loadNorthCarolinaAuthorityManifest();
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
      // Dynamic Lexis page metadata is not a repeatable official section-text response.
      0,
      new Set(),
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
      "NC",
      northCarolina.source,
      northCarolina.generatedAt,
      northCarolina.catalogRecords,
      buildNorthCarolinaSourceDatabaseSeed(northCarolina),
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
      chargeId: record.canonicalId,
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
    officialResponseIds: new Set(
      CALIFORNIA_CANONICAL_RECORDS.filter((record) => record.sources.length > 0)
        .map((record) => record.canonicalId),
    ),
    expectedManifestPath: null,
    expectedSeedScriptPath: registryFor("CA").seedScriptPath,
  };
}

function hasOfficialResponse(record: CoverageCatalogRecord): boolean {
  return record.apiStatus === "verified" || record.apiStatus === "local_ordinance";
}

function isStale(record: CoverageCatalogRecord, now = new Date()): boolean {
  const retrievedAt = record.provisions
    .map((provision) => provision.retrievedAt)
    .filter((value): value is Date | string => Boolean(value))
    .map((value) => (value instanceof Date ? value : new Date(value)))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  if (!retrievedAt) return false;
  const maxAgeMs = STALE_RECORD_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return now.getTime() - retrievedAt.getTime() > maxAgeMs;
}

function classifyGap(
  record: CoverageCatalogRecord,
  input: CoverageInput,
): PublicSourceCoverageGapKind {
  if (
    !input.officialResponseIds.has(record.chargeId) &&
    PUBLIC_SOURCE_ACCESS_BLOCKERS[input.jurisdiction]
  ) {
    return "source_access";
  }
  if (record.apiStatus === "placeholder" || record.apiStatus === "withheld") {
    return "missing_import";
  }
  if (record.apiStatus === "api_error") {
    return "technical_seed_failure";
  }
  if (
    /complete|incomplete|section text|unavailable|could not be verified/i.test(
      record.dispositionReason,
    )
  ) {
    return "incomplete_text";
  }
  return "identity_review";
}

function copyAccessBlocker(
  blocker: Readonly<PublicSourceAccessBlocker> | undefined,
): PublicSourceAccessBlocker | null {
  if (!blocker) return null;
  return {
    kind: blocker.kind,
    source: blocker.source,
    summary: blocker.summary,
    evidence: blocker.evidence,
    nextStep: blocker.nextStep,
  };
}

function buildGapBreakdown(
  input: CoverageInput,
  staleIds: string[],
): PublicSourceCoverageGap[] {
  const idsByKind = new Map<PublicSourceCoverageGapKind, string[]>();
  for (const record of input.records) {
    if (!isSelectable(record)) {
      const kind = classifyGap(record, input);
      const ids = idsByKind.get(kind) ?? [];
      ids.push(record.chargeId);
      idsByKind.set(kind, ids);
    }
  }
  if (staleIds.length > 0) idsByKind.set("stale_record", staleIds);

  return PUBLIC_SOURCE_COVERAGE_GAP_KINDS.map((kind) => ({
    kind,
    rows: idsByKind.get(kind)?.length ?? 0,
    // Manifests are arrays today, but a report must remain reproducible if an
    // importer changes its record insertion order.
    chargeIds: [...(idsByKind.get(kind) ?? [])].sort(),
    summary: GAP_DETAILS[kind].summary,
    nextStep: GAP_DETAILS[kind].nextStep,
  }));
}

function buildReportRow(input: CoverageInput): PublicSourceCoverageReportRow {
  assertSeedMatchesManifest(input);
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
  const coveragePercentage = publishableRate * 100;
  const officialResponsePercentage = officialResponseRate * 100;
  const staleIds = input.records
    .filter((record) => isStale(record))
    .map((record) => record.chargeId);
  const gapBreakdown = buildGapBreakdown(input, staleIds);
  const gapCounts = Object.fromEntries(
    gapBreakdown.map((gap) => [gap.kind, gap.rows]),
  ) as Record<PublicSourceCoverageGapKind, number>;
  const blocker = copyAccessBlocker(
    PUBLIC_SOURCE_ACCESS_BLOCKERS[input.jurisdiction],
  );
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
    coveragePercentage,
    officialResponsePercentage,
    selectableCoveragePercentage: coveragePercentage,
    officialSourceAvailability:
      input.rowsWithOfficialResponse === 0
        ? "unavailable"
        : input.rowsWithOfficialResponse === catalogRows
          ? "available"
          : "partial",
    gapBreakdown,
    gapCounts,
    staleRows: staleIds.length,
    manifestPath: input.expectedManifestPath,
    seedScriptPath: input.expectedSeedScriptPath,
    status,
    blocker,
  };
}

function buildCoverageTargets(
  jurisdictions: PublicSourceCoverageReportRow[],
): PublicSourceCoverageTarget[] {
  return jurisdictions
    .filter((row) => row.withheldRows > 0)
    .map((row) => {
      const actionableGaps = row.gapBreakdown.filter(
        (gap) =>
          gap.kind !== "stale_record" &&
          gap.kind !== "source_access",
      );
      const primaryGap =
        row.blocker && row.officialSourceAvailability !== "available"
          ? row.gapBreakdown.find((gap) => gap.kind === "source_access")
          : [...actionableGaps].sort(
              (a, b) => b.rows - a.rows || a.kind.localeCompare(b.kind),
            )[0];
      const kind = primaryGap?.kind ?? (row.blocker ? "source_access" : "identity_review");
      return {
        jurisdiction: row.jurisdiction,
        rows: row.withheldRows,
        coveragePercentage: row.coveragePercentage,
        officialResponsePercentage: row.officialResponsePercentage,
        kind,
        reason: primaryGap?.summary ?? "Withheld rows need coverage work before expansion.",
        nextStep:
          row.blocker?.nextStep ??
          primaryGap?.nextStep ??
          "Review withheld rows and regenerate the coverage report.",
      };
    })
    .sort((a, b) => {
      const aBlocked = a.kind === "source_access" ? 1 : 0;
      const bBlocked = b.kind === "source_access" ? 1 : 0;
      return (
        bBlocked - aBlocked ||
        b.rows - a.rows ||
        a.coveragePercentage - b.coveragePercentage ||
        a.jurisdiction.localeCompare(b.jurisdiction)
      );
    });
}

export function buildPublicSourceCoverageReport(): PublicSourceCoverageReport {
  assertPublicSourceCoverageRegistry();
  const inputs = [buildCaliforniaInput(), ...buildCoverageInputs()];
  const jurisdictions = CURRENT_PUBLIC_SOURCE_JURISDICTIONS.map((jurisdiction) => {
    const input = inputs.find((candidate) => candidate.jurisdiction === jurisdiction);
    if (!input) throw new Error(`Missing public-source coverage input for ${jurisdiction}`);
    return buildReportRow(input);
  });
  return {
    // A fresh value prevents a caller mutating one report from changing a
    // later readiness result through this exported constant.
    target: {
      catalogAccountingRate: HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.catalogAccountingRate,
      officialResponseRate: HIGH_PUBLIC_SOURCE_COVERAGE_TARGET.officialResponseRate,
    },
    jurisdictions,
    belowTargetJurisdictions: jurisdictions
      .filter((row) => row.status !== "meets_target")
      .map((row) => row.jurisdiction),
    nextHighestValueCoverageTargets: buildCoverageTargets(jurisdictions),
  };
}