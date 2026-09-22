import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import mammoth from "mammoth";

const uploadPath =
  "attached_assets/SA_Review_-_florida-eyeball-review_1790056341586.docx";
const priorAuditPath =
  "scripts/data-review/output/florida-eyeball-review-audit.json";
const outputPath =
  "scripts/data-review/output/florida-eyeball-review-reconciliation-audit.json";
const csvPath =
  "scripts/data-review/output/florida-eyeball-review-disposition.csv";
const definitions = [
  ...JSON.parse(readFileSync("shared/florida-reviewed-data/e.json", "utf8")),
  ...JSON.parse(readFileSync("shared/florida-reviewed-data/f.json", "utf8")),
];
const priorAudit = JSON.parse(readFileSync(priorAuditPath, "utf8"));
const priorById = new Map(priorAudit.priorities.map(row => [row.id, row]));
const definitionByCode = new Map(definitions.map(row => [row.code, row]));
const sha = value => createHash("sha256").update(value).digest("hex");
const upload = readFileSync(uploadPath);
const { value: reviewText } = await mammoth.extractRawText({ path: uploadPath });

const items = [
  {
    priority: 1,
    reviewedId: "fl-fs-893-147-4-b-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials",
    checkbox: "split",
    decision: "Split into separate charges as outlined below",
    notes: "This provision should not be limited to the transport of contraband. There are seven separate sub charges here: Use or Possession of Drug Paraphernalia (Section 1); Manufacture or Delivery of Drug Paraphernalia (Section 2), Delivery of Drug Paraphernalia to a Minor (Section 3); and Transportation of Drug Paraphernalia (Section 4), Advertisement of Drug Paraphernalia (Section 5), Retail Sale of Drug Paraphernalia (Section 6), and  Tableting Machines, Encapsulating Machines, and Controlled Substance Counterfeiting Materials (Section 7)",
    mappings: [
      ["893.147(1)", "existing", "Use or possession"],
      ["893.147(2)", "existing", "Manufacture or delivery"],
      ["893.147(3)(a)", "existing", "Delivery to minor—adult deliverer"],
      ["893.147(3)(b)", "existing", "Delivery of injection equipment to minor"],
      ["893.147(4)(a)", "existing", "Transportation—controlled substance"],
      ["893.147(4)(b)", "existing", "Transportation—contraband article"],
      ["893.147(5)", "existing", "Advertisement"],
      ["893.147(6)", "existing", "Retail sale"],
      ["893.147(7)", "held", "Tableting/counterfeiting machines and materials"],
    ],
  },
  {
    priority: 2,
    reviewedId: "fl-fs-825-102-1-abuse-aggravated-abuse-and-neglect-of-an-elderly-person-or-disabled-adult-penalties",
    checkbox: "split",
    decision: "__________________________________________________________________",
    notes: "This section contains different subcharges with different penalties, and thus should be split. These include Abuse of an elderly person or disabled adult (Section 1), Aggravated abuse of an elderly person or disabled adult (Section 2), and Neglect of an elderly person or disabled adult (Section 3)",
    mappings: [["825.102(1)", "existing"], ["825.102(2)", "existing"], ["825.102(3)(b)", "existing"], ["825.102(3)(c)", "existing"]],
  },
  {
    priority: 3,
    reviewedId: "fl-fs-825-102-2-abuse-aggravated-abuse-and-neglect-of-an-elderly-person-or-disabled-adult-penalties",
    checkbox: "split",
    decision: "__________________________________________________________________",
    notes: "See my response to the prior question – this whole section should be split accordingly.",
    mappings: [["825.102(1)", "existing"], ["825.102(2)", "existing"], ["825.102(3)(b)", "existing"], ["825.102(3)(c)", "existing"]],
  },
  {
    priority: 4,
    reviewedId: "fl-fs-825-102-3-b-abuse-aggravated-abuse-and-neglect-of-an-elderly-person-or-disabled-adult-penalties",
    checkbox: "split",
    decision: "Split per the more detailed answers above.",
    notes: "See my response to the prior question – this whole section should be split accordingly.",
    mappings: [["825.102(1)", "existing"], ["825.102(2)", "existing"], ["825.102(3)(b)", "existing"], ["825.102(3)(c)", "existing"]],
  },
  {
    priority: 5,
    reviewedId: "fl-fs-825-102-3-c-abuse-aggravated-abuse-and-neglect-of-an-elderly-person-or-disabled-adult-penalties",
    checkbox: null,
    decision: "Split per the more detailed answers above.",
    notes: "See my response to the prior question – this whole section should be split accordingly.",
    mappings: [["825.102(1)", "existing"], ["825.102(2)", "existing"], ["825.102(3)(b)", "existing"], ["825.102(3)(c)", "existing"]],
  },
  {
    priority: 6,
    reviewedId: "fl-fs-827-03-2-a-abuse-aggravated-abuse-and-neglect-of-a-child-penalties",
    checkbox: "split",
    decision: "Split to separate offenses according to the directions below.",
    notes: "This whole section 827.03(2) contains multiple offenses with different punishments and should be split accordingly. 2(a) covers aggravated child abuse, a first degree offense; 2(b) covers willful or negligent child neglect causing harm, disability, or disfigurement, which is a second degree offense; 2(c) covers willful abuse of a child without causing harm, disability or disfigurement, a third degree offense, and 2(d), willful or negligent child neglect not causing harm, disability of disfigurement, a third degree offense.",
    mappings: [["827.03(2)(a)", "existing"], ["827.03(2)(b)", "existing"], ["827.03(2)(c)", "existing"], ["827.03(2)(d)", "existing"]],
  },
  ...[7, 8, 9].map((priority, index) => ({
    priority,
    reviewedId: [
      "fl-fs-827-03-2-b-abuse-aggravated-abuse-and-neglect-of-a-child-penalties",
      "fl-fs-827-03-2-c-abuse-aggravated-abuse-and-neglect-of-a-child-penalties",
      "fl-fs-827-03-2-d-abuse-aggravated-abuse-and-neglect-of-a-child-penalties",
    ][index],
    checkbox: "split",
    decision: "Split according to the instructions above",
    notes: "This section should be split into separate charges as noted above.",
    mappings: [["827.03(2)(a)", "existing"], ["827.03(2)(b)", "existing"], ["827.03(2)(c)", "existing"], ["827.03(2)(d)", "existing"]],
  })),
  {
    priority: 10,
    reviewedId: "fl-fs-827-04-3-contributing-to-the-delinquency-or-dependency-of-a-child-penalty",
    checkbox: "split",
    decision: "Split into two offenses",
    notes: "There are two offenses here with different punishments. The first is provided for in parts (1)(a) and (b) of this section, relating to commission of acts which cause, tend to cause, encourage, or contribute to child delinquency, or induces a child to become or remain dependent of delinquent or in need of services. The second, in part (1)(c), covers someone over 21 impregnating someone under 16. Thus this should be split into two separate charges.",
    mappings: [
      ["827.04(1)", "held", "Contributing to delinquency/dependency—dependency definitions unresolved"],
      ["827.04(3)", "existing", "Impregnation—official 2026 numbering and age language retained"],
    ],
  },
];

for (const item of items) {
  for (const verbatim of [item.decision, item.notes]) {
    if (!reviewText.includes(verbatim)) {
      throw new Error(`Verbatim reviewer text missing for priority ${item.priority}`);
    }
  }
}

const mapped = items.map(item => {
  const prior = priorById.get(item.reviewedId);
  if (!prior) throw new Error(`Prior review binding missing: ${item.reviewedId}`);
  return {
    priority: item.priority,
    reviewedRecordId: item.reviewedId,
    reviewer: "Shahab Asghar",
    reviewerEnteredDate: "9/21/26",
    appliedAction: "split",
    verbatimDecision: {
      checkbox: item.checkbox,
      decision: item.decision,
      notes: item.notes,
    },
    originalBinding: {
      recordHash: prior.recordHash,
      evidenceHash: prior.evidenceHash,
      bindingHash: prior.bindingHash,
    },
    catalogMappings: item.mappings.map(([code, status, boundary]) => {
      const definition = definitionByCode.get(code);
      if (status === "existing" && !definition) {
        throw new Error(`Existing mapping missing for ${code}`);
      }
      return {
        code,
        status,
        ...(boundary ? { boundary } : {}),
        ...(definition ? {
          id: definition.id,
          displayNames: {
            en: definition.name,
            es: definition.names.es,
            zh: definition.names.zh,
          },
          officialHeadingAliases: definition.aliases,
          reconciledRecordHash: sha(JSON.stringify(definition)),
        } : {}),
      };
    }),
  };
});

const audit = {
  schemaVersion: 1,
  kind: "florida_attorney_review_reconciliation",
  sourceReview: {
    path: uploadPath,
    sha256: sha(upload),
    reviewer: "Shahab Asghar",
    reviewerEnteredDate: "9/21/26",
  },
  priorEvidenceAudit: {
    path: priorAuditPath,
    sha256: sha(readFileSync(priorAuditPath)),
  },
  policy: {
    action: "split",
    mappedExistingRecordsBeforeAdding: true,
    recordsAdded: 0,
    officialHeadingPreservedAsSearchAlias: true,
    legalApprovalClaimed: false,
    scope: "Structural split reconciliation and display-name clarification only; no broader legal approval.",
    item5: "Checkbox blank; explicit decision text applied as split per user instruction.",
    item10: "Reviewer reference to (1)(c) and 'over 21' preserved verbatim but not copied as law; official § 827.04(3) and age 21 or older retained.",
  },
  items: mapped,
  remainingHolds: [
    {
      code: "893.147(7)",
      reason: "Recovered source leads do not resolve all incorporated federal definitions, registration/compliance conditions, licensing exceptions, and review boundaries.",
    },
    {
      code: "827.04(1)",
      reason: "Current chapter 39 dependency definitions and nested boundaries remain unresolved; reviewer split direction does not approve this branch.",
    },
  ],
};
writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);

const csvCell = value => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
const csvRows = [
  ["priority", "reviewed_record_id", "decision", "mapped_code", "status", "record_id", "display_name_en", "display_name_es", "display_name_zh"],
  ...mapped.flatMap(item => item.catalogMappings.map(mapping => [
    item.priority, item.reviewedRecordId, item.verbatimDecision.decision,
    mapping.code, mapping.status, mapping.id ?? "",
    mapping.displayNames?.en ?? "", mapping.displayNames?.es ?? "", mapping.displayNames?.zh ?? "",
  ])),
];
writeFileSync(csvPath, `${csvRows.map(row => row.map(csvCell).join(",")).join("\n")}\n`);
console.log(JSON.stringify({ outputPath, csvPath, items: mapped.length }, null, 2));