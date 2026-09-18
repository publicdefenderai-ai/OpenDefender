import { createHash } from "node:crypto";
import { extractFloridaExactPage } from "./florida-pure-extractor";

export const FLORIDA_SOURCE_MAX_AGE_MS = 7 * 24 * 60 * 60_000;
export const floridaHash = (text: string) => createHash("sha256").update(text).digest("hex");
export const floridaSectionPattern = /^[1-9]\d{0,3}\.\d{2,6}$/;

export interface FloridaBatchDocument {
  section: string;
  title: string;
  text: string;
  contentHash: string;
  sourceUrl: string;
  acquiredFrom: string;
  retrievedAt: string;
  effectiveDateStart: string | null;
  edition: string;
  currentnessProvenance: string;
  acquisitionKind: "official_whole_chapter" | "official_exact_section" | "existing_manifest_seed";
}

export interface FloridaBatchCache {
  schemaVersion: 1;
  jurisdiction: "FL";
  documents: Record<string, FloridaBatchDocument>;
  failures: Record<string, { section: string; checkedAt: string; message: string; attemptedUrl: string }>;
}

export function floridaSectionUrl(section: string) {
  const chapter = section.split(".")[0].padStart(4, "0");
  const lower = Math.floor(Number(chapter) / 100) * 100;
  const range = `${String(lower).padStart(4, "0")}-${String(lower + 99).padStart(4, "0")}`;
  return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${range}/${chapter}/Sections/${chapter}.${section.split(".")[1]}.html`;
}

export function floridaChapterUrl(section: string) {
  const chapter = section.split(".")[0].padStart(4, "0");
  const lower = Math.floor(Number(chapter) / 100) * 100;
  const range = `${String(lower).padStart(4, "0")}-${String(lower + 99).padStart(4, "0")}`;
  return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${range}/${chapter}/${chapter}.html`;
}

export function validateFloridaDocument(document: FloridaBatchDocument) {
  const heading = document.text.match(/^([1-9]\d{0,3}\.\d{2,6})\s*\n+(.+?)\n+—/);
  return floridaSectionPattern.test(document.section) &&
    document.sourceUrl === floridaSectionUrl(document.section) &&
    heading?.[1] === document.section &&
    heading?.[2]?.replace(/[.;\s]+$/, "").trim() === document.title &&
    document.text.length >= 30 &&
    floridaHash(document.text) === document.contentHash &&
    Number.isFinite(Date.parse(document.retrievedAt)) &&
    /^Florida Statutes \d{4}$/.test(document.edition);
}

const referencePattern = /\b(?:s(?:s)?\.|section(?:s)?)\s+(\d{2,4}\.\d{2,6})\b/gi;

/** Definition/incorporation and penalty references only; incidental citations remain unexpanded leads. */
export function floridaDirectReferences(document: FloridaBatchDocument) {
  const selected = new Set<string>();
  for (const line of document.text.split("\n")) {
    if (!/means? (?:the same as|as defined)|has the same meaning|as provided in s\. 775\.08[234]|punishable as provided|reclassified|penalt(?:y|ies)|sentenc/i.test(line)) continue;
    for (const match of line.matchAll(referencePattern)) {
      if (floridaSectionPattern.test(match[1]) && match[1] !== document.section) selected.add(match[1]);
    }
  }
  return [...selected].sort();
}

export function extractFloridaEdition(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ");
  const year = text.match(/\bFlorida Statutes\s+(20\d{2})\b/i)?.[1] ??
    html.match(/<option\s+value=["']?(20\d{2})["']?\s+selected\b/i)?.[1];
  return year ? `Florida Statutes ${year}` : null;
}

export function extractExactFloridaDocument(
  html: string, section: string, acquiredFrom: string, retrievedAt: Date, edition: string,
): FloridaBatchDocument | null {
  const sourceUrl = floridaSectionUrl(section);
  const source = extractFloridaExactPage(html, section);
  if (!source) return null;
  // Online Sunshine occasionally places a footnote backlink immediately before
  // SectionNumber (for example "1" + "562.111"). It is not part of the heading/body.
  const text = source.text.startsWith(section) ? source.text :
    source.text.replace(new RegExp(`^\\d{1,2}(?=${section.replace(".", "\\.")}\\s)`), "");
  const document: FloridaBatchDocument = {
    section, title: source.title, text, contentHash: floridaHash(text),
    sourceUrl, acquiredFrom, retrievedAt: retrievedAt.toISOString(),
    effectiveDateStart: source.effectiveDateStart, edition,
    currentnessProvenance: `Edition label read from official Online Sunshine response: ${edition}`,
    acquisitionKind: acquiredFrom === sourceUrl ? "official_exact_section" : "official_whole_chapter",
  };
  return validateFloridaDocument(document) ? document : null;
}