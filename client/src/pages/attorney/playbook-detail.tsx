import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BarChart2,
  AlertTriangle,
  ChevronDown,
  FileText,
  Globe,
  Loader2,
  LogOut,
  User,
  Scale,
  Landmark,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationGuard } from "@/components/attorney/verification-guard";
import { SessionTimer } from "@/components/attorney/session-timer";
import { useAttorneySession } from "@/hooks/use-attorney-session";
import type { Playbook, KeyAction } from "@shared/playbooks/schema";

async function fetchPlaybook(id: string): Promise<Playbook> {
  const res = await fetch(`/api/attorney/playbooks/${id}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Playbook not found");
  return data.playbook;
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

const actionPriorityStyles: Record<KeyAction["priority"], string> = {
  critical: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-3 py-1",
  high: "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 pl-3 py-1",
  standard: "border-l-4 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 pl-3 py-1",
};

const actionPriorityBadge: Record<KeyAction["priority"], string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  standard: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const actionTypeIcon: Record<KeyAction["type"], React.ReactNode> = {
  attorney: <Scale className="h-3 w-3" />,
  client: <User className="h-3 w-3" />,
  court: <Landmark className="h-3 w-3" />,
};

function PlaybookDetailContent() {
  useScrollToTop();
  const { t } = useTranslation();
  const { endSession } = useAttorneySession();
  const params = useParams<{ playbookId: string }>();
  const playbookId = params.playbookId;

  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playbookId) return;
    setIsLoading(true);
    setError(null);
    fetchPlaybook(playbookId)
      .then(setPlaybook)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [playbookId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SessionTimer />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !playbook) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SessionTimer />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-red-600 mb-4">{error || "Playbook not found"}</p>
          <Link href="/attorney/playbooks">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("attorney.playbooks.back", "Back to Playbooks")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionTimer />

      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-slate-50 to-green-50 dark:from-green-950/20 dark:via-slate-950 dark:to-green-950/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/attorney/playbooks">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("attorney.playbooks.back", "Back to Playbooks")}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[playbook.difficultyLevel]}`}
              >
                <BarChart2 className="h-3 w-3" />
                {difficultyLabels[playbook.difficultyLevel]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                {t("attorney.playbooks.timeline", "Typical Timeline")}: {playbook.typicalTimeline}
              </span>
              <Badge variant="secondary" className="capitalize">
                {playbook.category}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{playbook.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{playbook.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{playbook.overview}</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {playbook.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Key Considerations */}
          {playbook.keyConsiderations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="h-5 w-5" />
                    {t("attorney.playbooks.keyConsiderations", "Key Considerations")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {playbook.keyConsiderations.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                        <span className="font-bold shrink-0 mt-0.5">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stages */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {t("attorney.playbooks.stage", "Stages")}
            </h2>
            <Accordion type="multiple" defaultValue={[playbook.stages[0]?.id]} className="space-y-3">
              {playbook.stages.map((stage, stageIndex) => (
                <AccordionItem
                  key={stage.id}
                  value={stage.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-900/50 [&[data-state=open]]:bg-slate-50 dark:[&[data-state=open]]:bg-slate-900/50">
                    <div className="flex items-center gap-3 text-left">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-bold shrink-0">
                        {stageIndex + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">{stage.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{stage.timeline}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="pt-2 space-y-5">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{stage.description}</p>

                      {/* Key Actions */}
                      {stage.keyActions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            {t("attorney.playbooks.actions", "Key Actions")}
                          </h4>
                          <ul className="space-y-2">
                            {stage.keyActions.map((action, i) => (
                              <li key={i} className={`rounded text-sm ${actionPriorityStyles[action.priority]}`}>
                                <div className="flex items-start gap-2">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${actionPriorityBadge[action.priority]}`}>
                                    {actionTypeIcon[action.type]}
                                    {action.priority}
                                  </span>
                                  <span className="flex-1">{action.text}</span>
                                </div>
                                {action.deadline && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 ml-0.5">
                                    <Clock className="h-3 w-3" />
                                    {action.deadline}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Relevant Templates */}
                      {stage.relevantTemplates.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-blue-600" />
                            {t("attorney.playbooks.templates", "Relevant Templates")}
                          </h4>
                          <div className="space-y-2">
                            {stage.relevantTemplates.map((ref) => (
                              <div
                                key={ref.templateId}
                                className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-3"
                              >
                                <FileText className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-blue-900 dark:text-blue-100">{ref.name}</div>
                                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">{ref.relevance}</div>
                                </div>
                                <Link href={`/attorney/documents/${ref.templateId}`}>
                                  <Button size="sm" variant="outline" className="shrink-0 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50">
                                    {t("attorney.playbooks.openTemplate", "Open Template")}
                                  </Button>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Client Guidance */}
                      {stage.clientGuidance && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                          <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <User className="h-4 w-4" />
                            {t("attorney.playbooks.clientGuidance", "Client Guidance")}
                          </h4>
                          <p className="text-sm text-muted-foreground italic">{stage.clientGuidance}</p>
                        </div>
                      )}

                      {/* Pitfalls */}
                      {stage.pitfalls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-red-700 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4" />
                            {t("attorney.playbooks.pitfalls", "Common Pitfalls")}
                          </h4>
                          <ul className="space-y-1.5">
                            {stage.pitfalls.map((pitfall, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                                <span className="shrink-0 mt-0.5">⚠️</span>
                                <span>{pitfall}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stage Jurisdiction Variations */}
                      {stage.jurisdictionVariations && stage.jurisdictionVariations.length > 0 && (
                        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 rounded-lg p-3">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-purple-800 dark:text-purple-200">
                            <Globe className="h-4 w-4" />
                            State Variations
                          </h4>
                          <ul className="space-y-2">
                            {stage.jurisdictionVariations.map((v, i) => (
                              <li key={i} className="text-sm">
                                <span className="font-medium text-purple-700 dark:text-purple-300">
                                  {v.states.join(", ")}:
                                </span>{" "}
                                <span className="text-purple-700 dark:text-purple-300">{v.note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Jurisdiction Notes */}
          {playbook.jurisdictionNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                {t("attorney.playbooks.jurisdictionNotes", "Jurisdiction Notes")}
              </h2>
              <div className="space-y-4">
                {playbook.jurisdictionNotes.map((note, i) => (
                  <Card key={i} className="border-purple-100 dark:border-purple-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-purple-800 dark:text-purple-200">{note.topic}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {note.variations.map((v, j) => (
                          <li key={j} className="text-sm">
                            <span className="inline-flex flex-wrap gap-1 mb-1">
                              {v.states.map((s) => (
                                <Badge key={s} variant="secondary" className="text-xs font-mono">
                                  {s}
                                </Badge>
                              ))}
                            </span>
                            <p className="text-muted-foreground mt-1">{v.note}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer Controls */}
          <div className="pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/attorney/playbooks">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("attorney.playbooks.back", "Back to Playbooks")}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={endSession}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("attorneyPortal.documents.endSession", "End Session")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PlaybookDetail() {
  return (
    <VerificationGuard>
      <PlaybookDetailContent />
    </VerificationGuard>
  );
}
