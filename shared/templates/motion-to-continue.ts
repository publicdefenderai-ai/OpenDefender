/**
 * Motion to Continue Template
 *
 * Criminal law document template for requesting a continuance of a hearing.
 * Includes jurisdiction-specific variants (CA, NY, TX) with proper statutory citations.
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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
  input.id === "courtName"
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

// NC-specific caption inputs (same fields but with NC counties)
const ncCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of [County], North Carolina" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY CRS XXXXXX" }
    : input
);

// NC base sections (uses NC counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// MI-specific caption inputs (same fields but with MI counties)
const miCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Circuit Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-XXXXXX-FH" }
    : input
);

// MI base sections (uses MI counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// NJ-specific caption inputs (same fields but with NJ counties)
const njCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of New Jersey, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XXXXXX" }
    : input
);

// NJ base sections (uses NJ counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// VA-specific caption inputs (same fields but with VA counties)
const vaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County/City], Virginia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CRXXXXX-XX" }
    : input
);

// VA base sections (uses VA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// WA-specific caption inputs (same fields but with WA counties)
const waCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Washington, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-X-XXXXX-X" }
    : input
);

// WA base sections (uses WA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// AZ-specific caption inputs (same fields but with AZ counties)
const azCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Arizona, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR YYYY-XXXXXX" }
    : input
);

// AZ base sections (uses AZ counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// MA-specific caption inputs (same fields but with MA counties)
const maCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX CR XXXXX" }
    : input
);

// MA base sections (uses MA counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// TN-specific caption inputs (same fields but with TN counties)
const tnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Criminal Court of [County], Tennessee" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-CR-XXXX" }
    : input
);

// TN base sections (uses TN counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// IN-specific caption inputs (same fields but with IN counties)
const inCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior/Circuit Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XXXX-F-XXXX" }
    : input
);

// IN base sections (uses IN counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// MD-specific caption inputs (same fields but with MD counties)
const mdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court for [County], Maryland" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXXXXX" }
    : input
);

// MD base sections (uses MD counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// MO-specific caption inputs (same fields but with MO counties)
const moCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Missouri" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
    : input
);

// MO base sections (uses MO counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// WI-specific caption inputs (same fields but with WI counties)
const wiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court for [County] County, Wisconsin" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXX" }
    : input
);

// WI base sections (uses WI counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// CO-specific caption inputs (same fields but with CO counties)
const coCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Colorado" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
    : input
);

// CO base sections (uses CO counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// MN-specific caption inputs (same fields but with MN counties)
const mnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Minnesota" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XX-XXXX" }
    : input
);

// MN base sections (uses MN counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// SC-specific caption inputs (same fields but with SC counties)
const scCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of General Sessions, [County] County, South Carolina" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-GS-XX-XXXXX" }
    : input
);

// SC base sections (uses SC counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// AL-specific caption inputs (same fields but with AL counties)
const alCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Alabama" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CC-XXXX-XXXXXX" }
    : input
);

// AL base sections (uses AL counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// LA-specific caption inputs (same fields but with LA parishes)
const laCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [Judicial District] District Court, Parish of [Parish], Louisiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXXX" }
    : input
);

// LA base sections (uses LA parishes in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// KY-specific caption inputs (same fields but with KY counties)
const kyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Circuit Court, Kentucky" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXXX" }
    : input
);

// KY base sections (uses KY counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// OR-specific caption inputs (same fields but with OR counties)
const orCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the State of Oregon for [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXCRXXXXX" }
    : input
);

// OR base sections (uses OR counties in caption)
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
  baseSections[1], // hearingInfo
  baseSections[2], // reason
];

// OK-specific caption inputs (same fields but with OK counties)
const okCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, State of Oklahoma" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CF-XXXX-XXXX" }
    : input
);

// OK base sections (uses OK counties in caption)
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
// North Carolina-Specific Sections
// ============================================================================

const northCarolinaSections: TemplateSection[] = [
  ...ncBaseSections,

  // NC good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a North Carolina criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under N.C. Gen. Stat. § 15A-952, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under N.C. Gen. Stat. § 15A-952
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference N.C. Gen. Stat. § 15A-952 where appropriate. Use North Carolina legal citation format.",
    helpText: "AI will generate a North Carolina-specific good cause statement",
  },

  // NC legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a North Carolina criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable North Carolina law includes:
- N.C. Gen. Stat. § 15A-952: Continuances in criminal proceedings
- N.C. Const. Art. I, § 18: Right to speedy trial
- State v. Spivey, 357 N.C. 114 (2003): Standard for reviewing continuance rulings
- State v. McCoy, 303 N.C. 1 (1981): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite N.C. Gen. Stat. § 15A-952's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under North Carolina law
5. Address N.C. Const. Art. I, § 18 speedy trial protections

Use proper North Carolina legal citation format (e.g., "N.C. Gen. Stat. § 15A-952").`,
    aiInstructions: "Must cite N.C. Gen. Stat. § 15A-952 and N.C. Const. Art. I, § 18. Use North Carolina citation format throughout.",
    helpText: "AI will generate North Carolina-specific legal arguments with proper citations",
  },

  // NC prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to N.C. Gen. Stat. § 15A-952 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief citing N.C. Gen. Stat.",
  },

  // Signature block same as base
  baseSections[6],

  // NC certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NORTH CAROLINA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF NORTH CAROLINA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of North Carolina that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, North Carolina.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "North Carolina-specific certificate of service format",
  },
];

// ============================================================================
// North Carolina Federal Sections
// ============================================================================

const ncFederalSections: TemplateSection[] = [
  ...ncBaseSections,

  // Federal good cause statement (Fourth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of North Carolina.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fourth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fourth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of North Carolina.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Fourth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fourth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Fourth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (NC)
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
// Michigan-Specific Sections
// ============================================================================

const michiganSections: TemplateSection[] = [
  ...miBaseSections,

  // MI good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue (adjournment) in a Michigan criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under MCR 2.503, courts may grant adjournments in criminal proceedings for good cause shown. The court has discretion to grant or deny adjournments based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the adjournment request
2. Explain why this constitutes good cause under MCR 2.503
3. Address any concerns about delay, particularly regarding speedy trial rights under MCL 768.1 and custody status
4. Note if this is stipulated by the prosecution
5. If prior adjournments exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference MCR 2.503 where appropriate. Use Michigan legal citation format. Note: Michigan uses 'adjournment' rather than 'continuance'.",
    helpText: "AI will generate a Michigan-specific good cause statement",
  },

  // MI legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue (adjournment) in a Michigan criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Michigan law includes:
- MCR 2.503: Adjournments in court proceedings
- MCL 768.1: Speedy trial provisions
- MI Const. Art. I, § 20: Rights of accused
- People v. Collins, 388 Mich. 680 (1972): Standard for reviewing adjournment rulings
- People v. Grimmett, 388 Mich. 590 (1972): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite MCR 2.503's standard for adjournments
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address MCL 768.1 speedy trial implications
4. Reference the trial court's discretion in granting adjournments under Michigan law
5. Address MI Const. Art. I, § 20 speedy trial protections

Use proper Michigan legal citation format (e.g., "MCR 2.503").`,
    aiInstructions: "Must cite MCR 2.503, MCL 768.1, and MI Const. Art. I, § 20. Use Michigan citation format throughout.",
    helpText: "AI will generate Michigan-specific legal arguments with proper citations",
  },

  // MI prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Adjourn pursuant to MCR 2.503 and:

1. Adjourn the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the adjourned hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief citing Michigan Court Rules",
  },

  // Signature block same as base
  baseSections[6],

  // MI certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MICHIGAN, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO ADJOURN on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via Michigan e-Filing to the email address(es) of record.

STATE OF MICHIGAN
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Michigan that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Michigan.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Michigan-specific certificate of service format",
  },
];

// ============================================================================
// Michigan Federal Sections
// ============================================================================

const miFederalSections: TemplateSection[] = [
  ...miBaseSections,

  // Federal good cause statement (Sixth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Michigan.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Sixth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Michigan.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Sixth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Sixth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Sixth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (MI)
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
// New Jersey-Specific Sections
// ============================================================================

const newJerseySections: TemplateSection[] = [
  ...njBaseSections,

  // NJ good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue (adjourn) in a New Jersey criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under N.J. Ct. R. 3:10-3, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under N.J. Ct. R. 3:10-3
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference N.J. Ct. R. 3:10-3 where appropriate. Use New Jersey legal citation format.",
    helpText: "AI will generate a New Jersey-specific good cause statement",
  },

  // NJ legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a New Jersey criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable New Jersey law includes:
- N.J. Ct. R. 3:10-3: Continuances in criminal proceedings
- N.J. Ct. R. 3:25-4: Speedy trial standards
- N.J. Const. Art. I, § 10: Rights of accused
- State v. Cahill, 213 N.J. 253 (2013): Standard for reviewing continuance rulings
- State v. Szima, 70 N.J. 196 (1976): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite N.J. Ct. R. 3:10-3's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address N.J. Ct. R. 3:25-4 speedy trial implications
4. Reference the trial court's discretion in granting continuances under New Jersey law
5. Address N.J. Const. Art. I, § 10 speedy trial protections

Use proper New Jersey legal citation format (e.g., "N.J. Ct. R. 3:10-3").`,
    aiInstructions: "Must cite N.J. Ct. R. 3:10-3, N.J. Ct. R. 3:25-4, and N.J. Const. Art. I, § 10. Use New Jersey citation format throughout.",
    helpText: "AI will generate New Jersey-specific legal arguments with proper citations",
  },

  // NJ prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Adjourn pursuant to N.J. Ct. R. 3:10-3 and:

1. Adjourn the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the adjourned hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief citing Court Rules",
  },

  // Signature block same as base
  baseSections[6],

  // NJ certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW JERSEY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO ADJOURN on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via eCourts to the email address(es) of record.

STATE OF NEW JERSEY
c/o County Prosecutor
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of New Jersey that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, New Jersey.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "New Jersey-specific certificate of service format",
  },
];

// ============================================================================
// New Jersey Federal Sections
// ============================================================================

const njFederalSections: TemplateSection[] = [
  ...njBaseSections,

  // Federal good cause statement (Third Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of New Jersey.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Third Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Third Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of New Jersey.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Third Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Third Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Third Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (NJ)
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
// Virginia-Specific Sections
// ============================================================================

const virginiaSections: TemplateSection[] = [
  ...vaBaseSections,

  // VA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Virginia criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Va. Code § 19.2-243, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Va. Code § 19.2-243
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Va. Code § 19.2-243 where appropriate. Use Virginia legal citation format.",
    helpText: "AI will generate a Virginia-specific good cause statement",
  },

  // VA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Virginia criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Virginia law includes:
- Va. Code § 19.2-243: Speedy trial; continuances
- VA Const. Art. I, § 8: Rights of accused in criminal prosecutions
- Fowlkes v. Commonwealth, 218 Va. 763 (1978): Standard for reviewing continuance rulings
- Barker v. Wingo, 407 U.S. 514 (1972): Constitutional speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite Va. Code § 19.2-243's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Va. Code § 19.2-243 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Virginia law
5. Address VA Const. Art. I, § 8 speedy trial protections

Use proper Virginia legal citation format (e.g., "Va. Code § 19.2-243").`,
    aiInstructions: "Must cite Va. Code § 19.2-243 and VA Const. Art. I, § 8. Use Virginia citation format throughout.",
    helpText: "AI will generate Virginia-specific legal arguments with proper citations",
  },

  // VA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Va. Code § 19.2-243 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Virginia prayer for relief citing Va. Code",
  },

  // Signature block same as base
  baseSections[6],

  // VA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF VIRGINIA, COUNTY/CITY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via VACES to the email address(es) of record.

COMMONWEALTH OF VIRGINIA
c/o Commonwealth's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the Commonwealth of Virginia that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Virginia.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Virginia-specific certificate of service format",
  },
];

// ============================================================================
// Virginia Federal Sections
// ============================================================================

const vaFederalSections: TemplateSection[] = [
  ...vaBaseSections,

  // Federal good cause statement (Fourth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Virginia.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fourth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fourth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Virginia.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Fourth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fourth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Fourth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (VA)
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
// Washington-Specific Sections
// ============================================================================

const washingtonSections: TemplateSection[] = [
  ...waBaseSections,

  // WA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Washington criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under CrR 3.3, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case, while considering speedy trial requirements.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under CrR 3.3
3. Address any concerns about delay, particularly regarding CrR 3.3 speedy trial requirements and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference CrR 3.3 where appropriate. Use Washington legal citation format.",
    helpText: "AI will generate a Washington-specific good cause statement",
  },

  // WA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Washington criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Washington law includes:
- CrR 3.3: Time for trial (60 days in custody, 90 days out of custody)
- WA Const. Art. I, § 22: Rights of accused
- State v. Iniguez, 167 Wn.2d 273 (2009): Standard for reviewing continuance rulings
- State v. Kenyon, 167 Wn.2d 130 (2009): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite CrR 3.3's standard for continuances and time for trial
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address CrR 3.3 speedy trial implications (60 days)
4. Reference the trial court's discretion in granting continuances under Washington law
5. Address WA Const. Art. I, § 22 speedy trial protections

Use proper Washington legal citation format (e.g., "CrR 3.3").`,
    aiInstructions: "Must cite CrR 3.3 and WA Const. Art. I, § 22. Use Washington citation format throughout.",
    helpText: "AI will generate Washington-specific legal arguments with proper citations",
  },

  // WA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to CrR 3.3 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within the time limits prescribed by CrR 3.3, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Washington prayer for relief citing Criminal Rules",
  },

  // Signature block same as base
  baseSections[6],

  // WA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WASHINGTON, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF WASHINGTON
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Washington that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Washington.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Washington-specific certificate of service format",
  },
];

// ============================================================================
// Washington Federal Sections
// ============================================================================

const waFederalSections: TemplateSection[] = [
  ...waBaseSections,

  // Federal good cause statement (Ninth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Washington.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Ninth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Ninth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Washington.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Ninth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Ninth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Ninth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (WA)
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
// Arizona-Specific Sections
// ============================================================================

const arizonaSections: TemplateSection[] = [
  ...azBaseSections,

  // AZ good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Arizona criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Ariz. R. Crim. P. 8.5, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Ariz. R. Crim. P. 8.5
3. Address any concerns about delay, particularly regarding Ariz. R. Crim. P. 8.2 speedy trial requirements and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Ariz. R. Crim. P. 8.5 where appropriate. Use Arizona legal citation format.",
    helpText: "AI will generate an Arizona-specific good cause statement",
  },

  // AZ legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Arizona criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Arizona law includes:
- Ariz. R. Crim. P. 8.5: Continuances
- Ariz. R. Crim. P. 8.2: Time limits for trial (150 days in custody, 180 days out of custody)
- AZ Const. Art. II, § 24: Rights of accused
- State v. Spreitz, 202 Ariz. 1 (2002): Standard for reviewing continuance rulings
- State v. Tucker, 215 Ariz. 298 (2007): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite Ariz. R. Crim. P. 8.5's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Ariz. R. Crim. P. 8.2 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Arizona law
5. Address AZ Const. Art. II, § 24 speedy trial protections

Use proper Arizona legal citation format (e.g., "Ariz. R. Crim. P. 8.5").`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 8.5, Ariz. R. Crim. P. 8.2, and AZ Const. Art. II, § 24. Use Arizona citation format throughout.",
    helpText: "AI will generate Arizona-specific legal arguments with proper citations",
  },

  // AZ prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Ariz. R. Crim. P. 8.5 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within the time limits prescribed by Ariz. R. Crim. P. 8.2, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arizona prayer for relief citing Arizona Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // AZ certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ARIZONA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via AZTurboCourt to the email address(es) of record.

STATE OF ARIZONA
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Arizona that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Arizona.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Arizona-specific certificate of service format",
  },
];

// ============================================================================
// Arizona Federal Sections
// ============================================================================

const azFederalSections: TemplateSection[] = [
  ...azBaseSections,

  // Federal good cause statement (Ninth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Arizona.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Ninth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Ninth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Arizona.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Ninth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Ninth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Ninth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (AZ)
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
// Massachusetts-Specific Sections
// ============================================================================

const massachusettsSections: TemplateSection[] = [
  ...maBaseSections,

  // MA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Massachusetts criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Mass. R. Crim. P. 10, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Mass. R. Crim. P. 10
3. Address any concerns about delay, particularly regarding speedy trial rights under Mass. R. Crim. P. 36 and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Mass. R. Crim. P. 10 where appropriate. Use Massachusetts legal citation format.",
    helpText: "AI will generate a Massachusetts-specific good cause statement",
  },

  // MA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Massachusetts criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 10: Continuances
- Mass. R. Crim. P. 36: Case management and time standards
- MA Const. Part I, Art. XI: Rights of accused
- Commonwealth v. Lauria, 411 Mass. 63 (1991): Standard for reviewing continuance rulings
- Barry v. Commonwealth, 390 Mass. 285 (1983): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite Mass. R. Crim. P. 10's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Mass. R. Crim. P. 36 time standards
4. Reference the trial court's discretion in granting continuances under Massachusetts law
5. Address MA Const. Part I, Art. XI speedy trial protections

Use proper Massachusetts legal citation format (e.g., "Mass. R. Crim. P. 10").`,
    aiInstructions: "Must cite Mass. R. Crim. P. 10, Mass. R. Crim. P. 36, and MA Const. Part I, Art. XI. Use Massachusetts citation format throughout.",
    helpText: "AI will generate Massachusetts-specific legal arguments with proper citations",
  },

  // MA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Mass. R. Crim. P. 10 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Massachusetts prayer for relief citing Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // MA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF MASSACHUSETTS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via Massachusetts Trial Court e-filing to the email address(es) of record.

COMMONWEALTH OF MASSACHUSETTS
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the Commonwealth of Massachusetts that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Massachusetts.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Massachusetts-specific certificate of service format",
  },
];

// ============================================================================
// Massachusetts Federal Sections
// ============================================================================

const maFederalSections: TemplateSection[] = [
  ...maBaseSections,

  // Federal good cause statement (First Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Massachusetts.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference First Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (First Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Massachusetts.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- First Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference First Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference First Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (MA)
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
// Tennessee-Specific Sections
// ============================================================================

const tennesseeSections: TemplateSection[] = [
  ...tnBaseSections,

  // TN good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Tennessee criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Tenn. R. Crim. P. 17, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Tenn. R. Crim. P. 17
3. Address any concerns about delay, particularly regarding speedy trial rights under Tenn. R. Crim. P. 48 and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Tenn. R. Crim. P. 17 where appropriate. Use Tennessee legal citation format.",
    helpText: "AI will generate a Tennessee-specific good cause statement",
  },

  // TN legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Tennessee criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 17: Subpoenas; continuances
- Tenn. R. Crim. P. 48: Dismissal; speedy trial
- TN Const. Art. I, § 9: Rights of accused in criminal prosecutions
- State v. Utley, 956 S.W.2d 489 (Tenn. 1997): Standard for reviewing continuance rulings
- State v. Simmons, 54 S.W.3d 755 (Tenn. 2001): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite Tenn. R. Crim. P. 17's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Tenn. R. Crim. P. 48 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Tennessee law
5. Address TN Const. Art. I, § 9 speedy trial protections

Use proper Tennessee legal citation format (e.g., "Tenn. R. Crim. P. 17").`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 17, Tenn. R. Crim. P. 48, and TN Const. Art. I, § 9. Use Tennessee citation format throughout.",
    helpText: "AI will generate Tennessee-specific legal arguments with proper citations",
  },

  // TN prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Tenn. R. Crim. P. 17 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Tennessee prayer for relief citing Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // TN certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TENNESSEE, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF TENNESSEE
c/o District Attorney General
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Tennessee that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Tennessee.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Tennessee-specific certificate of service format",
  },
];

// ============================================================================
// Tennessee Federal Sections
// ============================================================================

const tnFederalSections: TemplateSection[] = [
  ...tnBaseSections,

  // Federal good cause statement (Sixth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Tennessee.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Sixth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Tennessee.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Sixth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Sixth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Sixth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (TN)
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
// Indiana-Specific Sections
// ============================================================================

const indianaSections: TemplateSection[] = [
  ...inBaseSections,

  // IN good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Indiana criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Ind. R. Crim. P. 4 and IC 35-36-7, courts may grant continuances in criminal proceedings for good cause shown. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Indiana law
3. Address any concerns about delay, particularly regarding Ind. R. Crim. P. 4 speedy trial requirements (70 days in custody, 1 year out of custody) and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Ind. R. Crim. P. 4 and IC 35-36-7 where appropriate. Use Indiana legal citation format.",
    helpText: "AI will generate an Indiana-specific good cause statement",
  },

  // IN legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Indiana criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Indiana law includes:
- Ind. R. Crim. P. 4: Speedy trial (70 days in custody, 1 year out of custody)
- IC 35-36-7: Continuances
- IN Const. Art. I, § 12: Rights of accused
- Austin v. State, 997 N.E.2d 1027 (Ind. 2013): Standard for reviewing continuance rulings
- Vermillion v. State, 719 N.E.2d 1201 (Ind. 1999): Speedy trial analysis

Generate 2-3 paragraphs that:
1. Cite the Indiana standard for continuances under IC 35-36-7
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Ind. R. Crim. P. 4 speedy trial implications (70-day rule)
4. Reference the trial court's discretion in granting continuances under Indiana law
5. Address IN Const. Art. I, § 12 speedy trial protections

Use proper Indiana legal citation format (e.g., "Ind. R. Crim. P. 4").`,
    aiInstructions: "Must cite Ind. R. Crim. P. 4, IC 35-36-7, and IN Const. Art. I, § 12. Use Indiana citation format throughout.",
    helpText: "AI will generate Indiana-specific legal arguments with proper citations",
  },

  // IN prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Ind. R. Crim. P. 4 and IC 35-36-7 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within the time limits prescribed by Ind. R. Crim. P. 4, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Indiana prayer for relief citing Criminal Rules and Indiana Code",
  },

  // Signature block same as base
  baseSections[6],

  // IN certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF INDIANA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via Indiana E-Filing System to the email address(es) of record.

STATE OF INDIANA
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Indiana that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Indiana.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Indiana-specific certificate of service format",
  },
];

// ============================================================================
// Indiana Federal Sections
// ============================================================================

const inFederalSections: TemplateSection[] = [
  ...inBaseSections,

  // Federal good cause statement (Seventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Indiana.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Seventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Seventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Indiana.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Seventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Seventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Seventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (IN)
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
// Maryland-Specific Sections
// ============================================================================

const marylandSections: TemplateSection[] = [
  ...mdBaseSections,

  // MD good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue (postponement) in a Maryland criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Md. Rule 4-271, courts may grant postponements in criminal proceedings for good cause shown. The court has discretion to grant or deny postponements based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the postponement request
2. Explain why this constitutes good cause under Md. Rule 4-271
3. Address any concerns about delay, particularly regarding Md. Rule 4-271 time standards (180 days) and custody status
4. Note if this is stipulated by the prosecution
5. If prior postponements exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Md. Rule 4-271 where appropriate. Use Maryland legal citation format. Note: Maryland uses 'postponement' rather than 'continuance'.",
    helpText: "AI will generate a Maryland-specific good cause statement",
  },

  // MD legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue (postponement) in a Maryland criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Maryland law includes:
- Md. Rule 4-271: Postponement of trial (180-day requirement)
- MD Const. Declaration of Rights, Art. 21: Rights of accused
- State v. Hicks, 285 Md. 310 (1979): 180-day rule analysis
- State v. Frazier, 298 Md. 422 (1984): Standard for reviewing postponement rulings

Generate 2-3 paragraphs that:
1. Cite Md. Rule 4-271's standard for postponements and 180-day requirement
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Md. Rule 4-271(a) time standards
4. Reference the trial court's discretion in granting postponements under Maryland law
5. Address MD Const. Declaration of Rights, Art. 21 speedy trial protections

Use proper Maryland legal citation format (e.g., "Md. Rule 4-271").`,
    aiInstructions: "Must cite Md. Rule 4-271 and MD Const. Declaration of Rights, Art. 21. Use Maryland citation format throughout.",
    helpText: "AI will generate Maryland-specific legal arguments with proper citations",
  },

  // MD prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Postpone pursuant to Md. Rule 4-271 and:

1. Postpone the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the postponed hearing date within the time limits prescribed by Md. Rule 4-271, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maryland prayer for relief citing Maryland Rules",
  },

  // Signature block same as base
  baseSections[6],

  // MD certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MARYLAND, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO POSTPONE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via MDEC to the email address(es) of record.

STATE OF MARYLAND
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Maryland that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Maryland.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Maryland-specific certificate of service format",
  },
];

// ============================================================================
// Maryland Federal Sections
// ============================================================================

const mdFederalSections: TemplateSection[] = [
  ...mdBaseSections,

  // Federal good cause statement (Fourth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Maryland.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fourth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fourth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Maryland.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Fourth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fourth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Fourth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (MD)
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
// Missouri-Specific Sections
// ============================================================================

const missouriSections: TemplateSection[] = [
  ...moBaseSections,

  // MO good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Missouri criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under RSMo § 545.780, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under RSMo § 545.780
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference RSMo § 545.780 where appropriate. Use Missouri legal citation format.",
    helpText: "AI will generate a Missouri-specific good cause statement",
  },

  // MO legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Missouri criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Missouri law includes:
- RSMo § 545.780: Continuances in criminal proceedings
- Mo. Const. Art. I, § 18(a): Right to speedy trial
- Missouri Supreme Court Rule 24.10: Time limitations
- State v. Sisco, 458 S.W.2d 293 (Mo. 1970): Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite RSMo § 545.780's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under Missouri law
5. Address Mo. Const. Art. I, § 18(a) speedy trial protections

Use proper Missouri legal citation format (e.g., "RSMo § 545.780").`,
    aiInstructions: "Must cite RSMo § 545.780 and Mo. Const. Art. I, § 18(a). Use Missouri citation format throughout.",
    helpText: "AI will generate Missouri-specific legal arguments with proper citations",
  },

  // MO prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to RSMo § 545.780 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief citing RSMo",
  },

  // Signature block same as base
  baseSections[6],

  // MO certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MISSOURI, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF MISSOURI
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Missouri that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Missouri.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Missouri-specific certificate of service format",
  },
];

// ============================================================================
// Missouri Federal Sections
// ============================================================================

const moFederalSections: TemplateSection[] = [
  ...moBaseSections,

  // Federal good cause statement (Eighth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Missouri.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Eighth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Eighth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Missouri.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Eighth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Eighth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Eighth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (MO)
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
// Wisconsin-Specific Sections
// ============================================================================

const wisconsinSections: TemplateSection[] = [
  ...wiBaseSections,

  // WI good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue (adjournment) in a Wisconsin criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Wis. Stat. § 971.10, defendants have a right to speedy trial. Courts may grant continuances (adjournments) in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Wisconsin law
3. Address any concerns about delay, particularly regarding Wis. Stat. § 971.10 speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Wis. Stat. § 971.10 where appropriate. Use Wisconsin legal citation format. Note: Wisconsin may use 'adjournment' rather than 'continuance'.",
    helpText: "AI will generate a Wisconsin-specific good cause statement",
  },

  // WI legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue (adjournment) in a Wisconsin criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Wisconsin law includes:
- Wis. Stat. § 971.10: Speedy trial requirements (90 days in custody, 60 days from demand if on bail)
- Wis. Const. Art. I, § 7: Right to speedy trial
- State v. Urdahl, 2005 WI App 191: Standard for reviewing continuance rulings
- Court's inherent discretion to manage its docket

Generate 2-3 paragraphs that:
1. Cite the applicable Wisconsin standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Wis. Stat. § 971.10 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Wisconsin law
5. Address Wis. Const. Art. I, § 7 speedy trial protections

Use proper Wisconsin legal citation format (e.g., "Wis. Stat. § 971.10").`,
    aiInstructions: "Must cite Wis. Stat. § 971.10 and Wis. Const. Art. I, § 7. Use Wisconsin citation format throughout.",
    helpText: "AI will generate Wisconsin-specific legal arguments with proper citations",
  },

  // WI prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within any applicable time limits under Wis. Stat. § 971.10, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief",
  },

  // Signature block same as base
  baseSections[6],

  // WI certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WISCONSIN, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via eFiling to the email address(es) of record.

STATE OF WISCONSIN
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Wisconsin that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Wisconsin.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Wisconsin-specific certificate of service format",
  },
];

// ============================================================================
// Wisconsin Federal Sections
// ============================================================================

const wiFederalSections: TemplateSection[] = [
  ...wiBaseSections,

  // Federal good cause statement (Seventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Wisconsin.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Seventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Seventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Wisconsin.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Seventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Seventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Seventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (WI)
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
// Colorado-Specific Sections
// ============================================================================

const coloradoSections: TemplateSection[] = [
  ...coBaseSections,

  // CO good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Colorado criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under C.R.S. § 18-1-405 and Crim.P. 48, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under C.R.S. § 18-1-405 and Crim.P. 48
3. Address any concerns about delay, particularly regarding speedy trial rights (6 months if in custody) and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference C.R.S. § 18-1-405 and Crim.P. 48 where appropriate. Use Colorado legal citation format.",
    helpText: "AI will generate a Colorado-specific good cause statement",
  },

  // CO legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Colorado criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Colorado law includes:
- C.R.S. § 18-1-405: Speedy trial requirements (6 months)
- Crim.P. 48: Continuances
- Colo. Const. Art. II, § 16: Right to speedy trial
- People v. Small, 631 P.2d 148 (Colo. 1981): Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite C.R.S. § 18-1-405 and Crim.P. 48 standards for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under Colorado law
5. Address Colo. Const. Art. II, § 16 speedy trial protections

Use proper Colorado legal citation format (e.g., "C.R.S. § 18-1-405").`,
    aiInstructions: "Must cite C.R.S. § 18-1-405 and Crim.P. 48. Use Colorado citation format throughout.",
    helpText: "AI will generate Colorado-specific legal arguments with proper citations",
  },

  // CO prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to C.R.S. § 18-1-405 and Crim.P. 48 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within any applicable time limits under C.R.S. § 18-1-405, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief citing C.R.S.",
  },

  // Signature block same as base
  baseSections[6],

  // CO certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF COLORADO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via ICCES e-filing to the email address(es) of record.

STATE OF COLORADO
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Colorado that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Colorado.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Colorado-specific certificate of service format",
  },
];

// ============================================================================
// Colorado Federal Sections
// ============================================================================

const coFederalSections: TemplateSection[] = [
  ...coBaseSections,

  // Federal good cause statement (Tenth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Colorado.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Tenth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Tenth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Colorado.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Tenth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Tenth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Tenth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (CO)
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
// Minnesota-Specific Sections
// ============================================================================

const minnesotaSections: TemplateSection[] = [
  ...mnBaseSections,

  // MN good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Minnesota criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Minn. R. Crim. P. 11.01, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Minn. R. Crim. P. 11.01
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Minn. R. Crim. P. 11.01 where appropriate. Use Minnesota legal citation format.",
    helpText: "AI will generate a Minnesota-specific good cause statement",
  },

  // MN legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Minnesota criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 11.01: Continuances
- Minn. R. Crim. P. 11.09: Speedy trial demand (60 days)
- Minn. Const. Art. I, § 6: Right to speedy trial
- State v. Windish, 590 N.W.2d 311 (Minn. 1999): Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite Minn. R. Crim. P. 11.01's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address Minn. R. Crim. P. 11.09 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Minnesota law
5. Address Minn. Const. Art. I, § 6 speedy trial protections

Use proper Minnesota legal citation format (e.g., "Minn. R. Crim. P. 11.01").`,
    aiInstructions: "Must cite Minn. R. Crim. P. 11.01 and Minn. Const. Art. I, § 6. Use Minnesota citation format throughout.",
    helpText: "AI will generate Minnesota-specific legal arguments with proper citations",
  },

  // MN prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Minn. R. Crim. P. 11.01 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within any applicable time limits under Minn. R. Crim. P. 11.09, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief citing Minnesota Rules",
  },

  // Signature block same as base
  baseSections[6],

  // MN certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MINNESOTA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via eFS e-filing to the email address(es) of record.

STATE OF MINNESOTA
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Minnesota that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Minnesota.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Minnesota-specific certificate of service format",
  },
];

// ============================================================================
// Minnesota Federal Sections
// ============================================================================

const mnFederalSections: TemplateSection[] = [
  ...mnBaseSections,

  // Federal good cause statement (Eighth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Minnesota.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Eighth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Eighth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Minnesota.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Eighth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Eighth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Eighth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (MN)
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
// South Carolina-Specific Sections
// ============================================================================

const southCarolinaSections: TemplateSection[] = [
  ...scBaseSections,

  // SC good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a South Carolina criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under S.C. Code Ann. § 17-23-90, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under S.C. Code Ann. § 17-23-90
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference S.C. Code Ann. § 17-23-90 where appropriate. Use South Carolina legal citation format.",
    helpText: "AI will generate a South Carolina-specific good cause statement",
  },

  // SC legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a South Carolina criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable South Carolina law includes:
- S.C. Code Ann. § 17-23-90: Continuances in criminal proceedings
- S.C. Const. Art. I, § 14: Right to speedy trial
- State v. Langford, 400 S.E.2d 517 (S.C. 1991): Standard for reviewing continuance rulings
- S.C. R. Crim. P. 3: General provisions

Generate 2-3 paragraphs that:
1. Cite S.C. Code Ann. § 17-23-90's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under South Carolina law
5. Address S.C. Const. Art. I, § 14 speedy trial protections

Use proper South Carolina legal citation format (e.g., "S.C. Code Ann. § 17-23-90").`,
    aiInstructions: "Must cite S.C. Code Ann. § 17-23-90 and S.C. Const. Art. I, § 14. Use South Carolina citation format throughout.",
    helpText: "AI will generate South Carolina-specific legal arguments with proper citations",
  },

  // SC prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to S.C. Code Ann. § 17-23-90 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief citing S.C. Code Ann.",
  },

  // Signature block same as base
  baseSections[6],

  // SC certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF SOUTH CAROLINA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF SOUTH CAROLINA
c/o Solicitor
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of South Carolina that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, South Carolina.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "South Carolina-specific certificate of service format",
  },
];

// ============================================================================
// South Carolina Federal Sections
// ============================================================================

const scFederalSections: TemplateSection[] = [
  ...scBaseSections,

  // Federal good cause statement (Fourth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of South Carolina.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fourth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fourth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of South Carolina.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Fourth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fourth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Fourth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (SC)
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
// Alabama-Specific Sections
// ============================================================================

const alabamaSections: TemplateSection[] = [
  ...alBaseSections,

  // AL good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Alabama criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under Ala. R. Crim. P. 9.1, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under Ala. R. Crim. P. 9.1
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference Ala. R. Crim. P. 9.1 where appropriate. Use Alabama legal citation format.",
    helpText: "AI will generate an Alabama-specific good cause statement",
  },

  // AL legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Alabama criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 9.1: Continuances
- Ala. Const. Art. I, § 6: Right to speedy trial
- Ex parte Walker, 928 So.2d 259 (Ala. 2005): Standard for reviewing continuance rulings
- Ala. R. Crim. P. 8.4: Speedy trial

Generate 2-3 paragraphs that:
1. Cite Ala. R. Crim. P. 9.1's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under Alabama law
5. Address Ala. Const. Art. I, § 6 speedy trial protections

Use proper Alabama legal citation format (e.g., "Ala. R. Crim. P. 9.1").`,
    aiInstructions: "Must cite Ala. R. Crim. P. 9.1 and Ala. Const. Art. I, § 6. Use Alabama citation format throughout.",
    helpText: "AI will generate Alabama-specific legal arguments with proper citations",
  },

  // AL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to Ala. R. Crim. P. 9.1 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief citing Alabama Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // AL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ALABAMA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via AlaFile e-filing to the email address(es) of record.

STATE OF ALABAMA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Alabama that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Alabama.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Alabama-specific certificate of service format",
  },
];

// ============================================================================
// Alabama Federal Sections
// ============================================================================

const alFederalSections: TemplateSection[] = [
  ...alBaseSections,

  // Federal good cause statement (Eleventh Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Alabama.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Eleventh Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Alabama.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Eleventh Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Eleventh Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Eleventh Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (AL)
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
// Louisiana-Specific Sections
// ============================================================================

const louisianaSections: TemplateSection[] = [
  ...laBaseSections,

  // LA good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Louisiana criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under La. C.Cr.P. art. 712, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under La. C.Cr.P. art. 712
3. Address any concerns about delay, particularly regarding La. C.Cr.P. art. 701 speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference La. C.Cr.P. art. 712 where appropriate. Use Louisiana legal citation format. Note: Louisiana uses 'parish' instead of 'county'.",
    helpText: "AI will generate a Louisiana-specific good cause statement",
  },

  // LA legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Louisiana criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Louisiana law includes:
- La. C.Cr.P. art. 712: Continuances
- La. C.Cr.P. art. 701: Speedy trial (2 years for felony, 1 year for misdemeanor if in custody)
- La. Const. Art. I, § 16: Right to speedy trial
- State v. Love, 2000-3347 (La. 5/23/03), 847 So.2d 1198: Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite La. C.Cr.P. art. 712's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address La. C.Cr.P. art. 701 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Louisiana law
5. Address La. Const. Art. I, § 16 speedy trial protections

Use proper Louisiana legal citation format (e.g., "La. C.Cr.P. art. 712").`,
    aiInstructions: "Must cite La. C.Cr.P. art. 712 and La. Const. Art. I, § 16. Use Louisiana citation format throughout.",
    helpText: "AI will generate Louisiana-specific legal arguments with proper citations",
  },

  // LA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to La. C.Cr.P. art. 712 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date within any applicable time limits under La. C.Cr.P. art. 701, unless time is waived;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief citing Louisiana Code of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[6],

  // LA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF LOUISIANA, PARISH OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF LOUISIANA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Louisiana that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Louisiana.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Louisiana-specific certificate of service format",
  },
];

// ============================================================================
// Louisiana Federal Sections
// ============================================================================

const laFederalSections: TemplateSection[] = [
  ...laBaseSections,

  // Federal good cause statement (Fifth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Louisiana.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Fifth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Fifth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Louisiana.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Fifth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Fifth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Fifth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (LA)
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
// Kentucky-Specific Sections
// ============================================================================

const kentuckySections: TemplateSection[] = [
  ...kyBaseSections,

  // KY good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a Kentucky criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under KRS 500.130 and RCr 9.04, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under KRS 500.130 and RCr 9.04
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference KRS 500.130 and RCr 9.04 where appropriate. Use Kentucky legal citation format.",
    helpText: "AI will generate a Kentucky-specific good cause statement",
  },

  // KY legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a Kentucky criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Kentucky law includes:
- KRS 500.130: Speedy trial requirements
- RCr 9.04: Continuances
- Ky. Const. § 11: Right to speedy trial
- Commonwealth v. Dillingham, 483 S.W.2d 130 (Ky. 1972): Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite KRS 500.130 and RCr 9.04's standards for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under Kentucky law
5. Address Ky. Const. § 11 speedy trial protections

Use proper Kentucky legal citation format (e.g., "KRS 500.130").`,
    aiInstructions: "Must cite KRS 500.130, RCr 9.04, and Ky. Const. § 11. Use Kentucky citation format throughout.",
    helpText: "AI will generate Kentucky-specific legal arguments with proper citations",
  },

  // KY prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to KRS 500.130 and RCr 9.04 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief citing KRS and RCr",
  },

  // Signature block same as base
  baseSections[6],

  // KY certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF KENTUCKY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via eFiling to the email address(es) of record.

COMMONWEALTH OF KENTUCKY
c/o Commonwealth's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the Commonwealth of Kentucky that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Kentucky.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Kentucky-specific certificate of service format",
  },
];

// ============================================================================
// Kentucky Federal Sections
// ============================================================================

const kyFederalSections: TemplateSection[] = [
  ...kyBaseSections,

  // Federal good cause statement (Sixth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Kentucky.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Sixth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Kentucky.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Sixth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Sixth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Sixth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (KY)
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
// Oregon-Specific Sections
// ============================================================================

const oregonSections: TemplateSection[] = [
  ...orBaseSections,

  // OR good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Oregon criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under ORS 136.010 et seq. and UTCR 6.030, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under ORS 136.010 et seq. and UTCR 6.030
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference ORS 136.010 et seq. and UTCR 6.030 where appropriate. Use Oregon legal citation format.",
    helpText: "AI will generate an Oregon-specific good cause statement",
  },

  // OR legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Oregon criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Oregon law includes:
- ORS 136.010 et seq.: Criminal procedure
- UTCR 6.030: Motion practice
- Or. Const. Art. I, § 10: Right to speedy trial
- State v. Harberts, 331 Or. 72 (2000): Standard for reviewing continuance rulings
- ORS 135.747: Speedy trial (within reasonable period)

Generate 2-3 paragraphs that:
1. Cite ORS 136.010 et seq. and UTCR 6.030 standards for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address speedy trial implications
4. Reference the trial court's discretion in granting continuances under Oregon law
5. Address Or. Const. Art. I, § 10 speedy trial protections

Use proper Oregon legal citation format (e.g., "ORS 136.010").`,
    aiInstructions: "Must cite ORS 136.010 et seq., UTCR 6.030, and Or. Const. Art. I, § 10. Use Oregon citation format throughout.",
    helpText: "AI will generate Oregon-specific legal arguments with proper citations",
  },

  // OR prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to ORS 136.010 et seq. and UTCR 6.030 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief citing ORS and UTCR",
  },

  // Signature block same as base
  baseSections[6],

  // OR certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OREGON, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via Oregon eCourt to the email address(es) of record.

STATE OF OREGON
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Oregon that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Oregon.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Oregon-specific certificate of service format",
  },
];

// ============================================================================
// Oregon Federal Sections
// ============================================================================

const orFederalSections: TemplateSection[] = [
  ...orBaseSections,

  // Federal good cause statement (Ninth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Oregon.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Ninth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Ninth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Oregon.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Ninth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Ninth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Ninth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (OR)
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
// Oklahoma-Specific Sections
// ============================================================================

const oklahomaSections: TemplateSection[] = [
  ...okBaseSections,

  // OK good cause statement
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in an Oklahoma criminal matter.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under 22 O.S. § 584, courts may grant continuances in criminal proceedings upon a showing of good cause. The court has discretion to grant or deny continuances based on the circumstances of the case.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under 22 O.S. § 584
3. Address any concerns about delay, particularly regarding speedy trial rights and custody status
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 22 O.S. § 584 where appropriate. Use Oklahoma legal citation format.",
    helpText: "AI will generate an Oklahoma-specific good cause statement",
  },

  // OK legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in an Oklahoma criminal matter.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable Oklahoma law includes:
- 22 O.S. § 584: Continuances in criminal proceedings
- Okla. Const. Art. II, § 20: Right to speedy trial
- 22 O.S. § 812: Speedy trial requirements
- Dodd v. State, 2004 OK CR 31: Standard for reviewing continuance rulings

Generate 2-3 paragraphs that:
1. Cite 22 O.S. § 584's standard for continuances
2. Apply the standard to the facts of this case
3. If the defendant is in custody, address 22 O.S. § 812 speedy trial implications
4. Reference the trial court's discretion in granting continuances under Oklahoma law
5. Address Okla. Const. Art. II, § 20 speedy trial protections

Use proper Oklahoma legal citation format (e.g., "22 O.S. § 584").`,
    aiInstructions: "Must cite 22 O.S. § 584 and Okla. Const. Art. II, § 20. Use Oklahoma citation format throughout.",
    helpText: "AI will generate Oklahoma-specific legal arguments with proper citations",
  },

  // OK prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to 22 O.S. § 584 and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Set the continued hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;

3. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief citing Oklahoma Statutes",
  },

  // Signature block same as base
  baseSections[6],

  // OK certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OKLAHOMA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO CONTINUE on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via court e-filing to the email address(es) of record.

STATE OF OKLAHOMA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Oklahoma that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Oklahoma.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Oklahoma-specific certificate of service format",
  },
];

// ============================================================================
// Oklahoma Federal Sections
// ============================================================================

const okFederalSections: TemplateSection[] = [
  ...okBaseSections,

  // Federal good cause statement (Tenth Circuit)
  {
    id: "goodCauseStatement",
    name: "Good Cause Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a persuasive good cause statement for a motion to continue in a federal criminal matter in the District of Oklahoma.

Case Details:
- Hearing Type: {{hearingType}}
- Primary Reason: {{primaryReason}}
- Detailed Explanation: {{reasonExplanation}}
- Prior Continuances: {{priorContinuances}}
- Custody Status: {{custodyStatus}}
- Speedy Trial Waiver: {{speedyTrialWaiver}}
- Prosecution Position: {{oppositionPosition}}

Under the Speedy Trial Act (18 U.S.C. § 3161), courts may grant continuances when the ends of justice served by granting a continuance outweigh the best interests of the public and the defendant in a speedy trial.

Generate 2-3 paragraphs that:
1. Clearly state the specific factual basis for the continuance request
2. Explain why this constitutes good cause under federal standards
3. Address Speedy Trial Act implications, particularly 18 U.S.C. § 3161(h)(7)
4. Note if this is stipulated by the prosecution
5. If prior continuances exist, distinguish this request

Use formal legal writing style. Be persuasive but factual.`,
    aiInstructions: "Reference 18 U.S.C. § 3161 (Speedy Trial Act) and Federal Rules of Criminal Procedure. Reference Tenth Circuit precedent where applicable. Use federal citation format.",
    helpText: "AI will generate a federal good cause statement",
  },

  // Federal legal argument (Tenth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to continue in a federal criminal matter in the District of Oklahoma.

Hearing Type: {{hearingType}}
Primary Reason: {{primaryReason}}
Prior Continuances: {{priorContinuances}}
Custody Status: {{custodyStatus}}
Prosecution Position: {{oppositionPosition}}
Speedy Trial Status: {{speedyTrialWaiver}}

Applicable federal law includes:
- 18 U.S.C. § 3161 (Speedy Trial Act): 70-day limit for trial after indictment/information; excludable delay under § 3161(h)(7) for ends-of-justice continuances
- Federal Rules of Criminal Procedure, Rule 50: Prompt disposition
- 18 U.S.C. § 3161(h)(7)(B)(iv): Factors court must consider
- Tenth Circuit precedent on Speedy Trial Act continuances

Generate 2-3 paragraphs that:
1. Cite the applicable federal legal standard for granting continuances
2. Address the Speedy Trial Act's ends-of-justice balancing test
3. Apply the legal standard to the facts of this case
4. Reference Tenth Circuit precedent where applicable
5. Address any Sixth Amendment speedy trial concerns if defendant is in custody

Use proper federal legal citation format (e.g., "18 U.S.C. § 3161").`,
    aiInstructions: "Must cite 18 U.S.C. § 3161 and Federal Rules of Criminal Procedure. Reference Tenth Circuit case law. Use federal citation format throughout.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court grant this Motion to Continue pursuant to the Federal Rules of Criminal Procedure and 18 U.S.C. § 3161(h)(7) and:

1. Continue the {{hearingType}} hearing currently scheduled for {{currentHearingDate}} at {{currentHearingTime}} to a date convenient for the Court;

2. Find that the ends of justice served by granting such continuance outweigh the best interests of the public and the defendant in a speedy trial, pursuant to 18 U.S.C. § 3161(h)(7)(A);

3. Exclude the resulting delay from computation under the Speedy Trial Act;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Speedy Trial Act",
  },

  // Signature block same as base
  baseSections[6],

  // Federal certificate of service (OK)
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
    // North Carolina
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: northCarolinaSections,
      courtSpecificRules: "N.C. Gen. Stat. § 15A-952 governs continuances. Must show good cause.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "E.D.N.C.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "M.D.N.C.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "W.D.N.C.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Michigan
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: michiganSections,
      courtSpecificRules: "MCR 2.503 governs adjournments. Must show good cause.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "E.D. Mich.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "W.D. Mich.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // New Jersey
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: newJerseySections,
      courtSpecificRules: "N.J. Ct. R. 3:10-3 governs continuances in criminal matters.",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "D.N.J.: 12pt font. Third Circuit. CM/ECF required.",
    },
    // Virginia
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: virginiaSections,
      courtSpecificRules: "Va. Code § 19.2-243 governs speedy trial and continuances.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "E.D. Va.: 12pt font. Fourth Circuit. CM/ECF required. Known as 'Rocket Docket.'",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "W.D. Va.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Washington
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: washingtonSections,
      courtSpecificRules: "CrR 3.3 governs time for trial and continuances.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "E.D. Wash.: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "W.D. Wash.: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Arizona
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: arizonaSections,
      courtSpecificRules: "Ariz. R. Crim. P. 8.5 governs continuances.",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "D. Ariz.: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Massachusetts
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: massachusettsSections,
      courtSpecificRules: "Mass. R. Crim. P. 10 governs continuances.",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "D. Mass.: 12pt font. First Circuit. CM/ECF required.",
    },
    // Tennessee
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Tenn. R. Crim. P. 17 governs subpoenas and continuances.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "E.D. Tenn.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "M.D. Tenn.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "W.D. Tenn.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // Indiana
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Ind. R. Crim. P. 4 and IC 35-36-7 govern speedy trial and continuances.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "N.D. Ind.: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "S.D. Ind.: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    // Maryland
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Md. Rule 4-271 governs continuances in circuit court.",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "D. Md.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Missouri
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Mo. Sup. Ct. R. 24.09 governs continuances. RSMo § 545.780 addresses speedy trial requirements.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "E.D. Mo.: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "W.D. Mo.: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Wisconsin
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Wis. Stat. § 971.10 governs continuances. SCR 71.04 addresses scheduling matters.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "E.D. Wis.: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "W.D. Wis.: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    // Colorado
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coloradoSections,
      courtSpecificRules: "Colo. R. Crim. P. 48 governs continuances. C.R.S. § 18-1-405 addresses speedy trial requirements.",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "D. Colo.: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Minnesota
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: minnesotaSections,
      courtSpecificRules: "Minn. R. Crim. P. 11.03 governs continuances in criminal matters.",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "D. Minn.: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // South Carolina
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: southCarolinaSections,
      courtSpecificRules: "S.C. R. Crim. P. 3 governs continuances. S.C. Code § 17-23-90 addresses trial scheduling.",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "D.S.C.: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Alabama
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alabamaSections,
      courtSpecificRules: "Ala. R. Crim. P. 15.4 governs continuances in criminal proceedings.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "N.D. Ala.: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "M.D. Ala.: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "S.D. Ala.: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    // Louisiana
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: louisianaSections,
      courtSpecificRules: "La. C.Cr.P. art. 709 and 712 govern continuances in criminal proceedings.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "E.D. La.: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "M.D. La.: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "W.D. La.: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    // Kentucky
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kentuckySections,
      courtSpecificRules: "Ky. R. Crim. P. 9.04 governs continuances. KRS 500.110 addresses speedy trial requirements.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "E.D. Ky.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "W.D. Ky.: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // Oregon
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: oregonSections,
      courtSpecificRules: "ORS 136.060 governs continuances. UTCR 6.030 addresses trial scheduling.",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "D. Or.: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Oklahoma
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: oklahomaSections,
      courtSpecificRules: "22 O.S. § 585 governs continuances. Okla. Ct. Crim. App. R. 4.2 addresses scheduling.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "N.D. Okla.: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "E.D. Okla.: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "W.D. Okla.: 12pt font. Tenth Circuit. CM/ECF required.",
    },
  ],
  estimatedCompletionTime: "10-15 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK"],
};

// Export for use in template registry
export default motionToContinueTemplate;
