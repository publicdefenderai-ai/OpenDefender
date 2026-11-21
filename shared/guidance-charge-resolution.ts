import { needsTexasChargeReselection } from "./texas-reviewed";
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

  if (needsTexasChargeReselection(classification, jurisdiction)) return undefined;
  if (classification.id) {
    const resolved = getChargeById(classification.id);
    if (isCalifornia) {
      return resolved && isCaliforniaSelectableId(classification.id) ? resolved : undefined;
    }
    return resolved ?? criminalCharges.find((charge) => charge.id === classification.id);
  }

  // Older ID-less Texas answers can describe different branches under the same section.
  if (["TX", "TEXAS"].includes(jurisdiction?.toUpperCase() ?? "") && /^(?:20\.02|29\.04|49\.(?:02|04|045|07|08|09)|21\.(?:11|07|08)|22\.(?:01|011|012|02|021|04|041|07)|46\.(?:02|04|041|10)|25\.(?:07|11)|32\.(?:315|31|51)|521\.457|545\.420|550\.(?:021|022|024)|43\.(?:02|021|03|032|04)|33\.07|42\.(?:062|06|0601|07|072|09|091|092)|36\.06|37\.09|38\.(?:02|03|04|11|15)|28\.03|30\.(?:02|04|05)|31\.(?:03|07)|483\.041|481\.(?:115|1161?|117|121))(?:$|\()/.test(classification.code)) return undefined;

  const legacyCharge = criminalCharges.find((charge) => charge.code === classification.code);
  if (!legacyCharge || legacyCharge.jurisdiction === "OH") return undefined;

  const resolved = getChargeById(legacyCharge.id);
  if (isCalifornia || legacyCharge.id.startsWith("ca-")) {
    return resolved && isCaliforniaSelectableId(legacyCharge.id) ? resolved : undefined;
  }
  return resolved ?? legacyCharge;
}