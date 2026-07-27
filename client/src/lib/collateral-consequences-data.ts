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

// ─────────────────────────────────────────────────────────────────────────────
// Driver's License Suspension Rules
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ignition interlock device (IID) requirement following a first-offense DUI.
 * 'required'     — statute mandates IID for first offense.
 * 'discretionary' — court or DMV may impose IID; not automatic for first offense.
 * 'not_required'  — no IID requirement for first offense under state law.
 */
export type InterlockRequirement = 'required' | 'discretionary' | 'not_required';

export interface DriversLicenseRule {
  /** Two-letter state code or 'DC'. */
  state: string;
  stateName: string;
  /** Suspension duration in days for a first-offense DUI/OUI/DWI conviction.
   *  null = duration is wholly discretionary or BAC-tier-dependent (see notes). */
  firstOffenseDuiSuspensionDays: number | null;
  /** True if a restricted or hardship license (e.g. work-only driving) is
   *  available during the suspension period for first-offense DUI. */
  hardshipLicenseAvailable: boolean;
  /** IID requirement for first-offense DUI reinstatement or restricted license. */
  ignitionInterlockRequired: InterlockRequirement;
  /** True if the DMV imposes an administrative license suspension upon arrest
   *  or breath-test refusal BEFORE any criminal conviction (implied consent). */
  adminSuspensionOnArrest: boolean;
  /** True if a drug conviction (non-DUI, no vehicle involved) can trigger
   *  automatic driver's license suspension under state law. */
  drugConvictionSuspension: boolean;
  source: string;
  notes?: string;
  dataConfidence: 'high' | 'medium' | 'low';
  lastVerified: string;
}

export const DRIVERS_LICENSE_RULES: Record<string, DriversLicenseRule> = {

  // ── Alabama ────────────────────────────────────────────────────────────────
  AL: { state: 'AL', stateName: 'Alabama', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Ala. Code §§ 32-5A-191(c)(1), 32-5A-195; Ala. Code § 32-6-19', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Alaska ─────────────────────────────────────────────────────────────────
  AK: { state: 'AK', stateName: 'Alaska', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Alaska Stat. §§ 28.15.165(a)(1), 28.35.030', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Arizona ────────────────────────────────────────────────────────────────
  AZ: { state: 'AZ', stateName: 'Arizona', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Ariz. Rev. Stat. §§ 28-1381, 28-3318, 28-3319', notes: 'Administrative suspension runs concurrent with criminal suspension. IID required on all reinstatements.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Arkansas ───────────────────────────────────────────────────────────────
  AR: { state: 'AR', stateName: 'Arkansas', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Ark. Code Ann. §§ 5-65-104, 5-65-118, 27-16-915', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── California ─────────────────────────────────────────────────────────────
  CA: { state: 'CA', stateName: 'California', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: true, source: 'Cal. Veh. Code §§ 13352(a)(1), 13353, 23575; Cal. Veh. Code § 13202.5 (drug conviction)', notes: 'Restricted license with IID available from day 1. Drug conviction (Health & Safety Code § 11350 et seq.) triggers 1-year suspension under Veh. Code § 13202.5.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Colorado ───────────────────────────────────────────────────────────────
  CO: { state: 'CO', stateName: 'Colorado', firstOffenseDuiSuspensionDays: 270, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Colo. Rev. Stat. §§ 42-2-126(3)(a), 42-2-132.5', notes: '9-month revocation. IID required for reinstatement and for early restricted license.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Connecticut ────────────────────────────────────────────────────────────
  CT: { state: 'CT', stateName: 'Connecticut', firstOffenseDuiSuspensionDays: 45, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Conn. Gen. Stat. §§ 14-227b, 14-227c; Conn. Gen. Stat. § 14-111e', notes: '45-day hard suspension followed by IID period. Administrative hearing must be requested within 7 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Delaware ───────────────────────────────────────────────────────────────
  DE: { state: 'DE', stateName: 'Delaware', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Del. Code Ann. tit. 21 §§ 2742, 4177', notes: 'No hardship license for first DUI. IID required for reinstatement.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── District of Columbia ───────────────────────────────────────────────────
  DC: { state: 'DC', stateName: 'District of Columbia', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'D.C. Code §§ 50-2201.04a, 50-2201.05b', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Florida ────────────────────────────────────────────────────────────────
  FL: { state: 'FL', stateName: 'Florida', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: true, source: 'Fla. Stat. §§ 322.2615, 322.2616, 322.28; Fla. Stat. § 322.055 (drug conviction)', notes: 'Hardship license available after 30-day hard suspension. IID required if BAC ≥ 0.15 or child in vehicle. Drug conviction triggers 1-year suspension under § 322.055.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Georgia ────────────────────────────────────────────────────────────────
  GA: { state: 'GA', stateName: 'Georgia', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'O.C.G.A. §§ 40-5-63, 40-5-64, 40-6-391', notes: '1-year suspension. Limited permit available after 120 days with IID. Admin hearing request required within 30 days of arrest.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Hawaii ─────────────────────────────────────────────────────────────────
  HI: { state: 'HI', stateName: 'Hawaii', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Haw. Rev. Stat. §§ 291E-41, 291E-44.5', notes: '1-year revocation. Conditional license with IID available after 30-day hard revocation.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Idaho ──────────────────────────────────────────────────────────────────
  ID: { state: 'ID', stateName: 'Idaho', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Idaho Code §§ 18-8004, 18-8008, 49-335', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Illinois ───────────────────────────────────────────────────────────────
  IL: { state: 'IL', stateName: 'Illinois', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: true, source: '625 ILCS 5/6-208.1; 625 ILCS 5/6-206(a)(43) (drug conviction)', notes: '1-year Statutory Summary Suspension. BAIID (IID) required for restricted permit. Drug conviction triggers 1-year suspension.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Indiana ────────────────────────────────────────────────────────────────
  IN: { state: 'IN', stateName: 'Indiana', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Ind. Code §§ 9-30-7-5, 9-30-5-9', notes: 'No pre-conviction administrative suspension. Suspension follows criminal conviction. Probationary license available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Iowa ────────────────────────────────────────────────────────────────────
  IA: { state: 'IA', stateName: 'Iowa', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Iowa Code §§ 321J.9, 321J.12', notes: '180-day administrative revocation. IID required for temporary restricted license.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Kansas ─────────────────────────────────────────────────────────────────
  KS: { state: 'KS', stateName: 'Kansas', firstOffenseDuiSuspensionDays: 30, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Kan. Stat. Ann. §§ 8-1014, 8-1015, 8-1016', notes: '30-day hard suspension followed by 330-day ignition interlock restriction.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Kentucky ───────────────────────────────────────────────────────────────
  KY: { state: 'KY', stateName: 'Kentucky', firstOffenseDuiSuspensionDays: 30, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Ky. Rev. Stat. Ann. §§ 189A.010, 189A.070', notes: 'No pre-conviction administrative suspension. 30-day court suspension; hardship license immediately available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Louisiana ──────────────────────────────────────────────────────────────
  LA: { state: 'LA', stateName: 'Louisiana', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'La. Rev. Stat. §§ 14:98, 32:415.1', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Maine ──────────────────────────────────────────────────────────────────
  ME: { state: 'ME', stateName: 'Maine', firstOffenseDuiSuspensionDays: 150, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Me. Rev. Stat. tit. 29-A §§ 2411, 2453, 2457', notes: '150-day suspension. Conditional license with IID available after 30 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Maryland ───────────────────────────────────────────────────────────────
  MD: { state: 'MD', stateName: 'Maryland', firstOffenseDuiSuspensionDays: 45, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Md. Code Ann., Transp. §§ 16-205.1, 16-205.2', notes: 'MVA administrative suspension: 45 days (DUI test) or 90 days (refusal). Ignition interlock program available in lieu of suspension.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Massachusetts ──────────────────────────────────────────────────────────
  MA: { state: 'MA', stateName: 'Massachusetts', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: true, source: 'M.G.L. c. 90 §§ 24, 24D; M.G.L. c. 90 § 22(f) (drug conviction)', notes: '180-day license loss. 24D disposition allows hardship license with IID. Drug conviction suspends license under c. 90 § 22(f).', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Michigan ───────────────────────────────────────────────────────────────
  MI: { state: 'MI', stateName: 'Michigan', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Mich. Comp. Laws §§ 257.303, 257.625k', notes: '180-day suspension. Restricted license with IID available for first 90 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Minnesota ──────────────────────────────────────────────────────────────
  MN: { state: 'MN', stateName: 'Minnesota', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Minn. Stat. §§ 169A.20, 169A.54, 171.306', notes: '90-day administrative revocation. Ignition interlock program allows driving during revocation period.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Mississippi ────────────────────────────────────────────────────────────
  MS: { state: 'MS', stateName: 'Mississippi', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Miss. Code Ann. §§ 63-11-23, 63-11-30, 63-11-45', notes: 'No hardship license for first conviction. IID required as condition of reinstatement.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Missouri ───────────────────────────────────────────────────────────────
  MO: { state: 'MO', stateName: 'Missouri', firstOffenseDuiSuspensionDays: 30, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Mo. Rev. Stat. §§ 302.505, 302.525, 302.530', notes: '90-day admin suspension: 30-day hard then 60-day IID-restricted. Limited driving privilege available after 30 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Montana ────────────────────────────────────────────────────────────────
  MT: { state: 'MT', stateName: 'Montana', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Mont. Code Ann. §§ 61-8-402, 61-8-442', notes: 'No pre-conviction administrative suspension. 6-month court-ordered suspension. Restricted license available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Nebraska ───────────────────────────────────────────────────────────────
  NE: { state: 'NE', stateName: 'Nebraska', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Neb. Rev. Stat. §§ 60-4,164, 60-6,197.04, 60-6,211.11', notes: '180-day revocation. Limited license with IID available after 30 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Nevada ─────────────────────────────────────────────────────────────────
  NV: { state: 'NV', stateName: 'Nevada', firstOffenseDuiSuspensionDays: 185, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Nev. Rev. Stat. §§ 484C.210, 484C.460', notes: '185-day revocation. Restricted license with IID available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New Hampshire ──────────────────────────────────────────────────────────
  NH: { state: 'NH', stateName: 'New Hampshire', firstOffenseDuiSuspensionDays: 270, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'N.H. Rev. Stat. Ann. §§ 265-A:14, 265-A:18, 265-A:36', notes: '9-month license loss. No occupational or hardship license available for first DUI.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New Jersey ─────────────────────────────────────────────────────────────
  NJ: { state: 'NJ', stateName: 'New Jersey', firstOffenseDuiSuspensionDays: null, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'N.J. Stat. Ann. §§ 39:4-50, 39:4-50.17', notes: 'Suspension tied to BAC: 0.08–0.09% = 3 months; 0.10–0.14% = 7–12 months; ≥ 0.15% = IID required during and after. No hardship license. No pre-conviction administrative suspension.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New Mexico ─────────────────────────────────────────────────────────────
  NM: { state: 'NM', stateName: 'New Mexico', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'N.M. Stat. Ann. §§ 66-8-111, 66-8-111.1, 66-8-102', notes: '1-year revocation. Ignition interlock license available immediately.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New York ───────────────────────────────────────────────────────────────
  NY: { state: 'NY', stateName: 'New York', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'N.Y. Veh. & Traf. Law §§ 1193, 1194, 1198', notes: '1-year revocation for DWI. Hardship privilege available in limited circumstances. IID required for all DWI convictions.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── North Carolina ─────────────────────────────────────────────────────────
  NC: { state: 'NC', stateName: 'North Carolina', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'N.C. Gen. Stat. §§ 20-16.5, 20-17, 20-179.3', notes: '1-year revocation. Limited driving privilege available after 30 days. IID required if BAC ≥ 0.15 or repeat offense.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── North Dakota ───────────────────────────────────────────────────────────
  ND: { state: 'ND', stateName: 'North Dakota', firstOffenseDuiSuspensionDays: 91, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'N.D. Cent. Code §§ 39-08-01, 39-20-04.1, 39-20-07', notes: '91-day suspension. IID required for restricted license.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Ohio ───────────────────────────────────────────────────────────────────
  OH: { state: 'OH', stateName: 'Ohio', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Ohio Rev. Code Ann. §§ 4511.19, 4511.191, 4510.17', notes: 'ALS triggered by test result (not arrest), 90 days; refusal = 1 year. OVI criminal suspension 6 months to 3 years. Court may impose IID as a condition of limited driving privileges.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Oklahoma ───────────────────────────────────────────────────────────────
  OK: { state: 'OK', stateName: 'Oklahoma', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Okla. Stat. tit. 47 §§ 753, 754, 6-205.1', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Oregon ─────────────────────────────────────────────────────────────────
  OR: { state: 'OR', stateName: 'Oregon', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'O.R.S. §§ 813.010, 813.410, 813.600', notes: '1-year implied consent suspension (3 years for refusal). DUII hardship permit with IID available after 30 days.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Pennsylvania ───────────────────────────────────────────────────────────
  PA: { state: 'PA', stateName: 'Pennsylvania', firstOffenseDuiSuspensionDays: null, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: '75 Pa. C.S. §§ 3802, 3804, 1547', notes: 'Suspension depends on BAC tier: General Impairment (0.08–0.099%) = no suspension for first offense. High BAC (0.10–0.159%) = 12 months. Highest BAC (≥ 0.16%) or refusal = 12 months. No hardship license for DUI in PA.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Rhode Island ───────────────────────────────────────────────────────────
  RI: { state: 'RI', stateName: 'Rhode Island', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'R.I. Gen. Laws §§ 31-27-2, 31-27-2.8', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── South Carolina ─────────────────────────────────────────────────────────
  SC: { state: 'SC', stateName: 'South Carolina', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'S.C. Code Ann. §§ 56-5-2990, 56-5-2941', notes: '6-month suspension. Restricted license with IID available from day 1 of suspension.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── South Dakota ───────────────────────────────────────────────────────────
  SD: { state: 'SD', stateName: 'South Dakota', firstOffenseDuiSuspensionDays: 30, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'S.D. Codified Laws §§ 32-23-10, 32-23-11', notes: 'No pre-conviction administrative suspension. 30-day court suspension; occupational permit available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Tennessee ──────────────────────────────────────────────────────────────
  TN: { state: 'TN', stateName: 'Tennessee', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Tenn. Code Ann. §§ 55-10-401, 55-10-411, 55-10-417', notes: 'No pre-conviction administrative suspension. 1-year court revocation. Restricted license with IID available.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Texas ──────────────────────────────────────────────────────────────────
  TX: { state: 'TX', stateName: 'Texas', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: true, source: 'Tex. Transp. Code §§ 524.002, 524.012, 521.248; Tex. Transp. Code § 521.372 (drug conviction)', notes: '90-day ALR suspension; criminal conviction adds 90–365 days. Occupational license available. Drug conviction (not DUI) triggers 180-day license suspension under § 521.372.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Utah ───────────────────────────────────────────────────────────────────
  UT: { state: 'UT', stateName: 'Utah', firstOffenseDuiSuspensionDays: 120, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Utah Code Ann. §§ 41-6a-502, 41-6a-515.5, 53-3-223', notes: '120-day suspension. IID required for reinstatement.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Vermont ────────────────────────────────────────────────────────────────
  VT: { state: 'VT', stateName: 'Vermont', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: false, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Vt. Stat. Ann. tit. 23 §§ 1205, 1208, 1213', notes: 'No hardship license for first DUI. IID required upon reinstatement.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Virginia ───────────────────────────────────────────────────────────────
  VA: { state: 'VA', stateName: 'Virginia', firstOffenseDuiSuspensionDays: 365, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Va. Code Ann. §§ 18.2-270, 46.2-391, 18.2-272', notes: '7-day administrative license suspension at arrest. Criminal conviction: 12-month revocation. Restricted license with IID available immediately from day 1 of revocation.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Washington ─────────────────────────────────────────────────────────────
  WA: { state: 'WA', stateName: 'Washington', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Wash. Rev. Code §§ 46.20.308, 46.20.3101, 46.61.502', notes: '90-day DOL suspension (test) or 1 year (refusal). Ignition interlock license available during suspension.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── West Virginia ──────────────────────────────────────────────────────────
  WV: { state: 'WV', stateName: 'West Virginia', firstOffenseDuiSuspensionDays: 180, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'W. Va. Code §§ 17C-5-2, 17C-5A-1, 17C-5A-3a', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Wisconsin ──────────────────────────────────────────────────────────────
  WI: { state: 'WI', stateName: 'Wisconsin', firstOffenseDuiSuspensionDays: 270, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'required', adminSuspensionOnArrest: false, drugConvictionSuspension: false, source: 'Wis. Stat. §§ 343.305, 343.30, 343.10', notes: '9-month revocation for first OWI. First OWI is a civil forfeiture (not criminal); no admin suspension. IID required for reinstatement.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Wyoming ────────────────────────────────────────────────────────────────
  WY: { state: 'WY', stateName: 'Wyoming', firstOffenseDuiSuspensionDays: 90, hardshipLicenseAvailable: true, ignitionInterlockRequired: 'discretionary', adminSuspensionOnArrest: true, drugConvictionSuspension: false, source: 'Wyo. Stat. Ann. §§ 31-6-102, 31-6-107, 31-7-128', dataConfidence: 'medium', lastVerified: '2026-07' },

};

// ─────────────────────────────────────────────────────────────────────────────
// Immigration Consequence Rules
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Estimated deportability risk under federal immigration law for each charge
 * category. Deportability is governed by federal law (8 U.S.C. §§ 1227,
 * 1101(a)(43)), not state law. State variation reflects ICE enforcement posture
 * and how state statutes map to federal removal grounds.
 *
 * IMPORTANT: This is a general risk indicator only. Padilla v. Kentucky, 559
 * U.S. 356 (2010), requires defense attorneys to advise non-citizen clients on
 * immigration consequences BEFORE any plea. Always consult an immigration
 * attorney before entering a guilty plea.
 *
 * 'critical' — near-certain deportability; very limited or no relief.
 * 'high'     — likely deportable; limited discretionary relief may exist.
 * 'moderate' — potentially deportable depending on charge details and sentence.
 * 'low'      — generally not a deportable offense, but circumstances matter.
 */
export type ImmigrationRiskLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface ImmigrationConsequenceRule {
  state: string;
  stateName: string;
  /**
   * Whether the state broadly cooperates with ICE detainer requests
   * (e.g., via 287(g) agreements or blanket policy). When true, an ICE
   * detainer is more likely to be honored upon local booking.
   */
  broadIceCooperation: boolean;
  /**
   * Whether the state has enacted sanctuary-type policies limiting local
   * law enforcement cooperation with civil ICE detainers.
   */
  sanctuaryPolicy: boolean;
  /**
   * Risk levels per charge category under federal INA.
   * Sources: INA § 237(a) (8 U.S.C. § 1227); INA § 101(a)(43) (aggravated
   * felony definition); ILRC Quick Reference Chart (2024);
   * Padilla v. Kentucky, 559 U.S. 356 (2010).
   */
  duiRisk: ImmigrationRiskLevel;
  drugPossessionRisk: ImmigrationRiskLevel;
  drugTraffickingRisk: ImmigrationRiskLevel;
  theftPropertyRisk: ImmigrationRiskLevel;
  domesticViolenceRisk: ImmigrationRiskLevel;
  sexOffenseRisk: ImmigrationRiskLevel;
  source: string;
  notes?: string;
  dataConfidence: 'high' | 'medium' | 'low';
  lastVerified: string;
}

// Helper to build a compact immigration rule. Risk levels are federal and
// uniform across all states; only ICE cooperation posture varies by state.
function _imm(state: string, stateName: string, broadIce: boolean, sanctuary: boolean, notes?: string): ImmigrationConsequenceRule {
  return {
    state, stateName,
    broadIceCooperation: broadIce,
    sanctuaryPolicy: sanctuary,
    // Federal INA risk levels — same for all states:
    duiRisk: 'moderate',           // First-offense DUI rarely deportable; felony DUI may be.
    drugPossessionRisk: 'high',    // INA § 237(a)(2)(B)(i). Exception: single offense of 30g or less marijuana.
    drugTraffickingRisk: 'critical', // Aggravated felony under INA § 101(a)(43)(B).
    theftPropertyRisk: 'moderate', // CIMT if sentence of 1 year or more imposed; petty offense exception may apply.
    domesticViolenceRisk: 'high',  // INA § 237(a)(2)(E)(i) — crime of domestic violence is deportable.
    sexOffenseRisk: 'critical',    // Aggravated felony under INA § 101(a)(43)(A)/(F); also CIMT.
    source: 'INA § 237(a) (8 U.S.C. § 1227); INA § 101(a)(43) (8 U.S.C. § 1101(a)(43)); ILRC Quick Reference Chart (2024)',
    notes,
    dataConfidence: 'medium',
    lastVerified: '2026-07',
  };
}

export const IMMIGRATION_CONSEQUENCE_RULES: Record<string, ImmigrationConsequenceRule> = {
  AL: _imm('AL', 'Alabama',          true,  false, 'Alabama counties have 287(g) task force agreements with ICE.'),
  AK: _imm('AK', 'Alaska',           false, false),
  AZ: _imm('AZ', 'Arizona',          true,  false, 'Maricopa County has a 287(g) agreement. State law (SB 1070 as modified) permits ICE cooperation.'),
  AR: _imm('AR', 'Arkansas',         false, false),
  CA: _imm('CA', 'California',       false, true,  'TRUTH Act (2017) and California Values Act (SB 54) limit ICE cooperation statewide. ICE detainers are not honored as a matter of state policy.'),
  CO: _imm('CO', 'Colorado',         false, true,  'Colorado law limits ICE cooperation; local jails generally do not honor civil detainers.'),
  CT: _imm('CT', 'Connecticut',      false, true,  'Connecticut TRUST Act limits honoring civil ICE detainers.'),
  DE: _imm('DE', 'Delaware',         false, false),
  DC: _imm('DC', 'District of Columbia', false, true, 'D.C. does not honor civil ICE detainers as a matter of policy.'),
  FL: _imm('FL', 'Florida',          true,  false, 'Florida law requires cooperation with ICE detainers (HB 1355 / SB 1048 repealing sanctuary policies, 2023). Many county jails honor ICE detainers.'),
  GA: _imm('GA', 'Georgia',          true,  false, 'Multiple Georgia counties (including Cobb, Gwinnett) have 287(g) agreements.'),
  HI: _imm('HI', 'Hawaii',           false, false),
  ID: _imm('ID', 'Idaho',            true,  false, 'Idaho counties broadly cooperate with ICE detainers.'),
  IL: _imm('IL', 'Illinois',         false, true,  'TRUST Act (2017) prohibits local law enforcement from honoring civil ICE detainers.'),
  IN: _imm('IN', 'Indiana',          true,  false, 'Indiana requires state agencies to cooperate with ICE detainers.'),
  IA: _imm('IA', 'Iowa',             false, false),
  KS: _imm('KS', 'Kansas',           false, false),
  KY: _imm('KY', 'Kentucky',         false, false),
  LA: _imm('LA', 'Louisiana',        true,  false, 'Louisiana requires cooperation with ICE under state law.'),
  ME: _imm('ME', 'Maine',            false, false),
  MD: _imm('MD', 'Maryland',         false, false, 'Maryland passed a law limiting cooperation (2021); some counties still cooperate.'),
  MA: _imm('MA', 'Massachusetts',    false, true,  'Supreme Judicial Court ruled local jails cannot hold people solely on civil ICE detainers. Lunn v. Commonwealth (2017).'),
  MI: _imm('MI', 'Michigan',         false, false),
  MN: _imm('MN', 'Minnesota',        false, true,  'Minnesota does not honor civil ICE detainers as a general policy.'),
  MS: _imm('MS', 'Mississippi',      true,  false, 'Mississippi counties cooperate with ICE detainers broadly.'),
  MO: _imm('MO', 'Missouri',         false, false),
  MT: _imm('MT', 'Montana',          false, false),
  NE: _imm('NE', 'Nebraska',         false, false),
  NV: _imm('NV', 'Nevada',           false, false, 'Las Vegas Metro and Clark County have had mixed policies on detainers.'),
  NH: _imm('NH', 'New Hampshire',    false, false),
  NJ: _imm('NJ', 'New Jersey',       false, true,  'Attorney General directive (2018, updated 2021) prohibits state and county law enforcement from honoring civil ICE detainers.'),
  NM: _imm('NM', 'New Mexico',       false, true,  'New Mexico generally limits ICE cooperation; sanctuary-leaning policies statewide.'),
  NY: _imm('NY', 'New York',         false, true,  'Green Light Law and sanctuary policies: NYC and many counties do not honor ICE detainers. State law limits DMV data sharing with ICE.'),
  NC: _imm('NC', 'North Carolina',   false, false, 'Some NC counties (e.g., Alamance, Mecklenburg) have 287(g) agreements; others do not.'),
  ND: _imm('ND', 'North Dakota',     false, false),
  OH: _imm('OH', 'Ohio',             false, false),
  OK: _imm('OK', 'Oklahoma',         false, false),
  OR: _imm('OR', 'Oregon',           false, true,  'Oregon Sanctuary Law (ORS 181A.820) prohibits law enforcement from detecting or apprehending people solely for immigration violations.'),
  PA: _imm('PA', 'Pennsylvania',     false, false, 'Philadelphia and Pittsburgh have sanctuary policies; many other counties cooperate.'),
  RI: _imm('RI', 'Rhode Island',     false, true,  'Rhode Island does not honor civil ICE detainers as a matter of state policy.'),
  SC: _imm('SC', 'South Carolina',   true,  false, 'Multiple SC counties have 287(g) agreements.'),
  SD: _imm('SD', 'South Dakota',     false, false),
  TN: _imm('TN', 'Tennessee',        true,  false, 'Tennessee law requires cooperation with ICE (enacted 2023).'),
  TX: _imm('TX', 'Texas',            true,  false, 'SB 4 (2017) and successor statutes require local law enforcement to honor ICE detainers. Most Texas counties cooperate. Travis County (Austin) limits cooperation.'),
  UT: _imm('UT', 'Utah',             false, false),
  VT: _imm('VT', 'Vermont',          false, true,  'Vermont has sanctuary policies; state law limits ICE cooperation.'),
  VA: _imm('VA', 'Virginia',         false, false, 'Virginia prohibited local 287(g) agreements (2020); some jurisdictions still cooperate informally.'),
  WA: _imm('WA', 'Washington',       false, true,  'Keep Washington Working Act (2019) limits cooperation with ICE.'),
  WV: _imm('WV', 'West Virginia',    false, false),
  WI: _imm('WI', 'Wisconsin',        true,  false, 'Multiple Wisconsin counties cooperate with ICE detainers.'),
  WY: _imm('WY', 'Wyoming',          false, false),
};

// ─────────────────────────────────────────────────────────────────────────────
// Sex Offender Registration Rules
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Federal SORNA compliance tier for the state's registry.
 * 'compliant'              = state adopted SORNA-compatible three-tier system.
 * 'substantially_compliant' = mostly aligned but with state variations.
 * 'non_compliant'          = state uses its own system, not SORNA-aligned.
 */
export type SornaCompliance = 'compliant' | 'substantially_compliant' | 'non_compliant';

export interface SexOffenderRule {
  state: string;
  stateName: string;
  /**
   * Whether the state's registry framework is substantially aligned with
   * federal SORNA (34 U.S.C. § 20901 et seq.).
   */
  sornaCompliance: SornaCompliance;
  /**
   * Minimum registration duration in years for the lowest-tier equivalent
   * (typically first-time, non-contact, or misdemeanor-level sex offense).
   * This is approximately SORNA Tier I (15 years) for compliant states.
   * 'lifetime' for states that require lifetime registration even for lower-tier offenses.
   */
  tier1RegistrationYears: number | 'lifetime';
  /**
   * Registration duration for the highest-tier equivalent (serious or
   * repeat felony sex offenses). 'lifetime' is common for Tier III / SVP.
   */
  tier3RegistrationYears: number | 'lifetime';
  /** Does the state impose residence restrictions (distance from schools,
   *  parks, playgrounds, bus stops, etc.)? */
  residencyRestrictions: boolean;
  /** Distance in feet from restricted locations if residency restrictions
   *  apply; null if restrictions exist but vary widely by locality. */
  residencyRestrictionFeet?: number | null;
  /** Is the registry publicly accessible online (all 50 states + DC have this)? */
  publicOnlineRegistry: boolean;
  source: string;
  notes?: string;
  dataConfidence: 'high' | 'medium' | 'low';
  lastVerified: string;
}

export const SEX_OFFENDER_RULES: Record<string, SexOffenderRule> = {

  // ── Alabama ────────────────────────────────────────────────────────────────
  AL: { state: 'AL', stateName: 'Alabama', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 2000, publicOnlineRegistry: true, source: 'Ala. Code §§ 15-20A-1 et seq.; 34 U.S.C. § 20911', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Alaska ─────────────────────────────────────────────────────────────────
  AK: { state: 'AK', stateName: 'Alaska', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Alaska Stat. §§ 12.63.010 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Arizona ────────────────────────────────────────────────────────────────
  AZ: { state: 'AZ', stateName: 'Arizona', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Ariz. Rev. Stat. §§ 13-3821 et seq.', notes: 'Sexually violent persons: lifetime and indefinite civil commitment authority.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Arkansas ───────────────────────────────────────────────────────────────
  AR: { state: 'AR', stateName: 'Arkansas', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 2000, publicOnlineRegistry: true, source: 'Ark. Code Ann. §§ 12-12-901 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── California ─────────────────────────────────────────────────────────────
  CA: { state: 'CA', stateName: 'California', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 2000, publicOnlineRegistry: true, source: 'Cal. Penal Code §§ 290 et seq. (as amended by AB 1149, 2021)', notes: 'California adopted a 3-tier system in 2021 (AB 1149). Tier 1: 10 years; Tier 2: 20 years; Tier 3: lifetime. Effective 2025 for retroactive petitions.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Colorado ───────────────────────────────────────────────────────────────
  CO: { state: 'CO', stateName: 'Colorado', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Colo. Rev. Stat. §§ 16-22-101 et seq.', notes: 'Colorado uses its own classification system. Most Tier 1 equivalent registrants: 10 years. Sexually violent predators: lifetime.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Connecticut ────────────────────────────────────────────────────────────
  CT: { state: 'CT', stateName: 'Connecticut', sornaCompliance: 'non_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Conn. Gen. Stat. §§ 54-250 et seq.', notes: 'Connecticut uses a risk-based classification system (not SORNA tiers). Registration duration depends on risk level.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Delaware ───────────────────────────────────────────────────────────────
  DE: { state: 'DE', stateName: 'Delaware', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Del. Code Ann. tit. 11 §§ 4120 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── District of Columbia ───────────────────────────────────────────────────
  DC: { state: 'DC', stateName: 'District of Columbia', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'D.C. Code §§ 22-4001 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Florida ────────────────────────────────────────────────────────────────
  FL: { state: 'FL', stateName: 'Florida', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 'lifetime', tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Fla. Stat. §§ 943.0435, 800.04; Fla. Stat. § 775.215 (residency)', notes: 'Florida requires lifetime registration for nearly all sex offenses. Residency restrictions: 1,000 ft from schools, day care centers, parks, and playgrounds. Among the most restrictive regimes in the U.S.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Georgia ────────────────────────────────────────────────────────────────
  GA: { state: 'GA', stateName: 'Georgia', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'O.C.G.A. §§ 42-1-12 et seq.', notes: '1,000-ft restriction from schools, child care facilities, parks, playgrounds, and bus stops.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Hawaii ─────────────────────────────────────────────────────────────────
  HI: { state: 'HI', stateName: 'Hawaii', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Haw. Rev. Stat. §§ 846E-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Idaho ──────────────────────────────────────────────────────────────────
  ID: { state: 'ID', stateName: 'Idaho', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Idaho Code §§ 18-8301 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Illinois ───────────────────────────────────────────────────────────────
  IL: { state: 'IL', stateName: 'Illinois', sornaCompliance: 'non_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 500, publicOnlineRegistry: true, source: '730 ILCS 150/1 et seq. (Sex Offender Registration Act)', notes: 'Illinois uses its own classification system. Duration ranges: 10 years for Class B misdemeanor sex offenses to lifetime for Class X felonies. 500-ft restriction from schools, day care.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Indiana ────────────────────────────────────────────────────────────────
  IN: { state: 'IN', stateName: 'Indiana', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Ind. Code §§ 11-8-8-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Iowa ────────────────────────────────────────────────────────────────────
  IA: { state: 'IA', stateName: 'Iowa', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 2000, publicOnlineRegistry: true, source: 'Iowa Code §§ 692A.101 et seq.', notes: '2,000-ft residency restriction from schools. One of the broader restrictions in the country.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Kansas ─────────────────────────────────────────────────────────────────
  KS: { state: 'KS', stateName: 'Kansas', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Kan. Stat. Ann. §§ 22-4901 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Kentucky ───────────────────────────────────────────────────────────────
  KY: { state: 'KY', stateName: 'Kentucky', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Ky. Rev. Stat. Ann. §§ 17.500 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Louisiana ──────────────────────────────────────────────────────────────
  LA: { state: 'LA', stateName: 'Louisiana', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'La. Rev. Stat. §§ 15:540 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Maine ──────────────────────────────────────────────────────────────────
  ME: { state: 'ME', stateName: 'Maine', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Me. Rev. Stat. tit. 34-A §§ 11201 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Maryland ───────────────────────────────────────────────────────────────
  MD: { state: 'MD', stateName: 'Maryland', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Md. Code Ann., Crim. Proc. §§ 11-701 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Massachusetts ──────────────────────────────────────────────────────────
  MA: { state: 'MA', stateName: 'Massachusetts', sornaCompliance: 'non_compliant', tier1RegistrationYears: 20, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'M.G.L. c. 6 §§ 178C et seq.', notes: 'Massachusetts uses a Sex Offender Registry Board (SORB) risk classification (Level 1/2/3). Level 1 (low risk): not publicly listed. Level 3 (high risk): active community notification. Duration varies; registry system does not strictly track SORNA tiers.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Michigan ───────────────────────────────────────────────────────────────
  MI: { state: 'MI', stateName: 'Michigan', sornaCompliance: 'non_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Mich. Comp. Laws §§ 28.721 et seq. (SORA)', notes: 'Michigan SORA amended post-People v. Betts (2021) Michigan Supreme Court ruling. 1,000-ft school zone restrictions.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Minnesota ──────────────────────────────────────────────────────────────
  MN: { state: 'MN', stateName: 'Minnesota', sornaCompliance: 'non_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Minn. Stat. §§ 243.166 et seq.', notes: 'Minnesota uses a risk-level system (1/2/3), not SORNA tiers. Duration based on offense and risk classification.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Mississippi ────────────────────────────────────────────────────────────
  MS: { state: 'MS', stateName: 'Mississippi', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1500, publicOnlineRegistry: true, source: 'Miss. Code Ann. §§ 45-33-21 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Missouri ───────────────────────────────────────────────────────────────
  MO: { state: 'MO', stateName: 'Missouri', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Mo. Rev. Stat. §§ 589.400 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Montana ────────────────────────────────────────────────────────────────
  MT: { state: 'MT', stateName: 'Montana', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Mont. Code Ann. §§ 46-23-501 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Nebraska ───────────────────────────────────────────────────────────────
  NE: { state: 'NE', stateName: 'Nebraska', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 500, publicOnlineRegistry: true, source: 'Neb. Rev. Stat. §§ 29-4001 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Nevada ─────────────────────────────────────────────────────────────────
  NV: { state: 'NV', stateName: 'Nevada', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Nev. Rev. Stat. §§ 179D.010 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New Hampshire ──────────────────────────────────────────────────────────
  NH: { state: 'NH', stateName: 'New Hampshire', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'N.H. Rev. Stat. Ann. §§ 651-B:1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New Jersey ─────────────────────────────────────────────────────────────
  NJ: { state: 'NJ', stateName: 'New Jersey', sornaCompliance: 'non_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'N.J. Stat. Ann. §§ 2C:7-1 et seq. (Megan\'s Law)', notes: 'New Jersey uses Megan\'s Law Tier 1/2/3 risk classification (not SORNA offense tiers). Tier 3: community notification. No statutory residency restriction.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── New Mexico ─────────────────────────────────────────────────────────────
  NM: { state: 'NM', stateName: 'New Mexico', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'N.M. Stat. Ann. §§ 29-11A-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── New York ───────────────────────────────────────────────────────────────
  NY: { state: 'NY', stateName: 'New York', sornaCompliance: 'non_compliant', tier1RegistrationYears: 20, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'N.Y. Correct. Law §§ 168 et seq. (Sex Offender Registration Act)', notes: 'New York uses risk levels 1/2/3 (not SORNA tiers). Level 3: active community notification; 20-year or lifetime registration depending on designation. Sexually Violent Offender and Predatory Sex Offender designations increase duration.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── North Carolina ─────────────────────────────────────────────────────────
  NC: { state: 'NC', stateName: 'North Carolina', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'N.C. Gen. Stat. §§ 14-208.5 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── North Dakota ───────────────────────────────────────────────────────────
  ND: { state: 'ND', stateName: 'North Dakota', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'N.D. Cent. Code §§ 12.1-32-15 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Ohio ───────────────────────────────────────────────────────────────────
  OH: { state: 'OH', stateName: 'Ohio', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Ohio Rev. Code Ann. §§ 2950.01 et seq.', notes: 'Ohio uses Tier 1/2/3 classification aligned with SORNA. Tier 1: 15 years (annually); Tier 2: 25 years (semi-annually); Tier 3: lifetime (quarterly).', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Oklahoma ───────────────────────────────────────────────────────────────
  OK: { state: 'OK', stateName: 'Oklahoma', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 2000, publicOnlineRegistry: true, source: 'Okla. Stat. tit. 57 §§ 581 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Oregon ─────────────────────────────────────────────────────────────────
  OR: { state: 'OR', stateName: 'Oregon', sornaCompliance: 'non_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'O.R.S. §§ 163A.005 et seq.', notes: 'Oregon uses offense-based classification. Duration varies. Not SORNA-compliant.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Pennsylvania ───────────────────────────────────────────────────────────
  PA: { state: 'PA', stateName: 'Pennsylvania', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: '42 Pa. C.S. §§ 9799.10 et seq. (SORNA II, as amended after Commonwealth v. Muniz, 2017)', notes: 'Pennsylvania SORNA was restructured after Muniz. Current SORNA II applies prospectively from Dec. 20, 2012. Tier 1: 15 years; Tier 2: 25 years; Tier 3 / SVP: lifetime.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Rhode Island ───────────────────────────────────────────────────────────
  RI: { state: 'RI', stateName: 'Rhode Island', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'R.I. Gen. Laws §§ 11-37.1-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── South Carolina ─────────────────────────────────────────────────────────
  SC: { state: 'SC', stateName: 'South Carolina', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'S.C. Code Ann. §§ 23-3-400 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── South Dakota ───────────────────────────────────────────────────────────
  SD: { state: 'SD', stateName: 'South Dakota', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'S.D. Codified Laws §§ 22-24B-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Tennessee ──────────────────────────────────────────────────────────────
  TN: { state: 'TN', stateName: 'Tennessee', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 1000, publicOnlineRegistry: true, source: 'Tenn. Code Ann. §§ 40-39-201 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Texas ──────────────────────────────────────────────────────────────────
  TX: { state: 'TX', stateName: 'Texas', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 500, publicOnlineRegistry: true, source: 'Tex. Code Crim. Proc. ch. 62 §§ 0101 et seq.', notes: '500-ft restriction from school premises for all registrants living or working there. Lifetime registration for "sexually violent offenses." Many felony sex offenses require lifetime registration.', dataConfidence: 'high', lastVerified: '2026-07' },

  // ── Utah ───────────────────────────────────────────────────────────────────
  UT: { state: 'UT', stateName: 'Utah', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Utah Code Ann. §§ 77-41-101 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Vermont ────────────────────────────────────────────────────────────────
  VT: { state: 'VT', stateName: 'Vermont', sornaCompliance: 'non_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Vt. Stat. Ann. tit. 13 §§ 5401 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Virginia ───────────────────────────────────────────────────────────────
  VA: { state: 'VA', stateName: 'Virginia', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Va. Code Ann. §§ 9.1-900 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Washington ─────────────────────────────────────────────────────────────
  WA: { state: 'WA', stateName: 'Washington', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: true, residencyRestrictionFeet: 880, publicOnlineRegistry: true, source: 'Wash. Rev. Code §§ 9A.44.130 et seq.', notes: 'Level III (high risk) registrants: 880-ft restriction from K-12 schools.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── West Virginia ──────────────────────────────────────────────────────────
  WV: { state: 'WV', stateName: 'West Virginia', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'W. Va. Code §§ 15-12-1 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Wisconsin ──────────────────────────────────────────────────────────────
  WI: { state: 'WI', stateName: 'Wisconsin', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 15, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Wis. Stat. §§ 301.45 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

  // ── Wyoming ────────────────────────────────────────────────────────────────
  WY: { state: 'WY', stateName: 'Wyoming', sornaCompliance: 'substantially_compliant', tier1RegistrationYears: 10, tier3RegistrationYears: 'lifetime', residencyRestrictions: false, publicOnlineRegistry: true, source: 'Wyo. Stat. Ann. §§ 7-19-301 et seq.', dataConfidence: 'medium', lastVerified: '2026-07' },

};

/**
 * Returns the driver's license rule for a state, or null if not found.
 */
export function getDriversLicenseRule(jurisdiction: string): DriversLicenseRule | null {
  const key = jurisdiction.trim().toUpperCase();
  return DRIVERS_LICENSE_RULES[key] ?? null;
}

/**
 * Returns the sex offender rule for a state, or null if not found.
 */
export function getSexOffenderRule(jurisdiction: string): SexOffenderRule | null {
  const key = jurisdiction.trim().toUpperCase();
  return SEX_OFFENDER_RULES[key] ?? null;
}

/**
 * Returns the immigration consequence rule for a state, or null if not found.
 */
export function getImmigrationConsequenceRule(jurisdiction: string): ImmigrationConsequenceRule | null {
  const key = jurisdiction.trim().toUpperCase();
  return IMMIGRATION_CONSEQUENCE_RULES[key] ?? null;
}

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
