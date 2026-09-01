/**
 * Import Illinois criminal-charge authority from the official ILGA static
 * per-section document server. The committed manifest is seeded later without
 * network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildIllinoisManifestRecord,
  buildIllinoisSourceUrl,
  type IllinoisAuditFinding,
  type IllinoisAuditFindingCode,
  parseIllinoisCitation,
  type IllinoisAuthorityManifest,
  type IllinoisManifestRecord,
  type IllinoisReferenceAudit,
  type IllinoisSourceAudit,
  type IllinoisSourceDocument,
  type IllinoisFreshnessOutcome,
} from "../../server/data/illinois-source-database-seed";
import { loadIllinoisAuthorityManifest } from "../../server/data/illinois-manifest-loader";

const RATE_LIMIT_MS = 400;
const MAX_RETRIES = 3;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type IllinoisFetchResult =
  | { html: string }
  | { error: string; failureKind: "transport" | "official-page" };

async function fetchDocument(
  url: string,
  fetchImpl: typeof fetch = fetch,
  retryDelayMs = 1000,
): Promise<IllinoisFetchResult> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": UA, Accept: "text/html, */*" },
      });
      if (response.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      if (!response.ok) {
        return { error: `HTTP ${response.status}`, failureKind: "official-page" };
      }
      const html = await response.text();
      if (/<h2[^>]*>\s*Error\s*<\/h2>|Something went wrong|page you are looking for is unavailable/i.test(html)) {
        return {
          error: "ILGA returned its generic error page",
          failureKind: "official-page",
        };
      }
      return { html };
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
  return { error: "Illinois source request exhausted retries", failureKind: "transport" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|tr|td|table)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, decimal: string) =>
      String.fromCodePoint(Number(decimal)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(/\beff\.?\s+(\d{1,2})-(\d{1,2})-(\d{2,4})/gi)]
    .map((match) => {
      const year = Number(match[3]);
      const fullYear = year < 100 ? 2000 + year : year;
      const month = Number(match[1]);
      const day = Number(match[2]);
      const time = Date.UTC(fullYear, month - 1, day);
      return {
        value: `${fullYear.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        time,
      };
    })
    .filter((date) => Number.isFinite(date.time))
    .sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

export interface IllinoisDocumentInspection {
  document: IllinoisSourceDocument | null;
  sectionExtractionStatus: "complete" | "section_not_found" | "incomplete" | "not_attempted";
  officialTitle: string | null;
  sourceEvidence: string | null;
  effectiveDateStart: string | null;
  contentEvidence: boolean;
  contentHash: string | null;
  findings: IllinoisAuditFinding[];
}

export function inspectIllinoisDocument(
  html: string,
  chapter: string,
  act: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): IllinoisDocumentInspection {
  const text = decodeHtml(html);
  const heading = new RegExp(
    `(?:^|\\n)\\s*Sec\\.\\s*${escapeRegExp(section)}\\.\\s*([^\\n]+)`,
    "i",
  ).exec(text);
  const reference = `${chapter} ILCS ${act}/${section}${subdivision ?? ""}`;
  if (!heading) {
    return {
      document: null,
      sectionExtractionStatus: "section_not_found",
      officialTitle: null,
      sourceEvidence: null,
      effectiveDateStart: null,
      contentEvidence: false,
      contentHash: null,
      findings: [{
        code: "section_not_found",
        classification: "mechanical",
        message: `The official Illinois static document did not contain section ${section}.`,
        reference,
      }],
    };
  }
  const title = heading[1].replace(/[.;\s]+$/, "").trim();
  const sourceMatch = text.match(/\(Source:[\s\S]*?\)/i);
  const effectiveDateStart = parseEffectiveDate(text);
  const body = text.slice(heading.index + heading[0].length).trim();
  const contentEvidence = body.length > 0 && sourceMatch
    ? body.replace(sourceMatch[0], "").trim().length > 0
    : body.length > 0;
  const findings: IllinoisAuditFinding[] = [];
  if (!title || !contentEvidence) {
    findings.push({
      code: "content_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but its official title or statutory content could not be extracted.`,
      reference,
    });
  }
  if (!sourceMatch) {
    findings.push({
      code: "source_evidence_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but no ILGA source/history evidence was extracted for currentness.`,
      reference,
    });
  }
  if (!effectiveDateStart) {
    findings.push({
      code: "source_evidence_missing",
      classification: "mechanical",
      message: `Section ${section} was found, but no effective date was extracted for currentness.`,
      reference,
    });
  }
  const subdivisionParts = subdivision
    ? [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
      .map((item) => (item[1] ?? item[2]).toLowerCase())
    : [];
  if (
    !subdivisionParts.every((part) =>
      new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
    )
  ) {
    findings.push({
      code: "subdivision_not_found",
      classification: "mechanical",
      message: `The requested subdivision ${subdivision} was not found in the extracted official section text.`,
      reference,
    });
  }
  const complete = Boolean(
    title &&
    contentEvidence &&
    sourceMatch &&
    effectiveDateStart &&
    (!subdivision || subdivisionParts.every((part) =>
      new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
    )),
  );
  const document = complete
    ? {
        chapter,
        act,
        section,
        title,
        text,
        sourceUrl,
        retrievedAt,
        effectiveDateStart,
        sourceEvidence: sourceMatch?.[0] ?? null,
      }
    : null;
  if (complete && document) {
    findings.push({
      code: "official_source_verified",
      classification: "success",
      message: "Official Illinois source was retrieved with complete section and currentness evidence.",
      reference,
    });
  }
  return {
    document,
    sectionExtractionStatus: complete ? "complete" : "incomplete",
    officialTitle: title || null,
    sourceEvidence: sourceMatch?.[0] ?? null,
    effectiveDateStart,
    contentEvidence,
    contentHash: contentEvidence ? createHash("sha256").update(text).digest("hex") : null,
    findings,
  };
}

export function extractIllinoisDocument(
  html: string,
  chapter: string,
  act: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): IllinoisSourceDocument | null {
  return inspectIllinoisDocument(
    html,
    chapter,
    act,
    section,
    sourceUrl,
    retrievedAt,
    subdivision,
  ).document;
}

export interface IllinoisManifestRefreshOptions {
  outputPath?: string;
  importedAt?: Date;
  fetchImpl?: typeof fetch;
  rateLimitMs?: number;
  retryDelayMs?: number;
  checkOnly?: boolean;
}

export interface IllinoisManifestRefreshSummary {
  outputPath: string;
  catalogRecords: number;
  retained: number;
  withheld: number;
  requests: number;
  transportFailures: number;
  officialPageFailures: number;
  incompleteSections: number;
  changedSections: number;
  stillCurrentSections: number;
  unavailableSections: number;
  wroteManifest: boolean;
  preservedManifest: boolean;
  refreshBlocked: boolean;
  freshness: {
    checkedAt: string;
    outcomeCounts: Record<IllinoisFreshnessOutcome, number>;
  };
}

export function getIllinoisRefreshExitCode(
  result: Pick<IllinoisManifestRefreshSummary, "refreshBlocked" | "preservedManifest">,
  checkOnly: boolean,
): number {
  return result.refreshBlocked || (!checkOnly && result.preservedManifest) ? 1 : 0;
}

interface PreviousIllinoisManifest {
  generatedAt: string;
  catalogRecords: IllinoisManifestRecord[];
}

function readPreviousIllinoisManifest(outputPath: string): PreviousIllinoisManifest | null {
  try {
    const manifest = loadIllinoisAuthorityManifest(outputPath);
    return {
      generatedAt: manifest.generatedAt.toISOString(),
      catalogRecords: manifest.catalogRecords,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new Error(
      `Cannot inspect the existing Illinois manifest at ${outputPath}: ` +
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function findPreviousReference(
  records: IllinoisManifestRecord[],
  reference: IllinoisReferenceAudit,
): IllinoisReferenceAudit | undefined {
  return records
    .flatMap((record) => record.sourceAudit.references)
    .find((candidate) =>
      candidate.citation === reference.citation &&
      candidate.officialUrl === reference.officialUrl &&
      candidate.subdivision === reference.subdivision);
}

export function getIllinoisFreshnessOutcome(
  current: IllinoisReferenceAudit,
  previous: IllinoisReferenceAudit | undefined,
): IllinoisFreshnessOutcome {
  if (current.fetchStatus !== "success") return "unavailable";
  if (
    current.sectionExtractionStatus !== "complete" ||
    !current.contentEvidence ||
    !current.contentHash
  ) return "incomplete";
  if (!previous) return "still_current";
  if (!previous.contentHash) return "changed";
  if (previous.contentHash === current.contentHash) {
    return "still_current";
  }
  return "changed";
}

function annotateIllinoisFreshness(
  records: IllinoisManifestRecord[],
  previousRecords: IllinoisManifestRecord[],
): Record<IllinoisFreshnessOutcome, number> {
  const counts: Record<IllinoisFreshnessOutcome, number> = {
    changed: 0,
    unavailable: 0,
    incomplete: 0,
    still_current: 0,
  };
  for (const record of records) {
    for (const reference of record.sourceAudit.references) {
      const previous = findPreviousReference(previousRecords, reference);
      const outcome = getIllinoisFreshnessOutcome(reference, previous);
      reference.freshnessOutcome = outcome;
      reference.previousContentHash = previous?.contentHash ?? null;
      reference.previousRetrievedAt = previous?.retrievedAt ?? null;
      counts[outcome]++;
    }
  }
  return counts;
}

function hasUnsafeIllinoisRefreshFailure(
  records: IllinoisManifestRecord[],
  previousRecords: IllinoisManifestRecord[],
): boolean {
  return records.some((record) =>
    record.sourceAudit.references.some((reference) => {
      if (
        reference.freshnessOutcome === "unavailable" ||
        reference.freshnessOutcome === "changed"
      ) return true;
      if (reference.freshnessOutcome !== "incomplete") return false;
      const previous = findPreviousReference(previousRecords, reference);
      return !previous || (
        previous.fetchStatus === "success" &&
        previous.sectionExtractionStatus === "complete" &&
        Boolean(previous.contentHash)
      );
    }),
  );
}

function buildIllinoisAudit(
  records: IllinoisManifestRecord[],
  checkedAt: string,
): NonNullable<IllinoisAuthorityManifest["audit"]> {
  const findingCodes: IllinoisAuditFindingCode[] = [
    "official_source_verified",
    "citation_not_parseable",
    "catalog_code_mismatch",
    "official_fetch_failure",
    "section_not_found",
    "content_missing",
    "source_evidence_missing",
    "subdivision_not_found",
    "official_title_mismatch",
  ];
  const references = records.flatMap((record) => record.sourceAudit.references);
  const findingCounts = Object.fromEntries(
    findingCodes.map((code) => [
      code,
      records.reduce((count, record) =>
        count + record.auditFindings.filter((finding) => finding.code === code).length, 0),
    ]),
  ) as Record<IllinoisAuditFindingCode, number>;
  const classifications = ["mechanical", "structural"] as const;
  const classificationSummary = Object.fromEntries(classifications.map((classification) => [
    classification,
    {
      findingCodes: findingCodes.filter((code) =>
        records.some((record) => record.auditFindings.some((finding) =>
          finding.code === code && finding.classification === classification))),
      affectedRows: records.filter((record) =>
        record.auditFindings.some((finding) => finding.classification === classification)).length,
      affectedReferences: records.reduce((count, record) =>
        count + record.sourceAudit.references.filter((reference) =>
          reference.findings.some((finding) => finding.classification === classification)).length, 0),
    },
  ]));
  const outcomeCounts: Record<IllinoisFreshnessOutcome, number> = {
    changed: 0,
    unavailable: 0,
    incomplete: 0,
    still_current: 0,
  };
  for (const reference of references) {
    const outcome = reference.freshnessOutcome ?? (
      reference.fetchStatus !== "success"
        ? "unavailable"
        : reference.sectionExtractionStatus === "complete" && reference.contentHash
          ? "still_current"
          : "incomplete"
    );
    outcomeCounts[outcome]++;
  }
  return {
    schemaVersion: 1,
    catalogRowCount: records.length,
    parsedReferenceCount: references.length,
    successfulOfficialRetrievals: references.filter((reference) =>
      reference.fetchStatus === "success").length,
    completeSectionExtractions: references.filter((reference) =>
      reference.sectionExtractionStatus === "complete").length,
    findingCounts,
    mechanical: classificationSummary.mechanical,
    structural: classificationSummary.structural,
    freshness: { checkedAt, outcomeCounts },
  };
}

export async function refreshIllinoisManifest(
  options: IllinoisManifestRefreshOptions = {},
): Promise<IllinoisManifestRefreshSummary> {
  const importedAt = options.importedAt ?? new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "IL");
  const outputPath = options.outputPath ?? path.resolve(
    process.cwd(),
    "scripts/data-review/output/il-source-manifest.json",
  );
  const previousManifest = readPreviousIllinoisManifest(outputPath);
  const documentCache = new Map<string, {
    response: IllinoisFetchResult;
    inspection: IllinoisDocumentInspection | null;
  }>();
  const records: IllinoisManifestRecord[] = [];
  const fetchImpl = options.fetchImpl ?? fetch;
  const rateLimitMs = options.rateLimitMs ?? RATE_LIMIT_MS;
  const retryDelayMs = options.retryDelayMs ?? 1000;
  let requests = 0;
  let transportFailures = 0;
  let officialPageFailures = 0;
  let incompleteSections = 0;

  for (const charge of charges) {
    const citation = CHARGE_CITATIONS[charge.id]?.citation ?? "";
    const references = parseIllinoisCitation(citation);
    let error: string | undefined;
    const documents: IllinoisSourceDocument[] = [];
    const referenceAudits: IllinoisReferenceAudit[] = [];
    for (const reference of references) {
      const cacheKey = [
        reference.chapter,
        reference.act,
        reference.section,
        reference.subdivision ?? "",
      ].join("|");
      let cached = documentCache.get(cacheKey);
      if (cached === undefined) {
        const url = buildIllinoisSourceUrl(
          reference.chapter,
          reference.act,
          reference.section,
        );
        const response = await fetchDocument(url, fetchImpl, retryDelayMs);
        requests++;
        const inspection = "html" in response
          ? inspectIllinoisDocument(
            response.html,
            reference.chapter,
            reference.act,
            reference.section,
            url,
            importedAt,
            reference.subdivision,
          )
          : null;
        cached = { response, inspection };
        documentCache.set(cacheKey, cached);
        if (!inspection?.document) {
          error = "The official Illinois static document did not contain the complete requested section.";
        }
        if ("error" in response) {
          error = `Official Illinois source unavailable: ${response.error}`;
          if (response.failureKind === "transport") transportFailures++;
          else officialPageFailures++;
        } else if (!inspection?.document) {
          incompleteSections++;
        }
        await sleep(rateLimitMs);
      }
      const url = buildIllinoisSourceUrl(
        reference.chapter,
        reference.act,
        reference.section,
      );
      const inspection = cached.inspection;
      const response = cached.response;
      const findings = inspection?.findings ?? [{
        code: "official_fetch_failure" as const,
        classification: "mechanical" as const,
        message: "The official Illinois source could not be retrieved.",
        reference: `${reference.chapter} ILCS ${reference.act}/${reference.section}${reference.subdivision ?? ""}`,
      }];
      referenceAudits.push({
        chapter: reference.chapter,
        act: reference.act,
        section: reference.section,
        subdivision: reference.subdivision,
        citation: `${reference.chapter} ILCS ${reference.act}/${reference.section}${reference.subdivision ?? ""}`,
        officialUrl: url,
        fetchStatus: "error" in response
          ? response.failureKind === "transport" ? "transport_failure" : "official_page_failure"
          : "success",
        fetchError: "error" in response ? response.error : null,
        retrievedAt: inspection?.document?.retrievedAt.toISOString() ?? null,
        sectionExtractionStatus: inspection?.sectionExtractionStatus ?? "not_attempted",
        officialTitle: inspection?.officialTitle ?? null,
        sourceEvidence: inspection?.sourceEvidence ?? null,
        effectiveDateStart: inspection?.effectiveDateStart ?? null,
        contentEvidence: inspection?.contentEvidence ?? false,
        contentHash: inspection?.contentHash ?? null,
        findings,
      });
      if (inspection?.document) documents.push(inspection.document);
    }
    const sourceAudit: IllinoisSourceAudit = {
      citation,
      references: referenceAudits,
      rowFindings: [],
      findings: referenceAudits.flatMap((reference) => reference.findings),
    };
    records.push(buildIllinoisManifestRecord(charge, documents, importedAt, error, sourceAudit));
  }

  const outcomeCounts = annotateIllinoisFreshness(
    records,
    previousManifest?.catalogRecords ?? [],
  );
  const audit = buildIllinoisAudit(records, importedAt.toISOString());
  const hasRefreshFailure = hasUnsafeIllinoisRefreshFailure(
    records,
    previousManifest?.catalogRecords ?? [],
  );
  const shouldWrite = !options.checkOnly && !hasRefreshFailure;
  const selectable = records.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename");
  const manifest: IllinoisAuthorityManifest = {
    jurisdiction: "IL",
    generatedAt: importedAt,
    source: "Illinois General Assembly Illinois Compiled Statutes (ilga.gov)",
    catalogRecords: records,
    audit,
  };
  if (shouldWrite) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  }
  const summary: IllinoisManifestRefreshSummary = {
    outputPath,
    catalogRecords: records.length,
    retained: selectable.length,
    withheld: records.length - selectable.length,
    requests,
    transportFailures,
    officialPageFailures,
    incompleteSections: outcomeCounts.incomplete,
    changedSections: outcomeCounts.changed,
    stillCurrentSections: outcomeCounts.still_current,
    unavailableSections: outcomeCounts.unavailable,
    wroteManifest: shouldWrite,
    preservedManifest: !shouldWrite,
    refreshBlocked: hasRefreshFailure,
    freshness: { checkedAt: importedAt.toISOString(), outcomeCounts },
  };
  console.log(JSON.stringify({
    jurisdiction: "IL",
    ...summary,
    fetchedDocuments: documentCache.size,
  }, null, 2));
  return summary;
}

export async function main(): Promise<void> {
  const checkOnly = process.argv.includes("--check");
  const result = await refreshIllinoisManifest({
    checkOnly,
  });
  process.exitCode = getIllinoisRefreshExitCode(result, checkOnly);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Illinois authority import failed:", error);
    process.exitCode = 1;
  });
}