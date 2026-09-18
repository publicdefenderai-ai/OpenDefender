import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "scripts/data-review/output");
const readJson = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const manifest = readJson("scripts/data-review/output/fl-source-manifest.json");
const inventory = readJson("scripts/data-review/output/florida-coverage-inventory.json");
const receipt = readJson("scripts/data-review/output/florida-reviewed-refresh-receipt.json");
const batchEAnalysis = readJson("scripts/data-review/output/florida-reviewed-analysis-e.json");
const batchFAnalysis = readJson("scripts/data-review/output/florida-reviewed-analysis-f.json");
const batchEDefinitions = readJson("shared/florida-reviewed-data/e.json");
const batchFDefinitions = readJson("shared/florida-reviewed-data/f.json");
const recoveryFindings = readJson("scripts/data-review/output/florida-recovery-leads/findings.json");
const recoveryReceipt = readJson("scripts/data-review/output/florida-recovery-leads/acquisition-receipt.json");

if (!Array.isArray(manifest.catalogRecords)) throw new Error("Florida manifest catalogRecords is missing");
if (!Array.isArray(inventory.rows)) throw new Error("Florida coverage inventory rows is missing");
if (!Array.isArray(batchFDefinitions) || batchFDefinitions.length !== 9) {
  throw new Error(`Expected 9 selectable batch-f definitions; found ${batchFDefinitions?.length ?? "none"}`);
}

const cleanup = manifest.catalogRecords.filter(row => row.disposition === "require_exact_reselection");
if (cleanup.length !== 92) throw new Error(`Expected 92 Florida legacy holds; found ${cleanup.length}`);

const recoveredEId = "fl-fs-893-147-4-b-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials";
const recentDefinitions = [
  batchEDefinitions.find(row => row.id === recoveredEId),
  ...batchFDefinitions,
];
if (recentDefinitions.some(row => !row) || recentDefinitions.length !== 10) {
  throw new Error("The recovered batch-E record plus nine batch-F definitions were not found");
}
const allAnalysis = [...batchEAnalysis, ...batchFAnalysis];
const analysisById = new Map(allAnalysis.map(row => [row.id, row]));
const recentAnalysis = recentDefinitions.map(definition => analysisById.get(definition.id));
if (recentAnalysis.some(row => !row || row.status !== "eligible")) {
  throw new Error("Every prioritized new addition must have an eligible analysis");
}
const definitionsById = new Map(recentDefinitions.map(row => [row.id, row]));
const recoveryUrlByAuthority = new Map(
  recoveryReceipt.receipts.map(row => [row.authority, row.finalUrl]),
);
if (recoveryFindings.authorities.length !== 5 ||
    recoveryFindings.authorities.some(row => !row.sourceSupportRecovered || !recoveryUrlByAuthority.get(row.authority))) {
  throw new Error("Expected five recovered official authorities with actual source URLs");
}
const dueBefore = new Date(Date.parse(receipt.expiresAt) - 2 * 24 * 60 * 60 * 1000).toISOString();
const inventoryScopeRows = inventory.rows.filter(row => row.rowKind === "scope");
const inventoryByCleanupId = new Map();
for (const row of inventoryScopeRows) {
  for (const id of row.legacyCleanupQueueIds ?? []) {
    if (!inventoryByCleanupId.has(id)) inventoryByCleanupId.set(id, row);
  }
}

const floridaUrl = section => {
  if (!section) return "";
  const chapter = section.split(".")[0].padStart(4, "0");
  const band = `${chapter.slice(0, 2)}00-${chapter.slice(0, 2)}99`;
  return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${band}/${chapter}/Sections/${chapter}.${section.split(".")[1]}.html`;
};

const sectionFromCode = code => String(code ?? "").match(/^(\d{3,4}\.\d{2,6})/)?.[1] ?? "";
const citationFor = code => code ? `Fla. Stat. § ${code}` : "";

function triageReason(reason) {
  const text = String(reason ?? "");
  if (/does not exactly support every cited/i.test(text)) return "exact_citation_or_subdivision_mismatch";
  if (/not an exact or explicitly reviewed mapping/i.test(text)) return "label_to_official_title_identity_unresolved";
  if (/could not be verified|no current|unavailable|not available/i.test(text)) return "current_authority_unavailable";
  return "other_manifest_reason—read_verbatim_reason";
}

function legacyQuestion(row) {
  const category = triageReason(row.dispositionReason);
  if (category === "exact_citation_or_subdivision_mismatch") {
    return `For ${citationFor(row.catalogCode)}, should record ${row.chargeId} be corrected to an exact reviewed subdivision, split into multiple records, or removed? Supply the exact citation(s) and action.`;
  }
  if (category === "label_to_official_title_identity_unresolved") {
    return `Does the official provision at ${citationFor(row.catalogCode)} support the legacy label “${row.catalogLabel}” at this exact scope? If not, choose correct, split, reclassify, deduplicate, or remove and state the exact mapping.`;
  }
  if (category === "current_authority_unavailable") {
    return `What current authority, if any, supports record ${row.chargeId} at ${citationFor(row.catalogCode)}? Keep held unless the exact current source and scope are supplied.`;
  }
  return `What explicit catalog action—publish, hold, correct, split, reclassify, deduplicate, or remove—should apply to ${row.chargeId}, and at what exact statutory scope?`;
}

const sourceUrlForAnalysis = entry => {
  const definition = definitionsById.get(entry.id);
  return definition?.citations?.[0]?.url ?? floridaUrl(entry.section ?? sectionFromCode(entry.code));
};

const recentRows = recentAnalysis.map((entry, index) => {
  const definition = definitionsById.get(entry.id);
  const text = definition?.text;
  return {
    queue_order: index + 1,
    queue_group: index === 0 ? "new_selectable_recovered_batch_e" : "new_selectable_batch_f",
    record_id: entry.id,
    legacy_label: "",
    proposed_name: definition?.name ?? entry.identity?.quote ?? "",
    statutory_scope: definition?.code ?? entry.code ?? entry.section,
    citation: citationFor(definition?.code ?? entry.code ?? entry.section),
    source_url: sourceUrlForAnalysis(entry),
    existing_status: entry.status,
    triage_reason: "new_selectable_development_record_requires_attorney_review",
    evidence_or_hold_reason: entry.reason,
    scope_specific_question: `Does record ${entry.id} accurately state the offense identity, conduct, grade, definitions, exceptions, and defenses at ${citationFor(definition?.code ?? entry.code ?? entry.section)}? If not, specify an exact correction or other catalog action.`,
    en_explanation: text?.en ? `${text.en.plainSummary} ${text.en.degreeContext}` : "",
    es_explanation: text?.es ? `${text.es.plainSummary} ${text.es.degreeContext}` : "",
    zh_explanation: text?.zh ? `${text.zh.plainSummary} ${text.zh.degreeContext}` : "",
    recovered_authorities_pending_work: "",
    attorney_decision: "",
    attorney_notes: "",
    reviewer_name: "",
    review_date: "",
  };
});

const legacyRows = cleanup.map((row, index) => {
  const scope = inventoryByCleanupId.get(row.chargeId);
  const section = sectionFromCode(row.catalogCode);
  return {
    queue_order: recentRows.length + index + 1,
    queue_group: "legacy_hold",
    record_id: row.chargeId,
    legacy_label: row.catalogLabel,
    proposed_name: row.canonicalTitle ?? "",
    statutory_scope: row.catalogCode,
    citation: citationFor(row.catalogCode),
    source_url: scope?.sourceUrl ?? floridaUrl(section),
    existing_status: row.disposition,
    triage_reason: triageReason(row.dispositionReason),
    evidence_or_hold_reason: row.dispositionReason,
    scope_specific_question: legacyQuestion(row),
    en_explanation: "",
    es_explanation: "",
    zh_explanation: "",
    recovered_authorities_pending_work: triageReason(row.dispositionReason) === "current_authority_unavailable"
      ? "Exact current authority identified in the manifest reason"
      : "",
    attorney_decision: "",
    attorney_notes: "",
    reviewer_name: "",
    review_date: "",
  };
});

const blocked = [
  {
    id: "fl-fs-893-13-3-prohibited-acts-penalties",
    code: "893.13(3)",
    recovered: ["Fla. Stat. § 381.986"],
    recoveryStatus: "Official 2026 Florida Senate source recovered; awaiting exact extraction of the medical-marijuana exclusion and boundaries, hash integration, integrity checks, and legal review.",
    question: "Does current Fla. Stat. § 381.986 resolve every medical-marijuana exclusion applicable to the cannabis-specific § 893.13(3) delivery branch? Identify the exact paragraphs and any limits.",
  },
  {
    id: "fl-fs-893-147-7-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials",
    code: "893.147(7)",
    recovered: ["Fla. Stat. § 381.986", "21 U.S.C. § 802", "21 U.S.C. § 822", "21 U.S.C. § 830"],
    recoveryStatus: "All four official source leads recovered; awaiting narrow subdivision extraction, cross-reference validation, reviewed-hash integration, integrity checks, and legal review. Federal OLRC pages are preliminary and represent law only through April 13, 2026 / Pub. L. 119-83, not the later retrieval date.",
    question: "Do the current federal provisions and Fla. Stat. § 381.986 close the definitions, registration/compliance conditions, and licensing exception for § 893.147(7)? Identify exact incorporated scopes; do not approve a partial dependency set.",
  },
  {
    id: "fl-fs-827-04-1-contributing-to-the-delinquency-or-dependency-of-a-child-penalty",
    code: "827.04(1)",
    recovered: ["Fla. Stat. § 39.01"],
    recoveryStatus: "Official 2026 Florida Senate source recovered; awaiting exact dependent-child definition extraction, nested-dependency review, hash integration, integrity checks, and legal review. Cached Fla. Stat. §§ 984.03 and 985.03 did not independently cure this dependency.",
    question: "Does current Fla. Stat. § 39.01 supply the controlling dependent-child definition for § 827.04(1), including all relevant conditions and exceptions? Identify the exact subdivision(s).",
  },
];

const blockedRows = blocked.map((item, index) => ({
  queue_order: recentRows.length + legacyRows.length + index + 1,
  queue_group: "blocked_branch_authority",
  record_id: item.id,
  legacy_label: "",
  proposed_name: "",
  statutory_scope: item.code,
  citation: citationFor(item.code),
  source_url: [
    floridaUrl(sectionFromCode(item.code)),
    ...item.recovered.map(authority => recoveryUrlByAuthority.get(authority)),
  ].join(" | "),
  existing_status: "held",
  triage_reason: "sources_recovered_pending_exact_integration_and_review",
  evidence_or_hold_reason: item.recoveryStatus,
  scope_specific_question: item.question,
  en_explanation: "",
  es_explanation: "",
  zh_explanation: "",
  recovered_authorities_pending_work: item.recovered
    .map(authority => `${authority}: ${recoveryUrlByAuthority.get(authority)}`)
    .join(" | "),
  attorney_decision: "",
  attorney_notes: "",
  reviewer_name: "",
  review_date: "",
}));

const rows = [...recentRows, ...legacyRows, ...blockedRows];
if (rows.length !== 105) throw new Error(`Expected 105 packet rows; found ${rows.length}`);
if (new Set(cleanup.map(row => row.chargeId)).size !== 92) throw new Error("Legacy hold record IDs are not unique");

const columns = Object.keys(rows[0]);
const csvCell = value => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
const csv = [columns.map(csvCell).join(","), ...rows.map(row => columns.map(key => csvCell(row[key])).join(","))].join("\n") + "\n";

const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
const link = (url, label = url) => url
  ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
  : "No source link recorded";
const links = value => String(value ?? "").split(" | ").filter(Boolean)
  .map((url, index) => link(url, `official source ${index + 1}`)).join(" · ");
const decisionControls = id => `
  <label>Decision
    <select name="decision-${escapeHtml(id)}">
      <option value="" selected>— blank; attorney must decide —</option>
      <option>publish</option><option>hold</option><option>correct</option>
      <option>split</option><option>reclassify</option><option>deduplicate</option><option>remove</option>
    </select>
  </label>
  <label>Attorney notes<textarea name="notes-${escapeHtml(id)}" rows="3"></textarea></label>`;

const recentCards = recentRows.map(row => `
<article class="card priority">
  <header><span class="rank">Priority ${row.queue_order}</span><span class="status">${escapeHtml(row.existing_status)}</span></header>
  <h3>${escapeHtml(row.proposed_name || row.record_id)}</h3>
  <p class="id">${escapeHtml(row.record_id)}</p>
  <p><strong>${escapeHtml(row.citation)}</strong> · ${link(row.source_url, "Official source")}</p>
  <p><strong>Existing analyst basis:</strong> ${escapeHtml(row.evidence_or_hold_reason)}</p>
  <p class="question"><strong>Attorney question:</strong> ${escapeHtml(row.scope_specific_question)}</p>
  <details><summary>EN / ES / ZH linguistic-review text</summary>
    <p><b>EN:</b> ${escapeHtml(row.en_explanation)}</p>
    <p lang="es"><b>ES:</b> ${escapeHtml(row.es_explanation)}</p>
    <p lang="zh"><b>ZH:</b> ${escapeHtml(row.zh_explanation)}</p>
    <p class="warning">Spanish and Chinese text has no fluent-speaker or attorney approval in this packet.</p>
  </details>
  ${decisionControls(row.record_id)}
</article>`).join("");

const blockedCards = blockedRows.map(row => `
<article class="card blocked">
  <header><span class="status">BLOCKED</span></header>
  <h3>${escapeHtml(row.citation)}</h3><p class="id">${escapeHtml(row.record_id)}</p>
  <p><strong>Recovered authorities; work still pending:</strong> ${escapeHtml(row.recovered_authorities_pending_work)}</p>
  <p>${links(row.source_url)}</p>
  <p><strong>Status:</strong> ${escapeHtml(row.evidence_or_hold_reason)}</p>
  <p class="question"><strong>Attorney question:</strong> ${escapeHtml(row.scope_specific_question)}</p>
  ${decisionControls(`blocked-${row.record_id}`)}
</article>`).join("");

const legacyTable = legacyRows.map(row => `
<tr>
  <td><b>${escapeHtml(row.record_id)}</b><br><span class="muted">${escapeHtml(row.legacy_label)}</span></td>
  <td>${escapeHtml(row.citation)}<br>${link(row.source_url, "source")}</td>
  <td><span class="tag">${escapeHtml(row.triage_reason)}</span><br>${escapeHtml(row.evidence_or_hold_reason)}</td>
  <td>${escapeHtml(row.scope_specific_question)}</td>
  <td><div class="blank">Decision: ____________________</div><div class="blank notes">Notes:</div></td>
</tr>`).join("");

const generatedAt = new Date().toISOString();
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Florida attorney-review packet — development only</title>
<style>
:root{--ink:#172033;--muted:#5c667a;--line:#d7dce5;--blue:#174ea6;--cream:#fff8e6;--red:#9b1c1c;--bg:#f4f6fa}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1180px;margin:auto;padding:28px}.hero,.notice,.card,.table-wrap{background:white;border:1px solid var(--line);border-radius:12px;padding:22px;margin-bottom:18px}
h1{font-size:32px;margin:.2rem 0}h2{margin-top:2.2rem}.eyebrow,.status,.tag{font-size:12px;font-weight:750;letter-spacing:.04em;text-transform:uppercase}
.notice{background:var(--cream);border-color:#e8c667}.notice strong,.warning{color:var(--red)}.metrics{display:flex;gap:12px;flex-wrap:wrap}
.metric{background:#edf3ff;border-radius:8px;padding:10px 14px}.metric b{font-size:22px;display:block}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:16px}
.card{margin:0}.card header{display:flex;justify-content:space-between}.priority{border-top:5px solid var(--blue)}.blocked{border-top:5px solid var(--red)}
.rank{font-weight:700;color:var(--blue)}.id{font:12px ui-monospace,SFMono-Regular,monospace;overflow-wrap:anywhere;color:var(--muted)}
.question{border-left:4px solid var(--blue);padding-left:12px}label{display:block;font-weight:700;margin-top:12px}select,textarea,input{width:100%;padding:8px;border:1px solid #aeb6c5;border-radius:5px;background:white}textarea{resize:vertical}
details{border:1px solid var(--line);border-radius:6px;padding:10px}summary{font-weight:700;cursor:pointer}.table-wrap{overflow:auto;padding:0}
table{border-collapse:collapse;width:100%;min-width:1050px;font-size:13px}th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:10px}th{position:sticky;top:0;background:#eaf0fa}
.muted{color:var(--muted)}.tag{display:inline-block;color:#334a72;background:#eaf0fa;border-radius:4px;padding:2px 5px}.blank{min-height:28px;border-bottom:1px solid #999}.notes{height:62px;margin-top:8px}
a{color:var(--blue)}footer{color:var(--muted);margin:28px 0}
@media print{body{background:#fff}main{max-width:none;padding:0}.card,.hero,.notice{break-inside:avoid}.table-wrap{overflow:visible}th{position:static}select,textarea{border:0;border-bottom:1px solid #555}.grid{display:block}.grid .card{margin-bottom:12px}}
</style></head><body><main>
<section class="hero"><div class="eyebrow">Focused decision packet · generated ${escapeHtml(generatedAt)}</div>
<h1>Florida attorney review</h1>
<p>Source-first, note-driven review of the newest development batch, legacy holds, and three dependency-blocked branches.</p>
<div class="metrics"><div class="metric"><b>10</b>new selectable additions first</div><div class="metric"><b>92</b>legacy holds</div><div class="metric"><b>3</b>held branch questions</div></div>
</section>
<section class="notice"><strong>No attorney approval yet. Development-only. Nothing in this packet is approved, activated, or publication-ready.</strong>
<p><b>Refresh outcome incorporated:</b> the worker reported 92 sections identical to the reviewed evidence. The receipt was checked ${escapeHtml(receipt.checkedAt)} and expires ${escapeHtml(receipt.expiresAt)}. The next refresh is due before <b>${escapeHtml(dueBefore)}</b> and is <b>not scheduled</b>. These bounded dates do not establish freshness after expiry.</p>
<p><b>Regenerate after later refresh inputs change:</b> run <code>node scripts/data-review/generate-florida-attorney-review-packet.mjs</code>. Confirm the generator reports 10 new selectable additions, 92 legacy rows, 3 held branches, five recovered authorities, and 105 CSV data rows. A reviewer must choose an explicit action and write a note; a decision alone does not activate a record.</p>
</section>
<section><h2>Reviewer identity</h2><div class="card"><label>Attorney / reviewer name<input></label><label>Review date<input type="date"></label><label>Overall packet notes<textarea rows="4"></textarea></label></div></section>
<section><h2>1. Ten actual newly selectable additions</h2><p>Priority 1 is recovered batch E § 893.147(4)(b); priorities 2–10 are the nine selectable batch F records. All ten include EN/ES/ZH text for linguistic and legal review. “Selectable” describes the reviewed development inventory, not attorney approval or activation.</p><div class="grid">${recentCards}</div></section>
<section><h2>2. Three still-held branches: recovered authority leads</h2><p>All five previously unavailable official sources were recovered. The branches remain held awaiting exact extraction, integration, integrity checks, and legal review; recovery alone does not resolve their semantics. The three federal OLRC responses are preliminary-edition sources representing a publisher boundary of April 13, 2026 / Pub. L. 119-83; their September retrieval time is not a later codification cutoff.</p><div class="grid">${blockedCards}</div></section>
<section><h2>3. Ninety-two legacy holds</h2><p>Each row preserves the manifest’s actual hold reason. Triage tags only organize that reason; they do not add a semantic conclusion. Record a specific action and note.</p>
<div class="table-wrap"><table><thead><tr><th>Record</th><th>Scope & source</th><th>Actual reason / triage</th><th>Scope-specific question</th><th>Blank decision / notes</th></tr></thead><tbody>${legacyTable}</tbody></table></div></section>
<footer>Inputs: Florida source manifest, coverage inventory, reviewed batches E/F, localized batch E/F definitions, completed refresh receipt, and recovery findings/acquisition receipt. Evidence excerpts are intentionally omitted; follow source links for full text. CSV companion contains the complete focused queue and blank fields.</footer>
</main></body></html>`;

const csvPath = resolve(output, "florida-attorney-review-packet.csv");
const htmlPath = resolve(output, "florida-attorney-review-packet.html");
writeFileSync(csvPath, csv);
writeFileSync(htmlPath, html);

// Parse the emitted CSV with a small RFC 4180 state machine to validate quoting and row width.
function parseCsv(value) {
  const parsed = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (quoted) {
      if (char === "\"" && value[i + 1] === "\"") { cell += "\""; i++; }
      else if (char === "\"") quoted = false;
      else cell += char;
    } else if (char === "\"") quoted = true;
    else if (char === ",") { row.push(cell); cell = ""; }
    else if (char === "\n") { row.push(cell); parsed.push(row); row = []; cell = ""; }
    else if (char !== "\r") cell += char;
  }
  if (quoted) throw new Error("CSV ended inside a quoted field");
  return parsed;
}
const parsed = parseCsv(readFileSync(csvPath, "utf8"));
if (parsed.length !== 106) throw new Error(`CSV validation expected 106 physical records including header; found ${parsed.length}`);
if (parsed.some(row => row.length !== columns.length)) throw new Error("CSV validation found inconsistent column counts");
if (!readFileSync(htmlPath, "utf8").includes("</html>")) throw new Error("HTML validation failed");

console.log(JSON.stringify({
  html: "scripts/data-review/output/florida-attorney-review-packet.html",
  csv: "scripts/data-review/output/florida-attorney-review-packet.csv",
  counts: { recent: recentRows.length, legacy: legacyRows.length, blocked: blockedRows.length, csvDataRows: rows.length },
  recentComposition: { recoveredBatchE: 1, selectableBatchF: 9, localizedEnEsZh: recentRows.filter(row => row.en_explanation && row.es_explanation && row.zh_explanation).length },
  recoveredAuthorities: recoveryFindings.authorities.length,
  freshness: { identicalSectionsReportedByWorker: 92, checkedAt: receipt.checkedAt, expiresAt: receipt.expiresAt, dueBefore, scheduled: false },
}, null, 2));