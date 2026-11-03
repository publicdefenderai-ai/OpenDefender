// Published screener copy captured from main f505a2c1 before the design refresh.
export default {
  "en": {
    "badge": "Arrest stage",
    "pageTitle": "Arrest-Stage Risk Screener",
    "pageDesc": "An arrest can immediately put housing, employment, and other vital systems at risk, even before any conviction. Answer 7 quick yes-or-no questions to see what may need attention right now.",
    "qOf": "Question {{n}} of {{total}}",
    "yes": "Yes",
    "no": "No",
    "back": "Back",
    "resultsTitle": "Your Risk Summary",
    "resultsDesc": "These systems may be at immediate risk based on your answers. The most urgent items appear first.",
    "noRiskTitle": "No Active Risks Identified",
    "noRiskDesc": "Based on your answers, none of the civil systems we screen for appear to be at immediate risk from this arrest. This does not cover every possible consequence. Speak with your attorney about your specific situation.",
    "whatLabel": "What's at risk",
    "timelineLabel": "Timeline",
    "actionLabel": "Best practices",
    "disclaimer": "These results are preliminary risk flags only — not legal determinations. Whether a consequence actually applies depends on your specific charges, jurisdiction, and case outcome.",
    "generalInfo": "General information only. Not legal advice. Consult a qualified attorney for advice specific to your situation.",
    "copyBtn": "Copy summary",
    "copiedBtn": "Copied",
    "printBtn": "Print",
    "restart": "Start over",
    "backToHub": "Back to Advocate Hub",
    "privacyStrip": "This tool stores none of your answers. All processing happens locally on your device.",
    "printHeading": "ARREST-STAGE RISK SUMMARY",
    "printDate": "Generated: {{date}}",
    "printNoRisk": "No active risks identified based on your answers.",
    "printTimeline": "Timeline:",
    "printAction": "Best practices:",
    "printDisclaimer": "These results are preliminary risk flags only — not legal determinations. Whether a consequence actually applies depends on your specific charges, jurisdiction, and case outcome. General information only. Not legal advice. Consult a qualified attorney for advice specific to your situation.",
    "questions": {
      "housing": {
        "question": "Are you renting, or living in subsidized or Section 8 housing?",
        "sub": "Includes public housing, Section 8 vouchers, or any government-assisted rental."
      },
      "employment": {
        "question": "Are you currently employed?",
        "sub": "Includes full-time, part-time, gig work, or any paying job."
      },
      "immigration": {
        "question": "Is anyone in your household not a U.S. citizen or permanent resident?",
        "sub": "Includes visa holders, DACA recipients, undocumented individuals, and others with temporary status.",
        "privacyNote": "This answer is never stored or transmitted. It runs only in your browser."
      },
      "benefits": {
        "question": "Are you receiving federal benefits?",
        "sub": "Includes SNAP, SSI, SSDI, Medicaid, Section 8, TANF, or other federal assistance programs."
      },
      "children": {
        "question": "Do you have minor children in your care?",
        "sub": "Includes children you have custody of or are the primary caregiver for."
      },
      "supervision": {
        "question": "Are you currently on probation or parole?",
        "sub": "Includes any active supervision, conditional release, or community supervision order."
      },
      "license": {
        "question": "Do you hold a professional or occupational license?",
        "sub": "Includes nursing, teaching, contractor, security guard, real estate, and other licensed professions."
      }
    },
    "chargeType": {
      "heading": "What type of charge is this case about?",
      "sub": "This helps us identify the most relevant consequences for your situation. Your answer is never stored.",
      "skip": "Skip — I'm not sure yet",
      "options": {
        "dui": "DUI / Impaired driving",
        "drug_possession": "Drug possession or use",
        "drug_trafficking": "Drug sale, distribution, or trafficking",
        "theft_property": "Theft, burglary, or property crime",
        "domestic_violence": "Domestic violence or assault",
        "sex_offense": "Sex offense",
        "other": "Other / Not listed"
      }
    },
    "risks": {
      "supervision": {
        "title": "Probation or Parole Violation Risk",
        "what": "A new arrest triggers an automatic supervision violation regardless of how this case ends. A hold may be placed before you see a judge, and a separate revocation hearing can be scheduled before your criminal case is resolved.",
        "clock": "Your supervision officer is typically notified within 24 hours of booking. A hold can be placed before any bail hearing.",
        "action": "Informing your defense attorney about your supervision status as early as possible is a priority. Most attorneys advise against contacting your supervision officer before speaking with defense counsel first.",
        "linkLabel": "Get case guidance"
      },
      "immigration": {
        "title": "Immigration and ICE Detainer Risk",
        "what": "ICE can lodge a detainer against any non-citizen booked into a local jail, asking the jail to hold the person up to 48 hours past their release date so ICE can take custody. Criminal charges or a conviction can also affect visa status, green card eligibility, and create grounds for removal.",
        "clock": "An ICE detainer can be issued within hours of booking. This is one of the fastest-moving consequences of an arrest.",
        "action": "Contact an immigration attorney as soon as possible, before any plea discussions. Criminal charges and immigration consequences must be evaluated together.",
        "linkLabel": "Immigration guidance"
      },
      "children": {
        "title": "Child Welfare and Custody Risk",
        "what": "Law enforcement can notify Child Protective Services at the time of arrest, especially if children were present or you are the sole caregiver. An open CPS investigation can affect custody arrangements and parental rights before any conviction.",
        "clock": "CPS can be notified at the time of arrest. If children are left without care, emergency placement can happen the same day.",
        "action": "Having childcare arranged with a trusted adult is important if detention is possible. Documenting existing custody arrangements and reaching out to an attorney if CPS makes contact are commonly recommended steps.",
        "linkLabel": "Childcare support"
      },
      "housing": {
        "title": "Housing and Eviction Risk",
        "what": "Public housing authorities and Section 8 programs can begin eviction proceedings based on an arrest alone, before any conviction. Federal one-strike rules give housing authorities broad authority to act. Private landlords may also have lease clauses that treat an arrest as a violation.",
        "clock": "Public housing authorities can begin proceedings within days of an arrest. Review your lease immediately.",
        "action": "Review your lease for arrest or criminal activity clauses. If you live in public housing or use a Section 8 voucher, contact a housing attorney before the housing authority contacts you.",
        "linkLabel": "Housing support"
      },
      "employment": {
        "title": "Employment Risk",
        "what": "At-will employers can terminate employment after an arrest even without a conviction. Some jobs require employees to report arrests to HR within a set number of days. Roles requiring security clearances or working with vulnerable populations face the highest risk of suspension.",
        "clock": "There is no set timeline. An at-will employer can act immediately. Check your employment contract for arrest reporting requirements.",
        "action": "Reviewing your employment contract and employee handbook for arrest reporting obligations is a good first step. Most attorneys advise against volunteering information to your employer before consulting with counsel.",
        "linkLabel": "Employment support"
      },
      "benefits": {
        "title": "Federal Benefits Risk",
        "what": "Some federal benefit programs require you to report an arrest. A conviction for certain offenses, particularly drug offenses, can result in automatic disqualification from programs like SNAP and federal student aid. A felony conviction triggers a lifetime SNAP ban in some states.",
        "clock": "Reporting requirements vary by program. Some require notification within 10 days of an arrest. Contact your caseworker to understand your obligations.",
        "action": "Contact your benefits caseworker to understand your reporting obligations. Ask your attorney whether the charges you face carry automatic benefits consequences.",
        "linkLabel": "Financial support"
      },
      "license": {
        "title": "Professional License Risk",
        "what": "Many licensing boards require license holders to report arrests within 30 days and can suspend a license pending the outcome of a case. Fields with the highest risk include nursing, teaching, law, real estate, contracting, security work, and any profession requiring a background check for renewal.",
        "clock": "Most licensing boards require reporting within 30 days of an arrest. Some boards act immediately upon notification. Check your board's specific rules.",
        "action": "Look up your licensing board's rules on arrest reporting. Contact an attorney who handles professional licensing matters before you report to your board.",
        "linkLabel": "Find legal help"
      },
      "driverLicense": {
        "title": "Driver's License Suspension Risk",
        "what": "DUI and many drug convictions automatically trigger driver's license suspension through two separate tracks: an administrative (DMV) suspension tied to your arrest, and a criminal court suspension tied to conviction. Both can run at the same time. Most states allow a restricted or hardship license for work and medical travel during suspension, but you must act quickly — the administrative suspension window can close within days of arrest.",
        "clock": "In most states, the administrative license suspension begins automatically 30–60 days after arrest unless you request a DMV hearing, usually within 5–30 days of your arrest notice. Failing to request the hearing within the deadline waives your right to contest the administrative suspension.",
        "action": "Ask your attorney to file a DMV hearing request on your behalf immediately — do not wait for your court date. Also ask about hardship or restricted license options and whether an ignition interlock device can allow you to drive during the suspension period.",
        "linkLabel": "Transportation and license help"
      },
      "driverLicenseCheck": {
        "title": "Driver's License — Check Your State",
        "what": "Some states (including CA, FL, IL, MA, and TX) automatically suspend your driver's license for a drug conviction even when no vehicle was involved. Other states do not. Whether this applies to you depends on the state where you were convicted.",
        "clock": "If your state does require suspension, it typically takes effect at sentencing or shortly after conviction. Acting before a conviction is entered gives you the most options.",
        "action": "Ask your attorney specifically whether your state suspends driver's licenses for this type of drug conviction and whether any hardship or restricted license is available. Do not assume your license is safe — and do not assume it is at risk — without confirming your state's rule.",
        "linkLabel": "Transportation and license help"
      },
      "sexOffender": {
        "title": "Sex Offender Registration Risk",
        "what": "Some convictions can require sex-offender registration. Whether registration applies, its duration, public disclosure and residence restrictions depend on the exact offense, jurisdiction and individual circumstances. A charge alone does not establish these consequences.",
        "clock": "Registration and update deadlines vary. Confirm applicable duties promptly with counsel and the registering agency. Failure to comply can be a separate offense; its classification and any federal liability depend on the law and facts.",
        "action": "Before any plea, ask counsel whether registration applies, how a tier is assigned, the minimum period, reporting duties and any available termination petition. Completion of a minimum period does not necessarily end registration automatically.",
        "linkLabel": "Find legal help"
      }
    },
    "stateDeadlines": {
      "selectorLabel": "See state-specific deadlines",
      "selectorPlaceholder": "Select a state for local deadlines",
      "calloutHeading": "{{stateName}} — Local Rule",
      "calloutSource": "Source: {{source}}",
      "calloutNote": "For general guidance only. Verify with a licensed attorney before relying on this.",
      "entries": {
        "federal": {
          "stateName": "Federal (HUD / Federal Rules)",
          "housing": {
            "headline": "PHAs must give written notice and a grievance opportunity",
            "detail": "Federal HUD rules require mandatory termination for a narrow set of crimes (drug-related convictions in federally assisted housing, meth production on the premises, lifetime sex offender registrants). For all other criminal activity, housing authorities have discretion. In either case, the PHA must provide written notice and allow you to request a grievance hearing before eviction proceeds.",
            "source": "24 C.F.R. § 966.4(l)(3); 42 U.S.C. § 1437d"
          },
          "license": {
            "headline": "No single federal reporting deadline — check your specific license or clearance terms",
            "detail": "Federal agencies and licensing bodies each have their own reporting rules. Security clearances and many federal licenses typically require self-reporting an arrest within 5–30 days. Missing a required report can be treated as a separate violation. Check your specific documentation immediately."
          }
        },
        "AL": {
          "stateName": "Alabama",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Alabama housing authorities follow federal HUD minimum requirements — written notice of lease termination with specific reasons and the right to request a grievance hearing. Alabama has no statewide fair-chance housing law for private landlords. Contact your housing authority immediately after any arrest to understand your specific PHA's administrative plan before a formal notice is issued.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of a conviction; nexus reform applies since 2019",
            "detail": "Alabama HB 244 (2019) requires licensing boards to conduct an individualized nexus assessment before denying a license based on criminal history. Most Alabama boards require self-reporting a conviction or guilty plea within 30 days. An arrest alone is generally not a reportable event unless the specific board's rules state otherwise.",
            "source": "Ala. Code § 41-22-1 et seq.; HB 244 (2019)"
          }
        },
        "AK": {
          "stateName": "Alaska",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Alaska housing authorities follow federal HUD minimum requirements — written notice and a grievance opportunity before eviction. Alaska has no statewide fair-chance housing law for private landlords. If you receive any housing notice related to criminal activity, request a grievance hearing promptly — the window is typically 10–14 days from receipt of notice.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of a conviction; nexus required for denial",
            "detail": "Alaska Stat. § 08.01.075 prohibits licensing boards from denying a license solely due to a prior conviction without a nexus finding. Most Alaska boards require self-reporting a final conviction within 30 days. An arrest without a conviction is generally not reportable unless the board's specific regulations require it.",
            "source": "Alaska Stat. § 08.01.075"
          }
        },
        "AZ": {
          "stateName": "Arizona",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Arizona housing authorities follow federal HUD minimum requirements — written notice of lease termination with specific reasons and the right to request a grievance hearing. Arizona has no statewide fair-chance housing law for private landlords. Contact your housing authority as soon as possible after an arrest, before a formal notice is issued.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Arizona HB 2569 / Ariz. Rev. Stat. § 41-1093 et seq. (2019) requires licensing boards to conduct an individualized assessment and apply a nexus test before denying a license based on criminal history. Most Arizona boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Ariz. Rev. Stat. § 41-1093 et seq. (2019)"
          }
        },
        "AR": {
          "stateName": "Arkansas",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Arkansas housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Arkansas has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary housing actions.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus required since 2019",
            "detail": "Ark. Code Ann. § 17-1-103 (2019) requires licensing boards to consider whether a conviction is directly related to the occupation before denying a license. Most Arkansas boards require self-reporting a final conviction within 30 days. An arrest alone is generally not a reportable event.",
            "source": "Ark. Code Ann. § 17-1-103 (2019)"
          }
        },
        "CA": {
          "stateName": "California",
          "housing": {
            "headline": "PHA must give 14-day written notice; you may request a grievance hearing",
            "detail": "California housing authorities must provide a written notice of lease termination and the specific reasons. You have the right to request a grievance hearing, typically within 10–14 days of the notice. Los Angeles and San Francisco have additional local fair-chance housing protections requiring individualized assessment before any housing action tied to criminal history.",
            "source": "HUD 24 C.F.R. § 966.4; Cal. Gov. Code § 12955"
          },
          "license": {
            "headline": "Most boards require self-reporting within 30 days of a conviction — not an arrest",
            "detail": "California Business & Professions Code § 490 prohibits denying a license solely based on a prior conviction; boards must conduct an individualized assessment. Most CA boards (nursing: Cal. B&P § 2762; teaching: Ed. Code § 44009; contractors: Cal. B&P § 7069) require reporting a conviction or guilty plea within 30 days. An arrest alone generally does not trigger a mandatory report unless the board's specific regulations require it.",
            "source": "Cal. Bus. & Prof. Code §§ 490, 2762; Ed. Code § 44009"
          }
        },
        "CO": {
          "stateName": "Colorado",
          "housing": {
            "headline": "PHAs follow HUD notice rules; Denver has a Fair Chance for Housing ordinance",
            "detail": "Colorado housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity. Denver's Fair Chance for Housing Ordinance (eff. Jan. 2022) prohibits landlords from inquiring about criminal history before a conditional rental offer. Outside Denver, Colorado has no statewide private landlord fair-chance housing law. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; Denver Ord. 21-1370"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019) requires licensing boards to conduct an individualized assessment and apply a nexus test before denying a license based on criminal history. Most Colorado boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019)"
          }
        },
        "CT": {
          "stateName": "Connecticut",
          "housing": {
            "headline": "PHAs follow HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Connecticut housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Connecticut has no statewide fair-chance housing law for private landlords, though some municipalities may have local protections. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; Conn. Gen. Stat. § 46a-80"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; 'reasonable relationship' standard applies",
            "detail": "Conn. Gen. Stat. § 46a-80 requires licensing boards to apply a 'reasonable relationship' standard before denying a license based on criminal history. Most Connecticut boards require self-reporting a final conviction within 30 days. An arrest without conviction is generally not reportable unless the board's specific rules state otherwise.",
            "source": "Conn. Gen. Stat. § 46a-80"
          }
        },
        "DE": {
          "stateName": "Delaware",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Delaware housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Delaware has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Del. Code Ann. tit. 29 § 8735(y) (2019) requires licensing boards to conduct an individualized assessment before denying a license based on criminal history. Most Delaware boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Del. Code Ann. tit. 29 § 8735(y) (2019)"
          }
        },
        "DC": {
          "stateName": "District of Columbia",
          "housing": {
            "headline": "DC Fair Criminal Record Screening Act prohibits inquiry until after a conditional offer",
            "detail": "The DC Fair Criminal Record Screening for Housing Act (D.C. Code § 42-3505.08, 2016) prohibits landlords from inquiring about criminal history until after making a conditional rental offer. After a conditional offer, landlords may consider only certain crimes with individualized assessment. DC also follows federal HUD rules for public housing — written notice and grievance opportunity before any eviction.",
            "source": "D.C. Code § 42-3505.08; HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform applies",
            "detail": "D.C. Code § 47-2853.17 (2019) requires DC licensing boards to apply an individualized assessment before denying a license based on criminal history. Most DC boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable unless the board's specific rules require it.",
            "source": "D.C. Code § 47-2853.17 (2019)"
          }
        },
        "FL": {
          "stateName": "Florida",
          "housing": {
            "headline": "PHAs follow HUD notice rules; some counties have additional local protections",
            "detail": "Florida housing authorities follow federal HUD minimum requirements (written notice and grievance opportunity). Florida has no statewide fair-chance housing law. Local ordinances in Miami-Dade and other counties may provide additional procedural rights. Contact your housing authority as soon as you are aware of any action — delays make appeals harder.",
            "source": "HUD 24 C.F.R. § 966.4; Fla. Stat. § 760.23"
          },
          "license": {
            "headline": "Most FL boards require reporting within 30 days of conviction or plea",
            "detail": "Florida Statutes § 456.0635 governs health care licensees and requires reporting certain criminal actions. Most Florida licensing boards require self-reporting a conviction, guilty plea, or no-contest plea within 30 days. Arrests without conviction are generally not reportable unless the board's specific statute requires it. Failure to report is itself a separate ground for discipline.",
            "source": "Fla. Stat. §§ 456.0635, 456.072(1)(c)"
          }
        },
        "GA": {
          "stateName": "Georgia",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; admin hearing request typically due within 10–14 days of notice",
            "detail": "Georgia housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Georgia has no statewide fair-chance housing law for private landlords. Note: if arrested and subject to a criminal-activity lease termination, the admin hearing request window is typically 10–14 days. Contact your housing authority immediately — do not wait for formal notice.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; direct relationship standard (2021)",
            "detail": "O.C.G.A. § 43-1-19 (amended 2021) requires licensing boards to apply a 'direct relationship' standard before denying a license based on criminal history. Most Georgia boards require self-reporting a final conviction within 30 days. An arrest without conviction is generally not reportable unless the board's specific rules state otherwise.",
            "source": "O.C.G.A. § 43-1-19 (amended 2021)"
          }
        },
        "HI": {
          "stateName": "Hawaii",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide private landlord fair-chance law",
            "detail": "Hawaii housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Hawaii has no statewide fair-chance housing law specifically for private landlords. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus required for denial",
            "detail": "Haw. Rev. Stat. § 831-3.1 requires licensing boards to apply an individualized assessment before denying a license based on criminal history. Hawaii is one of the earliest states to require a nexus finding. Most Hawaii boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Haw. Rev. Stat. § 831-3.1"
          }
        },
        "ID": {
          "stateName": "Idaho",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Idaho housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Idaho has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2020) applies",
            "detail": "Idaho Code § 67-9406 (HB 357, 2020) requires licensing boards to conduct an individualized nexus assessment before denying a license based on criminal history. Most Idaho boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Idaho Code § 67-9406 (HB 357, 2020)"
          }
        },
        "IL": {
          "stateName": "Illinois",
          "housing": {
            "headline": "PHAs follow HUD rules; Chicago and Cook County have fair chance housing protections",
            "detail": "Illinois housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Chicago (RLTO § 5-12-170) and Cook County (Just Housing Amendment, 2020) restrict landlords from using criminal history in rental decisions without individualized assessment. No statewide private landlord law. Contact your housing authority promptly.",
            "source": "HUD 24 C.F.R. § 966.4; Chicago RLTO § 5-12-170; Cook County Just Housing Amendment (2020)"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; Fair Licensure Act (2021) applies",
            "detail": "Illinois Fair Licensure for Returned Citizens Act (SB 1814, 2021) requires licensing boards to apply an individualized assessment before denying a license based on criminal history. Most Illinois boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "IL Fair Licensure for Returned Citizens Act (SB 1814, 2021); 225 ILCS 450/2"
          }
        },
        "IN": {
          "stateName": "Indiana",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Indiana housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Indiana has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; individualized assessment required (2020)",
            "detail": "Ind. Code § 25-1-1.2-5 (HEA 1059, 2020) requires licensing boards to conduct an individualized assessment before denying a license based on criminal history. Most Indiana boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Ind. Code § 25-1-1.2-5 (HEA 1059, 2020)"
          }
        },
        "IA": {
          "stateName": "Iowa",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Iowa housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Iowa has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus required (2020)",
            "detail": "Iowa Code § 272C.2(2) (2020) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Iowa boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Iowa Code § 272C.2(2) (2020)"
          }
        },
        "KS": {
          "stateName": "Kansas",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Kansas housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Kansas has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2020) applies",
            "detail": "Kan. Stat. Ann. § 74-120 (SB 367, 2020) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Kansas boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Kan. Stat. Ann. § 74-120 (SB 367, 2020)"
          }
        },
        "KY": {
          "stateName": "Kentucky",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Kentucky housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Kentucky has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2020) applies",
            "detail": "Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020) requires licensing boards to conduct an individualized nexus assessment before denying a license based on criminal history. Most Kentucky boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020)"
          }
        },
        "LA": {
          "stateName": "Louisiana",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Louisiana housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Louisiana has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "La. Rev. Stat. § 37:2950 (HB 707, 2021) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most Louisiana boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "La. Rev. Stat. § 37:2950 (HB 707, 2021)"
          }
        },
        "ME": {
          "stateName": "Maine",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Maine housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Maine has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Me. Rev. Stat. tit. 32 § 13862-A (2019) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Maine boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Me. Rev. Stat. tit. 32 § 13862-A (2019)"
          }
        },
        "MD": {
          "stateName": "Maryland",
          "housing": {
            "headline": "PHAs follow HUD notice rules; Baltimore City has a fair chance housing ordinance",
            "detail": "Maryland housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Baltimore City has a fair chance housing ordinance restricting how landlords may use criminal history. No statewide private landlord fair-chance housing law. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most Maryland boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019)"
          }
        },
        "MA": {
          "stateName": "Massachusetts",
          "housing": {
            "headline": "PHAs follow HUD rules; CORI reform restricts when landlords may ask about criminal history",
            "detail": "Massachusetts housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. State CORI reform (M.G.L. c. 151B) restricts when landlords with 6+ units may inquire about criminal history. Boston has a Fair Chance for Housing ordinance. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; M.G.L. c. 151B § 4(9)"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; Criminal Justice Reform Act (2018) applies",
            "detail": "M.G.L. c. 6A § 18M (Criminal Justice Reform Act, 2018) requires licensing boards to apply an individualized assessment before denying a license based on criminal history. Most Massachusetts boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable under CORI reform.",
            "source": "M.G.L. c. 6A § 18M; M.G.L. c. 151B § 4(9½) (CORI Reform Act)"
          }
        },
        "MI": {
          "stateName": "Michigan",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Michigan housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Michigan has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2018) applies",
            "detail": "MCL § 338.41 et seq. (Occupational Code amendments, 2018) requires licensing boards to apply an individualized assessment before denying a license based on criminal history. Most Michigan boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "MCL § 338.41 et seq. (Occupational Code amendments, 2018)"
          }
        },
        "MN": {
          "stateName": "Minnesota",
          "housing": {
            "headline": "PHAs follow HUD rules; Minneapolis and St. Paul restrict criminal history inquiries on applications",
            "detail": "Minnesota housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Minneapolis and St. Paul have fair chance housing ordinances prohibiting criminal history inquiries on rental applications before a conditional offer. No statewide private landlord law. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; Minneapolis Fair Chance in Housing Ordinance (2020)"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; direct relationship standard applies",
            "detail": "Minn. Stat. § 364.03 requires licensing boards to apply a 'direct relationship' standard before denying a license based on criminal history. Most Minnesota boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Minn. Stat. § 364.03"
          }
        },
        "MS": {
          "stateName": "Mississippi",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Mississippi housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Mississippi has no statewide fair-chance housing law for private landlords and no statewide occupational licensing nexus reform. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; boards have broad discretion",
            "detail": "Mississippi has no statewide occupational licensing nexus reform law as of 2026. Most Mississippi licensing boards require self-reporting a final conviction within 30 days. Boards have broad discretion to deny a license based on criminal history. Consult an attorney if a board action is threatened.",
            "source": "Miss. Code Ann. § 73-1-1 et seq. (general licensing provisions)"
          }
        },
        "MO": {
          "stateName": "Missouri",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Missouri housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Missouri has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "Mo. Rev. Stat. § 324.011 (SB 262, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Missouri boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Mo. Rev. Stat. § 324.011 (SB 262, 2021)"
          }
        },
        "MT": {
          "stateName": "Montana",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Montana housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Montana has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "Mont. Code Ann. § 37-1-203 (SB 212, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Montana boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Mont. Code Ann. § 37-1-203 (SB 212, 2021)"
          }
        },
        "NE": {
          "stateName": "Nebraska",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Nebraska housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Nebraska has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most Nebraska boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021)"
          }
        },
        "NV": {
          "stateName": "Nevada",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide private landlord fair-chance law",
            "detail": "Nevada housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Nevada has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus required (2017)",
            "detail": "NRS § 622A.300 (AB 384, 2017) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Nevada boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "NRS § 622A.300 (AB 384, 2017)"
          }
        },
        "NH": {
          "stateName": "New Hampshire",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "New Hampshire housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. New Hampshire has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "N.H. Rev. Stat. Ann. § 332-G:8 (2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most New Hampshire boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "N.H. Rev. Stat. Ann. § 332-G:8 (2021)"
          }
        },
        "NJ": {
          "stateName": "New Jersey",
          "housing": {
            "headline": "NJ Fair Chance in Housing Act (2021) — landlords may not ask about criminal history before a conditional offer",
            "detail": "New Jersey's statewide Fair Chance in Housing Act (N.J. Stat. Ann. § 46:8-52 et seq., eff. 2022) prohibits landlords from inquiring about criminal history until after making a conditional rental offer. After a conditional offer, landlords must apply an individualized assessment. New Jersey housing authorities also follow federal HUD rules — written notice and grievance opportunity before any public housing eviction.",
            "source": "N.J. Stat. Ann. § 46:8-52 et seq. (Fair Chance in Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "N.J. Stat. Ann. § 45:1-21.1 (2021) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most New Jersey boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "N.J. Stat. Ann. § 45:1-21.1 (2021)"
          }
        },
        "NM": {
          "stateName": "New Mexico",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide private landlord fair-chance law",
            "detail": "New Mexico housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. New Mexico has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "NMSA 1978 § 61-1-34 (2019) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most New Mexico boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "NMSA 1978 § 61-1-34 (2019)"
          }
        },
        "NY": {
          "stateName": "New York",
          "housing": {
            "headline": "NYCHA gives 30-day notice; you have 10 days to request a grievance hearing",
            "detail": "New York City Housing Authority (NYCHA) must serve a written lease termination notice at least 30 days before the termination date. A household member has 10 days from receipt to request a grievance hearing. New York Correction Law Article 23-A also limits private landlords from denying housing based on a criminal record without individualized review.",
            "source": "NYCHA Grievance Procedures; N.Y. Correction Law §§ 750–754; N.Y. Exec. Law § 296(16)"
          },
          "license": {
            "headline": "NY Correction Law Art. 23-A applies; most boards require reporting within 30 days of conviction",
            "detail": "New York Correction Law Article 23-A prohibits automatic denial of a professional license based solely on a prior conviction. Boards must apply an eight-factor balancing test. Most NY licensing boards require self-reporting a conviction or final adjudication within 30 days. An arrest without conviction is generally not reportable unless the specific board's rules say otherwise.",
            "source": "N.Y. Correction Law §§ 750–754"
          }
        },
        "NC": {
          "stateName": "North Carolina",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "North Carolina housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. North Carolina has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most North Carolina boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021)"
          }
        },
        "ND": {
          "stateName": "North Dakota",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "North Dakota housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. North Dakota has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most North Dakota boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021)"
          }
        },
        "OH": {
          "stateName": "Ohio",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Ohio housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Ohio has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; direct relationship standard applies",
            "detail": "Ohio Rev. Code Ann. § 9.79 (SB 255, 2012; expanded HB 263, 2021) requires licensing boards to apply a 'direct relationship' standard before denying a license based on criminal history. Most Ohio boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Ohio Rev. Code Ann. § 9.79 (SB 255, 2012; HB 263, 2021)"
          }
        },
        "OK": {
          "stateName": "Oklahoma",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Oklahoma housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Oklahoma has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Oklahoma boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019)"
          }
        },
        "OR": {
          "stateName": "Oregon",
          "housing": {
            "headline": "Oregon Fair Chance Housing Act (2021) restricts landlord use of criminal history statewide",
            "detail": "Oregon's statewide Fair Chance Housing Act (Or. Rev. Stat. § 90.303, eff. 2022) restricts when landlords may use criminal history in rental decisions. Landlords may not inquire about criminal history until after accepting a rental application. Oregon housing authorities also follow federal HUD rules — written notice and grievance opportunity before any public housing eviction.",
            "source": "Or. Rev. Stat. § 90.303 (Fair Chance Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Or. Rev. Stat. § 676.612 (HB 2009, 2019) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Oregon boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Or. Rev. Stat. § 676.612 (HB 2009, 2019)"
          }
        },
        "PA": {
          "stateName": "Pennsylvania",
          "housing": {
            "headline": "PHAs follow HUD notice rules; Philadelphia has a fair chance housing ordinance",
            "detail": "Pennsylvania housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Philadelphia has a fair chance housing ordinance restricting when landlords may use criminal history. No statewide private landlord fair-chance housing law. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; 18 Pa. C.S. § 9125"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus required (2020)",
            "detail": "63 Pa. C.S. § 3113 (SB 637, 2020) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Pennsylvania boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "63 Pa. C.S. § 3113 (SB 637, 2020)"
          }
        },
        "RI": {
          "stateName": "Rhode Island",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Rhode Island housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Rhode Island has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2022) applies",
            "detail": "R.I. Gen. Laws § 5-76-2 (2022) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Rhode Island boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "R.I. Gen. Laws § 5-76-2 (2022)"
          }
        },
        "SC": {
          "stateName": "South Carolina",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "South Carolina housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. South Carolina has no statewide fair-chance housing law for private landlords and no statewide occupational licensing nexus reform. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; boards have broad discretion",
            "detail": "South Carolina has no statewide occupational licensing nexus reform law as of 2026. Most South Carolina licensing boards require self-reporting a final conviction within 30 days. Boards have broad discretion to deny a license based on criminal history. Consult an attorney if a board action is threatened.",
            "source": "S.C. Code Ann. § 40-1-110 et seq. (general licensing provisions)"
          }
        },
        "SD": {
          "stateName": "South Dakota",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "South Dakota housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. South Dakota has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "SDCL § 36-2A-9 (SB 72, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most South Dakota boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "SDCL § 36-2A-9 (SB 72, 2021)"
          }
        },
        "TN": {
          "stateName": "Tennessee",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Tennessee housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Tennessee has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Tennessee boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019)"
          }
        },
        "TX": {
          "stateName": "Texas",
          "housing": {
            "headline": "PHAs generally give 14-day written notice per HUD rules; no statewide fair-chance law",
            "detail": "Texas housing authorities follow federal HUD minimum notice requirements. Most provide 14 days' written notice before a lease termination related to criminal activity. Texas has no statewide fair-chance housing law, so each PHA's administrative plan governs discretionary cases. Contact your housing authority as soon as possible after an arrest — before any formal notice is issued.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of a final conviction",
            "detail": "Texas Occupations Code Chapter 53 prohibits automatic license denial based on a prior conviction. Boards must apply a seven-factor balancing test. Most Texas licensing boards (medical, nursing, teaching) require self-reporting a conviction within 30 days after it becomes final. An arrest alone is usually not a reportable event unless the specific board's statute says so.",
            "source": "Tex. Occ. Code §§ 53.021–53.025"
          }
        },
        "UT": {
          "stateName": "Utah",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Utah housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Utah has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2020) applies",
            "detail": "Utah Code Ann. § 58-1-304 (SB 34, 2020) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Utah boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Utah Code Ann. § 58-1-304 (SB 34, 2020)"
          }
        },
        "VT": {
          "stateName": "Vermont",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Vermont housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Vermont has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2019) applies",
            "detail": "26 V.S.A. § 3105 (2019) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Vermont boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "26 V.S.A. § 3105 (2019)"
          }
        },
        "VA": {
          "stateName": "Virginia",
          "housing": {
            "headline": "PHAs follow HUD rules; some localities have fair chance housing protections",
            "detail": "Virginia housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Some Virginia localities (including Alexandria) have fair chance housing protections for private landlords. No statewide private landlord fair-chance housing law. Contact your housing authority promptly after any arrest.",
            "source": "HUD 24 C.F.R. § 966.4; Va. Code Ann. § 36-96.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "Va. Code Ann. § 54.1-204 (SB 1127, 2021) requires licensing boards to apply an individualized nexus assessment before denying a license based on criminal history. Most Virginia boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Va. Code Ann. § 54.1-204 (SB 1127, 2021)"
          }
        },
        "WA": {
          "stateName": "Washington",
          "housing": {
            "headline": "WA Fair Chance Housing Act (2018) restricts landlord use of criminal history statewide",
            "detail": "Washington's statewide Fair Chance Housing Act (RCW 59.18.580, eff. 2018) restricts when landlords may use criminal history in rental decisions. Applies to landlords with 3+ units in applicable jurisdictions; Seattle has broader protections. Washington housing authorities also follow federal HUD rules — written notice and grievance opportunity before any public housing eviction.",
            "source": "RCW 59.18.580 (Fair Chance Housing Act, 2018); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "RCW 18.185.020 (SB 5046, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Washington boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "RCW 18.185.020 (SB 5046, 2021)"
          }
        },
        "WV": {
          "stateName": "West Virginia",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "West Virginia housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. West Virginia has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "W. Va. Code § 30-1-7a (SB 97, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most West Virginia boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "W. Va. Code § 30-1-7a (SB 97, 2021)"
          }
        },
        "WI": {
          "stateName": "Wisconsin",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law for private landlords",
            "detail": "Wisconsin housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Wisconsin has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; substantial relationship standard applies",
            "detail": "Wis. Stat. § 111.335 (amended 2016) requires licensing boards to apply a 'substantial relationship' standard before denying a license based on criminal history. Most Wisconsin boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Wis. Stat. § 111.335 (amended 2016)"
          }
        },
        "WY": {
          "stateName": "Wyoming",
          "housing": {
            "headline": "PHAs follow federal HUD notice rules; no statewide fair-chance housing law",
            "detail": "Wyoming housing authorities follow federal HUD minimum requirements — written notice and grievance opportunity before eviction. Wyoming has no statewide fair-chance housing law for private landlords. Contact your housing authority promptly after any arrest; each PHA's administrative plan governs discretionary cases.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "Most boards require reporting within 30 days of conviction; nexus reform (2021) applies",
            "detail": "Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021) requires licensing boards to apply a nexus test before denying a license based on criminal history. Most Wyoming boards require self-reporting a final conviction within 30 days. Arrests without conviction are generally not reportable.",
            "source": "Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021)"
          }
        }
      }
    },
    "stateRules": {
      "heading": "State Laws: {{stateName}}",
      "subheading": "These rules apply after a conviction — not to an arrest alone. Verified from primary sources.",
      "voting": "Voting Rights",
      "btb": "Hiring (Ban the Box)",
      "benefits": "SNAP / TANF Drug Ban",
      "housing": "Fair Chance Housing",
      "verifiedOn": "Verified {{date}}",
      "mediumConfidenceNote": "Based on secondary sources — confirm against current statute before relying on this.",
      "noStateData": "State-specific data for your jurisdiction is not yet in our database. Visit ccresourcecenter.org for current rules.",
      "votingStatus": {
        "incarcerated": "Can vote while incarcerated",
        "on_release": "Restored upon release",
        "parole_complete": "Restored after parole",
        "supervision_complete": "Must complete all supervision",
        "waiting_period": "Waiting period after supervision",
        "application_required": "Application required",
        "permanent_bar": "Permanent bar (some offenses)"
      },
      "btbStatus": {
        "private_also": "Applies to all employers",
        "public_only": "Public employers only",
        "none": "No statewide law"
      },
      "snapStatus": {
        "no_ban": "No drug conviction ban",
        "modified": "Partial restrictions apply",
        "full_ban": "Lifetime ban for drug felonies"
      },
      "housingStatus": {
        "yes": "Statewide fair chance law",
        "no": "No statewide law (federal rules apply)"
      }
    }
  },
  "es": {
    "badge": "Etapa de arresto",
    "pageTitle": "Verificador de Riesgos al Momento del Arresto",
    "pageDesc": "Un arresto puede poner en riesgo inmediatamente la vivienda, el empleo y otros sistemas vitales, incluso antes de una condena. Responda 7 preguntas rápidas para ver qué puede necesitar atención ahora mismo.",
    "qOf": "Pregunta {{n}} de {{total}}",
    "yes": "Sí",
    "no": "No",
    "back": "Volver",
    "resultsTitle": "Su Resumen de Riesgos",
    "resultsDesc": "Estos sistemas pueden estar en riesgo inmediato según sus respuestas. Los elementos más urgentes aparecen primero.",
    "noRiskTitle": "No Se Identificaron Riesgos Activos",
    "noRiskDesc": "Según sus respuestas, ninguno de los sistemas civiles que evaluamos parece estar en riesgo inmediato por este arresto. Esto no cubre todas las posibles consecuencias. Hable con su abogado sobre su situación específica.",
    "whatLabel": "Qué está en riesgo",
    "timelineLabel": "Plazo",
    "actionLabel": "Mejores prácticas",
    "disclaimer": "Estos resultados son señales de riesgo preliminares únicamente, no determinaciones legales. Si una consecuencia aplica realmente depende de los cargos específicos, la jurisdicción y el resultado del caso.",
    "generalInfo": "Solo información general. No es asesoramiento legal. Consulte a un abogado calificado para asesoramiento específico a su situación.",
    "copyBtn": "Copiar resumen",
    "copiedBtn": "Copiado",
    "printBtn": "Imprimir",
    "restart": "Comenzar de nuevo",
    "backToHub": "Volver al Centro de Defensores",
    "privacyStrip": "Esta herramienta no almacena ninguna de sus respuestas. Todo el procesamiento ocurre localmente en su dispositivo.",
    "printHeading": "RESUMEN DE RIESGOS AL MOMENTO DEL ARRESTO",
    "printDate": "Generado: {{date}}",
    "printNoRisk": "No se identificaron riesgos activos según sus respuestas.",
    "printTimeline": "Plazo:",
    "printAction": "Mejores prácticas:",
    "printDisclaimer": "Estos resultados son señales de riesgo preliminares únicamente, no determinaciones legales. Si una consecuencia aplica realmente depende de los cargos específicos, la jurisdicción y el resultado del caso. Solo información general. No es asesoramiento legal. Consulte a un abogado calificado para asesoramiento específico a su situación.",
    "questions": {
      "housing": {
        "question": "¿Alquila vivienda o vive en una vivienda subsidiada o con Sección 8?",
        "sub": "Incluye vivienda pública, vales de la Sección 8 o cualquier alquiler con asistencia gubernamental."
      },
      "employment": {
        "question": "¿Está trabajando actualmente?",
        "sub": "Incluye trabajo a tiempo completo, parcial, por cuenta propia o cualquier trabajo remunerado."
      },
      "immigration": {
        "question": "¿Hay alguien en su hogar que no sea ciudadano estadounidense o residente permanente?",
        "sub": "Incluye titulares de visas, beneficiarios de DACA, personas indocumentadas y otros con estatus temporal.",
        "privacyNote": "Esta respuesta nunca se almacena ni se transmite. Solo se procesa en su navegador."
      },
      "benefits": {
        "question": "¿Recibe beneficios federales?",
        "sub": "Incluye SNAP, SSI, SSDI, Medicaid, Sección 8, TANF u otros programas de asistencia federal."
      },
      "children": {
        "question": "¿Tiene hijos menores de edad bajo su cuidado?",
        "sub": "Incluye hijos bajo su custodia o de los que usted es el cuidador principal."
      },
      "supervision": {
        "question": "¿Está actualmente en libertad condicional o supervisada?",
        "sub": "Incluye cualquier supervisión activa, liberación condicional u orden de supervisión comunitaria."
      },
      "license": {
        "question": "¿Tiene una licencia profesional u ocupacional?",
        "sub": "Incluye enfermería, docencia, contratista, guardia de seguridad, bienes raíces y otras profesiones con licencia."
      }
    },
    "chargeType": {
      "heading": "¿Qué tipo de cargo involucra este caso?",
      "sub": "Esto nos ayuda a identificar las consecuencias más relevantes para su situación. Su respuesta nunca se almacena.",
      "skip": "Omitir — aún no estoy seguro/a",
      "options": {
        "dui": "DUI / Conducción bajo los efectos del alcohol o drogas",
        "drug_possession": "Posesión o consumo de drogas",
        "drug_trafficking": "Venta, distribución o tráfico de drogas",
        "theft_property": "Robo, allanamiento u otro delito contra la propiedad",
        "domestic_violence": "Violencia doméstica o agresión",
        "sex_offense": "Delito sexual",
        "other": "Otro / No está en la lista"
      }
    },
    "risks": {
      "supervision": {
        "title": "Riesgo de Violación de Supervisión",
        "what": "Un nuevo arresto desencadena automáticamente una violación de la supervisión, sin importar cómo termine este caso. Se puede imponer una retención antes de que usted vea a un juez, y se puede programar una audiencia de revocación separada antes de que su caso penal se resuelva.",
        "clock": "Su oficial de supervisión suele ser notificado dentro de las 24 horas del registro. Se puede imponer una retención antes de cualquier audiencia de fianza.",
        "action": "Informar a su abogado defensor sobre su situación de supervisión lo antes posible es una prioridad. La mayoría de los abogados aconsejan no contactar al oficial de supervisión antes de hablar primero con el abogado defensor.",
        "linkLabel": "Obtener orientación del caso"
      },
      "immigration": {
        "title": "Riesgo de Detención de ICE e Inmigración",
        "what": "ICE puede presentar una orden de detención contra cualquier persona no ciudadana registrada en una cárcel local, solicitando que la cárcel retenga a la persona hasta 48 horas después de su fecha de liberación para que ICE pueda tomar custodia. Los cargos penales o una condena también pueden afectar el estatus de visa, la elegibilidad para la tarjeta verde y crear motivos de expulsión.",
        "clock": "Una orden de detención de ICE puede emitirse en cuestión de horas después del registro. Esta es una de las consecuencias más rápidas de un arresto.",
        "action": "Contacte a un abogado de inmigración lo antes posible, antes de cualquier discusión sobre declaraciones. Los cargos penales y las consecuencias migratorias deben evaluarse juntos.",
        "linkLabel": "Orientación de inmigración"
      },
      "children": {
        "title": "Riesgo de Bienestar Infantil y Custodia",
        "what": "Las fuerzas del orden pueden notificar a los Servicios de Protección de Menores en el momento del arresto, especialmente si los niños estaban presentes o usted es el único cuidador. Una investigación abierta de CPS puede afectar los acuerdos de custodia y los derechos parentales antes de cualquier condena.",
        "clock": "CPS puede ser notificado en el momento del arresto. Si los niños se quedan sin cuidado, la colocación de emergencia puede ocurrir el mismo día.",
        "action": "Tener el cuidado de los niños organizado con un adulto de confianza es importante si existe posibilidad de detención. Documentar los acuerdos de custodia existentes y comunicarse con un abogado si CPS hace contacto son pasos generalmente recomendados.",
        "linkLabel": "Apoyo para cuidado infantil"
      },
      "housing": {
        "title": "Riesgo de Vivienda y Desalojo",
        "what": "Las autoridades de vivienda pública y los programas de la Sección 8 pueden iniciar procedimientos de desalojo basándose únicamente en un arresto, antes de cualquier condena. Las reglas federales de un solo incidente dan a las autoridades de vivienda una amplia autoridad para actuar. Los arrendadores privados también pueden tener cláusulas en el contrato que tratan un arresto como una violación.",
        "clock": "Las autoridades de vivienda pública pueden iniciar procedimientos en pocos días después del arresto. Revise su contrato de arrendamiento de inmediato.",
        "action": "Revise su contrato para ver las cláusulas de arresto o actividad criminal. Si vive en vivienda pública o usa un vale de la Sección 8, contacte a un abogado de vivienda antes de que la autoridad de vivienda se comunique con usted.",
        "linkLabel": "Apoyo de vivienda"
      },
      "employment": {
        "title": "Riesgo de Empleo",
        "what": "Los empleadores a voluntad pueden despedir después de un arresto incluso sin condena. Algunos empleos requieren que los empleados reporten los arrestos a recursos humanos dentro de un número determinado de días. Los puestos que requieren autorización de seguridad o trabajo con poblaciones vulnerables enfrentan el mayor riesgo de suspensión.",
        "clock": "No hay un plazo establecido. Un empleador a voluntad puede actuar de inmediato. Revise su contrato de trabajo para conocer los requisitos de notificación.",
        "action": "Revisar su contrato de trabajo y el manual del empleado para conocer las obligaciones de notificación de arrestos es un buen primer paso. La mayoría de los abogados aconsejan no proporcionar información voluntariamente a su empleador antes de consultar con un abogado.",
        "linkLabel": "Apoyo de empleo"
      },
      "benefits": {
        "title": "Riesgo de Beneficios Federales",
        "what": "Algunos programas de beneficios federales requieren que reporte un arresto. Una condena por ciertos delitos, en particular de drogas, puede resultar en descalificación automática de programas como SNAP y la ayuda federal para estudiantes. Una condena por delito grave puede desencadenar una prohibición de por vida de SNAP en algunos estados.",
        "clock": "Los requisitos de notificación varían según el programa. Algunos requieren notificación dentro de los 10 días posteriores al arresto. Contacte a su trabajador social para comprender sus obligaciones.",
        "action": "Contacte a su trabajador social de beneficios para comprender sus obligaciones de notificación. Pregúntele a su abogado si los cargos que enfrenta conllevan consecuencias automáticas en los beneficios.",
        "linkLabel": "Apoyo financiero"
      },
      "license": {
        "title": "Riesgo de Licencia Profesional",
        "what": "Muchas juntas de licencias requieren que los titulares reporten los arrestos dentro de los 30 días y pueden suspender una licencia mientras se conoce el resultado del caso. Los campos con mayor riesgo incluyen enfermería, docencia, derecho, bienes raíces, contratación y cualquier profesión que requiera verificación de antecedentes para la renovación.",
        "clock": "La mayoría de las juntas de licencias requieren notificación dentro de los 30 días posteriores al arresto. Algunas juntas actúan de inmediato al recibir la notificación. Verifique las reglas específicas de su junta.",
        "action": "Consulte las reglas de su junta de licencias sobre la notificación de arrestos. Contacte a un abogado que maneje asuntos de licencias profesionales antes de reportar a su junta.",
        "linkLabel": "Encontrar ayuda legal"
      },
      "driverLicense": {
        "title": "Riesgo de Suspensión de Licencia de Conducir",
        "what": "El DUI y muchas condenas por drogas activan automáticamente la suspensión de la licencia de conducir a través de dos vías separadas: una suspensión administrativa (DMV) vinculada a su arresto y una suspensión del tribunal penal vinculada a la condena. Ambas pueden ocurrir al mismo tiempo. La mayoría de los estados permiten una licencia restringida o de emergencia para el trabajo y viajes médicos durante la suspensión, pero debe actuar rápidamente — el plazo de la suspensión administrativa puede cerrarse en días después del arresto.",
        "clock": "En la mayoría de los estados, la suspensión administrativa de la licencia comienza automáticamente 30–60 días después del arresto, a menos que solicite una audiencia ante el DMV, generalmente dentro de los 5–30 días a partir del aviso de arresto. No solicitar la audiencia dentro del plazo renuncia a su derecho de impugnar la suspensión administrativa.",
        "action": "Pida a su abogado que presente una solicitud de audiencia ante el DMV de inmediato — no espere la fecha de su tribunal. También pregunte sobre opciones de licencia restringida o de emergencia y si un dispositivo de bloqueo de encendido puede permitirle conducir durante el período de suspensión.",
        "linkLabel": "Ayuda con transporte y licencia"
      },
      "driverLicenseCheck": {
        "title": "Licencia de Conducir — Verifique Su Estado",
        "what": "Algunos estados (incluyendo CA, FL, IL, MA y TX) suspenden automáticamente la licencia de conducir por una condena por drogas, incluso cuando no hubo vehículo involucrado. Otros estados no lo hacen. Si esto aplica depende del estado donde fue condenado.",
        "clock": "Si su estado exige la suspensión, generalmente entra en vigencia en la sentencia o poco después de la condena. Actuar antes de que se dicte una condena le da más opciones.",
        "action": "Pregúntele específicamente a su abogado si su estado suspende las licencias de conducir por este tipo de condena por drogas y si hay disponible una licencia restringida o de emergencia. No asuma que su licencia está segura — ni que está en riesgo — sin confirmar la ley de su estado.",
        "linkLabel": "Ayuda con transporte y licencia"
      },
      "sexOffender": {
        "title": "Riesgo de Registro como Delincuente Sexual",
        "what": "Algunas condenas pueden exigir el registro de delincuentes sexuales. La obligación, su duración, la divulgación pública y las restricciones de residencia dependen del delito exacto, la jurisdicción y las circunstancias personales. Una acusación por sí sola no establece estas consecuencias.",
        "clock": "Los plazos de registro y actualización varían. Confirme pronto las obligaciones aplicables con su abogado y la agencia de registro. El incumplimiento puede ser un delito separado; su clasificación y cualquier responsabilidad federal dependen de la ley y los hechos.",
        "action": "Antes de aceptar un acuerdo de culpabilidad, pregunte si debe registrarse, cómo se asigna el nivel, el período mínimo, las obligaciones de informar y si puede solicitar la terminación del registro. Cumplir un período mínimo no siempre termina el registro automáticamente.",
        "linkLabel": "Encontrar ayuda legal"
      }
    },
    "stateDeadlines": {
      "selectorLabel": "Ver plazos según el estado",
      "selectorPlaceholder": "Seleccione un estado para ver los plazos locales",
      "calloutHeading": "{{stateName}} — Regla local",
      "calloutSource": "Fuente: {{source}}",
      "calloutNote": "Solo orientación general. Verifique con un abogado autorizado antes de depender de esta información.",
      "entries": {
        "federal": {
          "stateName": "Federal (reglas del HUD / reglas federales)",
          "housing": {
            "headline": "Las PHA deben dar aviso por escrito y la oportunidad de una audiencia de queja",
            "detail": "Las reglas federales del HUD exigen la terminación obligatoria para un grupo reducido de delitos (condenas relacionadas con drogas en viviendas con asistencia federal, producción de metanfetamina en el lugar, registro de por vida como delincuente sexual). Para cualquier otra actividad delictiva, las autoridades de vivienda tienen discreción. En cualquier caso, la PHA debe entregar aviso por escrito y permitirle solicitar una audiencia de queja antes de que proceda el desalojo.",
            "source": "24 C.F.R. § 966.4(l)(3); 42 U.S.C. § 1437d"
          },
          "license": {
            "headline": "No existe un plazo federal único de notificación — consulte los términos específicos de su licencia o autorización de seguridad",
            "detail": "Cada agencia federal y organismo de licencias tiene sus propias reglas de notificación. Las autorizaciones de seguridad y muchas licencias federales generalmente exigen autoinformar un arresto dentro de 5 a 30 días. No presentar un informe requerido puede tratarse como una infracción separada. Revise de inmediato su documentación específica."
          }
        },
        "AL": {
          "stateName": "Alabama",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Alabama siguen los requisitos mínimos federales del HUD — aviso por escrito de terminación del contrato con razones específicas y derecho a solicitar una audiencia de queja. Alabama no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto para conocer el plan administrativo específico de su PHA antes de que se emita un aviso formal.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de una condena; rige la reforma de nexo de 2019",
            "detail": "La HB 244 de Alabama (2019) exige que las juntas de licencias realicen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Alabama exigen autoinformar una condena o declaración de culpabilidad dentro de 30 días. Un arresto por sí solo generalmente no es un evento informable, salvo que las reglas de la junta indiquen lo contrario.",
            "source": "Ala. Code § 41-22-1 et seq.; HB 244 (2019)"
          }
        },
        "AK": {
          "stateName": "Alaska",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Alaska siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Alaska no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Si recibe un aviso de vivienda relacionado con actividad delictiva, solicite una audiencia de queja de inmediato — el plazo suele ser de 10 a 14 días desde la recepción del aviso.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de una condena; se requiere nexo para la denegación",
            "detail": "La Alaska Stat. § 08.01.075 prohíbe que las juntas de licencias denieguen una licencia únicamente por una condena previa sin una determinación de nexo. La mayoría de las juntas de Alaska exigen autoinformar una condena final dentro de 30 días. Un arresto sin condena generalmente no es informable, salvo que las regulaciones específicas de la junta lo requieran.",
            "source": "Alaska Stat. § 08.01.075"
          }
        },
        "AZ": {
          "stateName": "Arizona",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Arizona siguen los requisitos mínimos federales del HUD — aviso por escrito de terminación del contrato con razones específicas y derecho a solicitar una audiencia de queja. Arizona no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda lo antes posible tras un arresto, antes de que se emita un aviso formal.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La Ariz. Rev. Stat. § 41-1093 et seq. (2019) exige que las juntas de licencias realicen una evaluación individualizada y apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Arizona exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Ariz. Rev. Stat. § 41-1093 et seq. (2019)"
          }
        },
        "AR": {
          "stateName": "Arkansas",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Arkansas siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Arkansas no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere nexo desde 2019",
            "detail": "La Ark. Code Ann. § 17-1-103 (2019) exige que las juntas de licencias consideren si una condena está directamente relacionada con la ocupación antes de denegar una licencia. La mayoría de las juntas de Arkansas exigen autoinformar una condena final dentro de 30 días. Un arresto por sí solo generalmente no es un evento informable.",
            "source": "Ark. Code Ann. § 17-1-103 (2019)"
          }
        },
        "CA": {
          "stateName": "California",
          "housing": {
            "headline": "La PHA debe dar aviso por escrito con 14 días de anticipación; puede solicitar una audiencia de queja",
            "detail": "Las autoridades de vivienda de California deben entregar un aviso por escrito de terminación del contrato de arrendamiento y las razones específicas. Usted tiene derecho a solicitar una audiencia de queja, generalmente dentro de 10 a 14 días desde el aviso. Los Ángeles y San Francisco cuentan con protecciones adicionales locales de vivienda de oportunidad justa que exigen una evaluación individualizada antes de cualquier acción de vivienda relacionada con antecedentes penales.",
            "source": "HUD 24 C.F.R. § 966.4; Cal. Gov. Code § 12955"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen autoinformar dentro de 30 días de una condena — no de un arresto",
            "detail": "El Código de Negocios y Profesiones de California § 490 prohíbe denegar una licencia únicamente por una condena previa; las juntas deben realizar una evaluación individualizada. La mayoría de las juntas de CA (enfermería: Cal. B&P § 2762; docencia: Ed. Code § 44009; contratistas: Cal. B&P § 7069) exigen informar una condena o declaración de culpabilidad dentro de 30 días. Un arresto por sí solo generalmente no activa un informe obligatorio, salvo que las regulaciones específicas de la junta lo exijan.",
            "source": "Cal. Bus. & Prof. Code §§ 490, 2762; Ed. Code § 44009"
          }
        },
        "CO": {
          "stateName": "Colorado",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; Denver tiene una ordenanza de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Colorado siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja. La Ordenanza de Vivienda de Oportunidad Justa de Denver (vigente desde enero de 2022) prohíbe a los propietarios preguntar sobre antecedentes penales antes de una oferta de arrendamiento condicional. Fuera de Denver, Colorado no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; Denver Ord. 21-1370"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019) exige que las juntas de licencias realicen una evaluación individualizada y apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Colorado exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019)"
          }
        },
        "CT": {
          "stateName": "Connecticut",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Connecticut siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Connecticut no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados, aunque algunos municipios pueden tener protecciones locales. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; Conn. Gen. Stat. § 46a-80"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se aplica el estándar de 'relación razonable'",
            "detail": "La Conn. Gen. Stat. § 46a-80 exige que las juntas de licencias apliquen un estándar de 'relación razonable' antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Connecticut exigen autoinformar una condena final dentro de 30 días. Un arresto sin condena generalmente no es informable, salvo que las reglas específicas de la junta indiquen lo contrario.",
            "source": "Conn. Gen. Stat. § 46a-80"
          }
        },
        "DE": {
          "stateName": "Delaware",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Delaware siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Delaware no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La Del. Code Ann. tit. 29 § 8735(y) (2019) exige que las juntas de licencias realicen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Delaware exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Del. Code Ann. tit. 29 § 8735(y) (2019)"
          }
        },
        "DC": {
          "stateName": "Distrito de Columbia",
          "housing": {
            "headline": "La Ley de Detección de Antecedentes Penales Justos de DC prohíbe consultar antes de una oferta condicional",
            "detail": "La Ley de Detección de Antecedentes Penales Justos para Vivienda de DC (D.C. Code § 42-3505.08, 2016) prohíbe a los propietarios preguntar sobre antecedentes penales hasta después de hacer una oferta condicional de arrendamiento. Tras la oferta condicional, los propietarios solo pueden considerar ciertos delitos con evaluación individualizada. El DC también sigue las reglas federales del HUD para vivienda pública — aviso por escrito y oportunidad de audiencia de queja antes de cualquier desalojo.",
            "source": "D.C. Code § 42-3505.08; HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo",
            "detail": "El D.C. Code § 47-2853.17 (2019) exige que las juntas de licencias del DC apliquen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas del DC exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables, salvo que las reglas específicas de la junta lo requieran.",
            "source": "D.C. Code § 47-2853.17 (2019)"
          }
        },
        "FL": {
          "stateName": "Florida",
          "housing": {
            "headline": "Las PHA siguen las reglas de aviso del HUD; algunos condados tienen protecciones locales adicionales",
            "detail": "Las autoridades de vivienda de Florida siguen los requisitos mínimos federales del HUD (aviso por escrito y oportunidad de audiencia de queja). Florida no tiene una ley estatal de vivienda de oportunidad justa. Las ordenanzas locales en Miami-Dade y otros condados pueden ofrecer derechos procesales adicionales. Comuníquese con su autoridad de vivienda tan pronto como tenga conocimiento de cualquier acción — las demoras dificultan las apelaciones.",
            "source": "HUD 24 C.F.R. § 966.4; Fla. Stat. § 760.23"
          },
          "license": {
            "headline": "La mayoría de las juntas de FL exigen informar dentro de 30 días de la condena o declaración",
            "detail": "El Estatuto de Florida § 456.0635 rige a los profesionales de la salud con licencia y exige informar ciertas acciones penales. La mayoría de las juntas de licencias de Florida exigen autoinformar una condena, declaración de culpabilidad o de no impugnación (no contest) dentro de 30 días. Los arrestos sin condena generalmente no son informables, salvo que el estatuto específico de la junta lo exija. No informar es en sí mismo un motivo separado de sanción disciplinaria.",
            "source": "Fla. Stat. §§ 456.0635, 456.072(1)(c)"
          }
        },
        "GA": {
          "stateName": "Georgia",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; solicite la audiencia administrativa generalmente dentro de 10 a 14 días del aviso",
            "detail": "Las autoridades de vivienda de Georgia siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Georgia no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Si fue arrestado y enfrenta una terminación de contrato por actividad delictiva, el plazo para solicitar la audiencia administrativa es generalmente de 10 a 14 días. Comuníquese con su autoridad de vivienda de inmediato.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; estándar de relación directa (2021)",
            "detail": "La O.C.G.A. § 43-1-19 (modificada en 2021) exige que las juntas de licencias apliquen un estándar de 'relación directa' antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Georgia exigen autoinformar una condena final dentro de 30 días. Un arresto sin condena generalmente no es informable, salvo que las reglas específicas de la junta indiquen lo contrario.",
            "source": "O.C.G.A. § 43-1-19 (modificada en 2021)"
          }
        },
        "HI": {
          "stateName": "Hawái",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Hawái siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Hawái no tiene una ley estatal de vivienda de oportunidad justa específicamente para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere nexo para la denegación",
            "detail": "La Haw. Rev. Stat. § 831-3.1 exige que las juntas de licencias apliquen una evaluación individualizada antes de denegar una licencia por antecedentes penales. Hawái es uno de los estados pioneros en requerir una determinación de nexo. La mayoría de las juntas de Hawái exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Haw. Rev. Stat. § 831-3.1"
          }
        },
        "ID": {
          "stateName": "Idaho",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Idaho siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Idaho no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2020)",
            "detail": "El Idaho Code § 67-9406 (HB 357, 2020) exige que las juntas de licencias realicen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Idaho exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Idaho Code § 67-9406 (HB 357, 2020)"
          }
        },
        "IL": {
          "stateName": "Illinois",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; Chicago y el Condado de Cook tienen protecciones de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Illinois siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Chicago (RLTO § 5-12-170) y el Condado de Cook (Enmienda de Vivienda Justa, 2020) restringen el uso de antecedentes penales en decisiones de arrendamiento sin evaluación individualizada. No existe ley estatal para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato.",
            "source": "HUD 24 C.F.R. § 966.4; Chicago RLTO § 5-12-170; Cook County Just Housing Amendment (2020)"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la Ley de Licencias Justas (2021)",
            "detail": "La Ley de Licencias Justas para Ciudadanos que Regresan de Illinois (SB 1814, 2021) exige que las juntas de licencias apliquen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Illinois exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "IL Fair Licensure for Returned Citizens Act (SB 1814, 2021); 225 ILCS 450/2"
          }
        },
        "IN": {
          "stateName": "Indiana",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Indiana siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Indiana no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere evaluación individualizada (2020)",
            "detail": "El Ind. Code § 25-1-1.2-5 (HEA 1059, 2020) exige que las juntas de licencias realicen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Indiana exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Ind. Code § 25-1-1.2-5 (HEA 1059, 2020)"
          }
        },
        "IA": {
          "stateName": "Iowa",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Iowa siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Iowa no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere nexo (2020)",
            "detail": "El Iowa Code § 272C.2(2) (2020) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Iowa exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Iowa Code § 272C.2(2) (2020)"
          }
        },
        "KS": {
          "stateName": "Kansas",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Kansas siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Kansas no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2020)",
            "detail": "El Kan. Stat. Ann. § 74-120 (SB 367, 2020) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Kansas exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Kan. Stat. Ann. § 74-120 (SB 367, 2020)"
          }
        },
        "KY": {
          "stateName": "Kentucky",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Kentucky siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Kentucky no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2020)",
            "detail": "El Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020) exige que las juntas de licencias realicen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Kentucky exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020)"
          }
        },
        "LA": {
          "stateName": "Luisiana",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Luisiana siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Luisiana no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "La La. Rev. Stat. § 37:2950 (HB 707, 2021) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Luisiana exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "La. Rev. Stat. § 37:2950 (HB 707, 2021)"
          }
        },
        "ME": {
          "stateName": "Maine",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Maine siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Maine no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La Me. Rev. Stat. tit. 32 § 13862-A (2019) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Maine exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Me. Rev. Stat. tit. 32 § 13862-A (2019)"
          }
        },
        "MD": {
          "stateName": "Maryland",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; la ciudad de Baltimore tiene una ordenanza de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Maryland siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. La ciudad de Baltimore tiene una ordenanza de vivienda de oportunidad justa que restringe cómo los propietarios pueden usar los antecedentes penales. No existe ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "El Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Maryland exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019)"
          }
        },
        "MA": {
          "stateName": "Massachusetts",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; la reforma CORI limita cuándo los propietarios pueden preguntar sobre antecedentes penales",
            "detail": "Las autoridades de vivienda de Massachusetts siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. La reforma CORI estatal (M.G.L. c. 151B) restringe cuándo los propietarios con 6 o más unidades pueden preguntar sobre antecedentes penales. Boston tiene una ordenanza de vivienda de oportunidad justa. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; M.G.L. c. 151B § 4(9)"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la Ley de Reforma de Justicia Penal (2018)",
            "detail": "La M.G.L. c. 6A § 18M (Ley de Reforma de Justicia Penal, 2018) exige que las juntas de licencias apliquen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Massachusetts exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables bajo la reforma CORI.",
            "source": "M.G.L. c. 6A § 18M; M.G.L. c. 151B § 4(9½) (CORI Reform Act)"
          }
        },
        "MI": {
          "stateName": "Michigan",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Michigan siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Michigan no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2018)",
            "detail": "El MCL § 338.41 et seq. (enmiendas al Código Ocupacional, 2018) exige que las juntas de licencias apliquen una evaluación individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Michigan exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "MCL § 338.41 et seq. (Occupational Code amendments, 2018)"
          }
        },
        "MN": {
          "stateName": "Minnesota",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; Minneapolis y St. Paul restringen consultas sobre antecedentes penales en solicitudes",
            "detail": "Las autoridades de vivienda de Minnesota siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Minneapolis y St. Paul tienen ordenanzas de vivienda de oportunidad justa que prohíben consultar antecedentes penales en solicitudes de arrendamiento antes de una oferta condicional. No existe ley estatal para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; Minneapolis Fair Chance in Housing Ordinance (2020)"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se aplica el estándar de relación directa",
            "detail": "La Minn. Stat. § 364.03 exige que las juntas de licencias apliquen un estándar de 'relación directa' antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Minnesota exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Minn. Stat. § 364.03"
          }
        },
        "MS": {
          "stateName": "Misisipi",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Misisipi siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Misisipi no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados ni una reforma estatal de nexo en licencias ocupacionales. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; las juntas tienen amplia discreción",
            "detail": "Misisipi no tiene una ley estatal de reforma de nexo en licencias ocupacionales a partir de 2026. La mayoría de las juntas de licencias de Misisipi exigen autoinformar una condena final dentro de 30 días. Las juntas tienen amplia discreción para denegar una licencia por antecedentes penales. Consulte a un abogado si una junta amenaza con una acción disciplinaria.",
            "source": "Miss. Code Ann. § 73-1-1 et seq."
          }
        },
        "MO": {
          "stateName": "Misuri",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Misuri siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Misuri no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "La Mo. Rev. Stat. § 324.011 (SB 262, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Misuri exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Mo. Rev. Stat. § 324.011 (SB 262, 2021)"
          }
        },
        "MT": {
          "stateName": "Montana",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Montana siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Montana no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "La Mont. Code Ann. § 37-1-203 (SB 212, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Montana exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Mont. Code Ann. § 37-1-203 (SB 212, 2021)"
          }
        },
        "NE": {
          "stateName": "Nebraska",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Nebraska siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Nebraska no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Nebraska exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021)"
          }
        },
        "NV": {
          "stateName": "Nevada",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Nevada siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Nevada no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere nexo (2017)",
            "detail": "El NRS § 622A.300 (AB 384, 2017) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Nevada exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "NRS § 622A.300 (AB 384, 2017)"
          }
        },
        "NH": {
          "stateName": "Nuevo Hampshire",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Nuevo Hampshire siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Nuevo Hampshire no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "La N.H. Rev. Stat. Ann. § 332-G:8 (2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Nuevo Hampshire exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "N.H. Rev. Stat. Ann. § 332-G:8 (2021)"
          }
        },
        "NJ": {
          "stateName": "Nueva Jersey",
          "housing": {
            "headline": "Ley de Vivienda de Oportunidad Justa de NJ (2021) — los propietarios no pueden preguntar sobre antecedentes penales antes de una oferta condicional",
            "detail": "La Ley de Vivienda de Oportunidad Justa estatal de Nueva Jersey (N.J. Stat. Ann. § 46:8-52 et seq., vigente desde 2022) prohíbe a los propietarios preguntar sobre antecedentes penales hasta después de hacer una oferta condicional de arrendamiento. Tras la oferta condicional, los propietarios deben aplicar una evaluación individualizada. Las autoridades de vivienda de Nueva Jersey también siguen las reglas federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes de cualquier desalojo de vivienda pública.",
            "source": "N.J. Stat. Ann. § 46:8-52 et seq. (Fair Chance in Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El N.J. Stat. Ann. § 45:1-21.1 (2021) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Nueva Jersey exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "N.J. Stat. Ann. § 45:1-21.1 (2021)"
          }
        },
        "NM": {
          "stateName": "Nuevo México",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Nuevo México siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Nuevo México no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La NMSA 1978 § 61-1-34 (2019) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Nuevo México exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "NMSA 1978 § 61-1-34 (2019)"
          }
        },
        "NY": {
          "stateName": "Nueva York",
          "housing": {
            "headline": "NYCHA da aviso de 30 días; usted tiene 10 días para solicitar una audiencia de queja",
            "detail": "La Autoridad de Vivienda de la Ciudad de Nueva York (NYCHA) debe entregar un aviso por escrito de terminación del contrato de arrendamiento al menos 30 días antes de la fecha de terminación. Un miembro del hogar tiene 10 días desde la recepción para solicitar una audiencia de queja. La Ley de Corrección de Nueva York, Artículo 23-A, también limita a los propietarios privados de negar vivienda por antecedentes penales sin una revisión individualizada.",
            "source": "NYCHA Grievance Procedures; N.Y. Correction Law §§ 750–754; N.Y. Exec. Law § 296(16)"
          },
          "license": {
            "headline": "Se aplica el Art. 23-A de la Ley de Corrección de NY; la mayoría de las juntas exigen informar dentro de 30 días de la condena",
            "detail": "El Artículo 23-A de la Ley de Corrección de Nueva York prohíbe la denegación automática de una licencia profesional basada únicamente en una condena previa. Las juntas deben aplicar una prueba de equilibrio de ocho factores. La mayoría de las juntas de licencias de NY exigen autoinformar una condena o adjudicación final dentro de 30 días. Un arresto sin condena generalmente no es informable, salvo que las reglas específicas de la junta indiquen lo contrario.",
            "source": "N.Y. Correction Law §§ 750–754"
          }
        },
        "NC": {
          "stateName": "Carolina del Norte",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Carolina del Norte siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Carolina del Norte no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "La N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Carolina del Norte exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021)"
          }
        },
        "ND": {
          "stateName": "Dakota del Norte",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Dakota del Norte siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Dakota del Norte no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Dakota del Norte exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021)"
          }
        },
        "OH": {
          "stateName": "Ohio",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Ohio siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Ohio no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se aplica el estándar de relación directa",
            "detail": "El Ohio Rev. Code Ann. § 9.79 (SB 255, 2012; ampliado por HB 263, 2021) exige que las juntas de licencias apliquen un estándar de 'relación directa' antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Ohio exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Ohio Rev. Code Ann. § 9.79 (SB 255, 2012; HB 263, 2021)"
          }
        },
        "OK": {
          "stateName": "Oklahoma",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Oklahoma siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Oklahoma no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "El Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Oklahoma exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019)"
          }
        },
        "OR": {
          "stateName": "Oregón",
          "housing": {
            "headline": "La Ley de Vivienda de Oportunidad Justa de Oregón (2021) restringe el uso de antecedentes penales a nivel estatal",
            "detail": "La Ley de Vivienda de Oportunidad Justa de Oregón (Or. Rev. Stat. § 90.303, vigente desde 2022) restringe cuándo los propietarios pueden usar antecedentes penales en decisiones de arrendamiento. Los propietarios no pueden preguntar sobre antecedentes penales hasta después de aceptar una solicitud de arrendamiento. Las autoridades de vivienda de Oregón también siguen las reglas federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes de cualquier desalojo de vivienda pública.",
            "source": "Or. Rev. Stat. § 90.303 (Fair Chance Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "La Or. Rev. Stat. § 676.612 (HB 2009, 2019) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Oregón exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Or. Rev. Stat. § 676.612 (HB 2009, 2019)"
          }
        },
        "PA": {
          "stateName": "Pensilvania",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; Filadelfia tiene una ordenanza de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Pensilvania siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Filadelfia tiene una ordenanza de vivienda de oportunidad justa que restringe cuándo los propietarios pueden usar antecedentes penales. No existe ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; 18 Pa. C.S. § 9125"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se requiere nexo (2020)",
            "detail": "El 63 Pa. C.S. § 3113 (SB 637, 2020) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Pensilvania exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "63 Pa. C.S. § 3113 (SB 637, 2020)"
          }
        },
        "RI": {
          "stateName": "Rhode Island",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Rhode Island siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Rhode Island no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2022)",
            "detail": "El R.I. Gen. Laws § 5-76-2 (2022) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Rhode Island exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "R.I. Gen. Laws § 5-76-2 (2022)"
          }
        },
        "SC": {
          "stateName": "Carolina del Sur",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Carolina del Sur siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Carolina del Sur no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados ni una reforma estatal de nexo en licencias ocupacionales. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; las juntas tienen amplia discreción",
            "detail": "Carolina del Sur no tiene una ley estatal de reforma de nexo en licencias ocupacionales a partir de 2026. La mayoría de las juntas de licencias de Carolina del Sur exigen autoinformar una condena final dentro de 30 días. Las juntas tienen amplia discreción para denegar una licencia por antecedentes penales. Consulte a un abogado si una junta amenaza con una acción disciplinaria.",
            "source": "S.C. Code Ann. § 40-1-110 et seq."
          }
        },
        "SD": {
          "stateName": "Dakota del Sur",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Dakota del Sur siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Dakota del Sur no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El SDCL § 36-2A-9 (SB 72, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Dakota del Sur exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "SDCL § 36-2A-9 (SB 72, 2021)"
          }
        },
        "TN": {
          "stateName": "Tennessee",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Tennessee siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Tennessee no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "El Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Tennessee exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019)"
          }
        },
        "TX": {
          "stateName": "Texas",
          "housing": {
            "headline": "Las PHA generalmente dan aviso por escrito de 14 días según las reglas del HUD; no existe una ley estatal de oportunidad justa",
            "detail": "Las autoridades de vivienda de Texas siguen los requisitos mínimos de aviso del HUD federal. La mayoría entrega un aviso por escrito de 14 días antes de una terminación del contrato relacionada con actividad delictiva. Texas no tiene una ley estatal de vivienda de oportunidad justa, por lo que el plan administrativo de cada PHA rige los casos discrecionales. Comuníquese con su autoridad de vivienda lo antes posible después de un arresto — antes de que se emita cualquier aviso formal.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de una condena final",
            "detail": "El Código de Ocupaciones de Texas, Capítulo 53, prohíbe la denegación automática de una licencia por una condena previa. Las juntas deben aplicar una prueba de equilibrio de siete factores. La mayoría de las juntas de licencias de Texas (médica, enfermería, docencia) exigen autoinformar una condena dentro de 30 días después de que sea firme. Un arresto por sí solo generalmente no es un evento informable, salvo que el estatuto específico de la junta lo indique.",
            "source": "Tex. Occ. Code §§ 53.021–53.025"
          }
        },
        "UT": {
          "stateName": "Utah",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Utah siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Utah no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2020)",
            "detail": "El Utah Code Ann. § 58-1-304 (SB 34, 2020) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Utah exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Utah Code Ann. § 58-1-304 (SB 34, 2020)"
          }
        },
        "VT": {
          "stateName": "Vermont",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Vermont siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Vermont no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2019)",
            "detail": "El 26 V.S.A. § 3105 (2019) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Vermont exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "26 V.S.A. § 3105 (2019)"
          }
        },
        "VA": {
          "stateName": "Virginia",
          "housing": {
            "headline": "Las PHA siguen las reglas del HUD; algunas localidades tienen protecciones de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Virginia siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Algunas localidades de Virginia (incluida Alejandría) tienen protecciones de vivienda de oportunidad justa para propietarios privados. No existe ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto.",
            "source": "HUD 24 C.F.R. § 966.4; Va. Code Ann. § 36-96.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El Va. Code Ann. § 54.1-204 (SB 1127, 2021) exige que las juntas de licencias apliquen una evaluación de nexo individualizada antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Virginia exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Va. Code Ann. § 54.1-204 (SB 1127, 2021)"
          }
        },
        "WA": {
          "stateName": "Washington",
          "housing": {
            "headline": "La Ley de Vivienda de Oportunidad Justa de WA (2018) restringe el uso de antecedentes penales a nivel estatal",
            "detail": "La Ley de Vivienda de Oportunidad Justa de Washington (RCW 59.18.580, vigente desde 2018) restringe cuándo los propietarios pueden usar antecedentes penales en decisiones de arrendamiento. Aplica a propietarios con 3 o más unidades en las jurisdicciones aplicables; Seattle tiene protecciones más amplias. Las autoridades de vivienda de Washington también siguen las reglas federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes de cualquier desalojo de vivienda pública.",
            "source": "RCW 59.18.580 (Fair Chance Housing Act, 2018); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El RCW 18.185.020 (SB 5046, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Washington exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "RCW 18.185.020 (SB 5046, 2021)"
          }
        },
        "WV": {
          "stateName": "Virginia Occidental",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Virginia Occidental siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Virginia Occidental no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El W. Va. Code § 30-1-7a (SB 97, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Virginia Occidental exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "W. Va. Code § 30-1-7a (SB 97, 2021)"
          }
        },
        "WI": {
          "stateName": "Wisconsin",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa para propietarios privados",
            "detail": "Las autoridades de vivienda de Wisconsin siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Wisconsin no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; se aplica el estándar de relación sustancial",
            "detail": "La Wis. Stat. § 111.335 (modificada en 2016) exige que las juntas de licencias apliquen un estándar de 'relación sustancial' antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Wisconsin exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Wis. Stat. § 111.335 (amended 2016)"
          }
        },
        "WY": {
          "stateName": "Wyoming",
          "housing": {
            "headline": "Las PHA siguen las reglas federales del HUD; no existe ley estatal de vivienda de oportunidad justa",
            "detail": "Las autoridades de vivienda de Wyoming siguen los requisitos mínimos federales del HUD — aviso por escrito y oportunidad de audiencia de queja antes del desalojo. Wyoming no tiene una ley estatal de vivienda de oportunidad justa para propietarios privados. Comuníquese con su autoridad de vivienda de inmediato tras cualquier arresto; el plan administrativo de cada PHA rige los casos discrecionales.",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "La mayoría de las juntas exigen informar dentro de 30 días de la condena; rige la reforma de nexo (2021)",
            "detail": "El Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021) exige que las juntas de licencias apliquen una prueba de nexo antes de denegar una licencia por antecedentes penales. La mayoría de las juntas de Wyoming exigen autoinformar una condena final dentro de 30 días. Los arrestos sin condena generalmente no son informables.",
            "source": "Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021)"
          }
        }
      }
    },
    "stateRules": {
      "heading": "Leyes de {{stateName}}",
      "subheading": "Estas reglas aplican después de una condena, no solo por un arresto. Verificadas con fuentes primarias.",
      "voting": "Derecho al voto",
      "btb": "Contratación (Bandera roja eliminada)",
      "benefits": "Prohibición por condena de drogas (SNAP/TANF)",
      "housing": "Ley de vivienda justa",
      "verifiedOn": "Verificado {{date}}",
      "mediumConfidenceNote": "Basado en fuentes secundarias — confirme con el estatuto vigente antes de depender de esto.",
      "noStateData": "Los datos específicos para su estado aún no están en nuestra base de datos. Visite ccresourcecenter.org para las reglas actuales.",
      "votingStatus": {
        "incarcerated": "Puede votar mientras está encarcelado",
        "on_release": "Se restaura al ser liberado",
        "parole_complete": "Se restaura tras la libertad condicional",
        "supervision_complete": "Debe completar toda la supervisión",
        "waiting_period": "Período de espera después de la supervisión",
        "application_required": "Se requiere solicitud",
        "permanent_bar": "Prohibición permanente (algunos delitos)"
      },
      "btbStatus": {
        "private_also": "Aplica a todos los empleadores",
        "public_only": "Solo empleadores públicos",
        "none": "Sin ley estatal"
      },
      "snapStatus": {
        "no_ban": "Sin prohibición por condena de drogas",
        "modified": "Restricciones parciales aplican",
        "full_ban": "Prohibición de por vida para delitos graves de drogas"
      },
      "housingStatus": {
        "yes": "Ley estatal de vivienda justa",
        "no": "Sin ley estatal (aplican reglas federales)"
      }
    }
  },
  "zh": {
    "badge": "逮捕阶段",
    "pageTitle": "逮捕阶段风险筛查",
    "pageDesc": "逮捕可能立即对住房、就业和其他重要方面产生影响，甚至在定罪之前。回答7个简短的是否问题，了解现在需要关注什么。",
    "qOf": "第 {{n}} 题，共 {{total}} 题",
    "yes": "是",
    "no": "否",
    "back": "返回",
    "resultsTitle": "您的风险摘要",
    "resultsDesc": "根据您的回答，这些方面可能面临直接风险。最紧急的事项排在最前面。",
    "noRiskTitle": "未发现活跃风险",
    "noRiskDesc": "根据您的回答，我们筛查的民事系统中没有一项因本次逮捕而面临直接风险。这并不涵盖所有可能的后果。请与您的律师讨论您的具体情况。",
    "whatLabel": "什么处于风险中",
    "timelineLabel": "时间表",
    "actionLabel": "最佳做法",
    "disclaimer": "这些结果仅为初步风险提示，不构成法律认定。实际后果是否适用取决于您的具体指控、司法管辖区及案件结果。",
    "generalInfo": "仅为一般信息，不构成法律建议。如需针对您具体情况的建议，请咨询合格律师。",
    "copyBtn": "复制摘要",
    "copiedBtn": "已复制",
    "printBtn": "打印",
    "restart": "重新开始",
    "backToHub": "返回倡导者中心",
    "privacyStrip": "此工具不存储您的任何回答。所有处理仅在您的设备上本地完成。",
    "printHeading": "逮捕阶段风险摘要",
    "printDate": "生成日期: {{date}}",
    "printNoRisk": "根据您的回答，未发现活跃风险。",
    "printTimeline": "时间：",
    "printAction": "最佳做法：",
    "printDisclaimer": "这些结果仅为初步风险提示，不构成法律认定。实际后果是否适用取决于您的具体指控、司法管辖区及案件结果。仅为一般信息，不构成法律建议。如需针对您具体情况的建议，请咨询合格律师。",
    "questions": {
      "housing": {
        "question": "您是否在租房，或居住于补贴住房或第八章住房？",
        "sub": "包括公共住房、第八章住房券或任何政府补贴租房。"
      },
      "employment": {
        "question": "您目前有工作吗？",
        "sub": "包括全职、兼职、零工或任何有报酬的工作。"
      },
      "immigration": {
        "question": "您家中是否有人不是美国公民或永久居民？",
        "sub": "包括持签证者、DACA受益人、无证件者以及其他持临时身份者。",
        "privacyNote": "此答案从不存储或传输，仅在您的浏览器中运行。"
      },
      "benefits": {
        "question": "您是否在领取联邦福利？",
        "sub": "包括SNAP、SSI、SSDI、Medicaid、第八章、TANF或其他联邦援助项目。"
      },
      "children": {
        "question": "您是否有未成年子女需要照顾？",
        "sub": "包括您拥有监护权或担任主要照顾者的子女。"
      },
      "supervision": {
        "question": "您目前是否处于缓刑或假释期间？",
        "sub": "包括任何有效的监督令、有条件释放或社区监督令。"
      },
      "license": {
        "question": "您是否持有职业或执业许可证？",
        "sub": "包括护理、教学、承包商、保安、房地产及其他持证职业。"
      }
    },
    "chargeType": {
      "heading": "这个案件涉及哪类指控？",
      "sub": "这有助于我们识别与您情况最相关的后果。您的回答不会被存储。",
      "skip": "跳过——我还不确定",
      "options": {
        "dui": "醉驾 / 驾驶能力受损",
        "drug_possession": "毒品持有或使用",
        "drug_trafficking": "毒品销售、分发或贩运",
        "theft_property": "盗窃、入室行窃或财产犯罪",
        "domestic_violence": "家庭暴力或人身侵害",
        "sex_offense": "性犯罪",
        "other": "其他 / 未列出"
      }
    },
    "risks": {
      "supervision": {
        "title": "缓刑或假释违规风险",
        "what": "无论本案结果如何，新的逮捕都会自动触发监督违规。在您见到法官之前就可能被拘留，且可能在刑事案件解决之前安排单独的撤销听证会。",
        "clock": "您的监督官员通常在登记后24小时内收到通知，在保释听证会之前就可能被拘留。",
        "action": "尽早告知辩护律师您的监督状态是首要任务。大多数律师建议，在先与辩护律师沟通之前，不要联系监督官员。",
        "linkLabel": "获取案件指导"
      },
      "immigration": {
        "title": "移民和ICE羁押令风险",
        "what": "ICE可以对在本地监狱登记的任何非公民发出羁押令，要求监狱在其获释日期后最多48小时内继续关押，以便ICE接管。刑事指控或定罪还可能影响签证身份、绿卡资格并产生驱逐依据。",
        "clock": "ICE羁押令可在登记后数小时内发出，这是逮捕后发展最快的后果之一。",
        "action": "尽快联系移民律师，在任何认罪讨论之前。刑事指控和移民后果必须一起评估。",
        "linkLabel": "移民指导"
      },
      "children": {
        "title": "儿童福利和监护权风险",
        "what": "执法部门可以在逮捕时通知儿童保护服务机构，特别是当有儿童在场或您是唯一照顾者时。在任何定罪之前，开放的CPS调查就可能影响监护安排和亲权。",
        "clock": "CPS可以在逮捕时收到通知。如果儿童无人照管，当天即可进行紧急安置。",
        "action": "如果存在被关押的可能，提前安排受信任的成年人照看孩子非常重要。记录现有的监护安排，并在CPS联系时寻求律师帮助，这些都是通常建议的步骤。",
        "linkLabel": "儿童照顾支持"
      },
      "housing": {
        "title": "住房和驱逐风险",
        "what": "公共住房管理机构和第八章计划可以仅凭逮捕（在任何定罪之前）开始驱逐程序。联邦一次违规即驱逐规则赋予住房管理机构广泛权力。私人房东的租约中也可能有将逮捕视为违约的条款。",
        "clock": "公共住房管理机构可以在逮捕后几天内开始程序。请立即查看您的租约。",
        "action": "查看您的租约中关于逮捕或犯罪活动的条款。如果您住在公共住房或使用第八章住房券，请在住房管理机构联系您之前咨询住房律师。",
        "linkLabel": "住房支持"
      },
      "employment": {
        "title": "就业风险",
        "what": "随意雇佣关系的雇主可以在逮捕后（即使没有定罪）终止雇佣。某些工作要求员工在规定天数内向人力资源部门报告逮捕情况。需要安全许可或与弱势群体合作的职位面临最高的停职风险。",
        "clock": "没有固定的时间限制。随意雇佣的雇主可以立即采取行动。查看您的劳动合同了解逮捕报告要求。",
        "action": "查看劳动合同和员工手册了解逮捕报告义务是良好的第一步。大多数律师建议，在咨询律师之前，不要主动向雇主提供信息。",
        "linkLabel": "就业支持"
      },
      "benefits": {
        "title": "联邦福利风险",
        "what": "某些联邦福利计划要求您报告逮捕情况。对某些罪行（特别是毒品罪行）的定罪可能导致自动取消SNAP和联邦学生援助等项目的资格。在某些州，重罪定罪可能触发终身禁止SNAP的规定。",
        "clock": "报告要求因计划而异。某些计划要求在逮捕后10天内通知。联系您的案例工作者了解您的具体义务。",
        "action": "联系您的福利案例工作者了解报告义务。询问您的律师，您面临的指控是否会自动产生福利后果。",
        "linkLabel": "财务支持"
      },
      "license": {
        "title": "职业许可证风险",
        "what": "许多许可委员会要求持证人在30天内报告逮捕情况，并可在案件结果出来之前暂停许可证。风险最高的领域包括护理、教学、法律、房地产、承包、安保工作以及任何需要背景调查才能续证的职业。",
        "clock": "大多数许可委员会要求在逮捕后30天内报告。某些委员会在收到通知后立即采取行动。查看您委员会的具体规定。",
        "action": "查阅您的许可委员会关于逮捕报告的规定。在向委员会报告之前，联系处理职业许可事务的律师。",
        "linkLabel": "寻找法律帮助"
      },
      "driverLicense": {
        "title": "驾驶执照吊销风险",
        "what": "DUI（醉驾）和许多毒品相关定罪会通过两个独立途径自动触发驾驶执照吊销：一是与逮捕挂钩的行政（DMV）吊销，二是与定罪挂钩的刑事法庭吊销。两者可以同时进行。大多数州允许在吊销期间申请限制性或困难豁免驾照用于工作和就医，但您必须迅速行动——行政吊销的申请窗口可能在逮捕后数天内关闭。",
        "clock": "在大多数州，行政执照吊销在逮捕后30至60天内自动生效，除非您申请DMV听证，通常须在收到逮捕通知后5至30天内提出。未能在截止日期内申请听证意味着您放弃了对行政吊销提出异议的权利。",
        "action": "请立即要求您的律师代您提交DMV听证申请——不要等待庭审日期。同时询问关于限制性或困难豁免驾照的选项，以及点火锁定装置是否可以让您在吊销期间继续驾车。",
        "linkLabel": "交通与驾照帮助"
      },
      "driverLicenseCheck": {
        "title": "驾驶执照——请核实您所在的州",
        "what": "部分州（包括CA、FL、IL、MA和TX）即使在毒品定罪中未涉及车辆，也会自动吊销驾驶执照。其他州则不会。是否适用取决于您被定罪所在的州。",
        "clock": "如果您所在的州确实要求吊销，通常在宣判时或定罪后不久生效。在判决作出前采取行动可以为您争取更多选择。",
        "action": "请明确向您的律师询问：您所在的州是否会因此类毒品定罪吊销驾驶执照，以及是否有限制性驾照或困难豁免驾照可供申请。在未确认所在州规定之前，请勿假设您的驾照安全，也请勿假设其处于风险之中。",
        "linkLabel": "交通与驾照帮助"
      },
      "sexOffender": {
        "title": "性犯罪者登记风险",
        "what": "某些定罪可能要求进行性犯罪者登记。是否需要登记、登记期限、公开披露及居住限制，取决于具体罪名、司法辖区和个人情况。仅被指控并不意味着这些后果必然适用。",
        "clock": "登记和更新信息的期限各不相同。请及时向律师及登记机关确认适用义务。不履行义务可能构成另一项犯罪；其分类以及是否承担联邦责任取决于法律和具体事实。",
        "action": "接受认罪协议前，请向律师询问是否需要登记、如何确定等级、最低期限、报告义务以及能否申请终止登记。完成最低期限并不一定自动终止登记义务。",
        "linkLabel": "寻找法律帮助"
      }
    },
    "stateDeadlines": {
      "selectorLabel": "查看各州具体截止日期",
      "selectorPlaceholder": "选择州以查看当地截止日期",
      "calloutHeading": "{{stateName}} — 当地规定",
      "calloutSource": "来源：{{source}}",
      "calloutNote": "仅供一般指导。在依赖此信息之前，请向持牌律师核实。",
      "entries": {
        "federal": {
          "stateName": "联邦（HUD／联邦规定）",
          "housing": {
            "headline": "公共住房管理机构（PHA）必须提供书面通知并给予申诉听证的机会",
            "detail": "联邦HUD规定要求对少数几类犯罪（在联邦资助住房中与毒品相关的定罪、在房产内制造甲基苯丙胺、终身性犯罪登记者）强制终止租约。对于其他所有犯罪行为，住房管理机构拥有自由裁量权。无论哪种情况，PHA在驱逐程序进行之前都必须提供书面通知，并允许您申请申诉听证。",
            "source": "24 C.F.R. § 966.4(l)(3); 42 U.S.C. § 1437d"
          },
          "license": {
            "headline": "没有统一的联邦报告期限——请查看您具体执照或安全许可的相关条款",
            "detail": "各联邦机构和发证机构都有各自的报告规定。安全许可和许多联邦执照通常要求在被捕后5至30天内自行报告。未能按要求报告可能被视为另一项独立违规。请立即查阅您的具体文件规定。"
          }
        },
        "AL": {
          "stateName": "阿拉巴马州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "阿拉巴马州住房管理机构遵循联邦HUD最低要求——提供写明具体理由的书面租约终止通知，并赋予申请申诉听证的权利。阿拉巴马州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构，在正式通知发出前了解该PHA的具体行政计划。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2019年起适用关联性审查改革",
            "detail": "阿拉巴马州HB 244（2019年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数阿拉巴马州委员会要求在定罪或认罪后30天内自行报告。仅被捕通常不属于需要报告的事件，除非该委员会的规定另有要求。",
            "source": "Ala. Code § 41-22-1 et seq.; HB 244 (2019)"
          }
        },
        "AK": {
          "stateName": "阿拉斯加州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "阿拉斯加州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。阿拉斯加州没有针对私人房东的统一公平机会住房法。如收到与犯罪活动相关的住房通知，请尽快申请申诉听证——通常须在收到通知后10至14天内提出。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；拒绝发证须有关联性依据",
            "detail": "《阿拉斯加法规》第08.01.075条禁止发证委员会在未作关联性认定的情况下仅因既往定罪而拒绝发证。大多数阿拉斯加委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告，除非该委员会的具体规定另有要求。",
            "source": "Alaska Stat. § 08.01.075"
          }
        },
        "AZ": {
          "stateName": "亚利桑那州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "亚利桑那州住房管理机构遵循联邦HUD最低要求——提供写明具体理由的书面租约终止通知，并赋予申请申诉听证的权利。亚利桑那州没有针对私人房东的统一公平机会住房法。请在被捕后尽快联系您的住房管理机构，在正式通知发出前采取行动。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《亚利桑那州修订法规》第41-1093条等（2019年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估并适用关联性测试。大多数亚利桑那州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Ariz. Rev. Stat. § 41-1093 et seq. (2019)"
          }
        },
        "AR": {
          "stateName": "阿肯色州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "阿肯色州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。阿肯色州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2019年起要求关联性审查",
            "detail": "《阿肯色州法典注释》第17-1-103条（2019年）要求发证委员会在拒绝发证前考量定罪是否与职业直接相关。大多数阿肯色州委员会要求在最终定罪后30天内自行报告。仅被捕通常不属于需要报告的事件。",
            "source": "Ark. Code Ann. § 17-1-103 (2019)"
          }
        },
        "CA": {
          "stateName": "加利福尼亚州",
          "housing": {
            "headline": "PHA必须提前14天发出书面通知；您可以申请申诉听证",
            "detail": "加利福尼亚州的住房管理机构必须提供租约终止的书面通知及具体理由。您有权申请申诉听证，通常须在收到通知后10至14天内提出。洛杉矶和旧金山还设有额外的地方公平机会住房保护规定，要求在采取任何与犯罪记录相关的住房行动前进行个案评估。",
            "source": "HUD 24 C.F.R. § 966.4; Cal. Gov. Code § 12955"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内自行报告——被捕本身通常不需要",
            "detail": "《加州商业与职业法典》第490条禁止仅因既往定罪而拒绝发放执照；相关委员会必须进行个案评估。大多数加州委员会（护理：Cal. B&P § 2762；教育：Ed. Code § 44009；承包商：Cal. B&P § 7069）要求在定罪或认罪后30天内报告。仅被捕通常不会触发强制报告，除非该委员会的具体规定另有要求。",
            "source": "Cal. Bus. & Prof. Code §§ 490, 2762; Ed. Code § 44009"
          }
        },
        "CO": {
          "stateName": "科罗拉多州",
          "housing": {
            "headline": "PHA遵循HUD通知规定；丹佛设有公平机会住房条例",
            "detail": "科罗拉多州住房管理机构遵循联邦HUD最低要求——书面通知及申诉听证机会。丹佛《公平机会住房条例》（2022年1月起生效）禁止房东在发出有条件租房邀约前询问犯罪记录。丹佛以外，科罗拉多州尚无针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; Denver Ord. 21-1370"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《科罗拉多州修订法规》第24-34-101条等（HB 19-1275，2019年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估并适用关联性测试。大多数科罗拉多州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Colo. Rev. Stat. § 24-34-101 et seq. (HB 19-1275, 2019)"
          }
        },
        "CT": {
          "stateName": "康涅狄格州",
          "housing": {
            "headline": "PHA遵循HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "康涅狄格州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。康涅狄格州没有针对私人房东的统一公平机会住房法，但部分市镇可能有地方性保护措施。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; Conn. Gen. Stat. § 46a-80"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用「合理关联」标准",
            "detail": "《康涅狄格州通用法规》第46a-80条要求发证委员会在因犯罪记录拒绝发证前适用「合理关联」标准。大多数康涅狄格州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告，除非该委员会的具体规定另有要求。",
            "source": "Conn. Gen. Stat. § 46a-80"
          }
        },
        "DE": {
          "stateName": "特拉华州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "特拉华州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。特拉华州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《特拉华州法典注释》第29编第8735(y)条（2019年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数特拉华州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Del. Code Ann. tit. 29 § 8735(y) (2019)"
          }
        },
        "DC": {
          "stateName": "哥伦比亚特区",
          "housing": {
            "headline": "DC《公平刑事记录筛查法》禁止在有条件邀约前询问犯罪记录",
            "detail": "DC《住房公平刑事记录筛查法》（《哥伦比亚特区法典》第42-3505.08条，2016年）禁止房东在发出有条件租房邀约前询问犯罪记录。发出有条件邀约后，房东只能针对特定罪行进行个案评估。哥伦比亚特区同样遵循联邦HUD公共住房规定——驱逐前须提供书面通知及申诉听证机会。",
            "source": "D.C. Code § 42-3505.08; HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用关联性审查改革",
            "detail": "《哥伦比亚特区法典》第47-2853.17条（2019年）要求DC发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数DC委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告，除非该委员会的具体规定另有要求。",
            "source": "D.C. Code § 47-2853.17 (2019)"
          }
        },
        "FL": {
          "stateName": "佛罗里达州",
          "housing": {
            "headline": "PHA遵循HUD的通知规定；部分县设有额外的地方保护措施",
            "detail": "佛罗里达州的住房管理机构遵循联邦HUD的最低要求（书面通知及申诉听证机会）。佛罗里达州没有统一的公平机会住房法。迈阿密-戴德县及其他一些县的地方法令可能提供额外的程序性权利。请在得知任何相关行动后尽快联系您的住房管理机构——拖延会使申诉更加困难。",
            "source": "HUD 24 C.F.R. § 966.4; Fla. Stat. § 760.23"
          },
          "license": {
            "headline": "大多数佛州委员会要求在定罪或认罪后30天内报告",
            "detail": "《佛罗里达州法规》第456.0635条适用于持证医疗从业人员，要求报告某些刑事行为。大多数佛罗里达州发证委员会要求在定罪、认罪或无异议抗辩（no contest）后30天内自行报告。除非该委员会的具体法规另有要求，未定罪的被捕通常不需要报告。未按要求报告本身即构成另一项独立的纪律处分理由。",
            "source": "Fla. Stat. §§ 456.0635, 456.072(1)(c)"
          }
        },
        "GA": {
          "stateName": "佐治亚州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；行政听证申请通常须在收到通知后10至14天内提出",
            "detail": "佐治亚州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。佐治亚州没有针对私人房东的统一公平机会住房法。若因犯罪活动面临租约终止，行政听证申请窗口通常为收到通知后10至14天。请立即联系您的住房管理机构，不要等待正式通知。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用直接关联标准（2021年）",
            "detail": "《佐治亚州官方法典注释》第43-1-19条（2021年修订）要求发证委员会在因犯罪记录拒绝发证前适用「直接关联」标准。大多数佐治亚州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告，除非该委员会的具体规定另有要求。",
            "source": "O.C.G.A. § 43-1-19 (amended 2021)"
          }
        },
        "HI": {
          "stateName": "夏威夷州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "夏威夷州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。夏威夷州没有专门针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；拒绝发证须有关联性依据",
            "detail": "《夏威夷修订法规》第831-3.1条要求发证委员会在因犯罪记录拒绝发证前进行个案评估。夏威夷是最早要求关联性认定的州之一。大多数夏威夷委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Haw. Rev. Stat. § 831-3.1"
          }
        },
        "ID": {
          "stateName": "爱达荷州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "爱达荷州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。爱达荷州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2020年关联性审查改革",
            "detail": "《爱达荷州法典》第67-9406条（HB 357，2020年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数爱达荷州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Idaho Code § 67-9406 (HB 357, 2020)"
          }
        },
        "IL": {
          "stateName": "伊利诺伊州",
          "housing": {
            "headline": "PHA遵循HUD规定；芝加哥和库克县设有公平机会住房保护措施",
            "detail": "伊利诺伊州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。芝加哥（RLTO第5-12-170条）和库克县（公平住房修正案，2020年）在未经个案评估的情况下限制房东将犯罪记录用于租房决定。该州尚无针对私人房东的统一法律。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; Chicago RLTO § 5-12-170; Cook County Just Housing Amendment (2020)"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用《公平发证法》（2021年）",
            "detail": "伊利诺伊州《回归公民公平发证法》（SB 1814，2021年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数伊利诺伊州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "IL Fair Licensure for Returned Citizens Act (SB 1814, 2021); 225 ILCS 450/2"
          }
        },
        "IN": {
          "stateName": "印第安纳州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "印第安纳州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。印第安纳州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2020年起要求个案评估",
            "detail": "《印第安纳州法典》第25-1-1.2-5条（HEA 1059，2020年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数印第安纳州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Ind. Code § 25-1-1.2-5 (HEA 1059, 2020)"
          }
        },
        "IA": {
          "stateName": "爱荷华州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "爱荷华州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。爱荷华州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2020年起要求关联性测试",
            "detail": "《爱荷华州法典》第272C.2(2)条（2020年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数爱荷华州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Iowa Code § 272C.2(2) (2020)"
          }
        },
        "KS": {
          "stateName": "堪萨斯州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "堪萨斯州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。堪萨斯州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2020年关联性审查改革",
            "detail": "《堪萨斯州法规注释》第74-120条（SB 367，2020年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数堪萨斯州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Kan. Stat. Ann. § 74-120 (SB 367, 2020)"
          }
        },
        "KY": {
          "stateName": "肯塔基州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "肯塔基州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。肯塔基州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2020年关联性审查改革",
            "detail": "《肯塔基州修订法规注释》第335B.010条等（SB 165，2020年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数肯塔基州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Ky. Rev. Stat. Ann. § 335B.010 et seq. (SB 165, 2020)"
          }
        },
        "LA": {
          "stateName": "路易斯安那州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "路易斯安那州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。路易斯安那州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《路易斯安那州修订法规》第37:2950条（HB 707，2021年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数路易斯安那州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "La. Rev. Stat. § 37:2950 (HB 707, 2021)"
          }
        },
        "ME": {
          "stateName": "缅因州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "缅因州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。缅因州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《缅因州修订法规》第32编第13862-A条（2019年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数缅因州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Me. Rev. Stat. tit. 32 § 13862-A (2019)"
          }
        },
        "MD": {
          "stateName": "马里兰州",
          "housing": {
            "headline": "PHA遵循HUD通知规定；巴尔的摩市设有公平机会住房条例",
            "detail": "马里兰州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。巴尔的摩市设有公平机会住房条例，限制房东使用犯罪记录的方式。该州尚无针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《马里兰州法典注释·商业职业与专业》第1-304条（SB 782，2019年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数马里兰州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Md. Code Ann., Bus. Occ. & Prof. § 1-304 (SB 782, 2019)"
          }
        },
        "MA": {
          "stateName": "马萨诸塞州",
          "housing": {
            "headline": "PHA遵循HUD规定；CORI改革限制房东询问犯罪记录的时机",
            "detail": "马萨诸塞州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。州CORI改革（《马萨诸塞州通用法》第151B章）限制拥有6套以上房屋的房东询问犯罪记录的时机。波士顿设有公平机会住房条例。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; M.G.L. c. 151B § 4(9)"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用《刑事司法改革法》（2018年）",
            "detail": "《马萨诸塞州通用法》第6A章第18M条（《刑事司法改革法》，2018年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数马萨诸塞州委员会要求在最终定罪后30天内自行报告。根据CORI改革，未定罪的被捕通常不需要报告。",
            "source": "M.G.L. c. 6A § 18M; M.G.L. c. 151B § 4(9½) (CORI Reform Act)"
          }
        },
        "MI": {
          "stateName": "密歇根州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "密歇根州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。密歇根州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2018年关联性审查改革",
            "detail": "《密歇根州汇编法》第338.41条等（职业法典修正案，2018年）要求发证委员会在因犯罪记录拒绝发证前进行个案评估。大多数密歇根州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "MCL § 338.41 et seq. (Occupational Code amendments, 2018)"
          }
        },
        "MN": {
          "stateName": "明尼苏达州",
          "housing": {
            "headline": "PHA遵循HUD规定；明尼阿波利斯和圣保罗限制申请表上询问犯罪记录",
            "detail": "明尼苏达州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。明尼阿波利斯和圣保罗设有公平机会住房条例，禁止在有条件租房邀约前在申请表上询问犯罪记录。该州尚无针对私人房东的统一法律。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; Minneapolis Fair Chance in Housing Ordinance (2020)"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用直接关联标准",
            "detail": "《明尼苏达州法规》第364.03条要求发证委员会在因犯罪记录拒绝发证前适用「直接关联」标准。大多数明尼苏达州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Minn. Stat. § 364.03"
          }
        },
        "MS": {
          "stateName": "密西西比州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "密西西比州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。密西西比州没有针对私人房东的统一公平机会住房法，也没有统一的职业执照关联性改革。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；委员会享有广泛自由裁量权",
            "detail": "截至2026年，密西西比州没有统一的职业执照关联性改革法。大多数密西西比州发证委员会要求在最终定罪后30天内自行报告。委员会有广泛的自由裁量权，可因犯罪记录拒绝发证。如面临委员会处分，请咨询律师。",
            "source": "Miss. Code Ann. § 73-1-1 et seq."
          }
        },
        "MO": {
          "stateName": "密苏里州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "密苏里州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。密苏里州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《密苏里州修订法规》第324.011条（SB 262，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数密苏里州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Mo. Rev. Stat. § 324.011 (SB 262, 2021)"
          }
        },
        "MT": {
          "stateName": "蒙大拿州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "蒙大拿州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。蒙大拿州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《蒙大拿州法典注释》第37-1-203条（SB 212，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数蒙大拿州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Mont. Code Ann. § 37-1-203 (SB 212, 2021)"
          }
        },
        "NE": {
          "stateName": "内布拉斯加州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "内布拉斯加州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。内布拉斯加州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《内布拉斯加州修订法规》第71-8401条等（LB 299，2021年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数内布拉斯加州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Neb. Rev. Stat. § 71-8401 et seq. (LB 299, 2021)"
          }
        },
        "NV": {
          "stateName": "内华达州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "内华达州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。内华达州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2017年起要求关联性测试",
            "detail": "《内华达州修订法规》第622A.300条（AB 384，2017年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数内华达州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "NRS § 622A.300 (AB 384, 2017)"
          }
        },
        "NH": {
          "stateName": "新罕布什尔州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "新罕布什尔州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。新罕布什尔州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《新罕布什尔州修订法规注释》第332-G:8条（2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数新罕布什尔州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "N.H. Rev. Stat. Ann. § 332-G:8 (2021)"
          }
        },
        "NJ": {
          "stateName": "新泽西州",
          "housing": {
            "headline": "新泽西州《公平机会住房法》（2021年）——房东在有条件邀约前不得询问犯罪记录",
            "detail": "新泽西州统一《公平机会住房法》（《新泽西州法规注释》第46:8-52条等，2022年起生效）禁止房东在发出有条件租房邀约前询问犯罪记录。发出有条件邀约后，房东必须进行个案评估。新泽西州住房管理机构同样遵循联邦HUD规定——公共住房驱逐前须提供书面通知及申诉听证机会。",
            "source": "N.J. Stat. Ann. § 46:8-52 et seq. (Fair Chance in Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《新泽西州法规注释》第45:1-21.1条（2021年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数新泽西州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "N.J. Stat. Ann. § 45:1-21.1 (2021)"
          }
        },
        "NM": {
          "stateName": "新墨西哥州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "新墨西哥州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。新墨西哥州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《新墨西哥州注释法规》第61-1-34条（2019年修正）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数新墨西哥州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "NMSA 1978 § 61-1-34 (2019)"
          }
        },
        "NY": {
          "stateName": "纽约州",
          "housing": {
            "headline": "纽约市住房管理局（NYCHA）提前30天发出通知；您有10天时间申请申诉听证",
            "detail": "纽约市住房管理局（NYCHA）必须在租约终止日期至少30天前送达书面终止通知。家庭成员在收到通知后有10天时间申请申诉听证。《纽约州惩教法》第23-A条也限制私人房东在未经个案审查的情况下因犯罪记录拒绝提供住房。",
            "source": "NYCHA Grievance Procedures; N.Y. Correction Law §§ 750–754; N.Y. Exec. Law § 296(16)"
          },
          "license": {
            "headline": "适用《纽约州惩教法》第23-A条；大多数委员会要求在定罪后30天内报告",
            "detail": "《纽约州惩教法》第23-A条禁止仅因既往定罪而自动拒绝发放职业执照。相关委员会必须适用八项因素的综合评估标准。大多数纽约州发证委员会要求在定罪或最终裁决后30天内自行报告。除非该委员会的具体规定另有要求，未定罪的被捕通常不需要报告。",
            "source": "N.Y. Correction Law §§ 750–754"
          }
        },
        "NC": {
          "stateName": "北卡罗来纳州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "北卡罗来纳州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。北卡罗来纳州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《北卡罗来纳州通用法规》第93B-8.1条（HB 661，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数北卡罗来纳州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "N.C. Gen. Stat. § 93B-8.1 (HB 661, 2021)"
          }
        },
        "ND": {
          "stateName": "北达科他州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "北达科他州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。北达科他州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《北达科他州中央法典》第43-51-01条等（SB 2344，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数北达科他州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "N.D. Cent. Code § 43-51-01 et seq. (SB 2344, 2021)"
          }
        },
        "OH": {
          "stateName": "俄亥俄州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "俄亥俄州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。俄亥俄州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用直接关联标准",
            "detail": "《俄亥俄州修订法典注释》第9.79条（SB 255，2012年；HB 263，2021年扩展）要求发证委员会在因犯罪记录拒绝发证前适用「直接关联」标准。大多数俄亥俄州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Ohio Rev. Code Ann. § 9.79 (SB 255, 2012; HB 263, 2021)"
          }
        },
        "OK": {
          "stateName": "俄克拉何马州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "俄克拉何马州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。俄克拉何马州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《俄克拉何马州法规》第59编第4100条等（SB 1106，2019年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数俄克拉何马州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Okla. Stat. tit. 59 § 4100 et seq. (SB 1106, 2019)"
          }
        },
        "OR": {
          "stateName": "俄勒冈州",
          "housing": {
            "headline": "《俄勒冈州公平机会住房法》（2021年）在全州范围内限制房东使用犯罪记录",
            "detail": "俄勒冈州统一《公平机会住房法》（《俄勒冈州修订法规》第90.303条，2022年起生效）限制房东在租房决定中使用犯罪记录的方式。房东在接受租房申请前不得询问犯罪记录。俄勒冈州住房管理机构同样遵循联邦HUD规定——公共住房驱逐前须提供书面通知及申诉听证机会。",
            "source": "Or. Rev. Stat. § 90.303 (Fair Chance Housing Act, 2021); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《俄勒冈州修订法规》第676.612条（HB 2009，2019年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数俄勒冈州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Or. Rev. Stat. § 676.612 (HB 2009, 2019)"
          }
        },
        "PA": {
          "stateName": "宾夕法尼亚州",
          "housing": {
            "headline": "PHA遵循HUD通知规定；费城设有公平机会住房条例",
            "detail": "宾夕法尼亚州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。费城设有公平机会住房条例，限制房东使用犯罪记录的时机。该州尚无针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; 18 Pa. C.S. § 9125"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；2020年起要求关联性测试",
            "detail": "《宾夕法尼亚州合并法规》第63编第3113条（SB 637，2020年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数宾夕法尼亚州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "63 Pa. C.S. § 3113 (SB 637, 2020)"
          }
        },
        "RI": {
          "stateName": "罗得岛州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "罗得岛州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。罗得岛州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2022年关联性审查改革",
            "detail": "《罗得岛州通用法》第5-76-2条（2022年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数罗得岛州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "R.I. Gen. Laws § 5-76-2 (2022)"
          }
        },
        "SC": {
          "stateName": "南卡罗来纳州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "南卡罗来纳州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。南卡罗来纳州没有针对私人房东的统一公平机会住房法，也没有统一的职业执照关联性改革。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；委员会享有广泛自由裁量权",
            "detail": "截至2026年，南卡罗来纳州没有统一的职业执照关联性改革法。大多数南卡罗来纳州发证委员会要求在最终定罪后30天内自行报告。委员会有广泛的自由裁量权，可因犯罪记录拒绝发证。如面临委员会处分，请咨询律师。",
            "source": "S.C. Code Ann. § 40-1-110 et seq."
          }
        },
        "SD": {
          "stateName": "南达科他州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "南达科他州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。南达科他州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《南达科他州汇编法》第36-2A-9条（SB 72，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数南达科他州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "SDCL § 36-2A-9 (SB 72, 2021)"
          }
        },
        "TN": {
          "stateName": "田纳西州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "田纳西州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。田纳西州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《田纳西州法典注释》第62-76-101条等（HB 261，2019年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数田纳西州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Tenn. Code Ann. § 62-76-101 et seq. (HB 261, 2019)"
          }
        },
        "TX": {
          "stateName": "德克萨斯州",
          "housing": {
            "headline": "PHA通常根据HUD规定提前14天发出书面通知；该州没有统一的公平机会住房法",
            "detail": "德克萨斯州的住房管理机构遵循联邦HUD的最低通知要求。大多数机构在因犯罪活动终止租约前会提前14天发出书面通知。德克萨斯州没有统一的公平机会住房法，因此各PHA的行政计划决定其自由裁量案件的处理方式。请在被捕后尽快联系您的住房管理机构——最好在发出任何正式通知之前。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在最终定罪后30天内报告",
            "detail": "《德克萨斯州职业法典》第53章禁止因既往定罪而自动拒绝发放执照。相关委员会必须适用七项因素的综合评估标准。大多数德州发证委员会（医疗、护理、教育）要求在定罪生效后30天内自行报告。仅被捕通常不属于需要报告的事件，除非该委员会的具体法规另有规定。",
            "source": "Tex. Occ. Code §§ 53.021–53.025"
          }
        },
        "UT": {
          "stateName": "犹他州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "犹他州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。犹他州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2020年关联性审查改革",
            "detail": "《犹他州法典注释》第58-1-304条（SB 34，2020年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数犹他州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Utah Code Ann. § 58-1-304 (SB 34, 2020)"
          }
        },
        "VT": {
          "stateName": "佛蒙特州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "佛蒙特州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。佛蒙特州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2019年关联性审查改革",
            "detail": "《佛蒙特州注释法规》第26编第3105条（2019年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数佛蒙特州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "26 V.S.A. § 3105 (2019)"
          }
        },
        "VA": {
          "stateName": "弗吉尼亚州",
          "housing": {
            "headline": "PHA遵循HUD规定；部分地方设有公平机会住房保护措施",
            "detail": "弗吉尼亚州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。弗吉尼亚州部分地方（包括亚历山大市）对私人房东设有公平机会住房保护措施。该州尚无统一的私人房东公平机会住房法。请在被捕后立即联系您的住房管理机构。",
            "source": "HUD 24 C.F.R. § 966.4; Va. Code Ann. § 36-96.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《弗吉尼亚州法典注释》第54.1-204条（SB 1127，2021年）要求发证委员会在因犯罪记录拒绝发证前进行个案关联性评估。大多数弗吉尼亚州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Va. Code Ann. § 54.1-204 (SB 1127, 2021)"
          }
        },
        "WA": {
          "stateName": "华盛顿州",
          "housing": {
            "headline": "《华盛顿州公平机会住房法》（2018年）在全州范围内限制房东使用犯罪记录",
            "detail": "华盛顿州统一《公平机会住房法》（《修订版华盛顿州法典》第59.18.580条，2018年起生效）限制房东在租房决定中使用犯罪记录的方式，适用于特定司法管辖区拥有3套及以上房屋的房东；西雅图的保护范围更广。华盛顿州住房管理机构同样遵循联邦HUD规定——公共住房驱逐前须提供书面通知及申诉听证机会。",
            "source": "RCW 59.18.580 (Fair Chance Housing Act, 2018); HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《修订版华盛顿州法典》第18.185.020条（SB 5046，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数华盛顿州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "RCW 18.185.020 (SB 5046, 2021)"
          }
        },
        "WV": {
          "stateName": "西弗吉尼亚州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "西弗吉尼亚州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。西弗吉尼亚州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《西弗吉尼亚州法典》第30-1-7a条（SB 97，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数西弗吉尼亚州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "W. Va. Code § 30-1-7a (SB 97, 2021)"
          }
        },
        "WI": {
          "stateName": "威斯康星州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无针对私人房东的统一公平机会住房法",
            "detail": "威斯康星州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。威斯康星州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用实质性关联标准",
            "detail": "《威斯康星州法规》第111.335条（2016年修订）要求发证委员会在因犯罪记录拒绝发证前适用「实质性关联」标准。大多数威斯康星州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Wis. Stat. § 111.335 (amended 2016)"
          }
        },
        "WY": {
          "stateName": "怀俄明州",
          "housing": {
            "headline": "PHA遵循联邦HUD通知规定；该州无统一公平机会住房法",
            "detail": "怀俄明州住房管理机构遵循联邦HUD最低要求——书面通知及驱逐前的申诉听证机会。怀俄明州没有针对私人房东的统一公平机会住房法。请在被捕后立即联系您的住房管理机构；各PHA的行政计划决定自由裁量案件的处理方式。",
            "source": "HUD 24 C.F.R. § 966.4"
          },
          "license": {
            "headline": "大多数委员会要求在定罪后30天内报告；适用2021年关联性审查改革",
            "detail": "《怀俄明州法规注释》第33-1-120条（SF 84，2021年）要求发证委员会在因犯罪记录拒绝发证前适用关联性测试。大多数怀俄明州委员会要求在最终定罪后30天内自行报告。未定罪的被捕通常不需要报告。",
            "source": "Wyo. Stat. Ann. § 33-1-120 (SF 84, 2021)"
          }
        }
      }
    },
    "stateRules": {
      "heading": "{{stateName}}州法律",
      "subheading": "这些规则适用于定罪后，而非仅因被捕。已经初级来源核实。",
      "voting": "投票权",
      "btb": "招聘（禁止勾选犯罪记录）",
      "benefits": "SNAP/TANF毒品犯罪禁令",
      "housing": "公平机会住房",
      "verifiedOn": "核实于 {{date}}",
      "mediumConfidenceNote": "基于二级来源 — 在依赖此信息前，请核对现行法规。",
      "noStateData": "我们的数据库中尚无您所在州的具体数据。请访问 ccresourcecenter.org 查询最新规定。",
      "votingStatus": {
        "incarcerated": "服刑期间可投票",
        "on_release": "释放后自动恢复",
        "parole_complete": "假释结束后恢复",
        "supervision_complete": "须完成全部监督才能恢复",
        "waiting_period": "监督结束后须等待期满",
        "application_required": "须提交申请",
        "permanent_bar": "永久禁止（部分罪行）"
      },
      "btbStatus": {
        "private_also": "适用于所有雇主",
        "public_only": "仅适用于公共雇主",
        "none": "无全州性法律"
      },
      "snapStatus": {
        "no_ban": "无毒品定罪禁令",
        "modified": "适用部分限制",
        "full_ban": "毒品重罪终身禁止"
      },
      "housingStatus": {
        "yes": "全州公平机会住房法律",
        "no": "无全州法律（适用联邦规定）"
      }
    }
  }
} as const;
