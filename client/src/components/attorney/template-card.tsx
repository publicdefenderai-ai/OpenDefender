/**
 * Template Card Component
 *
 * Displays a document template card for selection in the attorney documents page.
 */

import { Link } from "wouter";
import { Clock, ArrowRight, Scale } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocumentTemplateSummary } from "@/lib/attorney-api";

interface TemplateCardProps {
  template: DocumentTemplateSummary;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const difficultyColors: Record<string, string> = {
    basic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{template.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={difficultyColors[template.difficultyLevel] || ""}
            >
              {template.difficultyLevel.charAt(0).toUpperCase() +
                template.difficultyLevel.slice(1)}
            </Badge>
            {template.supportedJurisdictions.length > 0 && (
              <Badge variant="secondary">
                {template.supportedJurisdictions.includes("EOIR")
                  ? "Immigration (EOIR)"
                  : "All 50 States + DC"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{template.estimatedCompletionTime}</span>
        </div>
        <Link href={`/attorney/documents/${template.id}`}>
          <Button size="sm" className="gap-1">
            Start
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface TemplateGridProps {
  templates: DocumentTemplateSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function TemplateGrid({ templates, isLoading, emptyMessage }: TemplateGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="h-48 animate-pulse">
            <CardContent className="flex items-center justify-center h-full">
              <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Scale className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-muted-foreground">
            {emptyMessage || "No templates available in this category."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
