/**
 * Import Illinois criminal-charge authority from the official ILGA static
 * per-section document server. The committed manifest is seeded later without
 * network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildIllinoisManifestRecord,
  buildIllinoisSourceUrl,
  parseIllinoisCitation,
  type IllinoisAuthorityManifest,
  type IllinoisSourceDocument,
} from "../../server/data/illinois-source-database-seed";

const RATE_LIMIT_MS = 400;
const MAX_RETRIES = 3;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDocument(url: string): Promise<{ html: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": UA, Accept: "text/html, */*" },
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
  return { error: "Illinois source request exhausted retries" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|tr|td|table)>/gi, "\n")
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(/\beff\.?\s+(\d{1,2})-(\d{1,2})-(\d{2,4})/gi)]
    .map((match) => {
      const year = Number(match[3]);
      const fullYear = year < 100 ? 2000 + year : year;
      const month = Number(match[1]);
      const day = Number(match[2]);
      const time = Date.UTC(fullYear, month - 1, day);
      return {
        value: `${fullYear.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        time,
      };
    })
    .filter((date) => Number.isFinite(date.time))
    .sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

export function extractIllinoisDocument(
  html: string,
  chapter: string,
  act: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): IllinoisSourceDocument | null {
  if (html.length >= 70000 || !/\bSec\./i.test(html.slice(0, 3000))) return null;
  const text = decodeHtml(html);
  const heading = new RegExp(
    `(?:^|\\n)\\s*Sec\\.\\s*${escapeRegExp(section)}\\.\\s*([^\\n]+)`,
    "i",
  ).exec(text);
  if (!heading) return null;
  const title = heading[1].replace(/[.;\s]+$/, "").trim();
  if (!title) return null;
  const sourceMatch = text.match(/\(Source:[\s\S]*?\)/i);
  const subdivisionParts = subdivision
    ? [...subdivision.matchAll(/\(([a-z0-9]+)\)|\b(\d+)\b/gi)]
      .map((item) => (item[1] ?? item[2]).toLowerCase())
    : [];
  if (
    !subdivisionParts.every((part) =>
      new RegExp(`\\(${part}\\)|\\b${part}[.)]`, "i").test(text),
    )
  ) return null;
  return {
    chapter,
    act,
    section,
    title,
    text,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: parseEffectiveDate(text),
    sourceEvidence: sourceMatch?.[0] ?? null,
  };
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "IL");
  const documentCache = new Map<string, IllinoisSourceDocument | null>();
  const records = [];

  for (const charge of charges) {
    const references = parseIllinoisCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    let error: string | undefined;
    const documents: IllinoisSourceDocument[] = [];
    for (const reference of references) {
      const cacheKey = [
        reference.chapter,
        reference.act,
        reference.section,
        reference.subdivision ?? "",
      ].join("|");
      let document = documentCache.get(cacheKey);
      if (document === undefined) {
        const url = buildIllinoisSourceUrl(
          reference.chapter,
          reference.act,
          reference.section,
        );
        const response = await fetchDocument(url);
        document = "html" in response
          ? extractIllinoisDocument(
            response.html,
            reference.chapter,
            reference.act,
            reference.section,
            url,
            importedAt,
            reference.subdivision,
          )
          : null;
        documentCache.set(cacheKey, document);
        if (!document) {
          error = "The official Illinois static document did not contain the complete requested section.";
        }
        if ("error" in response) {
          error = `Official Illinois source unavailable: ${response.error}`;
        }
        await sleep(RATE_LIMIT_MS);
      }
      if (document) documents.push(document);
    }
    records.push(buildIllinoisManifestRecord(charge, documents, importedAt, error));
  }

  const manifest: IllinoisAuthorityManifest = {
    jurisdiction: "IL",
    generatedAt: importedAt,
    source: "Illinois General Assembly Illinois Compiled Statutes (ilga.gov)",
    catalogRecords: records,
  };
  const outputPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/il-source-manifest.json",
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const selectable = records.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename",
  );
  console.log(JSON.stringify({
    jurisdiction: "IL",
    manifestRecords: records.length,
    selectableCharges: selectable.length,
    withheldCharges: records.length - selectable.length,
    fetchedDocuments: documentCache.size,
    outputPath,
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Illinois authority import failed:", error);
    process.exitCode = 1;
  });
}