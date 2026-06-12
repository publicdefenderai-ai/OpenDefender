/**
 * WA Citation Verifier
 *
 * Verifies Washington RCW citations against the WA Legislature site
 * (app.leg.wa.gov/rcw/default.aspx?cite={section}).
 *
 * URL pattern:
 *   https://app.leg.wa.gov/rcw/default.aspx?cite={section}
 *   e.g. "Wash. Rev. Code § 9A.36.041" → cite=9A.36.041
 *        "Wash. Rev. Code § 66.44.291(1)" → cite=66.44.291
 *
 * Detection method:
 *   Both valid and invalid URLs return HTTP 200.
 *   Invalid/missing sections return a page containing:
 *     "Citation not found" / "cannot be found"
 *   Valid sections do NOT contain those phrases.
 *   → Check: body does NOT contain "cannot be found" (case-insensitive).
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-wa-citations.ts [--dry-run] [--apply]
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400;
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const WA_BASE        = 'https://app.leg.wa.gov/rcw/default.aspx?cite=';
const UA             = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

/** Parse "Wash. Rev. Code § 9A.36.041" or "RCW 9A.36.041(1)" → section string */
function parseWaCitation(citation: string): string | null {
  // Match § XX.XX.XXX or RCW XX.XX.XXX, then strip subsections
  const m = citation.match(/(?:§\s*|RCW\s+)([\dA-Za-z]+\.[\dA-Za-z.]+?)(?:\(|,|;|\s|$)/);
  if (!m) return null;
  return m[1];
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
  return res.text();
}

function isSectionValid(body: string): boolean {
  return !body.toLowerCase().includes('cannot be found');
}

function readOverlay(p: string) { return fs.readFileSync(p, 'utf8'); }

function getOverlayEntry(overlay: string, key: string) {
  const m = overlay.match(new RegExp(`"${key}":\\s*\\{([^}]+)\\}`));
  if (!m) return null;
  const citM = m[1].match(/citation:\s*"([^"]+)"/);
  const conM = m[1].match(/confidence:\s*"([^"]+)"/);
  if (!citM || !conM) return null;
  return { citation: citM[1], confidence: conM[1] };
}

function patchOverlayEntry(
  overlay: string, key: string,
  fields: { confidence: string; source: string; sourceUrl: string; lastVerified: string },
): string {
  const existing = overlay.match(new RegExp(`"${key}":\\s*\\{([^}]+)\\}`));
  if (!existing) return overlay;
  const citM = existing[1].match(/citation:\s*"([^"]+)"/);
  const oldCit = citM ? citM[1] : '';
  const replacement = `"${key}": { citation: "${oldCit}", confidence: "${fields.confidence}", lastVerified: "${fields.lastVerified}", source: "${fields.source}", sourceUrl: "${fields.sourceUrl}" }`;
  return overlay.replace(new RegExp(`"${key}":\\s*\\{[^}]+\\}`, 's'), replacement);
}

interface Result { key: string; citation: string; url: string; valid: boolean; upgraded: boolean; parseError?: boolean; }

async function main() {
  console.log('WA Citation Verifier');
  console.log('────────────────────────────────');

  const overlay = readOverlay(OVERLAY_PATH);
  const waKeys  = criminalCharges.filter(c => c.jurisdiction === 'WA').map(c => c.id);
  const mediumEntries: { key: string; citation: string; section: string | null }[] = [];

  for (const key of waKeys) {
    const entry = getOverlayEntry(overlay, key);
    if (!entry || entry.confidence !== 'medium') continue;
    mediumEntries.push({ key, citation: entry.citation, section: parseWaCitation(entry.citation) });
  }

  console.log(`WA charges total      : ${waKeys.length}`);
  console.log(`Medium entries        : ${mediumEntries.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY-RUN' : APPLY ? 'APPLY to overlay' : 'JSON output only'}`);
  console.log(`Source                : app.leg.wa.gov/rcw`);
  console.log('');

  if (DRY_RUN) {
    for (const { key, citation, section } of mediumEntries) {
      if (!section) { console.log(`  [PARSE ERR] ${key} → "${citation}"`); continue; }
      console.log(`  ${key} → ${citation}  →  ${WA_BASE}${section}`);
    }
    return;
  }

  const results: Result[] = [];
  let httpCount = 0;

  for (const { key, citation, section } of mediumEntries) {
    if (!section) {
      console.log(`  [PARSE]  ${key} → unparseable`);
      results.push({ key, citation, url: '', valid: false, upgraded: false, parseError: true });
      continue;
    }
    const url = `${WA_BASE}${section}`;
    let valid = false;
    try {
      const body = await fetchText(url);
      httpCount++;
      valid = isSectionValid(body);
    } catch (err) {
      console.log(`  [ERR]  ${key} → ${(err as Error).message}`);
      results.push({ key, citation, url, valid: false, upgraded: false });
      await sleep(RATE_LIMIT_MS);
      continue;
    }
    console.log(`  ${valid ? '[OK] ' : '[FAIL]'} ${key} → ${citation}`);
    if (!valid) console.log(`         section not found: ${section}`);
    results.push({ key, citation, url, valid, upgraded: false });
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nHTTP requests: ${httpCount}`);

  if (!APPLY) {
    const outDir = path.join(process.cwd(), 'scripts/data-review/output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'wa-citations-output.json'), JSON.stringify(results, null, 2));
    return;
  }

  console.log('\nApplying to overlay...');
  let updated = readOverlay(OVERLAY_PATH);
  let upgraded = 0, kept = 0;

  for (const r of results) {
    if (r.parseError) continue;
    if (r.valid) {
      updated = patchOverlayEntry(updated, r.key, {
        confidence: 'high', lastVerified: VERIFIED_MONTH,
        source: 'Washington Legislature — app.leg.wa.gov/rcw',
        sourceUrl: r.url,
      });
      console.log(`  [upgraded → high] ${r.key}`);
      r.upgraded = true; upgraded++;
    } else {
      console.log(`  [kept medium]     ${r.key}`);
      kept++;
    }
  }

  fs.writeFileSync(OVERLAY_PATH, updated, 'utf8');
  console.log(`\n  Upgraded to high : ${upgraded}`);
  console.log(`  Kept medium      : ${kept}`);
  console.log(`  Parse errors     : ${results.filter(r => r.parseError).length}`);
  console.log(`✓ Overlay updated: ${OVERLAY_PATH}`);

  const outDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'wa-citations-output.json'), JSON.stringify(results, null, 2));

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${upgraded}`);
  console.log(`  Not confirmed    : ${kept}`);
  console.log(`  Total processed  : ${results.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
