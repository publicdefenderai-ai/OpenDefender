import { type User, type InsertUser, type LegalCase, type InsertLegalCase, type LegalResource, type InsertLegalResource, type CourtData, type InsertCourtData, type LegalAidOrganization, type InsertLegalAidOrganization } from "@shared/schema";
import { randomUUID } from "crypto";
import { legalAidOrganizationsSeed } from "./data/legal-aid-organizations-seed";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private legalCases: Map<string, LegalCase>;
  private legalResources: Map<string, LegalResource>;
  private courtData: Map<string, CourtData>;
  private legalAidOrganizations: Map<string, LegalAidOrganization>;

  constructor() {
    this.users = new Map();
    this.legalCases = new Map();
    this.legalResources = new Map();
    this.courtData = new Map();
    this.legalAidOrganizations = new Map();
    
    // Initialize with sample legal resources and organizations
    this.initializeSampleData();
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
}

export const storage = new MemStorage();
