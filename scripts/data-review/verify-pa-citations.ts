/**
 * PA Citation Verifier — OpenLaws API
 *
 * Verifies Pennsylvania statute citations via api.openlaws.us (PA-STAT).
 *
 * PA citation formats:
 *   "18 Pa.C.S. § 5505"           → title_18, section 5505
 *   "42 Pa. Cons. Stat. § 9714"   → title_42, section 9714
 *   "75 Pa. Cons. Stat. § 3736"   → title_75, section 3736
 *   "72 P.S. § 7354"              → unconsolidated (likely not in OpenLaws PA-STAT)
 *   "47 Pa. Cons. Stat. § 4-493"  → title_47, section 4-493
 *
 * PA OpenLaws path structure (for title 18):
 *   title_18 → part_{roman} → article_{letter} → chapter_{N} → subchapter_{alpha} → section_{NNNN}
 *   Sometimes subchapter is absent: → chapter_{N} → section_{NNNN}
 *
 * Strategy:
 *   1. For each citation: extract title number and section identifier.
 *   2. Build a chapter map for each title by traversing: title → parts → articles → chapters.
 *      Cache all discovered chapter paths.
 *   3. For each chapter: try getting its children (subchapters or sections).
 *   4. Match the section identifier (with and without subchapter level).
 *   5. Keep medium if path cannot be found (OpenLaws gaps or unconsolidated statutes).
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-pa-citations.ts [--dry-run] [--apply]
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';

const DRY_RUN = process.argv.includes('--dry-run');
const APPLY   = process.argv.includes('--apply');

const RATE_LIMIT_MS  = 400;
const VERIFIED_MONTH = new Date().toISOString().slice(0, 7);
const OVERLAY_PATH   = path.join(process.cwd(), 'shared/criminal-charge-citations.ts');
const OL_BASE        = 'https://api.openlaws.us/api/v1';
const UA             = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36';

const OPENLAWS_API_KEY = process.env.OPENLAWS_API_KEY || '';

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

async function olGet(p: string): Promise<any> {
  const res = await fetch(`${OL_BASE}${p}`, {
    headers: {
      'User-Agent': UA,
      'Authorization': `Bearer ${OPENLAWS_API_KEY}`,
      'Accept': 'application/json',
    },
  });
  return res.json();
}

/** Parse PA citation → { title, sectionNum, sectionKey } or null.
 *  "18 Pa.C.S. § 5505"       → { title: 18, sectionNum: '5505', sectionKey: 'section_5505' }
 *  "42 Pa. Cons. Stat. § 9714" → { title: 42, sectionNum: '9714', sectionKey: 'section_9714' }
 *  "72 P.S. § 7354"          → { title: 72, sectionNum: '7354', sectionKey: 'section_7354' }
 *  "47 Pa. Cons. Stat. § 4-493(1)" → { title: 47, sectionNum: '4-493', sectionKey: 'section_4-493' }
 *  "18 Pa.C.S. §§ 901, 3124.1" → first section only
 */
function parsePaCitation(citation: string): { title: number; sectionNum: string; sectionKey: string } | null {
  // Multi-citation: use first
  const norm = citation.replace(/§§\s*/, '§ ');

  // Pattern: "72 P.S. § 7354" or "18 Pa.C.S. § 5505" or "42 Pa. Cons. Stat. § 9714"
  const titleMatch = norm.match(/^(\d+)\s+(?:Pa\.?C?\.?S\.?|Pa\.?\s*Cons\.?\s*Stat\.?|P\.S\.)\s*§\s*/i);
  if (!titleMatch) return null;
  const title = parseInt(titleMatch[1]);

  // Extract section number after "§": digits, optionally followed by hyphen+digits, dot+digits, or letter
  const afterMark = norm.slice(norm.indexOf('§') + 1).trim();
  const secMatch = afterMark.match(/^([\d]+(?:[.-][\d]+)*(?:\.\d+)?(?:[a-z](?!\d))?)/i);
  if (!secMatch) return null;

  const sectionNum = secMatch[1].replace(/\(.*/, ''); // strip subsections
  const sectionKey = 'section_' + sectionNum.replace(/\./g, '_').replace(/-/g, '_');
  return { title, sectionNum, sectionKey };
}

// ─── Chapter path cache ─────────────────────────────────────────────────────
// title → chapterNum → list of possible chapter paths (may have subchapters)
const chapterPathCache = new Map<number, Map<number, string[]>>();
const titleBuildStarted = new Set<number>();

/** Determine chapter number from PA section number.
 *
 *  PA section formats:
 *  "5505"     → chapter 55  (4-digit: first 2 digits)
 *  "9714"     → chapter 97  (4-digit)
 *  "3124.1"   → base 3124 → chapter 31
 *  "306"      → chapter 3   (3-digit: first digit)
 *  "1786"     → chapter 17  (4-digit)
 *  "459-305"  → chapter 459 (dashed: first component is the chapter)
 *  "13-1333"  → chapter 13  (dashed: first component)
 *  "4-406"    → chapter 4   (dashed: first component)
 *  "1279.105" → base 1279 → chapter 12 (hmm, 1279/100=12)
 */
function inferChapterNum(sectionNum: string): number | null {
  // Dashed section: "459-305", "13-1333", "4-406" — chapter = first component
  if (sectionNum.includes('-')) {
    const firstPart = sectionNum.split('-')[0];
    const n = parseInt(firstPart);
    return isNaN(n) ? null : n;
  }

  // Decimal section: strip decimal part to get base
  const baseStr = sectionNum.split('.')[0];
  const n = parseInt(baseStr);
  if (isNaN(n)) return null;

  // Unified rule: chapter = Math.floor(section / 100)
  //   306  → 3  (chapter 3: Culpability)
  //   901  → 9  (chapter 9: Inchoate Crimes)
  //   5505 → 55 (chapter 55: Riot, Disorderly Conduct)
  //   9714 → 97 (chapter 97: Sentencing)
  //   3124 → 31 (chapter 31: Sexual Offenses)
  //   1786 → 17, 4132 → 41, 6114 → 61, etc.
  if (n < 100) return n;                         // very short section numbers: is itself
  return Math.floor(n / 100);
}

/** Walk a PA title and build chapter → paths cache.
 *  Traversal: title → parts → articles → chapters */
async function buildChapterMap(title: number): Promise<void> {
  if (titleBuildStarted.has(title)) return;
  titleBuildStarted.add(title);

  const chapterMap = new Map<number, string[]>();
  chapterPathCache.set(title, chapterMap);

  const titleKey = `title_${title}`;
  const titleData = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${titleKey}?depth=1`);
  await sleep(RATE_LIMIT_MS);
  const parts: Array<{ path: string }> = titleData?.display_children || [];

  for (const part of parts) {
    if (!part.path) continue;
    const partData = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${part.path}?depth=1`);
    await sleep(RATE_LIMIT_MS);
    const partChildren: Array<{ path: string; division_type?: string }> = partData?.display_children || [];

    for (const child of partChildren) {
      if (!child.path) continue;
      // child may be article or chapter directly
      if (child.path.includes('.chapter_')) {
        const chNum = parseInt(child.path.split('.chapter_').pop() || '');
        if (!isNaN(chNum)) {
          const existing = chapterMap.get(chNum) || [];
          existing.push(child.path);
          chapterMap.set(chNum, existing);
        }
      } else {
        // probably an article — get its chapters
        const artData = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${child.path}?depth=1`);
        await sleep(RATE_LIMIT_MS);
        const artChildren: Array<{ path: string }> = artData?.display_children || [];
        for (const ch of artChildren) {
          if (!ch.path || !ch.path.includes('.chapter_')) continue;
          const chNum = parseInt(ch.path.split('.chapter_').pop() || '');
          if (!isNaN(chNum)) {
            const existing = chapterMap.get(chNum) || [];
            existing.push(ch.path);
            chapterMap.set(chNum, existing);
          }
        }
      }
    }
  }
}

/** Try to find a section within a chapter path. Handles both:
 *  - Direct: chapterPath.section_{N}
 *  - Via subchapter: chapterPath.subchapter_{X}.section_{N}
 */
async function findSectionInChapter(chapterPath: string, sectionKey: string): Promise<string | null> {
  // Try direct first
  const directPath = `${chapterPath}.${sectionKey}`;
  const direct = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${directPath}`);
  await sleep(RATE_LIMIT_MS);
  if (direct?.identifier || direct?.display_name) return directPath;

  // Get chapter's children (may be subchapters)
  const chData = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${chapterPath}?depth=1`);
  await sleep(RATE_LIMIT_MS);
  const children: Array<{ path: string }> = chData?.display_children || [];

  for (const sub of children) {
    if (!sub.path || !sub.path.includes('.subchapter_')) continue;
    const subPath = `${sub.path}.${sectionKey}`;
    const subData = await olGet(`/jurisdictions/PA/laws/PA-STAT/divisions/${subPath}`);
    await sleep(RATE_LIMIT_MS);
    if (subData?.identifier || subData?.display_name) return subPath;
  }

  return null;
}

/** Verify a PA section. Returns found path or null. */
async function verifyPaSection(title: number, sectionNum: string, sectionKey: string): Promise<string | null> {
  await buildChapterMap(title);
  const chapterMap = chapterPathCache.get(title);
  if (!chapterMap || chapterMap.size === 0) return null;

  // Infer chapter from section number
  const chapterNum = inferChapterNum(sectionNum);
  if (chapterNum === null) return null;

  const chapterPaths = chapterMap.get(chapterNum);
  if (!chapterPaths || chapterPaths.length === 0) {
    // Try adjacent chapters (±1) in case of off-by-one in chapter inference
    for (const delta of [-1, 1]) {
      const adj = chapterMap.get(chapterNum + delta);
      if (adj) {
        for (const cp of adj) {
          const found = await findSectionInChapter(cp, sectionKey);
          if (found) return found;
        }
      }
    }
    return null;
  }

  for (const cp of chapterPaths) {
    const found = await findSectionInChapter(cp, sectionKey);
    if (found) return found;
  }
  return null;
}

// ─── Overlay helpers ─────────────────────────────────────────────────────────

function readOverlay() { return fs.readFileSync(OVERLAY_PATH, 'utf8'); }

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

// ─── Main ────────────────────────────────────────────────────────────────────

interface Result {
  key: string; citation: string; foundPath: string | null; upgraded: boolean; parseError?: boolean;
}

async function main() {
  if (!OPENLAWS_API_KEY) {
    console.error('OPENLAWS_API_KEY not set'); process.exit(1);
  }

  console.log('PA Citation Verifier (OpenLaws API)');
  console.log('────────────────────────────────────');

  const overlay = readOverlay();
  const paKeys  = criminalCharges.filter(c => c.jurisdiction === 'PA').map(c => c.id);
  const mediumEntries: { key: string; citation: string; parsed: ReturnType<typeof parsePaCitation> }[] = [];

  for (const key of paKeys) {
    const entry = getOverlayEntry(overlay, key);
    if (!entry || entry.confidence !== 'medium') continue;
    mediumEntries.push({ key, citation: entry.citation, parsed: parsePaCitation(entry.citation) });
  }

  console.log(`PA charges total      : ${paKeys.length}`);
  console.log(`Medium entries        : ${mediumEntries.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY-RUN (no HTTP)' : APPLY ? 'APPLY to overlay' : 'JSON output only'}`);
  console.log(`Source                : api.openlaws.us (PA-STAT)`);
  console.log('');

  if (DRY_RUN) {
    for (const { key, citation, parsed } of mediumEntries) {
      if (!parsed) { console.log(`  [PARSE ERR] ${key} → "${citation}"`); continue; }
      const chNum = inferChapterNum(parsed.sectionNum);
      console.log(`  ${key} → ${citation}  →  title_${parsed.title}...chapter_${chNum}.${parsed.sectionKey}`);
    }
    return;
  }

  const results: Result[] = [];

  for (const { key, citation, parsed } of mediumEntries) {
    if (!parsed) {
      console.log(`  [PARSE]  ${key} → unparseable`);
      results.push({ key, citation, foundPath: null, upgraded: false, parseError: true });
      continue;
    }

    let foundPath: string | null = null;
    try {
      foundPath = await verifyPaSection(parsed.title, parsed.sectionNum, parsed.sectionKey);
    } catch (err) {
      console.log(`  [ERR]    ${key} → ${(err as Error).message}`);
      results.push({ key, citation, foundPath: null, upgraded: false });
      continue;
    }

    const valid = foundPath !== null;
    console.log(`  ${valid ? '[OK] ' : '[FAIL]'} ${key} → ${citation}`);
    if (!valid) console.log(`         section ${parsed.sectionNum} not found in title_${parsed.title}`);
    results.push({ key, citation, foundPath, upgraded: false });
  }

  if (!APPLY) {
    const outDir = path.join(process.cwd(), 'scripts/data-review/output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'pa-citations-output.json'), JSON.stringify(results, null, 2));
    return;
  }

  console.log('\nApplying to overlay...');
  let updated = readOverlay();
  let upgraded = 0, kept = 0;

  for (const r of results) {
    if (r.parseError) continue;
    if (r.foundPath) {
      const sourceUrl = `https://static.openlaws.us/laws/pa/stat/${r.foundPath.replace(/\./g, '/')}`;
      updated = patchOverlayEntry(updated, r.key, {
        confidence: 'high', lastVerified: VERIFIED_MONTH,
        source: 'Pennsylvania Consolidated Statutes — api.openlaws.us',
        sourceUrl,
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
  fs.writeFileSync(path.join(outDir, 'pa-citations-output.json'), JSON.stringify(results, null, 2));

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${upgraded}`);
  console.log(`  Not confirmed    : ${kept}`);
  console.log(`  Total processed  : ${results.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
