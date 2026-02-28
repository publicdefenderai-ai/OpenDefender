import type { Playbook } from "../schema";

export const fareEvasionPlaybook: Playbook = {
  id: "fare-evasion",
  category: "criminal",
  name: "Fare Evasion / Transit Violations",
  tagline: "A ticket should not become a conviction",
  overview: "Transit violations — including fare evasion, failure to show proof of payment, and related transit code violations — disproportionately burden low-income riders and people of color. What begins as a $50 administrative citation can snowball into a misdemeanor charge with criminal consequences. The defense strategy focuses on: (1) diversion and administrative resolution before criminal filing, (2) dismissal for insufficient evidence or improper citation, and (3) immigration-safe dispositions for non-citizen clients.",
  typicalTimeline: "1–6 months",
  difficultyLevel: "basic",
  keyConsiderations: [
    "Many transit agencies offer civil or administrative resolution pathways before criminal charges are filed — exhaust these first.",
    "Fare evasion convictions can have immigration consequences for non-citizen clients. Treat this as any other criminal charge.",
    "Charging decisions vary enormously by jurisdiction — some treat fare evasion as a civil infraction, others as a misdemeanor.",
    "Officer credibility is often the central issue — transit officers observe violations quickly, often from a distance.",
    "Many clients have pending bench warrants from missed court dates on prior transit citations — address these proactively."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review",
      timeline: "Days 1–14",
      description: "Evaluate the citation or charge and identify all available resolution pathways.",
      keyActions: [
        {
          text: "Determine whether the matter is a civil infraction, administrative violation, or criminal misdemeanor",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review the citation for technical defects: wrong statute cited, incorrect date/location, missing officer signature",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for immigration status — any potential criminal conviction requires immigration analysis",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify whether the transit agency offers a diversion, community service, or amnesty program",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Check for outstanding bench warrants from prior transit citations",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Determine if client can demonstrate proof of valid fare retroactively (transit card, account records)",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client to pull up their transit card (Clipper, Ventra, ORCA, MetroCard) transaction history — in most cases this data is retained for 90+ days and can show payment. A record of a valid fare can resolve the case immediately.",
      pitfalls: [
        "Treating a fare evasion case as trivial — it carries criminal record consequences for your client",
        "Missing the administrative appeal deadline for the transit agency (often 30 days from citation)",
        "Not checking for prior transit bench warrants that could result in arrest if client appears in court"
      ]
    },
    {
      id: "diversion-check",
      name: "Diversion & Administrative Resolution",
      timeline: "Weeks 1–4",
      description: "Resolve the matter through the transit agency or court diversion before it becomes a criminal conviction.",
      keyActions: [
        {
          text: "Contact the transit agency to explore administrative resolution or citation dismissal",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Apply for transit court diversion program if available in the jurisdiction",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate community service in lieu of fine for financially unable clients",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File documentation of valid fare if client has transit account records",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For clients who cannot pay fines: research fee waiver programs",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Many transit agencies have hardship programs or diversion options — especially for first-time violations. Your client may be able to resolve this by attending a class, completing community service, or providing proof of a reduced-fare eligibility card.",
      pitfalls: [
        "Not contacting the transit agency directly — many cases can be resolved informally",
        "Allowing client to handle diversion on their own — missed appointments result in criminal referrals",
        "Diversion programs that include an 'admission' — verify immigration safety before advising client to participate"
      ]
    },
    {
      id: "court-resolution",
      name: "Administrative or Court Resolution",
      timeline: "Months 1–6",
      description: "If administrative resolution fails, contest the citation in court or negotiate an immigration-safe disposition.",
      keyActions: [
        {
          text: "Request discovery: officer notes, transit system surveillance footage, fare gate records",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge the officer's observations if the alleged violation was not clearly captured",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to dismiss if citation contains technical defects",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate for civil infraction or non-criminal disposition for non-citizen clients",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If going to hearing: subpoena transit agency fare gate records to contradict the officer",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss for technical defects in the citation, insufficient evidence, or speedy trial grounds"
        }
      ],
      clientGuidance: "If your client is a non-citizen, explain that even a misdemeanor conviction for fare evasion can create immigration problems. The goal is a non-criminal outcome: a civil infraction, community service, or dismissal.",
      pitfalls: [
        "Accepting a misdemeanor conviction for a non-citizen client when a civil resolution was available",
        "Not subpoenaing fare gate electronic records — these can definitively show whether payment was made",
        "Assuming the case is too minor to fight — the record consequences are significant for clients with prior convictions"
      ],
      jurisdictionVariations: [
        {
          states: ["CA"],
          note: "In California, fare evasion is an infraction (max $250 fine) under Public Utilities Code § 99580. Many transit agencies (BART, Metro) have their own diversion programs. LA Metro offers community service option."
        },
        {
          states: ["NY"],
          note: "NYC: fare evasion is a violation (not a crime) under the Transit Authority rules — carries max $100 civil penalty. Criminal misdemeanor charges under Penal Law § 165.15 are possible for repeat offenders."
        },
        {
          states: ["IL"],
          note: "Chicago: CTA fare evasion is a civil administrative offense initially. Criminal misdemeanor under 720 ILCS 5/16-9 can be charged for persistent violations."
        }
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Criminal vs. Civil Classification",
      variations: [
        {
          states: ["CA"],
          note: "Fare evasion is a civil infraction in California — no criminal record. However, failure to appear can result in a misdemeanor failure-to-appear charge."
        },
        {
          states: ["NY"],
          note: "New York typically charges fare evasion as a civil violation, but repeat offenders may face criminal petit larceny or theft of services charges."
        },
        {
          states: ["TX", "FL", "GA"],
          note: "Several Southern states charge fare evasion as a criminal misdemeanor. Standard criminal defense approach applies."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-dismiss"],
  tags: ["fare evasion", "transit", "BART", "MTA", "public transit", "misdemeanor", "infraction"]
};
