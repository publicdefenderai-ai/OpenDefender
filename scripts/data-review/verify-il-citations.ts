/**
 * IL Citation Verifier
 *
 * Verifies Illinois statute citations against the Illinois General Assembly's
 * static document server (ilga.gov/legislation/ilcs/documents/), which hosts
 * individual ILCS section files as plain HTML.
 *
 * Why the /documents/ endpoint?
 *   The current ilga.gov site is a Blazor SPA that renders section content
 *   client-side — curl cannot see individual sections.  The legacy /documents/
 *   endpoint (still live) hosts each section as a separate static HTML file,
 *   making per-section HTTP verification simple and reliable.
 *
 * URL pattern:
 *   https://www.ilga.gov/legislation/ilcs/documents/{XXXXXXXX}K{section}.htm
 *   where XXXXXXXX = {chapter:04d}{act:04d}0
 *   e.g. 720 ILCS 5/9-2 → documents/072000050K9-2.htm
 *        720 ILCS 570/402 → documents/072005700K402.htm
 *        35 ILCS 735/3-5  → documents/003507350K3-5.htm
 *
 * Detection method:
 *   Valid section   → small HTML file (~2–35 KB) containing "Sec." in first 3 KB.
 *   Invalid/missing → returns the ILCS homepage (~78 KB) with no "Sec." content.
 *   No HTTP 404s are issued for missing sections — content inspection is required.
 *
 * One HTTP request per section (no chapter-level caching possible, since full-act
 * files also return the homepage).  For 98 entries at 400 ms/req ≈ 40 seconds.
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-il-citations.ts [--dry-run] [--apply]
 *
 *   --dry-run   Show each charge + planned URL without HTTP requests.
 *   --apply     Write verified entries into shared/criminal-charge-citations.ts.
 *               (Default: output JSON to scripts/data-review/output/il-citations-output.json)
 *
 * Confidence assigned:
 *   "high"   — section HTML found and contains statute text
 *   "medium" — section not confirmed, or request failed
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

// ── CLI args ──────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400;
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const ILGA_BASE      = 'https://www.ilga.gov/legislation/ilcs/documents';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

/** Build the ILGA document filename for a given chapter, act, and section.
 *  Pattern: {chapter:04d}{act:04d}0K{section}.htm
 *  e.g. chapter=720, act=5, section="9-2" → "072000050K9-2.htm"
 */
function buildIlgaFilename(chapter: number, act: number, section: string): string {
  const ch  = String(chapter).padStart(4, '0');
  const ac  = String(act).padStart(4, '0');
  return `${ch}${ac}0K${section}.htm`;
}

/** Parse an ILCS citation string and return { chapter, act, section } or null. */
function parseIlcsCitation(citation: string): { chapter: number; act: number; section: string } | null {
  // Matches: "720 ILCS 5/9-2"  or  "720 Ill. Comp. Stat. 570/402"
  const m = citation.match(/(\d+)\s+(?:ILCS|Ill\.\s+Comp\.\s+Stat\.)\s+([\d.]+)\/([\S]+)/);
  if (!m) return null;
  const chapter = parseInt(m[1], 10);
  const act     = parseFloat(m[2]);          // handles acts like "5", "570", "570.1"
  const rawSec  = m[3];
  // Strip trailing subsection parentheticals: "9-1(a)" → "9-1", "402(d)(1)" → "402"
  const section = rawSec.replace(/\([^)]*\).*$/, '').replace(/[,;].*$/, '').trim();
  return { chapter, act, section };
}

/** Fetch a URL and return the response body as a string. */
async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept': 'text/html,application/xhtml+xml',
    },
  });
  return res.text();
}

/** Return true if the response body looks like a valid ILCS section page. */
function isSectionValid(body: string): boolean {
  // Valid sections: small file (~2–35 KB) with "Sec." in first 3 KB
  // Invalid (homepage): ~78 KB, no "Sec." in content
  if (body.length > 70_000) return false;
  const snippet = body.slice(0, 3_000);
  return snippet.includes('Sec.');
}

// ── Read overlay ──────────────────────────────────────────────────────────────

function readOverlay(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

/** Extract the citation for a charge key from the overlay text. */
function getOverlayEntry(overlay: string, key: string): { citation: string; confidence: string } | null {
  const re = new RegExp(`"${key}":\\s*\\{([^}]+)\\}`);
  const m  = overlay.match(re);
  if (!m) return null;
  const block = m[1];
  const citM  = block.match(/citation:\s*"([^"]+)"/);
  const conM  = block.match(/confidence:\s*"([^"]+)"/);
  if (!citM || !conM) return null;
  return { citation: citM[1], confidence: conM[1] };
}

/** Patch a single overlay entry (citation + confidence + source fields). */
function patchOverlayEntry(
  overlay: string,
  key: string,
  fields: { citation?: string; confidence: string; source: string; sourceUrl: string; lastVerified: string },
): string {
  const re = new RegExp(
    `("${key}":\\s*\\{\\s*citation:\\s*"[^"]*",\\s*confidence:\\s*"[^"]*",\\s*lastVerified:\\s*"[^"]*",\\s*source:\\s*"[^"]*",\\s*sourceUrl:\\s*"[^"]*"\\s*\\},?)`,
    's',
  );
  const existing = overlay.match(new RegExp(`"${key}":\\s*\\{([^}]+)\\}`));
  if (!existing) return overlay;

  const block   = existing[1];
  const citM    = block.match(/citation:\s*"([^"]+)"/);
  const oldCit  = citM ? citM[1] : '';
  const newCit  = fields.citation ?? oldCit;

  const replacement = `"${key}": { citation: "${newCit}", confidence: "${fields.confidence}", lastVerified: "${fields.lastVerified}", source: "${fields.source}", sourceUrl: "${fields.sourceUrl}" }`;

  // Replace the existing entry block
  const entryRe = new RegExp(`"${key}":\\s*\\{[^}]+\\}`, 's');
  return overlay.replace(entryRe, replacement);
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface Result {
  key:       string;
  citation:  string;
  url:       string;
  valid:     boolean;
  upgraded:  boolean;
  parseError?: boolean;
}

async function main() {
  console.log('IL Citation Verifier');
  console.log('────────────────────────────────');

  // Collect IL charges with medium confidence from the overlay
  const overlay = readOverlay(OVERLAY_PATH);

  const ilChargeKeys = criminalCharges
    .filter(c => c.jurisdiction === 'IL')
    .map(c => c.id);

  const mediumEntries: { key: string; citation: string; parsed: ReturnType<typeof parseIlcsCitation> }[] = [];

  for (const key of ilChargeKeys) {
    const entry = getOverlayEntry(overlay, key);
    if (!entry || entry.confidence !== 'medium') continue;
    const parsed = parseIlcsCitation(entry.citation);
    mediumEntries.push({ key, citation: entry.citation, parsed });
  }

  const total = ilChargeKeys.length;
  console.log(`IL charges total      : ${total}`);
  console.log(`Medium entries        : ${mediumEntries.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY-RUN (no HTTP)' : APPLY ? 'APPLY to overlay' : 'JSON output only'}`);
  console.log(`Source                : ilga.gov/legislation/ilcs/documents/ (per-section HTML)`);
  console.log('');

  if (DRY_RUN) {
    for (const { key, citation, parsed } of mediumEntries) {
      if (!parsed) {
        console.log(`  [PARSE ERR] ${key} → "${citation}"`);
        continue;
      }
      const filename = buildIlgaFilename(parsed.chapter, parsed.act, parsed.section);
      console.log(`  ${key} → ${citation}  →  ${ILGA_BASE}/${filename}`);
    }
    return;
  }

  // ── Verify each entry ────────────────────────────────────────────────────────

  const results: Result[] = [];
  let httpCount = 0;

  for (const { key, citation, parsed } of mediumEntries) {
    if (!parsed) {
      console.log(`  [PARSE]  ${key} → "${citation}"  (unparseable — skipped)`);
      results.push({ key, citation, url: '', valid: false, upgraded: false, parseError: true });
      continue;
    }

    const filename = buildIlgaFilename(parsed.chapter, parsed.act, parsed.section);
    const url      = `${ILGA_BASE}/${filename}`;

    let valid = false;
    try {
      const body = await fetchText(url);
      httpCount++;
      valid = isSectionValid(body);
    } catch (err) {
      console.log(`  [ERR]  ${key} → ${citation}  (fetch failed: ${(err as Error).message})`);
      results.push({ key, citation, url, valid: false, upgraded: false });
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    const icon = valid ? '[OK] ' : '[FAIL]';
    console.log(`  ${icon} ${key} → ${citation}`);
    if (!valid) {
      console.log(`         section not found at ${filename}`);
    }

    results.push({ key, citation, url, valid, upgraded: false });
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nOutput written to: scripts/data-review/output/il-citations-output.json`);
  console.log(`HTTP requests made: ${httpCount}`);

  // ── Apply to overlay ─────────────────────────────────────────────────────────

  if (!APPLY) {
    const outDir = path.join(process.cwd(), 'scripts/data-review/output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, 'il-citations-output.json'),
      JSON.stringify(results, null, 2),
    );
    return;
  }

  console.log('\nApplying to overlay...');
  let updated = readOverlay(OVERLAY_PATH);
  let upgraded = 0;
  let kept = 0;

  for (const r of results) {
    if (r.parseError) continue;
    if (r.valid) {
      updated = patchOverlayEntry(updated, r.key, {
        confidence:   'high',
        lastVerified: VERIFIED_MONTH,
        source:       'Illinois General Assembly — ilga.gov',
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
  console.log(`  Already high     : 0`);
  console.log(`  Kept medium      : ${kept}`);
  console.log(`✓ Overlay updated: ${OVERLAY_PATH}`);

  const outDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'il-citations-output.json'),
    JSON.stringify(results, null, 2),
  );

  const parseErrors = results.filter(r => r.parseError).length;
  const notConfirmed = results.filter(r => !r.valid && !r.parseError).length;

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${upgraded}`);
  console.log(`  Not confirmed    : ${notConfirmed}`);
  console.log(`  Parse errors     : ${parseErrors}`);
  console.log(`  Total processed  : ${results.length}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
