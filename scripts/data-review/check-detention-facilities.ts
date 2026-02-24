/**
 * ICE Detention Facility Checker
 *
 * Compares stored detention facility data against:
 *   1. ICE's public detention facility page (ice.gov) — authoritative source
 *      for phone numbers, facility status, and new/closed facilities.
 *
 * No external API key required. All data is sourced from public government pages.
 *
 * Outputs: scripts/data-review/output/detention-diff.json
 *
 * Run: npx tsx scripts/data-review/check-detention-facilities.ts
 */

// @ts-ignore — no @types/jsdom in this project; jsdom is used only for HTML parsing at runtime
import { JSDOM } from 'jsdom';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { detentionFacilities } from '../../shared/data/detention-facilities.js';
import {
  type DiffItem,
  type DiffReport,
  phonesMatch,
  writeDiff,
} from './utils/diff.js';

// jsdom ships without @types/jsdom in this project; type as any to stay runtime-safe
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyDoc = any;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, 'output/detention-diff.json');
const ICE_URL = 'https://www.ice.gov/detain/detention-facilities';

// ─── ICE Page Scraper ──────────────────────────────────────────────────────────

interface IceFacilityRow {
  name: string;
  city: string;
  state: string;
  phone?: string;
}

async function fetchIceFacilities(): Promise<IceFacilityRow[]> {
  const res = await fetch(ICE_URL, {
    headers: {
      'User-Agent':
        'PublicDefenderAI-DataReview/1.0 (contact: github.com/shahabasghar/PublicDefenderAI)',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) throw new Error(`ICE page returned HTTP ${res.status}`);

  const html = await res.text();
  const dom = new JSDOM(html);
  const doc: AnyDoc = dom.window.document;

  const rows: IceFacilityRow[] = [];

  // ICE uses a standard HTML table on this page
  const tables = Array.from(doc.querySelectorAll('table') as Iterable<AnyDoc>);
  for (const table of tables) {
    const trs = Array.from(table.querySelectorAll('tr') as Iterable<AnyDoc>);
    for (const tr of trs) {
      const cells = Array.from(tr.querySelectorAll('td') as Iterable<AnyDoc>).map(
        (td: AnyDoc) => (td.textContent?.trim() ?? '') as string,
      );
      if (cells.length >= 3 && cells[0].length > 0) {
        rows.push({
          name: cells[0],
          city: cells[1] ?? '',
          state: cells[2] ?? '',
          phone: cells[3] ? cells[3].replace(/\s+/g, '') : undefined,
        });
      }
    }
  }

  return rows;
}

/** Normalize a facility name for loose matching (lowercase, strip punctuation). */
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const items: DiffItem[] = [];
  const errors: string[] = [];

  // Try fetching ICE page
  let iceRows: IceFacilityRow[] = [];
  let iceSourceAvailable = false;
  try {
    iceRows = await fetchIceFacilities();
    iceSourceAvailable = iceRows.length > 0;
    console.log(`ICE page: found ${iceRows.length} facility rows`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`ICE page unavailable: ${msg}`);
    console.warn(`⚠ Could not fetch ICE page: ${msg}`);
  }

  // Build lookup map for ICE rows by normalized name
  const iceByName = new Map<string, IceFacilityRow>();
  for (const row of iceRows) {
    iceByName.set(normalizeName(row.name), row);
  }

  // ── Check each stored facility ──────────────────────────────────────────────

  const checkedIds = new Set<string>();

  for (const facility of detentionFacilities) {
    checkedIds.add(facility.id);
    console.log(`\nChecking: ${facility.name} (${facility.city}, ${facility.state})`);

    // 1. Cross-reference against ICE page
    const iceMatch = iceByName.get(normalizeName(facility.name));

    if (iceSourceAvailable && !iceMatch) {
      items.push({
        id: facility.id,
        name: facility.name,
        changeType: 'not_found_on_source',
        notes: `Not found on ICE facility list. Possible closure or rename.`,
        verifyUrl: ICE_URL,
        severity: 'high',
      });
    }

    if (iceMatch?.phone && !phonesMatch(facility.phone, iceMatch.phone)) {
      items.push({
        id: facility.id,
        name: facility.name,
        changeType: 'phone_changed',
        storedValue: facility.phone,
        sourceValue: iceMatch.phone,
        verifyUrl: ICE_URL,
        severity: 'critical',
        notes: 'Phone number differs from ICE.gov listing.',
      });
    }

    // 2. Visitation info — always flag for manual verification
    //    (no automated source for current visitation hours)
    items.push({
      id: facility.id,
      name: facility.name,
      changeType: 'manual_required',
      notes: facility.visitationInfo
        ? 'Verify current visitation hours by calling the facility.'
        : 'No visitation info stored. Call facility to confirm whether visitation is available and at what hours.',
      verifyUrl: `tel:${facility.phone}`,
      severity: facility.visitationInfo ? 'medium' : 'high',
    });
  }

  // ── Check for new facilities on ICE page not in our data ───────────────────

  if (iceSourceAvailable) {
    const storedNames = new Set(
      detentionFacilities.map((f) => normalizeName(f.name)),
    );

    for (const row of iceRows) {
      if (!storedNames.has(normalizeName(row.name))) {
        items.push({
          id: `new-${normalizeName(row.name).replace(/\s+/g, '-')}`,
          name: row.name,
          changeType: 'new_on_source',
          notes: `Found on ICE.gov but not in our data. Location: ${row.city}, ${row.state}. Phone: ${row.phone ?? 'not listed'}.`,
          verifyUrl: ICE_URL,
          severity: 'medium',
        });
      }
    }
  }

  // ── Build report ────────────────────────────────────────────────────────────

  const automatedItems = items.filter((i) => i.changeType !== 'manual_required');
  const manualItems = items.filter((i) => i.changeType === 'manual_required');

  const report: DiffReport = {
    category: 'detention-facilities',
    generatedAt: new Date().toISOString(),
    stats: {
      checked: detentionFacilities.length,
      automatedChanges: automatedItems.filter(
        (i) => i.changeType === 'phone_changed' || i.changeType === 'address_changed' || i.changeType === 'capacity_changed',
      ).length,
      newOnSource: items.filter((i) => i.changeType === 'new_on_source').length,
      notFoundOnSource: items.filter((i) => i.changeType === 'not_found_on_source').length,
      manualOnly: manualItems.length,
    },
    items,
    sourceAvailable: iceSourceAvailable,
    errors,
  };

  await writeDiff(report, OUTPUT_PATH);
}

main().catch((err) => {
  console.error('Fatal error in check-detention-facilities:', err);
  process.exit(1);
});
