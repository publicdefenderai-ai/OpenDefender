/**
 * Collateral Consequences — 50-State + DC Data
 *
 * Covers four categories where consequences vary materially by state:
 *   1. Voting rights restoration
 *   2. Employment (ban-the-box, occupational licensing)
 *   3. Public benefits (SNAP / TANF drug felony ban opt-out)
 *   4. Housing (fair chance housing laws beyond federal baseline)
 *
 * Federal baseline rules that apply uniformly in all states are NOT
 * repeated here — they are documented on the collateral-consequences page.
 * Only state-specific variations are stored in this file.
 *
 * Data sources:
 *   - CCRC (Collateral Consequences Resource Center): ccresourcecenter.org
 *   - NCSL ban-the-box tracker: ncsl.org
 *   - USDA FNS SNAP drug felony ban state option reports
 *   - CLASP state snapshots (SNAP/TANF)
 *   - NELP fair chance hiring tracker: nelp.org
 *   - ProCon.org felon voting rights tracker
 *   - Individual state statutes as cited per entry
 *
 * Quarterly review: entries with lastVerified dates older than 12 months
 * should be re-checked against the sources listed above and in SOURCES.md.
 *
 * Data confidence tiers:
 *   'high'   — verified against primary statutory source; specific citation exists
 *   'medium' — verified against secondary source (NCSL, CCRC, NELP); plausible
 *   'low'    — inference or placeholder; do NOT surface to users as authoritative
 */

// ── Voting Rights ─────────────────────────────────────────────────────────────

/**
 * The point at which voting rights are restored after a felony conviction.
 * 'incarcerated' = can vote even while in prison.
 * 'on_release'   = automatic upon release; can vote during parole/probation.
 * 'parole_complete' = must complete parole but not probation.
 * 'supervision_complete' = must complete all supervision (parole + probation).
 * 'waiting_period' = waiting period after completing supervision.
 * 'application_required' = must apply or petition for restoration.
 * 'permanent_bar' = permanent bar for at least some felony classes.
 */
export type VotingRestorationPoint =
  | 'incarcerated'
  | 'on_release'
  | 'parole_complete'
  | 'supervision_complete'
  | 'waiting_period'
  | 'application_required'
  | 'permanent_bar';

export interface VotingRightsRule {
  restorationPoint: VotingRestorationPoint;
  /** True if restoration happens without any petition or application. */
  automaticRestoration: boolean;
  /** Waiting period in years after supervision ends, if applicable. */
  waitingPeriodYears?: number;
  /** True only for ME and VT (and OR as of 2024). */
  canVoteWhileIncarcerated: boolean;
  source: string;
  notes?: string;
}

// ── Employment ────────────────────────────────────────────────────────────────

/**
 * 'none'         = no statewide BTB law (local ordinances may apply).
 * 'public_only'  = BTB applies to state/local government employers only.
 * 'private_also' = BTB applies to private employers (usually after conditional offer).
 */
export type BanTheBoxScope = 'none' | 'public_only' | 'private_also';

export interface EmploymentRule {
  banTheBoxScope: BanTheBoxScope;
  /** When in the hiring process criminal history may first be asked. */
  banTheBoxTrigger?: string;
  banTheBoxSource?: string;
  /**
   * True if state law requires a "nexus" / "direct relationship" between
   * the conviction and the license before a license can be denied.
   */
  licensingNexusReform: boolean;
  licensingNexusSource?: string;
  notes?: string;
}

// ── Public Benefits ───────────────────────────────────────────────────────────

/**
 * Status of the PRWORA (1996) drug felony benefit ban for each program.
 * 'full_ban'     = state retains the federal lifetime ban.
 * 'modified'     = state partially opted out (conditions apply — see details).
 * 'no_ban'       = state fully opted out; drug felony convictions do not affect eligibility.
 */
export type DrugFelonyBanStatus = 'full_ban' | 'modified' | 'no_ban';

export interface BenefitsRule {
  snapDrugFelonyBan: DrugFelonyBanStatus;
  snapDetails?: string;
  snapSource?: string;
  tanfDrugFelonyBan: DrugFelonyBanStatus;
  tanfDetails?: string;
  tanfSource?: string;
  notes?: string;
}

// ── Housing ───────────────────────────────────────────────────────────────────

export interface HousingRule {
  /**
   * True if the state has a statewide fair chance housing law restricting
   * private landlord use of criminal history. Federal public housing rules
   * apply uniformly and are NOT captured here.
   */
  fairChanceHousingLaw: boolean;
  fairChanceHousingSource?: string;
  /** Does the law cover criminal history inquiries on rental applications? */
  coversCriminalHistoryOnApplication?: boolean;
  notes?: string;
}

// ── Top-level Rule ─────────────────────────────────────────────────────────────

export interface CollateralConsequenceRule {
  /** Two-letter state code or 'DC'. */
  state: string;
  stateName: string;
  dataConfidence: 'high' | 'medium' | 'low';
  lastVerified: string; // 'YYYY-MM'
  voting: VotingRightsRule;
  employment: EmploymentRule;
  benefits: BenefitsRule;
  housing: HousingRule;
}

// ── Data ───────────────────────────────────────────────────────────────────────
// Entries are populated as research is verified. Entries with dataConfidence
// 'low' are retained as starting points for quarterly review and are NOT
// injected into AI prompts or surfaced to users as authoritative facts.

export const COLLATERAL_CONSEQUENCE_RULES: Record<string, CollateralConsequenceRule> = {

  // ── Alabama ────────────────────────────────────────────────────────────────
  AL: {
    state: 'AL', stateName: 'Alabama',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'application_required',
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Ala. Code § 17-3-30.1 (2017 — Certificate of Eligibility to Register to Vote)',
      notes: 'SB 98 (2017) created a list of disqualifying felonies; convictions for crimes not on the list receive a Certificate of Eligibility automatically upon release. For disqualifying crimes, a Board of Pardons and Paroles petition is required.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxTrigger: 'After interview for public positions',
      banTheBoxSource: 'Ala. Executive Order No. 21 (2019)',
      licensingNexusReform: true,
      licensingNexusSource: 'Ala. Code § 41-22-1 et seq.; HB 244 (2019) — nexus required for occupational licensing',
    },
    benefits: {
      snapDrugFelonyBan: 'full_ban',
      snapDetails: 'Alabama retains the full federal lifetime SNAP ban for drug felony convictions.',
      snapSource: 'USDA FNS Drug Felony Conviction State Options; CLASP 2022',
      tanfDrugFelonyBan: 'full_ban',
      tanfDetails: 'Alabama retains the full federal lifetime TANF ban for drug felony convictions.',
    },
    housing: {
      fairChanceHousingLaw: false,
      notes: 'No statewide fair chance housing law. Federal HUD mandatory exclusions apply.',
    },
  },

  // ── Alaska ─────────────────────────────────────────────────────────────────
  AK: {
    state: 'AK', stateName: 'Alaska',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Alaska Const. Art. V § 2; Alaska Stat. § 15.05.030',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Alaska Admin. Order 266 (2017)',
      licensingNexusReform: true,
      licensingNexusSource: 'Alaska Stat. § 08.01.075 — licensure cannot be denied solely due to prior conviction without nexus finding',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Alaska fully opted out of the federal drug felony SNAP ban.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Alaska fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Arizona ────────────────────────────────────────────────────────────────
  AZ: {
    state: 'AZ', stateName: 'Arizona',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ariz. Rev. Stat. § 13-912',
      notes: 'First felony: automatic restoration upon absolute discharge (including probation). Second felony: must wait 2 years after absolute discharge. More than 2 felonies: must apply to court.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Ariz. Rev. Stat. § 41-1750.01 (2017)',
      licensingNexusReform: true,
      licensingNexusSource: 'Ariz. Rev. Stat. § 41-1093 et seq. (2019 licensing reform)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Ban applies during supervision; lifted after probation/parole complete.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'Modified ban tied to supervision status.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Arkansas ───────────────────────────────────────────────────────────────
  AR: {
    state: 'AR', stateName: 'Arkansas',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ark. Const. Art. III § 5; Ark. Code Ann. § 5-4-930',
      notes: 'Rights restored automatically upon completing sentence, parole, and probation.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Ark. Code Ann. § 17-1-103 (2019) — licensing boards must consider nexus to occupation',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Ban limited to drug trafficking convictions; other drug felonies eligible after completing sentence.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'Modified; excluded for trafficking offenses.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── California ─────────────────────────────────────────────────────────────
  CA: {
    state: 'CA', stateName: 'California',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Cal. Const. Art. II § 4; Cal. Elec. Code § 2101; AB 646 (2021)',
      notes: 'Rights restored upon release from state prison. People on parole can vote as of Prop 17 (2020). People on probation could always vote. People in county jail (including those serving realignment sentences) can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer of employment',
      banTheBoxSource: 'Cal. Gov. Code § 12952 (AB 1008, 2018) — Fair Chance Act; amended by SB 1345 (2024)',
      licensingNexusReform: true,
      licensingNexusSource: 'Cal. Bus. & Prof. Code § 480 (amended 2020) — "substantially related" standard for license denial',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'California fully opted out. Drug felony convictions do not affect CalFresh (SNAP) eligibility.',
      snapSource: 'Cal. Welf. & Inst. Code § 18901.3',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'California fully opted out. Drug felony convictions do not affect CalWORKs (TANF) eligibility.',
      tanfSource: 'Cal. Welf. & Inst. Code § 11251.3',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Local ordinances in LA, San Francisco, Oakland, Richmond — no statewide private landlord law as of 2026',
      coversCriminalHistoryOnApplication: true,
      notes: 'No statewide fair chance housing law for private landlords, but major cities have enacted local protections. State law restricts public housing and subsidized housing criminal history screening.',
    },
  },

  // ── Colorado ───────────────────────────────────────────────────────────────
  CO: {
    state: 'CO', stateName: 'Colorado',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Colo. Const. Art. VII § 10; Colo. Rev. Stat. § 1-2-103',
      notes: 'Rights restored automatically upon release from incarceration. Parolees can vote. Probationers can always vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer for employers with 11+ employees',
      banTheBoxSource: 'Colo. Rev. Stat. § 8-2-130 (SB 01-094 as amended); Denver Fair Chance for Housing Ordinance',
      licensingNexusReform: true,
      licensingNexusSource: 'Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Colorado fully opted out.',
      snapSource: 'Colo. Rev. Stat. § 26-2-106',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Colorado fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Denver Fair Chance for Housing Ordinance (Ord. 21-1370, eff. Jan. 2022); no statewide private landlord law',
      coversCriminalHistoryOnApplication: true,
      notes: 'Denver prohibits criminal history inquiries on rental applications before conditional approval. No statewide law covering all private landlords.',
    },
  },

  // ── Connecticut ────────────────────────────────────────────────────────────
  CT: {
    state: 'CT', stateName: 'Connecticut',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Conn. Gen. Stat. § 9-46; PA 21-2 (2021)',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote as of 2021 legislation.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After interview (for employers with 1+ employee)',
      banTheBoxSource: 'Conn. Gen. Stat. § 31-51i (expanded 2016)',
      licensingNexusReform: true,
      licensingNexusSource: 'Conn. Gen. Stat. § 46a-80 — "reasonable relationship" required for license denial',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Connecticut fully opted out.',
      snapSource: 'Conn. Gen. Stat. § 17b-691',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Connecticut fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
      notes: 'No statewide fair chance housing law for private landlords. Some municipal protections may apply.',
    },
  },

  // ── Delaware ───────────────────────────────────────────────────────────────
  DE: {
    state: 'DE', stateName: 'Delaware',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'waiting_period',
      waitingPeriodYears: 5,
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Del. Const. Art. V § 2',
      notes: 'Automatic restoration 5 years after completing sentence (including probation/parole) for most felonies. Certain violent crimes and election offenses require a legislative vote for restoration.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Del. Code Ann. tit. 29 § 6909B (2014)',
      licensingNexusReform: true,
      licensingNexusSource: 'Del. Code Ann. tit. 29 § 8735(y) (2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'SNAP ban applies only while incarcerated; lifted upon release if otherwise eligible.',
      snapSource: 'CLASP 2022; USDA FNS state options',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF ban ends upon release from incarceration.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── DC ─────────────────────────────────────────────────────────────────────
  DC: {
    state: 'DC', stateName: 'District of Columbia',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'D.C. Code § 1-1001.02(2)',
      notes: 'Parolees and probationers can vote. Only people physically incarcerated are disenfranchised.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer',
      banTheBoxSource: 'D.C. Code § 32-1341 et seq. (Fair Criminal Record Screening Act, 2014)',
      licensingNexusReform: true,
      licensingNexusSource: 'D.C. Code § 47-2853.17 (2019 amendment)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'DC fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'DC fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'D.C. Code § 42-3505.08 (Fair Criminal Record Screening for Housing Act, 2016)',
      coversCriminalHistoryOnApplication: true,
      notes: 'Landlords may not inquire about criminal history until after a conditional rental offer. Certain crimes involving violence or property may still be considered after a conditional offer.',
    },
  },

  // ── Florida ────────────────────────────────────────────────────────────────
  FL: {
    state: 'FL', stateName: 'Florida',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Fla. Const. Art. VI § 4 (Amendment 4, 2018); Fla. Stat. § 98.0751',
      notes: 'Amendment 4 (2018) restored automatic voting rights upon completing sentence (prison, parole, and probation) EXCEPT for murder and sex offense convictions. SB 7066 (2019) added requirement that all court-ordered financial obligations (fines, fees, restitution) must be paid before registration. Murder and sex offense convictions still require a clemency petition to the Board of Executive Clemency.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: false,
      notes: 'Florida has no statewide BTB law. Some local ordinances apply in Miami-Dade and other jurisdictions. Licensing boards have broad discretion to deny based on criminal history without a mandatory nexus finding.',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Florida modified the ban: applies only while on probation or parole supervision; eligibility restored upon completion.',
      snapSource: 'Fla. Stat. § 414.105',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF modified; testing and treatment requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Georgia ────────────────────────────────────────────────────────────────
  GA: {
    state: 'GA', stateName: 'Georgia',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ga. Const. Art. II § 1 ¶ III; O.C.G.A. § 21-2-216',
      notes: 'Rights restored automatically upon completing all supervision (prison, parole, and probation). No application required.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Ga. Executive Order (2015); Atlanta BTB ordinance (2013)',
      licensingNexusReform: true,
      licensingNexusSource: 'O.C.G.A. § 43-1-19 (amended 2021) — direct relationship standard',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Ban applies only while on probation; lifted upon completion.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'Modified for TANF as well.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Hawaii ─────────────────────────────────────────────────────────────────
  HI: {
    state: 'HI', stateName: 'Hawaii',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Haw. Rev. Stat. § 831-2',
      notes: 'Rights restored upon release. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 1+ employee)',
      banTheBoxSource: 'Haw. Rev. Stat. § 378-2.5 (1998, amended) — one of the earliest BTB states',
      licensingNexusReform: true,
      licensingNexusSource: 'Haw. Rev. Stat. § 831-3.1 (nexus required for license denial)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Hawaii fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Hawaii fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Idaho ──────────────────────────────────────────────────────────────────
  ID: {
    state: 'ID', stateName: 'Idaho',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Idaho Const. Art. VI § 3; Idaho Code § 18-310',
      notes: 'Rights restored upon completing all supervision including probation and parole.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Idaho Code § 67-9406 (HB 357, 2020) — nexus requirement for occupational licensing',
    },
    benefits: {
      snapDrugFelonyBan: 'full_ban',
      snapDetails: 'Idaho retains the full federal lifetime SNAP ban for drug felony convictions.',
      snapSource: 'USDA FNS Drug Felony Conviction State Options; CLASP 2022',
      tanfDrugFelonyBan: 'full_ban',
      tanfDetails: 'Idaho retains the full federal lifetime TANF ban for drug felony convictions.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Illinois ───────────────────────────────────────────────────────────────
  IL: {
    state: 'IL', stateName: 'Illinois',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ill. Const. Art. III § 2; 10 ILCS 5/3-5',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 15+ employees)',
      banTheBoxSource: 'Illinois Human Rights Act, 775 ILCS 5/2-103.1 (Job Opportunities for Qualified Applicants Act, 2015)',
      licensingNexusReform: true,
      licensingNexusSource: 'IL Fair Licensure for Returned Citizens Act (SB 1814, 2021); 225 ILCS 450/2 et al.',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Illinois fully opted out.',
      snapSource: '305 ILCS 5/9A-6.1',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Illinois fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Chicago RLTO § 5-12-170; Cook County Just Housing Amendment (2020)',
      coversCriminalHistoryOnApplication: true,
      notes: 'Chicago and Cook County have fair chance housing protections. No statewide private landlord law yet.',
    },
  },

  // ── Indiana ────────────────────────────────────────────────────────────────
  IN: {
    state: 'IN', stateName: 'Indiana',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ind. Const. Art. II § 8; Ind. Code § 3-7-13-4',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Ind. Code § 25-1-1.2-5 (HEA 1059, 2020) — individualized assessment required',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Indiana fully opted out of the SNAP drug felony ban.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirement; ineligible while testing positive.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Iowa ────────────────────────────────────────────────────────────────────
  IA: {
    state: 'IA', stateName: 'Iowa',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Iowa Const. Art. II § 5; Executive Order 7 (Governor Reynolds, 2020)',
      notes: 'Governor Reynolds (2020) Executive Order made restoration automatic for most felony convictions upon completing sentence. People convicted of homicide must still petition Board of Pardons. Previously required individual clemency petition.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Iowa Executive Order (2012)',
      licensingNexusReform: true,
      licensingNexusSource: 'Iowa Code § 272C.2(2) (2020) — nexus required for license denial',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Iowa fully opted out of the SNAP drug felony ban.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing and treatment requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Kansas ─────────────────────────────────────────────────────────────────
  KS: {
    state: 'KS', stateName: 'Kansas',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Kan. Stat. Ann. § 21-6613; Kan. Const. Art. V § 2',
      notes: 'Rights restored upon completing all supervision. Conviction for treason results in permanent bar.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Kan. Stat. Ann. § 74-120 (SB 367, 2020)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Kansas fully opted out of the SNAP drug felony ban.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing required; ineligibility if testing positive.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Kentucky ───────────────────────────────────────────────────────────────
  KY: {
    state: 'KY', stateName: 'Kentucky',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'application_required',
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Ky. Const. § 145; Executive Order 2019-003 (Governor Beshear)',
      notes: 'Most non-violent felonies: automatic restoration per 2019 executive order upon completing sentence. Violent felonies, sex offenses, bribery, and treason still require a gubernatorial pardon or legislative bill. Kentucky constitution requires legislative action for a permanent fix; the executive order is subject to reversal.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Ky. Executive Order 2017-426',
      licensingNexusReform: true,
      licensingNexusSource: 'Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Kentucky fully opted out of the SNAP drug felony ban.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Louisiana ──────────────────────────────────────────────────────────────
  LA: {
    state: 'LA', stateName: 'Louisiana',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'La. Const. Art. I § 10; La. Rev. Stat. § 18:102 (amended 2019)',
      notes: 'HB 265 (2019) restored voting rights 5 years after release from incarceration for those on probation/parole (previously had to wait until fully off supervision). As of 2019, people are eligible to vote after completing their prison sentence and 5 years, even if still on parole/probation.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'La. Rev. Stat. § 42:1701.1 (2021 expansion)',
      licensingNexusReform: true,
      licensingNexusSource: 'La. Rev. Stat. § 37:2950 (HB 707, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Louisiana modified the ban: applies only during active sentence; restored after sentence completion.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: modified; drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Maine ──────────────────────────────────────────────────────────────────
  ME: {
    state: 'ME', stateName: 'Maine',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'incarcerated',
      automaticRestoration: true,
      canVoteWhileIncarcerated: true,
      source: 'Me. Const. Art. II § 1; 21-A Me. Rev. Stat. § 112',
      notes: 'Maine never disenfranchises for felony conviction. People can vote from prison. One of only two states (with Vermont) with no felony disenfranchisement.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Me. Rev. Stat. tit. 5 § 784 (2019)',
      licensingNexusReform: true,
      licensingNexusSource: 'Me. Rev. Stat. tit. 32 § 13862-A (2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Maine fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Maine fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Maryland ───────────────────────────────────────────────────────────────
  MD: {
    state: 'MD', stateName: 'Maryland',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Md. Const. Art. I § 4; Md. Code Ann., Elec. Law § 3-102(b) (2016)',
      notes: 'SB 340 (2016) restored voting upon release from incarceration. Prior to 2016, required completion of probation/parole. Parolees and probationers can now vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After interview (employers with 15+ employees)',
      banTheBoxSource: 'Md. Code Ann., Lab. & Empl. § 3-711 (HB 994, 2020)',
      licensingNexusReform: true,
      licensingNexusSource: 'Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Maryland fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Maryland fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
      notes: 'Baltimore City has a fair chance housing ordinance. No statewide private landlord law.',
    },
  },

  // ── Massachusetts ──────────────────────────────────────────────────────────
  MA: {
    state: 'MA', stateName: 'Massachusetts',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Mass. Const. Art. III (amended); M.G.L. c. 51 § 1',
      notes: 'Rights restored upon release. Parolees and probationers can vote. People in pretrial detention can vote by absentee ballot.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 6+ employees)',
      banTheBoxSource: 'M.G.L. c. 151B § 4(9½) (CORI Reform Act, 2010, amended 2018)',
      licensingNexusReform: true,
      licensingNexusSource: 'M.G.L. c. 6A § 18M (An Act Relative to Criminal Justice Reform, 2018)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Massachusetts fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Massachusetts fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'M.G.L. c. 151B § 4(9) (CORI reform provisions apply to housing); Boston Fair Chance for Housing ordinance',
      coversCriminalHistoryOnApplication: true,
      notes: 'State CORI reform restricts when landlords can inquire about criminal history. Landlords with 6+ units must follow CORI fair housing standards.',
    },
  },

  // ── Michigan ───────────────────────────────────────────────────────────────
  MI: {
    state: 'MI', stateName: 'Michigan',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Mich. Const. Art. II § 2; MCL § 168.758b',
      notes: 'Rights restored upon release. Parolees can vote. Probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Mich. Executive Directive 2018-4',
      licensingNexusReform: true,
      licensingNexusSource: 'MCL § 338.41 et seq. (Occupational Code amendments, 2018)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Michigan fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Michigan fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Minnesota ──────────────────────────────────────────────────────────────
  MN: {
    state: 'MN', stateName: 'Minnesota',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Minn. Stat. § 201.014 subd. 2a (HF 28, 2023 — eff. Jan. 1, 2024)',
      notes: 'HF 28 (2023) restored voting rights to people on felony probation and parole, effective January 1, 2024. Rights are restored upon release from incarceration. Before 2024, rights were restored only after completing all supervision.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 1+ employee)',
      banTheBoxSource: 'Minn. Stat. § 364.021 (2014, expanded 2023)',
      licensingNexusReform: true,
      licensingNexusSource: 'Minn. Stat. § 364.03 — "direct relationship" standard for licensing',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Minnesota fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Minnesota fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Minneapolis Fair Chance in Housing Ordinance (2020); St. Paul similar ordinance',
      coversCriminalHistoryOnApplication: true,
      notes: 'Minneapolis prohibits criminal history on rental applications. No statewide private landlord law.',
    },
  },

  // ── Mississippi ────────────────────────────────────────────────────────────
  MS: {
    state: 'MS', stateName: 'Mississippi',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'application_required',
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Miss. Const. Art. XII § 241',
      notes: 'Mississippi permanently disenfranchises for a list of specified offenses including murder, rape, bribery, theft, arson, obtaining money under false pretense, perjury, forgery, embezzlement, bigamy, and certain other offenses. Restoration requires either a 2/3 vote of both chambers of the legislature OR a gubernatorial pardon. This is among the strictest disenfranchisement regimes in the country.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: false,
      notes: 'No statewide ban-the-box law or occupational licensing nexus reform as of 2026.',
    },
    benefits: {
      snapDrugFelonyBan: 'full_ban',
      snapDetails: 'Mississippi retains the full federal lifetime SNAP ban for drug felony convictions.',
      snapSource: 'USDA FNS Drug Felony Conviction State Options; CLASP 2022',
      tanfDrugFelonyBan: 'full_ban',
      tanfDetails: 'Mississippi retains the full federal lifetime TANF ban for drug felony convictions.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Missouri ───────────────────────────────────────────────────────────────
  MO: {
    state: 'MO', stateName: 'Missouri',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Mo. Const. Art. VIII § 2; Mo. Rev. Stat. § 115.133',
      notes: 'Rights restored automatically upon release from incarceration. Parole and probation do NOT extend disenfranchisement — parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'none',
      notes: 'No statewide ban-the-box law in Missouri. Executive Order 16-04 (2016) covered state agencies but was not a codified statewide BTB law.',
      licensingNexusReform: true,
      licensingNexusSource: 'Mo. Rev. Stat. § 324.011 (SB 262, 2021) — nexus required for license denial',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'SNAP ban lifted after sentence served; no drug treatment requirement.',
      snapSource: 'CLASP 2022; USDA FNS state options',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: ban lifted after sentence served; drug testing requirements may apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Montana ────────────────────────────────────────────────────────────────
  MT: {
    state: 'MT', stateName: 'Montana',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Mont. Code Ann. § 13-1-111',
      notes: 'Rights restored automatically upon completing sentence including parole and probation.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Mont. Code Ann. § 37-1-203 (SB 212, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Montana fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Nebraska ───────────────────────────────────────────────────────────────
  NE: {
    state: 'NE', stateName: 'Nebraska',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'waiting_period',
      waitingPeriodYears: 2,
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Neb. Const. Art. VI § 2; Neb. Rev. Stat. § 32-313',
      notes: 'Rights restored automatically 2 years after completing all supervision (sentence, parole, and probation).',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Executive Order (2014)',
      licensingNexusReform: true,
      licensingNexusSource: 'Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Nebraska fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: modified with treatment requirements.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Nevada ─────────────────────────────────────────────────────────────────
  NV: {
    state: 'NV', stateName: 'Nevada',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Nev. Const. Art. II § 1; NRS § 213.157 (AB 431, 2019)',
      notes: 'AB 431 (2019) restored voting rights automatically upon release from incarceration. Prior to 2019, required completion of parole. Parolees can now vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After initial application screening (employers with 15+ employees)',
      banTheBoxSource: 'NRS § 613.133 (AB 384, 2017)',
      licensingNexusReform: true,
      licensingNexusSource: 'NRS § 622A.300 (AB 384, 2017 — nexus required)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Nevada fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── New Hampshire ──────────────────────────────────────────────────────────
  NH: {
    state: 'NH', stateName: 'New Hampshire',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.H. Rev. Stat. Ann. § 607-A:2',
      notes: 'Rights restored upon release. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'N.H. Rev. Stat. Ann. § 21-I:52-a (2016)',
      licensingNexusReform: true,
      licensingNexusSource: 'N.H. Rev. Stat. Ann. § 332-G:8 (2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'New Hampshire fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── New Jersey ─────────────────────────────────────────────────────────────
  NJ: {
    state: 'NJ', stateName: 'New Jersey',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.J. Stat. Ann. § 19:4-1 (amended 2020); P.L. 2019, c. 270',
      notes: 'P.L. 2019, c. 270 (eff. March 17, 2020) restored voting rights upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 15+ employees)',
      banTheBoxSource: 'N.J. Stat. Ann. § 34:6B-14 et seq. (Opportunity to Compete Act, 2015)',
      licensingNexusReform: true,
      licensingNexusSource: 'N.J. Stat. Ann. § 45:1-21.1 (2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'New Jersey fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'New Jersey fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'N.J. Stat. Ann. § 46:8-52 et seq. (Fair Chance in Housing Act, 2021)',
      coversCriminalHistoryOnApplication: true,
      notes: 'New Jersey enacted a statewide Fair Chance in Housing Act (2021) prohibiting landlords from inquiring about criminal history before making a conditional rental offer. One of the strongest statewide fair chance housing laws in the country.',
    },
  },

  // ── New Mexico ─────────────────────────────────────────────────────────────
  NM: {
    state: 'NM', stateName: 'New Mexico',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.M. Const. Art. VII § 1; NMSA 1978 § 31-13-1',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer',
      banTheBoxSource: 'NMSA 1978 § 28-2-3 (amended 2019)',
      licensingNexusReform: true,
      licensingNexusSource: 'NMSA 1978 § 61-1-34 (2019 amendment)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'New Mexico fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'New Mexico fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── New York ───────────────────────────────────────────────────────────────
  NY: {
    state: 'NY', stateName: 'New York',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.Y. Elec. Law § 5-106 (amended 2021); L. 2021, ch. 94',
      notes: 'L. 2021, ch. 94 restored voting rights upon release from incarceration. Prior to April 2021, required completing parole. Parolees can now vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (all employers)',
      banTheBoxSource: 'N.Y. Correct. Law § 752–753; N.Y.C. Fair Chance Act (Local Law 63, 2015)',
      licensingNexusReform: true,
      licensingNexusSource: 'N.Y. Correct. Law § 752 — "direct relationship" standard statewide',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'New York fully opted out.',
      snapSource: 'N.Y. Soc. Serv. Law § 131-a',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'New York fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'N.Y.C. Local Law 63 (2015); N.Y.C. Human Rights Law § 8-107.2',
      coversCriminalHistoryOnApplication: true,
      notes: 'NYC Fair Chance Act covers housing. State law (N.Y. Correct. Law § 752) restricts denying housing based solely on criminal history statewide, using a direct relationship / public policy balancing test.',
    },
  },

  // ── North Carolina ─────────────────────────────────────────────────────────
  NC: {
    state: 'NC', stateName: 'North Carolina',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.C. Gen. Stat. § 13-1',
      notes: 'Current operative law requires completing all supervision (prison, parole, and probation). A 2023 Superior Court ruling (Community Success Initiative v. Moore) temporarily suspended this, but the NC Supreme Court reversed. People on parole or probation cannot vote under current law. Verify — litigation was ongoing as of mid-2025.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'N.C. Executive Order 142 (2019)',
      licensingNexusReform: true,
      licensingNexusSource: 'N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'North Carolina modified the ban: applies only while on probation/parole supervision.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing and treatment requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── North Dakota ───────────────────────────────────────────────────────────
  ND: {
    state: 'ND', stateName: 'North Dakota',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'N.D. Cent. Code § 12.1-33-01',
      notes: 'Rights restored automatically upon release from incarceration. Parole and probation do not extend disenfranchisement.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'North Dakota fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Ohio ───────────────────────────────────────────────────────────────────
  OH: {
    state: 'OH', stateName: 'Ohio',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Ohio Rev. Code Ann. § 2961.01',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Ohio Executive Order 2015-07K',
      licensingNexusReform: true,
      licensingNexusSource: 'Ohio Rev. Code Ann. § 9.79 (SB 255, 2012) — direct relationship standard; HB 263 (2021) expanded',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Ohio fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply; eligibility conditional.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Oklahoma ───────────────────────────────────────────────────────────────
  OK: {
    state: 'OK', stateName: 'Oklahoma',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Okla. Const. Art. III § 1; Okla. Stat. tit. 26 § 4-101',
      notes: 'Rights restored automatically upon completing all supervision.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Oklahoma modified the ban: applies during active supervision; restored after completion.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Oregon ─────────────────────────────────────────────────────────────────
  OR: {
    state: 'OR', stateName: 'Oregon',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'incarcerated',
      automaticRestoration: true,
      canVoteWhileIncarcerated: true,
      source: 'Or. Rev. Stat. § 137.281 (HB 2107, 2023 — eff. Jan. 1, 2024)',
      notes: 'HB 2107 (2023) restored voting rights to people currently incarcerated in Oregon state prisons, effective January 1, 2024. Oregon joins Maine and Vermont as the only states allowing voting while incarcerated.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 1+ employee)',
      banTheBoxSource: 'Or. Rev. Stat. § 659A.360 (SB 1532, 2015)',
      licensingNexusReform: true,
      licensingNexusSource: 'Or. Rev. Stat. § 676.612 (HB 2009, 2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Oregon fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Oregon fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Or. Rev. Stat. § 90.303 (Fair Chance Housing Act, 2021)',
      coversCriminalHistoryOnApplication: true,
      notes: 'Oregon enacted a statewide Fair Chance Housing Act (2021) restricting landlord use of criminal history on rental applications.',
    },
  },

  // ── Pennsylvania ───────────────────────────────────────────────────────────
  PA: {
    state: 'PA', stateName: 'Pennsylvania',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Pa. Const. Art. VII § 1; 25 Pa. C.S. § 1301',
      notes: 'Rights restored upon release. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 1+ employee)',
      banTheBoxSource: '18 Pa. C.S. § 9125; Philadelphia Fair Criminal Records Screening Ordinance (2011)',
      licensingNexusReform: true,
      licensingNexusSource: '63 Pa. C.S. § 3113 (SB 637, 2020) — nexus required',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Pennsylvania fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Pennsylvania fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
      notes: 'Philadelphia has a fair chance housing ordinance. No statewide private landlord law.',
    },
  },

  // ── Rhode Island ───────────────────────────────────────────────────────────
  RI: {
    state: 'RI', stateName: 'Rhode Island',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'R.I. Const. Art. II § 1; R.I. Gen. Laws § 17-1-3.1 (2006)',
      notes: 'Rights restored upon release. Rhode Island restored voting to people on probation and parole in 2006. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 4+ employees)',
      banTheBoxSource: 'R.I. Gen. Laws § 28-5-7 (Fair Chance Act, 2022)',
      licensingNexusReform: true,
      licensingNexusSource: 'R.I. Gen. Laws § 5-76-2 (2022)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Rhode Island fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Rhode Island fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── South Carolina ─────────────────────────────────────────────────────────
  SC: {
    state: 'SC', stateName: 'South Carolina',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'S.C. Const. Art. II § 7; S.C. Code Ann. § 7-5-120',
      notes: 'Rights restored upon completing all supervision.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: false,
      notes: 'No statewide BTB law or licensing nexus reform as of 2026.',
    },
    benefits: {
      snapDrugFelonyBan: 'full_ban',
      snapDetails: 'South Carolina retains the full federal lifetime SNAP ban for drug felony convictions.',
      snapSource: 'USDA FNS Drug Felony Conviction State Options; CLASP 2022',
      tanfDrugFelonyBan: 'full_ban',
      tanfDetails: 'South Carolina retains the full federal lifetime TANF ban for drug felony convictions.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── South Dakota ───────────────────────────────────────────────────────────
  SD: {
    state: 'SD', stateName: 'South Dakota',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'S.D. Const. Art. VII § 2; SDCL § 23A-27A-35',
      notes: 'Rights restored upon completing all supervision.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'SDCL § 36-2A-9 (SB 72, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Modified ban; conditions apply during supervision.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Tennessee ──────────────────────────────────────────────────────────────
  TN: {
    state: 'TN', stateName: 'Tennessee',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'application_required',
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Tenn. Code Ann. § 40-29-202',
      notes: 'Most felony convictions: rights can be restored after completing all supervision by obtaining a Certificate of Restoration. Certain serious felonies (first-degree murder, rape, treason, voter fraud, others) result in permanent disenfranchisement. Certificate can be obtained from the county circuit court.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Tenn. Code Ann. § 8-50-101 et seq. (amended 2016)',
      licensingNexusReform: true,
      licensingNexusSource: 'Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Tennessee modified: ban lifted after completing sentence; drug treatment may be required.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Texas ──────────────────────────────────────────────────────────────────
  TX: {
    state: 'TX', stateName: 'Texas',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Tex. Const. Art. VI § 1; Tex. Elec. Code § 11.002',
      notes: 'Rights restored automatically upon completing all supervision — full discharge from sentence, parole, and probation.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Austin and San Antonio municipal ordinances; no statewide private employer BTB law',
      licensingNexusReform: true,
      licensingNexusSource: 'Tex. Occ. Code § 53.022 (amended HB 1818, 2019) — nexus required for license denial',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Texas modified the SNAP ban: ban applies only while on probation or parole supervision; eligibility restored upon completion of supervision.',
      snapSource: 'Tex. Human Resources Code § 33.0071',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply; ineligible while testing positive.',
    },
    housing: {
      fairChanceHousingLaw: false,
      notes: 'Austin has a fair chance housing ordinance. No statewide private landlord law.',
    },
  },

  // ── Utah ───────────────────────────────────────────────────────────────────
  UT: {
    state: 'UT', stateName: 'Utah',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Utah Const. Art. IV § 6; Utah Code Ann. § 20A-2-101.3',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Utah Code Ann. § 34A-5-106.5 (2017)',
      licensingNexusReform: true,
      licensingNexusSource: 'Utah Code Ann. § 58-1-304 (SB 34, 2020)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Utah fully opted out of the SNAP drug felony ban.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Vermont ────────────────────────────────────────────────────────────────
  VT: {
    state: 'VT', stateName: 'Vermont',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'incarcerated',
      automaticRestoration: true,
      canVoteWhileIncarcerated: true,
      source: 'Vt. Const. Ch. II § 42; 17 V.S.A. § 2121',
      notes: 'Vermont never disenfranchises for felony conviction. People can vote from prison. One of only three states (with Maine and Oregon) with no felony disenfranchisement. Vermont had this rule even before Maine.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 1+ employee)',
      banTheBoxSource: '21 V.S.A. § 495 (Fair Employment Practices Act, amended 2016)',
      licensingNexusReform: true,
      licensingNexusSource: '26 V.S.A. § 3105 (2019)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Vermont fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Vermont fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Virginia ───────────────────────────────────────────────────────────────
  VA: {
    state: 'VA', stateName: 'Virginia',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'application_required',
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Va. Const. Art. II § 1; Executive Order 2021 (Governor Northam)',
      notes: 'Virginia requires a gubernatorial clemency action to restore voting rights — there is no automatic restoration under the state constitution. Governor Northam (2021) implemented automatic restoration for those who completed their sentence, but this was an executive policy, not a constitutional change. Governor Youngkin (2022) continued the policy but with a more restrictive approach for violent offenders. Because this depends on executive policy rather than statute, it can change with administrations. Violent felony convictions may require individual petition.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After conditional offer (employers with 25+ employees)',
      banTheBoxSource: 'Va. Code Ann. § 19.2-389.3 (HB 868, 2020 — effective July 1, 2020)',
      licensingNexusReform: true,
      licensingNexusSource: 'Va. Code Ann. § 54.1-204 (SB 1127, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'SNAP ban applies only during active supervision; eligibility restored upon completion. (2020-2021 reform)',
      snapSource: 'CLASP 2022; Va. Code Ann.; USDA FNS state options',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: ban applies during active supervision; restored upon completion.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'Va. Code Ann. § 36-96.4 (Richmond Redevelopment and Housing Authority regs); Alexandria Fair Chance Housing Ordinance',
      notes: 'No comprehensive statewide private landlord fair chance housing law. Some localities have ordinances.',
    },
  },

  // ── Washington ─────────────────────────────────────────────────────────────
  WA: {
    state: 'WA', stateName: 'Washington',
    dataConfidence: 'high', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'on_release',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Wash. Const. Art. VI § 3; RCW 29A.08.520 (SB 5018, 2009)',
      notes: 'Rights restored upon release from incarceration. Parolees and probationers can vote. Washington restored voting rights for parolees in 2009.',
    },
    employment: {
      banTheBoxScope: 'private_also',
      banTheBoxTrigger: 'After interview (employers with 8+ employees)',
      banTheBoxSource: 'RCW 49.94.010 et seq. (Fair Chance Act, 2018)',
      licensingNexusReform: true,
      licensingNexusSource: 'RCW 18.185.020 (SB 5046, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Washington fully opted out.',
      tanfDrugFelonyBan: 'no_ban',
      tanfDetails: 'Washington fully opted out.',
    },
    housing: {
      fairChanceHousingLaw: true,
      fairChanceHousingSource: 'RCW 59.18.580 (Fair Chance Housing Act, 2018); Seattle SMC 14.09',
      coversCriminalHistoryOnApplication: true,
      notes: 'Washington enacted a statewide Fair Chance Housing Act (2018) restricting when landlords can inquire about criminal history. Applies to private landlords with 3+ units in certain jurisdictions.',
    },
  },

  // ── West Virginia ──────────────────────────────────────────────────────────
  WV: {
    state: 'WV', stateName: 'West Virginia',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'W. Va. Const. Art. IV § 1; W. Va. Code § 3-1-3',
      notes: 'Rights restored automatically upon completing all supervision.',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'W. Va. Executive Order 2-18 (2018)',
      licensingNexusReform: true,
      licensingNexusSource: 'W. Va. Code § 30-1-7a (SB 97, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'West Virginia fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Wisconsin ──────────────────────────────────────────────────────────────
  WI: {
    state: 'WI', stateName: 'Wisconsin',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'supervision_complete',
      automaticRestoration: true,
      canVoteWhileIncarcerated: false,
      source: 'Wis. Const. Art. III § 2; Wis. Stat. § 6.03',
      notes: 'Rights restored upon completing all supervision (prison, parole, and probation).',
    },
    employment: {
      banTheBoxScope: 'public_only',
      banTheBoxSource: 'Wis. Exec. Order 61 (2014); Milwaukee BTB ordinance',
      licensingNexusReform: true,
      licensingNexusSource: 'Wis. Stat. § 111.335 (amended 2016) — substantial relationship standard',
    },
    benefits: {
      snapDrugFelonyBan: 'no_ban',
      snapDetails: 'Wisconsin fully opted out.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

  // ── Wyoming ────────────────────────────────────────────────────────────────
  WY: {
    state: 'WY', stateName: 'Wyoming',
    dataConfidence: 'medium', lastVerified: '2026-03',
    voting: {
      restorationPoint: 'waiting_period',
      waitingPeriodYears: 5,
      automaticRestoration: false,
      canVoteWhileIncarcerated: false,
      source: 'Wyo. Stat. Ann. § 7-13-105',
      notes: 'First non-violent felony: automatic restoration 5 years after discharge. Violent crimes or second offense: must petition the Board of Parole. Treason: permanent disqualification.',
    },
    employment: {
      banTheBoxScope: 'none',
      licensingNexusReform: true,
      licensingNexusSource: 'Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021)',
    },
    benefits: {
      snapDrugFelonyBan: 'modified',
      snapDetails: 'Wyoming modified the SNAP ban; conditions during supervision.',
      tanfDrugFelonyBan: 'modified',
      tanfDetails: 'TANF: drug testing requirements apply.',
    },
    housing: {
      fairChanceHousingLaw: false,
    },
  },

};

/**
 * Returns the collateral consequence rule for a state, or null if not found.
 * Only returns entries with dataConfidence 'high' or 'medium'.
 */
export function getCollateralConsequenceRule(
  jurisdiction: string
): CollateralConsequenceRule | null {
  const key = jurisdiction.trim().toUpperCase();
  const rule = COLLATERAL_CONSEQUENCE_RULES[key];
  if (!rule) return null;
  if (rule.dataConfidence === 'low') return null;
  return rule;
}

/**
 * Returns a plain-text summary block for injection into AI prompts.
 * Returns null for low-confidence entries or unknown jurisdictions.
 */
export function buildCollateralConsequenceContextBlock(
  jurisdiction: string
): string | null {
  const rule = getCollateralConsequenceRule(jurisdiction);
  if (!rule) return null;

  const lines: string[] = [
    `COLLATERAL CONSEQUENCES — ${rule.stateName.toUpperCase()} (verified ${rule.lastVerified}):`,
  ];

  // Voting
  const vr = rule.voting;
  if (vr.canVoteWhileIncarcerated) {
    lines.push(`- Voting: ${rule.stateName} does NOT disenfranchise for felony convictions. People can vote even while incarcerated.`);
  } else if (vr.restorationPoint === 'on_release') {
    lines.push(`- Voting: Rights restored automatically upon release from incarceration. Parolees and probationers can vote.`);
  } else if (vr.restorationPoint === 'supervision_complete') {
    lines.push(`- Voting: Rights restored after completing all supervision (prison, parole, and probation).`);
  } else if (vr.restorationPoint === 'waiting_period') {
    lines.push(`- Voting: ${vr.waitingPeriodYears}-year waiting period after completing supervision. ${vr.automaticRestoration ? 'Automatic.' : 'Application required.'}`);
  } else if (vr.restorationPoint === 'application_required') {
    lines.push(`- Voting: Rights are NOT automatically restored. Application or petition required. ${vr.notes ?? ''}`);
  } else if (vr.restorationPoint === 'permanent_bar') {
    lines.push(`- Voting: Permanent disenfranchisement for some offenses. ${vr.notes ?? ''}`);
  }

  // Employment
  const emp = rule.employment;
  if (emp.banTheBoxScope === 'private_also') {
    lines.push(`- Employment: Ban-the-box applies to private employers (${emp.banTheBoxTrigger ?? 'timing varies'}). Employers cannot ask about criminal history until after a conditional offer.`);
  } else if (emp.banTheBoxScope === 'public_only') {
    lines.push(`- Employment: Ban-the-box applies to public/government employers only. Private employers are not restricted by state law.`);
  } else {
    lines.push(`- Employment: No statewide ban-the-box law. Employers can ask about criminal history on initial applications.`);
  }
  if (emp.licensingNexusReform) {
    lines.push(`- Occupational licensing: State law requires a direct relationship between the conviction and the license before a board can deny.`);
  }

  // Benefits
  const ben = rule.benefits;
  if (ben.snapDrugFelonyBan === 'no_ban') {
    lines.push(`- SNAP (food stamps): ${rule.stateName} opted out of the federal drug felony ban. Drug felony convictions do not affect SNAP eligibility.`);
  } else if (ben.snapDrugFelonyBan === 'modified') {
    lines.push(`- SNAP (food stamps): Modified ban applies. ${ben.snapDetails ?? ''}`);
  } else {
    lines.push(`- SNAP (food stamps): Full federal drug felony lifetime ban applies in ${rule.stateName}.`);
  }

  if (vr.notes) {
    lines.push(`- Note: ${vr.notes}`);
  }

  lines.push(`Source confidence: ${rule.dataConfidence}. Verify current law before relying on this in legal proceedings.`);

  return lines.join('\n');
}
