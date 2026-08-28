import {
  getAuthorityChargeProvenance,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
} from "./authority-source-database";
import { buildPennsylvaniaSourceDatabaseSeed, type PennsylvaniaAuthorityManifest } from "../data/pennsylvania-source-database-seed";

export async function getCurrentPennsylvaniaSelectableChargeIds(): Promise<Set<string>> {
  return getCurrentAuthoritySelectableChargeIds("PA");
}

export async function seedPennsylvaniaSourceDatabase(
  manifest: PennsylvaniaAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  return seedAuthoritySourceDatabase(buildPennsylvaniaSourceDatabaseSeed(manifest));
}

export async function getPennsylvaniaSourceDatabaseStatus() {
  return getAuthoritySourceDatabaseStatus("PA");
}

export async function getPennsylvaniaChargeProvenance(chargeId: string) {
  return getAuthorityChargeProvenance("PA", chargeId);
}

export const pennsylvaniaSourceDatabase = {
  seed: seedPennsylvaniaSourceDatabase,
  getStatus: getPennsylvaniaSourceDatabaseStatus,
  getChargeProvenance: getPennsylvaniaChargeProvenance,
};