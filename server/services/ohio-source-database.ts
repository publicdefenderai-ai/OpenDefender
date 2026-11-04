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

import { loadOhioAuthorityManifest } from "../data/ohio-manifest-loader";

async function getDurableOhioPilotReceipt(): Promise<unknown | null> {
  try {
    const { getOhioPilotRefreshStatus } = await import("./ohio-pilot-refresh-service");
    const status = await getOhioPilotRefreshStatus();
    return status.fresh ? status.receipt : null;
  } catch {
    // Runtime receipt access is fail-closed. In particular, do not fall back
    // to the checked-in receipt file when the durable service is unavailable.
    return null;
  }
}

export async function getCurrentOhioSelectableChargeIds(): Promise<Set<string>> {
  const ids = await getCurrentAuthoritySelectableChargeIds("OH");
  if (!isOhioReviewedSourceFresh()) {
    for (const source of OHIO_REVIEWED_SOURCES) ids.delete(source.chargeId);
  }
  return ids;
}

export async function seedOhioSourceDatabase(
  manifest?: OhioAuthorityManifest,
): Promise<AuthoritySourceDatabaseResult> {
  const receipt = await getDurableOhioPilotReceipt();
  // Recompose from the committed legacy manifest with the durable receipt so
  // a successful refresh can reactivate the source-first pilot even when the
  // caller supplied a stale/pre-refresh manifest.
  const effectiveManifest = loadOhioAuthorityManifest(
    undefined,
    new Date(),
    receipt,
  );
  return seedAuthoritySourceDatabase(buildOhioSourceDatabaseSeed(
    effectiveManifest,
    new Date(),
    receipt,
  ));
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
