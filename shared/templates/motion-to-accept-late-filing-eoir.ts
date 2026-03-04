/**
 * Motion to Accept Untimely Filing — EOIR Immigration Court Template
 *
 * Request for an Immigration Judge to accept a brief, motion, application, or
 * supporting document that is being filed after the court-ordered deadline.
 * One of the most routinely filed motions in EOIR practice.
 *
 * Governed by 8 C.F.R. § 1003.31(c) (IJ authority to set and extend filing deadlines)
 * and the EOIR Immigration Court Practice Manual (ICPM) Chapter 4.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionToAcceptLateFilingEoirTemplate: DocumentTemplate = {
  id: "motion-to-accept-late-filing-eoir",
  name: "Motion to Accept Untimely Filing",
  category: "immigration",
  description:
    "Request an Immigration Judge to accept a brief, motion, application, or other document filed after the court-ordered deadline. This is one of the most frequently filed motions in EOIR practice and arises whenever a filing deadline is missed. The IJ has broad discretion to accept untimely filings upon a showing of good cause. Governed by 8 C.F.R. § 1003.31(c) and the EOIR Immigration Court Practice Manual.",
  version: "1.0.0",
  lastUpdated: new Date("2026-03-04"),
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
          label: "Next Scheduled Hearing Date",
          type: "date",
          required: true,
          helpText: "The date of the next scheduled hearing in the case.",
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

    // Section 3: Document Being Filed
    {
      id: "documentDetails",
      name: "Document Being Filed Late",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Identify the document being filed after the deadline and the relevant dates.",
      inputs: [
        {
          id: "documentType",
          label: "Type of Document Being Filed",
          type: "select",
          required: true,
          helpText: "Select the type of document for which you are seeking late acceptance.",
          validation: {
            options: [
              { value: "merits_brief", label: "Merits Brief / Pre-Hearing Brief" },
              { value: "asylum_application", label: "Asylum Application (Form I-589)" },
              { value: "supporting_documents", label: "Supporting Documents / Exhibits" },
              { value: "witness_list", label: "Witness List" },
              { value: "country_conditions_evidence", label: "Country Conditions Evidence" },
              { value: "motion_to_suppress", label: "Motion to Suppress" },
              { value: "motion_to_terminate", label: "Motion to Terminate" },
              { value: "motion_to_continue", label: "Motion to Continue" },
              { value: "other_motion", label: "Other Motion" },
              { value: "other_application", label: "Other Application or Form" },
              { value: "other", label: "Other Document" },
            ],
          },
        },
        {
          id: "documentDescription",
          label: "Document Description",
          type: "text",
          required: false,
          placeholder: "Brief description of the document (optional)",
          helpText: "Additional description if the document type is not fully described above.",
          validation: {
            maxLength: 300,
          },
        },
        {
          id: "courtOrderedDeadline",
          label: "Court-Ordered Filing Deadline",
          type: "date",
          required: true,
          helpText: "The date the Immigration Judge ordered this document to be filed.",
        },
        {
          id: "filingDate",
          label: "Actual / Anticipated Filing Date",
          type: "date",
          required: true,
          helpText: "The date on which the document is being (or will be) filed.",
        },
        {
          id: "daysLate",
          label: "Approximate Days Late",
          type: "text",
          required: true,
          placeholder: "e.g., 5, 14, 30",
          helpText: "The number of calendar days after the deadline that the document is being filed.",
          validation: {
            pattern: "^[0-9]+$",
          },
        },
        {
          id: "dhsReceivedCopy",
          label: "DHS Served with Copy?",
          type: "select",
          required: true,
          helpText: "Whether DHS has been or will be served with a copy of the late-filed document.",
          validation: {
            options: [
              { value: "yes", label: "Yes — DHS has been served" },
              { value: "concurrent", label: "Yes — DHS served concurrently with this motion" },
              { value: "no", label: "No — service will follow" },
            ],
          },
        },
      ],
    },

    // Section 4: Good Cause
    {
      id: "goodCauseDetails",
      name: "Good Cause Explanation",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Provide the factual basis for the untimely filing. Good cause is required under 8 C.F.R. § 1003.31(c).",
      inputs: [
        {
          id: "primaryReason",
          label: "Primary Reason for Untimely Filing",
          type: "select",
          required: true,
          helpText: "Select the primary reason the filing was not made by the deadline.",
          validation: {
            options: [
              { value: "counsel_workload", label: "Counsel Workload / Scheduling Conflict" },
              { value: "recently_retained", label: "Recently Retained Counsel / New Representation" },
              { value: "client_unavailable", label: "Client Unavailable / Difficulty Communicating with Client" },
              { value: "document_gathering", label: "Delay Obtaining Documents (abroad, third parties, etc.)" },
              { value: "translation", label: "Translation Delays" },
              { value: "medical_emergency", label: "Medical Emergency (Counsel or Client)" },
              { value: "technical_issues", label: "Technical / ECAS Filing System Issues" },
              { value: "expert_witness", label: "Delay Obtaining Expert or Witness Statement" },
              { value: "country_conditions", label: "Country Conditions Research / Document Authentication" },
              { value: "inadvertence", label: "Inadvertence / Calendaring Error" },
              { value: "other", label: "Other Good Cause" },
            ],
          },
        },
        {
          id: "goodCauseNarrative",
          label: "Detailed Good Cause Explanation",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed factual explanation of why the filing was not timely made. Include specific dates, events, and any steps taken to minimize the delay...",
          helpText: "Explain the specific facts constituting good cause. The more specific and credible the explanation, the stronger the motion.",
          validation: {
            minLength: 100,
            maxLength: 3000,
          },
        },
        {
          id: "prejudiceToRespondent",
          label: "Prejudice to Respondent if Filing Rejected",
          type: "textarea",
          required: true,
          placeholder: "Explain how rejection of the untimely filing would prejudice the respondent's ability to present their case...",
          helpText: "Describe the specific harm to the respondent if the court declines to accept the late filing.",
          validation: {
            minLength: 30,
            maxLength: 1500,
          },
        },
        {
          id: "prejudiceToDhs",
          label: "Prejudice to DHS if Filing Accepted",
          type: "select",
          required: true,
          helpText: "Whether accepting the untimely filing would prejudice the government.",
          validation: {
            options: [
              { value: "none", label: "No prejudice to DHS — DHS has had or will have adequate opportunity to respond" },
              { value: "minimal", label: "Minimal prejudice to DHS — delay is short and case is not at hearing stage" },
              { value: "dhs_consents", label: "DHS consents to the late filing" },
              { value: "dhs_does_not_oppose", label: "DHS does not oppose the late filing" },
              { value: "unknown", label: "DHS position unknown at this time" },
            ],
          },
        },
        {
          id: "stepsTaken",
          label: "Steps Taken to Minimize the Delay",
          type: "textarea",
          required: false,
          placeholder: "Describe any steps taken to file as quickly as possible once the delay was identified...",
          helpText: "Describe diligent efforts to minimize the delay.",
          validation: {
            maxLength: 1000,
          },
        },
        {
          id: "priorLateFilings",
          label: "Prior Untimely Filings in This Case",
          type: "select",
          required: true,
          helpText: "Whether there have been prior untimely filings in this case.",
          validation: {
            options: [
              { value: "none", label: "None — this is the first untimely filing" },
              { value: "one", label: "One prior untimely filing" },
              { value: "multiple", label: "Multiple prior untimely filings" },
            ],
          },
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
      aiPromptTemplate: `Generate a persuasive good cause statement for an EOIR immigration court Motion to Accept Untimely Filing.

Document type: {{documentType}}
Document description: {{documentDescription}}
Court-ordered deadline: {{courtOrderedDeadline}}
Filing date: {{filingDate}}
Days late: {{daysLate}}
Primary reason: {{primaryReason}}
Detailed explanation: {{goodCauseNarrative}}
Prejudice to respondent if rejected: {{prejudiceToRespondent}}
Prejudice to DHS if accepted: {{prejudiceToDhs}}
Steps taken to minimize delay: {{stepsTaken}}
Prior late filings in this case: {{priorLateFilings}}
Detained status: {{detainedStatus}}

Requirements:
- Cite 8 C.F.R. § 1003.31(c) — IJ's authority and discretion to extend filing deadlines for good cause
- Reference Matter of Lozada, 19 I&N Dec. 637 (BIA 1988) and/or Matter of C-B-, 25 I&N Dec. 888 (BIA 2012) where relevant
- Acknowledge the untimeliness directly and forthrightly before explaining the reason — courts appreciate candor
- Emphasize: (1) good cause for the delay, (2) no bad faith or dilatory intent, (3) prejudice to respondent if filing is excluded, (4) minimal or no prejudice to DHS
- If this is a merits brief or asylum application: note the serious, life-altering consequences of removal and the importance of a full evidentiary record
- If detained: note the particular difficulties of detained practice and access to counsel
- If DHS consents or does not oppose: emphasize the parties' agreement
- Address prior late filings honestly if they have occurred
- Use formal immigration court pleading language
- Structure as a cohesive legal argument`,
      aiInstructions: "Generate a persuasive good cause statement for an EOIR Motion to Accept Untimely Filing. Cite 8 C.F.R. § 1003.31(c) (IJ discretion to extend deadlines for good cause). Be candid about the untimeliness. Emphasize good cause, absence of bad faith, prejudice to respondent if excluded, and minimal prejudice to DHS. If the document is an asylum application or merits brief, note the gravity of potential removal. If detained, note the heightened difficulties of detained practice. Use formal immigration court pleading language.",
    },

    // Section 6: Legal Standard (AI-generated)
    {
      id: "legalStandard",
      name: "Legal Standard",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "AI generates the applicable legal standard for accepting untimely filings.",
      aiPromptTemplate: `Generate the legal standard section for an EOIR immigration court Motion to Accept Untimely Filing.

Document type: {{documentType}}
Days late: {{daysLate}}
Primary reason: {{primaryReason}}
DHS prejudice: {{prejudiceToDhs}}
Prior late filings: {{priorLateFilings}}

Requirements:
- Cite 8 C.F.R. § 1003.31(c) — the IJ's authority to set filing deadlines and to extend them for good cause shown
- Reference the EOIR Immigration Court Practice Manual (ICPM) on filing deadlines and requests for extensions
- Note the IJ's broad discretion in managing the case docket
- Apply a balancing analysis: (1) good cause for the delay, (2) absence of bad faith, (3) prejudice to respondent, (4) prejudice to DHS, (5) interests of justice
- If relevant, cite Matter of Lozada, 19 I&N Dec. 637 (BIA 1988) regarding due process requirements in immigration proceedings
- Note that immigration proceedings have heightened due process requirements given the serious consequences of removal (citing Mathews v. Eldridge, 424 U.S. 319 (1976) if appropriate)
- Use formal legal citation format`,
      aiInstructions: "Generate the legal standard section citing: 8 C.F.R. § 1003.31(c) (IJ authority to extend deadlines for good cause), EOIR ICPM on filing requirements. Apply a balancing analysis weighing good cause, bad faith, and prejudice to both parties. Note the IJ's broad discretion and the heightened due process concerns in removal proceedings given the serious consequences of removal.",
    },

    // Section 7: Prayer for Relief (Static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 7,
      required: true,
      staticContent:
        "WHEREFORE, the Respondent respectfully requests that the Immigration Judge:\n\n1. Accept the untimely filing of the {{documentType}} filed {{daysLate}} days after the court-ordered deadline;\n\n2. Deem the {{documentType}} filed nunc pro tunc as of the date of this motion;\n\n3. Allow DHS such additional time as may be necessary to respond to the late-filed document; and\n\n4. Grant such other and further relief as the Court deems just and appropriate in the interests of justice.",
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

export default motionToAcceptLateFilingEoirTemplate;
