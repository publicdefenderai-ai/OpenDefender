/**
 * Motion to Compel Discovery Template
 *
 * Criminal law document template for compelling the prosecution to produce discovery
 * materials after initial request has gone unanswered or been inadequately fulfilled.
 * Distinct from the initial discovery motion — this enforces compliance.
 * Filed under Fed. R. Crim. P. 16 or state equivalents.
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

const discoveryDetailsInputs: TemplateInput[] = [
  {
    id: "originalRequestDate",
    label: "Date of Original Discovery Request",
    type: "date",
    required: true,
    helpText: "The date the original discovery request was served on the prosecution",
  },
  {
    id: "originalRequestMethod",
    label: "Method of Original Request",
    type: "select",
    required: true,
    helpText: "How the original discovery request was communicated",
    validation: {
      options: [
        { value: "written_motion", label: "Written Motion / Formal Request" },
        { value: "informal_request", label: "Informal Request" },
        { value: "court_order", label: "Court Order" },
        { value: "standing_order", label: "Standing Order / Automatic Disclosure" },
      ],
    },
  },
  {
    id: "discoveryRequested",
    label: "Discovery Materials Requested",
    type: "textarea",
    placeholder: "Describe what discovery materials were originally requested...",
    required: true,
    helpText: "Describe in detail the discovery materials that were requested from the prosecution",
    validation: {
      minLength: 20,
      maxLength: 5000,
    },
  },
  {
    id: "prosecutionResponse",
    label: "Prosecution's Response to Original Request",
    type: "select",
    required: true,
    helpText: "How the prosecution responded to the original discovery request",
    validation: {
      options: [
        { value: "no_response", label: "No Response / Ignored" },
        { value: "partial_compliance", label: "Partial Compliance Only" },
        { value: "objection", label: "Objection Filed" },
        { value: "delayed", label: "Delayed / Untimely Production" },
        { value: "refused", label: "Refused to Produce" },
      ],
    },
  },
  {
    id: "whatRemains",
    label: "Outstanding Discovery Materials",
    type: "textarea",
    placeholder: "Describe what discovery materials remain outstanding...",
    required: true,
    helpText: "Describe the specific discovery materials that have not yet been produced",
    validation: {
      minLength: 20,
      maxLength: 5000,
    },
  },
  {
    id: "relevanceOfMaterials",
    label: "Relevance of Outstanding Materials to Defense",
    type: "textarea",
    placeholder: "Explain how the outstanding materials are relevant to the defense...",
    required: true,
    helpText: "Explain why the outstanding materials are material and relevant to preparing the defense",
    validation: {
      minLength: 20,
      maxLength: 5000,
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

const sanctionsReliefInputs: TemplateInput[] = [
  {
    id: "sanctionsRequested",
    label: "Relief / Sanctions Requested",
    type: "select",
    required: true,
    helpText: "Select the primary relief or sanction sought for noncompliance",
    validation: {
      options: [
        { value: "compel_production", label: "Order Compelling Production" },
        { value: "continuance_until_produced", label: "Continuance Until Discovery Produced" },
        { value: "preclusion_of_evidence", label: "Preclusion of Undisclosed Evidence" },
        { value: "adverse_inference", label: "Adverse Inference Instruction" },
        { value: "contempt", label: "Contempt of Court" },
        { value: "dismissal", label: "Dismissal of Charges" },
      ],
    },
  },
  {
    id: "sanctionJustification",
    label: "Justification for Sanctions",
    type: "textarea",
    placeholder: "Explain why the requested sanction is appropriate (optional)...",
    required: false,
    helpText: "Provide additional justification for the specific sanction requested",
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
    id: "discoveryDetails",
    name: "Discovery Details",
    type: "user-input",
    order: 2,
    inputs: discoveryDetailsInputs,
    required: true,
    helpText: "Provide details about the original discovery request and what remains outstanding.",
  },
  {
    id: "sanctionsRelief",
    name: "Sanctions & Relief",
    type: "user-input",
    order: 3,
    inputs: sanctionsReliefInputs,
    required: true,
    helpText: "Specify the relief or sanctions sought for discovery noncompliance.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Generate a legal argument for a motion to compel discovery in a criminal case.

Original discovery request date: {{originalRequestDate}}
Method of original request: {{originalRequestMethod}}
Discovery materials requested: {{discoveryRequested}}
Prosecution's response: {{prosecutionResponse}}
Outstanding materials: {{whatRemains}}
Relevance to defense: {{relevanceOfMaterials}}
Scheduled trial date: {{trialDate}}
Sanctions/relief requested: {{sanctionsRequested}}
Sanction justification: {{sanctionJustification}}
Prosecution position: {{prosecutionPosition}}
Defendant name: the defendant

Requirements:
- Generate 4-6 paragraphs arguing:
  1. State the applicable legal standard for compelling discovery (Fed. R. Crim. P. 16 / state equivalent)
  2. Cite Brady v. Maryland, 373 U.S. 83 (1963) — the prosecution's constitutional obligation to disclose material exculpatory and impeachment evidence
  3. Cite Taylor v. Illinois, 484 U.S. 400 (1988) — courts have broad discretion to impose sanctions for discovery violations
  4. Discuss the prosecution's duty to disclose under due process and applicable discovery rules
  5. Explain what materials remain outstanding and why they are material to the defense
  6. Argue that the prosecution's noncompliance prejudices the defendant's ability to prepare for trial
  7. Address available sanctions for noncompliance and justify the specific relief requested
- Cite applicable rules and case law
- Address the prosecution's position
- Use formal legal writing style
- Do not fabricate case citations`,
    aiInstructions: "Draft a formal legal argument for a motion to compel discovery. Cite Brady v. Maryland, 373 U.S. 83 (1963) for the prosecution's constitutional obligation to disclose material evidence. Cite Taylor v. Illinois, 484 U.S. 400 (1988) for the court's authority to sanction discovery violations. Discuss due process obligations under the Fifth and Fourteenth Amendments. Address the specific discovery materials that remain outstanding and explain their materiality to the defense. Argue that continued noncompliance prejudices the defendant's right to a fair trial. Justify the specific sanction or relief requested. Use formal legal writing style. Do not fabricate case citations.",
    helpText: "AI will draft the legal argument based on the discovery details and grounds provided.",
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
    rule: "Ala. R. Crim. P. 16.1",
    standard: "prosecution shall disclose upon request; court may compel production and impose sanctions for noncompliance including exclusion of evidence",
    timeLimits: "request may be made after arraignment; motion to compel filed when response inadequate",
    keyCaseLaw: "Ex parte Monk, 557 So. 2d 832 (Ala. 1989)",
    counties: AL_COUNTIES,
  },
  AK: {
    rule: "Alaska R. Crim. P. 16(b)",
    standard: "prosecution shall disclose material and information within its possession; court may order compliance and sanction noncompliance",
    timeLimits: "disclosure required within reasonable time; motion to compel filed upon noncompliance",
    keyCaseLaw: "State v. Greathouse, 44 P.3d 983 (Alaska App. 2002)",
  },
  AZ: {
    rule: "Ariz. R. Crim. P. 15.7",
    standard: "court shall order disclosure if party fails to comply with discovery rules; sanctions include exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 15.1 timelines; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Tucker, 231 Ariz. 125 (App. 2012)",
  },
  AR: {
    rule: "Ark. R. Crim. P. 19.7",
    standard: "court may order compliance with discovery obligations; sanctions include continuance, exclusion, contempt, or dismissal",
    timeLimits: "disclosure required under Rule 17.1; motion to compel upon failure to comply",
    keyCaseLaw: "Dumond v. State, 2011 Ark. 267 (Ark. 2011)",
    counties: AR_COUNTIES,
  },
  CA: {
    rule: "Cal. Penal Code § 1054.5",
    standard: "court may order immediate disclosure upon showing that party has not complied with informal discovery obligations; sanctions include contempt, continuance, exclusion, or dismissal",
    timeLimits: "disclosure required at least 30 days before trial per § 1054.7; informal request must precede motion",
    keyCaseLaw: "People v. Gonzalez, 38 Cal. 4th 932 (2006)",
  },
  CO: {
    rule: "Colo. R. Crim. P. 16(III)(d)",
    standard: "court may compel disclosure and impose sanctions for noncompliance including exclusion of evidence, continuance, or contempt",
    timeLimits: "prosecution must disclose upon request; motion to compel upon noncompliance",
    keyCaseLaw: "People v. Dist. Ct., 790 P.2d 332 (Colo. 1990)",
    counties: CO_COUNTIES,
  },
  CT: {
    rule: "Conn. Practice Book § 40-11",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, adverse inference, or contempt",
    timeLimits: "disclosure required per § 40-13 timelines; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Peeler, 271 Conn. 338 (2004)",
    counties: CT_COUNTIES,
  },
  DE: {
    rule: "Del. Super. Ct. R. Crim. P. 16(d)",
    standard: "court may order discovery upon motion; failure to comply may result in exclusion, continuance, or other sanctions",
    timeLimits: "request after indictment; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Wright, 67 A.3d 319 (Del. 2013)",
    counties: DE_COUNTIES,
  },
  DC: {
    rule: "D.C. Super. Ct. R. Crim. P. 16(d)",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion, continuance, or other appropriate remedy",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "Edelen v. United States, 627 A.2d 968 (D.C. 1993)",
  },
  FL: {
    rule: "Fla. R. Crim. P. 3.220(n)",
    standard: "court shall impose sanctions for discovery violations including exclusion of evidence, contempt, continuance, or mistrial",
    timeLimits: "disclosure required within 15 days of demand; motion to compel upon noncompliance",
    keyCaseLaw: "Richardson v. State, 246 So. 2d 771 (Fla. 1971)",
  },
  GA: {
    rule: "O.C.G.A. § 17-16-6",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion of evidence, continuance, or contempt",
    timeLimits: "disclosure required within 10 days of demand; motion to compel upon noncompliance",
    keyCaseLaw: "Rower v. State, 264 Ga. 323 (1994)",
  },
  HI: {
    rule: "Haw. R. Penal P. 16(e)",
    standard: "court may order disclosure upon motion and impose sanctions for noncompliance including exclusion or continuance",
    timeLimits: "request after arraignment; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Peseti, 101 Haw. 172 (2003)",
    counties: HI_COUNTIES,
  },
  ID: {
    rule: "Idaho Crim. R. 16(e)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, contempt, or dismissal",
    timeLimits: "request after initial appearance; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Lamphere, 130 Idaho 630 (1997)",
    counties: ID_COUNTIES,
  },
  IL: {
    rule: "725 ILCS 5/114-13",
    standard: "court may compel disclosure and impose sanctions for noncompliance; sanctions include exclusion, continuance, contempt, or mistrial",
    timeLimits: "disclosure required under Supreme Court Rule 412; motion to compel upon failure",
    keyCaseLaw: "People v. Kladis, 2011 IL 110920 (Ill. 2011)",
  },
  IN: {
    rule: "Ind. R. Crim. P. 21(F)",
    standard: "court may compel compliance with discovery obligations; sanctions include exclusion, continuance, or other appropriate remedy",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "Joyner v. State, 736 N.E.2d 232 (Ind. 2000)",
  },
  IA: {
    rule: "Iowa R. Crim. P. 2.14(6)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion of evidence, continuance, or contempt",
    timeLimits: "request after arraignment; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Edouard, 854 N.W.2d 421 (Iowa 2014)",
    counties: IA_COUNTIES,
  },
  KS: {
    rule: "K.S.A. 22-3212(f)",
    standard: "court may order compliance and impose sanctions for noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Warrior, 294 Kan. 484 (2012)",
    counties: KS_COUNTIES,
  },
  KY: {
    rule: "RCr 7.24(8)",
    standard: "court may order discovery upon motion; sanctions for noncompliance include exclusion, continuance, or contempt",
    timeLimits: "request after arraignment; motion to compel upon noncompliance",
    keyCaseLaw: "Bowling v. Commonwealth, 163 S.W.3d 361 (Ky. 2005)",
    counties: KY_COUNTIES,
  },
  LA: {
    rule: "La. C.Cr.P. art. 729.5",
    standard: "court shall impose sanctions for discovery violations including ordering disclosure, granting continuance, prohibiting introduction of evidence, or holding in contempt",
    timeLimits: "discovery obligations arise upon request per art. 718-722; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Mitchell, 2012-2788 (La. 2014); 156 So. 3d 1162",
    counties: LA_PARISHES,
    countyLabel: "Parish",
  },
  ME: {
    rule: "Me. R. Crim. P. 16(d)",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion of evidence, continuance, or other remedy",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Cookson, 2003 ME 136 (Me. 2003)",
    counties: ME_COUNTIES,
  },
  MD: {
    rule: "Md. R. 4-263(n)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required within 30 days of demand; motion to compel upon noncompliance",
    keyCaseLaw: "Thomas v. State, 397 Md. 557 (2007)",
  },
  MA: {
    rule: "Mass. R. Crim. P. 14(a)(2)",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion, continuance, or other appropriate remedy",
    timeLimits: "automatic discovery upon not guilty plea; motion to compel upon noncompliance",
    keyCaseLaw: "Commonwealth v. Durham, 446 Mass. 212 (2006)",
  },
  MI: {
    rule: "MCR 6.201(J)",
    standard: "court may order compliance and impose sanctions for discovery noncompliance including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per MCR 6.201; motion to compel upon noncompliance",
    keyCaseLaw: "People v. Davie, 225 Mich. App. 592 (1997)",
  },
  MN: {
    rule: "Minn. R. Crim. P. 9.03",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or adverse inference",
    timeLimits: "disclosure required per Rule 9.01; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Palubicki, 700 N.W.2d 476 (Minn. 2005)",
    counties: MN_COUNTIES,
  },
  MS: {
    rule: "Miss. URCCC 9.04(I)",
    standard: "court may compel compliance and impose sanctions for discovery violations including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per URCCC 9.04; motion to compel upon noncompliance",
    keyCaseLaw: "Emanuel v. State, 150 So. 3d 675 (Miss. 2014)",
    counties: MS_COUNTIES,
  },
  MO: {
    rule: "Mo. R. Crim. P. 25.04",
    standard: "court may order compliance with discovery rules; sanctions for noncompliance include exclusion, continuance, or contempt",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Barriner, 34 S.W.3d 139 (Mo. 2000)",
    counties: MO_COUNTIES,
  },
  MT: {
    rule: "Mont. Code Ann. § 46-15-322",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per § 46-15-301 et seq.; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Stiffarm, 2007 MT 164 (Mont. 2007)",
    counties: MT_COUNTIES,
  },
  NE: {
    rule: "Neb. Rev. Stat. § 29-1912",
    standard: "court may order compliance with discovery rules; sanctions for noncompliance include exclusion, continuance, or contempt",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Williams, 277 Neb. 133 (2009)",
    counties: NE_COUNTIES,
  },
  NV: {
    rule: "NRS 174.295",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion, continuance, contempt, or dismissal",
    timeLimits: "request after arraignment; motion to compel upon noncompliance",
    keyCaseLaw: "Burnside v. State, 131 Nev. 371 (2015)",
    counties: NV_COUNTIES,
  },
  NH: {
    rule: "N.H. R. Crim. P. 12(e)",
    standard: "court may order compliance and impose sanctions for discovery noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 12; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Dedrick, 132 N.H. 218 (1989)",
    counties: NH_COUNTIES,
  },
  NJ: {
    rule: "N.J. Ct. R. 3:13-3(g)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, adverse inference, or dismissal",
    timeLimits: "disclosure required per R. 3:13-3; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Rosales, 202 N.J. 549 (2010)",
  },
  NM: {
    rule: "NMRA 5-501(E)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, contempt, or adverse inference",
    timeLimits: "disclosure required per Rule 5-501; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Gutierrez, 2007-NMSC-033 (N.M. 2007)",
    counties: NM_COUNTIES,
  },
  NY: {
    rule: "CPL § 245.70",
    standard: "court shall impose sanctions for discovery noncompliance including preclusion, adverse inference, continuance, contempt, or dismissal",
    timeLimits: "automatic discovery required within 35 days per CPL § 245.10; motion to compel upon noncompliance",
    keyCaseLaw: "People v. Bay, 41 N.Y.3d 200 (2023)",
  },
  NC: {
    rule: "N.C. Gen. Stat. § 15A-910",
    standard: "court may order compliance with discovery obligations; sanctions include exclusion, continuance, contempt, or other appropriate remedy",
    timeLimits: "disclosure required per § 15A-903; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Willoughby, 329 N.C. 543 (1991)",
  },
  ND: {
    rule: "N.D.R.Crim.P. 16(d)",
    standard: "court may order compliance and impose sanctions for discovery noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Lunsford, 2010 ND 229 (N.D. 2010)",
    counties: ND_COUNTIES,
  },
  OH: {
    rule: "Ohio Crim.R. 16(L)",
    standard: "court may compel compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or mistrial",
    timeLimits: "disclosure required per Crim.R. 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Wiles, 59 Ohio St. 3d 71 (1991)",
  },
  OK: {
    rule: "22 O.S. § 2002(E)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "McCarty v. State, 765 P.2d 1215 (Okla. Crim. App. 1988)",
    counties: OK_COUNTIES,
  },
  OR: {
    rule: "ORS 135.865",
    standard: "court may compel disclosure and impose sanctions for noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per ORS 135.815; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Mende, 304 Or. 18 (1987)",
    counties: OR_COUNTIES,
  },
  PA: {
    rule: "Pa.R.Crim.P. 573(E)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per Rule 573; motion to compel upon noncompliance",
    keyCaseLaw: "Commonwealth v. Burke, 566 Pa. 402 (2001)",
  },
  RI: {
    rule: "R.I. Super. R. Crim. P. 16(g)",
    standard: "court may order compliance and impose sanctions for discovery noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Cline, 122 R.I. 297 (1979)",
    counties: RI_COUNTIES,
  },
  SC: {
    rule: "S.C.R.Crim.P. 5(d)",
    standard: "court may compel compliance with discovery rules; sanctions include exclusion, continuance, contempt, or other remedy",
    timeLimits: "disclosure required per Rule 5; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Kennerly, 331 S.C. 442 (1998)",
    counties: SC_COUNTIES,
  },
  SD: {
    rule: "SDCL § 23A-13-14",
    standard: "court may order compliance with discovery rules; sanctions for noncompliance include exclusion, continuance, or contempt",
    timeLimits: "disclosure required upon request; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Buchholz, 2011 S.D. 64 (S.D. 2011)",
    counties: SD_COUNTIES,
  },
  TN: {
    rule: "Tenn. R. Crim. P. 16(d)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Ferguson, 2 S.W.3d 912 (Tenn. 1999)",
  },
  TX: {
    rule: "Tex. Code Crim. Proc. Art. 39.14(a)",
    standard: "prosecution shall produce discovery materials upon request; court may compel compliance and impose sanctions for noncompliance",
    timeLimits: "disclosure required upon request under Michael Morton Act; motion to compel upon noncompliance",
    keyCaseLaw: "Watkins v. State, 619 S.W.3d 265 (Tex. Crim. App. 2021)",
  },
  UT: {
    rule: "Utah R. Crim. P. 16(g)",
    standard: "court may order compliance and impose sanctions for discovery noncompliance including exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Knight, 2003 UT App 354 (Utah App. 2003)",
    counties: UT_COUNTIES,
  },
  VT: {
    rule: "Vt. R. Crim. P. 16(d)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, contempt, or other appropriate remedy",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Shippee, 2003 VT 106 (Vt. 2003)",
    counties: VT_COUNTIES,
  },
  VA: {
    rule: "Va. Sup. Ct. R. 3A:11(e)",
    standard: "court may order compliance with discovery rules and impose sanctions for noncompliance including exclusion or continuance",
    timeLimits: "disclosure required per Rule 3A:11; motion to compel upon noncompliance",
    keyCaseLaw: "Zook v. Commonwealth, 31 Va. App. 560 (2000)",
  },
  WA: {
    rule: "CrR 4.7(h)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per CrR 4.7; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Hutchinson, 135 Wash. 2d 863 (1998)",
  },
  WV: {
    rule: "W. Va. R. Crim. P. 16(d)",
    standard: "court may order compliance with discovery rules; sanctions include exclusion, continuance, contempt, or other remedy",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "State v. Hatfield, 169 W. Va. 191 (1982)",
    counties: WV_COUNTIES,
  },
  WI: {
    rule: "Wis. Stat. § 971.23(7m)",
    standard: "court may order compliance and impose sanctions for discovery violations including exclusion, continuance, contempt, or dismissal",
    timeLimits: "disclosure required per § 971.23; motion to compel upon noncompliance",
    keyCaseLaw: "State v. DeLao, 2002 WI 49 (Wis. 2002)",
    counties: WI_COUNTIES,
  },
  WY: {
    rule: "Wyo. R. Crim. P. 16(d)",
    standard: "court may order compliance with discovery rules; sanctions for noncompliance include exclusion, continuance, or contempt",
    timeLimits: "disclosure required per Rule 16; motion to compel upon noncompliance",
    keyCaseLaw: "Dean v. State, 2003 WY 128 (Wyo. 2003)",
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

Standard for Compelling Discovery: ${rule.standard}

Time Limits: ${rule.timeLimits}

Key Case Law: ${rule.keyCaseLaw}

Note: The right to discovery in criminal cases is rooted in constitutional due process. Brady v. Maryland, 373 U.S. 83 (1963), requires the prosecution to disclose material exculpatory and impeachment evidence. Beyond Brady obligations, state discovery rules impose broader disclosure requirements. Courts have broad discretion to impose sanctions for discovery noncompliance, ranging from orders compelling production to exclusion of evidence, adverse inference instructions, continuances, contempt, or in extreme cases, dismissal of charges.`,
    helpText: "Legal standard for compelling discovery in this jurisdiction.",
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

Federal Rule of Criminal Procedure 16 — Discovery and Inspection:
(a) Government's Disclosure — Upon a defendant's request, the government must disclose: (1) defendant's oral, written, and recorded statements; (2) defendant's prior record; (3) documents and objects material to preparing the defense or intended for use by the government; (4) reports of examinations and tests; (5) expert witnesses summaries.
(d) Regulating Discovery — The court may, for good cause, deny, restrict, or defer discovery or inspection, or grant other appropriate relief. The court may impose sanctions for noncompliance.

Brady v. Maryland, 373 U.S. 83 (1963):
The prosecution has a constitutional obligation under the Due Process Clause to disclose evidence favorable to the accused that is material either to guilt or to punishment. This duty exists irrespective of good or bad faith. Evidence is material if there is a reasonable probability that, had the evidence been disclosed, the result of the proceeding would have been different. See also Giglio v. United States, 405 U.S. 150 (1972) (extending Brady to impeachment evidence); Kyles v. Whitley, 514 U.S. 419 (1995) (materiality standard).

Taylor v. Illinois, 484 U.S. 400 (1988):
Courts have broad discretion to impose sanctions for discovery violations, including preclusion of testimony. The sanction must be proportional to the violation and consider the willfulness of the violation, the impact on the opposing party, and the effectiveness of less severe sanctions.

Key Authorities: Fed. R. Crim. P. 16; Brady v. Maryland, 373 U.S. 83 (1963); Giglio v. United States, 405 U.S. 150 (1972); Kyles v. Whitley, 514 U.S. 419 (1995); Taylor v. Illinois, 484 U.S. 400 (1988); United States v. Bagley, 473 U.S. 667 (1985).`,
    helpText: "Federal legal standard for motions to compel discovery.",
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

export const motionToCompelDiscoveryTemplate: DocumentTemplate = {
  id: "motion-to-compel-discovery",
  name: "Motion to Compel Discovery",
  category: "criminal",
  description: "Motion to compel prosecution to produce discovery materials after initial request has gone unanswered or been inadequately fulfilled. Distinct from the initial discovery motion — this enforces compliance. Filed under Fed. R. Crim. P. 16 or state equivalents. Addresses situations where the prosecution has failed to meet its disclosure obligations under Brady v. Maryland and applicable discovery rules.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "15-20 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionToCompelDiscoveryTemplate;
