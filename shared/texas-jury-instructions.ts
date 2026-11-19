// Pin the publisher's edition because item numbers and titles can change between editions.
const bodilyInjury = {
  instructionRef: "CPJC 22.1: Assault by Causing Bodily Injury (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-1.htm&version=013",
};
const impeding = {
  instructionRef: "CPJC 22.4: Assault by Impeding Normal Breathing or Circulation (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-4.htm&version=013",
};
const misdemeanorDwi = {
  instructionRef: "CPJC 49.16: Misdemeanor Driving While Intoxicated (with Necessity Defense) (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F49_Intoxication_Offenses%2FCPJC49-16.htm&version=055",
};

const theft = {
  instructionRef: "CPJC 31.2: Theft (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F31_Theft%2FCPJC31-2.htm&version=037",
};
const possession = {
  instructionRef: "CPJC 81.10: Possession of Controlled Substance (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-10.htm&version=053",
};
const resistingArrest = {
  instructionRef: "CPJC 38.2: Resisting Arrest (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F38_Obstructing_Governmental_Operation%2FCPJC38-2.htm&version=013",
};
const evadingArrest = {
  instructionRef: "CPJC 38.4: Evading Detention or Arrest in a motor vehicle (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F38_Obstructing_Governmental_Operation%2FCPJC38-4.htm&version=026",
};
const vehicleBurglary = {
  instructionRef: "CPJC 30.8: Burglary of a Vehicle (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F30_Burglary_and_Criminal_Trespass%2FCPJC30-8.htm&version=007",
};
const otherMarijuanaGrades = {
  instructionRef: "CPJC 81.9: Possession of Marijuana, Other Grades (underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-9.htm&version=048",
};
const deliveryTransfer = {
  instructionRef: "CPJC 81.13: Delivery of Controlled Substance by Actual or Constructive Transfer (transfer theory only, underlying conduct only)",
  instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-13.htm&version=048",
};
export const texasVerifiedInstructions: Readonly<Record<string, typeof bodilyInjury | undefined>> = {
  "tx-pc-20-02-ordinary": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-child": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-risk": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-public-servant": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-custody": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-civil": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-peace-officer": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-pc-20-02-judge": {
    "instructionRef": "CPJC 20.7: Unlawful Restraint (force, intimidation or deception theory only; underlying conduct only; child-acquiescence alternatives and grading separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F20_Kidnapping_Restraint_and_Human_Smuggling%2FCPJC20-7.htm&version=055"
  },
  "tx-robbery-in-the-second-degree": {
    "instructionRef": "CPJC 29.2: Robbery by Threat (threat theory only; underlying conduct only; injury alternative separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F29_Robbery%2FCPJC29-2.htm&version=055"
  },
  "tx-robbery-in-the-first-degree": {
    "instructionRef": "CPJC 29.3: Aggravated Robbery by Causing Serious Bodily Injury (serious-injury theory only; underlying conduct only; other alternatives separate)",
    "instructionUrl": "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F29_Robbery%2FCPJC29-3.htm&version=055"
  },
  "tx-pc-22-01-public-servant": bodilyInjury,
  "tx-pc-22-01-peace-officer": bodilyInjury,
  "tx-pc-22-01-judge": bodilyInjury,
  "tx-pc-22-01-custody-contractor": bodilyInjury,
  "tx-pc-22-01-security": bodilyInjury,
  "tx-pc-22-01-emergency": bodilyInjury,
  "tx-pc-22-01-process-server": bodilyInjury,
  "tx-pc-22-01-forced-abortion-injury": bodilyInjury,
  "tx-pc-22-01-pregnant": bodilyInjury,
  "tx-pc-22-01-hospital": bodilyInjury,
  "tx-pc-22-01-utility": bodilyInjury,
  "tx-pc-22-01-civil-office-1": bodilyInjury,
  "tx-pc-22-01-civil-office-2": {
    instructionRef: "CPJC 22.2: Assault by Threat (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055",
  },
  "tx-pc-22-01-civil-office-3": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },
  "tx-pc-22-01-civil-contractor-1": bodilyInjury,
  "tx-pc-22-01-civil-contractor-2": {
    instructionRef: "CPJC 22.2: Assault by Threat (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055",
  },
  "tx-pc-22-01-civil-contractor-3": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },
  "tx-pc-22-01-ordinary-2": {
    instructionRef: "CPJC 22.2: Assault by Threat (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055",
  },
  "tx-pc-22-01-sports-2": {
    instructionRef: "CPJC 22.2: Assault by Threat (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055",
  },
  "tx-pc-22-01-forced-abortion-2": {
    instructionRef: "CPJC 22.2: Assault by Threat (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055",
  },
  "tx-pc-22-01-ordinary-3": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },
  "tx-pc-22-01-sports-3": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },
  "tx-pc-22-01-forced-abortion-3": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },
  "tx-pc-22-01-elderly-disabled-contact": {
    instructionRef: "CPJC 22.3: Assault by Offensive Touching (underlying conduct only; protected-role grading separate)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055",
  },

  "tx-pc-32-31-1-a": {
    instructionRef: "CPJC 32.11: Credit Card or Debit Card Abuse: unauthorized presentation/use (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-11.htm&version=055",
  },
  "tx-pc-32-51-person-under-5": {
    instructionRef: "CPJC 32.41: Identifying Information: another-person branch (underlying conduct only; no enhancement)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-41.htm&version=055",
  },
  "tx-pc-32-315-under-5": {
    instructionRef: "CPJC 32.6: Card Information: digital-imprint branch (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-6.htm&version=055",
  },
  "tx-pc-32-51-person-5-to-9": {
    instructionRef: "CPJC 32.42: Identifying Information: another-person branch (underlying conduct only; no enhancement)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-42.htm&version=055",
  },
  "tx-pc-32-315-5-to-9": {
    instructionRef: "CPJC 32.6: Card Information: digital-imprint branch (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-6.htm&version=055",
  },
  "tx-pc-32-51-person-10-to-49": {
    instructionRef: "CPJC 32.42: Identifying Information: another-person branch (underlying conduct only; no enhancement)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-42.htm&version=055",
  },
  "tx-pc-32-315-10-to-49": {
    instructionRef: "CPJC 32.6: Card Information: digital-imprint branch (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-6.htm&version=055",
  },
  "tx-pc-32-51-person-50-plus": {
    instructionRef: "CPJC 32.42: Identifying Information: another-person branch (underlying conduct only; no enhancement)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-42.htm&version=055",
  },
  "tx-pc-32-315-50-plus": {
    instructionRef: "CPJC 32.6: Card Information: digital-imprint branch (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-6.htm&version=055",
  },

  "tx-tn-550-021-death": {
    instructionRef: "CPJC 80.2: Failure to Stop and Render Aid (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F80_Transportation_Code_Offenses%2FCPJC80-2.htm&version=007",
  },
  "tx-tn-550-021-serious-injury": {
    instructionRef: "CPJC 80.2: Failure to Stop and Render Aid (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F80_Transportation_Code_Offenses%2FCPJC80-2.htm&version=007",
  },
  "tx-tn-550-021-other-injury": {
    instructionRef: "CPJC 80.2: Failure to Stop and Render Aid (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F80_Transportation_Code_Offenses%2FCPJC80-2.htm&version=007",
  },

  "tx-pc-37-09-pending": {
    instructionRef: "CPJC 37.9: Tampering with Physical Evidence Knowing of Pending or Ongoing Investigation or Official Proceeding (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-9.htm&version=053",
  },
  "tx-pc-37-09-pending-corpse": {
    instructionRef: "CPJC 37.9: Tampering with Physical Evidence Knowing of Pending or Ongoing Investigation or Official Proceeding (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-9.htm&version=053",
  },
  "tx-pc-37-09-fabricating": {
    instructionRef: "CPJC 37.10: Tampering with Physical Evidence with Intent to Affect Pending or Ongoing Investigation or Official Proceeding (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-10.htm&version=053",
  },
  "tx-pc-37-09-subsequent": {
    instructionRef: "CPJC 37.11: Knowingly Tampering with Physical Evidence with Intent to Affect Any Subsequent Investigation or Official Proceeding (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-11.htm&version=053",
  },
  "tx-pc-37-09-subsequent-corpse": {
    instructionRef: "CPJC 37.11: Knowingly Tampering with Physical Evidence with Intent to Affect Any Subsequent Investigation or Official Proceeding (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-11.htm&version=053",
  },
  "tx-pc-37-09-unreported-corpse": {
    instructionRef: "CPJC 37.12: Tampering with Physical Evidence by Failing to Report a Corpse (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-12.htm&version=053",
  },
  "tx-pc-36-06-retaliation": {
    instructionRef: "CPJC 36.9: Retaliation (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-9.htm&version=037",
  },
  "tx-pc-36-06-retaliation-juror": {
    instructionRef: "CPJC 36.9: Retaliation (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-9.htm&version=037",
  },
  "tx-pc-36-06-obstruction": {
    instructionRef: "CPJC 36.10: Obstruction (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-10.htm&version=037",
  },
  "tx-pc-36-06-obstruction-juror": {
    instructionRef: "CPJC 36.10: Obstruction (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-10.htm&version=037",
  },

  "tx-hsc-481-112-b": deliveryTransfer,
  "tx-hsc-481-112-c": deliveryTransfer,
  "tx-hsc-481-112-d": deliveryTransfer,
  "tx-hsc-481-112-e": deliveryTransfer,
  "tx-hsc-481-112-f": deliveryTransfer,
  "tx-hsc-481-1123-b": deliveryTransfer,
  "tx-hsc-481-1123-c": deliveryTransfer,
  "tx-hsc-481-1123-d": deliveryTransfer,
  "tx-hsc-481-1123-e": deliveryTransfer,
  "tx-hsc-481-1123-f": deliveryTransfer,
  "tx-hsc-481-113-b": deliveryTransfer,
  "tx-hsc-481-113-c": deliveryTransfer,
  "tx-hsc-481-113-d": deliveryTransfer,
  "tx-hsc-481-113-e": deliveryTransfer,
  "tx-pc-22-04-serious-intentional": {
    instructionRef: "CPJC 22.9: Serious Bodily Injury to Child by Act (intentional or knowing child/act/serious-bodily-injury theory only, underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-9.htm&version=026",
  },
  "tx-pc-22-041-abandon-return": {
    instructionRef: "CPJC 22.18: Abandoning Child, State Jail Felony (child branch only, underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-18.htm&version=048",
  },
  "tx-pc-22-041-abandon-imminent-danger": {
    instructionRef: "CPJC 22.20: Abandoning Child, Second-Degree Felony (child branch only, underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-20.htm&version=026",
  },
  "tx-pc-22-041-endanger": {
    instructionRef: "CPJC 22.17: Endangering Child by Act (child and act theory only, underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-17.htm&version=048",
  },
  "tx-pc-25-11-continuous": {
    instructionRef: "CPJC 25.22: Continuous Violence against the Family (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F25_Offenses_against_the_Family%2FCPJC25-22.htm&version=055",
  },
  "tx-pc-38-03-c": resistingArrest,
  "tx-pc-38-03-d": resistingArrest,
  "tx-pc-38-04-vehicle": evadingArrest,
  "tx-pc-22-02-a-2": {
    instructionRef: "CPJC 22.6: Aggravated Assault Using or Exhibiting a Deadly Weapon (bodily-injury theory only) — underlying conduct only",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-6.htm&version=013",
  },
  "tx-pc-46-02-recent-assault": {
    instructionRef: "CPJC 46.6: Carrying a Handgun with a Prior Conviction for Assault (misdemeanor bodily-injury predicate; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F46_Weapons_Offenses%2FCPJC46-6.htm&version=055",
  },
  "tx-pc-46-02-vehicle-criminal-activity": {
    instructionRef: "CPJC 46.8: Carrying a Handgun in a Motor Vehicle (criminal activity, motor vehicle only; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F46_Weapons_Offenses%2FCPJC46-8.htm&version=048",
  },
  "tx-pc-46-02-a-5": {
    instructionRef: "CPJC 46.9: Carrying a Handgun in Plain View (intentional public display; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F46_Weapons_Offenses%2FCPJC46-9.htm&version=055",
  },
  "tx-pc-31-03-e-4-a": theft,
  "tx-pc-31-03-e-4-c": theft,
  "tx-pc-31-03-e-5": theft,
  "tx-pc-31-03-e-6-a": theft,
  "tx-pc-31-03-e-7": theft,
  "tx-auto-burglary": vehicleBurglary,
  "tx-pc-30-04-one-prior": vehicleBurglary,
  "tx-pc-30-04-two-priors": vehicleBurglary,
  "tx-pc-30-04-rail": vehicleBurglary,
  "tx-pc-30-04-prescription": vehicleBurglary,
  "tx-pc-30-02-building": {
    instructionRef: "CPJC 30.3: Burglary of Building by Entry with Intent (entry-with-intent theory; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F30_Burglary_and_Criminal_Trespass%2FCPJC30-3.htm&version=007",
  },
  "tx-pc-30-02-habitation": {
    instructionRef: "CPJC 30.5: Burglary of Habitation by Entry with Intent (entry-with-intent theory; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F30_Burglary_and_Criminal_Trespass%2FCPJC30-5.htm&version=007",
  },
  "tx-pc-31-03-e-1": theft,
  "tx-pc-31-03-e-2-b": theft,
  "tx-pc-31-03-e-3": theft,
  "tx-criminal-trespass": {
    instructionRef: "CPJC 30.15: Criminal Trespass by Remaining in Building (underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F30_Burglary_and_Criminal_Trespass%2FCPJC30-15.htm&version=007",
  },
  "tx-pc-31-07-unauthorized-use": {
    instructionRef: "CPJC 31.9: Unauthorized Use of Vehicle (motor-propelled vehicle, underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F31_Theft%2FCPJC31-9.htm&version=048",
  },
  "tx-pc-31-03-e-2-a": theft,
  "tx-pc-31-03-e-4-d": theft,
  "tx-hsc-481-115-e": possession,
  "tx-hsc-481-115-f": possession,
  "tx-hsc-481-116-d": possession,
  "tx-hsc-481-116-e": possession,
  "tx-hsc-481-117-b": possession,
  "tx-hsc-481-117-c": possession,
  "tx-hsc-481-117-d": possession,
  "tx-hsc-481-117-e": possession,
  "tx-hsc-481-121-b-2": otherMarijuanaGrades,
  "tx-hsc-481-121-b-3": otherMarijuanaGrades,
  "tx-hsc-481-121-b-4": otherMarijuanaGrades,
  "tx-hsc-481-121-b-5": otherMarijuanaGrades,
  "tx-hsc-481-121-b-6": otherMarijuanaGrades,
  "tx-hsc-481-115-b": possession,
  "tx-hsc-481-115-c": possession,
  "tx-hsc-481-116-b": possession,
  "tx-hsc-481-115-d": possession,
  "tx-hsc-481-116-c": possession,
  "tx-possession-of-marijuana": {
    instructionRef: "CPJC 81.8: Possession of Marijuana, Class B Misdemeanor (with Voluntariness Requirement; underlying conduct only)",
    instructionUrl: "https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-8.htm&version=037",
  },
  "tx-pc-22-01-bodily-injury": bodilyInjury,
  "tx-assault-bodily-injury-family": bodilyInjury,
  "tx-pc-22-01-family-prior": bodilyInjury,
  "tx-pc-22-01-family-breath": impeding,
  "tx-pc-22-01-family-breath-prior": impeding,
  "tx-dui-first-offense": misdemeanorDwi,
  "tx-dui-second-offense": misdemeanorDwi,
  "tx-dwi-open-container": misdemeanorDwi,
  "tx-dwi-bac-015": misdemeanorDwi,
};
