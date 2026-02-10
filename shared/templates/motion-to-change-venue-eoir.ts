/**
 * Motion to Change Venue — EOIR Immigration Court Template
 *
 * Request transfer of immigration proceedings from one EOIR immigration court to another.
 * Governed by 8 C.F.R. § 1003.20 and the EOIR Immigration Court Practice Manual, Chapter 4.16.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const motionToChangeVenueEoirTemplate: DocumentTemplate = {
  id: "motion-to-change-venue-eoir",
  name: "Motion to Change Venue",
  category: "immigration",
  description:
    "Request transfer of immigration proceedings from one EOIR immigration court to another. This motion is filed when the respondent has relocated, when venue is inconvenient, or when transfer serves the interests of justice. Filed pursuant to 8 C.F.R. § 1003.20 and the EOIR Immigration Court Practice Manual, Chapter 4.16. Commonly filed early in proceedings when the respondent's address has changed after the Notice to Appear was served.",
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
          helpText: "Select the EOIR immigration court where the case is currently pending.",
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
          id: "currentHearingDate",
          label: "Current Hearing Date",
          type: "date",
          required: false,
          helpText: "Date of next scheduled hearing, if known",
        },
        {
          id: "currentHearingTime",
          label: "Current Hearing Time",
          type: "text",
          required: false,
          placeholder: "e.g., 1:00 PM",
          helpText: "Time of next scheduled hearing",
        },
      ],
    },

    // Section 3: Venue Change Details
    {
      id: "venueChangeDetails",
      name: "Venue Change Details",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Provide the details of the requested venue change.",
      inputs: [
        {
          id: "requestedCourt",
          label: "Requested Immigration Court",
          type: "select",
          required: true,
          helpText: "Select the immigration court where you are requesting the case be transferred.",
          validation: {
            options: IMMIGRATION_COURTS,
          },
        },
        {
          id: "requestedCourtOther",
          label: "Other Requested Court Name",
          type: "text",
          required: false,
          placeholder: "Enter court name if not listed above",
          helpText: "Specify the court name if you selected 'Other'.",
        },
        {
          id: "changeReason",
          label: "Reason for Venue Change",
          type: "select",
          required: true,
          helpText: "Select the primary reason for requesting a venue change.",
          validation: {
            options: [
              { value: "respondent_relocated", label: "Respondent Has Relocated" },
              { value: "inconvenient_venue", label: "Current Venue is Inconvenient" },
              { value: "interest_of_justice", label: "Interest of Justice" },
              { value: "detained_transferred", label: "Respondent Transferred to Different Facility" },
              { value: "attorney_location", label: "Attorney Located in Different Jurisdiction" },
              { value: "witnesses_evidence", label: "Witnesses/Evidence in Different Jurisdiction" },
              { value: "family_hardship", label: "Family Hardship" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          id: "changeReasonExplanation",
          label: "Explanation of Reason for Venue Change",
          type: "textarea",
          required: true,
          placeholder: "Provide detailed explanation of why the venue change is warranted...",
          helpText: "Provide detailed explanation of why the venue change is warranted",
          validation: {
            minLength: 50,
            maxLength: 3000,
          },
        },
      ],
    },

    // Section 4: Respondent's Current Address
    {
      id: "respondentAddress",
      name: "Respondent's Current Address",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Provide the respondent's current and prior address information.",
      inputs: [
        {
          id: "currentAddress",
          label: "Current Address",
          type: "textarea",
          required: true,
          placeholder: "Respondent's current physical address",
          helpText: "Respondent's current physical address",
          validation: {
            maxLength: 500,
          },
        },
        {
          id: "dateOfRelocation",
          label: "Date of Relocation",
          type: "date",
          required: false,
          helpText: "Date respondent moved to current address",
        },
        {
          id: "priorAddress",
          label: "Prior Address",
          type: "textarea",
          required: false,
          placeholder: "Respondent's prior address (if recently relocated)",
          helpText: "Respondent's prior address (if recently relocated)",
          validation: {
            maxLength: 500,
          },
        },
        {
          id: "distanceToCurrentCourt",
          label: "Distance to Current Court",
          type: "text",
          required: false,
          placeholder: "e.g., 350 miles",
          helpText: "Approximate distance to current immigration court (e.g., '350 miles')",
        },
        {
          id: "distanceToRequestedCourt",
          label: "Distance to Requested Court",
          type: "text",
          required: false,
          placeholder: "e.g., 25 miles",
          helpText: "Approximate distance to requested immigration court",
        },
        {
          id: "transportationHardship",
          label: "Transportation Hardship",
          type: "textarea",
          required: false,
          placeholder: "Describe any transportation hardship attending current court...",
          helpText: "Describe any transportation hardship attending current court",
          validation: {
            maxLength: 1000,
          },
        },
      ],
    },

    // Section 5: DHS Position
    {
      id: "dhsPosition",
      name: "DHS Position",
      type: "user-input",
      order: 5,
      required: true,
      helpText: "Indicate DHS's position on the venue change request.",
      inputs: [
        {
          id: "dhsPosition",
          label: "DHS Position on Venue Change",
          type: "select",
          required: true,
          helpText: "Indicate DHS's position on the venue change request.",
          validation: {
            options: [
              { value: "agrees", label: "DHS Agrees to Venue Change" },
              { value: "opposes", label: "DHS Opposes Venue Change" },
              { value: "no_position", label: "DHS Has No Position" },
              { value: "not_contacted", label: "DHS Has Not Been Contacted" },
              { value: "pending_response", label: "Awaiting DHS Response" },
            ],
          },
        },
        {
          id: "dhsPositionDetails",
          label: "DHS Position Details",
          type: "textarea",
          required: false,
          placeholder: "Additional details about DHS position or communications...",
          helpText: "Additional details about DHS position or communications",
          validation: {
            maxLength: 1000,
          },
        },
        {
          id: "opposingCounselName",
          label: "DHS Trial Attorney Name",
          type: "text",
          required: false,
          placeholder: "Name of DHS Trial Attorney",
          helpText: "Name of DHS Trial Attorney",
        },
        {
          id: "opposingCounselOffice",
          label: "DHS Office of Chief Counsel",
          type: "text",
          required: false,
          placeholder: "DHS Office of Chief Counsel location",
          helpText: "DHS Office of Chief Counsel location",
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
      aiPromptTemplate: `Generate a statement of facts for an EOIR immigration court Motion to Change Venue.

Current immigration court: {{immigrationCourt}}
Requested immigration court: {{requestedCourt}}
Respondent name: the Respondent
Reason for venue change: {{changeReason}}
Detailed explanation: {{changeReasonExplanation}}
Current address: {{currentAddress}}
Date of relocation: {{dateOfRelocation}}
Prior address: {{priorAddress}}
Distance to current court: {{distanceToCurrentCourt}}
Distance to requested court: {{distanceToRequestedCourt}}
Transportation hardship: {{transportationHardship}}
DHS position: {{dhsPosition}}
Current hearing date: {{currentHearingDate}}
Current hearing time: {{currentHearingTime}}

Requirements:
- Generate 2-3 paragraphs describing:
  1. Current case status and any scheduled hearings
  2. The respondent's relocation or circumstances requiring a venue change
  3. The practical impact of the current venue on the respondent
- Use formal immigration court pleading language
- Refer to the individual as "the Respondent" throughout
- Reference specific distances and addresses where provided
- State the factual basis for the venue change without legal argument`,
      aiInstructions: "Use EOIR terminology. Say 'Respondent' not 'Defendant'. Say 'DHS' not 'Plaintiff'. Reference the Immigration Court Practice Manual format. Generate factual narrative only, no legal argument.",
    },

    // Section 7: Legal Argument (AI-generated)
    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 7,
      required: true,
      helpText: "AI generates the legal argument supporting the venue change request.",
      aiPromptTemplate: `Generate the legal argument section for an EOIR immigration court Motion to Change Venue.

Current immigration court: {{immigrationCourt}}
Requested immigration court: {{requestedCourt}}
Reason for venue change: {{changeReason}}
Detailed explanation: {{changeReasonExplanation}}
Distance to current court: {{distanceToCurrentCourt}}
Distance to requested court: {{distanceToRequestedCourt}}
Transportation hardship: {{transportationHardship}}
DHS position: {{dhsPosition}}
DHS position details: {{dhsPositionDetails}}
Date of relocation: {{dateOfRelocation}}

Requirements:
- Generate 3-4 paragraphs arguing:
  1. The standard for venue change under 8 C.F.R. § 1003.20
  2. Good cause shown for the change based on the specific facts
  3. How the transfer serves the interests of justice
  4. DHS position and why transfer should be granted
- Cite 8 C.F.R. § 1003.20, EOIR Immigration Court Practice Manual Chapter 4.16, and relevant BIA decisions
- If DHS agrees, emphasize the joint request and that both parties support the transfer
- If respondent relocated, argue that venue properly lies where the respondent resides
- Address how the transfer promotes efficiency, fairness, and due process
- Use formal legal citation format`,
      aiInstructions: "Cite 8 C.F.R. § 1003.20, EOIR Immigration Court Practice Manual Chapter 4.16, and relevant BIA decisions. Use proper EOIR terminology.",
    },

    // Section 8: Prayer for Relief (Static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 8,
      required: true,
      staticContent: `WHEREFORE, Respondent respectfully requests that this Honorable Immigration Court:

1. Grant this Motion to Change Venue and transfer these proceedings to the [Requested Immigration Court];

2. In the alternative, administratively close these proceedings pending transfer to the appropriate immigration court;

3. Continue any currently scheduled hearing dates pending adjudication of this motion;

4. Grant such other and further relief as the Immigration Judge deems just and proper.`,
    },

    // Section 9: Attorney Declaration & Service
    {
      id: "attorneyDeclaration",
      name: "Attorney Declaration & Service",
      type: "user-input",
      order: 9,
      required: true,
      helpText: "Enter the attorney's information for the signature block.",
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "text",
          required: true,
          placeholder: "Full name of attorney",
        },
        {
          id: "firmName",
          label: "Firm Name",
          type: "text",
          required: false,
          placeholder: "Law firm name",
        },
        {
          id: "address",
          label: "Address",
          type: "textarea",
          required: true,
          placeholder: "Attorney mailing address",
          validation: {
            maxLength: 200,
          },
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "text",
          required: true,
          placeholder: "(555) 555-5555",
        },
        {
          id: "email",
          label: "Email Address",
          type: "text",
          required: true,
          placeholder: "attorney@example.com",
        },
        {
          id: "eoir_id",
          label: "EOIR Attorney ID Number",
          type: "text",
          required: false,
          placeholder: "EOIR ID",
          helpText: "EOIR Attorney ID Number",
        },
      ],
    },

    // Section 10: Certificate of Service (Static)
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 10,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date below, a copy of the foregoing MOTION TO CHANGE VENUE was served upon the following parties:

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

export default motionToChangeVenueEoirTemplate;
