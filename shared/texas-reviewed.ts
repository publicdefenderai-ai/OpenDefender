import justice from "./texas-justice-process.json";
import family from "./texas-family-safety.json";
import delivery from "./texas-ranked-delivery.json";
import weights from "./texas-possession-weights.json";
import burglary from "./texas-ranked-burglary.json";
import loss from "./texas-property-loss.json";
import carry from "./texas-carry-branches.json";
import closeout from "./texas-priority-closeout.json";
import arrest from "./texas-ranked-arrest.json";
import propertyAccess from "./texas-property-access.json";
import theft from "./texas-ranked-theft.json";
import possession from "./texas-ranked-possession.json";
import additions from "./texas-assault-public-intoxication.json";
import { texasDwiConduct, texasDwiQualifications, texasDwiRecords } from "./texas-dwi";
export { texasDwiUrl as texasReviewedUrl } from "./texas-dwi";

const labels: Record<string, string> = { GV: "Gov’t", IN: "Ins.", HS: "Health & Safety", HR: "Hum. Res.", PE: "Penal", TN: "Transp.", FA: "Fam.", AL: "Alco. Bev." };

export function texasReviewedCitation(ref: { code: string; section: string; subdivision?: string | null }) {
  if (ref.code === "CR") return `Tex. Code Crim. Proc. art. ${ref.section}${ref.subdivision ?? ""}`;
  if (!labels[ref.code]) throw new Error(`Unsupported reviewed Texas code ${ref.code}`);
  return `Tex. ${labels[ref.code]} Code § ${ref.section}${ref.subdivision ?? ""}`;
}

export const texasReviewedRecords = [
  ...texasDwiRecords.map(row => ({
    ...row, officialTitle: "DRIVING WHILE INTOXICATED.", category: "misdemeanor",
    citation: texasReviewedCitation(row.references[1]), conduct: texasDwiConduct,
    penalty: `${row.summary} ${texasDwiQualifications}`,
  })),
  ...additions,
  ...possession,
  ...theft,
  ...propertyAccess,
  ...arrest,
  ...closeout,
  ...carry,
  ...loss,
  ...burglary,
  ...weights,
  ...delivery,
  ...family,
  ...justice,
];
export const texasReviewedById = new Map(texasReviewedRecords.map(row => [row.id, row]));

// The historical amount-only identity spans several grades and cannot resolve a saved charge.
export const texasHeldTheftId = "tx-theft-under-2500";

export function isTexasHeldTheftSelection(charge: { id?: string; name: string; code?: string }, jurisdiction?: string) {
  return charge.id === texasHeldTheftId ||
    (!charge.id && /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
      (charge.name.trim().toLowerCase() === "theft (under $2,500)" ||
       /^(?:(?:tex\.\s*)?penal code\s*)?(?:§\s*)?31\.03\.?$/i.test(charge.code?.trim() ?? "")));
}

// The legacy section-wide weapons identity does not distinguish conduct, age or grading.
export const texasHeldCarryId = "tx-unlawful-carrying-of-weapon";
export function isTexasHeldCarrySelection(charge: { id?: string; name: string; code?: string }, jurisdiction?: string) {
  return charge.id === texasHeldCarryId || (!charge.id && /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^unlawful carrying (?:of (?:a )?)?weapons?$/i.test(charge.name.trim()) ||
      /^(?:(?:tex\.\s*)?penal code\s*)?(?:§\s*)?46\.02(?:\(b\))?\.?$/i.test(charge.code?.trim() ?? "")));
}
export const texasHeldDeliveryIds = new Set([
  "tx-possession-with-intent-to-distribute", "tx-distribution-of-controlled-substance",
  "tx-manufacturing-controlled-substance", "tx-drug-trafficking",
]);

export function isTexasAmbiguousDelivery(charge: { id?: string; name: string; code?: string }, jurisdiction?: string) {
  if (charge.id) return texasHeldDeliveryIds.has(charge.id);
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?Health\s*&\s*Safety Code\s*)?(?:§\s*)?481\.(?:1123?|113)(?:$|\()/.test(charge.code?.trim() ?? "") ||
     /^(?:Possession with Intent to Distribute|Distribution of Controlled Substance|Manufacturing Controlled Substance|Drug Trafficking)$/i.test(charge.name.trim()));
}

type TexasSavedSelection = { id?: string; name: string; code?: string; classification?: string };

// The old vehicle identity assigned a felony even when the ordinary Class A branch applied.
export function isTexasAmbiguousVehicleBurglary(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return charge.id === "tx-auto-burglary" && charge.classification?.toLowerCase() === "felony";
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    /^(?:(?:tex\.\s*)?penal code\s*)?(?:§\s*)?30\.04\.?$/i.test(charge.code?.trim() ?? "");
}

export function needsTexasChargeReselection(charge: TexasSavedSelection, jurisdiction?: string) {
  return isTexasAmbiguousDelivery(charge, jurisdiction) || isTexasHeldTheftSelection(charge, jurisdiction) || isTexasHeldCarrySelection(charge, jurisdiction) ||
    isTexasAmbiguousVehicleBurglary(charge, jurisdiction);
}
