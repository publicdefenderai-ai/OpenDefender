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
export const texasVerifiedInstructions: Readonly<Record<string, typeof bodilyInjury | undefined>> = {
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
