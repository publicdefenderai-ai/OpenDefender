/**
 * Motion for New Trial Template
 *
 * Criminal law document template for requesting a new trial after conviction.
 * Filed under Federal Rule of Criminal Procedure 33 or state equivalents.
 * Covers grounds including: newly discovered evidence, prosecutorial misconduct,
 * juror misconduct, insufficiency of evidence, erroneous jury instructions,
 * and interests of justice.
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
    helpText: "The full name of the court where the trial occurred",
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
    label: "Date of Verdict / Conviction",
    type: "date",
    required: true,
    helpText: "The date the jury returned its verdict or the court entered its finding of guilt",
  },
  {
    id: "trialType",
    label: "Type of Trial",
    type: "select",
    required: true,
    helpText: "Whether the case was tried before a jury or a judge",
    validation: {
      options: [
        { value: "jury", label: "Jury Trial" },
        { value: "bench", label: "Bench Trial (Judge Only)" },
      ],
    },
  },
  {
    id: "convictionCharges",
    label: "Charge(s) of Conviction",
    type: "textarea",
    placeholder: "List the charges for which the defendant was convicted...",
    required: true,
    helpText: "The specific charges on which the defendant was found guilty",
    validation: {
      minLength: 10,
      maxLength: 2000,
    },
  },
  {
    id: "sentenceImposed",
    label: "Sentence Imposed (if already sentenced)",
    type: "textarea",
    placeholder: "Describe the sentence, or indicate if sentencing is pending...",
    required: false,
    helpText: "The sentence imposed, if sentencing has already occurred. Leave blank if pending.",
    validation: {
      maxLength: 2000,
    },
  },
];

const newTrialGroundsInputs: TemplateInput[] = [
  {
    id: "primaryGround",
    label: "Primary Ground for New Trial",
    type: "select",
    required: true,
    helpText: "Select the primary legal ground for seeking a new trial",
    validation: {
      options: [
        { value: "newly_discovered_evidence", label: "Newly Discovered Evidence" },
        { value: "prosecutorial_misconduct", label: "Prosecutorial Misconduct" },
        { value: "juror_misconduct", label: "Juror Misconduct or Irregularity" },
        { value: "insufficient_evidence", label: "Verdict Against the Weight of the Evidence" },
        { value: "erroneous_instructions", label: "Erroneous Jury Instructions" },
        { value: "erroneous_rulings", label: "Erroneous Evidentiary Rulings" },
        { value: "ineffective_counsel", label: "Ineffective Assistance of Counsel" },
        { value: "brady_violation", label: "Brady Violation (Suppressed Exculpatory Evidence)" },
        { value: "perjured_testimony", label: "Perjured Testimony / False Evidence" },
        { value: "interests_of_justice", label: "Interests of Justice" },
        { value: "other", label: "Other Grounds" },
      ],
    },
  },
  {
    id: "groundsDescription",
    label: "Detailed Description of Grounds",
    type: "textarea",
    placeholder: "Provide a detailed factual description of the grounds supporting this motion...",
    required: true,
    helpText: "Explain in detail the factual basis for requesting a new trial. For newly discovered evidence, describe the evidence, explain why it was not available at trial, and describe its likely impact on the outcome.",
    validation: {
      minLength: 100,
      maxLength: 5000,
    },
  },
  {
    id: "additionalGrounds",
    label: "Additional / Secondary Grounds",
    type: "textarea",
    placeholder: "Describe any additional grounds (optional)...",
    required: false,
    helpText: "If there are additional grounds for a new trial beyond the primary ground",
    validation: {
      maxLength: 3000,
    },
  },
  {
    id: "prejudiceDescription",
    label: "Prejudice to the Defendant",
    type: "textarea",
    placeholder: "Explain how the error or issue affected the trial outcome...",
    required: true,
    helpText: "Describe how the identified error, misconduct, or new evidence materially affected the trial outcome and prejudiced the defendant",
    validation: {
      minLength: 50,
      maxLength: 3000,
    },
  },
  {
    id: "supportingEvidence",
    label: "Supporting Evidence / Exhibits",
    type: "textarea",
    placeholder: "List supporting evidence (affidavits, transcripts, new witnesses, documents, etc.)...",
    required: false,
    helpText: "Describe any supporting evidence or exhibits that will be attached to this motion",
    validation: {
      maxLength: 3000,
    },
  },
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
        { value: "evidentiary", label: "Evidentiary hearing requested" },
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
    id: "trialDetails",
    name: "Trial Details",
    type: "user-input",
    order: 2,
    inputs: trialDetailsInputs,
    required: true,
    helpText: "Provide details about the trial and conviction.",
  },
  {
    id: "newTrialGrounds",
    name: "Grounds for New Trial",
    type: "user-input",
    order: 3,
    inputs: newTrialGroundsInputs,
    required: true,
    helpText: "Describe the legal and factual basis for requesting a new trial.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for new trial.

Trial/verdict date: {{trialDate}}
Trial type: {{trialType}}
Charges of conviction: {{convictionCharges}}
Sentence imposed: {{sentenceImposed}}
Primary ground: {{primaryGround}}
Detailed grounds: {{groundsDescription}}
Additional grounds: {{additionalGrounds}}
Prejudice to defendant: {{prejudiceDescription}}
Supporting evidence: {{supportingEvidence}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. The applicable legal standard for granting a new trial
  2. Application of the standard to the specific facts and grounds presented
  3. The materiality and prejudice — how the error affected the trial outcome
  4. Why the interests of justice require a new trial
  5. For newly discovered evidence: that the evidence is (a) newly discovered, (b) material, (c) not merely cumulative or impeaching, (d) likely to produce a different result, and (e) was not discoverable with due diligence before trial
- Cite applicable rules (Fed. R. Crim. P. 33 or state equivalent) and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion for new trial. Apply the appropriate standard based on the ground selected. For newly discovered evidence, apply the five-part Berry test (Berry v. State) or equivalent standard. For prosecutorial misconduct, address whether the conduct was so egregious as to deny the defendant a fair trial. For juror misconduct, apply the standard for whether the misconduct could have influenced the verdict. For weight of evidence, apply the standard of whether the verdict is against the clear weight of the evidence such that a miscarriage of justice may have occurred. Address both error and prejudice. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the grounds and trial details provided.",
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
    rule: "Ala. R. Crim. P. 24.1",
    standard: "court may grant new trial in the interest of justice or when verdict is contrary to the great weight of the evidence",
    timeLimits: "within 30 days of verdict or finding of guilt; newly discovered evidence within applicable time",
    keyCaseLaw: "Ex parte Frazier, 562 So. 2d 560 (Ala. 1989)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 33",
    standard: "court may grant new trial if required in the interest of justice; newly discovered evidence must be material and likely to produce a different result",
    timeLimits: "general grounds: within 5 days of verdict; newly discovered evidence: within 2 years",
    keyCaseLaw: "Salinas v. State, 373 P.3d 496 (Alaska App. 2016)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 24.1",
    standard: "new trial granted when verdict is contrary to law or weight of evidence, or for material error of law",
    timeLimits: "within 15 days of verdict; newly discovered evidence: reasonable time",
    keyCaseLaw: "State v. Fischer, 242 Ariz. 44 (2017)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 33.3",
    standard: "court shall grant new trial where there has been a material error prejudicing the defendant's rights or where newly discovered evidence is likely to change the result",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 3 years of judgment",
    keyCaseLaw: "Larimore v. State, 327 Ark. 271 (1997)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code §§ 1181, 1182",
    standard: "new trial may be granted when the verdict is contrary to law or evidence, for material error of law, juror misconduct, or newly discovered evidence that is likely to produce a different result",
    timeLimits: "must move before judgment is pronounced or within statutory time; newly discovered evidence: reasonable diligence",
    keyCaseLaw: "People v. Delgado, 5 Cal.4th 312 (1993); People v. Soojian, 190 Cal.App.4th 681 (2010)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 33",
    standard: "new trial on any ground that would require reversal on appeal, or where newly discovered evidence would probably bring about an acquittal",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 3 months of discovery or within time set by court",
    keyCaseLaw: "People v. Harlan, 109 P.3d 616 (Colo. 2005)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 42-53",
    standard: "new trial where injustice has been done and a new trial is reasonably necessary to ensure fair adjudication",
    timeLimits: "within 5 days after verdict; newly discovered evidence: within 3 years of final judgment",
    keyCaseLaw: "State v. Hammond, 221 Conn. 264 (1992)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. Crim. R. 33",
    standard: "new trial in the interest of justice; newly discovered evidence likely to change the result at a second trial",
    timeLimits: "within 7 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "Desmond v. State, 654 A.2d 821 (Del. 1994)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 33",
    standard: "new trial if the interest of justice so requires; follows Federal Rule 33 standard",
    timeLimits: "within 14 days of verdict (general); within 3 years (newly discovered evidence)",
    keyCaseLaw: "Thompson v. United States, 188 A.3d 808 (D.C. 2018)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.600",
    standard: "new trial if the court determines the verdict is contrary to law or the weight of the evidence, or if the defendant did not receive a fair and impartial trial",
    timeLimits: "within 10 days of rendition of verdict; newly discovered evidence: within 2 years of judgment and sentence",
    keyCaseLaw: "Jones v. State, 591 So. 2d 911 (Fla. 1991)",
  },
  GA: {
    rule: "O.C.G.A. § 5-5-20; § 5-5-21; § 5-5-23",
    standard: "new trial where the verdict is decidedly and strongly against the weight of the evidence or where some principle of law or justice has been violated",
    timeLimits: "within 30 days of entry of judgment; extraordinary motion for new trial based on newly discovered evidence: no statutory time limit but must show due diligence",
    keyCaseLaw: "Timberlake v. State, 246 Ga. 488 (1980)",
  },
  HI: {
    rule: "Haw. R. Penal P. 33",
    standard: "new trial in the interest of justice; newly discovered evidence that would probably change the result",
    timeLimits: "within 10 days of verdict (general); within 2 years (newly discovered evidence)",
    keyCaseLaw: "State v. McNulty, 60 Haw. 259 (1979)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 34",
    standard: "new trial when the verdict is contrary to evidence or law, or in the interest of justice",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 2 years",
    keyCaseLaw: "State v. Drapeau, 97 Idaho 685 (1976)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/116-1",
    standard: "new trial when the verdict is contrary to law or the weight of evidence; newly discovered evidence is material and non-cumulative, and would probably change the result on retrial",
    timeLimits: "within 30 days of verdict or finding; newly discovered evidence under post-conviction procedures",
    keyCaseLaw: "People v. Morgan, 212 Ill. 2d 148 (2004)",
  },
  IN: {
    rule: "Ind. R. Trial P. 59; Ind. Code § 35-37-2-2",
    standard: "new trial where the verdict is not sustained by sufficient evidence, is contrary to law, or there is material irregularity in the proceedings",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 1 year of judgment",
    keyCaseLaw: "Carter v. State, 738 N.E.2d 665 (Ind. 2000)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.24(2)(b)",
    standard: "new trial when the verdict is contrary to law or evidence, or when substantial justice has not been done",
    timeLimits: "within 5 days of verdict (general grounds); within 2 years (newly discovered evidence)",
    keyCaseLaw: "State v. Ellis, 578 N.W.2d 655 (Iowa 1998)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "Kan. Stat. § 22-3501",
    standard: "new trial for any ground that would require reversal on appeal, or when newly discovered evidence demonstrates the defendant's innocence",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "State v. Gunby, 282 Kan. 39 (2006)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "Ky. R. Crim. P. 10.02, 10.06",
    standard: "new trial for errors of law occurring at trial or where the verdict is palpably or flagrantly against the evidence",
    timeLimits: "within 5 days of verdict (general); newly discovered evidence: within 1 year of judgment",
    keyCaseLaw: "Foley v. Commonwealth, 942 S.W.2d 876 (Ky. 1996)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. Code Crim. Proc. Art. 851",
    standard: "new trial when the verdict is contrary to the law and the evidence, or when substantial rights of the defendant have been prejudiced",
    timeLimits: "before or at sentencing; newly discovered evidence under separate motion",
    keyCaseLaw: "State v. Humphrey, 412 So. 2d 507 (La. 1982)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 33",
    standard: "new trial in the interest of justice; same standard as federal rule",
    timeLimits: "within 10 days of verdict (general); within 2 years (newly discovered evidence)",
    keyCaseLaw: "State v. True, 438 A.2d 460 (Me. 1981)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. Rule 4-331",
    standard: "new trial in the interest of justice; newly discovered evidence that could not have been discovered with due diligence and would likely produce a different result",
    timeLimits: "within 10 days of verdict (general); within 1 year of sentencing (newly discovered evidence); fraud/irregularity: reasonable time",
    keyCaseLaw: "Campbell v. State, 373 Md. 637 (2003)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 25(b)(2)",
    standard: "new trial where justice may not have been done; new evidence is cast in terms of a 'substantial risk that the jury would have reached a different conclusion'",
    timeLimits: "within 30 days of finding of guilt or verdict; newly discovered evidence: within 3 years or at any time if in the interest of justice",
    keyCaseLaw: "Commonwealth v. Grace, 397 Mass. 303 (1986)",
  },
  MI: {
    rule: "MCR 6.431(B); MCL 770.1",
    standard: "new trial where the defendant was denied a fair and impartial trial; newly discovered evidence that is material and not merely cumulative",
    timeLimits: "within 21 days of verdict (general); newly discovered evidence: within prescribed statutory time",
    keyCaseLaw: "People v. Cress, 468 Mich. 678 (2003)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 26.04",
    standard: "new trial in the interest of justice or where there are errors of law or fact; newly discovered evidence must be material, non-cumulative, and likely to produce a more favorable result",
    timeLimits: "within 15 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "State v. Rainer, 502 N.W.2d 784 (Minn. 1993)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 10.05",
    standard: "new trial where the verdict is against the overwhelming weight of the evidence, or the defendant was denied a fair trial",
    timeLimits: "within 10 days of entry of judgment; newly discovered evidence: within applicable post-conviction time limits",
    keyCaseLaw: "Bush v. State, 895 So. 2d 836 (Miss. 2005)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 29.11",
    standard: "new trial where the verdict is against the weight of the evidence or there was error in the trial proceedings prejudicing the defendant's rights",
    timeLimits: "within 25 days of verdict; newly discovered evidence: within time set by court (reasonable diligence required)",
    keyCaseLaw: "State v. Clay, 533 S.W.3d 710 (Mo. 2017)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code § 46-16-702",
    standard: "new trial when the verdict is contrary to law or evidence, or there was material error of law",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 5 years of judgment",
    keyCaseLaw: "State v. Clark, 2008 MT 420",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-2101",
    standard: "new trial for irregularity in the proceedings, error of law, newly discovered material evidence, or when the verdict is not sustained by sufficient evidence",
    timeLimits: "varies by ground; newly discovered evidence: within applicable statutory time",
    keyCaseLaw: "State v. Bjorklund, 258 Neb. 432 (2000)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "Nev. Rev. Stat. § 176.515",
    standard: "new trial where the verdict has been obtained by fraud, jury or prosecutorial misconduct, insufficient evidence, or newly discovered evidence material to the defense",
    timeLimits: "within 7 days of verdict (general); within 2 years (newly discovered evidence)",
    keyCaseLaw: "Sanborn v. State, 107 Nev. 399 (1991)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. Rev. Stat. § 526:1; Super. Ct. R. Crim. 60",
    standard: "new trial for any cause for which a new trial may be granted in law or equity; interest of justice",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 3 years",
    keyCaseLaw: "State v. Abbott, 127 N.H. 444 (1985)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:20-1",
    standard: "new trial if the verdict is against the weight of the evidence or there was a clear and convincing showing of injustice",
    timeLimits: "within 10 days of verdict (general); within 5 years (newly discovered evidence requiring DNA); within 2 years otherwise",
    keyCaseLaw: "State v. Carter, 91 N.J. 36 (1982)",
  },
  NM: {
    rule: "N.M. R. Crim. P. 5-614",
    standard: "new trial where the verdict is contrary to law or the weight of the evidence, or where substantial justice requires it",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "State v. Sena, 2008-NMCA-035",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "N.Y. CPL § 330.30",
    standard: "new trial upon the ground of (1) court error affecting the verdict, (2) juror misconduct, (3) newly discovered evidence of a character that would probably change the result",
    timeLimits: "must be made within statutory time before sentencing; newly discovered evidence under CPL § 440.10",
    keyCaseLaw: "People v. Salemi, 309 N.Y. 208 (1955)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-1414; § 15A-1415",
    standard: "new trial for errors committed during the trial proceedings or newly discovered evidence that would probably produce a different result",
    timeLimits: "within 10 days of verdict (general grounds); newly discovered evidence: at any time under appropriate motions",
    keyCaseLaw: "State v. Britt, 320 N.C. 705 (1987)",
  },
  ND: {
    rule: "N.D. R. Crim. P. 33",
    standard: "new trial in the interest of justice; newly discovered evidence that could not have been discovered with reasonable diligence before trial",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "State v. Enger, 539 N.W.2d 259 (N.D. 1995)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim. R. 33",
    standard: "new trial for irregularity in proceedings, misconduct of the jury or counsel, manifest weight of evidence, or error of law",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 120 days of verdict (or later for good cause)",
    keyCaseLaw: "State v. Petro, 148 Ohio St. 505 (1947)",
  },
  OK: {
    rule: "Okla. Stat. tit. 22 § 952",
    standard: "new trial for irregularity in proceedings, juror misconduct, accident or surprise, newly discovered material evidence, or error of law",
    timeLimits: "within 10 judicial days of verdict; newly discovered evidence: within applicable statutory time",
    keyCaseLaw: "Allen v. State, 1994 OK CR 13",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "Or. Rev. Stat. § 136.535",
    standard: "new trial when the verdict is not sustained by sufficient evidence or there was material error of law or irregularity in proceedings",
    timeLimits: "before judgment is entered or within statutory time; newly discovered evidence: within applicable limits",
    keyCaseLaw: "State v. Pratt, 316 Or. 561 (1993)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa. R. Crim. P. 720",
    standard: "new trial where the verdict is so contrary to the weight of the evidence as to shock one's sense of justice; or material error of law",
    timeLimits: "within 10 days of verdict (post-sentence motion); newly discovered evidence: within 60 days of discovery or within 1 year of judgment",
    keyCaseLaw: "Commonwealth v. Widmer, 744 A.2d 745 (Pa. 2000)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 33",
    standard: "new trial in the interest of justice; follows Federal Rule 33 closely",
    timeLimits: "within 10 days of verdict; newly discovered evidence: within 3 years of final judgment",
    keyCaseLaw: "State v. Werner, 851 A.2d 1093 (R.I. 2004)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C. R. Crim. P. 29; S.C. Code § 17-23-120",
    standard: "new trial where the verdict is inconsistent with the evidence or there has been material error",
    timeLimits: "within 10 days of sentencing; newly discovered evidence: under post-conviction relief",
    keyCaseLaw: "State v. Glick, 375 S.C. 68 (App. 2007)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "S.D. Codified Laws § 23A-29-1",
    standard: "new trial for any cause for which a new trial may be granted in a civil action, or where the interests of justice require it",
    timeLimits: "within 15 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "State v. Reutter, 2004 SD 80",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 33",
    standard: "new trial in the interest of justice; where the verdict is against the weight of the evidence, or there was error of law at trial",
    timeLimits: "within 30 days of verdict; newly discovered evidence: within 1 year of final judgment",
    keyCaseLaw: "State v. Hawkins, 519 S.W.3d 1 (Tenn. 2017)",
  },
  TX: {
    rule: "Tex. R. App. P. 21",
    standard: "new trial where the verdict is contrary to the law and the evidence, or where material evidence favorable to the defendant has been discovered since trial",
    timeLimits: "within 30 days of sentencing (75 days if an amended motion); newly discovered evidence: within same time limits",
    keyCaseLaw: "Drew v. State, 743 S.W.2d 207 (Tex. Crim. App. 1987)",
  },
  UT: {
    rule: "Utah R. Crim. P. 24",
    standard: "new trial where there was material error of law, juror misconduct, newly discovered material evidence, or interests of justice require it",
    timeLimits: "within 10 days of verdict; newly discovered evidence: within 1 year of judgment",
    keyCaseLaw: "State v. James, 819 P.2d 781 (Utah 1991)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 33",
    standard: "new trial in the interest of justice; follows federal standard",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 2 years",
    keyCaseLaw: "State v. Rounds, 2004 VT 68",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Code § 8.01-675.1; Va. S. Ct. R. 3A:15",
    standard: "new trial if the verdict is contrary to the law and the evidence; also for after-discovered evidence",
    timeLimits: "within 21 days of entry of final order; newly discovered evidence: within 21 days of discovery",
    keyCaseLaw: "Odum v. Commonwealth, 225 Va. 123 (1983)",
  },
  WA: {
    rule: "Wash. CrR 7.5; RCW 10.61.010",
    standard: "new trial for material error of law, irregularity in proceedings, jury misconduct, newly discovered evidence, or insufficiency of evidence",
    timeLimits: "at any time before judgment or within statutory time; newly discovered evidence: within 1 year of judgment",
    keyCaseLaw: "State v. Williams, 96 Wn.2d 215 (1981)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 33",
    standard: "new trial in the interest of justice; verdict against the weight of the evidence or newly discovered evidence",
    timeLimits: "within 10 days of verdict (general); newly discovered evidence: within 2 years",
    keyCaseLaw: "State v. Frazier, 162 W.Va. 602 (1979)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 805.15; § 809.30",
    standard: "new trial in the interest of justice where the real controversy has not been tried, or where it is probable that justice has miscarried",
    timeLimits: "within 20 days of verdict; newly discovered evidence: within 1 year of judgment under post-conviction procedure",
    keyCaseLaw: "State v. Avery, 2013 WI 13",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 33",
    standard: "new trial where the defendant's substantial rights have been adversely affected or the verdict is contrary to the weight of the evidence",
    timeLimits: "within 14 days of verdict; newly discovered evidence: within 2 years of final judgment",
    keyCaseLaw: "Opie v. State, 422 P.3d 964 (Wyo. 2018)",
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

Standard for New Trial: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: Standards for granting a motion for new trial vary significantly by jurisdiction. Most jurisdictions distinguish between motions based on trial errors (which must be filed shortly after the verdict) and motions based on newly discovered evidence (which have longer filing windows but require a showing that the evidence was not available at trial with due diligence). The court will evaluate the nature of the error or new evidence, the prejudice to the defendant, and whether a new trial is required in the interest of justice.`,
    helpText: "Legal standard for new trial motions in this jurisdiction.",
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

Federal Rule of Criminal Procedure 33:
(a) Defendant's Motion — Upon the defendant's motion, the court may vacate any judgment and grant a new trial if the interest of justice so requires.
(b) Time to File:
  (1) Newly Discovered Evidence — Any motion for a new trial grounded on newly discovered evidence must be filed within 3 years after the verdict or finding of guilty.
  (2) Other Grounds — Any motion for a new trial grounded on any reason other than newly discovered evidence must be filed within 14 days after the verdict or finding of guilty.

Standard for Newly Discovered Evidence (Five-Part Test):
A new trial based on newly discovered evidence requires the defendant to show:
(1) The evidence was discovered after trial;
(2) The failure to discover the evidence was not due to lack of diligence;
(3) The evidence is not merely cumulative or impeaching;
(4) The evidence is material to the issues involved; and
(5) The evidence is of such a nature that it would probably produce an acquittal in a new trial.
See United States v. Johnson, 327 U.S. 106 (1946).

Standard for Weight of the Evidence:
A new trial may be granted when the verdict is against the weight of the evidence and a miscarriage of justice may have resulted. The court sits as a "thirteenth juror" and weighs the evidence. However, this remedy should be invoked sparingly and only in exceptional cases. See United States v. Sanchez, 969 F.2d 1409 (2d Cir. 1992).

Key Authorities: United States v. Johnson, 327 U.S. 106 (1946); United States v. Agurs, 427 U.S. 97 (1976); Berry v. State, 10 Ga. 511 (1851) (origin of Berry test for newly discovered evidence).`,
    helpText: "Federal legal standard for new trial motions.",
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
          helpText: `Select the ${countyLabel.toLowerCase()} where the case was tried`,
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

export const motionForNewTrialTemplate: DocumentTemplate = {
  id: "motion-for-new-trial",
  name: "Motion for New Trial",
  category: "criminal",
  description: "A motion requesting the court to grant a new trial after a conviction. Filed under Federal Rule of Criminal Procedure 33 or state equivalents. Covers grounds including newly discovered evidence, prosecutorial misconduct, juror misconduct, verdict against the weight of the evidence, erroneous jury instructions, erroneous evidentiary rulings, ineffective assistance of counsel, Brady violations, perjured testimony, and interests of justice. Time-sensitive — most jurisdictions require filing within days of the verdict for general grounds, with longer windows for newly discovered evidence.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "25-40 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForNewTrialTemplate;
