import type { Playbook, PlaybookSummary } from "./schema";

// Tier 1 — Criminal
import { arraignmentPlaybook } from "./criminal/arraignment";
import { duiDwiPlaybook } from "./criminal/dui-dwi";
import { drugPossessionPlaybook } from "./criminal/drug-possession";
import { probationViolationsPlaybook } from "./criminal/probation-violations";
import { bailBondPlaybook } from "./criminal/bail-bond";
import { fareEvasionPlaybook } from "./criminal/fare-evasion";

// Tier 2 — Criminal
import { misdemeanorDvPlaybook } from "./criminal/misdemeanor-dv";
import { theftShopliftingPlaybook } from "./criminal/theft-shoplifting";
import { drugDistributionPlaybook } from "./criminal/drug-distribution";
import { disorderlyConduct } from "./criminal/disorderly-conduct";
import { recklessDrivingDwlsPlaybook } from "./criminal/reckless-driving-dwls";

// Tier 1 — Immigration
import { iceDetentionBondPlaybook } from "./immigration/ice-detention-bond";
import { masterCalendarPlaybook } from "./immigration/master-calendar";
import { defensiveAsylumPlaybook } from "./immigration/defensive-asylum";
import { motionToReopenPlaybook } from "./immigration/motion-to-reopen";

// Tier 2 — Immigration
import { cancellationOfRemovalPlaybook } from "./immigration/cancellation-of-removal";
import { workplaceRaidPlaybook } from "./immigration/workplace-raid";
import { withholdingCatPlaybook } from "./immigration/withholding-cat";
import { dacaTpsLapsePlaybook } from "./immigration/daca-tps-lapse";

const ALL_PLAYBOOKS: Playbook[] = [
  // Criminal — Tier 1
  arraignmentPlaybook,
  duiDwiPlaybook,
  drugPossessionPlaybook,
  probationViolationsPlaybook,
  bailBondPlaybook,
  fareEvasionPlaybook,
  // Criminal — Tier 2
  misdemeanorDvPlaybook,
  theftShopliftingPlaybook,
  drugDistributionPlaybook,
  disorderlyConduct,
  recklessDrivingDwlsPlaybook,
  // Immigration — Tier 1
  iceDetentionBondPlaybook,
  masterCalendarPlaybook,
  defensiveAsylumPlaybook,
  motionToReopenPlaybook,
  // Immigration — Tier 2
  cancellationOfRemovalPlaybook,
  workplaceRaidPlaybook,
  withholdingCatPlaybook,
  dacaTpsLapsePlaybook,
];

function toSummary(p: Playbook): PlaybookSummary {
  return {
    id: p.id,
    category: p.category,
    name: p.name,
    tagline: p.tagline,
    typicalTimeline: p.typicalTimeline,
    difficultyLevel: p.difficultyLevel,
    tags: p.tags,
  };
}

export function getPlaybooks(category?: string): PlaybookSummary[] {
  const filtered = category
    ? ALL_PLAYBOOKS.filter((p) => p.category === category)
    : ALL_PLAYBOOKS;
  return filtered.map(toSummary);
}

export function getPlaybook(id: string): Playbook | null {
  return ALL_PLAYBOOKS.find((p) => p.id === id) ?? null;
}
