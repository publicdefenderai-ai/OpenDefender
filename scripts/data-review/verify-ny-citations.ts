/**
 * NY Citation Verifier
 *
 * Uses the NY Senate Open Legislation API to verify citations for all NY charges.
 * Requires NY_SENATE_API_KEY environment variable (set in Replit Secrets).
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-ny-citations.ts [--dry-run] [--apply]
 *
 *   --dry-run   Show each charge + planned API call without hitting the network
 *   --apply     Write all verified entries directly into shared/criminal-charge-citations.ts
 *               (default: output to scripts/data-review/output/ny-citations-output.json)
 *
 * Confidence assigned:
 *   "high"   — API returned the section successfully (official NY state source)
 *   "medium" — API call failed or section not found (entry still written; needs review)
 *   skipped  — local NYC Admin Code ordinance (no state API endpoint)
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

// ── Load .env so the key is available when run via npx tsx ────────────────────
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch { /* .env absent — key must be set in environment */ }

// ── CLI args ──────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

// ── Constants ─────────────────────────────────────────────────────────────────
const NY_API_BASE    = 'https://legislation.nysenate.gov/api/3';
const NY_API_KEY     = process.env.NY_SENATE_API_KEY ?? '';
const RATE_LIMIT_MS  = 550; // ~1.8 req/sec — safe for the Open Legislation API
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7); // "YYYY-MM"

if (!NY_API_KEY && !DRY_RUN) {
  console.error('NY_SENATE_API_KEY is not set. Add it in Replit Secrets.');
  process.exit(1);
}

// ── Law-type routing ──────────────────────────────────────────────────────────

const LAW_CITATION_PREFIX: Record<string, string> = {
  PEN: 'N.Y. Penal Law',
  VAT: 'N.Y. Veh. & Traf. Law',
  FCA: 'N.Y. Fam. Ct. Act',
  TAX: 'N.Y. Tax Law',
  AGM: 'N.Y. Agric. & Mkts. Law',
  ENV: 'N.Y. Envtl. Conserv. Law',
  EDN: 'N.Y. Educ. Law',
  JUD: 'N.Y. Jud. Law',
  ABC: 'N.Y. Alco. Bev. Cont. Law',
};

/** Charges billed to Vehicle & Traffic Law instead of Penal Law */
const VAT_CHARGE_IDS = new Set([
  'ny-dui-first-offense', 'ny-dui-second-offense', 'ny-dui-third-offense',
  'ny-reckless-driving', 'ny-hit-and-run', 'ny-aggravated-unlicensed-operation',
  'ny-driving-without-insurance', 'ny-expired-registration', 'ny-expired-inspection',
  'ny-defective-vehicle-equipment', 'ny-open-container', 'ny-open-container-violation',
]);

/** Charges billed to Family Court Act */
const FCA_CHARGE_IDS = new Set([
  'ny-juvenile-delinquency-felony', 'ny-juvenile-delinquency-misdemeanor',
]);

/** Other non-PEN law type overrides */
const LAW_TYPE_BY_ID: Record<string, string> = {
  'ny-contempt-of-court':          'JUD',
  'ny-animal-cruelty-misdemeanor': 'AGM',
  'ny-animal-at-large':            'AGM',
  'ny-littering':                  'ENV',
  'ny-hunting-fishing-no-license': 'ENV',
  'ny-tax-fraud':                  'TAX',
  'ny-truancy':                    'EDN',
  'ny-minor-in-possession':        'ABC',
  'ny-illegal-fireworks':          'PEN',
  'ny-criminal-contempt':          'PEN',
};

function getLawId(chargeId: string): string {
  if (VAT_CHARGE_IDS.has(chargeId)) return 'VAT';
  if (FCA_CHARGE_IDS.has(chargeId))  return 'FCA';
  return LAW_TYPE_BY_ID[chargeId] ?? 'PEN';
}

// ── Section overrides ─────────────────────────────────────────────────────────
// For charges whose code field is a placeholder string rather than a real section.
// Provides the correct NY section number and (optionally) a pre-built citation
// string when the API section alone is insufficient (e.g., attempt compound cites).

interface Override {
  lawId: string;
  section: string;
  citation?: string;
  skipApi?: boolean;
}

const SECTION_OVERRIDES: Record<string, Override> = {
  // Attempt / conspiracy / complicity
  'ny-criminal-attempt':       { lawId: 'PEN', section: '110.00' },
  'ny-conspiracy':             { lawId: 'PEN', section: '105.00' },
  'ny-aiding-and-abetting':    { lawId: 'PEN', section: '20.00' },
  'ny-accessory-after-the-fact': { lawId: 'PEN', section: '205.50' },
  'ny-criminal-solicitation':  { lawId: 'PEN', section: '100.00' },
  // Compound attempt citations
  'ny-attempted-murder':        { lawId: 'PEN', section: '110.00', citation: 'N.Y. Penal Law §§ 110.00, 125.25' },
  'ny-attempted-robbery':       { lawId: 'PEN', section: '110.00', citation: 'N.Y. Penal Law §§ 110.00, 160.15' },
  'ny-attempted-sexual-assault':{ lawId: 'PEN', section: '110.00', citation: 'N.Y. Penal Law §§ 110.00, 130.35' },
  // Enhancements
  'ny-gang-enhancement':            { lawId: 'PEN', section: '460.20' },
  'ny-hate-crime-enhancement':      { lawId: 'PEN', section: '485.05' },
  'ny-recidivist-enhancement':      { lawId: 'PEN', section: '70.08' },
  'ny-firearm-in-felony-enhancement': { lawId: 'PEN', section: '265.09' },
  'ny-criminal-sale-of-controlled-substance-near-school-grounds': { lawId: 'PEN', section: '220.44' },
  'ny-rico-organized-crime':          { lawId: 'PEN', section: '460.20' },
  'ny-money-laundering':              { lawId: 'PEN', section: '470.20' },
  // Specific subdivision cites (same section, different theory)
  'ny-felony-murder':           { lawId: 'PEN', section: '125.25', citation: 'N.Y. Penal Law § 125.25(3)' },
  'ny-assault-with-deadly-weapon': { lawId: 'PEN', section: '120.10', citation: 'N.Y. Penal Law § 120.10(1)' },
  // Bank robbery is prosecuted as robbery in NY state courts
  'ny-bank-robbery':            { lawId: 'PEN', section: '160.15' },
  // Juvenile transfer
  'ny-juvenile-transfer-adult-court': { lawId: 'FCA', section: '325.2' },
  'ny-juvenile-firearm-possession':   { lawId: 'PEN', section: '265.05' },
  // Local NYC ordinances — no state API endpoint
  'ny-curfew-violation':  { lawId: 'NYC', section: '10-222', citation: 'N.Y.C. Admin. Code § 10-222', skipApi: true },
  'ny-alcohol-in-park':   { lawId: 'NYC', section: '10-125', citation: 'N.Y.C. Admin. Code § 10-125', skipApi: true },
};

// ── API helpers ───────────────────────────────────────────────────────────────

interface ApiResult {
  ok: boolean;
  title?: string;
  text?: string;
  error?: string;
}

async function fetchNySection(lawId: string, section: string): Promise<ApiResult> {
  const url = `${NY_API_BASE}/laws/${lawId}/${section}?key=${NY_API_KEY}`;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(12_000) });
    if (!resp.ok) {
      return { ok: false, error: `HTTP ${resp.status}` };
    }
    const json = await resp.json() as any;
    if (!json.success) {
      return { ok: false, error: json.message ?? 'API returned success=false' };
    }
    const result = json.result ?? {};
    const title = (result.title ?? result.docLevelId ?? '').trim();
    const text  = (result.text  ?? '').slice(0, 300).replace(/\n/g, ' ').trim();
    return { ok: true, title, text };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err) };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Citation formatter ────────────────────────────────────────────────────────

function formatCitation(lawId: string, section: string, overrideCite?: string): string {
  if (overrideCite) return overrideCite;
  const prefix = LAW_CITATION_PREFIX[lawId] ?? `N.Y. ${lawId} Law`;
  return `${prefix} § ${section}`;
}

function formatSourceUrl(lawId: string, section: string): string {
  if (lawId === 'NYC') return `https://codelibrary.amlegal.com/codes/newyorkcity/latest/NYCadmin/0-0-0-1`;
  return `https://www.nysenate.gov/legislation/laws/${lawId}/${section}`;
}

// ── Overlay helpers ───────────────────────────────────────────────────────────

/** Find the raw text block for a charge ID (from opening key to closing "},") */
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

/**
 * Replace a single field value in an entry block without regex over arbitrary
 * string values (safe against embedded quotes in titles / source strings).
 */
function replaceField(block: string, field: string, newValue: string): string {
  const fieldStart = block.indexOf(`${field}: `);
  if (fieldStart === -1) return block;
  // Find the newline that ends this field's line
  const lineEnd = block.indexOf('\n', fieldStart);
  if (lineEnd === -1) return block;
  const afterField = fieldStart + `${field}: `.length;
  return block.slice(0, afterField) + `${JSON.stringify(newValue)},` + block.slice(lineEnd);
}

/**
 * Upgrade an existing overlay entry from "medium" → "high" in-place.
 * Also updates citation, source, sourceUrl, and lastVerified.
 * Returns the modified source string (unchanged if entry not found or not medium).
 */
function upgradeEntry(
  src: string,
  entry: GeneratedEntry,
): { src: string; upgraded: boolean } {
  const block = findEntryBlock(src, entry.chargeId);
  if (!block) return { src, upgraded: false };
  if (!block.text.includes('confidence: "medium"')) return { src, upgraded: false };

  let updated = block.text;
  updated = updated.replace('confidence: "medium"', 'confidence: "high"');
  updated = updated.replace(/lastVerified: "[^"]*"/, `lastVerified: "${VERIFIED_MONTH}"`);
  updated = replaceField(updated, 'citation', entry.citation);
  updated = replaceField(updated, 'source', entry.source);
  updated = replaceField(updated, 'sourceUrl', entry.sourceUrl);

  return {
    src: src.slice(0, block.start) + updated + src.slice(block.end + 2),
    upgraded: true,
  };
}

/** Build an insertion block for brand-new entries (those absent from the overlay). */
function buildInsertBlock(entries: GeneratedEntry[]): string {
  const lines: string[] = [
    '',
    `  // ── NY: Open Legislation API verified ${VERIFIED_MONTH} ──────────────────────────────`,
  ];
  for (const e of entries) {
    lines.push(`  "${e.chargeId}": {`);
    lines.push(`    citation: ${JSON.stringify(e.citation)},`);
    lines.push(`    confidence: ${JSON.stringify(e.confidence)},`);
    lines.push(`    lastVerified: "${VERIFIED_MONTH}",`);
    lines.push(`    source: ${JSON.stringify(e.source)},`);
    lines.push(`    sourceUrl: ${JSON.stringify(e.sourceUrl)},`);
    lines.push(`  },`);
  }
  return lines.join('\n');
}

/**
 * Apply verified entries to the overlay:
 *  - Existing medium entries that the API confirmed → upgrade to high
 *  - Entries not yet in the overlay → insert
 *  - Existing high entries → leave alone
 */
function applyToOverlay(overlayPath: string, entries: GeneratedEntry[]): void {
  let src = fs.readFileSync(overlayPath, 'utf-8');

  let upgraded = 0;
  let inserted = 0;
  let alreadyHigh = 0;
  let apiFailed = 0;
  const toInsert: GeneratedEntry[] = [];

  for (const entry of entries) {
    if (entry.skip || entry.apiStatus === 'dry_run' || entry.apiStatus === 'local_ordinance') {
      continue;
    }

    const block = findEntryBlock(src, entry.chargeId);

    if (block) {
      if (entry.apiStatus === 'verified') {
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
        // API failed — leave at existing confidence
        apiFailed++;
        console.log(`  [api failed, kept] ${entry.chargeId}`);
      }
    } else {
      // Not in overlay yet — queue for insertion
      toInsert.push(entry);
    }
  }

  // Insert truly new entries at the bottom
  if (toInsert.length > 0) {
    const block = buildInsertBlock(toInsert);
    const insertAt = src.lastIndexOf('\n};');
    if (insertAt === -1) throw new Error('Could not find closing }; in overlay file');
    src = src.slice(0, insertAt) + block + '\n};';
    inserted = toInsert.length;
    for (const e of toInsert) {
      console.log(`  [inserted ${e.confidence}]      ${e.chargeId}`);
    }
  }

  fs.writeFileSync(overlayPath, src, 'utf-8');
  console.log(`\n  Upgraded to high  : ${upgraded}`);
  console.log(`  Newly inserted    : ${inserted}`);
  console.log(`  Already high      : ${alreadyHigh}`);
  console.log(`  API failed (kept) : ${apiFailed}`);
}

// ── Output types ──────────────────────────────────────────────────────────────

interface GeneratedEntry {
  chargeId: string;
  chargeName: string;
  lawId: string;
  section: string;
  citation: string;
  confidence: 'high' | 'medium';
  source: string;
  sourceUrl: string;
  apiStatus: string;
  skip?: boolean;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const nyCharges = criminalCharges.filter(c => c.jurisdiction === 'NY');

  console.log(`\nNY Citation Verifier`);
  console.log(`────────────────────────────────`);
  console.log(`Charges to process : ${nyCharges.length}`);
  console.log(`Mode               : ${DRY_RUN ? 'DRY RUN' : APPLY ? 'APPLY to overlay' : 'Output JSON'}`);
  if (!DRY_RUN) console.log(`API key            : ${NY_API_KEY ? '✓ set' : '✗ MISSING'}`);
  console.log('');

  const entries: GeneratedEntry[] = [];
  let apiOk = 0, apiFail = 0, skipped = 0;

  for (let i = 0; i < nyCharges.length; i++) {
    const charge = nyCharges[i];
    const cid    = charge.id;
    const code   = (charge as any).code as string ?? '';

    // Determine law ID and section
    const override = SECTION_OVERRIDES[cid];
    const lawId   = override?.lawId   ?? getLawId(cid);
    const section = override?.section ?? code;

    // Detect placeholder codes (non-numeric, non-standard)
    const isPlaceholder = !override && (
      /[a-z]{2,}\s+/i.test(code) ||
      code.startsWith('MPC') ||
      code.toLowerCase().includes('statute') ||
      code.toLowerCase().includes('court act') ||
      code === ''
    );

    if (isPlaceholder) {
      console.log(`  [SKIP] ${cid} — placeholder code: "${code}"`);
      skipped++;
      continue;
    }

    // NYC local ordinances — add statically, no API
    if (override?.skipApi || lawId === 'NYC') {
      const citation  = override?.citation ?? `N.Y.C. Admin. Code § ${section}`;
      const sourceUrl = formatSourceUrl('NYC', section);
      console.log(`  [LOCAL] ${cid} → ${citation}`);
      entries.push({
        chargeId: cid,
        chargeName: charge.name,
        lawId: 'NYC',
        section,
        citation,
        confidence: 'medium',
        source: `NYC Admin Code § ${section} — local ordinance; verify with NYC Law Dept`,
        sourceUrl,
        apiStatus: 'local_ordinance',
      });
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      const citation = formatCitation(lawId, section, override?.citation);
      console.log(`  [DRY]  ${cid} → ${citation} [${NY_API_BASE}/laws/${lawId}/${section}]`);
      entries.push({
        chargeId: cid,
        chargeName: charge.name,
        lawId,
        section,
        citation,
        confidence: 'medium',
        source: `dry-run — not verified`,
        sourceUrl: formatSourceUrl(lawId, section),
        apiStatus: 'dry_run',
      });
      continue;
    }

    // Call the API
    if (i > 0) await sleep(RATE_LIMIT_MS);

    const result = await fetchNySection(lawId, section);
    const citation = formatCitation(lawId, section, override?.citation);
    const sourceUrl = formatSourceUrl(lawId, section);

    if (result.ok && result.title) {
      const sourceNote = `NY Open Legislation API — ${LAW_CITATION_PREFIX[lawId] ?? lawId} § ${section}: "${result.title}"`;
      console.log(`  [OK]   ${cid} → ${citation}  "${result.title}"`);
      entries.push({
        chargeId: cid,
        chargeName: charge.name,
        lawId,
        section,
        citation,
        confidence: 'high',
        source: sourceNote,
        sourceUrl,
        apiStatus: 'verified',
      });
      apiOk++;
    } else {
      const errNote = `NY Open Legislation API — ${result.error ?? 'no title returned'} — needs manual review`;
      console.log(`  [FAIL] ${cid} → ${citation}  (${result.error ?? 'no title'})`);
      entries.push({
        chargeId: cid,
        chargeName: charge.name,
        lawId,
        section,
        citation,
        confidence: 'medium',
        source: errNote,
        sourceUrl,
        apiStatus: 'api_error',
      });
      apiFail++;
    }
  }

  // ── Output ──
  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputJson = {
    state: 'NY',
    generatedAt: new Date().toISOString(),
    source: 'NY Open Legislation API (legislation.nysenate.gov)',
    stats: {
      total: nyCharges.length,
      verified: apiOk,
      apiFailed: apiFail,
      skipped,
    },
    entries,
  };

  const jsonPath = path.join(outputDir, 'ny-citations-output.json');
  fs.writeFileSync(jsonPath, JSON.stringify(outputJson, null, 2));
  console.log(`\nOutput written to: ${jsonPath}`);

  // ── Apply to overlay if requested ──
  if (APPLY && !DRY_RUN) {
    const overlayPath = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
    console.log('\nApplying to overlay...');
    applyToOverlay(overlayPath, entries);
    console.log(`✓ Overlay updated: ${overlayPath}`);
  }

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  API verified (confidence: high)   : ${apiOk}`);
  console.log(`  API failed   (confidence: medium)  : ${apiFail}`);
  console.log(`  Skipped (placeholder / local)      : ${skipped}`);
  console.log(`  Total processed                    : ${entries.length}`);
  if (!APPLY) {
    console.log(`\nTo write entries into the overlay, re-run with --apply`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
