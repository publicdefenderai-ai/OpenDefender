import { JSDOM } from "jsdom";
import { extractOhioDocument } from "../import-ohio-source-database";
import { parseOhioPageHeading } from "../ohio-discovery/parser";
import { ohioUrl } from "./ohio-adapter";
import { textHash, type BatchDocument } from "./source-batch";
import type { OhioIndexReceipt } from "./ohio-index";

/** Reuse the same section extractor; never attribute neighboring section text to a charge. */
export function extractOhioChapterDocuments(html: string, chapter: string, retrievedAt: Date) {
  if (!parseOhioPageHeading(html, "Chapter", chapter)) throw new Error(`Wrong official chapter: ${chapter}`);
  const dom = new JSDOM(html);
  const rows = [...dom.window.document.querySelectorAll("table.laws-table .list-content")];
  const documents: BatchDocument[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const anchor = row.querySelector(".content-head-text > a[href]");
    const body = row.querySelector(".content-body");
    const section = anchor?.textContent?.match(/^Section\s+([1-9]\d{0,3}\.\d{2,5})\s*\|/)?.[1];
    if (!section || section.split(".")[0] !== chapter || !body) throw new Error(`Malformed section boundary in chapter ${chapter}`);
    if (seen.has(section)) throw new Error(`Duplicate section ${section}`);
    seen.add(section);
    const sourceUrl = ohioUrl(section);
    const href = new URL(anchor!.getAttribute("href")!, `https://codes.ohio.gov/ohio-revised-code/chapter-${chapter}`).href;
    if (href !== sourceUrl) throw new Error(`Section link identity mismatch: ${section}`);
    const source = extractOhioDocument(`<h1>${anchor!.innerHTML}</h1>${body.innerHTML}`, section, sourceUrl, retrievedAt);
    // Repealed/empty rows remain unavailable, never fabricated from neighboring text.
    if (!source?.effectiveDateStart) continue;
    documents.push({
      ...source, effectiveDateStart: source.effectiveDateStart,
      retrievedAt: retrievedAt.toISOString(), contentHash: textHash(source.text),
      acquiredFrom: `https://codes.ohio.gov/ohio-revised-code/chapter-${chapter}`,
    });
  }
  dom.window.close();
  if (!seen.size) throw new Error(`No section boundaries in chapter ${chapter}`);
  return documents;
}

export function createOhioBulkAcquirer(index?: OhioIndexReceipt, fetchPage: typeof fetch = fetch) {
  const chapters = new Map<string, Promise<BatchDocument[]>>();
  const metrics = { httpRequests: 0 };
  if (index) chapters.set("2903", Promise.resolve(
    extractOhioChapterDocuments(index.html, "2903", new Date(index.retrievedAt)),
  ));
  let lastRequest = 0;
  const acquire = async (section: string) => {
    const chapter = section.split(".")[0];
    let request = chapters.get(chapter);
    const requests = request ? 0 : 1;
    if (!request) {
      request = (async () => {
        const delay = Math.max(0, lastRequest + 1000 - Date.now());
        if (delay) await new Promise(resolve => setTimeout(resolve, delay));
        lastRequest = Date.now();
        metrics.httpRequests++;
        const response = await fetchPage(`https://codes.ohio.gov/ohio-revised-code/chapter-${chapter}`, {
          redirect: "manual", signal: AbortSignal.timeout(30_000), headers: { Accept: "text/html" },
        });
        if (!response.ok) throw new Error(`Official chapter ${chapter}: HTTP ${response.status}`);
        return extractOhioChapterDocuments(await response.text(), chapter, new Date());
      })();
      chapters.set(chapter, request);
    }
    return { documents: await request, requests };
  };
  return Object.assign(acquire, { metrics });
}