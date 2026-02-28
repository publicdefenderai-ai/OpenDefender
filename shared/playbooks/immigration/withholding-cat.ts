import type { Playbook } from "../schema";

export const withholdingCatPlaybook: Playbook = {
  id: "withholding-cat",
  category: "immigration",
  name: "Withholding of Removal / CAT",
  tagline: "When asylum is barred, protection remains possible",
  overview: "Withholding of Removal (INA § 241(b)(3)) and protection under the Convention Against Torture (CAT, 8 C.F.R. § 1208.16) are the last lines of protection when full asylum is unavailable — due to the one-year bar, a conviction, a prior grant of asylum, or prior order. Unlike asylum, these forms of protection do not lead to a green card and may not extend to family members, but they prevent return to a country where the client faces persecution or torture. The standard is higher than asylum — a 'clear probability' of persecution or torture — but these are winnable cases with the right evidence.",
  typicalTimeline: "6 months to 2 years",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Withholding requires a 'clear probability' (more likely than not) of persecution — a higher standard than asylum's 'well-founded fear.' This requires stronger, more direct evidence of the threat.",
    "CAT protection requires showing it is 'more likely than not' the applicant would be tortured 'by or at the instigation of or with the consent or acquiescence of a public official.' Government involvement is essential.",
    "Unlike asylum, withholding of removal does NOT have a one-year filing deadline. It is always available as a defense to removal.",
    "Conviction bars: certain criminal convictions bar asylum but not withholding (unless 'particularly serious crime'). A 'particularly serious crime' bar applies to both asylum and withholding but is narrower than the aggravated felony bar. Research this carefully.",
    "CAT protection does not require a nexus to a protected ground — torture by any government official for any reason qualifies. This makes CAT available when neither asylum nor withholding grounds are established.",
    "A grant of withholding is not permanent — DHS can terminate it if country conditions change. Advise clients accordingly."
  ],
  stages: [
    {
      id: "initial-assessment",
      name: "Initial Assessment & Form of Relief",
      timeline: "First client meetings",
      description: "Determine which form of protection applies and why asylum is unavailable.",
      keyActions: [
        {
          text: "Confirm why asylum is unavailable: one-year bar, prior conviction, prior grant, aggravated felony bar",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess withholding eligibility: is the protected ground established? Is there clear probability of persecution?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess CAT eligibility: is there government involvement in torture? Is it more likely than not to occur?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify the 'particularly serious crime' issue: if client has prior convictions, analyze whether they bar withholding",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct full credible fear interview — document specific incidents, names, dates, and government actor involvement",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request time to develop the withholding/CAT case if the hearing is scheduled too quickly"
        }
      ],
      clientGuidance: "Explain the difference clearly to your client: withholding means they cannot be deported to that country, but they do not get a green card or permanent status. They remain in a limbo of authorized presence. CAT is similar but based on torture specifically. Both are valuable — they save lives — but the client should understand the limitations.",
      pitfalls: [
        "Assuming the 'particularly serious crime' bar applies without careful legal analysis — this bar is narrower than the aggravated felony bar",
        "Not pleading CAT when government involvement in harm is present — CAT has no one-year bar, no nexus requirement, and no particularly serious crime bar for deferral of removal",
        "Failing to explain the limitations of withholding/CAT to the client — no green card, no family benefits, terminable if country conditions change"
      ]
    },
    {
      id: "evidence-gathering",
      name: "Evidence Gathering",
      timeline: "Weeks 2–10",
      description: "Build the evidentiary record — focus on nexus, clear probability, and government actor involvement for CAT.",
      keyActions: [
        {
          text: "Obtain police reports, medical records, and documentation of past persecution or torture in the home country",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Compile country conditions evidence demonstrating ongoing persecution of the client's group or ongoing government-sanctioned torture",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For CAT: document government actor involvement — police, military, state-sanctioned paramilitary groups",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain affidavits from witnesses in the home country about the specific threats or harm the client faces",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Consider a country conditions expert or human rights organization expert witness",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain psychological evaluation documenting trauma and the ongoing effects of past persecution",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The withholding/CAT case requires proving that return means persecution or torture is more likely than not. The client's own testimony is essential but insufficient alone. Documents from the home country — police records, threats, photos of injuries — and independent country conditions evidence are required.",
      pitfalls: [
        "Relying solely on client testimony without corroborating country conditions evidence",
        "Not engaging a country conditions expert for complex cases involving targeted persecution",
        "Thin CAT evidence on government actor involvement — acquiescence requires more than inability to stop private actors; there must be some government involvement or willful blindness"
      ]
    },
    {
      id: "application-filing",
      name: "Application Filing",
      timeline: "By court deadline",
      description: "File the withholding/CAT application as part of the I-589 or in a separate position paper.",
      keyActions: [
        {
          text: "File I-589 for withholding of removal (even if asylum time-barred, the form covers all three: asylum, withholding, CAT)",
          priority: "critical",
          deadline: "Court-ordered deadline (check local rules)",
          type: "attorney"
        },
        {
          text: "Submit comprehensive country conditions binder: State Department reports, NGO reports, news articles, expert declarations",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File legal brief: explain why asylum is unavailable, establish withholding standard, establish CAT standard",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Address the 'particularly serious crime' bar head-on if it is a risk — do not leave it for DHS to raise first",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Failing to file the I-589 because asylum seems unavailable — the same form is used for withholding and CAT, and these claims survive",
        "Not briefing the particularly serious crime issue proactively — IJs respond better to attorneys who acknowledge and address weaknesses",
        "Submitting country conditions evidence from outdated reports — use the most current data available"
      ]
    },
    {
      id: "hearing-prep",
      name: "Merits Hearing Preparation",
      timeline: "1–3 months before individual hearing",
      description: "Prepare the client for the heightened evidentiary standard of withholding and CAT.",
      keyActions: [
        {
          text: "Conduct thorough direct examination preparation — client must testify to clear probability, not just fear",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare for DHS cross-examination on inconsistencies and the 'clearly probable' standard",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Brief expert witnesses on the heightened standard — their testimony must address probability, not mere possibility",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare closing argument addressing each required element: nexus, clear probability, government actor (CAT)",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Prepare your client: the standard is higher than 'I am afraid.' The court needs to hear specific incidents, specific threats, and specific reasons why return would be dangerous. The client's testimony should answer: 'If I am sent back, here is what will happen and why I know this.'",
      pitfalls: [
        "Not preparing the client for the 'clearly probable' standard — testimony that only establishes subjective fear is insufficient",
        "Failing to address the government actor/acquiescence element in CAT preparation",
        "Not making a closing argument that explicitly addresses each element of withholding and CAT separately"
      ]
    },
    {
      id: "post-hearing",
      name: "Post-Hearing & Appeal",
      timeline: "After hearing",
      description: "Respond to the IJ decision and pursue BIA appeal if needed.",
      keyActions: [
        {
          text: "If granted: advise client on conditions — they must maintain lawful presence, cannot travel to home country, must report changes",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If denied: assess BIA appeal grounds — legal error in applying the standard, failure to consider evidence, credibility findings without support",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If withholding granted but deferral of removal under CAT not: advise client on the distinction and future risks",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client that withholding grants are not permanent — DHS can seek termination if conditions change",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Not filing a BIA appeal when the IJ made legal errors on the particularly serious crime bar or CAT standard",
        "Failing to advise the client of travel restrictions — traveling to the home country can terminate withholding",
        "Missing the 30-day BIA appeal deadline after an IJ denial"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Particularly Serious Crime Bar",
      variations: [
        {
          states: ["ALL"],
          note: "The 'particularly serious crime' bar requires the IJ to balance multiple factors: the nature of the crime, the circumstances, and whether the person is a danger to the community. An aggravated felony creates a rebuttable presumption of a particularly serious crime but is not automatically disqualifying for withholding (unlike asylum). CAT deferral of removal is available even when the particularly serious crime bar applies."
        }
      ]
    },
    {
      topic: "CAT Deferral vs. Withholding Under CAT",
      variations: [
        {
          states: ["ALL"],
          note: "Two CAT forms: (1) Withholding of removal under CAT (8 C.F.R. § 1208.16(c)) — not available to those barred by particularly serious crimes. (2) Deferral of removal under CAT (8 C.F.R. § 1208.17) — available to anyone, including those barred by particularly serious crimes. Always plead deferral as a fallback."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-for-continuance-eoir"],
  tags: ["withholding of removal", "CAT", "Convention Against Torture", "persecution", "one-year bar", "particularly serious crime", "government actor"]
};
