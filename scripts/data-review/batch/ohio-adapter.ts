import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { extractOhioDocument } from "../import-ohio-source-database";
import { type BatchDocument, type SourceAdapter, type SourceCache, textHash } from "./source-batch";

export const OHIO_SOURCE_MAX_AGE_MS = 7 * 24 * 60 * 60_000;
const sectionPattern = /^[1-9]\d{0,3}\.\d{2,5}$/;
export const ohioUrl = (section: string) => `https://codes.ohio.gov/ohio-revised-code/section-${section}`;
export const sectionReferences = (text: string) => {
  // Decimal identifiers in federal regulations or the Model Penal Code are not ORC sections.
  const ohioText = text.replace(
    /\b(?:(?:\d+\s+)?C\.?\s*F\.?\s*R\.?|MPC|Model Penal Code)\s*(?:§+|sections?)?\s*\d+\.\d+(?:\s*(?:,|and|through|-)\s*\d+\.\d+)*/gi,
    "",
  );
  return [...new Set(ohioText.match(/\b[1-9]\d{0,3}\.\d{2,5}\b/g) ?? [])];
};

/** Explicit incorporation leads only. Incidental statutory mentions are NOT a dependency graph. */
export function ohioIncorporatedReferences(document: BatchDocument) {
  return [...new Set(document.text.split("\n")
    .filter(line => /same meanings? as|(?:as|is|are) defined in|shall be punished|(?:penalt(?:y|ies)|sentenc(?:e|ing)|prison term).{0,100}(?:section|division)|(?:section|division).{0,100}(?:penalt(?:y|ies)|sentenc(?:e|ing)|prison term)/i.test(line))
    .flatMap(sectionReferences))].filter(section => section !== document.section);
}

export function createOhioAdapter(fetchPage: typeof fetch = fetch, delayMs = 1000): SourceAdapter {
  let lastRequestAt = 0;
  return {
    validate(document) {
      const heading = typeof document.text === "string"
        ? document.text.match(/^Section ([1-9]\d{0,3}\.\d{2,5})\s*\|\s*([^\n]+)/) : null;
      const title = heading?.[2].replace(/[.;\s]+$/, "").trim();
      return sectionPattern.test(document.section) && document.sourceUrl === ohioUrl(document.section) &&
        title === document.title && heading?.[1] === document.section &&
        /^\d{4}-\d{2}-\d{2}$/.test(document.effectiveDateStart) &&
        document.text.startsWith(`Section ${document.section} |`) &&
        document.text.includes(`Effective: ${document.effectiveDateStart}\n`) &&
        (document.text.split(`Effective: ${document.effectiveDateStart}\n`)[1]?.trim().length ?? 0) >= 20;
    },
    references(document) {
      return ohioIncorporatedReferences(document);
    },
    async acquire(section) {
      if (!sectionPattern.test(section)) throw new Error(`Invalid Ohio section: ${section}`);
      const wait = Math.max(0, lastRequestAt + delayMs - Date.now());
      if (wait) await new Promise(resolve => setTimeout(resolve, wait));
      lastRequestAt = Date.now();
      const sourceUrl = ohioUrl(section);
      const response = await fetchPage(sourceUrl, {
        signal: AbortSignal.timeout(30_000), redirect: "manual",
        headers: { Accept: "text/html", "User-Agent": "OpenDefender-OhioEvidenceBatch/1.0" },
      });
      if (!response.ok) {
        await response.body?.cancel();
        // Persist the failure rather than multiplying requests during a throttled run.
        const notFound = response.headers.get("location")?.includes("/number-not-found/") ?? false;
        throw new Error(notFound ? "Official publisher redirects this section to number-not-found"
          : `Official source HTTP ${response.status}; retry in a later batch`);
      }
      const source = extractOhioDocument(await response.text(), section, sourceUrl, new Date());
      if (!source?.effectiveDateStart) throw new Error("Official page lacks exact section text and effective date");
      return {
        ...source, retrievedAt: source.retrievedAt.toISOString(),
        effectiveDateStart: source.effectiveDateStart,
        contentHash: textHash(source.text),
      };
    },
  };
}

/** Import acquisition evidence; neither a filename nor a hash constitutes legal approval. */
export function importOhioEvidence(directory: string, cache: SourceCache) {
  const adapter = createOhioAdapter();
  const rejected: string[] = [];
  const add = (candidate: BatchDocument) => {
    if (!adapter.validate(candidate) || candidate.contentHash !== textHash(candidate.text) ||
        !Number.isFinite(Date.parse(candidate.retrievedAt))) return;
    const previous = cache.documents[candidate.section];
    if (!previous || Date.parse(candidate.retrievedAt) > Date.parse(previous.retrievedAt)) {
      cache.documents[candidate.section] = candidate;
    }
  };
  for (const filename of readdirSync(directory).sort()) {
    if (!/^ohio-.*-evidence\.json$/.test(filename) && filename !== "oh-source-manifest.json") continue;
    const source = JSON.parse(readFileSync(join(directory, filename), "utf8"));
    if (Array.isArray(source.documents)) {
      for (const document of source.documents) {
        if (typeof document.text === "string" && typeof document.section === "string" &&
            typeof document.title === "string" && typeof document.sourceUrl === "string") add(document);
      }
    }
    if (filename === "oh-source-manifest.json") {
      for (const record of source.catalogRecords) {
        for (const evidence of record.mapping?.candidateEvidence ?? []) {
          add({
            section: evidence.sectionIdentity.section, title: evidence.officialTitle,
            sourceUrl: evidence.sectionIdentity.sourceUrl, text: evidence.boundedText,
            contentHash: evidence.sourceHash, effectiveDateStart: evidence.currentness.effectiveDateStart,
            // This is the manifest's acquisition timestamp, not today's import time.
            retrievedAt: source.generatedAt,
          });
        }
      }
    }
  }
  for (const [section, document] of Object.entries(cache.documents)) {
    if (section !== document.section || !adapter.validate(document) ||
        textHash(document.text) !== document.contentHash) {
      rejected.push(section);
      delete cache.documents[section];
    }
  }
  return rejected;
}