import { ExpungementRule } from "@shared/schema";

export const expungementRules: ExpungementRule[] = [
  {
    id: "ca-expungement",
    state: "CA",
    overview: "California allows expungement (dismissal) under Penal Code Section 1203.4 for most misdemeanors and some felonies after completing probation or serving sentence.",
    waitingPeriods: {
      misdemeanorMonths: 12,
      felonyMonths: 12
    },
    exclusions: [
      "Sex crimes requiring registration",
      "Violent felonies with serious injury",
      "Driving under the influence",
      "Vehicular manslaughter"
    ],
    conditions: [
      "Successfully completed probation",
      "No current charges pending",
      "All fines and restitution paid",
      "Not currently serving sentence for another offense"
    ],
    steps: [
      "Obtain certified copy of conviction record",
      "File Petition for Dismissal (CR-180) with court",
      "Pay filing fee ($120-$150) or request fee waiver",
      "Serve notice to prosecutor if required",
      "Attend hearing if scheduled",
      "Receive court order if granted"
    ],
    sources: [
      "California Penal Code Section 1203.4",
      "California Courts Self-Help Center"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "tx-expungement",
    state: "TX",
    overview: "Texas offers expunction (complete removal) for certain cases and non-disclosure (sealing) for others under Chapter 55 of the Code of Criminal Procedure.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 60
    },
    exclusions: [
      "Convictions resulting in confinement or deferred adjudication",
      "Class A or B misdemeanors with deferred adjudication",
      "Most felonies with deferred adjudication"
    ],
    conditions: [
      "Case dismissed or acquitted",
      "No conviction occurred",
      "Completed deferred adjudication successfully (for sealing only)",
      "Waiting period satisfied",
      "No subsequent convictions"
    ],
    steps: [
      "Determine eligibility for expunction vs. non-disclosure",
      "Obtain criminal history report",
      "File petition with district court",
      "Pay filing fee ($280-$300)",
      "Serve all agencies with copies",
      "Attend hearing",
      "Receive expunction/sealing order"
    ],
    sources: [
      "Texas Code of Criminal Procedure Chapter 55",
      "Texas Government Code Chapter 411"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "fl-expungement",
    state: "FL",
    overview: "Florida provides expungement (physical destruction) and sealing for eligible records under Florida Statute 943.0585 and 943.059.",
    waitingPeriods: {
      misdemeanorMonths: 12,
      felonyMonths: 36
    },
    exclusions: [
      "Sexual offenses",
      "Domestic violence",
      "Aggravated assault or battery",
      "Child abuse or neglect",
      "DUI convictions"
    ],
    conditions: [
      "Only one sealing or expungement per lifetime",
      "No prior sealings or expungements",
      "Case dismissed or no conviction",
      "Completed all court requirements",
      "No pending charges"
    ],
    steps: [
      "Apply for Certificate of Eligibility from FDLE",
      "Pay FDLE processing fee ($75)",
      "File petition with circuit court",
      "Pay court filing fee ($42)",
      "Attend hearing if required",
      "Receive court order",
      "Submit order to FDLE for processing"
    ],
    sources: [
      "Florida Statute 943.0585 (Expungement)",
      "Florida Statute 943.059 (Sealing)",
      "Florida Department of Law Enforcement"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "ny-expungement",
    state: "NY",
    overview: "New York offers sealing of criminal records under CPL Article 160.59 for certain convictions and automatic sealing for marijuana offenses.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 120
    },
    exclusions: [
      "Sex offenses",
      "Violent felony offenses",
      "Class A felonies",
      "More than two convictions (with exceptions)",
      "Crimes against children under 18"
    ],
    conditions: [
      "No more than two eligible convictions",
      "No pending charges",
      "Sentence completed including parole/probation",
      "Waiting period satisfied",
      "Demonstrated rehabilitation"
    ],
    steps: [
      "Obtain criminal history records",
      "Complete application form",
      "File motion with court of conviction",
      "Pay filing fee ($200)",
      "Serve prosecutor's office",
      "Attend hearing",
      "Receive sealing order if granted"
    ],
    sources: [
      "New York Criminal Procedure Law Article 160.59",
      "New York State Division of Criminal Justice Services"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "pa-expungement",
    state: "PA",
    overview: "Pennsylvania allows expungement for certain offenses and offers limited access relief for others under Title 18 Section 9122.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 120
    },
    exclusions: [
      "Crimes of violence",
      "Sexual offenses",
      "Crimes against minors",
      "DUI offenses",
      "Multiple convictions"
    ],
    conditions: [
      "Free of arrest or prosecution for 5+ years (misdemeanor) or 10+ years (felony)",
      "No convictions carrying more than 2 years imprisonment",
      "Fines and costs paid in full",
      "Individual is 70+ years old (alternative pathway)"
    ],
    steps: [
      "Obtain criminal record from State Police",
      "Complete expungement petition",
      "File with Court of Common Pleas",
      "Pay filing fee ($132)",
      "Serve all relevant agencies",
      "Attend hearing if scheduled",
      "Receive expungement order"
    ],
    sources: [
      "Pennsylvania Title 18 Section 9122",
      "Clean Slate Law (Act 56 of 2018)"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "ga-expungement",
    state: "GA",
    overview: "Georgia allows record restriction (similar to sealing) for certain offenses under O.C.G.A. § 35-3-37.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 48
    },
    exclusions: [
      "DUI offenses",
      "Sexual offenses",
      "Serious violent felonies",
      "Family violence convictions",
      "Stalking offenses"
    ],
    conditions: [
      "Sentence completed including probation",
      "Waiting period satisfied",
      "No subsequent arrests or convictions",
      "All fines and restitution paid"
    ],
    steps: [
      "Complete application form",
      "Obtain certified disposition",
      "Submit application to GCIC",
      "Pay processing fee ($25)",
      "Wait for approval/denial",
      "Receive restriction certificate if approved"
    ],
    sources: [
      "Georgia Code § 35-3-37",
      "Georgia Crime Information Center"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },
  // ── Illinois ──────────────────────────────────────────────────────────────
  {
    id: "il-expungement",
    state: "IL",
    overview: "Illinois has one of the most expansive expungement and sealing laws in the country under 20 ILCS 2630/5.2. Many arrests without conviction are automatically expunged. Convictions can be sealed (not destroyed) after waiting periods. Cannabis convictions are eligible for automatic expungement under the Cannabis Regulation and Tax Act (410 ILCS 705).",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 36,
    },
    exclusions: [
      "Sex offenses requiring registration",
      "Crimes of violence (Class 2 or higher felony with victim)",
      "DUI convictions",
      "Domestic battery convictions",
      "Dog fighting and animal torture",
    ],
    conditions: [
      "All fines, fees, and restitution paid",
      "No pending criminal charges",
      "Waiting period satisfied after sentence completion",
      "Sealing available for convictions; expungement for arrests without conviction",
    ],
    steps: [
      "Obtain criminal history from Illinois State Police",
      "File petition for expungement or sealing in circuit court of conviction",
      "Pay filing fee (varies by county; fee waiver available)",
      "Serve Illinois State Police and arresting agency",
      "Attend hearing if scheduled",
      "Receive court order; submit to Illinois State Police for processing",
    ],
    sources: [
      "20 ILCS 2630/5.2 (Expungement and Sealing)",
      "410 ILCS 705 (Cannabis Regulation and Tax Act — automatic cannabis expungement)",
      "Illinois State Police — Expungement/Sealing",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Ohio ──────────────────────────────────────────────────────────────────
  {
    id: "oh-expungement",
    state: "OH",
    overview: "Ohio allows sealing (not destruction) of conviction records under ORC § 2953.32. Eligibility was significantly expanded in 2020-2023 to allow sealing of additional felony categories. Up to five qualifying convictions may be sealed. Acquittals and dismissed charges are automatically sealable.",
    waitingPeriods: {
      misdemeanorMonths: 12,
      felonyMonths: 36,
    },
    exclusions: [
      "First-degree or second-degree felonies (generally)",
      "Sex offenses requiring registration",
      "Offenses involving minors",
      "Domestic violence convictions",
      "OVI (DUI) convictions",
    ],
    conditions: [
      "No pending charges",
      "Waiting period satisfied after discharge from probation/parole",
      "Misdemeanor: 1 year; F3-F5 felony: 3 years after discharge",
      "All fines and court costs paid",
    ],
    steps: [
      "File application in court of conviction",
      "Pay filing fee ($50-$75) or request waiver",
      "Prosecutor may object; court holds hearing",
      "If granted, court issues sealing order to all relevant agencies",
    ],
    sources: [
      "Ohio Revised Code § 2953.32 (Sealing of Records)",
      "Ohio Revised Code § 2953.31 (Definitions)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── North Carolina ────────────────────────────────────────────────────────
  {
    id: "nc-expungement",
    state: "NC",
    overview: "North Carolina allows expungement (destruction) of certain criminal records under G.S. § 15A-145 et seq. Eligibility is limited and typically allows only one expungement per person for conviction-based records, though additional expungements for dismissals are permitted.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 120,
    },
    exclusions: [
      "Class A-E violent felonies",
      "Sex offenses requiring registration",
      "DWI/DUI convictions",
      "More than one prior conviction (for most pathways)",
      "Offenses against minors",
    ],
    conditions: [
      "No pending charges",
      "Waiting period satisfied after sentence completion",
      "Only one conviction expungement per lifetime (for most categories)",
      "All court costs paid",
    ],
    steps: [
      "File petition in superior court",
      "Pay filing fee ($175) or request waiver",
      "SBI conducts criminal history check",
      "Serve DA's office and State Bureau of Investigation",
      "Hearing held; judge orders expungement if granted",
    ],
    sources: [
      "N.C. Gen. Stat. § 15A-145 through 15A-149 (Expungement)",
      "N.C. Admin. Office of the Courts",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Michigan ──────────────────────────────────────────────────────────────
  {
    id: "mi-expungement",
    state: "MI",
    overview: "Michigan's Clean Slate Act (2021) dramatically expanded expungement eligibility under MCL § 780.621. Up to 3 felonies and unlimited misdemeanors may be expunged. Automatic expungement for eligible offenses takes effect after 7-10 years without petition, beginning in 2023.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 60,
    },
    exclusions: [
      "Life offense felonies",
      "Sex crimes requiring registration",
      "Crimes with maximum sentence exceeding 10 years (some)",
      "DUI causing death or serious injury",
      "Terrorism offenses",
    ],
    conditions: [
      "No pending charges",
      "Waiting period after sentence completion",
      "No more than 3 felony convictions (for petition pathway)",
      "All fines and restitution paid",
    ],
    steps: [
      "Obtain Michigan criminal history report",
      "File application in circuit court",
      "Pay filing fee ($50) or request waiver",
      "Michigan State Police and prosecuting attorney notified",
      "Hearing if prosecution objects",
      "Order submitted to MSP for processing",
    ],
    sources: [
      "MCL § 780.621 (Clean Slate Act — Set-Aside of Convictions)",
      "MCL § 780.621g (Automatic Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── New Jersey ────────────────────────────────────────────────────────────
  {
    id: "nj-expungement",
    state: "NJ",
    overview: "New Jersey provides broad expungement under N.J.S.A. § 2C:52-1 et seq. An 'early pathway' allows petitions after 3 years in cases demonstrating rehabilitation. Marijuana and hashish conviction expungements are available under the cannabis reform law.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Crimes not subject to expungement (murder, manslaughter, rape, kidnapping, certain sex crimes)",
      "More than one indictable offense conviction (generally)",
      "More than three disorderly persons convictions",
      "Government/judicial corruption offenses",
    ],
    conditions: [
      "Waiting period after conviction, payment of fine, satisfactory completion of probation or parole",
      "No pending charges",
      "No subsequent criminal convictions",
      "5 years standard wait; 3 years for early pathway if court finds in interests of justice",
    ],
    steps: [
      "Obtain criminal history from NJ State Police",
      "File petition in Superior Court, Law Division",
      "Serve all relevant agencies (State Police, local prosecutor, arresting agency)",
      "Pay court filing fee ($75) or request waiver",
      "Attend hearing",
      "Receive expungement order from court",
    ],
    sources: [
      "N.J.S.A. § 2C:52-2 (Expungement of Records of Conviction)",
      "N.J.S.A. § 2C:52-5 (Expungement of Records of Acquittal)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Virginia ──────────────────────────────────────────────────────────────
  {
    id: "va-expungement",
    state: "VA",
    overview: "Virginia's expungement law is among the most restrictive in the country. Under Va. Code § 19.2-392.2, expungement is available mainly for dismissed charges, acquittals, and some deferred dispositions. Simple marijuana possession charges are automatically expunged. A broader sealing process for some misdemeanor convictions was introduced in 2021 but has limited scope.",
    waitingPeriods: {
      misdemeanorMonths: 0,
      felonyMonths: 0,
    },
    exclusions: [
      "Most misdemeanor and felony convictions (no conviction expungement for most offenses)",
      "Cases where a nolle prosequi was entered more than once",
    ],
    conditions: [
      "Charges must have been dismissed, nolle prosequied, or resulted in acquittal",
      "For absolute pardon recipients: petition available",
      "Simple marijuana possession: automatic under Va. Code § 18.2-250.1",
      "No pending charges",
    ],
    steps: [
      "File petition in circuit court where charge was filed",
      "Pay filing fee ($86) or request waiver",
      "Virginia State Police fingerprint verification required",
      "Serve Commonwealth's Attorney",
      "Attend hearing",
      "Order issued; submitted to state police",
    ],
    sources: [
      "Va. Code § 19.2-392.2 (Expungement of Police and Court Records)",
      "Va. Code § 18.2-250.1 (Marijuana Possession — Automatic Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Washington ────────────────────────────────────────────────────────────
  {
    id: "wa-expungement",
    state: "WA",
    overview: "Washington calls its process 'vacation' of conviction rather than expungement. Under RCW 9.94A.640, misdemeanor and some felony convictions may be vacated after waiting periods. Vacated records are not destroyed but are noted as vacated in court records.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 60,
    },
    exclusions: [
      "Class A felonies",
      "Sex offenses",
      "Crimes with a sexual motivation finding",
      "Driving under the influence (DUI)",
      "Domestic violence offenses (most)",
      "Any offense committed against a public officer while performing duty",
    ],
    conditions: [
      "Waiting period after discharge from sentence and community supervision",
      "No pending criminal charges",
      "No conviction for new felony or misdemeanor since the offense",
      "All legal financial obligations paid",
    ],
    steps: [
      "File motion to vacate in court of conviction",
      "Pay filing fee (varies by county) or request waiver",
      "Serve prosecutor and victim if applicable",
      "Attend hearing",
      "Receive order vacating conviction",
    ],
    sources: [
      "RCW 9.94A.640 (Vacation of Offender's Record)",
      "RCW 9.96.060 (Vacation of Misdemeanor Conviction)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Arizona ───────────────────────────────────────────────────────────────
  {
    id: "az-expungement",
    state: "AZ",
    overview: "Arizona does not have traditional expungement but offers 'set aside' of convictions under ARS § 13-907. A set-aside does not remove or seal the conviction — it simply notes that the court has set aside the judgment. Proposition 207 (2020) created a true expungement process for prior marijuana convictions under ARS § 36-2862.",
    waitingPeriods: {
      misdemeanorMonths: 0,
      felonyMonths: 0,
    },
    exclusions: [
      "Convictions requiring sex offender registration",
      "Dangerous offenses (deadly weapon or dangerous instrument involved)",
      "Crimes against minors under 15",
      "Serious crimes: murder, manslaughter, terrorism",
    ],
    conditions: [
      "Sentence completed including probation, parole, and payment of all fines",
      "No pending charges",
      "Set-aside is discretionary — court weighs factors including nature of offense, circumstances, and subsequent conduct",
    ],
    steps: [
      "File application in court of conviction",
      "Pay filing fee (varies)",
      "Court reviews and may hold hearing",
      "Order entered noting conviction is set aside",
      "For marijuana expungement: separate petition under ARS § 36-2862",
    ],
    sources: [
      "ARS § 13-907 (Setting Aside the Judgment)",
      "ARS § 36-2862 (Marijuana Conviction Expungement — Prop 207)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Massachusetts ─────────────────────────────────────────────────────────
  {
    id: "ma-expungement",
    state: "MA",
    overview: "Massachusetts offers sealing (not destruction) of criminal records under MGL c. 276 §§ 100A-100C. Sealed records are not accessible to the public or most employers but remain available to criminal justice agencies. A limited expungement process was added in 2018 for certain offenses committed before age 21 or due to false identity.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 84,
    },
    exclusions: [
      "Convictions for crimes punishable by life imprisonment",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "Recent firearms convictions",
    ],
    conditions: [
      "Waiting period from end of sentence (3 years for misdemeanor; 7 years for felony)",
      "No new criminal convictions during waiting period",
      "All fines and costs paid",
    ],
    steps: [
      "File petition in court of conviction or Department of Criminal Justice Information Services (DCJIS)",
      "DCJIS provides sealing form (no filing fee)",
      "Submit completed form to DCJIS or court",
      "Processing typically 4-6 months",
      "Receive sealing notice from DCJIS",
    ],
    sources: [
      "MGL c. 276 §§ 100A-100C (Sealing of Records)",
      "Massachusetts DCJIS",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Tennessee ─────────────────────────────────────────────────────────────
  {
    id: "tn-expungement",
    state: "TN",
    overview: "Tennessee allows expungement (destruction) of certain criminal records under TCA § 40-32-101. Dismissed charges and diversionary dispositions are expungable. Qualifying misdemeanor and some felony convictions are eligible after waiting periods.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Class A and B felony convictions",
      "Sex offenses requiring registration",
      "DUI convictions",
      "Domestic assault convictions",
      "Any offense involving a child victim under 13",
    ],
    conditions: [
      "5-year waiting period after discharge from sentence for eligible convictions",
      "No more than one prior conviction",
      "No pending charges",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in court of conviction",
      "Pay filing fee ($450 for convictions; dismissed charges are free)",
      "TBI criminal history check",
      "Serve district attorney",
      "Hearing scheduled; order issued if granted",
    ],
    sources: [
      "TCA § 40-32-101 (Expungement)",
      "Tennessee Bureau of Investigation",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Indiana ───────────────────────────────────────────────────────────────
  {
    id: "in-expungement",
    state: "IN",
    overview: "Indiana provides a second-chance law allowing restriction or expungement of criminal records under IC § 35-38-9. The law covers a range of offenses with varying waiting periods based on offense severity. Expungement for arrests without conviction is available after 1 year.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 96,
    },
    exclusions: [
      "Homicide and murder convictions",
      "Sex offense convictions requiring registration",
      "Human or drug trafficking resulting in serious bodily injury",
      "Conviction of official misconduct (public officers)",
    ],
    conditions: [
      "Waiting period after sentence completion or discharge",
      "Misdemeanor: 5 years; Class D/Level 6 felony: 8 years; higher felonies: 8-10 years",
      "No subsequent convictions during waiting period",
      "All fines, fees, and restitution paid",
    ],
    steps: [
      "File petition in court of conviction",
      "Pay filing fee ($157) or request waiver",
      "Prosecutor has 30 days to object",
      "Hearing held if objection filed",
      "Court issues order; records restricted or expunged",
    ],
    sources: [
      "IC § 35-38-9-1 et seq. (Expungement of Arrest and Conviction Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Missouri ──────────────────────────────────────────────────────────────
  {
    id: "mo-expungement",
    state: "MO",
    overview: "Missouri provides expungement of certain criminal records under RSMo § 610.140, significantly expanded in 2018. Misdemeanors and some Class D and E felony convictions are eligible after waiting periods. Expunged records are closed to the public but not destroyed.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 84,
    },
    exclusions: [
      "Class A, B, or C felonies",
      "Dangerous felonies",
      "Sex offenses requiring registration",
      "Felonies with victims who suffered serious bodily injury or death",
      "Domestic violence offenses",
    ],
    conditions: [
      "3-year waiting period for misdemeanors and infractions after completion of sentence",
      "7-year waiting period for qualifying felonies",
      "No subsequent felony or misdemeanor convictions during waiting period",
      "No pending charges",
    ],
    steps: [
      "File petition in circuit court where conviction occurred",
      "Pay filing fee ($250) or request waiver",
      "Serve prosecuting attorney and arresting agency",
      "Hearing scheduled; state may object",
      "Order entered; record closed to public",
    ],
    sources: [
      "RSMo § 610.140 (Expungement of Criminal Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Maryland ──────────────────────────────────────────────────────────────
  {
    id: "md-expungement",
    state: "MD",
    overview: "Maryland provides expungement and shielding of criminal records under Md. Code Crim. Proc. §§ 10-101 to 10-110. The Clean Slate Act (2023) introduced automatic shielding for certain misdemeanor convictions. Dismissed charges are expungeable after 3 years or immediately in some cases.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 0,
    },
    exclusions: [
      "Crimes of violence (first-time conviction not eligible for most pathways)",
      "DUI/DWI convictions",
      "Sex offense convictions requiring registration",
      "Crimes for which person received a sentence of imprisonment exceeding 3 years",
    ],
    conditions: [
      "3-year waiting period after satisfying sentence for most misdemeanor expungements",
      "Felony expungement available only for specific offenses (drug possession, etc.)",
      "No pending charges",
      "Clean Slate Act: automatic shielding after 3 years for qualifying misdemeanors",
    ],
    steps: [
      "File petition in District or Circuit Court",
      "Pay filing fee ($30) or request waiver",
      "State's Attorney receives notice and has 30 days to object",
      "Hearing held if objection filed",
      "Order issued and sent to all relevant agencies",
    ],
    sources: [
      "Md. Code Crim. Proc. § 10-105 (Expungement of Records)",
      "Maryland Clean Slate Act (2023)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Wisconsin ─────────────────────────────────────────────────────────────
  {
    id: "wi-expungement",
    state: "WI",
    overview: "Wisconsin has one of the most restrictive expungement processes in the country under Wis. Stat. § 973.015. Expungement is available ONLY if the sentencing judge orders it AT THE TIME OF SENTENCING — not after the fact. The defendant must have been under 25 at the time of the offense, and the maximum sentence for the offense must be 6 years or less. There is no post-sentencing petition for conviction expungement.",
    waitingPeriods: {
      misdemeanorMonths: 0,
      felonyMonths: 0,
    },
    exclusions: [
      "Offenses where the defendant was 25 or older at the time of commission",
      "Offenses with a maximum sentence exceeding 6 years",
      "Sex crimes requiring registration",
      "Cases where the judge did not order expungement at sentencing",
    ],
    conditions: [
      "Judge must have ordered expungement at the time of sentencing (this cannot be requested later)",
      "Defendant must successfully complete the sentence",
      "File motion to expunge after successful completion of sentence",
    ],
    steps: [
      "Expungement must be requested at sentencing hearing — not after",
      "Upon successful completion of sentence, file motion with the court",
      "Court reviews completion and enters expungement order",
      "Records expunged and returned to defendant",
    ],
    sources: [
      "Wis. Stat. § 973.015 (Expungement of Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Colorado ──────────────────────────────────────────────────────────────
  {
    id: "co-expungement",
    state: "CO",
    overview: "Colorado provides sealing of criminal records under CRS § 24-72-703 et seq. Drug offenses and lower-level felonies have shorter waiting periods. Automatic sealing is available for certain arrests without conviction and petty offense convictions. True expungement (destruction) is generally limited to juvenile records.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 120,
    },
    exclusions: [
      "Class 1, 2, or 3 felony convictions (generally)",
      "Sex offense convictions requiring registration",
      "Crimes involving unlawful sexual behavior",
      "DUI convictions",
      "Child abuse convictions",
    ],
    conditions: [
      "Waiting period from final disposition or sentence completion",
      "Misdemeanor: 3 years; Class 4-6 felony: 10 years; Drug offenses: shorter waits",
      "No pending charges or convictions during wait period",
      "All fines and costs paid",
    ],
    steps: [
      "File petition in court of conviction",
      "Pay filing fee ($65) or request waiver",
      "Serve the DA's office",
      "Hearing held; court weighs interests",
      "Sealing order sent to state repositories",
    ],
    sources: [
      "CRS § 24-72-703 (Sealing of Criminal Records)",
      "CRS § 18-13-122 (Petty Offense Convictions — Automatic Sealing)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Minnesota ─────────────────────────────────────────────────────────────
  {
    id: "mn-expungement",
    state: "MN",
    overview: "Minnesota expanded expungement significantly in 2023. Under Minn. Stat. § 609A.02, misdemeanors, gross misdemeanors, and many felony convictions are eligible for expungement after waiting periods. Expungement seals the record from public view but does not destroy it.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 60,
    },
    exclusions: [
      "Murder and manslaughter convictions",
      "Kidnapping convictions",
      "Sex crimes requiring registration",
      "Crimes against minors (certain)",
      "Repeat violent offender convictions",
    ],
    conditions: [
      "Waiting period after discharge: 2 years (misdemeanor), 4 years (gross misdemeanor), 5 years (felony)",
      "No pending charges or convictions since the offense",
      "All court-ordered conditions satisfied including restitution",
    ],
    steps: [
      "File petition in district court where conviction occurred",
      "Pay filing fee ($315) or request waiver",
      "BCA and prosecuting authority notified (60-day objection window)",
      "Hearing held if objection filed",
      "Court issues expungement order to all repositories",
    ],
    sources: [
      "Minn. Stat. § 609A.02 (Expungement)",
      "2023 Minn. Laws — Expanded Expungement",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── South Carolina ────────────────────────────────────────────────────────
  {
    id: "sc-expungement",
    state: "SC",
    overview: "South Carolina allows expungement (destruction) of records for certain dispositions under SC Code § 17-22-910. Pre-trial intervention completion, conditional discharge, and first-offense simple possession are expungeable. General conviction expungement is limited. SB 201 (2023) expanded eligibility.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 0,
    },
    exclusions: [
      "Most felony convictions",
      "DUI convictions",
      "Domestic violence convictions",
      "Sex offense convictions",
      "Crimes against minors",
    ],
    conditions: [
      "Completion of pre-trial diversion or conditional discharge program",
      "For conviction expungement: first-time offense, nonviolent misdemeanor, 5-year wait",
      "No subsequent convictions",
      "All restitution and costs paid",
    ],
    steps: [
      "Apply through Solicitor's Office or court",
      "Pay application fee ($250 for convictions; $0-150 for diversionary dispositions)",
      "Background check conducted",
      "Order issued by court; SLED destroys records",
    ],
    sources: [
      "SC Code § 17-22-910 (Expungement)",
      "SC Law Enforcement Division (SLED)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Alabama ───────────────────────────────────────────────────────────────
  {
    id: "al-expungement",
    state: "AL",
    overview: "Alabama expanded its expungement law in 2021 under Ala. Code § 15-27-1 to include certain nonviolent felony convictions. Misdemeanor and nonviolent Class C felony convictions are eligible after waiting periods. Dismissed charges and acquittals are also eligible.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 60,
    },
    exclusions: [
      "Class A and B felony convictions",
      "Violent crime convictions",
      "Sex offense convictions",
      "DUI convictions",
      "Crimes against children or elderly",
    ],
    conditions: [
      "3-year waiting period for misdemeanors after sentence completion",
      "5-year waiting period for nonviolent Class C felonies",
      "No pending criminal charges",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in circuit court",
      "Pay filing fee ($300) or request waiver",
      "Serve DA and Alabama Law Enforcement Agency",
      "Hearing scheduled; DA may object",
      "Order entered; records expunged",
    ],
    sources: [
      "Ala. Code § 15-27-1 et seq. (Expungement of Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Louisiana ─────────────────────────────────────────────────────────────
  {
    id: "la-expungement",
    state: "LA",
    overview: "Louisiana has a narrow expungement process under LSA-C.Cr.P. Art. 977 et seq. Expungement is available mainly for arrests not resulting in conviction, misdemeanor first-offense drug possession after completion, and some deferred adjudication outcomes. Most felony convictions are not expungeable.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 0,
    },
    exclusions: [
      "Most felony convictions (no expungement available)",
      "Crimes of violence",
      "Sex offense convictions",
      "Crimes against children",
      "Multiple prior convictions",
    ],
    conditions: [
      "5-year waiting period from arrest date for eligible misdemeanor dispositions",
      "All fines and costs paid",
      "No pending charges",
      "For dismissed charges: no wait required",
    ],
    steps: [
      "File motion in district court",
      "Pay motion costs ($550 including fingerprinting and records checks)",
      "Serve DA, arresting agency, and Louisiana Bureau of Criminal Identification",
      "Hearing held; court orders expungement",
      "Records returned to defendant",
    ],
    sources: [
      "LSA-C.Cr.P. Art. 977-999 (Expungement of Records)",
      "Louisiana Supreme Court",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Kentucky ──────────────────────────────────────────────────────────────
  {
    id: "ky-expungement",
    state: "KY",
    overview: "Kentucky allows expungement of certain records under KRS § 431.073 et seq. The law was expanded in 2020 to include Class D felony convictions. Misdemeanor and Class D felony records may be expunged after waiting periods. Dismissed charges and acquittals are eligible immediately after waiting period.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Class A, B, or C felony convictions",
      "Sex offense convictions requiring registration",
      "Violent offenses",
      "Official misconduct",
      "DUI convictions",
    ],
    conditions: [
      "5-year waiting period after sentence completion for eligible convictions",
      "No subsequent felony or misdemeanor convictions during waiting period",
      "All fines and court costs paid",
      "No pending charges",
    ],
    steps: [
      "File application in court of conviction",
      "Pay filing fee ($500 for convictions) or request waiver",
      "AOC conducts criminal history review",
      "Prosecutor notified and has 60 days to object",
      "Court issues order; records expunged from state repository",
    ],
    sources: [
      "KRS § 431.073 (Expungement — Misdemeanor and Felony)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Oregon ────────────────────────────────────────────────────────────────
  {
    id: "or-expungement",
    state: "OR",
    overview: "Oregon provides 'setting aside' of convictions under ORS § 137.225, which functions similarly to expungement. Records are sealed from public access. Lower-level felonies and most misdemeanors are eligible after waiting periods. Measure 110 (2020) expanded marijuana conviction relief.",
    waitingPeriods: {
      misdemeanorMonths: 12,
      felonyMonths: 36,
    },
    exclusions: [
      "Class A felonies",
      "Sex offenses requiring registration",
      "Crimes involving minors",
      "Driving under the influence (DUII)",
      "Certain traffic crimes",
    ],
    conditions: [
      "1-year waiting period for misdemeanors; 3 years for Class C felonies",
      "No pending charges",
      "No subsequent convictions for offenses that cannot be set aside",
      "All conditions of sentence completed",
    ],
    steps: [
      "File motion in court of conviction",
      "Pay filing fee ($281) or request waiver",
      "Oregon State Police notified",
      "DA may object within 30 days",
      "Hearing held if contested",
      "Court sets aside conviction; records sealed",
    ],
    sources: [
      "ORS § 137.225 (Setting Aside of Convictions)",
      "ORS § 137.226 (Marijuana Conviction Relief)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Oklahoma ──────────────────────────────────────────────────────────────
  {
    id: "ok-expungement",
    state: "OK",
    overview: "Oklahoma provides expungement under 22 O.S. § 18. Records are sealed from public access rather than destroyed. Qualifying misdemeanor and nonviolent felony convictions are eligible after waiting periods. Deferred prosecution completions are eligible after 1 year.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "Kidnapping convictions",
    ],
    conditions: [
      "5-year waiting period after sentence completion for eligible convictions",
      "No subsequent felony convictions",
      "No pending charges",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($150) or request waiver",
      "Serve all relevant law enforcement agencies",
      "Hearing held",
      "Order issued sealing records",
    ],
    sources: [
      "22 O.S. § 18 (Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Connecticut ───────────────────────────────────────────────────────────
  {
    id: "ct-expungement",
    state: "CT",
    overview: "Connecticut provides automatic erasure of criminal records for dismissed charges and nolle prosequi entries after waiting periods under CGS § 54-142a. The Clean Slate Act (2021) introduced automatic erasure for most misdemeanor convictions after 7 years and Class D/E felony convictions after 10 years.",
    waitingPeriods: {
      misdemeanorMonths: 84,
      felonyMonths: 120,
    },
    exclusions: [
      "Class A, B, or C felonies (not eligible for automatic erasure)",
      "Sex offense convictions requiring registration",
      "Crimes of family violence",
      "Offenses where the penalty exceeds 10 years",
    ],
    conditions: [
      "7-year waiting period after sentence completion for qualifying misdemeanors (automatic)",
      "10-year waiting period for Class D/E felony convictions (automatic under Clean Slate)",
      "No subsequent convictions during waiting period",
    ],
    steps: [
      "Automatic erasure occurs by operation of law — no petition required for qualifying offenses",
      "Verify erasure status through the Judicial Branch Case Lookup",
      "For non-automatic cases: file petition with the Superior Court",
    ],
    sources: [
      "CGS § 54-142a (Erasure of Records)",
      "Connecticut Clean Slate Act (PA 21-32, 2021)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Utah ──────────────────────────────────────────────────────────────────
  {
    id: "ut-expungement",
    state: "UT",
    overview: "Utah provides expungement of criminal records under Utah Code § 77-40-105. Arrest records may be automatically sealed. Conviction records require a petition after waiting periods. The Bureau of Criminal Identification (BCI) determines initial eligibility.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 60,
    },
    exclusions: [
      "Capital felony and first-degree felony convictions",
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Automobile homicide convictions",
      "DUI convictions within 10 years of a prior DUI",
    ],
    conditions: [
      "Class B/C misdemeanor: 3 years from sentence completion",
      "Class A misdemeanor: 5 years from sentence completion",
      "Third-degree felony: 7 years from sentence completion",
      "No subsequent felony or misdemeanor convictions",
      "All fines, fees, and restitution paid",
    ],
    steps: [
      "Apply for Certificate of Eligibility from BCI ($65 fee)",
      "File petition in district court with certificate attached",
      "Pay court filing fee ($135)",
      "Prosecutor and law enforcement notified",
      "Hearing held; order issued if granted",
    ],
    sources: [
      "Utah Code § 77-40-101 et seq. (Expungement Act)",
      "Utah Bureau of Criminal Identification",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Iowa ──────────────────────────────────────────────────────────────────
  {
    id: "ia-expungement",
    state: "IA",
    overview: "Iowa's expungement options are limited. Simple misdemeanors may be expunged after 2 years under Iowa Code § 901C.1. Deferred judgments that were discharged are expungeable. Higher-level misdemeanors and most felonies do not qualify for expungement. Dismissed charges are sealed automatically after 180 days.",
    waitingPeriods: {
      misdemeanorMonths: 24,
    },
    exclusions: [
      "Serious misdemeanors and aggravated misdemeanors (generally)",
      "Felony convictions (no expungement available for most)",
      "OWI (DUI) convictions",
      "Sex offense convictions",
      "Domestic abuse assault convictions",
    ],
    conditions: [
      "2-year waiting period after sentence completion for simple misdemeanors",
      "No subsequent misdemeanor or felony convictions during waiting period",
      "All fines and costs paid",
      "No pending charges",
    ],
    steps: [
      "File application in district court where conviction occurred",
      "Pay filing fee ($100) or request waiver",
      "Prosecutor notified",
      "Court issues expungement order",
      "DCI records updated",
    ],
    sources: [
      "Iowa Code § 901C.1 (Expungement of Simple Misdemeanors)",
      "Iowa Code § 907.9 (Discharge of Deferred Judgment)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Nevada ────────────────────────────────────────────────────────────────
  {
    id: "nv-expungement",
    state: "NV",
    overview: "Nevada provides sealing of criminal records under NRS § 179.245. Records are sealed from public view but not destroyed. Waiting periods vary by offense category from 2 years (Category E felony, many misdemeanors) to 10 years (Category A felony). Arrests without conviction may be sealed immediately.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 24,
    },
    exclusions: [
      "Category A felonies involving sexual assault, kidnapping, or murder",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI resulting in death",
    ],
    conditions: [
      "Waiting period from discharge of sentence or conviction date",
      "No pending charges",
      "All fines and restitution paid",
      "Waiting periods: Category E felony: 2 years; Category D: 5 years; Category C: 5 years; Category B: 7 years; Category A: 10 years; misdemeanor: 2 years",
    ],
    steps: [
      "Obtain records from Nevada Repository (DPS)",
      "File petition in district court",
      "Pay filing fee ($265 + fingerprinting) or request waiver",
      "Serve district attorney and law enforcement",
      "Hearing held; court issues sealing order",
    ],
    sources: [
      "NRS § 179.245 (Sealing of Records of Conviction)",
      "NRS § 179.255 (Sealing of Records of Arrest)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Arkansas ──────────────────────────────────────────────────────────────
  {
    id: "ar-expungement",
    state: "AR",
    overview: "Arkansas provides sealing and expungement under Ark. Code § 16-90-1401 et seq. Non-conviction records are eligible immediately. Qualifying misdemeanor and some nonviolent felony convictions are eligible after waiting periods. Sealed records are not publicly accessible but remain available to criminal justice agencies.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Class Y, A, or B felony convictions",
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Offenses involving children",
      "DWI convictions (for conviction pathway; non-conviction DWI arrests eligible)",
    ],
    conditions: [
      "5-year waiting period after sentence completion for eligible convictions",
      "No subsequent felony convictions",
      "All fines and restitution paid",
      "No pending charges",
    ],
    steps: [
      "File petition in circuit court",
      "Pay filing fee ($100) or request waiver",
      "Serve prosecuting attorney",
      "Hearing held after 30-day notice period",
      "Court issues order; records sealed or expunged",
    ],
    sources: [
      "Ark. Code § 16-90-1401 et seq. (Sealing and Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Mississippi ───────────────────────────────────────────────────────────
  {
    id: "ms-expungement",
    state: "MS",
    overview: "Mississippi has very limited expungement options under Miss. Code § 99-19-71 et seq. Expungement is available for first-offense misdemeanors and certain nonviolent felony convictions. Most felony convictions are not eligible. Dismissed and acquitted cases are expungeable.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Most felony convictions (generally not eligible)",
      "DUI convictions",
      "Crimes against children",
      "Sex offense convictions",
      "Drug trafficking convictions",
      "Multiple prior convictions",
    ],
    conditions: [
      "5-year waiting period for eligible misdemeanor convictions",
      "First-time nonviolent Class H felony (after 5 years) may be eligible",
      "No subsequent convictions",
      "All fines and costs paid",
    ],
    steps: [
      "File petition in circuit court",
      "Pay filing fee ($150) or request waiver",
      "District attorney notified",
      "Hearing held",
      "Court issues expungement order",
    ],
    sources: [
      "Miss. Code § 99-19-71 et seq. (Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Kansas ────────────────────────────────────────────────────────────────
  {
    id: "ks-expungement",
    state: "KS",
    overview: "Kansas provides expungement of criminal records under KSA § 21-6614. Misdemeanor and nonviolent felony convictions are eligible after waiting periods. Expunged records are sealed from public view but not destroyed.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 60,
    },
    exclusions: [
      "Crimes of violence",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI convictions",
    ],
    conditions: [
      "3-year waiting period for misdemeanors; 5 years for nonviolent felonies",
      "No subsequent felony or misdemeanor convictions during waiting period",
      "All fines and restitution paid",
      "No pending charges",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($195) or request waiver",
      "Serve KBI and county/city attorney",
      "Hearing scheduled after 60-day notice period",
      "Court issues expungement order; KBI records updated",
    ],
    sources: [
      "KSA § 21-6614 (Expungement of Arrest and Conviction Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── New Mexico ────────────────────────────────────────────────────────────
  {
    id: "nm-expungement",
    state: "NM",
    overview: "New Mexico expanded expungement eligibility in 2019 under NMSA § 29-3A-4. Arrests without conviction, dismissed charges, and qualifying conviction records may be expunged. Waiting periods depend on offense level. Expunged records are treated as though the arrest or conviction never occurred.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 24,
    },
    exclusions: [
      "Capital felony convictions",
      "First-degree felony convictions (most)",
      "Sex offense convictions requiring registration",
      "Crimes involving children",
    ],
    conditions: [
      "2-year waiting period after sentence completion for petty misdemeanors and 4th-degree felonies",
      "6-year wait for 3rd-degree felony; 8 years for 2nd-degree",
      "No pending charges",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($132) or request waiver",
      "Serve district attorney and arresting agency",
      "Hearing held; DA may object",
      "Court issues expungement order",
    ],
    sources: [
      "NMSA § 29-3A-4 (Expungement of Criminal Arrest or Conviction Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Nebraska ──────────────────────────────────────────────────────────────
  {
    id: "ne-expungement",
    state: "NE",
    overview: "Nebraska has extremely limited post-conviction relief. Expungement is available only for arrests that did not result in conviction (dismissed, acquitted) under Neb. Rev. Stat. § 29-3523. For convictions, a 'set-aside' is available under § 29-2264, which does not remove the conviction from public records but relieves some collateral consequences. Nebraska has no post-conviction expungement for guilty verdicts.",
    waitingPeriods: {
      misdemeanorMonths: 0,
    },
    exclusions: [
      "All conviction records (no expungement of convictions)",
      "Sex offense convictions",
      "DUI convictions",
    ],
    conditions: [
      "Non-conviction records (dismissed, acquitted): petition immediately eligible",
      "Set-aside (§ 29-2264): must complete sentence including probation",
      "Set-aside does not expunge the record — it remains public",
    ],
    steps: [
      "For non-conviction expungement: file petition in county court or district court",
      "For set-aside: file motion in court of conviction after sentence completion",
      "Pay filing fee (varies by court)",
      "Serve county attorney",
      "Hearing held; order issued",
    ],
    sources: [
      "Neb. Rev. Stat. § 29-3523 (Expungement of Arrest Records)",
      "Neb. Rev. Stat. § 29-2264 (Set-Aside of Conviction)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── West Virginia ─────────────────────────────────────────────────────────
  {
    id: "wv-expungement",
    state: "WV",
    overview: "West Virginia provides expungement under WV Code § 61-11-26 for certain convictions and under § 61-11-25 for dismissed or non-prosecuted charges. The Clean Slate Act expanded eligibility for low-level misdemeanor convictions. Felony expungement remains very limited.",
    waitingPeriods: {
      misdemeanorMonths: 12,
      felonyMonths: 0,
    },
    exclusions: [
      "Felony convictions (generally not expungeable)",
      "DUI convictions",
      "Sex offense convictions",
      "Domestic violence convictions",
      "Crimes against children",
    ],
    conditions: [
      "1-year waiting period after completion of sentence for qualifying misdemeanors",
      "Misdemeanor must carry a maximum penalty of 1 year or less (Class 4 misdemeanor) for conviction expungement",
      "No subsequent convictions",
      "All fines and costs paid",
      "Dismissed/nolle prosequied charges: eligible immediately after case closed",
    ],
    steps: [
      "File petition in circuit court",
      "Pay filing fee ($150) or request waiver",
      "Serve prosecuting attorney",
      "Hearing held after 30-day notice period",
      "Court issues expungement order; records destroyed",
    ],
    sources: [
      "WV Code § 61-11-25 (Expungement of Criminal Records — Dismissed Charges)",
      "WV Code § 61-11-26 (Expungement of Criminal Records — Convictions)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Idaho ─────────────────────────────────────────────────────────────────
  {
    id: "id-expungement",
    state: "ID",
    overview: "Idaho expanded expungement eligibility through the Conviction Record Relief Act (HB 731, 2023) under Idaho Code § 67-3004. Previously limited to withheld judgments, expungement now covers qualifying misdemeanor and certain felony convictions after waiting periods.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 60,
    },
    exclusions: [
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI convictions",
      "Felonies involving the use of a firearm",
    ],
    conditions: [
      "5-year waiting period after sentence completion for qualifying offenses",
      "Withheld judgment: eligible after probation completion without waiting period",
      "No subsequent felony convictions",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($150) or request waiver",
      "Serve prosecuting attorney and Idaho State Police",
      "Hearing scheduled",
      "Court issues expungement order; ISP records updated",
    ],
    sources: [
      "Idaho Code § 67-3004 (Conviction Record Relief Act, HB 731, 2023)",
      "Idaho Code § 19-2604 (Withheld Judgment — Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Hawaii ────────────────────────────────────────────────────────────────
  {
    id: "hi-expungement",
    state: "HI",
    overview: "Hawaii allows expungement of arrest records without conviction under HRS § 831-3.2. Misdemeanor conviction expungement is available for those who have served their sentence. Felony convictions are NOT eligible for expungement. Expunged records are destroyed.",
    waitingPeriods: {
      misdemeanorMonths: 0,
    },
    exclusions: [
      "Felony convictions (no expungement available)",
      "Sex offense convictions",
      "Crimes involving minors under 16",
      "Domestic abuse convictions",
      "Multiple prior convictions (generally disqualifying)",
    ],
    conditions: [
      "Misdemeanor: no mandatory waiting period after sentence completion; apply upon discharge",
      "Arrest without conviction: eligible immediately or after waiting period depending on outcome",
      "No subsequent convictions",
    ],
    steps: [
      "Apply to Hawaii Criminal Justice Data Center (HCJDC)",
      "Submit application form with fingerprints",
      "Pay application fee ($35)",
      "HCJDC reviews and issues expungement order if eligible",
      "Records destroyed; agency copies recalled",
    ],
    sources: [
      "HRS § 831-3.2 (Expungement of Records)",
      "Hawaii Criminal Justice Data Center",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── New Hampshire ─────────────────────────────────────────────────────────
  {
    id: "nh-expungement",
    state: "NH",
    overview: "New Hampshire provides 'annulment' of criminal records under RSA § 651:5, which is functionally equivalent to expungement. After an annulment, the person may legally state that they were not arrested or convicted. Misdemeanors, Class B felonies, and some Class A felonies are eligible.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 120,
    },
    exclusions: [
      "Murder and manslaughter convictions",
      "Felonious sexual assault and aggravated felonious sexual assault",
      "Crimes against children",
      "DWI with resulting death or serious bodily injury",
    ],
    conditions: [
      "3-year waiting period for misdemeanors; 10 years for Class A/B felonies",
      "No subsequent convictions during waiting period",
      "All fines and restitution paid",
      "Court weighs factors including rehabilitation, public interest, and nature of offense",
    ],
    steps: [
      "File petition in court of conviction",
      "Pay filing fee ($200) or request waiver",
      "Serve state's attorney and relevant law enforcement agencies",
      "Hearing scheduled",
      "Court issues annulment order; records updated",
    ],
    sources: [
      "RSA § 651:5 (Annulment of Criminal Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Maine ─────────────────────────────────────────────────────────────────
  {
    id: "me-expungement",
    state: "ME",
    overview: "Maine provides sealing (not destruction) of criminal records under 15 M.R.S.A. § 2261. Qualifying convictions and dismissed charges may be sealed after waiting periods. Sealed records are unavailable to the public but remain accessible to criminal justice agencies and some employers.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 120,
    },
    exclusions: [
      "Class A felony convictions (generally)",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "OUI (DUI) convictions",
      "Domestic violence convictions",
    ],
    conditions: [
      "3-year waiting period for Class D/E crimes after sentence completion",
      "10-year waiting period for Class B/C felonies (if eligible)",
      "No subsequent convictions during waiting period",
      "All fines and costs paid",
    ],
    steps: [
      "File petition in court of conviction",
      "Pay filing fee ($100) or request waiver",
      "Attorney General and arresting agency notified",
      "Hearing held; state may object",
      "Court issues sealing order",
    ],
    sources: [
      "15 M.R.S.A. § 2261 (Conviction Record Sealing)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Montana ───────────────────────────────────────────────────────────────
  {
    id: "mt-expungement",
    state: "MT",
    overview: "Montana provides expungement for misdemeanor convictions under Mont. Code Ann. § 46-18-1101. Felony convictions are not eligible for expungement of the conviction record, though deferred sentences that were successfully dismissed can be expunged. Records are destroyed upon expungement.",
    waitingPeriods: {
      misdemeanorMonths: 60,
    },
    exclusions: [
      "Felony convictions (no expungement available)",
      "Sex offense convictions",
      "DUI convictions",
      "Crimes against children",
      "Domestic abuse violations",
    ],
    conditions: [
      "5-year waiting period after sentence completion for misdemeanor convictions",
      "Deferred sentences: eligible upon successful completion and dismissal",
      "No subsequent convictions",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($80) or request waiver",
      "Serve county attorney",
      "Hearing held after 21-day notice period",
      "Court issues expungement order; records destroyed",
    ],
    sources: [
      "Mont. Code Ann. § 46-18-1101 (Expungement of Criminal Records)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Rhode Island ──────────────────────────────────────────────────────────
  {
    id: "ri-expungement",
    state: "RI",
    overview: "Rhode Island provides expungement of criminal records under RI Gen. Laws § 12-1.3-2 for first-time offenders after waiting periods. Both misdemeanor and felony conviction expungements are available. Expunged records are physically destroyed.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 120,
    },
    exclusions: [
      "Crimes of violence (ineligible)",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI convictions",
      "Repeat offenders (second or subsequent convictions disqualifying)",
    ],
    conditions: [
      "5-year waiting period for misdemeanors; 10 years for felonies after sentence completion",
      "First-time offender: no prior convictions",
      "No pending charges",
      "All fines and restitution paid",
    ],
    steps: [
      "File petition in Superior Court (felony) or District Court (misdemeanor)",
      "Pay filing fee ($100) or request waiver",
      "Serve attorney general, BCI, and all relevant agencies",
      "Hearing scheduled; prosecutor may oppose",
      "Court issues expungement order; all records destroyed",
    ],
    sources: [
      "RI Gen. Laws § 12-1.3-2 (Expungement of Criminal Records — First Offenders)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Delaware ──────────────────────────────────────────────────────────────
  {
    id: "de-expungement",
    state: "DE",
    overview: "Delaware provides expungement of criminal records under 11 Del. C. § 4371 et seq. Certain misdemeanor and nonviolent felony convictions are eligible after waiting periods. The Clean Slate Act of 2019 added automatic expungement for dismissed cases.",
    waitingPeriods: {
      misdemeanorMonths: 36,
      felonyMonths: 84,
    },
    exclusions: [
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Felony convictions for crimes against persons (generally)",
      "DUI convictions",
      "Class A or B felony convictions",
    ],
    conditions: [
      "3-year waiting period for misdemeanors; 7 years for qualifying nonviolent felonies",
      "No subsequent convictions",
      "All fines and restitution paid",
      "No pending charges",
    ],
    steps: [
      "File petition in Court of Common Pleas (misdemeanor) or Superior Court (felony)",
      "Pay filing fee ($125) or request waiver",
      "SBI and prosecuting attorney notified",
      "Hearing held; prosecutor may oppose",
      "Court issues expungement order",
    ],
    sources: [
      "11 Del. C. § 4371 et seq. (Expungement of Criminal Records)",
      "Delaware Clean Slate Act (2019)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── South Dakota ──────────────────────────────────────────────────────────
  {
    id: "sd-expungement",
    state: "SD",
    overview: "South Dakota has limited expungement options. Suspended imposition of sentence (SIS) allows defendants to petition for set-aside after completing probation. Dismissed charges and acquittals are expungeable. Most conviction records are not expungeable through a traditional petition.",
    waitingPeriods: {
      misdemeanorMonths: 60,
    },
    exclusions: [
      "Most felony convictions (no traditional expungement)",
      "Sex offense convictions",
      "Crimes against children",
      "DUI convictions",
    ],
    conditions: [
      "Suspended imposition of sentence: eligible after successful completion of probation",
      "10-year waiting period from conviction for some petition-based relief",
      "No subsequent felony convictions",
      "All conditions of sentence met",
    ],
    steps: [
      "File motion in circuit court",
      "Pay filing fee (varies) or request waiver",
      "State's attorney notified",
      "Hearing held; court considers rehabilitation",
      "Order entered if granted",
    ],
    sources: [
      "SDCL § 23A-3-31 (Expungement of Criminal Records)",
      "SDCL § 16-15-19 (SIS Procedures)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── North Dakota ──────────────────────────────────────────────────────────
  {
    id: "nd-expungement",
    state: "ND",
    overview: "North Dakota provides limited expungement under NDCC § 12.1-32-07.2. Deferred imposition of sentence, upon completion, may be expunged. Class B misdemeanors may be sealed after a waiting period. Most conviction records are not expungeable.",
    waitingPeriods: {
      misdemeanorMonths: 36,
    },
    exclusions: [
      "Felony conviction records (generally not expungeable)",
      "Class A misdemeanor convictions (most)",
      "Sex offense convictions",
      "DUI convictions",
    ],
    conditions: [
      "Deferred imposition of sentence: eligible upon successful completion",
      "Class B misdemeanor: 3-year waiting period after conviction",
      "No subsequent convictions",
      "All fines and restitution paid",
    ],
    steps: [
      "File application in district court",
      "Pay filing fee ($50-$150) or request waiver",
      "State's attorney notified",
      "Court reviews and may grant expungement",
    ],
    sources: [
      "NDCC § 12.1-32-07.2 (Deferred Imposition of Sentence — Expungement)",
      "NDCC § 12-60-16.6 (Criminal Record Sealing)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Alaska ────────────────────────────────────────────────────────────────
  {
    id: "ak-expungement",
    state: "AK",
    overview: "Alaska has very limited expungement options. Conviction records are generally not expungeable. Arrest records not resulting in conviction may be sealed. Dismissed charges and acquittals may also be sealed. A set-aside is available for some convictions but does not destroy the record.",
    waitingPeriods: {
      misdemeanorMonths: 0,
    },
    exclusions: [
      "Felony conviction records (no expungement of most convictions)",
      "Sex offense convictions",
      "Crimes involving children",
      "DUI convictions",
    ],
    conditions: [
      "Dismissal or acquittal: eligible to petition for sealing",
      "Set-aside available after completing sentence (does not expunge the record)",
      "No pending charges",
    ],
    steps: [
      "File petition with the court",
      "Pay filing fee ($150) or request waiver",
      "Serve prosecuting attorney and DPS",
      "Court holds hearing",
      "Order issued if granted",
    ],
    sources: [
      "AS § 12.62.180 (Sealing of Criminal Records)",
      "AS § 12.55.085 (Suspended Imposition of Sentence)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Vermont ───────────────────────────────────────────────────────────────
  {
    id: "vt-expungement",
    state: "VT",
    overview: "Vermont provides expungement and annulment of criminal records under 13 V.S.A. § 7601 et seq. The Clean Slate Act of 2018 expanded eligibility significantly. Qualifying misdemeanor and some felony convictions are eligible after waiting periods. Annulled records are treated as though the crime never occurred.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 120,
    },
    exclusions: [
      "Murder and manslaughter convictions",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI convictions (with some exceptions for first offense)",
    ],
    conditions: [
      "5-year waiting period for misdemeanors; 10 years for felonies after sentence completion",
      "No subsequent convictions during waiting period",
      "All fines and restitution paid",
      "No pending charges",
    ],
    steps: [
      "File petition with the court",
      "Pay filing fee ($75) or request waiver",
      "State's attorney and VSP notified",
      "Hearing scheduled",
      "Court issues annulment order; records destroyed",
    ],
    sources: [
      "13 V.S.A. § 7601 et seq. (Expungement and Annulment of Criminal Records)",
      "Vermont Clean Slate Act (2018)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── Wyoming ───────────────────────────────────────────────────────────────
  {
    id: "wy-expungement",
    state: "WY",
    overview: "Wyoming provides expungement of certain criminal records under Wyo. Stat. § 7-13-1401. Qualifying misdemeanor and nonviolent felony convictions are eligible after waiting periods. Deferred prosecution completions are eligible immediately.",
    waitingPeriods: {
      misdemeanorMonths: 60,
      felonyMonths: 120,
    },
    exclusions: [
      "Violent felony convictions",
      "Sex offense convictions requiring registration",
      "Crimes against children",
      "DUI convictions",
      "Class 1 or 2 felonies",
    ],
    conditions: [
      "5-year waiting period for misdemeanors; 10 years for nonviolent felonies",
      "No subsequent convictions during waiting period",
      "All fines and restitution paid",
      "No pending charges",
    ],
    steps: [
      "File petition in district court",
      "Pay filing fee ($180) or request waiver",
      "Serve district attorney and relevant agencies",
      "Hearing held after 30-day notice period",
      "Court issues expungement order",
    ],
    sources: [
      "Wyo. Stat. § 7-13-1401 et seq. (Expungement)",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── District of Columbia ──────────────────────────────────────────────────
  {
    id: "dc-expungement",
    state: "DC",
    overview: "The District of Columbia provides sealing of criminal records under D.C. Code § 16-801 et seq. Two pathways exist: 'paper' sealing (all paper records destroyed; electronic available to criminal justice agencies) and 'actual' sealing (all copies destroyed). Waiting periods and eligibility depend on the outcome of the case.",
    waitingPeriods: {
      misdemeanorMonths: 24,
      felonyMonths: 96,
    },
    exclusions: [
      "Murder and manslaughter convictions",
      "Sex offense convictions requiring registration",
      "Crimes with life sentences",
      "Crimes against children under 18",
      "Domestic violence convictions (some pathways)",
    ],
    conditions: [
      "Misdemeanor conviction: 2 years after release from incarceration or 4 years after conviction if no incarceration",
      "Felony conviction: 8 years after release from incarceration",
      "Acquittals and dismissed charges: 2 years or immediately for some outcomes",
      "No pending charges",
      "No subsequent convictions",
    ],
    steps: [
      "File motion in Superior Court",
      "Pay filing fee ($100) or request waiver",
      "Serve US Attorney's Office",
      "Hearing scheduled; prosecutor may oppose",
      "Court issues sealing order; records sealed",
    ],
    sources: [
      "D.C. Code § 16-801 et seq. (Criminal Record Sealing)",
      "D.C. Courts — Criminal Record Sealing Program",
    ],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  {
    id: "federal-expungement",
    state: "Federal",
    overview: "Federal courts do not provide expungement or sealing. Relief may be available through presidential pardon or juvenile record sealing in limited circumstances.",
    waitingPeriods: {},
    exclusions: [
      "All adult federal convictions (no expungement available)",
      "Most federal charges (very limited relief options)"
    ],
    conditions: [
      "Presidential pardon (adult convictions)",
      "Juvenile adjudications under specific circumstances",
      "Cases dismissed or acquitted"
    ],
    steps: [
      "For pardons: Apply through Office of the Pardon Attorney",
      "For juvenile records: Consult federal public defender",
      "For dismissed cases: May already be sealed automatically"
    ],
    sources: [
      "U.S. Department of Justice Office of the Pardon Attorney",
      "Federal Juvenile Delinquency Act"
    ],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  }
];

// Helper function to get expungement rules by state
export function getExpungementByState(state: string): ExpungementRule | undefined {
  return expungementRules.find(rule => 
    rule.state.toLowerCase() === state.toLowerCase()
  );
}

// Helper function to get all available states
export function getAvailableExpungementStates(): string[] {
  return expungementRules.map(rule => rule.state).sort();
}

// Helper function to assess eligibility (simplified)
export function assessEligibility(
  state: string,
  offenseType: "misdemeanor" | "felony",
  completionDate: Date,
  hasMultipleConvictions: boolean,
  offenseCategory: string
): {
  eligibility: "likely" | "possible" | "unlikely";
  reason: string;
  nextSteps: string[];
} {
  const rule = getExpungementByState(state);
  
  if (!rule) {
    return {
      eligibility: "unlikely",
      reason: "Expungement rules not available for this state in our database.",
      nextSteps: ["Consult with a local attorney", "Contact state court system"]
    };
  }

  const monthsSinceCompletion = Math.floor(
    (new Date().getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  const requiredWaitingPeriod = offenseType === "felony" 
    ? (rule.waitingPeriods as any)?.felonyMonths || 0
    : (rule.waitingPeriods as any)?.misdemeanorMonths || 0;

  // Check exclusions
  const isExcluded = rule.exclusions?.some(exclusion => 
    exclusion.toLowerCase().includes(offenseCategory.toLowerCase()) ||
    offenseCategory.toLowerCase().includes(exclusion.toLowerCase())
  );

  if (isExcluded) {
    return {
      eligibility: "unlikely",
      reason: `${offenseCategory} offenses are typically excluded from expungement in ${state}.`,
      nextSteps: [
        "Consult with an attorney for possible alternatives",
        "Look into other forms of record relief",
        "Consider pardons or clemency if available"
      ]
    };
  }

  if (monthsSinceCompletion < requiredWaitingPeriod) {
    const monthsRemaining = requiredWaitingPeriod - monthsSinceCompletion;
    return {
      eligibility: "possible",
      reason: `Must wait ${monthsRemaining} more months before applying (${requiredWaitingPeriod} months total required).`,
      nextSteps: [
        "Wait until waiting period is complete",
        "Gather required documentation in the meantime",
        "Ensure all fines and restitution are paid"
      ]
    };
  }

  if (hasMultipleConvictions && state !== "CA") {
    return {
      eligibility: "possible",
      reason: "Multiple convictions may limit eligibility depending on specific circumstances.",
      nextSteps: [
        "Consult with an attorney to review all convictions",
        "Determine if any convictions are eligible individually",
        "Consider partial expungement if available"
      ]
    };
  }

  return {
    eligibility: "likely",
    reason: `Based on the information provided, you may be eligible for expungement in ${state}.`,
    nextSteps: rule.steps || [
      "Gather required documentation",
      "File petition with appropriate court",
      "Pay required fees",
      "Attend hearing if required"
    ]
  };
}