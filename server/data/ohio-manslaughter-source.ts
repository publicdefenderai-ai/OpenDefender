import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioHomicideDocument as common, ohioPregnancyEvidence } from "./ohio-chapter-2903-additional-source";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

const document = createOhioEvidenceReader(
  "scripts/data-review/output/ohio-manslaughter-support-evidence.json", {
    "2903.03": "e36bd07ee457ba2c40cccce0e4c1751513f486861120e3a2473ee9c196304c8c",
    "2903.04": "e063106ce2eae8f58ae685c39eff5779324855759962b7cae49019a78f7c00b8",
    "2971.01": "17ad0f082dbdf43854eaf1f5af4b667b728677d72a2e88d376f20363787e2ec7",
    "2971.03": "fe1ba29445fa38ca1a64b02f88719f1da68f8c0d4841f1352fa85eb806c6800e",
    "2941.147": "28df5c91f10b3412f7df3ade899af887ce1b6ba9bc0f198dfd51a3fc1d867523",
    "2941.148": "37247513de66003aae3a8fae87bf985dc7b606a6a02071e8ea8fb8ce8d3ea5b6",
    "4510.02": "16e0ca4d8dc66bce26fa3684ccad9deb38aa0fa156b590076a6351dbcb491448",
    "4511.19": "144bfefd79506d5e81b83dec2dc823c2e1485afb17e3feaa597a30266c8d7572",
    "2929.13": "7bca69aa68f4140838a5ec30c0cd59cc0d5a8bd75f920ef890bb34d1d7a507a7",
  });

const firstDegree = common("2929.14", "(A)(1)", [
  ["penalty", "(A) Except"], ["penalty", "(1)(a) For a felony of the first degree"],
  ["penalty", "(b) For a felony of the first degree"],
]);
const firstDegreeFine = common("2929.18", "(A)(3)(a)", [
  ["penalty", "(a) For a felony of the first degree"],
]);
const indefiniteMaximum = common("2929.144", null, [
  ["penalty", "(A) As used"], ["penalty", "(B) The court"],
  ["penalty", "(1) If the offender is being sentenced for one felony"],
  ["penalty", "(2) If the offender is being sentenced for more than one felony"],
  ["penalty", "(3) If the offender is being sentenced for more than one felony"],
]);
const prisonRules = document("2929.13", null, [
  ["penalty", "(D)(1) Except"], ["penalty", "(F) Notwithstanding"],
  ["penalty", "(4) A felony violation of section 2903.04"],
  ["penalty", "(6) Any offense that is a first"],
  ["penalty", "(7) Any offense that is a third"],
]);
const sexualDefinitions = document("2971.01", null, [
  ["offense", "(B)"], ["offense", "(1) A violation of section 2903.01"],
  ["offense", "(J)"], ["offense", "(K)"], ["offense", "(L)"],
]);

export const OHIO_MANSLAUGHTER_SOURCE_RECORDS: OhioChapter2903PilotSourceRecord[] = [
  {
    chargeId: "oh-orc-2903-03-voluntary-manslaughter", canonicalTitle: "Voluntary manslaughter",
    offense: document("2903.03", null, [
      ["offense", "(A)"], ["offense", "(B)"], ["grading", "(C)"], ["offense", "(D)"],
    ]),
    penalty: firstDegree, penaltyFine: firstDegreeFine,
    additionalEvidence: [
      common("2901.22", null, [["offense", "(B)"]]),
      ohioPregnancyEvidence, sexualDefinitions,
    ],
    additionalPenalties: [indefiniteMaximum, prisonRules],
  },
  {
    chargeId: "oh-orc-2903-04-involuntary-manslaughter", canonicalTitle: "Involuntary manslaughter",
    offense: document("2903.04", null, [
      ["offense", "(A)"], ["offense", "(B)"], ["grading", "(C)"],
      ["penalty", "(D)"], ["penalty", "(1) The court"], ["penalty", "(2) The court"],
    ]),
    penalty: firstDegree, penaltyFine: firstDegreeFine,
    additionalEvidence: [
      ohioPregnancyEvidence,
      document("4511.19", null, [["offense", "(A)(1)"], ["offense", "(B)"]]),
    ],
    additionalPenalties: [
      sexualDefinitions,
      common("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]),
      common("2929.18", "(A)(3)(c)", [["penalty", "(c) For a felony of the third degree"]]),
      indefiniteMaximum, prisonRules,
      document("4510.02", "(A)(1)", [["penalty", "(A)"], ["penalty", "(1) For a class one"]]),
      document("2941.147", null, [["penalty", "(A)"]]),
      document("2941.148", null, [["penalty", "(A)(1)"]]),
      document("2971.03", null, [
        ["penalty", "(A)"], ["penalty", "(3)(a)"], ["penalty", "(4) Except"], ["penalty", "(5) Notwithstanding"],
      ]),
    ],
  },
];