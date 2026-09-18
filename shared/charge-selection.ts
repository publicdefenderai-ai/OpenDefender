export type ChargeSelection = {
  id: string;
  /** Canonical English identity used by explanation lookup. */
  name: string;
  /** Localized label shown back to the user. */
  displayName: string;
};

export function toChargeSelection(charge: {
  id: string;
  name: string;
  canonicalName: string;
}): ChargeSelection {
  return {
    id: charge.id,
    name: charge.canonicalName || charge.name,
    displayName: charge.name,
  };
}