/**
 * Notice of Appeal — State Criminal Court Template
 *
 * Initiates an appeal of a criminal conviction or sentence to the intermediate
 * appellate court (Court of Appeals / Appellate Division / etc.) in the
 * defendant's state. This is the threshold pleading that opens the appellate
 * record and triggers appeal deadlines — it must be filed within the
 * jurisdiction's statutory window (commonly 30 days of sentencing).
 *
 * Jurisdiction variants: all 50 states + DC with state-specific rules,
 * appellate court names, filing deadlines, and key case citations.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";

// ─── Caption inputs ───────────────────────────────────────────────────────────

const captionInputs: TemplateInput[] = [
  {
    id: "trialCourtName",
    label: "Trial Court Name",
    type: "court-name",
    placeholder: "e.g., Superior Court of Los Angeles County",
    required: true,
    helpText: "The full name of the court that entered the judgment being appealed",
  },
  {
    id: "caseNumber",
    label: "Trial Court Case Number",
    type: "case-number",
    placeholder: "e.g., 2024-CR-001234",
    required: true,
    helpText: "The case or docket number in the trial court",
  },
  {
    id: "defendantName",
    label: "Defendant / Appellant Name",
    type: "party-name",
    placeholder: "Full legal name",
    required: true,
    helpText: "The defendant's full legal name as it appears in trial court records",
  },
];

// ─── Judgment inputs ──────────────────────────────────────────────────────────

const judgmentInputs: TemplateInput[] = [
  {
    id: "convictionDate",
    label: "Date of Conviction / Verdict",
    type: "date",
    required: true,
    helpText: "The date the jury returned its verdict or the court entered a finding of guilt",
  },
  {
    id: "sentencingDate",
    label: "Date of Sentencing",
    type: "date",
    required: true,
    helpText: "The date sentence was imposed. Appeal deadlines typically run from sentencing.",
  },
  {
    id: "chargesConvicted",
    label: "Charge(s) of Conviction",
    type: "textarea",
    placeholder: "e.g., Count 1: Robbery in the Second Degree (Penal Code § 211); Count 2: ...",
    required: true,
    helpText: "List each charge on which the defendant was convicted, including statute numbers",
    validation: { minLength: 10, maxLength: 2000 },
  },
  {
    id: "sentenceImposed",
    label: "Sentence Imposed",
    type: "textarea",
    placeholder: "e.g., 3 years state prison, suspended; 3 years probation; $1,500 restitution",
    required: true,
    helpText: "Describe the full sentence imposed by the trial court",
    validation: { minLength: 5, maxLength: 1000 },
  },
  {
    id: "trialType",
    label: "Type of Trial",
    type: "select",
    required: true,
    helpText: "Whether the case was tried to a jury or a judge",
    validation: {
      options: [
        { value: "jury", label: "Jury Trial" },
        { value: "bench", label: "Bench Trial (Judge Only)" },
        { value: "plea", label: "Guilty Plea (Appealing Sentence or Preserved Issues)" },
        { value: "nolo", label: "No Contest Plea (Appealing Sentence or Preserved Issues)" },
      ],
    },
  },
];

// ─── Grounds inputs ───────────────────────────────────────────────────────────

const groundsInputs: TemplateInput[] = [
  {
    id: "primaryGrounds",
    label: "Primary Grounds for Appeal",
    type: "textarea",
    placeholder:
      "Summarize the main issues to be raised on appeal, e.g.:\n" +
      "1. The trial court erred in denying the motion to suppress evidence obtained in violation of the Fourth Amendment.\n" +
      "2. The verdict was not supported by sufficient evidence.\n" +
      "3. The court imposed an illegal sentence...",
    required: true,
    helpText:
      "Briefly identify the legal issues to be raised. These need not be exhaustive — the full argument is developed in the opening brief. Preserving issues here is important in some jurisdictions.",
    validation: { minLength: 30, maxLength: 4000 },
  },
  {
    id: "custodyStatus",
    label: "Defendant's Current Custody Status",
    type: "select",
    required: true,
    helpText: "Indicate whether the defendant is currently incarcerated or out pending appeal",
    validation: {
      options: [
        { value: "incarcerated", label: "Incarcerated — serving sentence" },
        { value: "bail_pending_appeal", label: "Out on bail/bond pending appeal" },
        { value: "probation", label: "Released on probation / supervised release" },
        { value: "released", label: "Released — sentence completed (seeking post-conviction relief)" },
      ],
    },
  },
  {
    id: "bailPendingAppeal",
    label: "Bail Pending Appeal",
    type: "select",
    required: false,
    helpText: "Will you also request bail pending appeal (if incarcerated)?",
    validation: {
      options: [
        { value: "yes", label: "Yes — will file separate motion for bail pending appeal" },
        { value: "no", label: "No" },
        { value: "included", label: "Yes — requesting bail in this notice" },
      ],
    },
  },
];

// ─── Attorney / service inputs ────────────────────────────────────────────────

const attorneyInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "party-name",
    placeholder: "Full name",
    required: true,
    helpText: "Attorney filing the notice of appeal",
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
    helpText: "Law firm or public defender office (leave blank if sole practitioner)",
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
  {
    id: "email",
    label: "Email Address",
    type: "text",
    placeholder: "attorney@example.com",
    required: false,
    helpText: "Attorney email address (required in many jurisdictions for e-filing)",
  },
  {
    id: "prosecutorName",
    label: "Prosecutor / Opposing Counsel Name",
    type: "party-name",
    placeholder: "Name of ADA or Deputy DA being served",
    required: true,
    helpText: "Name of the prosecutor to be served with this notice",
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
    helpText: "Enter trial court and case information.",
  },
  {
    id: "judgment",
    name: "Judgment Being Appealed",
    type: "user-input",
    order: 2,
    inputs: judgmentInputs,
    required: true,
    helpText: "Identify the conviction and sentence being appealed.",
  },
  {
    id: "grounds",
    name: "Grounds for Appeal",
    type: "user-input",
    order: 3,
    inputs: groundsInputs,
    required: true,
    helpText: "Describe the legal issues and defendant's current custody status.",
  },
  {
    id: "appealStatement",
    name: "Notice Statement",
    type: "ai-generated",
    order: 4,
    required: true,
    aiPromptTemplate: `Draft a formal Notice of Appeal for a state criminal case.

Trial court: {{trialCourtName}}
Case number: {{caseNumber}}
Defendant/Appellant: {{defendantName}}
Date of conviction: {{convictionDate}}
Date of sentencing: {{sentencingDate}}
Charges of conviction: {{chargesConvicted}}
Sentence imposed: {{sentenceImposed}}
Trial type: {{trialType}}
Grounds for appeal: {{primaryGrounds}}
Custody status: {{custodyStatus}}
Bail pending appeal: {{bailPendingAppeal}}

Requirements:
- Draft a concise 2-4 paragraph Notice of Appeal body (not the caption)
- State clearly that the defendant-appellant hereby appeals to the [appropriate appellate court]
- Identify the specific judgment and sentence being appealed with dates
- Note the grounds for appeal in summary form
- If bail pending appeal is requested (where indicated), include a brief paragraph requesting bail
- Use formal legal style; no footnotes or citations required in a notice of appeal
- Do not fabricate case citations`,
    aiInstructions:
      "Draft a formal Notice of Appeal body. Keep it concise — a Notice of Appeal is a threshold pleading, not a brief. It should clearly identify the judgment appealed, the appellate court, and the grounds in summary form. The opening brief will develop the arguments.",
    helpText: "AI will draft the formal notice statement.",
  },
  {
    id: "attorney",
    name: "Attorney Information & Certificate of Service",
    type: "user-input",
    order: 5,
    inputs: attorneyInputs,
    required: true,
    helpText: "Attorney information and parties to be served.",
  },
];

// ─── Jurisdiction variants ────────────────────────────────────────────────────

interface StateAppealData {
  appellateCourtName: string;
  filingDeadline: string;
  rule: string;
  filingFee: string;
  keyNotes: string;
}

const stateAppealData: Record<string, StateAppealData> = {
  AL: {
    appellateCourtName: "Alabama Court of Criminal Appeals",
    filingDeadline: "42 days from sentencing",
    rule: "Ala. R. App. P. 4(b)",
    filingFee: "Check local rules",
    keyNotes: "File in trial court clerk's office. Record preparation governed by Ala. R. App. P. 10.",
  },
  AK: {
    appellateCourtName: "Alaska Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Alaska R. App. P. 204",
    filingFee: "No fee for criminal defendants",
    keyNotes: "Public defenders automatically represent indigent defendants on appeal through the Public Defender Agency or Office of Public Advocacy.",
  },
  AZ: {
    appellateCourtName: "Arizona Court of Appeals",
    filingDeadline: "20 days from sentencing",
    rule: "Ariz. R. Crim. P. 31.2",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in the superior court. Automatic review for death sentences in the Arizona Supreme Court.",
  },
  AR: {
    appellateCourtName: "Arkansas Court of Appeals (or Arkansas Supreme Court for certain offenses)",
    filingDeadline: "30 days from sentencing",
    rule: "Ark. R. App. P.–Crim. 2",
    filingFee: "Check court rules",
    keyNotes: "Life imprisonment and capital cases go directly to the Arkansas Supreme Court.",
  },
  CA: {
    appellateCourtName: "California Court of Appeal",
    filingDeadline: "60 days from sentencing",
    rule: "Cal. Rules of Court, rule 8.308",
    filingFee: "Waived for indigent defendants (Cal. Rules of Court, rule 8.26)",
    keyNotes: "File in the superior court (trial court) clerk's office. Record preparation is governed by Cal. Rules of Court, rules 8.320–8.340. The Sixth Amendment Project or First District Appellate Project may accept appointment.",
  },
  CO: {
    appellateCourtName: "Colorado Court of Appeals",
    filingDeadline: "49 days from sentencing",
    rule: "Colo. App. R. 4(b)",
    filingFee: "Varies; waived for indigents",
    keyNotes: "7-week period. Death sentences go directly to the Colorado Supreme Court.",
  },
  CT: {
    appellateCourtName: "Connecticut Appellate Court",
    filingDeadline: "20 days from sentencing",
    rule: "Conn. Practice Book § 61-1",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases go directly to the Connecticut Supreme Court. File in the trial court clerk's office.",
  },
  DE: {
    appellateCourtName: "Delaware Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "Del. Supr. Ct. R. 6",
    filingFee: "Varies",
    keyNotes: "Delaware has a single appellate court — all criminal appeals go directly to the Supreme Court.",
  },
  DC: {
    appellateCourtName: "District of Columbia Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "D.C. App. R. 4(b)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in the Superior Court clerk's office. Appointment of counsel governed by D.C. Code § 11-2601.",
  },
  FL: {
    appellateCourtName: "Florida District Court of Appeal",
    filingDeadline: "30 days from sentencing",
    rule: "Fla. R. App. P. 9.140(b)(3)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File with the trial court clerk. Capital cases subject to automatic review by the Florida Supreme Court. Fla. R. App. P. 9.140(b)(2) lists non-waivable issues on direct appeal from guilty pleas.",
  },
  GA: {
    appellateCourtName: "Georgia Court of Appeals (or Georgia Supreme Court for murder/constitutional questions)",
    filingDeadline: "30 days from sentencing",
    rule: "Ga. Code Ann. § 5-6-38; Ga. Ct. App. R. 2",
    filingFee: "Varies",
    keyNotes: "Murder cases and cases involving constitutional questions go to the Georgia Supreme Court. File in trial court clerk's office.",
  },
  HI: {
    appellateCourtName: "Hawaii Intermediate Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Haw. R. App. P. 4(b)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in trial court clerk's office. The Hawaii Supreme Court has discretionary review.",
  },
  ID: {
    appellateCourtName: "Idaho Court of Appeals (or Idaho Supreme Court for certain matters)",
    filingDeadline: "42 days from sentencing",
    rule: "Idaho App. R. 14",
    filingFee: "Varies",
    keyNotes: "The Idaho Court of Appeals handles most criminal appeals. The Idaho Supreme Court handles capital cases.",
  },
  IL: {
    appellateCourtName: "Illinois Appellate Court",
    filingDeadline: "30 days from sentencing",
    rule: "Ill. S. Ct. R. 606",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases and constitutional questions may go directly to the Illinois Supreme Court. File in trial court.",
  },
  IN: {
    appellateCourtName: "Indiana Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Ind. App. R. 9",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Murder cases and certain constitutional questions go to the Indiana Supreme Court. File in trial court clerk's office.",
  },
  IA: {
    appellateCourtName: "Iowa Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Iowa R. App. P. 6.101",
    filingFee: "Waived for indigent defendants",
    keyNotes: "The Iowa Supreme Court transfers most criminal appeals to the Court of Appeals.",
  },
  KS: {
    appellateCourtName: "Kansas Court of Appeals",
    filingDeadline: "14 days from sentencing",
    rule: "Kan. Stat. Ann. § 22-3608; Kan. Sup. Ct. R. 2.02",
    filingFee: "Varies",
    keyNotes: "Very short deadline — 14 days. Life sentences may go directly to the Kansas Supreme Court.",
  },
  KY: {
    appellateCourtName: "Kentucky Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Ky. R. App. P. 4",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases and 20-year+ sentences appealed directly to the Kentucky Supreme Court. Ky. RAP 4(A)(a).",
  },
  LA: {
    appellateCourtName: "Louisiana Court of Appeal",
    filingDeadline: "30 days from sentencing",
    rule: "La. Code Crim. Proc. art. 914",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Jurisdiction divided among five circuits by parish. Capital cases go directly to the Louisiana Supreme Court.",
  },
  ME: {
    appellateCourtName: "Maine Supreme Judicial Court (Law Court)",
    filingDeadline: "21 days from sentencing",
    rule: "Me. R. App. P. 2B",
    filingFee: "Varies",
    keyNotes: "Maine has only one appellate court — the Law Court (Supreme Judicial Court sitting as an appellate court).",
  },
  MD: {
    appellateCourtName: "Maryland Appellate Court",
    filingDeadline: "30 days from sentencing",
    rule: "Md. Rule 8-202",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Maryland renamed its Court of Special Appeals to the Appellate Court of Maryland effective 2022. File in trial court clerk's office.",
  },
  MA: {
    appellateCourtName: "Massachusetts Appeals Court",
    filingDeadline: "30 days from sentencing",
    rule: "Mass. R. App. P. 4(b)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Murder cases and first degree cases are appealed directly to the Massachusetts Supreme Judicial Court.",
  },
  MI: {
    appellateCourtName: "Michigan Court of Appeals",
    filingDeadline: "42 days from sentencing",
    rule: "MCR 7.204(A)(2)(a)",
    filingFee: "Varies; waived for indigent defendants",
    keyNotes: "File with the trial court clerk. Michigan has a robust assigned appellate counsel system.",
  },
  MN: {
    appellateCourtName: "Minnesota Court of Appeals",
    filingDeadline: "90 days from sentencing",
    rule: "Minn. R. Crim. P. 28.02",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Very long deadline — 90 days. Dangerous offender and life sentence appeals may go directly to the Minnesota Supreme Court.",
  },
  MS: {
    appellateCourtName: "Mississippi Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Miss. R. App. P. 4(b)",
    filingFee: "Varies",
    keyNotes: "Capital cases go to the Mississippi Supreme Court. File in trial court clerk's office.",
  },
  MO: {
    appellateCourtName: "Missouri Court of Appeals",
    filingDeadline: "10 days from sentencing",
    rule: "Mo. R. Crim. P. 30.01",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Very short deadline — 10 days. File the notice immediately after sentencing.",
  },
  MT: {
    appellateCourtName: "Montana Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "Mont. R. App. P. 5",
    filingFee: "Varies",
    keyNotes: "Montana has a single appellate court — all criminal appeals go to the Montana Supreme Court.",
  },
  NE: {
    appellateCourtName: "Nebraska Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Neb. Rev. Stat. § 29-2308; Neb. Ct. R. App. P. § 2-101",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases go directly to the Nebraska Supreme Court.",
  },
  NV: {
    appellateCourtName: "Nevada Court of Appeals (or Nevada Supreme Court)",
    filingDeadline: "30 days from sentencing",
    rule: "Nev. R. App. P. 4(b)",
    filingFee: "Varies; waived for indigent defendants",
    keyNotes: "Nevada established its Court of Appeals in 2015. Capital cases go to the Nevada Supreme Court.",
  },
  NH: {
    appellateCourtName: "New Hampshire Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "N.H. Sup. Ct. R. 7",
    filingFee: "Varies",
    keyNotes: "New Hampshire has a single appellate court — all criminal appeals go to the Supreme Court.",
  },
  NJ: {
    appellateCourtName: "New Jersey Superior Court, Appellate Division",
    filingDeadline: "45 days from sentencing",
    rule: "N.J. Ct. R. 2:4-1(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File directly with the Appellate Division — do not file in the trial court.",
  },
  NM: {
    appellateCourtName: "New Mexico Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "N.M. R. App. P. 12-201",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases go directly to the New Mexico Supreme Court.",
  },
  NY: {
    appellateCourtName: "New York Appellate Division",
    filingDeadline: "30 days from sentencing",
    rule: "N.Y. CPL § 460.10",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in trial court clerk's office. Jurisdiction depends on which Appellate Division (First through Fourth Departments) covers the county. Capital cases appealed directly to the New York Court of Appeals.",
  },
  NC: {
    appellateCourtName: "North Carolina Court of Appeals",
    filingDeadline: "14 days from sentencing",
    rule: "N.C. R. App. P. 4(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Short deadline — 14 days. Capital cases go directly to the North Carolina Supreme Court. File in trial court.",
  },
  ND: {
    appellateCourtName: "North Dakota Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "N.D. R. App. P. 4(b)",
    filingFee: "Varies",
    keyNotes: "North Dakota has a single appellate court — all criminal appeals go to the Supreme Court.",
  },
  OH: {
    appellateCourtName: "Ohio Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Ohio App. R. 4(B)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Twelve appellate districts. File in trial court clerk's office. Capital cases go directly to the Ohio Supreme Court.",
  },
  OK: {
    appellateCourtName: "Oklahoma Court of Criminal Appeals",
    filingDeadline: "10 days from sentencing",
    rule: "Okla. Ct. Crim. App. R. 1.14",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Very short deadline — 10 days. Oklahoma has a dedicated Court of Criminal Appeals separate from the Civil Court of Appeals.",
  },
  OR: {
    appellateCourtName: "Oregon Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Or. R. App. P. 2.01(1)(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in trial court clerk's office. Oregon Appellate Court Program (appellate public defender) handles indigent criminal appeals.",
  },
  PA: {
    appellateCourtName: "Pennsylvania Superior Court",
    filingDeadline: "30 days from sentencing",
    rule: "Pa. R. App. P. 903(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "File in trial court clerk's office. Pa. R. App. P. 1925 requires a concise statement of errors complained of — file promptly after the notice of appeal.",
  },
  RI: {
    appellateCourtName: "Rhode Island Supreme Court",
    filingDeadline: "20 days from sentencing",
    rule: "R.I. Super. R. Crim. P. 37",
    filingFee: "Varies",
    keyNotes: "Rhode Island has a single appellate court — all criminal appeals go directly to the Supreme Court.",
  },
  SC: {
    appellateCourtName: "South Carolina Court of Appeals",
    filingDeadline: "10 days from sentencing",
    rule: "S.C. App. Ct. R. 203(b)(2)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Very short deadline — 10 days. Capital cases go directly to the South Carolina Supreme Court. File in trial court.",
  },
  SD: {
    appellateCourtName: "South Dakota Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "S.D. Codified Laws § 23A-32-1; S.D. App. R. 6",
    filingFee: "Varies",
    keyNotes: "South Dakota has a single appellate court — all criminal appeals go to the Supreme Court.",
  },
  TN: {
    appellateCourtName: "Tennessee Court of Criminal Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Tenn. R. App. P. 4(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Tennessee has a dedicated Court of Criminal Appeals. Capital cases go directly to the Tennessee Supreme Court.",
  },
  TX: {
    appellateCourtName: "Texas Courts of Appeals (1st–14th Court of Appeals depending on county)",
    filingDeadline: "30 days from sentencing (90 days if motion for new trial filed)",
    rule: "Tex. R. App. P. 26.2",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Death penalty cases go directly to the Texas Court of Criminal Appeals. File in trial court clerk's office.",
  },
  UT: {
    appellateCourtName: "Utah Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Utah R. App. P. 4(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Capital cases and cases involving constitutional questions certified to the Utah Supreme Court.",
  },
  VT: {
    appellateCourtName: "Vermont Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "Vt. R. App. P. 4",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Vermont has a single appellate court — all criminal appeals go to the Supreme Court.",
  },
  VA: {
    appellateCourtName: "Virginia Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Va. Sup. Ct. R. 5A:6",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Virginia established a Court of Appeals for criminal matters in 2022 — all criminal cases now go to the Court of Appeals first. Capital cases go to the Virginia Supreme Court.",
  },
  WA: {
    appellateCourtName: "Washington Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "Wash. RAP 5.2(a)",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Three divisions of the Court of Appeals covering different counties. File in trial court clerk's office.",
  },
  WV: {
    appellateCourtName: "West Virginia Intermediate Court of Appeals",
    filingDeadline: "30 days from sentencing",
    rule: "W.Va. R. App. P. 3",
    filingFee: "Varies",
    keyNotes: "West Virginia created its Intermediate Court of Appeals effective May 2022 for most criminal appeals. Capital cases go to the West Virginia Supreme Court of Appeals.",
  },
  WI: {
    appellateCourtName: "Wisconsin Court of Appeals",
    filingDeadline: "20 days from sentencing",
    rule: "Wis. R. App. P. 809.30",
    filingFee: "Waived for indigent defendants",
    keyNotes: "Counsel must file within 20 days. The Wisconsin State Public Defender's Appellate Division handles indigent criminal appeals.",
  },
  WY: {
    appellateCourtName: "Wyoming Supreme Court",
    filingDeadline: "30 days from sentencing",
    rule: "Wyo. R. App. P. 2.01",
    filingFee: "Varies",
    keyNotes: "Wyoming has a single appellate court — all criminal appeals go to the Supreme Court.",
  },
};

function createStateStandardSection(state: string): TemplateSection {
  const data = stateAppealData[state];
  return {
    id: "jurisdictionStandard",
    name: "Jurisdiction-Specific Appeal Rules",
    type: "static",
    order: 1,
    required: true,
    staticContent: `APPEAL RULES — ${state}

Appellate Court: ${data.appellateCourtName}

Filing Deadline: ${data.filingDeadline}
Rule/Statute: ${data.rule}
Filing Fee: ${data.filingFee}

Important Notes: ${data.keyNotes}

WARNING: Missing the filing deadline forfeits the right to a direct appeal. File immediately if sentencing was recent. Verify the deadline with local court rules.`,
    helpText: `Jurisdiction-specific appeal rules and deadline for ${state}.`,
  };
}

const jurisdictionVariants = Object.entries(stateAppealData).map(([state, data]) => ({
  jurisdiction: state,
  courtType: "state" as const,
  sections: [
    createStateStandardSection(state),
    { ...baseSections[0], order: 2 },
    { ...baseSections[1], order: 3 },
    { ...baseSections[2], order: 4 },
    { ...baseSections[3], order: 5 },
    { ...baseSections[4], order: 6 },
  ],
  courtSpecificRules: `${data.appellateCourtName}. Deadline: ${data.filingDeadline}. Rule: ${data.rule}.`,
}));

// ─── Template export ──────────────────────────────────────────────────────────

export const noticOfAppealCriminalTemplate: DocumentTemplate = {
  id: "notice-of-appeal-criminal",
  name: "Notice of Appeal (State Criminal)",
  category: "criminal",
  description:
    "Initiates a direct appeal of a state criminal conviction or sentence to the appropriate appellate court. This is the threshold pleading that opens the appellate record and triggers all appellate deadlines. Time-sensitive — most states require filing within 10–60 days of sentencing. Missing this deadline forfeits the right to direct appeal. Includes all 50 states + DC with jurisdiction-specific court names, filing deadlines, and procedural notes.",
  version: "1.0.0",
  lastUpdated: new Date("2026-03-10"),
  baseSections,
  jurisdictionVariants,
  estimatedCompletionTime: "15–20 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],
};

export default noticOfAppealCriminalTemplate;
