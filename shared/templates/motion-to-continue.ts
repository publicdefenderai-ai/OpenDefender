/**
 * Motion to Continue Template
 *
 * Criminal law document template for requesting a continuance of a hearing.
 * Includes California-specific variant with proper statutory citations.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";
import { CA_COUNTIES, NY_COUNTIES, TX_COUNTIES } from "./county-data";

// ============================================================================
// Section Inputs
// ============================================================================

const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., Superior Court of California, County of Los Angeles",
    required: true,
    helpText: "The full name of the court where the case is pending",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., BA123456",
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
    helpText: "The county where the court is located (used in caption for state courts)",
    validation: {
      options: CA_COUNTIES,
    },
  },
  {
    id: "countyOther",
    label: "County Name",
    type: "text",
    placeholder: "e.g., Sacramento",
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

// NY-specific caption inputs (same fields but with NY counties)
const nyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "county"
    ? { ...input, validation: { ...input.validation, options: NY_COUNTIES } }
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
  // Caption, hearing info, and reason sections are the same
  ...baseSections.slice(0, 3),

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
  // Caption, hearing info, and reason sections are the same
  ...baseSections.slice(0, 3),

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
    ? { ...input, validation: { ...input.validation, options: TX_COUNTIES } }
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
  ],
  estimatedCompletionTime: "10-15 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD"],
};

// Export for use in template registry
export default motionToContinueTemplate;
