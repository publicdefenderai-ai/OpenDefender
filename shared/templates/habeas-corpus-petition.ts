/**
 * Petition for Writ of Habeas Corpus Template
 *
 * Criminal law document template for challenging the legality of detention or conviction.
 * Filed under 28 U.S.C. § 2254 (state prisoners), 28 U.S.C. § 2255 (federal prisoners),
 * or state habeas statutes. Common grounds include ineffective assistance of counsel,
 * constitutional violations, newly discovered evidence of innocence, prosecutorial misconduct,
 * and illegal sentence. Subject to AEDPA's one-year statute of limitations for federal petitions.
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


const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., District Court, Superior Court",
    required: true,
    helpText: "The full name of the court where the petition is being filed",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., 2024-HC-001234",
    required: true,
    helpText: "The assigned case or docket number for the habeas petition",
  },
  {
    id: "petitionerName",
    label: "Petitioner Name",
    type: "party-name",
    placeholder: "Full legal name",
    required: true,
    helpText: "The petitioner's full legal name as it appears in court records",
  },
];

const convictionDetailsInputs: TemplateInput[] = [
  {
    id: "convictionDate",
    label: "Date of Conviction",
    type: "date",
    required: true,
    helpText: "The date the conviction was entered",
  },
  {
    id: "convictionCourt",
    label: "Court That Imposed Conviction",
    type: "text",
    placeholder: "e.g., Circuit Court of Cook County, Illinois",
    required: true,
    helpText: "The full name of the court that entered the conviction and sentence",
  },
  {
    id: "originalCaseNumber",
    label: "Original Criminal Case Number",
    type: "text",
    placeholder: "e.g., 2020-CR-005678",
    required: true,
    helpText: "The case number from the original criminal proceeding",
  },
  {
    id: "convictionCharges",
    label: "Charges of Conviction",
    type: "textarea",
    placeholder: "List the charges for which the petitioner was convicted...",
    required: true,
    helpText: "The specific charges on which the petitioner was convicted",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
  {
    id: "sentenceImposed",
    label: "Sentence Imposed",
    type: "textarea",
    placeholder: "Describe the sentence imposed (term of imprisonment, probation, fines, etc.)...",
    required: true,
    helpText: "Full description of the sentence imposed by the court",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
  {
    id: "sentenceDate",
    label: "Date of Sentencing",
    type: "date",
    required: true,
    helpText: "The date the sentence was imposed",
  },
  {
    id: "currentCustodyStatus",
    label: "Current Custody Status",
    type: "select",
    required: true,
    helpText: "The petitioner's current custodial status",
    validation: {
      options: [
        { value: "incarcerated", label: "Incarcerated" },
        { value: "on_parole", label: "On Parole" },
        { value: "on_probation", label: "On Probation" },
        { value: "on_supervised_release", label: "On Supervised Release" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "currentFacility",
    label: "Current Place of Incarceration",
    type: "text",
    placeholder: "e.g., FCI Terre Haute, State Correctional Institution",
    required: false,
    helpText: "The facility where the petitioner is currently incarcerated, if applicable",
  },
  {
    id: "petitionType",
    label: "Type of Habeas Petition",
    type: "select",
    required: true,
    helpText: "Select the statutory basis for this habeas petition",
    validation: {
      options: [
        { value: "section_2254", label: "28 U.S.C. § 2254 (State Conviction)" },
        { value: "section_2255", label: "28 U.S.C. § 2255 (Federal Conviction)" },
        { value: "state_habeas", label: "State Habeas Corpus Statute" },
      ],
    },
  },
];

const proceduralHistoryInputs: TemplateInput[] = [
  {
    id: "directAppealFiled",
    label: "Direct Appeal Filed",
    type: "select",
    required: true,
    helpText: "Whether a direct appeal was filed from the conviction",
    validation: {
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "pending", label: "Pending" },
      ],
    },
  },
  {
    id: "directAppealResult",
    label: "Result of Direct Appeal",
    type: "textarea",
    placeholder: "Describe the result of the direct appeal...",
    required: false,
    helpText: "The outcome of the direct appeal, if applicable",
    validation: {
      maxLength: 2000,
    },
  },
  {
    id: "directAppealDate",
    label: "Date Appeal Decided",
    type: "date",
    required: false,
    helpText: "The date the direct appeal was decided, if applicable",
  },
  {
    id: "priorHabeasPetitions",
    label: "Prior Habeas Petitions",
    type: "select",
    required: true,
    helpText: "Whether any prior habeas petitions have been filed",
    validation: {
      options: [
        { value: "none", label: "None" },
        { value: "one", label: "One" },
        { value: "multiple", label: "Multiple" },
      ],
    },
  },
  {
    id: "priorPetitionDetails",
    label: "Details of Prior Petitions",
    type: "textarea",
    placeholder: "Describe any prior habeas petitions, including case numbers and outcomes...",
    required: false,
    helpText: "Details of any prior habeas petitions filed, including disposition",
    validation: {
      maxLength: 2000,
    },
  },
  {
    id: "stateRemediesExhausted",
    label: "State Remedies Exhausted",
    type: "select",
    required: true,
    helpText: "Whether all available state remedies have been exhausted",
    validation: {
      options: [
        { value: "yes_all", label: "Yes, All State Remedies Exhausted" },
        { value: "yes_partial", label: "Yes, Partially Exhausted" },
        { value: "no_explain", label: "No — Explanation Required" },
      ],
    },
  },
  {
    id: "exhaustionExplanation",
    label: "Exhaustion Explanation",
    type: "textarea",
    placeholder: "Explain which state remedies were pursued and their outcomes, or why exhaustion is not required...",
    required: false,
    helpText: "Explain the exhaustion of state remedies or why exhaustion should be excused",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "aepdaTimeliness",
    label: "AEDPA Timeliness",
    type: "textarea",
    placeholder: "Explain when the conviction became final, any tolling periods, and why this petition is timely...",
    required: true,
    helpText: "Explain how this petition satisfies AEDPA's one-year statute of limitations, including when the conviction became final and any statutory or equitable tolling",
    validation: {
      minLength: 20,
      maxLength: 3000,
    },
  },
];

const groundsForReliefInputs: TemplateInput[] = [
  {
    id: "primaryGround",
    label: "Primary Ground for Relief",
    type: "select",
    required: true,
    helpText: "Select the primary constitutional ground for habeas relief",
    validation: {
      options: [
        { value: "ineffective_assistance", label: "Ineffective Assistance of Counsel (Strickland v. Washington)" },
        { value: "constitutional_violation", label: "Constitutional Violation (Due Process, Equal Protection)" },
        { value: "newly_discovered_evidence", label: "Newly Discovered Evidence of Actual Innocence" },
        { value: "prosecutorial_misconduct", label: "Prosecutorial Misconduct (Brady/Napue Violations)" },
        { value: "illegal_sentence", label: "Illegal or Unauthorized Sentence" },
        { value: "jury_trial_violation", label: "Denial of Right to Jury Trial" },
        { value: "confrontation_clause", label: "Confrontation Clause Violation" },
        { value: "double_jeopardy", label: "Double Jeopardy" },
        { value: "plea_involuntary", label: "Involuntary Guilty Plea" },
        { value: "other", label: "Other Constitutional Ground" },
      ],
    },
  },
  {
    id: "groundsDescription",
    label: "Detailed Factual Description of Grounds",
    type: "textarea",
    placeholder: "Provide a detailed factual description of the grounds supporting this petition...",
    required: true,
    helpText: "Explain in detail the factual basis for each ground raised. For ineffective assistance claims, describe what counsel did or failed to do and how it affected the outcome. For actual innocence, describe the new evidence.",
    validation: {
      minLength: 100,
      maxLength: 5000,
    },
  },
  {
    id: "additionalGrounds",
    label: "Additional / Secondary Grounds",
    type: "textarea",
    placeholder: "Describe any additional grounds for relief (optional)...",
    required: false,
    helpText: "If there are additional constitutional grounds beyond the primary ground",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "prejudiceDescription",
    label: "Prejudice — How the Error Affected the Outcome",
    type: "textarea",
    placeholder: "Explain how the constitutional error affected the outcome of the trial or plea...",
    required: true,
    helpText: "Describe how the identified error materially affected the outcome of the proceeding. For Strickland claims, explain how the result would have been different but for counsel's errors.",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "supportingEvidence",
    label: "Supporting Evidence / Documentation",
    type: "textarea",
    placeholder: "List supporting evidence (affidavits, transcripts, forensic evidence, witness statements, etc.)...",
    required: false,
    helpText: "Describe any supporting evidence or exhibits that will be attached to this petition",
    validation: {
      maxLength: 3000,
    },
  },
];

const reliefAndCoaInputs: TemplateInput[] = [
  {
    id: "reliefSought",
    label: "Relief Sought",
    type: "select",
    required: true,
    helpText: "Select the specific relief being requested",
    validation: {
      options: [
        { value: "vacate_conviction", label: "Vacate Conviction" },
        { value: "vacate_sentence", label: "Vacate Sentence Only" },
        { value: "new_trial", label: "Order New Trial" },
        { value: "resentencing", label: "Order Resentencing" },
        { value: "evidentiary_hearing", label: "Request Evidentiary Hearing" },
        { value: "other", label: "Other Relief" },
      ],
    },
  },
  {
    id: "coaRequested",
    label: "Certificate of Appealability",
    type: "select",
    required: true,
    helpText: "Whether a Certificate of Appealability is being requested",
    validation: {
      options: [
        { value: "yes", label: "Yes, Request Certificate of Appealability" },
        { value: "no", label: "Not applicable at this time" },
      ],
    },
  },
  {
    id: "hearingRequested",
    label: "Hearing Preference",
    type: "select",
    required: true,
    helpText: "Whether you are requesting an evidentiary hearing or submitting on papers",
    validation: {
      options: [
        { value: "yes", label: "Evidentiary hearing requested" },
        { value: "no", label: "Submit on papers" },
      ],
    },
  },
];

const baseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Case Caption",
    type: "user-input",
    order: 1,
    inputs: captionInputs,
    required: true,
    helpText: "Enter court and case information for the petition caption.",
  },
  {
    id: "convictionDetails",
    name: "Conviction Details",
    type: "user-input",
    order: 2,
    inputs: convictionDetailsInputs,
    required: true,
    helpText: "Provide details about the underlying conviction and sentence.",
  },
  {
    id: "proceduralHistory",
    name: "Procedural History",
    type: "user-input",
    order: 3,
    inputs: proceduralHistoryInputs,
    required: true,
    helpText: "Describe the procedural history including appeals, prior petitions, and exhaustion of remedies.",
  },
  {
    id: "groundsForRelief",
    name: "Grounds for Relief",
    type: "user-input",
    order: 4,
    inputs: groundsForReliefInputs,
    required: true,
    helpText: "Describe the constitutional grounds for habeas relief.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a petition for writ of habeas corpus.

Conviction date: {{convictionDate}}
Conviction court: {{convictionCourt}}
Original case number: {{originalCaseNumber}}
Charges of conviction: {{convictionCharges}}
Sentence imposed: {{sentenceImposed}}
Sentence date: {{sentenceDate}}
Current custody status: {{currentCustodyStatus}}
Current facility: {{currentFacility}}
Petition type: {{petitionType}}
Direct appeal filed: {{directAppealFiled}}
Direct appeal result: {{directAppealResult}}
Direct appeal date: {{directAppealDate}}
Prior habeas petitions: {{priorHabeasPetitions}}
Prior petition details: {{priorPetitionDetails}}
State remedies exhausted: {{stateRemediesExhausted}}
Exhaustion explanation: {{exhaustionExplanation}}
AEDPA timeliness: {{aepdaTimeliness}}
Primary ground: {{primaryGround}}
Detailed grounds: {{groundsDescription}}
Additional grounds: {{additionalGrounds}}
Prejudice description: {{prejudiceDescription}}
Supporting evidence: {{supportingEvidence}}
Relief sought: {{reliefSought}}
Certificate of appealability requested: {{coaRequested}}
Hearing requested: {{hearingRequested}}
Petitioner name: the petitioner

Requirements:
- Generate 5-8 paragraphs arguing:
  1. State the applicable legal standard (AEDPA deference for § 2254, de novo for § 2255)
  2. Apply the standard to the specific grounds raised by the petitioner
  3. Address exhaustion of state remedies and procedural default, if applicable
  4. For ineffective assistance of counsel claims: apply the Strickland two-prong test (deficient performance + prejudice)
  5. For actual innocence claims: apply the Schlup v. Delo gateway standard
  6. Address AEDPA's "contrary to / unreasonable application of" clearly established federal law standard for § 2254 petitions
  7. Cite applicable case law including Strickland v. Washington, 466 U.S. 668 (1984); Schlup v. Delo, 513 U.S. 298 (1995); Williams v. Taylor, 529 U.S. 362 (2000)
  8. Address the timeliness of the petition under AEDPA's one-year statute of limitations
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a habeas corpus petition. For § 2254 petitions, apply AEDPA's deferential standard — relief is available only if the state court's decision was 'contrary to, or involved an unreasonable application of, clearly established Federal law' or 'was based on an unreasonable determination of the facts.' For § 2255 petitions, apply de novo review. For ineffective assistance claims, apply the Strickland two-prong test requiring both deficient performance and prejudice. For actual innocence gateway claims, apply the Schlup v. Delo standard requiring the petitioner to show that it is more likely than not that no reasonable juror would have convicted in light of the new evidence. Address exhaustion of state remedies (28 U.S.C. § 2254(b)), procedural default, and AEDPA timeliness. Cite Strickland v. Washington, 466 U.S. 668 (1984); Schlup v. Delo, 513 U.S. 298 (1995); Williams v. Taylor, 529 U.S. 362 (2000); and other applicable authorities. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the grounds and procedural history provided.",
  },
  {
    id: "reliefAndCoa",
    name: "Relief Requested & Certificate of Appealability",
    type: "user-input",
    order: 6,
    inputs: reliefAndCoaInputs,
    required: true,
    helpText: "Specify the relief requested, whether a Certificate of Appealability is sought, and hearing preference.",
  },
];

interface StateRuleData {
  rule: string;
  standard: string;
  timeLimits: string;
  keyCaseLaw: string;
  counties?: { value: string; label: string }[];
  countyLabel?: string;
}

const stateRules: Record<string, StateRuleData> = {
  AL: {
    rule: "Ala. R. Crim. P. 32",
    standard: "post-conviction relief petition; must show constitutional violation, illegal sentence, or newly discovered material facts",
    timeLimits: "within 1 year of certificate of judgment for most claims; 2 years for newly discovered evidence",
    keyCaseLaw: "Ex parte Hinton, 172 So. 3d 803 (Ala. 2012)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. App. P. 209; AS 12.72",
    standard: "application for post-conviction relief; petitioner must show denial of constitutional rights",
    timeLimits: "within 18 months of conviction or discovery of claim",
    keyCaseLaw: "Risher v. State, 523 P.2d 421 (Alaska 1974)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 32 & 33",
    standard: "post-conviction relief; Rule 32 for of-right proceedings, Rule 33 for successive petitions requiring colorable claim",
    timeLimits: "Rule 32 of-right: within 90 days of sentencing; Rule 33: varies by claim",
    keyCaseLaw: "State v. Shrum, 220 Ariz. 115 (2009)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 37",
    standard: "post-conviction petition; grounds include constitutional violation, lack of jurisdiction, illegal sentence",
    timeLimits: "within 90 days after entry of judgment for sentences over 10 years; 60 days for others",
    keyCaseLaw: "Sanders v. State, 352 Ark. 16 (2003)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code §§ 1473-1508",
    standard: "petition for writ of habeas corpus; petitioner must show unlawful restraint based on constitutional violation, new evidence, or false evidence",
    timeLimits: "no statutory deadline but unreasonable delay may bar relief",
    keyCaseLaw: "In re Clark, 5 Cal. 4th 750 (1993)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 35(c)",
    standard: "post-conviction motion; defendant must show sentence was imposed in violation of constitution or laws, or court lacked jurisdiction",
    timeLimits: "within 3 years for class 2-6 felonies; within 5 years for class 1 felonies; 18 months for misdemeanors",
    keyCaseLaw: "People v. Wiedemer, 852 P.2d 424 (Colo. 1993)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Gen. Stat. § 52-466; Practice Book § 23-24",
    standard: "petition for writ of habeas corpus; must demonstrate actual prejudice from constitutional violation",
    timeLimits: "no statutory limit but laches defense available; must show due diligence",
    keyCaseLaw: "Summerville v. Warden, 229 Conn. 397 (1994)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 61",
    standard: "post-conviction relief; must show counsel was constitutionally ineffective, jurisdiction was lacking, or other constitutional violation",
    timeLimits: "within 1 year of final order of conviction; 2 years for newly discovered evidence",
    keyCaseLaw: "Younger v. State, 580 A.2d 552 (Del. 1990)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Code § 23-110",
    standard: "motion to vacate, set aside, or correct sentence; grounds parallel 28 U.S.C. § 2255",
    timeLimits: "must be filed with reasonable promptness; no strict statutory deadline",
    keyCaseLaw: "Watson v. United States, 536 A.2d 1056 (D.C. 1987)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.850",
    standard: "post-conviction relief motion; must allege facts not conclusively rebutted by the record showing constitutional violation",
    timeLimits: "within 2 years of judgment and sentence becoming final",
    keyCaseLaw: "Strickland v. Washington, 466 U.S. 668 (1984) (originated from FL case)",
  },
  GA: {
    rule: "O.C.G.A. § 9-14-42",
    standard: "habeas corpus petition; must show substantial violation of constitutional rights",
    timeLimits: "no statutory time limit but laches may apply; diligence required",
    keyCaseLaw: "Turpin v. Todd, 268 Ga. 820 (1997)",
  },
  HI: {
    rule: "Haw. R. Penal P. 40",
    standard: "post-conviction proceeding; must show illegal restraint or constitutional violation not previously addressed",
    timeLimits: "within 2 years of final judgment or discovery of new evidence; extraordinary circumstances exception",
    keyCaseLaw: "Dan v. State, 76 Haw. 423 (1994)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Code §§ 19-4901 to 19-4911 (UPCPA)",
    standard: "post-conviction relief; must show conviction violated constitutional rights, evidence of material facts not previously presented, or sentence exceeded maximum",
    timeLimits: "within 1 year of conviction becoming final or discovery of new evidence",
    keyCaseLaw: "Palmer v. Dermitt, 102 Idaho 591 (1981)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/122-1 (Post-Conviction Hearing Act)",
    standard: "post-conviction petition; must show substantial deprivation of constitutional rights at trial or sentencing",
    timeLimits: "within 2 years of conviction (non-capital); no limit for death penalty cases; 3 years for newly discovered evidence",
    keyCaseLaw: "People v. Hodges, 234 Ill. 2d 1 (2009)",
  },
  IN: {
    rule: "Ind. R. Post-Conviction Relief 1",
    standard: "post-conviction relief; must show conviction or sentence violated constitution, or new evidence of innocence",
    timeLimits: "no statutory deadline for initial petition; successive petitions require leave of court",
    keyCaseLaw: "Ben-Yisrayl v. State, 729 N.E.2d 102 (Ind. 2000)",
  },
  IA: {
    rule: "Iowa Code § 822.2 (Post-Conviction Relief Act)",
    standard: "application for post-conviction relief; must show constitutional violation, new evidence, or sentence in violation of law",
    timeLimits: "within 3 years of conviction becoming final; exceptions for newly discovered evidence and constitutional claims",
    keyCaseLaw: "Lado v. State, 804 N.W.2d 248 (Iowa 2011)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 60-1507",
    standard: "motion to vacate/correct sentence; must show sentence imposed in violation of constitution, court lacked jurisdiction, or sentence exceeds maximum",
    timeLimits: "within 1 year of final order; extensions for manifest injustice",
    keyCaseLaw: "Bellamy v. State, 285 Kan. 346 (2007)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "KRS 11.42; CR 60.02",
    standard: "post-conviction motion; RCr 11.42 for constitutional claims; CR 60.02 for extraordinary relief",
    timeLimits: "RCr 11.42: within 3 years of judgment; CR 60.02: reasonable time",
    keyCaseLaw: "Leonard v. Commonwealth, 279 S.W.3d 151 (Ky. 2009)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 924-930.8",
    standard: "application for post-conviction relief; must show constitutional violation, illegal sentence, or new material evidence",
    timeLimits: "within 2 years of conviction becoming final; 1 year for new evidence claims",
    keyCaseLaw: "State ex rel. Melinie v. State, 93-1380 (La. 1996)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "15 M.R.S.A. § 2124 et seq.",
    standard: "post-conviction review; must show serious constitutional violation resulted in unjust conviction or sentence",
    timeLimits: "within 2 years of final disposition; DNA evidence claims have no time limit",
    keyCaseLaw: "Allen v. State, 2012 ME 50 (Me. 2012)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. Code, Crim. Proc. §§ 7-101 to 7-301 (UPPA)",
    standard: "post-conviction petition; must allege and prove violation of constitutional rights",
    timeLimits: "within 10 years of sentence; no limit for DNA, scientific evidence, or newly discovered evidence",
    keyCaseLaw: "Curtis v. State, 284 Md. 132 (1978)",
  },
  MA: {
    rule: "Mass. Gen. L. ch. 278 § 33E; G.L. c. 211 § 3",
    standard: "motion for new trial or habeas petition; must show constitutional error or new evidence creating substantial risk of miscarriage of justice",
    timeLimits: "no statutory time limit for habeas; reasonable diligence required",
    keyCaseLaw: "Commonwealth v. Grace, 397 Mass. 303 (1986)",
  },
  MI: {
    rule: "MCR 6.500-6.509",
    standard: "motion for relief from judgment; must show good cause for failing to raise claims on appeal and actual prejudice from alleged errors",
    timeLimits: "within 6 years of conviction; exceptions for constitutional magnitude, actual innocence, or retroactive changes in law",
    keyCaseLaw: "People v. Swain, 288 Mich. App. 609 (2010)",
  },
  MN: {
    rule: "Minn. Stat. § 590.01 (Post-Conviction Relief Act)",
    standard: "petition for post-conviction relief; must show conviction obtained in violation of constitution, new evidence requiring vacation, or sentence not authorized by law",
    timeLimits: "within 2 years of direct appeal final disposition; exceptions for new evidence or constitutional claims",
    keyCaseLaw: "Sanchez v. State, 816 N.W.2d 550 (Minn. 2012)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. Code Ann. § 99-39-1 et seq. (UPCCRA)",
    standard: "post-conviction collateral relief; must show constitutional violation, sentence exceeding maximum, or newly discovered evidence",
    timeLimits: "within 3 years of entry of judgment; exceptions for newly discovered evidence and illegal sentence claims",
    keyCaseLaw: "Rowland v. State, 42 So. 3d 503 (Miss. 2010)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. Sup. Ct. R. 24.035 & 29.15",
    standard: "post-conviction relief motion; Rule 24.035 for guilty plea convictions; Rule 29.15 for trial convictions; must show constitutional violation",
    timeLimits: "Rule 24.035: 180 days after guilty plea; Rule 29.15: 90 days after mandate on direct appeal",
    keyCaseLaw: "Johnson v. State, 406 S.W.3d 892 (Mo. 2013)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-21-101 et seq.",
    standard: "petition for post-conviction relief; must show conviction was in violation of constitution, court lacked jurisdiction, or sentence exceeded authority",
    timeLimits: "within 1 year of conviction becoming final; exceptions for newly discovered evidence",
    keyCaseLaw: "State v. Cobell, 2004 MT 46 (Mont. 2004)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-3001 et seq. (Post Conviction Act)",
    standard: "motion for post-conviction relief; must show denial of constitutional rights that render judgment void or voidable",
    timeLimits: "within 1 year of final judgment; DNA-related claims have no time limit",
    keyCaseLaw: "State v. Lotter, 266 Neb. 245 (2003)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 34.724-34.830",
    standard: "petition for writ of habeas corpus (post-conviction); must show conviction was obtained in violation of constitution, court lacked jurisdiction, or sentence exceeded maximum",
    timeLimits: "within 1 year of conviction becoming final; good cause and prejudice required for late or successive petitions",
    keyCaseLaw: "Hargrove v. State, 100 Nev. 498 (1984)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "RSA 534:1 et seq.",
    standard: "petition for writ of habeas corpus; must show unlawful detention based on constitutional violation",
    timeLimits: "no statutory time limit; diligence required, laches defense available",
    keyCaseLaw: "State v. Laurie, 139 N.H. 325 (1995)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:22 (Post-Conviction Relief)",
    standard: "petition for post-conviction relief; must show constitutional violation, illegal sentence, or newly discovered evidence",
    timeLimits: "within 5 years of entry of judgment of conviction; exceptions for constitutional claims, excusable neglect, denial of constitutional right, and new rule of law",
    keyCaseLaw: "State v. Preciose, 129 N.J. 451 (1992)",
  },
  NM: {
    rule: "NMSA 1978 §§ 31-11-1 to 31-11-6; Rule 5-802",
    standard: "habeas corpus petition; must show imprisonment in violation of constitutional rights",
    timeLimits: "no statutory time limit but unreasonable delay may bar relief",
    keyCaseLaw: "Duncan v. Kerby, 115 N.M. 344 (1993)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "N.Y. CPLR Art. 70 (Habeas); CPL § 440.10 (Motion to Vacate)",
    standard: "CPL § 440.10 motion to vacate judgment; must show constitutional violation, fraud, false evidence, or new evidence",
    timeLimits: "no statutory time limit for CPL 440.10; court may deny if claim could have been raised on direct appeal and was not",
    keyCaseLaw: "People v. Machado, 21 N.Y.3d 694 (2013)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-1415 (MAR)",
    standard: "motion for appropriate relief; must show violation of defendant's constitutional rights, sentence unauthorized, or significant new evidence",
    timeLimits: "10 days after verdict for trial errors; no time limit for constitutional violations, DNA, and newly discovered evidence",
    keyCaseLaw: "State v. Lutz, 177 N.C. App. 140 (2006)",
  },
  ND: {
    rule: "N.D.C.C. § 29-32.1 (Uniform Post-Conviction Procedure Act)",
    standard: "application for post-conviction relief; must show violation of constitutional rights or newly discovered material facts",
    timeLimits: "within 2 years of conviction becoming final; exceptions for DNA evidence and retroactive law changes",
    keyCaseLaw: "Laib v. State, 2005 ND 187 (N.D. 2005)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Rev. Code § 2953.21",
    standard: "petition for post-conviction relief; must show constitutional violation that renders judgment void or voidable",
    timeLimits: "within 365 days of trial transcript filing; exceptions for new federal/state rights, DNA testing, or actual innocence claims",
    keyCaseLaw: "State v. Calhoun, 86 Ohio St. 3d 279 (1999)",
  },
  OK: {
    rule: "22 O.S. § 1080 et seq. (Post-Conviction Procedure Act)",
    standard: "application for post-conviction relief; must show constitutional violation, court lacked jurisdiction, or sentence exceeded authority",
    timeLimits: "no statutory time limit but laches defense applies; successive applications disfavored",
    keyCaseLaw: "Logan v. State, 293 P.3d 969 (Okla. Crim. App. 2013)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 138.510-138.686 (Post-Conviction Relief Act)",
    standard: "petition for post-conviction relief; must show conviction or sentence violated constitutional rights",
    timeLimits: "within 2 years of conviction becoming final; exceptions for unconstitutional statutes, DNA, and actual innocence",
    keyCaseLaw: "Palmer v. State, 318 Or. 352 (1994)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "42 Pa.C.S. §§ 9541-9546 (PCRA)",
    standard: "post-conviction collateral relief; must show conviction resulted from constitutional violation, ineffective counsel, unlawfully induced plea, improper obstruction, or newly discovered evidence",
    timeLimits: "within 1 year of judgment becoming final; exceptions for government interference, newly discovered facts, and newly recognized constitutional rights",
    keyCaseLaw: "Commonwealth v. Grant, 813 A.2d 726 (Pa. 2002)",
  },
  RI: {
    rule: "R.I. Gen. Laws § 10-9.1-1 et seq.",
    standard: "application for post-conviction relief; must show conviction obtained in violation of constitution, court lacked jurisdiction, or new evidence",
    timeLimits: "no statutory time limit; court applies laches/prejudice analysis",
    keyCaseLaw: "Brown v. State, 32 A.3d 901 (R.I. 2011)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. Code § 17-27-10 et seq. (Uniform Post-Conviction Procedure Act)",
    standard: "application for post-conviction relief; must show conviction or sentence violated constitution, court lacked jurisdiction, or sentence exceeded maximum",
    timeLimits: "within 1 year of final judgment; exceptions for newly discovered evidence and retroactive rights",
    keyCaseLaw: "Aice v. State, 305 S.C. 448 (1991)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 21-27-1 et seq.",
    standard: "habeas corpus petition; must show unlawful confinement due to constitutional violation",
    timeLimits: "no statutory time limit; laches defense available; reasonable diligence expected",
    keyCaseLaw: "Steele v. Young, 2011 S.D. 72 (S.D. 2011)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. Code Ann. § 40-30-101 et seq. (Post-Conviction Procedure Act)",
    standard: "post-conviction petition; must show conviction or sentence is void or voidable due to violation of constitutional rights",
    timeLimits: "within 1 year of final action of highest appellate court; exceptions for new constitutional rights, new evidence, and sentence enhancement challenges",
    keyCaseLaw: "Pylant v. State, 263 S.W.3d 854 (Tenn. 2008)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 11.07 (felony); 11.072 (community supervision)",
    standard: "application for writ of habeas corpus; must show conviction obtained in violation of constitution or laws",
    timeLimits: "no statutory time limit for initial application; successive applications require CCA permission and must meet specific statutory grounds",
    keyCaseLaw: "Ex parte Miles, 359 S.W.3d 647 (Tex. Crim. App. 2012)",
  },
  UT: {
    rule: "Utah Code § 78B-9-101 et seq. (PCRA)",
    standard: "petition for post-conviction relief; must show conviction was obtained or sentence imposed in violation of constitution",
    timeLimits: "within 1 year of cause of action accruing; exceptions for newly discovered evidence and unconstitutional statutes",
    keyCaseLaw: "Menzies v. Galetka, 2006 UT 81 (Utah 2006)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "13 V.S.A. § 7131 et seq.",
    standard: "post-conviction relief; must show conviction violated constitutional rights, newly discovered evidence, or illegal sentence",
    timeLimits: "no statutory time limit; must exercise due diligence",
    keyCaseLaw: "In re Dunbar, 2008 VT 114 (Vt. 2008)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 8.01-654 (Habeas Corpus)",
    standard: "petition for writ of habeas corpus; must show detention without legal authority or in violation of constitutional rights",
    timeLimits: "within 2 years of final judgment; 1 year for non-capital felonies after 2021 amendments",
    keyCaseLaw: "Slayton v. Parrigan, 215 Va. 27 (1974)",
  },
  WA: {
    rule: "RCW 10.73 (Personal Restraint Petition)",
    standard: "personal restraint petition; must show unlawful restraint due to constitutional violation, illegal sentence, or new evidence",
    timeLimits: "within 1 year of final judgment; exceptions for actual innocence, new evidence, and invalid statute",
    keyCaseLaw: "In re Coats, 173 Wash. 2d 123 (2011)",
  },
  WV: {
    rule: "W. Va. Code § 53-4A-1 et seq.",
    standard: "habeas corpus petition; must show violation of constitutional rights or fundamental unfairness rendering conviction void",
    timeLimits: "no statutory time limit but undue delay may bar relief; must show good cause for delay",
    keyCaseLaw: "Losh v. McKenzie, 166 W. Va. 762 (1981)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 974.06",
    standard: "motion for post-conviction relief; must show sentence or judgment violated constitutional rights, court lacked jurisdiction, or sentence exceeded maximum",
    timeLimits: "no statutory time limit; must explain failure to raise claims in prior motion or appeal (Escalona-Naranjo bar)",
    keyCaseLaw: "State v. Escalona-Naranjo, 185 Wis. 2d 168 (1994)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. App. P. 12.04 et seq.",
    standard: "post-conviction relief; must show denial of constitutional rights or court lacked jurisdiction",
    timeLimits: "no statutory time limit; must file within reasonable time",
    keyCaseLaw: "Brock v. State, 981 P.2d 465 (Wyo. 1999)",
    counties: WY_COUNTIES,
  },
};

const circuitMap: Record<string, string> = {
  NY: "2nd Circuit", CT: "2nd Circuit", VT: "2nd Circuit",
  PA: "3rd Circuit", NJ: "3rd Circuit", DE: "3rd Circuit",
  MD: "4th Circuit", VA: "4th Circuit", WV: "4th Circuit", NC: "4th Circuit", SC: "4th Circuit",
  TX: "5th Circuit", LA: "5th Circuit", MS: "5th Circuit",
  OH: "6th Circuit", MI: "6th Circuit", KY: "6th Circuit", TN: "6th Circuit",
  IL: "7th Circuit", IN: "7th Circuit", WI: "7th Circuit",
  MN: "8th Circuit", IA: "8th Circuit", MO: "8th Circuit", AR: "8th Circuit", NE: "8th Circuit", ND: "8th Circuit", SD: "8th Circuit",
  CA: "9th Circuit", AZ: "9th Circuit", NV: "9th Circuit", OR: "9th Circuit", WA: "9th Circuit", MT: "9th Circuit", ID: "9th Circuit", AK: "9th Circuit", HI: "9th Circuit",
  CO: "10th Circuit", KS: "10th Circuit", OK: "10th Circuit", NM: "10th Circuit", UT: "10th Circuit", WY: "10th Circuit",
  FL: "11th Circuit", GA: "11th Circuit", AL: "11th Circuit",
  DC: "D.C. Circuit", ME: "1st Circuit", MA: "1st Circuit", NH: "1st Circuit", RI: "1st Circuit",
};

const federalDistricts: { jurisdiction: string; district: string }[] = [
  { jurisdiction: "CA", district: "CACD" },
  { jurisdiction: "CA", district: "NDCA" },
  { jurisdiction: "CA", district: "EDCA" },
  { jurisdiction: "CA", district: "SDCA" },
  { jurisdiction: "NY", district: "SDNY" },
  { jurisdiction: "NY", district: "EDNY" },
  { jurisdiction: "NY", district: "NDNY" },
  { jurisdiction: "NY", district: "WDNY" },
  { jurisdiction: "TX", district: "TXND" },
  { jurisdiction: "TX", district: "TXSD" },
  { jurisdiction: "TX", district: "TXED" },
  { jurisdiction: "TX", district: "TXWD" },
  { jurisdiction: "FL", district: "FLSD" },
  { jurisdiction: "FL", district: "FLMD" },
  { jurisdiction: "FL", district: "FLND" },
  { jurisdiction: "PA", district: "PAED" },
  { jurisdiction: "PA", district: "PAWD" },
  { jurisdiction: "PA", district: "PAMD" },
  { jurisdiction: "IL", district: "ILND" },
  { jurisdiction: "IL", district: "ILCD" },
  { jurisdiction: "IL", district: "ILSD" },
  { jurisdiction: "OH", district: "OHND" },
  { jurisdiction: "OH", district: "OHSD" },
  { jurisdiction: "GA", district: "GAND" },
  { jurisdiction: "GA", district: "GAMD" },
  { jurisdiction: "GA", district: "GASD" },
  { jurisdiction: "NC", district: "EDNC" },
  { jurisdiction: "NC", district: "MDNC" },
  { jurisdiction: "NC", district: "WDNC" },
  { jurisdiction: "MI", district: "EDMI" },
  { jurisdiction: "MI", district: "WDMI" },
  { jurisdiction: "NJ", district: "DNJ" },
  { jurisdiction: "VA", district: "EDVA" },
  { jurisdiction: "VA", district: "WDVA" },
  { jurisdiction: "WA", district: "EDWA" },
  { jurisdiction: "WA", district: "WDWA" },
  { jurisdiction: "AZ", district: "DAZ" },
  { jurisdiction: "MA", district: "DMA" },
  { jurisdiction: "TN", district: "EDTN" },
  { jurisdiction: "TN", district: "MDTN" },
  { jurisdiction: "TN", district: "WDTN" },
  { jurisdiction: "IN", district: "NDIN" },
  { jurisdiction: "IN", district: "SDIN" },
  { jurisdiction: "MD", district: "DMD" },
  { jurisdiction: "MO", district: "EDMO" },
  { jurisdiction: "MO", district: "WDMO" },
  { jurisdiction: "WI", district: "EDWI" },
  { jurisdiction: "WI", district: "WDWI" },
  { jurisdiction: "CO", district: "DCO" },
  { jurisdiction: "MN", district: "DMN" },
  { jurisdiction: "SC", district: "DSC" },
  { jurisdiction: "AL", district: "NDAL" },
  { jurisdiction: "AL", district: "MDAL" },
  { jurisdiction: "AL", district: "SDAL" },
  { jurisdiction: "LA", district: "EDLA" },
  { jurisdiction: "LA", district: "MDLA" },
  { jurisdiction: "LA", district: "WDLA" },
  { jurisdiction: "KY", district: "EDKY" },
  { jurisdiction: "KY", district: "WDKY" },
  { jurisdiction: "OR", district: "DOR" },
  { jurisdiction: "OK", district: "NDOK" },
  { jurisdiction: "OK", district: "EDOK" },
  { jurisdiction: "OK", district: "WDOK" },
  { jurisdiction: "CT", district: "DCT" },
  { jurisdiction: "UT", district: "DUT" },
  { jurisdiction: "IA", district: "NDIA" },
  { jurisdiction: "IA", district: "SDIA" },
  { jurisdiction: "NV", district: "DNV" },
  { jurisdiction: "AR", district: "EDAR" },
  { jurisdiction: "AR", district: "WDAR" },
  { jurisdiction: "MS", district: "NDMS" },
  { jurisdiction: "MS", district: "SDMS" },
  { jurisdiction: "KS", district: "DKS" },
  { jurisdiction: "NM", district: "DNM" },
  { jurisdiction: "NE", district: "DNE" },
  { jurisdiction: "ID", district: "DID" },
  { jurisdiction: "AK", district: "DAK" },
  { jurisdiction: "DE", district: "DDE" },
  { jurisdiction: "HI", district: "DHI" },
  { jurisdiction: "ME", district: "DME" },
  { jurisdiction: "MT", district: "DMT" },
  { jurisdiction: "NH", district: "DNH" },
  { jurisdiction: "ND", district: "DND" },
  { jurisdiction: "RI", district: "DRI" },
  { jurisdiction: "SD", district: "DSD" },
  { jurisdiction: "VT", district: "DVT" },
  { jurisdiction: "WV", district: "NDWV" },
  { jurisdiction: "WV", district: "SDWV" },
  { jurisdiction: "WY", district: "DWY" },
  { jurisdiction: "DC", district: "DDC" },
];

function createJurisdictionStandardSection(state: string): TemplateSection {
  const rule = stateRules[state];
  return {
    id: "jurisdictionStandard",
    name: "Jurisdiction-Specific Legal Standard",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPLICABLE LEGAL STANDARD — ${state}

Rule/Statute: ${rule.rule}

Standard for Habeas/Post-Conviction Relief: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: Habeas corpus and post-conviction relief standards vary significantly by jurisdiction. Most states require the petitioner to demonstrate a constitutional violation, illegal sentence, or newly discovered evidence. For federal habeas petitions under 28 U.S.C. § 2254, the petitioner must first exhaust all available state remedies. AEDPA imposes a one-year statute of limitations and requires deference to state court adjudications on the merits unless the decision was contrary to, or involved an unreasonable application of, clearly established federal law, or was based on an unreasonable determination of the facts.`,
    helpText: "Legal standard for habeas corpus/post-conviction relief in this jurisdiction.",
  };
}

function createFederalStandardSection(district: string, circuit: string): TemplateSection {
  return {
    id: "federalStandard",
    name: "Federal Legal Standard",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPLICABLE FEDERAL LEGAL STANDARD — ${district} (${circuit})

28 U.S.C. § 2255 — Motion to Vacate, Set Aside, or Correct Sentence:
A prisoner in custody under sentence of a federal court may move the court which imposed the sentence to vacate, set aside, or correct the sentence upon the ground that:
(1) The sentence was imposed in violation of the Constitution or laws of the United States;
(2) The court was without jurisdiction to impose such sentence;
(3) The sentence was in excess of the maximum authorized by law; or
(4) The sentence is otherwise subject to collateral attack.

AEDPA Requirements (Antiterrorism and Effective Death Penalty Act of 1996):
- One-year statute of limitations from the latest of: (a) date judgment of conviction becomes final; (b) date impediment to filing created by governmental action is removed; (c) date the right asserted was initially recognized by the Supreme Court; or (d) date facts supporting the claim could have been discovered through due diligence.
- Successive petitions require certification from the court of appeals.
- Certificate of Appealability required to appeal denial of habeas relief.

Strickland Test for Ineffective Assistance of Counsel:
To prevail on an IAC claim, the petitioner must demonstrate:
(1) Deficient performance — counsel's representation fell below an objective standard of reasonableness; AND
(2) Prejudice — there is a reasonable probability that, but for counsel's unprofessional errors, the result of the proceeding would have been different.
See Strickland v. Washington, 466 U.S. 668 (1984).

Actual Innocence Gateway (Schlup v. Delo):
A petitioner asserting actual innocence as a gateway to overcome a procedural bar must demonstrate that it is more likely than not that no reasonable juror would have convicted the petitioner in light of the new evidence.
See Schlup v. Delo, 513 U.S. 298 (1995).

Key Authorities: Strickland v. Washington, 466 U.S. 668 (1984); Schlup v. Delo, 513 U.S. 298 (1995); Williams v. Taylor, 529 U.S. 362 (2000); Hill v. Lockhart, 474 U.S. 52 (1985); McQuiggin v. Perkins, 569 U.S. 383 (2013).`,
    helpText: "Federal legal standard for habeas corpus petitions.",
  };
}

function createStateSections(state: string): TemplateSection[] {
  const rule = stateRules[state];
  const countyLabel = rule.countyLabel || "County";
  const captionWithCounty: TemplateInput[] = rule.counties
    ? [
        ...captionInputs,
        {
          id: "county",
          label: countyLabel,
          type: "select" as const,
          required: true,
          helpText: `Select the ${countyLabel.toLowerCase()} where the petition is being filed`,
          validation: {
            options: rule.counties,
          },
        },
      ]
    : captionInputs;

  return [
    createJurisdictionStandardSection(state),
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 2,
      inputs: captionWithCounty,
      required: true,
      helpText: "Enter court and case information for the petition caption.",
    },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
    { ...baseSections[5], order: 7 },
  ];
}

function createFederalSectionsForDistrict(district: string, circuit: string): TemplateSection[] {
  return [
    createFederalStandardSection(district, circuit),
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 2,
      inputs: captionInputs,
      required: true,
      helpText: "Enter court and case information for the petition caption.",
    },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
    { ...baseSections[5], order: 7 },
  ];
}

const allStateSections: Record<string, TemplateSection[]> = {};
for (const state of Object.keys(stateRules)) {
  allStateSections[state] = createStateSections(state);
}

const allFederalSections: Record<string, TemplateSection[]> = {};
for (const { district, jurisdiction } of federalDistricts) {
  const circuit = circuitMap[jurisdiction];
  allFederalSections[district] = createFederalSectionsForDistrict(district, circuit);
}

const jurisdictionVariants: {
  jurisdiction: string;
  courtType?: "state" | "federal" | "immigration";
  district?: string;
  sections: TemplateSection[];
  courtSpecificRules?: string;
}[] = [];

for (const [state, rule] of Object.entries(stateRules)) {
  jurisdictionVariants.push({
    jurisdiction: state,
    courtType: "state",
    sections: allStateSections[state],
    courtSpecificRules: `Filed under ${rule.rule}. Standard: ${rule.standard}. Time limits: ${rule.timeLimits}. Key: ${rule.keyCaseLaw}.`,
  });
}

for (const { jurisdiction, district } of federalDistricts) {
  const circuit = circuitMap[jurisdiction];
  jurisdictionVariants.push({
    jurisdiction,
    courtType: "federal",
    district,
    sections: allFederalSections[district],
    courtSpecificRules: `${district}: 12pt font. ${circuit}. CM/ECF required.`,
  });
}

export const habeasCorpusPetitionTemplate: DocumentTemplate = {
  id: "habeas-corpus-petition",
  name: "Petition for Writ of Habeas Corpus",
  category: "criminal",
  description: "A petition challenging the legality of detention or conviction. Filed under 28 U.S.C. § 2254 (state prisoners challenging state convictions), 28 U.S.C. § 2255 (federal prisoners challenging federal convictions), or state habeas statutes. Common grounds include ineffective assistance of counsel, constitutional violations, newly discovered evidence of innocence, prosecutorial misconduct, and illegal sentence. Subject to AEDPA's one-year statute of limitations for federal petitions. Time-sensitive — strict procedural requirements including exhaustion of state remedies.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "30-50 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default habeasCorpusPetitionTemplate;
