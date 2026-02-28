import type { Playbook } from "../schema";

export const cancellationOfRemovalPlaybook: Playbook = {
  id: "cancellation-of-removal",
  category: "immigration",
  name: "Cancellation of Removal",
  tagline: "Ten years in the U.S. is the foundation — build the case around it",
  overview: "Cancellation of Removal is one of the most powerful — and most litigated — forms of relief from removal. Two tracks exist: (1) LPR Cancellation (INA § 240A(a)) for lawful permanent residents who have been in LPR status for at least 5 years and in the U.S. for 7 years, and (2) Non-LPR Cancellation (INA § 240A(b)) for qualifying undocumented individuals who have been continuously present for 10 years, have good moral character, and have U.S. citizen or LPR immediate family members who would suffer 'exceptional and extremely unusual hardship.' Both tracks require careful evidence development over months. The hardship standard for non-LPR cancellation is exceptionally demanding — do not underestimate the work required.",
  typicalTimeline: "6 months to 3 years",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Non-LPR hardship standard is 'exceptional and extremely unusual' — not just 'hardship.' Courts require more than typical family separation. Document medical conditions, educational needs, country conditions for qualifying relatives.",
    "The annual 4,000-visa cap for non-LPR cancellation means grants result in a green card, but cap exhaustion can create multi-year delays even after a grant.",
    "Continuous presence is broken by a single departure of more than 90 days or multiple departures totaling more than 180 days. A single trip to the home country can destroy 10 years of accrual.",
    "The stop-time rule (Pereira): continuous presence stops accruing when a valid NTA is served. After Pereira/Niz-Chavez, an NTA without date/time may not trigger stop-time — research this carefully.",
    "LPR cancellation requires that the LPR has not been convicted of an aggravated felony. Run a full criminal history review before filing.",
    "Good moral character: crimes involving moral turpitude, false claims to citizenship, and prior periods of unlawful status all affect good moral character. Screen thoroughly."
  ],
  stages: [
    {
      id: "eligibility-assessment",
      name: "Eligibility Assessment",
      timeline: "Days 1–14",
      description: "Determine which track (LPR or non-LPR) applies and whether the client meets the threshold requirements.",
      keyActions: [
        {
          text: "Determine LPR vs. non-LPR track — obtain immigration documents (I-551, I-94, entry stamps, visas)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For non-LPR: establish continuous presence — review all travel history, work records, tax returns, school records going back 10 years",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For LPR: verify 5 years in LPR status and 7 years of continuous residence — review USCIS records",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Run full criminal history review — identify any bars: aggravated felonies (LPR track), CIMTs (non-LPR good moral character)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify qualifying relatives for hardship argument: U.S. citizen or LPR spouse, parent, or child",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess stop-time rule impact: when was the NTA served? Did it include date/time? (Pereira analysis)",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File to establish representation and receive all court notices"
        }
      ],
      clientGuidance: "The initial meeting must cover every trip outside the U.S. in the last 10 years — no matter how short. A single trip of 91+ days can break continuous presence and destroy eligibility. Ask specifically: 'Have you ever left the United States, even for one day?' Document every departure and return with dates.",
      pitfalls: [
        "Assuming 10-year eligibility without checking all departures — a gap in the record can be devastating",
        "Not checking the Pereira stop-time issue — if the NTA lacked date/time, the client may have more time than you think",
        "Failing to identify qualifying relatives early — without a qualifying relative, non-LPR cancellation is unavailable"
      ]
    },
    {
      id: "hardship-development",
      name: "Hardship Evidence Development",
      timeline: "Months 1–4",
      description: "Build the hardship case — the most demanding and often determinative part of non-LPR cancellation.",
      keyActions: [
        {
          text: "Obtain medical records for qualifying relatives — any serious condition requiring specialized treatment unavailable in home country",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain educational records for U.S.-citizen children — demonstrate impact of removal on their education and development",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Compile country conditions evidence for the home country: healthcare system quality, educational opportunities, violence, economic conditions",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Document client's financial support role for qualifying relatives",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain psychological evaluation of qualifying minor children assessing impact of parental removal",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Compile declarations from teachers, doctors, coaches, and community members about qualifying relatives' ties to the U.S.",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The hardship case is about the qualifying relatives, not the client being removed. Judges want to understand what happens to the U.S. citizen child or LPR spouse if the client is deported. Build the narrative around their specific, documented needs — medical, educational, psychological, financial.",
      pitfalls: [
        "Filing a hardship brief with generic language about 'family separation' — this fails. The standard requires individualized, documented, exceptional hardship",
        "Not obtaining medical records for children with health conditions — undocumented health needs are not credited",
        "Failing to address country conditions in the home country — courts consider whether the qualifying relative could accompany the client"
      ]
    },
    {
      id: "continuous-presence",
      name: "Continuous Presence Documentation",
      timeline: "Months 1–3",
      description: "Build a comprehensive year-by-year presence timeline with corroborating evidence.",
      keyActions: [
        {
          text: "Compile 10 years of employment records: W-2s, 1099s, pay stubs, employer letters",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather tax returns (ITIN or SSN), school enrollment records, medical records spanning the 10-year period",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain utility bills, lease agreements, and bank statements showing address history",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For any gaps: gather affidavits from employers, landlords, or community members who can attest to presence",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain passport showing all travel — verify no single departure exceeded 90 days",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request additional time to compile 10 years of documentary evidence"
        }
      ],
      pitfalls: [
        "Submitting a sparse evidence binder — IJs expect dense documentation across all 10 years",
        "Not addressing travel gaps — if the client was outside the U.S., explain it with passport stamps and entry records",
        "Filing before the evidence is complete — a weak filing is harder to supplement than a strong initial submission"
      ]
    },
    {
      id: "filing",
      name: "Application Filing",
      timeline: "By court deadline",
      description: "File the EOIR-42B (non-LPR) or EOIR-42A (LPR) with supporting evidence.",
      keyActions: [
        {
          text: "File EOIR-42B (non-LPR) or EOIR-42A (LPR) with the immigration court by the court-ordered deadline",
          priority: "critical",
          deadline: "Typically 30–60 days before individual hearing",
          type: "attorney"
        },
        {
          text: "Submit complete evidence binder: presence documentation, hardship evidence, country conditions, character letters",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File biometrics completion documentation with the court",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Serve DHS counsel with the complete filing",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request extension if additional evidence is still being compiled"
        }
      ],
      pitfalls: [
        "Late filing — some IJs will not consider late-filed applications",
        "Incomplete supporting evidence — a bare application without documentation fails",
        "Failing to serve DHS — DHS counsel will have prepared opposition; not serving them creates procedural complications"
      ]
    },
    {
      id: "merits-hearing",
      name: "Merits Hearing",
      timeline: "Months 6 to years later",
      description: "Present the cancellation case before the immigration judge.",
      keyActions: [
        {
          text: "Prepare client for direct examination: establish presence, good moral character, and hardship through their testimony",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare qualifying relatives to testify about the hardship they will face",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare legal brief connecting the evidence to the statutory and regulatory hardship standard",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Brief DHS cross-examination themes: gaps in presence documentation, criminal history, prior immigration violations",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Present country conditions evidence to demonstrate why relocation is not a viable alternative for the qualifying relative",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Prepare your qualifying relatives to testify about what their life would look like if the client is deported. A U.S.-citizen child testifying about losing their parent — their school, their language, their home — can be the most persuasive testimony in the hearing. Prepare them carefully and compassionately.",
      pitfalls: [
        "Not having qualifying relatives testify when they are available — their testimony is often more compelling than any document",
        "Failing to address DHS's anticipated arguments in closing — anticipate and respond to the weakest parts of your case",
        "Not requesting an oral decision if one is available — written decisions are more detailed and easier to appeal"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Annual Visa Cap",
      variations: [
        {
          states: ["ALL"],
          note: "Non-LPR cancellation is subject to an annual cap of 4,000 grants (INA § 240A(e)). When the cap is reached, the IJ may grant the application but the case is administratively closed pending visa availability. This can result in multi-year waits even after a grant."
        }
      ]
    },
    {
      topic: "Hardship Standard by Circuit",
      variations: [
        {
          states: ["CA", "OR", "WA", "AZ", "NV", "MT", "ID", "AK", "HI"],
          note: "9th Circuit: Matter of Recinas, Matter of Andazola — hardship must be substantially beyond what is ordinarily expected. Comparative hardship (worse than typical removal) is insufficient. Medical needs, educational disruption, and country conditions all relevant."
        },
        {
          states: ["NY", "CT", "VT"],
          note: "2nd Circuit: applies Matter of Recinas standard. Hardship assessed cumulatively across all relevant factors. Circuit does not set independent hardship standard — defers to BIA."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-for-continuance-eoir", "notice-of-appearance"],
  tags: ["cancellation of removal", "EOIR-42B", "continuous presence", "exceptional hardship", "LPR cancellation", "non-LPR cancellation", "10-year rule"]
};
