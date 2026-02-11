/**
 * Motion for Mistrial Template
 *
 * Criminal law document template for requesting a mistrial during trial proceedings
 * when prejudicial error occurs making a fair trial impossible.
 * Covers prosecutorial misconduct, juror misconduct, inadmissible evidence exposure,
 * witness testimony violations, or other manifest necessity.
 * Applies the Arizona v. Washington, 434 U.S. 497 (1978) manifest necessity standard.
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

const trialDetailsInputs: TemplateInput[] = [
  {
    id: "trialDate",
    label: "Current Trial Date",
    type: "date",
    required: true,
    helpText: "The date of the current trial proceeding",
  },
  {
    id: "trialPhase",
    label: "Trial Phase When Incident Occurred",
    type: "select",
    required: true,
    helpText: "The phase of trial during which the prejudicial incident occurred",
    validation: {
      options: [
        { value: "jury_selection", label: "Jury Selection / Voir Dire" },
        { value: "opening_statements", label: "Opening Statements" },
        { value: "prosecution_case", label: "Prosecution's Case-in-Chief" },
        { value: "defense_case", label: "Defense Case" },
        { value: "closing_arguments", label: "Closing Arguments" },
        { value: "deliberation", label: "Jury Deliberation" },
      ],
    },
  },
  {
    id: "judgeAssigned",
    label: "Judge Assigned",
    type: "text",
    placeholder: "e.g., Hon. Jane Smith",
    required: false,
    helpText: "The name of the presiding judge",
  },
];

const mistrialGroundsInputs: TemplateInput[] = [
  {
    id: "mistrialBasis",
    label: "Basis for Mistrial",
    type: "select",
    required: true,
    helpText: "Select the primary basis for the mistrial request",
    validation: {
      options: [
        { value: "prosecutorial_misconduct", label: "Prosecutorial Misconduct" },
        { value: "juror_misconduct", label: "Juror Misconduct" },
        { value: "inadmissible_evidence", label: "Exposure to Inadmissible Evidence" },
        { value: "witness_violation", label: "Witness Testimony Violation" },
        { value: "hung_jury", label: "Hung Jury / Inability to Reach Verdict" },
        { value: "media_exposure", label: "Juror Exposure to Media Coverage" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "incidentDescription",
    label: "Description of Prejudicial Incident",
    type: "textarea",
    placeholder: "Provide a detailed description of the incident or error requiring mistrial...",
    required: true,
    helpText: "Describe in detail the specific incident, error, or misconduct that necessitates a mistrial",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "dateOfIncident",
    label: "Date of Incident",
    type: "date",
    required: true,
    helpText: "The date on which the prejudicial incident occurred",
  },
  {
    id: "curativeAction",
    label: "Curative Action Taken",
    type: "select",
    required: true,
    helpText: "Whether any curative measures were attempted and their adequacy",
    validation: {
      options: [
        { value: "none_taken", label: "No Curative Action Was Taken" },
        { value: "instruction_given_insufficient", label: "Curative Instruction Given — Insufficient" },
        { value: "instruction_given_inadequate", label: "Curative Instruction Given — Inadequate to Cure Prejudice" },
        { value: "other", label: "Other Curative Measures Attempted" },
      ],
    },
  },
  {
    id: "curingAttemptDetails",
    label: "Details of Curative Attempts",
    type: "textarea",
    placeholder: "Describe any curative actions attempted and why they were insufficient...",
    required: false,
    helpText: "If curative measures were attempted, describe them and explain why they are insufficient to cure the prejudice",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "prejudiceToDefendant",
    label: "Prejudice to Defendant",
    type: "textarea",
    placeholder: "Explain how the incident prejudices the defendant's right to a fair trial...",
    required: true,
    helpText: "Describe how the incident or error has irreparably prejudiced the defendant's right to a fair trial",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
];

const prosecutionPositionInputs: TemplateInput[] = [
  {
    id: "prosecutionPosition",
    label: "Prosecution Position",
    type: "select",
    required: true,
    helpText: "Indicate the prosecution's position on this motion, if known",
    validation: {
      options: [
        { value: "agrees", label: "Prosecution Agrees / Consents" },
        { value: "opposes", label: "Prosecution Opposes" },
        { value: "not_contacted", label: "Prosecution Not Yet Contacted" },
        { value: "unknown", label: "Position Unknown" },
      ],
    },
  },
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
    id: "trialDetails",
    name: "Trial Details",
    type: "user-input",
    order: 2,
    inputs: trialDetailsInputs,
    required: true,
    helpText: "Provide details about the trial proceedings.",
  },
  {
    id: "mistrialGrounds",
    name: "Mistrial Grounds",
    type: "user-input",
    order: 3,
    inputs: mistrialGroundsInputs,
    required: true,
    helpText: "Describe the grounds for requesting a mistrial.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for mistrial in a criminal case.

Trial date: {{trialDate}}
Trial phase: {{trialPhase}}
Judge assigned: {{judgeAssigned}}
Basis for mistrial: {{mistrialBasis}}
Incident description: {{incidentDescription}}
Date of incident: {{dateOfIncident}}
Curative action taken: {{curativeAction}}
Curative attempt details: {{curingAttemptDetails}}
Prejudice to defendant: {{prejudiceToDefendant}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard for granting a mistrial
  2. Cite Arizona v. Washington, 434 U.S. 497 (1978) — manifest necessity standard for declaring a mistrial; high degree of necessity required
  3. Cite Illinois v. Somerville, 410 U.S. 458 (1973) — manifest necessity may exist when trial cannot continue to a fair conclusion
  4. Apply the facts of the prejudicial incident to the legal standard
  5. Explain why curative measures are insufficient to remedy the prejudice
  6. Address double jeopardy implications — if mistrial is granted over defendant's objection without manifest necessity, retrial may be barred
  7. Conclude that a mistrial is the only adequate remedy to protect the defendant's constitutional right to a fair trial
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion for mistrial. Apply the manifest necessity standard from Arizona v. Washington, 434 U.S. 497 (1978), which requires a high degree of necessity before a mistrial is declared. Cite Illinois v. Somerville, 410 U.S. 458 (1973) for the proposition that manifest necessity exists when the trial cannot continue to a fair conclusion. Address double jeopardy implications under the Fifth Amendment — if a mistrial is declared without manifest necessity and over the defendant's objection, retrial may be barred. Explain why the specific prejudicial incident cannot be cured by any lesser remedy such as a curative instruction, striking testimony, or admonishing the jury. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the mistrial grounds provided.",
  },
  {
    id: "prosecutionAndHearing",
    name: "Prosecution Position & Hearing",
    type: "user-input",
    order: 5,
    inputs: prosecutionPositionInputs,
    required: true,
    helpText: "Indicate the prosecution's position and hearing preference.",
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
    rule: "Ala. R. Crim. P. 21.3",
    standard: "court may declare mistrial when there is a manifest necessity or when ends of justice require it; must show prejudice that cannot be cured by instruction",
    timeLimits: "must be made promptly when grounds become apparent; failure to move promptly may waive issue",
    keyCaseLaw: "Ex parte Thomas, 625 So. 2d 1156 (Ala. 1993)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 31",
    standard: "court may order mistrial when prejudicial conduct or error makes it impossible for defendant to obtain a fair trial",
    timeLimits: "must be raised promptly when grounds become known; continuing without objection may waive",
    keyCaseLaw: "Gafford v. State, 440 P.2d 405 (Alaska 1968)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 22.3",
    standard: "court shall declare mistrial if prejudicial error occurs that injures a party's case and cannot be remedied by curative instruction or other action",
    timeLimits: "must be made when grounds arise; untimely motion may be deemed waived",
    keyCaseLaw: "State v. Dann, 205 Ariz. 557 (2003)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 33.7",
    standard: "court may declare mistrial upon motion when there is a fundamental error so prejudicial that justice cannot be served by continuing; manifest necessity required",
    timeLimits: "must be made promptly when grounds become apparent",
    keyCaseLaw: "Kellensworth v. State, 2011 Ark. 409 (Ark. 2011)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1141; Cal. Const. Art. I, § 16",
    standard: "court may declare mistrial when jury cannot agree or when there is a legal necessity to discharge the jury; manifest necessity standard applies",
    timeLimits: "must be raised promptly at time of prejudicial incident; continuing without objection may waive",
    keyCaseLaw: "People v. Batts, 30 Cal. 4th 660 (2003)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when there is a manifest necessity or when the ends of public justice require it; must be no adequate alternative",
    timeLimits: "must be raised promptly when grounds become apparent",
    keyCaseLaw: "People v. Baca, 193 Colo. 9 (1977)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 42-43",
    standard: "court may declare mistrial if it is required in the interest of justice; prejudice must be so severe that no curative instruction can remedy it",
    timeLimits: "must be raised when grounds become apparent; failure to move may waive",
    keyCaseLaw: "State v. Coney, 266 Conn. 787 (2003)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when manifest necessity requires it or when the ends of justice would otherwise be defeated",
    timeLimits: "must be made promptly when grounds become known",
    keyCaseLaw: "Whalen v. State, 492 A.2d 552 (Del. 1985)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 26.3",
    standard: "court may declare mistrial upon manifest necessity; follows federal standard; must show prejudice beyond cure by less drastic remedies",
    timeLimits: "must be raised promptly when grounds become apparent",
    keyCaseLaw: "Vines v. United States, 70 A.3d 1176 (D.C. 2013)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.600",
    standard: "court may order mistrial when error or irregularity is so prejudicial that continuation would deny defendant a fair trial; manifest necessity standard applies",
    timeLimits: "must be made when grounds arise; failure to make timely motion may result in waiver",
    keyCaseLaw: "Goodwin v. State, 751 So. 2d 537 (Fla. 1999)",
  },
  GA: {
    rule: "O.C.G.A. § 17-8-75",
    standard: "court may declare mistrial when there is a manifest necessity or when defendant shows prejudicial conduct or error making fair trial impossible",
    timeLimits: "must be raised promptly; contemporaneous objection required",
    keyCaseLaw: "Ferguson v. State, 276 Ga. 223 (2003)",
  },
  HI: {
    rule: "Haw. R. Penal P. 29.1",
    standard: "court may declare mistrial when it is manifest that a fair trial cannot be had or that there is no probability of agreement by the jury",
    timeLimits: "must be raised when grounds become apparent; court has continuing authority during trial",
    keyCaseLaw: "State v. Moriwaki, 71 Haw. 347 (1990)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 29.1",
    standard: "court may declare mistrial when there is a manifest necessity or when required to serve the ends of justice; must be no adequate alternative remedy",
    timeLimits: "must be raised promptly when grounds become known",
    keyCaseLaw: "State v. Sharp, 101 Idaho 498 (1980)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/115-4(j)",
    standard: "court may declare mistrial when acts of the prosecution or an event during trial prevents a fair trial; must show manifest necessity",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "People v. Nevitt, 135 Ill. 2d 423 (1990)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 24(b)",
    standard: "court may declare mistrial whenever the defendant is in jeopardy of conviction or a fair trial cannot otherwise be achieved",
    timeLimits: "must be made when grounds become apparent; continuing without objection waives issue",
    keyCaseLaw: "Lucio v. State, 907 N.E.2d 1008 (Ind. 2009)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.19(5)(g)",
    standard: "court may declare mistrial if an error or legal defect in the proceedings makes it impossible to proceed without injustice to the defendant",
    timeLimits: "must be raised promptly when grounds become apparent",
    keyCaseLaw: "State v. Atley, 564 N.W.2d 817 (Iowa 1997)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-3423",
    standard: "court may declare mistrial when prejudicial conduct occurs or when there is no reasonable probability that the jury can agree; manifest necessity standard",
    timeLimits: "must be raised when grounds become apparent; untimely motion may be waived",
    keyCaseLaw: "State v. Warrior, 294 Kan. 484 (2012)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "RCr 9.22",
    standard: "court may grant mistrial when there is a manifest necessity for the discharge of the jury; covers hung jury, juror disqualification, and prejudicial error",
    timeLimits: "must be raised when grounds become apparent; must make contemporaneous objection",
    keyCaseLaw: "Slaven v. Commonwealth, 962 S.W.2d 845 (Ky. 1997)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 775",
    standard: "court may order mistrial when prejudicial conduct or error occurs during trial; must show error resulting in substantial prejudice that deprives defendant of a fair trial",
    timeLimits: "must be raised when grounds become apparent; art. 770 provides mandatory mistrial grounds; art. 771 provides discretionary grounds",
    keyCaseLaw: "State v. Berry, 684 So. 2d 439 (La. 1996)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when manifest necessity requires it; must show prejudice that cannot be cured by instruction or other remedial action",
    timeLimits: "must be raised promptly when grounds become apparent",
    keyCaseLaw: "State v. LaJoie, 596 A.2d 1000 (Me. 1991)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-331(a)",
    standard: "court may declare mistrial if necessary to serve the ends of justice; manifest necessity standard applies; court considers less drastic alternatives first",
    timeLimits: "must be raised when grounds become apparent",
    keyCaseLaw: "Nash v. State, 439 Md. 53 (2014)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 33",
    standard: "court may declare mistrial when there is a manifest necessity or when required to serve the ends of justice; prejudice must be incurable by other means",
    timeLimits: "must be raised promptly when grounds become known; contemporaneous objection required",
    keyCaseLaw: "Commonwealth v. Stokes, 440 Mass. 741 (2004)",
  },
  MI: {
    rule: "MCR 6.431(B)",
    standard: "court may declare mistrial for good cause shown; must demonstrate that manifest necessity requires it or that no curative instruction can remedy the error",
    timeLimits: "must be raised when grounds become apparent; failure to make timely request may waive issue",
    keyCaseLaw: "People v. Dawson, 431 Mich. 234 (1988)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 26.03, subd. 13",
    standard: "court may declare mistrial when error in the proceedings makes it impossible to proceed without prejudice to the defendant; manifest necessity required",
    timeLimits: "must be raised when grounds become apparent; court has continuing authority",
    keyCaseLaw: "State v. Long, 562 N.W.2d 292 (Minn. 1997)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 3.12",
    standard: "court may declare mistrial when there is a manifest necessity; prejudice must be so substantial that a fair trial is impossible",
    timeLimits: "must be raised when grounds become apparent; continuing without objection may waive",
    keyCaseLaw: "Howell v. State, 860 So. 2d 704 (Miss. 2003)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 27.01; Mo. R. Crim. P. 29.12",
    standard: "court may declare mistrial when there is a manifest necessity; must show error so prejudicial that it deprives defendant of a fair trial",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "State v. Edwards, 116 S.W.3d 511 (Mo. 2003)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-16-710",
    standard: "court may declare mistrial when it appears that a fair and impartial trial cannot continue; manifest necessity standard applies",
    timeLimits: "must be raised when grounds become apparent; untimely motion may be waived",
    keyCaseLaw: "State v. Southern, 1999 MT 94 (Mont. 1999)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-2101",
    standard: "court may declare mistrial when manifest necessity requires it; must show error or misconduct so prejudicial that continuation would deny fair trial",
    timeLimits: "must be raised when grounds become apparent; continuing without objection may waive",
    keyCaseLaw: "State v. Thomas, 262 Neb. 985 (2002)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 175.381(2)",
    standard: "court may declare mistrial when the jury cannot agree or when there is legal necessity; manifest necessity standard; prejudice must be incurable",
    timeLimits: "must be raised when grounds become apparent",
    keyCaseLaw: "Rudin v. State, 120 Nev. 121 (2004)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. R. Crim. P. 25(a)",
    standard: "court may declare mistrial when manifest necessity requires it or when required to serve the ends of justice; no adequate lesser remedy available",
    timeLimits: "must be raised promptly when grounds become known",
    keyCaseLaw: "State v. Ayer, 154 N.H. 500 (2006)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:20-1",
    standard: "court may declare mistrial when manifest necessity exists or when ends of justice require it; must show prejudice beyond cure by instruction",
    timeLimits: "must be raised when grounds become apparent; continuing without objection may waive",
    keyCaseLaw: "State v. Winter, 96 N.J. 640 (1984)",
  },
  NM: {
    rule: "NMRA 5-614",
    standard: "court may declare mistrial upon showing of manifest necessity or when defendant demonstrates prejudice that makes fair trial impossible",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "State v. Tafoya, 2010-NMSC-019 (N.M. 2010)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 280.10",
    standard: "court may declare mistrial upon legal defect in the proceedings or upon jury deadlock; must find manifest necessity for ordering new trial",
    timeLimits: "must be raised when grounds become apparent; failure to move may waive issue",
    keyCaseLaw: "People v. Michael, 48 N.Y.2d 1 (1979)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-1061",
    standard: "court may declare mistrial upon motion if there occurs conduct or events prejudicial to the defendant that makes a fair trial impossible",
    timeLimits: "must be raised when grounds become apparent; § 15A-1063 provides additional grounds",
    keyCaseLaw: "State v. Calloway, 305 N.C. 747 (1982)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 24(b)",
    standard: "court may declare mistrial when manifest necessity requires it; must show prejudice that cannot be cured by lesser remedies",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "State v. Bauer, 2007 ND 40 (N.D. 2007)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim.R. 33(A)",
    standard: "court may grant mistrial when irregularity in proceedings prevents fair trial; must show prejudice so material that defendant was deprived of fair trial",
    timeLimits: "must be raised when grounds become apparent; court has continuing discretion during trial",
    keyCaseLaw: "State v. Glover, 35 Ohio St. 3d 18 (1988)",
  },
  OK: {
    rule: "22 O.S. § 812",
    standard: "court may discharge jury and declare mistrial when manifestly necessary; includes prosecutorial misconduct, juror misconduct, and prejudicial error",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "Smallwood v. State, 907 P.2d 217 (Okla. Crim. App. 1995)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 136.010",
    standard: "court may discharge jury and declare mistrial when there is a legal necessity; prejudice must be so great that fair trial is impossible",
    timeLimits: "must be raised when grounds become apparent; court has continuing authority",
    keyCaseLaw: "State v. Montez, 309 Or. 564 (1990)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 605",
    standard: "court may declare mistrial when an event occurs during trial that creates such prejudice that a fair trial cannot continue; manifest necessity standard",
    timeLimits: "must be raised when grounds become apparent; failure to make timely request may waive issue",
    keyCaseLaw: "Commonwealth v. Kelly, 797 A.2d 925 (Pa. Super. 2002)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when manifest necessity exists; must show prejudice beyond what curative instruction can remedy",
    timeLimits: "must be raised when grounds become apparent",
    keyCaseLaw: "State v. Lemon, 497 A.2d 713 (R.I. 1985)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C.R.Crim.P. 24(b)",
    standard: "court may grant mistrial when manifest necessity requires it or when it is necessary to prevent a miscarriage of justice",
    timeLimits: "must be raised when grounds become apparent; contemporaneous objection required",
    keyCaseLaw: "State v. Harris, 382 S.C. 107 (2009)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-25-2",
    standard: "court may declare mistrial when there is a manifest necessity or when required to serve the ends of justice; must exhaust lesser remedies first",
    timeLimits: "must be raised when grounds become apparent",
    keyCaseLaw: "State v. Garritsen, 2001 SD 61 (S.D. 2001)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 26.3",
    standard: "court may declare mistrial when manifest necessity requires it; must show that no lesser remedy can cure the prejudice to the defendant",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "State v. Land, 34 S.W.3d 516 (Tenn. Crim. App. 2000)",
  },
  TX: {
    rule: "Tex. R. App. P. 21.3; Tex. Code Crim. Proc. Art. 36.31",
    standard: "court may declare mistrial when error occurs during trial that is so prejudicial that expenditure of further time and expense would be wasteful and futile",
    timeLimits: "must be raised when grounds become apparent; must make contemporaneous objection to preserve error",
    keyCaseLaw: "Ladd v. State, 3 S.W.3d 547 (Tex. Crim. App. 1999)",
  },
  UT: {
    rule: "Utah R. Crim. P. 18(f)",
    standard: "court may declare mistrial when it appears that a fair trial cannot be had; manifest necessity standard; must exhaust less drastic alternatives",
    timeLimits: "must be raised when grounds become apparent; court has continuing authority during trial",
    keyCaseLaw: "State v. Mead, 2001 UT 58 (Utah 2001)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 26.3",
    standard: "court may declare mistrial when manifest necessity requires it; follows federal standard with state adaptations",
    timeLimits: "must be raised when grounds become apparent; contemporaneous objection required",
    keyCaseLaw: "State v. Brillon, 2010 VT 17 (Vt. 2010)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-243.1",
    standard: "court may declare mistrial when manifest necessity requires it; must show prejudice that cannot be cured by any lesser remedy",
    timeLimits: "must be raised when grounds become apparent; continuing without objection may waive",
    keyCaseLaw: "Currie v. Commonwealth, 30 Va. App. 58 (1999)",
  },
  WA: {
    rule: "CrR 6.15(f)",
    standard: "court may declare mistrial when a circumstance arises during trial which so prejudices the defendant that a fair trial cannot be had",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection or motion",
    keyCaseLaw: "State v. Emery, 174 Wash. 2d 741 (2012)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when manifest necessity requires it; must show prejudice beyond what a curative instruction can remedy",
    timeLimits: "must be raised when grounds become apparent; continuing without objection may waive",
    keyCaseLaw: "State v. Riley, 201 W. Va. 708 (1997)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 972.11; Wis. Stat. § 805.15",
    standard: "court may declare mistrial when there is manifest necessity or when the proceedings cannot continue without injustice to the defendant",
    timeLimits: "must be raised when grounds become apparent; court has continuing discretion during trial",
    keyCaseLaw: "State v. Seefeldt, 292 Wis. 2d 558 (2006)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 24(b)",
    standard: "court may declare mistrial when manifest necessity requires it or when the ends of justice would otherwise be defeated; follows federal standard",
    timeLimits: "must be raised when grounds become apparent; preserved by contemporaneous objection",
    keyCaseLaw: "Miller v. State, 904 P.2d 344 (Wyo. 1995)",
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

Standard for Mistrial: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: The standard for declaring a mistrial requires a showing of manifest necessity — that is, an event or error so prejudicial that a fair trial is no longer possible and no lesser remedy (such as a curative instruction, striking testimony, or admonishing the jury) can adequately cure the prejudice. Courts consider the nature and severity of the prejudicial incident, whether the defense requested a curative instruction, whether such an instruction was given, and whether the prejudice permeated the trial proceedings. Double jeopardy implications must also be considered — if a mistrial is declared over the defendant's objection without manifest necessity, retrial may be barred by the Fifth Amendment.`,
    helpText: "Legal standard for mistrial motions in this jurisdiction.",
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

Federal Rule of Criminal Procedure 26.3 — Mistrial:
Before ordering a mistrial, the court must give each defendant and the government an opportunity to comment on the propriety of the order, to state whether that party consents or objects, and to suggest alternatives.

Arizona v. Washington, 434 U.S. 497 (1978):
The Supreme Court held that a trial court's declaration of a mistrial must be supported by a "manifest necessity" or a "high degree" of necessity. The strictest scrutiny applies when the prosecution requests or benefits from the mistrial. The trial judge's decision is entitled to "great deference" and must consider whether a less drastic remedy could have addressed the problem.

Illinois v. Somerville, 410 U.S. 458 (1973):
The Court held that manifest necessity may exist when a trial cannot continue to a fair conclusion due to a defect in the proceedings. The trial court exercises broad discretion in determining whether manifest necessity exists.

Double Jeopardy — Fifth Amendment:
When a mistrial is declared over the defendant's objection, retrial is barred unless there was manifest necessity for the mistrial. When the defendant requests or consents to the mistrial, retrial is generally permitted unless the prosecution intentionally provoked the mistrial request through misconduct. Oregon v. Kennedy, 456 U.S. 667 (1982).

Key Authorities: Arizona v. Washington, 434 U.S. 497 (1978); Illinois v. Somerville, 410 U.S. 458 (1973); Oregon v. Kennedy, 456 U.S. 667 (1982); United States v. Perez, 22 U.S. (9 Wheat.) 579 (1824).`,
    helpText: "Federal legal standard for mistrial motions.",
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

export const motionForMistrialTemplate: DocumentTemplate = {
  id: "motion-for-mistrial",
  name: "Motion for Mistrial",
  category: "criminal",
  description: "Filed during trial when a prejudicial error occurs making a fair trial impossible. Covers prosecutorial misconduct, juror misconduct, inadmissible evidence exposure, witness testimony violations, or other manifest necessity. Applies the Arizona v. Washington, 434 U.S. 497 (1978) manifest necessity standard and addresses double jeopardy implications.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "15-25 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForMistrialTemplate;
