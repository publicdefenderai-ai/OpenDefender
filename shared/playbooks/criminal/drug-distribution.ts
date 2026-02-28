import type { Playbook } from "../schema";

export const drugDistributionPlaybook: Playbook = {
  id: "drug-distribution",
  category: "criminal",
  name: "Drug Distribution / PWID",
  tagline: "Challenge intent, challenge the CI, challenge every search",
  overview: "Possession with intent to distribute (PWID) and drug distribution cases are significantly more serious than simple possession and require a multi-front defense. The prosecution typically relies on: (1) quantity and packaging suggesting distribution, (2) confidential informant buys, and (3) surveillance evidence. Each is contestable. Federal charges for the same conduct are always a risk — assess early. Mandatory minimums, career offender enhancements, and quantity triggers can lead to decades in prison if not challenged aggressively.",
  typicalTimeline: "6–24 months",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Federal prosecution: DAs and U.S. Attorneys share information. If the quantity is large, assess the risk of federal indictment early — federal mandatory minimums are harsh and federal sentencing is more severe.",
    "Confidential informants (CIs) are the backbone of many distribution cases and are among the most challengeable evidence. Learn everything about the CI: prior criminal history, payments received, promises made, prior use as an informant.",
    "Mandatory minimums: know your jurisdiction's mandatory minimum triggers before any plea negotiation. A plea to the wrong charge can lock in years of mandatory prison time.",
    "Co-defendant issues: many distribution cases involve multiple defendants. Be alert to plea pressure, cooperation agreements, and conflicts of interest if representing co-defendants.",
    "Immigration: drug distribution convictions are aggravated felonies under immigration law — a single conviction results in permanent inadmissibility and mandatory detention. This is more severe than simple possession.",
    "Quantity matters legally and factually: challenge the weight measurement, the lab methodology, and whether the quantity actually supports 'distribution' intent vs. personal use."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review & Federal Risk Assessment",
      timeline: "Days 1–14",
      description: "Understand the full scope of the case, assess federal exposure, and identify defense angles.",
      keyActions: [
        {
          text: "Assess federal prosecution risk: quantity, drug type, prior convictions, any federal nexus",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen client's immigration status — drug distribution is an aggravated felony, triggering mandatory deportation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct full client interview: where was client, what was found, how was it packaged, whose property",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request all discovery immediately: search warrant, affidavit, CI records, surveillance notes, lab reports",
          priority: "critical",
          deadline: "Send discovery demand within 48 hours",
          type: "attorney"
        },
        {
          text: "Calculate applicable mandatory minimums under state and federal law",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify all co-defendants and assess conflict of interest",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Demand search warrant affidavit, CI records, surveillance reports, lab analysis, and all recorded communications"
        }
      ],
      clientGuidance: "Advise your client immediately: do not speak to police, cooperate with investigators, or contact co-defendants. In distribution cases, law enforcement often approaches defendants post-arrest seeking cooperation. Any statement or agreement without counsel is harmful.",
      pitfalls: [
        "Failing to assess federal prosecution risk early — clients are sometimes indicted federally after accepting a weak state plea offer",
        "Not preserving the right to challenge the search warrant — this must be done by motion before trial",
        "Client making statements to investigators post-arrest seeking a deal — these always hurt and rarely help"
      ]
    },
    {
      id: "fourth-amendment",
      name: "Fourth Amendment & Warrant Analysis",
      timeline: "Weeks 2–8",
      description: "Challenge the legality of the search and any statements made during or after the arrest.",
      keyActions: [
        {
          text: "Obtain and scrutinize the search warrant affidavit — is probable cause actually stated? Is any CI information corroborated?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess Franks hearing eligibility: did the affiant knowingly or recklessly include false information?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the particularity of the warrant — does it describe places and items to be seized with sufficient specificity?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge execution of the warrant: nighttime search, knock-and-announce violations, scope of search",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge any warrantless searches: was consent obtained? Was it coerced? Was there an actual emergency?",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Challenge search warrant defects, warrantless searches, or coerced consent"
        }
      ],
      clientGuidance: "Explain to your client that a suppression motion is the most powerful tool in a drug distribution case. If the drugs are suppressed because of an illegal search, the prosecution often cannot proceed. Even if the motion is denied, the hearing creates a record that can be used on appeal.",
      pitfalls: [
        "Accepting the search warrant at face value — affidavits regularly contain errors, omissions, and stale information",
        "Not filing a Franks motion when the affidavit relies on uncorroborated CI information",
        "Missing the suppression hearing deadline — local rules often require motions to suppress to be filed before a specific cutoff date"
      ]
    },
    {
      id: "ci-challenge",
      name: "Confidential Informant Challenge",
      timeline: "Weeks 4–12",
      description: "Expose CI credibility issues and pursue Roviaro disclosure to identify the informant.",
      keyActions: [
        {
          text: "File motion for disclosure of CI identity under Roviaro v. United States (1957) if CI was a witness or participant",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Demand CI's criminal history, prior use as informant, payments received, and promises made",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research whether CI has a history of unreliable information in prior cases",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Subpoena records of CI payments from the law enforcement agency",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge corroboration: what independent evidence confirms the CI's account?",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "CI-based cases can unravel at trial when cross-examination reveals the informant's motives: they are typically testifying to get charges dropped, for cash, or to reduce a sentence. This is powerful impeachment material that must be developed through discovery.",
      pitfalls: [
        "Not filing the Roviaro motion — CI identity is not automatically disclosed; you must request it",
        "Failing to obtain the CI's complete criminal history and payment records — these are essential for credibility attacks",
        "Assuming that a recorded buy is conclusive — recordings can be incomplete, manipulated, or subject to chain of custody issues"
      ]
    },
    {
      id: "quantity-intent",
      name: "Quantity & Intent Challenge",
      timeline: "Weeks 4–16",
      description: "Challenge whether the evidence actually supports distribution intent rather than personal use.",
      keyActions: [
        {
          text: "Challenge the drug weight: was the measurement accurate? Was moisture, packaging, or cutting agent included?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the lab analysis: was the substance actually the charged controlled substance? Request independent lab testing",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Counter the 'distribution' interpretation: large quantities are consistent with addiction and bulk purchasing for personal use",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge packaging evidence: small baggies, scales, and cash are also consistent with personal use in many contexts",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Consider a defense expert on addiction and drug use patterns",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Accepting the prosecution's weight measurement without challenging methodology — impurities, moisture, and packaging can artificially inflate weight",
        "Not requesting independent lab testing — field test errors occur and lab errors are not uncommon",
        "Conceding intent to distribute when the quantity is borderline — fight for the lesser included simple possession charge"
      ]
    },
    {
      id: "plea-trial",
      name: "Plea Negotiation or Trial",
      timeline: "Months 4–18",
      description: "Make the strategic decision to resolve by plea or proceed to trial.",
      keyActions: [
        {
          text: "Calculate the sentencing differential between a plea and a trial conviction — what are the mandatory minimums at each charge level?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Evaluate cooperation: is cooperation with the government a viable option? What would the client receive in exchange?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For non-citizen clients: confirm that any proposed plea does not constitute an aggravated felony",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If going to trial: retain a drug expert to challenge weight and intent, and prepare CI cross-examination",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The decision to cooperate is the most difficult in criminal defense. Your client must understand: cooperation involves risk (physical danger, broken promises, still going to prison), but mandatory minimums can otherwise mean decades. This conversation requires time, candor, and a complete understanding of the sentencing landscape.",
      pitfalls: [
        "Advising cooperation without understanding what the government will actually offer — cooperation agreements must be negotiated, not assumed",
        "Accepting a plea to a drug distribution charge for a non-citizen client without checking aggravated felony status",
        "Not preparing a drug expert for trial — weight and intent are typically the central contested issues"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Federal Mandatory Minimums",
      variations: [
        {
          states: ["ALL"],
          note: "Federal 21 U.S.C. § 841: 5-year mandatory minimum for 5g+ methamphetamine (pure), 28g+ crack cocaine, 100g+ heroin, 500g+ powder cocaine. 10-year minimum at 50g+/280g+/1kg+/5kg+. First Step Act (2018) expanded safety valve eligibility — assess carefully."
        }
      ]
    },
    {
      topic: "State Mandatory Minimums",
      variations: [
        {
          states: ["NY"],
          note: "New York's Rockefeller Drug Laws were significantly reformed. Most drug distribution offenses no longer carry mandatory minimums except for large-scale trafficking. Judicial discretion is broader."
        },
        {
          states: ["TX"],
          note: "Texas: distribution of 4g–200g of most controlled substances is a 2nd degree felony (2–20 years). Weight-based enhancements reach life sentences for large quantities."
        },
        {
          states: ["FL"],
          note: "Florida: drug trafficking mandatory minimums begin at relatively low quantities (7g heroin, 14g oxycodone, 28g cocaine). Three-year mandatory minimum at trafficking threshold."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-for-discovery", "motion-to-dismiss"],
  tags: ["drug distribution", "PWID", "possession with intent", "controlled substance", "confidential informant", "mandatory minimum", "trafficking"]
};
