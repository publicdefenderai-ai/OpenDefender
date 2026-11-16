// Replay reviewed Texas batches through the production builder without an import.
import { criminalCharges } from "../../../shared/criminal-charges";
import assaultRows from "../../../shared/texas-assault-public-intoxication.json";
import assaultEvidence from "../output/texas-assault-public-intoxication-evidence.json";
import { buildTexasManifestRecord } from "../../../server/data/texas-source-database-seed";

import possessionRows from "../../../shared/texas-ranked-possession.json";
import possessionEvidence from "../output/texas-ranked-possession-evidence.json";

const batch = process.argv[2] ?? "assault-intoxication";
if (!["assault-intoxication", "ranked-possession"].includes(batch)) throw new Error(`Unknown Texas batch: ${batch}`);
const rows = batch === "ranked-possession" ? possessionRows : assaultRows;
const evidence = batch === "ranked-possession" ? possessionEvidence : assaultEvidence;
const sources = new Map(Object.entries(evidence));
const generatedAt = new Date(Math.max(...Object.values(evidence).map(doc => Date.parse(doc.retrievedAt))));
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
