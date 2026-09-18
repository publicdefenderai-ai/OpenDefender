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
import {
  isOhioReviewedSourceFresh,
  OHIO_REVIEWED_SOURCES,
} from "../data/ohio-reviewed-source";

export async function getCurrentOhioSelectableChargeIds(): Promise<Set<string>> {
  const ids = await getCurrentAuthoritySelectableChargeIds("OH");
  if (!isOhioReviewedSourceFresh()) {
    for (const source of OHIO_REVIEWED_SOURCES) ids.delete(source.chargeId);
  }
  return ids;
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
  if (OHIO_REVIEWED_SOURCES.some(source => source.chargeId === chargeId) &&
      !isOhioReviewedSourceFresh()) return null;
  return getAuthorityChargeProvenance("OH", chargeId);
}

export const ohioSourceDatabase = {
  seed: seedOhioSourceDatabase,
  getStatus: getOhioSourceDatabaseStatus,
  getChargeProvenance: getOhioChargeProvenance,
};