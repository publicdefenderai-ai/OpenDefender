/**
 * Motion to Reopen — EOIR Immigration Court Template
 *
 * Request to reopen immigration proceedings that have been completed through a final order.
 * Governed by INA § 240(c)(7), 8 C.F.R. § 1003.23, and the EOIR Immigration Court Practice Manual, Chapter 5.7.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionToReopenEoirTemplate: DocumentTemplate = {
  id: "motion-to-reopen-eoir",
  name: "Motion to Reopen",
  category: "immigration",
  description:
    "Request to reopen immigration proceedings that have been completed through a final order. Commonly filed when new evidence becomes available, country conditions change, the respondent received an in absentia removal order, or when prior counsel was ineffective. Filed pursuant to INA § 240(c)(7), 8 C.F.R. § 1003.23, and the EOIR Immigration Court Practice Manual, Chapter 5.7. Subject to strict filing deadlines (90 days for most motions, no deadline for certain exceptions).",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "25-35 minutes",
  difficultyLevel: "intermediate",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    // Section 1: Case Caption
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
          helpText: "Select the EOIR immigration court where the case was adjudicated.",
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
      helpText: "Provide filing details and information about the final order.",
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
          id: "dateOfFinalOrder",
          label: "Date of Final Order",
          type: "date",
          required: true,
          helpText: "Date of the final order you are seeking to reopen.",
        },
        {
          id: "typeOfFinalOrder",
          label: "Type of Final Order",
          type: "select",
          required: true,
          helpText: "Select the type of final order entered in this case.",
          validation: {
            options: [
              { value: "removal_order_absentia", label: "In Absentia Removal Order" },
              { value: "removal_order_merits", label: "Removal Order After Merits Hearing" },
              { value: "voluntary_departure", label: "Voluntary Departure Order" },
              { value: "deportation_order", label: "Deportation Order" },
              { value: "exclusion_order", label: "Exclusion Order" },
              { value: "administrative_closure", label: "Administrative Closure" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          id: "daysSinceOrder",
          label: "Days Since Final Order",
          type: "text",
          required: false,
          placeholder: "e.g., 45",
          helpText: "Number of days since the final order was entered.",
        },
        {
          id: "motionDeadlineAwareness",
          label: "Filing Deadline Status",
          type: "select",
          required: true,
          helpText: "Indicate the timeliness of this motion relative to filing deadlines.",
          validation: {
            options: [
              { value: "within_90_days", label: "Within 90-Day Filing Deadline" },
              { value: "beyond_90_days_exception", label: "Beyond 90 Days — Exception Applies" },
              { value: "in_absentia_within_180_days", label: "In Absentia — Within 180 Days of Order" },
              { value: "in_absentia_anytime", label: "In Absentia — Lack of Notice" },
              { value: "no_deadline_applies", label: "No Deadline — Changed Country Conditions" },
              { value: "sua_sponte", label: "Requesting Sua Sponte Reopening" },
            ],
          },
        },
      ],
    },

    // Section 3: Basis for Reopening
    {
      id: "basisForReopening",
      name: "Basis for Reopening",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide the grounds and supporting details for your motion to reopen.",
      inputs: [
        {
          id: "reopenBasis",
          label: "Basis for Reopening",
          type: "select",
          required: true,
          helpText: "Select the primary basis for seeking reopening of proceedings.",
          validation: {
            options: [
              { value: "new_evidence", label: "Previously Unavailable Evidence" },
              { value: "changed_country_conditions", label: "Changed Country Conditions" },
              { value: "in_absentia_no_notice", label: "In Absentia — Improper Notice" },
              { value: "in_absentia_exceptional_circumstances", label: "In Absentia — Exceptional Circumstances" },
              { value: "ineffective_assistance", label: "Ineffective Assistance of Counsel" },
              { value: "dhs_agreement", label: "Joint Motion — DHS Agrees to Reopen" },
              { value: "changed_law", label: "Change in Applicable Law" },
              { value: "fraud_coercion", label: "Fraud, Duress, or Coercion" },
              { value: "sua_sponte", label: "Sua Sponte Request" },
              { value: "other", label: "Other Basis" },
            ],
          },
        },
        {
          id: "reopenBasisExplanation",
          label: "Detailed Explanation of Basis for Reopening",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed explanation of the basis for reopening proceedings...",
          helpText: "Detailed explanation of the basis for reopening.",
          validation: {
            minLength: 100,
            maxLength: 5000,
          },
        },
        {
          id: "newEvidenceDescription",
          label: "New Evidence Description",
          type: "textarea",
          required: false,
          placeholder: "Describe the new evidence or changed circumstances that support reopening...",
          helpText: "Describe the new evidence or changed circumstances that support reopening.",
          validation: {
            maxLength: 3000,
          },
        },
        {
          id: "whyNotPreviouslyAvailable",
          label: "Why Evidence Was Not Previously Available",
          type: "textarea",
          required: false,
          placeholder: "Explain why this evidence/basis was not available at the original proceeding...",
          helpText: "Explain why this evidence/basis was not available at the original proceeding.",
          validation: {
            maxLength: 2000,
          },
        },
        {
          id: "priorMotionsToReopen",
          label: "Prior Motions to Reopen",
          type: "select",
          required: true,
          helpText: "Indicate whether any prior motions to reopen have been filed in this case.",
          validation: {
            options: [
              { value: "none", label: "None" },
              { value: "one_denied", label: "One — Denied" },
              { value: "one_granted", label: "One — Granted" },
              { value: "multiple", label: "Multiple" },
            ],
          },
        },
        {
          id: "priorMotionDetails",
          label: "Prior Motion Details",
          type: "textarea",
          required: false,
          placeholder: "Provide details about any prior motions to reopen...",
          helpText: "Provide details about any prior motions to reopen.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },

    // Section 4: In Absentia Details
    {
      id: "inAbsentiaDetails",
      name: "In Absentia Details",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Provide details if the final order was entered in absentia.",
      inputs: [
        {
          id: "wasInAbsentia",
          label: "Was the Order Entered In Absentia?",
          type: "select",
          required: true,
          helpText: "Indicate whether the final order was entered while the respondent was absent.",
          validation: {
            options: [
              { value: "yes_no_notice", label: "Yes — Did Not Receive Proper Notice" },
              { value: "yes_exceptional", label: "Yes — Had Exceptional Circumstances" },
              { value: "no", label: "No — Was Present at Final Hearing" },
            ],
          },
        },
        {
          id: "noticeDetails",
          label: "Notice Details",
          type: "textarea",
          required: false,
          placeholder: "Explain how notice was deficient or what exceptional circumstances prevented attendance...",
          helpText: "Explain how notice was deficient or what exceptional circumstances prevented attendance.",
          validation: {
            maxLength: 2000,
          },
        },
        {
          id: "addressHistory",
          label: "Address History",
          type: "textarea",
          required: false,
          placeholder: "Provide address history and Form EOIR-33 filing history...",
          helpText: "Provide address history and Form EOIR-33 filing history.",
          validation: {
            maxLength: 2000,
          },
        },
        {
          id: "exceptionalCircumstances",
          label: "Exceptional Circumstances",
          type: "textarea",
          required: false,
          placeholder: "Describe the exceptional circumstances that prevented attendance...",
          helpText: "Describe the exceptional circumstances that prevented attendance.",
          validation: {
            maxLength: 3000,
          },
        },
      ],
    },

    // Section 5: Relief Sought
    {
      id: "reliefSought",
      name: "Relief Sought",
      type: "user-input",
      order: 5,
      required: true,
      helpText: "Specify the relief being sought if proceedings are reopened.",
      inputs: [
        {
          id: "reliefSought",
          label: "Relief Sought",
          type: "select",
          required: true,
          helpText: "Select the form of relief you are seeking if proceedings are reopened.",
          validation: {
            options: [
              { value: "asylum", label: "Asylum" },
              { value: "withholding_of_removal", label: "Withholding of Removal" },
              { value: "cat_protection", label: "CAT Protection" },
              { value: "cancellation_of_removal", label: "Cancellation of Removal" },
              { value: "adjustment_of_status", label: "Adjustment of Status" },
              { value: "voluntary_departure", label: "Voluntary Departure" },
              { value: "prosecutorial_discretion", label: "Prosecutorial Discretion" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          id: "reliefExplanation",
          label: "Relief Explanation",
          type: "textarea",
          required: true,
          placeholder: "Explain the relief you are seeking if proceedings are reopened...",
          helpText: "Explain the relief you are seeking if proceedings are reopened.",
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
          helpText: "Indicate DHS's position on the motion to reopen.",
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
      ],
    },

    // Section 6: Statement of Facts (AI-generated)
    {
      id: "statementOfFacts",
      name: "Statement of Facts",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "AI generates a factual narrative based on the information provided.",
      aiPromptTemplate: `Generate a statement of facts for an EOIR immigration court Motion to Reopen.

Immigration court: {{immigrationCourt}}
Type of final order: {{typeOfFinalOrder}}
Date of final order: {{dateOfFinalOrder}}
Basis for reopening: {{reopenBasis}}
Detailed explanation: {{reopenBasisExplanation}}
New evidence description: {{newEvidenceDescription}}
Why not previously available: {{whyNotPreviouslyAvailable}}
Was order entered in absentia: {{wasInAbsentia}}
Notice details: {{noticeDetails}}
Exceptional circumstances: {{exceptionalCircumstances}}
Relief sought: {{reliefSought}}
DHS position: {{dhsPosition}}
Days since order: {{daysSinceOrder}}
Filing deadline status: {{motionDeadlineAwareness}}
Respondent name: the Respondent

Requirements:
- Generate 3-4 paragraphs describing:
  1. Case history and procedural posture, including the date and type of the final order
  2. Basis for reopening and factual circumstances supporting the motion
  3. New evidence or changed circumstances that have arisen since the final order
  4. Timeliness of the motion and compliance with filing deadlines
- Use formal immigration court pleading language
- Refer to the individual as "the Respondent" throughout
- Reference specific dates, orders, and circumstances where provided
- State the factual basis for reopening without legal argument`,
      aiInstructions: "Use EOIR terminology. Say 'Respondent' not 'Defendant'. Say 'DHS' not 'Plaintiff'. Reference INA and 8 C.F.R. citations. Generate factual narrative only, no legal argument.",
    },

    // Section 7: Legal Argument (AI-generated)
    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 7,
      required: true,
      helpText: "AI generates the legal argument supporting the motion to reopen.",
      aiPromptTemplate: `Generate the legal argument section for an EOIR immigration court Motion to Reopen.

Immigration court: {{immigrationCourt}}
Type of final order: {{typeOfFinalOrder}}
Date of final order: {{dateOfFinalOrder}}
Basis for reopening: {{reopenBasis}}
Detailed explanation: {{reopenBasisExplanation}}
New evidence description: {{newEvidenceDescription}}
Why not previously available: {{whyNotPreviouslyAvailable}}
Was order entered in absentia: {{wasInAbsentia}}
Notice details: {{noticeDetails}}
Exceptional circumstances: {{exceptionalCircumstances}}
Address history: {{addressHistory}}
Relief sought: {{reliefSought}}
Relief explanation: {{reliefExplanation}}
DHS position: {{dhsPosition}}
DHS position details: {{dhsPositionDetails}}
Days since order: {{daysSinceOrder}}
Filing deadline status: {{motionDeadlineAwareness}}
Prior motions to reopen: {{priorMotionsToReopen}}
Respondent name: the Respondent

Requirements:
- Generate 4-6 paragraphs arguing:
  1. The standard for reopening under INA § 240(c)(7) and 8 C.F.R. § 1003.23
  2. Timeliness and numerical limitations, or the applicable exception to the deadline
  3. Prima facie case for the underlying relief sought
  4. How the new evidence is material and was not available at the prior hearing
  5. DHS position and why reopening should be granted
- Cite applicable statutes, regulations, and BIA precedent decisions:
  - INA § 240(c)(7), 8 C.F.R. § 1003.23
  - Matter of Coelho, 20 I&N Dec. 464 (BIA 1992)
  - Matter of Lozada, 19 I&N Dec. 637 (BIA 1988) for ineffective assistance of counsel
  - INS v. Doherty, 502 U.S. 314 (1992)
  - 8 U.S.C. § 1229a(b)(5) for in absentia orders
- If DHS agrees, emphasize the joint motion and that both parties support reopening
- Address numerical limitation (one motion to reopen) and any applicable exception`,
      aiInstructions: "Cite INA sections, 8 C.F.R. regulations, and BIA precedent decisions. Use proper EOIR terminology. Say 'Respondent' not 'Defendant'. Say 'DHS' not 'Plaintiff'.",
    },

    // Section 8: Prayer for Relief (static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 8,
      required: true,
      helpText: "Standard prayer for relief in a motion to reopen.",
      staticContent: `WHEREFORE, Respondent respectfully requests that this Honorable Immigration Court:

1. Reopen these proceedings and vacate the prior order of [removal/deportation/voluntary departure];

2. Schedule a new individual hearing on the merits of Respondent's application for relief;

3. In the alternative, if the Court finds that reopening is not warranted, grant the Respondent leave to file a motion for reconsideration;

4. Stay the execution of the prior order pending adjudication of this motion;

5. Grant such other and further relief as the Immigration Judge deems just and proper.`,
    },

    // Section 9: Attorney Declaration & Service
    {
      id: "attorneyDeclaration",
      name: "Attorney Declaration & Service",
      type: "user-input",
      order: 9,
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

    // Section 10: Certificate of Service (static)
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 10,
      required: true,
      helpText: "Standard certificate of service for EOIR filings.",
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, a copy of the foregoing MOTION TO REOPEN was served upon the following parties:

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

export default motionToReopenEoirTemplate;
