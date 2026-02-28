import type { Playbook } from "../schema";

export const iceDetentionBondPlaybook: Playbook = {
  id: "ice-detention-bond",
  category: "immigration",
  name: "ICE Detention & Bond Hearing",
  tagline: "First 24 hours are critical — act immediately",
  overview: "ICE detention moves fast and the consequences of inaction are severe. A person can be detained, transferred across the country, and deported before counsel is even appointed. This playbook covers the immediate response from the moment a client is detained through the bond hearing and beyond.",
  typicalTimeline: "1–8 weeks",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "ICE can and does transfer detainees to remote facilities with no notice. File a Notice of Appearance IMMEDIATELY to lock in venue and prevent transfer.",
    "The bond hearing standard is different from criminal bail: DHS must show the respondent is a danger or flight risk. You can win these.",
    "Mandatory detention bars bond for certain criminal convictions — know the specific statutes (INA § 236(c)) BEFORE the bond hearing.",
    "People detained at border/ports of entry may be subject to expedited removal — this has a different playbook entirely.",
    "Simultaneous state criminal case: if client has pending criminal charges, coordinate closely — criminal plea can have catastrophic immigration consequences.",
    "Document all family ties, U.S.-citizen children, time in the U.S., and employment — these are your bond argument."
  ],
  stages: [
    {
      id: "immediate-0-24h",
      name: "Immediate Response (0–24 Hours)",
      timeline: "Within hours of learning of detention",
      description: "Locate the client, prevent transfer, and assert your appearance as counsel.",
      keyActions: [
        {
          text: "Locate the detainee using ICE.gov detainee locator, local ICE field office, or FOIA",
          priority: "critical",
          deadline: "Within hours of learning of detention",
          type: "attorney"
        },
        {
          text: "File Notice of Appearance (EOIR-28) with the immigration court — this prevents transfer without notice",
          priority: "critical",
          deadline: "Same day if possible",
          type: "attorney"
        },
        {
          text: "Contact the detention facility to speak with client — insist on attorney-client call",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather client's A-number (Alien Registration Number) — needed for all filings",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Contact family members — they may have critical documents and information about client's immigration history",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise family members not to discuss the case with ICE officers or post about detention on social media",
          priority: "high",
          type: "client"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File immediately to establish representation and prevent transfer"
        }
      ],
      clientGuidance: "Your client is scared and may not fully understand what is happening. Confirm they have not signed anything — ICE sometimes presents I-826 (Right to Hearing) or I-229(a) (Voluntary Departure) forms and pressures detainees to sign. If your client signed anything, get a copy immediately.",
      pitfalls: [
        "Delay in filing EOIR-28 — ICE can transfer the client to a facility 1,000 miles away before you file",
        "Not getting the A-number immediately — without it, you cannot communicate with the court or ICE",
        "Client unknowingly signing a voluntary departure or removal order — these must be challenged immediately"
      ]
    },
    {
      id: "detention-review",
      name: "Detention Review & Case Assessment",
      timeline: "Days 1–5",
      description: "Determine the legal basis for detention, assess mandatory detention bars, and gather evidence for the bond hearing.",
      keyActions: [
        {
          text: "Obtain DHS's I-213 (Record of Deportable Alien) to understand ICE's basis for detention",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Determine whether client is subject to mandatory detention under INA § 236(c) due to criminal history",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess client's immigration history: entries, prior removal orders, DACA or TPS status",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify all potential forms of relief from removal: cancellation of removal, asylum, TPS, U/T visa",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather bond package: employment records, tax returns, family ties, community involvement, letters",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Contact family and employer to begin assembling documentation",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The bond hearing is not about whether your client will be deported — it is only about whether they should be detained while the case proceeds. Remind your client that a bond hearing win means they go home to fight the case from the outside.",
      pitfalls: [
        "Assuming mandatory detention applies without checking the specific statute and the client's specific convictions",
        "Not identifying all forms of relief before the bond hearing — relief eligibility is relevant to flight risk and danger arguments",
        "Missing prior removal orders — a reinstated removal order may bypass the bond process entirely"
      ]
    },
    {
      id: "bond-prep",
      name: "Bond Hearing Preparation",
      timeline: "Days 3–10",
      description: "Build the bond package and prepare the legal arguments.",
      keyActions: [
        {
          text: "Request a bond redetermination hearing from the immigration judge",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Compile bond package: family declarations, employment letters, community letters, tax returns, bank statements",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare legal brief: DHS must prove danger by clear and convincing evidence; flight risk by preponderance",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess whether a Casas-Castrillon or Diouf habeas petition is appropriate if detention is prolonged",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research bond amounts in the specific immigration court — know what the local judge typically sets",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "bond-motion-eoir",
          name: "Bond Motion (EOIR)",
          relevance: "Formal motion for bond redetermination with supporting legal argument"
        },
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request additional time to compile bond package if hearing is set too quickly"
        }
      ],
      clientGuidance: "Prepare your client for the bond hearing by explaining: the judge will ask about their family, their immigration history, and why they should be released. Coach them to be honest, direct, and to emphasize their U.S. family members and community ties.",
      pitfalls: [
        "Appearing at a bond hearing without a written bond package — judges expect documentation",
        "Not preparing family members who may testify or attend the hearing",
        "Underestimating the importance of the bond amount — request the lowest amount the judge might set"
      ]
    },
    {
      id: "bond-hearing",
      name: "Bond Hearing",
      timeline: "Weeks 1–4",
      description: "Present the bond argument before the immigration judge.",
      keyActions: [
        {
          text: "Challenge DHS's evidence of danger — prior arrests that did not result in convictions should not count",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Present community ties evidence: U.S. citizen/LPR family, length of residence, employment, property",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Argue that client is not a flight risk: has appeared at all prior court hearings, has strong community anchor",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request the lowest possible bond and propose conditions (passport surrender, check-ins) as alternative",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "bond-motion-eoir",
          name: "Bond Motion (EOIR)",
          relevance: "Submit as written brief to accompany oral argument"
        }
      ],
      clientGuidance: "If your client will testify at the bond hearing, prepare them: speak slowly, be honest, emphasize family and ties to the community, and avoid saying anything that could be construed as admitting to removability.",
      pitfalls: [
        "Allowing DHS to introduce arrest records without objection — arrests without convictions should not establish danger",
        "Not objecting to inadmissible hearsay in DHS's evidence (though IJ standards are more relaxed than in criminal court)",
        "Failing to address the IJ's specific concern — listen for it and respond directly"
      ]
    },
    {
      id: "post-hearing",
      name: "Post-Hearing",
      timeline: "After hearing",
      description: "After bond is set, advise the family on posting bond and prepare for the underlying removal proceedings.",
      keyActions: [
        {
          text: "If bond is set: advise family on how to post bond (ICE office, Immigrations Bond Office procedures)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If bond is denied: assess interlocutory appeal to BIA",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If detained for 6+ months: file Habeas corpus petition for prolonged detention review",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Begin preparation for the underlying removal case — bond release allows the case to be built more effectively",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Remind your client that bond conditions must be followed exactly — any violation can result in re-detention and bond forfeiture. Explain any reporting requirements, travel restrictions, and the obligation to appear at all future court dates.",
      pitfalls: [
        "Client missing bond conditions and getting re-detained — brief them thoroughly on requirements",
        "Not filing the BIA interlocutory appeal quickly if bond is denied — there are strict time limits",
        "Neglecting the underlying removal case while focused on bond — the two must proceed simultaneously"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Mandatory Detention (INA § 236(c))",
      variations: [
        {
          states: ["ALL"],
          note: "Mandatory detention applies to non-citizens with certain criminal convictions: crimes of violence (aggravated felonies), controlled substance offenses, firearm offenses, and certain other crimes. Analysis requires examining the statute of conviction, not just the facts of the case. Apply the categorical approach."
        }
      ]
    },
    {
      topic: "Prolonged Detention",
      variations: [
        {
          states: ["CA", "OR", "WA"],
          note: "9th Circuit: Casas-Castrillon and Diouf require bond hearing with government bearing burden of proof for prolonged detention (>6 months). Zadvydas v. Davis (2001) limits post-order detention to 6 months for those who cannot be removed."
        },
        {
          states: ["NY", "NJ", "CT", "VT", "MA", "RI", "NH", "ME"],
          note: "2nd Circuit: Lora v. Shanahan requires mandatory detainees receive a bond hearing after 6 months."
        }
      ]
    }
  ],
  relatedTemplateIds: ["bond-motion-eoir", "notice-of-appearance", "motion-for-continuance-eoir"],
  tags: ["ICE detention", "immigration bond", "bond hearing", "EOIR", "removal", "detention", "mandatory detention"]
};
