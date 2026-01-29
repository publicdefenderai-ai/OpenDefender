/**
 * Motion to Continue Template
 *
 * Criminal law document template for requesting a continuance of a hearing.
 * Includes California-specific variant with proper statutory citations.
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
      options: [
        { value: "Los Angeles", label: "Los Angeles" },
        { value: "San Diego", label: "San Diego" },
        { value: "San Francisco", label: "San Francisco" },
        { value: "Alameda", label: "Alameda" },
        { value: "other", label: "Other" },
      ],
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
  ],
  estimatedCompletionTime: "10-15 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "CACD", "NDCA", "EDCA", "SDCA"],
};

// Export for use in template registry
export default motionToContinueTemplate;
