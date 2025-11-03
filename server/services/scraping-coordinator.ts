import { CaliforniaScraper } from './statute-scraper';
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
   */
  async scrapeState(stateCode: string): Promise<{ success: boolean; message: string; scrapeId?: string }> {
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
      switch (stateCode) {
        case 'CA':
          const caScraper = new CaliforniaScraper();
          await caScraper.scrape();
          return {
            success: true,
            message: 'California scrape completed successfully',
            scrapeId: caScraper['scrapeId'] || undefined,
          };
        
        // TODO: Add other states
        case 'TX':
        case 'FL':
        case 'NY':
        case 'PA':
        case 'IL':
        case 'OH':
        case 'GA':
        case 'NC':
        case 'MI':
          return {
            success: false,
            message: `Scraper for ${stateCode} not yet implemented`,
          };
        
        default:
          return {
            success: false,
            message: `Unknown state code: ${stateCode}`,
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
