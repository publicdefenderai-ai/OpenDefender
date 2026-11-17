import road from "../../scripts/data-review/output/texas-road-safety-evidence.json";
import justice from "../../scripts/data-review/output/texas-justice-process-evidence.json";
import family from "../../scripts/data-review/output/texas-family-safety-evidence.json";
import delivery from "../../scripts/data-review/output/texas-ranked-delivery-evidence.json";
import weights from "../../scripts/data-review/output/texas-possession-weights-evidence.json";
import burglary from "../../scripts/data-review/output/texas-ranked-burglary-evidence.json";
import loss from "../../scripts/data-review/output/texas-property-loss-evidence.json";
import carry from "../../scripts/data-review/output/texas-carry-branches-evidence.json";
import closeout from "../../scripts/data-review/output/texas-priority-closeout-evidence.json";
import arrest from "../../scripts/data-review/output/texas-ranked-arrest-evidence.json";
import propertyAccess from "../../scripts/data-review/output/texas-property-access-evidence.json";
import theft from "../../scripts/data-review/output/texas-ranked-theft-evidence.json";
import possession from "../../scripts/data-review/output/texas-ranked-possession-evidence.json";
import evidence from "../../scripts/data-review/output/texas-assault-public-intoxication-evidence.json";
import { texasDwiHashes } from "@shared/texas-dwi";
import { TEXAS_DWI_SNAPSHOT_HASHES } from "./texas-dwi-snapshot-hashes";

export const texasReviewedTextHashes: Readonly<Record<string, string>> = {
  ...texasDwiHashes, ...Object.fromEntries(Object.entries({ ...evidence, ...possession, ...theft, ...propertyAccess, ...arrest, ...closeout, ...carry, ...loss, ...burglary, ...weights, ...delivery, ...family, ...justice, ...road }).map(([key, doc]) => [key, doc.textSha256])),
};
export const texasReviewedSnapshotHashes: Readonly<Record<string, string>> = {
  ...TEXAS_DWI_SNAPSHOT_HASHES, ...Object.fromEntries(Object.entries({ ...evidence, ...possession, ...theft, ...propertyAccess, ...arrest, ...closeout, ...carry, ...loss, ...burglary, ...weights, ...delivery, ...family, ...justice, ...road }).map(([key, doc]) => [`tx:${key}`, doc.snapshotHash])),
};
