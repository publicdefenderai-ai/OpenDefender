/**
 * Federal Regulatory Monitor — OpenDefender
 *
 * Adapted from anthropics/claude-for-legal (Apache 2.0) © Anthropic PBC
 * https://github.com/anthropics/claude-for-legal/tree/main/managed-agent-cookbooks/reg-monitor
 *
 * Watches federal regulatory feeds for changes relevant to criminal law,
 * public defense, immigration enforcement, and sentencing policy.
 * Outputs a screened digest for human review — not a legal assessment.
 *
 * Feeds monitored:
 *   - Federal Register: DOJ, BOP, DEA, EOIR (public API, no key required)
 *   - US Sentencing Commission: amendments and guidelines pages (HEAD check)
 *   - Bureau of Justice Statistics: publications page (HEAD check)
 *
 * Outputs: scripts/reg-monitor/output/digest-{YYYY-MM-DD}.json
 *
 * IMPORTANT: All items in the digest are screened leads requiring human
 * review — not legal conclusions and not content update mandates.
 */

import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DigestItem {
  id: string;
  title: string;
  abstract: string;
  agency: string;
  documentType: string;
  publicationDate: string;
  url: string;
  significant: boolean;
  matchedKeywords: string[];
  feed: string;
}

interface HeadCheckResult {
  url: string;
  name: string;
  changed: boolean;
  lastModified?: string;
  etag?: string;
  note: string;
}

interface Digest {
  generatedAt: string;
  lookbackDays: number;
  feedsChecked: string[];
  totalItemsScanned: number;
  materialItems: DigestItem[];
  headChecks: HeadCheckResult[];
  screening: string;
}

// ─── Configuration ─────────────────────────────────────────────────────────────

const LOOKBACK_DAYS = 35; // Slightly over one month to avoid gaps at action boundaries

// Federal Register agencies relevant to criminal law and public defense
const FEDERAL_REGISTER_AGENCIES = [
  'department-of-justice',
  'bureau-of-prisons',
  'drug-enforcement-administration',
  'executive-office-for-immigration-review',
  'united-states-sentencing-commission',
];

// Keywords that indicate relevance to our content areas
const RELEVANCE_KEYWORDS = [
  // Criminal procedure
  'criminal', 'felony', 'misdemeanor', 'offense', 'conviction',
  'prosecution', 'defendant', 'arraignment', 'indictment', 'bail',
  'pretrial', 'plea', 'sentence', 'sentencing', 'incarceration',
  // Rights
  'miranda', 'right to counsel', 'public defender', 'habeas corpus',
  'speedy trial', 'due process', 'fourth amendment', 'fifth amendment',
  // Supervision
  'probation', 'parole', 'supervised release', 'mandatory minimum',
  'supervised', 'reentry', 'recidivism',
  // Immigration-criminal intersection
  'immigration enforcement', 'ice', 'removal', 'deportation',
  'detainer', 'detention', 'bond hearing',
  // Specific programs
  'diversion', 'drug court', 'mental health court', 'expungement',
  'record sealing', 'clemency', 'pardon',
];

// Document types to include from Federal Register
const DOCUMENT_TYPES = ['Rule', 'Proposed Rule', 'Notice'];

// Pages to HEAD-check for changes (ETag / Last-Modified comparison)
const HEAD_CHECK_PAGES = [
  {
    url: 'https://www.ussc.gov/guidelines/amendments-to-guidelines',
    name: 'USSC — Amendments to Guidelines',
  },
  {
    url: 'https://www.ussc.gov/guidelines/guidelines-manual',
    name: 'USSC — Guidelines Manual',
  },
  {
    url: 'https://bjs.ojp.gov/library/publications/list',
    name: 'BJS — Publications List',
  },
  {
    url: 'https://www.ussc.gov/research/research-publications',
    name: 'USSC — Research Publications',
  },
];

// State file to track previous HEAD check values
const STATE_FILE = path.join(__dirname, 'output', 'head-check-state.json');
const OUTPUT_DIR = path.join(__dirname, 'output');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLookbackDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - LOOKBACK_DAYS);
  return d.toISOString().split('T')[0];
}

function matchesKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return RELEVANCE_KEYWORDS.filter(kw => lower.includes(kw));
}

function loadHeadCheckState(): Record<string, { lastModified?: string; etag?: string }> {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveHeadCheckState(state: Record<string, { lastModified?: string; etag?: string }>): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─── Feed 1: Federal Register API ────────────────────────────────────────────

async function checkFederalRegister(): Promise<{
  items: DigestItem[];
  totalScanned: number;
}> {
  const sinceDate = getLookbackDate();
  const items: DigestItem[] = [];
  let totalScanned = 0;

  const params = new URLSearchParams({
    per_page: '200',
    order: 'newest',
    'conditions[publication_date][gte]': sinceDate,
    'fields[]': 'title,abstract,agencies,document_type,publication_date,html_url,significant,document_number',
  });

  FEDERAL_REGISTER_AGENCIES.forEach(agency => {
    params.append('conditions[agencies][]', agency);
  });

  DOCUMENT_TYPES.forEach(type => {
    params.append('conditions[type][]', type);
  });

  const url = `https://www.federalregister.gov/api/v1/documents.json?${params}`;

  console.log(`Fetching Federal Register items since ${sinceDate}...`);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'OpenDefender-RegMonitor/1.0 (github.com/publicdefenderai-ai/OpenDefender)' },
    });
  } catch (err) {
    console.error('Federal Register fetch failed:', err);
    return { items, totalScanned };
  }

  if (!response.ok) {
    console.error(`Federal Register API returned ${response.status}`);
    return { items, totalScanned };
  }

  const data = await response.json() as {
    count?: number;
    results?: Array<{
      document_number: string;
      title: string;
      abstract?: string;
      agencies?: Array<{ name: string }>;
      document_type: string;
      publication_date: string;
      html_url: string;
      significant: boolean;
    }>;
  };

  const results = data.results || [];
  totalScanned = results.length;

  for (const doc of results) {
    const searchText = `${doc.title} ${doc.abstract || ''}`;
    const matched = matchesKeywords(searchText);

    if (matched.length === 0) continue;

    const agencyNames = (doc.agencies || []).map((a) => a.name).join(', ');

    items.push({
      id: doc.document_number,
      title: doc.title,
      abstract: doc.abstract || '',
      agency: agencyNames,
      documentType: doc.document_type,
      publicationDate: doc.publication_date,
      url: doc.html_url,
      significant: doc.significant,
      matchedKeywords: matched,
      feed: 'Federal Register',
    });
  }

  console.log(`  Scanned ${totalScanned} documents, found ${items.length} relevant items.`);
  return { items, totalScanned };
}

// ─── Feed 2: HEAD checks for USSC and BJS pages ───────────────────────────────

async function runHeadChecks(): Promise<HeadCheckResult[]> {
  const state = loadHeadCheckState();
  const results: HeadCheckResult[] = [];
  const newState: Record<string, { lastModified?: string; etag?: string }> = { ...state };

  for (const page of HEAD_CHECK_PAGES) {
    console.log(`HEAD check: ${page.name}...`);

    let changed = false;
    let lastModified: string | undefined;
    let etag: string | undefined;
    let note = '';

    try {
      const res = await fetch(page.url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'OpenDefender-RegMonitor/1.0 (github.com/publicdefenderai-ai/OpenDefender)' },
      });

      lastModified = res.headers.get('last-modified') || undefined;
      etag = res.headers.get('etag') || undefined;

      const prev = state[page.url];

      if (!prev) {
        changed = false; // First run — no comparison possible
        note = 'First check — baseline recorded. Compare on next run.';
      } else if (etag && prev.etag && etag !== prev.etag) {
        changed = true;
        note = `ETag changed: ${prev.etag} → ${etag}`;
      } else if (lastModified && prev.lastModified && lastModified !== prev.lastModified) {
        changed = true;
        note = `Last-Modified changed: ${prev.lastModified} → ${lastModified}`;
      } else if (!etag && !lastModified) {
        note = 'No cache headers returned — manual verification recommended.';
      } else {
        note = 'No change detected.';
      }

      newState[page.url] = { lastModified, etag };
    } catch (err) {
      note = `Fetch error: ${err instanceof Error ? err.message : String(err)}`;
    }

    results.push({ url: page.url, name: page.name, changed, lastModified, etag, note });
    console.log(`  ${page.name}: ${note}`);
  }

  saveHeadCheckState(newState);
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== OpenDefender Federal Regulatory Monitor ===');
  console.log(`Lookback window: ${LOOKBACK_DAYS} days (since ${getLookbackDate()})`);
  console.log('');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Run both checks
  const [frResult, headChecks] = await Promise.all([
    checkFederalRegister(),
    runHeadChecks(),
  ]);

  const changedPages = headChecks.filter(h => h.changed);
  const materialItems = frResult.items;

  const digest: Digest = {
    generatedAt: new Date().toISOString(),
    lookbackDays: LOOKBACK_DAYS,
    feedsChecked: [
      'Federal Register (DOJ, BOP, DEA, EOIR, USSC)',
      ...HEAD_CHECK_PAGES.map(p => p.name),
    ],
    totalItemsScanned: frResult.totalScanned,
    materialItems,
    headChecks,
    screening:
      'All items are screened leads requiring human review — not legal conclusions ' +
      'and not content update mandates. A human reviewer must assess whether any item ' +
      'requires changes to OpenDefender content before any action is taken.',
  };

  const today = new Date().toISOString().split('T')[0];
  const outputPath = path.join(OUTPUT_DIR, `digest-${today}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(digest, null, 2));

  console.log('');
  console.log('=== Summary ===');
  console.log(`Federal Register items matching keywords: ${materialItems.length}`);
  console.log(`Pages with detected changes: ${changedPages.length}`);
  console.log(`Digest written to: ${outputPath}`);

  // Exit with code 1 if there are material items or changed pages — signals the
  // GitHub Actions workflow to create an issue. This is not an error condition.
  if (materialItems.length > 0 || changedPages.length > 0) {
    console.log('');
    console.log('Material items found — workflow will create a GitHub issue for review.');
    process.exit(1);
  }

  console.log('No material changes detected.');
  process.exit(0);
}

main().catch(err => {
  console.error('Reg monitor failed:', err);
  process.exit(2);
});
