/**
 * Motion for Voluntary Departure — EOIR Immigration Court Template
 *
 * Request for voluntary departure under INA § 240B allowing respondent
 * to leave the U.S. at own expense within a specified period instead of
 * receiving a formal removal order. Preserves future immigration options.
 *
 * Can be requested pre-hearing (up to 120 days) or at conclusion of
 * proceedings (up to 60 days).
 *
 * Governed by INA § 240B, 8 C.F.R. § 1240.26.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

const DEPARTURE_STAGES = [
  { value: "pre_hearing", label: "Pre-Hearing Voluntary Departure (INA § 240B(a) — up to 120 days)" },
  { value: "post_hearing", label: "Post-Hearing Voluntary Departure (INA § 240B(b) — up to 60 days)" },
];

const REQUESTED_PERIODS = [
  { value: "30_days", label: "30 Days" },
  { value: "60_days", label: "60 Days" },
  { value: "90_days", label: "90 Days" },
  { value: "120_days", label: "120 Days" },
];

const MEANS_OF_DEPARTURE = [
  { value: "own_arrangement", label: "Own Arrangement (self-funded travel)" },
  { value: "with_assistance", label: "With Assistance (IOM or other organization)" },
];

const FINANCIAL_ABILITY_OPTIONS = [
  { value: "able_to_pay", label: "Able to Pay Travel Costs" },
  { value: "requesting_bond_waiver", label: "Requesting Bond Waiver" },
  { value: "will_post_bond", label: "Will Post Voluntary Departure Bond" },
];

const PHYSICAL_PRESENCE_OPTIONS = [
  { value: "less_than_1", label: "Less Than 1 Year" },
  { value: "1_to_5", label: "1 to 5 Years" },
  { value: "5_to_10", label: "5 to 10 Years" },
  { value: "more_than_10", label: "More Than 10 Years" },
];

const GOOD_MORAL_CHARACTER_OPTIONS = [
  { value: "yes", label: "Yes — Good Moral Character" },
  { value: "pending_determination", label: "Pending Determination" },
];

const AGGRAVATED_FELONY_OPTIONS = [
  { value: "yes_no_agg_felony", label: "Yes — No Aggravated Felony Conviction" },
  { value: "has_agg_felony_conviction", label: "Has Aggravated Felony Conviction" },
];

const TERRORISM_CHARGES_OPTIONS = [
  { value: "yes_no_charges", label: "Yes — No Terrorism-Related Charges" },
  { value: "has_charges", label: "Has Terrorism-Related Charges" },
];

const PRIOR_VD_OPTIONS = [
  { value: "no_prior", label: "No Prior Voluntary Departure" },
  { value: "prior_complied", label: "Prior Voluntary Departure — Complied" },
  { value: "prior_did_not_comply", label: "Prior Voluntary Departure — Did Not Comply" },
];

const TAX_COMPLIANCE_OPTIONS = [
  { value: "current", label: "Current on Tax Obligations" },
  { value: "filing_in_progress", label: "Filing in Progress" },
  { value: "not_applicable", label: "Not Applicable" },
];

const BOND_OPTIONS = [
  { value: "waive_bond_request", label: "Request Waiver of Voluntary Departure Bond" },
  { value: "willing_to_post_bond", label: "Willing to Post Voluntary Departure Bond" },
];

export const motionForVoluntaryDepartureEoirTemplate: DocumentTemplate = {
  id: "motion-for-voluntary-departure-eoir",
  name: "Motion for Voluntary Departure",
  category: "immigration",
  description:
    "Request for voluntary departure under INA § 240B allowing respondent to leave the U.S. at own expense within a specified period instead of receiving a formal removal order. Preserves future immigration options. Can be requested pre-hearing (up to 120 days) or at conclusion of proceedings (up to 60 days). Governed by INA § 240B, 8 C.F.R. § 1240.26.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  estimatedCompletionTime: "15-20 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 1,
      required: true,
      helpText: "Enter the immigration court and case information for the motion caption.",
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
          id: "proceedingType",
          label: "Proceeding Type",
          type: "select",
          required: true,
          helpText: "Type of immigration proceeding.",
          validation: {
            options: PROCEEDING_TYPES,
          },
        },
      ],
    },

    {
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Provide filing method and information about the current proceedings.",
      inputs: [
        {
          id: "filingMethod",
          label: "Filing Method",
          type: "select",
          required: true,
          helpText: "How you will file this motion.",
          validation: {
            options: FILING_METHODS,
          },
        },
        {
          id: "nextHearingDate",
          label: "Next Scheduled Hearing Date",
          type: "date",
          required: false,
          helpText: "Date of the next scheduled hearing, if any.",
        },
        {
          id: "dhsAttorney",
          label: "DHS Trial Attorney Name",
          type: "text",
          required: false,
          placeholder: "Name of the assigned DHS trial attorney",
          helpText: "The name of the DHS/ICE trial attorney assigned to the case, if known.",
        },
      ],
    },

    {
      id: "voluntaryDepartureDetails",
      name: "Voluntary Departure Details",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide details about the voluntary departure request, including timing and travel arrangements.",
      inputs: [
        {
          id: "departureStage",
          label: "Stage of Voluntary Departure Request",
          type: "select",
          required: true,
          helpText: "Pre-hearing VD allows up to 120 days; post-hearing VD allows up to 60 days but requires additional eligibility showing.",
          validation: {
            options: DEPARTURE_STAGES,
          },
        },
        {
          id: "requestedDepartureDate",
          label: "Requested Departure Date",
          type: "date",
          required: false,
          helpText: "The specific date by which the respondent proposes to depart, if known.",
        },
        {
          id: "requestedPeriod",
          label: "Requested Voluntary Departure Period",
          type: "select",
          required: true,
          helpText: "The length of time requested for voluntary departure. Pre-hearing maximum is 120 days; post-hearing maximum is 60 days.",
          validation: {
            options: REQUESTED_PERIODS,
          },
        },
        {
          id: "destinationCountry",
          label: "Destination Country",
          type: "text",
          required: true,
          placeholder: "Country the respondent will depart to",
          helpText: "The country to which the respondent intends to voluntarily depart.",
        },
        {
          id: "meansOfDeparture",
          label: "Means of Departure",
          type: "select",
          required: true,
          helpText: "How the respondent intends to arrange travel.",
          validation: {
            options: MEANS_OF_DEPARTURE,
          },
        },
        {
          id: "financialAbility",
          label: "Financial Ability to Depart",
          type: "select",
          required: true,
          helpText: "Indicate whether the respondent can pay for travel or needs bond-related relief.",
          validation: {
            options: FINANCIAL_ABILITY_OPTIONS,
          },
        },
        {
          id: "departureArrangements",
          label: "Departure Arrangements",
          type: "textarea",
          required: false,
          placeholder: "Describe any travel arrangements already made or planned, including airline tickets, passport availability, travel documents...",
          helpText: "Provide details about any travel arrangements if known, including passport status, available travel documents, and planned itinerary.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    {
      id: "eligibilityFactors",
      name: "Eligibility Factors",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Provide information about the respondent's eligibility for voluntary departure under INA § 240B.",
      inputs: [
        {
          id: "physicalPresenceYears",
          label: "Years of Physical Presence in the U.S.",
          type: "select",
          required: true,
          helpText: "Post-hearing voluntary departure requires at least one year of physical presence. Pre-hearing VD has no minimum.",
          validation: {
            options: PHYSICAL_PRESENCE_OPTIONS,
          },
        },
        {
          id: "goodMoralCharacter",
          label: "Good Moral Character",
          type: "select",
          required: true,
          helpText: "Post-hearing voluntary departure requires good moral character for at least 5 years preceding the application.",
          validation: {
            options: GOOD_MORAL_CHARACTER_OPTIONS,
          },
        },
        {
          id: "noAggravatedFelony",
          label: "No Aggravated Felony Conviction",
          type: "select",
          required: true,
          helpText: "Respondents convicted of an aggravated felony are ineligible for voluntary departure under INA § 240B(a)(1).",
          validation: {
            options: AGGRAVATED_FELONY_OPTIONS,
          },
        },
        {
          id: "noTerrorismCharges",
          label: "No Terrorism-Related Charges",
          type: "select",
          required: true,
          helpText: "Respondents deportable under INA § 237(a)(4) (terrorism-related grounds) are ineligible.",
          validation: {
            options: TERRORISM_CHARGES_OPTIONS,
          },
        },
        {
          id: "priorVoluntaryDeparture",
          label: "Prior Voluntary Departure History",
          type: "select",
          required: true,
          helpText: "Prior failure to depart voluntarily may affect eligibility or the court's willingness to grant VD.",
          validation: {
            options: PRIOR_VD_OPTIONS,
          },
        },
        {
          id: "taxCompliance",
          label: "Tax Compliance",
          type: "select",
          required: true,
          helpText: "Post-hearing voluntary departure requires the respondent to establish tax compliance if applicable.",
          validation: {
            options: TAX_COMPLIANCE_OPTIONS,
          },
        },
      ],
    },

    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI will draft the legal argument for voluntary departure based on the details provided.",
      aiPromptTemplate:
        "Generate a legal argument for a Motion for Voluntary Departure in immigration court. The proceeding type is {{proceedingType}}. Departure stage: {{departureStage}}. Requested period: {{requestedPeriod}}. Destination country: {{destinationCountry}}. Means of departure: {{meansOfDeparture}}. Financial ability: {{financialAbility}}. {{#if departureArrangements}}Departure arrangements: {{departureArrangements}}.{{/if}} Physical presence: {{physicalPresenceYears}}. Good moral character: {{goodMoralCharacter}}. No aggravated felony: {{noAggravatedFelony}}. No terrorism charges: {{noTerrorismCharges}}. Prior voluntary departure: {{priorVoluntaryDeparture}}. Tax compliance: {{taxCompliance}}. Bond preference: {{voluntaryDepartureBond}}. {{#if bondAmount}}Proposed bond amount: {{bondAmount}}.{{/if}} {{#if financialResources}}Financial resources: {{financialResources}}.{{/if}}",
      aiInstructions:
        "Draft a formal legal argument section for a Motion for Voluntary Departure before an EOIR immigration court. Structure the argument as follows: (1) Introduction and statutory framework — cite INA § 240B(a) for pre-hearing voluntary departure and INA § 240B(b) for post-hearing voluntary departure, and 8 C.F.R. § 1240.26, (2) Eligibility requirements — for pre-hearing VD: no aggravated felony, no terrorism grounds, concession of removability or waiver of hearing; for post-hearing VD: physical presence for at least one year, good moral character for five years, no aggravated felony, no terrorism grounds, (3) Demonstrate the respondent meets each eligibility requirement, (4) Time limits — pre-hearing allows up to 120 days, post-hearing allows up to 60 days, (5) Benefits of voluntary departure — preserves the respondent's ability to seek future immigration relief, avoids the bars to reentry associated with a formal removal order (INA § 212(a)(9)), avoids the penalties for failure to depart under a removal order, (6) Bond and financial considerations — address the respondent's ability to pay travel costs and any bond request, (7) Conclusion requesting voluntary departure for the specified period. Cite Matter of Arguelles-Campos, 22 I&N Dec. 811 (BIA 1999) for factors in voluntary departure. Use formal legal writing style appropriate for EOIR filings. Do not fabricate case citations.",
    },

    {
      id: "bondAndFinancial",
      name: "Bond & Financial",
      type: "user-input",
      order: 6,
      required: true,
      helpText: "Provide information about the voluntary departure bond and financial resources.",
      inputs: [
        {
          id: "voluntaryDepartureBond",
          label: "Voluntary Departure Bond",
          type: "select",
          required: true,
          helpText: "For post-hearing voluntary departure, the Immigration Judge must set a bond of at least $500. Pre-hearing VD may not require a bond.",
          validation: {
            options: BOND_OPTIONS,
          },
        },
        {
          id: "bondAmount",
          label: "Proposed Bond Amount",
          type: "text",
          required: false,
          placeholder: "e.g., $500",
          helpText: "If willing to post bond, specify the proposed amount. Minimum is $500 for post-hearing VD.",
        },
        {
          id: "financialResources",
          label: "Financial Resources",
          type: "textarea",
          required: false,
          placeholder: "Describe the respondent's financial resources available for travel and bond, including savings, family support, employment income...",
          helpText: "Describe the respondent's ability to fund departure and any bond. This supports the court's finding that the respondent intends to and can depart voluntarily.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },
  ],
};

export default motionForVoluntaryDepartureEoirTemplate;
