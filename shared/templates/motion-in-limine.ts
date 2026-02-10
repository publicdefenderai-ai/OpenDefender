/**
 * Motion in Limine Template
 *
 * Criminal law document template for requesting the court to rule on the
 * admissibility of evidence before trial. Used to exclude prejudicial, irrelevant,
 * or otherwise inadmissible evidence from being presented to the jury.
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

const trialInfoInputs: TemplateInput[] = [
  {
    id: "trialDate",
    label: "Scheduled Trial Date",
    type: "date",
    required: true,
    helpText: "Scheduled trial date",
  },
  {
    id: "trialType",
    label: "Trial Type",
    type: "select",
    required: true,
    helpText: "The type of trial scheduled",
    validation: {
      options: [
        { value: "jury_trial", label: "Jury Trial" },
        { value: "bench_trial", label: "Bench Trial" },
        { value: "preliminary_hearing", label: "Preliminary Hearing" },
      ],
    },
  },
  {
    id: "chargesDescription",
    label: "Current Charges",
    type: "textarea",
    placeholder: "Describe the current charges including statute numbers...",
    required: true,
    helpText: "Current charges",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
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
];

const evidenceToExcludeInputs: TemplateInput[] = [
  {
    id: "evidenceCategory",
    label: "Evidence Category",
    type: "select",
    required: true,
    helpText: "Select the primary category of evidence sought to be excluded",
    validation: {
      options: [
        { value: "character_evidence", label: "Character Evidence" },
        { value: "prior_bad_acts", label: "Prior Bad Acts" },
        { value: "hearsay", label: "Hearsay" },
        { value: "expert_testimony", label: "Expert Testimony" },
        { value: "prejudicial_photos", label: "Prejudicial Photographs" },
        { value: "inflammatory_evidence", label: "Inflammatory Evidence" },
        { value: "privileged_communications", label: "Privileged Communications" },
        { value: "illegally_obtained", label: "Illegally Obtained Evidence" },
        { value: "prior_convictions", label: "Prior Convictions" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "evidenceDescription",
    label: "Description of Evidence to Exclude",
    type: "textarea",
    placeholder: "Describe the specific evidence sought to be excluded...",
    required: true,
    helpText: "Detailed description of the evidence sought to be excluded",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "prejudiceExplanation",
    label: "Prejudice Explanation",
    type: "textarea",
    placeholder: "Explain how this evidence would unfairly prejudice the defendant...",
    required: true,
    helpText: "Explain how this evidence would unfairly prejudice the defendant",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "evidenceRelevance",
    label: "Evidence Relevance",
    type: "select",
    required: true,
    helpText: "The relevance level of the evidence at issue",
    validation: {
      options: [
        { value: "irrelevant", label: "Irrelevant" },
        { value: "marginally_relevant", label: "Marginally Relevant" },
        { value: "relevant_but_prejudicial", label: "Relevant but Prejudicial" },
        { value: "cumulative", label: "Cumulative" },
        { value: "misleading", label: "Misleading" },
      ],
    },
  },
  {
    id: "additionalEvidenceItems",
    label: "Additional Evidence Items",
    type: "textarea",
    placeholder: "Describe any additional evidence items to exclude...",
    required: false,
    helpText: "Any additional evidence items to exclude",
    validation: {
      maxLength: 3000,
    },
  },
];

const legalBasisInputs: TemplateInput[] = [
  {
    id: "primaryRule",
    label: "Primary Evidentiary Rule",
    type: "select",
    required: true,
    helpText: "Select the primary evidentiary rule basis for exclusion",
    validation: {
      options: [
        { value: "rule_401_relevance", label: "Rule 401 - Relevance" },
        { value: "rule_402_relevant_admissible", label: "Rule 402 - Relevant Evidence Admissible" },
        { value: "rule_403_prejudice", label: "Rule 403 - Prejudice vs. Probative Value" },
        { value: "rule_404_character", label: "Rule 404 - Character Evidence" },
        { value: "rule_404b_other_acts", label: "Rule 404(b) - Other Acts" },
        { value: "rule_501_privilege", label: "Rule 501 - Privilege" },
        { value: "rule_602_knowledge", label: "Rule 602 - Lack of Personal Knowledge" },
        { value: "rule_701_lay_opinion", label: "Rule 701 - Lay Opinion" },
        { value: "rule_702_expert", label: "Rule 702 - Expert Testimony" },
        { value: "rule_801_hearsay", label: "Rule 801 - Hearsay" },
        { value: "rule_901_authentication", label: "Rule 901 - Authentication" },
        { value: "state_specific", label: "State-Specific Rule" },
      ],
    },
  },
  {
    id: "legalBasisExplanation",
    label: "Legal Basis Explanation",
    type: "textarea",
    placeholder: "Explain the legal basis for excluding this evidence...",
    required: true,
    helpText: "Explain the legal basis for excluding this evidence",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "prosecutionLikelyArgument",
    label: "Prosecution's Likely Argument",
    type: "textarea",
    placeholder: "Anticipate the prosecution's argument for admitting the evidence...",
    required: false,
    helpText: "Anticipate prosecution's argument for admitting the evidence",
    validation: {
      maxLength: 2000,
    },
  },
  {
    id: "applicableExceptions",
    label: "Applicable Exceptions",
    type: "textarea",
    placeholder: "Any exceptions that might apply and why they don't apply here...",
    required: false,
    helpText: "Any exceptions that might apply and why they don't apply here",
    validation: {
      maxLength: 2000,
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
    id: "trialInfo",
    name: "Trial Information",
    type: "user-input",
    order: 2,
    inputs: trialInfoInputs,
    required: true,
    helpText: "Provide trial scheduling and charge information",
  },
  {
    id: "evidenceToExclude",
    name: "Evidence to Exclude",
    type: "user-input",
    order: 3,
    inputs: evidenceToExcludeInputs,
    required: true,
    helpText: "Describe the evidence sought to be excluded",
  },
  {
    id: "legalBasis",
    name: "Legal Basis",
    type: "user-input",
    order: 4,
    inputs: legalBasisInputs,
    required: true,
    helpText: "Identify the legal grounds for exclusion",
  },
  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative. Do not include legal citations or argument. Present facts chronologically.",
    helpText: "AI will generate a statement of facts based on your inputs",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine in a criminal matter.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard for admissibility under the Federal Rules of Evidence
2. Explain why the evidence fails the admissibility test under the applicable rule
3. Conduct a Rule 403 balancing analysis, showing that the danger of unfair prejudice substantially outweighs the probative value
4. Address the prosecution's likely counterarguments for admitting the evidence
5. Explain why exclusion is necessary to protect the Defendant's right to a fair trial
6. Conclude with a summary of why the court should grant the motion

Use formal legal writing style with proper citations. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Include relevant FRE citations, Daubert v. Merrell Dow Pharmaceuticals, Inc., 509 U.S. 579 (1993), Old Chief v. United States, 519 U.S. 172 (1997), and applicable state evidentiary rules.",
    helpText: "AI will generate legal arguments with citations appropriate for your jurisdiction",
  },
  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully requests that this Honorable Court:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Standard prayer for relief for motions in limine",
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

I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. On the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties in this action by:

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
  baseSections[3],
];

const californiaSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a California criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under California Evidence Code §§ 350-352, the court must evaluate the admissibility of evidence prior to trial. Cal. Const. Art. I, § 28(d) provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a California motion in limine. Present facts chronologically.",
    helpText: "AI will generate a California-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under California Evidence Code §§ 350-352.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable California law includes:
- California Evidence Code §§ 350-352
- Cal. Const. Art. I, § 28(d)
- People v. Kelly

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under California Evidence Code §§ 350-352
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable California case law

Use proper California legal citation format.`,
    aiInstructions: "Must cite California Evidence Code §§ 350-352, People v. Kelly, and applicable California evidentiary rules. Use California citation format.",
    helpText: "AI will generate California-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to California Evidence Code §§ 350-352 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to California Evidence Code §§ 350-352 and Cal. Const. Art. I, § 28(d);

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "California prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF CALIFORNIA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "California-specific certificate of service format",
  },
];

const caFederalSections: TemplateSection[] = [
  ...caBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of California.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
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
  baseSections[3],
];

const newYorkSections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a New York criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under CPL Article 710; N.Y. CPLR 3211, the court must evaluate the admissibility of evidence prior to trial. N.Y. Const. Art. I, § 6 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a New York motion in limine. Present facts chronologically.",
    helpText: "AI will generate a New York-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under CPL Article 710; N.Y. CPLR 3211.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable New York law includes:
- CPL Article 710; N.Y. CPLR 3211
- N.Y. Const. Art. I, § 6
- People v. Molineux, 168 N.Y. 264 (1901)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under CPL Article 710; N.Y. CPLR 3211
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable New York case law

Use proper New York legal citation format.`,
    aiInstructions: "Must cite CPL Article 710; N.Y. CPLR 3211, People v. Molineux, 168 N.Y. 264 (1901), and applicable New York evidentiary rules. Use New York citation format.",
    helpText: "AI will generate New York-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CPL Article 710; N.Y. CPLR 3211 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to CPL Article 710; N.Y. CPLR 3211 and N.Y. Const. Art. I, § 6;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New York prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW YORK
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New York-specific certificate of service format",
  },
];

const nyFederalSections: TemplateSection[] = [
  ...nyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of New York.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Second Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Second Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Texas Sections
// ============================================================================

const txCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Texas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
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
];

const texasSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Texas criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Texas Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial. Tex. Const. Art. I, § 19 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Texas motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Texas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Texas Rules of Evidence 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Texas law includes:
- Texas Rules of Evidence 401-403
- Tex. Const. Art. I, § 19
- Montgomery v. State, 810 S.W.2d 372 (Tex. Crim. App. 1991)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Texas Rules of Evidence 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Texas case law

Use proper Texas legal citation format.`,
    aiInstructions: "Must cite Texas Rules of Evidence 401-403, Montgomery v. State, 810 S.W.2d 372 (Tex. Crim. App. 1991), and applicable Texas evidentiary rules. Use Texas citation format.",
    helpText: "AI will generate Texas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Texas Rules of Evidence 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Texas Rules of Evidence 401-403 and Tex. Const. Art. I, § 19;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Texas prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF TEXAS
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Texas-specific certificate of service format",
  },
];

const txFederalSections: TemplateSection[] = [
  ...txBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Texas.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fifth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fifth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Florida Sections
// ============================================================================

const flCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the [N]th Judicial Circuit, [County] County, Florida" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXXXX" }
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
];

const floridaSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Florida criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Florida Statute § 90.403, the court must evaluate the admissibility of evidence prior to trial. Fla. Const. Art. I, § 12 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Florida motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Florida-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Florida Statute § 90.403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Florida law includes:
- Florida Statute § 90.403
- Fla. Const. Art. I, § 12
- Straight v. State, 397 So. 2d 903 (Fla. 1981)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Florida Statute § 90.403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Florida case law

Use proper Florida legal citation format.`,
    aiInstructions: "Must cite Florida Statute § 90.403, Straight v. State, 397 So. 2d 903 (Fla. 1981), and applicable Florida evidentiary rules. Use Florida citation format.",
    helpText: "AI will generate Florida-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Florida Statute § 90.403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Florida Statute § 90.403 and Fla. Const. Art. I, § 12;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Florida prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF FLORIDA
c/o State Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Florida-specific certificate of service format",
  },
];

const flFederalSections: TemplateSection[] = [
  ...flBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Florida.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eleventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eleventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Pennsylvania Sections
// ============================================================================

const paCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, [County] County, Pennsylvania" }
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
  baseSections[3],
];

const pennsylvaniaSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Pennsylvania criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Pa.R.E. 401-404, the court must evaluate the admissibility of evidence prior to trial. Pa. Const. Art. I, § 8 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Pennsylvania motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Pennsylvania-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Pa.R.E. 401-404.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Pennsylvania law includes:
- Pa.R.E. 401-404
- Pa. Const. Art. I, § 8
- Commonwealth v. Lark, 543 A.2d 491 (Pa. 1988)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Pa.R.E. 401-404
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Pennsylvania case law

Use proper Pennsylvania legal citation format.`,
    aiInstructions: "Must cite Pa.R.E. 401-404, Commonwealth v. Lark, 543 A.2d 491 (Pa. 1988), and applicable Pennsylvania evidentiary rules. Use Pennsylvania citation format.",
    helpText: "AI will generate Pennsylvania-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Pa.R.E. 401-404 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Pa.R.E. 401-404 and Pa. Const. Art. I, § 8;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Pennsylvania prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF PENNSYLVANIA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Pennsylvania-specific certificate of service format",
  },
];

const paFederalSections: TemplateSection[] = [
  ...paBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Pennsylvania.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Third Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Third Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Illinois Sections
// ============================================================================

const ilCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Illinois" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CF-XXXXXX" }
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
];

const illinoisSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Illinois criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Illinois Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial. Ill. Const. Art. I, § 6 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Illinois motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Illinois-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Illinois Rules of Evidence 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Illinois law includes:
- Illinois Rules of Evidence 401-403
- Ill. Const. Art. I, § 6
- People v. Lynch, 104 Ill. 2d 194 (1984)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Illinois Rules of Evidence 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Illinois case law

Use proper Illinois legal citation format.`,
    aiInstructions: "Must cite Illinois Rules of Evidence 401-403, People v. Lynch, 104 Ill. 2d 194 (1984), and applicable Illinois evidentiary rules. Use Illinois citation format.",
    helpText: "AI will generate Illinois-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Illinois Rules of Evidence 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Illinois Rules of Evidence 401-403 and Ill. Const. Art. I, § 6;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Illinois prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ILLINOIS
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Illinois-specific certificate of service format",
  },
];

const ilFederalSections: TemplateSection[] = [
  ...ilBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Illinois.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Seventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Seventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Ohio Sections
// ============================================================================

const ohCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of Common Pleas, [County] County, Ohio" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX CR XXXXXX" }
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
];

const ohioSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Ohio criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Ohio Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial. Ohio Const. Art. I, § 14 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Ohio motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Ohio-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Ohio Rules of Evidence 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Ohio law includes:
- Ohio Rules of Evidence 401-403
- Ohio Const. Art. I, § 14
- State v. Hartman, 93 Ohio St.3d 274 (2001)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Ohio Rules of Evidence 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Ohio case law

Use proper Ohio legal citation format.`,
    aiInstructions: "Must cite Ohio Rules of Evidence 401-403, State v. Hartman, 93 Ohio St.3d 274 (2001), and applicable Ohio evidentiary rules. Use Ohio citation format.",
    helpText: "AI will generate Ohio-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ohio Rules of Evidence 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Ohio Rules of Evidence 401-403 and Ohio Const. Art. I, § 14;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Ohio prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF OHIO
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Ohio-specific certificate of service format",
  },
];

const ohFederalSections: TemplateSection[] = [
  ...ohBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Ohio.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Sixth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Sixth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Georgia Sections
// ============================================================================

const gaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of [County] County, Georgia" }
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
  baseSections[3],
];

const georgiaSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Georgia criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under O.C.G.A. § 24-4-403, the court must evaluate the admissibility of evidence prior to trial. Ga. Const. Art. I, § I, Para. XIII provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Georgia motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Georgia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under O.C.G.A. § 24-4-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Georgia law includes:
- O.C.G.A. § 24-4-403
- Ga. Const. Art. I, § I, Para. XIII
- Olds v. State, 299 Ga. 65 (2016)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under O.C.G.A. § 24-4-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Georgia case law

Use proper Georgia legal citation format.`,
    aiInstructions: "Must cite O.C.G.A. § 24-4-403, Olds v. State, 299 Ga. 65 (2016), and applicable Georgia evidentiary rules. Use Georgia citation format.",
    helpText: "AI will generate Georgia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to O.C.G.A. § 24-4-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to O.C.G.A. § 24-4-403 and Ga. Const. Art. I, § I, Para. XIII;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Georgia prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF GEORGIA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Georgia-specific certificate of service format",
  },
];

const gaFederalSections: TemplateSection[] = [
  ...gaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Georgia.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eleventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eleventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Carolina Sections
// ============================================================================

const ncCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, North Carolina" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX CRS XXXXXX" }
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
];

const northCarolinaSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a North Carolina criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under N.C.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. N.C. Const. Art. I, § 19 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a North Carolina motion in limine. Present facts chronologically.",
    helpText: "AI will generate a North Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under N.C.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable North Carolina law includes:
- N.C.R.E. 401-403
- N.C. Const. Art. I, § 19
- State v. Beckelheimer, 366 N.C. 127 (2012)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under N.C.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable North Carolina case law

Use proper North Carolina legal citation format.`,
    aiInstructions: "Must cite N.C.R.E. 401-403, State v. Beckelheimer, 366 N.C. 127 (2012), and applicable North Carolina evidentiary rules. Use North Carolina citation format.",
    helpText: "AI will generate North Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.C.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to N.C.R.E. 401-403 and N.C. Const. Art. I, § 19;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Carolina prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NORTH CAROLINA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "North Carolina-specific certificate of service format",
  },
];

const ncFederalSections: TemplateSection[] = [
  ...ncBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of North Carolina.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fourth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fourth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Michigan Sections
// ============================================================================

const miCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [County] County, Michigan" }
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
  baseSections[3],
];

const michiganSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Michigan criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under MRE 401-403, the court must evaluate the admissibility of evidence prior to trial. Mich. Const. Art. I, § 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Michigan motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Michigan-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under MRE 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Michigan law includes:
- MRE 401-403
- Mich. Const. Art. I, § 11
- People v. Crawford, 458 Mich. 376 (1998)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under MRE 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Michigan case law

Use proper Michigan legal citation format.`,
    aiInstructions: "Must cite MRE 401-403, People v. Crawford, 458 Mich. 376 (1998), and applicable Michigan evidentiary rules. Use Michigan citation format.",
    helpText: "AI will generate Michigan-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to MRE 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to MRE 401-403 and Mich. Const. Art. I, § 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Michigan prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MICHIGAN
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Michigan-specific certificate of service format",
  },
];

const miFederalSections: TemplateSection[] = [
  ...miBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Michigan.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Sixth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Sixth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Jersey Sections
// ============================================================================

const njCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of New Jersey, [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XX-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a New Jersey criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under N.J.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. N.J. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a New Jersey motion in limine. Present facts chronologically.",
    helpText: "AI will generate a New Jersey-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under N.J.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable New Jersey law includes:
- N.J.R.E. 401-403
- N.J. Const. Art. I, § 7
- State v. Cofield, 127 N.J. 328 (1992)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under N.J.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable New Jersey case law

Use proper New Jersey legal citation format.`,
    aiInstructions: "Must cite N.J.R.E. 401-403, State v. Cofield, 127 N.J. 328 (1992), and applicable New Jersey evidentiary rules. Use New Jersey citation format.",
    helpText: "AI will generate New Jersey-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.J.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to N.J.R.E. 401-403 and N.J. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Jersey prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW JERSEY
c/o Prosecutor
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.N.J..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Third Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Third Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
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
    ? { ...input, placeholder: "e.g., Circuit Court of [City/County], Virginia" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Virginia criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Va. Code § 8.01-401, the court must evaluate the admissibility of evidence prior to trial. Va. Const. Art. I, § 10 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Virginia motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Va. Code § 8.01-401.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Virginia law includes:
- Va. Code § 8.01-401
- Va. Const. Art. I, § 10
- Spencer v. Commonwealth, 238 Va. 275 (1989)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Va. Code § 8.01-401
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Virginia case law

Use proper Virginia legal citation format.`,
    aiInstructions: "Must cite Va. Code § 8.01-401, Spencer v. Commonwealth, 238 Va. 275 (1989), and applicable Virginia evidentiary rules. Use Virginia citation format.",
    helpText: "AI will generate Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Va. Code § 8.01-401 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Va. Code § 8.01-401 and Va. Const. Art. I, § 10;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Virginia prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF VIRGINIA
c/o Commonwealth's Attorney
________________________________

Dated: _______________

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Virginia.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fourth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fourth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Superior Court of Washington, [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XXXXXX-XX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Washington criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under ER 401-403, the court must evaluate the admissibility of evidence prior to trial. Wash. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Washington motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Washington-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under ER 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Washington law includes:
- ER 401-403
- Wash. Const. Art. I, § 7
- State v. Foxhoven, 161 Wash.2d 168 (2007)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under ER 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Washington case law

Use proper Washington legal citation format.`,
    aiInstructions: "Must cite ER 401-403, State v. Foxhoven, 161 Wash.2d 168 (2007), and applicable Washington evidentiary rules. Use Washington citation format.",
    helpText: "AI will generate Washington-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to ER 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to ER 401-403 and Wash. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Washington prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Washington.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Superior Court of Arizona, [County] County" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Arizona criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under A.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. Ariz. Const. Art. II, § 8 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Arizona motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Arizona-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under A.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Arizona law includes:
- A.R.E. 401-403
- Ariz. Const. Art. II, § 8
- State v. Mott, 187 Ariz. 536 (1997)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under A.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Arizona case law

Use proper Arizona legal citation format.`,
    aiInstructions: "Must cite A.R.E. 401-403, State v. Mott, 187 Ariz. 536 (1997), and applicable Arizona evidentiary rules. Use Arizona citation format.",
    helpText: "AI will generate Arizona-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to A.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to A.R.E. 401-403 and Ariz. Const. Art. II, § 8;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arizona prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Ariz..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, Massachusetts" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Massachusetts criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Mass. Guide to Evidence § 403, the court must evaluate the admissibility of evidence prior to trial. Mass. Const. Part I, Art. XIV provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Massachusetts motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Massachusetts-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Mass. Guide to Evidence § 403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Massachusetts law includes:
- Mass. Guide to Evidence § 403
- Mass. Const. Part I, Art. XIV
- Commonwealth v. Crayton, 470 Mass. 228 (2014)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Mass. Guide to Evidence § 403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Massachusetts case law

Use proper Massachusetts legal citation format.`,
    aiInstructions: "Must cite Mass. Guide to Evidence § 403, Commonwealth v. Crayton, 470 Mass. 228 (2014), and applicable Massachusetts evidentiary rules. Use Massachusetts citation format.",
    helpText: "AI will generate Massachusetts-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mass. Guide to Evidence § 403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Mass. Guide to Evidence § 403 and Mass. Const. Part I, Art. XIV;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Massachusetts prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MASSACHUSETTS
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Mass..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with First Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with First Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Criminal Court, [County] County, Tennessee" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Tennessee criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Tenn. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Tenn. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Tennessee motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Tennessee-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Tenn. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Tennessee law includes:
- Tenn. R. Evid. 401-403
- Tenn. Const. Art. I, § 7
- State v. James, 81 S.W.3d 751 (Tenn. 2002)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Tenn. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Tennessee case law

Use proper Tennessee legal citation format.`,
    aiInstructions: "Must cite Tenn. R. Evid. 401-403, State v. James, 81 S.W.3d 751 (Tenn. 2002), and applicable Tennessee evidentiary rules. Use Tennessee citation format.",
    helpText: "AI will generate Tennessee-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Tenn. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Tenn. R. Evid. 401-403 and Tenn. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Tennessee prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Tennessee.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Sixth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Sixth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, Indiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XX-XX-XXXXXX-XX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Indiana criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Ind. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Ind. Const. Art. I, § 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Indiana motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Indiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Ind. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Indiana law includes:
- Ind. R. Evid. 401-403
- Ind. Const. Art. I, § 11
- Angleton v. State, 686 N.E.2d 803 (Ind. 1997)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Ind. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Indiana case law

Use proper Indiana legal citation format.`,
    aiInstructions: "Must cite Ind. R. Evid. 401-403, Angleton v. State, 686 N.E.2d 803 (Ind. 1997), and applicable Indiana evidentiary rules. Use Indiana citation format.",
    helpText: "AI will generate Indiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ind. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Ind. R. Evid. 401-403 and Ind. Const. Art. I, § 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Indiana prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Indiana.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Seventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Seventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

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
    ? { ...input, placeholder: "e.g., Circuit Court for [County] County, Maryland" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-K-XX-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Maryland criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Md. Rule 5-403, the court must evaluate the admissibility of evidence prior to trial. Md. Const. Decl. of Rights Art. 26 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Maryland motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Maryland-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Md. Rule 5-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Maryland law includes:
- Md. Rule 5-403
- Md. Const. Decl. of Rights Art. 26
- Merzbacher v. State, 346 Md. 391 (1997)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Md. Rule 5-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Maryland case law

Use proper Maryland legal citation format.`,
    aiInstructions: "Must cite Md. Rule 5-403, Merzbacher v. State, 346 Md. 391 (1997), and applicable Maryland evidentiary rules. Use Maryland citation format.",
    helpText: "AI will generate Maryland-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Md. Rule 5-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Md. Rule 5-403 and Md. Const. Decl. of Rights Art. 26;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maryland prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Md..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fourth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fourth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Missouri Sections
// ============================================================================

const moCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Missouri" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Missouri criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Mo. Rev. Stat. § 491, the court must evaluate the admissibility of evidence prior to trial. Mo. Const. Art. I, § 15 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Missouri motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Missouri-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Mo. Rev. Stat. § 491.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Missouri law includes:
- Mo. Rev. Stat. § 491
- Mo. Const. Art. I, § 15
- State v. Forrest, 183 S.W.3d 218 (Mo. 2006)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Mo. Rev. Stat. § 491
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Missouri case law

Use proper Missouri legal citation format.`,
    aiInstructions: "Must cite Mo. Rev. Stat. § 491, State v. Forrest, 183 S.W.3d 218 (Mo. 2006), and applicable Missouri evidentiary rules. Use Missouri citation format.",
    helpText: "AI will generate Missouri-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mo. Rev. Stat. § 491 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Mo. Rev. Stat. § 491 and Mo. Const. Art. I, § 15;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Missouri prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Missouri.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wisconsin Sections
// ============================================================================

const wiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [County] County, Wisconsin" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Wisconsin criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Wis. Stat. § 904.03, the court must evaluate the admissibility of evidence prior to trial. Wis. Const. Art. I, § 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Wisconsin motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Wisconsin-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Wis. Stat. § 904.03.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Wisconsin law includes:
- Wis. Stat. § 904.03
- Wis. Const. Art. I, § 11
- State v. Sullivan, 216 Wis. 2d 768 (1998)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Wis. Stat. § 904.03
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Wisconsin case law

Use proper Wisconsin legal citation format.`,
    aiInstructions: "Must cite Wis. Stat. § 904.03, State v. Sullivan, 216 Wis. 2d 768 (1998), and applicable Wisconsin evidentiary rules. Use Wisconsin citation format.",
    helpText: "AI will generate Wisconsin-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wis. Stat. § 904.03 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Wis. Stat. § 904.03 and Wis. Const. Art. I, § 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wisconsin prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Wisconsin.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Seventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Seventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Seventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Colorado Sections
// ============================================================================

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Colorado criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under CRE 401-403, the court must evaluate the admissibility of evidence prior to trial. Colo. Const. Art. II, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Colorado motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Colorado-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under CRE 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Colorado law includes:
- CRE 401-403
- Colo. Const. Art. II, § 7
- People v. Garner, 806 P.2d 366 (Colo. 1991)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under CRE 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Colorado case law

Use proper Colorado legal citation format.`,
    aiInstructions: "Must cite CRE 401-403, People v. Garner, 806 P.2d 366 (Colo. 1991), and applicable Colorado evidentiary rules. Use Colorado citation format.",
    helpText: "AI will generate Colorado-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to CRE 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to CRE 401-403 and Colo. Const. Art. II, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Colorado prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Colo..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Minnesota Sections
// ============================================================================

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Minnesota criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Minn. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Minn. Const. Art. I, § 10 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Minnesota motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Minnesota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Minn. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Minnesota law includes:
- Minn. R. Evid. 401-403
- Minn. Const. Art. I, § 10
- State v. Spreigl, 272 Minn. 488 (1965)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Minn. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Minnesota case law

Use proper Minnesota legal citation format.`,
    aiInstructions: "Must cite Minn. R. Evid. 401-403, State v. Spreigl, 272 Minn. 488 (1965), and applicable Minnesota evidentiary rules. Use Minnesota citation format.",
    helpText: "AI will generate Minnesota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Minn. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Minn. R. Evid. 401-403 and Minn. Const. Art. I, § 10;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Minnesota prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Minn..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Carolina Sections
// ============================================================================

const scCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Court of General Sessions, [County] County, South Carolina" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a South Carolina criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under S.C.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. S.C. Const. Art. I, § 10 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a South Carolina motion in limine. Present facts chronologically.",
    helpText: "AI will generate a South Carolina-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under S.C.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable South Carolina law includes:
- S.C.R.E. 401-403
- S.C. Const. Art. I, § 10
- State v. Lyle, 125 S.C. 406 (1923)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under S.C.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable South Carolina case law

Use proper South Carolina legal citation format.`,
    aiInstructions: "Must cite S.C.R.E. 401-403, State v. Lyle, 125 S.C. 406 (1923), and applicable South Carolina evidentiary rules. Use South Carolina citation format.",
    helpText: "AI will generate South Carolina-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to S.C.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to S.C.R.E. 401-403 and S.C. Const. Art. I, § 10;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Carolina prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.S.C..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fourth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fourth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alabama Sections
// ============================================================================

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Alabama criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Ala. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Ala. Const. Art. I, § 5 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Alabama motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Alabama-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Ala. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Alabama law includes:
- Ala. R. Evid. 401-403
- Ala. Const. Art. I, § 5
- Ex parte Arthur, 711 So. 2d 1097 (Ala. 1997)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Ala. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Alabama case law

Use proper Alabama legal citation format.`,
    aiInstructions: "Must cite Ala. R. Evid. 401-403, Ex parte Arthur, 711 So. 2d 1097 (Ala. 1997), and applicable Alabama evidentiary rules. Use Alabama citation format.",
    helpText: "AI will generate Alabama-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ala. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Ala. R. Evid. 401-403 and Ala. Const. Art. I, § 5;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alabama prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Alabama.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eleventh Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eleventh Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eleventh Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Louisiana Sections
// ============================================================================

const laCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [Parish] Parish, Louisiana" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Louisiana criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under La. C.E. Art. 401-403, the court must evaluate the admissibility of evidence prior to trial. La. Const. Art. I, § 5 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Louisiana motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Louisiana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under La. C.E. Art. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Louisiana law includes:
- La. C.E. Art. 401-403
- La. Const. Art. I, § 5
- State v. Prieur, 277 So. 2d 126 (La. 1973)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under La. C.E. Art. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Louisiana case law

Use proper Louisiana legal citation format.`,
    aiInstructions: "Must cite La. C.E. Art. 401-403, State v. Prieur, 277 So. 2d 126 (La. 1973), and applicable Louisiana evidentiary rules. Use Louisiana citation format.",
    helpText: "AI will generate Louisiana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to La. C.E. Art. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to La. C.E. Art. 401-403 and La. Const. Art. I, § 5;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Louisiana prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Louisiana.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fifth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fifth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kentucky Sections
// ============================================================================

const kyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [County] County, Kentucky" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Kentucky criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under KRE 401-403, the court must evaluate the admissibility of evidence prior to trial. Ky. Const. § 10 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Kentucky motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Kentucky-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under KRE 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Kentucky law includes:
- KRE 401-403
- Ky. Const. § 10
- Bell v. Commonwealth, 875 S.W.2d 882 (Ky. 1994)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under KRE 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Kentucky case law

Use proper Kentucky legal citation format.`,
    aiInstructions: "Must cite KRE 401-403, Bell v. Commonwealth, 875 S.W.2d 882 (Ky. 1994), and applicable Kentucky evidentiary rules. Use Kentucky citation format.",
    helpText: "AI will generate Kentucky-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to KRE 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to KRE 401-403 and Ky. Const. § 10;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kentucky prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF KENTUCKY
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Kentucky.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Sixth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Sixth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Sixth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oregon Sections
// ============================================================================

const orCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the State of Oregon, [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Oregon criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under OEC 401-403, the court must evaluate the admissibility of evidence prior to trial. Or. Const. Art. I, § 9 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Oregon motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Oregon-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under OEC 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Oregon law includes:
- OEC 401-403
- Or. Const. Art. I, § 9
- State v. Johns, 301 Or. 535 (1986)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under OEC 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Oregon case law

Use proper Oregon legal citation format.`,
    aiInstructions: "Must cite OEC 401-403, State v. Johns, 301 Or. 535 (1986), and applicable Oregon evidentiary rules. Use Oregon citation format.",
    helpText: "AI will generate Oregon-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to OEC 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to OEC 401-403 and Or. Const. Art. I, § 9;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oregon prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Or..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Oklahoma Sections
// ============================================================================

const okCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, Oklahoma" }
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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Oklahoma criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under 12 O.S. § 2403, the court must evaluate the admissibility of evidence prior to trial. Okla. Const. Art. II, § 30 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Oklahoma motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Oklahoma-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under 12 O.S. § 2403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Oklahoma law includes:
- 12 O.S. § 2403
- Okla. Const. Art. II, § 30
- Lott v. State, 2004 OK CR 27

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under 12 O.S. § 2403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Oklahoma case law

Use proper Oklahoma legal citation format.`,
    aiInstructions: "Must cite 12 O.S. § 2403, Lott v. State, 2004 OK CR 27, and applicable Oklahoma evidentiary rules. Use Oklahoma citation format.",
    helpText: "AI will generate Oklahoma-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to 12 O.S. § 2403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to 12 O.S. § 2403 and Okla. Const. Art. II, § 30;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Oklahoma prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

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
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Oklahoma.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Connecticut Sections
// ============================================================================

const ctCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, Judicial District of [District], Connecticut" }
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
  baseSections[3],
];

const connecticutSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Connecticut criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Conn. Code of Evid. § 4-3, the court must evaluate the admissibility of evidence prior to trial. Conn. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Connecticut motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Connecticut-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Conn. Code of Evid. § 4-3.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Connecticut law includes:
- Conn. Code of Evid. § 4-3
- Conn. Const. Art. I, § 7
- State v. Swinton, 268 Conn. 781 (2004)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Conn. Code of Evid. § 4-3
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Connecticut case law

Use proper Connecticut legal citation format.`,
    aiInstructions: "Must cite Conn. Code of Evid. § 4-3, State v. Swinton, 268 Conn. 781 (2004), and applicable Connecticut evidentiary rules. Use Connecticut citation format.",
    helpText: "AI will generate Connecticut-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Conn. Code of Evid. § 4-3 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Conn. Code of Evid. § 4-3 and Conn. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Connecticut prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF CONNECTICUT
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Connecticut-specific certificate of service format",
  },
];

const ctFederalSections: TemplateSection[] = [
  ...ctBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Conn..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Second Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Second Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Utah Sections
// ============================================================================

const utCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Utah" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXXXXXXXXXX" }
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
];

const utahSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Utah criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Utah R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Utah Const. Art. I, § 14 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Utah motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Utah-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Utah R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Utah law includes:
- Utah R. Evid. 401-403
- Utah Const. Art. I, § 14
- State v. Doporto, 935 P.2d 484 (Utah 1997)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Utah R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Utah case law

Use proper Utah legal citation format.`,
    aiInstructions: "Must cite Utah R. Evid. 401-403, State v. Doporto, 935 P.2d 484 (Utah 1997), and applicable Utah evidentiary rules. Use Utah citation format.",
    helpText: "AI will generate Utah-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Utah R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Utah R. Evid. 401-403 and Utah Const. Art. I, § 14;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Utah prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF UTAH
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Utah-specific certificate of service format",
  },
];

const utFederalSections: TemplateSection[] = [
  ...utBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Utah.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Iowa Sections
// ============================================================================

const iaCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of Iowa, [County] County" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., FECR XXXXXX" }
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
];

const iowaSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Iowa criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Iowa R. Evid. 5.401-5.403, the court must evaluate the admissibility of evidence prior to trial. Iowa Const. Art. I, § 8 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Iowa motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Iowa-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Iowa R. Evid. 5.401-5.403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Iowa law includes:
- Iowa R. Evid. 5.401-5.403
- Iowa Const. Art. I, § 8
- State v. Sullivan, 679 N.W.2d 19 (Iowa 2004)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Iowa R. Evid. 5.401-5.403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Iowa case law

Use proper Iowa legal citation format.`,
    aiInstructions: "Must cite Iowa R. Evid. 5.401-5.403, State v. Sullivan, 679 N.W.2d 19 (Iowa 2004), and applicable Iowa evidentiary rules. Use Iowa citation format.",
    helpText: "AI will generate Iowa-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Iowa R. Evid. 5.401-5.403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Iowa R. Evid. 5.401-5.403 and Iowa Const. Art. I, § 8;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Iowa prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF IOWA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Iowa-specific certificate of service format",
  },
];

const iaFederalSections: TemplateSection[] = [
  ...iaBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Iowa.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nevada Sections
// ============================================================================

const nvCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Nevada" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR-XX-XXXXXX" }
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
];

const nevadaSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Nevada criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under NRS 48.035, the court must evaluate the admissibility of evidence prior to trial. Nev. Const. Art. I, § 18 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Nevada motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Nevada-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under NRS 48.035.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Nevada law includes:
- NRS 48.035
- Nev. Const. Art. I, § 18
- Petrocelli v. State, 101 Nev. 46 (1985)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under NRS 48.035
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Nevada case law

Use proper Nevada legal citation format.`,
    aiInstructions: "Must cite NRS 48.035, Petrocelli v. State, 101 Nev. 46 (1985), and applicable Nevada evidentiary rules. Use Nevada citation format.",
    helpText: "AI will generate Nevada-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to NRS 48.035 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to NRS 48.035 and Nev. Const. Art. I, § 18;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nevada prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEVADA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Nevada-specific certificate of service format",
  },
];

const nvFederalSections: TemplateSection[] = [
  ...nvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Nev..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Arkansas Sections
// ============================================================================

const arCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Arkansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX CR XX-XXXXX" }
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
];

const arkansasSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Arkansas criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Ark. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Ark. Const. Art. II, § 15 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Arkansas motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Arkansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Ark. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Arkansas law includes:
- Ark. R. Evid. 401-403
- Ark. Const. Art. II, § 15
- Kelley v. State, 2009 Ark. 389

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Ark. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Arkansas case law

Use proper Arkansas legal citation format.`,
    aiInstructions: "Must cite Ark. R. Evid. 401-403, Kelley v. State, 2009 Ark. 389, and applicable Arkansas evidentiary rules. Use Arkansas citation format.",
    helpText: "AI will generate Arkansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Ark. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Ark. R. Evid. 401-403 and Ark. Const. Art. II, § 15;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Arkansas prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ARKANSAS
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Arkansas-specific certificate of service format",
  },
];

const arFederalSections: TemplateSection[] = [
  ...arBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Arkansas.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Mississippi Sections
// ============================================================================

const msCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of [County] County, Mississippi" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const mississippiSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Mississippi criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Miss. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Miss. Const. Art. III, § 23 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Mississippi motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Mississippi-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Miss. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Mississippi law includes:
- Miss. R. Evid. 401-403
- Miss. Const. Art. III, § 23
- Jones v. State, 920 So. 2d 465 (Miss. 2006)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Miss. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Mississippi case law

Use proper Mississippi legal citation format.`,
    aiInstructions: "Must cite Miss. R. Evid. 401-403, Jones v. State, 920 So. 2d 465 (Miss. 2006), and applicable Mississippi evidentiary rules. Use Mississippi citation format.",
    helpText: "AI will generate Mississippi-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Miss. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Miss. R. Evid. 401-403 and Miss. Const. Art. III, § 23;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Mississippi prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MISSISSIPPI
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Mississippi-specific certificate of service format",
  },
];

const msFederalSections: TemplateSection[] = [
  ...msBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of Mississippi.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fifth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fifth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fifth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Kansas Sections
// ============================================================================

const ksCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, Kansas" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXXX" }
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
];

const kansasSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Kansas criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under K.S.A. § 60-445, the court must evaluate the admissibility of evidence prior to trial. Kan. Const. Bill of Rights § 15 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Kansas motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Kansas-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under K.S.A. § 60-445.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Kansas law includes:
- K.S.A. § 60-445
- Kan. Const. Bill of Rights § 15
- State v. Gunby, 282 Kan. 39 (2006)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under K.S.A. § 60-445
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Kansas case law

Use proper Kansas legal citation format.`,
    aiInstructions: "Must cite K.S.A. § 60-445, State v. Gunby, 282 Kan. 39 (2006), and applicable Kansas evidentiary rules. Use Kansas citation format.",
    helpText: "AI will generate Kansas-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to K.S.A. § 60-445 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to K.S.A. § 60-445 and Kan. Const. Bill of Rights § 15;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Kansas prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF KANSAS
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Kansas-specific certificate of service format",
  },
];

const ksFederalSections: TemplateSection[] = [
  ...ksBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Kan..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Mexico Sections
// ============================================================================

const nmCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, New Mexico" }
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
];

const newMexicoSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a New Mexico criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under N.M.R.E. 11-401-403, the court must evaluate the admissibility of evidence prior to trial. N.M. Const. Art. II, § 10 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a New Mexico motion in limine. Present facts chronologically.",
    helpText: "AI will generate a New Mexico-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under N.M.R.E. 11-401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable New Mexico law includes:
- N.M.R.E. 11-401-403
- N.M. Const. Art. II, § 10
- State v. Lucero, 1993-NMSC-064

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under N.M.R.E. 11-401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable New Mexico case law

Use proper New Mexico legal citation format.`,
    aiInstructions: "Must cite N.M.R.E. 11-401-403, State v. Lucero, 1993-NMSC-064, and applicable New Mexico evidentiary rules. Use New Mexico citation format.",
    helpText: "AI will generate New Mexico-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.M.R.E. 11-401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to N.M.R.E. 11-401-403 and N.M. Const. Art. II, § 10;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Mexico prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW MEXICO
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New Mexico-specific certificate of service format",
  },
];

const nmFederalSections: TemplateSection[] = [
  ...nmBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.N.M..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Nebraska Sections
// ============================================================================

const neCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of [County] County, Nebraska" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., CR XX-XXXXX" }
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
];

const nebraskaSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Nebraska criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Neb. Rev. Stat. § 27-403, the court must evaluate the admissibility of evidence prior to trial. Neb. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Nebraska motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Nebraska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Neb. Rev. Stat. § 27-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Nebraska law includes:
- Neb. Rev. Stat. § 27-403
- Neb. Const. Art. I, § 7
- State v. Kofoed, 283 Neb. 767 (2012)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Neb. Rev. Stat. § 27-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Nebraska case law

Use proper Nebraska legal citation format.`,
    aiInstructions: "Must cite Neb. Rev. Stat. § 27-403, State v. Kofoed, 283 Neb. 767 (2012), and applicable Nebraska evidentiary rules. Use Nebraska citation format.",
    helpText: "AI will generate Nebraska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Neb. Rev. Stat. § 27-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Neb. Rev. Stat. § 27-403 and Neb. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Nebraska prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEBRASKA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Nebraska-specific certificate of service format",
  },
];

const neFederalSections: TemplateSection[] = [
  ...neBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Neb..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Idaho Sections
// ============================================================================

const idCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court of the [N]th Judicial District, [County] County, Idaho" }
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
];

const idahoSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Idaho criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under I.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. Idaho Const. Art. I, § 17 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Idaho motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Idaho-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under I.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Idaho law includes:
- I.R.E. 401-403
- Idaho Const. Art. I, § 17
- State v. Grist, 147 Idaho 49 (2009)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under I.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Idaho case law

Use proper Idaho legal citation format.`,
    aiInstructions: "Must cite I.R.E. 401-403, State v. Grist, 147 Idaho 49 (2009), and applicable Idaho evidentiary rules. Use Idaho citation format.",
    helpText: "AI will generate Idaho-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to I.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to I.R.E. 401-403 and Idaho Const. Art. I, § 17;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Idaho prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF IDAHO
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Idaho-specific certificate of service format",
  },
];

const idFederalSections: TemplateSection[] = [
  ...idBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Idaho.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Alaska Sections
// ============================================================================

const akCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [Judicial District], Alaska" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XAN-XX-XXXXX CR" }
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
];

const alaskaSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Alaska criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Alaska R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Alaska Const. Art. I, § 14 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Alaska motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Alaska-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Alaska R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Alaska law includes:
- Alaska R. Evid. 401-403
- Alaska Const. Art. I, § 14
- Bingaman v. State, 76 P.3d 398 (Alaska App. 2003)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Alaska R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Alaska case law

Use proper Alaska legal citation format.`,
    aiInstructions: "Must cite Alaska R. Evid. 401-403, Bingaman v. State, 76 P.3d 398 (Alaska App. 2003), and applicable Alaska evidentiary rules. Use Alaska citation format.",
    helpText: "AI will generate Alaska-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Alaska R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Alaska R. Evid. 401-403 and Alaska Const. Art. I, § 14;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Alaska prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF ALASKA
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Alaska-specific certificate of service format",
  },
];

const akFederalSections: TemplateSection[] = [
  ...akBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Alaska.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Delaware Sections
// ============================================================================

const deCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of the State of Delaware, [County] County" }
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
  baseSections[3],
];

const delawareSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Delaware criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under D.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. Del. Const. Art. I, § 6 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Delaware motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Delaware-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under D.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Delaware law includes:
- D.R.E. 401-403
- Del. Const. Art. I, § 6
- Getz v. State, 538 A.2d 726 (Del. 1988)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under D.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Delaware case law

Use proper Delaware legal citation format.`,
    aiInstructions: "Must cite D.R.E. 401-403, Getz v. State, 538 A.2d 726 (Del. 1988), and applicable Delaware evidentiary rules. Use Delaware citation format.",
    helpText: "AI will generate Delaware-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to D.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to D.R.E. 401-403 and Del. Const. Art. I, § 6;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Delaware prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF DELAWARE
c/o Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Delaware-specific certificate of service format",
  },
];

const deFederalSections: TemplateSection[] = [
  ...deBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Del..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Third Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Third Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Third Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Hawaii Sections
// ============================================================================

const hiCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court of the [N]th Circuit, State of Hawaii" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., X CR XX-X-XXXXXX" }
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
];

const hawaiiSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Hawaii criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under HRE 401-403, the court must evaluate the admissibility of evidence prior to trial. Haw. Const. Art. I, § 7 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Hawaii motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Hawaii-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under HRE 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Hawaii law includes:
- HRE 401-403
- Haw. Const. Art. I, § 7
- State v. Uyesugi, 100 Haw. 442 (2002)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under HRE 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Hawaii case law

Use proper Hawaii legal citation format.`,
    aiInstructions: "Must cite HRE 401-403, State v. Uyesugi, 100 Haw. 442 (2002), and applicable Hawaii evidentiary rules. Use Hawaii citation format.",
    helpText: "AI will generate Hawaii-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to HRE 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to HRE 401-403 and Haw. Const. Art. I, § 7;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Hawaii prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF HAWAII
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Hawaii-specific certificate of service format",
  },
];

const hiFederalSections: TemplateSection[] = [
  ...hiBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Haw..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Maine Sections
// ============================================================================

const meCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, Maine" }
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
];

const maineSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Maine criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under M.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. Me. Const. Art. I, § 5 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Maine motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Maine-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under M.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Maine law includes:
- M.R.E. 401-403
- Me. Const. Art. I, § 5
- State v. Getschman, 2001 ME 34

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under M.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Maine case law

Use proper Maine legal citation format.`,
    aiInstructions: "Must cite M.R.E. 401-403, State v. Getschman, 2001 ME 34, and applicable Maine evidentiary rules. Use Maine citation format.",
    helpText: "AI will generate Maine-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to M.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to M.R.E. 401-403 and Me. Const. Art. I, § 5;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Maine prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MAINE
c/o District Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Maine-specific certificate of service format",
  },
];

const meFederalSections: TemplateSection[] = [
  ...meBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Me..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with First Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with First Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Montana Sections
// ============================================================================

const mtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Montana" }
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
];

const montanaSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Montana criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Mont. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Mont. Const. Art. II, § 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Montana motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Montana-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Mont. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Montana law includes:
- Mont. R. Evid. 401-403
- Mont. Const. Art. II, § 11
- State v. Just, 184 Mont. 262 (1979)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Mont. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Montana case law

Use proper Montana legal citation format.`,
    aiInstructions: "Must cite Mont. R. Evid. 401-403, State v. Just, 184 Mont. 262 (1979), and applicable Montana evidentiary rules. Use Montana citation format.",
    helpText: "AI will generate Montana-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Mont. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Mont. R. Evid. 401-403 and Mont. Const. Art. II, § 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Montana prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF MONTANA
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Montana-specific certificate of service format",
  },
];

const mtFederalSections: TemplateSection[] = [
  ...mtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Mont..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Ninth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Ninth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Ninth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// New Hampshire Sections
// ============================================================================

const nhCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, New Hampshire" }
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
];

const newHampshireSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a New Hampshire criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under N.H.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. N.H. Const. Part I, Art. 19 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a New Hampshire motion in limine. Present facts chronologically.",
    helpText: "AI will generate a New Hampshire-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under N.H.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable New Hampshire law includes:
- N.H.R.E. 401-403
- N.H. Const. Part I, Art. 19
- State v. Addison, 160 N.H. 792 (2010)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under N.H.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable New Hampshire case law

Use proper New Hampshire legal citation format.`,
    aiInstructions: "Must cite N.H.R.E. 401-403, State v. Addison, 160 N.H. 792 (2010), and applicable New Hampshire evidentiary rules. Use New Hampshire citation format.",
    helpText: "AI will generate New Hampshire-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.H.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to N.H.R.E. 401-403 and N.H. Const. Part I, Art. 19;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "New Hampshire prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NEW HAMPSHIRE
c/o County Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "New Hampshire-specific certificate of service format",
  },
];

const nhFederalSections: TemplateSection[] = [
  ...nhBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.N.H..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with First Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with First Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// North Dakota Sections
// ============================================================================

const ndCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, North Dakota" }
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
];

const northDakotaSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a North Dakota criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under N.D.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. N.D. Const. Art. I, § 8 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a North Dakota motion in limine. Present facts chronologically.",
    helpText: "AI will generate a North Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under N.D.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable North Dakota law includes:
- N.D.R.E. 401-403
- N.D. Const. Art. I, § 8
- State v. Hernandez, 2000 ND 146

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under N.D.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable North Dakota case law

Use proper North Dakota legal citation format.`,
    aiInstructions: "Must cite N.D.R.E. 401-403, State v. Hernandez, 2000 ND 146, and applicable North Dakota evidentiary rules. Use North Dakota citation format.",
    helpText: "AI will generate North Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to N.D.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to N.D.R.E. 401-403 and N.D. Const. Art. I, § 8;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "North Dakota prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF NORTH DAKOTA
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "North Dakota-specific certificate of service format",
  },
];

const ndFederalSections: TemplateSection[] = [
  ...ndBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.N.D..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Rhode Island Sections
// ============================================================================

const riCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] County, Rhode Island" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX-XXXX-XXXXXX" }
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
];

const rhodeIslandSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Rhode Island criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under R.I.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. R.I. Const. Art. I, § 6 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Rhode Island motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Rhode Island-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under R.I.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Rhode Island law includes:
- R.I.R.E. 401-403
- R.I. Const. Art. I, § 6
- State v. Barkmeyer, 949 A.2d 984 (R.I. 2008)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under R.I.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Rhode Island case law

Use proper Rhode Island legal citation format.`,
    aiInstructions: "Must cite R.I.R.E. 401-403, State v. Barkmeyer, 949 A.2d 984 (R.I. 2008), and applicable Rhode Island evidentiary rules. Use Rhode Island citation format.",
    helpText: "AI will generate Rhode Island-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to R.I.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to R.I.R.E. 401-403 and R.I. Const. Art. I, § 6;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Rhode Island prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF RHODE ISLAND
c/o Attorney General
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Rhode Island-specific certificate of service format",
  },
];

const riFederalSections: TemplateSection[] = [
  ...riBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.R.I..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with First Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with First Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and First Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// South Dakota Sections
// ============================================================================

const sdCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Circuit Court, [County] County, South Dakota" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XX CRI XX-XXXXX" }
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
];

const southDakotaSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a South Dakota criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under SDCL § 19-19-403, the court must evaluate the admissibility of evidence prior to trial. S.D. Const. Art. VI, § 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a South Dakota motion in limine. Present facts chronologically.",
    helpText: "AI will generate a South Dakota-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under SDCL § 19-19-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable South Dakota law includes:
- SDCL § 19-19-403
- S.D. Const. Art. VI, § 11
- State v. Bittner, 2005 SD 118

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under SDCL § 19-19-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable South Dakota case law

Use proper South Dakota legal citation format.`,
    aiInstructions: "Must cite SDCL § 19-19-403, State v. Bittner, 2005 SD 118, and applicable South Dakota evidentiary rules. Use South Dakota citation format.",
    helpText: "AI will generate South Dakota-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to SDCL § 19-19-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to SDCL § 19-19-403 and S.D. Const. Art. VI, § 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "South Dakota prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF SOUTH DAKOTA
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "South Dakota-specific certificate of service format",
  },
];

const sdFederalSections: TemplateSection[] = [
  ...sdBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.S.D..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Eighth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Eighth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Eighth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Vermont Sections
// ============================================================================

const vtCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court, [County] Unit, Vermont" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-X-XX-XXXXXXXcr" }
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
];

const vermontSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Vermont criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under V.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. Vt. Const. Chapter I, Art. 11 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Vermont motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Vermont-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under V.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Vermont law includes:
- V.R.E. 401-403
- Vt. Const. Chapter I, Art. 11
- State v. Forbes, 161 Vt. 327 (1994)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under V.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Vermont case law

Use proper Vermont legal citation format.`,
    aiInstructions: "Must cite V.R.E. 401-403, State v. Forbes, 161 Vt. 327 (1994), and applicable Vermont evidentiary rules. Use Vermont citation format.",
    helpText: "AI will generate Vermont-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to V.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to V.R.E. 401-403 and Vt. Const. Chapter I, Art. 11;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Vermont prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF VERMONT
c/o State's Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Vermont-specific certificate of service format",
  },
];

const vtFederalSections: TemplateSection[] = [
  ...vtBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Vt..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Second Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Second Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Second Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// West Virginia Sections
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
];

const westVirginiaSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a West Virginia criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under W.Va.R.E. 401-403, the court must evaluate the admissibility of evidence prior to trial. W.Va. Const. Art. III, § 6 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a West Virginia motion in limine. Present facts chronologically.",
    helpText: "AI will generate a West Virginia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under W.Va.R.E. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable West Virginia law includes:
- W.Va.R.E. 401-403
- W.Va. Const. Art. III, § 6
- State v. McGinnis, 193 W.Va. 147 (1994)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under W.Va.R.E. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable West Virginia case law

Use proper West Virginia legal citation format.`,
    aiInstructions: "Must cite W.Va.R.E. 401-403, State v. McGinnis, 193 W.Va. 147 (1994), and applicable West Virginia evidentiary rules. Use West Virginia citation format.",
    helpText: "AI will generate West Virginia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to W.Va.R.E. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to W.Va.R.E. 401-403 and W.Va. Const. Art. III, § 6;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "West Virginia prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WEST VIRGINIA
c/o Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "West Virginia-specific certificate of service format",
  },
];

const wvFederalSections: TemplateSection[] = [
  ...wvBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the District of West Virginia.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Fourth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Fourth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Fourth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Wyoming Sections
// ============================================================================

const wyCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., District Court, [County] County, Wyoming" }
    : input.id === "caseNumber"
    ? { ...input, placeholder: "e.g., XXXX-CR-XXXXX" }
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
];

const wyomingSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a Wyoming criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Wyo. R. Evid. 401-403, the court must evaluate the admissibility of evidence prior to trial. Wyo. Const. Art. I, § 4 provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a Wyoming motion in limine. Present facts chronologically.",
    helpText: "AI will generate a Wyoming-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Wyo. R. Evid. 401-403.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable Wyoming law includes:
- Wyo. R. Evid. 401-403
- Wyo. Const. Art. I, § 4
- Vigil v. State, 926 P.2d 351 (Wyo. 1996)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Wyo. R. Evid. 401-403
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable Wyoming case law

Use proper Wyoming legal citation format.`,
    aiInstructions: "Must cite Wyo. R. Evid. 401-403, Vigil v. State, 926 P.2d 351 (Wyo. 1996), and applicable Wyoming evidentiary rules. Use Wyoming citation format.",
    helpText: "AI will generate Wyoming-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Wyo. R. Evid. 401-403 to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Wyo. R. Evid. 401-403 and Wyo. Const. Art. I, § 4;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "Wyoming prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF WYOMING
c/o County and Prosecuting Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Wyoming-specific certificate of service format",
  },
];

const wyFederalSections: TemplateSection[] = [
  ...wyBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D. Wyo..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with Tenth Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with Tenth Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and Tenth Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// District of Columbia Sections
// ============================================================================

const dcCaptionInputs: TemplateInput[] = captionInputs.map((input) =>
  input.id === "courtName"
    ? { ...input, placeholder: "e.g., Superior Court of the District of Columbia" }
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
  baseSections[3],
];

const dcSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a District of Columbia criminal matter.

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964), the court must evaluate the admissibility of evidence prior to trial. U.S. Const. Amend. IV-VI provides additional protections for the Defendant.

Generate 3-4 paragraphs that:
1. Provide the procedural history of the case, including the charges and upcoming trial
2. Describe the specific evidence at issue that the Defendant seeks to exclude
3. Explain how the evidence would be presented at trial if not excluded
4. Describe the impact on the Defendant's right to a fair trial

Use formal legal writing style. Present facts objectively but in a manner favorable to the defense. Do not include legal citations or argument — only facts. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a District of Columbia motion in limine. Present facts chronologically.",
    helpText: "AI will generate a District of Columbia-specific statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a motion in limine under Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964).

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Applicable District of Columbia law includes:
- Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964)
- U.S. Const. Amend. IV-VI
- Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964)

Generate 4-6 paragraphs that:
1. State the applicable evidentiary standard under Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964)
2. Explain why the evidence fails the admissibility test
3. Conduct a Rule 403 balancing analysis (prejudice vs. probative value)
4. Address the prosecution's likely counterarguments
5. Explain why exclusion is necessary for a fair trial
6. Cite applicable District of Columbia case law

Use proper District of Columbia legal citation format.`,
    aiInstructions: "Must cite Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964), Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964), and applicable District of Columbia evidentiary rules. Use District of Columbia citation format.",
    helpText: "AI will generate District of Columbia-specific legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964) to:

1. Enter an order excluding the specified evidence from being introduced, referred to, or commented upon during trial proceedings, pursuant to Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964) and U.S. Const. Amend. IV-VI;

2. Prohibit the prosecution from making any reference to the excluded evidence during opening statements, direct or cross-examination, closing arguments, or at any other time during trial;

3. Order the prosecution to instruct its witnesses not to refer to or volunteer any information regarding the excluded evidence;

4. Grant a hearing on this motion in limine prior to trial;

5. Grant such other and further relief as this Court deems just and proper.`,
    helpText: "District of Columbia prayer for relief citing state evidentiary rules",
  },

  baseSections[7],

  {
    id: "certificateOfService",
    name: "Certificate of Service",
    type: "static",
    order: 9,
    required: true,
    staticContent: `CERTIFICATE OF SERVICE

I certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE on all parties:

[ ] By electronic filing
[ ] By mail
[ ] By personal service

STATE OF THE DISTRICT OF COLUMBIA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "District of Columbia-specific certificate of service format",
  },
];

const dcFederalSections: TemplateSection[] = [
  ...dcBaseSections,

  {
    id: "statementOfFacts",
    name: "Statement of Facts",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a detailed statement of facts for a motion in limine in a federal criminal matter in the D.D.C..

Trial Information:
- Trial Date: {{trialDate}}
- Trial Type: {{trialType}}
- Charges: {{chargesDescription}}

Evidence at Issue:
- Evidence Category: {{evidenceCategory}}
- Evidence Description: {{evidenceDescription}}
- Prejudice Explanation: {{prejudiceExplanation}}
- Evidence Relevance: {{evidenceRelevance}}
- Additional Evidence Items: {{additionalEvidenceItems}}

Under Federal Rules of Evidence 401-403, the court must evaluate the admissibility of evidence prior to trial.

Generate 3-4 paragraphs presenting facts chronologically. Refer to the defendant as "the Defendant" throughout.`,
    aiInstructions: "Generate a factual narrative for a federal motion in limine. Present facts chronologically.",
    helpText: "AI will generate a federal statement of facts",
  },

  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 6,
    required: true,
    aiPromptTemplate: `Generate the legal argument section for a federal motion in limine under Federal Rules of Evidence 401-403 with DC Circuit precedent.

Jurisdiction: {{jurisdiction}}
Evidence Category: {{evidenceCategory}}
Evidence Description: {{evidenceDescription}}
Prejudice Explanation: {{prejudiceExplanation}}
Evidence Relevance: {{evidenceRelevance}}
Primary Rule: {{primaryRule}}
Legal Basis: {{legalBasisExplanation}}
Prosecution's Likely Argument: {{prosecutionLikelyArgument}}
Applicable Exceptions: {{applicableExceptions}}
Charges: {{chargesDescription}}

Generate 4-6 paragraphs applying federal evidentiary standards with DC Circuit precedent.`,
    aiInstructions: "Must cite FRE 401-403, Daubert v. Merrell Dow, Old Chief v. United States, and DC Circuit precedent.",
    helpText: "AI will generate federal legal arguments",
  },

  {
    id: "prayerForRelief",
    name: "Prayer for Relief",
    type: "static",
    order: 7,
    required: true,
    staticContent: `WHEREFORE, Defendant respectfully moves this Honorable Court pursuant to Federal Rules of Evidence 401-403 to exclude the specified evidence and prohibit any reference thereto during trial, and to grant such other relief as is just and proper.`,
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

I hereby certify that on the date below, I served a copy of the foregoing MOTION IN LIMINE via CM/ECF electronic filing on all counsel of record.

UNITED STATES OF AMERICA
c/o United States Attorney
________________________________

Dated: _______________

____________________________
[Declarant's Signature]`,
    helpText: "Federal certificate of service format",
  },
];

// ============================================================================
// Jurisdiction Variants
// ============================================================================

export const motionInLimineTemplate: DocumentTemplate = {
  id: "motion-in-limine",
  name: "Motion in Limine",
  category: "criminal",
  description: "Pre-trial motion requesting the court to rule on the admissibility of evidence before trial. Used to exclude prejudicial, irrelevant, or otherwise inadmissible evidence from being presented to the jury. Essential for trial preparation and protecting the defendant's right to a fair trial. Filed pursuant to Federal Rules of Evidence 401-403 and corresponding state evidentiary rules.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  baseSections,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  jurisdictionVariants: [
    {
      jurisdiction: "CA",
      courtType: "state",
      sections: californiaSections,
      courtSpecificRules: "Filed under California Evidence Code §§ 350-352. Cal. Const. Art. I, § 28(d) provides additional evidentiary protections.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "CACD",
      sections: caFederalSections,
      courtSpecificRules: "C.D. Cal.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "NDCA",
      sections: caFederalSections,
      courtSpecificRules: "N.D. Cal.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "EDCA",
      sections: caFederalSections,
      courtSpecificRules: "E.D. Cal.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CA",
      courtType: "federal",
      district: "SDCA",
      sections: caFederalSections,
      courtSpecificRules: "S.D. Cal.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "state",
      sections: newYorkSections,
      courtSpecificRules: "Filed under CPL Article 710; N.Y. CPLR 3211. N.Y. Const. Art. I, § 6 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "SDNY",
      sections: nyFederalSections,
      courtSpecificRules: "S.D.N.Y.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "EDNY",
      sections: nyFederalSections,
      courtSpecificRules: "E.D.N.Y.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "NDNY",
      sections: nyFederalSections,
      courtSpecificRules: "N.D.N.Y.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NY",
      courtType: "federal",
      district: "WDNY",
      sections: nyFederalSections,
      courtSpecificRules: "W.D.N.Y.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "state",
      sections: texasSections,
      courtSpecificRules: "Filed under Texas Rules of Evidence 401-403. Tex. Const. Art. I, § 19 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXND",
      sections: txFederalSections,
      courtSpecificRules: "N.D. Tex.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXSD",
      sections: txFederalSections,
      courtSpecificRules: "S.D. Tex.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXED",
      sections: txFederalSections,
      courtSpecificRules: "E.D. Tex.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TX",
      courtType: "federal",
      district: "TXWD",
      sections: txFederalSections,
      courtSpecificRules: "W.D. Tex.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "state",
      sections: floridaSections,
      courtSpecificRules: "Filed under Florida Statute § 90.403. Fla. Const. Art. I, § 12 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLSD",
      sections: flFederalSections,
      courtSpecificRules: "S.D. Fla.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLMD",
      sections: flFederalSections,
      courtSpecificRules: "M.D. Fla.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "FL",
      courtType: "federal",
      district: "FLND",
      sections: flFederalSections,
      courtSpecificRules: "N.D. Fla.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "state",
      sections: pennsylvaniaSections,
      courtSpecificRules: "Filed under Pa.R.E. 401-404. Pa. Const. Art. I, § 8 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAED",
      sections: paFederalSections,
      courtSpecificRules: "E.D. Pa.: 12pt font. Filed under FRE 401-403. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAMD",
      sections: paFederalSections,
      courtSpecificRules: "M.D. Pa.: 12pt font. Filed under FRE 401-403. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "PA",
      courtType: "federal",
      district: "PAWD",
      sections: paFederalSections,
      courtSpecificRules: "W.D. Pa.: 12pt font. Filed under FRE 401-403. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "state",
      sections: illinoisSections,
      courtSpecificRules: "Filed under Illinois Rules of Evidence 401-403. Ill. Const. Art. I, § 6 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILND",
      sections: ilFederalSections,
      courtSpecificRules: "N.D. Ill.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILCD",
      sections: ilFederalSections,
      courtSpecificRules: "C.D. Ill.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IL",
      courtType: "federal",
      district: "ILSD",
      sections: ilFederalSections,
      courtSpecificRules: "S.D. Ill.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OH",
      courtType: "state",
      sections: ohioSections,
      courtSpecificRules: "Filed under Ohio Rules of Evidence 401-403. Ohio Const. Art. I, § 14 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHND",
      sections: ohFederalSections,
      courtSpecificRules: "N.D. Ohio: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OH",
      courtType: "federal",
      district: "OHSD",
      sections: ohFederalSections,
      courtSpecificRules: "S.D. Ohio: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "state",
      sections: georgiaSections,
      courtSpecificRules: "Filed under O.C.G.A. § 24-4-403. Ga. Const. Art. I, § I, Para. XIII provides additional evidentiary protections.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAND",
      sections: gaFederalSections,
      courtSpecificRules: "N.D. Ga.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GAMD",
      sections: gaFederalSections,
      courtSpecificRules: "M.D. Ga.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "GA",
      courtType: "federal",
      district: "GASD",
      sections: gaFederalSections,
      courtSpecificRules: "S.D. Ga.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "state",
      sections: northCarolinaSections,
      courtSpecificRules: "Filed under N.C.R.E. 401-403. N.C. Const. Art. I, § 19 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "EDNC",
      sections: ncFederalSections,
      courtSpecificRules: "E.D.N.C.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "MDNC",
      sections: ncFederalSections,
      courtSpecificRules: "M.D.N.C.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NC",
      courtType: "federal",
      district: "WDNC",
      sections: ncFederalSections,
      courtSpecificRules: "W.D.N.C.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "state",
      sections: michiganSections,
      courtSpecificRules: "Filed under MRE 401-403. Mich. Const. Art. I, § 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "EDMI",
      sections: miFederalSections,
      courtSpecificRules: "E.D. Mich.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MI",
      courtType: "federal",
      district: "WDMI",
      sections: miFederalSections,
      courtSpecificRules: "W.D. Mich.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NJ",
      courtType: "state",
      sections: newJerseySections,
      courtSpecificRules: "Filed under N.J.R.E. 401-403. N.J. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NJ",
      courtType: "federal",
      district: "DNJ",
      sections: njFederalSections,
      courtSpecificRules: "D.N.J.: 12pt font. Filed under FRE 401-403. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "state",
      sections: virginiaSections,
      courtSpecificRules: "Filed under Va. Code § 8.01-401. Va. Const. Art. I, § 10 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "EDVA",
      sections: vaFederalSections,
      courtSpecificRules: "E.D. Va.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VA",
      courtType: "federal",
      district: "WDVA",
      sections: vaFederalSections,
      courtSpecificRules: "W.D. Va.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "state",
      sections: washingtonSections,
      courtSpecificRules: "Filed under ER 401-403. Wash. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "EDWA",
      sections: waFederalSections,
      courtSpecificRules: "E.D. Wash.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WA",
      courtType: "federal",
      district: "WDWA",
      sections: waFederalSections,
      courtSpecificRules: "W.D. Wash.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AZ",
      courtType: "state",
      sections: arizonaSections,
      courtSpecificRules: "Filed under A.R.E. 401-403. Ariz. Const. Art. II, § 8 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "AZ",
      courtType: "federal",
      district: "DAZ",
      sections: azFederalSections,
      courtSpecificRules: "D. Ariz.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MA",
      courtType: "state",
      sections: massachusettsSections,
      courtSpecificRules: "Filed under Mass. Guide to Evidence § 403. Mass. Const. Part I, Art. XIV provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MA",
      courtType: "federal",
      district: "DMA",
      sections: maFederalSections,
      courtSpecificRules: "D. Mass.: 12pt font. Filed under FRE 401-403. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "state",
      sections: tennesseeSections,
      courtSpecificRules: "Filed under Tenn. R. Evid. 401-403. Tenn. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "EDTN",
      sections: tnFederalSections,
      courtSpecificRules: "E.D. Tenn.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "MDTN",
      sections: tnFederalSections,
      courtSpecificRules: "M.D. Tenn.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "TN",
      courtType: "federal",
      district: "WDTN",
      sections: tnFederalSections,
      courtSpecificRules: "W.D. Tenn.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "state",
      sections: indianaSections,
      courtSpecificRules: "Filed under Ind. R. Evid. 401-403. Ind. Const. Art. I, § 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "NDIN",
      sections: inFederalSections,
      courtSpecificRules: "N.D. Ind.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IN",
      courtType: "federal",
      district: "SDIN",
      sections: inFederalSections,
      courtSpecificRules: "S.D. Ind.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MD",
      courtType: "state",
      sections: marylandSections,
      courtSpecificRules: "Filed under Md. Rule 5-403. Md. Const. Decl. of Rights Art. 26 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MD",
      courtType: "federal",
      district: "DMD",
      sections: mdFederalSections,
      courtSpecificRules: "D. Md.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "state",
      sections: missouriSections,
      courtSpecificRules: "Filed under Mo. Rev. Stat. § 491. Mo. Const. Art. I, § 15 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "EDMO",
      sections: moFederalSections,
      courtSpecificRules: "E.D. Mo.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MO",
      courtType: "federal",
      district: "WDMO",
      sections: moFederalSections,
      courtSpecificRules: "W.D. Mo.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "state",
      sections: wisconsinSections,
      courtSpecificRules: "Filed under Wis. Stat. § 904.03. Wis. Const. Art. I, § 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "EDWI",
      sections: wiFederalSections,
      courtSpecificRules: "E.D. Wis.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WI",
      courtType: "federal",
      district: "WDWI",
      sections: wiFederalSections,
      courtSpecificRules: "W.D. Wis.: 12pt font. Filed under FRE 401-403. Seventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CO",
      courtType: "state",
      sections: coloradoSections,
      courtSpecificRules: "Filed under CRE 401-403. Colo. Const. Art. II, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "CO",
      courtType: "federal",
      district: "DCO",
      sections: coFederalSections,
      courtSpecificRules: "D. Colo.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MN",
      courtType: "state",
      sections: minnesotaSections,
      courtSpecificRules: "Filed under Minn. R. Evid. 401-403. Minn. Const. Art. I, § 10 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MN",
      courtType: "federal",
      district: "DMN",
      sections: mnFederalSections,
      courtSpecificRules: "D. Minn.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "SC",
      courtType: "state",
      sections: southCarolinaSections,
      courtSpecificRules: "Filed under S.C.R.E. 401-403. S.C. Const. Art. I, § 10 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "SC",
      courtType: "federal",
      district: "DSC",
      sections: scFederalSections,
      courtSpecificRules: "D.S.C.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "state",
      sections: alabamaSections,
      courtSpecificRules: "Filed under Ala. R. Evid. 401-403. Ala. Const. Art. I, § 5 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "NDAL",
      sections: alFederalSections,
      courtSpecificRules: "N.D. Ala.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "MDAL",
      sections: alFederalSections,
      courtSpecificRules: "M.D. Ala.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AL",
      courtType: "federal",
      district: "SDAL",
      sections: alFederalSections,
      courtSpecificRules: "S.D. Ala.: 12pt font. Filed under FRE 401-403. Eleventh Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "state",
      sections: louisianaSections,
      courtSpecificRules: "Filed under La. C.E. Art. 401-403. La. Const. Art. I, § 5 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "EDLA",
      sections: laFederalSections,
      courtSpecificRules: "E.D. La.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "MDLA",
      sections: laFederalSections,
      courtSpecificRules: "M.D. La.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "LA",
      courtType: "federal",
      district: "WDLA",
      sections: laFederalSections,
      courtSpecificRules: "W.D. La.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "state",
      sections: kentuckySections,
      courtSpecificRules: "Filed under KRE 401-403. Ky. Const. § 10 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "EDKY",
      sections: kyFederalSections,
      courtSpecificRules: "E.D. Ky.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KY",
      courtType: "federal",
      district: "WDKY",
      sections: kyFederalSections,
      courtSpecificRules: "W.D. Ky.: 12pt font. Filed under FRE 401-403. Sixth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OR",
      courtType: "state",
      sections: oregonSections,
      courtSpecificRules: "Filed under OEC 401-403. Or. Const. Art. I, § 9 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "OR",
      courtType: "federal",
      district: "DOR",
      sections: orFederalSections,
      courtSpecificRules: "D. Or.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "state",
      sections: oklahomaSections,
      courtSpecificRules: "Filed under 12 O.S. § 2403. Okla. Const. Art. II, § 30 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "NDOK",
      sections: okFederalSections,
      courtSpecificRules: "N.D. Okla.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "EDOK",
      sections: okFederalSections,
      courtSpecificRules: "E.D. Okla.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "OK",
      courtType: "federal",
      district: "WDOK",
      sections: okFederalSections,
      courtSpecificRules: "W.D. Okla.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "CT",
      courtType: "state",
      sections: connecticutSections,
      courtSpecificRules: "Filed under Conn. Code of Evid. § 4-3. Conn. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "CT",
      courtType: "federal",
      district: "DCT",
      sections: ctFederalSections,
      courtSpecificRules: "D. Conn.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "UT",
      courtType: "state",
      sections: utahSections,
      courtSpecificRules: "Filed under Utah R. Evid. 401-403. Utah Const. Art. I, § 14 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "UT",
      courtType: "federal",
      district: "DUT",
      sections: utFederalSections,
      courtSpecificRules: "D. Utah: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "state",
      sections: iowaSections,
      courtSpecificRules: "Filed under Iowa R. Evid. 5.401-5.403. Iowa Const. Art. I, § 8 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "NDIA",
      sections: iaFederalSections,
      courtSpecificRules: "N.D. Iowa: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "IA",
      courtType: "federal",
      district: "SDIA",
      sections: iaFederalSections,
      courtSpecificRules: "S.D. Iowa: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NV",
      courtType: "state",
      sections: nevadaSections,
      courtSpecificRules: "Filed under NRS 48.035. Nev. Const. Art. I, § 18 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NV",
      courtType: "federal",
      district: "DNV",
      sections: nvFederalSections,
      courtSpecificRules: "D. Nev.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "state",
      sections: arkansasSections,
      courtSpecificRules: "Filed under Ark. R. Evid. 401-403. Ark. Const. Art. II, § 15 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "EDAR",
      sections: arFederalSections,
      courtSpecificRules: "E.D. Ark.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AR",
      courtType: "federal",
      district: "WDAR",
      sections: arFederalSections,
      courtSpecificRules: "W.D. Ark.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "state",
      sections: mississippiSections,
      courtSpecificRules: "Filed under Miss. R. Evid. 401-403. Miss. Const. Art. III, § 23 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "NDMS",
      sections: msFederalSections,
      courtSpecificRules: "N.D. Miss.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MS",
      courtType: "federal",
      district: "SDMS",
      sections: msFederalSections,
      courtSpecificRules: "S.D. Miss.: 12pt font. Filed under FRE 401-403. Fifth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "KS",
      courtType: "state",
      sections: kansasSections,
      courtSpecificRules: "Filed under K.S.A. § 60-445. Kan. Const. Bill of Rights § 15 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "KS",
      courtType: "federal",
      district: "DKS",
      sections: ksFederalSections,
      courtSpecificRules: "D. Kan.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NM",
      courtType: "state",
      sections: newMexicoSections,
      courtSpecificRules: "Filed under N.M.R.E. 11-401-403. N.M. Const. Art. II, § 10 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NM",
      courtType: "federal",
      district: "DNM",
      sections: nmFederalSections,
      courtSpecificRules: "D.N.M.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NE",
      courtType: "state",
      sections: nebraskaSections,
      courtSpecificRules: "Filed under Neb. Rev. Stat. § 27-403. Neb. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NE",
      courtType: "federal",
      district: "DNE",
      sections: neFederalSections,
      courtSpecificRules: "D. Neb.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ID",
      courtType: "state",
      sections: idahoSections,
      courtSpecificRules: "Filed under I.R.E. 401-403. Idaho Const. Art. I, § 17 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "ID",
      courtType: "federal",
      district: "DID",
      sections: idFederalSections,
      courtSpecificRules: "D. Idaho: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "AK",
      courtType: "state",
      sections: alaskaSections,
      courtSpecificRules: "Filed under Alaska R. Evid. 401-403. Alaska Const. Art. I, § 14 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "AK",
      courtType: "federal",
      district: "DAK",
      sections: akFederalSections,
      courtSpecificRules: "D. Alaska: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "DE",
      courtType: "state",
      sections: delawareSections,
      courtSpecificRules: "Filed under D.R.E. 401-403. Del. Const. Art. I, § 6 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "DE",
      courtType: "federal",
      district: "DDE",
      sections: deFederalSections,
      courtSpecificRules: "D. Del.: 12pt font. Filed under FRE 401-403. Third Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "HI",
      courtType: "state",
      sections: hawaiiSections,
      courtSpecificRules: "Filed under HRE 401-403. Haw. Const. Art. I, § 7 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "HI",
      courtType: "federal",
      district: "DHI",
      sections: hiFederalSections,
      courtSpecificRules: "D. Haw.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ME",
      courtType: "state",
      sections: maineSections,
      courtSpecificRules: "Filed under M.R.E. 401-403. Me. Const. Art. I, § 5 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "ME",
      courtType: "federal",
      district: "DME",
      sections: meFederalSections,
      courtSpecificRules: "D. Me.: 12pt font. Filed under FRE 401-403. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "MT",
      courtType: "state",
      sections: montanaSections,
      courtSpecificRules: "Filed under Mont. R. Evid. 401-403. Mont. Const. Art. II, § 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "MT",
      courtType: "federal",
      district: "DMT",
      sections: mtFederalSections,
      courtSpecificRules: "D. Mont.: 12pt font. Filed under FRE 401-403. Ninth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "NH",
      courtType: "state",
      sections: newHampshireSections,
      courtSpecificRules: "Filed under N.H.R.E. 401-403. N.H. Const. Part I, Art. 19 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "NH",
      courtType: "federal",
      district: "DNH",
      sections: nhFederalSections,
      courtSpecificRules: "D.N.H.: 12pt font. Filed under FRE 401-403. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "ND",
      courtType: "state",
      sections: northDakotaSections,
      courtSpecificRules: "Filed under N.D.R.E. 401-403. N.D. Const. Art. I, § 8 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "ND",
      courtType: "federal",
      district: "DND",
      sections: ndFederalSections,
      courtSpecificRules: "D.N.D.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "RI",
      courtType: "state",
      sections: rhodeIslandSections,
      courtSpecificRules: "Filed under R.I.R.E. 401-403. R.I. Const. Art. I, § 6 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "RI",
      courtType: "federal",
      district: "DRI",
      sections: riFederalSections,
      courtSpecificRules: "D.R.I.: 12pt font. Filed under FRE 401-403. First Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "SD",
      courtType: "state",
      sections: southDakotaSections,
      courtSpecificRules: "Filed under SDCL § 19-19-403. S.D. Const. Art. VI, § 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "SD",
      courtType: "federal",
      district: "DSD",
      sections: sdFederalSections,
      courtSpecificRules: "D.S.D.: 12pt font. Filed under FRE 401-403. Eighth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "VT",
      courtType: "state",
      sections: vermontSections,
      courtSpecificRules: "Filed under V.R.E. 401-403. Vt. Const. Chapter I, Art. 11 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "VT",
      courtType: "federal",
      district: "DVT",
      sections: vtFederalSections,
      courtSpecificRules: "D. Vt.: 12pt font. Filed under FRE 401-403. Second Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "state",
      sections: westVirginiaSections,
      courtSpecificRules: "Filed under W.Va.R.E. 401-403. W.Va. Const. Art. III, § 6 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "NDWV",
      sections: wvFederalSections,
      courtSpecificRules: "N.D. W.Va.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WV",
      courtType: "federal",
      district: "SDWV",
      sections: wvFederalSections,
      courtSpecificRules: "S.D. W.Va.: 12pt font. Filed under FRE 401-403. Fourth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "WY",
      courtType: "state",
      sections: wyomingSections,
      courtSpecificRules: "Filed under Wyo. R. Evid. 401-403. Wyo. Const. Art. I, § 4 provides additional evidentiary protections.",
    },
    {
      jurisdiction: "WY",
      courtType: "federal",
      district: "DWY",
      sections: wyFederalSections,
      courtSpecificRules: "D. Wyo.: 12pt font. Filed under FRE 401-403. Tenth Circuit. CM/ECF required.",
    },
    {
      jurisdiction: "DC",
      courtType: "state",
      sections: dcSections,
      courtSpecificRules: "Filed under Uniform Superior Court Rule, Drew v. United States, 331 F.2d 85 (D.C. Cir. 1964). U.S. Const. Amend. IV-VI provides additional evidentiary protections.",
    },
    {
      jurisdiction: "DC",
      courtType: "federal",
      district: "DDC",
      sections: dcFederalSections,
      courtSpecificRules: "D.D.C.: 12pt font. Filed under FRE 401-403. DC Circuit. CM/ECF required.",
    },
  ],
  supportedJurisdictions: ["CA", "NY", "TX", "FL", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS", "NM", "NE", "ID", "AK", "DE", "HI", "ME", "MT", "NH", "ND", "RI", "SD", "VT", "WV", "WY", "DC", "CACD", "NDCA", "EDCA", "SDCA", "SDNY", "EDNY", "NDNY", "WDNY", "TXND", "TXSD", "TXED", "TXWD", "FLSD", "FLMD", "FLND", "PAED", "PAMD", "PAWD", "ILND", "ILCD", "ILSD", "OHND", "OHSD", "GAND", "GAMD", "GASD", "EDNC", "MDNC", "WDNC", "EDMI", "WDMI", "DNJ", "EDVA", "WDVA", "EDWA", "WDWA", "DAZ", "DMA", "EDTN", "MDTN", "WDTN", "NDIN", "SDIN", "DMD", "EDMO", "WDMO", "EDWI", "WDWI", "DCO", "DMN", "DSC", "NDAL", "MDAL", "SDAL", "EDLA", "MDLA", "WDLA", "EDKY", "WDKY", "DOR", "NDOK", "EDOK", "WDOK", "DCT", "DUT", "NDIA", "SDIA", "DNV", "EDAR", "WDAR", "NDMS", "SDMS", "DKS", "DNM", "DNE", "DID", "DAK", "DDE", "DHI", "DME", "DMT", "DNH", "DND", "DRI", "DSD", "DVT", "NDWV", "SDWV", "DWY", "DDC"],
};
