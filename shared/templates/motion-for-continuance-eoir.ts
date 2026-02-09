/**
 * Motion for Continuance — EOIR Immigration Court Template
 *
 * Request to continue (postpone) a scheduled hearing in immigration court.
 * Governed by 8 C.F.R. § 1003.29 and the EOIR Immigration Court Practice Manual.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionForContinuanceEoirTemplate: DocumentTemplate = {
  id: "motion-for-continuance-eoir",
  name: "Motion for Continuance",
  category: "immigration",
  description:
    "Request a continuance of a scheduled hearing in immigration court. This motion asks the Immigration Judge to postpone a hearing date due to good cause, such as obtaining counsel, preparing the case, awaiting documents, coordinating with pending criminal proceedings, or other legitimate reasons. Governed by 8 C.F.R. § 1003.29 and the EOIR Immigration Court Practice Manual.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "15-20 minutes",
  difficultyLevel: "basic",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    // Section 1: Caption
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

    // Section 2: Filing Information
    {
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Specify the filing method and hearing details.",
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
          id: "nextHearingDate",
          label: "Next Hearing Date",
          type: "date",
          required: true,
          helpText: "Date of the hearing to be continued.",
        },
        {
          id: "nextHearingTime",
          label: "Hearing Time",
          type: "text",
          required: true,
          placeholder: "e.g., 1:00 PM",
        },
        {
          id: "hearingType",
          label: "Hearing Type",
          type: "select",
          required: true,
          helpText: "Type of hearing to be continued.",
          validation: {
            options: [
              { value: "master_calendar", label: "Master Calendar Hearing" },
              { value: "individual_merits", label: "Individual/Merits Hearing" },
              { value: "bond", label: "Bond Hearing" },
              { value: "status", label: "Status Hearing" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          id: "detainedStatus",
          label: "Detained Status",
          type: "select",
          required: true,
          validation: {
            options: [
              { value: "detained", label: "Detained" },
              { value: "released", label: "Released / Non-Detained" },
            ],
          },
        },
      ],
    },

    // Section 3: Continuance Details
    {
      id: "continuanceDetails",
      name: "Continuance Details",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide the reason for the continuance request and supporting details.",
      inputs: [
        {
          id: "continuanceReason",
          label: "Reason for Continuance",
          type: "select",
          required: true,
          helpText: "Select the primary reason for requesting a continuance.",
          validation: {
            options: [
              { value: "obtain_counsel", label: "Obtain Counsel / New Attorney Needed" },
              { value: "prepare_case", label: "Additional Time to Prepare Case" },
              { value: "await_visa_bulletin", label: "Await Visa Bulletin Priority Date" },
              { value: "pending_criminal", label: "Pending Criminal Case Resolution" },
              { value: "obtain_documents", label: "Obtain Documents from Abroad" },
              { value: "obtain_expert", label: "Retain Expert Witness" },
              { value: "pending_application", label: "Pending USCIS Application (I-130, I-140, etc.)" },
              { value: "medical_reasons", label: "Medical Reasons" },
              { value: "interpreter_issues", label: "Interpreter / Language Issues" },
              { value: "dhs_request", label: "Joint Request with DHS" },
              { value: "other", label: "Other Good Cause" },
            ],
          },
        },
        {
          id: "reasonExplanation",
          label: "Explanation of Reason",
          type: "textarea",
          required: true,
          placeholder: "Provide specific facts supporting the need for a continuance...",
          helpText: "Provide specific facts supporting the need for a continuance.",
          validation: {
            minLength: 50,
            maxLength: 2000,
          },
        },
        {
          id: "requestedDate",
          label: "Requested New Date",
          type: "date",
          required: false,
          helpText: "Specific date requested, if known.",
        },
        {
          id: "requestedTimeframe",
          label: "Requested Timeframe",
          type: "text",
          required: false,
          placeholder: "e.g., 60 days, 3 months",
          helpText: "If no specific date, indicate the timeframe needed.",
        },
        {
          id: "priorContinuances",
          label: "Prior Continuances",
          type: "select",
          required: true,
          helpText: "Number of prior continuances granted in this case.",
          validation: {
            options: [
              { value: "0", label: "None (first request)" },
              { value: "1", label: "One prior continuance" },
              { value: "2", label: "Two prior continuances" },
              { value: "3", label: "Three or more prior continuances" },
            ],
          },
        },
        {
          id: "priorContinuanceExplanation",
          label: "Prior Continuance Explanation",
          type: "textarea",
          required: false,
          placeholder: "Explain who requested prior continuances and why...",
          helpText: "If prior continuances, explain who requested and why.",
          validation: {
            maxLength: 500,
          },
        },
      ],
    },

    // Section 4: DHS Position
    {
      id: "dhsPosition",
      name: "DHS Position",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Indicate whether DHS stipulates to or opposes the continuance.",
      inputs: [
        {
          id: "dhsPosition",
          label: "DHS Position on Continuance",
          type: "select",
          required: true,
          helpText: "Has DHS been contacted regarding the continuance request?",
          validation: {
            options: [
              { value: "stipulated", label: "Stipulated (DHS agrees / joint motion)" },
              { value: "opposed", label: "Opposed by DHS" },
              { value: "unknown", label: "Unknown (not yet contacted)" },
              { value: "no_position", label: "DHS takes no position" },
            ],
          },
        },
        {
          id: "dhsPositionExplanation",
          label: "DHS Position Explanation",
          type: "textarea",
          required: false,
          placeholder: "If DHS opposes, explain their stated objection...",
          helpText: "If DHS opposes, explain their stated objection.",
        },
      ],
    },

    // Section 5: Good Cause Statement (AI-generated)
    {
      id: "goodCauseStatement",
      name: "Good Cause Statement",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI generates a persuasive good cause statement based on the facts provided.",
      aiPromptTemplate: `Generate a persuasive good cause statement for an EOIR immigration court Motion for Continuance.

Reason for continuance: {{continuanceReason}}
Detailed explanation: {{reasonExplanation}}
Prior continuances: {{priorContinuances}}
Detained status: {{detainedStatus}}
DHS position: {{dhsPosition}}
Hearing type: {{hearingType}}
Proceeding type: {{proceedingType}}

Requirements:
- Cite 8 C.F.R. § 1003.29 (IJ authority to grant continuances for good cause)
- Reference the Immigration Court Practice Manual (ICPM) Chapter 4.15
- If detained, note that the case should not be delayed unnecessarily but that due process requires adequate preparation time
- If DHS stipulates, note the joint agreement and that both parties believe a continuance serves the interests of justice
- If the reason is to obtain counsel, cite Matter of C-B-, 25 I&N Dec. 888 (BIA 2012) regarding the right to counsel at no expense to the Government
- Address the number of prior continuances and explain why an additional continuance is warranted
- Use formal immigration court pleading language
- Structure as a cohesive legal argument demonstrating good cause`,
      aiInstructions: "Generate a persuasive good cause statement for an EOIR immigration court continuance. Cite 8 C.F.R. § 1003.29 (IJ authority to grant continuances for good cause). Reference the Immigration Court Practice Manual (ICPM) Chapter 4.15. If detained, note that the case should not be delayed unnecessarily but that due process requires adequate preparation time. If DHS stipulates, note the joint agreement. If this is to obtain counsel, cite Matter of C-B-, 25 I&N Dec. 888 (BIA 2012) regarding the right to counsel. Use formal immigration court pleading language.",
    },

    // Section 6: Legal Standard (AI-generated)
    {
      id: "legalStandard",
      name: "Legal Standard",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "AI generates the applicable legal standard for the continuance request.",
      aiPromptTemplate: `Generate the legal standard section for an EOIR immigration court Motion for Continuance.

Jurisdiction: EOIR
Reason for continuance: {{continuanceReason}}
Detained status: {{detainedStatus}}
Prior continuances: {{priorContinuances}}
DHS position: {{dhsPosition}}

Requirements:
- Cite 8 C.F.R. § 1003.29 (IJ discretion to grant continuances for good cause shown)
- Cite INA § 240(b)(1) (right to reasonable adjournment)
- Cite Matter of Hashmi, 24 I&N Dec. 785 (BIA 2009) (factors for evaluating continuance requests)
- Reference ICPM Chapter 4.15 (procedural requirements for continuance motions)
- If the reason is to obtain counsel, cite INA § 240(b)(4)(A) and Matter of C-B-, 25 I&N Dec. 888 (BIA 2012)
- Apply the good cause standard to the specific facts of this case
- Address the detained vs. non-detained context and any heightened considerations
- Discuss the balance between efficiency and due process
- Use formal legal citation format`,
      aiInstructions: "Generate the legal standard section citing: 8 C.F.R. § 1003.29 (IJ discretion for good cause), INA § 240(b)(1) (right to reasonable adjournment), Matter of Hashmi, 24 I&N Dec. 785 (BIA 2009) (factors for continuance), ICPM Chapter 4.15 (procedural requirements). If the reason is to obtain counsel, cite INA § 240(b)(4)(A) and Matter of C-B-. Apply the good cause standard to the specific facts. Address the detained/non-detained context.",
    },

    // Section 7: Prayer for Relief (Static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 7,
      required: true,
      staticContent:
        "WHEREFORE, the Respondent respectfully requests that the Immigration Judge grant this Motion for Continuance and:\n\n1. Continue the {{hearingType}} hearing currently scheduled for {{nextHearingDate}} at {{nextHearingTime}};\n\n2. Set a new hearing date at the Court's earliest convenience that allows sufficient time for the reasons set forth herein;\n\n3. Grant such other and further relief as the Court deems just and appropriate.",
    },

    // Section 8: Attorney Signature
    {
      id: "signatureBlock",
      name: "Attorney Signature",
      type: "user-input",
      order: 8,
      required: true,
      helpText: "Attorney signature block. ECAS filings may use conformed /S/ signatures.",
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "text",
          required: true,
          placeholder: "Full legal name",
        },
        {
          id: "firmName",
          label: "Law Firm / Organization",
          type: "text",
          required: false,
          placeholder: "Firm or organization name",
        },
        {
          id: "address",
          label: "Mailing Address",
          type: "textarea",
          required: true,
          placeholder: "Street address\nCity, State ZIP",
        },
        {
          id: "phone",
          label: "Telephone",
          type: "text",
          required: true,
          placeholder: "(555) 123-4567",
        },
        {
          id: "email",
          label: "Email Address",
          type: "text",
          required: true,
          placeholder: "attorney@example.com",
        },
        {
          id: "barNumber",
          label: "State Bar Number",
          type: "text",
          required: false,
          placeholder: "Bar number",
        },
        {
          id: "eoirId",
          label: "EOIR ID Number",
          type: "text",
          required: false,
          placeholder: "EOIR registration number",
        },
      ],
    },

    // Section 9: Proof of Service (AI-generated)
    {
      id: "proofOfService",
      name: "Proof of Service",
      type: "ai-generated",
      order: 9,
      required: true,
      helpText: "AI generates the appropriate proof of service based on filing method.",
      aiPromptTemplate: `Generate a Proof of Service / Certificate of Service for an immigration court filing.

Filing method: {{filingMethod}}

Requirements:
- Opposing party is "DHS Chief Counsel" (never "District Attorney" or "AUSA")
- If filing method is "ecas": Note that service was accomplished automatically via the ECAS electronic filing system per EOIR policy. Include standard ECAS auto-service attestation.
- If filing method is "paper": Generate a traditional certificate of service with blank fields for date, method (USPS first-class mail, hand delivery, or courier), and declarant signature line.
- Include declarant statement that they are over 18 and not a party to the action
- Use formal legal language`,
      aiInstructions: "Generate proof of service appropriate for immigration court filing. Service is upon DHS Chief Counsel.",
    },
  ],
};

export default motionForContinuanceEoirTemplate;
