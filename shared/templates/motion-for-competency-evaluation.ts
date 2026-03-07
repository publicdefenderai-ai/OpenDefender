/**
 * Motion for Competency Evaluation Template
 *
 * Criminal law document requesting the court to suspend proceedings and order
 * a psychiatric or psychological evaluation to assess the defendant's competency
 * to stand trial. Filed when counsel has a bona fide doubt about whether the
 * defendant can understand the proceedings against them or assist in their defense.
 *
 * Governed by Dusky v. United States, 362 U.S. 402 (1960), and state equivalents.
 * The standard: defendant must have (1) sufficient present ability to consult with
 * counsel with a reasonable degree of rational understanding, and (2) a rational
 * and factual understanding of the proceedings.
 *
 * Raising competency is mandatory when counsel has a genuine doubt — failure to do
 * so may constitute ineffective assistance of counsel.
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
    placeholder: "e.g., Superior Court of California, County of Alameda",
    required: true,
    helpText: "The full name of the court where the criminal case is pending",
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
    id: "prosecutorName",
    label: "Prosecutor / People",
    type: "party-name",
    placeholder: "e.g., The People of the State of California",
    required: true,
    helpText: "The name of the prosecuting party",
  },
  {
    id: "hearingDate",
    label: "Next Scheduled Hearing Date",
    type: "date",
    required: false,
    helpText: "Date of the next hearing at which this motion will be presented",
  },
  {
    id: "judgeName",
    label: "Presiding Judge",
    type: "text",
    placeholder: "Honorable [First] [Last]",
    required: false,
    helpText: "Name of the presiding judge",
  },
];

const chargeInfoInputs: TemplateInput[] = [
  {
    id: "chargesDescription",
    label: "Current Charges",
    type: "textarea",
    placeholder: "e.g., One count of Robbery (Penal Code § 211); one count of Assault with a Deadly Weapon (Penal Code § 245(a)(1))",
    required: true,
    helpText: "All pending charges with statutory citations",
    validation: { maxLength: 600 },
  },
  {
    id: "caseStage",
    label: "Current Stage of Proceedings",
    type: "select",
    required: true,
    helpText: "The current stage of the criminal case",
    validation: {
      options: [
        { value: "pre_arraignment", label: "Pre-Arraignment" },
        { value: "arraignment", label: "Arraignment" },
        { value: "preliminary_hearing", label: "Preliminary Hearing" },
        { value: "pre_trial", label: "Pre-Trial" },
        { value: "trial", label: "During Trial" },
        { value: "sentencing", label: "Pre-Sentencing" },
        { value: "post_conviction", label: "Post-Conviction / Appeal" },
      ],
    },
  },
  {
    id: "custodyStatus",
    label: "Custody Status",
    type: "select",
    required: true,
    validation: {
      options: [
        { value: "in_custody", label: "In Custody (County Jail)" },
        { value: "out_on_bail", label: "Out on Bail / Own Recognizance" },
        { value: "state_prison", label: "In State Prison" },
        { value: "federal_custody", label: "In Federal Custody" },
      ],
    },
  },
];

const competencyObservationsInputs: TemplateInput[] = [
  {
    id: "counselObservations",
    label: "Counsel's Observations Raising Doubt",
    type: "textarea",
    placeholder: "Describe specific behaviors, statements, or interactions that raised doubt about competency. Be concrete and specific:\n\n- Client was unable to explain what a jury is or what the charges mean after multiple explanations\n- Client made statements suggesting they believe the proceedings are part of a government conspiracy\n- Client refused to discuss case strategy and spoke incoherently during meetings\n- Client appeared to be responding to internal stimuli (auditory hallucinations) during court appearance\n- Client was unable to identify their own name on court documents",
    required: true,
    helpText: "Specific factual observations — the more concrete, the stronger the motion. Do not rely on general impressions.",
    validation: { minLength: 100, maxLength: 3000 },
  },
  {
    id: "mentalHealthHistory",
    label: "Known Mental Health History",
    type: "textarea",
    placeholder: "e.g., Client has prior diagnosis of schizophrenia; has been hospitalized three times at [facility]; currently prescribed [medication] but reports non-compliance. OR: Mental health history unknown — evaluation needed to assess.",
    required: false,
    helpText: "Prior psychiatric diagnoses, hospitalizations, medications, or other mental health history if known",
    validation: { maxLength: 1000 },
  },
  {
    id: "priorCompetencyHistory",
    label: "Prior Competency Proceedings",
    type: "textarea",
    placeholder: "e.g., Client was found incompetent in Case No. 2021-CR-5678 in this court and restored to competency after 90-day treatment at [facility]. OR: No prior competency proceedings known.",
    required: false,
    helpText: "Any prior competency evaluations or findings, in this or other cases",
    validation: { maxLength: 600 },
  },
  {
    id: "thirdPartyObservations",
    label: "Third-Party Observations (Family, Jail Staff)",
    type: "textarea",
    placeholder: "e.g., Client's mother reports he has not been taking medication and has been speaking irrationally. Jail medical records reflect two mental health referrals since arrest.",
    required: false,
    helpText: "Observations from family members, correctional staff, or others that corroborate competency concerns",
    validation: { maxLength: 800 },
  },
];

const evaluationRequestInputs: TemplateInput[] = [
  {
    id: "evaluatorPreference",
    label: "Requested Evaluator or Facility",
    type: "select",
    required: true,
    helpText: "Who should conduct the evaluation",
    validation: {
      options: [
        { value: "court_appointed", label: "Court-Appointed Evaluator (court's discretion)" },
        { value: "state_hospital", label: "State Hospital / Inpatient Evaluation" },
        { value: "outpatient", label: "Outpatient Evaluation" },
        { value: "defense_expert", label: "Defense-Retained Expert (to be identified)" },
        { value: "joint", label: "Joint Defense and Prosecution Evaluation" },
      ],
    },
  },
  {
    id: "evaluationScope",
    label: "Requested Scope of Evaluation",
    type: "select",
    required: true,
    helpText: "What the evaluation should assess",
    validation: {
      options: [
        { value: "competency_only", label: "Competency to Stand Trial Only" },
        { value: "competency_and_sanity", label: "Competency to Stand Trial and Mental State at Time of Offense (NGI)" },
        { value: "competency_and_treatment", label: "Competency and Treatment Recommendations" },
      ],
    },
  },
  {
    id: "proceedingsSuspension",
    label: "Relief Requested During Evaluation",
    type: "select",
    required: true,
    validation: {
      options: [
        { value: "suspend_all", label: "Suspend all criminal proceedings pending evaluation and hearing" },
        { value: "suspend_trial", label: "Suspend trial only; other proceedings may continue" },
        { value: "toll_speedy_trial", label: "Suspend proceedings and toll speedy trial clock" },
      ],
    },
  },
];

const attorneyInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "text",
    placeholder: "Full name",
    required: true,
  },
  {
    id: "firmName",
    label: "Firm / Office Name",
    type: "text",
    placeholder: "e.g., Public Defender, County of Riverside",
    required: false,
  },
  {
    id: "barNumber",
    label: "Bar Number",
    type: "text",
    placeholder: "e.g., State Bar No. 123456",
    required: false,
  },
  {
    id: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Street address, City, State, ZIP",
    required: true,
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    placeholder: "(xxx) xxx-xxxx",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "text",
    placeholder: "attorney@example.com",
    required: false,
  },
];

// ============================================================================
// Template Definition
// ============================================================================

export const motionForCompetencyEvaluationTemplate: DocumentTemplate = {
  id: "motion-for-competency-evaluation",
  name: "Motion for Competency Evaluation",
  category: "criminal",
  description:
    "Requests the court to suspend criminal proceedings and order a psychiatric or psychological evaluation to assess the defendant's competency to stand trial under Dusky v. United States, 362 U.S. 402 (1960). Filed when counsel has a bona fide doubt that the defendant can understand the proceedings or meaningfully assist in their defense. Raising competency is a constitutional obligation when doubt exists — failure to do so may constitute ineffective assistance of counsel.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],

  baseSections: [
    // Section 1: Caption
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 1,
      required: true,
      inputs: captionInputs,
    },

    // Section 2: Charge & Case Info
    {
      id: "caseInfo",
      name: "Case Information",
      type: "user-input",
      order: 2,
      required: true,
      inputs: chargeInfoInputs,
    },

    // Section 3: Factual Basis / Counsel Observations
    {
      id: "factualBasis",
      name: "Factual Basis for Doubt",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide specific observations giving rise to doubt about competency",
      inputs: competencyObservationsInputs,
    },

    // Section 4: Legal Standard (static)
    {
      id: "legalStandard",
      name: "Legal Standard",
      type: "static",
      order: 4,
      required: true,
      staticContent: `LEGAL STANDARD

The Due Process Clause of the Fourteenth Amendment prohibits the trial of a defendant who is mentally incompetent. Drope v. Missouri, 420 U.S. 162 (1975); Pate v. Robinson, 383 U.S. 375 (1966). A defendant is competent to stand trial if they have "sufficient present ability to consult with [their] lawyer with a reasonable degree of rational understanding" and possess "a rational as well as factual understanding of the proceedings against [them]." Dusky v. United States, 362 U.S. 402, 402 (1960).

The inquiry is not whether the defendant has a mental illness, but whether the illness, if present, presently impairs their ability to understand the proceedings and assist in their defense. Cooper v. Oklahoma, 517 U.S. 348 (1996).

When defense counsel has a bona fide doubt as to competency, raising the issue is not merely permitted — it is constitutionally required. Drope, 420 U.S. at 180. Courts must hold a competency hearing whenever there is sufficient doubt. The failure to raise competency when grounds exist may constitute ineffective assistance of counsel. See Drope, 420 U.S. at 176.`,
    },

    // Section 5: Argument (AI-generated)
    {
      id: "argument",
      name: "Argument",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI-generated legal argument based on counsel's observations",
      aiPromptTemplate: `Write the legal argument section of a Motion for Competency Evaluation on behalf of {{defendantName}}, charged with {{chargesDescription}} in {{courtName}} (Case No. {{caseNumber}}).

Current stage of proceedings: {{caseStage}}
Custody status: {{custodyStatus}}

Counsel's specific observations raising doubt:
{{counselObservations}}

Known mental health history:
{{mentalHealthHistory}}

Prior competency proceedings:
{{priorCompetencyHistory}}

Third-party observations:
{{thirdPartyObservations}}

Write 3-5 paragraphs arguing that:
1. Counsel has a bona fide doubt about the defendant's competency — cite the specific observed behaviors
2. The Dusky standard is not met based on these observations — tie the facts to the two prongs (rational understanding + ability to assist)
3. A competency evaluation is therefore constitutionally required
4. The specific evaluation requested ({{evaluatorPreference}}, scope: {{evaluationScope}}) is appropriate
5. Criminal proceedings must be suspended pending the evaluation and a competency hearing

Use Dusky v. United States, Drope v. Missouri, and Pate v. Robinson as foundational citations. Reference state-specific competency statute if the case appears to be in state court.

Be specific — tie the legal argument directly to the factual observations provided. Do not use generic boilerplate.`,
      aiInstructions: "Ground the argument in the specific facts provided by counsel. The more specific the factual basis, the more persuasive the argument. Always tie the observations back to the Dusky two-part test.",
    },

    // Section 6: Relief Requested
    {
      id: "reliefRequested",
      name: "Relief Requested",
      type: "user-input",
      order: 6,
      required: true,
      inputs: evaluationRequestInputs,
    },

    // Section 7: Prayer for Relief (static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 7,
      required: true,
      staticContent: `WHEREFORE, defendant {{defendantName}}, by and through undersigned counsel, respectfully requests that this Court:

1. Suspend all criminal proceedings pending the outcome of a competency evaluation and hearing;

2. Order a {{evaluationScope}} by {{evaluatorPreference}};

3. Schedule a competency hearing following completion of the evaluation; and

4. Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

_________________________________
{{attorneyName}}
{{firmName}}
{{barNumber}}
{{address}}
{{phone}}
{{email}}

Attorney for Defendant {{defendantName}}

Date: _______________________`,
    },

    // Section 8: Attorney Info
    {
      id: "attorneyInfo",
      name: "Attorney Information",
      type: "user-input",
      order: 8,
      required: true,
      inputs: attorneyInputs,
    },

    // Section 9: Certificate of Service
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 9,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date indicated below, I served a copy of the foregoing Motion for Competency Evaluation and any supporting documents upon the prosecuting attorney of record by [electronic filing / first-class mail / hand delivery].

_________________________________
{{attorneyName}}
Date: _______________________`,
    },
  ],
};
