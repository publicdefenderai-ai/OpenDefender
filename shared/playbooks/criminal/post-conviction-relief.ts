import type { Playbook } from "../schema";

export const postConvictionReliefPlaybook: Playbook = {
  id: "post-conviction-relief",
  category: "criminal",
  name: "Post-Conviction Relief & Record Clearing",
  tagline: "A conviction is not always the end — expunge, seal, and restore",
  overview: "Post-conviction relief encompasses a wide range of remedies for clients who have already been convicted: expungement and record sealing to remove the conviction from background checks, Padilla motions to vacate pleas where immigration consequences were not properly explained, ineffective assistance of counsel claims, sentence modifications, and compassionate release petitions. These cases are not glamorous, but they change lives — a cleared record can unlock employment, housing, education, and immigration options that were previously unavailable.",
  typicalTimeline: "2–18 months",
  difficultyLevel: "intermediate",
  keyConsiderations: [
    "Expungement and sealing are state-by-state and charge-specific — eligibility varies enormously. Research the exact statute for the specific conviction in the specific state.",
    "A Padilla motion to vacate (based on failure to advise of immigration consequences) requires acting quickly after learning of the consequences — and the client must have both deficient advice AND prejudice (would have changed the plea).",
    "Ineffective assistance of counsel (IAC) under Strickland v. Washington (1984) requires (1) deficient performance and (2) prejudice. IAC claims are difficult but viable when counsel failed to investigate key evidence, advise on immigration consequences, or file critical motions.",
    "Habeas corpus (state and federal) has strict procedural rules — exhaustion requirements, deadlines (AEDPA 1-year limit for federal habeas), and procedural default rules. These are land mines for the unwary.",
    "Certificate of Rehabilitation (California), Pardon, and Restoration of Rights programs exist in many states and can remove collateral consequences even when expungement is unavailable.",
    "Compassionate release (federal 18 U.S.C. § 3582(c)(1)(A)): post-First Step Act, courts have dramatically expanded the grounds for compassionate release — age, health, family circumstances, and rehabilitation all count."
  ],
  stages: [
    {
      id: "case-assessment",
      name: "Post-Conviction Assessment",
      timeline: "Days 1–14",
      description: "Identify all available forms of post-conviction relief and prioritize by impact and eligibility.",
      keyActions: [
        {
          text: "Obtain the full conviction record: charging document, plea colloquy transcript, sentencing transcript, and court docket",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research expungement/sealing eligibility: is the offense eligible? How long must the client wait? Is probation complete?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess Padilla claim: was the client warned of immigration consequences before the plea? Would they have changed their plea if warned?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Assess IAC claim: did counsel fail to investigate, file motions, advise on plea options, or consult experts?",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For federal clients: assess compassionate release eligibility (age, health, family circumstances, time served)",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Identify the client's immediate priority: employment? Housing? Immigration? Firearm rights? This guides which relief to pursue first",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "Ask your client: 'What is the conviction preventing you from doing right now?' Employment, housing applications, professional licensing, immigration, child custody — the answer tells you which relief to prioritize. Not all relief solves all problems — a state expungement does not clear a federal record.",
      pitfalls: [
        "Assuming an expungement will solve the client's specific problem — federal agencies, law enforcement employers, and immigration courts access records that state expungements do not clear",
        "Missing the Padilla claim deadline — courts impose timeliness requirements on collateral attacks; file promptly after learning of the immigration consequences",
        "Not identifying all available relief — a client may be eligible for expungement AND a certificate of rehabilitation AND a pardon, each removing different barriers"
      ]
    },
    {
      id: "expungement-sealing",
      name: "Expungement & Record Sealing",
      timeline: "Weeks 2–12",
      description: "File for expungement or sealing under the applicable state statute.",
      keyActions: [
        {
          text: "Confirm eligibility: offense type (felony vs. misdemeanor), waiting period, probation completion, no subsequent convictions",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "File petition for expungement/sealing in the court of conviction",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare declaration from client explaining rehabilitation and the impact of the conviction on employment/housing",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Serve prosecution — some jurisdictions allow prosecution to object",
          priority: "high",
          type: "attorney"
        },
        {
          text: "After grant: send certified copy of the order to the relevant reporting agencies (FBI, state DOJ, court clerk)",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      clientGuidance: "After an expungement is granted, advise your client to: (1) get certified copies of the expungement order, (2) run a background check in 30 days to confirm the record has been cleared, and (3) understand which databases the expungement does NOT clear (federal background checks for firearms, certain licensing boards, immigration).",
      pitfalls: [
        "Filing for expungement before the waiting period has elapsed — the petition will be denied and may not be re-filed for months",
        "Not following up after the order is granted — agencies do not automatically update their records; active follow-up is required",
        "Telling the client the expungement clears everything — federal firearms background checks, immigration, and certain licensing boards may still access the record"
      ]
    },
    {
      id: "padilla-vacatur",
      name: "Padilla Motion to Vacate",
      timeline: "Weeks 2–16",
      description: "Vacate a guilty plea entered without proper immigration consequences advice.",
      keyActions: [
        {
          text: "Obtain the plea colloquy transcript — was the client warned about immigration consequences?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Document what immigration advice (if any) the client received — was it wrong, incomplete, or missing?",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Establish prejudice: prepare declaration from client stating they would have rejected the plea if properly advised",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Research whether an immigration-safe plea was available — if so, this strengthens prejudice",
          priority: "high",
          type: "attorney"
        },
        {
          text: "File motion to vacate in the criminal court that accepted the plea",
          priority: "critical",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-to-withdraw-plea",
          name: "Motion to Withdraw Plea",
          relevance: "Formal motion to vacate a guilty plea on grounds of inadequate Padilla advisement"
        }
      ],
      clientGuidance: "Explain to your client that a Padilla motion is not guaranteed to succeed — they must show (1) the prior lawyer's advice was wrong or missing, AND (2) they would have rejected the plea if properly advised. The second element requires a credible, specific declaration.",
      pitfalls: [
        "Filing a Padilla motion without a clear record of what advice was given — get the plea transcript first",
        "Weak prejudice declaration — 'I would have gone to trial' is insufficient without a plausible defense or an available immigration-safe plea alternative",
        "Not coordinating with immigration counsel — the Padilla motion in criminal court must be coordinated with the immigration case strategy"
      ]
    },
    {
      id: "iac-habeas",
      name: "IAC & Habeas Corpus",
      timeline: "Months 3–18",
      description: "Pursue ineffective assistance of counsel claims or habeas corpus where the conviction was fundamentally unfair.",
      keyActions: [
        {
          text: "Identify specific IAC failures: failure to investigate alibi, failure to file suppression motion, failure to advise on plea, failure to consult experts",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Obtain the trial attorney's file — it may reveal investigation failures or missed issues",
          priority: "high",
          type: "attorney"
        },
        {
          text: "For federal habeas under § 2254/§ 2255: calculate the AEDPA one-year deadline — it begins running from different trigger dates",
          priority: "critical",
          deadline: "AEDPA 1-year deadline — calculate immediately",
          type: "attorney"
        },
        {
          text: "Exhaust state court remedies before filing federal habeas — failure to do so results in procedural default",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "For sentence modifications: research post-First Step Act retroactive application, Amendments to USSG, or state equivalents",
          priority: "standard",
          type: "attorney"
        }
      ],
      relevantTemplates: [],
      pitfalls: [
        "Missing the AEDPA 1-year federal habeas deadline — this is a hard jurisdictional bar in most circuits",
        "Failing to exhaust state court remedies before federal habeas — procedural default will bar the claim",
        "Framing an IAC claim without specificity — generic 'counsel was ineffective' claims fail; identify the specific act or omission and the specific prejudice"
      ]
    },
    {
      id: "compassionate-release",
      name: "Compassionate Release & Sentence Modification",
      timeline: "Months 2–12",
      description: "Pursue early release for incarcerated clients who qualify under expanded compassionate release grounds.",
      keyActions: [
        {
          text: "Submit request to the BOP warden first — exhaustion is required before filing in court (30-day waiting period)",
          priority: "critical",
          deadline: "File with BOP before court filing; 30-day waiting period applies",
          type: "attorney"
        },
        {
          text: "Document 'extraordinary and compelling' reasons: serious health condition, age (70+), terminal illness, caregiver of minor children",
          priority: "critical",
          type: "attorney"
        },
        {
          text: "Prepare rehabilitation evidence: educational programs, vocational training, clean disciplinary record, letters of support",
          priority: "high",
          type: "attorney"
        },
        {
          text: "Develop a reentry plan: housing, employment, family support, supervision — courts want to see a viable release plan",
          priority: "high",
          type: "attorney"
        }
      ],
      relevantTemplates: [
        {
          templateId: "motion-for-sentence-modification",
          name: "Motion for Sentence Modification",
          relevance: "Formal motion for compassionate release or sentence reduction under 18 U.S.C. § 3582"
        }
      ],
      clientGuidance: "Compassionate release is won or lost on two things: (1) documenting the extraordinary and compelling reason (medical records, age documentation, family circumstances), and (2) presenting a credible reentry plan. The court needs to believe the client will not reoffend and has a stable place to go.",
      pitfalls: [
        "Filing in court without first exhausting BOP administrative remedies — courts will dismiss for failure to exhaust",
        "Weak reentry plan — courts deny compassionate release where the client has no housing, no support system, and no supervision plan",
        "Not developing the rehabilitation record — certificates of completion, GED, vocational training, and clean discipline record are all critical"
      ]
    }
  ],
  jurisdictionNotes: [
    {
      topic: "Expungement Eligibility by State",
      variations: [
        {
          states: ["CA"],
          note: "California PC § 1203.4: expungement (dismissal) available after probation completion for most misdemeanors and felonies. Does NOT seal the record — it is still visible to law enforcement, licensing boards, and immigration. PC § 851.8 and § 851.87 provide separate arrest record sealing."
        },
        {
          states: ["NY"],
          note: "New York CPL § 160.59: sealing (not expungement) available for up to 2 convictions (one felony) after 10-year clean period. Record sealed from public but accessible to law enforcement. Marijuana conviction sealing available under separate statute."
        },
        {
          states: ["TX"],
          note: "Texas: expunction (complete destruction of records) available for arrests not leading to conviction, certain deferred adjudications, and specific offenses. Nondisclosure (sealing) available for more offenses. Two separate legal procedures."
        },
        {
          states: ["PA"],
          note: "Pennsylvania Clean Slate Law (2018): automatic sealing of misdemeanor-2/3 convictions after 10 years with no reoffending. Petition-based sealing available for other offenses. Limited expungement for summary offenses and ARD completions."
        }
      ]
    }
  ],
  relatedTemplateIds: ["motion-to-withdraw-plea", "motion-for-sentence-modification"],
  tags: ["expungement", "record sealing", "Padilla", "post-conviction", "IAC", "habeas corpus", "compassionate release", "vacatur", "record clearing"]
};
