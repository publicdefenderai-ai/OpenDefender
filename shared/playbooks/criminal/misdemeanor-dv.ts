import type { Playbook } from "../schema";

export const misdemeanorDvPlaybook: Playbook = {
  id: "misdemeanor-dv",
  category: "criminal",
  name: "Misdemeanor Assault / Domestic Violence",
  tagline: "Navigate mandatory arrest, protective orders, and victim dynamics",
  overview: "Domestic violence misdemeanor cases are among the most procedurally complex in a public defender's docket. Mandatory arrest laws, automatic protective orders, victim-contact rules, and collateral consequences (immigration, firearms, child custody) layer on top of the underlying criminal charge. A misstep at any stage — a phone call to the protected party, a missed no-contact condition — can convert a misdemeanor into a new felony. This playbook covers the full case lifecycle from arrest through diversion or trial.",
  typicalTimeline: "3–12 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Most jurisdictions have mandatory prosecution policies — prosecutors often cannot dismiss even when the alleged victim wants to. Do not advise the client to pressure the victim to recant.",
    "No-contact orders are conditions of release. A single violation is a new crime, often a felony. Brief your client on this immediately and thoroughly.",
    "Firearms consequences: federal law (18 U.S.C. § 922(g)(9)) prohibits possession of firearms after any domestic violence misdemeanor conviction. This is a permanent ban. Alert client if they are law enforcement or military.",
    "Immigration: a DV misdemeanor can be a 'crime of violence' and trigger deportability. Screen every non-citizen client before any plea.",
    "Child custody: a DV conviction is often automatic grounds for modification of custody. Alert clients with pending family court matters.",
    "Victim cooperation is not required for prosecution — in many states, the victim's prior 911 call or statement is admissible even if they do not testify."
  ],
  stages: [
    {
      id: "initial-response",
      name: "Initial Response & Client Interview",
      timeline: "Days 1–3",
      description: "Secure the client's safety and freedom while conducting an immediate legal assessment.",
      keyActions: [
        {
          text: "Advise client in the clearest possible terms: do NOT contact the protected party — phone, text, social media, through a third party",
          priority: "critical",
          deadline: "At first contact",
          type: "client"
        },
        {
          text: "Obtain a copy of the protective order and all conditions of release — review them line by line with the client",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct full client interview: relationship to alleged victim, history, what happened, any witnesses, any injuries documented",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess client's immigration status — DV misdemeanor has major immigration consequences",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Determine if client has firearms at home — advise on legal obligation to surrender if protective order is in effect",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify any pending family court / child custody proceedings — coordinate strategy",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-continue",
          name: "Motion to Continue",
          relevance: "Request time to investigate before any preliminary hearing or trial date"
        }
      ],
      clientGuidance: "Your client is likely frightened and may believe that if the victim 'drops the charges,' the case will go away. Explain clearly: in most jurisdictions the state prosecutes, not the victim. The victim cannot 'drop charges.' Any contact with the protected party — even at their request — violates the protective order and is a new crime.",
      pitfalls: [
        "Client contacting the protected party to 'work things out' — this is a new crime and often a felony",
        "Not reading the protective order carefully — some prohibit all contact, others allow contact in family court only",
        "Missing the firearms surrender issue — law enforcement clients face immediate termination and loss of career"
      ]
    },
    {
      id: "protective-order-review",
      name: "Protective Order Hearing",
      timeline: "Days 1–14",
      description: "Contest or modify the protective order at the earliest opportunity.",
      keyActions: [
        {
          text: "Appear at any civil or criminal protective order hearing and contest the order if appropriate",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If client and victim share a residence with children: request a 'peaceful contact' modification for family court purposes",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather evidence for modification: shared children, shared residence, documented co-parenting arrangement",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client that moving out of shared residence voluntarily (to avoid violations) is often the safest short-term choice",
          priority: "high",
          type: "client"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If your client and the alleged victim share children, a peaceful contact modification for co-parenting (pick-up/drop-off only, through third parties) may be possible. This must be done through the court — the client cannot simply 'agree' with the victim to have contact.",
      pitfalls: [
        "Assuming the protective order allows contact just because the victim reaches out to the client",
        "Not seeking a modification when shared children require co-parenting — months of separation harms the family unnecessarily"
      ]
    },
    {
      id: "victim-relations",
      name: "Victim Cooperation Assessment",
      timeline: "Weeks 2–6",
      description: "Assess the prosecution's case strength based on victim cooperation and the available evidence.",
      keyActions: [
        {
          text: "Determine whether the prosecution has the victim's cooperation or is relying on prior statements",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request all recorded statements: 911 calls, body cam, written statements, photos of injuries",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If victim is non-cooperative: assess whether prosecution will proceed on 'evidence-based prosecution' (prior statements, 911 call, photos)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research Crawford / Confrontation Clause issues if victim will not testify and prosecution seeks to admit prior statements",
          priority: "high",
          type: "attorney"
        },
        {
          text: "NEVER advise, encourage, or allow client to contact victim regarding their cooperation",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request 911 recordings, body cam footage, police reports, victim statements, and medical records"
        }
      ],
      clientGuidance: "If the victim reaches out to you or your client to say they 'want to drop the charges,' the correct response is: 'I understand. Please speak with the prosecutor if you wish to share that. I cannot advise you on this.' Document the contact. Never coach the victim.",
      pitfalls: [
        "Assuming non-cooperative victim means case will be dismissed — prosecutors in DV cases are trained to prosecute without the victim",
        "Not raising Crawford / Confrontation Clause objections early if the victim is expected to be unavailable",
        "Failing to request 911 recordings — these are often the most powerful prosecution evidence and must be challenged early"
      ]
    },
    {
      id: "diversion-assessment",
      name: "Diversion & Batterer's Intervention",
      timeline: "Weeks 2–8",
      description: "Assess diversion eligibility before engaging in plea negotiations.",
      keyActions: [
        {
          text: "Research domestic violence diversion program eligibility in the jurisdiction",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess whether client is eligible: first offense, nature of charges, victim input",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Verify that diversion agreement does not include admissions that could harm immigration or custody cases",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If diversion requires batterer's intervention program (BIP): enroll client proactively to demonstrate good faith",
          priority: "high",
          type: "client"
        },
        {
          text: "Advise client that voluntary BIP enrollment before diversion is offered often results in better terms",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Diversion in DV cases often requires completing a Batterer's Intervention Program (BIP) — typically 26–52 weeks of weekly group sessions. Explain to your client that BIP is not just a legal requirement: courts and prosecutors view voluntary enrollment as a sign of accountability.",
      pitfalls: [
        "Diversion programs that include a 'factual basis' admission — these can be used in family court and immigration proceedings",
        "Client failing to complete BIP — leads to revocation of diversion and return to criminal prosecution",
        "Not confirming immigration safety of any plea or diversion agreement"
      ]
    },
    {
      id: "pretrial-plea",
      name: "Pre-Trial Motions & Plea Negotiation",
      timeline: "Months 2–8",
      description: "Litigate suppression issues and negotiate the best possible resolution.",
      keyActions: [
        {
          text: "File motion to suppress if initial police contact lacked probable cause",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge any excited utterance or dying declaration exceptions if victim's prior statement is introduced",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate for reduction to non-DV offense (simple assault, disorderly conduct) to avoid firearms ban and immigration consequences",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For non-citizen clients: confirm immigration safety of any proposed plea with immigration counsel",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Challenge evidence from warrantless entry, unlawful detention, or coerced statements"
        },
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss for insufficient evidence, speedy trial, or constitutional violations"
        }
      ],
      clientGuidance: "The most important negotiating outcome in many DV cases is avoiding the domestic violence designation. A plea to 'simple assault' (no domestic relationship element) avoids the federal firearms ban and reduces immigration and custody consequences. This negotiation is often the most valuable thing you can do for your client.",
      pitfalls: [
        "Pleading to a DV offense without exploring whether a non-DV reduction is available",
        "Not confirming firearms consequences — a client who is a hunter, security guard, or military member faces life-altering consequences",
        "Accepting plea terms that include 'no contact' conditions that extend beyond the criminal case into family court matters"
      ]
    },
    {
      id: "sentencing",
      name: "Sentencing",
      timeline: "Post-plea or post-trial",
      description: "Minimize sentencing consequences and establish a path to eventual expungement.",
      keyActions: [
        {
          text: "Present mitigation: no prior record, voluntary BIP enrollment, employment, family support",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Argue against incarceration in favor of probation with BIP and counseling",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client on expungement eligibility after conviction or diversion completion",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Advise client on firearms surrender timeline if DV conviction is entered",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If a DV conviction is unavoidable, advise your client on the path forward: complete probation without violations, complete BIP, avoid any new contact violations, and then explore expungement. The firearms disability is permanent and not expungeable under federal law — this must be communicated clearly.",
      pitfalls: [
        "Not advising client about the permanent federal firearms ban — there is no expungement or restoration mechanism",
        "Failing to document BIP enrollment for sentencing — courts reward proactive steps",
        "Not exploring expungement eligibility after the case closes — clients deserve to know what's possible"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Mandatory Arrest",
      variations: [
        {
          states: ["CA", "NY", "NJ", "WA", "CO", "CT", "IL", "MA", "MN", "OR", "TX", "VA"],
          note: "These states have mandatory or preferred arrest policies for domestic violence. Officers are required or strongly directed to arrest the primary aggressor. Dual arrests (both parties) are disfavored."
        },
        {
          states: ["FL", "GA", "OH", "PA", "MI"],
          note: "Discretionary arrest — officer uses judgment. However, many departments have de facto mandatory arrest policies through internal policy."
        }
      ]
    },
    {
      topic: "No-Drop Prosecution",
      variations: [
        {
          states: ["CA", "NY", "CO", "WA", "MN"],
          note: "These jurisdictions have no-drop policies — prosecutors proceed even over victim objection. Evidence-based prosecution using 911 calls, body cam, and medical records is standard."
        }
      ]
    },
    {
      topic: "Domestic Violence Diversion",
      variations: [
        {
          states: ["CA"],
          note: "California PC § 1000.6 (Domestic Violence Diversion) — available for misdemeanors if no prior DV convictions, no restraining order history, and victim does not object. Requires 52-week BIP. Successful completion = dismissal."
        },
        {
          states: ["CO"],
          note: "Colorado has a formal Deferred Judgment and Sentence program available for first-time DV offenders. Requires treatment completion."
        },
        {
          states: ["NY"],
          note: "New York: diversion available through Adjournment in Contemplation of Dismissal (ACD) — charges are dismissed after 6 months of compliance. DV-ACD requires anger management/counseling."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-dismiss", "motion-to-continue", "motion-for-discovery"],
  tags: ["domestic violence", "DV", "misdemeanor assault", "protective order", "no-contact", "BIP", "firearms disability"]
};
