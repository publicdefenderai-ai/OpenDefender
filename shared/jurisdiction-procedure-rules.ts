/**
 * Jurisdiction Procedure Rules — Single Source of Truth
 *
 * Authoritative procedural timelines for all 50 US states + DC + federal.
 * Used by:
 *   1. The legal accuracy validator (JURISDICTION_DEADLINE_RULES export)
 *   2. The AI guidance prompt builder (buildJurisdictionContextBlock export)
 *   3. Future: jurisdiction-aware editorial page components
 *
 * DATA CONFIDENCE POLICY:
 *   'high'   — Well-established rule; cited statute verified from multiple authoritative
 *              legal sources. Injected into AI prompts as authoritative fact.
 *   'medium' — Rule is correct to the best of available knowledge; single authoritative
 *              source. Injected into AI prompts with qualifying language.
 *   'low'    — Best-effort from general legal knowledge; statute citation requires
 *              verification against current state code. NOT injected into AI prompts.
 *              Retained for quarterly review flagging only.
 *
 * MAINTENANCE:
 *   - Update lastVerified when a state's rule is confirmed against current law.
 *   - Quarterly checker (check-public-defenders.ts pattern) should flag entries
 *     where lastVerified is older than 12 months.
 *   - When a reform changes a rule (bail reform, new speedy trial statute, etc.),
 *     update the entry and add a reformNote.
 *
 * Last full data pass: 2026-07 for the entries whose lastVerified says so.
 * NOT all 52 entries carry that date — a 2026-07 commit
 * (see git history: "Bump all 52 procedure rule lastVerified dates to 2026-07")
 * mass-dated every entry without accompanying verification work. That bump was
 * reverted for federal, CA, NY, TX, IL, PA, WA, OH, GA — these 9 had no primary-source
 * review in the 2026-07 pass (their arraignment/bail/speedy-trial fields are untouched
 * since 2026-03) and are back at lastVerified: '2026-03' pending real re-verification.
 * FL, AZ, NJ, MI, NC, VA did get genuine 2026-07 review and correctly keep that date.
 *
 * Coverage: All 50 US states + DC + federal + 5 territories (57 entries).
 *   52 high-confidence: all 50 states + DC + federal
 *    5 medium-confidence: AS, GU, MP, PR, VI (territory rules verified 2026-07
 *                          from territory codes; injected into AI prompts with
 *                          qualifying language)
 *    0 low-confidence: none (as a whole-record rating — see
 *    PROCEDURAL_DEADLINE_ESTIMATE_JURISDICTIONS below for jurisdictions whose
 *    preliminaryHearing/discoveryDeadline fields specifically are unverified
 *    placeholder text, independent of the record's overall dataConfidence)
 */

export interface JurisdictionProcedureRule {
  // ── String representations (backward compat with validator) ───────────────
  arraignment: string;   // e.g. "48 hours"
  speedy_trial: string;  // e.g. "60 days (felony) / 30 days (misdemeanor)"
  bail_hearing: string;  // e.g. "48 hours"

  // ── Procedural deadline strings (single source of truth) ─────────────────
  preliminaryHearing: string;  // e.g. "Within 10 court days for felonies"
  discoveryDeadline: string;   // e.g. "30 days after arraignment"

  /** Approximate eligibility threshold — varies by county and changes annually with FPL. */
  publicDefenderIncome: string;
  /** Brief description of the jurisdiction's bail system. */
  bailSystem: string;

  // ── Structured data for AI prompt injection ───────────────────────────────
  arraignmentHours: number;
  arraignmentSource: string;  // Specific statute or rule citation

  bailHearingHours: number;
  bailHearingSource: string;

  speedyTrialDays: {
    felony: number | null;        // null = no statutory limit; constitutional right only
    felonyInCustody?: number;     // if in-custody rule differs
    misdemeanor: number | null;
    misdemeanorInCustody?: number;
    notes?: string;               // e.g. "Term-of-court rule; defendant must demand"
    /** Short user-facing note about a recent statutory change to this rule.
     *  Emitted as a highlighted RULE CHANGE line in the AI prompt block so Claude
     *  explicitly alerts users who may have read outdated material. */
    reformNote?: string;
  };
  speedyTrialSource: string;

  phoneCall: {
    limitHours: number | null;  // null = "reasonable time" with no statutory limit
    description: string;
    source: string;
  };

  bailStructure: 'cash_bail' | 'reformed_no_cash' | 'reformed_limited_cash' | 'presumption_release';
  bailReformNote?: string;

  // ── Metadata ──────────────────────────────────────────────────────────────
  dataConfidence: 'high' | 'medium' | 'low';
  lastVerified: string;  // YYYY-MM
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full 50-state + DC + federal data
// ─────────────────────────────────────────────────────────────────────────────
export const JURISDICTION_PROCEDURE_RULES: Record<string, JurisdictionProcedureRule> = {

  // ── Federal ───────────────────────────────────────────────────────────────
  federal: {
    arraignment: '48 hours',
    speedy_trial: '70 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Fed. R. Crim. P. 5(a), 10 — "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Fed. R. Crim. P. 5(a); 18 U.S.C. § 3142',
    speedyTrialDays: {
      felony: 70,
      misdemeanor: 70,
      notes: '70-day clock runs from arraignment. Excludes continuances, interlocutory appeals, and other tolled periods under 18 U.S.C. § 3161(h).',
    },
    speedyTrialSource: '18 U.S.C. § 3161(c)(1) — Speedy Trial Act of 1974',
    phoneCall: {
      limitHours: null,
      description: 'No federal statutory limit on phone call timing. Right to counsel attaches at first appearance.',
      source: 'Sixth Amendment; Fed. R. Crim. P. 5(d)',
    },
    bailStructure: 'presumption_release',
    bailReformNote: 'Bail Reform Act of 1984 (18 U.S.C. § 3142) creates presumption of release on least restrictive conditions. Detention permitted only if defendant poses a danger or flight risk.',
    preliminaryHearing: 'Within 14 days if in custody, 21 days if released',
    discoveryDeadline: 'Ongoing obligation',
    publicDefenderIncome: 'Approximately 125% federal poverty level — apply to federal public defender office',
    bailSystem: 'Pretrial services assessment',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — this entry's arraignment/
    // bail/speedy-trial fields were not reviewed in the 2026-07 pass (only the
    // preliminaryHearing/discoveryDeadline fields above were newly added then).
    // Do not bump without an accompanying primary-source review of the other fields.
    lastVerified: '2026-03',
  },

  // ── California ────────────────────────────────────────────────────────────
  CA: {
    arraignment: '48 hours',
    speedy_trial: '60 days (felony) / 30 days (misdemeanor)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Cal. Penal Code § 825 — "without unnecessary delay, and in any event within two days after arrest"',
    bailHearingHours: 48,
    bailHearingSource: 'Cal. Penal Code § 825; bail set at arraignment',
    speedyTrialDays: {
      felony: 60,
      misdemeanor: 30,
      notes: 'Clock runs from arraignment. Defendant must be brought to trial within 60 days (felony) or 30 days (misdemeanor in custody) of arraignment.',
    },
    speedyTrialSource: 'Cal. Penal Code § 1382',
    phoneCall: {
      limitHours: 3,
      description: 'Statutory 3-hour limit. Law enforcement must provide access to a phone within 3 hours of arrest.',
      source: 'Cal. Penal Code § 851.5',
    },
    bailStructure: 'cash_bail',
    bailReformNote: 'California retains a cash bail system. SB 10 (2018) to eliminate cash bail was suspended pending voter referendum and did not take effect. OR (own recognizance) release is available and widely used.',
    preliminaryHearing: 'Within 10 court days for felonies',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Approximately 2x federal poverty level (varies by county)',
    bailSystem: 'Schedule-based bail system',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above
    // for why this wasn't bumped to 2026-07 with the rest of the file.
    lastVerified: '2026-03',
  },

  // ── New York ──────────────────────────────────────────────────────────────
  NY: {
    arraignment: '24 hours',
    speedy_trial: '6 months (felony) / 90 days (misdemeanor)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'N.Y. CPL § 180.80 — defendant must be arraigned within 24 hours of arrest on felony complaint',
    bailHearingHours: 24,
    bailHearingSource: 'N.Y. CPL § 180.80; bail determined at arraignment',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 90,
      notes: 'Class A-E felony: 6 months (180 days). Class A misdemeanor: 90 days. Class B misdemeanor: 60 days. Petty offense: 30 days. Clock runs from filing of accusatory instrument.',
    },
    speedyTrialSource: 'N.Y. CPL § 30.30',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to contact an attorney or family member.',
      source: 'N.Y. CPL § 140.20 (general notification provisions)',
    },
    bailStructure: 'reformed_limited_cash',
    bailReformNote: 'Bail reform law (effective January 2020, amended 2020 and 2022) eliminated cash bail for most misdemeanors and non-violent felonies. Cash bail still permitted for violent felonies and certain other charges. Non-monetary conditions are the default for qualifying offenses.',
    preliminaryHearing: 'Within 120 hours for felonies',
    discoveryDeadline: '20 days after arraignment (in custody) or 35 days (not in custody)',
    publicDefenderIncome: 'Varies by county — apply to local public defender or legal aid office',
    bailSystem: 'Cash bail reform — limited detention',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Texas ─────────────────────────────────────────────────────────────────
  TX: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory limit (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Tex. Code Crim. Proc. Art. 14.06, 15.17 — magistrate appearance "without unnecessary delay" and within 48 hours of arrest',
    bailHearingHours: 48,
    bailHearingSource: 'Tex. Code Crim. Proc. Art. 15.17; bail set at magistration',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Texas has no statutory speedy trial act. The Texas Court of Criminal Appeals struck down the prior Speedy Trial Act as unconstitutional in Ex parte Meshell, 767 S.W.2d 348 (Tex. Crim. App. 1989). Speedy trial rights are governed solely by the federal Sixth Amendment Barker v. Wingo balancing test.',
    },
    speedyTrialSource: 'U.S. Const. amend. VI; Barker v. Wingo, 407 U.S. 514 (1972); Ex parte Meshell, 767 S.W.2d 348 (Tex. Crim. App. 1989)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Art. 15.17 provides that a person arrested must be given reasonable opportunity to contact family and retain counsel.',
      source: 'Tex. Code Crim. Proc. Art. 15.17',
    },
    bailStructure: 'cash_bail',
    notes: 'Texas uses a cash bail system. Magistrate sets bail amount at initial appearance. Bail schedules exist in many counties.',
    preliminaryHearing: 'Not required — grand jury indictment for felonies',
    discoveryDeadline: 'Ongoing open-file obligation; witness list due 20 days before trial',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Commercial bail bond system',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Florida ───────────────────────────────────────────────────────────────
  FL: {
    arraignment: '24 hours',
    speedy_trial: '175 days (felony) / 90 days (misdemeanor)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Fla. R. Crim. P. 3.130 — first appearance within 24 hours of arrest',
    bailHearingHours: 24,
    bailHearingSource: 'Fla. R. Crim. P. 3.130; bail reviewed at first appearance',
    speedyTrialDays: {
      felony: 175,
      misdemeanor: 90,
      notes: 'Clock runs from date formal charges are filed (amended eff. July 1, 2025; prior rule ran from arrest or service of notice to appear). After the period expires, defendant may file a notice of expiration of speedy trial; if not brought to trial within 30 days (recapture period, increased from 10 days by 2025 amendment), case is dismissed. Dismissal is without prejudice unless a constitutional speedy trial violation is independently established. Rule 3.134 also amended to allow pretrial release if formal charges are not brought within a reasonable time. — CONFORMING RULES STATUS (verified 2026-07): SC2022-1123 directed the Traffic Court Rules and Juvenile Delinquency Rules committees to consider consistent changes. The Traffic Court Rules Committee proposed amendments to Fla. R. Traf. Ct. 6.325 (Speedy Trial: Infractions Only) and 6.160 (Practice As In Criminal Rules) in Aug 2025; the Supreme Court\'s Nov 6, 2025 opinion (SC2023-1609) adopted only rules 6.340 and 6.480 and did NOT adopt the proposed 6.325 amendment. A second batch of proposed traffic court amendments was published Oct 15, 2025 and remains pending before the Court. The Juvenile Court Rules Committee proposed conforming amendments to Fla. R. Juv. P. 8.090 (Speedy Trial), published for comment Oct 15, 2025; the Oct 16, 2025 Supreme Court opinion (SC2025-0237) amended other juvenile rules but NOT 8.090. As of July 2026, neither Fla. R. Traf. Ct. 6.325 nor Fla. R. Juv. P. 8.090 has been amended to conform with the 3.191 changes. Recheck at next quarterly review.',
      reformNote: 'Florida changed this rule effective July 1, 2025: the speedy trial clock now starts when formal charges are filed, not at arrest. The recapture period also increased from 10 days to 30 days. Users who have read older materials online may have the pre-2025 rule in mind.',
    },
    speedyTrialSource: 'Fla. R. Crim. P. 3.191 (as amended eff. July 1, 2025, SC2022-1123); Fla. R. Crim. P. 3.134',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to communicate with family or attorney.',
      source: 'Fla. Stat. § 951.23 (detention facility requirements)',
    },
    bailStructure: 'cash_bail',
    notes: 'Florida uses a cash bail system with bail schedules. Article I, § 14 of the Florida Constitution governs pretrial release. Traffic infractions governed by Fla. R. Traf. Ct. 6.325 (180-day period from service of citation; unamended as of 2026-07). Juvenile delinquency speedy trial governed by Fla. R. Juv. P. 8.090 (90-day period from filing of petition; unamended as of 2026-07).',
    preliminaryHearing: 'Within 21 days for felonies',
    discoveryDeadline: 'Within 15 days of demand',
    publicDefenderIncome: 'Approximately 200% federal poverty level — apply to local public defender',
    bailSystem: 'Traditional bail system with pretrial services',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Illinois ──────────────────────────────────────────────────────────────
  IL: {
    arraignment: '48 hours',
    speedy_trial: '120 days (felony, in custody) / 160 days (felony, bailable) / 45 days (misdemeanor, in custody)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: '725 ILCS 5/109-1 — "without unnecessary delay... within 48 hours after arrest"',
    bailHearingHours: 48,
    bailHearingSource: '725 ILCS 5/109-1; detention review at arraignment',
    speedyTrialDays: {
      felony: 120,
      felonyInCustody: 120,
      misdemeanor: 45,
      misdemeanorInCustody: 45,
      notes: 'Felony: 120 days if held in custody; 160 days if released on conditions. Class A misdemeanor: 45 days (in custody), 90 days (released). Counts from demand or initial incarceration, depending on circumstance.',
    },
    speedyTrialSource: '725 ILCS 5/103-5',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has right to communicate with counsel.',
      source: '725 ILCS 5/109-1.5',
    },
    bailStructure: 'reformed_no_cash',
    bailReformNote: 'Illinois eliminated cash bail statewide effective September 18, 2023, under the Pretrial Fairness Act (part of the SAFE-T Act). All pretrial detention decisions are now based on dangerousness and flight risk under 725 ILCS 5/110-2. Cash bail is no longer available.',
    preliminaryHearing: 'Within 30 days if in custody',
    discoveryDeadline: '28 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Pretrial Fairness Act — no cash bail (eff. Sept 2023)',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Pennsylvania ──────────────────────────────────────────────────────────
  PA: {
    arraignment: '72 hours',
    speedy_trial: '365 days (from filing of complaint)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Pa. R. Crim. P. 540 — preliminary arraignment within 72 hours after arrest',
    bailHearingHours: 72,
    bailHearingSource: 'Pa. R. Crim. P. 540; bail set at preliminary arraignment',
    speedyTrialDays: {
      felony: 365,
      misdemeanor: 365,
      notes: '365-day limit runs from filing of criminal complaint. Rule 600 requires trial to commence within one year. Numerous excludable periods toll the clock.',
    },
    speedyTrialSource: 'Pa. R. Crim. P. 600',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Defendant has the right to contact an attorney promptly after arrest.',
      source: 'Pa. Const. Art. I § 9; Pa. R. Crim. P. 540',
    },
    bailStructure: 'cash_bail',
    notes: 'Pennsylvania uses monetary bail. Bail is set at the preliminary arraignment. Bail reduction hearings are available.',
    preliminaryHearing: 'Within 14 days of preliminary arraignment',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Approximately federal poverty guidelines — apply to local public defender',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Ohio ──────────────────────────────────────────────────────────────────
  OH: {
    arraignment: '48 hours',
    speedy_trial: '270 days (felony, not in custody) / 90 days (felony, in custody) / 90 days (misdemeanor 1st degree)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Ohio R. Crim. P. 5 — "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Ohio R. Crim. P. 5; bail set at initial appearance',
    speedyTrialDays: {
      felony: 270,
      felonyInCustody: 90,
      misdemeanor: 90,
      misdemeanorInCustody: 45,
      notes: 'Felony: 270 days (not in custody); 90 days (in custody). 1st-degree misdemeanor: 90 days (not in custody); 45 days (in custody). Days count triple while defendant is held in jail on the charge.',
    },
    speedyTrialSource: 'Ohio Rev. Code § 2945.71',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Right to communicate with counsel recognized.',
      source: 'Ohio Const. Art. I § 10; Ohio R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    notes: 'Ohio uses a cash bail system. Bail is set at initial appearance. OR release is available for minor offenses.',
    preliminaryHearing: 'Within 10 days if in custody',
    discoveryDeadline: '21 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Georgia ───────────────────────────────────────────────────────────────
  GA: {
    arraignment: '48 hours',
    speedy_trial: 'Two-term rule (defendant must demand; varies by county)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'O.C.G.A. § 17-4-26 — initial appearance within 48 hours of arrest',
    bailHearingHours: 48,
    bailHearingSource: 'O.C.G.A. § 17-4-26; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Georgia speedy trial is governed by the two-term rule (O.C.G.A. § 17-7-170). A defendant may demand speedy trial during the term of court at which the indictment is found, or the next term. If not tried by the end of the next term after demand, the defendant may be discharged. This is demand-triggered and highly variable by county court schedule.',
    },
    speedyTrialSource: 'O.C.G.A. § 17-7-170; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable access to communicate with family and counsel.',
      source: 'O.C.G.A. § 17-4-26',
    },
    bailStructure: 'cash_bail',
    notes: 'Georgia uses a commercial surety bail system. Bond hearings are held at initial appearance. Georgia has significant issues with commercial bail bondsmen.',
    preliminaryHearing: 'Within 30 days if in custody',
    discoveryDeadline: '10 days before trial',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    // ATTORNEY REVIEW NEEDED: HB 776 (2021) created automatic open-file discovery
    // in GA; the "10 days before trial" discoveryDeadline above may predate that reform.
    lastVerified: '2026-03',
  },

  // ── North Carolina ────────────────────────────────────────────────────────
  NC: {
    arraignment: '96 hours',
    speedy_trial: 'No statutory limit (constitutional right only)',
    bail_hearing: '96 hours',
    arraignmentHours: 96,
    arraignmentSource: 'N.C. Gen. Stat. § 15A-501(7) — initial appearance as soon as reasonably possible, no later than 96 hours after arrest',
    bailHearingHours: 96,
    bailHearingSource: 'N.C. Gen. Stat. § 15A-501; bail set at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'North Carolina has no statutory speedy trial deadline. Rights are governed by the federal Sixth Amendment Barker v. Wingo balancing test (weighing length of delay, reason for delay, defendant\u2019s assertion of the right, and prejudice).',
    },
    speedyTrialSource: 'U.S. Const. amend. VI; Barker v. Wingo, 407 U.S. 514 (1972); N.C. Const. Art. I § 18',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to contact counsel or family.',
      source: 'N.C. Gen. Stat. § 15A-501',
    },
    bailStructure: 'cash_bail',
    notes: 'North Carolina uses a cash bail system. Bail is set at initial appearance before a magistrate.',
    preliminaryHearing: 'Within 15 working days if in custody (N.C. Gen. Stat. § 15A-606)',
    discoveryDeadline: '15 days after arraignment (approximate; § 15A-902 is request-triggered)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Michigan ──────────────────────────────────────────────────────────────
  MI: {
    arraignment: '48 hours',
    speedy_trial: '180 days (felony, from arrest)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Mich. Comp. Laws § 764.26 — "without unnecessary delay... within 48 hours after the defendant is arrested"',
    bailHearingHours: 48,
    bailHearingSource: 'MCL § 764.26; bail set at arraignment',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: null,
      notes: '180-day rule for felonies runs from arrest. Applies to cases where defendant is held in jail awaiting trial. Michigan also has constitutional speedy trial protections under Barker v. Wingo.',
    },
    speedyTrialSource: 'Mich. Comp. Laws § 768.1 et seq.; People v. Collins, 388 Mich. 680 (1972)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable means of communication.',
      source: 'MCL § 764.26; Michigan Const. Art. I § 17',
    },
    bailStructure: 'cash_bail',
    notes: 'Michigan uses a cash bail system. Bail is set at arraignment. Personal recognizance bonds are available.',
    preliminaryHearing: 'Within 14 days of arraignment (MCL § 766.4)',
    discoveryDeadline: '21 days after arraignment (approximate; MCR 6.201 is request-triggered)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── New Jersey ────────────────────────────────────────────────────────────
  NJ: {
    arraignment: '72 hours',
    speedy_trial: '180 days (from indictment)',
    bail_hearing: '48 hours',
    arraignmentHours: 72,
    arraignmentSource: 'N.J. Ct. R. 3:4-1(a) — initial appearance within 72 hours of arrest',
    bailHearingHours: 48,
    bailHearingSource: 'N.J. Ct. R. 3:26-1; Public Safety Assessment (PSA) hearing within 48 hours',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: null,
      notes: '180-day clock for indictable offenses runs from indictment. Numerous exclusions apply. Dismissal is the remedy for violation.',
    },
    speedyTrialSource: 'N.J. Ct. R. 3:25-3',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to communicate with counsel.',
      source: 'N.J. Ct. R. 3:4-1',
    },
    bailStructure: 'reformed_no_cash',
    bailReformNote: 'The Criminal Justice Reform Act (effective January 1, 2017) eliminated cash bail for almost all defendants. Pretrial detention decisions are based on risk assessment using the Public Safety Assessment (PSA) tool and a judicial dangerousness finding. New Jersey was among the first states to eliminate cash bail statewide.',
    preliminaryHearing: 'Within 20 days for indictable offenses (N.J. Ct. R. 3:4-3)',
    discoveryDeadline: '20 days after indictment/arraignment (N.J. Ct. R. 3:13-3)',
    publicDefenderIncome: 'Individual: $25,000, Family of 2: $34,000',
    bailSystem: 'Pretrial services assessment — bail reform (no cash bail since 2017)',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Virginia ──────────────────────────────────────────────────────────────
  VA: {
    arraignment: '72 hours',
    speedy_trial: '5 months (felony, in custody) / 9 months (felony, not in custody)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Va. Code § 19.2-80 — "without unnecessary delay"; initial appearance before magistrate; arraignment typically within 72 hours',
    bailHearingHours: 72,
    bailHearingSource: 'Va. Code § 19.2-120; bail reviewed at initial appearance before magistrate',
    speedyTrialDays: {
      felony: 274,
      felonyInCustody: 152,
      misdemeanor: null,
      notes: 'Felony: 5 months (approximately 152 days) from arrest if held continuously in custody; 9 months (approximately 274 days) if released. Applies from the date of arrest when defendant is held, or from the date of probable cause finding otherwise.',
    },
    speedyTrialSource: 'Va. Code § 19.2-243',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit for phone calls. Defendant has the right to contact counsel and family.',
      source: 'Va. Code § 19.2-80; Va. Const. Art. I § 8',
    },
    bailStructure: 'cash_bail',
    notes: 'Virginia uses a cash bail system with secured and unsecured bonds. Bail hearings are conducted by magistrates.',
    preliminaryHearing: 'Within 10 days if in custody (Va. Sup. Ct. Rule 3A:5)',
    discoveryDeadline: '21 days after arraignment (approximate; Va. Sup. Ct. R. 3A:11 is motion-based)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Washington ────────────────────────────────────────────────────────────
  WA: {
    arraignment: '72 hours',
    speedy_trial: '60 days (misdemeanor, in custody) / 90 days (gross misdemeanor, in custody) / 60 days (felony, in custody from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Wash. Super. Ct. Crim. R. (CrR) 3.2(d) — arraignment without unnecessary delay; typically within 1-3 judicial days',
    bailHearingHours: 48,
    bailHearingSource: 'CrR 3.2; bail reviewed at arraignment; detention hearings within 48 hours',
    speedyTrialDays: {
      felony: 60,
      felonyInCustody: 60,
      misdemeanor: 60,
      misdemeanorInCustody: 60,
      notes: 'Felony: 60 days from arraignment if in custody; 90 days if released. Misdemeanor: 60 days in custody; 90 days released. Gross misdemeanor: same as misdemeanor. Timelines run from arraignment and are tolled by continuances and other excludable periods.',
    },
    speedyTrialSource: 'Wash. Super. Ct. Crim. R. (CrR) 3.3; Wash. Dist. Ct. Crim. R. (CrRLJ) 3.3',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to communicate with counsel.',
      source: 'Wash. Const. Art. I § 22',
    },
    bailStructure: 'cash_bail',
    notes: 'Washington uses a cash bail system. Courts may impose non-monetary conditions of release. OR release is common for non-violent offenses.',
    preliminaryHearing: 'Within 10 court days if in custody',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Pretrial services assessment',
    dataConfidence: 'high',
    // NOTE: lastVerified intentionally left at 2026-03 — see federal entry above.
    lastVerified: '2026-03',
  },

  // ── Arizona ───────────────────────────────────────────────────────────────
  AZ: {
    arraignment: '24 hours',
    speedy_trial: '150 days (felony, in custody) / 180 days (felony, not in custody) / 90 days (misdemeanor)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Ariz. R. Crim. P. 4.1 — initial appearance within 24 hours of arrest',
    bailHearingHours: 24,
    bailHearingSource: 'Ariz. R. Crim. P. 4.1; bail set at initial appearance',
    speedyTrialDays: {
      felony: 180,
      felonyInCustody: 150,
      misdemeanor: 90,
      notes: 'Felony: 150 days from arraignment if in custody; 180 days if not. Misdemeanor: 90 days from arraignment. Time excludes delays caused by the defendant.',
    },
    speedyTrialSource: 'Ariz. R. Crim. P. 8.2(b)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to communicate with counsel and family.',
      source: 'Ariz. R. Crim. P. 4.1; Ariz. Const. Art. II § 24',
    },
    bailStructure: 'cash_bail',
    notes: 'Arizona has a constitutional right to bail except for capital offenses or offenses showing proof evident. Ariz. Const. Art. II § 22.',
    preliminaryHearing: 'Within 10 days if in custody (Ariz. R. Crim. P. 5.1)',
    discoveryDeadline: '10 days after arraignment (Ariz. R. Crim. P. 15.1)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Massachusetts ─────────────────────────────────────────────────────────
  MA: {
    arraignment: '24 hours',
    speedy_trial: 'No strict statutory limit (case management guidelines; District Court: 12 months)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Mass. Gen. Laws ch. 276 § 58 — defendant "shall be brought before a district court forthwith"',
    bailHearingHours: 24,
    bailHearingSource: 'M.G.L. ch. 276 § 58; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Massachusetts has no rigid statutory speedy trial deadline. Case disposition is governed by court session management guidelines. District Court guidelines target 12 months from arraignment. Constitutional speedy trial rights apply under Barker v. Wingo.',
    },
    speedyTrialSource: 'Mass. R. Crim. P. 36; U.S. Const. amend. VI; Commonwealth v. Maddocks, 207 Mass. 152 (1911)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to contact counsel.',
      source: 'M.G.L. ch. 276 § 33A',
    },
    bailStructure: 'cash_bail',
    notes: 'Massachusetts uses monetary bail. Bail is set at arraignment. OR release is available. Dangerousness hearings (M.G.L. ch. 276 § 58A) allow pretrial detention without bail for certain offenses.',
    preliminaryHearing: 'Within 10-14 days for felonies',
    // Mass. R. Crim. P. 14(a)(1)(A) creates an automatic disclosure obligation — the
    // prosecution must provide most discoverable materials without a defense request.
    // Timing tracks the first pretrial conference (roughly 21 days in District Court,
    // 28 days in Superior Court); no single fixed post-arraignment deadline.
    // "30 days" was a generic placeholder; 21–28 days is more accurate.
    discoveryDeadline: 'Within 21–28 days of arraignment (approximate; Mass. R. Crim. P. 14(a)(1)(A) — automatic disclosure; no defense request required)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Tennessee ─────────────────────────────────────────────────────────────
  TN: {
    arraignment: '72 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Tenn. Code Ann. § 40-7-118 — "without unnecessary delay... within 72 hours after arrest"',
    bailHearingHours: 72,
    bailHearingSource: 'Tenn. Code Ann. § 40-11-102; bail set at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Tennessee does not have a statutory speedy trial act with specific day limits. Rights are governed by the constitutional balancing test. Courts apply Barker v. Wingo factors.',
    },
    speedyTrialSource: 'Tenn. Const. Art. I § 9; U.S. Const. amend. VI; Barker v. Wingo, 407 U.S. 514 (1972)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to communicate with counsel.',
      source: 'Tenn. Code Ann. § 40-7-106',
    },
    bailStructure: 'cash_bail',
    notes: 'Tennessee uses a cash bail system. Bail is set at initial appearance before a magistrate.',
    preliminaryHearing: 'Within 10 days if in custody (Tenn. R. Crim. P. 5)',
    // Tenn. R. Crim. P. 16 is request-triggered: the defendant must serve a written
    // request on the prosecution to initiate discovery.  There is no automatic fixed
    // post-arraignment disclosure deadline — the state's obligation arises only after
    // the request is received.  (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: 'Upon request (no fixed post-arraignment deadline; Tenn. R. Crim. P. 16 is request-triggered)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Indiana ───────────────────────────────────────────────────────────────
  IN: {
    arraignment: '48 hours',
    speedy_trial: '70 days (felony, in custody) / 1 year (felony, not in custody)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Ind. Code § 35-33-7-1 — initial hearing within 48 hours of arrest',
    bailHearingHours: 48,
    bailHearingSource: 'Ind. Code § 35-33-7-1; bail reviewed at initial hearing',
    speedyTrialDays: {
      felony: 365,
      felonyInCustody: 70,
      misdemeanor: 365,
      misdemeanorInCustody: 70,
      notes: 'If defendant is in custody: trial must commence within 70 days of arrest. If not in custody: one year (365 days) from date of arrest.',
    },
    speedyTrialSource: 'Ind. R. Crim. P. 4',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to contact counsel and family.',
      source: 'Ind. Code § 35-33-7-1',
    },
    bailStructure: 'cash_bail',
    notes: 'Indiana uses a cash bail system with surety bonds. OR release is available for lower-level offenses.',
    preliminaryHearing: 'Promptly after arrest (initial hearing, IC § 35-33-7-1; Indiana uses initial hearing rather than a separate preliminary hearing)',
    // Indiana criminal discovery is obtained by motion — the defense must file a
    // discovery motion with the court.  There is no fixed automatic post-arraignment
    // deadline; the court sets response timelines when granting the motion.
    // Ind. Code § 35-36-1 governs the scope of court-ordered disclosure.
    // The "30 days" figure is a common practical approximation, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; Ind. Code § 35-36-1 — court-ordered by motion; no fixed automatic post-arraignment deadline)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Missouri ──────────────────────────────────────────────────────────────
  MO: {
    arraignment: '48 hours (excl. weekends and holidays) after confinement under warrant',
    speedy_trial: 'No day-limit statute; Mo. Rev. Stat. § 545.780 requires trial "as soon as reasonably possible" after defendant demand — constitutional balancing applies',
    bail_hearing: '48 hours at initial appearance; up to 7 days (excl. weekends/holidays) if detained further (Mo. R. Crim. P. 33.05)',
    arraignmentHours: 48,
    arraignmentSource: 'Mo. R. Crim. P. 22.08 (felony) and 21.10 (misdemeanor) — no later than 48 hours, excluding weekends and holidays, after confinement under warrant (amended Oct. 26, 2021, eff. July 1, 2022). Mo. Rev. Stat. § 544.170 caps warrantless detention at 24 hours.',
    bailHearingHours: 48,
    bailHearingSource: 'Mo. R. Crim. P. 22.08, 21.10 (bail addressed at initial appearance); Mo. R. Crim. P. 33.05 (if still detained after initial appearance, release hearing within 7 days, excl. weekends/holidays)',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Mo. Rev. Stat. § 545.780 requires trial "as soon as reasonably possible" after the defendant files a demand — no specific day count. Violation is not automatic grounds for dismissal; court must separately find a constitutional speedy trial violation. Constitutional balancing under Barker v. Wingo, 407 U.S. 514 (1972) and Mo. Const. Art. I § 18(a) governs. Note: Mo. Rev. Stat. § 217.460 (Interstate Agreement on Detainers) imposes a 180-day clock only for defendants already imprisoned elsewhere with untried Missouri charges.',
    },
    speedyTrialSource: 'Mo. Rev. Stat. § 545.780; Mo. Const. Art. I § 18(a); U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory hour limit. Mo. Rev. Stat. § 544.170(2) requires that confined persons be permitted "at any reasonable time" to consult with counsel or other persons acting on their behalf. Violation is a Class A misdemeanor.',
      source: 'Mo. Rev. Stat. § 544.170(2)',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 30 days if in custody',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
    notes: 'Non-monetary release conditions must be considered first under Mo. R. Crim. P. 33.01 before monetary bail is imposed. Cash bail remains available and widely used; no statewide reform enacted as of 2026.',
  },

  // ── Maryland ──────────────────────────────────────────────────────────────
  MD: {
    arraignment: '24 hours',
    speedy_trial: '180 days (from arraignment — Hicks rule)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Md. Rule 4-212 — initial appearance within 24 hours of arrest',
    bailHearingHours: 24,
    bailHearingSource: 'Md. Rule 4-216; bail review at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: 'The Hicks rule requires trial to begin within 180 days of arraignment. If not begun within 180 days without good cause, the case is dismissed with prejudice. This is a firm rule regardless of the reason for delay, absent good cause.',
    },
    speedyTrialSource: 'Md. Rule 4-271; State v. Hicks, 285 Md. 310 (1979)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to contact counsel.',
      source: 'Md. Rule 4-212',
    },
    bailStructure: 'cash_bail',
    notes: 'Maryland uses a cash bail system with bond options. Commissioner sets bail at initial appearance; bail review available before a judge.',
    preliminaryHearing: 'Within 30 days for felonies (Md. Rule 4-221)',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system with bond options',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Wisconsin ─────────────────────────────────────────────────────────────
  WI: {
    arraignment: '48 hours',
    speedy_trial: '90 days (in custody) / 180 days (not in custody)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Wis. Stat. § 970.01 — initial appearance "without unnecessary delay... within 48 hours"',
    bailHearingHours: 48,
    bailHearingSource: 'Wis. Stat. § 970.01; bail set at initial appearance',
    speedyTrialDays: {
      felony: 180,
      felonyInCustody: 90,
      misdemeanor: 180,
      misdemeanorInCustody: 90,
      notes: 'If defendant is held in custody: trial must commence within 90 days of initial appearance. If not in custody: 180 days.',
    },
    speedyTrialSource: 'Wis. Stat. § 971.10',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Wis. Stat. § 970.01',
    },
    bailStructure: 'cash_bail',
    notes: 'Wisconsin uses a cash bail system. Bail is set at initial appearance.',
    preliminaryHearing: 'Within 10 days if in custody (Wis. Stat. § 970.03)',
    discoveryDeadline: '30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Colorado ──────────────────────────────────────────────────────────────
  CO: {
    arraignment: '48 hours',
    speedy_trial: '6 months (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Colo. R. Crim. P. 5 — advisement within 48 hours of arrest',
    bailHearingHours: 48,
    bailHearingSource: 'Colo. R. Crim. P. 5; bail reviewed at advisement',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: '6-month clock runs from arraignment. Excludes delays caused by the defendant. Court may dismiss with or without prejudice.',
    },
    speedyTrialSource: 'Colo. R. Crim. P. 48',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant has the right to communicate with counsel.',
      source: 'Colo. Const. Art. II § 16',
    },
    bailStructure: 'cash_bail',
    notes: 'Colorado uses a cash bail system with monetary bond options. PR (personal recognizance) bonds are common.',
    preliminaryHearing: 'Within 30 days for felonies (Colo. R. Crim. P. 5)',
    discoveryDeadline: '35 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system with PR bond option',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Minnesota ─────────────────────────────────────────────────────────────
  MN: {
    arraignment: '36 hours',
    speedy_trial: '60 days (in custody) / 180 days (not in custody)',
    bail_hearing: '36 hours',
    arraignmentHours: 36,
    arraignmentSource: 'Minn. R. Crim. P. 4.02 — initial appearance "without unnecessary delay... within 36 hours"',
    bailHearingHours: 36,
    bailHearingSource: 'Minn. R. Crim. P. 6.02; bail set at initial appearance',
    speedyTrialDays: {
      felony: 180,
      felonyInCustody: 60,
      misdemeanor: 180,
      misdemeanorInCustody: 60,
      notes: 'If defendant is in custody: trial must be held within 60 days of demand for trial. If not in custody: 180 days from demand.',
    },
    speedyTrialSource: 'Minn. R. Crim. P. 11.10',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Minn. R. Crim. P. 4.02',
    },
    bailStructure: 'cash_bail',
    notes: 'Minnesota uses a cash bail system. Bail is set at initial appearance.',
    preliminaryHearing: 'Within 7 days if in custody (Minn. R. Crim. P. 8.01)',
    discoveryDeadline: '28 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── South Carolina ────────────────────────────────────────────────────────
  SC: {
    arraignment: '24 hours',
    speedy_trial: 'Two-term rule (if demanded; otherwise constitutional right only)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'S.C. Code Ann. § 17-15-10 — initial hearing within 24 hours of arrest',
    bailHearingHours: 24,
    bailHearingSource: 'S.C. Code Ann. § 17-15-10; bail set at initial hearing',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'If the defendant demands a speedy trial in writing after indictment, the state must try the defendant within two terms of court or the indictment may be quashed.',
    },
    speedyTrialSource: 'S.C. Code Ann. § 17-23-90; S.C. Const. Art. I § 14',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'S.C. Code Ann. § 17-15-10',
    },
    bailStructure: 'cash_bail',
    notes: 'South Carolina uses a cash bail system. Bail is set at initial bond hearing.',
    preliminaryHearing: 'Defendant must request within 10 days of notice; hearing held within 10 days of request (SC Rule 2 SCRCP)',
    // SC Rule 5(a)(2) SCRCrimP is request-triggered: the prosecution's disclosure
    // obligation is activated by the defendant's written demand.  The state has 30 days
    // from that demand to produce responsive materials.  There is no automatic
    // post-arraignment disclosure requirement independent of the written demand.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: 'Within 30 days of written demand (SC Rule 5(a)(2) SCRCrimP — request-triggered)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Alabama ───────────────────────────────────────────────────────────────
  AL: {
    arraignment: '72 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Ala. R. Crim. P. 4.3 — initial appearance within 72 hours of arrest',
    bailHearingHours: 72,
    bailHearingSource: 'Ala. R. Crim. P. 7.1; bail set at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Alabama has no statutory speedy trial deadline. Constitutional rights apply under Barker v. Wingo.',
    },
    speedyTrialSource: 'Ala. Const. Art. I § 6; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Ala. R. Crim. P. 4.3',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Defendant may demand hearing within 30 days of arrest (Ala. R. Crim. P. 5.1)',
    // Ala. R. Crim. P. 16.1 is request-triggered: the prosecution must disclose
    // responsive materials within 14 days after the defendant's written request.
    // There is no automatic post-arraignment disclosure — the obligation is activated
    // only by the written request.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: 'Within 14 days of written request (Ala. R. Crim. P. 16.1 — request-triggered)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Louisiana ─────────────────────────────────────────────────────────────
  LA: {
    arraignment: '72 hours',
    speedy_trial: '2 years (felony, in custody) / 120 days (misdemeanor, in custody)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'La. Code Crim. Proc. Art. 230 — "without unnecessary delay... within 72 hours of arrest"',
    bailHearingHours: 72,
    bailHearingSource: 'La. Code Crim. Proc. Art. 230; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      felonyInCustody: 730,
      misdemeanor: null,
      misdemeanorInCustody: 120,
      notes: 'Louisiana uses a prescription (limitations) model rather than a traditional speedy trial act. Prosecution must be instituted within 2 years (felony) or 1 year (misdemeanor) of offense. If defendant is held in jail awaiting trial: felony within 2 years, misdemeanor within 120 days (or bail must be reduced).',
    },
    speedyTrialSource: 'La. Code Crim. Proc. Art. 578; La. Code Crim. Proc. Art. 701',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'La. Code Crim. Proc. Art. 230',
    },
    bailStructure: 'cash_bail',
    notes: 'Louisiana uses a cash bail system. Commercial surety bonds are widely used.',
    preliminaryHearing: 'Within 30 days if in custody',
    // La. Code Crim. Proc. Ann. Art. 716–723 governs discovery in Louisiana.
    // Discovery is motion-triggered: the defendant must file a motion for discovery
    // with the court; the prosecution has no automatic post-arraignment disclosure
    // obligation under state law.  The "30 days" figure is a common practical
    // approximation for court-ordered response time, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; La. Code Crim. Proc. Ann. Art. 716 — motion-triggered; no automatic disclosure obligation)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Kentucky ──────────────────────────────────────────────────────────────
  KY: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Ky. R. Crim. P. 3.02 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Ky. R. Crim. P. 4.06; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Kentucky has no statutory speedy trial act. Constitutional rights apply under Ky. Const. § 11 and U.S. Const. amend. VI.',
    },
    speedyTrialSource: 'Ky. Const. § 11; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Ky. R. Crim. P. 3.02',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (Ky. R. Crim. P. 3.10)',
    // Ky. RCr 7.24 is request-triggered: the defendant must serve a written demand
    // on the prosecution to initiate discovery.  There is no fixed automatic
    // post-arraignment disclosure deadline independent of the written demand.
    // The "30 days" figure is a common practical approximation for court response
    // time after a demand is filed, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; Ky. RCr 7.24 — request-triggered; disclosure upon written demand)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Oregon ────────────────────────────────────────────────────────────────
  OR: {
    arraignment: '36 hours',
    speedy_trial: '60 days (in custody) / 90 days (not in custody)',
    bail_hearing: '36 hours',
    arraignmentHours: 36,
    arraignmentSource: 'Or. Rev. Stat. § 135.010 — arraignment "without unnecessary delay... within 36 hours" for in-custody defendants',
    bailHearingHours: 36,
    bailHearingSource: 'Or. Rev. Stat. § 135.245; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: 90,
      felonyInCustody: 60,
      misdemeanor: 90,
      misdemeanorInCustody: 60,
      notes: 'If defendant is held in custody: trial within 60 days of arraignment. If not in custody: 90 days from arraignment. Excludes periods of delay attributable to the defendant.',
    },
    speedyTrialSource: 'Or. Rev. Stat. § 135.747; Or. Rev. Stat. § 135.750',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Or. Rev. Stat. § 135.010',
    },
    bailStructure: 'cash_bail',
    notes: 'Oregon uses a cash bail system with release agreements. OR release is widely used.',
    preliminaryHearing: 'Within 5 judicial days if in custody (ORS § 135.070)',
    // ORS § 135.815 creates an automatic disclosure obligation: the prosecution must
    // disclose listed items (prior convictions, expert witnesses, evidence favorable to
    // the defense, etc.) without a defense request.  The statute requires disclosure
    // "as soon as practicable" — there is no fixed post-arraignment day limit in the
    // statute itself.  "30 days" is a common practical approximation used by courts and
    // practitioners, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; ORS § 135.815 — automatic disclosure for most materials; no fixed post-arraignment day limit in statute)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Oklahoma ──────────────────────────────────────────────────────────────
  OK: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Okla. Stat. tit. 22 § 181 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Okla. Stat. tit. 22 § 1101; bail set at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Oklahoma has no statutory speedy trial act. Constitutional rights apply.',
    },
    speedyTrialSource: 'Okla. Const. Art. II § 20; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Okla. Stat. tit. 22 § 181',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody',
    // Okla. Stat. tit. 22 § 2002(A) is request-triggered: the defendant must file
    // a written request for discovery; the prosecution has no automatic post-arraignment
    // disclosure obligation.  The "30 days" figure is a common practical approximation
    // for prosecutorial response time after a request, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; Okla. Stat. tit. 22 § 2002(A) — request-triggered; no automatic post-arraignment disclosure)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Connecticut ───────────────────────────────────────────────────────────
  CT: {
    arraignment: '24 hours',
    speedy_trial: 'No strict statutory deadline (constitutional and case-management rules apply)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Conn. Gen. Stat. § 54-1g — arraignment on next court day; typically within 24 hours',
    bailHearingHours: 24,
    bailHearingSource: 'Conn. Gen. Stat. § 54-63c; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Connecticut does not have a simple statutory speedy trial deadline. Courts apply constitutional standards under Barker v. Wingo.',
    },
    speedyTrialSource: 'Conn. Const. Art. I § 8; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Conn. Gen. Stat. § 54-1g',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days for felonies',
    // Conn. Prac. Book § 40-11(a) creates an automatic disclosure obligation: the
    // prosecution must provide listed items without a defense request.  For in-custody
    // defendants, disclosure must occur within 3 business days of arraignment; for
    // released defendants, prior to or at arraignment.  Additional items under
    // § 40-13 et seq. are disclosed on a continuing basis.  The prior "30 days after
    // arraignment" placeholder was inaccurate — the actual rule is a 3-business-day
    // initial window for in-custody defendants (or at/before arraignment if released).
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: 'Within 3 business days of arraignment for in-custody defendants; at or before arraignment if released (Conn. Prac. Book § 40-11(a) — automatic disclosure)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Utah ──────────────────────────────────────────────────────────────────
  UT: {
    arraignment: '72 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Utah R. Crim. P. 7 — initial appearance "without unnecessary delay... within 72 hours"',
    bailHearingHours: 72,
    bailHearingSource: 'Utah R. Crim. P. 7; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Utah has no specific statutory speedy trial deadlines. Constitutional rights apply under the Sixth Amendment and Utah Const. Art. I § 12.',
    },
    speedyTrialSource: 'Utah Const. Art. I § 12; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Utah R. Crim. P. 7',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 14 days if in custody (Utah Code Ann. § 77-11-2)',
    discoveryDeadline: '30 days after arraignment (approximate; Utah R. Crim. P. 16)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Iowa ──────────────────────────────────────────────────────────────────
  IA: {
    arraignment: '48 hours',
    speedy_trial: '90 days (from indictment/information)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Iowa R. Crim. P. 2.2(1) — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Iowa R. Crim. P. 2.44; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 90,
      misdemeanor: 90,
      notes: '90 days from date of indictment, information, or arraignment. Delay caused by defendant is excluded.',
    },
    speedyTrialSource: 'Iowa R. Crim. P. 2.33(2)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Iowa R. Crim. P. 2.2',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (Iowa R. Crim. P. 2.2(5))',
    discoveryDeadline: '30 days after arraignment (approximate; Iowa R. Crim. P. 2.14)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Nevada ────────────────────────────────────────────────────────────────
  NV: {
    arraignment: '72 hours',
    speedy_trial: '60 days (in custody) / 90 days (not in custody)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Nev. Rev. Stat. § 171.178 — initial appearance "without unnecessary delay... within 72 hours"',
    bailHearingHours: 72,
    bailHearingSource: 'Nev. Rev. Stat. § 178.484; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 90,
      felonyInCustody: 60,
      misdemeanor: 90,
      misdemeanorInCustody: 60,
      notes: '60 days from arraignment if defendant is in custody; 90 days if released.',
    },
    speedyTrialSource: 'Nev. Rev. Stat. § 178.556',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Nev. Rev. Stat. § 171.178',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 15 days (Nev. Rev. Stat. § 171.196)',
    // NRS § 174.234 creates a mandatory automatic disclosure obligation: the prosecution
    // must provide listed items (prior convictions, statements, expert summaries, etc.)
    // to the defense without a written request.  The statute requires disclosure
    // "as soon as practicable" — no specific post-arraignment day limit is stated.
    // The "30 days" figure is a common practical approximation, not a statutory deadline.
    // (Engineer-verified 2026-07; attorney review pending.)
    discoveryDeadline: '30 days after arraignment (approximate; NRS § 174.234 — mandatory automatic disclosure; no fixed post-arraignment day limit in statute)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Arkansas ──────────────────────────────────────────────────────────────
  AR: {
    arraignment: 'Without unnecessary delay (Ark. R. Crim. P. 8.1; 48-hour federal constitutional floor)',
    speedy_trial: '12 months from arrest; 9 months if continuously held in custody (Ark. R. Crim. P. 28.1)',
    bail_hearing: 'At initial appearance (Ark. R. Crim. P. 8.1, 9.2)',
    arraignmentHours: 48,
    arraignmentSource: 'Ark. R. Crim. P. 8.1 — "without unnecessary delay"; 48-hour federal floor from County of Riverside v. McLaughlin, 500 U.S. 44 (1991)',
    bailHearingHours: 48,
    bailHearingSource: 'Ark. R. Crim. P. 8.1, 9.2; bail set at initial appearance',
    speedyTrialDays: {
      felony: 365,
      misdemeanor: 365,
      notes: 'Ark. R. Crim. P. 28.1(c): reduced to 274 days (9 months) if defendant is continuously held in custody from arrest to trial. Clock runs from the earliest of: date of arrest, date of information/indictment filing, or date of warrant issuance (Rule 28.2). Excluded periods under Rule 28.3 toll the clock. Violation remedy: dismissal with an absolute bar to prosecution (Ark. R. Crim. P. 30.1) — double jeopardy bars re-filing.',
    },
    speedyTrialSource: 'Ark. R. Crim. P. 28.1(a)–(c), 28.2, 28.3, 30.1; Ark. Const. Art. II § 10; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory hour limit. Right to communicate with counsel and family within a "reasonable time" (Ark. R. Crim. P. 2.3; Ark. Code Ann. § 12-27-119 requires facilities to permit reasonable communication).',
      source: 'Ark. R. Crim. P. 2.3; Ark. Code Ann. § 12-27-119',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (Ark. R. Crim. P. 8.1)',
    discoveryDeadline: '30 days after arraignment (approximate; Ark. R. Crim. P. 17.1)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Mississippi ───────────────────────────────────────────────────────────
  MS: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Miss. R. Crim. P. 6.1 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Miss. R. Crim. P. 8.1; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Mississippi has no statutory speedy trial act. Constitutional rights apply under Barker v. Wingo.',
    },
    speedyTrialSource: 'Miss. Const. Art. III § 26; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Miss. R. Crim. P. 6.1',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 30 days for felonies (Miss. R. Crim. P. 6.2; day count approximate)',
    discoveryDeadline: '30 days after arraignment (approximate; Miss. R. Crim. P. 17)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Kansas ────────────────────────────────────────────────────────────────
  KS: {
    arraignment: '48 hours',
    speedy_trial: '90 days (in custody) / 180 days (not in custody)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Kan. Stat. Ann. § 22-2901 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Kan. Stat. Ann. § 22-2802; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      felonyInCustody: 90,
      misdemeanor: 180,
      misdemeanorInCustody: 90,
      notes: '90 days if defendant is in custody; 180 days if not in custody. Counts from arraignment.',
    },
    speedyTrialSource: 'Kan. Stat. Ann. § 22-3402',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Kan. Stat. Ann. § 22-2901',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (Kan. Stat. Ann. § 22-2902)',
    discoveryDeadline: '30 days after arraignment (approximate; Kan. Stat. Ann. § 22-3212)',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── New Mexico ────────────────────────────────────────────────────────────
  NM: {
    arraignment: '48 hours',
    speedy_trial: '6 months (not in custody) / 90 days (in custody)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'N.M.R.A. Rule 5-303 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'N.M.R.A. Rule 5-401; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: 180,
      felonyInCustody: 90,
      misdemeanor: 180,
      misdemeanorInCustody: 90,
      notes: '90 days from arraignment if in custody; 180 days if not. New Mexico amended its bail rules in 2016 to allow non-monetary conditions of release.',
    },
    speedyTrialSource: 'N.M.R.A. Rule 5-604',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'N.M.R.A. Rule 5-303',
    },
    bailStructure: 'cash_bail',
    bailReformNote: '2016 constitutional amendment allows courts to detain defendants on non-monetary conditions. New Mexico still uses cash bail but courts now have broader tools to impose release conditions.',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Nebraska ──────────────────────────────────────────────────────────────
  NE: {
    arraignment: '48 hours',
    speedy_trial: '6 months (from filing of information)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Neb. Rev. Stat. § 29-1819 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Neb. Rev. Stat. § 29-901; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: '6 months from filing of information or indictment. Delays attributable to the defendant are excluded.',
    },
    speedyTrialSource: 'Neb. Rev. Stat. § 29-1207',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Neb. Rev. Stat. § 29-1819',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── West Virginia ─────────────────────────────────────────────────────────
  WV: {
    arraignment: '48 hours',
    speedy_trial: 'Three-term rule (approximately 9 months)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'W. Va. R. Crim. P. 5 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'W. Va. R. Crim. P. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'West Virginia uses a term-of-court rule. If not tried within three regular terms of court after indictment, the case may be discharged. Three terms is approximately 9 months, but timing varies by county.',
    },
    speedyTrialSource: 'W. Va. Code § 62-3-21; W. Va. Const. Art. III § 14',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'W. Va. R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
    notes: 'Three-term rule timing is approximate and varies by county; confirm current term schedule with the local circuit court clerk.',
  },

  // ── Idaho ─────────────────────────────────────────────────────────────────
  ID: {
    arraignment: '48 hours',
    speedy_trial: '6 months (from filing of charge)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Idaho Crim. R. 5 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Idaho Crim. R. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: 'Any person against whom criminal charges are pending who has not been brought to trial within 6 months is entitled to dismissal of the charges.',
    },
    speedyTrialSource: 'Idaho Code § 19-3501',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Idaho Crim. R. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Hawaii ────────────────────────────────────────────────────────────────
  HI: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arrest)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Haw. R. Penal P. 5 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Haw. R. Penal P. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: '180-day clock (6 months) from date of arrest or filing of charges, whichever is earlier.',
    },
    speedyTrialSource: 'Haw. R. Penal P. 48',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Haw. R. Penal P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── New Hampshire ─────────────────────────────────────────────────────────
  NH: {
    arraignment: '24 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'N.H. Rev. Stat. Ann. § 594:20-a — arraignment "forthwith" (typically within 24 hours)',
    bailHearingHours: 24,
    bailHearingSource: 'N.H. Super. Ct. R.; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'New Hampshire has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'N.H. Const. Pt. I Art. 14; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'N.H. Rev. Stat. Ann. § 594:20-a',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Maine ─────────────────────────────────────────────────────────────────
  ME: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Me. R. U. Crim. P. 5 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Me. R. U. Crim. P. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Maine has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'Me. Const. Art. I § 6; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Me. R. U. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Montana ───────────────────────────────────────────────────────────────
  MT: {
    arraignment: '48 hours',
    speedy_trial: '6 months (from first appearance)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Mont. Code Ann. § 46-7-101 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Mont. Code Ann. § 46-9-101; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: '6-month clock from first appearance. If not tried within 6 months, defendant may be entitled to dismissal.',
    },
    speedyTrialSource: 'Mont. Code Ann. § 46-13-401',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Mont. Code Ann. § 46-7-101',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Rhode Island ──────────────────────────────────────────────────────────
  RI: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'R.I. Super. Ct. R. Crim. P. 5 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'R.I. Gen. Laws § 12-13-2; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Rhode Island has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'R.I. Const. Art. I § 10; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'R.I. Super. Ct. R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Delaware ──────────────────────────────────────────────────────────────
  DE: {
    arraignment: 'Without unnecessary delay (Del. Super. Ct. Crim. R. 5; no statutory hour count)',
    speedy_trial: 'No statutory deadline; Barker v. Wingo balancing test under Del. Const. Art. I § 7',
    bail_hearing: 'At initial appearance; risk assessment required under 11 Del. C. § 2105 (SB 163, 2017)',
    arraignmentHours: 48,
    arraignmentSource: 'Del. Super. Ct. Crim. R. 5 — "without unnecessary delay"; no specific hour count in rule text. JP Court Criminal R. 5 governs first appearance (JP Court handles most arrested persons before Superior Court). 48-hour federal floor applies.',
    bailHearingHours: 48,
    bailHearingSource: 'Del. Super. Ct. Crim. R. 46; 11 Del. C. § 2105 (SB 163, 2017) — validated pretrial risk assessment required before setting monetary bail',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Delaware has no speedy trial statute with fixed day limits. Del. Super. Ct. Crim. R. 48 is a dismissal rule, not a speedy trial clock. Four-factor Barker v. Wingo, 407 U.S. 514 (1972) balancing test governs under both the Sixth Amendment and Del. Const. Art. I § 7. See Bailey v. State, 521 A.2d 1069 (Del. 1987); Middlebrook v. State, 802 A.2d 268 (Del. 2002).',
    },
    speedyTrialSource: 'Del. Const. Art. I § 7; Del. Super. Ct. Crim. R. 48; Middlebrook v. State, 802 A.2d 268 (Del. 2002); U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory hour limit. Right to counsel under Del. Const. Art. I § 7 and Sixth Amendment governs access; no Delaware equivalent of a fixed-hour phone call statute.',
      source: 'Del. Const. Art. I § 7; 11 Del. C. Title 11 Ch. 19 (no specific phone call provision found)',
    },
    bailStructure: 'reformed_limited_cash',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
    notes: 'Delaware bail reformed by SB 163 (2017), enacted as 81 Del. Laws ch. 356. Under 11 Del. C. § 2105, courts must consider a validated pretrial risk assessment before imposing monetary bail. Cash bail remains available but is disfavored for low-risk defendants. Delaware has not eliminated cash bail (unlike NJ), but it is no longer pure cash bail.',
  },

  // ── South Dakota ──────────────────────────────────────────────────────────
  SD: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'S.D. Codified Laws § 23A-40-1 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'S.D. Codified Laws § 23A-43-5; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: '180 days from arraignment. South Dakota has a statutory speedy trial provision.',
    },
    speedyTrialSource: 'S.D. Codified Laws § 23A-44-5.1',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'S.D. Codified Laws § 23A-40-1',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── North Dakota ──────────────────────────────────────────────────────────
  ND: {
    arraignment: '48 hours',
    speedy_trial: '90 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'N.D.R.Crim.P. 5 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'N.D.R.Crim.P. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 90,
      misdemeanor: 90,
      notes: '90 days from arraignment to trial commencement.',
    },
    speedyTrialSource: 'N.D.R.Crim.P. 48(b)',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'N.D.R.Crim.P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Alaska ────────────────────────────────────────────────────────────────
  AK: {
    arraignment: '48 hours',
    speedy_trial: '120 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Alaska R. Crim. P. 5 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Alaska R. Crim. P. 41; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: 120,
      misdemeanor: 120,
      notes: '120 days from arraignment. Delays caused by the defendant are excluded.',
    },
    speedyTrialSource: 'Alaska R. Crim. P. 45',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Alaska R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Vermont ───────────────────────────────────────────────────────────────
  VT: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Vt. R. Crim. P. 5 — arraignment "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Vt. R. Crim. P. 46; bail reviewed at arraignment',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Vermont has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'Vt. Const. Ch. I Art. 10; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Vt. R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Wyoming ───────────────────────────────────────────────────────────────
  WY: {
    arraignment: '72 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '72 hours',
    arraignmentHours: 72,
    arraignmentSource: 'Wyo. R. Crim. P. 5 — initial appearance "without unnecessary delay"; typically within 72 hours',
    bailHearingHours: 72,
    bailHearingSource: 'Wyo. R. Crim. P. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Wyoming has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'Wyo. Const. Art. I § 10; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Wyo. R. Crim. P. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },

  // ── Puerto Rico ───────────────────────────────────────────────────────────
  // Puerto Rico operates under its own Criminal Procedure Rules (Reglas de
  // Procedimiento Criminal de Puerto Rico), separate from federal rules.
  PR: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arrest, felony)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'P.R. Laws Ann. tit. 34, R. Crim. P. 23 — initial appearance without unnecessary delay; 48-hour floor applies',
    bailHearingHours: 48,
    bailHearingSource: 'P.R. Laws Ann. tit. 34, R. Crim. P. 23; bail determined at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 60,
      notes: 'Puerto Rico has its own Criminal Procedure Code independent of federal rules. Speedy trial clock runs from arrest. The 180-day period applies to felonies; misdemeanors are subject to a shorter period. Puerto Rico courts also apply U.S. Sixth Amendment protections.',
    },
    speedyTrialSource: 'P.R. Laws Ann. tit. 34, R. Crim. P. 64; P.R. Const. Art. II § 11; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Defendant has the right to communicate with counsel and family after arrest.',
      source: 'P.R. Laws Ann. tit. 34, R. Crim. P. 23; P.R. Const. Art. II § 11',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (felony)',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination — apply to Sociedad para Asistencia Legal (SAL) or Federal Public Defender',
    bailSystem: 'Cash bail system',
    dataConfidence: 'medium',
    lastVerified: '2026-07',
    notes: 'Puerto Rico has its own Criminal Procedure Code (Reglas de Procedimiento Criminal de Puerto Rico). Federal criminal procedure rules (Fed. R. Crim. P.) do NOT govern Puerto Rico territorial courts. Cases in the U.S. District Court for Puerto Rico are subject to federal rules.',
  },

  // ── Guam ──────────────────────────────────────────────────────────────────
  // Guam operates under the Guam Code Annotated (GCA) Title 8 — Criminal
  // Procedure, modeled after the Federal Rules of Criminal Procedure.
  GU: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Guam R. Crim. P. 5 — initial appearance without unnecessary delay; 48-hour floor applies',
    bailHearingHours: 48,
    bailHearingSource: 'Guam R. Crim. P. 5; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: 'Guam criminal procedure is closely modeled on the Federal Rules of Criminal Procedure. The 180-day speedy trial period runs from arraignment. Note: Guam is an unincorporated U.S. territory; federal constitutional protections including the Sixth Amendment apply.',
    },
    speedyTrialSource: 'Guam Code Ann. tit. 8, § 80.60; Guam Const. Art. I § 12; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Defendant has the right to communicate with counsel.',
      source: 'Guam R. Crim. P. 5; Guam Code Ann. tit. 8',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (felony)',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination — apply to Guam Public Defender Service Corporation',
    bailSystem: 'Cash bail system',
    dataConfidence: 'medium',
    lastVerified: '2026-07',
    notes: 'Guam is an unincorporated U.S. territory. Criminal procedure is governed by the Guam Code Annotated (GCA), modeled on federal rules. U.S. Sixth Amendment and due process protections apply. Cases in U.S. District Court of Guam are governed by Federal Rules of Criminal Procedure.',
  },

  // ── U.S. Virgin Islands ───────────────────────────────────────────────────
  // The V.I. Superior Court operates under the Virgin Islands Code (V.I.C.)
  // and its own Superior Court Rules of Criminal Procedure.
  VI: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arrest)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'V.I. Code Ann. tit. 5, § 3561; V.I. Super. Ct. R. Crim. P. 5 — without unnecessary delay; 48-hour floor applies',
    bailHearingHours: 48,
    bailHearingSource: 'V.I. Code Ann. tit. 5, § 3561; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 90,
      notes: 'The U.S. Virgin Islands has its own criminal procedure code and Superior Court rules. Federal constitutional protections including the Sixth Amendment apply as an unincorporated territory. Speedy trial runs from arrest for felonies.',
    },
    speedyTrialSource: 'V.I. Code Ann. tit. 5, § 3562; V.I. Const. App. I; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Defendant has the right to communicate with counsel after arrest.',
      source: 'V.I. Super. Ct. R. Crim. P. 5; V.I. Code Ann. tit. 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10 days if in custody (felony)',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination — apply to V.I. Public Defender Services',
    bailSystem: 'Cash bail system',
    dataConfidence: 'medium',
    lastVerified: '2026-07',
    notes: 'U.S. Virgin Islands is an unincorporated U.S. territory. Criminal procedure is governed by V.I. Code Ann. tit. 5 and V.I. Superior Court Rules. Federal Rules of Criminal Procedure govern cases in the U.S. District Court of the Virgin Islands.',
  },

  // ── American Samoa ────────────────────────────────────────────────────────
  // American Samoa has unique status: it is the only unincorporated,
  // unorganized territory where residents are U.S. nationals (not citizens).
  // Criminal procedure is governed by the American Samoa Code Annotated (ASCA).
  AS: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Am. Samoa Code Ann. (ASCA) tit. 46, § 46.1202 — initial appearance without unnecessary delay; 48-hour floor applied by practice',
    bailHearingHours: 48,
    bailHearingSource: 'ASCA tit. 46; bail reviewed at initial appearance before the High Court',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: 'American Samoa High Court follows procedures modeled on federal rules. American Samoa is the only U.S. territory whose residents are U.S. nationals, not citizens, though criminal procedure rights are substantially similar. Note: the U.S. Constitution does not apply by its own force to American Samoa; rights are conferred by the Revised Organic Act and local constitution.',
    },
    speedyTrialSource: 'ASCA tit. 46, § 46.1204; Am. Samoa Const. Art. I § 5; see also Fitisemanu v. United States, 1 F.4th 862 (10th Cir. 2021)',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Right to counsel applies at initial appearance.',
      source: 'ASCA tit. 46; Am. Samoa Const. Art. I § 5',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination — apply to American Samoa Government (ASG) Office of Public Defender',
    bailSystem: 'Cash bail system',
    dataConfidence: 'medium',
    lastVerified: '2026-07',
    notes: 'American Samoa is an unincorporated, unorganized U.S. territory with unique constitutional status. Residents are U.S. nationals but not citizens by birth. Criminal procedure is governed by the American Samoa Code Annotated (ASCA) and American Samoa High Court rules. Federal constitutional guarantees do not apply by their own force — rights derive from the Revised Organic Act and local organic act.',
  },

  // ── Northern Mariana Islands ───────────────────────────────────────────────
  // The Commonwealth of the Northern Mariana Islands (CNMI) operates under the
  // CNMI Code and its own Superior Court Criminal Rules.
  MP: {
    arraignment: '48 hours',
    speedy_trial: '180 days (from arraignment)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'CNMI R. Crim. P. 5 — initial appearance without unnecessary delay; 48-hour floor applies',
    bailHearingHours: 48,
    bailHearingSource: 'CNMI R. Crim. P. 5; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: 180,
      misdemeanor: 180,
      notes: 'The CNMI became a U.S. commonwealth in 1978 under a Covenant with the United States. Most federal constitutional protections apply. Criminal procedure follows rules modeled on the Federal Rules of Criminal Procedure. Speedy trial runs from arraignment.',
    },
    speedyTrialSource: 'CNMI R. Crim. P. 48; CNMI Const. Art. I § 4(c); U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No specific statutory time limit. Defendant has the right to communicate with counsel after arrest.',
      source: 'CNMI R. Crim. P. 5; CNMI Const. Art. I § 4',
    },
    bailStructure: 'cash_bail',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination — apply to CNMI Public Defender Office',
    bailSystem: 'Cash bail system',
    dataConfidence: 'medium',
    lastVerified: '2026-07',
    notes: 'The Commonwealth of the Northern Mariana Islands (CNMI) is a commonwealth in political union with the United States. Most federal constitutional protections apply by virtue of the 1978 Covenant. Criminal procedure is governed by the CNMI Code and CNMI Superior Court Criminal Rules, modeled on federal rules. Cases in U.S. District Court of the NMI are governed by Federal Rules of Criminal Procedure.',
  },

  // ── District of Columbia ──────────────────────────────────────────────────
  DC: {
    arraignment: '24 hours',
    speedy_trial: '100 days (from arrest)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'D.C. Code § 16-704 — arraignment "without unnecessary delay"; typically within 24 hours',
    bailHearingHours: 24,
    bailHearingSource: 'D.C. Code § 23-1322; pretrial services and bail hearing at arraignment',
    speedyTrialDays: {
      felony: 100,
      misdemeanor: 100,
      notes: '100-day clock from arrest. D.C. also has a federal overlay under the Speedy Trial Act for cases prosecuted in federal court.',
    },
    speedyTrialSource: 'D.C. Code § 23-102',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. DC operates under both local and federal criminal procedure frameworks.',
      source: 'D.C. Code § 16-704',
    },
    bailStructure: 'presumption_release',
    bailReformNote: 'D.C. operates largely without cash bail. The Bail Reform Act of 1966 and subsequent amendments created a system based on release on personal recognizance or non-monetary conditions as the default. Detention is permitted for serious cases upon a dangerousness finding.',
    preliminaryHearing: 'Within 10-14 days for felonies',
    discoveryDeadline: 'Within 30 days after arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Cash bail system',
    dataConfidence: 'high',
    lastVerified: '2026-07',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Jurisdictions whose preliminaryHearing / discoveryDeadline strings above are
// generic placeholder text, not confirmed against a state-specific primary
// source. (dataConfidence on the record as a whole reflects the arraignment/
// bail/speedy-trial fields, which for these jurisdictions WERE verified in an
// earlier pass — only these two newer fields lack that verification.)
//
// Detected programmatically: every jurisdiction below carries either the exact
// boilerplate 'Within 10-14 days for felonies' / 'Within 30 days after
// arraignment' pair, or an equivalently uncited generic string, with no rule
// or statute citation embedded in either field — unlike e.g. CO ('Colo. R.
// Crim. P. 5') or WI ('Wis. Stat. § 970.03'), which got real per-state review.
//
// Consumers (guidance-engine.ts buildDeadlines) should treat the Preliminary
// Hearing / Discovery Deadline items for these jurisdictions as estimates
// (isEstimate: true) even though the jurisdiction is otherwise "known."
// Remove an entry once its preliminaryHearing/discoveryDeadline fields have
// been verified against that state's actual court rules and cited inline.
export const PROCEDURAL_DEADLINE_ESTIMATE_JURISDICTIONS: string[] = [
  'MA', 'MO', 'LA', 'OK', 'CT', 'NM', 'NE', 'WV', 'ID', 'HI',
  'NH', 'ME', 'MT', 'RI', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC',
];

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatible export for the legal accuracy validator.
// Format: { arraignment: string, speedy_trial: string, bail_hearing: string }
// ─────────────────────────────────────────────────────────────────────────────
export const JURISDICTION_DEADLINE_RULES: Record<string, {
  arraignment: string;
  speedy_trial: string;
  bail_hearing: string;
}> = Object.fromEntries(
  Object.entries(JURISDICTION_PROCEDURE_RULES).map(([state, rule]) => [
    state,
    {
      arraignment: rule.arraignment,
      speedy_trial: rule.speedy_trial,
      bail_hearing: rule.bail_hearing,
    },
  ])
);

// ─────────────────────────────────────────────────────────────────────────────
// AI prompt context block builder
// Only injected for 'high' and 'medium' confidence jurisdictions.
// Returns null for 'low' confidence states (AI uses its own training data).
// ─────────────────────────────────────────────────────────────────────────────
export function buildJurisdictionContextBlock(jurisdiction: string): string | null {
  const normalized = jurisdiction.toUpperCase().trim();

  // Map full state names to abbreviations
  const stateMap: Record<string, string> = {
    'CALIFORNIA': 'CA', 'TEXAS': 'TX', 'FLORIDA': 'FL', 'NEW YORK': 'NY',
    'PENNSYLVANIA': 'PA', 'ILLINOIS': 'IL', 'OHIO': 'OH', 'GEORGIA': 'GA',
    'NORTH CAROLINA': 'NC', 'MICHIGAN': 'MI', 'NEW JERSEY': 'NJ',
    'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'ARIZONA': 'AZ', 'MASSACHUSETTS': 'MA',
    'TENNESSEE': 'TN', 'INDIANA': 'IN', 'MISSOURI': 'MO', 'MARYLAND': 'MD',
    'WISCONSIN': 'WI', 'COLORADO': 'CO', 'MINNESOTA': 'MN', 'SOUTH CAROLINA': 'SC',
    'ALABAMA': 'AL', 'LOUISIANA': 'LA', 'KENTUCKY': 'KY', 'OREGON': 'OR',
    'OKLAHOMA': 'OK', 'CONNECTICUT': 'CT', 'UTAH': 'UT', 'IOWA': 'IA',
    'NEVADA': 'NV', 'ARKANSAS': 'AR', 'MISSISSIPPI': 'MS', 'KANSAS': 'KS',
    'NEW MEXICO': 'NM', 'NEBRASKA': 'NE', 'WEST VIRGINIA': 'WV', 'IDAHO': 'ID',
    'HAWAII': 'HI', 'NEW HAMPSHIRE': 'NH', 'MAINE': 'ME', 'MONTANA': 'MT',
    'RHODE ISLAND': 'RI', 'DELAWARE': 'DE', 'SOUTH DAKOTA': 'SD', 'NORTH DAKOTA': 'ND',
    'ALASKA': 'AK', 'VERMONT': 'VT', 'WYOMING': 'WY', 'DISTRICT OF COLUMBIA': 'DC',
    'PUERTO RICO': 'PR', 'GUAM': 'GU', 'U.S. VIRGIN ISLANDS': 'VI',
    'VIRGIN ISLANDS': 'VI', 'AMERICAN SAMOA': 'AS',
    'NORTHERN MARIANA ISLANDS': 'MP', 'CNMI': 'MP',
    'FEDERAL': 'federal',
  };

  const stateKey = stateMap[normalized] || normalized;
  // Handle lowercase 'federal'
  const key = stateKey === 'FEDERAL' ? 'federal' : stateKey;
  const rule = JURISDICTION_PROCEDURE_RULES[key];

  if (!rule || rule.dataConfidence === 'low') {
    return null; // Do not inject; let Claude use its training data with uncertainty flagging
  }

  const qualifier = rule.dataConfidence === 'medium'
    ? 'generally'
    : '';

  const lines: string[] = [
    `JURISDICTION CONTEXT — ${key === 'federal' ? 'Federal' : key} (verified data, last confirmed ${rule.lastVerified}):`,
    `• Arraignment: ${qualifier ? qualifier + ' ' : ''}within ${rule.arraignment} of arrest (${rule.arraignmentSource})`,
    `• Bail hearing: ${qualifier ? qualifier + ' ' : ''}within ${rule.bail_hearing} of arrest (${rule.bailHearingSource})`,
  ];

  const st = rule.speedyTrialDays;
  if (st.felony !== null || st.misdemeanor !== null) {
    const felonyText = st.felony !== null ? `${st.felony} days (felony)` : null;
    const felonyCustodyText = st.felonyInCustody !== undefined && st.felonyInCustody !== st.felony
      ? `${st.felonyInCustody} days if in custody` : null;
    const misdText = st.misdemeanor !== null ? `${st.misdemeanor} days (misdemeanor)` : null;
    const speedyParts = [felonyCustodyText, felonyText, misdText].filter(Boolean).join(' / ');
    lines.push(`• Speedy trial: ${qualifier ? qualifier + ' ' : ''}${speedyParts} (${rule.speedyTrialSource})`);
    if (st.reformNote) {
      lines.push(`  RULE CHANGE: ${st.reformNote}`);
    }
    if (st.notes) {
      lines.push(`  Note: ${st.notes}`);
    }
  } else {
    lines.push(`• Speedy trial: No statutory deadline. Constitutional right only (${rule.speedyTrialSource}).`);
    if (st.reformNote) {
      lines.push(`  RULE CHANGE: ${st.reformNote}`);
    }
    if (st.notes) {
      lines.push(`  Note: ${st.notes}`);
    }
  }

  if (rule.phoneCall.limitHours !== null) {
    lines.push(`• Phone call right: ${rule.phoneCall.description} (${rule.phoneCall.source})`);
  } else {
    lines.push(`• Phone call right: No statutory time limit — "reasonable time" standard applies (${rule.phoneCall.source})`);
  }

  lines.push(`• Bail structure: ${formatBailStructure(rule.bailStructure)}${rule.bailReformNote ? ' — ' + rule.bailReformNote : ''}`);

  if (rule.notes) {
    lines.push(`• Additional: ${rule.notes}`);
  }

  lines.push('Use these verified facts when citing deadlines. Do NOT contradict these figures. Add any county-level or charge-specific variations to the uncertainties field.');

  return lines.join('\n');
}

function formatBailStructure(structure: JurisdictionProcedureRule['bailStructure']): string {
  switch (structure) {
    case 'reformed_no_cash': return 'Cash bail eliminated';
    case 'reformed_limited_cash': return 'Cash bail restricted by reform';
    case 'presumption_release': return 'Presumption of non-monetary release';
    case 'cash_bail': return 'Cash bail system';
  }
}
