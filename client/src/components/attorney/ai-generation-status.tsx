/**
 * AI Generation Status Component
 *
 * Displays progress indicator during AI document generation.
 */

import { motion } from "framer-motion";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIGenerationStatusProps {
  isGenerating: boolean;
  currentSection?: string;
  totalSections?: number;
  completedSections?: number;
  error?: string;
}

export function AIGenerationStatus({
  isGenerating,
  currentSection,
  totalSections = 0,
  completedSections = 0,
  error,
}: AIGenerationStatusProps) {
  const progress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
        <CardContent className="py-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="font-medium">Generation Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isGenerating && completedSections === totalSections && totalSections > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
          <CardContent className="py-6">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <p className="font-medium text-green-800 dark:text-green-200">
                  Document Generated Successfully
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Review the document below and download when ready
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
      <CardContent className="py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            {isGenerating && (
              <motion.div
                className="absolute -inset-2 border-2 border-blue-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          <div className="text-center w-full max-w-xs">
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Generating AI Content
            </p>
            {currentSection && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {currentSection}...
              </p>
            )}

            {totalSections > 0 && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  {completedSections} of {totalSections} sections complete
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GenerationStepsProps {
  steps: Array<{
    id: string;
    name: string;
    status: "pending" | "generating" | "complete" | "error";
  }>;
}

export function GenerationSteps({ steps }: GenerationStepsProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            step.status === "generating"
              ? "bg-blue-50 dark:bg-blue-950/30"
              : step.status === "complete"
              ? "bg-green-50 dark:bg-green-950/30"
              : step.status === "error"
              ? "bg-red-50 dark:bg-red-950/30"
              : "bg-slate-50 dark:bg-slate-900/50"
          }`}
        >
          <div className="flex-shrink-0">
            {step.status === "generating" ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : step.status === "complete" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : step.status === "error" ? (
              <span className="h-5 w-5 text-red-600">!</span>
            ) : (
              <span className="h-5 w-5 flex items-center justify-center text-slate-400 text-sm font-medium">
                {index + 1}
              </span>
            )}
          </div>
          <span
            className={`text-sm ${
              step.status === "generating"
                ? "text-blue-800 dark:text-blue-200 font-medium"
                : step.status === "complete"
                ? "text-green-800 dark:text-green-200"
                : step.status === "error"
                ? "text-red-800 dark:text-red-200"
                : "text-slate-500"
            }`}
          >
            {step.name}
          </span>
        </div>
      ))}
    </div>
  );
}
