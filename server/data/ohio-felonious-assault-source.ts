import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioAssaultDocument as document, OHIO_AGGRAVATED_ASSAULT_SOURCE } from "./ohio-assault-source";
import { ohioHomicideDocument as common } from "./ohio-chapter-2903-additional-source";
import { ohioManslaughterDocument as sentencing } from "./ohio-manslaughter-source";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

const definitions = createOhioEvidenceReader(
  "scripts/data-review/output/ohio-felonious-assault-definition-evidence.json", {
    "2929.01": "03652e46d045e9dd83f4c67c1bcddf66ea04bf8fddc89c68cbec357fe6af8df9",
  });

export const OHIO_FELONIOUS_ASSAULT_SOURCE: OhioChapter2903PilotSourceRecord = {
  chargeId: "oh-orc-2903-11-felonious-assault", canonicalTitle: "Felonious assault",
  offense: document("2903.11", null, [
    ["offense", "(A)"], ["offense", "(1) Cause"], ["offense", "(2) Cause"],
    ["offense", "(B)"], ["offense", "(1) Engage"], ["offense", "(2) Engage"], ["offense", "(3) Engage"],
    ["offense", "(C)"], ["grading", "(D)(1)(a)"], ["grading", "(b) Regardless"],
    ["penalty", "(2) In addition"], ["penalty", "(3) If the victim"], ["penalty", "(4) In addition"],
    ["offense", "(E)"], ["offense", '(1) "Deadly weapon"'], ["offense", '(2) "Motor vehicle"'],
    ["offense", '(3) "Peace officer"'], ["offense", '(4) "Sexual conduct"'],
    ["offense", '(5) "Investigator of the bureau'], ["offense", '(6) "Investigator"'],
  ]),
  penalty: common("2929.14", "(A)(2)", [
    ["penalty", "(2)(a) For a felony of the second degree"], ["penalty", "(b) For a felony of the second degree"],
  ]),
  penaltyFine: common("2929.18", "(A)(3)(b)", [["penalty", "(b) For a felony of the second degree"]]),
  additionalEvidence: [
    // Both assault sections adopt these harm/culpability/weapon/pregnancy and
    // protected-victim definitions. Our own E5 is already in the offense text.
    ...OHIO_AGGRAVATED_ASSAULT_SOURCE.additionalEvidence!.filter(row => row.section !== "2903.11"),
    document("2907.01", "(A)", [["offense", '(A) "Sexual conduct"']]),
    document("4501.01", "(B)", [["offense", '(B) "Motor vehicle"']]),
  ],
  additionalPenalties: [
    common("2929.14", "(A)(1)", [
      ["penalty", "(1)(a) For a felony of the first degree"], ["penalty", "(b) For a felony of the first degree"],
    ]),
    common("2929.18", "(A)(3)(a)", [["penalty", "(a) For a felony of the first degree"]]),
    common("2929.144", null, [
      ["penalty", "(A)"], ["penalty", "(B)"],
      ["penalty", "(1) If the offender is being sentenced for one felony"],
      ["penalty", "(2) If the offender is being sentenced for more than one felony"],
      ["penalty", "(3) If the offender is being sentenced for more than one felony"],
    ]),
    sentencing("2929.13", null, [["penalty", "(D)(1)"], ["penalty", "(F)"], ["penalty", "(4) A felony violation"]]),
    common("2929.14", null, [
      ["penalty", "(8) If an offender is convicted"],
      ["penalty", "(9)(a)"], ["penalty", "(i) The violation is a violation"],
      ["penalty", "(ii) The violation is a violation"], ["penalty", "(b) If a court imposes a prison term"],
      ["penalty", "(10) If an offender is convicted"],
      ["penalty", "(6) If a mandatory prison term"], ["penalty", "(7) If a mandatory prison term"],
    ]),
    document("2941.1423", null, [["penalty", "Imposition of a mandatory prison term"]]),
    document("2941.1425", null, [
      ["penalty", "(A)"], ["penalty", "(1) Regarding"], ["penalty", "(2) Regarding"], ["penalty", "(B)"], ["penalty", "(C)"],
    ]),
    document("2941.1426", null, [["penalty", "(A)"], ["penalty", "(B)"], ["penalty", "(C)"]]),
    definitions("2929.01", null, [["penalty", '(EEE) "Accelerant"'], ["penalty", '(FFF) "Permanent disabling harm"']]),
    sentencing("4510.02", "(A)(2)", [["penalty", "(A)"], ["penalty", "(2) For a class two"]]),
    sentencing("2971.01", null, [
      ["penalty", "(B)"], ["penalty", "(1) A violation of section 2903.01"],
      ["penalty", "(H)(1)"], ["penalty", "(I)"], ["penalty", "(J)"], ["penalty", "(K)"],
    ]),
    sentencing("2941.147", null, [["penalty", "(A)"]]),
    sentencing("2941.148", null, [["penalty", "(A)(1)"]]),
    sentencing("2971.03", null, [
      ["penalty", "(A)"], ["penalty", "(3)(a)"], ["penalty", "(4) Except"], ["penalty", "(5) Notwithstanding"],
    ]),
  ],
};