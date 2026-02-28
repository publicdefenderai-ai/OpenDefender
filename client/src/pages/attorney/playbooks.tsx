import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Scale, Landmark, LogOut, Clock, Loader2 } from "lucide-react";
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
import { PlaybookCard } from "@/components/attorney/playbook-card";
import type { PlaybookSummary } from "@shared/playbooks/schema";

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
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading playbooks...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playbooks.map((playbook) => (
        <PlaybookCard key={playbook.id} playbook={playbook} />
      ))}
    </div>
  );
}

function PlaybooksContent() {
  useScrollToTop();
  const { t } = useTranslation();
  const { endSession } = useAttorneySession();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionTimer />

      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-slate-50 to-green-50 dark:from-green-950/20 dark:via-slate-950 dark:to-green-950/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              {t("attorneyPortal.playbooks.title", "Case Playbooks")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "attorneyPortal.playbooks.subtitle",
                "Stage-by-stage strategic roadmaps for criminal and immigration defense."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="criminal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
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

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {t(
                    "attorney.documents.sessionNote",
                    "Your session will automatically end after 30 minutes of inactivity."
                  )}
                </span>
              </div>
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

export default function AttorneyPlaybooks() {
  return (
    <VerificationGuard>
      <PlaybooksContent />
    </VerificationGuard>
  );
}
