import type { Playbook } from "../schema";

export const motionToReopenPlaybook: Playbook = {
  id: "motion-to-reopen",
  category: "immigration",
  name: "Motion to Reopen (In Absentia)",
  tagline: "Rescuing clients from in absentia removal orders",
  overview: "An in absentia removal order is entered when a respondent fails to appear at a scheduled immigration court hearing. These orders can be rescinded if the respondent can show they did not receive proper notice or that exceptional circumstances caused their non-appearance. Given the stakes — a permanent removal order — filing a well-supported motion to reopen is critical. This playbook covers both statutory grounds for rescission and the broader equitable arguments available in some circumstances.",
  typicalTimeline: "3–12 months",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "There are two key statutory grounds for rescission: (1) Lack of proper notice (INA § 240(b)(5)(B)); (2) Exceptional circumstances (INA § 240(b)(5)(C)). Know which applies to your client's situation.",
    "Lack of notice motions must be filed within 180 days if based on exceptional circumstances — but there is NO time limit for lack-of-notice motions.",
    "If the client has already been deported, they may be able to file a motion to reopen from abroad — the BIA retains jurisdiction.",
    "A stay of removal is essential if the client is still in the U.S. — file it simultaneously with the motion to reopen.",
    "DHS can oppose the motion — serve them properly and anticipate their arguments.",
    "For cases closed under MPP (Remain in Mexico) or where notice was sent to wrong address: specific precedent (Matter of Laparra, Pereira) may support rescission."
  ],
  stages: [
    {
      id: "case-assessment",
      name: "Case Assessment",
      timeline: "Days 1–7",
      description: "Obtain the case record, understand the basis for the in absentia order, and identify grounds for rescission.",
      keyActions: [
        {
          text: "Obtain the immigration court's record of proceedings — audio recording and written record",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain proof of how NTA and hearing notice were served on the client",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Confirm the date of the in absentia order and calculate all applicable deadlines",
          priority: "critical",
          deadline: "180-day deadline if exceptional circumstances ground; no deadline for lack of notice",
          type: "attorney"
        },
        {
          text: "Interview client: why did they not appear? Where were they living? Did they receive any notices?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess whether client is still in the U.S. or has been deported",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Check client's current address and postal delivery history for the notice period",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Get the complete story from your client about why they did not appear. Common reasons: no notice received, notice sent to old address, notice in English client could not read, medical emergency, domestic violence preventing them from leaving home, detention. Each has different legal implications.",
      pitfalls: [
        "Missing the 180-day deadline for exceptional circumstances ground — this is a hard cutoff",
        "Not obtaining the full court record, which is needed to show what the court did and did not do",
        "Confusing lack-of-notice and exceptional circumstances grounds — they have different standards and deadlines"
      ]
    },
    {
      id: "grounds-analysis",
      name: "Grounds Analysis",
      timeline: "Days 3–14",
      description: "Identify the strongest legal ground and gather evidence to support it.",
      keyActions: [
        {
          text: "Assess lack of notice ground: Was NTA served properly? Was hearing notice sent to correct address?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess exceptional circumstances ground: serious illness, domestic violence, battering, conditions beyond control",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research applicable BIA precedent: Matter of Yauri, Matter of Grijalva, Dent v. Holder, circuit-specific cases",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather evidence of improper notice: USPS records, change of address forms, prior ICE/court addresses",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather evidence of exceptional circumstances: medical records, hospital records, police reports (if DV)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess new relief grounds that may have arisen since the original order (new law, changed country conditions)",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Explain to your client that the court will want evidence — not just their word — that they did not receive the notice or had a genuine emergency. Hospital records, USPS tracking data, declarations from family members, and prior correspondence with the court all help.",
      pitfalls: [
        "Choosing the wrong ground — exceptional circumstances with a documented lack of notice loses when the IJ sees proper service records",
        "Thin evidence — without corroboration, lack-of-notice claims are hard to win",
        "Not researching new grounds for relief that may now be available — sometimes the removal order is old and circumstances have changed"
      ]
    },
    {
      id: "filing",
      name: "Filing the Motion",
      timeline: "As soon as possible",
      description: "File the motion to reopen and simultaneously request a stay of removal.",
      keyActions: [
        {
          text: "File Motion to Reopen with the immigration court (if case pending there) or BIA (if case on appeal)",
          priority: "critical",
          deadline: "Within 180 days for exceptional circumstances; no deadline for lack of notice",
          type: "attorney"
        },
        {
          text: "File simultaneously with the Motion to Reopen: Request for Stay of Removal",
          priority: "critical",
          deadline: "Same day as motion to reopen",
          type: "attorney"
        },
        {
          text: "Serve DHS counsel with copies of all filed documents",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Submit supporting evidence: declarations, USPS records, medical records, address history",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reopen-eoir",
          name: "Motion to Reopen (EOIR)",
          relevance: "Core motion to rescind in absentia removal order"
        },
        {
          templateId: "motion-for-stay-of-removal-eoir",
          name: "Motion for Stay of Removal (EOIR)",
          relevance: "Critical: prevents deportation while the motion to reopen is pending"
        }
      ],
      pitfalls: [
        "Filing the motion without simultaneously requesting a stay — the client can be deported while the motion is pending",
        "Failing to serve DHS counsel — DHS opposition filed late but without proper service creates procedural issues",
        "Not submitting supporting exhibits with the motion — bare motion without evidence rarely succeeds"
      ]
    },
    {
      id: "stay-request",
      name: "Stay of Removal",
      timeline: "Same day as motion filing",
      description: "Obtain a stay of removal to prevent deportation while the motion is pending.",
      keyActions: [
        {
          text: "File Form EOIR-43 (or court-specific form) for Automatic Stay of Removal if motion filed within 90 days",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If no automatic stay: file emergency motion for discretionary stay arguing likelihood of success on merits",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Alert client to not travel internationally while stay is pending",
          priority: "critical",
          type: "client"
        },
        {
          text: "If detained: file simultaneous motion for release or reduction of bond",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Confirm with ICE Enforcement and Removal Operations (ERO) that stay has been received",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-stay-of-removal-eoir",
          name: "Motion for Stay of Removal (EOIR)",
          relevance: "Emergency motion to halt deportation pending motion to reopen decision"
        }
      ],
      clientGuidance: "Your client must understand: if there is no stay, ICE can remove them at any time. They should not go to their regular ICE check-ins without calling you first, as check-ins can result in immediate deportation. This is a critical communication point.",
      pitfalls: [
        "Client checking in with ICE while removal order is active — can result in immediate deportation",
        "Not confirming that the stay notice reached the ICE field office — court documents and ICE field office communications sometimes don't sync",
        "Assuming an automatic stay exists when it does not — verify the specific court's stay rules"
      ]
    },
    {
      id: "hearing",
      name: "Hearing on Motion",
      timeline: "Months 2–12",
      description: "Present the motion to reopen at the scheduled hearing.",
      keyActions: [
        {
          text: "Present evidence of lack of notice or exceptional circumstances",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Address DHS opposition if filed — counter each factual and legal argument",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If reopened: confirm the first new hearing date and ensure client is prepared to appear",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If denied: assess BIA appeal — IJ denials of motions to reopen are appealable to the BIA",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If the motion is granted and the case is reopened, explain to your client that they are back to square one — the removal proceedings will restart. This is actually good news: they now have the opportunity to present their case before a judge.",
      pitfalls: [
        "Not filing a BIA appeal if the IJ denies — denials can often be reversed on appeal",
        "Not immediately preparing for the new case after reopening — reopened cases often have short scheduling timelines"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Equitable Tolling",
      variations: [
        {
          states: ["CA", "OR", "WA", "MT", "ID", "NV", "AZ", "AK", "HI"],
          note: "9th Circuit allows equitable tolling of the 180-day exceptional circumstances deadline in cases of fraudulent attorney conduct or other egregious circumstances. See Mata v. Lynch (2015)."
        },
        {
          states: ["NY", "CT", "VT"],
          note: "2nd Circuit: equitable tolling of the 180-day deadline is available in limited circumstances. Circuit-specific precedent applies."
        }
      ]
    },
    {
      topic: "MPP / Remain in Mexico Cases",
      variations: [
        {
          states: ["TX", "CA", "AZ", "NM"],
          note: "Clients returned to Mexico under MPP (Migrant Protection Protocols) who received hearing notices at Mexican addresses often have strong lack-of-notice claims. DHS v. Thuraissigiam and Pereira v. Sessions provide supporting arguments."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-reopen-eoir", "motion-for-stay-of-removal-eoir"],
  tags: ["motion to reopen", "in absentia", "removal order", "stay of removal", "EOIR", "BIA", "rescission"]
};
