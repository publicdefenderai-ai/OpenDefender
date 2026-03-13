/**
 * Quarterly Legal Aid Organizations Data Review Script
 *
 * Checks every organization in the seed file by:
 *   1. Making an HTTP HEAD request to their website
 *   2. Flagging any that are unreachable, redirect to a new domain, or return errors
 *
 * Outputs: scripts/data-review/output/legal-aid-diff.json
 *
 * Run manually: npx tsx scripts/data-review/check-legal-aid.ts
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

interface OrgRecord {
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  dataSource: string;
}

interface OrgCheckResult {
  name: string;
  website: string | null;
  status: 'ok' | 'redirect' | 'error' | 'unreachable' | 'no_website';
  httpStatus?: number;
  redirectedTo?: string;
  errorMessage?: string;
  checkedAt: string;
  needsManualReview: boolean;
  reason?: string;
}

// Inline the org list so the script is self-contained and doesn't require
// the full app build chain. Kept in sync with server/data/legal-aid-organizations-seed.ts.
const ORGS: OrgRecord[] = [
  { name: "San Francisco Public Defender's Office - Immigration Unit", phone: "(628) 271-9898", email: null, website: "https://sfpublicdefender.org", address: "555 7th Street", city: "San Francisco", state: "CA", zipCode: "94103", dataSource: "EOIR" },
  { name: "Alameda County Public Defender - Immigration Representation Unit", phone: "(510) 272-6600", email: null, website: "https://publicdefender.acgov.org", address: "1401 Lakeside Drive, Suite 400", city: "Oakland", state: "CA", zipCode: "94612", dataSource: "EOIR" },
  { name: "Immigrant Legal Resource Center (ILRC)", phone: "(415) 255-9499", email: "info@ilrc.org", website: "https://www.ilrc.org", address: "1663 Mission Street, Suite 602", city: "San Francisco", state: "CA", zipCode: "94103", dataSource: "EOIR" },
  { name: "Asian Law Alliance", phone: "(408) 287-9710", email: "info@asianlawalliance.org", website: "https://www.asianlawalliance.org", address: "991 W. Hedding Street, Suite 202", city: "San Jose", state: "CA", zipCode: "95126", dataSource: "EOIR" },
  { name: "Central American Resource Center (CARECEN) - Los Angeles", phone: "(213) 385-7800", email: "info@carecen-la.org", website: "https://www.carecen-la.org", address: "2845 W. 7th Street", city: "Los Angeles", state: "CA", zipCode: "90005", dataSource: "EOIR" },
  { name: "The Legal Aid Society - Immigration Law Unit", phone: "(212) 577-3300", email: null, website: "https://www.legalaidnyc.org", address: "199 Water Street", city: "New York", state: "NY", zipCode: "10038", dataSource: "EOIR" },
  { name: "New York Legal Assistance Group (NYLAG) - Immigration Protection Unit", phone: "(212) 613-5000", email: "immigration@nylag.org", website: "https://www.nylag.org", address: "7 Hanover Square, 18th Floor", city: "New York", state: "NY", zipCode: "10004", dataSource: "EOIR" },
  { name: "Catholic Charities Community Services - Immigration Legal Services", phone: "(212) 419-3700", email: null, website: "https://www.catholiccharitiesny.org", address: "80 Maiden Lane, 13th Floor", city: "New York", state: "NY", zipCode: "10038", dataSource: "EOIR" },
  { name: "RAICES", phone: "(833) 372-4237", email: "info@raicestexas.org", website: "https://www.raicestexas.org", address: "131 Interpark Blvd", city: "San Antonio", state: "TX", zipCode: "78216", dataSource: "EOIR" },
  { name: "American Gateways", phone: "(512) 478-0546", email: "info@americangateways.org", website: "https://www.americangateways.org", address: "314 E. Highland Mall Boulevard, Suite 501", city: "Austin", state: "TX", zipCode: "78752", dataSource: "EOIR" },
  { name: "Americans for Immigrant Justice", phone: "(305) 573-1106", email: "info@aijustice.org", website: "https://www.aijustice.org", address: "6355 NW 36th Street, Suite 101", city: "Miami", state: "FL", zipCode: "33166", dataSource: "EOIR" },
  { name: "National Immigrant Justice Center (NIJC)", phone: "(312) 660-1370", email: "info@immigrantjustice.org", website: "https://www.immigrantjustice.org", address: "224 S. Michigan Avenue, Suite 600", city: "Chicago", state: "IL", zipCode: "60604", dataSource: "EOIR" },
  { name: "Legal Aid Foundation of Los Angeles (LAFLA)", phone: "(213) 640-3850", email: null, website: "https://www.lafla.org", address: "1102 Crenshaw Boulevard", city: "Los Angeles", state: "CA", zipCode: "90019", dataSource: "LSC" },
  { name: "Bay Area Legal Aid", phone: "(800) 551-5554", email: "info@baylegal.org", website: "https://www.baylegal.org", address: "1800 Market Street, 3rd Floor", city: "San Francisco", state: "CA", zipCode: "94102", dataSource: "LSC" },
  { name: "Greater Bakersfield Legal Assistance", phone: "(661) 325-5943", email: null, website: "https://www.gbla.org", address: "615 California Ave", city: "Bakersfield", state: "CA", zipCode: "93304", dataSource: "LSC" },
  { name: "Legal Services NYC", phone: "(917) 661-4500", email: null, website: "https://www.legalservicesnyc.org", address: "40 Worth Street, Suite 606", city: "New York", state: "NY", zipCode: "10013", dataSource: "LSC" },
  { name: "Nassau/Suffolk Law Services Committee", phone: "(516) 292-8100", email: null, website: "https://www.nslawservices.org", address: "1 Helen Keller Way, 5th Floor", city: "Hempstead", state: "NY", zipCode: "11550", dataSource: "LSC" },
  { name: "Lone Star Legal Aid", phone: "(713) 652-0077", email: null, website: "https://www.lonestarlegal.org", address: "1415 Fannin Street", city: "Houston", state: "TX", zipCode: "77002", dataSource: "LSC" },
  { name: "Texas RioGrande Legal Aid (TRLA)", phone: "(210) 212-3700", email: null, website: "https://www.trla.org", address: "2929 Mossrock, Suite 121", city: "San Antonio", state: "TX", zipCode: "78230", dataSource: "LSC" },
  { name: "Legal Aid Chicago", phone: "(312) 341-1070", email: null, website: "https://www.legalaidchicago.org", address: "200 N. LaSalle Street, Suite 1400", city: "Chicago", state: "IL", zipCode: "60601", dataSource: "LSC" },
  { name: "Legal Services of Greater Miami", phone: "(305) 576-0080", email: null, website: "https://www.lsgmi.org", address: "4343 West Flagler Street, Suite 100", city: "Miami", state: "FL", zipCode: "33134", dataSource: "LSC" },
  { name: "Community Legal Services of Mid-Florida", phone: "(407) 841-7777", email: null, website: "https://www.clsmf.org", address: "122 E. Colonial Drive, Suite 200", city: "Orlando", state: "FL", zipCode: "32801", dataSource: "LSC" },
  { name: "Community Legal Services - Arizona", phone: "(602) 258-3434", email: null, website: "https://www.clsaz.org", address: "305 S. 2nd Avenue", city: "Phoenix", state: "AZ", zipCode: "85003", dataSource: "LSC" },
  { name: "Atlanta Legal Aid Society", phone: "(404) 524-5811", email: null, website: "https://www.atlantalegalaid.org", address: "54 Ellis Street NE", city: "Atlanta", state: "GA", zipCode: "30303", dataSource: "LSC" },
];

function checkWebsite(url: string): Promise<{ status: number; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const requester = parsed.protocol === 'https:' ? https : http;

    const req = requester.request(
      { hostname: parsed.hostname, path: parsed.pathname || '/', method: 'HEAD', timeout: 10000,
        headers: { 'User-Agent': 'OpenDefender-DataReview/1.0 (quarterly data accuracy check)' } },
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

async function checkOrg(org: OrgRecord): Promise<OrgCheckResult> {
  const checkedAt = new Date().toISOString();

  if (!org.website) {
    return { name: org.name, website: null, status: 'no_website', checkedAt, needsManualReview: true, reason: 'No website recorded' };
  }

  try {
    const { status, finalUrl } = await checkWebsite(org.website);
    const redirected = domainOf(finalUrl) !== domainOf(org.website);

    if (status >= 200 && status < 400) {
      if (redirected) {
        return { name: org.name, website: org.website, status: 'redirect', httpStatus: status, redirectedTo: finalUrl, checkedAt, needsManualReview: true, reason: `Redirects to different domain: ${finalUrl}` };
      }
      return { name: org.name, website: org.website, status: 'ok', httpStatus: status, checkedAt, needsManualReview: false };
    } else {
      return { name: org.name, website: org.website, status: 'error', httpStatus: status, checkedAt, needsManualReview: true, reason: `HTTP ${status}` };
    }
  } catch (err: any) {
    return { name: org.name, website: org.website, status: 'unreachable', errorMessage: err.message, checkedAt, needsManualReview: true, reason: `Unreachable: ${err.message}` };
  }
}

async function main() {
  console.log(`Checking ${ORGS.length} legal aid organizations...`);
  const results: OrgCheckResult[] = [];

  // Run in batches of 5 to avoid overwhelming the network
  for (let i = 0; i < ORGS.length; i += 5) {
    const batch = ORGS.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(checkOrg));
    results.push(...batchResults);
    console.log(`  Checked ${Math.min(i + 5, ORGS.length)}/${ORGS.length}`);
  }

  const needsReview = results.filter(r => r.needsManualReview);
  const ok = results.filter(r => r.status === 'ok');

  console.log(`\nResults: ${ok.length} OK, ${needsReview.length} need review`);
  needsReview.forEach(r => console.log(`  ⚠ ${r.name}: ${r.reason}`));

  const output = {
    runAt: new Date().toISOString(),
    totalChecked: results.length,
    okCount: ok.length,
    needsReviewCount: needsReview.length,
    results,
  };

  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'legal-aid-diff.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput written to ${outputPath}`);

  // Exit with code 1 if anything needs review, so CI can flag it
  process.exit(needsReview.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
