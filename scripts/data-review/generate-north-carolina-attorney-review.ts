/**
 * Generate the North Carolina attorney-review worksheet from the committed
 * authority manifest. Only rows with complete official source evidence and an
 * unresolved title/mapping decision are included.
 */
import fs from "node:fs";
import path from "node:path";

type ManifestReference = {
  section: string;
  subdivision: string | null;
  citation: string;
  officialUrl: string;
  fetchStatus: string;
  sectionExtractionStatus: string;
  officialTitle: string | null;
};

type ManifestRecord = {
  chargeId: string;
  catalogLabel: string;
  disposition: string;
  canonicalTitle: string | null;
  sourceAudit?: {
    references?: ManifestReference[];
  };
};

type Manifest = {
  catalogRecords: ManifestRecord[];
};

const root = process.cwd();
const manifestPath = path.join(root, "scripts/data-review/output/nc-source-manifest.json");
const outputPath = path.join(root, "docs/north-carolina-title-attorney-review.csv");

function csvCell(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
const rows = manifest.catalogRecords
  .filter((record) => record.disposition === "require_exact_reselection")
  .map((record) => {
    const reference = record.sourceAudit?.references?.find((candidate) =>
      candidate.fetchStatus === "success" &&
      candidate.sectionExtractionStatus === "complete" &&
      Boolean(candidate.officialTitle),
    );
    if (!reference || !record.canonicalTitle) return null;
    return [
      record.chargeId,
      record.catalogLabel,
      record.canonicalTitle,
      reference.citation,
      reference.subdivision ?? "Whole section",
      reference.officialUrl,
      "",
      "",
      "",
      "",
      "",
    ];
  })
  .filter((row): row is string[] => row !== null)
  .sort((left, right) => left[0].localeCompare(right[0]));

const header = [
  "chargeId",
  "catalogLabel",
  "proposedAlias",
  "citation",
  "subdivision",
  "officialCodeUrl",
  "approvedDisplayName",
  "decision",
  "reviewer",
  "reviewedAt",
  "note",
];

const csv = [
  header.map(csvCell).join(","),
  ...rows.map((row) => row.map(csvCell).join(",")),
  "",
].join("\n");

fs.writeFileSync(outputPath, csv);
console.log(`Wrote ${rows.length} North Carolina attorney-review rows to ${path.relative(root, outputPath)}`);