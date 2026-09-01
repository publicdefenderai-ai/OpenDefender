export interface SouthCarolinaTitleAliasReviewDecision {
  decision: "approve" | "reject";
  reviewer: string;
  reviewedAt: string;
  note: string;
  officialTitle?: string;
  citation?: string;
  subdivision?: string | null;
  reviewRecordId?: string;
}

/**
 * Alias proposals are not legal approval. An attorney must add an
 * attributable decision here before an alias can become a verified citation.
 * Keep this shared so server authority seeding and synchronous citation
 * consumers use the same approval source.
 */
const SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS_SOURCE: Record<
  string,
  Record<string, SouthCarolinaTitleAliasReviewDecision>
> = {
  "sc-voluntary-manslaughter": {
    Manslaughter: {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias against § 16-3-50.",
      officialTitle: "Manslaughter",
      citation: "S.C. Code Ann. § 16-3-50",
      subdivision: null,
    },
  },
  "sc-involuntary-manslaughter": {
    'Involuntary manslaughter; "criminal negligence"': {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: 'Attorney confirmed the alias after removing "defined"; reviewed against § 16-3-60.',
      officialTitle: 'Involuntary manslaughter; "criminal negligence" defined',
      citation: "S.C. Code Ann. § 16-3-60",
      subdivision: null,
    },
  },
  "sc-criminally-negligent-homicide": {
    'Involuntary Manslaughter; "Criminal Negligence" Defined': {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-60.",
      officialTitle: 'Involuntary manslaughter; "criminal negligence" defined',
      citation: "S.C. Code Ann. § 16-3-60",
      subdivision: null,
    },
  },
  "sc-rape-in-the-first-degree": {
    "Criminal Sexual Conduct in the First Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-652.",
      officialTitle: "Criminal sexual conduct in the first degree",
      citation: "S.C. Code Ann. § 16-3-652",
      subdivision: null,
    },
  },
  "sc-rape-in-the-second-degree": {
    "Criminal Sexual Conduct in the Second Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-653.",
      officialTitle: "Criminal sexual conduct in the second degree",
      citation: "S.C. Code Ann. § 16-3-653",
      subdivision: null,
    },
  },
  "sc-sexual-assault-in-the-first-degree": {
    "Criminal Sexual Conduct in the First Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-652.",
      officialTitle: "Criminal sexual conduct in the first degree",
      citation: "S.C. Code Ann. § 16-3-652",
      subdivision: null,
    },
  },
  "sc-sexual-assault-in-the-second-degree": {
    "Criminal Sexual Conduct in the Second Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-653.",
      officialTitle: "Criminal sexual conduct in the second degree",
      citation: "S.C. Code Ann. § 16-3-653",
      subdivision: null,
    },
  },
  "sc-sexual-assault-in-the-third-degree": {
    "Criminal Sexual Conduct in the Third Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-3-654.",
      officialTitle: "Criminal sexual conduct in the third degree",
      citation: "S.C. Code Ann. § 16-3-654",
      subdivision: null,
    },
  },
  "sc-statutory-rape": {
    "Criminal sexual conduct with a minor; aggravating and mitigating circumstances; penalties; repeat offenders": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: the cited subsection only covers third degree; separate first-, second-, and third-degree charges were proposed.",
    },
  },
  "sc-theft-by-receiving": {
    "Receiving stolen goods, chattels, or other property": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the simplified alias against § 16-13-180.",
      officialTitle: "Receiving stolen goods, chattels, or other property; receiving or possessing property represented by law enforcement as stolen; penalties",
      citation: "S.C. Code Ann. § 16-13-180",
      subdivision: null,
    },
    "Receiving stolen goods, chattels, or other property; receiving or possessing property represented by law enforcement as stolen; penalties": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject the original compound alias; use the simplified reviewed wording.",
    },
  },
  "sc-identity-theft": {
    "Financial identity fraud or identity fraud": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: 'Attorney confirmed the alias after removing "penalty"; reviewed against § 16-13-510.',
      officialTitle: "Financial identity fraud or identity fraud; penalty",
      citation: "S.C. Code Ann. § 16-13-510",
      subdivision: null,
    },
  },
  "sc-credit-card-fraud": {
    "Financial Transaction Card Fraud": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-14-60.",
      officialTitle: "Financial transaction card fraud",
      citation: "S.C. Code Ann. § 16-14-60",
      subdivision: null,
    },
  },
  "sc-embezzlement": {
    "Breach Of Trust With Fraudulent Intent": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-13-230.",
      officialTitle: "Breach of trust with fraudulent intent",
      citation: "S.C. Code Ann. § 16-13-230",
      subdivision: null,
    },
  },
  "sc-burglary-in-the-first-degree": {
    "Burglary; First Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-11-311.",
      officialTitle: "Burglary; first degree",
      citation: "S.C. Code Ann. § 16-11-311",
      subdivision: null,
    },
  },
  "sc-burglary-in-the-second-degree": {
    "Burglary; Second Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-11-312.",
      officialTitle: "Burglary; second degree",
      citation: "S.C. Code Ann. § 16-11-312",
      subdivision: null,
    },
  },
  "sc-burglary-in-the-third-degree": {
    "Burglary; Third Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-11-313.",
      officialTitle: "Burglary; third degree",
      citation: "S.C. Code Ann. § 16-11-313",
      subdivision: null,
    },
  },
  "sc-carjacking": {
    "Felony Carjacking": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the simplified alias against § 16-3-1075.",
      officialTitle: "Felony of carjacking; penalties",
      citation: "S.C. Code Ann. § 16-3-1075",
      subdivision: null,
    },
  },
  "sc-possession-of-drug-paraphernalia": {
    "Advertise, Manufacture, Possess, Sell, Deliver, or Possess with Intent to Distribute Paraphernalia": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 44-53-391.",
      officialTitle: "Unlawful to advertise for sale, manufacture, possess, sell or deliver, or to possess with intent to sell or deliver, paraphernalia",
      citation: "S.C. Code Ann. § 44-53-391",
      subdivision: null,
    },
  },
  "sc-check-fraud": {
    "Check Fraud": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 34-11-60.",
      officialTitle: "Drawing and uttering fraudulent check, draft, or other written order",
      citation: "S.C. Code Ann. § 34-11-60",
      subdivision: null,
    },
  },
  "sc-insurance-fraud": {
    "False Statement or Misrepresentation with Intent to Injure or Defraud": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 38-55-540.",
      officialTitle: "Criminal penalties for making false statement or misrepresentation, or assisting, abetting, soliciting or conspiring to do so; restitution to victims",
      citation: "S.C. Code Ann. § 38-55-540",
      subdivision: null,
    },
  },
  "sc-disorderly-conduct": {
    "Public disorderly conduct; conditional discharge for first-time offenders": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: separate Public Disorderly Conduct (A) and Public Disorderly Conduct, First Time charges were proposed.",
    },
  },
  "sc-dui-first-offense": {
    "Driving Under the Influence": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording and noted separate first-, second-, and third-offense penalties; reviewed against § 56-5-2930.",
      officialTitle: "Operating motor vehicle while under influence of alcohol or drugs; penalties; enrollment in Alcohol and Drug Safety Action Program; prosecution",
      citation: "S.C. Code Ann. § 56-5-2930",
      subdivision: null,
    },
  },
  "sc-reckless-driving": {
    "Reckless Driving": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 56-5-2920.",
      officialTitle: "Reckless driving; penalties; suspension of driver's license for second or subsequent offense",
      citation: "S.C. Code Ann. § 56-5-2920",
      subdivision: null,
    },
  },
  "sc-driving-while-suspended": {
    "Driving While Suspended": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the corrected replacement wording against § 56-1-460.",
      officialTitle: "Penalties for driving while license cancelled, suspended or revoked; route restricted license",
      citation: "S.C. Code Ann. § 56-1-460",
      subdivision: null,
    },
  },
  "sc-driving-under-suspension": {
    "Driving While Suspended": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the corrected replacement wording against § 56-1-460.",
      officialTitle: "Penalties for driving while license cancelled, suspended or revoked; route restricted license",
      citation: "S.C. Code Ann. § 56-1-460",
      subdivision: null,
    },
  },
  "sc-petit-larceny": {
    "Petit Larceny": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed Petit Larceny as subsection (A) and proposed a separate Grand Larceny charge for subsection (B).",
      officialTitle: "Petit larceny; grand larceny",
      citation: "S.C. Code Ann. § 16-13-30(A)",
      subdivision: "(A)",
    },
  },
  "sc-assault-and-battery-third-degree": {
    "Assault and Battery, Third Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the third-degree replacement and proposed separate degree-specific charges; reviewed against § 16-3-600(E).",
      officialTitle: "Assault and battery; definitions; degrees of offenses",
      citation: "S.C. Code Ann. § 16-3-600(E)",
      subdivision: "(E)",
    },
  },
  "sc-domestic-violence-third-degree": {
    "Domestic Violence, Third Degree": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the third-degree replacement and identified subsection (D) as the third-degree provision.",
      officialTitle: "Acts prohibited; penalties",
      citation: "S.C. Code Ann. § 16-25-20(D)",
      subdivision: "(D)",
    },
  },
  "sc-malicious-injury-to-property": {
    "Malicious Injury to Animals and Other Personal Property": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 16-11-510.",
      officialTitle: "Malicious injury to animals and other personal property",
      citation: "S.C. Code Ann. § 16-11-510",
      subdivision: null,
    },
  },
  "sc-failure-to-appear": {
    "Wilful Failure to Appear": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: 'Attorney confirmed the alias after removing "penalties"; reviewed against § 17-15-90.',
      officialTitle: "Wilful failure to appear; penalties",
      citation: "S.C. Code Ann. § 17-15-90",
      subdivision: null,
    },
  },
  "sc-probation-violation": {
    "Court action when terms of probation violated": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: this is a court-action provision rather than a direct criminal charge; incorporate it into probation context instead.",
    },
  },
  "sc-open-container": {
    "Open Containers in Motor Vehicle": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias with title capitalization against § 61-4-110.",
      officialTitle: "Open containers in motor vehicle",
      citation: "S.C. Code Ann. § 61-4-110",
      subdivision: null,
    },
  },
  "sc-animal-cruelty-misdemeanor": {
    "Ill Treatment of Animals": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 47-1-40(A).",
      officialTitle: "Ill-treatment of animals generally; penalties",
      citation: "S.C. Code Ann. § 47-1-40(A)",
      subdivision: "(A)",
    },
  },
  "sc-truancy": {
    "Failure to Enroll/Attend School": {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney approved the replacement wording against § 59-65-20.",
      officialTitle: "Penalty for failure to enroll or cause child to attend school",
      citation: "S.C. Code Ann. § 59-65-20",
      subdivision: null,
    },
  },
  "sc-littering": {
    "Dumping litter on private or public property prohibited; exceptions; responsibility for removal; penalties": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: separate under-15-pound, 15-to-500-pound, and over-500-pound charges were proposed.",
    },
  },
  "sc-criminal-attempt": {
    "Offense of attempt punished as principal offense": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: this is a definition; attempt charges should use their underlying offense sections.",
    },
  },
  "sc-conspiracy": {
    Conspiracy: {
      decision: "approve",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Attorney confirmed the alias against § 16-17-410.",
      officialTitle: "Conspiracy",
      citation: "S.C. Code Ann. § 16-17-410",
      subdivision: null,
    },
  },
  "sc-juvenile-transfer-adult-court": {
    "Transfer of jurisdiction": {
      decision: "reject",
      reviewer: "Attorney reviewer (private source)",
      reviewedAt: "2026-09-01",
      note: "Reject: this is a court requirement rather than a criminal charge.",
    },
  },
};

export const SOUTH_CAROLINA_PRIVATE_REVIEW_RECORD_ID =
  "sc-title-alias-attorney-review-2026-09-01";

export const SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS: Record<
  string,
  Record<string, SouthCarolinaTitleAliasReviewDecision>
> = Object.fromEntries(
  Object.entries(SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS_SOURCE).map(
    ([chargeId, decisions]) => [
      chargeId,
      Object.fromEntries(
        Object.entries(decisions).map(([alias, decision]) => [
          alias,
          { ...decision, reviewRecordId: SOUTH_CAROLINA_PRIVATE_REVIEW_RECORD_ID },
        ]),
      ),
    ],
  ),
) as Record<string, Record<string, SouthCarolinaTitleAliasReviewDecision>>;

const SOUTH_CAROLINA_NON_ALIAS_SOURCE_CHARGE_IDS = [
  "sc-shoplifting",
  "sc-forgery",
  "sc-attempted-murder",
] as const;

function hasCompleteReviewDecision(
  decision: SouthCarolinaTitleAliasReviewDecision | undefined,
): boolean {
  return Boolean(
    decision &&
    (decision.decision === "approve" || decision.decision === "reject") &&
    typeof decision.reviewer === "string" &&
    decision.reviewer.trim() &&
    typeof decision.reviewedAt === "string" &&
    !Number.isNaN(new Date(decision.reviewedAt).getTime()) &&
    typeof decision.note === "string" &&
    decision.note.trim() &&
    typeof decision.reviewRecordId === "string" &&
    decision.reviewRecordId.trim(),
  );
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function isSouthCarolinaAliasApproved(chargeId: string, title: string): boolean {
  const decisions = SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS[chargeId];
  if (!decisions) return false;
  const normalizedTitle = normalizeTitle(title);
  const decision = Object.entries(decisions)
    .find(([alias]) =>
      normalizeTitle(alias) === normalizedTitle,
    )?.[1];
  return decision?.decision === "approve" && hasCompleteReviewDecision(decision);
}

export function isSouthCarolinaOfficialTitleApproved(
  chargeId: string,
  officialTitle: string,
): boolean {
  const decisions = SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS[chargeId];
  if (!decisions) return false;
  return Object.values(decisions).some((decision) =>
    decision.decision === "approve" &&
    hasCompleteReviewDecision(decision) &&
    typeof decision.reviewRecordId === "string" &&
    typeof decision.officialTitle === "string" &&
    typeof decision.citation === "string" &&
    "subdivision" in decision &&
    normalizeTitle(decision.officialTitle) === normalizeTitle(officialTitle),
  );
}

/**
 * This is the only shared allow-list used by synchronous citation consumers.
 * The authority manifest must contain the same set; the SC manifest tests
 * enforce that invariant before a seed can be released.
 */
export const SOUTH_CAROLINA_APPROVED_ALIAS_CHARGE_IDS = new Set(
  Object.entries(SOUTH_CAROLINA_TITLE_ALIAS_REVIEW_DECISIONS)
    .filter(([, decisions]) =>
      Object.values(decisions).some((decision) => hasCompleteReviewDecision(decision) &&
        decision.decision === "approve" &&
        typeof decision.reviewRecordId === "string" &&
        typeof decision.officialTitle === "string" &&
        typeof decision.citation === "string" &&
        "subdivision" in decision),
    )
    .map(([chargeId]) => chargeId),
);

export const SOUTH_CAROLINA_NON_ALIAS_EXACT_SOURCE_CHARGE_IDS = new Set(
  SOUTH_CAROLINA_NON_ALIAS_SOURCE_CHARGE_IDS,
);