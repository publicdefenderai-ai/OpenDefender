import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import {
  OHIO_CODE_HOST,
  type OhioSectionEvidence,
} from "./types";

export interface OhioLink {
  id: string;
  title: string;
  sourceUrl: string;
}

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

export function normalizeOhioHtmlText(html: string): string {
  const withBoundaries = html.replace(/<br\s*\/?>|<\/(?:p|div|li|section|h[1-6]|tr)>/gi, "\n");
  const document = new JSDOM(withBoundaries).window.document;
  return normalizeWhitespace(document.body?.textContent ?? "");
}

export function resolveOfficialOhioUrl(href: string, pageUrl: string): string | null {
  try {
    const url = new URL(href, pageUrl);
    if (url.protocol !== "https:" || url.hostname !== OHIO_CODE_HOST) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function linksMatching(
  html: string,
  pageUrl: string,
  matcher: RegExp,
  prefix: string,
): OhioLink[] {
  const document = new JSDOM(html).window.document;
  const found = new Map<string, OhioLink>();
  for (const anchor of document.querySelectorAll("a[href]")) {
    const href = anchor.getAttribute("href") ?? "";
    const match = href.match(matcher);
    const sourceUrl = resolveOfficialOhioUrl(href, pageUrl);
    if (!match || !sourceUrl) continue;
    const title = normalizeWhitespace(anchor.textContent ?? "")
      .replace(new RegExp(`^${prefix}\\s+[^|]+\\|\\s*`, "i"), "")
      .replace(/[.;\s]+$/, "");
    if (!title) continue;
    found.set(match[1], { id: match[1], title, sourceUrl });
  }
  return [...found.values()].sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
}

export function parseOhioRootTitleLinks(html: string, rootUrl: string): OhioLink[] {
  return linksMatching(html, rootUrl, /(?:^|\/)title-(\d+)\/?$/i, "Title");
}

export function hasOhioRevisedCodeRootIdentity(html: string): boolean {
  const document = new JSDOM(html).window.document;
  return normalizeWhitespace(document.querySelector("h1")?.textContent ?? "")
    .toLowerCase() === "ohio revised code";
}

export function parseOhioTitleChapterLinks(html: string, titleUrl: string): OhioLink[] {
  return linksMatching(html, titleUrl, /(?:^|\/)chapter-(\d+(?:\.\d+)?)\/?$/i, "Chapter");
}

export function parseOhioChapterSectionLinks(html: string, chapterUrl: string): OhioLink[] {
  const document = new JSDOM(html).window.document;
  const indexAnchors = [...document.querySelectorAll("table.laws-table .content-head-text > a[href]")];
  const indexHtml = indexAnchors.map((anchor) =>
    `<a href="${anchor.getAttribute("href") ?? ""}">${anchor.innerHTML}</a>`
  ).join("");
  return linksMatching(indexHtml, chapterUrl, /(?:^|\/)section-(\d+\.\d+)\/?$/i, "Section");
}

export function parseOhioPageHeading(
  html: string,
  expectedKind: "Title" | "Chapter",
  expectedIdentity: string,
): string | null {
  const document = new JSDOM(html).window.document;
  const heading = normalizeWhitespace(document.querySelector("h1")?.textContent ?? "");
  const match = heading.match(new RegExp(`^${expectedKind}\\s+${expectedIdentity.replace(".", "\\.")}\\s*\\|\\s*(.+)$`, "i"));
  return match?.[1]?.replace(/[.;\s]+$/, "").trim() || null;
}

function parseEffectiveDate(html: string): string | null {
  const document = new JSDOM(html).window.document;
  const labels = [...document.querySelectorAll(".label")];
  const label = labels.find((candidate) => normalizeWhitespace(candidate.textContent ?? "") === "Effective:");
  const value = label?.parentElement?.querySelector(".value");
  const written = normalizeWhitespace(value?.textContent ?? "");
  const match = written.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i,
  );
  if (!match) return null;
  const date = new Date(`${match[1]} ${match[2]}, ${match[3]} UTC`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/**
 * Parses only a complete official Ohio section page. This parser retains the
 * section suffix (for example 2903.041) rather than coercing it to a number.
 */
export function parseOhioSectionEvidence(
  html: string,
  expectedSectionId: string,
  sourceUrl: string,
  retrievedAt: string,
): OhioSectionEvidence | null {
  const document = new JSDOM(html).window.document;
  const heading = normalizeWhitespace(document.querySelector("h1")?.textContent ?? "");
  const escaped = expectedSectionId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = heading.match(new RegExp(`^Section\\s+${escaped}\\s*\\|\\s*(.+)$`, "i"));
  const body = document.querySelector("section.laws-body");
  const title = match?.[1]?.replace(/[.;\s]+$/, "").trim();
  const effectiveDate = parseEffectiveDate(html);
  const bodyText = normalizeOhioHtmlText(body?.innerHTML ?? "");
  if (!match || !title || !effectiveDate || !bodyText || bodyText.length < 20 || /Number Not Found/i.test(heading)) {
    return null;
  }
  const normalizedText = `Section ${expectedSectionId} | ${title}.\nEffective: ${effectiveDate}\n${bodyText}`;
  return {
    sectionId: expectedSectionId,
    title,
    sourceUrl,
    retrievedAt,
    effectiveDate,
    normalizedText,
    normalizedTextSha256: createHash("sha256").update(normalizedText).digest("hex"),
    status: "success",
  };
}
