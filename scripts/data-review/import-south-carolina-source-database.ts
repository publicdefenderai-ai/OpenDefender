/**
 * Import South Carolina catalog citations from the official Legislature
 * Code of Laws chapter pages. The committed manifest is later seeded without
 * network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildSouthCarolinaManifestRecord,
  buildSouthCarolinaSourceUrl,
  parseSouthCarolinaCitation,
  type SouthCarolinaAuthorityManifest,
  type SouthCarolinaSourceDocument,
} from "../../server/data/south-carolina-source-database-seed";

const RATE_LIMIT_MS = 700;
const MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChapter(url: string): Promise<{ html: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "OpenDefender-SouthCarolinaAuthorityImporter/1.0",
          Accept: "text/html, */*",
        },
      });
      if (response.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      if (!response.ok) return { error: `HTTP ${response.status}` };
      return { html: await response.text() };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { error: "South Carolina source request exhausted retries" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const EFFECTIVE_DATE_PATTERN =
  /\beff(?:ective)?\.?\s*(?:on\s+)?(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;
const MONTH_NAMES: Record<string, string> = {
  jan: "January", january: "January", feb: "February", february: "February",
  mar: "March", march: "March", apr: "April", april: "April", may: "May",
  jun: "June", june: "June", jul: "July", july: "July", aug: "August",
  august: "August", sep: "September", sept: "September", september: "September",
  oct: "October", october: "October", nov: "November", november: "November",
  dec: "December", december: "December",
};

export function extractLatestSouthCarolinaEffectiveDate(text: string): string | null {
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
    .filter((date) => Number.isFinite(date.time))
    .sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

export function extractSouthCarolinaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): SouthCarolinaSourceDocument | null {
  const marker = new RegExp(
    `<span[^>]*>\\s*SECTION\\s+${section.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\.\\s*</span>`,
    "i",
  );
  const match = marker.exec(html);
  if (!match) return null;
  const nextMarker = /<span[^>]*>\s*SECTION\s+\d+-\d+-\d+\.\s*<\/span>/gi;
  nextMarker.lastIndex = match.index + match[0].length;
  const next = nextMarker.exec(html);
  const rawBlock = html.slice(match.index + match[0].length, next?.index ?? html.length);
  const decoded = decodeHtml(rawBlock);
  const [titleLine, ...rest] = decoded.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = titleLine?.replace(/[.;\s]+$/, "").trim();
  if (!title || !rest.length) return null;
  const text = `SECTION ${section}. ${title}\n${rest.join("\n")}`.trim();
  const subdivisionParts = subdivision
    ? [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
      .map((item) => (item[1] ?? item[2]).toLowerCase())
    : [];
  if (
    !/\bHISTORY:/i.test(text) ||
    !subdivisionParts.every((part) => new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text))
  ) return null;
  return {
    section,
    title,
    text,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestSouthCarolinaEffectiveDate(text),
  };
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "SC");
  const chapterCache = new Map<string, { html: string } | { error: string }>();
  const documentCache = new Map<string, SouthCarolinaSourceDocument | null>();
  const records = [];

  for (const charge of charges) {
    const references = parseSouthCarolinaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    let error: string | undefined;
    const documents: SouthCarolinaSourceDocument[] = [];
    for (const reference of references) {
      const cacheKey = `${reference.section}|${reference.subdivision ?? ""}`;
      let document = documentCache.get(cacheKey);
      if (document === undefined) {
        const url = buildSouthCarolinaSourceUrl(reference.section);
        let chapter = chapterCache.get(url);
        if (!chapter) {
          chapter = await fetchChapter(url);
          chapterCache.set(url, chapter);
          await sleep(RATE_LIMIT_MS);
        }
        document = "html" in chapter
          ? extractSouthCarolinaDocument(
            chapter.html,
            reference.section,
            url,
            importedAt,
            reference.subdivision,
          )
          : null;
        documentCache.set(cacheKey, document);
        if (!document) error = "The official South Carolina chapter page did not contain the complete requested section and history.";
        if ("error" in chapter) error = `Official South Carolina source unavailable: ${chapter.error}`;
      }
      if (document) documents.push(document);
    }
    records.push(buildSouthCarolinaManifestRecord(charge, documents, importedAt, error));
  }

  const manifest: SouthCarolinaAuthorityManifest = {
    jurisdiction: "SC",
    generatedAt: importedAt,
    source: "South Carolina Legislature Code of Laws (scstatehouse.gov)",
    catalogRecords: records,
  };
  const outputPath = path.resolve(process.cwd(), "scripts/data-review/output/sc-source-manifest.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const selectable = records.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename",
  );
  console.log(JSON.stringify({
    jurisdiction: "SC",
    manifestRecords: records.length,
    selectableCharges: selectable.length,
    withheldCharges: records.length - selectable.length,
    fetchedChapters: chapterCache.size,
    outputPath,
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("South Carolina authority import failed:", error);
    process.exitCode = 1;
  });
}