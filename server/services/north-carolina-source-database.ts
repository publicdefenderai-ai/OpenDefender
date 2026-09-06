import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildNorthCarolinaSourceDatabaseSeed,
  type NorthCarolinaAuthorityManifest,
} from "../data/north-carolina-source-database-seed";

export async function getCurrentNorthCarolinaSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("NC");
}

export async function seedNorthCarolinaSourceDatabase(
  manifest: NorthCarolinaAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildNorthCarolinaSourceDatabaseSeed(manifest));
}

export async function getNorthCarolinaSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("NC");
}

export async function getNorthCarolinaChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("NC", chargeId);
}

export const northCarolinaSourceDatabase = {
  seed: seedNorthCarolinaSourceDatabase,
  getStatus: getNorthCarolinaSourceDatabaseStatus,
  getChargeProvenance: getNorthCarolinaChargeProvenance,
};