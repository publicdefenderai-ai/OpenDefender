import type { Playbook } from "../schema";

export const resistingObstructionPlaybook: Playbook = {
  id: "resisting-obstruction",
  category: "criminal",
  name: "Resisting Arrest / Obstruction of Justice",
  tagline: "Challenge the lawfulness of the arrest and the sufficiency of the resistance",
  overview: "Resisting arrest and obstruction charges are among the most frequently stacked onto other charges in urban policing. They are often added when police use force, creating a perverse dynamic: the defendant was subjected to force and then charged with resisting that force. The defense strategy exploits two core weaknesses: (1) if the underlying arrest was unlawful, resistance to it is legally justified in many states, and (2) the 'resistance' alleged is often de minimis — tensing up, pulling away, or verbal refusal — that does not meet the legal standard for the charge.",
  typicalTimeline: "1–6 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Lawfulness of the arrest is the threshold question: if the arrest was unlawful, resistance to it is legally justified in a minority of states (and arguably a constitutional right in others). Know your state's rule precisely.",
    "These charges are often add-ons after use of force — the charging pattern suggests retaliatory charging. Document this pattern and use it in mitigation.",
    "Body camera footage is almost always available and is usually the most important evidence. Request it immediately.",
    "De minimis resistance is a defense: 'tensing up,' pulling away reflexively, or verbal protest typically does not constitute legally cognizable resistance.",
    "Excessive force connection: if police used excessive force, the client's reaction may be legally justified, and the excessive force evidence is independently valuable for suppression and civil claims.",
    "Immigration: obstruction and resisting are generally not CIMTs but may affect good moral character findings. Screen non-citizen clients."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review",
      timeline: "Days 1–7",
      description: "Obtain all body camera footage and police reports before they disappear or are edited.",
      keyActions: [
        {
          text: "Immediately request all body camera footage from the arresting officers — file a formal preservation demand",
          priority: "critical",
          deadline: "Within 24 hours — preservation demand must go to the agency",
          type: "attorney"
        },
        {
          text: "Request all police reports and use-of-force reports associated with the incident",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct client interview: what were they doing, what did officers say, what force was used, what did client do",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess the lawfulness of the underlying arrest: was there probable cause for the original detention/arrest?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify any civilian witnesses who observed the arrest",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Document any injuries to the client from police force — photograph immediately",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request all body cam footage, dash cam, use-of-force reports, officer disciplinary history, and CAD records"
        }
      ],
      clientGuidance: "Ask your client to describe the physical contact in detail — exactly what the officers said and did, and exactly what they did in response. Distinguish between voluntary movement (reaching for something, pulling away) and involuntary physical response (flinching, stumbling). The legal distinction matters.",
      pitfalls: [
        "Not immediately preserving body camera footage — agencies have short retention windows (often 60–90 days) for footage not flagged for preservation",
        "Failing to photograph client's injuries immediately — injuries from police force both support a self-defense claim and document potential civil liability",
        "Not assessing the lawfulness of the underlying arrest — if the original stop or arrest was illegal, the entire resisting charge may be legally invalid"
      ]
    },
    {
      id: "lawfulness-analysis",
      name: "Underlying Arrest Lawfulness Analysis",
      timeline: "Weeks 1–4",
      description: "Determine whether the original arrest was lawful — this controls the legal justification defense.",
      keyActions: [
        {
          text: "Research state law on right to resist an unlawful arrest — states vary dramatically",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If the underlying arrest was unlawful: file motion to suppress and argue justified resistance",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If the state has abolished the right to resist: assess whether the conduct still constitutes legally cognizable resistance",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research the officer's use-of-force policy violations — if force was excessive, the client may have had a right to defend themselves",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress evidence derived from an unlawful stop or arrest that preceded the resisting charge"
        }
      ],
      pitfalls: [
        "Advising a client they had a right to resist without knowing the state's current law — most states have abolished or severely limited the common-law right to resist arrest",
        "Not connecting the unlawful arrest analysis to the suppression motion — if the original stop was illegal, all evidence flowing from it (including the observed resistance) is suppressible"
      ]
    },
    {
      id: "sufficiency-challenge",
      name: "Sufficiency of Resistance Challenge",
      timeline: "Weeks 2–8",
      description: "Challenge whether the alleged conduct meets the legal definition of 'resistance' or 'obstruction.'",
      keyActions: [
        {
          text: "Research the specific legal standard for 'resistance' in the jurisdiction — most require active physical resistance, not passive non-compliance",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review body camera footage frame-by-frame — does it show active resistance or involuntary movement?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For obstruction charges: research whether purely verbal conduct (arguing, lying to police about name) is legally sufficient",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the officer's characterization of 'going limp' or 'tensing up' as legally cognizable resistance",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss for failure to state a legally sufficient resistance or obstruction charge"
        }
      ],
      clientGuidance: "Review the body cam footage with your client before any court date. Clients are often surprised by what the footage shows — and so are judges. If the footage shows the client was compliant or the resistance was minimal, this is often the strongest argument for dismissal.",
      pitfalls: [
        "Not distinguishing between active and passive resistance — most statutes require active physical resistance, not merely failing to cooperate",
        "Accepting police characterization of behavior as resistance without reviewing the body cam footage",
        "Not knowing whether verbal obstruction (lying to police) is criminalized in your jurisdiction — it varies significantly"
      ]
    },
    {
      id: "resolution",
      name: "Dismissal, Diversion, or Trial",
      timeline: "Months 1–5",
      description: "Use the body cam evidence and legal arguments to achieve dismissal or reduction.",
      keyActions: [
        {
          text: "Present body cam footage to the prosecutor early — many resisting charges are dismissed when footage shows de minimis conduct",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Negotiate dismissal of the resisting charge in exchange for a plea on the underlying offense, if appropriate",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Consider civil claims for excessive force — even if the criminal case resolves, a § 1983 civil claim may be viable",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Research officer's disciplinary history for prior excessive force complaints — admissible in some jurisdictions",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss on insufficiency of evidence, unlawful arrest, or de minimis conduct grounds"
        }
      ],
      clientGuidance: "If the footage shows excessive force by police, advise your client about the potential for a civil rights claim under 42 U.S.C. § 1983 even after the criminal case resolves. A referral to a civil rights attorney protects their rights beyond the criminal case.",
      pitfalls: [
        "Not offering to show the body cam footage to the prosecutor before motions — many prosecutors will dismiss or reduce when they see the actual footage",
        "Missing the civil rights claim — clients subjected to excessive force have a federal civil rights remedy independent of the criminal case",
        "Failing to explore diversion for a first-time resisting charge when the underlying conduct is minor"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Right to Resist Unlawful Arrest",
      variations: [
        {
          states: ["IN"],
          note: "Indiana codified a limited right to resist unlawful police entry into a home (IC § 35-41-3-2). This is one of the strongest statutory protections in the country."
        },
        {
          states: ["CA", "NY", "TX", "FL", "IL", "WA", "OR"],
          note: "Most states have abolished the common-law right to resist even an unlawful arrest — the remedy is a legal challenge after the fact, not physical resistance. Know your state's current rule before advising."
        }
      ]
    },
    {
      topic: "Verbal Obstruction",
      variations: [
        {
          states: ["MA"],
          note: "Massachusetts: lying to police is not a criminal offense unless it constitutes obstruction of a specific investigation. Mere denial of identity is not obstruction."
        },
        {
          states: ["TX"],
          note: "Texas PC § 38.15: obstruction requires physical interference with a public servant, not merely verbal. Providing false ID is a separate offense."
        },
        {
          states: ["FL"],
          note: "Florida § 843.02: obstruction can be charged for verbal interference that meaningfully impedes an officer's performance of duties. Courts interpret this broadly."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-dismiss", "motion-for-discovery"],
  tags: ["resisting arrest", "obstruction", "body camera", "excessive force", "unlawful arrest", "police misconduct", "stacked charges"]
};
