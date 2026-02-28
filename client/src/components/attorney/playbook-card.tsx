import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlaybookSummary } from "@shared/playbooks/schema";

interface PlaybookCardProps {
  playbook: PlaybookSummary;
}

const difficultyColors = {
  basic: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

const difficultyLabels = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function PlaybookCard({ playbook }: PlaybookCardProps) {
  return (
    <Link href={`/attorney/playbooks/${playbook.id}`}>
      <Card className="border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${difficultyColors[playbook.difficultyLevel]} shrink-0`}>
              {difficultyLabels[playbook.difficultyLevel]}
            </span>
          </div>
          <CardTitle className="text-base leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            {playbook.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-snug">{playbook.tagline}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">{playbook.typicalTimeline}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
