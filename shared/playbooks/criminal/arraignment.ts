import type { Playbook } from "../schema";

export const arraignmentPlaybook: Playbook = {
  id: "arraignment",
  category: "criminal",
  name: "Arraignment & First Appearance",
  tagline: "Protect your client's rights from day one",
  overview: "The arraignment is the client's first formal court appearance. The attorney must act quickly to preserve rights, establish the record, and set the tone for the defense. This playbook covers the critical 24–72 hours from arrest through arraignment and the immediate follow-up period.",
  typicalTimeline: "1–5 days",
  difficultyLevel: "basic",
  keyConsiderations: [
    "Speedy trial clocks may begin running at arraignment — know your jurisdiction's rules before the hearing.",
    "Bond conditions set at arraignment can persist for the entire case. Fight hard for reasonable conditions immediately.",
    "First impressions with the judge matter. Appear prepared and professional even with minimal notice.",
    "Obtain and review charging documents, police report, and any probable cause affidavit before appearing if possible.",
    "Do not waive any rights on behalf of the client without explicit instruction and understanding."
  ],
  stages: [
    {
      id: "pre-arraignment",
      name: "Pre-Arraignment Preparation",
      timeline: "Before arraignment (hours to days)",
      description: "Gather information and prepare for the arraignment hearing. Even with minimal time, a few key steps will significantly strengthen the client's position.",
      keyActions: [
        {
          text: "Contact the client — in person or by phone — to gather basic facts and provide reassurance",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain charging documents, complaint, and any probable cause affidavit from the clerk or prosecutor",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research client's criminal history to anticipate prosecutor's bail arguments",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify any co-defendants to assess conflict of interest issues",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Gather positive background information (employment, family ties, community roots) for bail argument",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client to say nothing to police, cellmates, or anyone without attorney present",
          priority: "critical",
          type: "client"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Tell your client: Do not discuss the case with anyone — not police, cellmates, family, or friends. Anything you say can and will be used against you. Wait for your attorney to be present.",
      pitfalls: [
        "Failing to review charges before arraignment — you may waive important rights without knowing it",
        "Not confirming the client's full name and correct DOB before the hearing — errors cause delays",
        "Missing the arraignment deadline, which can waive the client's right to a timely arraignment"
      ]
    },
    {
      id: "arraignment-day",
      name: "Arraignment Day",
      timeline: "Day of arraignment",
      description: "The formal plea entry and bail argument. This is a public proceeding that sets critical case parameters.",
      keyActions: [
        {
          text: "Enter plea of Not Guilty — never plead guilty at arraignment without full case review",
          priority: "critical",
          deadline: "At arraignment",
          type: "attorney"
        },
        {
          text: "Argue for own recognizance release or minimum bail based on ties to community and lack of flight risk",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request discovery and set a discovery schedule or deadline",
          priority: "high",
          deadline: "At arraignment",
          type: "attorney"
        },
        {
          text: "Assert client's speedy trial rights if applicable",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Confirm next court date and put it in writing for the client",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Preserve any objections to the sufficiency of the charging document on the record",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reduce-bail",
          name: "Motion to Reduce Bail",
          relevance: "File if bail was set too high at arraignment — can be filed same day"
        },
        {
          templateId: "motion-for-pretrial-release",
          name: "Motion for Pretrial Release",
          relevance: "Use when arguing for release on own recognizance or supervised release"
        }
      ],
      clientGuidance: "Instruct your client to dress professionally if possible, address the judge as 'Your Honor,' and not speak unless spoken to. Coach them that 'Not Guilty' is a procedural plea, not an admission of what happened.",
      pitfalls: [
        "Entering a guilty plea without fully reviewing the case and potential defenses",
        "Failing to challenge an excessive bail amount at arraignment — this can trap clients in custody for months",
        "Not requesting discovery promptly — delays can prejudice the defense",
        "Allowing the judge to set harsh conditions (GPS monitor, no-contact orders) without contesting them"
      ],
      jurisdictionVariations: [
        {
          states: ["CA"],
          note: "California requires arraignment within 48 hours of arrest (excluding weekends/holidays). Penal Code § 825."
        },
        {
          states: ["NY"],
          note: "New York arraignment must occur 'without unnecessary delay.' In NYC, arraignment courts operate 24/7. Bail Reform Act of 2019 limits cash bail to certain felonies."
        },
        {
          states: ["TX"],
          note: "Texas requires arraignment within 48 hours. Magistrate sets bail. Code of Criminal Procedure Art. 15.17."
        }
      ]
    },
    {
      id: "immediate-post-arraignment",
      name: "Immediate Post-Arraignment",
      timeline: "Days 1–7 after arraignment",
      description: "Solidify the defense foundation in the days following arraignment.",
      keyActions: [
        {
          text: "File motion to reduce bail if the amount set is unreasonable",
          priority: "critical",
          deadline: "Within 3 days",
          type: "attorney"
        },
        {
          text: "Send formal discovery request letter to the prosecutor",
          priority: "high",
          deadline: "Within 48 hours",
          type: "attorney"
        },
        {
          text: "Conduct substantive client interview to gather defense facts",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify and preserve potential evidence (surveillance footage, witnesses, cell phone records)",
          priority: "high",
          deadline: "Within 72 hours — footage is often overwritten",
          type: "attorney"
        },
        {
          text: "Advise client on bail conditions — what they can and cannot do while released",
          priority: "standard",
          type: "client"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-reduce-bail",
          name: "Motion to Reduce Bail",
          relevance: "File if bail remains excessive after arraignment argument"
        },
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Formal discovery demand to the prosecution"
        }
      ],
      clientGuidance: "Your client must understand their bail conditions. Violations can result in re-arrest and forfeiture of bail. Make sure they know: check-in requirements, travel restrictions, no-contact orders, and any electronic monitoring rules.",
      pitfalls: [
        "Waiting too long to send discovery requests — some jurisdictions have strict deadline rules",
        "Not sending a preservation letter to businesses with surveillance footage (footage typically deleted in 30–72 hours)",
        "Client violating bail conditions unknowingly — always explain conditions in plain language"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Speedy Trial Rights",
      variations: [
        {
          states: ["CA"],
          note: "Felony trial must begin within 60 days of arraignment (Penal Code § 1382). Misdemeanor within 30 days if in custody, 45 if not."
        },
        {
          states: ["NY"],
          note: "CPL § 30.30 requires prosecution readiness within 6 months (felony), 90 days (misdemeanor). Clock stops for various excludable periods."
        },
        {
          states: ["FL"],
          note: "Rule 3.191: felony trial within 175 days, misdemeanor within 90 days of arrest."
        }
      ]
    },
    {
      topic: "Bail Reform",
      variations: [
        {
          states: ["NY", "NJ"],
          note: "Significant bail reform — cash bail is largely eliminated for misdemeanors and many non-violent felonies. Focus arguments on least restrictive conditions."
        },
        {
          states: ["CA"],
          note: "Cash bail remains available but courts must consider defendant's ability to pay. Prop 25 (2020) failed, preserving cash bail system."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-reduce-bail", "motion-for-pretrial-release", "motion-for-discovery"],
  tags: ["arraignment", "bail", "first appearance", "plea", "discovery"]
};
