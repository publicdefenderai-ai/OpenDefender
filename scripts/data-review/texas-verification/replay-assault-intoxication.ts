// Replay reviewed Texas batches through the production builder without an import.
import { criminalCharges } from "../../../shared/criminal-charges";
import assaultRows from "../../../shared/texas-assault-public-intoxication.json";
import assaultEvidence from "../output/texas-assault-public-intoxication-evidence.json";
import { buildTexasManifestRecord } from "../../../server/data/texas-source-database-seed";

import possessionRows from "../../../shared/texas-ranked-possession.json";
import possessionEvidence from "../output/texas-ranked-possession-evidence.json";

import theftRows from "../../../shared/texas-ranked-theft.json";
import theftEvidence from "../output/texas-ranked-theft-evidence.json";

import propertyRows from "../../../shared/texas-property-access.json";
import propertyEvidence from "../output/texas-property-access-evidence.json";

const batches = new Map([
  ["assault-intoxication", { rows: assaultRows, evidence: Object.entries(assaultEvidence) }],
  ["ranked-possession", { rows: possessionRows, evidence: Object.entries(possessionEvidence) }],
  ["property-access", { rows: propertyRows, evidence: Object.entries(propertyEvidence) }],
  ["ranked-theft", { rows: theftRows, evidence: Object.entries(theftEvidence) }],
]);
const name = process.argv[2] ?? "assault-intoxication";
const batch = batches.get(name);
if (!batch) throw new Error(`Unknown Texas batch: ${name}`);
const rows = batch.rows;
const sources = new Map(batch.evidence);
const generatedAt = new Date(Math.max(...[...sources.values()].map(doc => Date.parse(doc.retrievedAt))));
const records = rows.map(row => {
  const charge = criminalCharges.find(c => c.id === row.id)!;
  const docs = row.references.map(ref => {
    const document = sources.get(`${ref.code}:${ref.section}`)!;
    return { ...document, retrievedAt: new Date(document.retrievedAt) };
  });
  const record = buildTexasManifestRecord(charge, docs, generatedAt);
  if (!record.provisions.length) throw new Error(`${row.id}: ${record.dispositionReason}`);
  return record;
});
console.log(JSON.stringify(records, null, 2));
