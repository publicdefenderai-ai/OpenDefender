/**
 * Consulate Information Checker
 *
 * Compares stored consulate data against:
 *   1. Official consulate website — scraped for US phone numbers (no API key required)
 *   2. Nominatim / OpenStreetMap — existence check for the consulate address
 *   3. HTTP HEAD check on stored website URLs
 *
 * Emergency phone numbers are always flagged for manual verification —
 * there is no automated authoritative source for after-hours lines.
 *
 * No external API key required. Uses open-source tools only.
 *
 * Outputs: scripts/data-review/output/consulate-diff.json
 *
 * Run: npx tsx scripts/data-review/check-consulates.ts
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { consulates } from '../../shared/data/consulates.js';
import {
  type DiffItem,
  type DiffReport,
  writeDiff,
} from './utils/diff.js';
import {
  checkWebsite,
  scrapeWebsitePhones,
  checkWithNominatim,
  nominatimDelay,
  scrapeDelay,
} from './utils/nominatim.js';
import { phonesMatch } from './utils/diff.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, 'output/consulate-diff.json');
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

    // 2. Scrape official consulate website for phone numbers
    //    This is more authoritative than a third-party index: phones come directly
    //    from the consulate's own pages.
    if (siteCheck.ok) {
      try {
        await scrapeDelay();
        const scrapedPhones = await scrapeWebsitePhones(website);

        if (scrapedPhones.length > 0) {
          // Check whether stored main consulate phone appears on the site
          const consultatePhoneFound = scrapedPhones.some((p) =>
            phonesMatch(mainConsulate.phone, p),
          );
          if (!consultatePhoneFound) {
            // Report the first scraped phone as the candidate replacement
            items.push({
              id: locationId,
              name: `${country} Consulate (${mainConsulate.city})`,
              changeType: 'phone_changed',
              storedValue: mainConsulate.phone,
              sourceValue: scrapedPhones[0],
              verifyUrl: website,
              severity: 'critical',
              notes: `Stored phone not found on official website. Site shows: ${scrapedPhones.join(', ')}. Verify manually.`,
            });
          }

          // Check main/national phone line if different from consulate phone
          if (mainPhone && mainPhone !== mainConsulate.phone) {
            const mainPhoneFound = scrapedPhones.some((p) => phonesMatch(mainPhone, p));
            if (!mainPhoneFound) {
              items.push({
                id: `${locationId}-main`,
                name: `${country} — National / Main Phone`,
                changeType: 'phone_changed',
                storedValue: mainPhone,
                sourceValue: scrapedPhones[0],
                verifyUrl: website,
                severity: 'high',
                notes: `Stored main/national phone not found on official website. Verify manually.`,
              });
            }
          }
        } else {
          // Could not scrape phones — flag for manual check
          items.push({
            id: locationId,
            name: `${country} Consulate`,
            changeType: 'manual_required',
            notes: 'Could not extract phone numbers from official website (may use JavaScript rendering). Verify phone manually.',
            verifyUrl: website,
            severity: 'medium',
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Phone scrape error for ${country}: ${msg}`);
        console.warn(`  ⚠ Phone scrape error: ${msg}`);
      }
    }

    // 3. Nominatim existence check — verifies the consulate is still listed on OSM
    //    OSM coverage for consulates is generally good; a miss may indicate relocation.
    try {
      await nominatimDelay();
      // mainConsulate.city already includes the state abbreviation, e.g. "Los Angeles, CA"
      const [osmCity, osmState = ''] = mainConsulate.city.split(',').map((s) => s.trim());
      const osmCheck = await checkWithNominatim(
        `${country} Consulate`,
        osmCity,
        osmState,
      );

      if (!osmCheck.found) {
        items.push({
          id: `${locationId}-osm`,
          name: `${country} Consulate (${mainConsulate.city})`,
          changeType: 'not_found_on_source',
          notes:
            'Not found on OpenStreetMap via Nominatim. May have moved or been removed from map data. Verify address on official website.',
          verifyUrl: website,
          severity: 'medium',
        });
      } else if (!osmCheck.cityMatch) {
        items.push({
          id: `${locationId}-osm-city`,
          name: `${country} Consulate`,
          changeType: 'address_changed',
          storedValue: mainConsulate.city,
          sourceValue: osmCheck.displayName,
          verifyUrl: website,
          severity: 'medium',
          notes: 'Nominatim result does not match expected city. May indicate relocation.',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Nominatim error for ${country}: ${msg}`);
      console.warn(`  ⚠ Nominatim error: ${msg}`);
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
    sourceAvailable: true,
    errors,
  };

  console.log(`\nState Dept reference: ${STATE_DEPT_URL}`);
  await writeDiff(report, OUTPUT_PATH);
}

main().catch((err) => {
  console.error('Fatal error in check-consulates:', err);
  process.exit(1);
});
