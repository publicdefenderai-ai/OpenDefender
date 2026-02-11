/**
 * Motion for Judgment of Acquittal Template
 *
 * Criminal law document template for requesting judgment of acquittal under
 * Fed. R. Crim. P. 29 or state equivalents at the close of the prosecution's case
 * or after all evidence has been presented.
 * Criminal equivalent of a directed verdict — argues that the prosecution has failed
 * to present sufficient evidence for a reasonable jury to find guilt beyond a reasonable doubt.
 * Applies the Jackson v. Virginia, 434 U.S. 307 (1979) standard.
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
    id: "trialStartDate",
    label: "Trial Start Date",
    type: "date",
    required: true,
    helpText: "The date the trial began",
  },
  {
    id: "trialPhase",
    label: "Trial Phase",
    type: "select",
    required: true,
    helpText: "The phase of trial at which this motion is being filed",
    validation: {
      options: [
        { value: "close_of_prosecution", label: "Close of Prosecution's Case-in-Chief" },
        { value: "close_of_all_evidence", label: "Close of All Evidence" },
        { value: "post_verdict", label: "Post-Verdict (Renewed Motion)" },
      ],
    },
  },
  {
    id: "charges",
    label: "Charges at Issue",
    type: "textarea",
    placeholder: "List all charges for which acquittal is sought...",
    required: true,
    helpText: "Describe the specific charges or counts for which judgment of acquittal is requested",
    validation: {
      minLength: 10,
      maxLength: 3000,
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

const sufficiencyArgumentsInputs: TemplateInput[] = [
  {
    id: "insufficientElements",
    label: "Insufficient Elements",
    type: "textarea",
    placeholder: "Describe which elements of the charged offense(s) the prosecution failed to prove...",
    required: true,
    helpText: "Identify each element of the charged offense(s) for which the prosecution failed to present sufficient evidence",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "missingEvidence",
    label: "Missing or Absent Evidence",
    type: "textarea",
    placeholder: "Describe evidence the prosecution failed to present that is necessary to establish guilt...",
    required: true,
    helpText: "Detail the critical evidence that the prosecution did not introduce or that is absent from the record",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "weaknessesInProsecution",
    label: "Weaknesses in Prosecution's Case",
    type: "textarea",
    placeholder: "Describe weaknesses, contradictions, or gaps in the prosecution's evidence...",
    required: true,
    helpText: "Identify specific weaknesses, contradictions, or gaps in the prosecution's case-in-chief",
    validation: {
      minLength: 50,
      maxLength: 5000,
    },
  },
  {
    id: "credibilityIssues",
    label: "Witness Credibility Issues",
    type: "textarea",
    placeholder: "Describe any significant credibility issues with prosecution witnesses...",
    required: false,
    helpText: "Note any significant credibility problems with prosecution witnesses that undermine the sufficiency of the evidence",
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
    id: "trialDetails",
    name: "Trial Details",
    type: "user-input",
    order: 2,
    inputs: trialDetailsInputs,
    required: true,
    helpText: "Provide details about the trial and charges at issue.",
  },
  {
    id: "sufficiencyArguments",
    name: "Sufficiency Arguments",
    type: "user-input",
    order: 3,
    inputs: sufficiencyArgumentsInputs,
    required: true,
    helpText: "Describe why the prosecution's evidence is insufficient.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion for judgment of acquittal in a criminal case.

Trial phase: {{trialPhase}}
Trial date: {{trialDate}}
Trial start date: {{trialStartDate}}
Charges at issue: {{charges}}
Judge assigned: {{judgeAssigned}}
Insufficient elements: {{insufficientElements}}
Missing evidence: {{missingEvidence}}
Weaknesses in prosecution's case: {{weaknessesInProsecution}}
Credibility issues: {{credibilityIssues}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard under Fed. R. Crim. P. 29 or state equivalent
  2. Cite Jackson v. Virginia, 434 U.S. 307 (1979) — viewing evidence in the light most favorable to the prosecution, a rational trier of fact could not find the essential elements of the crime beyond a reasonable doubt
  3. Apply the sufficiency standard to each element of the charged offense(s) that is unsupported
  4. Address missing or absent evidence critical to the prosecution's burden
  5. Discuss weaknesses and contradictions in the prosecution's case
  6. If post-verdict: address the standard for renewed motion under Rule 29(c)
  7. Conclude that the evidence is legally insufficient and acquittal is required as a matter of law
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion for judgment of acquittal. Apply the Jackson v. Virginia, 434 U.S. 307 (1979) standard — whether, viewing the evidence in the light most favorable to the prosecution, any rational trier of fact could have found the essential elements of the crime beyond a reasonable doubt. For each element identified as insufficient, explain why the prosecution's evidence fails to meet this standard. Address whether circumstantial evidence, if any, is sufficient or whether it merely raises suspicion or speculation. If the motion is post-verdict, address the standard for renewed motions under Fed. R. Crim. P. 29(c). Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the sufficiency arguments provided.",
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
    rule: "Ala. R. Crim. P. 20",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain a conviction; applies Jackson v. Virginia standard",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed motion within 30 days after verdict",
    keyCaseLaw: "Ex parte Woodall, 730 So. 2d 652 (Ala. 1998)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 29",
    standard: "court shall enter judgment of acquittal if evidence is insufficient to sustain a conviction on any charge",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 10 days of verdict",
    keyCaseLaw: "Dorman v. State, 622 P.2d 448 (Alaska 1981)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 20",
    standard: "court shall enter judgment of acquittal if no substantial evidence to warrant conviction; substantial evidence is more than a mere scintilla",
    timeLimits: "at close of prosecution's evidence or at close of all evidence",
    keyCaseLaw: "State v. Mathers, 165 Ariz. 64 (1990)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 33.1",
    standard: "motion for directed verdict; court must determine whether evidence is substantial to support the verdict; evidence viewed in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case and renewed at close of all evidence to preserve for appeal",
    keyCaseLaw: "Pinell v. State, 364 Ark. 353 (2006)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1118.1",
    standard: "court shall order acquittal if evidence is insufficient to sustain conviction on appeal; test is whether substantial evidence supports each element",
    timeLimits: "at close of prosecution's case in jury trial; § 1118 for court trial",
    keyCaseLaw: "People v. Cole, 33 Cal. 4th 1158 (2004)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 29",
    standard: "court shall enter judgment of acquittal if evidence is insufficient to sustain a conviction; court views evidence in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "People v. Bennett, 515 P.2d 466 (Colo. 1973)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 42-40",
    standard: "motion for judgment of acquittal; court must determine whether evidence, viewed most favorably to sustaining the verdict, is sufficient",
    timeLimits: "at close of prosecution's case or at close of all evidence",
    keyCaseLaw: "State v. Salz, 226 Conn. 20 (1993)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 29",
    standard: "court shall order entry of judgment of acquittal if evidence is insufficient to sustain conviction; prosecution must prove each element beyond reasonable doubt",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 7 days after verdict",
    keyCaseLaw: "Monroe v. State, 652 A.2d 560 (Del. 1995)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 29",
    standard: "court shall enter judgment of acquittal if evidence is insufficient; follows federal standard under Jackson v. Virginia",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "Curry v. United States, 520 A.2d 255 (D.C. 1987)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.380",
    standard: "motion for judgment of acquittal; court shall grant if evidence does not establish a prima facie case of guilt; evidence viewed in light most favorable to state",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; post-trial within 10 days",
    keyCaseLaw: "Lynch v. State, 293 So. 2d 44 (Fla. 1974)",
  },
  GA: {
    rule: "O.C.G.A. § 17-9-1",
    standard: "motion for directed verdict of acquittal; granted if no conflict in evidence and evidence with all reasonable deductions demands acquittal",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Jackson v. State, 276 Ga. 408 (2003)",
  },
  HI: {
    rule: "Haw. R. Penal P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain conviction; evidence viewed in strongest light for prosecution",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 10 days after verdict",
    keyCaseLaw: "State v. Keawe, 79 Haw. 281 (1995)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 29",
    standard: "court shall order entry of judgment of acquittal if evidence is insufficient to sustain conviction of the offense charged",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "State v. Hoyle, 140 Idaho 679 (2004)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/115-4(k)",
    standard: "motion for directed verdict; court directs verdict where evidence is insufficient when viewed in the light most favorable to prosecution",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "People v. Collins, 106 Ill. 2d 237 (1985)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if there is insufficient evidence of guilt; court considers whether reasonable person could find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case or at close of all evidence",
    keyCaseLaw: "Birdsong v. State, 685 N.E.2d 42 (Ind. 1997)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.19(8)",
    standard: "motion for judgment of acquittal; court must determine whether substantial evidence supports each element of the crime charged",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; post-verdict within stated time",
    keyCaseLaw: "State v. Leckington, 713 N.W.2d 208 (Iowa 2006)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-3419",
    standard: "motion for judgment of acquittal; court shall direct acquittal if evidence is insufficient to sustain conviction when viewed in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Frye, 294 Kan. 364 (2012)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "KRS 505.020; RCr 9.78",
    standard: "motion for directed verdict; granted if under the evidence as a whole it would be clearly unreasonable for a jury to find guilt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Commonwealth v. Benham, 816 S.W.2d 186 (Ky. 1991)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 778",
    standard: "motion for acquittal in bench trial; in jury trial, motion for post-verdict judgment of acquittal under art. 821; evidence viewed in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case; post-verdict motion within statutory period",
    keyCaseLaw: "State v. Mussall, 523 So. 2d 1305 (La. 1988)",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient for jury to find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "State v. Barry, 495 A.2d 825 (Me. 1985)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-324",
    standard: "motion for judgment of acquittal; court must determine whether evidence shows guilt beyond reasonable doubt or permits reasonable inference of innocence",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Albrecht, 336 Md. 475 (1994)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 25(a)",
    standard: "motion for required finding of not guilty; court enters acquittal if evidence taken in light most favorable to Commonwealth is insufficient",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Commonwealth v. Latimore, 378 Mass. 671 (1979)",
  },
  MI: {
    rule: "MCR 6.419",
    standard: "motion for directed verdict; court must determine if evidence, viewed most favorably to prosecution, could warrant reasonable juror to find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "People v. Wolfe, 440 Mich. 508 (1992)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 26.03, subd. 17",
    standard: "motion for judgment of acquittal; court shall grant if prosecution fails to present case making out all elements; evidence viewed most favorably to state",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; post-verdict within 15 days",
    keyCaseLaw: "State v. Berndt, 392 N.W.2d 876 (Minn. 1986)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 5.04",
    standard: "motion for directed verdict; court must determine whether evidence, in light most favorable to state, is sufficient for reasonable juror to find each element",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Bush v. State, 895 So. 2d 836 (Miss. 2005)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 27.07; Mo. R. Crim. P. 29.11",
    standard: "motion for judgment of acquittal; court determines whether substantial evidence supports each element viewed in light most favorable to state",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; post-trial motion within 25 days",
    keyCaseLaw: "State v. Bateman, 318 S.W.3d 681 (Mo. 2010)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-16-403",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient to support a finding of guilt of the offense charged",
    timeLimits: "at close of prosecution's case or at close of all evidence",
    keyCaseLaw: "State v. Swann, 2007 MT 126 (Mont. 2007)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-2001.01",
    standard: "motion for judgment of acquittal; court must determine whether evidence taken most favorably to state is sufficient for reasonable mind to find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. McCulloch, 274 Neb. 636 (2007)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 175.381",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient to sustain conviction; evidence viewed in light most favorable to state",
    timeLimits: "at close of prosecution's case or at close of all evidence",
    keyCaseLaw: "McNair v. State, 108 Nev. 53 (1992)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. R. Crim. P. 19(a)",
    standard: "motion for judgment of acquittal; court grants if evidence viewed most favorably to state cannot support conviction beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Boisvert, 149 N.H. 545 (2003)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:18-1",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient for reasonable jury to find guilt beyond reasonable doubt on any charge",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; renewed post-verdict within 20 days",
    keyCaseLaw: "State v. Reyes, 50 N.J. 454 (1967)",
  },
  NM: {
    rule: "NMRA 5-607",
    standard: "motion for directed verdict; court shall grant if evidence is insufficient to support verdict of guilty; viewed in light most favorable to state",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Rojo, 1999-NMSC-001 (N.M. 1999)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 290.10",
    standard: "motion for trial order of dismissal; court must determine whether legally sufficient evidence has been presented for each element of charged offense",
    timeLimits: "at close of prosecution's case; may not be renewed after presentation of defense evidence",
    keyCaseLaw: "People v. Bleakley, 69 N.Y.2d 490 (1987)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15-173",
    standard: "motion to dismiss for insufficiency; court considers whether substantial evidence of each element exists when viewed in light most favorable to state",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Smith, 40 N.C. App. 72 (1979)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 29",
    standard: "court shall order entry of judgment of acquittal if evidence is insufficient to sustain conviction; follows federal standard",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "State v. Kringstad, 353 N.W.2d 302 (N.D. 1984)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim.R. 29(A)",
    standard: "court shall order entry of judgment of acquittal if evidence is insufficient to sustain conviction; court construes evidence most strongly in favor of prosecution",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "State v. Jenks, 61 Ohio St. 3d 259 (1991)",
  },
  OK: {
    rule: "22 O.S. § 1232",
    standard: "demurrer to evidence / motion for directed verdict; court shall sustain if evidence is insufficient for jury to find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Tibbs v. State, 819 P.2d 1372 (Okla. Crim. App. 1991)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 136.445",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient as a matter of law to establish the offense charged",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Cervantes, 319 Or. 121 (1994)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 606",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient to sustain conviction; evidence viewed in light most favorable to Commonwealth",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence; post-verdict within 10 days",
    keyCaseLaw: "Commonwealth v. Widmer, 560 Pa. 308 (2000)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain conviction; follows federal standard",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within stated time after verdict",
    keyCaseLaw: "State v. Feng, 421 A.2d 1258 (R.I. 1980)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C.R.Crim.P. 19(a)",
    standard: "motion for directed verdict; court shall grant if evidence is insufficient as a matter of law for jury to find guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Weston, 367 S.C. 279 (2006)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-26-2",
    standard: "motion for judgment of acquittal; court shall order acquittal if evidence is insufficient to sustain conviction viewed in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 10 days after verdict",
    keyCaseLaw: "State v. Davi, 504 N.W.2d 844 (S.D. 1993)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 29",
    standard: "motion for judgment of acquittal; court shall grant if evidence is insufficient to sustain conviction of any offense for which defendant is being tried",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 30 days after verdict",
    keyCaseLaw: "State v. Hall, 8 S.W.3d 593 (Tenn. 1999)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 36.31; Art. 38.17",
    standard: "motion for instructed verdict; court shall instruct acquittal if evidence fails to prove defendant's guilt beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Jackson v. State, 17 S.W.3d 664 (Tex. Crim. App. 2000)",
  },
  UT: {
    rule: "Utah R. Crim. P. 17(p)",
    standard: "motion for directed verdict; court shall grant if evidence is insufficient to sustain conviction when viewed in light most favorable to prosecution",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Workman, 852 P.2d 981 (Utah 1993)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain conviction; follows federal standard analysis",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "State v. Baker, 154 Vt. 411 (1990)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. S. Ct. R. 3A:15",
    standard: "motion to strike the evidence; court must determine whether evidence is sufficient to sustain conviction when viewed in light most favorable to Commonwealth",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "Commonwealth v. Hudson, 265 Va. 505 (2003)",
  },
  WA: {
    rule: "CrR 6.13",
    standard: "motion for judgment of acquittal; court shall grant if there is no substantial evidence to support a finding of each essential element",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Green, 94 Wash. 2d 216 (1980)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain conviction; evidence viewed most favorably to prosecution",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 10 days after verdict",
    keyCaseLaw: "State v. Guthrie, 194 W. Va. 657 (1995)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 972.11(2)",
    standard: "motion for judgment of acquittal; court must consider whether evidence, viewed most favorably to state, is sufficient for jury to be convinced beyond reasonable doubt",
    timeLimits: "at close of prosecution's case; renewed at close of all evidence",
    keyCaseLaw: "State v. Poellinger, 153 Wis. 2d 493 (1990)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 29",
    standard: "court shall order judgment of acquittal if evidence is insufficient to sustain conviction; follows federal standard",
    timeLimits: "at close of prosecution's case or at close of all evidence; renewed within 14 days after verdict",
    keyCaseLaw: "Broom v. State, 695 P.2d 640 (Wyo. 1985)",
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

Standard for Judgment of Acquittal: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: The standard for judgment of acquittal requires the court to view the evidence in the light most favorable to the prosecution and determine whether any rational trier of fact could have found the essential elements of the crime beyond a reasonable doubt. Jackson v. Virginia, 434 U.S. 307 (1979). The court does not weigh the evidence or evaluate credibility — it determines only whether the evidence is legally sufficient. A motion for judgment of acquittal is appropriate at the close of the prosecution's case, at the close of all evidence, or as a renewed motion after verdict.`,
    helpText: "Legal standard for judgment of acquittal motions in this jurisdiction.",
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

Federal Rule of Criminal Procedure 29 — Motion for a Judgment of Acquittal:
(a) Before Submission to the Jury — After the government closes its evidence or after the close of all the evidence, the court on the defendant's motion must enter a judgment of acquittal of any offense for which the evidence is insufficient to sustain a conviction.
(b) Reserving Decision — The court may reserve decision on the motion, proceed with the trial, and decide the motion either before the jury returns a verdict or after it returns a verdict of guilty or is discharged without having returned a verdict.
(c) After Jury Verdict or Discharge — If the jury has returned a guilty verdict, the court may set aside the verdict and enter an acquittal. If the jury has failed to return a verdict, the court may enter a judgment of acquittal.

Jackson v. Virginia, 434 U.S. 307 (1979):
The Supreme Court established the constitutional standard for sufficiency of the evidence: whether, after viewing the evidence in the light most favorable to the prosecution, any rational trier of fact could have found the essential elements of the crime beyond a reasonable doubt. This standard applies to both direct and circumstantial evidence and is the minimum required by the Due Process Clause of the Fourteenth Amendment.

Key Authorities: Jackson v. Virginia, 434 U.S. 307 (1979); United States v. Gaudin, 515 U.S. 506 (1995); Musacchio v. United States, 577 U.S. 237 (2016); Curley v. United States, 160 F.2d 229 (D.C. Cir. 1947).`,
    helpText: "Federal legal standard for judgment of acquittal motions.",
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

export const motionForJudgmentOfAcquittalTemplate: DocumentTemplate = {
  id: "motion-for-judgment-of-acquittal",
  name: "Motion for Judgment of Acquittal",
  category: "criminal",
  description: "Filed under Fed. R. Crim. P. 29 or state equivalents at the close of the prosecution's case or after all evidence. Criminal equivalent of a directed verdict. Argues that the prosecution has failed to present sufficient evidence for a reasonable jury to find guilt beyond a reasonable doubt, applying the Jackson v. Virginia, 434 U.S. 307 (1979) standard.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "25-35 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionForJudgmentOfAcquittalTemplate;
