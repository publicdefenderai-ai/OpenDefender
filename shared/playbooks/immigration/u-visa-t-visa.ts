import type { Playbook } from "../schema";

export const uVisaTVisaPlaybook: Playbook = {
  id: "u-visa-t-visa",
  category: "immigration",
  name: "U Visa / T Visa (Crime & Trafficking Victims)",
  tagline: "Certification is the key — build the relationship with law enforcement early",
  overview: "The U visa (for crime victims who cooperate with law enforcement) and T visa (for trafficking victims) provide powerful pathways to lawful status and eventual permanent residence for some of the most vulnerable immigrant clients. Both require a certification from a law enforcement agency (LEA), which is both the greatest challenge and the most important advocacy target in these cases. A successful U or T visa case can transform a client's life — immigration status, work authorization, and a path to a green card — while also supporting the underlying criminal or trafficking investigation.",
  typicalTimeline: "2–5 years (due to USCIS waitlists)",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "U visa certification (Form I-918B) must come from a law enforcement agency — police, prosecutor's office, FBI, or similar. Building relationships with certifying officials is as important as the legal work.",
    "USCIS cap: only 10,000 U visas are issued annually. Due to demand, wait times are 4–6 years. However, applicants on the waitlist receive deferred action and work authorization — file early.",
    "T visa: no annual cap, but USCIS scrutinizes trafficking claims carefully. The trafficking must involve force, fraud, or coercion for sex or labor. 'Trafficking' does not require transportation.",
    "Bona fide determination: USCIS now issues 'bona fide' determinations for pending U visa applications — this gives clients work authorization while they wait for adjudication.",
    "Prior removal orders and criminal history do not automatically bar U or T visa eligibility, but waivers may be needed. Research carefully.",
    "Derivative visas: spouses, children, and certain other family members can receive derivative U and T visas — the benefit extends to the whole family."
  ],
  stages: [
    {
      id: "victim-identification",
      name: "Victim Identification & Screening",
      timeline: "Days 1–14",
      description: "Identify whether the client is a qualifying victim and assess which visa type applies.",
      keyActions: [
        {
          text: "Screen for U visa eligibility: was the client a victim of a qualifying crime? (Assault, DV, sexual assault, trafficking, robbery, fraud, obstruction, etc.)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for T visa eligibility: was the client a victim of sex or labor trafficking (force, fraud, or coercion)?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess client's level of cooperation with law enforcement — have they reported? Testified? Cooperated with investigation?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Identify the qualifying crime and the specific LEA (law enforcement agency) involved — who can certify?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for waivers needed: criminal history, immigration violations, prior removals, health grounds",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify derivative family members who will benefit from the same petition",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Many clients do not know they qualify for a U visa. The qualifying crimes list is broad: domestic violence, sexual assault, trafficking, robbery, fraud in foreign labor contracting, obstruction of justice, stalking, and many others. Ask directly: 'Have you ever been the victim of any crime in the United States, even if you did not report it?'",
      pitfalls: [
        "Not screening for U visa eligibility during criminal defense representation — a client who is a crime victim may be eligible even if they have their own criminal history",
        "Assuming 'trafficking' requires physical movement across borders — trafficking is defined by force, fraud, or coercion for sex or labor, not transportation",
        "Not identifying derivative family members — spouses and children of U/T visa holders can also get status"
      ]
    },
    {
      id: "certification-pursuit",
      name: "Law Enforcement Certification",
      timeline: "Weeks 2–12",
      description: "Obtain the law enforcement certification — the single most critical step in the U/T visa process.",
      keyActions: [
        {
          text: "Identify the appropriate certifying official: local police, prosecutor's office, FBI, DOL, EEOC, or other federal agency",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Submit formal request for I-918B certification with the client's cooperation history documented",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If the client has not yet cooperated: work with them to report the crime and begin cooperation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Appeal a denial of certification to the supervising agency or prosecutor — certification denials are not final and can be overcome",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For T visa: obtain certification from any certifying agency OR submit evidence the client complied with reasonable requests for assistance",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Document all client cooperation: police reports, interviews, court appearances, testimony",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The certification process can feel overwhelming because it requires your client to re-engage with law enforcement — which may be frightening. Explain: the certifying official is not re-investigating them; they are confirming that your client was a victim and cooperated. The client does not need to have pressed charges or testified at trial — initial cooperation is usually sufficient.",
      pitfalls: [
        "Not appealing a certification denial — certifying officials are not always familiar with U visa requirements and denials can often be overturned with advocacy",
        "Assuming the client must have testified or pressed charges — cooperation with the investigation is the standard, not conviction of the perpetrator",
        "Not building a relationship with the certifying agency's U/T visa coordinator — many agencies have designated points of contact for these certifications"
      ]
    },
    {
      id: "application-prep",
      name: "Application Preparation",
      timeline: "Weeks 4–10",
      description: "Prepare the complete I-918 (U visa) or I-914 (T visa) application package.",
      keyActions: [
        {
          text: "Prepare Form I-918 (U visa) or I-914 (T visa) with complete supporting evidence",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Attach the signed I-918B or I-914B certification from the LEA",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare personal statement from the client describing the crime, the harm, and their cooperation",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare waiver application (Form I-192) for any grounds of inadmissibility — criminal history, immigration violations",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare derivative petitions (I-918A or I-914A) for qualifying family members",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The personal statement is critical for both U and T visas. It should describe: what happened, how the client was victimized, any fear or threats they experienced, and how they cooperated with law enforcement despite that fear. Trauma-informed writing is essential — the narrative should convey the reality of what the client experienced.",
      pitfalls: [
        "Filing without an I-192 waiver when one is needed — USCIS will deny without a waiver for inadmissible applicants",
        "Weak personal statement — USCIS adjudicators need to understand the victimization experience in specific, credible detail",
        "Not filing derivative petitions simultaneously — family members can lose status if derivative petitions are not filed together"
      ]
    },
    {
      id: "waitlist-bona-fide",
      name: "Waitlist & Bona Fide Determination",
      timeline: "After filing",
      description: "Manage the multi-year wait for U visa adjudication and maximize benefits during the wait.",
      keyActions: [
        {
          text: "Track USCIS waitlist notices — clients receive waitlist placement notices acknowledging their pending petition",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Apply for bona fide determination and work authorization (EAD) once USCIS issues the bona fide determination",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request deferred action for clients on the U visa waitlist — protects from removal while waiting",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Monitor for RFEs (Requests for Evidence) and respond promptly — missed RFE deadlines result in denial",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Update the file if contact information changes — USCIS notices go to the address on file and missed notices are the #1 reason for denial",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Explain the timeline clearly: U visas take 4–6 years to adjudicate due to the annual cap. However, once on the waitlist, your client will receive deferred action and can apply for work authorization — so they will be able to work legally while waiting. The wait is long but the protection starts immediately.",
      pitfalls: [
        "Not monitoring for USCIS correspondence during the wait — clients move and miss critical notices, resulting in denial",
        "Not applying for the bona fide determination and EAD — clients can work legally during the wait and this benefit is overlooked",
        "Client falling out of cooperation — U visa requires continued willingness to cooperate; a refusal to cooperate during the wait period can result in revocation"
      ]
    },
    {
      id: "green-card",
      name: "Adjustment of Status (Green Card)",
      timeline: "3 years after U visa approval",
      description: "After 3 years in U visa status with continuous presence, file for a green card.",
      keyActions: [
        {
          text: "File I-485 (Adjustment of Status) after 3 years of continuous presence in U visa status",
          priority: "critical",
          deadline: "Eligible after 3 years in U nonimmigrant status",
          type: "attorney"
        },
        {
          text: "Obtain law enforcement certification confirming continued cooperation",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Document continuous presence in the U.S. during the 3-year period",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Screen for any new grounds of inadmissibility that arose since the U visa was granted",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Advise your client now (at the beginning of the process) that after 3 years in U visa status they can apply for a green card. This is the long-term goal. They must maintain continuous presence in the U.S. and continued willingness to cooperate with law enforcement throughout the 3-year period.",
      pitfalls: [
        "Client traveling outside the U.S. during the 3-year U visa period without advance parole — this can break continuous presence and jeopardize the green card",
        "Not maintaining the LEA relationship — another certification is required for the green card application",
        "Not filing the green card application promptly at the 3-year mark"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "U Visa Annual Cap & Waitlist",
      variations: [
        {
          states: ["ALL"],
          note: "10,000 U visas per year (principal petitioners). Derivatives are uncapped. When the cap is reached, USCIS places eligible petitioners on a waitlist and issues deferred action + work authorization. Average wait: 4–6 years. File as early as possible."
        }
      ]
    },
    {
      topic: "Certifying Agencies",
      variations: [
        {
          states: ["CA"],
          note: "California AB 1987 (2022): state agencies must respond to U/T visa certification requests within 90 days and cannot deny based solely on the applicant's criminal history. Significant improvement in certification rates for victims with prior convictions."
        },
        {
          states: ["NY"],
          note: "New York City: NYPD, DA offices, and the NYC Human Resources Administration are active certifiers. NYC has a specialized U/T visa unit in the DA's office in some boroughs."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance"],
  tags: ["U visa", "T visa", "crime victim", "trafficking", "LEA certification", "I-918", "I-914", "work authorization", "EAD"]
};
