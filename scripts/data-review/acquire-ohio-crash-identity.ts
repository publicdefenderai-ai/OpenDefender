/** Bounded primary + one-hop evidence acquisition. Never writes runtime sources or receipts. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractOhioDocument } from "./ohio-discovery/section-document";
import { extractOhioCrossReferences, extractOhioOffences, extractOhioLocalGrades } from "./ohio-discovery/offense-extractor";
import publication from "../../shared/ohio-crash-identity-publication.json";
const PRIMARY_SECTIONS = ["4549.021","4549.03","4549.08","4549.11","4549.12","4549.20","4549.62"];
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
type Document = { section: string; title: string; sourceUrl: string; text: string; contentHash: string; effectiveDateStart: string; retrievedAt: string };
const OUTPUT = "scripts/data-review/output/ohio-crash-identity-evidence.json";
export function bindOhioResearchIdentity(document: Document) {
  if (hash(document.text) !== document.contentHash) throw new Error(`Ohio research text hash mismatch: ${document.section}`);
  const names = extractOhioOffences(document.text, document.section);
  for (const name of names) for (const span of [name.guiltClause, ...name.grades.map(g => g.span)]) {
    const exact = document.text.slice(span.start, span.end);
    // The discovery extractor normalizes whitespace for display. Restore the
    // exact source slice, accepting no wording change, for this bound packet.
    if (exact.replace(/\s+/g, " ").trim() !== span.text.replace(/\s+/g, " ").trim()) throw new Error(`Ohio research span mismatch: ${document.section}`);
    span.text = exact;
  }
  return { section: document.section, sourceUrl: document.sourceUrl, sourceHash: document.contentHash,
    effectiveDate: document.effectiveDateStart, heading: document.title, names,
    // Preserve whole clauses too: name extraction can miss compound names.
    guiltContexts: [...document.text.matchAll(/[^\n]*guilty of[^\n]*/gi)].map(match =>
      ({start: match.index!, end: match.index! + match[0].length, text: match[0]})),
    localGrades: extractOhioLocalGrades(document.text),
    references: extractOhioCrossReferences(document.text, document.section),
    status: "source_bound_research_not_publication_approval" };
}
export async function acquireOhioCrashIdentity(reuse: {documents?: Record<string, Document>} = {}) {

  const cachePath = ".cache/ohio-crash-identity-acquisitions.json";
  const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {documents: {}};
  reuse = {documents: {...reuse.documents, ...cache.documents}};
  const checkpoint = (document: Document) => {
    cache.documents[document.section] = document;
    mkdirSync(".cache", {recursive: true});
    writeFileSync(cachePath, JSON.stringify(cache));
  };
  const startedAt = new Date().toISOString();
  const documents: Record<string, Document> = {};
  const failures: Record<string, string> = {};
  let requests = 0, reused = 0;
  async function acquire(section: string) {
    if (documents[section] || failures[section]) return;
    if (!/^\d+\.\d+$/.test(section)) throw new Error(`Invalid section: ${section}`);
    const sourceUrl = `https://codes.ohio.gov/ohio-revised-code/section-${section}`;
    const old = reuse.documents?.[section];
    const now = new Date();
    if (old && old.section === section && old.sourceUrl === sourceUrl && hash(old.text) === old.contentHash &&
        Date.parse(old.retrievedAt) <= now.getTime() && Date.parse(old.retrievedAt) > now.getTime() - 7 * 86400000 &&
        Date.parse(old.effectiveDateStart) <= now.getTime()) {
      documents[section] = old; reused++; return;
    }
    try {
      if (requests >= 180) throw new Error("Research request budget exhausted");
      await new Promise(resolve => setTimeout(resolve, 1000));
      requests++;
      const acquired = new Date();
      const response = await fetch(sourceUrl, {redirect: "manual", signal: AbortSignal.timeout(30000), headers: {Accept: "text/html"}});
      if (!response.ok) {
        const missing = response.headers.get("location") === `/ohio-revised-code/number-not-found/section-${section}`;
        throw new Error(missing ? "Official publisher number-not-found redirect; no replacement inferred" : `Official source HTTP ${response.status}`);
      }
      const html = await response.text();
      const extracted = extractOhioDocument(html, section, sourceUrl, acquired);
      if (!extracted || !extracted.effectiveDateStart || Date.parse(extracted.effectiveDateStart) > acquired.getTime()) throw new Error("Missing or future-effective official source");
      documents[section] = {...extracted, effectiveDateStart: extracted.effectiveDateStart, contentHash: hash(extracted.text), retrievedAt: acquired.toISOString()};
      checkpoint(documents[section]);
    } catch (error) { failures[section] = String(error); }
  }
  for (const section of PRIMARY_SECTIONS) await acquire(section);
  const primaryRows = PRIMARY_SECTIONS.filter(s => documents[s]).map(s => bindOhioResearchIdentity(documents[s]));
  const dependencies = [...new Set([...primaryRows.flatMap(row => row.references), ...(publication as Array<{dependencies: string[]}>).flatMap(row => row.dependencies),
    "2901.01", "2901.22",  "2929.13", "2929.14", "2929.18", "2929.24", "2929.28", "2929.32", "2929.144"])].sort();
  console.log(`Primary sections: ${primaryRows.length}; first-hop/shared references: ${dependencies.length}`);
  for (const section of dependencies.filter(section => !/^chapter-\d+$/.test(section))) await acquire(section);
  const result = { schemaVersion: 1, kind: "ohio_crash-identity_primary_and_one_hop_research", startedAt,
    completedAt: new Date().toISOString(), requests, reused,
    publicationStatus: "research_only_no_runtime_pin_or_receipt_changes",
    primarySections: PRIMARY_SECTIONS,
    primaryRows: primaryRows.map(row => ({...row, references: row.references.map(section => ({section,
      status: /^chapter-\d+$/.test(section) ? "chapter_scope_requires_review" : documents[section] ? "retained_applicability_unreviewed" : "unavailable",
      sourceHash: documents[section]?.contentHash ?? null}))})),
    unresolvedBoundary: "One-hop citations are not dependency closure. Secondary references, applicability, case law, sentencing alternatives and enforceability require substantive review before publication.",
    documents, failures };
  writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({primaries: primaryRows.length, documents: Object.keys(documents).length,
    namedCandidates: primaryRows.reduce((n, r) => n + r.names.length, 0), requests, reused, failures}));
  return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const reusePath = process.argv.find(arg => arg.startsWith("--reuse="))?.slice(8);
  await acquireOhioCrashIdentity(reusePath ? JSON.parse(readFileSync(reusePath, "utf8")) : {});
}
