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

// Legal Glossary Schema
export const glossaryTerms = pgTable("glossary_terms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  aliases: text("aliases").array(),
  tags: text("tags").array(),
  slug: text("slug").notNull().unique(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Diversion Programs Schema
export const diversionPrograms = pgTable("diversion_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  jurisdictionType: text("jurisdiction_type").notNull(), // 'county', 'city', 'state'
  state: text("state").notNull(),
  county: text("county"),
  cities: text("cities").array(),
  zipCodes: text("zip_codes").array(),
  programTypes: text("program_types").array().notNull(),
  eligibilityNotes: text("eligibility_notes"),
  contact: jsonb("contact"), // { phone?, email?, url? }
  sources: text("sources").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Record Expungement Schema
export const expungementRules = pgTable("expungement_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  state: text("state").notNull(),
  overview: text("overview").notNull(),
  waitingPeriods: jsonb("waiting_periods"), // { misdemeanorMonths?, felonyMonths? }
  exclusions: text("exclusions").array(),
  conditions: text("conditions").array(),
  steps: text("steps").array(),
  sources: text("sources").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Insert schemas for new tables
export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).omit({
  id: true,
  lastUpdated: true,
});

export const insertDiversionProgramSchema = createInsertSchema(diversionPrograms).omit({
  id: true,
  lastUpdated: true,
});

export const insertExpungementRuleSchema = createInsertSchema(expungementRules).omit({
  id: true,
  lastUpdated: true,
});

// Types for new schemas
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type InsertDiversionProgram = z.infer<typeof insertDiversionProgramSchema>;
export type DiversionProgram = typeof diversionPrograms.$inferSelect;
export type InsertExpungementRule = z.infer<typeof insertExpungementRuleSchema>;
export type ExpungementRule = typeof expungementRules.$inferSelect;

// RECAP/Court Records Schema - for caching search results and documents
export const courtRecords = pgTable("court_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recordType: text("record_type").notNull(), // 'opinion', 'docket', 'recap_document'
  courtListenerId: text("courtlistener_id"), // ID from CourtListener/RECAP
  pacerId: text("pacer_id"), // PACER case/document ID if available
  courtId: text("court_id").notNull(),
  courtName: text("court_name"),
  caseName: text("case_name").notNull(),
  caseNumber: text("case_number"),
  docketNumber: text("docket_number"),
  dateFiled: timestamp("date_filed"),
  description: text("description"),
  documentUrl: text("document_url"),
  recapUrl: text("recap_url"), // Free RECAP archive URL if available
  pacerUrl: text("pacer_url"), // PACER URL (costs money)
  isRecapAvailable: boolean("is_recap_available").default(false),
  metadata: jsonb("metadata"), // Additional data from API
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const insertCourtRecordSchema = createInsertSchema(courtRecords).omit({
  id: true,
  lastChecked: true,
});

export type InsertCourtRecord = z.infer<typeof insertCourtRecordSchema>;
export type CourtRecord = typeof courtRecords.$inferSelect;

// Legal Aid Organizations Schema - comprehensive database of legal assistance providers
export const legalAidOrganizations = pgTable("legal_aid_organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  organizationType: text("organization_type").notNull(), // 'immigration', 'criminal_defense', 'civil_legal_aid', 'public_defender'
  address: text("address"),
  city: text("city").notNull(),
  state: text("state").notNull(), // Two-letter state code
  zipCode: text("zip_code"),
  county: text("county"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  latitude: text("latitude"), // Stored as text for precision
  longitude: text("longitude"), // Stored as text for precision
  services: text("services").array(), // e.g., ['Deportation Defense', 'Asylum Applications', 'Criminal Defense']
  eligibility: text("eligibility"), // Requirements/restrictions
  dataSource: text("data_source").notNull(), // 'EOIR', 'LSC', 'usa.gov', 'manual'
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertLegalAidOrganizationSchema = createInsertSchema(legalAidOrganizations).omit({
  id: true,
  lastUpdated: true,
});

export type InsertLegalAidOrganization = z.infer<typeof insertLegalAidOrganizationSchema>;
export type LegalAidOrganization = typeof legalAidOrganizations.$inferSelect;

// Statutes Schema - Federal and State Criminal Laws
export const statutes = pgTable("statutes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  citation: text("citation").notNull(), // e.g., "18 USC § 1001", "Cal. Penal Code § 242"
  jurisdiction: text("jurisdiction").notNull(), // 'federal' or two-letter state code
  level: text("level").notNull(), // 'federal', 'state'
  chapter: text("chapter"), // Chapter or division number
  section: text("section").notNull(), // Section number
  content: text("content").notNull(), // Full text of the statute
  summary: text("summary"), // Plain language summary
  category: text("category"), // e.g., 'fraud', 'assault', 'theft', 'drug_offenses'
  relatedCharges: text("related_charges").array(), // Criminal charge names this statute covers
  penalties: text("penalties"), // Description of potential penalties
  url: text("url"), // Link to official source (Cornell LII, GovInfo, state website)
  sourceApi: text("source_api"), // 'govinfo', 'cornell_lii', 'state_website', 'manual'
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertStatuteSchema = createInsertSchema(statutes).omit({
  id: true,
  lastUpdated: true,
});

export type InsertStatute = z.infer<typeof insertStatuteSchema>;
export type Statute = typeof statutes.$inferSelect;
