import type { GuidanceViewModel } from "@shared/guidance-view-model";
import { isReviewedOhioChargeId } from "@shared/ohio-reviewed-identity";
import { fetchChargeCatalog } from "./charge-catalog";

type SavedPlan = Pick<GuidanceViewModel, "caseData" | "chargeClassifications">;

export function isOhioPlan(plan: SavedPlan) {
  const state = plan.caseData.jurisdiction.trim().toUpperCase();
  return state === "OH" || state === "OHIO" ||
    plan.chargeClassifications.some(charge => charge.id?.startsWith("oh-"));
}

export function requiresOhioChargeConfirmation(plan: SavedPlan) {
  return isOhioPlan(plan) && (plan.chargeClassifications.length > 0 || plan.caseData.charges.trim() !== "");
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

export function ohioChargesAreCurrent(plan: SavedPlan, currentIds: ReadonlySet<string>) {
  const ids = new Set(plan.chargeClassifications.map(charge => charge.id));
  if (!ids.size || [...ids].some(id => !id || !isReviewedOhioChargeId(id) || !currentIds.has(id))) return false;
  // When the saved selection is present, every entry must be accounted for by a verified classification.
  const selected = plan.caseData.charges.trim();
  if (!selected) return true;
  // Old sessions serialize IDs and display names in a comma-separated string.
  // A comma is a separator only after an entire verified ID or name matches.
  const choices = new Set(plan.chargeClassifications.flatMap(charge => [charge.id, charge.name]));
  const starts = new Set([0]);
  for (const start of starts) {
    for (const choice of choices) {
      if (!choice || !selected.startsWith(choice, start)) continue;
      let end = start + choice.length;
      while (end < selected.length && /\s/.test(selected[end])) end++;
      if (end === selected.length) return true;
      if (selected[end] !== ",") continue;
      let next = end + 1;
      while (next < selected.length && /\s/.test(selected[next])) next++;
      if (next < selected.length) starts.add(next);
    }
  }
  return false;
}

export async function canOutputOhioPlan(plan: SavedPlan) {
  if (!requiresOhioChargeConfirmation(plan)) return true;
  const catalog = await fetchChargeCatalog({ jurisdiction: "OH" }).catch(() => null);
  return !!catalog && ohioChargesAreCurrent(plan, new Set(catalog.charges.map(charge => charge.id)));
}
