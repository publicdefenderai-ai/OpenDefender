import type { CriminalCharge } from "./criminal-charges";
import type { ChargeExplanation } from "./charge-explanations";
import type { ChargeTranslationEntry } from "./charge-explanations-translations";

type LocalizedExplanation = { plainSummary: string; degreeContext: string };

/** A projection format, not an approval mechanism. Source review remains server-side. */
export interface EvidenceBackedChargeDefinition {
  id: string;
  jurisdiction: string;
  code: string;
  slug: string;
  name: string;
  category: CriminalCharge["category"];
  verifiedMonth: string;
  citations: Array<{ citation: string; url: string }>;
  text: Record<"en" | "es" | "zh", LocalizedExplanation>;
}

/** Shared across jurisdictions; legal rules and source adapters stay jurisdiction-specific. */
export function projectEvidenceBackedChargeBatch(rows: readonly EvidenceBackedChargeDefinition[]) {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const translations: Record<string, ChargeTranslationEntry> = {};
  const charges: CriminalCharge[] = [];
  const explanations: ChargeExplanation[] = [];
  for (const row of rows) {
    if (ids.has(row.id) || slugs.has(row.slug) || !row.id.trim() || !row.name.trim() ||
        !row.code.trim() || !row.slug.trim() || !row.jurisdiction.trim() ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(row.verifiedMonth) ||
        !row.citations.length ||
        row.citations.some(source => !source.citation.trim() || !source.url.startsWith("https://")) ||
        ["en", "es", "zh"].some(language => {
          const text = row.text[language as keyof typeof row.text];
          return !text?.plainSummary.trim() || !text?.degreeContext.trim();
        })) {
      throw new Error(`Incomplete or duplicate evidence-backed charge: ${row.id}`);
    }
    ids.add(row.id);
    slugs.add(row.slug);
    charges.push({
      id: row.id, jurisdiction: row.jurisdiction, code: row.code, name: row.name,
      // Keep the statutory name available for matching charging paperwork.
      nameEs: row.name, category: row.category,
      description: row.text.en.plainSummary, descriptionEs: row.text.es.plainSummary,
      maxPenalty: row.text.en.degreeContext,
      commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
      statuteCitations: [row.citations[0].citation],
      sourceUrls: [row.citations[0].url], dataConfidence: "high",
      lastVerified: row.verifiedMonth,
    });
    explanations.push({
      jurisdiction: row.jurisdiction, slug: row.slug,
      chargePattern: new RegExp(`^${row.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      ...row.text.en, keyTerms: [], pendingAttorneyReview: true,
      sources: row.citations.map(source => ({ jurisdiction: row.jurisdiction, ...source })),
    });
    translations[row.slug] = {
      es: { ...row.text.es, keyTerms: [], draft: true },
      zh: { ...row.text.zh, keyTerms: [], draft: true },
    };
  }
  return { charges, explanations, translations };
}