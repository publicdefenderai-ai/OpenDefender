/**
 * Import and verify the complete Texas catalog against the Texas Legislative
 * Council's TCSS static HTML resources. This is the only Texas authority
 * retrieval path. The committed manifest is later seeded without network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildTexasManifestRecord,
  buildTexasSourceUrl,
  parseTexasCitation,
  type TexasAuthorityManifest,
  type TexasSourceDocument,
} from "../../server/data/texas-source-database-seed";

const TCSS_BASE = "https://tcss.legis.texas.gov/resources";
const RATE_LIMIT_MS = 350;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChapter(url: string): Promise<{ html: string } | { error: string }> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent": "OpenDefender-TexasAuthorityImporter/1.0 (legal-aid-platform)",
        Accept: "text/html, */*",
        Referer: "https://statutes.capitol.texas.gov/",
      },
    });
    if (!response.ok) return { error: `HTTP ${response.status}` };
    return { html: await response.text() };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EFFECTIVE_DATE_PATTERN = /\beff\.\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;
const MONTH_NAMES: Record<string, string> = {
  jan: "January",
  january: "January",
  feb: "February",
  february: "February",
  mar: "March",
  march: "March",
  apr: "April",
  april: "April",
  may: "May",
  jun: "June",
  june: "June",
  jul: "July",
  july: "July",
  aug: "August",
  august: "August",
  sep: "September",
  sept: "September",
  september: "September",
  oct: "October",
  october: "October",
  nov: "November",
  november: "November",
  dec: "December",
  december: "December",
};

export function extractLatestEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(EFFECTIVE_DATE_PATTERN)]
    .map((match) => {
      const month = MONTH_NAMES[match[1].toLowerCase()];
      const day = Number(match[2]);
      const year = Number(match[3]);
      return {
        value: `${month} ${day}, ${year}`,
        time: Date.UTC(year, new Date(`${month} 1, 2000`).getUTCMonth(), day),
      };
    })
    .filter((date) => Number.isFinite(date.time));
  dates.sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

function extractDocument(
  html: string,
  code: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
): TexasSourceDocument | null {
  const anchor = `<a name="${section}"></a>`;
  const start = html.indexOf(anchor);
  if (start < 0) return null;
  // TCSS places a second numeric/internal anchor immediately after the
  // section anchor. The next section starts at its own paragraph container,
  // not at the next <a name> tag.
  const next = html.indexOf('<p class="left"><a name="', start + anchor.length);
  const block = html.slice(start, next < 0 ? html.length : next);
  const sectionPattern = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = block.match(new RegExp(
    `Sec\\.\\s*${sectionPattern}\\.\\s*([^<]+)</a>`,
    "i",
  ));
  if (!heading) return null;
  const title = heading[1].replace(/\s+/g, " ").trim();
  const text = decodeHtml(block);
  return {
    code,
    section,
    title,
    text,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestEffectiveDate(text),
  };
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const txCharges = criminalCharges.filter((charge) => charge.jurisdiction === "TX");
  const cache = new Map<string, string | null>();
  const errors = new Map<string, string>();
  let requests = 0;

  for (const charge of txCharges) {
    const references = parseTexasCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    for (const reference of references) {
      const chapter = reference.section.split(".")[0];
      const chapterKey = `${reference.code}.${chapter}`;
      if (cache.has(chapterKey)) continue;
      if (requests > 0) await sleep(RATE_LIMIT_MS);
      const chapterUrl = `${TCSS_BASE}/${reference.code}/htm/${reference.code}.${chapter}.htm`;
      const result = await fetchChapter(chapterUrl);
      requests++;
      if ("error" in result) {
        cache.set(chapterKey, null);
        errors.set(chapterKey, result.error);
        console.error(`[FAIL] ${chapterKey}: ${result.error}`);
      } else {
        cache.set(chapterKey, result.html);
        console.log(`[OK] ${chapterKey}`);
      }
    }
  }

  const catalogRecords = txCharges.map((charge) => {
    const references = parseTexasCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    const documents: TexasSourceDocument[] = [];
    for (const reference of references) {
      const chapter = reference.section.split(".")[0];
      const chapterKey = `${reference.code}.${chapter}`;
      const html = cache.get(chapterKey);
      const sourceUrl = buildTexasSourceUrl(reference.code, chapter, reference.section);
      if (!html) continue;
      const document = extractDocument(
        html,
        reference.code,
        reference.section,
        sourceUrl,
        importedAt,
      );
      if (document) documents.push(document);
    }
    const record = buildTexasManifestRecord(
      charge,
      documents,
      importedAt,
      references.some((reference) => !cache.get(`${reference.code}.${reference.section.split(".")[0]}`))
        ? "TCSS could not be retrieved for one or more required provisions."
        : undefined,
    );
    console.log(
      `[${record.disposition}] ${record.chargeId}${record.canonicalTitle ? `: ${record.canonicalTitle}` : ""}`,
    );
    return record;
  });

  const manifest: TexasAuthorityManifest = {
    jurisdiction: "TX",
    generatedAt: importedAt,
    source: "Texas Legislative Council TCSS static HTML (tcss.legis.texas.gov/resources)",
    catalogRecords,
  };
  const outputPath = path.join(process.cwd(), "scripts/data-review/output/tx-source-manifest.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify({
    outputPath,
    catalogRecords: catalogRecords.length,
    retained: catalogRecords.filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename").length,
    withheld: catalogRecords.filter((record) =>
      record.disposition !== "retain" && record.disposition !== "exact_alias_rename").length,
    sources: new Set(catalogRecords.flatMap((record) =>
      record.provisions.map((provision) => provision.sourceKey))).size,
    snapshots: catalogRecords.reduce((sum, record) => sum + record.provisions.length, 0),
    requests,
    chapterErrors: Object.fromEntries(errors),
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Texas source database import failed:", error);
    process.exit(1);
  });
}