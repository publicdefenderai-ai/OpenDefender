import {
  AlertTriangle,
  BookOpenCheck,
  Clock3,
  MapPin,
  Route,
  Scale,
  type LucideIcon,
} from "lucide-react";
import type { TFunction } from "i18next";

export type IntentDestinationId =
  | "urgent"
  | "roadmap"
  | "charges"
  | "legalHelp"
  | "stage"
  | "sources";

export interface IntentDestination {
  id: IntentDestinationId;
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const INTENT_DESTINATION_DEFINITIONS: Array<{
  id: IntentDestinationId;
  href: string;
  labelKey: string;
  defaultLabel: string;
  descriptionKey: string;
  defaultDescription: string;
  icon: LucideIcon;
}> = [
  {
    id: "urgent",
    href: "/first-24-hours",
    labelKey: "navigation.intents.urgent.label",
    defaultLabel: "Urgent help",
    descriptionKey: "navigation.intents.urgent.description",
    defaultDescription: "What to do after an arrest or before an urgent court deadline",
    icon: AlertTriangle,
  },
  {
    id: "roadmap",
    href: "/case-guidance",
    labelKey: "navigation.intents.roadmap.label",
    defaultLabel: "Case Roadmap",
    descriptionKey: "navigation.intents.roadmap.description",
    defaultDescription: "Get a plain-language plan for your charge, state, and case stage",
    icon: Route,
  },
  {
    id: "charges",
    href: "/case-guidance#understand-charges",
    labelKey: "navigation.intents.charges.label",
    defaultLabel: "Understand charges",
    descriptionKey: "navigation.intents.charges.description",
    defaultDescription: "Start with your charge and learn what it may mean",
    icon: Scale,
  },
  {
    id: "legalHelp",
    href: "/legal-aid",
    labelKey: "navigation.intents.legalHelp.label",
    defaultLabel: "Find a lawyer or resources",
    descriptionKey: "navigation.intents.legalHelp.description",
    defaultDescription: "Find public defenders, legal aid, courts, and support",
    icon: MapPin,
  },
  {
    id: "stage",
    href: "/case-timeline",
    labelKey: "navigation.intents.stage.label",
    defaultLabel: "Understand a case stage",
    descriptionKey: "navigation.intents.stage.description",
    defaultDescription: "See what happens from arrest through sentencing",
    icon: Clock3,
  },
  {
    id: "sources",
    href: "/data-sources",
    labelKey: "navigation.intents.sources.label",
    defaultLabel: "Verify sources",
    descriptionKey: "navigation.intents.sources.description",
    defaultDescription: "Check where the information comes from and its limitations",
    icon: BookOpenCheck,
  },
];

export function getIntentDestinations(t: TFunction): IntentDestination[] {
  return INTENT_DESTINATION_DEFINITIONS.map((destination) => ({
    id: destination.id,
    href: destination.href,
    label: t(destination.labelKey, destination.defaultLabel),
    description: t(destination.descriptionKey, destination.defaultDescription),
    icon: destination.icon,
  }));
}