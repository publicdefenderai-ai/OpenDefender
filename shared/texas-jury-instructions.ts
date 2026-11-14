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

export const texasVerifiedInstructions: Readonly<Record<string, typeof bodilyInjury | undefined>> = {
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
