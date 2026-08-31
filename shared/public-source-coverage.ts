/**
 * Jurisdictions included in the public-source expansion gate.
 *
 * This contract is consumed by both the server coverage builder and the
 * client-side report validator. Keep jurisdiction-specific source configuration
 * in the server data layer; this list defines only the gate's current scope.
 */
export const CURRENT_PUBLIC_SOURCE_JURISDICTIONS = Object.freeze([
  "CA",
  "FL",
  "GA",
  "IL",
  "NY",
  "OH",
  "PA",
  "SC",
  "TX",
] as const);

export type CurrentPublicSourceJurisdiction =
  (typeof CURRENT_PUBLIC_SOURCE_JURISDICTIONS)[number];