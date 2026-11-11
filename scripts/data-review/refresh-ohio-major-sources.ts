/** Compare the exact official sections in the published packet. Never change a legal pin. */
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { ohioMajorPacket } from "../../server/data/ohio-major-source";
import { createOhioAdapter } from "./batch/ohio-adapter";

const adapter = createOhioAdapter();
// The reviewed-catalog chapter fetch can also contain dependencies of this packet.
const cachePath = ".cache/ohio-reviewed-refresh.json";
const cached = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")).documents : {};
const acquisitions = [];
for (const expected of Object.values(ohioMajorPacket.documents)) {
  const prior = cached[expected.section];
  const age = Date.now() - Date.parse(prior?.retrievedAt);
  const source = prior && age >= 0 && age < 86400000 ? prior : await adapter.acquire(expected.section);
  if (!adapter.validate(source) || source.section !== expected.section ||
      source.sourceUrl !== expected.sourceUrl || source.title !== expected.title ||
      source.effectiveDateStart !== expected.effectiveDateStart ||
      source.contentHash !== expected.contentHash || source.text !== expected.text) {
    throw Error(`Official source differs from the reviewed packet: ${expected.section}`);
  }
  acquisitions.push({
    section: source.section, sourceUrl: source.sourceUrl, title: source.title,
    effectiveDateStart: source.effectiveDateStart, contentHash: source.contentHash, retrievedAt: source.retrievedAt,
  });
}
const path = "scripts/data-review/output/ohio-major-reacquisitions.json";
const temporary = `${path}.${process.pid}.tmp`;
writeFileSync(temporary, JSON.stringify(acquisitions, null, 2) + "\n");
renameSync(temporary, path);
console.log(`Compared ${acquisitions.length} official sections. Regenerate the publication packet to issue the receipt.`);
