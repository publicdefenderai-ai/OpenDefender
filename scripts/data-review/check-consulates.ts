/**
 * Consulate Information Checker
 *
 * Compares stored consulate data against:
 *   1. Google Places API (main consulate phone verification)
 *   2. HTTP HEAD check on stored website URLs
 *
 * Emergency phone numbers are always flagged for manual verification —
 * there is no automated authoritative source for after-hours lines.
 *
 * Outputs: scripts/data-review/output/consulate-diff.json
 *
 * Run: npx tsx scripts/data-review/check-consulates.ts
 * Env: GOOGLE_PLACES_API_KEY
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { consulates } from '../../shared/data/consulates.js';
import {
  type DiffItem,
  type DiffReport,
  writeDiff,
} from './utils/diff.js';
import { verifyWithPlaces, placesDelay, checkWebsite } from './utils/google-places.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, 'output/consulate-diff.json');
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? '';
const STATE_DEPT_URL = 'https://www.state.gov/foreign-embassies-in-the-united-states/';

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const items: DiffItem[] = [];
  const errors: string[] = [];

  console.log(`Checking ${consulates.length} consulates…\n`);

  for (const consulate of consulates) {
    const { country, mainPhone, emergencyPhone, website, mainConsulate } = consulate;
    const locationId = country.toLowerCase().replace(/\s+/g, '-');

    console.log(`Checking: ${country} — ${mainConsulate.city}`);

    // 1. Website HTTP check
    const siteCheck = await checkWebsite(website);
    if (!siteCheck.ok) {
      items.push({
        id: locationId,
        name: `${country} Consulate`,
        changeType: 'website_down',
        storedValue: website,
        sourceValue: `HTTP ${siteCheck.status === 0 ? 'timeout/unreachable' : siteCheck.status}`,
        verifyUrl: website,
        severity: 'high',
        notes:
          'Consulate website is not responding. Verify the URL is current and update if redirected.',
      });
    }

    // 2. Google Places verification for main consulate phone
    if (GOOGLE_API_KEY) {
      try {
        await placesDelay();
        const query = `${country} Consulate General ${mainConsulate.city}`;
        const placesResult = await verifyWithPlaces(
          GOOGLE_API_KEY,
          query,
          mainConsulate.phone,
          mainConsulate.city,
        );

        if (!placesResult.found) {
          // Try broader search without "General"
          await placesDelay();
          const broader = await verifyWithPlaces(
            GOOGLE_API_KEY,
            `${country} Consulate ${mainConsulate.city}`,
            mainConsulate.phone,
            mainConsulate.city,
          );

          if (broader.found && broader.phoneMismatch) {
            items.push({
              id: locationId,
              name: `${country} Consulate (${mainConsulate.city})`,
              changeType: 'phone_changed',
              storedValue: mainConsulate.phone,
              sourceValue: broader.phoneMismatch.places,
              verifyUrl: website,
              severity: 'critical',
              notes: 'Main consulate phone differs from Google Places. Verify on official website.',
            });
          }
        } else {
          if (placesResult.phoneMismatch) {
            items.push({
              id: locationId,
              name: `${country} Consulate (${mainConsulate.city})`,
              changeType: 'phone_changed',
              storedValue: placesResult.phoneMismatch.stored,
              sourceValue: placesResult.phoneMismatch.places,
              verifyUrl: website,
              severity: 'critical',
              notes: `Main consulate phone differs from Google Places. Places address: ${placesResult.placesAddress ?? 'not returned'}.`,
            });
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Google Places error for ${country}: ${msg}`);
        console.warn(`  ⚠ Google Places error: ${msg}`);
      }

      // 3. Verify main/national phone line (toll-free or DC line)
      if (mainPhone && mainPhone !== mainConsulate.phone) {
        try {
          await placesDelay();
          const embassy = await verifyWithPlaces(
            GOOGLE_API_KEY,
            `${country} Embassy Washington DC`,
            mainPhone,
            'Washington, DC',
          );

          if (embassy.found && embassy.phoneMismatch) {
            items.push({
              id: `${locationId}-embassy`,
              name: `${country} Embassy / Main Phone`,
              changeType: 'phone_changed',
              storedValue: embassy.phoneMismatch.stored,
              sourceValue: embassy.phoneMismatch.places,
              verifyUrl: website,
              severity: 'high',
              notes: 'National/main phone line differs from Google Places. Verify on official website.',
            });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Google Places error for ${country} embassy: ${msg}`);
        }
      }
    }

    // 4. Emergency phone — always manual (no automated source)
    items.push({
      id: `${locationId}-emergency`,
      name: `${country} — Emergency Line`,
      changeType: 'manual_required',
      storedValue: emergencyPhone ?? '(not set)',
      notes: emergencyPhone
        ? `Verify emergency/after-hours number on official website: ${website}`
        : `No emergency phone stored. Check official website for an after-hours line: ${website}`,
      verifyUrl: website,
      severity: emergencyPhone ? 'medium' : 'high',
    });
  }

  // ── Build report ────────────────────────────────────────────────────────────

  const report: DiffReport = {
    category: 'consulates',
    generatedAt: new Date().toISOString(),
    stats: {
      checked: consulates.length,
      automatedChanges: items.filter(
        (i) => i.changeType === 'phone_changed' || i.changeType === 'address_changed',
      ).length,
      newOnSource: 0, // No automated source for discovering new consulates
      notFoundOnSource: 0,
      manualOnly: items.filter((i) => i.changeType === 'manual_required').length,
    },
    items,
    sourceAvailable: GOOGLE_API_KEY.length > 0,
    errors,
  };

  console.log(`\nState Dept reference: ${STATE_DEPT_URL}`);
  await writeDiff(report, OUTPUT_PATH);
}

main().catch((err) => {
  console.error('Fatal error in check-consulates:', err);
  process.exit(1);
});
