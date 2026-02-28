import type { Playbook } from "../schema";

export const adjustmentOfStatusPlaybook: Playbook = {
  id: "adjustment-of-status",
  category: "immigration",
  name: "Adjustment of Status (Green Card)",
  tagline: "From lawful presence to permanent residence — close the gap",
  overview: "Adjustment of Status (AOS) allows eligible noncitizens who are already inside the United States to apply for lawful permanent residence (a 'green card') without leaving the country. This is a critical pathway for clients who entered lawfully, overstayed visas, have qualifying U.S. citizen or LPR family members, or are the beneficiaries of approved employment-based petitions. The case depends on three pillars: (1) an approved immigrant petition (I-130, I-140, I-360, etc.), (2) an immediately available visa number, and (3) admissibility or the ability to waive inadmissibility grounds.",
  typicalTimeline: "12 months to 5+ years (visa availability dependent)",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Visa availability is the most common bottleneck — check the monthly DOS Visa Bulletin for the client's priority date and preference category before advising on timing.",
    "Inadmissibility bars: prior unlawful presence (3-year and 10-year bars), criminal history (CIMTs, drug offenses, aggravated felonies), fraud, and health grounds can all block AOS. Screen comprehensively before filing.",
    "INA § 245(i): certain clients who entered without inspection or overstayed may still adjust under § 245(i) if a qualifying petition was filed before April 30, 2001.",
    "Advance parole: once AOS is filed, the client must not travel outside the U.S. without advance parole (Form I-131). Departure without advance parole abandons the pending AOS application.",
    "The one-year asylum filing bar applies to asylum-based AOS — if the client's asylum case includes a one-year bar issue, address it in the AOS.",
    "Public charge: USCIS may deny AOS if the applicant is likely to become a public charge. Prepare financial documentation and, if needed, a joint sponsor affidavit of support."
  ],
  stages: [
    {
      id: "eligibility-assessment",
      name: "Eligibility & Visa Availability",
      timeline: "Days 1–14",
      description: "Confirm the client has an approved petition and a current priority date before filing.",
      keyActions: [
        {
          text: "Confirm the basis for adjustment: family-based (I-130), employment-based (I-140), asylum (I-485 based on grant), U visa (3 years), diversity visa, or special immigrant",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Check the current Visa Bulletin: is the client's priority date current in the Final Action Dates chart?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for all grounds of inadmissibility: criminal history, unlawful presence, prior removal orders, fraud, health",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Confirm the client has been inspected and admitted or paroled into the U.S. (§ 245(a) requirement)",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Check for § 245(i) eligibility if client entered without inspection",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify all waivers needed and assess likelihood of approval",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client to bring all immigration documents they have ever received: visa, I-94, I-797 approval notices, prior USCIS correspondence, passport stamps. These documents establish their entry history and lawful presence, which are foundational to the AOS.",
      pitfalls: [
        "Filing before the priority date is current — USCIS will reject an AOS application filed with a non-current date",
        "Not checking both charts in the Visa Bulletin — some categories allow filing when the date is current in the 'Dates for Filing' chart, not just 'Final Action Dates'",
        "Missing an inadmissibility ground in the screening — a ground discovered after filing leads to denial and possible enforcement action"
      ]
    },
    {
      id: "petition-filing",
      name: "Petition Filing & Priority Date",
      timeline: "Weeks 2–8",
      description: "File the underlying immigrant petition if not already approved, and strategize on priority date management.",
      keyActions: [
        {
          text: "If no approved petition: file I-130 (family), I-140 (employment), or other underlying petition simultaneously with AOS if eligible",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For family-based: confirm the petitioner's status (USC vs. LPR) — immediate relatives of USCs have no priority date wait",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client on priority date implications — if in a preference category, they may wait years for a current date",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Explore whether filing with the 'Dates for Filing' chart (if DOS activates it) allows early filing for work authorization",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Not knowing the difference between immediate relative categories (no wait) and preference categories (years-long waits)",
        "Not monitoring the Visa Bulletin monthly — priority date movement can open a filing window without warning"
      ]
    },
    {
      id: "application-preparation",
      name: "AOS Application Preparation",
      timeline: "Weeks 4–10",
      description: "Prepare the complete I-485 package with all supporting evidence and waivers.",
      keyActions: [
        {
          text: "Prepare Form I-485 with all required civil documents: birth certificate, marriage certificate, police clearances",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File Form I-864 (Affidavit of Support) from the petitioner — income must meet 125% of federal poverty guideline",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Schedule medical examination (Form I-693) with a USCIS-designated civil surgeon — schedule early as wait times are long",
          priority: "critical",
          deadline: "Schedule immediately — civil surgeon wait times can be months",
          type: "attorney"
        },
        {
          text: "File I-131 (Advance Parole) simultaneously — client cannot travel without it while AOS is pending",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File I-765 (EAD) simultaneously — client can work legally while AOS is pending",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Prepare any required waivers: I-601 or I-601A for unlawful presence, I-212 for prior removal",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The medical examination is one of the most time-consuming parts of the AOS process. The civil surgeon examination includes a physical exam, required vaccinations, and lab tests. Results are sealed and submitted directly to USCIS. Schedule this as early as possible — civil surgeon appointments can take months to obtain.",
      pitfalls: [
        "Client traveling outside the U.S. after filing I-485 without advance parole — this abandons the pending application",
        "Late medical exam — the I-693 has a limited validity period; a stale exam must be redone",
        "Not filing the I-864 Affidavit of Support or filing one with insufficient income — USCIS will deny for public charge"
      ]
    },
    {
      id: "biometrics-interview",
      name: "Biometrics & USCIS Interview",
      timeline: "Months 4–18",
      description: "Complete biometrics and prepare for the AOS interview.",
      keyActions: [
        {
          text: "Attend biometrics appointment — reschedule if client cannot attend, but do not miss without rescheduling",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare client for the AOS interview: review the application, practice common questions, prepare documents",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather all original documents to bring to the interview: passport, I-94, birth certificate, marriage certificate, tax returns",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For marriage-based AOS: prepare extensive evidence of bona fide marriage — joint bank accounts, shared lease, photos, communications",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "If additional evidence has been requested (RFE): respond timely and completely",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Prepare your client for the interview by role-playing the questions. Marriage-based interviews can be very detailed: how did you meet, describe your wedding, who pays which bills, describe your home. Inconsistency between spouses' answers — even innocent inconsistency — can lead to denial. Practice together.",
      pitfalls: [
        "Not preparing for the marriage-based interview — USCIS interviews couples separately and looks for inconsistencies that suggest fraud",
        "Missing the biometrics appointment without rescheduling — this can result in abandonment of the application",
        "Responding to an RFE without legal help — RFEs are often technical and a poor response results in denial"
      ]
    },
    {
      id: "approval-and-conditions",
      name: "Approval, Conditions & Naturalization",
      timeline: "After approval",
      description: "Advise on conditional residence (if applicable), removal of conditions, and the path to naturalization.",
      keyActions: [
        {
          text: "If approved with conditions (married less than 2 years): advise client to file I-751 to remove conditions 90 days before the 2-year conditional green card expires",
          priority: "critical",
          deadline: "File I-751 in the 90-day window before 2-year anniversary",
          type: "attorney"
        },
        {
          text: "Advise client on travel restrictions as a new LPR: lengthy absences can break continuous residence for naturalization",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Advise on naturalization eligibility: 5 years as LPR (3 years if married to USC), continuous residence, physical presence, good moral character",
          priority: "standard",
          type: "attorney"
        },
        {
          text: "Advise on selective service registration obligation for male LPRs between 18 and 26",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Congratulate your client but give them this critical warning: as a new permanent resident, extended trips outside the U.S. (generally over 6 months) can break the continuous residence required for naturalization — and trips over 1 year can trigger abandonment of LPR status. Carry proof of LPR status at all times.",
      pitfalls: [
        "Missing the I-751 deadline for conditional residents — failure to file removes conditions results in automatic termination of LPR status",
        "Client taking extended trips that break continuous residence without re-entry permits",
        "Not advising on naturalization timeline — many clients don't realize they can naturalize after 3 or 5 years"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Section 245(i) Eligibility",
      variations: [
        {
          states: ["ALL"],
          note: "INA § 245(i) allows persons who entered without inspection or violated their status to adjust status if: (1) they are the beneficiary of a petition or labor certification filed on or before April 30, 2001, AND (2) if filed after Jan 14, 1998, they were physically present in the U.S. on December 21, 2000. The petitioner need not be the current sponsor — derivation through family is possible."
        }
      ]
    },
    {
      topic: "USCIS Field Office Processing Times",
      variations: [
        {
          states: ["CA", "TX", "FL", "NY", "IL"],
          note: "USCIS field office interview wait times vary dramatically by location. Chicago, Los Angeles, and Miami field offices have historically had wait times of 18–36 months. Check USCIS.gov processing times for the specific field office and adjust client expectations accordingly."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance"],
  tags: ["adjustment of status", "green card", "I-485", "LPR", "lawful permanent residence", "family-based immigration", "Visa Bulletin", "advance parole", "EAD"]
};
