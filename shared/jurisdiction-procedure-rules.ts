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
 * Last full data pass: 2026-03
 */

export interface JurisdictionProcedureRule {
  // ── String representations (backward compat with validator) ───────────────
  arraignment: string;   // e.g. "48 hours"
  speedy_trial: string;  // e.g. "60 days (felony) / 30 days (misdemeanor)"
  bail_hearing: string;  // e.g. "48 hours"

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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
      notes: 'Clock runs from arrest or service of notice to appear. After the period expires, defendant may demand trial; if not brought to trial within 10 additional days, case is dismissed.',
    },
    speedyTrialSource: 'Fla. R. Crim. P. 3.191',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit. Defendant must be given reasonable opportunity to communicate with family or attorney.',
      source: 'Fla. Stat. § 951.23 (detention facility requirements)',
    },
    bailStructure: 'cash_bail',
    notes: 'Florida uses a cash bail system with bail schedules. Article I, § 14 of the Florida Constitution governs pretrial release.',
    dataConfidence: 'high',
    lastVerified: '2026-03',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
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
    dataConfidence: 'high',
    lastVerified: '2026-03',
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
    dataConfidence: 'high',
    lastVerified: '2026-03',
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
    dataConfidence: 'high',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
  },

  // ── Missouri ──────────────────────────────────────────────────────────────
  MO: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Mo. R. Crim. P. 22.01 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Mo. R. Crim. P. 22.01; bail set at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Missouri has no statutory speedy trial deadline. Constitutional rights apply under Barker v. Wingo.',
    },
    speedyTrialSource: 'Mo. Const. Art. I § 18(a); U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Mo. Const. Art. I § 18(a)',
    },
    bailStructure: 'cash_bail',
    dataConfidence: 'low',
    lastVerified: '2026-03',
    notes: 'Data needs verification against current Missouri Rules of Criminal Procedure.',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
  },

  // ── Arkansas ──────────────────────────────────────────────────────────────
  AR: {
    arraignment: '48 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '48 hours',
    arraignmentHours: 48,
    arraignmentSource: 'Ark. R. Crim. P. 8.1 — initial appearance "without unnecessary delay"',
    bailHearingHours: 48,
    bailHearingSource: 'Ark. R. Crim. P. 9.2; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Arkansas has no statutory speedy trial act with day limits. Constitutional rights apply.',
    },
    speedyTrialSource: 'Ark. Const. Art. II § 10; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Ark. R. Crim. P. 8.1',
    },
    bailStructure: 'cash_bail',
    dataConfidence: 'low',
    lastVerified: '2026-03',
    notes: 'Data needs verification against current Arkansas Rules of Criminal Procedure.',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
  },

  // ── Delaware ──────────────────────────────────────────────────────────────
  DE: {
    arraignment: '24 hours',
    speedy_trial: 'No statutory deadline (constitutional right only)',
    bail_hearing: '24 hours',
    arraignmentHours: 24,
    arraignmentSource: 'Del. Super. Ct. Crim. R. 5 — initial appearance "without unnecessary delay"',
    bailHearingHours: 24,
    bailHearingSource: 'Del. Super. Ct. Crim. R. 46; bail reviewed at initial appearance',
    speedyTrialDays: {
      felony: null,
      misdemeanor: null,
      notes: 'Delaware has no statutory speedy trial deadline. Constitutional rights apply.',
    },
    speedyTrialSource: 'Del. Const. Art. I § 7; U.S. Const. amend. VI',
    phoneCall: {
      limitHours: null,
      description: 'No statutory time limit.',
      source: 'Del. Super. Ct. Crim. R. 5',
    },
    bailStructure: 'cash_bail',
    dataConfidence: 'low',
    lastVerified: '2026-03',
    notes: 'Data needs verification against current Delaware court rules.',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
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
    dataConfidence: 'medium',
    lastVerified: '2026-03',
  },
};

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
    if (st.notes) {
      lines.push(`  Note: ${st.notes}`);
    }
  } else {
    lines.push(`• Speedy trial: No statutory deadline. Constitutional right only (${rule.speedyTrialSource}).`);
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
