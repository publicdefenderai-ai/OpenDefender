/**
 * Motion to Suppress Evidence Template
 *
 * Criminal law document template for requesting suppression of evidence
 * obtained in violation of constitutional rights (Fourth, Fifth, Sixth Amendments).
 * Includes California-specific variant and federal court variants.
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

// ============================================================================
// California-Specific Sections
// ============================================================================

const californiaSections: TemplateSection[] = [
  // Caption, evidence info, constitutional basis, and hearing sections are the same
  ...baseSections.slice(0, 4),

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
  // Caption, evidence info, constitutional basis, and hearing sections are the same
  ...baseSections.slice(0, 4),

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
  ],
  estimatedCompletionTime: "15-25 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "CACD", "NDCA", "EDCA", "SDCA"],
};

export default motionToSuppressTemplate;
