/**
 * Converts the regulatory monitor digest JSON into a GitHub issue.
 * Adapted from anthropics/claude-for-legal (Apache 2.0) © Anthropic PBC
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(__dirname, 'output');

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
  note: string;
}

interface Digest {
  generatedAt: string;
  lookbackDays: number;
  totalItemsScanned: number;
  materialItems: DigestItem[];
  headChecks: HeadCheckResult[];
  screening: string;
}

function findLatestDigest(): string | null {
  if (!fs.existsSync(OUTPUT_DIR)) return null;
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('digest-') && f.endsWith('.json'))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(OUTPUT_DIR, files[0]) : null;
}

function buildIssueBody(digest: Digest): string {
  const date = digest.generatedAt.split('T')[0];
  const changedPages = digest.headChecks.filter(h => h.changed);

  let body = `## Federal Regulatory Monitor — ${date}\n\n`;
  body += `> **Screened leads only.** All items require human review before any content action is taken.\n\n`;
  body += `**Lookback window:** ${digest.lookbackDays} days\n`;
  body += `**Federal Register items scanned:** ${digest.totalItemsScanned}\n`;
  body += `**Material items found:** ${digest.materialItems.length}\n`;
  body += `**Pages with detected changes:** ${changedPages.length}\n\n`;
  body += `---\n\n`;

  if (digest.materialItems.length > 0) {
    body += `## Federal Register Items Matching Keywords\n\n`;
    for (const item of digest.materialItems) {
      body += `### ${item.title}\n`;
      body += `- **Agency:** ${item.agency}\n`;
      body += `- **Type:** ${item.documentType}\n`;
      body += `- **Published:** ${item.publicationDate}\n`;
      if (item.significant) body += `- **Economically significant:** Yes\n`;
      body += `- **Keywords matched:** ${item.matchedKeywords.join(', ')}\n`;
      body += `- **URL:** ${item.url}\n`;
      if (item.abstract) {
        body += `- **Abstract:** ${item.abstract.slice(0, 300)}${item.abstract.length > 300 ? '…' : ''}\n`;
      }
      body += `\n`;
    }
  }

  if (changedPages.length > 0) {
    body += `## Pages With Detected Changes\n\n`;
    for (const page of changedPages) {
      body += `### ${page.name}\n`;
      body += `- **URL:** ${page.url}\n`;
      body += `- **Note:** ${page.note}\n\n`;
    }
  }

  if (digest.headChecks.some(h => !h.changed && h.note.includes('manual verification'))) {
    body += `## Pages Lacking Cache Headers (Manual Verification Recommended)\n\n`;
    for (const page of digest.headChecks.filter(h => h.note.includes('manual verification'))) {
      body += `- [${page.name}](${page.url})\n`;
    }
    body += `\n`;
  }

  body += `---\n\n`;
  body += `**Review checklist:**\n`;
  body += `- [ ] Each Federal Register item reviewed for relevance to OpenDefender content\n`;
  body += `- [ ] USSC and BJS pages manually spot-checked if change detected\n`;
  body += `- [ ] Any items requiring content updates tracked in separate issues\n`;
  body += `- [ ] Criminal charges database reviewed if sentencing or offense definitions changed\n\n`;
  body += `*${digest.screening}*\n`;

  return body;
}

async function createGitHubIssue(title: string, body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    console.log('GitHub token or repository not set — printing issue body to stdout:\n');
    console.log(`# ${title}\n\n${body}`);
    return;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['regulatory-monitor', 'needs-review'],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${err}`);
  }

  const issue = await res.json() as { html_url: string; number: number };
  console.log(`Created issue #${issue.number}: ${issue.html_url}`);
}

async function main(): Promise<void> {
  const digestPath = findLatestDigest();
  if (!digestPath) {
    console.log('No digest file found — nothing to report.');
    return;
  }

  const digest: Digest = JSON.parse(fs.readFileSync(digestPath, 'utf-8'));
  const date = digest.generatedAt.split('T')[0];

  const materialCount = digest.materialItems.length;
  const changedCount = digest.headChecks.filter(h => h.changed).length;

  if (materialCount === 0 && changedCount === 0) {
    console.log('No material items — skipping issue creation.');
    return;
  }

  const title = `Regulatory Monitor: ${materialCount} Federal Register item${materialCount !== 1 ? 's' : ''}, ${changedCount} page change${changedCount !== 1 ? 's' : ''} — ${date}`;
  const body = buildIssueBody(digest);

  await createGitHubIssue(title, body);
}

main().catch(err => {
  console.error('generate-issue failed:', err);
  process.exit(1);
});
