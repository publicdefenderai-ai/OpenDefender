import { parseOhioChapterSectionLinks, parseOhioPageHeading } from "../ohio-discovery/parser";
import { textHash } from "./source-batch";

export interface OhioIndexReceipt {
  sourceUrl: string;
  retrievedAt: string;
  html: string;
  contentHash: string;
}
const indexUrl = "https://codes.ohio.gov/ohio-revised-code/chapter-2903";

export async function checkOhioChapterIndex(
  expected: string[], previous: OhioIndexReceipt | undefined,
  acquire: boolean, now: Date, maxAgeMs: number, fetchPage: typeof fetch = fetch,
) {
  const age = previous ? now.getTime() - Date.parse(previous.retrievedAt) : Infinity;
  let receipt = previous;
  let requests = 0;
  let status = "reused_fresh_index";
  if (!receipt || receipt.sourceUrl !== indexUrl || textHash(receipt.html) !== receipt.contentHash ||
      !Number.isFinite(age) || age < 0 || age >= maxAgeMs) {
    if (!acquire) return { requests, status: "index_refresh_required", receipt: undefined, added: [], removed: [] };
    requests++;
    try {
      const response = await fetchPage(indexUrl, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      receipt = { sourceUrl: indexUrl, retrievedAt: new Date().toISOString(), html, contentHash: textHash(html) };
      status = "acquired_index";
    } catch (error) {
      return { requests, status: "index_acquisition_failed", receipt: undefined, added: [], removed: [],
        error: error instanceof Error ? error.message : String(error) };
    }
  }
  const heading = parseOhioPageHeading(receipt.html, "Chapter", "2903");
  const actual = parseOhioChapterSectionLinks(receipt.html, indexUrl).map(link => link.id);
  if (!heading || !actual.length || actual.some(section => !section.startsWith("2903."))) {
    return { requests, status: "invalid_index", receipt: undefined, added: [], removed: [] };
  }
  const added = actual.filter(section => !expected.includes(section)).sort();
  const removed = expected.filter(section => !actual.includes(section)).sort();
  return { requests, status: added.length || removed.length ? "enumeration_changed" : status, receipt, added, removed };
}