/**
 * Parse a whole official Ohio Revised Code chapter page into its sections.
 *
 * Ohio publishes the complete body text of every section on the chapter page
 * itself, so one official request per chapter yields both the section
 * enumeration and the operative text. Each section lives in a
 * `div.list-content` that holds the numbered heading anchor, the currentness
 * block, and the body. Pairing inside that container avoids relying on the
 * document order of two separate node lists.
 */
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";

export interface OhioParsedSection {
  section: string;
  chapter: string;
  catchline: string;
  sourceUrl: string;
  effectiveDate: string | null;
  latestLegislation: string | null;
  text: string;
  contentHash: string;
  repealed: boolean;
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Preserve paragraph boundaries so quoted spans stay legible and stable. */
function blockText(element: Element): string {
  return normalizeWhitespace(element.textContent ?? "");
}

function parseEffectiveDate(info: string): string | null {
  const match = info.match(/Effective:\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
  if (!match) return null;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  if (month < 0) return null;
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseLatestLegislation(info: string): string | null {
  const match = info.match(/Latest Legislation:\s*(.+?)(?:\s*PDF:|$)/i);
  return match ? normalizeWhitespace(match[1]) || null : null;
}

/**
 * A repealed or reserved section still occupies an official number. It is kept
 * in the inventory so the denominator stays complete, and flagged so it can
 * never be mistaken for a current offense.
 */
function looksRepealed(catchline: string, text: string): boolean {
  return /\b(repealed|renumbered)\b/i.test(catchline) ||
    (text.length < 240 && /\b(repealed|renumbered|reserved)\b/i.test(text));
}

/**
 * Parse heading and sections from one DOM.
 *
 * A JSDOM instance for a full chapter page is large and slow to collect, so
 * building a second one per chapter exhausts the heap partway through a
 * statewide run. Callers doing the whole code should use this and then close
 * the window.
 */
export function parseOhioChapterPage(
  html: string,
  chapterNumber: string,
): { heading: string | null; sections: OhioParsedSection[] } {
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    return {
      heading: headingFrom(document, chapterNumber),
      sections: sectionsFrom(document, chapterNumber),
    };
  } finally {
    dom.window.close();
  }
}

export function parseOhioChapterSections(
  html: string,
  chapterNumber: string,
): OhioParsedSection[] {
  const dom = new JSDOM(html);
  try {
    return sectionsFrom(dom.window.document, chapterNumber);
  } finally {
    dom.window.close();
  }
}

function sectionsFrom(document: Document, chapterNumber: string): OhioParsedSection[] {
  const sections: OhioParsedSection[] = [];
  const seen = new Set<string>();

  for (const item of document.querySelectorAll("table.laws-table div.list-content")) {
    const anchor = item.querySelector(".content-head-text > a[href]");
    if (!anchor) continue;
    const heading = normalizeWhitespace(anchor.textContent ?? "");
    // "Section 2903.01 | Aggravated murder."
    const headingMatch = heading.match(/^Section\s+(\d+\.\d+)\s*\|\s*(.+)$/i);
    const href = anchor.getAttribute("href") ?? "";
    const hrefMatch = href.match(/(?:^|\/)section-(\d+\.\d+)\/?$/i);
    if (!headingMatch || !hrefMatch || headingMatch[1] !== hrefMatch[1]) continue;

    const section = headingMatch[1];
    if (seen.has(section)) continue;
    if (!section.startsWith(`${chapterNumber}.`)) continue;

    const body = item.querySelector("section.laws-body");
    const info = item.querySelector(".laws-section-info");
    const infoText = info ? blockText(info) : "";
    const text = body ? blockText(body) : "";
    const catchline = headingMatch[2].replace(/[.\s]+$/, "").trim();

    seen.add(section);
    sections.push({
      section,
      chapter: chapterNumber,
      catchline,
      sourceUrl: `https://codes.ohio.gov/ohio-revised-code/section-${section}`,
      effectiveDate: parseEffectiveDate(infoText),
      latestLegislation: parseLatestLegislation(infoText),
      text,
      contentHash: createHash("sha256").update(text).digest("hex"),
      repealed: looksRepealed(catchline, text),
    });
  }

  return sections;
}

export function parseOhioChapterHeading(html: string, chapterNumber: string): string | null {
  const dom = new JSDOM(html);
  try {
    return headingFrom(dom.window.document, chapterNumber);
  } finally {
    dom.window.close();
  }
}

function headingFrom(document: Document, chapterNumber: string): string | null {
  const heading = normalizeWhitespace(document.querySelector("h1")?.textContent ?? "");
  const match = heading.match(
    new RegExp(`^Chapter\\s+${chapterNumber.replace(".", "\\.")}\\s*\\|\\s*(.+)$`, "i"),
  );
  return match?.[1]?.replace(/[.;\s]+$/, "").trim() || null;
}
