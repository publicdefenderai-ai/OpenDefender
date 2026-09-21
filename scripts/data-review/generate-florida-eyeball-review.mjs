import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const root = process.cwd();
const outputDir = resolve(root, "scripts/data-review/output");
const assetDir = resolve(outputDir, "florida-eyeball-review-assets");
const readJson = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
const normalize = value => String(value ?? "")
  .normalize("NFKC")
  .replaceAll("\u2003", " ")
  .replaceAll("\u00a0", " ")
  .replace(/\s+/g, " ")
  .trim();
const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;")
  .replaceAll("'", "&#39;");

const manifest = readJson("scripts/data-review/output/fl-source-manifest.json");
const inventory = readJson("scripts/data-review/output/florida-coverage-inventory.json");
const receipt = readJson("scripts/data-review/output/florida-reviewed-refresh-receipt.json");
const analysisE = readJson("scripts/data-review/output/florida-reviewed-analysis-e.json");
const analysisF = readJson("scripts/data-review/output/florida-reviewed-analysis-f.json");
const definitionsE = readJson("shared/florida-reviewed-data/e.json");
const definitionsF = readJson("shared/florida-reviewed-data/f.json");
const sourceCache = readJson("scripts/data-review/output/florida-batch-source-cache.json");
const rawCache = readJson("scripts/data-review/output/florida-batch-exact-raw-cache.json");
const recoveryFindings = readJson("scripts/data-review/output/florida-recovery-leads/findings.json");
const recoveryReceipt = readJson("scripts/data-review/output/florida-recovery-leads/acquisition-receipt.json");
const cjkRegularFont = readFileSync(resolve(root, "client/public/fonts/NotoSansSC-Regular.ttf")).toString("base64");

const generatedAt = new Date();
const expiresAt = new Date(receipt.expiresAt);
const freshnessState = generatedAt >= expiresAt ? "EXPIRED" : "VALID UNTIL THE EXACT EXPIRY BELOW";
const freshnessMessage = generatedAt >= expiresAt
  ? `Evidence receipt expired at ${receipt.expiresAt}; this packet must not be used as current evidence without a new independently preserved snapshot.`
  : `Evidence receipt had not expired at generation time. It expires exactly at ${receipt.expiresAt}; no freshness is claimed after that instant.`;

if (!Array.isArray(manifest.catalogRecords) || !Array.isArray(inventory.rows)) {
  throw new Error("Required Florida manifest or inventory rows are missing");
}
const cleanup = manifest.catalogRecords.filter(row => row.disposition === "require_exact_reselection");
if (cleanup.length !== 92) throw new Error(`Expected 92 legacy holds; found ${cleanup.length}`);

const recoveredEId = "fl-fs-893-147-4-b-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials";
const definitions = [
  definitionsE.find(row => row.id === recoveredEId),
  ...definitionsF,
];
if (definitions.length !== 10 || definitions.some(row => !row)) {
  throw new Error("Expected recovered batch E record plus nine batch F records");
}
const analysesById = new Map([...analysisE, ...analysisF].map(row => [row.id, row]));
const priorities = definitions.map(definition => ({
  definition,
  analysis: analysesById.get(definition.id),
}));
if (priorities.some(item => item.analysis?.status !== "eligible")) {
  throw new Error("Each priority record must have an eligible analysis");
}

const inventoryByCleanupId = new Map();
for (const row of inventory.rows.filter(row => row.rowKind === "scope")) {
  for (const id of row.legacyCleanupQueueIds ?? []) {
    if (!inventoryByCleanupId.has(id)) inventoryByCleanupId.set(id, row);
  }
}
const receiptBySection = new Map();
for (const row of receipt.documents) {
  const section = row.sourceKey.match(/^fl:statute:([0-9.]+)/)?.[1];
  if (section && !receiptBySection.has(section)) receiptBySection.set(section, row);
}
const recoveryUrlByAuthority = new Map(
  recoveryReceipt.receipts.map(row => [row.authority, row.finalUrl]),
);

const sectionFromCode = code => String(code ?? "").match(/^(\d{3,4}\.\d{2,6})/)?.[1] ?? "";
const citationFor = code => `Fla. Stat. § ${code}`;
const floridaUrl = section => {
  const chapter = section.split(".")[0].padStart(4, "0");
  const band = `${chapter.slice(0, 2)}00-${chapter.slice(0, 2)}99`;
  return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${band}/${chapter}/Sections/${chapter}.${section.split(".")[1]}.html`;
};

function triageReason(reason) {
  const text = String(reason ?? "");
  if (/does not exactly support every cited/i.test(text)) return "exact citation/subdivision mismatch";
  if (/not an exact or explicitly reviewed mapping/i.test(text)) return "label-to-official-title identity unresolved";
  if (/could not be verified|no current|unavailable|not available/i.test(text)) return "current authority unavailable";
  return "other manifest reason—read verbatim reason";
}

function legacyQuestion(row) {
  const category = triageReason(row.dispositionReason);
  if (category === "exact citation/subdivision mismatch") {
    return `For ${citationFor(row.catalogCode)}, should ${row.chargeId} be corrected to an exact reviewed subdivision, split into records, held, or removed? Give each exact citation and action.`;
  }
  if (category === "label-to-official-title identity unresolved") {
    return `Does the official provision at ${citationFor(row.catalogCode)} support the legacy label “${row.catalogLabel}” at exactly this scope? If not, choose correct, split, reclassify, deduplicate, hold, or remove and state the exact mapping.`;
  }
  if (category === "current authority unavailable") {
    return `What current official authority, if any, supports ${row.chargeId} at ${citationFor(row.catalogCode)}? Keep held unless the exact current source, edition, and scope are supplied.`;
  }
  return `What explicit action—publish, hold, correct, split, reclassify, deduplicate, or remove—should apply to ${row.chargeId}, and at what exact statutory scope?`;
}

function occurrences(haystack, needle) {
  const source = normalize(haystack);
  const target = normalize(needle);
  if (!target) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = source.indexOf(target, offset)) !== -1) {
    count++;
    offset += target.length;
  }
  return count;
}

function partialMatch(haystack, needle) {
  const source = normalize(haystack);
  const words = normalize(needle).split(" ");
  if (words.length < 8) return false;
  const window = Math.max(7, Math.floor(words.length * 0.6));
  for (let index = 0; index + window <= words.length; index++) {
    if (source.includes(words.slice(index, index + window).join(" "))) return true;
  }
  return false;
}

function accountAnchor(text, kind, quote, index) {
  const count = occurrences(text, quote);
  return {
    key: `${kind}-${index + 1}`,
    kind,
    quote,
    occurrenceCount: count,
    status: count === 1 ? "matched" : count > 1 ? "ambiguous" : partialMatch(text, quote) ? "partial" : "missing",
  };
}

function recordReviewQuestion(definition, analysis) {
  return [
    `Does ${citationFor(definition.code)} support this record at exactly the proposed scope, rather than a neighboring or broader branch?`,
    `Do the quoted anchors establish every stated conduct, mental-state, victim/age or harm condition, defense or exception, and grade described in the EN/ES/ZH explanations?`,
    `Are these dependency roles complete: ${analysis.requiredSections.map(row => `§ ${row.section} (${row.role})`).join(", ")}?`,
    `Is this boundary accurate: ${analysis.notes}`,
    "For any “no,” identify the exact text and choose hold, correct, split, reclassify, deduplicate, or remove. A screenshot match is not approval.",
  ].join(" ");
}

async function renderEvidenceFrames(browser, item, priorityIndex) {
  const section = item.analysis.section;
  const raw = rawCache.responses[section];
  if (!raw?.html) throw new Error(`No saved raw HTML snapshot for § ${section}`);
  const rawHash = sha(raw.html);
  if (rawHash !== raw.contentHash) throw new Error(`Raw snapshot hash mismatch for § ${section}`);

  const context = await browser.newContext({
    viewport: { width: 1220, height: 900 },
    deviceScaleFactor: 1,
  });
  await context.route("**/*", route => route.abort("blockedbyclient"));
  const page = await context.newPage();
  console.error(`Rendering priority ${priorityIndex + 1}: ${item.analysis.section}`);
  const offlineHtml = raw.html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/(<(?:img|iframe)\b[^>]*?)\s+src=(["'])[\s\S]*?\2/gi, "$1");
  await page.setContent(offlineHtml, { waitUntil: "domcontentloaded", timeout: 20_000 });
  console.error(`Loaded saved HTML for priority ${priorityIndex + 1}`);
  const savedRawBodyText = await page.locator("body").innerText();
  for (const anchor of item.anchors) {
    const rawAccounting = accountAnchor(savedRawBodyText, anchor.kind, anchor.quote, Number(anchor.key.split("-").at(-1)) - 1);
    anchor.occurrenceCount = rawAccounting.occurrenceCount;
    anchor.status = rawAccounting.status;
    anchor.accountedAgainst = "saved raw HTML body text used for screenshot";
  }
  await page.addStyleTag({ content: `
    html,body{background:#fff!important;color:#000!important}
    .eyeball-highlight{background:#ffe36e!important;outline:3px solid #b45309!important;outline-offset:2px!important}
    .eyeball-highlight a{background:#ffe36e!important;color:#000!important}
  ` });
  console.error(`Added annotation style for priority ${priorityIndex + 1}`);

  const anchors = item.anchors;
  const domResults = await page.evaluate(items => {
    const norm = value => String(value ?? "").normalize("NFKC")
      .replaceAll("\u2003", " ").replaceAll("\u00a0", " ").replace(/\s+/g, " ").trim();
    const all = [...document.body.querySelectorAll("span,p,div")];
    const normalized = new Map(all.map(element => [element, norm(element.innerText)]));
    return items.map(anchor => {
      const target = norm(anchor.quote);
      const candidates = all.filter(element => {
        const text = normalized.get(element);
        if (!text.includes(target)) return false;
        return ![...element.children].some(child => normalized.get(child)?.includes(target));
      }).sort((a, b) => norm(a.innerText).length - norm(b.innerText).length);
      const selected = candidates[0];
      if (selected) {
        selected.classList.add("eyeball-highlight");
        selected.dataset.eyeballAnchor = anchor.key;
      }
      return { key: anchor.key, candidateCount: candidates.length, selected: Boolean(selected) };
    });
  }, anchors);
  console.error(`Matched DOM anchors for priority ${priorityIndex + 1}`);

  for (const result of domResults) {
    const anchor = anchors.find(row => row.key === result.key);
    anchor.screenshotMatch = result.selected ? "highlighted in saved raw HTML" : "not highlighted";
    anchor.domCandidateCount = result.candidateCount;
    if (!result.selected && anchor.status === "matched") {
      throw new Error(`Text matched extracted snapshot but could not be highlighted in raw HTML: ${item.definition.id} ${anchor.key}`);
    }
  }

  const boxes = await page.locator(".eyeball-highlight").evaluateAll(elements => elements
    .map(element => {
      const box = element.getBoundingClientRect();
      return { y: box.top + window.scrollY, height: box.height };
    })
    .filter(box => box.height > 0)
    .sort((a, b) => a.y - b.y));
  if (!boxes.length) throw new Error(`No screenshot highlights found for ${item.definition.id}`);

  const groups = [];
  for (const box of boxes) {
    const start = Math.max(0, box.y - 150);
    const end = box.y + box.height + 180;
    const last = groups.at(-1);
    if (last && start - last.end < 420 && end - last.start < 1700) last.end = Math.max(last.end, end);
    else groups.push({ start, end });
  }

  const images = [];
  const fullPagePath = resolve(assetDir, `.priority-${String(priorityIndex + 1).padStart(2, "0")}-full.png`);
  await page.screenshot({ path: fullPagePath, fullPage: true });
  for (let index = 0; index < groups.length; index++) {
    const group = groups[index];
    const bodyHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clipY = Math.max(0, Math.min(Math.floor(group.start), bodyHeight - 1));
    const clip = {
      x: 0,
      y: clipY,
      width: 1220,
      height: Math.max(1, Math.min(Math.ceil(group.end - group.start), bodyHeight - clipY)),
    };
    const fileName = `priority-${String(priorityIndex + 1).padStart(2, "0")}-frame-${index + 1}.png`;
    const filePath = resolve(assetDir, fileName);
    console.error(`Screenshot priority ${priorityIndex + 1} frame ${index + 1}: ${JSON.stringify({ clip, bodyHeight })}`);
    execFileSync("convert", [
      fullPagePath,
      "-crop", `${clip.width}x${clip.height}+${clip.x}+${clip.y}`,
      "+repage",
      filePath,
    ]);
    images.push({
      fileName,
      filePath,
      data: readFileSync(filePath),
      width: clip.width,
      height: clip.height,
      dataUri: `data:image/png;base64,${readFileSync(filePath).toString("base64")}`,
    });
  }
  rmSync(fullPagePath, { force: true });
  await context.close();
  return { images, raw, rawHash };
}

rmSync(assetDir, { recursive: true, force: true });
mkdirSync(assetDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? execFileSync("which", ["chromium"], { encoding: "utf8" }).trim(),
});
try {
  for (let index = 0; index < priorities.length; index++) {
    const item = priorities[index];
    const document = sourceCache.documents[item.analysis.section];
    if (!document) throw new Error(`Missing parsed source document for § ${item.analysis.section}`);
    const expectedHash = item.analysis.requiredSections.find(row => row.section === item.analysis.section)?.contentHash;
    if (document.contentHash !== expectedHash) {
      throw new Error(`Parsed source content hash mismatch for § ${item.analysis.section}`);
    }
    const expectedAnchors = [
      { kind: "identity", quote: item.analysis.identity.quote },
      ...item.analysis.conductQuotes.map(quote => ({ kind: "conduct", quote })),
      ...item.analysis.gradingQuotes.map(quote => ({ kind: "grading", quote })),
    ];
    item.anchors = expectedAnchors.map((anchor, anchorIndex) =>
      accountAnchor(document.text, anchor.kind, anchor.quote, anchorIndex));
    const rendered = await renderEvidenceFrames(browser, item, index);
    item.source = {
      section: item.analysis.section,
      url: rendered.raw.sourceUrl,
      edition: document.edition,
      rawRetrievedAt: rendered.raw.retrievedAt,
      parsedEvidenceRetrievedAt: document.retrievedAt,
      rawHash: rendered.rawHash,
      contentHash: document.contentHash,
    };
    item.images = rendered.images;
    item.dependencies = item.analysis.requiredSections.map(requirement => {
      const dependency = sourceCache.documents[requirement.section];
      const receiptEntry = receiptBySection.get(requirement.section);
      return {
        ...requirement,
        hashValidation: dependency?.contentHash === requirement.contentHash ? "validated" : "MISMATCH OR MISSING",
        title: dependency?.title ?? "",
        edition: dependency?.edition ?? "not recorded",
        sourceUrl: dependency?.sourceUrl ?? floridaUrl(requirement.section),
        retrievedAt: dependency?.retrievedAt ?? receiptEntry?.retrievedAt ?? "not recorded",
      };
    });
    if (item.dependencies.some(row => row.hashValidation !== "validated")) {
      throw new Error(`Dependency hash validation failed for ${item.definition.id}`);
    }
    item.recordHash = sha(JSON.stringify(item.definition));
    item.evidenceHash = sha(JSON.stringify({
      anchors: item.anchors.map(({ key, kind, quote, status, occurrenceCount }) => ({ key, kind, quote, status, occurrenceCount })),
      dependencies: item.dependencies,
      rawHash: item.source.rawHash,
      contentHash: item.source.contentHash,
    }));
    item.bindingHash = sha(`${item.definition.id}\n${item.recordHash}\n${item.evidenceHash}`);
    item.question = recordReviewQuestion(item.definition, item.analysis);
  }
} finally {
  await browser.close();
}

const blocked = [
  {
    id: "fl-fs-893-13-3-prohibited-acts-penalties",
    code: "893.13(3)",
    recovered: ["Fla. Stat. § 381.986"],
    reason: "Held. The current medical-marijuana exclusion incorporated through § 893.02(3) has a recovered official 2026 source, but its exact paragraphs, boundaries, nested dependencies, and evidence hashes have not been integrated and reviewed.",
    question: "Does current § 381.986 resolve every medical-marijuana exclusion applicable to the cannabis-specific § 893.13(3) delivery branch? Identify exact paragraphs, limits, nested definitions, and exceptions; otherwise keep held.",
  },
  {
    id: "fl-fs-893-147-7-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials",
    code: "893.147(7)",
    recovered: ["Fla. Stat. § 381.986", "21 U.S.C. § 802", "21 U.S.C. § 822", "21 U.S.C. § 830"],
    reason: "Held. All four official source leads were recovered, but narrow subdivision extraction, incorporated federal definitions, registration/compliance conditions, licensing exceptions, hash integration, and legal review remain incomplete. The federal OLRC snapshots represent law only through April 13, 2026 / Pub. L. 119-83.",
    question: "Do the saved federal provisions and § 381.986 close every definition, registration/compliance condition, and licensing exception for § 893.147(7)? Identify each exact incorporated scope and edition boundary; do not approve a partial dependency set.",
  },
  {
    id: "fl-fs-827-04-1-contributing-to-the-delinquency-or-dependency-of-a-child-penalty",
    code: "827.04(1)",
    recovered: ["Fla. Stat. § 39.01"],
    reason: "Held. An official 2026 source was recovered, but the controlling dependent-child definition, relevant alternatives and exclusions, nested-dependency review, and evidence-hash integration remain incomplete. Cached §§ 984.03 and 985.03 did not independently cure the dependency.",
    question: "Does current § 39.01 supply the controlling dependent-child definition for § 827.04(1), including every relevant condition, alternative, and exception? Identify exact subdivisions and any nested definitions; otherwise keep held.",
  },
];
if (recoveryFindings.authorities.length !== 5) throw new Error("Expected five recovered authorities");
for (const row of blocked) {
  row.urls = row.recovered.map(authority => `${authority}: ${recoveryUrlByAuthority.get(authority) ?? "URL missing"}`);
  if (row.urls.some(value => value.endsWith("URL missing"))) throw new Error(`Missing recovery URL for ${row.id}`);
}

const legacyRows = cleanup.map(row => {
  const scope = inventoryByCleanupId.get(row.chargeId);
  return {
    id: row.chargeId,
    label: row.catalogLabel,
    code: row.catalogCode,
    sourceUrl: scope?.sourceUrl ?? floridaUrl(sectionFromCode(row.catalogCode)),
    reason: row.dispositionReason,
    triage: triageReason(row.dispositionReason),
    question: legacyQuestion(row),
  };
});

const statusCounts = priorities.flatMap(item => item.anchors).reduce((counts, anchor) => {
  counts[anchor.status] = (counts[anchor.status] ?? 0) + 1;
  return counts;
}, { matched: 0, partial: 0, missing: 0, ambiguous: 0 });

const decisionHtml = item => `
  <fieldset class="decision">
    <legend>Blank decision — bound to this record and evidence</legend>
    <div class="choices">
      ${["publish", "hold", "correct", "split", "reclassify", "deduplicate", "remove"].map(action =>
        `<label><input type="checkbox" name="${escapeHtml(item.bindingHash)}-action" value="${action}"> ${action}</label>`).join("")}
    </div>
    <label>Decision / exact action <input aria-label="Decision for ${escapeHtml(item.definition.id)}"></label>
    <label>Required notes / exact corrections <textarea rows="5" aria-label="Notes for ${escapeHtml(item.definition.id)}"></textarea></label>
    <div class="identity-fields"><label>Reviewer <input></label><label>Date <input type="date"></label></div>
    <p class="hash"><b>Decision binding:</b> record <code>${item.recordHash}</code><br>evidence <code>${item.evidenceHash}</code><br>combined <code>${item.bindingHash}</code></p>
  </fieldset>`;

const priorityHtml = priorities.map((item, index) => {
  const text = item.definition.text;
  const anchors = item.anchors.map(anchor => `
    <tr><td>${escapeHtml(anchor.key)}</td><td><span class="anchor-status ${escapeHtml(anchor.status)}">${escapeHtml(anchor.status)}</span></td>
    <td>${anchor.occurrenceCount}</td><td><q>${escapeHtml(anchor.quote)}</q></td><td>${escapeHtml(anchor.screenshotMatch)}</td></tr>`).join("");
  const dependencies = item.dependencies.map(row => `
    <tr><td>§ ${escapeHtml(row.section)}</td><td>${escapeHtml(row.role)}</td><td>${escapeHtml(row.edition)}</td>
    <td>${escapeHtml(row.retrievedAt)}</td><td><code>${escapeHtml(row.contentHash)}</code></td><td>${escapeHtml(row.hashValidation)}</td></tr>`).join("");
  const images = item.images.map((image, imageIndex) => `
    <figure><img src="${image.dataUri}" alt="Saved official Florida statute HTML for ${escapeHtml(item.definition.code)}, frame ${imageIndex + 1}, with exact matched source text highlighted in yellow">
    <figcaption>Evidence frame ${imageIndex + 1}: direct offline rendering of the saved official raw HTML snapshot. Outbound resources were blocked; browser-default styling is visible where the saved page referenced an external stylesheet. Yellow outline is the review annotation. Context is retained around the complete highlighted qualification.</figcaption></figure>`).join("");
  return `<article class="record" id="priority-${index + 1}">
    <div class="record-kicker">Priority ${index + 1} · ${index === 0 ? "recovered batch E" : "batch F"} · proposed selectable development record</div>
    <h2>${escapeHtml(item.definition.name)}</h2>
    <p class="record-id">${escapeHtml(item.definition.id)}</p>
    <div class="scope"><b>${escapeHtml(citationFor(item.definition.code))}</b> · no approval recorded</div>
    <h3>Proposed explanations requiring legal and linguistic review</h3>
    <div class="languages">
      <div><b>EN</b><p>${escapeHtml(text.en.plainSummary)} ${escapeHtml(text.en.degreeContext)}</p></div>
      <div lang="es"><b>ES</b><p>${escapeHtml(text.es.plainSummary)} ${escapeHtml(text.es.degreeContext)}</p></div>
      <div lang="zh"><b>ZH</b><p>${escapeHtml(text.zh.plainSummary)} ${escapeHtml(text.zh.degreeContext)}</p></div>
    </div>
    <p class="warning">Spanish and Chinese text has no fluent-speaker or attorney approval in this packet.</p>
    <h3>Exact quoted support and anchor accounting</h3>
    <p>Every expected identity, conduct, and grading anchor is listed. “Matched” means one normalized occurrence in the saved snapshot text—not legal sufficiency or approval. Partial, missing, or ambiguous results must remain unresolved.</p>
    <div class="table-wrap"><table><thead><tr><th>Anchor</th><th>Status</th><th>Occurrences</th><th>Exact quote</th><th>Screenshot</th></tr></thead><tbody>${anchors}</tbody></table></div>
    <h3>Saved-source evidence frames</h3>${images}
    <details open><summary>Accessible source and provenance</summary>
      <p><b>Official source URL:</b> <span class="url">${escapeHtml(item.source.url)}</span><br>
      <b>Edition:</b> ${escapeHtml(item.source.edition)}<br>
      <b>Raw HTML retrieved:</b> ${escapeHtml(item.source.rawRetrievedAt)}<br>
      <b>Parsed evidence retrieved:</b> ${escapeHtml(item.source.parsedEvidenceRetrievedAt)}<br>
      <b>Raw HTML SHA-256:</b> <code>${item.source.rawHash}</code><br>
      <b>Normalized source-text SHA-256:</b> <code>${item.source.contentHash}</code></p>
      ${item.anchors.map(anchor => `<blockquote><b>${escapeHtml(anchor.kind)} · ${escapeHtml(anchor.status)}:</b> ${escapeHtml(anchor.quote)}</blockquote>`).join("")}
    </details>
    <h3>Dependencies, defenses, exceptions, and boundaries</h3>
    <p><b>Analyst boundary:</b> ${escapeHtml(item.analysis.notes)}</p>
    <div class="table-wrap"><table><thead><tr><th>Section</th><th>Role</th><th>Edition</th><th>Retrieved</th><th>Content hash</th><th>Validation</th></tr></thead><tbody>${dependencies}</tbody></table></div>
    <h3>Precise review question</h3><p class="question">${escapeHtml(item.question)}</p>
    ${decisionHtml(item)}
  </article>`;
}).join("");

const blockedHtml = blocked.map(row => `<article class="appendix-card">
  <h3>${escapeHtml(citationFor(row.code))}</h3><p class="record-id">${escapeHtml(row.id)}</p>
  <p><b>Specific hold reason:</b> ${escapeHtml(row.reason)}</p>
  <p><b>Saved official source leads:</b><br>${row.urls.map(escapeHtml).join("<br>")}</p>
  <p class="question"><b>Review question:</b> ${escapeHtml(row.question)}</p>
  <p><b>Decision:</b> ____________________ &nbsp; <b>Reviewer:</b> ____________________ &nbsp; <b>Date:</b> ____________</p>
  <p><b>Notes / exact subdivisions:</b></p><div class="notes-lines"></div>
</article>`).join("");

const legacyHtml = legacyRows.map((row, index) => `<tr>
  <td>${index + 1}</td><td><b>${escapeHtml(row.id)}</b><br><span class="muted">${escapeHtml(row.label)}</span></td>
  <td>${escapeHtml(citationFor(row.code))}<br><span class="url">${escapeHtml(row.sourceUrl)}</span></td>
  <td><span class="tag">${escapeHtml(row.triage)}</span><br>${escapeHtml(row.reason)}</td>
  <td>${escapeHtml(row.question)}</td><td>Decision: __________<br>Reviewer: __________<br>Date: ________<br><br>Notes:</td>
</tr>`).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Florida evidence-backed Eyeball manual review</title>
<style>
@font-face{font-family:"Noto Sans SC Embedded";src:url(data:font/ttf;base64,${cjkRegularFont}) format("truetype");font-weight:400;font-style:normal;font-display:block}
:root{--navy:#102a43;--blue:#165d8f;--paper:#fff;--bg:#eef2f5;--line:#c8d2dc;--amber:#fff2c7;--red:#9b1c1c;--green:#166534}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#17212b;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
[lang="zh"]{font-family:"Noto Sans SC Embedded","Microsoft YaHei","PingFang SC",sans-serif}
main{max-width:1180px;margin:auto;padding:30px}.hero,.notice,.record,.appendix-card,.appendix-section{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:24px;margin:0 0 24px}
.hero{border-top:8px solid var(--navy)}h1{font-size:34px;line-height:1.15;margin:.3rem 0}h2{color:var(--navy);line-height:1.2}h3{margin-top:1.6rem;color:#243b53}
.eyebrow,.record-kicker,.tag{font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:800}.record-kicker{color:var(--blue)}
.notice{background:var(--amber);border-color:#d7a600}.notice strong,.warning{color:var(--red)}.metrics{display:flex;gap:12px;flex-wrap:wrap}.metric{padding:10px 14px;background:#e9f2f8;border-radius:7px}.metric b{font-size:22px;display:block}
.record{border-top:6px solid var(--blue)}.record-id,code,.hash,.url{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere;font-size:12px}.scope{padding:10px;background:#edf5fa;border-left:4px solid var(--blue)}
.languages{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.languages>div{border:1px solid var(--line);border-radius:7px;padding:12px}.languages p{margin:.25rem 0}
.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid var(--line);padding:8px;vertical-align:top;text-align:left}th{background:#e9f2f8}
.anchor-status,.tag{display:inline-block;padding:2px 6px;border-radius:4px;background:#e5e7eb}.matched{color:var(--green);background:#dcfce7}.partial,.missing,.ambiguous{color:var(--red);background:#fee2e2}
figure{margin:16px 0;border:1px solid var(--line);padding:10px;background:#f8fafc}figure img{display:block;width:100%;height:auto;border:1px solid #8895a2}figcaption{font-size:12px;color:#52616f;margin-top:7px}
blockquote{margin:10px 0;padding:10px 14px;border-left:4px solid #d7a600;background:#fffbea}.question{padding:14px;border-left:5px solid var(--blue);background:#edf5fa}
.decision{border:2px solid var(--navy);padding:16px}.decision legend{font-weight:800}.choices{display:flex;flex-wrap:wrap;gap:10px}.decision>label{display:block;font-weight:700;margin-top:10px}.decision input[type=text],.decision input:not([type]),.decision textarea,.decision input[type=date]{width:100%;border:1px solid #7d8995;border-radius:4px;padding:8px;background:white}.identity-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}.identity-fields label{font-weight:700}
.hash{background:#f1f5f9;padding:8px}.notes-lines{height:80px;background:repeating-linear-gradient(#fff,#fff 25px,#9aa5b1 26px)}.muted{color:#586777}
@media(max-width:800px){main{padding:12px}.languages{grid-template-columns:1fr}.identity-fields{grid-template-columns:1fr}}
@media print{body{background:white}main{max-width:none;padding:0}.hero,.notice,.record,.appendix-card,.appendix-section{border-radius:0;break-inside:auto}.record{break-before:page}figure{break-inside:avoid}.decision{break-inside:avoid}.appendix-card{break-inside:avoid}input,textarea{border:none!important;border-bottom:1px solid #333!important}.table-wrap{overflow:visible}}
</style></head><body><main>
<section class="hero"><div class="eyebrow">Internal manual review · evidence-backed Eyeball convention · generated ${escapeHtml(generatedAt.toISOString())}</div>
<h1>Florida evidence-backed Eyeball review</h1>
<p>Ten priority development records first, followed by three blocked branches and 92 legacy holds. This packet is a review instrument, not a publication decision.</p>
<div class="metrics"><div class="metric"><b>10</b>priority records</div><div class="metric"><b>92</b>legacy holds</div><div class="metric"><b>3</b>blocked branches</div><div class="metric"><b>${Object.values(statusCounts).reduce((a,b)=>a+b,0)}</b>expected anchors accounted</div></div></section>
<section class="notice"><strong>NO APPROVALS. DEVELOPMENT-ONLY. SCREENSHOT-FOUND DOES NOT MEAN APPROVED.</strong>
<p><b>Freshness: ${escapeHtml(freshnessState)}.</b> ${escapeHtml(freshnessMessage)} Receipt checked ${escapeHtml(receipt.checkedAt)}. Generation clock: ${escapeHtml(generatedAt.toISOString())}.</p>
<p>All screenshots below were rendered offline from committed official raw HTML snapshots. The renderer blocked every outbound request. Quotes were matched against text extracted from that same saved source identity, and raw plus normalized hashes were validated. External stylesheet requests were intentionally blocked, so browser-default styling may replace stylesheet-only decoration; this is labeled in every figure.</p>
<p>A visual match only establishes that text appears in the saved snapshot. It does not establish legal sufficiency, currentness after expiry, translation quality, completeness of dependencies, or approval. Every decision must include an action and note and is bound to the displayed record/content/evidence hashes.</p></section>
<section class="appendix-section"><h2>Reviewer identity and packet-level notes</h2>
<p class="warning"><b>HTML fields are temporary and are not saved by this file.</b> For an editable review record, download/open the companion <code>florida-eyeball-review.docx</code> and save that document after editing.</p>
<p>Reviewer: ____________________________________ &nbsp; Date: __________________</p><p>Qualifications / role: ______________________________________________</p><div class="notes-lines"></div></section>
${priorityHtml}
<section class="appendix-section"><h2>Appendix A — three blocked branches</h2>
<p>Recovered source leads remain leads. No branch is approved, and none may be cleared from a screenshot or URL alone.</p>${blockedHtml}</section>
<section class="appendix-section"><h2>Appendix B — 92 legacy holds</h2>
<p>Each manifest hold reason is preserved verbatim. Triage labels organize review only. A reviewer must specify an exact catalog action and note.</p>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Record</th><th>Scope / source URL</th><th>Verbatim hold reason / triage</th><th>Precise question</th><th>Blank decision</th></tr></thead><tbody>${legacyHtml}</tbody></table></div></section>
<footer><p>Inputs: committed Florida manifest, coverage inventory, reviewed E/F analyses and localized definitions, saved raw/source caches, refresh receipt, and recovery receipts. No network refresh, runtime, database, or publishing action occurred.</p></footer>
</main></body></html>`;

const htmlPath = resolve(outputDir, "florida-eyeball-review.html");
writeFileSync(htmlPath, html);

const noBorders = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE },
  insideVertical: { style: BorderStyle.NONE },
};
const para = (text, options = {}) => new Paragraph({
  ...options,
  children: [new TextRun({ text: String(text ?? ""), ...options.run })],
});
const heading = (text, level = HeadingLevel.HEADING_1) => para(text, { heading: level, run: { bold: true, color: "102A43" } });
const labelPara = (label, value = "") => new Paragraph({
  children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(String(value))],
  spacing: { after: 80 },
});
const tableCell = (text, bold = false) => new TableCell({
  children: [para(text, { run: { bold, size: 17 } })],
  shading: bold ? { fill: "E9F2F8", type: ShadingType.CLEAR } : undefined,
});
const makeTable = (headers, rows, widths) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: widths,
  rows: [
    new TableRow({ tableHeader: true, children: headers.map(value => tableCell(value, true)) }),
    ...rows.map(row => new TableRow({ children: row.map(value => tableCell(value)) })),
  ],
});
const imageRun = image => {
  const maxWidth = 610;
  const maxHeight = 650;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  return new ImageRun({
    data: image.data,
    transformation: { width: Math.round(image.width * scale), height: Math.round(image.height * scale) },
    type: "png",
  });
};

const docChildren = [
  para("INTERNAL · NO APPROVALS · DEVELOPMENT ONLY", { alignment: AlignmentType.CENTER, run: { bold: true, color: "9B1C1C", size: 22 } }),
  heading("Florida evidence-backed Eyeball review"),
  para(`Generated ${generatedAt.toISOString()}. Ten priority records, three blocked branches, and 92 legacy holds.`),
  para(`Freshness: ${freshnessState}. ${freshnessMessage}`, { run: { bold: true, color: generatedAt >= expiresAt ? "9B1C1C" : "7A5200" } }),
  para("A text or screenshot match is not approval. Screenshots are direct offline renderings of saved official raw HTML with outbound requests blocked. Browser-default styling appears where the saved page referenced an external stylesheet. Yellow highlighting is an annotation."),
  labelPara("Reviewer", "________________________________________"),
  labelPara("Date", "____________________"),
  labelPara("Packet notes", "________________________________________________________________________________"),
];

for (let index = 0; index < priorities.length; index++) {
  const item = priorities[index];
  const text = item.definition.text;
  docChildren.push(
    new Paragraph({ children: [new PageBreak()] }),
    para(`PRIORITY ${index + 1} · ${index === 0 ? "RECOVERED BATCH E" : "BATCH F"} · NO APPROVAL`, { run: { bold: true, color: "165D8F", size: 18 } }),
    heading(item.definition.name),
    labelPara("Record ID", item.definition.id),
    labelPara("Exact scope", citationFor(item.definition.code)),
    heading("Proposed EN / ES / ZH explanations", HeadingLevel.HEADING_2),
    labelPara("EN", `${text.en.plainSummary} ${text.en.degreeContext}`),
    labelPara("ES", `${text.es.plainSummary} ${text.es.degreeContext}`),
    labelPara("ZH", `${text.zh.plainSummary} ${text.zh.degreeContext}`),
    para("Spanish and Chinese text has no fluent-speaker or attorney approval in this packet.", { run: { bold: true, color: "9B1C1C" } }),
    heading("Exact quoted support and anchor accounting", HeadingLevel.HEADING_2),
    para("Matched means one normalized occurrence in the saved snapshot text. It does not mean legally sufficient or approved."),
    makeTable(
      ["Anchor", "Status", "Count", "Exact quote", "Screenshot"],
      item.anchors.map(row => [row.key, row.status, String(row.occurrenceCount), row.quote, row.screenshotMatch]),
      [1000, 900, 600, 5200, 1500],
    ),
    heading("Saved-source evidence frames", HeadingLevel.HEADING_2),
  );
  item.images.forEach((image, imageIndex) => {
    docChildren.push(
      new Paragraph({ children: [imageRun(image)], alignment: AlignmentType.CENTER }),
      para(`Frame ${imageIndex + 1}. Direct offline rendering of saved official raw HTML; outbound resources blocked; yellow outline is the review annotation. Context around the complete qualification is retained.`, { run: { italics: true, size: 17 } }),
    );
  });
  docChildren.push(
    heading("Accessible source and provenance", HeadingLevel.HEADING_2),
    labelPara("Official source URL", item.source.url),
    labelPara("Edition", item.source.edition),
    labelPara("Raw HTML retrieved", item.source.rawRetrievedAt),
    labelPara("Parsed evidence retrieved", item.source.parsedEvidenceRetrievedAt),
    labelPara("Raw HTML SHA-256", item.source.rawHash),
    labelPara("Normalized source-text SHA-256", item.source.contentHash),
    ...item.anchors.map(anchor => labelPara(`${anchor.kind} · ${anchor.status}`, anchor.quote)),
    heading("Dependencies, defenses, exceptions, and boundaries", HeadingLevel.HEADING_2),
    labelPara("Analyst boundary", item.analysis.notes),
    makeTable(
      ["Section", "Role", "Edition", "Retrieved", "Content SHA-256", "Validation"],
      item.dependencies.map(row => [`§ ${row.section}`, row.role, row.edition, row.retrievedAt, row.contentHash, row.hashValidation]),
      [1000, 900, 1400, 1400, 3300, 1100],
    ),
    heading("Precise review question", HeadingLevel.HEADING_2),
    para(item.question),
    heading("Blank decision", HeadingLevel.HEADING_2),
    para("☐ publish   ☐ hold   ☐ correct   ☐ split   ☐ reclassify   ☐ deduplicate   ☐ remove"),
    labelPara("Decision / exact action", "__________________________________________________________________"),
    labelPara("Required notes / exact corrections", "____________________________________________________________"),
    para("________________________________________________________________________________________"),
    para("________________________________________________________________________________________"),
    labelPara("Reviewer", "________________________________________"),
    labelPara("Date", "____________________"),
    labelPara("Record hash", item.recordHash),
    labelPara("Evidence hash", item.evidenceHash),
    labelPara("Combined decision-binding hash", item.bindingHash),
  );
}

docChildren.push(
  new Paragraph({ children: [new PageBreak()] }),
  heading("Appendix A — three blocked branches"),
  para("Recovered sources are leads only. No branch is approved and none may be cleared from a screenshot or URL alone."),
);
for (const row of blocked) {
  docChildren.push(
    heading(citationFor(row.code), HeadingLevel.HEADING_2),
    labelPara("Record ID", row.id),
    labelPara("Specific hold reason", row.reason),
    labelPara("Saved official source leads", row.urls.join(" | ")),
    labelPara("Review question", row.question),
    labelPara("Decision", "____________________"),
    labelPara("Reviewer / date", "________________________________ / ______________"),
    labelPara("Notes / exact subdivisions", "____________________________________________________________"),
  );
}

docChildren.push(
  new Paragraph({ children: [new PageBreak()] }),
  heading("Appendix B — 92 legacy holds"),
  para("Manifest hold reasons are preserved verbatim. Triage labels organize review only. Record an exact action and note."),
  makeTable(
    ["#", "Record / label", "Scope / source", "Verbatim reason / triage", "Precise question", "Blank decision"],
    legacyRows.map((row, index) => [
      String(index + 1),
      `${row.id}\n${row.label}`,
      `${citationFor(row.code)}\n${row.sourceUrl}`,
      `${row.triage}\n${row.reason}`,
      row.question,
      "Decision:\nReviewer:\nDate:\nNotes:",
    ]),
    [400, 1800, 1700, 2400, 2600, 1100],
  ),
);

const doc = new Document({
  styles: {
    default: { document: { run: {
      font: { ascii: "Arial", hAnsi: "Arial", cs: "Arial", eastAsia: "Microsoft YaHei" },
      language: { value: "en-US", eastAsia: "zh-CN" },
      size: 20,
    }, paragraph: { spacing: { after: 100, line: 250 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "102A43" }, paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 25, bold: true, color: "243B53" }, paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 720, right: 650, bottom: 720, left: 650 },
        pageNumbers: { start: 1 },
      },
    },
    children: docChildren,
  }],
});
const docxPath = resolve(outputDir, "florida-eyeball-review.docx");
writeFileSync(docxPath, await Packer.toBuffer(doc));

const audit = {
  schemaVersion: 1,
  generatedAt: generatedAt.toISOString(),
  networkRefreshPerformed: false,
  outboundRenderingRequestsBlocked: true,
  freshness: {
    status: generatedAt >= expiresAt ? "expired" : "not_expired_at_generation",
    checkedAt: receipt.checkedAt,
    expiresAt: receipt.expiresAt,
    generationClock: generatedAt.toISOString(),
  },
  counts: {
    priority: priorities.length,
    recoveredBatchE: 1,
    batchF: 9,
    legacyHolds: legacyRows.length,
    blockedBranches: blocked.length,
    recoveredAuthorities: recoveryFindings.authorities.length,
    expectedAnchors: priorities.flatMap(item => item.anchors).length,
    anchorStatuses: statusCounts,
    screenshots: priorities.flatMap(item => item.images).length,
  },
  priorities: priorities.map(item => ({
    id: item.definition.id,
    recordHash: item.recordHash,
    evidenceHash: item.evidenceHash,
    bindingHash: item.bindingHash,
    source: item.source,
    anchors: item.anchors,
    dependencyCount: item.dependencies.length,
  })),
  outputHashes: {
    htmlSha256: sha(readFileSync(htmlPath)),
    docxSha256: sha(readFileSync(docxPath)),
  },
};
const auditPath = resolve(outputDir, "florida-eyeball-review-audit.json");
writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`);

if (!readFileSync(htmlPath, "utf8").includes("</html>")) throw new Error("HTML output is incomplete");
if (priorities.flatMap(item => item.anchors).some(anchor => !["matched", "partial", "missing", "ambiguous"].includes(anchor.status))) {
  throw new Error("An expected anchor was not accounted for");
}
if (priorities.filter(item => item.definition.text?.en && item.definition.text?.es && item.definition.text?.zh).length !== 10) {
  throw new Error("All priority records must include EN/ES/ZH explanations");
}
if (legacyRows.length !== 92 || blocked.length !== 3 || priorities.length !== 10) {
  throw new Error("Output count validation failed");
}

console.log(JSON.stringify({
  html: "scripts/data-review/output/florida-eyeball-review.html",
  docx: "scripts/data-review/output/florida-eyeball-review.docx",
  audit: "scripts/data-review/output/florida-eyeball-review-audit.json",
  assets: "scripts/data-review/output/florida-eyeball-review-assets/",
  counts: audit.counts,
  freshness: audit.freshness,
}, null, 2));