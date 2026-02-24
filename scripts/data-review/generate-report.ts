/**
 * GitHub Issue Report Generator
 *
 * Reads the three diff JSON files produced by the checker scripts and
 * creates a structured GitHub Issue with a reviewer checklist.
 *
 * Run: npx tsx scripts/data-review/generate-report.ts
 * Env: GITHUB_TOKEN, GITHUB_REPOSITORY (e.g. "shahabasghar/PublicDefenderAI")
 */

import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DiffReport, DiffItem } from './utils/diff.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, 'output');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY ?? '';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getQuarter(): string {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

async function readDiff(filename: string): Promise<DiffReport | null> {
  try {
    const raw = await readFile(resolve(OUTPUT_DIR, filename), 'utf-8');
    return JSON.parse(raw) as DiffReport;
  } catch {
    return null; // File absent if that checker didn't run
  }
}

function severityEmoji(severity: DiffItem['severity']): string {
  return { critical: '🚨', high: '⚠️', medium: '📋', low: '💡' }[severity];
}

function changeTypeLabel(type: DiffItem['changeType']): string {
  return (
    {
      phone_changed: 'Phone Changed',
      address_changed: 'Address Changed',
      website_down: 'Website Down',
      not_found_on_source: 'Not Found on Source',
      new_on_source: 'New on Source',
      capacity_changed: 'Capacity Changed',
      manual_required: 'Manual Verification Required',
      inactive_reactivate: 'Possibly Inactive',
    }[type] ?? type
  );
}

// ─── Markdown Builders ─────────────────────────────────────────────────────────

function renderDiffSection(report: DiffReport): string {
  const titleMap: Record<DiffReport['category'], string> = {
    'detention-facilities': 'ICE Detention Facilities',
    consulates: 'Consulates',
    'legal-aid': 'Legal Aid Organizations',
  };
  const title = titleMap[report.category];
  const { stats } = report;

  const automatedItems = report.items.filter((i) => i.changeType !== 'manual_required');
  const manualItems = report.items.filter((i) => i.changeType === 'manual_required');

  let section = `## ${title}\n\n`;

  if (!report.sourceAvailable) {
    section += `> ⚠️ **External source was unavailable.** Results based on Google Places only.\n\n`;
  }
  if (report.errors.length > 0) {
    section += `> **Checker errors:**\n`;
    for (const e of report.errors) {
      section += `> - ${e}\n`;
    }
    section += '\n';
  }

  section += `**Checked:** ${stats.checked} | **Changes:** ${stats.automatedChanges} | **New:** ${stats.newOnSource} | **Not found:** ${stats.notFoundOnSource} | **Manual only:** ${stats.manualOnly}\n\n`;

  // Automated findings
  if (automatedItems.length === 0) {
    section += `### ✅ No Automated Changes Detected\n\n`;
  } else {
    section += `### Automated Findings\n\n`;
    for (const item of automatedItems) {
      const emoji = severityEmoji(item.severity);
      section += `- [ ] ${emoji} **${item.name}** — ${changeTypeLabel(item.changeType)}\n`;
      if (item.storedValue) section += `  - Stored: \`${item.storedValue}\`\n`;
      if (item.sourceValue) section += `  - Source: \`${item.sourceValue}\`\n`;
      if (item.notes) section += `  - Notes: ${item.notes}\n`;
      if (item.verifyUrl && !item.verifyUrl.startsWith('tel:')) {
        section += `  - Verify: [source link](${item.verifyUrl})\n`;
      }
      section += '\n';
    }
  }

  // Manual-only items
  if (manualItems.length > 0) {
    section += `### Manual Verification Required\n`;
    section += `*(These items have no automated source — each requires a direct check or phone call)*\n\n`;
    for (const item of manualItems) {
      section += `- [ ] **${item.name}**`;
      if (item.storedValue && item.storedValue !== '(not set)') {
        section += ` — stored: \`${item.storedValue}\``;
      }
      section += '\n';
      if (item.notes) section += `  - ${item.notes}\n`;
      section += '\n';
    }
  }

  return section;
}

function buildIssueBody(
  detention: DiffReport | null,
  consulates: DiffReport | null,
  legalAid: DiffReport | null,
): string {
  const quarter = getQuarter();
  const now = new Date().toUTCString();

  let totalChanges = 0;
  let totalNew = 0;
  let totalMissing = 0;
  let totalManual = 0;

  for (const r of [detention, consulates, legalAid]) {
    if (!r) continue;
    totalChanges += r.stats.automatedChanges;
    totalNew += r.stats.newOnSource;
    totalMissing += r.stats.notFoundOnSource;
    totalManual += r.stats.manualOnly;
  }

  let body = `# Quarterly Data Review — ${quarter}

*Generated automatically on ${now}.*
*Estimated review time: 3–4 hours. See [REVIEW-PLAYBOOK.md](../scripts/data-review/REVIEW-PLAYBOOK.md) for step-by-step instructions.*

---

## Summary

| Category | Checked | Changes | New | Not Found | Manual-Only |
|----------|---------|---------|-----|-----------|-------------|
`;

  for (const [label, r] of [
    ['ICE Detention Facilities', detention],
    ['Consulates', consulates],
    ['Legal Aid Organizations', legalAid],
  ] as [string, DiffReport | null][]) {
    if (r) {
      body += `| ${label} | ${r.stats.checked} | ${r.stats.automatedChanges} | ${r.stats.newOnSource} | ${r.stats.notFoundOnSource} | ${r.stats.manualOnly} |\n`;
    } else {
      body += `| ${label} | — | — | — | — | — (checker did not run) |\n`;
    }
  }

  body += `| **Total** | — | **${totalChanges}** | **${totalNew}** | **${totalMissing}** | **${totalManual}** |\n\n`;
  body += `---\n\n`;

  // Render each section
  if (detention) body += renderDiffSection(detention) + '---\n\n';
  if (consulates) body += renderDiffSection(consulates) + '---\n\n';
  if (legalAid) body += renderDiffSection(legalAid) + '---\n\n';

  body += `## Review Checklist

Before closing this issue, confirm:

- [ ] All automated findings above have been reviewed and actioned or commented on
- [ ] All manual verification items above have been completed
- [ ] Source files updated: \`shared/data/detention-facilities.ts\`, \`shared/data/consulates.ts\`, \`server/data/legal-aid-organizations-seed.ts\`
- [ ] \`lastUpdated\` comments updated in each modified file
- [ ] PR opened, reviewed, and merged
- [ ] If DB seed data changed, confirmed with \`npm run db:push\` on staging

---

*This issue was created automatically by the [quarterly-data-review workflow](../../.github/workflows/quarterly-data-review.yml). Next run: in approximately 90 days.*
`;

  return body;
}

// ─── GitHub API ────────────────────────────────────────────────────────────────

async function createIssue(title: string, body: string): Promise<string> {
  if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is not set');
  if (!GITHUB_REPOSITORY) throw new Error('GITHUB_REPOSITORY is not set');

  const [owner, repo] = GITHUB_REPOSITORY.split('/');
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['data-review'],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { html_url: string; number: number };
  return data.html_url;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('Reading diff files…');

  const [detention, consulates, legalAid] = await Promise.all([
    readDiff('detention-diff.json'),
    readDiff('consulate-diff.json'),
    readDiff('legal-aid-diff.json'),
  ]);

  if (!detention && !consulates && !legalAid) {
    console.error('No diff files found. Did the checker jobs run?');
    process.exit(1);
  }

  const quarter = getQuarter();
  const title = `Data Review: ${quarter} — Quarterly Contact Info Verification`;
  const body = buildIssueBody(detention, consulates, legalAid);

  console.log(`\nCreating GitHub Issue: "${title}"…`);

  try {
    const issueUrl = await createIssue(title, body);
    console.log(`\n✓ Issue created: ${issueUrl}`);
  } catch (err) {
    // If we can't create the issue (e.g., running locally without a token),
    // print the body so it can be copy-pasted
    console.warn(`Could not create GitHub Issue: ${err}`);
    console.log('\n─── ISSUE BODY (copy-paste manually) ───\n');
    console.log(body);
  }
}

main().catch((err) => {
  console.error('Fatal error in generate-report:', err);
  process.exit(1);
});
