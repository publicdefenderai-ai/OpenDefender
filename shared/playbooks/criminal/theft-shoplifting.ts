import type { Playbook } from "../schema";

export const theftShopliftingPlaybook: Playbook = {
  id: "theft-shoplifting",
  category: "criminal",
  name: "Theft / Shoplifting",
  tagline: "High volume, fast resolution — maximize diversion and avoid records",
  overview: "Theft and shoplifting cases represent one of the highest-volume charge categories in urban public defender offices. While often treated as minor by the system, a theft conviction carries lasting consequences: it is a crime of dishonesty that destroys employment prospects, can result in civil demand letters, and for non-citizens may constitute a crime involving moral turpitude. The defense strategy focuses on (1) diversion and civil recovery alternatives, (2) challenging the evidence of intent, and (3) securing an immigration-safe disposition.",
  typicalTimeline: "1–6 months",
  difficultyLevel: "basic",
  keyConsiderations: [
    "A theft conviction is a crime of dishonesty — it can permanently bar employment in financial services, healthcare, and government. Treat it seriously regardless of the dollar amount.",
    "Retail Civil Recovery: many retailers send civil demand letters in addition to criminal charges — these are separate and the client should not pay without consulting you (payment may be an admission).",
    "Immigration: theft offenses are frequently 'crimes involving moral turpitude' (CIMTs) under immigration law, triggering deportability and inadmissibility. Screen every non-citizen client.",
    "Value thresholds matter: the difference between a misdemeanor and a felony is often just the dollar value of the merchandise. Challenge the valuation.",
    "Loss prevention officers' testimony is often the entire prosecution case — cross-examine their training, methodology, and any gaps in surveillance coverage."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Case Review",
      timeline: "Days 1–10",
      description: "Assess the evidence, identify legal and factual defenses, and evaluate diversion options.",
      keyActions: [
        {
          text: "Review the charging document: what is the alleged value of merchandise? This determines felony vs. misdemeanor",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen client's immigration status — theft is a CIMT with potential immigration consequences",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct client interview: what happened, what was client doing in the store, any disability or mental health issues",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Check for civil demand letter — advise client NOT to pay without consulting you",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess diversion eligibility: first offense? Amount under threshold? Program available in jurisdiction?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify any mental health or addiction issues that may support a mental health diversion argument",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request surveillance footage, loss prevention officer reports, receipts, and valuation methodology"
        }
      ],
      clientGuidance: "Ask your client directly: did they intend to take the items without paying? Mistakes happen — wrong shopping bag, forgotten items at the bottom of the cart, self-checkout errors. A lack of intent to steal is a complete defense. Get the full story before assuming guilt.",
      pitfalls: [
        "Treating a shoplifting case as trivial — a CIMT determination can end a non-citizen client's path to a green card",
        "Not challenging merchandise valuation — retailers often inflate values; use retail (not replacement) price",
        "Advising client to pay the civil demand letter — it can be construed as an admission and may not resolve the criminal case"
      ]
    },
    {
      id: "diversion-check",
      name: "Diversion & Civil Alternatives",
      timeline: "Weeks 1–4",
      description: "Pursue all available pre-prosecution and early diversion options.",
      keyActions: [
        {
          text: "Apply for pretrial diversion, deferred prosecution, or community service program",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Explore mental health diversion if client has a documented mental health condition",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate with prosecutor for deferred entry of judgment (DEJ) — charges dismissed after probation period",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Confirm that any diversion admission is immigration-safe before advising client to enter program",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client on shoplifting rehabilitation classes if accepted as a diversion condition",
          priority: "standard",
          type: "client"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Many diversion programs require the client to attend a shoplifting awareness class, perform community service, and/or pay a fine. Explain to your client that completing these requirements leads to a dismissal — no criminal record. The investment is absolutely worth it.",
      pitfalls: [
        "Diversion programs that require an admission of facts — these can trigger immigration consequences even without a 'conviction'",
        "Missing the program deadline — many diversion programs have strict enrollment windows",
        "Not verifying that the specific diversion program your client completes will result in a dismissal (not just a reduction)"
      ]
    },
    {
      id: "pretrial",
      name: "Pre-Trial Motions",
      timeline: "Months 1–4",
      description: "Challenge the evidence of the alleged theft if diversion is unavailable.",
      keyActions: [
        {
          text: "Request and review all surveillance footage — look for gaps, angle limitations, and alternative explanations",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Cross-examine loss prevention officer training and observation methodology",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge merchandise valuation — retail value (not replacement cost) is the proper measure in most states",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to suppress any statement made without Miranda warning during detention by loss prevention",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research whether client's actions could constitute a lesser, non-CIMT offense (vandalism, trespass)",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress statements made to loss prevention without Miranda warning or under coercion"
        },
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss for insufficient evidence of intent, improper valuation, or speedy trial violation"
        }
      ],
      clientGuidance: "If your client made statements to loss prevention officers in a back room while being detained, those statements may be suppressible. Loss prevention officers are not police, but courts are split on Miranda obligations when officers are acting in concert with police.",
      pitfalls: [
        "Accepting the prosecution's merchandise valuation without challenge — retailers commonly use replacement or MSRP values that inflate the charge",
        "Not requesting the full surveillance footage — retailers sometimes provide only the clip showing the alleged theft, omitting exculpatory context",
        "Overlooking self-checkout errors and forgotten items in the cart as complete defenses"
      ]
    },
    {
      id: "resolution",
      name: "Case Resolution",
      timeline: "Months 2–6",
      description: "Secure the best possible disposition, especially for non-citizen clients.",
      keyActions: [
        {
          text: "Negotiate for a non-CIMT offense if theft conviction is unavoidable (vandalism, trespass, disturbing the peace)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Confirm immigration safety of any proposed plea with immigration counsel for non-citizen clients",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Explore expungement or record sealing after case resolution",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client on background check implications and timeline for record sealing",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Seek dismissal after diversion completion or on insufficient evidence grounds"
        }
      ],
      clientGuidance: "If diversion is not available and a plea is necessary, focus the negotiation on avoiding a 'theft' designation. A plea to vandalism, disorderly conduct, or disturbing the peace — even for the same conduct — is dramatically better for employment and immigration purposes.",
      pitfalls: [
        "Pleading to theft as a CIMT for a non-citizen client without immigration analysis",
        "Not advising client about expungement after the case closes — theft convictions are often expungeable after the probationary period",
        "Missing the retail civil demand letter issue — clients sometimes pay thinking it resolves the criminal case, but it does not"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Felony Thresholds",
      variations: [
        {
          states: ["CA"],
          note: "Prop 47 (2014) reduced theft of property under $950 to a misdemeanor. Repeat offenders with specific prior felonies may still face felony charges under Prop 36 (2024) amendments."
        },
        {
          states: ["TX"],
          note: "Texas: Class C misdemeanor under $100; Class B $100–$749; Class A $750–$2,499; State jail felony $2,500–$29,999; 3rd degree felony $30,000–$149,999."
        },
        {
          states: ["NY"],
          note: "New York: Petit Larceny (misdemeanor) under $1,000; Grand Larceny 4th degree (felony) $1,000–$2,999. Low-level shoplifting is often charged as a violation, not a crime."
        },
        {
          states: ["IL"],
          note: "Illinois: Retail Theft under $1,000 is a Class A misdemeanor; $1,000–$10,000 is a Class 3 felony. Subsequent offenses escalate regardless of value."
        }
      ]
    },
    {
      topic: "Civil Recovery / Demand Letters",
      variations: [
        {
          states: ["ALL"],
          note: "Nearly all states allow retailers to send civil demand letters (typically $50–$500) independent of criminal prosecution. Advise clients not to pay without legal guidance — payment does not resolve the criminal case and may be used as an admission."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-dismiss", "motion-for-discovery"],
  tags: ["theft", "shoplifting", "retail theft", "larceny", "CIMT", "diversion", "loss prevention"]
};
