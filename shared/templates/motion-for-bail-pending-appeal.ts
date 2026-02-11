/**
 * Motion for Bail Pending Appeal Template
 *
 * Criminal law document template for requesting release on bail while appeal is pending
 * after conviction and sentencing. Filed under 18 U.S.C. § 3143(b) (federal) or state equivalents.
 * Must show substantial question of law or fact likely to result in reversal or new trial.
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

const convictionSentenceInputs: TemplateInput[] = [
  {
    id: "convictionDate",
    label: "Date of Conviction",
    type: "date",
    required: true,
    helpText: "The date the defendant was convicted (verdict or guilty plea)",
  },
  {
    id: "convictionCharges",
    label: "Charges of Conviction",
    type: "textarea",
    placeholder: "List all charges for which defendant was convicted...",
    required: true,
    helpText: "Describe all charges and counts for which the defendant was convicted",
    validation: {
      minLength: 10,
      maxLength: 3000,
    },
  },
  {
    id: "sentenceImposed",
    label: "Sentence Imposed",
    type: "textarea",
    placeholder: "Describe the sentence imposed (incarceration, probation, fines, etc.)...",
    required: true,
    helpText: "Describe the full sentence imposed including term of imprisonment, probation, fines, and conditions",
    validation: {
      minLength: 10,
      maxLength: 3000,
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
    helpText: "The defendant's current custody status",
    validation: {
      options: [
        { value: "incarcerated", label: "Currently Incarcerated" },
        { value: "released_pending_sentencing", label: "Released Pending Sentencing" },
        { value: "other", label: "Other" },
      ],
    },
  },
  {
    id: "custodyFacility",
    label: "Custody Facility",
    type: "text",
    placeholder: "Name and location of detention facility (if incarcerated)",
    required: false,
    helpText: "The name and location of the facility where the defendant is held, if applicable",
  },
];

const appealDetailsInputs: TemplateInput[] = [
  {
    id: "noticeOfAppealFiled",
    label: "Notice of Appeal Status",
    type: "select",
    required: true,
    helpText: "Whether a notice of appeal has been filed",
    validation: {
      options: [
        { value: "yes", label: "Yes — Notice of Appeal Filed" },
        { value: "no", label: "No — Not Yet Filed" },
        { value: "planned", label: "Planned — Will Be Filed" },
      ],
    },
  },
  {
    id: "appealFilingDate",
    label: "Appeal Filing Date",
    type: "date",
    required: false,
    helpText: "The date the notice of appeal was filed, if applicable",
  },
  {
    id: "appellateIssues",
    label: "Issues to Be Raised on Appeal",
    type: "textarea",
    placeholder: "Describe the legal issues to be raised on appeal...",
    required: true,
    helpText: "Describe in detail the issues of law or fact that will be raised on appeal",
    validation: {
      minLength: 20,
      maxLength: 5000,
    },
  },
  {
    id: "likelihoodOfSuccess",
    label: "Why Appeal Raises Substantial Question",
    type: "textarea",
    placeholder: "Explain why the appeal raises a substantial question of law or fact likely to result in reversal or new trial...",
    required: true,
    helpText: "Explain why the appellate issues raise substantial questions likely to result in reversal, a new trial, or a sentence with no imprisonment",
    validation: {
      minLength: 20,
      maxLength: 5000,
    },
  },
];

const communityTiesRiskInputs: TemplateInput[] = [
  {
    id: "flightRisk",
    label: "Flight Risk Assessment",
    type: "select",
    required: true,
    helpText: "Assess the defendant's risk of flight",
    validation: {
      options: [
        { value: "minimal", label: "Minimal Risk" },
        { value: "low", label: "Low Risk" },
        { value: "moderate", label: "Moderate Risk" },
      ],
    },
  },
  {
    id: "flightRiskExplanation",
    label: "Flight Risk Explanation",
    type: "textarea",
    placeholder: "Explain why defendant is not a flight risk...",
    required: true,
    helpText: "Provide facts supporting why the defendant is not a flight risk",
    validation: {
      minLength: 20,
      maxLength: 3000,
    },
  },
  {
    id: "communityTies",
    label: "Community Ties",
    type: "textarea",
    placeholder: "Describe defendant's ties to the community (family, employment, residence, etc.)...",
    required: true,
    helpText: "Describe the defendant's connections to the community including family, employment, length of residence, and community involvement",
    validation: {
      minLength: 20,
      maxLength: 3000,
    },
  },
  {
    id: "priorCourtAppearances",
    label: "Prior Court Appearance Record",
    type: "textarea",
    placeholder: "Describe defendant's history of compliance with court appearances (optional)...",
    required: false,
    helpText: "Describe the defendant's record of appearing for court dates and complying with court orders",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "dangerToCommunity",
    label: "Danger to Community",
    type: "select",
    required: true,
    helpText: "Assess whether the defendant poses a danger to the community",
    validation: {
      options: [
        { value: "no_risk", label: "No Risk to Community Safety" },
        { value: "minimal_risk", label: "Minimal Risk to Community Safety" },
      ],
    },
  },
  {
    id: "proposedConditions",
    label: "Proposed Bail Conditions",
    type: "textarea",
    placeholder: "Describe proposed conditions of bail (e.g., electronic monitoring, travel restrictions, surrender of passport)...",
    required: true,
    helpText: "Describe the specific conditions of release proposed to ensure appearance and community safety",
    validation: {
      minLength: 10,
      maxLength: 3000,
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
    id: "convictionSentence",
    name: "Conviction & Sentence Details",
    type: "user-input",
    order: 2,
    inputs: convictionSentenceInputs,
    required: true,
    helpText: "Provide details about the conviction and sentence.",
  },
  {
    id: "appealDetails",
    name: "Appeal Details",
    type: "user-input",
    order: 3,
    inputs: appealDetailsInputs,
    required: true,
    helpText: "Provide details about the appeal and issues to be raised.",
  },
  {
    id: "communityTiesRisk",
    name: "Community Ties & Risk",
    type: "user-input",
    order: 4,
    inputs: communityTiesRiskInputs,
    required: true,
    helpText: "Provide information about community ties, flight risk, and proposed conditions.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for bail pending appeal in a criminal case.

Conviction date: {{convictionDate}}
Charges of conviction: {{convictionCharges}}
Sentence imposed: {{sentenceImposed}}
Sentencing date: {{sentenceDate}}
Current custody status: {{currentCustodyStatus}}
Custody facility: {{custodyFacility}}
Notice of appeal filed: {{noticeOfAppealFiled}}
Appeal filing date: {{appealFilingDate}}
Appellate issues: {{appellateIssues}}
Why appeal raises substantial question: {{likelihoodOfSuccess}}
Flight risk: {{flightRisk}}
Flight risk explanation: {{flightRiskExplanation}}
Community ties: {{communityTies}}
Prior court appearances: {{priorCourtAppearances}}
Danger to community: {{dangerToCommunity}}
Proposed bail conditions: {{proposedConditions}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard for bail pending appeal (18 U.S.C. § 3143(b) / state equivalent)
  2. Cite Hilton v. Braunskill, 481 U.S. 770 (1987) — the four-factor test for stays and bail pending appeal
  3. Discuss the four factors: (a) whether the appeal raises a substantial question of law or fact, (b) whether the motion is for purposes of delay, (c) whether the defendant poses a danger to the community, (d) whether the defendant is a flight risk
  4. Argue that the appellate issues raise substantial questions likely to result in reversal or new trial
  5. Demonstrate that the defendant is not a flight risk and does not pose a danger to the community
  6. Describe the proposed conditions of release that would adequately secure appearance and community safety
  7. Argue that the appeal is not brought for purposes of delay
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion for bail pending appeal. Cite 18 U.S.C. § 3143(b) for the federal standard requiring release pending appeal if the appeal raises a substantial question of law or fact likely to result in reversal, new trial, or a sentence with no imprisonment. Cite Hilton v. Braunskill, 481 U.S. 770 (1987) for the four-factor test for stays pending appeal. Apply each factor to the specific facts: (1) substantial question of law or fact, (2) not for delay, (3) not a danger to community, (4) not a flight risk. Address the defendant's community ties and proposed conditions of release. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the conviction, appeal, and risk details provided.",
  },
  {
    id: "prosecutionAndHearing",
    name: "Prosecution Position & Hearing",
    type: "user-input",
    order: 6,
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
    rule: "Ala. R. App. P. 9(b); Ala. Code § 15-13-3",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers nature of offense, sentence, and likelihood of flight",
    timeLimits: "motion filed after sentencing and filing of notice of appeal",
    keyCaseLaw: "Ex parte Jones, 587 So. 2d 1004 (Ala. 1991)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. App. P. 206(a); AS 12.30.040",
    standard: "court may release defendant pending appeal if appeal raises substantial question of law or fact; defendant must show not a flight risk or danger",
    timeLimits: "motion filed after conviction and sentencing; decided by trial court initially",
    keyCaseLaw: "Pease v. State, 54 P.3d 316 (Alaska App. 2002)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 7.5(a)",
    standard: "defendant convicted of non-capital offense may be released pending appeal if court finds appeal raises substantial question and defendant is not a flight risk or danger",
    timeLimits: "motion filed after sentencing; court must rule promptly",
    keyCaseLaw: "State v. Chapple, 135 Ariz. 281 (1983)",
  },
  AR: {
    rule: "Ark. R. App. P.–Crim. 7",
    standard: "bail pending appeal may be granted if defendant demonstrates substantial question on appeal; court considers likelihood of flight and danger to community",
    timeLimits: "motion filed after sentencing and notice of appeal",
    keyCaseLaw: "Henderson v. State, 349 Ark. 701 (2002)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1272(3); Cal. R. Ct. 8.312",
    standard: "bail pending appeal may be granted unless appeal is frivolous or taken solely for delay; court considers seriousness of offense, criminal history, and probability of flight",
    timeLimits: "motion filed in superior court after sentencing; may also be filed in Court of Appeal",
    keyCaseLaw: "In re Podesto, 15 Cal. 3d 921 (1976)",
  },
  CO: {
    rule: "C.R.S. § 16-4-201(4); Colo. App. R. 8.1",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question likely to result in reversal; must show not a flight risk or danger",
    timeLimits: "motion filed after sentencing; trial court rules initially",
    keyCaseLaw: "People v. Alley, 232 P.3d 98 (Colo. 2010)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Gen. Stat. § 54-95(a); Conn. Practice Book § 63-4",
    standard: "court may admit to bail pending appeal unless offense punishable by life imprisonment; considers whether appeal raises substantial question",
    timeLimits: "motion filed after sentencing and filing of appeal",
    keyCaseLaw: "State v. Ayala, 222 Conn. 331 (1992)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 46(c)",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk, danger, and nature of offense",
    timeLimits: "motion filed after sentencing; decided by trial court",
    keyCaseLaw: "State v. Spence, 367 A.2d 983 (Del. 1976)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Code § 23-1325(c)",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law or fact; defendant must show not a flight risk or danger to community",
    timeLimits: "motion filed after sentencing and notice of appeal",
    keyCaseLaw: "United States v. Perholtz, 842 F.2d 343 (D.C. Cir. 1988)",
  },
  FL: {
    rule: "Fla. R. App. P. 9.140(g); Fla. R. Crim. P. 3.691",
    standard: "bail pending appeal is discretionary; court considers nature of offense, length of sentence, defendant's character, probability of flight, and merits of appeal",
    timeLimits: "motion filed in trial court within 30 days after rendition of sentence",
    keyCaseLaw: "Younghans v. State, 90 So. 2d 308 (Fla. 1956)",
  },
  GA: {
    rule: "O.C.G.A. § 17-6-1(g)",
    standard: "bail pending appeal may be granted at discretion of trial court; court considers severity of offense, likelihood of appeal success, and danger to community",
    timeLimits: "motion filed after sentencing and filing of notice of appeal",
    keyCaseLaw: "Birge v. State, 238 Ga. 88 (1976)",
  },
  HI: {
    rule: "HRS § 804-4; Haw. R. Penal P. 46(c)",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk and danger to community",
    timeLimits: "motion filed after conviction and sentencing",
    keyCaseLaw: "State v. Oughterson, 36 Haw. 182 (1942)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 46(e); I.C. § 19-2908",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law; court considers flight risk, danger, and nature of conviction",
    timeLimits: "motion filed after sentencing; trial court rules initially",
    keyCaseLaw: "State v. Pieri, 96 Idaho 124 (1974)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/110-10(b); Ill. S. Ct. R. 604(c)",
    standard: "bail pending appeal may be granted if defendant shows appeal raises meritorious issue; court considers risk of flight, danger, and nature of offense",
    timeLimits: "motion filed after sentencing; trial court or reviewing court may grant",
    keyCaseLaw: "People v. Simmons, 108 Ill. App. 3d 1013 (1982)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 14; IC 35-33-9-7",
    standard: "bail pending appeal may be granted if defendant demonstrates appeal raises substantial question; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing and notice of appeal",
    keyCaseLaw: "Sneed v. State, 271 Ind. 608 (1979)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.36; Iowa R. App. P. 6.701",
    standard: "bail pending appeal may be granted if defendant shows appeal is not frivolous and raises substantial question; considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court rules initially",
    keyCaseLaw: "State v. Hildreth, 582 N.W.2d 167 (Iowa 1998)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-2804(4)",
    standard: "bail pending appeal is discretionary; court considers nature of offense, probability that appeal raises substantial question, flight risk, and danger",
    timeLimits: "motion filed after sentencing and notice of appeal",
    keyCaseLaw: "State v. Wilkins, 269 Kan. 256 (2000)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "KRS 431.550; RCr 12.78",
    standard: "bail pending appeal may be granted unless conviction is for offense punishable by death or life imprisonment; court considers merits of appeal and risk factors",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "Colbert v. Commonwealth, 306 S.W.3d 19 (Ky. 2010)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 331",
    standard: "bail pending appeal may be granted at court's discretion; court considers nature of offense, sentence, probability of success on appeal, and danger to community",
    timeLimits: "motion filed after sentencing; trial court rules initially",
    keyCaseLaw: "State v. Messa, 2005-0631 (La. App. 1 Cir. 2005); 927 So. 2d 1168",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 46(c); 15 M.R.S. § 1051",
    standard: "bail pending appeal may be granted if court finds appeal raises substantial question; considers flight risk and danger to community",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Mottram, 184 A.2d 225 (Me. 1962)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-349",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question of law or fact; court considers flight risk, danger, and nature of offense",
    timeLimits: "motion filed within 10 days of sentencing; hearing within 5 days of motion",
    keyCaseLaw: "Midgett v. State, 216 Md. App. 45 (2014)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 31(a); G.L. c. 276, § 58A",
    standard: "bail pending appeal may be granted if defendant demonstrates appeal raises substantial question; court considers risk of flight and danger",
    timeLimits: "motion filed after sentencing; single justice of appellate court may decide",
    keyCaseLaw: "Commonwealth v. Hodge, 380 Mass. 851 (1980)",
  },
  MI: {
    rule: "MCR 6.509(A); MCL 770.9a",
    standard: "bail pending appeal may be granted if defendant shows substantial question on appeal; court considers conviction, sentence, flight risk, and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "People v. Sands, 261 Mich. App. 158 (2004)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 28.02, subd. 5",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; considers flight risk, danger, and likelihood of success",
    timeLimits: "motion filed after sentencing; trial court or appellate court may decide",
    keyCaseLaw: "State v. Otterstad, 443 N.W.2d 220 (Minn. App. 1989)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. Code Ann. § 99-35-115",
    standard: "bail pending appeal is discretionary; court considers nature of offense, probable merit of appeal, flight risk, and danger to community",
    timeLimits: "motion filed after sentencing; trial court decides initially",
    keyCaseLaw: "State v. Johnson, 461 So. 2d 1288 (Miss. 1984)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 33.01; Mo. R. App. P. 30.11",
    standard: "bail pending appeal may be granted if defendant shows appeal is not frivolous; court considers flight risk, danger, and nature of conviction",
    timeLimits: "motion filed after sentencing; trial court rules",
    keyCaseLaw: "State v. Strong, 142 S.W.3d 702 (Mo. 2004)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-9-108",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law or fact; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Haagenson, 2004 MT 142 (Mont. 2004)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-901.01",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers flight risk, danger, and nature of offense",
    timeLimits: "motion filed after sentencing and filing of appeal",
    keyCaseLaw: "State v. Long, 292 Neb. 635 (2016)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 178.488",
    standard: "bail pending appeal may be granted unless offense is punishable by life imprisonment; court considers probability of appeal success, flight risk, and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "Colwell v. State, 118 Nev. 807 (2002)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. Rev. Stat. § 597:1-a(IV)",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law; court considers flight risk and danger to community",
    timeLimits: "motion filed after sentencing; decided by trial court",
    keyCaseLaw: "State v. Kelley, 159 N.H. 449 (2009)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 2:9-4",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers flight risk, danger, and nature of conviction",
    timeLimits: "motion filed after sentencing; trial court or appellate court may decide",
    keyCaseLaw: "State v. Ortiz, 100 N.J. Super. 113 (App. Div. 1968)",
  },
  NM: {
    rule: "NMSA § 31-11-1; NMRA 5-405",
    standard: "bail pending appeal may be granted if court finds appeal raises substantial question; considers flight risk and danger to community",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Rivera, 2003-NMCA-059 (N.M. App. 2003)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 460.50; CPL § 530.50",
    standard: "bail pending appeal may be granted if court finds reasonable cause to believe judgment may be reversed or modified; considers risk of flight",
    timeLimits: "application made to trial court or intermediate appellate court after sentencing",
    keyCaseLaw: "People ex rel. Rosenthal v. Wolfson, 48 N.Y.2d 230 (1979)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-536",
    standard: "bail pending appeal may be granted in non-capital cases; court considers whether there are conditions that will reasonably assure appearance and safety",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Thompson, 349 N.C. 483 (1998)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 46(c); NDCC § 29-08-24",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk, danger, and nature of offense",
    timeLimits: "motion filed after sentencing and notice of appeal",
    keyCaseLaw: "State v. Dahl, 2011 ND 192 (N.D. 2011)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio R. App. P. 8(A); ORC § 2949.02",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk, danger, and likelihood of success on appeal",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Christman, 2006-Ohio-6090 (Ohio App. 2006)",
  },
  OK: {
    rule: "22 O.S. § 1075",
    standard: "bail pending appeal is discretionary; court considers nature of offense, merits of appeal, flight risk, and community danger",
    timeLimits: "motion filed after sentencing; trial court or appellate court decides",
    keyCaseLaw: "Parks v. State, 651 P.2d 686 (Okla. Crim. App. 1982)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 135.286; ORS 138.075",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides initially",
    keyCaseLaw: "State v. Delong, 72 Or. App. 627 (1985)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 521(B); Pa.R.App.P. 1762",
    standard: "bail pending appeal may be granted if defendant demonstrates substantial question on appeal; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court or Superior Court may decide",
    keyCaseLaw: "Commonwealth v. Holtzapfel, 895 A.2d 1284 (Pa. Super. 2006)",
  },
  RI: {
    rule: "R.I. Gen. Laws § 12-13-5.1",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk, danger, and nature of offense",
    timeLimits: "motion filed after sentencing; trial court or Supreme Court decides",
    keyCaseLaw: "State v. Feng, 421 A.2d 1258 (R.I. 1980)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. Code Ann. § 17-27-60; SCACR Rule 228",
    standard: "bail pending appeal is discretionary; court considers merits of appeal, flight risk, danger, and nature of conviction",
    timeLimits: "motion filed after sentencing; trial court decides initially",
    keyCaseLaw: "State v. Bray, 342 S.C. 23 (2000)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-44-5.1",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question of law or fact; considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Anderson, 2005 S.D. 22 (S.D. 2005)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. App. P. 8(a); TCA § 40-26-101",
    standard: "bail pending appeal may be granted if appeal raises substantial question; court considers flight risk, danger, nature of offense, and sentence",
    timeLimits: "motion filed after sentencing; trial court rules initially",
    keyCaseLaw: "State v. Burchfield, 664 S.W.2d 284 (Tenn. 1984)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 44.04(b)",
    standard: "bail pending appeal denied if sentence exceeds 10 years imprisonment; otherwise discretionary based on good cause shown; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "Ex parte Anderer, 61 S.W.3d 398 (Tex. Crim. App. 2001)",
  },
  UT: {
    rule: "Utah R. Crim. P. 27(b); Utah Code § 77-20-10",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Lutes, 2008 UT App 192 (Utah App. 2008)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 46(c); 13 V.S.A. § 7575",
    standard: "bail pending appeal may be granted if court finds appeal raises substantial question of law; considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "State v. Allen, 2007 VT 30 (Vt. 2007)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-319; Va. Sup. Ct. R. 5A:17",
    standard: "bail pending appeal may be granted if defendant demonstrates appeal raises substantial question; court considers flight risk, danger, and sentence",
    timeLimits: "motion filed after sentencing; trial court decides initially",
    keyCaseLaw: "Hazel v. Commonwealth, 51 Va. App. 469 (2008)",
  },
  WA: {
    rule: "CrR 3.2(i); RCW 10.73.040",
    standard: "bail pending appeal may be granted if defendant shows appeal raises debatable issue; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court or appellate court decides",
    keyCaseLaw: "State v. Barton, 181 Wash. 2d 148 (2014)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 46(c); W. Va. Code § 62-1C-1a",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law; court considers flight risk and danger to community",
    timeLimits: "motion filed after sentencing; circuit court decides",
    keyCaseLaw: "State v. Derr, 192 W. Va. 165 (1994)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 969.01(4); § 809.31",
    standard: "bail pending appeal may be granted if defendant shows appeal raises substantial question; court considers flight risk, danger, and nature of conviction",
    timeLimits: "motion filed after sentencing; trial court or Court of Appeals decides",
    keyCaseLaw: "State v. Gudenschwager, 191 Wis. 2d 431 (1995)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 46(c); W.S. § 7-10-101",
    standard: "bail pending appeal may be granted if appeal raises substantial question of law or fact; court considers flight risk and danger",
    timeLimits: "motion filed after sentencing; trial court decides",
    keyCaseLaw: "Babbitt v. State, 2009 WY 128 (Wyo. 2009)",
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

Standard for Bail Pending Appeal: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: Bail pending appeal requires the defendant to demonstrate that the appeal raises a substantial question of law or fact likely to result in reversal, a new trial, or a sentence that does not include imprisonment. Courts weigh multiple factors including: (1) whether the appeal raises a substantial question, (2) whether the defendant poses a flight risk, (3) whether the defendant poses a danger to the community, and (4) whether the appeal is taken for purposes of delay. The burden is on the defendant to demonstrate entitlement to bail pending appeal.`,
    helpText: "Legal standard for bail pending appeal in this jurisdiction.",
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

18 U.S.C. § 3143(b) — Release or Detention Pending Appeal:
(1) The judicial officer shall order that a person who has been found guilty of an offense and sentenced to a term of imprisonment, and who has filed an appeal, be detained, unless the judicial officer finds—
(A) by clear and convincing evidence that the person is not likely to flee or pose a danger to the safety of any other person or the community if released; and
(B) that the appeal is not for the purpose of delay and raises a substantial question of law or fact likely to result in—
  (i) reversal, (ii) an order for a new trial, (iii) a sentence that does not include a term of imprisonment, or (iv) a reduced sentence to a term of imprisonment less than the total of the time already served plus the expected duration of the appeal process.

Hilton v. Braunskill, 481 U.S. 770 (1987):
The Supreme Court established the four-factor test for evaluating stays and bail pending appeal: (1) whether the stay applicant has made a strong showing that he is likely to succeed on the merits; (2) whether the applicant will be irreparably injured absent a stay; (3) whether issuance of the stay will substantially injure the other parties interested in the proceeding; and (4) where the public interest lies.

United States v. Miller, 753 F.2d 19 (3d Cir. 1985):
A "substantial question" is one that is "fairly debatable" or "fairly doubtful" — a question that is close or could very well be decided the other way. The defendant need not show that the appeal will likely succeed, only that the issue is substantial enough that it could be decided differently.

Key Authorities: 18 U.S.C. § 3143(b); Hilton v. Braunskill, 481 U.S. 770 (1987); United States v. Miller, 753 F.2d 19 (3d Cir. 1985); United States v. Handy, 761 F.2d 1279 (9th Cir. 1985).`,
    helpText: "Federal legal standard for bail pending appeal.",
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
      helpText: "Enter court and case information for the motion caption.",
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
    courtSpecificRules: `${district}: 12pt font. ${circuit} Circuit. CM/ECF required.`,
  });
}

export const motionForBailPendingAppealTemplate: DocumentTemplate = {
  id: "motion-for-bail-pending-appeal",
  name: "Motion for Bail Pending Appeal",
  category: "criminal",
  description: "Motion requesting release on bail while appeal is pending after conviction and sentencing. Filed under 18 U.S.C. § 3143(b) (federal) or state equivalents. Must show substantial question of law or fact likely to result in reversal or new trial. Addresses the four-factor test: substantial question, not for delay, not a danger, not a flight risk.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForBailPendingAppealTemplate;
