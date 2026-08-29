/**
 * Import Ohio criminal-charge authority from official codes.ohio.gov section
 * pages. The committed manifest is later seeded without network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildOhioManifestRecord,
  buildOhioSourceUrl,
  OHIO_MANIFEST_SOURCE,
  parseOhioCitation,
  type OhioAuthorityManifest,
  type OhioSourceDocument,
} from "../../server/data/ohio-source-database-seed";

const RATE_LIMIT_MS = 700;
const MAX_RETRIES = 3;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36 OpenDefender-OhioAuthorityImporter/1.0";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSection(url: string): Promise<{ html: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": UA, Accept: "text/html, */*" },
      });
      const html = await response.text();
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
          await sleep(2500 * (attempt + 1));
          continue;
        }
        return { error: `HTTP ${response.status}` };
      }
      if (!html.includes("Effective")) {
        return { error: "Official page did not contain an Effective marker" };
      }
      return { html };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { error: "Ohio source request exhausted retries" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|li|section|h1)>/gi, "\n")
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

function parseEffectiveDate(html: string): string | null {
  const info = html.match(
    /<div class="label">\s*Effective:\s*<\/div>\s*<div class="value">([\s\S]*?)<\/div>/i,
  );
  const value = info ? decodeHtml(info[1]) : "";
  const match = value.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i,
  );
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]}, ${match[3]} UTC`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

export function extractOhioDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
): OhioSourceDocument | null {
  const h1Html = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const h1 = h1Html ? decodeHtml(h1Html) : "";
  const heading = h1.match(/^Section\s+(\d+\.\d+)\s*\|\s*(.+)$/i);
  const bodyHtml = html.match(
    /<section class="laws-body"[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1];
  const effectiveDateStart = parseEffectiveDate(html);
  if (
    !heading ||
    heading[1] !== section ||
    !bodyHtml ||
    !effectiveDateStart ||
    /Number Not Found/i.test(h1)
  ) return null;
  const body = decodeHtml(bodyHtml);
  if (body.length < 20) return null;
  return {
    section,
    title: heading[2].replace(/[.;\s]+$/, "").trim(),
    text: `${h1}\nEffective: ${effectiveDateStart}\n${body}`,
    sourceUrl,
    retrievedAt,
    effectiveDateStart,
  };
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "OH");
  const documentCache = new Map<string, OhioSourceDocument | null>();
  const errors = new Map<string, string>();
  let requests = 0;

  for (const charge of charges) {
    const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    for (const reference of references) {
      if (documentCache.has(reference.section)) continue;
      if (requests > 0) await sleep(RATE_LIMIT_MS);
      const sourceUrl = buildOhioSourceUrl(reference.section);
      const response = await fetchSection(sourceUrl);
      requests++;
      const document = "html" in response
        ? extractOhioDocument(response.html, reference.section, sourceUrl, importedAt)
        : null;
      documentCache.set(reference.section, document);
      if (!document) {
        errors.set(reference.section, "Official Ohio page did not contain the expected complete section structure");
        console.error(`[FAIL] ${reference.section}: ${"error" in response ? response.error : "invalid section structure"}`);
      } else {
        console.log(`[OK] ${reference.section} — ${document.title}`);
      }
    }
  }

  const catalogRecords = charges.map((charge) => {
    const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    const documents = references.flatMap((reference) => {
      const document = documentCache.get(reference.section);
      return document ? [document] : [];
    });
    const missing = references.find((reference) => !documentCache.get(reference.section));
    return buildOhioManifestRecord(
      charge,
      documents,
      importedAt,
      missing
        ? `Ohio Revised Code section ${missing.section} could not be verified.`
        : undefined,
    );
  });
  const manifest: OhioAuthorityManifest = {
    jurisdiction: "OH",
    generatedAt: importedAt,
    source: OHIO_MANIFEST_SOURCE,
    catalogRecords,
  };
  const outputPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/oh-source-manifest.json",
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const selectable = catalogRecords.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename");
  console.log(JSON.stringify({
    jurisdiction: "OH",
    manifestRecords: catalogRecords.length,
    selectableCharges: selectable.length,
    withheldCharges: catalogRecords.length - selectable.length,
    fetchedDocuments: documentCache.size,
    requests,
    sectionErrors: Object.fromEntries(errors),
    outputPath,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Ohio authority import failed:", error);
    process.exitCode = 1;
  });
}