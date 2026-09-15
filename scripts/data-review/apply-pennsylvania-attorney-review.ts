/**
 * Apply the completed, privacy-safe Pennsylvania attorney-review gate to the
 * committed manifest without fetching new source pages.
 *
 * This is intentionally fail-closed: an approved row that is not already
 * backed by a verified manifest provision remains withheld. A source refresh
 * is still required before newly corrected citations can become selectable.
 */
import fs from "node:fs";
import path from "node:path";
import {
  getPennsylvaniaAttorneyReviewDecision,
  isPennsylvaniaAttorneyReviewPublishable,
} from "../../shared/pennsylvania-attorney-review";
import type { AuthorityCatalogRecord } from "../../server/services/authority-source-database";

const root = process.cwd();
const manifestPath = path.join(
  root,
  "scripts/data-review/output/pa-source-manifest.json",
);

type StoredManifest = {
  jurisdiction: "PA";
  generatedAt: string;
  source: string;
  catalogRecords: AuthorityCatalogRecord[];
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as StoredManifest;
const catalogRecords = manifest.catalogRecords.map((record) => {
  const review = getPennsylvaniaAttorneyReviewDecision(record.chargeId);
  if (!review) {
    return record;
  }
  if (!isPennsylvaniaAttorneyReviewPublishable(record.chargeId)) {
    const remove = review.action === "remove" || review.action === "deduplicate";
    return {
      ...record,
      disposition: remove ? "remove" : "require_exact_reselection",
      dispositionReason: review.note ??
        "Attorney review requires structural correction before publication.",
      canonicalTitle: null,
      provisions: [],
    };
  }
  return {
    ...record,
    provisions: record.provisions.map((provision) => ({
      ...provision,
      metadata: {
        ...provision.metadata,
        attorneyReview: review,
      },
    })),
  };
});

fs.writeFileSync(
  manifestPath,
  JSON.stringify({ ...manifest, catalogRecords }, null, 2) + "\n",
);

console.log(JSON.stringify({
  manifestPath: path.relative(root, manifestPath),
  records: catalogRecords.length,
  publishableRows: catalogRecords.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename").length,
  withheldRows: catalogRecords.filter((record) =>
    record.disposition === "require_exact_reselection").length,
  removedRows: catalogRecords.filter((record) => record.disposition === "remove").length,
}, null, 2));