import reviewed from "./texas-dwi-reviewed.json";

export const texasDwiRecords = reviewed.records;
export const texasDwiById = new Map(texasDwiRecords.map(record => [record.id, record]));
export const texasDwiHashes: Readonly<Record<string, string>> = reviewed.sourceHashes;
export const texasDwiQualifications = reviewed.qualifications.join(" ");
export const texasDwiConduct = "Driving while intoxicated means operating a motor vehicle in a public place while intoxicated.";

export function texasDwiCitation(ref: { code: string; section: string; subdivision?: string | null }) {
  return `Tex. ${ref.code === "PE" ? "Penal" : "Transp."} Code § ${ref.section}${ref.subdivision ?? ""}`;
}

export function texasDwiUrl(ref: { code: string; section: string }) {
  return `https://tcss.legis.texas.gov/resources/${ref.code}/htm/${ref.code}.${ref.section.split(".")[0]}.htm#${ref.section}`;
}
