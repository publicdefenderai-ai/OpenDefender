import type { Playbook } from "../schema";

export const vawaPlaybook: Playbook = {
  id: "vawa-self-petition",
  category: "immigration",
  name: "VAWA Self-Petition",
  tagline: "Escape abuse without losing your immigration status",
  overview: "The Violence Against Women Act (VAWA) allows certain abused noncitizens to self-petition for immigration status without the abuser's knowledge or cooperation. This is a confidential process — USCIS is prohibited by law from disclosing information about a VAWA petition to the abuser. Qualifying applicants include spouses, children, and parents of abusive U.S. citizens or lawful permanent residents. VAWA self-petition approval grants the client a pathway to a green card independent of the abuser. This playbook covers VAWA self-petitions and the related VAWA-based cancellation of removal in immigration court.",
  typicalTimeline: "12–36 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "VAWA is strictly confidential — USCIS may not disclose the existence or contents of a VAWA petition to the abuser. Advise clients that the process is completely hidden from their abuser.",
    "The abuser must be a U.S. citizen or lawful permanent resident for the petition to qualify. Undocumented abusers do not trigger VAWA self-petition eligibility (though they may trigger other remedies).",
    "Good faith marriage: for spousal petitions, the applicant must have entered the marriage in good faith — not for immigration purposes. The fact that immigration benefits resulted from the marriage does not defeat good faith.",
    "Good moral character: the applicant must demonstrate good moral character during the 3-year period preceding the petition. Minor criminal history can often be overcome with a waiver.",
    "Primary residence: the applicant must have resided with the abuser at some point. Cohabitation does not need to be continuous — it can be brief.",
    "VAWA cancellation: clients in removal proceedings who cannot self-petition may qualify for VAWA-based cancellation of removal (3 years of continuous presence, good moral character, extreme cruelty or battery)."
  ],
  stages: [
    {
      id: "eligibility-screening",
      name: "Confidential Eligibility Screening",
      timeline: "Days 1–7",
      description: "Screen for VAWA eligibility in a safe, confidential setting.",
      keyActions: [
        {
          text: "Conduct screening in a confidential, private setting — the abuser must never learn of the VAWA process",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Confirm the abuser's immigration status: U.S. citizen or LPR? This is the threshold requirement",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Confirm the qualifying relationship: spouse, child, or parent of the abuser",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Document cohabitation: did the applicant ever live with the abuser, even briefly?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess good faith marriage: was the marriage entered in good faith, not solely for immigration purposes?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Screen for good moral character issues: criminal history in the past 3 years",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Assess safety plan: is the client safe? Are they still living with the abuser?",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Assure your client: this process is completely confidential. USCIS by law cannot tell the abuser that this petition was filed. The client's safety does not depend on the abuser not finding out through USCIS — only through the client's own social circle. Create a safety plan together.",
      pitfalls: [
        "Allowing any communication about the VAWA process to occur through shared email, phone, or home computer — the abuser may have access",
        "Not assessing the client's immediate safety — a client still living with an abusive LPR or USC may be in danger",
        "Failing to confirm the abuser's immigration status — undocumented abusers do not trigger VAWA eligibility"
      ]
    },
    {
      id: "evidence-gathering",
      name: "Evidence Gathering",
      timeline: "Weeks 2–8",
      description: "Document the abuse, the relationship, and the applicant's good character.",
      keyActions: [
        {
          text: "Obtain documentation of abuse: police reports, protective orders, medical records, photos of injuries, DV shelter records",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather evidence of the qualifying relationship: marriage certificate, birth certificate of children, photos together",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Gather evidence of cohabitation: utility bills, lease, bank statements, mail addressed to shared residence",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain the abuser's proof of status: copy of their citizenship certificate, naturalization certificate, or green card",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain personal declaration from the applicant describing the abuse in detail",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain corroborating declarations from witnesses: neighbors, family, friends, clergy, DV advocates who observed the abuse or its effects",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Obtain evidence of good moral character: employment history, community involvement, letters from community members",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "The personal declaration is the heart of the VAWA petition. It should describe: how the relationship began, when the abuse started, specific incidents of abuse (dates, what happened, injuries sustained), any threats made, any times the police were called, and how the abuse affected the client and any children.",
      pitfalls: [
        "Thin abuse documentation — USCIS adjudicators want corroboration beyond the applicant's own declaration; police reports, medical records, and witness statements are essential",
        "Not gathering the abuser's proof of immigration status — without proof the abuser is a USC or LPR, the petition cannot be approved",
        "Not addressing good moral character issues proactively — minor criminal history can be overcome but only if addressed, not hidden"
      ]
    },
    {
      id: "petition-filing",
      name: "Self-Petition Filing",
      timeline: "Weeks 4–10",
      description: "File the I-360 self-petition with USCIS's Vermont Service Center (dedicated VAWA unit).",
      keyActions: [
        {
          text: "File Form I-360 ONLY with USCIS Vermont Service Center — this is the dedicated VAWA unit with confidentiality protections",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File with complete supporting documentation — incomplete petitions are returned and require re-filing",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Request a fee waiver (Form I-912) if the client cannot afford filing fees — VAWA fee waivers are routinely granted",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File I-192 waiver for any grounds of inadmissibility, including criminal history and unlawful presence",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Do NOT file with any other USCIS service center — other offices do not have VAWA confidentiality protocols",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "After filing, USCIS will send a 'prima facie' determination letter within approximately 90 days if the petition appears approvable. This letter can be used to access certain public benefits. Keep this letter in a safe place the abuser cannot access.",
      pitfalls: [
        "Filing the I-360 at the wrong USCIS service center — only the Vermont Service Center has the VAWA confidentiality unit",
        "Not requesting a fee waiver — many survivors cannot afford USCIS fees and waivers are readily available",
        "Not addressing inadmissibility grounds — criminal history, unlawful presence, and prior removals all require waivers"
      ]
    },
    {
      id: "prima-facie-benefits",
      name: "Prima Facie Determination & Benefits",
      timeline: "3–6 months after filing",
      description: "Use the prima facie determination to access available benefits while the petition is adjudicated.",
      keyActions: [
        {
          text: "Obtain the prima facie determination letter from USCIS — this is issued when the petition appears approvable",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Use the prima facie letter to access public benefits: certain TANF, food stamps, and Medicaid programs",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Connect client with DV shelter, legal services, and economic support resources during the wait",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Monitor for USCIS RFEs — respond promptly and completely",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Not telling the client about the prima facie letter — it unlocks benefits that DV survivors urgently need",
        "Missing USCIS RFEs — these are mailed and if the client has moved, they may be missed"
      ]
    },
    {
      id: "approval-and-green-card",
      name: "Approval & Green Card",
      timeline: "12–36 months after filing",
      description: "After I-360 approval, pursue the green card through adjustment of status or consular processing.",
      keyActions: [
        {
          text: "After I-360 approval: check visa availability — immediate relatives of USCs can adjust immediately; LPR family petitions wait for a priority date",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File I-485 (Adjustment of Status) if a visa is immediately available and the client is eligible",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For VAWA cancellation: if in removal proceedings, convert to VAWA-based cancellation claim before the IJ",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Advise client on divorce from abuser: divorce does not automatically terminate an approved VAWA petition if the abuse is documented",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "notice-of-appearance",
          name: "Notice of Appearance (EOIR-28)",
          relevance: "File if the client is in removal proceedings and pursuing VAWA-based cancellation of removal"
        }
      ],
      clientGuidance: "Advise your client that an approved I-360 is only the first step — it is an approved petition, not a green card. The green card application (I-485) comes next. If the abuser is an LPR (not a USC), there may be a wait for a visa to become available. This can take several years for spouses of LPRs.",
      pitfalls: [
        "Client divorcing the abuser and believing the VAWA petition is voided — it is not voided if filed before the divorce becomes final and the abuse is documented",
        "Not converting to VAWA cancellation in removal proceedings — clients in court have an additional pathway that requires different documentation",
        "Failing to advise on the green card step — approval of the I-360 does not automatically grant LPR status"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "VAWA Confidentiality",
      variations: [
        {
          states: ["ALL"],
          note: "INA § 239(e) and 8 U.S.C. § 1367 strictly prohibit USCIS from disclosing information about a VAWA petition to the abuser or anyone adverse to the petitioner. This is a categorical prohibition. Any USCIS employee who violates it is subject to criminal penalties. The petitioner's safety is protected by statute."
        }
      ]
    },
    {
      topic: "VAWA Cancellation of Removal",
      variations: [
        {
          states: ["ALL"],
          note: "VAWA cancellation (INA § 240A(b)(2)) is available in immigration court to battered spouses, children, and parents of USCs or LPRs who have been continuously present for 3 years, have good moral character, and have suffered battery or extreme cruelty. This is a separate process from the I-360 self-petition and can be pursued simultaneously. The 3-year requirement is shorter than the 10-year non-LPR cancellation standard."
        }
      ]
    }
  ],
  relatedTemplateIds: ["notice-of-appearance", "motion-for-continuance-eoir"],
  tags: ["VAWA", "domestic violence", "self-petition", "I-360", "battered spouse", "confidential", "abuse", "green card", "VAWA cancellation"]
};
