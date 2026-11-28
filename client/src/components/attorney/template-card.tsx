import { Link } from "wouter";
import { Scale, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { DocumentTemplateSummary } from "@/lib/attorney-api";

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
      "motion-to-compel-discovery",
      "motion-to-suppress",
      "motion-in-limine",
      "motion-to-dismiss",
      "motion-to-sever",
      "motion-for-change-of-venue",
    ],
  },
  {
    id: "trial",
    label: "Trial Motions",
    description: "Motions filed during trial proceedings",
    templateIds: [
      "motion-for-judgment-of-acquittal",
      "motion-for-mistrial",
    ],
  },
  {
    id: "post-trial",
    label: "Post-Trial",
    description: "Motions filed after a verdict or conviction but before or after sentencing",
    templateIds: [
      "motion-for-new-trial",
      "motion-to-withdraw-plea",
    ],
  },
  {
    id: "post-sentencing",
    label: "Post-Sentencing",
    description: "Motions filed after sentencing to modify or reduce the sentence, or to challenge the conviction",
    templateIds: [
      "motion-for-sentence-modification",
      "motion-for-bail-pending-appeal",
      "habeas-corpus-petition",
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
    templateIds: ["motion-to-reopen-eoir", "motion-to-reconsider-eoir"],
  },
  {
    id: "defensive",
    label: "Defensive Motions",
    description: "Motions challenging the proceedings or seeking termination",
    templateIds: [
      "motion-to-terminate-eoir",
      "motion-to-suppress-immigration-eoir",
      "motion-for-voluntary-departure-eoir",
    ],
  },
  {
    id: "emergency-protective",
    label: "Emergency / Protective",
    description: "Urgent filings to prevent removal while appeals or motions are pending",
    templateIds: ["motion-for-stay-of-removal-eoir"],
  },
];

function TemplateRow({ template }: { template: DocumentTemplateSummary }) {
  return (
    <Link href={`/attorney/documents/${template.id}`} aria-label={`Draft ${template.name}`} className="attorney-template-row">
      <div>
        <h3>{template.name}</h3>
        <p>{template.description}</p>
      </div>
      <div className="attorney-template-meta">
        <span>{template.difficultyLevel.charAt(0).toUpperCase() + template.difficultyLevel.slice(1)}</span>
        <span>{template.estimatedCompletionTime}</span>
        <ChevronRight aria-hidden="true" size={18} />
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
    <Accordion type="multiple" defaultValue={defaultOpen} className="attorney-template-stages" lang="en">
      {populatedStages.map((stage) => (
        <AccordionItem
          key={stage.id}
          value={stage.id}
          className="attorney-template-stage"
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
            <p className="attorney-template-stage-description">
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
          className="attorney-template-stage"
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
