import { getSelectableCharges } from "@shared/criminal-charges";
import { CALIFORNIA_CANONICAL_RECORDS } from "@shared/california-authority";
import { getCurrentAuthoritySelectableChargeIds as getCurrentJurisdictionAuthoritySelectableChargeIds } from "./authority-source-database";
import { getCurrentCaliforniaSelectableChargeIds } from "./california-source-database";

export const AUTHORITY_BACKED_JURISDICTIONS = new Set(["CA", "NY", "TX", "FL", "PA", "SC", "IL", "OH", "GA"]);

function getReleaseCheckSelectableChargeIds(): Set<string> | undefined {
  if (process.env.RELEASE_CHECK !== "true") return undefined;

  const rawFixture = process.env.RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS;
  // A missing fixture deliberately falls through to the database-backed path.
  // In the isolated release environment that path fails closed, preserving the
  // normal behavior when eligibility data is unavailable.
  if (rawFixture === undefined) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawFixture);
  } catch {
    throw new Error("Invalid release-check authority eligibility fixture");
  }
  if (!Array.isArray(parsed) || parsed.some((value) => typeof value !== "string")) {
    throw new Error("Invalid release-check authority eligibility fixture");
  }

  const catalogById = new Map(getSelectableCharges().map((charge) => [charge.id, charge]));
  const fixtureIds = new Set<string>();
  for (const id of parsed) {
    const charge = catalogById.get(id);
    if (!charge || !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction)) {
      throw new Error(`Release-check authority eligibility fixture has an invalid charge ID: ${id}`);
    }
    fixtureIds.add(id);
  }

  const expectedCaliforniaIds = new Set(
    CALIFORNIA_CANONICAL_RECORDS
      .filter((record) => record.selectable)
      .map((record) => record.canonicalId),
  );
  const fixtureCaliforniaIds = new Set(
    [...fixtureIds].filter((id) => catalogById.get(id)?.jurisdiction === "CA"),
  );
  const missingCaliforniaIds = [...expectedCaliforniaIds]
    .filter((id) => !fixtureCaliforniaIds.has(id));
  const unexpectedCaliforniaIds = [...fixtureCaliforniaIds]
    .filter((id) => !expectedCaliforniaIds.has(id));
  if (missingCaliforniaIds.length > 0 || unexpectedCaliforniaIds.length > 0) {
    throw new Error(
      `Release-check California authority fixture is out of sync: missing=${missingCaliforniaIds.join(",") || "none"}, unexpected=${unexpectedCaliforniaIds.join(",") || "none"}`,
    );
  }

  return fixtureIds;
}

export async function getCurrentAuthoritySelectableChargeIds(): Promise<Set<string>> {
  const releaseCheckSelectableIds = getReleaseCheckSelectableChargeIds();
  if (releaseCheckSelectableIds) {
    return new Set(
      getSelectableCharges()
        .filter((charge) =>
          !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
          releaseCheckSelectableIds.has(charge.id),
        )
        .map((charge) => charge.id),
    );
  }

  const byJurisdiction = new Map(
    await Promise.all(
      [...AUTHORITY_BACKED_JURISDICTIONS].map(async (jurisdiction) => [
        jurisdiction,
        jurisdiction === "CA"
          ? await getCurrentCaliforniaSelectableChargeIds()
          : await getCurrentJurisdictionAuthoritySelectableChargeIds(jurisdiction),
      ] as const),
    ),
  );
  const allowed = new Set<string>();
  for (const charge of getSelectableCharges()) {
    if (
      !AUTHORITY_BACKED_JURISDICTIONS.has(charge.jurisdiction) ||
      byJurisdiction.get(charge.jurisdiction)?.has(charge.id)
    ) {
      allowed.add(charge.id);
    }
  }
  return allowed;
}

export async function isCurrentAuthoritySelectable(chargeId: string): Promise<boolean> {
  return (await getCurrentAuthoritySelectableChargeIds()).has(chargeId);
}

export function filterAuthorityBackedCharges<T extends { jurisdiction: string; id: string }>(
  items: T[],
  allowedIds: Set<string>,
): T[] {
  return items.filter((item) =>
    !AUTHORITY_BACKED_JURISDICTIONS.has(item.jurisdiction) || allowedIds.has(item.id),
  );
}