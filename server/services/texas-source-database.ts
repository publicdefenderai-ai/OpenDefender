import {
  getAuthorityChargeProvenance,
  getAuthoritySourceReviewDecisions,
  getAuthoritySourceDatabaseStatus,
  getCurrentAuthoritySelectableChargeIds,
  getPendingAuthoritySourceSnapshots,
  reviewAuthoritySourceSnapshot,
  seedAuthoritySourceDatabase,
  type AuthoritySourceDatabaseResult,
  type AuthoritySourceReviewInput,
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

export async function getPendingTexasSourceSnapshots() {
  return getPendingAuthoritySourceSnapshots("TX");
}

export async function getTexasSourceReviewDecisions() {
  return getAuthoritySourceReviewDecisions("TX");
}

export async function reviewTexasSourceSnapshot(
  input: Omit<AuthoritySourceReviewInput, "jurisdiction">,
) {
  return reviewAuthoritySourceSnapshot({ ...input, jurisdiction: "TX" });
}

export const texasSourceDatabase = {
  seed: seedTexasSourceDatabase,
  getStatus: getTexasSourceDatabaseStatus,
  getChargeProvenance: getTexasChargeProvenance,
  getPendingSnapshots: getPendingTexasSourceSnapshots,
  getReviewDecisions: getTexasSourceReviewDecisions,
  reviewSnapshot: reviewTexasSourceSnapshot,
};