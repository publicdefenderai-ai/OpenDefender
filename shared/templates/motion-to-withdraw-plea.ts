/**
 * Motion to Withdraw Guilty Plea Template
 *
 * Criminal law document template for requesting withdrawal of a guilty or no-contest plea.
 * Filed when the plea was not knowing and voluntary, the defendant did not understand
 * the consequences (including immigration consequences per Padilla v. Kentucky),
 * counsel was ineffective, or there is newly discovered evidence.
 * Pre-sentencing motions use a "fair and just reason" standard; post-sentencing
 * motions require showing "manifest injustice."
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

const pleaDetailsInputs: TemplateInput[] = [
  {
    id: "pleaType",
    label: "Type of Plea",
    type: "select",
    required: true,
    helpText: "Select the type of plea that was entered",
    validation: {
      options: [
        { value: "guilty", label: "Guilty Plea" },
        { value: "no_contest", label: "No Contest / Nolo Contendere" },
      ],
    },
  },
  {
    id: "pleaDate",
    label: "Date Plea Was Entered",
    type: "date",
    required: true,
    helpText: "The date the guilty or no-contest plea was entered",
  },
  {
    id: "pleaStage",
    label: "Current Stage",
    type: "select",
    required: true,
    helpText: "Select whether the defendant has already been sentenced",
    validation: {
      options: [
        { value: "pre_sentencing", label: "Pre-Sentencing (plea entered, not yet sentenced)" },
        { value: "post_sentencing", label: "Post-Sentencing (already sentenced)" },
      ],
    },
  },
  {
    id: "originalCharges",
    label: "Original Charges",
    type: "textarea",
    placeholder: "Describe the charges to which the defendant pleaded...",
    required: true,
    helpText: "List the charges to which the defendant pleaded guilty or no contest",
    validation: {
      minLength: 20,
      maxLength: 2000,
    },
  },
  {
    id: "sentenceImposed",
    label: "Sentence Imposed (if post-sentencing)",
    type: "textarea",
    placeholder: "Describe the sentence imposed, if applicable...",
    required: false,
    helpText: "If the defendant has already been sentenced, describe the sentence imposed",
    validation: {
      maxLength: 1500,
    },
  },
];

const withdrawalGroundsInputs: TemplateInput[] = [
  {
    id: "withdrawalGround",
    label: "Ground for Withdrawal",
    type: "select",
    required: true,
    helpText: "Select the primary ground for seeking to withdraw the plea",
    validation: {
      options: [
        { value: "involuntary_plea", label: "Plea Was Not Knowing and Voluntary" },
        { value: "ineffective_counsel", label: "Ineffective Assistance of Counsel" },
        { value: "immigration_consequences", label: "Failure to Advise of Immigration Consequences (Padilla v. Kentucky)" },
        { value: "coercion", label: "Coercion or Duress" },
        { value: "factual_innocence", label: "Factual Innocence / Newly Discovered Evidence" },
        { value: "broken_plea_agreement", label: "Prosecution Breached Plea Agreement" },
        { value: "inadequate_colloquy", label: "Inadequate Plea Colloquy (Rule 11 / State Equivalent)" },
        { value: "mental_competency", label: "Defendant Was Not Mentally Competent at Time of Plea" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "groundsDescription",
    label: "Detailed Description of Grounds",
    type: "textarea",
    placeholder: "Provide a detailed description of why withdrawal of the plea is warranted...",
    required: true,
    helpText: "Describe in detail the factual and legal basis for withdrawing the plea",
    validation: {
      minLength: 100,
      maxLength: 3000,
    },
  },
  {
    id: "priorAttempts",
    label: "Prior Withdrawal Attempts",
    type: "select",
    required: true,
    helpText: "Number of prior attempts to withdraw the plea in this case",
    validation: {
      options: [
        { value: "0", label: "None" },
        { value: "1", label: "One prior attempt" },
        { value: "2", label: "Two or more prior attempts" },
      ],
    },
  },
];

const hearingInputs: TemplateInput[] = [
  {
    id: "hearingDate",
    label: "Requested Hearing Date",
    type: "date",
    required: false,
    helpText: "The requested date for a hearing on this motion, if applicable",
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

// ============================================================================
// Base Sections (Generic Template)
// ============================================================================

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
    id: "pleaDetails",
    name: "Plea Details",
    type: "user-input",
    order: 2,
    inputs: pleaDetailsInputs,
    required: true,
    helpText: "Provide details about the plea that was entered.",
  },
  {
    id: "withdrawalGrounds",
    name: "Grounds for Withdrawal",
    type: "user-input",
    order: 3,
    inputs: withdrawalGroundsInputs,
    required: true,
    helpText: "Describe the legal and factual basis for withdrawing the plea.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: "Generate a legal argument for a motion to withdraw a {{pleaType}} entered on {{pleaDate}}. The defendant pleaded to: {{originalCharges}}. The ground for withdrawal is: {{withdrawalGround}}. The case is at the {{pleaStage}} stage. {{#if sentenceImposed}}Sentence imposed: {{sentenceImposed}}.{{/if}} Detailed grounds: {{groundsDescription}}. {{#if priorAttempts !== '0'}}Note: {{priorAttempts}} prior withdrawal attempt(s) have been made.{{/if}}",
    aiInstructions: "Draft a formal legal argument section for a motion to withdraw a guilty plea. Apply the appropriate standard: 'fair and just reason' for pre-sentencing withdrawals (citing Fed. R. Crim. P. 11(d)(2)(B) or state equivalent) or 'manifest injustice' for post-sentencing (citing Fed. R. Crim. P. 11(e) or state equivalent). Address: (1) the legal standard, (2) application of the standard to the facts, (3) the absence of prejudice to the government, (4) relevant case law including Padilla v. Kentucky (2010) for immigration consequences and Strickland v. Washington (1984) for ineffective counsel claims. Use formal legal writing style. Do not fabricate case citations.",
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

// ============================================================================
// State-Specific Data
// ============================================================================

interface StateRuleData {
  rule: string;
  preSentence: string;
  postSentence: string;
  keyCaseLaw: string;
  counties?: { value: string; label: string }[];
  countyLabel?: string;
}

const stateRules: Record<string, StateRuleData> = {
  AL: {
    rule: "Ala. R. Crim. P. 14.4",
    preSentence: "freely allowed",
    postSentence: "manifest injustice",
    keyCaseLaw: "Ex parte Shumate, 906 So. 2d 165 (Ala. 2004)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 11(h)",
    preSentence: "court discretion",
    postSentence: "manifest injustice",
    keyCaseLaw: "Wahl v. State, 691 P.2d 1070 (Alaska 1984)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 17.5",
    preSentence: "any fair and just reason",
    postSentence: "must show manifest injustice",
    keyCaseLaw: "State v. Donald, 198 Ariz. 406 (App. 2000)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 26.1",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "Isom v. State, 356 Ark. 156 (2004)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1018",
    preSentence: "good cause",
    postSentence: "writ of habeas corpus under CPC § 1473.7 (immigration consequences)",
    keyCaseLaw: "People v. Cruz (1974) 12 Cal.3d 562; People v. Patterson (2017) 2 Cal.5th 885",
  },
  CO: {
    rule: "Colo. R. Crim. P. 32(d)",
    preSentence: "court discretion; considers (1) involuntariness, (2) no knowledge of consequences, (3) denial of effective counsel",
    postSentence: "court discretion with heightened showing",
    keyCaseLaw: "People v. Gee, 115 P.3d 1268 (Colo. 2005)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Gen. Stat. § 54-94a; Practice Book § 39-26",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Torres, 281 Conn. 268 (2007)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. Crim. R. 32(d)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice or constitutional violation",
    keyCaseLaw: "State v. Harden, 867 A.2d 946 (Del. Super. 2005)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 11(e)",
    preSentence: "any fair and just reason",
    postSentence: "to correct manifest injustice",
    keyCaseLaw: "Byrd v. United States, 377 A.2d 400 (D.C. 1977)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.170(f)",
    preSentence: "good cause; court has broad discretion",
    postSentence: "manifest injustice (Fla. R. Crim. P. 3.170(l))",
    keyCaseLaw: "State v. Partlow, 840 So. 2d 1040 (Fla. 2003)",
  },
  GA: {
    rule: "Ga. Code § 17-7-93(b)",
    preSentence: "court discretion before sentence pronounced",
    postSentence: "extraordinary motion under O.C.G.A. § 17-10-1(f)",
    keyCaseLaw: "Boykin v. State, 282 Ga. 750 (2007)",
  },
  HI: {
    rule: "Haw. R. Penal P. 32(d)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Gomes, 79 Hawai\u02BBi 32 (1995)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 33(c)",
    preSentence: "any just reason",
    postSentence: "extraordinary circumstances",
    keyCaseLaw: "State v. Hanslovan, 147 Idaho 530 (App. 2008)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/113-4(d) (pre-sentence); 725 ILCS 5/122-1 (post-conviction)",
    preSentence: "granted liberally before judgment",
    postSentence: "post-conviction petition",
    keyCaseLaw: "People v. Hughes, 2012 IL 112817",
  },
  IN: {
    rule: "Ind. Code § 35-35-1-4",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "Brightman v. State, 758 N.E.2d 41 (Ind. 2001)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.8(2)(b)",
    preSentence: "court discretion, good cause",
    postSentence: "proof of defect in proceedings",
    keyCaseLaw: "State v. Meron, 675 N.W.2d 537 (Iowa 2004)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "Kan. Stat. § 22-3210",
    preSentence: "good cause",
    postSentence: "manifest injustice (within 1 year)",
    keyCaseLaw: "State v. Edgar, 281 Kan. 47 (2006)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "Ky. R. Crim. P. 8.10",
    preSentence: "any fair and just reason",
    postSentence: "substantial rights violation",
    keyCaseLaw: "Bronk v. Commonwealth, 58 S.W.3d 482 (Ky. 2001)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. Code Crim. Proc. Art. 559",
    preSentence: "any time before sentence",
    postSentence: "showing plea constitutionally infirm",
    keyCaseLaw: "State v. Lewis, 421 So. 2d 224 (La. 1982)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 32(d)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Lovelace, 2007 ME 132",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. Rule 4-242(h)",
    preSentence: "any fair and just reason",
    postSentence: "set aside under Md. CP § 6-235 within 10 years",
    keyCaseLaw: "State v. Schlick, 465 Md. 566 (2019)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 30(b)",
    preSentence: "good cause",
    postSentence: "justice may not have been done",
    keyCaseLaw: "Commonwealth v. DeMarco, 387 Mass. 481 (1982)",
  },
  MI: {
    rule: "MCR 6.310(B)",
    preSentence: "court shall allow if (1) defective plea, (2) mistake/fraud, (3) not of record",
    postSentence: "MCR 6.310(C), set aside only if would be unjust",
    keyCaseLaw: "People v. Brown, 492 Mich. 684 (2012)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 15.05",
    preSentence: "fair and just reason",
    postSentence: "correct manifest injustice",
    keyCaseLaw: "State v. Raleigh, 778 N.W.2d 90 (Minn. 2010)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. Unif. R. Cir. & Cnty. Ct. Prac. 8.04",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "Myers v. State, 583 So. 2d 174 (Miss. 1991)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 29.07(d)",
    preSentence: "any just reason",
    postSentence: "correct manifest injustice",
    keyCaseLaw: "State v. Rolfe, 395 S.W.3d 54 (Mo. App. 2013)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code § 46-16-105(2)",
    preSentence: "freely allowed before sentence",
    postSentence: "must show good cause",
    keyCaseLaw: "State v. Warclub, 2005 MT 149",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-1819.02",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Gonzalez-Faguaga, 266 Neb. 72 (2003)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "Nev. Rev. Stat. § 176.165",
    preSentence: "good cause",
    postSentence: "showing plea invalid under constitutional standards",
    keyCaseLaw: "Stevenson v. State, 131 Nev. 598 (2015)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. Super. Ct. R. 99-A",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Bowers, 150 N.H. 33 (2003)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:21-1",
    preSentence: "motion in the interest of justice before sentencing",
    postSentence: "PCR petition under R. 3:22",
    keyCaseLaw: "State v. Slater, 198 N.J. 145 (2009)",
  },
  NM: {
    rule: "N.M. R. Crim. P. 5-304(F)",
    preSentence: "freely given before sentencing",
    postSentence: "habeas corpus",
    keyCaseLaw: "State v. Garcia, 1996-NMSC-013",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "N.Y. CPL § 220.60",
    preSentence: "any time before sentence on good cause",
    postSentence: "CPL § 440.10 motion to vacate",
    keyCaseLaw: "People v. Frederick, 45 N.Y.2d 520 (1978)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-1023",
    preSentence: "any fair and just reason",
    postSentence: "motion for appropriate relief under § 15A-1414",
    keyCaseLaw: "State v. Handy, 326 N.C. 532 (1990)",
  },
  ND: {
    rule: "N.D. R. Crim. P. 11(d)",
    preSentence: "any fair and just reason",
    postSentence: "correct manifest injustice",
    keyCaseLaw: "State v. Lium, 2008 ND 164",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim. R. 32.1",
    preSentence: "freely and fairly",
    postSentence: "to correct manifest injustice",
    keyCaseLaw: "State v. Xie, 62 Ohio St. 3d 521 (1992)",
  },
  OK: {
    rule: "Okla. Stat. tit. 22 § 1033",
    preSentence: "any just reason",
    postSentence: "showing plea invalid",
    keyCaseLaw: "Taylor v. State, 1998 OK CR 45",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "Or. Rev. Stat. § 135.365",
    preSentence: "good cause",
    postSentence: "post-conviction relief under ORS § 138.510",
    keyCaseLaw: "State v. Mayfield, 302 Or. 631 (1987)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa. R. Crim. P. 591",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice (Pa. R. Crim. P. 720)",
    keyCaseLaw: "Commonwealth v. Carrasquillo, 631 Pa. 692 (2015)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 32(d)",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Feng, 421 A.2d 1258 (R.I. 1980)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. R. Crim. P. 14(b)",
    preSentence: "good cause",
    postSentence: "PCR application under § 17-27-20",
    keyCaseLaw: "Suber v. State, 371 S.C. 554 (2006)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "S.D. Codified Laws § 23A-7-11",
    preSentence: "any just reason",
    postSentence: "showing plea not voluntary or knowing",
    keyCaseLaw: "State v. Bad Moccasin, 2006 SD 91",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 32(f)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Turner, 919 S.W.2d 346 (Tenn. Crim. App. 1995)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 26.13(a)",
    preSentence: "right to withdraw before acceptance",
    postSentence: "motion for new trial under Art. 40.001",
    keyCaseLaw: "Jackson v. State, 590 S.W.2d 514 (Tex. Crim. App. 1979)",
  },
  UT: {
    rule: "Utah R. Crim. P. 11(h)",
    preSentence: "good cause",
    postSentence: "showing plea not knowing and voluntary",
    keyCaseLaw: "State v. Merrill, 2005 UT 34",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 32(d)",
    preSentence: "any just reason",
    postSentence: "correct manifest injustice",
    keyCaseLaw: "In re Brooks, 2004 VT 1",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 19.2-296",
    preSentence: "good cause before sentence",
    postSentence: "writ of habeas corpus or coram nobis",
    keyCaseLaw: "Parris v. Commonwealth, 189 Va. 321 (1949)",
  },
  WA: {
    rule: "Wash. CrR 4.2(f)",
    preSentence: "any just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State v. Taylor, 83 Wash.2d 594 (1974)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 32(d)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "State ex rel. Clancy v. Mathas, 220 W.Va. 66 (2006)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 971.08(2)",
    preSentence: "any fair and just reason",
    postSentence: "Nelson/Bentley hearing (new factor or manifest injustice)",
    keyCaseLaw: "State v. Bangert, 131 Wis. 2d 246 (1986)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 32(d)",
    preSentence: "any fair and just reason",
    postSentence: "manifest injustice",
    keyCaseLaw: "Frame v. State, 2001 WY 72",
    counties: WY_COUNTIES,
  },
};

// ============================================================================
// Federal Circuit Mapping
// ============================================================================

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

// ============================================================================
// Federal District Configuration
// ============================================================================

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

// ============================================================================
// Section Generators
// ============================================================================

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

Pre-Sentencing Standard: ${rule.preSentence}
Post-Sentencing Standard: ${rule.postSentence}

Key Case Law: ${rule.keyCaseLaw}

Note: Pre-sentencing motions to withdraw a plea are generally evaluated under a more lenient standard. Post-sentencing motions require a heightened showing. The court will consider whether the plea was knowing and voluntary, whether the defendant received effective assistance of counsel, and whether the government would be prejudiced by withdrawal.`,
    helpText: "Legal standard for plea withdrawal in this jurisdiction.",
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

Pre-Sentencing: Fed. R. Crim. P. 11(d)(2)(B) — A defendant may withdraw a plea of guilty before the court accepts the sentence for "any fair and just reason."

Post-Sentencing: Fed. R. Crim. P. 11(e) — After the court accepts the sentence, the defendant may not withdraw a plea of guilty, and the plea may be set aside only on direct appeal or collateral attack.

The court considers the United States v. Carr factors:
(1) Whether the defendant has asserted innocence;
(2) Whether withdrawal would prejudice the government;
(3) Whether the defendant delayed in filing the motion;
(4) Whether withdrawal would substantially inconvenience the court;
(5) Whether close assistance of counsel was available;
(6) Whether the original plea was knowing and voluntary;
(7) Whether withdrawal would waste judicial resources.

Additional authorities: Padilla v. Kentucky, 559 U.S. 356 (2010) (immigration consequences); Strickland v. Washington, 466 U.S. 668 (1984) (ineffective counsel standard).`,
    helpText: "Federal legal standard for plea withdrawal motions.",
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
          helpText: `Select the ${countyLabel.toLowerCase()} where the case is filed`,
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

// ============================================================================
// Generate State Sections
// ============================================================================

const allStateSections: Record<string, TemplateSection[]> = {};
for (const state of Object.keys(stateRules)) {
  allStateSections[state] = createStateSections(state);
}

// ============================================================================
// Generate Federal Sections
// ============================================================================

const allFederalSections: Record<string, TemplateSection[]> = {};
for (const { district, jurisdiction } of federalDistricts) {
  const circuit = circuitMap[jurisdiction];
  allFederalSections[district] = createFederalSectionsForDistrict(district, circuit);
}

// ============================================================================
// Build Jurisdiction Variants
// ============================================================================

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
    courtSpecificRules: `Filed under ${rule.rule}. Pre-sentence: ${rule.preSentence}. Post-sentence: ${rule.postSentence}. Key: ${rule.keyCaseLaw}.`,
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

// ============================================================================
// Template Export
// ============================================================================

export const motionToWithdrawPleaTemplate: DocumentTemplate = {
  id: "motion-to-withdraw-plea",
  name: "Motion to Withdraw Guilty Plea",
  category: "criminal",
  description: "A motion to withdraw a guilty or no-contest plea. Filed when the plea was not knowing and voluntary, the defendant did not understand the consequences (including immigration consequences per Padilla v. Kentucky), counsel was ineffective, or there is newly discovered evidence. Pre-sentencing motions are evaluated under a 'fair and just reason' standard; post-sentencing motions require showing 'manifest injustice.' Covers state-specific procedures and federal Rule 11 standards.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionToWithdrawPleaTemplate;
