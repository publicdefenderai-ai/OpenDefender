// Legacy scrapers no longer used - all automated scraping approaches failed
// Keeping imports commented for historical reference:
// import { CaliforniaScraper, TexasScraper, FloridaScraper, NewYorkScraper, IllinoisScraper, OhioScraper, NorthCarolinaScraper, MichiganScraper } from './statute-scraper';
import { db } from '../db';
import { statuteScrapes, type StatuteScrape } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Scraping Coordinator - manages statute scraping operations
 */
export class ScrapingCoordinator {
  private activeScrapes: Map<string, boolean> = new Map();

  /**
   * Start scraping for a specific state
   * Now defaults to Justia for all states unless force flag is set
   */
  async scrapeState(
    stateCode: string, 
    options?: { 
      useJustia?: boolean;  // Default true - use Justia for all states
      forceStateSite?: boolean;  // Force use of individual state website scraper
    }
  ): Promise<{ success: boolean; message: string; scrapeId?: string }> {
    const { useJustia = true, forceStateSite = false } = options || {};
    
    // Check if scrape is already in progress
    if (this.activeScrapes.get(stateCode)) {
      return {
        success: false,
        message: `Scraping already in progress for ${stateCode}`,
      };
    }

    // Mark state as being scraped
    this.activeScrapes.set(stateCode, true);

    try {
      let scraper: any;
      let stateName = stateCode;
      
      // NOTE: All web scraping approaches have failed:
      // - Justia: CloudFront bot detection blocks all requests (403)
      // - State websites: URLs outdated, returning 404s
      // - OpenLaws API: Team unresponsive
      // 
      // Current working solution: Curated seed data only
      // See server/data/state-statutes-seed.ts for expansion
      
      // All states return informative message about curated data approach
      const stateStatuteCount: Record<string, number> = {
        'CA': 3, 'FL': 2, 'TX': 2, 'NY': 2,
        'GA': 1, 'IL': 1, 'MI': 1, 'NC': 1, 'OH': 1, 'PA': 1
      };
      
      const count = stateStatuteCount[stateCode] || 0;
      
      if (count > 0) {
        return {
          success: false,
          message: `Automated scraping not available. ${stateCode} has ${count} curated statute${count > 1 ? 's' : ''} in seed data. To expand: edit server/data/state-statutes-seed.ts`,
        };
      } else {
        return {
          success: false,
          message: `No coverage for ${stateCode}. Current approach: curated seed data for major states. To add ${stateCode} statutes: edit server/data/state-statutes-seed.ts`,
        };
      }
    } catch (error) {
      console.error(`[Coordinator] Error scraping ${stateCode}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      // Release the lock
      this.activeScrapes.delete(stateCode);
    }
  }

  /**
   * Get scrape history for a state
   */
  async getScrapeHistory(stateCode?: string) {
    if (stateCode) {
      return await db.query.statuteScrapes.findMany({
        where: eq(statuteScrapes.jurisdiction, stateCode),
        orderBy: [desc(statuteScrapes.startedAt)],
        limit: 10,
      });
    } else {
      return await db.query.statuteScrapes.findMany({
        orderBy: [desc(statuteScrapes.startedAt)],
        limit: 50,
      });
    }
  }

  /**
   * Get latest scrape status for a state
   */
  async getLatestScrapeStatus(stateCode: string) {
    const latest = await db.query.statuteScrapes.findFirst({
      where: eq(statuteScrapes.jurisdiction, stateCode),
      orderBy: [desc(statuteScrapes.startedAt)],
    });

    return {
      ...latest,
      isActive: this.activeScrapes.get(stateCode) || false,
    };
  }

  /**
   * Get scraping statistics
   */
  async getScrapingStats() {
    const history = await db.query.statuteScrapes.findMany({
      orderBy: [desc(statuteScrapes.startedAt)],
    });

    const stats = {
      totalScrapes: history.length,
      successfulScrapes: history.filter((s: StatuteScrape) => s.status === 'completed').length,
      failedScrapes: history.filter((s: StatuteScrape) => s.status === 'failed').length,
      inProgressScrapes: history.filter((s: StatuteScrape) => s.status === 'in_progress').length,
      totalStatutesScraped: history.reduce((sum: number, s: StatuteScrape) => sum + parseInt(s.statutesScraped || '0'), 0),
      totalErrors: history.reduce((sum: number, s: StatuteScrape) => sum + parseInt(s.errorCount || '0'), 0),
      statesCovered: Array.from(new Set(history.map((s: StatuteScrape) => s.jurisdiction))),
      lastScrape: history[0],
    };

    return stats;
  }
}

// Singleton instance
export const scrapingCoordinator = new ScrapingCoordinator();
