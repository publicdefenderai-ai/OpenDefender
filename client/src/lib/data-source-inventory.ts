import { DATA_SOURCE_FACTS, SOURCE_EVIDENCE } from "@shared/data-source-facts";

export { DATA_SOURCE_FACTS, SOURCE_EVIDENCE };
export type { SourceEvidence, SourceTypeKey } from "@shared/data-source-facts";

export type SourceConfidence =
  | "primary"
  | "secondary"
  | "synthesized"
  | "availability"
  | "conditional"
  | "mixed";

export const DATA_SOURCE_LINKS = {
  federalStatutes: "https://www.law.cornell.edu/uscode/text",
  charges: "https://www.ali.org/publications/show/model-penal-code/",
  explanations: "https://www.uscourts.gov/glossary",
  procedure: "https://www.uscourts.gov/rules-policies/current-rules-practice-procedure",
  collateral: "https://ccresourcecenter.org/",
  rights: "https://constitution.congress.gov/",
  expungement: "https://cleanslateclearinghouse.org/",
  diversion: "https://www.nadcp.org/find-a-drug-court/",
  legalAid: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers",
  glossary: "https://www.uscourts.gov/glossary",
  courtServices: "https://www.uscourts.gov/federal-court-finder",
  statuteLinks: "https://docs.openlaws.us/",
  detention: "https://www.ice.gov/detain/detention-facilities",
  consulates: "https://travel.state.gov/content/travel/en/consularnotification.html",
  publicResources: "https://www.211.org/",
  juryInstructions: "https://www.courts.ca.gov/partners/california-jury-instructions",
  validation: "https://www.courtlistener.com/api/rest/v4/",
  statistics: "https://www.ussc.gov/research/sourcebook",
  ai: "https://www.anthropic.com/legal/privacy",
} as const;

export const DATA_SOURCE_IDS = [
  "federalStatutes",
  "charges",
  "explanations",
  "procedure",
  "collateral",
  "rights",
  "expungement",
  "diversion",
  "legalAid",
  "glossary",
  "courtServices",
  "statuteLinks",
  "detention",
  "consulates",
  "publicResources",
  "juryInstructions",
  "validation",
  "statistics",
  "ai",
] as const;

export type DataSourceId = (typeof DATA_SOURCE_IDS)[number];

export const DATA_SOURCE_CONFIDENCE: Record<DataSourceId, SourceConfidence> = {
  federalStatutes: "primary",
  charges: "synthesized",
  explanations: "mixed",
  procedure: "mixed",
  collateral: "mixed",
  rights: "synthesized",
  expungement: "mixed",
  diversion: "secondary",
  legalAid: "availability",
  glossary: "synthesized",
  courtServices: "availability",
  statuteLinks: "availability",
  detention: "availability",
  consulates: "availability",
  publicResources: "availability",
  juryInstructions: "mixed",
  validation: "conditional",
  statistics: "secondary",
  ai: "conditional",
};