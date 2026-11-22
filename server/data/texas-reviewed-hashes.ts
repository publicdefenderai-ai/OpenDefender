import deadlyFluid from "../../scripts/data-review/output/texas-deadly-fluid-evidence.json";
import recordsBail from "../../scripts/data-review/output/texas-records-bail-evidence.json";
import publicPeace from "../../scripts/data-review/output/texas-public-peace-evidence.json";
import commerce from "../../scripts/data-review/output/texas-sexual-commerce-evidence.json";
import indecentContact from "../../scripts/data-review/output/texas-indecent-contact-evidence.json";
import protectiveFirearms from "../../scripts/data-review/output/texas-protective-firearms-evidence.json";
import animals from "../../scripts/data-review/output/texas-animal-cruelty-evidence.json";
import communications from "../../scripts/data-review/output/texas-communications-evidence.json";
import childSexual from "../../scripts/data-review/output/texas-child-sexual-evidence.json";
import intoxicationHarm from "../../scripts/data-review/output/texas-intoxication-harm-evidence.json";
import prohibited from "../../scripts/data-review/output/texas-prohibited-possession-evidence.json";
import threats from "../../scripts/data-review/output/texas-threats-alerts-evidence.json";
import robbery from "../../scripts/data-review/output/texas-robbery-restraint-evidence.json";
import protectedAssault from "../../scripts/data-review/output/texas-protected-assault-evidence.json";
import fraud from "../../scripts/data-review/output/texas-card-identity-fraud-evidence.json";
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
  ...texasDwiHashes, ...Object.fromEntries(Object.entries({ ...evidence, ...possession, ...theft, ...propertyAccess, ...arrest, ...closeout, ...carry, ...loss, ...burglary, ...weights, ...delivery, ...family, ...justice, ...road, ...fraud, ...protectedAssault, ...robbery, ...threats, ...prohibited, ...intoxicationHarm, ...childSexual, ...communications, ...animals, ...protectiveFirearms, ...indecentContact, ...commerce, ...publicPeace, ...recordsBail, ...deadlyFluid }).map(([key, doc]) => [key, doc.textSha256])),
};
export const texasReviewedSnapshotHashes: Readonly<Record<string, string>> = {
  ...TEXAS_DWI_SNAPSHOT_HASHES, ...Object.fromEntries(Object.entries({ ...evidence, ...possession, ...theft, ...propertyAccess, ...arrest, ...closeout, ...carry, ...loss, ...burglary, ...weights, ...delivery, ...family, ...justice, ...road, ...fraud, ...protectedAssault, ...robbery, ...threats, ...prohibited, ...intoxicationHarm, ...childSexual, ...communications, ...animals, ...protectiveFirearms, ...indecentContact, ...commerce, ...publicPeace, ...recordsBail, ...deadlyFluid }).map(([key, doc]) => [`tx:${key}`, doc.snapshotHash])),
};
