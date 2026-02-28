import type { Playbook } from "../schema";

export const probationViolationsPlaybook: Playbook = {
  id: "probation-violations",
  category: "criminal",
  name: "Probation / Parole Violations",
  tagline: "Fight revocation — the stakes are already high",
  overview: "Probation and parole violation proceedings are among the most dangerous in criminal law: the burden of proof is lower than in a criminal trial, the client is often already in custody, and conviction exposes them to the full originally-suspended sentence. The defense must act immediately upon detention, challenge the evidence aggressively, and explore alternatives to revocation at every stage.",
  typicalTimeline: "2–8 weeks (accelerated timeline)",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Standard of proof is only 'preponderance of the evidence' — not beyond a reasonable doubt. You are fighting with one hand tied.",
    "The client may be detained without bail during the violation proceeding. Immediate intervention is critical.",
    "Technical violations (missing a check-in, failing to pay fees) are often more negotiable than new criminal offenses.",
    "A new criminal charge that is still pending does NOT automatically establish a probation violation — the standard of proof is separate.",
    "Revocation exposes the client to the FULL originally-suspended sentence — potentially years that they had avoided.",
    "Parole revocations (state prison releases) are governed by Morrissey v. Brewer (1972) — clients have due process rights."
  ],
  stages: [
    {
      id: "first-appearance",
      name: "First Appearance / Detention Hearing",
      timeline: "Days 1–3",
      description: "Appear at the initial violation hearing and fight for the client's release or the least restrictive conditions pending the full revocation hearing.",
      keyActions: [
        {
          text: "Appear at the first appearance / preliminary violation hearing",
          priority: "critical",
          deadline: "Within 72 hours of detention",
          type: "attorney"
        },
        {
          text: "Argue for release pending final revocation hearing — emphasize time on supervision without prior violations",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain the violation report / petition from the supervising officer or court file",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct client interview to understand alleged violation and client's explanation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client not to make any statements about the alleged violation",
          priority: "high",
          type: "client"
        },
        {
          text: "If violation involves a new arrest: review the new case and advise on Fifth Amendment rights",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-continue",
          name: "Motion to Continue",
          relevance: "Request additional time to investigate and prepare before the revocation hearing"
        }
      ],
      clientGuidance: "Your client needs to understand two critical things: (1) they have the right to a hearing before probation is revoked; and (2) anything they say to probation officers, case managers, or jail staff can be used against them. The Fifth Amendment applies.",
      pitfalls: [
        "Missing the first appearance or preliminary hearing — your absence waives important rights",
        "Allowing client to speak to probation officers about the violation without attorney present",
        "Not immediately requesting the violation petition and supporting evidence"
      ]
    },
    {
      id: "discovery",
      name: "Discovery & Case Preparation",
      timeline: "Days 3–14",
      description: "Gather all evidence underlying the alleged violation and identify legal and factual defenses.",
      keyActions: [
        {
          text: "Request full discovery: violation report, lab reports (if drug test), police reports (if new arrest), officer notes",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review the original probation conditions — verify that the alleged conduct actually violates a specific condition",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For drug test violations: challenge the test methodology, chain of custody, and cut-off levels",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For technical violations (missed check-in, unpaid fees): investigate whether violation was willful vs. inability",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather mitigation evidence: employment, sobriety, treatment participation, family responsibilities",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Contact supervising probation officer — sometimes violations can be resolved without a full hearing",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "If evidence underlying the violation was obtained through an unlawful search"
        }
      ],
      clientGuidance: "Ask your client to gather documentation that shows positive progress: pay stubs, attendance records for treatment programs, letters from employers or counselors. This mitigation evidence is often more powerful in a VOP hearing than legal arguments.",
      pitfalls: [
        "Not challenging drug test results — lab errors occur and cut-off thresholds matter",
        "Failing to verify whether the client's conduct actually violates a specific written probation condition",
        "Not exploring whether a technical violation was due to inability rather than willful non-compliance — courts treat these differently"
      ]
    },
    {
      id: "hearing-prep",
      name: "Revocation Hearing Preparation",
      timeline: "Days 7–21",
      description: "Prepare legal arguments, gather witnesses, and develop mitigation strategy for the revocation hearing.",
      keyActions: [
        {
          text: "Prepare legal arguments challenging the sufficiency of the violation evidence",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify and prepare favorable witnesses (employer, counselor, family members)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Research sentencing alternatives: reinstated probation with modified conditions, community service, brief jail, treatment",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If new criminal charge is pending: assess Fifth Amendment implications of client testifying",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare sentencing memorandum or position letter for the judge",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-continue",
          name: "Motion to Continue",
          relevance: "Request additional time if critical witnesses or evidence are unavailable"
        }
      ],
      clientGuidance: "If your client will testify, prepare them carefully. Remind them that the Fifth Amendment applies — they cannot be compelled to testify about facts that could incriminate them in a pending criminal case. Walk them through what they will and will not say.",
      pitfalls: [
        "Advising client to testify in the VOP hearing when a related criminal charge is still pending — this creates a self-incrimination risk",
        "Appearing without a mitigation package — judges have wide discretion in VOP proceedings",
        "Not exploring alternative sanctions (brief jail, treatment, modified conditions) before the hearing"
      ]
    },
    {
      id: "vop-hearing",
      name: "Revocation Hearing",
      timeline: "Weeks 2–6",
      description: "Present the defense at the revocation hearing and argue for the least restrictive outcome.",
      keyActions: [
        {
          text: "Contest the evidence of violation — cross-examine probation officer and any witnesses",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Present mitigation evidence and witnesses demonstrating positive progress",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Argue for reinstatement of probation (possibly with modified conditions) rather than revocation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If violation is found: argue for minimum sanction — avoid exposure to the full suspended sentence",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Prepare your client for both outcomes. If probation is reinstated, make sure they understand any new or modified conditions. If revocation is ordered, immediately discuss appeals and whether credit for time served reduces the remaining sentence.",
      pitfalls: [
        "Conceding the violation without contesting — even weak contests preserve the record for appeal",
        "Not having the client speak on their own behalf when the judge would benefit from hearing from them directly",
        "Failing to ask for credit for time served in custody pending the revocation hearing"
      ]
    },
    {
      id: "post-hearing",
      name: "Post-Hearing",
      timeline: "After hearing",
      description: "Advise client on outcomes and pursue any available post-revocation remedies.",
      keyActions: [
        {
          text: "If revocation granted: immediately calculate credit for time served and maximum remaining sentence",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess grounds for appeal: due process violations, evidentiary errors, excessive sentence",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If reinstated: ensure client understands all new conditions clearly — get conditions in writing",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For parole revocations: explore early parole re-release, good conduct credit, rehabilitation programs",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If your client is going to serve time, explain the process clearly: when they can expect to be released, what programs are available in custody, and how to get credit for time already served. Clear communication reduces panic and builds trust.",
      pitfalls: [
        "Missing the appeal deadline after a revocation order",
        "Not requesting credit for all time in custody — this is automatic in theory but must be confirmed",
        "Failing to explain reinstated conditions clearly — a second violation could result in a much worse outcome"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Due Process Rights",
      variations: [
        {
          states: ["ALL"],
          note: "Morrissey v. Brewer (1972) establishes minimum due process rights for parole revocation: written notice, disclosure of evidence, opportunity to be heard, right to confront witnesses. Gagnon v. Scarpelli (1973) extends this to probation."
        }
      ]
    },
    {
      topic: "Right to Counsel",
      variations: [
        {
          states: ["ALL"],
          note: "The right to appointed counsel in probation revocation is not absolute under federal constitutional law, but most states provide it when the client faces incarceration. Public defenders should be appointed in these cases."
        },
        {
          states: ["CA"],
          note: "California provides a statutory right to appointed counsel in all probation revocation proceedings where incarceration is possible. Penal Code § 1203.2."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-continue", "motion-to-suppress"],
  tags: ["probation", "parole", "violation", "VOP", "revocation", "supervision"]
};
