import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileOhioSubstantiveReview, type SubstantiveFinding } from "./batch/substantive-review";
import { textHash, type BatchDocument } from "./batch/source-batch";
import type { OhioBatchTarget } from "./batch/ohio-review-report";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../../server/data/ohio-chapter-2903-source";

const directory = resolve("scripts/data-review/output");
const read = (name: string) => JSON.parse(readFileSync(resolve(directory, name), "utf8"));
const write = (name: string, text: string) => {
  const path = resolve(directory, name), temporary = `${path}.tmp`;
  writeFileSync(temporary, text);
  renameSync(temporary, path);
};
const escape = (value: unknown) => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]!));
const cell = (value: unknown) => {
  const text = String(value ?? "");
  return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
};

export function runOhioSubstantiveReview() {
  const batch = read("ohio-batch-review.json") as {
    inputHash: string; targets: OhioBatchTarget[];
    groups: Array<{ section: string; manualQuestions: unknown[] }>;
  };
  const findings = read("ohio-substantive-findings.json") as SubstantiveFinding[];
  const documents: Record<string, BatchDocument> = {
    ...read("ohio-batch-source-cache.json").documents,
    ...read("ohio-substantive-supplemental-evidence.json").documents,
  };
  // The original acquisition snapshot defines the finite analysis assignment.
  // Already-reviewed configured-only sections are not re-opened as generic questions.
  const report = compileOhioSubstantiveReview({
    findings, documents, targets: batch.targets,
    requiredSections: batch.groups.filter(group => group.manualQuestions.length).map(group => group.section),
    existingSourceFirst: OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(record => ({
      id: record.chargeId, code: record.offense.section, name: record.canonicalTitle,
    })),
  });
  const background = read("ohio-hmo-legislation-background.json") as { sourceUrl: string; text: string };
  for (const question of report.manualQuestions) {
    if (question.section === "2903.13") question.backgroundEvidence = {
      ...background, contentHash: textHash(background.text),
    };
  }
  write("ohio-substantive-review.json", JSON.stringify(report, null, 2) + "\n");
  const status = report.readyForFocusedManualReview
    ? "Ready for focused manual review within the stated scope."
    : "Agent work remains. This is not a completed manual-review handoff.";
  const lines = [
    "# Ohio — focused manual review", "", status, "",
    `Prepared: ${report.generatedAt}`, "",
    "Scope: the current Ohio catalog plus the remaining Chapter 2903 inventory. This is not a complete statewide inventory, runtime expansion, publication approval, or Spanish/Chinese sign-off.", "",
    `- ${report.summary.analyzedSections} prior generic review groups substantively analyzed.`,
    `- ${report.summary.routineOffenseSections} routine offense sections; ${report.summary.supportingOrProcedureSections} supporting/procedural sections.`,
    `- ${report.summary.preparedDrafts} structured source-first drafts; ${report.summary.alreadySourceFirstSections} sections already covered by existing source-first records.`,
    `- ${report.summary.specificLegalQuestions} specific legal questions; ${report.summary.technicalWorkItems} remaining agent-owned technical items.`,
    "- No new runtime charges. Existing selectable records are unchanged. Legacy aliases remain withheld; they are not a manual-review prerequisite for independently supported statutory names.", "",
    "## Questions requiring a legal decision", "",
  ];
  for (const q of report.manualQuestions) {
    lines.push(`### §${q.section} — ${q.title}`, "", String(q.question), "",
      `Official source: ${q.sourceUrl}`, `Evidence SHA-256: ${q.sourceHash}`, "");
    for (const quote of q.evidence as Array<{ text: string; section: string }>) lines.push(`> §${quote.section}: ${quote.text}`, "");
    if (q.backgroundEvidence) {
      const background = q.backgroundEvidence as { sourceUrl: string; text: string };
      lines.push(`Official legislation background: ${background.sourceUrl}`, `> ${background.text}`, "");
    }
    lines.push("Decision: ______", "Controlling authority / explanation: ______", "");
  }
  if (report.technicalWork.length) {
    lines.push("## Agent-owned work — not attorney questions", "");
    for (const item of report.technicalWork) lines.push(`- §${item.section}: ${item.resolution}; missing sources: ${(item.missingSources as string[]).join(", ") || "see resolution"}`);
  }
  lines.push("", "## Completed routine analysis", "", "| Section | Classification | Resolution |", "|---|---|---|");
  for (const row of report.rows) lines.push(`| ${row.section} | ${row.classification} | ${row.resolution.replace(/\|/g, "\\|").replace(/\n/g, " ")} |`);
  lines.push("", "## Audit files", "",
    "- ohio-substantive-findings.json: persistent, hash-bound analysis.",
    "- ohio-substantive-review.json: all drafts, exact quoted spans, complete primary/supporting source text and dispositions.",
    "- ohio-focused-manual-review.csv: only the specific unresolved legal questions.",
    "- The older ohio-batch-manual-review files are pre-analysis acquisition backlog, not the current attorney handoff.", "");
  write("ohio-focused-manual-review.md", lines.join("\n"));
  const csv = [
    ["section", "question", "official_source", "source_hash", "decision", "controlling_authority_or_explanation"],
    ...report.manualQuestions.map(q => [q.section, q.question, q.sourceUrl, q.sourceHash, "", ""]),
  ];
  write("ohio-focused-manual-review.csv", csv.map(row => row.map(cell).join(",")).join("\n") + "\n");
  const questions = report.manualQuestions.map(q => {
    const background = q.backgroundEvidence as { sourceUrl: string; text: string } | undefined;
    return `<section><h2>§${escape(q.section)} — ${escape(q.title)}</h2><p>${escape(q.question)}</p><p><a href="${escape(q.sourceUrl)}">Official statute</a></p><details><summary>Exact evidence</summary>${(q.evidence as Array<{ text: string; section: string }>).map(quote => `<blockquote><b>§${escape(quote.section)}</b> ${escape(quote.text)}</blockquote>`).join("")}${background ? `<p><a href="${escape(background.sourceUrl)}">Official legislation background</a></p><blockquote>${escape(background.text)}</blockquote>` : ""}<small>SHA-256: ${escape(q.sourceHash)}</small></details><p><b>Decision:</b> ____________________</p><p><b>Controlling authority / explanation:</b> ____________________</p></section>`;
  }).join("");
  const routine = report.rows.map(row => `<tr><td>§${escape(row.section)}</td><td>${escape(row.classification)}</td><td>${escape(row.resolution)}</td></tr>`).join("");
  write("ohio-focused-manual-review.html", `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ohio focused manual review</title><style>body{font:16px/1.6 system-ui,sans-serif;color:#172b3a;background:#f6f8fa;margin:0}main{max-width:1000px;margin:auto;padding:32px 20px}h1,h2{line-height:1.25}section{background:white;padding:24px;margin:24px 0;border:1px solid #ccd5de;border-radius:8px}a{color:#075ea5}small,td{overflow-wrap:anywhere}blockquote{margin:16px 0;padding:12px;border-left:3px solid #54738c;background:#f5f7f9}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ccd5de;padding:10px;text-align:left;vertical-align:top}.scroll{overflow:auto}summary{cursor:pointer;font-weight:600}@media print{body{background:white}section{break-inside:avoid}}</style><main><h1>Ohio: focused manual review</h1><p><b>${escape(status)}</b></p><p>${report.summary.analyzedSections} prior groups analyzed · ${report.summary.preparedDrafts} source-first drafts · ${report.summary.specificLegalQuestions} specific legal questions · ${report.summary.technicalWorkItems} technical items</p><p>Prepared ${escape(report.generatedAt)}. Scope: the current Ohio catalog and remaining Chapter 2903 inventory—not a complete statewide inventory. No charges added or published. Legacy aliases stay withheld; routine statutory records do not depend on resolving those aliases.</p>${questions}<details><summary>Completed analysis and dispositions (${report.rows.length} sections)</summary><div class="scroll"><table><thead><tr><th>Section</th><th>Classification</th><th>Resolution</th></tr></thead><tbody>${routine}</tbody></table></div></details><p>Complete hash-bound source text, candidate conduct and grading, and supporting evidence are preserved in ohio-substantive-review.json. Spanish/Chinese release sign-off and publication approval are separate.</p></main></html>`);
  console.log(JSON.stringify({ ...report.summary, readyForFocusedManualReview: report.readyForFocusedManualReview }, null, 2));
  if (!report.readyForFocusedManualReview) process.exitCode = 2;
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { runOhioSubstantiveReview(); } catch (error) { console.error(error); process.exitCode = 1; }
}