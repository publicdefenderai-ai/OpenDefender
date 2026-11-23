/** Exact unsupported legacy identities; no automatic successor mapping. */
import heldIds from './new-york-placeholder-hold-ids.json';
export const NEW_YORK_PLACEHOLDER_HOLD_IDS = new Set<string>(heldIds);
const labels = [
  'MPC § 5.03 / NY conspiracy statute', 'Criminal Conspiracy', 'Conspiracy in the sixth degree',
  'NY habitual offender / recidivist statute', 'Prior Felony / Recidivist Sentencing Enhancement',
  'Sentence of imprisonment for persistent violent felony offender; criteria',
  'NY money laundering statute', 'Money Laundering', 'Money laundering in the first degree',
];
type SavedCharge = {id?: string; name?: string; code?: string};
const isNewYork=(jurisdiction?:string)=>['NY','NEW YORK'].includes(jurisdiction?.trim().toUpperCase()??'');
const matchesLabel=(value:string)=>labels.some(label=>value.trim().toLowerCase()===label.toLowerCase());
export function isHeldNewYorkPlaceholder(charge:SavedCharge,jurisdiction?:string):boolean {
  if(charge.id) return NEW_YORK_PLACEHOLDER_HOLD_IDS.has(charge.id);
  return isNewYork(jurisdiction) && [charge.name,charge.code].some(value=>typeof value==='string'&&matchesLabel(value));
}
export function hasHeldNewYorkPlaceholder(plan:{caseData:{jurisdiction:string;charges:string};chargeClassifications:SavedCharge[]}):boolean {
  if(plan.chargeClassifications.some(charge=>isHeldNewYorkPlaceholder(charge,plan.caseData.jurisdiction)))return true;
  // Older saves can retain only selected IDs/names in this comma-separated field.
  // Match exact historical labels/IDs, not an arbitrary substring such as a name
  // embedded in a different reviewed charge. Empty/no-charge plans remain usable.
  if(!isNewYork(plan.caseData.jurisdiction))return false;
  return plan.caseData.charges.split(',').some(value=>NEW_YORK_PLACEHOLDER_HOLD_IDS.has(value.trim())||matchesLabel(value));
}
export function newYorkPlaceholderNotice(language:string):string {
  if(language.startsWith('es'))return 'Se necesita confirmar la selección del cargo. Esta hoja de ruta contiene un cargo histórico de Nueva York cuya información no está verificada. El contenido guardado no está disponible para mostrar, imprimir ni exportar hasta que se confirme la selección.';
  if(language.startsWith('zh'))return '需要确认所选指控。此路线图包含信息尚未核实的纽约州历史罪名。确认选择前，无法显示、打印或导出已保存的内容。';
  return 'Charge selection needs to be confirmed. This roadmap contains a historical New York charge whose information is not verified. Saved content is unavailable for display, printing or export until the selection is confirmed.';
}
export class NewYorkPlaceholderConfirmationError extends Error {
  constructor(){super('Confirm the New York charge selection before exporting.');}
}
