/**
 * Motion for Withholding of Removal / CAT Protection — EOIR Immigration Court Template
 *
 * Requests withholding of removal under INA § 241(b)(3) and/or protection under
 * the Convention Against Torture (CAT), implemented at 8 C.F.R. §§ 1208.16-1208.18.
 *
 * Available to respondents who cannot qualify for asylum (e.g., due to the one-year
 * filing bar, a particularly serious crime bar, or a prior removal order) but who face
 * persecution or torture in their home country.
 *
 * Unlike asylum, withholding has no filing deadline and cannot be denied as a matter
 * of discretion. The standard for withholding is a "clear probability" (more likely
 * than not) of persecution — higher than asylum's "well-founded fear" standard.
 *
 * Governing law:
 *   - INA § 241(b)(3): Withholding of removal
 *   - 8 C.F.R. §§ 1208.16–1208.18: CAT regulations
 *   - INS v. Stevic, 467 U.S. 407 (1984): Clear-probability standard
 *   - Matter of C-A-, 23 I&N Dec. 951 (BIA 2006): Nexus to protected ground
 *   - Regulations implementing the United Nations Convention Against Torture (CAT)
 *
 * Nationally uniform — no jurisdiction variants needed for EOIR.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

// ──────────────────────────────────────────────────────────────────────────────
// Local option sets
// ──────────────────────────────────────────────────────────────────────────────

const PROTECTED_GROUNDS = [
  { value: "race", label: "Race" },
  { value: "religion", label: "Religion" },
  { value: "nationality", label: "Nationality" },
  { value: "psg", label: "Membership in a Particular Social Group (PSG)" },
  { value: "political_opinion", label: "Political Opinion" },
  { value: "imputed_political_opinion", label: "Imputed Political Opinion" },
  { value: "multiple", label: "Multiple / Combined Grounds" },
];

const PAST_PERSECUTION_OPTIONS = [
  { value: "yes", label: "Yes — Respondent suffered past persecution" },
  { value: "no", label: "No — Fear is prospective only" },
];

const GOVT_PROTECTION_OPTIONS = [
  { value: "unable", label: "Government is unable to protect (lacks capacity)" },
  { value: "unwilling", label: "Government is unwilling to protect (acquiescence or complicity)" },
  { value: "both", label: "Both unable and unwilling" },
  { value: "government_is_persecutor", label: "Government itself is the persecutor" },
];

const CAT_CLAIM_OPTIONS = [
  { value: "yes", label: "Yes — Also asserting CAT claim" },
  { value: "no", label: "No — Withholding only" },
];

const CRIMINAL_CONVICTION_OPTIONS = [
  { value: "none", label: "No criminal convictions" },
  { value: "minor_offense", label: "Minor offense (not an aggravated felony or PSC bar)" },
  { value: "possible_psc", label: "Conviction — may implicate 'particularly serious crime' bar" },
  { value: "psc_disputed", label: "Conviction — PSC characterization disputed" },
  { value: "aggravated_felony", label: "Aggravated felony conviction (PSC bar presumed)" },
];

const COUNTRY_OF_REMOVAL_LIST = [
  { value: "mexico", label: "Mexico" },
  { value: "el_salvador", label: "El Salvador" },
  { value: "guatemala", label: "Guatemala" },
  { value: "honduras", label: "Honduras" },
  { value: "haiti", label: "Haiti" },
  { value: "venezuela", label: "Venezuela" },
  { value: "cuba", label: "Cuba" },
  { value: "nicaragua", label: "Nicaragua" },
  { value: "ecuador", label: "Ecuador" },
  { value: "colombia", label: "Colombia" },
  { value: "china", label: "China (People's Republic)" },
  { value: "india", label: "India" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "eritrea", label: "Eritrea" },
  { value: "cameroon", label: "Cameroon" },
  { value: "nigeria", label: "Nigeria" },
  { value: "drc", label: "Democratic Republic of the Congo" },
  { value: "other", label: "Other (specify in 'Country of Origin' field)" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Template definition
// ──────────────────────────────────────────────────────────────────────────────

export const motionForWithholdingRemovalCatTemplate: DocumentTemplate = {
  id: "motion-for-withholding-removal-cat",
  name: "Motion for Withholding of Removal / CAT Protection",
  category: "immigration",
  description:
    "Requests withholding of removal under INA § 241(b)(3) and/or protection under the Convention Against Torture (CAT). Available to respondents who cannot qualify for asylum (e.g., due to the one-year filing bar, a particularly serious crime bar, or a prior removal order) but face persecution or torture in their home country. Unlike asylum, withholding has no filing deadline and cannot be denied as a matter of discretion.",
  version: "1.0.0",
  lastUpdated: new Date("2026-03-10"),
  estimatedCompletionTime: "35-50 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    // ──────────────────────────────────────────────────────────────────────────
    // Section 1: Case Caption
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 1,
      required: true,
      helpText: "Enter the immigration court and case information for the caption.",
      inputs: [
        {
          id: "immigrationCourt",
          label: "Immigration Court",
          type: "select",
          required: true,
          helpText: "Select the EOIR immigration court where the case is pending.",
          validation: {
            options: IMMIGRATION_COURTS,
          },
        },
        {
          id: "immigrationCourtOther",
          label: "Other Immigration Court Name",
          type: "text",
          required: false,
          placeholder: "Enter court name if not listed above",
          helpText: "Specify the court name if you selected 'Other'.",
        },
        {
          id: "respondentName",
          label: "Respondent Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name of respondent",
          helpText: "The individual in removal proceedings (not 'Defendant').",
        },
        {
          id: "aNumber",
          label: "A-Number",
          type: "a-number",
          required: true,
          placeholder: "XXX-XXX-XXX",
          helpText: "The respondent's Alien Registration Number assigned by DHS.",
          validation: {
            pattern: "^\\d{3}-?\\d{3}-?\\d{3}$",
          },
        },
        {
          id: "countryOfOrigin",
          label: "Respondent's Country of Origin",
          type: "text",
          required: true,
          placeholder: "e.g., El Salvador",
          helpText: "The country where the respondent was born or holds citizenship.",
        },
        {
          id: "countryOfProposedRemoval",
          label: "Country of Proposed Removal",
          type: "select",
          required: true,
          helpText: "The country to which DHS seeks to remove the respondent.",
          validation: {
            options: COUNTRY_OF_REMOVAL_LIST,
          },
        },
        {
          id: "proceedingType",
          label: "Proceeding Type",
          type: "select",
          required: true,
          helpText: "Type of immigration proceeding.",
          validation: {
            options: PROCEEDING_TYPES,
          },
        },
        {
          id: "judgeName",
          label: "Immigration Judge",
          type: "text",
          required: true,
          placeholder: "Honorable [First Last]",
          helpText: "Full name of the presiding Immigration Judge.",
        },
        {
          id: "hearingDate",
          label: "Merits Hearing Date",
          type: "date",
          required: false,
          helpText: "Scheduled merits/individual hearing date, if set.",
        },
        {
          id: "dhsAttorneyName",
          label: "DHS/ICE Trial Attorney",
          type: "text",
          required: false,
          placeholder: "DHS Trial Attorney name",
          helpText: "Name of the DHS/ICE Trial Attorney assigned to the case.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 2: Withholding Claim — Basis and Facts
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "withholdingClaim",
      name: "Withholding of Removal Claim",
      type: "user-input",
      order: 2,
      required: true,
      helpText:
        "Provide the factual and legal basis for the withholding of removal claim under INA § 241(b)(3).",
      inputs: [
        {
          id: "protectedGround",
          label: "Basis for Withholding Claim (Protected Ground)",
          type: "select",
          required: true,
          helpText:
            "The protected ground(s) to which the feared persecution is connected. Select the primary ground; describe additional grounds in the narrative.",
          validation: {
            options: PROTECTED_GROUNDS,
          },
        },
        {
          id: "fearedHarmDescription",
          label: "Description of Feared Harm",
          type: "textarea",
          required: true,
          placeholder:
            "Describe the specific harm the respondent fears if returned to the country of proposed removal. Include who would harm the respondent, what the harm would be, and why...",
          helpText:
            "Describe the nature of the feared persecution, the persecutors, and the nexus to the claimed protected ground. Be specific and detailed.",
          validation: {
            minLength: 100,
            maxLength: 5000,
          },
        },
        {
          id: "pastPersecution",
          label: "Past Persecution",
          type: "select",
          required: true,
          helpText:
            "Has the respondent already suffered persecution in the country of proposed removal? Past persecution creates a rebuttable presumption of future persecution.",
          validation: {
            options: PAST_PERSECUTION_OPTIONS,
          },
        },
        {
          id: "pastPersecutionDescription",
          label: "Description of Past Persecution",
          type: "textarea",
          required: false,
          placeholder:
            "If the respondent suffered past persecution, describe the incidents, dates, actors, and injuries sustained...",
          helpText:
            "Describe in detail the past persecution suffered: who inflicted it, when it occurred, the nature of the harm, and its connection to the protected ground. Leave blank if no past persecution.",
          validation: {
            maxLength: 5000,
          },
        },
        {
          id: "govtProtectionStatus",
          label: "Government Protection",
          type: "select",
          required: true,
          helpText:
            "Whether the government of the country of removal is unable or unwilling to protect the respondent.",
          validation: {
            options: GOVT_PROTECTION_OPTIONS,
          },
        },
        {
          id: "govtProtectionExplanation",
          label: "Explanation of Government Inability / Unwillingness to Protect",
          type: "textarea",
          required: true,
          placeholder:
            "Explain why the government cannot or will not protect the respondent. Include any reports made to authorities and their response, evidence of corruption, gang impunity, etc...",
          helpText:
            "Describe evidence that the government is unable or unwilling to protect: failed police reports, official complicity, corruption, documented gang or cartel impunity, or the government itself as persecutor.",
          validation: {
            minLength: 50,
            maxLength: 4000,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 3: CAT Claim (Optional)
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "catClaim",
      name: "Convention Against Torture (CAT) Claim",
      type: "user-input",
      order: 3,
      required: true,
      helpText:
        "Indicate whether the respondent is also asserting a claim under the Convention Against Torture. CAT protection is available regardless of protected ground and does not require a nexus to race, religion, nationality, PSG, or political opinion — only that torture would occur with government acquiescence.",
      inputs: [
        {
          id: "catClaim",
          label: "CAT Claim",
          type: "select",
          required: true,
          helpText:
            "Is the respondent asserting that he/she would be tortured by or with the acquiescence of the government if returned?",
          validation: {
            options: CAT_CLAIM_OPTIONS,
          },
        },
        {
          id: "catTortureDescription",
          label: "Nature of Feared Torture (CAT)",
          type: "textarea",
          required: false,
          placeholder:
            "Describe the specific acts of torture feared, the government officials or entities who would inflict or acquiesce in the torture, and any supporting evidence...",
          helpText:
            "Describe the feared torture under the CAT definition (severe pain or suffering inflicted by or with acquiescence of public officials). Include the actors, nature of the harm, and why government acquiescence is established. Leave blank if no CAT claim.",
          validation: {
            maxLength: 5000,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 4: Eligibility Bars and Criminal History
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "eligibilityBars",
      name: "Eligibility Bars and Criminal History",
      type: "user-input",
      order: 4,
      required: true,
      helpText:
        "Withholding of removal is barred if the respondent has been convicted of a 'particularly serious crime' (PSC) — generally an aggravated felony with a five-year sentence, or a non-aggravated-felony offense that is nonetheless particularly serious. CAT deferral of removal remains available even if withholding is barred.",
      inputs: [
        {
          id: "criminalConviction",
          label: "Criminal Conviction Status",
          type: "select",
          required: true,
          helpText:
            "Indicate the respondent's criminal history and its potential impact on withholding eligibility.",
          validation: {
            options: CRIMINAL_CONVICTION_OPTIONS,
          },
        },
        {
          id: "criminalConvictionDetails",
          label: "Criminal Conviction Details",
          type: "textarea",
          required: false,
          placeholder:
            "If any conviction, provide the offense, jurisdiction, sentence imposed, and why the PSC bar does not apply or is not triggered...",
          helpText:
            "Describe the offense(s), sentence(s), and argument why the conviction does not constitute a 'particularly serious crime' barring withholding. Address Matter of N-A-M-, 24 I&N Dec. 336 (BIA 2007) factors if applicable. Leave blank if no convictions.",
          validation: {
            maxLength: 3000,
          },
        },
        {
          id: "reasonWhyAsylumUnavailable",
          label: "Why Asylum Is Not Available (if applicable)",
          type: "textarea",
          required: false,
          placeholder:
            "If the respondent is ineligible for asylum, briefly state why (e.g., one-year bar, prior removal order, PSC bar, security bar, etc.)...",
          helpText:
            "Briefly explain the basis for seeking withholding/CAT rather than — or in addition to — asylum. This contextualizes the motion for the court.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 5: Country Conditions and Supporting Evidence
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "countryConditions",
      name: "Country Conditions and Supporting Evidence",
      type: "user-input",
      order: 5,
      required: true,
      helpText:
        "Describe the country conditions that corroborate the respondent's fear. Reference country condition reports, news articles, expert opinions, or other objective evidence.",
      inputs: [
        {
          id: "countryConditionsNarrative",
          label: "Country Conditions Narrative",
          type: "textarea",
          required: true,
          placeholder:
            "Describe the current country conditions in the country of proposed removal that corroborate the respondent's fear. Reference U.S. State Department Country Reports on Human Rights Practices, UNHCR guidance, human rights organization reports, and/or news sources...",
          helpText:
            "Summarize country conditions evidence that supports the respondent's claim. Cite authoritative sources. This section will be incorporated into the AI-generated legal argument.",
          validation: {
            minLength: 50,
            maxLength: 5000,
          },
        },
        {
          id: "supportingDocuments",
          label: "Supporting Documents (list)",
          type: "textarea",
          required: false,
          placeholder:
            "List supporting documents to be submitted as exhibits, e.g., Exhibit 1 — Respondent's Declaration; Exhibit 2 — State Department Country Report; Exhibit 3 — UNHCR Guidelines; Exhibit 4 — Medical Records...",
          helpText:
            "List the documentary evidence to be submitted in support of the motion. Proper exhibit labeling will be incorporated into the argument.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 6: Statement of Facts (AI-generated)
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "statementOfFacts",
      name: "Statement of Facts",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText:
        "AI generates a detailed statement of facts based on the respondent's claim for withholding of removal and/or CAT protection.",
      aiPromptTemplate: `Generate a detailed Statement of Facts for a Motion for Withholding of Removal and/or Convention Against Torture (CAT) Protection in EOIR immigration court.

Immigration court: {{immigrationCourt}}
Country of proposed removal: {{countryOfProposedRemoval}}
Country of origin: {{countryOfOrigin}}
Protected ground: {{protectedGround}}
Description of feared harm: {{fearedHarmDescription}}
Past persecution: {{pastPersecution}}
Past persecution description: {{pastPersecutionDescription}}
Government protection status: {{govtProtectionStatus}}
Government protection explanation: {{govtProtectionExplanation}}
CAT claim: {{catClaim}}
CAT torture description: {{catTortureDescription}}
Criminal conviction status: {{criminalConviction}}
Criminal conviction details: {{criminalConvictionDetails}}
Reason asylum unavailable: {{reasonWhyAsylumUnavailable}}
Country conditions: {{countryConditionsNarrative}}
Supporting documents: {{supportingDocuments}}

Generate a formal Statement of Facts covering 4–6 paragraphs:
1. Introduction — identify the respondent, country of proposed removal, nature of proceedings, and relief sought (withholding under INA § 241(b)(3) and/or CAT protection)
2. Background — relevant personal and immigration history leading to the removal proceedings
3. Persecution / harm feared — describe the feared harm, the persecutors, and the nexus to the claimed protected ground(s) in factual terms
4. Past persecution (if applicable) — describe incidents of past persecution with relevant dates and details
5. Government inability / unwillingness to protect — factual basis for why the home country government cannot or will not protect the respondent
6. CAT claim (if applicable) — factual basis for the torture claim, including government acquiescence

Present facts objectively and favorably for the respondent. Use third-person references to the respondent.`,
      aiInstructions:
        "Draft a formal Statement of Facts for a motion for withholding of removal and/or CAT protection. Use immigration court terminology: 'Respondent' (not 'Defendant'), 'DHS' (not 'Plaintiff'), 'Immigration Judge' (not 'the Court'). Reference INA § 241(b)(3) for withholding and 8 C.F.R. §§ 1208.16–1208.18 for CAT. Structure as 4–6 paragraphs covering: (1) introduction and relief sought, (2) respondent's background, (3) feared harm and nexus to protected ground, (4) past persecution if applicable, (5) government unable/unwilling to protect, and (6) CAT claim if applicable. Present facts favorably for the respondent. Do not fabricate specific dates or details not provided.",
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 7: Legal Argument (AI-generated)
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 7,
      required: true,
      helpText:
        "AI generates a comprehensive legal argument structured around: (1) the withholding standard; (2) past persecution presumption; (3) nexus and future persecution; (4) no PSC bar; (5) CAT claim; and (6) mandatory nature of the relief.",
      aiPromptTemplate: `Generate a formal Legal Argument for a Motion for Withholding of Removal and/or Convention Against Torture (CAT) Protection in EOIR immigration court.

Immigration court: {{immigrationCourt}}
Country of proposed removal: {{countryOfProposedRemoval}}
Protected ground: {{protectedGround}}
Description of feared harm: {{fearedHarmDescription}}
Past persecution: {{pastPersecution}}
Past persecution description: {{pastPersecutionDescription}}
Government protection status: {{govtProtectionStatus}}
Government protection explanation: {{govtProtectionExplanation}}
CAT claim: {{catClaim}}
CAT torture description: {{catTortureDescription}}
Criminal conviction status: {{criminalConviction}}
Criminal conviction details: {{criminalConvictionDetails}}
Reason asylum unavailable: {{reasonWhyAsylumUnavailable}}
Country conditions: {{countryConditionsNarrative}}
Supporting documents: {{supportingDocuments}}

Generate a formal Legal Argument with the following sections:

I. STANDARD OF REVIEW
- Withholding of removal under INA § 241(b)(3) requires a "clear probability" of persecution — a "more likely than not" standard (INS v. Stevic, 467 U.S. 407 (1984))
- Unlike asylum, withholding is a mandatory form of relief that cannot be denied as a matter of discretion once the standard is met (INA § 241(b)(3))
- No filing deadline exists for withholding of removal

II. THE RESPONDENT HAS ESTABLISHED ELIGIBILITY FOR WITHHOLDING OF REMOVAL
A. Past Persecution Creates a Rebuttable Presumption of Future Persecution (if applicable)
   - Cite 8 C.F.R. § 1208.16(b)(1): past persecution triggers a rebuttable presumption of future persecution
   - Government bears burden to rebut by showing fundamental change in country conditions or that relocation was reasonable
   - Cite Matter of D-I-M-, 24 I&N Dec. 448 (BIA 2008)
B. The Respondent Faces a Clear Probability of Future Persecution
   - Apply INS v. Stevic "more likely than not" standard
   - Identify the persecutors and describe the specific harm feared
   - Address nexus to protected ground: cite Matter of C-A-, 23 I&N Dec. 951 (BIA 2006); Matter of Acosta, 19 I&N Dec. 211 (BIA 1985)
C. The Government of [country] Is Unable or Unwilling to Protect the Respondent
   - Cite country conditions evidence
   - Cite Matter of A-B-, 27 I&N Dec. 316 (A.G. 2018) and subsequent BIA guidance as applicable; address its current precedential posture
   - Cite Henriquez-Rivas v. Holder, 707 F.3d 1081 (9th Cir. 2013) or other relevant circuit precedent if applicable

III. NO STATUTORY BAR PRECLUDES WITHHOLDING (address only if criminal conviction is at issue)
   - Withholding is barred only if the respondent was convicted of a "particularly serious crime"
   - Cite INA § 241(b)(3)(B)(ii); Matter of N-A-M-, 24 I&N Dec. 336 (BIA 2007) (factors for PSC determination)
   - Argue why the conviction does not constitute a PSC if applicable
   - Even if withholding is barred, CAT deferral remains available: 8 C.F.R. § 1208.17

IV. THE RESPONDENT IS ENTITLED TO CAT PROTECTION (if CAT claim asserted)
   - Standard: "more likely than not" that the respondent would be subjected to torture (8 C.F.R. § 1208.16(c)(2))
   - Definition of torture: 8 C.F.R. § 1208.18(a)(1)
   - Government acquiescence is established: 8 C.F.R. § 1208.18(a)(7)
   - Cite relevant circuit and BIA case law on CAT
   - CAT protection is not subject to the PSC bar for withholding (cite 8 C.F.R. § 1208.17 if deferral of removal applies)

V. WITHHOLDING IS MANDATORY RELIEF
   - Once the standard is met, relief is mandatory and may not be denied as a matter of discretion
   - Contrast with asylum under INA § 208(b)(1)(A) (discretionary)
   - Cite Matter of Pula, 19 I&N Dec. 467 (BIA 1987) (asylum discretion); note withholding has no comparable discretionary bar

VI. CONCLUSION

Generate 6–9 substantive paragraphs organized under the numbered headings above. Cite all applicable INA sections, 8 C.F.R. regulations, BIA precedents, and circuit court cases. Do not fabricate citations. Use formal legal writing style appropriate for EOIR immigration court.`,
      aiInstructions:
        "Draft a formal legal argument for a motion for withholding of removal and/or CAT protection. Structure the argument under the Roman-numeral headings specified. Must cite: INA § 241(b)(3) (withholding authority); INS v. Stevic, 467 U.S. 407 (1984) (clear-probability standard); 8 C.F.R. §§ 1208.16–1208.18 (CAT regulations); Matter of Acosta, 19 I&N Dec. 211 (BIA 1985) (nexus); Matter of C-A-, 23 I&N Dec. 951 (BIA 2006) (PSG nexus); Matter of N-A-M-, 24 I&N Dec. 336 (BIA 2007) (PSC factors). Address the past-persecution presumption under 8 C.F.R. § 1208.16(b)(1) if past persecution was indicated. For CAT claims, apply the 'more likely than not' standard and government acquiescence requirement of 8 C.F.R. § 1208.18(a)(7). Explain that withholding is mandatory once the standard is met. Use formal EOIR immigration court style. Do not fabricate citations.",
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 8: Prayer for Relief (Static)
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 8,
      required: true,
      staticContent:
        "WHEREFORE, Respondent respectfully requests that this Honorable Court:\n\n" +
        "1. Find that the Respondent has established eligibility for withholding of removal under INA § 241(b)(3) and grant withholding of removal to the country of proposed removal;\n\n" +
        "2. In the alternative, find that the Respondent has established eligibility for protection under the Convention Against Torture pursuant to 8 C.F.R. §§ 1208.16–1208.18 and grant deferral of removal under 8 C.F.R. § 1208.17;\n\n" +
        "3. Find that no statutory bar — including the 'particularly serious crime' bar under INA § 241(b)(3)(B)(ii) — precludes the Respondent from receiving the requested relief;\n\n" +
        "4. Issue an order withholding the Respondent's removal to [country of proposed removal] and any other country where the Respondent faces a clear probability of persecution or torture;\n\n" +
        "5. Grant such other and further relief as this Honorable Court deems just and proper.",
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 9: Filing Information
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 9,
      required: true,
      helpText: "Specify how the motion will be filed and served.",
      inputs: [
        {
          id: "filingMethod",
          label: "Filing Method",
          type: "select",
          required: true,
          helpText:
            "ECAS e-filing is mandatory for attorneys. Paper filing may be used where ECAS is unavailable.",
          validation: {
            options: FILING_METHODS,
          },
        },
        {
          id: "dhsCounselOffice",
          label: "DHS/ICE Chief Counsel Office (Service Address)",
          type: "text",
          required: true,
          placeholder:
            "e.g., Office of the Chief Counsel, ICE, 26 Federal Plaza, New York, NY 10278",
          helpText: "The DHS/ICE Chief Counsel office where a copy of the motion will be served.",
        },
        {
          id: "serviceMethod",
          label: "Method of Service on DHS",
          type: "select",
          required: true,
          helpText: "How the motion will be served on DHS counsel.",
          validation: {
            options: [
              { value: "ecas", label: "ECAS Electronic Service" },
              { value: "personal", label: "Personal Service / Hand Delivery" },
              { value: "mail", label: "U.S. Mail" },
              { value: "overnight", label: "Overnight Delivery Service" },
            ],
          },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 10: Signature Block
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "signatureBlock",
      name: "Signature Block",
      type: "user-input",
      order: 10,
      required: true,
      helpText: "Enter the attorney's information for the signature block.",
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name",
        },
        {
          id: "barNumber",
          label: "State Bar Number",
          type: "text",
          required: true,
          placeholder: "Bar number",
        },
        {
          id: "eoirNumber",
          label: "EOIR Attorney ID Number",
          type: "text",
          required: false,
          placeholder: "EOIR registration number",
          helpText: "EOIR Attorney ID number.",
        },
        {
          id: "firmName",
          label: "Law Firm / Organization",
          type: "text",
          required: false,
          placeholder: "Firm or organization name",
        },
        {
          id: "address",
          label: "Mailing Address",
          type: "textarea",
          required: true,
          placeholder: "Street address\nCity, State ZIP",
        },
        {
          id: "phone",
          label: "Telephone",
          type: "text",
          required: true,
          placeholder: "(555) 123-4567",
        },
        {
          id: "email",
          label: "Email Address",
          type: "text",
          required: true,
          placeholder: "attorney@example.com",
        },
        {
          id: "signingDate",
          label: "Date",
          type: "date",
          required: true,
          helpText: "Date the motion is signed.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Section 11: Certificate of Service (Static)
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 11,
      required: true,
      staticContent:
        "CERTIFICATE OF SERVICE\n\n" +
        "I hereby certify that on the date below, a true and correct copy of the foregoing MOTION FOR WITHHOLDING OF REMOVAL AND/OR PROTECTION UNDER THE CONVENTION AGAINST TORTURE was served upon:\n\n" +
        "Office of the Chief Counsel\n" +
        "U.S. Department of Homeland Security\n" +
        "Immigration and Customs Enforcement\n" +
        "[Address]\n\n" +
        "by the following method:\n" +
        "[ ] EOIR Courts & Appeals System (ECAS)\n" +
        "[ ] Personal delivery\n" +
        "[ ] U.S. Mail, first class, postage prepaid\n" +
        "[ ] Overnight delivery service\n\n" +
        "Dated: _______________\n\n" +
        "____________________________\n" +
        "[Attorney Name]\n" +
        "[Bar Number]",
    },
  ],

  jurisdictionVariants: [],
};

export default motionForWithholdingRemovalCatTemplate;
