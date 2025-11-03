import { db } from '../db';
import { statutes } from '@shared/schema';
import { stateStatutesSeed } from '../data/state-statutes-seed';
import { eq } from 'drizzle-orm';

/**
 * Database Seeder for State Statutes
 * Loads stateStatutesSeed data into PostgreSQL database
 */

export interface SeedResult {
  success: boolean;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  message: string;
}

export class StatuteSeeder {
  /**
   * Seed the database with stateStatutesSeed data
   */
  async seedDatabase(): Promise<SeedResult> {
    console.log('[Seeder] Starting database seeding...');
    console.log(`[Seeder] Found ${stateStatutesSeed.length} statutes in seed data`);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const statute of stateStatutesSeed) {
      try {
        // Check if statute already exists
        const existing = await db.query.statutes.findFirst({
          where: eq(statutes.citation, statute.citation),
        });

        if (existing) {
          // Update existing statute
          await db.update(statutes)
            .set({
              title: statute.title,
              content: statute.content,
              summary: statute.summary,
              category: statute.category,
              relatedCharges: statute.relatedCharges,
              penalties: statute.penalties,
              url: statute.url,
              sourceApi: statute.sourceApi,
              isActive: statute.isActive,
              lastUpdated: new Date(),
            })
            .where(eq(statutes.citation, statute.citation));
          
          updated++;
          console.log(`[Seeder] Updated: ${statute.citation}`);
        } else {
          // Insert new statute
          await db.insert(statutes).values({
            title: statute.title,
            citation: statute.citation,
            jurisdiction: statute.jurisdiction,
            level: statute.level,
            chapter: statute.chapter || null,
            section: statute.section,
            content: statute.content,
            summary: statute.summary || null,
            category: statute.category || null,
            relatedCharges: statute.relatedCharges || [],
            penalties: statute.penalties || null,
            url: statute.url || null,
            sourceApi: statute.sourceApi || 'manual',
            isActive: statute.isActive !== false,
          });
          
          inserted++;
          console.log(`[Seeder] Inserted: ${statute.citation}`);
        }
      } catch (error) {
        errors++;
        console.error(`[Seeder] Error processing ${statute.citation}:`, error);
      }
    }

    const message = `Seeding complete: ${inserted} inserted, ${updated} updated, ${skipped} skipped, ${errors} errors`;
    console.log(`[Seeder] ${message}`);

    return {
      success: errors === 0,
      inserted,
      updated,
      skipped,
      errors,
      message,
    };
  }

  /**
   * Get seeding status - check how many statutes are in the database
   */
  async getSeedingStatus(): Promise<{
    totalInDatabase: number;
    totalInSeedData: number;
    byJurisdiction: Record<string, number>;
  }> {
    const allStatutes = await db.query.statutes.findMany();
    
    // Count by jurisdiction
    const byJurisdiction: Record<string, number> = {};
    allStatutes.forEach(statute => {
      byJurisdiction[statute.jurisdiction] = (byJurisdiction[statute.jurisdiction] || 0) + 1;
    });

    return {
      totalInDatabase: allStatutes.length,
      totalInSeedData: stateStatutesSeed.length,
      byJurisdiction,
    };
  }

  /**
   * Clear all statutes from the database (use with caution!)
   */
  async clearDatabase(): Promise<number> {
    console.log('[Seeder] WARNING: Clearing all statutes from database...');
    const result = await db.delete(statutes);
    console.log(`[Seeder] Deleted all statutes from database`);
    return 0; // Drizzle doesn't return count for delete operations
  }
}

// Singleton instance
export const statuteSeeder = new StatuteSeeder();
