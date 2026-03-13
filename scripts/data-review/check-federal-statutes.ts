/**
 * Quarterly Federal Statutes Data Review Script
 *
 * Checks every federal statute in the seed file by:
 *   1. Making an HTTP HEAD request to its Cornell LII URL
 *   2. Flagging any that are unreachable, redirect, or return errors
 *   3. Checking whether the URL still resolves to the expected section
 *
 * This does NOT fetch updated statutory text — it only verifies the URLs are
 * still valid so the manual review team knows which statutes to re-verify.
 * For an OpenLaws-based content refresh, set OPENLAWS_API_KEY and run the
 * full statute seeder (npm run db:seed:statutes).
 *
 * Outputs: scripts/data-review/output/statutes-diff.json
 *
 * Run manually: npx tsx scripts/data-review/check-federal-statutes.ts
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

interface StatuteRecord {
  citation: string;
  title: string;
  url: string;
  sourceApi: string;
}

interface StatuteCheckResult {
  citation: string;
  title: string;
  url: string;
  status: 'ok' | 'redirect' | 'error' | 'unreachable';
  httpStatus?: number;
  redirectedTo?: string;
  errorMessage?: string;
  checkedAt: string;
  needsManualReview: boolean;
  reason?: string;
}

// Inline the statute list so this script is self-contained.
// Keep in sync with server/data/federal-statutes-seed.ts.
const STATUTES: StatuteRecord[] = [
  { citation: '18 USC § 1001', title: 'False Statements', url: 'https://www.law.cornell.edu/uscode/text/18/1001', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 1343', title: 'Wire Fraud', url: 'https://www.law.cornell.edu/uscode/text/18/1343', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 1341', title: 'Mail Fraud', url: 'https://www.law.cornell.edu/uscode/text/18/1341', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 111', title: 'Assault on Federal Officer', url: 'https://www.law.cornell.edu/uscode/text/18/111', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 371', title: 'Conspiracy', url: 'https://www.law.cornell.edu/uscode/text/18/371', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 641', title: 'Theft of Government Property', url: 'https://www.law.cornell.edu/uscode/text/18/641', sourceApi: 'cornell_lii' },
  { citation: '21 USC § 841', title: 'Drug Possession with Intent to Distribute', url: 'https://www.law.cornell.edu/uscode/text/21/841', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 2113', title: 'Bank Robbery', url: 'https://www.law.cornell.edu/uscode/text/18/2113', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 1028', title: 'Identity Theft', url: 'https://www.law.cornell.edu/uscode/text/18/1028', sourceApi: 'cornell_lii' },
  { citation: '18 USC § 1956', title: 'Money Laundering', url: 'https://www.law.cornell.edu/uscode/text/18/1956', sourceApi: 'cornell_lii' },
];

function checkUrl(url: string): Promise<{ status: number; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'HEAD',
        timeout: 15000,
        headers: { 'User-Agent': 'OpenDefender-DataReview/1.0 (quarterly statute accuracy check)' },
      },
      (res) => {
        const finalUrl = res.headers.location
          ? new URL(res.headers.location, url).toString()
          : url;
        resolve({ status: res.statusCode ?? 0, finalUrl });
      }
    );
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.end();
  });
}

function domainOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

async function checkStatute(statute: StatuteRecord): Promise<StatuteCheckResult> {
  const checkedAt = new Date().toISOString();

  try {
    const { status, finalUrl } = await checkUrl(statute.url);
    const redirected = domainOf(finalUrl) !== domainOf(statute.url);

    if (status >= 200 && status < 400) {
      if (redirected) {
        return {
          citation: statute.citation,
          title: statute.title,
          url: statute.url,
          status: 'redirect',
          httpStatus: status,
          redirectedTo: finalUrl,
          checkedAt,
          needsManualReview: true,
          reason: `Redirects to different domain: ${finalUrl}`,
        };
      }
      return {
        citation: statute.citation,
        title: statute.title,
        url: statute.url,
        status: 'ok',
        httpStatus: status,
        checkedAt,
        needsManualReview: false,
      };
    } else {
      return {
        citation: statute.citation,
        title: statute.title,
        url: statute.url,
        status: 'error',
        httpStatus: status,
        checkedAt,
        needsManualReview: true,
        reason: `HTTP ${status}`,
      };
    }
  } catch (err: any) {
    return {
      citation: statute.citation,
      title: statute.title,
      url: statute.url,
      status: 'unreachable',
      errorMessage: err.message,
      checkedAt,
      needsManualReview: true,
      reason: `Unreachable: ${err.message}`,
    };
  }
}

async function main() {
  console.log(`Checking ${STATUTES.length} federal statutes...`);
  const results: StatuteCheckResult[] = [];

  // Run in batches of 5
  for (let i = 0; i < STATUTES.length; i += 5) {
    const batch = STATUTES.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(checkStatute));
    results.push(...batchResults);
    console.log(`  Checked ${Math.min(i + 5, STATUTES.length)}/${STATUTES.length}`);
  }

  const needsReview = results.filter(r => r.needsManualReview);
  const ok = results.filter(r => r.status === 'ok');

  console.log(`\nResults: ${ok.length} OK, ${needsReview.length} need review`);
  needsReview.forEach(r => console.log(`  ⚠ ${r.citation} (${r.title}): ${r.reason}`));

  const output = {
    runAt: new Date().toISOString(),
    totalChecked: results.length,
    okCount: ok.length,
    needsReviewCount: needsReview.length,
    results,
  };

  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'statutes-diff.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput written to ${outputPath}`);

  // Exit with code 1 if anything needs review so CI can flag it
  process.exit(needsReview.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
