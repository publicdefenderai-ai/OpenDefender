/** Replay recorded official pages offline; stage and validate before replacing caches. */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOhioChapterPage } from "./ohio-discovery/chapter-parser";
import { OHIO_CHAPTER_PARSER_VERSION } from "./ohio-discovery/section-status";
import { validateOhioSnapshot, type OhioCachedChapter, type OhioEnumeration } from "./ohio-discovery/snapshot-accounting";

const ROOT = process.cwd();
const CACHE = path.join(ROOT, ".cache/ohio-chapters");
const HTML = path.join(ROOT, "scripts/data-review/ohio-discovery/cache");
const ENUM = path.join(ROOT, "scripts/data-review/output/ohio-code-enumeration.json");
const RECEIPT = path.join(ROOT, "scripts/data-review/output/ohio-source-status-replay.json");
const STAGE = path.join(ROOT, `.cache/ohio-parser-v${OHIO_CHAPTER_PARSER_VERSION}-staged`);
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
type RecordedChapter = OhioEnumeration["chapters"][number] & { sourceUrl: string; pageHash: string; chapterName: string | null };

export function verifyRecordedPage(page: { schemaVersion: number; sourceUrl: string; retrievedAt: string; html: string }, chapter: RecordedChapter): void {
  if (page.schemaVersion !== 1 || page.sourceUrl !== chapter.sourceUrl ||
      page.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/chapter-${chapter.chapterNumber}` ||
      page.retrievedAt !== chapter.retrievedAt || !page.html || hash(page.html) !== chapter.pageHash) {
    throw new Error(`Recorded Ohio page does not match snapshot: ${chapter.chapterNumber}`);
  }
}

function readPage(chapter: RecordedChapter) {
  const page = JSON.parse(fs.readFileSync(path.join(HTML, `${hash(chapter.sourceUrl)}.json`), "utf8"));
  verifyRecordedPage(page, chapter);
  return page as { html: string; retrievedAt: string };
}

function worker(chapters: RecordedChapter[]) {
  for (const chapter of chapters) {
    const page = readPage(chapter);
    const parsed = parseOhioChapterPage(page.html, chapter.chapterNumber, chapter.retrievedAt.slice(0, 10));
    fs.writeFileSync(path.join(STAGE, `chapter-${chapter.chapterNumber}.json`), JSON.stringify({
      parserVersion: OHIO_CHAPTER_PARSER_VERSION, chapterNumber: chapter.chapterNumber,
      titleNumber: chapter.titleNumber, sourceUrl: chapter.sourceUrl,
      retrievedAt: chapter.retrievedAt, pageHash: chapter.pageHash, chapterName: parsed.heading,
      sections: parsed.sections,
    }));
  }
}

function main(apply: boolean) {
  const started = Date.now();
  const originalText = fs.readFileSync(ENUM, "utf8");
  const original = JSON.parse(originalText);
  const chapters: RecordedChapter[] = original.chapters;
  const oldCaches: OhioCachedChapter[] = chapters.map(chapter => JSON.parse(fs.readFileSync(path.join(CACHE, `chapter-${chapter.chapterNumber}.json`), "utf8")));
  validateOhioSnapshot(oldCaches, original);
  // Preflight every source before doing any parse work. No network fallback.
  for (const chapter of chapters) readPage(chapter);
  if (fs.existsSync(STAGE)) throw new Error(`Replay staging directory already exists: ${STAGE}`);
  fs.mkdirSync(STAGE, { recursive: true });
  // Bound JSDOM lifetime by process, avoiding the statewide heap growth seen
  // with a single long-lived DOM parser. This is local work, not parallel crawling.
  for (let offset = 0; offset < chapters.length; offset += 25) {
    const batch = chapters.slice(offset, offset + 25);
    const child = spawnSync(process.execPath, ["--import", "tsx", fileURLToPath(import.meta.url), "--worker", ...batch.map(row => row.chapterNumber)], {
      cwd: ROOT, encoding: "utf8", timeout: 180_000, maxBuffer: 1_000_000,
    });
    if (child.status !== 0) throw new Error(`Ohio replay batch failed: ${child.error?.message ?? child.stderr}`);
    console.log(`Reparsed ${Math.min(offset + 25, chapters.length)}/${chapters.length} chapters from recorded pages`);
  }
  const nextCaches: OhioCachedChapter[] = chapters.map(chapter => JSON.parse(fs.readFileSync(path.join(STAGE, `chapter-${chapter.chapterNumber}.json`), "utf8")));
  const sections = nextCaches.flatMap(chapter => chapter.sections.map(({ text, ...row }) => ({ ...row, titleNumber: chapter.titleNumber, textLength: text.length })))
    .sort((a, b) => a.section.localeCompare(b.section, "en", { numeric: true, sensitivity: "base" }));
  // This replay is deliberately status-only. Source/citation/text changes need
  // a separate review rather than silently joining a metadata repair.
  const oldSections = new Map<string, any>(original.sections.map((row: any) => [row.section, row]));
  if (sections.length !== oldSections.size) throw new Error("Ohio replay changed the section denominator");
  for (const section of sections) {
    const old = oldSections.get(section.section);
    for (const key of ["chapter", "titleNumber", "catchline", "sourceUrl", "effectiveDate", "latestLegislation", "contentHash", "textLength"] as const) {
      if (!old || old[key] !== (section as any)[key]) throw new Error(`Ohio replay changed source evidence: ${section.section} ${key}`);
    }
  }
  const next = { ...original, parserVersion: OHIO_CHAPTER_PARSER_VERSION,
    generatedAt: new Date().toISOString(),
    source: { ...original.source, replayOfEnumerationHash: hash(originalText), replayOfGeneratedAt: original.generatedAt },
    totals: { ...original.totals, repealedOrReserved: sections.filter(row => row.repealed).length }, sections };
  validateOhioSnapshot(nextCaches, next);
  const nextText = `${JSON.stringify(next, null, 2)}\n`;
  const statusCounts: Record<string, number> = {};
  for (const row of sections) statusCounts[row.sourceStatus!.kind] = (statusCounts[row.sourceStatus!.kind] ?? 0) + 1;
  const changes = sections.filter(row => row.repealed !== oldSections.get(row.section).repealed || row.sourceStatus!.kind !== "operative_text")
    .map(row => ({ section: row.section, catchline: row.catchline, sourceUrl: row.sourceUrl, contentHash: row.contentHash,
      previouslySuppressed: oldSections.get(row.section).repealed, repealed: row.repealed, sourceStatus: row.sourceStatus }));
  const receipt = { schemaVersion: 1, publicationStatus: "discovery_only_not_published",
    parserVersion: OHIO_CHAPTER_PARSER_VERSION, priorEnumerationHash: hash(originalText), enumerationHash: hash(nextText),
    sourceRetrievalDatesPreserved: true, pageHashesPreserved: true, sectionEvidenceUnchanged: true,
    chapters: chapters.length, sections: sections.length, networkRequests: 0,
    previouslySuppressed: original.sections.filter((row: any) => row.repealed).length,
    noLongerMarkedInactive: sections.filter(row => oldSections.get(row.section).repealed && !row.repealed).length,
    statusCounts, elapsedSeconds: Math.round((Date.now() - started) / 1000), changes };
  fs.writeFileSync(`${STAGE}.enumeration.json`, nextText);
  fs.writeFileSync(`${STAGE}.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  if (apply) {
    if (hash(fs.readFileSync(ENUM, "utf8")) !== hash(originalText)) throw new Error("Ohio enumeration changed during replay; staged output not applied");
    const backup = `${CACHE}.before-v${OHIO_CHAPTER_PARSER_VERSION}-${hash(originalText).slice(0, 12)}`;
    if (fs.existsSync(backup)) throw new Error(`Replay backup already exists: ${backup}`);
    fs.renameSync(CACHE, backup);
    fs.writeFileSync(`${backup}.enumeration.json`, originalText);
    fs.renameSync(STAGE, CACHE);
    fs.renameSync(`${STAGE}.enumeration.json`, ENUM);
    fs.renameSync(`${STAGE}.receipt.json`, RECEIPT);
  }
  console.log(JSON.stringify({ ...receipt, changes: `${changes.length} rows in receipt`, applied: apply }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === "--worker") {
    const selected = new Set(process.argv.slice(3));
    const chapters = JSON.parse(fs.readFileSync(ENUM, "utf8")).chapters as RecordedChapter[];
    worker(chapters.filter(row => selected.has(row.chapterNumber)));
  } else main(process.argv.includes("--apply"));
}
