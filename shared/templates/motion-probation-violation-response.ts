/**
 * Motion / Response to Probation Violation Allegations
 *
 * A defense response to a probation violation petition, filed in the trial
 * court after a probation officer or prosecutor alleges a technical or
 * substantive probation violation. This document frames the defense position
 * for the violation hearing, contests alleged violations, presents mitigation,
 * and requests an outcome (continued probation, modified conditions, or in
 * rare cases, revocation with credit).
 *
 * Covers both technical violations (missed appointments, failed drug tests)
 * and new-offense violations. Includes jurisdiction-specific rules for all
 * 50 states + DC regarding the burden of proof, evidentiary standard,
 * and available sanctions.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";

// ─── Caption inputs ───────────────────────────────────────────────────────────

const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., Superior Court of Los Angeles County",
    required: true,
    helpText: "The court supervising probation and conducting the violation hearing",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., 2024-CR-001234",
    required: true,
    helpText: "The original criminal case number (may also have a separate violation docket number)",
  },
  {
    id: "violationNumber",
    label: "Violation Petition / Docket Number (if separate)",
    type: "text",
    placeholder: "e.g., VOP-2025-001",
    required: false,
    helpText: "If the court assigned a separate number to the violation petition, enter it here",
  },
  {
    id: "defendantName",
    label: "Defendant / Probationer Name",
    type: "party-name",
    placeholder: "Full legal name",
    required: true,
    helpText: "The defendant's full legal name as it appears in court records",
  },
];

// ─── Probation background inputs ──────────────────────────────────────────────

const probationBackgroundInputs: TemplateInput[] = [
  {
    id: "originalCharge",
    label: "Original Charge(s) of Conviction",
    type: "textarea",
    placeholder: "e.g., Possession of Controlled Substance (Health & Safety Code § 11350)",
    required: true,
    helpText: "The original offense(s) for which probation was granted",
    validation: { minLength: 5, maxLength: 1000 },
  },
  {
    id: "sentencingDate",
    label: "Original Sentencing Date",
    type: "date",
    required: true,
    helpText: "The date probation was originally imposed",
  },
  {
    id: "probationLength",
    label: "Length of Probation Term",
    type: "text",
    placeholder: "e.g., 3 years formal probation",
    required: true,
    helpText: "The length and type of probation originally imposed",
  },
  {
    id: "probationOfficerName",
    label: "Supervising Probation Officer",
    type: "text",
    placeholder: "PO Name (if known)",
    required: false,
    helpText: "Name of the supervising probation officer who filed or will testify at the hearing",
  },
  {
    id: "probationTermsDescription",
    label: "Key Probation Conditions",
    type: "textarea",
    placeholder:
      "List the key probation conditions (those relevant to the alleged violations), e.g.:\n" +
      "- Report to probation officer monthly\n" +
      "- Submit to random drug testing\n" +
      "- Complete 100 hours community service\n" +
      "- No new law violations\n" +
      "- Maintain employment or schooling",
    required: true,
    helpText: "List the probation conditions that are relevant to the alleged violations",
    validation: { minLength: 20, maxLength: 2000 },
  },
  {
    id: "complianceHistory",
    label: "Prior Compliance History",
    type: "textarea",
    placeholder:
      "Describe the defendant's compliance history since probation began, e.g.:\n" +
      "- Reported to PO consistently for 18 months without issue\n" +
      "- Completed community service and restitution\n" +
      "- No prior violations",
    required: false,
    helpText: "Describe any positive compliance history — this is important mitigation",
    validation: { maxLength: 2000 },
  },
];

// ─── Violation details inputs ─────────────────────────────────────────────────

const violationInputs: TemplateInput[] = [
  {
    id: "violationType",
    label: "Type of Alleged Violation",
    type: "select",
    required: true,
    helpText: "Select the primary type of alleged probation violation",
    validation: {
      options: [
        { value: "technical", label: "Technical Violation (missed appointment, failed test, etc.)" },
        { value: "new_offense", label: "New Criminal Offense" },
        { value: "both", label: "Both — Technical + New Offense" },
        { value: "absconding", label: "Absconding (failure to report / whereabouts unknown)" },
      ],
    },
  },
  {
    id: "allegedViolations",
    label: "Alleged Violations (as stated in petition)",
    type: "textarea",
    placeholder:
      "List each alleged violation as described in the probation violation petition, e.g.:\n" +
      "Violation 1: Failed to report to probation officer on January 15, 2025\n" +
      "Violation 2: Tested positive for methamphetamine on February 3, 2025\n" +
      "Violation 3: New arrest for Petty Theft on February 10, 2025",
    required: true,
    helpText: "Reproduce each alleged violation from the petition",
    validation: { minLength: 30, maxLength: 3000 },
  },
  {
    id: "defenseResponseToViolations",
    label: "Defense Response to Each Violation",
    type: "textarea",
    placeholder:
      "For each alleged violation, state the defense position, e.g.:\n" +
      "Violation 1 (missed report): Disputed. Client reported on January 17 — two days late due to a documented medical emergency. Hospital records available.\n" +
      "Violation 2 (positive test): Not disputed, but client was prescribed medication that caused a false positive. Documentation attached.\n" +
      "Violation 3 (new arrest): Charges pending — arrest does not constitute a proven violation. Client denies the conduct.",
    required: true,
    helpText: "Address each alleged violation with the defense factual position",
    validation: { minLength: 50, maxLength: 5000 },
  },
  {
    id: "hearingDate",
    label: "Violation Hearing Date",
    type: "date",
    required: false,
    helpText: "The scheduled date of the probation violation hearing, if set",
  },
];

// ─── Mitigation inputs ────────────────────────────────────────────────────────

const mitigationInputs: TemplateInput[] = [
  {
    id: "mitigatingCircumstances",
    label: "Mitigating Circumstances",
    type: "textarea",
    placeholder:
      "Describe circumstances that explain or mitigate the violations, e.g.:\n" +
      "- Client lost employment and housing during the violation period due to a factory closure\n" +
      "- Client is the sole caregiver for a disabled child\n" +
      "- Client has enrolled in substance use treatment program\n" +
      "- Client has maintained sobriety for 60 days and has documentation\n" +
      "- The violation was isolated and uncharacteristic of overall conduct",
    required: true,
    helpText: "Describe all mitigating circumstances — this is the core of the defense at a violation hearing",
    validation: { minLength: 50, maxLength: 5000 },
  },
  {
    id: "programParticipation",
    label: "Current Program Participation / Treatment",
    type: "textarea",
    placeholder:
      "List any programs, treatment, or services the defendant is currently enrolled in, e.g.:\n" +
      "- Substance use treatment: [Program Name], enrolled [date], attending weekly sessions\n" +
      "- Mental health counseling: [Provider], weekly sessions\n" +
      "- Employment: Currently employed at [Employer] since [date]\n" +
      "- Housing: Stable housing at [address] since [date]",
    required: false,
    helpText: "Current program enrollment significantly strengthens a request to continue probation",
    validation: { maxLength: 3000 },
  },
  {
    id: "supportCircumstances",
    label: "Community Ties & Support",
    type: "textarea",
    placeholder:
      "Describe family ties, employment, community support, etc., e.g.:\n" +
      "- Married with two minor children dependent on defendant\n" +
      "- Employed full-time for 2 years\n" +
      "- Volunteer at [organization]\n" +
      "- Letters of support from family / employer / pastor available",
    required: false,
    helpText: "Community ties and support letters strengthen the case for continued probation",
    validation: { maxLength: 2000 },
  },
  {
    id: "reliefRequested",
    label: "Relief Requested",
    type: "select",
    required: true,
    helpText: "What outcome is the defense seeking at the violation hearing?",
    validation: {
      options: [
        { value: "dismiss", label: "Dismiss the violation petition — violation not proven" },
        { value: "continue_probation", label: "Continue probation on current terms" },
        { value: "modify_conditions", label: "Continue probation with modified conditions" },
        { value: "reinstate_with_credit", label: "Reinstate probation with time-served credit" },
        { value: "early_termination", label: "Early termination of probation" },
        { value: "jail_no_prison", label: "If incarceration ordered — county jail, not prison" },
        { value: "other", label: "Other (describe in mitigation section)" },
      ],
    },
  },
  {
    id: "proposedConditions",
    label: "Proposed Modified Conditions (if applicable)",
    type: "textarea",
    placeholder:
      "If requesting modified probation conditions, describe what conditions you are proposing, e.g.:\n" +
      "- Increased check-in frequency (monthly → biweekly) for 6 months\n" +
      "- Mandatory enrollment and completion of [treatment program]\n" +
      "- Community service in lieu of incarceration\n" +
      "- GPS monitoring for 90 days",
    required: false,
    helpText: "Proposing concrete modified conditions shows the court a constructive path forward",
    validation: { maxLength: 2000 },
  },
];

// ─── Attorney inputs ──────────────────────────────────────────────────────────

const attorneyInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "party-name",
    placeholder: "Full name",
    required: true,
    helpText: "Defense attorney filing this response",
  },
  {
    id: "barNumber",
    label: "Bar Number",
    type: "text",
    placeholder: "State bar number",
    required: true,
    helpText: "Attorney's state bar number",
  },
  {
    id: "firmName",
    label: "Firm / Office Name",
    type: "text",
    placeholder: "Law firm, Public Defender's Office, etc.",
    required: false,
    helpText: "Law firm or public defender office",
  },
  {
    id: "address",
    label: "Attorney Address",
    type: "textarea",
    placeholder: "Street address, city, state, ZIP",
    required: true,
    helpText: "Mailing address for service",
    validation: { maxLength: 500 },
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "(555) 555-5555",
    required: true,
    helpText: "Attorney contact phone number",
  },
];

// ─── Base sections ────────────────────────────────────────────────────────────

const baseSections: TemplateSection[] = [
  {
    id: "caption",
    name: "Case Caption",
    type: "user-input",
    order: 1,
    inputs: captionInputs,
    required: true,
    helpText: "Enter court and case information.",
  },
  {
    id: "probationBackground",
    name: "Probation Background",
    type: "user-input",
    order: 2,
    inputs: probationBackgroundInputs,
    required: true,
    helpText: "Provide background on the original conviction and probation terms.",
  },
  {
    id: "violations",
    name: "Alleged Violations & Defense Response",
    type: "user-input",
    order: 3,
    inputs: violationInputs,
    required: true,
    helpText: "Identify each alleged violation and state the defense position.",
  },
  {
    id: "mitigation",
    name: "Mitigation & Relief Requested",
    type: "user-input",
    order: 4,
    inputs: mitigationInputs,
    required: true,
    helpText: "Present mitigating circumstances and the relief sought.",
  },
  {
    id: "legalArgument",
    name: "Legal Argument",
    type: "ai-generated",
    order: 5,
    required: true,
    aiPromptTemplate: `Draft a legal argument for a defense response to probation violation allegations.

Original charge: {{originalCharge}}
Probation length: {{probationLength}}
Key probation conditions: {{probationTermsDescription}}
Prior compliance history: {{complianceHistory}}
Type of alleged violations: {{violationType}}
Alleged violations: {{allegedViolations}}
Defense response to violations: {{defenseResponseToViolations}}
Mitigating circumstances: {{mitigatingCircumstances}}
Current program participation: {{programParticipation}}
Community ties: {{supportCircumstances}}
Relief requested: {{reliefRequested}}
Proposed modified conditions: {{proposedConditions}}

Requirements:
- Draft 3-5 paragraphs arguing:
  1. The applicable legal standard for revoking probation (preponderance of the evidence; due process applies — Morrissey v. Brewer, 408 U.S. 471 (1972); Gagnon v. Scarpelli, 411 U.S. 778 (1973))
  2. Contest disputed violations — burden is on the prosecution; mere arrest is not a proven violation
  3. Even if violations are proven, present the mitigation case for continued probation
  4. Argue the proposed disposition (continue probation / modify conditions / dismiss)
  5. Rehabilitation prospects and community interest in continued supervision vs. incarceration
- Cite Morrissey v. Brewer and Gagnon v. Scarpelli for due process requirements
- Use formal legal writing style
- Do not fabricate additional case citations`,
    aiInstructions:
      "Draft a formal legal argument for a probation violation defense response. Apply the preponderance of the evidence standard. Distinguish between contested violations (where the burden is on the state) and uncontested violations where mitigation is the focus. Emphasize rehabilitative progress, community ties, and the collateral consequences of incarceration. Argue for the specific relief requested. Cite Morrissey v. Brewer and Gagnon v. Scarpelli as the constitutional floor. Do not fabricate additional citations.",
    helpText: "AI will draft the legal argument based on the violation details and mitigation provided.",
  },
  {
    id: "attorney",
    name: "Attorney Information & Certificate of Service",
    type: "user-input",
    order: 6,
    inputs: attorneyInputs,
    required: true,
    helpText: "Attorney information for the certificate of service.",
  },
];

// ─── Jurisdiction variants ────────────────────────────────────────────────────

interface StateVopData {
  rule: string;
  burden: string;
  standard: string;
  maxSanction: string;
  keyNotes: string;
}

const stateVopData: Record<string, StateVopData> = {
  AL: { rule: "Ala. Code § 15-22-54", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Defendant entitled to written notice of violations, disclosure of evidence, opportunity to be heard, right to confront witnesses (unless good cause shown)." },
  AK: { rule: "Alaska R. Crim. P. 35", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original suspended sentence", keyNotes: "Probationer has right to counsel. Technical violations may be addressed with short-term sanction (jail) without full revocation." },
  AZ: { rule: "Ariz. R. Crim. P. 27.7", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence or maximum for original offense", keyNotes: "Arizona has a detailed violation hearing process. Defendant may request an evidentiary hearing. Mitigated sanctions available." },
  AR: { rule: "Ark. Code Ann. § 16-93-308", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Court may modify conditions rather than revoke. Graduated sanctions may apply for technical violations under Act 423 (2013)." },
  CA: { rule: "Cal. Penal Code § 1203.2", burden: "State", standard: "Preponderance of the evidence (People v. Rodriguez, 51 Cal.3d 437 (1990))", maxSanction: "Reinstated sentence up to statutory maximum", keyNotes: "AB 1950 (2020) limited probation to 1 year for misdemeanors and 2 years for most felonies. AB 116 (2021) provides for flash incarceration as an alternative to revocation for technical violations." },
  CO: { rule: "Colo. Rev. Stat. § 18-1.3-204", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "HB 19-1263 and SB 19-143 emphasized graduated sanctions for technical violations and treatment over revocation." },
  CT: { rule: "Conn. Gen. Stat. § 53a-32", burden: "State", standard: "Reasonable satisfaction of the court (lower than preponderance)", maxSanction: "Remainder of original sentence", keyNotes: "Connecticut uses a 'reasonable satisfaction' standard — lower bar than preponderance. Defendant has right to be heard and present evidence." },
  DE: { rule: "Del. Code Ann. tit. 11, § 4334", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Probationer has right to counsel. Court may modify conditions as an alternative to revocation." },
  DC: { rule: "D.C. Code § 16-710", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "D.C. Superior Court has broad discretion to modify probation conditions. Technical violations often result in short jail sanction rather than revocation." },
  FL: { rule: "Fla. Stat. § 948.06", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Florida distinguishes between technical violations and new-offense violations. Technical violations carry capped sanctions under SB 2534 (2019)." },
  GA: { rule: "O.C.G.A. § 42-8-34.1", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of probation term (converted to confinement)", keyNotes: "Georgia allows modification of probation conditions as an alternative to revocation. Probation revocation hearings are informal compared to criminal trials." },
  HI: { rule: "Haw. Rev. Stat. § 706-627", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original term (as prison)", keyNotes: "Court may also modify conditions. Hawaii has expanded use of drug courts as alternatives to revocation." },
  ID: { rule: "Idaho Code § 20-222", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of suspended sentence", keyNotes: "Court has broad discretion. The Idaho Department of Correction uses a graduated sanction grid for technical violations." },
  IL: { rule: "730 ILCS 5/5-6-4", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Court may impose a period of imprisonment without revoking probation (imprisonment as a condition). SB 2590 (2021) limited incarceration for many technical violations." },
  IN: { rule: "Ind. Code § 35-38-2-3", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of suspended sentence", keyNotes: "Indiana allows the court to order a period of incarceration and then continue probation. Probationer has due process rights to notice and hearing." },
  IA: { rule: "Iowa Code § 908.11", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of suspended sentence", keyNotes: "Iowa uses a risk-based approach to probation revocation. Court may modify conditions or impose a short jail term as a sanction." },
  KS: { rule: "Kan. Stat. Ann. § 22-3716", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original sentence", keyNotes: "Kansas requires structured graduated sanctions for technical violations before incarceration. Limits apply to first and second technical violations." },
  KY: { rule: "Ky. Rev. Stat. Ann. § 533.050", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Court may continue, extend, or modify probation as an alternative to revocation. HB 463 (2011) emphasized alternatives to revocation for technical violations." },
  LA: { rule: "La. Code Crim. Proc. art. 900", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Louisiana has extensive sentencing discretion. Courts frequently impose short jail time as a condition modification rather than full revocation." },
  ME: { rule: "Me. Rev. Stat. tit. 17-A, § 1206", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of probation converted to imprisonment", keyNotes: "Court may partially revoke probation, ordering a period of imprisonment and continuing probation for the remainder." },
  MD: { rule: "Md. Code Ann., Crim. Proc. § 6-223", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of suspended sentence", keyNotes: "Maryland allows partial revocation and reimposition of probation. Court has broad discretion in fashioning sanctions." },
  MA: { rule: "Mass. Gen. Laws ch. 279, § 3", burden: "State", standard: "Preponderance of the evidence (Commonwealth v. Durling, 407 Mass. 108 (1990))", maxSanction: "Remainder of suspended sentence up to original maximum", keyNotes: "Massachusetts follows Durling for due process requirements. Hearsay evidence admissible if reliable. Court may impose suspended sentence in full or in part." },
  MI: { rule: "MCL 771.4", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Michigan allows modification of probation as an alternative. Court may impose short jail term as condition. Technical violations should be addressed through the probation department first." },
  MN: { rule: "Minn. Stat. § 609.14", burden: "State", standard: "Clear and convincing evidence (higher than most states)", maxSanction: "Maximum sentence for original offense", keyNotes: "Minnesota uses a higher standard — clear and convincing evidence — for probation revocation. This is favorable to defendants." },
  MS: { rule: "Miss. Code Ann. § 47-7-37", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original sentence", keyNotes: "Court must find a willful and inexcusable violation. Inability to comply (e.g., inability to pay fines) is not willful." },
  MO: { rule: "Mo. Rev. Stat. § 559.036", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Missouri has expanded use of swift and certain sanctions for technical violations as an alternative to revocation under Justice Reinvestment." },
  MT: { rule: "Mont. Code Ann. § 46-23-1023", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Montana courts have broad discretion. Probationer has due process right to written notice, disclosure of evidence, and right to be heard." },
  NE: { rule: "Neb. Rev. Stat. § 29-2268", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Nebraska emphasizes rehabilitation. Graduated sanction matrices available. Court may modify conditions as alternative to revocation." },
  NV: { rule: "Nev. Rev. Stat. § 176A.630", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original sentence up to statutory maximum", keyNotes: "Nevada has a robust intermediate sanction system. Technical violations may be addressed with short jail stays ('flash incarceration') without revocation." },
  NH: { rule: "N.H. Rev. Stat. Ann. § 651:2-e", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of suspended sentence", keyNotes: "New Hampshire allows graduated sanctions. Court may impose a term of imprisonment and continue probation." },
  NJ: { rule: "N.J. Ct. R. 3:21-7", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remaining probation period converted to incarceration", keyNotes: "New Jersey uses a structured sanction framework. Court may modify conditions or impose a short county jail term." },
  NM: { rule: "N.M. Stat. Ann. § 31-21-15", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Court has broad discretion to continue, modify, or revoke. New Mexico uses intermediate sanctions for technical violations where feasible." },
  NY: { rule: "N.Y. CPL § 410.70", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence or new sentence within maximum", keyNotes: "NY CPL § 410.70 sets forth detailed procedural rights including right to counsel, right to cross-examine, and written findings. Technical violations may result in modification rather than revocation." },
  NC: { rule: "N.C. Gen. Stat. § 15A-1344", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Active sentence (original term)", keyNotes: "NC distinguishes between revocation (for willful violations) and modification. JRA (2011) reformed NC probation significantly — technical violations result in 90-day 'quick dip' incarceration rather than full revocation in many cases." },
  ND: { rule: "N.D. Cent. Code § 12.1-32-07", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Court may modify or extend probation as alternative. North Dakota uses a risk-needs assessment in probation supervision." },
  OH: { rule: "Ohio Rev. Code § 2951.08", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Ohio requires written notice and a hearing. Court may impose a short jail term or community control sanction as an intermediate step." },
  OK: { rule: "Okla. Stat. tit. 22, § 991b", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of deferred/suspended sentence up to maximum", keyNotes: "Oklahoma's SB 689 (2018) significantly reformed probation revocation for technical violations. Courts must use graduated responses." },
  OR: { rule: "Or. Rev. Stat. § 137.545", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence (not to exceed maximum)", keyNotes: "Oregon uses Evidence Based Decision Making. Intermediate sanctions including 'quick responses' (short jail stays) available for technical violations. HB 3194 reformed probation supervision." },
  PA: { rule: "Pa. R. Crim. P. 708", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Commonwealth v. Giliam, 2018 PA Super 119 — resentencing after revocation requires consideration of all relevant factors. Court may impose resentencing up to statutory maximum." },
  RI: { rule: "R.I. Gen. Laws § 12-19-9", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original suspended sentence", keyNotes: "Court has broad discretion. Probationer has right to hearing and right to counsel." },
  SC: { rule: "S.C. Code Ann. § 24-21-460", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Court may modify conditions as alternative to revocation. Intermediate sanctions including brief incarceration available." },
  SD: { rule: "S.D. Codified Laws § 23A-27-18.6", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "SD has a structured sanctions grid for technical violations. First and second technical violations result in defined jail caps rather than revocation." },
  TN: { rule: "Tenn. Code Ann. § 40-35-311", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original sentence", keyNotes: "Tennessee uses a 'swift, certain, proportionate' model for probation violations. HB 1560 (2016) caps incarceration for first and second technical violations." },
  TX: { rule: "Tex. Code Crim. Proc. art. 42A.751", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense (community supervision revoked)", keyNotes: "Texas community supervision (probation) revocations are common. SB 877 (2021) requires courts to use intermediate sanctions before revocation for technical violations." },
  UT: { rule: "Utah Code Ann. § 77-18-1", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Utah's Adult Probation & Parole uses a violation response matrix. Courts may impose short incarceration (sanction) without revoking probation for technical violations." },
  VT: { rule: "Vt. R. Crim. P. 32(f)", burden: "State", standard: "Reasonable satisfaction of the court", maxSanction: "Remainder of original sentence", keyNotes: "Vermont uses a lower 'reasonable satisfaction' standard. Court may continue, modify, or revoke probation." },
  VA: { rule: "Va. Code Ann. § 19.2-306", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Virginia's HB 5148 (2020) reformed probation — limited probation for misdemeanors to 12 months and for most felonies to 60 months. Technical violations after completion of required supervision period may not result in revocation." },
  WA: { rule: "Wash. Rev. Code § 9.94A.633", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Structured sentence sanctions under SSOSA/standard range rules", keyNotes: "Washington uses the Sentencing Reform Act framework. Violations of community custody result in Department of Corrections sanctions. Court proceedings apply for judicial supervision violations." },
  WV: { rule: "W. Va. Code § 62-12-10", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Original sentence", keyNotes: "Court may modify conditions. Graduated sanctions encouraged under state policy." },
  WI: { rule: "Wis. Stat. § 973.10", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Remainder of original sentence", keyNotes: "Wisconsin Department of Corrections handles administrative revocation; court proceeding required to impose original sentence. Quick reinstatement may be available after short revocation." },
  WY: { rule: "Wyo. Stat. Ann. § 7-13-408", burden: "State", standard: "Preponderance of the evidence", maxSanction: "Maximum sentence for original offense", keyNotes: "Court may modify conditions, extend probation, or revoke. Due process rights apply." },
};

function createStateStandardSection(state: string): TemplateSection {
  const data = stateVopData[state];
  return {
    id: "jurisdictionStandard",
    name: "Jurisdiction-Specific Probation Violation Rules",
    type: "static",
    order: 1,
    required: true,
    staticContent: `PROBATION VIOLATION RULES — ${state}

Rule/Statute: ${data.rule}
Burden of Proof: On the ${data.burden}
Standard of Proof: ${data.standard}
Maximum Sanction: ${data.maxSanction}

Key Notes: ${data.keyNotes}

Constitutional Floor (all jurisdictions): Morrissey v. Brewer, 408 U.S. 471 (1972); Gagnon v. Scarpelli, 411 U.S. 778 (1973) — due process requires: (1) written notice of claimed violations; (2) disclosure of evidence; (3) opportunity to be heard in person and present evidence; (4) right to confront and cross-examine adverse witnesses (unless good cause shown); (5) a neutral and detached hearing body; (6) written statement of reasons for revocation and evidence relied upon.`,
    helpText: `Jurisdiction-specific probation violation rules for ${state}.`,
  };
}

const jurisdictionVariants = Object.entries(stateVopData).map(([state, data]) => ({
  jurisdiction: state,
  courtType: "state" as const,
  sections: [
    createStateStandardSection(state),
    { ...baseSections[0], order: 2 },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
    { ...baseSections[5], order: 7 },
  ],
  courtSpecificRules: `Rule: ${data.rule}. Standard: ${data.standard}. Max: ${data.maxSanction}.`,
}));

// ─── Template export ──────────────────────────────────────────────────────────

export const motionProbationViolationResponseTemplate: DocumentTemplate = {
  id: "motion-probation-violation-response",
  name: "Probation Violation Defense Response",
  category: "criminal",
  description:
    "A defense response to probation violation allegations, filed before or at the violation hearing. Addresses each alleged violation, presents mitigating circumstances, and requests the appropriate disposition (continued probation, modified conditions, or dismissal). Covers both technical violations (missed appointments, failed drug tests) and new-offense violations. Includes all 50 states + DC with jurisdiction-specific burden of proof, evidentiary standards, maximum sanctions, and procedural rules. Constitutional due process requirements from Morrissey v. Brewer and Gagnon v. Scarpelli apply in all jurisdictions.",
  version: "1.0.0",
  lastUpdated: new Date("2026-03-10"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "20–30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default motionProbationViolationResponseTemplate;
