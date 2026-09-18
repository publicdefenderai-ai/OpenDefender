import {
  criminalCharges,
  getChargeById,
  type CriminalCharge,
} from "./criminal-charges";
import { isCaliforniaSelectableId } from "./california-authority";
import { OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION } from "./ohio-chapter-2903-catalog";

export type GuidanceChargeClassification = {
  id?: string;
  name: string;
  classification: string;
  categories?: CriminalCharge["categories"];
  code: string;
};

/**
 * Resolve guidance classifications through the canonical charge boundary.
 * Older saved guidance may have no ID, so its legacy code fallback is
 * normalized through getChargeById before it reaches the dashboard.
 */
export function resolveGuidanceCharge(
  classification: GuidanceChargeClassification,
  jurisdiction?: string,
): CriminalCharge | undefined {
  const isCalifornia = jurisdiction?.toUpperCase() === "CA" || classification.id?.startsWith("ca-");

  if (classification.id) {
    // The Ohio source-first pilot deliberately does not alias the historical
    // degree labels to either current statutory offense. Persisted guidance
    // must require reselection rather than reaching around getChargeById via
    // the legacy catalog fallback below.
    if (OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION.has(classification.id)) {
      return undefined;
    }

    const resolved = getChargeById(classification.id);
    if (isCalifornia) {
      return resolved && isCaliforniaSelectableId(classification.id) ? resolved : undefined;
    }
    return resolved ?? criminalCharges.find((charge) => charge.id === classification.id);
  }

  const legacyCharge = criminalCharges.find((charge) => charge.code === classification.code);
  if (!legacyCharge) return undefined;

  // Code-only records are another persisted legacy shape. The raw catalog
  // row may still be present even though getChargeById intentionally rejects
  // this Ohio ID, so do not return it as a silent fallback.
  if (OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION.has(legacyCharge.id)) {
    return undefined;
  }

  const resolved = getChargeById(legacyCharge.id);
  if (isCalifornia || legacyCharge.id.startsWith("ca-")) {
    return resolved && isCaliforniaSelectableId(legacyCharge.id) ? resolved : undefined;
  }
  return resolved ?? legacyCharge;
}