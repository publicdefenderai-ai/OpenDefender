/**
 * Criminal Charge Citation Verifier
 *
 * Verifies that every statuteCitations entry in criminal-charges.ts resolves to
 * a real, current, non-repealed statute via the OpenLaws API.
 *
 * Modes:
 *   default     — check all charges that have statuteCitations populated
 *   --all       — also report charges with no citations (pending Phase 3 work)
 *   --state XX  — limit to a single state code (e.g., --state CA)
 *   --category  — limit to charge names matching a substring (e.g., --category assault)
 *   --dry-run   — parse and categorise only; do not call OpenLaws API
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-charge-citations.ts
 *   npx tsx scripts/data-review/verify-charge-citations.ts --all
 *   npx tsx scripts/data-review/verify-charge-citations.ts --state CA --dry-run
 *
 * Outputs:
 *   scripts/data-review/output/charge-citations-report.json
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

const stateArg = args.indexOf('--state');
const STATE_FILTER: string | null = stateArg !== -1 ? (args[stateArg + 1] ?? '').toUpperCase() : null;

const categoryArg = args.indexOf('--category');
const CATEGORY_FILTER: string | null = categoryArg !== -1 ? (args[categoryArg + 1] ?? '').toLowerCase() : null;

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

interface ParsedCitation {
  jurisdiction: string;
  lawKey: string;
  section: string;
  codeHint?: string;
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
 * Prioritise root-level compilations (titles) so we search the right one first.
 *
 * OpenLaws root returns an array of titles: title_1, title_2, ..., title_13a, ...
 * The section number prefix tells us which title to look in:
 *   "13A-6-2"  → title_13a  (leading "13a")
 *   "19.03"    → title_19   (leading "19")
 *   "187"      → no numeric prefix match; rely on codeHint ("penal")
 *   "5/9-1"    → ILCS format; leading "5" → look for the ILCS Act 5 compilation
 *
 * Scoring (higher = checked first):
 *   +100  codeHint matches compilation name (e.g. "penal" in "California Penal Code")
 *   +80   exact title_<id> path match     (e.g. "title_13a" for section "13A-6-2")
 *   +40   numeric-only prefix match       (e.g. "title_13" also tried for "13A-6-2")
 */
function prioritiseCompilations(
  children: Array<{ display_name: string; path: string }>,
  section: string,
  codeHint?: string
): Array<{ display_name: string; path: string }> {
  // Extract leading identifier: "13A-6-2" → "13a", "19.03" → "19", "5/9-1" → "5"
  const leadingMatch = section.match(/^(\d+[a-z]?)(?:[._\-/]|$)/i);
  const titleId = leadingMatch ? leadingMatch[1].toLowerCase() : null;
  const numOnly  = titleId ? titleId.replace(/[a-z]/gi, '') : null;

  return [...children]
    .map(c => {
      const name = c.display_name.toLowerCase();
      const p    = c.path.toLowerCase();
      let score  = 0;

      if (codeHint && (name.includes(codeHint) || p.includes(codeHint)))        score += 100;
      if (titleId && p === `title_${titleId}`)                                   score += 80;
      if (numOnly  && new RegExp(`title_${numOnly}(?:[^0-9]|$)`).test(p))        score += 40;

      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ c }) => c);
}

async function checkCitationViaOpenLaws(
  _unusedJurisdictionKey: string,
  citation: string
): Promise<OpenLawsCheckResult> {
  if (!OPENLAWS_API_KEY) {
    return { found: false, isRepealed: false, error: 'OPENLAWS_API_KEY not set' };
  }

  const parsed = parseCitationForVerifier(citation);
  if (!parsed) {
    return { found: false, isRepealed: false, error: `Cannot parse citation: ${citation}` };
  }

  const { jurisdiction, lawKey, section, codeHint } = parsed;

  try {
    const root = await fetchDivision(jurisdiction, lawKey);
    if (!root?.display_children?.length) {
      return { found: false, isRepealed: false, error: `No root divisions for ${jurisdiction}/${lawKey}` };
    }

    // Sort all titles by relevance; search top 8 (enough fallback without runaway calls)
    const compilations = prioritiseCompilations(root.display_children, section, codeHint);

    // Also expose root-level objects' pre-fetched children so depth-1 costs 0 extra calls
    // (OpenLaws includes display_children on each root title object)
    const rootChildrenMap = new Map<string, Array<{ display_name: string; path: string }>>();
    // We re-fetch root as raw to capture nested children
    try {
      const rawRoot = await fetch(
        `${OPENLAWS_API_URL}/jurisdictions/${jurisdiction}/laws/${lawKey}/divisions`,
        { headers: { Authorization: `Bearer ${OPENLAWS_API_KEY}` }, signal: AbortSignal.timeout(20000) }
      );
      if (rawRoot.ok) {
        const rawData = await rawRoot.json() as Array<{ path: string; display_children?: Array<{ display_name: string; path: string }> }>;
        if (Array.isArray(rawData)) {
          for (const item of rawData) {
            if (item.display_children?.length) rootChildrenMap.set(item.path, item.display_children);
          }
        }
      }
    } catch { /* non-fatal */ }

    const MAX_CALLS = 25;
    const MAX_DEPTH = 4;
    let apiCalls = 1; // counted the root fetch above

    for (const compilation of compilations.slice(0, 8)) {
      if (apiCalls >= MAX_CALLS) break;

      // Use pre-fetched children for this title if available (saves one API call per title)
      const prefetched = rootChildrenMap.get(compilation.path);
      let currentLevel = prefetched
        ? prefetched.map(c => c.path)
        : [compilation.path];
      if (prefetched) {
        // Check if any prefetched chapter is already the section we want
        for (const child of prefetched) {
          if (divisionMatchesSection(child.path, section) || divisionMatchesSection(child.display_name, section)) {
            apiCalls++;
            const found_div = await fetchDivision(jurisdiction, lawKey, child.path);
            if (!found_div) continue;
            const isRepealed =
              found_div.is_repealed === true ||
              (!!found_div.effective_date_end && found_div.effective_date_end !== 'Infinity' && new Date(found_div.effective_date_end) < new Date());
            return { found: true, isRepealed, effectiveDate: found_div.effective_date_start };
          }
        }
      }

      for (let depth = 0; depth < MAX_DEPTH && currentLevel.length > 0 && apiCalls < MAX_CALLS; depth++) {
        const nextLevel: string[] = [];

        for (const divPath of currentLevel) {
          if (apiCalls >= MAX_CALLS) break;
          try {
            apiCalls++;
            const div = await fetchDivision(jurisdiction, lawKey, divPath);
            if (!div?.display_children) continue;

            for (const child of div.display_children) {
              if (divisionMatchesSection(child.path, section) || divisionMatchesSection(child.display_name, section)) {
                apiCalls++;
                const found_div = await fetchDivision(jurisdiction, lawKey, child.path);
                if (!found_div) continue;
                const isRepealed =
                  found_div.is_repealed === true ||
                  (!!found_div.effective_date_end && found_div.effective_date_end !== 'Infinity' && new Date(found_div.effective_date_end) < new Date());
                return { found: true, isRepealed, effectiveDate: found_div.effective_date_start };
              }
              nextLevel.push(child.path);
            }
          } catch { /* ignore individual path errors */ }

          if (apiCalls % 5 === 0) await sleep(100);
        }
        currentLevel = nextLevel;
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
  const citation = CHARGE_CITATIONS[charge.id]?.citation ?? charge.statuteCitations?.[0] ?? null;
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
    };
  }

  const jurisdictionKey = charge.jurisdiction === 'FED'
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
  };
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const runAt = new Date().toISOString();

  // Apply filters
  let charges = criminalCharges.filter(c => {
    if (STATE_FILTER && c.jurisdiction !== STATE_FILTER) return false;
    if (CATEGORY_FILTER && !c.name.toLowerCase().includes(CATEGORY_FILTER)) return false;
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
  if (STATE_FILTER) console.log(`Filter:   state=${STATE_FILTER}`);
  if (CATEGORY_FILTER) console.log(`Filter:   category contains "${CATEGORY_FILTER}"`);
  console.log(`Total charges in file: ${criminalCharges.length}`);
  console.log(`Pending (no citation): ${pendingCharges.length}`);
  console.log(`To verify this run:    ${total}`);
  console.log('');

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

  // Write output
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'charge-citations-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Console summary
  console.log('\n=== Summary ===');
  console.log(`Checked (with citations): ${withCitationResults.length}`);
  console.log(`  Verified / re-verified: ${okCount}`);
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
