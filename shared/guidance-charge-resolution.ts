import { isReviewedOhioChargeId } from "./ohio-reviewed-identity";
import {
  criminalCharges,
  getChargeById,
  type CriminalCharge,
} from "./criminal-charges";
import { isCaliforniaSelectableId } from "./california-authority";

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

  // A code alone may match several statutory branches. Saved Ohio cases
  // require the exact reviewed ID before showing an explanation.
  if (["OH", "OHIO"].includes(jurisdiction?.toUpperCase() ?? "") || classification.id?.startsWith("oh-")) {
    return classification.id && isReviewedOhioChargeId(classification.id)
      ? getChargeById(classification.id) : undefined;
  }

  if (classification.id) {
    const resolved = getChargeById(classification.id);
    if (isCalifornia) {
      return resolved && isCaliforniaSelectableId(classification.id) ? resolved : undefined;
    }
    return resolved ?? criminalCharges.find((charge) => charge.id === classification.id);
  }

  const legacyCharge = criminalCharges.find((charge) => charge.code === classification.code);
  if (!legacyCharge || legacyCharge.jurisdiction === "OH") return undefined;

  const resolved = getChargeById(legacyCharge.id);
  if (isCalifornia || legacyCharge.id.startsWith("ca-")) {
    return resolved && isCaliforniaSelectableId(legacyCharge.id) ? resolved : undefined;
  }
  return resolved ?? legacyCharge;
}