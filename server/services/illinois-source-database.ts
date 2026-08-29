import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildIllinoisSourceDatabaseSeed,
  type IllinoisAuthorityManifest,
} from "../data/illinois-source-database-seed";

export function getCurrentIllinoisSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("IL");
}

export function seedIllinoisSourceDatabase(
  manifest: IllinoisAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildIllinoisSourceDatabaseSeed(manifest));
}

export function getIllinoisSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("IL");
}

export function getIllinoisChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("IL", chargeId);
}

export const illinoisSourceDatabase = {
  seed: seedIllinoisSourceDatabase,
  getStatus: getIllinoisSourceDatabaseStatus,
  getChargeProvenance: getIllinoisChargeProvenance,
};