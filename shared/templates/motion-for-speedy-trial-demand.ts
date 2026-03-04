/**
 * Motion for Speedy Trial Demand Template
 *
 * Criminal law document template asserting the defendant's right to a speedy trial.
 * Covers both the Sixth Amendment constitutional right and state statutory speedy trial
 * provisions. Applicable in virtually every criminal case at the threshold stage.
 *
 * Federal authority: 18 U.S.C. §§ 3161–3174 (Speedy Trial Act) and Barker v. Wingo,
 * 407 U.S. 514 (1972).
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

// ─── Input arrays ──────────────────────────────────────────────────────────────

const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., Superior Court, District Court",
    required: true,
    helpText: "The full name of the court where the criminal case is pending",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., 2025-CR-001234",
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

const caseInfoInputs: TemplateInput[] = [
  {
    id: "custodyStatus",
    label: "Custody Status",
    type: "select",
    required: true,
    helpText: "Whether the defendant is currently in custody or released",
    validation: {
      options: [
        { value: "in_custody", label: "In Custody (Detained)" },
        { value: "released_bond", label: "Released on Bond / Bail" },
        { value: "released_own_recognizance", label: "Released on Own Recognizance (ROR/OR)" },
        { value: "released_conditions", label: "Released on Conditions" },
      ],
    },
  },
  {
    id: "arrestDate",
    label: "Date of Arrest",
    type: "date",
    required: true,
    helpText: "The date the defendant was arrested or first taken into custody",
  },
  {
    id: "chargeDate",
    label: "Date of Charge / Indictment / Information",
    type: "date",
    required: true,
    helpText: "The date the formal charges were filed (indictment, information, or complaint)",
  },
  {
    id: "chargeType",
    label: "Charge Level",
    type: "select",
    required: true,
    helpText: "The level of the most serious pending charge",
    validation: {
      options: [
        { value: "felony", label: "Felony" },
        { value: "misdemeanor", label: "Misdemeanor" },
        { value: "mixed", label: "Mixed (Felony and Misdemeanor)" },
      ],
    },
  },
  {
    id: "chargesDescription",
    label: "Pending Charge(s)",
    type: "textarea",
    placeholder: "List the pending charges...",
    required: true,
    helpText: "The charges for which the defendant has been charged and is awaiting trial",
    validation: {
      minLength: 5,
      maxLength: 1000,
    },
  },
  {
    id: "trialDateSet",
    label: "Trial Date Set?",
    type: "select",
    required: true,
    helpText: "Whether a trial date has been scheduled",
    validation: {
      options: [
        { value: "yes", label: "Yes — trial date has been set" },
        { value: "no", label: "No — no trial date has been set" },
      ],
    },
  },
  {
    id: "trialDate",
    label: "Scheduled Trial Date",
    type: "date",
    required: false,
    helpText: "The current scheduled trial date, if one has been set",
  },
  {
    id: "priorContinuances",
    label: "Prior Continuances / Excludable Time",
    type: "select",
    required: true,
    helpText: "Whether any prior continuances or excludable periods have tolled the speedy trial clock",
    validation: {
      options: [
        { value: "none", label: "None — no excludable periods" },
        { value: "defense_requested", label: "Yes — defense-requested continuances" },
        { value: "court_ordered", label: "Yes — court-ordered continuances (other)" },
        { value: "both", label: "Yes — both defense and prosecution continuances" },
        { value: "disputed", label: "Disputed — nature of excludable time is contested" },
      ],
    },
  },
  {
    id: "excludableTimeDescription",
    label: "Description of Excludable Periods (if any)",
    type: "textarea",
    placeholder: "Describe any continuances or excludable time periods and their dates...",
    required: false,
    helpText: "If any periods are excludable from the speedy trial calculation, describe them here",
    validation: {
      maxLength: 2000,
    },
  },
  {
    id: "priorDemand",
    label: "Prior Speedy Trial Demand Filed?",
    type: "select",
    required: true,
    helpText: "Whether a previous speedy trial demand has already been filed in this case",
    validation: {
      options: [
        { value: "no", label: "No — this is the first demand" },
        { value: "yes", label: "Yes — a prior demand was filed" },
      ],
    },
  },
];

const demandBasisInputs: TemplateInput[] = [
  {
    id: "demandBasis",
    label: "Basis for Demand",
    type: "select",
    required: true,
    helpText: "The legal authority on which the speedy trial demand is based",
    validation: {
      options: [
        { value: "constitutional_only", label: "Sixth Amendment (Constitutional) Only" },
        { value: "statutory_only", label: "State / Federal Statute Only" },
        { value: "both", label: "Both Constitutional and Statutory" },
      ],
    },
  },
  {
    id: "prejudiceDescription",
    label: "Prejudice to Defendant",
    type: "textarea",
    placeholder: "Describe how the delay has prejudiced the defendant (oppressive pretrial incarceration, anxiety, impaired defense, lost witnesses, faded memories, etc.)...",
    required: true,
    helpText: "Describe specific prejudice caused by the delay — this strengthens both constitutional and statutory arguments",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "reasonForDelay",
    label: "Reason for Delay (if known)",
    type: "select",
    required: true,
    helpText: "The primary reason the case has not yet been brought to trial",
    validation: {
      options: [
        { value: "prosecution_not_ready", label: "Prosecution Not Ready / Lack of Diligence" },
        { value: "court_congestion", label: "Court Congestion / Institutional Delay" },
        { value: "prosecution_continuances", label: "Prosecution-Requested Continuances" },
        { value: "neutral_delay", label: "Neutral / Administrative Delay" },
        { value: "unknown", label: "Reason Unknown" },
      ],
    },
  },
  {
    id: "reliefSought",
    label: "Primary Relief Sought",
    type: "select",
    required: true,
    helpText: "The primary remedy requested",
    validation: {
      options: [
        { value: "dismissal_with_prejudice", label: "Dismissal with Prejudice" },
        { value: "dismissal_without_prejudice", label: "Dismissal without Prejudice" },
        { value: "immediate_trial", label: "Immediate / Priority Trial Date" },
        { value: "dismissal_or_trial", label: "Dismissal, or in the Alternative, Immediate Trial" },
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
    helpText: "Whether you are requesting an oral hearing on this motion",
    validation: {
      options: [
        { value: "yes", label: "Oral hearing requested" },
        { value: "no", label: "Submit on papers" },
      ],
    },
  },
];

// ─── Base sections ─────────────────────────────────────────────────────────────

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
    id: "caseInfo",
    name: "Case Information & Timeline",
    type: "user-input",
    order: 2,
    inputs: caseInfoInputs,
    required: true,
    helpText: "Provide the dates and custody status necessary to calculate the speedy trial period.",
  },
  {
    id: "demandBasis",
    name: "Basis for Demand & Prejudice",
    type: "user-input",
    order: 3,
    inputs: demandBasisInputs,
    required: true,
    helpText: "Specify the legal authority for the demand and describe prejudice to the defendant.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a Motion for Speedy Trial Demand in a criminal case.

Custody status: {{custodyStatus}}
Arrest date: {{arrestDate}}
Charge date: {{chargeDate}}
Charge level: {{chargeType}}
Pending charges: {{chargesDescription}}
Trial date set: {{trialDateSet}}
Scheduled trial date: {{trialDate}}
Prior continuances: {{priorContinuances}}
Excludable time: {{excludableTimeDescription}}
Prior demand filed: {{priorDemand}}
Basis for demand: {{demandBasis}}
Prejudice to defendant: {{prejudiceDescription}}
Reason for delay: {{reasonForDelay}}
Relief sought: {{reliefSought}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs:
  1. Opening paragraph asserting the speedy trial right under the Sixth Amendment and applicable state statute (if any)
  2. Timeline calculation showing days elapsed and any excludable periods
  3. Application of the applicable legal standard to the facts (Barker v. Wingo, 407 U.S. 514 (1972), or statutory standard)
  4. Prejudice analysis — describe and weigh the four Barker factors: (1) length of delay, (2) reason for delay, (3) defendant's assertion of the right, and (4) prejudice to the defendant
  5. Prayer for relief
- If demandBasis includes "constitutional_only" or "both": Apply the four-factor Barker v. Wingo balancing test
- If demandBasis includes "statutory_only" or "both": Cite the applicable statute from the jurisdiction's standard section
- If custody status is "in_custody": Emphasize oppressive pretrial incarceration as a form of prejudice
- For felonies: Note the particularly heavy weight of the right and potential for impaired defense preparation
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a criminal speedy trial demand. Apply the Barker v. Wingo, 407 U.S. 514 (1972) four-factor balancing test (length of delay, reason for delay, assertion of the right, prejudice to defendant) for the constitutional claim. For the statutory claim, apply the time limit and excludable-time rules cited in the jurisdiction-specific standard section. If the defendant is detained, emphasize the particularly severe prejudice of pretrial incarceration. Do not fabricate case citations.",
    helpText: "AI drafts the legal argument based on the timeline, basis, and prejudice information provided.",
  },
  {
    id: "reliefAndHearing",
    name: "Relief Requested & Hearing",
    type: "user-input",
    order: 5,
    inputs: hearingInputs,
    required: true,
    helpText: "Specify the hearing preference.",
  },
];

// ─── Jurisdiction data ─────────────────────────────────────────────────────────

interface StateSpeedyTrialRule {
  rule: string;
  timeLimit: string;
  demandRequired: boolean;
  consequences: string;
  keyCaseLaw: string;
  counties?: { value: string; label: string }[];
  countyLabel?: string;
}

const stateRules: Record<string, StateSpeedyTrialRule> = {
  AL: {
    rule: "Ala. R. Crim. P. 6.1; Ala. Code § 15-3-1, § 15-3-2",
    timeLimit: "Felony: 1 year from indictment or information. Misdemeanor: 12 months from arrest. Formal written demand required under § 15-3-2 to trigger dismissal.",
    demandRequired: true,
    consequences: "Dismissal with prejudice after demand and failure to bring to trial within prescribed time.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Ex parte Walker, 928 So. 2d 259 (Ala. 2005)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 45",
    timeLimit: "120 days from the time the defendant is charged, arrested, or arraigned, whichever is earliest. Certain periods are excluded (e.g., defendant-requested continuances, unavailability of counsel at defendant's request).",
    demandRequired: false,
    consequences: "Dismissal with prejudice upon violation of Rule 45.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); James v. State, 738 P.2d 804 (Alaska App. 1987)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 8.2, 8.4, 8.6",
    timeLimit: "90 days from arrest/arraignment if in custody; 150 days if released. Excludes time attributable to defendant or agreed continuances. Rule 8.4 lists excluded periods.",
    demandRequired: false,
    consequences: "Dismissal with or without prejudice. Court weighs: reasons for delay, prejudice to defendant, whether defendant sought dismissal or trial.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Vasko, 193 Ariz. 142 (App. 1998)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 28.1, 28.2, 28.3",
    timeLimit: "Felony: 12 months from filing of information, indictment, or arrest, whichever is earliest. Misdemeanor: 9 months. Excludable periods include: defense-requested continuances, time to determine competency, interlocutory appeals.",
    demandRequired: false,
    consequences: "Absolute discharge and dismissal with prejudice upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Verdell, 2003 Ark. App. 204",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1382; Cal. Const. art. I § 15",
    timeLimit: "Felony: 60 days from arraignment unless good cause shown. Misdemeanor (in custody): 30 days from arraignment; (not in custody, jury trial demanded): 45 days. Continuances granted for good cause toll the period.",
    demandRequired: false,
    consequences: "Mandatory dismissal without prejudice unless the delay was caused by the defendant or good cause is shown. Refiling may be barred if prejudice results.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); People v. Johnson, 26 Cal.3d 557 (1980)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 48(b)(1)",
    timeLimit: "6 months (180 days) from arraignment or date of not-guilty plea. Excludes: defense-requested continuances, time for competency evaluation, interlocutory appeals. Clock can be reset upon re-arrest.",
    demandRequired: false,
    consequences: "Dismissal without prejudice unless the court finds exceptional circumstances; court may also dismiss with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); People v. Stenz, 193 Colo. 399 (1977)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 44-3; Conn. Const. art. I § 8",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies using the four Barker v. Wingo factors: (1) length of delay, (2) reason for delay, (3) assertion of the right, (4) prejudice to the defendant.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice depending on the degree of prejudice and culpability of the State.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Coleman, 214 Conn. 818 (1990)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Const. art. I § 7; Del. Super. Ct. Crim. R. 48",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies. Rule 48(b) permits dismissal for unnecessary delay by the prosecution.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice under Rule 48(b).",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Tini, 662 A.2d 817 (Del. Super. 1995)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Code § 23-102; D.C. Super. Ct. Crim. R. 48(b)(1)",
    timeLimit: "100 days from arrest for defendants who remain in custody throughout. Constitutional Barker v. Wingo analysis also applies. Rule 48(b)(1) allows dismissal for unreasonable delay.",
    demandRequired: false,
    consequences: "Dismissal. Courts may dismiss with or without prejudice depending on circumstances.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Drope v. United States, 397 A.2d 1 (D.C. 1979)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.191",
    timeLimit: "Misdemeanor: 90 days from arrest. Felony: 175 days from arrest. Demand for speedy trial must be filed at least 60 days before the trial date (5-day window to bring to trial after demand). Constitutional right under Art. I § 16 also applies.",
    demandRequired: true,
    consequences: "Mandatory dismissal with prejudice if trial does not commence within 5 days after proper demand period, absent extraordinary circumstances.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Williams, 791 So. 2d 1088 (Fla. 2001)",
  },
  GA: {
    rule: "Ga. Code Ann. § 17-7-170, § 17-7-171",
    timeLimit: "Formal written demand for trial must be filed. Prosecution must answer demand within two terms of court (approximately 6 months each). If not tried within two terms after demand, defendant is entitled to acquittal by operation of law.",
    demandRequired: true,
    consequences: "Absolute bar to prosecution; defendant entitled to acquittal. This is a unique and powerful remedy under Georgia law.",
    keyCaseLaw: "Boseman v. State, 263 Ga. 730 (1993); Birts v. State, 256 Ga. App. 214 (2002)",
  },
  HI: {
    rule: "Haw. R. Penal P. 48",
    timeLimit: "180 days from arrest, charge, or service of summons, whichever is earliest. Excludable periods include: defense continuances, competency determinations, interlocutory appeals.",
    demandRequired: false,
    consequences: "Dismissal of charges. Court may dismiss with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Hoey, 77 Haw. 17 (1994)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 48",
    timeLimit: "6 months (180 days) from arraignment or not-guilty plea. Periods excluded by court order for good cause, defense continuances, and competency evaluations do not count.",
    demandRequired: false,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Beck, 128 Idaho 416 (1996)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/103-5",
    timeLimit: "In custody: 120 days from arrest. Released on bail: 160 days from arrest. Excludes: delay from defense motions or continuances, delay resulting from fitness proceedings, period of interlocutory appeal.",
    demandRequired: false,
    consequences: "Dismissal with prejudice upon violation. Automatic — no weighing of prejudice required for the statutory claim.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); People v. Cordell, 223 Ill.2d 380 (2006)",
  },
  IN: {
    rule: "Ind. Crim. Rule 4",
    timeLimit: "In custody: 70 days from initial hearing. Released on bail: 1 year from initial hearing. Excludes defense-requested continuances and periods attributable to the defendant.",
    demandRequired: false,
    consequences: "Discharge (dismissal without prejudice). Constitutional claim may yield stronger remedy.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Hanna v. State, 726 N.E.2d 384 (Ind. Ct. App. 2000)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.33(2)(b)",
    timeLimit: "In custody: 90 days from arraignment. Released: 1 year from arraignment. Excludes: defendant continuances, competency proceedings, agreed continuances.",
    demandRequired: false,
    consequences: "Dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Petersen, 288 N.W.2d 332 (Iowa 1980)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "Kan. Stat. § 22-3402",
    timeLimit: "In custody: 90 days from arraignment. Released: 180 days from arraignment. Excludes: delays caused by defendant, continuances for good cause agreed to by defendant.",
    demandRequired: false,
    consequences: "Dismissal. Court determines with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Dreiling, 274 Kan. 1134 (2002)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "Ky. R. Crim. P. 8.05; Ky. Const. § 11",
    timeLimit: "Constitutional analysis applies under Barker v. Wingo. No specific statutory speedy trial period. Rule 8.05 provides the mechanism to assert the right and demand a trial date. Courts use the four Barker factors.",
    demandRequired: true,
    consequences: "Dismissal with prejudice if the constitutional right is violated. The demand is essential to trigger the formal analysis.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Bratcher v. Commonwealth, 151 S.W.3d 332 (Ky. 2004)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. Code Crim. Proc. Art. 578, 701",
    timeLimit: "Art. 578: Felony prosecution must be brought to trial within 2 years of institution of prosecution. Misdemeanor: 1 year. Art. 701: Defendant in custody may make a written demand for speedy trial; if not tried within 120 days of demand (felony) or 30 days (misdemeanor), entitled to release and eventual dismissal.",
    demandRequired: true,
    consequences: "Dismissal with prejudice under Art. 578. For Art. 701 demand, bail reduction or release, then dismissal.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Joiner, 555 So. 2d 1231 (La. 1990)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 48(b); Me. Const. art. I § 6",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies. Rule 48(b) permits the court to dismiss for unnecessary delay by the prosecution. Barker v. Wingo factors govern.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice under Rule 48(b).",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Hunter, 447 A.2d 797 (Me. 1982)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. Rule 4-271; Md. Const., Decl. of Rights Art. 21",
    timeLimit: "Trial must commence within 180 days of the initial appearance of defendant's counsel or waiver of counsel. Constitutional right also exists. Continuances for good cause may be granted.",
    demandRequired: false,
    consequences: "Dismissal without prejudice for Rule 4-271 violation (Hicks rule). Constitutional violation may require dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Hicks v. State, 285 Md. 310 (1979)",
  },
  MA: {
    rule: "Mass. Gen. L. c. 277 § 72; Mass. R. Crim. P. 36",
    timeLimit: "1 year from arraignment for most felonies; 6 months for misdemeanors. Rule 36 provides the mechanism. Constitutional right also available.",
    demandRequired: true,
    consequences: "Dismissal without prejudice for statutory violation. Constitutional violation may yield dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Commonwealth v. Cordero, 26 Mass. App. Ct. 79 (1988)",
  },
  MI: {
    rule: "Mich. Ct. Rule 6.004(D); MCL 768.1",
    timeLimit: "6 months (180 days) from the date of the arrest, filing of the complaint, or arraignment, whichever is earliest. Excludes: defendant continuances, competency proceedings, interlocutory appeals, other agreed delays.",
    demandRequired: false,
    consequences: "Dismissal with prejudice for in-custody defendants; dismissal without prejudice for out-of-custody defendants.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); People v. Collins, 388 Mich. 680 (1972)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 11.10",
    timeLimit: "Defendant may demand a speedy trial at or after arraignment. Once a speedy trial demand is filed, trial must commence within 60 days unless good cause shown for delay. Constitutional right also applicable.",
    demandRequired: true,
    consequences: "Dismissal without prejudice if the 60-day period is violated without good cause. Constitutional violation may yield stronger relief.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Windish, 590 N.W.2d 311 (Minn. 1999)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. Code Ann. § 99-17-1; Miss. Const. art. 3 § 26",
    timeLimit: "270 days from arraignment. Defendant must appear and demand a trial. Constitutional right also applies.",
    demandRequired: true,
    consequences: "Dismissal with prejudice upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Davis, 382 So. 2d 1066 (Miss. 1980)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. Const. art. I § 18(a); Mo. R. Crim. P. 33.12",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies under Barker v. Wingo. Rule 33.12 allows defendant to file a speedy trial demand. Some circuits use 6-month informal benchmark.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice depending on the Barker v. Wingo balancing test.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Williams, 987 S.W.2d 222 (Mo. App. 1999)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-13-401; Mont. Const. art. II § 24",
    timeLimit: "6 months (180 days) from arraignment or date of entry of not guilty plea, whichever is later. Excludes: defendant continuances, competency proceedings, good-cause continuances.",
    demandRequired: false,
    consequences: "Dismissal with prejudice upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Stops, 250 Mont. 270 (1991)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-1207, 29-1208",
    timeLimit: "6 months (180 days) from filing of information or indictment. If defendant is in custody at arraignment, clock starts at arraignment. Excludes: delays caused by defendant, unavailability of witnesses or evidence.",
    demandRequired: false,
    consequences: "Absolute discharge of the defendant if violated.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Sutter, 228 Neb. 316 (1988)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "Nev. Rev. Stat. § 178.556, 178.558",
    timeLimit: "In custody: 60 days from arraignment (may be extended to 90 days by court for good cause). Released on bail: 90 days from arraignment. Constitutional right also applies.",
    demandRequired: false,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Medina v. State, 107 Nev. 287 (1991)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. Rev. Stat. § 606:3; N.H. Const. Part I Art. 14",
    timeLimit: "No specific statutory time limit. Constitutional analysis under Barker v. Wingo applies. § 606:3 provides a mechanism to demand trial. Courts weigh all four Barker factors.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Young, 128 N.H. 169 (1986)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:25-3; N.J. Const. art. I ¶ 10",
    timeLimit: "Within 180 days of return or filing of indictment (Case Track B — standard). Defense must file a motion if the track deadline is missed. Constitutional right also applies.",
    demandRequired: true,
    consequences: "Dismissal without prejudice typically; constitutional violation may result in dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Szima, 70 N.J. 196 (1976)",
  },
  NM: {
    rule: "NMRA 5-604; N.M. Const. art. II § 14",
    timeLimit: "6 months (180 days) from arraignment or written waiver of arraignment. Excludable periods defined in Rule 5-604(B).",
    demandRequired: false,
    consequences: "Dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Coffin, 128 N.M. 192 (1999)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "N.Y. CPL § 30.20, 30.30; N.Y. Const. art. I § 6",
    timeLimit: "CPL § 30.30 (Statutory): Felony — 6 months from commencement of criminal action. Misdemeanor (punishable by > 3 months) — 90 days. Other misdemeanor — 60 days. Prosecution readiness requirement: People must declare ready within the time period. CPL § 30.20 (Constitutional): Barker v. Wingo analysis.",
    demandRequired: true,
    consequences: "Dismissal with prejudice under CPL § 30.30. Under § 30.20, court balances factors.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); People v. Taranovich, 37 N.Y.2d 442 (1975); People v. England, 84 N.Y.2d 1 (1994)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-701, 15A-711",
    timeLimit: "120 days from arrest or first appearance (whichever is later) for defendants in custody. Out-of-custody defendants may file a written demand; prosecution then has 120 days to bring to trial.",
    demandRequired: false,
    consequences: "Dismissal without prejudice unless delay was willful, in which case dismissal with prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Marlow, 310 N.C. 507 (1984)",
  },
  ND: {
    rule: "N.D. R. Crim. P. 48; N.D. Const. art. I § 12",
    timeLimit: "90 days from arraignment. Excludes: defense continuances, incompetency proceedings, interlocutory appeals.",
    demandRequired: false,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Mortimer, 361 N.W.2d 45 (N.D. 1985)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Rev. Code § 2945.71, 2945.72, 2945.73",
    timeLimit: "Misdemeanor: 90 days from arrest. Felony: 270 days from arrest. Special rule: each day the defendant is in jail in lieu of bail on the pending charge counts as three days (§ 2945.71(E)).",
    demandRequired: false,
    consequences: "Dismissal with prejudice. The statutory right is absolute — no weighing of prejudice required.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. MacDonald, 48 Ohio St.2d 66 (1976)",
  },
  OK: {
    rule: "Okla. Stat. tit. 22 § 812, 812.1",
    timeLimit: "180 days from arraignment. Written demand for trial may be filed under § 812. If demand is filed and prosecution is not ready at two successive terms of court after demand, defendant may be discharged.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice depending on circumstances of delay.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Strunk v. United States, 412 U.S. 434 (1973)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "Or. Rev. Stat. § 135.745, 135.747, 135.750",
    timeLimit: "In custody: 60 days from arrest. Released: 90 days from arrest. § 135.747 allows defendant to make written demand; § 135.750 mandates discharge if trial not commenced within statutory period after demand.",
    demandRequired: false,
    consequences: "Discharge (dismissal with prejudice) upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Garcia, 288 Or. App. 97 (2017)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa. R. Crim. P. 600",
    timeLimit: "365 days (1 year) from the date the criminal complaint is filed. Excusable and excludable time may toll the clock (Rule 600(C)).",
    demandRequired: false,
    consequences: "Dismissal with prejudice upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Commonwealth v. Preston, 904 A.2d 1 (Pa. Super. 2006)",
  },
  RI: {
    rule: "R.I. Gen. Laws § 12-13-7; R.I. Const. art. I § 10",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies. § 12-13-7 provides that a defendant not tried within a term of court after indictment may petition for discharge.",
    demandRequired: true,
    consequences: "Dismissal. Court weighs Barker factors.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Tarvis, 465 A.2d 164 (R.I. 1983)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. Code Ann. § 17-23-90; S.C. Const. art. I § 14",
    timeLimit: "Written demand for trial must be filed. Prosecution must bring to trial within two terms of court after the demand, or at the next succeeding term. Failure results in dismissal.",
    demandRequired: true,
    consequences: "Discharge (dismissal with prejudice) after two terms following demand without trial.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Foster, 260 S.C. 511 (1973)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "S.D. Codified Laws § 23A-44-5.1",
    timeLimit: "Felony: 180 days from filing of indictment/information. Misdemeanor: 90 days. Excludes: defense continuances, competency proceedings, agreed delays.",
    demandRequired: false,
    consequences: "Dismissal.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Richter, 2002 SD 38",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. Code Ann. § 40-14-101; Tenn. R. Crim. P. 48(b); Tenn. Const. art. I § 9",
    timeLimit: "Constitutional: defendant may not be held under indictment more than two terms of court without trial (Art. I § 9). Statutory: Rule 48(b) allows court to dismiss for unreasonable delay. Constitutional analysis also applies.",
    demandRequired: true,
    consequences: "Dismissal. Constitutional violation: dismissal with prejudice; Rule 48(b): court's discretion.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Bishop, 493 S.W.3d 739 (Tenn. 2015)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 1.05, 17.151, 32.01",
    timeLimit: "Art. 17.151: Defendant in custody entitled to release on personal bond or reduction of bail if not tried within 90 days (felony) or 30 days (misdemeanor). Art. 32.01: Felony must be tried at next term after indictment unless dismissed for good cause. Constitutional right also applies.",
    demandRequired: true,
    consequences: "Bail reduction or release under Art. 17.151; dismissal may be sought under Art. 32.01 and constitutional ground.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Zamorano v. State, 84 S.W.3d 643 (Tex. Crim. App. 2002)",
  },
  UT: {
    rule: "Utah Code § 77-29-1; Utah R. Crim. P. 28; Utah Const. art. I § 12",
    timeLimit: "No specific statutory time limit. Constitutional analysis under Barker v. Wingo applies. § 77-29-1 permits demand for trial; Rule 28 governs scheduling. Courts weigh all four Barker factors.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice depending on Barker analysis.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Larsen, 834 P.2d 586 (Utah App. 1992)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 48(b); Vt. Const. Ch. I Art. 10",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies. Rule 48(b) permits dismissal for failure to prosecute. Barker v. Wingo factors govern.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Austin, 165 Vt. 389 (1996)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-243; Va. Const. art. I § 8",
    timeLimit: "In custody (felony): 5 months. In custody (misdemeanor): 5 months. Not in custody (felony): 9 months. Not in custody (misdemeanor): 9 months. Continuances at request of accused toll the period.",
    demandRequired: false,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Godfrey v. Commonwealth, 227 Va. 460 (1984)",
  },
  WA: {
    rule: "Wash. CrR 3.3",
    timeLimit: "In custody: 60 days from arraignment. Released: 90 days from arraignment. Excludable periods include: defendant continuances, unavailability of counsel at defendant's request, competency proceedings.",
    demandRequired: false,
    consequences: "Dismissal with prejudice upon violation.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Raper, 47 Wn. App. 530 (1987)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 48; W. Va. Const. art. III § 14",
    timeLimit: "No specific statutory time limit. Constitutional analysis applies. Rule 48(b) permits dismissal for unnecessary delay. Barker v. Wingo factors govern.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Foddrell, 171 W.Va. 54 (1982)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 971.10",
    timeLimit: "In custody: 90 days from initial appearance. Released on bail: 180 days from initial appearance. Excludes: defense continuances, competency proceedings, interlocutory appeals.",
    demandRequired: false,
    consequences: "Dismissal without prejudice.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); State v. Hogan, 200 Wis.2d 614 (App. 1996)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. Stat. § 7-11-203; Wyo. R. Crim. P. 48; Wyo. Const. art. 1 § 10",
    timeLimit: "No specific statutory time limit. Constitutional analysis under Barker v. Wingo applies. § 7-11-203 and Rule 48 provide the mechanism for the demand and court scheduling.",
    demandRequired: true,
    consequences: "Dismissal with or without prejudice based on the Barker balancing test.",
    keyCaseLaw: "Barker v. Wingo, 407 U.S. 514 (1972); Price v. State, 807 P.2d 909 (Wyo. 1991)",
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

// ─── Section factories ─────────────────────────────────────────────────────────

function createStateStandardSection(state: string): TemplateSection {
  const rule = stateRules[state];
  return {
    id: "jurisdictionStandard",
    name: "Jurisdiction-Specific Speedy Trial Standard",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPLICABLE SPEEDY TRIAL STANDARD — ${state}

Rule / Statute: ${rule.rule}

Time Limit: ${rule.timeLimit}

Formal Demand Required: ${rule.demandRequired ? "Yes — a written demand for speedy trial must be filed." : "No — the statutory period runs automatically from the triggering date."}

Consequences of Violation: ${rule.consequences}

Key Case Law: ${rule.keyCaseLaw}

Note: Even where a statutory time limit applies, the constitutional right under the Sixth Amendment (Barker v. Wingo, 407 U.S. 514 (1972)) remains independently available. The Barker four-factor balancing test — length of delay, reason for delay, defendant's assertion of the right, and prejudice — applies to all constitutional speedy trial claims regardless of state statute.`,
    helpText: "Speedy trial standard for this jurisdiction.",
  };
}

function createFederalStandardSection(district: string, circuit: string): TemplateSection {
  return {
    id: "federalStandard",
    name: "Federal Speedy Trial Standard",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPLICABLE FEDERAL SPEEDY TRIAL STANDARD — ${district} (${circuit} Circuit)

Sixth Amendment (Constitutional):
Barker v. Wingo, 407 U.S. 514 (1972) — four-factor balancing test:
(1) Length of delay — presumptively prejudicial if over 1 year; must be sufficient to trigger full analysis
(2) Reason for delay — deliberate delay weighs heavily against government; negligence weighs less heavily; valid reasons (missing witnesses, etc.) may justify delay
(3) Defendant's assertion of the right — failure to assert is weighed against the defendant
(4) Prejudice — courts consider: (a) oppressive pretrial incarceration; (b) anxiety and concern; (c) impairment of defense (most serious)
Remedy: Dismissal with prejudice. See Strunk v. United States, 412 U.S. 434 (1973).

Speedy Trial Act (Statutory): 18 U.S.C. §§ 3161–3174
§ 3161(b): Indictment or information must be filed within 30 days of arrest (if grand jury not in session, 30 additional days).
§ 3161(c)(1): Trial must commence within 70 days from indictment/information or arraignment, whichever is later.
§ 3161(h): Excludable periods include: competency/mental health proceedings; interlocutory appeals; pretrial motions; transportation of defendant; "ends of justice" continuances (§ 3161(h)(7)); co-defendant delays (§ 3161(h)(6)).
§ 3162(a)(2): Remedy — dismissal with or without prejudice. Court considers: seriousness of offense, facts and circumstances leading to dismissal, impact on the administration of justice, prejudice to the defendant.

Key Authorities: Barker v. Wingo, 407 U.S. 514 (1972); Strunk v. United States, 412 U.S. 434 (1973); United States v. Loud Hawk, 474 U.S. 302 (1986); Zedner v. United States, 547 U.S. 489 (2006).`,
    helpText: "Federal speedy trial standard.",
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
          helpText: `Select the ${countyLabel.toLowerCase()} where the case is pending`,
          validation: {
            options: rule.counties,
          },
        },
      ]
    : captionInputs;

  return [
    createStateStandardSection(state),
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

function createFederalSections(district: string, circuit: string): TemplateSection[] {
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

// ─── Build jurisdiction variants ──────────────────────────────────────────────

const allStateSections: Record<string, TemplateSection[]> = {};
for (const state of Object.keys(stateRules)) {
  allStateSections[state] = createStateSections(state);
}

const allFederalSections: Record<string, TemplateSection[]> = {};
for (const { district, jurisdiction } of federalDistricts) {
  const circuit = circuitMap[jurisdiction];
  allFederalSections[district] = createFederalSections(district, circuit);
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
    courtSpecificRules: `${rule.rule}. ${rule.timeLimit} Demand required: ${rule.demandRequired ? "Yes" : "No"}. ${rule.consequences}`,
  });
}

for (const { jurisdiction, district } of federalDistricts) {
  const circuit = circuitMap[jurisdiction];
  jurisdictionVariants.push({
    jurisdiction,
    courtType: "federal",
    district,
    sections: allFederalSections[district],
    courtSpecificRules: `${district}: Federal Speedy Trial Act (18 U.S.C. §§ 3161-3174). 70-day trial commencement period. ${circuit} Circuit.`,
  });
}

// ─── Export ────────────────────────────────────────────────────────────────────

export const motionForSpeedyTrialDemandTemplate: DocumentTemplate = {
  id: "motion-for-speedy-trial-demand",
  name: "Motion for Speedy Trial Demand",
  category: "criminal",
  description:
    "A formal demand asserting the defendant's right to a speedy trial under the Sixth Amendment and applicable state or federal statutory provisions. One of the most universally applicable criminal defense motions, filed when the prosecution has failed to bring the case to trial within the constitutionally or statutorily prescribed time period. Covers both the Sixth Amendment Barker v. Wingo four-factor balancing test and the federal Speedy Trial Act (18 U.S.C. §§ 3161–3174), plus the speedy trial statute for all 50 states and DC. Time-sensitive — delays in asserting the right can be held against the defendant under the Barker analysis.",
  version: "1.0.0",
  lastUpdated: new Date("2026-03-04"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "15-25 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForSpeedyTrialDemandTemplate;
