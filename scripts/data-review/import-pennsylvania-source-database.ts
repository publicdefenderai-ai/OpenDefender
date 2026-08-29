/**
 * Import Pennsylvania catalog citations from the official Pennsylvania
 * General Assembly Consolidated Statutes site. This is the only command that
 * calls the government source; production seeding uses the committed manifest.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildPennsylvaniaManifestRecord,
  buildPennsylvaniaOfficialSourceUrl,
  buildPennsylvaniaSourceUrl,
  parsePennsylvaniaCitation,
  type PennsylvaniaAuthorityManifest,
  type PennsylvaniaSourceDocument,
  type PennsylvaniaSourceReference,
} from "../../server/data/pennsylvania-source-database-seed";

const RATE_LIMIT_MS = 900;
const MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RequestLimiter {
  lastRequestAt: number | null;
}

async function waitForRateLimit(limiter: RequestLimiter): Promise<void> {
  if (limiter.lastRequestAt !== null) {
    const remaining = RATE_LIMIT_MS - (Date.now() - limiter.lastRequestAt);
    if (remaining > 0) await sleep(remaining);
  }
  limiter.lastRequestAt = Date.now();
}

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
  return Number.isFinite(retryAfter) && retryAfter >= 0
    ? Math.min(retryAfter * 1000, 10_000)
    : 2_000 * (attempt + 1);
}

async function fetchHtml(
  url: string,
  limiter: RequestLimiter,
): Promise<{ html: string; url: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await waitForRateLimit(limiter);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          "User-Agent": "OpenDefender-PennsylvaniaAuthorityImporter/1.0",
          Accept: "text/html, */*",
        },
      });
      const retryable = response.status === 429 || response.status >= 500;
      if (!response.ok && retryable && attempt < MAX_RETRIES) {
        await sleep(retryDelay(response, attempt));
        continue;
      }
      if (!response.ok) return { error: `HTTP ${response.status}` };
      return { html: await response.text(), url: response.url || url };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { error: "Pennsylvania source request exhausted retries" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span|td|tr|li|h[1-6])>/gi, "\n")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&sect;/gi, "§")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sourceFrameUrl(html: string, sourceUrl: string): string | null {
  const frame = html.match(/<(?:frame|iframe)\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
  const frameSource = frame?.[1] ?? frame?.[2] ?? frame?.[3];
  if (!frameSource) return null;
  try {
    return new URL(frameSource, sourceUrl).toString();
  } catch {
    return null;
  }
}

function sectionMarker(section: string): RegExp {
  const escapedSection = escapeRegex(section);
  return new RegExp(`(?:^|§\\s*)${escapedSection}\\s*(?=\\.)`, "im");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractPennsylvaniaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
): PennsylvaniaSourceDocument | null {
  const text = decodeHtml(html);
  if (!sectionMarker(section).test(text)) return null;
  const escapedSection = escapeRegex(section);
  const titleMatch = text.match(new RegExp(
    `(?:^|§\\s*)${escapedSection}\\s*[.]\\s*([^\\n.]{2,160})`,
    "im",
  ));
  if (!titleMatch) return null;
  const title = titleMatch[1].replace(/\s+/g, " ").trim();
  const start = text.search(sectionMarker(section));
  const body = text.slice(Math.max(0, start), Math.min(text.length, start + 50000)).trim();
  if (body.length < 40 || /page cannot be found|invalid section|error occurred/i.test(body)) return null;
  return {
    title,
    section,
    text: body,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestEffectiveDate(body),
  };
}

const EFFECTIVE_DATE_PATTERN =
  /\b(?:effective|eff\.?)\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;

const PENNSYLVANIA_OFFICIAL_HOSTS = new Set([
  "www.palegis.us",
  "palegis.us",
  "www.legis.state.pa.us",
  "legis.state.pa.us",
]);

function isPennsylvaniaOfficialUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && PENNSYLVANIA_OFFICIAL_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function extractLatestEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(EFFECTIVE_DATE_PATTERN)].map((match) => {
    const value = `${match[1]} ${match[2]}, ${match[3]}`;
    const time = Date.parse(value);
    return { value, time };
  }).filter((date) => Number.isFinite(date.time)).sort((a, b) => b.time - a.time);
  return dates[0]?.value ?? null;
}

export async function fetchPennsylvaniaDocument(
  reference: PennsylvaniaSourceReference,
  retrievedAt: Date,
  limiter: RequestLimiter = { lastRequestAt: null },
): Promise<PennsylvaniaSourceDocument | null> {
  const canonicalUrl = buildPennsylvaniaSourceUrl(reference.title, reference.section);
  const retrievalUrls = [
    buildPennsylvaniaOfficialSourceUrl(reference.title, reference.section),
    canonicalUrl,
  ];

  for (const retrievalUrl of retrievalUrls) {
    const page = await fetchHtml(retrievalUrl, limiter);
    if ("error" in page) continue;
    if (!isPennsylvaniaOfficialUrl(page.url)) continue;
    let document = extractPennsylvaniaDocument(
      page.html,
      reference.section,
      canonicalUrl,
      retrievedAt,
    );
    if (document) return document;

    // The legacy site used a frameset, and a migrated page may still expose
    // one while redirecting. Traverse only same-authority official URLs and
    // retain the canonical manifest URL on any successful document.
    const frameUrl = sourceFrameUrl(page.html, page.url);
    if (frameUrl && isPennsylvaniaOfficialUrl(frameUrl)) {
      const frame = await fetchHtml(frameUrl, limiter);
      if (!("error" in frame)) {
        if (!isPennsylvaniaOfficialUrl(frame.url)) continue;
        document = extractPennsylvaniaDocument(
          frame.html,
          reference.section,
          canonicalUrl,
          retrievedAt,
        );
        if (document) return document;
      }
    }
  }
  return null;
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const charges = criminalCharges.filter((charge) => charge.jurisdiction === "PA");
  const documentCache = new Map<string, PennsylvaniaSourceDocument | null>();
  const requestLimiter: RequestLimiter = { lastRequestAt: null };
  let requests = 0;

  for (const charge of charges) {
    const references = parsePennsylvaniaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    for (const reference of references) {
      const key = `${reference.title}:${reference.section}`;
      if (documentCache.has(key)) continue;
      const document = await fetchPennsylvaniaDocument(reference, importedAt, requestLimiter);
      requests++;
      documentCache.set(key, document);
      if (document) console.log(`[OK] ${reference.title} Pa.C.S. § ${reference.section}: ${document.title}`);
      else console.error(`[FAIL] ${reference.title} Pa.C.S. § ${reference.section}`);
    }
  }

  const records = charges.map((charge) => {
    const references = parsePennsylvaniaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    const documents = references.flatMap((reference) => {
      const document = documentCache.get(`${reference.title}:${reference.section}`);
      return document ? [document] : [];
    });
    const missing = references.find((reference) =>
      !documentCache.get(`${reference.title}:${reference.section}`),
    );
    return buildPennsylvaniaManifestRecord(
      charge,
      documents,
      importedAt,
      missing
        ? `Official Pennsylvania General Assembly section ${missing.title}-${missing.section} could not be verified.`
        : undefined,
    );
  });
  const manifest: PennsylvaniaAuthorityManifest = {
    jurisdiction: "PA",
    generatedAt: importedAt,
    source: "Pennsylvania General Assembly Consolidated Statutes (legis.state.pa.us)",
    catalogRecords: records,
  };
  const outputPath = path.join(process.cwd(), "scripts/data-review/output/pa-source-manifest.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify({
    outputPath,
    catalogRecords: records.length,
    retained: records.filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename").length,
    withheld: records.filter((record) =>
      record.disposition !== "retain" && record.disposition !== "exact_alias_rename").length,
    sources: new Set(records.flatMap((record) =>
      record.provisions.map((provision) => provision.sourceKey))).size,
    snapshots: records.reduce((sum, record) => sum + record.provisions.length, 0),
    requests,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Pennsylvania source database import failed:", error);
    process.exit(1);
  });
}