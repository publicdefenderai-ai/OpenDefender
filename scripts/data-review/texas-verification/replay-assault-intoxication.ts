// Replay the six records through the production manifest builder using retained TCSS sections.
import { criminalCharges } from "../../../shared/criminal-charges";
import rows from "../../../shared/texas-assault-public-intoxication.json";
import evidence from "../output/texas-assault-public-intoxication-evidence.json";
import { buildTexasManifestRecord } from "../../../server/data/texas-source-database-seed";

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
