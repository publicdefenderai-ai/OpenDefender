/**
 * Quarterly Data Review — Report Generator
 *
 * Reads the diff JSON files produced by the checker scripts and opens a
 * GitHub Issue summarising what needs manual attention this quarter.
 *
 * Requires env vars: GITHUB_TOKEN, GITHUB_REPOSITORY (set automatically in CI)
 * Run manually: GITHUB_TOKEN=... GITHUB_REPOSITORY=owner/repo npx tsx scripts/data-review/generate-report.ts
 */

import fs from 'fs';
import path from 'path';

interface DiffFile {
  runAt: string;
  totalChecked: number;
  okCount: number;
  needsReviewCount: number;
  results: Array<{
    name: string;
    status: string;
    needsManualReview: boolean;
    reason?: string;
    redirectedTo?: string;
    httpStatus?: number;
    errorMessage?: string;
  }>;
}

function readDiff(filename: string): DiffFile | null {
  const filePath = path.join(process.cwd(), 'scripts/data-review/output', filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as DiffFile;
  } catch {
    return null;
  }
}

function formatSection(title: string, diff: DiffFile | null): string {
  if (!diff) return `### ${title}\n_Checker did not run or output not found._\n`;

  const reviewItems = diff.results.filter(r => r.needsManualReview);
  const lines = [
    `### ${title}`,
    `- **Checked:** ${diff.totalChecked} | **OK:** ${diff.okCount} | **Need review:** ${diff.needsReviewCount}`,
    `- **Run at:** ${diff.runAt}`,
    '',
  ];

  if (reviewItems.length === 0) {
    lines.push('✅ All entries passed automated checks.');
  } else {
    lines.push('| Organization | Issue |');
    lines.push('|---|---|');
    for (const item of reviewItems) {
      const issue = item.reason ?? item.errorMessage ?? item.status;
      lines.push(`| ${item.name} | ${issue} |`);
    }
  }

  return lines.join('\n');
}

async function createGitHubIssue(title: string, body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    console.log('No GITHUB_TOKEN / GITHUB_REPOSITORY — printing report to stdout instead:\n');
    console.log(`# ${title}\n\n${body}`);
    return;
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({ title, body, labels: ['data-review', 'quarterly'] }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  const issue = await response.json() as { html_url: string; number: number };
  console.log(`✅ Created GitHub issue #${issue.number}: ${issue.html_url}`);
}

async function main() {
  const legalAid = readDiff('legal-aid-diff.json');
  const detention = readDiff('detention-diff.json');
  const consulates = readDiff('consulate-diff.json');
  const statutes = readDiff('statutes-diff.json');
  const publicDefenders = readDiff('public-defenders-diff.json');

  const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
  const year = new Date().getFullYear();
  const title = `Quarterly Data Review — Q${quarter} ${year}`;

  const totalIssues = [legalAid, detention, consulates, statutes, publicDefenders]
    .filter(Boolean)
    .reduce((sum, d) => sum + (d?.needsReviewCount ?? 0), 0);

  const body = [
    `## Quarterly Data Accuracy Review — Q${quarter} ${year}`,
    '',
    totalIssues === 0
      ? '✅ **All automated checks passed.** No manual action required this quarter.'
      : `⚠️ **${totalIssues} item(s) need manual verification** before next quarter. Assign to the team member responsible for data accuracy.`,
    '',
    '---',
    '',
    formatSection('Legal Aid Organizations', legalAid),
    '',
    formatSection('ICE Detention Facilities', detention),
    '',
    formatSection('Consulate Information', consulates),
    '',
    formatSection('Federal Statute URLs (Cornell LII)', statutes),
    '',
    formatSection('Public Defender Offices', publicDefenders),
    '',
    '---',
    '',
    '**Manual review checklist for flagged items:**',
    '- [ ] Visit each flagged website and confirm the org/statute is still active',
    '- [ ] Verify phone numbers via a test call or official directory',
    '- [ ] Update `server/data/legal-aid-organizations-seed.ts` with corrections (covers both legal aid orgs and public defender offices)',
    '- [ ] If a statute URL has changed or statute was amended, update `server/data/federal-statutes-seed.ts` with the corrected URL and any updated statutory text',
    '- [ ] Re-run the seed against the database (`npm run db:seed`)',
    '- [ ] Update the Last Updated comment in the seed file',
    '- [ ] Close this issue once all corrections are applied',
    '',
    '_Generated automatically by `.github/workflows/quarterly-data-review.yml`_',
  ].join('\n');

  await createGitHubIssue(title, body);
}

main().catch(err => { console.error(err); process.exit(1); });
