/**
 * Motion for Bond/Bail Reduction Template
 *
 * Criminal law document template for requesting reduction of bail or bond amount.
 * Argues for reduced bail based on defendant's financial circumstances, community ties,
 * and constitutional protections against excessive bail.
 * Includes jurisdiction-specific variants (CA, NY, TX, FL) and federal court variants.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";
import { CA_COUNTIES, NY_COUNTIES, TX_COUNTIES, FL_COUNTIES, PA_COUNTIES, IL_COUNTIES, OH_COUNTIES, GA_COUNTIES } from "./county-data";

// ============================================================================
// Section Inputs
// ============================================================================

const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., District Court, Superior Court",
    required: true,
    helpText: "The full name of the court where the case is pending",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., 2024-CR-001234",
    required: true,
    helpText: "The assigned case or docket number",
  },
  {
    id: "defendantName",
    label: "Defendant Name",
    type: "party-name",
    placeholder: "Full legal name",
    required: true,
    helpText: "The defendant's full legal name as it appears in court records",
  },
  {
    id: "county",
    label: "County",
    type: "select",
    required: false,
    helpText: "The county where the court is located (select jurisdiction first for county list)",
    validation: {
      options: [],
    },
  },
  {
    id: "countyOther",
    label: "County Name",
    type: "text",
    placeholder: "Enter county name",
    required: false,
    helpText: "Enter the county name if not listed above",
  },
  {
    id: "department",
    label: "Department/Division",
    type: "text",
    placeholder: "e.g., Department 100",
    required: false,
    helpText: "The court department or division, if applicable",
  },
];

const currentBailInputs: TemplateInput[] = [
  {
    id: "currentBailAmount",
    label: "Current Bail Amount",
    type: "text",
    placeholder: "e.g., $500,000",
    required: true,
    helpText: "The current bail amount set by the court",
  },
  {
    id: "bailType",
    label: "Type of Bail/Bond",
    type: "select",
    required: true,
    helpText: "Select the type of bail or bond currently set",
    validation: {
      options: [
        { value: "cash_bail", label: "Cash Bail" },
        { value: "surety_bond", label: "Surety Bond" },
        { value: "property_bond", label: "Property Bond" },
        { value: "no_bail", label: "No Bail / Bail Denied" },
        { value: "or_release", label: "Own Recognizance Release" },
        { value: "combination", label: "Combination" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "bailSetBy",
    label: "Bail Set By",
    type: "select",
    required: true,
    helpText: "How the current bail was determined",
    validation: {
      options: [
        { value: "magistrate", label: "Magistrate Judge" },
        { value: "arraignment_judge", label: "Arraignment Judge" },
        { value: "bail_schedule", label: "Bail Schedule" },
        { value: "grand_jury_indictment", label: "Grand Jury Indictment" },
        { value: "other_judge", label: "Other Judge" },
      ],
    },
  },
  {
    id: "bailSetDate",
    label: "Date Bail Was Set",
    type: "date",
    required: true,
    helpText: "The date the current bail amount was set",
  },
  {
    id: "charges",
    label: "Current Charges",
    type: "textarea",
    placeholder: "List all current charges and code sections...",
    required: true,
    helpText: "Provide a description of all current charges including statute numbers",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
  {
    id: "chargeLevel",
    label: "Charge Level",
    type: "select",
    required: true,
    helpText: "The highest level of the current charges",
    validation: {
      options: [
        { value: "misdemeanor", label: "Misdemeanor" },
        { value: "felony", label: "Felony" },
        { value: "serious_felony", label: "Serious/Violent Felony" },
        { value: "capital", label: "Capital Offense" },
        { value: "federal", label: "Federal Offense" },
      ],
    },
  },
  {
    id: "currentlyInCustody",
    label: "Custody Status",
    type: "select",
    required: true,
    helpText: "The defendant's current custody status",
    validation: {
      options: [
        { value: "yes_jail", label: "In Custody - County Jail" },
        { value: "yes_state", label: "In Custody - State Facility" },
        { value: "yes_federal", label: "In Custody - Federal Facility" },
        { value: "no_posted", label: "Released - Bail Posted" },
        { value: "no_released", label: "Released - Other Conditions" },
      ],
    },
  },
  {
    id: "timeInCustody",
    label: "Time in Custody",
    type: "text",
    placeholder: "e.g., 45 days",
    required: false,
    helpText: "How long the defendant has been in custody, if applicable",
  },
  {
    id: "priorBailRequests",
    label: "Prior Bail Reduction Requests",
    type: "select",
    required: true,
    helpText: "Whether prior bail reduction requests have been made",
    validation: {
      options: [
        { value: "none", label: "No prior requests" },
        { value: "one_denied", label: "One prior request - Denied" },
        { value: "one_partial", label: "One prior request - Partially granted" },
        { value: "multiple", label: "Multiple prior requests" },
      ],
    },
  },
];

const defendantBackgroundInputs: TemplateInput[] = [
  {
    id: "employmentStatus",
    label: "Employment Status",
    type: "select",
    required: true,
    helpText: "The defendant's current employment status",
    validation: {
      options: [
        { value: "employed_full", label: "Employed Full-Time" },
        { value: "employed_part", label: "Employed Part-Time" },
        { value: "self_employed", label: "Self-Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "student", label: "Student" },
        { value: "retired", label: "Retired" },
        { value: "disabled", label: "Disabled" },
      ],
    },
  },
  {
    id: "employmentDetails",
    label: "Employment Details",
    type: "textarea",
    placeholder: "Describe employer, position, length of employment...",
    required: false,
    helpText: "Additional details about employment history and current position",
    validation: {
      maxLength: 1000,
    },
  },
  {
    id: "residenceStatus",
    label: "Residence Status",
    type: "select",
    required: true,
    helpText: "The defendant's current housing situation",
    validation: {
      options: [
        { value: "own_home", label: "Homeowner" },
        { value: "renting", label: "Renting" },
        { value: "family_home", label: "Living with Family" },
        { value: "temporary", label: "Temporary Housing" },
        { value: "homeless", label: "Homeless/Unhoused" },
      ],
    },
  },
  {
    id: "residenceDetails",
    label: "Residence Details",
    type: "textarea",
    placeholder: "Describe living situation, length of residence, stability...",
    required: false,
    helpText: "Additional details about residence history and stability",
    validation: {
      maxLength: 1000,
    },
  },
  {
    id: "familyTies",
    label: "Family and Community Ties",
    type: "textarea",
    placeholder: "Describe family members in area, dependents, community involvement...",
    required: true,
    helpText: "Describe the defendant's family ties, dependents, and connections to the community",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
  {
    id: "communityInvolvement",
    label: "Community Involvement",
    type: "textarea",
    placeholder: "Describe community organizations, volunteer work, church membership...",
    required: false,
    helpText: "Describe any community involvement, organizations, or civic participation",
    validation: {
      maxLength: 1000,
    },
  },
  {
    id: "criminalHistory",
    label: "Criminal History",
    type: "select",
    required: true,
    helpText: "The defendant's prior criminal history",
    validation: {
      options: [
        { value: "none", label: "No Prior Criminal History" },
        { value: "minor_only", label: "Minor Offenses Only (misdemeanors, infractions)" },
        { value: "prior_felony", label: "Prior Felony Conviction(s)" },
        { value: "prior_violent", label: "Prior Violent Offense(s)" },
      ],
    },
  },
  {
    id: "criminalHistoryDetails",
    label: "Criminal History Details",
    type: "textarea",
    placeholder: "Provide relevant details about prior record, compliance with past court orders...",
    required: false,
    helpText: "Additional details about criminal history, past compliance with court orders, probation, etc.",
    validation: {
      maxLength: 2000,
    },
  },
  {
    id: "substanceTreatment",
    label: "Substance Abuse Treatment",
    type: "select",
    required: false,
    helpText: "Whether substance abuse treatment is relevant to this case",
    validation: {
      options: [
        { value: "not_applicable", label: "Not Applicable" },
        { value: "currently_enrolled", label: "Currently Enrolled in Treatment" },
        { value: "completed", label: "Completed Treatment Program" },
        { value: "willing_to_enroll", label: "Willing to Enroll in Treatment" },
      ],
    },
  },
  {
    id: "mentalHealthTreatment",
    label: "Mental Health Treatment",
    type: "select",
    required: false,
    helpText: "Whether mental health treatment is relevant to this case",
    validation: {
      options: [
        { value: "not_applicable", label: "Not Applicable" },
        { value: "currently_receiving", label: "Currently Receiving Treatment" },
        { value: "needs_treatment", label: "Needs Treatment (not currently receiving)" },
        { value: "willing_to_engage", label: "Willing to Engage in Treatment" },
      ],
    },
  },
  {
    id: "flightRiskFactors",
    label: "Flight Risk Mitigation",
    type: "textarea",
    placeholder: "Describe factors showing defendant is not a flight risk...",
    required: false,
    helpText: "Explain why the defendant is not a flight risk (e.g., no passport, strong local ties, prior court appearances)",
    validation: {
      maxLength: 1500,
    },
  },
];

const financialInfoInputs: TemplateInput[] = [
  {
    id: "defendantIncome",
    label: "Defendant's Income",
    type: "text",
    placeholder: "e.g., $2,500/month",
    required: true,
    helpText: "The defendant's approximate monthly or annual income",
  },
  {
    id: "defendantAssets",
    label: "Defendant's Assets",
    type: "textarea",
    placeholder: "Describe any assets (savings, property, vehicles)...",
    required: false,
    helpText: "List any assets the defendant has or does not have",
    validation: {
      maxLength: 1000,
    },
  },
  {
    id: "abilityToPayExplanation",
    label: "Inability to Pay Explanation",
    type: "textarea",
    placeholder: "Explain why the defendant cannot afford the current bail amount...",
    required: true,
    helpText: "Provide a detailed explanation of why the current bail amount is beyond the defendant's financial means",
    validation: {
      minLength: 50,
      maxLength: 2000,
    },
  },
  {
    id: "proposedAlternative",
    label: "Proposed Alternative",
    type: "select",
    required: true,
    helpText: "Select the proposed alternative to the current bail",
    validation: {
      options: [
        { value: "reduce_amount", label: "Reduce Bail Amount" },
        { value: "or_release", label: "Own Recognizance Release" },
        { value: "supervised_release", label: "Supervised Release" },
        { value: "ankle_monitor", label: "Electronic Monitoring / Ankle Monitor" },
        { value: "unsecured_bond", label: "Unsecured Bond" },
        { value: "combination", label: "Combination of Conditions" },
        { value: "property_bond", label: "Property Bond" },
      ],
    },
  },
  {
    id: "proposedBailAmount",
    label: "Proposed Bail Amount",
    type: "text",
    placeholder: "e.g., $50,000",
    required: false,
    helpText: "If requesting a reduced amount, specify the proposed bail amount",
  },
  {
    id: "proposedConditions",
    label: "Proposed Conditions of Release",
    type: "textarea",
    placeholder: "Describe proposed conditions (e.g., check-ins, travel restrictions, curfew)...",
    required: false,
    helpText: "Describe any conditions the defendant is willing to accept as alternatives to current bail",
    validation: {
      maxLength: 1500,
    },
  },
];

const hearingInputs: TemplateInput[] = [
  {
    id: "currentHearingDate",
    label: "Hearing Date",
    type: "date",
    required: false,
    helpText: "The date of the scheduled hearing, if known",
  },
  {
    id: "currentHearingTime",
    label: "Hearing Time",
    type: "text",
    placeholder: "e.g., 8:30 AM",
    required: false,
    helpText: "The time of the scheduled hearing",
  },
  {
    id: "hearingType",
    label: "Hearing Type",
    type: "select",
    required: true,
    helpText: "The type of hearing at which the motion will be heard",
    validation: {
      options: [
        { value: "bail_hearing", label: "Bail Hearing" },
        { value: "bail_review", label: "Bail Review" },
        { value: "bail_reduction", label: "Bail Reduction Hearing" },
        { value: "detention_hearing", label: "Detention Hearing" },
        { value: "arthur_hearing", label: "Arthur Hearing (FL)" },
        { value: "pretrial", label: "Pre-Trial Conference" },
        { value: "other", label: "Other" },
      ],
    },
  },
];

const signatureInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "text",
    placeholder: "Full name as registered with bar",
    required: true,
    helpText: "Your full legal name as it appears on your bar card",
  },
  {
    id: "firmName",
    label: "Law Firm / Office Name",
    type: "text",
    placeholder: "e.g., Public Defender's Office",
    required: false,
    helpText: "Your law firm or office name",
  },
  {
    id: "address",
    label: "Business Address",
    type: "textarea",
    placeholder: "Street address, City, State ZIP",
    required: true,
    helpText: "Your business address for service",
    validation: {
      maxLength: 200,
    },
  },
  {
    id: "phone",
    label: "Telephone",
    type: "text",
    placeholder: "(555) 555-5555",
    required: true,
    helpText: "Your business telephone number",
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "attorney@example.com",
    required: true,
    helpText: "Your professional email address",
  },
];

// ============================================================================
// Base Sections (Generic Template)
// ============================================================================

const baseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: captionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  {
    id: "currentBailInfo",
    name: "Current Bail/Bond Information",
    type: "user-input",
    order: 2,
    inputs: currentBailInputs,
    required: true,
    helpText: "Provide details about the current bail or bond",
  },
  {
    id: "defendantBackground",
    name: "Defendant Background",
    type: "user-input",
    order: 3,
    inputs: defendantBackgroundInputs,
    required: true,
    helpText: "Provide background information about the defendant",
  },
  {
    id: "financialInfo",
    name: "Financial Information",
    type: "user-input",
    order: 4,
    inputs: financialInfoInputs,
    required: true,
    helpText: "Provide financial information relevant to bail",
  },
  {
    id: "hearingInfo",
    name: "Hearing Information",
    type: "user-input",
    order: 5,
    inputs: hearingInputs,
    required: true,
    helpText: "Provide hearing details",
  },
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bond/bail reduction in a criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative. Do not include legal citations or argument. Present facts chronologically.",
    helpText: "AI will generate a statement of facts based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bond/bail reduction in a criminal matter.

Jurisdiction: {{jurisdiction}}
Current Bail Amount: {{currentBailAmount}}
Bail Type: {{bailType}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Generate 3-5 paragraphs that:
1. State the applicable legal standard for bail determination
2. Argue that the current bail amount is excessive under the Eighth Amendment
3. Present the defendant's ties to the community and low flight risk
4. Address the defendant's financial inability to post current bail
5. Propose specific alternative conditions of release

Use formal legal writing style with proper citations.`,
    aiInstructions: "Include relevant constitutional citations (Eighth Amendment, Stack v. Boyle). Use proper legal citation format.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court:

1. Reduce the current bail from the amount presently set to a reasonable amount that the Defendant can afford, consistent with the Eighth Amendment prohibition against excessive bail;

2. In the alternative, release the Defendant on personal recognizance or unsecured bond with appropriate conditions of release;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for bail reduction motions",
  },
  {
    id: "signatureBlock",
    name: "Signature Block",
    type: "user-input",
    order: 9,
    inputs: signatureInputs,
    required: true,
    helpText: "Enter your professional information for the signature block",
  },
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `PROOF OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by:

[ ] Personal service
[ ] U.S. Mail, first class, postage prepaid
[ ] Electronic service via the Court's e-filing system
[ ] Facsimile transmission

to the following:

[DISTRICT ATTORNEY/PROSECUTOR]
____________________________
____________________________
____________________________

I declare under penalty of perjury under the laws of the applicable jurisdiction that the foregoing is true and correct.

Dated: _______________

____________________________
[Name]`,
    helpText: "Certificate of service to be completed when filing",
  },
];

// ============================================================================
// CA-specific caption inputs (same fields but with CA counties)
// ============================================================================

const caCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: CA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of California, County of Los Angeles" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., BA123456" }
    : input
);

const caBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: caCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// NY-specific caption inputs (same fields but with NY counties)
// ============================================================================

const nyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: NY_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Supreme Court of the State of New York, County of Kings" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., IND-2024-00123" }
    : input
);

const nyBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: nyCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// TX-specific caption inputs (same fields but with TX counties)
// ============================================================================

const txCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: TX_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Harris County, Texas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., 2024-CR-12345" }
    : input
);

const txBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: txCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// FL-specific caption inputs (same fields but with FL counties)
// ============================================================================

const flCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: FL_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Eleventh Judicial Circuit, Miami-Dade County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., F24-012345" }
    : input
);

const flBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: flCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// PA-specific caption inputs (same fields but with PA counties)
// ============================================================================

const paCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: PA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Philadelphia County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CP-XX-CR-XXXXXXX-YYYY" }
    : input
);

const paBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: paCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// IL-specific caption inputs (same fields but with IL counties)
// ============================================================================

const ilCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: IL_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of Cook County, Illinois" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-CF-XXXXXX" }
    : input
);

const ilBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ilCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// OH-specific caption inputs (same fields but with OH counties)
// ============================================================================

const ohCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: OH_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Cuyahoga County, Ohio" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-YYYY-XXXXXX" }
    : input
);

const ohBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ohCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// GA-specific caption inputs (same fields but with GA counties)
// ============================================================================

const gaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: GA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Fulton County, Georgia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-X-XXXXX" }
    : input
);

const gaBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: gaCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// California State Sections
// ============================================================================

const californiaSections: TemplateSection[] = [
  ...caBaseSections,

  // California-specific statement of facts
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under California Penal Code \u00A7\u00A7 1275, 1270.1 in a California criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under In re Humphrey (2021) 11 Cal.5th 135, California courts must consider the defendant's ability to pay when setting bail. Detention solely due to inability to pay is unconstitutional.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a California bail reduction motion. Present facts chronologically. Reference ability-to-pay context.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  // California-specific legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under California law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable California law includes:
- Cal. Penal Code \u00A7 1275: Factors to consider in fixing bail (protection of public, seriousness of offense, previous criminal record, probability of appearing)
- Cal. Penal Code \u00A7 1270.1: Authority to release on own recognizance
- Cal. Penal Code \u00A7 1269b: Bail schedule; authority of magistrate
- Cal. Const. Art. I, \u00A7 12: Right to bail; excessive bail prohibited
- In re Humphrey (2021) 11 Cal.5th 135: LANDMARK CASE — courts MUST consider defendant's ability to pay when setting bail; detention solely because of inability to pay is unconstitutional; courts must consider nonmonetary alternatives to money bail
- In re Christie (2001) 92 Cal.App.4th 1105: Standard for bail reduction
- Van Atta v. Scott (1980) 27 Cal.3d 424: Bail is excessive if set in amount higher than reasonably calculated to serve purposes of bail

Generate 3-5 paragraphs that:
1. Cite Cal. Penal Code \u00A7\u00A7 1275 and 1270.1 as the statutory basis
2. MUST prominently argue In re Humphrey — the court must consider ability to pay and cannot detain solely due to inability to pay; this is a constitutional requirement
3. Apply the Penal Code \u00A7 1275 factors (public safety, seriousness of offense, prior record, probability of appearance) to show bail should be reduced
4. Argue the current bail is excessive under Cal. Const. Art. I, \u00A7 12 and the Eighth Amendment
5. Propose specific alternative conditions of release

Use proper California legal citation format (e.g., "Cal. Penal Code \u00A7 1275").`,
    aiInstructions: "Must prominently cite In re Humphrey (2021) 11 Cal.5th 135 and Cal. Penal Code \u00A7\u00A7 1275, 1270.1. Use California citation format.",
    helpText: "AI will generate California-specific legal arguments",
  },

  // California prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to California Penal Code sections 1275 and 1270.1, and in accordance with In re Humphrey (2021) 11 Cal.5th 135, to:

1. Reduce the current bail to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment to the United States Constitution and Article I, Section 12 of the California Constitution;

2. In the alternative, release the Defendant on own recognizance pursuant to Penal Code section 1270.1, with appropriate conditions of release;

3. In the alternative, consider nonmonetary conditions of release as required by In re Humphrey, including but not limited to supervised release, electronic monitoring, or other conditions reasonably necessary to ensure the Defendant's appearance and public safety;

4. Consider the Defendant's financial circumstances and ability to pay as constitutionally required by In re Humphrey;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California-specific prayer for relief citing Penal Code and In re Humphrey",
  },

  // Signature block same as base
  baseSections[8],

  // California certificate of service
  {
    id: "certificateOfService",
    name: "Proof of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `PROOF OF SERVICE

STATE OF CALIFORNIA, COUNTY OF ____________________

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of California. My business address is _________________________.

On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: I am readily familiar with the business practice for collection and processing of correspondence for mailing with the United States Postal Service. I placed a true copy in a sealed envelope addressed as indicated below and placed for collection and mailing, following ordinary business practices.

[ ] BY PERSONAL SERVICE: I caused a true copy to be personally delivered to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: I caused a true copy to be served electronically via the Court's e-filing system to the email address(es) of record.

PEOPLE OF THE STATE OF CALIFORNIA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, California.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "California-specific proof of service format",
  },
];

// ============================================================================
// CA Federal Sections (Ninth Circuit)
// ============================================================================

const caFederalSections: TemplateSection[] = [
  ...caBaseSections,

  // Federal statement of facts (Ninth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of California (Ninth Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Ninth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention — rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Ninth Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Ninth Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Ninth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Ninth Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (CA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New York State Sections
// ============================================================================

const newYorkSections: TemplateSection[] = [
  ...nyBaseSections,

  // NY statement of facts (CPL \u00A7\u00A7 510.10-510.50)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under New York Criminal Procedure Law \u00A7\u00A7 510.10-510.50.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under New York's 2020 Bail Reform (CPL \u00A7 510.10), most misdemeanors and nonviolent felonies require release on recognizance or under supervision. For bail-eligible offenses, the court must use the "least restrictive" conditions to reasonably assure appearance.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Address whether the charges qualify for mandatory release under the 2020 Bail Reform

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a New York bail reduction motion. Reference 2020 Bail Reform context where applicable.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  // NY legal argument (CPL \u00A7 510.30)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under New York Criminal Procedure Law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable New York law includes:
- CPL \u00A7 510.10: Securing order; when required — 2020 Bail Reform mandates release on recognizance or under supervision for most misdemeanors and nonviolent felonies
- CPL \u00A7 510.30: Application for recognizance or bail; rules of law and criteria controlling determination — court must consider defendant's activities and history, criminal record, record of compliance with court orders, ability to post bail, and whether bail is necessary to assure return to court
- CPL \u00A7 510.40: Court to make individualized assessment; must select "least restrictive" alternative
- CPL \u00A7 510.50: Examination of bail circumstances
- N.Y. Const. Art. I, \u00A7 5: Right to bail
- People ex rel. McManus v. Horn, 18 N.Y.3d 660 (2012): Bail must not be excessive; purpose is to ensure appearance
- People ex rel. Lobell v. McDonnell, 296 N.Y. 109 (1947): Financial circumstances relevant to bail determination

Generate 3-5 paragraphs that:
1. Cite CPL \u00A7\u00A7 510.10-510.40 as the statutory basis
2. Argue the "least restrictive" standard under the 2020 Bail Reform — note whether charges qualify for mandatory release
3. Apply the CPL \u00A7 510.30 factors (activities, criminal record, court compliance, ability to post)
4. Argue the current bail is excessive and inconsistent with the purpose of bail (assuring appearance, not punishing)
5. Propose specific alternative conditions consistent with CPL \u00A7 510.40

Use proper New York legal citation format (e.g., "CPL \u00A7 510.10").`,
    aiInstructions: "Must cite CPL \u00A7\u00A7 510.10-510.40 and 2020 Bail Reform. Use New York citation format.",
    helpText: "AI will generate New York-specific legal arguments",
  },

  // NY prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to New York Criminal Procedure Law \u00A7\u00A7 510.10-510.40 to:

1. Reduce the current bail to an amount that the Defendant can reasonably afford, consistent with the purpose of bail to ensure the Defendant's appearance in court;

2. In the alternative, release the Defendant on recognizance or under non-monetary conditions of supervision, as the least restrictive alternative necessary to reasonably assure the Defendant's return to court pursuant to CPL \u00A7 510.40;

3. In the alternative, impose the least restrictive conditions of release consistent with the 2020 Bail Reform and CPL \u00A7 510.10;

4. Consider the Defendant's financial circumstances and ability to post bail as required by CPL \u00A7 510.30;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing CPL Article 510",
  },

  // Signature block same as base
  baseSections[8],

  // NY certificate of service
  {
    id: "certificateOfService",
    name: "Affidavit of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `AFFIDAVIT OF SERVICE

STATE OF NEW YORK, COUNTY OF ____________________

I, the undersigned, being duly sworn, depose and say that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of New York.

On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION upon all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in a post office official depository under the exclusive care and custody of the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via NYSCEF to the email address(es) of record.

PEOPLE OF THE STATE OF NEW YORK
c/o District Attorney
________________________________
________________________________
________________________________

Sworn to before me this _____ day of ______________, 20___

____________________________
Notary Public

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "New York-specific affidavit of service format",
  },
];

// ============================================================================
// NY Federal Sections (Second Circuit)
// ============================================================================

const nyFederalSections: TemplateSection[] = [
  ...nyBaseSections,

  // Federal statement of facts (Second Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of New York (Second Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Second Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention — rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Second Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Second Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Second Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Second Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (NY)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Texas State Sections
// ============================================================================

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  // TX statement of facts (Art. 17.15)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Texas Code of Criminal Procedure Article 17.15 in a Texas criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Texas law, bail is not to be used as an instrument of oppression. Tex. Code Crim. Proc. Art. 17.15 provides rules for fixing bail, and Ex parte Rubac, 611 S.W.2d 848 (Tex. Crim. App. 1981) establishes the six factors for bail determination.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Address the six Ex parte Rubac factors through the factual narrative

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a Texas bail reduction motion. Present facts chronologically. Address Ex parte Rubac factors.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  // TX legal argument (Art. 17.15)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under Texas law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 17.15: Rules for fixing amount of bail — bail shall be sufficiently high to give reasonable assurance of compliance, but must not be used as instrument of oppression
- Tex. Const. Art. I, \u00A7 11: Right to bail — all prisoners are bailable by sufficient sureties unless for capital offenses when proof is evident
- Tex. Const. Art. I, \u00A7 11a: Denial of bail for certain offenses
- Tex. Const. Art. I, \u00A7 13: Excessive bail shall not be required
- Ex parte Rubac, 611 S.W.2d 848 (Tex. Crim. App. 1981): SIX FACTORS for bail determination — (1) nature of the offense, (2) ability to make bail, (3) safety of the victim and community, (4) criminal history, (5) citizenship and residency, (6) employment history
- Ex parte Rodriguez, 595 S.W.2d 549 (Tex. Crim. App. 1980): Bail set above ability to post is excessive
- Ex parte Beard, 92 S.W.3d 566 (Tex. App. 2002): Burden on defendant to show bail is excessive

Generate 3-5 paragraphs that:
1. Cite Tex. Code Crim. Proc. Art. 17.15 as the statutory basis — bail must not be used as instrument of oppression
2. Apply ALL SIX Ex parte Rubac factors to the facts: (1) nature of offense, (2) ability to make bail, (3) safety of victim/community, (4) criminal history, (5) citizenship/residency, (6) employment
3. Argue the current bail is excessive under Tex. Const. Art. I, \u00A7 13 and the Eighth Amendment
4. Cite Ex parte Rodriguez — bail set above ability to post is excessive
5. Propose specific alternative conditions of release

Use proper Texas legal citation format (e.g., "Tex. Code Crim. Proc. art. 17.15").`,
    aiInstructions: "Must cite Art. 17.15, Tex. Const. Art. I, \u00A7\u00A7 11, 13, and Ex parte Rubac with all six factors. Use Texas citation format.",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  // TX prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Texas Code of Criminal Procedure Article 17.15 and the Texas Constitution Article I, Sections 11 and 13, to:

1. Reduce the current bail to a reasonable amount consistent with the factors set forth in Ex parte Rubac, 611 S.W.2d 848 (Tex. Crim. App. 1981), that the Defendant can afford and that is not used as an instrument of oppression;

2. In the alternative, release the Defendant on personal bond with appropriate conditions of release;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community;

4. Consider the Defendant's financial circumstances and ability to post bail as required by Ex parte Rubac;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing Art. 17.15 and Ex parte Rubac",
  },

  // Signature block same as base
  baseSections[8],

  // TX certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TEXAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via eFileTexas.gov to the email address(es) of record.

THE STATE OF TEXAS
c/o District Attorney / County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Texas that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Texas.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Texas-specific certificate of service format",
  },
];

// ============================================================================
// TX Federal Sections (Fifth Circuit)
// ============================================================================

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  // Federal statement of facts (Fifth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Texas (Fifth Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Fifth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention — rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Fifth Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Fifth Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Fifth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Fifth Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (TX)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Florida State Sections
// ============================================================================

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  // FL statement of facts (Fla. R. Crim. P. 3.131)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Florida Rule of Criminal Procedure 3.131 and Florida Statute \u00A7 903.046 in a Florida criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under Florida law, every person charged with a crime is entitled to pretrial release on reasonable conditions unless charged with a capital or life felony where proof is evident or presumption great. For capital/life felony cases where bail was initially denied, an Arthur hearing (Arthur v. State, 390 So. 2d 717 (Fla. 1980)) may be required.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. If applicable, address Arthur hearing requirements for capital/life felony cases

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a Florida bail reduction motion. Reference Arthur hearing context if applicable.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  // FL legal argument (Fla. R. Crim. P. 3.131)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under Florida law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.131: Pretrial release — every person charged with a crime shall be entitled to pretrial release on reasonable conditions
- Fla. R. Crim. P. 3.131(b)(1): Factors for determining conditions of release (nature of offense, weight of evidence, ties to community, length of residence, employment, financial resources, mental condition, record of convictions, record of appearance/flight, danger to community)
- Fla. Stat. \u00A7 903.046: Purpose of and criteria for bail determination — bail is not to be used as punishment or to extract a guilty plea
- Fla. Const. Art. I, \u00A7 14: Right to bail — unless charged with capital offense or offense punishable by life imprisonment when proof is evident or presumption great
- Arthur v. State, 390 So. 2d 717 (Fla. 1980): ARTHUR HEARING — when bail is denied for capital/life felony, defendant is entitled to adversarial hearing where State must prove proof is evident or presumption great
- State v. Arthur, 390 So. 2d 717 (Fla. 1980): Standard for bail in capital cases
- Younghans v. State, 90 So. 2d 308 (Fla. 1956): Bail must not be excessive; purpose is to assure appearance

Generate 3-5 paragraphs that:
1. Cite Fla. R. Crim. P. 3.131 and Fla. Stat. \u00A7 903.046 as the statutory basis
2. Apply the Fla. R. Crim. P. 3.131(b)(1) factors to the facts
3. Argue the current bail is excessive under Fla. Const. Art. I, \u00A7 14 and the Eighth Amendment — bail is not punishment
4. If applicable, reference Arthur v. State and the Arthur hearing process for capital/life felony cases
5. Propose specific alternative conditions of release

Use proper Florida legal citation format (e.g., "Fla. R. Crim. P. 3.131").`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.131, Fla. Stat. \u00A7 903.046, and Arthur v. State where applicable. Use Florida citation format.",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  // FL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Florida Rule of Criminal Procedure 3.131 and Florida Statute \u00A7 903.046 to:

1. Reduce the current bail to a reasonable amount that the Defendant can afford, consistent with the Eighth Amendment to the United States Constitution and Article I, Section 14 of the Florida Constitution;

2. In the alternative, release the Defendant on recognizance or nonmonetary conditions of release pursuant to Fla. R. Crim. P. 3.131;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community, considering the factors set forth in Fla. R. Crim. P. 3.131(b)(1) and Fla. Stat. \u00A7 903.046;

4. Consider the Defendant's financial resources and ability to post bail as required by Fla. R. Crim. P. 3.131(b)(1);

5. Grant a hearing on this motion, including an Arthur hearing pursuant to Arthur v. State, 390 So. 2d 717 (Fla. 1980), if applicable;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing Fla. R. Crim. P. 3.131 and Arthur v. State",
  },

  // Signature block same as base
  baseSections[8],

  // FL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF FLORIDA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Florida Courts E-Filing Portal to the email address(es) of record.

STATE OF FLORIDA
c/o State Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Florida that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Florida.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Florida-specific certificate of service format",
  },
];

// ============================================================================
// FL Federal Sections (Eleventh Circuit)
// ============================================================================

const flFederalSections: TemplateSection[] = [
  ...flBaseSections,

  // Federal statement of facts (Eleventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Florida (Eleventh Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention — rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Eleventh Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Eleventh Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Eleventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Eleventh Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (FL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Pennsylvania State Sections
// ============================================================================

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  // PA statement of facts (Pa.R.Crim.P. 520, 524, 525)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Pennsylvania Rules of Criminal Procedure 520, 524, and 525 in a Pennsylvania criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under Pa.R.Crim.P. 520, 524, and 525, Pennsylvania courts use a 10-factor bail analysis to determine appropriate bail conditions. Pa.R.Crim.P. 524 sets forth types of release on bail, and Pa.R.Crim.P. 525 addresses bail after trial.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Address the 10-factor bail analysis through the factual narrative

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania bail reduction motion. Reference the 10-factor bail analysis context. Present facts chronologically.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  // PA legal argument (Pa.R.Crim.P. 520, 524, 525)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under Pennsylvania law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Pennsylvania law includes:
- Pa.R.Crim.P. 520: Bail before verdict — conditions and standards for setting bail in criminal cases
- Pa.R.Crim.P. 524: Types of release on bail — release on recognizance, release on nonmonetary conditions, release on unsecured bail bond, release on nominal bail, release on a bail bond secured by deposit or collateral
- Pa.R.Crim.P. 525: Bail after trial — standards for bail pending sentencing and appeal
- PA Const. Art. I, \u00A7 14: Excessive bail shall not be required
- Commonwealth v. Truesdale: 10-FACTOR BAIL TEST — (1) nature of offense, (2) defendant's employment status and history, (3) financial resources, (4) character and mental condition, (5) length of residence in community, (6) criminal record, (7) prior bail jumping or flight, (8) ties to community including family, (9) length of time in custody, (10) any other relevant factors
- The court must impose the least restrictive conditions necessary to ensure appearance and public safety

Generate 3-5 paragraphs that:
1. Cite Pa.R.Crim.P. 520 and 524 as the statutory basis for bail determination
2. Apply ALL TEN Commonwealth v. Truesdale factors to the facts
3. Argue the current bail is excessive under PA Const. Art. I, \u00A7 14 and the Eighth Amendment
4. Cite Pa.R.Crim.P. 524 types of release and argue for less restrictive conditions
5. Propose specific alternative conditions of release

Use proper Pennsylvania legal citation format (e.g., "Pa.R.Crim.P. 520").`,
    aiInstructions: "Must cite Pa.R.Crim.P. 520, 524, 525, PA Const. Art. I, \u00A7 14, and Commonwealth v. Truesdale with all ten factors. Use Pennsylvania citation format.",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  // PA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pennsylvania Rules of Criminal Procedure 520, 524, and 525 to:

1. Reduce the current bail to a reasonable amount that the Defendant can afford, consistent with the Eighth Amendment to the United States Constitution and Article I, Section 14 of the Pennsylvania Constitution;

2. In the alternative, release the Defendant on recognizance or nonmonetary conditions of release pursuant to Pa.R.Crim.P. 524;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community, considering all ten factors set forth in Commonwealth v. Truesdale;

4. Consider the Defendant's financial resources and ability to post bail as required by the Rules of Criminal Procedure;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing Pa.R.Crim.P. 520, 524, and 525",
  },

  // Signature block same as base
  baseSections[8],

  // PA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF PENNSYLVANIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via PACFile to the email address(es) of record.

COMMONWEALTH OF PENNSYLVANIA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the Commonwealth of Pennsylvania that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Pennsylvania.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Pennsylvania-specific certificate of service format",
  },
];

// ============================================================================
// PA Federal Sections (Third Circuit)
// ============================================================================

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  // Federal statement of facts (Third Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Pennsylvania (Third Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Third Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention \u2014 rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Third Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Third Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Third Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Third Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (PA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Illinois State Sections
// ============================================================================

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  // IL statement of facts (725 ILCS 5/110 - Pretrial Fairness Act)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under 725 ILCS 5/110 and the 2023 Pretrial Fairness Act (SAFE-T Act) in an Illinois criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Illinois is the FIRST STATE to abolish cash bail. The 2023 Pretrial Fairness Act (part of the SAFE-T Act) ELIMINATED CASH BAIL for most offenses. Under the new system, pretrial release is presumed and pretrial detention is only permitted for specific offenses where the State proves by clear and convincing evidence that the defendant poses a danger or flight risk.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when detention/conditions were set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's circumstances and the presumption of pretrial release
4. Address the Pretrial Fairness Act's elimination of cash bail and its impact on this case

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for an Illinois pretrial release motion. Reference the Pretrial Fairness Act's elimination of cash bail. Present facts chronologically.",
    helpText: "AI will generate an Illinois-specific statement of facts",
  },

  // IL legal argument (725 ILCS 5/110)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Illinois law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Illinois law includes:
- 725 ILCS 5/110-5: Conditions of pretrial release \u2014 court shall impose the least restrictive conditions necessary
- 725 ILCS 5/110-6.1: Detention hearings \u2014 detention only for specific offenses where State proves by clear and convincing evidence that defendant poses a real and present threat or willful flight risk
- IL Const. Art. I, \u00A7 9: Excessive bail shall not be required
- 2023 Pretrial Fairness Act (part of the SAFE-T Act): ELIMINATED CASH BAIL for most offenses \u2014 Illinois is the first state to abolish cash bail; creates a presumption of pretrial release; detention only permitted for specific qualifying offenses
- The presumption of release means that pretrial detention is the exception, not the rule; the State bears the burden of proving by clear and convincing evidence that detention is necessary

Generate 3-5 paragraphs that:
1. Cite 725 ILCS 5/110 and the Pretrial Fairness Act as the statutory basis
2. Argue the presumption of pretrial release \u2014 cash bail has been eliminated in Illinois; detention is only permitted for specific offenses with clear and convincing evidence
3. Apply 725 ILCS 5/110-5 conditions and argue for least restrictive conditions
4. Argue excessive bail/detention violates IL Const. Art. I, \u00A7 9 and the Eighth Amendment
5. Propose specific alternative conditions of release consistent with the Pretrial Fairness Act

Use proper Illinois legal citation format (e.g., "725 ILCS 5/110-5").`,
    aiInstructions: "Must cite 725 ILCS 5/110-5, 725 ILCS 5/110-6.1, IL Const. Art. I, \u00A7 9, and the 2023 Pretrial Fairness Act. Emphasize that Illinois abolished cash bail. Use Illinois citation format.",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  // IL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 725 ILCS 5/110 and the Illinois Pretrial Fairness Act to:

1. Release the Defendant on pretrial release with the least restrictive conditions necessary, consistent with the elimination of cash bail under the Pretrial Fairness Act and Article I, Section 9 of the Illinois Constitution;

2. In the alternative, modify the current conditions of pretrial release to impose less restrictive conditions pursuant to 725 ILCS 5/110-5;

3. In the alternative, vacate any order of pretrial detention as the State has not met its burden of proving by clear and convincing evidence that detention is necessary pursuant to 725 ILCS 5/110-6.1;

4. Consider the Defendant's ties to the community, employment, and circumstances as required by statute;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing 725 ILCS 5/110 and the Pretrial Fairness Act",
  },

  // Signature block same as base
  baseSections[8],

  // IL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ILLINOIS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

STATE OF ILLINOIS
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Illinois that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Illinois.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Illinois-specific certificate of service format",
  },
];

// ============================================================================
// IL Federal Sections (Seventh Circuit)
// ============================================================================

const ilFederalSections: TemplateSection[] = [
  ...ilBaseSections,

  // Federal statement of facts (Seventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Illinois (Seventh Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Seventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention \u2014 rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Seventh Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Seventh Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Seventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Seventh Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (IL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Ohio State Sections
// ============================================================================

const ohioSections: TemplateSection[] = [
  ...ohBaseSections,

  // OH statement of facts (Ohio Crim.R. 46; ORC \u00A7 2937.222)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Ohio Criminal Rule 46 and ORC \u00A7 2937.222 in an Ohio criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under Ohio law, Ohio Crim.R. 46 governs bail in criminal cases. Ohio uses a bail schedule combined with judicial discretion. ORC \u00A7 2937.222 addresses denial of bail for certain offenses. The court must consider factors including nature of offense, weight of evidence, financial ability, character, and community ties.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Address the bail schedule and judicial discretion factors through the factual narrative

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for an Ohio bail reduction motion. Reference Ohio Crim.R. 46 and bail schedule context. Present facts chronologically.",
    helpText: "AI will generate an Ohio-specific statement of facts",
  },

  // OH legal argument (Ohio Crim.R. 46; ORC \u00A7 2937.222)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under Ohio law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Ohio law includes:
- Ohio Crim.R. 46: Bail \u2014 governs bail in criminal cases; court shall consider nature and circumstances of the offense, weight of evidence, financial ability to give bail, character and community ties
- ORC \u00A7 2937.222: Denial of bail for certain offenses \u2014 bail may be denied for specific serious offenses where proof is evident or presumption great
- ORC \u00A7 2937.23: Amount of bail \u2014 bail shall be set at an amount reasonably calculated to ensure appearance; court must consider financial ability
- OH Const. Art. I, \u00A7 9: All persons shall be bailable by sufficient sureties, except for capital offenses where proof is evident or presumption great; excessive bail shall not be required
- DuBose v. McGuffey: Ohio bail reform \u2014 addresses constitutional concerns with money bail and the impact on indigent defendants

Generate 3-5 paragraphs that:
1. Cite Ohio Crim.R. 46 and ORC \u00A7 2937.222 as the statutory basis
2. Apply the Ohio Crim.R. 46 factors (nature of offense, weight of evidence, financial ability, character, community ties)
3. Argue the current bail is excessive under OH Const. Art. I, \u00A7 9 and the Eighth Amendment
4. Cite DuBose v. McGuffey and argue that money bail that results in detention due to inability to pay raises constitutional concerns
5. Propose specific alternative conditions of release

Use proper Ohio legal citation format (e.g., "Ohio Crim.R. 46").`,
    aiInstructions: "Must cite Ohio Crim.R. 46, ORC \u00A7\u00A7 2937.222, 2937.23, OH Const. Art. I, \u00A7 9, and DuBose v. McGuffey. Use Ohio citation format.",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  // OH prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio Criminal Rule 46 and ORC \u00A7 2937.222 to:

1. Reduce the current bail to a reasonable amount that the Defendant can afford, consistent with the Eighth Amendment to the United States Constitution and Article I, Section 9 of the Ohio Constitution;

2. In the alternative, release the Defendant on recognizance or personal bond with appropriate conditions of release pursuant to Ohio Crim.R. 46;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community, considering the factors set forth in Ohio Crim.R. 46;

4. Consider the Defendant's financial ability to post bail as required by ORC \u00A7 2937.23;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing Ohio Crim.R. 46 and ORC \u00A7 2937.222",
  },

  // Signature block same as base
  baseSections[8],

  // OH certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OHIO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

STATE OF OHIO
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Ohio that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Ohio.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Ohio-specific certificate of service format",
  },
];

// ============================================================================
// OH Federal Sections (Sixth Circuit)
// ============================================================================

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  // Federal statement of facts (Sixth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Ohio (Sixth Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention \u2014 rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Sixth Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Sixth Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Sixth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Sixth Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (OH)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Georgia State Sections
// ============================================================================

const georgiaSections: TemplateSection[] = [
  ...gaBaseSections,

  // GA statement of facts (O.C.G.A. \u00A7 17-6-1)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under O.C.G.A. \u00A7 17-6-1 in a Georgia criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Note: Under Georgia law, O.C.G.A. \u00A7 17-6-1 governs bail in felony cases. The superior court has discretion to set bail in most cases. O.C.G.A. \u00A7 17-6-12 sets forth the factors the court must consider in determining bail amount.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail was set and at what amount
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Address the superior court's discretion and bail factors through the factual narrative

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a Georgia bail reduction motion. Reference O.C.G.A. \u00A7 17-6-1 and superior court discretion context. Present facts chronologically.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  // GA legal argument (O.C.G.A. \u00A7 17-6-1)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for bail reduction under Georgia law.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable Georgia law includes:
- O.C.G.A. \u00A7 17-6-1: Bail in felony cases \u2014 offenses bailable; procedure; schedule of bails; superior court discretion to set bail in most cases
- O.C.G.A. \u00A7 17-6-12: Factors for bail determination \u2014 court shall consider the nature and circumstances of the offense, weight of evidence, defendant's family ties, employment, financial resources, character and mental condition, length of residence in community, criminal record, record of appearance at court proceedings, whether at time of arrest defendant was on probation/parole, and any other relevant factors
- GA Const. Art. I, \u00A7 I, Para. XVII: Excessive bail shall not be required
- Ayala v. State: Georgia bail factors \u2014 court must consider all statutory factors; bail set without consideration of relevant factors constitutes abuse of discretion

Generate 3-5 paragraphs that:
1. Cite O.C.G.A. \u00A7 17-6-1 as the statutory basis for bail in felony cases
2. Apply the O.C.G.A. \u00A7 17-6-12 factors to the facts (nature of offense, evidence, family ties, employment, financial resources, character, residence, criminal record, court appearances, probation/parole status)
3. Argue the current bail is excessive under GA Const. Art. I, \u00A7 I, Para. XVII and the Eighth Amendment
4. Cite Ayala v. State and argue that failure to consider all statutory factors is an abuse of discretion
5. Propose specific alternative conditions of release

Use proper Georgia legal citation format (e.g., "O.C.G.A. \u00A7 17-6-1").`,
    aiInstructions: "Must cite O.C.G.A. \u00A7\u00A7 17-6-1, 17-6-12, GA Const. Art. I, \u00A7 I, Para. XVII, and Ayala v. State. Use Georgia citation format.",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  // GA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. \u00A7 17-6-1 to:

1. Reduce the current bail to a reasonable amount that the Defendant can afford, consistent with the Eighth Amendment to the United States Constitution and Article I, Section I, Paragraph XVII of the Georgia Constitution;

2. In the alternative, release the Defendant on recognizance or personal bond with appropriate conditions of release;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community, considering all factors set forth in O.C.G.A. \u00A7 17-6-12;

4. Consider the Defendant's financial resources and ability to post bail as required by O.C.G.A. \u00A7 17-6-12;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing O.C.G.A. \u00A7 17-6-1",
  },

  // Signature block same as base
  baseSections[8],

  // GA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF GEORGIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

STATE OF GEORGIA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Georgia that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Georgia.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Georgia-specific certificate of service format",
  },
];

// ============================================================================
// GA Federal Sections (Eleventh Circuit)
// ============================================================================

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  // Federal statement of facts (Eleventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail/bond reduction in a federal criminal matter in the District of Georgia (Eleventh Circuit).

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}
- Prior Bail Requests: {{priorBailRequests}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health: {{mentalHealthTreatment}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 18 U.S.C. \u00A7 3142 (Bail Reform Act), the court must consider the nature and circumstances of the offense, the weight of the evidence, the history and characteristics of the person, and the nature and seriousness of the danger to the community.

Generate 3-4 paragraphs that:
1. Describe the procedural history including when bail/detention was set
2. Present the defendant's background, ties to the community, and employment
3. Detail the defendant's financial circumstances and inability to afford current bail
4. Describe any changed circumstances since bail was originally set

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal bail reduction motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for bail/bond reduction under the Bail Reform Act.

Current Bail Amount: {{currentBailAmount}}
Charges: {{charges}}
Charge Level: {{chargeLevel}}
Employment Status: {{employmentStatus}}
Residence Status: {{residenceStatus}}
Criminal History: {{criminalHistory}}
Income: {{defendantIncome}}
Inability to Pay: {{abilityToPayExplanation}}
Proposed Alternative: {{proposedAlternative}}
Proposed Amount: {{proposedBailAmount}}
Flight Risk Factors: {{flightRiskFactors}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3142: Release or detention of a defendant pending trial (Bail Reform Act)
- 18 U.S.C. \u00A7 3142(b): Release on personal recognizance or unsecured bond
- 18 U.S.C. \u00A7 3142(c): Release on conditions
- 18 U.S.C. \u00A7 3142(e): Detention \u2014 rebuttable presumption for certain offenses (drug offenses with 10+ year max, firearms offenses, etc.)
- 18 U.S.C. \u00A7 3142(g): Factors to be considered (nature of offense, weight of evidence, history/characteristics of person, danger to community)
- 18 U.S.C. \u00A7 3145(b): Review of detention order by district court
- United States v. Salerno, 481 U.S. 739 (1987): Bail Reform Act is facially valid; detention must be based on clear and convincing evidence of danger or flight risk
- Eleventh Circuit precedent on pretrial release

Generate 3-5 paragraphs that:
1. Cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b) as the statutory basis
2. Analyze the \u00A7 3142(g) factors (nature of offense, weight of evidence, history/characteristics, danger to community)
3. If applicable, address the rebuttable presumption under \u00A7 3142(e)(3) and show it has been rebutted
4. Argue that conditions of release under \u00A7 3142(c) can reasonably assure appearance and community safety
5. Cite United States v. Salerno and relevant Eleventh Circuit precedent

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3142").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7\u00A7 3142, 3145(b), United States v. Salerno, and Eleventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief (Eleventh Circuit)
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. \u00A7\u00A7 3142 and 3145(b) to:

1. Reduce the current bail/bond to an amount that the Defendant can reasonably afford, consistent with the Eighth Amendment prohibition against excessive bail and the Bail Reform Act's preference for the least restrictive conditions;

2. In the alternative, release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. \u00A7 3142(b);

3. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. \u00A7 3142(c), including any combination of conditions reasonably necessary to assure the Defendant's appearance and the safety of the community;

4. Consider the factors set forth in 18 U.S.C. \u00A7 3142(g) in determining appropriate conditions of release;

5. Grant a hearing on this motion;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  // Signature block same as base
  baseSections[8],

  // Federal certificate of service (GA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR BOND/BAIL REDUCTION on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the United States that the foregoing is true and correct.

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Template Definition
// ============================================================================

export const motionToReduceBailTemplate: DocumentTemplate = {
  id: "motion-to-reduce-bail",
  name: "Motion for Bond/Bail Reduction",
  category: "criminal",
  description: "Move to reduce bail or bond amount based on the defendant's financial circumstances, community ties, and constitutional protections against excessive bail. This motion argues that the current bail is excessive under the Eighth Amendment and applicable state law, and proposes alternative conditions of release.",
  version: "1.0.0",
  lastUpdated: new Date("2024-01-25"),
  baseSections,
  jurisdictionVariants: [
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "Filed under Cal. Penal Code \u00A7\u00A7 1275, 1270.1. In re Humphrey (2021) 11 Cal.5th 135 requires courts to consider ability to pay. California courts require line numbers in the left margin.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: caFederalSections,
      courtSpecificRules: "CACD L.R. 11-3: 14pt font required. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Ninth Circuit precedent applies.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: caFederalSections,
      courtSpecificRules: "N.D. Cal.: 14pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Ninth Circuit precedent applies.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: caFederalSections,
      courtSpecificRules: "E.D. Cal. L.R. 130(b): 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Ninth Circuit precedent applies.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: caFederalSections,
      courtSpecificRules: "S.D. Cal.: 14pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Ninth Circuit precedent applies.",
    },
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: newYorkSections,
      courtSpecificRules: "Filed under CPL \u00A7\u00A7 510.10-510.50. 2020 Bail Reform mandates release for most misdemeanors and nonviolent felonies. Court must apply \"least restrictive\" standard.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "S.D.N.Y.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Second Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "E.D.N.Y.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Second Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "N.D.N.Y.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Second Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "W.D.N.Y.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Second Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: texasSections,
      courtSpecificRules: "Filed under Tex. Code Crim. Proc. Art. 17.15. Tex. Const. Art. I, \u00A7\u00A7 11, 13. Ex parte Rubac six-factor test applies. 14pt font required. E-filing via eFileTexas.gov mandatory.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "N.D. Tex.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Fifth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "S.D. Tex.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Fifth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "E.D. Tex.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Fifth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "W.D. Tex.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Fifth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: floridaSections,
      courtSpecificRules: "Filed under Fla. R. Crim. P. 3.131 and Fla. Stat. \u00A7 903.046. Arthur hearing required for capital/life felony cases (Arthur v. State, 390 So. 2d 717 (Fla. 1980)). 12pt font. E-filing via Florida Courts E-Filing Portal mandatory.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "S.D. Fla.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "M.D. Fla.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "N.D. Fla.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: pennsylvaniaSections,
      courtSpecificRules: "Filed under Pa.R.Crim.P. 520, 524, 525. Commonwealth v. Truesdale 10-factor bail test applies. PA Const. Art. I, \u00A7 14. E-filing via PACFile mandatory.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "E.D. Pa.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Third Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "M.D. Pa.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Third Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "W.D. Pa.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Third Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: illinoisSections,
      courtSpecificRules: "Filed under 725 ILCS 5/110. 2023 Pretrial Fairness Act eliminated cash bail for most offenses. IL Const. Art. I, \u00A7 9. Presumption of pretrial release.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "N.D. Ill.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Seventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "C.D. Ill.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Seventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "S.D. Ill.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Seventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohioSections,
      courtSpecificRules: "Filed under Ohio Crim.R. 46 and ORC \u00A7 2937.222. OH Const. Art. I, \u00A7 9. Bail schedule plus judicial discretion. DuBose v. McGuffey bail reform precedent.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "N.D. Ohio: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Sixth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "S.D. Ohio: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Sixth Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: georgiaSections,
      courtSpecificRules: "Filed under O.C.G.A. \u00A7 17-6-1. GA Const. Art. I, \u00A7 I, Para. XVII. O.C.G.A. \u00A7 17-6-12 bail factors. Superior court discretion. Ayala v. State bail factors precedent.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "N.D. Ga.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "M.D. Ga.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "S.D. Ga.: 12pt font. Filed under 18 U.S.C. \u00A7\u00A7 3142, 3145(b). Eleventh Circuit precedent applies. CM/ECF electronic filing required.",
    },
  ],
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD"],
};

export default motionToReduceBailTemplate;
