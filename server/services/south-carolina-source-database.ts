import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildSouthCarolinaSourceDatabaseSeed,
  type SouthCarolinaAuthorityManifest,
} from "../data/south-carolina-source-database-seed";

export function getCurrentSouthCarolinaSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("SC");
}

export function seedSouthCarolinaSourceDatabase(
  manifest: SouthCarolinaAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildSouthCarolinaSourceDatabaseSeed(manifest));
}

export function getSouthCarolinaSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("SC");
}

export function getSouthCarolinaChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("SC", chargeId);
}

export const southCarolinaSourceDatabase = {
  seed: seedSouthCarolinaSourceDatabase,
  getStatus: getSouthCarolinaSourceDatabaseStatus,
  getChargeProvenance: getSouthCarolinaChargeProvenance,
};