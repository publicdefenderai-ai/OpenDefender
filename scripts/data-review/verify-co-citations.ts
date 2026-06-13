/**
 * CO Citation Verifier — OpenLaws API
 *
 * Verifies Colorado Revised Statutes citations via api.openlaws.us.
 *
 * CO citation format: "Colo. Rev. Stat. § T-A-S" → title=T, article=A, section="T-A-S"
 * OpenLaws path:      title_{T}.article_{A}.part_{P}.section_{T_A_S}
 *   (where {T_A_S} = "T-A-S" with hyphens → underscores)
 *
 * For title 42 (Vehicles & Traffic): article lives under a _group_ prefix.
 *   Path: title_42._group_{name}.article_{A}.part_{P}.section_{T_A_S}
 *
 * Algorithm:
 *   1. Pre-build article→path map for all unique (title, article) pairs.
 *   2. For title_42: fetch group structure to find which group holds each article.
 *   3. Fetch article children (depth=1) to discover parts. Cache per article path.
 *   4. For each section: try {article_path}.{part}.section_{T_A_S} for each part.
 *   5. Also try {article_path}.section_{T_A_S} (articles without parts).
 *
 * Usage:
 *   npx tsx scripts/data-review/verify-co-citations.ts [--dry-run] [--apply]
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

let OPENLAWS_API_KEY = process.env.OPENLAWS_API_KEY || '';

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

/** Parse CO citation → { title, articleStr, sectionId } or null.
 *  "Colo. Rev. Stat. § 18-9-106"     → { title:18, articleStr:"9",   sectionId:"18-9-106" }
 *  "Colo. Rev. Stat. § 18-5.5-102"   → { title:18, articleStr:"5.5", sectionId:"18-5.5-102" }
 *  "Colo. Rev. Stat. §§ 18-4-302, 18-4-201" → first citation only
 */
function parseCoSection(citation: string): { title: number; articleStr: string; sectionId: string } | null {
  // strip subsections like (1)(b); use first citation from §§ list
  const norm = citation.replace(/\([\w()]+\)/g, '').replace(/§§?\s*/, '§ ');
  // article may contain a dot like "5.5" or "1.3" — match [\d.]+ for article
  const m = norm.match(/§\s*(\d+)-([\d.]+)-([\d.]+)/);
  if (!m) return null;
  const sectionId = `${m[1]}-${m[2]}-${m[3]}`;
  return { title: parseInt(m[1]), articleStr: m[2], sectionId };
}

function sectionPathSeg(sectionId: string): string {
  return 'section_' + sectionId.replace(/[-\.]/g, '_');
}

// ─── Caches ────────────────────────────────────────────────────────────────

/** article_path → list of part paths */
const articlePartsCache = new Map<string, string[]>();
/** For title_42: articleStr → full article path (string keys to handle decimals) */
const t42ArticlePathCache = new Map<string, string>();
let t42ArticlePathBuilt = false;

async function buildTitle42ArticleMap(): Promise<void> {
  if (t42ArticlePathBuilt) return;
  t42ArticlePathBuilt = true;
  const groups = await olGet('/jurisdictions/CO/laws/CO-STAT/divisions/title_42?depth=1');
  await sleep(RATE_LIMIT_MS);
  const groupChildren: Array<{ path: string }> = groups?.display_children || [];
  for (const grp of groupChildren) {
    const grpData = await olGet(`/jurisdictions/CO/laws/CO-STAT/divisions/${grp.path}?depth=1`);
    await sleep(RATE_LIMIT_MS);
    const arts: Array<{ path: string; identifier: string }> = grpData?.display_children || [];
    for (const art of arts) {
      if (art.identifier) t42ArticlePathCache.set(art.identifier, art.path);
    }
  }
}

async function getArticlePath(title: number, articleStr: string): Promise<string | null> {
  if (title === 42) {
    await buildTitle42ArticleMap();
    return t42ArticlePathCache.get(articleStr) ?? null;
  }
  // For other titles: direct article path (dot in article number → underscore)
  const articleSeg = 'article_' + articleStr.replace(/\./g, '_');
  return `title_${title}.${articleSeg}`;
}

async function getArticleParts(articlePath: string): Promise<string[]> {
  if (articlePartsCache.has(articlePath)) return articlePartsCache.get(articlePath)!;
  const data = await olGet(`/jurisdictions/CO/laws/CO-STAT/divisions/${articlePath}?depth=1`);
  await sleep(RATE_LIMIT_MS);
  const children: Array<{ path: string; division_type?: string }> = data?.display_children || [];
  const parts = children
    .filter(c => c.path && (c.path.includes('.part_') || !c.path.includes('.section_')))
    .map(c => c.path);
  articlePartsCache.set(articlePath, parts);
  return parts;
}

async function verifySection(articlePath: string, sectionSeg: string): Promise<string | null> {
  // 1. Try direct under article (no part level)
  const directPath = `${articlePath}.${sectionSeg}`;
  const direct = await olGet(`/jurisdictions/CO/laws/CO-STAT/divisions/${directPath}`);
  await sleep(RATE_LIMIT_MS);
  if (!direct?.status || direct.status !== 404 && direct.status !== 400) {
    if (direct?.identifier || direct?.display_name) return directPath;
  }

  // 2. Try each part
  const parts = await getArticleParts(articlePath);
  for (const partPath of parts) {
    const sectionPath = `${partPath}.${sectionSeg}`;
    const data = await olGet(`/jurisdictions/CO/laws/CO-STAT/divisions/${sectionPath}`);
    await sleep(RATE_LIMIT_MS);
    if (!data?.status || data.status !== 404 && data.status !== 400) {
      if (data?.identifier || data?.display_name) return sectionPath;
    }
  }
  return null;
}

// ─── Overlay helpers ────────────────────────────────────────────────────────

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

// ─── Main ───────────────────────────────────────────────────────────────────

interface Result {
  key: string; citation: string; foundPath: string | null; upgraded: boolean; parseError?: boolean;
}

async function main() {
  if (!OPENLAWS_API_KEY) {
    console.error('OPENLAWS_API_KEY not set'); process.exit(1);
  }

  console.log('CO Citation Verifier (OpenLaws API)');
  console.log('────────────────────────────────────');

  const overlay = readOverlay();
  const coKeys  = criminalCharges.filter(c => c.jurisdiction === 'CO').map(c => c.id);
  const mediumEntries: { key: string; citation: string; parsed: ReturnType<typeof parseCoSection> }[] = [];

  for (const key of coKeys) {
    const entry = getOverlayEntry(overlay, key);
    if (!entry || entry.confidence !== 'medium') continue;
    mediumEntries.push({ key, citation: entry.citation, parsed: parseCoSection(entry.citation) });
  }

  console.log(`CO charges total      : ${coKeys.length}`);
  console.log(`Medium entries        : ${mediumEntries.length}`);
  console.log(`Mode                  : ${DRY_RUN ? 'DRY-RUN' : APPLY ? 'APPLY to overlay' : 'JSON output only'}`);
  console.log(`Source                : api.openlaws.us (CO-STAT)`);
  console.log('');

  if (DRY_RUN) {
    for (const { key, citation, parsed } of mediumEntries) {
      if (!parsed) { console.log(`  [PARSE ERR] ${key} → "${citation}"`); continue; }
      const articleSeg = parsed.title === 42
        ? `_group_?.article_${parsed.articleStr}` : `article_${parsed.articleStr.replace(/\./g, '_')}`;
      const secSeg = sectionPathSeg(parsed.sectionId);
      console.log(`  ${key} → ${citation}  →  title_${parsed.title}.${articleSeg}.{part}.${secSeg}`);
    }
    return;
  }

  const results: Result[] = [];
  let apiCalls = 0;

  for (const { key, citation, parsed } of mediumEntries) {
    if (!parsed) {
      console.log(`  [PARSE]  ${key} → unparseable`);
      results.push({ key, citation, foundPath: null, upgraded: false, parseError: true });
      continue;
    }

    const articlePath = await getArticlePath(parsed.title, parsed.articleStr);
    if (!articlePath) {
      console.log(`  [SKIP]   ${key} → article not found in OpenLaws`);
      results.push({ key, citation, foundPath: null, upgraded: false });
      continue;
    }

    const secSeg = sectionPathSeg(parsed.sectionId);
    let foundPath: string | null = null;
    try {
      foundPath = await verifySection(articlePath, secSeg);
      apiCalls++;
    } catch (err) {
      console.log(`  [ERR]    ${key} → ${(err as Error).message}`);
      results.push({ key, citation, foundPath: null, upgraded: false });
      continue;
    }

    const valid = foundPath !== null;
    console.log(`  ${valid ? '[OK] ' : '[FAIL]'} ${key} → ${citation}`);
    if (!valid) console.log(`         section not found: ${parsed.sectionId} in ${articlePath}`);
    results.push({ key, citation, foundPath, upgraded: false });
  }

  console.log(`\nOpenLaws API calls: ~${apiCalls} (plus article/group cache calls)`);

  if (!APPLY) {
    const outDir = path.join(process.cwd(), 'scripts/data-review/output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'co-citations-output.json'), JSON.stringify(results, null, 2));
    return;
  }

  console.log('\nApplying to overlay...');
  let updated = readOverlay();
  let upgraded = 0, kept = 0;

  for (const r of results) {
    if (r.parseError) continue;
    if (r.foundPath) {
      const sourceUrl = `https://static.openlaws.us/laws/co/stat/${r.foundPath.replace(/\./g, '/')}`;
      updated = patchOverlayEntry(updated, r.key, {
        confidence: 'high', lastVerified: VERIFIED_MONTH,
        source: 'Colorado Revised Statutes — api.openlaws.us',
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
  fs.writeFileSync(path.join(outDir, 'co-citations-output.json'), JSON.stringify(results, null, 2));

  console.log('\n── Summary ────────────────────────────────');
  console.log(`  Verified → high  : ${upgraded}`);
  console.log(`  Not confirmed    : ${kept}`);
  console.log(`  Total processed  : ${results.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
