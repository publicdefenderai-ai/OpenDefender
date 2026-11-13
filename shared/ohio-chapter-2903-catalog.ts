import { OHIO_CIVIL_RIGHTS_BATCH } from "./ohio-civil-rights-batch";
import { OHIO_ANIMAL_PROTECTION_BATCH } from "./ohio-animal-protection-batch";
import { OHIO_TOOLS_TRANSACTIONS_BATCH } from "./ohio-tools-transactions-batch";
import { OHIO_DANGEROUS_DRIVING_BATCH } from "./ohio-dangerous-driving-batch";
import { OHIO_CRASH_IDENTITY_BATCH } from "./ohio-crash-identity-batch";
import { OHIO_DRIVING_LICENSE_BATCH } from "./ohio-driving-license-batch";
import { OHIO_GAMBLING_BATCH } from "./ohio-gambling-batch";
import { OHIO_WEAPONS_LOCATION_BATCH } from "./ohio-weapons-location-batch";
import { OHIO_DRUG_REMAINDER_BATCH } from "./ohio-drug-remainder-batch";
import { OHIO_DRUG_CONDUCT_BATCH } from "./ohio-drug-conduct-batch";
import { OHIO_COMMERCIAL_SEX_BATCH } from "./ohio-commercial-sex-batch";
import { OHIO_PRIORITY_GAPS_BATCH } from "./ohio-priority-gaps-batch";
import { OHIO_PRIVACY_BATCH } from "./ohio-privacy-batch";
import { OHIO_PROTECTION_BATCH } from "./ohio-protection-batch";
import { OHIO_FAMILY_BATCH } from "./ohio-family-batch";
import { OHIO_PUBLIC_PEACE_BATCH } from "./ohio-public-peace-batch";
import { OHIO_CUSTODY_BATCH } from "./ohio-custody-batch";
import { OHIO_JUSTICE_BATCH } from "./ohio-justice-batch";
import { OHIO_BENEFITS_FRAUD_BATCH } from "./ohio-benefits-fraud-batch";
import { OHIO_THEFT_FRAUD_BATCH } from "./ohio-theft-fraud-batch";
import { OHIO_RESIDUAL_BATCH } from "./ohio-residual-batch";
import { OHIO_MAJOR_BATCH } from "./ohio-major-batch";
/**
 * Ohio source-first catalog assembled from independently gated batches.
 *
 * These are new canonical records, deliberately separate from the older
 * degree-labelled Ohio rows.  The older IDs are not aliases: a saved case
 * using one must be reselected rather than silently changed into either
 * statutory offense.
 *
 * Historical export names remain compatible with the initial Chapter 2903
 * pilot. The reviewed catalog batch also covers other Ohio chapters. Complete
 * official text and approval/refresh gates stay server-side; selectors receive
 * only public summaries, not full statute evidence.
 */
import type { CriminalCharge } from "./criminal-charges";
import { OHIO_CHAPTER_2903_ADDITIONAL_CHARGES } from "./ohio-chapter-2903-additional-catalog";
import { OHIO_MANSLAUGHTER_CHARGES } from "./ohio-manslaughter-catalog";
import { OHIO_AGGRAVATED_ASSAULT_CHARGE } from "./ohio-aggravated-assault";
import { OHIO_FELONIOUS_ASSAULT_CHARGE } from "./ohio-felonious-assault";
import { OHIO_CHAPTER_BATCH_CHARGES } from "./ohio-chapter-batch";
import { OHIO_HAZING_AND_PROTECTION_CHARGES } from "./ohio-hazing-and-protection";
import { OHIO_PATIENT_CARE_BATCH } from "./ohio-patient-care";
import { OHIO_REVIEWED_BATCH } from "./ohio-reviewed-batch";

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
  ...OHIO_CHAPTER_2903_ADDITIONAL_CHARGES,
  ...OHIO_MANSLAUGHTER_CHARGES,
  OHIO_AGGRAVATED_ASSAULT_CHARGE,
  OHIO_FELONIOUS_ASSAULT_CHARGE,
  ...OHIO_CHAPTER_BATCH_CHARGES,
  ...OHIO_HAZING_AND_PROTECTION_CHARGES,
  ...OHIO_PATIENT_CARE_BATCH.charges,
  ...OHIO_REVIEWED_BATCH.charges,
  ...OHIO_MAJOR_BATCH.charges,
  ...OHIO_RESIDUAL_BATCH.charges,
  ...OHIO_THEFT_FRAUD_BATCH.charges,
  ...OHIO_BENEFITS_FRAUD_BATCH.charges,
  ...OHIO_JUSTICE_BATCH.charges,
  ...OHIO_CIVIL_RIGHTS_BATCH.charges,
  ...OHIO_ANIMAL_PROTECTION_BATCH.charges,
  ...OHIO_TOOLS_TRANSACTIONS_BATCH.charges,
  ...OHIO_DANGEROUS_DRIVING_BATCH.charges,
  ...OHIO_CRASH_IDENTITY_BATCH.charges,
  ...OHIO_DRIVING_LICENSE_BATCH.charges,
  ...OHIO_GAMBLING_BATCH.charges,
  ...OHIO_WEAPONS_LOCATION_BATCH.charges,
  ...OHIO_DRUG_REMAINDER_BATCH.charges,
  ...OHIO_DRUG_CONDUCT_BATCH.charges,
  ...OHIO_COMMERCIAL_SEX_BATCH.charges,
  ...OHIO_PRIORITY_GAPS_BATCH.charges,
  ...OHIO_PRIVACY_BATCH.charges,
  ...OHIO_PROTECTION_BATCH.charges,
  ...OHIO_FAMILY_BATCH.charges,
  ...OHIO_PUBLIC_PEACE_BATCH.charges,
  ...OHIO_CUSTODY_BATCH.charges,
];

export const OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION = new Set([
  // §2909.05 is felony-graded; the old misdemeanor identity must be reselected.
  "oh-vandalism",
  "oh-insurance-fraud",
  "oh-domestic-violence",
  // Older common-charge IDs have materially different scope/penalty claims.
  // Keep saved IDs intact and require an explicit source-backed selection.
  // The legacy menacing entry retains the superseded 2903.22 source version.
  // Use the corrected source-first entry, with explicit reselection for saved cases.
  "oh-menacing",
  "oh-open-container",
  "oh-alcohol-in-park",
  "oh-littering",
  "oh-animal-cruelty-misdemeanor",
  "oh-illegal-fireworks",
  "oh-minor-in-possession",
  "oh-assault-with-deadly-weapon",
  "oh-assault-on-peace-officer",
  "oh-aggravated-assault",
  "oh-voluntary-manslaughter",
  "oh-involuntary-manslaughter",
  "oh-criminally-negligent-homicide",
  "oh-murder-in-the-first-degree",
  "oh-murder-in-the-second-degree",
  "oh-felony-murder",
]);