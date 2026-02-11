/**
 * Motion to Reconsider — EOIR Immigration Court Template
 *
 * Request for the immigration judge to reconsider a prior decision based on errors of
 * law or fact in the original decision. Distinguished from a Motion to Reopen, which
 * is based on new evidence or changed circumstances.
 * Governed by INA § 240(c)(6), 8 C.F.R. § 1003.23(b)(1), and the EOIR Immigration
 * Court Practice Manual, Chapter 5.8.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionToReconsiderEoirTemplate: DocumentTemplate = {
  id: "motion-to-reconsider-eoir",
  name: "Motion to Reconsider",
  category: "immigration",
  description:
    "Request for the immigration judge to reconsider a prior decision based on errors of law or fact. Unlike a Motion to Reopen (based on new evidence), a Motion to Reconsider argues the court made a legal or factual error in the original decision. Filed pursuant to INA § 240(c)(6), 8 C.F.R. § 1003.23(b)(1), and the EOIR Immigration Court Practice Manual, Chapter 5.8. Must be filed within 30 days of the decision. Limited to one motion per proceeding (with exceptions).",
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
          helpText: "Select the EOIR immigration court where the decision was issued.",
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
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Provide filing details and information about the decision being challenged.",
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
          id: "dateOfDecision",
          label: "Date of Decision",
          type: "date",
          required: true,
          helpText: "Date of the decision you are seeking to have reconsidered.",
        },
        {
          id: "typeOfDecision",
          label: "Type of Decision",
          type: "select",
          required: true,
          helpText: "Select the type of decision being challenged.",
          validation: {
            options: [
              { value: "removal_order", label: "Order of Removal After Merits Hearing" },
              { value: "denial_asylum", label: "Denial of Asylum Application" },
              { value: "denial_withholding", label: "Denial of Withholding of Removal" },
              { value: "denial_cat", label: "Denial of CAT Protection" },
              { value: "denial_cancellation", label: "Denial of Cancellation of Removal" },
              { value: "denial_adjustment", label: "Denial of Adjustment of Status" },
              { value: "denial_voluntary_departure", label: "Denial of Voluntary Departure" },
              { value: "bond_denial", label: "Denial or Setting of Bond" },
              { value: "denial_continuance", label: "Denial of Continuance" },
              { value: "denial_motion", label: "Denial of Other Motion" },
              { value: "other", label: "Other Decision" },
            ],
          },
        },
        {
          id: "daysSinceDecision",
          label: "Days Since Decision",
          type: "text",
          required: false,
          placeholder: "e.g., 15",
          helpText: "Number of days since the decision was issued. Must be within 30 days.",
        },
        {
          id: "deadlineCompliance",
          label: "Filing Deadline Status",
          type: "select",
          required: true,
          helpText: "Motions to reconsider must be filed within 30 days of the decision. 8 C.F.R. § 1003.23(b)(1).",
          validation: {
            options: [
              { value: "within_30_days", label: "Within 30-Day Filing Deadline" },
              { value: "deadline_today", label: "Filing on Deadline Day (30th Day)" },
              { value: "equitable_tolling", label: "Beyond 30 Days — Requesting Equitable Tolling" },
              { value: "sua_sponte", label: "Requesting Sua Sponte Reconsideration" },
            ],
          },
        },
      ],
    },

    {
      id: "basisForReconsideration",
      name: "Basis for Reconsideration",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Identify the specific errors of law or fact in the original decision.",
      inputs: [
        {
          id: "errorType",
          label: "Type of Error",
          type: "select",
          required: true,
          helpText: "Select the primary type of error in the original decision.",
          validation: {
            options: [
              { value: "error_of_law", label: "Error of Law — Misapplication of Legal Standard" },
              { value: "error_of_fact", label: "Error of Fact — Clearly Erroneous Factual Finding" },
              { value: "both", label: "Both Errors of Law and Fact" },
              { value: "overlooked_evidence", label: "Court Overlooked Material Evidence in the Record" },
              { value: "mischaracterized_testimony", label: "Court Mischaracterized Testimony or Evidence" },
              { value: "wrong_legal_standard", label: "Court Applied Wrong Legal Standard" },
              { value: "changed_law", label: "Intervening Change in Law Since Decision" },
              { value: "due_process", label: "Due Process Violation in Proceedings" },
            ],
          },
        },
        {
          id: "errorDescription",
          label: "Detailed Description of Error(s)",
          type: "textarea",
          required: true,
          placeholder: "Identify the specific errors of law or fact in the immigration judge's decision...",
          helpText: "Specify exactly what the court got wrong — cite specific findings, legal standards, or evidence that was overlooked or misapplied.",
          validation: {
            minLength: 100,
            maxLength: 5000,
          },
        },
        {
          id: "correctAnalysis",
          label: "Correct Legal Analysis",
          type: "textarea",
          required: true,
          placeholder: "Explain what the correct legal analysis should be and how it changes the outcome...",
          helpText: "Describe the correct application of law or the accurate factual findings, and explain why the outcome should be different.",
          validation: {
            minLength: 100,
            maxLength: 5000,
          },
        },
        {
          id: "recordCitations",
          label: "Record Citations",
          type: "textarea",
          required: false,
          placeholder: "Cite specific portions of the record that support your arguments (transcript pages, exhibits, etc.)...",
          helpText: "Reference specific transcript pages, exhibits, or documents in the record that the court overlooked or misapplied.",
          validation: {
            maxLength: 3000,
          },
        },
        {
          id: "priorMotionsToReconsider",
          label: "Prior Motions to Reconsider",
          type: "select",
          required: true,
          helpText: "Indicate whether any prior motions to reconsider have been filed. Generally limited to one per proceeding under INA § 240(c)(6).",
          validation: {
            options: [
              { value: "none", label: "None — This Is the First Motion" },
              { value: "one_denied", label: "One Prior Motion — Denied" },
              { value: "exception_applies", label: "Prior Motion Filed — Exception to Numerical Limit Applies" },
            ],
          },
        },
        {
          id: "priorMotionDetails",
          label: "Prior Motion Details",
          type: "textarea",
          required: false,
          placeholder: "If a prior motion to reconsider was filed, explain the circumstances and any applicable exception...",
          helpText: "Provide details about any prior motion to reconsider and why this motion should be considered.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    {
      id: "reliefSought",
      name: "Relief Sought",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Specify the relief being sought if the motion is granted.",
      inputs: [
        {
          id: "reliefSought",
          label: "Relief Sought",
          type: "select",
          required: true,
          helpText: "Select the outcome you are seeking from reconsideration.",
          validation: {
            options: [
              { value: "grant_application", label: "Grant the Underlying Application for Relief" },
              { value: "remand_hearing", label: "Remand for Additional Hearing" },
              { value: "correct_order", label: "Correct/Modify the Existing Order" },
              { value: "vacate_order", label: "Vacate the Order Entirely" },
              { value: "grant_bond", label: "Grant Bond or Reduce Bond Amount" },
              { value: "grant_continuance", label: "Grant Previously Denied Continuance" },
              { value: "other", label: "Other Relief" },
            ],
          },
        },
        {
          id: "reliefExplanation",
          label: "Relief Explanation",
          type: "textarea",
          required: true,
          placeholder: "Explain the specific relief you are seeking and why it is appropriate...",
          helpText: "Explain the specific relief being requested and why the corrected analysis supports it.",
          validation: {
            minLength: 50,
            maxLength: 3000,
          },
        },
        {
          id: "dhsPosition",
          label: "DHS Position",
          type: "select",
          required: true,
          helpText: "Indicate DHS's position on the motion to reconsider.",
          validation: {
            options: [
              { value: "agrees", label: "DHS Agrees" },
              { value: "opposes", label: "DHS Opposes" },
              { value: "no_position", label: "DHS Has No Position" },
              { value: "not_contacted", label: "DHS Not Contacted" },
              { value: "pending_response", label: "Awaiting Response" },
            ],
          },
        },
        {
          id: "dhsPositionDetails",
          label: "DHS Position Details",
          type: "textarea",
          required: false,
          placeholder: "Additional details about DHS position or communications...",
          helpText: "Additional details about DHS position or communications.",
          validation: {
            maxLength: 1000,
          },
        },
        {
          id: "stayRequested",
          label: "Stay of Removal Requested",
          type: "select",
          required: true,
          helpText: "Indicate whether you are requesting a stay of removal pending adjudication of this motion.",
          validation: {
            options: [
              { value: "yes", label: "Yes — Stay of Removal Requested" },
              { value: "no", label: "No — Stay Not Requested" },
              { value: "already_stayed", label: "Removal Already Stayed" },
            ],
          },
        },
      ],
    },

    {
      id: "statementOfFacts",
      name: "Statement of Facts",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI generates a factual narrative based on the information provided.",
      aiPromptTemplate: `Generate a statement of facts for an EOIR immigration court Motion to Reconsider.

Immigration court: {{immigrationCourt}}
Type of decision: {{typeOfDecision}}
Date of decision: {{dateOfDecision}}
Type of error: {{errorType}}
Error description: {{errorDescription}}
Correct legal analysis: {{correctAnalysis}}
Record citations: {{recordCitations}}
Days since decision: {{daysSinceDecision}}
Filing deadline status: {{deadlineCompliance}}
Respondent name: the Respondent

Requirements:
- Generate 3-4 paragraphs describing:
  1. Procedural history: how the case arrived at the decision being challenged
  2. Summary of the immigration judge's decision and key findings
  3. Identification of the specific errors in the decision
  4. Timeliness of the motion and compliance with the 30-day deadline
- Use formal immigration court pleading language
- Refer to the individual as "the Respondent" throughout
- Reference specific dates, orders, and proceedings
- State the factual basis without legal argument`,
      aiInstructions: "Use EOIR terminology. Say 'Respondent' not 'Defendant'. Say 'DHS' not 'Plaintiff'. Reference INA and 8 C.F.R. citations. Generate factual narrative only, no legal argument. Distinguish this from a Motion to Reopen — this motion is about errors in the decision, not new evidence.",
    },

    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "AI generates the legal argument supporting the motion to reconsider.",
      aiPromptTemplate: `Generate the legal argument section for an EOIR immigration court Motion to Reconsider.

Immigration court: {{immigrationCourt}}
Type of decision: {{typeOfDecision}}
Date of decision: {{dateOfDecision}}
Type of error: {{errorType}}
Error description: {{errorDescription}}
Correct legal analysis: {{correctAnalysis}}
Record citations: {{recordCitations}}
Relief sought: {{reliefSought}}
Relief explanation: {{reliefExplanation}}
DHS position: {{dhsPosition}}
DHS position details: {{dhsPositionDetails}}
Days since decision: {{daysSinceDecision}}
Filing deadline status: {{deadlineCompliance}}
Stay requested: {{stayRequested}}
Prior motions to reconsider: {{priorMotionsToReconsider}}
Respondent name: the Respondent

Requirements:
- Generate 4-6 paragraphs arguing:
  1. The standard for reconsideration under INA § 240(c)(6) and 8 C.F.R. § 1003.23(b)(1)
  2. Timeliness of the motion (filed within the 30-day deadline)
  3. The specific error(s) of law or fact identified in the decision
  4. The correct legal analysis and how it changes the outcome
  5. Why the requested relief should be granted upon reconsideration
  6. If a stay is requested, why it should be granted pending adjudication
- Cite applicable statutes, regulations, and BIA precedent decisions:
  - INA § 240(c)(6), 8 C.F.R. § 1003.23(b)(1)
  - Matter of O-S-G-, 24 I&N Dec. 56 (BIA 2006)
  - Matter of Cerna, 20 I&N Dec. 399 (BIA 1991)
  - INA § 240(b)(5)(C) for automatic stay considerations
- Distinguish from a Motion to Reopen: this motion identifies errors in the existing record, not new evidence
- Address the numerical limitation (one motion to reconsider) and compliance
- If DHS agrees, emphasize the joint nature of the request`,
      aiInstructions: "Cite INA sections, 8 C.F.R. regulations, and BIA precedent decisions. Use proper EOIR terminology. Say 'Respondent' not 'Defendant'. Say 'DHS' not 'Plaintiff'. Clearly distinguish reconsideration (error correction) from reopening (new evidence). Do not fabricate case citations.",
    },

    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 7,
      required: true,
      helpText: "Standard prayer for relief in a motion to reconsider.",
      staticContent: `WHEREFORE, Respondent respectfully requests that this Honorable Immigration Court:

1. Reconsider its decision dated [date of decision] and correct the errors of law and/or fact identified herein;

2. Upon reconsideration, grant Respondent's application for [relief sought] or, in the alternative, remand the matter for further proceedings consistent with the correct legal standards;

3. Stay the execution of the removal order pending adjudication of this motion, if applicable;

4. In the alternative, if the Court finds that reconsideration is not warranted, grant the Respondent leave to file a motion to reopen should new evidence or changed circumstances arise;

5. Grant such other and further relief as the Immigration Judge deems just and proper.`,
    },

    {
      id: "attorneyDeclaration",
      name: "Attorney Declaration & Service",
      type: "user-input",
      order: 8,
      required: true,
      helpText: "Provide attorney information for the declaration and signature block.",
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "text",
          required: true,
          placeholder: "Full name of attorney",
          helpText: "Full name of the filing attorney.",
        },
        {
          id: "firmName",
          label: "Firm Name",
          type: "text",
          required: false,
          placeholder: "Law firm name",
          helpText: "Name of the law firm, if applicable.",
        },
        {
          id: "address",
          label: "Address",
          type: "textarea",
          required: true,
          placeholder: "Attorney or firm address",
          helpText: "Attorney or firm mailing address.",
          validation: {
            maxLength: 200,
          },
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "text",
          required: true,
          placeholder: "Phone number",
          helpText: "Attorney phone number.",
        },
        {
          id: "email",
          label: "Email Address",
          type: "text",
          required: true,
          placeholder: "Email address",
          helpText: "Attorney email address.",
        },
        {
          id: "eoir_id",
          label: "EOIR Attorney ID Number",
          type: "text",
          required: false,
          placeholder: "EOIR ID",
          helpText: "EOIR Attorney ID Number.",
        },
      ],
    },

    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 9,
      required: true,
      helpText: "Standard certificate of service for EOIR filings.",
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, a copy of the foregoing MOTION TO RECONSIDER was served upon the following parties:

Office of the Chief Counsel
U.S. Department of Homeland Security
Immigration and Customs Enforcement

By:
[ ] EOIR Court Portal (ECAS)
[ ] Hand delivery
[ ] U.S. Mail, first class, postage prepaid

Dated: _______________

____________________________
[Attorney Name]
[EOIR ID]`,
    },
  ],
};

export default motionToReconsiderEoirTemplate;
