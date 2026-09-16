/**
 * Discovery-only crawl of Ohio's official Revised Code navigation.
 * No database, catalog, or publication files are read or written.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OhioOfficialFetcher, mapWithConcurrency } from "./ohio-discovery/fetcher";
import {
  hasOhioRevisedCodeRootIdentity,
  parseOhioChapterSectionLinks,
  parseOhioPageHeading,
  parseOhioRootTitleLinks,
  parseOhioSectionEvidence,
  parseOhioTitleChapterLinks,
  type OhioLink,
} from "./ohio-discovery/parser";
import {
  OHIO_CODE_ROOT_URL,
  OHIO_DISCOVERY_SCHEMA_VERSION,
  type OhioChapter2903DiscoveryOutput,
  type OhioChapterInventoryRecord,
  type OhioCodeInventoryOutput,
  type OhioDiscoveryFailure,
  type OhioDiscoveryMetrics,
  type OhioTitleInventoryRecord,
} from "./ohio-discovery/types";

const OUTPUT_DIRECTORY = path.resolve(process.cwd(), "scripts/data-review/output");
const CACHE_DIRECTORY = path.resolve(process.cwd(), "scripts/data-review/ohio-discovery/cache");
const CHAPTER_2903_URL = `${OHIO_CODE_ROOT_URL}/chapter-2903`;

function metrics(
  startedAtMs: number,
  finishedAt: string,
  fetcher: OhioOfficialFetcher,
): OhioDiscoveryMetrics {
  return {
    startedAt: new Date(startedAtMs).toISOString(),
    finishedAt,
    elapsedMs: Date.now() - startedAtMs,
    ...fetcher.metrics,
  };
}

function writeOutput(name: string, output: OhioCodeInventoryOutput | OhioChapter2903DiscoveryOutput): void {
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIRECTORY, name), `${JSON.stringify(output, null, 2)}\n`);
}

export async function runOhioCodeDiscovery(): Promise<{
  inventory: OhioCodeInventoryOutput;
  chapter2903: OhioChapter2903DiscoveryOutput;
}> {
  const startedAtMs = Date.now();
  const fetcher = new OhioOfficialFetcher({ cacheDir: CACHE_DIRECTORY });
  const failures: OhioDiscoveryFailure[] = [];
  let root;
  try {
    root = await fetcher.fetchPage(OHIO_CODE_ROOT_URL);
    if (!hasOhioRevisedCodeRootIdentity(root.html)) {
      throw new Error("Official root page did not contain the expected Ohio Revised Code identity.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ stage: "root", identity: "ohio-revised-code", sourceUrl: OHIO_CODE_ROOT_URL, message });
    const finishedAt = new Date().toISOString();
    const inventory: OhioCodeInventoryOutput = {
      schemaVersion: OHIO_DISCOVERY_SCHEMA_VERSION,
      discoveryKind: "official_ohio_revised_code_chapter_inventory",
      publicationStatus: "discovery_only_not_published",
      generatedAt: finishedAt,
      source: { publisher: "Ohio Legislative Service Commission", rootUrl: OHIO_CODE_ROOT_URL, allowedHost: "codes.ohio.gov" },
      scope: {
        statewideChapterInventory: { status: "failed", method: "official root -> title pages -> chapter links", note: "A chapter link is an inventory item, not a determination that the chapter or any section is criminal." },
        statewideSectionEnumeration: { status: "not_run", reason: "The root page could not be retrieved; statewide section enumeration was not attempted." },
      },
      titles: [],
      chapters: [],
      failures,
      metrics: metrics(startedAtMs, finishedAt, fetcher),
    };
    const chapter2903: OhioChapter2903DiscoveryOutput = {
      schemaVersion: OHIO_DISCOVERY_SCHEMA_VERSION,
      discoveryKind: "official_ohio_revised_code_chapter_section_evidence",
      publicationStatus: "discovery_only_not_published",
      generatedAt: finishedAt,
      source: { publisher: "Ohio Legislative Service Commission", rootUrl: OHIO_CODE_ROOT_URL, chapterUrl: CHAPTER_2903_URL, allowedHost: "codes.ohio.gov" },
      scope: {
        chapterId: "chapter-2903",
        chapterSectionEnumeration: { status: "failed", method: "official chapter page -> section links -> section pages", note: "Sections are source inventory records only; this output makes no claim that every section is a crime or a publishable charge." },
        statewideSectionEnumeration: { status: "not_run", reason: "This pilot only enumerates Chapter 2903 section pages." },
      },
      chapter: { chapterNumber: "2903", title: "", sourceUrl: CHAPTER_2903_URL, retrievedAt: finishedAt, status: "failed" },
      sections: [],
      failures,
      metrics: metrics(startedAtMs, finishedAt, fetcher),
    };
    writeOutput("ohio-code-inventory.json", inventory);
    writeOutput("ohio-chapter-2903-discovery.json", chapter2903);
    return { inventory, chapter2903 };
  }

  const titleLinks = parseOhioRootTitleLinks(root.html, root.sourceUrl);
  if (!titleLinks.length) failures.push({ stage: "root", identity: "ohio-revised-code", sourceUrl: root.sourceUrl, message: "No Title links with official Ohio identities were found." });
  const titleResults = await mapWithConcurrency(titleLinks, 3, async (link) => {
    try {
      const page = await fetcher.fetchPage(link.sourceUrl);
      const title = parseOhioPageHeading(page.html, "Title", link.id);
      if (!title) throw new Error(`Official title heading did not match Title ${link.id}`);
      return { link, page, title, chapters: parseOhioTitleChapterLinks(page.html, page.sourceUrl) };
    } catch (error) {
      failures.push({ stage: "title", identity: `title-${link.id}`, sourceUrl: link.sourceUrl, message: error instanceof Error ? error.message : String(error) });
      return null;
    }
  });

  const titles: OhioTitleInventoryRecord[] = titleResults.flatMap((result) => result ? [{
    titleNumber: result.link.id,
    title: result.title,
    sourceUrl: result.page.sourceUrl,
    retrievedAt: result.page.retrievedAt,
    status: "success" as const,
  }] : []);
  const chapterById = new Map<string, OhioChapterInventoryRecord>();
  for (const result of titleResults) {
    if (!result) continue;
    for (const chapter of result.chapters) {
      const previous = chapterById.get(chapter.id);
      if (previous && previous.titleNumber !== result.link.id) {
        failures.push({ stage: "title", identity: `chapter-${chapter.id}`, sourceUrl: chapter.sourceUrl, message: `Chapter link appeared under both Title ${previous.titleNumber} and Title ${result.link.id}.` });
        continue;
      }
      chapterById.set(chapter.id, {
        chapterId: `chapter-${chapter.id}`,
        chapterNumber: chapter.id,
        titleNumber: result.link.id,
        title: chapter.title,
        sourceUrl: chapter.sourceUrl,
        retrievedAt: result.page.retrievedAt,
        status: "success",
        sectionEnumeration: { status: "not_run", reason: "Statewide section enumeration was intentionally not run by this pilot." },
      });
    }
  }
  const chapters = [...chapterById.values()].sort((left, right) => left.chapterNumber.localeCompare(right.chapterNumber, undefined, { numeric: true }));

  let chapter2903Title = "";
  let chapter2903RetrievedAt = new Date().toISOString();
  let sectionLinks: OhioLink[] = [];
  try {
    const page = await fetcher.fetchPage(CHAPTER_2903_URL);
    chapter2903RetrievedAt = page.retrievedAt;
    chapter2903Title = parseOhioPageHeading(page.html, "Chapter", "2903") ?? "";
    if (!chapter2903Title) throw new Error("Official chapter heading did not match Chapter 2903");
    sectionLinks = parseOhioChapterSectionLinks(page.html, page.sourceUrl);
    if (!sectionLinks.length) throw new Error("No Section links with official Ohio identities were found.");
  } catch (error) {
    failures.push({ stage: "chapter", identity: "chapter-2903", sourceUrl: CHAPTER_2903_URL, message: error instanceof Error ? error.message : String(error) });
  }
  const sectionResults = await mapWithConcurrency(sectionLinks, 3, async (link) => {
    try {
      const page = await fetcher.fetchPage(link.sourceUrl);
      const evidence = parseOhioSectionEvidence(page.html, link.id, page.sourceUrl, page.retrievedAt);
      if (!evidence) throw new Error(`Official section page did not contain complete expected evidence for Section ${link.id}`);
      return evidence;
    } catch (error) {
      failures.push({ stage: "section", identity: `section-${link.id}`, sourceUrl: link.sourceUrl, message: error instanceof Error ? error.message : String(error) });
      return null;
    }
  });
  const sections = sectionResults.filter((section): section is NonNullable<typeof section> => section !== null)
    .sort((left, right) => left.sectionId.localeCompare(right.sectionId, undefined, { numeric: true }));
  const finishedAt = new Date().toISOString();

  const inventory: OhioCodeInventoryOutput = {
    schemaVersion: OHIO_DISCOVERY_SCHEMA_VERSION,
    discoveryKind: "official_ohio_revised_code_chapter_inventory",
    publicationStatus: "discovery_only_not_published",
    generatedAt: finishedAt,
    source: { publisher: "Ohio Legislative Service Commission", rootUrl: OHIO_CODE_ROOT_URL, allowedHost: "codes.ohio.gov" },
    scope: {
      statewideChapterInventory: {
        status: failures.some((failure) => failure.stage === "root" || failure.stage === "title") ? "incomplete" : "complete",
        method: "official root -> title pages -> chapter links",
        note: "A chapter link is an inventory item, not a determination that the chapter or any section is criminal.",
      },
      statewideSectionEnumeration: { status: "not_run", reason: "This pilot establishes the statewide chapter inventory and separately enumerates only Chapter 2903 sections." },
    },
    titles,
    chapters,
    failures: failures.filter((failure) => failure.stage === "root" || failure.stage === "title"),
    metrics: metrics(startedAtMs, finishedAt, fetcher),
  };
  const chapter2903: OhioChapter2903DiscoveryOutput = {
    schemaVersion: OHIO_DISCOVERY_SCHEMA_VERSION,
    discoveryKind: "official_ohio_revised_code_chapter_section_evidence",
    publicationStatus: "discovery_only_not_published",
    generatedAt: finishedAt,
    source: { publisher: "Ohio Legislative Service Commission", rootUrl: OHIO_CODE_ROOT_URL, chapterUrl: CHAPTER_2903_URL, allowedHost: "codes.ohio.gov" },
    scope: {
      chapterId: "chapter-2903",
      chapterSectionEnumeration: {
        status: !chapter2903Title ? "failed" : failures.some((failure) => failure.stage === "section") ? "incomplete" : "complete",
        method: "official chapter page -> section links -> section pages",
        note: "Sections are source inventory records only; this output makes no claim that every section is a crime or a publishable charge.",
      },
      statewideSectionEnumeration: { status: "not_run", reason: "This pilot only enumerates Chapter 2903 section pages." },
    },
    chapter: { chapterNumber: "2903", title: chapter2903Title, sourceUrl: CHAPTER_2903_URL, retrievedAt: chapter2903RetrievedAt, status: chapter2903Title ? "success" : "failed" },
    sections,
    failures: [...failures.filter((failure) => failure.stage === "chapter" || failure.stage === "section")],
    metrics: metrics(startedAtMs, finishedAt, fetcher),
  };
  writeOutput("ohio-code-inventory.json", inventory);
  writeOutput("ohio-chapter-2903-discovery.json", chapter2903);
  return { inventory, chapter2903 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  runOhioCodeDiscovery().then(({ inventory, chapter2903 }) => {
    console.log(JSON.stringify({
      inventoryStatus: inventory.scope.statewideChapterInventory.status,
      titles: inventory.titles.length,
      chapters: inventory.chapters.length,
      chapter2903Status: chapter2903.scope.chapterSectionEnumeration.status,
      chapter2903Sections: chapter2903.sections.length,
      failures: inventory.failures.length,
      metrics: inventory.metrics,
      outputs: [
        "scripts/data-review/output/ohio-code-inventory.json",
        "scripts/data-review/output/ohio-chapter-2903-discovery.json",
      ],
    }, null, 2));
  }).catch((error) => {
    console.error("Ohio code discovery failed:", error);
    process.exitCode = 1;
  });
}