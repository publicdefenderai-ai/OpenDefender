/**
 * Motion to Suppress Evidence Template
 *
 * Criminal law document template for requesting suppression of evidence
 * obtained in violation of constitutional rights (Fourth, Fifth, Sixth Amendments).
 * Includes jurisdiction-specific variants (CA, NY, TX) and federal court variants.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";
import {
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

const evidenceInputs: TemplateInput[] = [
  {
    id: "evidenceType",
    label: "Type of Evidence to Suppress",
    type: "select",
    required: true,
    helpText: "Select the primary category of evidence sought to be suppressed",
    validation: {
      options: [
        { value: "physical", label: "Physical Evidence (drugs, weapons, etc.)" },
        { value: "statements", label: "Defendant's Statements / Confessions" },
        { value: "identification", label: "Identification Evidence (lineup, show-up)" },
        { value: "electronic", label: "Electronic Evidence (phone, computer data)" },
        { value: "search_fruits", label: "Fruits of an Unlawful Search" },
        { value: "wiretap", label: "Wiretap / Electronic Surveillance" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "evidenceDescription",
    label: "Description of Evidence",
    type: "textarea",
    placeholder: "Describe the specific evidence to be suppressed...",
    required: true,
    helpText: "Provide a detailed description of the evidence you are moving to suppress",
    validation: {
      minLength: 50,
      maxLength: 2000,
    },
  },
  {
    id: "dateObtained",
    label: "Date Evidence Was Obtained",
    type: "date",
    required: true,
    helpText: "The date law enforcement obtained the evidence at issue",
  },
  {
    id: "locationObtained",
    label: "Location Where Evidence Was Obtained",
    type: "text",
    placeholder: "e.g., 123 Main St., Los Angeles, CA",
    required: true,
    helpText: "The address or location where the search, seizure, or questioning occurred",
  },
];

const constitutionalBasisInputs: TemplateInput[] = [
  {
    id: "constitutionalBasis",
    label: "Constitutional Basis for Suppression",
    type: "select",
    required: true,
    helpText: "Select the primary constitutional ground for the motion",
    validation: {
      options: [
        { value: "fourth_search", label: "Fourth Amendment - Unlawful Search" },
        { value: "fourth_seizure", label: "Fourth Amendment - Unlawful Seizure" },
        { value: "fourth_warrant", label: "Fourth Amendment - Defective Warrant" },
        { value: "fifth_miranda", label: "Fifth Amendment - Miranda Violation" },
        { value: "fifth_involuntary", label: "Fifth Amendment - Involuntary Statement" },
        { value: "sixth_counsel", label: "Sixth Amendment - Right to Counsel Violated" },
        { value: "sixth_identification", label: "Sixth Amendment - Suggestive Identification" },
        { value: "fourteenth_due_process", label: "Fourteenth Amendment - Due Process" },
      ],
    },
  },
  {
    id: "factualBasis",
    label: "Factual Basis",
    type: "textarea",
    placeholder: "Describe the facts supporting the constitutional violation...",
    required: true,
    helpText: "Provide the specific facts showing how the evidence was obtained in violation of constitutional rights",
    validation: {
      minLength: 100,
      maxLength: 3000,
    },
  },
  {
    id: "warrantIssued",
    label: "Was a Warrant Issued?",
    type: "select",
    required: true,
    helpText: "Was a search or arrest warrant issued in connection with the evidence?",
    validation: {
      options: [
        { value: "no_warrant", label: "No warrant was obtained" },
        { value: "warrant_defective", label: "Warrant was issued but defective" },
        { value: "warrant_exceeded", label: "Warrant was issued but officers exceeded its scope" },
        { value: "not_applicable", label: "Not applicable (statements/identification)" },
      ],
    },
  },
  {
    id: "mirandaGiven",
    label: "Were Miranda Warnings Given?",
    type: "select",
    required: false,
    helpText: "If challenging statements, were Miranda warnings administered?",
    validation: {
      options: [
        { value: "not_given", label: "Miranda warnings were not given" },
        { value: "given_late", label: "Miranda warnings were given after questioning began" },
        { value: "waiver_invalid", label: "Waiver of rights was not knowing/voluntary" },
        { value: "invoked_ignored", label: "Defendant invoked rights but questioning continued" },
        { value: "not_applicable", label: "Not applicable" },
      ],
    },
  },
  {
    id: "consentGiven",
    label: "Was Consent to Search Given?",
    type: "select",
    required: false,
    helpText: "Did the government claim consent was given?",
    validation: {
      options: [
        { value: "no_consent", label: "No consent was given" },
        { value: "consent_coerced", label: "Consent was coerced or involuntary" },
        { value: "consent_exceeded", label: "Search exceeded scope of consent" },
        { value: "not_applicable", label: "Not applicable" },
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
    id: "currentHearingTime",
    label: "Hearing Time",
    type: "text",
    placeholder: "e.g., 8:30 AM",
    required: false,
    helpText: "The time of the scheduled hearing",
  },
  {
    id: "hearingType",
    label: "Associated Hearing Type",
    type: "select",
    required: true,
    helpText: "The type of hearing at which the motion will be heard",
    validation: {
      options: [
        { value: "preliminary", label: "Preliminary Hearing" },
        { value: "pretrial", label: "Pre-Trial Conference" },
        { value: "motions", label: "Motions Hearing" },
        { value: "trial", label: "Trial" },
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
    id: "evidenceInfo",
    name: "Evidence Information",
    type: "user-input",
    order: 2,
    inputs: evidenceInputs,
    required: true,
    helpText: "Describe the evidence sought to be suppressed",
  },
  {
    id: "constitutionalBasis",
    name: "Constitutional Basis",
    type: "user-input",
    order: 3,
    inputs: constitutionalBasisInputs,
    required: true,
    helpText: "Identify the constitutional grounds for suppression",
  },
  {
    id: "hearingInfo",
    name: "Hearing Information",
    type: "user-input",
    order: 4,
    inputs: hearingInputs,
    required: true,
    helpText: "Provide hearing details",
  },
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative. Do not include legal citations or argument. Present facts chronologically.",
    helpText: "AI will generate a statement of facts based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence in a criminal matter.

Jurisdiction: {{jurisdiction}}
Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs that:
1. State the applicable legal standard for the exclusionary rule
2. Cite the constitutional amendment(s) at issue and the applicable legal framework
3. Apply the facts to the legal standard, showing why suppression is required
4. Address any potential government arguments (good faith, inevitable discovery, independent source)
5. Conclude with why the court should suppress the evidence

Use formal legal writing style with proper citations.`,
    aiInstructions: "Include relevant constitutional citations (e.g., Mapp v. Ohio, Miranda v. Arizona). Use proper legal citation format.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for suppression motions",
  },
  {
    id: "signatureBlock",
    name: "Signature Block",
    type: "user-input",
    order: 8,
    inputs: signatureInputs,
    required: true,
    helpText: "Enter your professional information for the signature block",
  },
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `PROOF OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

// ============================================================================
// California-Specific Sections
// ============================================================================

const californiaSections: TemplateSection[] = [
  // CA caption with CA counties, evidence info, constitutional basis, and hearing sections
  ...caBaseSections,

  // California-specific statement of facts
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Penal Code \u00A7 1538.5) in a California criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Note: Under California Penal Code \u00A7 1538.5, the defendant bears the initial burden when a warrant was obtained; the prosecution bears the burden when no warrant was involved.

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a California 1538.5 motion. Present facts chronologically.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  // California-specific legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under California Penal Code \u00A7 1538.5.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable California law includes:
- Cal. Penal Code \u00A7 1538.5: Motion to suppress evidence obtained as result of search or seizure
- Cal. Penal Code \u00A7 1538.5(a)(1): Motion may be made at preliminary hearing or special hearing
- Cal. Const. Art. I, \u00A7 13: Right against unreasonable searches and seizures
- People v. Williams (1999) 20 Cal.4th 119: Standard for evaluating searches
- In re Lance W. (1985) 37 Cal.3d 873: California's exclusionary rule tied to federal Fourth Amendment

Generate 3-5 paragraphs that:
1. Cite Cal. Penal Code \u00A7 1538.5 as the statutory basis
2. State the burden of proof (prosecution bears burden when warrantless; defendant when warrant existed)
3. Apply the specific constitutional violation to the facts
4. Cite relevant California case law
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper California legal citation format (e.g., "Cal. Penal Code \u00A7 1538.5").`,
    aiInstructions: "Must cite Cal. Penal Code \u00A7 1538.5 and relevant California case law. Use California citation format.",
    helpText: "AI will generate California-specific legal arguments",
  },

  // California prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to California Penal Code section 1538.5 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 13 of the California Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 15 and 24 of the California Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion pursuant to Penal Code section 1538.5(i);

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California-specific prayer for relief citing Penal Code",
  },

  // Signature block same as base
  baseSections[7],

  // California certificate of service
  {
    id: "certificateOfService",
    name: "Proof of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `PROOF OF SERVICE

STATE OF CALIFORNIA, COUNTY OF ____________________

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of California. My business address is _________________________.

On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (Penal Code \u00A7 1538.5) on all parties in this action by the following method:

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
// Federal Sections (all CA federal districts)
// ============================================================================

const federalSections: TemplateSection[] = [
  // CA caption with CA counties, evidence info, constitutional basis, and hearing sections
  ...caBaseSections,

  // Federal statement of facts
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Ninth Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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

  // NY statement of facts (CPL Article 710)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (CPL Article 710) in a New York criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under New York CPL \u00A7 710.20, a defendant may move to suppress:
(1) Evidence obtained by unlawful search or seizure
(2) Eavesdropping evidence unlawfully obtained
(3) Identification testimony tainted by suggestive procedures
(4) Statements involuntarily made or obtained in violation of constitutional rights
(5) Evidence obtained in violation of defendant's rights under N.Y. Const. Art. I, \u00A7 12

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for a New York CPL Article 710 motion. Present facts chronologically.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  // NY legal argument (CPL \u00A7 710.20)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under New York Criminal Procedure Law Article 710.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable New York law includes:
- CPL \u00A7 710.20: Grounds for suppression (search/seizure, eavesdropping, identification, statements)
- CPL \u00A7 710.60: Court's determination of motion; when hearing required
- CPL \u00A7 710.30: Notice requirements for prosecution's intended evidence
- N.Y. Const. Art. I, \u00A7 12: Protection against unreasonable searches and seizures
- People v. P.J. Video, 68 N.Y.2d 296 (1986): New York's independent interpretation of search and seizure (broader than federal Fourth Amendment)
- People v. Griminger, 71 N.Y.2d 635 (1988): Burden of proof on suppression motions
- People v. De Bour, 40 N.Y.2d 210 (1976): Four-tier framework for police encounters
- People v. Cantor, 36 N.Y.2d 106 (1975): Standing requirements

Generate 3-5 paragraphs that:
1. Cite CPL \u00A7 710.20 as the statutory basis and identify the specific subsection
2. State the burden of proof (People bear burden of showing legality for warrantless searches; presumption of unreasonableness)
3. Apply the specific constitutional violation to the facts using New York case law
4. Note that New York provides broader protections under N.Y. Const. Art. I, \u00A7 12 than the federal Fourth Amendment
5. Address any potential government arguments (consent, exigent circumstances, inevitable discovery)

Use proper New York legal citation format (e.g., "CPL \u00A7 710.20").`,
    aiInstructions: "Must cite CPL \u00A7 710.20 and relevant New York case law. Note New York's broader constitutional protections where applicable. Use New York citation format.",
    helpText: "AI will generate New York-specific legal arguments",
  },

  // NY prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to New York Criminal Procedure Law \u00A7 710.20 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 12 of the New York State Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 6 and 12 of the New York State Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion pursuant to CPL \u00A7 710.60;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing CPL Article 710",
  },

  // Signature block same as base
  baseSections[7],

  // NY certificate of service
  {
    id: "certificateOfService",
    name: "Affidavit of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `AFFIDAVIT OF SERVICE

STATE OF NEW YORK, COUNTY OF ____________________

I, the undersigned, being duly sworn, depose and say that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of New York.

On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (CPL \u00A7 710.20) upon all parties in this action by the following method:

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

  // Federal statement of facts
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of New York.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Second Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Second Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Second Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (NY)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  // TX statement of facts (Art. 38.23)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence under Texas Code of Criminal Procedure Article 38.23 in a Texas criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Texas Code of Criminal Procedure Article 38.23, Texas is one of few states with a statutory exclusionary rule independent of the federal Fourth Amendment. Article 38.23(a) provides that no evidence obtained in violation of any provision of the Constitution or laws of the State of Texas, or of the Constitution or laws of the United States, shall be admitted in evidence against the accused.

Key Texas cases:
- Carmouche v. State, 10 S.W.3d 323 (Tex. Crim. App. 2000): Standard for reviewing suppression motions
- State v. Ross, 32 S.W.3d 853 (Tex. Crim. App. 2000): Burden of proof framework

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for a Texas Art. 38.23 motion. Present facts chronologically.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  // TX legal argument (Art. 38.23)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Texas Code of Criminal Procedure Article 38.23.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 38.23(a): "No evidence obtained by an officer or other person in violation of any provisions of the Constitution or laws of the State of Texas, or of the Constitution or laws of the United States of America, shall be admitted in evidence against the accused on the trial of any criminal case."
- Tex. Const. Art. I, \u00A7 9: Protection against unreasonable searches and seizures
- Carmouche v. State, 10 S.W.3d 323 (Tex. Crim. App. 2000): Standard for reviewing suppression rulings; totality of circumstances test
- State v. Ross, 32 S.W.3d 853 (Tex. Crim. App. 2000): Burden of proof; if warrantless search, State bears burden of proving reasonableness
- Franks v. Delaware, 438 U.S. 154 (1978): Challenge to warrant affidavit veracity
- Art. 38.23(a) provides an independent statutory exclusionary rule broader than the federal exclusionary rule

Generate 3-5 paragraphs that:
1. Cite Tex. Code Crim. Proc. Art. 38.23(a) as the statutory basis — quote the key language
2. State the burden of proof (State bears burden when warrantless; totality of circumstances review)
3. Apply the specific constitutional violation to the facts using Texas case law
4. Note that Texas provides an independent statutory exclusionary rule under Art. 38.23, separate from the federal exclusionary rule
5. Address any potential government arguments (consent, exigent circumstances, good faith — note that Texas courts have been skeptical of the Leon good faith exception)

Use proper Texas legal citation format (e.g., "Tex. Code Crim. Proc. art. 38.23").`,
    aiInstructions: "Must cite Tex. Code Crim. Proc. Art. 38.23 and relevant Texas Court of Criminal Appeals case law. Note Texas's independent statutory exclusionary rule. Use Texas citation format.",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  // TX prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Texas Code of Criminal Procedure Article 38.23 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 9 of the Texas Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 10 and 19 of the Texas Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing Article 38.23",
  },

  // Signature block same as base
  baseSections[7],

  // TX certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF TEXAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (Tex. Code Crim. Proc. Art. 38.23) on all parties in this action by the following method:

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

  // Federal statement of facts (Fifth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Texas.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Fifth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Fifth Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Fifth Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Fifth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (TX)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  // FL statement of facts (Fla. R. Crim. P. 3.190(g)-(h))
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence under Florida Rule of Criminal Procedure 3.190(h) in a Florida criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Florida Rule of Criminal Procedure 3.190(h), a defendant may move to suppress evidence, including confessions and admissions obtained illegally. Florida Constitution Article I, Section 12 provides that the right against unreasonable searches and seizures shall be construed in conformity with the Fourth Amendment as interpreted by the United States Supreme Court.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for a Florida Fla. R. Crim. P. 3.190(h) motion. Present facts chronologically.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  // FL legal argument (Fla. R. Crim. P. 3.190(h))
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Florida Rule of Criminal Procedure 3.190(h).

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.190(g): Motions to suppress confessions and admissions
- Fla. R. Crim. P. 3.190(h): Motions to suppress evidence
- Fla. Const. Art. I, \u00A7 12: Right against unreasonable searches and seizures (construed in conformity with Fourth Amendment per amendment adopted in 1982)
- State v. Hume, 512 So. 2d 185 (Fla. 1987): Standard for reviewing suppression motions
- Connor v. State, 803 So. 2d 598 (Fla. 2001): Burden of proof on suppression motions
- Bernie v. State, 524 So. 2d 988 (Fla. 1988): Warrantless search standards
- \u00A7 933.18, Fla. Stat.: Grounds for issuance of search warrants

Generate 3-5 paragraphs that:
1. Cite Fla. R. Crim. P. 3.190(h) as the procedural basis for the motion
2. State the burden of proof (State bears burden of demonstrating legality of warrantless searches; defendant bears burden when challenging a warrant)
3. Apply the specific constitutional violation to the facts using Florida case law
4. Note that Fla. Const. Art. I, \u00A7 12 is construed in conformity with the Fourth Amendment
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Florida legal citation format (e.g., "Fla. R. Crim. P. 3.190(h)").`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.190(h) and relevant Florida case law. Note Florida's conformity clause under Art. I, \u00A7 12. Use Florida citation format.",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  // FL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Florida Rule of Criminal Procedure 3.190(h) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 12 of the Florida Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 9 and 16 of the Florida Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // FL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF FLORIDA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (Fla. R. Crim. P. 3.190(h)) on all parties in this action by the following method:

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

  // Federal statement of facts (Eleventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Florida.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Eleventh Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Eleventh Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Eleventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (FL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  // PA statement of facts (Pa.R.Crim.P. 581)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Pa.R.Crim.P. 581) in a Pennsylvania criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Pennsylvania Rule of Criminal Procedure 581, a defendant may file a motion to suppress evidence. Pennsylvania provides BROADER protections under PA Const. Art. I, \u00A7 8 than the federal Fourth Amendment.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania Pa.R.Crim.P. 581 motion. Present facts chronologically.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  // PA legal argument (Pa.R.Crim.P. 581)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Pennsylvania Rule of Criminal Procedure 581.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Pennsylvania law includes:
- Pa.R.Crim.P. 581: Motion to suppress evidence
- PA Const. Art. I, \u00A7 8: Protection against unreasonable searches and seizures (provides BROADER protections than the federal Fourth Amendment)
- Commonwealth v. Edmunds, 586 A.2d 887 (Pa. 1991): Independent state constitutional analysis under Art. I, \u00A7 8; four-factor test for state constitutional claims
- Commonwealth v. Gary, 91 A.3d 102 (Pa. 2014): Automobile exception under Pennsylvania law
- Commonwealth v. DeJohn, 403 A.2d 1283 (Pa. 1979): Broader privacy protections under state constitution

Generate 3-5 paragraphs that:
1. Cite Pa.R.Crim.P. 581 as the procedural basis for the motion
2. State the burden of proof and applicable standards under Pennsylvania law
3. Apply the specific constitutional violation to the facts using Pennsylvania case law
4. Emphasize that Pennsylvania provides BROADER protections under PA Const. Art. I, \u00A7 8 than the federal Fourth Amendment, citing Commonwealth v. Edmunds (1991) 586 A.2d 887 for independent state constitutional analysis
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Pennsylvania legal citation format (e.g., "Pa.R.Crim.P. 581").`,
    aiInstructions: "Must cite Pa.R.Crim.P. 581, PA Const. Art. I, \u00A7 8, and Commonwealth v. Edmunds. Note Pennsylvania's broader state constitutional protections. Use Pennsylvania citation format.",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  // PA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pennsylvania Rule of Criminal Procedure 581 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 8 of the Pennsylvania Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 8 and 9 of the Pennsylvania Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion pursuant to Pa.R.Crim.P. 581(D);

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing Pa.R.Crim.P. 581",
  },

  // Signature block same as base
  baseSections[7],

  // PA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF PENNSYLVANIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (Pa.R.Crim.P. 581) on all parties in this action by the following method:

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

  // Federal statement of facts (Third Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Pennsylvania.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Third Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Third Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Third Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Third Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (PA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  // IL statement of facts (725 ILCS 5/114-12)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (725 ILCS 5/114-12) in an Illinois criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under 725 ILCS 5/114-12, a defendant may file a motion to suppress evidence on the grounds that the evidence was obtained by an unlawful search or seizure. Illinois Constitution Article I, \u00A7 6 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for an Illinois 725 ILCS 5/114-12 motion. Present facts chronologically.",
    helpText: "AI will generate an Illinois-specific statement of facts",
  },

  // IL legal argument (725 ILCS 5/114-12)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under 725 ILCS 5/114-12.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Illinois law includes:
- 725 ILCS 5/114-12: Motion to suppress evidence obtained by unlawful search or seizure
- IL Const. Art. I, \u00A7 6: Protection against unreasonable searches, seizures, and invasions of privacy
- People v. Caballes, 221 Ill. 2d 282 (2006): Illinois constitutional analysis of search and seizure; independent state constitutional protections
- People v. Tisler, 103 Ill. 2d 226 (1984): Burden of proof on suppression motions
- People v. Krueger, 175 Ill. 2d 60 (1996): Standing and expectation of privacy under Illinois law

Generate 3-5 paragraphs that:
1. Cite 725 ILCS 5/114-12 as the statutory basis for the motion
2. State the burden of proof and applicable standards under Illinois law
3. Apply the specific constitutional violation to the facts using Illinois case law
4. Cite People v. Caballes (2006) for Illinois constitutional analysis under IL Const. Art. I, \u00A7 6
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Illinois legal citation format (e.g., "725 ILCS 5/114-12").`,
    aiInstructions: "Must cite 725 ILCS 5/114-12, IL Const. Art. I, \u00A7 6, and People v. Caballes. Use Illinois citation format.",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  // IL prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 725 ILCS 5/114-12 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 6 of the Illinois Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 6 and 10 of the Illinois Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing 725 ILCS 5/114-12",
  },

  // Signature block same as base
  baseSections[7],

  // IL certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ILLINOIS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (725 ILCS 5/114-12) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

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

  // Federal statement of facts (Seventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Illinois.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Seventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Seventh Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Seventh Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Seventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (IL)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const ohioSections: TemplateSection[] = [
  ...ohBaseSections,

  // OH statement of facts (Ohio Crim.R. 12(C)(3))
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Ohio Crim.R. 12(C)(3)) in an Ohio criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Ohio Criminal Rule 12(C)(3), a defendant may file a motion to suppress evidence. Ohio Constitution Article I, \u00A7 14 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for an Ohio Crim.R. 12(C)(3) motion. Present facts chronologically.",
    helpText: "AI will generate an Ohio-specific statement of facts",
  },

  // OH legal argument (Ohio Crim.R. 12(C)(3))
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Ohio Criminal Rule 12(C)(3).

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Ohio law includes:
- Ohio Crim.R. 12(C)(3): Pre-trial motion to suppress evidence
- OH Const. Art. I, \u00A7 14: Protection against unreasonable searches and seizures
- State v. Robinette, 80 Ohio St.3d 234 (1997): Ohio constitutional analysis of search and seizure; independent state constitutional protections
- State v. Andrews, 57 Ohio St.3d 86 (1991): Burden of proof on suppression motions
- Xenia v. Wallace, 37 Ohio St.3d 216 (1988): Warrantless search standards under Ohio law

Generate 3-5 paragraphs that:
1. Cite Ohio Crim.R. 12(C)(3) as the procedural basis for the motion
2. State the burden of proof and applicable standards under Ohio law
3. Apply the specific constitutional violation to the facts using Ohio case law
4. Cite State v. Robinette (1997) for Ohio constitutional analysis under OH Const. Art. I, \u00A7 14
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Ohio legal citation format (e.g., "Ohio Crim.R. 12(C)(3)").`,
    aiInstructions: "Must cite Ohio Crim.R. 12(C)(3), OH Const. Art. I, \u00A7 14, and State v. Robinette. Use Ohio citation format.",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  // OH prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio Criminal Rule 12(C)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 14 of the Ohio Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 10 and 14 of the Ohio Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing Ohio Criminal Rule 12(C)(3)",
  },

  // Signature block same as base
  baseSections[7],

  // OH certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF OHIO, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (Ohio Crim.R. 12(C)(3)) on all parties in this action by the following method:

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
// Ohio Federal Sections
// ============================================================================

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  // Federal statement of facts (Sixth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Ohio.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Sixth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Sixth Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Sixth Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Sixth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (OH)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const georgiaSections: TemplateSection[] = [
  ...gaBaseSections,

  // GA statement of facts (O.C.G.A. \u00A7 17-5-30)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (O.C.G.A. \u00A7 17-5-30) in a Georgia criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under O.C.G.A. \u00A7 17-5-30, a defendant may move to suppress evidence obtained as a result of an unlawful search or seizure. Georgia Constitution Article I, Section I, Paragraph XIII provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument \u2014 only facts.`,
    aiInstructions: "Generate a factual narrative for a Georgia O.C.G.A. \u00A7 17-5-30 motion. Present facts chronologically.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  // GA legal argument (O.C.G.A. \u00A7 17-5-30)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under O.C.G.A. \u00A7 17-5-30.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Georgia law includes:
- O.C.G.A. \u00A7 17-5-30: Motion to suppress evidence obtained as result of search and seizure
- GA Const. Art. I, \u00A7 I, Para. XIII: Protection against unreasonable searches and seizures
- Gary v. State, 262 Ga. 573 (1992): Georgia constitutional analysis of search and seizure
- State v. Slaughter, 252 Ga. 435 (1984): Burden of proof on suppression motions
- O.C.G.A. \u00A7 17-5-30(b): Motion must be filed within 10 days after arraignment or at a later time as the court may allow

Generate 3-5 paragraphs that:
1. Cite O.C.G.A. \u00A7 17-5-30 as the statutory basis for the motion
2. State the burden of proof and applicable standards under Georgia law
3. Apply the specific constitutional violation to the facts using Georgia case law
4. Cite Gary v. State for Georgia constitutional analysis under GA Const. Art. I, \u00A7 I, Para. XIII
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Georgia legal citation format (e.g., "O.C.G.A. \u00A7 17-5-30").`,
    aiInstructions: "Must cite O.C.G.A. \u00A7 17-5-30, GA Const. Art. I, \u00A7 I, Para. XIII, and Gary v. State. Use Georgia citation format.",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  // GA prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. \u00A7 17-5-30 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section I, Paragraph XIII of the Georgia Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Section I, Paragraph XIV of the Georgia Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing O.C.G.A. \u00A7 17-5-30",
  },

  // Signature block same as base
  baseSections[7],

  // GA certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF GEORGIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (O.C.G.A. \u00A7 17-5-30) on all parties in this action by the following method:

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
// Georgia Federal Sections
// ============================================================================

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  // Federal statement of facts (Eleventh Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Georgia.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Eleventh Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Eleventh Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Eleventh Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Eleventh Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (GA)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const northCarolinaSections: TemplateSection[] = [
  ...ncBaseSections,

  // NC statement of facts (N.C. Gen. Stat. § 15A-974)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (N.C. Gen. Stat. § 15A-974) in a North Carolina criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under N.C. Gen. Stat. § 15A-974, a defendant may move to suppress evidence obtained as a result of a substantial violation of the provisions of Chapter 15A. NC Const. Art. I, § 20 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a North Carolina N.C. Gen. Stat. § 15A-974 motion. Present facts chronologically.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  // NC legal argument (N.C. Gen. Stat. § 15A-974)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under N.C. Gen. Stat. § 15A-974.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable North Carolina law includes:
- N.C. Gen. Stat. § 15A-974: Exclusion or suppression of unlawfully obtained evidence
- NC Const. Art. I, § 20: Protection against unreasonable searches and seizures
- State v. Carter, 322 N.C. 709 (1988): North Carolina constitutional analysis of search and seizure
- State v. Cooke, 306 N.C. 132 (1982): Burden of proof on suppression motions
- N.C. Gen. Stat. § 15A-974(a)(2): Evidence must be suppressed if obtained as result of substantial violation

Generate 3-5 paragraphs that:
1. Cite N.C. Gen. Stat. § 15A-974 as the statutory basis for the motion
2. State the burden of proof and applicable standards under North Carolina law
3. Apply the specific constitutional violation to the facts using North Carolina case law
4. Cite NC Const. Art. I, § 20 for North Carolina constitutional analysis
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper North Carolina legal citation format (e.g., "N.C. Gen. Stat. § 15A-974").`,
    aiInstructions: "Must cite N.C. Gen. Stat. § 15A-974, NC Const. Art. I, § 20, and State v. Carter. Use North Carolina citation format.",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  // NC prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C. Gen. Stat. § 15A-974 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 20 of the North Carolina Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 19 and 23 of the North Carolina Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Dismiss or reduce the charges if suppression of the evidence renders the prosecution's case insufficient;

6. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief citing N.C. Gen. Stat. § 15A-974",
  },

  // Signature block same as base
  baseSections[7],

  // NC certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NORTH CAROLINA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (N.C. Gen. Stat. § 15A-974) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

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

  // Federal statement of facts (Fourth Circuit)
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of North Carolina.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial. The motion must state the grounds for suppression with particularity.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  // Federal legal argument (Fourth Circuit)
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule applies to states
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Miranda v. Arizona, 384 U.S. 436 (1966): Fifth Amendment warnings
- Katz v. United States, 389 U.S. 347 (1967): Reasonable expectation of privacy
- Fourth Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Fourth Circuit precedent
5. Address potential government arguments (good faith, inevitable discovery, independent source)

Use proper federal legal citation format (e.g., "Mapp v. Ohio, 367 U.S. 643, 655 (1961)").`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Fourth Circuit precedent. Use federal citation format.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  // Federal prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine established in Wong Sun v. United States, 371 U.S. 471 (1963);

4. Grant an evidentiary hearing on this motion pursuant to Franks v. Delaware, 438 U.S. 154 (1978), if applicable;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  // Signature block same as base
  baseSections[7],

  // Federal certificate of service (NC)
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

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
// Michigan Sections
// ============================================================================

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
  baseSections[1], // evidenceInfo
  baseSections[2], // constitutionalBasis
  baseSections[3], // hearingInfo
];

const michiganSections: TemplateSection[] = [
  ...miBaseSections,

  // MI statement of facts (MCR 6.101(C))
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (MCR 6.101(C)) in a Michigan criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under MCR 6.101(C), a defendant may move to suppress evidence obtained as a result of an unlawful search or seizure. MI Const. Art. I, § 11 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Michigan MCR 6.101(C) motion. Present facts chronologically.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  // MI legal argument (MCR 6.101(C))
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under MCR 6.101(C).

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Michigan law includes:
- MCR 6.101(C): Motions to suppress evidence
- MI Const. Art. I, § 11: Protection against unreasonable searches and seizures
- People v. Kazmierczak, 461 Mich. 411 (2000): Michigan constitutional analysis
- People v. Dagwan, 269 Mich. App. 338 (2005): Burden of proof on suppression motions
- MCL 780.653: Search warrant requirements

Generate 3-5 paragraphs that:
1. Cite MCR 6.101(C) as the procedural basis for the motion
2. State the burden of proof and applicable standards under Michigan law
3. Apply the specific constitutional violation to the facts using Michigan case law
4. Cite MI Const. Art. I, § 11 for Michigan constitutional analysis
5. Address any potential government arguments (consent, exigent circumstances, good faith)

Use proper Michigan legal citation format (e.g., "MCR 6.101(C)").`,
    aiInstructions: "Must cite MCR 6.101(C), MI Const. Art. I, § 11, and People v. Kazmierczak. Use Michigan citation format.",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  // MI prayer for relief
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCR 6.101(C) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 11 of the Michigan Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Sections 17 and 20 of the Michigan Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief citing MCR 6.101(C)",
  },

  // Signature block same as base
  baseSections[7],

  // MI certificate of service
  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MICHIGAN, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (MCR 6.101(C)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via the Court's e-filing system to the email address(es) of record.

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

// Michigan Federal Sections
const miFederalSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Michigan.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence under the Fourth, Fifth, and/or Sixth Amendments.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3): Pre-trial motions to suppress
- Mapp v. Ohio, 367 U.S. 643 (1961): Exclusionary rule
- Wong Sun v. United States, 371 U.S. 471 (1963): Fruit of the poisonous tree
- United States v. Leon, 468 U.S. 897 (1984): Good faith exception
- Sixth Circuit precedent on suppression motions

Generate 3-5 paragraphs that:
1. Cite Federal Rule of Criminal Procedure 12(b)(3) as the procedural basis
2. State the applicable constitutional standard and burden of proof
3. Apply the facts to the legal standard, showing why suppression is required
4. Cite controlling Supreme Court and Sixth Circuit precedent
5. Address potential government arguments

Use proper federal legal citation format.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and controlling Supreme Court and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments with proper citations",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

[ ] CM/ECF electronic filing and service
[ ] U.S. Mail, first class, postage prepaid
[ ] Personal service

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
// New Jersey Sections
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
];

const newJerseySections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (N.J. Ct. R. 3:5-7) in a New Jersey criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under N.J. Ct. R. 3:5-7, a defendant may move to suppress evidence. NJ Const. Art. I, § 7 provides broader protections than the federal Fourth Amendment.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense.`,
    aiInstructions: "Generate a factual narrative for a New Jersey N.J. Ct. R. 3:5-7 motion. Present facts chronologically.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under N.J. Ct. R. 3:5-7.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable New Jersey law includes:
- N.J. Ct. R. 3:5-7: Motions to suppress evidence
- NJ Const. Art. I, § 7: Protection against unreasonable searches (broader than federal)
- State v. Hunt, 91 N.J. 338 (1982): New Jersey constitutional analysis
- State v. Novembrino, 105 N.J. 95 (1987): No good faith exception under NJ Constitution
- N.J.S.A. 2A:84A-21: Exclusionary rule

Generate 3-5 paragraphs that:
1. Cite N.J. Ct. R. 3:5-7 as the procedural basis for the motion
2. State the burden of proof and applicable standards under New Jersey law
3. Apply the specific constitutional violation using New Jersey case law
4. Cite NJ Const. Art. I, § 7 for New Jersey constitutional analysis
5. Note that New Jersey does not recognize the good faith exception

Use proper New Jersey legal citation format.`,
    aiInstructions: "Must cite N.J. Ct. R. 3:5-7, NJ Const. Art. I, § 7, and State v. Novembrino. Use New Jersey citation format.",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J. Ct. R. 3:5-7 to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Paragraph 7 of the New Jersey Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein, obtained in violation of the Fifth and Sixth Amendments to the United States Constitution and Article I, Paragraphs 1 and 10 of the New Jersey Constitution;

3. Suppress and exclude any evidence derived from or obtained as a result of the illegally obtained evidence described herein, pursuant to the fruit of the poisonous tree doctrine;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief citing N.J. Ct. R. 3:5-7",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF NEW JERSEY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE (N.J. Ct. R. 3:5-7) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ECOURTS: By transmitting a true copy via the eCourts system.

STATE OF NEW JERSEY
c/o County Prosecutor
________________________________
________________________________
________________________________

I certify that the foregoing statements made by me are true. I am aware that if any of the foregoing statements made by me are willfully false, I am subject to punishment.

Dated: __________________, 20___


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
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of New Jersey.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers and agencies involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)
- Mapp v. Ohio, 367 U.S. 643 (1961)
- Wong Sun v. United States, 371 U.S. 471 (1963)
- United States v. Leon, 468 U.S. 897 (1984)
- Third Circuit precedent on suppression motions

Generate 3-5 paragraphs applying federal constitutional standards with Third Circuit precedent.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to:

1. Suppress and exclude from evidence all items seized as described herein;

2. Suppress and exclude any and all statements made by the Defendant as described herein;

3. Suppress and exclude any evidence derived from the illegally obtained evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties via CM/ECF electronic filing.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Virginia Sections
// ============================================================================

const vaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County/City]" }
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
];

const virginiaSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Va. Code § 19.2-60) in a Virginia criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Va. Code § 19.2-60, a defendant may challenge evidence obtained in violation of constitutional rights. VA Const. Art. I, § 10 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs that:
1. Set forth the factual circumstances of the search, seizure, or questioning in chronological order
2. Identify the law enforcement officers involved (using generic references)
3. Describe the specific actions that constitute the constitutional violation
4. State what evidence was obtained as a result

Use formal legal writing style.`,
    aiInstructions: "Generate a factual narrative for a Virginia Va. Code § 19.2-60 motion.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Virginia law.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Virginia law includes:
- Va. Code § 19.2-60: Search warrants
- VA Const. Art. I, § 10: Protection against unreasonable searches
- Lowe v. Commonwealth, 218 Va. 670 (1977): Virginia constitutional analysis
- McCain v. Commonwealth, 261 Va. 483 (2001): Suppression standards

Generate 3-5 paragraphs that:
1. State the applicable constitutional and statutory standards
2. Apply the specific constitutional violation to the facts
3. Cite VA Const. Art. I, § 10 for Virginia constitutional analysis
4. Address any potential government arguments

Use proper Virginia legal citation format.`,
    aiInstructions: "Must cite Va. Code § 19.2-60 and VA Const. Art. I, § 10.",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court to:

1. Suppress and exclude from evidence all items seized as described herein, as fruits of an unlawful search and/or seizure in violation of the Fourth Amendment to the United States Constitution and Article I, Section 10 of the Virginia Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein;

3. Suppress and exclude any evidence derived from the illegally obtained evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Virginia prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I, the undersigned, certify that on the date below, I served a copy of the foregoing MOTION TO SUPPRESS EVIDENCE on all parties in this action by the following method:

[ ] BY MAIL
[ ] BY PERSONAL SERVICE
[ ] BY ELECTRONIC SERVICE

COMMONWEALTH OF VIRGINIA
c/o Commonwealth's Attorney
________________________________
________________________________

Executed on __________________, 20___.


____________________________
[Declarant's Signature]`,
    helpText: "Virginia-specific certificate of service format",
  },
];

const vaFederalSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Virginia.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Federal Rule of Criminal Procedure 12(b)(3), a defendant may move to suppress evidence before trial.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable federal law includes Fourth Circuit precedent on suppression motions.

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Washington Sections
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
];

const washingtonSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (CrR 3.6) in a Washington criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under CrR 3.6, a defendant may move to suppress evidence. WA Const. Art. I, § 7 provides broader protections than the federal Fourth Amendment.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Washington CrR 3.6 motion.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under CrR 3.6.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Washington law includes:
- CrR 3.6: Suppression hearing
- WA Const. Art. I, § 7: Private affairs clause (broader than federal)
- State v. Gunwall, 106 Wn.2d 54 (1986): Independent state constitutional analysis
- State v. Ferrier, 136 Wn.2d 103 (1998): Knock and talk doctrine

Generate 3-5 paragraphs emphasizing Washington's broader privacy protections under Article I, Section 7.`,
    aiInstructions: "Must cite CrR 3.6, WA Const. Art. I, § 7, and State v. Gunwall.",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CrR 3.6 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 7 of the Washington Constitution;

2. Suppress and exclude any and all statements made by the Defendant as described herein;

3. Suppress and exclude any evidence derived from the illegally obtained evidence;

4. Grant a CrR 3.6 hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Washington prayer for relief citing CrR 3.6",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I caused to be served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WASHINGTON
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Washington-specific certificate of service format",
  },
];

const waFederalSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Washington.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Ninth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arizona Sections
// ============================================================================

const azCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of Arizona, [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR YYYY-XXXXXX" }
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
];

const arizonaSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Ariz. R. Crim. P. 16) in an Arizona criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Ariz. R. Crim. P. 16, a defendant may move to suppress evidence. AZ Const. Art. II, § 8 provides protections against unreasonable searches.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Arizona Ariz. R. Crim. P. 16 motion.",
    helpText: "AI will generate an Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Ariz. R. Crim. P. 16.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Arizona law includes:
- Ariz. R. Crim. P. 16: Discovery; disclosure
- AZ Const. Art. II, § 8: Right to privacy
- State v. Ault, 150 Ariz. 459 (1986): Arizona constitutional analysis
- A.R.S. § 13-3925: Search warrant requirements

Generate 3-5 paragraphs applying Arizona constitutional standards.`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 16 and AZ Const. Art. II, § 8.",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ariz. R. Crim. P. 16 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article II, Section 8 of the Arizona Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Arizona prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ARIZONA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Arizona-specific certificate of service format",
  },
];

const azFederalSections: TemplateSection[] = [
  ...azBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Arizona.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Ninth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Massachusetts Sections
// ============================================================================

const maCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX CR XXXXX" }
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
];

const massachusettsSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Mass. R. Crim. P. 13) in a Massachusetts criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Mass. R. Crim. P. 13, a defendant may move to suppress evidence. MA Const. Part I, Art. XIV provides broader protections than the federal Fourth Amendment.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts Mass. R. Crim. P. 13 motion.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Mass. R. Crim. P. 13.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 13: Pre-trial motions
- MA Const. Part I, Art. XIV: Protection against unreasonable searches
- Commonwealth v. Upton, 394 Mass. 363 (1985): Massachusetts rejects Gates totality test
- Commonwealth v. Blood, 400 Mass. 61 (1987): Massachusetts search and seizure law

Generate 3-5 paragraphs emphasizing Massachusetts' broader privacy protections.`,
    aiInstructions: "Must cite Mass. R. Crim. P. 13 and MA Const. Part I, Art. XIV.",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. R. Crim. P. 13 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article XIV of the Massachusetts Declaration of Rights;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Massachusetts prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

COMMONWEALTH OF MASSACHUSETTS
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Massachusetts-specific certificate of service format",
  },
];

const maFederalSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Massachusetts.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with First Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Tennessee Sections
// ============================================================================

const tnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Criminal Court of [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., YYYY-CR-XXXX" }
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
];

const tennesseeSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Tenn. R. Crim. P. 12) in a Tennessee criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Tenn. R. Crim. P. 12, a defendant may move to suppress evidence. TN Const. Art. I, § 7 provides protections against unreasonable searches.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Tennessee Tenn. R. Crim. P. 12 motion.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Tenn. R. Crim. P. 12.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 12: Pleadings and motions before trial
- TN Const. Art. I, § 7: Protection against unreasonable searches
- State v. Downey, 945 S.W.2d 102 (Tenn. 1997): Tennessee constitutional analysis
- T.C.A. § 40-6-103: Search warrant requirements

Generate 3-5 paragraphs applying Tennessee constitutional standards.`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 12 and TN Const. Art. I, § 7.",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Crim. P. 12 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 7 of the Tennessee Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Tennessee prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF TENNESSEE
c/o District Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Tennessee-specific certificate of service format",
  },
];

const tnFederalSections: TemplateSection[] = [
  ...tnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Tennessee.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Sixth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Indiana Sections
// ============================================================================

const inCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Superior/Circuit Court" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XXXX-F-XXXX" }
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
];

const indianaSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Ind. R. Crim. P. 12) in an Indiana criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Ind. R. Crim. P. 12, a defendant may move to suppress evidence. IN Const. Art. I, § 11 provides protections against unreasonable searches, and Indiana uses the Litchfield reasonableness test.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Indiana Ind. R. Crim. P. 12 motion.",
    helpText: "AI will generate an Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Ind. R. Crim. P. 12.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Indiana law includes:
- Ind. R. Crim. P. 12: Pleadings and motions before trial
- IN Const. Art. I, § 11: Protection against unreasonable searches
- Litchfield v. State, 824 N.E.2d 356 (Ind. 2005): Indiana's reasonableness test
- IC 35-33-5: Search warrant requirements

Generate 3-5 paragraphs applying the Litchfield reasonableness analysis.`,
    aiInstructions: "Must cite Ind. R. Crim. P. 12, IN Const. Art. I, § 11, and Litchfield v. State.",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ind. R. Crim. P. 12 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 11 of the Indiana Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Indiana prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF INDIANA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Indiana-specific certificate of service format",
  },
];

const inFederalSections: TemplateSection[] = [
  ...inBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Indiana.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Seventh Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maryland Sections
// ============================================================================

const mdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court for [County]" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXXXXX" }
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
];

const marylandSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Md. Rule 4-252) in a Maryland criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Md. Rule 4-252, a defendant may file a motion to suppress evidence. MD Const. Decl. of Rights, Art. 26 provides protections against unreasonable searches.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Maryland Md. Rule 4-252 motion.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Md. Rule 4-252.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Maryland law includes:
- Md. Rule 4-252: Motions in circuit court
- MD Const. Decl. of Rights, Art. 26: Protection against unreasonable searches
- Dashiell v. State, 374 Md. 85 (2003): Maryland constitutional analysis
- Md. Code, Crim. Proc. § 1-203: Exclusionary rule

Generate 3-5 paragraphs applying Maryland constitutional standards.`,
    aiInstructions: "Must cite Md. Rule 4-252 and MD Const. Decl. of Rights, Art. 26.",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 4-252 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article 26 of the Maryland Declaration of Rights;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Maryland prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By MDEC electronic filing
[ ] By mail
[ ] By personal service

STATE OF MARYLAND
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Maryland-specific certificate of service format",
  },
];

const mdFederalSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Maryland.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Fourth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Missouri Sections
// ============================================================================

// MO-specific caption inputs
const moCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County], Missouri" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
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
];

const missouriSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (RSMo § 542.296) in a Missouri criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under RSMo § 542.296, a defendant may move to suppress evidence obtained in violation of constitutional rights. Mo. Const. Art. I, § 15 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Missouri RSMo § 542.296 motion.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under RSMo § 542.296.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Missouri law includes:
- RSMo § 542.296: Motion to suppress evidence
- Mo. Const. Art. I, § 15: Protection against unreasonable searches and seizures
- State v. Milliorn, 794 S.W.2d 181 (Mo. 1990): Missouri constitutional analysis
- Missouri Supreme Court Rules 24.04, 24.05: Pretrial motions

Generate 3-5 paragraphs applying Missouri constitutional standards.`,
    aiInstructions: "Must cite RSMo § 542.296 and Mo. Const. Art. I, § 15.",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to RSMo § 542.296 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 15 of the Missouri Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "Missouri-specific certificate of service format",
  },
];

const moFederalSections: TemplateSection[] = [
  ...moBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Missouri.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Eighth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wisconsin Sections
// ============================================================================

// WI-specific caption inputs
const wiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [County] County, Wisconsin" }
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
];

const wisconsinSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Wis. Stat. § 971.31) in a Wisconsin criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Wis. Stat. § 971.31, a defendant may move to suppress evidence obtained in violation of constitutional rights. Wis. Const. Art. I, § 11 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin Wis. Stat. § 971.31 motion.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Wis. Stat. § 971.31.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Wisconsin law includes:
- Wis. Stat. § 971.31: Motions before trial
- Wis. Const. Art. I, § 11: Protection against unreasonable searches and seizures
- State v. Knapp, 2005 WI 127: Wisconsin constitutional analysis
- State v. Felix, 2012 WI 36: Burden of proof on suppression motions

Generate 3-5 paragraphs applying Wisconsin constitutional standards.`,
    aiInstructions: "Must cite Wis. Stat. § 971.31 and Wis. Const. Art. I, § 11.",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 971.31 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 11 of the Wisconsin Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WISCONSIN
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Wisconsin-specific certificate of service format",
  },
];

const wiFederalSections: TemplateSection[] = [
  ...wiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Wisconsin.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Seventh Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Colorado Sections
// ============================================================================

// CO-specific caption inputs
const coCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Colorado" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX CR XXXXX" }
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
];

const coloradoSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (C.R.S. § 16-3-308) in a Colorado criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under C.R.S. § 16-3-308, a defendant may move to suppress evidence obtained in violation of constitutional rights. Colo. Const. Art. II, § 7 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Colorado C.R.S. § 16-3-308 motion.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under C.R.S. § 16-3-308.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Colorado law includes:
- C.R.S. § 16-3-308: Motion to suppress evidence
- Colo. Const. Art. II, § 7: Protection against unreasonable searches and seizures
- People v. Oates, 698 P.2d 811 (Colo. 1985): Colorado constitutional analysis
- Colo. R. Crim. P. 41(g): Motion to suppress

Generate 3-5 paragraphs applying Colorado constitutional standards.`,
    aiInstructions: "Must cite C.R.S. § 16-3-308 and Colo. Const. Art. II, § 7.",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to C.R.S. § 16-3-308 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article II, Section 7 of the Colorado Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By Colorado Courts E-Filing
[ ] By mail
[ ] By personal service

STATE OF COLORADO
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Colorado-specific certificate of service format",
  },
];

const coFederalSections: TemplateSection[] = [
  ...coBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Colorado.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Tenth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Minnesota Sections
// ============================================================================

// MN-specific caption inputs
const mnCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Minnesota" }
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
];

const minnesotaSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Minn. R. Crim. P. 8.03) in a Minnesota criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Minn. R. Crim. P. 8.03, a defendant may move to suppress evidence obtained in violation of constitutional rights. Minn. Const. Art. I, § 10 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Minnesota Minn. R. Crim. P. 8.03 motion.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Minn. R. Crim. P. 8.03.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 8.03: Omnibus hearing and motions
- Minn. Const. Art. I, § 10: Protection against unreasonable searches and seizures
- State v. Askerooth, 681 N.W.2d 353 (Minn. 2004): Minnesota constitutional analysis
- State v. Carter, 596 N.W.2d 654 (Minn. 1999): Search and seizure standards

Generate 3-5 paragraphs applying Minnesota constitutional standards.`,
    aiInstructions: "Must cite Minn. R. Crim. P. 8.03 and Minn. Const. Art. I, § 10.",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Crim. P. 8.03 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 10 of the Minnesota Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "Minnesota-specific certificate of service format",
  },
];

const mnFederalSections: TemplateSection[] = [
  ...mnBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Minnesota.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Eighth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Carolina Sections
// ============================================================================

// SC-specific caption inputs
const scCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of General Sessions, [County] County" }
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
];

const southCarolinaSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (S.C. R. Crim. P. 5) in a South Carolina criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under S.C. R. Crim. P. 5, a defendant may move to suppress evidence obtained in violation of constitutional rights. S.C. Const. Art. I, § 10 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a South Carolina S.C. R. Crim. P. 5 motion.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under S.C. R. Crim. P. 5.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable South Carolina law includes:
- S.C. R. Crim. P. 5: Pretrial motions
- S.C. Const. Art. I, § 10: Protection against unreasonable searches and seizures
- State v. Forrester, 541 S.E.2d 837 (S.C. 2001): South Carolina constitutional analysis
- State v. Robinson, 535 S.E.2d 127 (S.C. Ct. App. 2000): Search and seizure standards

Generate 3-5 paragraphs applying South Carolina constitutional standards.`,
    aiInstructions: "Must cite S.C. R. Crim. P. 5 and S.C. Const. Art. I, § 10.",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C. R. Crim. P. 5 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 10 of the South Carolina Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "South Carolina-specific certificate of service format",
  },
];

const scFederalSections: TemplateSection[] = [
  ...scBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of South Carolina.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Fourth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alabama Sections
// ============================================================================

// AL-specific caption inputs
const alCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Alabama" }
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
];

const alabamaSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (Ala. R. Crim. P. 15.4) in an Alabama criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under Ala. R. Crim. P. 15.4, a defendant may move to suppress evidence obtained in violation of constitutional rights. Ala. Const. Art. I, § 5 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Alabama Ala. R. Crim. P. 15.4 motion.",
    helpText: "AI will generate an Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under Ala. R. Crim. P. 15.4.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 15.4: Motion to suppress evidence
- Ala. Const. Art. I, § 5: Protection against unreasonable searches and seizures
- Ex parte Tucker, 667 So. 2d 1339 (Ala. 1995): Alabama constitutional analysis
- State v. Hargett, 935 So. 2d 1200 (Ala. Crim. App. 2005): Search and seizure standards

Generate 3-5 paragraphs applying Alabama constitutional standards.`,
    aiInstructions: "Must cite Ala. R. Crim. P. 15.4 and Ala. Const. Art. I, § 5.",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Crim. P. 15.4 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 5 of the Alabama Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "Alabama-specific certificate of service format",
  },
];

const alFederalSections: TemplateSection[] = [
  ...alBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Alabama.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Eleventh Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Louisiana Sections
// ============================================================================

// LA-specific caption inputs (uses parishes, not counties)
const laCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [Judicial District] District Court, Parish of [Parish]" }
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
  baseSections[3],
];

const louisianaSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (La. C.Cr.P. art. 703) in a Louisiana criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under La. C.Cr.P. art. 703, a defendant may move to suppress evidence obtained in violation of constitutional rights. La. Const. Art. I, § 5 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Louisiana La. C.Cr.P. art. 703 motion.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under La. C.Cr.P. art. 703.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Louisiana law includes:
- La. C.Cr.P. art. 703: Motion to suppress
- La. Const. Art. I, § 5: Protection against unreasonable searches and seizures
- State v. Perry, 610 So. 2d 746 (La. 1992): Louisiana constitutional analysis
- State v. Thompson, 899 So. 2d 1 (La. 2005): Search and seizure standards

Generate 3-5 paragraphs applying Louisiana constitutional standards.`,
    aiInstructions: "Must cite La. C.Cr.P. art. 703 and La. Const. Art. I, § 5.",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. C.Cr.P. art. 703 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article I, Section 5 of the Louisiana Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "Louisiana-specific certificate of service format",
  },
];

const laFederalSections: TemplateSection[] = [
  ...laBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Louisiana.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Fifth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kentucky Sections
// ============================================================================

// KY-specific caption inputs
const kyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., [County] Circuit Court" }
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
];

const kentuckySections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (RCr 8.22) in a Kentucky criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under RCr 8.22, a defendant may move to suppress evidence obtained in violation of constitutional rights. Ky. Const. § 10 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a Kentucky RCr 8.22 motion.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under RCr 8.22.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Kentucky law includes:
- RCr 8.22: Motion to suppress evidence
- Ky. Const. § 10: Protection against unreasonable searches and seizures
- Commonwealth v. Hatcher, 199 S.W.3d 124 (Ky. 2006): Kentucky constitutional analysis
- LaFollette v. Commonwealth, 915 S.W.2d 747 (Ky. 1996): Search and seizure standards

Generate 3-5 paragraphs applying Kentucky constitutional standards.`,
    aiInstructions: "Must cite RCr 8.22 and Ky. Const. § 10.",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to RCr 8.22 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Section 10 of the Kentucky Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
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
    helpText: "Kentucky-specific certificate of service format",
  },
];

const kyFederalSections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Kentucky.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Sixth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oregon Sections
// ============================================================================

// OR-specific caption inputs
const orCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the State of Oregon for [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXCRXXXXX" }
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
];

const oregonSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (ORS 133.673) in an Oregon criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under ORS 133.673, a defendant may move to suppress evidence obtained in violation of constitutional rights. Or. Const. Art. I, § 9 provides broader protections than the federal Fourth Amendment.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Oregon ORS 133.673 motion.",
    helpText: "AI will generate an Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under ORS 133.673.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Oregon law includes:
- ORS 133.673: Motion to suppress evidence
- Or. Const. Art. I, § 9: Protections against unreasonable searches (BROADER than federal Fourth Amendment)
- State v. Campbell, 306 Or. 157 (1988): Oregon constitutional analysis - Article I, section 9 provides greater protection
- State v. Caraher, 293 Or. 741 (1982): Oregon search and seizure standards

IMPORTANT: Oregon Article I, Section 9 provides broader protections than the federal Fourth Amendment. Focus on Oregon constitutional analysis.

Generate 3-5 paragraphs applying Oregon constitutional standards.`,
    aiInstructions: "Must cite ORS 133.673 and Or. Const. Art. I, § 9. Emphasize Oregon's broader protections.",
    helpText: "AI will generate Oregon-specific legal arguments with broader state constitutional protections",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ORS 133.673 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of Article I, Section 9 of the Oregon Constitution and the Fourth Amendment to the United States Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief emphasizing Article I, Section 9",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By Oregon eCourt electronic filing
[ ] By mail
[ ] By personal service

STATE OF OREGON
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Oregon-specific certificate of service format",
  },
];

const orFederalSections: TemplateSection[] = [
  ...orBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Oregon.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Ninth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oklahoma Sections
// ============================================================================

// OK-specific caption inputs
const okCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, State of Oklahoma" }
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
];

const oklahomaSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence (22 O.S. § 1289.24) in an Oklahoma criminal matter.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Under 22 O.S. § 1289.24, a defendant may move to suppress evidence obtained in violation of constitutional rights. Okla. Const. Art. II, § 30 provides protections against unreasonable searches and seizures.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for an Oklahoma 22 O.S. § 1289.24 motion.",
    helpText: "AI will generate an Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to suppress evidence under 22 O.S. § 1289.24.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Applicable Oklahoma law includes:
- 22 O.S. § 1289.24: Motion to suppress evidence
- Okla. Const. Art. II, § 30: Protection against unreasonable searches and seizures
- Sittingdown v. State, 1985 OK CR 75: Oklahoma constitutional analysis
- McCarty v. State, 1988 OK CR 271: Search and seizure standards

Generate 3-5 paragraphs applying Oklahoma constitutional standards.`,
    aiInstructions: "Must cite 22 O.S. § 1289.24 and Okla. Const. Art. II, § 30.",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 22 O.S. § 1289.24 to:

1. Suppress and exclude from evidence all items seized as described herein, in violation of the Fourth Amendment and Article II, Section 30 of the Oklahoma Constitution;

2. Suppress and exclude any and all statements made by the Defendant;

3. Suppress and exclude any derivative evidence;

4. Grant an evidentiary hearing on this motion;

5. Grant such other relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF OKLAHOMA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Oklahoma-specific certificate of service format",
  },
];

const okFederalSections: TemplateSection[] = [
  ...okBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to suppress evidence in a federal criminal matter in the District of Oklahoma.

Evidence Details:
- Type of Evidence: {{evidenceType}}
- Description: {{evidenceDescription}}
- Date Obtained: {{dateObtained}}
- Location: {{locationObtained}}
- Constitutional Basis: {{constitutionalBasis}}
- Factual Basis: {{factualBasis}}
- Warrant Status: {{warrantIssued}}
- Miranda Status: {{mirandaGiven}}
- Consent Status: {{consentGiven}}

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal suppression motion.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to suppress evidence with Tenth Circuit precedent.

Evidence Type: {{evidenceType}}
Constitutional Basis: {{constitutionalBasis}}
Factual Basis: {{factualBasis}}
Warrant Status: {{warrantIssued}}
Miranda Status: {{mirandaGiven}}
Consent Status: {{consentGiven}}

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3) to suppress and exclude the evidence described herein and grant such other relief as is just and proper.`,
    helpText: "Federal prayer for relief",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing via CM/ECF electronic filing.

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Template Definition
// ============================================================================

export const motionToSuppressTemplate: DocumentTemplate = {
  id: "motion-to-suppress",
  name: "Motion to Suppress Evidence",
  category: "criminal",
  description: "Move to suppress evidence obtained in violation of constitutional rights. This motion challenges the admissibility of evidence under the Fourth Amendment (unlawful search/seizure), Fifth Amendment (Miranda violations), or Sixth Amendment (right to counsel violations).",
  version: "1.0.0",
  lastUpdated: new Date("2024-01-25"),
  baseSections,
  jurisdictionVariants: [
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "Filed under Cal. Penal Code \u00A7 1538.5. Must be filed before trial or at preliminary hearing. California courts require line numbers in the left margin.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: federalSections,
      courtSpecificRules: "CACD L.R. 11-3: 14pt font required. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: federalSections,
      courtSpecificRules: "N.D. Cal.: 14pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: federalSections,
      courtSpecificRules: "E.D. Cal. L.R. 130(b): 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: federalSections,
      courtSpecificRules: "S.D. Cal.: 14pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial.",
    },
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: newYorkSections,
      courtSpecificRules: "Filed under CPL \u00A7 710.20. Must be filed within 45 days of arraignment (CPL \u00A7 255.20). New York provides broader search and seizure protections under N.Y. Const. Art. I, \u00A7 12.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "S.D.N.Y.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "E.D.N.Y.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "N.D.N.Y.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "W.D.N.Y.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required.",
    },
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: texasSections,
      courtSpecificRules: "Filed under Tex. Code Crim. Proc. Art. 38.23. Texas has an independent statutory exclusionary rule. 14pt font required for computer-generated documents. E-filing via eFileTexas.gov mandatory for attorneys in most counties.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "N.D. Tex.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. TXND L.R. 5.1.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "S.D. Tex.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. TXSD L.R. 5.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "E.D. Tex.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. TXED L.R. CV-10.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "W.D. Tex.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. TXWD L.R. CV-10.",
    },
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: floridaSections,
      courtSpecificRules: "Filed under Fla. R. Crim. P. 3.190(h). Florida Constitution Art. I, \u00A7 12 is construed in conformity with the Fourth Amendment. 12pt font. E-filing via Florida Courts E-Filing Portal mandatory.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "S.D. Fla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. FLSD L.R. 5.1.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "M.D. Fla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. FLMD L.R. 1.05.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "N.D. Fla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. FLND L.R. 5.1.",
    },
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: pennsylvaniaSections,
      courtSpecificRules: "Filed under Pa.R.Crim.P. 581. Pennsylvania provides broader protections under PA Const. Art. I, \u00A7 8 than the federal Fourth Amendment. E-filing via PACFile mandatory.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "E.D. Pa.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. PAED L.R. 5.1.2.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "M.D. Pa.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. PAMD L.R. 5.2.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "W.D. Pa.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. PAWD L.R. 5.2.",
    },
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: illinoisSections,
      courtSpecificRules: "Filed under 725 ILCS 5/114-12. Illinois Constitution Art. I, \u00A7 6 provides protections against unreasonable searches and seizures. E-filing mandatory in most counties.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "N.D. Ill.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. ILND L.R. 5.2.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "C.D. Ill.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. ILCD L.R. 5.1.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "S.D. Ill.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. ILSD L.R. 5.1.",
    },
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohioSections,
      courtSpecificRules: "Filed under Ohio Crim.R. 12(C)(3). Ohio Constitution Art. I, \u00A7 14 provides protections against unreasonable searches and seizures. E-filing requirements vary by county.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "N.D. Ohio: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. OHND L.R. 5.1.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "S.D. Ohio: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. OHSD L.R. 5.2.",
    },
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: georgiaSections,
      courtSpecificRules: "Filed under O.C.G.A. \u00A7 17-5-30. Motion must be filed within 10 days after arraignment or at a later time as the court may allow. Georgia Constitution Art. I, \u00A7 I, Para. XIII provides protections against unreasonable searches and seizures.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "N.D. Ga.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. GAND L.R. 5.1.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "M.D. Ga.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. GAMD L.R. 5.1.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "S.D. Ga.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Must be filed before trial. CM/ECF electronic filing required. GASD L.R. 5.1.",
    },
    // North Carolina
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: northCarolinaSections,
      courtSpecificRules: "Filed under N.C. Gen. Stat. § 15A-974. NC Const. Art. I, § 20 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "E.D.N.C.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "M.D.N.C.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "W.D.N.C.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    // Michigan
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: michiganSections,
      courtSpecificRules: "Filed under MCR 6.101(C). MI Const. Art. I, § 11 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "E.D. Mich.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "W.D. Mich.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    // New Jersey
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: newJerseySections,
      courtSpecificRules: "Filed under N.J. Ct. R. 3:5-7. NJ Const. Art. I, § 7 provides broader protections than federal. No good faith exception.",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "D.N.J.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Third Circuit. CM/ECF required.",
    },
    // Virginia
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: virginiaSections,
      courtSpecificRules: "Filed under Va. Code § 19.2-60. VA Const. Art. I, § 10 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "E.D. Va.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "W.D. Va.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    // Washington
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: washingtonSections,
      courtSpecificRules: "Filed under CrR 3.6. WA Const. Art. I, § 7 provides broader protections than federal Fourth Amendment.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "E.D. Wash.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "W.D. Wash.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Ninth Circuit. CM/ECF required.",
    },
    // Arizona
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: arizonaSections,
      courtSpecificRules: "Filed under Ariz. R. Crim. P. 16. AZ Const. Art. II, § 8 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "D. Ariz.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Ninth Circuit. CM/ECF required.",
    },
    // Massachusetts
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: massachusettsSections,
      courtSpecificRules: "Filed under Mass. R. Crim. P. 13. MA Const. Part I, Art. XIV provides broader protections than federal.",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "D. Mass.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). First Circuit. CM/ECF required.",
    },
    // Tennessee
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Filed under Tenn. R. Crim. P. 12. TN Const. Art. I, § 7 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "E.D. Tenn.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "M.D. Tenn.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "W.D. Tenn.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    // Indiana
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Filed under Ind. R. Crim. P. 12. IN Const. Art. I, § 11 uses Litchfield reasonableness test.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "N.D. Ind.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "S.D. Ind.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Seventh Circuit. CM/ECF required.",
    },
    // Maryland
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Filed under Md. Rule 4-252. MD Const. Decl. of Rights, Art. 26 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "D. Md.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    // Missouri
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Filed under Mo. Sup. Ct. R. 24.05; RSMo § 542.296. Mo. Const. Art. I, § 15 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "E.D. Mo.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "W.D. Mo.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eighth Circuit. CM/ECF required.",
    },
    // Wisconsin
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Filed under Wis. Stat. § 971.31(10). Wis. Const. Art. I, § 11 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "E.D. Wis.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "W.D. Wis.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Seventh Circuit. CM/ECF required.",
    },
    // Colorado
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coloradoSections,
      courtSpecificRules: "Filed under Colo. R. Crim. P. 41; C.R.S. § 16-3-303. Colo. Const. Art. II, § 7 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "D. Colo.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Tenth Circuit. CM/ECF required.",
    },
    // Minnesota
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: minnesotaSections,
      courtSpecificRules: "Filed under Minn. R. Crim. P. 10.04. Minn. Const. Art. I, § 10 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "D. Minn.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eighth Circuit. CM/ECF required.",
    },
    // South Carolina
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: southCarolinaSections,
      courtSpecificRules: "Filed under S.C. R. Crim. P. 5; S.C. Code § 17-13-140. S.C. Const. Art. I, § 10 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "D.S.C.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fourth Circuit. CM/ECF required.",
    },
    // Alabama
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alabamaSections,
      courtSpecificRules: "Filed under Ala. R. Crim. P. 15.7. Ala. Const. Art. I, § 5 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "N.D. Ala.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "M.D. Ala.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "S.D. Ala.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Eleventh Circuit. CM/ECF required.",
    },
    // Louisiana
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: louisianaSections,
      courtSpecificRules: "Filed under La. C.Cr.P. art. 703. La. Const. Art. I, § 5 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "E.D. La.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "M.D. La.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "W.D. La.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Fifth Circuit. CM/ECF required.",
    },
    // Kentucky
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kentuckySections,
      courtSpecificRules: "Filed under Ky. R. Crim. P. 8.20; KRS 500.090. Ky. Const. § 10 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "E.D. Ky.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "W.D. Ky.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Sixth Circuit. CM/ECF required.",
    },
    // Oregon
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: oregonSections,
      courtSpecificRules: "Filed under ORS 133.673; ORCP 47. Or. Const. Art. I, § 9 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "D. Or.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Ninth Circuit. CM/ECF required.",
    },
    // Oklahoma
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: oklahomaSections,
      courtSpecificRules: "Filed under 22 O.S. § 1223; Okla. Ct. Crim. App. R. 4.1. Okla. Const. Art. II, § 30 provides protections against unreasonable searches.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "N.D. Okla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "E.D. Okla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "W.D. Okla.: 12pt font. Filed under Fed. R. Crim. P. 12(b)(3). Tenth Circuit. CM/ECF required.",
    },
  ],
  estimatedCompletionTime: "15-25 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK"],
};

export default motionToSuppressTemplate;
