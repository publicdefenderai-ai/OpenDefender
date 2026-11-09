import type { OhioSourceDocument } from "../../../server/data/ohio-source-database-seed";

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
