/**
 * Motion for Stay of Removal — EOIR / BIA Immigration Template
 *
 * Request to stay (halt) the execution of a removal order while an appeal,
 * Motion to Reopen, or Motion to Reconsider is pending. Filed with the
 * Immigration Judge (IJ) or Board of Immigration Appeals (BIA).
 *
 * Governed by INA § 240(b)(5)(C), 8 C.F.R. § 1003.6 (IJ stay),
 * 8 C.F.R. § 1003.23(b)(1) (stay pending MTR/MTC),
 * 8 C.F.R. § 1003.6(a) (BIA stay), and the EOIR Immigration Court
 * Practice Manual, Chapter 9.3.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionForStayOfRemovalEoirTemplate: DocumentTemplate = {
  id: "motion-for-stay-of-removal-eoir",
  name: "Motion for Stay of Removal",
  category: "immigration",
  description:
    "Request to stay (halt) execution of a removal order while an appeal, Motion to Reopen, or Motion to Reconsider is pending. Filed with the Immigration Judge or Board of Immigration Appeals. The court applies a four-factor test: (1) likelihood of success on the merits, (2) irreparable harm absent a stay, (3) balance of hardships, and (4) public interest. Governed by 8 C.F.R. § 1003.6, INA § 240(b)(5)(C), and the EOIR Immigration Court Practice Manual, Chapter 9.3. Critical protective filing — without a stay, the respondent may be removed before the underlying motion or appeal is decided.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 1,
      required: true,
      helpText: "Enter the immigration court and case information for the caption.",
      inputs: [
        {
          id: "immigrationCourt",
          label: "Immigration Court",
          type: "select",
          required: true,
          helpText: "Select the EOIR immigration court where the case is pending.",
          validation: {
            options: IMMIGRATION_COURTS,
          },
        },
        {
          id: "immigrationCourtOther",
          label: "Other Immigration Court Name",
          type: "text",
          required: false,
          placeholder: "Enter court name if not listed above",
          helpText: "Specify the court name if you selected 'Other'.",
        },
        {
          id: "respondentName",
          label: "Respondent Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name of respondent",
          helpText: "The individual in removal proceedings (not 'Defendant').",
        },
        {
          id: "aNumber",
          label: "A-Number",
          type: "a-number",
          required: true,
          placeholder: "XXX-XXX-XXX",
          helpText: "The respondent's Alien Registration Number assigned by DHS.",
          validation: {
            pattern: "^\\d{3}-?\\d{3}-?\\d{3}$",
          },
        },
        {
          id: "proceedingType",
          label: "Proceeding Type",
          type: "select",
          required: true,
          helpText: "Type of immigration proceeding.",
          validation: {
            options: PROCEEDING_TYPES,
          },
        },
      ],
    },

    {
      id: "removalOrderInfo",
      name: "Removal Order Details",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Provide information about the removal order and the underlying case.",
      inputs: [
        {
          id: "filingMethod",
          label: "Filing Method",
          type: "select",
          required: true,
          helpText: "ECAS e-filing is mandatory for attorneys. Paper filing may be used where ECAS is unavailable.",
          validation: {
            options: FILING_METHODS,
          },
        },
        {
          id: "removalOrderDate",
          label: "Date of Removal Order",
          type: "date",
          required: true,
          helpText: "The date the immigration judge or BIA issued the final order of removal.",
        },
        {
          id: "issuingAuthority",
          label: "Order Issued By",
          type: "select",
          required: true,
          helpText: "Which tribunal issued the removal order.",
          validation: {
            options: [
              { value: "ij", label: "Immigration Judge (IJ)" },
              { value: "bia", label: "Board of Immigration Appeals (BIA)" },
              { value: "in_absentia", label: "Immigration Judge — In Absentia Order" },
            ],
          },
        },
        {
          id: "underlyingRelief",
          label: "Relief Sought in Underlying Proceedings",
          type: "select",
          required: true,
          helpText: "The form of relief the respondent sought or is seeking.",
          validation: {
            options: [
              { value: "asylum", label: "Asylum (INA § 208)" },
              { value: "withholding", label: "Withholding of Removal (INA § 241(b)(3))" },
              { value: "cat", label: "Convention Against Torture (CAT) Protection" },
              { value: "cancellation_nr", label: "Cancellation of Removal — Non-LPR (INA § 240A(b))" },
              { value: "cancellation_lpr", label: "Cancellation of Removal — LPR (INA § 240A(a))" },
              { value: "adjustment", label: "Adjustment of Status (INA § 245)" },
              { value: "vawa", label: "VAWA Self-Petition / Cancellation" },
              { value: "voluntary_departure", label: "Voluntary Departure (INA § 240B)" },
              { value: "other", label: "Other Relief" },
            ],
          },
        },
        {
          id: "underlyingReliefOther",
          label: "Other Relief Description",
          type: "text",
          required: false,
          placeholder: "Describe the relief sought if 'Other' selected",
          helpText: "Describe the specific relief if not listed above.",
        },
      ],
    },

    {
      id: "pendingMotionInfo",
      name: "Pending Motion / Appeal",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide details about the pending appeal, Motion to Reopen, or Motion to Reconsider that forms the basis for requesting the stay.",
      inputs: [
        {
          id: "basisForStay",
          label: "Basis for Stay",
          type: "select",
          required: true,
          helpText: "The pending action that forms the legal basis for requesting a stay of removal.",
          validation: {
            options: [
              { value: "appeal_bia", label: "Appeal to the BIA (under 8 C.F.R. § 1003.38)" },
              { value: "mtr", label: "Motion to Reopen (8 C.F.R. § 1003.23(b)(1))" },
              { value: "mtc", label: "Motion to Reconsider (8 C.F.R. § 1003.23(b)(1))" },
              { value: "mtr_sua_sponte", label: "Motion to Reopen — Sua Sponte (8 C.F.R. § 1003.23(b)(1))" },
              { value: "petition_review", label: "Petition for Review (Circuit Court)" },
              { value: "habeas", label: "Habeas Corpus Petition" },
              { value: "other", label: "Other Pending Action" },
            ],
          },
        },
        {
          id: "pendingActionFilingDate",
          label: "Filing Date of Pending Motion / Appeal",
          type: "date",
          required: true,
          helpText: "The date the underlying motion or appeal was filed.",
        },
        {
          id: "pendingActionSummary",
          label: "Summary of Pending Motion / Appeal",
          type: "textarea",
          required: true,
          placeholder: "Briefly describe the pending motion or appeal and its key arguments...",
          helpText: "Summarize the pending action, including its main legal arguments and the relief requested.",
          validation: {
            minLength: 50,
            maxLength: 3000,
          },
        },
        {
          id: "scheduledRemovalDate",
          label: "Scheduled Removal Date (if known)",
          type: "date",
          required: false,
          helpText: "If ICE has scheduled a removal date, enter it here. This establishes urgency.",
        },
        {
          id: "iceDetentionStatus",
          label: "Detention Status",
          type: "select",
          required: true,
          helpText: "The respondent's current custody status.",
          validation: {
            options: [
              { value: "detained", label: "Currently Detained by ICE" },
              { value: "released_bond", label: "Released on Bond" },
              { value: "released_osup", label: "Released on Order of Supervision (OSUP)" },
              { value: "released_own", label: "Released on Own Recognizance" },
              { value: "ankle_monitor", label: "Released with GPS / Ankle Monitor" },
              { value: "never_detained", label: "Never Detained" },
            ],
          },
        },
      ],
    },

    {
      id: "stayFactors",
      name: "Four-Factor Stay Analysis",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Address each of the four factors the court considers when evaluating a stay request: (1) likelihood of success, (2) irreparable harm, (3) balance of hardships, and (4) public interest.",
      inputs: [
        {
          id: "likelihoodOfSuccess",
          label: "Likelihood of Success on the Merits",
          type: "textarea",
          required: true,
          placeholder: "Explain why the underlying appeal or motion is likely to succeed...",
          helpText: "Describe the strength of the merits of the pending motion or appeal. Identify legal errors by the IJ or BIA, new evidence, or changed country conditions that support the respondent's case.",
          validation: {
            minLength: 100,
            maxLength: 4000,
          },
        },
        {
          id: "irreparableHarm",
          label: "Irreparable Harm if Removed",
          type: "textarea",
          required: true,
          placeholder: "Describe the harm the respondent would face if removed before the motion/appeal is decided...",
          helpText: "Describe the specific, concrete, and irreparable harm the respondent would suffer if removed. This may include persecution, torture, family separation, loss of legal remedies, or danger to life or safety.",
          validation: {
            minLength: 100,
            maxLength: 4000,
          },
        },
        {
          id: "balanceOfHardships",
          label: "Balance of Hardships",
          type: "textarea",
          required: true,
          placeholder: "Explain why the hardship to the respondent outweighs any harm to the government...",
          helpText: "Compare the hardship to the respondent if removed against any harm to the government from granting the stay. Generally, the government suffers minimal harm from a temporary stay while the respondent may suffer severe and irreversible consequences.",
          validation: {
            minLength: 50,
            maxLength: 3000,
          },
        },
        {
          id: "publicInterest",
          label: "Public Interest",
          type: "textarea",
          required: true,
          placeholder: "Explain how granting the stay serves the public interest...",
          helpText: "Address how the public interest is served by granting the stay. The public has an interest in the fair and orderly administration of immigration law, ensuring that meritorious claims are heard, and preventing the removal of individuals who may be entitled to relief.",
          validation: {
            minLength: 50,
            maxLength: 2000,
          },
        },
        {
          id: "countryConditions",
          label: "Country Conditions (if applicable)",
          type: "textarea",
          required: false,
          placeholder: "Describe relevant country conditions in the respondent's home country...",
          helpText: "If the respondent faces danger in the home country, describe current country conditions supported by State Department reports, human rights organization reports, or other credible sources.",
          validation: {
            maxLength: 3000,
          },
        },
      ],
    },

    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 5,
      required: true,
      aiPromptTemplate: `Generate a legal argument for a motion for stay of removal in immigration proceedings.

Immigration Court: {{immigrationCourt}}
Respondent Name: the respondent
A-Number: [REDACTED]
Removal Order Date: {{removalOrderDate}}
Order Issued By: {{issuingAuthority}}
Relief Sought: {{underlyingRelief}}
Basis for Stay: {{basisForStay}}
Pending Action Filed: {{pendingActionFilingDate}}
Summary of Pending Action: {{pendingActionSummary}}
Scheduled Removal Date: {{scheduledRemovalDate}}
Detention Status: {{iceDetentionStatus}}

Four-Factor Analysis:
Likelihood of Success: {{likelihoodOfSuccess}}
Irreparable Harm: {{irreparableHarm}}
Balance of Hardships: {{balanceOfHardships}}
Public Interest: {{publicInterest}}
Country Conditions: {{countryConditions}}

Requirements:
- Generate 5-7 paragraphs applying the four-factor stay analysis:
  1. Introduction citing 8 C.F.R. § 1003.6 and the applicable standard
  2. Likelihood of success on the merits — analyze the strength of the underlying claim
  3. Irreparable harm — emphasize concrete, specific, and irreparable harm if removed
  4. Balance of hardships — weigh harm to respondent vs. any prejudice to the government
  5. Public interest — fair administration of justice, preventing wrongful removal
  6. If applicable, address urgency based on scheduled removal date
  7. Conclusion requesting the stay
- Cite applicable statutes: INA § 240(b)(5)(C), 8 C.F.R. § 1003.6
- Cite relevant BIA and circuit court precedent on stays
- Address Nken v. Holder, 556 U.S. 418 (2009) (Supreme Court stay standard)
- Use formal legal writing style
- Do not fabricate case citations`,
      aiInstructions: "Draft a formal legal argument for a motion for stay of removal. Apply the four-factor test from Nken v. Holder, 556 U.S. 418 (2009): (1) likelihood of success on the merits, (2) irreparable injury absent a stay, (3) balance of equities, and (4) public interest. Cite 8 C.F.R. § 1003.6 (stay authority) and relevant BIA precedent including Matter of Gutierrez, 19 I&N Dec. 562 (BIA 1988). For asylum/withholding/CAT cases, emphasize the risk of persecution or torture and the impossibility of undoing removal. Address the urgency if a removal date is imminent. Use formal legal writing style. Do not fabricate case citations.",
      helpText: "AI will draft the legal argument applying the four-factor stay analysis.",
    },

    {
      id: "reliefRequested",
      name: "Relief Requested",
      type: "user-input",
      order: 6,
      required: true,
      helpText: "Specify the precise relief requested from the court.",
      inputs: [
        {
          id: "stayScope",
          label: "Scope of Stay Requested",
          type: "select",
          required: true,
          helpText: "Specify the scope of the stay being requested.",
          validation: {
            options: [
              { value: "pending_appeal", label: "Stay pending appeal to the BIA" },
              { value: "pending_mtr", label: "Stay pending decision on Motion to Reopen" },
              { value: "pending_mtc", label: "Stay pending decision on Motion to Reconsider" },
              { value: "pending_petition", label: "Stay pending Petition for Review in Circuit Court" },
              { value: "pending_all", label: "Stay pending resolution of all pending motions/appeals" },
            ],
          },
        },
        {
          id: "emergencyRequest",
          label: "Emergency / Expedited Request",
          type: "select",
          required: true,
          helpText: "Indicate whether this is an emergency request requiring expedited consideration.",
          validation: {
            options: [
              { value: "emergency", label: "Emergency — Removal imminent (within 72 hours)" },
              { value: "expedited", label: "Expedited — Removal scheduled (within 30 days)" },
              { value: "standard", label: "Standard — No imminent removal date" },
            ],
          },
        },
        {
          id: "additionalReliefNotes",
          label: "Additional Notes on Relief",
          type: "textarea",
          required: false,
          placeholder: "Any additional information about the relief requested...",
          helpText: "Include any additional information relevant to the stay request, such as a request for oral argument or a temporary restraining order.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    {
      id: "serviceInfo",
      name: "Certificate of Service",
      type: "user-input",
      order: 7,
      required: true,
      helpText: "Provide service information. A copy must be served on the DHS Chief Counsel (ICE Office of the Principal Legal Advisor).",
      inputs: [
        {
          id: "dhsCounselOffice",
          label: "DHS/ICE Chief Counsel Office",
          type: "text",
          required: true,
          placeholder: "e.g., Office of the Chief Counsel, ICE, 26 Federal Plaza, New York, NY",
          helpText: "The DHS/ICE Chief Counsel office where service will be made.",
        },
        {
          id: "serviceMethod",
          label: "Method of Service on DHS",
          type: "select",
          required: true,
          helpText: "How the motion will be served on DHS counsel.",
          validation: {
            options: [
              { value: "ecas", label: "ECAS Electronic Service" },
              { value: "personal", label: "Personal Service / Hand Delivery" },
              { value: "mail", label: "U.S. Mail" },
              { value: "overnight", label: "Overnight Delivery Service" },
            ],
          },
        },
      ],
    },
  ],

  jurisdictionVariants: [],
};

export default motionForStayOfRemovalEoirTemplate;
