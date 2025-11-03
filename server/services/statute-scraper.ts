import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import { db } from '../db';
import { statutes, statuteScrapes } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Base statute scraper with rate limiting and robots.txt compliance
 */
export abstract class StatuteScraper {
  protected axios: AxiosInstance;
  protected robotsTxt: any;
  protected baseUrl: string;
  protected jurisdiction: string;
  protected userAgent = 'PublicDefenderAI-Bot/1.0 (Educational Legal Resource; contact@publicdefenderai.org)';
  protected requestDelay: number = 2000; // 2 seconds between requests
  protected lastRequestTime: number = 0;
  protected scrapeId: string | null = null;
  
  constructor(baseUrl: string, jurisdiction: string) {
    this.baseUrl = baseUrl;
    this.jurisdiction = jurisdiction;
    this.axios = axios.create({
      headers: {
        'User-Agent': this.userAgent,
      },
      timeout: 30000,
    });
  }

  /**
   * Check robots.txt before scraping
   */
  async checkRobotsTxt(url: string): Promise<boolean> {
    try {
      if (!this.robotsTxt) {
        const robotsUrl = new URL('/robots.txt', this.baseUrl).href;
        const response = await this.axios.get(robotsUrl);
        this.robotsTxt = robotsParser(robotsUrl, response.data);
      }
      
      const allowed = this.robotsTxt.isAllowed(url, this.userAgent);
      if (!allowed) {
        console.log(`[Scraper] robots.txt disallows: ${url}`);
      }
      return allowed;
    } catch (error) {
      // If robots.txt doesn't exist or fails, allow scraping but log it
      console.log(`[Scraper] robots.txt not found for ${this.baseUrl}, proceeding with caution`);
      return true;
    }
  }

  /**
   * Rate-limited HTTP request
   */
  async fetchWithRateLimit(url: string): Promise<string> {
    // Enforce rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestDelay) {
      const waitTime = this.requestDelay - timeSinceLastRequest;
      console.log(`[Scraper] Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Check robots.txt
    const allowed = await this.checkRobotsTxt(url);
    if (!allowed) {
      throw new Error(`Robots.txt disallows scraping: ${url}`);
    }

    // Make request
    console.log(`[Scraper] Fetching: ${url}`);
    this.lastRequestTime = Date.now();
    const response = await this.axios.get(url);
    return response.data;
  }

  /**
   * Start a scraping session and record it in the database
   */
  async startScrapeSession(scrapeType: string): Promise<string> {
    const result = await db.insert(statuteScrapes).values({
      jurisdiction: this.jurisdiction,
      scrapeType,
      status: 'in_progress',
      startedAt: new Date(),
      statutesScraped: '0',
      errorCount: '0',
    }).returning();
    
    this.scrapeId = result[0]?.id ?? null;
    if (!this.scrapeId) {
      throw new Error('Failed to create scrape session');
    }
    console.log(`[Scraper] Started scrape session #${this.scrapeId} for ${this.jurisdiction}`);
    return this.scrapeId;
  }

  /**
   * Update scrape session progress
   */
  async updateScrapeProgress(statutesScraped: number, errorCount: number = 0) {
    if (!this.scrapeId) return;
    
    await db.update(statuteScrapes)
      .set({ 
        statutesScraped: statutesScraped.toString(),
        errorCount: errorCount.toString(),
        lastUpdatedAt: new Date(),
      })
      .where(eq(statuteScrapes.id, this.scrapeId));
  }

  /**
   * Complete a scraping session
   */
  async completeScrapeSession(success: boolean, errorMessage?: string, metadata?: any) {
    if (!this.scrapeId) return;
    
    await db.update(statuteScrapes)
      .set({
        status: success ? 'completed' : 'failed',
        completedAt: new Date(),
        errorMessage: errorMessage || null,
        metadata: metadata || null,
      })
      .where(eq(statuteScrapes.id, this.scrapeId));
    
    console.log(`[Scraper] Scrape session #${this.scrapeId} ${success ? 'completed' : 'failed'}`);
  }

  /**
   * Save statute to database
   */
  async saveStatute(statute: {
    citation: string;
    title: string;
    content: string;
    url: string;
    jurisdiction: string;
    category?: string;
    penalties?: string;
    effectiveDate?: string;
  }) {
    try {
      // Check if statute already exists
      const existing = await db.query.statutes.findFirst({
        where: eq(statutes.citation, statute.citation),
      });

      if (existing) {
        // Update existing statute
        await db.update(statutes)
          .set({
            ...statute,
            updatedAt: new Date(),
          })
          .where(eq(statutes.citation, statute.citation));
        console.log(`[Scraper] Updated statute: ${statute.citation}`);
      } else {
        // Insert new statute
        await db.insert(statutes).values(statute);
        console.log(`[Scraper] Inserted statute: ${statute.citation}`);
      }
      
      return true;
    } catch (error) {
      console.error(`[Scraper] Error saving statute ${statute.citation}:`, error);
      return false;
    }
  }

  /**
   * Abstract method - each state implements its own scraping logic
   */
  abstract scrape(): Promise<void>;

  /**
   * Abstract method - scrape a single statute by citation
   */
  abstract scrapeStatute(citation: string): Promise<any>;
}

/**
 * California Penal Code Scraper
 * Source: https://leginfo.legislature.ca.gov/
 */
export class CaliforniaScraper extends StatuteScraper {
  constructor() {
    super('https://leginfo.legislature.ca.gov', 'CA');
  }

  /**
   * Scrape all California Penal Code statutes
   */
  async scrape(): Promise<void> {
    await this.startScrapeSession('full_scrape');
    
    let statutesScraped = 0;
    let errorCount = 0;

    try {
      console.log('[CA Scraper] Starting California Penal Code scrape...');
      
      // Scrape Part 1 (Crimes and Punishments) - sections 25 to 680.4
      // We'll focus on the most common criminal statutes first
      const commonSections = [
        // Homicide (187-199)
        187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199,
        // Assault and Battery (240-248)
        240, 241, 242, 243, 244, 245, 246, 247, 248,
        // Mayhem (203-206)
        203, 204, 205, 206,
        // Kidnapping (207-210)
        207, 208, 209, 210,
        // Sex Offenses (261-269)
        261, 262, 263, 264, 265, 266, 267, 268, 269,
        // Robbery (211-215)
        211, 212, 212.5, 213, 214, 215,
        // Burglary (459-464)
        459, 460, 461, 462, 463, 464,
        // Theft (484-502.9)
        484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502,
        // Arson (451-462)
        451, 452, 453, 454, 455, 456, 457, 458,
        // Fraud (470-483.5)
        470, 475, 476, 480, 484,
        // Weapons (16000-34370) - select common ones
        16590, 17500, 25400, 25850, 26350, 29800, 30600, 32310,
        // Drug-related in Penal Code (11350-11392)
        11350, 11351, 11352, 11353, 11354, 11355, 11357, 11358, 11359, 11360,
        // DUI (Vehicle Code cross-reference in criminal charges)
        // Domestic Violence
        273.5, 273.6, 273.65, 273.7, 273.75, 273.8, 273.81, 273.82, 273.83,
      ];

      for (const section of commonSections) {
        try {
          const statute = await this.scrapeStatute(section.toString());
          if (statute) {
            const saved = await this.saveStatute(statute);
            if (saved) {
              statutesScraped++;
              await this.updateScrapeProgress(statutesScraped, errorCount);
            }
          }
        } catch (error) {
          console.error(`[CA Scraper] Error scraping section ${section}:`, error);
          errorCount++;
          await this.updateScrapeProgress(statutesScraped, errorCount);
        }
      }

      await this.completeScrapeSession(true, undefined, {
        sectionsAttempted: commonSections.length,
        sectionsSucceeded: statutesScraped,
        sectionsFailed: errorCount,
      });

      console.log(`[CA Scraper] Completed: ${statutesScraped} statutes scraped, ${errorCount} errors`);
    } catch (error) {
      console.error('[CA Scraper] Fatal error during scrape:', error);
      await this.completeScrapeSession(false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Scrape a single California Penal Code section
   */
  async scrapeStatute(sectionNum: string): Promise<any> {
    const url = `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=${sectionNum}&lawCode=PEN`;
    
    try {
      const html = await this.fetchWithRateLimit(url);
      const $ = cheerio.load(html);
      
      // Extract statute information
      const title = $('div.section-heading').first().text().trim();
      const content = $('div.section-content').first().text().trim();
      
      // If no content found, try alternative selectors
      let actualContent = content;
      if (!actualContent) {
        actualContent = $('body').text().trim();
        // Extract just the statute text (remove navigation, headers, etc.)
        const lines = actualContent.split('\n').filter(line => line.trim().length > 0);
        actualContent = lines.slice(2, -2).join('\n'); // Remove header/footer
      }

      if (!actualContent || actualContent.length < 20) {
        console.log(`[CA Scraper] No content found for section ${sectionNum}`);
        return null;
      }

      const citation = `Cal. Penal Code § ${sectionNum}`;
      
      return {
        citation,
        title: title || `Section ${sectionNum}`,
        content: actualContent,
        url,
        jurisdiction: 'CA',
        category: this.categorizeSection(sectionNum),
        effectiveDate: new Date().toISOString().split('T')[0],
      };
    } catch (error) {
      console.error(`[CA Scraper] Error fetching section ${sectionNum}:`, error);
      throw error;
    }
  }

  /**
   * Categorize California Penal Code sections by offense type
   */
  private categorizeSection(sectionNum: string): string {
    const num = parseInt(sectionNum);
    
    if (num >= 187 && num <= 199) return 'Homicide';
    if (num >= 203 && num <= 206) return 'Mayhem';
    if (num >= 207 && num <= 210) return 'Kidnapping';
    if (num >= 211 && num <= 215) return 'Robbery';
    if (num >= 240 && num <= 248) return 'Assault and Battery';
    if (num >= 261 && num <= 269) return 'Sex Offenses';
    if (num >= 273 && num <= 273.83) return 'Domestic Violence';
    if (num >= 451 && num <= 462) return 'Arson';
    if (num >= 459 && num <= 464) return 'Burglary';
    if (num >= 470 && num <= 483) return 'Forgery and Fraud';
    if (num >= 484 && num <= 502) return 'Theft and Related Offenses';
    if (num >= 11350 && num <= 11392) return 'Drug Offenses';
    if (num >= 16000 && num <= 34370) return 'Weapons Offenses';
    
    return 'Criminal Offenses';
  }
}
