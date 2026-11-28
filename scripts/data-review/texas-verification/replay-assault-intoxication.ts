import roadwayRows from "../../../shared/texas-roadway-duties.json";
import roadwayEvidence from "../output/texas-roadway-duties-evidence.json";
import serviceRows from "../../../shared/texas-service-forgery.json";
import serviceEvidence from "../output/texas-service-forgery-evidence.json";
import disorderlyRows from "../../../shared/texas-disorderly-class-c.json";
import disorderlyEvidence from "../output/texas-disorderly-class-c-evidence.json";
import deadlyFluidRows from "../../../shared/texas-deadly-fluid.json";
import deadlyFluidEvidence from "../output/texas-deadly-fluid-evidence.json";
import recordsBailRows from "../../../shared/texas-records-bail.json";
import recordsBailEvidence from "../output/texas-records-bail-evidence.json";
import peaceRows from "../../../shared/texas-public-peace.json";
import peaceEvidence from "../output/texas-public-peace-evidence.json";
import commerceRows from "../../../shared/texas-sexual-commerce.json";
import commerceEvidence from "../output/texas-sexual-commerce-evidence.json";
import contactRows from "../../../shared/texas-indecent-contact.json";
import contactEvidence from "../output/texas-indecent-contact-evidence.json";
import protectiveRows from "../../../shared/texas-protective-firearms.json";
import protectiveEvidence from "../output/texas-protective-firearms-evidence.json";
import animalRows from "../../../shared/texas-animal-cruelty.json";
import animalEvidence from "../output/texas-animal-cruelty-evidence.json";
import communicationsRows from "../../../shared/texas-communications-stalking.json";
import communicationsEvidence from "../output/texas-communications-evidence.json";
import childRows from "../../../shared/texas-child-sexual-offenses.json";
import childEvidence from "../output/texas-child-sexual-evidence.json";
import harmRows from "../../../shared/texas-intoxication-harm.json";
import harmEvidence from "../output/texas-intoxication-harm-evidence.json";
import prohibitedRows from "../../../shared/texas-prohibited-possession.json";
import prohibitedEvidence from "../output/texas-prohibited-possession-evidence.json";
import threatRows from "../../../shared/texas-threats-alerts.json";
import threatEvidence from "../output/texas-threats-alerts-evidence.json";
import robberyRows from "../../../shared/texas-robbery-restraint.json";
import robberyEvidence from "../output/texas-robbery-restraint-evidence.json";
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

import arrestRows from "../../../shared/texas-ranked-arrest.json";
import arrestEvidence from "../output/texas-ranked-arrest-evidence.json";

import closeoutRows from "../../../shared/texas-priority-closeout.json";
import closeoutEvidence from "../output/texas-priority-closeout-evidence.json";

import carryRows from "../../../shared/texas-carry-branches.json";
import carryEvidence from "../output/texas-carry-branches-evidence.json";

import lossRows from "../../../shared/texas-property-loss.json";
import lossEvidence from "../output/texas-property-loss-evidence.json";

import burglaryRows from "../../../shared/texas-ranked-burglary.json";
import burglaryEvidence from "../output/texas-ranked-burglary-evidence.json";

import weightRows from "../../../shared/texas-possession-weights.json";
import weightEvidence from "../output/texas-possession-weights-evidence.json";

import deliveryRows from "../../../shared/texas-ranked-delivery.json";
import deliveryEvidence from "../output/texas-ranked-delivery-evidence.json";

import familyRows from "../../../shared/texas-family-safety.json";
import familyEvidence from "../output/texas-family-safety-evidence.json";

import justiceRows from "../../../shared/texas-justice-process.json";
import justiceEvidence from "../output/texas-justice-process-evidence.json";

import roadRows from "../../../shared/texas-road-safety.json";
import roadEvidence from "../output/texas-road-safety-evidence.json";

import fraudRows from "../../../shared/texas-card-identity-fraud.json";
import fraudEvidence from "../output/texas-card-identity-fraud-evidence.json";

import protectedAssaultRows from "../../../shared/texas-protected-assault.json";
import protectedAssaultEvidence from "../output/texas-protected-assault-evidence.json";

const batches = new Map([
  ["roadway-duties", { rows: roadwayRows, evidence: Object.entries(roadwayEvidence) }],
  ["service-forgery", { rows: serviceRows, evidence: Object.entries(serviceEvidence) }],
  ["disorderly-class-c", { rows: disorderlyRows, evidence: Object.entries(disorderlyEvidence) }],
  ["deadly-fluid", { rows: deadlyFluidRows, evidence: Object.entries(deadlyFluidEvidence) }],
  ["records-bail", { rows: recordsBailRows, evidence: Object.entries(recordsBailEvidence) }],
  ["public-peace", { rows: peaceRows, evidence: Object.entries(peaceEvidence) }],
  ["sexual-commerce", { rows: commerceRows, evidence: Object.entries(commerceEvidence) }],
  ["indecent-contact", { rows: contactRows, evidence: Object.entries(contactEvidence) }],
  ["protective-firearms", { rows: protectiveRows, evidence: Object.entries(protectiveEvidence) }],
  ["animal-cruelty", { rows: animalRows, evidence: Object.entries(animalEvidence) }],
  ["communications", { rows: communicationsRows, evidence: Object.entries(communicationsEvidence) }],
  ["child-sexual", { rows: childRows, evidence: Object.entries(childEvidence) }],
  ["intoxication-harm", { rows: harmRows, evidence: Object.entries(harmEvidence) }],
  ["prohibited-possession", { rows: prohibitedRows, evidence: Object.entries(prohibitedEvidence) }],
  ["threats-alerts", { rows: threatRows, evidence: Object.entries(threatEvidence) }],
  ["robbery-restraint", { rows: robberyRows, evidence: Object.entries(robberyEvidence) }],
  ["protected-assault", { rows: protectedAssaultRows, evidence: Object.entries(protectedAssaultEvidence) }],
  ["card-identity-fraud", { rows: fraudRows, evidence: Object.entries(fraudEvidence) }],
  ["road-safety", { rows: roadRows, evidence: Object.entries(roadEvidence) }],
  ["justice-process", { rows: justiceRows, evidence: Object.entries(justiceEvidence) }],
  ["family-safety", { rows: familyRows, evidence: Object.entries(familyEvidence) }],
  ["ranked-delivery", { rows: deliveryRows, evidence: Object.entries(deliveryEvidence) }],
  ["possession-weights", { rows: weightRows, evidence: Object.entries(weightEvidence) }],
  ["ranked-burglary", { rows: burglaryRows, evidence: Object.entries(burglaryEvidence) }],
  ["property-loss", { rows: lossRows, evidence: Object.entries(lossEvidence) }],
  ["carry-branches", { rows: carryRows, evidence: Object.entries(carryEvidence) }],
  ["priority-closeout", { rows: closeoutRows, evidence: Object.entries(closeoutEvidence) }],
  ["assault-intoxication", { rows: assaultRows, evidence: Object.entries(assaultEvidence) }],
  ["ranked-possession", { rows: possessionRows, evidence: Object.entries(possessionEvidence) }],
  ["ranked-arrest", { rows: arrestRows, evidence: Object.entries(arrestEvidence) }],
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
