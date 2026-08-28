import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildFloridaSourceDatabaseSeed,
  type FloridaAuthorityManifest,
} from "../data/florida-source-database-seed";

export async function getCurrentFloridaSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("FL");
}

export async function seedFloridaSourceDatabase(
  manifest: FloridaAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildFloridaSourceDatabaseSeed(manifest));
}

export async function getFloridaSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("FL");
}

export async function getFloridaChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("FL", chargeId);
}

export const floridaSourceDatabase = {
  seed: seedFloridaSourceDatabase,
  getStatus: getFloridaSourceDatabaseStatus,
  getChargeProvenance: getFloridaChargeProvenance,
};