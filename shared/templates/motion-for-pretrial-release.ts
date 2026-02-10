/**
 * Motion for Pretrial Release Template
 *
 * Criminal law document template for requesting pretrial release on own recognizance
 * or under supervised release conditions. Argues for release based on community ties,
 * employment, lack of flight risk, and constitutional presumption of innocence.
 * Includes jurisdiction-specific variants for all 50 states + DC and federal court variants.
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

const detentionInputs: TemplateInput[] = [
  {
    id: "arrestDate",
    label: "Date of Arrest",
    type: "date",
    required: true,
    helpText: "The date the defendant was arrested",
  },
  {
    id: "currentFacility",
    label: "Current Detention Facility",
    type: "text",
    placeholder: "e.g., County Jail, Federal Detention Center",
    required: true,
    helpText: "The facility where the defendant is currently detained",
  },
  {
    id: "timeInCustody",
    label: "Time in Custody",
    type: "text",
    placeholder: "e.g., 14 days",
    required: true,
    helpText: "How long the defendant has been in custody",
  },
  {
    id: "chargesDescription",
    label: "Current Charges",
    type: "textarea",
    placeholder: "Describe the current charges including statute numbers...",
    required: true,
    helpText: "Provide a description of all current charges",
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
    id: "priorReleaseRequests",
    label: "Prior Release Requests",
    type: "select",
    required: true,
    helpText: "Whether prior pretrial release requests have been made",
    validation: {
      options: [
        { value: "none", label: "No prior requests" },
        { value: "one_denied", label: "One prior request - Denied" },
        { value: "one_partial", label: "One prior request - Partially granted" },
        { value: "multiple", label: "Multiple prior requests" },
      ],
    },
  },
  {
    id: "bailSet",
    label: "Bail Status",
    type: "select",
    required: true,
    helpText: "Whether bail has been set in this case",
    validation: {
      options: [
        { value: "yes_unaffordable", label: "Yes - Unaffordable Amount" },
        { value: "yes_denied", label: "Yes - Bail Denied" },
        { value: "no_bail_set", label: "No Bail Set" },
        { value: "pending", label: "Pending Determination" },
      ],
    },
  },
];

const defendantBackgroundInputs: TemplateInput[] = [
  {
    id: "residenceYears",
    label: "Years at Current Address",
    type: "text",
    placeholder: "e.g., 5 years",
    required: true,
    helpText: "How long the defendant has resided at their current address",
  },
  {
    id: "residenceType",
    label: "Residence Type",
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
    placeholder: "Describe living situation, stability, who resides with defendant...",
    required: false,
    helpText: "Additional details about residence history and stability",
    validation: {
      maxLength: 1000,
    },
  },
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
    id: "familyTies",
    label: "Family and Community Ties",
    type: "textarea",
    placeholder: "Describe family members in area, spouse, children, parents, community connections...",
    required: true,
    helpText: "Describe the defendant's family ties, dependents, and connections to the community",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
  {
    id: "dependents",
    label: "Dependents",
    type: "text",
    placeholder: "e.g., 2 minor children, elderly parent",
    required: false,
    helpText: "Number and type of dependents who rely on the defendant",
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
    id: "militaryService",
    label: "Military Service",
    type: "select",
    required: false,
    helpText: "The defendant's military service status, if any",
    validation: {
      options: [
        { value: "none", label: "None" },
        { value: "active_duty", label: "Active Duty" },
        { value: "veteran", label: "Veteran" },
        { value: "reserve", label: "Reserve/National Guard" },
      ],
    },
  },
  {
    id: "educationStatus",
    label: "Education Level",
    type: "text",
    placeholder: "e.g., High school diploma, Bachelor's degree",
    required: false,
    helpText: "The defendant's education level",
  },
];

const riskAssessmentInputs: TemplateInput[] = [
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
    id: "courtAppearanceHistory",
    label: "Court Appearance History",
    type: "select",
    required: true,
    helpText: "The defendant's history of complying with court appearances",
    validation: {
      options: [
        { value: "perfect_record", label: "Perfect Record - Always appeared" },
        { value: "mostly_compliant", label: "Mostly Compliant - Rare issues" },
        { value: "some_failures", label: "Some Failures to Appear" },
        { value: "first_case", label: "First Case - No prior history" },
      ],
    },
  },
  {
    id: "fta_history",
    label: "Failure to Appear History",
    type: "select",
    required: true,
    helpText: "History of failures to appear in court",
    validation: {
      options: [
        { value: "none", label: "No failures to appear" },
        { value: "one_old", label: "One old FTA (resolved)" },
        { value: "multiple", label: "Multiple FTAs" },
        { value: "recent", label: "Recent FTA" },
      ],
    },
  },
  {
    id: "passportStatus",
    label: "Passport Status",
    type: "select",
    required: true,
    helpText: "Whether the defendant has a passport",
    validation: {
      options: [
        { value: "no_passport", label: "No Passport" },
        { value: "has_passport_surrender", label: "Has Passport - Willing to Surrender" },
        { value: "has_passport_retain", label: "Has Passport - Wishes to Retain" },
      ],
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
];

const proposedConditionsInputs: TemplateInput[] = [
  {
    id: "releaseType",
    label: "Type of Release Requested",
    type: "select",
    required: true,
    helpText: "Select the type of pretrial release being requested",
    validation: {
      options: [
        { value: "or_release", label: "Own Recognizance (OR) Release" },
        { value: "supervised_release", label: "Supervised Release" },
        { value: "third_party_custody", label: "Third-Party Custody" },
        { value: "conditional_release", label: "Conditional Release" },
      ],
    },
  },
  {
    id: "proposedConditions",
    label: "Proposed Conditions of Release",
    type: "textarea",
    placeholder: "Describe proposed conditions (e.g., check-ins, travel restrictions, curfew, drug testing)...",
    required: true,
    helpText: "Describe the conditions the defendant is willing to accept for release",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
  {
    id: "electronicMonitoring",
    label: "Electronic Monitoring",
    type: "select",
    required: true,
    helpText: "Whether the defendant is willing to wear an ankle monitor",
    validation: {
      options: [
        { value: "yes", label: "Yes - Willing" },
        { value: "no", label: "No" },
        { value: "if_required", label: "If Required by Court" },
      ],
    },
  },
  {
    id: "pretrial_services",
    label: "Pretrial Services Reporting",
    type: "select",
    required: true,
    helpText: "Whether the defendant is willing to report to pretrial services",
    validation: {
      options: [
        { value: "yes", label: "Yes - Willing" },
        { value: "no", label: "No" },
      ],
    },
  },
  {
    id: "thirdPartyCustodian",
    label: "Third-Party Custodian",
    type: "text",
    placeholder: "Name of proposed third-party custodian",
    required: false,
    helpText: "Name of the person proposed as third-party custodian, if applicable",
  },
  {
    id: "surrenderPassport",
    label: "Surrender Passport",
    type: "select",
    required: false,
    helpText: "Whether the defendant is willing to surrender their passport",
    validation: {
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_applicable", label: "Not Applicable" },
      ],
    },
  },
  {
    id: "stayAwayOrders",
    label: "Stay-Away / No-Contact Orders",
    type: "text",
    placeholder: "e.g., No contact with alleged victim, stay 500 feet away",
    required: false,
    helpText: "Proposed stay-away orders or no-contact conditions",
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
    id: "detentionInfo",
    name: "Detention Information",
    type: "user-input",
    order: 2,
    inputs: detentionInputs,
    required: true,
    helpText: "Provide details about the current detention",
  },
  {
    id: "defendantBackground",
    name: "Defendant Background & Community Ties",
    type: "user-input",
    order: 3,
    inputs: defendantBackgroundInputs,
    required: true,
    helpText: "Provide background information about the defendant and community ties",
  },
  {
    id: "riskAssessment",
    name: "Risk Assessment",
    type: "user-input",
    order: 4,
    inputs: riskAssessmentInputs,
    required: true,
    helpText: "Provide information for risk assessment",
  },
  {
    id: "proposedConditions",
    name: "Proposed Release Conditions",
    type: "user-input",
    order: 5,
    inputs: proposedConditionsInputs,
    required: true,
    helpText: "Describe the proposed conditions of release",
  },
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release in a criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}
- Education: {{educationStatus}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}
- Substance Treatment: {{substanceTreatment}}
- Mental Health Treatment: {{mentalHealthTreatment}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}
- Third-Party Custodian: {{thirdPartyCustodian}}
- Surrender Passport: {{surrenderPassport}}
- Stay-Away Orders: {{stayAwayOrders}}

Generate 3-4 paragraphs that:
1. Describe the procedural history (arrest, charges, detention period)
2. Present the defendant's background, community ties, and stability
3. Describe risk assessment factors showing the defendant is not a flight risk
4. Detail proposed release conditions and why they adequately protect community safety

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative. Do not include legal citations or argument. Present facts chronologically and in a manner favorable to the defense.",
    helpText: "AI will generate a statement of facts based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release in a criminal matter.

Jurisdiction: {{jurisdiction}}
Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Employment Status: {{employmentStatus}}
Residence: {{residenceYears}} at current address, {{residenceType}}
Family Ties: {{familyTies}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}
Electronic Monitoring: {{electronicMonitoring}}
Pretrial Services: {{pretrial_services}}
Bail Status: {{bailSet}}

Generate 4-6 paragraphs that:
1. State the constitutional presumption of release and right to liberty (Stack v. Boyle, 342 U.S. 1 (1951); United States v. Salerno, 481 U.S. 739 (1987))
2. Present the applicable state/federal statutory standard for pretrial release
3. Argue why the defendant meets the criteria for release (community ties, low flight risk)
4. Argue why proposed conditions adequately address any concerns about flight risk or danger to community
5. Address the impact of continued detention on defendant's case preparation and Sixth Amendment rights

Use formal legal writing style with proper citations.`,
    aiInstructions: "Include relevant constitutional citations (Eighth Amendment, Stack v. Boyle, 342 U.S. 1, United States v. Salerno, 481 U.S. 739). Use proper legal citation format.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court:

1. Release the Defendant on own recognizance, finding that no conditions of release are necessary to reasonably assure the Defendant's appearance in court and the safety of the community;

2. In the alternative, release the Defendant under supervised release conditions, including any conditions the Court deems appropriate to reasonably assure appearance and community safety;

3. In the alternative, impose the least restrictive conditions of release necessary to reasonably assure the Defendant's appearance in court and the safety of the community;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for pretrial release motions",
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

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties in this action by:

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
// CA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// NY-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// TX-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// FL-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// PA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// IL-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// OH-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// GA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// NC-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MI-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// NJ-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// VA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// WA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// AZ-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// TN-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// IN-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MD-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MO-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// WI-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// CO-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// MN-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// SC-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// AL-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// LA-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// KY-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// OR-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
];

// ============================================================================
// OK-specific caption inputs
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
  baseSections[1],
  baseSections[2],
  baseSections[3],
  baseSections[4],
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
// DC-specific caption inputs
// ============================================================================

const dcCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of the District of Columbia, Criminal Division" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., 2024 CF2 001234" }
    : input
);

const dcBaseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Caption",
    type: "user-input",
    order: 1,
    inputs: dcCaptionInputs,
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

const caSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Cal. Penal Code § 1270 et seq., In re Humphrey (2021) in a California criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Cal. Penal Code § 1270 et seq., In re Humphrey (2021), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a California pretrial release motion.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under California law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable California law includes:
- Cal. Penal Code § 1270 et seq., In re Humphrey (2021)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Cal. Penal Code § 1270 et seq., In re Humphrey (2021) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate California-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Cal. Penal Code § 1270 et seq., In re Humphrey (2021) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF CALIFORNIA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "California certificate of service format",
  },
];

const caFederalSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New York State Sections
// ============================================================================

const nySections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under CPL § 510.10, Bail Reform Act (2020 amendments) in a New York criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under CPL § 510.10, Bail Reform Act (2020 amendments), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New York pretrial release motion.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under New York law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable New York law includes:
- CPL § 510.10, Bail Reform Act (2020 amendments)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite CPL § 510.10, Bail Reform Act (2020 amendments) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate New York-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CPL § 510.10, Bail Reform Act (2020 amendments) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW YORK
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New York certificate of service format",
  },
];

const nyFederalSections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Second Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Second Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Texas State Sections
// ============================================================================

const txSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017) in a Texas criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Texas pretrial release motion.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Texas law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF TEXAS
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Texas certificate of service format",
  },
];

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fifth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fifth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Florida State Sections
// ============================================================================

const flSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046 in a Florida criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Florida pretrial release motion.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Florida law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF FLORIDA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Florida certificate of service format",
  },
];

const flFederalSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eleventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eleventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Pennsylvania State Sections
// ============================================================================

const paSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704 in a Pennsylvania criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania pretrial release motion.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Pennsylvania law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Pennsylvania law includes:
- Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF PENNSYLVANIA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Pennsylvania certificate of service format",
  },
];

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Third Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Third Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Illinois State Sections
// ============================================================================

const ilSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023) in a Illinois criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Illinois pretrial release motion.",
    helpText: "AI will generate a Illinois-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Illinois law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Illinois law includes:
- 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ILLINOIS
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Illinois certificate of service format",
  },
];

const ilFederalSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Seventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Seventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Ohio State Sections
// ============================================================================

const ohSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Ohio R. Crim. P. 46, ORC § 2937.222 in a Ohio criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Ohio R. Crim. P. 46, ORC § 2937.222, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Ohio pretrial release motion.",
    helpText: "AI will generate a Ohio-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Ohio law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Ohio law includes:
- Ohio R. Crim. P. 46, ORC § 2937.222
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Ohio R. Crim. P. 46, ORC § 2937.222 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio R. Crim. P. 46, ORC § 2937.222 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF OHIO
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Ohio certificate of service format",
  },
];

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Sixth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Sixth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Georgia State Sections
// ============================================================================

const gaSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII in a Georgia criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Georgia pretrial release motion.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Georgia law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Georgia law includes:
- O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF GEORGIA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Georgia certificate of service format",
  },
];

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eleventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eleventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Carolina State Sections
// ============================================================================

const ncSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under N.C. Gen. Stat. § 15A-534 in a North Carolina criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under N.C. Gen. Stat. § 15A-534, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a North Carolina pretrial release motion.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under North Carolina law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable North Carolina law includes:
- N.C. Gen. Stat. § 15A-534
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite N.C. Gen. Stat. § 15A-534 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C. Gen. Stat. § 15A-534 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NORTH CAROLINA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fourth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fourth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Michigan State Sections
// ============================================================================

const miSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under MCR 6.106, Mich. Const. Art. I, § 15 in a Michigan criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under MCR 6.106, Mich. Const. Art. I, § 15, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Michigan pretrial release motion.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Michigan law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Michigan law includes:
- MCR 6.106, Mich. Const. Art. I, § 15
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite MCR 6.106, Mich. Const. Art. I, § 15 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCR 6.106, Mich. Const. Art. I, § 15 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Sixth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Sixth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Jersey State Sections
// ============================================================================

const njSections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017) in a New Jersey criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New Jersey pretrial release motion.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under New Jersey law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable New Jersey law includes:
- N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW JERSEY
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Third Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Third Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Virginia State Sections
// ============================================================================

const vaSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Va. Code § 19.2-120 in a Virginia criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Va. Code § 19.2-120, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Virginia pretrial release motion.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Virginia law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Virginia law includes:
- Va. Code § 19.2-120
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Va. Code § 19.2-120 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Va. Code § 19.2-120 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF VIRGINIA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fourth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fourth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Washington State Sections
// ============================================================================

const waSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under CrR 3.2, RCW 10.21 in a Washington criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under CrR 3.2, RCW 10.21, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Washington pretrial release motion.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Washington law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Washington law includes:
- CrR 3.2, RCW 10.21
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite CrR 3.2, RCW 10.21 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CrR 3.2, RCW 10.21 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arizona State Sections
// ============================================================================

const azSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22 in a Arizona criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Arizona pretrial release motion.",
    helpText: "AI will generate a Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Arizona law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Arizona law includes:
- Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ARIZONA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Massachusetts State Sections
// ============================================================================

const maSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Mass. R. Crim. P. 28, G.L. c. 276, § 58 in a Massachusetts criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Mass. R. Crim. P. 28, G.L. c. 276, § 58, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts pretrial release motion.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Massachusetts law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 28, G.L. c. 276, § 58
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Mass. R. Crim. P. 28, G.L. c. 276, § 58 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. R. Crim. P. 28, G.L. c. 276, § 58 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MASSACHUSETTS
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the First Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply First Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Tennessee State Sections
// ============================================================================

const tnSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Tenn. R. Crim. P. 46, TCA § 40-11-115 in a Tennessee criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Tenn. R. Crim. P. 46, TCA § 40-11-115, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Tennessee pretrial release motion.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Tennessee law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 46, TCA § 40-11-115
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 46, TCA § 40-11-115 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Crim. P. 46, TCA § 40-11-115 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF TENNESSEE
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Sixth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Sixth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Indiana State Sections
// ============================================================================

const inSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Ind. Code § 35-33-8-3.2 in a Indiana criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Ind. Code § 35-33-8-3.2, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Indiana pretrial release motion.",
    helpText: "AI will generate a Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Indiana law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Indiana law includes:
- Ind. Code § 35-33-8-3.2
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Ind. Code § 35-33-8-3.2 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ind. Code § 35-33-8-3.2 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Seventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Seventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maryland State Sections
// ============================================================================

const mdSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101 in a Maryland criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Maryland pretrial release motion.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Maryland law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Maryland law includes:
- Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MARYLAND
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fourth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fourth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Missouri State Sections
// ============================================================================

const moSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Mo. R. Crim. P. 33.01, RSMo § 544.455 in a Missouri criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Mo. R. Crim. P. 33.01, RSMo § 544.455, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Missouri pretrial release motion.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Missouri law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Missouri law includes:
- Mo. R. Crim. P. 33.01, RSMo § 544.455
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Mo. R. Crim. P. 33.01, RSMo § 544.455 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mo. R. Crim. P. 33.01, RSMo § 544.455 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wisconsin State Sections
// ============================================================================

const wiSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Wis. Stat. § 969.01 in a Wisconsin criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Wis. Stat. § 969.01, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin pretrial release motion.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Wisconsin law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Wisconsin law includes:
- Wis. Stat. § 969.01
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Wis. Stat. § 969.01 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 969.01 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WISCONSIN
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Seventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Seventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Colorado State Sections
// ============================================================================

const coSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Colo. R. Crim. P. 46, C.R.S. § 16-4-101 in a Colorado criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Colo. R. Crim. P. 46, C.R.S. § 16-4-101, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Colorado pretrial release motion.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Colorado law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Colorado law includes:
- Colo. R. Crim. P. 46, C.R.S. § 16-4-101
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Colo. R. Crim. P. 46, C.R.S. § 16-4-101 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Colo. R. Crim. P. 46, C.R.S. § 16-4-101 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF COLORADO
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Minnesota State Sections
// ============================================================================

const mnSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53 in a Minnesota criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Minnesota pretrial release motion.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Minnesota law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MINNESOTA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Carolina State Sections
// ============================================================================

const scSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under S.C. Code § 17-15-10 in a South Carolina criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under S.C. Code § 17-15-10, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a South Carolina pretrial release motion.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under South Carolina law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable South Carolina law includes:
- S.C. Code § 17-15-10
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite S.C. Code § 17-15-10 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C. Code § 17-15-10 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF SOUTH CAROLINA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fourth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fourth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alabama State Sections
// ============================================================================

const alSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2 in a Alabama criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Alabama pretrial release motion.",
    helpText: "AI will generate a Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Alabama law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ALABAMA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eleventh Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eleventh Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Louisiana State Sections
// ============================================================================

const laSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under La. C.Cr.P. Art. 311-342 in a Louisiana criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under La. C.Cr.P. Art. 311-342, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Louisiana pretrial release motion.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Louisiana law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Louisiana law includes:
- La. C.Cr.P. Art. 311-342
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite La. C.Cr.P. Art. 311-342 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. C.Cr.P. Art. 311-342 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fifth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fifth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kentucky State Sections
// ============================================================================

const kySections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under KRS § 431.510, Ky. R. Crim. P. 4.02 in a Kentucky criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under KRS § 431.510, Ky. R. Crim. P. 4.02, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Kentucky pretrial release motion.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Kentucky law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Kentucky law includes:
- KRS § 431.510, Ky. R. Crim. P. 4.02
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite KRS § 431.510, Ky. R. Crim. P. 4.02 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to KRS § 431.510, Ky. R. Crim. P. 4.02 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF KENTUCKY
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Sixth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Sixth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oregon State Sections
// ============================================================================

const orSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under ORS § 135.230-295 in a Oregon criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under ORS § 135.230-295, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Oregon pretrial release motion.",
    helpText: "AI will generate a Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Oregon law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Oregon law includes:
- ORS § 135.230-295
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite ORS § 135.230-295 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Oregon-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ORS § 135.230-295 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF OREGON
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oklahoma State Sections
// ============================================================================

const okSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under 22 O.S. § 1101 et seq. in a Oklahoma criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under 22 O.S. § 1101 et seq., courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Oklahoma pretrial release motion.",
    helpText: "AI will generate a Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Oklahoma law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Oklahoma law includes:
- 22 O.S. § 1101 et seq.
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite 22 O.S. § 1101 et seq. and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 22 O.S. § 1101 et seq. to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF OKLAHOMA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Connecticut State Sections
// ============================================================================

const ctSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a in a Connecticut criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Connecticut pretrial release motion.",
    helpText: "AI will generate a Connecticut-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Connecticut law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Connecticut law includes:
- Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Connecticut-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Connecticut prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF CONNECTICUT
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Second Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Second Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Utah State Sections
// ============================================================================

const utSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Utah R. Crim. P. 7, Utah Code § 77-20-1 in a Utah criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Utah R. Crim. P. 7, Utah Code § 77-20-1, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Utah pretrial release motion.",
    helpText: "AI will generate a Utah-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Utah law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Utah law includes:
- Utah R. Crim. P. 7, Utah Code § 77-20-1
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Utah R. Crim. P. 7, Utah Code § 77-20-1 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Utah-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Utah R. Crim. P. 7, Utah Code § 77-20-1 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Utah prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF UTAH
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Iowa State Sections
// ============================================================================

const iaSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Iowa R. Crim. P. 2.23, Iowa Code § 811.1 in a Iowa criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Iowa R. Crim. P. 2.23, Iowa Code § 811.1, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Iowa pretrial release motion.",
    helpText: "AI will generate a Iowa-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Iowa law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Iowa law includes:
- Iowa R. Crim. P. 2.23, Iowa Code § 811.1
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Iowa R. Crim. P. 2.23, Iowa Code § 811.1 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Iowa-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Iowa R. Crim. P. 2.23, Iowa Code § 811.1 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Iowa prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF IOWA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nevada State Sections
// ============================================================================

const nvSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under NRS § 178.484 in a Nevada criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under NRS § 178.484, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Nevada pretrial release motion.",
    helpText: "AI will generate a Nevada-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Nevada law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Nevada law includes:
- NRS § 178.484
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite NRS § 178.484 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Nevada-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NRS § 178.484 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nevada prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEVADA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arkansas State Sections
// ============================================================================

const arSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101 in a Arkansas criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Arkansas pretrial release motion.",
    helpText: "AI will generate a Arkansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Arkansas law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Arkansas law includes:
- Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Arkansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arkansas prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Mississippi State Sections
// ============================================================================

const msSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01 in a Mississippi criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Mississippi pretrial release motion.",
    helpText: "AI will generate a Mississippi-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Mississippi law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Mississippi law includes:
- Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Mississippi-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Mississippi prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MISSISSIPPI
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fifth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fifth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kansas State Sections
// ============================================================================

const ksSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under K.S.A. § 22-2802 in a Kansas criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under K.S.A. § 22-2802, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Kansas pretrial release motion.",
    helpText: "AI will generate a Kansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Kansas law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Kansas law includes:
- K.S.A. § 22-2802
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite K.S.A. § 22-2802 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Kansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to K.S.A. § 22-2802 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kansas prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF KANSAS
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Mexico State Sections
// ============================================================================

const nmSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform) in a New Mexico criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform), courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New Mexico pretrial release motion.",
    helpText: "AI will generate a New Mexico-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under New Mexico law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable New Mexico law includes:
- NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform)
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform) and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate New Mexico-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform) to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Mexico prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW MEXICO
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nebraska State Sections
// ============================================================================

const neSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Neb. Rev. Stat. § 29-901 in a Nebraska criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Neb. Rev. Stat. § 29-901, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Nebraska pretrial release motion.",
    helpText: "AI will generate a Nebraska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Nebraska law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Nebraska law includes:
- Neb. Rev. Stat. § 29-901
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Neb. Rev. Stat. § 29-901 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Nebraska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Neb. Rev. Stat. § 29-901 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nebraska prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEBRASKA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Idaho State Sections
// ============================================================================

const idSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under I.C.R. 46, Idaho Code § 19-2903 in a Idaho criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under I.C.R. 46, Idaho Code § 19-2903, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Idaho pretrial release motion.",
    helpText: "AI will generate a Idaho-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Idaho law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Idaho law includes:
- I.C.R. 46, Idaho Code § 19-2903
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite I.C.R. 46, Idaho Code § 19-2903 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Idaho-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to I.C.R. 46, Idaho Code § 19-2903 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Idaho prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alaska State Sections
// ============================================================================

const akSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Alaska R. Crim. P. 41, AS § 12.30.011 in a Alaska criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Alaska R. Crim. P. 41, AS § 12.30.011, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Alaska pretrial release motion.",
    helpText: "AI will generate a Alaska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Alaska law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Alaska law includes:
- Alaska R. Crim. P. 41, AS § 12.30.011
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Alaska R. Crim. P. 41, AS § 12.30.011 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Alaska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Alaska R. Crim. P. 41, AS § 12.30.011 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ALASKA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Delaware State Sections
// ============================================================================

const deSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105 in a Delaware criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Delaware pretrial release motion.",
    helpText: "AI will generate a Delaware-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Delaware law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Delaware law includes:
- Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Delaware-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF DELAWARE
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Third Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Third Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Hawaii State Sections
// ============================================================================

const hiSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under HRPP Rule 46, HRS § 804-3 in a Hawaii criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under HRPP Rule 46, HRS § 804-3, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Hawaii pretrial release motion.",
    helpText: "AI will generate a Hawaii-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Hawaii law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Hawaii law includes:
- HRPP Rule 46, HRS § 804-3
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite HRPP Rule 46, HRS § 804-3 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Hawaii-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to HRPP Rule 46, HRS § 804-3 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maine State Sections
// ============================================================================

const meSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under Me. R.U. Crim. P. 46, 15 M.R.S. § 1003 in a Maine criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under Me. R.U. Crim. P. 46, 15 M.R.S. § 1003, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Maine pretrial release motion.",
    helpText: "AI will generate a Maine-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Maine law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Maine law includes:
- Me. R.U. Crim. P. 46, 15 M.R.S. § 1003
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite Me. R.U. Crim. P. 46, 15 M.R.S. § 1003 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Maine-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Me. R.U. Crim. P. 46, 15 M.R.S. § 1003 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MAINE
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the First Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply First Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Montana State Sections
// ============================================================================

const mtSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under MCA § 46-9-102 in a Montana criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under MCA § 46-9-102, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Montana pretrial release motion.",
    helpText: "AI will generate a Montana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Montana law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Montana law includes:
- MCA § 46-9-102
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite MCA § 46-9-102 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Montana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCA § 46-9-102 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MONTANA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Ninth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Ninth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Hampshire State Sections
// ============================================================================

const nhSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under RSA 597:2, N.H. Const. Part I, Art. 33 in a New Hampshire criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under RSA 597:2, N.H. Const. Part I, Art. 33, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a New Hampshire pretrial release motion.",
    helpText: "AI will generate a New Hampshire-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under New Hampshire law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable New Hampshire law includes:
- RSA 597:2, N.H. Const. Part I, Art. 33
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite RSA 597:2, N.H. Const. Part I, Art. 33 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate New Hampshire-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to RSA 597:2, N.H. Const. Part I, Art. 33 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW HAMPSHIRE
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the First Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply First Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Dakota State Sections
// ============================================================================

const ndSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under N.D.R.Crim.P. 46, NDCC § 29-08-02 in a North Dakota criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under N.D.R.Crim.P. 46, NDCC § 29-08-02, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a North Dakota pretrial release motion.",
    helpText: "AI will generate a North Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under North Dakota law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable North Dakota law includes:
- N.D.R.Crim.P. 46, NDCC § 29-08-02
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite N.D.R.Crim.P. 46, NDCC § 29-08-02 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate North Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.D.R.Crim.P. 46, NDCC § 29-08-02 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NORTH DAKOTA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Rhode Island State Sections
// ============================================================================

const riSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under R.I. Gen. Laws § 12-13-1 in a Rhode Island criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under R.I. Gen. Laws § 12-13-1, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Rhode Island pretrial release motion.",
    helpText: "AI will generate a Rhode Island-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Rhode Island law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Rhode Island law includes:
- R.I. Gen. Laws § 12-13-1
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite R.I. Gen. Laws § 12-13-1 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Rhode Island-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to R.I. Gen. Laws § 12-13-1 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF RHODE ISLAND
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the First Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply First Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Dakota State Sections
// ============================================================================

const sdSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under SDCL § 23A-43 in a South Dakota criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under SDCL § 23A-43, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a South Dakota pretrial release motion.",
    helpText: "AI will generate a South Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under South Dakota law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable South Dakota law includes:
- SDCL § 23A-43
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite SDCL § 23A-43 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate South Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to SDCL § 23A-43 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF SOUTH DAKOTA
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Eighth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Eighth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Vermont State Sections
// ============================================================================

const vtSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under V.R.Cr.P. 46, 13 V.S.A. § 7553 in a Vermont criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under V.R.Cr.P. 46, 13 V.S.A. § 7553, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Vermont pretrial release motion.",
    helpText: "AI will generate a Vermont-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Vermont law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Vermont law includes:
- V.R.Cr.P. 46, 13 V.S.A. § 7553
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite V.R.Cr.P. 46, 13 V.S.A. § 7553 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Vermont-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to V.R.Cr.P. 46, 13 V.S.A. § 7553 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF VERMONT
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Second Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Second Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// West Virginia State Sections
// ============================================================================

const wvSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1 in a West Virginia criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a West Virginia pretrial release motion.",
    helpText: "AI will generate a West Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under West Virginia law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable West Virginia law includes:
- W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate West Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Fourth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Fourth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wyoming State Sections
// ============================================================================

const wySections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under W.R.Cr.P. 46, Wyo. Stat. § 7-10-101 in a Wyoming criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under W.R.Cr.P. 46, Wyo. Stat. § 7-10-101, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Wyoming pretrial release motion.",
    helpText: "AI will generate a Wyoming-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under Wyoming law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable Wyoming law includes:
- W.R.Cr.P. 46, Wyo. Stat. § 7-10-101
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite W.R.Cr.P. 46, Wyo. Stat. § 7-10-101 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate Wyoming-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.R.Cr.P. 46, Wyo. Stat. § 7-10-101 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
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

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WYOMING
c/o Prosecuting Attorney
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
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the Tenth Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply Tenth Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// District of Columbia State Sections
// ============================================================================

const dcSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for pretrial release under D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321 in a District of Columbia criminal matter.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}
- Prior Release Requests: {{priorReleaseRequests}}
- Bail Status: {{bailSet}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}} - {{residenceDetails}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Dependents: {{dependents}}
- Community Involvement: {{communityInvolvement}}
- Military Service: {{militaryService}}

Risk Assessment:
- Criminal History: {{criminalHistory}} - {{criminalHistoryDetails}}
- Court Appearance History: {{courtAppearanceHistory}}
- FTA History: {{fta_history}}
- Passport Status: {{passportStatus}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}
- Electronic Monitoring: {{electronicMonitoring}}
- Pretrial Services: {{pretrial_services}}

Under D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321, courts must consider community ties, employment, criminal history, and flight risk factors.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a District of Columbia pretrial release motion.",
    helpText: "AI will generate a District of Columbia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for pretrial release under District of Columbia law.

Charges: {{chargesDescription}}
Charge Level: {{chargeLevel}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}
FTA History: {{fta_history}}
Community Ties: {{familyTies}}, {{communityInvolvement}}
Release Type: {{releaseType}}
Proposed Conditions: {{proposedConditions}}

Applicable District of Columbia law includes:
- D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321
- Eighth Amendment: Prohibition against excessive bail
- Stack v. Boyle, 342 U.S. 1 (1951): Presumption of pretrial release
- United States v. Salerno, 481 U.S. 739 (1987): Standard for pretrial detention

Generate 4-6 paragraphs arguing for pretrial release.`,
    aiInstructions: "Must cite D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321 and constitutional provisions. Use proper legal citation format.",
    helpText: "AI will generate District of Columbia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321 to:

1. Release the Defendant on own recognizance;

2. In the alternative, release the Defendant under supervised release conditions with the least restrictive conditions necessary;

3. In the alternative, impose conditions of release that adequately address any concerns regarding flight risk or community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "District of Columbia prayer for relief",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

DISTRICT OF COLUMBIA
c/o Office of the Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "District of Columbia certificate of service format",
  },
];

const dcFederalSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b) in the D.C. Circuit Circuit.

Detention Information:
- Arrest Date: {{arrestDate}}
- Current Facility: {{currentFacility}}
- Time in Custody: {{timeInCustody}}
- Charges: {{chargesDescription}}
- Charge Level: {{chargeLevel}}

Defendant Background:
- Residence: {{residenceYears}} at current address, {{residenceType}}
- Employment: {{employmentStatus}} - {{employmentDetails}}
- Family Ties: {{familyTies}}
- Criminal History: {{criminalHistory}}

Proposed Release Conditions:
- Release Type: {{releaseType}}
- Proposed Conditions: {{proposedConditions}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal pretrial release motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 7,
    required: true,
    aiPromptTemplate: `Generate the legal argument for a federal motion for pretrial release under 18 U.S.C. §§ 3142, 3145(b).

Charges: {{chargesDescription}}
Proposed Conditions: {{proposedConditions}}
Community Ties: {{familyTies}}
Criminal History: {{criminalHistory}}
Court Appearance History: {{courtAppearanceHistory}}

Apply D.C. Circuit Circuit precedent on pretrial release.

Generate 4-6 paragraphs arguing for release.`,
    aiInstructions: "Must cite 18 U.S.C. §§ 3142, 3145(b), Stack v. Boyle, United States v. Salerno, and D.C. Circuit Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 8,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 18 U.S.C. §§ 3142 and 3145(b) to:

1. Release the Defendant on personal recognizance or unsecured appearance bond pursuant to 18 U.S.C. § 3142(b);

2. In the alternative, release the Defendant on conditions pursuant to 18 U.S.C. § 3142(c);

3. In the alternative, impose the least restrictive conditions reasonably necessary to assure the Defendant's appearance and community safety;

4. Grant a hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing the Bail Reform Act",
  },

  baseSections[8],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 10,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION FOR PRETRIAL RELEASE via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Template Definition
// ============================================================================

export const motionForPretrialReleaseTemplate: DocumentTemplate = {
  id: "motion-for-pretrial-release",
  name: "Motion for Pretrial Release",
  category: "criminal",
  description: "Request release from custody prior to trial without posting bail. This motion argues the defendant should be released on own recognizance (OR) or under supervised release conditions based on community ties, employment, lack of flight risk, and constitutional presumption of innocence. Addresses pretrial detention factors including danger to community and risk of non-appearance. Governed by the Eighth Amendment, Stack v. Boyle, 342 U.S. 1 (1951), United States v. Salerno, 481 U.S. 739 (1987), and state-specific pretrial release statutes.",
  version: "1.0.0",
  lastUpdated: new Date("2024-01-25"),
  baseSections,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  jurisdictionVariants: [
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: caSections,
      courtSpecificRules: "Filed under Cal. Penal Code § 1270 et seq., In re Humphrey (2021). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: caFederalSections,
      courtSpecificRules: "CACD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: caFederalSections,
      courtSpecificRules: "NDCA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: caFederalSections,
      courtSpecificRules: "EDCA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: caFederalSections,
      courtSpecificRules: "SDCA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: nySections,
      courtSpecificRules: "Filed under CPL § 510.10, Bail Reform Act (2020 amendments). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "SDNY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "EDNY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "NDNY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "WDNY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: txSections,
      courtSpecificRules: "Filed under Tex. Code Crim. Proc. Art. 17.03, O'Donnell v. Harris County (2017). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "TXND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "TXSD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "TXED: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "TXWD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: flSections,
      courtSpecificRules: "Filed under Fla. R. Crim. P. 3.131, Fla. Stat. § 903.046. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "FLSD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "FLMD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "FLND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: paSections,
      courtSpecificRules: "Filed under Pa. R. Crim. P. 524, 42 Pa.C.S. § 5704. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "PAED: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "PAMD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "PAWD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: ilSections,
      courtSpecificRules: "Filed under 725 ILCS 5/110-5, Pretrial Fairness Act (SAFE-T Act 2023). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "ILND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "ILCD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "ILSD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohSections,
      courtSpecificRules: "Filed under Ohio R. Crim. P. 46, ORC § 2937.222. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "OHND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "OHSD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: gaSections,
      courtSpecificRules: "Filed under O.C.G.A. § 17-6-1, Ga. Const. Art. I, § 1, ¶ XVII. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "GAND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "GAMD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "GASD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: ncSections,
      courtSpecificRules: "Filed under N.C. Gen. Stat. § 15A-534. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "EDNC: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "MDNC: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "WDNC: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: miSections,
      courtSpecificRules: "Filed under MCR 6.106, Mich. Const. Art. I, § 15. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "EDMI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "WDMI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: njSections,
      courtSpecificRules: "Filed under N.J.S.A. 2A:162-15 et seq. (Criminal Justice Reform Act 2017). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "DNJ: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: vaSections,
      courtSpecificRules: "Filed under Va. Code § 19.2-120. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "EDVA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "WDVA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: waSections,
      courtSpecificRules: "Filed under CrR 3.2, RCW 10.21. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "EDWA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "WDWA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: azSections,
      courtSpecificRules: "Filed under Ariz. R. Crim. P. 7.2, Ariz. Const. Art. II, § 22. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "DAZ: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: maSections,
      courtSpecificRules: "Filed under Mass. R. Crim. P. 28, G.L. c. 276, § 58. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "DMA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tnSections,
      courtSpecificRules: "Filed under Tenn. R. Crim. P. 46, TCA § 40-11-115. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "EDTN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "MDTN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "WDTN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: inSections,
      courtSpecificRules: "Filed under Ind. Code § 35-33-8-3.2. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "NDIN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "SDIN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: mdSections,
      courtSpecificRules: "Filed under Md. Rule 4-216.1, Md. Code, Crim. Proc. § 5-101. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "DMD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: moSections,
      courtSpecificRules: "Filed under Mo. R. Crim. P. 33.01, RSMo § 544.455. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "EDMO: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "WDMO: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wiSections,
      courtSpecificRules: "Filed under Wis. Stat. § 969.01. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "EDWI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "WDWI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coSections,
      courtSpecificRules: "Filed under Colo. R. Crim. P. 46, C.R.S. § 16-4-101. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "DCO: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: mnSections,
      courtSpecificRules: "Filed under Minn. R. Crim. P. 6.02, Minn. Stat. § 629.53. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "DMN: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: scSections,
      courtSpecificRules: "Filed under S.C. Code § 17-15-10. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "DSC: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alSections,
      courtSpecificRules: "Filed under Ala. R. Crim. P. 7.2, Ala. Code § 15-13-2. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "NDAL: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "MDAL: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "SDAL: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: laSections,
      courtSpecificRules: "Filed under La. C.Cr.P. Art. 311-342. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "EDLA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "MDLA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "WDLA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kySections,
      courtSpecificRules: "Filed under KRS § 431.510, Ky. R. Crim. P. 4.02. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "EDKY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "WDKY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: orSections,
      courtSpecificRules: "Filed under ORS § 135.230-295. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "DOR: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: okSections,
      courtSpecificRules: "Filed under 22 O.S. § 1101 et seq.. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "NDOK: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "EDOK: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "WDOK: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CT",
      courtType: "state",
      sections: ctSections,
      courtSpecificRules: "Filed under Conn. Gen. Stat. § 54-63b, C.G.S. § 54-64a. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "CT",
      courtType: "federal",
      district: "DCT",
      sections: ctFederalSections,
      courtSpecificRules: "DCT: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "UT",
      courtType: "state",
      sections: utSections,
      courtSpecificRules: "Filed under Utah R. Crim. P. 7, Utah Code § 77-20-1. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "UT",
      courtType: "federal",
      district: "DUT",
      sections: utFederalSections,
      courtSpecificRules: "DUT: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "state",
      sections: iaSections,
      courtSpecificRules: "Filed under Iowa R. Crim. P. 2.23, Iowa Code § 811.1. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "NDIA",
      sections: iaFederalSections,
      courtSpecificRules: "NDIA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "SDIA",
      sections: iaFederalSections,
      courtSpecificRules: "SDIA: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NV",
      courtType: "state",
      sections: nvSections,
      courtSpecificRules: "Filed under NRS § 178.484. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NV",
      courtType: "federal",
      district: "DNV",
      sections: nvFederalSections,
      courtSpecificRules: "DNV: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "state",
      sections: arSections,
      courtSpecificRules: "Filed under Ark. R. Crim. P. 8.5, A.C.A. § 16-84-101. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "EDAR",
      sections: arFederalSections,
      courtSpecificRules: "EDAR: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "WDAR",
      sections: arFederalSections,
      courtSpecificRules: "WDAR: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "state",
      sections: msSections,
      courtSpecificRules: "Filed under Miss. Code § 99-5-37, Unif. R. Crim. P. 8.01. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "NDMS",
      sections: msFederalSections,
      courtSpecificRules: "NDMS: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "SDMS",
      sections: msFederalSections,
      courtSpecificRules: "SDMS: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KS",
      courtType: "state",
      sections: ksSections,
      courtSpecificRules: "Filed under K.S.A. § 22-2802. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "KS",
      courtType: "federal",
      district: "DKS",
      sections: ksFederalSections,
      courtSpecificRules: "DKS: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NM",
      courtType: "state",
      sections: nmSections,
      courtSpecificRules: "Filed under NMRA 5-401, NMSA § 31-3-1 (2016 Bail Reform). Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NM",
      courtType: "federal",
      district: "DNM",
      sections: nmFederalSections,
      courtSpecificRules: "DNM: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NE",
      courtType: "state",
      sections: neSections,
      courtSpecificRules: "Filed under Neb. Rev. Stat. § 29-901. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NE",
      courtType: "federal",
      district: "DNE",
      sections: neFederalSections,
      courtSpecificRules: "DNE: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ID",
      courtType: "state",
      sections: idSections,
      courtSpecificRules: "Filed under I.C.R. 46, Idaho Code § 19-2903. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "ID",
      courtType: "federal",
      district: "DID",
      sections: idFederalSections,
      courtSpecificRules: "DID: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AK",
      courtType: "state",
      sections: akSections,
      courtSpecificRules: "Filed under Alaska R. Crim. P. 41, AS § 12.30.011. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "AK",
      courtType: "federal",
      district: "DAK",
      sections: akFederalSections,
      courtSpecificRules: "DAK: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "DE",
      courtType: "state",
      sections: deSections,
      courtSpecificRules: "Filed under Del. Super. Ct. Crim. R. 46, 11 Del. C. § 2105. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "DE",
      courtType: "federal",
      district: "DDE",
      sections: deFederalSections,
      courtSpecificRules: "DDE: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "HI",
      courtType: "state",
      sections: hiSections,
      courtSpecificRules: "Filed under HRPP Rule 46, HRS § 804-3. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "HI",
      courtType: "federal",
      district: "DHI",
      sections: hiFederalSections,
      courtSpecificRules: "DHI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ME",
      courtType: "state",
      sections: meSections,
      courtSpecificRules: "Filed under Me. R.U. Crim. P. 46, 15 M.R.S. § 1003. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "ME",
      courtType: "federal",
      district: "DME",
      sections: meFederalSections,
      courtSpecificRules: "DME: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MT",
      courtType: "state",
      sections: mtSections,
      courtSpecificRules: "Filed under MCA § 46-9-102. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "MT",
      courtType: "federal",
      district: "DMT",
      sections: mtFederalSections,
      courtSpecificRules: "DMT: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NH",
      courtType: "state",
      sections: nhSections,
      courtSpecificRules: "Filed under RSA 597:2, N.H. Const. Part I, Art. 33. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "NH",
      courtType: "federal",
      district: "DNH",
      sections: nhFederalSections,
      courtSpecificRules: "DNH: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ND",
      courtType: "state",
      sections: ndSections,
      courtSpecificRules: "Filed under N.D.R.Crim.P. 46, NDCC § 29-08-02. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "ND",
      courtType: "federal",
      district: "DND",
      sections: ndFederalSections,
      courtSpecificRules: "DND: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "RI",
      courtType: "state",
      sections: riSections,
      courtSpecificRules: "Filed under R.I. Gen. Laws § 12-13-1. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "RI",
      courtType: "federal",
      district: "DRI",
      sections: riFederalSections,
      courtSpecificRules: "DRI: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "SD",
      courtType: "state",
      sections: sdSections,
      courtSpecificRules: "Filed under SDCL § 23A-43. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "SD",
      courtType: "federal",
      district: "DSD",
      sections: sdFederalSections,
      courtSpecificRules: "DSD: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VT",
      courtType: "state",
      sections: vtSections,
      courtSpecificRules: "Filed under V.R.Cr.P. 46, 13 V.S.A. § 7553. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "VT",
      courtType: "federal",
      district: "DVT",
      sections: vtFederalSections,
      courtSpecificRules: "DVT: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "state",
      sections: wvSections,
      courtSpecificRules: "Filed under W. Va. R. Crim. P. 46, W. Va. Code § 62-1C-1. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "NDWV",
      sections: wvFederalSections,
      courtSpecificRules: "NDWV: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "SDWV",
      sections: wvFederalSections,
      courtSpecificRules: "SDWV: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WY",
      courtType: "state",
      sections: wySections,
      courtSpecificRules: "Filed under W.R.Cr.P. 46, Wyo. Stat. § 7-10-101. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "WY",
      courtType: "federal",
      district: "DWY",
      sections: wyFederalSections,
      courtSpecificRules: "DWY: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "DC",
      courtType: "state",
      sections: dcSections,
      courtSpecificRules: "Filed under D.C. Super. Ct. Crim. R. 46, D.C. Code § 23-1321. Pretrial release provisions apply.",
    },
    {
      jurisdiction: "DC",
      courtType: "federal",
      district: "DDC",
      sections: dcFederalSections,
      courtSpecificRules: "DDC: Filed under 18 U.S.C. § 3142(b), Bail Reform Act of 1984. D.C. Circuit Circuit. CM/ECF required.",
    },
  ],
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS", "NM", "NE", "ID", "AK", "DE", "HI", "ME", "MT", "NH", "ND", "RI", "SD", "VT", "WV", "WY", "DC", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK", "DCT", "DUT", "NDIA", "SDIA", "DNV", "EDAR", "WDAR", "NDMS", "SDMS", "DKS", "DNM", "DNE", "DID", "DAK", "DDE", "DHI", "DME", "DMT", "DNH", "DND", "DRI", "DSD", "DVT", "NDWV", "SDWV", "DWY", "DDC"],
};

export default motionForPretrialReleaseTemplate;
