import type { Playbook } from "../schema";

export const recklessDrivingDwlsPlaybook: Playbook = {
  id: "reckless-driving-dwls",
  category: "criminal",
  name: "Reckless Driving / DWLS",
  tagline: "Break the cycle of suspension — get your client driving legally",
  overview: "Driving While License Suspended (DWLS) and reckless driving charges often trap low-income clients in a spiral: fines they cannot pay lead to license suspension; suspension leads to DWLS charges; DWLS charges lead to more fines and extended suspension. The defense approach is two-track: (1) litigate the criminal charge to minimize conviction exposure, and (2) simultaneously work the DMV administrative system to restore the license. A client who gets their license restored during the case has a dramatically stronger argument for dismissal or reduction.",
  typicalTimeline: "2–8 months",
  difficultyLevel: "basic",
  keyConsiderations: [
    "License restoration is often MORE important than the criminal case outcome — a restored license breaks the suspension cycle. Pursue DMV restoration simultaneously with the criminal defense.",
    "Knowledge of suspension is typically an element of DWLS — if the client was not properly notified of the suspension, the charge may be dismissible.",
    "Reckless driving is a serious charge in many states — it can be used as a 'wet reckless' plea reduction in DUI cases, which means it carries its own significant consequences (insurance, insurance surcharges, points).",
    "Immigration: reckless driving can constitute a crime of violence in some circumstances. DWLS is generally not a CIMT but assess the specific statute.",
    "Ability to pay: many suspensions stem from unpaid fines and fees. Explore ability-to-pay hearings, fine reduction, and payment plans as part of license restoration.",
    "Employment: many clients drive for work (commercial drivers, rideshare, delivery). A DWLS conviction can cost them their livelihood."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Review & License History",
      timeline: "Days 1–14",
      description: "Obtain the full suspension history and identify the path to license restoration.",
      keyActions: [
        {
          text: "Obtain the client's full DMV driving record — identify all suspension reasons and reinstatement requirements",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Determine the legal basis for the suspension: unpaid fines? Failure to appear? Accumulation of points? License revocation?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess whether the client had actual knowledge of the suspension at the time of the DWLS charge",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For reckless driving: review the police report and any video for the alleged conduct — is it actually 'reckless' (willful disregard for safety)?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify client's employment — does this client drive for work? CDL holder? Rideshare driver?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen for immigration consequences — especially for reckless driving charges with injury",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request police report, traffic stop video, and DMV notification records"
        }
      ],
      clientGuidance: "Ask your client: 'Did you receive any notice that your license was suspended?' and 'Did you understand your license was suspended when you were stopped?' If the notice was sent to an old address or was unclear, the knowledge element of DWLS may be missing — and that is a complete defense.",
      pitfalls: [
        "Not obtaining the DMV driving record immediately — without it, you cannot assess the reinstatement path or challenge the suspension",
        "Missing the knowledge element analysis — DWLS requires the driver knew or should have known the license was suspended",
        "Ignoring license restoration as a strategy — prosecutors often reduce or dismiss DWLS charges when the client restores their license"
      ]
    },
    {
      id: "license-restoration",
      name: "License Restoration Strategy",
      timeline: "Weeks 2–6",
      description: "Simultaneously pursue license restoration through the DMV while the criminal case proceeds.",
      keyActions: [
        {
          text: "Identify all requirements to reinstate the license: outstanding fines, fees, SR-22 insurance, testing",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If suspended for unpaid fines: file for ability-to-pay hearing or request fine reduction/community service alternative",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If suspended for failure to appear: resolve the underlying warrant and arrange DMV reinstatement",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client to obtain SR-22 insurance certificate if required — and understand it will be required for 3 years",
          priority: "high",
          type: "client"
        },
        {
          text: "Arrange a payment plan with the DMV or court for outstanding fees if client cannot pay in full",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Bring proof of license restoration to the next court date — judges and prosecutors respond positively",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Explain to your client that restoring their license — even if it costs money they don't easily have — is the single most powerful thing they can do for this case. A driver who appears in court with a valid license is treated completely differently than one who does not.",
      pitfalls: [
        "Not pursuing license restoration simultaneously with the criminal case — they should proceed in parallel",
        "Failing to identify all outstanding warrants and fines that are preventing reinstatement",
        "Not exploring ability-to-pay hearings for clients who cannot afford the reinstatement fees — many courts have formal processes for this"
      ]
    },
    {
      id: "criminal-defense",
      name: "Criminal Defense — DWLS",
      timeline: "Weeks 2–12",
      description: "Challenge the knowledge element and negotiate based on license restoration progress.",
      keyActions: [
        {
          text: "Request DMV records showing when and how notice of suspension was sent to client",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If notice was sent to wrong address: file motion to dismiss for failure to prove knowledge element",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If client restores license before resolution: negotiate dismissal based on compliance and restoration",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Challenge the traffic stop if no lawful basis — suppress the stop and any evidence including discovery of suspended status",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-dismiss",
          name: "Motion to Dismiss",
          relevance: "Dismiss if knowledge element is not established or client has restored their license"
        },
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress evidence if the underlying traffic stop lacked reasonable suspicion"
        }
      ],
      pitfalls: [
        "Not challenging the traffic stop — DWLS is a crime discovered through a stop, not observed. The stop must have an independent lawful basis",
        "Missing the knowledge element defense — clients often don't know their license is suspended, especially after old violations or address changes",
        "Failing to inform the court of license restoration steps taken — this is affirmative mitigation that can result in dismissal"
      ]
    },
    {
      id: "reckless-driving-defense",
      name: "Criminal Defense — Reckless Driving",
      timeline: "Weeks 2–16",
      description: "Contest the 'reckless' element and negotiate a reduction to a lesser traffic offense.",
      keyActions: [
        {
          text: "Challenge the officer's characterization of driving as 'reckless' vs. negligent or merely fast",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review dash-cam and body-cam footage for the actual driving behavior",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Negotiate reduction to 'careless driving' or traffic infraction — fewer consequences, no criminal record",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For reckless driving with injury: assess civil liability exposure — coordinate with insurance counsel",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For CDL holders: reckless driving conviction results in 60-day CDL disqualification. Federal law applies",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress statements made during the stop or any unlawfully obtained evidence"
        }
      ],
      clientGuidance: "For CDL holders facing reckless driving: this is an employment emergency. A reckless driving conviction triggers a mandatory 60-day CDL disqualification under federal law (49 C.F.R. § 383.51). Fight every element of this charge with full resources.",
      pitfalls: [
        "Accepting a 'reckless driving' plea for a CDL holder without warning them of the federal disqualification consequences",
        "Not requesting dash-cam footage — officer testimony about 'reckless' driving is subjective and can be contradicted by video",
        "Missing the distinction between reckless (willful disregard) and negligent driving — prosecutors must prove the higher standard"
      ]
    },
    {
      id: "sentencing-restoration",
      name: "Sentencing & License Restoration Plan",
      timeline: "Post-resolution",
      description: "Minimize sentencing and establish a clear path to full license restoration.",
      keyActions: [
        {
          text: "Present license restoration progress at sentencing — court respects proactive compliance",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Argue against additional license suspension as a sentencing condition — client needs to drive",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Set up payment plan for any court-ordered fines to prevent future suspension spiral",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client on traffic school completion to remove points from record",
          priority: "standard",
          type: "client"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Advise your client after sentencing: set up automatic payments for any ongoing fines, keep their address current with the DMV, and attend any required traffic school. Missing a payment can restart the entire suspension cycle.",
      pitfalls: [
        "Leaving the client without a clear plan to stay compliant after sentencing — the cycle repeats without intervention",
        "Not exploring traffic school as a point-reduction mechanism",
        "Failing to address the root cause (inability to pay fines) that led to the initial suspension"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "DWLS Charge Levels",
      variations: [
        {
          states: ["CA"],
          note: "California VC § 14601.1 (suspended for failure to appear/pay): infraction or misdemeanor. VC § 14601 (suspended for DUI or reckless): mandatory minimum 5 days jail. Know which subsection is charged."
        },
        {
          states: ["FL"],
          note: "Florida: 1st offense DWLS without knowledge is a non-criminal traffic infraction. With knowledge, 2nd degree misdemeanor. 3rd conviction is a 1st degree misdemeanor. Habitual offenders face felony charges."
        },
        {
          states: ["TX"],
          note: "Texas TRC § 521.457: Class C misdemeanor (1st and 2nd offense), Class B (3rd+). Occupational license available for essential driving after 90-day waiting period."
        },
        {
          states: ["WA"],
          note: "Washington: DWLS 1st degree (suspended for DUI/reckless) is a gross misdemeanor. DWLS 3rd degree (administrative suspension) is a misdemeanor. Large volume of DWLS cases come through district courts."
        }
      ]
    },
    {
      topic: "Ability-to-Pay & License Restoration",
      variations: [
        {
          states: ["CA"],
          note: "California: AB 1927 (2021) eliminated failure-to-pay as a basis for license suspension. Court fines can be reduced by 50% for clients below 400% of federal poverty level. DMV must notify before suspending."
        },
        {
          states: ["NY"],
          note: "New York: Driver Responsibility Assessment (DRA) surcharges can accumulate to thousands. NYC courts offer fee waiver hearings. Conditional driving privileges available during suspension."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-dismiss", "motion-to-suppress", "motion-for-discovery"],
  tags: ["reckless driving", "DWLS", "driving while suspended", "license suspension", "CDL", "traffic offense", "DMV"]
};
