/**
 * Notice of Appearance Template (Immigration Court)
 *
 * Companion document to EOIR-28, filed in immigration court
 * to formally enter appearance on behalf of a respondent.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const noticeOfAppearanceTemplate: DocumentTemplate = {
  id: "notice-of-appearance",
  name: "Notice of Appearance (Immigration Court)",
  category: "immigration",
  description:
    "Formal notice of appearance filed with EOIR Immigration Court, submitted concurrently with Form EOIR-28. Notifies the court and DHS Chief Counsel of attorney representation.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "10-15 minutes",
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
          helpText: "Whether the respondent is currently detained.",
          validation: {
            options: [
              { value: "detained", label: "Detained" },
              { value: "released", label: "Released / Non-Detained" },
            ],
          },
        },
        {
          id: "detentionFacility",
          label: "Detention Facility",
          type: "text",
          required: false,
          placeholder: "Name and location of detention facility",
          helpText: "Required if respondent is detained.",
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
          helpText: "Your EOIR attorney registration number, if applicable.",
        },
      ],
    },

    // Section 4: Notice Body (AI-generated)
    {
      id: "noticeBody",
      name: "Notice of Appearance",
      type: "ai-generated",
      order: 4,
      required: true,
      helpText: "AI generates the formal notice of appearance text.",
      aiPromptTemplate: `Generate a formal Notice of Appearance for filing in immigration court.

Context:
- Proceeding type: {{proceedingType}}
- Detained status: {{detainedStatus}}
- Filing method: {{filingMethod}}
- Detention facility: {{detentionFacility}}

Requirements:
- Reference EOIR-28 filed concurrently per 8 CFR 1003.17(a)
- Use "Respondent" terminology (never "Defendant")
- Cite 8 CFR 1003.17 for authority to enter appearance
- If detained, note the detention location and request notice of all hearings
- If filing via ECAS, note electronic filing per EOIR policy
- If filing via paper, include standard paper filing language
- Keep formal and concise, 2-3 paragraphs maximum`,
      aiInstructions: "Generate formal notice of appearance for immigration court. Use proper EOIR terminology and cite applicable regulations.",
    },

    // Section 5: EOIR-28 Reference (Static)
    {
      id: "eoir28Reference",
      name: "EOIR-28 Reference",
      type: "static",
      order: 5,
      required: true,
      staticContent:
        "This Notice of Appearance is filed concurrently with Form EOIR-28 (Notice of Entry of Appearance as Attorney or Representative Before the Immigration Court), as required by 8 CFR \u00A7 1003.17(a). Counsel requests that the Immigration Court accept this entry of appearance and direct all future correspondence and notices to counsel at the address listed above.",
    },

    // Section 6: Signature Block
    {
      id: "signatureBlock",
      name: "Signature",
      type: "user-input",
      order: 6,
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

    // Section 7: Proof of Service (AI-generated)
    {
      id: "proofOfService",
      name: "Proof of Service",
      type: "ai-generated",
      order: 7,
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
