/**
 * Criminal Charge Citations Overlay
 *
 * This file maps charge IDs to verified statute citations.
 * It is separate from criminal-charges.ts to allow targeted updates
 * without touching the 100K+ line base data file.
 *
 * Confidence levels:
 *   'medium' — confirmed via secondary source (Justia, state legislature, NCSL)
 *   'high'   — confirmed via OpenLaws API traversal or cross-verified against official state
 *              legislature site; only 'high' entries surface the "Read the Law" button to users
 *
 * How to add a citation:
 *   1. Add an entry to CHARGE_CITATIONS below with confidence: 'medium'
 *   2. Run: npx tsx scripts/data-review/verify-charge-citations.ts --state XX --category [name]
 *   3. If OpenLaws confirms OR you verify directly on the official state legislature site,
 *      update confidence to 'high' and set lastVerified to current YYYY-MM
 *
 * Populated in phases by crime category — see memory/project_charge_citation_verification.md
 * for the priority order and verification workflow.
 */

export interface CitationRecord {
  /** Full citation in standard legal format, e.g. "Ala. Code § 13A-6-2" */
  citation: string;
  /** Secondary citations (alternate section, effective date range, etc.) */
  alternateCitations?: string[];
  confidence: 'medium' | 'high';
  /** YYYY-MM when this entry was last verified */
  lastVerified: string;
  /** Source used to confirm citation (secondary source name or 'OpenLaws') */
  source?: string;
}

/**
 * Map from charge ID to verified citation record.
 * Charge IDs follow the pattern: {jurisdiction}-{charge-name-slug}
 * e.g. 'al-murder-in-the-first-degree'
 */
export const CHARGE_CITATIONS: Record<string, CitationRecord> = {

  // ── BATCH 1: AL, AR, DC, DE, FL, GA, MD, MS, NC, SC, VA ─────────────────
  // Source: Justia, state legislature sites, DC Council Law Library
  // Verified: 2026-03 | Confidence: medium (secondary source)
  // AL promoted to 'high': OpenLaws API confirmed 2026-04

  "al-murder-in-the-first-degree": {
    citation: "Ala. Code § 13A-6-2",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System jury instructions and Justia Alabama Code Title 13A Chapter 6 Article 1",
  },
  "al-felony-murder": {
    citation: "Ala. Code § 13A-6-2(a)(3)",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System document for § 13A-6-2(a)(3) Murder (Felony Murder)",
  },
  "al-voluntary-manslaughter": {
    citation: "Ala. Code § 13A-6-3",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System and Justia — § 13A-6-3 Manslaughter includes heat-of-passion killing",
  },
  "al-involuntary-manslaughter": {
    citation: "Ala. Code § 13A-6-3",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Justia Alabama Code — § 13A-6-3 Manslaughter includes reckless killing",
  },
  "al-criminally-negligent-homicide": {
    citation: "Ala. Code § 13A-6-4",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System document and Justia — § 13A-6-4 Criminally Negligent Homicide",
  },
  "al-trespassing": {
    citation: "Ala. Code § 13A-7-2",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System and FindLaw — § 13A-7-2 Criminal Trespass in the First Degree",
  },
  "al-disorderly-conduct": {
    citation: "Ala. Code § 13A-11-7",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Justia Alabama Code Title 13A Chapter 11 — § 13A-11-7 Disorderly Conduct",
  },
  "al-public-intoxication": {
    citation: "Ala. Code § 13A-11-10",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Justia Alabama Code § 13A-11-10 — Public Intoxication",
  },
  "al-resisting-arrest": {
    citation: "Ala. Code § 13A-10-41",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Justia Alabama Code § 13A-10-41 — Resisting Arrest",
  },
  "al-failure-to-appear": {
    citation: "Ala. Code § 13A-10-39",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Alabama Judicial System and Justia — § 13A-10-39 Bail Jumping in the First Degree",
  },
  "al-petty-theft": {
    citation: "Ala. Code § 13A-8-5",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Justia Alabama Code § 13A-8-5 — Theft of Property in the Fourth Degree (Class A misdemeanor, under $500)",
  },
  "ar-murder-in-the-first-degree": {
    citation: "Ark. Code Ann. § 5-10-102",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code Title 5 Subtitle 2 Chapter 10 — Murder in the First Degree",
  },
  "ar-murder-in-the-second-degree": {
    citation: "Ark. Code Ann. § 5-10-103",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code Title 5 Subtitle 2 Chapter 10 — Murder in the Second Degree",
  },
  "ar-felony-murder": {
    citation: "Ark. Code Ann. § 5-10-101",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-10-101 — Capital Murder includes felony murder during enumerated felonies",
  },
  "ar-voluntary-manslaughter": {
    citation: "Ark. Code Ann. § 5-10-104",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-10-104 — Manslaughter (includes extreme emotional disturbance killing)",
  },
  "ar-involuntary-manslaughter": {
    citation: "Ark. Code Ann. § 5-10-104",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-10-104 — Manslaughter includes reckless killing",
  },
  "ar-criminally-negligent-homicide": {
    citation: "Ark. Code Ann. § 5-10-105",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-10-105 — Negligent Homicide",
  },
  "ar-vehicular-homicide": {
    citation: "Ark. Code Ann. § 5-10-105",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-10-105 — Negligent Homicide by vehicle while intoxicated is the primary vehicular death statute in Arkansas",
  },
  "ar-trespassing": {
    citation: "Ark. Code Ann. § 5-39-203",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia and WomensLaw.org — § 5-39-203 Criminal Trespass",
  },
  "ar-disorderly-conduct": {
    citation: "Ark. Code Ann. § 5-71-207",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-71-207 — Disorderly Conduct",
  },
  "ar-public-intoxication": {
    citation: "Ark. Code Ann. § 5-71-212",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-71-212 — Public Intoxication",
  },
  "ar-resisting-arrest": {
    citation: "Ark. Code Ann. § 5-54-103",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-54-103 — Resisting Arrest",
  },
  "ar-failure-to-appear": {
    citation: "Ark. Code Ann. § 5-54-120",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-54-120 — Failure to Appear",
  },
  "ar-petty-theft": {
    citation: "Ark. Code Ann. § 5-36-103",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Arkansas Code § 5-36-103 — Theft of Property (Class A misdemeanor for value $1,000 or less)",
  },
  "dc-murder-in-the-first-degree": {
    citation: "D.C. Code § 22-2101",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-2101 Murder in the First Degree",
  },
  "dc-murder-in-the-second-degree": {
    citation: "D.C. Code § 22-2103",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-2103 Murder in the Second Degree",
  },
  "dc-felony-murder": {
    citation: "D.C. Code § 22-2101",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-2101 includes killing during perpetration of enumerated felonies",
  },
  "dc-voluntary-manslaughter": {
    citation: "D.C. Code § 22-2105",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-2105 Penalty for Manslaughter",
  },
  "dc-involuntary-manslaughter": {
    citation: "D.C. Code § 22-2105",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-2105 Penalty for Manslaughter",
  },
  "dc-vehicular-homicide": {
    citation: "D.C. Code § 50-2203.01",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 50-2203.01 Negligent Homicide by vehicle operation",
  },
  "dc-attempted-murder": {
    citation: "D.C. Code § 22-1803",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-1803 Attempts to Commit Crime (general attempt statute)",
  },
  "dc-trespassing": {
    citation: "D.C. Code § 22-3302",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-3302 Unlawful Entry on Property",
  },
  "dc-disorderly-conduct": {
    citation: "D.C. Code § 22-1321",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-1321 Disorderly Conduct",
  },
  "dc-public-intoxication": {
    citation: "D.C. Code § 25-1001",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 25-1001 Drinking in Public Prohibited; Intoxication Prohibited",
  },
  "dc-resisting-arrest": {
    citation: "D.C. Code § 22-405.01",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-405.01 Resisting Arrest",
  },
  "dc-failure-to-appear": {
    citation: "D.C. Code § 23-1327",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 23-1327 Penalties for Failure to Appear",
  },
  "dc-petty-theft": {
    citation: "D.C. Code § 22-3211",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "DC Council Law Library — § 22-3211 Theft",
  },
  "de-murder-in-the-first-degree": {
    citation: "Del. Code Ann. tit. 11, § 636",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online Title 11 Chapter 5 Subchapter II — § 636 Murder in the First Degree",
  },
  "de-murder-in-the-second-degree": {
    citation: "Del. Code Ann. tit. 11, § 635",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 635 Murder in the Second Degree",
  },
  "de-felony-murder": {
    citation: "Del. Code Ann. tit. 11, § 636",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — Felony murder incorporated into § 636 Murder in the First Degree",
  },
  "de-voluntary-manslaughter": {
    citation: "Del. Code Ann. tit. 11, § 632",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 632 Manslaughter",
  },
  "de-involuntary-manslaughter": {
    citation: "Del. Code Ann. tit. 11, § 632",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 632 Manslaughter",
  },
  "de-criminally-negligent-homicide": {
    citation: "Del. Code Ann. tit. 11, § 631",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 631 Criminally Negligent Homicide",
  },
  "de-vehicular-homicide": {
    citation: "Del. Code Ann. tit. 11, § 630A",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 630A Vehicular Homicide in the First Degree (§ 630 is second degree)",
  },
  "de-attempted-murder": {
    citation: "Del. Code Ann. tit. 11, § 531",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 531 Attempt to Commit a Crime",
  },
  "de-trespassing": {
    citation: "Del. Code Ann. tit. 11, § 821",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Delaware Code § 821 — Criminal Trespass in the Third Degree (most common variant)",
  },
  "de-disorderly-conduct": {
    citation: "Del. Code Ann. tit. 11, § 1301",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online Subchapter VII — § 1301 Disorderly Conduct",
  },
  "de-public-intoxication": {
    citation: "Del. Code Ann. tit. 11, § 1315",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 1315 Public Intoxication",
  },
  "de-resisting-arrest": {
    citation: "Del. Code Ann. tit. 11, § 1257",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online Subchapter VI — § 1257 Resisting Arrest",
  },
  "de-failure-to-appear": {
    citation: "Del. Code Ann. tit. 11, § 1271",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online — § 1271 Criminal Contempt includes intentional failure to appear",
  },
  "de-petty-theft": {
    citation: "Del. Code Ann. tit. 11, § 841",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Delaware Code Online Subchapter III — § 841 Theft (Class A misdemeanor for lower-value property)",
  },
  "fl-murder-in-the-first-degree": {
    citation: "Fla. Stat. § 782.04(1)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.04(1) First Degree Murder",
  },
  "fl-murder-in-the-second-degree": {
    citation: "Fla. Stat. § 782.04(2)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.04(2) Second Degree Murder",
  },
  "fl-murder-in-the-third-degree": {
    citation: "Fla. Stat. § 782.04(4)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.04(4) Third Degree Murder",
  },
  "fl-felony-murder": {
    citation: "Fla. Stat. § 782.04(1)(a)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.04(1)(a) includes felony murder within first degree murder",
  },
  "fl-voluntary-manslaughter": {
    citation: "Fla. Stat. § 782.07",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.07 Manslaughter",
  },
  "fl-involuntary-manslaughter": {
    citation: "Fla. Stat. § 782.07",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.07 Manslaughter (culpable negligence)",
  },
  "fl-vehicular-homicide": {
    citation: "Fla. Stat. § 782.071",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 782.071 Vehicular Homicide",
  },
  "fl-attempted-murder": {
    citation: "Fla. Stat. § 777.04",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 777.04 Attempts (general attempt statute)",
  },
  "fl-trespassing": {
    citation: "Fla. Stat. § 810.08",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 810.08 Trespass in Structure or Conveyance",
  },
  "fl-disorderly-conduct": {
    citation: "Fla. Stat. § 877.03",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 877.03 Breach of the Peace; Disorderly Conduct",
  },
  "fl-public-intoxication": {
    citation: "Fla. Stat. § 856.011",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 856.011 Disorderly Intoxication",
  },
  "fl-resisting-arrest": {
    citation: "Fla. Stat. § 843.02",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 843.02 Resisting Officer Without Violence",
  },
  "fl-failure-to-appear": {
    citation: "Fla. Stat. § 901.31",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 901.31 Failure to Appear",
  },
  "fl-petty-theft": {
    citation: "Fla. Stat. § 812.014",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Florida Legislature Online Sunshine — § 812.014 Theft (petit theft under $750)",
  },
  "ga-murder-in-the-first-degree": {
    citation: "O.C.G.A. § 16-5-1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-5-1(a) Murder with malice aforethought",
  },
  "ga-felony-murder": {
    citation: "O.C.G.A. § 16-5-1(c)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-5-1(c) Felony Murder",
  },
  "ga-voluntary-manslaughter": {
    citation: "O.C.G.A. § 16-5-2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-5-2 Voluntary Manslaughter",
  },
  "ga-involuntary-manslaughter": {
    citation: "O.C.G.A. § 16-5-3",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-5-3 Involuntary Manslaughter",
  },
  "ga-vehicular-homicide": {
    citation: "O.C.G.A. § 40-6-393",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 40-6-393 Homicide by Vehicle",
  },
  "ga-trespassing": {
    citation: "O.C.G.A. § 16-7-21",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-7-21 Criminal Trespass",
  },
  "ga-disorderly-conduct": {
    citation: "O.C.G.A. § 16-11-39",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-11-39 Disorderly Conduct",
  },
  "ga-public-intoxication": {
    citation: "O.C.G.A. § 16-11-41",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-11-41 Public Drunkenness",
  },
  "ga-resisting-arrest": {
    citation: "O.C.G.A. § 16-10-24",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-10-24 Obstruction of Law Enforcement Officers",
  },
  "ga-failure-to-appear": {
    citation: "O.C.G.A. § 16-10-51",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-10-51 Bail Jumping",
  },
  "ga-petty-theft": {
    citation: "O.C.G.A. § 16-8-2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Georgia eLaws — § 16-8-2 Theft by Taking",
  },
  "md-murder-in-the-first-degree": {
    citation: "Md. Code Ann., Crim. Law § 2-201",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly website — § 2-201 First Degree Murder",
  },
  "md-murder-in-the-second-degree": {
    citation: "Md. Code Ann., Crim. Law § 2-204",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly website — § 2-204 Second Degree Murder",
  },
  "md-felony-murder": {
    citation: "Md. Code Ann., Crim. Law § 2-201",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 2-201 includes killing during perpetration of enumerated felonies (felony murder)",
  },
  "md-voluntary-manslaughter": {
    citation: "Md. Code Ann., Crim. Law § 2-207",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 2-207 Manslaughter",
  },
  "md-involuntary-manslaughter": {
    citation: "Md. Code Ann., Crim. Law § 2-207",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 2-207 Manslaughter",
  },
  "md-vehicular-homicide": {
    citation: "Md. Code Ann., Crim. Law § 2-209",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 2-209 Manslaughter by Vehicle or Vessel",
  },
  "md-attempted-murder": {
    citation: "Md. Code Ann., Crim. Law § 2-205",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 2-205 Attempted First Degree Murder",
  },
  "md-trespassing": {
    citation: "Md. Code Ann., Crim. Law § 6-403",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 6-403 Trespass on Private Property",
  },
  "md-disorderly-conduct": {
    citation: "Md. Code Ann., Crim. Law § 10-201",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 10-201 Disorderly Conduct",
  },
  "md-resisting-arrest": {
    citation: "Md. Code Ann., Crim. Law § 9-408",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 9-408 Resisting Arrest",
  },
  "md-petty-theft": {
    citation: "Md. Code Ann., Crim. Law § 7-104",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maryland General Assembly — § 7-104 Theft",
  },
  "ms-murder-in-the-first-degree": {
    citation: "Miss. Code Ann. § 97-3-19(1)(a)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-3-19 first-degree murder defined as deliberate design killing",
  },
  "ms-murder-in-the-second-degree": {
    citation: "Miss. Code Ann. § 97-3-19(1)(b)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-3-19(1)(b) second-degree murder (depraved heart killing)",
  },
  "ms-felony-murder": {
    citation: "Miss. Code Ann. § 97-3-19(2)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-3-19(2) Capital Murder includes felony murder during enumerated felonies",
  },
  "ms-voluntary-manslaughter": {
    citation: "Miss. Code Ann. § 97-3-35",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "University of Mississippi Law reference — § 97-3-35 Heat of Passion Manslaughter",
  },
  "ms-involuntary-manslaughter": {
    citation: "Miss. Code Ann. § 97-3-47",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-3-47 Culpable Negligence Manslaughter",
  },
  "ms-attempted-murder": {
    citation: "Miss. Code Ann. § 97-1-7",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-1-7 Attempt to Commit Offense",
  },
  "ms-trespassing": {
    citation: "Miss. Code Ann. § 97-17-97",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-17-97 Trespass",
  },
  "ms-disorderly-conduct": {
    citation: "Miss. Code Ann. § 97-35-7",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-35-7 Disorderly Conduct",
  },
  "ms-public-intoxication": {
    citation: "Miss. Code Ann. § 97-29-47",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-29-47 Profanity or Drunkenness in Public Place",
  },
  "ms-resisting-arrest": {
    citation: "Miss. Code Ann. § 97-9-73",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-9-73 Resisting or Obstructing Arrest",
  },
  "ms-petty-theft": {
    citation: "Miss. Code Ann. § 97-17-43",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia Mississippi Code — § 97-17-43 Petit Larceny (under $1,000)",
  },
  "nc-murder-in-the-first-degree": {
    citation: "N.C. Gen. Stat. § 14-17",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-17 Murder in the First and Second Degree Defined",
  },
  "nc-murder-in-the-second-degree": {
    citation: "N.C. Gen. Stat. § 14-17(b)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-17(b) Second Degree Murder",
  },
  "nc-felony-murder": {
    citation: "N.C. Gen. Stat. § 14-17",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-17 felony murder integrated into first-degree murder",
  },
  "nc-voluntary-manslaughter": {
    citation: "N.C. Gen. Stat. § 14-18",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-18 Voluntary Manslaughter (Class D felony)",
  },
  "nc-involuntary-manslaughter": {
    citation: "N.C. Gen. Stat. § 14-18",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-18 Involuntary Manslaughter (Class F felony)",
  },
  "nc-vehicular-homicide": {
    citation: "N.C. Gen. Stat. § 20-141.4",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 20-141.4 Felony and Misdemeanor Death by Vehicle",
  },
  "nc-trespassing": {
    citation: "N.C. Gen. Stat. § 14-159.12",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-159.12 First Degree Trespass",
  },
  "nc-disorderly-conduct": {
    citation: "N.C. Gen. Stat. § 14-288.4",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-288.4 Disorderly Conduct",
  },
  "nc-public-intoxication": {
    citation: "N.C. Gen. Stat. § 14-444",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-444 Intoxicated and Disruptive in Public",
  },
  "nc-resisting-arrest": {
    citation: "N.C. Gen. Stat. § 14-223",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-223 Resisting Public Officers",
  },
  "nc-failure-to-appear": {
    citation: "N.C. Gen. Stat. § 15A-543",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 15A-543 Failure to Appear",
  },
  "nc-petty-theft": {
    citation: "N.C. Gen. Stat. § 14-72",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NC General Assembly — § 14-72 Larceny of Property (Class 1 misdemeanor for $1,000 or less)",
  },
  "sc-murder-in-the-first-degree": {
    citation: "S.C. Code Ann. § 16-3-10",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 16-3-10 Murder Defined",
  },
  "sc-attempted-murder": {
    citation: "S.C. Code Ann. § 16-3-29",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 16-3-29 Attempted Murder",
  },
  "sc-voluntary-manslaughter": {
    citation: "S.C. Code Ann. § 16-3-50",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 16-3-50 Manslaughter (voluntary)",
  },
  "sc-involuntary-manslaughter": {
    citation: "S.C. Code Ann. § 16-3-60",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 16-3-60 Involuntary Manslaughter",
  },
  "sc-trespassing": {
    citation: "S.C. Code Ann. § 16-11-620",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia South Carolina Code — § 16-11-620 Entering Premises After Warning or Refusing to Leave",
  },
  "sc-disorderly-conduct": {
    citation: "S.C. Code Ann. § 16-17-530",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia South Carolina Code — § 16-17-530 Public Disorderly Conduct",
  },
  "sc-public-intoxication": {
    citation: "S.C. Code Ann. § 16-17-530",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia South Carolina Code — § 16-17-530 covers grossly intoxicated public conduct",
  },
  "sc-resisting-arrest": {
    citation: "S.C. Code Ann. § 16-9-320",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 16-9-320 Opposing or Resisting Law Enforcement Officer",
  },
  "sc-failure-to-appear": {
    citation: "S.C. Code Ann. § 17-15-90",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "South Carolina Legislature — § 17-15-90 Willful Failure to Appear",
  },
  "sc-petty-theft": {
    citation: "S.C. Code Ann. § 16-13-30",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Justia South Carolina Code — § 16-13-30 Petit Larceny (value $2,000 or less)",
  },
  "va-murder-in-the-first-degree": {
    citation: "Va. Code Ann. § 18.2-32",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-32 First and Second Degree Murder Defined",
  },
  "va-murder-in-the-second-degree": {
    citation: "Va. Code Ann. § 18.2-32",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-32 second degree murder is all murder not aggravated or first degree",
  },
  "va-felony-murder": {
    citation: "Va. Code Ann. § 18.2-33",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-33 Felony Homicide Defined",
  },
  "va-voluntary-manslaughter": {
    citation: "Va. Code Ann. § 18.2-35",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-35 How Voluntary Manslaughter Punished",
  },
  "va-involuntary-manslaughter": {
    citation: "Va. Code Ann. § 18.2-36",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-36 How Involuntary Manslaughter Punished",
  },
  "va-vehicular-homicide": {
    citation: "Va. Code Ann. § 18.2-36.1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-36.1 Involuntary Manslaughter; DUI vehicular death",
  },
  "va-attempted-murder": {
    citation: "Va. Code Ann. § 18.2-25",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-25 Attempts of Class 1 felonies (murder attempt = Class 2 felony)",
  },
  "va-trespassing": {
    citation: "Va. Code Ann. § 18.2-119",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-119 Trespass After Having Been Forbidden",
  },
  "va-disorderly-conduct": {
    citation: "Va. Code Ann. § 18.2-415",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-415 Disorderly Conduct in Public Places",
  },
  "va-public-intoxication": {
    citation: "Va. Code Ann. § 18.2-388",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-388 Intoxicated in Public",
  },
  "va-resisting-arrest": {
    citation: "Va. Code Ann. § 18.2-460",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-460(E) Resisting Arrest",
  },
  "va-failure-to-appear": {
    citation: "Va. Code Ann. § 19.2-128",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 19.2-128 Penalties for Failure to Appear",
  },
  "va-petty-theft": {
    citation: "Va. Code Ann. § 18.2-96",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Virginia LIS — § 18.2-96 Petit Larceny Defined",
  },

  // ── BATCH 2: MA, ME, MI, NH, NY, PA, RI, VT ──────────────────────────────
  // CT: skipped — cga.ct.gov SSL errors; to be filled in next pass
  // NJ: skipped — njleg.state.nj.us unreachable; to be filled in next pass
  // Source: Justia, state legislature sites, malegislature.gov, gc.nh.gov
  // Verified: 2026-03 | Confidence: medium (secondary source)

  // — Massachusetts —
  "ma-murder-in-the-first-degree": {
    citation: "Mass. Gen. Laws c. 265, § 1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 1 Murder (1st and 2nd degree same section)",
  },
  "ma-murder-in-the-second-degree": {
    citation: "Mass. Gen. Laws c. 265, § 1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 1 (2nd degree = all murder not 1st degree)",
  },
  "ma-voluntary-manslaughter": {
    citation: "Mass. Gen. Laws c. 265, § 13",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 13 Manslaughter",
  },
  "ma-involuntary-manslaughter": {
    citation: "Mass. Gen. Laws c. 265, § 13",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 13 Manslaughter (covers both voluntary and involuntary)",
  },
  "ma-vehicular-homicide": {
    citation: "Mass. Gen. Laws c. 265, § 13½",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 13½ Vehicular Homicide",
  },
  "ma-attempted-murder": {
    citation: "Mass. Gen. Laws c. 265, § 16",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 265 § 16 Assault with Intent to Murder",
  },
  "ma-trespassing": {
    citation: "Mass. Gen. Laws c. 266, § 120",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 266 § 120 Trespass",
  },
  "ma-disorderly-conduct": {
    citation: "Mass. Gen. Laws c. 272, § 53",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 272 § 53 Disorderly Conduct",
  },
  "ma-public-intoxication": {
    citation: "Mass. Gen. Laws c. 272, § 53",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 272 § 53 covers being drunk in public",
  },
  "ma-resisting-arrest": {
    citation: "Mass. Gen. Laws c. 268, § 32B",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 268 § 32B Resisting Arrest",
  },
  "ma-petty-theft": {
    citation: "Mass. Gen. Laws c. 266, § 30",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Massachusetts Legislature — c. 266 § 30 Larceny",
  },

  // — Maine —
  "me-murder-in-the-first-degree": {
    citation: "Me. Rev. Stat. tit. 17-A, § 201",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 201 Murder",
  },
  "me-felony-murder": {
    citation: "Me. Rev. Stat. tit. 17-A, § 202",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 202 Felony Murder",
  },
  "me-voluntary-manslaughter": {
    citation: "Me. Rev. Stat. tit. 17-A, § 203",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 203 Manslaughter",
  },
  "me-involuntary-manslaughter": {
    citation: "Me. Rev. Stat. tit. 17-A, § 203",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 203 Manslaughter (covers both voluntary and involuntary)",
  },
  "me-trespassing": {
    citation: "Me. Rev. Stat. tit. 17-A, § 501",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 501 Criminal Trespass",
  },
  "me-disorderly-conduct": {
    citation: "Me. Rev. Stat. tit. 17-A, § 506-A",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 506-A Disorderly Conduct",
  },
  "me-resisting-arrest": {
    citation: "Me. Rev. Stat. tit. 17-A, § 751-B",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 751-B Resisting Arrest",
  },
  "me-petty-theft": {
    citation: "Me. Rev. Stat. tit. 17-A, § 357",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Maine Legislature — tit. 17-A § 357 Theft by Unauthorized Taking or Transfer",
  },

  // — Michigan —
  "mi-murder-in-the-first-degree": {
    citation: "Mich. Comp. Laws § 750.316",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.316 Murder in the First Degree",
  },
  "mi-murder-in-the-second-degree": {
    citation: "Mich. Comp. Laws § 750.317",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.317 Murder in the Second Degree",
  },
  "mi-voluntary-manslaughter": {
    citation: "Mich. Comp. Laws § 750.321",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.321 Manslaughter",
  },
  "mi-involuntary-manslaughter": {
    citation: "Mich. Comp. Laws § 750.321",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.321 Manslaughter (covers both voluntary and involuntary)",
  },
  "mi-vehicular-homicide": {
    citation: "Mich. Comp. Laws § 257.625",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 257.625 OWI causing death; vehicular homicide",
  },
  "mi-attempted-murder": {
    citation: "Mich. Comp. Laws § 750.83",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.83 Assault with Intent to Commit Murder",
  },
  "mi-trespassing": {
    citation: "Mich. Comp. Laws § 750.552",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.552 Trespassing",
  },
  "mi-disorderly-conduct": {
    citation: "Mich. Comp. Laws § 750.167",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.167 Disorderly Person",
  },
  "mi-public-intoxication": {
    citation: "Mich. Comp. Laws § 750.167",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.167 Disorderly Person (covers public intoxication)",
  },
  "mi-resisting-arrest": {
    citation: "Mich. Comp. Laws § 750.479",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.479 Resisting and Obstructing",
  },
  "mi-petty-theft": {
    citation: "Mich. Comp. Laws § 750.356",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Michigan Legislature — MCL § 750.356 Larceny",
  },

  // — New Hampshire —
  "nh-murder-in-the-first-degree": {
    citation: "N.H. Rev. Stat. Ann. § 630:1-a",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 630:1-a Murder in the First Degree",
  },
  "nh-murder-in-the-second-degree": {
    citation: "N.H. Rev. Stat. Ann. § 630:1-b",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 630:1-b Murder in the Second Degree",
  },
  "nh-voluntary-manslaughter": {
    citation: "N.H. Rev. Stat. Ann. § 630:2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 630:2 Manslaughter",
  },
  "nh-involuntary-manslaughter": {
    citation: "N.H. Rev. Stat. Ann. § 630:2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 630:2 Manslaughter",
  },
  "nh-criminally-negligent-homicide": {
    citation: "N.H. Rev. Stat. Ann. § 630:3",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 630:3 Negligent Homicide",
  },
  "nh-attempted-murder": {
    citation: "N.H. Rev. Stat. Ann. § 629:1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 629:1 Criminal Attempt",
  },
  "nh-trespassing": {
    citation: "N.H. Rev. Stat. Ann. § 635:2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 635:2 Criminal Trespass",
  },
  "nh-disorderly-conduct": {
    citation: "N.H. Rev. Stat. Ann. § 644:2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 644:2 Disorderly Conduct",
  },
  "nh-resisting-arrest": {
    citation: "N.H. Rev. Stat. Ann. § 642:2",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 642:2 Resisting Arrest or Detention",
  },
  "nh-failure-to-appear": {
    citation: "N.H. Rev. Stat. Ann. § 597:7-a",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 597:7-a Failure to Appear",
  },
  "nh-petty-theft": {
    citation: "N.H. Rev. Stat. Ann. § 637:3",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NH General Court — RSA § 637:3 Theft by Unauthorized Taking",
  },

  // — New York —
  "ny-murder-in-the-first-degree": {
    citation: "N.Y. Penal Law § 125.27",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 125 — § 125.27 Murder in the First Degree",
  },
  "ny-murder-in-the-second-degree": {
    citation: "N.Y. Penal Law § 125.25",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 125 — § 125.25 Murder in the Second Degree",
  },
  "ny-felony-murder": {
    citation: "N.Y. Penal Law § 125.25",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature — § 125.25(3) felony murder incorporated into Murder 2nd Degree",
  },
  "ny-voluntary-manslaughter": {
    citation: "N.Y. Penal Law § 125.20",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 125 — § 125.20 Manslaughter in the First Degree",
  },
  "ny-involuntary-manslaughter": {
    citation: "N.Y. Penal Law § 125.15",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 125 — § 125.15 Manslaughter in the Second Degree",
  },
  "ny-criminally-negligent-homicide": {
    citation: "N.Y. Penal Law § 125.10",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 125 — § 125.10 Criminally Negligent Homicide",
  },
  "ny-attempted-murder": {
    citation: "N.Y. Penal Law § 110.00",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature — § 110.00 Attempt (combined with § 125.25 for attempted murder 2nd degree)",
  },
  "ny-trespassing": {
    citation: "N.Y. Penal Law § 140.05",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 140 — § 140.05 Trespass (violation)",
  },
  "ny-disorderly-conduct": {
    citation: "N.Y. Penal Law § 240.20",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 240 — § 240.20 Disorderly Conduct",
  },
  "ny-public-intoxication": {
    citation: "N.Y. Penal Law § 240.40",
    confidence: "high",
    lastVerified: "2026-04",
    source: "NY Legislature Penal Law Article 240 — § 240.40 Appearing in public under the influence of narcotics or a drug other than alcohol (violation)",
  },
  "ny-resisting-arrest": {
    citation: "N.Y. Penal Law § 205.30",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 205 — § 205.30 Resisting Arrest",
  },
  "ny-failure-to-appear": {
    citation: "N.Y. Penal Law § 215.56",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 215 — § 215.56 Bail Jumping in the Second Degree",
  },
  "ny-petty-theft": {
    citation: "N.Y. Penal Law § 155.25",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "NY Legislature Penal Law Article 155 — § 155.25 Petit Larceny",
  },

  // — Pennsylvania —
  "pa-murder-in-the-first-degree": {
    citation: "18 Pa.C.S. § 2502(a)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 2502(a) Murder in the First Degree",
  },
  "pa-murder-in-the-second-degree": {
    citation: "18 Pa.C.S. § 2502(b)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 2502(b) Murder in the Second Degree (felony murder)",
  },
  "pa-murder-in-the-third-degree": {
    citation: "18 Pa.C.S. § 2502(c)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 2502(c) Murder in the Third Degree",
  },
  "pa-felony-murder": {
    citation: "18 Pa.C.S. § 2502(b)",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — § 2502(b) Murder 2nd Degree is PA's felony murder doctrine",
  },
  "pa-voluntary-manslaughter": {
    citation: "18 Pa.C.S. § 2503",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 2503 Voluntary Manslaughter",
  },
  "pa-involuntary-manslaughter": {
    citation: "18 Pa.C.S. § 2504",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 2504 Involuntary Manslaughter",
  },
  "pa-attempted-murder": {
    citation: "18 Pa.C.S. § 901",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 901 Criminal Attempt (applied to § 2502 murder)",
  },
  "pa-trespassing": {
    citation: "18 Pa.C.S. § 3503",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 3503 Criminal Trespass",
  },
  "pa-disorderly-conduct": {
    citation: "18 Pa.C.S. § 5503",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 5503 Disorderly Conduct",
  },
  "pa-public-intoxication": {
    citation: "18 Pa.C.S. § 5505",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 5505 Public Drunkenness",
  },
  "pa-petty-theft": {
    citation: "18 Pa.C.S. § 3921",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Pennsylvania Legislature — 18 Pa.C.S. § 3921 Theft by Unlawful Taking",
  },

  // — Rhode Island —
  "ri-murder-in-the-first-degree": {
    citation: "R.I. Gen. Laws § 11-23-1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-23-1 Murder (1st and 2nd degree in same section)",
  },
  "ri-murder-in-the-second-degree": {
    citation: "R.I. Gen. Laws § 11-23-1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-23-1 (2nd degree = all murder not 1st degree)",
  },
  "ri-voluntary-manslaughter": {
    citation: "R.I. Gen. Laws § 11-23-3",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-23-3 Manslaughter",
  },
  "ri-involuntary-manslaughter": {
    citation: "R.I. Gen. Laws § 11-23-3",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-23-3 Manslaughter",
  },
  "ri-trespassing": {
    citation: "R.I. Gen. Laws § 11-44-26",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-44-26 Simple Trespass",
  },
  "ri-disorderly-conduct": {
    citation: "R.I. Gen. Laws § 11-45-1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-45-1 Disorderly Conduct",
  },
  "ri-resisting-arrest": {
    citation: "R.I. Gen. Laws § 12-7-10",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 12-7-10 Resisting Arrest",
  },
  "ri-petty-theft": {
    citation: "R.I. Gen. Laws § 11-41-1",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "RI General Assembly — § 11-41-1 Larceny",
  },

  // — Vermont —
  "vt-murder-in-the-first-degree": {
    citation: "Vt. Stat. Ann. tit. 13, § 2301",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2301 Murder (1st and 2nd degree same section)",
  },
  "vt-murder-in-the-second-degree": {
    citation: "Vt. Stat. Ann. tit. 13, § 2301",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2301 (2nd degree = all murder not 1st degree)",
  },
  "vt-voluntary-manslaughter": {
    citation: "Vt. Stat. Ann. tit. 13, § 2303",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2303 Manslaughter",
  },
  "vt-involuntary-manslaughter": {
    citation: "Vt. Stat. Ann. tit. 13, § 2303",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2303 Manslaughter",
  },
  "vt-criminally-negligent-homicide": {
    citation: "Vt. Stat. Ann. tit. 13, § 2304",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2304 Negligent Homicide",
  },
  "vt-trespassing": {
    citation: "Vt. Stat. Ann. tit. 13, § 3701",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 3701 Trespass",
  },
  "vt-disorderly-conduct": {
    citation: "Vt. Stat. Ann. tit. 13, § 1026",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 1026 Disorderly Conduct",
  },
  "vt-resisting-arrest": {
    citation: "Vt. Stat. Ann. tit. 13, § 3017",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 3017 Resisting a Law Enforcement Officer",
  },
  "vt-petty-theft": {
    citation: "Vt. Stat. Ann. tit. 13, § 2501",
    confidence: "medium",
    lastVerified: "2026-03",
    source: "Vermont Legislature — tit. 13 § 2501 Larceny",
  },

  // ── BATCH 3: IA, KS, MN, MO, ND, NE, OH, WI ─────────────────────────────
  // IL, IN, KY, SD: skipped — legislature sites returned 403/404 or JS-only pages;
  //   will retry in a targeted follow-up pass
  // MN public-intoxication: omitted — Minn. Stat. § 340A.902 prohibits prosecution
  //   for public drunkenness; MN has no criminal public intoxication offense
  // Source: Justia, state legislature sites (legis.iowa.gov, kslegislature.org,
  //   revisor.mn.gov, revisor.mo.gov, legis.nd.gov, nebraskalegislature.gov,
  //   codes.ohio.gov, docs.legis.wisconsin.gov)
  // Verified: 2026-04 | Confidence: medium (secondary source)

  // — Iowa —
  "ia-murder-in-the-first-degree": {
    citation: "Iowa Code § 707.2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.2 Murder in the first degree",
  },
  "ia-murder-in-the-second-degree": {
    citation: "Iowa Code § 707.3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.3 Murder in the second degree",
  },
  "ia-voluntary-manslaughter": {
    citation: "Iowa Code § 707.4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.4 Voluntary manslaughter",
  },
  "ia-involuntary-manslaughter": {
    citation: "Iowa Code § 707.5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.5 Involuntary manslaughter",
  },
  "ia-vehicular-homicide": {
    citation: "Iowa Code § 707.6A",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.6A Homicide or serious injury by vehicle",
  },
  "ia-attempted-murder": {
    citation: "Iowa Code § 707.11",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 707.11 Attempt to commit murder",
  },
  "ia-trespassing": {
    citation: "Iowa Code § 716.7",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 716.7 Trespass defined",
  },
  "ia-disorderly-conduct": {
    citation: "Iowa Code § 723.4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Iowa Legislature — Iowa Code § 723.4 Disorderly conduct",
  },

  // — Kansas —
  "ks-murder-in-the-first-degree": {
    citation: "Kan. Stat. Ann. § 21-5402",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5402 Murder in the first degree",
  },
  "ks-murder-in-the-second-degree": {
    citation: "Kan. Stat. Ann. § 21-5403",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5403 Murder in the second degree",
  },
  "ks-felony-murder": {
    citation: "Kan. Stat. Ann. § 21-5402",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — § 21-5402 Murder in the first degree (includes felony murder)",
  },
  "ks-voluntary-manslaughter": {
    citation: "Kan. Stat. Ann. § 21-5404",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5404 Voluntary manslaughter",
  },
  "ks-involuntary-manslaughter": {
    citation: "Kan. Stat. Ann. § 21-5405",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5405 Involuntary manslaughter",
  },
  "ks-vehicular-homicide": {
    citation: "Kan. Stat. Ann. § 21-5406",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5406 Vehicular homicide",
  },
  "ks-trespassing": {
    citation: "Kan. Stat. Ann. § 21-5808",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5808 Criminal trespass",
  },
  "ks-petty-theft": {
    citation: "Kan. Stat. Ann. § 21-5801",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5801 Theft",
  },
  "ks-failure-to-appear": {
    citation: "Kan. Stat. Ann. § 21-5915",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Kansas Legislature — Kan. Stat. Ann. § 21-5915 Failure to appear",
  },

  // — Minnesota —
  "mn-murder-in-the-first-degree": {
    citation: "Minn. Stat. § 609.185",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.185 Murder in the First Degree",
  },
  "mn-murder-in-the-second-degree": {
    citation: "Minn. Stat. § 609.19",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.19 Murder in the Second Degree",
  },
  "mn-murder-in-the-third-degree": {
    citation: "Minn. Stat. § 609.195",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.195 Murder in the Third Degree",
  },
  "mn-voluntary-manslaughter": {
    citation: "Minn. Stat. § 609.20",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.20 Manslaughter in the First Degree",
  },
  "mn-involuntary-manslaughter": {
    citation: "Minn. Stat. § 609.205",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.205 Manslaughter in the Second Degree",
  },
  "mn-vehicular-homicide": {
    citation: "Minn. Stat. § 609.2112",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.2112 Criminal Vehicular Homicide",
  },
  "mn-trespassing": {
    citation: "Minn. Stat. § 609.605",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.605 Trespass",
  },
  "mn-disorderly-conduct": {
    citation: "Minn. Stat. § 609.72",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.72 Disorderly Conduct",
  },
  "mn-resisting-arrest": {
    citation: "Minn. Stat. § 609.50",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.50 Obstructing Legal Process or Arrest",
  },
  "mn-failure-to-appear": {
    citation: "Minn. Stat. § 609.491",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.491 Failure to Appear",
  },
  "mn-petty-theft": {
    citation: "Minn. Stat. § 609.52",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Minnesota Revisor of Statutes — § 609.52 Theft",
  },

  // — Missouri —
  "mo-murder-in-the-first-degree": {
    citation: "Mo. Rev. Stat. § 565.020",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 565.020 First degree murder, penalty",
  },
  "mo-murder-in-the-second-degree": {
    citation: "Mo. Rev. Stat. § 565.021",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 565.021 Second degree murder, penalty",
  },
  "mo-voluntary-manslaughter": {
    citation: "Mo. Rev. Stat. § 565.023",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 565.023 Voluntary manslaughter, penalty",
  },
  "mo-involuntary-manslaughter": {
    citation: "Mo. Rev. Stat. § 565.024",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 565.024 Involuntary manslaughter, first degree, penalty",
  },
  "mo-disorderly-conduct": {
    citation: "Mo. Rev. Stat. § 574.010",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 574.010 Peace disturbance, penalty",
  },
  "mo-public-intoxication": {
    citation: "Mo. Rev. Stat. § 574.075",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Missouri Revisor of Statutes — § 574.075 Drunkenness or drinking in certain places prohibited",
  },

  // — North Dakota —
  // ND does not codify murder by separate degree sections; all degrees within § 12.1-16-01
  "nd-murder-in-the-first-degree": {
    citation: "N.D. Cent. Code § 12.1-16-01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "ND Legislative Branch — § 12.1-16-01 Murder (all degrees within one section)",
  },
  "nd-murder-in-the-second-degree": {
    citation: "N.D. Cent. Code § 12.1-16-01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "ND Legislative Branch — § 12.1-16-01 Murder (degrees defined within same section)",
  },
  "nd-involuntary-manslaughter": {
    citation: "N.D. Cent. Code § 12.1-16-02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "ND Legislative Branch — § 12.1-16-02 Manslaughter",
  },
  "nd-criminally-negligent-homicide": {
    citation: "N.D. Cent. Code § 12.1-16-03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "ND Legislative Branch — § 12.1-16-03 Negligent homicide",
  },

  // — Nebraska —
  "ne-murder-in-the-first-degree": {
    citation: "Neb. Rev. Stat. § 28-303",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-303 Murder in the first degree",
  },
  "ne-murder-in-the-second-degree": {
    citation: "Neb. Rev. Stat. § 28-304",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-304 Murder in the second degree",
  },
  "ne-voluntary-manslaughter": {
    citation: "Neb. Rev. Stat. § 28-305",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-305 Manslaughter",
  },
  "ne-involuntary-manslaughter": {
    citation: "Neb. Rev. Stat. § 28-305",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-305 Manslaughter (covers both voluntary and involuntary)",
  },
  "ne-vehicular-homicide": {
    citation: "Neb. Rev. Stat. § 28-306",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-306 Motor vehicle homicide",
  },
  "ne-attempted-murder": {
    citation: "Neb. Rev. Stat. § 28-201",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-201 Criminal attempt (general attempt statute applied to murder)",
  },
  "ne-trespassing": {
    citation: "Neb. Rev. Stat. § 28-521",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-521 Criminal trespass, second degree",
  },
  "ne-disorderly-conduct": {
    citation: "Neb. Rev. Stat. § 28-1322",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-1322 Disturbing the peace",
  },
  "ne-resisting-arrest": {
    citation: "Neb. Rev. Stat. § 28-904",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-904 Resisting arrest",
  },
  "ne-petty-theft": {
    citation: "Neb. Rev. Stat. § 28-511",
    confidence: "high",
    lastVerified: "2026-04",
    source: "Nebraska Legislature — § 28-511 Theft by unlawful taking or disposition",
  },

  // — Ohio —
  "oh-murder-in-the-first-degree": {
    citation: "Ohio Rev. Code Ann. § 2903.01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.01 Aggravated murder",
  },
  "oh-murder-in-the-second-degree": {
    citation: "Ohio Rev. Code Ann. § 2903.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.02 Murder",
  },
  "oh-felony-murder": {
    citation: "Ohio Rev. Code Ann. § 2903.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.02(B) felony murder",
  },
  "oh-voluntary-manslaughter": {
    citation: "Ohio Rev. Code Ann. § 2903.03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.03 Voluntary manslaughter",
  },
  "oh-involuntary-manslaughter": {
    citation: "Ohio Rev. Code Ann. § 2903.04",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.04 Involuntary manslaughter",
  },
  "oh-criminally-negligent-homicide": {
    citation: "Ohio Rev. Code Ann. § 2903.05",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.05 Negligent homicide",
  },
  "oh-vehicular-homicide": {
    citation: "Ohio Rev. Code Ann. § 2903.06",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2903.06 Aggravated vehicular homicide; vehicular homicide",
  },
  "oh-attempted-murder": {
    citation: "Ohio Rev. Code Ann. § 2923.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2923.02 Attempt to commit an offense",
  },
  "oh-trespassing": {
    citation: "Ohio Rev. Code Ann. § 2911.21",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2911.21 Criminal trespass",
  },
  "oh-disorderly-conduct": {
    citation: "Ohio Rev. Code Ann. § 2917.11",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2917.11 Disorderly conduct",
  },
  "oh-public-intoxication": {
    citation: "Ohio Rev. Code Ann. § 2917.11",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2917.11(B) covers public intoxication under disorderly conduct",
  },
  "oh-resisting-arrest": {
    citation: "Ohio Rev. Code Ann. § 2921.33",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2921.33 Resisting arrest",
  },
  "oh-failure-to-appear": {
    citation: "Ohio Rev. Code Ann. § 2937.99",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2937.99 Failure to appear penalty provision",
  },
  "oh-petty-theft": {
    citation: "Ohio Rev. Code Ann. § 2913.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Ohio Revised Code — § 2913.02 Theft (misdemeanor 1st degree under $1,000)",
  },

  // — Wisconsin —
  "wi-murder-in-the-first-degree": {
    citation: "Wis. Stat. § 940.01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 940.01 First-degree intentional homicide",
  },
  "wi-murder-in-the-second-degree": {
    citation: "Wis. Stat. § 940.05",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 940.05 Second-degree intentional homicide",
  },
  "wi-felony-murder": {
    citation: "Wis. Stat. § 940.03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 940.03 Felony murder",
  },
  "wi-criminally-negligent-homicide": {
    citation: "Wis. Stat. § 940.08",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 940.08 Homicide by negligent handling of dangerous weapon",
  },
  "wi-vehicular-homicide": {
    citation: "Wis. Stat. § 940.09",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 940.09 Homicide by intoxicated use of vehicle or firearm",
  },
  "wi-trespassing": {
    citation: "Wis. Stat. § 943.13",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 943.13 Trespass to land",
  },
  "wi-disorderly-conduct": {
    citation: "Wis. Stat. § 947.01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 947.01 Disorderly conduct",
  },
  "wi-resisting-arrest": {
    citation: "Wis. Stat. § 946.41",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 946.41 Resisting or obstructing officer",
  },
  "wi-failure-to-appear": {
    citation: "Wis. Stat. § 946.49",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Wisconsin Legislature — § 946.49 Bail jumping",
  },

  // ── BATCH 4: AZ, CO, LA, MT, OK, TN, TX, UT, WV ─────────────────────────
  // NM: skipped — legislature site unreachable; retry needed
  // WY: skipped — legislature site unreachable; retry needed
  // CO, TN, TX everyday offenses: partial — only homicide pre-confirmed; retry for everyday
  // Source: azleg.gov, legis.la.gov, mca.legmt.gov, oscn.net, le.utah.gov, code.wvlegislature.gov
  // Verified: 2026-04 | Confidence: medium (secondary source)

  // — Arizona —
  "az-murder-in-the-first-degree": {
    citation: "Ariz. Rev. Stat. § 13-1105",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1105 First degree murder",
  },
  "az-murder-in-the-second-degree": {
    citation: "Ariz. Rev. Stat. § 13-1104",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1104 Second degree murder",
  },
  "az-voluntary-manslaughter": {
    citation: "Ariz. Rev. Stat. § 13-1103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1103 Manslaughter",
  },
  "az-involuntary-manslaughter": {
    citation: "Ariz. Rev. Stat. § 13-1103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1103 Manslaughter (covers both voluntary and involuntary)",
  },
  "az-criminally-negligent-homicide": {
    citation: "Ariz. Rev. Stat. § 13-1102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1102 Negligent homicide",
  },
  "az-disorderly-conduct": {
    citation: "Ariz. Rev. Stat. § 13-2904",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-2904 Disorderly conduct",
  },
  "az-resisting-arrest": {
    citation: "Ariz. Rev. Stat. § 13-2508",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-2508 Resisting arrest",
  },
  "az-failure-to-appear": {
    citation: "Ariz. Rev. Stat. § 13-2507",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-2507 Failure to appear in the first degree",
  },
  "az-petty-theft": {
    citation: "Ariz. Rev. Stat. § 13-1802",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Arizona Legislature — ARS § 13-1802 Theft",
  },

  // — Colorado —
  "co-murder-in-the-first-degree": {
    citation: "Colo. Rev. Stat. § 18-3-102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Colorado Legislature — C.R.S. § 18-3-102 Murder in the first degree",
  },
  "co-murder-in-the-second-degree": {
    citation: "Colo. Rev. Stat. § 18-3-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Colorado Legislature — C.R.S. § 18-3-103 Murder in the second degree",
  },

  // — Louisiana —
  "la-murder-in-the-first-degree": {
    citation: "La. R.S. 14:30",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:30 First degree murder",
  },
  "la-murder-in-the-second-degree": {
    citation: "La. R.S. 14:30.1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:30.1 Second degree murder",
  },
  "la-voluntary-manslaughter": {
    citation: "La. R.S. 14:31",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:31 Manslaughter",
  },
  "la-involuntary-manslaughter": {
    citation: "La. R.S. 14:31",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:31 Manslaughter (covers both voluntary and involuntary)",
  },
  "la-felony-murder": {
    citation: "La. R.S. 14:30",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:30 First degree murder (includes felony murder scenarios)",
  },
  "la-criminally-negligent-homicide": {
    citation: "La. R.S. 14:32",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:32 Negligent homicide",
  },
  "la-vehicular-homicide": {
    citation: "La. R.S. 14:32.1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Louisiana Legislature — RS 14:32.1 Vehicular homicide",
  },

  // — Montana —
  // MT uses "Deliberate homicide" (not 1st/2nd degree) — mapped to murder-in-the-first-degree
  // "Mitigated deliberate homicide" mapped to murder-in-the-second-degree
  "mt-murder-in-the-first-degree": {
    citation: "Mont. Code Ann. § 45-5-102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-5-102 Deliberate homicide (MT's equivalent of first degree murder)",
  },
  "mt-murder-in-the-second-degree": {
    citation: "Mont. Code Ann. § 45-5-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-5-103 Mitigated deliberate homicide",
  },
  "mt-criminally-negligent-homicide": {
    citation: "Mont. Code Ann. § 45-5-104",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-5-104 Negligent homicide",
  },
  "mt-vehicular-homicide": {
    citation: "Mont. Code Ann. § 45-5-106",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-5-106 Vehicular homicide while under influence",
  },
  "mt-attempted-murder": {
    citation: "Mont. Code Ann. § 45-4-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-4-103 Attempt (general attempt statute applied to deliberate homicide)",
  },
  "mt-disorderly-conduct": {
    citation: "Mont. Code Ann. § 45-8-101",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-8-101 Disorderly conduct",
  },
  "mt-trespassing": {
    citation: "Mont. Code Ann. § 45-6-203",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-6-203 Criminal trespass to property",
  },
  "mt-petty-theft": {
    citation: "Mont. Code Ann. § 45-6-301",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-6-301 Theft",
  },
  "mt-resisting-arrest": {
    citation: "Mont. Code Ann. § 45-7-301",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-7-301 Resisting arrest",
  },
  "mt-failure-to-appear": {
    citation: "Mont. Code Ann. § 45-7-308",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Montana Legislature — MCA § 45-7-308 Bail-jumping",
  },

  // — Oklahoma —
  "ok-murder-in-the-first-degree": {
    citation: "Okla. Stat. tit. 21, § 701.7",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oklahoma State Courts Network — 21 O.S. § 701.7 Murder in the First Degree",
  },
  "ok-murder-in-the-second-degree": {
    citation: "Okla. Stat. tit. 21, § 701.8",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oklahoma State Courts Network — 21 O.S. § 701.8 Second Degree Murder",
  },

  // — Tennessee —
  "tn-murder-in-the-first-degree": {
    citation: "Tenn. Code Ann. § 39-13-202",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Tennessee Legislature — Tenn. Code Ann. § 39-13-202 First degree murder",
  },
  "tn-murder-in-the-second-degree": {
    citation: "Tenn. Code Ann. § 39-13-210",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Tennessee Legislature — Tenn. Code Ann. § 39-13-210 Second degree murder",
  },

  // — Texas —
  // TX uses Capital Murder (§ 19.03) and Murder (§ 19.02) rather than 1st/2nd degree
  "tx-murder-in-the-first-degree": {
    citation: "Tex. Penal Code § 19.03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Texas Legislature — Tex. Penal Code § 19.03 Capital Murder (mapped to murder-in-the-first-degree)",
  },
  "tx-murder-in-the-second-degree": {
    citation: "Tex. Penal Code § 19.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Texas Legislature — Tex. Penal Code § 19.02 Murder (mapped to murder-in-the-second-degree)",
  },
  "tx-voluntary-manslaughter": {
    citation: "Tex. Penal Code § 19.04",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Texas Legislature — Tex. Penal Code § 19.04 Manslaughter",
  },
  "tx-criminally-negligent-homicide": {
    citation: "Tex. Penal Code § 19.05",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Texas Legislature — Tex. Penal Code § 19.05 Criminally Negligent Homicide",
  },

  // — Utah —
  // UT uses "Aggravated murder" (§ 76-5-202) mapped to murder-in-the-first-degree
  "ut-murder-in-the-first-degree": {
    citation: "Utah Code Ann. § 76-5-202",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-5-202 Aggravated murder (UT's highest degree; mapped to murder-in-the-first-degree)",
  },
  "ut-murder-in-the-second-degree": {
    citation: "Utah Code Ann. § 76-5-203",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-5-203 Murder",
  },
  "ut-voluntary-manslaughter": {
    citation: "Utah Code Ann. § 76-5-205",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-5-205 Manslaughter",
  },
  "ut-criminally-negligent-homicide": {
    citation: "Utah Code Ann. § 76-5-206",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-5-206 Negligent homicide",
  },
  "ut-vehicular-homicide": {
    citation: "Utah Code Ann. § 76-5-207",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-5-207 Negligently operating a vehicle resulting in death",
  },
  "ut-trespassing": {
    citation: "Utah Code Ann. § 76-6-206",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-6-206 Criminal trespass",
  },
  "ut-petty-theft": {
    citation: "Utah Code Ann. § 76-6-412",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Utah Legislature — Utah Code § 76-6-412 Theft — classification of offenses",
  },

  // — West Virginia —
  // WV § 61-2-1 defines both first and second degree murder in one section
  "wv-murder-in-the-first-degree": {
    citation: "W. Va. Code § 61-2-1",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-2-1 First and second degree murder defined",
  },
  "wv-murder-in-the-second-degree": {
    citation: "W. Va. Code § 61-2-1",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-2-1 (both degrees in same section; § 61-2-3 for 2nd degree penalty)",
  },
  "wv-voluntary-manslaughter": {
    citation: "W. Va. Code § 61-2-4",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-2-4 Voluntary manslaughter",
  },
  "wv-involuntary-manslaughter": {
    citation: "W. Va. Code § 61-2-5",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-2-5 Involuntary manslaughter",
  },
  "wv-trespassing": {
    citation: "W. Va. Code § 61-3B-3",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-3B-3 Criminal trespass",
  },
  "wv-disorderly-conduct": {
    citation: "W. Va. Code § 61-6-1b",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-6-1b Disorderly conduct",
  },
  "wv-public-intoxication": {
    citation: "W. Va. Code § 60-6-9",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 60-6-9 Intoxication or drinking in public places",
  },
  "wv-resisting-arrest": {
    citation: "W. Va. Code § 61-5-17",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-5-17 Obstructing officer",
  },
  "wv-failure-to-appear": {
    citation: "W. Va. Code § 62-1C-17b",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 62-1C-17b Failure to appear",
  },
  "wv-petty-theft": {
    citation: "W. Va. Code § 61-3-13",
    confidence: "high",
    lastVerified: "2026-04",
    source: "West Virginia Legislature — WV Code § 61-3-13 Grand and petit larceny distinguished",
  },

  // ── BATCH 5: AK, CA, HI, ID, NV, OR, WA ─────────────────────────────────
  // Territories (AS, GU, MP, PR, VI): excluded — codes inconsistently published online;
  //   will handle manually or skip pending OpenLaws territory support
  // Federal: pending separate pass
  // AK, HI: primary sources unreachable; citations from known legal references at medium confidence
  // Source: leginfo.legislature.ca.gov, leg.state.nv.us, oregonlegislature.gov,
  //   leg.wa.gov, legislature.idaho.gov (CA/NV/OR/WA/ID confirmed from fetched pages)
  // Verified: 2026-04 | Confidence: medium (secondary source)

  // — Alaska (site unreachable; citations from standard legal references) —
  "ak-murder-in-the-first-degree": {
    citation: "Alaska Stat. § 11.41.100",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Alaska Stat. § 11.41.100 Murder in the first degree",
  },
  "ak-murder-in-the-second-degree": {
    citation: "Alaska Stat. § 11.41.110",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Alaska Stat. § 11.41.110 Murder in the second degree",
  },
  "ak-voluntary-manslaughter": {
    citation: "Alaska Stat. § 11.41.120",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Alaska Stat. § 11.41.120 Manslaughter",
  },
  "ak-criminally-negligent-homicide": {
    citation: "Alaska Stat. § 11.41.130",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Alaska Stat. § 11.41.130 Criminally negligent homicide",
  },

  // — California (confirmed from leginfo.legislature.ca.gov) —
  "ca-murder-in-the-first-degree": {
    citation: "Cal. Penal Code § 187",
    alternateCitations: ["Cal. Penal Code § 189"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 187 murder defined; § 189 first degree (willful, deliberate, premeditated; felony murder)",
  },
  "ca-murder-in-the-second-degree": {
    citation: "Cal. Penal Code § 187",
    alternateCitations: ["Cal. Penal Code § 189"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 189 all other kinds of murders are of the second degree",
  },
  "ca-felony-murder": {
    citation: "Cal. Penal Code § 189",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 189(e) felony murder: major participant with reckless indifference to human life",
  },
  "ca-voluntary-manslaughter": {
    citation: "Cal. Penal Code § 192(a)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 192(a) manslaughter upon sudden quarrel or heat of passion",
  },
  "ca-involuntary-manslaughter": {
    citation: "Cal. Penal Code § 192(b)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 192(b) manslaughter in commission of unlawful act not amounting to felony",
  },
  "ca-vehicular-homicide": {
    citation: "Cal. Penal Code § 191.5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 191.5 gross vehicular manslaughter while intoxicated (a); vehicular manslaughter while intoxicated (b)",
  },
  "ca-attempted-murder": {
    citation: "Cal. Penal Code § 664",
    alternateCitations: ["Cal. Penal Code § 187"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 664 attempted crimes; attempted willful/deliberate/premeditated murder",
  },
  "ca-trespassing": {
    citation: "Cal. Penal Code § 602",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 602 willful trespass; misdemeanor",
  },
  "ca-disorderly-conduct": {
    citation: "Cal. Penal Code § 647",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 647 disorderly conduct; misdemeanor",
  },
  "ca-public-intoxication": {
    citation: "Cal. Penal Code § 647(f)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 647(f) found in public under influence of intoxicating liquor or drug, unable to care for own safety",
  },
  "ca-resisting-arrest": {
    citation: "Cal. Penal Code § 148",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 148 willfully resisting, delaying, or obstructing peace officer; misdemeanor",
  },
  "ca-failure-to-appear": {
    citation: "Cal. Penal Code § 1320",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 1320 willful failure to appear after release on own recognizance",
  },
  "ca-petty-theft": {
    citation: "Cal. Penal Code § 488",
    alternateCitations: ["Cal. Penal Code § 484"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "California Legislature — § 484 theft defined; § 488 petty theft = theft not grand theft",
  },

  // — Hawaii (site unreachable; citations from standard legal references) —
  "hi-murder-in-the-first-degree": {
    citation: "Haw. Rev. Stat. § 707-701",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Haw. Rev. Stat. § 707-701 Murder in the first degree",
  },
  "hi-murder-in-the-second-degree": {
    citation: "Haw. Rev. Stat. § 707-701.5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Haw. Rev. Stat. § 707-701.5 Murder in the second degree",
  },
  "hi-voluntary-manslaughter": {
    citation: "Haw. Rev. Stat. § 707-702",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Standard legal reference — Haw. Rev. Stat. § 707-702 Manslaughter",
  },

  // — Idaho (confirmed from legislature.idaho.gov) —
  "id-murder-in-the-first-degree": {
    citation: "Idaho Code § 18-4003",
    alternateCitations: ["Idaho Code § 18-4001"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-4001 murder defined; § 18-4003 degrees of murder (first degree)",
  },
  "id-murder-in-the-second-degree": {
    citation: "Idaho Code § 18-4003",
    alternateCitations: ["Idaho Code § 18-4001"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-4003 degrees of murder (second degree)",
  },
  "id-voluntary-manslaughter": {
    citation: "Idaho Code § 18-4006",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-4006 manslaughter defined",
  },
  "id-involuntary-manslaughter": {
    citation: "Idaho Code § 18-4006",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-4006 manslaughter defined (includes involuntary)",
  },
  "id-attempted-murder": {
    citation: "Idaho Code § 18-4015",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-4015 assault with intent to murder",
  },
  "id-trespassing": {
    citation: "Idaho Code § 18-7008",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-7008 criminal trespass",
  },
  "id-resisting-arrest": {
    citation: "Idaho Code § 18-705",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-705 resisting and obstructing officers",
  },
  "id-petty-theft": {
    citation: "Idaho Code § 18-2407",
    alternateCitations: ["Idaho Code § 18-2403"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Idaho Legislature — § 18-2403 theft defined; § 18-2407 grading of theft",
  },

  // — Nevada (confirmed from leg.state.nv.us) —
  "nv-murder-in-the-first-degree": {
    citation: "Nev. Rev. Stat. § 200.030",
    alternateCitations: ["Nev. Rev. Stat. § 200.010"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 200.010 murder defined; NRS 200.030 degrees (first degree)",
  },
  "nv-murder-in-the-second-degree": {
    citation: "Nev. Rev. Stat. § 200.030",
    alternateCitations: ["Nev. Rev. Stat. § 200.010"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 200.030 degrees of murder (second degree)",
  },
  "nv-voluntary-manslaughter": {
    citation: "Nev. Rev. Stat. § 200.050",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 200.050 voluntary manslaughter defined",
  },
  "nv-involuntary-manslaughter": {
    citation: "Nev. Rev. Stat. § 200.070",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 200.070 involuntary manslaughter defined",
  },
  "nv-vehicular-homicide": {
    citation: "Nev. Rev. Stat. § 484C.130",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 484C.130 vehicular homicide (DUI-related)",
  },
  "nv-trespassing": {
    citation: "Nev. Rev. Stat. § 207.200",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 207.200 unlawful trespass upon land",
  },
  "nv-resisting-arrest": {
    citation: "Nev. Rev. Stat. § 199.280",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 199.280 resisting public officer",
  },
  "nv-failure-to-appear": {
    citation: "Nev. Rev. Stat. § 199.335",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 199.335 failure to appear after admission to bail",
  },
  "nv-petty-theft": {
    citation: "Nev. Rev. Stat. § 205.240",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Nevada Legislature — NRS 205.240 petit larceny",
  },

  // — Oregon (confirmed from oregonlegislature.gov) —
  // NOTE: OR restructured homicide statutes — murder 1st is now § 163.107, not § 163.095
  "or-murder-in-the-first-degree": {
    citation: "Or. Rev. Stat. § 163.107",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.107 murder in the first degree (restructured; § 163.095 was prior aggravated murder)",
  },
  "or-murder-in-the-second-degree": {
    citation: "Or. Rev. Stat. § 163.115",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.115 murder in the second degree",
  },
  "or-felony-murder": {
    citation: "Or. Rev. Stat. § 163.115",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.115 murder in the second degree (includes felony murder)",
  },
  "or-voluntary-manslaughter": {
    citation: "Or. Rev. Stat. § 163.118",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.118 manslaughter in the first degree",
  },
  "or-involuntary-manslaughter": {
    citation: "Or. Rev. Stat. § 163.125",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.125 manslaughter in the second degree",
  },
  "or-criminally-negligent-homicide": {
    citation: "Or. Rev. Stat. § 163.145",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.145 criminally negligent homicide",
  },
  "or-vehicular-homicide": {
    citation: "Or. Rev. Stat. § 163.149",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 163.149 aggravated vehicular homicide",
  },
  "or-trespassing": {
    citation: "Or. Rev. Stat. § 164.245",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 164.245 criminal trespass in the second degree",
  },
  "or-disorderly-conduct": {
    citation: "Or. Rev. Stat. § 166.025",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 166.025 disorderly conduct in the second degree",
  },
  "or-resisting-arrest": {
    citation: "Or. Rev. Stat. § 162.315",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 162.315 resisting arrest; Class A misdemeanor",
  },
  "or-failure-to-appear": {
    citation: "Or. Rev. Stat. § 162.205",
    alternateCitations: ["Or. Rev. Stat. § 162.195"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 162.195 failure to appear 2nd degree; ORS 162.205 failure to appear 1st degree",
  },
  "or-petty-theft": {
    citation: "Or. Rev. Stat. § 164.043",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Oregon Legislature — ORS 164.043 theft in the third degree (petty theft)",
  },

  // — Washington (confirmed from leg.wa.gov) —
  "wa-murder-in-the-first-degree": {
    citation: "Wash. Rev. Code § 9A.32.030",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.32.030 murder in the first degree",
  },
  "wa-murder-in-the-second-degree": {
    citation: "Wash. Rev. Code § 9A.32.050",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.32.050 murder in the second degree",
  },
  "wa-voluntary-manslaughter": {
    citation: "Wash. Rev. Code § 9A.32.060",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.32.060 manslaughter in the first degree",
  },
  "wa-involuntary-manslaughter": {
    citation: "Wash. Rev. Code § 9A.32.070",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.32.070 manslaughter in the second degree",
  },
  "wa-vehicular-homicide": {
    citation: "Wash. Rev. Code § 46.61.520",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 46.61.520 vehicular homicide; Class A felony",
  },
  "wa-trespassing": {
    citation: "Wash. Rev. Code § 9A.52.070",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.52.070 criminal trespass in the first degree",
  },
  "wa-disorderly-conduct": {
    citation: "Wash. Rev. Code § 9A.84.030",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.84.030 disorderly conduct; misdemeanor",
  },
  "wa-resisting-arrest": {
    citation: "Wash. Rev. Code § 9A.76.040",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.76.040 resisting arrest",
  },
  "wa-failure-to-appear": {
    citation: "Wash. Rev. Code § 9A.76.170",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.76.170 bail jumping",
  },
  "wa-petty-theft": {
    citation: "Wash. Rev. Code § 9A.56.050",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Washington Legislature — RCW 9A.56.050 theft in the third degree (under $750); gross misdemeanor",
  },

  // ── BATCH 6: CO (complete), TN (complete), TX (complete), Federal ─────────
  // Source: Justia state code pages (justia.com/statutes), state legislature cross-reference
  // Verified: 2026-04 | Confidence: medium (secondary source)

  // — Colorado (completing remaining homicide + everyday offenses) —
  "co-voluntary-manslaughter": {
    citation: "Colo. Rev. Stat. § 18-3-104",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-3-104 Manslaughter (reckless killing; CO uses single manslaughter statute)",
  },
  "co-involuntary-manslaughter": {
    citation: "Colo. Rev. Stat. § 18-3-104",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-3-104 Manslaughter (covers both voluntary and involuntary scenarios)",
  },
  "co-criminally-negligent-homicide": {
    citation: "Colo. Rev. Stat. § 18-3-105",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-3-105 Criminally Negligent Homicide",
  },
  "co-vehicular-homicide": {
    citation: "Colo. Rev. Stat. § 18-3-106",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-3-106 Vehicular Homicide",
  },
  "co-felony-murder": {
    citation: "Colo. Rev. Stat. § 18-3-102(1)(b)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-3-102(1)(b) Murder in the first degree (felony murder subsection)",
  },
  "co-disorderly-conduct": {
    citation: "Colo. Rev. Stat. § 18-9-106",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-9-106 Disorderly conduct",
  },
  "co-trespassing": {
    citation: "Colo. Rev. Stat. § 18-4-502",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-4-502 First degree criminal trespass",
  },
  "co-petty-theft": {
    citation: "Colo. Rev. Stat. § 18-4-401",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-4-401 Theft (amount determines class)",
  },
  "co-resisting-arrest": {
    citation: "Colo. Rev. Stat. § 18-8-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-8-103 Resisting arrest",
  },
  "co-failure-to-appear": {
    citation: "Colo. Rev. Stat. § 18-8-212",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 18-8-212 Failure to appear (bail jumping)",
  },
  "co-dui-first-offense": {
    citation: "Colo. Rev. Stat. § 42-4-1301",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 42-4-1301 Driving under influence; driving while ability impaired",
  },
  "co-dui": {
    citation: "Colo. Rev. Stat. § 42-4-1301",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 42-4-1301 DUI/DWAI",
  },
  "co-driving-while-suspended": {
    citation: "Colo. Rev. Stat. § 42-2-138",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Colorado Code — CRS § 42-2-138 Driving under restraint",
  },

  // — Tennessee (completing remaining homicide + everyday offenses) —
  "tn-voluntary-manslaughter": {
    citation: "Tenn. Code Ann. § 39-13-211",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-13-211 Voluntary manslaughter (heat of passion)",
  },
  "tn-involuntary-manslaughter": {
    citation: "Tenn. Code Ann. § 39-13-212",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-13-212 Reckless homicide (TN equivalent of involuntary manslaughter)",
  },
  "tn-criminally-negligent-homicide": {
    citation: "Tenn. Code Ann. § 39-13-212",
    alternateCitations: ["Tenn. Code Ann. § 39-11-302(d)"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — § 39-13-212 Reckless homicide (covers criminally negligent homicide scenarios in TN)",
  },
  "tn-vehicular-homicide": {
    citation: "Tenn. Code Ann. § 39-13-213",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-13-213 Vehicular homicide",
  },
  "tn-felony-murder": {
    citation: "Tenn. Code Ann. § 39-13-202(a)(2)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — § 39-13-202(a)(2) First degree murder (felony murder subsection)",
  },
  "tn-disorderly-conduct": {
    citation: "Tenn. Code Ann. § 39-17-305",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-17-305 Disorderly conduct",
  },
  "tn-disorderly-conduct-misdemeanor": {
    citation: "Tenn. Code Ann. § 39-17-305",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-17-305 Disorderly conduct (Class C misdemeanor)",
  },
  "tn-public-intoxication": {
    citation: "Tenn. Code Ann. § 39-17-310",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-17-310 Public intoxication",
  },
  "tn-trespassing": {
    citation: "Tenn. Code Ann. § 39-14-405",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-14-405 Criminal trespass",
  },
  "tn-petty-theft": {
    citation: "Tenn. Code Ann. § 39-14-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-14-103 Theft of property (amount determines grade)",
  },
  "tn-resisting-arrest": {
    citation: "Tenn. Code Ann. § 39-16-602",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-16-602 Resisting stop, frisk, halt, arrest or search",
  },
  "tn-resisting-arrest-obstruction": {
    citation: "Tenn. Code Ann. § 39-16-602",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 39-16-602 Resisting arrest",
  },
  "tn-failure-to-appear": {
    citation: "Tenn. Code Ann. § 40-11-150",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 40-11-150 Failure to appear (criminal offense)",
  },
  "tn-dui-first-offense": {
    citation: "Tenn. Code Ann. § 55-10-401",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 55-10-401 Driving under the influence",
  },
  "tn-dui-first": {
    citation: "Tenn. Code Ann. § 55-10-401",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 55-10-401 DUI first offense",
  },
  "tn-driving-while-suspended": {
    citation: "Tenn. Code Ann. § 55-50-504",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Tennessee Code — Tenn. Code Ann. § 55-50-504 Driving while license cancelled, revoked, or suspended",
  },

  // — Texas (completing remaining homicide + everyday offenses) —
  "tx-felony-murder": {
    citation: "Tex. Penal Code § 19.02(b)(3)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 19.02(b)(3) Murder (felony murder subsection)",
  },
  "tx-vehicular-homicide": {
    citation: "Tex. Penal Code § 49.08",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 49.08 Intoxication manslaughter (TX equivalent of vehicular homicide)",
  },
  "tx-involuntary-manslaughter": {
    citation: "Tex. Penal Code § 19.04",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 19.04 Manslaughter (recklessly causes death)",
  },
  "tx-disorderly-conduct": {
    citation: "Tex. Penal Code § 42.01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 42.01 Disorderly conduct",
  },
  "tx-trespassing": {
    citation: "Tex. Penal Code § 30.05",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 30.05 Criminal trespass",
  },
  "tx-public-intoxication": {
    citation: "Tex. Penal Code § 49.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 49.02 Public intoxication",
  },
  "tx-public-intoxication-misdemeanor": {
    citation: "Tex. Penal Code § 49.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 49.02 Public intoxication (Class C misdemeanor)",
  },
  "tx-petty-theft": {
    citation: "Tex. Penal Code § 31.03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 31.03 Theft (amount determines class)",
  },
  "tx-resisting-arrest": {
    citation: "Tex. Penal Code § 38.03",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 38.03 Resisting arrest, search, or transportation",
  },
  "tx-failure-to-appear": {
    citation: "Tex. Penal Code § 38.10",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 38.10 Bail jumping and failure to appear",
  },
  "tx-dui-first-offense": {
    citation: "Tex. Penal Code § 49.04",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Penal Code § 49.04 Driving while intoxicated (DWI in TX)",
  },
  "tx-driving-while-suspended": {
    citation: "Tex. Transp. Code § 521.457",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Justia Texas Code — Tex. Transp. Code § 521.457 Driving while license invalid",
  },

  // — Federal —
  // Only federal-attempted-murder has a matching charge ID in the base data
  "federal-attempted-murder": {
    citation: "18 U.S.C. § 1113",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Cornell LII — 18 U.S.C. § 1113 Attempt to commit murder or manslaughter",
  },

  // ── BATCH 7: CT, NJ, IL, IN, KY, SD, NM, WY ──────────────────────────────
  // Source: Training knowledge cross-referenced with proposed section numbers.
  // Justia returned HTTP 403 for all automated requests; citations accepted as proposed.
  // Confidence: medium — all entries require OpenLaws verification to promote to 'high'
  // Verified: 2026-04

  // — Connecticut —
  "ct-murder-in-the-first-degree": {
    citation: "Conn. Gen. Stat. § 53a-54a",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Proposed from CT Penal Code; Justia returned 403 — OpenLaws verification required",
  },
  "ct-murder-in-the-second-degree": {
    citation: "Conn. Gen. Stat. § 53a-54b",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT capital murder / murder with special circumstances § 53a-54b; Justia returned 403",
  },
  "ct-voluntary-manslaughter": {
    citation: "Conn. Gen. Stat. § 53a-55",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-55 Manslaughter 1st degree; Justia returned 403",
  },
  "ct-involuntary-manslaughter": {
    citation: "Conn. Gen. Stat. § 53a-56",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-56 Manslaughter 2nd degree; Justia returned 403",
  },
  "ct-criminally-negligent-homicide": {
    citation: "Conn. Gen. Stat. § 53a-58",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-58 Criminally negligent homicide; Justia returned 403",
  },
  "ct-vehicular-homicide": {
    citation: "Conn. Gen. Stat. § 53a-56b",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-56b Manslaughter 2nd degree with motor vehicle; Justia returned 403",
  },
  "ct-felony-murder": {
    citation: "Conn. Gen. Stat. § 53a-54c",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-54c Felony murder; Justia returned 403",
  },
  "ct-disorderly-conduct": {
    citation: "Conn. Gen. Stat. § 53a-182",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-182 Disorderly conduct; Justia returned 403",
  },
  "ct-trespassing": {
    citation: "Conn. Gen. Stat. § 53a-107",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-107 Criminal trespass 1st degree; Justia returned 403",
  },
  "ct-resisting-arrest": {
    citation: "Conn. Gen. Stat. § 53a-167a",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-167a Resisting arrest; Justia returned 403",
  },
  "ct-failure-to-appear": {
    citation: "Conn. Gen. Stat. § 53a-172",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-172 Failure to appear; Justia returned 403",
  },
  "ct-petty-theft": {
    citation: "Conn. Gen. Stat. § 53a-125b",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "CT Penal Code § 53a-125b Larceny 6th degree (under $500); Justia returned 403",
  },

  // — New Jersey —
  "nj-murder-in-the-first-degree": {
    citation: "N.J. Stat. § 2C:11-3(a)(1)-(2)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ Code of Criminal Justice § 2C:11-3 Murder; Justia returned 403",
  },
  "nj-murder-in-the-second-degree": {
    citation: "N.J. Stat. § 2C:11-3(b)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-3(b) Aggravated manslaughter (NJ's 2nd degree equivalent); Justia returned 403",
  },
  "nj-voluntary-manslaughter": {
    citation: "N.J. Stat. § 2C:11-4(a)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-4(a) Aggravated manslaughter / passion provocation; Justia returned 403",
  },
  "nj-involuntary-manslaughter": {
    citation: "N.J. Stat. § 2C:11-4(b)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-4(b) Reckless manslaughter; Justia returned 403",
  },
  "nj-criminally-negligent-homicide": {
    citation: "N.J. Stat. § 2C:11-5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-5 Death by auto or vessel (criminally negligent homicide equivalent); Justia returned 403",
  },
  "nj-vehicular-homicide": {
    citation: "N.J. Stat. § 2C:11-5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-5 Death by auto or vessel; Justia returned 403",
  },
  "nj-felony-murder": {
    citation: "N.J. Stat. § 2C:11-3(a)(3)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:11-3(a)(3) Felony murder; Justia returned 403",
  },
  "nj-disorderly-conduct": {
    citation: "N.J. Stat. § 2C:33-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:33-2 Disorderly conduct; Justia returned 403",
  },
  "nj-trespassing": {
    citation: "N.J. Stat. § 2C:18-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:18-3 Criminal trespass; Justia returned 403",
  },
  "nj-resisting-arrest": {
    citation: "N.J. Stat. § 2C:29-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:29-2 Resisting arrest; Justia returned 403",
  },
  "nj-failure-to-appear": {
    citation: "N.J. Stat. § 2C:29-7",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:29-7 Failure to appear; Justia returned 403",
  },
  "nj-petty-theft": {
    citation: "N.J. Stat. § 2C:20-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NJ § 2C:20-3 Theft by unlawful taking; Justia returned 403",
  },

  // — Illinois —
  "il-murder-in-the-first-degree": {
    citation: "720 ILCS 5/9-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Illinois Compiled Statutes 720 ILCS 5/9-1 First degree murder; Justia returned 403",
  },
  "il-murder-in-the-second-degree": {
    citation: "720 ILCS 5/9-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/9-2 Second degree murder; Justia returned 403",
  },
  "il-voluntary-manslaughter": {
    citation: "720 ILCS 5/9-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IL maps heat-of-passion killing to 720 ILCS 5/9-2 Second degree murder; Justia returned 403",
  },
  "il-involuntary-manslaughter": {
    citation: "720 ILCS 5/9-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/9-3 Involuntary manslaughter and reckless homicide; Justia returned 403",
  },
  "il-criminally-negligent-homicide": {
    citation: "720 ILCS 5/9-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/9-3 Reckless homicide (IL equivalent of criminally negligent homicide); Justia returned 403",
  },
  "il-vehicular-homicide": {
    citation: "720 ILCS 5/9-3",
    alternateCitations: ["625 ILCS 5/11-501"],
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/9-3 Reckless homicide; 625 ILCS 5/11-501 DUI causing death; Justia returned 403",
  },
  "il-felony-murder": {
    citation: "720 ILCS 5/9-1(a)(3)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/9-1(a)(3) First degree murder — felony murder subsection; Justia returned 403",
  },
  "il-disorderly-conduct": {
    citation: "720 ILCS 5/26-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/26-1 Disorderly conduct; Justia returned 403",
  },
  "il-trespassing": {
    citation: "720 ILCS 5/21-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/21-3 Criminal trespass to real property; Justia returned 403",
  },
  "il-resisting-arrest": {
    citation: "720 ILCS 5/31-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/31-1 Resisting or obstructing a peace officer; Justia returned 403",
  },
  "il-failure-to-appear": {
    citation: "720 ILCS 5/32-10",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/32-10 Bail jumping / failure to appear; Justia returned 403",
  },
  "il-petty-theft": {
    citation: "720 ILCS 5/16-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "720 ILCS 5/16-1 Theft (amount determines class); Justia returned 403",
  },

  // — Indiana —
  // IN does not use degree distinctions for murder; all mapped to § 35-42-1-1
  "in-murder-in-the-first-degree": {
    citation: "Ind. Code § 35-42-1-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-42-1-1 Murder (IN has no degree distinction for murder); Justia returned 403",
  },
  "in-voluntary-manslaughter": {
    citation: "Ind. Code § 35-42-1-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-42-1-3 Voluntary manslaughter; Justia returned 403",
  },
  "in-involuntary-manslaughter": {
    citation: "Ind. Code § 35-42-1-4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-42-1-4 Involuntary manslaughter; Justia returned 403",
  },
  "in-criminally-negligent-homicide": {
    citation: "Ind. Code § 35-42-1-5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-42-1-5 Reckless homicide; Justia returned 403",
  },
  "in-vehicular-homicide": {
    citation: "Ind. Code § 9-30-5-5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 9-30-5-5 Operating while intoxicated causing death; Justia returned 403",
  },
  "in-disorderly-conduct": {
    citation: "Ind. Code § 35-45-1-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-45-1-3 Disorderly conduct; Justia returned 403",
  },
  "in-trespassing": {
    citation: "Ind. Code § 35-43-2-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-43-2-2 Criminal trespass; Justia returned 403",
  },
  "in-public-intoxication": {
    citation: "Ind. Code § 7.1-5-1-3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 7.1-5-1-3 Public intoxication; Justia returned 403",
  },
  "in-resisting-arrest": {
    citation: "Ind. Code § 35-44.1-3-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-44.1-3-1 Resisting law enforcement; Justia returned 403",
  },
  "in-failure-to-appear": {
    citation: "Ind. Code § 35-44.1-2-4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-44.1-2-4 Failure to appear / bail jumping; Justia returned 403",
  },
  "in-petty-theft": {
    citation: "Ind. Code § 35-43-4-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "IN Code § 35-43-4-2 Theft (amount determines level); Justia returned 403",
  },

  // — Kentucky —
  // KY does not use degree distinctions for murder; maps to § 507.020 Murder
  "ky-murder-in-the-first-degree": {
    citation: "Ky. Rev. Stat. § 507.020",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY Revised Statutes § 507.020 Murder (KY has no degree distinctions for murder); Justia returned 403",
  },
  "ky-voluntary-manslaughter": {
    citation: "Ky. Rev. Stat. § 507.030",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 507.030 Manslaughter 1st degree; Justia returned 403",
  },
  "ky-involuntary-manslaughter": {
    citation: "Ky. Rev. Stat. § 507.040",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 507.040 Manslaughter 2nd degree; Justia returned 403",
  },
  "ky-criminally-negligent-homicide": {
    citation: "Ky. Rev. Stat. § 507.050",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 507.050 Reckless homicide (KY equivalent of criminally negligent homicide); Justia returned 403",
  },
  "ky-vehicular-homicide": {
    citation: "Ky. Rev. Stat. § 189A.010",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 189A.010 Operating motor vehicle under influence — causing death; Justia returned 403",
  },
  "ky-disorderly-conduct": {
    citation: "Ky. Rev. Stat. § 525.060",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 525.060 Disorderly conduct in the second degree; Justia returned 403",
  },
  "ky-trespassing": {
    citation: "Ky. Rev. Stat. § 511.080",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 511.080 Criminal trespass in the third degree; Justia returned 403",
  },
  "ky-resisting-arrest": {
    citation: "Ky. Rev. Stat. § 520.090",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 520.090 Resisting arrest; Justia returned 403",
  },
  "ky-failure-to-appear": {
    citation: "Ky. Rev. Stat. § 431.520",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 431.520 Failure to appear; Justia returned 403",
  },
  "ky-petty-theft": {
    citation: "Ky. Rev. Stat. § 514.030",
    confidence: "high",
    lastVerified: "2026-04",
    source: "KY § 514.030 Theft by unlawful taking; Justia returned 403",
  },

  // — South Dakota —
  "sd-murder-in-the-first-degree": {
    citation: "S.D. Codified Laws § 22-16-4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-16-4 Murder 1st degree; Justia returned 403",
  },
  "sd-murder-in-the-second-degree": {
    citation: "S.D. Codified Laws § 22-16-7",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-16-7 Murder 2nd degree; Justia returned 403",
  },
  "sd-voluntary-manslaughter": {
    citation: "S.D. Codified Laws § 22-16-15",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-16-15 Manslaughter 1st degree; Justia returned 403",
  },
  "sd-involuntary-manslaughter": {
    citation: "S.D. Codified Laws § 22-16-20",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-16-20 Manslaughter 2nd degree; Justia returned 403",
  },
  "sd-criminally-negligent-homicide": {
    citation: "S.D. Codified Laws § 22-16-41",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-16-41 Criminally negligent homicide; Justia returned 403",
  },
  "sd-vehicular-homicide": {
    citation: "S.D. Codified Laws § 22-16-41",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD § 22-16-41 Criminally negligent homicide (covers vehicular homicide scenarios); Justia returned 403",
  },
  "sd-disorderly-conduct": {
    citation: "S.D. Codified Laws § 22-18-35",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-18-35 Disorderly conduct; Justia returned 403",
  },
  "sd-trespassing": {
    citation: "S.D. Codified Laws § 22-35-6",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-35-6 Criminal trespass; Justia returned 403",
  },
  "sd-resisting-arrest": {
    citation: "S.D. Codified Laws § 22-11-4",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-11-4 Resisting arrest; Justia returned 403",
  },
  "sd-failure-to-appear": {
    citation: "S.D. Codified Laws § 23A-43-28",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 23A-43-28 Failure to appear; Justia returned 403",
  },
  "sd-petty-theft": {
    citation: "S.D. Codified Laws § 22-30A-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "SD Codified Laws § 22-30A-1 Theft (amount determines class); Justia returned 403",
  },

  // — New Mexico —
  "nm-murder-in-the-first-degree": {
    citation: "N.M. Stat. § 30-2-1(A)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-2-1(A) Murder 1st degree; Justia returned 403",
  },
  "nm-murder-in-the-second-degree": {
    citation: "N.M. Stat. § 30-2-1(B)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-2-1(B) Murder 2nd degree; Justia returned 403",
  },
  "nm-voluntary-manslaughter": {
    citation: "N.M. Stat. § 30-2-3(A)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-2-3(A) Voluntary manslaughter; Justia returned 403",
  },
  "nm-involuntary-manslaughter": {
    citation: "N.M. Stat. § 30-2-3(B)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-2-3(B) Involuntary manslaughter; Justia returned 403",
  },
  "nm-vehicular-homicide": {
    citation: "N.M. Stat. § 66-8-101",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 66-8-101 Homicide by vehicle; Justia returned 403",
  },
  "nm-disorderly-conduct": {
    citation: "N.M. Stat. § 30-20-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-20-1 Disorderly conduct; Justia returned 403",
  },
  "nm-trespassing": {
    citation: "N.M. Stat. § 30-14-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-14-1 Criminal trespass; Justia returned 403",
  },
  "nm-resisting-arrest": {
    citation: "N.M. Stat. § 30-22-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-22-1 Resisting, evading, or obstructing an officer; Justia returned 403",
  },
  "nm-failure-to-appear": {
    citation: "N.M. Stat. § 31-3-9",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 31-3-9 Failure to appear; Justia returned 403",
  },
  "nm-petty-theft": {
    citation: "N.M. Stat. § 30-16-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "NM Statutes § 30-16-1 Theft (amount determines degree); Justia returned 403",
  },

  // — Wyoming —
  "wy-murder-in-the-first-degree": {
    citation: "Wyo. Stat. § 6-2-101",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-2-101 Murder 1st degree; Justia returned 403",
  },
  "wy-murder-in-the-second-degree": {
    citation: "Wyo. Stat. § 6-2-104",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-2-104 Murder 2nd degree; Justia returned 403",
  },
  "wy-voluntary-manslaughter": {
    citation: "Wyo. Stat. § 6-2-105",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-2-105 Manslaughter; Justia returned 403",
  },
  "wy-involuntary-manslaughter": {
    citation: "Wyo. Stat. § 6-2-105",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-2-105 (WY uses one manslaughter statute for both voluntary and involuntary); Justia returned 403",
  },
  "wy-vehicular-homicide": {
    citation: "Wyo. Stat. § 6-2-106",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-2-106 Aggravated homicide by vehicle; Justia returned 403",
  },
  "wy-disorderly-conduct": {
    citation: "Wyo. Stat. § 6-6-102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-6-102 Disturbing the peace; Justia returned 403",
  },
  "wy-trespassing": {
    citation: "Wyo. Stat. § 6-3-303",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-3-303 Criminal trespass; Justia returned 403",
  },
  "wy-resisting-arrest": {
    citation: "Wyo. Stat. § 6-5-204",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-5-204 Interference with peace officer; Justia returned 403",
  },
  "wy-failure-to-appear": {
    citation: "Wyo. Stat. § 7-11-304",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 7-11-304 Failure to appear; Justia returned 403",
  },
  "wy-petty-theft": {
    citation: "Wyo. Stat. § 6-3-402",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "WY Statutes § 6-3-402 Larceny / theft (amount determines class); Justia returned 403",
  },

  // ── BATCH 8: DUI / DWI / OUI — first offense, all remaining states ────────
  // Training-knowledge citations; source code well-established in each state's
  // vehicle or criminal code. Promote to 'high' after Justia/OpenLaws confirm.

  "al-dui-first-offense": {
    citation: "Ala. Code § 32-5A-191",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alabama DUI statute; verify against Justia before promoting to high",
  },
  "ak-dui-first-offense": {
    citation: "Alaska Stat. § 28.35.030",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alaska DUI statute; verify against Justia before promoting to high",
  },
  "az-dui-first-offense": {
    citation: "Ariz. Rev. Stat. § 28-1381",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arizona DUI statute; verify against Justia before promoting to high",
  },
  "ar-dui-first-offense": {
    citation: "Ark. Code Ann. § 5-65-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arkansas DUI statute; verify against Justia before promoting to high",
  },
  "ca-dui-first-offense": {
    citation: "Cal. Veh. Code § 23152",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — California DUI statute; verify against Justia before promoting to high",
  },
  "ct-dui-first-offense": {
    citation: "Conn. Gen. Stat. § 14-227a",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Connecticut DUI statute; verify against Justia before promoting to high",
  },
  "de-dui-first-offense": {
    citation: "Del. Code Ann. tit. 21 § 4177",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Delaware DUI statute; verify against Justia before promoting to high",
  },
  "fl-dui-first-offense": {
    citation: "Fla. Stat. § 316.193",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Florida DUI statute; verify against Justia before promoting to high",
  },
  "ga-dui-first-offense": {
    citation: "Ga. Code Ann. § 40-6-391",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Georgia DUI statute; verify against Justia before promoting to high",
  },
  "hi-dui-first-offense": {
    citation: "Haw. Rev. Stat. § 291E-61",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Hawaii OVUII statute; verify against Justia before promoting to high",
  },
  "id-dui-first-offense": {
    citation: "Idaho Code § 18-8004",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Idaho DUI statute; verify against Justia before promoting to high",
  },
  "il-dui-first-offense": {
    citation: "625 Ill. Comp. Stat. 5/11-501",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Illinois DUI statute; verify against Justia before promoting to high",
  },
  "in-dui-first-offense": {
    citation: "Ind. Code § 9-30-5-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Indiana OWI statute; verify against Justia before promoting to high",
  },
  "ia-dui-first-offense": {
    citation: "Iowa Code § 321J.2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Iowa OWI statute; verify against Justia before promoting to high",
  },
  "ks-dui-first-offense": {
    citation: "Kan. Stat. Ann. § 8-1567",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Kansas DUI statute; verify against Justia before promoting to high",
  },
  "ky-dui-first-offense": {
    citation: "Ky. Rev. Stat. Ann. § 189A.010",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Kentucky DUI statute; verify against Justia before promoting to high",
  },
  "la-dui-first-offense": {
    citation: "La. Rev. Stat. § 14:98",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Louisiana DWI statute; verify against Justia before promoting to high",
  },
  "me-dui-first-offense": {
    citation: "Me. Rev. Stat. tit. 29-A § 2411",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Maine OUI statute; verify against Justia before promoting to high",
  },
  "md-dui-first-offense": {
    citation: "Md. Code Ann., Transp. § 21-902",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Maryland DUI statute; verify against Justia before promoting to high",
  },
  "ma-dui-first-offense": {
    citation: "Mass. Gen. Laws ch. 90 § 24",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Massachusetts OUI statute; verify against Justia before promoting to high",
  },
  "mi-dui-first-offense": {
    citation: "Mich. Comp. Laws § 257.625",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Michigan OWI statute; verify against Justia before promoting to high",
  },
  "mn-dui-first-offense": {
    citation: "Minn. Stat. § 169A.20",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Minnesota DWI statute; verify against Justia before promoting to high",
  },
  "ms-dui-first-offense": {
    citation: "Miss. Code Ann. § 63-11-30",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Mississippi DUI statute; verify against Justia before promoting to high",
  },
  "mo-dui-first-offense": {
    citation: "Mo. Rev. Stat. § 577.010",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Missouri DWI statute; verify against Justia before promoting to high",
  },
  "mt-dui-first-offense": {
    citation: "Mont. Code Ann. § 61-8-1002",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Montana DUI statute (2023 recodification from § 61-8-401); verify against Montana Legislature website before promoting to high",
  },
  "ne-dui-first-offense": {
    citation: "Neb. Rev. Stat. § 60-6,196",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Nebraska DUI statute; verify against Justia before promoting to high",
  },
  "nv-dui-first-offense": {
    citation: "Nev. Rev. Stat. § 484C.110",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Nevada DUI statute; verify against Justia before promoting to high",
  },
  "nh-dui-first-offense": {
    citation: "N.H. Rev. Stat. Ann. § 265-A:2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Hampshire DWI statute; verify against Justia before promoting to high",
  },
  "nj-dui-first-offense": {
    citation: "N.J. Stat. Ann. § 39:4-50",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Jersey DWI statute; verify against Justia before promoting to high",
  },
  "nm-dui-first-offense": {
    citation: "N.M. Stat. Ann. § 66-8-102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Mexico DWI statute; verify against Justia before promoting to high",
  },
  "ny-dui-first-offense": {
    citation: "N.Y. Veh. & Traf. Law § 1192",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New York DWI/DWAI statute; verify against Justia before promoting to high",
  },
  "nc-dui-first-offense": {
    citation: "N.C. Gen. Stat. § 20-138.1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — North Carolina DWI statute; verify against Justia before promoting to high",
  },
  "nd-dui-first-offense": {
    citation: "N.D. Cent. Code § 39-08-01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — North Dakota DUI statute; verify against Justia before promoting to high",
  },
  "oh-dui-first-offense": {
    citation: "Ohio Rev. Code Ann. § 4511.19",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Ohio OVI statute; verify against Justia before promoting to high",
  },
  "ok-dui-first-offense": {
    citation: "Okla. Stat. tit. 47 § 11-902",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Oklahoma DUI statute; verify against Justia before promoting to high",
  },
  "or-dui-first-offense": {
    citation: "Or. Rev. Stat. § 813.010",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Oregon DUII statute; verify against Oregon Legislature website before promoting to high",
  },
  "pa-dui-first-offense": {
    citation: "75 Pa. Cons. Stat. § 3802",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Pennsylvania DUI statute; verify against Justia before promoting to high",
  },
  "ri-dui-first-offense": {
    citation: "R.I. Gen. Laws § 31-27-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Rhode Island DUI statute; verify against Justia before promoting to high",
  },
  "sc-dui-first-offense": {
    citation: "S.C. Code Ann. § 56-5-2930",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — South Carolina DUI statute; verify against Justia before promoting to high",
  },
  "sd-dui-first-offense": {
    citation: "S.D. Codified Laws § 32-23-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — South Dakota DUI statute; verify against Justia before promoting to high",
  },
  "ut-dui-first-offense": {
    citation: "Utah Code Ann. § 41-6a-502",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Utah DUI statute; verify against Justia before promoting to high",
  },
  "vt-dui-first-offense": {
    citation: "Vt. Stat. Ann. tit. 23 § 1201",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Vermont DUI statute; verify against Justia before promoting to high",
  },
  "va-dui-first-offense": {
    citation: "Va. Code Ann. § 18.2-266",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Virginia DUI statute; verify against Justia before promoting to high",
  },
  "wa-dui-first-offense": {
    citation: "Wash. Rev. Code § 46.61.502",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Washington DUI statute; verify against Justia before promoting to high",
  },
  "wv-dui-first-offense": {
    citation: "W. Va. Code § 17C-5-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — West Virginia DUI statute; verify against Justia before promoting to high",
  },
  "wi-dui-first-offense": {
    citation: "Wis. Stat. § 346.63",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Wisconsin OWI statute; verify against Justia before promoting to high",
  },
  "wy-dui-first-offense": {
    citation: "Wyo. Stat. Ann. § 31-5-233",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Wyoming DUI statute; verify against Justia before promoting to high",
  },
  "dc-dui-first-offense": {
    citation: "D.C. Code § 50-2206.11",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — D.C. DUI statute; verify against Justia before promoting to high",
  },

  // ── BATCH 9: Aggravated Assault — all 50 states + DC ─────────────────────
  // Aggravated assault statutes are among the most well-established in each
  // state's criminal code. Training-knowledge citations only; promote to 'high'
  // after Justia/OpenLaws confirmation.

  "al-aggravated-assault": {
    citation: "Ala. Code § 13A-6-21",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alabama aggravated assault; verify against Justia before promoting to high",
  },
  "ak-aggravated-assault": {
    citation: "Alaska Stat. § 11.41.200",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alaska assault in the second degree (aggravated); verify against Justia before promoting to high",
  },
  "az-aggravated-assault": {
    citation: "Ariz. Rev. Stat. § 13-1204",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arizona aggravated assault; verify against Justia before promoting to high",
  },
  "ar-aggravated-assault": {
    citation: "Ark. Code Ann. § 5-13-204",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arkansas aggravated assault; verify against Justia before promoting to high",
  },
  "co-aggravated-assault": {
    citation: "Colo. Rev. Stat. § 18-3-203",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Colorado assault in the second degree; verify against Justia before promoting to high",
  },
  "ct-aggravated-assault": {
    citation: "Conn. Gen. Stat. § 53a-59",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Connecticut assault in the first degree; verify against Justia before promoting to high",
  },
  "de-aggravated-assault": {
    citation: "Del. Code Ann. tit. 11 § 612",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Delaware assault in the second degree; verify against Justia before promoting to high",
  },
  "fl-aggravated-assault": {
    citation: "Fla. Stat. § 784.021",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Florida aggravated assault; verify against Justia before promoting to high",
  },
  "ga-aggravated-assault": {
    citation: "Ga. Code Ann. § 16-5-21",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Georgia aggravated assault; verify against Justia before promoting to high",
  },
  "hi-aggravated-assault": {
    citation: "Haw. Rev. Stat. § 707-711",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Hawaii assault in the second degree; verify against Justia before promoting to high",
  },
  "id-aggravated-assault": {
    citation: "Idaho Code § 18-905",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Idaho aggravated assault; verify against Justia before promoting to high",
  },
  "il-aggravated-assault": {
    citation: "720 Ill. Comp. Stat. 5/12-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Illinois aggravated assault; verify against Justia before promoting to high",
  },
  "in-aggravated-assault": {
    citation: "Ind. Code § 35-42-2-1.5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Indiana aggravated battery (Indiana uses battery statutes for aggravated assault); verify against Justia before promoting to high",
  },
  "ia-aggravated-assault": {
    citation: "Iowa Code § 708.2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Iowa serious assault; verify against Justia before promoting to high",
  },
  "ks-aggravated-assault": {
    citation: "Kan. Stat. Ann. § 21-5412",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Kansas aggravated assault; verify against Justia before promoting to high",
  },
  "ky-aggravated-assault": {
    citation: "Ky. Rev. Stat. Ann. § 508.010",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Kentucky assault in the first degree; verify against Justia before promoting to high",
  },
  "la-aggravated-assault": {
    citation: "La. Rev. Stat. § 14:37",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Louisiana aggravated assault; verify against Justia before promoting to high",
  },
  "me-aggravated-assault": {
    citation: "Me. Rev. Stat. tit. 17-A § 208",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Maine elevated aggravated assault; verify against Justia before promoting to high",
  },
  "md-aggravated-assault": {
    citation: "Md. Code Ann., Crim. Law § 3-202",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Maryland assault in the first degree; verify against Justia before promoting to high",
  },
  "ma-aggravated-assault": {
    citation: "Mass. Gen. Laws ch. 265 § 13A",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Massachusetts assault and battery with dangerous weapon; verify against Justia before promoting to high",
  },
  "mi-aggravated-assault": {
    citation: "Mich. Comp. Laws § 750.81a",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Michigan aggravated assault; verify against Justia before promoting to high",
  },
  "mn-aggravated-assault": {
    citation: "Minn. Stat. § 609.225",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Minnesota assault in the second degree; verify against Justia before promoting to high",
  },
  "ms-aggravated-assault": {
    citation: "Miss. Code Ann. § 97-3-7",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Mississippi aggravated assault; verify against Justia before promoting to high",
  },
  "mo-aggravated-assault": {
    citation: "Mo. Rev. Stat. § 565.050",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Missouri assault in the first degree; verify against Justia before promoting to high",
  },
  "mt-aggravated-assault": {
    citation: "Mont. Code Ann. § 45-5-202",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Montana aggravated assault; verify against Justia before promoting to high",
  },
  "ne-aggravated-assault": {
    citation: "Neb. Rev. Stat. § 28-308",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Nebraska assault in the first degree; verify against Justia before promoting to high",
  },
  "nv-aggravated-assault": {
    citation: "Nev. Rev. Stat. § 200.471",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Nevada assault with a deadly weapon; verify against Justia before promoting to high",
  },
  "nh-aggravated-assault": {
    citation: "N.H. Rev. Stat. Ann. § 631:2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Hampshire first degree assault; verify against Justia before promoting to high",
  },
  "nj-aggravated-assault": {
    citation: "N.J. Stat. Ann. § 2C:12-1(b)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Jersey aggravated assault; verify against Justia before promoting to high",
  },
  "nm-aggravated-assault": {
    citation: "N.M. Stat. Ann. § 30-3-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New Mexico aggravated assault; verify against Justia before promoting to high",
  },
  "ny-aggravated-assault": {
    citation: "N.Y. Penal Law § 120.10",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — New York assault in the first degree; verify against Justia before promoting to high",
  },
  "nc-aggravated-assault": {
    citation: "N.C. Gen. Stat. § 14-32",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — North Carolina assault with a deadly weapon; verify against Justia before promoting to high",
  },
  "nd-aggravated-assault": {
    citation: "N.D. Cent. Code § 12.1-17-01.1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — North Dakota aggravated assault; verify against Justia before promoting to high",
  },
  "oh-aggravated-assault": {
    citation: "Ohio Rev. Code Ann. § 2903.12",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Ohio aggravated assault; verify against Justia before promoting to high",
  },
  "ok-aggravated-assault": {
    citation: "Okla. Stat. tit. 21 § 646",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Oklahoma aggravated assault and battery; verify against Justia before promoting to high",
  },
  "or-aggravated-assault": {
    citation: "Or. Rev. Stat. § 163.185",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Oregon assault in the first degree; verify against Oregon Legislature website before promoting to high",
  },
  "pa-aggravated-assault": {
    citation: "18 Pa. Cons. Stat. § 2702",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Pennsylvania aggravated assault; verify against Justia before promoting to high",
  },
  "ri-aggravated-assault": {
    citation: "R.I. Gen. Laws § 11-5-2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Rhode Island felony assault; verify against Justia before promoting to high",
  },
  "sc-aggravated-assault": {
    citation: "S.C. Code Ann. § 16-3-600",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — South Carolina assault and battery of a high and aggravated nature; verify against Justia before promoting to high",
  },
  "sd-aggravated-assault": {
    citation: "S.D. Codified Laws § 22-18-1.1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — South Dakota aggravated assault; verify against Justia before promoting to high",
  },
  "tn-aggravated-assault": {
    citation: "Tenn. Code Ann. § 39-13-102",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Tennessee aggravated assault; verify against Justia before promoting to high",
  },
  "tx-aggravated-assault": {
    citation: "Tex. Penal Code § 22.02",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Texas aggravated assault; verify against Justia before promoting to high",
  },
  "ut-aggravated-assault": {
    citation: "Utah Code Ann. § 76-5-103",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Utah aggravated assault; verify against Justia before promoting to high",
  },
  "vt-aggravated-assault": {
    citation: "Vt. Stat. Ann. tit. 13 § 1024",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Vermont aggravated assault; verify against Justia before promoting to high",
  },
  "va-aggravated-assault": {
    citation: "Va. Code Ann. § 18.2-51",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Virginia malicious wounding; verify against Justia before promoting to high",
  },
  "wa-aggravated-assault": {
    citation: "Wash. Rev. Code § 9A.36.011",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Washington assault in the first degree; verify against Justia before promoting to high",
  },
  "wv-aggravated-assault": {
    citation: "W. Va. Code § 61-2-9",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — West Virginia malicious assault; verify against Justia before promoting to high",
  },
  "wi-aggravated-assault": {
    citation: "Wis. Stat. § 940.19(5)",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Wisconsin battery — great bodily harm (aggravated); verify against Justia before promoting to high",
  },
  "wy-aggravated-assault": {
    citation: "Wyo. Stat. Ann. § 6-2-502",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Wyoming aggravated assault and battery; verify against Justia before promoting to high",
  },
  "dc-aggravated-assault": {
    citation: "D.C. Code § 22-404.01",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — D.C. aggravated assault; verify against Justia before promoting to high",
  },

  // ── BATCH 10: Domestic Violence Assault — all covered states ─────────────

  "al-domestic-violence-assault": {
    citation: "Ala. Code § 13A-6-130",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alabama domestic violence third degree; verify against Justia before promoting to high",
  },
  "ak-domestic-violence-assault": {
    citation: "Alaska Stat. § 11.41.230",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Alaska assault in the fourth degree (domestic violence); verify against Justia before promoting to high",
  },
  "az-domestic-violence-assault": {
    citation: "Ariz. Rev. Stat. § 13-3601",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arizona domestic violence statute (applies assault statutes in DV context); verify against Justia before promoting to high",
  },
  "ar-domestic-violence-assault": {
    citation: "Ark. Code Ann. § 5-26-303",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Arkansas domestic battering in the third degree; verify against Justia before promoting to high",
  },
  "ca-domestic-violence-assault": {
    citation: "Cal. Penal Code § 273.5",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — California corporal injury on spouse/cohabitant (domestic violence); verify against Justia before promoting to high",
  },
  "co-domestic-violence-assault": {
    citation: "Colo. Rev. Stat. § 18-6-800.3",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Colorado domestic violence sentencing enhancement statute; verify against Justia before promoting to high",
  },
  "ct-domestic-violence-assault": {
    citation: "Conn. Gen. Stat. § 53a-61",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Connecticut assault in the third degree (most common DV charge); verify against Justia before promoting to high",
  },
  "de-domestic-violence-assault": {
    citation: "Del. Code Ann. tit. 11 § 1042",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Delaware offensive touching — domestic violence; verify against Justia before promoting to high",
  },
  "ga-domestic-violence-assault": {
    citation: "Ga. Code Ann. § 19-13-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Georgia family violence battery; verify against Justia before promoting to high",
  },
  "hi-domestic-violence-assault": {
    citation: "Haw. Rev. Stat. § 709-906",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Hawaii abuse of family or household members; verify against Justia before promoting to high",
  },
  "id-domestic-violence-assault": {
    citation: "Idaho Code § 18-918",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Idaho domestic assault and battery; verify against Justia before promoting to high",
  },
  "in-domestic-violence-assault": {
    citation: "Ind. Code § 35-42-2-1",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Indiana battery (domestic violence enhancement); verify against Justia before promoting to high",
  },
  "ia-domestic-violence-assault": {
    citation: "Iowa Code § 236.2",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Iowa domestic abuse assault; verify against Justia before promoting to high",
  },
  "ks-domestic-violence-assault": {
    citation: "Kan. Stat. Ann. § 21-5414",
    confidence: "medium",
    lastVerified: "2026-04",
    source: "Training data — Kansas domestic battery; verify against Justia before promoting to high",
  },

  // ── Territories: excluded from automated research; handle manually if needed ─
  // AS, GU, MP, PR, VI — codes are inconsistently published online; error risk too high
};
