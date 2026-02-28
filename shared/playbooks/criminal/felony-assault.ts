import type { Playbook } from "../schema";

export const felonyAssaultPlaybook: Playbook = {
  id: "felony-assault",
  category: "criminal",
  name: "Felony Assault / Aggravated Assault",
  tagline: "Self-defense, credibility, and the weapon element — fight all three",
  overview: "Felony assault charges — aggravated assault, assault with a deadly weapon, assault causing great bodily injury — carry serious sentencing exposure and collateral consequences. The defense typically turns on three contested issues: (1) self-defense or defense of others, (2) the credibility battle between the complainant and the defendant, and (3) whether the weapon or injury level actually meets the aggravating element. Unlike misdemeanor assault, these cases require intensive investigation, often a crime scene visit, and medical record analysis. Winning the preliminary hearing to avoid a felony bind-over is often the first critical battleground.",
  typicalTimeline: "6 months to 2 years",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Self-defense is the most powerful defense in assault cases — it is an affirmative defense but shifts the burden in many jurisdictions once raised. Build this defense from the first client interview.",
    "The complaining witness's credibility is almost always contested. Investigate their background, prior contacts with the defendant, any motive to fabricate, and prior inconsistent statements.",
    "The 'deadly weapon' or 'great bodily injury' element is a legal conclusion drawn from facts — challenge the characterization of the weapon and the severity of the injury with medical evidence.",
    "Strike or preliminary hearing: in many states, a preliminary hearing is the first opportunity to test the prosecution's evidence. Cross-examining the complaining witness early can lock in their story and expose weaknesses.",
    "Self-defense immunity: some states (California, Florida, Texas) provide immunity from prosecution if self-defense is established — explore this before trial.",
    "Immigration: felony assault is often a crime of violence and may constitute an aggravated felony. The immigration analysis must occur before any plea."
  ],
  stages: [
    {
      id: "initial-investigation",
      name: "Initial Investigation",
      timeline: "Days 1–14",
      description: "Conduct an immediate investigation before evidence disappears and witnesses' memories fade.",
      keyActions: [
        {
          text: "Conduct full client interview: what happened, sequence of events, any prior relationship with complainant, any threats or aggressions by complainant",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Visit the crime scene immediately — document layout, lighting, sight lines, any surveillance cameras",
          priority: "critical",
          deadline: "Within 72 hours if possible",
          type: "attorney"
        },
        {
          text: "Send preservation letters to all nearby businesses for surveillance footage",
          priority: "critical",
          deadline: "Within 24–48 hours — footage overwrites quickly",
          type: "attorney"
        },
        {
          text: "Identify and interview independent witnesses before prosecution does",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain and review police report for inconsistencies with client's account",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen client's immigration status — assault as a crime of violence has severe immigration consequences",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research complainant's criminal history and prior contacts with law enforcement",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request all police reports, body cam footage, 911 recordings, medical records, and complainant's criminal history"
        }
      ],
      clientGuidance: "Ask your client to reconstruct the event in as much detail as possible — from what they were doing before the incident through the moment police arrived. Specific details (what was said, who moved first, exact positions) are crucial for a self-defense claim and will be tested against the complainant's version.",
      pitfalls: [
        "Missing surveillance footage — cameras at nearby businesses are the single most objective evidence source and footage is often overwritten in 24–72 hours",
        "Not visiting the crime scene — physical layout often contradicts the prosecution's narrative",
        "Failing to research the complainant's background — prior violence, false reporting, drug use, and motive to fabricate are all fair game"
      ]
    },
    {
      id: "preliminary-hearing",
      name: "Preliminary Hearing Strategy",
      timeline: "Days 14–60",
      description: "Use the preliminary hearing to test evidence, cross-examine the complainant, and fight the felony bind-over.",
      keyActions: [
        {
          text: "Assess whether a preliminary hearing is available and whether cross-examining the complainant is strategic",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Cross-examine the complaining witness — lock in their story, expose inconsistencies, probe motive to fabricate",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge the 'deadly weapon' or 'great bodily injury' element at the preliminary hearing",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Move to dismiss or reduce to misdemeanor if the prosecution fails to establish probable cause for the felony element",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss or reduce if probable cause is not established for the felony element at the preliminary hearing"
        }
      ],
      clientGuidance: "Explain to your client that the preliminary hearing is a hearing about evidence — not a verdict. They will see the complainant testify. Coach them: no reactions, no outbursts, no communication with anyone in the courtroom. The way they present themselves here sets the tone for the entire case.",
      pitfalls: [
        "Waiving the preliminary hearing without careful thought — it is often the best free discovery tool available",
        "Not locking in the complainant's story at the preliminary hearing — prior testimony is powerful impeachment at trial",
        "Failing to challenge the specific felony element (weapon, injury level) — a successful challenge can reduce the charge to a misdemeanor"
      ]
    },
    {
      id: "self-defense-development",
      name: "Self-Defense Development",
      timeline: "Weeks 2–8",
      description: "Build the factual and legal framework for a self-defense or defense-of-others claim.",
      keyActions: [
        {
          text: "Research state self-defense law: duty to retreat vs. stand your ground, castle doctrine, proportionality",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather evidence of complainant's prior violence, reputation for violence, or threats made before the incident",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Preserve any evidence of the client's injuries from the incident — medical records, photographs",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research self-defense immunity statutes (if applicable) — file immunity motion before trial",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify witnesses who saw the complainant's aggressive behavior before or during the incident",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress any statements made by client without proper Miranda advisement"
        }
      ],
      pitfalls: [
        "Not raising self-defense early enough — evidence supporting the claim (complainant's injuries, client's injuries, layout of scene) must be preserved immediately",
        "Missing the self-defense immunity motion where available — in immunity jurisdictions, winning the immunity hearing avoids trial entirely",
        "Not investigating the complainant's prior violent acts — under FRE 404(a) and state equivalents, prior acts of the victim may be admissible in self-defense cases"
      ]
    },
    {
      id: "pretrial-motions",
      name: "Pre-Trial Motions",
      timeline: "Months 2–8",
      description: "Suppress evidence, challenge the legal sufficiency of charges, and prepare for trial.",
      keyActions: [
        {
          text: "File motion to suppress any unlawfully obtained statements or evidence",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the characterization of the injury — obtain defense medical expert if 'great bodily injury' is disputed",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Move to exclude prior bad acts of the defendant under FRE 404(b) / state equivalents",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File notice of self-defense to give the court and prosecution adequate notice of the defense theory",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress statements, evidence from unlawful arrest, or improperly seized weapons"
        },
        {
          templateId: "motion-to-continue",
          name: "Motion to Continue",
          relevance: "Request additional time for expert analysis of injury severity or weapon characterization"
        }
      ],
      pitfalls: [
        "Not retaining a medical expert when 'great bodily injury' is disputed — the prosecution's medical evidence is not automatically correct",
        "Failing to file a 404(b) motion — prior bad acts evidence in assault cases can be highly prejudicial and often excludable",
        "Missing the deadline for filing a self-defense notice where required by local rule"
      ]
    },
    {
      id: "plea-trial",
      name: "Plea Negotiation or Trial",
      timeline: "Months 4–18",
      description: "Resolve by negotiated plea or take the case to trial with a fully developed defense.",
      keyActions: [
        {
          text: "Evaluate whether a negotiated reduction (felony to misdemeanor, aggravated to simple assault) avoids immigration consequences",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If going to trial: retain expert witnesses as needed (medical, crime scene reconstruction, use-of-force expert)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare client for testimony — direct examination and cross on self-defense claim",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Develop jury instructions on self-defense — ensure they accurately reflect state law",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Walk your client through the self-defense jury instruction so they understand exactly what the jury will be told to decide. If they plan to testify, prepare them for the prosecution's cross-examination on why they did not retreat, walk away, or call police before the confrontation.",
      pitfalls: [
        "Accepting a felony plea without exploring whether a misdemeanor reduction preserves the client's immigration status",
        "Going to trial on self-defense without a use-of-force expert when the prosecution contests the reasonableness of the force used",
        "Failing to request a self-defense jury instruction — courts sometimes omit it if not specifically requested"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Stand Your Ground vs. Duty to Retreat",
      variations: [
        {
          states: ["FL", "TX", "AZ", "GA", "AL", "SC", "NC", "OK", "TN", "UT", "WY", "ID", "AK", "MT", "ND", "SD", "KS", "MS", "WV", "MO", "AR", "LA", "IN", "KY", "OH", "PA", "NH", "ND", "MI"],
          note: "Stand Your Ground states: no duty to retreat before using force in any place the person has a legal right to be. Some states also provide immunity from civil suit."
        },
        {
          states: ["CA", "NY", "NJ", "MA", "CT", "RI", "DE", "MD", "HI", "ME", "VT", "MN", "WI", "IA", "NE", "NM", "CO", "WA", "OR"],
          note: "Duty to retreat states: must retreat if safely possible before using deadly force (outside the home). Castle doctrine typically eliminates the duty to retreat within the home."
        }
      ]
    },
    {
      topic: "Self-Defense Immunity",
      variations: [
        {
          states: ["FL"],
          note: "Florida SYG § 776.032: immunity from criminal prosecution AND civil suit. Pre-trial immunity hearing where prosecution must prove by clear and convincing evidence that the use of force was unlawful. A winning immunity motion ends the case before trial."
        },
        {
          states: ["CA"],
          note: "California does not have a formal immunity statute but courts recognize pre-trial Penal Code § 995 motions that can be used to test the self-defense claim. Self-defense is a complete defense if established."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-for-discovery", "motion-to-suppress", "motion-to-dismiss", "motion-to-continue"],
  tags: ["felony assault", "aggravated assault", "assault with deadly weapon", "self-defense", "stand your ground", "GBI", "crime of violence"]
};
