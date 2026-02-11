/**
 * Motion for Change of Venue Template
 *
 * Criminal law document template for requesting transfer of a criminal case
 * to a different venue due to pretrial publicity, community bias, or other
 * factors preventing the selection of an impartial jury.
 * Filed under Fed. R. Crim. P. 21 or state equivalents.
 * Applies the Sheppard v. Maxwell, 384 U.S. 333 (1966) standard.
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

const venueDetailsInputs: TemplateInput[] = [
  {
    id: "currentVenue",
    label: "Current Venue",
    type: "text",
    placeholder: "e.g., County of Los Angeles, State of California",
    required: true,
    helpText: "The current venue where the case is pending",
  },
  {
    id: "requestedVenue",
    label: "Requested Venue",
    type: "text",
    placeholder: "e.g., County of San Bernardino, State of California",
    required: false,
    helpText: "The venue to which transfer is requested, if specific venue is sought",
  },
  {
    id: "chargesDescription",
    label: "Charges Description",
    type: "textarea",
    placeholder: "Describe the charges pending against the defendant...",
    required: true,
    helpText: "Describe the charges pending against the defendant in this case",
    validation: {
      minLength: 10,
      maxLength: 3000,
    },
  },
  {
    id: "chargeLevel",
    label: "Charge Level",
    type: "select",
    required: true,
    helpText: "The level of the most serious charge",
    validation: {
      options: [
        { value: "capital", label: "Capital Offense" },
        { value: "felony", label: "Felony" },
        { value: "misdemeanor", label: "Misdemeanor" },
      ],
    },
  },
];

const groundsForTransferInputs: TemplateInput[] = [
  {
    id: "primaryBasis",
    label: "Primary Basis for Venue Change",
    type: "select",
    required: true,
    helpText: "Select the primary basis for requesting a change of venue",
    validation: {
      options: [
        { value: "pretrial_publicity", label: "Pretrial Publicity" },
        { value: "community_prejudice", label: "Community Prejudice / Bias" },
        { value: "convenience_of_parties", label: "Convenience of Parties and Witnesses" },
        { value: "inflammatory_nature", label: "Inflammatory Nature of the Crime" },
        { value: "high_profile_case", label: "High-Profile Case / Public Notoriety" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "publicityDescription",
    label: "Description of Pretrial Publicity",
    type: "textarea",
    placeholder: "Describe the nature, extent, and impact of pretrial publicity...",
    required: true,
    helpText: "Provide a detailed description of pretrial publicity including media coverage, social media attention, and community awareness",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "publicityExamples",
    label: "Specific Publicity Examples",
    type: "textarea",
    placeholder: "List specific media articles, broadcasts, social media posts, or other publicity...",
    required: false,
    helpText: "Provide specific examples of pretrial publicity including dates, outlets, headlines, and content",
    validation: {
      maxLength: 5000,
    },
  },
  {
    id: "juryPoolConcerns",
    label: "Jury Pool Concerns",
    type: "textarea",
    placeholder: "Describe concerns about the ability to select an impartial jury from the current venue...",
    required: true,
    helpText: "Explain how pretrial publicity or community bias has tainted the potential jury pool in the current venue",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "priorVoirDireAttempts",
    label: "Prior Voir Dire Attempts",
    type: "select",
    required: true,
    helpText: "Whether any prior attempts at jury selection have been made",
    validation: {
      options: [
        { value: "none", label: "No Prior Voir Dire Attempted" },
        { value: "attempted_insufficient", label: "Voir Dire Attempted — Could Not Seat Impartial Jury" },
        { value: "not_yet_attempted", label: "Not Yet Attempted — Filing Pre-Emptively" },
      ],
    },
  },
  {
    id: "communityImpact",
    label: "Community Impact",
    type: "textarea",
    placeholder: "Describe the impact of the alleged crime on the community and how it affects impartiality...",
    required: false,
    helpText: "Describe how the alleged crime has impacted the community in ways that prevent an impartial jury",
    validation: {
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
    id: "venueDetails",
    name: "Venue Details",
    type: "user-input",
    order: 2,
    inputs: venueDetailsInputs,
    required: true,
    helpText: "Provide details about the current and requested venue.",
  },
  {
    id: "groundsForTransfer",
    name: "Grounds for Transfer",
    type: "user-input",
    order: 3,
    inputs: groundsForTransferInputs,
    required: true,
    helpText: "Describe the grounds for requesting a change of venue.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for change of venue in a criminal case.

Current venue: {{currentVenue}}
Requested venue: {{requestedVenue}}
Charges description: {{chargesDescription}}
Charge level: {{chargeLevel}}
Primary basis for venue change: {{primaryBasis}}
Description of pretrial publicity: {{publicityDescription}}
Specific publicity examples: {{publicityExamples}}
Jury pool concerns: {{juryPoolConcerns}}
Prior voir dire attempts: {{priorVoirDireAttempts}}
Community impact: {{communityImpact}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard for change of venue under Fed. R. Crim. P. 21 or state equivalent
  2. Cite Sheppard v. Maxwell, 384 U.S. 333 (1966) — the court's duty to ensure a fair trial free from outside influences; pervasive pretrial publicity can create a presumption of prejudice
  3. Cite Skilling v. United States, 561 U.S. 358 (2010) — the framework for evaluating whether pretrial publicity requires a venue change, including factors: (a) size and characteristics of the community, (b) content and nature of the publicity, (c) time between publicity and trial, (d) whether the jury indicated bias during voir dire
  4. Cite Rideau v. Louisiana, 373 U.S. 723 (1963) — presumed prejudice doctrine; in extreme cases, pretrial publicity is so pervasive and prejudicial that prejudice is presumed without individual juror inquiry
  5. Apply the facts of the case to the legal standard, showing why a fair and impartial jury cannot be selected in the current venue
  6. Address whether less drastic remedies (expanded voir dire, jury questionnaire, continuance, jury instructions) would be adequate
  7. Conclude that a change of venue is necessary to protect the defendant's Sixth Amendment right to an impartial jury
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion for change of venue. Apply the framework from Sheppard v. Maxwell, 384 U.S. 333 (1966), Skilling v. United States, 561 U.S. 358 (2010), and Rideau v. Louisiana, 373 U.S. 723 (1963). Analyze whether prejudice from pretrial publicity is presumed (Rideau standard) or must be demonstrated through actual prejudice shown during voir dire (Skilling standard). Consider the totality of circumstances including: the size and characteristics of the community, the nature and extent of media coverage, the time elapsed between publicity and trial, the severity and nature of the charges, and whether the defendant is a public figure. Address whether lesser remedies such as extended voir dire, jury questionnaires, continuances, or change of venire (importing jurors from another county) could adequately address the concerns. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the venue change grounds provided.",
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
    rule: "Ala. R. Crim. P. 10.1",
    standard: "defendant must show that a fair and impartial trial cannot be had in the county where the case is pending due to prejudice existing in the public mind",
    timeLimits: "file before trial; court may consider at any time if circumstances warrant",
    keyCaseLaw: "Nelson v. State, 440 So. 2d 1130 (Ala. Crim. App. 1983)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 18(b)",
    standard: "court shall transfer case if there exists so great a prejudice against the defendant that a fair and impartial trial cannot be obtained",
    timeLimits: "file before trial; court retains discretion to consider during trial",
    keyCaseLaw: "Mallott v. State, 608 P.2d 737 (Alaska 1980)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 10.3",
    standard: "court shall transfer if there is reasonable ground to believe defendant cannot receive a fair trial due to undue prejudice existing in the county",
    timeLimits: "file at least 10 days before trial unless good cause shown",
    keyCaseLaw: "State v. Bible, 175 Ariz. 549 (1993)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 28.1",
    standard: "court may grant change of venue if defendant demonstrates that a fair and impartial trial cannot be had due to prejudice in the community",
    timeLimits: "file before trial; court retains discretion to consider at any time",
    keyCaseLaw: "Misskelley v. State, 323 Ark. 449 (1996)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1033",
    standard: "court must grant change of venue if there is a reasonable likelihood that a fair and impartial trial cannot be had in the county; considers totality of circumstances",
    timeLimits: "file before trial; may be renewed during voir dire if cause appears",
    keyCaseLaw: "People v. Proctor, 4 Cal. 4th 499 (1992)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 21(a)",
    standard: "court shall grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county",
    timeLimits: "file before trial; may be raised during voir dire",
    keyCaseLaw: "People v. Harlan, 8 P.3d 448 (Colo. 2000)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 41-23",
    standard: "court may order change of venue if there is reasonable ground to believe a fair trial cannot be had; considers extent of pretrial publicity and community sentiment",
    timeLimits: "file before trial; court retains discretion during trial",
    keyCaseLaw: "State v. Reynolds, 264 Conn. 1 (2003)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 21(a)",
    standard: "court shall transfer proceedings if there exists such prejudice that a fair and impartial trial cannot be obtained; follows federal standard",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "Flonnory v. State, 778 A.2d 1044 (Del. 2001)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 21",
    standard: "court shall transfer if there exists such prejudice that a fair and impartial trial cannot be obtained; follows federal standard",
    timeLimits: "file before trial per local rules",
    keyCaseLaw: "Williams v. United States, 500 A.2d 1012 (D.C. 1985)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.240",
    standard: "court must grant change of venue when a fair and impartial trial cannot be had in the county; defendant must show that pretrial publicity or community prejudice has pervaded the community",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "Rolling v. State, 695 So. 2d 278 (Fla. 1997)",
  },
  GA: {
    rule: "O.C.G.A. § 17-7-150",
    standard: "defendant may move for change of venue on the ground that an impartial jury cannot be obtained in the county; must demonstrate that pretrial publicity or prejudice is so pervasive that a fair trial is impossible",
    timeLimits: "file before trial; court considers at its discretion",
    keyCaseLaw: "Jenkins v. State, 269 Ga. 282 (1998)",
  },
  HI: {
    rule: "Haw. R. Penal P. 21",
    standard: "court shall transfer if there exists such prejudice that a fair and impartial trial cannot be obtained in the county or circuit where prosecution is pending",
    timeLimits: "file before trial; court retains authority during voir dire",
    keyCaseLaw: "State v. Kauhi, 86 Haw. 195 (1997)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 21(a)",
    standard: "court shall grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county",
    timeLimits: "file before trial; court may grant during voir dire for good cause",
    keyCaseLaw: "State v. Hall, 111 Idaho 827 (1986)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/114-6",
    standard: "court shall grant change of venue if defendant shows that the inhabitants of the county are so prejudiced that a fair trial cannot be obtained",
    timeLimits: "file before trial; may be raised during voir dire if sufficient cause appears",
    keyCaseLaw: "People v. Bean, 137 Ill. 2d 65 (1990)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 12",
    standard: "court shall grant change of venue if defendant shows that a fair and impartial trial cannot be had in the county due to prejudice or local conditions",
    timeLimits: "file at least 30 days before trial; court may grant later for good cause",
    keyCaseLaw: "Willoughby v. State, 552 N.E.2d 462 (Ind. 1990)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.11(10)",
    standard: "court may grant change of venue when a fair and impartial trial cannot be had in the county; defendant must show that community prejudice is so pervasive that it prevents selection of impartial jury",
    timeLimits: "file before trial; court retains authority through voir dire",
    keyCaseLaw: "State v. Leutfaimany, 585 N.W.2d 200 (Iowa 1998)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-2616",
    standard: "court shall grant change of venue if a fair trial cannot be had due to prejudice in the county; considers nature and extent of pretrial publicity",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "State v. Carr, 300 Kan. 1 (2014)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "KRS 452.210; RCr 10.42",
    standard: "court shall grant change of venue if defendant shows that a fair trial cannot be had in the county due to prejudice in the community",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "Gall v. Commonwealth, 607 S.W.2d 97 (Ky. 1980)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 622",
    standard: "court shall grant change of venue when defendant shows that due to prejudice in the parish, a fair trial cannot be obtained; considers nature and extent of media coverage",
    timeLimits: "file before trial; must be in writing with supporting facts",
    keyCaseLaw: "State v. David, 425 So. 2d 1241 (La. 1983)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 21(a)",
    standard: "court may grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county",
    timeLimits: "file before trial; court retains authority",
    keyCaseLaw: "State v. Cote, 444 A.2d 34 (Me. 1982)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-254",
    standard: "court may grant change of venue if defendant demonstrates that a fair and impartial trial cannot be had in the county because of the nature and extent of pretrial publicity or community sentiment",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "Oken v. State, 327 Md. 628 (1992)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 37(b)",
    standard: "court may grant change of venue if defendant shows that a fair and impartial trial cannot be had in the county due to community prejudice or pretrial publicity",
    timeLimits: "file before trial; may be renewed at any time before verdict",
    keyCaseLaw: "Commonwealth v. Toolan, 460 Mass. 452 (2011)",
  },
  MI: {
    rule: "MCR 6.222",
    standard: "court may grant change of venue if defendant demonstrates that community prejudice makes it impossible to seat an impartial jury; considers extent of publicity and community impact",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "People v. Jemison, 505 Mich. 352 (2020)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 25.01",
    standard: "court shall grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county; considers all circumstances",
    timeLimits: "file before trial; court retains discretion during trial",
    keyCaseLaw: "State v. Blom, 682 N.W.2d 578 (Minn. 2004)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 7.09",
    standard: "court may grant change of venue if defendant shows that a fair and impartial trial cannot be had in the county; considers pretrial publicity and community sentiment",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "Beckwith v. State, 707 So. 2d 547 (Miss. 1997)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 32.04",
    standard: "court shall grant change of venue if defendant demonstrates that a fair trial cannot be had in the county due to community prejudice from pretrial publicity or other factors",
    timeLimits: "file before trial; court retains authority",
    keyCaseLaw: "State v. Tisius, 362 Mo. 1090 (2003)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-13-203",
    standard: "court may grant change of venue if there is reasonable ground to believe a fair and impartial trial cannot be had in the county where the offense is alleged to have been committed",
    timeLimits: "file before trial; court may grant during voir dire if necessary",
    keyCaseLaw: "State v. McKenzie, 186 Mont. 481 (1980)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-1301",
    standard: "court shall grant change of venue if defendant shows that a fair and impartial trial cannot be had in the county due to the excitement or prejudice prevailing",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "State v. Lotter, 266 Neb. 245 (2003)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 174.455",
    standard: "court shall transfer if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county; considers nature of media coverage and community sentiment",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "Powell v. State, 108 Nev. 700 (1992)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. R. Crim. P. 21",
    standard: "court may grant change of venue if defendant shows that a fair and impartial trial cannot be had in the county due to pretrial publicity or community prejudice",
    timeLimits: "file before trial; court retains authority through voir dire",
    keyCaseLaw: "State v. Smart, 136 N.H. 639 (1993)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:14-2",
    standard: "court may order change of venue when a fair and impartial trial cannot be had in the county; considers amount and type of pretrial publicity and community impact",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "State v. Williams, 93 N.J. 39 (1983)",
  },
  NM: {
    rule: "NMRA 5-304",
    standard: "court shall grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county; considers totality of circumstances",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. House, 1999-NMSC-014 (N.M. 1999)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 230.20",
    standard: "court may grant change of venue when defendant shows that a fair and impartial trial cannot be had in the county due to the nature and extent of pretrial publicity",
    timeLimits: "file before trial; CPL § 230.20(2) allows motion at any time prior to trial",
    keyCaseLaw: "People v. Boss, 261 A.D.2d 1 (N.Y. App. Div. 1999)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-957",
    standard: "court may grant change of venue if defendant shows that there exists so great a prejudice that a fair trial cannot be had; considers pretrial publicity and community impact",
    timeLimits: "file before trial; court retains discretion through voir dire",
    keyCaseLaw: "State v. Jerrett, 309 N.C. 239 (1983)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 21(a)",
    standard: "court shall transfer if there exists such prejudice in the county that a fair trial cannot be obtained; follows federal standard",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. Hernandez, 2003 ND 64 (N.D. 2003)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim.R. 18(B)",
    standard: "court shall grant change of venue if a fair and impartial trial cannot be held in the county; must show that pretrial publicity or community prejudice has pervaded the community",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "State v. Lundgren, 73 Ohio St. 3d 474 (1995)",
  },
  OK: {
    rule: "22 O.S. § 561",
    standard: "court shall grant change of venue if there is so great a prejudice that a fair and impartial trial cannot be had in the county",
    timeLimits: "file before trial; court retains authority",
    keyCaseLaw: "Murphy v. State, 124 P.3d 1198 (Okla. Crim. App. 2005)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 131.355",
    standard: "court may grant change of venue if there is reasonable ground to believe that a fair and impartial trial cannot be had in the county; considers totality of circumstances including publicity",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "State v. Hayward, 327 Or. 397 (1998)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 584",
    standard: "court shall grant change of venue or venire when defendant shows that a fair trial cannot be had in the county due to pretrial publicity or other factors",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "Commonwealth v. Briggs, 12 A.3d 291 (Pa. 2011)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 21(a)",
    standard: "court shall transfer if there exists such prejudice in the county that a fair trial cannot be had; follows federal standard",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. Byrnes, 456 A.2d 742 (R.I. 1983)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. Code § 18-1-40",
    standard: "court may grant change of venue when defendant shows that a fair trial cannot be had in the county due to community prejudice or pretrial publicity",
    timeLimits: "file before trial; court retains continuing authority",
    keyCaseLaw: "State v. Stanko, 402 S.C. 252 (2013)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-20-1",
    standard: "court shall grant change of venue if defendant shows that a fair trial cannot be had in the county due to excitement or prejudice prevailing in the community",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "State v. Moeller, 616 N.W.2d 424 (S.D. 2000)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 21(a)",
    standard: "court shall grant change of venue if there is reasonable ground to believe that a fair trial cannot be had in the county due to undue excitement, prejudice, or other cause",
    timeLimits: "file before trial; court retains discretion during trial",
    keyCaseLaw: "State v. Irick, 762 S.W.2d 121 (Tenn. 1988)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 31.03",
    standard: "court shall grant change of venue if there is so great a prejudice against the defendant that a fair and impartial trial cannot be held; considers nature of media coverage",
    timeLimits: "file before trial; may file verified motion with supporting affidavits",
    keyCaseLaw: "Gonzales v. State, 222 S.W.3d 446 (Tex. Crim. App. 2007)",
  },
  UT: {
    rule: "Utah R. Crim. P. 29(a)",
    standard: "court shall grant change of venue if there is reason to believe that a fair and impartial trial cannot be had in the county; considers pretrial publicity and community sentiment",
    timeLimits: "file before trial; court retains authority through voir dire",
    keyCaseLaw: "State v. Widdison, 2001 UT 60 (Utah 2001)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 21(a)",
    standard: "court may grant change of venue if defendant demonstrates that a fair trial cannot be had in the county due to community prejudice; follows federal standard",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. Prouty, 170 Vt. 155 (1999)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-251",
    standard: "court shall grant change of venue if defendant shows that a fair and impartial trial cannot be had because of the condition of the public mind; considers pretrial publicity",
    timeLimits: "file before trial; court retains continuing authority",
    keyCaseLaw: "Mu'Min v. Virginia, 500 U.S. 415 (1991)",
  },
  WA: {
    rule: "CrR 5.2",
    standard: "court shall transfer if there exists such prejudice that a fair trial cannot be had; considers totality of circumstances including nature and extent of pretrial publicity",
    timeLimits: "file before trial; court may consider during voir dire",
    keyCaseLaw: "State v. Rupe, 101 Wash. 2d 664 (1984)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 21(a)",
    standard: "court shall grant change of venue if there exists such prejudice that a fair trial cannot be had in the county; defendant must show that the community atmosphere is so infected by pretrial publicity that an impartial jury cannot be empaneled",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. Derr, 192 W. Va. 165 (1994)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 971.22",
    standard: "court may grant change of venue if an impartial trial cannot be had in the county; considers pretrial publicity and community sentiment; may also change venue for convenience",
    timeLimits: "file before trial; may be renewed during voir dire",
    keyCaseLaw: "State v. Faucher, 227 Wis. 2d 700 (1999)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 21(a)",
    standard: "court shall grant change of venue if there exists such prejudice that a fair trial cannot be had; follows federal standard with state adaptations",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "Hopkinson v. State, 632 P.2d 79 (Wyo. 1981)",
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

Standard for Change of Venue: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: The standard for change of venue requires the defendant to demonstrate that pretrial publicity, community prejudice, or other factors have made it impossible to select a fair and impartial jury in the current venue. Courts consider the totality of circumstances, including: (1) the nature and extent of media coverage, (2) the size and characteristics of the community, (3) the time elapsed between the publicity and trial, (4) the severity of the charges, (5) whether the case involves a high-profile victim or defendant, and (6) the results of any attempted voir dire. Under Sheppard v. Maxwell, 384 U.S. 333 (1966), courts have an affirmative duty to protect defendants from inherently prejudicial publicity. Under Rideau v. Louisiana, 373 U.S. 723 (1963), prejudice may be presumed when pretrial publicity is sufficiently pervasive and prejudicial.`,
    helpText: "Legal standard for change of venue motions in this jurisdiction.",
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

Federal Rule of Criminal Procedure 21 — Transfer for Trial:
(a) For Prejudice — Upon the defendant's motion, the court must transfer the proceeding against that defendant to another district if the court is satisfied that so great a prejudice against the defendant exists in the transferring district that the defendant cannot obtain a fair and impartial trial there.
(b) For Convenience — Upon the defendant's motion, the court may transfer the proceeding, or one or more counts, against that defendant to another district for the convenience of the parties, any victim, and the witnesses, and in the interest of justice.

Sheppard v. Maxwell, 384 U.S. 333 (1966):
The Supreme Court held that where there is a reasonable likelihood that prejudicial news coverage prevents a fair trial, the judge should transfer the case. The court has an affirmative constitutional obligation to protect the defendant's right to a fair trial from outside influences, including pervasive media coverage.

Skilling v. United States, 561 U.S. 358 (2010):
The Court established the framework for evaluating venue transfer motions based on pretrial publicity: (1) the size and characteristics of the community, (2) the nature of the publicity, (3) the time between the events generating publicity and the trial, and (4) evidence of juror bias at voir dire. Presumed prejudice is rare and requires extreme circumstances.

Rideau v. Louisiana, 373 U.S. 723 (1963):
The Court held that when pretrial publicity is sufficiently pervasive and prejudicial — such as televised confessions or extensive incriminating coverage — prejudice to the defendant is presumed and a venue change is constitutionally required regardless of actual juror statements about impartiality.

Key Authorities: Sheppard v. Maxwell, 384 U.S. 333 (1966); Skilling v. United States, 561 U.S. 358 (2010); Rideau v. Louisiana, 373 U.S. 723 (1963); Irvin v. Dowd, 366 U.S. 717 (1961); Mu'Min v. Virginia, 500 U.S. 415 (1991).`,
    helpText: "Federal legal standard for change of venue motions.",
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

export const motionForChangeOfVenueTemplate: DocumentTemplate = {
  id: "motion-for-change-of-venue",
  name: "Motion for Change of Venue",
  category: "criminal",
  description: "Request to transfer a criminal case to a different venue due to pretrial publicity, community bias, or other factors preventing the selection of an impartial jury. Filed under Fed. R. Crim. P. 21 or state equivalents. Applies the standards from Sheppard v. Maxwell, 384 U.S. 333 (1966), Skilling v. United States, 561 U.S. 358 (2010), and Rideau v. Louisiana, 373 U.S. 723 (1963).",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForChangeOfVenueTemplate;
