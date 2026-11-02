import { createHash } from "node:crypto";
import {
  OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS,
  ohioChapter2903Evidence,
  type OhioChapter2903OfficialDocument,
} from "./ohio-chapter-2903-source";

/**
 * The complete normalized official extraction, rather than only the reviewed
 * quotes, is deliberately returned in comparison evidence.  This makes a
 * refresh auditable without ever treating newly acquired text as a pin.
 */
export interface OhioChapter2903ComparisonSnapshot {
  section: string;
  text: string;
  hash: string;
  title: string;
  effectiveDate: string;
  sourceUrl: string;
}

export interface OhioChapter2903ComparisonEvidence {
  section: string;
  expected: OhioChapter2903ComparisonSnapshot;
  observed: OhioChapter2903ComparisonSnapshot | null;
  /** Changed means a complete page was acquired but no longer matches its pin. */
  status: "unchanged" | "changed" | "unavailable";
}

export interface OhioChapter2903RefreshReceiptDocument {
  section: string;
  title: string;
  sourceUrl: string;
  contentHash: string;
  effectiveDateStart: string;
}

export interface OhioChapter2903RefreshReceipt {
  schemaVersion: number;
  checkedAt: string;
  expiresAt: string;
  documents: OhioChapter2903RefreshReceiptDocument[];
}

/** Short name for callers that store a valid refresh receipt. */
export type Receipt = OhioChapter2903RefreshReceipt;
export type OhioChapter2903Receipt = OhioChapter2903RefreshReceipt;

export interface OhioChapter2903Comparison {
  receipt: OhioChapter2903Receipt | null;
  evidence: OhioChapter2903ComparisonEvidence[];
  errors: string[];
}

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 30_000;
const REQUEST_GAP_MS = 1_000;

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|li|section|h1)>/gi, "\n")
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

function parseEffectiveDate(html: string): string | null {
  const info = html.match(
    /<div class="label">\s*Effective:\s*<\/div>\s*<div class="value">([\s\S]*?)<\/div>/i,
  );
  const value = info ? decodeHtml(info[1]) : "";
  const match = value.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i,
  );
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]}, ${match[3]} UTC`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function extractOfficialText(
  html: string,
  section: string,
  sourceUrl: string,
): { text: string; title: string; effectiveDate: string } | null {
  const h1Html = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const h1 = h1Html ? decodeHtml(h1Html) : "";
  const heading = h1.match(/^Section\s+(\d+\.\d+)\s*\|\s*(.*)$/i);
  const bodyHtml = html.match(
    /<section class="laws-body"[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1];
  const effectiveDate = parseEffectiveDate(html);
  if (
    !heading ||
    heading[1] !== section ||
    !bodyHtml ||
    !effectiveDate ||
    /Number Not Found/i.test(h1)
  ) return null;
  const body = decodeHtml(bodyHtml);
  if (body.length < 20) return null;
  const bodyLines = body.split("\n");
  const title = heading[2].replace(/[.;\s]+$/, "").trim() ||
    bodyLines[0].replace(/[.;\s]+$/, "").trim();
  if (!title) return null;
  const titleLine = bodyLines[0].replace(/[.;\s]+$/, "").trim() === title
    ? bodyLines.slice(1) : bodyLines;
  const sectionLine = `Section ${section} |`;
  const text = `${sectionLine}\n${title}.\nEffective: ${effectiveDate}\n${titleLine.join("\n")}`;
  return {
    text,
    title,
    effectiveDate,
  };
}

function expectedDocuments(): OhioChapter2903OfficialDocument[] {
  const bySection = new Map<string, OhioChapter2903OfficialDocument>();
  for (const record of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document } of ohioChapter2903Evidence(record)) {
      bySection.set(document.section, document);
    }
  }
  return [...bySection.values()].sort((a, b) => a.section.localeCompare(b.section));
}

function expectedSnapshot(
  document: OhioChapter2903OfficialDocument,
): OhioChapter2903ComparisonSnapshot {
  return {
    section: document.section,
    text: document.text,
    hash: document.contentHash,
    title: document.title,
    effectiveDate: document.effectiveDateStart,
    sourceUrl: document.sourceUrl,
  };
}

function receiptDocument(
  document: OhioChapter2903OfficialDocument,
): OhioChapter2903RefreshReceiptDocument {
  return {
    section: document.section,
    title: document.title,
    sourceUrl: document.sourceUrl,
    contentHash: document.contentHash,
    effectiveDateStart: document.effectiveDateStart,
  };
}

function sameSnapshot(
  expected: OhioChapter2903ComparisonSnapshot,
  observed: OhioChapter2903ComparisonSnapshot | null,
): boolean {
  return observed !== null &&
    expected.text === observed.text &&
    expected.hash === observed.hash &&
    expected.title === observed.title &&
    expected.effectiveDate === observed.effectiveDate &&
    expected.sourceUrl === observed.sourceUrl;
}

async function fetchOfficial(
  fetchPage: typeof fetch,
  url: string,
): Promise<Response> {
  const isLiveFetch = fetchPage === fetch;
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetchPage(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "text/html, */*" },
        redirect: "error",
      });
      if (
        (response.status !== 429 && response.status < 500) ||
        attempt >= MAX_RETRIES
      ) return response;
      const retryAfter = response.headers.get("retry-after");
      const seconds = retryAfter && /^\d+$/.test(retryAfter)
        ? Number(retryAfter)
        : null;
      const date = retryAfter ? Date.parse(retryAfter) : NaN;
      const delay = seconds !== null
        ? seconds * 1000
        : Number.isFinite(date)
          ? Math.max(0, date - Date.now())
          : 5_000 * (attempt + 1);
      // Do not hold a worker lease for a publisher's hours-long Retry-After.
      // The next scheduled run will retry without violating that request.
      if (delay > 60_000) return response;
      // Consume retry responses so the connection can be reused. Calling
      // ReadableStream.cancel() is not awaited because some fetch adapters
      // leave that promise pending for synthetic responses.
      await response.arrayBuffer();
      // Fixtures should remain fast; real requests are throttled between
      // retries, including when the publisher does not provide Retry-After.
      if (isLiveFetch) await pause(Math.max(REQUEST_GAP_MS, delay));
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
      if (isLiveFetch) await pause(REQUEST_GAP_MS * (attempt + 1));
    }
  }
}

/**
 * Compare every distinct official dependency used by the Chapter 2903 pilot.
 * A failed section is recorded and does not prevent other sections from being
 * checked.  This function has no write path and never changes a pinned source.
 */
export async function compareOhioChapter2903Sources(
  fetchPage: typeof fetch = fetch,
): Promise<{
  receipt: OhioChapter2903Receipt | null;
  evidence: OhioChapter2903ComparisonEvidence[];
  errors: string[];
}> {
  const checkedAt = new Date();
  const documents = expectedDocuments();
  const evidence: OhioChapter2903ComparisonEvidence[] = [];
  const errors: string[] = [];
  let requests = 0;

  for (const document of documents) {
    if (fetchPage === fetch && Date.now() - checkedAt.getTime() > 35 * 60 * 1000) {
      errors.push(`${document.section}: comparison time budget exhausted; retry in a later run`);
      evidence.push({ section: document.section, expected: expectedSnapshot(document), observed: null, status: "unavailable" });
      continue;
    }
    if (requests > 0 && fetchPage === fetch) await pause(REQUEST_GAP_MS);
    requests++;
    const expected = expectedSnapshot(document);
    let observed: OhioChapter2903ComparisonSnapshot | null = null;
    let status: OhioChapter2903ComparisonEvidence["status"] = "unavailable";
    try {
      const response = await fetchOfficial(fetchPage, document.sourceUrl);
      if (!response.ok) {
        errors.push(`${document.section}: official source returned HTTP ${response.status}`);
      } else {
        const html = await response.text();
        const extracted = extractOfficialText(html, document.section, document.sourceUrl);
        if (!extracted) {
          errors.push(`${document.section}: official page did not contain the expected complete section`);
        } else {
          observed = {
            section: document.section,
            text: extracted.text,
            hash: createHash("sha256").update(extracted.text).digest("hex"),
            title: extracted.title,
            effectiveDate: extracted.effectiveDate,
            sourceUrl: document.sourceUrl,
          };
          if (!sameSnapshot(expected, observed)) {
            status = "changed";
            errors.push(`${document.section}: official source changed from its reviewed pin`);
          } else {
            status = "unchanged";
          }
        }
      }
    } catch (error) {
      errors.push(
        `${document.section}: official source request failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    evidence.push({ section: document.section, expected, observed, status });
  }

  if (errors.length > 0) return { receipt: null, evidence, errors };
  const receipt: OhioChapter2903Receipt = {
    schemaVersion: 1,
    checkedAt: checkedAt.toISOString(),
    expiresAt: new Date(checkedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    documents: documents.map(receiptDocument),
  };
  return { receipt, evidence, errors };
}