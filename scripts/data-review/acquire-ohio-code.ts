/**
 * Acquire the complete official Ohio Revised Code by whole-chapter retrieval.
 *
 * Ohio publishes every section's full body text on its chapter page, so one
 * rate-limited official request per chapter yields the statewide section
 * enumeration, the official catchlines, and the operative text together. That
 * removes the acquisition gaps that otherwise force records to be held for
 * missing cross-referenced dependencies: once every chapter is cached, every
 * section a provision incorporates is already present.
 *
 * This is acquisition and enumeration only. It reads no catalog file, makes no
 * publication decision, and writes no eligibility or approval record.
 *
 * A statewide run parses 971 full chapter pages, so give it headroom:
 *   NODE_OPTIONS=--max-old-space-size=8192 \
 *     npx tsx scripts/data-review/acquire-ohio-code.ts [--limit N] [--chapters 2903,2925]
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { OhioOfficialFetcher } from "./ohio-discovery/fetcher";
import { OHIO_CHAPTER_PARSER_VERSION } from "./ohio-discovery/section-status";
import {
  parseOhioChapterPage,
  type OhioParsedSection,
} from "./ohio-discovery/chapter-parser";

const ROOT = process.cwd();
const INVENTORY_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-code-inventory.json");
const OUTPUT_PATH = path.resolve(ROOT, "scripts/data-review/output/ohio-code-enumeration.json");
const HTML_CACHE_DIR = path.resolve(ROOT, "scripts/data-review/ohio-discovery/cache");
const SECTION_CACHE_DIR = path.resolve(ROOT, ".cache/ohio-chapters");
/** One coherent snapshot: reuse chapter HTML for a week, matching the
 *  seven-day evidence window the reviewed pipelines already enforce. */
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface OhioChapterAcquisition {
  chapterNumber: string;
  titleNumber: string;
  chapterName: string | null;
  sourceUrl: string;
  retrievedAt: string;
  pageHash: string;
  sectionCount: number;
}

export interface OhioAcquisitionFailure {
  chapterNumber: string;
  sourceUrl: string;
  reason: string;
}

interface InventoryChapter {
  chapterNumber: string;
  titleNumber: string;
  sourceUrl: string;
  title?: string;
  status?: string;
}

/** Hash the already-cached official page without refetching or building a DOM. */
function hashCachedPage(sourceUrl: string): string {
  const cachePath = path.join(
    HTML_CACHE_DIR,
    `${createHash("sha256").update(sourceUrl).digest("hex")}.json`,
  );
  if (!fs.existsSync(cachePath)) return "";
  try {
    const cached = JSON.parse(fs.readFileSync(cachePath, "utf8")) as { html?: string };
    return cached.html ? createHash("sha256").update(cached.html).digest("hex") : "";
  } catch {
    return "";
  }
}

interface ParsedChapterCache {
  parserVersion?: number;
  retrievedAt: string;
  chapterName?: string | null;
  pageHash?: string;
  sections: OhioParsedSection[];
}

/** Reuse a previously parsed chapter while it is still inside the snapshot window. */
export function readParsedChapter(parsedPath: string): ParsedChapterCache | null {
  if (!fs.existsSync(parsedPath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(parsedPath, "utf8")) as ParsedChapterCache;
    const age = Date.now() - new Date(parsed.retrievedAt).getTime();
    if (parsed.parserVersion !== OHIO_CHAPTER_PARSER_VERSION) return null;
    if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) return null;
    if (!Number.isFinite(age) || age < 0 || age > CACHE_MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function assertParserUpgradeAllowed(parsedPath: string, allowFetch = false): void {
  if (!fs.existsSync(parsedPath) || allowFetch) return;
  const parsed = JSON.parse(fs.readFileSync(parsedPath, "utf8")) as ParsedChapterCache;
  if (parsed.parserVersion !== OHIO_CHAPTER_PARSER_VERSION) {
    throw new Error("Ohio parser upgrade requires an explicit choice: replay the recorded snapshot with reparse-ohio-snapshot.ts, or allow acquisition with --allow-parser-upgrade-fetch. No source requests were made.");
  }
}

function parseArgs(argv: readonly string[]) {
  const limitIndex = argv.indexOf("--limit");
  const chaptersIndex = argv.indexOf("--chapters");
  return {
    allowParserUpgradeFetch: argv.includes("--allow-parser-upgrade-fetch"),
    limit: limitIndex >= 0 ? Number(argv[limitIndex + 1]) : undefined,
    chapters: chaptersIndex >= 0
      ? new Set(String(argv[chaptersIndex + 1] ?? "").split(",").map(value => value.trim()).filter(Boolean))
      : undefined,
  };
}

export async function acquireOhioCode(options: {
  allowParserUpgradeFetch?: boolean;
  limit?: number;
  chapters?: Set<string>;
} = {}): Promise<{
  chapters: OhioChapterAcquisition[];
  failures: OhioAcquisitionFailure[];
  sections: number;
}> {
  if (!fs.existsSync(INVENTORY_PATH)) {
    throw new Error(`Chapter inventory is required first: ${INVENTORY_PATH}`);
  }
  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8")) as {
    chapters?: InventoryChapter[];
  };
  let chapters = (inventory.chapters ?? []).filter(chapter => chapter.status === "success");
  if (options.chapters) chapters = chapters.filter(chapter => options.chapters!.has(chapter.chapterNumber));
  if (options.limit !== undefined) chapters = chapters.slice(0, options.limit);
  if (chapters.length === 0) throw new Error("No chapters selected for acquisition");

  // Preflight every selected cache before starting a fetch or writing outputs.
  for (const chapter of chapters) {
    assertParserUpgradeAllowed(path.join(SECTION_CACHE_DIR, `chapter-${chapter.chapterNumber}.json`), options.allowParserUpgradeFetch);
  }

  fs.mkdirSync(SECTION_CACHE_DIR, { recursive: true });
  const fetcher = new OhioOfficialFetcher({
    cacheDir: HTML_CACHE_DIR,
    cacheMaxAgeMs: CACHE_MAX_AGE_MS,
  });

  const acquired: OhioChapterAcquisition[] = [];
  const failures: OhioAcquisitionFailure[] = [];
  const enumeration: Array<Omit<OhioParsedSection, "text"> & { titleNumber: string; textLength: number }> = [];
  let processed = 0;

  for (const chapter of chapters) {
    processed++;
    try {
      // A parsed chapter is reusable on its own. Re-reading it avoids building
      // another DOM for a page that has not changed, which is what lets a
      // statewide re-run finish: JSDOM does not release a full chapter page
      // quickly enough to parse all 971 of them in one process.
      const parsedPath = path.join(SECTION_CACHE_DIR, `chapter-${chapter.chapterNumber}.json`);
      const reusable = readParsedChapter(parsedPath);
      if (reusable) {
        acquired.push({
          chapterNumber: chapter.chapterNumber,
          titleNumber: chapter.titleNumber,
          // A cache written before these fields existed still has the official
          // chapter title in the inventory and the page bytes on disk.
          chapterName: reusable.chapterName ?? chapter.title ?? null,
          sourceUrl: chapter.sourceUrl,
          retrievedAt: reusable.retrievedAt,
          pageHash: reusable.pageHash || hashCachedPage(chapter.sourceUrl),
          sectionCount: reusable.sections.length,
        });
        for (const section of reusable.sections) {
          const { text, ...rest } = section;
          enumeration.push({ ...rest, titleNumber: chapter.titleNumber, textLength: text.length });
        }
        if (processed % 25 === 0 || processed === chapters.length) {
          console.log(
            `[${processed}/${chapters.length}] chapters, ${enumeration.length} sections, ` +
            `${failures.length} failures, ${fetcher.metrics.networkRequests} requests, reused parse`,
          );
        }
        continue;
      }
      const page = await fetcher.fetchPage(chapter.sourceUrl);
      const { heading, sections } = parseOhioChapterPage(page.html, chapter.chapterNumber, page.retrievedAt.slice(0, 10));
      if (sections.length === 0) {
        // An official chapter page that yields no parsable section is a parser
        // or upstream-format problem. Record it instead of silently dropping
        // the chapter from the statewide denominator.
        failures.push({
          chapterNumber: chapter.chapterNumber,
          sourceUrl: chapter.sourceUrl,
          reason: "No sections parsed from the official chapter page",
        });
        continue;
      }
      fs.writeFileSync(
        path.join(SECTION_CACHE_DIR, `chapter-${chapter.chapterNumber}.json`),
        JSON.stringify({
          parserVersion: OHIO_CHAPTER_PARSER_VERSION,
          chapterNumber: chapter.chapterNumber,
          titleNumber: chapter.titleNumber,
          sourceUrl: chapter.sourceUrl,
          retrievedAt: page.retrievedAt,
          chapterName: heading,
          pageHash: createHash("sha256").update(page.html).digest("hex"),
          sections,
        }),
      );
      acquired.push({
        chapterNumber: chapter.chapterNumber,
        titleNumber: chapter.titleNumber,
        chapterName: heading,
        sourceUrl: chapter.sourceUrl,
        retrievedAt: page.retrievedAt,
        pageHash: createHash("sha256").update(page.html).digest("hex"),
        sectionCount: sections.length,
      });
      for (const section of sections) {
        const { text, ...rest } = section;
        enumeration.push({ ...rest, titleNumber: chapter.titleNumber, textLength: text.length });
      }
    } catch (error) {
      failures.push({
        chapterNumber: chapter.chapterNumber,
        sourceUrl: chapter.sourceUrl,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
    if (processed % 25 === 0 || processed === chapters.length) {
      console.log(
        `[${processed}/${chapters.length}] chapters, ${enumeration.length} sections, ` +
        `${failures.length} failures, ${fetcher.metrics.networkRequests} requests, ` +
        `${fetcher.metrics.cacheHits} cache hits`,
      );
    }
  }

  enumeration.sort((a, b) =>
    a.section.localeCompare(b.section, "en", { numeric: true, sensitivity: "base" }));

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({
    schemaVersion: 1,
    parserVersion: OHIO_CHAPTER_PARSER_VERSION,
    discoveryKind: "official_ohio_revised_code_section_enumeration",
    publicationStatus: "discovery_only_not_published",
    generatedAt: new Date().toISOString(),
    source: {
      publisher: "Ohio Legislative Service Commission",
      rootUrl: "https://codes.ohio.gov/ohio-revised-code",
      acquisitionKind: "official_whole_chapter",
    },
    scope: {
      statewideChapterInventory: { status: "complete", chapters: chapters.length },
      statewideSectionEnumeration: {
        status: failures.length === 0 ? "complete" : "incomplete",
        note: "A section is an inventory item. Offence classification is a separate, later step.",
      },
    },
    totals: {
      chaptersAcquired: acquired.length,
      chaptersFailed: failures.length,
      sections: enumeration.length,
      repealedOrReserved: enumeration.filter(row => row.repealed).length,
    },
    chapters: acquired,
    failures,
    sections: enumeration,
  }, null, 2)}\n`);

  return { chapters: acquired, failures, sections: enumeration.length };
}

async function main(): Promise<void> {
  const { limit, chapters } = parseArgs(process.argv.slice(2));
  const result = await acquireOhioCode({ limit, chapters });
  console.log(
    `\nAcquired ${result.chapters.length} chapters, ${result.sections} sections, ` +
    `${result.failures.length} failures. Wrote ${OUTPUT_PATH}`,
  );
  if (result.failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch(error => {
    console.error("Ohio code acquisition failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
