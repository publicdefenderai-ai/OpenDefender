import a from "./florida-reviewed-data/a.json";
import b from "./florida-reviewed-data/b.json";
import c from "./florida-reviewed-data/c.json";
import eligibility from "./florida-reviewed-eligibility.json";
import {
  projectEvidenceBackedChargeBatch,
  type EvidenceBackedChargeDefinition,
} from "./evidence-backed-charge-batch";

type CatalogDecision = {
  id: string;
  status: "eligible" | "held" | "duplicate";
  reason: string;
};
const catalogEligibility = eligibility as {
  schemaVersion: number;
  reportHash: string;
  decisions: CatalogDecision[];
};
export const FLORIDA_REVIEWED_DEFINITIONS: EvidenceBackedChargeDefinition[] =
  [...a, ...b, ...c] as EvidenceBackedChargeDefinition[];

const definitions = new Map(FLORIDA_REVIEWED_DEFINITIONS.map(row => [row.id, row]));
const decisions = new Map(catalogEligibility.decisions.map(row => [row.id, row]));
if (definitions.size !== FLORIDA_REVIEWED_DEFINITIONS.length ||
    decisions.size !== eligibility.decisions.length ||
    definitions.size !== decisions.size) {
  throw new Error("Florida reviewed catalog requires unique, complete draft accounting");
}
for (const definition of FLORIDA_REVIEWED_DEFINITIONS) {
  const decision = decisions.get(definition.id);
  if (!definition.id.startsWith("fl-fs-") || definition.jurisdiction !== "FL" ||
      !decision || !["eligible", "held", "duplicate"].includes(decision.status) ||
      !decision.reason.trim() || !definition.names?.es.trim() || !definition.names?.zh.trim() ||
      (definition.categories !== undefined &&
        (!definition.categories.length ||
          new Set(definition.categories).size !== definition.categories.length ||
          !definition.categories.includes(definition.category) ||
          definition.categories.some(category =>
            !["felony", "misdemeanor", "infraction"].includes(category))))) {
    throw new Error(`Incomplete Florida reviewed catalog disposition: ${definition.id}`);
  }
}

// This projection carries display content only. Server-side source, approval,
// dependency, and freshness checks independently decide publication.
export const FLORIDA_REVIEWED_BATCH = projectEvidenceBackedChargeBatch(
  FLORIDA_REVIEWED_DEFINITIONS.filter(row => decisions.get(row.id)?.status === "eligible"),
);