import type { Playbook } from "../schema";

export const weaponsFirearmsPlaybook: Playbook = {
  id: "weapons-firearms",
  category: "criminal",
  name: "Weapons / Firearms Charges",
  tagline: "Constructive possession, unlawful search, and the federal nexus",
  overview: "Weapons and firearms charges sit at the intersection of the Second Amendment, the Fourth Amendment, and some of the harshest mandatory minimums in American criminal law. Federal 18 U.S.C. § 922(g) — felon in possession — carries up to 10 years (and up to 15 under the Armed Career Criminal Act if three prior qualifying felonies exist). State charges vary widely. The defense must attack on three fronts simultaneously: (1) the legality of the search that discovered the weapon, (2) the constructive possession element if the weapon was not found on the client's person, and (3) the prior conviction predicate for felon-in-possession charges.",
  typicalTimeline: "6 months to 3 years",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Federal felon-in-possession (§ 922(g)) is almost always charged alongside state charges when the defendant has prior felonies. Assess federal prosecution risk immediately.",
    "The Armed Career Criminal Act (ACCA, 18 U.S.C. § 924(e)) mandates a 15-year minimum if the defendant has three prior 'violent felony' or 'serious drug offense' convictions. Run the ACCA analysis on every prior conviction using the categorical approach.",
    "Constructive possession requires knowing control — if the weapon was not on the client's person, challenge the prosecution's ability to prove the client knew about it and exercised control over it.",
    "The Fourth Amendment is the most powerful tool in gun cases — weapons are almost always discovered through a search. Challenge every warrantless search, every traffic stop, and every frisk.",
    "New York State Rifle & Pistol Ass'n v. Bruen (2022) opened new Second Amendment challenges to state firearm regulations. Research whether the specific state charge is post-Bruen constitutionally vulnerable.",
    "Prohibited person status: research whether the prior conviction that makes the client a 'prohibited person' is itself challengeable (vacated, expunged, juvenile adjudication, or a Rehaif issue)."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review & Federal Risk Assessment",
      timeline: "Days 1–14",
      description: "Map the full legal landscape — federal vs. state exposure, ACCA risk, and search legality.",
      keyActions: [
        {
          text: "Assess federal prosecution risk: has the U.S. Attorney's Office been notified? Prior felony history?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Run ACCA analysis: count qualifying prior 'violent felony' and 'serious drug offense' convictions — three triggers 15-year mandatory minimum",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess whether the prior conviction making the client a 'prohibited person' is challengeable (Rehaif v. United States — did client know they were a prohibited person?)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review how the weapon was discovered — traffic stop, warrant search, pat-frisk? Identify Fourth Amendment issues",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If weapon was not on client's person: assess constructive possession element — location, exclusive access, knowledge",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen for immigration consequences — § 922(g) conviction is an aggravated felony",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request all search warrant materials, officer body cam, traffic stop records, and chain of custody for the firearm"
        }
      ],
      clientGuidance: "Ask your client: 'Where exactly was the weapon found? Were you alone? Who else had access to that location?' If the weapon was not on the client's body — in a car, in a home, near multiple people — the constructive possession analysis is the defense.",
      pitfalls: [
        "Missing the ACCA analysis — a client who believes they face 10 years may actually face a 15-year mandatory minimum, completely changing the plea calculus",
        "Not researching Rehaif — since Rehaif v. United States (2019), the government must prove the defendant knew they belonged to a prohibited category at the time of possession",
        "Accepting the search as lawful without carefully reviewing the traffic stop, the basis for the frisk, and the scope of any warrant"
      ]
    },
    {
      id: "fourth-amendment",
      name: "Fourth Amendment Challenge",
      timeline: "Weeks 2–10",
      description: "Challenge the legality of the search that produced the weapon — the most powerful defense available.",
      keyActions: [
        {
          text: "For traffic stops: was there valid reasonable suspicion for the stop? Was the frisk justified by specific articulable facts?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For warrant searches: was probable cause established? Was the warrant particularity sufficient? Was it properly executed?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For home searches: was consent voluntary and uncoerced? Did a co-occupant with authority consent?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File Franks motion if the search warrant affidavit contained false or misleading information",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge any 'plain view' theory — the officer must have had lawful access to the vantage point where the weapon was observed",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress the firearm as fruit of an unlawful search or seizure — if the gun is suppressed, there is no case"
        }
      ],
      pitfalls: [
        "Not challenging the stop that led to discovery of the weapon — the traffic stop is the beginning of the Fourth Amendment analysis, not the search itself",
        "Overlooking Rodriguez v. United States (2015) — a traffic stop cannot be extended beyond its mission to allow a dog sniff without independent reasonable suspicion",
        "Not calling the officer to testify at the suppression hearing — cross-examination often reveals the stop or frisk lacked the required legal basis"
      ]
    },
    {
      id: "constructive-possession",
      name: "Constructive Possession Challenge",
      timeline: "Weeks 4–12",
      description: "If the weapon was not on the client's person, challenge the prosecution's ability to prove knowing possession.",
      keyActions: [
        {
          text: "Identify all other individuals with access to the location where the weapon was found",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge 'knowing' possession — was there any evidence the client actually knew the weapon was present?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request fingerprint and DNA analysis of the weapon — absence of client's prints is powerful evidence",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge 'dominion and control' — did the client exclusively control the space where it was found or was it accessible to others?",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Assuming constructive possession is easy to prove — it requires knowledge AND dominion and control. Proximity alone is insufficient.",
        "Not requesting forensic testing — if the client's fingerprints and DNA are not on the weapon, this is strong evidence they did not possess it",
        "Failing to identify other individuals with equal or superior access to the location"
      ]
    },
    {
      id: "prior-conviction-challenge",
      name: "Prior Conviction & Prohibited Status Challenge",
      timeline: "Weeks 4–16",
      description: "Challenge the prior conviction that creates the prohibited person status.",
      keyActions: [
        {
          text: "Obtain records of the prior conviction — was it a valid felony under the categorical approach?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess whether the prior conviction has been expunged, vacated, or set aside — and whether that removes prohibited status",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess Rehaif issue: did the client actually know they were a 'prohibited person' at the time of possession?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For ACCA cases: apply categorical approach to each prior to determine if it qualifies as a 'violent felony' under current Supreme Court precedent",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research Bruen-based Second Amendment challenge to the specific state firearms regulation charged",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss if the prior conviction predicate is invalid under the categorical approach or Rehaif"
        }
      ],
      pitfalls: [
        "Accepting the ACCA predicate analysis without applying the current categorical approach — many priors no longer qualify as 'violent felonies' after Johnson v. United States (2015) and Borden v. United States (2021)",
        "Missing the Rehaif knowledge element — the government must prove the client knew they were in a prohibited class",
        "Not exploring restoration of firearm rights after expungement — some states restore civil rights including firearm rights after completion of sentence"
      ]
    },
    {
      id: "plea-trial",
      name: "Plea Negotiation or Trial",
      timeline: "Months 6–24",
      description: "Leverage suppression wins and possession challenges to negotiate or try the case.",
      keyActions: [
        {
          text: "Evaluate plea offers in light of suppression ruling — a denied suppression motion changes the calculus significantly",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Negotiate for dismissal or reduction of the federal § 922(g) charge to a state charge to avoid mandatory minimums",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If trial: prepare constructive possession and/or Rehaif defense — jury must find all elements beyond a reasonable doubt",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Confirm immigration consequences of any proposed plea — firearms convictions are aggravated felonies",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Accepting a § 922(g) plea for a non-citizen client without immigration analysis — this is an aggravated felony with mandatory deportation consequences",
        "Not exploring whether a state-only plea (avoiding the federal charge) reduces sentence exposure",
        "Failing to request a Rehaif instruction if going to trial — courts have been inconsistent on this instruction"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Federal ACCA Triggers",
      variations: [
        {
          states: ["ALL"],
          note: "Armed Career Criminal Act (18 U.S.C. § 924(e)): mandatory 15-year minimum for § 922(g) defendants with 3 prior 'violent felony' or 'serious drug offense' convictions. 'Violent felony' analysis uses the categorical approach — the statute of conviction, not the facts. After Johnson (2015) and Borden (2021), many offenses no longer qualify."
        }
      ]
    },
    {
      topic: "Bruen Second Amendment Challenges",
      variations: [
        {
          states: ["NY", "CA", "NJ", "MA", "MD", "HI", "CT", "IL", "DE", "RI"],
          note: "NYSRPA v. Bruen (2022) struck down 'good cause' requirements for public carry permits. Many state firearms regulations face post-Bruen challenges. Research whether the specific restriction charged has a historical analog in the Founding Era — if not, it may be unconstitutional."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-dismiss", "motion-for-discovery"],
  tags: ["weapons", "firearms", "felon in possession", "922(g)", "ACCA", "constructive possession", "gun charge", "Second Amendment"]
};
