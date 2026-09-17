import type { ChargeExplanation } from "./charge-explanations";

export const OHIO_MANSLAUGHTER_EXPLANATIONS: ChargeExplanation[] = [
  {
    jurisdiction: "OH", chargePattern: /^voluntary manslaughter$/i,
    slug: "ohio-voluntary-manslaughter",
    plainSummary: "Ohio voluntary manslaughter requires the conditions in § 2903.03, including knowingly causing death or unlawful termination of pregnancy under sudden passion or rage brought on by serious provocation reasonably sufficient to incite deadly force. Division (B) addresses sexual motivation; division (C) makes the offense a first-degree felony. Being angry alone does not establish the statutory conditions. Pregnancy-related definitions and exceptions are in § 2903.09.",
    degreeContext: "For ordinary first-degree sentencing, the current statute distinguishes conduct before and on or after March 22, 2019. The newer rule has a selected 3–11 year minimum and an indefinite maximum under § 2929.144. Do not mistake the minimum for the maximum or treat it as the sentence for every case. Prior convictions, specifications and collateral consequences require separate review.",
    keyTerms: [], pendingAttorneyReview: true,
    sources: [{ jurisdiction: "OH", citation: "Ohio Rev. Code §§ 2903.03, 2903.09, 2929.14, 2929.144", url: "https://codes.ohio.gov/ohio-revised-code/section-2903.03" }],
  },
  {
    jurisdiction: "OH", chargePattern: /^involuntary manslaughter$/i,
    slug: "ohio-involuntary-manslaughter",
    plainSummary: "Ohio involuntary manslaughter under § 2903.04 concerns a death or unlawful termination of pregnancy proximately resulting from committing or attempting an underlying offense. Division (A), involving a felony, is first-degree; division (B), involving specified lesser offenses with express exclusions, is third-degree. It is not simply another name for reckless homicide. The precise underlying offense matters, and § 2903.09 supplies pregnancy-related definitions and exceptions.",
    degreeContext: "The two divisions have different ordinary prison and fine rules. Intoxication-related conditions in division (D) require prison and a class-one lifetime license suspension. Qualifying specifications for division (A) can invoke § 2971.03, including life sentences, so ordinary ranges are not universal maximums. Offense date, prior convictions and all allegations require separate review.",
    keyTerms: [], pendingAttorneyReview: true,
    sources: [{ jurisdiction: "OH", citation: "Ohio Rev. Code §§ 2903.04, 2903.09, 4510.02, 2971.03", url: "https://codes.ohio.gov/ohio-revised-code/section-2903.04" }],
  },
];