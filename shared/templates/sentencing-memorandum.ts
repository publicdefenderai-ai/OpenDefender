/**
 * Sentencing Memorandum Template
 *
 * Criminal law document submitted to the court before sentencing to advocate for
 * a favorable sentence. Presents mitigating factors, client background, community
 * ties, and a specific sentencing recommendation. One of the most impactful documents
 * a defense attorney can file.
 *
 * Applies at both state and federal sentencing. Federal cases also reference
 * 18 U.S.C. § 3553(a) sentencing factors.
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
    helpText: "The full name of the sentencing court",
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
    id: "sentencingDate",
    label: "Scheduled Sentencing Date",
    type: "date",
    required: true,
    helpText: "The date sentencing is scheduled to occur",
  },
  {
    id: "judgeName",
    label: "Presiding Judge",
    type: "text",
    placeholder: "Honorable [First] [Last]",
    required: true,
    helpText: "The full name of the sentencing judge",
  },
];

const convictionInputs: TemplateInput[] = [
  {
    id: "convictionMethod",
    label: "Conviction Method",
    type: "select",
    required: true,
    helpText: "How the conviction was entered",
    validation: {
      options: [
        { value: "guilty_plea", label: "Guilty Plea" },
        { value: "no_contest", label: "No Contest / Nolo Contendere" },
        { value: "jury_verdict", label: "Jury Verdict" },
        { value: "bench_verdict", label: "Bench Trial Verdict" },
      ],
    },
  },
  {
    id: "offenseDescription",
    label: "Offense(s) of Conviction",
    type: "textarea",
    placeholder: "e.g., One count of Possession of Controlled Substance (Health & Safety Code § 11350(a))",
    required: true,
    helpText: "List all charges with statutory citations to which the defendant was convicted",
    validation: { maxLength: 800 },
  },
  {
    id: "pleaAgreementTerms",
    label: "Plea Agreement / Agreed Sentence (if any)",
    type: "textarea",
    placeholder: "e.g., Open plea — no agreed sentence. OR: Agreed to probation and 180 days.",
    required: false,
    helpText: "Summarize any agreed sentencing terms. Leave blank if open plea or jury conviction.",
    validation: { maxLength: 500 },
  },
  {
    id: "recommendedSentence",
    label: "Defense Sentencing Recommendation",
    type: "textarea",
    placeholder: "e.g., Probation with 90 days county jail, suspended, with drug treatment program",
    required: true,
    helpText: "The specific sentence defense is requesting — be concrete",
    validation: { maxLength: 500 },
  },
  {
    id: "prosecutionRecommendation",
    label: "Prosecution's Recommended Sentence (if known)",
    type: "textarea",
    placeholder: "e.g., Two years state prison",
    required: false,
    helpText: "The sentence recommended by the prosecution, if known",
    validation: { maxLength: 300 },
  },
];

const clientBackgroundInputs: TemplateInput[] = [
  {
    id: "clientAge",
    label: "Client Age",
    type: "number",
    required: true,
    placeholder: "e.g., 27",
    helpText: "Client's age at time of sentencing",
  },
  {
    id: "clientBackground",
    label: "Client Personal Background",
    type: "textarea",
    placeholder: "Include: upbringing, family situation, education, employment history, community ties, housing stability, health issues (physical and mental), substance use history, any trauma or hardship",
    required: true,
    helpText: "Provide a narrative of the client's life circumstances. The more detail you provide, the stronger the AI-generated section will be.",
    validation: { minLength: 100, maxLength: 3000 },
  },
  {
    id: "rehabilitationEfforts",
    label: "Rehabilitation and Positive Steps",
    type: "textarea",
    placeholder: "e.g., Enrolled in substance abuse treatment, maintained employment, completed community service, attending parenting classes, letters of support from family/employer/clergy",
    required: false,
    helpText: "Any steps the client has taken since the offense showing rehabilitation or acceptance of responsibility",
    validation: { maxLength: 1500 },
  },
  {
    id: "dependents",
    label: "Dependents / Family Obligations",
    type: "textarea",
    placeholder: "e.g., Primary caregiver for two minor children ages 4 and 7; caring for elderly mother with dementia",
    required: false,
    helpText: "Children, elderly parents, or others who depend on the defendant",
    validation: { maxLength: 500 },
  },
  {
    id: "priorRecord",
    label: "Prior Criminal Record",
    type: "textarea",
    placeholder: "e.g., No prior record. OR: One prior misdemeanor DUI (2019), completed probation successfully.",
    required: true,
    helpText: "Summarize prior criminal history. A clean or minimal record is an important mitigating factor.",
    validation: { maxLength: 500 },
  },
  {
    id: "offenseCircumstances",
    label: "Circumstances of the Offense",
    type: "textarea",
    placeholder: "e.g., Conduct was aberrational; defendant was struggling with unemployment and untreated addiction; no violence involved; victim has indicated willingness to reconcile",
    required: true,
    helpText: "Provide context about how and why the offense occurred — what makes this case different from the worst version of this crime",
    validation: { maxLength: 1500 },
  },
];

const supportingMaterialsInputs: TemplateInput[] = [
  {
    id: "exhibitList",
    label: "Supporting Exhibits (Letters, Records, Certificates)",
    type: "textarea",
    placeholder: "e.g., Exhibit A — Letter from employer; Exhibit B — Drug treatment completion certificate; Exhibit C — Letter from pastor",
    required: false,
    helpText: "List all supporting documents being attached. Reference these by exhibit letter in the AI-generated sections.",
    validation: { maxLength: 1000 },
  },
  {
    id: "psrDisputes",
    label: "Disputes with Probation Report (PSR/PSIR)",
    type: "textarea",
    placeholder: "e.g., Defense disputes the prior conviction listed on page 4 — records show this was dismissed. Defense also objects to the victim impact statement characterization on page 7.",
    required: false,
    helpText: "Note any factual inaccuracies or legal objections to the probation/pre-sentence report",
    validation: { maxLength: 1000 },
  },
];

const attorneyInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "text",
    placeholder: "Full name",
    required: true,
    helpText: "Counsel's full name",
  },
  {
    id: "firmName",
    label: "Firm / Office Name",
    type: "text",
    placeholder: "e.g., Los Angeles County Public Defender",
    required: false,
    helpText: "Law firm or public defender office name",
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

export const sentencingMemorandumTemplate: DocumentTemplate = {
  id: "sentencing-memorandum",
  name: "Sentencing Memorandum",
  category: "criminal",
  description:
    "A comprehensive sentencing memorandum filed before sentencing to advocate for a favorable disposition. Presents mitigating factors, the client's personal history, rehabilitation efforts, family obligations, and a specific sentencing recommendation. Applies in both state and federal courts. One of the most impactful filings defense counsel makes.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "30-45 minutes",
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
      helpText: "Court and case identification information",
      inputs: captionInputs,
    },

    // Section 2: Conviction Summary
    {
      id: "convictionSummary",
      name: "Conviction & Sentencing Recommendation",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Details of the conviction and the sentence defense is requesting",
      inputs: convictionInputs,
    },

    // Section 3: Introduction (static + AI opening)
    {
      id: "introduction",
      name: "Introduction",
      type: "ai-generated",
      order: 3,
      required: true,
      helpText: "Opening paragraph framing the memorandum",
      aiPromptTemplate: `Write a one-paragraph introduction for a sentencing memorandum filed on behalf of {{defendantName}}, who was convicted of {{offenseDescription}} by {{convictionMethod}} and is scheduled for sentencing on {{sentencingDate}} before {{judgeName}} in {{courtName}} (Case No. {{caseNumber}}).

The introduction should:
- Identify who defense counsel represents and the purpose of the memorandum
- Briefly preview the sentencing recommendation: {{recommendedSentence}}
- Set a respectful, humanizing tone
- Be concise (2-4 sentences)`,
      aiInstructions: "Write a professional, respectful introduction. Do not overstate or make promises. Use the defendant's name to humanize them from the first sentence.",
    },

    // Section 4: Client Background
    {
      id: "clientBackground",
      name: "Client Background",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Personal history, family, employment, and life circumstances",
      inputs: clientBackgroundInputs,
    },

    // Section 5: Personal History Narrative (AI-generated)
    {
      id: "personalHistoryNarrative",
      name: "Personal History Narrative",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI-drafted narrative of the client's personal history for the court",
      aiPromptTemplate: `Write a compelling personal history section for a sentencing memorandum on behalf of {{defendantName}}, age {{clientAge}}.

Background provided by counsel:
{{clientBackground}}

Rehabilitation and positive steps:
{{rehabilitationEfforts}}

Dependents and family obligations:
{{dependents}}

Prior criminal record:
{{priorRecord}}

Write a 3-5 paragraph personal history narrative that:
- Presents the client as a full human being, not defined solely by the offense
- Covers upbringing, education, employment, family, and community ties
- Acknowledges any hardships, trauma, or systemic factors with specificity
- Notes rehabilitation efforts and positive steps taken since the offense
- Mentions dependents and the impact of incarceration on them if applicable
- References a minimal/clean record as a mitigating factor if applicable
- Uses professional legal memo tone — not sensationalized, not bureaucratic
- Avoids clichés like "he had a difficult childhood" — be specific

Do not invent facts not provided. If information is sparse, note what is known and keep the section proportionate.`,
      aiInstructions: "Write with dignity and specificity. Ground claims in the facts provided. This section should help the judge see the whole person.",
    },

    // Section 6: Circumstances of the Offense (AI-generated)
    {
      id: "offenseCircumstancesSection",
      name: "Circumstances of the Offense",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "Contextual analysis of why this case warrants a lenient sentence",
      aiPromptTemplate: `Write the "Circumstances of the Offense" section for a sentencing memorandum for {{defendantName}} convicted of {{offenseDescription}}.

Defense counsel's summary of the offense circumstances:
{{offenseCircumstances}}

Prosecution's recommended sentence (for context): {{prosecutionRecommendation}}

Write 2-4 paragraphs that:
- Provide context for the offense without minimizing it
- Distinguish the conduct from the most serious versions of this offense (e.g., no violence, no victim injury, aberrational behavior)
- Highlight any factors showing this was atypical for this defendant
- If relevant, note acceptance of responsibility
- Avoid making factual claims not supported by what counsel provided
- Use measured, professional tone`,
      aiInstructions: "Be honest about the offense while providing context. Avoid suggesting the defendant is blameless if they pled guilty — focus on context and proportionality.",
    },

    // Section 7: Mitigating Factors & Sentencing Argument (AI-generated)
    {
      id: "mitigatingFactors",
      name: "Mitigating Factors & Sentencing Argument",
      type: "ai-generated",
      order: 7,
      required: true,
      helpText: "Core legal argument for the recommended sentence",
      aiPromptTemplate: `Write the mitigating factors and sentencing argument section for {{defendantName}}'s sentencing memorandum.

Offense: {{offenseDescription}}
Defense recommendation: {{recommendedSentence}}
Prosecution recommendation: {{prosecutionRecommendation}}
Prior record: {{priorRecord}}
Rehabilitation: {{rehabilitationEfforts}}
Supporting exhibits: {{exhibitList}}

Write 3-5 paragraphs that:
- Argue why the recommended sentence is appropriate and proportionate
- Cite specific mitigating factors: minimal/no record, acceptance of responsibility, rehabilitation efforts, family ties, employment, mental health, substance abuse treatment
- If applicable, reference 18 U.S.C. § 3553(a) factors (nature/circumstances, deterrence, protection of public, rehabilitation needs) for federal court — or the state equivalent
- Reference any supporting exhibits (letters, certificates) by exhibit designation
- Counter the prosecution's recommendation if one is stated, with specific reasoning
- Close by explicitly asking the court to impose: {{recommendedSentence}}`,
      aiInstructions: "This is the persuasive core of the document. Be specific, not generic. Reference the actual facts provided rather than boilerplate. Cite relevant statutory sentencing factors where appropriate.",
    },

    // Section 8: PSR Disputes (conditional, AI-generated)
    {
      id: "psrDisputes",
      name: "Objections to Pre-Sentence Report",
      type: "ai-generated",
      order: 8,
      required: false,
      helpText: "Formal objections to the probation/pre-sentence report (omit if no disputes)",
      aiPromptTemplate: `Write an objections section for the pre-sentence/probation report in {{defendantName}}'s sentencing memorandum.

Disputes noted by counsel:
{{psrDisputes}}

Write a concise section (1-3 paragraphs) that:
- Formally objects to each disputed item in the PSR
- States the correct fact or legal position for each objection
- Requests the court to note the objections in the record and correct the report
- Uses professional, direct language

If the disputes section is blank or says "none," write: "Defense counsel has reviewed the pre-sentence report and has no factual objections."`,
      aiInstructions: "Be precise. Each objection should clearly state what is wrong and what the correct information is.",
    },

    // Section 9: Conclusion
    {
      id: "conclusion",
      name: "Conclusion",
      type: "ai-generated",
      order: 9,
      required: true,
      helpText: "Closing paragraph and formal prayer for relief",
      aiPromptTemplate: `Write a brief conclusion (1-2 paragraphs) for {{defendantName}}'s sentencing memorandum.

Recommended sentence: {{recommendedSentence}}
Offense: {{offenseDescription}}

The conclusion should:
- Summarize the core argument in one sentence
- Formally request the court impose the specific sentence: {{recommendedSentence}}
- Thank the court for its consideration
- Be respectful and direct`,
      aiInstructions: "Keep this concise. Restate the ask clearly. End on a respectful note.",
    },

    // Section 10: Supporting Materials & Signature
    {
      id: "supportingMaterials",
      name: "Supporting Exhibits & Attorney Information",
      type: "user-input",
      order: 10,
      required: false,
      helpText: "List exhibits and provide attorney signature block",
      inputs: [...supportingMaterialsInputs, ...attorneyInputs],
    },

    // Section 11: Signature Block (static)
    {
      id: "signatureBlock",
      name: "Signature Block",
      type: "static",
      order: 11,
      required: true,
      staticContent: `Respectfully submitted,

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

    // Section 12: Certificate of Service
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 12,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date indicated below, I served a copy of the foregoing Sentencing Memorandum upon the prosecuting attorney of record by [electronic filing / first-class mail / hand delivery].

_________________________________
{{attorneyName}}
Date: _______________________`,
    },
  ],
};
