import { Link } from "wouter";
import { ArrowRight, Clock, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <CardTitle className="text-base leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
              {playbook.name}
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-muted-foreground leading-snug">{playbook.tagline}</p>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[playbook.difficultyLevel]}`}>
              <BarChart2 className="h-3 w-3" />
              {difficultyLabels[playbook.difficultyLevel]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" />
              {playbook.typicalTimeline}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {playbook.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {playbook.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{playbook.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
