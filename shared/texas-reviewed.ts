import additions from "./texas-assault-public-intoxication.json";
import { texasDwiConduct, texasDwiQualifications, texasDwiRecords } from "./texas-dwi";
export { texasDwiUrl as texasReviewedUrl } from "./texas-dwi";

const labels: Record<string, string> = { PE: "Penal", TN: "Transp.", FA: "Fam.", AL: "Alco. Bev." };

export function texasReviewedCitation(ref: { code: string; section: string; subdivision?: string | null }) {
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
];
export const texasReviewedById = new Map(texasReviewedRecords.map(row => [row.id, row]));
