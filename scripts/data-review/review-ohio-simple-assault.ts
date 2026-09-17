/**
 * Review evidence only. A successful acquisition or report run cannot publish
 * the section, resolve an incorporated repealed definition, or renew approval.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const ASSAULT_ACQUISITION_PATH = "scripts/data-review/output/ohio-simple-assault-evidence.json";
export const ASSAULT_REVIEW_PATH = "scripts/data-review/output/ohio-simple-assault-publication-review.json";
const REVIEWED_ASSAULT_HASH = "040456959beff0885577c0a63334b9480a886ebc5bd37f47360647377ad486b1";
interface Document {
  section: string; title: string; sourceUrl: string; text: string;
  contentHash: string; effectiveDateStart: string; retrievedAt: string;
}
interface Acquisition {
  publicationStatus: string; requestedSections: string[];
  documents: Document[];
  failures: Array<{ section: string; sourceUrl: string; error: string }>;
}
const groups = [
  ["(A)", "Knowing physical harm or attempted physical harm", "(A) No person"],
  ["(B)", "Reckless serious physical harm", "(B) No person"],
  ["(C)(1)", "First-degree misdemeanor baseline, subject to exceptions", "(C)(1) Whoever"],
  ["(C)(2)", "Caretaker: F4; qualifying prior caretaker conviction: F3", "(2) Except as otherwise"],
  ["(C)(3)", "Specified state/DYS institutional custody and employee conditions: F3", "(3) If the offense occurs"],
  ["(C)(4)", "Specified local custody, supervised-offender and school circumstances: F5", "(4) If the offense is committed"],
  ["(C)(5)", "Specified on-duty personnel or purposeful emergency-responder targeting: F4", "(5) If the assault is committed"],
  ["(C)(6)", "C5a peace officer/BCI investigator plus serious harm: mandatory F4 term at least twelve months", "(6) If the offense is a felony"],
  ["(C)(7)", "Child-services duties: F5; qualifying prior offense of violence: F4", "(7) If the victim"],
  ["(C)(8)", "Hospital personnel: knowledge, duties and hospital training conditions; M1/$5,000 ceiling or qualifying-prior F5", "(8) If the victim"],
  ["(C)(9)", "Justice personnel: knowledge and duties conditions; M1/$5,000 ceiling or qualifying-prior F5", "(9) If the victim"],
  ["(C)(10)", "Known-pregnancy specification: separate misdemeanor/felony rules; C6 override", "(10) If an offender"],
  ["(D)", "Other prosecutions allowed; same-conduct/same-victim menacing allied-offense rule", "(D) A prosecution"],
  ["(E)", "All local definitions, including exclusions and adopted cross-references", "(E) As used"],
] as const;

export function buildSimpleAssaultReview(acquisition: Acquisition) {
  if (acquisition.publicationStatus !== "acquisition_only_requires_review") {
    throw new Error("Expected acquisition-only evidence");
  }
  const seen = new Set<string>();
  for (const document of acquisition.documents) {
    if (seen.has(document.section) ||
        document.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${document.section}` ||
        createHash("sha256").update(document.text).digest("hex") !== document.contentHash ||
        !document.text.startsWith(`Section ${document.section} |\n${document.title}.\nEffective: ${document.effectiveDateStart}\n`)) {
      throw new Error(`Invalid acquisition evidence: ${document.section}`);
    }
    seen.add(document.section);
  }
  const source = acquisition.documents.find(row => row.section === "2903.13");
  if (!source || source.contentHash !== REVIEWED_ASSAULT_HASH) {
    throw new Error("Assault text requires renewed independent review");
  }
  const starts = groups.map(([, , prefix]) => {
    const start = source.text.indexOf(`\n${prefix}`);
    if (start < 0) throw new Error(`Missing assault evidence: ${prefix}`);
    return start + 1;
  });
  const lastUpdated = source.text.indexOf("\nLast updated", starts.at(-1));
  const rows = groups.map(([subdivision, reviewLabel], index) => {
    const start = starts[index];
    const end = index + 1 < starts.length ? starts[index + 1] - 1
      : lastUpdated < 0 ? source.text.length : lastUpdated;
    if (end <= start) throw new Error("Assault evidence order changed");
    return {
      subdivision, reviewLabel,
      evidence: { quote: source.text.slice(start, end), start, end, sourceHash: source.contentHash },
    };
  });
  return {
    reportKind: "evidence_review_not_runtime_approval",
    section: source.section, title: source.title, sourceUrl: source.sourceUrl,
    effectiveDate: source.effectiveDateStart, sourceHash: source.contentHash,
    status: "withheld_from_source_first_publication",
    rows,
    acquisition: {
      requestedPages: acquisition.requestedSections.length,
      acquiredPages: acquisition.documents.length,
      failures: acquisition.failures,
    },
    unresolvedAuthority: [{
      section: "3727.01", adoptedBy: "2903.13(E)(20)",
      affects: "HMO meaning used in hospital definition and exclusions, including the hospital-personnel branch",
      officialUrl: "https://codes.ohio.gov/ohio-revised-code/section-3727.01",
      secondaryHistoricalLead: "https://law.justia.com/codes/ohio/2023/title-37/chapter-3727/section-3727-01/",
      secondaryStatus: "historical_secondary_requires_review_not_current_authority",
      question: "The secondary 2023 heading labels repeal effective 2024-09-30 by HB110. Establish official repeal/transition evidence and the legally applicable incorporated definition; do not substitute a present-day hospital or HMO definition by analogy.",
    }],
    remainingChecks: [
      "Close all adopted definitions and their material exclusions; acquiring direct pages is not proof of transitive closure.",
      "Preserve both knowing harm/attempt and reckless serious-harm conduct; do not import the weapon element from other assault sections.",
      "Retain hospital training, knowledge, duty and qualifying-prior conditions, and distinguish hospital from justice-system prior-offense definitions.",
      "Attach misdemeanor 2929.24/2929.28 and felony 2929.14/2929.18 penalties, 2929.13(F), 2941.1423, pregnancy exceptions and 2941.25 as required runtime evidence.",
      "Misdemeanor pregnancy specification: at least thirty days under 2929.24(F); felony specification: six months OR the applicable-degree term, subject to C6. Neither is an automatic added six months.",
      "Review school credential-range and other adopted legal-status boundaries without claiming credential or court-appointment certification.",
      "Complete EN/ES/ZH explanations and independent review before adding any new canonical runtime record; do not silently remap saved simple-assault cases.",
    ],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = buildSimpleAssaultReview(JSON.parse(readFileSync(ASSAULT_ACQUISITION_PATH, "utf8")));
  writeFileSync(ASSAULT_REVIEW_PATH, JSON.stringify(report, null, 2) + "\n");
  console.log({ status: report.status, ...report.acquisition, reviewGroups: report.rows.length });
}