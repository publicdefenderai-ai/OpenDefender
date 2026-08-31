/**
 * Import Pennsylvania catalog citations from the official Pennsylvania
 * General Assembly statutes site. Approved unconsolidated legacy rows use
 * their explicit act/chapter/section mappings; production seeding uses the
 * committed manifest.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildPennsylvaniaManifestRecord,
  buildPennsylvaniaOfficialSourceUrl,
  buildPennsylvaniaSourceUrl,
  getPennsylvaniaApprovedLegacyProvision,
  getPennsylvaniaReferences,
  PENNSYLVANIA_MANIFEST_SOURCE,
  parsePennsylvaniaCitation,
  PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS,
  validatePennsylvaniaManifestRecord,
  type PennsylvaniaAuthorityManifest,
  type PennsylvaniaSourceDocument,
  type PennsylvaniaSourceReference,
} from "../../server/data/pennsylvania-source-database-seed";
import type { AuthorityCatalogRecord } from "../../server/services/authority-source-database";

const RATE_LIMIT_MS = 900;
const MAX_RETRIES = 3;
const SOURCE_REQUEST_TIMEOUT_MS = 30_000;
const CONTRACT_RETRY_DELAY_MS = 1_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RequestLimiter {
  lastRequestAt: number | null;
  minIntervalMs?: number;
}

async function waitForRateLimit(limiter: RequestLimiter): Promise<void> {
  if (limiter.lastRequestAt !== null) {
    const remaining =
      (limiter.minIntervalMs ?? RATE_LIMIT_MS) - (Date.now() - limiter.lastRequestAt);
    if (remaining > 0) await sleep(remaining);
  }
  limiter.lastRequestAt = Date.now();
}

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
  return Number.isFinite(retryAfter) && retryAfter >= 0
    ? Math.min(retryAfter * 1000, 10_000)
    : 2_000 * (attempt + 1);
}

export type PennsylvaniaTransportErrorKind =
  "timeout" | "dns" | "tls" | "connection" | "network";

export interface PennsylvaniaRequestDiagnostic {
  attempt: number;
  elapsedMs: number;
  kind: "http" | PennsylvaniaTransportErrorKind;
  status?: number;
  message: string;
  retrying: boolean;
}

interface PennsylvaniaRequestSuccess {
  response: Response;
  html: string;
  attempts: number;
  diagnostics: PennsylvaniaRequestDiagnostic[];
}

interface PennsylvaniaRequestFailure {
  error: string;
  diagnostics: PennsylvaniaRequestDiagnostic[];
}

export interface PennsylvaniaRequestOptions {
  maxRetries?: number;
  timeoutMs?: number;
  retryDelay?: (response: Response, attempt: number) => number;
  retryTransportDelay?: (attempt: number) => number;
}

export type PennsylvaniaDocumentFailureKind =
  | "transport"
  | "official-page"
  | "content-contract";

export interface PennsylvaniaDocumentRefreshResult {
  document: PennsylvaniaSourceDocument | null;
  failureKind?: PennsylvaniaDocumentFailureKind;
  failure?: string;
}

function transportErrorKind(error: unknown): PennsylvaniaTransportErrorKind {
  const errorWithCause = error as { code?: unknown; cause?: { code?: unknown } } | null;
  const code = String(errorWithCause?.code ?? errorWithCause?.cause?.code ?? "").toUpperCase();
  const message = error instanceof Error ? error.message : String(error);
  if (
    (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) ||
    /timed out|timeout|aborted/i.test(message)
  ) {
    return "timeout";
  }
  if (code.includes("ENOTFOUND") || code.includes("EAI_AGAIN")) return "dns";
  if (code.includes("CERT") || code.includes("TLS") || code.includes("SSL")) return "tls";
  if (
    code.includes("ECONN") ||
    code.includes("EPIPE") ||
    code.includes("UND_ERR_SOCKET") ||
    /socket|connection|reset/i.test(message)
  ) {
    return "connection";
  }
  return "network";
}

function describeError(error: unknown): string {
  const errorWithCause = error as { code?: unknown; cause?: { code?: unknown } } | null;
  const code = errorWithCause?.code ?? errorWithCause?.cause?.code;
  const message = error instanceof Error ? error.message : String(error);
  return `${transportErrorKind(error)}${code ? ` (${String(code)})` : ""}: ${message}`;
}

async function requestPennsylvaniaSource(
  url: string,
  fetchImpl: typeof fetch,
  init: RequestInit,
  options: PennsylvaniaRequestOptions = {},
): Promise< PennsylvaniaRequestSuccess | PennsylvaniaRequestFailure> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const timeoutMs = options.timeoutMs ?? SOURCE_REQUEST_TIMEOUT_MS;
  const diagnostics: PennsylvaniaRequestDiagnostic[] = [];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const startedAt = Date.now();
    try {
      const response = await fetchImpl(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      const retryable = response.status === 429 || response.status >= 500;
      const retrying = retryable && attempt < maxRetries;
      diagnostics.push({
        attempt: attempt + 1,
        elapsedMs: Date.now() - startedAt,
        kind: "http",
        status: response.status,
        message: `HTTP ${response.status}`,
        retrying,
      });
      if (retrying) {
        await sleep(
          options.retryDelay?.(response, attempt) ??
            retryDelay(response, attempt),
        );
        continue;
      }
      try {
        return {
          response,
          html: response.status >= 200 && response.status < 300
            ? await response.text()
            : "",
          attempts: attempt + 1,
          diagnostics,
        };
      } catch (error) {
        const bodyMessage = `response body failed: ${describeError(error)}`;
        const bodyRetrying = attempt < maxRetries;
        diagnostics.push({
          attempt: attempt + 1,
          elapsedMs: Date.now() - startedAt,
          kind: transportErrorKind(error),
          message: bodyMessage,
          retrying: bodyRetrying,
        });
        if (bodyRetrying) {
          await sleep(
            options.retryTransportDelay?.(attempt) ??
              CONTRACT_RETRY_DELAY_MS * (attempt + 1),
          );
          continue;
        }
        return {
          error:
            `transport failure after ${attempt + 1} attempt(s) while reading ${url}: ` +
            `${bodyMessage}. Retry from the supported Pennsylvania refresh environment; ` +
            "no source content was accepted.",
          diagnostics,
        };
      }
    } catch (error) {
      const retrying = attempt < maxRetries;
      diagnostics.push({
        attempt: attempt + 1,
        elapsedMs: Date.now() - startedAt,
        kind: transportErrorKind(error),
        message: describeError(error),
        retrying,
      });
      if (retrying) {
        await sleep(
          options.retryTransportDelay?.(attempt) ??
            CONTRACT_RETRY_DELAY_MS * (attempt + 1),
        );
        continue;
      }
      const last = diagnostics.at(-1)!;
      return {
        error:
          `transport failure after ${attempt + 1} attempt(s) (${last.kind}) for ${url}: ` +
          `${last.message}. Retry from the supported Pennsylvania refresh environment; ` +
          "no source content was accepted.",
        diagnostics,
      };
    }
  }

  return {
    error: `Pennsylvania source request exhausted retries for ${url}`,
    diagnostics,
  };
}

async function fetchHtml(
  url: string,
  limiter: RequestLimiter,
  fetchImpl: typeof fetch = fetch,
  options: PennsylvaniaRequestOptions = {},
): Promise<
  { html: string; url: string } |
  { error: string; failureKind: "transport" | "official-page" }
> {
  await waitForRateLimit(limiter);
  const request = await requestPennsylvaniaSource(url, fetchImpl, {
    headers: {
      "User-Agent": "OpenDefender-PennsylvaniaAuthorityImporter/1.0",
      Accept: "text/html, */*",
    },
  }, { ...options, retryDelay: options.retryDelay ?? retryDelay });
  if ("error" in request) {
    return { ...request, failureKind: "transport" };
  }
  if (!request.response.ok) {
    return {
      error:
        `official Pennsylvania source request returned HTTP ${request.response.status} ` +
        `after ${request.attempts} attempt(s)`,
      failureKind: "official-page",
    };
  }
  return { html: request.html, url: request.response.url || url };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|td|tr|li|h[1-6])>/gi, "\n")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&sect;/gi, "§")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sourceFrameUrl(html: string, sourceUrl: string): string | null {
  const frame = html.match(/<(?:frame|iframe)\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
  const frameSource = frame?.[1] ?? frame?.[2] ?? frame?.[3];
  if (!frameSource) return null;
  try {
    return new URL(frameSource, sourceUrl).toString();
  } catch {
    return null;
  }
}

function sectionMarker(section: string): RegExp {
  const escapedSection = escapeRegex(section);
  return new RegExp(`(?:^|§\\s*)${escapedSection}\\s*(?=\\.)`, "im");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractPennsylvaniaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
): PennsylvaniaSourceDocument | null {
  const text = decodeHtml(html);
  if (!sectionMarker(section).test(text)) return null;
  const escapedSection = escapeRegex(section);
  const titleMatch = text.match(new RegExp(
    `(?:^|§\\s*)${escapedSection}\\s*[.]\\s*([^\\n.]{2,160})`,
    "im",
  ));
  if (!titleMatch) return null;
  const title = titleMatch[1].replace(/\s+/g, " ").trim();
  const start = text.search(sectionMarker(section));
  const body = text.slice(Math.max(0, start), Math.min(text.length, start + 50000)).trim();
  if (body.length < 40 || /page cannot be found|invalid section|error occurred/i.test(body)) return null;
  return {
    title,
    section,
    text: body,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestEffectiveDate(body),
  };
}

export function extractPennsylvaniaLegacyDocument(
  html: string,
  provision: (typeof PENNSYLVANIA_APPROVED_UNCONSOLIDATED_LEGACY_PROVISIONS)[string],
  sourceUrl: string,
  retrievedAt: Date,
): PennsylvaniaSourceDocument | null {
  const text = decodeHtml(html).replace(/\u00a0/g, " ");
  const normalizedText = text.replace(/\s+/g, " ");
  const sectionNumber = provision.section.split("-").at(-1) ?? provision.section;
  const sectionPattern = new RegExp(
    `(?:^|\\n)\\s*Section\\s+${escapeRegex(sectionNumber)}\\s*[.]`,
    "im",
  );
  if (!sectionPattern.test(text)) return null;
  if (provision.requiredContent.some((required) =>
    !normalizedText.toLowerCase().includes(required.toLowerCase()),
  )) return null;
  if (
    text.length < 120 ||
    /page cannot be found|invalid section|error occurred/i.test(text)
  ) return null;
  const start = text.search(sectionPattern);
  return {
    title: provision.sectionTitle,
    section: provision.section,
    text: text.slice(Math.max(0, start), Math.min(text.length, start + 50000)).trim(),
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestEffectiveDate(text),
  };
}

const EFFECTIVE_DATE_PATTERN =
  /\b(?:effective|eff\.?)\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;

const PENNSYLVANIA_OFFICIAL_HOSTS = new Set([
  "www.palegis.us",
  "palegis.us",
  "www.legis.state.pa.us",
  "legis.state.pa.us",
]);
const PENNSYLVANIA_PALEGIS_HOSTS = new Set(["www.palegis.us", "palegis.us"]);

export const PENNSYLVANIA_RETRIEVAL_SOURCE =
  "Pennsylvania General Assembly Consolidated Statutes (palegis.us)";
const PENNSYLVANIA_SOURCE_CONTRACT_SECTIONS: Record<string, string> = {
  "3": "459-305",
  "18": "2502",
  "23": "6114",
  "24": "13-1333",
  "34": "2711",
  "35": "1279.105",
  "42": "6355",
  "47": "4-406",
  "75": "3736",
};

function pennsylvaniaTitlesUsedByImporter(): string[] {
  return [...new Set(
    criminalCharges
      .filter((charge) => charge.jurisdiction === "PA")
      .flatMap((charge) => parsePennsylvaniaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? ""))
      .map((reference) => reference.title),
  )].sort((left, right) => Number(left) - Number(right));
}

const PENNSYLVANIA_IMPORTER_TITLES = pennsylvaniaTitlesUsedByImporter();
const missingContractSections = PENNSYLVANIA_IMPORTER_TITLES.filter(
  (title) => !PENNSYLVANIA_SOURCE_CONTRACT_SECTIONS[title],
);
if (missingContractSections.length > 0) {
  throw new Error(
    `Pennsylvania source contract is missing representative sections for Title ${missingContractSections.join(", ")}`,
  );
}

export const PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES: PennsylvaniaSourceReference[] =
  PENNSYLVANIA_IMPORTER_TITLES.map((title) => ({
    title,
    section: PENNSYLVANIA_SOURCE_CONTRACT_SECTIONS[title],
    subdivision: null,
  }));

// Kept as a compatibility alias for callers that used the original single-page check.
export const PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE =
  PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES.find((reference) => reference.title === "18")!;

function isPennsylvaniaOfficialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PENNSYLVANIA_OFFICIAL_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

interface PennsylvaniaSourceContractPage {
  requestedUrl: string;
  responseStatus: number;
  responseUrl: string;
  redirectLocation: string | null;
  contentType: string;
  html: string;
}

export interface PennsylvaniaSourceContractResult {
  ok: boolean;
  source: typeof PENNSYLVANIA_RETRIEVAL_SOURCE;
  requestedUrl: string;
  responseUrl: string;
  failures: string[];
  pages: PennsylvaniaSourceContractPageResult[];
}

export interface PennsylvaniaSourceContractPageResult {
  ok: boolean;
  source: typeof PENNSYLVANIA_RETRIEVAL_SOURCE;
  reference: PennsylvaniaSourceReference;
  requestedUrl: string;
  responseUrl: string;
  failures: string[];
  failureKind?: "transport" | "http" | "redirect" | "content-type" | "html-contract";
  diagnostics?: PennsylvaniaRequestDiagnostic[];
}

function isPennsylvaniaPalegisUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PENNSYLVANIA_PALEGIS_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Validate the small, release-time contract for one migrated PAlegis source
 * page. It must not fall back to the legacy host or a secondary authority
 * when the contract changes.
 */
export function validatePennsylvaniaSourceContract(
  page: PennsylvaniaSourceContractPage,
  reference: PennsylvaniaSourceReference = PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE,
): PennsylvaniaSourceContractPageResult {
  const failures: string[] = [];
  const expectedUrl = buildPennsylvaniaOfficialSourceUrl(
    reference.title,
    reference.section,
  );

  if (page.requestedUrl !== expectedUrl) {
    failures.push(`contract requested an unexpected URL: ${page.requestedUrl}`);
  }
  if (page.responseStatus >= 300 && page.responseStatus < 400) {
    let redirectedTo = "an unspecified location";
    if (page.redirectLocation) {
      try {
        redirectedTo = new URL(page.redirectLocation, page.requestedUrl).toString();
      } catch {
        redirectedTo = page.redirectLocation;
      }
    }
    failures.push(`official PAlegis.us source returned an unexpected redirect to ${redirectedTo}`);
  } else if (page.responseStatus !== 200) {
    failures.push(`official source returned HTTP ${page.responseStatus}`);
  }
  if (page.responseUrl !== page.requestedUrl) {
    failures.push(`unexpected final URL ${page.responseUrl}`);
  }
  if (!isPennsylvaniaPalegisUrl(page.responseUrl)) {
    failures.push(`response did not remain on official PAlegis.us: ${page.responseUrl}`);
  }
  if (!/\btext\/html\b/i.test(page.contentType)) {
    failures.push(`expected text/html response, received ${page.contentType || "no content type"}`);
  }

  const hasHtmlShell = /<html\b/i.test(page.html) && /<body\b/i.test(page.html);
  const hasStatuteHeading = new RegExp(
    `<h[1-3]\\b[^>]*>\\s*Section\\s+${escapeRegex(reference.section)}(?:\\.0)?\\s*-\\s*Title\\s+${escapeRegex(reference.title)}\\b`,
    "i",
  ).test(page.html);
  if (!hasHtmlShell || !hasStatuteHeading) {
    failures.push(
      `PAlegis HTML structure changed: expected an HTML/body shell and a Title ${reference.title} section heading`,
    );
  }
  if (!sectionMarker(reference.section).test(decodeHtml(page.html))) {
    failures.push(`PAlegis page is missing the expected § ${reference.section} section marker`);
  }
  if (!extractPennsylvaniaDocument(
    page.html,
    reference.section,
    page.responseUrl,
    new Date(),
  )) {
    failures.push(`PAlegis page no longer contains extractable § ${reference.section} official section content`);
  }

  const failureKind =
    page.responseStatus >= 300 && page.responseStatus < 400
      ? "redirect"
      : page.responseStatus !== 200
        ? "http"
        : !/\btext\/html\b/i.test(page.contentType)
          ? "content-type"
          : failures.length > 0
            ? "html-contract"
            : undefined;
  return {
    ok: failures.length === 0,
    source: PENNSYLVANIA_RETRIEVAL_SOURCE,
    reference,
    requestedUrl: page.requestedUrl,
    responseUrl: page.responseUrl,
    failures,
    ...(failureKind ? { failureKind } : {}),
  };
}

export function extractLatestEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(EFFECTIVE_DATE_PATTERN)].map((match) => {
    const value = `${match[1]} ${match[2]}, ${match[3]}`;
    const time = Date.parse(value);
    return { value, time };
  }).filter((date) => Number.isFinite(date.time)).sort((a, b) => b.time - a.time);
  return dates[0]?.value ?? null;
}

export async function checkPennsylvaniaSourceContract(
  fetchImpl: typeof fetch = fetch,
  options: PennsylvaniaRequestOptions = {},
): Promise<PennsylvaniaSourceContractResult> {
  const pages: PennsylvaniaSourceContractPageResult[] = [];
  for (const reference of PENNSYLVANIA_SOURCE_CONTRACT_REFERENCES) {
    const requestedUrl = buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section);
    const request = await requestPennsylvaniaSource(requestedUrl, fetchImpl, {
      redirect: "manual",
      headers: {
        "User-Agent": "OpenDefender-PennsylvaniaSourceContract/1.0",
        Accept: "text/html",
      },
    }, options);
    if ("error" in request) {
      pages.push({
        ok: false,
        source: PENNSYLVANIA_RETRIEVAL_SOURCE,
        reference,
        requestedUrl,
        responseUrl: requestedUrl,
        failureKind: "transport",
        failures: [request.error],
        diagnostics: request.diagnostics,
      });
      continue;
    }
    const response = request.response;
    const validation = validatePennsylvaniaSourceContract({
      requestedUrl,
      responseStatus: response.status,
      responseUrl: response.url || requestedUrl,
      redirectLocation: response.headers.get("location"),
      contentType: response.headers.get("content-type") ?? "",
      html: request.html,
    }, reference);
    pages.push({
      ...validation,
      diagnostics: request.diagnostics,
    });
  }

  const firstPage = pages.find((page) =>
    page.reference === PENNSYLVANIA_SOURCE_CONTRACT_REFERENCE,
  ) ?? pages[0];
  return {
    ok: pages.every((page) => page.ok),
    source: PENNSYLVANIA_RETRIEVAL_SOURCE,
    requestedUrl: firstPage?.requestedUrl ?? "",
    responseUrl: firstPage?.responseUrl ?? "",
    failures: pages.flatMap((page) =>
      page.failures.map((failure) =>
        `Title ${page.reference.title} § ${page.reference.section} (${page.requestedUrl}): ${failure}`,
      ),
    ),
    pages,
  };
}

export async function fetchPennsylvaniaDocument(
  reference: PennsylvaniaSourceReference,
  retrievedAt: Date,
  limiter: RequestLimiter = { lastRequestAt: null },
): Promise<PennsylvaniaSourceDocument | null> {
  return (await fetchPennsylvaniaDocumentWithResult(reference, retrievedAt, limiter)).document;
}

async function fetchPennsylvaniaDocumentWithResult(
  reference: PennsylvaniaSourceReference,
  retrievedAt: Date,
  limiter: RequestLimiter,
  fetchImpl: typeof fetch = fetch,
  options: PennsylvaniaRequestOptions = {},
): Promise<PennsylvaniaDocumentRefreshResult> {
  const legacy = getPennsylvaniaApprovedLegacyProvision(reference);
  if (legacy) {
    const page = await fetchHtml(legacy.retrievalUrl, limiter, fetchImpl, options);
    if ("error" in page) {
      return {
        document: null,
        failureKind: page.failureKind,
        failure: page.error,
      };
    }
    if (page.url !== legacy.retrievalUrl) {
      return {
        document: null,
        failureKind: "official-page",
        failure: `official Pennsylvania legacy source returned an unexpected URL: ${page.url}`,
      };
    }
    const document = extractPennsylvaniaLegacyDocument(
      page.html,
      legacy,
      legacy.canonicalUrl,
      retrievedAt,
    );
    return document
      ? { document }
      : {
        document: null,
        failureKind: "content-contract",
        failure: `official Pennsylvania legacy source did not contain the expected section ${legacy.section}`,
      };
  }
  const canonicalUrl = buildPennsylvaniaSourceUrl(reference.title, reference.section);
  const retrievalUrls = [
    buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section),
    canonicalUrl,
  ];
  const failures: Array<{
    kind: PennsylvaniaDocumentFailureKind;
    message: string;
  }> = [];

  for (const retrievalUrl of retrievalUrls) {
    const page = await fetchHtml(retrievalUrl, limiter, fetchImpl, options);
    if ("error" in page) {
      failures.push({ kind: page.failureKind, message: page.error });
      continue;
    }
    if (!isPennsylvaniaOfficialUrl(page.url)) {
      failures.push({
        kind: "official-page",
        message: `official Pennsylvania source returned a non-official URL: ${page.url}`,
      });
      continue;
    }
    let document = extractPennsylvaniaDocument(
      page.html,
      reference.section,
      canonicalUrl,
      retrievedAt,
    );
    if (document) return { document };
    failures.push({
      kind: "content-contract",
      message: `official Pennsylvania source did not contain extractable section ${reference.title}-${reference.section}`,
    });

    // The legacy site used a frameset, and a migrated page may still expose
    // one while redirecting. Traverse only same-authority official URLs and
    // retain the canonical manifest URL on any successful document.
    const frameUrl = sourceFrameUrl(page.html, page.url);
    if (frameUrl && isPennsylvaniaOfficialUrl(frameUrl)) {
      const frame = await fetchHtml(frameUrl, limiter, fetchImpl, options);
      if ("error" in frame) {
        failures.push({ kind: frame.failureKind, message: frame.error });
        continue;
      }
      if (!isPennsylvaniaOfficialUrl(frame.url)) {
        failures.push({
          kind: "official-page",
          message: `official Pennsylvania frame returned a non-official URL: ${frame.url}`,
        });
        continue;
      }
      document = extractPennsylvaniaDocument(
        frame.html,
        reference.section,
        canonicalUrl,
        retrievedAt,
      );
      if (document) return { document };
      failures.push({
        kind: "content-contract",
        message: `official Pennsylvania frame did not contain extractable section ${reference.title}-${reference.section}`,
      });
    }
  }
  const failureKind = failures.every(({ kind }) => kind === "transport")
    ? "transport"
    : failures.some(({ kind }) => kind === "content-contract")
      ? "content-contract"
      : "official-page";
  return {
    document: null,
    failureKind,
    failure: failures.map(({ message }) => message).join(" "),
  };
}

export interface PennsylvaniaManifestRefreshOptions {
  importedAt?: Date;
  outputPath?: string;
  fetchImpl?: typeof fetch;
  requestOptions?: PennsylvaniaRequestOptions;
  rateLimitMs?: number;
}

export interface PennsylvaniaCatalogRowPreview {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  catalogCategory: string;
  disposition: AuthorityCatalogRecord["disposition"];
}

export interface PennsylvaniaCatalogDispositionChange {
  chargeId: string;
  catalogLabel: string;
  previousDisposition: AuthorityCatalogRecord["disposition"];
  nextDisposition: AuthorityCatalogRecord["disposition"];
}

export interface PennsylvaniaCatalogDiff {
  added: PennsylvaniaCatalogRowPreview[];
  removed: PennsylvaniaCatalogRowPreview[];
  dispositionChanged: PennsylvaniaCatalogDispositionChange[];
}

export interface PennsylvaniaPreservedSnapshot {
  outputPath: string;
  generatedAt: string;
}

export interface PennsylvaniaManifestRefreshAlert {
  type: "transport-outage";
  severity: "warning";
  failureKind: "transport";
  transportFailures: number;
  message: string;
  preservedSnapshot: PennsylvaniaPreservedSnapshot | null;
}

export interface PennsylvaniaManifestRefreshSummary {
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
  catalogDiff: PennsylvaniaCatalogDiff | null;
  alert: PennsylvaniaManifestRefreshAlert | null;
}

function catalogRowPreview(record: AuthorityCatalogRecord): PennsylvaniaCatalogRowPreview {
  return {
    chargeId: record.chargeId,
    catalogLabel: record.catalogLabel,
    catalogCode: record.catalogCode,
    catalogCategory: record.catalogCategory,
    disposition: record.disposition,
  };
}

export function diffPennsylvaniaCatalogRecords(
  previousRecords: AuthorityCatalogRecord[],
  nextRecords: AuthorityCatalogRecord[],
): PennsylvaniaCatalogDiff {
  const previousById = new Map(previousRecords.map((record) => [record.chargeId, record]));
  const nextById = new Map(nextRecords.map((record) => [record.chargeId, record]));
  const added: PennsylvaniaCatalogRowPreview[] = [];
  const removed: PennsylvaniaCatalogRowPreview[] = [];
  const dispositionChanged: PennsylvaniaCatalogDispositionChange[] = [];

  for (const record of nextRecords) {
    const previous = previousById.get(record.chargeId);
    if (!previous) {
      added.push(catalogRowPreview(record));
    } else if (previous.disposition !== record.disposition) {
      dispositionChanged.push({
        chargeId: record.chargeId,
        catalogLabel: record.catalogLabel,
        previousDisposition: previous.disposition,
        nextDisposition: record.disposition,
      });
    }
  }
  for (const record of previousRecords) {
    if (!nextById.has(record.chargeId)) removed.push(catalogRowPreview(record));
  }

  return { added, removed, dispositionChanged };
}

interface PennsylvaniaPreviousManifest {
  generatedAt: string;
  catalogRecords: AuthorityCatalogRecord[];
}

function readPreviousPennsylvaniaManifest(outputPath: string): PennsylvaniaPreviousManifest | null {
  try {
    const raw = JSON.parse(fs.readFileSync(outputPath, "utf8")) as {
      generatedAt?: unknown;
      catalogRecords?: unknown;
    };
    if (!Array.isArray(raw.catalogRecords)) {
      throw new Error("The existing Pennsylvania manifest has no catalog records");
    }
    if (typeof raw.generatedAt !== "string" || raw.generatedAt.length === 0) {
      throw new Error("The existing Pennsylvania manifest has no generatedAt timestamp");
    }
    return {
      generatedAt: raw.generatedAt,
      catalogRecords: raw.catalogRecords as AuthorityCatalogRecord[],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new Error(
      `Cannot preview against the existing Pennsylvania manifest at ${outputPath}: ` +
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function readPreviousPennsylvaniaCatalogRecords(outputPath: string): AuthorityCatalogRecord[] {
  return readPreviousPennsylvaniaManifest(outputPath)?.catalogRecords ?? [];
}

function reportPennsylvaniaCatalogDiff(diff: PennsylvaniaCatalogDiff): void {
  if (diff.added.length === 0 && diff.removed.length === 0 && diff.dispositionChanged.length === 0) {
    console.log("[PREVIEW] Pennsylvania catalog has no added, removed, or disposition-changed rows.");
    return;
  }
  console.log("[PREVIEW] Pennsylvania catalog changes:");
  for (const row of diff.added) {
    console.log(`  [ADDED] ${row.chargeId} — ${row.catalogLabel} (${row.disposition})`);
  }
  for (const row of diff.removed) {
    console.log(`  [REMOVED] ${row.chargeId} — ${row.catalogLabel} (${row.disposition})`);
  }
  for (const row of diff.dispositionChanged) {
    console.log(
      `  [DISPOSITION] ${row.chargeId} — ${row.catalogLabel}: ` +
      `${row.previousDisposition} -> ${row.nextDisposition}`,
    );
  }
}

export async function refreshPennsylvaniaManifest(
  options: PennsylvaniaManifestRefreshOptions = {},
): Promise<PennsylvaniaManifestRefreshSummary> {
  const importedAt = options.importedAt ?? new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "PA");
  const documentCache = new Map<string, PennsylvaniaSourceDocument | null>();
  const requestLimiter: RequestLimiter = {
    lastRequestAt: null,
    minIntervalMs: options.rateLimitMs,
  };
  let requests = 0;
  let transportFailures = 0;
  let officialPageFailures = 0;
  let contentContractFailures = 0;

  for (const charge of charges) {
    const references = getPennsylvaniaReferences(charge.id);
    for (const reference of references) {
      const key = `${reference.sourceKind ?? "consolidated"}:${reference.title}:${reference.section}`;
      if (documentCache.has(key)) continue;
      const result = await fetchPennsylvaniaDocumentWithResult(
        reference,
        importedAt,
        requestLimiter,
        options.fetchImpl,
        options.requestOptions,
      );
      requests++;
      documentCache.set(key, result.document);
      if (result.failureKind) {
        if (result.failureKind === "transport") transportFailures++;
        if (result.failureKind === "official-page") officialPageFailures++;
        if (result.failureKind === "content-contract") contentContractFailures++;
      }
      const label = reference.sourceKind === "unconsolidated" ? "P.S." : "Pa.C.S.";
      if (result.document) {
        console.log(`[OK] ${reference.title} ${label} § ${reference.section} — ${result.document.title}`);
      } else {
        console.error(
          `[FAIL][${result.failureKind}] ${reference.title} ${label} § ${reference.section}` +
          (result.failure ? ` — ${result.failure}` : ""),
        );
      }
    }
  }

  const outputPath = options.outputPath ??
    path.join(process.cwd(), "scripts/data-review/output/pa-source-manifest.json");
  const transportOnlyFailure =
    transportFailures > 0 &&
    officialPageFailures === 0 &&
    contentContractFailures === 0;
  if (transportOnlyFailure) {
    const previousManifest = readPreviousPennsylvaniaManifest(outputPath);
    const preservedSnapshot = previousManifest
      ? { outputPath, generatedAt: previousManifest.generatedAt }
      : null;
    const alert: PennsylvaniaManifestRefreshAlert = {
      type: "transport-outage",
      severity: "warning",
      failureKind: "transport",
      transportFailures,
      message:
        `Pennsylvania source transport outage left the existing manifest snapshot ` +
        `${previousManifest ? `from ${previousManifest.generatedAt} ` : ""}` +
        `active at ${outputPath}. No manifest changes were written; retry after ` +
        "official-source access is restored. Official-page and content-contract " +
        "failures are reported separately and do not trigger this preservation alert.",
      preservedSnapshot,
    };
    const summary = {
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
      catalogDiff: null,
      alert,
    };
    console.error(`[ALERT][${alert.type}] ${alert.message}`);
    console.log(JSON.stringify(summary, null, 2));
    return summary;
  }

  const records = charges.map((charge) => {
    const references = getPennsylvaniaReferences(charge.id);
    const documents = references.flatMap((reference) => {
      const document = documentCache.get(`${reference.sourceKind ?? "consolidated"}:${reference.title}:${reference.section}`);
      return document ? [document] : [];
    });
    const missing = references.find((reference) =>
      !documentCache.get(`${reference.sourceKind ?? "consolidated"}:${reference.title}:${reference.section}`),
    );
    return buildPennsylvaniaManifestRecord(
      charge,
      documents,
      importedAt,
      missing
        ? `Official Pennsylvania General Assembly section ${missing.title}-${missing.section} could not be verified.`
        : undefined,
    );
  });
  const validationErrors = records
    .map((record) => ({
      chargeId: record.chargeId,
      error: validatePennsylvaniaManifestRecord(record),
    }))
    .filter((entry): entry is { chargeId: string; error: string } => Boolean(entry.error));
  if (validationErrors.length > 0) {
    throw new Error(
      "Pennsylvania refresh produced records that failed exact-source validation: " +
      validationErrors.map(({ chargeId, error }) => `${chargeId}: ${error}`).join(" "),
    );
  }
  const manifest: PennsylvaniaAuthorityManifest = {
    jurisdiction: "PA",
    generatedAt: importedAt,
    source: PENNSYLVANIA_MANIFEST_SOURCE,
    catalogRecords: records,
  };
  const catalogDiff = diffPennsylvaniaCatalogRecords(
    readPreviousPennsylvaniaCatalogRecords(outputPath),
    records,
  );
  reportPennsylvaniaCatalogDiff(catalogDiff);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  const summary = {
    outputPath,
    catalogRecords: records.length,
    retained: records.filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename").length,
    withheld: records.filter((record) =>
      record.disposition !== "retain" && record.disposition !== "exact_alias_rename").length,
    sources: new Set(records.flatMap((record) =>
      record.provisions.map((provision) => provision.sourceKey))).size,
    snapshots: records.reduce((sum, record) => sum + record.provisions.length, 0),
    requests,
    transportFailures,
    officialPageFailures,
    contentContractFailures,
    wroteManifest: true,
    preservedManifest: false,
    catalogDiff,
    alert: null,
  };
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

export async function main(): Promise<void> {
  const result = await refreshPennsylvaniaManifest();
  if (result.preservedManifest) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Pennsylvania source database import failed:", error);
    process.exit(1);
  });
}