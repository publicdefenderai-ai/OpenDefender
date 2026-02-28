import type { Playbook } from "../schema";

export const expeditedRemovalPlaybook: Playbook = {
  id: "expedited-removal",
  category: "immigration",
  name: "Expedited Removal Defense",
  tagline: "Stop removal before it happens — credible fear is the lifeline",
  overview: "Expedited removal is summary deportation without a hearing before an immigration judge. It applies to individuals encountered at or near the border who cannot establish a right to enter, and — following Trump-era and Biden-era expansions — to individuals encountered within 100 miles of any U.S. border who have been in the country fewer than 2 years. A person subject to expedited removal can be deported within hours unless they express a fear of return, triggering a credible fear interview (CFI). The credible fear screening is the critical intervention point — it is the only way to access an immigration judge hearing.",
  typicalTimeline: "Days to weeks (extremely fast)",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Expedited removal moves at extraordinary speed — a person can be deported before counsel even learns of their detention. Any system for early identification of detained clients is essential.",
    "Credible fear interview (CFI): if the person expresses fear of return during expedited removal, they must be referred to an asylum officer for a CFI. This is the critical lifeline — teach clients to express their fear clearly.",
    "Reasonable fear interview (RFI): those with prior removal orders are subject to reinstatement and receive a 'reasonable fear' interview (higher standard than CFI) rather than a CFI.",
    "The 100-mile rule expansion: DHS has expanded expedited removal to apply to anyone encountered within 100 miles of any U.S. border who cannot prove 2 years of continuous presence. This covers most of the U.S. population corridor.",
    "Access to counsel in expedited removal is severely limited by law — there is no right to appointed counsel in a CFI. However, pro se preparation guidance is critical.",
    "Positive CFI finding: if the asylum officer finds a credible fear, the person is referred to immigration court for a full merits hearing. This converts expedited removal to a regular removal proceeding with full due process."
  ],
  stages: [
    {
      id: "identification",
      name: "Client Identification (Emergency)",
      timeline: "Within hours of detention",
      description: "Locate the client and intervene before deportation occurs.",
      keyActions: [
        {
          text: "Use ICE.gov detainee locator and local ERO contact to locate the client immediately",
          priority: "critical",
          deadline: "Within hours — expedited removal happens fast",
          type: "attorney"
        },
        {
          text: "Contact the detention facility and assert attorney-client privilege — demand access to speak with the client",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File EOIR-28 if any immigration court proceedings have been opened",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Determine whether the client has expressed a fear of return — if not, they may have been deported already",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Contact the Asylum Division / USCIS if a credible fear interview has been or will be scheduled",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File immediately if referred to immigration court after a positive credible fear finding"
        }
      ],
      clientGuidance: "Your most important task before contact is cut off: get word to the client through family that they must say clearly: 'I am afraid to return to [country]. I will be harmed if I am sent back.' These words trigger the credible fear process. Without them, expedited removal proceeds immediately.",
      pitfalls: [
        "Delay — even one day of delay can result in deportation before you reach the client",
        "Not conveying to family members what the client must say to trigger credible fear screening",
        "Assuming an EOIR-28 will prevent deportation — it does not stop expedited removal unless the client is already in formal immigration court proceedings"
      ]
    },
    {
      id: "cfi-preparation",
      name: "Credible Fear Interview Preparation",
      timeline: "Hours to days before the CFI",
      description: "Prepare the client for the credible fear interview — their one shot at access to an immigration judge.",
      keyActions: [
        {
          text: "Obtain access to the client before the CFI — visit the detention facility or arrange a legal call",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Explain the CFI standard: 'significant possibility' of persecution or torture — a low bar designed to be inclusive",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct an abbreviated fear interview: what will happen if returned? Who will harm them? Why? Has it happened before?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client to be specific and detailed — vague fear claims fail; specific incidents, names, and dates succeed",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client to ask for an interpreter in their native language and to speak slowly and clearly",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client of their right to have counsel present (if accessible) or available by telephone during the CFI",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Teach your client the three questions the asylum officer will ask: (1) Why did you leave your country? (2) What are you afraid of if you return? (3) Who will hurt you and why? For each answer, the client should give specific details: dates, names, locations, what was said, what was done. Generic answers fail.",
      pitfalls: [
        "Client giving vague or generic answers about general country violence — the CFI requires specific, individualized fear",
        "Interpreter issues — a client who cannot communicate effectively in their language should request a different interpreter",
        "Not advising the client that they can have an attorney present by phone — many clients don't know this right exists"
      ]
    },
    {
      id: "cfi-review",
      name: "CFI Review (If Negative Finding)",
      timeline: "Within 7 days of negative CFI",
      description: "Challenge a negative credible fear finding before an immigration judge.",
      keyActions: [
        {
          text: "If CFI is negative: immediately request immigration judge review — client has the right to a hearing before an IJ",
          priority: "critical",
          deadline: "IJ review is scheduled quickly — often within days",
          type: "attorney"
        },
        {
          text: "Obtain the asylum officer's interview notes and the negative finding document",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare for IJ review: the IJ applies the same 'significant possibility' standard but may be more receptive to legal argument",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File EOIR-28 immediately if not already filed",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge any errors in translation or mischaracterization of the client's answers in the CFI",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File to appear before the IJ at the CFI review hearing"
        },
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request additional time to prepare if the IJ review is scheduled immediately"
        }
      ],
      pitfalls: [
        "Not requesting IJ review after a negative CFI — the review is automatic only if the client requests it; failure to request waives the right",
        "Not challenging interpreter errors in the CFI — interview quality varies and errors can result in an inaccurate negative finding",
        "Missing the extremely short window for IJ review — these proceedings move at an extraordinary pace"
      ]
    },
    {
      id: "post-positive-cfi",
      name: "Post-Positive Finding — Full Proceedings",
      timeline: "After positive CFI",
      description: "A positive CFI converts the case to full removal proceedings — begin building the asylum case.",
      keyActions: [
        {
          text: "Confirm placement in removal proceedings — file EOIR-28 with the immigration court",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File bond motion immediately — post-positive CFI clients are often detained and bond hearing is the first step",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Begin building the full asylum/withholding/CAT case — the positive CFI finding does not guarantee asylum at the merits hearing",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Document the credible fear interview answers — inconsistencies with the merits hearing testimony will be exploited by DHS",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "bond-motion-eoir",
          name: "Bond Motion (EOIR)",
          relevance: "Seek release from detention after a positive credible fear finding"
        }
      ],
      clientGuidance: "A positive CFI is a critical win — it means you get to present your case to a judge. But explain clearly: the positive finding is not asylum. You will still have a full hearing where you must prove your case. The work is just beginning.",
      pitfalls: [
        "Treating a positive CFI as the end of the case — it is the beginning of the asylum process, not the result",
        "Not documenting the CFI transcript for consistency with the merits hearing — DHS will use any inconsistency to attack credibility",
        "Not immediately filing a bond motion — post-positive CFI clients are often detained and can remain detained for months without advocacy"
      ]
    },
    {
      id: "reinstatement",
      name: "Reinstatement of Prior Removal Orders",
      timeline: "If prior order exists",
      description: "Challenge reinstatement and pursue reasonable fear review for clients with prior removal orders.",
      keyActions: [
        {
          text: "Determine if the prior removal order is valid — was it issued in absentia without proper notice? Was it obtained by fraud?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Challenge reinstatement if the prior order was obtained without due process or is otherwise invalid",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If the prior order is valid: ensure client expresses fear to trigger reasonable fear interview (RFI) — the RFI applies a higher standard than CFI",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If RFI is negative: challenge through immigration court — same IJ review process as CFI",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reopen-eoir",
          name: "Motion to Reopen (EOIR)",
          relevance: "Challenge a prior in absentia removal order as a basis for reinstatement"
        }
      ],
      pitfalls: [
        "Not challenging the prior order even if it seems old — in absentia orders can be challenged for lack of notice",
        "Confusing CFI and RFI standards — the reasonable fear standard for reinstatement cases is higher than the credible fear standard",
        "Failing to coordinate a motion to reopen with the reinstatement challenge — both must be pursued simultaneously"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "100-Mile Expanded Expedited Removal",
      variations: [
        {
          states: ["ALL"],
          note: "Expedited removal applies to individuals encountered within 100 miles of any U.S. border (land, sea, or air) who cannot affirmatively prove they have been continuously present for more than 2 years. This covers major population centers including New York City, Los Angeles, Miami, and Chicago. The client bears the burden of proving 2 years of continuous presence."
        }
      ]
    },
    {
      topic: "Positive CFI Rate by USCIS Office",
      variations: [
        {
          states: ["TX", "AZ"],
          note: "Southern border asylum offices have historically had lower positive CFI rates than northern offices. If the client is held near the border, prepare the CFI more thoroughly. Negative findings at border offices can be appealed to IJs at the local immigration court."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance", "bond-motion-eoir", "motion-for-continuance-eoir", "motion-to-reopen-eoir"],
  tags: ["expedited removal", "credible fear", "CFI", "RFI", "asylum officer", "border", "reinstatement", "detention", "100-mile rule"]
};
