import type { Playbook } from "../schema";

export const dacaTpsLapsePlaybook: Playbook = {
  id: "daca-tps-lapse",
  category: "immigration",
  name: "DACA / TPS Lapse Response",
  tagline: "Protect status now and build toward permanent protection",
  overview: "DACA (Deferred Action for Childhood Arrivals) and TPS (Temporary Protected Status) are administrative programs — not statutory rights — making them vulnerable to policy changes and litigation. When either program lapses or is terminated, recipients face immediate loss of work authorization and return to removable status. This playbook covers the legal response when a client's DACA or TPS has lapsed, is expiring, or has been terminated by policy change. The goals are: (1) maximize the renewal window, (2) identify alternative or permanent relief, and (3) protect the client from enforcement actions during the transition period.",
  typicalTimeline: "1–6 months (administrative); years (for permanent relief pathway)",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "DACA status does not expire all at once — each recipient's work permit (EAD) expires on its own cycle. Check the expiration date on the client's I-766 card and file renewals 150–180 days before expiration.",
    "Following DACA program litigation (ongoing as of 2024–2026), courts have issued varying orders affecting new and renewal applications. Check the current program status before advising on renewals.",
    "TPS designations are country-specific and time-limited. When designation ends, TPS recipients lose their status but may have valid I-94s during the administrative closure period. Check current DHS Federal Register notices.",
    "Many DACA/TPS holders have resided in the U.S. for 10+ years and may now qualify for cancellation of removal if placed in proceedings.",
    "Work authorization: loss of DACA or TPS means loss of Employment Authorization Document (EAD). Advise clients on employer obligations and the grace period for continued employment.",
    "Criminal record bars: a DACA renewal requires no new criminal convictions. A single disqualifying offense can end DACA status permanently. Conduct Padilla analysis before any criminal plea."
  ],
  stages: [
    {
      id: "status-assessment",
      name: "Status Assessment",
      timeline: "Immediately upon client contact",
      description: "Determine the current status of the client's DACA or TPS and identify urgent deadlines.",
      keyActions: [
        {
          text: "Obtain client's I-766 (EAD card) — note the exact expiration date",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Determine DACA status: Is the program currently accepting renewals? Is there a current court order affecting renewals?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For TPS: identify the client's country of birth and check current DHS TPS designation for that country",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review client's criminal history — any new conviction since the last DACA/TPS approval?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Calculate renewal deadline: DACA renewal recommended 150–180 days before EAD expiration",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess whether client qualifies for any other form of immigration relief",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client to bring their I-766 (EAD card) and any recent USCIS notices to the first meeting. The expiration date on the card controls. Remind them: even if the program is under litigation, renewals filed before expiration may be processed under court orders. Do not wait.",
      pitfalls: [
        "Waiting until the EAD actually expires to advise renewal — the window to file safely is 150–180 days before expiration",
        "Not checking the current court order status — DACA renewal acceptance changes with ongoing litigation",
        "Failing to flag criminal record issues before the client files a renewal — a disqualifying conviction in the renewal application triggers immediate status termination"
      ]
    },
    {
      id: "renewal-eligibility",
      name: "Renewal Eligibility & Filing",
      timeline: "Weeks 1–6",
      description: "Confirm eligibility, prepare the renewal package, and file well before the deadline.",
      keyActions: [
        {
          text: "Confirm DACA renewal eligibility: continuous residence, no disqualifying criminal record, school/work/military requirement",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare and file DACA renewal (Form I-821D, I-765, I-765WS) if program is accepting renewals",
          priority: "critical",
          deadline: "File 150–180 days before EAD expiration",
          type: "attorney"
        },
        {
          text: "For TPS: prepare Form I-821 and I-765 for TPS re-registration during the open re-registration period",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Pay filing fees or prepare fee waiver application — DACA renewal fee is $550 (I-765 only; I-821D has no fee)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Retain copies of all filed materials — USCIS loses files and you will need proof of filing",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Advise your client to file the renewal AS SOON AS the 150-day window opens — not at the last minute. USCIS processing times can be unpredictable. File early, keep the receipt notice (I-797C), and carry it with the expired EAD as proof of pending renewal.",
      pitfalls: [
        "Filing too close to the expiration date — USCIS may not process in time, leaving client without work authorization",
        "Missing a re-registration window for TPS — TPS re-registration periods are typically 60 days and missing them is a serious problem",
        "Not advising the client to continue working through the auto-extension period with the receipt notice as proof of pending renewal"
      ]
    },
    {
      id: "alternative-relief",
      name: "Alternative & Permanent Relief Assessment",
      timeline: "Weeks 2–8",
      description: "Identify pathways to permanent immigration status to reduce dependence on the DACA/TPS administrative umbrella.",
      keyActions: [
        {
          text: "Assess cancellation of removal eligibility — many DACA/TPS holders have 10+ years of continuous presence",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess family-based immigration eligibility: U.S. citizen spouse, parent (if over 21), sibling",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For TPS holders from Cuba, Haiti, El Salvador, Honduras, Nicaragua: assess TPS + ABC settlement class membership and adjustment eligibility",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess U visa eligibility for clients who have been crime victims and cooperated with law enforcement",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess employment-based immigration eligibility for highly skilled clients",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Assess VAWA eligibility for clients who experienced domestic violence from a U.S. citizen or LPR spouse or parent",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "If client is placed in removal proceedings while seeking alternative relief"
        }
      ],
      clientGuidance: "DACA and TPS are temporary — explain clearly that the long-term goal should be a path to a green card or permanent protection. For most clients, this means either a family-based petition (sponsored by a U.S. citizen or LPR family member), cancellation of removal (if they have 10 years), or a humanitarian visa (U, T, VAWA).",
      pitfalls: [
        "Not assessing alternative relief pathways — DACA/TPS holders often qualify for multiple forms of relief they don't know about",
        "Missing the TPS + ABC settlement class adjustment pathway for certain Central American and Haitian nationals",
        "Failing to identify U visa eligibility — many DACA/TPS holders have been crime victims who cooperated with police"
      ]
    },
    {
      id: "emergency-measures",
      name: "Emergency Measures for Lapsed Status",
      timeline: "If status has already lapsed",
      description: "If DACA/TPS has already expired or been terminated, take immediate protective steps.",
      keyActions: [
        {
          text: "Determine if client is currently in removal proceedings — if so, file EOIR-28 and assess all defensive relief",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client NOT to travel internationally — departure without advance parole results in a 10-year bar for DACA holders",
          priority: "critical",
          type: "client"
        },
        {
          text: "Advise client on ICE enforcement priorities — those with no criminal record and strong community ties are lower priority but not exempt",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File emergency motions if client receives a Notice to Appear (NTA)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Connect client with an ICE check-in attorney if client has an upcoming check-in appointment",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request time to develop relief strategy if NTA is issued"
        },
        {
          templateId: "bond-motion-eoir",
          name: "Bond Motion (EOIR)",
          relevance: "Seek bond if client is detained following NTA issuance"
        }
      ],
      clientGuidance: "If your client's status has lapsed, they should know: (1) Do NOT leave the country — this creates re-entry bars. (2) Keep a copy of their expired EAD and USCIS receipt notices — these show prior authorized presence. (3) Know Your Rights if ICE comes to the door — they have the right to remain silent and demand to see a judicial warrant before allowing entry.",
      pitfalls: [
        "Client traveling internationally after DACA/TPS lapse — this creates a 3-year or 10-year re-entry bar",
        "Not filing for any available relief when the client is placed in proceedings — lapsed DACA/TPS does not mean no relief is available",
        "Missing ICE check-in appointments — failure to appear can escalate enforcement and result in detention"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "DACA Program Litigation Status",
      variations: [
        {
          states: ["TX", "LA", "MS", "AL", "KS", "NE", "SC", "WV"],
          note: "These states are plaintiffs in ongoing litigation challenging DACA (Texas v. United States). New initial DACA applications have been barred by courts. Check current 5th Circuit and Supreme Court status before advising clients."
        },
        {
          states: ["CA", "IL", "NY", "WA", "OR"],
          note: "Courts in these jurisdictions have generally supported DACA continuation for existing recipients. However, federal district court orders have nationwide effect — monitor current injunction status."
        }
      ]
    },
    {
      topic: "TPS Country Designations",
      variations: [
        {
          states: ["ALL"],
          note: "Current TPS-designated countries (as of 2026): El Salvador, Honduras, Nicaragua, Haiti, Nepal, Syria, Yemen, Somalia, South Sudan, Sudan, Ukraine, Ethiopia, Cameroon, Myanmar, Afghanistan, Venezuela. Designations and re-registration periods change — check DHS.gov Federal Register for current status."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance", "motion-for-continuance-eoir", "bond-motion-eoir"],
  tags: ["DACA", "TPS", "Dreamers", "work authorization", "EAD", "temporary protected status", "deferred action", "renewal"]
};
