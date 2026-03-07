/**
 * Notice of Appeal to the Board of Immigration Appeals (BIA) — EOIR Template
 *
 * Filed after an Immigration Judge issues an adverse decision in removal proceedings.
 * The Notice of Appeal (EOIR Form EOIR-26) must be filed within 30 days of the IJ's
 * oral decision or written decision. This template generates the Notice of Appeal
 * and an accompanying Brief in Support of Appeal.
 *
 * Governed by:
 * - 8 C.F.R. § 1003.3 (filing requirements)
 * - 8 C.F.R. § 1003.5 (briefing schedule)
 * - EOIR Immigration Court Practice Manual, Chapter 6
 *
 * CRITICAL: The 30-day filing deadline is JURISDICTIONAL. Missing it forfeits
 * the right to appeal. File the EOIR-26 form immediately, even before the brief
 * is complete — the brief can follow on the briefing schedule.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, RELIEF_TYPES } from "./immigration-court-data";

export const noticeOfAppealBiaTemplate: DocumentTemplate = {
  id: "notice-of-appeal-bia",
  name: "Notice of Appeal to BIA",
  category: "immigration",
  description:
    "Filed after an Immigration Judge issues an adverse decision to appeal to the Board of Immigration Appeals (BIA). Generates both the Notice of Appeal (EOIR-26) content and an accompanying Brief in Support. The 30-day filing deadline is jurisdictional — missing it forfeits the right to appeal. Governed by 8 C.F.R. § 1003.3 and the EOIR Immigration Court Practice Manual, Chapter 6.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "30-45 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: ["EOIR"],

  baseSections: [
    // Section 1: Case Identification
    {
      id: "caseIdentification",
      name: "Case Identification",
      type: "user-input",
      order: 1,
      required: true,
      helpText: "Enter the respondent and case information as it appears in the immigration court file.",
      inputs: [
        {
          id: "respondentName",
          label: "Respondent / Appellant Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name",
          helpText: "The individual appealing the IJ's decision (the 'Respondent' in EOIR proceedings).",
        },
        {
          id: "aNumber",
          label: "A-Number",
          type: "a-number",
          required: true,
          placeholder: "XXX-XXX-XXX",
          helpText: "Alien Registration Number — required on every BIA filing.",
          validation: { pattern: "^\\d{3}-?\\d{3}-?\\d{3}$" },
        },
        {
          id: "immigrationCourt",
          label: "Immigration Court That Issued the Decision",
          type: "select",
          required: true,
          validation: { options: IMMIGRATION_COURTS },
        },
        {
          id: "immigrationCourtOther",
          label: "Other Immigration Court Name",
          type: "text",
          required: false,
          placeholder: "Enter court name if not listed above",
        },
        {
          id: "ijName",
          label: "Immigration Judge Who Issued the Decision",
          type: "text",
          placeholder: "Honorable [First] [Last]",
          required: true,
        },
        {
          id: "decisionDate",
          label: "Date of IJ Decision",
          type: "date",
          required: true,
          helpText: "The date the IJ issued the oral or written decision being appealed. The 30-day deadline runs from this date.",
        },
        {
          id: "decisionType",
          label: "Type of IJ Decision",
          type: "select",
          required: true,
          validation: {
            options: [
              { value: "oral_decision", label: "Oral Decision (issued from the bench)" },
              { value: "written_decision", label: "Written Decision" },
              { value: "in_absentia", label: "In Absentia Order of Removal" },
              { value: "denial_of_motion", label: "Denial of Motion (to Reopen, Reconsider, etc.)" },
              { value: "bond_denial", label: "Bond Denial / Denial of Bond Redetermination" },
            ],
          },
        },
        {
          id: "appealDeadline",
          label: "Appeal Filing Deadline (30 Days from Decision)",
          type: "date",
          required: true,
          helpText: "Calculate 30 calendar days from the IJ's decision date. This deadline is jurisdictional.",
        },
      ],
    },

    // Section 2: Decision Being Appealed
    {
      id: "decisionDetails",
      name: "Decision Being Appealed",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Describe what the IJ decided and what relief was denied.",
      inputs: [
        {
          id: "reliefDenied",
          label: "Form(s) of Relief Denied",
          type: "select",
          required: true,
          helpText: "Select all forms of relief that the IJ denied (primary basis for appeal)",
          validation: { options: RELIEF_TYPES },
        },
        {
          id: "ijHoldingSummary",
          label: "Summary of IJ's Decision and Reasoning",
          type: "textarea",
          placeholder: "Summarize the IJ's decision and the key findings:\n\n- What did the IJ decide? (e.g., denied asylum, ordered removal)\n- What were the IJ's stated reasons? (e.g., adverse credibility, failure to establish nexus, no particular social group)\n- Were there any factual findings you believe are wrong?\n- Were there legal errors in the IJ's analysis?",
          required: true,
          helpText: "Be specific about the IJ's findings — this drives the appeal argument",
          validation: { minLength: 100, maxLength: 2000 },
        },
        {
          id: "countryOfRemoval",
          label: "Country of Removal",
          type: "text",
          placeholder: "e.g., El Salvador",
          required: true,
          helpText: "The country to which the IJ ordered removal",
        },
        {
          id: "respondentNationality",
          label: "Respondent's Country of Origin / Nationality",
          type: "text",
          placeholder: "e.g., Guatemalan national",
          required: false,
        },
      ],
    },

    // Section 3: Grounds for Appeal
    {
      id: "groundsForAppeal",
      name: "Grounds for Appeal",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Identify the specific errors in the IJ's decision.",
      inputs: [
        {
          id: "appealGrounds",
          label: "Primary Grounds for Appeal",
          type: "select",
          required: true,
          helpText: "Select all applicable grounds",
          validation: {
            options: [
              { value: "legal_error", label: "Legal Error — IJ Applied Wrong Legal Standard" },
              { value: "factual_error", label: "Clear Error of Fact — IJ's Findings Not Supported by Record" },
              { value: "credibility_error", label: "Erroneous Adverse Credibility Finding" },
              { value: "psg_error", label: "Error in Particular Social Group (PSG) Analysis" },
              { value: "nexus_error", label: "Error in Nexus / 'On Account Of' Analysis" },
              { value: "cat_error", label: "Error in Convention Against Torture Analysis" },
              { value: "due_process", label: "Due Process Violation — Procedural Error" },
              { value: "inad_counsel", label: "Ineffective Assistance of Prior Counsel" },
              { value: "changed_conditions", label: "Changed Country Conditions Not Considered" },
              { value: "discretion_error", label: "Abuse of Discretion in Denial of Discretionary Relief" },
            ],
          },
        },
        {
          id: "specificErrors",
          label: "Specific Errors in the IJ's Decision",
          type: "textarea",
          placeholder: "Describe the specific errors with reference to the record:\n\nError 1: The IJ found adverse credibility based on minor inconsistencies about the date of the third incident, but failed to consider that [respondent] provided a plausible explanation and the inconsistency was peripheral to the core claim.\n\nError 2: The IJ's PSG analysis misapplied Hernandez-Chacon by failing to consider whether 'young men who resist gang recruitment in northern Guatemala' is cognizable — the IJ dismissed the PSG without analysis.\n\nError 3: The IJ ignored the 2024 country conditions report showing a 40% increase in targeted violence against [group].",
          required: true,
          helpText: "Be specific — cite the administrative record, the IJ's exact findings, and why they are wrong",
          validation: { minLength: 150, maxLength: 3000 },
        },
        {
          id: "requestedOutcome",
          label: "Relief Requested from BIA",
          type: "select",
          required: true,
          validation: {
            options: [
              { value: "remand_new_hearing", label: "Remand to IJ for New Hearing" },
              { value: "remand_additional_evidence", label: "Remand to IJ for Additional Evidence" },
              { value: "sustain_appeal_grant_relief", label: "Sustain Appeal and Grant Relief Directly" },
              { value: "sustain_appeal_and_remand", label: "Sustain Appeal and Remand with Instructions" },
              { value: "stay_removal", label: "Stay of Removal Pending Appeal (Emergency)" },
            ],
          },
        },
        {
          id: "stayOfRemovalNeeded",
          label: "Is an Emergency Stay of Removal Needed?",
          type: "select",
          required: true,
          helpText: "A stay of removal prevents deportation while the appeal is pending",
          validation: {
            options: [
              { value: "yes_urgent", label: "Yes — Removal is Imminent (file emergency stay immediately)" },
              { value: "yes_standard", label: "Yes — Request Stay with Appeal" },
              { value: "no", label: "No — Respondent is Not Under Immediate Threat of Removal" },
            ],
          },
        },
      ],
    },

    // Section 4: Brief in Support — Statement of the Case (AI-generated)
    {
      id: "statementOfCase",
      name: "Statement of the Case",
      type: "ai-generated",
      order: 4,
      required: true,
      helpText: "Factual and procedural summary of the case for the BIA",
      aiPromptTemplate: `Write the "Statement of the Case" section for a Brief in Support of Appeal to the Board of Immigration Appeals on behalf of {{respondentName}} (A-Number: {{aNumber}}).

IJ decision: {{ijHoldingSummary}}
Relief denied: {{reliefDenied}}
Country of removal: {{countryOfRemoval}}
Decision date: {{decisionDate}}
Decision type: {{decisionType}}

Write 2-3 paragraphs that:
1. State the procedural posture: respondent is appealing the IJ's decision dated {{decisionDate}} in {{immigrationCourt}} before Honorable {{ijName}}
2. Briefly summarize the facts of the case — who the respondent is, what country they're from, and the core basis for the relief claim
3. Summarize the IJ's decision and the outcome being appealed
4. Note any stay of removal status

Write in BIA brief style: formal, objective in the "Statement" section, citing to "the record" generally. Save the argument for the argument section.`,
      aiInstructions: "Keep this factual and procedural. The Statement of the Case should be neutral — the advocacy goes in the Argument section.",
    },

    // Section 5: Brief in Support — Argument (AI-generated)
    {
      id: "argumentSection",
      name: "Argument",
      type: "ai-generated",
      order: 5,
      required: true,
      helpText: "The legal argument explaining why the BIA should reverse or remand",
      aiPromptTemplate: `Write the "Argument" section for a Brief in Support of Appeal to the BIA on behalf of {{respondentName}}.

Primary grounds for appeal: {{appealGrounds}}

Specific errors identified by counsel:
{{specificErrors}}

Relief denied: {{reliefDenied}}
IJ's decision summary: {{ijHoldingSummary}}
Requested outcome: {{requestedOutcome}}
Country of removal: {{countryOfRemoval}}

Write a structured legal argument with:
1. A header for each ground of appeal (e.g., "I. THE IMMIGRATION JUDGE ERRED BY...")
2. For each ground:
   - State the standard of review: factual findings (clear error), legal conclusions (de novo), discretionary decisions (abuse of discretion)
   - Articulate the specific error with reference to record evidence and the IJ's stated reasoning
   - Apply the correct legal standard to the facts
   - Cite relevant BIA and circuit court precedents (Matter of [X], circuit decisions, etc.)
3. A conclusion requesting the specific relief: {{requestedOutcome}}

For asylum/PSG claims, cite: Matter of Acosta, 19 I&N Dec. 211 (BIA 1985); Matter of A-B-, applicable circuit court decisions.
For credibility, cite: REAL ID Act standard; INA § 208(b)(1)(B)(iii); circuit decisions on minor inconsistencies.
For CAT, cite: 8 C.F.R. § 1208.16-18; circuit decisions.

Use headings, be specific, and tie every argument to the specific errors in the IJ's decision.`,
      aiInstructions: "This is the core advocacy section. Use numbered/lettered headings for each argument. Cite relevant precedent for each ground. Tie the argument directly to the IJ's specific errors, not generic legal principles.",
    },

    // Section 6: Conclusion
    {
      id: "conclusion",
      name: "Conclusion",
      type: "ai-generated",
      order: 6,
      required: true,
      aiPromptTemplate: `Write a brief conclusion (1 paragraph) for {{respondentName}}'s BIA appeal brief.

Requested outcome: {{requestedOutcome}}
Relief denied: {{reliefDenied}}

The conclusion should:
- Summarize the core argument in 1-2 sentences
- Formally request the BIA to {{requestedOutcome}}
- Note any request for oral argument if warranted
- Be formal and concise`,
      aiInstructions: "Keep this brief and direct. Restate the request clearly.",
    },

    // Section 7: Stay of Removal Notice (static, conditional)
    {
      id: "stayNotice",
      name: "Stay of Removal — Important Notice",
      type: "static",
      order: 7,
      required: false,
      helpText: "Include this section if a stay of removal was requested",
      staticContent: `NOTICE REGARDING STAY OF REMOVAL

Respondent {{respondentName}} has requested a stay of removal pending this appeal. Pursuant to 8 C.F.R. § 1003.6, a motion for stay of removal must be filed concurrently with or before the filing of this Notice of Appeal.

If removal is IMMINENT: File a separate Emergency Motion for Stay of Removal with the BIA immediately. A stay is not automatic upon filing a Notice of Appeal unless the respondent was convicted of certain crimes — counsel must affirmatively request it.

Filing a Notice of Appeal does NOT automatically stay removal unless:
- The respondent is subject to the automatic stay provisions of 8 C.F.R. § 1003.6(b); OR
- The BIA grants a stay upon motion.

If removal is imminent, contact the BIA's Emergency Stay Unit and simultaneously contact ICE/ERO to advise of the pending appeal.`,
    },

    // Section 8: Attorney Info
    {
      id: "attorneyInfo",
      name: "Attorney Information",
      type: "user-input",
      order: 8,
      required: true,
      inputs: [
        {
          id: "attorneyName",
          label: "Attorney Name",
          type: "text",
          placeholder: "Full name",
          required: true,
        },
        {
          id: "firmName",
          label: "Firm / Organization",
          type: "text",
          required: false,
        },
        {
          id: "address",
          label: "Address",
          type: "textarea",
          placeholder: "Street address, City, State, ZIP",
          required: true,
        },
        {
          id: "phone",
          label: "Phone",
          type: "text",
          required: true,
        },
        {
          id: "email",
          label: "Email",
          type: "text",
          required: false,
        },
        {
          id: "eoirNumber",
          label: "EOIR ID Number",
          type: "text",
          required: false,
        },
      ],
    },

    // Section 9: Certificate of Service
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 9,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date indicated below, I served a copy of the foregoing Notice of Appeal and Brief in Support upon the DHS/ICE Office of Chief Counsel by [ECAS e-filing / first-class mail / hand delivery].

_________________________________
[Attorney Name]
Date: _______________________

⚠️ FILING DEADLINE REMINDER: This Notice of Appeal must be received by the Board of Immigration Appeals within 30 calendar days of the IJ's decision. Late filings are not accepted. File EOIR Form EOIR-26 with the BIA directly. Confirm receipt.`,
    },
  ],
};
