import { getSelectableCharges } from "@shared/criminal-charges";
import { getCurrentAuthoritySelectableChargeIds as getCurrentJurisdictionAuthoritySelectableChargeIds } from "./authority-source-database";

export const AUTHORITY_BACKED_JURISDICTIONS = new Set(["NY", "TX", "FL", "PA", "SC"]);

export async function getCurrentAuthoritySelectableChargeIds(): Promise<Set<string>> {
  const byJurisdiction = new Map(
    await Promise.all(
      [...AUTHORITY_BACKED_JURISDICTIONS].map(async (jurisdiction) => [
        jurisdiction,
        await getCurrentJurisdictionAuthoritySelectableChargeIds(jurisdiction),
      ] as const),
    ),
  );
  const allowed = new Set<string>();
  for (const charge of getSelectableCharges()) {
    if (
      !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
      byJurisdiction.get(charge.jurisdiction)?.has(charge.id)
    ) {
      allowed.add(charge.id);
    }
  }
  return allowed;
}

export async function isCurrentAuthoritySelectable(chargeId: string): Promise<boolean> {
  return (await getCurrentAuthoritySelectableChargeIds()).has(chargeId);
}

export function filterAuthorityBackedCharges<T extends { jurisdiction: string; id: string }>(
  items: T[],
  allowedIds: Set<string>,
): T[] {
  return items.filter((item) =>
    !AUTHORITY_BACKED_JURISDICTIONS.has(item.jurisdiction) || allowedIds.has(item.id),
  );
}