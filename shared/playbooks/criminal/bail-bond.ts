import type { Playbook } from "../schema";

export const bailBondPlaybook: Playbook = {
  id: "bail-bond",
  category: "criminal",
  name: "Bail & Bond Reduction",
  tagline: "Getting your client home while they fight the case",
  overview: "Pretrial detention is not just a hardship — it is one of the strongest predictors of case outcome. Detained defendants are more likely to plead guilty, receive longer sentences, and lose jobs, housing, and family stability. Aggressive bail advocacy is among the most impactful work a public defender can do. This playbook covers the full lifecycle from the initial detention hearing through post-denial remedies.",
  typicalTimeline: "1–6 weeks",
  difficultyLevel: "basic",
  keyConsiderations: [
    "Pretrial detention has been shown to increase the likelihood of a guilty plea by 25% and longer sentences — make this argument to judges.",
    "Bail hearings move fast. Prepare your argument structure, know the charge maximums, and have the client's ties to community documented.",
    "Many jurisdictions have abolished or restricted cash bail for misdemeanors and non-violent felonies — know your local reform status.",
    "Conditions of release (GPS, check-ins, no-contact) are often more negotiable than bail amount — use this as leverage.",
    "For ICE-detained clients: immigration detainers complicate release even if criminal bail is satisfied — address both simultaneously."
  ],
  stages: [
    {
      id: "assessment",
      name: "Bail Assessment",
      timeline: "Immediately upon appointment",
      description: "Quickly evaluate bail factors and build the client's case for release.",
      keyActions: [
        {
          text: "Interview client: ties to community (residence, family, employment, length of time in area)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review client's criminal history — understand what prosecutor will argue",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify financial capacity — can client actually post the current bail amount?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Check for immigration detainer that would prevent release even if bail is satisfied",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather documentation: pay stubs, lease, family contact information, employer contact",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research pretrial services report if available in the jurisdiction",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client for names and phone numbers of family members, employers, or others who can speak to their ties to the community. These contacts can be reached before the bail hearing and can even appear in court.",
      pitfalls: [
        "Appearing at a bail hearing without knowing the client's community ties and financial situation",
        "Not checking for an immigration detainer — a client might post $5,000 bail and walk straight into ICE custody",
        "Accepting the pretrial services risk score without scrutinizing the underlying data"
      ]
    },
    {
      id: "motion-filing",
      name: "Motion Preparation",
      timeline: "Days 1–3",
      description: "Prepare and file a written motion to reduce bail or for pretrial release if the initial hearing did not succeed.",
      keyActions: [
        {
          text: "File written motion to reduce bail if initial hearing was unsuccessful",
          priority: "critical",
          deadline: "Within 72 hours of initial hearing",
          type: "attorney"
        },
        {
          text: "Include specific facts: monthly income, rent/mortgage, length of residence, family dependents, employment",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Cite Bearden v. Georgia (1983) if bail is unaffordable — detention based solely on poverty is unconstitutional",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Propose alternative conditions: electronic monitoring, daily check-ins, surrender of passport",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Include letters from employer, family, or community members if available",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reduce-bail",
          name: "Motion to Reduce Bail",
          relevance: "Core motion arguing for bail reduction based on financial hardship and community ties"
        },
        {
          templateId: "motion-for-pretrial-release",
          name: "Motion for Pretrial Release",
          relevance: "Broader motion seeking release on OR or non-monetary conditions"
        }
      ],
      pitfalls: [
        "Filing a generic motion without client-specific facts — judges dismiss these quickly",
        "Not proposing alternative conditions — judges need an alternative to simply say 'no'",
        "Missing the local rule deadline for re-hearing a bail issue"
      ]
    },
    {
      id: "hearing-prep",
      name: "Hearing Preparation",
      timeline: "Days 2–5",
      description: "Prepare a compelling argument combining legal precedent, social science evidence, and the client's specific facts.",
      keyActions: [
        {
          text: "Prepare argument on pretrial detention's negative outcomes (employment loss, family harm, case outcomes)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research local pretrial release statistics to show most released defendants appear for trial",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare client or family member to make brief, prepared statement if appropriate",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Review any pretrial services report for errors and prepare to challenge inaccuracies",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-pretrial-release",
          name: "Motion for Pretrial Release",
          relevance: "Comprehensive argument for OR release with supporting legal authority"
        }
      ],
      pitfalls: [
        "Not preparing the client or family member before having them speak — unscripted statements can hurt",
        "Failing to challenge factual errors in pretrial services risk assessments"
      ]
    },
    {
      id: "bond-hearing",
      name: "Bond Hearing",
      timeline: "Days 3–14",
      description: "Present the oral argument at the bail hearing.",
      keyActions: [
        {
          text: "Lead with the specific facts of this client — make them a person, not a case number",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Address the two statutory factors: (1) risk of flight, (2) danger to community — and refute both",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Argue financial inability to pay if bail amount is unaffordable",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Propose conditions that address judge's specific concerns",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Coach your client on courtroom demeanor: dress professionally if possible, stand when addressed, answer 'yes, your honor' when spoken to directly, and remain calm. Judges notice and react to a client's demeanor.",
      pitfalls: [
        "Arguing abstract legal principles without grounding them in the client's specific situation",
        "Not being prepared to quickly counter the prosecutor's specific bail arguments",
        "Allowing the hearing to run long — judges have crowded dockets and lose patience"
      ]
    },
    {
      id: "post-hearing",
      name: "Post-Hearing Remedies",
      timeline: "After hearing",
      description: "If bail is denied or remains excessive, pursue appellate or superior court remedies.",
      keyActions: [
        {
          text: "Research interlocutory appeal or writ petition to superior/appellate court if bail is excessive",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Consider habeas corpus petition if detention is constitutionally unreasonable",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Re-file bail reduction motion if circumstances change (employment, family emergency, new evidence)",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Connect client with resources while detained: visitation, phone calls, medical needs",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reduce-bail",
          name: "Motion to Reduce Bail",
          relevance: "Re-file if circumstances change materially"
        }
      ],
      clientGuidance: "If your client remains detained, keep communication lines open. Regular check-ins build trust and allow you to gather additional facts for a renewed bail motion. Explain the timeline and next court dates clearly.",
      pitfalls: [
        "Not researching appeal or writ options — in many jurisdictions, these are more effective than re-arguing to the same judge",
        "Losing contact with a detained client — communication gaps damage the attorney-client relationship and the defense"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Cash Bail Reform",
      variations: [
        {
          states: ["NY", "NJ"],
          note: "NY and NJ have abolished cash bail for most misdemeanors and non-violent felonies. Focus arguments on least restrictive non-monetary conditions. NY: CPL § 520 and § 530."
        },
        {
          states: ["CA"],
          note: "Prop 25 (2020) would have eliminated cash bail but failed. Cash bail remains but courts must consider ability to pay. Several counties use risk assessment tools."
        },
        {
          states: ["IL"],
          note: "Illinois eliminated cash bail statewide effective January 2023 under the SAFE-T Act. Detention is based on dangerousness and flight risk only — no monetary conditions."
        },
        {
          states: ["DC"],
          note: "DC has operated without cash bail since the 1990s — one of the most successful pretrial release systems in the country. Use DC as evidence when arguing for reform."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-reduce-bail", "motion-for-pretrial-release"],
  tags: ["bail", "bond", "pretrial release", "detention", "OR release", "conditions of release"]
};
