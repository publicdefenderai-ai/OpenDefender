import type { Playbook, PlaybookSummary } from "./schema";

import { arraignmentPlaybook } from "./criminal/arraignment";
import { duiDwiPlaybook } from "./criminal/dui-dwi";
import { drugPossessionPlaybook } from "./criminal/drug-possession";
import { probationViolationsPlaybook } from "./criminal/probation-violations";
import { bailBondPlaybook } from "./criminal/bail-bond";
import { fareEvasionPlaybook } from "./criminal/fare-evasion";

import { iceDetentionBondPlaybook } from "./immigration/ice-detention-bond";
import { masterCalendarPlaybook } from "./immigration/master-calendar";
import { defensiveAsylumPlaybook } from "./immigration/defensive-asylum";
import { motionToReopenPlaybook } from "./immigration/motion-to-reopen";

const ALL_PLAYBOOKS: Playbook[] = [
  arraignmentPlaybook,
  duiDwiPlaybook,
  drugPossessionPlaybook,
  probationViolationsPlaybook,
  bailBondPlaybook,
  fareEvasionPlaybook,
  iceDetentionBondPlaybook,
  masterCalendarPlaybook,
  defensiveAsylumPlaybook,
  motionToReopenPlaybook,
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
