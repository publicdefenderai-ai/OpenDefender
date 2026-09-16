/**
 * Stable, discovery-only evidence schemas for an Ohio Revised Code crawl.
 *
 * These records intentionally describe source traversal and statutory text.
 * They do not classify a section as a crime, create a charge mapping, or
 * publish anything to the application database.
 */

export const OHIO_CODE_HOST = "codes.ohio.gov";
export const OHIO_CODE_ROOT_URL = "https://codes.ohio.gov/ohio-revised-code";
export const OHIO_DISCOVERY_SCHEMA_VERSION = 1 as const;

export type DiscoveryStatus = "complete" | "incomplete" | "failed" | "not_run";
export type EvidenceStatus = "success" | "failed";

export interface OhioDiscoveryFailure {
  stage: "root" | "title" | "chapter" | "section";
  identity: string;
  sourceUrl: string;
  message: string;
}

export interface OhioDiscoveryMetrics {
  startedAt: string;
  finishedAt: string;
  elapsedMs: number;
  fetchAttempts: number;
  networkRequests: number;
  cacheHits: number;
  retries: number;
  failedRequests: number;
}

export interface OhioTitleInventoryRecord {
  titleNumber: string;
  title: string;
  sourceUrl: string;
  retrievedAt: string;
  status: EvidenceStatus;
}

export interface OhioChapterInventoryRecord {
  chapterId: string;
  chapterNumber: string;
  titleNumber: string;
  title: string;
  sourceUrl: string;
  retrievedAt: string;
  status: EvidenceStatus;
  /** Deliberately not performed by the statewide inventory crawl. */
  sectionEnumeration: {
    status: "not_run";
    reason: string;
  };
}

export interface OhioCodeInventoryOutput {
  schemaVersion: typeof OHIO_DISCOVERY_SCHEMA_VERSION;
  discoveryKind: "official_ohio_revised_code_chapter_inventory";
  publicationStatus: "discovery_only_not_published";
  generatedAt: string;
  source: {
    publisher: "Ohio Legislative Service Commission";
    rootUrl: string;
    allowedHost: typeof OHIO_CODE_HOST;
  };
  scope: {
    statewideChapterInventory: {
      status: DiscoveryStatus;
      method: "official root -> title pages -> chapter links";
      note: "A chapter link is an inventory item, not a determination that the chapter or any section is criminal.";
    };
    statewideSectionEnumeration: {
      status: "not_run";
      reason: string;
    };
  };
  titles: OhioTitleInventoryRecord[];
  chapters: OhioChapterInventoryRecord[];
  failures: OhioDiscoveryFailure[];
  metrics: OhioDiscoveryMetrics;
}

export interface OhioSectionEvidence {
  sectionId: string;
  title: string;
  sourceUrl: string;
  retrievedAt: string;
  effectiveDate: string;
  normalizedText: string;
  normalizedTextSha256: string;
  status: "success";
}

export interface OhioChapter2903DiscoveryOutput {
  schemaVersion: typeof OHIO_DISCOVERY_SCHEMA_VERSION;
  discoveryKind: "official_ohio_revised_code_chapter_section_evidence";
  publicationStatus: "discovery_only_not_published";
  generatedAt: string;
  source: {
    publisher: "Ohio Legislative Service Commission";
    rootUrl: string;
    chapterUrl: string;
    allowedHost: typeof OHIO_CODE_HOST;
  };
  scope: {
    chapterId: "chapter-2903";
    chapterSectionEnumeration: {
      status: DiscoveryStatus;
      method: "official chapter page -> section links -> section pages";
      note: "Sections are source inventory records only; this output makes no claim that every section is a crime or a publishable charge.";
    };
    statewideSectionEnumeration: {
      status: "not_run";
      reason: string;
    };
  };
  chapter: {
    chapterNumber: "2903";
    title: string;
    sourceUrl: string;
    retrievedAt: string;
    status: EvidenceStatus;
  };
  sections: OhioSectionEvidence[];
  failures: OhioDiscoveryFailure[];
  metrics: OhioDiscoveryMetrics;
}
