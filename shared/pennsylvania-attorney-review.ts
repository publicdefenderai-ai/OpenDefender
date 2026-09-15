import { criminalCharges } from "./criminal-charges";

export type PennsylvaniaAttorneyReviewDecisionStatus =
  | "Approved"
  | "Reject"
  | "Rejected";

export type PennsylvaniaAttorneyReviewAction =
  | "publish"
  | "hold"
  | "split"
  | "reclassify"
  | "deduplicate"
  | "remove";

export interface PennsylvaniaAttorneyReviewDecision {
  chargeId: string;
  decision: PennsylvaniaAttorneyReviewDecisionStatus;
  action: PennsylvaniaAttorneyReviewAction;
  approvedDisplayName?: string;
  correctedCitation?: string;
  correctedSubdivision?: string | null;
  note?: string;
}

/*
 * This is the privacy-safe ledger derived from the completed worksheet.
 * Reviewer identity and the uploaded workbook are intentionally not part of
 * the repository. Rows not listed in the exception maps were approved without
 * a structural note; the source and exact-title gates still apply to them.
 */
const REJECTED_CHARGE_IDS = new Set([
  "pa-alcohol-in-park",
  "pa-attempted-murder",
  "pa-attempted-robbery",
  "pa-attempted-sexual-assault",
  "pa-curfew-violation",
  "pa-dui-general-impairment",
  "pa-dui-second-offense",
  "pa-dui-third-offense",
  "pa-failure-to-pay-child-support",
  "pa-illegal-fireworks",
  "pa-juvenile-delinquency-felony",
  "pa-juvenile-delinquency-misdemeanor",
  "pa-juvenile-transfer-adult-court",
  "pa-minor-in-possession",
  "pa-robbery-in-the-second-degree",
  "pa-tax-fraud",
  "pa-truancy",
]);

const ACTION_OVERRIDES: Record<string, PennsylvaniaAttorneyReviewAction> = {
  "pa-alcohol-in-park": "remove",
  "pa-attempted-murder": "remove",
  "pa-attempted-robbery": "hold",
  "pa-attempted-sexual-assault": "hold",
  "pa-auto-burglary": "reclassify",
  "pa-burglary-in-the-first-degree": "split",
  "pa-check-fraud": "deduplicate",
  "pa-child-sexual-abuse": "split",
  "pa-criminal-attempt": "remove",
  "pa-curfew-violation": "remove",
  "pa-discharge-of-firearm-in-city": "reclassify",
  "pa-distribution-of-controlled-substance": "hold",
  "pa-driving-while-suspended": "deduplicate",
  "pa-dui-general-impairment": "remove",
  "pa-dui-first-offense": "hold",
  "pa-dui-second-offense": "remove",
  "pa-dui-third-offense": "remove",
  "pa-failure-to-pay-child-support": "remove",
  "pa-firearm-in-felony-enhancement": "remove",
  "pa-gang-enhancement": "hold",
  "pa-harassment-stalking": "deduplicate",
  "pa-illegal-camping": "split",
  "pa-illegal-fireworks": "remove",
  "pa-maintaining-drug-house": "remove",
  "pa-manufacturing-controlled-substance": "hold",
  "pa-minor-in-possession": "remove",
  "pa-noise-violation": "deduplicate",
  "pa-panhandling": "deduplicate",
  "pa-possession-of-controlled-substance": "hold",
  "pa-possession-of-drug-paraphernalia": "hold",
  "pa-possession-small-amount-marijuana": "hold",
  "pa-possession-with-intent-to-distribute": "hold",
  "pa-rape-in-the-first-degree": "split",
  "pa-recidivist-enhancement": "remove",
  "pa-reckless-driving-criminal": "deduplicate",
  "pa-robbery-in-the-first-degree": "publish",
  "pa-robbery-in-the-second-degree": "remove",
  "pa-sexual-exploitation-of-minor": "split",
  "pa-theft-by-unlawful-taking": "deduplicate",
  "pa-trespass-after-warning": "split",
  "pa-truancy": "remove",
  "pa-drug-school-zone-enhancement": "hold",
  "pa-drug-trafficking": "hold",
};

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  "pa-accessory-after-the-fact": "Hindering Apprehension or Prosecution",
  "pa-aiding-and-abetting": "Complicity/Accomplice Liability",
  "pa-animal-cruelty-misdemeanor": "Cruelty to Animal",
  "pa-assault-on-peace-officer":
    "Aggravated Assault on Peace Officer or Transportation Employee",
  "pa-bank-robbery": "Bank Robbery",
  "pa-bad-checks": "Bad Checks",
  "pa-driving-under-suspension": "Driving with Suspended/Revoked License",
  "pa-driving-without-insurance": "Driving Without Insurance/Financial Responsibility",
  "pa-embezzlement": "Theft of lost, mislaid, or property delivered by mistake",
  "pa-expired-registration": "Driving without Title/Registration",
  "pa-failure-to-appear": "Default in Required Appearance",
  "pa-fake-id": "Misrepresentation of Age to Purchase Alcohol",
  "pa-false-info-to-police": "False Reports to Law Enforcement",
  "pa-felon-in-possession-of-firearm":
    "Illegal Possession, Use, Manfacture, Control, Sale, or Transfer of a Firearm",
  "pa-hate-crime-enhancement": "Ethnic Intimidation",
  "pa-mail-fraud": "Deceptive or Fraudulent Business Practices",
  "pa-maintaining-drug-house":
    "Willful Sale of Controlled Substance without Label",
  "pa-menacing": "Terroristic Threats",
  "pa-money-laundering":
    "Dealing in Proceeds of Illegal Activities (Money Laundering)",
  "pa-murder-in-the-first-degree": "Murder of  the First Degree",
  "pa-murder-in-the-second-degree": "Murder of the Second Degree",
  "pa-possession-of-prohibited-weapon": "Prohibited Offensive Weapons",
  "pa-probation-violation": "Modification of Revocation of Order of Probation",
  "pa-protective-order-violation":
    "Contempt for Violation of Order or Agreement",
  "pa-rico-organized-crime": "Corrupt Organizations",
  "pa-robbery-in-the-first-degree": "Robbery",
  "pa-sexual-assault-in-the-second-degree": "Sexual Assault",
  "pa-sexual-assault-in-the-third-degree": "Indecent Assault",
  "pa-solicitation": "Prostitution",
  "pa-statutory-rape": "Statutory Sexual Assault",
  "pa-theft-by-receiving": "Receiving stolen property",
  "pa-vandalism": "Criminal Mischief",
  "pa-vehicular-homicide": "Homicide by Vehicle",
  "pa-wire-fraud": "Theft by Deception",
};

const CITATION_OVERRIDES: Record<string, string> = {
  "pa-bank-robbery": "18 Pa. Cons. Stat. § 3701(a)(1)(vi)",
  "pa-burglary-in-the-second-degree": "18 Pa. Cons. Stat. § 3502(a)(4)",
  "pa-robbery-in-the-first-degree": "18 Pa. Cons. Stat. § 3701",
  "pa-solicitation": "18 Pa. Cons. Stat. § 5902",
};

const SUBDIVISION_OVERRIDES: Record<string, string | null> = {
  "pa-bank-robbery": "(a)(1)(vi)",
  "pa-burglary-in-the-second-degree": "(a)(4)",
  "pa-robbery-in-the-first-degree": null,
  "pa-solicitation": null,
};

const REVIEW_NOTES: Record<string, string> = {
  "pa-accessory-after-the-fact":
    "Better to use the name in the statute, though this is essentially Accessory",
  "pa-alcohol-in-park":
    "This is not an open container offense provision, this is simply requirements for sellers of alcoholic beverages",
  "pa-attempted-murder":
    "This provision is not attempted murder. It is the general provision of attempt, which can be applied to a number of different crimes. I am not sure if this should be a standalone offense, which is why I have rejected it. Most likely attempt is added on to other potential charges",
  "pa-attempted-robbery":
    "901 is not a provision for attempted robbery. Is the thinking here to combine the general criminal attempt provision with the robbery provision? That's not precise enough in my opinion.",
  "pa-attempted-sexual-assault":
    "901 is not a provision for sexual assault, same issue as the previous row.",
  "pa-auto-burglary":
    "This is approved for Robbery, not for Auto Burglary. Robbery of a vehicle is 18 Pa. Cons. Stat. § 3702",
  "pa-burglary-in-the-first-degree":
    "(a)(4) is Second Degree (the next row)",
  "pa-check-fraud": "Already covered in row 13",
  "pa-child-sexual-abuse":
    "There are sub offenses, three different ones: (b) - Photographing, videotaping, depicting on computer or filming sexual acts; (c) Dissemination of photographs, videotapes, computer depictions and films; and (d) Child sexual abuse material",
  "pa-criminal-attempt": "See row 9 - this attaches to other crimes",
  "pa-discharge-of-firearm-in-city":
    "Approved for Carrying Firearm During Emergency. This is not discharge",
  "pa-driving-while-suspended":
    "Duplicate of the previous row, we only need one",
  "pa-dui-first-offense": "Does not distinguish first/second offense",
  "pa-dui-general-impairment":
    "This is just regular DUI - see row 37",
  "pa-dui-second-offense":
    "This is just regular DUI - see row 37",
  "pa-dui-third-offense":
    "This is just regular DUI - see row 37",
  "pa-embezzlement":
    "Not embezzelment, but Theft of lost, mislaid, or property delivered by mistake",
  "pa-failure-to-pay-child-support":
    "18 Pa. Cons. Stat. § 4322 has been repealed, and the content is now in Chapter 43 of Title 23",
  "pa-firearm-in-felony-enhancement":
    "This is just a sentencing provision, not the crime itself",
  "pa-gang-enhancement":
    "Please double check this one - is this just punishments for rackateering or the crime itself",
  "pa-harassment-stalking":
    "Duplicate of the previous row, we only need one",
  "pa-illegal-camping":
    "There are separate charges in the subsections for type of tresspass: simple tresspass (b.1); agricultural trespasser (b.2), and agricultural biosecurity area trespasser (b.3)",
  "pa-illegal-fireworks":
    "This provision does not appear in the PA code",
  "pa-juvenile-delinquency-felony":
    "This is a definitions provision for juvenile matters, not the crimes themselves",
  "pa-juvenile-delinquency-misdemeanor":
    "This is a definitions provision for juvenile matters, not the crimes themselves",
  "pa-juvenile-transfer-adult-court":
    "This is not a charge, this is a procedural provision regarding transfer of proceedings for juveniles",
  "pa-maintaining-drug-house":
    "This is not a drug house charge, this is about mislabelled or unlabeled drugs",
  "pa-minor-in-possession":
    "This provision/section has not been implemented - see https://www.palegis.us/statutes/consolidated/view-statute?txtType=HTM&ttl=47",
  "pa-noise-violation": "Repeat of row 30",
  "pa-panhandling": "Repeat of row 30",
  "pa-possession-with-intent-to-distribute": "Repeat of row 36",
  "pa-rape-in-the-first-degree":
    "There are some sub charges: Rape of a child (c) and Rape of a child with serious bodily injury (d)",
  "pa-recidivist-enhancement":
    "This is not a charge on its own, its added sentencing for repeat offenders",
  "pa-reckless-driving-criminal": "Repeat of row 91",
  "pa-robbery-in-the-first-degree":
    "This is the entire provision just for Robbery. There is no distinction between 1st and 2nd degree",
  "pa-robbery-in-the-second-degree":
    "This is the entire provision just for Robbery. There is no distinction between 1st and 2nd degree",
  "pa-sexual-exploitation-of-minor":
    "There are sub offenses, three different ones: (b) - Photographing, videotaping, depicting on computer or filming sexual acts; (c) Dissemination of photographs, videotapes, computer depictions and films; and (d) Child sexual abuse material",
  "pa-solicitation":
    "This entire provision is for Prostitution, not just (e)",
  "pa-tax-fraud": "Not in the official code",
  "pa-theft-by-unlawful-taking": "Repeat of row 80",
  "pa-trespass-after-warning":
    "There are separate charges in the subsections for type of tresspass: simple tresspass (b.1); agricultural trespasser (b.2), and agricultural biosecurity area trespasser (b.3)",
  "pa-truancy":
    "This iis a procedural provisions regarding how to deal with truancy",
};

export function getPennsylvaniaAttorneyReviewDecision(
  chargeId: string,
): PennsylvaniaAttorneyReviewDecision | undefined {
  const charge = criminalCharges.find((candidate) => candidate.id === chargeId);
  if (!charge || charge.jurisdiction !== "PA") return undefined;
  const decision: PennsylvaniaAttorneyReviewDecisionStatus =
    REJECTED_CHARGE_IDS.has(chargeId) ? "Reject" : "Approved";
  return {
    chargeId,
    decision,
    action: ACTION_OVERRIDES[chargeId] ??
      (decision === "Approved" ? "publish" : "remove"),
    ...(DISPLAY_NAME_OVERRIDES[chargeId]
      ? { approvedDisplayName: DISPLAY_NAME_OVERRIDES[chargeId] }
      : {}),
    ...(CITATION_OVERRIDES[chargeId]
      ? { correctedCitation: CITATION_OVERRIDES[chargeId] }
      : {}),
    ...(Object.prototype.hasOwnProperty.call(SUBDIVISION_OVERRIDES, chargeId)
      ? { correctedSubdivision: SUBDIVISION_OVERRIDES[chargeId] }
      : {}),
    ...(REVIEW_NOTES[chargeId] ? { note: REVIEW_NOTES[chargeId] } : {}),
  };
}

export function isPennsylvaniaAttorneyReviewPublishable(
  chargeId: string,
): boolean {
  return getPennsylvaniaAttorneyReviewDecision(chargeId)?.action === "publish";
}

export function getPennsylvaniaAttorneyReviewCitation(
  chargeId: string,
): string | undefined {
  return CITATION_OVERRIDES[chargeId];
}

export function getPennsylvaniaAttorneyReviewSubdivision(
  chargeId: string,
): string | null | undefined {
  return SUBDIVISION_OVERRIDES[chargeId];
}

export function getPennsylvaniaAttorneyReviewDisplayName(
  chargeId: string,
): string | undefined {
  return DISPLAY_NAME_OVERRIDES[chargeId];
}

export function assertPennsylvaniaAttorneyReviewCoverage(): void {
  const ids = criminalCharges.filter((charge) => charge.jurisdiction === "PA");
  if (ids.length !== 112) {
    throw new Error(
      `Pennsylvania attorney review coverage expected 112 rows, found ${ids.length}`,
    );
  }
  for (const charge of ids) {
    if (!getPennsylvaniaAttorneyReviewDecision(charge.id)) {
      throw new Error(`Missing Pennsylvania attorney review row: ${charge.id}`);
    }
  }
}