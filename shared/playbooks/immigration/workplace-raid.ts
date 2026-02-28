import type { Playbook } from "../schema";

export const workplaceRaidPlaybook: Playbook = {
  id: "workplace-raid",
  category: "immigration",
  name: "Workplace Raid Response",
  tagline: "The first four hours determine the outcome for dozens of people",
  overview: "Workplace immigration enforcement operations (I-9 audits, administrative arrests, and criminal search warrants) are high-volume, high-chaos events that simultaneously affect many individuals. Response requires immediate legal mobilization, coordination with employer counsel and workers, rapid client identification, and simultaneous deployment of Know Your Rights information. This playbook is designed for legal aid organizations and public defenders responding to a workplace enforcement action affecting multiple workers.",
  typicalTimeline: "Days (immediate) to months (individual cases)",
  difficultyLevel: "advanced",
  keyConsiderations: [
    "Workplace raids involve two distinct legal proceedings: (1) civil immigration enforcement (removal) for workers, and (2) criminal prosecution for employers (I-9 violations, harboring, document fraud). Know which you are addressing.",
    "Workers may be detained on-site or taken to ICE holding. Immediate identification is critical — detained workers need representation within hours.",
    "ICE must have a judicial warrant to enter non-public areas of a workplace. A civil administrative warrant (Form I-200) does NOT authorize forcible entry — only a federal judge's warrant does.",
    "Workers have the right to remain silent and refuse to answer questions about immigration status. Many workers do not know this.",
    "I-9 audits (NOI — Notice of Inspection) give employers 3 business days to produce I-9 records. This is different from a raid and requires employer-side legal response.",
    "Workers with pending U visa petitions (crime victims) or T visas (trafficking victims) may be eligible for deferred action — identify these cases immediately."
  ],
  stages: [
    {
      id: "immediate-0-4h",
      name: "Immediate Response (0–4 Hours)",
      timeline: "Within hours of raid notification",
      description: "Deploy emergency response, identify detained workers, and establish attorney presence.",
      keyActions: [
        {
          text: "Establish command center outside the worksite — coordinate with other legal organizations, community groups, and consulates",
          priority: "critical",
          deadline: "Within 1–2 hours of notification",
          type: "attorney"
        },
        {
          text: "Determine whether ICE had a judicial warrant — request to see it. Administrative Form I-200 does not authorize entry into non-public areas",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify workers who were detained vs. released — obtain names, A-numbers, and detention facility from family members",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Deploy Know Your Rights (KYR) information to workers who were released — many will be re-approached",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise released workers: do not return to the worksite, do not speak to media, do not speak to ICE agents who approach them",
          priority: "critical",
          type: "client"
        },
        {
          text: "Contact the detention facility to locate detained workers and file EOIR-28 as quickly as possible",
          priority: "critical",
          deadline: "Within hours to prevent transfer",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File immediately for each detained worker to prevent transfer and establish attorney-client communication"
        }
      ],
      clientGuidance: "Workers who are approached by ICE but not detained should be told: 'You have the right to remain silent. You do not have to answer questions about where you were born or how you entered the country. You have the right to speak to a lawyer before answering any questions.' Provide this in writing in their language.",
      pitfalls: [
        "Failing to challenge ICE's authority to enter the non-public worksite — agents sometimes enter without proper judicial warrants",
        "Not filing EOIR-28 immediately for detained workers — transfer to a remote facility cuts off access to counsel",
        "Workers not knowing they can refuse to answer questions — most workers believe they must cooperate"
      ]
    },
    {
      id: "client-identification",
      name: "Client Identification & Documentation",
      timeline: "Hours to Days 1–3",
      description: "Identify all affected workers, triage their situations, and organize the legal response.",
      keyActions: [
        {
          text: "Set up intake hotline or location for workers and families to self-identify",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For each detained worker: obtain A-number, date of birth, nationality, detention facility",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Triage workers by legal situation: pending cases, prior orders, potential relief (asylum, TPS, U/T visa, cancellation)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify workers with pending DACA, TPS, or other deferred action — these may have ICE-exercise-of-discretion claims",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify workers who were victims of employer exploitation — potential U or T visa eligibility",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Coordinate with consulates — many workers are entitled to consular notification under the Vienna Convention",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Gather family contact information for each detained worker. ICE will contact family with bond information — having a central coordinator improves response time. Identify who has children: U.S.-citizen minor children may support a bond and deferred action argument.",
      pitfalls: [
        "Not identifying DACA/TPS workers immediately — these workers may have additional claims for prosecutorial discretion",
        "Failing to flag potential U and T visa cases — employer wage theft and unsafe working conditions may qualify workers as crime victims",
        "Not coordinating with consulates — consular assistance can help detained workers connect with family and legal resources"
      ]
    },
    {
      id: "short-term-response",
      name: "Short-Term Legal Response",
      timeline: "Days 1–7",
      description: "File bond motions, challenge detention, and protect workers from immediate deportation.",
      keyActions: [
        {
          text: "File bond motions for all detained workers — emphasize community ties, U.S. citizen family members",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Check for and challenge any expedited removal orders — some workers may face summary deportation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File stay requests for any workers with prior removal orders who were re-detained",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for asylum claims — workers from countries with violence or persecution may qualify",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Coordinate employer-side legal representation — I-9 audit and criminal exposure require separate employment counsel",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "bond-motion-eoir",
          name: "Bond Motion (EOIR)",
          relevance: "File for bond redetermination for each detained worker"
        },
        {
          templateId: "motion-for-stay-of-removal-eoir",
          name: "Motion for Stay of Removal (EOIR)",
          relevance: "Halt removal for workers with prior orders who are seeking to reopen their cases"
        }
      ],
      pitfalls: [
        "Prioritizing only workers with strong cases — workers with prior orders or criminal history still need representation",
        "Not separating employer and employee legal representation — they may have conflicting interests",
        "Missing expedited removal orders — workers at the border or within 2 years of entry may face summary deportation without a hearing"
      ]
    },
    {
      id: "legal-strategy",
      name: "Individual Legal Strategy",
      timeline: "Weeks 1–8",
      description: "Develop individualized defense strategies for each worker.",
      keyActions: [
        {
          text: "For each worker: identify all available forms of relief and develop a case roadmap",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For workers with criminal history: conduct full Padilla analysis of criminal record's immigration impact",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For workers with U.S. citizen children: develop cancellation of removal or deferred action arguments",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For workers who signed documents at the workplace: review what was signed — voluntary departure forms signed under duress may be challengeable",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess prosecutorial discretion: long-term residents, U.S. citizen family, victims of wage theft may qualify for deferred action",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-continuance-eoir",
          name: "Motion for Continuance (EOIR)",
          relevance: "Request time to develop each worker's individual case strategy"
        }
      ],
      clientGuidance: "Workers who signed documents at the worksite — including I-826 (Right to Hearing) waivers or voluntary departure forms — often did so under duress without understanding what they were signing. These can be challenged. Immediately review all signed documents with each client.",
      pitfalls: [
        "Treating all workers in the raid as having identical legal needs — each worker's situation is individual",
        "Not challenging documents signed under duress — waivers obtained during enforcement actions are regularly challenged successfully",
        "Failing to document employer wage violations — these support U visa claims and strengthen prosecutorial discretion arguments"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Warrant Requirements for Worksite Entry",
      variations: [
        {
          states: ["ALL"],
          note: "ICE agents may enter public areas of a business without a warrant. To enter non-public areas (back offices, warehouses, employee-only areas), ICE needs either a judicial warrant signed by a federal judge or voluntary consent from the owner/manager. A civil administrative warrant (Form I-200/I-205) does NOT authorize forcible entry into non-public spaces. See Illinois v. Rodriguez (1990) on consent."
        }
      ]
    },
    {
      topic: "I-9 Audits (NOI)",
      variations: [
        {
          states: ["ALL"],
          note: "An I-9 inspection begins with a Notice of Inspection (NOI). Employers have 3 business days to produce I-9 records. Workers are not directly implicated in the I-9 audit but the audit results may trigger enforcement actions against workers. Employers should consult employment counsel immediately upon receiving an NOI."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance", "bond-motion-eoir", "motion-for-continuance-eoir", "motion-for-stay-of-removal-eoir"],
  tags: ["workplace raid", "ICE enforcement", "worksite enforcement", "I-9 audit", "mass arrest", "emergency response", "Know Your Rights"]
};
