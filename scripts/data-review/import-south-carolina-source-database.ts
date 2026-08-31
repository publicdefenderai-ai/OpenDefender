/**
 * Import South Carolina catalog citations from the official Legislature
 * Code of Laws chapter pages. The committed manifest is later seeded without
 * network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildSouthCarolinaManifestRecord,
  buildSouthCarolinaSourceUrl,
  matchesSouthCarolinaCatalogTitle,
  parseSouthCarolinaCitation,
  type SouthCarolinaAuthorityManifest,
  type SouthCarolinaAuditFinding,
  type SouthCarolinaAuditFindingCode,
  type SouthCarolinaManifestRecord,
  type SouthCarolinaReferenceAudit,
  type SouthCarolinaSourceAudit,
  type SouthCarolinaSourceDocument,
} from "../../server/data/south-carolina-source-database-seed";

const RATE_LIMIT_MS = 700;
const MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SouthCarolinaChapterResult =
  | { html: string }
  | { error: string; failureKind: "transport" | "official-page" };

async function fetchChapter(
  url: string,
  fetchImpl: typeof fetch = fetch,
  retryDelayMs = 1000,
): Promise<SouthCarolinaChapterResult> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "OpenDefender-SouthCarolinaAuthorityImporter/1.0",
          Accept: "text/html, */*",
        },
      });
      if (response.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
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
  return {
    error: "South Carolina source request exhausted retries",
    failureKind: "transport",
  };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const EFFECTIVE_DATE_PATTERN =
  /\beff(?:ective)?\.?\s*(?:on\s+)?(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;
const MONTH_NAMES: Record<string, string> = {
  jan: "January", january: "January", feb: "February", february: "February",
  mar: "March", march: "March", apr: "April", april: "April", may: "May",
  jun: "June", june: "June", jul: "July", july: "July", aug: "August",
  august: "August", sep: "September", sept: "September", september: "September",
  oct: "October", october: "October", nov: "November", november: "November",
  dec: "December", december: "December",
};

const SECTION_MARKER_TAG =
  "(?:span|strong|b|p|div|h1|h2|h3|h4|h5|h6)";

function buildSouthCarolinaSectionMarker(section?: string): RegExp {
  const sectionPattern = section
    ? section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    : "\\d+-\\d+-\\d+";
  return new RegExp(
    `<${SECTION_MARKER_TAG}\\b[^>]*>\\s*SECTION\\s+${sectionPattern}\\.\\s*</${SECTION_MARKER_TAG}>`,
    section ? "i" : "gi",
  );
}

export function extractLatestSouthCarolinaEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(EFFECTIVE_DATE_PATTERN)]
    .map((match) => {
      const month = MONTH_NAMES[match[1].toLowerCase()];
      const day = Number(match[2]);
      const year = Number(match[3]);
      return {
        value: `${month} ${day}, ${year}`,
        time: Date.UTC(year, new Date(`${month} 1, 2000`).getUTCMonth(), day),
      };
    })
    .filter((date) => Number.isFinite(date.time))
    .sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

export function extractSouthCarolinaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): SouthCarolinaSourceDocument | null {
  return inspectSouthCarolinaDocument(html, section, sourceUrl, retrievedAt, subdivision).document;
}

export interface SouthCarolinaDocumentInspection {
  document: SouthCarolinaSourceDocument | null;
  sectionExtractionStatus: "complete" | "section_not_found" | "incomplete" | "not_attempted";
  officialTitle: string | null;
  historyEvidence: boolean;
  contentEvidence: boolean;
  contentHash: string | null;
  findings: SouthCarolinaAuditFinding[];
}

export function inspectSouthCarolinaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): SouthCarolinaDocumentInspection {
  const marker = buildSouthCarolinaSectionMarker(section);
  const match = marker.exec(html);
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
        message: `The official South Carolina chapter page did not contain section ${section}.`,
        reference,
      }],
    };
  }
  const nextMarker = buildSouthCarolinaSectionMarker();
  nextMarker.lastIndex = match.index + match[0].length;
  const next = nextMarker.exec(html);
  const rawBlock = html.slice(match.index + match[0].length, next?.index ?? html.length);
  const decoded = decodeHtml(rawBlock);
  const [titleLine, ...rest] = decoded.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = titleLine?.replace(/[.;\s]+$/, "").trim();
  const text = title && rest.length
    ? `SECTION ${section}. ${title}\n${rest.join("\n")}`.trim()
    : null;
  const historyEvidence = text !== null && /\bHISTORY:/i.test(text);
  const contentEvidence = rest.join("\n").replace(/\bHISTORY\s*:[\s\S]*$/i, "").trim().length > 0;
  const subdivisionParts = subdivision
    ? [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
      .map((item) => (item[1] ?? item[2]).toLowerCase())
    : [];
  const subdivisionEvidence = !subdivision
    ? true
    : subdivisionParts.length > 0 &&
      text !== null &&
      subdivisionParts.every((part) =>
        new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
      );
  const findings: SouthCarolinaAuditFinding[] = [];
  if (!title || !contentEvidence) {
    findings.push({
      code: "content_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but its official title or statutory content could not be extracted.`,
      reference,
    });
  }
  if (title && contentEvidence && !historyEvidence) {
    findings.push({
      code: "history_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but no HISTORY evidence was extracted from the official text.`,
      reference,
    });
  }
  if (subdivision && title && contentEvidence && !subdivisionEvidence) {
    findings.push({
      code: "subdivision_not_found",
      classification: "mechanical",
      message: `The requested subdivision ${subdivision} was not found in the extracted official section text.`,
      reference,
    });
  }
  const complete = Boolean(
    title &&
    text &&
    contentEvidence &&
    historyEvidence &&
    (!subdivision || subdivisionEvidence),
  );
  if (complete) {
    findings.push({
      code: "official_source_verified",
      classification: "success",
      message: "Official South Carolina source was retrieved with complete section and history/content evidence.",
      reference,
    });
  }
  const document = complete && title && text
    ? {
        section,
        title,
        text,
        sourceUrl,
        retrievedAt,
        effectiveDateStart: extractLatestSouthCarolinaEffectiveDate(text),
      }
    : null;
  return {
    document,
    sectionExtractionStatus: complete ? "complete" : "incomplete",
    officialTitle: title ?? null,
    historyEvidence,
    contentEvidence,
    contentHash: contentEvidence && text ? createHash("sha256").update(text).digest("hex") : null,
    findings,
  };
}

export interface SouthCarolinaManifestRefreshOptions {
  importedAt?: Date;
  outputPath?: string;
  fetchImpl?: typeof fetch;
  rateLimitMs?: number;
  retryDelayMs?: number;
}

export interface SouthCarolinaManifestRefreshAlert {
  type: "transport-outage";
  severity: "warning";
  failureKind: "transport";
  transportFailures: number;
  message: string;
  preservedSnapshot: {
    outputPath: string;
    generatedAt: string;
  } | null;
}

export interface SouthCarolinaManifestRefreshSummary {
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
  preservedManifest: boolean;
  alert: SouthCarolinaManifestRefreshAlert | null;
}

interface PreviousSouthCarolinaManifest {
  generatedAt: string;
  catalogRecords: unknown[];
}

function readPreviousSouthCarolinaManifest(
  outputPath: string,
): PreviousSouthCarolinaManifest | null {
  try {
    const raw = JSON.parse(fs.readFileSync(outputPath, "utf8")) as {
      generatedAt?: unknown;
      catalogRecords?: unknown;
    };
    if (
      typeof raw.generatedAt !== "string" ||
      raw.generatedAt.length === 0 ||
      !Array.isArray(raw.catalogRecords)
    ) {
      throw new Error("The existing South Carolina manifest is incomplete");
    }
    return {
      generatedAt: raw.generatedAt,
      catalogRecords: raw.catalogRecords,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new Error(
      `Cannot inspect the existing South Carolina manifest at ${outputPath}: ` +
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function refreshSouthCarolinaManifest(
  options: SouthCarolinaManifestRefreshOptions = {},
): Promise<SouthCarolinaManifestRefreshSummary> {
  const importedAt = options.importedAt ?? new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "SC");
  const chapterCache = new Map<string, SouthCarolinaChapterResult>();
  const documentCache = new Map<string, SouthCarolinaDocumentInspection>();
  const fetchImpl = options.fetchImpl ?? fetch;
  const rateLimitMs = options.rateLimitMs ?? RATE_LIMIT_MS;
  const retryDelayMs = options.retryDelayMs ?? 1000;
  let requests = 0;
  let transportFailures = 0;
  let officialPageFailures = 0;
  let contentContractFailures = 0;
  const records: SouthCarolinaManifestRecord[] = [];

  for (const charge of charges) {
    const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
    const references = parseSouthCarolinaCitation(citation);
    let error: string | undefined;
    const documents: SouthCarolinaSourceDocument[] = [];
    const referenceAudits: SouthCarolinaReferenceAudit[] = [];
    for (const reference of references) {
      const cacheKey = `${reference.section}|${reference.subdivision ?? ""}`;
      let inspection = documentCache.get(cacheKey);
      let chapter: SouthCarolinaChapterResult | undefined;
      if (inspection === undefined) {
        const url = buildSouthCarolinaSourceUrl(reference.section);
        chapter = chapterCache.get(url);
        if (!chapter) {
          chapter = await fetchChapter(url, fetchImpl, retryDelayMs);
          chapterCache.set(url, chapter);
          requests++;
          if ("error" in chapter) {
            if (chapter.failureKind === "transport") transportFailures++;
            else officialPageFailures++;
          }
          await sleep(rateLimitMs);
        }
        inspection = "html" in chapter
          ? inspectSouthCarolinaDocument(
            chapter.html,
            reference.section,
            url,
            importedAt,
            reference.subdivision,
          )
          : {
            document: null,
            sectionExtractionStatus: "not_attempted",
            officialTitle: null,
            historyEvidence: false,
            contentEvidence: false,
            contentHash: null,
            findings: [],
          };
        documentCache.set(cacheKey, inspection);
        if (!inspection.document) {
          if ("error" in chapter) {
            error = `Official South Carolina source unavailable: ${chapter.error}`;
          } else {
            error = inspection.findings.find((finding) =>
              finding.classification === "mechanical",
            )?.message ??
              "The official South Carolina chapter page did not contain the complete requested section and history.";
            contentContractFailures++;
          }
        }
      }
      const url = buildSouthCarolinaSourceUrl(reference.section);
      const cachedChapter = chapter ?? chapterCache.get(url);
      const fetchStatus = cachedChapter
        ? "html" in cachedChapter
          ? "success"
          : cachedChapter.failureKind === "transport"
            ? "transport_failure"
            : "official_page_failure"
        : "not_attempted";
      const fetchError = cachedChapter && "error" in cachedChapter ? cachedChapter.error : null;
      const auditFindings = [...inspection.findings];
      if (fetchError) {
        auditFindings.unshift({
          code: "official_fetch_failure",
          classification: "mechanical",
          message: `Official South Carolina source request failed: ${fetchError}.`,
          reference: `${reference.section}${reference.subdivision ?? ""}`,
        });
      }
      if (inspection.document && (
        !matchesSouthCarolinaCatalogTitle(charge, inspection.document.title)
      )) {
        auditFindings.push({
          code: "official_title_mismatch",
          classification: "structural",
          message: `The official South Carolina title "${inspection.document.title}" is not an exact or explicitly reviewed mapping for the catalog label.`,
          reference: `${reference.section}${reference.subdivision ?? ""}`,
        });
      }
      referenceAudits.push({
        section: reference.section,
        subdivision: reference.subdivision,
        citation: `S.C. Code Ann. § ${reference.section}${reference.subdivision ?? ""}`,
        officialUrl: url,
        fetchStatus,
        fetchError,
        retrievedAt: fetchStatus === "success" ? importedAt.toISOString() : null,
        sectionExtractionStatus: inspection.sectionExtractionStatus,
        officialTitle: inspection.officialTitle,
        historyEvidence: inspection.historyEvidence,
        contentEvidence: inspection.contentEvidence,
        contentHash: inspection.contentHash,
        findings: auditFindings,
      });
      if (inspection.document) documents.push(inspection.document);
    }
    const sourceAudit: SouthCarolinaSourceAudit = {
      citation,
      references: referenceAudits,
      findings: referenceAudits.flatMap((audit) => audit.findings),
    };
    records.push(buildSouthCarolinaManifestRecord(
      charge,
      documents,
      importedAt,
      error,
      sourceAudit,
    ));
  }

  const outputPath = options.outputPath ??
    path.resolve(process.cwd(), "scripts/data-review/output/sc-source-manifest.json");
  const transportOnlyFailure =
    transportFailures > 0 &&
    officialPageFailures === 0 &&
    contentContractFailures === 0;
  if (transportOnlyFailure) {
    const previousManifest = readPreviousSouthCarolinaManifest(outputPath);
    const preservedSnapshot = previousManifest
      ? { outputPath, generatedAt: previousManifest.generatedAt }
      : null;
    const alert: SouthCarolinaManifestRefreshAlert = {
      type: "transport-outage",
      severity: "warning",
      failureKind: "transport",
      transportFailures,
      message:
        `South Carolina source transport outage left the existing manifest snapshot ` +
        `${previousManifest ? `from ${previousManifest.generatedAt} ` : ""}` +
        `active at ${outputPath}. No manifest changes were written; retry after ` +
        "official-source access is restored. Official-page and content-contract " +
        "failures are reported separately and do not trigger this preservation alert.",
      preservedSnapshot,
    };
    const summary: SouthCarolinaManifestRefreshSummary = {
      outputPath,
      catalogRecords: charges.length,
      retained: 0,
      withheld: 0,
      sources: 0,
      snapshots: 0,
      requests,
      transportFailures,
      officialPageFailures,
      contentContractFailures,
      wroteManifest: false,
      preservedManifest: true,
      alert,
    };
    console.error(`[ALERT][${alert.type}] ${alert.message}`);
    console.log(JSON.stringify(summary, null, 2));
    return summary;
  }

  const findingCodes: SouthCarolinaAuditFindingCode[] = [
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
  const allFindings = records.flatMap((record) => record.auditFindings);
  const findingCounts = Object.fromEntries(
    findingCodes.map((code) => [code, allFindings.filter((finding) => finding.code === code).length]),
  ) as Record<SouthCarolinaAuditFindingCode, number>;
  const references = records.flatMap((record) => record.sourceAudit.references);
  const buildClassificationSummary = (classification: "mechanical" | "structural") => {
    const findings = allFindings.filter((finding) => finding.classification === classification);
    return {
      findingCodes: findingCodes.filter((code) => findings.some((finding) => finding.code === code)),
      affectedRows: new Set(
        records.filter((record) => record.auditFindings.some((finding) => finding.classification === classification))
          .map((record) => record.chargeId),
      ).size,
      affectedReferences: findings.filter((finding) => finding.reference !== null).length,
    };
  };
  const manifest: SouthCarolinaAuthorityManifest = {
    jurisdiction: "SC",
    generatedAt: importedAt,
    source: "South Carolina Legislature Code of Laws (scstatehouse.gov)",
    catalogRecords: records,
    audit: {
      schemaVersion: 1,
      catalogRowCount: records.length,
      parsedReferenceCount: references.length,
      successfulOfficialRetrievals: references.filter((reference) => reference.fetchStatus === "success").length,
      completeSectionExtractions: references.filter(
        (reference) => reference.sectionExtractionStatus === "complete",
      ).length,
      findingCounts,
      mechanical: buildClassificationSummary("mechanical"),
      structural: buildClassificationSummary("structural"),
    },
  };
  const selectable = records.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename",
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const summary: SouthCarolinaManifestRefreshSummary = {
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
    preservedManifest: false,
    alert: null,
  };
  console.log(JSON.stringify({
    jurisdiction: "SC",
    manifestRecords: records.length,
    selectableCharges: selectable.length,
    withheldCharges: records.length - selectable.length,
    fetchedChapters: chapterCache.size,
    ...summary,
  }, null, 2));
  return summary;
}

export async function main(): Promise<void> {
  const result = await refreshSouthCarolinaManifest();
  if (result.preservedManifest) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("South Carolina authority import failed:", error);
    process.exitCode = 1;
  });
}