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
  /** Reviewed display names. English identity remains in `name`. */
  names?: { es: string; zh: string };
  /** Reviewed aliases used for search; full official headings belong here when display names are shortened. */
  aliases?: { en: string[]; es: string[]; zh: string[] };
  category: CriminalCharge["category"];
  categories?: CriminalCharge["category"][];
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
        (row.names !== undefined && (!row.names.es.trim() || !row.names.zh.trim())) ||
        (row.aliases !== undefined && ["en", "es", "zh"].some(language =>
          !row.aliases![language as keyof typeof row.aliases].length ||
          row.aliases![language as keyof typeof row.aliases].some(alias => !alias.trim()))) ||
        (row.categories !== undefined &&
          (!row.categories.includes(row.category) || new Set(row.categories).size !== row.categories.length ||
            row.categories.some(category => !["felony", "misdemeanor", "infraction"].includes(category)))) ||
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
      nameEs: row.names?.es ?? row.name, nameZh: row.names?.zh ?? row.name,
      ...(row.aliases ? { searchAliases: [
        ...row.aliases.en, ...row.aliases.es, ...row.aliases.zh,
      ] } : {}),
      category: row.category,
      ...(row.categories ? { categories: [...row.categories] } : {}),
      description: row.text.en.plainSummary, descriptionEs: row.text.es.plainSummary,
      descriptionZh: row.text.zh.plainSummary,
      maxPenalty: row.text.en.degreeContext,
      maxPenaltyEs: row.text.es.degreeContext,
      maxPenaltyZh: row.text.zh.degreeContext,
      commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
      statuteCitations: [row.citations[0].citation],
      sourceUrls: [row.citations[0].url], dataConfidence: "high",
      lastVerified: row.verifiedMonth,
    });
    explanations.push({
      jurisdiction: row.jurisdiction, canonicalChargeId: row.id, slug: row.slug,
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