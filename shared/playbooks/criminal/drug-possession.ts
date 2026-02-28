import type { Playbook } from "../schema";

export const drugPossessionPlaybook: Playbook = {
  id: "drug-possession",
  category: "criminal",
  name: "Simple Drug Possession",
  tagline: "Maximize diversion, minimize consequences",
  overview: "Simple drug possession cases often present the best opportunity for diversion, treatment, or dismissal. The defense strategy centers on three pillars: (1) Fourth Amendment — was the search lawful? (2) Constructive possession — did the client knowingly possess the substance? (3) Diversion — can the case be resolved without a conviction through drug court, deferred prosecution, or similar programs?",
  typicalTimeline: "3–12 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Diversion eligibility should be the FIRST assessment — many clients qualify for programs that lead to dismissal.",
    "The Fourth Amendment is your friend: most drug cases begin with a search. Challenge every warrantless search.",
    "Immigration consequences: drug convictions carry devastating immigration penalties. A single drug conviction — even for marijuana — can bar adjustment of status and trigger removal.",
    "Felony vs. misdemeanor distinction matters enormously. In states that have reduced possession to a misdemeanor, a felony charge may indicate overcharging.",
    "Lab analysis must be verified — field tests are notoriously unreliable and have resulted in false positives."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Case Review & Diversion Assessment",
      timeline: "Days 1–14",
      description: "Evaluate all aspects of the arrest, assess Fourth Amendment issues, and determine diversion eligibility.",
      keyActions: [
        {
          text: "Review police report for Fourth Amendment issues: stop, search, and seizure analysis",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess diversion eligibility (drug court, deferred prosecution, Proposition 36, etc.)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request lab report confirming substance identity and weight",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct immigration screening — identify citizenship and immigration status",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request all officer body-cam and dash-cam footage",
          priority: "high",
          deadline: "Send preservation letter within 48 hours",
          type: "attorney"
        },
        {
          text: "Advise client not to discuss the case with anyone, including family members",
          priority: "high",
          type: "client"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request lab reports, chain of custody records, body cam footage, and search warrant materials"
        }
      ],
      clientGuidance: "Ask your client directly about their immigration status early and in a privileged setting. Explain that a drug conviction can result in deportation, inadmissibility, or denial of green card — even for marijuana in states where it is legal. Do not let them plead before you assess immigration consequences.",
      pitfalls: [
        "Failing to assess diversion eligibility before arraignment — some programs require early enrollment",
        "Ignoring the lab report — field test 'hits' are unreliable; prosecutorial delays in lab testing can create speedy trial issues",
        "Missing immigration consequences — a guilty plea to simple possession can end a client's path to citizenship"
      ]
    },
    {
      id: "diversion-assessment",
      name: "Diversion & Treatment Programs",
      timeline: "Weeks 2–6",
      description: "Pursue every available diversion pathway before litigating the case.",
      keyActions: [
        {
          text: "Apply for drug court or diversion program if eligible",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Connect client with substance use evaluation if needed for diversion application",
          priority: "high",
          type: "client"
        },
        {
          text: "Negotiate deferred prosecution agreement with prosecutor",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research state-specific diversion programs: Prop 36 (CA), SB 91 (OH), TAIP (TX)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Confirm whether proposed diversion program will result in dismissal (not just reduced charges)",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If your client qualifies for drug court or diversion, explain the trade-offs clearly: they must comply with program requirements (treatment, check-ins, drug testing) for a set period, but successful completion leads to dismissal. Violations result in returning to criminal court.",
      pitfalls: [
        "Recommending diversion without confirming immigration safety — some diversion 'convictions' or admissions still trigger immigration consequences",
        "Client failing diversion due to lack of support — connect them with case management resources",
        "Not checking if prior diversion use bars current program eligibility"
      ]
    },
    {
      id: "pretrial-motions",
      name: "Pre-Trial Motions",
      timeline: "Months 2–6",
      description: "If diversion is unavailable, litigate Fourth Amendment issues and challenge the evidence.",
      keyActions: [
        {
          text: "File motion to suppress if search was warrantless and no exception applies",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge constructive possession if drugs were not in client's exclusive control",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to dismiss if lab results are delayed beyond speedy trial limits",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the chain of custody of the substance",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress drugs seized from unlawful search or seizure"
        },
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss if lab results are delayed, speedy trial violated, or chain of custody broken"
        }
      ],
      clientGuidance: "If you file a suppression motion, prepare your client for the possibility that the hearing could go either way. If suppression is granted, the case often dismisses. If denied, you will need to re-evaluate whether to proceed to trial or negotiate.",
      pitfalls: [
        "Not challenging the search just because the client was holding the drugs — illegal searches are illegal regardless",
        "Filing a generic motion to suppress without specific facts about what went wrong with the search",
        "Not tracking speedy trial deadlines — lab delays can be a powerful dismissal tool"
      ]
    },
    {
      id: "resolution",
      name: "Case Resolution",
      timeline: "Months 3–12",
      description: "Resolve the case by plea, dismissal, or trial while protecting the client's future.",
      keyActions: [
        {
          text: "Negotiate for dismissal after successful diversion, or reduction to a non-drug offense",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Analyze immigration safety of any proposed plea — must be confirmed safe before advising client",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client on expungement eligibility after case resolution",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If pleading, explore whether conviction can be for a lesser non-drug offense (disorderly conduct, trespass)",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Seek dismissal after diversion completion or on procedural grounds"
        }
      ],
      clientGuidance: "Explain expungement options after resolution. In many states, a dismissed drug charge — especially after diversion — is eligible for expungement, which can remove the arrest from background checks. This is critical for employment and housing.",
      pitfalls: [
        "Pleading guilty to simple possession for a non-citizen client without immigration counsel sign-off",
        "Not advising clients about expungement eligibility — many don't know this is an option",
        "Accepting a plea with a record without checking if the charge is eligible for sealing or expungement"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Marijuana Possession",
      variations: [
        {
          states: ["CA", "CO", "IL", "MI", "WA", "OR", "NV", "AZ", "NJ", "CT", "MA", "NY", "ME", "VT", "NM", "MT", "AK", "HI", "MN", "DE", "MD", "RI", "VA", "MO"],
          note: "Recreational marijuana is legal in these states. Personal possession under state limits is not criminal. Check local city/county regulations for additional restrictions."
        },
        {
          states: ["TX", "FL", "GA", "AL", "SC", "MS", "ID", "WY", "KS", "ND", "SD", "IN"],
          note: "Marijuana remains fully illegal. Possession of any amount can result in criminal charges. First offense may be a misdemeanor but felony charges are common for larger amounts."
        }
      ]
    },
    {
      topic: "Diversion Programs",
      variations: [
        {
          states: ["CA"],
          note: "Prop 36 (PC § 1000) allows pretrial diversion for first and second-time simple possession offenses. Successful completion leads to dismissal. AB 1950 further expanded deferred entry of judgment."
        },
        {
          states: ["NY"],
          note: "Drug Court programs available statewide. STEP program (Supervised Treatment and Enhanced Probation) available for qualifying defendants."
        },
        {
          states: ["TX"],
          note: "TAIP (Texas Alternative to Incarceration Program) available in many counties. Drug courts vary significantly by county — research local options."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-dismiss", "motion-for-discovery"],
  tags: ["drug possession", "controlled substance", "Fourth Amendment", "search and seizure", "diversion", "drug court"]
};
