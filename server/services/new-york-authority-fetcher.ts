import {
  getNewYorkSourceReferences,
  manifestRecordFromDocuments,
  type NewYorkApiDocument,
  type NewYorkAuthorityManifest,
} from "../data/new-york-source-database-seed";
import { criminalCharges } from "@shared/criminal-charges";

const API_BASE = "https://legislation.nysenate.gov/api/3";
const RATE_LIMIT_MS = 550;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDocument(
  lawId: string,
  section: string,
  apiKey: string,
  retrievedAt: Date,
): Promise<NewYorkApiDocument | null> {
  const endpoint = `${API_BASE}/laws/${lawId}/${section}?key=${apiKey}`;
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(12_000) });
    if (!response.ok) return null;
    const payload = await response.json() as {
      success?: boolean;
      result?: {
        lawId?: string;
        lawName?: string;
        title?: string;
        docLevelId?: string;
        activeDate?: string;
        publishedDates?: string[];
        text?: string;
      };
    };
    const result = payload.result;
    if (
      !payload.success ||
      !result?.title?.trim() ||
      !result.text ||
      result.lawId !== lawId ||
      result.docLevelId !== section
    ) return null;
    return {
      lawId: result.lawId ?? lawId,
      section: result.docLevelId ?? section,
      title: result.title.trim(),
      lawName: result.lawName ?? null,
      text: result.text,
      activeDate: result.activeDate ?? null,
      publishedDates: result.publishedDates ?? [],
      sourceUrl: `https://www.nysenate.gov/legislation/laws/${lawId}/${section}`,
      retrievedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches every current NY catalog row from the official structured API.
 * A null document is retained in its provision position so compound statutes
 * cannot silently bind a grading provision to the wrong source section.
 */
export async function fetchNewYorkAuthorityManifest(
  retrievedAt: Date = new Date(),
): Promise<NewYorkAuthorityManifest> {
  const apiKey = process.env.NY_SENATE_API_KEY ?? "";
  if (!apiKey) throw new Error("NY_SENATE_API_KEY is not set");

  const records = [];
  const nyCharges = criminalCharges.filter((charge) => charge.jurisdiction === "NY");
  let requestCount = 0;
  for (const charge of nyCharges) {
    const references = getNewYorkSourceReferences(charge);
    if (references.length === 0) {
      records.push(manifestRecordFromDocuments(charge, [], retrievedAt));
      continue;
    }

    const documents: Array<NewYorkApiDocument | null> = [];
    for (const reference of references) {
      if (reference.local) {
        documents.push(null);
      } else {
        if (requestCount > 0) await sleep(RATE_LIMIT_MS);
        requestCount++;
        documents.push(await fetchDocument(reference.lawId, reference.section, apiKey, retrievedAt));
      }
    }
    records.push(manifestRecordFromDocuments(charge, documents, retrievedAt));
  }

  return {
    jurisdiction: "NY",
    generatedAt: retrievedAt,
    source: "NY Open Legislation API (legislation.nysenate.gov)",
    catalogRecords: records,
  };
}