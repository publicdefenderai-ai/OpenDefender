/**
 * Legal Aid Organization Checker
 *
 * Compares stored legal aid org data against:
 *   1. EOIR Free Legal Services Provider list (PDF from justice.gov)
 *   2. LSC Grantee Finder data (lsc.gov)
 *   3. HTTP HEAD checks on stored website URLs
 *
 * No external API key required. All data is sourced from public government pages.
 *
 * Note: Nominatim / OSM is intentionally not used here — coverage for small
 * nonprofits is too sparse and would generate excessive false-positive flags.
 * Phone verification relies on EOIR/LSC cross-referencing plus website checks.
 *
 * Outputs: scripts/data-review/output/legal-aid-diff.json
 *
 * Run: npx tsx scripts/data-review/check-legal-aid.ts
 */

// @ts-ignore — pdf-parse types are incomplete; runtime import works correctly
import pdfParse from 'pdf-parse';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { legalAidOrganizationsSeed } from '../../server/data/legal-aid-organizations-seed.js';
import {
  type DiffItem,
  type DiffReport,
  phonesMatch,
  writeDiff,
} from './utils/diff.js';
import { checkWebsite } from './utils/nominatim.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, 'output/legal-aid-diff.json');

const EOIR_PAGE_URL =
  'https://www.justice.gov/eoir/list-of-free-legal-services-providers';
const LSC_API_URL =
  'https://lsc-granteefinder.lsc.gov/api/grantees';

// ─── EOIR PDF Fetcher ──────────────────────────────────────────────────────────

/** Fetch the EOIR page, find the first PDF link, download and parse it. */
async function fetchEoirOrgNames(): Promise<Set<string>> {
  const pageRes = await fetch(EOIR_PAGE_URL, {
    headers: { 'User-Agent': 'PublicDefenderAI-DataReview/1.0' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!pageRes.ok) throw new Error(`EOIR page HTTP ${pageRes.status}`);

  const html = await pageRes.text();

  // Look for PDF links on the EOIR page
  const pdfMatch = html.match(/href="([^"]+\.pdf)"/i);
  if (!pdfMatch) throw new Error('No PDF link found on EOIR page');

  const pdfUrl = pdfMatch[1].startsWith('http')
    ? pdfMatch[1]
    : `https://www.justice.gov${pdfMatch[1]}`;

  console.log(`  EOIR PDF found: ${pdfUrl}`);

  const pdfRes = await fetch(pdfUrl, {
    signal: AbortSignal.timeout(60_000),
  });
  if (!pdfRes.ok) throw new Error(`EOIR PDF HTTP ${pdfRes.status}`);

  const buffer = Buffer.from(await pdfRes.arrayBuffer());
  const parsed = await pdfParse(buffer);

  // Extract org names: in EOIR PDFs each org name typically appears on its own line
  // We build a set of normalized names for fuzzy matching
  const names = new Set<string>();
  const lines = (parsed.text as string).split('\n').map((l) => l.trim()).filter((l) => l.length > 3);
  for (const line of Array.from(lines)) {
    names.add(line.toLowerCase());
  }

  console.log(`  EOIR PDF: extracted ${names.size} text segments`);
  return names;
}

// ─── LSC Data Fetcher ──────────────────────────────────────────────────────────

interface LscGrantee {
  name: string;
  state: string;
  city?: string;
  phone?: string;
  website?: string;
}

async function fetchLscGrantees(): Promise<LscGrantee[]> {
  const res = await fetch(LSC_API_URL, {
    headers: {
      'User-Agent': 'PublicDefenderAI-DataReview/1.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`LSC API HTTP ${res.status}`);

  const data = (await res.json()) as unknown;

  // Handle both array and wrapped formats
  const grantees: unknown[] = Array.isArray(data)
    ? data
    : (data as Record<string, unknown[]>)?.grantees ?? [];

  return grantees
    .filter((g): g is Record<string, string> => typeof g === 'object' && g !== null)
    .map((g) => ({
      name: String(g.name ?? g.organization_name ?? ''),
      state: String(g.state ?? g.state_abbreviation ?? ''),
      city: g.city ? String(g.city) : undefined,
      phone: g.phone ? String(g.phone) : undefined,
      website: g.website ? String(g.website) : undefined,
    }))
    .filter((g) => g.name.length > 0);
}

/** Normalize org name for fuzzy matching: lowercase, strip legal suffixes. */
function normalizeOrgName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|llp|ltd|corp|foundation|the)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Check if a name appears in a set of normalized EOIR text segments. */
function isInEoir(name: string, eoirNames: Set<string>): boolean {
  const normalized = normalizeOrgName(name);
  // Check if any of the key words (3+ chars) appear in the EOIR text
  const words = normalized.split(' ').filter((w) => w.length >= 4);
  if (words.length === 0) return false;
  const eoirArray = Array.from(eoirNames);
  // Require at least 2/3 of significant words to appear
  const matches = words.filter((w) => eoirArray.some((line) => line.includes(w)));
  return matches.length >= Math.ceil(words.length * 0.6);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const items: DiffItem[] = [];
  const errors: string[] = [];

  // Load external sources (graceful fallback if unavailable)
  let eoirNames: Set<string> | null = null;
  let lscGrantees: LscGrantee[] = [];

  console.log('Fetching EOIR provider list…');
  try {
    eoirNames = await fetchEoirOrgNames();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`EOIR source unavailable: ${msg}`);
    console.warn(`⚠ EOIR unavailable: ${msg}`);
  }

  console.log('Fetching LSC grantee data…');
  try {
    lscGrantees = await fetchLscGrantees();
    console.log(`LSC: ${lscGrantees.length} grantees loaded`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`LSC source unavailable: ${msg}`);
    console.warn(`⚠ LSC unavailable: ${msg}`);
  }

  // Build LSC lookup by normalized name
  const lscByName = new Map<string, LscGrantee>();
  for (const g of lscGrantees) {
    lscByName.set(normalizeOrgName(g.name), g);
  }

  // Track which LSC grantees we matched (to detect new ones later)
  const matchedLscNames = new Set<string>();

  console.log(`\nChecking ${legalAidOrganizationsSeed.length} stored organizations…\n`);

  for (const org of legalAidOrganizationsSeed) {
    const id = normalizeOrgName(org.name).replace(/\s+/g, '-').slice(0, 40);
    const locationStr = `${org.city}, ${org.state}`;

    console.log(`Checking: ${org.name} — ${locationStr}`);

    // 1. Website HTTP check (skip if no website)
    if (org.website) {
      const siteCheck = await checkWebsite(org.website);
      if (!siteCheck.ok) {
        items.push({
          id,
          name: org.name,
          changeType: 'website_down',
          storedValue: org.website,
          sourceValue: `HTTP ${siteCheck.status === 0 ? 'timeout/unreachable' : siteCheck.status}`,
          verifyUrl: org.website,
          severity: 'high',
          notes: 'Organization website not responding. May indicate closure or URL change.',
        });
      }
    }

    // 2. EOIR cross-reference (soft flag — many orgs are legitimately not on EOIR list)
    if (eoirNames && org.dataSource === 'EOIR') {
      const onEoir = isInEoir(org.name, eoirNames);
      if (!onEoir) {
        items.push({
          id,
          name: org.name,
          changeType: 'not_found_on_source',
          notes:
            'Stored as EOIR-sourced but name not found in current EOIR PDF. May have been removed, renamed, or the PDF format may have changed. Verify manually.',
          verifyUrl: EOIR_PAGE_URL,
          severity: 'medium',
        });
      }
    }

    // 3. LSC cross-reference
    const normalizedName = normalizeOrgName(org.name);
    const lscMatch = lscByName.get(normalizedName);
    if (lscMatch) {
      matchedLscNames.add(normalizedName);

      // Phone comparison with LSC data
      if (lscMatch.phone && org.phone && lscMatch.phone !== org.phone) {
        if (!phonesMatch(org.phone, lscMatch.phone)) {
          items.push({
            id,
            name: org.name,
            changeType: 'phone_changed',
            storedValue: org.phone,
            sourceValue: lscMatch.phone,
            verifyUrl: lscMatch.website ?? EOIR_PAGE_URL,
            severity: 'high',
            notes: 'Phone differs from LSC grantee data.',
          });
        }
      }
    }

  }

  // ── Check for new LSC grantees not in our data ─────────────────────────────

  for (const [normalizedName, grantee] of Array.from(lscByName)) {
    if (!matchedLscNames.has(normalizedName) && grantee.state) {
      items.push({
        id: `new-lsc-${normalizedName.replace(/\s+/g, '-').slice(0, 40)}`,
        name: grantee.name,
        changeType: 'new_on_source',
        notes: `New LSC grantee in our coverage area not in stored data. Location: ${grantee.city ?? ''}, ${grantee.state}. Phone: ${grantee.phone ?? 'not listed'}.`,
        verifyUrl: grantee.website ?? LSC_API_URL,
        severity: 'low',
      });
    }
  }

  // ── Build report ────────────────────────────────────────────────────────────

  const report: DiffReport = {
    category: 'legal-aid',
    generatedAt: new Date().toISOString(),
    stats: {
      checked: legalAidOrganizationsSeed.length,
      automatedChanges: items.filter(
        (i) => i.changeType === 'phone_changed' || i.changeType === 'address_changed',
      ).length,
      newOnSource: items.filter((i) => i.changeType === 'new_on_source').length,
      notFoundOnSource: items.filter((i) => i.changeType === 'not_found_on_source').length,
      manualOnly: 0,
    },
    items,
    sourceAvailable: eoirNames !== null || lscGrantees.length > 0,
    errors,
  };

  await writeDiff(report, OUTPUT_PATH);
}

main().catch((err) => {
  console.error('Fatal error in check-legal-aid:', err);
  process.exit(1);
});
