import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import type { OhioChapter2903OfficialDocument, OhioChapter2903QuotedSpan } from "./ohio-chapter-2903-source";

type Acquired = Omit<OhioChapter2903OfficialDocument,
  "retrievedAt" | "quotedSpans" | "citation" | "subdivision"> & { retrievedAt: string };

/** Acquisition output is never approval: callers supply separately reviewed pins. */
export function createOhioEvidenceReader(path: string, pins: Record<string, string>) {
  const acquired = JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8")).documents as Acquired[];
  return (section: string, subdivision: string | null,
    evidence: Array<[OhioChapter2903QuotedSpan["kind"], string]>): OhioChapter2903OfficialDocument => {
    const matches = acquired.filter(row => row.section === section);
    const row = matches[0];
    if (matches.length !== 1 || !row || !pins[section] ||
        createHash("sha256").update(row.text).digest("hex") !== pins[section] ||
        row.contentHash !== pins[section] ||
        row.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${section}` ||
        !row.text.startsWith(`Section ${section} |\n${row.title}.\nEffective: ${row.effectiveDateStart}\n`) ||
        !Number.isFinite(new Date(row.retrievedAt).getTime())) {
      throw new Error(`Ohio evidence is not the reviewed official text: ${section}`);
    }
    const spans: OhioChapter2903QuotedSpan[] = [];
    for (const [kind, prefix] of [
      ["title", row.title], ["currentness", `Effective: ${row.effectiveDateStart}`], ...evidence,
    ] as Array<[OhioChapter2903QuotedSpan["kind"], string]>) {
      const quote = kind === "title" || kind === "currentness"
        ? prefix : row.text.split("\n").find(line => line.startsWith(prefix));
      if (!quote) throw new Error(`Missing reviewed ${kind} span in ${section}: ${prefix}`);
      const start = row.text.indexOf(quote);
      spans.push({ kind, quote, start, end: start + quote.length });
    }
    return { ...row, retrievedAt: new Date(row.retrievedAt), subdivision,
      citation: `Ohio Rev. Code Ann. § ${section}${subdivision ?? ""}`, quotedSpans: spans };
  };
}