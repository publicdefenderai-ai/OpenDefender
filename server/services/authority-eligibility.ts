import { getSelectableCharges } from "@shared/criminal-charges";
import { getCurrentNewYorkSelectableChargeIds } from "./new-york-source-database";
import { getCurrentTexasSelectableChargeIds } from "./texas-source-database";

export const AUTHORITY_BACKED_JURISDICTIONS = new Set(["NY", "TX"]);

export async function getCurrentAuthoritySelectableChargeIds(): Promise<Set<string>> {
  const [newYork, texas] = await Promise.all([
    getCurrentNewYorkSelectableChargeIds(),
    getCurrentTexasSelectableChargeIds(),
  ]);
  const allowed = new Set<string>();
  for (const charge of getSelectableCharges()) {
    if (!AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
        (charge.jurisdiction === "NY" && newYork.has(charge.id)) ||
        (charge.jurisdiction === "TX" && texas.has(charge.id))) {
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