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