/**
 * Motion to Dismiss Template
 *
 * Criminal law document template for requesting dismissal of charges.
 * Covers grounds including lack of probable cause, speedy trial violations,
 * defective charging documents, insufficient evidence, and more.
 * Includes jurisdiction-specific variants for all 50 states + DC and federal court variants.
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

const dismissalGroundsInputs: TemplateInput[] = [
  {
    id: "dismissalGround",
    label: "Ground for Dismissal",
    type: "select",
    required: true,
    helpText: "Select the primary ground for seeking dismissal",
    validation: {
      options: [
        { value: "lack_of_probable_cause", label: "Lack of Probable Cause" },
        { value: "speedy_trial", label: "Speedy Trial Violation" },
        { value: "defective_charging", label: "Defective Charging Document (Indictment/Information)" },
        { value: "insufficient_evidence", label: "Insufficient Evidence" },
        { value: "prosecutorial_misconduct", label: "Prosecutorial Misconduct" },
        { value: "statute_of_limitations", label: "Statute of Limitations Expired" },
        { value: "double_jeopardy", label: "Double Jeopardy" },
        { value: "due_process", label: "Due Process Violation" },
        { value: "immunity", label: "Immunity (Transactional/Use)" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "chargesDescription",
    label: "Description of Charges and Basis for Dismissal",
    type: "textarea",
    placeholder: "Describe the charges and the specific basis for dismissal...",
    required: true,
    helpText: "Describe the charges and the specific basis for dismissal",
    validation: {
      minLength: 50,
      maxLength: 2000,
    },
  },
  {
    id: "factualBasis",
    label: "Factual Basis for Dismissal",
    type: "textarea",
    placeholder: "Provide the specific facts supporting dismissal...",
    required: true,
    helpText: "Provide the specific facts supporting dismissal",
    validation: {
      minLength: 100,
      maxLength: 3000,
    },
  },
  {
    id: "filingDate",
    label: "Date Charges Were Filed",
    type: "date",
    required: true,
    helpText: "Date the charges were filed or the indictment was returned",
  },
  {
    id: "priorMotions",
    label: "Prior Motions to Dismiss",
    type: "select",
    required: true,
    helpText: "Number of prior motions to dismiss filed in this case",
    validation: {
      options: [
        { value: "0", label: "None" },
        { value: "1", label: "One prior motion to dismiss" },
        { value: "2", label: "Two or more prior motions" },
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
        { value: "arraignment", label: "Arraignment" },
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
    id: "dismissalGrounds",
    name: "Grounds for Dismissal",
    type: "user-input",
    order: 2,
    inputs: dismissalGroundsInputs,
    required: true,
    helpText: "Describe the grounds for seeking dismissal of charges",
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

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
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss in a criminal matter.

Jurisdiction: {{jurisdiction}}
Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Generate 3-5 paragraphs that:
1. State the applicable legal standard for dismissal on the identified ground
2. Cite the constitutional and/or statutory basis for dismissal
3. Apply the facts to the legal standard, showing why dismissal is required
4. Address any potential prosecution arguments against dismissal
5. Conclude with why the court should dismiss the charges

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

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for dismissal motions",
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

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties in this action by:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice)) in a California criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice), a defendant may move to dismiss charges. See People v. Konow (2004) 32 Cal.4th 995.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a California Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice) motion. Present facts chronologically.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under California law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable California law includes:
- Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice): Motion to dismiss
- Cal. Const. Art. I, § 7: Constitutional protections
- People v. Konow (2004) 32 Cal.4th 995: Key precedent

Generate 3-5 paragraphs applying California constitutional and statutory standards.`,
    aiInstructions: "Must cite Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice) and People v. Konow (2004) 32 Cal.4th 995.",
    helpText: "AI will generate California-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California prayer for relief citing Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice)) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of California.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (CPL § 170.30, § 210.20) in a New York criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under CPL § 170.30, § 210.20, a defendant may move to dismiss charges. See People v. Darienzo, 29 N.Y.3d 929 (2017).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New York CPL § 170.30, § 210.20 motion. Present facts chronologically.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under New York law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable New York law includes:
- CPL § 170.30, § 210.20: Motion to dismiss
- N.Y. Const. Art. I, § 6: Constitutional protections
- People v. Darienzo, 29 N.Y.3d 929 (2017): Key precedent

Generate 3-5 paragraphs applying New York constitutional and statutory standards.`,
    aiInstructions: "Must cite CPL § 170.30, § 210.20 and People v. Darienzo, 29 N.Y.3d 929 (2017).",
    helpText: "AI will generate New York-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CPL § 170.30, § 210.20 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing CPL § 170.30, § 210.20",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (CPL § 170.30, § 210.20) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of New York.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Second Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Second Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial)) in a Texas criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial), a defendant may move to dismiss charges. See State v. Mungia, 119 S.W.3d 814 (Tex. Crim. App. 2003).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Texas Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial) motion. Present facts chronologically.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Texas law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Texas law includes:
- Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial): Motion to dismiss
- Tex. Const. Art. I, § 19: Constitutional protections
- State v. Mungia, 119 S.W.3d 814 (Tex. Crim. App. 2003): Key precedent

Generate 3-5 paragraphs applying Texas constitutional and statutory standards.`,
    aiInstructions: "Must cite Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial) and State v. Mungia, 119 S.W.3d 814 (Tex. Crim. App. 2003).",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial)",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

THE STATE OF TEXAS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial)) on all parties in this action by the following method:

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

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Texas.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fifth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fifth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Fla. R. Crim. P. 3.190(c)) in a Florida criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Fla. R. Crim. P. 3.190(c), a defendant may move to dismiss charges. See State v. Hand, 399 So.2d 973 (Fla. 1981).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Florida Fla. R. Crim. P. 3.190(c) motion. Present facts chronologically.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Florida law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Florida law includes:
- Fla. R. Crim. P. 3.190(c): Motion to dismiss
- Fla. Const. Art. I, § 16: Constitutional protections
- State v. Hand, 399 So.2d 973 (Fla. 1981): Key precedent

Generate 3-5 paragraphs applying Florida constitutional and statutory standards.`,
    aiInstructions: "Must cite Fla. R. Crim. P. 3.190(c) and State v. Hand, 399 So.2d 973 (Fla. 1981).",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Fla. R. Crim. P. 3.190(c) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing Fla. R. Crim. P. 3.190(c)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Fla. R. Crim. P. 3.190(c)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via Florida Courts E-Filing Portal to the email address(es) of record.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Florida.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eleventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eleventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Pa. R. Crim. P. 587) in a Pennsylvania criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Pa. R. Crim. P. 587, a defendant may move to dismiss charges. See Commonwealth v. Hess, 489 A.2d 868 (Pa. Super. 1985).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania Pa. R. Crim. P. 587 motion. Present facts chronologically.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Pennsylvania law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Pennsylvania law includes:
- Pa. R. Crim. P. 587: Motion to dismiss
- PA Const. Art. I, § 9: Constitutional protections
- Commonwealth v. Hess, 489 A.2d 868 (Pa. Super. 1985): Key precedent

Generate 3-5 paragraphs applying Pennsylvania constitutional and statutory standards.`,
    aiInstructions: "Must cite Pa. R. Crim. P. 587 and Commonwealth v. Hess, 489 A.2d 868 (Pa. Super. 1985).",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pa. R. Crim. P. 587 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing Pa. R. Crim. P. 587",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF PENNSYLVANIA, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Pa. R. Crim. P. 587) on all parties in this action by the following method:

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

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Pennsylvania.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Third Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Third Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (725 ILCS 5/114-1) in a Illinois criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under 725 ILCS 5/114-1, a defendant may move to dismiss charges. See People v. Hughes, 2012 IL 112817.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Illinois 725 ILCS 5/114-1 motion. Present facts chronologically.",
    helpText: "AI will generate a Illinois-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Illinois law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Illinois law includes:
- 725 ILCS 5/114-1: Motion to dismiss
- Ill. Const. Art. I, § 2: Constitutional protections
- People v. Hughes, 2012 IL 112817: Key precedent

Generate 3-5 paragraphs applying Illinois constitutional and statutory standards.`,
    aiInstructions: "Must cite 725 ILCS 5/114-1 and People v. Hughes, 2012 IL 112817.",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 725 ILCS 5/114-1 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing 725 ILCS 5/114-1",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (725 ILCS 5/114-1) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Illinois.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Seventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Seventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., CR-24-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Ohio Crim. R. 12(C), ORC § 2941.54) in a Ohio criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Ohio Crim. R. 12(C), ORC § 2941.54, a defendant may move to dismiss charges. See State v. Busch, 76 Ohio St.3d 613 (1996).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Ohio Ohio Crim. R. 12(C), ORC § 2941.54 motion. Present facts chronologically.",
    helpText: "AI will generate a Ohio-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Ohio law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Ohio law includes:
- Ohio Crim. R. 12(C), ORC § 2941.54: Motion to dismiss
- Ohio Const. Art. I, § 10: Constitutional protections
- State v. Busch, 76 Ohio St.3d 613 (1996): Key precedent

Generate 3-5 paragraphs applying Ohio constitutional and statutory standards.`,
    aiInstructions: "Must cite Ohio Crim. R. 12(C), ORC § 2941.54 and State v. Busch, 76 Ohio St.3d 613 (1996).",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio Crim. R. 12(C), ORC § 2941.54 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing Ohio Crim. R. 12(C), ORC § 2941.54",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Ohio Crim. R. 12(C), ORC § 2941.54) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Ohio.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Sixth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Sixth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXCFXXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (O.C.G.A. § 17-7-110) in a Georgia criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under O.C.G.A. § 17-7-110, a defendant may move to dismiss charges. See State v. Kelley, 290 Ga. 29 (2011).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Georgia O.C.G.A. § 17-7-110 motion. Present facts chronologically.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Georgia law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Georgia law includes:
- O.C.G.A. § 17-7-110: Motion to dismiss
- Ga. Const. Art. I, § I, ¶ I: Constitutional protections
- State v. Kelley, 290 Ga. 29 (2011): Key precedent

Generate 3-5 paragraphs applying Georgia constitutional and statutory standards.`,
    aiInstructions: "Must cite O.C.G.A. § 17-7-110 and State v. Kelley, 290 Ga. 29 (2011).",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. § 17-7-110 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing O.C.G.A. § 17-7-110",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (O.C.G.A. § 17-7-110) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Georgia.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eleventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eleventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXCRS-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (N.C. Gen. Stat. § 15A-954) in a North Carolina criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under N.C. Gen. Stat. § 15A-954, a defendant may move to dismiss charges. See State v. Wilkins, 131 N.C. App. 220 (1998).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a North Carolina N.C. Gen. Stat. § 15A-954 motion. Present facts chronologically.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under North Carolina law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable North Carolina law includes:
- N.C. Gen. Stat. § 15A-954: Motion to dismiss
- N.C. Const. Art. I, § 19: Constitutional protections
- State v. Wilkins, 131 N.C. App. 220 (1998): Key precedent

Generate 3-5 paragraphs applying North Carolina constitutional and statutory standards.`,
    aiInstructions: "Must cite N.C. Gen. Stat. § 15A-954 and State v. Wilkins, 131 N.C. App. 220 (1998).",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C. Gen. Stat. § 15A-954 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief citing N.C. Gen. Stat. § 15A-954",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (N.C. Gen. Stat. § 15A-954) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of North Carolina.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fourth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fourth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XX-XXXXXX-FH" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (MCR 6.110(E)) in a Michigan criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under MCR 6.110(E), a defendant may move to dismiss charges. See People v. Stone, 269 Mich. App. 240 (2005).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Michigan MCR 6.110(E) motion. Present facts chronologically.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Michigan law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Michigan law includes:
- MCR 6.110(E): Motion to dismiss
- Mich. Const. Art. I, § 17: Constitutional protections
- People v. Stone, 269 Mich. App. 240 (2005): Key precedent

Generate 3-5 paragraphs applying Michigan constitutional and statutory standards.`,
    aiInstructions: "Must cite MCR 6.110(E) and People v. Stone, 269 Mich. App. 240 (2005).",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MCR 6.110(E) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief citing MCR 6.110(E)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (MCR 6.110(E)) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Michigan.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Sixth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Sixth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const newJerseySections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (N.J. Court R. 3:10-2) in a New Jersey criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under N.J. Court R. 3:10-2, a defendant may move to dismiss charges. See State v. Hogan, 144 N.J. 216 (1996).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Jersey N.J. Court R. 3:10-2 motion. Present facts chronologically.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under New Jersey law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable New Jersey law includes:
- N.J. Court R. 3:10-2: Motion to dismiss
- N.J. Const. Art. I, ¶ 1: Constitutional protections
- State v. Hogan, 144 N.J. 216 (1996): Key precedent

Generate 3-5 paragraphs applying New Jersey constitutional and statutory standards.`,
    aiInstructions: "Must cite N.J. Court R. 3:10-2 and State v. Hogan, 144 N.J. 216 (1996).",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J. Court R. 3:10-2 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief citing N.J. Court R. 3:10-2",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (N.J. Court R. 3:10-2) on all parties in this action by the following method:

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

const njFederalSections: TemplateSection[] = [
  ...njBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of New Jersey.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Third Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Third Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., CRXX-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Va. Code § 19.2-265.6) in a Virginia criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Va. Code § 19.2-265.6, a defendant may move to dismiss charges. See Commonwealth v. Agee, 272 Va. 456 (2006).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Virginia Va. Code § 19.2-265.6 motion. Present facts chronologically.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Virginia law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Virginia law includes:
- Va. Code § 19.2-265.6: Motion to dismiss
- Va. Const. Art. I, § 8: Constitutional protections
- Commonwealth v. Agee, 272 Va. 456 (2006): Key precedent

Generate 3-5 paragraphs applying Virginia constitutional and statutory standards.`,
    aiInstructions: "Must cite Va. Code § 19.2-265.6 and Commonwealth v. Agee, 272 Va. 456 (2006).",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Va. Code § 19.2-265.6 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Virginia prayer for relief citing Va. Code § 19.2-265.6",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF VIRGINIA, COUNTY/CITY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Va. Code § 19.2-265.6) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const vaFederalSections: TemplateSection[] = [
  ...vaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Virginia.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fourth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fourth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const washingtonSections: TemplateSection[] = [
  ...waBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (CrR 8.3(b)) in a Washington criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under CrR 8.3(b), a defendant may move to dismiss charges. See State v. Michielli, 132 Wn.2d 229 (1997).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Washington CrR 8.3(b) motion. Present facts chronologically.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Washington law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Washington law includes:
- CrR 8.3(b): Motion to dismiss
- WA Const. Art. I, § 3: Constitutional protections
- State v. Michielli, 132 Wn.2d 229 (1997): Key precedent

Generate 3-5 paragraphs applying Washington constitutional and statutory standards.`,
    aiInstructions: "Must cite CrR 8.3(b) and State v. Michielli, 132 Wn.2d 229 (1997).",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CrR 8.3(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Washington prayer for relief citing CrR 8.3(b)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (CrR 8.3(b)) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Washington.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Ariz. R. Crim. P. 16.5) in a Arizona criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Ariz. R. Crim. P. 16.5, a defendant may move to dismiss charges. See State v. Moody, 208 Ariz. 424 (2004).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Arizona Ariz. R. Crim. P. 16.5 motion. Present facts chronologically.",
    helpText: "AI will generate a Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Arizona law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Arizona law includes:
- Ariz. R. Crim. P. 16.5: Motion to dismiss
- Ariz. Const. Art. II, § 4: Constitutional protections
- State v. Moody, 208 Ariz. 424 (2004): Key precedent

Generate 3-5 paragraphs applying Arizona constitutional and statutory standards.`,
    aiInstructions: "Must cite Ariz. R. Crim. P. 16.5 and State v. Moody, 208 Ariz. 424 (2004).",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ariz. R. Crim. P. 16.5 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arizona prayer for relief citing Ariz. R. Crim. P. 16.5",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Ariz. R. Crim. P. 16.5) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Arizona.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Mass. R. Crim. P. 13) in a Massachusetts criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Mass. R. Crim. P. 13, a defendant may move to dismiss charges. See Commonwealth v. O'Dell, 392 Mass. 445 (1984).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts Mass. R. Crim. P. 13 motion. Present facts chronologically.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Massachusetts law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Massachusetts law includes:
- Mass. R. Crim. P. 13: Motion to dismiss
- Mass. Const. Pt. I, Art. XII: Constitutional protections
- Commonwealth v. O'Dell, 392 Mass. 445 (1984): Key precedent

Generate 3-5 paragraphs applying Massachusetts constitutional and statutory standards.`,
    aiInstructions: "Must cite Mass. R. Crim. P. 13 and Commonwealth v. O'Dell, 392 Mass. 445 (1984).",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. R. Crim. P. 13 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Massachusetts prayer for relief citing Mass. R. Crim. P. 13",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF MASSACHUSETTS, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Mass. R. Crim. P. 13) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const maFederalSections: TemplateSection[] = [
  ...maBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Massachusetts.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the First Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- First Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Tenn. R. Crim. P. 12(b)) in a Tennessee criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Tenn. R. Crim. P. 12(b), a defendant may move to dismiss charges. See State v. Northington, 667 S.W.2d 57 (Tenn. 1984).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Tennessee Tenn. R. Crim. P. 12(b) motion. Present facts chronologically.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Tennessee law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Tennessee law includes:
- Tenn. R. Crim. P. 12(b): Motion to dismiss
- Tenn. Const. Art. I, § 8: Constitutional protections
- State v. Northington, 667 S.W.2d 57 (Tenn. 1984): Key precedent

Generate 3-5 paragraphs applying Tennessee constitutional and statutory standards.`,
    aiInstructions: "Must cite Tenn. R. Crim. P. 12(b) and State v. Northington, 667 S.W.2d 57 (Tenn. 1984).",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Crim. P. 12(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Tennessee prayer for relief citing Tenn. R. Crim. P. 12(b)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Tenn. R. Crim. P. 12(b)) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Tennessee.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Sixth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Sixth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Ind. Code § 35-34-1-4) in a Indiana criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Ind. Code § 35-34-1-4, a defendant may move to dismiss charges. See State v. Hicks, 525 N.E.2d 316 (Ind. 1988).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Indiana Ind. Code § 35-34-1-4 motion. Present facts chronologically.",
    helpText: "AI will generate a Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Indiana law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Indiana law includes:
- Ind. Code § 35-34-1-4: Motion to dismiss
- Ind. Const. Art. I, § 13: Constitutional protections
- State v. Hicks, 525 N.E.2d 316 (Ind. 1988): Key precedent

Generate 3-5 paragraphs applying Indiana constitutional and statutory standards.`,
    aiInstructions: "Must cite Ind. Code § 35-34-1-4 and State v. Hicks, 525 N.E.2d 316 (Ind. 1988).",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ind. Code § 35-34-1-4 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Indiana prayer for relief citing Ind. Code § 35-34-1-4",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Ind. Code § 35-34-1-4) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Indiana.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Seventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Seventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXXXXX-XXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Md. Rule 4-252) in a Maryland criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Md. Rule 4-252, a defendant may move to dismiss charges. See State v. Henson, 44 Md. App. 69 (1979).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Maryland Md. Rule 4-252 motion. Present facts chronologically.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Maryland law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Maryland law includes:
- Md. Rule 4-252: Motion to dismiss
- Md. Const. Decl. of Rights, Art. 24: Constitutional protections
- State v. Henson, 44 Md. App. 69 (1979): Key precedent

Generate 3-5 paragraphs applying Maryland constitutional and statutory standards.`,
    aiInstructions: "Must cite Md. Rule 4-252 and State v. Henson, 44 Md. App. 69 (1979).",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 4-252 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maryland prayer for relief citing Md. Rule 4-252",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF MARYLAND, COUNTY/CITY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Md. Rule 4-252) on all parties in this action by the following method:

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

const mdFederalSections: TemplateSection[] = [
  ...mdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Maryland.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fourth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fourth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Mo. R. Crim. P. 24.04, RSMo § 545.030) in a Missouri criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Mo. R. Crim. P. 24.04, RSMo § 545.030, a defendant may move to dismiss charges. See State v. Love, 134 S.W.3d 55 (Mo. Ct. App. 2004).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Missouri Mo. R. Crim. P. 24.04, RSMo § 545.030 motion. Present facts chronologically.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Missouri law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Missouri law includes:
- Mo. R. Crim. P. 24.04, RSMo § 545.030: Motion to dismiss
- Mo. Const. Art. I, § 18(a): Constitutional protections
- State v. Love, 134 S.W.3d 55 (Mo. Ct. App. 2004): Key precedent

Generate 3-5 paragraphs applying Missouri constitutional and statutory standards.`,
    aiInstructions: "Must cite Mo. R. Crim. P. 24.04, RSMo § 545.030 and State v. Love, 134 S.W.3d 55 (Mo. Ct. App. 2004).",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mo. R. Crim. P. 24.04, RSMo § 545.030 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief citing Mo. R. Crim. P. 24.04, RSMo § 545.030",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Mo. R. Crim. P. 24.04, RSMo § 545.030) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Missouri.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Wis. Stat. § 971.31) in a Wisconsin criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Wis. Stat. § 971.31, a defendant may move to dismiss charges. See State v. Braunsdorf, 98 Wis. 2d 569 (1980).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin Wis. Stat. § 971.31 motion. Present facts chronologically.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Wisconsin law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Wisconsin law includes:
- Wis. Stat. § 971.31: Motion to dismiss
- Wis. Const. Art. I, § 8: Constitutional protections
- State v. Braunsdorf, 98 Wis. 2d 569 (1980): Key precedent

Generate 3-5 paragraphs applying Wisconsin constitutional and statutory standards.`,
    aiInstructions: "Must cite Wis. Stat. § 971.31 and State v. Braunsdorf, 98 Wis. 2d 569 (1980).",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 971.31 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief citing Wis. Stat. § 971.31",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Wis. Stat. § 971.31) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Wisconsin.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Seventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Seventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXCR-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Colo. R. Crim. P. 48, C.R.S. § 18-1-405) in a Colorado criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Colo. R. Crim. P. 48, C.R.S. § 18-1-405, a defendant may move to dismiss charges. See People v. Daigle, 2017 COA 30.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Colorado Colo. R. Crim. P. 48, C.R.S. § 18-1-405 motion. Present facts chronologically.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Colorado law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Colorado law includes:
- Colo. R. Crim. P. 48, C.R.S. § 18-1-405: Motion to dismiss
- Colo. Const. Art. II, § 16: Constitutional protections
- People v. Daigle, 2017 COA 30: Key precedent

Generate 3-5 paragraphs applying Colorado constitutional and statutory standards.`,
    aiInstructions: "Must cite Colo. R. Crim. P. 48, C.R.S. § 18-1-405 and People v. Daigle, 2017 COA 30.",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Colo. R. Crim. P. 48, C.R.S. § 18-1-405 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief citing Colo. R. Crim. P. 48, C.R.S. § 18-1-405",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Colo. R. Crim. P. 48, C.R.S. § 18-1-405) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Colorado.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XX-CR-XX-XXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Minn. R. Crim. P. 17.06) in a Minnesota criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Minn. R. Crim. P. 17.06, a defendant may move to dismiss charges. See State v. Coates, 807 N.W.2d 208 (Minn. 2011).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Minnesota Minn. R. Crim. P. 17.06 motion. Present facts chronologically.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Minnesota law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Minnesota law includes:
- Minn. R. Crim. P. 17.06: Motion to dismiss
- Minn. Const. Art. I, § 6: Constitutional protections
- State v. Coates, 807 N.W.2d 208 (Minn. 2011): Key precedent

Generate 3-5 paragraphs applying Minnesota constitutional and statutory standards.`,
    aiInstructions: "Must cite Minn. R. Crim. P. 17.06 and State v. Coates, 807 N.W.2d 208 (Minn. 2011).",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Crim. P. 17.06 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief citing Minn. R. Crim. P. 17.06",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Minn. R. Crim. P. 17.06) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Minnesota.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (S.C. Code Ann. § 17-23-40) in a South Carolina criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under S.C. Code Ann. § 17-23-40, a defendant may move to dismiss charges. See State v. Bray, 342 S.C. 23 (2000).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a South Carolina S.C. Code Ann. § 17-23-40 motion. Present facts chronologically.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under South Carolina law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable South Carolina law includes:
- S.C. Code Ann. § 17-23-40: Motion to dismiss
- S.C. Const. Art. I, § 14: Constitutional protections
- State v. Bray, 342 S.C. 23 (2000): Key precedent

Generate 3-5 paragraphs applying South Carolina constitutional and statutory standards.`,
    aiInstructions: "Must cite S.C. Code Ann. § 17-23-40 and State v. Bray, 342 S.C. 23 (2000).",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C. Code Ann. § 17-23-40 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief citing S.C. Code Ann. § 17-23-40",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (S.C. Code Ann. § 17-23-40) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of South Carolina.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fourth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fourth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Ala. R. Crim. P. 13.5) in a Alabama criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Ala. R. Crim. P. 13.5, a defendant may move to dismiss charges. See Ex parte McNabb, 887 So. 2d 998 (Ala. 2004).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Alabama Ala. R. Crim. P. 13.5 motion. Present facts chronologically.",
    helpText: "AI will generate a Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Alabama law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Alabama law includes:
- Ala. R. Crim. P. 13.5: Motion to dismiss
- Ala. Const. Art. I, § 6: Constitutional protections
- Ex parte McNabb, 887 So. 2d 998 (Ala. 2004): Key precedent

Generate 3-5 paragraphs applying Alabama constitutional and statutory standards.`,
    aiInstructions: "Must cite Ala. R. Crim. P. 13.5 and Ex parte McNabb, 887 So. 2d 998 (Ala. 2004).",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Crim. P. 13.5 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief citing Ala. R. Crim. P. 13.5",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Ala. R. Crim. P. 13.5) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Alabama.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eleventh Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eleventh Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (La. Code Crim. Proc. Art. 532, Art. 534) in a Louisiana criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under La. Code Crim. Proc. Art. 532, Art. 534, a defendant may move to dismiss charges. See State v. Byrd, 708 So. 2d 401 (La. 1998).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Louisiana La. Code Crim. Proc. Art. 532, Art. 534 motion. Present facts chronologically.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Louisiana law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Louisiana law includes:
- La. Code Crim. Proc. Art. 532, Art. 534: Motion to dismiss
- La. Const. Art. I, § 2: Constitutional protections
- State v. Byrd, 708 So. 2d 401 (La. 1998): Key precedent

Generate 3-5 paragraphs applying Louisiana constitutional and statutory standards.`,
    aiInstructions: "Must cite La. Code Crim. Proc. Art. 532, Art. 534 and State v. Byrd, 708 So. 2d 401 (La. 1998).",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. Code Crim. Proc. Art. 532, Art. 534 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief citing La. Code Crim. Proc. Art. 532, Art. 534",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (La. Code Crim. Proc. Art. 532, Art. 534) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Louisiana.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fifth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fifth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (KRS § 500.110, Ky. R. Crim. P. 8.06) in a Kentucky criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under KRS § 500.110, Ky. R. Crim. P. 8.06, a defendant may move to dismiss charges. See Commonwealth v. Reed, 531 S.W.3d 478 (Ky. 2017).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Kentucky KRS § 500.110, Ky. R. Crim. P. 8.06 motion. Present facts chronologically.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Kentucky law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Kentucky law includes:
- KRS § 500.110, Ky. R. Crim. P. 8.06: Motion to dismiss
- Ky. Const. § 11: Constitutional protections
- Commonwealth v. Reed, 531 S.W.3d 478 (Ky. 2017): Key precedent

Generate 3-5 paragraphs applying Kentucky constitutional and statutory standards.`,
    aiInstructions: "Must cite KRS § 500.110, Ky. R. Crim. P. 8.06 and Commonwealth v. Reed, 531 S.W.3d 478 (Ky. 2017).",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to KRS § 500.110, Ky. R. Crim. P. 8.06 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief citing KRS § 500.110, Ky. R. Crim. P. 8.06",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

COMMONWEALTH OF KENTUCKY, COUNTY OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (KRS § 500.110, Ky. R. Crim. P. 8.06) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via e-filing system to the email address(es) of record.

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

const kyFederalSections: TemplateSection[] = [
  ...kyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Kentucky.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Sixth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Sixth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXCR-XXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (ORS § 135.510, ORS § 135.755) in a Oregon criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under ORS § 135.510, ORS § 135.755, a defendant may move to dismiss charges. See State v. Harberts, 331 Or. 72 (2000).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Oregon ORS § 135.510, ORS § 135.755 motion. Present facts chronologically.",
    helpText: "AI will generate a Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Oregon law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Oregon law includes:
- ORS § 135.510, ORS § 135.755: Motion to dismiss
- Or. Const. Art. I, § 12: Constitutional protections
- State v. Harberts, 331 Or. 72 (2000): Key precedent

Generate 3-5 paragraphs applying Oregon constitutional and statutory standards.`,
    aiInstructions: "Must cite ORS § 135.510, ORS § 135.755 and State v. Harberts, 331 Or. 72 (2000).",
    helpText: "AI will generate Oregon-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ORS § 135.510, ORS § 135.755 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief citing ORS § 135.510, ORS § 135.755",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (ORS § 135.510, ORS § 135.755) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Oregon.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (22 O.S. § 504.1) in a Oklahoma criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under 22 O.S. § 504.1, a defendant may move to dismiss charges. See State v. Haworth, 1998 OK CR 76.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Oklahoma 22 O.S. § 504.1 motion. Present facts chronologically.",
    helpText: "AI will generate a Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Oklahoma law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Oklahoma law includes:
- 22 O.S. § 504.1: Motion to dismiss
- Okla. Const. Art. II, § 20: Constitutional protections
- State v. Haworth, 1998 OK CR 76: Key precedent

Generate 3-5 paragraphs applying Oklahoma constitutional and statutory standards.`,
    aiInstructions: "Must cite 22 O.S. § 504.1 and State v. Haworth, 1998 OK CR 76.",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 22 O.S. § 504.1 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief citing 22 O.S. § 504.1",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (22 O.S. § 504.1) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Oklahoma.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., HHD-CR-XX-XXXXXXX-S" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Conn. Gen. Stat. § 54-56) in a Connecticut criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Conn. Gen. Stat. § 54-56, a defendant may move to dismiss charges. See State v. Golding, 213 Conn. 233 (1989).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Connecticut Conn. Gen. Stat. § 54-56 motion. Present facts chronologically.",
    helpText: "AI will generate a Connecticut-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Connecticut law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Connecticut law includes:
- Conn. Gen. Stat. § 54-56: Motion to dismiss
- Conn. Const. Art. I, § 8: Constitutional protections
- State v. Golding, 213 Conn. 233 (1989): Key precedent

Generate 3-5 paragraphs applying Connecticut constitutional and statutory standards.`,
    aiInstructions: "Must cite Conn. Gen. Stat. § 54-56 and State v. Golding, 213 Conn. 233 (1989).",
    helpText: "AI will generate Connecticut-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Conn. Gen. Stat. § 54-56 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Connecticut prayer for relief citing Conn. Gen. Stat. § 54-56",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF CONNECTICUT, JUDICIAL DISTRICT OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Conn. Gen. Stat. § 54-56) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Connecticut.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Second Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Second Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXXXXXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Utah R. Crim. P. 12, Utah Code § 77-8a-1) in a Utah criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Utah R. Crim. P. 12, Utah Code § 77-8a-1, a defendant may move to dismiss charges. See State v. Tiedemann, 2007 UT 49.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Utah Utah R. Crim. P. 12, Utah Code § 77-8a-1 motion. Present facts chronologically.",
    helpText: "AI will generate a Utah-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Utah law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Utah law includes:
- Utah R. Crim. P. 12, Utah Code § 77-8a-1: Motion to dismiss
- Utah Const. Art. I, § 12: Constitutional protections
- State v. Tiedemann, 2007 UT 49: Key precedent

Generate 3-5 paragraphs applying Utah constitutional and statutory standards.`,
    aiInstructions: "Must cite Utah R. Crim. P. 12, Utah Code § 77-8a-1 and State v. Tiedemann, 2007 UT 49.",
    helpText: "AI will generate Utah-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Utah R. Crim. P. 12, Utah Code § 77-8a-1 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Utah prayer for relief citing Utah R. Crim. P. 12, Utah Code § 77-8a-1",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Utah R. Crim. P. 12, Utah Code § 77-8a-1) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Utah.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Iowa R. Crim. P. 2.11(6)) in a Iowa criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Iowa R. Crim. P. 2.11(6), a defendant may move to dismiss charges. See State v. Petersen, 288 N.W.2d 332 (Iowa 1980).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Iowa Iowa R. Crim. P. 2.11(6) motion. Present facts chronologically.",
    helpText: "AI will generate a Iowa-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Iowa law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Iowa law includes:
- Iowa R. Crim. P. 2.11(6): Motion to dismiss
- Iowa Const. Art. I, § 9: Constitutional protections
- State v. Petersen, 288 N.W.2d 332 (Iowa 1980): Key precedent

Generate 3-5 paragraphs applying Iowa constitutional and statutory standards.`,
    aiInstructions: "Must cite Iowa R. Crim. P. 2.11(6) and State v. Petersen, 288 N.W.2d 332 (Iowa 1980).",
    helpText: "AI will generate Iowa-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Iowa R. Crim. P. 2.11(6) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Iowa prayer for relief citing Iowa R. Crim. P. 2.11(6)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Iowa R. Crim. P. 2.11(6)) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Iowa.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., C-XX-XXXXXX-X" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (NRS § 174.075, NRS § 178.554) in a Nevada criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under NRS § 174.075, NRS § 178.554, a defendant may move to dismiss charges. See Sheriff v. Burdg, 118 Nev. 853 (2002).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Nevada NRS § 174.075, NRS § 178.554 motion. Present facts chronologically.",
    helpText: "AI will generate a Nevada-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Nevada law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Nevada law includes:
- NRS § 174.075, NRS § 178.554: Motion to dismiss
- Nev. Const. Art. I, § 8: Constitutional protections
- Sheriff v. Burdg, 118 Nev. 853 (2002): Key precedent

Generate 3-5 paragraphs applying Nevada constitutional and statutory standards.`,
    aiInstructions: "Must cite NRS § 174.075, NRS § 178.554 and Sheriff v. Burdg, 118 Nev. 853 (2002).",
    helpText: "AI will generate Nevada-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NRS § 174.075, NRS § 178.554 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nevada prayer for relief citing NRS § 174.075, NRS § 178.554",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (NRS § 174.075, NRS § 178.554) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Nevada.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Ark. R. Crim. P. 10.1) in a Arkansas criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Ark. R. Crim. P. 10.1, a defendant may move to dismiss charges. See State v. J.F.S., 366 Ark. 394 (2006).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Arkansas Ark. R. Crim. P. 10.1 motion. Present facts chronologically.",
    helpText: "AI will generate a Arkansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Arkansas law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Arkansas law includes:
- Ark. R. Crim. P. 10.1: Motion to dismiss
- Ark. Const. Art. II, § 8: Constitutional protections
- State v. J.F.S., 366 Ark. 394 (2006): Key precedent

Generate 3-5 paragraphs applying Arkansas constitutional and statutory standards.`,
    aiInstructions: "Must cite Ark. R. Crim. P. 10.1 and State v. J.F.S., 366 Ark. 394 (2006).",
    helpText: "AI will generate Arkansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ark. R. Crim. P. 10.1 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arkansas prayer for relief citing Ark. R. Crim. P. 10.1",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Ark. R. Crim. P. 10.1) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Arkansas.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXXX-XXXX-CRXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Miss. Code Ann. § 99-15-1) in a Mississippi criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Miss. Code Ann. § 99-15-1, a defendant may move to dismiss charges. See Smith v. State, 733 So. 2d 793 (Miss. 1999).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Mississippi Miss. Code Ann. § 99-15-1 motion. Present facts chronologically.",
    helpText: "AI will generate a Mississippi-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Mississippi law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Mississippi law includes:
- Miss. Code Ann. § 99-15-1: Motion to dismiss
- Miss. Const. Art. III, § 14: Constitutional protections
- Smith v. State, 733 So. 2d 793 (Miss. 1999): Key precedent

Generate 3-5 paragraphs applying Mississippi constitutional and statutory standards.`,
    aiInstructions: "Must cite Miss. Code Ann. § 99-15-1 and Smith v. State, 733 So. 2d 793 (Miss. 1999).",
    helpText: "AI will generate Mississippi-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Miss. Code Ann. § 99-15-1 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Mississippi prayer for relief citing Miss. Code Ann. § 99-15-1",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Miss. Code Ann. § 99-15-1) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Mississippi.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fifth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fifth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
];

const kansasSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (K.S.A. § 22-3208) in a Kansas criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under K.S.A. § 22-3208, a defendant may move to dismiss charges. See State v. Moralez, 297 Kan. 397 (2013).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Kansas K.S.A. § 22-3208 motion. Present facts chronologically.",
    helpText: "AI will generate a Kansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Kansas law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Kansas law includes:
- K.S.A. § 22-3208: Motion to dismiss
- Kan. Const. Bill of Rights, § 10: Constitutional protections
- State v. Moralez, 297 Kan. 397 (2013): Key precedent

Generate 3-5 paragraphs applying Kansas constitutional and statutory standards.`,
    aiInstructions: "Must cite K.S.A. § 22-3208 and State v. Moralez, 297 Kan. 397 (2013).",
    helpText: "AI will generate Kansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to K.S.A. § 22-3208 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kansas prayer for relief citing K.S.A. § 22-3208",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (K.S.A. § 22-3208) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Kansas.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (NMSA § 31-6-1, N.M. R. Crim. P. 5-601) in a New Mexico criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under NMSA § 31-6-1, N.M. R. Crim. P. 5-601, a defendant may move to dismiss charges. See State v. Rojo, 1999-NMSC-001.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Mexico NMSA § 31-6-1, N.M. R. Crim. P. 5-601 motion. Present facts chronologically.",
    helpText: "AI will generate a New Mexico-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under New Mexico law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable New Mexico law includes:
- NMSA § 31-6-1, N.M. R. Crim. P. 5-601: Motion to dismiss
- N.M. Const. Art. II, § 18: Constitutional protections
- State v. Rojo, 1999-NMSC-001: Key precedent

Generate 3-5 paragraphs applying New Mexico constitutional and statutory standards.`,
    aiInstructions: "Must cite NMSA § 31-6-1, N.M. R. Crim. P. 5-601 and State v. Rojo, 1999-NMSC-001.",
    helpText: "AI will generate New Mexico-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NMSA § 31-6-1, N.M. R. Crim. P. 5-601 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Mexico prayer for relief citing NMSA § 31-6-1, N.M. R. Crim. P. 5-601",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (NMSA § 31-6-1, N.M. R. Crim. P. 5-601) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of New Mexico.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Neb. Rev. Stat. § 29-1817) in a Nebraska criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Neb. Rev. Stat. § 29-1817, a defendant may move to dismiss charges. See State v. Poe, 248 Neb. 309 (1995).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Nebraska Neb. Rev. Stat. § 29-1817 motion. Present facts chronologically.",
    helpText: "AI will generate a Nebraska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Nebraska law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Nebraska law includes:
- Neb. Rev. Stat. § 29-1817: Motion to dismiss
- Neb. Const. Art. I, § 7: Constitutional protections
- State v. Poe, 248 Neb. 309 (1995): Key precedent

Generate 3-5 paragraphs applying Nebraska constitutional and statutory standards.`,
    aiInstructions: "Must cite Neb. Rev. Stat. § 29-1817 and State v. Poe, 248 Neb. 309 (1995).",
    helpText: "AI will generate Nebraska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Neb. Rev. Stat. § 29-1817 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nebraska prayer for relief citing Neb. Rev. Stat. § 29-1817",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Neb. Rev. Stat. § 29-1817) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Nebraska.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Idaho Code § 19-3501, I.C.R. 12) in a Idaho criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Idaho Code § 19-3501, I.C.R. 12, a defendant may move to dismiss charges. See State v. Clark, 115 Idaho 1056 (Ct. App. 1989).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Idaho Idaho Code § 19-3501, I.C.R. 12 motion. Present facts chronologically.",
    helpText: "AI will generate a Idaho-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Idaho law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Idaho law includes:
- Idaho Code § 19-3501, I.C.R. 12: Motion to dismiss
- Idaho Const. Art. I, § 13: Constitutional protections
- State v. Clark, 115 Idaho 1056 (Ct. App. 1989): Key precedent

Generate 3-5 paragraphs applying Idaho constitutional and statutory standards.`,
    aiInstructions: "Must cite Idaho Code § 19-3501, I.C.R. 12 and State v. Clark, 115 Idaho 1056 (Ct. App. 1989).",
    helpText: "AI will generate Idaho-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Idaho Code § 19-3501, I.C.R. 12 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Idaho prayer for relief citing Idaho Code § 19-3501, I.C.R. 12",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Idaho Code § 19-3501, I.C.R. 12) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Idaho.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Alaska R. Crim. P. 12(b), AS § 12.10) in a Alaska criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Alaska R. Crim. P. 12(b), AS § 12.10, a defendant may move to dismiss charges. See Anderson v. State, 438 P.3d 672 (Alaska 2019).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Alaska Alaska R. Crim. P. 12(b), AS § 12.10 motion. Present facts chronologically.",
    helpText: "AI will generate a Alaska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Alaska law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Alaska law includes:
- Alaska R. Crim. P. 12(b), AS § 12.10: Motion to dismiss
- Alaska Const. Art. I, § 7: Constitutional protections
- Anderson v. State, 438 P.3d 672 (Alaska 2019): Key precedent

Generate 3-5 paragraphs applying Alaska constitutional and statutory standards.`,
    aiInstructions: "Must cite Alaska R. Crim. P. 12(b), AS § 12.10 and Anderson v. State, 438 P.3d 672 (Alaska 2019).",
    helpText: "AI will generate Alaska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Alaska R. Crim. P. 12(b), AS § 12.10 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alaska prayer for relief citing Alaska R. Crim. P. 12(b), AS § 12.10",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF ALASKA, JUDICIAL DISTRICT OF ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Alaska R. Crim. P. 12(b), AS § 12.10) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Alaska.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., Superior Court of Delaware, New Castle County" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Del. Super. Ct. Crim. R. 12(b)) in a Delaware criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Del. Super. Ct. Crim. R. 12(b), a defendant may move to dismiss charges. See State v. Walker, 780 A.2d 1087 (Del. Super. 2001).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Delaware Del. Super. Ct. Crim. R. 12(b) motion. Present facts chronologically.",
    helpText: "AI will generate a Delaware-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Delaware law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Delaware law includes:
- Del. Super. Ct. Crim. R. 12(b): Motion to dismiss
- Del. Const. Art. I, § 7: Constitutional protections
- State v. Walker, 780 A.2d 1087 (Del. Super. 2001): Key precedent

Generate 3-5 paragraphs applying Delaware constitutional and statutory standards.`,
    aiInstructions: "Must cite Del. Super. Ct. Crim. R. 12(b) and State v. Walker, 780 A.2d 1087 (Del. Super. 2001).",
    helpText: "AI will generate Delaware-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Del. Super. Ct. Crim. R. 12(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Delaware prayer for relief citing Del. Super. Ct. Crim. R. 12(b)",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Del. Super. Ct. Crim. R. 12(b)) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via File & ServeXpress to the email address(es) of record.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Delaware.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Third Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Third Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., Circuit Court of the First Circuit, State of Hawaii" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XCXX-X-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (HRPP Rule 12(b), HRS § 701-108) in a Hawaii criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under HRPP Rule 12(b), HRS § 701-108, a defendant may move to dismiss charges. See State v. Moriwake, 65 Haw. 47 (1982).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Hawaii HRPP Rule 12(b), HRS § 701-108 motion. Present facts chronologically.",
    helpText: "AI will generate a Hawaii-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Hawaii law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Hawaii law includes:
- HRPP Rule 12(b), HRS § 701-108: Motion to dismiss
- Haw. Const. Art. I, § 5: Constitutional protections
- State v. Moriwake, 65 Haw. 47 (1982): Key precedent

Generate 3-5 paragraphs applying Hawaii constitutional and statutory standards.`,
    aiInstructions: "Must cite HRPP Rule 12(b), HRS § 701-108 and State v. Moriwake, 65 Haw. 47 (1982).",
    helpText: "AI will generate Hawaii-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to HRPP Rule 12(b), HRS § 701-108 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Hawaii prayer for relief citing HRPP Rule 12(b), HRS § 701-108",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF HAWAII, CIRCUIT ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (HRPP Rule 12(b), HRS § 701-108) on all parties in this action by the following method:

[ ] BY MAIL: By depositing a true copy in a sealed envelope in the United States Postal Service, with postage prepaid, addressed as indicated below.

[ ] BY PERSONAL SERVICE: By personally delivering a true copy to the person(s) at the address(es) indicated below.

[ ] BY ELECTRONIC SERVICE: By transmitting a true copy via JEFS to the email address(es) of record.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Hawaii.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., CUMCD-CR-XXXX-XXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (M.R.U. Crim. P. 12(b), 15 M.R.S. § 931) in a Maine criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under M.R.U. Crim. P. 12(b), 15 M.R.S. § 931, a defendant may move to dismiss charges. See State v. True, 438 A.2d 460 (Me. 1981).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Maine M.R.U. Crim. P. 12(b), 15 M.R.S. § 931 motion. Present facts chronologically.",
    helpText: "AI will generate a Maine-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Maine law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Maine law includes:
- M.R.U. Crim. P. 12(b), 15 M.R.S. § 931: Motion to dismiss
- Me. Const. Art. I, § 6: Constitutional protections
- State v. True, 438 A.2d 460 (Me. 1981): Key precedent

Generate 3-5 paragraphs applying Maine constitutional and statutory standards.`,
    aiInstructions: "Must cite M.R.U. Crim. P. 12(b), 15 M.R.S. § 931 and State v. True, 438 A.2d 460 (Me. 1981).",
    helpText: "AI will generate Maine-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to M.R.U. Crim. P. 12(b), 15 M.R.S. § 931 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maine prayer for relief citing M.R.U. Crim. P. 12(b), 15 M.R.S. § 931",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (M.R.U. Crim. P. 12(b), 15 M.R.S. § 931) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Maine.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the First Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- First Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., District Court, [Number] Judicial District, [County] County, State of Montana" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (Mont. Code Ann. § 46-13-401, § 46-13-201) in a Montana criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Mont. Code Ann. § 46-13-401, § 46-13-201, a defendant may move to dismiss charges. See State v. Ariegwe, 2007 MT 204.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Montana Mont. Code Ann. § 46-13-401, § 46-13-201 motion. Present facts chronologically.",
    helpText: "AI will generate a Montana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Montana law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Montana law includes:
- Mont. Code Ann. § 46-13-401, § 46-13-201: Motion to dismiss
- Mont. Const. Art. II, § 17: Constitutional protections
- State v. Ariegwe, 2007 MT 204: Key precedent

Generate 3-5 paragraphs applying Montana constitutional and statutory standards.`,
    aiInstructions: "Must cite Mont. Code Ann. § 46-13-401, § 46-13-201 and State v. Ariegwe, 2007 MT 204.",
    helpText: "AI will generate Montana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mont. Code Ann. § 46-13-401, § 46-13-201 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Montana prayer for relief citing Mont. Code Ann. § 46-13-401, § 46-13-201",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (Mont. Code Ann. § 46-13-401, § 46-13-201) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Montana.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Ninth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Ninth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (N.H. Super. Ct. R. 97-A, RSA 625:8) in a New Hampshire criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under N.H. Super. Ct. R. 97-A, RSA 625:8, a defendant may move to dismiss charges. See State v. Veale, 158 N.H. 632 (2009).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a New Hampshire N.H. Super. Ct. R. 97-A, RSA 625:8 motion. Present facts chronologically.",
    helpText: "AI will generate a New Hampshire-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under New Hampshire law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable New Hampshire law includes:
- N.H. Super. Ct. R. 97-A, RSA 625:8: Motion to dismiss
- N.H. Const. Pt. I, Art. 15: Constitutional protections
- State v. Veale, 158 N.H. 632 (2009): Key precedent

Generate 3-5 paragraphs applying New Hampshire constitutional and statutory standards.`,
    aiInstructions: "Must cite N.H. Super. Ct. R. 97-A, RSA 625:8 and State v. Veale, 158 N.H. 632 (2009).",
    helpText: "AI will generate New Hampshire-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.H. Super. Ct. R. 97-A, RSA 625:8 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Hampshire prayer for relief citing N.H. Super. Ct. R. 97-A, RSA 625:8",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (N.H. Super. Ct. R. 97-A, RSA 625:8) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of New Hampshire.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the First Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- First Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (N.D.R.Crim.P. 12(b), NDCC § 29-01-38) in a North Dakota criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under N.D.R.Crim.P. 12(b), NDCC § 29-01-38, a defendant may move to dismiss charges. See State v. Muhle, 2006 ND 65.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a North Dakota N.D.R.Crim.P. 12(b), NDCC § 29-01-38 motion. Present facts chronologically.",
    helpText: "AI will generate a North Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under North Dakota law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable North Dakota law includes:
- N.D.R.Crim.P. 12(b), NDCC § 29-01-38: Motion to dismiss
- N.D. Const. Art. I, § 12: Constitutional protections
- State v. Muhle, 2006 ND 65: Key precedent

Generate 3-5 paragraphs applying North Dakota constitutional and statutory standards.`,
    aiInstructions: "Must cite N.D.R.Crim.P. 12(b), NDCC § 29-01-38 and State v. Muhle, 2006 ND 65.",
    helpText: "AI will generate North Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.D.R.Crim.P. 12(b), NDCC § 29-01-38 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Dakota prayer for relief citing N.D.R.Crim.P. 12(b), NDCC § 29-01-38",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (N.D.R.Crim.P. 12(b), NDCC § 29-01-38) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of North Dakota.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., P2-XXXX-XXXXXA" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7) in a Rhode Island criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7, a defendant may move to dismiss charges. See State v. Byrne, 972 A.2d 633 (R.I. 2009).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Rhode Island R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7 motion. Present facts chronologically.",
    helpText: "AI will generate a Rhode Island-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Rhode Island law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Rhode Island law includes:
- R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7: Motion to dismiss
- R.I. Const. Art. I, § 6: Constitutional protections
- State v. Byrne, 972 A.2d 633 (R.I. 2009): Key precedent

Generate 3-5 paragraphs applying Rhode Island constitutional and statutory standards.`,
    aiInstructions: "Must cite R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7 and State v. Byrne, 972 A.2d 633 (R.I. 2009).",
    helpText: "AI will generate Rhode Island-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Rhode Island prayer for relief citing R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Rhode Island.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the First Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- First Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., Circuit Court, Second Judicial Circuit, Minnehaha County" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (SDCL § 23A-8-3, SDCL § 23A-44-5) in a South Dakota criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under SDCL § 23A-8-3, SDCL § 23A-44-5, a defendant may move to dismiss charges. See State v. Pellegrino, 1998 SD 39.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a South Dakota SDCL § 23A-8-3, SDCL § 23A-44-5 motion. Present facts chronologically.",
    helpText: "AI will generate a South Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under South Dakota law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable South Dakota law includes:
- SDCL § 23A-8-3, SDCL § 23A-44-5: Motion to dismiss
- S.D. Const. Art. VI, § 11: Constitutional protections
- State v. Pellegrino, 1998 SD 39: Key precedent

Generate 3-5 paragraphs applying South Dakota constitutional and statutory standards.`,
    aiInstructions: "Must cite SDCL § 23A-8-3, SDCL § 23A-44-5 and State v. Pellegrino, 1998 SD 39.",
    helpText: "AI will generate South Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to SDCL § 23A-8-3, SDCL § 23A-44-5 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Dakota prayer for relief citing SDCL § 23A-8-3, SDCL § 23A-44-5",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (SDCL § 23A-8-3, SDCL § 23A-44-5) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of South Dakota.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Eighth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Eighth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    ? { ...input, placeholder: "e.g., XXXX-X-XXXX-XXCR" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (V.R.Cr.P. 12(b), 13 V.S.A. § 4501) in a Vermont criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under V.R.Cr.P. 12(b), 13 V.S.A. § 4501, a defendant may move to dismiss charges. See State v. Brillon, 2008 VT 35.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Vermont V.R.Cr.P. 12(b), 13 V.S.A. § 4501 motion. Present facts chronologically.",
    helpText: "AI will generate a Vermont-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Vermont law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Vermont law includes:
- V.R.Cr.P. 12(b), 13 V.S.A. § 4501: Motion to dismiss
- Vt. Const. Ch. I, Art. 10: Constitutional protections
- State v. Brillon, 2008 VT 35: Key precedent

Generate 3-5 paragraphs applying Vermont constitutional and statutory standards.`,
    aiInstructions: "Must cite V.R.Cr.P. 12(b), 13 V.S.A. § 4501 and State v. Brillon, 2008 VT 35.",
    helpText: "AI will generate Vermont-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to V.R.Cr.P. 12(b), 13 V.S.A. § 4501 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Vermont prayer for relief citing V.R.Cr.P. 12(b), 13 V.S.A. § 4501",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

STATE OF VERMONT, UNIT ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (V.R.Cr.P. 12(b), 13 V.S.A. § 4501) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Vermont.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Second Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Second Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21) in a West Virginia criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21, a defendant may move to dismiss charges. See State v. Hinkle, 200 W. Va. 280 (1997).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a West Virginia W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21 motion. Present facts chronologically.",
    helpText: "AI will generate a West Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under West Virginia law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable West Virginia law includes:
- W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21: Motion to dismiss
- W. Va. Const. Art. III, § 10: Constitutional protections
- State v. Hinkle, 200 W. Va. 280 (1997): Key precedent

Generate 3-5 paragraphs applying West Virginia constitutional and statutory standards.`,
    aiInstructions: "Must cite W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21 and State v. Hinkle, 200 W. Va. 280 (1997).",
    helpText: "AI will generate West Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "West Virginia prayer for relief citing W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of West Virginia.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Fourth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Fourth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108) in a Wyoming criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108, a defendant may move to dismiss charges. See Ortiz v. State, 2006 WY 148.

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a Wyoming W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108 motion. Present facts chronologically.",
    helpText: "AI will generate a Wyoming-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under Wyoming law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable Wyoming law includes:
- W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108: Motion to dismiss
- Wyo. Const. Art. I, § 4: Constitutional protections
- Ortiz v. State, 2006 WY 148: Key precedent

Generate 3-5 paragraphs applying Wyoming constitutional and statutory standards.`,
    aiInstructions: "Must cite W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108 and Ortiz v. State, 2006 WY 148.",
    helpText: "AI will generate Wyoming-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wyoming prayer for relief citing W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108",
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

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of Wyoming.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the Tenth Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- Tenth Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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

const dcSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss (D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104) in a District of Columbia criminal matter.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104, a defendant may move to dismiss charges. See Williams v. United States, 102 A.3d 1117 (D.C. 2014).

Generate 3-4 paragraphs that:
1. Set forth the procedural history of the case, including when charges were filed
2. Describe the factual circumstances giving rise to the motion to dismiss
3. Identify the specific deficiency or violation that warrants dismissal
4. Present the timeline of events relevant to the dismissal ground

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal argument — only facts.`,
    aiInstructions: "Generate a factual narrative for a District of Columbia D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104 motion. Present facts chronologically.",
    helpText: "AI will generate a District of Columbia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion to dismiss under District of Columbia law.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable District of Columbia law includes:
- D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104: Motion to dismiss
- Fourth Amendment and D.C. Home Rule Act: Constitutional protections
- Williams v. United States, 102 A.3d 1117 (D.C. 2014): Key precedent

Generate 3-5 paragraphs applying District of Columbia constitutional and statutory standards.`,
    aiInstructions: "Must cite D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104 and Williams v. United States, 102 A.3d 1117 (D.C. 2014).",
    helpText: "AI will generate District of Columbia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104 to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant an evidentiary hearing on this motion;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "District of Columbia prayer for relief citing D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

DISTRICT OF COLUMBIA, WARD ____________________

I, the undersigned, certify that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION TO DISMISS (D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104) on all parties in this action by the following method:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion to dismiss in a federal criminal matter in the District of District of Columbia.

Case Details:
- Ground for Dismissal: {{dismissalGround}}
- Charges Description: {{chargesDescription}}
- Factual Basis: {{factualBasis}}
- Filing Date: {{filingDate}}

Under Federal Rule of Criminal Procedure 12(b)(3)(A), a defendant may move to dismiss charges before trial. Rule 48(b) authorizes dismissal for unnecessary delay.

Generate 3-4 paragraphs presenting facts chronologically.`,
    aiInstructions: "Generate a factual narrative for a federal motion to dismiss.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion to dismiss in the D.C. Circuit.

Ground for Dismissal: {{dismissalGround}}
Charges Description: {{chargesDescription}}
Factual Basis: {{factualBasis}}
Filing Date: {{filingDate}}
Prior Motions to Dismiss: {{priorMotions}}

Applicable federal law includes:
- Federal Rule of Criminal Procedure 12(b)(3)(A): Pre-trial motions to dismiss
- Federal Rule of Criminal Procedure 48(b): Dismissal for unnecessary delay
- Fifth Amendment: Due process protections
- Sixth Amendment: Speedy trial right
- Speedy Trial Act, 18 U.S.C. §§ 3161-3174
- D.C. Circuit precedent on motions to dismiss

Generate 3-5 paragraphs applying federal constitutional standards.`,
    aiInstructions: "Must cite Fed. R. Crim. P. 12(b)(3)(A) and 48(b) and D.C. Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 6,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rule of Criminal Procedure 12(b)(3)(A) and 48(b) to:

1. Dismiss all charges pending against the Defendant with prejudice;

2. Discharge the Defendant from any and all obligations arising from the charges;

3. Order the return of any bond or bail posted;

4. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Federal prayer for relief citing Federal Rules of Criminal Procedure",
  },

  baseSections[6],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 8,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, I served a copy of the foregoing MOTION TO DISMISS on all parties via CM/ECF electronic filing.

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

export const motionToDismissTemplate: DocumentTemplate = {
  id: "motion-to-dismiss",
  name: "Motion to Dismiss",
  category: "criminal",
  description: "A motion to dismiss charges in a criminal case, covering grounds including lack of probable cause, speedy trial violations, defective charging documents, insufficient evidence, prosecutorial misconduct, statute of limitations, double jeopardy, due process violations, and immunity.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-09"),
  baseSections,
  jurisdictionVariants: [
    // California
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "Filed under Cal. Penal Code § 995 (after prelim), § 1385 (interest of justice). Cal. Const. Art. I, § 7 provides constitutional protections. See People v. Konow (2004) 32 Cal.4th 995.",
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
      courtSpecificRules: "Filed under CPL § 170.30, § 210.20. N.Y. Const. Art. I, § 6 provides constitutional protections. See People v. Darienzo, 29 N.Y.3d 929 (2017).",
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
      courtSpecificRules: "Filed under Tex. Code Crim. Proc. Art. 28.01, Art. 32.01 (speedy trial). Tex. Const. Art. I, § 19 provides constitutional protections. See State v. Mungia, 119 S.W.3d 814 (Tex. Crim. App. 2003).",
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
      courtSpecificRules: "Filed under Fla. R. Crim. P. 3.190(c). Fla. Const. Art. I, § 16 provides constitutional protections. See State v. Hand, 399 So.2d 973 (Fla. 1981).",
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
      courtSpecificRules: "Filed under Pa. R. Crim. P. 587. PA Const. Art. I, § 9 provides constitutional protections. See Commonwealth v. Hess, 489 A.2d 868 (Pa. Super. 1985).",
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
      courtSpecificRules: "Filed under 725 ILCS 5/114-1. Ill. Const. Art. I, § 2 provides constitutional protections. See People v. Hughes, 2012 IL 112817.",
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
      courtSpecificRules: "Filed under Ohio Crim. R. 12(C), ORC § 2941.54. Ohio Const. Art. I, § 10 provides constitutional protections. See State v. Busch, 76 Ohio St.3d 613 (1996).",
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
      courtSpecificRules: "Filed under O.C.G.A. § 17-7-110. Ga. Const. Art. I, § I, ¶ I provides constitutional protections. See State v. Kelley, 290 Ga. 29 (2011).",
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
      courtSpecificRules: "Filed under N.C. Gen. Stat. § 15A-954. N.C. Const. Art. I, § 19 provides constitutional protections. See State v. Wilkins, 131 N.C. App. 220 (1998).",
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
      courtSpecificRules: "Filed under MCR 6.110(E). Mich. Const. Art. I, § 17 provides constitutional protections. See People v. Stone, 269 Mich. App. 240 (2005).",
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
      courtSpecificRules: "Filed under N.J. Court R. 3:10-2. N.J. Const. Art. I, ¶ 1 provides constitutional protections. See State v. Hogan, 144 N.J. 216 (1996).",
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
      courtSpecificRules: "Filed under Va. Code § 19.2-265.6. Va. Const. Art. I, § 8 provides constitutional protections. See Commonwealth v. Agee, 272 Va. 456 (2006).",
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
      courtSpecificRules: "Filed under CrR 8.3(b). WA Const. Art. I, § 3 provides constitutional protections. See State v. Michielli, 132 Wn.2d 229 (1997).",
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
      courtSpecificRules: "Filed under Ariz. R. Crim. P. 16.5. Ariz. Const. Art. II, § 4 provides constitutional protections. See State v. Moody, 208 Ariz. 424 (2004).",
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
      courtSpecificRules: "Filed under Mass. R. Crim. P. 13. Mass. Const. Pt. I, Art. XII provides constitutional protections. See Commonwealth v. O'Dell, 392 Mass. 445 (1984).",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "DMA: 12pt font. First Circuit. CM/ECF required.",
    },
    // Tennessee
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Filed under Tenn. R. Crim. P. 12(b). Tenn. Const. Art. I, § 8 provides constitutional protections. See State v. Northington, 667 S.W.2d 57 (Tenn. 1984).",
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
    // Indiana
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Filed under Ind. Code § 35-34-1-4. Ind. Const. Art. I, § 13 provides constitutional protections. See State v. Hicks, 525 N.E.2d 316 (Ind. 1988).",
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
    // Maryland
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Filed under Md. Rule 4-252. Md. Const. Decl. of Rights, Art. 24 provides constitutional protections. See State v. Henson, 44 Md. App. 69 (1979).",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "DMD: 12pt font. Fourth Circuit. CM/ECF required.",
    },
    // Missouri
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Filed under Mo. R. Crim. P. 24.04, RSMo § 545.030. Mo. Const. Art. I, § 18(a) provides constitutional protections. See State v. Love, 134 S.W.3d 55 (Mo. Ct. App. 2004).",
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
    // Wisconsin
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Filed under Wis. Stat. § 971.31. Wis. Const. Art. I, § 8 provides constitutional protections. See State v. Braunsdorf, 98 Wis. 2d 569 (1980).",
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
      courtSpecificRules: "Filed under Colo. R. Crim. P. 48, C.R.S. § 18-1-405. Colo. Const. Art. II, § 16 provides constitutional protections. See People v. Daigle, 2017 COA 30.",
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
      courtSpecificRules: "Filed under Minn. R. Crim. P. 17.06. Minn. Const. Art. I, § 6 provides constitutional protections. See State v. Coates, 807 N.W.2d 208 (Minn. 2011).",
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
      courtSpecificRules: "Filed under S.C. Code Ann. § 17-23-40. S.C. Const. Art. I, § 14 provides constitutional protections. See State v. Bray, 342 S.C. 23 (2000).",
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
      courtSpecificRules: "Filed under Ala. R. Crim. P. 13.5. Ala. Const. Art. I, § 6 provides constitutional protections. See Ex parte McNabb, 887 So. 2d 998 (Ala. 2004).",
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
      courtSpecificRules: "Filed under La. Code Crim. Proc. Art. 532, Art. 534. La. Const. Art. I, § 2 provides constitutional protections. See State v. Byrd, 708 So. 2d 401 (La. 1998).",
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
      courtSpecificRules: "Filed under KRS § 500.110, Ky. R. Crim. P. 8.06. Ky. Const. § 11 provides constitutional protections. See Commonwealth v. Reed, 531 S.W.3d 478 (Ky. 2017).",
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
      courtSpecificRules: "Filed under ORS § 135.510, ORS § 135.755. Or. Const. Art. I, § 12 provides constitutional protections. See State v. Harberts, 331 Or. 72 (2000).",
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
      courtSpecificRules: "Filed under 22 O.S. § 504.1. Okla. Const. Art. II, § 20 provides constitutional protections. See State v. Haworth, 1998 OK CR 76.",
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
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "EDOK: 12pt font. Tenth Circuit. CM/ECF required.",
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
      courtSpecificRules: "Filed under Conn. Gen. Stat. § 54-56. Conn. Const. Art. I, § 8 provides constitutional protections. See State v. Golding, 213 Conn. 233 (1989).",
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
      courtSpecificRules: "Filed under Utah R. Crim. P. 12, Utah Code § 77-8a-1. Utah Const. Art. I, § 12 provides constitutional protections. See State v. Tiedemann, 2007 UT 49.",
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
      courtSpecificRules: "Filed under Iowa R. Crim. P. 2.11(6). Iowa Const. Art. I, § 9 provides constitutional protections. See State v. Petersen, 288 N.W.2d 332 (Iowa 1980).",
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
      courtSpecificRules: "Filed under NRS § 174.075, NRS § 178.554. Nev. Const. Art. I, § 8 provides constitutional protections. See Sheriff v. Burdg, 118 Nev. 853 (2002).",
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
      courtSpecificRules: "Filed under Ark. R. Crim. P. 10.1. Ark. Const. Art. II, § 8 provides constitutional protections. See State v. J.F.S., 366 Ark. 394 (2006).",
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
      courtSpecificRules: "Filed under Miss. Code Ann. § 99-15-1. Miss. Const. Art. III, § 14 provides constitutional protections. See Smith v. State, 733 So. 2d 793 (Miss. 1999).",
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
      courtSpecificRules: "Filed under K.S.A. § 22-3208. Kan. Const. Bill of Rights, § 10 provides constitutional protections. See State v. Moralez, 297 Kan. 397 (2013).",
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
      courtSpecificRules: "Filed under NMSA § 31-6-1, N.M. R. Crim. P. 5-601. N.M. Const. Art. II, § 18 provides constitutional protections. See State v. Rojo, 1999-NMSC-001.",
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
      courtSpecificRules: "Filed under Neb. Rev. Stat. § 29-1817. Neb. Const. Art. I, § 7 provides constitutional protections. See State v. Poe, 248 Neb. 309 (1995).",
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
      courtSpecificRules: "Filed under Idaho Code § 19-3501, I.C.R. 12. Idaho Const. Art. I, § 13 provides constitutional protections. See State v. Clark, 115 Idaho 1056 (Ct. App. 1989).",
    },
    {
      jurisdiction: "ID",
      courtType: "federal",
      district: "DID",
      sections: idFederalSections,
      courtSpecificRules: "DID: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Alaska
    {
      jurisdiction: "AK",
      courtType: "state",
      sections: alaskaSections,
      courtSpecificRules: "Filed under Alaska R. Crim. P. 12(b), AS § 12.10. Alaska Const. Art. I, § 7 provides constitutional protections. See Anderson v. State, 438 P.3d 672 (Alaska 2019).",
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
      courtSpecificRules: "Filed under Del. Super. Ct. Crim. R. 12(b). Del. Const. Art. I, § 7 provides constitutional protections. See State v. Walker, 780 A.2d 1087 (Del. Super. 2001).",
    },
    {
      jurisdiction: "DE",
      courtType: "federal",
      district: "DDE",
      sections: deFederalSections,
      courtSpecificRules: "DDE: 12pt font. Third Circuit. CM/ECF required.",
    },
    // Hawaii
    {
      jurisdiction: "HI",
      courtType: "state",
      sections: hawaiiSections,
      courtSpecificRules: "Filed under HRPP Rule 12(b), HRS § 701-108. Haw. Const. Art. I, § 5 provides constitutional protections. See State v. Moriwake, 65 Haw. 47 (1982).",
    },
    {
      jurisdiction: "HI",
      courtType: "federal",
      district: "DHI",
      sections: hiFederalSections,
      courtSpecificRules: "DHI: 12pt font. Ninth Circuit. CM/ECF required.",
    },
    // Maine
    {
      jurisdiction: "ME",
      courtType: "state",
      sections: maineSections,
      courtSpecificRules: "Filed under M.R.U. Crim. P. 12(b), 15 M.R.S. § 931. Me. Const. Art. I, § 6 provides constitutional protections. See State v. True, 438 A.2d 460 (Me. 1981).",
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
      courtSpecificRules: "Filed under Mont. Code Ann. § 46-13-401, § 46-13-201. Mont. Const. Art. II, § 17 provides constitutional protections. See State v. Ariegwe, 2007 MT 204.",
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
      courtSpecificRules: "Filed under N.H. Super. Ct. R. 97-A, RSA 625:8. N.H. Const. Pt. I, Art. 15 provides constitutional protections. See State v. Veale, 158 N.H. 632 (2009).",
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
      courtSpecificRules: "Filed under N.D.R.Crim.P. 12(b), NDCC § 29-01-38. N.D. Const. Art. I, § 12 provides constitutional protections. See State v. Muhle, 2006 ND 65.",
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
      courtSpecificRules: "Filed under R.I. Super. R. Crim. P. 12(b), R.I. Gen. Laws § 12-12-1.7. R.I. Const. Art. I, § 6 provides constitutional protections. See State v. Byrne, 972 A.2d 633 (R.I. 2009).",
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
      courtSpecificRules: "Filed under SDCL § 23A-8-3, SDCL § 23A-44-5. S.D. Const. Art. VI, § 11 provides constitutional protections. See State v. Pellegrino, 1998 SD 39.",
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
      courtSpecificRules: "Filed under V.R.Cr.P. 12(b), 13 V.S.A. § 4501. Vt. Const. Ch. I, Art. 10 provides constitutional protections. See State v. Brillon, 2008 VT 35.",
    },
    {
      jurisdiction: "VT",
      courtType: "federal",
      district: "DVT",
      sections: vtFederalSections,
      courtSpecificRules: "DVT: 12pt font. Second Circuit. CM/ECF required.",
    },
    // West Virginia
    {
      jurisdiction: "WV",
      courtType: "state",
      sections: westVirginiaSections,
      courtSpecificRules: "Filed under W. Va. R. Crim. P. 12(b), W. Va. Code § 62-3-21. W. Va. Const. Art. III, § 10 provides constitutional protections. See State v. Hinkle, 200 W. Va. 280 (1997).",
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
    // Wyoming
    {
      jurisdiction: "WY",
      courtType: "state",
      sections: wyomingSections,
      courtSpecificRules: "Filed under W.R.Cr.P. 12(b), Wyo. Stat. § 7-1-108. Wyo. Const. Art. I, § 4 provides constitutional protections. See Ortiz v. State, 2006 WY 148.",
    },
    {
      jurisdiction: "WY",
      courtType: "federal",
      district: "DWY",
      sections: wyFederalSections,
      courtSpecificRules: "DWY: 12pt font. Tenth Circuit. CM/ECF required.",
    },
    // District of Columbia
    {
      jurisdiction: "DC",
      courtType: "state",
      sections: dcSections,
      courtSpecificRules: "Filed under D.C. Super. Ct. Crim. R. 12(b), D.C. Code § 23-104. Fourth Amendment and D.C. Home Rule Act provides constitutional protections. See Williams v. United States, 102 A.3d 1117 (D.C. 2014).",
    },
    {
      jurisdiction: "DC",
      courtType: "federal",
      district: "DDC",
      sections: dcFederalSections,
      courtSpecificRules: "DDC: 12pt font. D.C. Circuit. CM/ECF required.",
    },
  ],
  estimatedCompletionTime: "15-20 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS", "NM", "NE", "ID", "AK", "DE", "HI", "ME", "MT", "NH", "ND", "RI", "SD", "VT", "WV", "WY", "DC", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK", "DCT", "DUT", "NDIA", "SDIA", "DNV", "EDAR", "WDAR", "NDMS", "SDMS", "DKS", "DNM", "DNE", "DID", "DAK", "DDE", "DHI", "DME", "DMT", "DNH", "DND", "DRI", "DSD", "DVT", "NDWV", "SDWV", "DWY", "DDC"],
};

export default motionToDismissTemplate;
