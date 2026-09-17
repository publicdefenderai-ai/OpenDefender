import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioAssaultDocument as assault } from "./ohio-assault-source";
import { ohioHomicideDocument as common, ohioPregnancyEvidence } from "./ohio-chapter-2903-additional-source";
import { ohioManslaughterDocument as sentencing } from "./ohio-manslaughter-source";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

// Deliberately separate from acquisition: refreshed text must not self-approve.
const document = createOhioEvidenceReader("scripts/data-review/output/ohio-chapter-batch-evidence.json", {
  "2903.15": "905320fe43ec3ad62ea088d8f6a8543128b03660c05ead28efc404f6a1aae2ec",
  "2903.18": "75dd392102d31ca1c9056ea17a84a6d5417a4eb755483587f7743b5208b78003",
  "2903.21": "f44a3b3ba086388087ecc1083a16aa1ee56042c06281db88f53d79b03643f3db",
  "2919.25": "21999c9671f0de43ec4e21da6a1f43d1f2d7fdec9cba7ac036a1d9fa9b0bd239",
  "3113.31": "38da18a7adf19248ec9c16251631c47332caf19bc00cf9e61f8cea77621eceb9",
  "2901.21": "f5a0445be0d9e6471277a96849e2b5631bcf4e1c54f3cdc46f3f430012677cf7",
  "5153.01": "f2b062c8e9ed1334658a30e02cae48eee21facd3e8fe02cbd0fa2582d072885d",
  "5153.02": "5ff13b9756e72cdc39bb2d3b96c1ebeccc7b49219705966c1c2c1b2252fccae3",
});
const harm = assault("2901.01", "(A)(3)-(6)", [
  ["offense", '(3) "Physical harm to persons"'], ["offense", '(4) "Physical harm to property"'],
  ["offense", '(5) "Serious physical harm to persons"'], ["offense", "(a) Any mental"],
  ["offense", "(b) Any physical"], ["offense", "(c) Any physical"],
  ["offense", "(d) Any physical"], ["offense", "(e) Any physical"],
  ["offense", '(6) "Serious physical harm to property"'],
  ["offense", "(a) Results in substantial"], ["offense", "(b) Temporarily prevents"],
]);
const violence = assault("2901.01", "(A)(9)", [
  ["offense", '(9) "Offense of violence"'], ["offense", "(a) A violation of section 2903.01"],
  ["offense", "(b) A violation of an existing"], ["offense", "(c) An offense, other than"],
  ["offense", "(d) A conspiracy"], ["offense", "(e) A violation of division"],
]);
const knowing = common("2901.22", "(B)", [["offense", "(B) A person acts knowingly"]]);
const f3 = common("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]);
const f4 = common("2929.14", "(A)(4)", [["penalty", "(4) For a felony of the fourth degree"]]);
const f5 = common("2929.14", "(A)(5)", [["penalty", "(5) For a felony of the fifth degree"]]);
const fine = (letter: string, degree: string) => common("2929.18", `(A)(3)(${letter})`,
  [["penalty", `(${letter}) For a felony of the ${degree} degree`]]);
const indefinite = common("2929.144", null, [
  ["penalty", "(A) As used"], ["penalty", "(B) The court"],
  ["penalty", "(1) If the offender is being sentenced for one felony"],
  ["penalty", "(2) If the offender is being sentenced for more than one felony"],
  ["penalty", "(3) If the offender is being sentenced for more than one felony"],
]);
const prisonRules = sentencing("2929.13", null, [
  ["penalty", "(D)(1) Except"], ["penalty", "(F) Notwithstanding"],
  ["penalty", "(6) Any offense that is a first"], ["penalty", "(7) Any offense that is a third"],
]);

export const OHIO_CHAPTER_BATCH_SOURCES: OhioChapter2903PilotSourceRecord[] = [
  {
    chargeId: "oh-orc-2903-21-aggravated-menacing", canonicalTitle: "Aggravated menacing",
    offense: document("2903.21", null, [["offense", "(A)"], ["grading", "(B)"], ["offense", "(C)"]]),
    penalty: common("2929.24", "(A)(1)", [["penalty", "(1) For a misdemeanor of the first degree"]]),
    penaltyFine: common("2929.28", "(A)(2)(a)(i)", [["penalty", "(i) For a misdemeanor of the first degree"]]),
    additionalEvidence: [
      knowing, harm, violence, ohioPregnancyEvidence,
      document("5153.01", "(A)", [["offense", "(A) As used in the Revised Code"]]),
      document("5153.02", null, [["offense", "Each county shall"], ["offense", "(A)"], ["offense", "(B)"], ["offense", "(C)"]]),
    ],
    additionalPenalties: [f5, fine("e", "fifth"), f4, fine("d", "fourth")],
  },
  {
    chargeId: "oh-orc-2903-15-permitting-child-abuse", canonicalTitle: "Permitting child abuse",
    offense: document("2903.15", null, [["offense", "(A)"], ["offense", "(B)"], ["grading", "(C)"]]),
    penalty: f3, penaltyFine: fine("c", "third"),
    additionalEvidence: [
      harm,
      document("2901.21", null, [
        ["offense", "(A)"], ["offense", "(1) The person's liability"], ["offense", "(2) The person has"],
        ["offense", "(B)"], ["offense", "(C)(1)"], ["offense", "(2) Division"], ["offense", "(3) Division"],
      ]),
      common("2901.22", "(C)", [["offense", "(C) A person acts recklessly"]]),
    ],
    additionalPenalties: [
      common("2929.14", "(A)(1)", [["penalty", "(1)(a) For a felony of the first degree"], ["penalty", "(b) For a felony of the first degree"]]),
      fine("a", "first"), indefinite, prisonRules,
    ],
  },
  {
    chargeId: "oh-orc-2903-18-strangulation", canonicalTitle: "Strangulation",
    offense: document("2903.18", null, [
      ["offense", "(A)"], ["offense", '(1) "Strangulation'], ["offense", '(2) "Dating'],
      ["offense", '(3) "Family'], ["offense", '(4) "Person with whom'],
      ["offense", "(B)"], ["offense", "(1) Cause serious"], ["offense", "(2) Create a substantial"],
      ["offense", "(3) Cause or create"], ["grading", "(C)"], ["grading", "(1) A violation"],
      ["grading", "(2) A violation"], ["grading", "(3) A violation"], ["offense", "(D)"],
    ]),
    penalty: common("2929.14", "(A)(2)", [["penalty", "(2)(a) For a felony of the second degree"], ["penalty", "(b) For a felony of the second degree"]]),
    penaltyFine: fine("b", "second"),
    additionalEvidence: [
      knowing, harm, violence,
      assault("2901.01", "(A)(8)", [["offense", '(8) "Substantial risk"']]),
      // Adopt only A8: A9's adult-respondent condition is NOT imported into
      // 2903.18's own twelve-month relationship definition.
      document("3113.31", "(A)(8)", [["offense", '(8) "Dating relationship"']]),
      document("2919.25", "(F)(1)-(2)", [
        ["offense", '(1) "Family or household member"'], ["offense", "(a) Any of the following who is residing"],
        ["offense", "(i) A spouse"], ["offense", "(ii) A parent"], ["offense", "(iii) A parent"],
        ["offense", "(b) The natural parent"], ["offense", '(2) "Person living as a spouse"'],
      ]),
    ],
    additionalPenalties: [f3, fine("c", "third"), f4, fine("d", "fourth"), f5, fine("e", "fifth"), indefinite, prisonRules],
  },
];