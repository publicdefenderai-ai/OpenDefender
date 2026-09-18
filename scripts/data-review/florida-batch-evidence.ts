import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  FLORIDA_SOURCE_MAX_AGE_MS, floridaDirectReferences, floridaHash, floridaSectionPattern,
  floridaSectionUrl, validateFloridaDocument, type FloridaBatchCache, type FloridaBatchDocument,
} from "./batch/florida-adapter";
import { createFloridaChapterAcquirer } from "./batch/florida-bulk-source";

const OUTPUT = path.join(process.cwd(), "scripts/data-review/output");
const CACHE_PATH = path.join(OUTPUT, "florida-batch-source-cache.json");
const CHAPTER_CACHE_PATH = path.join(OUTPUT, "florida-batch-chapter-cache.json");
const ACQUISITION_LEDGER_PATH = path.join(OUTPUT, "florida-batch-acquisition-ledger.json");
const MANIFEST_PATH = path.join(OUTPUT, "fl-source-manifest.json");
const MAX_SUPPORTING_SECTIONS = 24;
const COMMON_PENALTIES = ["775.082", "775.083", "775.084"];
const REPLACEMENT_PRIMARY_LEADS = [
  "777.011", "777.03", "777.04", "895.03", "896.101",
  "775.087", "775.084", "775.085", "874.04", "790.22",
];
const PLACEHOLDER_LEGACY_IDS = new Set([
  "fl-bank-robbery", "fl-criminal-attempt", "fl-conspiracy", "fl-aiding-and-abetting",
  "fl-accessory-after-the-fact", "fl-attempted-murder", "fl-attempted-robbery",
  "fl-attempted-sexual-assault", "fl-criminal-solicitation", "fl-gang-enhancement",
  "fl-hate-crime-enhancement", "fl-recidivist-enhancement", "fl-firearm-in-felony-enhancement",
  "fl-drug-school-zone-enhancement", "fl-rico-organized-crime", "fl-money-laundering",
  "fl-juvenile-transfer-adult-court", "fl-juvenile-firearm-possession",
]);
const KNOWN_NON_FL_MISCITATION_IDS = new Set(["fl-wire-fraud", "fl-mail-fraud"]);
const RUNTIME_OFFENSE_LEADS = new Set(["777.03", "777.04", "895.03", "896.101"]);
const REPLACEMENT_LEGACY_IDS: Record<string, string[]> = {
  "777.011": ["fl-aiding-and-abetting"],
  "777.03": ["fl-accessory-after-the-fact"],
  "777.04": ["fl-criminal-attempt", "fl-conspiracy", "fl-criminal-solicitation",
    "fl-attempted-murder", "fl-attempted-robbery", "fl-attempted-sexual-assault"],
  "895.03": ["fl-rico-organized-crime"],
  "896.101": ["fl-money-laundering"],
  "775.087": ["fl-firearm-in-felony-enhancement"],
  "775.084": ["fl-recidivist-enhancement"],
  "775.085": ["fl-hate-crime-enhancement"],
  "874.04": ["fl-gang-enhancement"],
  "790.22": ["fl-juvenile-firearm-possession"],
};

const writeJson = (name: string, value: unknown) =>
  fs.writeFileSync(path.join(OUTPUT, name), `${JSON.stringify(value, null, 2)}\n`);
const sectionsIn = (value: string) =>
  [...new Set([...value.matchAll(/\b(\d{2,4}\.\d{2,6})\b/g)].map(match => match[1]))]
    .filter(floridaSectionPattern.test.bind(floridaSectionPattern));

function loadCache(): FloridaBatchCache {
  if (!fs.existsSync(CACHE_PATH)) return { schemaVersion: 1, jurisdiction: "FL", documents: {}, failures: {} };
  const parsed = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as FloridaBatchCache;
  if (parsed.schemaVersion !== 1 || parsed.jurisdiction !== "FL") throw new Error("Invalid Florida batch cache identity");
  for (const [section, document] of Object.entries(parsed.documents)) {
    if (section !== document.section || !validateFloridaDocument(document)) delete parsed.documents[section];
  }
  return parsed;
}

function seedManifest(cache: FloridaBatchCache, manifest: any) {
  let seeded = 0;
  for (const record of manifest.catalogRecords) for (const provision of record.provisions ?? []) {
    const candidate: FloridaBatchDocument = {
      section: provision.section, title: provision.officialTitle, text: provision.content,
      contentHash: provision.contentHash, sourceUrl: provision.sourceUrl,
      acquiredFrom: provision.sourceUrl, retrievedAt: provision.retrievedAt,
      effectiveDateStart: provision.effectiveDateStart,
      edition: provision.metadata?.currentnessEvidence?.statuteEdition ?? "Florida Statutes 2024",
      currentnessProvenance: "Edition and original acquisition timestamp imported from existing FL manifest",
      acquisitionKind: "existing_manifest_seed",
    };
    if (!validateFloridaDocument(candidate) || floridaHash(candidate.text) !== provision.contentHash) continue;
    const previous = cache.documents[candidate.section];
    if (!previous || Date.parse(candidate.retrievedAt) > Date.parse(previous.retrievedAt)) {
      cache.documents[candidate.section] = candidate;
      seeded++;
    }
  }
  return seeded;
}

function fresh(document: FloridaBatchDocument | undefined, now: Date, currentOfficialEdition: string | null) {
  if (!document || !validateFloridaDocument(document)) return false;
  const age = now.getTime() - Date.parse(document.retrievedAt);
  return currentOfficialEdition !== null && document.edition === currentOfficialEdition &&
    Number.isFinite(age) && age >= 0 && age < FLORIDA_SOURCE_MAX_AGE_MS;
}

export async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const startedAt = new Date();
  const args = new Set(process.argv.slice(2));
  const acquireEnabled = args.has("--acquire");
  const maxRequests = Math.min(100, Number([...args].find(arg => arg.startsWith("--max-requests="))?.split("=")[1] ?? 100));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const cache = loadCache();
  const seededFromManifest = seedManifest(cache, manifest);
  const observedEditionYears = Object.values(cache.documents)
    .filter(document => document.acquisitionKind === "official_whole_chapter")
    .map(document => Number(document.edition.match(/\d{4}$/)?.[0])).filter(Number.isFinite);
  let currentOfficialEdition = observedEditionYears.length
    ? `Florida Statutes ${Math.max(...observedEditionYears)}` : null;
  const chapterCache = fs.existsSync(CHAPTER_CACHE_PATH)
    ? JSON.parse(fs.readFileSync(CHAPTER_CACHE_PATH, "utf8")) : { schemaVersion: 1, jurisdiction: "FL", chapters: {} };
  const acquisitionLedger = fs.existsSync(ACQUISITION_LEDGER_PATH)
    ? JSON.parse(fs.readFileSync(ACQUISITION_LEDGER_PATH, "utf8")) : null;
  const labelsBySection: Record<string, { chargeId: string; label: string; disposition: string }[]> = {};
  const primary = new Set<string>();
  for (const record of manifest.catalogRecords) {
    if (PLACEHOLDER_LEGACY_IDS.has(record.chargeId) || KNOWN_NON_FL_MISCITATION_IDS.has(record.chargeId)) continue;
    const citation = CHARGE_CITATIONS[record.chargeId]?.citation ?? "";
    const sections = sectionsIn(`${record.catalogCode ?? ""} ${citation}`);
    for (const section of sections) {
      primary.add(section);
      (labelsBySection[section] ??= []).push({
        chargeId: record.chargeId, label: record.catalogLabel, disposition: record.disposition,
      });
    }
  }
  for (const section of REPLACEMENT_PRIMARY_LEADS) {
    primary.add(section);
    for (const chargeId of REPLACEMENT_LEGACY_IDS[section] ?? []) {
      const record = manifest.catalogRecords.find((candidate: any) => candidate.chargeId === chargeId);
      if (record) (labelsBySection[section] ??= []).push({
        chargeId, label: record.catalogLabel, disposition: record.disposition,
      });
    }
  }
  const acquirer = createFloridaChapterAcquirer(fetch, 800, (chapter, receipt) => {
    chapterCache.chapters[chapter] = receipt;
    fs.writeFileSync(CHAPTER_CACHE_PATH, `${JSON.stringify(chapterCache, null, 2)}\n`);
  });
  let logicalRequests = 0;
  const statuses: Record<string, string> = {};
  const acquireSection = async (section: string) => {
    if (fresh(cache.documents[section], startedAt, currentOfficialEdition)) {
      statuses[section] = "reused_fresh_evidence";
      return cache.documents[section];
    }
    if (!acquireEnabled || acquirer.getHttpRequests() >= maxRequests) {
      statuses[section] = acquireEnabled ? "request_budget_deferred" :
        cache.failures[section] ? "recorded_acquisition_failure" : "acquisition_required";
      return undefined;
    }
    try {
      const result = await acquirer(section);
      logicalRequests += result.requests;
      for (const sibling of result.documents) {
        cache.documents[sibling.section] = sibling;
        delete cache.failures[sibling.section];
      }
      const edition = result.documents[0]?.edition;
      if (edition && (!currentOfficialEdition ||
          Number(edition.match(/\d{4}$/)?.[0]) > Number(currentOfficialEdition.match(/\d{4}$/)?.[0]))) {
        currentOfficialEdition = edition;
      }
      const exact = cache.documents[section];
      if (!exact) throw new Error(`Official chapter did not contain exact requested section ${section}`);
      statuses[section] = "acquired_evidence";
      fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
      return exact;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      cache.failures[section] = { section, checkedAt: new Date().toISOString(), message, attemptedUrl: floridaSectionUrl(section) };
      delete cache.documents[section]; // failed refresh never falls back to stale evidence
      statuses[section] = "acquisition_failure";
      fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
      return undefined;
    }
  };

  for (const section of [...primary].sort()) await acquireSection(section);
  const supportingLeads = [...new Set([...primary].flatMap(section =>
    cache.documents[section] ? floridaDirectReferences(cache.documents[section]) : [],
  ))].filter(section => !primary.has(section));
  const supporting = [...COMMON_PENALTIES, ...supportingLeads]
    .filter((section, index, all) => all.indexOf(section) === index && !primary.has(section))
    .slice(0, MAX_SUPPORTING_SECTIONS);
  for (const section of supporting) await acquireSection(section);
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);

  const currentOfficialEditionObserved = currentOfficialEdition;
  const requested = new Set([...primary, ...supporting]);
  const siblings = Object.values(cache.documents)
    .filter(document => !requested.has(document.section))
    .map(document => ({
      section: document.section, title: document.title, sourceHash: document.contentHash,
      acquiredFrom: document.acquiredFrom,
      sourceBearingSignals: document.text.split("\n")
        .filter(line => /\b(?:commits?|guilty|felony|misdemeanor|unlawful|prohibited)\b/i.test(line)).slice(0, 4),
      accounting: "official sibling candidate only; not an offense-name or statutory-completeness determination",
    })).sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }));
  const primaryReview = [...primary].sort().map(section => {
    const document = cache.documents[section];
    const usable = fresh(document, startedAt, currentOfficialEdition) ? document : undefined;
    return {
      section, sourceKey: `fl:statute:${section}`, role: "primary",
      status: statuses[section] ?? (usable ? "reused_fresh_evidence" :
        document ? "edition_not_current_official_book" : "unavailable"),
      runtimeCandidateScope: REPLACEMENT_PRIMARY_LEADS.includes(section)
        ? (RUNTIME_OFFENSE_LEADS.has(section) ? "potential_adult_offense_candidate" :
          "supporting_enhancement_principals_or_juvenile_only_not_adult_offense")
        : "legacy_primary_research_scope",
      legacyResearchLeads: labelsBySection[section] ?? [],
      evidence: usable ? {
        sourceKey: `fl:statute:${usable.section}`, title: usable.title,
        exactSectionText: usable.text,
        body: usable.text.split(/\n—\n/, 2)[1] ?? usable.text,
        sourceHash: usable.contentHash,
        sourceUrl: usable.sourceUrl, acquiredFrom: usable.acquiredFrom,
        retrievedAt: usable.retrievedAt, edition: usable.edition,
        currentnessProvenance: usable.currentnessProvenance,
        exactSectionIdentityVerified: true,
      } : null,
      directReferenceLeads: usable ? floridaDirectReferences(usable)
        .map(reference => `fl:statute:${reference}`) : [],
      boundary: "legacy labels are research leads; collection is not publication approval",
    };
  });
  const failures = Object.values(cache.failures).filter(failure => requested.has(failure.section));
  const coveredPrimary = primaryReview.filter(item => item.evidence).length;
  writeJson("florida-batch-review.json", {
    schemaVersion: 1, jurisdiction: "FL", publicationStatus: "collection_only_not_runtime_approval",
    currentOfficialEditionObserved,
    primarySections: primaryReview,
    supportingSections: supporting.map(section => ({
      section, sourceKey: `fl:statute:${section}`, status: statuses[section],
      evidence: fresh(cache.documents[section], startedAt, currentOfficialEdition)
        ? cache.documents[section] : null,
      role: COMMON_PENALTIES.includes(section) ? "common_chapter_775_penalty" : "direct_definition_or_penalty_lead",
    })),
    siblingCandidates: siblings,
  });
  writeJson("florida-batch-run-receipt.json", {
    schemaVersion: 1, startedAt: startedAt.toISOString(), finishedAt: new Date().toISOString(),
    options: { acquire: acquireEnabled, maxRequests, concurrencyMaximum: 1, pacingMs: 800, freshnessDays: 7 },
    requests: { successfulNewChapterRequests: logicalRequests, actualHttpRequests: acquirer.getHttpRequests() },
    cumulativeAcquisition: acquisitionLedger ? {
      ledgerPath: path.relative(process.cwd(), ACQUISITION_LEDGER_PATH),
      totalCollectorHttpRequests: acquisitionLedger.totalCollectorHttpRequests,
      runs: acquisitionLedger.runs.length,
    } : null,
    seeding: { seededFromExistingManifest: seededFromManifest, timestampsPreserved: true },
    currentness: {
      currentOfficialEditionObserved,
      basis: currentOfficialEdition
        ? "Selected edition label read from live official Online Sunshine whole-chapter responses"
        : "unavailable; manifest seeds are not treated as current",
      olderManifestSeedsRetainedAsHistoricalAcquisitionEvidence: true,
    },
    coverage: {
      legacyRows: manifest.catalogRecords.length, uniquePrimarySections: primary.size,
      primaryWithEvidence: coveredPrimary, primaryBlocked: primary.size - coveredPrimary,
      supportingRequested: supporting.length, siblingSectionsEnumerated: siblings.length,
      statewideCompletenessClaim: false,
    },
    failures, staleFallbackPermitted: false,
  });
  const lines = [
    "# Florida official-source batch evidence",
    "",
    `- Legacy rows inventoried: ${manifest.catalogRecords.length}`,
    `- Unique requested primary sections: ${primary.size}; evidence available: ${coveredPrimary}; blocked: ${primary.size - coveredPrimary}.`,
    `- Supporting definition/penalty sections requested: ${supporting.length} (capped at ${MAX_SUPPORTING_SECTIONS}); sibling sections inventoried: ${siblings.length}.`,
    `- HTTP requests: ${acquirer.getHttpRequests()} of ${maxRequests}; fresh reuse window: seven days.`,
    `- Failed refreshes: ${failures.length}. A failed refresh deletes stale evidence and is never silently replaced by it.`,
    "",
    "Exact section titles/bodies, hashes, edition labels, source URLs, acquisition URLs and original timestamps are in florida-batch-review.json.",
    "Sibling candidates are source-bearing inventory only. This batch makes no statutory-completeness, offense-identity, legal-approval, localization, manifest, or runtime-publication claim.",
  ];
  fs.writeFileSync(path.join(OUTPUT, "florida-batch-summary.md"), `${lines.join("\n")}\n`);
  console.log(JSON.stringify({ primary: primary.size, coveredPrimary, supporting: supporting.length,
    siblings: siblings.length, httpRequests: acquirer.getHttpRequests(), failures: failures.length }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}