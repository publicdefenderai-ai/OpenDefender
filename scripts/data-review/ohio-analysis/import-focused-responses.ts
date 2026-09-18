/**
 * Deliberate curation of the supplied three-row response sheet. This is NOT a
 * generic "yes means publish" importer. Different submissions require new review.
 */
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { textHash, type BatchDocument } from "../batch/source-batch";
import type { SubstantiveFinding } from "../batch/substantive-review";
import { applyOhioReviewResponses, type SubstantiveResponseLedger } from "../batch/substantive-responses";

const filePath = "attached_assets/ohio-focused-manual-review_1789707133778.csv";
const contentHash = "c5932d912d95fa4e84bc2d578e47492776349a646f879a1f9ea52b8aba426fcc";
const output = resolve("scripts/data-review/output");
const read = (name: string) => JSON.parse(readFileSync(resolve(output, name), "utf8"));
const write = (name: string, value: unknown) => {
  const path = resolve(output, name);
  writeFileSync(`${path}.tmp`, JSON.stringify(value, null, 2) + "\n");
  renameSync(`${path}.tmp`, path);
};
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let index = 0; index < input.length; index++) {
    const char = input[index], next = input[index + 1];
    if (char === '"' && quoted && next === '"') { field += '"'; index++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = []; field = "";
    } else field += char;
  }
  if (quoted) throw new Error("Unterminated CSV quote");
  if (field.length || row.length) rows.push([...row, field]);
  return rows;
}
const decode = (html: string) => html.replace(/<\/(?:p|div)>/gi, " ").replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([a-f0-9]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&(quot|apos|nbsp|lt|gt|amp);/g, (_, name: string) =>
    ({ quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">", amp: "&" }[name]!))
  .replace(/\s+/g, " ").trim();

async function main() {
  const csv = readFileSync(resolve(filePath), "utf8");
  if (textHash(csv) !== contentHash) throw new Error("Submission differs from the deliberately reviewed response sheet");
  const [headers, ...rows] = parseCsv(csv);
  if (headers.join(",") !== "section,question,official_source,source_hash,decision,controlling_authority_or_explanation" ||
      rows.length !== 3 || rows.some(row => row.length !== 6) ||
      rows.map(row => row[0]).sort().join(",") !== "2903.13,2903.16,2923.01") throw new Error("Unexpected response sheet shape");
  const findings = read("ohio-substantive-findings.json") as SubstantiveFinding[];
  const documents: Record<string, BatchDocument> = {
    ...read("ohio-batch-source-cache.json").documents,
    ...read("ohio-substantive-supplemental-evidence.json").documents,
  };
  const url = "https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01";
  const response = await fetch(url, { signal: AbortSignal.timeout(25_000) });
  if (!response.ok || response.url !== url) throw new Error("Official HMO rule acquisition failed");
  const html = await response.text();
  const heading = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const bodyHtml = html.match(/<section class="laws-body"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  const effectiveText = decode(html.match(/Effective:\s*<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
  if (!/^Rule 3701-12-01\s*\|\s*Definitions\./.test(heading) || !bodyHtml || !Number.isFinite(Date.parse(effectiveText))) {
    throw new Error("Wrong or incomplete administrative rule");
  }
  const effectiveDateStart = new Date(effectiveText).toISOString().slice(0, 10);
  const now = new Date().toISOString();
  if (effectiveDateStart > now.slice(0, 10)) throw new Error("HMO rule is not effective yet");
  const body = decode(bodyHtml);
  const definition = body.match(/\(M\) "Health maintenance organization"[\s\S]+?(?= \(N\))/)?.[0];
  if (!definition || !body.startsWith("As used in Chapter 3701-12 of the Administrative Code:")) {
    throw new Error("Missing HMO definition or rule scope");
  }
  const text = `${heading}\nEffective: ${effectiveDateStart}\n${body}`;
  const rule: BatchDocument = {
    section: "OAC:3701-12-01", title: "Definitions", sourceUrl: url, acquiredFrom: url,
    effectiveDateStart, retrievedAt: now, text, contentHash: textHash(text),
  };
  documents[rule.section] = rule;
  const ledger: SubstantiveResponseLedger = {
    schemaVersion: 1, submission: { filePath, contentHash, importedAt: now },
    decisions: rows.map(([section, question, officialSource, sourceHash, decision, note]) => {
      const original = findings.find(finding => finding.section === section);
      if (!original || question !== original.question || sourceHash !== original.sourceHash) {
        throw new Error(`Response does not match baseline finding: ${section}`);
      }
      const candidates = structuredClone(original.candidates);
      const relatedSections = [...original.relatedSections];
      const evidenceQuotes = [...(original.evidenceQuotes ?? [])];
      let interpretation: string;
      if (section === "2903.13") {
        interpretation = "Apply the reviewer's interpretation using Ohio Administrative Code 3701-12-01(M) for the HMO definition in the hospital-related assault enhancement. Preserve §2903.13(C)(8)'s victim, duty/location and other statutory conditions and (E)(19)'s hospital scope; do not treat every HMO employee as a hospital employee regardless of those conditions. The administrative rule expressly defines terms for Chapter 3701-12: applying it here is the recorded reviewer's legal interpretation, not an automatic statutory amendment or a claim that the rule itself cross-references the assault statute.";
        candidates[0].grading = "M1 baseline with the explicit (C) enhancements retained. Apply the hospital/HMO-related branch under the recorded reviewer interpretation using OAC 3701-12-01(M), subject to the full statutory hospital, victim and duty/location conditions.";
        candidates[0].evidenceQuotes.push(definition);
        relatedSections.push(rule.section);
        evidenceQuotes.push("As used in Chapter 3701-12 of the Administrative Code:", definition);
      } else if (section === "2903.16") {
        interpretation = "Apply the reviewer's reading: every violation of the reckless branch (B) already requires serious physical harm, so (C)(2)'s serious-harm condition makes it F4. Do not offer M2 as an available outcome for this branch. Preserve the statute's literal M2 recital as source evidence, not as an operative grading option. The knowing (A)/(C)(1) branch remains M1 or F4 according to resulting harm, with all caretaker definitions and exclusions unchanged.";
        const reckless = candidates.find(candidate => candidate.name === "recklessly failing to provide for a person with a functional impairment");
        if (!reckless) throw new Error("Missing reckless-neglect draft");
        reckless.grading = "(B)/(C)(2): F4 under the recorded reviewer interpretation, because every (B) violation requires resulting serious physical harm. M2 is not an available outcome for this branch; retain the literal recital only in source evidence.";
      } else {
        interpretation = "Apply the reviewer's correction: use §2913.421 for the email/computer predicates named in §2923.01(A), and apply conspiracy's (J) grading to the applicable predicate degree. Preserve the official conspiracy text's literal §2923.421 citation unchanged in the evidence and label §2913.421 as the reviewer-directed correction, not a publisher correction. Other predicates, the overt-act requirement, defenses and the general grading algorithm remain unchanged.";
        candidates[0].conduct += " For the named email/computer predicates, use §2913.421 under the recorded reviewer correction; the source itself prints §2923.421.";
        candidates[0].grading += " For email/computer predicates, determine the applicable §2913.421 degree (including its enhancement branches), then apply (J); do not substitute the predicate's grade directly for the conspiracy grade.";
      }
      return {
        section, sourceHash, findingHash: textHash(JSON.stringify(original)), question,
        officialSource, decision, note, disposition: "apply_interpretation_to_draft" as const,
        interpretation, authorityUrls: [officialSource, ...(note.startsWith("https://") ? [note] : [])],
        relatedSections, candidates, evidenceQuotes,
        reviewedSourceHashes: Object.fromEntries([section, ...relatedSections].map(key => [key, documents[key].contentHash])),
      };
    }),
  };
  applyOhioReviewResponses(findings, documents, ledger);
  write("ohio-substantive-review-authorities.json", { schemaVersion: 1, documents: { [rule.section]: rule } });
  write("ohio-substantive-review-decisions.json", ledger);
  console.log("Recorded three draft-only review resolutions; original source text and baseline findings unchanged.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });