import { extractOhioDocument } from "./ohio-discovery/section-document";
export { extractOhioDocument } from "./ohio-discovery/section-document";
import { OHIO_JUSTICE_SOURCES } from "../../server/data/ohio-justice-source";
import { OHIO_BENEFITS_FRAUD_SOURCES } from "../../server/data/ohio-benefits-fraud-source";
import { OHIO_THEFT_FRAUD_SOURCES } from "../../server/data/ohio-theft-fraud-source";
import { OHIO_RESIDUAL_SOURCES } from "../../server/data/ohio-residual-source";
import { OHIO_MAJOR_SOURCES } from "../../server/data/ohio-major-source";
/**
 * Import Ohio criminal-charge authority from official codes.ohio.gov section
 * pages. The committed manifest is later seeded without network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildOhioManifestRecord,
  buildOhioSourceUrl,
  OHIO_MANIFEST_SOURCE,
  parseOhioCitation,
  type OhioAuthorityManifest,
  type OhioSourceDocument,
} from "../../server/data/ohio-source-database-seed";
import {
  annotateSharedAuthorityMappings,
  createAuthorityModelResponseGenerator,
  reviewAuthorityMappingsWithModel,
  type AuthorityModelMappingReview,
  type AuthorityModelMappingReviewCase,
} from "../../server/services/authority-offense-evidence";
import type { AuthorityCatalogRecord } from "../../server/services/authority-source-database";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../../server/data/ohio-chapter-2903-source";
import { OHIO_REVIEWED_SOURCES } from "../../server/data/ohio-reviewed-source";
const RATE_LIMIT_MS = 700;
const MAX_RETRIES = 3;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36 OpenDefender-OhioAuthorityImporter/1.0";

const MODEL_REVIEW_FLAG = "--model-review";
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSection(url: string): Promise<{ html: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { "User-Agent": UA, Accept: "text/html, */*" },
      });
      const html = await response.text();
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
          await sleep(2500 * (attempt + 1));
          continue;
        }
        return { error: `HTTP ${response.status}` };
      }
      if (!html.includes("Effective")) {
        return { error: "Official page did not contain an Effective marker" };
      }
      return { html };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { error: "Ohio source request exhausted retries" };
}

function unresolvedMappingCases(
  records: AuthorityCatalogRecord[],
): AuthorityModelMappingReviewCase[] {
  return records
    .filter((record) =>
      record.mapping &&
      record.mapping.classification !== "exact_match" &&
      record.mapping.classification !== "approved_alias" &&
      record.mapping.candidateEvidence.length > 0,
    )
    .map((record) => ({
      caseId: record.chargeId,
      catalogLabel: record.catalogLabel,
      catalogCode: record.catalogCode,
      mappingClassification: record.mapping!.classification,
      deterministicConfidence: record.mapping!.confidence,
      evidence: record.mapping!.candidateEvidence,
    }));
}
export function getOhioLegacyManifestCharges() {
  // These two records are composed only from the separately pinned pilot
  // extraction after its live refresh receipt is valid. Never write them into
  // the legacy manifest that the loader protects from source-first shadowing.
  const sourceFirstIds = new Set(
    [
      ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(record => record.chargeId),
      ...OHIO_REVIEWED_SOURCES.map(record => record.chargeId),
      ...OHIO_MAJOR_SOURCES.map(record => record.chargeId),
      ...OHIO_RESIDUAL_SOURCES.map(record => record.chargeId),
      ...OHIO_THEFT_FRAUD_SOURCES.map(record => record.chargeId),
      ...OHIO_BENEFITS_FRAUD_SOURCES.map(record => record.chargeId),
      ...OHIO_JUSTICE_SOURCES.map(record => record.chargeId),
    ],
  );
  return criminalCharges.filter((charge) =>
    charge.jurisdiction === "OH" && !sourceFirstIds.has(charge.id)
  );
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const modelReview = process.argv.includes(MODEL_REVIEW_FLAG);
  const charges = getOhioLegacyManifestCharges();
  const documentCache = new Map<string, OhioSourceDocument | null>();
  const errors = new Map<string, string>();
  let requests = 0;

  for (const charge of charges) {
    const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    for (const reference of references) {
      if (documentCache.has(reference.section)) continue;
      if (requests > 0) await sleep(RATE_LIMIT_MS);
      const sourceUrl = buildOhioSourceUrl(reference.section);
      const response = await fetchSection(sourceUrl);
      requests++;
      const document = "html" in response
        ? extractOhioDocument(response.html, reference.section, sourceUrl, importedAt)
        : null;
      documentCache.set(reference.section, document);
      if (!document) {
        errors.set(reference.section, "Official Ohio page did not contain the expected complete section structure");
        console.error(`[FAIL] ${reference.section}: ${"error" in response ? response.error : "invalid section structure"}`);
      } else {
        console.log(`[OK] ${reference.section}: ${document.title}`);
      }
    }
  }

  const catalogRecords = charges.map((charge) => {
    const references = parseOhioCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    const documents = references.flatMap((reference) => {
      const document = documentCache.get(reference.section);
      return document ? [{ ...document, reference }] : [];
    });
    const missing = references.find((reference) => !documentCache.get(reference.section));
    return buildOhioManifestRecord(
      charge,
      documents,
      importedAt,
      missing
        ? `Ohio Revised Code section ${missing.section} could not be verified.`
        : undefined,
    );
  });
  annotateSharedAuthorityMappings(catalogRecords);
  const manifest: OhioAuthorityManifest = {
    jurisdiction: "OH",
    generatedAt: importedAt,
    source: OHIO_MANIFEST_SOURCE,
    catalogRecords,
  };
  const outputPath = path.resolve(
    process.cwd(),
    "scripts/data-review/output/oh-source-manifest.json",
  );
  const modelReviewResult = modelReview
    ? await writeModelReview(
      catalogRecords,
      path.resolve(process.cwd(), "scripts/data-review/output/ohio-model-mapping-review.json"),
      importedAt,
    )
    : null;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n");
  const selectable = catalogRecords.filter((record) =>
    record.disposition === "retain" || record.disposition === "exact_alias_rename");
  console.log(JSON.stringify({
    jurisdiction: "OH",
    manifestRecords: catalogRecords.length,
    selectableCharges: selectable.length,
    withheldCharges: catalogRecords.length - selectable.length,
    fetchedDocuments: documentCache.size,
    requests,
    sectionErrors: Object.fromEntries(errors),
    outputPath,
    ...(modelReviewResult
      ? {
          modelReview: {
            model: modelReviewResult.model,
            accepted: modelReviewResult.review.accepted,
            rejected: modelReviewResult.review.rejected,
          },
        }
      : {}),
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Ohio authority import failed:", error);
    process.exitCode = 1;
  });
}

function modelResponseGenerator(): {
  model: string;
  generate: ReturnType<typeof createAuthorityModelResponseGenerator>["generate"];
} {
  try {
    return createAuthorityModelResponseGenerator();
  } catch (error) {
    throw new Error(
      `${MODEL_REVIEW_FLAG} ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function writeModelReview(
  records: AuthorityCatalogRecord[],
  outputPath: string,
  generatedAt: Date,
): Promise<{ model: string; review: AuthorityModelMappingReview }> {
  const cases = unresolvedMappingCases(records);
  const configured = cases.length > 0
    ? modelResponseGenerator()
    : { model: "not-called", generate: async () => "" };
  const review = await reviewAuthorityMappingsWithModel(cases, configured.generate);
  const audit = {
    jurisdiction: "OH" as const,
    generatedAt: generatedAt.toISOString(),
    model: configured.model,
    optInFlag: MODEL_REVIEW_FLAG,
    ...review,
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(audit, null, 2) + "\n");
  return { model: configured.model, review };
}
