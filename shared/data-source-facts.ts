/**
 * Public aggregate facts used by the data-sources transparency page.
 *
 * Keep this module intentionally small: it is bundled for the public page.
 * The inventory test compares these values with the authoritative datasets.
 */
export const DATA_SOURCE_FACTS = {
  federalStatutes: 10,
  charges: 7155,
  chargeTiers: { felony: 3772, misdemeanor: 3322, infraction: 61 },
  chargeJurisdictions: 57,
  chargeExplanations: 60,
  chargeExplanationsWithSources: 49,
  chargeExplanationOverlays: 2818,
  procedureJurisdictions: 57,
  procedureHighConfidence: 52,
  procedureMediumConfidence: 5,
  preliminaryEstimateJurisdictions: 20,
  discoveryEstimateJurisdictions: 16,
  collateralJurisdictions: 51,
  driversLicenseJurisdictions: 51,
  immigrationJurisdictions: 51,
  sexOffenderJurisdictions: 51,
  expungementJurisdictions: 52,
  diversionPrograms: 111,
  activeDiversionPrograms: 110,
  diversionJurisdictions: 52,
  glossaryTerms: 50,
  courtServices: 52,
  statuteLinkJurisdictions: 52,
  legalAidOrganizations: 198,
  legalAidJurisdictions: 55,
  detentionFacilities: 29,
  detentionStates: 13,
  consulates: 20,
} as const;

export type SourceTypeKey =
  | "primaryLegalText"
  | "secondaryResearch"
  | "synthesizedResearch"
  | "publicDirectory"
  | "externalProvider"
  | "mixedResearch";

export interface SourceEvidence {
  sourceType: SourceTypeKey;
  sources: string[];
  citations: string[];
}

// Named sources and citation formats are kept outside the client page layout
// so every topic shows an actual evidence path instead of a generic homepage.
export const SOURCE_EVIDENCE: Record<string, SourceEvidence> = {
  federalStatutes: {
    sourceType: "primaryLegalText",
    sources: ["Cornell Legal Information Institute (LII)"],
    citations: ["18 U.S.C. §§ 111, 371, 641, 1001, 1028, 1341, 1343, 1956, 2113; 21 U.S.C. § 841"],
  },
  charges: {
    sourceType: "mixedResearch",
    sources: ["Model Penal Code (ALI)", "Individual state codes for verified entries", "FBI UCR", "OpenLaws API fallback"],
    citations: ["MPC §§ 2.06, 2.07, 5.01–5.03", "State citations are record-specific; generated codes are not authoritative"],
  },
  explanations: {
    sourceType: "mixedResearch",
    sources: ["State legislature and government websites", "NCSL", "Clean Slate Initiative", "National Reentry Resource Center"],
    citations: ["Per-entry source citations where present; 49 of 60 base explanations have a recorded source"],
  },
  procedure: {
    sourceType: "mixedResearch",
    sources: ["State statutes and court rules", "Federal Rules of Criminal Procedure", "NCSC comparative references"],
    citations: ["Fed. R. Crim. P. 5, 10", "18 U.S.C. § 3161", "State citations are record-specific"],
  },
  collateral: {
    sourceType: "mixedResearch",
    sources: ["State statutes and agency rules", "Collateral Consequences Resource Center", "NCSL comparative research"],
    citations: ["Per-record state citations and update dates; consequence-specific coverage varies"],
  },
  rights: {
    sourceType: "synthesizedResearch",
    sources: ["U.S. Constitution", "Congress.gov Constitution Annotated", "U.S. Supreme Court doctrine"],
    citations: ["U.S. Const. amends. I, IV, V, VI, XIV", "Gideon v. Wainwright, 372 U.S. 335 (1963)", "Miranda v. Arizona, 384 U.S. 436 (1966)"],
  },
  expungement: {
    sourceType: "mixedResearch",
    sources: ["State legislature and court websites", "NCSL", "Clean Slate Initiative", "National Reentry Resource Center"],
    citations: ["Per-entry state citations; examples include Cal. Penal Code § 1203.4 and Tex. Code Crim. Proc. ch. 55"],
  },
  diversion: {
    sourceType: "secondaryResearch",
    sources: ["NADCP Find-a-Drug-Court", "NDAA Diversion Directory", "National TASC", "Court and prosecutor websites"],
    citations: ["Per-program source URLs; no universal eligibility citation"],
  },
  legalAid: {
    sourceType: "publicDirectory",
    sources: ["EOIR Pro Bono List", "LSC Grantee Directory", "Public defender and Federal Defender offices"],
    citations: ["Per-organization directory records; directory inclusion is not a referral or acceptance decision"],
  },
  glossary: {
    sourceType: "synthesizedResearch",
    sources: ["U.S. Courts Glossary", "Public legal references and term-specific sources"],
    citations: ["Per-term source links where provided"],
  },
  courtServices: {
    sourceType: "publicDirectory",
    sources: ["State judiciary websites", "U.S. Courts Federal Court Finder"],
    citations: ["Per-entry court website and locator URLs; local rules are not reproduced"],
  },
  statuteLinks: {
    sourceType: "publicDirectory",
    sources: ["State legislature and judiciary websites", "OpenLaws documentation"],
    citations: ["Per-jurisdiction URL configuration; a responding URL is not substantive verification"],
  },
  detention: {
    sourceType: "publicDirectory",
    sources: ["ICE public facility information", "FOIA-related public research"],
    citations: ["Per-facility contact records; availability must be confirmed with ICE or the facility"],
  },
  consulates: {
    sourceType: "publicDirectory",
    sources: ["U.S. Department of State consular notification guidance", "Country foreign-ministry websites"],
    citations: ["Per-country website and contact record"],
  },
  publicResources: {
    sourceType: "publicDirectory",
    sources: ["211.org", "HUD", "SAMHSA / 988", "EEOC", "American Bar Association", "ACLU"],
    citations: ["External resource directory records; link checks do not verify services or eligibility"],
  },
  juryInstructions: {
    sourceType: "mixedResearch",
    sources: ["State court instruction publishers", "Federal jury-instruction references"],
    citations: ["CALCRIM, NYPJI, FPJI, CTJI, TX CPJC, PA SSJI, OH OJI, IL IPI-Crim; some series are paywalled"],
  },
  validation: {
    sourceType: "externalProvider",
    sources: ["CourtListener / RECAP", "OpenLaws", "LOCUS-v1 / LocalLaws (UC Berkeley)"],
    citations: ["LOCUS-v1, Peskoff et al. (2026), arXiv:2606.19334; LOCUS is supplementary for local ordinances"],
  },
  statistics: {
    sourceType: "secondaryResearch",
    sources: ["U.S. Sentencing Commission Sourcebook", "Bureau of Justice Statistics (BJS)"],
    citations: ["FY 2024 Sourcebook of Federal Sentencing Statistics", "Felony Defendants in Large Urban Counties (2009)", "Pretrial Detention and Misconduct in Federal District Courts, 1995–2010"],
  },
  ai: {
    sourceType: "externalProvider",
    sources: ["Anthropic Claude Sonnet 4 (claude-sonnet-4-6) API", "OpenDefender Privacy Policy"],
    citations: ["Anthropic commercial API terms and privacy documentation; product-specific retention and redaction disclosures apply"],
  },
};