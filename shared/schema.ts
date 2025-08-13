import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const legalCases = pgTable("legal_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  charges: text("charges").array().notNull(),
  caseStage: text("case_stage").notNull(),
  custodyStatus: text("custody_status"),
  guidance: jsonb("guidance"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const legalResources = pgTable("legal_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  jurisdiction: text("jurisdiction"),
  source: text("source").notNull(),
  url: text("url"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const courtData = pgTable("court_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courtId: text("court_id").notNull(),
  courtName: text("court_name").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  hours: jsonb("hours"),
  services: text("services").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLegalCaseSchema = createInsertSchema(legalCases).omit({
  id: true,
  createdAt: true,
});

export const insertLegalResourceSchema = createInsertSchema(legalResources).omit({
  id: true,
  lastUpdated: true,
});

export const insertCourtDataSchema = createInsertSchema(courtData).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type LegalCase = typeof legalCases.$inferSelect;
export type InsertLegalResource = z.infer<typeof insertLegalResourceSchema>;
export type LegalResource = typeof legalResources.$inferSelect;
export type InsertCourtData = z.infer<typeof insertCourtDataSchema>;
export type CourtData = typeof courtData.$inferSelect;
