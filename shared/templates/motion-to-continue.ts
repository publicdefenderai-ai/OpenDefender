/**
 * Motion to Continue Template
 *
 * Criminal law document template for requesting a continuance of a hearing.
 * Includes jurisdiction-specific variants (CA, NY, TX) with proper statutory citations.
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

const hearingInputs: TemplateInput[] = [
  {
    id: "currentHearingDate",
    label: "Current Hearing Date",
    type: "date",
    required: true,
    helpText: "The date of the currently scheduled hearing",
  },
  {
    id: "currentHearingTime",
    label: "Current Hearing Time",
    type: "text",
    placeholder: "e.g., 8:30 AM",
    required: true,
    helpText: "The time of the currently scheduled hearing",
  },
  {
    id: "hearingType",
    label: "Type of Hearing",
    type: "select",
    required: true,
    helpText: "Select the type of hearing to be continued",
    validation: {
      options: [
        { value: "arraignment", label: "Arraignment" },
        { value: "preliminary", label: "Preliminary Hearing" },
        { value: "pretrial", label: "Pre-Trial Conference" },
        { value: "motions", label: "Motion Hearing" },
        { value: "trial", label: "Trial" },
        { value: "sentencing", label: "Sentencing" },
        { value: "probation", label: "Probation Violation Hearing" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "requestedDate",
    label: "Requested New Date",
    type: "date",
    required: false,
    helpText: "The specific date you are requesting, if known. Leave blank if requesting any available date.",
  },
  {
    id: "requestedTimeframe",
    label: "Requested Timeframe",
    type: "text",
    placeholder: "e.g., 30 days, 2 weeks",
    required: false,
    helpText: "If no specific date, how much additional time is being requested",
  },
];

const reasonInputs: TemplateInput[] = [
  {
    id: "primaryReason",
    label: "Primary Reason for Continuance",
    type: "select",
    required: true,
    helpText: "Select the main reason for requesting a continuance",
    validation: {
      options: [
        { value: "attorney_unavailable", label: "Attorney Unavailability (scheduling conflict)" },
        { value: "witness_unavailable", label: "Witness Unavailable" },
        { value: "investigation_incomplete", label: "Investigation Not Complete" },
        { value: "discovery_pending", label: "Discovery Not Yet Received/Reviewed" },
        { value: "expert_needed", label: "Need to Retain/Consult Expert" },
        { value: "plea_negotiations", label: "Ongoing Plea Negotiations" },
        { value: "new_counsel", label: "Recently Retained/Appointed Counsel" },
        { value: "medical_emergency", label: "Medical Emergency or Health Issue" },
        { value: "family_emergency", label: "Family Emergency" },
        { value: "conflict_of_interest", label: "Conflict of Interest Discovered" },
        { value: "additional_preparation", label: "Need Additional Preparation Time" },
        { value: "other", label: "Other Good Cause" },
      ],
    },
  },
  {
    id: "reasonExplanation",
    label: "Detailed Explanation",
    type: "textarea",
    placeholder: "Provide specific facts supporting the need for a continuance...",
    required: true,
    helpText: "Explain the circumstances in detail. Be specific about dates, names, and factual circumstances.",
    validation: {
      minLength: 50,
      maxLength: 2000,
    },
  },
  {
    id: "priorContinuances",
    label: "Number of Prior Continuances",
    type: "select",
    required: true,
    helpText: "How many times has this matter been previously continued?",
    validation: {
      options: [
        { value: "0", label: "None (first request)" },
        { value: "1", label: "One prior continuance" },
        { value: "2", label: "Two prior continuances" },
        { value: "3", label: "Three or more prior continuances" },
      ],
    },
  },
  {
    id: "priorContinuanceReason",
    label: "Reason for Prior Continuance(s)",
    type: "textarea",
    placeholder: "If applicable, briefly explain prior continuances...",
    required: false,
    helpText: "If there were prior continuances, explain who requested them and why",
    validation: {
      maxLength: 500,
    },
  },
  {
    id: "custodyStatus",
    label: "Defendant Custody Status",
    type: "select",
    required: true,
    helpText: "Is the defendant currently in custody?",
    validation: {
      options: [
        { value: "out_of_custody", label: "Out of Custody (released)" },
        { value: "in_custody", label: "In Custody (detained)" },
      ],
    },
  },
  {
    id: "speedyTrialWaiver",
    label: "Speedy Trial Time Waiver",
    type: "select",
    required: true,
    helpText: "Will the defendant waive speedy trial time for this continuance?",
    validation: {
      options: [
        { value: "waive", label: "Defendant waives time" },
        { value: "no_waive", label: "Defendant does not waive time" },
        { value: "not_applicable", label: "Not applicable (time already waived)" },
      ],
    },
  },
  {
    id: "oppositionPosition",
    label: "Prosecution Position",
    type: "select",
    required: true,
    helpText: "What is the prosecution's position on this continuance?",
    validation: {
      options: [
        { value: "stipulated", label: "Stipulated (prosecution agrees)" },
        { value: "opposed", label: "Opposed" },
        { value: "unknown", label: "Unknown (not yet contacted)" },
        { value: "no_position", label: "No position taken" },
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
    id: "hearingInfo",
    name: "Hearing Information",
    type: "user-input",
    order: 2,
    inputs: hearingInputs,
    required: true,
    helpText: "Provide details about the current hearing and requested continuance",
  },
  {
    id: "reason",
    name: "Reason for Continuance",
    type: "user-input",
    order: 3,
    inputs: reasonInputs,
    required: true,
    helpText: "Explain why a continuance is needed",
  },
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes "good cause" under applicable law
3. Address any concerns about delay, particularly if the defendant is in custody
4. Note if this is stipulated by the prosecution

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Generate a professional good cause statement that is specific to the facts provided. Avoid generic language.",
    helpText: "AI will generate a good cause statement based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a criminal matter.

Jurisdiction: {{jurisdiction}}
Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}

Generate 2-3 paragraphs that:
1. Cite the applicable legal standard for granting continuances
2. Reference relevant statutes and court rules
3. Apply the legal standard to the facts of this case
4. Address any factors the court must consider

Use formal legal writing style with proper citations.`,
    aiInstructions: "Include relevant statutory citations for the jurisdiction. Use proper legal citation format.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}};

2. Set a new hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief language",
  },
  {
    id: "signatureBlock",
    name: "Signature Block",
    type: "user-input",
    order: 7,
    inputs: signatureInputs,
    required: true,
    helpText: "Enter your professional information for the signature block",
  },
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `PROOF OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by:

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

// CA-specific caption inputs (same fields but with CA counties)
const caCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: CA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of California, County of Los Angeles" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., BA123456" }
    : input
);

// CA base sections (uses CA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// NY-specific caption inputs (same fields but with NY counties)
const nyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: NY_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Supreme Court of the State of New York, County of Kings" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., IND-2024-00123" }
    : input
);

// NY base sections (uses NY counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// ============================================================================
// California-Specific Sections
// ============================================================================

const californiaSections: TemplateSection[] = [
  // CA caption with CA counties, hearing info, and reason sections
  ...caBaseSections,

  // California-specific good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a California criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under California Penal Code section 1050, courts may grant continuances only upon a showing of "good cause." This standard is specifically defined and courts must consider the general convenience and interests of justice.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes "good cause" under California Penal Code § 1050
3. Address any concerns about delay, particularly regarding custody status and speedy trial rights under § 1382
4. Note if this is stipulated by the prosecution (joint motions are viewed more favorably)
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual. Reference California's strong policy against continuances while showing this case meets the good cause standard.`,
    aiInstructions: "Reference California Penal Code § 1050 and § 1382 where appropriate. Note California's general policy disfavoring continuances.",
    helpText: "AI will generate a California-specific good cause statement",
  },

  // California-specific legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a California criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable California law includes:
- Penal Code § 1050: Requires "good cause" for any continuance; continuances shall be granted only upon affirmative showing
- Penal Code § 1050(e): Written motion required with affidavit or declaration setting forth facts showing good cause
- Penal Code § 1382: Speedy trial requirements (30 days if in custody for misdemeanor, 60 days if in custody for felony, 45 days if out of custody)
- California Rules of Court, Rule 4.115: Standards and requirements for criminal continuances

Generate 2-3 paragraphs that:
1. Cite Penal Code § 1050's "good cause" standard and requirements
2. Apply the § 1050 factors to this specific case
3. If the defendant is in custody, address Penal Code § 1382 speedy trial implications
4. Reference relevant California case law on continuances if applicable
5. Cite California Rules of Court Rule 4.115 requirements

Use proper California legal citation format (e.g., "Cal. Penal Code § 1050").`,
    aiInstructions: "Must cite California Penal Code § 1050 and § 1382. Use California citation format throughout.",
    helpText: "AI will generate California-specific legal arguments with proper citations",
  },

  // California prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to California Penal Code section 1050 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the continued hearing date within the time limits prescribed by California Penal Code section 1382, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California-specific prayer for relief citing Penal Code",
  },

  // Signature block same as base
  baseSections[6],

  // California certificate of service
  {
    id: "certificateOfService",
    name: "Proof of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `PROOF OF SERVICE

STATE OF CALIFORNIA, COUNTY OF ____________________

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of California. My business address is _________________________.

On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// CACD Federal Sections (Central District of California)
// ============================================================================

const cacdFederalSections: TemplateSection[] = [
  // CA caption with CA counties, hearing info, and reason sections
  ...caBaseSections,

  // Federal good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the Central District of California.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the Central District of California.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- CACD Local Rule 16-12: Continuance procedures
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference CACD Local Rules where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service
[ ] Facsimile transmission

UNITED STATES OF AMERICA
c/o United States Attorney
Central District of California
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

  // NY good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to adjourn (continue) in a New York criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under New York Criminal Procedure Law \u00A7 30.30, the prosecution must be ready for trial within specified time limits (6 months for felonies, 90 days for Class A misdemeanors, 60 days for Class B misdemeanors, 30 days for violations). Adjournments may be charged to either party. Under CPL \u00A7 30.20, the defendant has a right to a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the adjournment request
2. Explain why the adjournment is necessary and in the interest of justice
3. Address any concerns about delay, particularly regarding CPL \u00A7 30.30 time limits and custody status
4. Note if this is stipulated by the prosecution (consent adjournments)
5. If prior adjournments exist, distinguish this request

Use formal legal writing style. Be persuasive but factual. Note that New York uses the term "adjournment" rather than "continuance."`,
    aiInstructions: "Reference CPL \u00A7 30.30 and \u00A7 30.20 where appropriate. Use New York legal terminology ('adjournment' not 'continuance').",
    helpText: "AI will generate a New York-specific good cause statement",
  },

  // NY legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to adjourn in a New York criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable New York law includes:
- CPL \u00A7 30.30: Speedy trial time limitations (prosecution readiness requirement)
- CPL \u00A7 30.20: Right to speedy trial (codifying Sixth Amendment)
- CPL \u00A7 30.30(4): Excludable time periods (including reasonable adjournments at defense request)
- People v. Taranovich, 37 N.Y.2d 442 (1975): Five-factor balancing test for speedy trial claims
- People v. Cortes, 80 N.Y.2d 201 (1992): Standard for analyzing CPL \u00A7 30.30 claims
- 22 NYCRR \u00A7 202.7: Adjournment practice requirements

Generate 2-3 paragraphs that:
1. Cite CPL \u00A7 30.30's time limitation framework and how this adjournment affects the calculation
2. Apply the factors from People v. Taranovich to support the request
3. If the defendant is in custody, address CPL \u00A7 180.80 and habeas corpus implications
4. Reference applicable Uniform Rules (22 NYCRR) for adjournment practice
5. Cite relevant New York case law on adjournments

Use proper New York legal citation format (e.g., "CPL \u00A7 30.30").`,
    aiInstructions: "Must cite CPL \u00A7 30.30 and relevant New York case law. Use New York citation format throughout.",
    helpText: "AI will generate New York-specific legal arguments with proper citations",
  },

  // NY prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this application for an adjournment pursuant to the Court's inherent authority and CPL \u00A7 30.30 and:

1. Adjourn the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the adjourned hearing date within the time limits prescribed by CPL \u00A7 30.30, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing CPL",
  },

  // Signature block same as base
  baseSections[6],

  // NY certificate of service
  {
    id: "certificateOfService",
    name: "Affidavit of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `AFFIDAVIT OF SERVICE

STATE OF NEW YORK, COUNTY OF ____________________

I, the undersigned, being duly sworn, depose and say that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of New York.

On the date below, I served a copy of the foregoing MOTION TO CONTINUE upon all parties in this action by the following method:

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
// New York Federal Sections
// ============================================================================

const nyFederalSections: TemplateSection[] = [
  ...nyBaseSections,

  // Federal good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of New York.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Second Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of New York.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Second Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Second Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Second Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (NY)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Texas-Specific Sections
// ============================================================================

// TX-specific caption inputs (same fields but with TX counties)
const txCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: TX_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Harris County, Texas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., 2024-CR-12345" }
    : input
);

// TX base sections (uses TX counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  // TX good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Texas criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Texas Code of Criminal Procedure Articles 29.03 through 29.13, courts may grant continuances for "sufficient cause." Texas has no statutory speedy trial act, but the Sixth Amendment right to a speedy trial applies. If the defendant is in custody, address the Barker v. Wingo factors.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes "sufficient cause" under Tex. Code Crim. Proc. Art. 29.03
3. Address any concerns about delay, particularly if the defendant is in custody, referencing Barker v. Wingo, 407 U.S. 514 (1972)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Tex. Code Crim. Proc. Art. 29.03-29.13 where appropriate. Note that Texas has no statutory speedy trial act but Sixth Amendment applies.",
    helpText: "AI will generate a Texas-specific good cause statement",
  },

  // TX legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Texas criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 29.03: Continuance for "sufficient cause"
- Tex. Code Crim. Proc. Art. 29.06: First-term continuance by consent
- Tex. Code Crim. Proc. Art. 29.07: Sworn motion required for continuance after first term
- Tex. Code Crim. Proc. Art. 29.08: Continuance by agreement of parties
- Tex. Code Crim. Proc. Art. 29.13: Continuance after trial commenced
- Barker v. Wingo, 407 U.S. 514 (1972): Four-factor balancing test for Sixth Amendment speedy trial analysis
- Texas has no statutory speedy trial act (unlike California or New York)

Generate 2-3 paragraphs that:
1. Cite Art. 29.03's "sufficient cause" standard
2. Apply the applicable article (Art. 29.06 for first-term consent, Art. 29.07 for sworn motion, Art. 29.08 for agreed continuances) to this specific case
3. If the defendant is in custody, analyze the Barker v. Wingo four factors: (1) length of delay, (2) reason for delay, (3) defendant's assertion of the right, (4) prejudice to defendant
4. Reference the trial court's broad discretion in granting continuances under Texas law
5. If applicable, cite Art. 29.13 regarding continuances after trial has commenced

Use proper Texas legal citation format (e.g., "Tex. Code Crim. Proc. art. 29.03").`,
    aiInstructions: "Must cite Tex. Code Crim. Proc. Art. 29.03 and related articles. Reference Barker v. Wingo if defendant is in custody. Use Texas citation format throughout.",
    helpText: "AI will generate Texas-specific legal arguments with proper citations",
  },

  // TX prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Texas Code of Criminal Procedure Articles 29.03 through 29.13 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing Code of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // TX certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TEXAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Texas Federal Sections
// ============================================================================

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  // Federal good cause statement (Fifth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Texas.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fifth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fifth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Texas.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Fifth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fifth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Fifth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (TX)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Florida-Specific Sections
// ============================================================================

// FL-specific caption inputs (same fields but with FL counties)
const flCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: FL_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Eleventh Judicial Circuit, Miami-Dade County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., F24-012345" }
    : input
);

// FL base sections (uses FL counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// PA-specific caption inputs (same fields but with PA counties)
const paCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: PA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Philadelphia County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CP-XX-CR-XXXXXXX-YYYY" }
    : input
);

// PA base sections (uses PA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// IL-specific caption inputs (same fields but with IL counties)
const ilCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: IL_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of Cook County, Illinois" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-CF-XXXXXX" }
    : input
);

// IL base sections (uses IL counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// OH-specific caption inputs (same fields but with OH counties)
const ohCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: OH_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Cuyahoga County, Ohio" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-YYYY-XXXXXX" }
    : input
);

// OH base sections (uses OH counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// GA-specific caption inputs (same fields but with GA counties)
const gaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, helpText: "The county where the court is located (used in caption for state courts)", validation: { ...input.validation, options: GA_COUNTIES } }
    : input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Fulton County, Georgia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-X-XXXXX" }
    : input
);

// GA base sections (uses GA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  // FL good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Florida criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Florida Rule of Criminal Procedure 3.190(g), courts may grant continuances for good cause shown. The speedy trial rule under Fla. R. Crim. P. 3.191 provides 175 days for felonies and 90 days for misdemeanors. Courts must also consider Fla. R. Jud. Admin. 2.545 regarding case management and time standards.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes "good cause" under Fla. R. Crim. P. 3.190(g)
3. Address any concerns about delay, particularly regarding Fla. R. Crim. P. 3.191 speedy trial requirements and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Fla. R. Crim. P. 3.190(g) and 3.191 where appropriate. Note Florida's speedy trial rule time limits.",
    helpText: "AI will generate a Florida-specific good cause statement",
  },

  // FL legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Florida criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.190(g): Continuances for good cause shown
- Fla. R. Crim. P. 3.191: Speedy trial (175 days for felonies, 90 days for misdemeanors)
- Fla. R. Crim. P. 3.191(l): Defendant may waive speedy trial in writing
- Fla. R. Jud. Admin. 2.545: Case management and time standards
- Bennett v. State, 587 So. 2d 657 (Fla. 3d DCA 1991): Standard for reviewing continuance rulings
- State v. Agee, 622 So. 2d 473 (Fla. 1993): Speedy trial rule analysis

Generate 2-3 paragraphs that:
1. Cite Fla. R. Crim. P. 3.190(g)'s "good cause" standard
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Fla. R. Crim. P. 3.191 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Florida law
5. Cite Fla. R. Jud. Admin. 2.545 regarding case management standards

Use proper Florida legal citation format (e.g., "Fla. R. Crim. P. 3.190(g)").`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.190(g) and 3.191. Use Florida citation format throughout.",
    helpText: "AI will generate Florida-specific legal arguments with proper citations",
  },

  // FL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Florida Rule of Criminal Procedure 3.190(g) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the continued hearing date within the time limits prescribed by Florida Rule of Criminal Procedure 3.191, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // FL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF FLORIDA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Florida Federal Sections
// ============================================================================

const flFederalSections: TemplateSection[] = [
  ...flBaseSections,

  // Federal good cause statement (Eleventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Florida.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Eleventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Florida.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Eleventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Eleventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Eleventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (FL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Pennsylvania-Specific Sections
// ============================================================================

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  // PA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Pennsylvania criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Pennsylvania Rule of Criminal Procedure 106, courts may grant continuances in criminal cases for good cause shown. Pa.R.Crim.P. 106 requires that a motion for continuance be made to the court and that the court consider all relevant factors including the impact on the administration of justice.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes "good cause" under Pa.R.Crim.P. 106
3. Address any concerns about delay, particularly regarding speedy trial rights under Pa.R.Crim.P. 600 and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Pa.R.Crim.P. 106 and Pa.R.Crim.P. 600 where appropriate. Use Pennsylvania legal citation format.",
    helpText: "AI will generate a Pennsylvania-specific good cause statement",
  },

  // PA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Pennsylvania criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Pennsylvania law includes:
- Pa.R.Crim.P. 106: Continuances in criminal cases for good cause shown
- 42 Pa.C.S. \u00A7 5505: Modification of orders
- PA Const. Art. I, \u00A7 9: Rights of accused in criminal prosecutions, including speedy trial
- Pa.R.Crim.P. 600: Prompt trial (365 days for commencement of trial)
- Commonwealth v. Hunt, 858 A.2d 1234 (Pa. Super. 2004): Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite Pa.R.Crim.P. 106's "good cause" standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Pa.R.Crim.P. 600 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Pennsylvania law
5. Address PA Const. Art. I, \u00A7 9 speedy trial protections

Use proper Pennsylvania legal citation format (e.g., "Pa.R.Crim.P. 106").`,
    aiInstructions: "Must cite Pa.R.Crim.P. 106, 42 Pa.C.S. \u00A7 5505, and PA Const. Art. I, \u00A7 9. Use Pennsylvania citation format throughout.",
    helpText: "AI will generate Pennsylvania-specific legal arguments with proper citations",
  },

  // PA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Pennsylvania Rule of Criminal Procedure 106 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the continued hearing date within the time limits prescribed by Pa.R.Crim.P. 600, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // PA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF PENNSYLVANIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Pennsylvania Federal Sections
// ============================================================================

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  // Federal good cause statement (Third Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Pennsylvania.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Third Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Third Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Pennsylvania.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Third Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Third Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Third Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (PA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Illinois-Specific Sections
// ============================================================================

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  // IL good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Illinois criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under 725 ILCS 5/114-4, courts may grant continuances in criminal cases. The speedy trial statute, 725 ILCS 5/103-5, provides that every person in custody for an alleged offense shall be tried within 120 days from the date of custody. For defendants on bail, the speedy trial term is 160 days if a demand for trial has been filed.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under 725 ILCS 5/114-4
3. Address any concerns about delay, particularly regarding 725 ILCS 5/103-5 speedy trial requirements (120 days felony in custody, 160 days if demand not filed) and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 725 ILCS 5/114-4 and 725 ILCS 5/103-5 where appropriate. Use Illinois legal citation format.",
    helpText: "AI will generate an Illinois-specific good cause statement",
  },

  // IL legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Illinois criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Illinois law includes:
- 725 ILCS 5/114-4: Continuances in criminal cases
- 725 ILCS 5/103-5: Speedy trial (120 days in custody for felony, 160 days if demand for trial not filed)
- Ill. S. Ct. Rule 231: Continuances in general
- People v. Bowman, 138 Ill. 2d 131 (1990): Standard for reviewing continuance rulings
- IL Const. Art. I, \u00A7 8: Right to speedy trial

Generate 2-3 paragraphs that:
1. Cite 725 ILCS 5/114-4's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address 725 ILCS 5/103-5 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Illinois law
5. Cite Ill. S. Ct. Rule 231 regarding continuance procedures

Use proper Illinois legal citation format (e.g., "725 ILCS 5/114-4").`,
    aiInstructions: "Must cite 725 ILCS 5/114-4, 725 ILCS 5/103-5, and Ill. S. Ct. Rule 231. Use Illinois citation format throughout.",
    helpText: "AI will generate Illinois-specific legal arguments with proper citations",
  },

  // IL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to 725 ILCS 5/114-4 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the continued hearing date within the time limits prescribed by 725 ILCS 5/103-5, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing Illinois Compiled Statutes",
  },

  // Signature block same as base
  baseSections[6],

  // IL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ILLINOIS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Illinois e-filing system to the email address(es) of record.

PEOPLE OF THE STATE OF ILLINOIS
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
// Illinois Federal Sections
// ============================================================================

const ilFederalSections: TemplateSection[] = [
  ...ilBaseSections,

  // Federal good cause statement (Seventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Illinois.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Seventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Seventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Illinois.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Seventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Seventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Seventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (IL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Ohio-Specific Sections
// ============================================================================

const ohioSections: TemplateSection[] = [
  ...ohBaseSections,

  // OH good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Ohio criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Ohio Criminal Rule 10, courts may grant continuances for good cause shown. The speedy trial statute, ORC \u00A7 2945.71, provides that a person charged with a felony must be brought to trial within 90 days after arrest or service of summons, or 270 days if the defendant is out on bail for a felony. ORC \u00A7 2945.72 sets forth excludable time periods.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Ohio Crim.R. 10
3. Address any concerns about delay, particularly regarding ORC \u00A7 2945.71 speedy trial requirements (90 days felony, 270 days if out on bail for felony) and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Ohio Crim.R. 10, ORC \u00A7 2945.71, and ORC \u00A7 2945.72 where appropriate. Use Ohio legal citation format.",
    helpText: "AI will generate an Ohio-specific good cause statement",
  },

  // OH legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Ohio criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Ohio law includes:
- Ohio Crim.R. 10: Continuances for good cause shown
- ORC \u00A7 2945.71: Speedy trial (90 days for felony, 270 days if out on bail for felony)
- ORC \u00A7 2945.72: Excludable time periods for speedy trial computation
- OH Const. Art. I, \u00A7 10: Right to speedy trial
- State v. Pachay, 64 Ohio St. 2d 218 (1980): Standard for reviewing continuance rulings
- State v. Singer, 50 Ohio St. 2d 103 (1977): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite Ohio Crim.R. 10's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address ORC \u00A7 2945.71 speedy trial implications
4. Reference ORC \u00A7 2945.72 regarding excludable time periods
5. Address OH Const. Art. I, \u00A7 10 speedy trial protections

Use proper Ohio legal citation format (e.g., "Ohio Crim.R. 10").`,
    aiInstructions: "Must cite Ohio Crim.R. 10, ORC \u00A7 2945.71, ORC \u00A7 2945.72, and OH Const. Art. I, \u00A7 10. Use Ohio citation format throughout.",
    helpText: "AI will generate Ohio-specific legal arguments with proper citations",
  },

  // OH prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Ohio Criminal Rule 10 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. If the defendant is in custody, set the continued hearing date within the time limits prescribed by ORC \u00A7 2945.71, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing Criminal Rules",
  },

  // Signature block same as base
  baseSections[6],

  // OH certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OHIO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

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
// Ohio Federal Sections
// ============================================================================

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  // Federal good cause statement (Sixth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Ohio.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Sixth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Ohio.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Sixth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Sixth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Sixth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (OH)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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
// Georgia-Specific Sections
// ============================================================================

const georgiaSections: TemplateSection[] = [
  ...gaBaseSections,

  // GA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Georgia criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under O.C.G.A. \u00A7 17-8-22, courts may grant continuances in criminal proceedings upon sufficient showing. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes sufficient cause under O.C.G.A. \u00A7 17-8-22
3. Address any concerns about delay, particularly regarding O.C.G.A. \u00A7 17-7-170 speedy trial demand and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference O.C.G.A. \u00A7 17-8-22 and O.C.G.A. \u00A7 17-7-170 where appropriate. Use Georgia legal citation format.",
    helpText: "AI will generate a Georgia-specific good cause statement",
  },

  // GA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Georgia criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Georgia law includes:
- O.C.G.A. \u00A7 17-8-22: Continuances in criminal proceedings
- O.C.G.A. \u00A7 17-7-170: Speedy trial demand (defendant may demand trial at the term of court when the indictment is found or at the next succeeding regular term)
- GA Const. Art. I, \u00A7 I, Para. XII: Right to speedy trial
- Horne v. State, 262 Ga. 170 (1992): Standard for reviewing continuance rulings
- Ruffin v. State, 243 Ga. 95 (1979): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite O.C.G.A. \u00A7 17-8-22's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address O.C.G.A. \u00A7 17-7-170 speedy trial demand implications
4. Reference the trial court's discretion in granting continuances under Georgia law
5. Address GA Const. Art. I, \u00A7 I, Para. XII speedy trial protections

Use proper Georgia legal citation format (e.g., "O.C.G.A. \u00A7 17-8-22").`,
    aiInstructions: "Must cite O.C.G.A. \u00A7 17-8-22, O.C.G.A. \u00A7 17-7-170, and GA Const. Art. I, \u00A7 I, Para. XII. Use Georgia citation format throughout.",
    helpText: "AI will generate Georgia-specific legal arguments with proper citations",
  },

  // GA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to O.C.G.A. \u00A7 17-8-22 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing O.C.G.A.",
  },

  // Signature block same as base
  baseSections[6],

  // GA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF GEORGIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

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
// Georgia Federal Sections
// ============================================================================

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  // Federal good cause statement (Eleventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Georgia.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. \u00A7 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. \u00A7 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. \u00A7 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Eleventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Georgia.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. \u00A7 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under \u00A7 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. \u00A7 3161(h)(7)(B)(iv): Factors court must consider
- Eleventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Eleventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. \u00A7 3161").`,
    aiInstructions: "Must cite 18 U.S.C. \u00A7 3161 and Federal Rules of Criminal Procedure. Reference Eleventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. \u00A7 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. \u00A7 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (GA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

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

export const motionToContinueTemplate: DocumentTemplate = {
  id: "motion-to-continue",
  name: "Motion to Continue",
  category: "criminal",
  description: "Request a continuance of a scheduled hearing in a criminal matter. This motion asks the court to postpone a hearing date due to good cause such as attorney scheduling conflicts, incomplete discovery, witness unavailability, or other legitimate reasons.",
  version: "1.0.0",
  lastUpdated: new Date("2024-01-25"),
  baseSections,
  jurisdictionVariants: [
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "California courts require line numbers in the left margin. Motions must be served at least 10 court days before the hearing unless good cause is shown for a shorter notice period.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: cacdFederalSections,
      courtSpecificRules: "CACD L.R. 11-3: 14pt font required. Pages numbered at bottom. Attorney header lines 1-7, court title on/below line 8. Double-spaced per L.R. 11-3.6.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: cacdFederalSections,
      courtSpecificRules: "N.D. Cal.: 14pt font. Double-spaced. Pages numbered at bottom. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: cacdFederalSections,
      courtSpecificRules: "E.D. Cal. L.R. 130(b): 12pt font. Double-spaced. Pages numbered at bottom.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: cacdFederalSections,
      courtSpecificRules: "S.D. Cal.: 14pt font. Double-spaced. Pages numbered at bottom. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: newYorkSections,
      courtSpecificRules: "New York courts use the term 'adjournment' rather than 'continuance.' Motions must comply with 22 NYCRR \u00A7 202.7 requirements.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "S.D.N.Y.: 12pt font. Double-spaced. CM/ECF electronic filing required. Local Criminal Rule 16.1.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "E.D.N.Y.: 12pt font. Double-spaced. CM/ECF electronic filing required. Local Criminal Rule 16.1.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "N.D.N.Y.: 12pt font. Double-spaced. CM/ECF electronic filing required. Local Rule 10.1.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "W.D.N.Y.: 12pt font. Double-spaced. CM/ECF electronic filing required. Local Rule 10(a).",
    },
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: texasSections,
      courtSpecificRules: "Texas courts require 14pt font for computer-generated documents. Motions for continuance must comply with Tex. Code Crim. Proc. Art. 29.03-29.13. E-filing via eFileTexas.gov mandatory for attorneys in most counties.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "N.D. Tex.: 12pt font. Double-spaced. CM/ECF electronic filing required. TXND L.R. 5.1.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "S.D. Tex.: 12pt font. Double-spaced. CM/ECF electronic filing required. TXSD L.R. 5.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "E.D. Tex.: 12pt font. Double-spaced. CM/ECF electronic filing required. TXED L.R. CV-10.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "W.D. Tex.: 12pt font. Double-spaced. CM/ECF electronic filing required. TXWD L.R. CV-10.",
    },
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: floridaSections,
      courtSpecificRules: "Florida courts use 12pt font. Motions for continuance must comply with Fla. R. Crim. P. 3.190(g). Speedy trial under Fla. R. Crim. P. 3.191 (175 days felony, 90 days misdemeanor). E-filing via Florida Courts E-Filing Portal mandatory.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "S.D. Fla.: 12pt font. Double-spaced. CM/ECF electronic filing required. FLSD L.R. 5.1.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "M.D. Fla.: 12pt font. Double-spaced. CM/ECF electronic filing required. FLMD L.R. 1.05.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "N.D. Fla.: 12pt font. Double-spaced. CM/ECF electronic filing required. FLND L.R. 5.1.",
    },
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: pennsylvaniaSections,
      courtSpecificRules: "Pennsylvania courts use 12pt font. Motions for continuance must comply with Pa.R.Crim.P. 106. Speedy trial under Pa.R.Crim.P. 600 (365 days for commencement of trial). E-filing via PACFile mandatory for attorneys in most counties.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "E.D. Pa.: 12pt font. Double-spaced. CM/ECF electronic filing required. PAED L.R. 5.1.2.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "M.D. Pa.: 12pt font. Double-spaced. CM/ECF electronic filing required. PAMD L.R. 5.2.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "W.D. Pa.: 12pt font. Double-spaced. CM/ECF electronic filing required. PAWD L.R. 5.1.",
    },
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: illinoisSections,
      courtSpecificRules: "Illinois courts use 12pt font. Motions for continuance must comply with 725 ILCS 5/114-4. Speedy trial under 725 ILCS 5/103-5 (120 days in custody, 160 days if demand not filed). E-filing mandatory in most counties.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "N.D. Ill.: 12pt font. Double-spaced. CM/ECF electronic filing required. ILND L.R. 5.2.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "C.D. Ill.: 12pt font. Double-spaced. CM/ECF electronic filing required. ILCD L.R. 5.1.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "S.D. Ill.: 12pt font. Double-spaced. CM/ECF electronic filing required. ILSD L.R. 5.1.",
    },
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohioSections,
      courtSpecificRules: "Ohio courts use 12pt font. Motions for continuance must comply with Ohio Crim.R. 10. Speedy trial under ORC \u00A7 2945.71 (90 days felony, 270 days if out on bail for felony). E-filing via court e-filing system in most counties.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "N.D. Ohio: 12pt font. Double-spaced. CM/ECF electronic filing required. OHND L.R. 5.1.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "S.D. Ohio: 12pt font. Double-spaced. CM/ECF electronic filing required. OHSD L.R. 5.1.",
    },
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: georgiaSections,
      courtSpecificRules: "Georgia courts use 12pt font. Motions for continuance must comply with O.C.G.A. \u00A7 17-8-22. Speedy trial demand under O.C.G.A. \u00A7 17-7-170. E-filing via court e-filing system in most counties.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "N.D. Ga.: 12pt font. Double-spaced. CM/ECF electronic filing required. GAND L.R. 5.1.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "M.D. Ga.: 12pt font. Double-spaced. CM/ECF electronic filing required. GAMD L.R. 5.1.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "S.D. Ga.: 12pt font. Double-spaced. CM/ECF electronic filing required. GASD L.R. 5.1.",
    },
  ],
  estimatedCompletionTime: "10-15 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD"],
};

// Export for use in template registry
export default motionToContinueTemplate;
