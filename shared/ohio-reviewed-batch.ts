import a from "./ohio-reviewed-data/a.json";
import b from "./ohio-reviewed-data/b.json";
import c from "./ohio-reviewed-data/c.json";
import sourceChangeHolds from "./ohio-source-change-holds.json";
import updates from "./ohio-common-charge-updates.json";
import eligibility from "./ohio-reviewed-eligibility.json";
import { OHIO_REVIEWED_MIXED_CLASS_IDS } from "./ohio-reviewed-categories";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";

/** Public summaries only. Full statutes, quote spans and source pins stay server-side. */
export const OHIO_REVIEWED_DEFINITIONS: EvidenceBackedChargeDefinition[] =
  ([...a, ...b, ...c] as EvidenceBackedChargeDefinition[]).map(original => {
    const row = (updates as EvidenceBackedChargeDefinition[]).find(update => update.id === original.id) ?? original;
    return OHIO_REVIEWED_MIXED_CLASS_IDS.has(row.id)
      ? { ...row, categories: ["felony", "misdemeanor"] }
      : row;
  });
const definitions = new Map(OHIO_REVIEWED_DEFINITIONS.map(row => [row.id, row]));
const decisions = new Map(eligibility.decisions.map(row => [row.id, row]));
if (definitions.size !== OHIO_REVIEWED_DEFINITIONS.length ||
    decisions.size !== eligibility.decisions.length || definitions.size !== decisions.size) {
  throw new Error("Ohio reviewed catalog requires unique, complete draft accounting");
}
for (const definition of OHIO_REVIEWED_DEFINITIONS) {
  const decision = decisions.get(definition.id);
  if (!decision || decision.section !== definition.code ||
      !["eligible", "held", "duplicate"].includes(decision.status) ||
      !decision.reason.trim() || !definition.names?.es.trim() || !definition.names?.zh.trim() ||
      !["felony", "misdemeanor", "infraction"].includes(definition.category)) {
    throw new Error(`Incomplete Ohio reviewed catalog disposition: ${definition.id}`);
  }
}

// A complete translation or reviewed interpretation is not itself a publication
// approval. Server authority/refresh gates independently check every dependency.
export const OHIO_REVIEWED_BATCH = projectEvidenceBackedChargeBatch(
  OHIO_REVIEWED_DEFINITIONS.filter(row => decisions.get(row.id)?.status === "eligible" &&
    !sourceChangeHolds.some(hold => hold.id === row.id)),
);