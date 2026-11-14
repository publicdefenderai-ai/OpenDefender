import type { GuidanceViewModel } from "@shared/guidance-view-model";
import { isReviewedOhioChargeId } from "@shared/ohio-reviewed-identity";
import { fetchChargeCatalog } from "./charge-catalog";

type SavedPlan = Pick<GuidanceViewModel, "caseData" | "chargeClassifications">;

export function isOhioPlan(plan: SavedPlan) {
  const state = plan.caseData.jurisdiction.trim().toUpperCase();
  return state === "OH" || state === "OHIO" ||
    plan.chargeClassifications.some(charge => charge.id?.startsWith("oh-"));
}

export function ohioReselectionNotice(language: string) {
  if (language.startsWith("es")) return "Se necesita volver a seleccionar el cargo. Confirme el cargo en la lista actual de Ohio antes de imprimir o exportar la hoja de ruta.";
  if (language.startsWith("zh")) return "需要重新选择罪名。请先在俄亥俄州当前罪名列表中确认罪名，再打印或导出案件路线图。";
  return "Charge selection needs to be confirmed. Confirm the charge in the current Ohio list before printing or exporting the roadmap.";
}

export class OhioChargeConfirmationError extends Error {
  constructor() {
    super("Select a currently available Ohio charge before exporting.");
  }
}

export async function canOutputOhioPlan(plan: SavedPlan) {
  const charges = plan.chargeClassifications;
  if (!charges.length || charges.some(charge => !charge.id || !isReviewedOhioChargeId(charge.id))) return false;
  const catalog = await fetchChargeCatalog({ jurisdiction: "OH" }).catch(() => null);
  if (!catalog) return false;
  const currentIds = new Set(catalog.charges.map(charge => charge.id));
  return charges.every(charge => currentIds.has(charge.id ?? ""));
}
