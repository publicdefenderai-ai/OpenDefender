import {
  extractExactFloridaDocument, extractFloridaEdition, floridaChapterUrl,
  type FloridaBatchDocument,
} from "./florida-adapter";

/** Isolate every official Section div, then verify each with the existing exact-section extractor. */
export function extractFloridaChapterDocuments(html: string, requestedSection: string, retrievedAt: Date) {
  const acquiredFrom = floridaChapterUrl(requestedSection);
  const edition = extractFloridaEdition(html);
  if (!edition) throw new Error("Official chapter response lacks a Florida Statutes edition label");
  const starts = [...html.matchAll(/<div\s+class=["']Section["'][^>]*>/gi)].map(match => match.index!);
  if (!starts.length) throw new Error("Official chapter response has no Section boundaries");
  const documents: FloridaBatchDocument[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < starts.length; index++) {
    const block = html.slice(starts[index], starts[index + 1] ?? html.indexOf("</body>", starts[index]));
    const raw = block.match(/class=["']SectionNumber["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "";
    const section = raw.replace(/<[^>]+>/g, " ").match(/\b([1-9]\d{0,3}\.\d{2,6})\b/)?.[1] ?? "";
    if (!section || section.split(".")[0] !== requestedSection.split(".")[0]) {
      throw new Error(`Malformed or cross-chapter section boundary near ${requestedSection}`);
    }
    if (seen.has(section)) throw new Error(`Duplicate official section boundary ${section}`);
    seen.add(section);
    const document = extractExactFloridaDocument(`${block}</body>`, section, acquiredFrom, retrievedAt, edition);
    // A malformed/repealed sibling must not invalidate an independently exact requested section.
    // The requested section is still required below; unusable siblings are simply not cached.
    if (document) documents.push(document);
  }
  if (!documents.some(document => document.section === requestedSection)) {
    throw new Error(`Existing Florida parser rejected or chapter omitted requested section ${requestedSection}`);
  }
  return documents;
}

export function createFloridaChapterAcquirer(
  fetchPage: typeof fetch = fetch, paceMs = 800,
  recordRaw?: (chapter: string, receipt: { sourceUrl: string; retrievedAt: string; html: string; contentHash: string }) => void,
) {
  const chapters = new Map<string, Promise<FloridaBatchDocument[]>>();
  let lastRequestAt = 0;
  let httpRequests = 0;
  const acquire = async (section: string) => {
    const chapter = section.split(".")[0];
    let pending = chapters.get(chapter);
    let requests = 0;
    if (!pending) {
      requests = 1;
      pending = (async () => {
        const wait = Math.max(0, lastRequestAt + paceMs - Date.now());
        if (wait) await new Promise(resolve => setTimeout(resolve, wait));
        lastRequestAt = Date.now();
        httpRequests++;
        const url = floridaChapterUrl(section);
        const response = await fetchPage(url, {
          redirect: "manual", signal: AbortSignal.timeout(30_000),
          headers: { Accept: "text/html", "User-Agent": "OpenDefender-FloridaEvidenceBatch/1.0" },
        });
        if (!response.ok) {
          await response.body?.cancel();
          throw new Error(`Official whole-chapter source HTTP ${response.status}`);
        }
        const html = await response.text();
        const retrievedAt = new Date();
        const contentHash = (await import("node:crypto")).createHash("sha256").update(html).digest("hex");
        recordRaw?.(chapter, { sourceUrl: url, retrievedAt: retrievedAt.toISOString(), html, contentHash });
        return extractFloridaChapterDocuments(html, section, retrievedAt);
      })();
      chapters.set(chapter, pending);
    }
    return { documents: await pending, requests };
  };
  return Object.assign(acquire, { getHttpRequests: () => httpRequests });
}