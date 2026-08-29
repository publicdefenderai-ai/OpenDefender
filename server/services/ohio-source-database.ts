import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildOhioSourceDatabaseSeed,
  type OhioAuthorityManifest,
} from "../data/ohio-source-database-seed";

export async function getCurrentOhioSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("OH");
}

export async function seedOhioSourceDatabase(
  manifest: OhioAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildOhioSourceDatabaseSeed(manifest));
}

export async function getOhioSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("OH");
}

export async function getOhioChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("OH", chargeId);
}

export const ohioSourceDatabase = {
  seed: seedOhioSourceDatabase,
  getStatus: getOhioSourceDatabaseStatus,
  getChargeProvenance: getOhioChargeProvenance,
};