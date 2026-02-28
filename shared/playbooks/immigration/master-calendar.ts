import type { Playbook } from "../schema";

export const masterCalendarPlaybook: Playbook = {
  id: "master-calendar",
  category: "immigration",
  name: "Master Calendar Hearing Prep",
  tagline: "Set the procedural foundation for the entire case",
  overview: "The Master Calendar Hearing (MCH) is the immigration court equivalent of an arraignment and scheduling conference. It is where the respondent enters pleadings to the NTA, the court identifies the issues and forms of relief, and future hearing dates are set. While it may seem routine, errors at the MCH — including poorly pleaded responses to the NTA — can have permanent consequences for the case.",
  typicalTimeline: "2–8 weeks of preparation; MCH itself is typically 5–15 minutes",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "The NTA (Notice to Appear) is the charging document — review it meticulously. Factual admissions at the MCH are binding throughout the case.",
    "After Pereira v. Sessions (2018) and Niz-Chavez v. Garland (2021): NTAs missing date/time do NOT vest stop-time for cancellation of removal. Challenge defective NTAs.",
    "The respondent's entries into the U.S. are 'admitted' or 'denied' at the MCH — these admissions lock in removability unless you deny.",
    "If claiming asylum, the one-year filing deadline must be addressed: was the application filed within one year of entry? If not, extraordinary circumstances must be shown.",
    "Continuances are easier to get at the first MCH than later — use this opportunity to request adequate time to prepare."
  ],
  stages: [
    {
      id: "nta-review",
      name: "NTA Review & Analysis",
      timeline: "Upon receipt of NTA (or as soon as appointed)",
      description: "Carefully analyze the NTA for factual accuracy, legal sufficiency, and defects that can be raised.",
      keyActions: [
        {
          text: "Review every factual allegation in the NTA — identify which are accurate, inaccurate, or ambiguous",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Check for NTA defects: missing date/time/place of hearing (Pereira issue), improper service",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify charges of removability (INA §§ 212, 237) and assess their legal basis",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess all possible forms of relief: cancellation, asylum, adjustment, TPS, U/T visa, VAWA, SIJ",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain client's immigration history: I-94, prior visa, entry documents, any prior removal or deportation",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "nta-pleadings",
          name: "NTA Pleadings",
          relevance: "Prepare formal pleadings responding to each factual allegation and charge of removability in the NTA"
        }
      ],
      clientGuidance: "Walk the client through the NTA with them present. Explain each allegation in plain language. Ask them to confirm which facts are true, which are wrong, and which are incomplete. This is not just legal analysis — it builds the client's trust and ensures accuracy.",
      pitfalls: [
        "Admitting all NTA allegations without careful review — even minor errors can be significant",
        "Missing a Pereira defect — if the NTA lacks date/time, you may have a powerful motion to terminate",
        "Failing to identify all forms of relief before the MCH — the court will ask and the record must reflect all relief sought"
      ]
    },
    {
      id: "filing-appearance",
      name: "Filing Notice of Appearance",
      timeline: "Before first MCH",
      description: "Ensure counsel is properly entered and the court has your contact information.",
      keyActions: [
        {
          text: "File EOIR-28 Notice of Appearance with the immigration court before the first MCH",
          priority: "critical",
          deadline: "At least 5 days before MCH",
          type: "attorney"
        },
        {
          text: "Verify that the court has your correct contact information and that notices will reach you",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File EOIR-27 if appearing for bond hearing only (limited representation)",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File to formally enter appearance and ensure all court notices are sent to you"
        }
      ],
      pitfalls: [
        "Filing the EOIR-28 too late — the first MCH may proceed without you",
        "Not confirming the court's mailing address — notices sent to wrong address lead to missed deadlines"
      ]
    },
    {
      id: "mch-preparation",
      name: "MCH Preparation",
      timeline: "Week before MCH",
      description: "Prepare the client, the pleadings, and the relief strategy for the MCH.",
      keyActions: [
        {
          text: "Prepare written pleadings to each NTA allegation: admit, deny, or lack knowledge",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify all forms of relief to be claimed — prepare to state them on the record",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare the client for the MCH — what to wear, what to say, what the judge will ask",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare continuance request if insufficient time to investigate or prepare applications",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather initial documents: client's identity documents, entry documents, criminal history (if any)",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "nta-pleadings",
          name: "NTA Pleadings",
          relevance: "Formal written pleadings to submit at or before the MCH"
        },
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request additional time to prepare applications and gather evidence"
        }
      ],
      clientGuidance: "The MCH is short — usually 5–15 minutes. Your client should understand: (1) they must be on time (courts start promptly and may order removal in absentia for no-shows); (2) they should let you speak unless the judge asks them directly; (3) they should dress professionally and be respectful.",
      pitfalls: [
        "Client failing to appear — this triggers an in absentia removal order",
        "Making admissions to NTA allegations that are legally incorrect because the law is complex",
        "Not requesting a continuance when you need more time — first MCH continuances are usually granted"
      ]
    },
    {
      id: "mch-day",
      name: "Master Calendar Hearing",
      timeline: "Day of MCH",
      description: "Present pleadings, identify relief, and set the schedule for the full merits hearing.",
      keyActions: [
        {
          text: "Enter formal pleadings to each NTA allegation on the record",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify all forms of relief on the record — failure to identify relief can waive it",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request adequate time for the individual hearing — do not accept an unreasonably short hearing date",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If seeking asylum: confirm that the one-year deadline has been or will be met before the next hearing",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Reserve the right to file additional motions",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Confirm with your client before leaving the courthouse what the next court date is and what is expected of them before then (submitting documents, attending appointments, etc.). In absentia orders are devastating — your client must appear at every hearing.",
      pitfalls: [
        "Not contesting the charges of removability — admitting removability can narrow your defenses",
        "Accepting a merits hearing date that is too soon to prepare",
        "Not making a record on the one-year asylum deadline issue if it is close"
      ]
    },
    {
      id: "post-mch",
      name: "Post-MCH",
      timeline: "After MCH through individual hearing",
      description: "Prepare applications, gather evidence, and meet all pre-hearing deadlines.",
      keyActions: [
        {
          text: "File all relief applications by the court-set deadline (typically 30–60 days before individual hearing)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Submit country conditions evidence and expert declarations if claiming asylum or CAT",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File any additional motions: motion to terminate, motion to suppress, motion to change venue",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File biometrics completion notice and any required forms (I-589, EOIR-42B, etc.) on time",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request extension of filing deadlines if needed"
        }
      ],
      pitfalls: [
        "Missing the application filing deadline — late-filed applications can be rejected",
        "Not filing biometrics on time — this can delay the case and prejudice the client",
        "Submitting incomplete country conditions evidence — this is often the difference between grant and denial"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Defective NTA / Pereira Issues",
      variations: [
        {
          states: ["ALL"],
          note: "After Pereira v. Sessions (2018) and Niz-Chavez v. Garland (2021): if the NTA does not include the specific date and time of hearing, it does not trigger the 'stop-time' rule for cancellation of removal. This can be a powerful defense for long-term residents."
        }
      ]
    },
    {
      topic: "IJ Assignment",
      variations: [
        {
          states: ["CA", "NY", "TX", "FL"],
          note: "Immigration judge assignment and court backlog varies dramatically by court. Some courts have 5+ year backlogs; others move quickly. Research the assigned IJ's decision patterns and the local docket."
        }
      ]
    }
  ],
  relatedTemplateIds: ["nta-pleadings", "notice-of-appearance", "motion-for-continuance-eoir"],
  tags: ["master calendar", "MCH", "NTA", "immigration court", "EOIR", "pleadings", "cancellation of removal"]
};
