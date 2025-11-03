import axios from 'axios';
import robotsParser from 'robots-parser';

/**
 * Robots.txt Audit Tool
 * Checks robots.txt compliance for top 10 state statute websites
 */

interface RobotsAuditResult {
  state: string;
  baseUrl: string;
  allowed: boolean;
  robotsTxtExists: boolean;
  disallowRules: string[];
  crawlDelay?: number;
  notes: string;
}

const STATE_STATUTE_SITES = [
  { state: 'CA', name: 'California', url: 'https://leginfo.legislature.ca.gov', testPath: '/faces/codes_displaySection.xhtml?sectionNum=242&lawCode=PEN' },
  { state: 'TX', name: 'Texas', url: 'https://statutes.capitol.texas.gov', testPath: '/Docs/PE/htm/PE.19.htm' },
  { state: 'FL', name: 'Florida', url: 'https://www.leg.state.fl.us', testPath: '/Statutes/index.cfm?App_mode=Display_Statute&Ch=782' },
  { state: 'NY', name: 'New York', url: 'https://www.nysenate.gov', testPath: '/legislation/laws/PEN/125.25' },
  { state: 'PA', name: 'Pennsylvania', url: 'https://www.legis.state.pa.us', testPath: '/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18&div=0&chpt=25' },
  { state: 'IL', name: 'Illinois', url: 'https://www.ilga.gov', testPath: '/legislation/ilcs/ilcs3.asp?ActID=1876&ChapterID=53' },
  { state: 'OH', name: 'Ohio', url: 'https://codes.ohio.gov', testPath: '/ohio-revised-code/section-2903.01' },
  { state: 'GA', name: 'Georgia', url: 'https://law.justia.com', testPath: '/codes/georgia/title-16/chapter-5/article-1/section-16-5-1/' },
  { state: 'NC', name: 'North Carolina', url: 'https://www.ncleg.gov', testPath: '/Laws/GeneralStatutes' },
  { state: 'MI', name: 'Michigan', url: 'http://legislature.mi.gov', testPath: '/doc.aspx?mcl-750-316' },
];

export async function auditRobotsTxt(): Promise<RobotsAuditResult[]> {
  const results: RobotsAuditResult[] = [];
  const userAgent = 'PublicDefenderAI-Bot/1.0 (Educational Legal Resource; contact@publicdefenderai.org)';

  console.log('[Robots Audit] Starting robots.txt audit for top 10 states...\n');

  for (const site of STATE_STATUTE_SITES) {
    try {
      const robotsUrl = new URL('/robots.txt', site.url).href;
      const testUrl = new URL(site.testPath, site.url).href;

      console.log(`[Robots Audit] Checking ${site.name} (${site.state})...`);
      console.log(`  URL: ${robotsUrl}`);

      let allowed = true;
      let robotsTxtExists = false;
      let disallowRules: string[] = [];
      let crawlDelay: number | undefined;
      let notes = '';

      try {
        const response = await axios.get(robotsUrl, { timeout: 10000 });
        robotsTxtExists = true;

        // Parse robots.txt
        const robots = robotsParser(robotsUrl, response.data);
        allowed = robots.isAllowed(testUrl, userAgent);
        crawlDelay = robots.getCrawlDelay(userAgent);

        // Extract disallow rules
        const lines = response.data.split('\n');
        disallowRules = lines
          .filter((line: string) => line.trim().toLowerCase().startsWith('disallow:'))
          .map((line: string) => line.trim());

        if (allowed) {
          notes = 'Scraping allowed';
          if (crawlDelay) {
            notes += ` (crawl delay: ${crawlDelay}s)`;
          }
        } else {
          notes = 'Scraping disallowed by robots.txt';
        }

        console.log(`  ✓ robots.txt found`);
        console.log(`  Status: ${allowed ? '✓ ALLOWED' : '✗ DISALLOWED'}`);
        if (disallowRules.length > 0) {
          console.log(`  Rules: ${disallowRules.join(', ')}`);
        }
        if (crawlDelay) {
          console.log(`  Crawl Delay: ${crawlDelay}s`);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // No robots.txt = allowed by default
          robotsTxtExists = false;
          allowed = true;
          notes = 'No robots.txt file (scraping allowed by default)';
          console.log(`  ✓ No robots.txt file (allowed by default)`);
        } else {
          throw error;
        }
      }

      results.push({
        state: site.state,
        baseUrl: site.url,
        allowed,
        robotsTxtExists,
        disallowRules,
        crawlDelay,
        notes,
      });

      console.log('');
      // Small delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ✗ Error checking ${site.name}:`, error instanceof Error ? error.message : 'Unknown error');
      results.push({
        state: site.state,
        baseUrl: site.url,
        allowed: false,
        robotsTxtExists: false,
        disallowRules: [],
        notes: `Error checking robots.txt: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.log('');
    }
  }

  return results;
}

export function printAuditSummary(results: RobotsAuditResult[]): void {
  console.log('='.repeat(80));
  console.log('ROBOTS.TXT AUDIT SUMMARY');
  console.log('='.repeat(80));

  const allowedStates = results.filter(r => r.allowed);
  const disallowedStates = results.filter(r => !r.allowed);

  console.log(`\n✓ ALLOWED STATES (${allowedStates.length}/10):`);
  allowedStates.forEach(r => {
    console.log(`  - ${r.state}: ${r.notes}`);
  });

  console.log(`\n✗ DISALLOWED STATES (${disallowedStates.length}/10):`);
  disallowedStates.forEach(r => {
    console.log(`  - ${r.state}: ${r.notes}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATION:');
  console.log('='.repeat(80));

  if (disallowedStates.length > 0) {
    console.log(`\n⚠️  ${disallowedStates.length} state(s) disallow scraping.`);
    console.log('Recommended alternatives:');
    console.log('  1. Use existing stateStatutesSeed data for initial coverage');
    console.log('  2. Contact OpenLaws API (https://openlaws.us/api/) for 50-state coverage');
    console.log('  3. Contact state legislative counsel offices for bulk data/API access');
    console.log('  4. Focus scraping efforts on states that allow it');
  }

  if (allowedStates.length > 0) {
    console.log(`\n✓ ${allowedStates.length} state(s) allow scraping.`);
    console.log('Can proceed with ethical scraping for these states.');
  }

  console.log('');
}
