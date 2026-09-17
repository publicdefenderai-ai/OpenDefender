import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioHomicideDocument as common } from "./ohio-chapter-2903-additional-source";
import { ohioAssaultDocument as assault } from "./ohio-assault-source";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

// Reviewed pins are deliberately independent of the acquisition command.
const document = createOhioEvidenceReader("scripts/data-review/output/ohio-hazing-and-protection-evidence.json", {
  "2903.31": "20ac804b640373e1990b6bb7960dd01b5caf2c08abb1d5ee8445a93839366702",
  "2903.311": "12b5d44f561440ab687b8ff0be27676177e0efa342dca202161f48f5b764044b",
  "2903.32": "1f081bc0d78bdc4fd2723ba467a4a9fa4c640ab5a5f6386de05e7491bf13f6c6",
  "3719.011": "9e79fe1560a6114c3a9b5a4208bfdbc495f61e967a2e85b995e31ddbd2b3cd01",
  "3719.01": "56f01de8568bb3376a9ca471f399f319e5cb2a86746ec6f2ba842e73a745b0ce",
  "4729.01": "a312e6c912b331423e392f28b6cf2d413cba35b493ed8e12cda804db34346b2b",
  "2925.01": "94de4c8c92ad62726293fb59e34c003194d17fe3d260c27c61bbaed09761dc4e",
});
const reckless = common("2901.22", "(C)", [["offense", "(C) A person acts recklessly"]]);
const harm = assault("2901.01", "(A)(3),(5),(8)", [
  ["offense", '(3) "Physical harm to persons"'], ["offense", '(5) "Serious physical harm to persons"'],
  ["offense", "(a) Any mental"], ["offense", "(b) Any physical"], ["offense", "(c) Any physical"],
  ["offense", "(d) Any physical"], ["offense", "(e) Any physical"], ["offense", '(8) "Substantial risk"'],
]);
const hazingDefinitions = document("2903.31", "(A)", [
  ["offense", "(A)"], ["offense", '(1) "Hazing"'], ["offense", '(2) "Organization"'],
]);
const drugDefinitions = [
  document("3719.011", "(A)", [["offense", '(A) "Drug of abuse"']]),
  document("3719.01", "(C)", [["offense", '(C) "Controlled substance"']]),
  document("4729.01", "(F)", [
    ["offense", '(F) "Dangerous drug"'], ["offense", "(1) Any drug to which"],
    ["offense", '(a) Under the "Federal Food'], ["offense", "(b) Under Chapter"],
    ["offense", "(2) Any drug that contains"], ["offense", "(3) Any drug intended for administration"],
    ["offense", "(4) Any drug that is a biological product"],
  ]),
  document("2925.01", "(I)", [
    ["offense", '(I) "Harmful intoxicant"'], ["offense", "(1) Any compound, mixture"],
    ["offense", "(a) Any volatile"], ["offense", "(b) Any aerosol"], ["offense", "(c) Any fluorocarbon"],
    ["offense", "(d) Any anesthetic"], ["offense", "(2) Gamma Butyrolactone"], ["offense", "(3) 1,4 Butanediol"],
  ]),
];
const jail = (degree: "first" | "second" | "fourth", number: string) =>
  common("2929.24", `(A)(${number})`, [["penalty", `(${number}) For a misdemeanor of the ${degree} degree`]]);
const fine = (degree: "first" | "second" | "fourth", roman: string) =>
  common("2929.28", `(A)(2)(a)(${roman})`, [["penalty", `(${roman}) For a misdemeanor of the ${degree} degree`]]);

export const OHIO_HAZING_AND_PROTECTION_SOURCES: OhioChapter2903PilotSourceRecord[] = [
  {
    chargeId: "oh-orc-2903-31-hazing", canonicalTitle: "Hazing",
    offense: document("2903.31", null, [
      ["offense", "(A)"], ["offense", '(1) "Hazing"'], ["offense", '(2) "Organization"'],
      ["offense", "(B)(1)"], ["offense", "(C)(1)"],
      // Full distinct anchors: B2 and C2 otherwise begin with the same words.
      ["offense", "(2) No administrator, employee, faculty member, teacher, consultant, alumnus, or volunteer of any organization, including any primary, secondary, or post-secondary school or any other educational institution, public or private, shall recklessly permit the hazing of any person associated with the organization."],
      ["offense", "(2) No administrator, employee, faculty member, teacher, consultant, alumnus, or volunteer of any organization, including any primary, secondary, or post-secondary school or any other educational institution, public or private, shall recklessly permit the hazing of any person associated with the organization when the hazing includes coerced consumption"],
      ["grading", "(D)"],
    ]),
    penalty: jail("second", "2"), penaltyFine: fine("second", "ii"),
    additionalEvidence: [reckless, harm, ...drugDefinitions],
    additionalPenalties: [
      common("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]),
      common("2929.18", "(A)(3)(c)", [["penalty", "(c) For a felony of the third degree"]]),
    ],
  },
  {
    chargeId: "oh-orc-2903-311-reckless-failure-to-immediately-report-knowledge-of-hazing",
    canonicalTitle: "Reckless failure to immediately report knowledge of hazing",
    offense: document("2903.311", null, [["offense", "(A)"], ["offense", "(B)"], ["grading", "(C)"]]),
    penalty: jail("fourth", "4"), penaltyFine: fine("fourth", "iv"),
    additionalEvidence: [reckless, harm, hazingDefinitions, ...drugDefinitions],
    additionalPenalties: [jail("first", "1"), fine("first", "i")],
  },
  {
    chargeId: "oh-orc-2903-32-female-genital-mutilation", canonicalTitle: "Female genital mutilation",
    offense: document("2903.32", null, [
      ["offense", "(A)(1)"], ["offense", "(2) No person"], ["grading", "(B)"],
      ["offense", "(C)"], ["offense", "(D)"], ["offense", "(1) Cultural"],
      ["offense", "(2) Consent of the minor"], ["offense", "(3) Consent of the parent"],
      ["offense", "(E)"], ["offense", '(1) "Physician"'], ["offense", '(2) "Licensed health care professional"'],
    ]),
    penalty: common("2929.14", "(A)(2)", [
      ["penalty", "(2)(a) For a felony of the second degree"], ["penalty", "(b) For a felony of the second degree"],
    ]),
    penaltyFine: common("2929.18", "(A)(3)(b)", [["penalty", "(b) For a felony of the second degree"]]),
    additionalEvidence: [
      common("2901.22", "(A)-(B)", [["offense", "(A) A person acts purposely"], ["offense", "(B) A person acts knowingly"]]),
    ],
    additionalPenalties: [
      document("2903.32", "(B)", [["penalty", "(B) Whoever"]]),
      common("2929.144", null, [
        ["penalty", "(A) As used"], ["penalty", "(B) The court"],
        ["penalty", "(1) If the offender is being sentenced for one felony"],
        ["penalty", "(2) If the offender is being sentenced for more than one felony"],
        ["penalty", "(3) If the offender is being sentenced for more than one felony"],
      ]),
    ],
  },
];