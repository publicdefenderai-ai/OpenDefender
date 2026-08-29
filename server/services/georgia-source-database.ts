import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import {
  buildGeorgiaSourceDatabaseSeed,
  type GeorgiaAuthorityManifest,
} from "../data/georgia-source-database-seed";

export async function getCurrentGeorgiaSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("GA");
}

export async function seedGeorgiaSourceDatabase(
  manifest: GeorgiaAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildGeorgiaSourceDatabaseSeed(manifest));
}

export async function getGeorgiaSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("GA");
}

export async function getGeorgiaChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("GA", chargeId);
}

export const georgiaSourceDatabase = {
  seed: seedGeorgiaSourceDatabase,
  getStatus: getGeorgiaSourceDatabaseStatus,
  getChargeProvenance: getGeorgiaChargeProvenance,
};