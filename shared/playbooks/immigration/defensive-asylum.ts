import type { Playbook } from "../schema";

export const defensiveAsylumPlaybook: Playbook = {
  id: "defensive-asylum",
  category: "immigration",
  name: "Defensive Asylum",
  tagline: "Build the record that protects your client's life",
  overview: "Defensive asylum is claimed in immigration court as a defense to removal. Unlike affirmative asylum (filed with USCIS), defensive asylum is litigated before an immigration judge with the full adversarial weight of DHS counsel on the other side. The client must demonstrate a well-founded fear of persecution on account of one of five protected grounds. This playbook walks through the full process from initial screening through the individual merits hearing.",
  typicalTimeline: "6 months to 3 years (court dependent)",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "The one-year filing deadline is a threshold bar — if the client entered more than one year ago without an extraordinary circumstances exception, asylum may be unavailable and other forms of relief (withholding, CAT) must be pursued.",
    "The five protected grounds are: Race, Religion, Nationality, Political Opinion, and Particular Social Group (PSG). PSG is the most litigated and requires careful group definition.",
    "Credibility is everything in asylum cases. Document every aspect of the client's claim with corroborating evidence.",
    "Country conditions evidence is often as important as the client's personal testimony — research country conditions thoroughly.",
    "Withholding of Removal (INA § 241(b)(3)) and Convention Against Torture (CAT) protection provide alternatives if asylum is barred — always plead all three.",
    "Prior removal orders, persecution bars, and firm resettlement bars can permanently disqualify a client — screen for these early."
  ],
  stages: [
    {
      id: "screening",
      name: "Initial Screening",
      timeline: "First meetings with client",
      description: "Assess asylum eligibility, identify bars and threshold issues, and determine which forms of relief apply.",
      keyActions: [
        {
          text: "Determine date of last entry — assess one-year deadline and any exception arguments",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct full credible fear interview: who harmed the client, why, government protection available?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify the protected ground: Race, Religion, Nationality, Political Opinion, or PSG",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for asylum bars: persecutor bar, serious crime bar, security bar, firm resettlement bar",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess eligibility for withholding of removal and CAT as alternative/additional relief",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify family members who may be derivative asylum beneficiaries",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Create a safe, confidential environment for the initial interview. Asylum seekers have often survived trauma — use trauma-informed interview techniques. Do not rush the client. Multiple sessions may be needed to get the full story. Cultural and language nuances require a skilled interpreter.",
      pitfalls: [
        "Missing the one-year bar issue — do not assume the client's entry date without documentation",
        "Failing to identify PSG membership — this is the most common form of protection and requires careful legal analysis",
        "Not screening for asylum bars early — discovering a bar after extensive preparation wastes resources"
      ]
    },
    {
      id: "application-prep",
      name: "Application Preparation",
      timeline: "Weeks 2–12",
      description: "Draft the I-589, gather corroborating evidence, and prepare country conditions documentation.",
      keyActions: [
        {
          text: "Draft the I-589 application with detailed personal statement describing persecution and fear",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather identity documents, entry documents, police reports, hospital records, and any evidence of persecution",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Compile country conditions package: State Department reports, Human Rights Watch, Amnesty International, news articles",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain witness declarations from family members, community leaders, or others with knowledge of the client's situation",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Consider engaging an expert witness (country conditions expert, psychologist for trauma documentation)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare the particular social group (PSG) legal definition if that is the claimed ground",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The personal statement in the I-589 is the heart of the asylum case. Work with your client over multiple sessions to document specific incidents, dates, names, and descriptions. Vague claims lose; specific, detailed, corroborated claims win.",
      pitfalls: [
        "Filing a vague or legally incomplete I-589 — the application locks in the client's story and inconsistencies will be used against them",
        "Failing to legally define the PSG — IJ will reject undefined PSGs",
        "Thin country conditions evidence — judges expect comprehensive documentation"
      ]
    },
    {
      id: "filing",
      name: "Filing the Application",
      timeline: "By court-ordered deadline (typically 30–60 days before individual hearing)",
      description: "File the complete application package with the immigration court before the deadline.",
      keyActions: [
        {
          text: "File I-589 and all supporting exhibits with the immigration court by the deadline",
          priority: "critical",
          deadline: "Typically 30–60 days before individual hearing (check local court rules)",
          type: "attorney"
        },
        {
          text: "Serve copies on ICE/DHS counsel by the required deadline",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File biometrics completion if required by the court",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motions in limine to exclude prejudicial DHS evidence if applicable",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request extension of the filing deadline if you need more time to compile evidence"
        }
      ],
      pitfalls: [
        "Late filing — some IJs will refuse to admit late-filed evidence",
        "Serving DHS counsel incorrectly — DHS counsel must receive the application to prepare their cross-examination",
        "Filing an incomplete I-589 — the application will be rejected and you will have a deadline crisis"
      ]
    },
    {
      id: "merits-prep",
      name: "Merits Hearing Preparation",
      timeline: "1–3 months before individual hearing",
      description: "Prepare the client for direct examination and cross-examination, and finalize the legal brief.",
      keyActions: [
        {
          text: "Conduct extensive mock direct examination with the client — build confidence and consistency",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct mock cross-examination — DHS will probe every inconsistency",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare legal brief: elements of asylum, PSG definition, country conditions, credibility factors",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare exhibits binder with tabs and index for IJ",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Brief any expert witnesses and prepare their direct examination",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare client on courtroom procedure: oath, speaking slowly for interpreter, addressing the judge",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress-immigration-eoir",
          name: "Motion to Suppress (Immigration)",
          relevance: "Suppress statements or evidence obtained in violation of the client's constitutional rights (e.g., statements to ICE without Miranda warning in criminal context)"
        }
      ],
      clientGuidance: "Prepare your client for the reality that cross-examination will be difficult. DHS attorneys will look for inconsistencies between the application, the client's prior statements, and their testimony. Practice remaining calm and explaining any discrepancies honestly.",
      pitfalls: [
        "Under-preparing the client for cross-examination — inconsistency on even small details can destroy credibility",
        "Not preparing for the IJ's questions — many IJs actively question witnesses, not just DHS counsel",
        "Failing to submit a legal brief — without it, the IJ has no clear framework for granting asylum"
      ]
    },
    {
      id: "hearing",
      name: "Individual Merits Hearing",
      timeline: "The hearing date",
      description: "Present the asylum case before the immigration judge.",
      keyActions: [
        {
          text: "Introduce all exhibits into evidence at the start of the hearing",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct direct examination — elicit the full persecution story chronologically",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Rehabilitate client after cross-examination — address inconsistencies directly",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Make closing argument: connect evidence to the five elements of asylum",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Request withholding of removal and CAT relief in the alternative if asylum is denied",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If the IJ issues an oral decision at the end of the hearing, do not let your client react visibly — either positively or negatively — before you have reviewed it. If the case is denied, immediately tell your client: 'We have the right to appeal and we will do that.'",
      pitfalls: [
        "Not preserving objections to DHS evidence for the record — these are needed for the BIA appeal",
        "Failing to request all three forms of protection (asylum, withholding, CAT) on the record",
        "Not requesting oral decision time if the IJ offers to take the case under submission — written decisions are better for appeal"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Particular Social Group (PSG)",
      variations: [
        {
          states: ["ALL"],
          note: "PSG must meet three criteria: (1) composed of members who share a common immutable characteristic; (2) defined with particularity; (3) socially distinct in the country in question. Circuit courts vary significantly on what PSGs qualify. Research 9th, 2nd, 5th, 11th Circuit precedent for your circuit."
        }
      ]
    },
    {
      topic: "One-Year Deadline Exceptions",
      variations: [
        {
          states: ["ALL"],
          note: "Two exceptions to the one-year filing deadline: (1) Changed circumstances (new country conditions or personal circumstances); (2) Extraordinary circumstances (serious illness, legal disability, ineffective assistance of prior counsel). Document exception grounds meticulously."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-for-continuance-eoir", "motion-to-suppress-immigration-eoir"],
  tags: ["asylum", "defensive asylum", "I-589", "persecution", "PSG", "withholding of removal", "CAT", "EOIR"]
};
