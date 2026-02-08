/**
 * Motion for Bond/Bail Reduction Template
 *
 * Criminal law document template for requesting reduction of bail or bond amount.
 * Argues for reduced bail based on defendant's financial circumstances, community ties,
 * and constitutional protections against excessive bail.
 * Includes jurisdiction-specific variants (CA, NY, TX, FL) and federal court variants.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";


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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
// NC-specific caption inputs (same fields but with NC counties)
// ============================================================================

const ncCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of [County], North Carolina" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-CRS-XXXXX" }
    : input
);

const ncBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ncCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MI-specific caption inputs (same fields but with MI counties)
// ============================================================================

const miCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Circuit Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-XXXXXX-FH" }
    : input
);

const miBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: miCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// NJ-specific caption inputs (same fields but with NJ counties)
// ============================================================================

const njCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of New Jersey, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XXXXXX" }
    : input
);

const njBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: njCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// VA-specific caption inputs (same fields but with VA counties)
// ============================================================================

const vaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County/City], Virginia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CRXXXXX-XX" }
    : input
);

const vaBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: vaCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// WA-specific caption inputs (same fields but with WA counties)
// ============================================================================

const waCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Washington, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-X-XXXXX-X" }
    : input
);

const waBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: waCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// AZ-specific caption inputs (same fields but with AZ counties)
// ============================================================================

const azCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Arizona, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-YYYY-XXXXXX" }
    : input
);

const azBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: azCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MA-specific caption inputs (same fields but with MA counties)
// ============================================================================

const maCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CRXXXXXX" }
    : input
);

const maBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: maCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// TN-specific caption inputs (same fields but with TN counties)
// ============================================================================

const tnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Criminal Court of [County], Tennessee" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-X-XXXXX" }
    : input
);

const tnBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: tnCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// IN-specific caption inputs (same fields but with IN counties)
// ============================================================================

const inCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior/Circuit Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-FXXXXXX" }
    : input
);

const inBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: inCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MD-specific caption inputs (same fields but with MD counties)
// ============================================================================

const mdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court for [County], Maryland" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXX-K-XX-XXXXXX" }
    : input
);

const mdBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: mdCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MO-specific caption inputs (same fields but with MO counties)
// ============================================================================

const moCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Missouri" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CRXXXXX" }
    : input
);

const moBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: moCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// WI-specific caption inputs (same fields but with WI counties)
// ============================================================================

const wiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Wisconsin" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXXX" }
    : input
);

const wiBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: wiCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// CO-specific caption inputs (same fields but with CO counties)
// ============================================================================

const coCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County], Colorado" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
    : input
);

const coBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: coCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MN-specific caption inputs (same fields but with MN counties)
// ============================================================================

const mnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County], Minnesota" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XX-XXXXX" }
    : input
);

const mnBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: mnCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// SC-specific caption inputs (same fields but with SC counties)
// ============================================================================

const scCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of General Sessions, [County], South Carolina" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-GS-XX-XXXXX" }
    : input
);

const scBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: scCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// AL-specific caption inputs (same fields but with AL counties)
// ============================================================================

const alCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Alabama" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CC-XXXX-XXXXXX" }
    : input
);

const alBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: alCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// LA-specific caption inputs (same fields but with LA parishes)
// ============================================================================

const laCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [Judicial District] District Court, Parish of [Parish], Louisiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXXXX" }
    : input
);

const laBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: laCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// KY-specific caption inputs (same fields but with KY counties)
// ============================================================================

const kyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Circuit Court, Kentucky" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXXX" }
    : input
);

const kyBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: kyCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// OR-specific caption inputs (same fields but with OR counties)
// ============================================================================

const orCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Oregon" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXXX" }
    : input
);

const orBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: orCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// OK-specific caption inputs (same fields but with OK counties)
// ============================================================================

const okCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County], Oklahoma" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CF-XXXX-XXXXX" }
    : input
);

const okBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: okCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// CT-specific caption inputs
// ============================================================================

const ctCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Judicial District of [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXX-CR-XX-XXXXXXX" }
    : input
);

const ctBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ctCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// UT-specific caption inputs
// ============================================================================

const utCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, State of Utah" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXXX-XXXX" }
    : input
);

const utBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: utCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// IA-specific caption inputs
// ============================================================================

const iaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Iowa District Court for [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXCR-XXXXXX" }
    : input
);

const iaBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: iaCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// NV-specific caption inputs
// ============================================================================

const nvCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, State of Nevada" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXXX" }
    : input
);

const nvBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: nvCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// AR-specific caption inputs
// ============================================================================

const arCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, State of Arkansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXX" }
    : input
);

const arBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: arCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// MS-specific caption inputs
// ============================================================================

const msCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, State of Mississippi" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XX-XXXX-CR" }
    : input
);

const msBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: msCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// KS-specific caption inputs
// ============================================================================

const ksCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, State of Kansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXCR-XXXX" }
    : input
);

const ksBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ksCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// NM-specific caption inputs
// ============================================================================

const nmCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, State of New Mexico" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., D-XXX-CR-XXXX-XXXXX" }
    : input
);

const nmBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: nmCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// NE-specific caption inputs
// ============================================================================

const neCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, State of Nebraska" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR XX-XXXX" }
    : input
);

const neBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: neCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// ID-specific caption inputs
// ============================================================================

const idCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of the [Number] Judicial District, [County] County, State of Idaho" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XX-XXXXX" }
    : input
);

const idBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: idCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1], // currentBailInfo
  baseSections[2], // defendantBackground
  baseSections[3], // financialInfo
  baseSections[4], // hearingInfo
];

// ============================================================================
// AK-specific caption inputs
// ============================================================================

const akCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Third Judicial District at Anchorage" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., 3AN-XX-XXXXX CR" }
    : input
);

const akBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: akCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// DE-specific caption inputs
// ============================================================================

const deCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of the State of Delaware, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., ID No. XXXX-XX-XXXX" }
    : input
);

const deBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: deCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// HI-specific caption inputs
// ============================================================================

const hiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the First Circuit, State of Hawaii" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., X-CPC-XX-XXXXXXX" }
    : input
);

const hiBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: hiCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// ME-specific caption inputs
// ============================================================================

const meCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County], State of Maine" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXX-CR-XXXX-XXXXX" }
    : input
);

const meBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: meCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MT-specific caption inputs
// ============================================================================

const mtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [Number] Judicial District, [County] County, Montana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., DC-XX-XXXX" }
    : input
);

const mtBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: mtCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// NH-specific caption inputs
// ============================================================================

const nhCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County], New Hampshire" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXX-XXXX-CR-XXXXX" }
    : input
);

const nhBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: nhCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// ND-specific caption inputs
// ============================================================================

const ndCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County], State of North Dakota" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXXX-CR-XXXXX" }
    : input
);

const ndBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: ndCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// RI-specific caption inputs
// ============================================================================

const riCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of [County], State of Rhode Island" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXXX-XXXXX" }
    : input
);

const riBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: riCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// SD-specific caption inputs
// ============================================================================

const sdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [Number] Judicial Circuit, [County] County, South Dakota" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXX" }
    : input
);

const sdBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: sdCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// VT-specific caption inputs
// ============================================================================

const vtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] Unit, Criminal Division" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XXXX-XXcr" }
    : input
);

const vtBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: vtCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// WV-specific caption inputs
// ============================================================================

const wvCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, West Virginia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-F-XXX" }
    : input
);

const wvBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: wvCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// WY-specific caption inputs
// ============================================================================

const wyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [Number] Judicial District, [County] County, Wyoming" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XXXX" }
    : input
);

const wyBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: wyCaptionInputs,
    required: true,
    helpText: "Enter the court and case information for the document caption",
  },
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
// North Carolina State Sections
// ============================================================================

const northCarolinaSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under N.C. Gen. Stat. § 15A-534 in a North Carolina criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under N.C. Gen. Stat. § 15A-534, courts must consider the nature of the offense, defendant's ties to the community, financial resources, and risk of flight.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a North Carolina bail reduction motion.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under N.C. Gen. Stat. § 15A-534.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable North Carolina law includes:
- N.C. Gen. Stat. § 15A-534: Conditions of pretrial release
- NC Const. Art. I, § 27: Right to bail
- State v. Thompson, 349 N.C. 483 (1998): Factors for bail determination

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite N.C. Gen. Stat. § 15A-534 and NC Constitution.",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C. Gen. Stat. § 15A-534 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for supervised release, electronic monitoring, or other conditions that adequately protect the public and ensure Defendant's appearance;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NORTH CAROLINA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "North Carolina certificate of service format",
  },
];

const ncFederalSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of North Carolina.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Fourth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Michigan State Sections
// ============================================================================

const michiganSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under MCR 6.106 and MCL 765.6 in a Michigan criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under MCR 6.106, courts must consider factors including ties to community, employment, and ability to post bond.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Michigan bail reduction motion.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under MCR 6.106.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Community Ties: {{familyTies}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Michigan law includes:
- MCR 6.106: Bail
- MCL 765.6: Conditions of release
- MI Const. Art. I, § 15: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite MCR 6.106 and MCL 765.6.",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCR 6.106 to:

1. Reduce the current bail to a reasonable amount;

2. In the alternative, modify the conditions of release;

3. Grant such other relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MICHIGAN
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Michigan certificate of service format",
  },
];

const miFederalSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Michigan.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Apply Sixth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to revoke or amend the current detention order and release Defendant on reasonable conditions.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Jersey State Sections
// ============================================================================

const newJerseySections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion under N.J. Ct. R. 3:26 in a New Jersey criminal matter.

Note: New Jersey largely eliminated cash bail under the Criminal Justice Reform Act (CJRA) in 2017. Most defendants are released on conditions or detained pretrial based on risk assessment.

Current Status:
- Current Conditions: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Residence: {{residenceStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Generate 3-4 paragraphs presenting facts under the CJRA framework.`,
    aiInstructions: "Generate a factual narrative for a New Jersey bail motion under CJRA.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under N.J. Ct. R. 3:26.

New Jersey law under the Criminal Justice Reform Act (CJRA) focuses on:
- Risk assessment rather than cash bail
- Least restrictive conditions to ensure appearance
- Public safety factors

Applicable law includes:
- N.J. Ct. R. 3:26: Pretrial detention and release
- N.J.S.A. 2A:162-15 through 26: Criminal Justice Reform Act

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite N.J. Ct. R. 3:26 and CJRA provisions.",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J. Ct. R. 3:26 to:

1. Release Defendant on the least restrictive conditions necessary to ensure appearance;

2. In the alternative, modify the current conditions of release;

3. Grant such other relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By eCourts
[ ] By mail
[ ] By personal service

STATE OF NEW JERSEY
c/o County Prosecutor
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New Jersey certificate of service format",
  },
];

const njFederalSections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of New Jersey.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Apply Third Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Virginia State Sections
// ============================================================================

const virginiaSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Va. Code § 19.2-120 in a Virginia criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Residence: {{residenceStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Under Va. Code § 19.2-120, courts consider nature of offense, ties to community, and ability to pay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Virginia bail reduction motion.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Va. Code § 19.2-120.

Applicable Virginia law includes:
- Va. Code § 19.2-120: Admission to bail
- VA Const. Art. I, § 9: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Va. Code § 19.2-120.",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Va. Code § 19.2-120 to reduce the current bail and release Defendant on reasonable conditions.`,
    helpText: "Virginia prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

COMMONWEALTH OF VIRGINIA
c/o Commonwealth's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Virginia certificate of service format",
  },
];

const vaFederalSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Virginia.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Fourth Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Washington State Sections
// ============================================================================

const washingtonSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under CrR 3.2 in a Washington criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Under CrR 3.2, courts must consider the least restrictive conditions to ensure appearance and public safety.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Washington bail modification motion.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under CrR 3.2.

Applicable Washington law includes:
- CrR 3.2: Release of accused
- WA Const. Art. I, § 20: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite CrR 3.2 and WA Constitution.",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CrR 3.2 to modify the conditions of release and release Defendant on the least restrictive conditions necessary.`,
    helpText: "Washington prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties.

STATE OF WASHINGTON
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Washington certificate of service format",
  },
];

const waFederalSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Washington.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Ninth Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arizona State Sections
// ============================================================================

const arizonaSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under Ariz. R. Crim. P. 7.2, 7.3 and A.R.S. § 13-3961 in an Arizona criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Under Arizona law, courts must consider release on least restrictive conditions.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Arizona bail modification motion.",
    helpText: "AI will generate an Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under Ariz. R. Crim. P. 7.2, 7.3.

Applicable Arizona law includes:
- Ariz. R. Crim. P. 7.2, 7.3: Release conditions
- A.R.S. § 13-3961: Bail factors
- AZ Const. Art. II, § 22: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 7.2, 7.3 and A.R.S. § 13-3961.",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ariz. R. Crim. P. 7.2, 7.3 to modify the conditions of release.`,
    helpText: "Arizona prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties.

STATE OF ARIZONA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Arizona certificate of service format",
  },
];

const azFederalSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Arizona.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Ninth Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Massachusetts State Sections
// ============================================================================

const massachusettsSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Mass. R. Crim. P. 7 in a Massachusetts criminal matter.

Note: Under Brangan v. Commonwealth (2018), Massachusetts courts must consider ability to pay when setting bail.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Inability to Pay: {{abilityToPayExplanation}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts bail reduction motion referencing Brangan factors.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under Mass. R. Crim. P. 7.

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 7: Bail
- Brangan v. Commonwealth, 477 Mass. 691 (2018): Ability to pay analysis
- MA Const. Part I, Art. XXVI: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Mass. R. Crim. P. 7 and Brangan v. Commonwealth.",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. R. Crim. P. 7 and Brangan v. Commonwealth to reduce the current bail to an amount Defendant can afford.`,
    helpText: "Massachusetts prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties.

COMMONWEALTH OF MASSACHUSETTS
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Massachusetts certificate of service format",
  },
];

const maFederalSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Massachusetts.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply First Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Tennessee State Sections
// ============================================================================

const tennesseeSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under Tenn. R. Crim. P. 46 in a Tennessee criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Under Tenn. R. Crim. P. 46, courts consider ties to community and ability to pay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Tennessee bail modification motion.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under Tenn. R. Crim. P. 46.

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 46: Release from custody
- TN Const. Art. I, § 15: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 46.",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Crim. P. 46 to reduce the current bail.`,
    helpText: "Tennessee prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties.

STATE OF TENNESSEE
c/o District Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Tennessee certificate of service format",
  },
];

const tnFederalSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Tennessee.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Sixth Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Indiana State Sections
// ============================================================================

const indianaSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under IC 35-33-8 and Ind. R. Crim. P. 26 in an Indiana criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Under Indiana law, courts must consider ability to pay and community ties.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Indiana bail modification motion.",
    helpText: "AI will generate an Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under IC 35-33-8.

Applicable Indiana law includes:
- IC 35-33-8: Bail
- Ind. R. Crim. P. 26: Bail
- IN Const. Art. I, § 17: Right to bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite IC 35-33-8 and Ind. R. Crim. P. 26.",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to IC 35-33-8 to reduce the current bail.`,
    helpText: "Indiana prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties.

STATE OF INDIANA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Indiana certificate of service format",
  },
];

const inFederalSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Indiana.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Seventh Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maryland State Sections
// ============================================================================

const marylandSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under Md. Rule 4-216.1 in a Maryland criminal matter.

Note: Maryland implemented bail reform in 2017 emphasizing release on least restrictive conditions.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Under Md. Rule 4-216.1, courts must consider release on least restrictive conditions.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Maryland bail modification motion.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion under Md. Rule 4-216.1.

Applicable Maryland law includes:
- Md. Rule 4-216.1: Pretrial release
- MD Const. Decl. of Rights, Art. 25: Right to bail
- 2017 Maryland bail reform

Generate 3-5 paragraphs arguing for modified conditions.`,
    aiInstructions: "Must cite Md. Rule 4-216.1.",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 4-216.1 to release Defendant on the least restrictive conditions necessary.`,
    helpText: "Maryland prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy on all parties:

[ ] By MDEC
[ ] By mail
[ ] By personal service

STATE OF MARYLAND
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Maryland certificate of service format",
  },
];

const mdFederalSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention in the District of Maryland.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention.

Apply Fourth Circuit precedent on detention review.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant moves this Court to revoke or amend the current detention order.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Missouri State Sections
// ============================================================================

const missouriSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Mo. Sup. Ct. R. 33.01 and RSMo § 544.455 in a Missouri criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Mo. Sup. Ct. R. 33.01, courts must consider the nature of the offense, defendant's ties to the community, financial resources, and risk of flight.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Missouri bail reduction motion.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Missouri law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Missouri law includes:
- Mo. Sup. Ct. R. 33.01: Bail factors including nature of offense, weight of evidence, defendant's employment, family ties, and financial ability
- RSMo § 544.455: Conditions of release
- Mo. Const. Art. I, § 20: Right to bail
- State v. Bolden, 371 S.W.3d 802 (Mo. 2012): Purpose of bail is to ensure appearance

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Mo. Sup. Ct. R. 33.01 and RSMo § 544.455.",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mo. Sup. Ct. R. 33.01 and RSMo § 544.455 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for supervised release, electronic monitoring, or other conditions that adequately protect the public and ensure Defendant's appearance;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MISSOURI
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Missouri certificate of service format",
  },
];

const moFederalSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Missouri.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wisconsin State Sections
// ============================================================================

const wisconsinSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail modification under Wis. Stat. § 969.01 and SCR 69.03 in a Wisconsin criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Wis. Stat. § 969.01, courts must consider factors to ensure appearance while using least restrictive conditions.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin bail modification motion.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to modify bail under Wisconsin law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Wisconsin law includes:
- Wis. Stat. § 969.01: Eligibility for release, conditions of release
- SCR 69.03: Pretrial release criteria
- Wis. Const. Art. I, § 8: Right to bail
- State v. Whitty, 149 Wis.2d 707 (1989): Purpose of bail

Generate 3-5 paragraphs arguing for bail modification.`,
    aiInstructions: "Must cite Wis. Stat. § 969.01 and SCR 69.03.",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 969.01 and SCR 69.03 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to the least restrictive conditions necessary to ensure Defendant's appearance;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By eFiling
[ ] By mail
[ ] By personal service

STATE OF WISCONSIN
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Wisconsin certificate of service format",
  },
];

const wiFederalSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Wisconsin.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Seventh Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Colorado State Sections
// ============================================================================

const coloradoSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Colo. R. Crim. P. 46 and C.R.S. § 16-4-101 in a Colorado criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Colo. R. Crim. P. 46 and C.R.S. § 16-4-101, courts must consider nature of offense, defendant's ties to community, and ability to make bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Colorado bail reduction motion.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Colorado law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Colorado law includes:
- Colo. R. Crim. P. 46: Bail and bond
- C.R.S. § 16-4-101 et seq.: Bail statutes
- Colo. Const. Art. II, § 19: Right to bail
- People v. Briceno, 2019 CO 49: Considerations for bail determination

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Colo. R. Crim. P. 46 and C.R.S. § 16-4-101.",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Colo. R. Crim. P. 46 and C.R.S. § 16-4-101 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance, supervised release, or other appropriate conditions;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By ICCES electronic filing
[ ] By mail
[ ] By personal service

PEOPLE OF THE STATE OF COLORADO
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Colorado certificate of service format",
  },
];

const coFederalSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Colorado.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Minnesota State Sections
// ============================================================================

const minnesotaSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Minn. R. Crim. P. 6.02 in a Minnesota criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Minn. R. Crim. P. 6.02, courts must consider the least restrictive conditions to ensure appearance.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Minnesota bail reduction motion.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Minnesota law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 6.02: Pretrial release criteria
- Minn. Const. Art. I, § 7: Right to bail
- State v. Brooks, 604 N.W.2d 345 (Minn. 2000): Purpose of bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Minn. R. Crim. P. 6.02.",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Crim. P. 6.02 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, release Defendant on the least restrictive conditions necessary to ensure appearance;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By eFS electronic filing
[ ] By mail
[ ] By personal service

STATE OF MINNESOTA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Minnesota certificate of service format",
  },
];

const mnFederalSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Minnesota.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Carolina State Sections
// ============================================================================

const southCarolinaSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under S.C. R. Crim. P. 4 and S.C. Code § 17-15-10 in a South Carolina criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under S.C. Code § 17-15-10, courts consider the nature of offense, ties to community, employment, and financial ability.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a South Carolina bail reduction motion.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under South Carolina law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable South Carolina law includes:
- S.C. R. Crim. P. 4: Bail proceedings
- S.C. Code § 17-15-10 et seq.: Bail provisions
- S.C. Const. Art. I, § 15: Right to bail
- State v. Drayton, 293 S.C. 417 (1987): Bail considerations

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite S.C. R. Crim. P. 4 and S.C. Code § 17-15-10.",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C. R. Crim. P. 4 and S.C. Code § 17-15-10 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF SOUTH CAROLINA
c/o Solicitor
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "South Carolina certificate of service format",
  },
];

const scFederalSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of South Carolina.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Fourth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alabama State Sections
// ============================================================================

const alabamaSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Ala. R. Crim. P. 7.2, 7.3 and Ala. Code § 15-13-3 in an Alabama criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Ala. R. Crim. P. 7.2 and 7.3, courts must consider nature of offense, defendant's ties to community, and financial ability.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Alabama bail reduction motion.",
    helpText: "AI will generate an Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Alabama law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 7.2: Pretrial release
- Ala. R. Crim. P. 7.3: Conditions of release
- Ala. Code § 15-13-3: Right to bail
- Ala. Const. Art. I, § 16: Right to bail
- Ex parte Johnson, 620 So. 2d 665 (Ala. 1993): Bail considerations

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Ala. R. Crim. P. 7.2, 7.3 and Ala. Code § 15-13-3.",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Crim. P. 7.2, 7.3 and Ala. Code § 15-13-3 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By AlaFile electronic filing
[ ] By mail
[ ] By personal service

STATE OF ALABAMA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Alabama certificate of service format",
  },
];

const alFederalSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Alabama.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eleventh Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Louisiana State Sections
// ============================================================================

const louisianaSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under La. C.Cr.P. art. 316, 317 in a Louisiana criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under La. C.Cr.P. art. 316 and 317, courts must consider the seriousness of the offense, defendant's prior criminal record, and ability to give bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Louisiana bail reduction motion.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Louisiana law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Louisiana law includes:
- La. C.Cr.P. art. 316: Bail before and after conviction
- La. C.Cr.P. art. 317: Factors in fixing bail
- La. Const. Art. I, § 18: Right to bail
- State v. Wheeler, 2016-0680 (La. 6/29/17): Bail considerations

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite La. C.Cr.P. art. 316, 317.",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. C.Cr.P. art. 316, 317 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF LOUISIANA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Louisiana certificate of service format",
  },
];

const laFederalSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Louisiana.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Fifth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kentucky State Sections
// ============================================================================

const kentuckySections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Ky. R. Crim. P. 4.00 and KRS 431.015 in a Kentucky criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Ky. R. Crim. P. 4.00 and KRS 431.015, courts must consider nature of offense, ties to community, and ability to give bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Kentucky bail reduction motion.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Kentucky law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Kentucky law includes:
- Ky. R. Crim. P. 4.00: Pretrial release procedures
- KRS 431.015: Pretrial release
- Ky. Const. § 16: Right to bail
- Commonwealth v. Hicks, 130 S.W.3d 306 (Ky. 2004): Bail considerations

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Ky. R. Crim. P. 4.00 and KRS 431.015.",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ky. R. Crim. P. 4.00 and KRS 431.015 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By eFiling
[ ] By mail
[ ] By personal service

COMMONWEALTH OF KENTUCKY
c/o Commonwealth's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Kentucky certificate of service format",
  },
];

const kyFederalSections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Kentucky.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Sixth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oregon State Sections
// ============================================================================

const oregonSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under ORS 135.230-.290 and UTCR 4.060 in an Oregon criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under ORS 135.230-.290, courts must consider release agreements and the least restrictive conditions.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Oregon bail reduction motion.",
    helpText: "AI will generate an Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Oregon law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Oregon law includes:
- ORS 135.230-.290: Release agreements and security
- UTCR 4.060: Release agreements
- Or. Const. Art. I, § 14: Right to bail
- State v. Delgado, 323 Or. 246 (1996): Purpose of bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite ORS 135.230-.290 and UTCR 4.060.",
    helpText: "AI will generate Oregon-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ORS 135.230-.290 and UTCR 4.060 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the release agreement to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By File & Serve
[ ] By mail
[ ] By personal service

STATE OF OREGON
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Oregon certificate of service format",
  },
];

const orFederalSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Oregon.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oklahoma State Sections
// ============================================================================

const oklahomaSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under 22 O.S. § 1101 and Okla. Ct. Crim. App. R. 4.6 in an Oklahoma criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 22 O.S. § 1101 and Okla. Ct. Crim. App. R. 4.6, courts must consider nature of offense, defendant's ties, and ability to make bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Oklahoma bail reduction motion.",
    helpText: "AI will generate an Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Oklahoma law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Oklahoma law includes:
- 22 O.S. § 1101 et seq.: Bail provisions
- Okla. Ct. Crim. App. R. 4.6: Bail procedures
- Okla. Const. Art. II, § 8: Right to bail
- Martin v. State, 1996 OK CR 56: Bail considerations

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite 22 O.S. § 1101 and Okla. Ct. Crim. App. R. 4.6.",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 22 O.S. § 1101 and Okla. Ct. Crim. App. R. 4.6 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By OSCN electronic filing
[ ] By mail
[ ] By personal service

STATE OF OKLAHOMA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Oklahoma certificate of service format",
  },
];

const okFederalSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Oklahoma.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Connecticut State Sections
// ============================================================================

const connecticutSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Conn. Gen. Stat. § 54-64a and Conn. Const. Art. I, § 8 in a Connecticut criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Conn. Gen. Stat. § 54-64a, courts must consider nature of offense, defendant's ties, criminal record, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Connecticut bail reduction motion.",
    helpText: "AI will generate a Connecticut-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Connecticut law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Connecticut law includes:
- Conn. Gen. Stat. § 54-64a: Bail provisions
- Conn. Const. Art. I, § 8: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Conn. Gen. Stat. § 54-64a and Conn. Const. Art. I, § 8.",
    helpText: "AI will generate Connecticut-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Conn. Gen. Stat. § 54-64a to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for a promise to appear or nonfinancial conditions;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Connecticut prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF CONNECTICUT
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Connecticut certificate of service format",
  },
];

const ctFederalSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Connecticut.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Second Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Utah State Sections
// ============================================================================

const utahSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Utah Code § 77-20-1, Utah R. Crim. P. 7, and Utah Const. Art. I, § 8 in a Utah criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Utah Code § 77-20-1 and Utah R. Crim. P. 7, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Utah bail reduction motion.",
    helpText: "AI will generate a Utah-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Utah law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Utah law includes:
- Utah Code § 77-20-1: Bail provisions
- Utah R. Crim. P. 7: Bail procedures
- Utah Const. Art. I, § 8: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Utah Code § 77-20-1 and Utah R. Crim. P. 7.",
    helpText: "AI will generate Utah-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Utah Code § 77-20-1 and Utah R. Crim. P. 7 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Utah prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF UTAH
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Utah certificate of service format",
  },
];

const utFederalSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Utah.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Iowa State Sections
// ============================================================================

const iowaSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Iowa Code § 811.1, Iowa R. Crim. P. 2.36, and Iowa Const. Art. I, § 12 in an Iowa criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Iowa Code § 811.1 and Iowa R. Crim. P. 2.36, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Iowa bail reduction motion.",
    helpText: "AI will generate an Iowa-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Iowa law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Iowa law includes:
- Iowa Code § 811.1: Bail provisions
- Iowa R. Crim. P. 2.36: Bail procedures
- Iowa Const. Art. I, § 12: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Iowa Code § 811.1 and Iowa R. Crim. P. 2.36.",
    helpText: "AI will generate Iowa-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Iowa Code § 811.1 and Iowa R. Crim. P. 2.36 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Iowa prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via EDMS
[ ] By mail
[ ] By personal service

STATE OF IOWA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Iowa certificate of service format",
  },
];

const iaFederalSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Iowa.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nevada State Sections
// ============================================================================

const nevadaSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under NRS 178.484 and Nev. Const. Art. 1, § 7 in a Nevada criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under NRS 178.484, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Nevada bail reduction motion.",
    helpText: "AI will generate a Nevada-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Nevada law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Nevada law includes:
- NRS 178.484: Bail provisions
- Nev. Const. Art. 1, § 7: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite NRS 178.484 and Nev. Const. Art. 1, § 7.",
    helpText: "AI will generate Nevada-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NRS 178.484 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nevada prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via Odyssey File & Serve
[ ] By mail
[ ] By personal service

STATE OF NEVADA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Nevada certificate of service format",
  },
];

const nvFederalSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Nevada.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arkansas State Sections
// ============================================================================

const arkansasSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Ark. Code Ann. § 16-84-101, Ark. R. Crim. P. 8.5, and Ark. Const. Art. 2, § 8 in an Arkansas criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Ark. Code Ann. § 16-84-101 and Ark. R. Crim. P. 8.5, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Arkansas bail reduction motion.",
    helpText: "AI will generate an Arkansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Arkansas law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Arkansas law includes:
- Ark. Code Ann. § 16-84-101: Bail provisions
- Ark. R. Crim. P. 8.5: Bail procedures
- Ark. Const. Art. 2, § 8: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Ark. Code Ann. § 16-84-101 and Ark. R. Crim. P. 8.5.",
    helpText: "AI will generate Arkansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ark. Code Ann. § 16-84-101 and Ark. R. Crim. P. 8.5 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arkansas prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ARKANSAS
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Arkansas certificate of service format",
  },
];

const arFederalSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Arkansas.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Mississippi State Sections
// ============================================================================

const mississippiSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Miss. Code Ann. § 99-5-37, URCCC 6.02, and Miss. Const. Art. 3, § 29 in a Mississippi criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Miss. Code Ann. § 99-5-37 and URCCC 6.02, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Mississippi bail reduction motion.",
    helpText: "AI will generate a Mississippi-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Mississippi law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Mississippi law includes:
- Miss. Code Ann. § 99-5-37: Bail provisions
- URCCC 6.02: Bail procedures
- Miss. Const. Art. 3, § 29: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Miss. Code Ann. § 99-5-37 and URCCC 6.02.",
    helpText: "AI will generate Mississippi-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Miss. Code Ann. § 99-5-37 and URCCC 6.02 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Mississippi prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via MEC
[ ] By mail
[ ] By personal service

STATE OF MISSISSIPPI
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Mississippi certificate of service format",
  },
];

const msFederalSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Mississippi.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Fifth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kansas State Sections
// ============================================================================

const kansasSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under K.S.A. 22-2802 and Kan. Const. Bill of Rights, § 9 in a Kansas criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under K.S.A. 22-2802, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Kansas bail reduction motion.",
    helpText: "AI will generate a Kansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Kansas law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Kansas law includes:
- K.S.A. 22-2802: Bail provisions
- Kan. Const. Bill of Rights, § 9: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite K.S.A. 22-2802 and Kan. Const. Bill of Rights, § 9.",
    helpText: "AI will generate Kansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to K.S.A. 22-2802 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kansas prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF KANSAS
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Kansas certificate of service format",
  },
];

const ksFederalSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Kansas.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Mexico State Sections
// ============================================================================

const newMexicoSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under NMRA Rule 5-401 and N.M. Const. Art. II, § 13 in a New Mexico criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under NMRA Rule 5-401, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New Mexico bail reduction motion.",
    helpText: "AI will generate a New Mexico-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under New Mexico law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable New Mexico law includes:
- NMRA Rule 5-401: Bail provisions
- N.M. Const. Art. II, § 13: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite NMRA Rule 5-401 and N.M. Const. Art. II, § 13.",
    helpText: "AI will generate New Mexico-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NMRA Rule 5-401 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Mexico prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via Odyssey
[ ] By mail
[ ] By personal service

STATE OF NEW MEXICO
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New Mexico certificate of service format",
  },
];

const nmFederalSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of New Mexico.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nebraska State Sections
// ============================================================================

const nebraskaSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Neb. Rev. Stat. § 29-901 and Neb. Const. Art. I, § 9 in a Nebraska criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Neb. Rev. Stat. § 29-901, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Nebraska bail reduction motion.",
    helpText: "AI will generate a Nebraska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Nebraska law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Nebraska law includes:
- Neb. Rev. Stat. § 29-901: Bail provisions
- Neb. Const. Art. I, § 9: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Neb. Rev. Stat. § 29-901 and Neb. Const. Art. I, § 9.",
    helpText: "AI will generate Nebraska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Neb. Rev. Stat. § 29-901 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nebraska prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEBRASKA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Nebraska certificate of service format",
  },
];

const neFederalSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Nebraska.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Idaho State Sections
// ============================================================================

const idahoSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under I.C.R. 46, I.C. § 19-2904, and Idaho Const. Art. I, § 6 in an Idaho criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under I.C.R. 46 and I.C. § 19-2904, courts must consider nature of offense, defendant's ties, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Idaho bail reduction motion.",
    helpText: "AI will generate an Idaho-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Idaho law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Idaho law includes:
- I.C.R. 46: Bail provisions
- I.C. § 19-2904: Bail procedures
- Idaho Const. Art. I, § 6: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite I.C.R. 46 and I.C. § 19-2904.",
    helpText: "AI will generate Idaho-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to I.C.R. 46 and I.C. § 19-2904 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Idaho prayer for relief",
  },

  baseSections[8], // signature

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via iCourt
[ ] By mail
[ ] By personal service

STATE OF IDAHO
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Idaho certificate of service format",
  },
];

const idFederalSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Idaho.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alaska State Sections
// ============================================================================

const alaskaSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Alaska Crim. R. 41, AS 12.30.011, and Alaska Const. Art. I, § 11 in an Alaska criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Alaska Crim. R. 41 and AS 12.30.011, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Alaska bail reduction motion.",
    helpText: "AI will generate an Alaska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Alaska law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Alaska law includes:
- Alaska Crim. R. 41: Bail provisions
- AS 12.30.011: Pretrial release
- Alaska Const. Art. I, § 11: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Alaska Crim. R. 41 and AS 12.30.011.",
    helpText: "AI will generate Alaska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Alaska Crim. R. 41 and AS 12.30.011 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alaska prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ALASKA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Alaska certificate of service format",
  },
];

const akFederalSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Alaska.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Delaware State Sections
// ============================================================================

const delawareSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105, and Del. Const. Art. I, § 12 in a Delaware criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under Del. Super. Ct. Crim. R. 46 and 11 Del. C. § 2105, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Delaware bail reduction motion.",
    helpText: "AI will generate a Delaware-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Delaware law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Delaware law includes:
- Del. Super. Ct. Crim. R. 46: Bail provisions
- 11 Del. C. § 2105: Bail procedures
- Del. Const. Art. I, § 12: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite Del. Super. Ct. Crim. R. 46 and 11 Del. C. § 2105.",
    helpText: "AI will generate Delaware-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Del. Super. Ct. Crim. R. 46 and 11 Del. C. § 2105 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Delaware prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via File & ServeXpress
[ ] By mail
[ ] By personal service

STATE OF DELAWARE
c/o Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Delaware certificate of service format",
  },
];

const deFederalSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Delaware.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Third Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Hawaii State Sections
// ============================================================================

const hawaiiSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under HRPP Rule 46, HRS § 804-3, and Hawaii Const. Art. I, § 12 in a Hawaii criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under HRPP Rule 46 and HRS § 804-3, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Hawaii bail reduction motion.",
    helpText: "AI will generate a Hawaii-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Hawaii law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Hawaii law includes:
- HRPP Rule 46: Bail provisions
- HRS § 804-3: Bail procedures
- Hawaii Const. Art. I, § 12: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite HRPP Rule 46 and HRS § 804-3.",
    helpText: "AI will generate Hawaii-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to HRPP Rule 46 and HRS § 804-3 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Hawaii prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via JEFS
[ ] By mail
[ ] By personal service

STATE OF HAWAII
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Hawaii certificate of service format",
  },
];

const hiFederalSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Hawaii.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maine State Sections
// ============================================================================

const maineSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under 15 M.R.S. § 1003 et seq. and Maine Const. Art. I, § 10 in a Maine criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under 15 M.R.S. § 1003 et seq., courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Maine bail reduction motion.",
    helpText: "AI will generate a Maine-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Maine law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Maine law includes:
- 15 M.R.S. § 1003 et seq.: Bail provisions
- Maine Const. Art. I, § 10: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite 15 M.R.S. § 1003 et seq.",
    helpText: "AI will generate Maine-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 15 M.R.S. § 1003 et seq. to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maine prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MAINE
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Maine certificate of service format",
  },
];

const meFederalSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Maine.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply First Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Montana State Sections
// ============================================================================

const montanaSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under MCA § 46-9-102 and Montana Const. Art. II, § 21 in a Montana criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under MCA § 46-9-102, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Montana bail reduction motion.",
    helpText: "AI will generate a Montana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Montana law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Montana law includes:
- MCA § 46-9-102: Bail provisions
- Montana Const. Art. II, § 21: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite MCA § 46-9-102.",
    helpText: "AI will generate Montana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCA § 46-9-102 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Montana prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MONTANA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Montana certificate of service format",
  },
];

const mtFederalSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Montana.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Ninth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Hampshire State Sections
// ============================================================================

const newHampshireSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under RSA 597:2 and N.H. Const. Part I, Art. 33 in a New Hampshire criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under RSA 597:2, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New Hampshire bail reduction motion.",
    helpText: "AI will generate a New Hampshire-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under New Hampshire law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable New Hampshire law includes:
- RSA 597:2: Bail provisions
- N.H. Const. Part I, Art. 33: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite RSA 597:2.",
    helpText: "AI will generate New Hampshire-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to RSA 597:2 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Hampshire prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW HAMPSHIRE
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New Hampshire certificate of service format",
  },
];

const nhFederalSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of New Hampshire.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply First Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Dakota State Sections
// ============================================================================

const northDakotaSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under N.D.R.Crim.P. 46, NDCC § 29-08-02, and N.D. Const. Art. I, § 11 in a North Dakota criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under N.D.R.Crim.P. 46 and NDCC § 29-08-02, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a North Dakota bail reduction motion.",
    helpText: "AI will generate a North Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under North Dakota law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable North Dakota law includes:
- N.D.R.Crim.P. 46: Bail provisions
- NDCC § 29-08-02: Bail procedures
- N.D. Const. Art. I, § 11: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite N.D.R.Crim.P. 46 and NDCC § 29-08-02.",
    helpText: "AI will generate North Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.D.R.Crim.P. 46 and NDCC § 29-08-02 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Dakota prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via Odyssey
[ ] By mail
[ ] By personal service

STATE OF NORTH DAKOTA
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "North Dakota certificate of service format",
  },
];

const ndFederalSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of North Dakota.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Rhode Island State Sections
// ============================================================================

const rhodeIslandSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under R.I. Gen. Laws § 12-13-1 et seq. and R.I. Const. Art. I, § 9 in a Rhode Island criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under R.I. Gen. Laws § 12-13-1 et seq., courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Rhode Island bail reduction motion.",
    helpText: "AI will generate a Rhode Island-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Rhode Island law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Rhode Island law includes:
- R.I. Gen. Laws § 12-13-1 et seq.: Bail provisions
- R.I. Const. Art. I, § 9: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite R.I. Gen. Laws § 12-13-1 et seq.",
    helpText: "AI will generate Rhode Island-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to R.I. Gen. Laws § 12-13-1 et seq. to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Rhode Island prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF RHODE ISLAND
c/o Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Rhode Island certificate of service format",
  },
];

const riFederalSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Rhode Island.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply First Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Dakota State Sections
// ============================================================================

const southDakotaSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under SDCL § 23A-43 and S.D. Const. Art. VI, § 8 in a South Dakota criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under SDCL § 23A-43, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a South Dakota bail reduction motion.",
    helpText: "AI will generate a South Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under South Dakota law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable South Dakota law includes:
- SDCL § 23A-43: Bail provisions
- S.D. Const. Art. VI, § 8: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite SDCL § 23A-43.",
    helpText: "AI will generate South Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to SDCL § 23A-43 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Dakota prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via Odyssey
[ ] By mail
[ ] By personal service

STATE OF SOUTH DAKOTA
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "South Dakota certificate of service format",
  },
];

const sdFederalSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of South Dakota.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Eighth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Vermont State Sections
// ============================================================================

const vermontSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under V.R.Cr.P. 46, 13 V.S.A. § 7553, and Vermont Const. Ch. II, § 40 in a Vermont criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under V.R.Cr.P. 46 and 13 V.S.A. § 7553, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Vermont bail reduction motion.",
    helpText: "AI will generate a Vermont-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Vermont law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Vermont law includes:
- V.R.Cr.P. 46: Bail provisions
- 13 V.S.A. § 7553: Bail procedures
- Vermont Const. Ch. II, § 40: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite V.R.Cr.P. 46 and 13 V.S.A. § 7553.",
    helpText: "AI will generate Vermont-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to V.R.Cr.P. 46 and 13 V.S.A. § 7553 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Vermont prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via Odyssey
[ ] By mail
[ ] By personal service

STATE OF VERMONT
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Vermont certificate of service format",
  },
];

const vtFederalSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Vermont.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Second Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// West Virginia State Sections
// ============================================================================

const westVirginiaSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1, and W. Va. Const. Art. III, § 5 in a West Virginia criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under W. Va. R. Crim. P. 46 and W. Va. Code § 62-1C-1, courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a West Virginia bail reduction motion.",
    helpText: "AI will generate a West Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under West Virginia law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable West Virginia law includes:
- W. Va. R. Crim. P. 46: Bail provisions
- W. Va. Code § 62-1C-1: Bail procedures
- W. Va. Const. Art. III, § 5: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite W. Va. R. Crim. P. 46 and W. Va. Code § 62-1C-1.",
    helpText: "AI will generate West Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W. Va. R. Crim. P. 46 and W. Va. Code § 62-1C-1 to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "West Virginia prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing via e-filing system
[ ] By mail
[ ] By personal service

STATE OF WEST VIRGINIA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "West Virginia certificate of service format",
  },
];

const wvFederalSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the federal District of West Virginia.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Fourth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wyoming State Sections
// ============================================================================

const wyomingSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for bail reduction under W.R.Cr.P. 46, Wyo. Stat. § 7-10-101 et seq., and Wyoming Const. Art. I, § 14 in a Wyoming criminal matter.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Bail Type: {{bailType}}
- Bail Set By: {{bailSetBy}}
- Bail Set Date: {{bailSetDate}}
- Charges: {{charges}}
- Charge Level: {{chargeLevel}}
- Custody Status: {{currentlyInCustody}}
- Time in Custody: {{timeInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Community Involvement: {{communityInvolvement}}
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Flight Risk Factors: {{flightRiskFactors}}

Financial Information:
- Income: {{defendantIncome}}
- Assets: {{defendantAssets}}
- Inability to Pay: {{abilityToPayExplanation}}
- Proposed Alternative: {{proposedAlternative}}
- Proposed Amount: {{proposedBailAmount}}
- Proposed Conditions: {{proposedConditions}}

Under W.R.Cr.P. 46 and Wyo. Stat. § 7-10-101 et seq., courts must consider nature of offense, defendant's ties to the community, and ability to post bail.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Wyoming bail reduction motion.",
    helpText: "AI will generate a Wyoming-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to reduce bail under Wyoming law.

Current Bail: {{currentBailAmount}}
Proposed Bail: {{proposedBailAmount}}
Charges: {{charges}}
Criminal History: {{criminalHistory}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Financial Situation: {{abilityToPayExplanation}}

Applicable Wyoming law includes:
- W.R.Cr.P. 46: Bail provisions
- Wyo. Stat. § 7-10-101 et seq.: Bail procedures
- Wyoming Const. Art. I, § 14: Right to bail
- 8th Amendment: Prohibition against excessive bail

Generate 3-5 paragraphs arguing for bail reduction.`,
    aiInstructions: "Must cite W.R.Cr.P. 46 and Wyo. Stat. § 7-10-101 et seq.",
    helpText: "AI will generate Wyoming-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.R.Cr.P. 46 and Wyo. Stat. § 7-10-101 et seq. to:

1. Reduce the current bail from the amount set to a reasonable amount that the Defendant can afford;

2. In the alternative, modify the conditions of release to allow for personal recognizance or supervised release;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wyoming prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WYOMING
c/o County & Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Wyoming certificate of service format",
  },
];

const wyFederalSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b) in the District of Wyoming.

Current Bail Information:
- Current Bail Amount: {{currentBailAmount}}
- Charges: {{charges}}
- Custody Status: {{currentlyInCustody}}

Defendant Background:
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Residence: {{residenceStatus}} - {{residenceDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Financial Information:
- Income: {{defendantIncome}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal detention review motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion to review detention under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{charges}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}

Apply Tenth Circuit precedent on detention review.

Generate 3-5 paragraphs arguing for release or modified conditions.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142, 3145(b) to:

1. Revoke or amend the current detention order;

2. Release Defendant on reasonable conditions;

3. Grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
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
    // North Carolina
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: northCarolinaSections,
      courtSpecificRules: "Filed under N.C. Gen. Stat. § 15A-534. NC Const. Art. I, § 27 provides right to bail.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "E.D.N.C.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "M.D.N.C.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "W.D.N.C.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    // Michigan
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: michiganSections,
      courtSpecificRules: "Filed under MCR 6.106 and MCL 765.6.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "E.D. Mich.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "W.D. Mich.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    // New Jersey
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: newJerseySections,
      courtSpecificRules: "Filed under N.J. Ct. R. 3:26. NJ uses Criminal Justice Reform Act (2017) - largely eliminated cash bail.",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "D.N.J.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Third Circuit. CM/ECF required.",
    },
    // Virginia
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: virginiaSections,
      courtSpecificRules: "Filed under Va. Code § 19.2-120.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "E.D. Va.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "W.D. Va.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    // Washington
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: washingtonSections,
      courtSpecificRules: "Filed under CrR 3.2. WA Const. Art. I, § 20 provides right to bail.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "E.D. Wash.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "W.D. Wash.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Arizona
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: arizonaSections,
      courtSpecificRules: "Filed under Ariz. R. Crim. P. 7.2, 7.3 and A.R.S. § 13-3961.",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "D. Ariz.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Massachusetts
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: massachusettsSections,
      courtSpecificRules: "Filed under Mass. R. Crim. P. 7. Brangan v. Commonwealth (2018) requires ability-to-pay analysis.",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "D. Mass.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). First Circuit. CM/ECF required.",
    },
    // Tennessee
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Filed under Tenn. R. Crim. P. 46.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "E.D. Tenn.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "M.D. Tenn.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "W.D. Tenn.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    // Indiana
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Filed under IC 35-33-8 and Ind. R. Crim. P. 26.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "N.D. Ind.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "S.D. Ind.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Seventh Circuit. CM/ECF required.",
    },
    // Maryland
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Filed under Md. Rule 4-216.1. 2017 bail reform emphasizes least restrictive conditions.",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "D. Md.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    // Missouri
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Filed under Mo. Sup. Ct. R. 33.01 and RSMo § 544.455. Bail factors analysis required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "E.D. Mo.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "W.D. Mo.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Wisconsin
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Filed under Wis. Stat. § 969.01 and SCR 69.03. Pretrial release criteria apply.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "E.D. Wis.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "W.D. Wis.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Seventh Circuit. CM/ECF required.",
    },
    // Colorado
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coloradoSections,
      courtSpecificRules: "Filed under Colo. R. Crim. P. 46 and C.R.S. § 16-4-101. Bail and bond provisions.",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "D. Colo.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    // Minnesota
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: minnesotaSections,
      courtSpecificRules: "Filed under Minn. R. Crim. P. 6.02. Pretrial release with least restrictive conditions.",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "D. Minn.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // South Carolina
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: southCarolinaSections,
      courtSpecificRules: "Filed under S.C. R. Crim. P. 4 and S.C. Code § 17-15-10. Bail provisions.",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "D.S.C.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    // Alabama
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alabamaSections,
      courtSpecificRules: "Filed under Ala. R. Crim. P. 7.2, 7.3 and Ala. Code § 15-13-3. Bail provisions.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "N.D. Ala.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "M.D. Ala.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "S.D. Ala.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eleventh Circuit. CM/ECF required.",
    },
    // Louisiana
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: louisianaSections,
      courtSpecificRules: "Filed under La. C.Cr.P. art. 316, 317. Bail factors analysis.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "E.D. La.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "M.D. La.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "W.D. La.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fifth Circuit. CM/ECF required.",
    },
    // Kentucky
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kentuckySections,
      courtSpecificRules: "Filed under Ky. R. Crim. P. 4.00 and KRS 431.015. Pretrial release provisions.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "E.D. Ky.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "W.D. Ky.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Sixth Circuit. CM/ECF required.",
    },
    // Oregon
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: oregonSections,
      courtSpecificRules: "Filed under ORS 135.230-.290 and UTCR 4.060. Release agreements.",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "D. Or.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Oklahoma
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: oklahomaSections,
      courtSpecificRules: "Filed under 22 O.S. § 1101 and Okla. Ct. Crim. App. R. 4.6. Bail provisions.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "N.D. Okla.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "E.D. Okla.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "W.D. Okla.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    // Connecticut
    {
      jurisdiction: "CT",
      courtType: "state",
      sections: connecticutSections,
      courtSpecificRules: "Filed under Conn. Gen. Stat. § 54-64a. Conn. Const. Art. I, § 8. Bail provisions.",
    },
    {
      jurisdiction: "CT",
      courtType: "federal",
      district: "DCT",
      sections: ctFederalSections,
      courtSpecificRules: "D. Conn.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Second Circuit. CM/ECF required.",
    },
    // Utah
    {
      jurisdiction: "UT",
      courtType: "state",
      sections: utahSections,
      courtSpecificRules: "Filed under Utah Code § 77-20-1 and Utah R. Crim. P. 7. Utah Const. Art. I, § 8. Bail provisions.",
    },
    {
      jurisdiction: "UT",
      courtType: "federal",
      district: "DUT",
      sections: utFederalSections,
      courtSpecificRules: "D. Utah: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    // Iowa
    {
      jurisdiction: "IA",
      courtType: "state",
      sections: iowaSections,
      courtSpecificRules: "Filed under Iowa Code § 811.1 and Iowa R. Crim. P. 2.36. Iowa Const. Art. I, § 12. Bail provisions.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "NDIA",
      sections: iaFederalSections,
      courtSpecificRules: "N.D. Iowa: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "SDIA",
      sections: iaFederalSections,
      courtSpecificRules: "S.D. Iowa: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Nevada
    {
      jurisdiction: "NV",
      courtType: "state",
      sections: nevadaSections,
      courtSpecificRules: "Filed under NRS 178.484. Nev. Const. Art. 1, § 7. Bail provisions.",
    },
    {
      jurisdiction: "NV",
      courtType: "federal",
      district: "DNV",
      sections: nvFederalSections,
      courtSpecificRules: "D. Nev.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Arkansas
    {
      jurisdiction: "AR",
      courtType: "state",
      sections: arkansasSections,
      courtSpecificRules: "Filed under Ark. Code Ann. § 16-84-101 and Ark. R. Crim. P. 8.5. Ark. Const. Art. 2, § 8. Bail provisions.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "EDAR",
      sections: arFederalSections,
      courtSpecificRules: "E.D. Ark.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "WDAR",
      sections: arFederalSections,
      courtSpecificRules: "W.D. Ark.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Mississippi
    {
      jurisdiction: "MS",
      courtType: "state",
      sections: mississippiSections,
      courtSpecificRules: "Filed under Miss. Code Ann. § 99-5-37 and URCCC 6.02. Miss. Const. Art. 3, § 29. Bail provisions.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "NDMS",
      sections: msFederalSections,
      courtSpecificRules: "N.D. Miss.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "SDMS",
      sections: msFederalSections,
      courtSpecificRules: "S.D. Miss.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fifth Circuit. CM/ECF required.",
    },
    // Kansas
    {
      jurisdiction: "KS",
      courtType: "state",
      sections: kansasSections,
      courtSpecificRules: "Filed under K.S.A. 22-2802. Kan. Const. Bill of Rights, § 9. Bail provisions.",
    },
    {
      jurisdiction: "KS",
      courtType: "federal",
      district: "DKS",
      sections: ksFederalSections,
      courtSpecificRules: "D. Kan.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    // New Mexico
    {
      jurisdiction: "NM",
      courtType: "state",
      sections: newMexicoSections,
      courtSpecificRules: "Filed under NMRA Rule 5-401. N.M. Const. Art. II, § 13. Bail provisions.",
    },
    {
      jurisdiction: "NM",
      courtType: "federal",
      district: "DNM",
      sections: nmFederalSections,
      courtSpecificRules: "D.N.M.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
    // Nebraska
    {
      jurisdiction: "NE",
      courtType: "state",
      sections: nebraskaSections,
      courtSpecificRules: "Filed under Neb. Rev. Stat. § 29-901. Neb. Const. Art. I, § 9. Bail provisions.",
    },
    {
      jurisdiction: "NE",
      courtType: "federal",
      district: "DNE",
      sections: neFederalSections,
      courtSpecificRules: "D. Neb.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Idaho
    {
      jurisdiction: "ID",
      courtType: "state",
      sections: idahoSections,
      courtSpecificRules: "Filed under I.C.R. 46 and I.C. § 19-2904. Idaho Const. Art. I, § 6. Bail provisions.",
    },
    {
      jurisdiction: "ID",
      courtType: "federal",
      district: "DID",
      sections: idFederalSections,
      courtSpecificRules: "D. Idaho: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Alaska
    {
      jurisdiction: "AK",
      courtType: "state",
      sections: alaskaSections,
      courtSpecificRules: "Filed under Alaska Crim. R. 41 and AS 12.30.011. Alaska Const. Art. I, § 11. Bail provisions.",
    },
    {
      jurisdiction: "AK",
      courtType: "federal",
      district: "DAK",
      sections: akFederalSections,
      courtSpecificRules: "D. Alaska: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Delaware
    {
      jurisdiction: "DE",
      courtType: "state",
      sections: delawareSections,
      courtSpecificRules: "Filed under Del. Super. Ct. Crim. R. 46 and 11 Del. C. § 2105. Del. Const. Art. I, § 12. Bail provisions.",
    },
    {
      jurisdiction: "DE",
      courtType: "federal",
      district: "DDE",
      sections: deFederalSections,
      courtSpecificRules: "D. Del.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Third Circuit. CM/ECF required.",
    },
    // Hawaii
    {
      jurisdiction: "HI",
      courtType: "state",
      sections: hawaiiSections,
      courtSpecificRules: "Filed under HRPP Rule 46 and HRS § 804-3. Hawaii Const. Art. I, § 12. Bail provisions.",
    },
    {
      jurisdiction: "HI",
      courtType: "federal",
      district: "DHI",
      sections: hiFederalSections,
      courtSpecificRules: "D. Haw.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // Maine
    {
      jurisdiction: "ME",
      courtType: "state",
      sections: maineSections,
      courtSpecificRules: "Filed under 15 M.R.S. § 1003 et seq. Maine Const. Art. I, § 10. Bail provisions.",
    },
    {
      jurisdiction: "ME",
      courtType: "federal",
      district: "DME",
      sections: meFederalSections,
      courtSpecificRules: "D. Me.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). First Circuit. CM/ECF required.",
    },
    // Montana
    {
      jurisdiction: "MT",
      courtType: "state",
      sections: montanaSections,
      courtSpecificRules: "Filed under MCA § 46-9-102. Montana Const. Art. II, § 21. Bail provisions.",
    },
    {
      jurisdiction: "MT",
      courtType: "federal",
      district: "DMT",
      sections: mtFederalSections,
      courtSpecificRules: "D. Mont.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Ninth Circuit. CM/ECF required.",
    },
    // New Hampshire
    {
      jurisdiction: "NH",
      courtType: "state",
      sections: newHampshireSections,
      courtSpecificRules: "Filed under RSA 597:2. N.H. Const. Part I, Art. 33. Bail provisions.",
    },
    {
      jurisdiction: "NH",
      courtType: "federal",
      district: "DNH",
      sections: nhFederalSections,
      courtSpecificRules: "D.N.H.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). First Circuit. CM/ECF required.",
    },
    // North Dakota
    {
      jurisdiction: "ND",
      courtType: "state",
      sections: northDakotaSections,
      courtSpecificRules: "Filed under N.D.R.Crim.P. 46 and NDCC § 29-08-02. N.D. Const. Art. I, § 11. Bail provisions.",
    },
    {
      jurisdiction: "ND",
      courtType: "federal",
      district: "DND",
      sections: ndFederalSections,
      courtSpecificRules: "D.N.D.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Rhode Island
    {
      jurisdiction: "RI",
      courtType: "state",
      sections: rhodeIslandSections,
      courtSpecificRules: "Filed under R.I. Gen. Laws § 12-13-1 et seq. R.I. Const. Art. I, § 9. Bail provisions.",
    },
    {
      jurisdiction: "RI",
      courtType: "federal",
      district: "DRI",
      sections: riFederalSections,
      courtSpecificRules: "D.R.I.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). First Circuit. CM/ECF required.",
    },
    // South Dakota
    {
      jurisdiction: "SD",
      courtType: "state",
      sections: southDakotaSections,
      courtSpecificRules: "Filed under SDCL § 23A-43. S.D. Const. Art. VI, § 8. Bail provisions.",
    },
    {
      jurisdiction: "SD",
      courtType: "federal",
      district: "DSD",
      sections: sdFederalSections,
      courtSpecificRules: "D.S.D.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Eighth Circuit. CM/ECF required.",
    },
    // Vermont
    {
      jurisdiction: "VT",
      courtType: "state",
      sections: vermontSections,
      courtSpecificRules: "Filed under V.R.Cr.P. 46 and 13 V.S.A. § 7553. Vermont Const. Ch. II, § 40. Bail provisions.",
    },
    {
      jurisdiction: "VT",
      courtType: "federal",
      district: "DVT",
      sections: vtFederalSections,
      courtSpecificRules: "D. Vt.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Second Circuit. CM/ECF required.",
    },
    // West Virginia
    {
      jurisdiction: "WV",
      courtType: "state",
      sections: westVirginiaSections,
      courtSpecificRules: "Filed under W. Va. R. Crim. P. 46 and W. Va. Code § 62-1C-1. W. Va. Const. Art. III, § 5. Bail provisions.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "NDWV",
      sections: wvFederalSections,
      courtSpecificRules: "N.D. W. Va.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "SDWV",
      sections: wvFederalSections,
      courtSpecificRules: "S.D. W. Va.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Fourth Circuit. CM/ECF required.",
    },
    // Wyoming
    {
      jurisdiction: "WY",
      courtType: "state",
      sections: wyomingSections,
      courtSpecificRules: "Filed under W.R.Cr.P. 46 and Wyo. Stat. § 7-10-101 et seq. Wyoming Const. Art. I, § 14. Bail provisions.",
    },
    {
      jurisdiction: "WY",
      courtType: "federal",
      district: "DWY",
      sections: wyFederalSections,
      courtSpecificRules: "D. Wyo.: 12pt font. Filed under 18 U.S.C. §§ 3142, 3145(b). Tenth Circuit. CM/ECF required.",
    },
  ],
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS", "NM", "NE", "ID", "AK", "DE", "HI", "ME", "MT", "NH", "ND", "RI", "SD", "VT", "WV", "WY", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK", "DCT", "DUT", "NDIA", "SDIA", "DNV", "EDAR", "WDAR", "NDMS", "SDMS", "DKS", "DNM", "DNE", "DID", "DAK", "DDE", "DHI", "DME", "DMT", "DNH", "DND", "DRI", "DSD", "DVT", "NDWV", "SDWV", "DWY"],
};

export default motionToReduceBailTemplate;
