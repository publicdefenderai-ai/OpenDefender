import { createHash } from "node:crypto";

export interface OhioSnapshotSection {
  section: string;
  chapter: string;
  catchline: string;
  sourceUrl: string;
  effectiveDate: string | null;
  text: string;
  contentHash: string;
  repealed: boolean;
}

export interface OhioCachedChapter {
  chapterNumber: string;
  titleNumber: string;
  retrievedAt: string;
  sections: OhioSnapshotSection[];
}

export interface OhioEnumeration {
  schemaVersion: number;
  discoveryKind: string;
  publicationStatus: string;
  generatedAt: string;
  totals: { chaptersAcquired: number; chaptersFailed: number; sections: number };
  failures: unknown[];
  chapters: Array<{
    chapterNumber: string; titleNumber: string; sectionCount: number; retrievedAt: string;
  }>;
  sections: Array<Omit<OhioSnapshotSection, "text"> & { titleNumber: string; textLength: number }>;
}

/** Verify exact snapshot accounting, not legal completeness or present-day currency. */
export function validateOhioSnapshot(chapters: OhioCachedChapter[], enumeration: OhioEnumeration): void {
  if (enumeration.schemaVersion !== 1 ||
      enumeration.discoveryKind !== "official_ohio_revised_code_section_enumeration" ||
      enumeration.publicationStatus !== "discovery_only_not_published" ||
      !Array.isArray(enumeration.failures) || enumeration.failures.length !== 0 ||
      enumeration.totals.chaptersFailed !== 0) {
    throw new Error("Ohio classification requires a successful section enumeration");
  }
  const expectedChapters = new Map(enumeration.chapters.map(row => [row.chapterNumber, row]));
  const expectedSections = new Map(enumeration.sections.map(row => [row.section, row]));
  if (expectedChapters.size !== enumeration.chapters.length ||
      expectedSections.size !== enumeration.sections.length ||
      expectedChapters.size !== enumeration.totals.chaptersAcquired ||
      expectedSections.size !== enumeration.totals.sections || expectedSections.size === 0) {
    throw new Error("Ohio enumeration has duplicate identities or inconsistent totals");
  }
  const seenChapters = new Set<string>();
  const seenSections = new Set<string>();
  for (const chapter of chapters) {
    const expectedChapter = expectedChapters.get(chapter.chapterNumber);
    if (!expectedChapter || seenChapters.has(chapter.chapterNumber) ||
        chapter.titleNumber !== expectedChapter.titleNumber ||
        chapter.retrievedAt !== expectedChapter.retrievedAt ||
        chapter.sections.length !== expectedChapter.sectionCount) {
      throw new Error(`Ohio chapter cache does not match enumeration: ${chapter.chapterNumber}`);
    }
    seenChapters.add(chapter.chapterNumber);
    for (const section of chapter.sections) {
      const expected = expectedSections.get(section.section);
      if (!expected || seenSections.has(section.section)) {
        throw new Error(`Ohio cache contains an unexpected or duplicate section: ${section.section}`);
      }
      seenSections.add(section.section);
      const hash = createHash("sha256").update(section.text).digest("hex");
      if (section.chapter !== chapter.chapterNumber || expected.titleNumber !== chapter.titleNumber ||
          !section.section.startsWith(`${chapter.chapterNumber}.`) ||
          section.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${section.section}` ||
          section.sourceUrl !== expected.sourceUrl ||
          hash !== section.contentHash || hash !== expected.contentHash ||
          section.text.length !== expected.textLength ||
          (!section.repealed && !section.text.trim()) ||
          section.chapter !== expected.chapter || section.catchline !== expected.catchline ||
          section.effectiveDate !== expected.effectiveDate || section.repealed !== expected.repealed) {
        throw new Error(`Ohio section evidence does not match enumeration: ${section.section}`);
      }
    }
  }
  if (seenChapters.size !== expectedChapters.size || seenSections.size !== expectedSections.size) {
    throw new Error("Ohio cache is incomplete relative to the recorded enumeration");
  }
}
