/**
 * Written Pleadings to the Notice to Appear (NTA) Template
 *
 * Respondent's written pleadings addressing the factual allegations
 * and charges of removability in the NTA, filed in immigration court.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS, RELIEF_TYPES } from "./immigration-court-data";

export const ntaPleadingsTemplate: DocumentTemplate = {
  id: "nta-pleadings",
  name: "Respondent's Written Pleadings to the Notice to Appear",
  category: "immigration",
  description:
    "Formal written pleadings responding to the Notice to Appear (NTA), admitting or denying factual allegations and charges of removability, designating country of removal, and identifying applications for relief.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "20-30 minutes",
  difficultyLevel: "intermediate",
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

    // Section 2: Filing Info
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
          id: "hearingDate",
          label: "Next Hearing Date",
          type: "date",
          required: false,
          helpText: "Date of the next scheduled hearing, if known.",
        },
        {
          id: "hearingTime",
          label: "Hearing Time",
          type: "text",
          required: false,
          placeholder: "e.g., 1:00 PM",
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
        {
          id: "dhsChiefCounselAddress",
          label: "DHS Chief Counsel Address",
          type: "textarea",
          required: false,
          placeholder: "Office of Chief Counsel, DHS\nAddress\nCity, State ZIP",
          helpText: "Address of the DHS Chief Counsel office for service.",
        },
      ],
    },

    // Section 3: Preparer Info
    {
      id: "preparerInfo",
      name: "Attorney Information",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Enter your information as the attorney of record.",
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

    // Section 4: NTA Service Response
    {
      id: "ntaService",
      name: "Service of NTA",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Indicate whether the respondent concedes or denies proper service of the NTA.",
      inputs: [
        {
          id: "ntaServiceResponse",
          label: "Service of NTA",
          type: "select",
          required: true,
          helpText: "Does the respondent concede proper service of the NTA?",
          validation: {
            options: [
              { value: "concede", label: "Concede proper service" },
              { value: "deny", label: "Deny proper service" },
            ],
          },
        },
        {
          id: "ntaServiceExplanation",
          label: "Explanation (if denying service)",
          type: "textarea",
          required: false,
          placeholder: "Explain the basis for denying proper service of the NTA...",
          helpText: "Required if denying proper service. Describe any defects in service.",
        },
      ],
    },

    // Section 5: Rights Attestation (Static)
    {
      id: "rightsAttestation",
      name: "Rights Attestation",
      type: "static",
      order: 5,
      required: true,
      staticContent:
        "Counsel has advised the Respondent of the right to representation at no expense to the Government pursuant to INA \u00A7 240(b)(4)(A), the nature of removal proceedings, the privilege of being represented by counsel, the right to present evidence on the Respondent's own behalf, the right to cross-examine witnesses presented by the Government, and the consequences of failing to appear at scheduled hearings.",
    },

    // Section 6: Factual Allegations
    {
      id: "factualAllegations",
      name: "Response to Factual Allegations",
      type: "user-input",
      order: 6,
      required: true,
      helpText: "List which numbered paragraphs from the NTA are admitted, denied, or unknown.",
      inputs: [
        {
          id: "admittedAllegations",
          label: "Admitted Allegations",
          type: "textarea",
          required: false,
          placeholder: "List paragraph numbers admitted, e.g., 1, 2, 3, 5\nOr describe: 'Respondent admits paragraphs 1 through 3 and paragraph 5.'",
          helpText: "List the NTA paragraph numbers that the respondent admits.",
        },
        {
          id: "deniedAllegations",
          label: "Denied Allegations",
          type: "textarea",
          required: false,
          placeholder: "List paragraph numbers denied, e.g., 4, 6, 7\nOr describe: 'Respondent denies paragraphs 4, 6, and 7.'",
          helpText: "List the NTA paragraph numbers that the respondent denies.",
        },
        {
          id: "allegationExplanation",
          label: "Additional Explanation",
          type: "textarea",
          required: false,
          placeholder: "Provide additional context for admissions or denials, if needed...",
          helpText: "Optional context for the factual allegation responses.",
        },
      ],
    },

    // Section 7: Allegations Formatted (AI-generated)
    {
      id: "allegationsFormatted",
      name: "Formatted Allegation Responses",
      type: "ai-generated",
      order: 7,
      required: true,
      helpText: "AI formats the admit/deny responses into proper EOIR pleading language.",
      aiPromptTemplate: `Format the following factual allegation responses into proper EOIR immigration court pleading language.

Admitted allegations: {{admittedAllegations}}
Denied allegations: {{deniedAllegations}}
Additional explanation: {{allegationExplanation}}

Requirements:
- Format each response as a numbered paragraph referencing the NTA paragraph number
- Use formal pleading language: "Respondent admits the allegation in Paragraph X" or "Respondent denies the allegation in Paragraph X"
- If no paragraphs are specified for admit or deny, state "Respondent reserves the right to amend these pleadings"
- Cite INA \u00A7 240 as the governing authority
- Do not fabricate allegation content — only format the paragraph references provided
- Keep responses concise and formal`,
      aiInstructions: "Format factual allegation admissions and denials into proper EOIR pleading format. Cite INA \u00A7 240.",
    },

    // Section 8: Charges Response
    {
      id: "chargesResponse",
      name: "Response to Charges of Removability",
      type: "user-input",
      order: 8,
      required: true,
      helpText: "Indicate whether the respondent concedes, denies, or partially concedes the charges.",
      inputs: [
        {
          id: "chargesResponse",
          label: "Response to Charges",
          type: "select",
          required: true,
          helpText: "How does the respondent respond to the charges of removability?",
          validation: {
            options: [
              { value: "concede", label: "Concede removability" },
              { value: "deny", label: "Deny removability" },
              { value: "partial", label: "Concede in part, deny in part" },
            ],
          },
        },
        {
          id: "chargesExplanation",
          label: "Charges Detail",
          type: "textarea",
          required: false,
          placeholder: "Describe which charges are conceded or denied, and on what basis...",
          helpText: "Explain the basis for the response to charges, especially if conceding in part.",
        },
      ],
    },

    // Section 9: Country Designation
    {
      id: "countryDesignation",
      name: "Country of Removal Designation",
      type: "user-input",
      order: 9,
      required: true,
      helpText: "Designate a country of removal or decline to designate per INA \u00A7 240(c)(4).",
      inputs: [
        {
          id: "countryDesignation",
          label: "Country Designation",
          type: "select",
          required: true,
          validation: {
            options: [
              { value: "designate", label: "Designate a country" },
              { value: "decline", label: "Decline to designate" },
            ],
          },
        },
        {
          id: "countryName",
          label: "Country Name",
          type: "text",
          required: false,
          placeholder: "Country of removal",
          helpText: "Required if designating a country of removal.",
        },
      ],
    },

    // Section 10: Relief Applications
    {
      id: "reliefApplications",
      name: "Applications for Relief",
      type: "user-input",
      order: 10,
      required: true,
      helpText: "Identify the forms of relief from removal the respondent intends to pursue.",
      inputs: [
        {
          id: "selectedRelief",
          label: "Relief Types",
          type: "textarea",
          required: true,
          placeholder: "List each form of relief, e.g.:\nAsylum (INA \u00A7 208)\nWithholding of Removal (INA \u00A7 241(b)(3))\nCAT protection (8 CFR 1208.16-18)",
          helpText: "List all forms of relief the respondent will apply for.",
          validation: {
            minLength: 5,
          },
        },
        {
          id: "reliefExplanation",
          label: "Relief Explanation",
          type: "textarea",
          required: false,
          placeholder: "Brief explanation of eligibility or basis for each form of relief...",
          helpText: "Optional summary of the basis for each requested form of relief.",
        },
      ],
    },

    // Section 11: Relief Summary (AI-generated)
    {
      id: "reliefSummary",
      name: "Relief Applications Summary",
      type: "ai-generated",
      order: 11,
      required: true,
      helpText: "AI generates a structured summary of the relief applications with INA citations.",
      aiPromptTemplate: `Generate a structured summary of applications for relief from removal for immigration court pleadings.

Selected relief types: {{selectedRelief}}
Relief explanation: {{reliefExplanation}}
Proceeding type: {{proceedingType}}

Requirements:
- Format as a numbered list of relief applications
- Include the correct INA citation for each form of relief
- Note any filing requirements or deadlines (e.g., asylum 1-year filing deadline under INA \u00A7 208(a)(2)(B))
- Include a reservation clause: "Respondent reserves the right to identify additional forms of relief"
- Use formal pleading language
- Reference the applicable proceeding type context
- Do not fabricate facts — only format and cite the relief types provided`,
      aiInstructions: "Generate structured relief applications summary with INA citations for immigration court pleadings.",
    },

    // Section 12: Hearing Estimate
    {
      id: "hearingEstimate",
      name: "Hearing Estimate",
      type: "user-input",
      order: 12,
      required: false,
      helpText: "Estimated time and resources needed for the individual hearing.",
      inputs: [
        {
          id: "hearingDuration",
          label: "Estimated Hearing Duration",
          type: "select",
          required: false,
          validation: {
            options: [
              { value: "1hr", label: "1 hour" },
              { value: "2hr", label: "2 hours" },
              { value: "half_day", label: "Half day" },
              { value: "full_day", label: "Full day" },
            ],
          },
        },
        {
          id: "witnessCount",
          label: "Number of Witnesses",
          type: "number",
          required: false,
          placeholder: "0",
          helpText: "Estimated number of witnesses the respondent intends to call.",
        },
        {
          id: "interpreterNeeded",
          label: "Interpreter Needed",
          type: "select",
          required: false,
          validation: {
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ],
          },
        },
        {
          id: "interpreterLanguage",
          label: "Language",
          type: "text",
          required: false,
          placeholder: "e.g., Spanish, Mandarin, Arabic",
          helpText: "Required if interpreter is needed.",
        },
      ],
    },

    // Section 13: Respondent Acknowledgment (Static)
    {
      id: "respondentAcknowledgment",
      name: "Respondent Acknowledgment",
      type: "static",
      order: 13,
      required: true,
      staticContent:
        "The Respondent acknowledges, through counsel, that the Respondent understands the nature of these proceedings, the charges contained in the Notice to Appear, the right to be represented by counsel at no expense to the Government, and the consequences of failing to appear at any scheduled hearing, including the possibility of an in absentia order of removal pursuant to INA \u00A7 240(b)(5).\n\n____________________________________\nRespondent's Signature                    Date: ______________",
    },

    // Section 14: Signature Block
    {
      id: "signatureBlock",
      name: "Attorney Signature",
      type: "user-input",
      order: 14,
      required: true,
      helpText: "Attorney signature block. ECAS filings may use conformed /S/ signatures.",
      inputs: [
        {
          id: "signatureAttorneyName",
          label: "Attorney Name (for signature)",
          type: "text",
          required: true,
          placeholder: "Full legal name",
          helpText: "For ECAS filings, a conformed signature (/S/ Name) will be used.",
        },
      ],
    },

    // Section 15: Proof of Service (AI-generated)
    {
      id: "proofOfService",
      name: "Proof of Service",
      type: "ai-generated",
      order: 15,
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
