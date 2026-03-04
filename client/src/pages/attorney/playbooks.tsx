import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Scale, Landmark, LogOut, Clock, Loader2, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationGuard } from "@/components/attorney/verification-guard";
import { SessionTimer } from "@/components/attorney/session-timer";
import { useAttorneySession } from "@/hooks/use-attorney-session";
import type { PlaybookSummary } from "@shared/playbooks/schema";

// ─── Phase definitions ────────────────────────────────────────────────────────

interface Phase {
  id: string;
  label: string;
  description: string;
  ids: string[];
}

const CRIMINAL_PHASES: Phase[] = [
  {
    id: "arrest",
    label: "Arrest & Initial Proceedings",
    description: "First court appearances, bail setting, and early case strategy",
    ids: ["arraignment", "bail-bond"],
  },
  {
    id: "misdemeanor",
    label: "Misdemeanor Cases",
    description: "Lower-level offenses, traffic matters, and minor criminal charges",
    ids: ["fare-evasion", "disorderly-conduct", "reckless-driving-dwls", "theft-shoplifting", "misdemeanor-dv"],
  },
  {
    id: "drug-dui",
    label: "Drug & DUI Cases",
    description: "Controlled substance charges, impaired driving, and diversion pathways",
    ids: ["drug-possession", "drug-distribution", "dui-dwi"],
  },
  {
    id: "felony",
    label: "Felony Cases",
    description: "Serious violent and weapons charges requiring intensive defense preparation",
    ids: ["felony-assault", "weapons-firearms", "resisting-obstruction"],
  },
  {
    id: "post",
    label: "Sentencing, Supervision & Post-Conviction",
    description: "Sentencing advocacy, probation violations, and post-conviction relief",
    ids: ["sentencing-mitigation", "probation-violations", "post-conviction-relief"],
  },
];

const IMMIGRATION_PHASES: Phase[] = [
  {
    id: "detention",
    label: "Detention & Enforcement",
    description: "ICE detention, emergency bond hearings, and workplace enforcement responses",
    ids: ["ice-detention-bond", "workplace-raid"],
  },
  {
    id: "proceedings",
    label: "Removal Proceedings",
    description: "Immigration court hearings, master calendar, and expedited removal challenges",
    ids: ["master-calendar", "expedited-removal"],
  },
  {
    id: "asylum",
    label: "Asylum & Protection Claims",
    description: "Defensive asylum applications, withholding of removal, and CAT protection",
    ids: ["defensive-asylum", "withholding-cat"],
  },
  {
    id: "relief",
    label: "Relief & Status Applications",
    description: "Cancellation, adjustment of status, DACA/TPS, and victim-based forms of relief",
    ids: ["cancellation-of-removal", "adjustment-of-status", "daca-tps-lapse", "u-visa-t-visa", "vawa-self-petition"],
  },
  {
    id: "appeals",
    label: "Post-Order & Appeals",
    description: "Motions to reopen or reconsider, and appellate strategy after a final order",
    ids: ["motion-to-reopen"],
  },
];

// ─── Difficulty styling ───────────────────────────────────────────────────────

const difficultyDot: Record<string, string> = {
  basic: "bg-green-500",
  intermediate: "bg-amber-500",
  advanced: "bg-red-500",
};

const difficultyLabel: Record<string, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// ─── Playbook row ─────────────────────────────────────────────────────────────

function PlaybookRow({ playbook }: { playbook: PlaybookSummary }) {
  return (
    <Link href={`/attorney/playbooks/${playbook.id}`}>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer group">
        {/* Difficulty dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${difficultyDot[playbook.difficultyLevel]}`}
          title={difficultyLabel[playbook.difficultyLevel]}
        />

        {/* Name + tagline */}
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            {playbook.name}
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
            — {playbook.tagline}
          </span>
        </div>

        {/* Timeline + chevron */}
        <div className="flex items-center gap-2 shrink-0 text-muted-foreground">
          <span className="text-xs hidden md:block">{playbook.typicalTimeline}</span>
          <ChevronRight className="h-4 w-4 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

// ─── Phase section ────────────────────────────────────────────────────────────

function PhaseSection({ phase, playbooks }: { phase: Phase; playbooks: PlaybookSummary[] }) {
  const phasePlaybooks = phase.ids
    .map((id) => playbooks.find((p) => p.id === id))
    .filter(Boolean) as PlaybookSummary[];

  if (phasePlaybooks.length === 0) return null;

  return (
    <div>
      {/* Phase header */}
      <div className="flex items-baseline gap-2 mb-2 px-1">
        <h3 className="text-sm font-semibold text-foreground">{phase.label}</h3>
        <span className="text-xs text-muted-foreground hidden sm:inline">— {phase.description}</span>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">
          {phasePlaybooks.length} {phasePlaybooks.length === 1 ? "playbook" : "playbooks"}
        </span>
      </div>

      {/* Playbook rows */}
      <div className="border rounded-lg divide-y overflow-hidden bg-card">
        {phasePlaybooks.map((playbook) => (
          <PlaybookRow key={playbook.id} playbook={playbook} />
        ))}
      </div>
    </div>
  );
}

// ─── Category view ────────────────────────────────────────────────────────────

async function fetchPlaybooks(category: string): Promise<PlaybookSummary[]> {
  const res = await fetch(`/api/attorney/playbooks?category=${category}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to load playbooks");
  return data.playbooks;
}

interface CategoryPlaybooksProps {
  category: "criminal" | "immigration";
}

function CategoryPlaybooks({ category }: CategoryPlaybooksProps) {
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchPlaybooks(category)
      .then(setPlaybooks)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [category]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 text-green-600 animate-spin mr-3" />
          <p className="text-muted-foreground text-sm">Loading playbooks...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex items-center justify-center py-12 text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const phases = category === "criminal" ? CRIMINAL_PHASES : IMMIGRATION_PHASES;

  return (
    <div className="space-y-6">
      {/* Difficulty legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
        <span className="font-medium text-foreground">Difficulty:</span>
        {Object.entries(difficultyLabel).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${difficultyDot[key]}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Phase sections */}
      {phases.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} playbooks={playbooks} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PlaybooksContent() {
  useScrollToTop();
  const { t } = useTranslation();
  const { endSession } = useAttorneySession();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionTimer />

      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-slate-50 to-green-50 dark:from-green-950/20 dark:via-slate-950 dark:to-green-950/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-5">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
              {t("attorneyPortal.playbooks.title", "Case Playbooks")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              {t(
                "attorneyPortal.playbooks.subtitle",
                "Stage-by-stage strategic roadmaps for criminal and immigration defense."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 md:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="criminal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto">
              <TabsTrigger value="criminal" className="gap-2">
                <Scale className="h-4 w-4" />
                {t("attorney.playbooks.criminal", "Criminal")}
              </TabsTrigger>
              <TabsTrigger value="immigration" className="gap-2">
                <Landmark className="h-4 w-4" />
                {t("attorney.playbooks.immigration", "Immigration")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="criminal">
              <CategoryPlaybooks category="criminal" />
            </TabsContent>

            <TabsContent value="immigration">
              <CategoryPlaybooks category="immigration" />
            </TabsContent>
          </Tabs>

          {/* Footer controls */}
          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {t(
                  "attorney.documents.sessionNote",
                  "Your session will automatically end after 30 minutes of inactivity."
                )}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={endSession}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("attorneyPortal.documents.endSession", "End Session")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function AttorneyPlaybooks() {
  return (
    <VerificationGuard>
      <PlaybooksContent />
    </VerificationGuard>
  );
}
