import type { Playbook } from "../schema";

export const duiDwiPlaybook: Playbook = {
  id: "dui-dwi",
  category: "criminal",
  name: "DUI / DWI Defense",
  tagline: "Challenge the stop, the test, and the science",
  overview: "DUI/DWI cases are technically complex. Every stage from the initial stop to chemical testing involves constitutional and scientific issues that can be challenged. A thorough defense requires attacking the legality of the traffic stop, the accuracy of field sobriety tests (FSTs), and the reliability of the breathalyzer or blood draw.",
  typicalTimeline: "3–18 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "The DMV license suspension and the criminal case are two SEPARATE proceedings with different deadlines — missing the DMV hearing request deadline (often 10 days) means automatic license suspension.",
    "Request the breathalyzer calibration records and maintenance logs immediately — these are essential for challenging BAC results.",
    "Standardized Field Sobriety Tests (SFSTs) are designed to generate failure — challenge officer training and administration.",
    "Blood draw cases require chain of custody review and may warrant independent lab testing.",
    "Immigration consequences: a DUI conviction can trigger severe immigration consequences for non-citizen clients — always conduct an immigration analysis early."
  ],
  stages: [
    {
      id: "initial-review",
      name: "Initial Case Review",
      timeline: "Days 1–10 (critical: DMV deadline)",
      description: "Preserve all evidence, request DMV hearing, and conduct the initial legal analysis of the stop and detention.",
      keyActions: [
        {
          text: "Request DMV administrative hearing to contest license suspension — strict deadline (usually 7–10 days from arrest)",
          priority: "critical",
          deadline: "Within 10 days of arrest in most states",
          type: "attorney"
        },
        {
          text: "Obtain and review the police dash-cam and body-cam footage",
          priority: "critical",
          deadline: "Send preservation request within 48 hours",
          type: "attorney"
        },
        {
          text: "Request all breathalyzer records: device serial number, calibration logs, maintenance records",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Conduct client interview: route taken, what was consumed, where, when, and officer conduct",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise client not to discuss the case on social media or with anyone",
          priority: "high",
          type: "client"
        },
        {
          text: "Assess whether client has prior DUIs — sentence exposure changes drastically",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-discovery",
          name: "Motion for Discovery",
          relevance: "Request breath test calibration records, maintenance logs, officer training records, and all video footage"
        }
      ],
      clientGuidance: "Advise your client to make no statements about the case to anyone. Do NOT post about the arrest on social media. Explain the two separate proceedings — the DMV hearing and the criminal case — and the importance of acting immediately on the DMV deadline.",
      pitfalls: [
        "Missing the DMV hearing request deadline — automatic license suspension becomes effective",
        "Failing to request breathalyzer maintenance records early — these can disappear",
        "Not reviewing dash-cam footage before arraignment — it may show exculpatory evidence"
      ],
      jurisdictionVariations: [
        {
          states: ["CA"],
          note: "California: 10 days from arrest to request DMV hearing (Admin Per Se). Call 1-800-777-0133. Ignition interlock device (IID) required for all first-offense DUIs as of Jan 2019."
        },
        {
          states: ["TX"],
          note: "Texas: 15 days from DPS notice to request ALR (Administrative License Revocation) hearing."
        },
        {
          states: ["NY"],
          note: "New York: DMV refusal hearing separate from license revocation. No ALR deadline issue — focus on Article 78 proceeding if needed."
        }
      ]
    },
    {
      id: "discovery-review",
      name: "Discovery & Evidence Analysis",
      timeline: "Weeks 2–6",
      description: "Deep dive into all evidence to identify suppression and impeachment opportunities.",
      keyActions: [
        {
          text: "Analyze all video footage frame-by-frame — look for: driving pattern, stop conditions, FST administration",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Review officer's SFST training certification and compare to NHTSA administration standards",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain and review breathalyzer maintenance logs — look for out-of-spec readings, missed calibration dates",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For blood draw cases: request blood split for independent testing, review chain of custody",
          priority: "high",
          deadline: "Must request promptly — sample degrades",
          type: "attorney"
        },
        {
          text: "Research the specific breathalyzer model for known defects and published studies",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "If there is a blood draw, explain to your client that they have the right to have a portion of the sample independently tested. This can be powerful if the prosecution's result is near the legal limit.",
      pitfalls: [
        "Accepting chemical test results at face value — breathalyzers have documented failure modes",
        "Missing FST administration deviations that could exclude the test results",
        "Not hiring an expert for complex blood cases"
      ]
    },
    {
      id: "pretrial-motions",
      name: "Pre-Trial Motions",
      timeline: "Months 2–5",
      description: "File suppression motions and challenge the prosecution's key evidence.",
      keyActions: [
        {
          text: "File motion to suppress if stop lacked reasonable suspicion (Fourth Amendment)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File motion to suppress breathalyzer results if calibration or admin procedures were defective",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to suppress FST results if officer was not properly certified or deviated from protocol",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to continue if discovery is incomplete",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-suppress",
          name: "Motion to Suppress",
          relevance: "Suppress evidence from unlawful stop or defective chemical testing"
        },
        {
          templateId: "motion-to-continue",
          name: "Motion to Continue",
          relevance: "Request additional time for discovery or expert analysis"
        }
      ],
      clientGuidance: "Explain to your client that suppression hearings are not trials — they are hearings about whether evidence will be allowed. If key evidence is suppressed (like the BAC result), the prosecution may offer a much better deal or dismiss the case.",
      pitfalls: [
        "Filing boilerplate suppression motions without case-specific facts — courts dismiss these quickly",
        "Missing motion deadlines (often set at arraignment or by local rule)",
        "Not calling the arresting officer to testify at suppression hearing when video contradicts the police report"
      ]
    },
    {
      id: "plea-trial-decision",
      name: "Plea Negotiation or Trial Preparation",
      timeline: "Months 3–12",
      description: "Make the strategic decision to resolve by plea or proceed to trial based on evidence strength.",
      keyActions: [
        {
          text: "Evaluate plea offers against likely trial outcome and collateral consequences (immigration, license, employment)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research diversion or wet reckless negotiation options in the jurisdiction",
          priority: "high",
          type: "attorney"
        },
        {
          text: "If going to trial: retain DUI expert witness (toxicologist, FST expert)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise non-citizen clients on deportability consequences of any plea",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Walk the client through the realistic outcomes of both a plea and a trial. Cover collateral consequences: license revocation, ignition interlock, insurance rates, employment background checks, and for non-citizens, immigration consequences.",
      pitfalls: [
        "Pleading to a DUI without exploring diversion or 'wet reckless' reduction",
        "Failing to advise non-citizen clients that a DUI plea can trigger removal proceedings",
        "Taking a weak case to trial without an expert witness"
      ]
    },
    {
      id: "sentencing",
      name: "Sentencing",
      timeline: "Post-plea or post-trial",
      description: "Minimize sentencing consequences and plan for license restoration.",
      keyActions: [
        {
          text: "Prepare sentencing memorandum with mitigating factors: no prior record, employment, family, treatment",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Arrange voluntary enrollment in alcohol treatment program before sentencing if appropriate",
          priority: "high",
          type: "client"
        },
        {
          text: "Advise client on ignition interlock device requirements and license reinstatement process",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Explore work-release or electronic monitoring in lieu of jail if custody is required",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Sentencing is where proactive steps pay off. If your client attends AA meetings or enters treatment voluntarily, bring documentation to court. Judges respond well to clients who are already taking responsibility.",
      pitfalls: [
        "Appearing at sentencing without a sentencing memorandum for more serious DUI cases",
        "Not advising the client on DMV reinstatement requirements, which can differ from court requirements",
        "Failing to address ignition interlock requirements proactively"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "BAC Limits",
      variations: [
        {
          states: ["ALL"],
          note: "Per se limit is 0.08% for adults in all 50 states. Commercial drivers: 0.04%. Under 21: 0.01–0.02% depending on state (zero tolerance)."
        },
        {
          states: ["UT"],
          note: "Utah reduced the per se limit to 0.05% effective December 2018 — the lowest in the nation."
        }
      ]
    },
    {
      topic: "Implied Consent",
      variations: [
        {
          states: ["ALL"],
          note: "All states have implied consent laws. Refusal to submit to chemical testing triggers automatic license suspension (often longer than a first-offense DUI)."
        },
        {
          states: ["MN", "ND"],
          note: "Following Birchfield v. North Dakota (2016), warrantless blood draws are unconstitutional. Breath tests may still be required. State criminal refusal statutes have been challenged."
        }
      ]
    },
    {
      topic: "Immigration Consequences",
      variations: [
        {
          states: ["ALL"],
          note: "A DUI with injury is a crime of violence and can be an aggravated felony under immigration law. Even first-offense DUIs can be grounds for removal in some circuits. Always consult immigration counsel for non-citizen clients."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-suppress", "motion-to-continue", "motion-for-discovery"],
  tags: ["DUI", "DWI", "drunk driving", "BAC", "breathalyzer", "traffic", "license suspension"]
};
