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
import {
  FLORIDA_REVIEWED_SOURCE_RECORDS,
  isFloridaReviewedSourceFresh,
} from "../data/florida-reviewed-source-records";

export async function getCurrentFloridaSelectableChargeIds(): Promise<Set<string>> {
  const ids = await getCurrentAuthoritySelectableChargeIds("FL");
  if (!isFloridaReviewedSourceFresh()) {
    for (const source of FLORIDA_REVIEWED_SOURCE_RECORDS) ids.delete(source.chargeId);
  }
  return ids;
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
  if (FLORIDA_REVIEWED_SOURCE_RECORDS.some(source => source.chargeId === chargeId) &&
      !isFloridaReviewedSourceFresh()) return null;
  return getAuthorityChargeProvenance("FL", chargeId);
}

export const floridaSourceDatabase = {
  seed: seedFloridaSourceDatabase,
  getStatus: getFloridaSourceDatabaseStatus,
  getChargeProvenance: getFloridaChargeProvenance,
};