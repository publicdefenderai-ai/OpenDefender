/**
 * Import North Carolina catalog citations from ncleg.gov. The committed
 * manifest is later seeded without network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildNorthCarolinaManifestRecord,
  buildNorthCarolinaSourceUrl,
  matchesNorthCarolinaCatalogTitle,
  parseNorthCarolinaCitation,
  type NorthCarolinaAuthorityManifest,
  type NorthCarolinaAuditFinding,
  type NorthCarolinaAuditFindingCode,
  type NorthCarolinaManifestAudit,
  type NorthCarolinaManifestRecord,
  type NorthCarolinaReferenceAudit,
  type NorthCarolinaSourceAudit,
  type NorthCarolinaSourceDocument,
} from "../../server/data/north-carolina-source-database-seed";
import { loadNorthCarolinaAuthorityManifest } from "../../server/data/north-carolina-manifest-loader";

const RATE_LIMIT_MS = 250;
const MAX_RETRIES = 3;
const FINDING_CODES: NorthCarolinaAuditFindingCode[] = [
  "official_source_verified",
  "citation_not_parseable",
  "catalog_code_mismatch",
  "official_fetch_failure",
  "section_not_found",
  "content_missing",
  "history_missing",
  "subdivision_not_found",
  "official_title_mismatch",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FetchResult =
  | { html: string }
  | { error: string; failureKind: "transport" | "official-page" };

async function fetchOfficial(
  url: string,
  fetchImpl: typeof fetch,
  retryDelayMs: number,
): Promise<FetchResult> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "OpenDefender-NorthCarolinaAuthorityImporter/1.0",
          Accept: "text/html, */*",
        },
      });
      if (response.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      if (!response.ok) {
        return { error: `HTTP ${response.status}`, failureKind: "official-page" };
      }
      return { html: await response.text() };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      return {
        error: error instanceof Error ? error.message : String(error),
        failureKind: "transport",
      };
    }
  }
  return { error: "North Carolina source request exhausted retries", failureKind: "transport" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|span|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&sect;/gi, "§")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sectionMarker(section: string): RegExp {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `&sect;\\s*${escaped}\\.\\s*([\\s\\S]*?)</(?:span|strong|b|p)>`,
    "i",
  );
}

function historyEvidence(text: string): boolean {
  // NC pages append the codification history as a final parenthetical, e.g.
  // "(1893, c. 85; ...; 2023-123, s. 2(a).)" or "(4 Hen. VII, s. 13; ...)".
  return /\([\s\S]{0,5000}\)\s*$/i.test(text) ||
    /\b(?:history|effective)\s*:/i.test(text);
}

export interface NorthCarolinaDocumentInspection {
  document: NorthCarolinaSourceDocument | null;
  sectionExtractionStatus: "complete" | "section_not_found" | "incomplete";
  officialTitle: string | null;
  historyEvidence: boolean;
  contentEvidence: boolean;
  contentHash: string | null;
  findings: NorthCarolinaAuditFinding[];
}

type NorthCarolinaNotAttemptedInspection = {
  document: null;
  sectionExtractionStatus: "not_attempted";
  officialTitle: null;
  historyEvidence: false;
  contentEvidence: false;
  contentHash: null;
  findings: NorthCarolinaAuditFinding[];
};

export function inspectNorthCarolinaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): NorthCarolinaDocumentInspection {
  const match = sectionMarker(section).exec(html);
  const reference = `${section}${subdivision ?? ""}`;
  if (!match) {
    return {
      document: null,
      sectionExtractionStatus: "section_not_found",
      officialTitle: null,
      historyEvidence: false,
      contentEvidence: false,
      contentHash: null,
      findings: [{
        code: "section_not_found",
        classification: "mechanical",
        message: `The official North Carolina page did not contain section ${section}.`,
        reference,
      }],
    };
  }

  const title = decodeHtml(match[1])
    .replace(/\s+/g, " ")
    .replace(/\.$/, "")
    .trim();
  const body = decodeHtml(html);
  const sectionStart = body.search(new RegExp(`§\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.`, "i"));
  const text = sectionStart >= 0 ? body.slice(sectionStart).trim() : body;
  const content = text.replace(/^§\s*[^.]+\.\s*[^(\n]+/, "").trim();
  const contentEvidence = content.length > 0;
  const hasHistory = historyEvidence(text);
  const subdivisionEvidence = !subdivision ||
    subdivisionParts(subdivision).every((part) =>
      new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text));
  const findings: NorthCarolinaAuditFinding[] = [];
  if (!title || !contentEvidence) {
    findings.push({
      code: "content_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but its official title or statutory content could not be extracted.`,
      reference,
    });
  }
  if (title && contentEvidence && !hasHistory) {
    findings.push({
      code: "history_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but no North Carolina codification history was extracted.`,
      reference,
    });
  }
  if (subdivision && title && contentEvidence && !subdivisionEvidence) {
    findings.push({
      code: "subdivision_not_found",
      classification: "mechanical",
      message: `The requested subdivision ${subdivision} was not found in the complete official section text.`,
      reference,
    });
  }
  const complete = Boolean(title && contentEvidence && hasHistory && subdivisionEvidence);
  if (complete) {
    findings.push({
      code: "official_source_verified",
      classification: "success",
      message: "Official North Carolina source was retrieved with complete section and codification-history evidence.",
      reference,
    });
  }
  return {
    document: complete
      ? {
          section,
          title,
          text,
          sourceUrl,
          retrievedAt,
          effectiveDateStart: null,
        }
      : null,
    sectionExtractionStatus: complete ? "complete" : "incomplete",
    officialTitle: title || null,
    historyEvidence: hasHistory,
    contentEvidence,
    contentHash: contentEvidence ? createHash("sha256").update(text).digest("hex") : null,
    findings,
  };
}

function subdivisionParts(value: string): string[] {
  return [...value.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
    .map((match) => (match[1] ?? match[2]).toLowerCase());
}

function buildAudit(records: NorthCarolinaManifestRecord[]): NorthCarolinaManifestAudit {
  const findings = records.flatMap((record) => record.auditFindings);
  const references = records.flatMap((record) => record.sourceAudit.references);
  return {
    schemaVersion: 1,
    catalogRowCount: records.length,
    parsedReferenceCount: references.length,
    successfulOfficialRetrievals: references.filter((reference) => reference.fetchStatus === "success").length,
    completeSectionExtractions: references.filter(
      (reference) => reference.sectionExtractionStatus === "complete",
    ).length,
    findingCounts: Object.fromEntries(FINDING_CODES.map((code) => [
      code,
      findings.filter((finding) => finding.code === code).length,
    ])) as Record<NorthCarolinaAuditFindingCode, number>,
  };
}

function inventory(records: NorthCarolinaManifestRecord[]): string {
  return JSON.stringify(records.map((record) => ({
    chargeId: record.chargeId,
    catalogLabel: record.catalogLabel,
    catalogCode: record.catalogCode,
    catalogCategory: record.catalogCategory,
    citation: record.sourceAudit.citation,
    references: record.sourceAudit.references.map((reference) => ({
      section: reference.section,
      subdivision: reference.subdivision,
      citation: reference.citation,
      officialUrl: reference.officialUrl,
    })),
  })));
}

export function assertNorthCarolinaManifestIsCurrent(
  manifest: NorthCarolinaAuthorityManifest,
): void {
  const expected = criminalCharges
    .filter((charge) => charge.jurisdiction === "NC")
    .map((charge) => {
      const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
      return {
        chargeId: charge.id,
        catalogLabel: charge.name,
        catalogCode: charge.code,
        catalogCategory: charge.category,
        sourceAudit: {
          citation,
          references: parseNorthCarolinaCitation(citation).map((reference) => ({
            section: reference.section,
            subdivision: reference.subdivision,
            citation: `N.C. Gen. Stat. § ${reference.section}${reference.subdivision ?? ""}`,
            officialUrl: buildNorthCarolinaSourceUrl(reference.section),
          })),
        },
      };
    });
  if (inventory(manifest.catalogRecords) !== inventory(expected as NorthCarolinaManifestRecord[])) {
    throw new Error(
      "North Carolina authority manifest is stale. Regenerate it with " +
      "`npx tsx scripts/data-review/import-north-carolina-source-database.ts --check`.",
    );
  }
}

export interface NorthCarolinaManifestRefreshOptions {
  importedAt?: Date;
  outputPath?: string;
  fetchImpl?: typeof fetch;
  rateLimitMs?: number;
  retryDelayMs?: number;
}

export async function refreshNorthCarolinaManifest(
  options: NorthCarolinaManifestRefreshOptions = {},
): Promise<NorthCarolinaManifestRefreshSummary> {
  const importedAt = options.importedAt ?? new Date();
  const outputPath = options.outputPath ??
    path.resolve(process.cwd(), "scripts/data-review/output/nc-source-manifest.json");
  const fetchImpl = options.fetchImpl ?? fetch;
  const referenceCache = new Map<string, {
    result: FetchResult;
    inspection: NorthCarolinaDocumentInspection | NorthCarolinaNotAttemptedInspection;
  }>();
  const rateLimitMs = options.rateLimitMs ?? RATE_LIMIT_MS;
  const retryDelayMs = options.retryDelayMs ?? 1000;
  let requests = 0;
  let transportFailures = 0;
  let officialPageFailures = 0;
  let contentContractFailures = 0;
  const records: NorthCarolinaManifestRecord[] = [];

  for (const charge of criminalCharges.filter((candidate) => candidate.jurisdiction === "NC")) {
    const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
    const references = parseNorthCarolinaCitation(citation);
    const documents: NorthCarolinaSourceDocument[] = [];
    const audits: NorthCarolinaReferenceAudit[] = [];
    let error: string | undefined;
    for (const reference of references) {
      const key = `${reference.section}|${reference.subdivision ?? ""}`;
      let cached = referenceCache.get(key);
      const url = buildNorthCarolinaSourceUrl(reference.section);
      if (!cached) {
        const result = await fetchOfficial(url, fetchImpl, retryDelayMs);
        requests++;
        if ("error" in result) {
          if (result.failureKind === "transport") transportFailures++;
          else officialPageFailures++;
        }
        const inspection: NorthCarolinaDocumentInspection | NorthCarolinaNotAttemptedInspection = "html" in result
          ? inspectNorthCarolinaDocument(result.html, reference.section, url, importedAt, reference.subdivision)
          : {
              document: null,
              sectionExtractionStatus: "not_attempted" as const,
              officialTitle: null,
              historyEvidence: false,
              contentEvidence: false,
              contentHash: null,
              findings: [] as NorthCarolinaAuditFinding[],
            };
        const entry = { result, inspection };
        cached = entry;
        referenceCache.set(key, entry);
        if (!inspection.document) {
          error = "error" in result
            ? `Official North Carolina source unavailable: ${result.error}`
            : inspection.findings[0]?.message ?? "The official North Carolina section was incomplete.";
          if ("html" in result) contentContractFailures++;
        }
        await sleep(rateLimitMs);
      }
      if (!cached) {
        throw new Error(`North Carolina source cache failed for ${key}`);
      }
      const findings = [...cached.inspection.findings];
      if ("error" in cached.result) {
        findings.unshift({
          code: "official_fetch_failure",
          classification: "mechanical",
          message: `Official North Carolina source request failed: ${cached.result.error}.`,
          reference: `${reference.section}${reference.subdivision ?? ""}`,
        });
      }
      if (cached.inspection.document &&
          !matchesNorthCarolinaCatalogTitle(
            charge,
            cached.inspection.document.title,
            reference,
          )) {
        findings.push({
          code: "official_title_mismatch",
          classification: "structural",
          message: `The official North Carolina title "${cached.inspection.document.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
          reference: `${reference.section}${reference.subdivision ?? ""}`,
        });
      }
      audits.push({
        section: reference.section,
        subdivision: reference.subdivision,
        citation: `N.C. Gen. Stat. § ${reference.section}${reference.subdivision ?? ""}`,
        officialUrl: url,
        fetchStatus: "error" in cached.result
          ? cached.result.failureKind === "transport" ? "transport_failure" : "official_page_failure"
          : "success",
        fetchError: "error" in cached.result ? cached.result.error : null,
        retrievedAt: "html" in cached.result ? importedAt.toISOString() : null,
        sectionExtractionStatus: cached.inspection.sectionExtractionStatus,
        officialTitle: cached.inspection.officialTitle,
        historyEvidence: cached.inspection.historyEvidence,
        contentEvidence: cached.inspection.contentEvidence,
        contentHash: cached.inspection.contentHash,
        findings,
      });
      if (cached.inspection.document) documents.push(cached.inspection.document);
    }
    const sourceAudit: NorthCarolinaSourceAudit = {
      citation,
      references: audits,
      findings: audits.flatMap((audit) => audit.findings),
    };
    records.push(buildNorthCarolinaManifestRecord(
      charge,
      documents,
      importedAt,
      sourceAudit,
      error,
    ));
  }

  if (transportFailures > 0 && officialPageFailures === 0 && contentContractFailures === 0) {
    throw new Error(
      `North Carolina source transport outage (${transportFailures} requests); existing manifest was not replaced.`,
    );
  }
  const manifest: NorthCarolinaAuthorityManifest = {
    jurisdiction: "NC",
    generatedAt: importedAt,
    source: "North Carolina General Statutes — ncleg.gov",
    catalogRecords: records,
    audit: buildAudit(records),
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const selectable = records.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename");
  const summary = {
    outputPath,
    catalogRecords: records.length,
    retained: selectable.length,
    withheld: records.length - selectable.length,
    sources: new Set(records.flatMap((record) =>
      record.provisions.map((provision) => provision.sourceKey))).size,
    snapshots: records.reduce((sum, record) => sum + record.provisions.length, 0),
    requests,
    transportFailures,
    officialPageFailures,
    contentContractFailures,
    wroteManifest: true,
  };
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

export interface NorthCarolinaManifestRefreshSummary {
  outputPath: string;
  catalogRecords: number;
  retained: number;
  withheld: number;
  sources: number;
  snapshots: number;
  requests: number;
  transportFailures: number;
  officialPageFailures: number;
  contentContractFailures: number;
  wroteManifest: boolean;
}

async function main(): Promise<void> {
  if (process.argv.includes("--check")) {
    const manifest = loadNorthCarolinaAuthorityManifest();
    assertNorthCarolinaManifestIsCurrent(manifest);
    console.log(`North Carolina authority manifest is current: ${manifest.catalogRecords.length} rows`);
    return;
  }
  await refreshNorthCarolinaManifest();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("North Carolina authority import failed:", error);
    process.exitCode = 1;
  });
}