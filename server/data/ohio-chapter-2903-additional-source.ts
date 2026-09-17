import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import type { OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

// Deliberate reviewed pins, independent of the acquisition output. Re-acquiring
// changed text cannot silently approve it or preserve claims based on old text.
const pins: Record<string, string> = {
  "2903.041": "0ee3f4a32056bb861337e69ec3a5a54a7a2fef7804c5df18e1d03d662c05da2b",
  "2903.05": "6941264ad0ab8c204d39b5016731f1aa1c704888a29ea704911dc0d5b8117b8f",
  "2903.14": "a58df3f315fc64e7e783c2ecb7210b8ba5a1f70ba2f8e7aa7fcb71a874548b7b",
  "2901.22": "a64e2a1a3f81c9e138288712c827a9311fa80665201064dbb3efdd546d2a7b8a",
  "2903.09": "fca8ade933ae4def112ee7aa6acc0944eb69ab528fa65a9476192ceb688a2c4d",
  "2923.11": "aa1de5ed1cafc9d5bd97493367b5890e851e466f7dad5c2d92767b98d33cb44a",
  "2929.14": "a2ae7ae19aa5af27cd23a3e8d8bd0ff63feb7fb66f7ed547d3681cff251ef247",
  "2929.144": "efa7496015b72ae01ca3eabb7a9405b89b2dda2316f91f890abc5630b5a70150",
  "2929.18": "16be4838aae75376786627fb808779da40c69017e9526ddf1117c55adb14c27d",
  "2929.24": "a21fe423e19a52a85454f69efb36773ebad870c6b8e23866982dda873aae7385",
  "2929.28": "c1468dc2d812517e755b4e1b5156d3393415b2028e0a37f02a20b3922da33561",
};
const document = createOhioEvidenceReader(
  "scripts/data-review/output/ohio-homicide-support-evidence.json", pins);

const culpability = document("2901.22", null, [["offense", "(C)"], ["offense", "(D)"]]);
const pregnancy = document("2903.09", null, [
  ["offense", "(A)"], ["offense", "(B)"], ["offense", "(C)"],
  ["offense", "(1) Except"], ["offense", "(2) In a manner"],
  ["offense", "(a) Her"], ["offense", "(b) Her"], ["offense", "(c) Her"],
  ["offense", "(d) Her"], ["offense", "(e) Her"],
]);
export { document as ohioHomicideDocument, pregnancy as ohioPregnancyEvidence };
const weapons = document("2923.11", null, [["offense", "(A)"], ["offense", "(K)"], ["offense", "(L)"]]);

export const OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS: OhioChapter2903PilotSourceRecord[] = [
  {
    chargeId: "oh-orc-2903-041-reckless-homicide", canonicalTitle: "Reckless homicide",
    offense: document("2903.041", null, [["offense", "(A)"], ["grading", "(B)"]]),
    penalty: document("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]),
    penaltyFine: document("2929.18", "(A)(3)(c)", [["penalty", "(c) For a felony of the third degree"]]),
    additionalEvidence: [culpability, pregnancy],
  },
  {
    chargeId: "oh-orc-2903-05-negligent-homicide", canonicalTitle: "Negligent homicide",
    offense: document("2903.05", null, [["offense", "(A)"], ["grading", "(B)"]]),
    penalty: document("2929.24", "(A)(1)", [["penalty", "(1) For a misdemeanor of the first degree"]]),
    penaltyFine: document("2929.28", "(A)(2)(a)(i)", [["penalty", "(i) For a misdemeanor of the first degree"]]),
    additionalEvidence: [culpability, pregnancy, weapons],
  },
  {
    chargeId: "oh-orc-2903-14-negligent-assault", canonicalTitle: "Negligent assault",
    offense: document("2903.14", null, [["offense", "(A)"], ["grading", "(B)"]]),
    penalty: document("2929.24", "(A)(3)", [["penalty", "(3) For a misdemeanor of the third degree"]]),
    penaltyFine: document("2929.28", "(A)(2)(a)(iii)", [["penalty", "(iii) For a misdemeanor of the third degree"]]),
    additionalEvidence: [culpability, pregnancy, weapons],
  },
];