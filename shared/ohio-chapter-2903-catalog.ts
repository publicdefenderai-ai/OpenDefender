/**
 * Bounded source-first Ohio homicide pilot.
 *
 * These are new canonical records, deliberately separate from the older
 * degree-labelled Ohio rows.  The older IDs are not aliases: a saved case
 * using one must be reselected rather than silently changed into either
 * statutory offense.
 *
 * The complete official text, hashes, extraction spans, and penalty
 * dependencies live server-side in ohio-chapter-2903-source.ts so that the
 * selector bundle carries only the small public catalog payload.
 */
import type { CriminalCharge } from "./criminal-charges";

export const OHIO_CHAPTER_2903_PILOT_CHARGES: CriminalCharge[] = [
  {
    id: "oh-orc-2903-01-aggravated-murder",
    name: "Aggravated murder",
    // Retain the official statutory title in Spanish-language interfaces; the
    // explanatory description is translated separately below.
    nameEs: "Aggravated murder",
    code: "2903.01",
    jurisdiction: "OH",
    category: "felony",
    description:
      "Ohio Rev. Code § 2903.01 prohibits purposely causing a death or unlawful termination of another's pregnancy in the circumstances stated in that section.",
    descriptionEs:
      "La sección 2903.01 del Código Revisado de Ohio prohíbe causar intencionalmente una muerte o la terminación ilícita del embarazo de otra persona en las circunstancias indicadas en esa sección.",
    maxPenalty:
      "Ohio Rev. Code § 2929.02(A): “shall suffer death or be imprisoned for life, as determined pursuant to sections 2929.022, 2929.03, and 2929.04,” subject to the exceptions stated in that subsection. It also states that a fine may not exceed $25,000.",
    commonDefenses: [
      "This source-first pilot does not characterize case-specific defenses. Consult qualified Ohio defense counsel about the facts and charging documents.",
    ],
    evidenceToGather: [
      "Preserve the charging documents and any material needed to evaluate the exact statutory allegation with counsel.",
    ],
    specificRights: [
      "This source-first pilot does not state case-specific rights or procedural guidance.",
    ],
    urgentActions: [
      "Seek qualified Ohio criminal defense counsel promptly and avoid relying on this catalog entry for case-specific strategy.",
    ],
    statuteCitations: ["Ohio Rev. Code Ann. § 2903.01"],
    sourceUrls: [
      "https://codes.ohio.gov/ohio-revised-code/section-2903.01",
      "https://codes.ohio.gov/ohio-revised-code/section-2929.02",
    ],
    dataConfidence: "high",
    lastVerified: "2026-09",
  },
  {
    id: "oh-orc-2903-02-murder",
    name: "Murder",
    // Retain the official statutory title in Spanish-language interfaces; the
    // explanatory description is translated separately below.
    nameEs: "Murder",
    code: "2903.02",
    jurisdiction: "OH",
    category: "felony",
    description:
      "Ohio Rev. Code § 2903.02 prohibits purposely causing a death or unlawful termination of another's pregnancy and also addresses a death proximately resulting from certain first- or second-degree felony offenses of violence.",
    descriptionEs:
      "La sección 2903.02 del Código Revisado de Ohio prohíbe causar intencionalmente una muerte o la terminación ilícita del embarazo de otra persona y también aborda una muerte que resulte de manera próxima de determinados delitos violentos graves de primer o segundo grado.",
    maxPenalty:
      "Ohio Rev. Code § 2929.02(B)(1): “Except as otherwise provided in division (B)(2) or (3) of this section,” a person convicted of murder “shall be imprisoned for an indefinite term of fifteen years to life.” § 2929.02(B)(4) states that a fine may not exceed $15,000.",
    commonDefenses: [
      "This source-first pilot does not characterize case-specific defenses. Consult qualified Ohio defense counsel about the facts and charging documents.",
    ],
    evidenceToGather: [
      "Preserve the charging documents and any material needed to evaluate the exact statutory allegation with counsel.",
    ],
    specificRights: [
      "This source-first pilot does not state case-specific rights or procedural guidance.",
    ],
    urgentActions: [
      "Seek qualified Ohio criminal defense counsel promptly and avoid relying on this catalog entry for case-specific strategy.",
    ],
    statuteCitations: ["Ohio Rev. Code Ann. § 2903.02"],
    sourceUrls: [
      "https://codes.ohio.gov/ohio-revised-code/section-2903.02",
      "https://codes.ohio.gov/ohio-revised-code/section-2929.02",
    ],
    dataConfidence: "high",
    lastVerified: "2026-09",
  },
];

export const OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION = new Set([
  "oh-murder-in-the-first-degree",
  "oh-murder-in-the-second-degree",
  "oh-felony-murder",
]);