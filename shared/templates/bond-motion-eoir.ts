/**
 * Bond Motion — EOIR Immigration Court Template
 *
 * Request a bond redetermination hearing in immigration court for a detained respondent.
 * Governed by INA § 236(a), 8 C.F.R. § 1236.1(d), and Matter of Guerra, 24 I&N Dec. 37 (BIA 2006).
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual (ICPM) formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

export const bondMotionEoirTemplate: DocumentTemplate = {
  id: "bond-motion-eoir",
  name: "Motion for Bond Redetermination",
  category: "immigration",
  description:
    "Request a bond redetermination hearing in immigration court for a detained respondent. This motion asks the Immigration Judge to set, reduce, or eliminate the bond amount, arguing that the respondent is neither a flight risk nor a danger to the community. Governed by INA § 236(a), 8 C.F.R. § 1236.1(d), and Matter of Guerra, 24 I&N Dec. 37 (BIA 2006).",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "25-35 minutes",
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

    // Section 2: Detention Information
    {
      id: "detentionInfo",
      name: "Detention Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Provide details about the respondent's current detention.",
      inputs: [
        {
          id: "detentionFacility",
          label: "Detention Facility",
          type: "text",
          required: true,
          placeholder: "Name and location of ICE detention facility",
          helpText: "Name and location of ICE detention facility.",
        },
        {
          id: "dateOfArrest",
          label: "Date of Arrest",
          type: "date",
          required: true,
          helpText: "Date respondent was taken into ICE custody.",
        },
        {
          id: "currentBondAmount",
          label: "Current Bond Amount",
          type: "select",
          required: true,
          helpText: "Current bond status or amount set by DHS or the Immigration Judge.",
          validation: {
            options: [
              { value: "no_bond_set", label: "No bond set (detained without bond)" },
              { value: "1500", label: "$1,500" },
              { value: "2500", label: "$2,500" },
              { value: "5000", label: "$5,000" },
              { value: "7500", label: "$7,500" },
              { value: "10000", label: "$10,000" },
              { value: "15000", label: "$15,000" },
              { value: "20000", label: "$20,000" },
              { value: "25000", label: "$25,000" },
              { value: "50000", label: "$50,000" },
              { value: "75000", label: "$75,000" },
              { value: "100000", label: "$100,000" },
              { value: "over_100000", label: "Over $100,000" },
              { value: "mandatory_detention", label: "Mandatory detention (INA § 236(c))" },
            ],
          },
        },
        {
          id: "requestedBondAmount",
          label: "Requested Bond Amount",
          type: "select",
          required: true,
          helpText: "Bond amount requested by the respondent.",
          validation: {
            options: [
              { value: "release_on_recognizance", label: "Release on own recognizance" },
              { value: "1500", label: "$1,500" },
              { value: "2500", label: "$2,500" },
              { value: "5000", label: "$5,000" },
              { value: "7500", label: "$7,500" },
              { value: "10000", label: "$10,000" },
              { value: "15000", label: "$15,000" },
              { value: "20000", label: "$20,000" },
              { value: "other_amount", label: "Other amount" },
            ],
          },
        },
        {
          id: "requestedBondAmountOther",
          label: "Other Requested Bond Amount",
          type: "text",
          required: false,
          placeholder: "Enter requested bond amount",
          helpText: "Specify the requested bond amount if you selected 'Other amount'.",
        },
        {
          id: "priorBondHearing",
          label: "Prior Bond Hearing",
          type: "select",
          required: true,
          helpText: "Has a prior bond hearing been held in this case?",
          validation: {
            options: [
              { value: "no", label: "No prior bond hearing" },
              { value: "yes_denied", label: "Yes - bond denied" },
              { value: "yes_set_higher", label: "Yes - bond set at higher amount" },
              { value: "yes_reduced", label: "Yes - bond previously reduced" },
            ],
          },
        },
        {
          id: "mandatoryDetentionChallenge",
          label: "Mandatory Detention Challenge",
          type: "select",
          required: true,
          helpText: "If applicable, indicate the basis for challenging mandatory detention.",
          validation: {
            options: [
              { value: "not_applicable", label: "Not applicable" },
              { value: "misidentified_236c", label: "Respondent misidentified as mandatory detention" },
              { value: "joseph_hearing", label: "Joseph hearing requested (reasonable cause)" },
              { value: "changed_circumstances", label: "Changed circumstances since last hearing" },
            ],
          },
        },
      ],
    },

    // Section 3: Filing Information
    {
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 3,
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
          label: "Bond Hearing Date",
          type: "date",
          required: false,
          helpText: "Date of scheduled bond hearing, if set.",
        },
        {
          id: "opposingCounsel",
          label: "DHS Trial Attorney",
          type: "text",
          required: false,
          placeholder: "DHS Trial Attorney name",
          helpText: "DHS Trial Attorney name, if known.",
        },
      ],
    },

    // Section 4: Respondent's Background
    {
      id: "respondentBackground",
      name: "Respondent's Background",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Provide background information about the respondent to support the bond request.",
      inputs: [
        {
          id: "immigrationStatus",
          label: "Immigration Status",
          type: "select",
          required: true,
          helpText: "Respondent's immigration status at the time of arrest.",
          validation: {
            options: [
              { value: "lpr", label: "Lawful Permanent Resident" },
              { value: "visa_holder", label: "Visa holder" },
              { value: "asylee", label: "Asylee/Refugee" },
              { value: "tps", label: "TPS holder" },
              { value: "daca", label: "DACA recipient" },
              { value: "undocumented", label: "Undocumented" },
              { value: "other", label: "Other status" },
            ],
          },
        },
        {
          id: "yearsInUS",
          label: "Years in the United States",
          type: "select",
          required: true,
          helpText: "Approximate length of time the respondent has resided in the United States.",
          validation: {
            options: [
              { value: "less_1", label: "Less than 1 year" },
              { value: "1_5", label: "1-5 years" },
              { value: "5_10", label: "5-10 years" },
              { value: "10_20", label: "10-20 years" },
              { value: "over_20", label: "Over 20 years" },
            ],
          },
        },
        {
          id: "familyTies",
          label: "Family Ties",
          type: "textarea",
          required: true,
          placeholder: "Describe family ties in the US including US citizen/LPR family members, dependents, etc.",
          helpText: "Describe family ties in the US including US citizen/LPR family members, dependents, etc.",
          validation: {
            minLength: 50,
            maxLength: 2000,
          },
        },
        {
          id: "employmentHistory",
          label: "Employment History",
          type: "textarea",
          required: true,
          placeholder: "Describe employment history and current/prospective employment",
          helpText: "Describe employment history and current/prospective employment.",
          validation: {
            minLength: 30,
            maxLength: 1500,
          },
        },
        {
          id: "communityTies",
          label: "Community Ties",
          type: "textarea",
          required: false,
          placeholder: "Describe community ties: property ownership, church, organizations, etc.",
          helpText: "Describe community ties: property ownership, church, organizations, etc.",
          validation: {
            maxLength: 1500,
          },
        },
        {
          id: "criminalHistory",
          label: "Criminal History",
          type: "select",
          required: true,
          helpText: "Respondent's criminal history, if any.",
          validation: {
            options: [
              { value: "none", label: "No criminal history" },
              { value: "minor_offenses", label: "Minor offenses only (traffic, misdemeanors)" },
              { value: "prior_conviction", label: "Prior conviction(s)" },
              { value: "pending_charges", label: "Pending criminal charges" },
            ],
          },
        },
        {
          id: "criminalHistoryDetails",
          label: "Criminal History Details",
          type: "textarea",
          required: false,
          placeholder: "If any criminal history, provide details including dispositions",
          helpText: "If any criminal history, provide details including dispositions.",
          validation: {
            maxLength: 2000,
          },
        },
        {
          id: "reliefSought",
          label: "Relief Sought",
          type: "select",
          required: true,
          helpText: "Form of relief from removal being pursued by the respondent.",
          validation: {
            options: [
              { value: "asylum", label: "Asylum" },
              { value: "withholding", label: "Withholding of Removal" },
              { value: "cat", label: "CAT Protection" },
              { value: "cancellation_lpr", label: "Cancellation (LPR)" },
              { value: "cancellation_non_lpr", label: "Cancellation (Non-LPR)" },
              { value: "adjustment", label: "Adjustment of Status" },
              { value: "voluntary_departure", label: "Voluntary Departure" },
              { value: "other", label: "Other relief" },
            ],
          },
        },
      ],
    },

    // Section 5: Statement of Facts (AI-generated)
    {
      id: "statementOfFacts",
      name: "Statement of Facts",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "AI generates a detailed statement of facts based on the respondent's background.",
      aiPromptTemplate: `Generate a detailed statement of facts for a bond redetermination motion in EOIR immigration court.

Detention facility: {{detentionFacility}}
Date of arrest: {{dateOfArrest}}
Current bond amount: {{currentBondAmount}}
Immigration status: {{immigrationStatus}}
Years in US: {{yearsInUS}}
Family ties: {{familyTies}}
Employment history: {{employmentHistory}}
Community ties: {{communityTies}}
Criminal history: {{criminalHistory}}
Criminal history details: {{criminalHistoryDetails}}
Relief sought: {{reliefSought}}

Under INA § 236(a) and 8 C.F.R. § 1236.1(d), a detained respondent may request bond redetermination. The standard from Matter of Guerra, 24 I&N Dec. 37 (BIA 2006) requires considering (1) whether the respondent is a danger to persons or property, and (2) whether the respondent is a flight risk.

Generate 4-5 paragraphs covering:
1. Respondent's immigration history and current detention
2. Family ties and community connections in the US
3. Employment history and financial stability
4. Any criminal history and rehabilitation (or lack thereof)
5. Form of relief being pursued and likelihood of success

Present facts favorably for bond release.`,
      aiInstructions: "Use immigration court terminology. Reference the respondent (not defendant). Present facts favorably for bond. Structure as 4-5 paragraphs covering detention history, family ties, employment, criminal history (or lack thereof), and relief being pursued. Cite Matter of Guerra factors where relevant.",
    },

    // Section 6: Legal Argument (AI-generated)
    {
      id: "legalArgument",
      name: "Legal Argument",
      type: "ai-generated",
      order: 6,
      required: true,
      helpText: "AI generates the legal argument for bond redetermination.",
      aiPromptTemplate: `Generate a legal argument for a bond redetermination motion in EOIR immigration court.

Immigration court: {{immigrationCourt}}
Detention facility: {{detentionFacility}}
Date of arrest: {{dateOfArrest}}
Current bond amount: {{currentBondAmount}}
Requested bond amount: {{requestedBondAmount}}
Prior bond hearing: {{priorBondHearing}}
Mandatory detention challenge: {{mandatoryDetentionChallenge}}
Immigration status: {{immigrationStatus}}
Years in US: {{yearsInUS}}
Family ties: {{familyTies}}
Employment history: {{employmentHistory}}
Community ties: {{communityTies}}
Criminal history: {{criminalHistory}}
Criminal history details: {{criminalHistoryDetails}}
Relief sought: {{reliefSought}}

Applicable law:
- INA § 236(a): Authority for bond
- 8 C.F.R. § 1236.1(d): Bond redetermination by IJ
- Matter of Guerra, 24 I&N Dec. 37 (BIA 2006): Two-prong test (danger + flight risk)
- Matter of Adeniji, 22 I&N Dec. 1102 (BIA 1999): Factors for bond determination
- Matter of Patel, 15 I&N Dec. 666 (BIA 1976): Bond factors
- Matter of Fatahi, 26 I&N Dec. 791 (BIA 2016): Changed circumstances
- If mandatory detention challenge: Matter of Joseph, 22 I&N Dec. 799 (BIA 1999)
- Jennings v. Rodriguez, 583 U.S. 281 (2018): Prolonged detention

Generate 4-6 paragraphs covering:
1. Legal framework for bond under INA § 236(a)
2. Respondent is not a danger to the community (cite Matter of Guerra factor 1)
3. Respondent is not a flight risk (cite Matter of Guerra factor 2)
4. Community ties, family, employment weigh in favor of release
5. If applicable, address mandatory detention challenge or changed circumstances
6. Conclude with why bond should be set/reduced`,
      aiInstructions: "Must cite Matter of Guerra, 24 I&N Dec. 37 (BIA 2006). Use immigration law citations (INA, C.F.R., BIA decisions). Address both prongs of the Guerra test: (1) danger to persons or property, and (2) flight risk. Cite Matter of Adeniji, Matter of Patel, and other relevant BIA decisions. If mandatory detention is challenged, cite Matter of Joseph. For prolonged detention, cite Jennings v. Rodriguez. Structure as 4-6 paragraphs of formal legal argument.",
    },

    // Section 7: Prayer for Relief (Static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 7,
      required: true,
      staticContent:
        "WHEREFORE, Respondent respectfully requests that this Honorable Court:\n\n1. Conduct a bond redetermination hearing pursuant to INA § 236(a) and 8 C.F.R. § 1236.1(d);\n\n2. Find that the Respondent is neither a danger to persons or property nor a flight risk;\n\n3. Set bond at a reasonable amount that the Respondent can afford, or in the alternative, release the Respondent on the Respondent's own recognizance;\n\n4. Consider all favorable factors including the Respondent's family ties, length of residence, employment history, and manner of entry;\n\n5. Grant such other and further relief as this Court deems just and proper.",
    },

    // Section 8: Signature Block
    {
      id: "signatureBlock",
      name: "Signature Block",
      type: "user-input",
      order: 8,
      required: true,
      helpText: "Enter the attorney's information for the signature block.",
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name",
        },
        {
          id: "barNumber",
          label: "State Bar Number",
          type: "text",
          required: true,
          placeholder: "Bar number",
        },
        {
          id: "firmName",
          label: "Law Firm / Organization",
          type: "text",
          required: false,
          placeholder: "Firm or organization name",
        },
        {
          id: "eoirNumber",
          label: "EOIR Attorney ID Number",
          type: "text",
          required: false,
          placeholder: "EOIR registration number",
          helpText: "EOIR Attorney ID number.",
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
          id: "signingDate",
          label: "Date",
          type: "date",
          required: true,
          helpText: "Date the motion is signed.",
        },
      ],
    },

    // Section 9: Certificate of Service (Static)
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 9,
      required: true,
      staticContent:
        "CERTIFICATE OF SERVICE\n\nI hereby certify that on the date below, a copy of the foregoing MOTION FOR BOND REDETERMINATION AND MEMORANDUM OF LAW was served upon:\n\nOffice of the Chief Counsel\nU.S. Department of Homeland Security\nImmigration and Customs Enforcement\n[Address]\n\nby the following method:\n[ ] EOIR Courts & Appeals System (ECAS)\n[ ] Personal delivery\n[ ] U.S. Mail, first class, postage prepaid\n\nDated: _______________\n\n____________________________\n[Attorney Name]\n[Bar Number]",
    },
  ],
};
