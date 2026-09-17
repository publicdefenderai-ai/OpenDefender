import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioHomicideDocument as common, ohioPregnancyEvidence } from "./ohio-chapter-2903-additional-source";
import { ohioManslaughterDocument as sentencing } from "./ohio-manslaughter-source";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

// Reviewed pins remain separate from acquisition. Aggravated assault uses
// §2903.11 below only for its adopted investigator definition; the full
// felonious-assault record is registered separately with its own dependencies.
const document = createOhioEvidenceReader(
  "scripts/data-review/output/ohio-assault-support-evidence.json", {
    "2903.11": "33bf447290ec7aa5faedc29abdb637402bc4e4c8c18a315514f1d84f5a8d1c01",
    "2903.12": "520680c85587dac6fb8786fdbfa7d5833e0ffb602d167ff27f668c91046a37b0",
    "2901.01": "08b4bb21dd02617e54825a9e6f2ea6b218b9fb6893591dff3d3d2f83393c8149",
    "2935.01": "4ea31dbffe9b7a1e863be526edfb96e43aca1412d56fa409a3b07b378418f9eb",
    "109.541": "05e392524cbff561ca611e9f7e8e2393d76ce2799799e0b8e317befe4e532070",
    "2907.01": "0231566d337eda04cb7ba1697265fe81eea30062ba5e02e50415f3fd74cb702b",
    "4501.01": "a58b6c6ea02bbfb84d6380f318ce7f1170741b54e8d188a7f8cf70d87a8d5dea",
    "2941.1425": "ea3376b1dfd5a47eaa632e8a16b37f092dd009fb6c3f7293faeccca3061224e0",
    "2941.1426": "c05e7e1a8ea4312a9f481973769a94abc12d80a9e4a5f12295b8949a427af640",
    "2941.1423": "afcc0fcf91cccfc35084d5a82e50f70a2794e4bc07768108172443695b1825aa",
  });
const definitions = createOhioEvidenceReader(
  "scripts/data-review/output/ohio-assault-definition-evidence.json", {
    "109.54": "399ce873ddf9fe7dd319af4a3c5e419cb4dd507f299b7f6698c325a5d5de16e7",
    "2935.081": "0ebb70a9ab58f8f00f0d1db08e31b93671949643903ec80c3fb8043b94b6bf74",
  });

export { document as ohioAssaultDocument };

export const OHIO_AGGRAVATED_ASSAULT_SOURCE: OhioChapter2903PilotSourceRecord = {
  chargeId: "oh-orc-2903-12-aggravated-assault", canonicalTitle: "Aggravated assault",
  offense: document("2903.12", null, [
    ["offense", "(A)"], ["offense", "(1) Cause"], ["offense", "(2) Cause"],
    ["grading", "(B)"], ["offense", "(C)"],
    ["offense", '(1) "Investigator'], ["offense", '(2) "Peace officer"'],
  ]),
  penalty: common("2929.14", "(A)(4)", [["penalty", "(4) For a felony of the fourth degree"]]),
  penaltyFine: common("2929.18", "(A)(3)(d)", [["penalty", "(d) For a felony of the fourth degree"]]),
  additionalEvidence: [
    common("2901.22", null, [["offense", "(B)"]]),
    ohioPregnancyEvidence,
    common("2923.11", null, [["offense", "(A)"], ["offense", "(K)"], ["offense", "(L)"]]),
    document("2901.01", null, [
      ["offense", '(3) "Physical harm to persons"'], ["offense", '(5) "Serious physical harm to persons"'],
      ["offense", "(a) Any mental"], ["offense", "(b) Any physical harm"],
      ["offense", "(c) Any physical harm"], ["offense", "(d) Any physical harm"], ["offense", "(e) Any physical harm"],
    ]),
    document("2935.01", null, [["offense", '(B) "Peace officer"']]),
    document("2903.11", "(E)(5)", [["offense", '(5) "Investigator of the bureau']]),
    document("109.541", null, [["offense", "(A)"], ["offense", '(1) "Investigator"'], ["offense", "(B)"]]),
    definitions("109.54", null, [["offense", "(A)"], ["offense", "(B)"]]),
    // Preserve the limited "as used in this section" scope: this oath-taking
    // exception does not itself exclude troopers from assault protections.
    definitions("2935.081", null, [["offense", "(A)"], ["offense", "(B)"], ["offense", "(C)"]]),
  ],
  additionalPenalties: [
    common("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]),
    common("2929.18", "(A)(3)(c)", [["penalty", "(c) For a felony of the third degree"]]),
    common("2929.14", "(B)(8)", [["penalty", "(8) If an offender is convicted"]]),
    document("2941.1423", null, [["penalty", "Imposition of a mandatory prison term"]]),
    sentencing("2929.13", null, [["penalty", "(F) Notwithstanding"], ["penalty", "(4) A felony violation"]]),
  ],
};