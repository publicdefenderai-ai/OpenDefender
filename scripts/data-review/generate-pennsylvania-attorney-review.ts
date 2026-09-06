/**
 * Generate the Pennsylvania attorney-review worksheet from the committed
 * authority manifest. The worksheet preserves the current disposition while
 * leaving the attorney's decision and correction fields blank.
 */
import fs from "node:fs";
import path from "node:path";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildPennsylvaniaOfficialSourceUrl,
  getPennsylvaniaApprovedLegacyProvision,
  getPennsylvaniaReferences,
} from "../../server/data/pennsylvania-source-database-seed";

type ManifestProvision = {
  citation?: string;
  officialTitle?: string;
  sourceUrl?: string;
};

type ManifestRecord = {
  chargeId: string;
  catalogLabel: string;
  catalogCode: string;
  catalogCategory: string;
  disposition: string;
  dispositionReason: string;
  canonicalTitle: string | null;
  provisions: ManifestProvision[];
};

type Manifest = {
  catalogRecords: ManifestRecord[];
};

const root = process.cwd();
const manifestPath = path.join(root, "scripts/data-review/output/pa-source-manifest.json");
const outputPath = path.join(root, "docs/pennsylvania-attorney-review.csv");

function csvCell(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function currentCitation(record: ManifestRecord): string {
  return CHARGE_CITATIONS[record.chargeId]?.citation ??
    record.provisions[0]?.citation ??
    "";
}

function officialCodeUrl(record: ManifestRecord): string {
  const provisionUrl = record.provisions[0]?.sourceUrl;
  if (provisionUrl) return provisionUrl;

  const references = getPennsylvaniaReferences(record.chargeId);
  if (references.length !== 1) return "";

  const legacy = getPennsylvaniaApprovedLegacyProvision(references[0]);
  return legacy?.canonicalUrl ??
    buildPennsylvaniaOfficialSourceUrl(references[0].title, references[0].section);
}

function subdivision(record: ManifestRecord): string {
  const references = getPennsylvaniaReferences(record.chargeId);
  if (references.length === 0) return "Exact subdivision unresolved";
  return references
    .map((reference) => reference.subdivision ?? "Whole section")
    .join("; ");
}

function sourceStatus(record: ManifestRecord): string {
  if (record.provisions.length > 0) return "Verified source in committed manifest";
  if (getPennsylvaniaReferences(record.chargeId).length > 0) {
    return "Source reference exists; exact official text is withheld";
  }
  return "Citation needs exact official reselection";
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
const rows = manifest.catalogRecords
  .map((record) => [
    record.chargeId,
    record.catalogLabel,
    record.catalogCode,
    record.catalogCategory,
    record.disposition,
    record.dispositionReason,
    record.canonicalTitle ?? "",
    currentCitation(record),
    subdivision(record),
    officialCodeUrl(record),
    record.provisions.map((provision) => provision.officialTitle ?? "").filter(Boolean).join("; "),
    sourceStatus(record),
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ])
  .sort((left, right) => left[0].localeCompare(right[0]));

const header = [
  "chargeId",
  "catalogLabel",
  "catalogCode",
  "catalogCategory",
  "currentDisposition",
  "currentDispositionReason",
  "proposedAlias",
  "citation",
  "subdivision",
  "officialCodeUrl",
  "officialTitle",
  "sourceStatus",
  "approvedDisplayName",
  "correctedCitation",
  "correctedSubdivision",
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
console.log(
  `Wrote ${rows.length} Pennsylvania attorney-review rows to ${path.relative(root, outputPath)}`,
);