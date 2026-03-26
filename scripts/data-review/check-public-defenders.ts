/**
 * Quarterly Public Defender Office Data Review Script
 *
 * Checks every local/county public defender and court-appointed program entry
 * in the seed file by:
 *   1. Making an HTTP HEAD request to their website
 *   2. Flagging any that are unreachable, redirect to a new domain, or return errors
 *   3. Flagging entries that lack a phone number (may need manual lookup)
 *
 * This script covers organizationType: 'county_public_defender' and
 * 'court_appointed_program' entries. Federal public defenders are covered
 * by check-legal-aid.ts.
 *
 * Outputs: scripts/data-review/output/public-defenders-diff.json
 *
 * Run manually: npx tsx scripts/data-review/check-public-defenders.ts
 *
 * When the report flags an issue:
 *   1. Visit the source website listed in the entry's sourceUrl field
 *   2. Update the address, phone, and website in server/data/legal-aid-organizations-seed.ts
 *   3. Re-run this script to confirm the fix
 *   4. Commit the correction with a message referencing the quarterly check
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

interface PDRecord {
  name: string;
  orgType: 'county_public_defender' | 'court_appointed_program';
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string;
  state: string;
  county: string | null;
  dataSource: string;
  sourceUrl: string; // The authoritative URL to re-verify this entry against
}

interface PDCheckResult {
  name: string;
  orgType: string;
  state: string;
  website: string | null;
  phone: string | null;
  status: 'ok' | 'redirect' | 'error' | 'unreachable' | 'no_website';
  httpStatus?: number;
  redirectedTo?: string;
  errorMessage?: string;
  checkedAt: string;
  needsManualReview: boolean;
  reason?: string;
}

// Kept in sync with server/data/legal-aid-organizations-seed.ts.
// When adding new entries to the seed file, add them here too.
const OFFICES: PDRecord[] = [
  // ── VIRGINIA — Local Public Defender Offices ─────────────────────────────
  // Source: indigentdefense.virginia.gov
  { name: "Richmond City Public Defender", orgType: "county_public_defender", phone: "(804) 786-4731", website: "https://indigentdefense.virginia.gov", address: "1 North 9th Street, Suite 10", city: "Richmond", state: "VA", county: "Richmond City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Fairfax County Public Defender", orgType: "county_public_defender", phone: "(703) 246-3040", website: "https://indigentdefense.virginia.gov", address: "4103 Chain Bridge Road, Suite 500", city: "Fairfax", state: "VA", county: "Fairfax County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Norfolk City Public Defender", orgType: "county_public_defender", phone: "(757) 664-4973", website: "https://indigentdefense.virginia.gov", address: "150 St. Paul's Boulevard, Suite 1200", city: "Norfolk", state: "VA", county: "Norfolk City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Virginia Beach Public Defender", orgType: "county_public_defender", phone: "(757) 385-4733", website: "https://indigentdefense.virginia.gov", address: "2425 Nimmo Parkway, Building 10", city: "Virginia Beach", state: "VA", county: "Virginia Beach City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Chesterfield County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "9500 Courthouse Road", city: "Chesterfield", state: "VA", county: "Chesterfield County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Henrico County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "4301 East Parham Road", city: "Henrico", state: "VA", county: "Henrico County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Arlington/Alexandria Public Defender", orgType: "county_public_defender", phone: "(703) 228-7420", website: "https://indigentdefense.virginia.gov", address: "1425 North Courthouse Road, Suite 2400", city: "Arlington", state: "VA", county: "Arlington County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Prince William County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "9311 Lee Avenue", city: "Manassas", state: "VA", county: "Prince William County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Loudoun County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "18 East Market Street", city: "Leesburg", state: "VA", county: "Loudoun County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Newport News Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "2501 Washington Avenue", city: "Newport News", state: "VA", county: "Newport News City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Hampton Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "236 North King Street", city: "Hampton", state: "VA", county: "Hampton City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Portsmouth Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "801 Crawford Street", city: "Portsmouth", state: "VA", county: "Portsmouth City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Chesapeake Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "307 Albemarle Drive, Suite 300A", city: "Chesapeake", state: "VA", county: "Chesapeake City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Roanoke City Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "315 West Church Avenue, Suite 514", city: "Roanoke", state: "VA", county: "Roanoke City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Lynchburg Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "900 Church Street, Suite 600", city: "Lynchburg", state: "VA", county: "Lynchburg City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Charlottesville/Albemarle Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "315 East High Street", city: "Charlottesville", state: "VA", county: "Albemarle County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Harrisonburg/Rockingham Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "91 Court Square", city: "Harrisonburg", state: "VA", county: "Rockingham County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Fredericksburg/Spotsylvania Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "601 Caroline Street", city: "Fredericksburg", state: "VA", county: "Spotsylvania County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Petersburg Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "35 East Tabb Street", city: "Petersburg", state: "VA", county: "Petersburg City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Winchester/Frederick County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "5 North Kent Street", city: "Winchester", state: "VA", county: "Frederick County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Staunton/Augusta County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "113 East Beverly Street", city: "Staunton", state: "VA", county: "Augusta County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Suffolk/Isle of Wight Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "441 Market Street", city: "Suffolk", state: "VA", county: "Suffolk City", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Williamsburg/James City Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "101 Mounts Bay Road, Suite B", city: "Williamsburg", state: "VA", county: "James City County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Bristol/Washington County Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "497 Cumberland Street", city: "Bristol", state: "VA", county: "Washington County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },
  { name: "Eastern Shore Public Defender", orgType: "county_public_defender", phone: null, website: "https://indigentdefense.virginia.gov", address: "23316 Courthouse Avenue", city: "Accomac", state: "VA", county: "Accomack County", dataSource: "state_pd_website", sourceUrl: "https://indigentdefense.virginia.gov" },

  // ── PHASE A — State-level PD contacts ────────────────────────────────────
  { name: "New Jersey Office of the Public Defender", orgType: "county_public_defender", phone: "(609) 292-7087", website: "https://www.njpublicdefender.org", address: "25 Market Street", city: "Trenton", state: "NJ", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.njpublicdefender.org" },
  { name: "Massachusetts Committee for Public Counsel Services (CPCS)", orgType: "county_public_defender", phone: "(617) 482-6212", website: "https://www.publiccounsel.net", address: "197 Friend Street", city: "Boston", state: "MA", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.publiccounsel.net" },
  { name: "Connecticut Office of the Public Defender", orgType: "county_public_defender", phone: "(203) 805-6400", website: "https://www.ocpd.state.ct.us", address: "2 West Main Street", city: "Waterbury", state: "CT", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.ocpd.state.ct.us" },
  { name: "Maryland Office of the Public Defender", orgType: "county_public_defender", phone: "(410) 539-5370", website: "https://www.opd.state.md.us", address: "6 St. Paul Street, Suite 1400", city: "Baltimore", state: "MD", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.opd.state.md.us" },
  { name: "Alaska Public Defender Agency", orgType: "county_public_defender", phone: "(907) 334-4400", website: "https://law.alaska.gov/department/pd.html", address: "900 West 5th Avenue, Suite 200", city: "Anchorage", state: "AK", county: null, dataSource: "state_pd_website", sourceUrl: "https://law.alaska.gov/department/pd.html" },
  { name: "Delaware Office of Defense Services", orgType: "county_public_defender", phone: "(302) 577-5200", website: "https://ogs.delaware.gov/ods", address: "820 North French Street", city: "Wilmington", state: "DE", county: null, dataSource: "state_pd_website", sourceUrl: "https://ogs.delaware.gov/ods" },
  { name: "Hawaii Office of the Public Defender", orgType: "county_public_defender", phone: "(808) 586-2433", website: "https://opd.hawaii.gov", address: "1130 North Nimitz Highway, Suite A-254G", city: "Honolulu", state: "HI", county: null, dataSource: "state_pd_website", sourceUrl: "https://opd.hawaii.gov" },
  { name: "New Mexico Law Offices of the Public Defender", orgType: "county_public_defender", phone: "(505) 827-3931", website: "https://www.lopdnm.us", address: "301 North Guadalupe Street, Suite 101", city: "Santa Fe", state: "NM", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.lopdnm.us" },
  { name: "Oregon Office of Public Defense Services", orgType: "county_public_defender", phone: "(503) 378-3349", website: "https://www.oregonpublicdefenders.org", address: "1175 Court Street NE", city: "Salem", state: "OR", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.oregonpublicdefenders.org" },
  { name: "Rhode Island Office of the Public Defender", orgType: "county_public_defender", phone: "(401) 222-3492", website: "https://www.opd.ri.gov", address: "160 Pine Street", city: "Providence", state: "RI", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.opd.ri.gov" },
  { name: "Vermont Defender General's Office", orgType: "county_public_defender", phone: "(802) 828-3168", website: "https://defgen.vermont.gov", address: "6 Baldwin Street", city: "Montpelier", state: "VT", county: null, dataSource: "state_pd_website", sourceUrl: "https://defgen.vermont.gov" },
  { name: "West Virginia Public Defender Services", orgType: "county_public_defender", phone: "(304) 558-3905", website: "https://pds.wv.gov", address: "90 MacCorkle Avenue SW, Suite 101", city: "South Charleston", state: "WV", county: null, dataSource: "state_pd_website", sourceUrl: "https://pds.wv.gov" },
  { name: "Wyoming State Public Defender", orgType: "county_public_defender", phone: "(307) 777-7884", website: "https://wyomingpublicdefender.com", address: "2020 Carey Avenue, Suite 600", city: "Cheyenne", state: "WY", county: null, dataSource: "state_pd_website", sourceUrl: "https://wyomingpublicdefender.com" },
  { name: "Montana Office of the State Public Defender", orgType: "county_public_defender", phone: "(406) 444-2272", website: "https://opd.mt.gov", address: "107 West Lawrence Street, Suite 212", city: "Helena", state: "MT", county: null, dataSource: "state_pd_website", sourceUrl: "https://opd.mt.gov" },
  { name: "Minnesota Board of Public Defense", orgType: "county_public_defender", phone: "(612) 279-3522", website: "https://mbpd.mn.gov", address: "331 Second Avenue South, Suite 900", city: "Minneapolis", state: "MN", county: null, dataSource: "state_pd_website", sourceUrl: "https://mbpd.mn.gov" },
  { name: "Colorado State Public Defender", orgType: "county_public_defender", phone: "(303) 764-1400", website: "https://www.coloradopd.org", address: "1300 Broadway, Suite 400", city: "Denver", state: "CO", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.coloradopd.org" },
  { name: "Louisiana Public Defender Board", orgType: "county_public_defender", phone: "(225) 219-9625", website: "https://lpdb.la.gov", address: "602 North Fifth Street", city: "Baton Rouge", state: "LA", county: null, dataSource: "state_pd_website", sourceUrl: "https://lpdb.la.gov" },
  { name: "New Hampshire Office of the Public Defender", orgType: "county_public_defender", phone: "(603) 224-1236", website: "https://www.nhpd.org", address: "10 Ferry Street, Suite 202", city: "Concord", state: "NH", county: null, dataSource: "state_pd_website", sourceUrl: "https://www.nhpd.org" },
];

function checkWebsite(url: string): Promise<{ status: number; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const requester = parsed.protocol === 'https:' ? https : http;

    const req = requester.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname || '/',
        method: 'HEAD',
        timeout: 10000,
        headers: { 'User-Agent': 'OpenDefender-DataReview/1.0 (quarterly public defender data accuracy check)' },
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

async function checkOffice(office: PDRecord): Promise<PDCheckResult> {
  const checkedAt = new Date().toISOString();

  // Flag missing phone — important for users who can't access websites
  const missingPhone = !office.phone;

  if (!office.website) {
    return {
      name: office.name, orgType: office.orgType, state: office.state,
      website: null, phone: office.phone,
      status: 'no_website', checkedAt, needsManualReview: true,
      reason: `No website recorded. Verify at: ${office.sourceUrl}`,
    };
  }

  try {
    const { status, finalUrl } = await checkWebsite(office.website);
    const redirected = domainOf(finalUrl) !== domainOf(office.website);

    if (status >= 200 && status < 400) {
      if (redirected) {
        return {
          name: office.name, orgType: office.orgType, state: office.state,
          website: office.website, phone: office.phone,
          status: 'redirect', httpStatus: status, redirectedTo: finalUrl,
          checkedAt, needsManualReview: true,
          reason: `Website redirects to new domain: ${finalUrl} — update seed file and re-verify phone/address at ${office.sourceUrl}`,
        };
      }
      if (missingPhone) {
        return {
          name: office.name, orgType: office.orgType, state: office.state,
          website: office.website, phone: null,
          status: 'ok', httpStatus: status, checkedAt, needsManualReview: true,
          reason: `Website OK but phone number missing — look up at ${office.sourceUrl}`,
        };
      }
      return {
        name: office.name, orgType: office.orgType, state: office.state,
        website: office.website, phone: office.phone,
        status: 'ok', httpStatus: status, checkedAt, needsManualReview: false,
      };
    } else {
      return {
        name: office.name, orgType: office.orgType, state: office.state,
        website: office.website, phone: office.phone,
        status: 'error', httpStatus: status, checkedAt, needsManualReview: true,
        reason: `HTTP ${status} — re-verify at ${office.sourceUrl}`,
      };
    }
  } catch (err: any) {
    return {
      name: office.name, orgType: office.orgType, state: office.state,
      website: office.website, phone: office.phone,
      status: 'unreachable', errorMessage: err.message, checkedAt, needsManualReview: true,
      reason: `Unreachable: ${err.message} — re-verify at ${office.sourceUrl}`,
    };
  }
}

async function main() {
  console.log(`Checking ${OFFICES.length} local public defender and court-appointed program entries...`);
  const results: PDCheckResult[] = [];

  // Run in batches of 5 to avoid overwhelming the network
  for (let i = 0; i < OFFICES.length; i += 5) {
    const batch = OFFICES.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(checkOffice));
    results.push(...batchResults);
    console.log(`  Checked ${Math.min(i + 5, OFFICES.length)}/${OFFICES.length}`);
  }

  const needsReview = results.filter(r => r.needsManualReview);
  const ok = results.filter(r => r.status === 'ok' && !r.needsManualReview);

  console.log(`\nResults: ${ok.length} OK, ${needsReview.length} need review`);
  needsReview.forEach(r => console.log(`  ⚠  [${r.state}] ${r.name}: ${r.reason}`));

  const byState = Object.entries(
    results.reduce((acc: Record<string, number>, r) => {
      acc[r.state] = (acc[r.state] || 0) + (r.needsManualReview ? 1 : 0);
      return acc;
    }, {})
  ).filter(([, count]) => count > 0);

  if (byState.length > 0) {
    console.log('\nStates with items needing review:');
    byState.forEach(([state, count]) => console.log(`  ${state}: ${count} item(s)`));
  }

  const output = {
    runAt: new Date().toISOString(),
    totalChecked: results.length,
    okCount: ok.length,
    needsReviewCount: needsReview.length,
    results,
  };

  const outputDir = path.join(process.cwd(), 'scripts/data-review/output');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'public-defenders-diff.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput written to ${outputPath}`);

  // Exit 1 if anything needs review, so CI flags it
  process.exit(needsReview.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
