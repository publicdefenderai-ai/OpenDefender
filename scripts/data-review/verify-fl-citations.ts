/**
 * FL Citation Verifier
 *
 * Verifies Florida statute citations against the Florida Legislature's Online
 * Sunshine statutes site (leg.state.fl.us).
 *
 * URL pattern:
 *   https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=
 *   {range}/{chap4}/Sections/{chap4}.{section}.html
 *
 *   where:
 *     chap4 = chapter number zero-padded to 4 digits (e.g. 877 → "0877")
 *     range = century band zero-padded, e.g. chapter 877 → "0800-0899"
 *     section = digits after the chapter dot, subsections stripped
 *               e.g. "Fla. Stat. § 877.03"     → section="03"
 *                    "Fla. Stat. § 777.04(1)"   → section="04"
 *                    "Fla. Stat. § 316.192"      → section="192"
 *
 * Detection method:
 *   Both valid and invalid section URLs return HTTP 200.
 *   Valid section pages embed the section number (e.g. "877.03") in the
 *   response body along with the statute text.
 *   Invalid/missing sections return the generic search page (~15 KB) which
 *   does NOT contain the specific section number.
 *   → Check: `{chap}.{section}` string appears in response body.
 *
 * 48 FL medium entries, one HTTP request per section (~400 ms/req ≈ 20 seconds).
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-fl-citations.ts [--dry-run] [--apply]
 *
 *   --dry-run   Show each charge + planned URL without HTTP requests.
 *   --apply     Write verified entries into shared/criminal-charge-citations.ts.
 *               (Default: output JSON to scripts/data-review/output/fl-citations-output.json)
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400;
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const FL_BASE        = 'https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=';
const UA             = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

/** Parse "Fla. Stat. § 782.04" or "Fla. Stat. § 777.04(1)" →
 *  { chapter: 782, section: "04", chap4: "0782", range: "0700-0799" }
 */
function parseFlCitation(citation: string): {
  chapter: number; section: string; chap4: string; range: string;
} | null {
  // Match e.g. "§ 877.03", "§ 316.192(1)(a)", "§ 38.22"
  const m = citation.match(/§\s*(\d+)\.(\d[\d.A-Za-z]*?)(?:\(|,|;|\s|$)/);
  if (!m) return null;
  const chapter = parseInt(m[1], 10);
  const section = m[2];
  const chap4   = String(chapter).padStart(4, '0');
  const base100 = Math.floor(chapter / 100) * 100;
  const range   = `${String(base100).padStart(4, '0')}-${String(base100 + 99).padStart(4, '0')}`;
  return { chapter, section, chap4, range };
}

/** Build the full FL statutes URL for a parsed citation. */
function buildFlUrl(p: NonNullable<ReturnType<typeof parseFlCitation>>): string {
  return `${FL_BASE}${p.range}/${p.chap4}/Sections/${p.chap4}.${p.section}.html`;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
  });
  return res.text();
}

/** Return true if the body contains the specific section (e.g. "877.03") —
 *  present on valid section pages, absent from the generic search page. */
function isSectionValid(body: string, chap4: string, section: string): boolean {
  return body.includes(`${parseInt(chap4, 10)}.${section}`);
}

// ── Overlay helpers ───────────────────────────────────────────────────────────

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
  overlay: string,
  key: string,
  fields: { confidence: string; source: string; sourceUrl: string; lastVerified: string },
): string {
  const existing = overlay.match(new RegExp(`"${key}":\\s*\\{([^}]+)\\}`));
  if (!existing) return overlay;
  const block  = existing[1];
  const citM   = block.match(/citation:\s*"([^"]+)"/);
  const oldCit = citM ? citM[1] : '';
  const replacement = `"${key}": { citation: "${oldCit}", confidence: "${fields.confidence}", lastVerified: "${fields.lastVerified}", source: "${fields.source}", sourceUrl: "${fields.sourceUrl}" }`;
  return overlay.replace(new RegExp(`"${key}":\\s*\\{[^}]+\\}`, 's'), replacement);
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface Result {
  key: string; citation: string; url: string;
  valid: boolean; upgraded: boolean; parseError?: boolean;
}

async function main() {
  console.log('FL Citation Verifier');
  console.log('────────────────────────────────');

  const overlay = readOverlay(OVERLAY_PATH);
  const flKeys  = criminalCharges.filter(c => c.jurisdiction === 'FL').map(c => c.id);

  const mediumEntries: { key: string; citation: string; parsed: ReturnType<typeof parseFlCitation> }[] = [];
  for (const key of flKeys) {
    const entry = getOverlayEntry(overlay, key);
    if (!entry || entry.confidence !== 'medium') continue;
    mediumEntries.push({ key, citation: entry.citation, parsed: parseFlCitation(entry.citation) });
  }

  console.log(`FL charges total      : ${flKeys.length}`);
  console.log(`Medium entries        : ${mediumEntries.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY-RUN (no HTTP)' : APPLY ? 'APPLY to overlay' : 'JSON output only'}`);
  console.log(`Source                : leg.state.fl.us (Florida Online Sunshine)`);
  console.log('');

  if (DRY_RUN) {
    for (const { key, citation, parsed } of mediumEntries) {
      if (!parsed) { console.log(`  [PARSE ERR] ${key} → "${citation}"`); continue; }
      console.log(`  ${key} → ${citation}  →  ${buildFlUrl(parsed)}`);
    }
    return;
  }

  const results: Result[] = [];
  let httpCount = 0;

  for (const { key, citation, parsed } of mediumEntries) {
    if (!parsed) {
      console.log(`  [PARSE]  ${key} → "${citation}"  (unparseable — skipped)`);
      results.push({ key, citation, url: '', valid: false, upgraded: false, parseError: true });
      continue;
    }

    const url = buildFlUrl(parsed);
    let valid = false;
    try {
      const body = await fetchText(url);
      httpCount++;
      valid = isSectionValid(body, parsed.chap4, parsed.section);
    } catch (err) {
      console.log(`  [ERR]  ${key} → ${citation}  (${(err as Error).message})`);
      results.push({ key, citation, url, valid: false, upgraded: false });
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    console.log(`  ${valid ? '[OK] ' : '[FAIL]'} ${key} → ${citation}`);
    if (!valid) console.log(`         section not found: ${parsed.chap4}.${parsed.section}`);
    results.push({ key, citation, url, valid, upgraded: false });
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nHTTP requests: ${httpCount}`);

  if (!APPLY) {
    const outDir = path.join(process.cwd(), 'scripts/data-review/output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'fl-citations-output.json'), JSON.stringify(results, null, 2));
    console.log('Output: scripts/data-review/output/fl-citations-output.json');
    return;
  }

  console.log('\nApplying to overlay...');
  let updated = readOverlay(OVERLAY_PATH);
  let upgraded = 0, kept = 0;

  for (const r of results) {
    if (r.parseError) continue;
    if (r.valid) {
      updated = patchOverlayEntry(updated, r.key, {
        confidence:   'high',
        lastVerified: VERIFIED_MONTH,
        source:       'Florida Legislature Online Sunshine — leg.state.fl.us',
        sourceUrl:    r.url,
      });
      console.log(`  [upgraded → high] ${r.key}`);
      r.upgraded = true;
      upgraded++;
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
  fs.writeFileSync(path.join(outDir, 'fl-citations-output.json'), JSON.stringify(results, null, 2));

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${upgraded}`);
  console.log(`  Not confirmed    : ${kept}`);
  console.log(`  Total processed  : ${results.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
