import type { Playbook } from "../schema";

export const disorderlyConduct: Playbook = {
  id: "disorderly-conduct",
  category: "criminal",
  name: "Disorderly Conduct / Trespass",
  tagline: "Challenge vague statutes and fight quality-of-life criminalization",
  overview: "Disorderly conduct and trespass charges are among the most common quality-of-life offenses in urban public defender caseloads. They are frequently used to police poverty, homelessness, mental illness, and political protest. The defense strategy exploits three core weaknesses: (1) vague and overbroad statutes subject to First Amendment and void-for-vagueness challenges, (2) minimal and often subjective evidence (one officer's word), and (3) robust diversion and dismissal pathways for clients with underlying social service needs.",
  typicalTimeline: "1–4 months",
  difficultyLevel: "basic",
  keyConsiderations: [
    "These charges often arise from policing of homelessness, mental health crises, and protest activity — the 'crime' may be poverty or political speech, not conduct.",
    "First Amendment: if the charge arises from speech (even offensive speech), a First Amendment challenge is appropriate. Fighting words doctrine is narrow.",
    "Void-for-vagueness: disorderly conduct statutes are frequently so broad that they give police unlimited discretion. This is a constitutional challenge worth raising.",
    "Trespass requires notice: in most jurisdictions, a trespass conviction requires that the defendant knew or was told they were not permitted on the property. Challenge the notice.",
    "Collateral consequences: even 'minor' convictions harm background checks for employment, housing, and professional licensing. Treat these cases seriously.",
    "Social services: many clients charged with these offenses have unmet mental health, housing, or substance use needs. Social service referrals are often more valuable than a dismissal alone."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review & Screening",
      timeline: "Days 1–7",
      description: "Evaluate the charge, identify constitutional issues, and assess social service needs.",
      keyActions: [
        {
          text: "Review the specific statute — assess for vagueness, overbreadth, and First Amendment issues",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct client interview: what was the context? Was speech involved? Was client on public property?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen for underlying needs: housing instability, mental health, substance use — connect to services",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen client's immigration status — even minor convictions can trigger immigration consequences",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For trespass: was the client given adequate notice that they were excluded from the property?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess diversion eligibility: community service, social service engagement, mental health diversion",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Connect your client to appropriate social services — housing, mental health treatment, substance use programs — even before the case resolves. Judges respond positively to clients who are proactively addressing underlying needs, and it strengthens diversion applications.",
      pitfalls: [
        "Treating disorderly conduct as trivially minor — background check consequences can harm employment for years",
        "Missing First Amendment issues when the charge stems from speech or protest activity",
        "Not connecting the client with social services — many of these clients are not in the system by choice, and a referral can address the root cause"
      ]
    },
    {
      id: "first-amendment-analysis",
      name: "Constitutional Analysis",
      timeline: "Days 7–21",
      description: "Develop any constitutional challenges — vagueness, overbreadth, or First Amendment.",
      keyActions: [
        {
          text: "If charge stems from speech: research whether conduct constitutes protected speech or unprotected 'fighting words'",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research whether the specific statute has been found unconstitutionally vague or overbroad in your jurisdiction",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For protest/demonstration arrests: research local ordinances on time, place, and manner restrictions",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "For trespass on public property (park, library): research whether exclusion notice was constitutionally permissible",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss on First Amendment, vagueness, overbreadth, or insufficient evidence of notice (trespass)"
        }
      ],
      pitfalls: [
        "Assuming disorderly conduct can never be challenged constitutionally — many city ordinances fail First Amendment scrutiny",
        "Not researching whether local court has previously struck down the specific statute",
        "Overlooking 'fighting words' doctrine — truly threatening, face-to-face provocation is not protected, but most speech that offends is"
      ]
    },
    {
      id: "diversion",
      name: "Diversion & Social Service Resolution",
      timeline: "Weeks 2–6",
      description: "Resolve the case through diversion, dismissal, or social service engagement.",
      keyActions: [
        {
          text: "Apply for mental health diversion if client has a qualifying diagnosis (many disorderly conduct arrests involve mental health crises)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Negotiate community service in lieu of conviction",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Request adjournment in contemplation of dismissal (ACD) or similar deferred resolution",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For homeless clients: coordinate with social workers and housing programs — housing placement can support dismissal argument",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Present documentation of social service enrollment at the first opportunity",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "For clients experiencing homelessness: connect them with a social worker immediately. In many jurisdictions, proof of stable housing or active engagement with a social service program will lead a judge to dismiss or defer the case. The courtroom goal and the social goal align here.",
      pitfalls: [
        "Missing mental health diversion eligibility — this is the most powerful tool when the underlying conduct stems from a mental health crisis",
        "Not presenting social service enrollment documentation at the hearing — documentation is what converts a judge's sympathy into a dismissal",
        "Letting a client plead guilty to avoid appearing in court — even a small fine creates a record"
      ]
    },
    {
      id: "resolution",
      name: "Contested Hearing or Resolution",
      timeline: "Months 1–4",
      description: "If diversion is unavailable, contest the charge at a bench trial or negotiate a non-criminal resolution.",
      keyActions: [
        {
          text: "Challenge the officer's subjective characterization of conduct — disorderly conduct requires more than an officer's displeasure",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Argue that conduct was not 'disorderly' by any objective standard",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For trespass: challenge adequacy of notice — was client clearly and legally informed they were excluded?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate for a non-criminal infraction or civil penalty as an alternative to a criminal conviction",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss for failure to state a charge, constitutional defect, or insufficient evidence"
        }
      ],
      clientGuidance: "Bench trials in disorderly conduct cases are often winnable because the standard of proof is beyond a reasonable doubt and the prosecution's evidence is frequently a single officer's testimony about subjective behavior. Fight these cases.",
      pitfalls: [
        "Entering a plea to a criminal conviction when a bench trial was winnable",
        "Not contesting trespass cases where the notice element is weak or missing",
        "Accepting a plea to avoid appearing in court — clients sometimes prefer to pay a fine rather than take time off work, but the record consequences persist"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Disorderly Conduct Statutes",
      variations: [
        {
          states: ["NY"],
          note: "New York Penal Law § 240.20 — disorderly conduct is a violation (not a misdemeanor). ACD (Adjournment in Contemplation of Dismissal) is the standard resolution for most first-time offenders. Record seals automatically after 1 year."
        },
        {
          states: ["CA"],
          note: "California PC § 647 — public intoxication, loitering, and related quality-of-life offenses. Mental health diversion under PC § 1001.36 broadly applicable. CARE Court (2023) provides an additional pathway for seriously mentally ill individuals."
        },
        {
          states: ["TX"],
          note: "Texas PC § 42.01 — disorderly conduct covers fighting, obscene language, and unreasonable noise. Class C misdemeanor (fine only) in most cases. No jail exposure unless repeated."
        }
      ]
    },
    {
      topic: "Camping / Public Space / Homelessness",
      variations: [
        {
          states: ["CA", "OR", "WA", "CO", "AZ"],
          note: "Following Grants Pass v. Johnson (2024), cities may enforce anti-camping ordinances regardless of available shelter. But enforcement must still comply with the 8th Amendment and local ordinances. Challenge notice and mental health diversion eligibility."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-dismiss"],
  tags: ["disorderly conduct", "trespass", "quality of life", "First Amendment", "mental health diversion", "homelessness", "protest"]
};
