import { db } from '../db';
import { statutes } from '@shared/schema';
import { stateStatutesSeed } from '../data/state-statutes-seed';
import { sql } from 'drizzle-orm';
import { devLog, opsLog, errLog } from '../utils/dev-logger';

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
    opsLog('seeder', 'Starting database seeding...');
    opsLog('seeder', `Found ${stateStatutesSeed.length} statutes in seed data`);

    const rows = stateStatutesSeed.map(statute => ({
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
    }));

    // Single bulk upsert — replaces the N+1 SELECT + INSERT/UPDATE loop.
    // ON CONFLICT uses the (citation, jurisdiction) unique constraint defined in schema.ts.
    let inserted = 0;
    let errors = 0;
    try {
      await db.insert(statutes)
        .values(rows)
        .onConflictDoUpdate({
          target: [statutes.citation, statutes.jurisdiction],
          // Reference excluded.* so each row gets its own incoming values
          set: {
            title: sql`excluded.title`,
            content: sql`excluded.content`,
            summary: sql`excluded.summary`,
            category: sql`excluded.category`,
            relatedCharges: sql`excluded.related_charges`,
            penalties: sql`excluded.penalties`,
            url: sql`excluded.url`,
            sourceApi: sql`excluded.source_api`,
            isActive: sql`excluded.is_active`,
            lastUpdated: new Date(),
          },
        });
      inserted = rows.length;
      devLog('seeder', `Bulk upserted ${rows.length} statutes`);
    } catch (error) {
      errors = rows.length;
      errLog('[Seeder] Bulk upsert failed', error);
    }

    const message = `Seeding complete: ${inserted} upserted, ${errors} errors`;
    opsLog('seeder', message);

    return {
      success: errors === 0,
      inserted,
      updated: 0, // upsert handles both; breakdown not tracked at row level
      skipped: 0,
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
    opsLog('seeder', 'WARNING: Clearing all statutes from database...');
    const result = await db.delete(statutes);
    opsLog('seeder', 'Deleted all statutes from database');
    return 0; // Drizzle doesn't return count for delete operations
  }
}

// Singleton instance
export const statuteSeeder = new StatuteSeeder();
