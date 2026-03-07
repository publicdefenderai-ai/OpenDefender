/**
 * Motion to Administratively Close Proceedings — EOIR Immigration Court Template
 *
 * Requests the Immigration Judge to administratively close removal proceedings
 * to pause the case while a related matter is resolved elsewhere (e.g., pending
 * USCIS adjudication, criminal case resolution, U visa, VAWA, or other relief).
 *
 * Administrative closure removes the case from the active docket without a final
 * order. Either party may move to recalendar at any time.
 *
 * Governed by Matter of Avetisyan, 25 I&N Dec. 688 (BIA 2012) and
 * Matter of W-Y-U-, 27 I&N Dec. 17 (BIA 2017).
 *
 * NOTE: Administrative closure was significantly restricted following Matter of
 * Castro-Tum, 27 I&N Dec. 271 (A.G. 2018), but restored by Matter of Cruz Valdez,
 * 28 I&N Dec. 326 (A.G. 2021). As of 2025, IJs have authority to administratively
 * close when both parties agree, or under Avetisyan when one party objects.
 */

import type { DocumentTemplate } from "./schema";
import { IMMIGRATION_COURTS, FILING_METHODS } from "./immigration-court-data";

export const motionToAdministrativelyCloseEoirTemplate: DocumentTemplate = {
  id: "motion-to-administratively-close-eoir",
  name: "Motion to Administratively Close",
  category: "immigration",
  description:
    "Requests the Immigration Judge to administratively close removal proceedings to pause the case while a related matter is pending elsewhere — such as a USCIS application, pending U visa or VAWA petition, criminal case resolution, or other relief. Administrative closure removes the case from the active docket without a final order of removal. Governed by Matter of Avetisyan, 25 I&N Dec. 688 (BIA 2012) and Matter of W-Y-U-, 27 I&N Dec. 17 (BIA 2017), and restored as IJ authority under Matter of Cruz Valdez, 28 I&N Dec. 326 (A.G. 2021).",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "20-30 minutes",
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
      helpText: "Enter the immigration court and respondent information.",
      inputs: [
        {
          id: "immigrationCourt",
          label: "Immigration Court",
          type: "select",
          required: true,
          helpText: "Select the EOIR immigration court where the case is pending.",
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
          id: "respondentName",
          label: "Respondent Name",
          type: "party-name",
          required: true,
          placeholder: "Full legal name",
          helpText: "The individual in removal proceedings.",
        },
        {
          id: "aNumber",
          label: "A-Number",
          type: "a-number",
          required: true,
          placeholder: "XXX-XXX-XXX",
          helpText: "Alien Registration Number assigned by DHS.",
          validation: { pattern: "^\\d{3}-?\\d{3}-?\\d{3}$" },
        },
        {
          id: "hearingDate",
          label: "Next Scheduled Hearing Date",
          type: "date",
          required: false,
          helpText: "The next scheduled hearing at which this motion will be filed or presented.",
        },
        {
          id: "ijName",
          label: "Immigration Judge",
          type: "text",
          placeholder: "Honorable [First] [Last]",
          required: false,
          helpText: "Name of the presiding Immigration Judge.",
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
      inputs: [
        {
          id: "filingMethod",
          label: "Filing Method",
          type: "select",
          required: true,
          validation: { options: FILING_METHODS },
        },
        {
          id: "dhsPosition",
          label: "DHS / ICE Position on This Motion",
          type: "select",
          required: true,
          helpText: "Whether DHS agrees or objects to administrative closure",
          validation: {
            options: [
              { value: "agrees", label: "DHS Agrees to Administrative Closure" },
              { value: "objects", label: "DHS Objects to Administrative Closure" },
              { value: "no_objection", label: "DHS Has No Objection" },
              { value: "unknown", label: "DHS Position Not Yet Known" },
            ],
          },
        },
        {
          id: "dhsPositionDetails",
          label: "DHS Position Details (if known)",
          type: "textarea",
          required: false,
          placeholder: "e.g., ICE counsel indicated agreement by email on [date]. OR: DHS objects, citing [reason].",
          validation: { maxLength: 400 },
        },
      ],
    },

    // Section 3: Basis for Closure
    {
      id: "basisForClosure",
      name: "Basis for Administrative Closure",
      type: "user-input",
      order: 3,
      required: true,
      helpText: "Identify the pending matter or proceeding that justifies pausing removal proceedings",
      inputs: [
        {
          id: "closureBasis",
          label: "Primary Basis for Closure",
          type: "select",
          required: true,
          validation: {
            options: [
              { value: "pending_uscis_application", label: "Pending USCIS Application (I-485, I-130, I-360, etc.)" },
              { value: "pending_u_visa", label: "Pending U Visa Petition (I-918)" },
              { value: "pending_vawa", label: "Pending VAWA Self-Petition (I-360)" },
              { value: "pending_t_visa", label: "Pending T Visa Petition (I-914)" },
              { value: "pending_criminal_case", label: "Pending Criminal Case — Awaiting Resolution" },
              { value: "deferred_action", label: "Pending Deferred Action / Prosecutorial Discretion Request" },
              { value: "pending_parole", label: "Pending Parole in Place (PIP)" },
              { value: "medical_treatment", label: "Ongoing Critical Medical Treatment" },
              { value: "daca", label: "Pending DACA Application or Renewal" },
              { value: "other", label: "Other — Explain Below" },
            ],
          },
        },
        {
          id: "pendingMatterDescription",
          label: "Description of Pending Matter",
          type: "textarea",
          placeholder: "Describe the pending matter in detail:\n\n- What is the pending application or proceeding?\n- What is the filing/receipt date?\n- What is the expected timeline for resolution?\n- What evidence shows the application is bona fide?\n\nExample: Respondent filed a U visa petition (Form I-918) with USCIS on [date], receipt number [XXX]. U visas are subject to an annual cap of 10,000 and current processing times are 4-6 years. Respondent is a victim of [crime] and has obtained law enforcement certification. A grant of U visa status would confer lawful status and a pathway to adjustment.",
          required: true,
          helpText: "Be specific about dates, receipt numbers, expected timelines, and why the pending matter is bona fide",
          validation: { minLength: 100, maxLength: 2000 },
        },
        {
          id: "respondentProfile",
          label: "Respondent's Background and Equities",
          type: "textarea",
          placeholder: "e.g., Length of time in the United States; family ties (U.S. citizen or LPR spouse/children); employment; community ties; no criminal record or minor/old record; health issues; hardship to family if removed",
          required: true,
          helpText: "Factors supporting closure — ties to the U.S., family, hardship, length of residence",
          validation: { minLength: 50, maxLength: 1500 },
        },
        {
          id: "harmFromProceeding",
          label: "Harm if Proceedings Are Not Closed",
          type: "textarea",
          placeholder: "e.g., If removal proceedings continue while the U visa is pending, respondent faces removal before the petition can be adjudicated, rendering the petition moot. Respondent's two U.S. citizen children would lose their primary caregiver.",
          required: false,
          helpText: "Concrete harm or prejudice if the motion is denied and proceedings continue",
          validation: { maxLength: 800 },
        },
      ],
    },

    // Section 4: Avetisyan Factors (static reference)
    {
      id: "legalStandard",
      name: "Legal Standard",
      type: "static",
      order: 4,
      required: true,
      staticContent: `LEGAL STANDARD

Immigration Judges have inherent authority to administratively close proceedings. Matter of Avetisyan, 25 I&N Dec. 688 (BIA 2012); Matter of Cruz Valdez, 28 I&N Dec. 326 (A.G. 2021). Administrative closure removes a case from the active docket without a final order of removal, allowing both parties to seek recalendaring at any time. Matter of W-Y-U-, 27 I&N Dec. 17 (BIA 2017).

When both parties agree, administrative closure is appropriate absent exceptional circumstances. Matter of Avetisyan, 25 I&N Dec. at 696. When one party objects, the Immigration Judge must weigh the following non-exhaustive factors from Avetisyan:

1. The likelihood the pending matter will be resolved;
2. The anticipated duration of the closure;
3. The absence of an order of supervision (or compliance with one if it exists);
4. The respondent's compliance with the terms of any current bond;
5. The pendency of concurrent proceedings that involve the respondent;
6. The nature of the relief sought in the concurrent proceeding and its likelihood of success; and
7. The equities at issue, including but not limited to the respondent's length of residence, community ties, and family circumstances.`,
    },

    // Section 5: Argument (AI-generated)
    {
      id: "argument",
      name: "Argument",
      type: "ai-generated",
      order: 5,
      required: true,
      aiPromptTemplate: `Write the legal argument section for a Motion to Administratively Close Proceedings in immigration court on behalf of {{respondentName}} (A-Number: {{aNumber}}) before the {{immigrationCourt}} Immigration Court.

Primary basis for closure: {{closureBasis}}

Description of pending matter:
{{pendingMatterDescription}}

Respondent's background and equities:
{{respondentProfile}}

Harm if proceedings are not closed:
{{harmFromProceeding}}

DHS position: {{dhsPosition}}
DHS position details: {{dhsPositionDetails}}

Write 3-5 paragraphs arguing for administrative closure that:

1. State the request: that the Court administratively close proceedings pending resolution of [the pending matter]

2. If DHS agrees: emphasize that agreement is itself sufficient under Avetisyan absent exceptional circumstances

3. If DHS objects: analyze the Avetisyan factors one by one, applying the specific facts:
   - The pending matter is bona fide and likely to succeed (explain why)
   - The duration, while uncertain, is finite and defined by the pending proceeding's timeline
   - Respondent has complied with bond/supervision conditions
   - The nature of the relief (e.g., U visa → lawful status) would resolve the removal proceedings entirely if granted
   - The equities strongly favor closure: [length of residence, family ties, etc.]

4. Emphasize the waste of judicial resources in proceeding to removal while a USCIS adjudication is pending that could moot those proceedings

5. Close by stating the relief requested

Cite Matter of Avetisyan, 25 I&N Dec. 688 (BIA 2012); Matter of W-Y-U-, 27 I&N Dec. 17 (BIA 2017); and Matter of Cruz Valdez, 28 I&N Dec. 326 (A.G. 2021).`,
      aiInstructions: "Apply the Avetisyan factors directly to the facts. If DHS agrees, the argument is shorter. If DHS objects, analyze each factor with specificity. Always emphasize the judicial efficiency argument.",
    },

    // Section 6: Prayer for Relief (static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 6,
      required: true,
      staticContent: `CONCLUSION

For the foregoing reasons, Respondent {{respondentName}} respectfully requests that this Court:

1. Administratively close these removal proceedings pending the resolution of the matter described herein;

2. Retain jurisdiction to recalendar the proceedings upon motion by either party; and

3. Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

_________________________________
[Attorney Name]
[Firm / Organization]
[Address]
[Phone]
[Email]

Counsel for Respondent {{respondentName}}

Date: _______________________`,
    },

    // Section 7: Attorney Info
    {
      id: "attorneyInfo",
      name: "Attorney Information",
      type: "user-input",
      order: 7,
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
          placeholder: "e.g., Immigration Law Clinic",
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
          placeholder: "(xxx) xxx-xxxx",
          required: true,
        },
        {
          id: "email",
          label: "Email",
          type: "text",
          placeholder: "attorney@example.com",
          required: false,
        },
        {
          id: "eoirNumber",
          label: "EOIR ID Number",
          type: "text",
          placeholder: "e.g., EOIR-XXXXXXX",
          required: false,
          helpText: "Attorney's EOIR registration number, if applicable",
        },
      ],
    },

    // Section 8: Certificate of Service
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 8,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date indicated below, I served a copy of the foregoing Motion to Administratively Close Proceedings upon the DHS/ICE Office of Chief Counsel by [ECAS e-filing / first-class mail / hand delivery].

_________________________________
[Attorney Name]
Date: _______________________`,
    },
  ],
};
