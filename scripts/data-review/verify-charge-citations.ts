/**
 * Criminal Charge Citation Verifier
 *
 * Verifies that every statuteCitations entry in criminal-charges.ts resolves to
 * a real, current, non-repealed statute via the OpenLaws API.
 *
 * Modes:
 *   default                — check all charges that have citations populated
 *   --all                  — also report charges with no citations
 *   --state XX             — limit to a single state code (e.g., --state CA)
 *   --category             — limit to charge names matching a substring (e.g., --category assault)
 *   --batch N              — limit to one of 10 priority batches (1=homicide through 10=catch-all)
 *   --exclude-territories  — skip AS/GU/MP/PR/VI entries (default: true)
 *   --include-territories  — override the default exclusion and include territory entries
 *   --dry-run              — parse and categorise only; do not call OpenLaws API
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-charge-citations.ts
 *   npx tsx scripts/data-review/verify-charge-citations.ts --batch 1 --dry-run
 *   npx tsx scripts/data-review/verify-charge-citations.ts --batch 1
 *   npx tsx scripts/data-review/verify-charge-citations.ts --state CA --dry-run
 *
 * Outputs:
 *   scripts/data-review/output/charge-citations-report.json          (default / --state / --category)
 *   scripts/data-review/output/charge-citations-batch-N-report.json  (--batch N)
 *
 * Quarterly integration:
 *   Run automatically by .github/workflows/quarterly-data-review.yml
 *   Results are included in the quarterly GitHub Issue by generate-report.ts
 *
 * After a Phase 3 research pass:
 *   1. Update the affected charge entries in shared/criminal-charges.ts with
 *      real statuteCitations[] and dataConfidence: 'low' | 'medium'
 *   2. Run this script — it will call OpenLaws to confirm each citation
 *   3. Entries where OpenLaws returns a non-repealed statute are promoted to 'high'
 *      and the statute text is cached in the database by the API server at runtime
 *   4. Entries that fail OpenLaws lookup remain at their current confidence level
 *      and appear in the report for manual review
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges, getChargeConfidence, isCitationVerified } from '../../shared/criminal-charges';
import type { CriminalCharge } from '../../shared/criminal-charges';
import { CHARGE_CITATIONS } from '../../shared/criminal-charge-citations';

// ── CLI argument parsing ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
const INCLUDE_PENDING = args.includes('--all');
const DRY_RUN = args.includes('--dry-run');
const INCLUDE_TERRITORIES = args.includes('--include-territories');
const EXCLUDE_TERRITORIES = !INCLUDE_TERRITORIES; // default: exclude territories

const stateArg = args.indexOf('--state');
const STATE_FILTER: string | null = stateArg !== -1 ? (args[stateArg + 1] ?? '').toUpperCase() : null;

const categoryArg = args.indexOf('--category');
const CATEGORY_FILTER: string | null = categoryArg !== -1 ? (args[categoryArg + 1] ?? '').toLowerCase() : null;

const batchArg = args.indexOf('--batch');
const BATCH_FILTER: number | null = batchArg !== -1 ? parseInt(args[batchArg + 1] ?? '0', 10) : null;
if (BATCH_FILTER !== null && (isNaN(BATCH_FILTER) || BATCH_FILTER < 1 || BATCH_FILTER > 10)) {
  console.error('--batch must be a number 1–10');
  process.exit(1);
}

const OPENLAWS_API_URL = process.env.OPENLAWS_API_URL ?? 'https://api.openlaws.us/api/v1';
const OPENLAWS_API_KEY = process.env.OPENLAWS_API_KEY ?? '';

// ── Output types ─────────────────────────────────────────────────────────────

type VerificationStatus =
  | 'verified'       // OpenLaws confirmed: statute exists, not repealed
  | 'repealed'       // OpenLaws returned is_repealed: true
  | 'not_found'      // OpenLaws returned 404 or traversal found nothing
  | 'api_error'      // OpenLaws API call failed (network, auth, etc.)
  | 'no_citation'    // No statuteCitations[] populated yet (pending Phase 3)
  | 'skipped'        // Dry-run mode — not called
  | 'already_high';  // dataConfidence already 'high' — re-verified this run

interface ChargeVerificationResult {
  name: string;              // For generate-report.ts DiffFile compatibility
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  citation: string | null;
  currentConfidence: string;
  status: VerificationStatus;
  effectiveDate?: string;
  isRepealed?: boolean;
  needsManualReview: boolean;
  reason?: string;
  checkedAt: string;
  /** 'training_data' when the source field contains "Training data —"; helps distinguish
   *  Phase 3 machine-generated citations from previously human-verified ones. */
  sourceType?: 'training_data' | 'other';
}

interface ReportOutput {
  runAt: string;
  totalChecked: number;
  okCount: number;
  needsReviewCount: number;
  pendingCount: number;      // No citations yet — awaiting Phase 3
  verifiedHighCount: number; // Currently at 'high' confidence
  results: ChargeVerificationResult[];
}

// ── OpenLaws citation lookup ──────────────────────────────────────────────────
//
// The OpenLaws API does NOT have a /citations/lookup endpoint.
// It exposes a hierarchical division tree:
//   GET /jurisdictions/{jx}/laws/{law}/divisions          → root chapters
//   GET /jurisdictions/{jx}/laws/{law}/divisions/{path}   → section content
//
// We parse the citation to extract jurisdiction + section, then do a bounded
// breadth-first search (max depth 4, max 20 API calls per citation) through
// the division tree to find a matching section. This matches the approach used
// in server/services/openlaws-client.ts.

/** Maps 2-letter state codes to their OpenLaws statute law keys */
const STATE_LAW_KEYS: Record<string, string> = {
  AL: 'AL-STAT', AK: 'AK-STAT', AZ: 'AZ-STAT', AR: 'AR-STAT',
  CA: 'CA-STAT', CO: 'CO-STAT', CT: 'CT-STAT', DE: 'DE-STAT',
  FL: 'FL-STAT', GA: 'GA-STAT', HI: 'HI-STAT', ID: 'ID-STAT',
  IL: 'IL-STAT', IN: 'IN-STAT', IA: 'IA-STAT', KS: 'KS-STAT',
  KY: 'KY-STAT', LA: 'LA-STAT', ME: 'ME-STAT', MD: 'MD-STAT',
  MA: 'MA-STAT', MI: 'MI-STAT', MN: 'MN-STAT', MS: 'MS-STAT',
  MO: 'MO-STAT', MT: 'MT-STAT', NE: 'NE-STAT', NV: 'NV-STAT',
  NH: 'NH-STAT', NJ: 'NJ-STAT', NM: 'NM-STAT', NY: 'NY-STAT',
  NC: 'NC-STAT', ND: 'ND-STAT', OH: 'OH-STAT', OK: 'OK-STAT',
  OR: 'OR-STAT', PA: 'PA-STAT', RI: 'RI-STAT', SC: 'SC-STAT',
  SD: 'SD-STAT', TN: 'TN-STAT', TX: 'TX-STAT', UT: 'UT-STAT',
  VT: 'VT-STAT', VA: 'VA-STAT', WA: 'WA-STAT', WV: 'WV-STAT',
  WI: 'WI-STAT', WY: 'WY-STAT', DC: 'DC-STAT', PR: 'PR-STAT',
  FED: 'FED-USC',
};

const STATE_ABBREV: Record<string, string> = {
  'Ala.': 'AL', 'Alaska': 'AK', 'Ariz.': 'AZ', 'Ark.': 'AR',
  'Cal.': 'CA', 'Colo.': 'CO', 'Conn.': 'CT', 'Del.': 'DE',
  'Fla.': 'FL', 'Ga.': 'GA', 'Haw.': 'HI', 'Idaho': 'ID',
  'Ill.': 'IL', 'Ind.': 'IN', 'Iowa': 'IA', 'Kan.': 'KS',
  'Ky.': 'KY', 'La.': 'LA', 'Me.': 'ME', 'Md.': 'MD',
  'Mass.': 'MA', 'Mich.': 'MI', 'Minn.': 'MN', 'Miss.': 'MS',
  'Mo.': 'MO', 'Mont.': 'MT', 'Neb.': 'NE', 'Nev.': 'NV',
  'N.H.': 'NH', 'N.J.': 'NJ', 'N.M.': 'NM', 'N.Y.': 'NY',
  'N.C.': 'NC', 'N.D.': 'ND', 'Ohio': 'OH', 'Okla.': 'OK',
  'Or.': 'OR', 'Pa.': 'PA', 'R.I.': 'RI', 'S.C.': 'SC',
  'S.D.': 'SD', 'Tenn.': 'TN', 'Tex.': 'TX', 'Utah': 'UT',
  'Vt.': 'VT', 'Va.': 'VA', 'Wash.': 'WA', 'W.Va.': 'WV',
  'Wis.': 'WI', 'Wyo.': 'WY', 'D.C.': 'DC',
};

// ── Territory exclusion ───────────────────────────────────────────────────────

const TERRITORY_PREFIXES = ['as-', 'gu-', 'mp-', 'pr-', 'vi-'];

function isTerritoryCharge(chargeId: string): boolean {
  return TERRITORY_PREFIXES.some(prefix => chargeId.startsWith(prefix));
}

// ── Batch definitions ─────────────────────────────────────────────────────────
//
// 10 priority-ordered batches for Phase 4 OpenLaws verification.
// Batches are checked in order (1 first). First match wins; batch 10 is catch-all.
// Territory entries (as-, gu-, mp-, pr-, vi-) are always excluded unless
// --include-territories is passed.

/** Strip the state prefix (2-letter code or 'fed') from a charge ID. */
function getChargeSlug(chargeId: string): string {
  const m = chargeId.match(/^(?:[a-z]{2}|fed)-(.+)$/);
  return m ? m[1] : chargeId;
}

/** Returns the batch number (1–10) for a given charge ID. */
function getChargeBatch(chargeId: string): number {
  const slug = getChargeSlug(chargeId);

  // Batch 1: Homicide (highest stakes)
  if (/murder|manslaughter|criminally.negligent.homicide|vehicular.homicide|negligent.homicide/.test(slug)) return 1;

  // Batch 3: Sexual offenses — checked before batch 2 to avoid "sexual-assault" → batch 2
  if (/^sexual-|^rape-|^statutory-rape|^child-rape|^stalking|^cyberstalking|child-sexual|^lewd-|^indecent-/.test(slug)) return 3;

  // Batch 2: Assault / battery / domestic violence
  if (/\bassault\b|assault-in-the|\bbattery\b|domestic-violence|domestic-battery|domestic-assault|spousal-battery/.test(slug)) return 2;

  // Batch 4: Drug offenses and DUI
  if (/^dui\b|^dwi\b|^oui\b|^owi\b|-dui$|-dwi$|drug-possession|simple-possession|possession-with-intent|drug-trafficking|drug-distribution|distribution-of-controlled|manufacturing-controlled|open-container|driving-under-the-influence/.test(slug)) return 4;

  // Batch 5: Major violent property crimes
  if (/^robbery|^burglary|^arson|^kidnapping|^false-imprisonment|^carjacking/.test(slug)) return 5;

  // Batch 6: Fraud and financial crimes
  if (/grand-theft|grand-larceny|embezzlement|identity-theft|forgery|credit-card-fraud|wire-fraud|money-laundering|computer-fraud|bribery|extortion|blackmail|receiving-stolen-property|insurance-fraud|bank-fraud|mail-fraud|securities-fraud|welfare-fraud|healthcare-fraud|mortgage-fraud|tax-evasion|counterfeiting|bad-check/.test(slug)) return 6;

  // Batch 7: Minor property crimes and public order
  if (/shoplifting|retail-theft|petit-theft|petty-theft|petty-larceny|vandalism|criminal-mischief|malicious-mischief|trespassing|criminal-trespass|trespass-after|^loitering|disorderly-conduct|disturbing-the-peace|public-intoxication|drunk-in-public|breach-of-peace/.test(slug)) return 7;

  // Batch 8: Weapons offenses and organized crime
  if (/firearm|weapons-offense|concealed-carry|felon-in-possession|possession-by-felon|possession-by-a-felon|rico\b|organized-crime|racketeering|^gang-/.test(slug)) return 8;

  // Batch 9: Traffic and public order offenses
  if (/driving-while-suspended|suspended-license|driving-without-a-license|reckless-driving|reckless-operation|resisting-arrest|obstruction-of-justice|failure-to-appear|fare-evasion|hit-and-run|leaving-the-scene|jaywalking/.test(slug)) return 9;

  // Batch 10: Catch-all (juvenile, inchoate, enhancements, state-specific variants)
  return 10;
}

// ── Multi-section citation pre-processing ─────────────────────────────────────
//
// Phase 3 added attempt charges with two citations: "Ala. Code §§ 13A-4-2, 13A-6-2"
// The citation parser expects a single section. Extract the first section only.

function extractFirstCitation(citation: string): string {
  // "§§ A, B" → "§ A" — replace plural section marker and drop everything after first comma
  const multiMatch = citation.match(/^(.+?§§\s*)([\w.\-:]+)(,.*)?$/);
  if (multiMatch) {
    return `${multiMatch[1].replace('§§', '§')}${multiMatch[2]}`.trim();
  }
  return citation;
}

interface ParsedCitation {
  jurisdiction: string;
  lawKey: string;
  section: string;
  codeHint?: string;
}

/**
 * Returns a human-readable skip reason if the citation is known to be
 * unverifiable by the OpenLaws API — not because it's wrong, but because
 * it was always a placeholder or a doctrine reference, not a state statute.
 *
 * Detects:
 *   - "MPC § X" — Model Penal Code doctrine references
 *   - "State X statute" generic placeholders (hate crime, gang enhancement, etc.)
 *   - Case law citations (In re Gault, Kent v. United States, etc.)
 *
 * Returns null if the citation may be a verifiable statute.
 */
function unverifiableReason(citation: string): string | null {
  const s = citation.trim();

  // Model Penal Code references
  if (/^MPC\s*§/i.test(s)) {
    return 'Model Penal Code reference — not a state statute. Replace with the jurisdiction-specific attempt/conspiracy/complicity statute.';
  }

  // Generic "State X statute / State X act" placeholders
  // Allow hyphens, slashes, and spaces in the middle phrase
  // e.g. "State firearm-in-felony enhancement statute", "State drug-free school zone statute"
  if (/^State\s+[\w][\w\s/,-]*(?:statute|act|code|law|provision)/i.test(s)) {
    return 'Generic placeholder citation — replace with the specific state statute number for this jurisdiction.';
  }

  // Case law citations (e.g., "In re Gault, 387 U.S. 1", "Kent v. United States")
  if (/\bIn re\b.+\d+\s+U\.?S\.?\s+\d+/i.test(s)) {
    return 'Case law citation — not a statute. Replace with the applicable state or federal statute number.';
  }
  if (/\b\w+\s+v\.\s+\w[\w\s]*,\s*\d+\s+U\.?S\.?\s+\d+/i.test(s)) {
    return 'Case law citation — not a statute. Replace with the applicable state or federal statute number.';
  }

  return null;
}

/** Parse a formatted citation string into its OpenLaws lookup components. */
function parseCitationForVerifier(citation: string): ParsedCitation | null {
  const s = citation.trim();

  // Federal: "18 U.S.C. § 1111"
  const fedM = s.match(/(\d+)\s*U\.?S\.?C\.?A?\.?\s*§?\s*([\w.-]+)/i);
  if (fedM) return { jurisdiction: 'FED', lawKey: 'FED-USC', section: fedM[2], codeHint: `title_${fedM[1]}` };

  // NJ: "N.J. Stat. § 2C:11-3"
  const njM = s.match(/N\.?J\.?\s*(?:S\.?A\.?|Stat\.?\s*(?:Ann\.?)?)\s*§?\s*([\w:.-]+)/i);
  if (njM) return { jurisdiction: 'NJ', lawKey: 'NJ-STAT', section: njM[1] };

  // Georgia: "O.C.G.A. § 16-5-1"
  const gaM = s.match(/O\.C\.G\.A\.?\s*§?\s*([\d.:a-zA-Z/-]+(?:\([a-z0-9]+\))?)/i);
  if (gaM) return { jurisdiction: 'GA', lawKey: 'GA-STAT', section: gaM[1] };

  // West Virginia: "W. Va. Code § 61-2-1"
  const wvM = s.match(/W\.?\s*Va\.?\s*Code\s*(?:Ann\.?)?\s*§?\s*([\d.:a-zA-Z/-]+(?:\([a-z0-9]+\))?)/i);
  if (wvM) return { jurisdiction: 'WV', lawKey: 'WV-STAT', section: wvM[1] };

  // Pennsylvania: "18 Pa.C.S. § 2502(a)" — title number before Pa.C.S. becomes codeHint
  const paM = s.match(/(\d+)\s*Pa\.C\.S\.?\s*(?:Ann\.?)?\s*§?\s*([\d.:a-zA-Z/-]+(?:\([a-z0-9]+\))?)/i);
  if (paM) return { jurisdiction: 'PA', lawKey: 'PA-STAT', section: paM[2], codeHint: `title_${paM[1]}` };

  // Illinois ILCS: "720 ILCS 5/9-1"
  const ilM = s.match(/\d+\s*ILCS\s*([\w/.-]+)/i);
  if (ilM) return { jurisdiction: 'IL', lawKey: 'IL-STAT', section: ilM[1] };

  // DC: "D.C. Code § 22-2101"
  const dcM = s.match(/D\.?C\.?\s*(?:Code|Law)?\s*§?\s*([\w.-]+)/i);
  if (dcM) return { jurisdiction: 'DC', lawKey: 'DC-STAT', section: dcM[1] };

  // Standard state: "Ala. Code § 13A-6-2", "Cal. Penal Code § 187", etc.
  const stM = s.match(/^([A-Za-z.]+)\s+(?:(Penal|Criminal|Vehicle|Health|Family|Rev(?:ised)?|Ann(?:otated)?|Transp(?:ortation)?)\s*)?(?:Code|Stat(?:utes)?|Laws?|Ann\.?)?\s*§?\s*([\d.:a-zA-Z/-]+(?:\([a-z0-9]+\))?)/i);
  if (stM) {
    const abbrev = stM[1].trim();
    const stateCode = STATE_ABBREV[abbrev] ?? STATE_ABBREV[abbrev.replace(/\.$/, '') + '.'];
    if (stateCode && STATE_LAW_KEYS[stateCode]) {
      return { jurisdiction: stateCode, lawKey: STATE_LAW_KEYS[stateCode], section: stM[3], codeHint: stM[2]?.toLowerCase() };
    }
  }

  return null;
}

/** Returns true if a division path or display name refers to the given section. */
function divisionMatchesSection(pathOrName: string, section: string): boolean {
  const lower = pathOrName.toLowerCase();
  const base = section.split('(')[0].trim();
  const norm = base.replace(/[.:]/g, '_').replace(/-/g, '_');
  if (new RegExp(`section_${norm}(?:[^0-9a-z]|$)`, 'i').test(lower)) return true;
  if (new RegExp(`section\\s+${base}(?:[^0-9]|$)`, 'i').test(lower)) return true;
  if (new RegExp(`§\\s*${base}(?:[^0-9]|$)`, 'i').test(lower)) return true;
  if (base.includes('-') || base.includes(':')) {
    const flex = base.replace(/[:-]/g, '[_:-]').replace(/\./g, '[._]?');
    if (new RegExp(`(?:section_?)?${flex}(?:[^0-9a-z]|$)`, 'i').test(lower)) return true;
  }
  return false;
}

type DivisionResponse = {
  display_children?: Array<{ display_name: string; path: string }>;
  is_repealed?: boolean;
  effective_date_end?: string;
  effective_date_start?: string;
  plaintext_content?: string;
  markdown_content?: string;
};

/** Fetch a single OpenLaws division endpoint; returns null on 404. */
async function fetchDivision(jurisdiction: string, lawKey: string, path?: string): Promise<DivisionResponse | null> {
  const base = `${OPENLAWS_API_URL}/jurisdictions/${jurisdiction}/laws/${lawKey}/divisions`;
  const url = path ? `${base}/${encodeURIComponent(path)}` : base;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${OPENLAWS_API_KEY}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (Array.isArray(data)) {
    return { display_children: data.map((d: any) => ({ display_name: d.display_name ?? d.name ?? '', path: d.path ?? '' })) };
  }
  return data as DivisionResponse;
}

interface OpenLawsCheckResult {
  found: boolean;
  isRepealed: boolean;
  effectiveDate?: string;
  error?: string;
}

/**
 * Verify a citation via the OpenLaws hierarchical division API.
 * Bounded BFS: max depth 4, max 20 API calls per citation.
 */
/**
 * Extract the hierarchical parts of a section number so we can target
 * the right title/chapter directly without BFS-ing every division.
 *
 * Examples:
 *   "13A-6-2"   → { titleId: "13a", chapterId: "6" }   Alabama-style
 *   "9A.32.030" → { chapterId: "9a" }                   Washington-style
 *   "19.03"     → { chapterId: "19" }                   Texas dot-style
 *   "22-16-4"   → { chapterId: "22" }                   three-part hyphen
 *   "9-1"       → { chapterId: "9" }                    two-part hyphen
 *   "187"       → {}                                     flat; rely on codeHint
 */
function sectionHierarchy(section: string): { titleId?: string; chapterId?: string } {
  // Alabama-style: leading letters after digits → "13A-6-2", "13A-7-2"
  const alM = section.match(/^(\d+[a-z]+)-(\d+)(?:-|$)/i);
  if (alM) return { titleId: alM[1].toLowerCase(), chapterId: alM[2] };

  // Three-part hyphen without letter: "22-16-4" → chapter "22"
  const tri = section.match(/^(\d+)-\d+-\d+/);
  if (tri) return { chapterId: tri[1] };

  // Dot-separated (TX 19.03, WA 9A.32.030, NY 125.25): first numeric segment
  const dotM = section.match(/^(\d+[a-z]?)\.(\d+)/i);
  if (dotM) return { chapterId: dotM[1].toLowerCase() };

  // Two-part hyphen: "9-1"
  const hypM = section.match(/^(\d+)-\d+/);
  if (hypM) return { chapterId: hypM[1] };

  return {};
}

/**
 * Check whether a fetched division is repealed.
 */
function checkRepealed(div: DivisionResponse): boolean {
  return (
    div.is_repealed === true ||
    (!!div.effective_date_end &&
      div.effective_date_end !== 'Infinity' &&
      new Date(div.effective_date_end) < new Date())
  );
}

/**
 * Search the children (and one level of grandchildren) of a fetched division
 * for a section match. Returns the result if found, null otherwise.
 * Grandchild search handles states with an Article layer between chapter and section.
 */
async function searchChildren(
  jurisdiction: string,
  lawKey: string,
  div: DivisionResponse,
  section: string,
  maxGrandchildFetches = 4
): Promise<OpenLawsCheckResult | null> {
  if (!div.display_children?.length) return null;

  const directMatches = div.display_children.filter(
    c => divisionMatchesSection(c.path, section) || divisionMatchesSection(c.display_name, section)
  );

  for (const child of directMatches) {
    const found_div = await fetchDivision(jurisdiction, lawKey, child.path);
    if (!found_div) continue;
    return { found: true, isRepealed: checkRepealed(found_div), effectiveDate: found_div.effective_date_start };
  }

  // One level deeper (article → section) — limit fetches to avoid runaway calls
  let fetches = 0;
  for (const child of div.display_children) {
    if (fetches >= maxGrandchildFetches) break;
    fetches++;
    const grandDiv = await fetchDivision(jurisdiction, lawKey, child.path);
    if (!grandDiv?.display_children) continue;
    for (const gc of grandDiv.display_children) {
      if (divisionMatchesSection(gc.path, section) || divisionMatchesSection(gc.display_name, section)) {
        const found_div = await fetchDivision(jurisdiction, lawKey, gc.path);
        if (!found_div) continue;
        return { found: true, isRepealed: checkRepealed(found_div), effectiveDate: found_div.effective_date_start };
      }
    }
  }

  return null;
}

async function checkCitationViaOpenLaws(
  _unusedJurisdictionKey: string,
  citation: string
): Promise<OpenLawsCheckResult> {
  if (!OPENLAWS_API_KEY) {
    return { found: false, isRepealed: false, error: 'OPENLAWS_API_KEY not set' };
  }

  // Pre-process: extract first section from multi-section citations (e.g. "§§ 13A-4-2, 13A-6-2")
  const effectiveCitation = extractFirstCitation(citation);
  const parsed = parseCitationForVerifier(effectiveCitation);
  if (!parsed) {
    return { found: false, isRepealed: false, error: `Cannot parse citation: ${citation}` };
  }

  const { jurisdiction, lawKey, section, codeHint } = parsed;
  const { titleId, chapterId } = sectionHierarchy(section);

  try {
    // Fetch root (array of all top-level titles/compilations)
    const rawResp = await fetch(
      `${OPENLAWS_API_URL}/jurisdictions/${jurisdiction}/laws/${lawKey}/divisions`,
      { headers: { Authorization: `Bearer ${OPENLAWS_API_KEY}` }, signal: AbortSignal.timeout(20000) }
    );
    if (!rawResp.ok) {
      return { found: false, isRepealed: false, error: `Root fetch HTTP ${rawResp.status}` };
    }
    const rawRoot = await rawResp.json() as Array<{
      path: string;
      display_name: string;
      display_children?: Array<{ display_name: string; path: string }>;
    }>;
    if (!Array.isArray(rawRoot) || rawRoot.length === 0) {
      return { found: false, isRepealed: false, error: `No root divisions for ${jurisdiction}/${lawKey}` };
    }

    // ── Strategy 1: Direct path construction ──────────────────────────────────
    // We know exactly which title and chapter to look in from the section number.
    // "13A-6-2" → title_13a → chapter_6 → search children. 2–5 API calls total.

    if (titleId || (codeHint && chapterId)) {
      // Find the right top-level compilation
      let topPath: string | null = null;
      if (titleId) {
        const match = rawRoot.find(r => r.path.toLowerCase() === `title_${titleId}`);
        topPath = match?.path ?? null;
      }
      if (!topPath && codeHint) {
        const match = rawRoot.find(r =>
          r.display_name.toLowerCase().includes(codeHint) || r.path.toLowerCase().includes(codeHint)
        );
        topPath = match?.path ?? null;
      }

      if (topPath && chapterId) {
        // Try the chapter path directly
        const chapterPath = `${topPath}.chapter_${chapterId}`;
        const chapterDiv = await fetchDivision(jurisdiction, lawKey, chapterPath);
        if (chapterDiv) {
          const result = await searchChildren(jurisdiction, lawKey, chapterDiv, section);
          if (result) return result;
        }

        // Some states use "article_N" instead of "chapter_N"
        const articlePath = `${topPath}.article_${chapterId}`;
        const articleDiv = await fetchDivision(jurisdiction, lawKey, articlePath);
        if (articleDiv) {
          const result = await searchChildren(jurisdiction, lawKey, articleDiv, section);
          if (result) return result;
        }
      }

      // Chapter path didn't work — search the title's pre-fetched chapters
      if (topPath) {
        const titleEntry = rawRoot.find(r => r.path === topPath);
        if (titleEntry?.display_children?.length) {
          // Check if section is directly in a top-level child (shallow code structures)
          for (const child of titleEntry.display_children) {
            if (divisionMatchesSection(child.path, section) || divisionMatchesSection(child.display_name, section)) {
              const found_div = await fetchDivision(jurisdiction, lawKey, child.path);
              if (!found_div) continue;
              return { found: true, isRepealed: checkRepealed(found_div), effectiveDate: found_div.effective_date_start };
            }
          }
        }
      }
    }

    // ── Strategy 2: codeHint-guided search (flat section numbers like CA § 187) ─
    // No explicit title/chapter in section number. Find the right compilation
    // via codeHint and search shallowly within it.

    if (codeHint) {
      const compilation = rawRoot.find(r =>
        r.display_name.toLowerCase().includes(codeHint) || r.path.toLowerCase().includes(codeHint)
      );
      if (compilation) {
        // Check compilation's own children (depth 1)
        const compDiv = await fetchDivision(jurisdiction, lawKey, compilation.path);
        if (compDiv) {
          const result = await searchChildren(jurisdiction, lawKey, compDiv, section, 6);
          if (result) return result;
        }
      }
    }

    // ── Strategy 3: Numeric-prefix fallback ───────────────────────────────────
    // No codeHint and no titleId — use the leading chapter number to find
    // the right top-level division (e.g., "9-1" → look in title_9 or chapter_9).

    if (chapterId && !titleId) {
      const numId = chapterId.replace(/[a-z]/gi, '');
      const topMatch = rawRoot.find(r =>
        r.path.toLowerCase() === `title_${chapterId.toLowerCase()}` ||
        r.path.toLowerCase() === `title_${numId}` ||
        r.path.toLowerCase() === `chapter_${chapterId}`
      );
      if (topMatch) {
        const topDiv = await fetchDivision(jurisdiction, lawKey, topMatch.path);
        if (topDiv) {
          const result = await searchChildren(jurisdiction, lawKey, topDiv, section, 6);
          if (result) return result;
        }
      }
    }

    return { found: false, isRepealed: false };
  } catch (err) {
    return { found: false, isRepealed: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Main verification logic ───────────────────────────────────────────────────

async function verifyCharge(
  charge: CriminalCharge,
  index: number,
  total: number
): Promise<ChargeVerificationResult> {
  const confidence = getChargeConfidence(charge);
  // Prefer overlay citation; fall back to inline statuteCitations[]
  const overlayCitation = CHARGE_CITATIONS[charge.id];
  const citation = overlayCitation?.citation ?? charge.statuteCitations?.[0] ?? null;
  const sourceType: 'training_data' | 'other' =
    overlayCitation?.source?.includes('Training data') ? 'training_data' : 'other';
  const checkedAt = new Date().toISOString();
  const label = `${charge.name} (${charge.jurisdiction})`;

  // No citation populated yet — pending Phase 3
  if (!citation) {
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation: null,
      currentConfidence: confidence,
      status: 'no_citation',
      needsManualReview: false, // Not a defect — expected during Phase 3 rollout
      reason: 'Citation not yet populated. Awaiting Phase 3 verification pass.',
      checkedAt,
      sourceType,
    };
  }

  // Pre-check: skip known-unverifiable citation patterns (MPC, case law, generic placeholders)
  // These are not broken citations — they're placeholder references that need
  // Phase 3 follow-up to replace with real state statute numbers.
  const skipReason = unverifiableReason(citation);
  if (skipReason) {
    process.stdout.write(`[${index}/${total}] SKIP (placeholder): ${label}\n`);
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'skipped',
      needsManualReview: false,
      reason: skipReason,
      checkedAt,
      sourceType,
    };
  }

  // Dry-run: classify only, no API call
  if (DRY_RUN) {
    process.stdout.write(`[${index}/${total}] DRY-RUN: ${label} — ${citation}\n`);
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'skipped',
      needsManualReview: false,
      reason: 'Dry-run mode — OpenLaws API not called.',
      checkedAt,
      sourceType,
    };
  }

  // Some charges use 'federal' (lowercase) instead of 'FED'
  const jurisdictionKey = (charge.jurisdiction === 'FED' || charge.jurisdiction === 'federal')
    ? 'FED'
    : STATE_LAW_KEYS[charge.jurisdiction] ? charge.jurisdiction : null;

  if (!jurisdictionKey) {
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: `No OpenLaws jurisdiction key for '${charge.jurisdiction}' — verify manually`,
      checkedAt,
      sourceType,
    };
  }

  process.stdout.write(`[${index}/${total}] Checking ${label} — ${citation} ... `);

  const result = await checkCitationViaOpenLaws(jurisdictionKey, citation);

  // Rate limiting: 200 ms between calls to avoid 429s
  await sleep(200);

  if (result.error && !OPENLAWS_API_KEY) {
    process.stdout.write('SKIPPED (no API key)\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: result.error,
      checkedAt,
      sourceType,
    };
  }

  if (result.error) {
    process.stdout.write(`ERROR: ${result.error}\n`);
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'api_error',
      needsManualReview: true,
      reason: result.error,
      checkedAt,
      sourceType,
    };
  }

  if (!result.found) {
    process.stdout.write('NOT FOUND\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'not_found',
      needsManualReview: true,
      reason: 'OpenLaws API could not locate this citation. Citation may be wrong or the state uses a different numbering system.',
      checkedAt,
      sourceType,
    };
  }

  if (result.isRepealed) {
    process.stdout.write('REPEALED\n');
    return {
      name: label,
      chargeId: charge.id,
      chargeName: charge.name,
      jurisdiction: charge.jurisdiction,
      citation,
      currentConfidence: confidence,
      status: 'repealed',
      isRepealed: true,
      effectiveDate: result.effectiveDate,
      needsManualReview: true,
      reason: 'Statute is marked as repealed or effective_date_end is in the past. Update citation to current law.',
      checkedAt,
      sourceType,
    };
  }

  const isAlreadyHigh = confidence === 'high';
  process.stdout.write(isAlreadyHigh ? 'OK (re-verified)\n' : 'VERIFIED\n');

  return {
    name: label,
    chargeId: charge.id,
    chargeName: charge.name,
    jurisdiction: charge.jurisdiction,
    citation,
    currentConfidence: confidence,
    status: isAlreadyHigh ? 'already_high' : 'verified',
    effectiveDate: result.effectiveDate,
    needsManualReview: false,
    checkedAt,
    sourceType,
  };
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const runAt = new Date().toISOString();

  // Apply filters
  let charges = criminalCharges.filter(c => {
    if (STATE_FILTER && c.jurisdiction !== STATE_FILTER) return false;
    if (CATEGORY_FILTER && !c.name.toLowerCase().includes(CATEGORY_FILTER)) return false;
    if (EXCLUDE_TERRITORIES && isTerritoryCharge(c.id)) return false;
    if (BATCH_FILTER !== null && getChargeBatch(c.id) !== BATCH_FILTER) return false;
    return true;
  });

  // A charge has a citation if the overlay OR inline statuteCitations[] has one
  const hasCitation = (c: CriminalCharge) =>
    !!(CHARGE_CITATIONS[c.id]?.citation || c.statuteCitations?.length);

  // Without --all, skip entries that have no citation (nothing to verify yet)
  const pendingCharges = charges.filter(c => !hasCitation(c));
  const chargesToCheck = INCLUDE_PENDING
    ? charges
    : charges.filter(c => hasCitation(c));

  const total = chargesToCheck.length;
  console.log(`\n=== Criminal Charge Citation Verifier ===`);
  console.log(`Run at:   ${runAt}`);
  console.log(`Mode:     ${DRY_RUN ? 'DRY-RUN' : OPENLAWS_API_KEY ? 'API' : 'NO API KEY (report only)'}`);
  if (BATCH_FILTER !== null) console.log(`Batch:    ${BATCH_FILTER} of 10`);
  if (STATE_FILTER) console.log(`Filter:   state=${STATE_FILTER}`);
  if (CATEGORY_FILTER) console.log(`Filter:   category contains "${CATEGORY_FILTER}"`);
  console.log(`Territories: ${EXCLUDE_TERRITORIES ? 'excluded (default)' : 'included (--include-territories)'}`);
  console.log(`Total charges in file: ${criminalCharges.length}`);
  console.log(`Pending (no citation): ${pendingCharges.length}`);
  console.log(`To verify this run:    ${total}`);
  console.log('');

  // ── Pre-run duplicate citation warning ──────────────────────────────────────
  // Scan for citations shared by more than one charge in the same jurisdiction.
  // This is informational only — does not abort the run.
  {
    const citationMap = new Map<string, string[]>(); // "JX:citation" → [chargeId, ...]
    for (const c of charges) {
      const cit = CHARGE_CITATIONS[c.id]?.citation ?? c.statuteCitations?.[0];
      if (!cit) continue;
      const key = `${c.jurisdiction}:${cit}`;
      const existing = citationMap.get(key) ?? [];
      existing.push(c.id);
      citationMap.set(key, existing);
    }
    const dupes = [...citationMap.entries()].filter(([, ids]) => ids.length > 1);
    if (dupes.length > 0) {
      console.log(`⚠️  Pre-run warning: ${dupes.length} citation(s) shared by multiple charges in the same jurisdiction.`);
      console.log('   Both charges will receive the same API result. Review intentionality after the run.');
      for (const [key, ids] of dupes.slice(0, 10)) {
        const [jx, cit] = key.split(':', 2);
        console.log(`   [${jx}] ${cit} → ${ids.join(', ')}`);
      }
      if (dupes.length > 10) console.log(`   ... and ${dupes.length - 10} more.`);
      console.log('');
    }
  }

  const results: ChargeVerificationResult[] = [];

  // Process pending separately if --all
  if (INCLUDE_PENDING) {
    for (const charge of pendingCharges) {
      results.push({
        name: `${charge.name} (${charge.jurisdiction})`,
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        citation: null,
        currentConfidence: getChargeConfidence(charge),
        status: 'no_citation',
        needsManualReview: false,
        reason: 'Citation not yet populated. Awaiting Phase 3 verification pass.',
        checkedAt: runAt,
      });
    }
  }

  // Verify entries that have citations (overlay or inline)
  const withCitations = chargesToCheck.filter(c => hasCitation(c));
  for (let i = 0; i < withCitations.length; i++) {
    const result = await verifyCharge(withCitations[i], i + 1, withCitations.length);
    results.push(result);
  }

  // Build summary counts
  const withCitationResults = results.filter(r => r.status !== 'no_citation');
  const skippedPlaceholders = withCitationResults.filter(r => r.status === 'skipped' && !DRY_RUN);
  const okCount = withCitationResults.filter(
    r => r.status === 'verified' || r.status === 'already_high' || r.status === 'skipped'
  ).length;
  const needsReviewItems = withCitationResults.filter(r => r.needsManualReview);
  const pendingCount = results.filter(r => r.status === 'no_citation').length;
  const verifiedHighCount = results.filter(r => r.status === 'already_high').length;

  const report: ReportOutput = {
    runAt,
    totalChecked: withCitationResults.length,
    okCount,
    needsReviewCount: needsReviewItems.length,
    pendingCount,
    verifiedHighCount,
    results,
  };

  // Write output — use per-batch filename when --batch is set
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputFilename = BATCH_FILTER !== null
    ? `charge-citations-batch-${BATCH_FILTER}-report.json`
    : 'charge-citations-report.json';
  const outputPath = path.join(outputDir, outputFilename);
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Console summary
  console.log('\n=== Summary ===');
  console.log(`Checked (with citations): ${withCitationResults.length}`);
  console.log(`  Verified / re-verified: ${withCitationResults.filter(r => r.status === 'verified' || r.status === 'already_high').length}`);
  console.log(`  Skipped (placeholder):  ${skippedPlaceholders.length}`);
  console.log(`  Needs manual review:    ${needsReviewItems.length}`);
  console.log(`Pending (no citation yet): ${pendingCount}`);
  console.log(`Already high-confidence:   ${verifiedHighCount}`);

  if (needsReviewItems.length > 0) {
    console.log('\n⚠️  Items needing manual review:');
    for (const item of needsReviewItems) {
      console.log(`  [${item.status.toUpperCase()}] ${item.name}`);
      if (item.citation) console.log(`         Citation: ${item.citation}`);
      if (item.reason) console.log(`         Reason:   ${item.reason}`);
    }
  }

  console.log(`\nReport written to: ${outputPath}`);

  // Exit with error code if any citations failed verification (for CI)
  if (!DRY_RUN && needsReviewItems.some(r => r.status === 'not_found' || r.status === 'repealed')) {
    console.log('\n⚠️  One or more citations failed verification. See report for details.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
