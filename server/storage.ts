import { type User, type InsertUser, type LegalCase, type InsertLegalCase, type LegalResource, type InsertLegalResource, type CourtData, type InsertCourtData, type LegalAidOrganization, type InsertLegalAidOrganization, type Statute, type InsertStatute, type CaseFeedback, type InsertCaseFeedback, type PrivacyConsent, type InsertPrivacyConsent } from "@shared/schema";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { legalAidOrganizationsSeed } from "./data/legal-aid-organizations-seed";
import { federalStatutesSeed } from "./data/federal-statutes-seed";
import { stateStatutesSeed } from "./data/state-statutes-seed";
import { opsLog, devLog } from "./utils/dev-logger";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Legal case management (ephemeral)
  createLegalCase(legalCase: InsertLegalCase): Promise<LegalCase>;
  getLegalCase(sessionId: string): Promise<LegalCase | undefined>;
  deleteLegalCase(sessionId: string): Promise<void>;
  
  // Legal resources
  getLegalResources(jurisdiction?: string, category?: string): Promise<LegalResource[]>;
  createLegalResource(resource: InsertLegalResource): Promise<LegalResource>;
  
  // Court data
  getCourtData(jurisdiction: string): Promise<CourtData[]>;
  createCourtData(courtData: InsertCourtData): Promise<CourtData>;
  
  // Legal aid organizations
  getLegalAidOrganizations(state?: string, organizationType?: string): Promise<LegalAidOrganization[]>;
  createLegalAidOrganization(organization: InsertLegalAidOrganization): Promise<LegalAidOrganization>;
  bulkCreateLegalAidOrganizations(organizations: InsertLegalAidOrganization[]): Promise<LegalAidOrganization[]>;
  
  // Statutes
  getStatutes(jurisdiction: string, searchQuery?: string): Promise<Statute[]>;
  createStatute(statute: InsertStatute): Promise<Statute>;
  
  // Case feedback
  createCaseFeedback(feedback: InsertCaseFeedback): Promise<CaseFeedback>;
  getCaseFeedbackStats(caseId: string): Promise<{ helpful: number; notHelpful: number }>;
  getCaseFeedbackBySession(sessionId: string): Promise<CaseFeedback[]>;
  
  // Privacy consent tracking (anonymous)
  recordPrivacyConsent(consent: InsertPrivacyConsent): Promise<PrivacyConsent>;
  getPrivacyConsentStats(): Promise<{ total: number; granted: number; denied: number; byType: Record<string, number> }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private legalCases: Map<string, LegalCase>;
  private legalResources: Map<string, LegalResource>;
  private courtData: Map<string, CourtData>;
  private legalAidOrganizations: Map<string, LegalAidOrganization>;
  private statutes: Map<string, Statute>;
  private caseFeedback: Map<string, CaseFeedback>;
  private privacyConsents: Map<string, PrivacyConsent>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.users = new Map();
    this.legalCases = new Map();
    this.legalResources = new Map();
    this.courtData = new Map();
    this.legalAidOrganizations = new Map();
    this.statutes = new Map();
    this.caseFeedback = new Map();
    this.privacyConsents = new Map();
    
    // Initialize with sample legal resources and organizations
    this.initializeSampleData();
    
    // Start periodic cleanup of expired session data (every 15 minutes)
    this.startPeriodicCleanup();
  }

  private startPeriodicCleanup() {
    // Run cleanup every 15 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 15 * 60 * 1000);
  }

  private cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCases = 0;
    let cleanedFeedback = 0;
    
    // Clean up expired legal cases
    const caseEntries = Array.from(this.legalCases.entries());
    for (const [sessionId, legalCase] of caseEntries) {
      if (legalCase.expiresAt && legalCase.expiresAt <= now) {
        this.legalCases.delete(sessionId);
        cleanedCases++;
      }
    }
    
    // Clean up feedback older than 24 hours (associated with expired sessions)
    const expiryThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const feedbackEntries = Array.from(this.caseFeedback.entries());
    for (const [id, feedback] of feedbackEntries) {
      if (feedback.createdAt && feedback.createdAt <= expiryThreshold) {
        this.caseFeedback.delete(id);
        cleanedFeedback++;
      }
    }
    
    if (cleanedCases > 0 || cleanedFeedback > 0) {
      opsLog(`[Privacy Cleanup] Removed ${cleanedCases} expired cases, ${cleanedFeedback} old feedback entries`);
    }
  }

  // Delete all session-related data for a specific session (for explicit cleanup)
  async deleteSessionData(sessionId: string): Promise<void> {
    // Delete legal case
    this.legalCases.delete(sessionId);
    
    // Delete associated feedback
    const feedbackEntries = Array.from(this.caseFeedback.entries());
    for (const [id, feedback] of feedbackEntries) {
      if (feedback.sessionId === sessionId) {
        this.caseFeedback.delete(id);
      }
    }
    
    devLog(`[Privacy] Session data deleted for session: ${sessionId.substring(0, 8)}...`);
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private initializeSampleData() {
    // Add sample legal resources
    const sampleResources: LegalResource[] = [
      {
        id: randomUUID(),
        title: "Miranda Rights Explanation",
        category: "rights",
        content: "You have the right to remain silent. Anything you say can and will be used against you in a court of law...",
        jurisdiction: "federal",
        source: "US Constitution Amendment V",
        url: "https://www.law.cornell.edu/constitution/fifth_amendment",
        lastUpdated: new Date(),
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "Arrest Procedures",
        category: "process",
        content: "When you are arrested, the following steps typically occur...",
        jurisdiction: "federal",
        source: "Federal Rules of Criminal Procedure",
        url: "https://www.law.cornell.edu/rules/frcrmp",
        lastUpdated: new Date(),
        isActive: true,
      },
    ];

    sampleResources.forEach(resource => {
      this.legalResources.set(resource.id, resource);
    });

    // Add sample court data
    const sampleCourts: CourtData[] = [
      {
        id: randomUUID(),
        courtId: "NYSD",
        courtName: "US District Court Southern District of New York",
        jurisdiction: "NY",
        address: "500 Pearl St, New York, NY 10007",
        phone: "(212) 805-0136",
        website: "https://www.nysd.uscourts.gov",
        hours: { monday: "9:00-17:00", tuesday: "9:00-17:00", wednesday: "9:00-17:00", thursday: "9:00-17:00", friday: "9:00-17:00" },
        services: ["criminal", "civil", "bankruptcy"],
        lastUpdated: new Date(),
      },
    ];

    sampleCourts.forEach(court => {
      this.courtData.set(court.id, court);
    });

    // Initialize legal aid organizations from seed data
    legalAidOrganizationsSeed.forEach(org => {
      const id = randomUUID();
      const organization: LegalAidOrganization = {
        ...org,
        id,
        lastUpdated: new Date(),
        isActive: org.isActive ?? true,
      };
      this.legalAidOrganizations.set(id, organization);
    });

    // Initialize statutes from seed data (federal and state)
    [...federalStatutesSeed, ...stateStatutesSeed].forEach(statute => {
      const id = randomUUID();
      const statuteWithId: Statute = {
        ...statute,
        id,
        lastUpdated: new Date(),
        isActive: statute.isActive ?? true,
      };
      this.statutes.set(id, statuteWithId);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLegalCase(insertCase: InsertLegalCase): Promise<LegalCase> {
    const id = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const legalCase: LegalCase = {
      ...insertCase,
      id,
      createdAt: now,
      expiresAt,
    };
    
    this.legalCases.set(insertCase.sessionId, legalCase);
    
    // Auto-cleanup expired cases
    setTimeout(() => {
      this.legalCases.delete(insertCase.sessionId);
    }, 24 * 60 * 60 * 1000);
    
    return legalCase;
  }

  async getLegalCase(sessionId: string): Promise<LegalCase | undefined> {
    const legalCase = this.legalCases.get(sessionId);
    if (legalCase && legalCase.expiresAt > new Date()) {
      return legalCase;
    }
    // Clean up expired case
    if (legalCase) {
      this.legalCases.delete(sessionId);
    }
    return undefined;
  }

  async deleteLegalCase(sessionId: string): Promise<void> {
    this.legalCases.delete(sessionId);
  }

  async getLegalResources(jurisdiction?: string, category?: string): Promise<LegalResource[]> {
    return Array.from(this.legalResources.values()).filter(resource => {
      if (!resource.isActive) return false;
      if (jurisdiction && resource.jurisdiction && resource.jurisdiction !== jurisdiction && resource.jurisdiction !== 'federal') return false;
      if (category && resource.category !== category) return false;
      return true;
    });
  }

  async createLegalResource(insertResource: InsertLegalResource): Promise<LegalResource> {
    const id = randomUUID();
    const resource: LegalResource = {
      ...insertResource,
      id,
      lastUpdated: new Date(),
      isActive: true,
    };
    this.legalResources.set(id, resource);
    return resource;
  }

  async getCourtData(jurisdiction: string): Promise<CourtData[]> {
    return Array.from(this.courtData.values()).filter(
      court => court.jurisdiction === jurisdiction
    );
  }

  async createCourtData(insertCourtData: InsertCourtData): Promise<CourtData> {
    const id = randomUUID();
    const courtData: CourtData = {
      ...insertCourtData,
      id,
      lastUpdated: new Date(),
    };
    this.courtData.set(id, courtData);
    return courtData;
  }

  async getLegalAidOrganizations(state?: string, organizationType?: string): Promise<LegalAidOrganization[]> {
    return Array.from(this.legalAidOrganizations.values()).filter(org => {
      if (!org.isActive) return false;
      if (state && org.state !== state) return false;
      if (organizationType && org.organizationType !== organizationType) return false;
      return true;
    });
  }

  async createLegalAidOrganization(insertOrganization: InsertLegalAidOrganization): Promise<LegalAidOrganization> {
    const id = randomUUID();
    const organization: LegalAidOrganization = {
      ...insertOrganization,
      id,
      lastUpdated: new Date(),
      isActive: insertOrganization.isActive ?? true,
    };
    this.legalAidOrganizations.set(id, organization);
    return organization;
  }

  async bulkCreateLegalAidOrganizations(organizations: InsertLegalAidOrganization[]): Promise<LegalAidOrganization[]> {
    const created: LegalAidOrganization[] = [];
    for (const org of organizations) {
      const result = await this.createLegalAidOrganization(org);
      created.push(result);
    }
    return created;
  }

  async getStatutes(jurisdiction: string, searchQuery?: string): Promise<Statute[]> {
    const jurisdictionLower = jurisdiction.toLowerCase();
    
    return Array.from(this.statutes.values()).filter(statute => {
      // Filter by active status
      if (!statute.isActive) return false;
      
      // Filter by jurisdiction
      if (jurisdictionLower !== statute.jurisdiction.toLowerCase()) return false;
      
      // If no search query, return all statutes for jurisdiction
      if (!searchQuery) return true;
      
      // Search in title, citation, summary, content, and category
      const query = searchQuery.toLowerCase();
      return (
        statute.title?.toLowerCase().includes(query) ||
        statute.citation?.toLowerCase().includes(query) ||
        statute.summary?.toLowerCase().includes(query) ||
        statute.content?.toLowerCase().includes(query) ||
        statute.category?.toLowerCase().includes(query) ||
        statute.relatedCharges?.some(charge => charge.toLowerCase().includes(query))
      );
    });
  }

  async createStatute(insertStatute: InsertStatute): Promise<Statute> {
    const id = randomUUID();
    const statute: Statute = {
      ...insertStatute,
      id,
      lastUpdated: new Date(),
      isActive: insertStatute.isActive ?? true,
    };
    this.statutes.set(id, statute);
    return statute;
  }

  async createCaseFeedback(insertFeedback: InsertCaseFeedback): Promise<CaseFeedback> {
    const id = randomUUID();
    const feedback: CaseFeedback = {
      id,
      sessionId: insertFeedback.sessionId,
      caseId: insertFeedback.caseId,
      caseName: insertFeedback.caseName,
      jurisdiction: insertFeedback.jurisdiction,
      chargeCategory: insertFeedback.chargeCategory ?? null,
      isHelpful: insertFeedback.isHelpful,
      caseStage: insertFeedback.caseStage ?? null,
      createdAt: new Date(),
    };
    this.caseFeedback.set(id, feedback);
    return feedback;
  }

  async getCaseFeedbackStats(caseId: string): Promise<{ helpful: number; notHelpful: number }> {
    let helpful = 0;
    let notHelpful = 0;
    
    const feedbackArray = Array.from(this.caseFeedback.values());
    for (const feedback of feedbackArray) {
      if (feedback.caseId === caseId) {
        if (feedback.isHelpful) {
          helpful++;
        } else {
          notHelpful++;
        }
      }
    }
    
    return { helpful, notHelpful };
  }

  async getCaseFeedbackBySession(sessionId: string): Promise<CaseFeedback[]> {
    return Array.from(this.caseFeedback.values()).filter(
      feedback => feedback.sessionId === sessionId
    );
  }

  async recordPrivacyConsent(insertConsent: InsertPrivacyConsent): Promise<PrivacyConsent> {
    const id = randomUUID();
    
    // Create unique key for deduplication (sessionHash + consentType)
    const uniqueKey = `${insertConsent.sessionHash}_${insertConsent.consentType}`;
    
    // Check if consent already exists for this session/type combo
    const existing = Array.from(this.privacyConsents.values()).find(
      c => c.sessionHash === insertConsent.sessionHash && c.consentType === insertConsent.consentType
    );
    
    if (existing) {
      // Update existing consent record
      const updated: PrivacyConsent = {
        ...existing,
        granted: insertConsent.granted,
        consentVersion: insertConsent.consentVersion,
        consentedAt: new Date(),
      };
      this.privacyConsents.set(existing.id, updated);
      return updated;
    }
    
    // Create new consent record
    const consent: PrivacyConsent = {
      id,
      sessionHash: insertConsent.sessionHash,
      consentType: insertConsent.consentType,
      consentVersion: insertConsent.consentVersion,
      granted: insertConsent.granted,
      ipHash: insertConsent.ipHash ?? null,
      userAgent: insertConsent.userAgent ?? null,
      consentedAt: new Date(),
    };
    this.privacyConsents.set(id, consent);
    return consent;
  }

  async getPrivacyConsentStats(): Promise<{ total: number; granted: number; denied: number; byType: Record<string, number> }> {
    const consents = Array.from(this.privacyConsents.values());
    const byType: Record<string, number> = {};
    
    let granted = 0;
    let denied = 0;
    
    for (const consent of consents) {
      if (consent.granted) {
        granted++;
      } else {
        denied++;
      }
      
      // Count by type
      byType[consent.consentType] = (byType[consent.consentType] || 0) + 1;
    }
    
    return {
      total: consents.length,
      granted,
      denied,
      byType,
    };
  }
}

export const storage = new MemStorage();
