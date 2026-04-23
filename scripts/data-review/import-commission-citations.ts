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
 *   --dry-run                  Show what would change without writing to disk.
 *   --states al,mn,fl,...      Restrict --generate-urls to these jurisdictions only.
 *
 * Usage:
 *   npx tsx scripts/data-review/import-commission-citations.ts --generate-urls
 *   npx tsx scripts/data-review/import-commission-citations.ts --generate-urls --states mn,nc,wa,va
 *   npx tsx scripts/data-review/import-commission-citations.ts --state fl --dry-run
 *   npx tsx scripts/data-review/import-commission-citations.ts --state fl
 *   npx tsx scripts/data-review/import-commission-citations.ts --state pa
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { JSDOM } from 'jsdom';

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

    case 'fed': {
      // US Code — extract title from "18 U.S.C. § 1111" pattern
      const fedM = citation.match(/(\d+)\s+U\.S\.C\.\s+§\s*([\d.]+)/);
      if (fedM) {
        return `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title${fedM[1]}-section${fedM[2]}&edition=prelim`;
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
  const entryRe = /"([a-z]{2,3}-[^"]+)":\s*\{([^}]+)\}/g;
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

// ── Mode: --state fl ──────────────────────────────────────────────────────────
//
// Florida Criminal Punishment Code — § 921.0022 Offense Severity Ranking Chart
// URL: https://www.flsenate.gov/Laws/Statutes/2024/921.0022
//
// Table structure: rows with statute reference, offense description, felony degree.
// Columns vary by severity level section header.
// We match our FL entries by base section number.

interface CommissionEntry {
  section: string;       // base section, e.g. "782.04"
  description: string;   // offense name from commission table
  classification: string; // degree / level / OGS
  sourceUrl: string;     // direct URL to the official source
}

async function fetchFLCommissionTable(): Promise<Map<string, CommissionEntry>> {
  const tableUrl = 'https://www.flsenate.gov/Laws/Statutes/2024/921.0022';
  console.log(`Fetching: ${tableUrl}`);

  const html = await fetchHtml(tableUrl);
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
    console.log('  Table parsing yielded few results — trying regex extraction from HTML...');
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

  console.log(`  Found ${map.size} FL sections in commission table.`);
  return map;
}

// ── Mode: --state pa ──────────────────────────────────────────────────────────
//
// Pennsylvania Commission on Sentencing — § 303.15 Offense Listing
// URL: https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/204/chapter303/s303.15.html
//
// Table structure: offense name, statute section, OGS score.

async function fetchPACommissionTable(): Promise<Map<string, CommissionEntry>> {
  const tableUrl = 'https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/204/chapter303/s303.15.html';
  console.log(`Fetching: ${tableUrl}`);

  const html = await fetchHtml(tableUrl);
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const map = new Map<string, CommissionEntry>();

  // PA § 303.15 renders as a table with columns: offense, statute, OGS
  // Statute column contains references like "18 Pa.C.S. § 2502" or "75 Pa.C.S. § 3802"
  const rows = doc.querySelectorAll('tr');
  for (const row of Array.from(rows)) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) continue;

    for (const cell of Array.from(cells)) {
      const text = cell.textContent?.trim() ?? '';
      // Look for PA statute pattern: "18 Pa.C.S. § 2502" or "§ 2502"
      const secM = text.match(/§\s*([\dA-Za-z.-]+)/);
      if (!secM) continue;

      const base = secM[1].replace(/\.$/, '');
      if (!map.has(base)) {
        // Description is in the adjacent cell
        const desc = cells[0]?.textContent?.trim() ?? '';
        map.set(base, {
          section: base,
          description: desc,
          classification: 'PA Offense Gravity Score § 303.15',
          sourceUrl: `https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&div=0&chpt=${base.slice(0, 2)}&sctn=${base.slice(2)}&subsctn=0`,
        });
      }
    }
  }

  console.log(`  Found ${map.size} PA sections in commission table.`);
  return map;
}

// ── Mode: --state XX (commission verification) ────────────────────────────────

async function runStateCommission(state: string): Promise<void> {
  console.log(`\n=== Commission Import: ${state.toUpperCase()} ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  console.log('');

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
        commissionName = `Pennsylvania Commission on Sentencing — Offense Gravity Score § 303.15`;
        commissionTableUrl = 'https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/204/chapter303/s303.15.html';
        break;
      default:
        console.error(`Commission scraping not yet implemented for: ${state.toUpperCase()}`);
        console.error('Available: fl, pa');
        console.error('For other states, use: --generate-urls --states ' + state);
        process.exit(1);
    }
  } catch (err: any) {
    console.error(`Failed to fetch commission table: ${err.message}`);
    process.exit(1);
  }

  let source = fs.readFileSync(OVERLAY_PATH, 'utf-8');
  const entries = parseOverlayEntries(source);
  const stateEntries = entries.filter(e => e.jurisdiction === state);

  console.log(`\nOverlay entries for ${state.toUpperCase()}: ${stateEntries.length}`);
  console.log(`Commission table entries: ${commissionMap.size}`);
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

    const inTable = base ? commissionMap.has(base) : false;
    const commEntry = base ? commissionMap.get(base) : undefined;

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
  console.error('  --state pa                   Import from PA OGS table');
  console.error('  --dry-run                    Preview changes without writing');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
