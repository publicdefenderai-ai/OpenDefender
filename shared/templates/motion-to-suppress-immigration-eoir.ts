/**
 * Motion to Suppress Evidence — EOIR Immigration Court Template
 *
 * Motion to suppress evidence obtained through Fourth Amendment violations
 * in immigration proceedings. Governed by INS v. Lopez-Mendoza, 468 U.S.
 * 1032 (1984) and its "egregious violation" exception.
 *
 * Filed when DHS/ICE obtained evidence through unlawful stops, searches,
 * or seizures that are so egregious they undermine the reliability of the
 * evidence or fundamental fairness. Distinct from criminal suppression —
 * higher bar applies in immigration court.
 *
 * Nationally uniform — no jurisdiction variants needed.
 * Follows EOIR Immigration Court Practice Manual formatting.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, PROCEEDING_TYPES, FILING_METHODS } from "./immigration-court-data";

const EVIDENCE_TYPES = [
  { value: "physical_evidence", label: "Physical Evidence" },
  { value: "identity_documents", label: "Identity Documents" },
  { value: "statements", label: "Statements / Admissions" },
  { value: "travel_records", label: "Travel Records" },
  { value: "employment_records", label: "Employment Records" },
  { value: "biometric_data", label: "Biometric Data" },
  { value: "other", label: "Other Evidence" },
];

const OBTAINING_AGENCIES = [
  { value: "ice_ero", label: "ICE Enforcement and Removal Operations (ERO)" },
  { value: "cbp", label: "Customs and Border Protection (CBP)" },
  { value: "hsi", label: "Homeland Security Investigations (HSI)" },
  { value: "ice_deportation_officer", label: "ICE Deportation Officer" },
  { value: "local_police_287g", label: "Local Police Under 287(g) Agreement" },
  { value: "joint_task_force", label: "Joint Task Force" },
  { value: "other", label: "Other Agency" },
];

const VIOLATION_TYPES = [
  { value: "warrantless_home_entry", label: "Warrantless Home Entry" },
  { value: "racial_profiling_stop", label: "Racial Profiling Stop" },
  { value: "workplace_raid_without_warrant", label: "Workplace Raid Without Warrant" },
  { value: "prolonged_detention_without_probable_cause", label: "Prolonged Detention Without Probable Cause" },
  { value: "coerced_statements", label: "Coerced Statements" },
  { value: "warrantless_vehicle_search", label: "Warrantless Vehicle Search" },
  { value: "neighborhood_sweep", label: "Neighborhood Sweep" },
  { value: "checkpoint_violation", label: "Checkpoint Violation" },
  { value: "other", label: "Other Constitutional Violation" },
];

const BODYCAM_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "not_available", label: "Not Available" },
  { value: "requested_but_denied", label: "Requested but Denied" },
  { value: "unknown", label: "Unknown" },
];

const RELIEF_SOUGHT_OPTIONS = [
  { value: "suppress_all_evidence", label: "Suppress All Evidence Obtained Through Violation" },
  { value: "suppress_specific_evidence", label: "Suppress Specific Evidence Only" },
  { value: "terminate_proceedings", label: "Terminate Proceedings" },
  { value: "both_suppress_and_terminate", label: "Both Suppress Evidence and Terminate Proceedings" },
];

export const motionToSuppressImmigrationEoirTemplate: DocumentTemplate = {
  id: "motion-to-suppress-immigration-eoir",
  name: "Motion to Suppress Evidence (Immigration)",
  category: "immigration",
  description:
    "Motion to suppress evidence obtained through Fourth Amendment violations in immigration proceedings. Governed by INS v. Lopez-Mendoza, 468 U.S. 1032 (1984) and its \"egregious violation\" exception. Filed when DHS/ICE obtained evidence through unlawful stops, searches, or seizures that are so egregious they undermine the reliability of the evidence or fundamental fairness. Distinct from criminal suppression — higher bar applies in immigration court.",
  version: "1.0.0",
  lastUpdated: new Date("2026-02-11"),
  estimatedCompletionTime: "25-35 minutes",
  difficultyLevel: "advanced",
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
      id: "evidenceDetails",
      name: "Evidence Details",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Describe the evidence sought to be suppressed and how it was obtained.",
      inputs: [
        {
          id: "evidenceType",
          label: "Type of Evidence to Suppress",
          type: "select",
          required: true,
          helpText: "Select the type of evidence obtained through the alleged constitutional violation.",
          validation: {
            options: EVIDENCE_TYPES,
          },
        },
        {
          id: "evidenceDescription",
          label: "Description of Evidence",
          type: "textarea",
          required: true,
          placeholder: "Describe the specific evidence sought to be suppressed, including how it was obtained and its significance to the removal proceedings...",
          helpText: "Provide a detailed description of the evidence, including what it is, how DHS/ICE obtained it, and how DHS intends to use it in proceedings.",
        },
        {
          id: "dateObtained",
          label: "Date Evidence Was Obtained",
          type: "date",
          required: true,
          helpText: "The date the evidence was obtained by the government agency.",
        },
        {
          id: "locationObtained",
          label: "Location Where Evidence Was Obtained",
          type: "text",
          required: true,
          placeholder: "Address or location where evidence was obtained",
          helpText: "The specific location where the evidence was seized or obtained (e.g., home address, workplace, roadway).",
        },
        {
          id: "obtainingAgency",
          label: "Agency That Obtained Evidence",
          type: "select",
          required: true,
          helpText: "The government agency that obtained the evidence sought to be suppressed.",
          validation: {
            options: OBTAINING_AGENCIES,
          },
        },
      ],
    },

    {
      id: "constitutionalViolation",
      name: "Constitutional Violation",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Describe the Fourth Amendment violation and why it rises to the 'egregious' level required by INS v. Lopez-Mendoza.",
      inputs: [
        {
          id: "violationType",
          label: "Type of Constitutional Violation",
          type: "select",
          required: true,
          helpText: "Select the type of Fourth Amendment violation that occurred.",
          validation: {
            options: VIOLATION_TYPES,
          },
        },
        {
          id: "factualBasis",
          label: "Factual Basis for Suppression",
          type: "textarea",
          required: true,
          placeholder: "Describe in detail the facts surrounding the constitutional violation: what happened, who was involved, what was said, what actions were taken by agents, and how the evidence was obtained as a result...",
          helpText: "Provide a detailed factual narrative of the constitutional violation. Include specifics about the encounter with law enforcement, what agents did and said, whether consent was obtained (and if so, whether it was voluntary), and any use of force or coercion.",
          validation: {
            minLength: 100,
            maxLength: 3000,
          },
        },
        {
          id: "egregiousnessFactors",
          label: "Egregiousness Factors",
          type: "textarea",
          required: true,
          placeholder: "Explain why this violation rises to the 'egregious' level required by Lopez-Mendoza. Consider: Was there a widespread pattern of violations? Did agents deliberately disregard constitutional rights? Was there physical force, coercion, or racial profiling? Did the violation shock the conscience?...",
          helpText: "Under INS v. Lopez-Mendoza, the exclusionary rule applies in immigration proceedings only when the violation is 'egregious.' Explain why this violation meets that heightened standard — e.g., deliberate misconduct, pattern of abuse, use of force, racial profiling, or conduct that shocks the conscience.",
        },
        {
          id: "witnessesPresent",
          label: "Witnesses Present During Violation",
          type: "textarea",
          required: false,
          placeholder: "List any witnesses who observed the constitutional violation and can provide testimony...",
          helpText: "Identify any witnesses who observed the events, including family members, neighbors, coworkers, or bystanders.",
        },
        {
          id: "bodycamOrDocumentation",
          label: "Body Camera or Documentary Evidence",
          type: "select",
          required: true,
          helpText: "Indicate whether body camera footage or other documentation of the encounter exists.",
          validation: {
            options: BODYCAM_OPTIONS,
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
      helpText: "AI will draft the legal argument for suppression based on the facts and violation described.",
      aiPromptTemplate:
        "Generate a legal argument for a Motion to Suppress Evidence in immigration court. The proceeding type is {{proceedingType}}. Evidence type: {{evidenceType}}. Evidence description: {{evidenceDescription}}. Date obtained: {{dateObtained}}. Location: {{locationObtained}}. Obtaining agency: {{obtainingAgency}}. Violation type: {{violationType}}. Factual basis: {{factualBasis}}. Egregiousness factors: {{egregiousnessFactors}}. {{#if witnessesPresent}}Witnesses: {{witnessesPresent}}.{{/if}} Body camera/documentation status: {{bodycamOrDocumentation}}. Relief sought: {{reliefSought}}. {{#if additionalRelief}}Additional relief: {{additionalRelief}}.{{/if}}",
      aiInstructions:
        "Draft a formal legal argument section for a Motion to Suppress Evidence before an EOIR immigration court. Structure the argument as follows: (1) Introduction and procedural posture, (2) Legal framework — explain that the exclusionary rule has limited application in immigration proceedings under INS v. Lopez-Mendoza, 468 U.S. 1032 (1984), but that evidence must be suppressed when obtained through 'egregious' Fourth Amendment violations, (3) Define the egregious violation standard — cite Oliva-Ramos v. Att'y Gen., 694 F.3d 259 (3d Cir. 2012) (widespread pattern of violations or deliberate violations undermining Fourth Amendment), Lopez-Rodriguez v. Mukasey, 536 F.3d 1012 (9th Cir. 2008) (suppression required when violation is egregious), and other circuit-specific approaches, (4) Apply the facts to the egregious violation standard — explain why this particular violation crosses the threshold, (5) Address the 'but-for' causation test — demonstrate that the evidence would not have been obtained but for the constitutional violation, (6) Address any government arguments for attenuation or independent source doctrine, (7) Conclusion requesting suppression and/or termination. Use formal legal writing style appropriate for EOIR filings. Do not fabricate case citations.",
    },

    {
      id: "reliefRequested",
      name: "Relief Requested",
      type: "user-input",
      order: 6,
      required: true,
      helpText: "Specify the relief sought in this motion.",
      inputs: [
        {
          id: "reliefSought",
          label: "Relief Sought",
          type: "select",
          required: true,
          helpText: "Select the type of relief requested from the Immigration Judge.",
          validation: {
            options: RELIEF_SOUGHT_OPTIONS,
          },
        },
        {
          id: "additionalRelief",
          label: "Additional Relief or Notes",
          type: "textarea",
          required: false,
          placeholder: "Describe any additional relief requested, such as a request for an evidentiary hearing on the suppression motion, or specific evidence to be excluded...",
          helpText: "Include any additional relief or notes, such as requesting an evidentiary hearing or specifying particular items of evidence for suppression.",
          validation: {
            maxLength: 2000,
          },
        },
      ],
    },
  ],
};

export default motionToSuppressImmigrationEoirTemplate;
