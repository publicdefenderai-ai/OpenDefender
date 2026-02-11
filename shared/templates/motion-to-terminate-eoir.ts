/**
 * Motion to Terminate Proceedings — EOIR Immigration Court Template
 *
 * Request to terminate removal proceedings before the immigration court.
 * Filed when the Notice to Appear (NTA) is defective, respondent has obtained
 * legal status, prosecutorial discretion applies, or other grounds exist.
 *
 * Governed by INA § 240, 8 C.F.R. § 1003.10(b), 8 C.F.R. § 1239.2(c),
 * and the EOIR Immigration Court Practice Manual (ICPM), Chapter 5.8.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

const TERMINATION_GROUNDS = [
  { value: "defective_nta", label: "Defective Notice to Appear (NTA) — Missing Time/Date (Pereira v. Sessions)" },
  { value: "nta_not_served", label: "NTA Not Properly Served on Respondent" },
  { value: "status_obtained", label: "Respondent Has Obtained Lawful Immigration Status" },
  { value: "naturalized", label: "Respondent Has Naturalized as U.S. Citizen" },
  { value: "prosecutorial_discretion", label: "Prosecutorial Discretion / Low Priority Case" },
  { value: "prima_facie_eligible", label: "Prima Facie Eligibility for Relief Before USCIS" },
  { value: "approved_visa_petition", label: "Approved Visa Petition with Pending Adjustment" },
  { value: "vawa_u_t_visa", label: "Pending or Approved VAWA / U-Visa / T-Visa" },
  { value: "daca_tps", label: "DACA or TPS Recipient" },
  { value: "juvenile_sijs", label: "Special Immigrant Juvenile Status (SIJS) Pending/Approved" },
  { value: "no_jurisdiction", label: "Court Lacks Jurisdiction Over Respondent" },
  { value: "charges_not_sustained", label: "DHS Cannot Sustain Charges of Removability" },
  { value: "other", label: "Other Grounds" },
];

export const motionToTerminateEoirTemplate: DocumentTemplate = {
  id: "motion-to-terminate-eoir",
  name: "Motion to Terminate Proceedings",
  category: "immigration",
  description:
    "Request to terminate removal proceedings before the immigration court. Filed when the Notice to Appear (NTA) is defective (e.g., missing time or date per Pereira v. Sessions, 138 S. Ct. 2105 (2018) and Niz-Chavez v. Garland, 141 S. Ct. 1474 (2021)), respondent has obtained lawful status, prosecutorial discretion is warranted, or DHS cannot sustain charges of removability. Governed by INA § 240, 8 C.F.R. § 1239.2(c), and the EOIR Immigration Court Practice Manual, Chapter 5.8.",
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
      helpText: "Enter the immigration court and case information for the motion caption.",
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
      id: "filingInfo",
      name: "Filing Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Provide filing method and information about the current proceedings.",
      inputs: [
        {
          id: "filingMethod",
          label: "Filing Method",
          type: "select",
          required: true,
          helpText: "How you will file this motion.",
          validation: {
            options: FILING_METHODS,
          },
        },
        {
          id: "ntaDate",
          label: "Date NTA Was Issued",
          type: "date",
          required: true,
          helpText: "The date the Notice to Appear was issued by DHS.",
        },
        {
          id: "ntaServedDate",
          label: "Date NTA Was Served on Respondent",
          type: "date",
          required: false,
          helpText: "The date the respondent was personally served with the NTA (if known).",
        },
        {
          id: "nextHearingDate",
          label: "Next Scheduled Hearing Date",
          type: "date",
          required: false,
          helpText: "Date of the next scheduled hearing, if any.",
        },
        {
          id: "dhsAttorney",
          label: "DHS Trial Attorney Name",
          type: "text",
          required: false,
          placeholder: "Name of the assigned DHS trial attorney",
          helpText: "The name of the DHS/ICE trial attorney assigned to the case, if known.",
        },
      ],
    },

    {
      id: "terminationGrounds",
      name: "Grounds for Termination",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Select and describe the legal basis for requesting termination of proceedings.",
      inputs: [
        {
          id: "terminationGround",
          label: "Primary Ground for Termination",
          type: "select",
          required: true,
          helpText: "Select the primary legal ground for seeking termination of removal proceedings.",
          validation: {
            options: TERMINATION_GROUNDS,
          },
        },
        {
          id: "secondaryGround",
          label: "Secondary Ground (if applicable)",
          type: "select",
          required: false,
          helpText: "Select an additional ground if applicable.",
          validation: {
            options: [
              { value: "none", label: "None — Single Ground Only" },
              ...TERMINATION_GROUNDS,
            ],
          },
        },
        {
          id: "groundsDescription",
          label: "Detailed Factual Basis for Termination",
          type: "textarea",
          required: true,
          placeholder: "Describe the specific facts supporting termination. For NTA defects, describe what is missing or incorrect. For status changes, describe the respondent's current immigration status and how it was obtained. For prosecutorial discretion, describe the equities in the respondent's favor...",
          helpText: "Provide a detailed factual description supporting the ground(s) for termination.",
          validation: {
            minLength: 100,
            maxLength: 3000,
          },
        },
        {
          id: "ntaDefects",
          label: "NTA Defects (if applicable)",
          type: "textarea",
          required: false,
          placeholder: "Describe specific defects in the NTA: missing date/time, incorrect charges, wrong address, failure to specify factual allegations...",
          helpText: "If the ground involves a defective NTA, describe the specific defects. Reference Pereira v. Sessions (2018) for missing hearing time/date and Niz-Chavez v. Garland (2021) for two-document NTAs.",
          validation: {
            maxLength: 2000,
          },
        },
        {
          id: "currentStatus",
          label: "Respondent's Current Immigration Status",
          type: "select",
          required: true,
          helpText: "Select the respondent's current immigration status.",
          validation: {
            options: [
              { value: "undocumented", label: "Undocumented / No Status" },
              { value: "lpr", label: "Lawful Permanent Resident (LPR / Green Card)" },
              { value: "nonimmigrant", label: "Nonimmigrant Visa Holder (H-1B, F-1, etc.)" },
              { value: "asylee", label: "Asylee" },
              { value: "refugee", label: "Refugee" },
              { value: "tps", label: "Temporary Protected Status (TPS)" },
              { value: "daca", label: "DACA Recipient" },
              { value: "u_visa", label: "U-Visa Holder or Petitioner" },
              { value: "t_visa", label: "T-Visa Holder or Petitioner" },
              { value: "vawa", label: "VAWA Self-Petitioner" },
              { value: "sijs", label: "Special Immigrant Juvenile Status (SIJS)" },
              { value: "citizen", label: "Naturalized U.S. Citizen" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          id: "pendingApplications",
          label: "Pending Applications Before USCIS or Other Agency",
          type: "textarea",
          required: false,
          placeholder: "Describe any pending applications (e.g., I-130, I-485, U-visa petition, VAWA self-petition, SIJS petition)...",
          helpText: "List any pending applications before USCIS or other agencies that support termination.",
          validation: {
            maxLength: 1500,
          },
        },
      ],
    },

    {
      id: "equities",
      name: "Equities and Supporting Factors",
      type: "user-input",
      order: 4,
      required: false,
      helpText: "Describe favorable factors that support the exercise of discretion to terminate proceedings.",
      inputs: [
        {
          id: "yearsInUS",
          label: "Years of Physical Presence in the United States",
          type: "number",
          required: false,
          helpText: "Approximate number of years the respondent has been physically present in the U.S.",
        },
        {
          id: "familyTies",
          label: "Family Ties in the United States",
          type: "textarea",
          required: false,
          placeholder: "Describe U.S. citizen or LPR family members (spouse, children, parents)...",
          helpText: "Describe family ties, particularly U.S. citizen or LPR family members.",
          validation: {
            maxLength: 1500,
          },
        },
        {
          id: "communityTies",
          label: "Community Ties and Contributions",
          type: "textarea",
          required: false,
          placeholder: "Describe employment, community involvement, education, volunteer work, tax compliance...",
          helpText: "Describe the respondent's ties to the community, employment, and contributions.",
          validation: {
            maxLength: 1500,
          },
        },
        {
          id: "criminalHistory",
          label: "Criminal History",
          type: "select",
          required: true,
          helpText: "Describe the respondent's criminal history, if any.",
          validation: {
            options: [
              { value: "none", label: "No Criminal History" },
              { value: "minor_only", label: "Minor Offenses Only (traffic, minor misdemeanor)" },
              { value: "misdemeanor", label: "Misdemeanor Conviction(s)" },
              { value: "felony", label: "Felony Conviction(s)" },
            ],
          },
        },
        {
          id: "hardship",
          label: "Hardship to Respondent or Family if Removed",
          type: "textarea",
          required: false,
          placeholder: "Describe any exceptional hardship that would result from removal...",
          helpText: "Describe hardship to the respondent or qualifying family members if proceedings are not terminated.",
          validation: {
            maxLength: 2000,
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
      helpText: "AI will draft the legal argument based on the grounds and details provided.",
      aiPromptTemplate:
        "Generate a legal argument for a Motion to Terminate Proceedings in immigration court. The respondent is {{respondentName}} (A# {{aNumber}}). The NTA was issued on {{ntaDate}}. The proceeding type is {{proceedingType}}. The primary ground for termination is: {{terminationGround}}. {{#if secondaryGround}}Secondary ground: {{secondaryGround}}.{{/if}} Detailed factual basis: {{groundsDescription}}. {{#if ntaDefects}}NTA defects: {{ntaDefects}}.{{/if}} Current immigration status: {{currentStatus}}. {{#if pendingApplications}}Pending applications: {{pendingApplications}}.{{/if}} {{#if yearsInUS}}Years in U.S.: {{yearsInUS}}.{{/if}} {{#if familyTies}}Family ties: {{familyTies}}.{{/if}} {{#if communityTies}}Community ties: {{communityTies}}.{{/if}} Criminal history: {{criminalHistory}}. {{#if hardship}}Hardship factors: {{hardship}}.{{/if}}",
      aiInstructions:
        "Draft a formal legal argument section for a Motion to Terminate Proceedings before an EOIR immigration court. Structure the argument as follows: (1) Jurisdiction and procedural posture, (2) Legal standard for termination (citing INA § 240, 8 C.F.R. § 1239.2(c), and Matter of S-O-G- & F-D-B-, 27 I&N Dec. 462 (A.G. 2018) for prosecutorial discretion), (3) Application of the standard to the facts. For defective NTA claims, cite Pereira v. Sessions, 138 S. Ct. 2105 (2018) (NTA must specify time and place of hearing to trigger stop-time rule) and Niz-Chavez v. Garland, 141 S. Ct. 1474 (2021) (NTA must be a single document containing all required information). For status-based claims, cite 8 C.F.R. § 1239.2(c) and relevant BIA precedent. For prosecutorial discretion, reference the factors from Matter of Avetisyan, 25 I&N Dec. 688 (BIA 2012) (joint motion) and Matter of S-O-G- & F-D-B- (IJ independent authority). Address positive equities supporting termination. Use formal legal writing style appropriate for EOIR filings. Do not fabricate case citations.",
    },

    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "user-input",
      order: 6,
      required: true,
      helpText: "Provide details for the certificate of service confirming the motion was served on DHS.",
      inputs: [
        {
          id: "serviceMethod",
          label: "Method of Service on DHS",
          type: "select",
          required: true,
          helpText: "How DHS/ICE Office of Chief Counsel was served.",
          validation: {
            options: [
              { value: "ecas", label: "ECAS E-Filing (served electronically)" },
              { value: "personal", label: "Personal Delivery to DHS Office of Chief Counsel" },
              { value: "mail", label: "U.S. Mail to DHS Office of Chief Counsel" },
              { value: "certified_mail", label: "Certified Mail to DHS Office of Chief Counsel" },
            ],
          },
        },
        {
          id: "serviceDate",
          label: "Date of Service",
          type: "date",
          required: true,
          helpText: "Date the motion was served on DHS.",
        },
        {
          id: "dhsOfficeAddress",
          label: "DHS Office of Chief Counsel Address",
          type: "textarea",
          required: false,
          placeholder: "Address of the DHS/ICE Office of Chief Counsel...",
          helpText: "Address where the motion was served (required for mail service).",
          validation: {
            maxLength: 500,
          },
        },
        {
          id: "attachments",
          label: "List of Attachments / Exhibits",
          type: "textarea",
          required: false,
          placeholder: "List exhibits: Exhibit A — Copy of NTA, Exhibit B — I-797 Approval Notice, Exhibit C — Declaration of Respondent...",
          helpText: "List all exhibits and supporting documents attached to the motion.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },
  ],
};
