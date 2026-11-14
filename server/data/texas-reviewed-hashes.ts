import evidence from "../../scripts/data-review/output/texas-assault-public-intoxication-evidence.json";
import { texasDwiHashes } from "@shared/texas-dwi";
import { TEXAS_DWI_SNAPSHOT_HASHES } from "./texas-dwi-snapshot-hashes";

export const texasReviewedTextHashes: Readonly<Record<string, string>> = {
  ...texasDwiHashes, ...Object.fromEntries(Object.entries(evidence).map(([key, doc]) => [key, doc.textSha256])),
};
export const texasReviewedSnapshotHashes: Readonly<Record<string, string>> = {
  ...TEXAS_DWI_SNAPSHOT_HASHES, ...Object.fromEntries(Object.entries(evidence).map(([key, doc]) => [`tx:${key}`, doc.snapshotHash])),
};
