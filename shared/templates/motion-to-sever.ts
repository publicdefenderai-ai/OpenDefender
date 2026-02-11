/**
 * Motion to Sever Defendants / Charges Template
 *
 * Criminal law document template for requesting separate trials for co-defendants or separate charges.
 * Filed under Federal Rule of Criminal Procedure 14 or state equivalents.
 * Addresses situations where joinder of defendants or charges creates unfair prejudice,
 * antagonistic defenses, Bruton issues, or spillover effect.
 * Critical in multi-defendant cases where one co-defendant's evidence or statements
 * would be inadmissible against another.
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

const severanceDetailsInputs: TemplateInput[] = [
  {
    id: "severanceType",
    label: "Type of Severance Requested",
    type: "select",
    required: true,
    helpText: "Select whether you are seeking to sever co-defendants, charges, or both",
    validation: {
      options: [
        { value: "defendants", label: "Sever Co-Defendants (Separate Trials)" },
        { value: "charges", label: "Sever Charges/Counts (Separate Trials)" },
        { value: "both", label: "Sever Both Defendants and Charges" },
      ],
    },
  },
  {
    id: "numberOfCodefendants",
    label: "Number of Co-Defendants",
    type: "select",
    required: true,
    helpText: "Select the number of co-defendants in this case (relevant for defendant severance)",
    validation: {
      options: [
        { value: "1", label: "1 Co-Defendant" },
        { value: "2", label: "2 Co-Defendants" },
        { value: "3", label: "3 Co-Defendants" },
        { value: "4_plus", label: "4 or More Co-Defendants" },
      ],
    },
  },
  {
    id: "codefendantNames",
    label: "Co-Defendant Names and Roles",
    type: "textarea",
    placeholder: "List the names and roles of each co-defendant...",
    required: false,
    helpText: "Names and roles of co-defendants in the case",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "chargesDescription",
    label: "All Charges/Counts Currently Joined",
    type: "textarea",
    placeholder: "List all charges or counts currently joined in this case...",
    required: true,
    helpText: "Describe all charges or counts that are currently joined in this case",
    validation: {
      minLength: 10,
      maxLength: 3000,
    },
  },
  {
    id: "chargesToSever",
    label: "Specific Charges or Defendants to Sever",
    type: "textarea",
    placeholder: "Identify the specific charges, counts, or defendants you seek to sever...",
    required: true,
    helpText: "Identify which specific charges or defendants should be severed for separate trial",
    validation: {
      minLength: 10,
      maxLength: 3000,
    },
  },
  {
    id: "trialDate",
    label: "Scheduled Trial Date",
    type: "date",
    required: false,
    helpText: "The currently scheduled trial date, if set",
  },
];

const prejudiceGroundsInputs: TemplateInput[] = [
  {
    id: "primaryGround",
    label: "Primary Ground for Severance",
    type: "select",
    required: true,
    helpText: "Select the primary legal ground for seeking severance",
    validation: {
      options: [
        { value: "antagonistic_defenses", label: "Antagonistic / Mutually Exclusive Defenses" },
        { value: "bruton_issue", label: "Bruton Issue (Co-Defendant's Confession)" },
        { value: "spillover_prejudice", label: "Spillover Prejudice / Guilt by Association" },
        { value: "complex_evidence", label: "Jury Confusion from Complex Multi-Defendant Evidence" },
        { value: "disparity_evidence", label: "Disparity in Evidence Strength Between Defendants/Counts" },
        { value: "different_charges", label: "Dissimilar Charges Creating Unfair Prejudice" },
        { value: "judicial_economy", label: "Judicial Economy Favors Separate Trials" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "groundsDescription",
    label: "Detailed Factual Basis for Severance",
    type: "textarea",
    placeholder: "Provide a detailed factual description of the grounds supporting severance...",
    required: true,
    helpText: "Explain in detail the factual basis for requesting severance, including specific facts showing prejudice from joinder",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "additionalGrounds",
    label: "Additional / Secondary Grounds",
    type: "textarea",
    placeholder: "Describe any additional grounds for severance (optional)...",
    required: false,
    helpText: "If there are additional grounds for severance beyond the primary ground",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "prejudiceExplanation",
    label: "How Joinder Prejudices the Defendant",
    type: "textarea",
    placeholder: "Explain how joinder of defendants or charges prejudices the defendant...",
    required: true,
    helpText: "Describe specifically how the joinder prejudices the defendant's right to a fair trial",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "curingInstructions",
    label: "Adequacy of Limiting Instructions",
    type: "select",
    required: true,
    helpText: "Whether limiting instructions to the jury would adequately cure any prejudice from joinder",
    validation: {
      options: [
        { value: "inadequate", label: "Limiting Instructions Would Be Inadequate" },
        { value: "partially_effective", label: "Limiting Instructions Only Partially Effective" },
        { value: "not_applicable", label: "No Limiting Instructions Could Cure Prejudice" },
      ],
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
    id: "severanceDetails",
    name: "Severance Details",
    type: "user-input",
    order: 2,
    inputs: severanceDetailsInputs,
    required: true,
    helpText: "Provide details about the severance requested.",
  },
  {
    id: "prejudiceGrounds",
    name: "Prejudice & Grounds",
    type: "user-input",
    order: 3,
    inputs: prejudiceGroundsInputs,
    required: true,
    helpText: "Describe the prejudice and legal grounds for severance.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion to sever defendants and/or charges.

Severance type: {{severanceType}}
Number of co-defendants: {{numberOfCodefendants}}
Co-defendant names and roles: {{codefendantNames}}
All charges currently joined: {{chargesDescription}}
Charges/defendants to sever: {{chargesToSever}}
Scheduled trial date: {{trialDate}}
Primary ground for severance: {{primaryGround}}
Detailed factual basis: {{groundsDescription}}
Additional grounds: {{additionalGrounds}}
Prejudice explanation: {{prejudiceExplanation}}
Adequacy of limiting instructions: {{curingInstructions}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard for severance (Fed. R. Crim. P. 14 / state equivalent)
  2. Explain the presumption of joinder under Fed. R. Crim. P. 8 and when severance overcomes it
  3. For antagonistic defenses: cite Zafiro v. United States, 506 U.S. 534 (1993) — severance required when defenses are truly irreconcilable and jury will be forced to acquit one or convict the other
  4. For Bruton issues: cite Bruton v. United States, 391 U.S. 123 (1968) — co-defendant's confession implicating defendant violates Confrontation Clause
  5. For charge severance: address whether charges are of same or similar character, or arise from common plan
  6. Address whether limiting instructions would be adequate to cure prejudice
  7. Argue that the defendant would be prejudiced by a joint trial
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion to sever defendants and/or charges. Apply the appropriate standard based on the ground selected. For antagonistic defenses, cite Zafiro v. United States, 506 U.S. 534 (1993) and explain when defenses are truly irreconcilable. For Bruton issues, cite Bruton v. United States, 391 U.S. 123 (1968) and explain how a co-defendant's confession implicating the defendant violates the Confrontation Clause when the co-defendant does not testify. For spillover prejudice, address the risk that the jury will consider evidence against one defendant or on one charge when evaluating another. For charge severance, address proper joinder under Rule 8 and when severance under Rule 14 is warranted. Address whether limiting instructions would adequately cure any prejudice. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the grounds and details provided.",
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
    rule: "Ala. R. Crim. P. 13.4",
    standard: "court may grant severance if defendant or prosecution is prejudiced by joinder; defendant must show clear prejudice",
    timeLimits: "file before trial or at earliest practicable time",
    keyCaseLaw: "Holladay v. State, 549 So. 2d 122 (Ala. Crim. App. 1989)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 14",
    standard: "court may order severance if joinder appears to prejudice a defendant or the government; defendant must show compelling prejudice",
    timeLimits: "file pretrial; may be renewed during trial",
    keyCaseLaw: "Tookak v. State, 648 P.2d 1018 (Alaska App. 1982)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 13.4",
    standard: "court shall grant severance if necessary to promote a fair determination of guilt or innocence",
    timeLimits: "at least 20 days before trial; court may grant later for good cause",
    keyCaseLaw: "State v. Murray, 184 Ariz. 9 (1995)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 22.3",
    standard: "court may grant severance if joinder is prejudicial; defendant must demonstrate actual prejudice, not mere possibility",
    timeLimits: "file before trial; renewed motion preserved for appeal",
    keyCaseLaw: "Henson v. State, 2012 Ark. 181 (Ark. 2012)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1098; People v. Massie (1967)",
    standard: "joint trials preferred; severance required where joint trial would be 'so prejudicial as to be the equivalent of a denial of due process'",
    timeLimits: "file before trial; court retains discretion during trial",
    keyCaseLaw: "People v. Coffman, 34 Cal. 4th 1 (2004)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 14",
    standard: "court may order severance if defendant or prosecution is prejudiced by joinder; balances prejudice against judicial economy",
    timeLimits: "file pretrial; court may sever during trial",
    keyCaseLaw: "Bernal v. People, 44 P.3d 184 (Colo. 2002)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 41-19",
    standard: "court may order separate trials if joinder is prejudicial; must show substantial prejudice, not merely that separate trial would be more advantageous",
    timeLimits: "file before trial; may be raised during trial",
    keyCaseLaw: "State v. Boscarino, 204 Conn. 714 (1987)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 14",
    standard: "court may grant severance for prejudice from joinder; considers whether jury can compartmentalize evidence",
    timeLimits: "file pretrial; court retains discretion through trial",
    keyCaseLaw: "Bates v. State, 386 A.2d 1139 (Del. 1978)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 14",
    standard: "court may order severance if joinder appears to prejudice defendant; follows federal standard",
    timeLimits: "file before trial per local rules",
    keyCaseLaw: "Gray v. United States, 983 A.2d 1 (D.C. 2009)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.152",
    standard: "court shall grant severance if two or more offenses are improperly joined or if necessary to achieve a fair determination of guilt or innocence",
    timeLimits: "before trial; failure to timely raise may result in waiver",
    keyCaseLaw: "Crossley v. State, 596 So. 2d 447 (Fla. 1992)",
  },
  GA: {
    rule: "O.C.G.A. § 17-8-4",
    standard: "defendants jointly indicted may be tried jointly or separately in discretion of the court; severance required where joint trial would deny fair trial",
    timeLimits: "file before trial begins; court has continuing discretion",
    keyCaseLaw: "Cain v. State, 235 Ga. 128 (1975)",
  },
  HI: {
    rule: "Haw. R. Penal P. 14",
    standard: "court may order severance if joinder is prejudicial; defendant must show risk of substantial prejudice from joint trial",
    timeLimits: "file before trial; renewed motions considered during trial",
    keyCaseLaw: "State v. Sua, 92 Haw. 61 (1999)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 14",
    standard: "court may order severance if defendant or state is prejudiced by joinder; must show actual prejudice, not mere speculation",
    timeLimits: "file pretrial; court may grant during trial if prejudice becomes apparent",
    keyCaseLaw: "State v. Abel, 104 Idaho 865 (1983)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/114-8",
    standard: "court shall grant severance if it appears that a defendant or the state is prejudiced by joinder; mutual antagonism test",
    timeLimits: "file before trial; may be renewed during trial",
    keyCaseLaw: "People v. Daugherty, 102 Ill. 2d 533 (1984)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 14",
    standard: "court may grant severance for prejudice from joinder; defendant must demonstrate actual prejudice that prevented fair trial",
    timeLimits: "file before trial; may be granted during trial",
    keyCaseLaw: "Johnson v. State, 725 N.E.2d 864 (Ind. 2000)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.6(2)",
    standard: "court may order separate trials if defendant would be prejudiced by joinder; considers risk of jury confusion and spillover prejudice",
    timeLimits: "file 40 days before trial per Iowa R. Crim. P.",
    keyCaseLaw: "State v. Leutfaimany, 585 N.W.2d 200 (Iowa 1998)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-3204",
    standard: "court may order severance if prejudice results from joinder; considers whether jury can distinguish evidence relating to each count or defendant",
    timeLimits: "file pretrial; court retains discretion through trial",
    keyCaseLaw: "State v. Cruz, 297 Kan. 1048 (2013)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "KRS 532.140; RCr 9.16",
    standard: "court may grant separate trial for one or more defendants on motion showing undue prejudice",
    timeLimits: "file before trial; court may sever during trial",
    keyCaseLaw: "Ware v. Commonwealth, 537 S.W.3d 774 (Ky. 2017)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 495.1",
    standard: "court may grant severance when a defendant or the state will be prejudiced; defendant must show specific, compelling prejudice",
    timeLimits: "file in writing before commencement of trial",
    keyCaseLaw: "State v. Brooks, 541 So. 2d 801 (La. 1989)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 14",
    standard: "court may order severance if joinder appears to prejudice a defendant; balances prejudice against efficiency of joint trial",
    timeLimits: "file pretrial; court retains continuing authority",
    keyCaseLaw: "State v. Burrill, 2007 ME 136 (Me. 2007)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-253",
    standard: "court may order separate trials if prejudice results from joinder; defendant must show real and substantial possibility of prejudice",
    timeLimits: "file within 30 days after assignment date; court may grant later for good cause",
    keyCaseLaw: "State v. Frazier, 298 Md. 422 (1984)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 9(d)",
    standard: "court may order severance if substantial prejudice results from joinder; considers whether jury can fairly assess each charge/defendant separately",
    timeLimits: "file before trial; may be renewed at trial",
    keyCaseLaw: "Commonwealth v. Moran, 387 Mass. 644 (1982)",
  },
  MI: {
    rule: "MCR 6.121(D)",
    standard: "court may sever charges or defendants for fair determination of guilt or innocence; must show actual prejudice from joint trial",
    timeLimits: "file before trial; court retains authority through trial",
    keyCaseLaw: "People v. Hana, 447 Mich. 325 (1994)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 17.03",
    standard: "court may grant severance if prejudice results from joinder; must show actual prejudice that cannot be cured by cautionary instruction",
    timeLimits: "file pretrial; may be renewed during trial",
    keyCaseLaw: "State v. Profit, 591 N.W.2d 451 (Minn. 1999)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 7.07",
    standard: "court may grant separate trial if joint trial would be prejudicial; considers nature of charges and potential for jury confusion",
    timeLimits: "file before trial; court retains discretion during trial",
    keyCaseLaw: "Harris v. State, 970 So. 2d 151 (Miss. 2007)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 24.07",
    standard: "court may order severance if defendant is prejudiced by joinder; must show actual, not speculative, prejudice",
    timeLimits: "file before trial; court retains continuing authority",
    keyCaseLaw: "State v. Morrow, 968 S.W.2d 100 (Mo. 1998)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-11-404",
    standard: "court may order severance if necessary to achieve fair trial; considers whether jury can properly compartmentalize evidence",
    timeLimits: "file before trial; may be raised at any time if prejudice becomes apparent",
    keyCaseLaw: "State v. Azure, 2011 MT 129 (Mont. 2011)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-2002",
    standard: "court may grant severance if necessary to achieve a fair determination of guilt or innocence; must show compelling prejudice",
    timeLimits: "file pretrial; court retains discretion through trial",
    keyCaseLaw: "State v. Bjorklund, 258 Neb. 432 (2000)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 174.165",
    standard: "court may order severance if it appears that a defendant is prejudiced by joinder; must show specific prejudice from joint trial",
    timeLimits: "file before trial; court may order during trial",
    keyCaseLaw: "Chartier v. State, 124 Nev. 760 (2008)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. R. Crim. P. 16(b)",
    standard: "court may grant severance if defendant would be prejudiced by joinder; balances prejudice against judicial economy",
    timeLimits: "file pretrial; court retains authority through trial",
    keyCaseLaw: "State v. Barham, 126 N.H. 631 (1985)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:15-2",
    standard: "court may order severance to prevent manifest injustice; must show real potential of prejudice",
    timeLimits: "file before trial; may be raised during trial",
    keyCaseLaw: "State v. Coefield, 127 N.J. 328 (1992)",
  },
  NM: {
    rule: "NMRA 5-203(C)",
    standard: "court may grant severance if joinder prejudices defendant; considers risk of confusion, antagonistic defenses, and spillover effect",
    timeLimits: "file pretrial; court retains discretion",
    keyCaseLaw: "State v. Gallegos, 2007-NMSC-007 (N.M. 2007)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 200.20; CPL § 210.20(2)",
    standard: "court may sever if good cause is shown; considers undue prejudice from joint trial, including Bruton problems and antagonistic defenses",
    timeLimits: "file before trial per CPL requirements",
    keyCaseLaw: "People v. Mahboubian, 74 N.Y.2d 174 (1989)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-927",
    standard: "court may grant severance if defendant would be prejudiced by joinder; must show essential unfairness of joint trial",
    timeLimits: "file before trial; court retains authority",
    keyCaseLaw: "State v. Irwin, 304 N.C. 93 (1981)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 14",
    standard: "court may order severance for prejudice from joinder; follows federal standard; must show substantial prejudice",
    timeLimits: "file pretrial; court retains discretion",
    keyCaseLaw: "State v. Pratt, 2009 ND 83 (N.D. 2009)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim.R. 14",
    standard: "court shall grant severance to promote fair determination if defendant or state is prejudiced; considers whether jury can follow limiting instructions",
    timeLimits: "file before trial; court may sever during trial",
    keyCaseLaw: "State v. Torres, 66 Ohio St. 2d 340 (1981)",
  },
  OK: {
    rule: "22 O.S. § 439",
    standard: "court may grant separate trial for defendants jointly charged; must show specific prejudice from joint trial that cannot be cured by instruction",
    timeLimits: "file before trial; court retains authority",
    keyCaseLaw: "Cummings v. State, 968 P.2d 821 (Okla. Crim. App. 1998)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 136.060; ORCP 22",
    standard: "court may order separate trials if justice so requires; considers prejudice, complexity, and possibility of compromise verdict",
    timeLimits: "file before trial; court may order during trial",
    keyCaseLaw: "State v. Miller, 327 Or. 622 (1998)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 583",
    standard: "court may order separate trials if it appears that a defendant or the Commonwealth is prejudiced by offenses or defendants being tried together",
    timeLimits: "file before trial; may be renewed during trial",
    keyCaseLaw: "Commonwealth v. Lauro, 819 A.2d 100 (Pa. Super. 2003)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 14",
    standard: "court may order severance if defendant would be prejudiced by joinder; follows federal standard analysis",
    timeLimits: "file pretrial; court retains discretion",
    keyCaseLaw: "State v. Cardona, 969 A.2d 667 (R.I. 2009)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C.R.Crim.P. 14",
    standard: "court may grant severance if necessary for fair determination of guilt or innocence; considers complexity and potential jury confusion",
    timeLimits: "file before trial; court retains continuing authority",
    keyCaseLaw: "State v. Stokes, 381 S.C. 390 (2009)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-11-3",
    standard: "court may order separate trials if defendant or state would be prejudiced by joinder; must show clear prejudice from joint trial",
    timeLimits: "file before trial; may be raised during trial",
    keyCaseLaw: "State v. Miskimins, 435 N.W.2d 217 (S.D. 1989)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 14",
    standard: "court shall grant severance if defendant or state is prejudiced by joinder; considers whether jury can properly consider evidence against each defendant separately",
    timeLimits: "file before trial; court retains discretion through trial",
    keyCaseLaw: "State v. Shirley, 6 S.W.3d 243 (Tenn. 1999)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 36.09",
    standard: "each defendant may be tried separately or jointly; defendant who shows prejudice from joint trial is entitled to severance as a matter of right",
    timeLimits: "file before jury selection; timely motion preserves issue",
    keyCaseLaw: "Zafiro v. United States, 506 U.S. 534 (1993) (federal standard applied in TX)",
  },
  UT: {
    rule: "Utah R. Crim. P. 9.5",
    standard: "court may grant severance if joinder is prejudicial; considers complexity, potential confusion, and risk of compromise verdict",
    timeLimits: "file pretrial; court retains authority through trial",
    keyCaseLaw: "State v. Pierre, 572 P.2d 1338 (Utah 1977)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 14",
    standard: "court may order severance if defendant would be prejudiced by joinder; follows federal model with state adaptations",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. Bolio, 159 Vt. 281 (1992)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-262.1",
    standard: "court may order separate trials if necessary to achieve fair determination; must show that joinder is clearly prejudicial",
    timeLimits: "file before trial; court retains continuing authority",
    keyCaseLaw: "Forbes v. Commonwealth, 228 Va. 296 (1984)",
  },
  WA: {
    rule: "CrR 4.4(c)",
    standard: "court may grant severance to promote fair determination of guilt or innocence; considers potential for spillover prejudice and jury confusion",
    timeLimits: "file pretrial; court may sever during trial",
    keyCaseLaw: "State v. Bythrow, 114 Wash. 2d 713 (1990)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 14",
    standard: "court may order severance if defendant is prejudiced by joinder; must demonstrate clear prejudice that outweighs benefits of joint trial",
    timeLimits: "file before trial; court retains discretion",
    keyCaseLaw: "State v. McGinnis, 193 W. Va. 147 (1994)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 971.12(3)",
    standard: "court may order separate trials if joinder is prejudicial; considers whether jury can reasonably keep evidence separate",
    timeLimits: "file before trial; may be raised during trial",
    keyCaseLaw: "State v. Bettinger, 100 Wis. 2d 691 (1981)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 14",
    standard: "court may order severance for prejudice from joinder; follows federal standard requiring specific showing of prejudice",
    timeLimits: "file pretrial; court retains discretion",
    keyCaseLaw: "Spinner v. State, 2003 WY 106 (Wyo. 2003)",
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

Standard for Severance: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: Severance standards vary by jurisdiction but generally require the defendant to demonstrate that joinder creates prejudice sufficient to deny a fair trial. Courts balance the defendant's right to a fair trial against judicial economy and the preference for joint trials. Key considerations include whether defenses are antagonistic, whether a co-defendant's confession implicates the moving defendant (Bruton issues), whether evidence admissible against one defendant or on one charge would create spillover prejudice, and whether limiting instructions can adequately cure any prejudice.`,
    helpText: "Legal standard for severance motions in this jurisdiction.",
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

Federal Rule of Criminal Procedure 8 — Joinder:
(a) Joinder of Offenses — The indictment or information may charge a defendant in separate counts with 2 or more offenses if the offenses charged are of the same or similar character, or are based on the same act or transaction, or are connected with or constitute parts of a common scheme or plan.
(b) Joinder of Defendants — The indictment or information may charge 2 or more defendants if they are alleged to have participated in the same act or transaction, or in the same series of acts or transactions, constituting an offense or offenses.

Federal Rule of Criminal Procedure 14 — Relief from Prejudicial Joinder:
(a) Relief — If the joinder of offenses or defendants in an indictment, an information, or a consolidation for trial appears to prejudice a defendant or the government, the court may order separate trials of counts, sever the defendants' trials, or provide any other relief that justice requires.

Zafiro v. United States, 506 U.S. 534 (1993):
The Supreme Court held that a district court should grant a severance under Rule 14 only if there is a serious risk that a joint trial would compromise a specific trial right of one of the defendants, or prevent the jury from making a reliable judgment about guilt or innocence. Mutually antagonistic defenses are not prejudicial per se; severance is required only when the defenses are truly irreconcilable, such that the jury will unjustifiably infer that this conflict alone demonstrates that both are guilty.

Bruton v. United States, 391 U.S. 123 (1968):
A defendant is deprived of his rights under the Confrontation Clause when a co-defendant's confession naming the defendant is introduced at a joint trial, even if the jury is instructed to consider that confession only against the co-defendant. Redaction that replaces the defendant's name with a blank or neutral pronoun may not suffice. See also Richardson v. Marsh, 481 U.S. 200 (1987); Gray v. Maryland, 523 U.S. 185 (1998).

Key Authorities: Zafiro v. United States, 506 U.S. 534 (1993); Bruton v. United States, 391 U.S. 123 (1968); Richardson v. Marsh, 481 U.S. 200 (1987); United States v. Lane, 474 U.S. 438 (1986).`,
    helpText: "Federal legal standard for severance motions.",
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

export const motionToSeverTemplate: DocumentTemplate = {
  id: "motion-to-sever",
  name: "Motion to Sever Defendants / Charges",
  category: "criminal",
  description: "A motion requesting separate trials for co-defendants or separate charges. Filed under Federal Rule of Criminal Procedure 14 or state equivalents. Addresses situations where joinder of defendants or charges creates unfair prejudice, antagonistic defenses, Bruton issues, or spillover effect. Critical in multi-defendant cases where one co-defendant's evidence or statements would be inadmissible against another.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionToSeverTemplate;
