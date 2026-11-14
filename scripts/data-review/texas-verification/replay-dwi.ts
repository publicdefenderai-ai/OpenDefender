// Offline replay of the DWI records only. Writes the generated comparison to stdout.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { criminalCharges } from "../../../shared/criminal-charges";
import { texasDwiRecords, texasDwiUrl } from "../../../shared/texas-dwi";
import { extractDocument } from "../import-texas-source-database";
import { buildTexasManifestRecord } from "../../../server/data/texas-source-database-seed";
import packet from "../output/texas-dwi-branch-candidate.json";

const directory = process.argv[2];
if (!directory) throw new Error("Provide the directory of the four original TCSS chapter files");
const sources = new Map(Object.entries(packet.sources));
const importedAt = new Date(Math.max(...[...sources.values()].map(doc => Date.parse(doc.retrievedAt))));
const records = texasDwiRecords.map(row => {
  const charge = criminalCharges.find(c => c.id === row.id)!;
  const documents = row.references.map(ref => {
    const chapter = `${ref.code}.${ref.section.split(".")[0]}.htm`;
    const raw = readFileSync(join(directory, chapter), "utf8");
    const evidence = sources.get(`${ref.code}:${ref.section}`)!;
    const document = extractDocument(raw, ref.code, ref.section, texasDwiUrl(ref), new Date(evidence.retrievedAt));
    if (!document || document.text !== evidence.text) throw new Error(`TCSS evidence differs at ${ref.section}`);
    return document;
  });
  const record = buildTexasManifestRecord(charge, documents, importedAt);
  if (!record.provisions.length) throw new Error(record.dispositionReason);
  return record;
});
console.log(JSON.stringify(records, null, 2));
