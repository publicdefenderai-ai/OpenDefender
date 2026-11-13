// Each committed publication definition doubles as its batch's registry entry.
// Keep discovery independent of receipt availability so deletion still alarms.
import { readdirSync } from "node:fs";

const definitions = new URL("../../shared/", import.meta.url);
export const publicationBatches = readdirSync(definitions)
  .filter(name => /^(ohio|florida)-[a-z0-9-]+-publication\.json$/.test(name))
  .sort()
  .map(name => {
    const key = name.slice(0, -"-publication.json".length);
    return { key, jurisdiction: key.startsWith("ohio-") ? "OH" : "FL", receipt: key + "-refresh-receipt.json" };
  });

export const requiredReceipts = [
  "california-archive-refresh-receipt.json",
  "ohio-chapter-2903-refresh-receipt.json",
  "ohio-reviewed-refresh-receipt.json",
  "florida-reviewed-refresh-receipt.json",
  ...publicationBatches.map(batch => batch.receipt),
];
