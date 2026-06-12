/**
 * CA Citation Verifier
 *
 * Verifies California statute citations against leginfo.legislature.ca.gov
 * (the official California Legislature statutes database). No API key required.
 *
 * Detection method: the leginfo page embeds `var op_statues = '2023'` (a year)
 * when a section exists, and `var op_statues = ''` (empty) when it does not.
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-ca-citations.ts [--dry-run] [--apply]
 *
 *   --dry-run   Show each charge + planned URL without making any HTTP requests
 *   --apply     Write verified entries into shared/criminal-charge-citations.ts
 *               (default: output to scripts/data-review/output/ca-citations-output.json)
 *
 * Confidence assigned:
 *   "high"   — leginfo returned a non-empty op_statues year (section exists)
 *   "medium" — leginfo returned empty op_statues, or request failed
 *
 * sourceUrl is always updated to the official leginfo URL when upgrading to "high".
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

// ── CLI args ──────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400; // ~2.5 req/sec — leginfo handles this without issue
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const LEGINFO_BASE   = 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml';

// ── Law code mapping ──────────────────────────────────────────────────────────
// Maps citation text fragment → leginfo lawCode query parameter

const LAW_CODE_MAP: [string, string][] = [
  ['Penal Code',           'PEN'],
  ['Health & Safety Code', 'HSC'],
  ['Health & Saf. Code',   'HSC'], // alternate abbreviation used in some overlay entries
  ['Veh. Code',            'VEH'],
  ['Welf. & Inst. Code',   'WIC'],
  ['Bus. & Prof. Code',    'BPC'],
  ['Fish & Game Code',     'FGC'],
  ['Food & Agric. Code',   'FAC'],
  ['Food & Agricultural Code', 'FAC'],
  ['Educ. Code',           'EDC'],
  ['Rev. & Tax. Code',     'RTC'],
  ['Gov. Code',            'GOV'],
  ['Fam. Code',            'FAM'],
];

// Human-readable prefix for each law code (used in source notes)
const LAW_PREFIX: Record<string, string> = {
  PEN: 'Cal. Penal Code',
  HSC: 'Cal. Health & Safety Code',
  VEH: 'Cal. Vehicle Code',
  WIC: 'Cal. Welfare & Institutions Code',
  BPC: 'Cal. Business & Professions Code',
  FGC: 'Cal. Fish & Game Code',
  EDC: 'Cal. Education Code',
  RTC: 'Cal. Revenue & Taxation Code',
  GOV: 'Cal. Government Code',
  FAM: 'Cal. Family Code',
};

// ── Citation parser ───────────────────────────────────────────────────────────

interface ParsedCitation {
  lawCode: string;
  section: string; // cleaned for URL (first section only, no parens)
  url: string;
}

/**
 * Parse a CA citation string to extract lawCode + section number.
 * Handles: "Cal. Penal Code § 187", "§§ 459, 460(a)", "§ 212.5(a)"
 */
function parseCitation(citation: string): ParsedCitation | null {
  for (const [name, code] of LAW_CODE_MAP) {
    if (!citation.includes(name)) continue;
    // Match first section number after § or §§
    // Handles: "§ 187", "§ 212.5(a)", "§ 484g", "§§ 459, 460(a)"
    // Preserves letter suffix (484g, 653f) but strips parenthesised subdivisions like (a)
    const match = citation.match(/§§?\s*([\d.]+[a-z]?)/i);
    if (!match) continue;
    const section = match[1]; // e.g. "212.5", "484g", "459"
    const url = `${LEGINFO_BASE}?lawCode=${code}&sectionNum=${section}.`;
    return { lawCode: code, section, url };
  }
  return null;
}

// ── Network helpers ───────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

interface FetchResult {
  ok: boolean;
  year?: string;  // Stats year from op_statues (e.g. "2023") when section exists
  error?: string;
}

async function verifyLeginfoSection(url: string): Promise<FetchResult> {
  try {
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(18_000),
      headers: {
        'User-Agent': 'OpenDefender-CitationVerifier/1.0 (legal-aid-platform)',
        'Accept': 'text/html',
      },
    });
    if (!resp.ok) return { ok: false, error: `HTTP ${resp.status}` };
    const body = await resp.text();

    // Valid section: var op_statues = '2023' (non-empty year)
    const validMatch = body.match(/var op_statues = '(\d+)'/);
    if (validMatch) return { ok: true, year: validMatch[1] };

    // Invalid section: var op_statues = '' (empty string)
    if (body.includes("var op_statues = ''")) {
      return { ok: false, error: 'section not found on leginfo' };
    }

    // Unexpected — neither pattern found
    return { ok: false, error: 'unexpected page structure' };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err) };
  }
}

// ── Overlay helpers ───────────────────────────────────────────────────────────

/** Find the raw block for a charge ID (opening key to closing "},") */
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

/** Replace one field value in a block string without regex over arbitrary values. */
function replaceField(block: string, field: string, newValue: string): string {
  const fieldStart = block.indexOf(`${field}: `);
  if (fieldStart === -1) return block;
  const lineEnd = block.indexOf('\n', fieldStart);
  if (lineEnd === -1) return block;
  const afterField = fieldStart + `${field}: `.length;
  return block.slice(0, afterField) + `${JSON.stringify(newValue)},` + block.slice(lineEnd);
}

/** Upgrade a medium overlay entry to high in-place. Returns updated src. */
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
  lawCode: string;
  section: string;
  citation: string;
  confidence: 'high' | 'medium';
  source: string;
  sourceUrl: string;
  status: 'verified' | 'failed' | 'parse_error' | 'dry_run';
  year?: string;
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
  const caCharges = criminalCharges.filter(c => c.jurisdiction === 'CA');

  // Find which CA charges have a medium overlay entry
  const toVerify: Array<{ chargeId: string; chargeName: string; citation: string }> = [];

  for (const charge of caCharges) {
    const block = findEntryBlock(src, charge.id);
    if (!block) continue;
    if (!block.text.includes('confidence: "medium"')) continue;
    // Extract citation from block
    const citationMatch = block.text.match(/citation:\s*"([^"]+)"/);
    if (!citationMatch) continue;
    toVerify.push({
      chargeId: charge.id,
      chargeName: charge.name,
      citation: citationMatch[1],
    });
  }

  console.log('\nCA Citation Verifier');
  console.log('────────────────────────────────');
  console.log(`CA charges total      : ${caCharges.length}`);
  console.log(`Medium entries        : ${toVerify.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY RUN' : APPLY ? 'APPLY to overlay' : 'Output JSON only'}`);
  console.log(`Source                : leginfo.legislature.ca.gov`);
  console.log('');

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
        lawCode: '', section: '',
        citation,
        confidence: 'medium',
        source: 'parse error — citation format not recognised',
        sourceUrl: '',
        status: 'parse_error',
      });
      continue;
    }

    const prefix = LAW_PREFIX[parsed.lawCode] ?? `Cal. ${parsed.lawCode}`;

    if (DRY_RUN) {
      console.log(`  [DRY] ${chargeId} → ${citation}`);
      console.log(`         ${parsed.url}`);
      results.push({
        chargeId, chargeName,
        lawCode: parsed.lawCode, section: parsed.section,
        citation,
        confidence: 'medium',
        source: 'dry-run — not verified',
        sourceUrl: parsed.url,
        status: 'dry_run',
      });
      continue;
    }

    if (i > 0) await sleep(RATE_LIMIT_MS);

    const check = await verifyLeginfoSection(parsed.url);

    if (check.ok && check.year) {
      const source = `California Legislature (leginfo) — ${prefix} § ${parsed.section} (Stats. ${check.year})`;
      console.log(`  [OK]  ${chargeId} → ${citation}  (Stats. ${check.year})`);
      results.push({
        chargeId, chargeName,
        lawCode: parsed.lawCode, section: parsed.section,
        citation,
        confidence: 'high',
        source,
        sourceUrl: parsed.url,
        status: 'verified',
        year: check.year,
      });
      verified++;
    } else {
      const source = `leginfo — ${check.error ?? 'unconfirmed'} — needs manual review`;
      console.log(`  [FAIL] ${chargeId} → ${citation}  (${check.error ?? 'not confirmed'})`);
      results.push({
        chargeId, chargeName,
        lawCode: parsed.lawCode, section: parsed.section,
        citation,
        confidence: 'medium',
        source,
        sourceUrl: parsed.url,
        status: 'failed',
      });
      failed++;
    }
  }

  // ── Write JSON output ──
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, 'ca-citations-output.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    state: 'CA',
    generatedAt: new Date().toISOString(),
    source: 'leginfo.legislature.ca.gov (official California Legislature)',
    stats: {
      total: toVerify.length,
      verified,
      failed,
      parseErrors,
    },
    entries: results,
  }, null, 2));
  console.log(`\nOutput written to: ${jsonPath}`);

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
