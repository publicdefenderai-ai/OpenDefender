export type NorthCarolinaTitleReviewAction = "publish" | "hold" | "remove";

export interface NorthCarolinaTitleReviewActionRecord {
  action: NorthCarolinaTitleReviewAction;
  reason: string;
  displayName?: string;
}

/**
 * These actions are intentionally separate from the attorney decision column.
 * The decision says what the reviewer thought about the proposed mapping; the
 * action records what the catalog can safely do with the existing row.
 */
export const NORTH_CAROLINA_TITLE_REVIEW_ACTIONS: Record<
  string,
  NorthCarolinaTitleReviewActionRecord
> = {
  "nc-assault-in-the-first-degree": {
    action: "hold",
    reason: "Split the statute into subsection-specific assault rows before publication.",
  },
  "nc-attempted-murder": {
    action: "remove",
    reason: "This row is an attempted-murder label attached to an actual-murder provision.",
  },
  "nc-attempted-robbery": {
    action: "hold",
    reason: "Reclassify as a general attempt row only after an exact offense source is identified.",
  },
  "nc-attempted-sexual-assault": {
    action: "hold",
    reason: "Reclassify as a general attempt row only after an exact offense source is identified.",
  },
  "nc-assault-with-deadly-weapon": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific assault circumstances that should be covered before this broad row is published.",
  },
  "nc-bank-robbery": {
    action: "remove",
    reason: "Duplicate armed-robbery coverage; retain the reviewed armed-robbery row instead.",
  },
  "nc-carjacking": {
    action: "remove",
    reason: "The reviewer identified this as general armed robbery rather than a distinct North Carolina carjacking row.",
  },
  "nc-burglary-in-the-first-degree": {
    action: "publish",
    reason: "Use the reviewer-directed first-degree burglary subsection (a).",
  },
  "nc-burglary-in-the-second-degree": {
    action: "publish",
    reason: "Reclassify this row as the reviewer-directed general breaking-and-entering charge under section 14-54.",
    displayName: "Breaking and Entering - General",
  },
  "nc-commercial-burglary": {
    action: "remove",
    reason: "Duplicate the corrected general breaking-and-entering mapping.",
  },
  "nc-computer-fraud": {
    action: "remove",
    reason: "The cited provision is an exception or qualifier, not a standalone charge.",
  },
  "nc-conspiracy": {
    action: "remove",
    reason: "The cited provision addresses punishment, not the conspiracy offense.",
  },
  "nc-criminal-attempt": {
    action: "remove",
    reason: "The cited provision addresses punishment, not the attempt offense.",
  },
  "nc-criminal-solicitation": {
    action: "remove",
    reason: "The cited provision addresses punishment, not the solicitation offense.",
  },
  "nc-criminally-negligent-homicide": {
    action: "remove",
    reason: "The cited provision addresses manslaughter punishment, not this charge.",
  },
  "nc-curfew-violation": {
    action: "remove",
    reason: "The cited provision authorizes a county curfew; it is not a charge.",
  },
  "nc-defective-vehicle-equipment": {
    action: "remove",
    reason: "The reviewer marked this row as irrelevant to the charge catalog.",
  },
  "nc-distribution-of-controlled-substance": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific controlled-substance offenses that must be separated first.",
  },
  "nc-drug-school-zone-enhancement": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific controlled-substance offenses that must be separated first.",
  },
  "nc-drug-trafficking": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific controlled-substance offenses that must be separated first.",
  },
  "nc-driving-while-suspended": {
    action: "remove",
    reason: "The reviewer identified this as duplicate coverage of driving while revoked.",
  },
  "nc-dui-second-offense": {
    action: "remove",
    reason: "This is sentencing guidance, not a separate charge description.",
  },
  "nc-dui-third-offense": {
    action: "remove",
    reason: "This is sentencing guidance, not a separate charge description.",
  },
  "nc-expired-inspection": {
    action: "remove",
    reason: "The reviewer marked this as a vehicle description, not a criminal charge.",
  },
  "nc-felony-murder": {
    action: "remove",
    reason: "The cited provision is the murder statute and does not support a separate felony-murder row.",
  },
  "nc-firearm-in-felony-enhancement": {
    action: "remove",
    reason: "The reviewer identified this as sentencing-factor guidance, not a separate charge.",
  },
  "nc-hunting-fishing-no-license": {
    action: "remove",
    reason: "The cited provision concerns licensing exceptions, not a charge.",
  },
  "nc-involuntary-manslaughter": {
    action: "remove",
    reason: "The cited provision addresses punishment, not the manslaughter offense.",
  },
  "nc-juvenile-delinquency-felony": {
    action: "remove",
    reason: "The cited provision is a juvenile-law definition, not a charge.",
  },
  "nc-juvenile-delinquency-misdemeanor": {
    action: "remove",
    reason: "The cited provision is a juvenile-law definition, not a charge.",
  },
  "nc-juvenile-transfer-adult-court": {
    action: "remove",
    reason: "The cited provision concerns jurisdiction transfer, not a charge.",
  },
  "nc-murder-in-the-first-degree": {
    action: "publish",
    reason: "Correct the row to subsection (a), which the reviewer identified as first-degree murder.",
  },
  "nc-murder-in-the-second-degree": {
    action: "publish",
    reason: "The row already uses the reviewer-identified subsection (b) mapping.",
  },
  "nc-maintaining-drug-house": {
    action: "hold",
    reason: "Reclassify the licensed-controlled-substance conduct before publication.",
  },
  "nc-manufacturing-controlled-substance": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific controlled-substance offenses that must be separated first.",
  },
  "nc-possession-with-intent-to-distribute": {
    action: "hold",
    reason: "The reviewer identified additional subsection-specific controlled-substance offenses that must be separated first.",
  },
  "nc-probation-violation": {
    action: "remove",
    reason: "The cited provision concerns probation procedure, not a separate charge.",
  },
  "nc-recidivist-enhancement": {
    action: "remove",
    reason: "The reviewer identified this as a sentencing multiplier, not a standalone charge.",
  },
  "nc-domestic-violence-assault": {
    action: "hold",
    reason: "The reviewer identified this provision as a charge definition rather than a penalty or standalone charge mapping.",
  },
  "nc-grand-theft-in-the-first-degree": {
    action: "hold",
    reason: "The reviewer identified felony and misdemeanor larceny distinctions within the cited subsection that must be modeled separately.",
  },
  "nc-grand-theft-in-the-second-degree": {
    action: "hold",
    reason: "The reviewer identified felony and misdemeanor larceny distinctions within the cited subsection that must be modeled separately.",
  },
  "nc-larceny-misdemeanor": {
    action: "hold",
    reason: "The reviewer identified felony and misdemeanor larceny distinctions within the cited subsection that must be modeled separately.",
  },
  "nc-petty-theft": {
    action: "hold",
    reason: "The reviewer identified felony and misdemeanor larceny distinctions within the cited subsection that must be modeled separately.",
  },
  "nc-possession-marijuana-up-to-half-oz": {
    action: "hold",
    reason: "The reviewer identified amount and hashish distinctions that must be modeled before penalty estimates are published.",
  },
  "nc-residential-burglary": {
    action: "publish",
    reason: "Use this existing row for the reviewer-directed second-degree burglary subsection (b).",
    displayName: "Burglary in the Second Degree",
  },
  "nc-resist-delay-obstruct": {
    action: "hold",
    reason: "The reviewer identified injury-level penalty distinctions that must be modeled by subsection.",
  },
  "nc-resisting-arrest": {
    action: "hold",
    reason: "The reviewer identified injury-level penalty distinctions that must be modeled by subsection.",
  },
  "nc-robbery-in-the-second-degree": {
    action: "remove",
    reason: "The reviewer identified this as an expanded definition rather than a separate armed-robbery row.",
  },
  "nc-sexual-assault-in-the-first-degree": {
    action: "remove",
    reason: "Duplicate the reviewed first-degree forcible-rape row.",
  },
  "nc-sexual-assault-in-the-second-degree": {
    action: "publish",
    reason: "The reviewer identified the source as first-degree forcible sexual offense; publish only after the catalog code is aligned.",
  },
  "nc-sexual-assault-in-the-third-degree": {
    action: "publish",
    reason: "The reviewer identified the source as second-degree forcible sexual offense; publish only after the catalog code is aligned.",
  },
  "nc-simple-assault": {
    action: "hold",
    reason: "The reviewer identified target and injury distinctions in subsections (b) and (c) that must be modeled separately.",
  },
  "nc-tax-fraud": {
    action: "hold",
    reason: "The reviewer identified this as a multi-offense penalty provision; only tax evasion is covered by subsection (a)(7).",
  },
  "nc-truancy": {
    action: "remove",
    reason: "The cited provision is school-social-worker guidance, not a charge.",
  },
  "nc-unregistered-vehicle": {
    action: "remove",
    reason: "The reviewer found no appropriate misdemeanor or felony charge here.",
  },
  "nc-voluntary-manslaughter": {
    action: "remove",
    reason: "The cited provision addresses punishment, not the manslaughter offense.",
  },
  "nc-vehicular-homicide": {
    action: "hold",
    reason: "The reviewer identified death, serious-injury, and repeat-offense distinctions that must be modeled before penalty estimates are published.",
  },
  "nc-fake-id": {
    action: "hold",
    reason: "The reviewer confirmed subsection (e) but requested separate coverage for the other subsection offenses.",
  },
  "nc-hate-crime-enhancement": {
    action: "publish",
    reason: "The reviewer scoped this mapping specifically to subsection (c).",
  },
  "nc-illegal-camping": {
    action: "remove",
    reason: "The reviewed mapping duplicates the existing first-degree trespass row under a different local label.",
  },
};

export function getNorthCarolinaTitleReviewAction(
  chargeId: string,
): NorthCarolinaTitleReviewActionRecord | undefined {
  return NORTH_CAROLINA_TITLE_REVIEW_ACTIONS[chargeId];
}