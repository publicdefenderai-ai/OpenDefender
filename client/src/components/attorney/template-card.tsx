import { Link } from "wouter";
import { Clock, Scale, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { DocumentTemplateSummary } from "@/lib/attorney-api";

const difficultyColors: Record<string, string> = {
  basic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface CaseStage {
  id: string;
  label: string;
  description: string;
  templateIds: string[];
}

const criminalStages: CaseStage[] = [
  {
    id: "early-case",
    label: "Early Case (Arrest \u2192 Arraignment)",
    description: "Motions typically filed immediately after arrest or at arraignment",
    templateIds: [
      "motion-for-pretrial-release",
      "motion-to-reduce-bail",
      "motion-to-continue",
    ],
  },
  {
    id: "pretrial",
    label: "Pre-Trial Motions",
    description: "Motions filed during the discovery and pre-trial phase",
    templateIds: [
      "motion-for-discovery",
      "motion-to-suppress",
      "motion-in-limine",
      "motion-to-dismiss",
    ],
  },
  {
    id: "post-plea",
    label: "Post-Plea Motions",
    description: "Motions filed after a guilty or no-contest plea has been entered",
    templateIds: [
      "motion-to-withdraw-plea",
    ],
  },
];

const immigrationStages: CaseStage[] = [
  {
    id: "initial-filings",
    label: "Initial Filings",
    description: "First documents filed when a case begins in immigration court",
    templateIds: ["notice-of-appearance", "nta-pleadings"],
  },
  {
    id: "pre-hearing",
    label: "Pre-Hearing Motions",
    description: "Motions filed before or between hearings",
    templateIds: [
      "motion-for-continuance-eoir",
      "bond-motion-eoir",
      "motion-to-change-venue-eoir",
    ],
  },
  {
    id: "post-decision",
    label: "Post-Decision",
    description: "Motions filed after an immigration judge\u2019s decision",
    templateIds: ["motion-to-reopen-eoir"],
  },
  {
    id: "defensive",
    label: "Defensive Motions",
    description: "Motions challenging the proceedings or seeking termination",
    templateIds: ["motion-to-terminate-eoir"],
  },
];

function TemplateRow({ template }: { template: DocumentTemplateSummary }) {
  return (
    <Link
      href={`/attorney/documents/${template.id}`}
      aria-label={`Draft ${template.name}`}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
              {template.name}
            </span>
            <Badge
              variant="outline"
              className={`text-xs px-1.5 py-0 ${difficultyColors[template.difficultyLevel] || ""}`}
            >
              {template.difficultyLevel.charAt(0).toUpperCase() +
                template.difficultyLevel.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {template.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {template.estimatedCompletionTime}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}

interface StagedTemplateListProps {
  templates: DocumentTemplateSummary[];
  category: "criminal" | "immigration";
}

export function StagedTemplateList({
  templates,
  category,
}: StagedTemplateListProps) {
  if (templates.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Scale className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-muted-foreground">
            No templates available in this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  const stages = category === "criminal" ? criminalStages : immigrationStages;
  const templateMap = new Map(templates.map((t) => [t.id, t]));

  const populatedStages = stages
    .map((stage) => ({
      ...stage,
      templates: stage.templateIds
        .map((id) => templateMap.get(id))
        .filter((t): t is DocumentTemplateSummary => !!t),
    }))
    .filter((stage) => stage.templates.length > 0);

  const stagedIds = new Set(stages.flatMap((s) => s.templateIds));
  const uncategorized = templates.filter((t) => !stagedIds.has(t.id));

  const defaultOpen = populatedStages.map((s) => s.id);

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-2">
      {populatedStages.map((stage) => (
        <AccordionItem
          key={stage.id}
          value={stage.id}
          className="border rounded-lg px-2 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-3 gap-3">
            <div className="flex items-center gap-3 text-left">
              <span className="font-semibold text-base">{stage.label}</span>
              <Badge variant="secondary" className="text-xs font-normal">
                {stage.templates.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2 pt-0">
            <p className="text-xs text-muted-foreground mb-2 px-4">
              {stage.description}
            </p>
            <div className="space-y-0.5">
              {stage.templates.map((template) => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}

      {uncategorized.length > 0 && (
        <AccordionItem
          value="other"
          className="border rounded-lg px-2 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-3 gap-3">
            <div className="flex items-center gap-3 text-left">
              <span className="font-semibold text-base">Other</span>
              <Badge variant="secondary" className="text-xs font-normal">
                {uncategorized.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2 pt-0">
            <div className="space-y-0.5">
              {uncategorized.map((template) => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

export { TemplateRow };
