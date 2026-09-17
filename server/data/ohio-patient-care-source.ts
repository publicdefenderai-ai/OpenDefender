import { OHIO_PATIENT_CARE_DEFINITIONS } from "../../shared/ohio-patient-care";
import { createOhioEvidenceReader } from "./ohio-pinned-evidence";
import { ohioAssaultDocument as assault } from "./ohio-assault-source";
import { ohioHomicideDocument as common } from "./ohio-chapter-2903-additional-source";
import type { OhioChapter2903OfficialDocument, OhioChapter2903PilotSourceRecord } from "./ohio-chapter-2903-source";

// Reviewed source pins are deliberately independent of acquisition and projection.
const document = createOhioEvidenceReader("scripts/data-review/output/ohio-patient-care-evidence.json", {
  "2903.33": "9903e3bf0a68c9748264ae54d551cf0dd4a9e004e2ab2270ccb21e18cc8bc36e",
  "2903.34": "bdb27abe731aa47309305e838889879ef6349e0cd4d220985b4f2f53702a59de",
  "2903.35": "909331931fea781441522b9764ddbba71be4d0a18c029f9b5ebc4131d39a9eb5",
  "3721.10": "a57d84917a9a96c311b08d6fdf832480f0de9f41aaa378486c4391cde7f358cd",
  "5123.19": "b3c0e1a675f73066fdab17b0a679774cf2f961d663551cb084ac1bd8f9fb772e",
  "5119.14": "ab071f5adf50e5c2966764ce47a5b5d862a1759fbb7070dff0b462c39cd039e7",
  "5123.03": "47848aa04a5af56e61f0e08397bbf57a197d2b635f7269a6248ebd5ec4436212",
  "5119.34": "d2cdce708cb52224363abcade6264194f5a1d1af9fbda992d9f8bea498adeabc",
  "3701.01": "27b9fa3187142ca467cd932cad2a21a56656735d1af2ead6ef58e95d4d0f1a1c",
  "3721.01": "b06ad5222ad4cac94c9afa0a2ee493d8523f680310569abdbb84b9ad5d22fc4b",
});

/** Preserve complete definition blocks, including nested exclusions, not selected opening lines. */
function definition(section: string, from: string, until?: string): OhioChapter2903OfficialDocument {
  const base = document(section, null, []);
  const start = base.text.indexOf(`\n${from}`) + 1;
  const end = until ? base.text.indexOf(`\n${until}`, start) : base.text.length;
  if (start === 0 || end <= start) throw new Error(`Missing reviewed definition block: ${section}`);
  return { ...base, quotedSpans: [...base.quotedSpans,
    { kind: "offense", quote: base.text.slice(start, end), start, end }] };
}

const facilityEvidence = [
  definition("3721.10", "(A)", "(B)"),
  definition("5123.19", "(A)", "(B)"),
  definition("5119.14", "(A)", "(B)"),
  definition("5123.03", "(A)", "(B)"),
  definition("5119.34", "(A)", "(C)"),
  definition("3701.01", '(C) "Hospital"', "(D)"),
  definition("3721.01", "(A)", "(B)"),
];
const definitions = definition("2903.33", '(A) "Care facility"');
const culpability = common("2901.22", "(A)-(C)", [
  ["offense", "(A) A person acts purposely"], ["offense", "(B) A person acts knowingly"],
  ["offense", "(C) A person acts recklessly"],
]);
const harm = assault("2901.01", "(A)(3),(5)", [
  ["offense", '(3) "Physical harm to persons"'], ["offense", '(5) "Serious physical harm to persons"'],
  ["offense", "(a) Any mental"], ["offense", "(b) Any physical"], ["offense", "(c) Any physical"],
  ["offense", "(d) Any physical"], ["offense", "(e) Any physical"],
]);
const supporting = [definitions, ...facilityEvidence, culpability, harm];
const penaltyRules = {
  M1: [
    common("2929.24", "(A)(1)", [["penalty", "(1) For a misdemeanor of the first degree"]]),
    common("2929.28", "(A)(2)(a)(i)", [["penalty", "(i) For a misdemeanor of the first degree"]]),
  ],
  M2: [
    common("2929.24", "(A)(2)", [["penalty", "(2) For a misdemeanor of the second degree"]]),
    common("2929.28", "(A)(2)(a)(ii)", [["penalty", "(ii) For a misdemeanor of the second degree"]]),
  ],
  F3: [
    common("2929.14", "(A)(3)(b)", [["penalty", "(b) For a felony of the third degree"]]),
    common("2929.18", "(A)(3)(c)", [["penalty", "(c) For a felony of the third degree"]]),
  ],
  F4: [
    common("2929.14", "(A)(4)", [["penalty", "(4) For a felony of the fourth degree"]]),
    common("2929.18", "(A)(3)(d)", [["penalty", "(d) For a felony of the fourth degree"]]),
  ],
  F5: [
    common("2929.14", "(A)(5)", [["penalty", "(5) For a felony of the fifth degree"]]),
    common("2929.18", "(A)(3)(e)", [["penalty", "(e) For a felony of the fifth degree"]]),
  ],
};

export const OHIO_PATIENT_CARE_SOURCES: OhioChapter2903PilotSourceRecord[] =
  OHIO_PATIENT_CARE_DEFINITIONS.map(row => {
    const patientOffense = row.code === "2903.34";
    const penalties = row.degrees.flatMap(degree => penaltyRules[degree]);
    return {
      chargeId: row.id, canonicalTitle: row.name,
      ...(patientOffense ? { nameBasis: "operative_clause" as const } : {}),
      offense: document(row.code, row.subdivision, [
        ["offense", "(A)"], ["offense", row.conductPrefix], ["grading", row.gradingPrefix],
        ...(patientOffense ? [
          ["offense", "(B)(1)"], ["offense", "(2) It is an affirmative defense"],
        ] as Array<["offense", string]> : []),
      ]),
      penalty: penalties[0], penaltyFine: penalties[1], additionalPenalties: penalties.slice(2),
      additionalEvidence: patientOffense ? supporting : [
        ...supporting, definition("2903.34", "(A)"),
      ],
    };
  });