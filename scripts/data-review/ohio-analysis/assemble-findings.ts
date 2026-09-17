/**
 * Deliberate import of this review's recorded findings, not a legal-review engine.
 * Source hashes must still equal those returned by the analysts. Only exact
 * quoted text (or uniquely expanded omissions) can enter the sealed findings.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SubstantiveFinding } from "../batch/substantive-review";
import type { BatchDocument } from "../batch/source-batch";
import { textHash } from "../batch/source-batch";

const directory = resolve("scripts/data-review/output");
const read = (name: string) => JSON.parse(readFileSync(resolve(directory, name), "utf8"));
const documents: Record<string, BatchDocument> = {
  ...read("ohio-batch-source-cache.json").documents,
  ...read("ohio-substantive-supplemental-evidence.json").documents,
};
const revisions = new Map<string, SubstantiveFinding>();
for (const name of ["main-findings", "middle-findings", "outer-findings", "outer-completed"]) {
  for (const finding of read(`ohio-substantive-${name}.json`) as SubstantiveFinding[]) {
    revisions.set(finding.section, finding);
  }
}
const errors: string[] = [];
let expandedQuotes = 0;
const findings = [...revisions.values()].sort((a, b) => a.section.localeCompare(b.section)).map(finding => {
  const document = documents[finding.section];
  if (!document || document.contentHash !== finding.sourceHash || textHash(document.text) !== finding.sourceHash) {
    throw new Error(`Analyst primary evidence changed: ${finding.section}`);
  }
  // This source was an unrelated reference in the initial main-agent draft.
  if (finding.section === "2903.13") finding.relatedSections = finding.relatedSections.filter(section => section !== "3937.41");
  const sources = [document, ...finding.relatedSections.map(section => documents[section]).filter(Boolean)];
  const exactQuote = (annotated: string) => {
    const tag = annotated.match(/^\[([^\]]+)\]\s*/);
    const section = tag?.[1].match(/^\d+\.\d+/)?.[0];
    const quote = annotated.slice(tag?.[0].length ?? 0);
    const allowed = section ? sources.filter(source => source.section === section) : sources;
    for (const source of allowed) {
      const offset = source.text.indexOf(quote);
      if (offset >= 0) return quote;
      const insensitive = source.text.toLowerCase().indexOf(quote.toLowerCase());
      if (insensitive >= 0) return source.text.slice(insensitive, insensitive + quote.length);
    }
    if (quote.includes("...")) {
      const fragments = quote.split("...").map(part => part.trim().toLowerCase()).filter(Boolean);
      const matches = allowed.flatMap(source => source.text.split("\n").filter(line => {
        let from = 0;
        for (const fragment of fragments) {
          const offset = line.toLowerCase().indexOf(fragment, from);
          if (offset < 0) return false;
          from = offset + fragment.length;
        }
        return true;
      }));
      if (matches.length === 1) { expandedQuotes++; return matches[0]; }
    }
    errors.push(`${finding.section}: ${annotated}`);
    return annotated;
  };
  const candidates = finding.candidates.map(candidate => ({
    ...candidate, evidenceQuotes: candidate.evidenceQuotes.map(exactQuote),
  }));
  return {
    ...finding, candidates,
    // Negative/procedural findings retain the complete operative body as evidence.
    evidenceQuotes: finding.evidenceQuotes?.map(exactQuote) ??
      (candidates.length ? [] : [document.text.split("\n").slice(3).join("\n")]),
    relatedSourceHashes: Object.fromEntries(finding.relatedSections.filter(section => documents[section])
      .map(section => [section, documents[section].contentHash])),
  };
});
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else {
  writeFileSync(resolve(directory, "ohio-substantive-findings.json"), JSON.stringify(findings, null, 2) + "\n");
  console.log({ findings: findings.length, uniquelyExpandedQuotes: expandedQuotes,
    missingRelated: findings.flatMap(finding => finding.relatedSections.filter(section => !documents[section]).map(section => `${finding.section} -> ${section}`)) });
}