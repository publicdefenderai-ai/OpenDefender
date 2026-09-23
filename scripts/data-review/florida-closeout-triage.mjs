import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUTPUT = resolve(ROOT, "scripts/data-review/output");
const readJson = path => JSON.parse(readFileSync(resolve(ROOT, path), "utf8"));
const sha256 = value => createHash("sha256").update(value).digest("hex");

const manifestPath = "scripts/data-review/output/fl-source-manifest.json";
const reportPath = "scripts/data-review/output/florida-reviewed-analysis.json";
const cachePath = "scripts/data-review/output/florida-batch-source-cache.json";
const inventoryPath = "scripts/data-review/output/florida-coverage-inventory.json";
const attorneyReviewPath = "scripts/data-review/output/florida-eyeball-review-reconciliation-audit.json";
const manifest = readJson(manifestPath);
const report = readJson(reportPath);
const cache = readJson(cachePath);
const inventory = readJson(inventoryPath);
const attorneyReview = readJson(attorneyReviewPath);
const holds = manifest.catalogRecords.filter(
  row => !["retain", "exact_alias_rename"].includes(row.disposition),
);
const drafts = new Map(report.drafts.map(row => [row.id, row]));

const C = {
  covered: "covered_by_existing_exact_record",
  mechanical: "mechanical_correction",
  missing: "genuinely_missing_offense",
  legal: "real_legal_question",
  out: "nonoffense_or_out_of_scope_candidate",
};

const groups = {
  [C.mechanical]: [
    "fl-menacing", "fl-theft-by-receiving", "fl-credit-card-fraud",
    "fl-possession-of-prohibited-weapon", "fl-solicitation",
    "fl-animal-cruelty-misdemeanor", "fl-false-info-to-police",
    "fl-disorderly-conduct", "fl-criminal-attempt", "fl-conspiracy",
    "fl-accessory-after-the-fact", "fl-criminal-solicitation",
    "fl-possession-of-drug-paraphernalia", "fl-distribution-of-controlled-substance",
    "fl-manufacturing-controlled-substance", "fl-possession-with-intent-to-distribute",
    "fl-felon-in-possession-of-firearm", "fl-vandalism", "fl-shoplifting",
    "fl-computer-fraud", "fl-insurance-fraud", "fl-failure-to-pay-child-support",
    "fl-battery", "fl-hit-and-run", "fl-driving-with-suspended-license",
    "fl-possession-of-controlled-substance", "fl-trespass-after-warning",
  ],
  [C.covered]: [
    "fl-felony-murder", "fl-child-sexual-abuse", "fl-sexual-exploitation-of-minor",
    "fl-petty-theft", "fl-identity-theft", "fl-protective-order-violation",
    "fl-harassment", "fl-littering", "fl-drug-trafficking", "fl-dui-first-offense",
    "fl-expired-registration", "fl-check-fraud", "fl-noise-violation",
  ],
  [C.missing]: [
    "fl-sexual-assault-in-the-second-degree", "fl-dui-second-offense",
    "fl-dui-third-offense", "fl-open-container", "fl-fake-id",
    "fl-driving-without-insurance", "fl-unregistered-vehicle", "fl-curfew-violation",
    "fl-hunting-fishing-no-license", "fl-maintaining-drug-house",
  ],
  [C.legal]: [
    "fl-voluntary-manslaughter", "fl-involuntary-manslaughter",
    "fl-criminally-negligent-homicide", "fl-assault-on-peace-officer",
    "fl-embezzlement", "fl-petit-theft", "fl-residential-burglary",
    "fl-commercial-burglary", "fl-auto-burglary", "fl-domestic-battery",
    "fl-resisting-arrest", "fl-failure-to-appear", "fl-indecent-exposure",
    "fl-tax-fraud", "fl-violation-of-probation", "fl-attempted-murder",
    "fl-attempted-robbery", "fl-attempted-sexual-assault", "fl-aiding-and-abetting",
    "fl-rico-organized-crime", "fl-money-laundering", "fl-juvenile-firearm-possession",
  ],
  [C.out]: [
    "fl-bank-robbery", "fl-wire-fraud", "fl-mail-fraud", "fl-animal-at-large",
    "fl-contempt-of-court",
    "fl-expired-inspection", "fl-illegal-camping", "fl-panhandling",
    "fl-defective-vehicle-equipment", "fl-truancy", "fl-illegal-fireworks",
    "fl-alcohol-in-park", "fl-gang-enhancement", "fl-hate-crime-enhancement",
    "fl-recidivist-enhancement", "fl-firearm-in-felony-enhancement",
    "fl-drug-school-zone-enhancement", "fl-juvenile-delinquency-felony",
    "fl-juvenile-delinquency-misdemeanor", "fl-juvenile-transfer-adult-court",
  ],
};

const target = {
  "fl-menacing": ["fl-fs-784-011-assault"],
  "fl-theft-by-receiving": ["fl-fs-812-019-dealing-in-stolen-property"],
  "fl-credit-card-fraud": ["fl-fs-817-61-fraudulent-use-of-credit-cards"],
  "fl-possession-of-prohibited-weapon": ["fl-fs-790-221-possession-of-short-barreled-rifle-short-barreled-shotgun-or-machine-gun-penalty"],
  "fl-solicitation": ["fl-fs-796-07-prohibiting-prostitution-and-related-acts"],
  "fl-animal-cruelty-misdemeanor": ["fl-fs-828-12-animal-cruelty"],
  "fl-false-info-to-police": ["fl-fs-837-05-false-reports-to-law-enforcement-authorities"],
  "fl-disorderly-conduct": ["fl-fs-877-03-breach-of-the-peace-disorderly-conduct"],
  "fl-criminal-attempt": ["fl-fs-777-04-1-criminal-attempt"],
  "fl-conspiracy": ["fl-fs-777-04-3-criminal-conspiracy"],
  "fl-accessory-after-the-fact": ["fl-fs-777-03-accessory-after-the-fact"],
  "fl-criminal-solicitation": ["fl-fs-777-04-2-criminal-solicitation"],
  "fl-possession-of-drug-paraphernalia": ["fl-fs-893-147-1-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials"],
  "fl-distribution-of-controlled-substance": ["fl-fs-893-13-1-a-prohibited-acts-penalties"],
  "fl-manufacturing-controlled-substance": ["fl-fs-893-13-1-a-prohibited-acts-penalties"],
  "fl-possession-with-intent-to-distribute": ["fl-fs-893-13-1-a-prohibited-acts-penalties"],
  "fl-felon-in-possession-of-firearm": ["fl-fs-790-23-felons-and-delinquents-possession-of-firearms-ammunition-or-electric-weapons-or-devices-unlawful"],
  "fl-vandalism": ["fl-fs-806-13-criminal-mischief"],
  "fl-shoplifting": ["fl-fs-812-015-retail-theft"],
  "fl-computer-fraud": ["fl-fs-815-06-offense-against-users-of-computers-computer-systems-computer-networks-or-electronic-devices"],
  "fl-insurance-fraud": ["fl-fs-817-234-insurance-fraud"],
  "fl-failure-to-pay-child-support": ["fl-fs-827-06-nonsupport-of-dependents"],
  "fl-battery": ["fl-fs-784-03-battery"],
  "fl-hit-and-run": ["fl-fs-316-061-1-crashes-involving-damage-to-vehicle-or-property"],
  "fl-driving-with-suspended-license": ["fl-fs-322-34-2-driving-while-license-suspended-revoked-canceled-or-disqualified"],
  "fl-possession-of-controlled-substance": ["fl-fs-893-13-6-a-prohibited-acts-penalties"],
  "fl-trespass-after-warning": ["fl-fs-810-09-trespass-on-property-other-than-structure-or-conveyance"],
  "fl-felony-murder": ["fl-murder-in-the-first-degree", "fl-murder-in-the-second-degree", "fl-fs-782-04-4-murder-in-the-third-degree"],
  "fl-child-sexual-abuse": ["fl-fs-800-04-4-lewd-or-lascivious-battery", "fl-fs-800-04-5-lewd-or-lascivious-molestation", "fl-fs-800-04-6-lewd-or-lascivious-conduct", "fl-fs-800-04-7-lewd-or-lascivious-exhibition"],
  "fl-sexual-exploitation-of-minor": ["fl-fs-827-071-2-a-use-of-a-child-in-a-sexual-performance", "fl-fs-827-071-2-b-aggravated-use-of-a-child-in-a-sexual-performance", "fl-fs-827-071-3-promoting-a-sexual-performance-by-a-child"],
  "fl-petty-theft": ["fl-fs-812-014-2-e-petit-theft-of-the-first-degree", "fl-fs-812-014-3-a-petit-theft-of-the-second-degree", "fl-fs-812-014-3-b-petit-theft", "fl-fs-812-014-3-c-petit-theft"],
  "fl-identity-theft": ["fl-fs-817-568-fraudulent-use-of-personal-identification-information", "fl-fs-817-568-harassment-by-use-of-personal-identification-information"],
  "fl-protective-order-violation": ["fl-fs-741-31-4-a-violation-of-an-injunction-for-protection-against-domestic-violence"],
  "fl-harassment": ["fl-fs-784-048-2-stalking", "fl-fs-784-048-3-aggravated-stalking"],
  "fl-littering": ["fl-fs-403-413-6-b-florida-litter-law"],
  "fl-drug-trafficking": ["fl-fs-893-135-1-b-1-trafficking-in-cocaine", "fl-fs-893-135-1-c-1-trafficking-in-illegal-drugs"],
  "fl-dui-first-offense": ["fl-fs-316-193-1-driving-under-the-influence"],
  "fl-expired-registration": ["fl-fs-320-07-3-c-expiration-of-registration-renewal-required-penalties"],
  "fl-check-fraud": ["fl-fs-832-05-giving-worthless-checks-drafts-and-debit-card-orders-penalty-duty-of-drawee-evidence-costs-complaint-form"],
  "fl-noise-violation": ["fl-fs-877-03-breach-of-the-peace-disorderly-conduct"],
};

const legalQuestion = {
  "fl-voluntary-manslaughter": "Does Florida recognize a separately selectable voluntary-manslaughter offense, or should users select § 782.07(1) manslaughter without the common-law modifier?",
  "fl-involuntary-manslaughter": "Does Florida recognize a separately selectable involuntary-manslaughter offense, or should users select § 782.07(1) manslaughter without the common-law modifier?",
  "fl-criminally-negligent-homicide": "Which Florida offense, if any, is intended by this nonstatutory label?",
  "fl-assault-on-peace-officer": "Should § 784.07 be represented as a reclassification attached to an exact assault/battery predicate rather than as a standalone offense?",
  "fl-domestic-battery": "Should the catalog model domestic relationship facts separately from § 784.03 battery?",
  "fl-violation-of-probation": "Should a revocation proceeding under § 948.06 ever appear in the offense selector?",
  "fl-attempted-murder": "Should attempt-plus-predicate combinations be generated dynamically rather than stored as standalone charges?",
  "fl-attempted-robbery": "Should attempt-plus-predicate combinations be generated dynamically rather than stored as standalone charges?",
  "fl-attempted-sexual-assault": "Which exact Florida sexual-battery predicate and attempt grade does this label intend?",
  "fl-aiding-and-abetting": "Which current Florida principal/accessory provision and liability model should replace the MPC placeholder?",
  "fl-juvenile-firearm-possession": "Which exact substantive firearm provision is intended, rather than an uncited juvenile-status label?",
};

const categoryById = new Map();
for (const [category, ids] of Object.entries(groups)) {
  for (const id of ids) {
    if (categoryById.has(id)) throw new Error(`Duplicate decision for ${id}`);
    categoryById.set(id, category);
  }
}

const attorneyNoteByRecordId = new Map();
for (const item of attorneyReview.items ?? []) {
  const note = item.verbatimDecision?.notes || item.verbatimDecision?.decision;
  if (!note) continue;
  for (const mapping of item.catalogMappings ?? []) {
    if (mapping.id && !attorneyNoteByRecordId.has(mapping.id)) {
      attorneyNoteByRecordId.set(mapping.id, {
        reviewer: item.reviewer,
        reviewerEnteredDate: item.reviewerEnteredDate,
        note,
        sourceReviewHash: attorneyReview.sourceReview?.sha256 ?? null,
      });
    }
  }
}
const holdIds = new Set(holds.map(row => row.chargeId));
const missingDecisions = holds.filter(row => !categoryById.has(row.chargeId));
const extraDecisions = [...categoryById].filter(([id]) => !holdIds.has(id));
if (holds.length !== 92 || categoryById.size !== 92 || missingDecisions.length || extraDecisions.length) {
  throw new Error(`Closeout accounting failed: holds=${holds.length}, decisions=${categoryById.size}, missing=${missingDecisions.map(row => row.chargeId)}, extra=${extraDecisions.map(([id]) => id)}`);
}

function numericSection(code) {
  return String(code).match(/(?:^|\s)(\d{2,4}\.\d{2,6})/)?.[1] ?? null;
}

function trimQuote(text, maximum = 700) {
  const normalized = String(text ?? "").replace(/\n{3,}/g, "\n\n").trim();
  return normalized.length <= maximum ? normalized : `${normalized.slice(0, maximum - 1).trimEnd()}…`;
}

function evidenceFor(row, targetIds) {
  const evidence = [];
  for (const id of targetIds) {
    const draft = drafts.get(id);
    if (!draft) {
      const retained = manifest.catalogRecords.find(record => record.chargeId === id);
      if (retained) evidence.push({
        kind: "selectable_manifest_record",
        recordId: id,
        citation: retained.catalogCode,
        supportQuote: retained.canonicalTitle ?? retained.catalogLabel,
        sourceHash: sha256(JSON.stringify(retained)),
        sourcePath: manifestPath,
      });
      continue;
    }
    const item = draft.identityEvidence ?? draft.conductEvidence?.[0] ?? draft.gradeEvidence?.[0];
    evidence.push({
      kind: "source_first_selectable_record",
      recordId: id,
      citation: draft.citation,
      supportQuote: trimQuote(item?.text ?? draft.conduct),
      sourceHash: item?.sourceHash ?? null,
      sourceKey: item?.sourceKey ?? draft.primarySourceKey,
      sourcePath: reportPath,
    });
    const reviewNote = attorneyNoteByRecordId.get(id);
    if (reviewNote) evidence.push({
      kind: "note_driven_attorney_review",
      recordId: id,
      citation: draft.citation,
      supportQuote: trimQuote(reviewNote.note),
      sourceHash: reviewNote.sourceReviewHash,
      reviewer: reviewNote.reviewer,
      reviewerEnteredDate: reviewNote.reviewerEnteredDate,
      sourcePath: attorneyReviewPath,
    });
  }
  const section = numericSection(row.catalogCode);
  const document = section ? cache.documents[section] : null;
  if (document) evidence.push({
    kind: "authoritative_cached_law",
    recordId: null,
    citation: `Fla. Stat. § ${section}`,
    supportQuote: trimQuote(document.text),
    sourceHash: document.contentHash,
    sourceUrl: document.sourceUrl,
    edition: document.edition,
    retrievedAt: document.retrievedAt,
    sourcePath: cachePath,
  });
  if (!evidence.length) evidence.push({
    kind: "manifest_hold",
    recordId: row.chargeId,
    citation: row.catalogCode,
    supportQuote: row.dispositionReason,
    sourceHash: sha256(JSON.stringify(row)),
    sourcePath: manifestPath,
  });
  return evidence;
}

function rationale(row, category, extent, targetIds) {
  if (category === C.mechanical) {
    return `A currently selectable source-first record states the exact Florida provision for the conduct represented by this legacy row. The legacy label/code should not remain as a parallel selection.`;
  }
  if (category === C.covered) {
    return extent === "partial"
      ? `Currently selectable exact records cover identified branches of the legacy umbrella, but not every possible branch implied by its label. Citation or heading similarity is not treated as complete coverage.`
      : `A currently selectable exact record covers the full identified legacy scope.`;
  }
  if (category === C.missing) {
    return `The current official cached section contains an offense branch matching the legacy concept, but no currently selectable exact record in the reviewed report or retained manifest covers that branch.`;
  }
  if (category === C.out) {
    return `The cited material is federal, definitional, procedural, civil, an enhancement, an infraction, nonexistent in the Florida cache, or does not establish the labeled Florida offense. It is a removal/out-of-scope candidate, not a missing-offense conclusion.`;
  }
  return legalQuestion[row.chargeId] ??
    `The cached authority and selectable records do not establish that the legacy label is coextensive with a Florida offense. Attorney review should resolve the narrow label/scope question before mapping or removal.`;
}

const partialCovered = new Set(groups[C.covered]);
const records = holds.map((row, index) => {
  const category = categoryById.get(row.chargeId);
  const targetIds = target[row.chargeId] ?? [];
  const extent = category === C.covered ? (partialCovered.has(row.chargeId) ? "partial" : "full")
    : category === C.mechanical ? "full" : "none";
  const safe = category === C.mechanical;
  return {
    ordinal: index + 1,
    legacyId: row.chargeId,
    legacyLabel: row.catalogLabel,
    legacyCode: row.catalogCode,
    legacyCategory: row.catalogCategory,
    legacyDisposition: row.disposition,
    classification: category,
    coverageExtent: extent,
    existingExactRecordIds: targetIds,
    existingExactCitations: targetIds.map(id => drafts.get(id)?.citation ??
      manifest.catalogRecords.find(record => record.chargeId === id)?.catalogCode ?? null),
    rationale: rationale(row, category, extent, targetIds),
    proposedAction: category === C.mechanical
      ? `Retire the legacy row and route selection to ${targetIds.join(", ")}; preserve the source-first display name and exact code.`
      : category === C.covered
        ? `Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them.`
        : category === C.missing
          ? `Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence.`
          : category === C.out
            ? `Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation.`
            : `Hold for the single narrow attorney question; do not map by heading or citation alone.`,
    attorneyQuestion: category === C.legal
      ? (legalQuestion[row.chargeId] ?? `What exact Florida offense and subdivision, if any, should the label “${row.catalogLabel}” represent?`)
      : null,
    mechanicalRecommendation: safe ? {
      operation: "replace_legacy_with_existing_record",
      legacyId: row.chargeId,
      replacementRecordIds: targetIds,
      safeToApply: true,
      preconditions: [
        "Replacement IDs remain selectable.",
        "Do not copy the legacy category or broaden the replacement citation.",
      ],
    } : null,
    evidence: evidenceFor(row, targetIds),
  };
});

const counts = Object.fromEntries(Object.values(C).map(category => [
  category, records.filter(row => row.classification === category).length,
]));
const questions = records.filter(row => row.attorneyQuestion).map(row => ({
  legacyId: row.legacyId,
  legacyLabel: row.legacyLabel,
  question: row.attorneyQuestion,
  evidenceCitations: row.evidence.map(item => item.citation),
}));
const result = {
  schemaVersion: 1,
  kind: "florida_legacy_hold_closeout_triage",
  generatedAt: inventory.inventoryAsOf,
  jurisdiction: "FL",
  accounting: {
    expectedLegacyHolds: 92,
    triagedLegacyHolds: records.length,
    uniqueLegacyIds: new Set(records.map(row => row.legacyId)).size,
    eachHoldAppearsExactlyOnce: records.length === 92 && new Set(records.map(row => row.legacyId)).size === 92,
    denominator: "The 92 require_exact_reselection rows in the committed Florida source manifest.",
    completenessDisclosure: "This closes the 92-item legacy cleanup catalog only. It is not a completeness review of the Florida Statutes, the statewide offense universe, or every branch in cached sections.",
  },
  methodology: {
    authorityRule: "Current selectable source-first records were compared to exact legacy scope; authoritative cached law was used for unresolved numeric sections. Matching a citation or heading alone never establishes coverage.",
    exactCitationGate: "A bare section is not treated as authority for a cited subdivision, and an umbrella label is not treated as fully covered by one branch.",
    sourceFreshness: "No network refresh was performed. Cached pages retain publisher edition, retrieval timestamp, URL, and content hash.",
    attorneyReviewUse: "Where the reconciled attorney packet addressed a replacement record, its verbatim note is attached as separate evidence. The review itself expressly does not claim broader legal approval.",
  },
  counts,
  safeMechanicalRecommendationCount: records.filter(row => row.mechanicalRecommendation?.safeToApply).length,
  safeMechanicalRecommendations: records.flatMap(row => row.mechanicalRecommendation ? [row.mechanicalRecommendation] : []),
  groupedUnresolvedQuestions: {
    count: questions.length,
    instruction: "Ask only these narrow mapping/modeling questions; the remaining holds have deterministic integration actions.",
    items: questions,
  },
  inputs: [manifestPath, reportPath, cachePath, inventoryPath, attorneyReviewPath].map(path => ({
    path,
    sha256: sha256(readFileSync(resolve(ROOT, path), "utf8")),
  })),
  records,
};

const csvCell = value => `"${String(value ?? "").replace(/"/g, "\"\"")}"`;
const csvColumns = [
  "ordinal", "legacyId", "legacyLabel", "legacyCode", "legacyCategory",
  "classification", "coverageExtent", "existingExactRecordIds",
  "existingExactCitations", "proposedAction", "attorneyQuestion",
  "safeMechanical", "evidenceCitations", "evidenceSourceHashes", "supportQuotes",
];
const csv = [
  csvColumns.map(csvCell).join(","),
  ...records.map(row => csvColumns.map(column => {
    const value = column === "safeMechanical" ? Boolean(row.mechanicalRecommendation?.safeToApply)
      : column === "evidenceCitations" ? row.evidence.map(item => item.citation).join(" | ")
      : column === "evidenceSourceHashes" ? row.evidence.map(item => item.sourceHash).filter(Boolean).join(" | ")
      : column === "supportQuotes" ? row.evidence.map(item => item.supportQuote).join(" | ")
      : Array.isArray(row[column]) ? row[column].join(" | ") : row[column];
    return csvCell(value);
  }).join(",")),
].join("\n") + "\n";

const escapeHtml = value => String(value ?? "").replace(/[&<>"]/g, char =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char]);
const markdown = `# Florida legacy-hold closeout triage

**Catalog denominator:** 92 manifest rows marked \`require_exact_reselection\`; **92/92 triaged exactly once**.

This closes the legacy cleanup catalog, not the Florida Statutes. The cached working set is not a statewide statute or offense denominator, and no statewide completeness percentage is claimed. Coverage is branch-specific: a matching heading or bare section citation was not enough.

## Counts

${Object.entries(counts).map(([key, value]) => `- **${key}:** ${value}`).join("\n")}

- **Safe mechanical replacements:** ${result.safeMechanicalRecommendationCount}
- **Narrow attorney questions:** ${questions.length}

## Safe to apply

${records.filter(row => row.mechanicalRecommendation).map(row =>
  `- \`${row.legacyId}\` → ${row.existingExactRecordIds.map(id => `\`${id}\``).join(", ")}`).join("\n")}

## Grouped unresolved questions

${questions.map(row => `- **${row.legacyId}:** ${row.question}`).join("\n")}

## Full accounting

| # | Legacy row | Classification | Extent | Exact replacement(s) | Action |
|---:|---|---|---|---|---|
${records.map(row => `| ${row.ordinal} | \`${row.legacyId}\` — ${row.legacyLabel.replace(/\|/g, "\\|")} | ${row.classification} | ${row.coverageExtent} | ${row.existingExactRecordIds.map(id => `\`${id}\``).join("<br>") || "—"} | ${row.proposedAction.replace(/\|/g, "\\|")} |`).join("\n")}

The JSON and CSV contain exact citations, support quotes, source keys/URLs, and source hashes for integration and audit.
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Florida closeout triage</title><style>
body{font:15px/1.45 system-ui,sans-serif;color:#17212b;max-width:1400px;margin:2rem auto;padding:0 1rem}h1,h2{color:#173f5f}.notice{padding:1rem;border-left:5px solid #b36b00;background:#fff6d8}.cards{display:flex;gap:.7rem;flex-wrap:wrap}.card{border:1px solid #ccd5de;border-radius:7px;padding:.7rem;min-width:180px}.n{font-size:1.5rem;font-weight:700}table{border-collapse:collapse;width:100%;font-size:.82rem}th,td{border:1px solid #ccd5de;padding:.4rem;vertical-align:top;text-align:left}th{background:#edf3f7;position:sticky;top:0}code{overflow-wrap:anywhere}.mechanical_correction{color:#17612d}.real_legal_question{color:#8a1c1c}
</style></head><body><h1>Florida legacy-hold closeout triage</h1><div class="notice"><strong>Denominator:</strong> 92/92 manifest cleanup rows, each once. This is not a completeness review of all Florida statutes or offenses. Heading/citation similarity alone was not counted as coverage.</div>
<h2>Counts</h2><div class="cards">${Object.entries(counts).map(([key, value]) => `<div class="card"><div class="n">${value}</div>${escapeHtml(key)}</div>`).join("")}</div>
<h2>Actionable accounting</h2><table><thead><tr><th>#</th><th>Legacy</th><th>Class</th><th>Extent</th><th>Exact records</th><th>Action / question</th><th>Evidence</th></tr></thead><tbody>${records.map(row =>
  `<tr><td>${row.ordinal}</td><td><code>${escapeHtml(row.legacyId)}</code><br>${escapeHtml(row.legacyLabel)}<br><code>${escapeHtml(row.legacyCode)}</code></td><td class="${escapeHtml(row.classification)}">${escapeHtml(row.classification)}</td><td>${escapeHtml(row.coverageExtent)}</td><td>${row.existingExactRecordIds.map(id => `<code>${escapeHtml(id)}</code>`).join("<br>") || "—"}</td><td>${escapeHtml(row.attorneyQuestion ?? row.proposedAction)}</td><td>${row.evidence.map(item => `<details><summary>${escapeHtml(item.citation)} · ${escapeHtml(item.sourceHash?.slice(0, 12) ?? "no hash")}</summary><blockquote>${escapeHtml(item.supportQuote)}</blockquote></details>`).join("")}</td></tr>`).join("")}</tbody></table></body></html>`;

mkdirSync(OUTPUT, { recursive: true });
writeFileSync(resolve(OUTPUT, "florida-closeout-triage.json"), `${JSON.stringify(result, null, 2)}\n`);
writeFileSync(resolve(OUTPUT, "florida-closeout-triage.csv"), csv);
writeFileSync(resolve(OUTPUT, "florida-closeout-triage.md"), markdown);
writeFileSync(resolve(OUTPUT, "florida-closeout-triage.html"), html);
console.log(`Wrote Florida closeout triage: ${records.length}/92; ${JSON.stringify(counts)}`);