import publicPeace from "./texas-public-peace.json";
import commerce from "./texas-sexual-commerce.json";
import indecentContact from "./texas-indecent-contact.json";
import protectiveFirearms from "./texas-protective-firearms.json";
import animals from "./texas-animal-cruelty.json";
import communications from "./texas-communications-stalking.json";
import childSexual from "./texas-child-sexual-offenses.json";
import intoxicationHarm from "./texas-intoxication-harm.json";
import prohibited from "./texas-prohibited-possession.json";
import threats from "./texas-threats-alerts.json";
import robbery from "./texas-robbery-restraint.json";
import protectedAssault from "./texas-protected-assault.json";
import fraud from "./texas-card-identity-fraud.json";
import road from "./texas-road-safety.json";
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

const labels: Record<string, string> = { LG: "Loc. Gov’t", PW: "Parks & Wild.", CP: "Civ. Prac. & Rem.", TX: "Tax", FI: "Fin.", UT: "Util.", OC: "Occ.", GV: "Gov’t", IN: "Ins.", HS: "Health & Safety", HR: "Hum. Res.", PE: "Penal", TN: "Transp.", FA: "Fam.", AL: "Alco. Bev." };

export function texasReviewedCitation(ref: { code: string; section: string; subdivision?: string | null }) {
  if (ref.code === "CR") return `Tex. Code Crim. Proc. art. ${ref.section}${ref.subdivision ?? ""}`;
  if (!labels[ref.code]) throw new Error(`Unsupported reviewed Texas code ${ref.code}`);
  return `Tex. ${labels[ref.code]} Code § ${ref.section}${ref.subdivision ?? ""}`;
}

export const texasReviewedRecords = [
  ...publicPeace,
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
  ...road,
  ...fraud,
  ...protectedAssault,
  ...robbery,
  ...threats,
  ...prohibited,
  ...intoxicationHarm,
  ...childSexual,
  ...communications,
  ...animals,
  ...indecentContact,
  ...commerce,
  ...protectiveFirearms,
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

export const texasHeldRoadId = "tx-hit-and-run";
export function isTexasAmbiguousCollision(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return charge.id === texasHeldRoadId;
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?(?:Transp\.|Transportation) Code\s*)?(?:§\s*)?550\.(?:021|022|024)(?:$|\()/.test(charge.code?.trim() ?? "") || /^hit(?:-| )and(?:-| )run$/i.test(charge.name.trim()));
}

export const texasHeldFraudIds = new Set(["tx-identity-theft", "tx-credit-card-fraud"]);
export function isTexasAmbiguousFraud(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return texasHeldFraudIds.has(charge.id);
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?Penal Code\s*)?(?:§\s*)?32\.(?:315|31|51)(?:$|\()/.test(charge.code?.trim() ?? "") || /^(?:identity theft|credit card fraud)$/i.test(charge.name.trim()));
}

export const texasHeldOfficerId = "tx-assault-on-peace-officer";
export function isTexasAmbiguousOfficerAssault(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return charge.id === texasHeldOfficerId;
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?Penal Code\s*)?(?:§\s*)?22\.01\(b(?:-2)?\)(?:$|\(1\))/.test(charge.code?.trim() ?? "") || /^assault (?:on|of) (?:a )?peace officer$/i.test(charge.name.trim()));
}

export const texasHeldThreatId = "tx-terroristic-threat";
export function isTexasAmbiguousThreat(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return charge.id === texasHeldThreatId;
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?Penal Code\s*)?(?:§\s*)?22\.07(?:$|\()/.test(charge.code?.trim() ?? "") || /^terroristic threat$/i.test(charge.name.trim()));
}

export const texasHeldDisorderlyId = "tx-disorderly-conduct";
export function isTexasAmbiguousDisorderly(charge: TexasSavedSelection, jurisdiction?: string) {
  if (charge.id) return charge.id === texasHeldDisorderlyId;
  return /^(TX|Texas)$/i.test(jurisdiction ?? "") &&
    (/^(?:(?:Tex\.\s*)?Penal Code\s*)?(?:§\s*)?42\.01(?:$|\()/.test(charge.code?.trim() ?? "") || /^disorderly conduct$/i.test(charge.name.trim()));
}

export function needsTexasChargeReselection(charge: TexasSavedSelection, jurisdiction?: string) {
  return isTexasAmbiguousDisorderly(charge, jurisdiction) || isTexasAmbiguousThreat(charge, jurisdiction) || isTexasAmbiguousOfficerAssault(charge, jurisdiction) || isTexasAmbiguousFraud(charge, jurisdiction) || isTexasAmbiguousCollision(charge, jurisdiction) || isTexasAmbiguousDelivery(charge, jurisdiction) || isTexasHeldTheftSelection(charge, jurisdiction) || isTexasHeldCarrySelection(charge, jurisdiction) ||
    isTexasAmbiguousVehicleBurglary(charge, jurisdiction);
}
