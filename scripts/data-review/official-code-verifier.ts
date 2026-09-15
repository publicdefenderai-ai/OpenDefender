/**
 * Deterministic official-code adapters used by the commission/citation import.
 *
 * The adapters deliberately keep the raw source hash and the evidence used for
 * currentness separate from the catalog promotion decision. A section-number
 * match alone is never enough to create a verified mapping.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";

export type OfficialCodeState = "MN" | "VA" | "MI";
export type MappingClass = "exact" | "likely_alias" | "compound_shared" | "unresolved";

export interface OfficialCodeDocument {
  state: OfficialCodeState;
  section: string;
  title: string;
  text: string;
  sourceUrl: string;
  sourceHash: string;
  retrievedAt: string;
  sourceTransport: "https-tls-verified" | "fixture";
  currentness: {
    status: "verified" | "stale" | "unverified";
    evidence: string | null;
    editionYear: number | null;
  };
  instructionEvidence?: {
    reference: string;
    sourceUrl: string;
    independentSource: boolean;
  };
}

export interface OfficialCodeFixture {
  state: OfficialCodeState;
  sources: Array<{
    section: string;
    sourceUrl: string;
    html: string;
    sourceHash?: string;
  }>;
}

export interface OfficialCatalogEntry {
  id: string;
  citation: string;
  name?: string;
  instructionRef?: string;
  instructionUrl?: string;
}

export interface OfficialComparisonMapping {
  chargeId: string;
  citation: string;
  section: string | null;
  sections: string[];
  catalogTitle: string;
  mappingClass: MappingClass;
  score: number;
  reasonCode: string;
  reason: string;
  sourceHash: string | null;
  sourceUrl: string | null;
  officialTitle: string | null;
  currentness: OfficialCodeDocument["currentness"] | null;
  instructionEvidence: OfficialCodeDocument["instructionEvidence"] | null;
}

export interface OfficialComparisonReport {
  schemaVersion: 1;
  state: OfficialCodeState;
  generatedAt: string;
  officialSource: {
    publisher: string;
    adapter: string;
    transportPolicy: string;
  };
  sourceDocuments: Array<Pick<
    OfficialCodeDocument,
    "section" | "sourceUrl" | "sourceHash" | "retrievedAt" | "sourceTransport" | "currentness"
  >>;
  mappings: OfficialComparisonMapping[];
  unresolved: Array<{
    chargeId: string;
    reasonCode: string;
    reason: string;
  }>;
  summary: {
    totalCatalogEntries: number;
    exactMappings: number;
    likelyAliases: number;
    compoundOrSharedCitations: number;
    unresolved: number;
    currentnessVerifiedDocuments: number;
  };
}

export function isOfficialPromotionEligible(
  mapping: Pick<OfficialComparisonMapping, "mappingClass" | "currentness" | "officialTitle" | "sourceHash"> | undefined,
): boolean {
  return Boolean(
    mapping &&
    mapping.mappingClass === "exact" &&
    mapping.currentness?.status === "verified" &&
    mapping.officialTitle &&
    mapping.sourceHash,
  );
}

const ADAPTER_INFO: Record<OfficialCodeState, OfficialComparisonReport["officialSource"]> = {
  MN: {
    publisher: "Minnesota Revisor of Statutes",
    adapter: "Minnesota Statutes chapter/section adapter",
    transportPolicy: "Official revisor.mn.gov source over default verified HTTPS",
  },
  VA: {
    publisher: "Virginia Legislative Information System",
    adapter: "Virginia Code per-section adapter",
    transportPolicy: "Official law.lis.virginia.gov source over default verified HTTPS",
  },
  MI: {
    publisher: "Michigan Legislature",
    adapter: "Michigan Compiled Laws per-section adapter",
    transportPolicy: "Official legislature.mi.gov source over default verified HTTPS; no TLS bypass",
  },
};

const INSTRUCTION_HOST = "courts.michigan.gov";

function decodeHtml(value: string): string {
  const withBoundaries = value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|h[1-6]|div|li|section|tr|td)>/gi, "\n");
  const doc = new JSDOM(withBoundaries).window.document;
  return (doc.body?.textContent ?? value)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function titleFromText(state: OfficialCodeState, section: string, text: string): string {
  const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns: RegExp[] = state === "VA"
    ? [
        new RegExp(`§\\s*${escapedSection}\\.\\s*([^\\n]+)`, "i"),
        new RegExp(`(?:Section|§)\\s*${escapedSection}\\s*[|.:\\-]\\s*([^\\n]+)`, "i"),
      ]
    : [
        new RegExp(`(?:§\\s*)?${escapedSection}(?:\\.|\\s+)\\s*([^\\n]+)`, "i"),
        new RegExp(`(?:Section|MCL)\\s*${escapedSection}\\s*[|.:\\-\\s]+([^\\n]+)`, "i"),
      ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].replace(/[.;\s]+$/, "").trim();
  }
  return "";
}

function currentnessFor(
  state: OfficialCodeState,
  text: string,
  rawHtml = "",
): OfficialCodeDocument["currentness"] {
  const patterns: Record<OfficialCodeState, RegExp[]> = {
    MN: [
      /20\d{2}\s+Minnesota\s+Statutes/i,
      /current\s+through\s+(?:the\s+)?(?:20\d{2}|the\s+[\w\s]+session)/i,
    ],
    VA: [
      /Code\s+of\s+Virginia/i,
    ],
    MI: [
      /current\s+through\s+(?:the\s+)?(?:20\d{2}|the\s+[\w\s]+session)/i,
      /20\d{2}\s+(?:Michigan\s+)?Public\s+Acts?/i,
    ],
  };
  const printDate = state === "VA"
    ? rawHtml.match(/id\s*=\s*['"]printDate['"][^>]*>\s*([^<]+)\s*</i)?.[1]?.trim()
    : null;
  const evidence = printDate
    ? `printDate ${printDate}`
    : patterns[state].map((pattern) => text.match(pattern)?.[0]).find(Boolean) ?? null;
  const yearMatch = evidence?.match(/20\d{2}/);
  const editionYear = yearMatch ? Number(yearMatch[0]) : null;
  if (!evidence || !editionYear) return { status: "unverified", evidence, editionYear };
  const currentYear = new Date().getUTCFullYear();
  return {
    status: editionYear < currentYear - 1 ? "stale" : "verified",
    evidence,
    editionYear,
  };
}

function parseOfficialDocument(
  state: OfficialCodeState,
  html: string,
  section: string,
  sourceUrl: string,
  sourceTransport: OfficialCodeDocument["sourceTransport"],
  retrievedAt = new Date(),
  instruction?: OfficialCodeDocument["instructionEvidence"],
): OfficialCodeDocument {
  const text = decodeHtml(html);
  const title = titleFromText(state, section, text);
  return {
    state,
    section,
    title,
    text,
    sourceUrl,
    sourceHash: createHash("sha256").update(html).digest("hex"),
    retrievedAt: retrievedAt.toISOString(),
    sourceTransport,
    currentness: currentnessFor(state, text, html),
    ...(instruction ? { instructionEvidence: instruction } : {}),
  };
}

export function parseMinnesotaOfficialDocument(
  html: string,
  section: string,
  sourceUrl = `https://www.revisor.mn.gov/statutes/cite/${section}`,
  retrievedAt = new Date(),
): OfficialCodeDocument {
  return parseOfficialDocument("MN", html, section, sourceUrl, "fixture", retrievedAt);
}

export function parseVirginiaOfficialDocument(
  html: string,
  section: string,
  sourceUrl = `https://law.lis.virginia.gov/vacode/${section}/`,
  retrievedAt = new Date(),
): OfficialCodeDocument {
  return parseOfficialDocument("VA", html, section, sourceUrl, "fixture", retrievedAt);
}

export function parseMichiganOfficialDocument(
  html: string,
  section: string,
  sourceUrl = `https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-${section.replace(/\./g, "-")}`,
  retrievedAt = new Date(),
  instruction?: { reference: string; sourceUrl: string },
): OfficialCodeDocument {
  const instructionEvidence = instruction && (
    new URL(instruction.sourceUrl).hostname === INSTRUCTION_HOST ||
    new URL(instruction.sourceUrl).hostname.endsWith(`.${INSTRUCTION_HOST}`)
  )
    ? { ...instruction, independentSource: true }
    : undefined;
  return parseOfficialDocument("MI", html, section, sourceUrl, "fixture", retrievedAt, instructionEvidence);
}

export function parseCitationSection(citation: string): string | null {
  return parseCitationSections(citation)[0] ?? null;
}

export function parseCitationSections(citation: string): string[] {
  const marker = citation.match(/§§?\s*([^;]+)/)?.[1];
  if (!marker) return [];
  return marker
    .split(",")
    // Target-state code sections are numeric. Requiring a numeric start keeps
    // qualifiers such as ", subd. 4" from becoming fake statute sections.
    .map((part) => part.trim().match(/^(\d[\dA-Za-z.:-]*)/)?.[1] ?? null)
    .filter((section): section is string => Boolean(section));
}

function officialSourceUrl(state: OfficialCodeState, section: string): string {
  if (state === "MN") return `https://www.revisor.mn.gov/statutes/cite/${section}`;
  if (state === "VA") return `https://law.lis.virginia.gov/vacode/${section}/`;
  return `https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-${section.replace(/\./g, "-")}`;
}

function instructionFor(entry: OfficialCatalogEntry, state: OfficialCodeState): OfficialCodeDocument["instructionEvidence"] {
  if (state !== "MI" || !entry.instructionRef || !entry.instructionUrl) return undefined;
  try {
    const hostname = new URL(entry.instructionUrl).hostname;
    if (hostname !== INSTRUCTION_HOST && !hostname.endsWith(`.${INSTRUCTION_HOST}`)) return undefined;
  } catch {
    return undefined;
  }
  return {
    reference: entry.instructionRef,
    sourceUrl: entry.instructionUrl,
    independentSource: true,
  };
}

function normalizeWords(value: string): Set<string> {
  return new Set(
    value.toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .map((word) => word.endsWith("ing") && word.length > 5 ? word.slice(0, -3) : word)
      .filter((word) => ![
        "first", "second", "third", "degree", "offense", "offence",
        "the", "and", "for", "with", "from", "into",
      ].includes(word)),
  );
}

function catalogTitle(entry: OfficialCatalogEntry): string {
  if (entry.name) return entry.name;
  return entry.id.replace(/^[a-z]{2}-/, "").replace(/-/g, " ");
}

export function buildOfficialComparisonReport(
  state: OfficialCodeState,
  entries: OfficialCatalogEntry[],
  documents: Map<string, OfficialCodeDocument>,
  generatedAt = new Date(),
): OfficialComparisonReport {
  const bySection = new Map<string, OfficialCatalogEntry[]>();
  for (const entry of entries) {
    const section = parseCitationSection(entry.citation);
    if (!section) continue;
    const current = bySection.get(section) ?? [];
    current.push(entry);
    bySection.set(section, current);
  }

  const mappings = entries.map((entry): OfficialComparisonMapping => {
    const sections = parseCitationSections(entry.citation);
    const section = sections[0] ?? null;
    const document = section ? documents.get(section) : undefined;
    const missingCompoundSection = sections.find((candidate) => !documents.has(candidate));
    const title = catalogTitle(entry);
    const shared = section ? (bySection.get(section)?.length ?? 0) > 1 : false;
    const titleWords = normalizeWords(title);
    const officialWords = normalizeWords(document?.title ?? "");
    const overlap = [...titleWords].filter((word) => officialWords.has(word)).length;
    const overlapRatio = titleWords.size ? overlap / titleWords.size : 0;
    const instructionEvidence = document?.instructionEvidence ?? instructionFor(entry, state) ?? null;

    if (!section) {
      return {
        chargeId: entry.id, citation: entry.citation, section: null, catalogTitle: title,
        sections,
        mappingClass: "unresolved", score: 0, reasonCode: "citation_section_unparseable",
        reason: "The catalog citation has no machine-readable section number.",
        sourceHash: null, sourceUrl: null, officialTitle: null, currentness: null, instructionEvidence,
      };
    }
    if (!document) {
      return {
        chargeId: entry.id, citation: entry.citation, section, catalogTitle: title,
        sections,
        mappingClass: "unresolved", score: 0, reasonCode: "official_section_not_found",
        reason: `No ${state} official source document was available for section ${section}.`,
        sourceHash: null, sourceUrl: officialSourceUrl(state, section),
        officialTitle: null, currentness: null, instructionEvidence,
      };
    }
    if (missingCompoundSection) {
      return {
        chargeId: entry.id, citation: entry.citation, section, sections, catalogTitle: title,
        mappingClass: "unresolved", score: 35, reasonCode: "compound_citation_section_not_found",
        reason: `The compound citation includes section ${missingCompoundSection}, which was not available from the official source.`,
        sourceHash: document.sourceHash, sourceUrl: document.sourceUrl,
        officialTitle: document.title || null, currentness: document.currentness, instructionEvidence,
      };
    }
    if (!document.title || !document.text) {
      return {
        chargeId: entry.id, citation: entry.citation, section, sections, catalogTitle: title,
        mappingClass: "unresolved", score: 25, reasonCode: "official_title_or_content_missing",
        reason: `Section ${section} was retrieved but its title or statutory text was not extracted.`,
        sourceHash: document.sourceHash, sourceUrl: document.sourceUrl,
        officialTitle: document.title || null, currentness: document.currentness, instructionEvidence,
      };
    }
    if (document.currentness.status !== "verified") {
      return {
        chargeId: entry.id, citation: entry.citation, section, sections, catalogTitle: title,
        mappingClass: "unresolved", score: document.currentness.status === "stale" ? 30 : 40,
        reasonCode: document.currentness.status === "stale"
          ? "currentness_evidence_stale"
          : "currentness_evidence_missing",
        reason: document.currentness.status === "stale"
          ? `Section ${section} has dated source evidence from ${document.currentness.editionYear}, which is too old for the current verification run.`
          : `Section ${section} was retrieved, but no dated currentness marker was found.`,
        sourceHash: document.sourceHash, sourceUrl: document.sourceUrl,
        officialTitle: document.title, currentness: document.currentness, instructionEvidence,
      };
    }

    const mappingClass: MappingClass = sections.length > 1
      ? "compound_shared"
      : overlapRatio >= 0.75
      ? "exact"
      : overlapRatio > 0
        ? "likely_alias"
        : shared ? "compound_shared" : "unresolved";
    const reasonCode = mappingClass === "exact"
      ? "official_section_and_title_match"
      : mappingClass === "likely_alias"
        ? "official_section_match_likely_alias"
        : mappingClass === "compound_shared"
          ? "shared_official_section_multiple_catalog_labels"
          : "official_title_mismatch";
    return {
      chargeId: entry.id, citation: entry.citation, section, sections, catalogTitle: title,
      mappingClass, score: mappingClass === "exact" ? 100 : mappingClass === "compound_shared" ? 85 : mappingClass === "likely_alias" ? 70 : 45,
      reasonCode,
      reason: mappingClass === "compound_shared"
        ? sections.length > 1
          ? `The citation contains multiple official sections (${sections.join(", ")}).`
          : `Section ${section} is shared by multiple catalog labels and requires compound-citation review.`
        : mappingClass === "exact"
          ? `Section ${section} and its official title support the catalog mapping.`
          : mappingClass === "likely_alias"
            ? `Section ${section} exists officially; the catalog label is a likely alias of "${document.title}".`
            : `Section ${section} exists, but "${title}" does not match official title "${document.title}".`,
      sourceHash: document.sourceHash, sourceUrl: document.sourceUrl,
      officialTitle: document.title, currentness: document.currentness, instructionEvidence,
    };
  });

  const unresolved = mappings
    .filter((mapping) => mapping.mappingClass === "unresolved")
    .map(({ chargeId, reasonCode, reason }) => ({ chargeId, reasonCode, reason }));
  return {
    schemaVersion: 1,
    state,
    generatedAt: generatedAt.toISOString(),
    officialSource: ADAPTER_INFO[state],
    sourceDocuments: [...documents.values()].map((document) => ({
      section: document.section,
      sourceUrl: document.sourceUrl,
      sourceHash: document.sourceHash,
      retrievedAt: document.retrievedAt,
      sourceTransport: document.sourceTransport,
      currentness: document.currentness,
    })).sort((a, b) => a.section.localeCompare(b.section)),
    mappings,
    unresolved,
    summary: {
      totalCatalogEntries: mappings.length,
      exactMappings: mappings.filter((mapping) => mapping.mappingClass === "exact").length,
      likelyAliases: mappings.filter((mapping) => mapping.mappingClass === "likely_alias").length,
      compoundOrSharedCitations: mappings.filter((mapping) => mapping.mappingClass === "compound_shared").length,
      unresolved: unresolved.length,
      currentnessVerifiedDocuments: [...documents.values()]
        .filter((document) => document.currentness.status === "verified").length,
    },
  };
}

export function loadOfficialFixture(state: OfficialCodeState, fixtureDir: string): Map<string, OfficialCodeDocument> {
  const fixturePath = path.join(fixtureDir, `${state.toLowerCase()}-official-code.json`);
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as OfficialCodeFixture;
  if (fixture.state !== state) throw new Error(`Fixture ${fixturePath} declares ${fixture.state}, expected ${state}`);
  const documents = new Map<string, OfficialCodeDocument>();
  for (const source of fixture.sources) {
    const document = parseOfficialDocument(
      state,
      source.html,
      source.section,
      source.sourceUrl,
      "fixture",
      new Date("2026-09-15T00:00:00.000Z"),
      undefined,
    );
    if (source.sourceHash && source.sourceHash !== document.sourceHash) {
      throw new Error(`Fixture hash mismatch for ${state} § ${source.section}`);
    }
    documents.set(source.section, document);
  }
  return documents;
}

export async function fetchOfficialDocuments(
  state: OfficialCodeState,
  sections: string[],
  options: {
    cacheDir?: string;
    fixtureDir?: string;
    fetchImpl?: typeof fetch;
    cacheMaxAgeMs?: number;
  } = {},
): Promise<{ documents: Map<string, OfficialCodeDocument>; errors: Record<string, string> }> {
  if (options.fixtureDir) {
    return { documents: loadOfficialFixture(state, options.fixtureDir), errors: {} };
  }
  const documents = new Map<string, OfficialCodeDocument>();
  const errors: Record<string, string> = {};
  const fetchImpl = options.fetchImpl ?? fetch;
  const cacheMaxAgeMs = options.cacheMaxAgeMs ?? 7 * 24 * 60 * 60 * 1000;
  for (const section of [...new Set(sections)].sort()) {
    const sourceUrl = officialSourceUrl(state, section);
    const cachePath = options.cacheDir ? path.join(options.cacheDir, `${state.toLowerCase()}-${section.replace(/[^a-z0-9]+/gi, "_")}.json`) : null;
    try {
      let html: string | null = null;
      let retrievedAt: Date | undefined;
      if (cachePath && fs.existsSync(cachePath)) {
        const cached = JSON.parse(fs.readFileSync(cachePath, "utf8")) as {
          cacheSchemaVersion?: number;
          html?: string;
          retrievedAt?: string;
        };
        const cacheDate = cached.retrievedAt ? new Date(cached.retrievedAt) : null;
        if (cached.cacheSchemaVersion === 1 && cached.html && cacheDate && !Number.isNaN(cacheDate.getTime()) &&
          Date.now() - cacheDate.getTime() <= cacheMaxAgeMs) {
          html = cached.html;
          retrievedAt = cacheDate;
        }
      }
      if (!html) {
        const response = await fetchImpl(sourceUrl, {
          signal: AbortSignal.timeout(30000),
          headers: { "User-Agent": "OpenDefender official-code verifier", Accept: "text/html, */*" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        html = await response.text();
        retrievedAt = new Date();
        if (cachePath) {
          fs.mkdirSync(path.dirname(cachePath), { recursive: true });
          fs.writeFileSync(cachePath, JSON.stringify({
            cacheSchemaVersion: 1,
            state,
            section,
            sourceUrl,
            retrievedAt: retrievedAt.toISOString(),
            html,
          }, null, 2));
        }
      }
      documents.set(section, parseOfficialDocument(
        state,
        html,
        section,
        sourceUrl,
        "https-tls-verified",
        retrievedAt,
      ));
    } catch (error) {
      errors[section] = error instanceof Error ? error.message : String(error);
    }
  }
  return { documents, errors };
}