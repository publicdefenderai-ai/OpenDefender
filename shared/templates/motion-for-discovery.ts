/**
 * Motion for Discovery / Brady Motion Template
 *
 * Criminal law document template for requesting discovery and disclosure of
 * exculpatory evidence pursuant to Brady v. Maryland, 373 U.S. 83 (1963),
 * Federal Rule of Criminal Procedure 16, and state-specific discovery rules.
 * Covers requests for Brady material, witness lists, physical evidence,
 * expert reports, law enforcement records, and electronic evidence.
 * Includes jurisdiction-specific variants for all 50 states + DC and federal court variants.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";
import {
  CA_COUNTIES,
  NY_COUNTIES,
  TX_COUNTIES,
  FL_COUNTIES,
  PA_COUNTIES,
  IL_COUNTIES,
  OH_COUNTIES,
  GA_COUNTIES,
  NC_COUNTIES,
  MI_COUNTIES,
  NJ_COUNTIES,
  VA_COUNTIES,
  WA_COUNTIES,
  AZ_COUNTIES,
  MA_COUNTIES,
  TN_COUNTIES,
  IN_COUNTIES,
  MD_COUNTIES,
  MO_COUNTIES,
  WI_COUNTIES,
  CO_COUNTIES,
  MN_COUNTIES,
  SC_COUNTIES,
  AL_COUNTIES,
  LA_PARISHES,
  KY_COUNTIES,
  OR_COUNTIES,
  OK_COUNTIES,
  CT_COUNTIES,
  UT_COUNTIES,
  IA_COUNTIES,
  NV_COUNTIES,
  AR_COUNTIES,
  MS_COUNTIES,
  KS_COUNTIES,
  NM_COUNTIES,
  NE_COUNTIES,
  ID_COUNTIES,
  AK_BOROUGHS,
  DE_COUNTIES,
  HI_COUNTIES,
  ME_COUNTIES,
  MT_COUNTIES,
  NH_COUNTIES,
  ND_COUNTIES,
  RI_COUNTIES,
  SD_COUNTIES,
  VT_COUNTIES,
  WV_COUNTIES,
  WY_COUNTIES,
  DC_WARDS,
} from "./county-data";


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

const discoveryRequestsInputs: TemplateInput[] = [
  {
    id: "discoveryType",
    label: "Type of Discovery Requested",
    type: "select",
    required: true,
    helpText: "Select the primary type of discovery being sought",
    validation: {
      options: [
        { value: "brady_material", label: "Brady Material (Exculpatory Evidence)" },
        { value: "rule_16_discovery", label: "Rule 16 Discovery" },
        { value: "witness_lists", label: "Witness Lists" },
        { value: "physical_evidence", label: "Physical Evidence" },
        { value: "expert_reports", label: "Expert Reports" },
        { value: "law_enforcement_records", label: "Law Enforcement Records" },
        { value: "electronic_evidence", label: "Electronic Evidence" },
        { value: "informant_records", label: "Informant Records" },
        { value: "plea_agreements", label: "Plea Agreements" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "specificRequests",
    label: "Specific Discovery Requests",
    type: "textarea",
    placeholder: "Describe in detail the specific discovery materials being sought...",
    required: true,
    helpText: "Describe what discovery is being sought in detail",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "basisForRequest",
    label: "Basis for Discovery Request",
    type: "textarea",
    placeholder: "Explain the legal and factual basis for this discovery request...",
    required: true,
    helpText: "Explain why this discovery is needed and relevant to the defense",
    validation: {
      minLength: 50,
      maxLength: 2000,
    },
  },
  {
    id: "discoveryDeadline",
    label: "Discovery Deadline",
    type: "date",
    required: false,
    helpText: "The deadline for discovery production, if set by the court",
  },
  {
    id: "priorRequests",
    label: "Prior Discovery Requests",
    type: "select",
    required: true,
    helpText: "Number of prior discovery requests made in this case",
    validation: {
      options: [
        { value: "0", label: "None" },
        { value: "1", label: "One prior request" },
        { value: "2", label: "Two or more prior requests" },
      ],
    },
  },
  {
    id: "prosecutionResponse",
    label: "Prosecution Response to Discovery",
    type: "select",
    required: true,
    helpText: "The prosecution's response to prior discovery requests",
    validation: {
      options: [
        { value: "not_requested", label: "Not Yet Requested" },
        { value: "partial_compliance", label: "Partial Compliance" },
        { value: "non_compliance", label: "Non-Compliance" },
        { value: "refused", label: "Refused" },
        { value: "no_response", label: "No Response" },
      ],
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
    id: "hearingType",
    label: "Associated Hearing Type",
    type: "select",
    required: true,
    helpText: "The type of hearing at which the motion will be heard",
    validation: {
      options: [
        { value: "pretrial", label: "Pre-Trial Conference" },
        { value: "motions", label: "Motions Hearing" },
        { value: "trial", label: "Trial" },
        { value: "discovery_conference", label: "Discovery Conference" },
        { value: "status", label: "Status Hearing" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "trialDate",
    label: "Trial Date",
    type: "date",
    required: false,
    helpText: "The scheduled trial date, if known",
  },
];

const signatureInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "party-name",
    placeholder: "Full name as registered with bar",
    required: true,
    helpText: "Your full legal name as it appears on your bar card",
  },
  {
    id: "barNumber",
    label: "Bar Number",
    type: "text",
    placeholder: "e.g., 123456",
    required: true,
    helpText: "Your state bar registration number",
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
  {
    id: "signingDate",
    label: "Date of Signing",
    type: "date",
    required: true,
    helpText: "The date this motion is being signed and filed",
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
    id: "discoveryRequests",
    name: "Discovery Requests",
    type: "user-input",
    order: 2,
    inputs: discoveryRequestsInputs,
    required: true,
    helpText: "Describe the discovery materials being requested",
  },
  {
    id: "hearingInfo",
    name: "Hearing Information",
    type: "user-input",
    order: 3,
    inputs: hearingInputs,
    required: true,
    helpText: "Provide hearing details",
  },
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative. Do not include legal citations or argument. Present facts chronologically.",
    helpText: "AI will generate a statement of facts based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion in a criminal matter.

Jurisdiction: {{jurisdiction}}
Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery
2. Cite Brady v. Maryland, 373 U.S. 83 (1963) and its progeny
3. Cite Fed. R. Crim. P. 16 and/or applicable state rules
4. Address the materiality of evidence and the duty to disclose
5. Apply the facts to the legal standard and explain why discovery should be compelled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Include relevant constitutional citations and case law. Use proper legal citation format.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady v. Maryland, 373 U.S. 83 (1963) and Giglio v. United States, 405 U.S. 150 (1972);

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for discovery motions",
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

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties in this action by:

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
// California Sections
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
];

const californiaSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Cal. Penal Code § 1054 et seq. (Proposition 115 discovery)) in a California criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Cal. Penal Code § 1054 et seq. (Proposition 115 discovery), the defense is entitled to discovery of materials relevant to the case. See People v. Superior Court (Laff) (2001) 25 Cal.4th 703. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a California Cal. Penal Code § 1054 et seq. (Proposition 115 discovery) discovery motion. Present facts chronologically.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under California law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable California law includes:
- Cal. Penal Code § 1054 et seq. (Proposition 115 discovery): Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- People v. Superior Court (Laff) (2001) 25 Cal.4th 703: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under California law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Cal. Penal Code § 1054 et seq. (Proposition 115 discovery), Brady v. Maryland, 373 U.S. 83 (1963), and People v. Superior Court (Laff) (2001) 25 Cal.4th 703.",
    helpText: "AI will generate California-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Cal. Penal Code § 1054 et seq. (Proposition 115 discovery) and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California prayer for relief citing Cal. Penal Code § 1054 et seq. (Proposition 115 discovery)",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF CALIFORNIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Cal. Penal Code § 1054 et seq. (Proposition 115 discovery)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF CALIFORNIA
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
    helpText: "California-specific certificate of service format",
  },
];

const caFederalSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of California.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New York Sections
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
];

const newYorkSections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (CPL § 245.10 et seq. (2020 discovery reform)) in a New York criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under CPL § 245.10 et seq. (2020 discovery reform), the defense is entitled to discovery of materials relevant to the case. See People v. Rosario, 9 N.Y.2d 286. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New York CPL § 245.10 et seq. (2020 discovery reform) discovery motion. Present facts chronologically.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under New York law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable New York law includes:
- CPL § 245.10 et seq. (2020 discovery reform): Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- People v. Rosario, 9 N.Y.2d 286: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under New York law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite CPL § 245.10 et seq. (2020 discovery reform), Brady v. Maryland, 373 U.S. 83 (1963), and People v. Rosario, 9 N.Y.2d 286.",
    helpText: "AI will generate New York-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CPL § 245.10 et seq. (2020 discovery reform) and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing CPL § 245.10 et seq. (2020 discovery reform)",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW YORK, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (CPL § 245.10 et seq. (2020 discovery reform)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via NYSCEF to the email address(es) of record.

STATE OF NEW YORK
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of New York that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, New York.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "New York-specific certificate of service format",
  },
];

const nyFederalSections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of New York.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Second Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Second Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Texas Sections
// ============================================================================

const txCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Harris County, Texas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act)) in a Texas criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act), the defense is entitled to discovery of materials relevant to the case. See Watkins v. State (Tex. Crim. App. 2019). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Texas Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act) discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Texas law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act): Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Watkins v. State (Tex. Crim. App. 2019): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Texas law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act), Brady v. Maryland, 373 U.S. 83 (1963), and Watkins v. State (Tex. Crim. App. 2019).",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act) and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act)",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TEXAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF TEXAS
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

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Texas.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fifth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fifth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Florida Sections
// ============================================================================

const flCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Eleventh Judicial Circuit, Miami-Dade County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., F-XXXX-XXXXXX" }
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
];

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Fla. R. Crim. P. 3.220) in a Florida criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Fla. R. Crim. P. 3.220, the defense is entitled to discovery of materials relevant to the case. See State v. Coney, 845 So.2d 120 (Fla. 2003). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Florida Fla. R. Crim. P. 3.220 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Florida law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.220: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Coney, 845 So.2d 120 (Fla. 2003): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Florida law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.220, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Coney, 845 So.2d 120 (Fla. 2003).",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Fla. R. Crim. P. 3.220 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing Fla. R. Crim. P. 3.220",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF FLORIDA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Fla. R. Crim. P. 3.220) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const flFederalSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Florida.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eleventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eleventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Pennsylvania Sections
// ============================================================================

const paCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Philadelphia County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CP-XX-CR-XXXXXXX-XXXX" }
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
];

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Pa.R.Crim.P. 573) in a Pennsylvania criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Pa.R.Crim.P. 573, the defense is entitled to discovery of materials relevant to the case. See Commonwealth v. Burke, 781 A.2d 1136 (Pa. 2001). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania Pa.R.Crim.P. 573 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Pennsylvania law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Pennsylvania law includes:
- Pa.R.Crim.P. 573: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Commonwealth v. Burke, 781 A.2d 1136 (Pa. 2001): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Pennsylvania law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Pa.R.Crim.P. 573, Brady v. Maryland, 373 U.S. 83 (1963), and Commonwealth v. Burke, 781 A.2d 1136 (Pa. 2001).",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pa.R.Crim.P. 573 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing Pa.R.Crim.P. 573",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF PENNSYLVANIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Pa.R.Crim.P. 573) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF PENNSYLVANIA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Pennsylvania that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Pennsylvania.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Pennsylvania-specific certificate of service format",
  },
];

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Pennsylvania.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Third Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Third Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Illinois Sections
// ============================================================================

const ilCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of Cook County, Illinois" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (725 ILCS 5/114-13) in a Illinois criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under 725 ILCS 5/114-13, the defense is entitled to discovery of materials relevant to the case. See People v. Beaman, 229 Ill.2d 56 (2008). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Illinois 725 ILCS 5/114-13 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Illinois-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Illinois law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Illinois law includes:
- 725 ILCS 5/114-13: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- People v. Beaman, 229 Ill.2d 56 (2008): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Illinois law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite 725 ILCS 5/114-13, Brady v. Maryland, 373 U.S. 83 (1963), and People v. Beaman, 229 Ill.2d 56 (2008).",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 725 ILCS 5/114-13 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing 725 ILCS 5/114-13",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ILLINOIS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (725 ILCS 5/114-13) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const ilFederalSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Illinois.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Seventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Seventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Ohio Sections
// ============================================================================

const ohCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, Cuyahoga County, Ohio" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XX-XXXXXX" }
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
];

const ohioSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Ohio Crim.R. 16) in a Ohio criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Ohio Crim.R. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Gondor, 112 Ohio St.3d 377 (2006). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Ohio Ohio Crim.R. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Ohio-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Ohio law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Ohio law includes:
- Ohio Crim.R. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Gondor, 112 Ohio St.3d 377 (2006): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Ohio law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Ohio Crim.R. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Gondor, 112 Ohio St.3d 377 (2006).",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio Crim.R. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing Ohio Crim.R. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OHIO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Ohio Crim.R. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Ohio.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Sixth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Sixth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Georgia Sections
// ============================================================================

const gaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Fulton County, Georgia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const georgiaSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (O.C.G.A. § 17-16-1 et seq.) in a Georgia criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under O.C.G.A. § 17-16-1 et seq., the defense is entitled to discovery of materials relevant to the case. See Roviaro v. United States (applied in GA courts). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Georgia O.C.G.A. § 17-16-1 et seq. discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Georgia law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Georgia law includes:
- O.C.G.A. § 17-16-1 et seq.: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Roviaro v. United States (applied in GA courts): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Georgia law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite O.C.G.A. § 17-16-1 et seq., Brady v. Maryland, 373 U.S. 83 (1963), and Roviaro v. United States (applied in GA courts).",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. § 17-16-1 et seq. and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing O.C.G.A. § 17-16-1 et seq.",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF GEORGIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (O.C.G.A. § 17-16-1 et seq.) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Georgia.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eleventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eleventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Carolina Sections
// ============================================================================

const ncCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court Division, General Court of Justice, Wake County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CRS-XXXXXX" }
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
];

const northCarolinaSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (N.C.G.S. § 15A-903 (Open File Discovery)) in a North Carolina criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under N.C.G.S. § 15A-903 (Open File Discovery), the defense is entitled to discovery of materials relevant to the case. See State v. Bates, 348 N.C. 29 (1998). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a North Carolina N.C.G.S. § 15A-903 (Open File Discovery) discovery motion. Present facts chronologically.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under North Carolina law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable North Carolina law includes:
- N.C.G.S. § 15A-903 (Open File Discovery): Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Bates, 348 N.C. 29 (1998): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under North Carolina law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite N.C.G.S. § 15A-903 (Open File Discovery), Brady v. Maryland, 373 U.S. 83 (1963), and State v. Bates, 348 N.C. 29 (1998).",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C.G.S. § 15A-903 (Open File Discovery) and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief citing N.C.G.S. § 15A-903 (Open File Discovery)",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NORTH CAROLINA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (N.C.G.S. § 15A-903 (Open File Discovery)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const ncFederalSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of North Carolina.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fourth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fourth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Michigan Sections
// ============================================================================

const miCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Wayne County, Michigan" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XXXXXX-FC" }
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
];

const michiganSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (MCR 6.201) in a Michigan criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under MCR 6.201, the defense is entitled to discovery of materials relevant to the case. See People v. Lester, 232 Mich.App. 262 (1998). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Michigan MCR 6.201 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Michigan law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Michigan law includes:
- MCR 6.201: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- People v. Lester, 232 Mich.App. 262 (1998): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Michigan law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite MCR 6.201, Brady v. Maryland, 373 U.S. 83 (1963), and People v. Lester, 232 Mich.App. 262 (1998).",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCR 6.201 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief citing MCR 6.201",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MICHIGAN, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (MCR 6.201) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const miFederalSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Michigan.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Sixth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Sixth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Jersey Sections
// ============================================================================

const njCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of New Jersey, Criminal Division, Essex County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., IND-XXXX-XXXXX" }
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
];

const newJerseySections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (N.J. Court Rules R. 3:13-3) in a New Jersey criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under N.J. Court Rules R. 3:13-3, the defense is entitled to discovery of materials relevant to the case. See State v. Marshall, 148 N.J. 89 (1997). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Jersey N.J. Court Rules R. 3:13-3 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under New Jersey law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable New Jersey law includes:
- N.J. Court Rules R. 3:13-3: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Marshall, 148 N.J. 89 (1997): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under New Jersey law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite N.J. Court Rules R. 3:13-3, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Marshall, 148 N.J. 89 (1997).",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J. Court Rules R. 3:13-3 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief citing N.J. Court Rules R. 3:13-3",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW JERSEY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (N.J. Court Rules R. 3:13-3) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const njFederalSections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of New Jersey.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Third Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Third Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Virginia Sections
// ============================================================================

const vaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Fairfax County, Virginia" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XXXX-XXXXXX" }
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
];

const virginiaSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Va. Sup. Ct. R. 3A:11) in a Virginia criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Va. Sup. Ct. R. 3A:11, the defense is entitled to discovery of materials relevant to the case. See Youngblood v. West Virginia (applied in VA). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Virginia Va. Sup. Ct. R. 3A:11 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Virginia law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Virginia law includes:
- Va. Sup. Ct. R. 3A:11: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Youngblood v. West Virginia (applied in VA): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Virginia law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Va. Sup. Ct. R. 3A:11, Brady v. Maryland, 373 U.S. 83 (1963), and Youngblood v. West Virginia (applied in VA).",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Va. Sup. Ct. R. 3A:11 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Virginia prayer for relief citing Va. Sup. Ct. R. 3A:11",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF VIRGINIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Va. Sup. Ct. R. 3A:11) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF VIRGINIA
c/o Commonwealth's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Virginia that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Virginia.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Virginia-specific certificate of service format",
  },
];

const vaFederalSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Virginia.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fourth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fourth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Washington Sections
// ============================================================================

const waCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, King County, Washington" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XXXXX-XX" }
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
];

const washingtonSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (CrR 4.7) in a Washington criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under CrR 4.7, the defense is entitled to discovery of materials relevant to the case. See State v. Knutson, 121 Wash.2d 766 (1993). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Washington CrR 4.7 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Washington law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Washington law includes:
- CrR 4.7: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Knutson, 121 Wash.2d 766 (1993): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Washington law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite CrR 4.7, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Knutson, 121 Wash.2d 766 (1993).",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CrR 4.7 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Washington prayer for relief citing CrR 4.7",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WASHINGTON, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (CrR 4.7) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const waFederalSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Washington.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arizona Sections
// ============================================================================

const azCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Maricopa County, Arizona" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XXXX-XXXXXX" }
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
];

const arizonaSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Ariz. R. Crim. P. 15.1) in a Arizona criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Ariz. R. Crim. P. 15.1, the defense is entitled to discovery of materials relevant to the case. See State v. Roper, 140 Ariz. 471 (1984). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Arizona Ariz. R. Crim. P. 15.1 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Arizona law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Arizona law includes:
- Ariz. R. Crim. P. 15.1: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Roper, 140 Ariz. 471 (1984): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Arizona law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 15.1, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Roper, 140 Ariz. 471 (1984).",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ariz. R. Crim. P. 15.1 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arizona prayer for relief citing Ariz. R. Crim. P. 15.1",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ARIZONA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Ariz. R. Crim. P. 15.1) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const azFederalSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Arizona.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Massachusetts Sections
// ============================================================================

const maCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court Department, Suffolk County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XXXXX" }
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
];

const massachusettsSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Mass. R. Crim. P. 14) in a Massachusetts criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Mass. R. Crim. P. 14, the defense is entitled to discovery of materials relevant to the case. See Commonwealth v. Tucceri, 412 Mass. 401 (1992). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts Mass. R. Crim. P. 14 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Massachusetts law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 14: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Commonwealth v. Tucceri, 412 Mass. 401 (1992): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Massachusetts law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Mass. R. Crim. P. 14, Brady v. Maryland, 373 U.S. 83 (1963), and Commonwealth v. Tucceri, 412 Mass. 401 (1992).",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. R. Crim. P. 14 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Massachusetts prayer for relief citing Mass. R. Crim. P. 14",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MASSACHUSETTS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Mass. R. Crim. P. 14) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF MASSACHUSETTS
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Massachusetts that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Massachusetts.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Massachusetts-specific certificate of service format",
  },
];

const maFederalSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Massachusetts.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the First Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- First Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Indiana Sections
// ============================================================================

const inCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Marion County, Indiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., 49XXX-XXXX-F-XXXXXX" }
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
];

const indianaSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Ind. Code § 35-36-2-1) in a Indiana criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Ind. Code § 35-36-2-1, the defense is entitled to discovery of materials relevant to the case. See Harrison v. State, 707 N.E.2d 767 (Ind. 1999). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Indiana Ind. Code § 35-36-2-1 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Indiana law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Indiana law includes:
- Ind. Code § 35-36-2-1: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Harrison v. State, 707 N.E.2d 767 (Ind. 1999): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Indiana law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Ind. Code § 35-36-2-1, Brady v. Maryland, 373 U.S. 83 (1963), and Harrison v. State, 707 N.E.2d 767 (Ind. 1999).",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ind. Code § 35-36-2-1 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Indiana prayer for relief citing Ind. Code § 35-36-2-1",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF INDIANA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Ind. Code § 35-36-2-1) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const inFederalSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Indiana.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Seventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Seventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Tennessee Sections
// ============================================================================

const tnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Criminal Court, Davidson County, Tennessee" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XXX" }
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
];

const tennesseeSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Tenn. R. Crim. P. 16) in a Tennessee criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Tenn. R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Edgin, 902 S.W.2d 387 (Tenn. 1995). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Tennessee Tenn. R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Tennessee law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Edgin, 902 S.W.2d 387 (Tenn. 1995): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Tennessee law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Edgin, 902 S.W.2d 387 (Tenn. 1995).",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Tennessee prayer for relief citing Tenn. R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TENNESSEE, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Tenn. R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const tnFederalSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Tennessee.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Sixth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Sixth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Missouri Sections
// ============================================================================

const moCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Missouri" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const missouriSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Mo. Sup. Ct. R. 25.03) in a Missouri criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Mo. Sup. Ct. R. 25.03, the defense is entitled to discovery of materials relevant to the case. See State v. Mease, 842 S.W.2d 98 (Mo. 1992). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Missouri Mo. Sup. Ct. R. 25.03 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Missouri law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Missouri law includes:
- Mo. Sup. Ct. R. 25.03: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Mease, 842 S.W.2d 98 (Mo. 1992): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Missouri law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Mo. Sup. Ct. R. 25.03, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Mease, 842 S.W.2d 98 (Mo. 1992).",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mo. Sup. Ct. R. 25.03 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief citing Mo. Sup. Ct. R. 25.03",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MISSOURI, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Mo. Sup. Ct. R. 25.03) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const moFederalSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Missouri.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maryland Sections
// ============================================================================

const mdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Baltimore City, Maryland" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const marylandSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Md. Rule 4-263) in a Maryland criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Md. Rule 4-263, the defense is entitled to discovery of materials relevant to the case. See Williams v. State, 364 Md. 160 (2001). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Maryland Md. Rule 4-263 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Maryland law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Maryland law includes:
- Md. Rule 4-263: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Williams v. State, 364 Md. 160 (2001): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Maryland law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Md. Rule 4-263, Brady v. Maryland, 373 U.S. 83 (1963), and Williams v. State, 364 Md. 160 (2001).",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 4-263 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maryland prayer for relief citing Md. Rule 4-263",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MARYLAND, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Md. Rule 4-263) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const mdFederalSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Maryland.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fourth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fourth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wisconsin Sections
// ============================================================================

const wiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Milwaukee County, Wisconsin" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXXXX" }
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
];

const wisconsinSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Wis. Stat. § 971.23) in a Wisconsin criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Wis. Stat. § 971.23, the defense is entitled to discovery of materials relevant to the case. See State v. Harris, 2008 WI 15. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin Wis. Stat. § 971.23 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Wisconsin law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Wisconsin law includes:
- Wis. Stat. § 971.23: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Harris, 2008 WI 15: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Wisconsin law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Wis. Stat. § 971.23, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Harris, 2008 WI 15.",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 971.23 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief citing Wis. Stat. § 971.23",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WISCONSIN, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Wis. Stat. § 971.23) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const wiFederalSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Wisconsin.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Seventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Seventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Colorado Sections
// ============================================================================

const coCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Denver County, Colorado" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const coloradoSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Colo. R. Crim. P. 16) in a Colorado criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Colo. R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See People v. District Court (Losavio), 626 P.2d 1092 (Colo. 1981). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Colorado Colo. R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Colorado law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Colorado law includes:
- Colo. R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- People v. District Court (Losavio), 626 P.2d 1092 (Colo. 1981): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Colorado law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Colo. R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and People v. District Court (Losavio), 626 P.2d 1092 (Colo. 1981).",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Colo. R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief citing Colo. R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF COLORADO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Colo. R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const coFederalSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Colorado.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Minnesota Sections
// ============================================================================

const mnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Fourth Judicial District, Hennepin County" }
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
];

const minnesotaSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Minn. R. Crim. P. 9.01) in a Minnesota criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Minn. R. Crim. P. 9.01, the defense is entitled to discovery of materials relevant to the case. See State v. Lindsey, 284 N.W.2d 368 (Minn. 1979). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Minnesota Minn. R. Crim. P. 9.01 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Minnesota law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 9.01: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Lindsey, 284 N.W.2d 368 (Minn. 1979): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Minnesota law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Minn. R. Crim. P. 9.01, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Lindsey, 284 N.W.2d 368 (Minn. 1979).",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Crim. P. 9.01 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief citing Minn. R. Crim. P. 9.01",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MINNESOTA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Minn. R. Crim. P. 9.01) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const mnFederalSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Minnesota.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Carolina Sections
// ============================================================================

const scCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of General Sessions, Richland County, South Carolina" }
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
];

const southCarolinaSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (S.C.R.Crim.P. 5) in a South Carolina criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under S.C.R.Crim.P. 5, the defense is entitled to discovery of materials relevant to the case. See State v. Kennerly, 331 S.C. 442 (1998). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a South Carolina S.C.R.Crim.P. 5 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under South Carolina law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable South Carolina law includes:
- S.C.R.Crim.P. 5: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Kennerly, 331 S.C. 442 (1998): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under South Carolina law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite S.C.R.Crim.P. 5, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Kennerly, 331 S.C. 442 (1998).",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C.R.Crim.P. 5 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief citing S.C.R.Crim.P. 5",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF SOUTH CAROLINA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (S.C.R.Crim.P. 5) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const scFederalSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of South Carolina.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fourth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fourth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alabama Sections
// ============================================================================

const alCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Jefferson County, Alabama" }
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
];

const alabamaSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Ala. R. Crim. P. 16) in a Alabama criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Ala. R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See Ex parte Monk, 557 So.2d 832 (Ala. 1989). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Alabama Ala. R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Alabama law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Ex parte Monk, 557 So.2d 832 (Ala. 1989): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Alabama law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Ala. R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and Ex parte Monk, 557 So.2d 832 (Ala. 1989).",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief citing Ala. R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ALABAMA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Ala. R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const alFederalSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Alabama.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eleventh Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eleventh Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Louisiana Sections
// ============================================================================

const laCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Criminal District Court, Parish of Orleans, Louisiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXX-XXX" }
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
];

const louisianaSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (La. C.Cr.P. Art. 718-729) in a Louisiana criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under La. C.Cr.P. Art. 718-729, the defense is entitled to discovery of materials relevant to the case. See State v. Knapper, 579 So.2d 956 (La. 1991). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Louisiana La. C.Cr.P. Art. 718-729 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Louisiana law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Louisiana law includes:
- La. C.Cr.P. Art. 718-729: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Knapper, 579 So.2d 956 (La. 1991): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Louisiana law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite La. C.Cr.P. Art. 718-729, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Knapper, 579 So.2d 956 (La. 1991).",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. C.Cr.P. Art. 718-729 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief citing La. C.Cr.P. Art. 718-729",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF LOUISIANA, PARISH OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (La. C.Cr.P. Art. 718-729) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const laFederalSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Louisiana.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fifth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fifth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kentucky Sections
// ============================================================================

const kyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Fayette County, Kentucky" }
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
];

const kentuckySections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (RCr 7.24) in a Kentucky criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under RCr 7.24, the defense is entitled to discovery of materials relevant to the case. See Commonwealth v. Barroso, 122 S.W.3d 554 (Ky. 2003). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Kentucky RCr 7.24 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Kentucky law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Kentucky law includes:
- RCr 7.24: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Commonwealth v. Barroso, 122 S.W.3d 554 (Ky. 2003): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Kentucky law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite RCr 7.24, Brady v. Maryland, 373 U.S. 83 (1963), and Commonwealth v. Barroso, 122 S.W.3d 554 (Ky. 2003).",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to RCr 7.24 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief citing RCr 7.24",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF KENTUCKY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (RCr 7.24) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF KENTUCKY
c/o Commonwealth's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Kentucky that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Kentucky.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Kentucky-specific certificate of service format",
  },
];

const kyFederalSections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Kentucky.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Sixth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Sixth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oregon Sections
// ============================================================================

const orCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Multnomah County, Oregon" }
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
];

const oregonSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (ORS § 135.815-135.873) in a Oregon criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under ORS § 135.815-135.873, the defense is entitled to discovery of materials relevant to the case. See State v. Giles, 239 Or.App. 100 (2010). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Oregon ORS § 135.815-135.873 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Oregon law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Oregon law includes:
- ORS § 135.815-135.873: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Giles, 239 Or.App. 100 (2010): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Oregon law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite ORS § 135.815-135.873, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Giles, 239 Or.App. 100 (2010).",
    helpText: "AI will generate Oregon-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ORS § 135.815-135.873 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief citing ORS § 135.815-135.873",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OREGON, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (ORS § 135.815-135.873) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const orFederalSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Oregon.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oklahoma Sections
// ============================================================================

const okCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Oklahoma County, Oklahoma" }
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
];

const oklahomaSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (22 O.S. § 2002) in a Oklahoma criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under 22 O.S. § 2002, the defense is entitled to discovery of materials relevant to the case. See McCarty v. State, 765 P.2d 1215 (Okla. Crim. App. 1988). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Oklahoma 22 O.S. § 2002 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Oklahoma law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Oklahoma law includes:
- 22 O.S. § 2002: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- McCarty v. State, 765 P.2d 1215 (Okla. Crim. App. 1988): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Oklahoma law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite 22 O.S. § 2002, Brady v. Maryland, 373 U.S. 83 (1963), and McCarty v. State, 765 P.2d 1215 (Okla. Crim. App. 1988).",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 22 O.S. § 2002 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief citing 22 O.S. § 2002",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OKLAHOMA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (22 O.S. § 2002) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const okFederalSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Oklahoma.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Connecticut Sections
// ============================================================================

const ctCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Judicial District of Hartford" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXX-CR-XX-XXXXXXX-X" }
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
];

const connecticutSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Conn. Practice Book § 40-11) in a Connecticut criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Conn. Practice Book § 40-11, the defense is entitled to discovery of materials relevant to the case. See State v. Reddick, 15 Conn.App. 252 (1988). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Connecticut Conn. Practice Book § 40-11 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Connecticut-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Connecticut law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Connecticut law includes:
- Conn. Practice Book § 40-11: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Reddick, 15 Conn.App. 252 (1988): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Connecticut law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Conn. Practice Book § 40-11, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Reddick, 15 Conn.App. 252 (1988).",
    helpText: "AI will generate Connecticut-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Conn. Practice Book § 40-11 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Connecticut prayer for relief citing Conn. Practice Book § 40-11",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF CONNECTICUT, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Conn. Practice Book § 40-11) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF CONNECTICUT
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Connecticut that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Connecticut.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Connecticut-specific certificate of service format",
  },
];

const ctFederalSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Connecticut.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Second Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Second Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Utah Sections
// ============================================================================

const utCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Salt Lake County, Utah" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXXXXXX" }
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
];

const utahSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Utah R. Crim. P. 16) in a Utah criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Utah R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Knight, 734 P.2d 913 (Utah 1987). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Utah Utah R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Utah-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Utah law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Utah law includes:
- Utah R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Knight, 734 P.2d 913 (Utah 1987): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Utah law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Utah R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Knight, 734 P.2d 913 (Utah 1987).",
    helpText: "AI will generate Utah-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Utah R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Utah prayer for relief citing Utah R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF UTAH, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Utah R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF UTAH
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Utah that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Utah.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Utah-specific certificate of service format",
  },
];

const utFederalSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Utah.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Iowa Sections
// ============================================================================

const iaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Polk County, Iowa" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., FECR-XXXXXX" }
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
];

const iowaSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Iowa R. Crim. P. 2.14) in a Iowa criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Iowa R. Crim. P. 2.14, the defense is entitled to discovery of materials relevant to the case. See State v. Vincik, 398 N.W.2d 788 (Iowa 1987). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Iowa Iowa R. Crim. P. 2.14 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Iowa-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Iowa law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Iowa law includes:
- Iowa R. Crim. P. 2.14: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Vincik, 398 N.W.2d 788 (Iowa 1987): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Iowa law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Iowa R. Crim. P. 2.14, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Vincik, 398 N.W.2d 788 (Iowa 1987).",
    helpText: "AI will generate Iowa-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Iowa R. Crim. P. 2.14 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Iowa prayer for relief citing Iowa R. Crim. P. 2.14",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF IOWA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Iowa R. Crim. P. 2.14) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF IOWA
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Iowa that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Iowa.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Iowa-specific certificate of service format",
  },
];

const iaFederalSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Iowa.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nevada Sections
// ============================================================================

const nvCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Clark County, Nevada" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., C-XXXXXX" }
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
];

const nevadaSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (NRS § 174.235) in a Nevada criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under NRS § 174.235, the defense is entitled to discovery of materials relevant to the case. See Roviaro v. United States (applied in NV courts). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Nevada NRS § 174.235 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Nevada-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Nevada law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Nevada law includes:
- NRS § 174.235: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Roviaro v. United States (applied in NV courts): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Nevada law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite NRS § 174.235, Brady v. Maryland, 373 U.S. 83 (1963), and Roviaro v. United States (applied in NV courts).",
    helpText: "AI will generate Nevada-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NRS § 174.235 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nevada prayer for relief citing NRS § 174.235",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEVADA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (NRS § 174.235) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF NEVADA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Nevada that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Nevada.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Nevada-specific certificate of service format",
  },
];

const nvFederalSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Nevada.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arkansas Sections
// ============================================================================

const arCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Pulaski County, Arkansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XX-XXXX" }
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
];

const arkansasSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Ark. R. Crim. P. 17.1) in a Arkansas criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Ark. R. Crim. P. 17.1, the defense is entitled to discovery of materials relevant to the case. See Nooner v. State, 322 Ark. 87 (1995). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Arkansas Ark. R. Crim. P. 17.1 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Arkansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Arkansas law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Arkansas law includes:
- Ark. R. Crim. P. 17.1: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Nooner v. State, 322 Ark. 87 (1995): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Arkansas law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Ark. R. Crim. P. 17.1, Brady v. Maryland, 373 U.S. 83 (1963), and Nooner v. State, 322 Ark. 87 (1995).",
    helpText: "AI will generate Arkansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ark. R. Crim. P. 17.1 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arkansas prayer for relief citing Ark. R. Crim. P. 17.1",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ARKANSAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Ark. R. Crim. P. 17.1) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF ARKANSAS
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Arkansas that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Arkansas.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Arkansas-specific certificate of service format",
  },
];

const arFederalSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Arkansas.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Mississippi Sections
// ============================================================================

const msCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Hinds County, Mississippi" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XXXX-KR" }
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
];

const mississippiSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Miss. URCCC 9.04) in a Mississippi criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Miss. URCCC 9.04, the defense is entitled to discovery of materials relevant to the case. See Stringer v. State, 500 So.2d 928 (Miss. 1986). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Mississippi Miss. URCCC 9.04 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Mississippi-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Mississippi law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Mississippi law includes:
- Miss. URCCC 9.04: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Stringer v. State, 500 So.2d 928 (Miss. 1986): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Mississippi law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Miss. URCCC 9.04, Brady v. Maryland, 373 U.S. 83 (1963), and Stringer v. State, 500 So.2d 928 (Miss. 1986).",
    helpText: "AI will generate Mississippi-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Miss. URCCC 9.04 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Mississippi prayer for relief citing Miss. URCCC 9.04",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MISSISSIPPI, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Miss. URCCC 9.04) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF MISSISSIPPI
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Mississippi that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Mississippi.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Mississippi-specific certificate of service format",
  },
];

const msFederalSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Mississippi.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fifth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fifth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kansas Sections
// ============================================================================

const ksCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Sedgwick County, Kansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-CR-XXXX" }
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
];

const kansasSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (K.S.A. § 22-3212) in a Kansas criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under K.S.A. § 22-3212, the defense is entitled to discovery of materials relevant to the case. See State v. Warrior, 294 Kan. 484 (2012). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Kansas K.S.A. § 22-3212 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Kansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Kansas law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Kansas law includes:
- K.S.A. § 22-3212: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Warrior, 294 Kan. 484 (2012): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Kansas law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite K.S.A. § 22-3212, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Warrior, 294 Kan. 484 (2012).",
    helpText: "AI will generate Kansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to K.S.A. § 22-3212 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kansas prayer for relief citing K.S.A. § 22-3212",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF KANSAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (K.S.A. § 22-3212) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF KANSAS
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Kansas that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Kansas.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Kansas-specific certificate of service format",
  },
];

const ksFederalSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Kansas.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Mexico Sections
// ============================================================================

const nmCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Bernalillo County, New Mexico" }
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
];

const newMexicoSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (N.M. R.A. Rule 5-501) in a New Mexico criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under N.M. R.A. Rule 5-501, the defense is entitled to discovery of materials relevant to the case. See State v. Gutierrez, 2007-NMSC-033. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Mexico N.M. R.A. Rule 5-501 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a New Mexico-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under New Mexico law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable New Mexico law includes:
- N.M. R.A. Rule 5-501: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Gutierrez, 2007-NMSC-033: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under New Mexico law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite N.M. R.A. Rule 5-501, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Gutierrez, 2007-NMSC-033.",
    helpText: "AI will generate New Mexico-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.M. R.A. Rule 5-501 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Mexico prayer for relief citing N.M. R.A. Rule 5-501",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW MEXICO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (N.M. R.A. Rule 5-501) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF NEW MEXICO
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of New Mexico that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, New Mexico.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "New Mexico-specific certificate of service format",
  },
];

const nmFederalSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of New Mexico.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nebraska Sections
// ============================================================================

const neCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Douglas County, Nebraska" }
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
];

const nebraskaSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Neb. Rev. Stat. § 29-1912) in a Nebraska criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Neb. Rev. Stat. § 29-1912, the defense is entitled to discovery of materials relevant to the case. See State v. El-Tabech, 225 Neb. 395 (1987). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Nebraska Neb. Rev. Stat. § 29-1912 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Nebraska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Nebraska law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Nebraska law includes:
- Neb. Rev. Stat. § 29-1912: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. El-Tabech, 225 Neb. 395 (1987): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Nebraska law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Neb. Rev. Stat. § 29-1912, Brady v. Maryland, 373 U.S. 83 (1963), and State v. El-Tabech, 225 Neb. 395 (1987).",
    helpText: "AI will generate Nebraska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Neb. Rev. Stat. § 29-1912 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nebraska prayer for relief citing Neb. Rev. Stat. § 29-1912",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEBRASKA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Neb. Rev. Stat. § 29-1912) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF NEBRASKA
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Nebraska that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Nebraska.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Nebraska-specific certificate of service format",
  },
];

const neFederalSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Nebraska.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Idaho Sections
// ============================================================================

const idCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Ada County, Idaho" }
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
];

const idahoSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (I.C.R. 16) in a Idaho criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under I.C.R. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Drapeau, 97 Idaho 685 (1976). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Idaho I.C.R. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Idaho-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Idaho law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Idaho law includes:
- I.C.R. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Drapeau, 97 Idaho 685 (1976): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Idaho law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite I.C.R. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Drapeau, 97 Idaho 685 (1976).",
    helpText: "AI will generate Idaho-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to I.C.R. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Idaho prayer for relief citing I.C.R. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF IDAHO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (I.C.R. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF IDAHO
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Idaho that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Idaho.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Idaho-specific certificate of service format",
  },
];

const idFederalSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Idaho.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Hawaii Sections
// ============================================================================

const hiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, First Circuit, Honolulu" }
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
];

const hawaiiSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (HRPP Rule 16) in a Hawaii criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under HRPP Rule 16, the defense is entitled to discovery of materials relevant to the case. See State v. Peseti, 101 Haw. 172 (2003). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Hawaii HRPP Rule 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Hawaii-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Hawaii law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Hawaii law includes:
- HRPP Rule 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Peseti, 101 Haw. 172 (2003): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Hawaii law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite HRPP Rule 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Peseti, 101 Haw. 172 (2003).",
    helpText: "AI will generate Hawaii-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to HRPP Rule 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Hawaii prayer for relief citing HRPP Rule 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF HAWAII, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (HRPP Rule 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF HAWAII
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Hawaii that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Hawaii.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Hawaii-specific certificate of service format",
  },
];

const hiFederalSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Hawaii.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// West Virginia Sections
// ============================================================================

const wvCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Kanawha County, West Virginia" }
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
];

const westVirginiaSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (W.Va. R. Crim. P. 16) in a West Virginia criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under W.Va. R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Hatfield, 169 W.Va. 191 (1982). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a West Virginia W.Va. R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a West Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under West Virginia law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable West Virginia law includes:
- W.Va. R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Hatfield, 169 W.Va. 191 (1982): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under West Virginia law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite W.Va. R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Hatfield, 169 W.Va. 191 (1982).",
    helpText: "AI will generate West Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.Va. R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "West Virginia prayer for relief citing W.Va. R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WEST VIRGINIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (W.Va. R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF WEST VIRGINIA
c/o Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of West Virginia that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, West Virginia.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "West Virginia-specific certificate of service format",
  },
];

const wvFederalSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of West Virginia.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Fourth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Fourth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maine Sections
// ============================================================================

const meCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Cumberland County, Maine" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XX-XXXX" }
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
];

const maineSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (M.R.U.Crim.P. 16) in a Maine criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under M.R.U.Crim.P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Ormsby, 2000 ME 29. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Maine M.R.U.Crim.P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Maine-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Maine law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Maine law includes:
- M.R.U.Crim.P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Ormsby, 2000 ME 29: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Maine law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite M.R.U.Crim.P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Ormsby, 2000 ME 29.",
    helpText: "AI will generate Maine-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to M.R.U.Crim.P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maine prayer for relief citing M.R.U.Crim.P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MAINE, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (M.R.U.Crim.P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF MAINE
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Maine that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Maine.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Maine-specific certificate of service format",
  },
];

const meFederalSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Maine.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the First Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- First Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Montana Sections
// ============================================================================

const mtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Lewis and Clark County, Montana" }
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
];

const montanaSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Mont. Code Ann. § 46-15-322) in a Montana criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Mont. Code Ann. § 46-15-322, the defense is entitled to discovery of materials relevant to the case. See State v. Kills on Top, 236 Mont. 349 (1989). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Montana Mont. Code Ann. § 46-15-322 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Montana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Montana law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Montana law includes:
- Mont. Code Ann. § 46-15-322: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Kills on Top, 236 Mont. 349 (1989): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Montana law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Mont. Code Ann. § 46-15-322, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Kills on Top, 236 Mont. 349 (1989).",
    helpText: "AI will generate Montana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mont. Code Ann. § 46-15-322 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Montana prayer for relief citing Mont. Code Ann. § 46-15-322",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MONTANA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Mont. Code Ann. § 46-15-322) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF MONTANA
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Montana that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Montana.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Montana-specific certificate of service format",
  },
];

const mtFederalSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Montana.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Hampshire Sections
// ============================================================================

const nhCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Hillsborough County, New Hampshire" }
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
];

const newHampshireSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (N.H. Super. Ct. R. 98) in a New Hampshire criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under N.H. Super. Ct. R. 98, the defense is entitled to discovery of materials relevant to the case. See State v. Laurie, 139 N.H. 325 (1995). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Hampshire N.H. Super. Ct. R. 98 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a New Hampshire-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under New Hampshire law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable New Hampshire law includes:
- N.H. Super. Ct. R. 98: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Laurie, 139 N.H. 325 (1995): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under New Hampshire law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite N.H. Super. Ct. R. 98, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Laurie, 139 N.H. 325 (1995).",
    helpText: "AI will generate New Hampshire-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.H. Super. Ct. R. 98 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Hampshire prayer for relief citing N.H. Super. Ct. R. 98",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW HAMPSHIRE, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (N.H. Super. Ct. R. 98) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF NEW HAMPSHIRE
c/o County Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of New Hampshire that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, New Hampshire.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "New Hampshire-specific certificate of service format",
  },
];

const nhFederalSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of New Hampshire.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the First Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- First Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Dakota Sections
// ============================================================================

const ndCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Cass County, North Dakota" }
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
];

const northDakotaSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (N.D.R.Crim.P. 16) in a North Dakota criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under N.D.R.Crim.P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Heiskell, 2004 ND 175. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a North Dakota N.D.R.Crim.P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a North Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under North Dakota law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable North Dakota law includes:
- N.D.R.Crim.P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Heiskell, 2004 ND 175: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under North Dakota law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite N.D.R.Crim.P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Heiskell, 2004 ND 175.",
    helpText: "AI will generate North Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.D.R.Crim.P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Dakota prayer for relief citing N.D.R.Crim.P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NORTH DAKOTA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (N.D.R.Crim.P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF NORTH DAKOTA
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of North Dakota that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, North Dakota.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "North Dakota-specific certificate of service format",
  },
];

const ndFederalSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of North Dakota.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Rhode Island Sections
// ============================================================================

const riCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Providence County, Rhode Island" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., P-XXXX-XXXXXX" }
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
];

const rhodeIslandSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (R.I. Super. R. Crim. P. 16) in a Rhode Island criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under R.I. Super. R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Wyatt, 687 A.2d 483 (R.I. 1997). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Rhode Island R.I. Super. R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Rhode Island-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Rhode Island law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Rhode Island law includes:
- R.I. Super. R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Wyatt, 687 A.2d 483 (R.I. 1997): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Rhode Island law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite R.I. Super. R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Wyatt, 687 A.2d 483 (R.I. 1997).",
    helpText: "AI will generate Rhode Island-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to R.I. Super. R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Rhode Island prayer for relief citing R.I. Super. R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF RHODE ISLAND, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (R.I. Super. R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF RHODE ISLAND
c/o Attorney General
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Rhode Island that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Rhode Island.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Rhode Island-specific certificate of service format",
  },
];

const riFederalSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Rhode Island.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the First Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- First Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Dakota Sections
// ============================================================================

const sdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, Minnehaha County, South Dakota" }
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
];

const southDakotaSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (SDCL § 23A-13-4) in a South Dakota criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under SDCL § 23A-13-4, the defense is entitled to discovery of materials relevant to the case. See State v. Reddest, 2011 SD 55. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a South Dakota SDCL § 23A-13-4 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a South Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under South Dakota law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable South Dakota law includes:
- SDCL § 23A-13-4: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Reddest, 2011 SD 55: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under South Dakota law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite SDCL § 23A-13-4, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Reddest, 2011 SD 55.",
    helpText: "AI will generate South Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to SDCL § 23A-13-4 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Dakota prayer for relief citing SDCL § 23A-13-4",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF SOUTH DAKOTA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (SDCL § 23A-13-4) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF SOUTH DAKOTA
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of South Dakota that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, South Dakota.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "South Dakota-specific certificate of service format",
  },
];

const sdFederalSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of South Dakota.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Eighth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Eighth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Vermont Sections
// ============================================================================

const vtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Criminal Division, Chittenden Unit" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XX-XXXX" }
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
];

const vermontSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (V.R.Cr.P. 16) in a Vermont criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under V.R.Cr.P. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Lynch, 2004 VT 4. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Vermont V.R.Cr.P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Vermont-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Vermont law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Vermont law includes:
- V.R.Cr.P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Lynch, 2004 VT 4: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Vermont law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite V.R.Cr.P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Lynch, 2004 VT 4.",
    helpText: "AI will generate Vermont-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to V.R.Cr.P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Vermont prayer for relief citing V.R.Cr.P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF VERMONT, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (V.R.Cr.P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF VERMONT
c/o State's Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Vermont that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Vermont.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Vermont-specific certificate of service format",
  },
];

const vtFederalSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Vermont.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Second Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Second Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wyoming Sections
// ============================================================================

const wyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, Laramie County, Wyoming" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XXXX-XX-XXX" }
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
];

const wyomingSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (W.R.Cr.P. 16) in a Wyoming criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under W.R.Cr.P. 16, the defense is entitled to discovery of materials relevant to the case. See Dean v. State, 2003 WY 128. Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Wyoming W.R.Cr.P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Wyoming-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Wyoming law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Wyoming law includes:
- W.R.Cr.P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Dean v. State, 2003 WY 128: Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Wyoming law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite W.R.Cr.P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and Dean v. State, 2003 WY 128.",
    helpText: "AI will generate Wyoming-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.R.Cr.P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wyoming prayer for relief citing W.R.Cr.P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF WYOMING, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (W.R.Cr.P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF WYOMING
c/o County and Prosecuting Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Wyoming that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Wyoming.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Wyoming-specific certificate of service format",
  },
];

const wyFederalSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Wyoming.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Tenth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Tenth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alaska Sections
// ============================================================================

const akCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Third Judicial District, Anchorage" }
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
];

const alaskaSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Alaska R. Crim. P. 16) in a Alaska criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Alaska R. Crim. P. 16, the defense is entitled to discovery of materials relevant to the case. See Risher v. State, 523 P.2d 421 (Alaska 1974). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Alaska Alaska R. Crim. P. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Alaska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Alaska law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Alaska law includes:
- Alaska R. Crim. P. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Risher v. State, 523 P.2d 421 (Alaska 1974): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Alaska law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Alaska R. Crim. P. 16, Brady v. Maryland, 373 U.S. 83 (1963), and Risher v. State, 523 P.2d 421 (Alaska 1974).",
    helpText: "AI will generate Alaska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Alaska R. Crim. P. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alaska prayer for relief citing Alaska R. Crim. P. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ALASKA, BOROUGH/JUDICIAL DISTRICT OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Alaska R. Crim. P. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF ALASKA
c/o District Attorney
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Alaska that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Alaska.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Alaska-specific certificate of service format",
  },
];

const akFederalSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Alaska.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Ninth Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Ninth Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Delaware Sections
// ============================================================================

const deCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, New Castle County, Delaware" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., ID No. XXXXXXXXXX" }
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
];

const delawareSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (Del. Super. Ct. Crim. R. 16) in a Delaware criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Del. Super. Ct. Crim. R. 16, the defense is entitled to discovery of materials relevant to the case. See State v. Wright, 67 A.3d 319 (Del. 2013). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Delaware Del. Super. Ct. Crim. R. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a Delaware-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under Delaware law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable Delaware law includes:
- Del. Super. Ct. Crim. R. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- State v. Wright, 67 A.3d 319 (Del. 2013): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under Delaware law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite Del. Super. Ct. Crim. R. 16, Brady v. Maryland, 373 U.S. 83 (1963), and State v. Wright, 67 A.3d 319 (Del. 2013).",
    helpText: "AI will generate Delaware-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Del. Super. Ct. Crim. R. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Delaware prayer for relief citing Del. Super. Ct. Crim. R. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF DELAWARE, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (Del. Super. Ct. Crim. R. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

STATE OF DELAWARE
c/o Attorney General
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the State of Delaware that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, Delaware.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Delaware-specific certificate of service format",
  },
];

const deFederalSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of Delaware.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the Third Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- Third Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// District of Columbia Sections
// ============================================================================

const dcCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., D.C. Superior Court, Criminal Division" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXXXX" }
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
];

const districtofColumbiaSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion (D.C. Super. Ct. Crim. R. 16) in a District of Columbia criminal matter.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under D.C. Super. Ct. Crim. R. 16, the defense is entitled to discovery of materials relevant to the case. See Brady v. Maryland, 373 U.S. 83 (1963) (originating from D.C. area). Additionally, Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence.

Generate 3-4 paragraphs that:
1. Describe the case and the discovery being sought
2. Detail what discovery requests have been made and the prosecution's response
3. Explain why the requested discovery is material to the defense
4. Describe why additional court intervention is needed to compel discovery

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a District of Columbia D.C. Super. Ct. Crim. R. 16 discovery motion. Present facts chronologically.",
    helpText: "AI will generate a District of Columbia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion for discovery / Brady motion under District of Columbia law.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable District of Columbia law includes:
- D.C. Super. Ct. Crim. R. 16: Discovery in criminal cases
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence disclosure
- Brady v. Maryland, 373 U.S. 83 (1963) (originating from D.C. area): Key state precedent

Generate 3-5 paragraphs that:
1. State the applicable legal standard for discovery under District of Columbia law
2. Cite Brady and its progeny regarding the duty to disclose
3. Address the materiality of the evidence sought
4. Apply the facts to the legal standard
5. Address any prosecution objections and why they should be overruled

Use formal legal writing style with proper citations.`,
    aiInstructions: "Must cite D.C. Super. Ct. Crim. R. 16, Brady v. Maryland, 373 U.S. 83 (1963), and Brady v. Maryland, 373 U.S. 83 (1963) (originating from D.C. area).",
    helpText: "AI will generate District of Columbia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to D.C. Super. Ct. Crim. R. 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "District of Columbia prayer for relief citing D.C. Super. Ct. Crim. R. 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

DISTRICT OF COLUMBIA, WARD OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION (D.C. Super. Ct. Crim. R. 16) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

DISTRICT OF COLUMBIA
c/o United States Attorney for the District of Columbia
________________________________
________________________________
________________________________

I declare under penalty of perjury under the laws of the District of Columbia that the foregoing is true and correct.

Executed on __________________, 20___, at ________________, District of Columbia.


____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "District of Columbia-specific certificate of service format",
  },
];

const dcFederalSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion for discovery / Brady motion in a federal criminal matter in the District of District of Columbia.

Case Details:
- Discovery Type: {{discoveryType}}
- Specific Requests: {{specificRequests}}
- Basis for Request: {{basisForRequest}}
- Prosecution Response: {{prosecutionResponse}}

Under Federal Rule of Criminal Procedure 16, the defense is entitled to discovery of relevant materials. Brady v. Maryland, 373 U.S. 83 (1963) requires disclosure of all exculpatory evidence. Giglio v. United States, 405 U.S. 150 (1972) extends this to impeachment evidence.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal discovery / Brady motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion for discovery / Brady motion in the D.C. Circuit.

Discovery Type: {{discoveryType}}
Specific Requests: {{specificRequests}}
Basis for Request: {{basisForRequest}}
Prosecution Response: {{prosecutionResponse}}
Prior Discovery Requests: {{priorRequests}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 16: Discovery and inspection
- Brady v. Maryland, 373 U.S. 83 (1963): Duty to disclose exculpatory evidence
- Giglio v. United States, 405 U.S. 150 (1972): Impeachment evidence
- Fifth Amendment: Due process protections
- Sixth Amendment: Right to effective assistance of counsel
- D.C. Circuit precedent on discovery motions

Generate 3-5 paragraphs applying federal constitutional and statutory standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 16, Brady v. Maryland, Giglio v. United States, and D.C. Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 16 and Brady v. Maryland, 373 U.S. 83 (1963) to:

1. Order the prosecution to produce all requested discovery materials;

2. Order the prosecution to disclose all exculpatory and impeachment evidence pursuant to Brady and Giglio;

3. Impose appropriate sanctions for any non-compliance with discovery obligations;

4. Continue the trial date if necessary to allow adequate time to review disclosed materials;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rule of Criminal Procedure 16",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION FOR DISCOVERY / BRADY MOTION on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]

____________________________
[Declarant's Name - Printed]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Template Export
// ============================================================================

export const motionForDiscoveryTemplate: DocumentTemplate = {
  id: "motion-for-discovery",
  name: "Motion for Discovery / Brady Motion",
  category: "criminal",
  description: "A motion for discovery and disclosure of evidence in a criminal case pursuant to Brady v. Maryland, 373 U.S. 83 (1963), Federal Rule of Criminal Procedure 16, and state-specific discovery rules. Covers requests for exculpatory evidence (Brady material), witness lists, physical evidence, expert reports, law enforcement records, electronic evidence, informant records, and plea agreements. Ensures the defense's constitutional right to obtain material evidence necessary for a fair trial.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  baseSections,
  jurisdictionVariants: [
    // California
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "Filed under Cal. Penal Code § 1054 et seq. (Proposition 115 discovery). Brady v. Maryland, 373 U.S. 83 (1963) applies. See People v. Superior Court (Laff) (2001) 25 Cal.4th 703.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: caFederalSections,
      courtSpecificRules: "CACD: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: caFederalSections,
      courtSpecificRules: "NDCA: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: caFederalSections,
      courtSpecificRules: "EDCA: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: caFederalSections,
      courtSpecificRules: "SDCA: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // New York
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: newYorkSections,
      courtSpecificRules: "Filed under CPL § 245.10 et seq. (2020 discovery reform). Brady v. Maryland, 373 U.S. 83 (1963) applies. See People v. Rosario, 9 N.Y.2d 286.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "SDNY: 12pt font. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "EDNY: 12pt font. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "NDNY: 12pt font. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "WDNY: 12pt font. Second Circuit. CM/ECF required.",
    },
    // Texas
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: texasSections,
      courtSpecificRules: "Filed under Tex. Code Crim. Proc. Art. 39.14 (Michael Morton Act). Brady v. Maryland, 373 U.S. 83 (1963) applies. See Watkins v. State (Tex. Crim. App. 2019).",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "TXND: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "TXSD: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "TXED: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "TXWD: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    // Florida
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: floridaSections,
      courtSpecificRules: "Filed under Fla. R. Crim. P. 3.220. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Coney, 845 So.2d 120 (Fla. 2003).",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "FLSD: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "FLMD: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "FLND: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    // Pennsylvania
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: pennsylvaniaSections,
      courtSpecificRules: "Filed under Pa.R.Crim.P. 573. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Commonwealth v. Burke, 781 A.2d 1136 (Pa. 2001).",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "PAED: 12pt font. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "PAMD: 12pt font. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "PAWD: 12pt font. Third Circuit. CM/ECF required.",
    },
    // Illinois
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: illinoisSections,
      courtSpecificRules: "Filed under 725 ILCS 5/114-13. Brady v. Maryland, 373 U.S. 83 (1963) applies. See People v. Beaman, 229 Ill.2d 56 (2008).",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "ILND: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "ILCD: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "ILSD: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    // Ohio
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohioSections,
      courtSpecificRules: "Filed under Ohio Crim.R. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Gondor, 112 Ohio St.3d 377 (2006).",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "OHND: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "OHSD: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // Georgia
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: georgiaSections,
      courtSpecificRules: "Filed under O.C.G.A. § 17-16-1 et seq.. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Roviaro v. United States (applied in GA courts).",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "GAND: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "GAMD: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "GASD: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    // North Carolina
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: northCarolinaSections,
      courtSpecificRules: "Filed under N.C.G.S. § 15A-903 (Open File Discovery). Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Bates, 348 N.C. 29 (1998).",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "EDNC: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "MDNC: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "WDNC: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Michigan
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: michiganSections,
      courtSpecificRules: "Filed under MCR 6.201. Brady v. Maryland, 373 U.S. 83 (1963) applies. See People v. Lester, 232 Mich.App. 262 (1998).",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "EDMI: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "WDMI: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // New Jersey
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: newJerseySections,
      courtSpecificRules: "Filed under N.J. Court Rules R. 3:13-3. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Marshall, 148 N.J. 89 (1997).",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "DNJ: 12pt font. Third Circuit. CM/ECF required.",
    },
    // Virginia
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: virginiaSections,
      courtSpecificRules: "Filed under Va. Sup. Ct. R. 3A:11. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Youngblood v. West Virginia (applied in VA).",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "EDVA: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "WDVA: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Washington
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: washingtonSections,
      courtSpecificRules: "Filed under CrR 4.7. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Knutson, 121 Wash.2d 766 (1993).",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "EDWA: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "WDWA: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Arizona
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: arizonaSections,
      courtSpecificRules: "Filed under Ariz. R. Crim. P. 15.1. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Roper, 140 Ariz. 471 (1984).",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "DAZ: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Massachusetts
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: massachusettsSections,
      courtSpecificRules: "Filed under Mass. R. Crim. P. 14. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Commonwealth v. Tucceri, 412 Mass. 401 (1992).",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "DMA: 12pt font. First Circuit. CM/ECF required.",
    },
    // Indiana
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Filed under Ind. Code § 35-36-2-1. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Harrison v. State, 707 N.E.2d 767 (Ind. 1999).",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "NDIN: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "SDIN: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    // Tennessee
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Filed under Tenn. R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Edgin, 902 S.W.2d 387 (Tenn. 1995).",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "EDTN: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "MDTN: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "WDTN: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // Missouri
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Filed under Mo. Sup. Ct. R. 25.03. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Mease, 842 S.W.2d 98 (Mo. 1992).",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "EDMO: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "WDMO: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Maryland
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Filed under Md. Rule 4-263. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Williams v. State, 364 Md. 160 (2001).",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "DMD: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Wisconsin
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Filed under Wis. Stat. § 971.23. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Harris, 2008 WI 15.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "EDWI: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "WDWI: 12pt font. Seventh Circuit. CM/ECF required.",
    },
    // Colorado
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coloradoSections,
      courtSpecificRules: "Filed under Colo. R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See People v. District Court (Losavio), 626 P.2d 1092 (Colo. 1981).",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "DCO: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Minnesota
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: minnesotaSections,
      courtSpecificRules: "Filed under Minn. R. Crim. P. 9.01. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Lindsey, 284 N.W.2d 368 (Minn. 1979).",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "DMN: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // South Carolina
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: southCarolinaSections,
      courtSpecificRules: "Filed under S.C.R.Crim.P. 5. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Kennerly, 331 S.C. 442 (1998).",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "DSC: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Alabama
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alabamaSections,
      courtSpecificRules: "Filed under Ala. R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Ex parte Monk, 557 So.2d 832 (Ala. 1989).",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "NDAL: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "MDAL: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "SDAL: 12pt font. Eleventh Circuit. CM/ECF required.",
    },
    // Louisiana
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: louisianaSections,
      courtSpecificRules: "Filed under La. C.Cr.P. Art. 718-729. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Knapper, 579 So.2d 956 (La. 1991).",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "EDLA: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "MDLA: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "WDLA: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    // Kentucky
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kentuckySections,
      courtSpecificRules: "Filed under RCr 7.24. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Commonwealth v. Barroso, 122 S.W.3d 554 (Ky. 2003).",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "EDKY: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "WDKY: 12pt font. Sixth Circuit. CM/ECF required.",
    },
    // Oregon
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: oregonSections,
      courtSpecificRules: "Filed under ORS § 135.815-135.873. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Giles, 239 Or.App. 100 (2010).",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "DOR: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Oklahoma
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: oklahomaSections,
      courtSpecificRules: "Filed under 22 O.S. § 2002. Brady v. Maryland, 373 U.S. 83 (1963) applies. See McCarty v. State, 765 P.2d 1215 (Okla. Crim. App. 1988).",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "EDOK: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "NDOK: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "WDOK: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Connecticut
    {
      jurisdiction: "CT",
      courtType: "state",
      sections: connecticutSections,
      courtSpecificRules: "Filed under Conn. Practice Book § 40-11. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Reddick, 15 Conn.App. 252 (1988).",
    },
    {
      jurisdiction: "CT",
      courtType: "federal",
      district: "DCT",
      sections: ctFederalSections,
      courtSpecificRules: "DCT: 12pt font. Second Circuit. CM/ECF required.",
    },
    // Utah
    {
      jurisdiction: "UT",
      courtType: "state",
      sections: utahSections,
      courtSpecificRules: "Filed under Utah R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Knight, 734 P.2d 913 (Utah 1987).",
    },
    {
      jurisdiction: "UT",
      courtType: "federal",
      district: "DUT",
      sections: utFederalSections,
      courtSpecificRules: "DUT: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Iowa
    {
      jurisdiction: "IA",
      courtType: "state",
      sections: iowaSections,
      courtSpecificRules: "Filed under Iowa R. Crim. P. 2.14. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Vincik, 398 N.W.2d 788 (Iowa 1987).",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "NDIA",
      sections: iaFederalSections,
      courtSpecificRules: "NDIA: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "SDIA",
      sections: iaFederalSections,
      courtSpecificRules: "SDIA: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Nevada
    {
      jurisdiction: "NV",
      courtType: "state",
      sections: nevadaSections,
      courtSpecificRules: "Filed under NRS § 174.235. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Roviaro v. United States (applied in NV courts).",
    },
    {
      jurisdiction: "NV",
      courtType: "federal",
      district: "DNV",
      sections: nvFederalSections,
      courtSpecificRules: "DNV: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Arkansas
    {
      jurisdiction: "AR",
      courtType: "state",
      sections: arkansasSections,
      courtSpecificRules: "Filed under Ark. R. Crim. P. 17.1. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Nooner v. State, 322 Ark. 87 (1995).",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "EDAR",
      sections: arFederalSections,
      courtSpecificRules: "EDAR: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "WDAR",
      sections: arFederalSections,
      courtSpecificRules: "WDAR: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Mississippi
    {
      jurisdiction: "MS",
      courtType: "state",
      sections: mississippiSections,
      courtSpecificRules: "Filed under Miss. URCCC 9.04. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Stringer v. State, 500 So.2d 928 (Miss. 1986).",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "NDMS",
      sections: msFederalSections,
      courtSpecificRules: "NDMS: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "SDMS",
      sections: msFederalSections,
      courtSpecificRules: "SDMS: 12pt font. Fifth Circuit. CM/ECF required.",
    },
    // Kansas
    {
      jurisdiction: "KS",
      courtType: "state",
      sections: kansasSections,
      courtSpecificRules: "Filed under K.S.A. § 22-3212. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Warrior, 294 Kan. 484 (2012).",
    },
    {
      jurisdiction: "KS",
      courtType: "federal",
      district: "DKS",
      sections: ksFederalSections,
      courtSpecificRules: "DKS: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // New Mexico
    {
      jurisdiction: "NM",
      courtType: "state",
      sections: newMexicoSections,
      courtSpecificRules: "Filed under N.M. R.A. Rule 5-501. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Gutierrez, 2007-NMSC-033.",
    },
    {
      jurisdiction: "NM",
      courtType: "federal",
      district: "DNM",
      sections: nmFederalSections,
      courtSpecificRules: "DNM: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Nebraska
    {
      jurisdiction: "NE",
      courtType: "state",
      sections: nebraskaSections,
      courtSpecificRules: "Filed under Neb. Rev. Stat. § 29-1912. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. El-Tabech, 225 Neb. 395 (1987).",
    },
    {
      jurisdiction: "NE",
      courtType: "federal",
      district: "DNE",
      sections: neFederalSections,
      courtSpecificRules: "DNE: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Idaho
    {
      jurisdiction: "ID",
      courtType: "state",
      sections: idahoSections,
      courtSpecificRules: "Filed under I.C.R. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Drapeau, 97 Idaho 685 (1976).",
    },
    {
      jurisdiction: "ID",
      courtType: "federal",
      district: "DID",
      sections: idFederalSections,
      courtSpecificRules: "DID: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Hawaii
    {
      jurisdiction: "HI",
      courtType: "state",
      sections: hawaiiSections,
      courtSpecificRules: "Filed under HRPP Rule 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Peseti, 101 Haw. 172 (2003).",
    },
    {
      jurisdiction: "HI",
      courtType: "federal",
      district: "DHI",
      sections: hiFederalSections,
      courtSpecificRules: "DHI: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // West Virginia
    {
      jurisdiction: "WV",
      courtType: "state",
      sections: westVirginiaSections,
      courtSpecificRules: "Filed under W.Va. R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Hatfield, 169 W.Va. 191 (1982).",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "NDWV",
      sections: wvFederalSections,
      courtSpecificRules: "NDWV: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "SDWV",
      sections: wvFederalSections,
      courtSpecificRules: "SDWV: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Maine
    {
      jurisdiction: "ME",
      courtType: "state",
      sections: maineSections,
      courtSpecificRules: "Filed under M.R.U.Crim.P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Ormsby, 2000 ME 29.",
    },
    {
      jurisdiction: "ME",
      courtType: "federal",
      district: "DME",
      sections: meFederalSections,
      courtSpecificRules: "DME: 12pt font. First Circuit. CM/ECF required.",
    },
    // Montana
    {
      jurisdiction: "MT",
      courtType: "state",
      sections: montanaSections,
      courtSpecificRules: "Filed under Mont. Code Ann. § 46-15-322. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Kills on Top, 236 Mont. 349 (1989).",
    },
    {
      jurisdiction: "MT",
      courtType: "federal",
      district: "DMT",
      sections: mtFederalSections,
      courtSpecificRules: "DMT: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // New Hampshire
    {
      jurisdiction: "NH",
      courtType: "state",
      sections: newHampshireSections,
      courtSpecificRules: "Filed under N.H. Super. Ct. R. 98. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Laurie, 139 N.H. 325 (1995).",
    },
    {
      jurisdiction: "NH",
      courtType: "federal",
      district: "DNH",
      sections: nhFederalSections,
      courtSpecificRules: "DNH: 12pt font. First Circuit. CM/ECF required.",
    },
    // North Dakota
    {
      jurisdiction: "ND",
      courtType: "state",
      sections: northDakotaSections,
      courtSpecificRules: "Filed under N.D.R.Crim.P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Heiskell, 2004 ND 175.",
    },
    {
      jurisdiction: "ND",
      courtType: "federal",
      district: "DND",
      sections: ndFederalSections,
      courtSpecificRules: "DND: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Rhode Island
    {
      jurisdiction: "RI",
      courtType: "state",
      sections: rhodeIslandSections,
      courtSpecificRules: "Filed under R.I. Super. R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Wyatt, 687 A.2d 483 (R.I. 1997).",
    },
    {
      jurisdiction: "RI",
      courtType: "federal",
      district: "DRI",
      sections: riFederalSections,
      courtSpecificRules: "DRI: 12pt font. First Circuit. CM/ECF required.",
    },
    // South Dakota
    {
      jurisdiction: "SD",
      courtType: "state",
      sections: southDakotaSections,
      courtSpecificRules: "Filed under SDCL § 23A-13-4. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Reddest, 2011 SD 55.",
    },
    {
      jurisdiction: "SD",
      courtType: "federal",
      district: "DSD",
      sections: sdFederalSections,
      courtSpecificRules: "DSD: 12pt font. Eighth Circuit. CM/ECF required.",
    },
    // Vermont
    {
      jurisdiction: "VT",
      courtType: "state",
      sections: vermontSections,
      courtSpecificRules: "Filed under V.R.Cr.P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Lynch, 2004 VT 4.",
    },
    {
      jurisdiction: "VT",
      courtType: "federal",
      district: "DVT",
      sections: vtFederalSections,
      courtSpecificRules: "DVT: 12pt font. Second Circuit. CM/ECF required.",
    },
    // Wyoming
    {
      jurisdiction: "WY",
      courtType: "state",
      sections: wyomingSections,
      courtSpecificRules: "Filed under W.R.Cr.P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Dean v. State, 2003 WY 128.",
    },
    {
      jurisdiction: "WY",
      courtType: "federal",
      district: "DWY",
      sections: wyFederalSections,
      courtSpecificRules: "DWY: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // Alaska
    {
      jurisdiction: "AK",
      courtType: "state",
      sections: alaskaSections,
      courtSpecificRules: "Filed under Alaska R. Crim. P. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Risher v. State, 523 P.2d 421 (Alaska 1974).",
    },
    {
      jurisdiction: "AK",
      courtType: "federal",
      district: "DAK",
      sections: akFederalSections,
      courtSpecificRules: "DAK: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Delaware
    {
      jurisdiction: "DE",
      courtType: "state",
      sections: delawareSections,
      courtSpecificRules: "Filed under Del. Super. Ct. Crim. R. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See State v. Wright, 67 A.3d 319 (Del. 2013).",
    },
    {
      jurisdiction: "DE",
      courtType: "federal",
      district: "DDE",
      sections: deFederalSections,
      courtSpecificRules: "DDE: 12pt font. Third Circuit. CM/ECF required.",
    },
    // District of Columbia
    {
      jurisdiction: "DC",
      courtType: "state",
      sections: districtofColumbiaSections,
      courtSpecificRules: "Filed under D.C. Super. Ct. Crim. R. 16. Brady v. Maryland, 373 U.S. 83 (1963) applies. See Brady v. Maryland, 373 U.S. 83 (1963) (originating from D.C. area).",
    },
    {
      jurisdiction: "DC",
      courtType: "federal",
      district: "DDC",
      sections: dcFederalSections,
      courtSpecificRules: "DDC: 12pt font. D.C. Circuit. CM/ECF required.",
    },
  ],
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS", "NM", "NE", "ID", "AK", "DE", "HI", "ME", "MT", "NH", "ND", "RI", "SD", "VT", "WV", "WY", "DC", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK", "DCT", "DUT", "NDIA", "SDIA", "DNV", "EDAR", "WDAR", "NDMS", "SDMS", "DKS", "DNM", "DNE", "DID", "DAK", "DDE", "DHI", "DME", "DMT", "DNH", "DND", "DRI", "DSD", "DVT", "NDWV", "SDWV", "DWY", "DDC"],
};
