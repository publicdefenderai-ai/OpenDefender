/**
 * Motion for Sentence Modification / Reduction Template
 *
 * Criminal law document template for requesting modification or reduction of a sentence.
 * Filed under Federal Rule of Criminal Procedure 35, 18 U.S.C. § 3582(c), or state equivalents.
 * Covers grounds including: substantial assistance to the government, rehabilitation,
 * changed sentencing guidelines, compassionate release, and disproportionate sentencing.
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
    helpText: "The full name of the court that imposed the sentence",
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

const sentenceDetailsInputs: TemplateInput[] = [
  {
    id: "sentenceDate",
    label: "Date of Sentencing",
    type: "date",
    required: true,
    helpText: "The date the original sentence was imposed",
  },
  {
    id: "originalSentence",
    label: "Original Sentence",
    type: "textarea",
    placeholder: "Describe the sentence imposed (incarceration term, probation, fines, restitution, etc.)...",
    required: true,
    helpText: "Full description of the sentence originally imposed by the court",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
  {
    id: "offenseDescription",
    label: "Offense(s) of Conviction",
    type: "textarea",
    placeholder: "Describe the charge(s) for which the defendant was convicted...",
    required: true,
    helpText: "The criminal charges for which the defendant was sentenced",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
  {
    id: "timeServed",
    label: "Time Served",
    type: "text",
    placeholder: "e.g., 18 months, 3 years",
    required: false,
    helpText: "Amount of time the defendant has served so far, if applicable",
  },
  {
    id: "requestedModification",
    label: "Requested Modification",
    type: "textarea",
    placeholder: "Describe the specific sentence modification requested...",
    required: true,
    helpText: "Clearly state the reduction or modification being requested",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
];

const modificationGroundsInputs: TemplateInput[] = [
  {
    id: "modificationGround",
    label: "Ground for Modification",
    type: "select",
    required: true,
    helpText: "Select the primary ground for seeking sentence modification",
    validation: {
      options: [
        { value: "substantial_assistance", label: "Substantial Assistance to the Government (Rule 35(b) / 5K1.1)" },
        { value: "rehabilitation", label: "Rehabilitation and Post-Sentencing Conduct" },
        { value: "changed_guidelines", label: "Retroactive Amendment to Sentencing Guidelines" },
        { value: "compassionate_release", label: "Compassionate Release / Extraordinary Circumstances (18 U.S.C. § 3582(c)(1)(A))" },
        { value: "disproportionate", label: "Disproportionate or Unjust Sentence" },
        { value: "new_law", label: "Change in Applicable Law" },
        { value: "clerical_error", label: "Correction of Clerical / Arithmetical Error (Rule 35(a))" },
        { value: "medical_condition", label: "Serious Medical Condition or Age" },
        { value: "family_circumstances", label: "Extraordinary Family Circumstances" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "groundsDescription",
    label: "Detailed Description of Grounds",
    type: "textarea",
    placeholder: "Provide a detailed description of the grounds supporting sentence modification...",
    required: true,
    helpText: "Explain in detail the factual and legal basis for modifying the sentence",
    validation: {
      minLength: 100,
      maxLength: 4000,
    },
  },
  {
    id: "supportingEvidence",
    label: "Supporting Evidence",
    type: "textarea",
    placeholder: "Describe supporting evidence (certificates, program completions, medical records, letters, etc.)...",
    required: false,
    helpText: "List any supporting evidence that will be attached or referenced",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "victimNotification",
    label: "Victim Notification Status",
    type: "select",
    required: true,
    helpText: "Indicate whether victims have been notified of this motion",
    validation: {
      options: [
        { value: "notified_no_objection", label: "Victims Notified — No Objection" },
        { value: "notified_objection", label: "Victims Notified — Objection Filed" },
        { value: "notified_pending", label: "Victims Notified — Response Pending" },
        { value: "no_victim", label: "No Identifiable Victim" },
        { value: "not_yet_notified", label: "Not Yet Notified" },
      ],
    },
  },
  {
    id: "prosecutionPosition",
    label: "Prosecution Position",
    type: "select",
    required: true,
    helpText: "Indicate the prosecution's position on this motion",
    validation: {
      options: [
        { value: "supports", label: "Prosecution Supports / Joint Motion" },
        { value: "no_objection", label: "Prosecution Has No Objection" },
        { value: "opposes", label: "Prosecution Opposes" },
        { value: "not_contacted", label: "Prosecution Not Contacted" },
        { value: "pending_response", label: "Awaiting Prosecution Response" },
      ],
    },
  },
];

const hearingInputs: TemplateInput[] = [
  {
    id: "hearingRequested",
    label: "Hearing Preference",
    type: "select",
    required: true,
    helpText: "Whether you are requesting an oral hearing or submitting on papers",
    validation: {
      options: [
        { value: "yes", label: "Oral hearing requested" },
        { value: "no", label: "Submit on papers" },
      ],
    },
  },
  {
    id: "hearingDate",
    label: "Requested Hearing Date",
    type: "date",
    required: false,
    helpText: "The requested date for a hearing on this motion, if applicable",
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
    helpText: "Enter court and case information for the motion caption.",
  },
  {
    id: "sentenceDetails",
    name: "Sentence Details",
    type: "user-input",
    order: 2,
    inputs: sentenceDetailsInputs,
    required: true,
    helpText: "Provide details about the original sentence.",
  },
  {
    id: "modificationGrounds",
    name: "Grounds for Modification",
    type: "user-input",
    order: 3,
    inputs: modificationGroundsInputs,
    required: true,
    helpText: "Describe the legal and factual basis for modifying the sentence.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for sentence modification/reduction.

Original sentence date: {{sentenceDate}}
Original sentence: {{originalSentence}}
Offense of conviction: {{offenseDescription}}
Time served: {{timeServed}}
Requested modification: {{requestedModification}}
Ground for modification: {{modificationGround}}
Detailed grounds: {{groundsDescription}}
Supporting evidence: {{supportingEvidence}}
Victim notification: {{victimNotification}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. The applicable legal standard for sentence modification
  2. Application of the standard to the facts, showing why modification is warranted
  3. The defendant's post-sentencing conduct and rehabilitation, if relevant
  4. Why the original sentence is excessive or circumstances have changed
  5. That modification serves the interests of justice and 18 U.S.C. § 3553(a) factors
- Cite applicable statutes and case law
- Address victim notification and prosecution position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a sentence modification motion. Apply the appropriate standard based on the ground for modification. For substantial assistance, cite Rule 35(b) and USSG § 5K1.1. For compassionate release, cite 18 U.S.C. § 3582(c)(1)(A) and the exhaustion requirement. For changed guidelines, cite 18 U.S.C. § 3582(c)(2). Address the 18 U.S.C. § 3553(a) sentencing factors. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the grounds and details provided.",
  },
  {
    id: "reliefAndHearing",
    name: "Relief Requested & Hearing",
    type: "user-input",
    order: 5,
    inputs: hearingInputs,
    required: true,
    helpText: "Specify the relief requested and hearing preference.",
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
    rule: "Ala. R. Crim. P. 26.9",
    standard: "court may reduce sentence within 30 days; split sentence modification under § 15-18-8",
    timeLimits: "30 days from sentencing; split sentence review after minimum served",
    keyCaseLaw: "Ex parte Gentry, 279 So. 3d 594 (Ala. 2018)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 35(a), (b)",
    standard: "court may correct illegal sentence at any time; reduce sentence within 180 days",
    timeLimits: "180 days from sentencing or affirmance on appeal",
    keyCaseLaw: "Beltz v. State, 980 P.2d 474 (Alaska App. 1999)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 24.3",
    standard: "court may modify probation terms; sentence reduction within 60 days",
    timeLimits: "60 days after sentencing",
    keyCaseLaw: "State v. Crowder, 155 Ariz. 477 (App. 1987)",
  },
  AR: {
    rule: "Ark. Code § 16-90-111",
    standard: "court may reduce sentence; transfer to community correction",
    timeLimits: "within 90 days of commitment or on recommendation of ADC",
    keyCaseLaw: "Williams v. State, 2009 Ark. 433",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1170(d)(1); § 1170.03 (resentencing)",
    standard: "court or CDCR may recommend recall of sentence; resentencing in interests of justice",
    timeLimits: "CDCR recommendation within 120 days; § 1170.03 no time limit",
    keyCaseLaw: "People v. Frazier (1993) 5 Cal.4th 373; People v. E.M. (2022) 85 Cal.App.5th 1075",
  },
  CO: {
    rule: "Colo. R. Crim. P. 35(b)",
    standard: "court may reduce sentence if it is fair and just to do so",
    timeLimits: "within 126 days of sentencing or within 126 days of appellate disposition",
    keyCaseLaw: "People v. Torrez, 2013 CO 43",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Gen. Stat. § 53a-39; Practice Book § 43-22",
    standard: "sentence review division may modify; court may reduce within time limits",
    timeLimits: "within 30 days of sentencing or remand; sentence review application within 30 days",
    keyCaseLaw: "State v. Nardini, 187 Conn. 109 (1982)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. Crim. R. 35(b)",
    standard: "court may reduce sentence for good cause",
    timeLimits: "within 90 days of sentencing; or on motion by the State",
    keyCaseLaw: "State v. Sloman, 886 A.2d 1257 (Del. 2005)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Code § 24-403.04 (Second Look Act)",
    standard: "court may reduce sentence after serving at least 15 years if interests of justice warrant",
    timeLimits: "after 15+ years served (20+ for certain offenses); no time limit on filing",
    keyCaseLaw: "In re Aiken, 238 A.3d 258 (D.C. 2020)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.800(c)",
    standard: "court may reduce legal sentence within 60 days",
    timeLimits: "within 60 days after sentencing; or within 60 days of appellate mandate",
    keyCaseLaw: "State v. Mancino, 714 So. 2d 429 (Fla. 1998)",
  },
  GA: {
    rule: "O.C.G.A. § 17-10-1(f)",
    standard: "court may modify sentence within 1 year; probation modification at any time",
    timeLimits: "within 1 year of sentencing or within 120 days of appellate remand",
    keyCaseLaw: "Spaulding v. State, 285 Ga. 184 (2009)",
  },
  HI: {
    rule: "Haw. R. Penal P. 35",
    standard: "court may correct illegal sentence at any time; reduce within 90 days",
    timeLimits: "90 days from imposition of sentence",
    keyCaseLaw: "State v. De Guair, 108 Hawai'i 179 (2005)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 35",
    standard: "court may reduce sentence if it is unduly severe, considering all circumstances",
    timeLimits: "within 120 days of sentencing; or within 120 days of appellate order",
    keyCaseLaw: "State v. Huffman, 144 Idaho 201 (2007)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "730 ILCS 5/5-4.5-50; 5/5-4-1",
    standard: "court may modify probation at any time; sentence credit and resentencing statutes",
    timeLimits: "30 days for sentence modification; probation modification during term",
    keyCaseLaw: "People v. Lashley, 2016 IL App (1st) 133401",
  },
  IN: {
    rule: "Ind. Code § 35-38-1-17",
    standard: "court may modify sentence if circumstances warrant",
    timeLimits: "within 365 days of sentencing or at any time for modification of probation",
    keyCaseLaw: "Robinson v. State, 91 N.E.3d 574 (Ind. 2018)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.24(5)",
    standard: "court may reconsider sentence; reduction for rehabilitation",
    timeLimits: "within 30 days of sentencing or appellate disposition",
    keyCaseLaw: "State v. Propps, 897 N.W.2d 91 (Iowa 2017)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "Kan. Stat. § 21-6820(e); § 22-3504",
    standard: "court may modify sentence; correction of illegal sentence at any time",
    timeLimits: "120 days of sentencing for modification; no time limit for illegal sentence",
    keyCaseLaw: "State v. Kingsley, 299 Kan. 896 (2014)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "Ky. R. Crim. P. 11.42; KRS § 532.070",
    standard: "court may modify probation or conditional discharge at any time; shock probation",
    timeLimits: "shock probation: within 30-180 days of incarceration depending on offense",
    keyCaseLaw: "Deno v. Commonwealth, 177 S.W.3d 753 (Ky. 2005)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. Code Crim. Proc. Art. 881.1; Art. 893.3",
    standard: "court may reconsider sentence; reduction based on changed circumstances",
    timeLimits: "motion within 30 days of sentencing; reconsideration at any time for excessive sentence",
    keyCaseLaw: "State v. Dorthey, 623 So. 2d 1276 (La. 1993)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 35(b)",
    standard: "court may reduce sentence if it appears the sentence was inappropriately harsh",
    timeLimits: "within 1 year of sentencing or final disposition on appeal",
    keyCaseLaw: "State v. Lewis, 2017 ME 162",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. Rule 4-345(e)",
    standard: "court may modify or reduce sentence in the interest of justice",
    timeLimits: "within 5 years of sentencing (within 90 days if sentence includes only a fine)",
    keyCaseLaw: "State v. Schlick, 465 Md. 566 (2019)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 29(a)",
    standard: "court may revise or revoke sentence within 60 days",
    timeLimits: "within 60 days of sentencing or receipt of rescript from appellate court",
    keyCaseLaw: "Commonwealth v. Layne, 386 Mass. 291 (1982)",
  },
  MI: {
    rule: "MCR 6.429(A); MCL 769.25a",
    standard: "court may correct invalid sentence; resentencing for juvenile lifers",
    timeLimits: "6 months for sentence correction; Miller resentencing as applicable",
    keyCaseLaw: "People v. Comer, 500 Mich. 278 (2017)",
  },
  MN: {
    rule: "Minn. Stat. § 609.133; Minn. R. Crim. P. 27.03",
    standard: "court may stay or modify sentence; departure from guidelines",
    timeLimits: "within 90 days of sentencing",
    keyCaseLaw: "State v. Solberg, 882 N.W.2d 618 (Minn. 2016)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. Code § 47-7-47; URCCC 10.02",
    standard: "court may suspend sentence or place on post-release supervision; earned time credits",
    timeLimits: "varies by program; earned time petitions after minimum percentage served",
    keyCaseLaw: "Estes v. State, 224 So. 3d 86 (Miss. App. 2017)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 29.05; RSMo § 558.046",
    standard: "court may reduce sentence within time limits; judicial review upon DOC recommendation",
    timeLimits: "within 120 days of sentencing or mandate from appellate court",
    keyCaseLaw: "State v. Bazell, 497 S.W.3d 263 (Mo. 2016)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code § 46-18-203",
    standard: "court may designate sentence to DOC for placement review; modify conditions of supervision",
    timeLimits: "within 1 year of sentencing for reduction; at any time for probation modification",
    keyCaseLaw: "State v. Ariegwe, 2007 MT 204",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-2308",
    standard: "court may reduce sentence if it was within statutory limits",
    timeLimits: "within 1 year of final judgment or appellate disposition",
    keyCaseLaw: "State v. Rocha, 286 Neb. 256 (2013)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "Nev. Rev. Stat. § 176.033; NRS 176.035",
    standard: "court may correct sentence; specialized court may modify",
    timeLimits: "within 60 days of sentencing for modification",
    keyCaseLaw: "Edwards v. Emperor's Garden Rest., 122 Nev. 317 (2006)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. Rev. Stat. § 651:20",
    standard: "sentence review division of superior court may review; modification of suspended sentence",
    timeLimits: "within 30 days of sentencing for review petition; at any time for suspended sentence modification",
    keyCaseLaw: "State v. Mendez, 171 N.H. 79 (2018)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:21-10(b)",
    standard: "court may reduce or change sentence; change custodial sentence to probation",
    timeLimits: "within 75 days of the date of judgment; or pending appeal; at any time for probation modification",
    keyCaseLaw: "State v. Randolph, 210 N.J. 330 (2012)",
  },
  NM: {
    rule: "N.M. Stat. § 31-21-25",
    standard: "court may suspend or defer sentence; modification based on rehabilitation",
    timeLimits: "within 90 days of sentencing; probation modification during probation term",
    keyCaseLaw: "State v. Chavarria, 2009-NMSC-020",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "N.Y. CPL § 440.20; CPL § 420.10",
    standard: "court may set aside sentence as unauthorized or unduly harsh; resentencing upon application",
    timeLimits: "no specific time limit for unauthorized sentence; resentencing motions as permitted by statute",
    keyCaseLaw: "People v. Catu, 4 N.Y.3d 242 (2005)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-1334(a)",
    standard: "court may reduce sentence; modification for extraordinary mitigation or administrative error",
    timeLimits: "within 14 days of sentencing for reduction; at any time for illegal sentence",
    keyCaseLaw: "State v. Skipper, 337 N.C. 1 (1994)",
  },
  ND: {
    rule: "N.D. R. Crim. P. 35",
    standard: "court may reduce sentence within 120 days; correct illegal sentence at any time",
    timeLimits: "120 days from sentencing or appellate disposition",
    keyCaseLaw: "State v. Hamre, 2005 ND 96",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Rev. Code § 2929.20 (judicial release)",
    standard: "court may grant judicial release after minimum time served; modification for eligible offenders",
    timeLimits: "varies by sentence length: 30 days (1-year sentence) to after 5 years (10+ year sentence)",
    keyCaseLaw: "State v. Paige, 2018-Ohio-1583",
  },
  OK: {
    rule: "Okla. Stat. tit. 22 § 982a",
    standard: "court may modify sentence within scope of statute; judicial review of excessive sentence",
    timeLimits: "within 10 judicial days of sentencing; at any time for illegal sentence",
    keyCaseLaw: "Darks v. State, 1998 OK CR 15",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "Or. Rev. Stat. § 137.712; ORS § 137.010",
    standard: "court may reconsider sentence; modify probation conditions",
    timeLimits: "within 90 days of sentencing; modification of probation during probation term",
    keyCaseLaw: "State v. Partain, 349 Or. 10 (2010)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa. R. Crim. P. 720(B); 42 Pa.C.S. § 9781",
    standard: "court may reconsider sentence; modification for unreasonable or excessive sentence",
    timeLimits: "within 10 days of sentencing (post-sentence motion); appeal within 30 days",
    keyCaseLaw: "Commonwealth v. Tuladziecki, 513 Pa. 508 (1987)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 35(a), (b)",
    standard: "court may correct illegal sentence at any time; reduce sentence within 120 days",
    timeLimits: "120 days from sentencing or appellate disposition",
    keyCaseLaw: "State v. Byrne, 972 A.2d 633 (R.I. 2009)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. Code § 24-21-410; SCACR Rule 29(b)",
    standard: "court may suspend sentence and place on probation; modify conditions of supervision",
    timeLimits: "varies; resentencing petition as permitted by statute",
    keyCaseLaw: "State v. Brown, 408 S.C. 130 (App. 2014)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "S.D. Codified Laws § 23A-31-1",
    standard: "court may reduce sentence; suspend execution of sentence",
    timeLimits: "within 1 year of sentencing; 120 days for suspension of execution",
    keyCaseLaw: "State v. Thiel, 2008 SD 25",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. Code § 40-35-212",
    standard: "court may modify sentence; reduce sentence upon application showing rehabilitation",
    timeLimits: "within 120 days of sentencing; modification of probation during term",
    keyCaseLaw: "State v. Bise, 380 S.W.3d 682 (Tenn. 2012)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 42A.755; Art. 42.12 § 23",
    standard: "court may modify community supervision conditions; shock probation within time limits",
    timeLimits: "shock probation: 30-180 days after incarceration begins; modification during supervision",
    keyCaseLaw: "Ex parte Kimes, 872 S.W.2d 700 (Tex. Crim. App. 1993)",
  },
  UT: {
    rule: "Utah Code § 77-18-1; Utah R. Crim. P. 22(e)",
    standard: "court may terminate or modify probation; correct illegal sentence at any time",
    timeLimits: "at any time during probation for modification; no time limit for illegal sentence",
    keyCaseLaw: "State v. Rodrigues, 2009 UT 62",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 35(b)",
    standard: "court may reduce sentence if originally imposed sentence was not appropriate",
    timeLimits: "within 1 year of sentencing or appellate disposition",
    keyCaseLaw: "State v. Bourgoin, 2015 VT 124",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-303",
    standard: "court may suspend sentence and modify terms; geriatric release under § 53.1-40.01",
    timeLimits: "modification within the term of court or 60 days, whichever is later; no time limit for geriatric release",
    keyCaseLaw: "Howell v. Commonwealth, 274 Va. 737 (2007)",
  },
  WA: {
    rule: "Wash. RCW 36.01.070; CrR 7.8; RCW 9.94A.585",
    standard: "court may modify sentence; exceptional sentence review",
    timeLimits: "within 90 days of sentencing; resentencing as required by law",
    keyCaseLaw: "State v. Houston-Sconiers, 188 Wash.2d 1 (2017)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 35(b)",
    standard: "court may reduce sentence within 120 days; correct illegal sentence at any time",
    timeLimits: "120 days from sentencing or appellate disposition",
    keyCaseLaw: "State v. Head, 198 W.Va. 298 (1996)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 973.19; § 302.113(9g)",
    standard: "court may modify sentence based on new factor; sentence adjustment for earned release",
    timeLimits: "within 90 days of sentencing for modification; new factor motion at any time",
    keyCaseLaw: "State v. Harbor, 2011 WI 28",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 35(b); Wyo. Stat. § 7-13-301",
    standard: "court may reduce sentence within 1 year; correction of illegal sentence at any time",
    timeLimits: "1 year from sentencing or appellate disposition",
    keyCaseLaw: "Gould v. State, 2006 WY 157",
    counties: WY_COUNTIES,
  },
};

const circuitMap: Record<string, string> = {
  ME: "First", MA: "First", NH: "First", RI: "First",
  CT: "Second", NY: "Second", VT: "Second",
  DE: "Third", NJ: "Third", PA: "Third",
  MD: "Fourth", NC: "Fourth", SC: "Fourth", VA: "Fourth", WV: "Fourth",
  LA: "Fifth", MS: "Fifth", TX: "Fifth",
  KY: "Sixth", MI: "Sixth", OH: "Sixth", TN: "Sixth",
  IL: "Seventh", IN: "Seventh", WI: "Seventh",
  AR: "Eighth", IA: "Eighth", MN: "Eighth", MO: "Eighth", NE: "Eighth", ND: "Eighth", SD: "Eighth",
  AK: "Ninth", AZ: "Ninth", CA: "Ninth", HI: "Ninth", ID: "Ninth", MT: "Ninth", NV: "Ninth", OR: "Ninth", WA: "Ninth",
  CO: "Tenth", KS: "Tenth", NM: "Tenth", OK: "Tenth", UT: "Tenth", WY: "Tenth",
  AL: "Eleventh", FL: "Eleventh", GA: "Eleventh",
  DC: "D.C.",
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

Standard for Modification: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: Sentence modification standards and time limits vary significantly by jurisdiction. Some states allow modification only within narrow windows after sentencing, while others permit motions based on new factors or changed circumstances at any time. The court will consider the nature of the offense, the defendant's post-sentencing conduct, the interests of justice, and any applicable statutory factors.`,
    helpText: "Legal standard for sentence modification in this jurisdiction.",
  };
}

function createFederalStandardSection(district: string, circuit: string): TemplateSection {
  return {
    id: "federalStandard",
    name: "Federal Legal Standard",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPLICABLE FEDERAL LEGAL STANDARD — ${district} (${circuit} Circuit)

Federal Rule of Criminal Procedure 35:
(a) Correcting Clear Error — Within 14 days after sentencing, the court may correct a sentence that resulted from arithmetical, technical, or other clear error.
(b) Substantial Assistance — Upon the government's motion, the court may reduce a sentence to reflect substantial assistance in investigating or prosecuting another person.

18 U.S.C. § 3582(c) — Modification of Imposed Term of Imprisonment:
(1)(A) Compassionate Release — The court may reduce the term of imprisonment after considering the § 3553(a) factors if it finds extraordinary and compelling reasons warrant reduction, and such a reduction is consistent with applicable Sentencing Commission policy statements. The defendant must first exhaust administrative remedies (request to BOP warden) or wait 30 days after submitting the request.
(2) Retroactive Guidelines Amendment — The court may reduce a term of imprisonment if the defendant was sentenced based on a sentencing range that has subsequently been lowered by the Sentencing Commission, after considering § 3553(a) factors.

Section 3553(a) Factors:
(1) Nature and circumstances of the offense and the defendant's history;
(2) Need for the sentence to reflect the seriousness of the offense, promote respect for the law, provide just punishment, afford adequate deterrence, and protect the public;
(3) Kinds of sentences available;
(4) Applicable sentencing guidelines range;
(5) Pertinent Sentencing Commission policy statements;
(6) Need to avoid unwarranted sentencing disparities;
(7) Need to provide restitution to victims.

Key Authorities: United States v. Booker, 543 U.S. 220 (2005); Pepper v. United States, 562 U.S. 476 (2011); Dillon v. United States, 560 U.S. 817 (2010).`,
    helpText: "Federal legal standard for sentence modification motions.",
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
          helpText: `Select the ${countyLabel.toLowerCase()} where the case was adjudicated`,
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
      helpText: "Enter court and case information for the motion caption.",
    },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
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
      helpText: "Enter court and case information for the motion caption.",
    },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
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
    courtSpecificRules: `${district}: 12pt font. ${circuit} Circuit. CM/ECF required.`,
  });
}

export const motionForSentenceModificationTemplate: DocumentTemplate = {
  id: "motion-for-sentence-modification",
  name: "Motion for Sentence Modification / Reduction",
  category: "criminal",
  description: "A motion requesting modification or reduction of a previously imposed sentence. Filed under Federal Rule of Criminal Procedure 35, 18 U.S.C. § 3582(c), or state equivalents. Covers grounds including substantial assistance to the government, rehabilitation, changed sentencing guidelines, compassionate release, disproportionate sentencing, and extraordinary circumstances. Addresses the 18 U.S.C. § 3553(a) sentencing factors and victim notification requirements.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForSentenceModificationTemplate;
