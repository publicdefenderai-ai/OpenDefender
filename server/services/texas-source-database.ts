import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildTexasSourceDatabaseSeed,
  type TexasAuthorityManifest,
} from "../data/texas-source-database-seed";

export async function getCurrentTexasSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("TX");
}

export async function seedTexasSourceDatabase(
  manifest: TexasAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildTexasSourceDatabaseSeed(manifest));
}

export async function getTexasSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("TX");
}

export async function getTexasChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("TX", chargeId);
}

export const texasSourceDatabase = {
  seed: seedTexasSourceDatabase,
  getStatus: getTexasSourceDatabaseStatus,
  getChargeProvenance: getTexasChargeProvenance,
};