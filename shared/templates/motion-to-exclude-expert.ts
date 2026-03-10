/**
 * Motion to Exclude Expert Witness (Daubert/Frye) Template
 *
 * Criminal law document challenging the admissibility of expert testimony
 * under Daubert (federal and most states) or Frye (some states). Argues
 * that the expert's methodology lacks scientific reliability, the expert
 * is not qualified, or the testimony would not assist the trier of fact.
 *
 * Federal standard: Daubert v. Merrell Dow Pharmaceuticals, 509 U.S. 579 (1993)
 * and Federal Rule of Evidence 702, as amended. The trial court acts as
 * gatekeeper — it must conduct an independent assessment of reliability
 * before permitting expert testimony. Kumho Tire Co. v. Carmichael,
 * 526 U.S. 137 (1999) extended Daubert to all expert testimony, not merely
 * "scientific" knowledge.
 *
 * Frye standard (some states): General acceptance in the relevant scientific
 * community is the sole criterion. Frye v. United States, 293 F. 1013
 * (D.C. Cir. 1923).
 *
 * Available pre-trial (via motion in limine) and during trial (via objection
 * and motion to strike). A pre-trial Daubert hearing is strongly preferred
 * to avoid jury exposure to inadmissible evidence.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "./schema";

// ============================================================================
// Section Inputs
// ============================================================================

const captionInputs: TemplateInput[] = [
  {
    id: "courtName",
    label: "Court Name",
    type: "court-name",
    placeholder: "e.g., United States District Court, Northern District of Illinois",
    required: true,
    helpText: "The full name of the court where the case is pending",
  },
  {
    id: "caseNumber",
    label: "Case Number",
    type: "case-number",
    placeholder: "e.g., 2024-CR-001234",
    required: true,
    helpText: "The assigned case or docket number",
  },
  {
    id: "defendantName",
    label: "Defendant Name",
    type: "party-name",
    placeholder: "Full legal name",
    required: true,
    helpText: "The defendant's full legal name as it appears in court records",
  },
  {
    id: "prosecutorName",
    label: "Prosecutor / People / United States",
    type: "party-name",
    placeholder: "e.g., The People of the State of California",
    required: true,
    helpText: "The name of the prosecuting party",
  },
  {
    id: "judgeName",
    label: "Presiding Judge",
    type: "text",
    placeholder: "Honorable [First] [Last]",
    required: false,
    helpText: "Name of the presiding judge",
  },
  {
    id: "hearingDate",
    label: "Hearing Date",
    type: "date",
    required: false,
    helpText: "Date of the hearing at which this motion will be presented (if scheduled)",
  },
];

const expertInfoInputs: TemplateInput[] = [
  {
    id: "expertName",
    label: "Expert Witness Name",
    type: "party-name",
    placeholder: "e.g., Dr. Jane Smith",
    required: true,
    helpText: "Full name of the prosecution's expert witness",
  },
  {
    id: "expertTitle",
    label: "Expert's Professional Title / Credentials",
    type: "text",
    placeholder: "e.g., Ph.D., Forensic Chemist; Special Agent, ATF",
    required: true,
    helpText: "The expert's stated professional title, degrees, and credentials as disclosed by the prosecution",
  },
  {
    id: "expertFieldOfTestimony",
    label: "Proposed Field of Expert Testimony",
    type: "text",
    placeholder: "e.g., forensic DNA analysis, fire investigation, cell site location analysis (CSLA)",
    required: true,
    helpText: "The specific subject-matter area in which the expert claims expertise",
  },
  {
    id: "expertTestimonySummary",
    label: "Summary of Proposed Testimony",
    type: "textarea",
    placeholder: "Describe what the prosecution's expert intends to testify about — the specific opinions, findings, or conclusions the expert will offer at trial...",
    required: true,
    helpText: "Summarize the expert's anticipated testimony based on expert disclosures, reports, or prior hearings",
    validation: { minLength: 50, maxLength: 2000 },
  },
];

const admissibilityStandardInputs: TemplateInput[] = [
  {
    id: "admissibilityStandard",
    label: "Applicable Admissibility Standard",
    type: "select",
    required: true,
    helpText: "Select the controlling standard for expert admissibility in this jurisdiction",
    validation: {
      options: [
        { value: "daubert_federal", label: "Daubert (Federal — FRE 702)" },
        { value: "daubert_state", label: "Daubert (State variant — most states)" },
        { value: "frye", label: "Frye — General Acceptance (NY, FL, and others)" },
        { value: "kelly_california", label: "Kelly/Frye (California — novel scientific evidence)" },
        { value: "kelly_texas", label: "Kelly (Texas — Tex. R. Evid. 702 / Nenno)" },
      ],
    },
  },
];

const groundsForExclusionInputs: TemplateInput[] = [
  {
    id: "groundNotQualified",
    label: "Ground: Expert Not Qualified",
    type: "checkbox",
    required: false,
    helpText: "Check if the expert lacks the education, training, experience, or skill required to opine in this field",
    defaultValue: "false",
  },
  {
    id: "groundMethodologyUnreliable",
    label: "Ground: Methodology Unreliable / Untestable",
    type: "checkbox",
    required: false,
    helpText: "Check if the expert's methodology cannot be or has not been tested",
    defaultValue: "false",
  },
  {
    id: "groundNotPeerReviewed",
    label: "Ground: Not Peer-Reviewed / Not Published",
    type: "checkbox",
    required: false,
    helpText: "Check if the methodology has not been subject to peer review or publication in recognized scientific literature",
    defaultValue: "false",
  },
  {
    id: "groundHighErrorRate",
    label: "Ground: High or Unknown Error Rate",
    type: "checkbox",
    required: false,
    helpText: "Check if the methodology has a high known error rate, or if the error rate is unknown or unstated",
    defaultValue: "false",
  },
  {
    id: "groundNotGenerallyAccepted",
    label: "Ground: Not Generally Accepted in the Scientific Community",
    type: "checkbox",
    required: false,
    helpText: "Check if the methodology has not achieved general acceptance in the relevant scientific or professional community (critical under Frye; one Daubert factor)",
    defaultValue: "false",
  },
  {
    id: "groundNotRelevant",
    label: "Ground: Testimony Would Not Assist the Trier of Fact",
    type: "checkbox",
    required: false,
    helpText: "Check if the testimony does not relate to a fact in issue or exceeds what a lay juror requires expert explanation for",
    defaultValue: "false",
  },
  {
    id: "groundUnfairlyPrejudicial",
    label: "Ground: Unfairly Prejudicial / Should Be Excluded Under FRE 403",
    type: "checkbox",
    required: false,
    helpText: "Check if the danger of unfair prejudice, confusing the issues, or misleading the jury substantially outweighs any probative value",
    defaultValue: "false",
  },
];

const factualBasisInputs: TemplateInput[] = [
  {
    id: "qualificationDeficiencies",
    label: "Specific Deficiencies in Expert's Qualifications",
    type: "textarea",
    placeholder: "e.g., Expert holds a bachelor's degree in biology but no advanced degree or certification in forensic DNA analysis. Expert has not published peer-reviewed work. Expert's only professional experience is with law enforcement, creating confirmation bias. Expert has never been accepted as an expert in DNA in any federal court.",
    required: false,
    helpText: "Required if 'Expert Not Qualified' is selected. Be specific about gaps in education, training, experience, or certifications.",
    validation: { maxLength: 1500 },
  },
  {
    id: "methodologyFlaws",
    label: "Specific Flaws in Methodology",
    type: "textarea",
    placeholder: "e.g., Expert employed a non-standardized protocol not recognized by the Scientific Working Group for Forensic DNA Analysis (SWGDAM). Expert deviated from laboratory's own standard operating procedures. No proficiency testing data was provided. The specific technique used (probabilistic genotyping software TrueAllele) has an error rate that the prosecution has not disclosed.",
    required: false,
    helpText: "Required if 'Methodology Unreliable' or 'High Error Rate' is selected. Address the specific Daubert factors: testability, peer review, error rate, and general acceptance.",
    validation: { maxLength: 2000 },
  },
  {
    id: "scientificCommunityRejection",
    label: "Evidence of Lack of General Acceptance",
    type: "textarea",
    placeholder: "e.g., Multiple peer-reviewed studies have questioned the reliability of bite-mark analysis. The National Academy of Sciences 2009 report 'Strengthening Forensic Science in the United States' found that bite-mark evidence lacks scientific validity. The PCAST 2016 report concluded that bite-mark analysis is 'far from ready' for courtroom use.",
    required: false,
    helpText: "Cite scientific literature, government reports, court decisions, or other authority showing the methodology is not accepted",
    validation: { maxLength: 1500 },
  },
  {
    id: "relevanceAndPrejudice",
    label: "Why Testimony Would Not Assist or Would Unfairly Prejudice",
    type: "textarea",
    placeholder: "e.g., The expert's statistical probability testimony — expressing a match probability of 1 in 1 trillion — will mislead jurors into treating a statistical calculation as proof of guilt, when in fact the statistic does not account for laboratory error, sample contamination, or database limitations. The 'CSI effect' means jurors will give this testimony undue weight.",
    required: false,
    helpText: "Required if relevance or prejudice grounds are selected. Explain why exclusion or a limiting instruction is warranted.",
    validation: { maxLength: 1500 },
  },
];

const hearingRequestInputs: TemplateInput[] = [
  {
    id: "daubertHearingRequested",
    label: "Request Daubert / Frye Hearing?",
    type: "select",
    required: true,
    helpText: "A pre-trial hearing allows the court to assess reliability outside the jury's presence",
    validation: {
      options: [
        { value: "yes", label: "Yes — request an evidentiary hearing" },
        { value: "no", label: "No — submit on the papers" },
        { value: "in_alternative", label: "In the alternative — request hearing only if the court does not exclude on the papers" },
      ],
    },
  },
  {
    id: "defenseExpertName",
    label: "Defense Counter-Expert (if any)",
    type: "party-name",
    placeholder: "e.g., Dr. John Doe, Ph.D.",
    required: false,
    helpText: "If the defense has retained its own expert to rebut the prosecution's expert, provide their name here",
  },
  {
    id: "defenseExpertCredentials",
    label: "Defense Expert's Credentials / Field",
    type: "text",
    placeholder: "e.g., Ph.D. in Molecular Biology, 20 years forensic DNA research",
    required: false,
    helpText: "Brief summary of defense expert's qualifications (optional — include only if defense expert has been identified)",
  },
];

const attorneyInputs: TemplateInput[] = [
  {
    id: "attorneyName",
    label: "Attorney Name",
    type: "text",
    placeholder: "Full name",
    required: true,
  },
  {
    id: "firmName",
    label: "Firm / Office Name",
    type: "text",
    placeholder: "e.g., Public Defender, County of Riverside",
    required: false,
  },
  {
    id: "barNumber",
    label: "Bar Number",
    type: "text",
    placeholder: "e.g., State Bar No. 123456",
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
];

// ============================================================================
// Static Content
// ============================================================================

const federalLegalStandardContent = `LEGAL STANDARD

I.  THE TRIAL COURT HAS A GATEKEEPING OBLIGATION UNDER FRE 702 AND DAUBERT.

Federal Rule of Evidence 702 governs the admissibility of expert testimony. As amended in 2023, Rule 702 provides that a witness may testify in the form of an opinion only if:

    (a) the expert's scientific, technical, or other specialized knowledge will help the trier of fact to understand the evidence or to determine a fact in issue;
    (b) the testimony is based on sufficient facts or data;
    (c) the testimony is the product of reliable principles and methods; and
    (d) the expert's opinion reflects a reliable application of the principles and methods to the facts of the case.

Fed. R. Evid. 702. The proponent of the expert testimony bears the burden of demonstrating admissibility by a preponderance of the evidence. Id. advisory committee's note (2000).

The Supreme Court held in Daubert v. Merrell Dow Pharmaceuticals, Inc., 509 U.S. 579 (1993), that Rule 702 imposes a gatekeeping obligation on the trial court to assess the reliability and relevance of expert testimony before it is presented to the jury. The Court identified non-exhaustive factors relevant to the reliability inquiry: (1) whether the theory or technique can be and has been tested; (2) whether it has been subjected to peer review and publication; (3) the known or potential rate of error; and (4) whether the methodology enjoys general acceptance in the relevant scientific community. Id. at 593–94.

In Kumho Tire Co. v. Carmichael, 526 U.S. 137 (1999), the Court extended Daubert's gatekeeping function to all expert testimony, not merely "scientific" knowledge. The trial court has "considerable leeway in deciding in a particular case how to go about determining whether particular expert testimony is reliable." Id. at 152.

The 2023 amendment to Rule 702 clarified that the court — not the jury — must find by a preponderance of the evidence that the admissibility requirements are satisfied before expert testimony is admitted. Fed. R. Evid. 702 advisory committee's note (2023). This forecloses the argument that disputes about expert qualifications or methodology go to weight rather than admissibility.`;

// ============================================================================
// Template Definition
// ============================================================================

export const motionToExcludeExpertTemplate: DocumentTemplate = {
  id: "motion-to-exclude-expert",
  name: "Motion to Exclude Expert Witness",
  category: "criminal",
  description:
    "Challenges the admissibility of expert testimony under Daubert (federal and most states) or Frye (some states). Argues that the expert's methodology lacks scientific reliability, the expert is not qualified, or the testimony would not assist the trier of fact. Available pre-trial and during trial.",
  version: "1.0.0",
  lastUpdated: new Date("2025-01-01"),
  estimatedCompletionTime: "25-40 minutes",
  difficultyLevel: "advanced",
  requiresAttorneyVerification: true,
  supportedJurisdictions: [],

  baseSections: [
    // Section 1: Caption
    {
      id: "caption",
      name: "Case Caption",
      type: "user-input",
      order: 1,
      required: true,
      inputs: captionInputs,
    },

    // Section 2: Expert Information
    {
      id: "expertInfo",
      name: "Expert Witness Information",
      type: "user-input",
      order: 2,
      required: true,
      helpText: "Identify the prosecution's expert and describe the anticipated testimony",
      inputs: expertInfoInputs,
    },

    // Section 3: Applicable Standard
    {
      id: "admissibilityStandard",
      name: "Applicable Admissibility Standard",
      type: "user-input",
      order: 3,
      required: true,
      inputs: admissibilityStandardInputs,
    },

    // Section 4: Grounds for Exclusion
    {
      id: "groundsForExclusion",
      name: "Grounds for Exclusion",
      type: "user-input",
      order: 4,
      required: true,
      helpText: "Select all grounds that apply. At least one ground must be selected.",
      inputs: groundsForExclusionInputs,
    },

    // Section 5: Factual Basis
    {
      id: "factualBasis",
      name: "Factual Basis for Each Ground",
      type: "user-input",
      order: 5,
      required: true,
      helpText: "Provide specific factual support for each ground selected above",
      inputs: factualBasisInputs,
    },

    // Section 6: Hearing Request & Defense Expert
    {
      id: "hearingRequest",
      name: "Daubert / Frye Hearing Request",
      type: "user-input",
      order: 6,
      required: true,
      inputs: hearingRequestInputs,
    },

    // Section 7: Legal Standard (static — federal base)
    {
      id: "legalStandard",
      name: "Legal Standard",
      type: "static",
      order: 7,
      required: true,
      staticContent: federalLegalStandardContent,
    },

    // Section 8: Argument (AI-generated)
    {
      id: "argument",
      name: "Argument",
      type: "ai-generated",
      order: 8,
      required: true,
      helpText: "AI-generated legal argument tailored to the specific expert and grounds selected",
      aiPromptTemplate: `Write the argument section of a Motion to Exclude Expert Witness for the defense in a criminal case. The prosecution intends to call an expert in the field of "{{expertFieldOfTestimony}}". The expert's proposed testimony is:

{{expertTestimonySummary}}

Applicable admissibility standard: {{admissibilityStandard}}

GROUNDS FOR EXCLUSION RAISED (address each that applies):
- Expert Not Qualified: {{groundNotQualified}}
- Methodology Unreliable / Untestable: {{groundMethodologyUnreliable}}
- Not Peer-Reviewed / Not Published: {{groundNotPeerReviewed}}
- High or Unknown Error Rate: {{groundHighErrorRate}}
- Not Generally Accepted: {{groundNotGenerallyAccepted}}
- Testimony Would Not Assist Trier of Fact: {{groundNotRelevant}}
- Unfairly Prejudicial (FRE 403): {{groundUnfairlyPrejudicial}}

FACTUAL SUPPORT PROVIDED BY COUNSEL:
Qualification deficiencies: {{qualificationDeficiencies}}
Methodology flaws: {{methodologyFlaws}}
Scientific community rejection / lack of general acceptance: {{scientificCommunityRejection}}
Relevance and prejudice concerns: {{relevanceAndPrejudice}}

Defense expert (if any): {{defenseExpertName}}, {{defenseExpertCredentials}}
Daubert hearing requested: {{daubertHearingRequested}}

Write a structured legal argument with numbered Roman numeral sections addressing each ground raised. For each ground:
1. State the legal rule with precise case citations
2. Apply the rule to the specific facts provided
3. Explain why exclusion (or a hearing) is required

For Daubert cases (federal or state Daubert): cite Daubert v. Merrell Dow Pharmaceuticals, 509 U.S. 579 (1993); Kumho Tire Co. v. Carmichael, 526 U.S. 137 (1999); and FRE 702 as the primary authorities. Address the four Daubert factors (testability, peer review, error rate, general acceptance) for methodology challenges.

For Frye cases: cite Frye v. United States, 293 F. 1013 (D.C. Cir. 1923) and focus on whether the specific methodology has achieved general acceptance in the relevant scientific community.

For the FRE 403 / prejudice section: argue that the aura of scientific infallibility inherent in expert testimony — particularly statistical or laboratory testimony — creates unfair prejudice that substantially outweighs any probative value. Cite United States v. Llera Plaza, 188 F.3d 509, 513 (3d Cir. 2002) or similar authority as appropriate.

If the defense has identified its own expert, reference that expert's anticipated rebuttal briefly.

Conclude with a clear statement of the relief requested: outright exclusion of the expert, or in the alternative, a Daubert/Frye evidentiary hearing.

Be specific and fact-intensive. Do not use generic boilerplate. Ground every argument in the factual record described above.`,
      aiInstructions:
        "Tailor the argument to the specific field of expertise at issue. Different forensic disciplines face different reliability challenges — DNA analysis, fire investigation, cell site analysis, bite-mark evidence, blood spatter, handwriting analysis, and 'soft science' testimony like criminal profiling each have distinct bodies of critique. Reference the applicable scientific or legal literature if the field is one that has been the subject of notable court decisions or government reports (e.g., NAS 2009 Forensic Science report, PCAST 2016 report on DNA mixture interpretation).",
    },

    // Section 9: Prayer for Relief (static)
    {
      id: "prayerForRelief",
      name: "Prayer for Relief",
      type: "static",
      order: 9,
      required: true,
      staticContent: `CONCLUSION AND PRAYER FOR RELIEF

For the foregoing reasons, defendant {{defendantName}}, by and through undersigned counsel, respectfully requests that this Court:

1. Exclude the expert testimony of {{expertName}} in its entirety as failing to satisfy the admissibility requirements of Federal Rule of Evidence 702 and Daubert v. Merrell Dow Pharmaceuticals, Inc., 509 U.S. 579 (1993);

2. In the alternative, if the Court does not exclude the testimony on the papers, conduct a Daubert evidentiary hearing outside the presence of the jury to assess the reliability and relevance of {{expertName}}'s proposed testimony before it is presented at trial;

3. In the further alternative, limit or restrict the scope of {{expertName}}'s testimony to those specific opinions that satisfy the requirements of FRE 702; and

4. Grant such other and further relief as the Court deems just and proper in the interests of fairness and the defendant's right to a fair trial under the Fifth, Sixth, and Fourteenth Amendments to the United States Constitution.

Respectfully submitted,

_________________________________
{{attorneyName}}
{{firmName}}
{{barNumber}}
{{address}}
{{phone}}
{{email}}

Attorney for Defendant {{defendantName}}

Date: _______________________`,
    },

    // Section 10: Attorney Info
    {
      id: "attorneyInfo",
      name: "Attorney Information",
      type: "user-input",
      order: 10,
      required: true,
      inputs: attorneyInputs,
    },

    // Section 11: Certificate of Service
    {
      id: "certificateOfService",
      name: "Certificate of Service",
      type: "static",
      order: 11,
      required: true,
      staticContent: `CERTIFICATE OF SERVICE

I hereby certify that on the date indicated below, I served a copy of the foregoing Motion to Exclude Expert Witness and any supporting memorandum upon the prosecuting attorney of record by [electronic filing / first-class mail / hand delivery].

_________________________________
{{attorneyName}}
Date: _______________________`,
    },
  ],

  // ============================================================================
  // Jurisdiction Variants
  // ============================================================================

  jurisdictionVariants: [
    // ---- California: Kelly/Frye standard ----
    {
      jurisdiction: "CA",
      courtType: "state",
      courtSpecificRules:
        "California applies the Kelly/Frye standard for novel scientific evidence. People v. Kelly, 17 Cal.3d 24 (1976) adopted the Frye general-acceptance test. California did NOT adopt Daubert when federal courts did — Frye/Kelly remains controlling in California state courts for novel scientific techniques. The proponent must demonstrate general acceptance in the relevant scientific community through expert testimony or published literature. California Evidence Code § 801 governs expert opinion generally.",
      sections: [
        {
          id: "legalStandard",
          name: "Legal Standard (California)",
          type: "static",
          order: 7,
          required: true,
          staticContent: `LEGAL STANDARD

I.  CALIFORNIA APPLIES THE KELLY/FRYE GENERAL-ACCEPTANCE TEST FOR NOVEL SCIENTIFIC EVIDENCE.

California has not adopted the federal Daubert standard. California state courts continue to apply the Frye test as interpreted in People v. Kelly, 17 Cal.3d 24 (1976), for novel scientific evidence. Under Kelly/Frye, evidence produced by a new scientific technique is admissible only if:

    (1) the reliability of the method has been established (i.e., the technique has achieved general acceptance as reliable in the relevant scientific community);
    (2) the witness testifying to the results is a properly qualified expert in the field; and
    (3) correct scientific procedures were used in the particular case.

People v. Kelly, 17 Cal.3d 24, 30 (1976); People v. Leahy, 8 Cal.4th 587, 594 (1994).

The Kelly test applies to "new scientific techniques" — meaning techniques not previously evaluated by California courts. People v. Venegas, 18 Cal.4th 47, 79 (1998). Once a technique has been found generally accepted by a California court, subsequent cases need not relitigate general acceptance unless the technique has changed significantly. However, the proponent must still demonstrate that correct procedures were used and the specific application was reliable.

California Evidence Code § 801 provides that an expert witness may give opinion testimony only if the subject matter is "sufficiently beyond common experience that the opinion of an expert would assist the trier of fact." Cal. Evid. Code § 801(a). Expert testimony that invades the province of the jury, offers no genuine assistance, or rests on an unreliable foundation should be excluded.

The burden of establishing admissibility under Kelly rests with the proponent of the evidence — the prosecution. People v. Leahy, 8 Cal.4th at 612.`,
        },
      ],
    },

    // ---- New York: Frye standard ----
    {
      jurisdiction: "NY",
      courtType: "state",
      courtSpecificRules:
        "New York applies the Frye general-acceptance standard. Frye v. United States, 293 F. 1013 (D.C. Cir. 1923). New York has not adopted Daubert. The proponent of novel expert testimony must demonstrate that the methodology is generally accepted by the relevant scientific community. People v. Wesley, 83 N.Y.2d 417 (1994) (upholding DNA evidence under Frye). Parker v. Mobil Oil Corp., 7 N.Y.3d 434 (2006) (applying Frye to non-DNA expert testimony).",
      sections: [
        {
          id: "legalStandard",
          name: "Legal Standard (New York)",
          type: "static",
          order: 7,
          required: true,
          staticContent: `LEGAL STANDARD

I.  NEW YORK APPLIES THE FRYE GENERAL-ACCEPTANCE STANDARD.

New York courts apply the Frye standard to determine the admissibility of expert testimony based on novel scientific principles or techniques. Frye v. United States, 293 F. 1013, 1014 (D.C. Cir. 1923). New York has not adopted the federal Daubert framework and continues to apply Frye as the controlling standard.

Under the Frye standard, expert testimony based on a scientific principle or technique is admissible only if the principle or technique is "sufficiently established to have gained general acceptance in the particular field in which it belongs." Frye, 293 F. at 1014. General acceptance means acceptance by "the relevant scientific community" — not merely a minority of scientists or practitioners. People v. Wesley, 83 N.Y.2d 417, 422 (1994).

The Court of Appeals has emphasized that the Frye inquiry focuses on the general acceptance of the underlying theory and methodology, not the specific conclusions reached by the expert. Parker v. Mobil Oil Corp., 7 N.Y.3d 434, 446 (2006). Courts may consider peer-reviewed literature, judicial decisions from other jurisdictions, and expert testimony to assess general acceptance. Id. at 447.

The proponent of the novel scientific evidence bears the burden of establishing general acceptance. If the scientific community is substantially divided about the reliability of a technique, the Frye standard is not satisfied. People v. Wernick, 89 N.Y.2d 111, 115–16 (1996).

Additionally, under New York Civil Practice Law and Rules § 4515 (applicable by analogy in criminal proceedings through CPL § 60.10), expert testimony must be relevant and not merely speculative or conjectural. The court retains discretion to exclude expert testimony that, even if based on accepted principles, lacks a sufficient factual foundation or would mislead the jury.`,
        },
      ],
    },

    // ---- Texas: Kelly standard (Tex. R. Evid. 702 / Nenno) ----
    {
      jurisdiction: "TX",
      courtType: "state",
      courtSpecificRules:
        "Texas follows the Kelly standard under Tex. R. Evid. 702. E.I. du Pont de Nemours & Co. v. Robinson, 923 S.W.2d 549 (Tex. 1995) adopted a Daubert-like reliability test. For criminal cases, Kelly v. State, 824 S.W.2d 568 (Tex. Crim. App. 1992) sets the standard. For 'soft sciences' (psychology, sociology, etc.), Nenno v. State, 970 S.W.2d 549 (Tex. Crim. App. 1998) applies a modified reliability inquiry.",
      sections: [
        {
          id: "legalStandard",
          name: "Legal Standard (Texas)",
          type: "static",
          order: 7,
          required: true,
          staticContent: `LEGAL STANDARD

I.  TEXAS REQUIRES RELIABILITY UNDER KELLY AND TEXAS RULE OF EVIDENCE 702.

Texas Rule of Evidence 702 provides that expert testimony is admissible only if "the expert's scientific, technical, or other specialized knowledge will help the trier of fact to understand the evidence or to determine a fact in issue," and the testimony is reliable and relevant. Tex. R. Evid. 702.

In Kelly v. State, 824 S.W.2d 568 (Tex. Crim. App. 1992), the Court of Criminal Appeals held that scientific evidence is reliable only if: (1) the underlying theory is valid; (2) the technique applying the theory is valid; and (3) the technique was properly applied on the occasion in question. Id. at 573. The trial court must conduct a threshold determination of reliability before admitting the testimony. Id. at 572.

The Kelly reliability factors — which the court may consider but is not limited to — include: (1) the extent to which the underlying theory or technique has been accepted as valid by the relevant scientific community; (2) the qualifications of the expert testifying; (3) the existence of literature supporting or rejecting the technique; (4) the potential rate of error; (5) the availability of other experts to test and evaluate the technique; (6) the clarity with which the underlying theory or technique can be explained; and (7) the experience and skill of the person who applied the technique. Id. at 573.

For testimony rooted in "soft science" fields — including psychology, behavioral analysis, criminal profiling, and social science — the Court of Criminal Appeals applies a modified reliability framework from Nenno v. State, 970 S.W.2d 549, 561 (Tex. Crim. App. 1998). Under Nenno, the court asks: (1) whether the field of expertise is a legitimate one; (2) whether the subject matter of the expert's testimony is within the scope of that field; and (3) whether the expert's testimony properly relies on and/or applies the principles involved in the field. Id.

The proponent of expert testimony bears the burden of demonstrating by clear and convincing evidence that the evidence satisfies the reliability requirements of Kelly. Nenno, 970 S.W.2d at 560. Reliability is a threshold question of admissibility for the trial court, not a credibility question for the jury.`,
        },
      ],
    },

    // ---- Florida: Frye standard ----
    {
      jurisdiction: "FL",
      courtType: "state",
      courtSpecificRules:
        "Florida applies the Frye standard. Although the Florida legislature amended the Florida Evidence Code in 2013 to adopt the Daubert standard (§ 90.702, Fla. Stat.), the Florida Supreme Court held in In re Amendments to the Florida Evidence Code, 278 So.3d 551 (Fla. 2019) that the legislative adoption of Daubert was unconstitutional as a violation of the separation of powers. Frye remains the controlling standard in Florida state courts for novel scientific evidence. See DeLisle v. Crane Co., 258 So.3d 1219 (Fla. 2018).",
      sections: [
        {
          id: "legalStandard",
          name: "Legal Standard (Florida)",
          type: "static",
          order: 7,
          required: true,
          staticContent: `LEGAL STANDARD

I.  FLORIDA APPLIES THE FRYE GENERAL-ACCEPTANCE STANDARD.

Florida state courts apply the Frye standard to novel scientific evidence. Frye v. United States, 293 F. 1013 (D.C. Cir. 1923). The Florida Supreme Court has definitively held that the Frye standard — not the Daubert standard — governs the admissibility of expert testimony in Florida courts.

Although the Florida legislature amended § 90.702, Florida Statutes, in 2013 to adopt the federal Daubert standard, the Florida Supreme Court rejected that amendment. In In re Amendments to the Florida Evidence Code, 278 So.3d 551, 553 (Fla. 2019), the Court exercised its constitutional authority over procedural rules and declined to adopt the legislative Daubert amendment, concluding that the Frye standard better protects against the admission of unreliable and potentially prejudicial junk science. See also DeLisle v. Crane Co., 258 So.3d 1219, 1228–29 (Fla. 2018) (reaffirming Frye as controlling in Florida).

Under the Frye standard as applied in Florida, novel scientific evidence is admissible only if the scientific principle upon which the expert's opinion is based is generally accepted as reliable in the relevant scientific community. Frye, 293 F. at 1014; Brim v. State, 695 So.2d 268, 271–72 (Fla. 1997). "General acceptance" requires more than approval by a few practitioners — the methodology must be accepted by the scientific community as a whole as producing reliable results. Castillo v. E.I. Du Pont de Nemours & Co., 854 So.2d 1264, 1268 (Fla. 2003).

The trial court acts as gatekeeper and must conduct a Frye hearing — outside the jury's presence — when the admissibility of novel scientific evidence is challenged. The proponent of the evidence bears the burden of demonstrating general acceptance. Flanagan v. State, 625 So.2d 827, 828 (Fla. 1993).

Additionally, under § 90.403, Florida Statutes, relevant evidence — including expert testimony — may be excluded "if its probative value is substantially outweighed by the danger of unfair prejudice, confusion of issues, misleading the jury, or needless presentation of cumulative evidence."`,
        },
      ],
    },
  ],
};
