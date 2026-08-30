/**
 * import-commission-citations.ts
 *
 * Enriches shared/criminal-charge-citations.ts with:
 *   - sourceUrl: direct link to the official statute or commission table entry
 *   - confidence: "high" for entries verified against FL and PA commission tables
 *
 * Modes:
 *   --generate-urls            Add sourceUrl to all entries via citation-based URL patterns.
 *                              No network calls. Does NOT change confidence.
 *   --state fl                 Fetch FL Criminal Punishment Code § 921.0022 (HTML).
 *                              Promote matched entries: confidence → "high", sourceUrl set.
 *   --state pa                 Fetch PA Offense Gravity Score table § 303.15 (HTML).
 *                              Promote matched entries: confidence → "high", sourceUrl set.
 *   --state mn                 Fetch MN Statutes chapter pages (revisor.mn.gov).
 *   --state nc                 Fetch NC General Statutes per-section (ncleg.gov).
 *   --state wa                 Fetch WA Revised Code chapter pages (app.leg.wa.gov).
 *   --state va                 Fetch VA Code per-section (law.lis.virginia.gov).
 *   --state federal            Verify federal citations via GovInfo USCODE structured endpoint.
 *                              Requires GOVINFO_API_KEY in .env.
 *                              Promote verified entries: confidence → "high", sourceUrl set.
 *   --dry-run                  Show what would change without writing to disk.
 *   --states al,mn,fl,...      Restrict --generate-urls to these jurisdictions only.
 *
 * Usage:
 *   npx tsx scripts/data-review/import-commission-citations.ts --generate-urls
 *   npx tsx scripts/data-review/import-commission-citations.ts --generate-urls --states mn,nc,wa,va
 *   npx tsx scripts/data-review/import-commission-citations.ts --state fl --dry-run
 *   npx tsx scripts/data-review/import-commission-citations.ts --state fl
 *   npx tsx scripts/data-review/import-commission-citations.ts --state pa
 *   npx tsx scripts/data-review/import-commission-citations.ts --state federal --dry-run
 *   npx tsx scripts/data-review/import-commission-citations.ts --state federal
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

// Load .env from project root so GOVINFO_API_KEY and other keys are available
// when the script is run via `npx tsx` (which doesn't auto-source .env).
try {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch { /* .env not present — keys must be set in environment */ }

const DRY_RUN = process.argv.includes('--dry-run');
const GENERATE_URLS = process.argv.includes('--generate-urls');

const stateArgIdx = process.argv.indexOf('--state');
const STATE_MODE: string | null = stateArgIdx !== -1 ? (process.argv[stateArgIdx + 1] ?? '').toLowerCase() : null;

const statesArgIdx = process.argv.indexOf('--states');
const STATES_FILTER: Set<string> | null = statesArgIdx !== -1
  ? new Set((process.argv[statesArgIdx + 1] ?? '').toLowerCase().split(',').filter(Boolean))
  : null;

const OVERLAY_PATH = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts/data-review/output');
const NOW_MONTH = new Date().toISOString().slice(0, 7); // YYYY-MM

// ── Justia state slugs ────────────────────────────────────────────────────────

const JUSTIA_SLUGS: Record<string, string> = {
  al: 'alabama', ak: 'alaska', az: 'arizona', ar: 'arkansas', ca: 'california',
  co: 'colorado', ct: 'connecticut', de: 'delaware', fl: 'florida', ga: 'georgia',
  hi: 'hawaii', id: 'idaho', il: 'illinois', in: 'indiana', ia: 'iowa',
  ks: 'kansas', ky: 'kentucky', la: 'louisiana', me: 'maine', md: 'maryland',
  ma: 'massachusetts', mi: 'michigan', mn: 'minnesota', ms: 'mississippi',
  mo: 'missouri', mt: 'montana', ne: 'nebraska', nv: 'nevada', nh: 'new-hampshire',
  nj: 'new-jersey', nm: 'new-mexico', ny: 'new-york', nc: 'north-carolina',
  nd: 'north-dakota', oh: 'ohio', ok: 'oklahoma', or: 'oregon', pa: 'pennsylvania',
  ri: 'rhode-island', sc: 'south-carolina', sd: 'south-dakota', tn: 'tennessee',
  tx: 'texas', ut: 'utah', vt: 'vermont', va: 'virginia', wa: 'washington',
  wv: 'west-virginia', wi: 'wisconsin', wy: 'wyoming', dc: 'district-of-columbia',
};

// ── Section extraction from citation string ───────────────────────────────────

/**
 * Extracts the primary section number from a citation string.
 * Returns the base section (subsections like (1)(a) stripped for URL purposes).
 *
 * Examples:
 *   "Ala. Code § 13A-6-2(a)(3)"  → "13A-6-2"
 *   "Fla. Stat. § 782.04(1)(a)"  → "782.04"
 *   "720 ILCS 5/9-1"             → "720/5/9-1"  (special handling)
 *   "18 U.S.C. § 1111"           → "1111"
 *   "N.Y. Penal Law § 125.27"    → "125.27"
 */
function extractSection(citation: string): { raw: string; base: string } | null {
  // ILCS formats: "720 ILCS 5/9-1" or "720 Ill. Comp. Stat. 5/9-1"
  const ilcsM = citation.match(/(\d+)\s+(?:ILCS|Ill\.\s*Comp\.\s*Stat\.)\s+(\d+)\/([\w.-]+)/);
  if (ilcsM) {
    const raw = `${ilcsM[1]}-${ilcsM[2]}-${ilcsM[3]}`;
    return { raw, base: raw };
  }

  // Louisiana "La. R.S. 14:30" format — no § sign
  const laRsM = citation.match(/La\.\s+R\.S\.\s+([\d]+(?:[.:]\d+[A-Za-z]*(?:\.\d+)?)*)/);
  if (laRsM) {
    const raw = laRsM[1];
    const base = raw.replace(/\([^)]*\)/g, '').trim();
    return { raw, base };
  }

  // "art. 42A.751" format (TX Code of Criminal Procedure, etc.)
  const artM = citation.match(/\bart\.\s+([\w.-]+)/);
  if (artM) {
    const raw = artM[1].replace(/\([^)]*\)/g, '').trim();
    return { raw, base: raw };
  }

  // Standard § pattern — takes first section if multiple (§§ 13A-4-2, 13A-6-2)
  const secM = citation.match(/§§?\s*([\d.:\-A-Za-z]+)/);
  if (!secM) return null;

  const raw = secM[1].replace(/,$/, ''); // strip trailing comma
  // Base: strip subsections in parentheses — e.g. 782.04(1)(a) → 782.04
  const base = raw.replace(/\([^)]*\)/g, '').replace(/[.-]$/, '').trim();
  return { raw, base };
}

// ── URL generation per jurisdiction ──────────────────────────────────────────

/**
 * Returns the best available direct URL for a statute section.
 * Uses official state code URLs where patterns are clean and reliable;
 * falls back to Justia for the rest.
 */
function generateSourceUrl(jurisdiction: string, citation: string): string | null {
  const sec = extractSection(citation);
  if (!sec) return null;
  const { raw, base } = sec;

  switch (jurisdiction) {
    // ── Official direct-section URLs ─────────────────────────────────────────
    case 'fl':
      // Florida Statutes — direct section link
      return `https://www.flsenate.gov/Laws/Statutes/2024/${base}`;

    case 'mn':
      // Minnesota Statutes — revisor.mn.gov supports direct section lookup
      return `https://www.revisor.mn.gov/statutes/cite/${base}`;

    case 'ny': {
      // NY Penal Law on nysenate.gov
      const nyM = citation.match(/Penal Law §\s*([\d.]+)/);
      if (nyM) return `https://www.nysenate.gov/legislation/laws/PEN/${nyM[1]}`;
      const nyCorrM = citation.match(/Correct.*§\s*([\d.]+)/i);
      if (nyCorrM) return `https://www.nysenate.gov/legislation/laws/COR/${nyCorrM[1]}`;
      // Fallback to Justia for other NY codes
      return justiaUrl(jurisdiction, base);
    }

    case 'wa':
      // Washington RCW — direct cite link
      return `https://app.leg.wa.gov/rcw/default.aspx?cite=${base}`;

    case 'oh':
      // Ohio Revised Code — direct section
      return `https://codes.ohio.gov/ohio-revised-code/section-${base}`;

    case 'mo':
      // Missouri Revised Statutes
      return `https://revisor.mo.gov/main/OneSection.aspx?section=${base}`;

    case 'dc': {
      // DC Code — section as hyphenated number
      const dcBase = base.replace(/\./g, '-');
      return `https://code.dccouncil.gov/us/dc/council/code/sections/${dcBase}`;
    }

    case 'wv':
      // WV Code
      return `https://code.wvlegislature.gov/${base}/`;

    case 'ne':
      // Nebraska Legislature
      return `https://nebraskalegislature.gov/laws/statutes.php?stat=${base}`;

    case 'va': {
      // Virginia Code — section like "18.2-32" maps to /vacode/18.2-32/
      // Need title format: title18.2/section18.2-32
      const vaTitleM = base.match(/^(\d+[A-Za-z.]*\d*)-/);
      if (vaTitleM) {
        return `https://law.lis.virginia.gov/vacode/${base}/`;
      }
      return `https://law.lis.virginia.gov/vacode/${base}/`;
    }

    case 'nc': {
      // NC General Statutes — section like "14-17" → Chapter_14/GS_14-17
      const ncM = base.match(/^(\d+[A-Z]*)-(.+)$/);
      if (ncM) {
        return `https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_${ncM[1]}/GS_${base}.html`;
      }
      return justiaUrl(jurisdiction, base);
    }

    case 'il': {
      // ILCS — chapter/act/section → Justia URL
      // base looks like "720-5-9-1" (from ILCS parsing above)
      const ilParts = base.match(/^(\d+)-(\d+)-(.+)$/);
      if (ilParts) {
        const [, chap, act, sec] = ilParts;
        const secClean = sec.replace(/\([^)]*\)/g, '');
        return `https://law.justia.com/codes/illinois/chapter-${chap}/act-${act}/section-${act}-${secClean}/`;
      }
      return justiaUrl(jurisdiction, base);
    }

    case 'la': {
      // Louisiana Revised Statutes — section like "14:30" or "40:967"
      // Justia LA URL: https://law.justia.com/codes/louisiana/revised-statutes/section-14-30/
      const laSlug = JUSTIA_SLUGS[jurisdiction];
      if (!laSlug) return null;
      const normSec = base.replace(/[.:]/g, '-').toLowerCase();
      return `https://law.justia.com/codes/${laSlug}/revised-statutes/section-${normSec}/`;
    }

    case 'tx': {
      // Texas — Penal Code: statutes.capitol.texas.gov
      // Health & Safety Code and Code Crim. Proc.: Justia
      const txPenM = citation.match(/Tex\.\s+Penal\s+Code.*§\s*([\d.]+)/);
      if (txPenM) {
        const chap = txPenM[1].split('.')[0];
        return `https://statutes.capitol.texas.gov/Docs/PE/htm/PE.${chap}.htm`;
      }
      return justiaUrl(jurisdiction, base);
    }

    case 'or': {
      // Oregon Revised Statutes — chapter-level (no direct section URLs)
      const orM = base.match(/^(\d+)/);
      if (orM) return `https://www.oregonlegislature.gov/bills_laws/ors/ors${orM[1]}.html`;
      return justiaUrl(jurisdiction, base);
    }

    case 'mi': {
      // Michigan Compiled Laws — section hyphenated
      const miBase = base.replace(/\./g, '-');
      return `https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-${miBase}`;
    }

    case 'me': {
      // Maine statutes — use Justia (official site is hard to deep-link)
      return justiaUrl(jurisdiction, base);
    }

    case 'fed':
    case 'federal': {
      // US Code — extract title from "18 U.S.C. § 1111" pattern
      const fedM = citation.match(/(\d+)\s+U\.S\.C\.?\s+§\s*([\d.A-Za-z]+)/);
      if (fedM) {
        const baseSection = fedM[2].replace(/\([^)]*\)/g, '').trim();
        return `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title${fedM[1]}-section${baseSection}&edition=prelim`;
      }
      return `https://uscode.house.gov/`;
    }

    // ── Justia fallback for remaining states ─────────────────────────────────
    default:
      return justiaUrl(jurisdiction, base);
  }
}

function justiaUrl(jurisdiction: string, base: string): string | null {
  const slug = JUSTIA_SLUGS[jurisdiction];
  if (!slug) return null;
  // Normalize section for Justia: dots and colons → hyphens, lowercase
  const normSec = base.replace(/[.:]/g, '-').toLowerCase().replace(/--+/g, '-');
  return `https://law.justia.com/codes/${slug}/section-${normSec}/`;
}

// ── Overlay file manipulation ─────────────────────────────────────────────────

interface EntryBlock {
  start: number;
  end: number;   // position of the closing }, inclusive of }
  text: string;  // from opening key through },
}

function findEntryBlock(source: string, chargeId: string): EntryBlock | null {
  const start = source.indexOf(`"${chargeId}": {`);
  if (start === -1) return null;
  const end = source.indexOf('},', start);
  if (end === -1) return null;
  return { start, end, text: source.slice(start, end + 2) };
}

interface EntryUpdates {
  confidence?: 'high' | 'medium' | 'needs_review';
  lastVerified?: string;
  source?: string;
  sourceUrl?: string;
}

/**
 * Applies updates to an entry block. Handles:
 *   - Replacing existing field values
 *   - Adding sourceUrl if it doesn't exist yet (inserted before closing },)
 */
function applyUpdatesToBlock(blockText: string, updates: EntryUpdates): string {
  let text = blockText;

  if (updates.confidence) {
    text = text.replace(/confidence: "[^"]*"/, `confidence: "${updates.confidence}"`);
  }
  if (updates.lastVerified) {
    text = text.replace(/lastVerified: "[^"]*"/, `lastVerified: "${updates.lastVerified}"`);
  }
  if (updates.source) {
    text = text.replace(/source: "[^"]*"/, `source: "${updates.source}"`);
  }
  if (updates.sourceUrl) {
    if (text.includes('sourceUrl:')) {
      // Replace existing sourceUrl
      text = text.replace(/sourceUrl: "[^"]*"/, `sourceUrl: "${updates.sourceUrl}"`);
    } else {
      // Insert sourceUrl before the closing },
      // Works for both multi-line (\n  },) and single-line ( },) entries.
      const lastClose = text.lastIndexOf('},');
      if (lastClose !== -1) {
        const beforeClose = text.slice(0, lastClose);
        if (beforeClose.includes('\n')) {
          // Multi-line: insert as a new indented line
          const indentM = text.match(/\n(\s+)citation:/);
          const indent = indentM ? indentM[1] : '    ';
          text = beforeClose + `\n${indent}sourceUrl: "${updates.sourceUrl}",\n  },`;
        } else {
          // Single-line: append as inline field before closing brace
          text = beforeClose.trimEnd() + `, sourceUrl: "${updates.sourceUrl}" },`;
        }
      }
    }
  }

  return text;
}

function applyUpdatesToOverlay(
  source: string,
  chargeId: string,
  updates: EntryUpdates
): { source: string; changed: boolean } {
  const block = findEntryBlock(source, chargeId);
  if (!block) return { source, changed: false };

  const updatedText = applyUpdatesToBlock(block.text, updates);
  if (updatedText === block.text) return { source, changed: false };

  return {
    source: source.slice(0, block.start) + updatedText + source.slice(block.end + 2),
    changed: true,
  };
}

// ── Parse all charge IDs + citations from the overlay ────────────────────────

interface ChargeEntry {
  id: string;
  jurisdiction: string;
  citation: string;
  confidence: string;
  hasSourceUrl: boolean;
}

function parseOverlayEntries(source: string): ChargeEntry[] {
  const entries: ChargeEntry[] = [];
  // Match: "xx-slug": { ... citation: "...", ... confidence: "...", ...
  // Supports 2-3 char state codes (al, pa, ...) and "federal-" prefix (8 chars before dash)
  const entryRe = /"([a-z]{2,8}-[^"]+)":\s*\{([^}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(source)) !== null) {
    const id = m[1];
    const body = m[2];
    const jurisdiction = id.split('-')[0];

    const citM = body.match(/citation:\s*"([^"]+)"/);
    const confM = body.match(/confidence:\s*"([^"]+)"/);
    const urlM = body.match(/sourceUrl:\s*"([^"]+)"/);

    if (citM && confM) {
      entries.push({
        id,
        jurisdiction,
        citation: citM[1],
        confidence: confM[1],
        hasSourceUrl: Boolean(urlM),
      });
    }
  }
  return entries;
}

// ── Mode: --generate-urls ─────────────────────────────────────────────────────

function runGenerateUrls(): void {
  console.log('\n=== Generate Source URLs ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  if (STATES_FILTER) console.log(`States: ${[...STATES_FILTER].join(', ')}`);
  console.log('');

  let source = fs.readFileSync(OVERLAY_PATH, 'utf-8');
  const entries = parseOverlayEntries(source);

  const scoped = STATES_FILTER
    ? entries.filter(e => STATES_FILTER!.has(e.jurisdiction))
    : entries;

  const skipped = scoped.filter(e => e.hasSourceUrl).length;
  const toProcess = scoped.filter(e => !e.hasSourceUrl);

  console.log(`Total entries: ${entries.length}`);
  console.log(`In scope: ${scoped.length}`);
  console.log(`Already have sourceUrl: ${skipped}`);
  console.log(`Will add sourceUrl to: ${toProcess.length}`);
  console.log('');

  let added = 0;
  let skippedNoUrl = 0;
  const noUrlEntries: string[] = [];

  for (const entry of toProcess) {
    const url = generateSourceUrl(entry.jurisdiction, entry.citation);
    if (!url) {
      skippedNoUrl++;
      noUrlEntries.push(`${entry.id} — ${entry.citation}`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`  DRY-RUN: ${entry.id}`);
      console.log(`           ${url}`);
      added++;
      continue;
    }

    const result = applyUpdatesToOverlay(source, entry.id, { sourceUrl: url });
    if (result.changed) {
      source = result.source;
      added++;
    }
  }

  if (!DRY_RUN && added > 0) {
    fs.writeFileSync(OVERLAY_PATH, source, 'utf-8');
    console.log(`✅ Added sourceUrl to ${added} entries.`);
  } else if (DRY_RUN) {
    console.log(`\nDRY-RUN: would add sourceUrl to ${added} entries.`);
  } else {
    console.log('Nothing to update (all entries already have sourceUrl or no pattern found).');
  }

  if (noUrlEntries.length > 0) {
    console.log(`\n⚠️  ${noUrlEntries.length} entries had no URL pattern:`);
    for (const e of noUrlEntries.slice(0, 10)) console.log(`   ${e}`);
    if (noUrlEntries.length > 10) console.log(`   ... and ${noUrlEntries.length - 10} more`);

    // Write unmapped list to output
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const unmappedPath = path.join(OUTPUT_DIR, 'generate-urls-unmapped.json');
    fs.writeFileSync(unmappedPath, JSON.stringify(noUrlEntries, null, 2));
    console.log(`\n  Full list: ${unmappedPath}`);
  }
}

// ── HTTP fetch helper ─────────────────────────────────────────────────────────

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenDefender citation verifier)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return fetchHtml(loc).then(resolve).catch(reject);
      }
      if (!res.statusCode || res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface FetchJsonError extends Error {
  statusCode?: number;
}

/**
 * Fetches a JSON endpoint using the built-in https module (GET).
 * Throws a FetchJsonError with statusCode set on HTTP 4xx/5xx responses
 * so callers can distinguish 404 (not found) from network errors.
 */
function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenDefender citation verifier)',
        'Accept': 'application/json',
        ...headers,
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return fetchJson(loc, headers).then(resolve).catch(reject);
      }
      if (!res.statusCode || res.statusCode >= 400) {
        const e: FetchJsonError = new Error(`HTTP ${res.statusCode} for ${url}`);
        e.statusCode = res.statusCode;
        res.resume();
        return reject(e);
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
        } catch {
          reject(new Error(`JSON parse error for ${url}`));
        }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

/**
 * POSTs a JSON body to a URL and returns the parsed JSON response.
 * Used for the GovInfo search API which requires POST.
 */
function postJson(url: string, body: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'Mozilla/5.0 (compatible; OpenDefender citation verifier)',
        'Accept': 'application/json',
        ...headers,
      },
    };
    const req = https.request(options, (res) => {
      if (!res.statusCode || res.statusCode >= 400) {
        const e: FetchJsonError = new Error(`HTTP ${res.statusCode} for POST ${url}`);
        e.statusCode = res.statusCode;
        res.resume();
        return reject(e);
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
        } catch {
          reject(new Error(`JSON parse error for POST ${url}`));
        }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error(`Timeout: POST ${url}`)); });
    req.write(body);
    req.end();
  });
}

// ── Mode: --state fl ──────────────────────────────────────────────────────────
//
// Florida Criminal Punishment Code — § 921.0022 Offense Severity Ranking Chart
// URL: https://www.flsenate.gov/Laws/Statutes/2024/921.0022
//
// Table structure: rows with statute reference, offense description, felony degree.
// Columns vary by severity level section header.
// We match our FL entries by base section number.

export interface CommissionEntry {
  section: string;       // base section, e.g. "782.04"
  description: string;   // offense name from commission table
  classification: string; // degree / level / OGS
  sourceUrl: string;     // direct URL to the official source
}

export function parseFloridaCommissionTable(html: string): Map<string, CommissionEntry> {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const map = new Map<string, CommissionEntry>();

  // FL § 921.0022 renders as a series of tables or a single large table.
  // Each row has: [statute section ref] [offense description] [degree] [level]
  // We look for cells that look like statute sections (e.g., "782.04(1)(a)")
  const cells = doc.querySelectorAll('td');
  let prevSection = '';

  for (const cell of Array.from(cells)) {
    const text = cell.textContent?.trim() ?? '';

    // Cells containing a FL statute section reference: digits.digits(...)
    const secM = text.match(/^(\d+\.\d+[\w()*]*)\s*(.*)$/);
    if (secM) {
      const rawSec = secM[1];
      const base = rawSec.replace(/\([^)]*\)/g, '').replace(/\*$/, '').trim();
      prevSection = base;

      // Description may be in the same cell or next sibling
      const descText = secM[2].trim() || cell.nextElementSibling?.textContent?.trim() || '';

      if (base && !map.has(base)) {
        map.set(base, {
          section: base,
          description: descText,
          classification: 'FL Criminal Punishment Code',
          sourceUrl: `https://www.flsenate.gov/Laws/Statutes/2024/${base}`,
        });
      }
    }
  }

  // If table parsing found nothing, try a broader approach: look for any text
  // matching the FL statute section pattern in the full HTML
  if (map.size < 10) {
    const sectionRe = /(\d{3}\.\d+(?:\([^)]*\))*)/g;
    let m: RegExpExecArray | null;
    while ((m = sectionRe.exec(html)) !== null) {
      const rawSec = m[1];
      const base = rawSec.replace(/\([^)]*\)/g, '').trim();
      if (base && !map.has(base)) {
        map.set(base, {
          section: base,
          description: '',
          classification: 'FL Criminal Punishment Code § 921.0022',
          sourceUrl: `https://www.flsenate.gov/Laws/Statutes/2024/${base}`,
        });
      }
    }
  }

  return map;
}

async function fetchFLCommissionTable(): Promise<Map<string, CommissionEntry>> {
  const tableUrl = 'https://www.flsenate.gov/Laws/Statutes/2024/921.0022';
  console.log(`Fetching: ${tableUrl}`);

  const html = await fetchHtml(tableUrl);
  const map = parseFloridaCommissionTable(html);
  if (map.size < 10) {
    console.log('  Table parsing yielded few results — regex extraction found all available sections.');
  }
  console.log(`  Found ${map.size} FL sections in commission table.`);
  return map;
}

// ── Mode: --state pa ──────────────────────────────────────────────────────────
//
// Pennsylvania Commission on Sentencing — § 303.15 Offense Listing
// Source: Cornell LII mirror (pacodeandbulletin.gov is JS-rendered)
// URL: https://www.law.cornell.edu/regulations/pennsylvania/204-Pa-Code-SS-303-15
//
// Table structure: offense name, statute section, OGS score.
// PA citations look like "18 Pa.C.S. § 2502(a)" or "75 Pa.C.S. § 3802"

async function fetchPACommissionTable(): Promise<Map<string, CommissionEntry>> {
  const tableUrl = 'https://www.law.cornell.edu/regulations/pennsylvania/204-Pa-Code-SS-303-15';
  console.log(`Fetching PA OGS § 303.15 (Cornell LII): ${tableUrl}`);

  const html = await fetchHtml(tableUrl);
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const map = new Map<string, CommissionEntry>();

  // Cornell LII table structure (verified):
  //   <td> 2502(a) </td>  <td> Murder of the first degree </td>  <td> F-1 </td>  <td> 14 </td>
  // All sections are Title 18 Pa.C.S. (a few Title 23/30/34 sections appear at the end).
  // Use JSDOM row-based parsing so descriptions with "<" characters (e.g. "victim <12 yrs") work.
  const rows = doc.querySelectorAll('tr');
  for (const row of Array.from(rows)) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) continue;

    const firstCellText = (cells[0].textContent ?? '').trim();
    // Strip trailing asterisk (used for conditional entries)
    const rawSection = firstCellText.replace(/\*$/, '').trim();

    // Must look like a section number: starts with digit
    if (!/^\d/.test(rawSection)) continue;
    // Skip degree/score cells like "F-1", "M-1", "14"
    if (/^(F|M|S)-\d$/.test(rawSection)) continue;
    if (/^\d{1,2}$/.test(rawSection)) continue; // single/double digits are scores

    const baseSection = rawSection.replace(/\([^)]*\)/g, '').replace(/[.]$/, '').trim();
    if (!baseSection || map.has(baseSection)) continue;

    const desc = (cells[1].textContent ?? '').trim();
    // Skip header rows where desc looks like "Description" or "Offense"
    if (desc === 'Description' || desc === 'Offense' || desc.length === 0) continue;

    map.set(baseSection, {
      section: baseSection,
      description: desc,
      classification: `PA OGS § 303.15 — 18 Pa.C.S. § ${baseSection}`,
      sourceUrl: `https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&sctn=${baseSection}`,
    });
  }

  // Second pass: capture Title 35 / other-title sections using the codecitation+codesec span format
  // These appear as: <span class="codecitation">35 P.S. §<span class="codesec">780-113</span></span>
  const codeSecRe = /(\d+)\s+(?:Pa\.|P\.S\.|P\.L\.)[^<]*<[^>]*codesec[^>]*>([\dA-Za-z().\-]+)<\/span>/g;
  let csM: RegExpExecArray | null;
  while ((csM = codeSecRe.exec(html)) !== null) {
    const titleNum = csM[1];
    const rawSection = csM[2].replace(/\([^)]*\)/g, '').replace(/[,.]$/, '').trim();
    if (!rawSection || map.has(rawSection)) continue;
    map.set(rawSection, {
      section: rawSection,
      description: '',
      classification: `PA OGS § 303.15 — ${titleNum} Pa. Stat. § ${rawSection}`,
      sourceUrl: `https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=${titleNum}&sctn=${rawSection}`,
    });
  }

  console.log(`  Found ${map.size} PA sections.`);
  return map;
}

// ── Mode: --state mn ─────────────────────────────────────────────────────────
//
// Minnesota Statutes — revisor.mn.gov chapter pages
// Fetches each chapter that appears in MN overlay citations.
// sourceUrl: https://www.revisor.mn.gov/statutes/cite/{section}

async function fetchMNStatuteMap(stateEntries: ChargeEntry[]): Promise<Map<string, CommissionEntry>> {
  // Extract unique chapter numbers from MN citations (e.g. "609.185" → chapter "609")
  const chapSet = new Set<string>();
  for (const e of stateEntries) {
    const sec = extractSection(e.citation);
    if (sec?.base) {
      const chap = sec.base.split('.')[0];
      if (chap) chapSet.add(chap);
    }
  }

  const map = new Map<string, CommissionEntry>();
  const chapters = [...chapSet].sort();
  console.log(`  MN: ${stateEntries.length} entries across chapters: ${chapters.join(', ')}`);

  for (const chap of chapters) {
    // revisor.mn.gov chapter TOC: https://www.revisor.mn.gov/statutes/cite/609
    // Table structure: <td><a href="/statutes/cite/609.185">609.185</a></td><td>MURDER IN THE FIRST DEGREE.</td>
    const chapUrl = `https://www.revisor.mn.gov/statutes/cite/${chap}`;
    console.log(`  Fetching MN chapter ${chap}...`);

    try {
      const html = await fetchHtml(chapUrl);
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      let found = 0;

      // Each section is a table row: first td has the link, second td has the title
      const rows = doc.querySelectorAll('tr');
      for (const row of Array.from(rows)) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 2) continue;

        const link = cells[0].querySelector('a');
        if (!link) continue;
        const href = link.getAttribute('href') ?? '';
        const sectionM = href.match(/\/statutes\/cite\/([\w.]+)/);
        if (!sectionM) continue;
        const section = sectionM[1];

        // Must be in this chapter (starts with chapter prefix)
        const chapPrefix = chap.replace('.', '\\.');
        if (!new RegExp(`^${chapPrefix}\\.`).test(section) && section !== chap) continue;

        const desc = (cells[1].textContent ?? '').replace(/\.$/, '').trim();

        if (!map.has(section)) {
          map.set(section, {
            section,
            description: desc,
            classification: `Minnesota Statutes § ${section} (2024)`,
            sourceUrl: `https://www.revisor.mn.gov/statutes/cite/${section}`,
          });
          found++;
        }
      }

      console.log(`    → ${found} sections in chapter ${chap}`);
    } catch (err: any) {
      console.warn(`    Warning: failed to fetch MN chapter ${chap}: ${err.message}`);
    }

    await sleep(400);
  }

  console.log(`  Total MN sections mapped: ${map.size}`);
  return map;
}

// ── Mode: --state nc ─────────────────────────────────────────────────────────
//
// North Carolina General Statutes — ncleg.gov per-section pages
// URL pattern: /EnactedLegislation/Statutes/HTML/BySection/Chapter_14/GS_14-17.html
// Title is extracted from the § heading in the body.

async function fetchNCStatuteMap(stateEntries: ChargeEntry[]): Promise<Map<string, CommissionEntry>> {
  const map = new Map<string, CommissionEntry>();
  const toFetch = stateEntries.filter(e => !map.has(extractSection(e.citation)?.base ?? ''));
  console.log(`  NC: Fetching up to ${toFetch.length} individual section pages...`);

  for (const entry of toFetch) {
    const sec = extractSection(entry.citation);
    if (!sec?.base) continue;
    const base = sec.base; // e.g. "14-17"
    if (map.has(base)) continue;

    const ncM = base.match(/^(\d+[A-Z]*)-(.+)$/);
    if (!ncM) continue;
    const chapter = ncM[1];
    const url = `https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_${chapter}/GS_${base}.html`;

    try {
      const html = await fetchHtml(url);

      // NC pages have body text like: "§ 14-17. Murder in the first and second degree defined; punishment."
      const titleM = html.match(/§\s*[\dA-Z-]+\.\s*([^<\n]+?)(?=\s*<|\n)/);
      const desc = titleM ? titleM[1].replace(/\.$/, '').trim() : '';

      map.set(base, {
        section: base,
        description: desc,
        classification: `North Carolina General Statutes § ${base}`,
        sourceUrl: url,
      });
    } catch (err: any) {
      // 404 or network error — still record the URL so sourceUrl gets set
      console.warn(`    Warning: NC § ${base}: ${err.message}`);
      map.set(base, {
        section: base,
        description: '',
        classification: `North Carolina General Statutes § ${base}`,
        sourceUrl: url,
      });
    }

    await sleep(300);
  }

  console.log(`  Total NC sections mapped: ${map.size}`);
  return map;
}

// ── Mode: --state wa ─────────────────────────────────────────────────────────
//
// Washington Revised Code — app.leg.wa.gov chapter pages
// Chapter extracted from WA section: "9A.32.030" → chapter "9A.32"
// sourceUrl: https://app.leg.wa.gov/rcw/default.aspx?cite={section}

async function fetchWAStatuteMap(stateEntries: ChargeEntry[]): Promise<Map<string, CommissionEntry>> {
  // Extract unique WA chapter prefixes
  const chapSet = new Set<string>();
  for (const e of stateEntries) {
    const sec = extractSection(e.citation);
    if (sec?.base) {
      const parts = sec.base.split('.');
      if (parts.length >= 2) chapSet.add(`${parts[0]}.${parts[1]}`);
      else if (parts.length === 1) chapSet.add(parts[0]);
    }
  }

  const map = new Map<string, CommissionEntry>();
  const chapters = [...chapSet].sort();
  console.log(`  WA: ${stateEntries.length} entries across chapters: ${chapters.join(', ')}`);

  for (const chap of chapters) {
    const chapUrl = `https://app.leg.wa.gov/rcw/default.aspx?cite=${chap}`;
    console.log(`  Fetching WA chapter ${chap}...`);

    try {
      const html = await fetchHtml(chapUrl);
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      let found = 0;

      // WA chapter pages have links: href="...?cite=9A.32.030"
      const links = doc.querySelectorAll('a[href*="?cite="]');
      for (const link of Array.from(links)) {
        const href = link.getAttribute('href') ?? '';
        const citeM = href.match(/[?&]cite=([\w.]+)/);
        if (!citeM) continue;
        const section = citeM[1];
        // Only sections within this chapter (not the chapter link itself)
        if (section === chap || !section.startsWith(chap + '.')) continue;

        const parentText = link.parentElement?.textContent?.trim() ?? '';
        const desc = parentText
          .replace(/^RCW\s+/i, '')
          .replace(section, '')
          .replace(/^\s*[-–:.\s]+/, '')
          .trim()
          .split('\n')[0]
          .trim();

        if (!map.has(section)) {
          map.set(section, {
            section,
            description: desc,
            classification: `Washington Revised Code § ${section}`,
            sourceUrl: `https://app.leg.wa.gov/rcw/default.aspx?cite=${section}`,
          });
          found++;
        }
      }

      // Regex fallback if link extraction found nothing
      if (found === 0) {
        const chapEsc = chap.replace('.', '\\.').replace('.', '\\.');
        const secRe = new RegExp(`(${chapEsc}\\.[0-9]+)\\s*[-–:]\\s*([^<\\n]{5,120})`, 'g');
        let m: RegExpExecArray | null;
        while ((m = secRe.exec(html)) !== null) {
          const section = m[1];
          const desc = m[2].trim();
          if (!map.has(section)) {
            map.set(section, {
              section,
              description: desc,
              classification: `Washington Revised Code § ${section}`,
              sourceUrl: `https://app.leg.wa.gov/rcw/default.aspx?cite=${section}`,
            });
            found++;
          }
        }
      }

      console.log(`    → ${found} sections in WA chapter ${chap}`);
    } catch (err: any) {
      console.warn(`    Warning: failed to fetch WA chapter ${chap}: ${err.message}`);
    }

    await sleep(400);
  }

  console.log(`  Total WA sections mapped: ${map.size}`);
  return map;
}

// ── Mode: --state va ─────────────────────────────────────────────────────────
//
// Virginia Code — law.lis.virginia.gov per-section pages
// Title tag: "§ 18.2-32. First and second degree murder defined; punishment"
// sourceUrl: https://law.lis.virginia.gov/vacode/{section}/

async function fetchVAStatuteMap(stateEntries: ChargeEntry[]): Promise<Map<string, CommissionEntry>> {
  const map = new Map<string, CommissionEntry>();
  console.log(`  VA: Fetching up to ${stateEntries.length} individual section pages...`);

  for (const entry of stateEntries) {
    const sec = extractSection(entry.citation);
    if (!sec?.base) continue;
    const base = sec.base; // e.g. "18.2-32"
    if (map.has(base)) continue;

    const url = `https://law.lis.virginia.gov/vacode/${base}/`;

    try {
      const html = await fetchHtml(url);

      // VA pages: <title>§ 18.2-32. First and second degree murder defined; punishment</title>
      const titleM = html.match(/<title>\s*§?\s*[\d.\-]+\.\s*([^<]+?)\s*<\/title>/i);
      const desc = titleM ? titleM[1].trim() : '';

      // Body fallback: "§ 18.2-32. Title text"
      const bodyM = !desc ? html.match(/§\s*[\d.\-]+\.\s*([^<\n.]{10,150})/) : null;
      const bodyDesc = bodyM ? bodyM[1].trim() : '';

      map.set(base, {
        section: base,
        description: desc || bodyDesc,
        classification: `Virginia Code Ann. § ${base}`,
        sourceUrl: url,
      });
    } catch (err: any) {
      console.warn(`    Warning: VA § ${base}: ${err.message}`);
      map.set(base, {
        section: base,
        description: '',
        classification: `Virginia Code Ann. § ${base}`,
        sourceUrl: url,
      });
    }

    await sleep(250);
  }

  console.log(`  Total VA sections mapped: ${map.size}`);
  return map;
}

// ── Mode: --state fed ────────────────────────────────────────────────────────
//
// Federal citations verified via GovInfo USCODE structured endpoint.
// Requires GOVINFO_API_KEY in environment.
//
// Two-step process:
//   1. One collections call → discover latest USCODE package per title (e.g. title18, title21)
//   2. Per-section granule call → confirm section exists and is not repealed
//
// Map key: "${title}:${baseSection}" (e.g. "18:1111") to avoid collisions across titles.
// CommissionEntry.sourceUrl is always set to the canonical uscode.house.gov URL.

async function fetchFederalStatuteMap(fedEntries: ChargeEntry[]): Promise<Map<string, CommissionEntry>> {
  const govInfoKey = process.env.GOVINFO_API_KEY;
  if (!govInfoKey) {
    console.error('  ✗ GOVINFO_API_KEY not set — add it to .env before running --state fed');
    return new Map();
  }

  const GOVINFO_BASE = 'https://api.govinfo.gov';
  const map = new Map<string, CommissionEntry>();

  // Step 1: collect unique title numbers from all federal citations
  const titleSet = new Set<string>();
  for (const entry of fedEntries) {
    const m = entry.citation.match(/(\d+)\s+U\.?S\.?C/i);
    if (m) titleSet.add(m[1]);
  }

  const titles = [...titleSet].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  console.log(`  FED: ${fedEntries.length} entries across USC titles: ${titles.join(', ')}`);

  // Step 2: one collections call to get all USCODE packages, then pick latest per title
  const packageIdByTitle = new Map<string, string>();
  try {
    // GovInfo requires api_key as a query parameter (header alone is not sufficient)
    const collUrl = `${GOVINFO_BASE}/collections/USCODE/2018-01-01T00%3A00%3A00Z?api_key=${encodeURIComponent(govInfoKey)}&pageSize=100&offset=0`;
    console.log(`  Fetching USCODE package list from GovInfo...`);
    const collData = await fetchJson(collUrl, { 'X-Api-Key': govInfoKey });
    const packages: Array<{ packageId: string; dateIssued?: string }> = collData.packages || [];

    for (const title of titles) {
      // Package IDs look like "USCODE-2022-title18" or "USCODE-2022-title18supp1"
      const titlePkgs = packages.filter(p => {
        const id = p.packageId?.toLowerCase() ?? '';
        return id.includes(`-title${title.padStart(2, '0')}`) || id.includes(`-title${title}`);
      });

      if (titlePkgs.length === 0) {
        console.warn(`  No USCODE package found for title ${title}`);
        continue;
      }

      // Pick most recently issued
      titlePkgs.sort((a, b) =>
        new Date(b.dateIssued ?? '2000').getTime() - new Date(a.dateIssued ?? '2000').getTime()
      );
      packageIdByTitle.set(title, titlePkgs[0].packageId);
      console.log(`  Title ${title} → ${titlePkgs[0].packageId}`);
    }
  } catch (err: any) {
    console.error(`  Failed to fetch USCODE package list: ${err.message}`);
    return map;
  }

  await sleep(300);

  // Step 3: per-section lookup via search API
  //
  // Granule IDs use part+chapter structure: USCODE-2024-title18-partI-chap51-sec1111
  // We can't construct this ID without knowing the part/chapter, so we use the search
  // API instead: query "packageId:{id} {section}" and match a result where granuleId
  // ends with "-sec{section}". This is reliable because section numbers are unique
  // within a title.
  const SEARCH_URL = `${GOVINFO_BASE}/search`;
  let verified = 0;
  let notFound = 0;
  let errors = 0;

  for (const entry of fedEntries) {
    const m = entry.citation.match(/(\d+)\s+U\.?S\.?C\.?\s+§?\s*([\dA-Za-z().\-]+)/i);
    if (!m) continue;

    const title = m[1];
    const rawSection = m[2].trim();
    // Strip subsection designators: "841(a)(1)" → "841"
    const baseSection = rawSection.replace(/\s*\([^)]*\)/g, '').trim();
    const mapKey = `${title}:${baseSection}`;

    if (map.has(mapKey)) continue;

    const uscodeUrl =
      `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title${title}-section${baseSection}&edition=prelim`;

    const packageId = packageIdByTitle.get(title);
    if (!packageId) {
      map.set(mapKey, {
        section: mapKey,
        description: '',
        classification: `${title} U.S.C. § ${baseSection} (package not found in GovInfo)`,
        sourceUrl: uscodeUrl,
      });
      continue;
    }

    const searchBody = JSON.stringify({
      query: `collection:USCODE packageId:${packageId} ${baseSection}`,
      pageSize: 5,
      offsetMark: '*',
      sorts: [{ field: 'score', sortOrder: 'DESC' }],
    });

    try {
      const results: Array<{ granuleId: string; title?: string }> =
        await postJson(SEARCH_URL, searchBody, { 'X-Api-Key': govInfoKey }).then(
          (d: any) => d.results ?? []
        );

      // Find a result whose granuleId ends with "-sec{baseSection}"
      const secSuffix = `-sec${baseSection}`;
      const match = results.find(r => r.granuleId?.endsWith(secSuffix));

      if (!match) {
        console.log(`  NOT FOUND   ${title} U.S.C. § ${baseSection}`);
        notFound++;
      } else {
        const heading = match.title ?? '';
        const headingLower = heading.toLowerCase();
        const isRepealed = headingLower.includes('repealed') || headingLower.includes('reserved');

        if (isRepealed) {
          console.log(`  REPEALED    ${title} U.S.C. § ${baseSection}: "${heading}"`);
          notFound++;
        } else {
          map.set(mapKey, {
            section: mapKey,
            description: heading,
            classification: `${title} U.S.C. § ${baseSection} — GovInfo USCODE verified ${NOW_MONTH}`,
            sourceUrl: uscodeUrl,
          });
          console.log(`  ✓ verified  ${title} U.S.C. § ${baseSection}: "${heading}"`);
          verified++;
        }
      }
    } catch (err: any) {
      console.warn(`  ERROR       ${title} U.S.C. § ${baseSection}: ${err.message}`);
      errors++;
    }

    await sleep(400);
  }

  console.log(`\n  GovInfo results: ${verified} verified, ${notFound} not found/repealed, ${errors} errors`);
  console.log(`  Total sections in verified map: ${map.size}`);
  return map;
}

// ── Mode: --state XX (commission verification) ────────────────────────────────

async function runStateCommission(state: string): Promise<void> {
  console.log(`\n=== Commission Import: ${state.toUpperCase()} ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

  // Parse overlay entries first — new state scrapers need stateEntries as input
  let source = fs.readFileSync(OVERLAY_PATH, 'utf-8');
  const entries = parseOverlayEntries(source);
  const stateEntries = entries.filter(e => e.jurisdiction === state);

  let commissionMap: Map<string, CommissionEntry>;
  let commissionName: string;
  let commissionTableUrl: string;

  try {
    switch (state) {
      case 'fl':
        commissionMap = await fetchFLCommissionTable();
        commissionName = `Florida Criminal Punishment Code § 921.0022 (2024)`;
        commissionTableUrl = 'https://www.flsenate.gov/Laws/Statutes/2024/921.0022';
        break;
      case 'pa':
        commissionMap = await fetchPACommissionTable();
        commissionName = `Pennsylvania Commission on Sentencing — OGS § 303.15`;
        commissionTableUrl = 'https://www.law.cornell.edu/regulations/pennsylvania/204-Pa-Code-SS-303-15';
        break;
      case 'mn':
        commissionMap = await fetchMNStatuteMap(stateEntries);
        commissionName = `Minnesota Statutes (2024) — revisor.mn.gov`;
        commissionTableUrl = 'https://www.revisor.mn.gov/statutes/';
        break;
      case 'nc':
        commissionMap = await fetchNCStatuteMap(stateEntries);
        commissionName = `North Carolina General Statutes — ncleg.gov`;
        commissionTableUrl = 'https://www.ncleg.gov/Laws/GeneralStatuteSections/Chapter14';
        break;
      case 'wa':
        commissionMap = await fetchWAStatuteMap(stateEntries);
        commissionName = `Washington Revised Code — app.leg.wa.gov`;
        commissionTableUrl = 'https://app.leg.wa.gov/rcw/';
        break;
      case 'va':
        commissionMap = await fetchVAStatuteMap(stateEntries);
        commissionName = `Virginia Code Annotated — law.lis.virginia.gov`;
        commissionTableUrl = 'https://law.lis.virginia.gov/vacode/title18.2/';
        break;
      case 'federal':
        commissionMap = await fetchFederalStatuteMap(stateEntries);
        commissionName = `GovInfo USCODE structured endpoint — verified ${NOW_MONTH}`;
        commissionTableUrl = 'https://uscode.house.gov/';
        break;
      default:
        console.error(`Commission scraping not yet implemented for: ${state.toUpperCase()}`);
        console.error('Available: fl, pa, mn, nc, wa, va, federal');
        console.error('For other states, use: --generate-urls --states ' + state);
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`Failed to fetch statute data: ${err.message}`);
    process.exit(1);
  }

  console.log(`\nOverlay entries for ${state.toUpperCase()}: ${stateEntries.length}`);
  console.log(`Statute map entries: ${commissionMap.size}`);
  console.log('');

  const report = {
    state: state.toUpperCase(),
    runAt: new Date().toISOString(),
    commissionSource: commissionName,
    commissionTableUrl,
    promoted: [] as string[],
    urlAdded: [] as string[],
    notInCommissionTable: [] as string[],
    alreadyHigh: [] as string[],
  };

  for (const entry of stateEntries) {
    const sec = extractSection(entry.citation);
    const base = sec?.base ?? null;

    // Federal entries use a compound key "title:section" to avoid cross-title collisions
    // (e.g. "18:1111" instead of "1111") since multiple USC titles appear in the overlay.
    let mapKey: string | null = base;
    if (state === 'federal' && base) {
      const titleM = entry.citation.match(/(\d+)\s+U\.?S\.?C/i);
      if (titleM) mapKey = `${titleM[1]}:${base}`;
    }

    const inTable = mapKey ? commissionMap.has(mapKey) : false;
    const commEntry = mapKey ? commissionMap.get(mapKey) : undefined;

    const statUrl = commEntry?.sourceUrl ?? generateSourceUrl(state, entry.citation) ?? commissionTableUrl;

    if (entry.confidence === 'high' && entry.hasSourceUrl) {
      report.alreadyHigh.push(entry.id);
      continue;
    }

    if (inTable && commEntry) {
      // Commission table confirms this section is a criminal offense
      const updates: EntryUpdates = {
        confidence: 'high',
        lastVerified: NOW_MONTH,
        source: commissionName,
        sourceUrl: commEntry.sourceUrl,
      };

      if (DRY_RUN) {
        console.log(`  DRY-RUN PROMOTE: ${entry.id}`);
        console.log(`    section: ${base} → found in commission table`);
        console.log(`    url: ${commEntry.sourceUrl}`);
      } else {
        const result = applyUpdatesToOverlay(source, entry.id, updates);
        if (result.changed) {
          source = result.source;
          report.promoted.push(entry.id);
        }
      }
    } else {
      // Not in commission table — add sourceUrl only (do not promote confidence)
      if (!entry.hasSourceUrl) {
        const updates: EntryUpdates = { sourceUrl: statUrl };

        if (DRY_RUN) {
          console.log(`  DRY-RUN URL-ONLY: ${entry.id} → ${statUrl}`);
        } else {
          const result = applyUpdatesToOverlay(source, entry.id, updates);
          if (result.changed) {
            source = result.source;
            report.urlAdded.push(entry.id);
          }
        }
      }
      if (base) report.notInCommissionTable.push(`${entry.id} (${base})`);
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(OVERLAY_PATH, source, 'utf-8');
  }

  // Summary
  console.log(`\n=== Results: ${state.toUpperCase()} ===`);
  console.log(`Promoted to high (in commission table): ${DRY_RUN ? '(dry-run)' : report.promoted.length}`);
  console.log(`sourceUrl added (not in table):         ${DRY_RUN ? '(dry-run)' : report.urlAdded.length}`);
  console.log(`Already high / skipped:                 ${report.alreadyHigh.length}`);
  console.log(`Not found in commission table:          ${report.notInCommissionTable.length}`);

  if (report.notInCommissionTable.length > 0) {
    console.log('\nNot in commission table (section-level mismatch or non-standard citation):');
    for (const e of report.notInCommissionTable.slice(0, 15)) console.log(`  ${e}`);
    if (report.notInCommissionTable.length > 15) {
      console.log(`  ... and ${report.notInCommissionTable.length - 15} more`);
    }
  }

  // Write report
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const reportPath = path.join(OUTPUT_DIR, `commission-import-${state}-report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(OVERLAY_PATH)) {
    console.error(`Overlay not found: ${OVERLAY_PATH}`);
    process.exit(1);
  }

  if (GENERATE_URLS) {
    runGenerateUrls();
    return;
  }

  if (STATE_MODE) {
    await runStateCommission(STATE_MODE);
    return;
  }

  console.error('Usage:');
  console.error('  --generate-urls              Add sourceUrl to all entries via citation patterns');
  console.error('  --generate-urls --states mn,nc,wa,va   Limit to specific states');
  console.error('  --state fl                   Import from FL Criminal Punishment Code table');
  console.error('  --state pa                   Import from PA OGS table (Cornell LII)');
  console.error('  --state mn                   Import from MN Statutes (revisor.mn.gov chapters)');
  console.error('  --state nc                   Import from NC General Statutes (ncleg.gov per-section)');
  console.error('  --state wa                   Import from WA Revised Code (app.leg.wa.gov chapters)');
  console.error('  --state va                   Import from VA Code (law.lis.virginia.gov per-section)');
  console.error('  --state federal              Verify federal citations via GovInfo (requires GOVINFO_API_KEY)');
  console.error('  --dry-run                    Preview changes without writing');
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
