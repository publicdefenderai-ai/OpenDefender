/**
 * TX Citation Verifier
 *
 * Verifies Texas statute citations against the Texas Legislature's TCSS resource
 * server (https://tcss.legis.texas.gov/resources/), which is the static HTML
 * back-end powering statutes.capitol.texas.gov (the official TX statutes site).
 *
 * Why TCSS instead of statutes.capitol.texas.gov?
 *   The public-facing site is an Angular SPA that returns the same HTML shell
 *   for ALL routes — including nonexistent ones — making HTTP-based verification
 *   impossible.  The TCSS resource server at tcss.legis.texas.gov/resources/
 *   serves the raw chapter HTML files directly, returns HTTP 404 for nonexistent
 *   chapters, and is the same data source the Angular app fetches at runtime.
 *   (Discovered by tracing the SPA bundle: main → chunk-ZJ7HSB4W.js contains
 *   the getStatutearray service calling `${TCASCore}GetStatute/GetStatute/...`,
 *   where TCASCore = "https://tcss.legis.texas.gov/api/".)
 *
 * Detection method:
 *   1. Construct chapter URL: https://tcss.legis.texas.gov/resources/{CODE}/htm/{CODE}.{CHAPTER}.htm
 *   2. HTTP 404 → chapter does not exist → section not found.
 *   3. HTTP 200 → search for `name="{sectionNum}"` anchor in the HTML.
 *      Present → section exists.  Absent → section not found.
 *   Note: the HTML uses bare section numbers as anchors (e.g. name="30.02"),
 *   never with subdivisions (name="30.02(c)(2)" does NOT appear).
 *
 * Chapter-level caching:
 *   Multiple charges in the same chapter (e.g. PE.42) share one HTTP download.
 *   Total HTTP requests ≈ unique chapters (~60–70), not entries (101).
 *   This keeps the full run well under 60 seconds.
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-tx-citations.ts [--dry-run] [--apply]
 *
 *   --dry-run   Show each charge + planned URL without HTTP requests.
 *   --apply     Write verified entries into shared/criminal-charge-citations.ts.
 *               (Default: output JSON to scripts/data-review/output/tx-citations-output.json)
 *
 * Periodic re-verification (monthly / quarterly):
 *   Simply re-run with --apply.  Already-high entries are skipped (no regression);
 *   any entry still at "medium" is re-attempted.  If the TX Legislature renumbers
 *   or repeals a section, the verifier will flag it as "failed" so it can be
 *   manually reviewed before confidence is changed.
 *
 * Confidence assigned:
 *   "high"   — name anchor found in chapter HTML (section confirmed live)
 *   "medium" — anchor absent, chapter 404, or request failed
 *
 * sourceUrl is set to the tcss.legis.texas.gov direct link (plain HTML, no JS
 * required) when upgrading to "high".
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

// ── CLI args ──────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400; // applied between chapter fetches (~2.5 req/sec)
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const TCSS_BASE      = 'https://tcss.legis.texas.gov/resources';

// ── Code abbreviation map ─────────────────────────────────────────────────────
// Maps citation name fragment → TCSS directory code (confirmed via HEAD requests)

const CODE_MAP: [string, string][] = [
  ['Penal Code',                  'PE'],
  ['Transp. Code',                'TN'],
  ['Transportation Code',         'TN'],
  ['Health & Safety Code',        'HS'],
  ['Tax Code',                    'TX'],
  ['Civ. Prac. & Rem. Code',      'CP'],
  ['Civil Practice and Remedies', 'CP'],
  ['Code Crim. Proc.',            'CR'],
  ['Code of Criminal Procedure',  'CR'],
  ['Alco. Bev. Code',             'AL'],
  ['Alcoholic Beverage Code',     'AL'],
  ['Hum. Res. Code',              'HR'],
  ['Human Resources Code',        'HR'],
  ['Educ. Code',                  'ED'],
  ['Education Code',              'ED'],
  ['Occ. Code',                   'OC'],
  ['Occupations Code',            'OC'],
  ['Parks & Wild. Code',          'PW'],
  ['Parks and Wildlife Code',     'PW'],
  ['Fam. Code',                   'FA'],
  ['Family Code',                 'FA'],
];

// Human-readable citation prefix for source notes
const CODE_PREFIX: Record<string, string> = {
  PE: 'Tex. Penal Code',
  TN: 'Tex. Transp. Code',
  HS: 'Tex. Health & Safety Code',
  TX: 'Tex. Tax Code',
  CP: 'Tex. Civ. Prac. & Rem. Code',
  CR: 'Tex. Code Crim. Proc.',
  AL: 'Tex. Alco. Bev. Code',
  HR: 'Tex. Hum. Res. Code',
  ED: 'Tex. Educ. Code',
  OC: 'Tex. Occ. Code',
  PW: 'Tex. Parks & Wild. Code',
  FA: 'Tex. Fam. Code',
};

// ── Citation parser ───────────────────────────────────────────────────────────

interface ParsedCitation {
  code: string;        // TCSS code (e.g. "PE")
  chapter: string;     // chapter string (e.g. "19", "42A", "521")
  section: string;     // bare section number for anchor lookup (e.g. "19.03", "42A.751")
  chapterUrl: string;  // URL to the chapter HTML file on tcss.legis.texas.gov
  sourceUrl: string;   // deep-link including section anchor
}

/**
 * Parse a TX citation string to extract code, chapter, and section.
 *
 * Handles:
 *   "Tex. Penal Code § 19.03"           → PE / 19 / 19.03
 *   "Tex. Penal Code §§ 15.01, 29.02"   → PE / 15 / 15.01  (first section)
 *   "Tex. Penal Code § 30.02(c)(2)"     → PE / 30 / 30.02  (subdivision stripped)
 *   "Tex. Transp. Code § 521.457"       → TN / 521 / 521.457
 *   "Tex. Code Crim. Proc. art. 42A.751"→ CR / 42A / 42A.751
 *   "Tex. Health & Safety Code § 481.115" → HS / 481 / 481.115
 */
function parseCitation(citation: string): ParsedCitation | null {
  for (const [name, code] of CODE_MAP) {
    if (!citation.includes(name)) continue;

    // Match first section number — either after "§" or after "art."
    // Handles: "§ 19.03", "§§ 15.01, 29.02", "§ 30.02(c)(2)", "art. 42A.751"
    // Captures: digits + optional uppercase letter + dot + more digits (e.g. "42A.751", "521.457")
    const match = citation.match(/(?:§§?|art\.)\s*([\d]+[A-Z]?\.[\d]+)/i);
    if (!match) continue;

    // Bare section number — strip trailing subdivisions like (a)(1)
    const section = match[1]; // e.g. "19.03", "42A.751", "521.457"

    // Chapter is everything before the first dot — handles "42A", "521", "19"
    const chapterMatch = section.match(/^([\d]+[A-Z]?)\./i);
    if (!chapterMatch) continue;
    const chapter = chapterMatch[1]; // e.g. "19", "42A", "521"

    const chapterUrl = `${TCSS_BASE}/${code}/htm/${code}.${chapter}.htm`;
    const sourceUrl  = `${chapterUrl}#${section}`;

    return { code, chapter, section, chapterUrl, sourceUrl };
  }
  return null;
}

// ── Network helpers ───────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

interface ChapterResult {
  ok: boolean;
  html?: string;
  error?: string;
}

/**
 * Fetch a TX statute chapter HTML file from the TCSS resource server.
 * Returns { ok: true, html } on HTTP 200, { ok: false } on 404 or error.
 */
async function fetchChapter(url: string): Promise<ChapterResult> {
  try {
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(18_000),
      headers: {
        'User-Agent': 'OpenDefender-CitationVerifier/1.0 (legal-aid-platform)',
        'Accept':     'text/html, */*',
        'Referer':    'https://statutes.capitol.texas.gov/',
      },
    });
    if (resp.status === 404) return { ok: false, error: 'chapter not found (HTTP 404)' };
    if (!resp.ok)            return { ok: false, error: `HTTP ${resp.status}` };
    const html = await resp.text();
    return { ok: true, html };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err) };
  }
}

/**
 * Check whether a section anchor exists in a chapter's HTML.
 * TCSS HTML uses <a name="{sectionNum}"> — never includes subdivisions.
 * e.g. section "30.02" → search for name="30.02"
 */
function sectionExistsInHtml(html: string, section: string): boolean {
  return html.includes(`name="${section}"`);
}

// ── Overlay helpers ───────────────────────────────────────────────────────────
// (same pattern as verify-ca-citations.ts for consistency)

function findEntryBlock(
  src: string,
  chargeId: string,
): { start: number; end: number; text: string } | null {
  const start = src.indexOf(`"${chargeId}": {`);
  if (start === -1) return null;
  const end = src.indexOf('},', start);
  if (end === -1) return null;
  return { start, end, text: src.slice(start, end + 2) };
}

function replaceField(block: string, field: string, newValue: string): string {
  const fieldStart = block.indexOf(`${field}: `);
  if (fieldStart === -1) return block;
  const lineEnd = block.indexOf('\n', fieldStart);
  if (lineEnd === -1) return block;
  const afterField = fieldStart + `${field}: `.length;
  return block.slice(0, afterField) + `${JSON.stringify(newValue)},` + block.slice(lineEnd);
}

function upgradeEntry(
  src: string,
  entry: VerifiedEntry,
): { src: string; upgraded: boolean } {
  const block = findEntryBlock(src, entry.chargeId);
  if (!block) return { src, upgraded: false };
  if (!block.text.includes('confidence: "medium"')) return { src, upgraded: false };

  let updated = block.text;
  updated = updated.replace('confidence: "medium"', 'confidence: "high"');
  updated = updated.replace(/lastVerified: "[^"]*"/, `lastVerified: "${VERIFIED_MONTH}"`);
  updated = replaceField(updated, 'citation',  entry.citation);
  updated = replaceField(updated, 'source',    entry.source);
  updated = replaceField(updated, 'sourceUrl', entry.sourceUrl);

  return {
    src: src.slice(0, block.start) + updated + src.slice(block.end + 2),
    upgraded: true,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface VerifiedEntry {
  chargeId: string;
  chargeName: string;
  code: string;
  chapter: string;
  section: string;
  citation: string;
  confidence: 'high' | 'medium';
  source: string;
  sourceUrl: string;
  status: 'verified' | 'failed' | 'parse_error' | 'dry_run';
}

// ── Apply results to overlay ──────────────────────────────────────────────────

function applyToOverlay(entries: VerifiedEntry[]): void {
  let src = fs.readFileSync(OVERLAY_PATH, 'utf-8');
  let upgraded = 0, alreadyHigh = 0, keptMedium = 0;

  for (const entry of entries) {
    if (entry.status === 'dry_run' || entry.status === 'parse_error') continue;

    const block = findEntryBlock(src, entry.chargeId);
    if (!block) {
      console.log(`  [missing]         ${entry.chargeId} — not found in overlay`);
      continue;
    }

    if (entry.status === 'verified') {
      const result = upgradeEntry(src, entry);
      if (result.upgraded) {
        src = result.src;
        upgraded++;
        console.log(`  [upgraded → high] ${entry.chargeId}`);
      } else {
        alreadyHigh++;
        console.log(`  [already high]    ${entry.chargeId}`);
      }
    } else {
      keptMedium++;
      console.log(`  [kept medium]     ${entry.chargeId}`);
    }
  }

  fs.writeFileSync(OVERLAY_PATH, src, 'utf-8');
  console.log(`\n  Upgraded to high : ${upgraded}`);
  console.log(`  Already high     : ${alreadyHigh}`);
  console.log(`  Kept medium      : ${keptMedium}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const src = fs.readFileSync(OVERLAY_PATH, 'utf-8');
  const txCharges = criminalCharges.filter(c => c.jurisdiction === 'TX');

  const toVerify: Array<{ chargeId: string; chargeName: string; citation: string }> = [];

  for (const charge of txCharges) {
    const block = findEntryBlock(src, charge.id);
    if (!block) continue;
    if (!block.text.includes('confidence: "medium"')) continue;
    const citationMatch = block.text.match(/citation:\s*"([^"]+)"/);
    if (!citationMatch) continue;
    toVerify.push({ chargeId: charge.id, chargeName: charge.name, citation: citationMatch[1] });
  }

  console.log('\nTX Citation Verifier');
  console.log('────────────────────────────────');
  console.log(`TX charges total      : ${txCharges.length}`);
  console.log(`Medium entries        : ${toVerify.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY RUN' : APPLY ? 'APPLY to overlay' : 'Output JSON only'}`);
  console.log(`Source                : tcss.legis.texas.gov/resources (TCSS static HTML)`);
  console.log(`Note                  : Chapters are cached — unique chapters downloaded once`);
  console.log('');

  // Chapter cache: chapterKey ("PE.19") → HTML string (or null if 404/error)
  const chapterCache = new Map<string, string | null>();
  let httpRequests = 0;

  const results: VerifiedEntry[] = [];
  let verified = 0, failed = 0, parseErrors = 0;

  for (let i = 0; i < toVerify.length; i++) {
    const { chargeId, chargeName, citation } = toVerify[i];
    const parsed = parseCitation(citation);

    if (!parsed) {
      console.log(`  [SKIP] ${chargeId} — cannot parse: "${citation}"`);
      parseErrors++;
      results.push({
        chargeId, chargeName,
        code: '', chapter: '', section: '',
        citation,
        confidence: 'medium',
        source: 'parse error — citation format not recognised',
        sourceUrl: '',
        status: 'parse_error',
      });
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [DRY] ${chargeId} → ${citation}`);
      console.log(`         ${parsed.sourceUrl}`);
      results.push({
        chargeId, chargeName,
        code: parsed.code, chapter: parsed.chapter, section: parsed.section,
        citation,
        confidence: 'medium',
        source: 'dry-run — not verified',
        sourceUrl: parsed.sourceUrl,
        status: 'dry_run',
      });
      continue;
    }

    // Check chapter cache
    const chapterKey = `${parsed.code}.${parsed.chapter}`;
    let html = chapterCache.get(chapterKey);

    if (html === undefined) {
      // Not yet fetched — rate limit then download
      if (httpRequests > 0) await sleep(RATE_LIMIT_MS);
      const result = await fetchChapter(parsed.chapterUrl);
      httpRequests++;
      if (result.ok && result.html) {
        chapterCache.set(chapterKey, result.html);
        html = result.html;
      } else {
        chapterCache.set(chapterKey, null);
        html = null;
        console.log(`  [FAIL] ${chargeId} → ${citation}  (${result.error ?? 'chapter fetch failed'})`);
        const source = `tcss.legis.texas.gov — ${result.error ?? 'chapter fetch failed'} — needs manual review`;
        results.push({
          chargeId, chargeName,
          code: parsed.code, chapter: parsed.chapter, section: parsed.section,
          citation,
          confidence: 'medium',
          source,
          sourceUrl: parsed.sourceUrl,
          status: 'failed',
        });
        failed++;
        continue;
      }
    }

    if (html === null) {
      // Chapter was already fetched and returned error
      console.log(`  [FAIL] ${chargeId} → ${citation}  (cached chapter error)`);
      const source = `tcss.legis.texas.gov — chapter not found — needs manual review`;
      results.push({
        chargeId, chargeName,
        code: parsed.code, chapter: parsed.chapter, section: parsed.section,
        citation,
        confidence: 'medium',
        source,
        sourceUrl: parsed.sourceUrl,
        status: 'failed',
      });
      failed++;
      continue;
    }

    // Check section anchor in cached HTML
    const prefix = CODE_PREFIX[parsed.code] ?? `Tex. ${parsed.code}`;
    const exists = sectionExistsInHtml(html, parsed.section);

    if (exists) {
      const source = `Texas Legislature (tcss.legis.texas.gov) — ${prefix} § ${parsed.section}`;
      console.log(`  [OK]  ${chargeId} → ${citation}`);
      results.push({
        chargeId, chargeName,
        code: parsed.code, chapter: parsed.chapter, section: parsed.section,
        citation,
        confidence: 'high',
        source,
        sourceUrl: parsed.sourceUrl,
        status: 'verified',
      });
      verified++;
    } else {
      console.log(`  [FAIL] ${chargeId} → ${citation}  (section anchor "${parsed.section}" not found in chapter HTML)`);
      const source = `tcss.legis.texas.gov — section anchor not found — needs manual review`;
      results.push({
        chargeId, chargeName,
        code: parsed.code, chapter: parsed.chapter, section: parsed.section,
        citation,
        confidence: 'medium',
        source,
        sourceUrl: parsed.sourceUrl,
        status: 'failed',
      });
      failed++;
    }
  }

  // ── Write JSON output ──
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, 'tx-citations-output.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    state: 'TX',
    generatedAt: new Date().toISOString(),
    source: 'tcss.legis.texas.gov/resources (Texas Legislature TCSS static HTML)',
    stats: {
      total: toVerify.length,
      verified,
      failed,
      parseErrors,
      httpRequests,
      chaptersCached: chapterCache.size,
    },
    entries: results,
  }, null, 2));
  console.log(`\nOutput written to: ${jsonPath}`);
  console.log(`HTTP requests made: ${httpRequests} (for ${chapterCache.size} unique chapters)`);

  // ── Apply to overlay ──
  if (APPLY && !DRY_RUN) {
    console.log('\nApplying to overlay...');
    applyToOverlay(results);
    console.log(`✓ Overlay updated: ${OVERLAY_PATH}`);
  }

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${verified}`);
  console.log(`  Not confirmed    : ${failed}`);
  console.log(`  Parse errors     : ${parseErrors}`);
  console.log(`  Total processed  : ${toVerify.length}`);
  if (!APPLY && !DRY_RUN) {
    console.log(`\nTo write entries into the overlay, re-run with --apply`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
